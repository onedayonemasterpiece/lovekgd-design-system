#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

export const SCHEMA = 'kenigevents.resolved-render-case.v1';
const INPUTS = 'catalog/ui-conformance/free-collection/g4/resolved-case-inputs.json';
const CASES = 'catalog/ui-conformance/free-collection/g4/cases';
const OUTPUT = 'catalog/ui-conformance/free-collection/g4/resolved';

export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  return value;
}
export const canonicalJson = (value) => `${JSON.stringify(canonicalize(value))}\n`;
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const parseJson = (bytes, label) => {
  try { return JSON.parse(bytes); } catch { throw new Error(`INVALID_JSON:${label}`); }
};
const assert = (condition, code) => { if (!condition) throw new Error(code); };

function pointer(document, value) {
  return value.slice(1).split('/').reduce((node, token) => node?.[token.replaceAll('~1', '/').replaceAll('~0', '~')], document);
}
function cssBlock(source, selector) {
  const start = source.indexOf(`${selector} {`);
  assert(start >= 0, `MISSING_GEOMETRY_SELECTOR:${selector}`);
  const open = source.indexOf('{', start);
  const close = source.indexOf('}', open);
  assert(close > open, `INVALID_GEOMETRY_SELECTOR:${selector}`);
  const raw = source.slice(open + 1, close).trim().replace(/\s+/gu, ' ');
  const declarations = Object.fromEntries(raw.split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
    const at = part.indexOf(':');
    assert(at > 0, `INVALID_CSS_DECLARATION:${selector}`);
    return [part.slice(0, at).trim(), part.slice(at + 1).trim()];
  }));
  return { selector, declarations, normalized_block_sha256: sha256(`${raw}\n`) };
}
function caseHash(document) {
  return sha256(canonicalJson({ ...document, content_sha256: null }));
}
export function validateResolvedCase(document) {
  assert(document?.schema === SCHEMA, 'RESOLVED_CASE_SCHEMA_MISMATCH');
  assert(document.control_generation === 4, 'RESOLVED_CASE_GENERATION_MISMATCH');
  assert(/^[a-f0-9]{64}$/.test(document.content_sha256 || ''), 'RESOLVED_CASE_HASH_MISSING');
  assert(caseHash(document) === document.content_sha256, 'RESOLVED_CASE_HASH_MISMATCH');
  return document;
}
async function readChecked(root, binding) {
  const bytes = await readFile(path.join(root, binding.path));
  assert(sha256(bytes) === binding.sha256, `SOURCE_HASH_MISMATCH:${binding.path}`);
  return bytes;
}
function readAstro(astroRoot, ref, binding) {
  const bytes = execFileSync('git', ['-C', astroRoot, 'show', `${ref}:${binding.path}`]);
  assert(sha256(bytes) === binding.sha256, `ASTRO_SOURCE_HASH_MISMATCH:${binding.path}`);
  const blob = execFileSync('git', ['-C', astroRoot, 'rev-parse', `${ref}:${binding.path}`], { encoding: 'utf8' }).trim();
  assert(blob === binding.git_blob_sha1, `ASTRO_BLOB_MISMATCH:${binding.path}`);
  return bytes;
}

export async function generate({ root, astroRoot, check = false }) {
  const inputs = parseJson(await readFile(path.join(root, INPUTS)), INPUTS);
  assert(inputs.control_generation === 4, 'INPUT_GENERATION_MISMATCH');
  const designBytes = new Map();
  for (const binding of inputs.design_sources) designBytes.set(binding.path, await readChecked(root, binding));
  const json = (relative) => parseJson(designBytes.get(relative), relative);
  const corpusPath = 'catalog/fixtures/ui-reference-events/v2/corpus.json';
  const projectionPath = 'catalog/fixtures/ui-reference-events/v2/projections/free-collection-september.v1.json';
  const assetsPath = 'catalog/fixtures/ui-reference-events/v2/assets-manifest.json';
  const desktopPath = 'catalog/fixtures/design-system-reference/v2/scenarios/archetype.collections.free.september.desktop-ready.v3.json';
  const mobilePath = 'catalog/fixtures/design-system-reference/v2/scenarios/archetype.collections.free.september.mobile-ready.v3.json';
  const componentPath = 'catalog/ui-components/event-card-large/component-contract.v2.json';
  const rowsPath = 'catalog/ui-components/event-card-container/packed-rows.v1.json';
  const corpus = json(corpusPath);
  const corpusDigest = sha256(canonicalJson(Object.fromEntries(Object.entries(corpus).filter(([key]) => key !== 'corpus_sha256'))));
  assert(corpusDigest === corpus.corpus_sha256, 'CORPUS_CANONICAL_HASH_MISMATCH');
  const projection = json(projectionPath);
  assert(projection.corpus_id === corpus.corpus_id, 'PROJECTION_CORPUS_MISMATCH');
  const expectedOrder = [...projection.expected_groups.events, ...projection.expected_groups.exhibitions];
  assert(expectedOrder.join(',') === 'event.real.8006,event.real.8200,event.real.2182,event.real.6711,event.real.7609', 'FIXTURE_ORDER_MISMATCH');
  const scenarios = { desktop: json(desktopPath), mobile: json(mobilePath) };
  for (const scenario of Object.values(scenarios)) assert(scenario.expected_render_order.join(',') === expectedOrder.join(','), `SCENARIO_ORDER_MISMATCH:${scenario.scenario_id}`);
  const fixtureById = new Map();
  for (const fixtureId of expectedOrder) {
    const entry = corpus.fixtures.find((item) => item.fixture_id === fixtureId);
    assert(entry, `CORPUS_FIXTURE_MISSING:${fixtureId}`);
    const payloadPath = path.posix.join(path.posix.dirname(corpusPath), entry.payload_path);
    const payload = json(payloadPath);
    assert(payload.preview_event_sha256 === entry.preview_event_sha256, `FIXTURE_BINDING_MISMATCH:${fixtureId}`);
    fixtureById.set(fixtureId, payload);
  }
  const assetManifest = json(assetsPath);
  const assetByFixture = Object.fromEntries(expectedOrder.map((id) => [id, assetManifest.assets.filter((item) => item.fixture_id === id)]));
  for (const id of expectedOrder) assert(assetByFixture[id].length > 0, `FIXTURE_ASSET_MISSING:${id}`);
  const astroBytes = new Map(inputs.astro_sources.map((binding) => [binding.path, readAstro(astroRoot, inputs.astro_ref, binding)]));
  const geometry = inputs.geometry_selectors.map((entry) => ({
    source: entry.source,
    source_sha256: inputs.astro_sources.find((item) => item.path === entry.source).sha256,
    ...cssBlock(astroBytes.get(entry.source).toString('utf8'), entry.selector),
  }));
  const uiAssets = inputs.ui_asset_paths.map((assetPath) => {
    const binding = inputs.design_sources.find((item) => item.path === assetPath);
    return { path: assetPath, sha256: binding.sha256, bytes: designBytes.get(assetPath).length };
  });
  const caseFiles = (await readdir(path.join(root, CASES))).filter((name) => name.endsWith('.case.json')).sort();
  const outputs = [];
  await mkdir(path.join(root, OUTPUT), { recursive: true });
  for (const filename of caseFiles) {
    const specPath = path.posix.join(CASES, filename);
    const spec = parseJson(await readFile(path.join(root, specPath)), specPath);
    assert(spec.schema === 'kenigevents.ui-conformance-case.v1' && spec.control_generation === 4, `CASE_SCHEMA_MISMATCH:${spec.case_id}`);
    const scenario = scenarios[spec.viewport];
    assert(scenario && scenario.scenario_id.includes(spec.viewport), `CASE_SCENARIO_MISMATCH:${spec.case_id}`);
    let fixtureIds = expectedOrder;
    let state = null;
    if (spec.case_kind === 'eventcard') {
      const [, fragment] = spec.fixture_ref.split('#');
      const fixtureId = pointer(projection, fragment);
      assert(typeof fixtureId === 'string', `CASE_FIXTURE_REF_INVALID:${spec.case_id}`);
      fixtureIds = [fixtureId];
    } else {
      const stateIndex = Number(spec.state_ref.split('/').at(-1));
      state = ['top', 'scrolled', 'full'][stateIndex];
      assert(state && spec.case_id.endsWith(state), `CASE_STATE_REF_INVALID:${spec.case_id}`);
    }
    const fixtures = fixtureIds.map((id) => fixtureById.get(id));
    const crop = Object.fromEntries(fixtures.map((item) => {
      const event = item.preview_event;
      const media = event.image_assets?.[0] || {};
      return [item.fixture_id, {
        recommended_fit: media.recommended_hero_fit || null,
        safe_crop: media.safe_crop ?? null,
        focal_point: event.focal_point || null,
        source_width: media.width || null,
        source_height: media.height || null,
        image_text_mode: media.image_text_mode || event.image_text_mode || null,
        media_role: media.media_role || event.image_media_role || null,
      }];
    }));
    const document = {
      schema: SCHEMA,
      case_id: spec.case_id,
      control_generation: 4,
      authority: {
        input_bindings: {
          corpus: inputs.design_sources.find((item) => item.path === corpusPath),
          projection: inputs.design_sources.find((item) => item.path === projectionPath),
          scenario: inputs.design_sources.find((item) => item.path === spec.scenario_ref),
          asset_manifest: inputs.design_sources.find((item) => item.path === assetsPath),
          component_contract: inputs.design_sources.find((item) => item.path === componentPath),
          packed_rows: inputs.design_sources.find((item) => item.path === rowsPath),
          astro_ref: inputs.astro_ref,
          astro_sources: inputs.astro_sources,
        },
        generator: 'scripts/ui_conformance/generate-free-collection-resolved-cases.mjs',
      },
      payload: {
        case_kind: spec.case_kind,
        structural_context: spec.structural_context || null,
        state,
        scenario: { scenario_id: scenario.scenario_id, viewport: scenario.viewport, review_states: scenario.acceptance.review_states },
        fixture_order: fixtureIds,
        groups: projection.expected_groups,
        fixtures,
        assets: { fixture_media: Object.fromEntries(fixtureIds.map((id) => [id, assetByFixture[id]])), ui: uiAssets },
        geometry: {
          source_bound_css: geometry,
          component_contract: json(componentPath).semantic_layout_contracts,
          packed_rows: json(rowsPath).row_contract,
        },
        crop,
      },
      content_sha256: null,
    };
    document.content_sha256 = caseHash(document);
    validateResolvedCase(document);
    const outputPath = path.posix.join(OUTPUT, `${spec.case_id}.resolved-render-case.json`);
    const bytes = `${JSON.stringify(document, null, 2)}\n`;
    if (check) {
      const current = await readFile(path.join(root, outputPath), 'utf8');
      assert(current === bytes, `RESOLVED_CASE_DRIFT:${spec.case_id}`);
    } else await writeFile(path.join(root, outputPath), bytes);
    outputs.push({ case_id: spec.case_id, case_path: specPath, resolved_case_path: outputPath, content_sha256: document.content_sha256, file_sha256: sha256(bytes) });
  }
  const geometryProof = {
    schema: 'kenigevents.source-bound-geometry-proof.v1',
    control_generation: 4,
    astro_repository: inputs.astro_repository,
    astro_ref: inputs.astro_ref,
    status: 'SOURCE_BOUND_CANDIDATE_NOT_PENPOT_VALIDATED',
    selectors: geometry,
    content_sha256: null,
  };
  geometryProof.content_sha256 = sha256(canonicalJson({ ...geometryProof, content_sha256: null }));
  const geometryBytes = `${JSON.stringify(geometryProof, null, 2)}\n`;
  const geometryPath = path.posix.join(OUTPUT, 'geometry-proof.json');
  if (check) assert(await readFile(path.join(root, geometryPath), 'utf8') === geometryBytes, 'GEOMETRY_PROOF_DRIFT');
  else await writeFile(path.join(root, geometryPath), geometryBytes);
  const index = {
    schema: 'kenigevents.resolved-render-case-index.v1',
    control_generation: 4,
    generator: 'scripts/ui_conformance/generate-free-collection-resolved-cases.mjs',
    input_manifest: INPUTS,
    astro_ref: inputs.astro_ref,
    geometry_proof: { path: geometryPath, content_sha256: geometryProof.content_sha256, file_sha256: sha256(geometryBytes) },
    cases: outputs,
    content_sha256: null,
  };
  index.content_sha256 = sha256(canonicalJson({ ...index, content_sha256: null }));
  const indexBytes = `${JSON.stringify(index, null, 2)}\n`;
  const indexPath = path.posix.join(OUTPUT, 'resolved-cases.index.json');
  if (check) assert(await readFile(path.join(root, indexPath), 'utf8') === indexBytes, 'RESOLVED_INDEX_DRIFT');
  else await writeFile(path.join(root, indexPath), indexBytes);
  return index;
}

function parseArgs(argv) {
  const result = { root: process.cwd(), astroRoot: process.env.EVENTS_BOT_REPO || '/home/dev/projects/events-bot-new', check: false };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--root') result.root = path.resolve(argv[++i]);
    else if (argv[i] === '--astro-root') result.astroRoot = path.resolve(argv[++i]);
    else if (argv[i] === '--check') result.check = true;
    else throw new Error(`UNKNOWN_ARGUMENT:${argv[i]}`);
  }
  return result;
}
if (import.meta.url === `file://${process.argv[1]}`) {
  generate(parseArgs(process.argv)).then((index) => {
    process.stdout.write(`${index.cases.length} resolved cases; index=${index.content_sha256}\n`);
  }).catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}

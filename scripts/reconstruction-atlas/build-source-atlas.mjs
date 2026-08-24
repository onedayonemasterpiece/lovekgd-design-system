import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { archetypes, excludedProductGaps, schemaVersion, viewports } from './reconstruction-atlas.config.mjs';

const designRoot = resolve(new URL('../..', import.meta.url).pathname);
const eventsRoot = resolve(process.env.EVENTS_BOT_ROOT || '/home/dev/.codex/worktrees/events-bot-new/event-card-semantic-closure-int');
const outputRoot = join(designRoot, 'catalog/reconstruction-atlas/v1');
const generatedAt = new Date().toISOString();

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const stable = (value) => JSON.stringify(value, Object.keys(value).sort());
const unique = (values) => [...new Set(values)].sort();
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

async function ensureParent(path) {
  await mkdir(dirname(path), { recursive: true });
}

async function writeJson(path, value) {
  await ensureParent(path);
  await writeFile(path, json(value));
}

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const path = join(dir, name);
    const info = await stat(path);
    if (info.isDirectory()) out.push(...await walk(path));
    else out.push(path);
  }
  return out;
}

function sourceFacts(source) {
  const importNames = [];
  const imports = [];
  for (const match of source.matchAll(/import\s+([^;'\n]+?)\s+from\s+['"]([^'"]+)['"]/gu)) {
    const binding = match[1].trim();
    imports.push(match[2]);
    const first = binding.match(/^([A-Z][A-Za-z0-9_]*)/u)?.[1];
    if (first) importNames.push(first);
  }
  return {
    imports: unique(imports),
    imported_component_symbols: unique(importNames.filter((name) => new RegExp(`<${name}(?:\\s|/|>)`, 'u').test(source))),
    data_attributes: unique([...source.matchAll(/\b(data-[a-z0-9_:-]+)/giu)].map((m) => m[1])),
    aria_attributes: unique([...source.matchAll(/\b(aria-[a-z0-9_-]+)/giu)].map((m) => m[1])),
    semantic_component_markers: unique([...source.matchAll(/data-ds-component=["'{]+([^"'}\s>]+)/gu)].map((m) => m[1])),
    media_queries: unique([...source.matchAll(/@media\s*\(([^)]+)\)/gu)].map((m) => m[1].trim())),
    css_custom_properties: unique([...source.matchAll(/(--[a-z0-9_-]+)\s*:/giu)].map((m) => m[1])),
    has_static_paths: /export\s+function\s+getStaticPaths/u.test(source),
    has_redirect: /Astro\.redirect/u.test(source),
    source_condition_tokens: unique([...source.matchAll(/\b(?:loading|error|empty|retry|stale|hidden|selected|active|authenticated|anonymous|archived|disabled|expanded|pressed|unread|locked|checking|complete(?:d)?)\b/giu)].map((m) => m[0].toLowerCase())),
  };
}

const sourceFiles = unique(archetypes.flatMap((item) => item.source_files));
const sourceEvidence = {};
for (const sourcePath of sourceFiles) {
  const absolute = join(eventsRoot, sourcePath);
  const source = await readFile(absolute, 'utf8');
  sourceEvidence[sourcePath] = {
    sha256: sha256(source),
    bytes: Buffer.byteLength(source),
    ...sourceFacts(source),
  };
}

const pageRoot = join(eventsRoot, 'site/src/pages');
const allAstroPages = (await walk(pageRoot))
  .filter((path) => path.endsWith('.astro'))
  .map((path) => relative(eventsRoot, path).replaceAll('\\', '/'))
  .sort();
const productionAstroPages = allAstroPages.filter((path) => !path.includes('/lab/') && path !== 'site/src/pages/[preview]/index.astro');
const mappedSourceSet = new Set(sourceFiles);
const unmappedProductionPages = productionAstroPages.filter((path) => !mappedSourceSet.has(path));

const semanticArchetypes = archetypes.map((item) => ({
  ...item,
  lifecycle: 'reconstructed-source-conformant',
  review_status: 'NOT_REVIEWED',
  interaction_semantics: 'Browser remains authoritative for scroll, gesture, focus, keyboard, animation and runtime state transitions.',
  source_evidence: item.source_files.map((path) => ({ path, sha256: sourceEvidence[path].sha256 })),
  responsive_evidence: {
    required_viewports: item.id === 'archetype.event-detail'
      ? [viewports.mobile.id, viewports.tablet.id, viewports.desktop.id]
      : [viewports.mobile.id, viewports.desktop.id],
    source_media_queries: unique(item.source_files.flatMap((path) => sourceEvidence[path].media_queries)),
  },
  allowed_instance_overrides: ['content', 'declared semantic state', 'declared slot', 'fixture identity'],
  forbidden_instance_overrides: ['font', 'color role', 'spacing', 'radius', 'icon geometry', 'media treatment', 'anatomy order'],
}));

const foundationsSource = JSON.parse(await readFile(join(designRoot, 'catalog/page-archetypes/date-listing-shell-v1/foundations.v1.json'), 'utf8'));
const typography = structuredClone(foundationsSource.typography);
delete typography.renderer_resolution;
for (const role of Object.values(typography.roles || {})) {
  delete role.penpot_typography_id;
  delete role.font_weight_penpot;
}
const foundations = {
  schema_version: 'reconstruction-atlas-foundations.v1',
  status: 'reconstructed-source-conformant',
  authority: 'Current Astro source values; Penpot bindings are intentionally stored outside this file.',
  typography,
  semantic_colors: foundationsSource.semantic_colors,
  spacing_px: foundationsSource.spacing_px,
  spacing_roles_px: foundationsSource.spacing_roles_px,
  radii_px: foundationsSource.radii_px,
  radius_roles_px: foundationsSource.radius_roles_px,
  elevation_roles: foundationsSource.elevation_roles,
  containers: foundationsSource.containers,
  breakpoints: foundationsSource.breakpoints,
  mobile_fixed_stack_px: foundationsSource.mobile_fixed_stack_px,
  accessibility: foundationsSource.accessibility,
  cross_cutting_contracts: {
    media_framing: 'proportional scale; safe crop; protected OCR regions; no stretch; multi-image behavior remains browser-authoritative where registered',
    iconography: 'semantic icon component owns source vector, size and state; nested source geometry must scale with the semantic slot',
    interaction: 'focus-visible, minimum 44px target, keyboard order, reduced motion and safe areas are mandatory at every archetype',
    runtime_states: ['loading', 'empty', 'error', 'retry', 'stale', 'disabled', 'focus-visible'],
  },
  source_refs: unique([
    ...foundationsSource.source_refs,
    'site/src/styles/design-system.css',
    'site/src/layouts/EventLayout.astro',
  ]),
};

let goldenCorpus = {};
try {
  goldenCorpus = JSON.parse(await readFile(join(designRoot, 'catalog/fixtures/ui-reference-events/v1/corpus.json'), 'utf8'));
} catch {}
const dateFixture = JSON.parse(await readFile(join(designRoot, 'catalog/page-archetypes/date-listing-shell-v1/fixture-manifest.v1.json'), 'utf8'));
const weekendFixture = JSON.parse(await readFile(join(designRoot, 'catalog/page-archetypes/weekend-listing-v1/fixture-manifest.v1.json'), 'utf8'));
const fixtures = {
  schema_version: 'reconstruction-atlas-fixtures.v1',
  policy: {
    same_fixture_both_sides: true,
    dense_and_stress: 'Validate full density, scrolling, sticky behavior and performance in Astro; Penpot receives representative linked instances only.',
    penpot_representations: ['typical-desktop', 'typical-mobile', 'sparse', 'empty', 'one-stress-sample'],
    event_content_coverage: ['standard-photo', 'portrait-or-ocr', 'no-image', 'long-title-or-place', 'free', 'arbitrary-paid', 'admission-absent', 'untimed-or-multi-day-or-completed'],
  },
  golden_event_corpus: {
    schema_version: goldenCorpus.schema_version || null,
    corpus_id: goldenCorpus.corpus_id || goldenCorpus.id || null,
    fixture_ids: unique((goldenCorpus.events || goldenCorpus.fixtures || []).map((item) => item.fixture_id || item.id).filter(Boolean)),
  },
  archetype_manifests: {
    'archetype.listing.date': { path: 'catalog/page-archetypes/date-listing-shell-v1/fixture-manifest.v1.json', sha256: sha256(json(dateFixture)) },
    'archetype.listing.weekend': { path: 'catalog/page-archetypes/weekend-listing-v1/fixture-manifest.v1.json', sha256: sha256(json(weekendFixture)) },
  },
  route_fixtures: semanticArchetypes.map((item) => ({ archetype_id: item.id, routes: item.representative_routes })),
  event_detail_scenarios: [
    { fixture_role: 'wide-image', event_id: 698, route: '/sobytiya/drevnie-voiny-yantarnogo-kraya-kaliningrad-698/' },
    { fixture_role: 'portrait-image', event_id: 2601, route: '/sobytiya/vystavka-donbass-proshloe-i-nastoyaschee-kaliningrad-2601/' },
    { fixture_role: 'no-image', event_id: 6996, route: '/sobytiya/nauka-vsegda-kstati-progulka-s-uchenym-kaliningrad-6996/' },
  ],
};

const reuseNodes = new Map();
for (const archetype of semanticArchetypes) {
  for (const id of archetype.reuse) {
    const node = reuseNodes.get(id) || { id, disposition: 'REUSE_FROZEN_OR_RECONCILE', consumers: [] };
    node.consumers.push(archetype.id);
    reuseNodes.set(id, node);
  }
  for (const id of archetype.delta) {
    const node = reuseNodes.get(id) || { id, disposition: 'NEW_OR_ARCHETYPE_DELTA', consumers: [] };
    node.consumers.push(archetype.id);
    reuseNodes.set(id, node);
  }
}
const reuseMap = {
  schema_version: 'reconstruction-atlas-reuse-new-map.v1',
  central_fix_policy: 'One lowest-owning SoT/master fix triggers one dependency-closure batch. Frozen source-conformant components reopen only for owner defect, contract/new structural context, or failed regression.',
  nodes: [...reuseNodes.values()].map((item) => ({ ...item, consumers: unique(item.consumers) })).sort((a, b) => a.id.localeCompare(b.id)),
};

const routeRegistry = {
  schema_version: 'reconstruction-atlas-route-registry.v1',
  source_repo: { path: eventsRoot, expected_head: '7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00' },
  checklist_archetype_count: semanticArchetypes.length,
  production_astro_page_count: productionAstroPages.length,
  mapped_production_astro_page_count: productionAstroPages.length - unmappedProductionPages.length,
  source_route_coverage_percent: productionAstroPages.length ? Number((((productionAstroPages.length - unmappedProductionPages.length) / productionAstroPages.length) * 100).toFixed(2)) : 0,
  unmapped_production_pages: unmappedProductionPages,
  excluded_preprod_pages: ['site/src/pages/[preview]/index.astro'],
  archetypes: semanticArchetypes.map(({ id, checklist_label, route_patterns, source_files, representative_routes }) => ({ id, checklist_label, route_patterns, source_files, representative_routes })),
  excluded_product_gaps: excludedProductGaps,
};

const gaps = {
  schema_version: 'reconstruction-atlas-gap-ledger.v1',
  status: 'OPEN_UNTIL_BROWSER_AND_PENPOT_BATCH_CLOSE',
  gaps: [
    { id: 'GAP-LEGAL-ROUTE', severity: 'P1', archetype_id: 'archetype.information-pages', evidence: 'No legal Astro page source exists in the current page tree.', disposition: 'Keep legal state in semantic archetype; do not fabricate a route. Materialize representative document typography only.' },
    { id: 'GAP-CLUB-DETAIL-RUNTIME', severity: 'P1', archetype_id: 'archetype.interest-clubs', evidence: 'Current browser smoke returned HTTP 404 for /kluby-po-interesam/game-vibes/ despite a source getStaticPaths branch.', disposition: 'Preserve the detail anatomy from source; browser capture must keep the 404 as a generated-output contradiction until resolved.' },
    { id: 'GAP-PRELAUNCH-RUNTIME', severity: 'P2', archetype_id: 'archetype.special-state', evidence: 'Prelaunch is an environment branch in the home source and is not active in the current browser runtime.', disposition: 'Source-conformant checkpoint only; no product decision inferred.' },
    { id: 'GAP-UNAVAILABLE-ROUTE', severity: 'P2', archetype_id: 'archetype.special-state', evidence: 'No accepted dedicated unavailable route contract exists.', disposition: 'Use the current generated 404 only as runtime evidence; do not promote it as a designed product route.' },
    { id: 'GAP-RENDERER-DELTAS', severity: 'NON_BLOCKING', archetype_id: '*', evidence: 'Chromium variable font weights/filters and Penpot renderer differ for some already bounded resources.', disposition: 'Track sampled conformance; do not block atlas reconstruction when geometry, semantics and registered renderer resolution match.' },
  ],
};

const semanticAtlas = {
  schema_version: 'complete-reconstruction-semantic-atlas.v1',
  generated_at: generatedAt,
  mode: 'accelerated-reconstruction',
  target_status: 'RECONSTRUCTION_ATLAS_READY',
  authority: {
    astro_source: 'current checked-out events-bot-new source',
    generated_browser_output: 'catalog/reconstruction-atlas/v1/evidence/browser-observations.v1.json',
    semantic_sot: 'this file and sibling foundations/fixtures/reuse contracts',
    penpot_bindings: 'separate: catalog/reconstruction-atlas/v1/penpot/bindings.v1.json',
    evidence: 'separate: catalog/reconstruction-atlas/v1/evidence/index.v1.json',
  },
  review_semantics: {
    no_interaction: 'NOT_REVIEWED',
    bounded_feedback_and_verified_correction: 'REVIEWED_BY_EXCEPTION',
    uncommented: 'NO_RECORDED_OBJECTION',
    explicit_decision_required_for: ['Astro-conflicting change', 'product change'],
  },
  archetype_count: semanticArchetypes.length,
  archetypes: semanticArchetypes,
};

const sourceCensus = {
  schema_version: 'reconstruction-atlas-source-census.v1',
  generated_at: generatedAt,
  events_root: eventsRoot,
  source_file_count: sourceFiles.length,
  sources: sourceEvidence,
};

const penpotBindings = {
  schema_version: 'reconstruction-atlas-penpot-bindings.v1',
  status: 'CHECKPOINTED_DEFERRED_UNTIL_SEMANTIC_ATLAS_VALIDATED',
  file_id: '3be9e5e1-190f-8090-8008-713c0fbe6260',
  checkpoint_revision: 2160,
  checkpoint: {
    page_id: 'd87e18f1-dcb4-80a6-8008-87e927765fba',
    page_name: '61.15 — Weekend · Sparse desktop shell',
    component_id: 'd87e18f1-dcb4-80a6-8008-87e97ec2a04f',
    main_shape_id: 'd87e18f1-dcb4-80a6-8008-87e959359663',
    review_board_id: 'd87e18f1-dcb4-80a6-8008-87efff9b3d5b',
    validation: [],
    named_version: '61.15 C01 · Weekend sparse desktop shell linked closure · checkpoint before Reconstruction Atlas batch',
  },
  batch_bindings: [],
};

let existingBrowserEvidence = null;
try {
  existingBrowserEvidence = JSON.parse(await readFile(join(outputRoot, 'evidence/browser-observations.v1.json'), 'utf8'));
} catch {}
const evidenceIndex = {
  schema_version: 'reconstruction-atlas-evidence-index.v1',
  status: existingBrowserEvidence
    ? (existingBrowserEvidence.failed_observation_count ? 'BROWSER_CAPTURE_COMPLETE_WITH_RECORDED_GAPS' : 'BROWSER_CAPTURE_COMPLETE')
    : 'SOURCE_CENSUS_READY_BROWSER_PENDING',
  source_census: '../source-census.v1.json',
  browser_observations: 'browser-observations.v1.json',
  penpot_bindings: '../penpot/bindings.v1.json',
  policy: 'Penpot bindings and comparison evidence are not semantic SoT and must never be embedded into archetype anatomy/state contracts.',
};
if (existingBrowserEvidence) {
  const browserContent = await readFile(join(outputRoot, 'evidence/browser-observations.v1.json'));
  evidenceIndex.browser_observation_count = existingBrowserEvidence.observations.length;
  evidenceIndex.browser_failed_observation_count = existingBrowserEvidence.failed_observation_count;
  evidenceIndex.browser_observations_sha256 = sha256(browserContent);
}

await writeJson(join(outputRoot, 'semantic-atlas.v1.json'), semanticAtlas);
await writeJson(join(outputRoot, 'route-registry.v1.json'), routeRegistry);
await writeJson(join(outputRoot, 'source-census.v1.json'), sourceCensus);
await writeJson(join(outputRoot, 'foundations.v1.json'), foundations);
await writeJson(join(outputRoot, 'fixtures.v1.json'), fixtures);
await writeJson(join(outputRoot, 'reuse-new-map.v1.json'), reuseMap);
await writeJson(join(outputRoot, 'gap-ledger.v1.json'), gaps);
await writeJson(join(outputRoot, 'penpot/bindings.v1.json'), penpotBindings);
await writeJson(join(outputRoot, 'evidence/index.v1.json'), evidenceIndex);

const outputs = [
  'semantic-atlas.v1.json',
  'route-registry.v1.json',
  'source-census.v1.json',
  'foundations.v1.json',
  'fixtures.v1.json',
  'reuse-new-map.v1.json',
  'gap-ledger.v1.json',
  'penpot/bindings.v1.json',
  'evidence/index.v1.json',
];
const manifestFiles = {};
for (const path of outputs) {
  const content = await readFile(join(outputRoot, path));
  manifestFiles[path] = { sha256: sha256(content), bytes: content.length };
}
await writeJson(join(outputRoot, 'source-manifest.v1.json'), {
  schema_version: 'reconstruction-atlas-source-manifest.v1',
  generated_at: generatedAt,
  config_schema_version: schemaVersion,
  design_root: designRoot,
  events_root: eventsRoot,
  archetype_count: semanticArchetypes.length,
  source_route_coverage_percent: routeRegistry.source_route_coverage_percent,
  files: manifestFiles,
});

console.log(JSON.stringify({
  output_root: outputRoot,
  archetype_count: semanticArchetypes.length,
  source_file_count: sourceFiles.length,
  production_astro_page_count: productionAstroPages.length,
  unmapped_production_pages: unmappedProductionPages,
  source_route_coverage_percent: routeRegistry.source_route_coverage_percent,
}, null, 2));

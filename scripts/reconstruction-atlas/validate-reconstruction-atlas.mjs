import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { archetypes, viewports } from './reconstruction-atlas.config.mjs';

const designRoot = resolve(new URL('../..', import.meta.url).pathname);
const eventsRoot = resolve(process.env.EVENTS_BOT_ROOT || '/home/dev/.codex/worktrees/events-bot-new/event-card-semantic-closure-int');
const atlasRoot = join(designRoot, 'catalog/reconstruction-atlas/v1');
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const readJson = async (path) => JSON.parse(await readFile(join(atlasRoot, path), 'utf8'));
const errors = [];
const checks = [];
const check = (condition, id, detail) => {
  checks.push({ id, status: condition ? 'PASS' : 'FAIL', detail });
  if (!condition) errors.push(`${id}: ${detail}`);
};

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

const atlas = await readJson('semantic-atlas.v1.json');
const routes = await readJson('route-registry.v1.json');
const census = await readJson('source-census.v1.json');
const foundations = await readJson('foundations.v1.json');
const fixtures = await readJson('fixtures.v1.json');
const reuse = await readJson('reuse-new-map.v1.json');
const gaps = await readJson('gap-ledger.v1.json');
const penpot = await readJson('penpot/bindings.v1.json');
const evidence = await readJson('evidence/index.v1.json');
const browser = await readJson('evidence/browser-observations.v1.json');

check(atlas.archetype_count === 17 && atlas.archetypes.length === 17, 'ATLAS-ARCHETYPE-COUNT', `expected 17, observed ${atlas.archetypes.length}`);
check(new Set(atlas.archetypes.map((item) => item.id)).size === 17, 'ATLAS-ARCHETYPE-UNIQUE', 'all archetype IDs must be unique');
check(routes.source_route_coverage_percent === 100 && routes.unmapped_production_pages.length === 0, 'ATLAS-SOURCE-ROUTE-COVERAGE', `coverage=${routes.source_route_coverage_percent}; unmapped=${routes.unmapped_production_pages.length}`);
for (const archetype of atlas.archetypes) {
  check(archetype.anatomy.length > 0, `ATLAS-ANATOMY-${archetype.id}`, `${archetype.anatomy.length} regions`);
  check(archetype.states.length > 0, `ATLAS-STATES-${archetype.id}`, `${archetype.states.length} states`);
  check(archetype.responsive.length >= 2, `ATLAS-RESPONSIVE-${archetype.id}`, `${archetype.responsive.length} branches`);
  check(archetype.reuse.length > 0, `ATLAS-REUSE-${archetype.id}`, `${archetype.reuse.length} reusable dependencies`);
  check(archetype.delta.length > 0, `ATLAS-DELTA-${archetype.id}`, `${archetype.delta.length} delta resources`);
  check(archetype.source_evidence.length === archetype.source_files.length, `ATLAS-SOURCE-BINDINGS-${archetype.id}`, `${archetype.source_evidence.length}/${archetype.source_files.length}`);
  check(!JSON.stringify(archetype).match(/(?:penpot_component_id|penpot_main_shape_id|review_board_id)/u), `ATLAS-NO-PENPOT-IN-SEMANTICS-${archetype.id}`, 'semantic archetype must not embed Penpot bindings');
}

for (const [path, row] of Object.entries(census.sources)) {
  const content = await readFile(join(eventsRoot, path));
  check(sha256(content) === row.sha256, `ATLAS-SOURCE-HASH-${path}`, row.sha256);
}
check(!JSON.stringify(foundations).match(/penpot_(?:component|typography|materialization)|penpot_component_id/iu), 'ATLAS-FOUNDATIONS-SEPARATE-FROM-PENPOT', 'foundation semantics contain no Penpot IDs or materialization records');
check(fixtures.policy.same_fixture_both_sides === true, 'ATLAS-SAME-FIXTURE-POLICY', 'Astro and Penpot consume the same fixture IDs');
check(fixtures.policy.dense_and_stress.includes('Astro'), 'ATLAS-DENSE-STRESS-ASTRO', fixtures.policy.dense_and_stress);

const expectedReuse = new Set(atlas.archetypes.flatMap((item) => [...item.reuse, ...item.delta]));
const actualReuse = new Set(reuse.nodes.map((item) => item.id));
check([...expectedReuse].every((id) => actualReuse.has(id)), 'ATLAS-REUSE-MAP-COMPLETE', `${actualReuse.size} nodes cover ${expectedReuse.size} referenced resources`);

check(browser.archetype_count === 17, 'ATLAS-BROWSER-ARCHETYPE-COUNT', `${browser.archetype_count}`);
check(browser.task_count === 67 && browser.observations.length === 67, 'ATLAS-BROWSER-TASK-COUNT', `${browser.observations.length}/67`);
for (const archetype of archetypes) {
  const observed = browser.observations.filter((item) => item.archetype_id === archetype.id);
  const viewportIds = new Set(observed.map((item) => item.viewport.id));
  check(viewportIds.has(viewports.mobile.id), `ATLAS-BROWSER-MOBILE-${archetype.id}`, `${observed.length} observations`);
  check(viewportIds.has(viewports.desktop.id), `ATLAS-BROWSER-DESKTOP-${archetype.id}`, `${observed.length} observations`);
  if (archetype.id === 'archetype.event-detail') check(viewportIds.has(viewports.tablet.id), 'ATLAS-BROWSER-TABLET-archetype.event-detail', `${observed.length} observations`);
  for (const route of archetype.representative_routes) {
    check(observed.some((item) => item.requested_route === route), `ATLAS-BROWSER-ROUTE-${archetype.id}-${route}`, route);
  }
}
const failed = browser.observations.filter((item) => item.navigation_error || (item.response_status ?? 500) >= 400);
check(failed.length === 2 && failed.every((item) => item.archetype_id === 'archetype.interest-clubs' && item.requested_route === '/kluby-po-interesam/game-vibes/'), 'ATLAS-BROWSER-FAILURES-RECORDED', `${failed.length} failures, all expected club-detail contradiction`);
check(gaps.gaps.some((item) => item.id === 'GAP-CLUB-DETAIL-RUNTIME'), 'ATLAS-GAP-CLUB-DETAIL', 'browser 404 contradiction is present in the gap ledger');
check(gaps.gaps.some((item) => item.id === 'GAP-LEGAL-ROUTE'), 'ATLAS-GAP-LEGAL', 'missing legal source route is present in the gap ledger');
check(gaps.gaps.some((item) => item.id === 'GAP-PRELAUNCH-RUNTIME'), 'ATLAS-GAP-PRELAUNCH', 'source-only prelaunch branch is present in the gap ledger');
check(penpot.status === 'CHECKPOINTED_DEFERRED_UNTIL_SEMANTIC_ATLAS_VALIDATED' && Array.isArray(penpot.batch_bindings), 'ATLAS-PENPOT-BINDINGS-SEPARATE', penpot.status);
check(evidence.browser_observations_sha256 === sha256(await readFile(join(atlasRoot, 'evidence/browser-observations.v1.json'))), 'ATLAS-BROWSER-HASH', evidence.browser_observations_sha256);

const report = {
  schema_version: 'reconstruction-atlas-validation-report.v1',
  validated_at: new Date().toISOString(),
  phase: 'semantic-sot-before-penpot',
  status: errors.length ? 'FAIL' : 'SEMANTIC_ATLAS_READY_FOR_PENPOT_BATCH',
  check_count: checks.length,
  pass_count: checks.filter((item) => item.status === 'PASS').length,
  fail_count: errors.length,
  errors,
  checks,
};
await writeFile(join(atlasRoot, 'validation-report.v1.json'), `${JSON.stringify(report, null, 2)}\n`);

const files = (await walk(atlasRoot))
  .filter((path) => !path.endsWith('/atlas-manifest.v1.json'))
  .map((path) => relative(atlasRoot, path).replaceAll('\\', '/'))
  .sort();
const fileBindings = {};
for (const path of files) {
  const content = await readFile(join(atlasRoot, path));
  fileBindings[path] = { sha256: sha256(content), bytes: content.length };
}
const designHead = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: designRoot, encoding: 'utf8' }).trim();
const astroHead = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: eventsRoot, encoding: 'utf8' }).trim();
const manifest = {
  schema_version: 'complete-reconstruction-atlas-manifest.v1',
  generated_at: new Date().toISOString(),
  phase_status: report.status,
  target_status: 'RECONSTRUCTION_ATLAS_READY',
  design_head_before_atlas_commit: designHead,
  astro_head: astroHead,
  archetype_coverage: { required: 17, semantic: atlas.archetypes.length, browser: browser.archetype_count, percent: 100 },
  route_source_coverage_percent: routes.source_route_coverage_percent,
  browser_observations: { total: browser.observations.length, failed_and_gap_bound: failed.length },
  penpot_checkpoint_revision: penpot.checkpoint_revision,
  penpot_batch_status: 'PENDING',
  files: fileBindings,
};
await writeFile(join(atlasRoot, 'atlas-manifest.v1.json'), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(JSON.stringify({ status: report.status, check_count: checks.length, fail_count: errors.length, atlas_manifest: join(atlasRoot, 'atlas-manifest.v1.json') }, null, 2));
if (errors.length) process.exitCode = 1;

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const root = path.join(repoRoot, 'catalog/reconstruction-atlas/v1');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const semantic = read('semantic-atlas.v1.json');
const ir = read('penpot/materialization-ir.v1.json');
const checks = [];
const check = (id, pass, actual) => checks.push({ id, pass: Boolean(pass), actual });

check('schema', ir.schema_version === 'reconstruction-atlas-materialization-ir.v1', ir.schema_version);
check('semantic-hash', ir.semantic_atlas_sha256 === hash('semantic-atlas.v1.json'), ir.semantic_atlas_sha256);
check('owner-page-count', ir.pages.length === semantic.archetypes.length && ir.pages.length === 17, ir.pages.length);
check('unique-page-names', new Set(ir.pages.map((p) => p.page_name)).size === ir.pages.length, ir.pages.map((p) => p.page_name));
check('unique-page-stable-ids', new Set(ir.pages.map((p) => p.stable_page_id)).size === ir.pages.length, ir.pages.map((p) => p.stable_page_id));
check('one-review-route', ir.topology.review_page_name === '63.00 — Atlas · Review route' && ir.acceptance.review_route_count === 1, ir.topology);

const semanticById = new Map(semantic.archetypes.map((a) => [a.id, a]));
for (const page of ir.pages) {
  const source = semanticById.get(page.archetype_id);
  check(`${page.archetype_id}:known`, Boolean(source), page.archetype_id);
  check(`${page.archetype_id}:anatomy`, JSON.stringify(page.anatomy) === JSON.stringify(source?.anatomy), page.anatomy.length);
  check(`${page.archetype_id}:states`, JSON.stringify(page.states) === JSON.stringify(source?.states), page.states.length);
  check(`${page.archetype_id}:responsive`, JSON.stringify(page.responsive_branches) === JSON.stringify(source?.responsive_branches), page.responsive_branches?.length ?? 0);
  check(`${page.archetype_id}:routes`, page.representative_routes.length > 0, page.representative_routes);
  check(`${page.archetype_id}:three-projections`, page.projections.length === 3, page.projections.map((p) => p.viewport));
  check(`${page.archetype_id}:desktop-mobile-state`, ['desktop-1280x720', 'mobile-390x720', 'state-index-640x180'].every((v) => page.projections.some((p) => p.viewport === v)), page.projections.map((p) => p.viewport));
  check(`${page.archetype_id}:unique-master-stable-ids`, new Set(page.projections.map((p) => p.stable_id)).size === 3, page.projections.map((p) => p.stable_id));
  check(`${page.archetype_id}:bounded`, page.constraints.max_page_content_width <= 1800 && page.constraints.max_page_content_height <= 1000 && page.constraints.max_top_level_shapes === 3, page.constraints);
  check(`${page.archetype_id}:linked-only`, page.constraints.nested_reuse === 'LINKED_INSTANCE_ONLY' && page.constraints.detached_forbidden && page.constraints.screenshot_master_forbidden, page.constraints);
  check(`${page.archetype_id}:no-overrides`, page.constraints.registered_overrides.length === 0, page.constraints.registered_overrides);
  check(`${page.archetype_id}:dense-stress-astro`, page.constraints.dense_stress === 'ASTRO_ONLY', page.constraints.dense_stress);
  for (const resource of page.sample_native_resources) {
    check(`${page.archetype_id}:binding:${resource.resource_id}`, Boolean(resource.component_id && resource.main_shape_id && resource.main_name), resource);
  }
}

const componentIds = Object.values(ir.native_bindings).map((b) => b.component_id);
check('native-bindings-unique', new Set(componentIds).size === componentIds.length, componentIds);
check('candidate-governance', ir.governance.lifecycle === 'candidate_noncanonical' && !ir.governance.redesign && !ir.governance.promotion && !ir.governance.production_mutation && !ir.governance.merge && !ir.governance.deploy, ir.governance);
check('acceptance-zero-detached-overrides', ir.acceptance.detached_count === 0 && ir.acceptance.unregistered_override_count === 0, ir.acceptance);

const failures = checks.filter((row) => !row.pass);
const report = {
  schema_version: 'reconstruction-atlas-materialization-ir-validation.v1',
  generated_at: new Date().toISOString(),
  status: failures.length ? 'MATERIALIZATION_IR_INVALID' : 'MATERIALIZATION_IR_READY',
  check_count: checks.length,
  fail_count: failures.length,
  checks,
};
fs.writeFileSync(path.join(root, 'penpot/materialization-ir-validation.v1.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, check_count: report.check_count, fail_count: report.fail_count }, null, 2));
if (failures.length) process.exitCode = 1;

#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(path, 'utf8'));
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const path = 'catalog/product-atlas-linkage-handoff/v1/design-system-linkage.v1.json';
const receipt = read(path);
const bindings = read('catalog/round-trip-reconstruction/v1/bindings.v1.json');

assert.equal(receipt.schema_version, 'product-atlas.design-system-linkage-handoff.v1');
assert.equal(receipt.status, 'READY_FOR_PARALLEL_GIT_ONLY_PRODUCT_ATLAS_SOT');
assert.equal(receipt.generation, 'deterministic_from_bound_inputs_no_wall_clock');
assert.equal(receipt.authority.design_system_commit, bindings.authority.design_system_commit);
assert.equal(receipt.authority.astro_commit, bindings.authority.astro_commit);
assert.equal(receipt.authority.penpot_file_id, bindings.penpot.file_id);
assert.equal(receipt.authority.penpot_revision, bindings.penpot.revision);
assert.equal(hash(receipt.authority.materialization_plan.path), receipt.authority.materialization_plan.sha256);
assert.equal(hash(receipt.authority.component_graph.path), receipt.authority.component_graph.sha256);
assert.equal(receipt.coverage.archetypes, 17);
assert.equal(receipt.coverage.boards, 34);
assert.ok(receipt.coverage.regions > 0);
assert.ok(receipt.coverage.patterns > 0);
assert.ok(receipt.coverage.components > 0);
assert.ok(receipt.coverage.states > 0);
assert.deepEqual(receipt.coverage.orphan_design_ids, []);
assert.equal(receipt.archetypes.length, 17);

const bindingById = new Map(bindings.archetypes.map(item => [item.archetype_id, item]));
const boardIds = [];
for (const archetype of receipt.archetypes) {
  const binding = bindingById.get(archetype.archetype_id);
  assert.ok(binding, `unbound archetype ${archetype.archetype_id}`);
  assert.equal(hash(archetype.contract_ref.path), archetype.contract_ref.sha256);
  assert.ok(archetype.region_ids.length > 0, `${archetype.archetype_id} regions`);
  assert.ok(archetype.pattern_ids.length > 0, `${archetype.archetype_id} patterns`);
  assert.ok(archetype.pattern_ids.every(item => item.status === 'proven' && item.source_ref.includes('#/owner_pages/')));
  assert.ok(archetype.component_ids.every(item => item.status === 'proven' && item.graph_join === 'resolved'));
  assert.deepEqual(archetype.product_links.job_ids, []);
  assert.deepEqual(archetype.product_links.outcome_ids, []);
  assert.deepEqual(archetype.product_links.journey_ids, []);
  assert.deepEqual(archetype.product_links.capability_ids, []);
  assert.deepEqual(archetype.product_links.acceptance_scenario_ids, []);
  assert.deepEqual(archetype.product_links.measurement_question_ids, []);
  assert.equal(archetype.product_links.status, 'not_modeled');
  assert.equal(archetype.penpot.page_id, binding.penpot_page.page_id);
  assert.equal(archetype.penpot.boards.length, 2);
  for (const board of archetype.penpot.boards) {
    assert.ok(board.direct_url.includes(`page-id=${archetype.penpot.page_id}`));
    assert.ok(board.direct_url.includes(`board-id=${board.board_id}`));
    boardIds.push(board.board_id);
  }
}
assert.equal(new Set(boardIds).size, 34, 'all Product Atlas design links must be exact and unique');
assert.equal(receipt.unresolved_product_model.status, 'not_modeled');
assert.equal(receipt.unresolved_product_model.fabricated_jobs, 0);
assert.equal(receipt.unresolved_product_model.fabricated_outcomes, 0);
assert.equal(receipt.unresolved_product_model.fabricated_metrics, 0);
assert.equal(receipt.penpot_projection.status, 'NOT_STARTED');
assert.equal(receipt.penpot_projection.design_system_penpot_dashboards_created, 0);
assert.equal(receipt.penpot_projection.current_file_mutations, 0);
console.log(`PRODUCT_ATLAS_LINKAGE_PASS ${hash(path)}`);

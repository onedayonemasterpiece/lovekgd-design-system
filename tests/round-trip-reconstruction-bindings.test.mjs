import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const bindings = JSON.parse(readFileSync('catalog/round-trip-reconstruction/v1/bindings.v1.json', 'utf8'));
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');

test('round-trip authority and coverage stay pinned', () => {
  assert.equal(bindings.authority.manifest.sha256, 'ac2cb64bbccb113dd7c81cdb8caec953d3d5e2f56ea10a1f54914d7a0ed46819');
  assert.equal(hash(bindings.authority.manifest.path), bindings.authority.manifest.sha256);
  assert.equal(bindings.authority.astro_commit, '7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00');
  assert.equal(bindings.coverage.archetypes, 17);
  assert.equal(bindings.coverage.desktop_cases, 17);
  assert.equal(bindings.coverage.mobile_cases, 17);
  assert.equal(bindings.cases.length, 34);
});

test('Penpot bindings preserve owner boards and linked assembly', () => {
  assert.equal(bindings.penpot.validation.length, 0);
  assert.equal(bindings.penpot.page_count, 17);
  assert.equal(bindings.penpot.board_count, 34);
  assert.equal(bindings.penpot.service_resources, 0);
  assert.deepEqual(bindings.penpot.service_resource_shapes, []);
  assert.equal(bindings.penpot.linked_direct_children, bindings.penpot.direct_children);
  assert.deepEqual(bindings.penpot.detached_direct_children, []);
  assert.equal(bindings.penpot.reuse_audit_complete, true);
  assert.deepEqual(bindings.penpot.unregistered_terminal_overrides, []);
  assert.deepEqual(bindings.penpot.out_of_bounds_direct_children, []);
  assert.equal(new Set(bindings.cases.map(item => item.penpot.page_id)).size, 17);
  assert.equal(new Set(bindings.cases.map(item => item.penpot.board_id)).size, 34);
  assert.equal(new Set(bindings.cases.map(item => item.case_id)).size, 34);
  for (const item of bindings.cases) {
    assert.match(item.penpot.direct_url, new RegExp(`page-id=${item.penpot.page_id}.*board-id=${item.penpot.board_id}`));
    assert.ok(item.astro.route.startsWith('/'));
  }
});

test('contracts and corrected graph are executable joins', () => {
  assert.equal(bindings.archetypes.length, 17);
  for (const archetype of bindings.archetypes) {
    assert.equal(hash(archetype.contract.path), archetype.contract.sha256);
    assert.ok(archetype.regions.every(region => region.plan_bound));
    assert.equal(archetype.boards.length, 2);
    for (const dependency of archetype.dependencies) {
      assert.notEqual(dependency.graph_join, 'explicit_gap', `${archetype.archetype_id}:${dependency.component_id}`);
    }
  }
});

test('comparison tuples use the exact materialized route fixture', () => {
  const information = bindings.cases.filter(item => item.archetype_id === 'archetype.information-pages');
  assert.equal(information.length, 2);
  for (const item of information) {
    assert.equal(item.astro.route, '/partners/');
    assert.match(item.penpot.board_name, /route=partners;fixtures=6/);
  }

  const detail = bindings.cases.filter(item => item.archetype_id === 'archetype.event-detail');
  for (const item of detail) {
    assert.equal(item.astro.route, '/sobytiya/predmetnye-strasti-natyurmort-xx-veka-kaliningrad-5459/');
    assert.match(item.penpot.board_name, /fixture=event\.real\.5459/);
  }
});

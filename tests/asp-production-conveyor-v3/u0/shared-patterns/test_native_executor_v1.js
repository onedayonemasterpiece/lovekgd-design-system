'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const { MemoryPenpotAdapter, MemoryStorage, validatePackage } = require('../../../../scripts/asp-production-conveyor-v3/u0/shared-patterns/native_runtime_v1');
const { packageDefinition, setupPackage } = require('../../../../scripts/asp-production-conveyor-v3/u0/shared-patterns/setup_v1');
const { run } = require('../../../../scripts/asp-production-conveyor-v3/u0/shared-patterns/native_executor_v1');

test('package is bounded, source-pinned, and free of forbidden implementation forms', () => {
  assert.deepEqual(validatePackage(packageDefinition), []);
  assert.equal(packageDefinition.owner, 'U0');
  assert.equal(packageDefinition.source_authority.head, '8f46f068ba41dab4dca538806d11693c8c0d3042');
  assert.equal(packageDefinition.source_authority.tree, 'a1739a4881262c2db9acd679e7b962a969ab5968');
  assert.equal(packageDefinition.atlas_r2.head, '663be702d481972cb2e8863af500f1c35dda1d8c');
  assert.equal(packageDefinition.boundaries.penpot_reads_by_u0, 0);
  assert.equal(packageDefinition.boundaries.penpot_mutations_by_u0, 0);
  assert.equal(packageDefinition.boundaries.eventcard_mat_repairs, 0);
  for (const unit of packageDefinition.page_units) {
    assert.ok(unit.managed_nodes_expected <= 30);
    assert.equal(unit.managed_nodes_expected, 1 + unit.components.length + unit.specimens.length);
  }
  const text = JSON.stringify(packageDefinition).toLowerCase();
  for (const banned of ['detached-copy', 'screenshot-shape', 'raster-substitute', 'old-penpot-uuid']) {
    assert.equal(text.includes(banned), false);
  }
});

test('setup is deterministic and never authorizes execution', async () => {
  const storage = new MemoryStorage();
  const lease = { active: true, cancelled: false, lease_id: 'test-lease' };
  const first = await setupPackage({ storage, lease });
  const second = await setupPackage({ storage, lease });
  assert.deepEqual(first, second);
  assert.equal(first.penpot_execution_authorized, false);
});

test('native executor creates linked masters/specimens once and creates zero on second run', async () => {
  const penpot = new MemoryPenpotAdapter();
  const storage = new MemoryStorage();
  const lease = { active: true, cancelled: false, lease_id: 'test-lease' };
  const first = await run({ penpot, storage, lease });
  const firstSnapshot = penpot.snapshot();
  const second = await run({ penpot, storage, lease });
  const secondSnapshot = penpot.snapshot();

  assert.ok(first.created > 0);
  assert.equal(second.created, 0);
  assert.deepEqual(secondSnapshot, firstSnapshot);
  assert.equal(first.detached_instances, 0);
  assert.equal(first.screenshot_shapes, 0);
  assert.equal(first.substitutes, 0);
  assert.deepEqual(first.validation, []);
  assert.ok(first.maximum_managed_nodes <= 30);

  for (const record of firstSnapshot.filter((item) => item.kind === 'linked-review-specimen')) {
    assert.equal(record.detached, false);
    assert.equal(record.screenshot, false);
    assert.equal(record.substitute, false);
    assert.ok(record.linked_master_ids.length >= 1);
    assert.ok(record.linked_master_ids.every(Boolean));
  }
});

test('lease cancellation fail-closes before mutations', async () => {
  const penpot = new MemoryPenpotAdapter();
  const storage = new MemoryStorage();
  await assert.rejects(
    run({ penpot, storage, lease: { active: false, cancelled: true, lease_id: 'cancelled' } }),
    /LEASE_NOT_ACTIVE/,
  );
  assert.equal(penpot.snapshot().length, 0);
});

test('shared package promotes only six confirmed reusable pattern groups', () => {
  assert.deepEqual(packageDefinition.patterns, [
    'U-PATTERN-RAILS',
    'U-PATTERN-SHELVES',
    'U-PATTERN-SECTION-HEADERS',
    'U-PATTERN-SEARCH-CONTROL-BARS',
    'U-PATTERN-CONTENT-GROUPINGS',
    'U-PATTERN-ROW-GROUP-COMPOSITION',
  ]);
  assert.equal(packageDefinition.page_units.length, 6);
  for (const unit of packageDefinition.page_units) {
    for (const component of unit.components) {
      assert.ok(component.source_consumers.length >= 2);
    }
  }
  assert.equal(packageDefinition.acceptance.route_specific_one_offs_promoted, 0);
});

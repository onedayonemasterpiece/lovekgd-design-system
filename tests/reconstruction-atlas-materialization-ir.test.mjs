import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (file) => JSON.parse(fs.readFileSync(new URL(`../catalog/reconstruction-atlas/v1/${file}`, import.meta.url)));
const ir = read('penpot/materialization-ir.v1.json');
const validation = read('penpot/materialization-ir-validation.v1.json');

test('materialization IR has one bounded final owner page per archetype', () => {
  assert.equal(ir.pages.length, 17);
  assert.equal(new Set(ir.pages.map((p) => p.page_name)).size, 17);
  assert.ok(ir.pages.every((p) => p.page_name.startsWith('63.')));
  assert.ok(ir.pages.every((p) => p.constraints.max_page_content_width <= 1800));
  assert.ok(ir.pages.every((p) => p.constraints.max_page_content_height <= 1000));
});

test('each owner page defines desktop, mobile and unique-state native masters', () => {
  for (const page of ir.pages) {
    assert.deepEqual(page.projections.map((p) => p.viewport), [
      'desktop-1280x720',
      'mobile-390x720',
      'state-index-640x180',
    ]);
    assert.ok(page.anatomy.length > 0);
    assert.ok(page.states.length > 0);
  }
});

test('reuse is linked and governance remains candidate-only', () => {
  assert.ok(ir.pages.every((p) => p.constraints.nested_reuse === 'LINKED_INSTANCE_ONLY'));
  assert.ok(ir.pages.every((p) => p.constraints.detached_forbidden));
  assert.ok(ir.pages.every((p) => p.constraints.registered_overrides.length === 0));
  assert.equal(ir.governance.lifecycle, 'candidate_noncanonical');
  assert.equal(ir.governance.production_mutation, false);
  assert.equal(ir.governance.promotion, false);
});

test('IR validator passes before Penpot writes', () => {
  assert.equal(validation.status, 'MATERIALIZATION_IR_READY');
  assert.equal(validation.fail_count, 0);
});

test('materialization IR is bound to global-archetype-sot-v1', () => {
  assert.equal(ir.global_archetype_sot_v1.path, 'catalog/global-archetype-sot-v1/manifest.v1.json');
  assert.match(ir.global_archetype_sot_v1.sha256, /^[a-f0-9]{64}$/);
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const contract = JSON.parse(readFileSync('catalog/reconstruction-atlas/v1/cross-cutting-token-contract.v1.json', 'utf8'));
const receipt = JSON.parse(readFileSync('evidence/recovery-20260829/penpot/cross-cutting-foundations-component-batch-12-receipt.v1.json', 'utf8'));
const source = readFileSync('scripts/round-trip-reconstruction/penpot-bind-foundations-batch12-core-listing-owner-roots.js', 'utf8');

test('OV-54 batch 12 binds both Home, Date and Weekend canonical owners without geometry drift', () => {
  assert.equal(receipt.owner_item, 'OV-54');
  assert.equal(receipt.source_conformant_token.name, 'radius.20');
  assert.deepEqual(receipt.pages.map(({ page_key }) => page_key), ['home', 'date', 'weekend']);
  assert.equal(receipt.roots.length, 6);
  assert.equal(receipt.persisted_token_properties, 24);
  assert.ok(receipt.roots.every((root) => root.size_before.toString() === root.size_after.toString()));
  assert.ok(receipt.roots.every((root) => root.radii_after.toString() === '20,20,20,20'));
  assert.ok(receipt.roots.every((root) => Object.values(root.persisted_tokens).every((name) => name === 'radius.20')));
  assert.deepEqual(receipt.penpot.validation, []);
});

test('OV-54 batch 12 records sequential page-scoped writes instead of a bulk cross-page rewrite', () => {
  const batch = contract.penpot_projection.component_migration_pilots.find((item) => item.batch === 'home-date-weekend-canonical-owner-roots');
  assert.ok(batch);
  assert.equal(batch.persisted_token_properties, 24);
  assert.deepEqual(receipt.page_sequence, ['home', 'date', 'weekend', 'return-artifacts-review']);
  assert.match(source, /shape\.applyToken\(token, PROPERTIES\)/u);
  assert.doesNotMatch(source, /openPage|detach\(|fillImage|uploadMedia/u);
  assert.equal(receipt.detached_instances, 0);
});

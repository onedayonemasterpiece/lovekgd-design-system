import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const contract = JSON.parse(readFileSync('catalog/reconstruction-atlas/v1/cross-cutting-token-contract.v1.json', 'utf8'));
const receipt = JSON.parse(readFileSync('evidence/recovery-20260829/penpot/cross-cutting-foundations-component-batch-10-receipt.v1.json', 'utf8'));
const source = readFileSync('scripts/round-trip-reconstruction/penpot-bind-foundations-batch10-favorites-mobile-owner.js', 'utf8');

test('OV-54 batch 10 binds the exact Favorites mobile owner without geometry drift', () => {
  assert.equal(receipt.owner_item, 'OV-54');
  assert.equal(receipt.source_conformant_token.name, 'radius.20');
  assert.equal(receipt.root.id, 'd87e18f1-dcb4-80a6-8008-880d230a2b8b');
  assert.match(receipt.root.name, /state=local-only-with-items · Astro source exact/u);
  assert.equal(receipt.persisted_token_properties, 4);
  assert.deepEqual(receipt.root.size_before, receipt.root.size_after);
  assert.deepEqual(receipt.root.radii_after, [20, 20, 20, 20]);
  assert.ok(Object.values(receipt.root.persisted_tokens).every((name) => name === 'radius.20'));
  assert.deepEqual(receipt.penpot.validation, []);
});

test('OV-54 batch 10 remains a bounded root-only migration', () => {
  const batch = contract.penpot_projection.component_migration_pilots.find((item) => item.batch === 'favorites-mobile-source-exact-owner-root');
  assert.ok(batch);
  assert.equal(batch.persisted_token_properties, 4);
  assert.match(source, /shape\.applyToken\(token, PROPERTIES\)/u);
  assert.doesNotMatch(source, /detach\(|fillImage|uploadMedia/u);
  assert.equal(receipt.detached_instances, 0);
});

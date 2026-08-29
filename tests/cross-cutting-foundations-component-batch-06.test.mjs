import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const contract = JSON.parse(readFileSync('catalog/reconstruction-atlas/v1/cross-cutting-token-contract.v1.json', 'utf8'));
const receipt = JSON.parse(readFileSync('evidence/recovery-20260829/penpot/cross-cutting-foundations-component-batch-06-receipt.v1.json', 'utf8'));
const source = readFileSync('scripts/round-trip-reconstruction/penpot-bind-foundations-batch06-search-query-roots.js', 'utf8');

test('OV-54 batch 06 adds source radius.28 and binds both desktop Search query roots', () => {
  assert.equal(receipt.owner_item, 'OV-54');
  assert.deepEqual(receipt.source_conformant_token.name, 'radius.28');
  assert.equal(receipt.roots.length, 2);
  assert.equal(receipt.persisted_token_properties, 8);
  assert.ok(receipt.roots.every((root) => JSON.stringify(root.size_before) === JSON.stringify(root.size_after)));
  assert.ok(receipt.roots.every((root) => JSON.stringify(root.radii_after) === '[28,28,28,28]'));
  assert.ok(receipt.roots.every((root) => Object.values(root.persisted_tokens).every((name) => name === 'radius.28')));
  assert.deepEqual(receipt.penpot.validation, []);
});

test('OV-54 batch 06 is represented in the migration contract and stays idempotent', () => {
  const batch = contract.penpot_projection.component_migration_pilots.find((item) => item.batch === 'search-desktop-source-exact-query-roots');
  assert.ok(batch);
  assert.equal(batch.persisted_token_properties, 8);
  assert.match(source, /set\.addToken\(\{ type: 'borderRadius', name: 'radius\.28', value: '28' \}\)/u);
  assert.match(source, /shape\.applyToken\(token, PROPERTIES\)/u);
  assert.doesNotMatch(source, /detach\(|fillImage|uploadMedia/u);
});

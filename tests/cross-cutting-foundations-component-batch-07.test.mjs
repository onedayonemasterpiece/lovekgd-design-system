import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const contract = JSON.parse(readFileSync('catalog/reconstruction-atlas/v1/cross-cutting-token-contract.v1.json', 'utf8'));
const receipt = JSON.parse(readFileSync('evidence/recovery-20260829/penpot/cross-cutting-foundations-component-batch-07-receipt.v1.json', 'utf8'));
const source = readFileSync('scripts/round-trip-reconstruction/penpot-bind-foundations-batch07-search-mobile-owner-roots.js', 'utf8');

test('OV-54 batch 07 binds the complete source-exact mobile Search owner lifecycle', () => {
  assert.equal(receipt.owner_item, 'OV-54');
  assert.equal(receipt.source_conformant_token.name, 'radius.20');
  assert.equal(receipt.roots.length, 8);
  assert.deepEqual(receipt.roots.map((root) => root.state), [
    'loading', 'results', 'validation', 'empty', 'error-retry',
    'load-more-ready', 'load-more-loading', 'recovery-after-error',
  ]);
  assert.equal(receipt.persisted_token_properties, 32);
  assert.ok(receipt.roots.every((root) => JSON.stringify(root.size_before) === JSON.stringify(root.size_after)));
  assert.ok(receipt.roots.every((root) => JSON.stringify(root.radii_after) === '[20,20,20,20]'));
  assert.ok(receipt.roots.every((root) => Object.values(root.persisted_tokens).every((name) => name === 'radius.20')));
  assert.deepEqual(receipt.penpot.validation, []);
});

test('OV-54 batch 07 is represented in the migration contract and remains idempotent', () => {
  const batch = contract.penpot_projection.component_migration_pilots.find((item) => item.batch === 'search-mobile-source-exact-owner-roots');
  assert.ok(batch);
  assert.equal(batch.persisted_token_properties, 32);
  assert.match(source, /shape\.applyToken\(token, PROPERTIES\)/u);
  assert.doesNotMatch(source, /detach\(|fillImage|uploadMedia/u);
});

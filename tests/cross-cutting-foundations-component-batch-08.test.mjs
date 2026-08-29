import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const contract = JSON.parse(readFileSync('catalog/reconstruction-atlas/v1/cross-cutting-token-contract.v1.json', 'utf8'));
const receipt = JSON.parse(readFileSync('evidence/recovery-20260829/penpot/cross-cutting-foundations-component-batch-08-receipt.v1.json', 'utf8'));
const source = readFileSync('scripts/round-trip-reconstruction/penpot-bind-foundations-batch08-event-detail-roots.js', 'utf8');

test('OV-54 batch 08 binds five exact Event Detail roots without geometry drift', () => {
  assert.equal(receipt.owner_item, 'OV-54');
  assert.equal(receipt.source_conformant_token.name, 'radius.20');
  assert.deepEqual(receipt.roots.map(({ role }) => role), [
    'mobile-owner', 'portrait-hero-image', 'portrait-viewer', 'transport', 'continuation',
  ]);
  assert.equal(receipt.persisted_token_properties, 20);
  assert.ok(receipt.roots.every((root) => JSON.stringify(root.size_before) === JSON.stringify(root.size_after)));
  assert.ok(receipt.roots.every((root) => JSON.stringify(root.radii_after) === '[20,20,20,20]'));
  assert.ok(receipt.roots.every((root) => Object.values(root.persisted_tokens).every((name) => name === 'radius.20')));
  assert.deepEqual(receipt.penpot.validation, []);
});

test('OV-54 batch 08 records the researched root-only persistence strategy', () => {
  const batch = contract.penpot_projection.component_migration_pilots.find((item) => item.batch === 'event-detail-source-exact-roots');
  assert.ok(batch);
  assert.equal(batch.persisted_token_properties, 20);
  assert.equal(receipt.external_tool_research.performed_before_further_writes, true);
  assert.match(source, /shape\.applyToken\(token, PROPERTIES\)/u);
  assert.doesNotMatch(source, /detach\(|fillImage|uploadMedia/u);
});

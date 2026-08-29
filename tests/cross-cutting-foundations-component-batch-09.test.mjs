import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const contract = JSON.parse(readFileSync('catalog/reconstruction-atlas/v1/cross-cutting-token-contract.v1.json', 'utf8'));
const receipt = JSON.parse(readFileSync('evidence/recovery-20260829/penpot/cross-cutting-foundations-component-batch-09-receipt.v1.json', 'utf8'));
const source = readFileSync('scripts/round-trip-reconstruction/penpot-bind-foundations-batch09-artifact-card-roots.js', 'utf8');

test('OV-54 batch 09 binds all seven exact Artifact card component roots without geometry drift', () => {
  assert.equal(receipt.owner_item, 'OV-54');
  assert.equal(receipt.source_conformant_token.name, 'radius.12');
  assert.deepEqual(receipt.roots.map(({ artifact_id }) => artifact_id), [
    'amber_cosmonaut', 'baltic_light', 'luise_queen_bridge', 'marzipan_heart', 'sedov_bell', 'cosmonaut', 'old_brick',
  ]);
  assert.equal(receipt.persisted_token_properties, 28);
  assert.ok(receipt.roots.every((root) => JSON.stringify(root.size_before) === JSON.stringify(root.size_after)));
  assert.ok(receipt.roots.every((root) => JSON.stringify(root.radii_after) === '[12,12,12,12]'));
  assert.ok(receipt.roots.every((root) => Object.values(root.persisted_tokens).every((name) => name === 'radius.12')));
  assert.deepEqual(receipt.penpot.validation, []);
});

test('OV-54 batch 09 extends the exact-seven family through root-only token bindings', () => {
  const batch = contract.penpot_projection.component_migration_pilots.find((item) => item.batch === 'artifact-collection-exact-seven-card-roots');
  assert.ok(batch);
  assert.equal(batch.persisted_token_properties, 28);
  assert.match(source, /main\.applyToken\(token, PROPERTIES\)/u);
  assert.doesNotMatch(source, /detach\(|fillImage|uploadMedia/u);
  assert.equal(receipt.detached_instances, 0);
});

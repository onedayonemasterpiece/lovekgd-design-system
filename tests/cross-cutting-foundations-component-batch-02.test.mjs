import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const contract = JSON.parse(await readFile(new URL('../catalog/reconstruction-atlas/v1/cross-cutting-token-contract.v1.json', import.meta.url)));
const receipt = JSON.parse(await readFile(new URL('../evidence/recovery-20260829/penpot/cross-cutting-foundations-component-batch-02-receipt.v1.json', import.meta.url)));

test('OV-54 batch 02 counts only bindings that persisted after delayed readback', () => {
  assert.equal(receipt.persisted_bindings.length, 4);
  assert.equal(receipt.persisted_token_properties, 17);
  assert.equal(contract.penpot_projection.component_migration_pilots[1].persisted_token_properties, 17);
  assert.match(receipt.not_counted.color_and_component_child_requests, /did not persist/u);
  assert.match(contract.penpot_projection.plugin_api_limitation.response, /not counted/u);
});

test('OV-54 binds canonical owner roots without changing their geometry', () => {
  const byFamily = Object.fromEntries(receipt.persisted_bindings.map((row) => [row.family, row]));
  assert.deepEqual(byFamily['mobile-bottom-navigation'].geometry, [366, 64, 20]);
  assert.deepEqual(byFamily['desktop-navigation-item'].geometry, [86, 44, 12]);
  assert.deepEqual(byFamily['social-proof-like-inside'].geometry, [46.6875, 32, 999]);
  assert.deepEqual(byFamily['listing-discovery-rail'].geometry, [1188.734375, 52, 999]);
  assert.equal(byFamily['listing-discovery-rail'].tokens.shadow, 'shadow.2');
  assert.equal(receipt.processed, false);
});

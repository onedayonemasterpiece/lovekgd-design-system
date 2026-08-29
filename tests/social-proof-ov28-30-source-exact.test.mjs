import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const contract = JSON.parse(await readFile(new URL('../catalog/reconstruction-atlas/v1/social-proof-ov28-30-source-exact.v1.json', import.meta.url)));
const receipt = JSON.parse(await readFile(new URL('../evidence/recovery-20260829/penpot/social-proof-ov28-30-native-receipt.v1.json', import.meta.url)));
const materializer = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-social-proof-ov28-30.js', import.meta.url), 'utf8');

test('OV-28 keeps transparent proof controls off page-local white tiles', () => {
  assert.equal(contract.acceptance.opaque_white_tiles_on_transparent_linked_roots, 0);
  assert.equal(receipt.native_readback.opaque_white_tiles_on_transparent_linked_roots, 0);
  assert.equal(receipt.native_readback.inside_surface_exception_count, 1);
  assert.match(contract.decisions.inside_state, /production state/u);
});

test('OV-29 visible proof states are linked to canonical lower owners', () => {
  assert.equal(receipt.native_readback.canonical_linked_root_instances.length, 6);
  assert.equal(new Set(receipt.native_readback.canonical_linked_root_instances.map((row) => row.component_id)).size, 6);
  assert.match(materializer, /component\(id\)\.instance\(\)/u);
  assert.match(materializer, /isComponentCopyInstance/u);
  assert.doesNotMatch(materializer, /detach\(|uploadMedia|fillImage\s*=|screenshot/iu);
});

test('OV-30 retires the page-local duplicate matrix without claiming owner acceptance', () => {
  assert.equal(contract.penpot.visible_top_level_roots, 1);
  assert.equal(contract.penpot.deprecated_top_level_roots, 35);
  assert.equal(contract.penpot.deprecated_page_local_components, 27);
  assert.equal(contract.acceptance.visible_page_local_component_mains, 0);
  assert.equal(contract.acceptance.owner_acceptance, 'NOT_CLAIMED');
  assert.equal(contract.processed, false);
});

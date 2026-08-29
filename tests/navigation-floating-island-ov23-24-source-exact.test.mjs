import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const contract = JSON.parse(await readFile(new URL('../catalog/reconstruction-atlas/v1/navigation-floating-island-ov23-24-source-exact.v1.json', import.meta.url)));
const receipt = JSON.parse(await readFile(new URL('../evidence/recovery-20260829/penpot/navigation-floating-island-ov23-24-native-receipt.v1.json', import.meta.url)));
const materializer = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-navigation-floating-island-ov23-24.js', import.meta.url), 'utf8');

test('OV-23 uses a content-inset mobile navigation island', () => {
  assert.equal(contract.authority.astro_commit, '53f7b2c2c');
  assert.deepEqual(contract.penpot.canonical_size, [366, 64]);
  assert.equal(contract.decisions.mobile.side_inset, 12);
  assert.equal(contract.decisions.mobile.bottom_inset, 10);
  assert.deepEqual(receipt.native_readback.search_review_region.copy_offset, [12, 46]);
  assert.equal(receipt.native_readback.search_review_region.search_pill_visible, true);
});

test('OV-24 records the desktop analysis instead of cloning mobile navigation', () => {
  assert.equal(contract.decisions.desktop.bottom_navigation_island, 'not-applicable');
  assert.match(contract.decisions.desktop.reason, /duplicate navigation/u);
  assert.match(receipt.native_readback.desktop_decision, /not-applicable/u);
});

test('navigation remains linked and does not use screenshot proxies', () => {
  assert.equal(receipt.native_readback.canonical_mobile_nav.linked_tab_items, 4);
  assert.match(materializer, /component\(COMPONENT\)\.mainInstance\(\)/u);
  assert.doesNotMatch(materializer, /uploadMedia|fillImage\s*=|screenshot/iu);
  assert.equal(contract.acceptance.owner_acceptance, 'NOT_CLAIMED');
  assert.equal(contract.processed, false);
});

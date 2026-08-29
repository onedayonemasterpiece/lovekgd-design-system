import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const contract = JSON.parse(await readFile(new URL('../catalog/reconstruction-atlas/v1/popular-framing-islands-ov31-33-source-exact.v1.json', import.meta.url)));
const receipt = JSON.parse(await readFile(new URL('../evidence/recovery-20260829/penpot/popular-framing-islands-ov31-33-native-receipt.v1.json', import.meta.url)));
const materializer = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-popular-framing-islands-ov31-33.js', import.meta.url), 'utf8');

test('OV-31 exposes one linked framing matrix instead of page-local media masters', () => {
  assert.equal(receipt.native_readback.framing_states.length, 6);
  assert.equal(new Set(receipt.native_readback.framing_states.map((row) => row.component_id)).size, 6);
  assert.equal(contract.penpot.visible_page_local_component_mains, 0);
  assert.match(contract.decisions.framing, /linked cover and natural framing states/u);
  assert.doesNotMatch(materializer, /uploadMedia|fillImage\s*=|screenshot|detach\(/iu);
});

test('OV-32 and OV-33 keep visible chrome linked to lower owners', () => {
  assert.equal(contract.penpot.linked_root_instances, 15);
  assert.match(materializer, /component\(id\)\.instance\(\)/u);
  assert.match(materializer, /isComponentCopyInstance/u);
  assert.equal(receipt.native_readback.city_shelf.component_id, 'c0b867fa-32d2-8062-8008-8d679ca1da53');
});

test('OV-33 uses layered content-sized islands and one normalized Romanovo', () => {
  assert.equal(contract.astro.popular_shell_surface, 'floating-islands');
  assert.equal(contract.astro.discovery_surface, 'floating-island');
  assert.equal(contract.astro.navigation_width, 'fit-content');
  assert.deepEqual(receipt.native_readback.city_shelf.size, [764, 52]);
  assert.equal(receipt.native_readback.city_shelf.romanovo_count, 1);
  assert.deepEqual(receipt.native_readback.city_shelf.labels, ['Все', 'Калининград', 'Светлогорск', 'Гвардейск', 'Гурьевск', 'Романово']);
  assert.equal(contract.acceptance.owner_acceptance, 'NOT_CLAIMED');
  assert.equal(contract.processed, false);
});

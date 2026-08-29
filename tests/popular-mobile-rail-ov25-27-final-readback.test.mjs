import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const receipt = JSON.parse(await readFile(new URL('../evidence/recovery-20260829/penpot/popular-mobile-rail-ov25-27-final-readback.v1.json', import.meta.url)));
const census = JSON.parse(await readFile(new URL('../evidence/recovery-20260828/penpot/popular-mobile-rail-lineage-census.v1.json', import.meta.url)));

test('OV-25 no longer has the blocking gray overlay and all visible fixtures remain useful content', () => {
  assert.equal(receipt.penpot.blocking_gray_overlay_count, 0);
  assert.deepEqual(receipt.penpot.visible_group_context_surfaces, [
    'Popular trend context / fast_growth',
    'Popular trend context / discussed',
  ]);
  assert.deepEqual(receipt.penpot.validation, []);
});

test('OV-26 readback resolves every Rail root to the canonical family', () => {
  assert.equal(receipt.penpot.canonical_root_count, 26);
  assert.equal(receipt.penpot.former_page_local_component_copy_count, 0);
  assert.equal(receipt.penpot.alternative_mobile_rail_root_component_count, 0);
  assert.equal(receipt.penpot.detached_root_count, 0);
  assert.equal(receipt.penpot.canonical_root_count, census.census.canonical_root_count);
});

test('OV-27 retains exact-date and period variants at the canonical owner', () => {
  assert.equal(receipt.penpot.exact_date_root_count, 22);
  assert.equal(receipt.penpot.period_root_count, 4);
  assert.equal(receipt.canonical_components.exact_date, census.canonical_components.exact_date.component_id);
  assert.equal(receipt.canonical_components.period, census.canonical_components.period.component_id);
  assert.equal(receipt.acceptance.owner_acceptance, 'NOT_CLAIMED');
  assert.equal(receipt.processed, false);
});

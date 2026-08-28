import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const contract = await readJson('../catalog/reconstruction-atlas/v1/event-detail-ov45-owner-exact.v1.json');
const browser = await readJson('../evidence/recovery-20260828/astro/ov45-event-detail-browser-evidence.v1.json');
const receipt = await readJson('../evidence/recovery-20260828/penpot/event-detail-ov45-owner-exact-receipt.v1.json');

test('OV-45 exact source tuple preserves overlap, top medallion and occurrence family', () => {
  assert.equal(contract.review_item, 'OV-45');
  assert.equal(contract.authority.primary_visual_donor_commit, '008839b14598105d1fed5b4e386d6d6f29d93d1f');
  assert.equal(contract.fixtures.overlap.event_id, 5459);
  assert.equal(contract.fixtures.overlap.required_first_screen_overlap_px, 240);
  assert.equal(contract.fixtures.top_medallion.event_id, 5757);
  assert.equal(contract.fixtures.top_medallion.medallion_identity, 'dramteatr39');
  assert.equal(contract.fixtures.occurrence_family.event_id, 5511);
  assert.equal(contract.fixtures.occurrence_family.alternative_count, 2);
  assert.deepEqual(contract.fixtures.occurrence_family.family_event_ids, [5511, 5512, 7020, 7021]);
  assert.equal(contract.penpot.detached_instances_allowed, 0);
});

test('OV-45 Penpot receipt preserves linked native states without claiming visual acceptance', () => {
  assert.equal(receipt.processed, false);
  assert.equal(receipt.penpot.desktop_owner.overlap_px, 240);
  assert.equal(receipt.penpot.desktop_owner.detached_direct_instances, 0);
  assert.equal(receipt.penpot.source_states.top_medallion.linked_artwork_component_id, '45777396-2f2a-80c0-8008-819170e25449');
  assert.equal(receipt.penpot.source_states.occurrence_practical.rows.length, 3);
  assert.equal(receipt.idempotency.created_on_second_run, 0);
  assert.deepEqual(receipt.structural_readback.page_validation, []);
  assert.equal(receipt.visual_export.visual_acceptance, 'NOT_CLAIMED');
});

test('OV-45 browser evidence proves the three source branches at 1280x900', () => {
  assert.deepEqual(browser.viewport, { width: 1280, height: 900 });
  assert.equal(browser.fixtures['5459'].title_panel.y, 660);
  assert.equal(browser.fixtures['5459'].hero.height, 843);
  assert.equal(browser.fixtures['5459'].document.overflow_x, 0);
  assert.equal(browser.fixtures['5757'].top_medallion.width, 94.71875);
  assert.equal(browser.fixtures['5757'].top_medallion.y, 612.640625);
  assert.equal(browser.fixtures['5511'].occurrence_desktop.text, '24 июляпятница19:00Другие даты (2) ↓');
  assert.equal(browser.fixtures['5511'].occurrence_practical.text, '24 июляпятница19:0025 июлясуббота17:0027 сентябрявоскресенье17:00');
  assert.ok(Object.values(browser.fixtures).every(({ console_errors }) => console_errors.length === 0));
});

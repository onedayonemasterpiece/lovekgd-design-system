import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const contract = await readJson('../catalog/reconstruction-atlas/v1/collection-free-ov44-owner-exact.v1.json');
const browser = await readJson('../evidence/recovery-20260828/astro/ov44-free-collection-browser-evidence.v1.json');
const unusual = await readJson('../catalog/reconstruction-atlas/v1/unusual-listing-ov49-authority-gap.v1.json');

test('OV-44 binds Page 63.08 to one concrete nonempty Free collection', () => {
  assert.equal(contract.review_item, 'OV-44');
  assert.equal(contract.authority.primary_visual_donor_commit, '008839b14598105d1fed5b4e386d6d6f29d93d1f');
  assert.equal(contract.astro.route, '/podborki/besplatnye-sobytiya/');
  assert.equal(contract.collection.title, 'Бесплатные события');
  assert.equal(contract.collection.timed_event_count, 23);
  assert.equal(contract.collection.ongoing_exhibition_count, 14);
  assert.equal(contract.representative_events.length, 3);
  assert.equal(new Set(contract.representative_events.map(({ event_id }) => event_id)).size, 3);
  assert.equal(contract.penpot.required_projection.includes('not the /podborki/ navigation catalog'), true);
  assert.equal(contract.penpot.detached_cards_allowed, 0);
});

test('OV-44 browser evidence proves responsive large-card composition without overflow', () => {
  assert.equal(browser.viewports.desktop.event_count, 23);
  assert.equal(browser.viewports.desktop.exhibition_count, 14);
  assert.equal(browser.viewports.desktop.hero.width, 1180);
  assert.equal(browser.viewports.mobile.hero.width, 366);
  assert.equal(browser.viewports.mobile.event_cards[0].rect.width, 340);
  assert.deepEqual(browser.viewports.desktop.console_errors, []);
  assert.deepEqual(browser.viewports.mobile.console_errors, []);
  assert.equal(browser.viewports.desktop.overflow, 0);
  assert.equal(browser.viewports.mobile.overflow, 0);
});

test('OV-49 remains explicit rather than fabricating a nonempty Unusual feed', () => {
  assert.equal(unusual.review_item, 'OV-49');
  assert.equal(unusual.status, 'EXPLICIT_DECISION_REQUIRED');
  assert.equal(unusual.observed_authority.route_present_in_visual_donor, false);
  assert.equal(unusual.observed_authority.production_quality_status, 'blocked');
  assert.equal(unusual.observed_authority.production_item_count, 0);
  assert.equal(unusual.observed_authority.production_last_good_present, false);
  assert.equal(unusual.disposition.nonempty_publication_source_available, false);
  assert.equal(unusual.disposition.invent_event_ids_or_promote_blocked_candidates, false);
});

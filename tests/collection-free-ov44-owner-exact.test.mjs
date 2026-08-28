import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const contract = await readJson('../catalog/reconstruction-atlas/v1/collection-free-ov44-owner-exact.v1.json');
const browser = await readJson('../evidence/recovery-20260828/astro/ov44-free-collection-browser-evidence.v1.json');
const penpot = await readJson('../evidence/recovery-20260828/penpot/collection-free-ov44-owner-exact-receipt.v1.json');
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
  assert.deepEqual(
    contract.representative_events.map(({ event_id, image_fit }) => [event_id, image_fit]),
    [[7030, 'contain'], [6947, 'contain'], [7006, 'cover']],
  );
  assert.ok(contract.representative_events.every(({ occurrence, price, place }) => occurrence && price && place));
  assert.equal(contract.penpot.required_projection.includes('not the /podborki/ navigation catalog'), true);
  assert.match(contract.penpot.fixture_adapter_rule, /linked canonical EventCard large instance/);
  assert.equal(contract.penpot.detached_cards_allowed, 0);
  assert.equal(contract.penpot.revision, 2703);
  assert.equal(contract.penpot.owner_review_status, 'NOT_REVIEWED');
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

test('OV-44 Penpot receipt proves exact linked native state without claiming visual acceptance', () => {
  assert.equal(penpot.status, 'CORRECTION_MATERIALIZED_DESKTOP_AND_MOBILE_READBACK_PASS_VISUAL_EXPORT_BLOCKED');
  assert.equal(penpot.penpot.revision_after_named_version, 2703);
  assert.equal(penpot.event_adapter_readback.length, 6);
  assert.ok(penpot.event_adapter_readback.every(({ exact_text, native_image_data_type }) => (
    exact_text && native_image_data_type === 'function'
  )));
  assert.equal(penpot.structural_readback.linked_event_adapter_roots, 6);
  assert.equal(penpot.structural_readback.detached_event_adapter_roots, 0);
  assert.deepEqual(penpot.structural_readback.page_validation, []);
  assert.equal(penpot.idempotency.adapter_created_count_on_second_run, 0);
  assert.equal(penpot.idempotency.body_created_count_on_second_run, 0);
  assert.equal(penpot.idempotency.sticky_created_count_on_second_run, 0);
  assert.equal(penpot.visual_export.visual_acceptance, 'NOT_CLAIMED');
  assert.equal(penpot.visual_export.owner_rereview_required, true);
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

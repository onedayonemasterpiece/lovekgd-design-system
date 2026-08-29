import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const contract = await readJson('../catalog/reconstruction-atlas/v1/collection-free-ov44-owner-exact.v1.json');
const browser = await readJson('../evidence/recovery-20260829/astro/ov44-free-collection-centralized-card-scroll-evidence.v1.json');
const penpot = await readJson('../evidence/recovery-20260828/penpot/collection-free-ov44-owner-exact-receipt.v1.json');
const bindings = await readJson('../catalog/round-trip-reconstruction/v1/bindings.v1.json');
const unusual = await readJson('../catalog/reconstruction-atlas/v1/unusual-listing-ov49-authority-gap.v1.json');
const unusualRefresh = await readJson('../evidence/recovery-20260829/astro/unusual-ov49-authority-refresh.v1.json');

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
    contract.representative_events.map(({ event_id }) => event_id),
    [7030, 7006, 6901],
  );
  assert.ok(contract.representative_events.every(({ occurrence, price, place }) => occurrence && price && place));
  assert.equal(contract.penpot.required_projection.includes('not the /podborki/ navigation catalog'), true);
  assert.match(contract.penpot.fixture_adapter_rule, /linked canonical EventCard large instance/);
  assert.equal(contract.penpot.detached_cards_allowed, 0);
  assert.equal(contract.responsive_contract.desktop.card_columns, 3);
  assert.equal(contract.penpot.revision, 2889);
  assert.equal(contract.penpot.owner_review_status, 'NOT_REVIEWED');
});

test('OV-44 round-trip binding rejects the experimental card and binds explicit scroll states', () => {
  const archetype = bindings.archetypes.find(({ archetype_id }) => archetype_id === 'archetype.collections');
  const eventCard = archetype.dependencies.find(({ component_id }) => component_id === 'event.card.large');
  assert.equal(eventCard.source_exact_resolution.canonical_templates.desktop, 'b0fe69fd-ccaf-8025-8008-846f0b7f12cd');
  assert.equal(eventCard.source_exact_resolution.canonical_templates.mobile, '7f078c80-87b8-80f5-8008-85839e8975f6');
  assert.equal(eventCard.source_exact_resolution.rejected_quarantined_template.component_id, 'b0fe69fd-ccaf-8025-8008-844b666fe76c');
  const states = archetype.fixture_slots.find(({ slot_id }) => slot_id === 'state-scenarios').fixture_refs;
  assert.ok(states.includes('free-collection-scroll-hero-passed-desktop'));
  assert.ok(states.includes('free-collection-scroll-hero-passed-mobile'));
});

test('OV-44 browser evidence proves responsive large-card composition without overflow', () => {
  assert.deepEqual(browser.viewports.desktop.top.cards.slice(0, 3).map(({ id }) => id), ['7030', '7006', '6901']);
  assert.equal(browser.viewports.desktop.top.columnCount, '347.328px 347.328px 347.344px');
  assert.equal(browser.viewports.mobile.top.columnCount, '340px');
  assert.equal(browser.viewports.mobile.top.cards[0].rect.width, 340);
  assert.equal(browser.viewports.desktop.scrolled.compactVisible, true);
  assert.equal(browser.viewports.desktop.scrolled.compact.width, 58);
  assert.equal(browser.viewports.mobile.scrolled.compactVisible, true);
  assert.equal(browser.viewports.mobile.scrolled.compact.width, 50);
  assert.deepEqual(browser.viewports.desktop.console_errors, []);
  assert.deepEqual(browser.viewports.mobile.console_errors, []);
});

test('OV-44 Penpot receipt proves exact linked native state without claiming owner acceptance', async () => {
  assert.equal(penpot.status, 'CORRECTION_MATERIALIZED_CANONICAL_CARDS_AND_SCROLL_STATES_STRUCTURAL_PASS_OWNER_REREVIEW_REQUIRED');
  assert.equal(penpot.penpot.revision_after_named_version, 2703);
  assert.equal(penpot.penpot.current_revision, 2889);
  assert.equal(penpot.event_adapter_readback.length, 6);
  assert.ok(penpot.event_adapter_readback.every(({ exact_text, native_image_data_type }) => (
    exact_text && native_image_data_type === 'function'
  )));
  assert.equal(penpot.structural_readback.linked_event_adapter_roots, 6);
  assert.equal(penpot.structural_readback.detached_event_adapter_roots, 0);
  assert.equal(penpot.structural_readback.explicit_scrolled_owner_roots, 2);
  assert.deepEqual(penpot.structural_readback.page_validation, []);
  assert.equal(penpot.idempotency.adapter_created_count_on_second_run, 0);
  assert.equal(penpot.idempotency.body_created_count_on_second_run, 0);
  assert.equal(penpot.idempotency.sticky_created_count_on_second_run, 0);
  assert.equal(penpot.visual_export.visual_acceptance, 'NOT_CLAIMED');
  assert.equal(penpot.visual_export.owner_rereview_required, true);
  assert.equal(penpot.visual_export.status, 'CURRENT_EXPORT_HTTP_504_STRUCTURAL_READBACK_PASS');
  assert.deepEqual(
    penpot.event_adapter_readback.map(({ event_id }) => event_id),
    [7030, 7006, 6901, 7030, 7006, 6901],
  );
  assert.ok(penpot.event_adapter_readback.every(({ media_first }) => media_first));
  assert.equal(penpot.penpot.scrolled_owners.desktop.componentId, '8f804431-c282-8075-8008-8e6128cb8d22');
  assert.equal(penpot.penpot.scrolled_owners.mobile.componentId, '8f804431-c282-8075-8008-8e613d7e5ba1');
  for (const item of [penpot.visual_export.desktop, penpot.visual_export.mobile]) {
    const buffer = await readFile(new URL(`../${item.path}`, import.meta.url));
    assert.deepEqual([buffer.readUInt32BE(16), buffer.readUInt32BE(20)], item.dimensions);
    assert.equal(createHash('sha256').update(buffer).digest('hex'), item.sha256);
  }
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
  assert.equal(unusual.fresh_audit.astro_commit, '812ffc279728221b547707474bcb521f27c4a73d');
  assert.equal(unusualRefresh.astro.item_count, 0);
  assert.ok(unusualRefresh.astro.all_git_manifest_versions.every(({ item_count }) => item_count === 0));
  assert.equal(unusualRefresh.public_route_probe.http_status, 404);
  assert.equal(unusualRefresh.publication_disposition.safe_to_materialize_concrete_events, false);
});

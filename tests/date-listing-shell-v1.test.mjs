import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const repo = resolve(import.meta.dirname, '..');
const base = join(repo, 'catalog/page-archetypes/date-listing-shell-v1');
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

const manifest = read(join(base, 'fixture-manifest.v1.json'));
const foundations = read(join(base, 'foundations.v1.json'));
const dependencies = read(join(base, 'dependency-lock.v1.json'));
const components = read(join(base, 'component-contract.v1.json'));
const decisions = read(join(base, 'decision-ledger.v1.json'));

assert.equal(manifest.manifest_id, 'archetype.listing.date-shell-v1.golden-v1');
assert.equal(manifest.fixtures.length, 7);
assert.deepEqual(manifest.representations.map((item) => item.order), [1, 2, 3, 4, 5, 6, 7]);
assert.equal(new Set(manifest.representations.map((item) => item.id)).size, 7);
assert.equal(manifest.canonical, false);
assert.equal(manifest.promoted, false);
assert.equal(manifest.production_deployed, false);
assert.equal(components.conformance_framework.mode, 'recursive-correction');
assert.equal(components.conformance_framework.status, 'in-progress');
assert.equal(components.conformance_framework.direct_component_comparison_required, true);
assert.equal(components.conformance_framework.parent_or_page_comparison_substitutes_for_child, false);
assert.deepEqual(components.conformance_framework.levels, [
  'foundation',
  'primitive-icon',
  'leaf-component',
  'composite-component',
  'section-pattern',
  'archetype-shell',
  'bounded-page-consumer',
]);

const fixtureIds = new Set(manifest.fixtures.map((fixture) => fixture.fixture_id));
for (const representation of manifest.representations) {
  for (const fixtureId of representation.fixture_ids) {
    assert(fixtureIds.has(fixtureId), `${representation.id} references unknown ${fixtureId}`);
  }
}
for (const fixture of manifest.fixtures) {
  const payloadPath = join(repo, fixture.payload_path);
  const payload = read(payloadPath);
  assert.equal(payload.fixture_id, fixture.fixture_id);
  assert.equal(payload.preview_event_sha256, fixture.preview_event_sha256);
  assert.equal(sha256(payloadPath), fixture.payload_file_sha256);
}

assert.equal(foundations.semantic_colors.canvas, '#fbf7ef');
assert.equal(foundations.containers.desktop_max_px, 1180);
assert.equal(foundations.breakpoints.mobile_listing_max_px, 720);
assert.equal(foundations.breakpoints.mobile_shell_max_px, 759);
assert.equal(foundations.typography.renderer_resolution.astro_source_max_weight, 920);
assert.equal(foundations.typography.renderer_resolution.penpot_display_resolved_weight, 900);
assert.equal(foundations.typography.renderer_resolution.penpot_line_height_mode, 'unitless_ratio');
assert(foundations.accessibility.minimum_target_px >= 44);
assert(foundations.accessibility.safe_areas.length === 4);

assert.deepEqual(dependencies.dependencies.map((item) => item.semantic_id), [
  'event.card.large',
  'listing.event-card.compact',
  'listing.rail-row.track',
  'social-proof.like.compact36',
  'listing.media.7807',
  'listing.media.7906',
  'social-proof.like.inside',
  'listing.media.6628',
  'listing.media.4327',
  'listing.media.8156',
  'listing.media.7888',
  'content.event-title.clamp2',
  'content.event-place.listing-on-light',
  'medallion.frame.normalized',
  'archetype.listing.date.stress.viewport.continuation',
  'icon.ui.reference4.heart-thin.20',
  'icon.ui.reference4.share-network-thin.25',
  'social-proof.share.compact36',
  'medallion.frame.standard60.free',
  'medallion.frame.standard60.more-vnutri',
  'listing.event-card.compact.event.real.6628',
  'listing.event-card.compact.event.real.4327',
  'listing.event-card.compact.event.real.8156',
  'listing.event-card.compact.event.real.7888',
]);
assert(components.body_components.some((item) => item.id === 'listing.desktop-flow'));
assert(components.body_components.some((item) => item.id === 'listing.page-date-header.specific-date'));
assert(components.body_components.some((item) => item.id === 'listing.date-nav-item.wide'));
assert(components.body_components.some((item) => item.id === 'listing.time-group-header.sparse'));
assert(components.body_components.some((item) => item.id === 'listing.page-date-header.tomorrow'));
assert(components.body_components.some((item) => item.id === 'listing.date-nav-item.wide.selected'));
assert(components.body_components.some((item) => item.id === 'listing.city-filter-rail'));
assert(components.archetype_variants.some((item) => item.id === 'archetype.listing.date.stress.viewport'));
const stress = components.archetype_variants.find((item) => item.id === 'archetype.listing.date.stress.viewport');
assert.equal(stress.viewport_slices.length, 2);
assert.deepEqual(stress.viewport_slices.map((slice) => slice.id), ['upper', 'continuation']);
assert.deepEqual(
  [...new Set(stress.viewport_slices.flatMap((slice) => slice.fixture_ids))].sort(),
  [...stress.fixture_registry].sort(),
);
assert(stress.viewport_slices.some((slice) => slice.fixture_ids.length > 2), 'stress continuation must exercise a real multi-item listing');
const stressContinuation = components.archetype_variants.find((item) => item.id === 'archetype.listing.date.stress.viewport.continuation');
assert(stressContinuation);
assert.equal(stressContinuation.fixture_ids.length, 4);
assert.deepEqual(stressContinuation.dependencies, ['listing.event-card.compact.event.real.6628', 'listing.event-card.compact.event.real.4327', 'listing.event-card.compact.event.real.8156', 'listing.event-card.compact.event.real.7888']);
assert(components.body_components.some((item) => item.id === 'content.event-title.clamp2'));
assert(components.body_components.some((item) => item.id === 'content.event-place.listing-on-light'));
assert(components.body_components.some((item) => item.id === 'medallion.frame.normalized'));
assert(components.archetype_variants.some((item) => item.id === 'archetype.listing.date.sparse'));
assert(components.body_components.some((item) => item.id === 'listing.mobile-rail-viewport'));
const mobileRailViewport = components.body_components.find((item) => item.id === 'listing.mobile-rail-viewport');
assert.match(mobileRailViewport.content_delivery.date_today_tomorrow_weekend_popular, /build-time rendered/);
assert(components.body_components.some((item) => item.id === 'listing.mobile-page-head'));
assert(components.body_components.some((item) => item.id === 'listing.mobile-city-picker-summary'));
assert(components.body_components.some((item) => item.id === 'listing.mobile-feed-head'));
assert(components.body_components.some((item) => item.id === 'listing.mobile-heads.current-fixture'));
const mobilePageHead = components.body_components.find((item) => item.id === 'listing.mobile-page-head');
const mobileCitySummary = components.body_components.find((item) => item.id === 'listing.mobile-city-picker-summary');
const mobileFeedHead = components.body_components.find((item) => item.id === 'listing.mobile-feed-head');
const mobileHeadsFixture = components.body_components.find((item) => item.id === 'listing.mobile-heads.current-fixture');
assert.equal(mobilePageHead.owner_page.id, '06b5fc29-ba80-803f-8008-873ce354560a');
assert.match(mobilePageHead.typography_residual, /Penpot 2.17.2 plugin API rejects/);
assert.equal(mobileCitySummary.penpot_component_id, '06b5fc29-ba80-803f-8008-873d66059d3a');
assert.match(mobileCitySummary.geometry_rule, /119\.375x42 exact current state/);
assert.deepEqual(mobileFeedHead.dependencies, ['listing.mobile-city-picker-summary']);
assert.match(mobileFeedHead.geometry_rule, /1px #e1d3c2 bottom divider/);
assert.equal(mobileHeadsFixture.penpot_board_id, '06b5fc29-ba80-803f-8008-873d90c03796');
assert.match(mobileHeadsFixture.classification, /not a product component variant/);
assert.match(mobileHeadsFixture.materialization_rule, /stacked vertically/);
assert(components.body_components.some((item) => item.id === 'listing.mobile-date-accessory'));
assert(components.body_components.some((item) => item.id === 'listing.mobile-date-chip'));
assert(components.body_components.some((item) => item.id === 'listing.mobile-calendar-trigger'));
const mobileDateAccessory = components.body_components.find((item) => item.id === 'listing.mobile-date-accessory');
const mobileDateChip = components.body_components.find((item) => item.id === 'listing.mobile-date-chip');
const mobileCalendarTrigger = components.body_components.find((item) => item.id === 'listing.mobile-calendar-trigger');
assert.equal(mobileDateAccessory.penpot_component_id, 'a21f5e36-5d76-8065-8008-86c0f46904e6');
assert.match(mobileDateAccessory.materialization_rule, /compared independently/);
assert.match(mobileDateChip.responsive_rule, /60x48 default and 74x48 weekend-range/);
assert(mobileDateChip.states.includes('disabled'));
assert(mobileDateChip.states.includes('month-label-present'));
assert.match(mobileDateChip.materialization_integrity, /generated markup and bounded export/);
assert.equal(mobileDateChip.owner_page.id, 'a21f5e36-5d76-8065-8008-871c5ba59b76');
assert.equal(Object.keys(mobileDateChip.state_component_ids).length, 7);
assert.equal(mobileDateChip.state_component_ids.today, 'a21f5e36-5d76-8065-8008-871cd0e3ca14');
assert(mobileDateChip.representative_combinations.includes('state=disabled;month-label=present'));
assert.match(mobileDateChip.today_outline_rule, /bounded PNG exporter drops a fill-less inner-shadow/);
assert.equal(mobileDateChip.exact_fixture_materialization_adapters.board_id, 'a21f5e36-5d76-8065-8008-871fd9ef0b32');
assert.match(mobileDateChip.exact_fixture_materialization_adapters.classification, /not product taxonomy variants/);
assert.equal(Object.keys(mobileDateChip.exact_fixture_materialization_adapters.component_ids).length, 7);
assert.deepEqual(mobileCalendarTrigger.dependencies, ['icon.shell.mobile-date-accessory.calendar.23']);
assert.match(mobileCalendarTrigger.icon_rule, /calendar-with-clock action artwork/);
assert.equal(mobileCalendarTrigger.linked_icon_component_id, 'a43684fa-6ddf-80af-8008-87357e243598');
assert.match(mobileCalendarTrigger.geometry_rule, /50x46 at composite x=335,y=6/);
assert.equal(foundations.mobile_fixed_stack_px.content_clearance_without_safe_area, 120);
assert(components.composition_rules.some((rule) => /one to three intrinsic-width linked card instances/.test(rule)));
for (const fixtureId of ['6628', '4327', '8156', '7888']) {
  const card = components.body_components.find((item) => item.id === `listing.event-card.compact.event.real.${fixtureId}`);
  assert(card, `missing fixture-bound compact card ${fixtureId}`);
  assert.match(card.topology, /linked semantic children/);
}
assert(components.body_components.some((item) => item.id === 'social-proof.share.compact36'));
assert(components.body_components.some((item) => item.id === 'medallion.frame.standard60.free'));
assert(components.body_components.some((item) => item.id === 'medallion.frame.standard60.more-vnutri'));
assert.match(stressContinuation.card_instance_topology, /four linked fixture-bound/);
const desktopHeader = components.shell_components.find((item) => item.id === 'shell.desktop-header');
assert.deepEqual(desktopHeader.brand_tag.corner_radii_px, [0, 0, 12, 12]);
assert(components.shell_components.some((item) => item.id === 'shell.mobile-menu'));
const mobileMenu = components.shell_components.find((item) => item.id === 'shell.mobile-menu');
assert.deepEqual(mobileMenu.states, ['main', 'collections', 'service']);
for (const plane of ['main', 'collections', 'service']) {
  assert(components.shell_components.some((item) => item.id === `shell.mobile-menu-plane.${plane}`));
}
assert(components.icon_components.items.some((item) => item.id === 'icon.ui.reference4.sparkle'));
assert(components.icon_components.items.some((item) => item.id === 'icon.ui.reference4.chats'));
assert(components.icon_components.items.some((item) => item.id === 'icon.ui.reference4.heart-thin.20' && item.size_px === 20));
assert(components.icon_components.items.some((item) => item.id === 'icon.ui.reference4.share-network-thin.25' && item.size_px === 25));
assert.equal(components.icon_components.owner_page, '25 — Iconography');
assert(components.icon_components.items.some((item) => item.id === 'icon.shell.mobile-bottom.ticket'));
assert(components.icon_components.items.some((item) => item.id === 'icon.shell.mobile-bottom.calendar'));
assert(components.icon_components.items.some((item) => item.id === 'icon.shell.mobile-date-accessory.calendar.23' && item.size_px === 23));
assert(components.icon_components.items.some((item) => item.id === 'icon.shell.mobile-bottom.search'));
assert(components.icon_components.items.some((item) => item.id === 'icon.shell.mobile-bottom.personal'));
assert(components.composition_rules.some((rule) => /icon masters live on Page 25/.test(rule)));
assert(components.composition_rules.some((rule) => /mobile listing head masters live on Page 60.1d/.test(rule)));

assert(components.shell_components.some((item) => item.id === 'shell.footer'));
assert(decisions.decisions.some((item) => item.id === 'DL-003' && /explicit semantic states/.test(item.decision)));
assert(decisions.decisions.some((item) => item.id === 'DL-007' && /Penpot display styles resolve it/.test(item.decision)));
assert(decisions.decisions.some((item) => item.id === 'DL-008' && /unitless ratio/.test(item.decision)));
assert(decisions.decisions.some((item) => item.id === 'DL-009' && /build-time rendered static listing rows/.test(item.decision)));

console.log('date-listing-shell-v1.test: PASS (fixtures, representations, foundations, dependencies, states, shell)');

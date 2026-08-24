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
assert.equal(foundations.candidate_id, 'listing-foundations-candidate-v1');
assert.equal(Object.keys(foundations.typography.roles).length, 6);
assert.equal(Object.keys(foundations.semantic_color_resources).length, 14);
assert.equal(foundations.spacing_roles_px['page.large'], 32);
assert.equal(foundations.radius_roles_px['rail.media'], 12);
assert.equal(foundations.penpot_materialization.token_set_status, 'PASS_ACTIVE_READBACK');
assert.equal(foundations.penpot_materialization.token_count, 40);
assert.equal(Object.values(foundations.penpot_materialization.token_groups).reduce((a, b) => a + b, 0), 40);
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
const titleFixtureAdapters = components.body_components.find((item) => item.id === 'content.event-title.fixture-adapter');
const placeFixtureAdapters = components.body_components.find((item) => item.id === 'content.event-place.fixture-adapter');
assert(titleFixtureAdapters);
assert(placeFixtureAdapters);
assert.equal(titleFixtureAdapters.owner_page.id, 'd87e18f1-dcb4-80a6-8008-876664e327e7');
assert.equal(Object.keys(titleFixtureAdapters.penpot_component_ids).length, 4);
assert.equal(Object.keys(placeFixtureAdapters.penpot_component_ids).length, 4);
assert.match(titleFixtureAdapters.renderer_reason, /read-back reported changed nested instance characters/);
assert.match(placeFixtureAdapters.materialization_rule, /terminal ellipsis in the semantic text itself/);
assert.match(placeFixtureAdapters.geometry_rule, /full card root width/);
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
assert(components.body_components.some((item) => item.id === 'social-proof.like.rail-inline'));
assert(components.body_components.some((item) => item.id === 'listing.rail-row.event-summary'));
assert(components.body_components.some((item) => item.id === 'listing.rail-row.track'));
assert(components.body_components.some((item) => item.id === 'listing.rail-row.event-digest'));
assert(components.body_components.some((item) => item.id === 'listing.rail-row.media-frame'));
assert(components.body_components.some((item) => item.id === 'listing.rail-row.media.fixture-7906'));
assert(components.body_components.some((item) => item.id === 'listing.rail-row.identity-slot'));
assert(components.body_components.some((item) => item.id === 'action.like.rail'));
assert(components.body_components.some((item) => item.id === 'listing.rail-row.artifact-slot'));
const railInlineLike = components.body_components.find((item) => item.id === 'social-proof.like.rail-inline');
const railEventSummary = components.body_components.find((item) => item.id === 'listing.rail-row.event-summary');
const railTrack = components.body_components.find((item) => item.id === 'listing.rail-row.track');
const railEventDigest = components.body_components.find((item) => item.id === 'listing.rail-row.event-digest');
const railMediaFrame = components.body_components.find((item) => item.id === 'listing.rail-row.media-frame');
const railMedia7906 = components.body_components.find((item) => item.id === 'listing.rail-row.media.fixture-7906');
const railIdentitySlot = components.body_components.find((item) => item.id === 'listing.rail-row.identity-slot');
const railLikeAction = components.body_components.find((item) => item.id === 'action.like.rail');
const railArtifactSlot = components.body_components.find((item) => item.id === 'listing.rail-row.artifact-slot');
assert.equal(railInlineLike.family_id, 'social-proof.like');
assert.equal(railInlineLike.context_variant, 'rail-inline');
assert.equal(railInlineLike.canonical_context_master.penpot_component_id, railInlineLike.penpot_component_id);
assert.match(railInlineLike.materialization_rule, /direct Heart\+text reconstruction is forbidden/);
assert.deepEqual(railEventSummary.dependencies, ['social-proof.like.rail-inline', 'icon.product.rail-arrow-right']);
assert.match(railEventSummary.component_topology, /no detached copies/);
assert.match(railEventSummary.parent_adoption_status, /complete: owning T04 main instance/);
assert.match(railEventSummary.parent_adoption_status, /inherited linked child/);
assert.equal(railTrack.recursive_decomposition_status, 'complete');
assert.match(railTrack.component_graph_readback, /eight direct linked children/);
assert.match(railTrack.component_graph_readback, /three rail media fixture adapters/);
assert.match(railTrack.component_graph_readback, /no ordinary top-level nested board remains/);
assert.match(railTrack.bounded_visual_status, /ready-for-owner-review/);
assert.match(railTrack.bounded_visual_status, /exact 1013x112/);
assert.equal(railEventDigest.penpot_component_id, '06b5fc29-ba80-803f-8008-874d4c59fc59');
assert.match(railEventDigest.materialization_rule, /six-line clamp/);
assert.match(railEventDigest.parent_adoption_status, /complete: owning T04 main owns linked child/);
assert.equal(railMediaFrame.penpot_component_id, '06b5fc29-ba80-803f-8008-87516651257f');
assert.match(railMediaFrame.materialization_rule, /native Penpot ImageData proxy/);
assert.equal(railMedia7906.penpot_component_ids['slot-3'], '06b5fc29-ba80-803f-8008-8751af9f2c0c');
assert.match(railMedia7906.classification, /not additional product variants/);
assert.match(railMedia7906.parent_adoption_status, /compact review inherited linked children/);
assert.equal(railIdentitySlot.penpot_variant_container_id, '06b5fc29-ba80-803f-8008-87567d5d5dec');
assert.equal(railIdentitySlot.state_component_ids.absent, '06b5fc29-ba80-803f-8008-875656cacadf');
assert.match(railIdentitySlot.materialization_rule, /without a hidden present-state child/);
assert.match(railIdentitySlot.materialization_rule, /absence consumes no layout width/);
assert.match(railIdentitySlot.parent_adoption_status, /compact review inherited linked child/);
assert.equal(railLikeAction.penpot_variant_container_id, 'd87e18f1-dcb4-80a6-8008-8761942b908a');
assert.equal(railLikeAction.state_component_ids['count-present'], 'd87e18f1-dcb4-80a6-8008-8761830829b6');
assert.match(railLikeAction.materialization_rule, /functional component boundary/);
assert.match(railLikeAction.geometry_rule, /true 28x28/);
assert.match(railLikeAction.geometry_rule, /15px weight-900 overridable count/);
assert.match(railLikeAction.parent_adoption_status, /without an ordinary wrapper/);
assert.equal(railArtifactSlot.penpot_variant_container_id, 'd87e18f1-dcb4-80a6-8008-875cfd828f63');
assert.equal(railArtifactSlot.state_component_ids.absent, 'd87e18f1-dcb4-80a6-8008-875ce3d79aee');
assert.match(railArtifactSlot.materialization_rule, /rather than a hidden present artifact/);
assert.match(railArtifactSlot.parent_adoption_status, /was swapped in place/);
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
  assert.match(card.topology, /linked semantic media\/proof\/identity children/);
  assert.deepEqual(card.dependencies.filter((item) => item.startsWith('content.')), ['content.event-title.fixture-adapter', 'content.event-place.fixture-adapter']);
}
assert(components.body_components.some((item) => item.id === 'social-proof.share.compact36'));
assert(components.body_components.some((item) => item.id === 'medallion.frame.standard60.free'));
assert(components.body_components.some((item) => item.id === 'medallion.frame.standard60.more-vnutri'));
assert.match(stressContinuation.card_instance_topology, /four linked fixture-bound/);
const typicalDesktop = components.archetype_variants.find((item) => item.id === 'archetype.listing.date.typical-desktop');
assert(typicalDesktop);
assert.deepEqual(typicalDesktop.fixture_ids, ['event.real.7807', 'event.real.7906', 'event.real.7888']);
assert.equal(typicalDesktop.viewport, '1280x1261');
assert.match(typicalDesktop.component_topology, /three event cards and three group headers/);
const typicalCards = components.body_components.find((item) => item.id === 'listing.event-card.compact.context.date-typical-desktop');
assert(typicalCards);
assert.equal(Object.keys(typicalCards.penpot_component_ids).length, 3);
assert.match(typicalCards.geometry_rule, /parent grid/);
assert.match(typicalCards.identity_rule, /7807 uses the linked free medallion/);
const typicalTimeHeaders = components.body_components.find((item) => item.id === 'listing.time-group-header.exact-date-typical');
assert(typicalTimeHeaders);
assert.equal(Object.keys(typicalTimeHeaders.penpot_component_ids).length, 3);
assert.match(typicalTimeHeaders.materialization_rule, /no detached or top-level review text/);
const worldOceanMedallion = components.body_components.find((item) => item.id === 'medallion.frame.standard60.world-ocean-museum');
assert(worldOceanMedallion);
assert.match(worldOceanMedallion.rule, /only when the exact fixture identity requires it/);
assert(components.composition_rules.some((rule) => /date typical-desktop proves three exact chronological fixtures/.test(rule)));
for (const id of ['DL-015', 'DL-016', 'DL-017']) assert(decisions.decisions.some((item) => item.id === id));
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
assert(components.composition_rules.some((rule) => /mobile rail correction is recursive/.test(rule)));
assert(components.body_components.some((item) => item.id === 'listing.rail-row.track.exact-date-typical'));
const exactMobileTracks = components.body_components.find((item) => item.id === 'listing.rail-row.track.exact-date-typical');
assert.deepEqual(exactMobileTracks.fixture_ids, ['event.real.7807', 'event.real.7906', 'event.real.7888']);
assert.equal(exactMobileTracks.penpot_component_ids['event.real.7807'], 'd87e18f1-dcb4-80a6-8008-877d21489602');
assert.match(exactMobileTracks.geometry_rule, /819\.875x112/);
assert.match(exactMobileTracks.parent_adoption_status, /zero ordinary data overlays/);
const media7807 = components.body_components.find((item) => item.id === 'listing.rail-row.media.fixture-7807');
assert(media7807);
assert.equal(media7807.source_asset_sha256, '00da20e7dd8d036df2b908e20202550e77d4f166742479234902b33697b0416d');
assert.match(media7807.geometry_rule, /object-position 45% 55%/);
assert.match(media7807.materialization_rule, /not a screenshot/);
const mobileSummaries = components.body_components.find((item) => item.id === 'listing.rail-row.event-summary.exact-fixtures');
assert.equal(Object.keys(mobileSummaries.penpot_component_ids).length, 3);
const mobileDigests = components.body_components.find((item) => item.id === 'listing.rail-row.event-digest.exact-fixtures');
assert.equal(Object.keys(mobileDigests.penpot_component_ids).length, 3);
assert(components.composition_rules.some((rule) => /three linked full-width exact tracks/.test(rule)));
for (const id of ['DL-018', 'DL-019', 'DL-020']) assert(decisions.decisions.some((item) => item.id === id));
for (const id of ['DL-021', 'DL-022', 'DL-023', 'DL-024']) assert(decisions.decisions.some((item) => item.id === id));
for (const id of ['DL-025', 'DL-026']) assert(decisions.decisions.some((item) => item.id === id));
for (const id of ['DL-027', 'DL-028', 'DL-029']) assert(decisions.decisions.some((item) => item.id === id));
for (const id of ['DL-030', 'DL-031']) assert(decisions.decisions.some((item) => item.id === id));
for (const id of ['DL-032', 'DL-033', 'DL-034', 'DL-035', 'DL-036', 'DL-037', 'DL-038', 'DL-039']) assert(decisions.decisions.some((item) => item.id === id));
for (const id of ['shell.mobile-menu.close-tag', 'action.shell.mobile-menu.login', 'action.shell.mobile-menu.favorites', 'action.shell.mobile-menu.share', 'shell.mobile-menu.utility', 'action.shell.mobile-menu.row', 'shell.mobile-menu.brand', 'shell.mobile-menu.date-navigation']) assert(components.shell_components.some((item) => item.id === id));
const shellUtility = components.shell_components.find((item) => item.id === 'shell.mobile-menu.utility');
assert.match(shellUtility.layer_rule, /no alpha surface may overlay/);
assert.equal(shellUtility.dependencies.length, 3);
const shellMenuRow = components.shell_components.find((item) => item.id === 'action.shell.mobile-menu.row');
assert.equal(shellMenuRow.main_plane_adoption.linked_row_instances, 8);
assert.equal(shellMenuRow.main_plane_adoption.nested_linked_icons, 8);
assert.equal(shellMenuRow.main_plane_adoption.external_icon_overlays, 0);
assert.match(shellMenuRow.materialization_rule, /sibling icon overlays are forbidden/);
const shellMenuBrand = components.shell_components.find((item) => item.id === 'shell.mobile-menu.brand');
assert.equal(shellMenuBrand.penpot_component_id, 'd87e18f1-dcb4-80a6-8008-87a644fc494e');
assert.equal(shellMenuBrand.registered_overrides['wordmark.color'], 'dark-on-light #2b211c');
assert.match(shellMenuBrand.materialization_rule, /copied vector group is forbidden/);
const shellMenuDates = components.shell_components.find((item) => item.id === 'shell.mobile-menu.date-navigation');
assert.equal(shellMenuDates.penpot_component_id, 'd87e18f1-dcb4-80a6-8008-87a7a547f2da');
assert.deepEqual(shellMenuDates.exact_state, ['Сегодня', 'Завтра:selected', 'Выходные']);
assert.match(shellMenuDates.materialization_rule, /Direct sibling chips.*forbidden/);
const shellMenuParent = components.shell_components.find((item) => item.id === 'shell.mobile-menu');
assert.equal(shellMenuParent.penpot_component_id, 'a21f5e36-5d76-8065-8008-86aefc9d8004');
assert.match(shellMenuParent.layer_rule, /Close tag is frontmost/);
assert.match(shellMenuParent.utility_clip_rule, /22px/);
assert.match(shellMenuParent.direct_parent_conformance, /Page60\.8.*blocker/);
const cityRail = components.body_components.find((item) => item.id === 'listing.city-filter-rail');
assert.equal(cityRail.penpot_component_id, 'a21f5e36-5d76-8065-8008-86cf6749b5d4');
assert.match(cityRail.surface_rule, /bottom divider/);
const desktopHeaderExact = components.shell_components.find((item) => item.id === 'shell.desktop-header');
assert.equal(desktopHeaderExact.penpot_component_id, 'a21f5e36-5d76-8065-8008-86ae4bdf9963');
assert.match(desktopHeaderExact.brand_tag.layering_rule, /behind the brand tag/);
const stressViewport = components.archetype_variants.find((item) => item.id === 'archetype.listing.date.stress.viewport');
assert(stressViewport);
assert.match(stressViewport.upper_slice_component_topology, /ordinary content overlays=0/);
assert.equal(stressViewport.group_marker_x_px, 32);
assert.equal(Object.keys(stressViewport.upper_slice_exact_component_ids).length, 4);
const tomorrowHeader = components.body_components.find((item) => item.id === 'listing.page-date-header.tomorrow');
assert.equal(tomorrowHeader.penpot_component_id, 'a21f5e36-5d76-8065-8008-86cf6598eff5');
assert.match(tomorrowHeader.rendered_markup_gate, /Популярное/);
const mobileStatePanel = components.body_components.find((item) => item.id === 'listing.mobile-state-panel');
assert(mobileStatePanel);
assert.deepEqual(mobileStatePanel.states, ['loading', 'empty', 'error']);
assert.equal(Object.keys(mobileStatePanel.penpot_component_ids).length, 3);
assert.match(mobileStatePanel.parent_adoption_status, /detached=0/);
const stateAction = components.body_components.find((item) => item.id === 'listing.state-action');
assert(stateAction);
assert.equal(stateAction.penpot_component_id, 'a21f5e36-5d76-8065-8008-86ada69598f2');
assert.match(stateAction.materialization_rule, /linked instances/);
const exactMobileAccessory = components.body_components.find((item) => item.id === 'listing.mobile-date-accessory.exact-date-typical');
assert(exactMobileAccessory);
assert.equal(exactMobileAccessory.calendar_reference_date, '2026-08-21');
assert.equal(Object.keys(exactMobileAccessory.semantic_state_component_ids).length, 5);
assert.match(exactMobileAccessory.parent_adoption_status, /detached=0/);
const mobileTrigger = components.shell_components.find((item) => item.id === 'shell.mobile-menu-trigger');
assert.equal(mobileTrigger.wordmark_component_id, 'd87e18f1-dcb4-80a6-8008-87853121d15c');
assert.match(mobileTrigger.fill_stack_rule, /fallback under the native leather image/);
const typicalMobile = components.archetype_variants.find((item) => item.id === 'archetype.listing.date.typical-mobile');
assert(typicalMobile);
assert.equal(typicalMobile.feed_to_rows_gap_px, 10);
assert.match(typicalMobile.component_topology, /zero review-board overlays/);

assert(components.shell_components.some((item) => item.id === 'shell.footer'));
assert(decisions.decisions.some((item) => item.id === 'DL-003' && /explicit semantic states/.test(item.decision)));
assert(decisions.decisions.some((item) => item.id === 'DL-007' && /Penpot display styles resolve it/.test(item.decision)));
assert(decisions.decisions.some((item) => item.id === 'DL-008' && /unitless ratio/.test(item.decision)));
assert(decisions.decisions.some((item) => item.id === 'DL-009' && /build-time rendered static listing rows/.test(item.decision)));
assert(decisions.decisions.some((item) => item.id === 'DL-010' && /bounded export/.test(item.decision)));
assert(decisions.decisions.some((item) => item.id === 'DL-011' && /full card root width/.test(item.decision)));
assert(decisions.decisions.some((item) => item.id === 'DL-013' && /Astro-authoritative/.test(item.decision)));

console.log('date-listing-shell-v1.test: PASS (fixtures, representations, foundations, dependencies, states, shell)');

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const bindings = read('catalog/round-trip-reconstruction/v1/bindings.v1.json');
const contract = read('catalog/reconstruction-atlas/v1/personal-feed-ov36-37-source-exact.v1.json');
const receipt = read('evidence/recovery-20260829/penpot/personal-feed-ov36-37-native-receipt.v1.json');
const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.personal-feed');
const cases = bindings.cases.filter((item) => item.archetype_id === 'archetype.personal-feed');

test('OV-36/37 round-trip binds the explicitly partial bounded owners', () => {
  assert.deepEqual(cases.map((item) => [item.viewport, item.width, item.height]), [['desktop', 1280, 3315], ['mobile', 390, 4612]]);
  assert.ok(cases.every((item) => item.astro.commit === '812ffc279728221b547707474bcb521f27c4a73d'));
  assert.ok(cases.every((item) => item.astro.capture.full_page === true));
  assert.ok(cases.every((item) => item.penpot.revision === 2798));
  assert.ok(cases.every((item) => item.penpot.direct_children.length === 6));
  assert.ok(cases.every((item) => /bounded-coverage-3-of-16-interests\+3-of-9-recommendations;auth=email\+yandex · PARTIAL/.test(item.penpot.board_name)));
  assert.equal(JSON.stringify({ archetype, cases }).includes('consent-undecided'), false);
  assert.equal(JSON.stringify({ archetype, cases }).includes('state=undecided'), false);
});

test('OV-36/37 round-trip preserves bounded fixture order, filters and embedded feedback', () => {
  const feed = archetype.regions.find((item) => item.region_id === 'personal.feed');
  const filters = archetype.regions.find((item) => item.region_id === 'personal.filters');
  const feedback = archetype.regions.find((item) => item.region_id === 'personal.feedback');
  assert.deepEqual(feed.penpot_instances.filter((item) => item.event_id).map((item) => item.event_id), ['5459', '6870', '6941', '5459', '6870', '6941']);
  assert.deepEqual(filters.penpot_instances.map((item) => item.interest), ['jazz', 'exhibitions', 'family', 'jazz', 'exhibitions', 'family']);
  assert.equal(feedback.penpot_instances.length, 6);
  assert.ok(feedback.penpot_instances.every((item) => item.role === 'recommendation-with-feedback'));
  assert.deepEqual(contract.semantic_resolution.source_exact_state.fixture_order, ['5459', '6870', '6941']);
  assert.equal(contract.semantic_resolution.source_exact_state.extra_personalization_consent, false);
  assert.deepEqual(contract.bounded_penpot_projection.coverage, {
    astro_interest_count: 16,
    penpot_interest_count: 3,
    astro_recommendation_count: 9,
    penpot_recommendation_count: 3,
    disposition: 'PARTIAL_NOT_SOURCE_EXACT_FULL_PAGE',
  });
});

test('OV-36/37 source-exact correction is hash-bound and read back at revision 2798', () => {
  assert.equal(archetype.source_exact_correction.sha256, sha256(archetype.source_exact_correction.path));
  assert.equal(receipt.round_trip.penpot_revision, 2798);
  assert.equal(receipt.round_trip.validation.length, 0);
  assert.equal(receipt.round_trip.desktop_direct_child_ids.length, 6);
  assert.equal(receipt.round_trip.mobile_direct_child_ids.length, 6);
  assert.equal(contract.penpot.round_trip_revision, 2798);
});

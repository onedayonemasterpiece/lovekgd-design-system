import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const bindings = read('catalog/round-trip-reconstruction/v1/bindings.v1.json');
const contract = read('catalog/reconstruction-atlas/v1/interest-clubs-ov40-source-exact.v1.json');
const reuse = read('catalog/reconstruction-atlas/v1/reuse-new-map.v1.json');
const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.interest-clubs');
const cases = bindings.cases.filter((item) => item.archetype_id === 'archetype.interest-clubs');

test('OV-40 round-trip no longer binds the default catalogue to state=empty', () => {
  assert.equal(JSON.stringify({ archetype, cases }).includes('state=empty'), false);
  assert.deepEqual(cases.map((item) => item.height), [1781, 1983]);
  assert.ok(cases.every((item) => item.astro.capture.full_page === true));
  assert.ok(cases.every((item) => item.astro.commit === 'dec0d11b3b310a226a1b8bf6be9ed71cdf045b8e'));
  assert.ok(cases.every((item) => item.penpot.revision === 2879));
  assert.match(cases[0].penpot.board_name, /desktop;state=ready/);
  assert.match(cases[1].penpot.board_name, /mobile;state=ready/);
});

test('OV-40 binds all six factual linked card roots in fixture order', () => {
  const cardRegion = archetype.regions.find((item) => item.region_id === 'club.card');
  assert.deepEqual(cardRegion.penpot_instances.map((item) => item.fixture_slug), [
    'game-vibes', 'neural-researchers', 'technology-researchers',
    'game-vibes', 'neural-researchers', 'technology-researchers',
  ]);
  assert.equal(new Set(cardRegion.penpot_instances.map((item) => item.shape_id)).size, 6);
  assert.ok(cardRegion.penpot_instances.every((item) => item.component.id === contract.penpot.canonical_club_card_component));
  assert.deepEqual(archetype.regions.find((item) => item.region_id === 'club.catalog-grid').penpot_instances.map((item) => item.linked_card_count), [3, 3]);
});

test('OV-40 source-exact correction resolves the ready shelf/catalogue/card scope', () => {
  assert.equal(contract.semantic_resolution.overall_archetype_canonical, false);
  assert.equal(contract.semantic_resolution.club_card.identity_gate.status, 'RESOLVED');
  assert.equal(contract.semantic_resolution.club_card.identity_gate.all_identities_have_exact_source_refs, true);
  assert.deepEqual(contract.astro.fixtures.map((item) => item.slug), ['game-vibes', 'neural-researchers', 'technology-researchers']);
  assert.equal(reuse.nodes.find((item) => item.id === 'club.card').disposition, 'REUSE_FROZEN_OR_RECONCILE');
  assert.equal(archetype.source_exact_correction.sha256, sha256(archetype.source_exact_correction.path));
  assert.deepEqual(contract.semantic_resolution.resolved_scope, [
    'club.mobile-shelf', 'club.catalog-header', 'club.catalog-grid', 'club.card',
  ]);
});

test('OV-40 ready owners use the measured Astro geometry and linked mobile shelf', () => {
  const desktop = cases.find((item) => item.viewport === 'desktop').penpot.direct_children;
  const mobile = cases.find((item) => item.viewport === 'mobile').penpot.direct_children;
  assert.deepEqual(
    desktop.slice(1, 3).map((item) => [item.x, item.y, item.width, item.height]),
    [[50, 89, 1180, 402.953125], [50, 523.953125, 1180, 544]],
  );
  assert.deepEqual(
    mobile.slice(0, 3).map((item) => [item.x, item.y, item.width, item.height]),
    [[1320, 0, 390, 117], [1332, 132.8125, 366, 372.953125], [1332, 521.765625, 366, 1376]],
  );
  assert.equal(mobile[0].component.id, contract.penpot.mobile_shell.component_id);
  assert.match(mobile[0].name, /shelf=visible/);
  assert.equal(desktop[0].component.id, contract.penpot.desktop_shell.component_id);
  assert.match(desktop[0].name, /active=clubs/);
});

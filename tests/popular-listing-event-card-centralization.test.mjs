import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const PATH = 'Event cards / Compact variants / Popular density';
const MEDIA_PATH = 'Event cards / Listing media / Popular corpus';
const GROUP_PATH = 'Popular / Grouping / Fixture';
const ids = new Set([
  '8f804431-c282-8075-8008-8e6c03f62c24',
  '8f804431-c282-8075-8008-8e6b5a53e80d',
  '8f804431-c282-8075-8008-8e6a684a49d4',
  '8f804431-c282-8075-8008-8e6aeee3337f',
  '8f804431-c282-8075-8008-8e6b2e2c9d0e',
  '8f804431-c282-8075-8008-8e6b5e19d033',
  '8f804431-c282-8075-8008-8e6bdb841e65',
  '8f804431-c282-8075-8008-8e6bb3da2302',
  '8f804431-c282-8075-8008-8e6a1de1f155',
  '8f804431-c282-8075-8008-8e6b30f9a275',
  '8f804431-c282-8075-8008-8e6bd83f0a33',
  '8f804431-c282-8075-8008-8e6a358a2a8c',
  '8f804431-c282-8075-8008-8e6a62fe06e9',
  '8f804431-c282-8075-8008-8e6b8763c457',
  '8f804431-c282-8075-8008-8e6bb0f66a4d',
]);

const contract = read('catalog/reconstruction-atlas/v1/popular-listing-event-card-centralization-20260829.v1.json');
const receipt = read('evidence/recovery-20260829/penpot/popular-listing-event-card-centralization-receipt.v1.json');
const bindings = read('catalog/round-trip-reconstruction/v1/bindings.v1.json');
const materializer = readFileSync('scripts/round-trip-reconstruction/penpot-reconcile-popular-listing-event-card-centralization.js', 'utf8');

test('Astro Popular delegates every desktop event to the centralized ListingEventCard owner', () => {
  assert.equal(contract.astro.owner, 'site/src/components/listings/ListingEventCard.astro');
  assert.equal(contract.astro.consumer, 'site/src/components/listings/PopularBehaviorRows.astro');
  assert.equal(contract.astro.callsite, '<ListingEventCard density="popular" ... />');
  assert.equal(contract.authority.astro_commit, '52e220fc112d020b0a979de4ffa0101a3be6d76b');
});

test('Penpot exposes fifteen source-exact Popular-density card masters with visible linked media', () => {
  assert.equal(contract.penpot.canonical_path, PATH);
  assert.equal(contract.penpot.media_path, MEDIA_PATH);
  assert.equal(contract.penpot.variants.length, 15);
  assert.deepEqual(new Set(contract.penpot.variants.map((item) => item.component_id)), ids);
  assert.ok(contract.penpot.variants.every((item) => item.media_visible));
  assert.deepEqual(contract.penpot.validation, []);
  assert.equal(receipt.changes.detached_visible_card_count, 0);
  assert.equal(receipt.native_readback.variants.length, 15);
});

test('all three desktop Popular groups consume five linked centralized cards', () => {
  assert.equal(contract.penpot.groups.length, 3);
  assert.ok(contract.penpot.groups.every((item) => item.component_id && item.owner_instance_id));
  assert.equal(receipt.native_readback.groups.length, 3);
  assert.match(materializer, /linkedCards\.length !== 5/u);
  assert.match(materializer, new RegExp(GROUP_PATH.replaceAll('/', '\\/')));
  assert.doesNotMatch(materializer, /detach\(|uploadMedia|screenshot\(/iu);
});

test('round-trip binding resolves Popular to the same centralized card family and current owner ancestry', () => {
  const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.listing.popular');
  assert.ok(archetype);
  assert.equal(archetype.listing_event_card_centralization.canonical_path, PATH);
  assert.deepEqual(new Set(archetype.listing_event_card_centralization.component_ids), ids);
  const dependency = archetype.dependencies.find((item) => item.component_id === 'listing.event-card.compact');
  const candidates = dependency.penpot_candidates.filter((item) => ids.has(item.id));
  assert.equal(candidates.length, 15);
  assert.ok(candidates.every((item) => item.path === PATH));
  const desktop = archetype.boards.find((item) => item.viewport === 'desktop');
  assert.equal(desktop.penpot.revision, 2909);
  assert.ok(desktop.penpot.direct_children.some((item) => item.component.id === 'a21f5e36-5d76-8065-8008-86ae4bdf9963'));
  assert.ok(desktop.penpot.direct_children.some((item) => item.component.id === 'c0b867fa-32d2-8062-8008-8d679ca1da53'));
  assert.equal(desktop.penpot.direct_children.filter((item) => item.component.path === GROUP_PATH).length, 3);
});

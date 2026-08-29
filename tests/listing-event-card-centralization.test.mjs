import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const PATH = 'Event cards / Compact variants';
const ids = new Set([
  'd87e18f1-dcb4-80a6-8008-87733a67d4bb',
  'd87e18f1-dcb4-80a6-8008-8773575484aa',
  'd87e18f1-dcb4-80a6-8008-877370383914',
  'd87e18f1-dcb4-80a6-8008-87b75354f2ed',
  'd87e18f1-dcb4-80a6-8008-87becba472c7',
]);

test('Date and Weekend resolve the same centralized compact-card family', () => {
  const bindings = read('catalog/round-trip-reconstruction/v1/bindings.v1.json');
  for (const archetypeId of ['archetype.listing.date', 'archetype.listing.weekend']) {
    const archetype = bindings.archetypes.find((item) => item.archetype_id === archetypeId);
    assert.ok(archetype, archetypeId);
    const dependency = archetype.dependencies.find((item) => item.component_id === 'listing.event-card.compact');
    assert.ok(dependency);
    const candidates = dependency.penpot_candidates.filter((candidate) => ids.has(candidate.id));
    assert.equal(candidates.length, 5);
    assert.ok(candidates.every((candidate) => candidate.path === PATH));
    assert.equal(archetype.listing_event_card_centralization.status, 'CORRECTION_VERIFIED');
  }
});

test('the correction receipt preserves native identities and has empty validation', () => {
  const receipt = read('evidence/recovery-20260829/penpot/listing-event-card-centralization-receipt.v1.json');
  assert.equal(receipt.penpot.canonical_path, PATH);
  assert.equal(receipt.penpot.canonical_component_count, 5);
  assert.deepEqual(receipt.penpot.validation, []);
  assert.equal(receipt.changes.component_ids_preserved, true);
  assert.equal(receipt.changes.consumer_instance_ids_preserved, true);
  assert.equal(receipt.dependency_closure.detached_copy_count, 0);
});

test('the source-exact contract pins the one Astro owner and all five Penpot variants', () => {
  const contract = read('catalog/reconstruction-atlas/v1/listing-event-card-centralization-20260829.v1.json');
  assert.equal(contract.astro.owning_component.path, 'site/src/components/listings/ListingEventCard.astro');
  assert.equal(contract.penpot.canonical_path, PATH);
  assert.equal(contract.penpot.variants.length, 5);
  assert.deepEqual(new Set(contract.penpot.variants.map((variant) => variant.component_id)), ids);
  assert.deepEqual(contract.penpot.validation, []);
});


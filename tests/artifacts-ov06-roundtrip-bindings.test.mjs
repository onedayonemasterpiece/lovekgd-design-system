import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const hash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const bindings = read('catalog/round-trip-reconstruction/v1/bindings.v1.json');
const contract = read('catalog/reconstruction-atlas/v1/artifact-collection-1-owner-exact-seven.v1.json');
const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.artifacts');
const cases = bindings.cases.filter((item) => item.archetype_id === 'archetype.artifacts');

test('OV-06 round-trip owners use the exact-seven donor reconstruction', () => {
  assert.equal(JSON.stringify({ archetype, cases }).includes('state=unavailable'), false);
  assert.deepEqual(cases.map((item) => item.height), [2718, 2951]);
  assert.ok(cases.every((item) => item.astro.capture.full_page));
  assert.ok(cases.every((item) => item.penpot.revision === 2794));
  assert.ok(cases.every((item) => /all-found-7-of-7/.test(item.penpot.board_name)));
  assert.deepEqual(contract.penpot.owner_collision_readback.visible_top_level_collisions, []);
});

test('OV-06 binds seven distinct linked artifact identities per viewport', () => {
  const cards = archetype.regions.find((item) => item.region_id === 'artifact.cards').penpot_instances;
  assert.equal(cards.length, 14);
  assert.equal(new Set(cards.filter((item) => item.viewport === 'desktop').map((item) => item.component.id)).size, 7);
  assert.equal(new Set(cards.filter((item) => item.viewport === 'mobile').map((item) => item.component.id)).size, 7);
  assert.deepEqual(cards.filter((item) => item.viewport === 'desktop').map((item) => item.artifact_id), contract.artifacts.map((item) => item.artifact_id));
  assert.equal(archetype.regions.find((item) => item.region_id === 'artifact.reserved-slots').source_exact_disposition, 'not-applicable-exact-seven-no-reserved-slots');
  assert.equal(archetype.source_exact_correction.sha256, hash(archetype.source_exact_correction.path));
});

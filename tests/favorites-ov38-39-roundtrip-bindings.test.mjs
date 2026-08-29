import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const hash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const bindings = read('catalog/round-trip-reconstruction/v1/bindings.v1.json');
const contract = read('catalog/reconstruction-atlas/v1/favorites-ov38-39-populated-source-exact.v1.json');
const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.favorites');
const cases = bindings.cases.filter((item) => item.archetype_id === 'archetype.favorites');

test('OV-38/39 round-trip owners are the populated exact Astro state', () => {
  assert.equal(JSON.stringify({ archetype, cases }).includes('anonymous-empty'), false);
  assert.deepEqual(cases.map((item) => item.height), [2288, 2742]);
  assert.ok(cases.every((item) => item.astro.capture.full_page));
  assert.ok(cases.every((item) => item.penpot.revision === 2794));
  assert.ok(cases.every((item) => /local-only-with-items/.test(item.penpot.board_name)));
});

test('OV-38/39 binds 7030 calendar first then two factual liked events', () => {
  const region = archetype.regions.find((item) => item.region_id === 'favorites.saved-events');
  const cards = region.penpot_instances.filter((item) => item.role === 'saved-event');
  assert.deepEqual(cards.map((item) => [item.event_id, item.saved_source]), [
    ['7030', 'calendar'], ['7006', 'like'], ['6947', 'like'],
    ['7030', 'calendar'], ['7006', 'like'], ['6947', 'like'],
  ]);
  assert.equal(new Set(cards.map((item) => item.shape_id)).size, 6);
  assert.equal(JSON.stringify({ archetype, cases }).includes('event.real.5459'), false);
});

test('OV-38/39 correction is hash-bound without overstating unresolved actions', () => {
  assert.equal(contract.semantic_resolution.populated_state.disposition, 'observed');
  assert.equal(contract.semantic_resolution.populated_state.identity_gate.status, 'RESOLVED');
  assert.deepEqual(contract.semantic_resolution.unresolved_scope, ['favorites.action-refresh']);
  assert.equal(archetype.source_exact_correction.sha256, hash(archetype.source_exact_correction.path));
});

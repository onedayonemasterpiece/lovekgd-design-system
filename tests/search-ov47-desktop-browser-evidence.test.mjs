import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const evidence = JSON.parse(await readFile(new URL('../evidence/recovery-20260829/astro/search-desktop/ov47-search-desktop-browser-geometry.v1.json', import.meta.url), 'utf8'));

test('OV-47 desktop evidence is the complete entered-query Astro page', () => {
  assert.deepEqual(evidence.viewport, { width: 1280, height: 900, dpr: 1 });
  assert.equal(evidence.fixture_event_id, 7003);
  assert.equal(evidence.states.loading55.document.scrollHeight, 4044);
  assert.equal(evidence.states.loading55.root.height, 2685.140625);
  assert.deepEqual(evidence.states.loading55.skeletonCards.map((card) => card.height), [1033.1875, 1033.1875, 128]);
  assert.equal(evidence.states.results.document.scrollHeight, 3682);
  assert.equal(evidence.states.results.root.height, 2323.265625);
  assert.equal(evidence.states.results.eventCard.height, 1623.25);
  assert.equal(evidence.states.results.eventCardRegions.mediaLink.height, 1417.015625);
  assert.equal(evidence.states.results.eventCardRegions.searchFeedback.height, 147.28125);
});

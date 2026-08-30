import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { FREE_COLLECTION_RENDERER_REPRO } = require('../scripts/round-trip-reconstruction/penpot-free-collection-renderer-matrix-repro.js');
const matrix = JSON.parse(readFileSync(new URL('../evidence/page-closure/free-collection-v3/renderer-integrity/renderer-integrity-matrix.json', import.meta.url)));

test('renderer matrix is exact, bounded, and terminally blocked', () => {
  assert.equal(FREE_COLLECTION_RENDERER_REPRO.fileId, '3be9e5e1-190f-8090-8008-713c0fbe6260');
  assert.equal(FREE_COLLECTION_RENDERER_REPRO.pageId, 'fb44de8f-cd63-8060-8008-8f839b2fe1df');
  assert.equal(FREE_COLLECTION_RENDERER_REPRO.exactTitle, 'Донорская акция «Стань донором крови»');
  assert.equal(matrix.route, '/podborki/besplatnye-sobytiya/');
  assert.equal(matrix.fixture_id, 'event.real.8006');
  assert.equal(matrix.status, 'BLOCKED_PENPOT_RENDERER_INTEGRITY_MATRIX_EXHAUSTED');
  assert.deepEqual(matrix.penpot.validation, []);
  assert.deepEqual(Object.keys(matrix.paths), ['A', 'B', 'C']);
});

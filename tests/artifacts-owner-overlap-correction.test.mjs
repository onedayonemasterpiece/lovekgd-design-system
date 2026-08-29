import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const contract = JSON.parse(readFileSync('catalog/reconstruction-atlas/v1/artifact-collection-1-owner-exact-seven.v1.json', 'utf8'));
const receipt = JSON.parse(readFileSync('evidence/recovery-20260828/penpot/artifact-collection-1-owner-exact-seven-receipt.v1.json', 'utf8'));
const materializer = readFileSync('scripts/round-trip-reconstruction/penpot-fix-artifacts-owner-overlap.js', 'utf8');

test('Artifacts owner correction records the actual overlapping evidence root cause', () => {
  const correction = contract.penpot.owner_overlap_correction;
  assert.equal(correction.penpot_revision, 2794);
  assert.match(correction.cause, /painted unrelated evidence over the owner/);
  assert.deepEqual(correction.owner_collisions_after, []);
  assert.deepEqual(correction.page_validation_after, []);
  assert.deepEqual(correction.moved_top_level_shapes, receipt.overlap_correction_readback.moved_top_level_shapes);
});

test('Artifacts correction is reproducible and does not claim a new visual PASS', () => {
  for (const item of receipt.overlap_correction_readback.moved_top_level_shapes) {
    assert.match(materializer, new RegExp(item.id));
    assert.match(materializer, new RegExp(`y: ${item.y}`));
  }
  assert.equal(receipt.overlap_correction_readback.visual_export, 'DEFERRED_DUE_ACTIVE_504_INCIDENT');
  assert.equal(receipt.overlap_correction_readback.owner_acceptance, 'NOT_CLAIMED');
  assert.equal(contract.acceptance.bounded_visual_exports, 'STALE_AFTER_OVERLAP_CORRECTION_EXPORT_DEFERRED');
});

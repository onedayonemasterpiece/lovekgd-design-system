import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const receiptUrl = new URL('../evidence/recovery-20260829/penpot/free-collection-september-v2/bounded-three-card-review-readback.v1.json', import.meta.url);
const receipt = JSON.parse(await readFile(receiptUrl, 'utf8'));
const crop = await readFile(new URL('../evidence/recovery-20260829/penpot/free-collection-september-v2/astro-desktop-exhibitions-row-3.png', import.meta.url));

test('bounded review uses exactly three September golden fixtures and one central EventCard variant', () => {
  assert.deepEqual(receipt.scope.fixtures, [2182, 6711, 7609]);
  assert.equal(receipt.penpot.slots.length, 3);
  for (const slot of receipt.penpot.slots) {
    assert.equal(slot.is_component_copy, true);
    assert.equal(slot.component_id, receipt.penpot.central_variant.id);
    assert.equal(slot.nested_canonical_base_id, receipt.penpot.canonical_base.id);
    assert.equal(slot.image_data_type, 'function');
  }
  assert.deepEqual(receipt.penpot.validation_errors, []);
});

test('bounded Astro crop is immutable and hash-verified', () => {
  const sha256 = createHash('sha256').update(crop).digest('hex');
  assert.equal(sha256, receipt.astro_source.crop.sha256);
  assert.equal(receipt.astro_source.crop.width, 1082);
  assert.equal(receipt.astro_source.crop.height, 623);
});

test('export blocker cannot be promoted to a visual conformance pass', () => {
  assert.equal(receipt.status, 'BLOCKED_PENPOT_EXPORT_HTTP_504');
  assert.equal(receipt.export_attempts.length, 2);
  assert.equal(receipt.export_attempts[1].dimensions, '347.328125x622.09375');
  assert.equal(receipt.result.penpot_png, 'NOT_PRODUCED');
  assert.equal(receipt.result.overlay, 'NOT_RUN');
  assert.equal(receipt.result.pixel_diff, 'NOT_RUN');
  assert.equal(receipt.result.visual_conformance, 'BLOCKED');
  assert.notEqual(receipt.result.visual_conformance, 'PASS');
});

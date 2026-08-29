import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
const json = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const contract = await json('../catalog/reconstruction-atlas/v1/festivals-ov41-43-source-exact.v1.json');
const browser = await json('../evidence/recovery-20260828/astro/ov41-43-festivals-browser-evidence.v1.json');
const receipt = await json('../evidence/recovery-20260828/penpot/festivals-ov41-43-source-exact-receipt.v1.json');
const pngSize = (buffer) => [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

test('OV-41/43 uses all 21 factual festivals and emphasized source metrics', () => {
  assert.deepEqual(contract.review_items, ['OV-41', 'OV-42', 'OV-43']);
  assert.equal(browser.festival_count, 21); assert.equal(browser.titles_in_source_order.length, 21);
  assert.deepEqual(browser.months.map((item) => item.count), [1, 7, 5, 5, 2, 1]);
  assert.equal(contract.source_truth.period, 'Июль—декабрь');
});

test('OV-41 proves source row variants and complete owner sizes', () => {
  assert.deepEqual(contract.source_truth.desktop_row_formations, [[1], [4, 3], [4, 1], [4, 1], [2], [1]]);
  assert.deepEqual(receipt.structural_readback.desktop_owner_size, [1280, 3604]);
  assert.deepEqual(receipt.structural_readback.mobile_owner_size, [390, 4091]);
  assert.equal(receipt.structural_readback.packed_rows_linked_instances, 12);
  assert.equal(receipt.structural_readback.packed_rows_detached_instances, 0);
});

test('OV-41/42/43 exports are durable and acceptance is not claimed', async () => {
  for (const item of [contract.visual_evidence.desktop, contract.visual_evidence.mobile, contract.visual_evidence.packed_rows]) {
    const buffer = await readFile(new URL(`../${item.path}`, import.meta.url));
    assert.deepEqual(pngSize(buffer), item.dimensions); assert.equal(sha256(buffer), item.sha256);
  }
  assert.deepEqual(receipt.penpot.validation, []);
  assert.equal(contract.visual_evidence.owner_acceptance, 'NOT_CLAIMED');
  assert.equal(contract.processed, false);
});

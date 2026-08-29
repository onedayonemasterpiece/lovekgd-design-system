import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const json = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const contract = await json('../catalog/reconstruction-atlas/v1/focus-group-ov35-source-exact.v1.json');
const receipt = await json('../evidence/recovery-20260828/penpot/focus-group-ov35-source-exact-receipt.v1.json');
const pngSize = (buffer) => [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

test('OV-35 binds the Focus Group atlas to the factual invitation and OTP route', () => {
  assert.deepEqual(contract.review_items, ['OV-35']);
  assert.equal(contract.processed, false);
  assert.equal(contract.authority.route, '/fokus-gruppa/priglashenie/');
  assert.equal(contract.source_truth.otp_digit_count, 6);
  assert.equal(contract.source_truth.otp_auto_submit, true);
  assert.match(contract.source_truth.otp_status, /шестой цифры/u);
});

test('OV-35 Penpot has four native owners and the tested six-box OTP state', () => {
  assert.equal(receipt.structural_readback.owner_count, 4);
  assert.deepEqual(receipt.structural_readback.native_otp_digit_boxes, { desktop: 6, mobile: 6 });
  assert.equal(receipt.structural_readback.page_screenshot_overlays, 0);
  assert.equal(receipt.structural_readback.superseded_programme_components_hidden, 9);
  assert.deepEqual(receipt.penpot.validation, []);
});

test('OV-35 Astro and Penpot exports are durable without claiming acceptance', async () => {
  for (const item of [...Object.values(contract.astro_visual_evidence), ...Object.values(contract.visual_evidence).filter((item) => item && item.path)]) {
    const buffer = await readFile(new URL(`../${item.path}`, import.meta.url));
    assert.deepEqual(pngSize(buffer), item.dimensions);
    assert.equal(sha256(buffer), item.sha256);
  }
  assert.equal(contract.visual_evidence.owner_acceptance, 'NOT_CLAIMED');
  assert.equal(receipt.visual_qa.owner_rereview_required, true);
});

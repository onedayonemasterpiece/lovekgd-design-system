import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const json = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const contract = await json('../catalog/reconstruction-atlas/v1/event-detail-ov55-56-source-states.v1.json');
const browser = await json('../evidence/recovery-20260828/astro/ov55-56-event-detail-browser-evidence.v1.json');
const receipt = await json('../evidence/recovery-20260828/penpot/event-detail-ov55-56-source-states-receipt.v1.json');
const pngSize = (buffer) => [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

test('OV-55/56 contract uses factual portrait and transport fixtures without overclaiming', () => {
  assert.deepEqual(contract.review_items, ['OV-55', 'OV-56']);
  assert.equal(contract.processed, false);
  assert.equal(contract.authority.terminology, 'Hero image');
  assert.equal(contract.astro.portrait.fixture, 'event.real.4783');
  assert.equal(contract.astro.continuation.fixture, 'event.real.4671');
  assert.deepEqual(contract.astro.continuation.order, ['transport', 'related', 'footer']);
  assert.equal(contract.future.floating_island, 'DEFERRED_FUTURE_WAVE_NOT_PART_OF_AS_IS');
});

test('OV-55/56 browser evidence proves vertical-series viewer and continuation DOM order', () => {
  assert.equal(browser.portrait.attributes['data-desktop-family'], 'split');
  assert.equal(browser.portrait.attributes['data-split-efficient-viewer'], 'true');
  assert.equal(browser.portrait.viewerItems, 7);
  assert.equal(browser.continuation.domOrder.transportBeforeRelated, true);
  assert.equal(browser.continuation.domOrder.relatedBeforeFooter, true);
  assert.equal(browser.continuation.relatedCards, 6);
  assert.equal(browser.errors.length, 5);
});

test('OV-55/56 Penpot exports and receipt are durable, linked and rereview-bound', async () => {
  for (const evidence of Object.values(contract.visual_evidence).filter((value) => value && typeof value === 'object' && value.path)) {
    const buffer = await readFile(new URL(`../${evidence.path}`, import.meta.url));
    assert.deepEqual(pngSize(buffer), evidence.dimensions);
    assert.equal(sha256(buffer), evidence.sha256);
  }
  assert.deepEqual(receipt.structural_readback.page_validation, []);
  assert.equal(receipt.native_ancestry.detached_instances, 0);
  assert.equal(receipt.visual_qa.result, 'PASS');
  assert.equal(receipt.visual_qa.owner_acceptance, 'NOT_CLAIMED');
});

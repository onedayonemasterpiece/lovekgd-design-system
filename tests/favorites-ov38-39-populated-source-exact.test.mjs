import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const json = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const contract = await json('../catalog/reconstruction-atlas/v1/favorites-ov38-39-populated-source-exact.v1.json');
const browser = await json('../evidence/recovery-20260828/astro/ov38-39-favorites-browser-evidence.v1.json');
const receipt = await json('../evidence/recovery-20260828/penpot/favorites-ov38-39-populated-source-exact-receipt.v1.json');
const pngSize = (buffer) => [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

test('OV-38/39 contract follows real calendar-first and like semantics', () => {
  assert.deepEqual(contract.review_items, ['OV-38', 'OV-39']);
  assert.equal(contract.processed, false);
  assert.deepEqual(contract.astro.fixtures.map((item) => item.event_id), ['7030', '7006', '6947']);
  assert.deepEqual(contract.astro.fixtures.map((item) => item.saved_source), ['calendar', 'like', 'like']);
  assert.equal(contract.astro.desktop.columns, 3);
  assert.equal(contract.astro.mobile.columns, 1);
});

test('OV-38/39 browser evidence proves exact future populated state', () => {
  assert.deepEqual(browser.desktop.cards.map((item) => item.id), ['7030', '7006', '6947']);
  assert.deepEqual(browser.desktop.cards.map((item) => item.savedSource), ['calendar', 'like', 'like']);
  assert.equal(browser.desktop.cards[0].calendar.text, 'Добавлено');
  assert.equal(browser.desktop.cards[1].like.pressed, 'true');
  assert.equal(browser.desktop.cards[2].like.pressed, 'true');
  assert.equal(browser.desktop.overflowX, 0);
  assert.equal(browser.mobile.overflowX, 0);
  assert.deepEqual(browser.errors, []);
});

test('OV-38/39 visual evidence is durable and does not claim owner acceptance', async () => {
  for (const item of [contract.visual_evidence.desktop, contract.visual_evidence.mobile]) {
    const buffer = await readFile(new URL(`../${item.path}`, import.meta.url));
    assert.deepEqual(pngSize(buffer), item.dimensions);
    assert.equal(sha256(buffer), item.sha256);
  }
  assert.deepEqual(receipt.structural_readback.page_validation, []);
  assert.equal(receipt.native_ancestry.detached_instances, 0);
  assert.equal(receipt.visual_qa.owner_acceptance, 'NOT_CLAIMED');
});

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const json = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const contract = await json('../catalog/reconstruction-atlas/v1/interest-clubs-ov40-source-exact.v1.json');
const receipt = await json('../evidence/recovery-20260828/penpot/interest-clubs-ov40-source-exact-receipt.v1.json');
const pngSize = (buffer) => [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

test('OV-40 contract contains exactly the three factual Astro clubs', () => {
  assert.deepEqual(contract.review_items, ['OV-40']);
  assert.equal(contract.processed, false);
  assert.deepEqual(contract.astro.fixtures.map((item) => item.slug), [
    'game-vibes', 'neural-researchers', 'technology-researchers',
  ]);
  assert.equal(receipt.source_readback.empty_state_allowed, false);
});

test('OV-40 Penpot owners retain six linked canonical card roots', () => {
  assert.equal(contract.penpot.linked_card_roots.desktop, 3);
  assert.equal(contract.penpot.linked_card_roots.mobile, 3);
  assert.equal(contract.penpot.linked_card_roots.detached, 0);
  assert.equal(receipt.native_ancestry.canonical_club_card_component, contract.penpot.canonical_club_card_component);
  assert.match(contract.penpot.headers.desktop.name, /state=ready;catalog=3/);
  assert.match(contract.penpot.headers.mobile.name, /state=ready;catalog=3/);
  assert.deepEqual(receipt.structural_readback.page_validation, []);
});

test('OV-40 full-owner exports are durable without claiming acceptance', async () => {
  for (const item of [contract.visual_evidence.desktop, contract.visual_evidence.mobile]) {
    const buffer = await readFile(new URL(`../${item.path}`, import.meta.url));
    assert.deepEqual(pngSize(buffer), item.dimensions);
    assert.equal(sha256(buffer), item.sha256);
  }
  assert.equal(contract.visual_evidence.owner_acceptance, 'NOT_CLAIMED');
  assert.equal(receipt.visual_qa.owner_rereview_required, true);
});

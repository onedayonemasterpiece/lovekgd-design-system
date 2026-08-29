import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const json = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const contract = await json('../catalog/reconstruction-atlas/v1/search-ov47-mobile-source-exact.v1.json');
const browser = await json('../evidence/recovery-20260828/astro/ov47-search-browser-evidence.v1.json');
const receipt = await json('../evidence/recovery-20260828/penpot/search-ov47-mobile-source-exact-receipt.v1.json');
const lifecycle = await json('../evidence/recovery-20260829/penpot/search-ov47-mobile-lifecycle-receipt.v1.json');
const loadingPng = await readFile(new URL('../evidence/recovery-20260828/penpot/ov47-search-loading-mobile-source-exact.png', import.meta.url));
const resultsPng = await readFile(new URL('../evidence/recovery-20260828/penpot/ov47-search-results-mobile-source-exact.png', import.meta.url));
const pngSize = (buffer) => [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

test('OV-47/48 contract uses the complete entered-query Astro pages', () => {
  assert.deepEqual(contract.review_items, ['OV-47', 'OV-48']);
  assert.equal(contract.processed, false);
  assert.equal(contract.authority.route, '/poisk/');
  assert.equal(contract.astro.query, 'послушать хор');
  assert.deepEqual(contract.astro.loading.document_size, [390, 2626]);
  assert.deepEqual(contract.astro.results.document_size, [390, 2521]);
  assert.deepEqual(contract.astro.results.event_card, [12, 637.71875, 366, 656.71875]);
});

test('OV-47 browser evidence contains progress, skeleton and canonical result anatomy', () => {
  assert.equal(browser.loading.submit.text, 'Ищу…');
  assert.deepEqual(browser.loading.skeletonCards.map((card) => card.height), [418.125, 418.125, 128]);
  assert.equal(browser.results.status.text, 'Найдено: 1');
  assert.equal(browser.results.resultCard.width, 366);
  assert.deepEqual(browser.errors, []);
});

test('OV-47 Penpot exports and receipt are durable and do not overclaim acceptance', () => {
  assert.deepEqual(pngSize(loadingPng), [390, 2626]);
  assert.deepEqual(pngSize(resultsPng), [390, 2521]);
  assert.equal(sha256(loadingPng), contract.visual_evidence.loading_sha256);
  assert.equal(sha256(resultsPng), contract.visual_evidence.results_sha256);
  assert.deepEqual(receipt.structural_readback.page_validation, []);
  assert.equal(receipt.source_phrase_chain.count, 9);
  assert.equal(receipt.visual_qa.result, 'MOBILE_LOADING_RESULTS_PASS_LIFECYCLE_STRUCTURAL_VERIFIED_DESKTOP_STRUCTURAL_VERIFIED');
  assert.equal(lifecycle.penpot.states.length, 6);
  assert.equal(lifecycle.penpot.idempotency.second_run_created, 0);
  assert.deepEqual(lifecycle.penpot.validation, []);
  assert.match(lifecycle.source_dispositions.stale, /do not repaint/u);
  assert.deepEqual(contract.coverage.open_required_states, []);
  assert.equal(contract.visual_evidence.desktop_export_status, 'DEFERRED_EXISTING_EXPORTER_504_INCIDENT_NO_BLIND_RETRY');
  assert.equal(receipt.visual_qa.owner_acceptance, 'NOT_CLAIMED');
});

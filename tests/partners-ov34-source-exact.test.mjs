import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const json = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const contract = await json('../catalog/reconstruction-atlas/v1/partners-ov34-source-exact.v1.json');
const receipt = await json('../evidence/recovery-20260828/penpot/partners-ov34-source-exact-receipt.v1.json');
const bindings = await json('../catalog/round-trip-reconstruction/v1/bindings.v1.json');
const pngSize = (buffer) => [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

test('OV-34 contract is anchored to the factual current Astro partners route', () => {
  assert.deepEqual(contract.review_items, ['OV-34']);
  assert.equal(contract.processed, false);
  assert.equal(contract.authority.route, '/partners/');
  assert.equal(contract.source_truth.partner_count, 6);
  assert.deepEqual(contract.source_truth.partner_ids, [
    'kppk-rzd', 'znanie-russia', 'kgd80', 'kantata-education', 'act-opus', 'icae-kaliningrad',
  ]);
  assert.equal(contract.source_truth.page_local_partnership_funnel, false);
});

test('OV-34 round-trip bindings no longer point to the superseded partnership funnel', () => {
  const archetype = bindings.archetypes.find(({ archetype_id }) => archetype_id === 'archetype.information-pages');
  assert.equal(archetype.source_exact_correction.contract_id, contract.contract_id);
  for (const board of archetype.boards) {
    assert.equal(board.astro.route, '/partners/');
    assert.equal(board.penpot.revision, 2889);
    assert.match(board.penpot.board_name, /route=partners;fixtures=6/u);
  }
  const logoGrid = archetype.dependencies.find(({ component_id }) => component_id === 'partners.logo-grid');
  assert.equal(logoGrid.source_exact_resolution.status, 'RESOLVED_TO_SIX_FACTUAL_PARTNERS');
  assert.equal(logoGrid.source_exact_resolution.page_local_partnership_funnel, false);
});

test('OV-34 Penpot owners are linked native compositions rather than screenshot overlays', () => {
  assert.equal(receipt.structural_readback.native_partner_logos_per_viewport, 6);
  assert.equal(receipt.structural_readback.page_screenshot_overlays, 0);
  assert.equal(receipt.structural_readback.superseded_partnerstvo_components_hidden, 6);
  assert.equal(receipt.structural_readback.desktop_direct_linked_components.length, 3);
  assert.equal(receipt.structural_readback.mobile_direct_linked_components.length, 3);
  assert.deepEqual(receipt.penpot.validation, []);
});

test('OV-34 Astro and Penpot exports are durable without claiming owner acceptance', async () => {
  for (const item of [
    contract.astro_visual_evidence.desktop,
    contract.astro_visual_evidence.mobile,
    contract.visual_evidence.desktop,
    contract.visual_evidence.mobile,
  ]) {
    const buffer = await readFile(new URL(`../${item.path}`, import.meta.url));
    assert.deepEqual(pngSize(buffer), item.dimensions);
    assert.equal(sha256(buffer), item.sha256);
  }
  assert.equal(contract.visual_evidence.owner_acceptance, 'NOT_CLAIMED');
  assert.equal(receipt.visual_qa.owner_rereview_required, true);
});

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const superseded = await readJson('../catalog/reconstruction-atlas/v1/artifacts-astro-as-is-owner-projection.v1.json');
const contract = await readJson('../catalog/reconstruction-atlas/v1/artifact-collection-1-owner-exact-seven.v1.json');
const receipt = await readJson('../evidence/recovery-20260828/penpot/artifact-collection-1-owner-exact-seven-receipt.v1.json');
const materializer = await readFile(
  new URL('../scripts/round-trip-reconstruction/penpot-materialize-artifacts-ov06-visual-donor.js', import.meta.url),
  'utf8',
);

test('OV-06 supersedes the stale 1-of-5 projection with the owner exact seven', () => {
  assert.equal(superseded.status, 'SUPERSEDED_BY_OWNER_EXACT_SEVEN');
  assert.equal(superseded.authority_disposition.current_astro_as_is.implemented_artifact_count, 7);
  assert.equal(superseded.authority_disposition.current_astro_as_is.collection_slot_count, 7);
  assert.equal(superseded.acceptance.replacement_contract, 'catalog/reconstruction-atlas/v1/artifact-collection-1-owner-exact-seven.v1.json');
  assert.equal(superseded.acceptance.processed, false);
});

test('OV-06 exact contract has seven distinct source-backed identities and native masters', () => {
  assert.equal(contract.review_item, 'OV-06');
  assert.equal(contract.authority.owner_decision_commit, 'f5ea5e497a3c137e350645e0f6c35304853a8908');
  assert.equal(contract.authority.cardinality, 7);
  assert.equal(contract.artifacts.length, 7);
  assert.equal(new Set(contract.artifacts.map(({ artifact_id }) => artifact_id)).size, 7);
  assert.equal(new Set(contract.artifacts.map(({ source_sha256 }) => source_sha256)).size, 7);
  assert.equal(new Set(contract.artifacts.map(({ penpot_component_id }) => penpot_component_id)).size, 7);
  assert.ok(contract.artifacts.every(({ source_sha256 }) => source_sha256.length === 64));
  assert.equal(contract.acceptance.detached_artifact_root_instances, 0);
  assert.deepEqual(contract.acceptance.page_validation, []);
  assert.equal(contract.processed, false);
});

test('OV-06 state matrix includes none, subset, all, interactions and desktop/mobile detail', () => {
  assert.deepEqual(contract.penpot.state_boards.map(({ state }) => state), [
    'none-found',
    'subset-found-3-of-7',
    'all-found-7-of-7',
    'hover-and-keyboard-focus',
    'selected-detail-desktop',
    'selected-detail-mobile',
  ]);
  assert.ok(contract.penpot.state_boards.every(({ artifact_root_instances }) => artifact_root_instances >= 7));
  assert.equal(receipt.native_readback.desktop_body.cards, 7);
  assert.equal(receipt.native_readback.mobile_body.cards, 7);
  assert.equal(new Set(receipt.native_readback.desktop_body.linked_artifact_component_ids).size, 7);
  assert.equal(new Set(receipt.native_readback.mobile_body.linked_artifact_component_ids).size, 7);
});

test('OV-06 recovery keeps the pre-presentation build as visual base and materializes native owners', () => {
  assert.equal(
    contract.authority.primary_visual_donor_commit,
    '008839b14598105d1fed5b4e386d6d6f29d93d1f',
  );
  assert.match(contract.authority.primary_visual_donor_rule, /base visual composition/u);
  assert.equal(contract.astro.commit, '70d43a87bf7fdfb748ace6218f17befd0613d01a');
  assert.deepEqual(contract.penpot.corrected_existing_masters.desktop.geometry, { width: 1180, height: 1900 });
  assert.deepEqual(contract.penpot.corrected_existing_masters.mobile.geometry, { width: 366, height: 2700 });
  assert.deepEqual(contract.penpot.corrected_existing_masters.desktop.owner_geometry, { width: 1280, height: 2718 });
  assert.deepEqual(contract.penpot.corrected_existing_masters.mobile.owner_geometry, { width: 390, height: 2951 });
  assert.equal(contract.penpot.source_projection_count, 0);
  assert.equal(receipt.native_readback.source_projection_count, 0);
  assert.equal(receipt.native_readback.screenshot_fill_count, 0);
  assert.equal(receipt.native_readback.desktop_body.detached_artifact_visuals, 0);
  assert.equal(receipt.native_readback.mobile_body.detached_artifact_visuals, 0);
  assert.deepEqual(receipt.native_readback.page_validation, []);
  assert.ok(receipt.visual_readback.bounded_direct_exports.every(({ status }) => status === 'PASS'));
  assert.match(receipt.saved_version.label, /full artifact visuals/u);
});

test('OV-06 Penpot materializer uses linked native artifact components and forbids screenshot projection', () => {
  assert.match(materializer, /component\.instance\(\)/u);
  assert.match(materializer, /linked Artifact visual/u);
  assert.match(materializer, /sourceProjectionCount/u);
  assert.doesNotMatch(materializer, /uploadMedia|fillImage|source projection|screenshot fill/iu);
  assert.doesNotMatch(materializer, /detach\(/u);
});

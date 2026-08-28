import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const superseded = await readJson('../catalog/reconstruction-atlas/v1/artifacts-astro-as-is-owner-projection.v1.json');
const contract = await readJson('../catalog/reconstruction-atlas/v1/artifact-collection-1-owner-exact-seven.v1.json');
const receipt = await readJson('../evidence/recovery-20260828/penpot/artifact-collection-1-owner-exact-seven-receipt.v1.json');

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
  assert.equal(receipt.structural_readback.every_state_contains_all_seven_distinct_linked_component_roots, true);
  assert.equal(receipt.visual_readback.focused_all_found_export.status, 'HTTP_504_AFTER_EXACT_STRUCTURAL_READBACK');
  assert.equal(receipt.visual_readback.focused_all_found_export.retry, 'not_performed');
});

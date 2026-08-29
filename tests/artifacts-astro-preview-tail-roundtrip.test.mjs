import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const hash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

const evidencePath = 'evidence/recovery-20260829/astro/artifacts-preview-tail-r11/artifacts-astro-roundtrip-evidence.v1.json';
const evidence = read(evidencePath);
const contract = read('catalog/reconstruction-atlas/v1/artifact-collection-1-owner-exact-seven.v1.json');
const linkage = read('catalog/product-atlas-linkage-handoff/v1/design-system-linkage.v1.json');

test('OV-06 correct preview feature tuple renders the real exact-seven collection', () => {
  assert.equal(evidence.astro_commit, '812ffc279728221b547707474bcb521f27c4a73d');
  assert.equal(evidence.build_env.PUBLIC_SITE_MODE, 'preview');
  assert.equal(evidence.build_env.PUBLIC_ENABLE_AMBER_ARTIFACT_RESEARCH, 'tail');
  assert.deepEqual(evidence.tests, { generated: '2/2 pass', source: '6/6 pass' });

  const expectedNames = contract.artifacts.map((artifact) => artifact.public_name);
  for (const viewport of ['desktop', 'mobile']) {
    const state = evidence.states[viewport];
    assert.deepEqual([state.empty.slots, state.empty.found, state.empty.empty], [7, 0, 7]);
    assert.deepEqual([state.all_found.slots, state.all_found.found, state.all_found.empty], [7, 7, 0]);
    assert.deepEqual(state.all_found.publicNames, expectedNames);
    assert.equal(state.all_found.images_loaded, 7);
    assert.equal(state.all_found.dialogs, 7);
    assert.equal(state.all_found.donorMarker, true);
    assert.equal(state.all_found.titlePresent, true);
    assert.equal(state.all_found.unavailable, false);
    assert.equal(state.all_found.soonCopy, false);
  }
});

test('OV-06 selected Penpot owner is the native exact-seven board, not the stale unavailable frame', () => {
  const penpot = evidence.penpot_selected_owner_readback;
  assert.equal(penpot.page_id, 'd87e18f1-dcb4-80a6-8008-880f9a822a76');
  assert.equal(penpot.selected_at_readback, 'desktop');
  assert.deepEqual(penpot.validation, []);

  for (const viewport of ['desktop', 'mobile']) {
    const owner = penpot[viewport];
    assert.match(owner.board_name, /state=all-found-7-of-7 · native donor reconstruction/u);
    assert.doesNotMatch(owner.board_name, /state=(?:unavailable|ready)/u);
    assert.equal(owner.hidden, false);
    assert.equal(owner.direct_linked_regions.length, 3);
    assert.equal(hash(owner.visual_evidence.path), owner.visual_evidence.sha256);
    assert.equal(evidence.geometry_comparison[viewport].width_equal, true);
  }
  assert.ok(evidence.geometry_comparison.desktop.height_delta_px <= 49);
  assert.ok(evidence.geometry_comparison.mobile.height_delta_px <= 19);
});

test('Product Atlas linkage no longer advertises the stale Artifacts owner names', () => {
  const artifacts = linkage.archetypes.find((item) => item.archetype_id === 'archetype.artifacts');
  assert.ok(artifacts);
  assert.deepEqual(artifacts.fixture_slots.find((item) => item.slot_id === 'collection-1-exact-seven').fixture_refs,
    contract.artifacts.map((artifact) => artifact.artifact_id));
  assert.equal(artifacts.penpot.boards.length, 2);
  assert.ok(artifacts.penpot.boards.every((board) => /state=all-found-7-of-7 · native donor reconstruction/u.test(board.board_name)));
  assert.ok(artifacts.penpot.boards.every((board) => !/state=unavailable/u.test(board.board_name)));
});

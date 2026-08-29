import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const contract = JSON.parse(await readFile(new URL('../catalog/reconstruction-atlas/v1/floating-action-island-ov20-22-source-exact.v1.json', import.meta.url)));
const receipt = JSON.parse(await readFile(new URL('../evidence/recovery-20260829/penpot/floating-action-island-ov20-22-native-receipt.v1.json', import.meta.url)));
const materializer = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-floating-action-island-ov20-22.js', import.meta.url), 'utf8');

test('OV-20/21 keeps one action family and a counter-responsive Like control', () => {
  assert.equal(contract.authority.astro_commit, '4d660b079');
  assert.equal(contract.requirements.one_canonical_action_family, true);
  assert.match(contract.requirements.like_counter_sizing, /content-responsive/u);
  assert.deepEqual(contract.penpot.canonical_like_size, [77, 52]);
  assert.equal(receipt.native_readback.desktop_owner.like_width, 77);
  assert.equal(receipt.native_readback.mobile_owner.like_width, 77);
});

test('OV-22 materializes explicit label states from linked canonical actions', () => {
  assert.deepEqual(contract.requirements.explicit_label_states, ['calendar-label', 'share-label', 'icons-only']);
  assert.equal(contract.penpot.matrix_linked_actions, 9);
  assert.equal(receipt.native_readback.responsive_matrix.detached_action_roots, 0);
  assert.match(materializer, /target\.instance\(\)/u);
  assert.doesNotMatch(materializer, /uploadMedia|fillImage\s*=|screenshot/iu);
});

test('OV-20/22 hides the owner-rejected baselines without claiming visual or owner acceptance', () => {
  assert.equal(contract.penpot.hidden_rejected_baselines, 2);
  assert.equal(receipt.visual_readback.status, 'BLOCKED_BY_EXTERNAL_PENPOT_EXPORTER');
  assert.equal(receipt.visual_readback.attempts, 2);
  assert.equal(contract.acceptance.owner_acceptance, 'NOT_CLAIMED');
  assert.equal(contract.processed, false);
});

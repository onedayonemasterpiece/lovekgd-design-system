import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const receipt = JSON.parse(await readFile(new URL('../evidence/recovery-20260829/penpot/favorites-event-card-runtime-parity-receipt.v1.json', import.meta.url), 'utf8'));
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
const pngSize = (buffer) => [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];

test('Favorites correction uses one centralized EventCard family at the Astro widths', () => {
  assert.equal(receipt.penpot_correction.canonical_components.desktop, 'b0fe69fd-ccaf-8025-8008-846f0b7f12cd');
  assert.equal(receipt.penpot_correction.canonical_components.mobile, '7f078c80-87b8-80f5-8008-85839e8975f6');
  assert.deepEqual(receipt.penpot_correction.corrected_cards.desktop.map((card) => card.size[0]), [380, 380, 380]);
  assert.deepEqual(receipt.penpot_correction.corrected_cards.mobile.map((card) => card.size[0]), [366, 366, 366]);
  assert.equal(receipt.penpot_correction.text_layout.meta_rows_wrap_admission_below_type_and_occurrence, true);
});

test('Favorites correction removes the six owner-local duplicate Calendar actions', () => {
  assert.equal(receipt.penpot_correction.removed_duplicate_calendar_action_ids.length, 6);
  assert.equal(new Set(receipt.penpot_correction.removed_duplicate_calendar_action_ids).size, 6);
  assert.deepEqual(receipt.penpot_correction.validation, []);
});

test('Favorites correction keeps runtime and Penpot visual evidence durable without claiming acceptance', async () => {
  const shots = [
    receipt.astro_runtime.desktop.screenshot,
    receipt.astro_runtime.mobile.screenshot,
    receipt.visual_readback.desktop,
    receipt.visual_readback.mobile,
  ];
  for (const shot of shots) {
    const buffer = await readFile(new URL(`../${shot.path}`, import.meta.url));
    assert.deepEqual(pngSize(buffer), shot.dimensions);
    assert.equal(sha256(buffer), shot.sha256);
  }
  assert.equal(receipt.visual_readback.owner_acceptance, 'NOT_CLAIMED');
  assert.match(receipt.visual_readback.result, /OWNER_REREVIEW_REQUIRED/);
});

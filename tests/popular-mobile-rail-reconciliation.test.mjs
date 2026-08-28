import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const lineage = await readJson('../evidence/recovery-20260828/penpot/popular-mobile-rail-lineage-census.v1.json');
const media = await readJson('../catalog/reconstruction-atlas/v1/mobile-rail-media-astro-penpot-reconciliation.v1.json');

test('OV-01 page census has one canonical Rail family and no surviving former roots', () => {
  assert.equal(lineage.census.canonical_root_count, 26);
  assert.equal(lineage.census.exact_date_root_count, 22);
  assert.equal(lineage.census.period_root_count, 4);
  assert.equal(lineage.census.root_instances.length, 26);
  assert.equal(new Set(lineage.census.root_instances.map(({ id }) => id)).size, 26);
  assert.equal(lineage.former_page_local_component.current_copy_count, 0);
  assert.equal(lineage.census.alternative_mobile_rail_root_component_count, 0);
  assert.equal(lineage.census.detached_root_count, 0);
  assert.deepEqual(lineage.penpot.validation, []);
});

test('OV-01 preserves the exact source-backed period canary', () => {
  assert.equal(lineage.period_canary.event, 'event.real.5459');
  assert.equal(lineage.period_canary.root_ids.length, 2);
  assert.equal(lineage.period_canary.text, '5 июня–\n30 августа');
});

test('OV-02 fails closed on protected media instead of hiding the mismatch', () => {
  assert.equal(media.authority.design_media_component.astro_symbol_exists, false);
  assert.equal(media.confirmed_penpot_mismatches.length, 2);
  for (const mismatch of media.confirmed_penpot_mismatches) {
    assert.equal(mismatch.astro_expected.fit, 'contain');
    assert.equal(mismatch.astro_expected.width, 75);
    assert.equal(mismatch.penpot_observed.treatment, 'cover crop');
  }
  assert.equal(media.next_gate.component_change_required, true);
  assert.equal(media.processed, false);
});

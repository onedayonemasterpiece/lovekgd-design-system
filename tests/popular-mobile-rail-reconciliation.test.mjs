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

test('OV-02 matches the real-data Astro fixture and corrected linked media states', () => {
  assert.equal(media.status, 'READY_FOR_OWNER_REREVIEW');
  assert.equal(media.authority.astro_commit, '49c351873');
  assert.equal(media.certified_components.authored_contain_1702x2553.component_id, '8f804431-c282-8075-8008-8db194fb8344');
  assert.deepEqual(media.certified_components.authored_contain_1702x2553.geometry, [75, 112]);
  const cases = Object.fromEntries(media.corrected_cases.map((item) => [item.event, item]));
  assert.deepEqual(cases['event.real.6936'].runtime, { fit: 'contain', width: 75, height: 112, reason: 'protected_natural_geometry' });
  assert.deepEqual(cases['event.real.6652'].runtime, { fit: 'cover', width: 140, height: 112, reason: 'source_reviewed_safe_override' });
  assert.ok(media.corrected_cases.every(({ result }) => result === 'MATCH'));
  assert.deepEqual(media.acceptance.penpot_validation, []);
  assert.equal(media.processed, false);
});

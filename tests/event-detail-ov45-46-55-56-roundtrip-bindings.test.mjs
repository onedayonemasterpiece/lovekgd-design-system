import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const bindings = read('catalog/round-trip-reconstruction/v1/bindings.v1.json');
const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.event-detail');
const cases = bindings.cases.filter((item) => item.archetype_id === 'archetype.event-detail');

test('OV-45/46 round-trip binds exact current desktop and mobile owner geometry', () => {
  assert.deepEqual(cases.map((item) => [item.viewport, item.width, item.height]), [['desktop', 1280, 3126.09375], ['mobile', 390, 3001.609375]]);
  assert.ok(cases.every((item) => item.astro.commit === '812ffc279728221b547707474bcb521f27c4a73d'));
  assert.ok(cases.every((item) => item.astro.capture.full_page));
  assert.ok(cases.every((item) => item.penpot.revision === 2800));
  assert.equal(cases[0].penpot.direct_children.find((item) => item.name.includes('Summary')).y, 660);
  assert.equal(cases[1].penpot.direct_children.find((item) => item.name.includes('Summary')).y, 529.890625);
});

test('OV-45/46/55/56 correction is hash-bound and exposes all materialized source states', () => {
  assert.equal(archetype.source_exact_corrections.length, 3);
  for (const contract of archetype.source_exact_corrections) assert.equal(contract.sha256, sha256(contract.path));
  assert.equal(archetype.regions.find((item) => item.region_id === 'event.transport').penpot_instances[0].component.id, '8f804431-c282-8075-8008-8de9df4aff87');
  assert.equal(archetype.regions.find((item) => item.region_id === 'event.related-events').penpot_instances[0].component.id, '8f804431-c282-8075-8008-8de9efe6492e');
  assert.ok(archetype.regions.find((item) => item.region_id === 'event.medallions').penpot_instances.some((item) => item.role === 'top-medallion'));
  assert.ok(archetype.regions.find((item) => item.region_id === 'event.media-frame').penpot_instances.some((item) => item.role === 'portrait-hero'));
});

test('OV-45/46/55/56 correction overlay is explicit and does not claim owner acceptance', () => {
  const overlay = bindings.correction_overlays.find((item) => item.archetype_id === 'archetype.event-detail');
  assert.deepEqual(overlay.review_items, ['OV-45', 'OV-46', 'OV-55', 'OV-56']);
  assert.equal(overlay.penpot_revision, 2800);
  assert.ok(archetype.source_exact_corrections.every((item) => /OWNER_REREVIEW_REQUIRED/.test(item.status)));
});

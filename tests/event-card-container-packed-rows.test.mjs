import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const contract = JSON.parse(readFileSync(new URL('../catalog/ui-components/event-card-container/packed-rows.v1.json', import.meta.url), 'utf8'));

function cropFraction(sourceRatio, targetRatio) {
  return Math.max(0, 1 - Math.min(sourceRatio / targetRatio, targetRatio / sourceRatio));
}

test('packed-row SoT binds both production Astro packers without creating a card root', () => {
  assert.equal(contract.semantic_boundary.does_not_create_new_card_root, true);
  assert.equal(contract.semantic_boundary.single_penpot_family_root_required, true);
  assert.deepEqual(contract.authority.astro_owners.map((owner) => owner.surface), [
    'event-detail-related',
    'festival-timeline',
  ]);
  assert.ok(contract.authority.astro_owners.every((owner) => /^[a-f0-9]{64}$/u.test(owner.packer_sha256)));
});

test('ecological crop is a source-area fraction with semantic fail-closed gates', () => {
  assert.equal(contract.ecological_crop.formula, 'max(0, 1 - min(source_ratio / target_ratio, target_ratio / source_ratio))');
  assert.equal(cropFraction(1, 1), 0);
  assert.equal(cropFraction(2, 1), 0.5);
  assert.equal(cropFraction(1, 2), 0.5);
  assert.equal(contract.ecological_crop.document_crop_cap, 0.2);
  assert.match(contract.ecological_crop.unknown_or_error_media, /fail closed/u);
  assert.equal(contract.ecological_crop.blind_cover_forbidden, true);
  assert.equal(contract.ecological_crop.stretching_forbidden, true);
});

test('both projections must show bounded 2/3/4-card compositions and measurements', () => {
  assert.deepEqual(contract.required_projections.astro_fixture.required_rows, [
    'related-3', 'festival-2', 'festival-3', 'festival-4',
  ]);
  assert.deepEqual(contract.required_projections.penpot_page.required_rows,
    contract.required_projections.astro_fixture.required_rows);
  assert.equal(contract.required_projections.astro_fixture.must_call_production_packers, true);
  assert.equal(contract.row_contract.completed_rows_fill_available_width, true);
});

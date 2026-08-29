import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const PATH = 'Event cards / Festival / Context';
const contract = read('catalog/reconstruction-atlas/v1/festival-card-centralization-20260829.v1.json');
const receipt = read('evidence/recovery-20260829/penpot/festival-card-centralization-receipt.v1.json');
const ov57 = read('catalog/reconstruction-atlas/v1/design-system-reference-fixtures-ov57.v1.json');
const bindings = read('catalog/round-trip-reconstruction/v1/bindings.v1.json');
const materializer = readFileSync('scripts/round-trip-reconstruction/penpot-reconcile-festival-card-centralization.js', 'utf8');
const componentIds = new Set(contract.penpot.variants.map((item) => item.component_id));

test('Astro Festival rows delegate every card to one centralized FestivalCard owner', () => {
  assert.equal(contract.authority.astro_commit, '67197ef3e5141f2ad36e109a8300877d85626a79');
  assert.equal(contract.astro.owner, 'site/src/components/festivals/FestivalCard.astro');
  assert.equal(contract.astro.consumer, 'site/src/pages/festivali/index.astro');
  assert.match(contract.astro.callsite, /<FestivalCard/u);
  assert.equal(contract.astro.build, 'PASS');
});

test('Penpot has seven linked source-exact FestivalCard variants in each bounded owner', () => {
  assert.equal(contract.penpot.canonical_path, PATH);
  assert.equal(contract.penpot.variants.length, 14);
  assert.equal(componentIds.size, 14);
  assert.equal(contract.penpot.new_component_count, 12);
  assert.equal(contract.penpot.owner_local_native_card_count, 0);
  assert.deepEqual(contract.penpot.validation, []);
  for (const owner of receipt.native_readback.owners) {
    assert.equal(owner.linked_cards.length, 7);
    assert.deepEqual(owner.native_card_ids, []);
    assert.ok(owner.linked_cards.every((card) => card.linked && card.visible));
  }
});

test('OV-57 records the later card typification correction without erasing initial evidence', () => {
  assert.equal(ov57.implementation.festival_card_centralization.status, 'STRUCTURAL_PASS');
  assert.equal(ov57.implementation.festival_card_centralization.penpot_revision, 2917);
  assert.equal(ov57.implementation.festival_card_centralization.linked_cards_per_owner, 7);
  assert.equal(ov57.implementation.festival_card_centralization.owner_local_native_card_count, 0);
});

test('round-trip Festival binding resolves the central family and current owner ancestry', () => {
  const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.festivals');
  assert.ok(archetype);
  assert.equal(archetype.festival_card_centralization.canonical_path, PATH);
  assert.deepEqual(new Set(archetype.festival_card_centralization.component_ids), componentIds);
  const dependency = archetype.dependencies.find((item) => item.component_id === 'festival.card');
  assert.equal(dependency.penpot_candidates.filter((item) => componentIds.has(item.id) && item.path === PATH).length, 14);
  for (const board of archetype.boards) {
    assert.equal(board.penpot.revision, 2917);
    assert.equal(board.penpot.direct_children.filter((item) => item.component?.path === PATH).length, 7);
  }
});

test('Festival reconciler is stable-ID, fail-closed, and never detaches or rasterizes', () => {
  assert.match(materializer, /linked\.length !== 7/u);
  assert.match(materializer, /missing linked FestivalCard/u);
  assert.doesNotMatch(materializer, /detach\(|uploadMedia|screenshot\(|createBoard\(/iu);
});

#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const BINDINGS = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const COMPACT = 'catalog/reconstruction-atlas/v1/penpot/bindings.v1.json';
const OV57_CONTRACT = 'catalog/reconstruction-atlas/v1/design-system-reference-fixtures-ov57.v1.json';
const OV57_RECEIPT = 'evidence/recovery-20260829/penpot/ov57-festivals-bounded-native-receipt.v1.json';
const CARD_CONTRACT = 'catalog/reconstruction-atlas/v1/festival-card-centralization-20260829.v1.json';
const CARD_RECEIPT = 'evidence/recovery-20260829/penpot/festival-card-centralization-receipt.v1.json';
const ASTRO = '67197ef3e5141f2ad36e109a8300877d85626a79';
const FILE = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE = 'd87e18f1-dcb4-80a6-8008-880c8e21990e';
const TEAM = '81f57451-85cc-819d-8008-70ebaeab3fd6';
const CARD_PATH = 'Event cards / Festival / Context';
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const hash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const component = (item) => ({ ...item, library_id: FILE });

const initial = read(OV57_RECEIPT);
const central = read(CARD_RECEIPT);
const cardContract = read(CARD_CONTRACT);
const revision = cardContract.authority.penpot_readback_revision;
const ownerByViewport = new Map(initial.owners.map((owner) => [owner.viewport, owner]));
const cardsByViewport = new Map(central.native_readback.owners.map((owner) => [owner.viewport, owner.linked_cards]));
const fixtureSlugs = ['city-jazz', 'sosedi', 'grozd', 'more-vnutri', 'bolshoy-kaup', 'v-edinstve', 'jazz-v-filarmonii'];

const cardChild = (card, index) => ({
  shape_id: card.owner_instance_id,
  parent_index: card.fixture === 'city-jazz' ? 22 : 31 + index,
  name: card.fixture === 'city-jazz'
    ? `linked FestivalCard / city-jazz / ${card.viewport === 'desktop' ? 'desktop-wide' : 'mobile-full'}`
    : `linked FestivalCard / ${card.fixture} / ${card.viewport} / source-exact`,
  type: 'board',
  x: card.position[0],
  y: card.position[1],
  width: card.size[0],
  height: card.size[1],
  hidden: false,
  is_component_copy: true,
  is_component_main: false,
  component: {
    id: card.component_id,
    name: card.component_name,
    path: CARD_PATH,
    library_id: FILE,
  },
});

const canonicalBoard = (previous, owner) => {
  const cards = cardsByViewport.get(owner.viewport);
  const nonCards = owner.direct_children
    .filter((child) => child.component && child.component.path !== CARD_PATH)
    .map((child) => ({ ...child, component: component(child.component) }));
  return {
    ...previous,
    astro: {
      ...previous.astro,
      commit: ASTRO,
      capture: { full_page: true, mode: 'full-page', fixture_profile: 'design-system-reference-v1' },
    },
    height: owner.root.height,
    penpot: {
      ...previous.penpot,
      board_component: component(owner.component),
      board_id: owner.root.id,
      board_name: owner.root.name,
      direct_children: [...nonCards, ...cards.map(cardChild)].sort((left, right) => left.parent_index - right.parent_index),
      direct_url: `https://design.penpot.app/#/workspace?team-id=${TEAM}&file-id=${FILE}&page-id=${PAGE}&board-id=${owner.root.id}`,
      revision,
    },
    viewport: owner.viewport,
    width: owner.root.width,
  };
};

const bindings = read(BINDINGS);
const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.festivals');
if (!archetype) throw new Error('bindings have no Festivals archetype');
archetype.boards = archetype.boards.map((board) => canonicalBoard(board, ownerByViewport.get(board.viewport)));
bindings.cases = bindings.cases.map((item) => item.archetype_id === archetype.archetype_id
  ? canonicalBoard(item, ownerByViewport.get(item.viewport))
  : item);
archetype.bounded_fixture_correction = {
  contract_id: 'recovery.ov-57.shared-bounded-fixture-pools.v1',
  path: OV57_CONTRACT,
  sha256: hash(OV57_CONTRACT),
  status: 'ASTRO_AND_PENPOT_STRUCTURALLY_VERIFIED_FESTIVAL_CARDS_COMPONENTIZED_VISUAL_EXPORT_BLOCKED',
};
archetype.fixture_profile = {
  id: 'design-system-reference-v1',
  festival_slugs: fixtureSlugs,
  row_card_counts: [1, 4, 2],
  full_production_count: 21,
  dense_listing_validation: 'Astro only',
  initial_penpot_receipt: OV57_RECEIPT,
  initial_penpot_receipt_sha256: hash(OV57_RECEIPT),
  current_penpot_receipt: CARD_RECEIPT,
  current_penpot_receipt_sha256: hash(CARD_RECEIPT),
};
archetype.source_exact_fixture_cards = cardContract.penpot.variants.map((card) => ({
  viewport: card.viewport,
  fixture: card.fixture,
  shape_id: card.owner_instance_id,
  component_id: card.component_id,
  linked: true,
  width: card.size[0],
  height: card.size[1],
}));
archetype.festival_card_centralization = {
  contract_id: cardContract.contract_id,
  path: CARD_CONTRACT,
  sha256: hash(CARD_CONTRACT),
  receipt: CARD_RECEIPT,
  receipt_sha256: hash(CARD_RECEIPT),
  canonical_path: CARD_PATH,
  component_ids: cardContract.penpot.variants.map((card) => card.component_id),
  linked_cards_per_owner: 7,
  owner_local_native_card_count: 0,
  penpot_revision: revision,
  astro_owner: cardContract.astro.owner,
  astro_commit: ASTRO,
};
const dependency = archetype.dependencies.find((item) => item.component_id === 'festival.card');
if (!dependency) throw new Error('Festival archetype has no festival.card dependency');
const centralIds = new Set(archetype.festival_card_centralization.component_ids);
dependency.penpot_candidates = [
  ...cardContract.penpot.variants.map((card) => ({ id: card.component_id, library_id: FILE, name: card.component_name, path: CARD_PATH, score: 4 })),
  ...dependency.penpot_candidates.filter((candidate) => !centralIds.has(candidate.id)),
];
for (const region of archetype.regions) {
  if (region.region_id === 'festival.header') {
    region.source_exact_instances = initial.owners.flatMap((owner) => owner.direct_children
      .filter((child) => /linked Festival \/ Header/u.test(child.name))
      .map((child) => ({ viewport: owner.viewport, shape_id: child.shape_id, component: component(child.component), fixture_count: 7 })));
  }
  if (region.region_id === 'festival.timeline') {
    region.source_exact_instances = initial.owners.flatMap((owner) => owner.direct_children
      .filter((child) => /^(Festival month filters|Festival guidance|Month \/)/u.test(child.name))
      .map((child) => ({ viewport: owner.viewport, shape_id: child.shape_id, name: child.name })));
  }
  if (region.region_id === 'festival.card-flow' || region.region_id === 'festival.category-chip') {
    region.source_exact_instances = archetype.source_exact_fixture_cards;
  }
}
bindings.correction_overlays ??= [];
const overlay = {
  archetype_id: archetype.archetype_id,
  astro_commit: ASTRO,
  contract: archetype.bounded_fixture_correction,
  penpot_page_id: PAGE,
  penpot_revision: revision,
  review_items: ['OV-57'],
  scope: 'shared-bounded-fixture-profile-seven-festivals-rows-1-4-2-centralized-card-family',
  comparison_status: 'STRUCTURAL_PASS_VISUAL_EXPORT_BLOCKED',
};
const overlayIndex = bindings.correction_overlays.findIndex((item) => item.archetype_id === archetype.archetype_id);
if (overlayIndex >= 0) bindings.correction_overlays[overlayIndex] = overlay;
else bindings.correction_overlays.push(overlay);
write(BINDINGS, bindings);

const compact = read(COMPACT);
const compactArchetype = compact.batch_bindings.find((item) => item.archetype_id === archetype.archetype_id);
if (!compactArchetype) throw new Error('compact Penpot bindings have no Festivals archetype');
for (const projection of compactArchetype.projections) {
  if (!projection.projection_id.endsWith('/representative')) continue;
  const viewport = projection.projection_id.includes('/desktop/') ? 'desktop' : 'mobile';
  const owner = ownerByViewport.get(viewport);
  projection.shape_id = owner.root.id;
  projection.component_id = owner.component.id;
  projection.width = owner.root.width;
  projection.height = owner.root.height;
}
write(COMPACT, compact);
console.log(`${BINDINGS}: promoted centralized FestivalCard family at Penpot revision ${revision}`);

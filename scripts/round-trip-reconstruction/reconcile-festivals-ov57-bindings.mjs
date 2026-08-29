#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const BINDINGS = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const COMPACT = 'catalog/reconstruction-atlas/v1/penpot/bindings.v1.json';
const CONTRACT = 'catalog/reconstruction-atlas/v1/design-system-reference-fixtures-ov57.v1.json';
const RECEIPT = 'evidence/recovery-20260829/penpot/ov57-festivals-bounded-native-receipt.v1.json';
const ASTRO = 'dec0d11b3b310a226a1b8bf6be9ed71cdf045b8e';
const FILE = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE = 'd87e18f1-dcb4-80a6-8008-880c8e21990e';
const TEAM = '81f57451-85cc-819d-8008-70ebaeab3fd6';
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const hash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const component = (item) => ({ ...item, library_id: FILE });

const receipt = read(RECEIPT);
const revision = receipt.penpot.revision;
const ownerByViewport = new Map(receipt.owners.map((owner) => [owner.viewport, owner]));
const fixtureSlugs = ['city-jazz', 'sosedi', 'grozd', 'more-vnutri', 'bolshoy-kaup', 'v-edinstve', 'jazz-v-filarmonii'];

const canonicalBoard = (previous, owner) => ({
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
    direct_children: owner.direct_children.filter((child) => child.component).map((child) => ({
      ...child,
      component: component(child.component),
    })),
    direct_url: `https://design.penpot.app/#/workspace?team-id=${TEAM}&file-id=${FILE}&page-id=${PAGE}&board-id=${owner.root.id}`,
    revision,
  },
  viewport: owner.viewport,
  width: owner.root.width,
});

const bindings = read(BINDINGS);
const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.festivals');
if (!archetype) throw new Error('bindings have no Festivals archetype');
archetype.boards = archetype.boards.map((board) => canonicalBoard(board, ownerByViewport.get(board.viewport)));
bindings.cases = bindings.cases.map((item) => item.archetype_id === archetype.archetype_id
  ? canonicalBoard(item, ownerByViewport.get(item.viewport))
  : item);
archetype.bounded_fixture_correction = {
  contract_id: 'recovery.ov-57.shared-bounded-fixture-pools.v1',
  path: CONTRACT,
  sha256: hash(CONTRACT),
  status: 'ASTRO_AND_PENPOT_STRUCTURALLY_VERIFIED_VISUAL_EXPORT_BLOCKED',
};
archetype.fixture_profile = {
  id: 'design-system-reference-v1',
  festival_slugs: fixtureSlugs,
  row_card_counts: [1, 4, 2],
  full_production_count: 21,
  dense_listing_validation: 'Astro only',
  penpot_receipt: RECEIPT,
  penpot_receipt_sha256: hash(RECEIPT),
};
archetype.source_exact_fixture_cards = receipt.owners.flatMap((owner) => [
  ...owner.linked_city_jazz.map((card) => ({ viewport: owner.viewport, fixture: 'city-jazz', shape_id: card.id, component_id: card.component, linked: true })),
  ...owner.fixture_cards.map((card) => ({ viewport: owner.viewport, fixture: card.name.split(' / ')[1], shape_id: card.id, linked: false, width: card.width, height: card.height, image_media_ids: card.image_fills.map((fill) => fill.media.id) })),
]);
for (const region of archetype.regions) {
  if (region.region_id === 'festival.header') {
    region.source_exact_instances = receipt.owners.flatMap((owner) => owner.direct_children
      .filter((child) => /linked Festival \/ Header/u.test(child.name))
      .map((child) => ({ viewport: owner.viewport, shape_id: child.shape_id, component: component(child.component), fixture_count: 7 })));
  }
  if (region.region_id === 'festival.timeline') {
    region.source_exact_instances = receipt.owners.flatMap((owner) => owner.direct_children
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
  scope: 'shared-bounded-fixture-profile-seven-festivals-rows-1-4-2',
  comparison_status: 'INVALIDATED_BY_OV57_NEW_OWNER_EXPORT_BLOCKED',
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
console.log(`${BINDINGS}: promoted OV-57 Festivals ${fixtureSlugs.length}-fixture owners at Penpot revision ${revision}`);

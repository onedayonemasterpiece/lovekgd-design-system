#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const BINDINGS = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const CONTRACT = 'catalog/reconstruction-atlas/v1/favorites-ov38-39-populated-source-exact.v1.json';
const RECEIPT = 'evidence/recovery-20260828/penpot/favorites-ov38-39-populated-source-exact-receipt.v1.json';
const REUSE_MAP = 'catalog/reconstruction-atlas/v1/reuse-new-map.v1.json';
const ASTRO_COMMIT = '812ffc279728221b547707474bcb521f27c4a73d';
const PENPOT_REVISION = 2794;
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880d209a7fcd';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const comp = (id, name, path) => ({ id, library_id: FILE_ID, name, path });
const child = ({ component, height, id, name, parent_index, width, x, y, linked_children }) => ({
  component,
  height,
  hidden: false,
  is_component_copy: true,
  is_component_main: false,
  name,
  parent_index,
  shape_id: id,
  type: 'board',
  width,
  x,
  y,
  ...(linked_children ? { linked_children } : {}),
});

const fixtures = [
  { event_id: '7030', saved_source: 'calendar', title: 'Праздник непослушания' },
  { event_id: '7006', saved_source: 'like', title: 'Открытая лекция по Трансцендентальной Медитации' },
  { event_id: '6947', saved_source: 'like', title: 'Лекция Жизнь и боль Фриды Кало' },
];

const specs = {
  desktop: {
    board: { id: 'd87e18f1-dcb4-80a6-8008-880d20bc67e8', componentId: 'd87e18f1-dcb4-80a6-8008-880d2c628515', width: 1280, height: 2288 },
    stateComponent: { id: '8f804431-c282-8075-8008-8ded98c025cc', name: 'viewport=desktop;state=local-only-with-items;fixtures=7030,7006,6947' },
    cards: [
      { shape_id: '8f804431-c282-8075-8008-8dedb90e0917', event_id: '7030', saved_source: 'calendar' },
      { shape_id: '8f804431-c282-8075-8008-8dedb9115e50', event_id: '7006', saved_source: 'like' },
      { shape_id: '8f804431-c282-8075-8008-8dedb911cee9', event_id: '6947', saved_source: 'like' },
    ],
  },
  mobile: {
    board: { id: 'd87e18f1-dcb4-80a6-8008-880d230a2b8b', componentId: 'd87e18f1-dcb4-80a6-8008-880d3512f2f7', width: 390, height: 2742 },
    stateComponent: { id: '8f804431-c282-8075-8008-8dedaae19e2e', name: 'viewport=mobile;state=local-only-with-items;fixtures=7030,7006,6947' },
    cards: [
      { shape_id: '8f804431-c282-8075-8008-8dedbababe30', event_id: '7030', saved_source: 'calendar' },
      { shape_id: '8f804431-c282-8075-8008-8dedbabb5ed1', event_id: '7006', saved_source: 'like' },
      { shape_id: '8f804431-c282-8075-8008-8dedbabc1bd2', event_id: '6947', saved_source: 'like' },
    ],
  },
};

specs.desktop.children = [
  child({ component: comp('a21f5e36-5d76-8065-8008-86ae4bdf9963', 'Desktop header', 'Shell v1 / Desktop'), height: 57, id: '8f804431-c282-8075-8008-8dedb884761c', name: 'linked Shell / Desktop header', parent_index: 0, width: 1280, x: 0, y: 0 }),
  child({ component: comp('d87e18f1-dcb4-80a6-8008-8865590f45af', 'viewport=desktop', 'Favorites / Header'), height: 260, id: '8f804431-c282-8075-8008-8dedb8b332ab', name: 'linked Favorites / Header / desktop', parent_index: 1, width: 736, x: 50, y: 140 }),
  child({ component: comp('d87e18f1-dcb4-80a6-8008-88655a5b3783', 'viewport=desktop;state=anonymous', 'Favorites / Identity gate'), height: 264, id: '8f804431-c282-8075-8008-8dedb8e2e3a1', name: 'linked Favorites / Identity gate / desktop anonymous', parent_index: 2, width: 736, x: 50, y: 390 }),
  child({ component: comp(specs.desktop.stateComponent.id, specs.desktop.stateComponent.name, 'Favorites / Saved events'), height: 810, id: '8f804431-c282-8075-8008-8dedb90e0915', name: 'linked Favorites / local-only-with-items / desktop / 7030,7006,6947', parent_index: 3, width: 1180, x: 50, y: 671, linked_children: specs.desktop.cards }),
  child({ component: comp('d87e18f1-dcb4-80a6-8008-885914f2be1b', 'Footer viewport · representative', 'Shell v1 / Desktop'), height: 681.859375, id: '8f804431-c282-8075-8008-8dedb9d66449', name: 'linked Shell / Desktop footer viewport', parent_index: 4, width: 1280, x: 0, y: 1606 }),
];
specs.mobile.children = [
  child({ component: comp('a21f5e36-5d76-8065-8008-86aebfc67027', 'Mobile header', 'Shell v1 / Mobile'), height: 84, id: '8f804431-c282-8075-8008-8dedba44a65e', name: 'linked Shell / Mobile header', parent_index: 0, width: 390, x: 1320, y: 0 }),
  child({ component: comp('d87e18f1-dcb4-80a6-8008-88655996bf2a', 'viewport=mobile', 'Favorites / Header'), height: 190, id: '8f804431-c282-8075-8008-8dedba6d2037', name: 'linked Favorites / Header / mobile', parent_index: 1, width: 366, x: 1332, y: 96 }),
  child({ component: comp('d87e18f1-dcb4-80a6-8008-88655b0c047b', 'viewport=mobile;state=anonymous', 'Favorites / Identity gate'), height: 284, id: '8f804431-c282-8075-8008-8dedba94c8f8', name: 'linked Favorites / Identity gate / mobile anonymous', parent_index: 2, width: 366, x: 1332, y: 298 }),
  child({ component: comp(specs.mobile.stateComponent.id, specs.mobile.stateComponent.name, 'Favorites / Saved events'), height: 1914, id: '8f804431-c282-8075-8008-8dedbaba52c8', name: 'linked Favorites / local-only-with-items / mobile / 7030,7006,6947', parent_index: 3, width: 366, x: 1332, y: 598, linked_children: specs.mobile.cards }),
  child({ component: comp('a21f5e36-5d76-8065-8008-86aec0a54bb5', 'surface=floating-island', 'Shell v1 / Mobile'), height: 64, id: '8f804431-c282-8075-8008-8dedbb70d88a', name: 'linked Shell / Mobile bottom navigation', parent_index: 4, width: 366, x: 1320, y: 2678 }),
];

const contract = read(CONTRACT);
contract.authority.current_astro_commit = ASTRO_COMMIT;
contract.semantic_resolution = {
  applies_over: 'catalog/global-archetype-sot-v1/archetype-contracts/favorites.semantic-contract.v1.json',
  overall_archetype_canonical: false,
  resolved_scope: ['favorites.header', 'favorites.identity-gate', 'favorites.saved-events', 'favorites.populated'],
  unresolved_scope: ['favorites.action-refresh'],
  populated_state: {
    disposition: 'observed',
    materialization_eligible: true,
    browser_evidence: contract.astro.browser_evidence,
    fixture_order: fixtures.map((item) => item.event_id),
    identity_gate: { status: 'RESOLVED', all_identities_have_exact_source_refs: true },
  },
};
contract.penpot.round_trip_revision = PENPOT_REVISION;
contract.penpot.owner_names = {
  desktop: 'viewport=desktop;state=local-only-with-items · Astro source exact',
  mobile: 'viewport=mobile;state=local-only-with-items · Astro source exact',
};
contract.penpot.owner_direct_children = Object.fromEntries(Object.entries(specs).map(([viewport, spec]) => [viewport, spec.children.map((item) => item.shape_id)]));
write(CONTRACT, contract);

const receipt = read(RECEIPT);
receipt.penpot.round_trip_revision = PENPOT_REVISION;
receipt.source_readback.astro_commit = ASTRO_COMMIT;
receipt.structural_readback.desktop_owner_name = `Archetype / Favorites / ${contract.penpot.owner_names.desktop}`;
receipt.structural_readback.mobile_owner_name = `Archetype / Favorites / ${contract.penpot.owner_names.mobile}`;
receipt.structural_readback.desktop_fixture_shape_ids = specs.desktop.cards.map((item) => item.shape_id);
receipt.structural_readback.mobile_fixture_shape_ids = specs.mobile.cards.map((item) => item.shape_id);
write(RECEIPT, receipt);

const reuse = read(REUSE_MAP);
const controller = reuse.nodes.find((item) => item.id === 'favorites.saved-events-controller');
if (!controller) throw new Error('reuse map has no favorites.saved-events-controller');
controller.disposition = 'REUSE_FROZEN_OR_RECONCILE';
write(REUSE_MAP, reuse);

const bindings = read(BINDINGS);
const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.favorites');
if (!archetype) throw new Error('bindings have no Favorites archetype');
archetype.source_exact_correction = { contract_id: contract.contract_id, path: CONTRACT, sha256: sha256(CONTRACT), status: contract.status };
archetype.fixture_slots = [
  { content_type: 'generated-route', fixture_refs: ['/izbrannoe/'], multiplicity: 'many', required: true, slot_id: 'generated-route-scenarios' },
  { content_type: 'event', fixture_refs: fixtures.map((item) => `event.real.${item.event_id}`), multiplicity: 'many', required: true, slot_id: 'populated-events' },
  { content_type: 'semantic-state', fixture_refs: ['local-only-with-items', 'authenticated', 'empty', 'error', 'loading', 'retry', 'stale'], multiplicity: 'many', required: true, slot_id: 'state-scenarios' },
];

const entries = [...archetype.boards, ...bindings.cases.filter((item) => item.archetype_id === archetype.archetype_id)];
for (const entry of entries) {
  const spec = specs[entry.viewport];
  entry.width = spec.board.width;
  entry.height = spec.board.height;
  entry.astro = { commit: ASTRO_COMMIT, route: '/izbrannoe/', capture: { full_page: true, mode: 'full-page' } };
  entry.penpot.revision = PENPOT_REVISION;
  entry.penpot.board_id = spec.board.id;
  entry.penpot.board_name = `Archetype / Favorites / ${contract.penpot.owner_names[entry.viewport]}`;
  entry.penpot.board_component = comp(spec.board.componentId, contract.penpot.owner_names[entry.viewport], 'Archetype / Favorites');
  entry.penpot.direct_children = spec.children;
}

for (const region of archetype.regions) {
  if (region.region_id === 'favorites.header') {
    region.penpot_instances = ['desktop', 'mobile'].map((viewport) => ({ viewport, shape_id: specs[viewport].children[1].shape_id, component: specs[viewport].children[1].component }));
  } else if (region.region_id === 'favorites.identity-gate') {
    region.penpot_instances = ['desktop', 'mobile'].map((viewport) => ({ viewport, shape_id: specs[viewport].children[2].shape_id, component: specs[viewport].children[2].component }));
  } else if (region.region_id === 'favorites.saved-events') {
    region.penpot_instances = ['desktop', 'mobile'].flatMap((viewport) => [
      { viewport, shape_id: specs[viewport].children[3].shape_id, component: specs[viewport].children[3].component, role: 'populated-state-root' },
      ...specs[viewport].cards.map((item) => ({ ...item, viewport, role: 'saved-event' })),
    ]);
  }
}

for (const dependency of archetype.dependencies) {
  for (const candidate of dependency.penpot_candidates ?? []) {
    for (const [viewport, spec] of Object.entries(specs)) {
      if (candidate.id === spec.board.componentId) {
        candidate.name = contract.penpot.owner_names[viewport];
        candidate.path = 'Archetype / Favorites';
      }
    }
  }
}

bindings.correction_overlays ??= [];
const overlay = { archetype_id: archetype.archetype_id, astro_commit: ASTRO_COMMIT, contract: archetype.source_exact_correction, penpot_page_id: PAGE_ID, penpot_revision: PENPOT_REVISION, review_items: ['OV-38', 'OV-39'] };
const index = bindings.correction_overlays.findIndex((item) => item.archetype_id === archetype.archetype_id);
if (index >= 0) bindings.correction_overlays[index] = overlay;
else bindings.correction_overlays.push(overlay);
write(BINDINGS, bindings);
console.log(`${BINDINGS}: reconciled ${archetype.archetype_id} at Penpot revision ${PENPOT_REVISION}`);

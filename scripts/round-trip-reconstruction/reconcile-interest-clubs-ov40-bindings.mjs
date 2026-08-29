#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const BINDINGS = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const CONTRACT = 'catalog/reconstruction-atlas/v1/interest-clubs-ov40-source-exact.v1.json';
const REUSE_MAP = 'catalog/reconstruction-atlas/v1/reuse-new-map.v1.json';
const RECEIPT = 'evidence/recovery-20260828/penpot/interest-clubs-ov40-source-exact-receipt.v1.json';

const ASTRO_COMMIT = '812ffc279728221b547707474bcb521f27c4a73d';
const PENPOT_REVISION = 2797;
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880cfe1ec779';
const CARD_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-88648c204cec';
const CARD_COMPONENT_NAME = 'state=ready;surface=responsive;media=cover-or-fallback';
const LIBRARY_ID = FILE_ID;

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const component = (id, name, path) => ({ id, library_id: LIBRARY_ID, name, path });

const cards = {
  desktop: [
    ['6fd90e70-153b-804f-8008-8cad4207e051', 'game-vibes', 50, 525, 375.75, 544],
    ['c0b867fa-32d2-8062-8008-8d507611b262', 'neural-researchers', 452.125, 525, 375.75, 544],
    ['c0b867fa-32d2-8062-8008-8d5076ce3473', 'technology-researchers', 854.25, 525, 375.75, 544],
  ],
  mobile: [
    ['6fd90e70-153b-804f-8008-8cad4478d34c', 'game-vibes', 1332, 499, 366, 448],
    ['c0b867fa-32d2-8062-8008-8d50b59284c7', 'neural-researchers', 1332, 963, 366, 448],
    ['c0b867fa-32d2-8062-8008-8d50b627840c', 'technology-researchers', 1332, 1427, 366, 448],
  ],
};

const cardInstance = (viewport, row) => {
  const [shape_id, slug, x, y, width, height] = row;
  return {
    component: component(CARD_COMPONENT_ID, CARD_COMPONENT_NAME, 'Interest clubs / Club card'),
    height,
    hidden: false,
    is_component_copy: true,
    is_component_main: false,
    name: `linked Interest clubs / Club card / ${slug} / viewport=${viewport};state=ready`,
    shape_id,
    slug,
    type: 'board',
    width,
    x,
    y,
  };
};

const specs = {
  desktop: {
    board: {
      componentId: 'd87e18f1-dcb4-80a6-8008-880d073401a1',
      id: 'd87e18f1-dcb4-80a6-8008-880cfe39384c',
      name: 'Archetype / Interest clubs / viewport=desktop;state=ready · owner-corrected',
      componentName: 'viewport=desktop;state=ready · owner-corrected',
      width: 1280,
      height: 1781,
    },
    children: [
      {
        component: component('a21f5e36-5d76-8065-8008-86ae4bdf9963', 'Desktop header', 'Shell v1 / Desktop'),
        height: 57, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Shell / Desktop header', parent_index: 0,
        shape_id: 'd87e18f1-dcb4-80a6-8008-88648c77d8fe', type: 'board', width: 1280, x: 0, y: 0,
      },
      {
        component: component('d87e18f1-dcb4-80a6-8008-8864884b188a', 'viewport=desktop;state=ready;catalog=3', 'Interest clubs / Catalog header'),
        height: 404, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Interest clubs / Catalog header / desktop ready', parent_index: 1,
        shape_id: 'd87e18f1-dcb4-80a6-8008-88648c958ade', type: 'board', width: 1180, x: 50, y: 89,
      },
      {
        component: null,
        height: 544, hidden: false, is_component_copy: false, is_component_main: true,
        name: 'Interest clubs / Catalog ready / viewport=desktop', parent_index: 2,
        shape_id: 'd87e18f1-dcb4-80a6-8008-88648cb927d6', type: 'board', width: 1180, x: 50, y: 525,
        linked_children: cards.desktop.map((row) => cardInstance('desktop', row)),
      },
      {
        component: component('d87e18f1-dcb4-80a6-8008-885914f2be1b', 'Footer viewport · representative', 'Shell v1 / Desktop'),
        height: 681.859375, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Shell / Desktop footer viewport', parent_index: 3,
        shape_id: 'd87e18f1-dcb4-80a6-8008-88648ce00a2f', type: 'board', width: 1280, x: 0, y: 1099,
      },
    ],
  },
  mobile: {
    board: {
      componentId: 'd87e18f1-dcb4-80a6-8008-880d0cc8465b',
      id: 'd87e18f1-dcb4-80a6-8008-880cff1a1193',
      name: 'Archetype / Interest clubs / viewport=mobile;state=ready · owner-corrected',
      componentName: 'viewport=mobile;state=ready · owner-corrected',
      width: 390,
      height: 1983,
    },
    children: [
      {
        component: component('a21f5e36-5d76-8065-8008-86aebfc67027', 'Mobile header', 'Shell v1 / Mobile'),
        height: 84, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Shell / Mobile header', parent_index: 0,
        shape_id: 'd87e18f1-dcb4-80a6-8008-88648d18681a', type: 'board', width: 390, x: 1320, y: 0,
      },
      {
        component: component('d87e18f1-dcb4-80a6-8008-8864892f5750', 'viewport=mobile;state=ready;catalog=3', 'Interest clubs / Catalog header'),
        height: 346, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Interest clubs / Catalog header / mobile ready', parent_index: 1,
        shape_id: 'd87e18f1-dcb4-80a6-8008-88648d2c1b5a', type: 'board', width: 366, x: 1332, y: 134,
      },
      {
        component: null,
        height: 1376, hidden: false, is_component_copy: false, is_component_main: true,
        name: 'Interest clubs / Catalog ready / viewport=mobile', parent_index: 2,
        shape_id: 'd87e18f1-dcb4-80a6-8008-88648d4a9273', type: 'board', width: 366, x: 1332, y: 499,
        linked_children: cards.mobile.map((row) => cardInstance('mobile', row)),
      },
      {
        component: component('a21f5e36-5d76-8065-8008-86aec0a54bb5', 'surface=floating-island', 'Shell v1 / Mobile'),
        height: 64, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Shell / Mobile bottom navigation', parent_index: 3,
        shape_id: 'd87e18f1-dcb4-80a6-8008-88648d6dfa31', type: 'board', width: 366, x: 1320, y: 1919,
      },
    ],
  },
};

const sourceContract = read(CONTRACT);
sourceContract.authority.current_astro_commit = ASTRO_COMMIT;
sourceContract.authority.rule = 'The catalog is populated by default with the three factual Astro clubs. An empty catalogue is allowed only behind an explicit rollback/feature flag and is never the default projection.';
sourceContract.semantic_resolution = {
  applies_over: 'catalog/global-archetype-sot-v1/archetype-contracts/interest-clubs.semantic-contract.v1.json',
  overall_archetype_canonical: false,
  resolved_scope: ['club.catalog-header', 'club.catalog-grid', 'club.card'],
  unresolved_scope: ['club.detail-hero', 'club.detail-facts', 'club.meeting-list', 'club.empty-meetings'],
  club_card: {
    disposition: 'reuse_existing',
    identity_gate: {
      all_identities_have_exact_source_refs: true,
      reconciliation_proof_ref: RECEIPT,
      source_identity_count: 1,
      status: 'RESOLVED',
    },
    penpot_component_id: CARD_COMPONENT_ID,
    penpot_component_name: CARD_COMPONENT_NAME,
    source_identity_contract: [{
      source_identity_id: 'club.card',
      source_refs: [
        { commit: ASTRO_COMMIT, path: 'site/src/components/InterestClubCard.astro', sha256: '0a79feef91f16692f9409a14af116f883847ef60b33e67f9c0e7efe555ccf74b' },
        { commit: ASTRO_COMMIT, path: 'site/src/data/interest-clubs.json', sha256: '50f418d04dbb2eac3e8efd6c74c2470e39a24bbc135dd2aa51981a594c114014' },
        { commit: ASTRO_COMMIT, path: 'site/src/data/interest-club-covers.ts', sha256: '169240a2a91baf24253fc787ae91c53793dbf33345fbec6c4111206b06e4a419' },
      ],
    }],
  },
};
sourceContract.astro.fixtures = sourceContract.astro.fixtures.map((fixture) => ({ ...fixture, route: `/kluby-po-interesam/${fixture.slug}/` }));
sourceContract.penpot.canonical_club_card_name = CARD_COMPONENT_NAME;
sourceContract.penpot.foundation_binding_revision = PENPOT_REVISION;
sourceContract.penpot.round_trip_revision = PENPOT_REVISION;
sourceContract.penpot.validation = [];
write(CONTRACT, sourceContract);

const reuse = read(REUSE_MAP);
const clubCard = reuse.nodes.find((node) => node.id === 'club.card');
if (!clubCard) throw new Error('reuse map has no club.card');
clubCard.disposition = 'REUSE_FROZEN_OR_RECONCILE';
write(REUSE_MAP, reuse);

const receipt = read(RECEIPT);
receipt.penpot.revision = PENPOT_REVISION;
receipt.penpot.round_trip_revision = PENPOT_REVISION;
receipt.native_ancestry.canonical_club_card_name = CARD_COMPONENT_NAME;
receipt.source_readback.astro_commit = ASTRO_COMMIT;
receipt.source_readback.default_catalog_state = 'ready';
receipt.structural_readback.desktop_owner_name = specs.desktop.board.name;
receipt.structural_readback.mobile_owner_name = specs.mobile.board.name;
receipt.structural_readback.desktop_card_shape_ids = cards.desktop.map(([id]) => id);
receipt.structural_readback.mobile_card_shape_ids = cards.mobile.map(([id]) => id);
write(RECEIPT, receipt);

const bindings = read(BINDINGS);
const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.interest-clubs');
if (!archetype) throw new Error('bindings have no Interest clubs archetype');
archetype.source_exact_correction = {
  contract_id: sourceContract.contract_id,
  path: CONTRACT,
  sha256: sha256(CONTRACT),
  status: sourceContract.status,
};
archetype.fixture_slots = [
  {
    content_type: 'generated-route',
    fixture_refs: ['/kluby-po-interesam/', ...sourceContract.astro.fixtures.map((item) => item.route)],
    multiplicity: 'many', required: true, slot_id: 'generated-route-scenarios',
  },
  {
    content_type: 'semantic-state',
    fixture_refs: ['catalog-ready', 'cover-absent', 'cover-present', 'detail-no-future-meetings'],
    multiplicity: 'many', required: true, slot_id: 'state-scenarios',
  },
];

const boardEntries = [...archetype.boards, ...bindings.cases.filter((item) => item.archetype_id === archetype.archetype_id)];
for (const entry of boardEntries) {
  const spec = specs[entry.viewport];
  entry.width = spec.board.width;
  entry.height = spec.board.height;
  entry.astro.commit = ASTRO_COMMIT;
  entry.astro.route = '/kluby-po-interesam/';
  entry.astro.capture = { full_page: true, mode: 'full-page' };
  entry.penpot.revision = PENPOT_REVISION;
  entry.penpot.board_id = spec.board.id;
  entry.penpot.board_name = spec.board.name;
  entry.penpot.board_component = component(spec.board.componentId, spec.board.componentName, 'Archetype / Interest clubs');
  entry.penpot.direct_children = spec.children;
}

const dependency = archetype.dependencies.find((item) => item.component_id === 'club.card');
if (!dependency) throw new Error('bindings have no club.card dependency');
dependency.source_exact_resolution = sourceContract.semantic_resolution.club_card;
const candidate = dependency.penpot_candidates.find((item) => item.id === CARD_COMPONENT_ID);
if (candidate) {
  candidate.name = CARD_COMPONENT_NAME;
  candidate.path = 'Interest clubs / Club card';
  candidate.score = Math.max(candidate.score, 4);
}

const instances = (viewport) => cards[viewport].map((row) => ({
  component: component(CARD_COMPONENT_ID, CARD_COMPONENT_NAME, 'Interest clubs / Club card'),
  fixture_slug: row[1],
  shape_id: row[0],
  viewport,
}));
for (const region of archetype.regions) {
  if (region.region_id === 'club.catalog-header') {
    region.penpot_instances = ['desktop', 'mobile'].map((viewport) => {
      const child = specs[viewport].children[1];
      return { component: child.component, shape_id: child.shape_id, viewport };
    });
  } else if (region.region_id === 'club.catalog-grid') {
    region.penpot_instances = ['desktop', 'mobile'].map((viewport) => {
      const child = specs[viewport].children[2];
      return { component: null, linked_card_count: child.linked_children.length, shape_id: child.shape_id, viewport };
    });
  } else if (region.region_id === 'club.card') {
    region.penpot_instances = [...instances('desktop'), ...instances('mobile')];
  }
}

bindings.correction_overlays ??= [];
const overlay = {
  archetype_id: archetype.archetype_id,
  astro_commit: ASTRO_COMMIT,
  contract: archetype.source_exact_correction,
  penpot_page_id: PAGE_ID,
  penpot_revision: PENPOT_REVISION,
  review_items: ['OV-40'],
};
const existingOverlay = bindings.correction_overlays.findIndex((item) => item.archetype_id === archetype.archetype_id);
if (existingOverlay >= 0) bindings.correction_overlays[existingOverlay] = overlay;
else bindings.correction_overlays.push(overlay);

write(BINDINGS, bindings);
console.log(`${BINDINGS}: reconciled ${archetype.archetype_id} at Penpot revision ${PENPOT_REVISION}`);

#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const BINDINGS = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const CONTRACT = 'catalog/reconstruction-atlas/v1/interest-clubs-ov40-source-exact.v1.json';
const REUSE_MAP = 'catalog/reconstruction-atlas/v1/reuse-new-map.v1.json';
const RECEIPT = 'evidence/recovery-20260828/penpot/interest-clubs-ov40-source-exact-receipt.v1.json';

const ASTRO_COMMIT = 'dec0d11b3b310a226a1b8bf6be9ed71cdf045b8e';
const PENPOT_REVISION = 2879;
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880cfe1ec779';
const CARD_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-88648c204cec';
const CARD_COMPONENT_NAME = 'state=ready;surface=responsive;media=cover-or-fallback';
const MOBILE_SHELL_COMPONENT_ID = '8f804431-c282-8075-8008-8e566809bac9';
const MOBILE_SHELL_COMPONENT_NAME = 'state=ready;catalog=3;shelf=visible';
const DESKTOP_SHELL_COMPONENT_ID = '8f804431-c282-8075-8008-8e586014178e';
const DESKTOP_SHELL_COMPONENT_NAME = 'state=ready;active=clubs;catalog=3';
const LIBRARY_ID = FILE_ID;

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const component = (id, name, path) => ({ id, library_id: LIBRARY_ID, name, path });

const cards = {
  desktop: [
    ['6fd90e70-153b-804f-8008-8cad4207e051', 'game-vibes', 50, 523.953125, 375.75, 544],
    ['c0b867fa-32d2-8062-8008-8d507611b262', 'neural-researchers', 452.125, 523.953125, 375.75, 544],
    ['c0b867fa-32d2-8062-8008-8d5076ce3473', 'technology-researchers', 854.25, 523.953125, 375.75, 544],
  ],
  mobile: [
    ['6fd90e70-153b-804f-8008-8cad4478d34c', 'game-vibes', 1332, 521.765625, 366, 448],
    ['c0b867fa-32d2-8062-8008-8d50b59284c7', 'neural-researchers', 1332, 985.765625, 366, 448],
    ['c0b867fa-32d2-8062-8008-8d50b627840c', 'technology-researchers', 1332, 1449.765625, 366, 448],
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
        component: component(DESKTOP_SHELL_COMPONENT_ID, DESKTOP_SHELL_COMPONENT_NAME, 'Interest clubs / Desktop shell'),
        height: 57, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Interest clubs / Desktop shell / active=clubs;catalog=3', parent_index: 0,
        shape_id: 'd87e18f1-dcb4-80a6-8008-88648c77d8fe', type: 'board', width: 1280, x: 0, y: 0,
      },
      {
        component: component('d87e18f1-dcb4-80a6-8008-8864884b188a', 'viewport=desktop;state=ready;catalog=3', 'Interest clubs / Catalog header'),
        height: 402.953125, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Interest clubs / Catalog header / desktop ready', parent_index: 1,
        shape_id: 'd87e18f1-dcb4-80a6-8008-88648c958ade', type: 'board', width: 1180, x: 50, y: 89,
      },
      {
        component: null,
        height: 544, hidden: false, is_component_copy: false, is_component_main: true,
        name: 'Interest clubs / Catalog ready / viewport=desktop', parent_index: 2,
        shape_id: 'd87e18f1-dcb4-80a6-8008-88648cb927d6', type: 'board', width: 1180, x: 50, y: 523.953125,
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
        component: component(MOBILE_SHELL_COMPONENT_ID, MOBILE_SHELL_COMPONENT_NAME, 'Interest clubs / Mobile shell'),
        height: 117, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Interest clubs / Mobile shell / state=ready;catalog=3;shelf=visible', parent_index: 0,
        shape_id: 'd87e18f1-dcb4-80a6-8008-88648d18681a', type: 'board', width: 390, x: 1320, y: 0,
      },
      {
        component: component('d87e18f1-dcb4-80a6-8008-8864892f5750', 'viewport=mobile;state=ready;catalog=3', 'Interest clubs / Catalog header'),
        height: 372.953125, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Interest clubs / Catalog header / mobile ready', parent_index: 1,
        shape_id: 'd87e18f1-dcb4-80a6-8008-88648d2c1b5a', type: 'board', width: 366, x: 1332, y: 132.8125,
      },
      {
        component: null,
        height: 1376, hidden: false, is_component_copy: false, is_component_main: true,
        name: 'Interest clubs / Catalog ready / viewport=mobile', parent_index: 2,
        shape_id: 'd87e18f1-dcb4-80a6-8008-88648d4a9273', type: 'board', width: 366, x: 1332, y: 521.765625,
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
sourceContract.status = 'CORRECTION_MATERIALIZED_STRUCTURAL_EXACT_EXPORT_BLOCKED_OWNER_REREVIEW_REQUIRED';
sourceContract.authority.current_astro_commit = ASTRO_COMMIT;
sourceContract.authority.rule = 'The catalog is populated by default with the three factual Astro clubs. An empty catalogue is allowed only behind an explicit rollback/feature flag and is never the default projection.';
sourceContract.semantic_resolution = {
  applies_over: 'catalog/global-archetype-sot-v1/archetype-contracts/interest-clubs.semantic-contract.v1.json',
  overall_archetype_canonical: false,
  resolved_scope: ['club.mobile-shelf', 'club.catalog-header', 'club.catalog-grid', 'club.card'],
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
sourceContract.astro.page_source = {
  commit: ASTRO_COMMIT,
  path: 'site/src/pages/kluby-po-interesam/index.astro',
  sha256: '96f5aa16ac876c9f8a7d9f377e3d1137b0d54c6c651cc673ed587f3965ab1c8a',
};
sourceContract.astro.ready_build = {
  environment: { PUBLIC_INTEREST_CLUBS_ENABLED: '1' },
  desktop: { intro: [50, 89, 1180, 402.953125], grid: [50, 523.953125, 1180, 544] },
  mobile: { shelf: [0, 64.8125, 390, 52], intro: [12, 132.8125, 366, 372.953125], grid: [12, 521.765625, 366, 1376] },
};
sourceContract.penpot.canonical_club_card_name = CARD_COMPONENT_NAME;
sourceContract.penpot.mobile_shell = {
  component_id: MOBILE_SHELL_COMPONENT_ID,
  component_name: MOBILE_SHELL_COMPONENT_NAME,
  path: 'Interest clubs / Mobile shell',
  linked_owner_shape_id: 'd87e18f1-dcb4-80a6-8008-88648d18681a',
};
sourceContract.penpot.desktop_shell = {
  component_id: DESKTOP_SHELL_COMPONENT_ID,
  component_name: DESKTOP_SHELL_COMPONENT_NAME,
  path: 'Interest clubs / Desktop shell',
  linked_owner_shape_id: 'd87e18f1-dcb4-80a6-8008-88648c77d8fe',
};
sourceContract.penpot.foundation_binding_revision = PENPOT_REVISION;
sourceContract.penpot.round_trip_revision = PENPOT_REVISION;
sourceContract.penpot.named_version = { label: 'OV40 Interest clubs · route shell idempotency verified', revision: PENPOT_REVISION };
sourceContract.penpot.validation = [];
sourceContract.visual_evidence.result = 'SUPERSEDED_BY_REVISION_2879_EXPORTER_HTTP_504_OWNER_REREVIEW_REQUIRED';
sourceContract.visual_evidence.owner_acceptance = 'NOT_CLAIMED';
write(CONTRACT, sourceContract);

const reuse = read(REUSE_MAP);
const clubCard = reuse.nodes.find((node) => node.id === 'club.card');
if (!clubCard) throw new Error('reuse map has no club.card');
clubCard.disposition = 'REUSE_FROZEN_OR_RECONCILE';
write(REUSE_MAP, reuse);

const receipt = read(RECEIPT);
receipt.captured_at = '2026-08-29T06:57:02Z';
receipt.status = sourceContract.status;
receipt.penpot.revision = PENPOT_REVISION;
receipt.penpot.round_trip_revision = PENPOT_REVISION;
receipt.penpot.saved_version = { label: 'OV40 Interest clubs · route shell idempotency verified', revision: PENPOT_REVISION };
receipt.native_ancestry.canonical_club_card_name = CARD_COMPONENT_NAME;
receipt.native_ancestry.mobile_shell_component = MOBILE_SHELL_COMPONENT_ID;
receipt.native_ancestry.desktop_shell_component = DESKTOP_SHELL_COMPONENT_ID;
receipt.source_readback.astro_commit = ASTRO_COMMIT;
receipt.source_readback.default_catalog_state = 'ready';
receipt.structural_readback.desktop_owner_name = specs.desktop.board.name;
receipt.structural_readback.mobile_owner_name = specs.mobile.board.name;
receipt.structural_readback.desktop_card_shape_ids = cards.desktop.map(([id]) => id);
receipt.structural_readback.mobile_card_shape_ids = cards.mobile.map(([id]) => id);
receipt.structural_readback.desktop_intro = { x: 50, y: 89, width: 1180, height: 402.953125 };
receipt.structural_readback.desktop_shell = { x: 0, y: 0, width: 1280, height: 57, component_id: DESKTOP_SHELL_COMPONENT_ID, active_route: 'clubs' };
receipt.structural_readback.desktop_grid = { x: 50, y: 523.953125, width: 1180, height: 544 };
receipt.structural_readback.mobile_shell = { x: 0, y: 0, width: 390, height: 117, component_id: MOBILE_SHELL_COMPONENT_ID };
receipt.structural_readback.mobile_intro = { x: 12, y: 132.8125, width: 366, height: 372.953125 };
receipt.structural_readback.mobile_grid = { x: 12, y: 521.765625, width: 366, height: 1376 };
receipt.structural_readback.mobile_intro_text = 'Публичные сообщества Калининградской области, у которых подтверждено несколько встреч в разные даты. Площадка или похожее название сами по себе клубом не считаются.';
receipt.idempotency.mobile_shell_component_count = 1;
receipt.idempotency.mobile_shell_component_id_stable = true;
receipt.idempotency.desktop_shell_component_count = 1;
receipt.idempotency.desktop_shell_component_id_stable = true;
receipt.visual_qa = {
  desktop: 'STRUCTURAL_GEOMETRY_EXACT_VISUAL_EXPORT_BLOCKED_HTTP_504',
  mobile: 'STRUCTURAL_GEOMETRY_EXACT_VISUAL_EXPORT_BLOCKED_HTTP_504',
  result: 'OWNER_REREVIEW_REQUIRED',
  owner_acceptance: 'NOT_CLAIMED',
  owner_rereview_required: true,
};
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

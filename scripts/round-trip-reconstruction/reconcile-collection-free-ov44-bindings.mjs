#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const BINDINGS = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const CONTRACT = 'catalog/reconstruction-atlas/v1/collection-free-ov44-owner-exact.v1.json';
const RECEIPT = 'evidence/recovery-20260828/penpot/collection-free-ov44-owner-exact-receipt.v1.json';

const ASTRO_COMMIT = '52e220fc112d020b0a979de4ffa0101a3be6d76b';
const PENPOT_REVISION = 2889;
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880c4a36d153';
const LIBRARY_ID = FILE_ID;

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const component = (id, name, path) => ({ id, library_id: LIBRARY_ID, name, path });

const bodies = {
  desktop: component('8f804431-c282-8075-8008-8dd224624d1f', 'viewport=desktop;collection=free;fixture=2026-07-23', 'Collections / Free / Page body'),
  mobile: component('8f804431-c282-8075-8008-8dd2311c59f6', 'viewport=mobile;collection=free;fixture=2026-07-23', 'Collections / Free / Page body'),
};

const adapters = {
  desktop: [
    ['8f804431-c282-8075-8008-8e60f5bd62dd', 7030, '8f804431-c282-8075-8008-8dcf952bc4bb'],
    ['8f804431-c282-8075-8008-8e60f5c5aa4e', 7006, '8f804431-c282-8075-8008-8dcfba2a1afb'],
    ['8f804431-c282-8075-8008-8e60f5cc3845', 6901, '8f804431-c282-8075-8008-8e5fffce1104'],
  ],
  mobile: [
    ['8f804431-c282-8075-8008-8e610db6cd3a', 7030, '8f804431-c282-8075-8008-8dcfd8d7353c'],
    ['8f804431-c282-8075-8008-8e610dbcb934', 7006, '8f804431-c282-8075-8008-8dd1aad61572'],
    ['8f804431-c282-8075-8008-8e610dc3d430', 6901, '8f804431-c282-8075-8008-8e6007c2bd12'],
  ],
};

const scrolledOwners = {
  desktop: {
    componentId: '8f804431-c282-8075-8008-8e6128cb8d22',
    mainId: '8f804431-c282-8075-8008-8e6126184298',
    stickyComponentId: '8f804431-c282-8075-8008-8dd2147e11d9',
    stickyInstanceId: '8f804431-c282-8075-8008-8e61285fc3b2',
    bodyOffsetY: -663,
    sticky: { x: 990, y: 57, width: 240, height: 96, medallion: 58 },
  },
  mobile: {
    componentId: '8f804431-c282-8075-8008-8e613d7e5ba1',
    mainId: '8f804431-c282-8075-8008-8e6139fa8b0b',
    stickyComponentId: '8f804431-c282-8075-8008-8dd219a35813',
    stickyInstanceId: '8f804431-c282-8075-8008-8e613c5f2553',
    bodyOffsetY: -476,
    sticky: { x: 138, y: 64, width: 240, height: 96, medallion: 50 },
  },
};

const specs = {
  desktop: {
    board: {
      componentId: 'd87e18f1-dcb4-80a6-8008-880c5ee36bcd',
      componentName: 'viewport=desktop;state=free-collection · Astro AS-IS',
      id: 'd87e18f1-dcb4-80a6-8008-880c4a6d708e',
      name: 'Archetype / Collections / viewport=desktop;state=free-collection · Astro AS-IS',
      width: 1280,
      height: 1200,
    },
    children: [
      {
        component: component('a21f5e36-5d76-8065-8008-86ae4bdf9963', 'Desktop header', 'Shell v1 / Desktop'),
        height: 57, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Shell / Desktop header', parent_index: 0,
        shape_id: 'd87e18f1-dcb4-80a6-8008-8861f2901203', type: 'board', width: 1280, x: 0, y: 0,
      },
      {
        component: bodies.desktop,
        height: 2200, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Collections / Free body / desktop;fixture=2026-07-23', parent_index: 1,
        shape_id: '8f804431-c282-8075-8008-8dd235c207c6', type: 'board', width: 1180, x: 50, y: 57,
      },
    ],
    hero: '8f804431-c282-8075-8008-8dd235c207c8',
    criteria: '8f804431-c282-8075-8008-8dd235c24116',
    medallion: '8f804431-c282-8075-8008-8dd235c24118',
    results: '8f804431-c282-8075-8008-8dd235c2411a',
  },
  mobile: {
    board: {
      componentId: 'd87e18f1-dcb4-80a6-8008-880c69bcaf19',
      componentName: 'viewport=mobile;state=free-collection · Astro AS-IS',
      id: 'd87e18f1-dcb4-80a6-8008-880c4cb4c4e6',
      name: 'Archetype / Collections / viewport=mobile;state=free-collection · Astro AS-IS',
      width: 390,
      height: 1200,
    },
    children: [
      {
        component: component('a21f5e36-5d76-8065-8008-86aebfc67027', 'Mobile header', 'Shell v1 / Mobile'),
        height: 84, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Shell / Mobile header', parent_index: 0,
        shape_id: 'd87e18f1-dcb4-80a6-8008-8861f41719de', type: 'board', width: 390, x: 1320, y: 0,
      },
      {
        component: component('a21f5e36-5d76-8065-8008-86aec0a54bb5', 'surface=floating-island', 'Shell v1 / Mobile / Mobile bottom navigation'),
        height: 64, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Shell / Mobile bottom navigation', parent_index: 1,
        shape_id: 'd87e18f1-dcb4-80a6-8008-8861f693067b', type: 'board', width: 366, x: 1320, y: 1136,
      },
      {
        component: bodies.mobile,
        height: 2260, hidden: false, is_component_copy: true, is_component_main: false,
        name: 'linked Collections / Free body / mobile;fixture=2026-07-23', parent_index: 2,
        shape_id: '8f804431-c282-8075-8008-8dd244bb9dff', type: 'board', width: 366, x: 1332, y: 84,
      },
    ],
    hero: '8f804431-c282-8075-8008-8dd244bb9e01',
    criteria: '8f804431-c282-8075-8008-8dd244bb9e06',
    medallion: '8f804431-c282-8075-8008-8dd244bb9e08',
    results: '8f804431-c282-8075-8008-8dd244bbee80',
  },
};

const contract = read(CONTRACT);
contract.status = 'CORRECTION_MATERIALIZED_CANONICAL_CARDS_AND_SCROLL_STATES_STRUCTURAL_PASS_OWNER_REREVIEW_REQUIRED';
contract.astro.commit = ASTRO_COMMIT;
contract.astro.browser_evidence = 'evidence/recovery-20260829/astro/ov44-free-collection-centralized-card-scroll-evidence.v1.json';
contract.astro.source_snapshots = [
  { path: 'site/src/pages/podborki/[slug]/index.astro', sha256: '374db59147e8001e24d364d1181114ff41eff4bb9e8653f40a9e5a06b7b0c055' },
  { path: 'site/src/components/FreeCollectionSurface.astro', sha256: '8a89de1d80dfcc10dcdf67d27d73e597d535206356fdf7e1db445dbac7b30836' },
  { path: 'site/src/components/OptimizedEventCardGrid.astro', sha256: '04fbf534c2aef5512b8919ed0657fb771dd42abca4bf057360c465a188985a33' },
  { path: 'site/src/data/searchCollections.ts', sha256: '6a712f01d7b6dab7ac94d023c13b51e3ff4fdf04bcd687d0b2559dfb8b9cd495' },
];
contract.representative_events = [
  {
    event_id: 7030,
    title: 'Праздник непослушания',
    href: '/sobytiya/prazdnik-neposlushaniya-kaliningrad-7030/',
    image: 'https://static.kenigevents.ru/p/image/v2/4c/4c067daf59dcdf244a89768e1d9e88168fd0c727e38732eb707fee4f29000960.webp',
    event_type: 'встреча', occurrence: '23 июля 12:00', price: 'Бесплатно · вход свободный', place: 'Калининград · Научная библиотека',
  },
  {
    event_id: 7006,
    title: 'Открытая лекция по Трансцендентальной Медитации',
    href: '/sobytiya/otkrytaya-lektsiya-po-transtsendentalnoy-meditatsii-kaliningrad-7006/',
    image: 'https://static.kenigevents.ru/p/image/v2/af/af810be081f4302e13a70dedc4ddd988026db5113a569c3352a7eb2eac4da851.webp',
    event_type: 'лекция', occurrence: '23 июля 18:00', price: 'Бесплатно · регистрация', place: 'Калининград · ТЦ «Панорама»',
  },
  {
    event_id: 6901,
    title: 'Презентация сборника «Поправка на дрейф»',
    href: '/sobytiya/prezentatsiya-sbornika-popravka-na-dreyf-kaliningrad-6901/',
    image: 'https://static.kenigevents.ru/p/dh16/20/2061604150591030203300308030803345324933103126075a33180358010013.webp',
    event_type: 'встреча', occurrence: '23 июля 18:30', price: 'Бесплатно · вход свободный', place: 'Калининград · Научная библиотека',
  },
];
contract.responsive_contract.desktop.card_columns = 3;
contract.responsive_contract.desktop.representative_card_width = 347.328125;
contract.responsive_contract.mobile.card_columns = 1;
contract.responsive_contract.mobile.representative_card_width = 340;
contract.penpot.revision = PENPOT_REVISION;
contract.penpot.materialization_status = 'DESKTOP_AND_MOBILE_TOP_AND_SCROLLED_NATIVE_STRUCTURAL_READBACK_PASS';
contract.penpot.current_structural_readback = {
  revision: PENPOT_REVISION,
  desktop: { owner: specs.desktop.board.id, body: specs.desktop.children[1].shape_id, hero: specs.desktop.hero, medallion: specs.desktop.medallion, results: specs.desktop.results, linked_event_cards: 3, card_columns: 3, representative_event_ids: [7030, 7006, 6901] },
  mobile: { owner: specs.mobile.board.id, body: specs.mobile.children[2].shape_id, hero: specs.mobile.hero, medallion: specs.mobile.medallion, results: specs.mobile.results, linked_event_cards: 3, card_columns: 1, representative_event_ids: [7030, 7006, 6901] },
  scrolled_owners: scrolledOwners,
  canonical_card_lineage: {
    desktop: 'b0fe69fd-ccaf-8025-8008-846f0b7f12cd',
    mobile: '7f078c80-87b8-80f5-8008-85839e8975f6',
    rejected_quarantined_dynamic_experiment: 'b0fe69fd-ccaf-8025-8008-844b666fe76c',
  },
  validation: [],
};
contract.penpot.required_compact_sticky_state.owner_components = scrolledOwners;
contract.penpot.visual_evidence.current_revision_note = 'Revision 2889 readback proves corrected media-first canonical card lineage, three desktop columns, one mobile column, and explicit linked desktop/mobile hero-passed owners. Penpot export service returned HTTP 504; no new visual acceptance is claimed.';
contract.penpot.visual_evidence.previous_exports_status = 'SUPERSEDED_BY_CANONICAL_CARD_REPAIR';
write(CONTRACT, contract);

const receipt = read(RECEIPT);
receipt.status = contract.status;
receipt.source_tuple.astro_commit = ASTRO_COMMIT;
receipt.penpot.current_revision = PENPOT_REVISION;
receipt.penpot.current_structural_readback = contract.penpot.current_structural_readback;
receipt.penpot.scrolled_owners = scrolledOwners;
receipt.event_adapter_readback = Object.entries(adapters).flatMap(([viewport, rows]) => rows.map(([, event_id, component_id]) => ({
  viewport,
  event_id,
  component_id,
  linked_template_component_id: viewport === 'desktop'
    ? 'b0fe69fd-ccaf-8025-8008-846f0b7f12cd'
    : '7f078c80-87b8-80f5-8008-85839e8975f6',
  media_first: true,
  exact_text: true,
  native_image_data_type: 'function',
})));
receipt.structural_readback.linked_event_adapter_roots = 6;
receipt.structural_readback.detached_event_adapter_roots = 0;
receipt.structural_readback.explicit_scrolled_owner_roots = 2;
receipt.structural_readback.page_validation = [];
receipt.visual_export.status = 'CURRENT_EXPORT_HTTP_504_STRUCTURAL_READBACK_PASS';
receipt.visual_export.visual_inspection = 'SUPERSEDED_PREVIOUS_EXPORTS_ONLY';
receipt.visual_export.current_revision_note = contract.penpot.visual_evidence.current_revision_note;
write(RECEIPT, receipt);

const bindings = read(BINDINGS);
const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.collections');
if (!archetype) throw new Error('bindings have no Collections archetype');
archetype.source_exact_correction = {
  contract_id: contract.contract_id,
  path: CONTRACT,
  sha256: sha256(CONTRACT),
  status: contract.status,
};
archetype.fixture_slots = [
  {
    content_type: 'generated-route',
    fixture_refs: ['/podborki/', '/podborki/besplatnye-sobytiya/', '/podborki/dzhaz-na-vyhodnyh/', '/podborki/gastronomiya/'],
    multiplicity: 'many', required: true, slot_id: 'generated-route-scenarios',
  },
  {
    content_type: 'semantic-state',
    fixture_refs: ['free-collection-ready', 'free-collection-hero', 'free-collection-results', 'free-collection-scroll-hero-passed-desktop', 'free-collection-scroll-hero-passed-mobile', 'sticky-identity', 'directory', 'detail-empty'],
    multiplicity: 'many', required: true, slot_id: 'state-scenarios',
  },
];

const boardEntries = [...archetype.boards, ...bindings.cases.filter((item) => item.archetype_id === archetype.archetype_id)];
for (const entry of boardEntries) {
  const spec = specs[entry.viewport];
  entry.width = spec.board.width;
  entry.height = spec.board.height;
  entry.astro.commit = ASTRO_COMMIT;
  entry.astro.route = '/podborki/besplatnye-sobytiya/';
  entry.astro.capture = { full_page: false, mode: 'viewport' };
  entry.penpot.revision = PENPOT_REVISION;
  entry.penpot.board_id = spec.board.id;
  entry.penpot.board_name = spec.board.name;
  entry.penpot.board_component = component(spec.board.componentId, spec.board.componentName, 'Archetype / Collections');
  entry.penpot.direct_children = spec.children;
}

const eventDependency = archetype.dependencies.find((item) => item.component_id === 'event.card.large');
if (!eventDependency) throw new Error('bindings have no event.card.large dependency');
eventDependency.source_exact_resolution = {
  status: 'RESOLVED_THROUGH_EXACT_DATA_ADAPTERS_AROUND_CERTIFIED_MEDIA_FIRST_FAMILY',
  canonical_templates: {
    desktop: 'b0fe69fd-ccaf-8025-8008-846f0b7f12cd',
    mobile: '7f078c80-87b8-80f5-8008-85839e8975f6',
  },
  centralized_astro_consumer: 'site/src/components/OptimizedEventCardGrid.astro',
  rejected_quarantined_template: {
    component_id: 'b0fe69fd-ccaf-8025-8008-844b666fe76c',
    reason: 'ungoverned experimental dynamic card with body-before-media anatomy; forbidden for OV-44 owner projection',
  },
  adapter_instances: Object.fromEntries(Object.entries(adapters).map(([viewport, rows]) => [viewport, rows.map(([shape_id, event_id, component_id]) => ({ shape_id, event_id, component_id }))])),
  detached_adapter_roots: 0,
  receipt: RECEIPT,
};

const criteriaDependency = archetype.dependencies.find((item) => item.component_id === 'collection.criteria');
if (criteriaDependency) criteriaDependency.source_exact_resolution = {
  status: 'RESOLVED_IN_FREE_COLLECTION_PAGE_BODY',
  desktop_body_component_id: bodies.desktop.id,
  mobile_body_component_id: bodies.mobile.id,
  receipt: RECEIPT,
};

const regionInstance = (viewport, shape_id, role, extra = {}) => ({
  component: bodies[viewport],
  role,
  shape_id,
  viewport,
  ...extra,
});
for (const region of archetype.regions) {
  if (region.region_id === 'collection.index-header' || region.region_id === 'collection.directory') {
    region.penpot_instances = [];
    region.active_owner_state = false;
    region.retained_scenario = 'directory';
  } else if (region.region_id === 'collection.detail-header') {
    region.penpot_instances = ['desktop', 'mobile'].map((viewport) => regionInstance(viewport, specs[viewport].hero, 'free-collection-hero', { medallion_shape_id: specs[viewport].medallion }));
    region.active_owner_state = true;
  } else if (region.region_id === 'collection.criteria') {
    region.penpot_instances = ['desktop', 'mobile'].map((viewport) => regionInstance(viewport, specs[viewport].criteria, 'free-collection-criteria'));
    region.active_owner_state = true;
  } else if (region.region_id === 'collection.results') {
    region.penpot_instances = ['desktop', 'mobile'].map((viewport) => regionInstance(viewport, specs[viewport].results, 'free-collection-results', {
      event_adapter_shape_ids: adapters[viewport].map(([shape_id]) => shape_id),
      linked_event_card_count: 3,
    }));
    region.active_owner_state = true;
  } else {
    region.active_owner_state = false;
  }
}

bindings.correction_overlays ??= [];
const overlay = {
  archetype_id: archetype.archetype_id,
  astro_commit: ASTRO_COMMIT,
  contract: archetype.source_exact_correction,
  penpot_page_id: PAGE_ID,
  penpot_revision: PENPOT_REVISION,
  review_items: ['OV-44'],
};
const overlayIndex = bindings.correction_overlays.findIndex((item) => item.archetype_id === archetype.archetype_id);
if (overlayIndex >= 0) bindings.correction_overlays[overlayIndex] = overlay;
else bindings.correction_overlays.push(overlay);

write(BINDINGS, bindings);
console.log(`${BINDINGS}: reconciled ${archetype.archetype_id} to Free collection at Penpot revision ${PENPOT_REVISION}`);

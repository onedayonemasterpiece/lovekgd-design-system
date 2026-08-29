#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const BINDINGS = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const CONTRACT = 'catalog/reconstruction-atlas/v1/personal-feed-ov36-37-source-exact.v1.json';
const RECEIPT = 'evidence/recovery-20260829/penpot/personal-feed-ov36-37-native-receipt.v1.json';
const ASTRO_COMMIT = '812ffc279728221b547707474bcb521f27c4a73d';
const PENPOT_REVISION = 2798;
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880d8bcc2d0b';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const comp = (id, name, path) => ({ id, library_id: FILE_ID, name, path });
const child = ({ component, height, id, name, parent_index, width, x, y }) => ({
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
});

const fixtureIds = ['5459', '6870', '6941'];
const specs = {
  desktop: {
    board: {
      id: 'd87e18f1-dcb4-80a6-8008-880d8c05a466',
      componentId: 'd87e18f1-dcb4-80a6-8008-880e09d93580',
      componentName: 'viewport=desktop;state=bounded-coverage-3-of-16-interests+3-of-9-recommendations;auth=email+yandex · PARTIAL',
      name: 'Archetype / Personal feed / viewport=desktop;state=bounded-coverage-3-of-16-interests+3-of-9-recommendations;auth=email+yandex · PARTIAL',
      width: 1280,
      height: 3315,
    },
    workspace: {
      id: '8f804431-c282-8075-8008-8e0ced4d2a2d',
      componentId: '8f804431-c282-8075-8008-8e0b5a66375d',
      componentName: 'viewport=desktop;state=bounded-coverage-3-of-16-interests+3-of-9-recommendations',
    },
    interests: [
      ['8f804431-c282-8075-8008-8e0ced4d81ee', 'jazz'],
      ['8f804431-c282-8075-8008-8e0ced4dd81a', 'exhibitions'],
      ['8f804431-c282-8075-8008-8e0ced4e09c2', 'family'],
    ],
    profileSignalsId: '8f804431-c282-8075-8008-8e0ced4e7ab5',
    recommendations: {
      id: '8f804431-c282-8075-8008-8e0ced4ea546',
      componentId: '8f804431-c282-8075-8008-8dfda1f3c60f',
      componentName: 'viewport=desktop;fixtures=5459,6870,6941;layout=3-column',
      cards: [
        ['8f804431-c282-8075-8008-8e0ced4ea547', '5459'],
        ['8f804431-c282-8075-8008-8e0ced4f5d08', '6870'],
        ['8f804431-c282-8075-8008-8e0ced4fdc74', '6941'],
      ],
      cardComponentId: '8f804431-c282-8075-8008-8dfda119c081',
      cardComponentName: 'viewport=desktop;size=large',
    },
  },
  mobile: {
    board: {
      id: 'd87e18f1-dcb4-80a6-8008-880d8db35320',
      componentId: 'd87e18f1-dcb4-80a6-8008-880e925ae60b',
      componentName: 'viewport=mobile;state=bounded-coverage-3-of-16-interests+3-of-9-recommendations;auth=email+yandex · PARTIAL',
      name: 'Archetype / Personal feed / viewport=mobile;state=bounded-coverage-3-of-16-interests+3-of-9-recommendations;auth=email+yandex · PARTIAL',
      width: 390,
      height: 4612,
    },
    workspace: {
      id: '8f804431-c282-8075-8008-8e0cfbb3ae6c',
      componentId: '8f804431-c282-8075-8008-8e0c48b3cc23',
      componentName: 'viewport=mobile;state=bounded-coverage-3-of-16-interests+3-of-9-recommendations',
    },
    interests: [
      ['8f804431-c282-8075-8008-8e0cfbb3d2ee', 'jazz'],
      ['8f804431-c282-8075-8008-8e0cfbb426af', 'exhibitions'],
      ['8f804431-c282-8075-8008-8e0cfbb46d5b', 'family'],
    ],
    profileSignalsId: '8f804431-c282-8075-8008-8e0cfbb4d5d3',
    recommendations: {
      id: '8f804431-c282-8075-8008-8e0cfbb5167c',
      componentId: '8f804431-c282-8075-8008-8dfdd31db4ad',
      componentName: 'viewport=mobile;fixtures=5459,6870,6941;layout=1-column',
      cards: [
        ['8f804431-c282-8075-8008-8e0cfbb5167d', '5459'],
        ['8f804431-c282-8075-8008-8e0cfbb57cf6', '6870'],
        ['8f804431-c282-8075-8008-8e0cfbb5f2f1', '6941'],
      ],
      cardComponentId: '8f804431-c282-8075-8008-8dfdd25340ab',
      cardComponentName: 'viewport=mobile;size=large',
    },
  },
};

specs.desktop.children = [
  child({ component: comp('a21f5e36-5d76-8065-8008-86ae4bdf9963', 'Desktop header', 'Shell v1 / Desktop'), height: 57, id: '8f804431-c282-8075-8008-8e0cec3c48c6', name: 'linked Shell / Desktop header', parent_index: 0, width: 1280, x: 0, y: 0 }),
  child({ component: comp('d87e18f1-dcb4-80a6-8008-886854f5fea1', 'viewport=desktop', 'Personal feed / Hero'), height: 554, id: '8f804431-c282-8075-8008-8e0cec630cb5', name: 'linked Personal feed / Hero / desktop', parent_index: 1, width: 1180, x: 50, y: 95 }),
  child({ component: comp('d87e18f1-dcb4-80a6-8008-886858481578', 'viewport=desktop;state=anonymous;auth=email+yandex', 'Personal feed / Account panel'), height: 202, id: '8f804431-c282-8075-8008-8e0cecc43d46', name: 'linked Personal feed / Account panel / desktop anonymous / email+yandex', parent_index: 2, width: 1180, x: 50, y: 665 }),
  child({ component: comp('d87e18f1-dcb4-80a6-8008-88685a2c67c9', 'viewport=desktop;policy=local-no-extra-consent', 'Personal feed / Runtime note'), height: 58, id: '8f804431-c282-8075-8008-8e0ced0de102', name: 'linked Personal feed / Runtime note / desktop / local-no-extra-consent', parent_index: 3, width: 1180, x: 50, y: 883 }),
  child({ component: comp(specs.desktop.workspace.componentId, specs.desktop.workspace.componentName, 'Personal feed / Workspace'), height: 1620, id: specs.desktop.workspace.id, name: 'linked Personal feed / Workspace / desktop / populated', parent_index: 4, width: 1180, x: 50, y: 965 }),
  child({ component: comp('d87e18f1-dcb4-80a6-8008-885914f2be1b', 'Footer viewport · representative', 'Shell v1 / Desktop'), height: 681.859375, id: '8f804431-c282-8075-8008-8e0cee075c4d', name: 'linked Shell / Desktop footer viewport', parent_index: 5, width: 1280, x: 0, y: 2633.140625 }),
];
specs.mobile.children = [
  child({ component: comp('a21f5e36-5d76-8065-8008-86aebfc67027', 'Mobile header', 'Shell v1 / Mobile'), height: 84, id: '8f804431-c282-8075-8008-8e0cfa9a229c', name: 'linked Shell / Mobile header', parent_index: 0, width: 390, x: 1320, y: 0 }),
  child({ component: comp('d87e18f1-dcb4-80a6-8008-886856fb5dc0', 'viewport=mobile', 'Personal feed / Hero'), height: 490, id: '8f804431-c282-8075-8008-8e0cfad9f2dd', name: 'linked Personal feed / Hero / mobile', parent_index: 1, width: 366, x: 1332, y: 85 }),
  child({ component: comp('d87e18f1-dcb4-80a6-8008-8868599edc72', 'viewport=mobile;state=anonymous;auth=email+yandex', 'Personal feed / Account panel'), height: 320, id: '8f804431-c282-8075-8008-8e0cfb4311a4', name: 'linked Personal feed / Account panel / mobile anonymous / email+yandex', parent_index: 2, width: 366, x: 1332, y: 592 }),
  child({ component: comp('d87e18f1-dcb4-80a6-8008-88685aada6ca', 'viewport=mobile;policy=local-no-extra-consent', 'Personal feed / Runtime note'), height: 138, id: '8f804431-c282-8075-8008-8e0cfb835f99', name: 'linked Personal feed / Runtime note / mobile / local-no-extra-consent', parent_index: 3, width: 366, x: 1332, y: 928 }),
  child({ component: comp(specs.mobile.workspace.componentId, specs.mobile.workspace.componentName, 'Personal feed / Workspace'), height: 3430, id: specs.mobile.workspace.id, name: 'linked Personal feed / Workspace / mobile / populated', parent_index: 4, width: 366, x: 1332, y: 1082 }),
  child({ component: comp('a21f5e36-5d76-8065-8008-86aec0a54bb5', 'surface=floating-island', 'Shell v1 / Mobile'), height: 64, id: '8f804431-c282-8075-8008-8e0cfc362924', name: 'linked Shell / Mobile bottom navigation', parent_index: 5, width: 366, x: 1320, y: 4548 }),
];

const contract = read(CONTRACT);
contract.authority.current_astro_commit = ASTRO_COMMIT;
contract.semantic_resolution = {
  applies_over: 'catalog/global-archetype-sot-v1/archetype-contracts/personal-feed.semantic-contract.v1.json',
  overall_archetype_canonical: false,
  resolved_scope: ['personal.header', 'personal.account', 'personal.runtime-note'],
  partial_scope: ['personal.interest-profile:3-of-16', 'personal.filters:3-of-16', 'personal.feed:3-of-9', 'personal.feedback:3-of-9'],
  unresolved_scope: ['loading', 'failure', 'stale', 'configured-profile', 'full-16-interests-in-penpot', 'dense-9-in-penpot'],
  source_exact_state: {
    authentication_choices: ['email', 'yandex'],
    extra_personalization_consent: false,
    feed_is_never_blank: true,
    penpot_projection: 'bounded-coverage-3-of-16-interests+3-of-9-recommendations',
    astro_dense_authority: 'recommendations-9',
    fixture_order: fixtureIds,
  },
};
contract.penpot.round_trip_revision = PENPOT_REVISION;
contract.penpot.owner_names = Object.fromEntries(Object.entries(specs).map(([viewport, spec]) => [viewport, spec.board.name]));
contract.penpot.owner_direct_children = Object.fromEntries(Object.entries(specs).map(([viewport, spec]) => [viewport, spec.children.map((item) => item.shape_id)]));
write(CONTRACT, contract);

const receipt = read(RECEIPT);
receipt.round_trip = {
  astro_commit: ASTRO_COMMIT,
  penpot_revision: PENPOT_REVISION,
  validation: [],
  desktop_owner_name: specs.desktop.board.name,
  mobile_owner_name: specs.mobile.board.name,
  desktop_direct_child_ids: specs.desktop.children.map((item) => item.shape_id),
  mobile_direct_child_ids: specs.mobile.children.map((item) => item.shape_id),
  source_exact_state: 'bounded-coverage-3-of-16-interests+3-of-9-recommendations;auth=email+yandex;policy=local-no-extra-consent',
};
write(RECEIPT, receipt);

const bindings = read(BINDINGS);
const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.personal-feed');
if (!archetype) throw new Error('bindings have no Personal feed archetype');
archetype.source_exact_correction = { contract_id: contract.contract_id, path: CONTRACT, sha256: sha256(CONTRACT), status: contract.status };
archetype.fixture_slots = [
  { content_type: 'generated-route', fixture_refs: ['/dlya-menya/'], multiplicity: 'many', required: true, slot_id: 'generated-route-scenarios' },
  { content_type: 'event', fixture_refs: fixtureIds.map((id) => `event.real.${id}`), multiplicity: 'many', required: true, slot_id: 'bounded-recommendations' },
  { content_type: 'semantic-state', fixture_refs: ['not-yet-configured', 'configured', 'profile-empty', 'recommendations-3-of-9', 'auth-email', 'auth-yandex', 'local-no-extra-consent'], multiplicity: 'many', required: true, slot_id: 'source-exact-states' },
];

const entries = [...archetype.boards, ...bindings.cases.filter((item) => item.archetype_id === archetype.archetype_id)];
for (const entry of entries) {
  const spec = specs[entry.viewport];
  entry.width = spec.board.width;
  entry.height = spec.board.height;
  entry.astro = { commit: ASTRO_COMMIT, route: '/dlya-menya/', capture: { full_page: true, mode: 'full-page' } };
  entry.penpot.revision = PENPOT_REVISION;
  entry.penpot.board_id = spec.board.id;
  entry.penpot.board_name = spec.board.name;
  entry.penpot.board_component = comp(spec.board.componentId, spec.board.componentName, 'Archetype / Personal feed');
  entry.penpot.direct_children = spec.children;
}

const workspaceInstance = (viewport) => ({
  viewport,
  shape_id: specs[viewport].workspace.id,
  component: comp(specs[viewport].workspace.componentId, specs[viewport].workspace.componentName, 'Personal feed / Workspace'),
  role: 'profile-workspace-root',
});
const cardInstances = (viewport) => specs[viewport].recommendations.cards.map(([shape_id, event_id]) => ({
  viewport,
  shape_id,
  event_id,
  component: comp(specs[viewport].recommendations.cardComponentId, specs[viewport].recommendations.cardComponentName, 'Personal feed / Recommendation card'),
  role: 'recommendation-with-feedback',
}));
for (const region of archetype.regions) {
  if (region.region_id === 'personal.header') {
    region.penpot_instances = ['desktop', 'mobile'].map((viewport) => ({ viewport, shape_id: specs[viewport].children[1].shape_id, component: specs[viewport].children[1].component }));
  } else if (region.region_id === 'personal.interest-profile') {
    region.penpot_instances = ['desktop', 'mobile'].flatMap((viewport) => [
      workspaceInstance(viewport),
      { viewport, shape_id: specs[viewport].profileSignalsId, component: comp(specs[viewport].workspace.componentId, specs[viewport].workspace.componentName, 'Personal feed / Workspace'), role: 'profile-signals-surface' },
    ]);
  } else if (region.region_id === 'personal.filters') {
    region.penpot_instances = ['desktop', 'mobile'].flatMap((viewport) => specs[viewport].interests.map(([shape_id, interest]) => ({ viewport, shape_id, interest, component: comp(specs[viewport].workspace.componentId, specs[viewport].workspace.componentName, 'Personal feed / Workspace'), role: 'interest-choice-surface' })));
  } else if (region.region_id === 'personal.feed') {
    region.penpot_instances = ['desktop', 'mobile'].flatMap((viewport) => [
      { viewport, shape_id: specs[viewport].recommendations.id, component: comp(specs[viewport].recommendations.componentId, specs[viewport].recommendations.componentName, 'Personal feed / Recommendations'), role: 'recommendations-root' },
      ...cardInstances(viewport),
    ]);
  } else if (region.region_id === 'personal.feedback') {
    region.penpot_instances = ['desktop', 'mobile'].flatMap(cardInstances);
  }
}

for (const dependency of archetype.dependencies) {
  if (dependency.component_id === 'personal.interest-profile') {
    dependency.source_exact_resolution = { disposition: 'reuse_existing_workspace', status: 'RESOLVED', extra_consent_present: false };
    dependency.penpot_candidates = ['desktop', 'mobile'].map((viewport) => ({ id: specs[viewport].workspace.componentId, library_id: FILE_ID, name: specs[viewport].workspace.componentName, path: 'Personal feed / Workspace', score: 4 }));
  } else if (dependency.component_id === 'listing.personal-filter') {
    dependency.source_exact_resolution = { disposition: 'workspace_interest_choices', status: 'RESOLVED', representative_interests: ['jazz', 'exhibitions', 'family'] };
  } else if (dependency.component_id === 'focus.feedback') {
    dependency.source_exact_resolution = { disposition: 'recommendation_card_embedded_feedback', status: 'RESOLVED', choice_count_per_card: 3 };
  }
  for (const candidate of dependency.penpot_candidates ?? []) {
    for (const spec of Object.values(specs)) {
      if (candidate.id === spec.board.componentId) {
        candidate.name = spec.board.componentName;
        candidate.path = 'Archetype / Personal feed';
      }
    }
  }
}

bindings.correction_overlays ??= [];
const overlay = { archetype_id: archetype.archetype_id, astro_commit: ASTRO_COMMIT, contract: archetype.source_exact_correction, penpot_page_id: PAGE_ID, penpot_revision: PENPOT_REVISION, review_items: ['OV-36', 'OV-37'] };
const overlayIndex = bindings.correction_overlays.findIndex((item) => item.archetype_id === archetype.archetype_id);
if (overlayIndex >= 0) bindings.correction_overlays[overlayIndex] = overlay;
else bindings.correction_overlays.push(overlay);

write(BINDINGS, bindings);
console.log(`${BINDINGS}: reconciled ${archetype.archetype_id} at Penpot revision ${PENPOT_REVISION}`);

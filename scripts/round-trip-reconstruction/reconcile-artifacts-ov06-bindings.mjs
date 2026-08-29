#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const BINDINGS = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const CONTRACT = 'catalog/reconstruction-atlas/v1/artifact-collection-1-owner-exact-seven.v1.json';
const ASTRO_COMMIT = '812ffc279728221b547707474bcb521f27c4a73d';
const REVISION = 2796;
const FILE = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE = 'd87e18f1-dcb4-80a6-8008-880f9a822a76';
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const hash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const comp = (id, name, path) => ({ id, library_id: FILE, name, path });
const item = (component, id, name, width, height, x, y, parent_index) => ({ component, height, hidden: false, is_component_copy: true, is_component_main: false, name, parent_index, shape_id: id, type: 'board', width, x, y });

const contract = read(CONTRACT);
const artifactByComponent = new Map(contract.artifacts.map((artifact) => [artifact.penpot_component_id, artifact]));
const artifactRows = {
  desktop: [
    ['8f804431-c282-8075-8008-8e06dda23466', '8f804431-c282-8075-8008-8db5b8f67f28'],
    ['8f804431-c282-8075-8008-8e06dda6f8fd', '8f804431-c282-8075-8008-8db5b940e564'],
    ['8f804431-c282-8075-8008-8e06ddab617d', '8f804431-c282-8075-8008-8db5b98fcdc2'],
    ['8f804431-c282-8075-8008-8e06ddaf14f9', '8f804431-c282-8075-8008-8db5b9eb27fe'],
    ['8f804431-c282-8075-8008-8e06ddb29a35', '8f804431-c282-8075-8008-8db5baabe2fc'],
    ['8f804431-c282-8075-8008-8e06ddb6e7b2', '8f804431-c282-8075-8008-8db5bb3b14a1'],
    ['8f804431-c282-8075-8008-8e06ddbb2d6a', '8f804431-c282-8075-8008-8db5bc09c066'],
  ],
  mobile: [
    ['8f804431-c282-8075-8008-8e077b68042f', '8f804431-c282-8075-8008-8db5b8f67f28'],
    ['8f804431-c282-8075-8008-8e077b6c36d1', '8f804431-c282-8075-8008-8db5b940e564'],
    ['8f804431-c282-8075-8008-8e077b70e320', '8f804431-c282-8075-8008-8db5b98fcdc2'],
    ['8f804431-c282-8075-8008-8e077b74035f', '8f804431-c282-8075-8008-8db5b9eb27fe'],
    ['8f804431-c282-8075-8008-8e077b7703fc', '8f804431-c282-8075-8008-8db5baabe2fc'],
    ['8f804431-c282-8075-8008-8e077b7a9097', '8f804431-c282-8075-8008-8db5bb3b14a1'],
    ['8f804431-c282-8075-8008-8e077b7dddda', '8f804431-c282-8075-8008-8db5bc09c066'],
  ],
};
const artifactInstances = (viewport) => artifactRows[viewport].map(([shape_id, componentId]) => {
  const artifact = artifactByComponent.get(componentId);
  return { artifact_id: artifact.artifact_id, component: comp(componentId, artifact.public_name, 'ArtifactCollection / Collection 1'), order: artifact.order, shape_id, viewport };
});

const specs = {
  desktop: {
    boardId: 'd87e18f1-dcb4-80a6-8008-880f9aaea84e', componentId: 'd87e18f1-dcb4-80a6-8008-880fa24f3f10', width: 1280, height: 2718,
    name: 'viewport=desktop;state=all-found-7-of-7 · native donor reconstruction',
    children: [
      item(comp('a21f5e36-5d76-8065-8008-86ae4bdf9963', 'Desktop header', 'Shell v1 / Desktop'), 'd87e18f1-dcb4-80a6-8008-886a9eba37d2', 'linked Shell / Desktop header', 1280, 57, 0, 0, 0),
      item(comp('d87e18f1-dcb4-80a6-8008-886a9e3cb500', 'viewport=desktop;state=all-found-7-of-7 · native donor reconstruction', 'Artifacts / Collection'), 'd87e18f1-dcb4-80a6-8008-886a9ecb0a02', 'linked Artifacts / Collection / desktop;state=all-found-7-of-7', 1180, 1900, 50, 88, 1),
      item(comp('d87e18f1-dcb4-80a6-8008-885914f2be1b', 'Footer viewport · representative', 'Shell v1 / Desktop'), 'd87e18f1-dcb4-80a6-8008-886a9edcb4b0', 'linked Shell / Desktop footer viewport', 1280, 681.859375, 0, 2036.109375, 2),
    ],
  },
  mobile: {
    boardId: 'd87e18f1-dcb4-80a6-8008-880f9c4c81c4', componentId: 'd87e18f1-dcb4-80a6-8008-880fa4a066b4', width: 390, height: 2951,
    name: 'viewport=mobile;state=all-found-7-of-7 · native donor reconstruction',
    children: [
      item(comp('a21f5e36-5d76-8065-8008-86aebfc67027', 'Mobile header', 'Shell v1 / Mobile'), 'd87e18f1-dcb4-80a6-8008-886a9efc1891', 'linked Shell / Mobile header', 390, 84, 1320, 0, 0),
      item(comp('d87e18f1-dcb4-80a6-8008-886a9eb225d0', 'viewport=mobile;state=all-found-7-of-7 · native donor reconstruction', 'Artifacts / Collection'), 'd87e18f1-dcb4-80a6-8008-886a9f08fe20', 'linked Artifacts / Collection / mobile;state=all-found-7-of-7', 366, 2700, 1332, 84, 1),
      item(comp('a21f5e36-5d76-8065-8008-86aec0a54bb5', 'surface=floating-island', 'Shell v1 / Mobile'), 'd87e18f1-dcb4-80a6-8008-886a9f21406a', 'linked Shell / Mobile bottom navigation', 366, 64, 1320, 2887, 2),
    ],
  },
};

contract.astro.round_trip_commit = ASTRO_COMMIT;
contract.penpot.round_trip_revision = REVISION;
contract.penpot.foundation_binding_revision = REVISION;
contract.penpot.owner_collision_readback = { revision: REVISION, visible_top_level_collisions: [], validation: [] };
write(CONTRACT, contract);

const bindings = read(BINDINGS);
const archetype = bindings.archetypes.find((entry) => entry.archetype_id === 'archetype.artifacts');
if (!archetype) throw new Error('bindings have no Artifacts archetype');
archetype.source_exact_correction = { contract_id: contract.contract_id, path: CONTRACT, sha256: hash(CONTRACT), status: contract.status };
archetype.fixture_slots = [
  { content_type: 'generated-route', fixture_refs: ['/artefakty/'], multiplicity: 'many', required: true, slot_id: 'generated-route-scenarios' },
  { content_type: 'artifact', fixture_refs: contract.artifacts.map((artifact) => artifact.artifact_id), multiplicity: 'many', required: true, slot_id: 'collection-1-exact-seven' },
  { content_type: 'semantic-state', fixture_refs: ['none-found', 'subset-found-3-of-7', 'all-found-7-of-7', 'hover-and-keyboard-focus', 'selected-detail'], multiplicity: 'many', required: true, slot_id: 'state-scenarios' },
];
for (const entry of [...archetype.boards, ...bindings.cases.filter((item) => item.archetype_id === archetype.archetype_id)]) {
  const spec = specs[entry.viewport];
  entry.width = spec.width; entry.height = spec.height;
  entry.astro = { commit: ASTRO_COMMIT, route: '/artefakty/', capture: { full_page: true, mode: 'full-page' } };
  entry.penpot.revision = REVISION;
  entry.penpot.board_id = spec.boardId;
  entry.penpot.board_name = `Archetype / Artifacts / ${spec.name}`;
  entry.penpot.board_component = comp(spec.componentId, spec.name, 'Archetype / Artifacts');
  entry.penpot.direct_children = spec.children;
}
for (const region of archetype.regions) {
  if (['artifact.collection-header', 'artifact.progress'].includes(region.region_id)) {
    region.penpot_instances = ['desktop', 'mobile'].map((viewport) => ({ component: specs[viewport].children[1].component, shape_id: specs[viewport].children[1].shape_id, viewport }));
  } else if (region.region_id === 'artifact.cards') {
    region.penpot_instances = [...artifactInstances('desktop'), ...artifactInstances('mobile')];
  } else if (region.region_id === 'artifact.reserved-slots') {
    region.penpot_instances = [];
    region.source_exact_disposition = 'not-applicable-exact-seven-no-reserved-slots';
  }
}
for (const dependency of archetype.dependencies) {
  for (const candidate of dependency.penpot_candidates ?? []) {
    if (candidate.id === specs.desktop.children[1].component.id) candidate.name = specs.desktop.children[1].component.name;
    if (candidate.id === specs.mobile.children[1].component.id) candidate.name = specs.mobile.children[1].component.name;
  }
}
bindings.correction_overlays ??= [];
const overlay = { archetype_id: archetype.archetype_id, astro_commit: ASTRO_COMMIT, contract: archetype.source_exact_correction, penpot_page_id: PAGE, penpot_revision: REVISION, review_items: ['OV-06'] };
const index = bindings.correction_overlays.findIndex((item) => item.archetype_id === archetype.archetype_id);
if (index >= 0) bindings.correction_overlays[index] = overlay; else bindings.correction_overlays.push(overlay);
write(BINDINGS, bindings);
console.log(`${BINDINGS}: reconciled ${archetype.archetype_id} at Penpot revision ${REVISION}`);

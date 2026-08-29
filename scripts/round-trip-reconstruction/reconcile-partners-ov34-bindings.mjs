#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const BINDINGS = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const CONTRACT = 'catalog/reconstruction-atlas/v1/partners-ov34-source-exact.v1.json';
const ASTRO_COMMIT = '52e220fc112d020b0a979de4ffa0101a3be6d76b';
const PENPOT_REVISION = 2889;
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880fb747d10c';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const hash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const component = (id, name, path) => ({ id, library_id: FILE_ID, name, path });
const child = (shape_id, componentValue, name, parent_index, x, y, width, height) => ({
  component: componentValue, height, hidden: false, is_component_copy: true, is_component_main: false,
  name, parent_index, shape_id, type: 'board', width, x, y,
});

const specs = {
  desktop: {
    width: 1280, height: 1308,
    boardId: 'd87e18f1-dcb4-80a6-8008-880fb76dafb9',
    boardName: 'Archetype / Information pages / viewport=desktop;route=partners;fixtures=6 · Astro source exact',
    boardComponent: component('d87e18f1-dcb4-80a6-8008-880fbf1c9f86', 'viewport=desktop;route=partners;fixtures=6 · Astro source exact', 'Archetype / Information pages'),
    body: component('8f804431-c282-8075-8008-8df61093a0c5', 'viewport=desktop;route=partners;fixtures=6', 'Information / Partners source exact'),
    bodyShapeId: '8f804431-c282-8075-8008-8df61b8f1d0c',
    children: [
      child('8f804431-c282-8075-8008-8df61b79887f', component('a21f5e36-5d76-8065-8008-86ae4bdf9963', 'Desktop header', 'Shell v1 / Desktop'), 'linked Shell / Desktop header', 0, 0, 0, 1280, 57),
      child('8f804431-c282-8075-8008-8df61b8f1d0c', component('8f804431-c282-8075-8008-8df61093a0c5', 'viewport=desktop;route=partners;fixtures=6', 'Information / Partners source exact'), 'linked Information / Partners source exact / desktop / fixtures=6', 1, 0, 57, 1280, 569),
      child('8f804431-c282-8075-8008-8df61baa8d1a', component('d87e18f1-dcb4-80a6-8008-885914f2be1b', 'Footer viewport · representative', 'Shell v1 / Desktop'), 'linked Shell / Desktop footer viewport', 2, 0, 626, 1280, 681.859375),
    ],
  },
  mobile: {
    width: 390, height: 844,
    boardId: 'd87e18f1-dcb4-80a6-8008-880fb8952b02',
    boardName: 'Archetype / Information pages / viewport=mobile;route=partners;fixtures=6 · Astro source exact',
    boardComponent: component('d87e18f1-dcb4-80a6-8008-880fc166e598', 'viewport=mobile;route=partners;fixtures=6 · Astro source exact', 'Archetype / Information pages'),
    body: component('8f804431-c282-8075-8008-8df617ba7bfc', 'viewport=mobile;route=partners;fixtures=6', 'Information / Partners source exact'),
    bodyShapeId: '8f804431-c282-8075-8008-8df61c196fdc',
    children: [
      child('8f804431-c282-8075-8008-8df61bffccbb', component('a21f5e36-5d76-8065-8008-86aebfc67027', 'Mobile header', 'Shell v1 / Mobile'), 'linked Shell / Mobile header', 0, 1320, 0, 390, 84),
      child('8f804431-c282-8075-8008-8df61c196fdc', component('8f804431-c282-8075-8008-8df617ba7bfc', 'viewport=mobile;route=partners;fixtures=6', 'Information / Partners source exact'), 'linked Information / Partners source exact / mobile / fixtures=6', 1, 1320, 84, 390, 696),
      child('8f804431-c282-8075-8008-8df61c41add2', component('a21f5e36-5d76-8065-8008-86aec0a54bb5', 'surface=floating-island', 'Shell v1 / Mobile / Mobile bottom navigation'), 'linked Shell / Mobile bottom navigation', 2, 1320, 780, 366, 64),
    ],
  },
};

const contract = read(CONTRACT);
contract.authority.current_astro_commit = ASTRO_COMMIT;
contract.authority.source_snapshots = [
  { path: 'site/src/pages/partners/index.astro', sha256: '5e0b1d21c2017ab684732427e0976730ecaba0e763b9b4c9764ada829336f482' },
  { path: 'site/src/data/info-partners.ts', sha256: 'a7e887ea98ed6a08a20dff18885bc502fb492ac642b7c7438d6c71c271623eba' },
];
contract.penpot.revision = PENPOT_REVISION;
contract.penpot.current_structural_readback = {
  desktop: { owner_id: specs.desktop.boardId, body_component_id: specs.desktop.body.id, direct_linked_children: 3 },
  mobile: { owner_id: specs.mobile.boardId, body_component_id: specs.mobile.body.id, direct_linked_children: 3 },
  validation: [],
};
write(CONTRACT, contract);

const bindings = read(BINDINGS);
const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.information-pages');
if (!archetype) throw new Error('bindings have no Information pages archetype');
archetype.source_exact_correction = { contract_id: contract.contract_id, path: CONTRACT, sha256: hash(CONTRACT), status: contract.status };
const entries = [...archetype.boards, ...bindings.cases.filter((item) => item.archetype_id === archetype.archetype_id)];
for (const entry of entries) {
  const spec = specs[entry.viewport];
  entry.width = spec.width;
  entry.height = spec.height;
  entry.astro.commit = ASTRO_COMMIT;
  entry.astro.route = '/partners/';
  entry.astro.capture = { full_page: false, mode: 'viewport' };
  entry.penpot.revision = PENPOT_REVISION;
  entry.penpot.board_id = spec.boardId;
  entry.penpot.board_name = spec.boardName;
  entry.penpot.board_component = spec.boardComponent;
  entry.penpot.direct_children = spec.children;
}

for (const region of archetype.regions) {
  if (region.region_id === 'partners.logo-grid' || region.region_id === 'information.long-form-content') {
    region.penpot_instances = ['desktop', 'mobile'].map((viewport) => ({
      component: specs[viewport].body,
      shape_id: specs[viewport].bodyShapeId,
      viewport,
      role: 'partners-source-exact-six-fixtures',
    }));
    region.active_owner_state = true;
  } else if (region.region_id === 'partnership.conditions') {
    region.penpot_instances = [];
    region.active_owner_state = false;
    region.superseded_for_active_route = true;
  }
}
const dependency = archetype.dependencies.find((item) => item.component_id === 'partners.logo-grid');
if (dependency) dependency.source_exact_resolution = {
  status: 'RESOLVED_TO_SIX_FACTUAL_PARTNERS',
  desktop_body_component_id: specs.desktop.body.id,
  mobile_body_component_id: specs.mobile.body.id,
  page_local_partnership_funnel: false,
  receipt: 'evidence/recovery-20260828/penpot/partners-ov34-source-exact-receipt.v1.json',
};

bindings.correction_overlays ??= [];
const overlay = { archetype_id: archetype.archetype_id, astro_commit: ASTRO_COMMIT, contract: archetype.source_exact_correction, penpot_page_id: PAGE_ID, penpot_revision: PENPOT_REVISION, review_items: ['OV-34'] };
const index = bindings.correction_overlays.findIndex((item) => item.archetype_id === archetype.archetype_id);
if (index >= 0) bindings.correction_overlays[index] = overlay;
else bindings.correction_overlays.push(overlay);

write(BINDINGS, bindings);
console.log(`${BINDINGS}: reconciled Information pages to /partners/ at Penpot revision ${PENPOT_REVISION}`);

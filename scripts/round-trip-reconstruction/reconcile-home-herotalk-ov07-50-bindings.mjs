#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const BINDINGS = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const CONTRACT = 'catalog/reconstruction-atlas/v1/home-herotalk-ov07-50-source-exact.v1.json';
const ASTRO_COMMIT = '52e220fc112d020b0a979de4ffa0101a3be6d76b';
const PENPOT_REVISION = 2889;
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-8806c5b98101';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const component = (id, name, path) => ({ id, library_id: FILE_ID, name, path });
const child = (shape_id, componentValue, name, parent_index, x, y, width, height) => ({
  component: componentValue,
  height,
  hidden: false,
  is_component_copy: true,
  is_component_main: false,
  name,
  parent_index,
  shape_id,
  type: 'board',
  width,
  x,
  y,
});

const specs = {
  desktop: {
    width: 1280,
    height: 1431.71875,
    boardId: 'd87e18f1-dcb4-80a6-8008-8806efd8647f',
    boardName: 'Archetype / Home / viewport=desktop / Astro AS-IS',
    boardComponent: component('d87e18f1-dcb4-80a6-8008-8806f1b38e9d', 'Astro AS-IS', 'Archetype / Home / viewport=desktop'),
    hero: {
      instanceId: 'd87e18f1-dcb4-80a6-8008-88532b1475e4',
      component: component('d87e18f1-dcb4-80a6-8008-88516ef71d68', 'Accepted 2026-07-30 · viewport=desktop · mode=photo-mosaic', 'Home / Hero talk / Donor'),
    },
    children: [
      child('d87e18f1-dcb4-80a6-8008-88afd9457170', component('a21f5e36-5d76-8065-8008-86ae4bdf9963', 'Desktop header', 'Shell v1 / Desktop'), 'linked Shell / Desktop header', 0, 0, 0, 1280, 57),
      child('d87e18f1-dcb4-80a6-8008-88532b1475e4', component('d87e18f1-dcb4-80a6-8008-88516ef71d68', 'Accepted 2026-07-30 · viewport=desktop · mode=photo-mosaic', 'Home / Hero talk / Donor'), 'linked HeroTalk / accepted 2026-07-30 / viewport=desktop', 1, 0, 87.71875, 1280, 360),
      child('d87e18f1-dcb4-80a6-8008-88532b52348c', component('d87e18f1-dcb4-80a6-8008-8852086a9357', 'viewport=desktop', 'Home / Quick navigation'), 'linked Home / Quick navigation', 2, 20, 463.71875, 1240, 92),
      child('d87e18f1-dcb4-80a6-8008-88532bad24cf', component('d87e18f1-dcb4-80a6-8008-8852eb6b3dfd', 'viewport=desktop;state=cold-start', 'Home / Cold-start feed'), 'linked Home / Cold-start feed', 3, 20, 571.71875, 1240, 860),
    ],
  },
  mobile: {
    width: 390,
    height: 1600,
    boardId: 'd87e18f1-dcb4-80a6-8008-8806f1f90263',
    boardName: 'Archetype / Home / viewport=mobile / Astro AS-IS',
    boardComponent: component('d87e18f1-dcb4-80a6-8008-8806f2e29c1b', 'Astro AS-IS', 'Archetype / Home / viewport=mobile'),
    hero: {
      instanceId: 'd87e18f1-dcb4-80a6-8008-88532cc843be',
      component: component('c0b867fa-32d2-8062-8008-8d71ad5ce73b', 'Accepted 2026-07-30 · viewport=mobile · text-only', 'Home / Hero talk / Donor'),
    },
    children: [
      child('d87e18f1-dcb4-80a6-8008-88532c9d3a11', component('a21f5e36-5d76-8065-8008-86aebfc67027', 'Mobile header', 'Shell v1 / Mobile'), 'linked Shell / Mobile header', 0, 1320, 0, 390, 84),
      child('d87e18f1-dcb4-80a6-8008-88532cc843be', component('c0b867fa-32d2-8062-8008-8d71ad5ce73b', 'Accepted 2026-07-30 · viewport=mobile · text-only', 'Home / Hero talk / Donor'), 'linked HeroTalk / accepted 2026-07-30 / viewport=mobile', 1, 1320, 84, 390, 250),
      child('d87e18f1-dcb4-80a6-8008-88532cf6a817', component('d87e18f1-dcb4-80a6-8008-8852086fe3ba', 'viewport=mobile', 'Home / Quick navigation'), 'linked Home / Quick navigation', 2, 1328, 350, 374, 263.6),
      child('d87e18f1-dcb4-80a6-8008-88532d30e0bf', component('d87e18f1-dcb4-80a6-8008-8852eb7a72dd', 'viewport=mobile;state=cold-start', 'Home / Cold-start feed'), 'linked Home / Cold-start feed', 3, 1328, 629.59375, 374, 848),
      child('d87e18f1-dcb4-80a6-8008-88532d918701', component('a21f5e36-5d76-8065-8008-86aec0a54bb5', 'surface=floating-island', 'Shell v1 / Mobile / Mobile bottom navigation'), 'linked Shell / Mobile bottom navigation', 4, 1320, 1536, 366, 64),
    ],
  },
};

const contract = read(CONTRACT);
const bindings = read(BINDINGS);
const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.home');
if (!archetype) throw new Error('bindings have no Home archetype');
archetype.source_exact_correction = {
  contract_id: contract.contract_id,
  path: CONTRACT,
  sha256: sha256(CONTRACT),
  status: contract.status,
};

const entries = [...archetype.boards, ...bindings.cases.filter((item) => item.archetype_id === archetype.archetype_id)];
for (const entry of entries) {
  const spec = specs[entry.viewport];
  entry.width = spec.width;
  entry.height = spec.height;
  entry.astro.commit = ASTRO_COMMIT;
  entry.astro.route = '/';
  entry.astro.capture = { full_page: false, mode: 'viewport' };
  entry.penpot.revision = PENPOT_REVISION;
  entry.penpot.board_id = spec.boardId;
  entry.penpot.board_name = spec.boardName;
  entry.penpot.board_component = spec.boardComponent;
  entry.penpot.direct_children = spec.children;
}

const heroRegion = archetype.regions.find((item) => item.region_id === 'home.hero-talk');
if (!heroRegion) throw new Error('Home has no hero-talk region');
heroRegion.penpot_instances = ['desktop', 'mobile'].map((viewport) => ({
  component: specs[viewport].hero.component,
  shape_id: specs[viewport].hero.instanceId,
  viewport,
  accepted_donor: true,
}));

const heroDependency = archetype.dependencies.find((item) => item.component_id === 'home.hero-talk');
if (!heroDependency) throw new Error('Home has no hero-talk dependency');
heroDependency.source_exact_resolution = {
  status: 'RESOLVED_ACCEPTED_2026_07_30_DONOR',
  desktop_component_id: specs.desktop.hero.component.id,
  mobile_component_id: specs.mobile.hero.component.id,
  astro_component: 'site/src/components/HomeHeroTalk.astro',
  editorial_chains_contract: 'catalog/ui-components/hero-talk/accepted-donor-and-chains.v1.json',
  communication_chain_count: 7,
  receipt: 'evidence/recovery-20260828/penpot/home-herotalk-accepted-receipt.v1.json',
};

bindings.correction_overlays ??= [];
const overlay = {
  archetype_id: archetype.archetype_id,
  astro_commit: ASTRO_COMMIT,
  contract: archetype.source_exact_correction,
  penpot_page_id: PAGE_ID,
  penpot_revision: PENPOT_REVISION,
  review_items: ['OV-07', 'OV-50'],
};
const index = bindings.correction_overlays.findIndex((item) => item.archetype_id === archetype.archetype_id);
if (index >= 0) bindings.correction_overlays[index] = overlay;
else bindings.correction_overlays.push(overlay);

write(BINDINGS, bindings);
console.log(`${BINDINGS}: reconciled Home to accepted HeroTalk donor at Penpot revision ${PENPOT_REVISION}`);

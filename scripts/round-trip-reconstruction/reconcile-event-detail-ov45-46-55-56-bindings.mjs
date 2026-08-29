#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const BINDINGS = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const CONTRACT_45 = 'catalog/reconstruction-atlas/v1/event-detail-ov45-owner-exact.v1.json';
const CONTRACT_46 = 'catalog/reconstruction-atlas/v1/event-detail-ov46-mobile-owner-exact.v1.json';
const CONTRACT_55_56 = 'catalog/reconstruction-atlas/v1/event-detail-ov55-56-source-states.v1.json';
const RECEIPT_45 = 'evidence/recovery-20260828/penpot/event-detail-ov45-owner-exact-receipt.v1.json';
const RECEIPT_46 = 'evidence/recovery-20260828/penpot/event-detail-ov46-mobile-owner-exact-receipt.v1.json';
const ASTRO_COMMIT = '812ffc279728221b547707474bcb521f27c4a73d';
const REVISION = 2800;
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880bfdfbf2ec';
const ROUTE = '/sobytiya/predmetnye-strasti-natyurmort-xx-veka-kaliningrad-5459/';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const comp = (id, name, path) => ({ id, library_id: FILE_ID, name, path });
const child = ({ component, height, hidden = false, id, name, parent_index, width, x, y }) => ({ component, height, hidden, is_component_copy: true, is_component_main: false, name, parent_index, shape_id: id, type: 'board', width, x, y });

const specs = {
  desktop: {
    board: { id: 'd87e18f1-dcb4-80a6-8008-880bfe361a1d', componentId: 'd87e18f1-dcb4-80a6-8008-880c14e5cb62', name: 'viewport=desktop;fixture=event.real.5459 · Astro AS-IS', width: 1280, height: 3126.09375 },
    children: [
      child({ component: comp('d87e18f1-dcb4-80a6-8008-885fec553e0f', 'viewport=desktop;media=photo-dominant;fixture=event.real.5459', 'Event detail / Hero media'), height: 843, id: 'd87e18f1-dcb4-80a6-8008-88613c56919c', name: 'linked Event detail / Hero media / desktop photo-dominant', parent_index: 0, width: 1280, x: 0, y: 57 }),
      child({ component: comp('d87e18f1-dcb4-80a6-8008-88603a654453', 'viewport=desktop;fixture=event.real.5459', 'Event detail / Summary'), height: 449.46875, id: 'd87e18f1-dcb4-80a6-8008-88613c73f042', name: 'linked Event detail / Summary / desktop event.real.5459', parent_index: 1, width: 783.1875, x: 38.390625, y: 660 }),
      child({ component: comp('d87e18f1-dcb4-80a6-8008-88603c044ff2', 'viewport=desktop;fixture=event.real.5459', 'Event detail / Action panel'), height: 228.28125, id: 'd87e18f1-dcb4-80a6-8008-88613ca5b1e6', name: 'linked Event detail / Action panel / desktop', parent_index: 2, width: 404, x: 860, y: 503 }),
      child({ component: comp('d87e18f1-dcb4-80a6-8008-88603d456ce8', 'viewport=desktop;composition=poster+photos;fixture=event.real.5459', 'Event detail / Media gallery'), height: 387.65625, id: 'd87e18f1-dcb4-80a6-8008-88613cf50fc1', name: 'linked Event detail / Media gallery / desktop poster+photos', parent_index: 3, width: 404, x: 860, y: 756.078125 }),
      child({ component: comp('d87e18f1-dcb4-80a6-8008-8860d4142b39', 'viewport=desktop;fixture=event.real.5459', 'Event detail / Description'), height: 1162, id: 'd87e18f1-dcb4-80a6-8008-88613d21215c', name: 'linked Event detail / Description / desktop', parent_index: 4, width: 784, x: 38.390625, y: 1119.71875 }),
      child({ component: comp('a21f5e36-5d76-8065-8008-86ae4bdf9963', 'Desktop header', 'Shell v1 / Desktop'), height: 57, id: 'd87e18f1-dcb4-80a6-8008-886140274c9c', name: 'linked Shell / Desktop header', parent_index: 5, width: 1280, x: 0, y: 0 }),
      child({ component: comp('8e7accff-5c78-8007-8008-895ea18d6435', 'viewport=desktop;fixture=event.real.5459', 'Event detail / Practical'), height: 525.234375, id: '8e7accff-5c78-8007-8008-895f0a7010eb', name: 'linked Event detail / Practical / desktop event.real.5459', parent_index: 6, width: 706.40625, x: 76.78125, y: 2370.484375 }),
    ],
  },
  mobile: {
    board: { id: 'd87e18f1-dcb4-80a6-8008-880c01b4fbef', componentId: 'd87e18f1-dcb4-80a6-8008-880c21e6cc76', name: 'viewport=mobile;fixture=event.real.5459 · Astro AS-IS', width: 390, height: 3001.609375 },
    children: [
      child({ component: comp('d87e18f1-dcb4-80a6-8008-885fed185a8c', 'viewport=mobile;media=poster-document;fixture=event.real.5459', 'Event detail / Hero media'), height: 551.484375, id: 'd87e18f1-dcb4-80a6-8008-886140654563', name: 'linked Event detail / Hero media / mobile poster-document', parent_index: 0, width: 390, x: 1320, y: 0 }),
      child({ component: comp('d87e18f1-dcb4-80a6-8008-88604132a614', 'viewport=mobile;fixture=event.real.5459', 'Event detail / Summary'), height: 422.59375, id: 'd87e18f1-dcb4-80a6-8008-88614092e513', name: 'linked Event detail / Summary / mobile event.real.5459', parent_index: 1, width: 366, x: 1332, y: 529.890625 }),
      child({ component: comp('d87e18f1-dcb4-80a6-8008-8860d7831c15', 'viewport=mobile;fixture=event.real.5459', 'Event detail / Identity and description'), height: 1940.21875, id: 'd87e18f1-dcb4-80a6-8008-886141078dff', name: 'linked Event detail / Identity and description / mobile', parent_index: 2, width: 366, x: 1332, y: 973.390625 }),
      child({ component: comp('a21f5e36-5d76-8065-8008-86aec0a54bb5', 'Mobile bottom navigation', 'Shell v1 / Mobile'), height: 64, hidden: true, id: 'd87e18f1-dcb4-80a6-8008-886141db9647', name: 'linked Shell / Mobile bottom navigation', parent_index: 3, width: 366, x: 1320, y: 2937.609375 }),
      child({ component: comp('8e7accff-5c78-8007-8008-895b5a328f65', 'Mobile header · transparent hero overlay', 'Shell v1 / Mobile'), height: 84, id: '8e7accff-5c78-8007-8008-895b77e96935', name: 'linked Shell / Mobile header / transparent hero overlay', parent_index: 4, width: 390, x: 1320, y: 0 }),
    ],
  },
};

const sourceStates = {
  topMedallion: { shape_id: '8f804431-c282-8075-8008-8ddbc9b60471', component: comp('8f804431-c282-8075-8008-8ddbd1b013c6', 'fixture=event.real.5757;state=top-medallion;viewport=desktop', 'Event detail / Source state') },
  occurrenceSummary: { shape_id: '8f804431-c282-8075-8008-8ddbd8a72bf7', component: comp('8f804431-c282-8075-8008-8ddbdcd954dc', 'fixture=event.real.5511;variant=desktop-summary;state=multiple', 'Event detail / Occurrence') },
  occurrencePractical: { shape_id: '8f804431-c282-8075-8008-8ddbdfe18c88', component: comp('8f804431-c282-8075-8008-8ddbe8be798c', 'fixture=event.real.5511;variant=practical;state=multiple', 'Event detail / Occurrence') },
  portraitHero: { shape_id: '8f804431-c282-8075-8008-8de9abb9b6df', component: comp('8f804431-c282-8075-8008-8de9b5ffa1a3', 'fixture=event.real.4783;state=portrait-hero-image;viewport=desktop', 'Event detail / Source state') },
  portraitViewer: { shape_id: '8f804431-c282-8075-8008-8de9c51369b4', component: comp('8f804431-c282-8075-8008-8de9c8e875f4', 'fixture=event.real.4783;state=viewer;viewport=desktop', 'Event detail / Source state') },
  transport: { shape_id: '8f804431-c282-8075-8008-8de9d4fe4c9b', component: comp('8f804431-c282-8075-8008-8de9df4aff87', 'fixture=event.real.4671;state=transport;viewport=desktop', 'Event detail / Source state') },
  continuation: { shape_id: '8f804431-c282-8075-8008-8de9ec4fef26', component: comp('8f804431-c282-8075-8008-8de9efe6492e', 'fixture=event.real.4671;state=transport-related-footer;viewport=desktop', 'Event detail / Source state') },
};

for (const path of [CONTRACT_45, CONTRACT_46, CONTRACT_55_56]) {
  const contract = read(path);
  contract.authority.current_astro_commit = ASTRO_COMMIT;
  contract.penpot.round_trip_revision = REVISION;
  write(path, contract);
}
for (const path of [RECEIPT_45, RECEIPT_46]) {
  const receipt = read(path);
  receipt.round_trip = { astro_commit: ASTRO_COMMIT, penpot_revision: REVISION, validation: [], desktop_owner_size: [1280, 3126.09375], mobile_owner_size: [390, 3001.609375] };
  write(path, receipt);
}

const corrections = [CONTRACT_45, CONTRACT_46, CONTRACT_55_56].map((path) => {
  const contract = read(path);
  return { contract_id: contract.contract_id, path, sha256: sha256(path), status: contract.status };
});
const bindings = read(BINDINGS);
const archetype = bindings.archetypes.find((item) => item.archetype_id === 'archetype.event-detail');
if (!archetype) throw new Error('bindings have no Event detail archetype');
archetype.source_exact_correction = corrections[0];
archetype.source_exact_corrections = corrections;
archetype.fixture_slots = [
  { content_type: 'generated-route', fixture_refs: [ROUTE, '/sobytiya/sobache-serdtse-kaliningrad-5757/', '/sobytiya/rok-opera-orfey-i-evridika-kaliningrad-5511/'], multiplicity: 'many', required: true, slot_id: 'source-exact-owner-routes' },
  { content_type: 'event', fixture_refs: ['event.real.5459', 'event.real.5757', 'event.real.5511', 'event.real.4783', 'event.real.4671'], multiplicity: 'many', required: true, slot_id: 'source-exact-events' },
  { content_type: 'semantic-state', fixture_refs: ['desktop-overlap-240', 'mobile-first-screen-overlap', 'top-medallion', 'occurrence-family', 'portrait-hero-image', 'viewer', 'transport', 'related-before-footer'], multiplicity: 'many', required: true, slot_id: 'source-exact-states' },
];

const entries = [...archetype.boards, ...bindings.cases.filter((item) => item.archetype_id === archetype.archetype_id)];
for (const entry of entries) {
  const spec = specs[entry.viewport];
  entry.width = spec.board.width;
  entry.height = spec.board.height;
  entry.astro = { commit: ASTRO_COMMIT, route: ROUTE, capture: { full_page: true, mode: 'full-page' } };
  entry.penpot.revision = REVISION;
  entry.penpot.board_id = spec.board.id;
  entry.penpot.board_name = `Archetype / Event detail / ${spec.board.name}`;
  entry.penpot.board_component = comp(spec.board.componentId, spec.board.name, 'Archetype / Event detail');
  entry.penpot.direct_children = spec.children;
}

const instance = (viewport, index, role) => ({ viewport, shape_id: specs[viewport].children[index].shape_id, component: specs[viewport].children[index].component, role });
for (const region of archetype.regions) {
  if (region.region_id === 'event.hero') region.penpot_instances = [instance('desktop', 0, 'hero'), instance('mobile', 0, 'hero'), instance('mobile', 4, 'transparent-header')];
  else if (region.region_id === 'event.media-frame') region.penpot_instances = [instance('desktop', 0, 'owner-media'), instance('desktop', 3, 'gallery'), instance('mobile', 0, 'owner-media'), { ...sourceStates.portraitHero, role: 'portrait-hero' }, { ...sourceStates.portraitViewer, role: 'viewer' }];
  else if (region.region_id === 'event.summary') region.penpot_instances = [instance('desktop', 1, 'summary'), instance('mobile', 1, 'summary'), { ...sourceStates.occurrenceSummary, role: 'occurrence-family' }];
  else if (region.region_id === 'event.admission-actions' || region.region_id === 'event.question-cta') region.penpot_instances = [instance('desktop', 2, 'actions'), instance('mobile', 1, 'actions-with-summary')];
  else if (region.region_id === 'event.facts') region.penpot_instances = [instance('desktop', 4, 'description-facts'), instance('desktop', 6, 'practical-facts'), instance('mobile', 2, 'identity-description-facts'), { ...sourceStates.occurrencePractical, role: 'occurrence-practical' }];
  else if (region.region_id === 'event.participants' || region.region_id === 'event.venue') region.penpot_instances = [instance('desktop', 4, region.region_id), instance('mobile', 2, region.region_id)];
  else if (region.region_id === 'event.medallions') region.penpot_instances = [{ ...sourceStates.topMedallion, role: 'top-medallion' }, instance('mobile', 2, 'identity-medallions')];
  else if (region.region_id === 'event.transport') region.penpot_instances = [{ ...sourceStates.transport, role: 'transport' }];
  else if (region.region_id === 'event.related-events') region.penpot_instances = [{ ...sourceStates.continuation, role: 'transport-related-footer-order' }];
}

bindings.correction_overlays ??= [];
const overlay = { archetype_id: archetype.archetype_id, astro_commit: ASTRO_COMMIT, contracts: corrections, penpot_page_id: PAGE_ID, penpot_revision: REVISION, review_items: ['OV-45', 'OV-46', 'OV-55', 'OV-56'] };
const index = bindings.correction_overlays.findIndex((item) => item.archetype_id === archetype.archetype_id);
if (index >= 0) bindings.correction_overlays[index] = overlay;
else bindings.correction_overlays.push(overlay);
write(BINDINGS, bindings);
console.log(`${BINDINGS}: reconciled ${archetype.archetype_id} at Penpot revision ${REVISION}`);

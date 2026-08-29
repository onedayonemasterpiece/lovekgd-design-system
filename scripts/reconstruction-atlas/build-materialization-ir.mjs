import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');
const atlasRoot = path.join(repoRoot, 'catalog/reconstruction-atlas/v1');
const read = (name) => JSON.parse(fs.readFileSync(path.join(atlasRoot, name), 'utf8'));
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

const semantic = read('semantic-atlas.v1.json');
const reuseMap = read('reuse-new-map.v1.json');
const fixtures = read('fixtures.v1.json');
const globalSotPath = path.join(repoRoot, 'catalog/global-archetype-sot-v1/manifest.v1.json');

const titles = {
  'archetype.home': 'Home',
  'archetype.listing.date': 'Date listing',
  'archetype.listing.weekend': 'Weekend listing',
  'archetype.listing.popular': 'Popular listing',
  'archetype.listing.unusual': 'Unusual listing',
  'archetype.search': 'Search',
  'archetype.event-detail': 'Event detail',
  'archetype.collections': 'Collections',
  'archetype.festivals': 'Festivals',
  'archetype.exhibitions': 'Exhibitions',
  'archetype.interest-clubs': 'Interest clubs',
  'archetype.favorites': 'Favorites',
  'archetype.personal-feed': 'Personal feed',
  'archetype.focus-group': 'Focus group',
  'archetype.artifacts': 'Artifacts',
  'archetype.information-pages': 'Information pages',
  'archetype.special-state': 'Special states',
};

// These are current native library resources whose main instances were read back
// from the target Penpot file at checkpoint revision 2160. They are never cloned
// or detached by the atlas materializer.
const nativeBindings = {
  'shell.desktop-header': {
    component_id: 'a21f5e36-5d76-8065-8008-86ae4bdf9963',
    main_shape_id: 'a21f5e36-5d76-8065-8008-86ae49126e70',
    main_name: 'Shell v1 / Desktop / Desktop header',
  },
  'shell.mobile-header': {
    component_id: 'a21f5e36-5d76-8065-8008-86aebfc67027',
    main_shape_id: 'a21f5e36-5d76-8065-8008-86aebe51faca',
    main_name: 'Shell v1 / Mobile / Mobile header',
  },
  'shell.mobile-bottom-navigation': {
    component_id: 'a21f5e36-5d76-8065-8008-86aec0a54bb5',
    main_shape_id: 'a21f5e36-5d76-8065-8008-86aebffe176b',
    main_name: 'Shell v1 / Mobile / Mobile bottom navigation',
  },
  'shell.footer': {
    component_id: 'a21f5e36-5d76-8065-8008-86af602ad62a',
    main_shape_id: 'a21f5e36-5d76-8065-8008-86af5be2357d',
    main_name: 'Shell v1 / Desktop / Footer',
  },
  'event.card.large.desktop': {
    component_id: 'cab027cf-d52b-8091-8008-85f7db75ebe3',
    main_shape_id: 'cab027cf-d52b-8091-8008-85f7a4a774c3',
    main_name: 'Event cards / Large / EventCard · Large · Desktop · calendar absent',
  },
  'event.card.large.mobile': {
    component_id: '7f078c80-87b8-80f5-8008-85839e8975f6',
    main_shape_id: '7f078c80-87b8-80f5-8008-85815043e9ce',
    main_name: 'Event cards / Large / EventCard · Large · Mobile flow',
  },
  'listing.event-card.compact': {
    component_id: 'd87e18f1-dcb4-80a6-8008-877370383914',
    main_shape_id: 'd87e18f1-dcb4-80a6-8008-87736fa07d4e',
    main_name: 'Event cards / Compact variants / ListingEventCard · Compact · event.real.7888 · context=date-typical-desktop',
  },
  'festival.card': {
    component_id: '579a886e-56e8-80a3-8008-818784d1ffa9',
    main_shape_id: '579a886e-56e8-80a3-8008-818783ed949f',
    main_name: 'Event cards / Festival / FestivalCard',
  },
  'exhibition.row': {
    component_id: '45777396-2f2a-80c0-8008-818f9adc878e',
    main_shape_id: '45777396-2f2a-80c0-8008-818f98a70101',
    main_name: 'Event rows / Exhibition / ExhibitionRow',
  },
  'social-proof.like': {
    component_id: 'a21f5e36-5d76-8065-8008-86cd5c19e772',
    main_shape_id: 'a21f5e36-5d76-8065-8008-86cd5b96589f',
    main_name: 'Event cards / Shared / Social proof / Like proof · compact36',
  },
  'core.breadcrumbs': {
    component_id: 'e80bde32-fa47-80c8-8008-77a2c28fc952',
    main_shape_id: 'e80bde32-fa47-80c8-8008-77a2bda1f8a2',
    main_name: 'core.breadcrumbs / core.breadcrumbs',
  },
  'core.field': {
    component_id: 'e80bde32-fa47-80c8-8008-77a83ffff672',
    main_shape_id: 'e80bde32-fa47-80c8-8008-77a83f730616',
    main_name: 'core.field / core.field / default',
  },
  'core.button': {
    component_id: 'e80bde32-fa47-80c8-8008-77a531a67180',
    main_shape_id: 'e80bde32-fa47-80c8-8008-77a52ca736f1',
    main_name: 'core.button / core.button / default',
  },
  'core.dialog': {
    component_id: 'e80bde32-fa47-80c8-8008-77a80efcca11',
    main_shape_id: 'e80bde32-fa47-80c8-8008-77a80e6e1354',
    main_name: 'core.dialog / core.dialog / default',
  },
  'artifact.collection-card': {
    component_id: '45777396-2f2a-80c0-8008-819282196a54',
    main_shape_id: '45777396-2f2a-80c0-8008-81928168e7cd',
    main_name: 'FocusArtifact',
  },
};

const primarySample = {
  'archetype.home': ['event.card.large.desktop', 'event.card.large.mobile'],
  'archetype.listing.date': ['listing.event-card.compact'],
  'archetype.listing.weekend': ['listing.event-card.compact'],
  'archetype.listing.popular': ['listing.event-card.compact'],
  'archetype.listing.unusual': ['listing.event-card.compact'],
  'archetype.search': ['core.field', 'listing.event-card.compact'],
  'archetype.event-detail': ['event.card.large.desktop', 'event.card.large.mobile', 'social-proof.like'],
  'archetype.collections': ['core.breadcrumbs', 'event.card.large.desktop'],
  'archetype.festivals': ['festival.card', 'social-proof.like'],
  'archetype.exhibitions': ['exhibition.row', 'social-proof.like'],
  'archetype.interest-clubs': ['core.breadcrumbs', 'core.dialog'],
  'archetype.favorites': ['event.card.large.desktop', 'core.dialog'],
  'archetype.personal-feed': ['event.card.large.desktop', 'core.button'],
  'archetype.focus-group': ['core.field', 'core.button', 'core.dialog'],
  'archetype.artifacts': ['artifact.collection-card', 'core.dialog'],
  'archetype.information-pages': ['core.breadcrumbs'],
  'archetype.special-state': ['core.dialog', 'core.button'],
};

const reuseNodes = new Map(reuseMap.nodes.map((node) => [node.id, node]));
const routeFixtures = new Map(fixtures.route_fixtures.map((row) => [row.archetype_id, row.routes]));

const pages = semantic.archetypes.map((archetype, index) => {
  const id = archetype.id;
  const n = String(index + 1).padStart(2, '0');
  const reused = archetype.reuse ?? [];
  const deltas = reuseMap.nodes
    .filter((node) => node.consumers.includes(id) && node.disposition === 'NEW_OR_ARCHETYPE_DELTA')
    .map((node) => node.id);
  return {
    archetype_id: id,
    title: titles[id],
    page_name: `63.${n} — Atlas · ${titles[id]}`,
    stable_page_id: `reconstruction-atlas.v1/page/${id}`,
    representative_routes: routeFixtures.get(id) ?? archetype.representative_routes,
    anatomy: archetype.anatomy,
    states: archetype.states,
    responsive_branches: archetype.responsive_branches,
    reuse_resources: reused.map((resourceId) => ({
      resource_id: resourceId,
      disposition: reuseNodes.get(resourceId)?.disposition ?? 'REUSE_FROZEN_OR_RECONCILE',
      native_binding: nativeBindings[resourceId] ?? null,
    })),
    new_or_delta_resources: deltas,
    sample_native_resources: (primarySample[id] ?? []).map((resourceId) => ({
      resource_id: resourceId,
      ...nativeBindings[resourceId],
    })),
    projections: [
      {
        projection_id: `${id}/desktop/representative`,
        viewport: 'desktop-1280x720',
        master_name: `Atlas / ${titles[id]} / viewport=desktop;state=representative`,
        stable_id: `reconstruction-atlas.v1/master/${id}/desktop/representative`,
        width: 1280,
        height: 720,
      },
      {
        projection_id: `${id}/mobile/representative`,
        viewport: 'mobile-390x720',
        master_name: `Atlas / ${titles[id]} / viewport=mobile;state=representative`,
        stable_id: `reconstruction-atlas.v1/master/${id}/mobile/representative`,
        width: 390,
        height: 720,
      },
      {
        projection_id: `${id}/states/unique`,
        viewport: 'state-index-640x180',
        master_name: `Atlas / ${titles[id]} / states=source-index`,
        stable_id: `reconstruction-atlas.v1/master/${id}/states/source-index`,
        width: 640,
        height: 180,
      },
    ],
    constraints: {
      masters_on_final_owner_page: true,
      nested_reuse: 'LINKED_INSTANCE_ONLY',
      detached_forbidden: true,
      screenshot_master_forbidden: true,
      registered_overrides: [],
      dense_stress: 'ASTRO_ONLY',
      max_top_level_shapes: 3,
      max_page_content_width: 1734,
      max_page_content_height: 980,
    },
  };
});

const ir = {
  schema_version: 'reconstruction-atlas-materialization-ir.v1',
  generated_at: new Date().toISOString(),
  semantic_atlas_sha256: sha256(fs.readFileSync(path.join(atlasRoot, 'semantic-atlas.v1.json'))),
  global_archetype_sot_v1: fs.existsSync(globalSotPath) ? {
    path: 'catalog/global-archetype-sot-v1/manifest.v1.json',
    sha256: sha256(fs.readFileSync(globalSotPath)),
  } : null,
  file_id: '3be9e5e1-190f-8090-8008-713c0fbe6260',
  checkpoint_revision: 2160,
  governance: {
    lifecycle: 'candidate_noncanonical',
    redesign: false,
    promotion: false,
    production_mutation: false,
    merge: false,
    deploy: false,
    central_fix_policy: reuseMap.central_fix_policy,
  },
  topology: {
    review_page_name: '63.00 — Atlas · Review route',
    review_page_stable_id: 'reconstruction-atlas.v1/page/review-route',
    owner_page_count: pages.length,
    owner_page_prefix: '63.',
    bounded_owner_pages: true,
    review_grid_columns: 2,
    review_grid_uses: 'linked state-index instances only',
  },
  native_bindings: nativeBindings,
  pages,
  acceptance: {
    archetype_coverage_percent: 100,
    required_projections_per_archetype: ['desktop', 'mobile', 'unique-state-index'],
    detached_count: 0,
    unregistered_override_count: 0,
    validate: [],
    review_route_count: 1,
    gap_ledger_path: 'catalog/reconstruction-atlas/v1/gap-ledger.v1.json',
  },
};

const output = path.join(atlasRoot, 'penpot/materialization-ir.v1.json');
fs.writeFileSync(output, `${JSON.stringify(ir, null, 2)}\n`);
console.log(JSON.stringify({ output, owner_page_count: pages.length, projection_count: pages.length * 3 }, null, 2));

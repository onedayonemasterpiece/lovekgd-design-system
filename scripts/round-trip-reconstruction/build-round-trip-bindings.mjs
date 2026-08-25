#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';

const ROOT = process.cwd();
const AUTHORITY = 'catalog/global-archetype-sot-v1';
const OUT = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const EXPECTED_MANIFEST_SHA = 'ac2cb64bbccb113dd7c81cdb8caec953d3d5e2f56ea10a1f54914d7a0ed46819';
const EXPECTED_ASTRO_SHA = '7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00';
const PENPOT_FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PENPOT_TEAM_ID = '81f57451-85cc-819d-8008-70ebaeab3fd6';

const json = path => JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
const bytes = path => readFileSync(join(ROOT, path));
const sha256 = value => createHash('sha256').update(value).digest('hex');
const stable = value => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])]));
  }
  return value;
};
const render = value => `${JSON.stringify(stable(value), null, 2)}\n`;

const manifestSha = sha256(bytes(`${AUTHORITY}/manifest.v1.json`));
if (manifestSha !== EXPECTED_MANIFEST_SHA) {
  throw new Error(`authority manifest drift: ${manifestSha}`);
}

const sourceLock = json(`${AUTHORITY}/source-lock.v1.json`);
if (sourceLock.astro_commit !== EXPECTED_ASTRO_SHA) {
  throw new Error(`Astro authority drift: ${sourceLock.astro_commit}`);
}
const graph = json(`${AUTHORITY}/component-composition-graph.v1.json`);
const plan = json(`${AUTHORITY}/penpot-materialization-plan.v1.json`);
const penpot = json('catalog/round-trip-reconstruction/v1/penpot-live-snapshot.v1.json');
if (penpot.file_id !== PENPOT_FILE_ID || penpot.validation.length !== 0) {
  throw new Error('Penpot snapshot is not the pinned valid file');
}

const graphById = new Map(graph.nodes.map(node => [node.node_id, node]));
const planByArchetype = new Map(plan.owner_pages.map(page => [page.archetype_id, page]));
const components = penpot.library_components;
const normalized = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9а-яё]+/giu, ' ').trim();
const componentTokens = id => normalized(id).split(' ').filter(token => token.length > 2);
const scoreComponent = (dependencyId, component) => {
  const haystack = normalized(`${component.path} ${component.name}`);
  return componentTokens(dependencyId).reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
};
const penpotCandidates = dependencyId => components
  .map(component => ({ component, score: scoreComponent(dependencyId, component) }))
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score || a.component.id.localeCompare(b.component.id))
  .slice(0, 5)
  .map(({ component, score }) => ({ score, ...component }));

const pageArchetypes = [
  'archetype.home', 'archetype.listing.date', 'archetype.listing.weekend',
  'archetype.listing.popular', 'archetype.listing.unusual', 'archetype.search',
  'archetype.event-detail', 'archetype.collections', 'archetype.festivals',
  'archetype.exhibitions', 'archetype.interest-clubs', 'archetype.favorites',
  'archetype.personal-feed', 'archetype.focus-group', 'archetype.artifacts',
  'archetype.information-pages', 'archetype.special-state'
];
if (penpot.pages.length !== pageArchetypes.length) throw new Error('expected 17 Penpot pages');

const routeOverrides = {
  'archetype.listing.date': {
    desktop: '/lab/date-listing-shell-v1/full-page-desktop-shell/',
    mobile: '/lab/date-listing-shell-v1/full-page-mobile-shell/'
  },
  'archetype.listing.weekend': {
    desktop: '/lab/weekend-listing-v1/typical-desktop/',
    mobile: '/lab/weekend-listing-v1/typical-mobile/'
  },
  'archetype.event-detail': {
    desktop: '/sobytiya/predmetnye-strasti-natyurmort-xx-veka-kaliningrad-5459/',
    mobile: '/sobytiya/predmetnye-strasti-natyurmort-xx-veka-kaliningrad-5459/'
  },
  // The existing stable 63.16 boards materialize the partnership-content
  // state. Comparing them to `/partners/` joined two different route fixtures
  // (logo index vs partnership CTA) and made the raster evidence meaningless.
  'archetype.information-pages': {
    desktop: '/partnerstvo/',
    mobile: '/partnerstvo/'
  }
};
const captureOverrides = {
  'archetype.listing.weekend': {
    desktop: {
      mode: 'element_on_canvas',
      selector: '[data-weekend-listing-candidate-root]',
      offset: { x: 0, y: 32 },
      canvas: { width: 1280, height: 1157, background: '#fffaf2' }
    },
    mobile: {
      mode: 'element',
      selector: '[data-weekend-listing-candidate-root]'
    }
  }
};

const contracts = [...new URL(`file://${join(ROOT, AUTHORITY, 'archetype-contracts')}/`).pathname]
  ? [] : []; // keeps path construction explicit for static analyzers
const contractPaths = pageArchetypes.map(archetypeId => {
  const entries = Object.keys(planByArchetype.get(archetypeId) ?? {});
  void entries;
  const slug = ({
    'archetype.listing.date': 'listing-date',
    'archetype.listing.weekend': 'listing-weekend',
    'archetype.listing.popular': 'listing-popular',
    'archetype.listing.unusual': 'listing-unusual',
    'archetype.event-detail': 'event-detail',
    'archetype.interest-clubs': 'interest-clubs',
    'archetype.personal-feed': 'personal-feed',
    'archetype.focus-group': 'focus-group',
    'archetype.information-pages': 'information-pages',
    'archetype.special-state': 'special-state'
  })[archetypeId] ?? archetypeId.replace('archetype.', '');
  return `${AUTHORITY}/archetype-contracts/${slug}.semantic-contract.v1.json`;
});

const directLink = (pageId, boardId) => `https://design.penpot.app/#/workspace?team-id=${PENPOT_TEAM_ID}&file-id=${PENPOT_FILE_ID}&page-id=${pageId}&board-id=${boardId}`;
const cases = [];
const archetypes = pageArchetypes.map((archetypeId, index) => {
  const contractPath = contractPaths[index];
  const contract = json(contractPath);
  if (contract.archetype_id !== archetypeId) throw new Error(`contract order mismatch: ${contractPath}`);
  const ownerPlan = planByArchetype.get(archetypeId);
  const page = penpot.pages[index];
  const dependencies = contract.component_dependencies.map(dep => {
    const nodeId = dep.dependency_type === 'runtime_boundary' ? `runtime.${dep.component_id.replace(/^[^.]+\./, '')}` : `component.${dep.component_id}`;
    const node = graphById.get(nodeId) ?? graphById.get(dep.component_id);
    return {
      component_id: dep.component_id,
      dependency_type: dep.dependency_type,
      required: dep.required,
      graph_node_id: node?.node_id ?? null,
      graph_join: node ? 'resolved' : dep.dependency_type === 'runtime_boundary' ? 'runtime_boundary' : 'explicit_gap',
      penpot_candidates: dep.dependency_type === 'component' ? penpotCandidates(dep.component_id) : []
    };
  });
  const evidenceByState = new Map((contract.evidence_bound_states ?? []).map(state => [state.state_id, state]));
  const stateDefinitions = [...contract.states];
  for (const evidence of contract.evidence_bound_states ?? []) {
    if (!stateDefinitions.some(state => state.state_id === evidence.state_id)) {
      stateDefinitions.push({ category: 'source_evidence', required: evidence.materialization_eligible === true, state_id: evidence.state_id });
    }
  }
  const states = stateDefinitions.map(state => {
    const evidence = evidenceByState.get(state.state_id);
    return {
      ...state,
      evidence_disposition: evidence?.disposition ?? 'contract_source_proven',
      materialization_eligible: evidence?.materialization_eligible ?? true,
      source_refs: evidence?.source_refs ?? [],
      browser_observation_refs: evidence?.browser_observation_refs ?? [],
      explicit_gap: evidence?.disposition === 'unresolved' ? evidence.unresolved_reason : null
    };
  });
  const boards = page.boards.map(board => {
    const viewport = board.width <= 480 ? 'mobile' : 'desktop';
    const route = routeOverrides[archetypeId]?.[viewport] ?? contract.route_contract.representative_generated_routes[0];
    const caseId = `${archetypeId}.${viewport}.current-v1`;
    const entry = {
      case_id: caseId,
      archetype_id: archetypeId,
      viewport,
      width: board.width,
      height: board.height,
      astro: {
        commit: EXPECTED_ASTRO_SHA,
        route,
        capture: captureOverrides[archetypeId]?.[viewport] ?? { mode: 'viewport', full_page: false }
      },
      penpot: {
        file_id: PENPOT_FILE_ID,
        revision: penpot.revision,
        page_id: page.page_id,
        board_id: board.shape_id,
        board_name: board.name,
        board_component: board.component,
        direct_url: directLink(page.page_id, board.shape_id),
        direct_children: board.direct_children
      }
    };
    cases.push(entry);
    return entry;
  });
  return {
    archetype_id: archetypeId,
    title: contract.title,
    contract: { path: contractPath, sha256: sha256(bytes(contractPath)), contract_id: contract.contract_id },
    source: contract.route_contract,
    fixture_slots: contract.fixture_slots,
    regions: contract.regions.map(region => ({
      ...region,
      plan_bound: Object.values(ownerPlan.compositions).some(branch => branch.region_ids.includes(region.region_id)),
      penpot_instances: boards.flatMap(board => board.penpot.direct_children.filter(child => normalized(child.name).includes(normalized(region.region_id).split(' ').at(-1))))
        .map(child => ({ shape_id: child.shape_id, component: child.component }))
    })),
    states,
    dependencies,
    penpot_page: { page_id: page.page_id, page_name: page.page_name },
    boards
  };
});

if (cases.length !== 34) throw new Error(`expected 34 cases, got ${cases.length}`);
const unresolvedGraphJoins = archetypes.flatMap(a => a.dependencies.filter(d => d.graph_join === 'explicit_gap').map(d => `${a.archetype_id}:${d.component_id}`));
const stateEntries = archetypes.flatMap(archetype => archetype.states.map(state => ({ archetype_id: archetype.archetype_id, ...state })));
const outOfBoundsDirectChildren = [];
// Coordinates in the plugin API are page-absolute. A direct child must intersect
// its owner board; otherwise an apparently linked mobile composition exports blank.
for (const item of cases) {
  const board = penpot.pages.flatMap(page => page.boards).find(candidate => candidate.shape_id === item.penpot.board_id);
  for (const child of item.penpot.direct_children) {
    const intersects = child.x < board.x + board.width && child.x + child.width > board.x && child.y < board.y + board.height && child.y + child.height > board.y;
    if (!intersects) outOfBoundsDirectChildren.push({ case_id: item.case_id, shape_id: child.shape_id, name: child.name, x: child.x, y: child.y, width: child.width, height: child.height });
  }
}
const sourceBoards = penpot.pages.flatMap(page => page.boards);
const detachedDirectChildren = cases.flatMap(item => item.penpot.direct_children
  .filter(child => !child.is_component_copy)
  .map(child => ({ case_id: item.case_id, shape_id: child.shape_id, name: child.name })));
const unregisteredTerminalOverrides = cases.flatMap(item => {
  const board = sourceBoards.find(candidate => candidate.shape_id === item.penpot.board_id);
  return (board?.reuse_audit?.unregistered_terminal_shapes ?? []).map(shape => ({ case_id: item.case_id, ...shape }));
});
const isProductResource = shape => shape.is_component_main || (
  shape.is_component_copy && /(?:^|\s)(?:state|variant|representative)(?:\s|$)/iu.test(shape.name)
);
const serviceResourceShapes = penpot.pages.flatMap(page => (page.top_level_non_owner_shapes ?? [])
  .filter(shape => !isProductResource(shape))
  .map(shape => ({
    page_id: page.page_id,
    page_name: page.page_name,
    shape_id: shape.shape_id,
    name: shape.name,
    type: shape.type
  })));

const output = {
  schema_version: 'round-trip-reconstruction.bindings.v1',
  generated_by: 'scripts/round-trip-reconstruction/build-round-trip-bindings.mjs',
  authority: {
    design_system_commit: '9b8043f3bdb86fab4eee00bf94b0f10d4f029c50',
    manifest: { path: `${AUTHORITY}/manifest.v1.json`, sha256: manifestSha },
    source_lock: { path: `${AUTHORITY}/source-lock.v1.json`, sha256: sha256(bytes(`${AUTHORITY}/source-lock.v1.json`)) },
    component_graph: { path: `${AUTHORITY}/component-composition-graph.v1.json`, sha256: sha256(bytes(`${AUTHORITY}/component-composition-graph.v1.json`)) },
    ui_only_plan: { path: `${AUTHORITY}/penpot-materialization-plan.v1.json`, sha256: sha256(bytes(`${AUTHORITY}/penpot-materialization-plan.v1.json`)) },
    astro_commit: EXPECTED_ASTRO_SHA
  },
  penpot: {
    file_id: PENPOT_FILE_ID,
    revision: penpot.revision,
    validation: penpot.validation,
    page_count: penpot.pages.length,
    board_count: cases.length,
    library_component_count: penpot.library_component_count,
    service_resources: serviceResourceShapes.length,
    service_resource_shapes: serviceResourceShapes,
    direct_children: cases.reduce((sum, item) => sum + item.penpot.direct_children.length, 0),
    linked_direct_children: cases.reduce((sum, item) => sum + item.penpot.direct_children.filter(child => child.is_component_copy).length, 0),
    detached_direct_children: detachedDirectChildren,
    reuse_audit_complete: sourceBoards.length === 34 && sourceBoards.every(board => board.reuse_audit),
    unregistered_terminal_overrides: unregisteredTerminalOverrides,
    out_of_bounds_direct_children: outOfBoundsDirectChildren
  },
  coverage: {
    archetypes: archetypes.length,
    desktop_cases: cases.filter(item => item.viewport === 'desktop').length,
    mobile_cases: cases.filter(item => item.viewport === 'mobile').length,
    graph_join_explicit_gaps: unresolvedGraphJoins,
    states: stateEntries.length,
    materialization_eligible_states: stateEntries.filter(item => item.materialization_eligible).length,
    explicit_state_gaps: stateEntries.filter(item => item.explicit_gap).map(item => ({ archetype_id: item.archetype_id, state_id: item.state_id, reason: item.explicit_gap }))
  },
  archetypes,
  cases
};

mkdirSync(dirname(join(ROOT, OUT)), { recursive: true });
writeFileSync(join(ROOT, OUT), render(output));
console.log(`${OUT}: ${sha256(bytes(OUT))} (${archetypes.length} archetypes, ${cases.length} cases)`);

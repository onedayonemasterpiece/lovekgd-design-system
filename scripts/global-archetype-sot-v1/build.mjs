#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');
const atlasRoot = join(repoRoot, 'catalog/reconstruction-atlas/v1');
const outputRoot = join(repoRoot, 'catalog/global-archetype-sot-v1');
const contractRoot = join(outputRoot, 'archetype-contracts');

const DESIGN_SYSTEM_PARENT_SHA = '149cc9c56a1245e846c1abc614723078c3417cb7';
const ALLOWED_DISPOSITIONS = ['reuse_existing', 'new_component', 'runtime_only', 'unresolved'];
const NON_PRODUCTION_PATTERNS = new Map([
  ['/legal/:slug/', { disposition: 'unresolved', reason: 'no-current-production-source-route' }],
  ['/:home-prelaunch-env/', { disposition: 'runtime_only', reason: 'environment-branch-not-public-route' }],
  ['/:unavailable/', { disposition: 'unresolved', reason: 'no-accepted-dedicated-route-contract' }],
]);
const PROTECTED_EXISTING_ARTIFACTS = [
  '^catalog/page-archetypes/date-listing-shell-v1/',
  '^catalog/page-archetypes/weekend-listing-v1/',
  '^tests/date-listing-shell-v1\\.test\\.mjs$',
  '^tests/weekend-listing-v1\\.test\\.mjs$',
  '^receipts/(?:penpot|ui-conformance)/(?:date-listing|date-listing-shell-v1|weekend|weekend-listing-v1)(?:/|-)',
];

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const unique = (values) => [...new Set(values)].sort();
const slug = (value) => String(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/gu, '-')
  .replace(/^-+|-+$/gu, '') || 'root';
const stableObject = (value) => {
  if (Array.isArray(value)) return value.map(stableObject);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableObject(value[key])]));
  }
  return value;
};
const json = (value) => `${JSON.stringify(stableObject(value), null, 2)}\n`;
const writeJson = (path, value) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, json(value));
};
const repoPath = (path) => relative(repoRoot, path).replaceAll('\\', '/');
const fileRef = (path) => ({ path: repoPath(path), sha256: sha256(readFileSync(path)), bytes: readFileSync(path).length });

const inputs = {
  sourceManifest: join(atlasRoot, 'source-manifest.v1.json'),
  routeRegistry: join(atlasRoot, 'route-registry.v1.json'),
  semanticAtlas: join(atlasRoot, 'semantic-atlas.v1.json'),
  reuseMap: join(atlasRoot, 'reuse-new-map.v1.json'),
  foundations: join(atlasRoot, 'foundations.v1.json'),
  fixtures: join(atlasRoot, 'fixtures.v1.json'),
  gaps: join(atlasRoot, 'gap-ledger.v1.json'),
  evidenceIndex: join(atlasRoot, 'evidence/index.v1.json'),
  browserObservations: join(atlasRoot, 'evidence/browser-observations.v1.json'),
  materializationIr: join(atlasRoot, 'penpot/materialization-ir.v1.json'),
};
const sourceManifest = readJson(inputs.sourceManifest);
const routeRegistryInput = readJson(inputs.routeRegistry);
const semanticAtlas = readJson(inputs.semanticAtlas);
const reuseMap = readJson(inputs.reuseMap);
const foundations = readJson(inputs.foundations);
const fixtures = readJson(inputs.fixtures);
const gaps = readJson(inputs.gaps);
const evidenceIndex = readJson(inputs.evidenceIndex);
const browser = readJson(inputs.browserObservations);
const materializationIr = readJson(inputs.materializationIr);

const astroSourceSha = routeRegistryInput.source_repo?.expected_head;
if (!/^[0-9a-f]{40}$/u.test(astroSourceSha || '')) throw new Error('Atlas route registry does not expose a locked 40-character Astro SHA');
if (routeRegistryInput.source_route_coverage_percent !== 100 || routeRegistryInput.unmapped_production_pages?.length) {
  throw new Error('Input reconstruction atlas is not at 100% source-route coverage');
}
if (semanticAtlas.archetype_count !== semanticAtlas.archetypes.length) throw new Error('Semantic atlas archetype count mismatch');
if (browser.task_count !== browser.observations.length) throw new Error('Browser observation task count mismatch');
if (browser.task_count !== evidenceIndex.browser_observation_count) throw new Error('Evidence index browser count mismatch');
if (browser.failed_observation_count !== evidenceIndex.browser_failed_observation_count) throw new Error('Evidence index browser failure count mismatch');

const sourceLockId = `global-archetype-sot-v1.${DESIGN_SYSTEM_PARENT_SHA.slice(0, 12)}.${astroSourceSha.slice(0, 12)}`;
const inputRefs = Object.values(inputs).map(fileRef).sort((a, b) => a.path.localeCompare(b.path));
const sourceLock = {
  schema_version: 'global-archetype-source-lock.v1',
  lock_id: sourceLockId,
  authority_mode: 'reconstructed',
  lifecycle: 'candidate',
  canonical: false,
  promoted: false,
  production_deployed: false,
  design_system_parent: {
    repository: 'onedayonemasterpiece/lovekgd-design-system',
    branch: 'feature/date-listing-shell-v1-20260823',
    commit_sha: DESIGN_SYSTEM_PARENT_SHA,
  },
  astro_source: {
    repository: 'onedayonemasterpiece/events-bot-new',
    commit_sha: astroSourceSha,
    authority: 'current integrated Astro source locked by reconstruction-atlas/v1',
  },
  generated_output: {
    captured_at: browser.captured_at,
    origin: browser.origin,
    browser_observation_count: browser.task_count,
    failed_observation_count: browser.failed_observation_count,
    reduced_motion: browser.policy?.reduced_motion === true,
    viewports: browser.policy?.viewports ?? [],
  },
  route_scope: {
    production_astro_page_count: routeRegistryInput.production_astro_page_count,
    mapped_production_astro_page_count: routeRegistryInput.mapped_production_astro_page_count,
    excluded_preprod_pages: routeRegistryInput.excluded_preprod_pages ?? [],
    rule: 'All production .astro page sources, public route patterns, and captured generated-browser routes must map to exactly one archetype. Runtime contradictions remain mapped but unresolved.',
  },
  inputs: inputRefs,
  protected_existing_artifacts: {
    base_sha: DESIGN_SYSTEM_PARENT_SHA,
    forbidden_changed_path_patterns: PROTECTED_EXISTING_ARTIFACTS,
  },
  semantic_contract_prohibitions: [
    'Penpot identifiers',
    'Penpot evidence',
    'renderer deltas',
    'screenshots',
    'pixel metrics',
  ],
};

const semanticById = new Map(semanticAtlas.archetypes.map((item) => [item.id, item]));
const routeById = new Map(routeRegistryInput.archetypes.map((item) => [item.id, item]));
const fixtureRoutesByArchetype = new Map((fixtures.route_fixtures ?? []).map((item) => [item.archetype_id, item.routes ?? []]));
const irPageByArchetype = new Map((materializationIr.pages ?? []).map((item) => [item.archetype_id, item]));
const reuseNodeById = new Map((reuseMap.nodes ?? []).map((item) => [item.id, item]));

const runtimeComponent = (id) => /(?:^authorization\.|\.controller$|connectivity-diagnostic$|^system\.toast-region$)/u.test(id);
const mapNodeDisposition = (node) => {
  if (runtimeComponent(node.id)) return 'runtime_only';
  if (node.disposition === 'REUSE_FROZEN_OR_RECONCILE') return 'reuse_existing';
  if (node.disposition === 'NEW_OR_ARCHETYPE_DELTA') return 'new_component';
  return 'unresolved';
};
const archetypeDisposition = (id) => {
  if (id === 'archetype.listing.date' || id === 'archetype.listing.weekend') return 'reuse_existing';
  if (id === 'archetype.special-state') return 'runtime_only';
  return 'new_component';
};
const stateCategory = (state) => {
  if (/loading|error|retry|stale|checking|diagnostic|invitation|authenticated|anonymous|locked|unlocked|selected|hidden|undo|personalized|rerank|filter|runtime|prelaunch/u.test(state)) return 'runtime';
  if (/desktop|mobile|tablet|wide|portrait|image/u.test(state)) return 'responsive_or_media';
  if (/empty|sparse|dense|stress|partial|complete|no-|absent|present/u.test(state)) return 'content';
  if (/past|upcoming|archived|completed|current/u.test(state)) return 'lifecycle';
  return 'semantic';
};
const hasRuntimeBoundary = (archetype) => (archetype.states ?? []).some((state) => stateCategory(state) === 'runtime');
const semanticGaps = (gaps.gaps ?? []).filter((gap) => gap.archetype_id !== '*' && !/renderer|penpot/iu.test(`${gap.id} ${gap.evidence ?? ''} ${gap.disposition ?? ''}`));
const failedObservations = browser.observations.filter((item) => item.navigation_error || (item.response_status ?? 500) >= 400);

const observationId = (item, index) => `browser.${String(index + 1).padStart(3, '0')}.${sha256(`${item.archetype_id}\0${item.requested_route}\0${item.viewport?.id ?? 'unknown'}`).slice(0, 12)}`;
const observations = browser.observations.map((item, index) => ({
  ...item,
  observation_id: observationId(item, index),
  success: !item.navigation_error && (item.response_status ?? 500) < 400,
}));
const observationsByArchetype = new Map();
for (const item of observations) {
  if (!observationsByArchetype.has(item.archetype_id)) observationsByArchetype.set(item.archetype_id, []);
  observationsByArchetype.get(item.archetype_id).push(item);
}

const allSourcePages = unique(routeRegistryInput.archetypes.flatMap((item) => item.source_files ?? []));
const sourcePages = allSourcePages.map((pageSource) => {
  const owners = routeRegistryInput.archetypes.filter((item) => (item.source_files ?? []).includes(pageSource)).map((item) => item.id).sort();
  return {
    page_source: pageSource,
    production: !pageSource.includes('/lab/') && !(routeRegistryInput.excluded_preprod_pages ?? []).includes(pageSource),
    archetype_ids: owners,
    mapped: owners.length > 0,
  };
});

const routePatterns = [];
for (const archetype of routeRegistryInput.archetypes) {
  for (const pattern of archetype.route_patterns ?? []) {
    const nonProduction = NON_PRODUCTION_PATTERNS.get(pattern);
    routePatterns.push({
      route_pattern: pattern,
      archetype_id: archetype.id,
      production: !nonProduction,
      disposition: nonProduction?.disposition ?? archetypeDisposition(archetype.id),
      exclusion_or_unresolved_reason: nonProduction?.reason ?? null,
      source_pages: archetype.source_files ?? [],
    });
  }
}
routePatterns.sort((a, b) => a.route_pattern.localeCompare(b.route_pattern) || a.archetype_id.localeCompare(b.archetype_id));

const concreteGroups = new Map();
for (const item of observations) {
  const key = item.requested_route;
  if (!concreteGroups.has(key)) concreteGroups.set(key, []);
  concreteGroups.get(key).push(item);
}
const generatedRoutes = [...concreteGroups.entries()].map(([publicPath, items]) => {
  const archetypeIds = unique(items.map((item) => item.archetype_id));
  const failed = items.filter((item) => !item.success);
  return {
    public_path: publicPath,
    archetype_id: archetypeIds.length === 1 ? archetypeIds[0] : null,
    archetype_candidates: archetypeIds,
    production: true,
    disposition: failed.length ? 'unresolved' : archetypeDisposition(archetypeIds[0]),
    viewport_ids: unique(items.map((item) => item.viewport?.id).filter(Boolean)),
    observation_refs: items.map((item) => item.observation_id).sort(),
    observation_count: items.length,
    successful_observation_count: items.length - failed.length,
    failed_observation_count: failed.length,
    generated_html_observed: items.some((item) => item.observation !== null),
    browser_computed_output_observed: items.some((item) => item.observation !== null),
  };
}).sort((a, b) => a.public_path.localeCompare(b.public_path));

const productionSourcePages = sourcePages.filter((item) => item.production);
const productionPatterns = routePatterns.filter((item) => item.production);
const routeRegistry = {
  schema_version: 'global-route-archetype-registry.v1',
  source_lock_id: sourceLockId,
  coverage: {
    production_source_pages: routeRegistryInput.production_astro_page_count,
    mapped_production_source_pages: routeRegistryInput.mapped_production_astro_page_count,
    source_page_mapping_percent: routeRegistryInput.source_route_coverage_percent,
    production_route_patterns: productionPatterns.length,
    mapped_production_route_patterns: productionPatterns.filter((item) => item.archetype_id).length,
    route_pattern_mapping_percent: productionPatterns.length ? 100 : 0,
    generated_routes: generatedRoutes.length,
    mapped_generated_routes: generatedRoutes.filter((item) => item.archetype_id).length,
    generated_route_mapping_percent: generatedRoutes.length ? Number((generatedRoutes.filter((item) => item.archetype_id).length / generatedRoutes.length * 100).toFixed(6)) : 100,
    browser_observations: observations.length,
    mapped_browser_observations: observations.filter((item) => semanticById.has(item.archetype_id)).length,
    browser_observation_mapping_percent: observations.length ? Number((observations.filter((item) => semanticById.has(item.archetype_id)).length / observations.length * 100).toFixed(6)) : 100,
    failed_browser_observations: failedObservations.length,
  },
  source_pages: sourcePages,
  route_patterns: routePatterns,
  generated_routes: generatedRoutes,
};

const foundationsUsage = {
  typography_roles: Object.keys(foundations.typography?.roles ?? {}).sort(),
  semantic_color_roles: Object.keys(foundations.semantic_colors ?? {}).sort(),
  spacing_roles: Object.keys(foundations.spacing_roles_px ?? {}).sort(),
  radius_roles: Object.keys(foundations.radius_roles_px ?? {}).sort(),
  elevation_roles: Object.keys(foundations.elevation_roles ?? {}).sort(),
  container_roles: Object.keys(foundations.containers ?? {}).sort(),
  breakpoint_roles: Object.keys(foundations.breakpoints ?? {}).sort(),
  accessibility_roles: Object.keys(foundations.accessibility ?? {}).sort(),
  cross_cutting_contracts: Object.keys(foundations.cross_cutting_contracts ?? {}).sort(),
};

const dependenciesFor = (archetypeId) => {
  const dependencies = (reuseMap.nodes ?? [])
    .filter((node) => (node.consumers ?? []).includes(archetypeId))
    .map((node) => ({
      component_id: node.id,
      dependency_type: mapNodeDisposition(node) === 'runtime_only' ? 'runtime_boundary' : 'component',
      disposition: mapNodeDisposition(node),
      required: true,
      source_identity_ids: [node.id],
      contract_ref: `catalog/reconstruction-atlas/v1/reuse-new-map.v1.json#${node.id}`,
      ...(mapNodeDisposition(node) === 'runtime_only' ? { runtime_boundary: 'Runtime-owned behavior; the generated semantic structure remains authoritative.' } : {}),
    }));
  const archetype = semanticById.get(archetypeId);
  if (hasRuntimeBoundary(archetype)) {
    dependencies.push({
      component_id: `runtime.${archetypeId.replace(/^archetype\./u, '')}`,
      dependency_type: 'runtime_boundary',
      disposition: 'runtime_only',
      required: true,
      source_identity_ids: [`runtime-boundary:${archetypeId}`],
      runtime_boundary: 'Client/runtime state may change interaction and availability, but must not rewrite the generated semantic anatomy.',
    });
  }
  for (const gap of semanticGaps.filter((item) => item.archetype_id === archetypeId)) {
    dependencies.push({
      component_id: `unresolved.${slug(gap.id)}`,
      dependency_type: 'unresolved_contract',
      disposition: 'unresolved',
      required: false,
      source_identity_ids: [`gap:${gap.id}`],
      unresolved_reason: gap.id,
    });
  }
  for (const item of observationsByArchetype.get(archetypeId) ?? []) {
    if (item.success) continue;
    dependencies.push({
      component_id: `unresolved.generated-route.${sha256(`${item.requested_route}\0${item.viewport?.id ?? 'unknown'}`).slice(0, 12)}`,
      dependency_type: 'unresolved_contract',
      disposition: 'unresolved',
      required: false,
      source_identity_ids: [`generated-route:${archetypeId}:${item.requested_route}:${item.viewport?.id ?? 'unknown'}`],
      unresolved_reason: 'generated-route-contract-unavailable-at-locked-viewport',
    });
  }
  const seen = new Set();
  return dependencies.filter((dependency) => {
    const key = dependency.component_id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => a.component_id.localeCompare(b.component_id));
};

const fixtureSlotsFor = (archetype) => {
  const slots = [];
  const routes = fixtureRoutesByArchetype.get(archetype.id) ?? archetype.representative_routes ?? [];
  slots.push({
    slot_id: 'generated-route-scenarios',
    content_type: 'generated-route',
    multiplicity: 'many',
    required: true,
    fixture_refs: routes,
  });
  const stateFixtures = unique((archetype.states ?? []).filter((state) => /empty|sparse|dense|stress|loading|error|retry|stale|no-|absent|present|locked|complete|partial/u.test(state)));
  if (stateFixtures.length) {
    slots.push({
      slot_id: 'state-scenarios',
      content_type: 'semantic-state',
      multiplicity: 'many',
      required: true,
      fixture_refs: stateFixtures,
    });
  }
  if (archetype.id === 'archetype.event-detail' && (fixtures.event_detail_scenarios ?? []).length) {
    slots.push({
      slot_id: 'event-media-scenarios',
      content_type: 'event-detail-scenario',
      multiplicity: 'many',
      required: true,
      fixture_refs: fixtures.event_detail_scenarios.map((item) => `${item.fixture_role}:${item.route}`),
    });
  }
  const manifest = fixtures.archetype_manifests?.[archetype.id];
  if (manifest?.path) {
    slots.push({
      slot_id: 'existing-archetype-fixture-contract',
      content_type: 'fixture-contract-reference',
      multiplicity: 'one',
      required: true,
      fixture_refs: [manifest.path],
    });
  }
  return slots;
};

const branchFor = (description, index) => {
  const lower = description.toLowerCase();
  const branchId = lower.startsWith('desktop') ? 'desktop' : lower.startsWith('mobile') ? 'mobile' : lower.startsWith('tablet') ? 'tablet' : `branch-${index + 1}`;
  return {
    branch_id: branchId,
    condition: branchId === 'desktop' ? 'desktop breakpoint' : branchId === 'mobile' ? 'mobile breakpoint' : branchId === 'tablet' ? 'tablet transition breakpoint' : 'content or runtime condition',
    structure: description,
  };
};

rmSync(contractRoot, { recursive: true, force: true });
mkdirSync(contractRoot, { recursive: true });
const contracts = [];
for (const archetype of semanticAtlas.archetypes) {
  const dependencies = dependenciesFor(archetype.id);
  const page = irPageByArchetype.get(archetype.id);
  const anatomy = (archetype.anatomy ?? []).map((partId, index) => ({
    part_id: partId,
    order: index + 1,
    required: true,
  }));
  const states = unique(archetype.states ?? []).map((stateId) => ({
    state_id: stateId,
    category: stateCategory(stateId),
    required: true,
  }));
  const responsiveDescriptions = archetype.responsive ?? archetype.responsive_branches ?? [];
  const contract = {
    schema_version: 'global-archetype-semantic-contract.v1',
    contract_id: `${archetype.id}.global-sot-v1`,
    archetype_id: archetype.id,
    title: archetype.checklist_label,
    authority_mode: 'reconstructed',
    lifecycle: 'candidate',
    canonical: false,
    promoted: false,
    production_deployed: false,
    source_lock_id: sourceLockId,
    disposition: archetypeDisposition(archetype.id),
    final_owner_page: {
      key: `final-owner.${archetype.id.replace(/^archetype\./u, '')}`,
      title: page?.title ?? archetype.checklist_label,
    },
    route_contract: {
      route_patterns: archetype.route_patterns ?? [],
      source_pages: archetype.source_files ?? [],
      representative_generated_routes: fixtureRoutesByArchetype.get(archetype.id) ?? archetype.representative_routes ?? [],
    },
    anatomy,
    regions: anatomy.map((part) => ({
      region_id: part.part_id,
      semantic_role: part.part_id,
      order: part.order,
      required: part.required,
    })),
    component_dependencies: dependencies,
    states,
    responsive_branches: responsiveDescriptions.map(branchFor),
    foundations_usage: foundationsUsage,
    fixture_slots: fixtureSlotsFor(archetype),
    dispositions_summary: Object.fromEntries(ALLOWED_DISPOSITIONS.map((disposition) => [disposition, dependencies.filter((item) => item.disposition === disposition).length + (archetypeDisposition(archetype.id) === disposition ? 1 : 0)])),
    semantic_notes: [
      'Runtime behavior may change availability and interaction state but must not alter the declared semantic anatomy.',
      'A component identity is reused only when its exact source identity is stable; visual similarity alone is not a merge authority.',
    ],
  };
  const filename = `${archetype.id.replace(/^archetype\./u, '').replaceAll('.', '-')}.semantic-contract.v1.json`;
  const path = join(contractRoot, filename);
  writeJson(path, contract);
  contracts.push({ archetype_id: archetype.id, path: repoPath(path), contract });
}

const componentNodes = (reuseMap.nodes ?? []).map((node) => ({
  node_id: `component.${node.id}`,
  node_kind: mapNodeDisposition(node) === 'runtime_only' ? 'runtime_boundary' : 'component',
  semantic_id: node.id,
  disposition: mapNodeDisposition(node),
  source_identity_ids: [node.id],
  consumers: unique(node.consumers ?? []),
  speculative_merge: false,
}));
const runtimeNodes = semanticAtlas.archetypes.filter(hasRuntimeBoundary).map((archetype) => ({
  node_id: `runtime.${archetype.id.replace(/^archetype\./u, '')}`,
  node_kind: 'runtime_boundary',
  semantic_id: `runtime.${archetype.id}`,
  disposition: 'runtime_only',
  source_identity_ids: [`runtime-boundary:${archetype.id}`],
  consumers: [archetype.id],
  speculative_merge: false,
}));
const gapNodes = semanticGaps.map((gap) => ({
  node_id: `unresolved.${slug(gap.id)}`,
  node_kind: 'unresolved_contract',
  semantic_id: gap.id,
  disposition: 'unresolved',
  source_identity_ids: [`gap:${gap.id}`],
  consumers: [gap.archetype_id],
  speculative_merge: false,
}));
const browserGapNodes = failedObservations.map((item) => ({
  node_id: `unresolved.generated-route.${sha256(`${item.requested_route}\0${item.viewport?.id ?? 'unknown'}`).slice(0, 12)}`,
  node_kind: 'unresolved_contract',
  semantic_id: `generated-route:${item.requested_route}:${item.viewport?.id ?? 'unknown'}`,
  disposition: 'unresolved',
  source_identity_ids: [`generated-route:${item.archetype_id}:${item.requested_route}:${item.viewport?.id ?? 'unknown'}`],
  consumers: [item.archetype_id],
  speculative_merge: false,
}));
const archetypeNodes = semanticAtlas.archetypes.map((archetype) => ({
  node_id: archetype.id,
  node_kind: 'archetype_composition',
  semantic_id: archetype.id,
  disposition: archetypeDisposition(archetype.id),
  source_identity_ids: [`archetype:${archetype.id}`],
  consumers: [],
  speculative_merge: false,
}));
const nodeMap = new Map();
for (const node of [...archetypeNodes, ...componentNodes, ...runtimeNodes, ...gapNodes, ...browserGapNodes]) {
  const existing = nodeMap.get(node.node_id);
  if (!existing) nodeMap.set(node.node_id, node);
  else existing.consumers = unique([...existing.consumers, ...node.consumers]);
}
const graphNodes = [...nodeMap.values()].sort((a, b) => a.node_id.localeCompare(b.node_id));
const graphEdges = [];
for (const contractEntry of contracts) {
  for (const dependency of contractEntry.contract.component_dependencies) {
    const target = dependency.component_id.startsWith('runtime.') || dependency.component_id.startsWith('unresolved.')
      ? dependency.component_id
      : `component.${dependency.component_id}`;
    graphEdges.push({
      edge_id: `edge.${sha256(`${contractEntry.archetype_id}\0depends-on\0${target}`).slice(0, 16)}`,
      from: contractEntry.archetype_id,
      to: target,
      relation: 'depends_on',
    });
  }
}
const graph = {
  schema_version: 'global-component-composition-graph.v1',
  source_lock_id: sourceLockId,
  merge_policy: {
    fail_closed: true,
    speculative_component_merges_allowed: false,
    identity_rule: 'One graph component node equals one exact source semantic identity. Shared consumers are reuse, not an identity merge.',
    forbidden_merge_bases: ['visual similarity', 'class-name similarity', 'computed-style similarity', 'screenshot geometry', 'shared route ancestry'],
  },
  nodes: graphNodes,
  edges: graphEdges.sort((a, b) => a.edge_id.localeCompare(b.edge_id)),
};

const contractByArchetype = new Map(contracts.map((item) => [item.archetype_id, item]));
const coverageRows = semanticAtlas.archetypes.map((archetype) => {
  const scopedObservations = observationsByArchetype.get(archetype.id) ?? [];
  const scopedRoutes = generatedRoutes.filter((item) => item.archetype_id === archetype.id);
  const contract = contractByArchetype.get(archetype.id).contract;
  return {
    archetype_id: archetype.id,
    contract_path: contractByArchetype.get(archetype.id).path,
    source_page_count: (archetype.source_files ?? []).length,
    route_pattern_count: (archetype.route_patterns ?? []).length,
    generated_route_count: scopedRoutes.length,
    browser_observation_count: scopedObservations.length,
    successful_browser_observation_count: scopedObservations.filter((item) => item.success).length,
    failed_browser_observation_count: scopedObservations.filter((item) => !item.success).length,
    component_dispositions: contract.dispositions_summary,
    mapping_status: 'covered',
    runtime_status: scopedObservations.some((item) => !item.success) ? 'covered_with_unresolved' : 'covered',
  };
});
const coverage = {
  schema_version: 'global-archetype-coverage-matrix.v1',
  source_lock_id: sourceLockId,
  summary: {
    archetypes: semanticAtlas.archetypes.length,
    semantic_contracts: contracts.length,
    production_source_pages: routeRegistry.coverage.production_source_pages,
    mapped_production_source_pages: routeRegistry.coverage.mapped_production_source_pages,
    source_page_mapping_percent: routeRegistry.coverage.source_page_mapping_percent,
    production_route_patterns: routeRegistry.coverage.production_route_patterns,
    mapped_production_route_patterns: routeRegistry.coverage.mapped_production_route_patterns,
    route_pattern_mapping_percent: routeRegistry.coverage.route_pattern_mapping_percent,
    generated_routes: routeRegistry.coverage.generated_routes,
    mapped_generated_routes: routeRegistry.coverage.mapped_generated_routes,
    generated_route_mapping_percent: routeRegistry.coverage.generated_route_mapping_percent,
    browser_observations: observations.length,
    successful_browser_observations: observations.filter((item) => item.success).length,
    failed_browser_observations: observations.filter((item) => !item.success).length,
    browser_observation_mapping_percent: routeRegistry.coverage.browser_observation_mapping_percent,
    unresolved_contracts: graphNodes.filter((node) => node.disposition === 'unresolved').length,
    speculative_component_merges: graphNodes.filter((node) => node.speculative_merge).length,
  },
  by_archetype: coverageRows,
  route_patterns: routePatterns.map((item) => ({
    route_pattern: item.route_pattern,
    archetype_id: item.archetype_id,
    production: item.production,
    disposition: item.disposition,
    status: item.archetype_id ? (item.production ? 'mapped' : 'explicit_nonproduction') : 'fail',
  })),
  generated_routes: generatedRoutes.map((item) => ({
    public_path: item.public_path,
    archetype_id: item.archetype_id,
    disposition: item.disposition,
    viewport_count: item.viewport_ids.length,
    successful_observation_count: item.successful_observation_count,
    failed_observation_count: item.failed_observation_count,
    status: item.archetype_id ? (item.failed_observation_count ? 'mapped_with_unresolved' : 'mapped') : 'fail',
  })),
};

const bindings = {
  schema_version: 'global-archetype-contract-bindings.v1',
  source_lock_id: sourceLockId,
  policy: 'Generated HTML, browser-computed output and source checks are external bindings; semantic contracts remain free of comparison payloads and design-tool identifiers.',
  browser_capture: {
    origin: browser.origin,
    observation_count: observations.length,
    failed_observation_count: observations.filter((item) => !item.success).length,
  },
  contracts: contracts.map((entry) => {
    const archetype = semanticById.get(entry.archetype_id);
    const scoped = observationsByArchetype.get(entry.archetype_id) ?? [];
    return {
      archetype_id: entry.archetype_id,
      semantic_contract_path: entry.path,
      source_refs: (archetype.source_evidence ?? []).map((item) => ({ path: item.path, sha256: item.sha256 })),
      browser_observation_refs: scoped.map((item) => item.observation_id),
      failed_browser_observation_refs: scoped.filter((item) => !item.success).map((item) => item.observation_id),
      generated_html_observed: scoped.some((item) => item.observation !== null),
      browser_computed_output_observed: scoped.some((item) => item.observation !== null),
      computed_contract_hashes: unique(scoped.map((item) => item.dom_contract_sha256).filter(Boolean)),
    };
  }),
  browser_observations: observations.map((item) => ({
    observation_id: item.observation_id,
    archetype_id: item.archetype_id,
    requested_route: item.requested_route,
    viewport_id: item.viewport?.id ?? null,
    viewport_class: item.viewport?.class ?? null,
    response_status: item.response_status,
    success: item.success,
    redirected: item.redirected,
    final_url: item.final_url,
    navigation_error: item.navigation_error,
    runtime_error_count: (item.runtime_errors ?? []).length,
    dom_contract_sha256: item.dom_contract_sha256,
    computed_summary: item.observation ? {
      title: item.observation.title,
      html_lang: item.observation.html_lang,
      h1: item.observation.h1,
      component_counts: item.observation.component_counts,
      visible_component_counts: item.observation.visible_component_counts,
      state_attributes: item.observation.state_attributes,
      data_markers: item.observation.data_markers,
    } : null,
  })),
};

const planGroups = (materializationIr.pages ?? []).map((page, index) => {
  const contractEntry = contractByArchetype.get(page.archetype_id);
  const contract = contractEntry.contract;
  const dependencyGroups = Object.fromEntries(ALLOWED_DISPOSITIONS.map((disposition) => [disposition, contract.component_dependencies.filter((item) => item.disposition === disposition).map((item) => item.component_id).sort()]));
  const protectedExisting = page.archetype_id === 'archetype.listing.date' || page.archetype_id === 'archetype.listing.weekend';
  return {
    final_owner_page: {
      key: `FINAL-${String(index + 1).padStart(2, '0')}`,
      semantic_key: contract.final_owner_page.key,
      title: page.title,
    },
    archetype_id: page.archetype_id,
    semantic_contract_path: contractEntry.path,
    route_patterns: contract.route_contract.route_patterns,
    component_dispositions: dependencyGroups,
    state_specimens: contract.states.map((item) => item.state_id),
    responsive_specimens: contract.responsive_branches.map((item) => item.branch_id),
    fixture_slots: contract.fixture_slots.map((item) => item.slot_id),
    materialization_sequence: [
      'bind shared foundations',
      'place reuse_existing resources as linked instances',
      'create only exact new_component boundaries',
      'represent runtime_only boundaries as named nonvisual/runtime slots',
      'keep unresolved boundaries explicit and unmerged',
      'compose responsive and state specimens on the final owner page',
    ],
    constraints: {
      plan_only: true,
      no_design_tool_mutation: true,
      no_detached_semantic_duplicates: true,
      no_screenshot_masters: true,
      preserve_existing_date_weekend_artifacts: protectedExisting,
    },
  };
});
const materializationPlan = {
  schema_version: 'global-archetype-penpot-materialization-plan.v1',
  source_lock_id: sourceLockId,
  status: 'plan_only_no_penpot_mutation',
  grouping_rule: 'one bounded final owner page per current reconstruction archetype',
  final_owner_page_count: planGroups.length,
  global_sequence: [
    'foundations',
    'shared components',
    'archetype compositions',
    'runtime and unresolved state indexes',
    'final owner-page assembly',
  ],
  prohibitions: [
    'no design-tool identifiers in semantic contracts',
    'no speculative component merges',
    'no detached duplicate promoted as a semantic master',
    'no modification of existing Date or Weekend artifacts',
  ],
  groups: planGroups,
};

const manifest = {
  schema_version: 'global-archetype-sot-v1',
  status: failedObservations.length ? 'CANDIDATE_READY_WITH_EXPLICIT_UNRESOLVED' : 'CANDIDATE_READY',
  authority_mode: 'reconstructed',
  lifecycle: 'candidate',
  canonical: false,
  promoted: false,
  production_deployed: false,
  source_lock: 'catalog/global-archetype-sot-v1/source-lock.v1.json',
  outputs: {
    route_archetype_registry: 'catalog/global-archetype-sot-v1/route-archetype-registry.v1.json',
    component_composition_graph: 'catalog/global-archetype-sot-v1/component-composition-graph.v1.json',
    archetype_contracts: 'catalog/global-archetype-sot-v1/archetype-contracts/',
    coverage_matrix: 'catalog/global-archetype-sot-v1/coverage-matrix.v1.json',
    contract_bindings: 'catalog/global-archetype-sot-v1/contract-bindings.v1.json',
    penpot_materialization_plan: 'catalog/global-archetype-sot-v1/penpot-materialization-plan.v1.json',
  },
  coverage: coverage.summary,
  operating_contract: {
    route_mapping_fail_closed: true,
    speculative_component_merges_allowed: false,
    generated_html_required: true,
    browser_computed_output_required: true,
    penpot_mutation: false,
    merge: false,
    deploy: false,
  },
};

writeJson(join(outputRoot, 'source-lock.v1.json'), sourceLock);
writeJson(join(outputRoot, 'route-archetype-registry.v1.json'), routeRegistry);
writeJson(join(outputRoot, 'component-composition-graph.v1.json'), graph);
writeJson(join(outputRoot, 'coverage-matrix.v1.json'), coverage);
writeJson(join(outputRoot, 'contract-bindings.v1.json'), bindings);
writeJson(join(outputRoot, 'penpot-materialization-plan.v1.json'), materializationPlan);
writeJson(join(outputRoot, 'manifest.v1.json'), manifest);

const generatedFiles = [
  join(outputRoot, 'source-lock.v1.json'),
  join(outputRoot, 'route-archetype-registry.v1.json'),
  join(outputRoot, 'component-composition-graph.v1.json'),
  ...contracts.map((item) => join(repoRoot, item.path)),
  join(outputRoot, 'coverage-matrix.v1.json'),
  join(outputRoot, 'contract-bindings.v1.json'),
  join(outputRoot, 'penpot-materialization-plan.v1.json'),
  join(outputRoot, 'manifest.v1.json'),
];
const receipt = {
  schema_version: 'global-archetype-generation-receipt.v1',
  source_lock_id: sourceLockId,
  generated_at: sourceManifest.generated_at,
  status: 'PASS',
  counts: {
    archetypes: semanticAtlas.archetypes.length,
    semantic_contracts: contracts.length,
    production_source_pages: routeRegistry.coverage.production_source_pages,
    production_route_patterns: routeRegistry.coverage.production_route_patterns,
    generated_routes: routeRegistry.coverage.generated_routes,
    browser_observations: observations.length,
    failed_browser_observations: failedObservations.length,
    unresolved_contracts: coverage.summary.unresolved_contracts,
    speculative_component_merges: coverage.summary.speculative_component_merges,
  },
  files: generatedFiles.map(fileRef).sort((a, b) => a.path.localeCompare(b.path)),
};
writeJson(join(outputRoot, 'generation-receipt.v1.json'), receipt);

console.log(JSON.stringify({
  status: receipt.status,
  source_lock_id: sourceLockId,
  archetypes: receipt.counts.archetypes,
  semantic_contracts: receipt.counts.semantic_contracts,
  production_source_pages: receipt.counts.production_source_pages,
  source_page_mapping_percent: routeRegistry.coverage.source_page_mapping_percent,
  generated_routes: receipt.counts.generated_routes,
  generated_route_mapping_percent: routeRegistry.coverage.generated_route_mapping_percent,
  browser_observations: receipt.counts.browser_observations,
  failed_browser_observations: receipt.counts.failed_browser_observations,
  speculative_component_merges: receipt.counts.speculative_component_merges,
}, null, 2));

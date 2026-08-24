#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');
const outputRoot = join(repoRoot, 'catalog/global-archetype-sot-v1');
const contractRoot = join(outputRoot, 'archetype-contracts');
const atlasRoot = join(repoRoot, 'catalog/reconstruction-atlas/v1');
const ALLOWED_DISPOSITIONS = new Set(['reuse_existing', 'new_component', 'runtime_only', 'unresolved']);
const ALLOWED_CONTRACT_KEYS = new Set([
  'schema_version', 'contract_id', 'archetype_id', 'title', 'authority_mode', 'lifecycle', 'canonical', 'promoted',
  'production_deployed', 'source_lock_id', 'disposition', 'final_owner_page', 'route_contract', 'anatomy', 'regions',
  'component_dependencies', 'states', 'responsive_branches', 'foundations_usage', 'fixture_slots',
  'dispositions_summary', 'semantic_notes',
]);
const BANNED_CONTRACT_KEY = /(?:^|_)(?:penpot|evidence|renderer|delta|screenshot|pixel|file_id|page_id|board_id|shape_id|revision)(?:_|$)/iu;
const BANNED_CONTRACT_VALUE = /(?:\bpenpot\b|renderer\s+delta|screenshot|pixel[-_ ]?(?:diff|metric))/iu;
const UUID = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/iu;
const BANNED_PLAN_KEY = /^(?:file_id|page_id|board_id|shape_id|component_id|main_shape_id|checkpoint_revision|revision)$/iu;

const readJson = (path) => {
  assert.ok(existsSync(path), `missing file: ${relative(repoRoot, path)}`);
  return JSON.parse(readFileSync(path, 'utf8'));
};
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const walk = (root) => {
  const files = [];
  const visit = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile()) files.push(path);
    }
  };
  visit(root);
  return files;
};
const git = (args, { allowFailure = false } = {}) => {
  const result = spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8' });
  if (!allowFailure && result.status !== 0) throw new Error(`git ${args.join(' ')} failed\n${result.stderr || result.stdout}`);
  return result;
};

function scanContract(value, path = '$') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanContract(item, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      assert.ok(!BANNED_CONTRACT_KEY.test(key), `banned semantic-contract key ${path}.${key}`);
      scanContract(child, `${path}.${key}`);
    }
    return;
  }
  if (typeof value === 'string') {
    assert.ok(!BANNED_CONTRACT_VALUE.test(value), `banned semantic-contract value at ${path}: ${value}`);
    assert.ok(!UUID.test(value), `UUID-like design identifier is forbidden in semantic contract at ${path}`);
  }
}

function scanPlan(value, path = '$') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanPlan(item, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      assert.ok(!BANNED_PLAN_KEY.test(key), `design-tool identifier key forbidden in materialization plan: ${path}.${key}`);
      scanPlan(child, `${path}.${key}`);
    }
    return;
  }
  if (typeof value === 'string') assert.ok(!UUID.test(value), `UUID-like design identifier is forbidden in materialization plan at ${path}`);
}

function validateGitGuards(sourceLock) {
  if (process.env.GLOBAL_ARCHETYPE_SKIP_GIT_GUARD === '1' || !existsSync(join(repoRoot, '.git'))) return;
  const base = sourceLock.protected_existing_artifacts.base_sha;
  assert.equal(git(['merge-base', '--is-ancestor', base, 'HEAD'], { allowFailure: true }).status, 0, `HEAD is not a child of locked design-system parent ${base}`);
  const changed = git(['diff', '--name-only', base, 'HEAD']).stdout.split(/\r?\n/u).filter(Boolean);
  for (const pattern of sourceLock.protected_existing_artifacts.forbidden_changed_path_patterns) {
    const expression = new RegExp(pattern, 'u');
    const hit = changed.find((path) => expression.test(path));
    assert.equal(hit, undefined, `protected Date/Weekend artifact changed: ${hit}`);
  }
  const diffCheck = git(['diff', '--check', base, 'HEAD'], { allowFailure: true });
  assert.equal(diffCheck.status, 0, diffCheck.stdout || diffCheck.stderr || 'git diff --check failed');
}

function validateSourceLock(sourceLock) {
  assert.equal(sourceLock.schema_version, 'global-archetype-source-lock.v1');
  assert.equal(sourceLock.authority_mode, 'reconstructed');
  assert.equal(sourceLock.lifecycle, 'candidate');
  assert.equal(sourceLock.canonical, false);
  assert.equal(sourceLock.promoted, false);
  assert.equal(sourceLock.production_deployed, false);
  assert.match(sourceLock.design_system_parent.commit_sha, /^[0-9a-f]{40}$/u);
  assert.match(sourceLock.astro_source.commit_sha, /^[0-9a-f]{40}$/u);
  assert.equal(sourceLock.route_scope.production_astro_page_count, 29);
  assert.equal(sourceLock.route_scope.mapped_production_astro_page_count, 29);
  assert.ok(sourceLock.inputs.length >= 9);
  for (const input of sourceLock.inputs) {
    const path = join(repoRoot, input.path);
    assert.ok(existsSync(path) && statSync(path).isFile(), `locked input missing: ${input.path}`);
    const bytes = readFileSync(path);
    assert.equal(bytes.length, input.bytes, `locked input byte count changed: ${input.path}`);
    assert.equal(sha256(bytes), input.sha256, `locked input hash changed: ${input.path}`);
  }
}

function validateRoutes(registry, semanticAtlas, bindings) {
  assert.equal(registry.schema_version, 'global-route-archetype-registry.v1');
  const archetypeIds = new Set(semanticAtlas.archetypes.map((item) => item.id));
  assert.equal(registry.coverage.production_source_pages, 29);
  assert.equal(registry.coverage.mapped_production_source_pages, 29);
  assert.equal(registry.coverage.source_page_mapping_percent, 100);
  assert.equal(registry.coverage.mapped_production_route_patterns, registry.coverage.production_route_patterns);
  assert.equal(registry.coverage.route_pattern_mapping_percent, 100);
  assert.equal(registry.coverage.mapped_generated_routes, registry.coverage.generated_routes);
  assert.equal(registry.coverage.generated_route_mapping_percent, 100);
  assert.equal(registry.coverage.mapped_browser_observations, registry.coverage.browser_observations);
  assert.equal(registry.coverage.browser_observation_mapping_percent, 100);
  assert.equal(registry.coverage.browser_observations, 67);
  assert.equal(registry.coverage.failed_browser_observations, 2);

  const productionSources = registry.source_pages.filter((item) => item.production);
  assert.equal(productionSources.length, registry.coverage.production_source_pages);
  for (const source of productionSources) {
    assert.equal(source.mapped, true, `unmapped production source page: ${source.page_source}`);
    assert.ok(source.archetype_ids.length >= 1, `production source page has no archetype: ${source.page_source}`);
    source.archetype_ids.forEach((id) => assert.ok(archetypeIds.has(id), `unknown archetype ${id} for ${source.page_source}`));
  }

  const patternKeys = new Set();
  for (const route of registry.route_patterns) {
    const key = route.route_pattern;
    assert.ok(!patternKeys.has(key), `route pattern maps more than once: ${key}`);
    patternKeys.add(key);
    assert.ok(archetypeIds.has(route.archetype_id), `route pattern maps to unknown archetype: ${key}`);
    assert.ok(ALLOWED_DISPOSITIONS.has(route.disposition), `invalid route disposition: ${route.disposition}`);
    if (route.production) assert.equal(route.exclusion_or_unresolved_reason, null, `production route pattern unexpectedly excluded: ${key}`);
    else assert.ok(route.exclusion_or_unresolved_reason, `nonproduction route pattern lacks explicit reason: ${key}`);
  }

  const concreteKeys = new Set();
  for (const route of registry.generated_routes) {
    assert.ok(!concreteKeys.has(route.public_path), `generated route duplicated: ${route.public_path}`);
    concreteKeys.add(route.public_path);
    assert.equal(route.archetype_candidates.length, 1, `generated route has ambiguous archetype mapping: ${route.public_path}`);
    assert.equal(route.archetype_id, route.archetype_candidates[0]);
    assert.ok(archetypeIds.has(route.archetype_id), `generated route maps to unknown archetype: ${route.public_path}`);
    assert.ok(route.generated_html_observed || route.failed_observation_count > 0, `generated route has neither output nor explicit failure: ${route.public_path}`);
    assert.ok(route.browser_computed_output_observed || route.failed_observation_count > 0, `generated route lacks computed output and explicit failure: ${route.public_path}`);
    if (route.failed_observation_count > 0) assert.equal(route.disposition, 'unresolved', `failed generated route is not unresolved: ${route.public_path}`);
  }

  assert.equal(bindings.browser_observations.length, registry.coverage.browser_observations);
  const observationIds = new Set();
  for (const observation of bindings.browser_observations) {
    assert.ok(!observationIds.has(observation.observation_id), `duplicate browser observation: ${observation.observation_id}`);
    observationIds.add(observation.observation_id);
    assert.ok(archetypeIds.has(observation.archetype_id), `browser observation maps to unknown archetype: ${observation.observation_id}`);
    assert.ok(observation.viewport_id, `browser observation lacks viewport: ${observation.observation_id}`);
    assert.match(observation.dom_contract_sha256, /^[0-9a-f]{64}$/u);
    if (observation.success) assert.ok(observation.computed_summary, `successful browser observation lacks computed output: ${observation.observation_id}`);
  }
  assert.equal(bindings.browser_observations.filter((item) => !item.success).length, 2);
}

function validateContract(contract, sourceLockId) {
  assert.deepEqual(Object.keys(contract).filter((key) => !ALLOWED_CONTRACT_KEYS.has(key)), [], `unexpected semantic-contract key(s) in ${contract.contract_id}`);
  assert.equal(contract.schema_version, 'global-archetype-semantic-contract.v1');
  assert.match(contract.archetype_id, /^archetype\./u);
  assert.equal(contract.authority_mode, 'reconstructed');
  assert.equal(contract.lifecycle, 'candidate');
  assert.equal(contract.canonical, false);
  assert.equal(contract.promoted, false);
  assert.equal(contract.production_deployed, false);
  assert.equal(contract.source_lock_id, sourceLockId);
  assert.ok(ALLOWED_DISPOSITIONS.has(contract.disposition));
  assert.match(contract.final_owner_page.key, /^final-owner\./u);
  assert.ok(contract.final_owner_page.title);
  assert.ok(contract.route_contract.route_patterns.length >= 1);
  assert.ok(contract.route_contract.source_pages.length >= 1);
  assert.ok(contract.anatomy.length >= 1);
  assert.equal(contract.regions.length, contract.anatomy.length);
  assert.ok(contract.states.length >= 1);
  assert.ok(contract.responsive_branches.length >= 2);
  assert.ok(contract.fixture_slots.length >= 1);
  assert.deepEqual(Object.keys(contract.dispositions_summary).sort(), [...ALLOWED_DISPOSITIONS].sort());
  for (const dependency of contract.component_dependencies) {
    assert.ok(ALLOWED_DISPOSITIONS.has(dependency.disposition), `invalid dependency disposition in ${contract.contract_id}`);
    assert.equal(dependency.source_identity_ids.length, 1, `dependency merges identities in ${contract.contract_id}: ${dependency.component_id}`);
    if (dependency.disposition === 'runtime_only') assert.ok(dependency.runtime_boundary, `runtime-only dependency lacks boundary in ${contract.contract_id}: ${dependency.component_id}`);
    if (dependency.disposition === 'unresolved') assert.ok(dependency.unresolved_reason, `unresolved dependency lacks reason in ${contract.contract_id}: ${dependency.component_id}`);
    if (dependency.disposition === 'reuse_existing' || dependency.disposition === 'new_component') assert.ok(dependency.contract_ref, `component dependency lacks exact source contract in ${contract.contract_id}: ${dependency.component_id}`);
  }
  scanContract(contract);
}

function validateGraph(graph, contracts) {
  assert.equal(graph.schema_version, 'global-component-composition-graph.v1');
  assert.equal(graph.merge_policy.fail_closed, true);
  assert.equal(graph.merge_policy.speculative_component_merges_allowed, false);
  const nodeIds = new Set();
  const identities = new Map();
  for (const node of graph.nodes) {
    assert.ok(!nodeIds.has(node.node_id), `duplicate graph node: ${node.node_id}`);
    nodeIds.add(node.node_id);
    assert.ok(ALLOWED_DISPOSITIONS.has(node.disposition), `invalid graph disposition: ${node.node_id}`);
    assert.equal(node.speculative_merge, false, `speculative component merge present: ${node.node_id}`);
    assert.equal(node.source_identity_ids.length, 1, `graph node merges identities: ${node.node_id}`);
    const identity = node.source_identity_ids[0];
    if (identities.has(identity)) assert.equal(identities.get(identity), node.node_id, `one source identity assigned to multiple graph nodes: ${identity}`);
    identities.set(identity, node.node_id);
  }
  const edgeIds = new Set();
  for (const edge of graph.edges) {
    assert.ok(!edgeIds.has(edge.edge_id), `duplicate graph edge: ${edge.edge_id}`);
    edgeIds.add(edge.edge_id);
    assert.ok(nodeIds.has(edge.from), `graph edge source missing: ${edge.from}`);
    assert.ok(nodeIds.has(edge.to), `graph edge target missing: ${edge.to}`);
  }
  for (const contract of contracts) {
    for (const dependency of contract.component_dependencies) {
      const target = dependency.component_id.startsWith('runtime.') || dependency.component_id.startsWith('unresolved.')
        ? dependency.component_id
        : `component.${dependency.component_id}`;
      assert.ok(nodeIds.has(target), `contract dependency missing from graph: ${contract.archetype_id} -> ${target}`);
    }
  }
  assert.equal(graph.nodes.filter((node) => node.speculative_merge).length, 0);
}

function validatePlan(plan, contracts) {
  assert.equal(plan.schema_version, 'global-archetype-penpot-materialization-plan.v1');
  assert.equal(plan.status, 'plan_only_no_penpot_mutation');
  assert.equal(plan.final_owner_page_count, contracts.length);
  assert.equal(plan.groups.length, contracts.length);
  const keys = new Set();
  for (const group of plan.groups) {
    assert.match(group.final_owner_page.key, /^FINAL-\d{2}$/u);
    assert.ok(!keys.has(group.final_owner_page.key), `duplicate final owner page: ${group.final_owner_page.key}`);
    keys.add(group.final_owner_page.key);
    assert.equal(group.constraints.plan_only, true);
    assert.equal(group.constraints.no_design_tool_mutation, true);
    assert.equal(group.constraints.no_detached_semantic_duplicates, true);
    if (group.archetype_id === 'archetype.listing.date' || group.archetype_id === 'archetype.listing.weekend') {
      assert.equal(group.constraints.preserve_existing_date_weekend_artifacts, true);
    }
  }
  scanPlan(plan);
}

function validateReceipt(receipt) {
  assert.equal(receipt.schema_version, 'global-archetype-generation-receipt.v1');
  assert.equal(receipt.status, 'PASS');
  assert.equal(receipt.counts.archetypes, 17);
  assert.equal(receipt.counts.semantic_contracts, 17);
  assert.equal(receipt.counts.production_source_pages, 29);
  assert.equal(receipt.counts.browser_observations, 67);
  assert.equal(receipt.counts.failed_browser_observations, 2);
  assert.equal(receipt.counts.speculative_component_merges, 0);
  for (const file of receipt.files) {
    const path = join(repoRoot, file.path);
    assert.ok(existsSync(path) && statSync(path).isFile(), `receipt file missing: ${file.path}`);
    const bytes = readFileSync(path);
    assert.equal(bytes.length, file.bytes, `receipt bytes mismatch: ${file.path}`);
    assert.equal(sha256(bytes), file.sha256, `receipt hash mismatch: ${file.path}`);
  }
}

export function validateAll() {
  const sourceLock = readJson(join(outputRoot, 'source-lock.v1.json'));
  const manifest = readJson(join(outputRoot, 'manifest.v1.json'));
  const registry = readJson(join(outputRoot, 'route-archetype-registry.v1.json'));
  const graph = readJson(join(outputRoot, 'component-composition-graph.v1.json'));
  const coverage = readJson(join(outputRoot, 'coverage-matrix.v1.json'));
  const bindings = readJson(join(outputRoot, 'contract-bindings.v1.json'));
  const plan = readJson(join(outputRoot, 'penpot-materialization-plan.v1.json'));
  const receipt = readJson(join(outputRoot, 'generation-receipt.v1.json'));
  const semanticAtlas = readJson(join(atlasRoot, 'semantic-atlas.v1.json'));

  validateSourceLock(sourceLock);
  validateGitGuards(sourceLock);
  validateRoutes(registry, semanticAtlas, bindings);

  const contractFiles = walk(contractRoot).filter((path) => path.endsWith('.json'));
  assert.equal(contractFiles.length, semanticAtlas.archetype_count);
  const contracts = contractFiles.map(readJson);
  const contractIds = new Set();
  const archetypeIds = new Set();
  for (const contract of contracts) {
    validateContract(contract, sourceLock.lock_id);
    assert.ok(!contractIds.has(contract.contract_id), `duplicate contract ID: ${contract.contract_id}`);
    assert.ok(!archetypeIds.has(contract.archetype_id), `duplicate archetype contract: ${contract.archetype_id}`);
    contractIds.add(contract.contract_id);
    archetypeIds.add(contract.archetype_id);
  }
  assert.deepEqual([...archetypeIds].sort(), semanticAtlas.archetypes.map((item) => item.id).sort());

  validateGraph(graph, contracts);
  validatePlan(plan, contracts);

  assert.equal(coverage.schema_version, 'global-archetype-coverage-matrix.v1');
  assert.equal(coverage.summary.archetypes, 17);
  assert.equal(coverage.summary.semantic_contracts, 17);
  assert.equal(coverage.summary.source_page_mapping_percent, 100);
  assert.equal(coverage.summary.route_pattern_mapping_percent, 100);
  assert.equal(coverage.summary.generated_route_mapping_percent, 100);
  assert.equal(coverage.summary.browser_observation_mapping_percent, 100);
  assert.equal(coverage.summary.browser_observations, 67);
  assert.equal(coverage.summary.failed_browser_observations, 2);
  assert.equal(coverage.summary.speculative_component_merges, 0);
  assert.ok(coverage.by_archetype.every((row) => row.mapping_status === 'covered'));
  assert.ok(coverage.route_patterns.every((row) => row.status !== 'fail'));
  assert.ok(coverage.generated_routes.every((row) => row.status !== 'fail'));

  assert.equal(bindings.schema_version, 'global-archetype-contract-bindings.v1');
  assert.equal(bindings.contracts.length, contracts.length);
  assert.equal(bindings.browser_observations.length, 67);
  assert.equal(bindings.browser_observations.filter((item) => !item.success).length, 2);

  assert.equal(manifest.schema_version, 'global-archetype-sot-v1');
  assert.equal(manifest.authority_mode, 'reconstructed');
  assert.equal(manifest.lifecycle, 'candidate');
  assert.equal(manifest.canonical, false);
  assert.equal(manifest.promoted, false);
  assert.equal(manifest.production_deployed, false);
  assert.equal(manifest.operating_contract.route_mapping_fail_closed, true);
  assert.equal(manifest.operating_contract.speculative_component_merges_allowed, false);
  assert.equal(manifest.operating_contract.generated_html_required, true);
  assert.equal(manifest.operating_contract.browser_computed_output_required, true);
  assert.equal(manifest.operating_contract.penpot_mutation, false);
  assert.equal(manifest.operating_contract.merge, false);

  validateReceipt(receipt);

  return {
    status: 'PASS',
    archetypes: contracts.length,
    production_source_pages: registry.coverage.production_source_pages,
    source_page_mapping_percent: registry.coverage.source_page_mapping_percent,
    production_route_patterns: registry.coverage.production_route_patterns,
    route_pattern_mapping_percent: registry.coverage.route_pattern_mapping_percent,
    generated_routes: registry.coverage.generated_routes,
    generated_route_mapping_percent: registry.coverage.generated_route_mapping_percent,
    browser_observations: registry.coverage.browser_observations,
    failed_browser_observations: registry.coverage.failed_browser_observations,
    unresolved_contracts: coverage.summary.unresolved_contracts,
    speculative_component_merges: coverage.summary.speculative_component_merges,
  };
}

if (import.meta.url === new URL(`file://${resolve(process.argv[1] || '')}`).href) {
  try {
    console.log(JSON.stringify(validateAll(), null, 2));
  } catch (error) {
    console.error(error.stack || error);
    process.exitCode = 1;
  }
}

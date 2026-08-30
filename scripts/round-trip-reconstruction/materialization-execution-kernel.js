'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { loadResolvedCaseIndex } = require('./resolved-case-loader.js');

const SCHEMAS = {
  bundle: 'kenigevents.immutable-materialization-bundle.v1',
  target: 'kenigevents.materialization-target.v1',
  control: 'KENIGEVENTS_ASP_EXECUTION_CONTROL_V2',
  reuse: 'ASP_OLD_PENPOT_REUSE_MAP_V1',
  receipt: 'kenigevents.materialization-run-receipt.v1',
};
const SHA256_RE = /^[a-f0-9]{64}$/;
const UUID_RE = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i;
const UNRESOLVED = 'UNRESOLVED_CONTROL_GENERATION';

class PreflightError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'PreflightError';
    this.code = code;
  }
}

function assertPreflight(condition, code, message) {
  if (!condition) throw new PreflightError(code, message);
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function canonicalJson(value) {
  return `${JSON.stringify(canonicalize(value))}\n`;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function readJson(filePath, label) {
  let bytes;
  try {
    bytes = fs.readFileSync(filePath);
  } catch (error) {
    throw new PreflightError('MISSING_INPUT', `cannot read ${label}: ${filePath} (${error.code})`);
  }
  try {
    return { value: JSON.parse(bytes), sha256: sha256(bytes) };
  } catch {
    throw new PreflightError('INVALID_JSON', `${label} is invalid JSON: ${filePath}`);
  }
}

function jsonPointer(value, pointer) {
  if (pointer === '') return value;
  return pointer.slice(1).split('/').reduce((current, rawKey) => {
    const key = rawKey.replace(/~1/g, '/').replace(/~0/g, '~');
    return current?.[key];
  }, value);
}

function validateSource(root, binding, expectedHashes) {
  assertPreflight(binding?.role && binding.path, 'INVALID_SOURCE_BINDING', 'source binding requires role and path');
  assertPreflight(SHA256_RE.test(binding.sha256 || ''), 'UNRESOLVED_SOURCE_HASH', `${binding.role} hash is unresolved`);
  assertPreflight(expectedHashes[binding.role] === binding.sha256, 'TARGET_HASH_MISMATCH', `target does not pin ${binding.role}`);
  const absoluteRoot = path.resolve(root);
  const absolutePath = path.resolve(absoluteRoot, binding.path);
  assertPreflight(absolutePath.startsWith(`${absoluteRoot}${path.sep}`), 'PATH_ESCAPE', binding.path);
  let bytes;
  try {
    bytes = fs.readFileSync(absolutePath);
  } catch (error) {
    throw new PreflightError('MISSING_CANONICAL_INPUT', `${binding.path} (${error.code})`);
  }
  assertPreflight(sha256(bytes) === binding.sha256, 'SOURCE_HASH_MISMATCH', binding.role);
  const text = bytes.toString('utf8');
  let document = null;
  if ((binding.format || path.extname(absolutePath).slice(1)) === 'json') {
    try {
      document = JSON.parse(text);
    } catch {
      throw new PreflightError('INVALID_CANONICAL_JSON', binding.role);
    }
  }
  for (const pointer of binding.required_json_pointers || []) {
    assertPreflight(document && jsonPointer(document, pointer) !== undefined, 'MISSING_CANONICAL_BINDING', `${binding.role}:${pointer}`);
  }
  for (const token of binding.required_tokens || []) {
    assertPreflight(text.includes(token), 'MISSING_CANONICAL_BINDING', `${binding.role}:${token}`);
  }
  return { role: binding.role, path: binding.path, sha256: binding.sha256, document };
}

function loadCanonicalInputs(options) {
  const root = path.resolve(options.root);
  const bundleFile = readJson(path.resolve(root, options.bundlePath), 'bundle');
  const targetFile = readJson(path.resolve(options.targetManifestPath), 'target');
  const controlFile = readJson(path.resolve(options.controlPath), 'control');
  const reuseFile = readJson(path.resolve(options.reuseMapPath), 'reuse map');
  const bundle = bundleFile.value;
  const target = targetFile.value;
  const control = controlFile.value;
  const reuseMap = reuseFile.value;

  assertPreflight(bundle.schema === SCHEMAS.bundle, 'BUNDLE_SCHEMA_INVALID', 'bundle schema');
  assertPreflight(['PROMOTABLE', 'CANDIDATE_NON_PROMOTED'].includes(bundle.promotion_state), 'BUNDLE_NOT_PROMOTABLE', 'bundle state is invalid');
  assertPreflight(bundle.control_generation !== UNRESOLVED && bundle.control_generation === control.generation, 'BUNDLE_CONTROL_MISMATCH', 'control generation');
  assertPreflight(!UUID_RE.test(JSON.stringify(bundle)), 'BUNDLE_UUID_FORBIDDEN', 'bundle UUID identity');
  assertPreflight(Array.isArray(bundle.materialization_scopes) && bundle.materialization_scopes.length > 0, 'MATERIALIZATION_SCOPES_MISSING', 'scopes');
  const semanticIds = bundle.materialization_scopes.map((scope) => scope.semantic_id);
  assertPreflight(new Set(semanticIds).size === semanticIds.length, 'DUPLICATE_SEMANTIC_SCOPE', 'duplicate scope');
  for (const scope of bundle.materialization_scopes) {
    const caseId = String(scope.source_ref || '').replace(/^resolved-case:/u, '');
    assertPreflight(scope.source_ref?.startsWith('resolved-case:') && bundle.required_case_ids?.includes(caseId), 'MATERIALIZATION_SCOPE_NOT_RESOLVED_CASE', scope.semantic_id);
  }

  assertPreflight(target.schema === SCHEMAS.target, 'TARGET_MANIFEST_MISSING', 'target schema');
  assertPreflight(target.file_scope?.semantic_id && target.file_scope?.locator, 'TARGET_FILE_SCOPE_MISSING', 'file scope');
  assertPreflight(target.page_scope?.semantic_id && target.page_scope?.locator, 'TARGET_PAGE_SCOPE_MISSING', 'page scope');
  assertPreflight(!UUID_RE.test(JSON.stringify(target)), 'TARGET_UUID_FORBIDDEN', 'target UUID identity');
  assertPreflight(target.bindings && Array.isArray(target.replacement_scopes), 'TARGET_BINDINGS_MISSING', 'target bindings');
  for (const binding of bundle.required_target_bindings || []) {
    assertPreflight(target.bindings[binding], 'TARGET_BINDING_MISSING', binding);
  }
  for (const replacement of target.replacement_scopes) {
    assertPreflight(semanticIds.includes(replacement.semantic_id), 'REPLACEMENT_SCOPE_INVALID', replacement.semantic_id);
  }

  assertPreflight(control.schema === SCHEMAS.control && control.generation && control.generation !== UNRESOLVED, 'CONTROL_GENERATION_MISSING', 'control');
  assertPreflight(control.status === 'ACTIVE', 'CONTROL_NOT_ACTIVE', 'control');
  assertPreflight(control.cancellation?.binding_id, 'CANCELLATION_BINDING_MISSING', 'cancellation');
  assertPreflight(control.accepted_bundles?.[bundle.bundle_id] === bundle.revision, 'BUNDLE_NOT_ACCEPTED', 'bundle');
  assertPreflight(control.target_manifest_sha256 === targetFile.sha256, 'CONTROL_TARGET_MISMATCH', 'target hash');

  assertPreflight(reuseMap.schema === SCHEMAS.reuse && SHA256_RE.test(reuseMap.source_sha256 || ''), 'REUSE_MAP_MISSING', 'reuse map');
  for (const binding of bundle.required_reuse_bindings || []) {
    assertPreflight(reuseMap.semantic_mappings?.[binding], 'REUSE_BINDING_MISSING', binding);
  }

  const sources = bundle.source_bindings.map((binding) => validateSource(root, binding, target.expected_source_hashes || {}));
  const byRole = Object.fromEntries(sources.map((source) => [source.role, source]));
  const indexBinding = bundle.source_bindings.find((binding) => binding.role === 'resolved_case_index');
  assertPreflight(indexBinding && Array.isArray(bundle.required_case_ids), 'RESOLVED_CASE_BINDING_MISSING', 'resolved case index');
  let resolvedCases;
  try {
    resolvedCases = loadResolvedCaseIndex(root, indexBinding.path, indexBinding.sha256, bundle.required_case_ids);
  } catch (error) {
    throw new PreflightError(error.code || 'RESOLVED_CASE_INVALID', error.message);
  }
  const pageAuthority = resolvedCases.index.cases.find((item) => item.case_id === 'free-collection.desktop.full');
  assertPreflight(pageAuthority, 'FIXTURE_ORDER_AUTHORITY_MISSING', 'free-collection.desktop.full');
  const pageCase = loadResolvedCaseIndex(root, indexBinding.path, indexBinding.sha256, [pageAuthority.case_id]).cases[pageAuthority.case_id];
  const order = pageCase.payload.fixture_order;
  assertPreflight(order.length === 5 && new Set(order).size === 5, 'FIXTURE_ORDER_INVALID', 'five fixtures');
  if (bundle.bundle_kind === 'eventcard-free-slice') {
    assertPreflight(order[0] === 'event.real.8006', 'CANARY_FIXTURE_MISMATCH', '8006');
    assertPreflight(bundle.required_case_ids.length === 4, 'STRUCTURAL_CONTEXTS_INVALID', 'four contexts');
  }
  if (bundle.bundle_kind === 'free-collection-page') {
    const expectedCases = ['free-collection.desktop.top', 'free-collection.desktop.scrolled', 'free-collection.desktop.full', 'free-collection.mobile.top', 'free-collection.mobile.scrolled', 'free-collection.mobile.full'];
    assertPreflight(bundle.required_case_ids.join() === expectedCases.join(), 'PAGE_STATES_INVALID', 'resolved cases');
    assertPreflight(bundle.dependencies?.some((dependency) => dependency.bundle_kind === 'eventcard-free-slice'), 'BUNDLE_DEPENDENCY_MISSING', 'eventcard');
  }

  return {
    root,
    bundle,
    target,
    control,
    reuseMap,
    targetHash: targetFile.sha256,
    sources,
    order,
    hashes: Object.fromEntries(sources.map((source) => [source.role, source.sha256])),
    inputHashes: {
      bundle_manifest: bundleFile.sha256,
      target_manifest: targetFile.sha256,
      control: controlFile.sha256,
      reuse_map: reuseFile.sha256,
      resolved_case_index: indexBinding.sha256,
    },
    resolvedCases,
  };
}

function buildPlan(loaded) {
  const targetScope = `${loaded.target.file_scope.semantic_id}/${loaded.target.page_scope.semantic_id}`;
  const revision = `${loaded.bundle.bundle_id}@${loaded.bundle.revision}`;
  const operations = [];
  for (const replacement of [...loaded.target.replacement_scopes].sort((a, b) => a.semantic_id.localeCompare(b.semantic_id))) {
    operations.push({
      sequence: operations.length + 1,
      kind: 'cleanup-replacement-scope',
      semantic_id: replacement.semantic_id,
      locator: replacement.locator,
      idempotence_key: sha256(`${revision}/cleanup/${replacement.semantic_id}/${targetScope}`),
    });
  }
  for (const scope of loaded.bundle.materialization_scopes) {
    operations.push({
      sequence: operations.length + 1,
      kind: 'upsert-semantic-root',
      semantic_id: scope.semantic_id,
      source_ref: scope.source_ref,
      target_binding: scope.target_binding,
      idempotence_key: sha256(`${revision}/upsert/${scope.semantic_id}/${targetScope}`),
    });
  }
  return {
    target_scope: targetScope,
    cleanup_scope: loaded.target.replacement_scopes.map((scope) => scope.semantic_id).sort(),
    operations,
  };
}

class MemoryLeaseStore {
  constructor() { this.active = new Map(); }
  async acquire(key, identity) {
    if (this.active.has(key)) return { acquired: false, holder: this.active.get(key) };
    this.active.set(key, identity);
    return { acquired: true };
  }
  async release(key, identity) {
    if (this.active.get(key) !== identity) return false;
    this.active.delete(key);
    return true;
  }
}

function createReceipt(options, now) {
  return {
    schema: SCHEMAS.receipt,
    version: 1,
    control_generation: null,
    source: { repository: null, ref: null, sha: null },
    materializer_sha256: options.materializerSha256 || null,
    source_hashes: { contract: null, profile: null, asset_registry: null, geometry_registry: null },
    input_hashes: { bundle_manifest: null, target_manifest: null, control: null, reuse_map: null },
    bundles: [],
    target_manifest_sha256: null,
    run: { id: options.runId, lease_key: null, lease_identity: null, acquired: false, released: false },
    preflight: { passed: false, code: null, message: null },
    ordered_write_operations: [],
    cancellation_checks: [],
    outputs: { created: [], reused: [], replaced: [] },
    cleanup_scope: [],
    idempotence_keys: [],
    execution: { mode: options.mode, test: Boolean(options.test), dry_run: options.mode !== 'production' },
    timestamps: { started_at: now(), finished_at: null },
    terminal_state: 'STARTED',
    receipt_sha256: null,
  };
}

function finishReceipt(receipt, state, now) {
  receipt.terminal_state = state;
  receipt.timestamps.finished_at = now();
  receipt.receipt_sha256 = sha256(canonicalJson({ ...receipt, receipt_sha256: null }));
  return receipt;
}

async function executeMaterialization(rawOptions) {
  const now = rawOptions.now || (() => new Date().toISOString());
  const options = { mode: 'plan', runId: `run-${crypto.randomUUID()}`, ...rawOptions };
  const receipt = createReceipt(options, now);
  let loaded;
  let plan;
  try {
    loaded = loadCanonicalInputs(options);
    assertPreflight(options.mode !== 'production' || loaded.bundle.promotion_state === 'PROMOTABLE', 'BUNDLE_NOT_PROMOTABLE', 'candidate is not mutation-authorized');
    assertPreflight(options.mode !== 'production' || SHA256_RE.test(options.materializerSha256 || ''), 'MATERIALIZER_HASH_MISSING', 'materializer hash');
    plan = buildPlan(loaded);
    Object.assign(receipt, {
      control_generation: loaded.control.generation,
      source: { ...loaded.control.source },
      source_hashes: {
        contract: loaded.hashes.component_contract || null,
        profile: loaded.hashes.page_profile || null,
        asset_registry: loaded.hashes.asset_registry || null,
        geometry_registry: loaded.hashes.geometry_registry || null,
      },
      input_hashes: loaded.inputHashes,
      bundles: [{ id: loaded.bundle.bundle_id, revision: loaded.bundle.revision, dependencies: loaded.bundle.dependencies || [] }],
      target_manifest_sha256: loaded.targetHash,
      cleanup_scope: plan.cleanup_scope,
      idempotence_keys: plan.operations.map((operation) => operation.idempotence_key),
      preflight: { passed: true, code: 'OK', message: 'all bindings validated' },
      ordered_write_operations: plan.operations.map((operation) => ({ ...operation, state: 'PLANNED' })),
    });
  } catch (error) {
    receipt.preflight = { passed: false, code: error.code || 'UNEXPECTED_PREFLIGHT_ERROR', message: error.message };
    return finishReceipt(receipt, 'FAILED_PREFLIGHT', now);
  }

  if (options.mode === 'validate') return finishReceipt(receipt, 'VALIDATION_COMPLETE', now);
  if (options.mode === 'plan' || options.mode === 'dry-run') {
    return finishReceipt(receipt, options.mode === 'plan' ? 'PLAN_READY' : 'DRY_RUN_COMPLETE', now);
  }
  if (options.mode !== 'production') return finishReceipt(receipt, 'FAILED_PREFLIGHT', now);

  const adapter = options.adapter;
  const leaseStore = options.leaseStore;
  const cancellationProvider = options.cancellationProvider;
  if (!adapter?.lookup || !adapter?.write || !leaseStore?.acquire || !leaseStore?.release || !cancellationProvider?.read) {
    receipt.preflight = { passed: false, code: 'RUNTIME_BINDING_MISSING', message: 'adapter/lease/cancel' };
    return finishReceipt(receipt, 'FAILED_PREFLIGHT', now);
  }

  const leaseKey = sha256(`${plan.target_scope}/${loaded.bundle.bundle_id}`);
  const leaseIdentity = `${options.runId}:${loaded.control.generation}:${loaded.targetHash}`;
  Object.assign(receipt.run, { lease_key: leaseKey, lease_identity: leaseIdentity });
  const lease = await leaseStore.acquire(leaseKey, leaseIdentity);
  if (!lease.acquired) {
    receipt.run.holder = lease.holder || null;
    return finishReceipt(receipt, 'SKIPPED_LEASE_HELD', now);
  }
  receipt.run.acquired = true;
  let terminalState = 'SUCCEEDED';
  try {
    for (let index = 0; index < plan.operations.length; index += 1) {
      const operation = plan.operations[index];
      const recorded = receipt.ordered_write_operations[index];
      const existing = await adapter.lookup(operation.idempotence_key, operation);
      if (existing) {
        recorded.state = 'REUSED';
        receipt.outputs.reused.push({ operation_sequence: operation.sequence, semantic_id: operation.semantic_id, output_uuid: existing.output_uuid || null });
        continue;
      }
      const cancellation = await cancellationProvider.read(loaded.control.cancellation.binding_id);
      const check = {
        operation_sequence: operation.sequence,
        binding_id: loaded.control.cancellation.binding_id,
        checked_at: now(),
        generation: cancellation?.generation || null,
        cancelled: cancellation?.cancelled !== false,
      };
      receipt.cancellation_checks.push(check);
      if (check.generation !== loaded.control.generation || check.cancelled) {
        for (let rest = index; rest < plan.operations.length; rest += 1) {
          receipt.ordered_write_operations[rest].state = 'SKIPPED_CANCELLED';
        }
        terminalState = 'CANCELLED';
        break;
      }
      const result = await adapter.write(operation);
      recorded.state = operation.kind === 'cleanup-replacement-scope' ? 'REPLACED' : 'CREATED';
      recorded.output_uuid = result?.output_uuid || null;
      const output = { operation_sequence: operation.sequence, semantic_id: operation.semantic_id, output_uuid: recorded.output_uuid };
      receipt.outputs[recorded.state === 'REPLACED' ? 'replaced' : 'created'].push(output);
    }
  } catch (error) {
    terminalState = 'FAILED_WRITE';
    receipt.failure = { code: error.code || 'WRITE_ERROR', message: error.message };
  } finally {
    receipt.run.released = await leaseStore.release(leaseKey, leaseIdentity);
    if (!receipt.run.released && terminalState === 'SUCCEEDED') terminalState = 'FAILED_LEASE_RELEASE';
  }
  return finishReceipt(receipt, terminalState, now);
}

function parseCli(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    assertPreflight(argv[index]?.startsWith('--') && argv[index + 1], 'CLI_ARGUMENT_INVALID', argv[index]);
    const key = argv[index].slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    values[key] = argv[index + 1];
  }
  return values;
}

async function runCli(config, argv = process.argv.slice(2), environment = process.env) {
  const args = parseCli(argv);
  const receipt = await executeMaterialization({
    root: path.resolve(args.root || environment.KENIGEVENTS_UI_SOT_ROOT || process.cwd()),
    bundlePath: config.bundlePath,
    targetManifestPath: args.targetManifest || environment.KENIGEVENTS_TARGET_MANIFEST,
    controlPath: args.control || environment.KENIGEVENTS_EXECUTION_CONTROL,
    reuseMapPath: args.reuseMap || environment.KENIGEVENTS_REUSE_MAP,
    materializerSha256: args.materializerSha256 || environment.KENIGEVENTS_MATERIALIZER_SHA256,
    mode: args.mode || 'validate',
    runId: args.runId,
  });
  process.stdout.write(canonicalJson(receipt));
  return ['VALIDATION_COMPLETE', 'PLAN_READY', 'DRY_RUN_COMPLETE'].includes(receipt.terminal_state) ? 0 : 1;
}

module.exports = {
  MemoryLeaseStore,
  PreflightError,
  SCHEMAS,
  UNRESOLVED,
  buildPlan,
  canonicalJson,
  executeMaterialization,
  loadCanonicalInputs,
  runCli,
  sha256,
};

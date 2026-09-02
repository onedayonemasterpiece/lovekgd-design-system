'use strict';

/*
 * Concrete, package-local Penpot adapter for the frozen R3 linkage repair.
 * This module is inert: MAT/QA/INTEGRATE may test it, but only D0's sole
 * PUBLISH writer may call executeEventcardPathsPenpotR3 with a fresh native
 * projection and a matching physical ACTIVE lease.
 */
const M = require('./eventcard_component_paths_linkage_r3.js');

const ACTIVE_NAMESPACE = 'kenigevents';
const ACTIVE_KEY = 'asp-active-run-v1';
const RECEIPT_KEY = 'eventcard-paths-linkage-r3-receipt';
const AUTH_SCHEMA = 'kenigevents.eventcard-paths-penpot-authorization.r3';
const ACTIVE_SCHEMA = 'kenigevents.asp-run-control.v1';
const RUNTIME_SCHEMA = 'kenigevents.eventcard-paths-penpot-runtime.r3';
const HEX40 = /^[0-9a-f]{40}$/;
const HEX64 = /^[0-9a-f]{64}$/;
const OWNER_DIRECTIVE = 'MORNING_PRODUCTION_SHIFT:EVENTCARD_PATHS_AFTER_EXACT_AUTHORIZATION';
const AUTHORITY_CARD_COMMENT_ID = 5514360206;
const AUTHORITY_SCOPE = 'D0_CONTINUOUS_SHIFT_ACTIVE:EVENTCARD_PATHS_RECEIPT_RECOVERY_ONLY';
const SOLE_WRITER = '/root/publish_r2';

const array = (value) => Array.from(value || []);
const children = (shape) => array(shape?.children);
const mainOf = (component) => typeof component?.mainInstance === 'function'
  ? component.mainInstance() : component?.mainInstance;
const linkedComponent = (shape) => typeof shape?.component === 'function' ? shape.component() : null;
const plugin = (shape, key) => String(shape?.getPluginData?.(key) || '');
const nowMs = () => Date.now();
const fail = (code, unknown = false) => {
  const error = new M.LinkageStop(code, unknown);
  if (unknown) {
    error.requiredNextOperation = 'DISTINCT_READ_ONLY_PROJECTION';
    error.retryAllowed = false;
  }
  throw error;
};

function jsonValue(value) {
  if (value == null || ['string', 'number', 'boolean'].includes(typeof value)) return value;
  if (Array.isArray(value)) return value.map(jsonValue);
  if (typeof value === 'object') {
    const output = {};
    for (const key of Object.keys(value).sort()) {
      if (!['function', 'undefined'].includes(typeof value[key])) output[key] = jsonValue(value[key]);
    }
    return output;
  }
  return String(value);
}

function walk(root) {
  const output = [], queue = root ? [root] : [];
  while (queue.length) {
    const shape = queue.shift();
    output.push(shape);
    queue.push(...children(shape));
  }
  return output;
}

function shapeProjection(shape) {
  const component = linkedComponent(shape);
  return {
    id: String(shape?.id || ''),
    parentId: shape?.parent?.id == null ? null : String(shape.parent.id),
    name: shape?.name ?? null,
    type: shape?.type ?? null,
    x: shape?.x ?? null, y: shape?.y ?? null,
    width: shape?.width ?? null, height: shape?.height ?? null,
    rotation: shape?.rotation ?? null, flipX: shape?.flipX ?? null, flipY: shape?.flipY ?? null,
    hidden: shape?.hidden ?? null, visible: shape?.visible ?? null,
    characters: shape?.characters ?? null,
    fills: jsonValue(shape?.fills ?? []), strokes: jsonValue(shape?.strokes ?? []),
    componentId: component?.id == null ? null : String(component.id),
    g19Marker: plugin(shape, 'kenigevents-g19-marker'),
    payload: plugin(shape, 'kenigevents-payload-sha256'),
    buildState: plugin(shape, 'kenigevents-build-state'),
    children: children(shape).map((item) => String(item.id)),
  };
}

function visibleLabelsProjection(page) {
  return walk(page.root).filter((shape) => shape?.type === 'text').map((shape) => ({
    id: String(shape.id), name: shape.name ?? null, characters: shape.characters ?? null,
    x: shape.x ?? null, y: shape.y ?? null, width: shape.width ?? null, height: shape.height ?? null,
  })).sort((a, b) => a.id.localeCompare(b.id));
}

function findPage(file) {
  return array(file?.pages).filter((page) => String(page?.id || '') === M.PAGE_ID);
}

async function activateExactPage(context, requireLease = null) {
  const { penpot } = context;
  if (!penpot?.currentFile || String(penpot.currentFile.id || '') !== M.FILE_ID) fail('PATHS_R3_FILE_MISMATCH');
  const pages = findPage(penpot.currentFile);
  if (pages.length !== 1) fail('PATHS_R3_PAGE_CARDINALITY');
  if (String(penpot.currentPage?.id || '') !== M.PAGE_ID) {
    if (requireLease) assertPhysicalActive(context, requireLease);
    if (typeof penpot.openPage !== 'function') fail('PATHS_R3_OPEN_PAGE_UNAVAILABLE');
    await penpot.openPage(pages[0]);
  }
  if (String(penpot.currentPage?.id || '') !== M.PAGE_ID) fail('PATHS_R3_CURRENT_PAGE_ACTIVATION_FAILED');
  return pages[0];
}

function nativeAdapter(context, page) {
  const { penpot } = context;
  const fileLocalComponents = array(penpot.library?.local?.components);
  const targetNames = new Set(M.SPECS.map((spec) => spec.displayName));
  // The file contains 35 local components. Only the exact 18 EventCard
  // namespace members belong to this package; the other 17 are protected.
  const components = fileLocalComponents.filter((component) => targetNames.has(component?.name));
  const otherComponents = fileLocalComponents.filter((component) => !targetNames.has(component?.name));
  const targetMainIds = new Set(components.map((component) => String(mainOf(component)?.id || '')));
  const pageRoots = children(page.root);
  const roots = pageRoots.filter((shape) => String(shape?.id || '') === M.COLLECTION_ID);
  const board = roots[0];
  const allShapes = walk(page.root);
  const protectedDigest = M.sha256({
    fileId: M.FILE_ID, pageId: M.PAGE_ID,
    shapes: allShapes.map(shapeProjection).map((shape) => targetMainIds.has(shape.id)
      ? { ...shape, name: undefined } : shape).sort((a, b) => a.id.localeCompare(b.id)),
    components: fileLocalComponents.map((component) => {
      const main = mainOf(component);
      // LibraryComponent.path is intentionally excluded: this is the path-only
      // repair's protected geometry/text/media/ID projection.
      const target = targetNames.has(component?.name);
      return { id: String(component?.id || ''), name: component?.name ?? null,
        mainId: String(main?.id || ''), mainName: target ? undefined : main?.name ?? null,
        path: target ? undefined : String(component?.path ?? '') };
    }).sort((a, b) => a.id.localeCompare(b.id)),
  });
  const protectedOtherComponentsDigest = M.sha256(otherComponents.map((component) => {
    const main = mainOf(component);
    return { id: String(component?.id || ''), name: component?.name ?? null,
      path: String(component?.path ?? ''), mainId: String(main?.id || ''), mainName: main?.name ?? null };
  }).sort((a, b) => a.id.localeCompare(b.id)));
  const visibleProductLabelsDigest = M.sha256(visibleLabelsProjection(page));
  const validation = penpot.currentFile.validate?.();
  const normalizedValidation = Array.isArray(validation) ? validation : validation == null ? [] : array(validation);
  const byId = new Map(components.map((item) => [String(item.id), item]));
  return {
    identity() {
      const revision = Number(penpot.currentFile.revn);
      if (!Number.isInteger(revision)) fail('PATHS_R3_CURRENT_REVN_REQUIRED');
      return { fileId: String(penpot.currentFile.id), pageId: String(penpot.currentPage.id), revision };
    },
    collection() {
      return {
        rootId: board ? String(board.id) : '', name: board?.name,
        roots: pageRoots.length, children: children(board).length, components: components.length,
        detached: 0, clones: 0, recreated: 0, validation: normalizedValidation,
        protectedDigest, visibleProductLabelsDigest,
        fileLocalComponents: fileLocalComponents.length,
        protectedOtherComponents: otherComponents.length,
        protectedOtherComponentsDigest,
      };
    },
    components() {
      return components.map((component) => {
        const main = mainOf(component);
        return { id: String(component.id), name: component.name, path: String(component.path ?? ''),
          main: { id: String(main?.id || ''), name: main?.name } };
      });
    },
    componentMainRelationship(componentId, mainId) {
      const component = byId.get(String(componentId)), main = mainOf(component);
      if (!component || String(main?.id || '') !== String(mainId)) return null;
      const reverse = linkedComponent(main);
      if (reverse && String(reverse.id || '') !== String(componentId)) return null;
      return { componentId: String(componentId), mainId: String(mainId), native: true };
    },
    links(mainId) {
      const parentComponent = components.find((component) => String(mainOf(component)?.id || '') === String(mainId));
      const main = mainOf(parentComponent);
      return children(main).filter((shape) => linkedComponent(shape)).map((shape) => ({
        id: String(shape.id), componentId: String(linkedComponent(shape).id),
        parentMainId: String(main.id), parentCaseComponentId: String(parentComponent.id),
      }));
    },
    get componentObjects() { return byId; },
    protectedDigest,
    visibleProductLabelsDigest,
    protectedOtherComponentsDigest,
  };
}

async function projectEventcardPathsPenpotR3(context, expectedState = 'any') {
  const page = await activateExactPage(context);
  const adapter = nativeAdapter(context, page);
  // The digest is always formed with state=any so the same fresh read-only
  // tuple can be carried unchanged into execute. expectedState is a gate, not
  // an input that changes the authorization digest.
  const projection = M.projectState(adapter, 'any');
  const baseline = M.canonical(projection.count) === M.canonical({ exact: 0, empty: 15, legacy: 3 });
  const terminal = M.canonical(projection.count) === M.canonical({ exact: 18, empty: 0, legacy: 0 });
  if (expectedState === 'baseline' && !baseline) fail('PATHS_R3_BASELINE_COUNTS_DRIFT');
  if (expectedState === 'terminal' && !terminal) fail('PATHS_R3_TERMINAL_COUNTS_DRIFT');
  return { ...projection, observedState: terminal ? 'terminal' : baseline ? 'baseline' : 'partial',
    currentPageActivated: true, concreteNativeProjection: true };
}

function assertAuthorizationEnvelope(context, authorization) {
  const expected = {
    schema: AUTH_SCHEMA, packageId: M.PACKAGE_ID, parentPackageId: M.PARENT_PACKAGE_ID,
    packageHead: context.exactPackageHead, packageTree: context.exactPackageTree,
    state: 'ACTIVE', authorized: true, cancelled: false,
    ownerDirective: OWNER_DIRECTIVE,
    authorityCardCommentId: AUTHORITY_CARD_COMMENT_ID,
    authorityScope: AUTHORITY_SCOPE,
  };
  if (!HEX40.test(String(context.exactPackageHead || '')) || !HEX40.test(String(context.exactPackageTree || ''))) {
    fail('PATHS_R3_PROVIDER_IDENTITY_MISSING');
  }
  for (const [key, value] of Object.entries(expected)) {
    if (authorization?.[key] !== value) fail(`PATHS_R3_AUTH_${key.toUpperCase()}_MISMATCH`);
  }
  if (!authorization.triggeredBy || typeof authorization.triggeredBy !== 'string') fail('PATHS_R3_TRIGGERED_BY_MISSING');
  const p = authorization.provenance;
  for (const key of ['sessionId', 'taskId', 'writerId', 'triggeredBy', 'cancelToken', 'leaseToken',
    'bundleSha256', 'bundleBytes', 'revision', 'projectionSha256']) {
    if (authorization[key] !== p?.[key]) fail(`PATHS_R3_AUTH_${key.toUpperCase()}_PROVENANCE_PARITY`);
  }
  for (const key of ['sessionId', 'taskId', 'writerId', 'cancelToken', 'leaseToken']) {
    if (!p || typeof p[key] !== 'string' || p[key].length < 8) fail(`PATHS_R3_PROVENANCE_${key.toUpperCase()}_INVALID`);
  }
  if (p.writerId !== SOLE_WRITER) fail('PATHS_R3_PROVENANCE_WRITERID_MISMATCH');
  for (const [key, value] of Object.entries({
    packageId: M.PACKAGE_ID, packageHead: context.exactPackageHead,
    packageTree: context.exactPackageTree, triggeredBy: authorization.triggeredBy,
    ownerDirective: OWNER_DIRECTIVE,
    authorityCardCommentId: AUTHORITY_CARD_COMMENT_ID,
    authorityScope: AUTHORITY_SCOPE, bundleSha256: context.exactBundleSha256, bundleBytes: context.exactBundleBytes,
    revision: authorization.revision, projectionSha256: authorization.projectionSha256,
  })) if (p[key] !== value) fail(`PATHS_R3_PROVENANCE_${key.toUpperCase()}_MISMATCH`);
  if (!Number.isFinite(Number(p.leaseExpiresAt))) fail('PATHS_R3_LEASE_EXPIRY_INVALID');
  return p;
}

function assertAuthorization(context, authorization, projection) {
  const provenance = assertAuthorizationEnvelope(context, authorization);
  if (authorization.revision !== projection.revision) fail('PATHS_R3_AUTH_REVISION_MISMATCH');
  if (authorization.projectionSha256 !== projection.projectionSha256) {
    fail('PATHS_R3_AUTH_PROJECTIONSHA256_MISMATCH');
  }
  return provenance;
}

function readPhysicalActive(context) {
  const raw = context.penpot.currentFile.getSharedPluginData?.(ACTIVE_NAMESPACE, ACTIVE_KEY);
  if (typeof raw !== 'string' || !raw) fail('PATHS_R3_PHYSICAL_ACTIVE_MISSING');
  try { return JSON.parse(raw); } catch { fail('PATHS_R3_PHYSICAL_ACTIVE_INVALID_JSON'); }
}

function assertPhysicalActive(context, authorization) {
  const p = authorization.provenance, marker = readPhysicalActive(context);
  const exact = {
    schema: ACTIVE_SCHEMA, state: 'ACTIVE', authorized: true, cancelled: false,
    sessionId: p.sessionId, taskId: p.taskId, writerId: p.writerId,
    packageId: M.PACKAGE_ID, packageHead: context.exactPackageHead,
    packageTree: context.exactPackageTree, triggeredBy: authorization.triggeredBy,
    ownerDirective: OWNER_DIRECTIVE,
    authorityCardCommentId: AUTHORITY_CARD_COMMENT_ID,
    authorityScope: AUTHORITY_SCOPE,
    cancelToken: p.cancelToken, leaseToken: p.leaseToken, leaseExpiresAt: p.leaseExpiresAt,
    bundleSha256: p.bundleSha256, bundleBytes: p.bundleBytes, revision: p.revision, projectionSha256: p.projectionSha256,
  };
  for (const [key, value] of Object.entries(exact)) {
    if (marker?.[key] !== value) fail(`PATHS_R3_PHYSICAL_ACTIVE_${key.toUpperCase()}_MISMATCH`);
  }
  if (Number(marker.leaseExpiresAt) <= nowMs(context)) fail('PATHS_R3_PHYSICAL_ACTIVE_LEASE_EXPIRED');
  return marker;
}

async function distinctUnknownReadback(context, cause, writes) {
  const error = cause instanceof M.LinkageStop ? cause : new M.LinkageStop('PATHS_R3_NATIVE_UNKNOWN_OUTCOME', true);
  error.unknownOutcome = true;
  error.retryAllowed = false;
  error.requiredNextOperation = 'DISTINCT_READ_ONLY_PROJECTION';
  error.nativeWritesBeforeStop = writes;
  try { error.distinctReadback = await projectEventcardPathsPenpotR3(context, 'any'); }
  catch (readError) { error.distinctReadbackError = readError.code || String(readError?.message || readError); }
  throw error;
}

async function writeReceiptMarker(context, authorization, receipt) {
  assertPhysicalActive(context, authorization);
  const value = M.stringOnly(M.canonical(receipt));
  const setter = context.penpot.currentFile.setSharedPluginData;
  if (typeof setter !== 'function') fail('PATHS_R3_RECEIPT_MARKER_API_MISSING');
  return setter.call(context.penpot.currentFile, ACTIVE_NAMESPACE, RECEIPT_KEY, value);
}

function readReceiptMarker(context) {
  return context.penpot.currentFile.getSharedPluginData?.(ACTIVE_NAMESPACE, RECEIPT_KEY) || '';
}

function exactRecoveryReceipt(context, authorization, projection) {
  return {
    schema: 'kenigevents.eventcard-paths-receipt-recovery.v5',
    state: 'PATHS_18_OF_18_PENDING_DISTINCT_READBACK',
    package_head: context.exactPackageHead,
    package_tree: context.exactPackageTree,
    bundle_sha256: context.exactBundleSha256,
    bundle_bytes: context.exactBundleBytes,
    native_revision: authorization.revision,
    projection_sha256: authorization.projectionSha256,
    component_ids: projection.componentIds,
    main_ids: projection.mainIds,
    linked_instance_ids: projection.linkedInstanceIds,
    path_mutations: 0,
    created: 0,
    native_setters: 0,
    recovered_prior_path_mutations: 18,
    native_automatic_main_layer_name_projections: 18,
    retry_allowed: false,
    terminal: true,
  };
}

function exactStoredReceipt(context, expected, required = false) {
  const raw = readReceiptMarker(context);
  if (!raw) {
    if (required) fail('PATHS_R3_NATIVE_SETTLEMENT_RECEIPT_REQUIRED');
    return null;
  }
  let stored;
  try { stored = JSON.parse(raw); } catch { fail('PATHS_R3_STORED_RECEIPT_INVALID_JSON'); }
  if (M.canonical(stored) !== M.canonical(expected)) fail('PATHS_R3_STORED_RECEIPT_TUPLE_MISMATCH');
  return stored;
}

async function executeEventcardPathsPenpotR3(context, authorization) {
  // Even current-page activation is run only under the exact physical lease.
  // The projection digest itself is then re-derived from that activated page.
  assertAuthorizationEnvelope(context, authorization);
  assertPhysicalActive(context, authorization);
  const page = await activateExactPage(context, authorization);
  const adapter = nativeAdapter(context, page);
  const fresh = M.projectState(adapter, 'any');
  assertAuthorization(context, authorization, fresh);
  assertPhysicalActive(context, authorization);

  const terminalAlready = fresh.count.exact === 18 && fresh.count.empty === 0 && fresh.count.legacy === 0;
  if (!terminalAlready) fail('PATHS_R3_RECEIPT_RECOVERY_REQUIRES_TERMINAL_18_OF_18');
  const automatic = fresh.components.filter((row) => row.nativeProjectedMainLayerName).length;
  if (automatic !== 18) fail('PATHS_R3_TERMINAL_MAIN_LAYER_NATIVE_PROJECTION_CENSUS');
  const recovered = exactRecoveryReceipt(context, authorization, fresh);
  if (exactStoredReceipt(context, recovered, false)) {
      return { schema: RUNTIME_SCHEMA, state: 'DONE', terminal: true, replayState: 'REPLAY_NOOP', created: 0, pathMutations: 0,
        secondRunCreated: 0, retryAllowed: false, terminalProjectionSha256: fresh.projectionSha256 };
  }
  await writeReceiptMarker(context, authorization, recovered);
  return recovered;
}

async function readEventcardPathsPenpotSettlementR3(context, receipt) {
  if (!receipt || receipt.state !== 'PATHS_18_OF_18_PENDING_DISTINCT_READBACK') {
    fail('PATHS_R3_NATIVE_SETTLEMENT_RECEIPT_REQUIRED');
  }
  const terminal = await projectEventcardPathsPenpotR3(context, 'terminal');
  exactStoredReceipt(context, receipt, true);
  if (M.canonical(terminal.componentIds) !== M.canonical(receipt.component_ids) ||
      M.canonical(terminal.mainIds) !== M.canonical(receipt.main_ids) ||
      M.canonical(terminal.linkedInstanceIds) !== M.canonical(receipt.linked_instance_ids)) {
    fail('PATHS_R3_NATIVE_SETTLEMENT_ID_DRIFT');
  }
    return { schema: RUNTIME_SCHEMA, state: 'PATHS_18_OF_18_LINKAGE_READBACK_PASS_PENDING_V0',
    exactCanonicalPaths: 18, componentIds: 18, mainIds: 18, linkedInstances: 26,
    nativeAutomaticMainLayerNameProjections: terminal.components.filter((row) => row.nativeProjectedMainLayerName).length,
    readbackMutations: 0, validation: [], visualPass: false, wholeEventcardPass: false };
}

module.exports = {
  ACTIVE_NAMESPACE, ACTIVE_KEY, RECEIPT_KEY, AUTH_SCHEMA, ACTIVE_SCHEMA, RUNTIME_SCHEMA,
  OWNER_DIRECTIVE, AUTHORITY_CARD_COMMENT_ID, AUTHORITY_SCOPE, SOLE_WRITER,
  projectEventcardPathsPenpotR3, executeEventcardPathsPenpotR3,
  readEventcardPathsPenpotSettlementR3, assertPhysicalActive,
};

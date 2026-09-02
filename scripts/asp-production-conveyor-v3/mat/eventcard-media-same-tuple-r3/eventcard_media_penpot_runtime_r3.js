'use strict';

/* Concrete package-local Penpot runtime. Inert until sole PUBLISH supplies a
 * fresh projection-bound authorization and matching physical ACTIVE lease. */
const M = require('./eventcard_media_same_tuple_r3.js');

const AUTH_SCHEMA = 'kenigevents.eventcard-media-penpot-authorization.r3';
const ACTIVE_SCHEMA = 'kenigevents.asp-physical-active-marker.v3';
const RUNTIME_SCHEMA = 'kenigevents.eventcard-media-penpot-runtime.r3';
const OWNER_DIRECTIVE = 'MORNING_PRODUCTION_SHIFT:EVENTCARD_MEDIA_AFTER_EXACT_AUTHORIZATION';
const AUTHORITY_CARD_COMMENT_ID = 5505976359;
const AUTHORITY_SCOPE = 'EVENTCARD_MEDIA_ONLY';
const NAMESPACE = 'kenigevents';
const ACTIVE_KEY = 'asp-physical-active-marker-v3';
const RECEIPT_KEY = 'eventcard-media-same-tuple-r3-receipt';
const HEX40 = /^[0-9a-f]{40}$/;
const HEX64 = /^[0-9a-f]{64}$/;

const array = (value) => Array.from(value || []);
const children = (shape) => array(shape?.children);
const nowMs = (context) => Number(typeof context.now === 'function' ? context.now() : Date.now());
const plugin = (shape, key) => String(shape?.getSharedPluginData?.(NAMESPACE, key) ||
  shape?.getPluginData?.(key) || '');
const fail = (code, unknown = false) => {
  const error = new M.MediaTupleStop(code, unknown);
  if (unknown) error.requiredNextOperation = 'DISTINCT_READ_ONLY_FOUR_TARGET_PROJECTION';
  throw error;
};

function walk(root) {
  const output = [], queue = root ? [root] : [];
  while (queue.length) { const item = queue.shift(); output.push(item); queue.push(...children(item)); }
  return output;
}

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

async function shaBytes(bytes) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('');
  }
  return require('node:crypto').createHash('sha256').update(data).digest('hex');
}

function findPage(file) {
  return array(file?.pages).filter((page) => String(page?.id || '') === M.PAGE_ID);
}

function readActive(context) {
  let raw = typeof context.readActiveMarker === 'function' ? context.readActiveMarker() :
    context.penpot.currentFile.getSharedPluginData?.(NAMESPACE, ACTIVE_KEY);
  if (raw && typeof raw === 'object') return raw;
  if (typeof raw !== 'string' || !raw) fail('MEDIA_R3_PHYSICAL_ACTIVE_MISSING');
  try { return JSON.parse(raw); } catch { fail('MEDIA_R3_PHYSICAL_ACTIVE_INVALID_JSON'); }
}

function authorizationEnvelope(context, authorization) {
  const profile = context.pageProfile;
  if (!profile || profile.profileId !== 'free-collection.owner-review.v1' ||
      profile.state !== 'BLOCKED_OWNER_REJECTED' || profile.allowedToMutatePenpot !== false ||
      !HEX64.test(String(profile.profileSha256 || ''))) fail('MEDIA_R3_EXPECTED_OWNER_REJECTED_PROFILE_TUPLE_DRIFT');
  if (!HEX40.test(String(context.exactPackageHead || '')) || !HEX40.test(String(context.exactPackageTree || ''))) {
    fail('MEDIA_R3_PROVIDER_IDENTITY_MISSING');
  }
  const expected = {
    schema: AUTH_SCHEMA, packageId: M.PACKAGE_ID, parentPackageId: M.PARENT_PACKAGE_ID,
    packageHead: context.exactPackageHead, packageTree: context.exactPackageTree,
    state: 'ACTIVE', authorized: true, cancelled: false,
    sourceRegistrySha256: M.sourceRegistrySha256(), pageProfileSha256: profile.profileSha256,
    ownerDirective: OWNER_DIRECTIVE, authorityCardCommentId: AUTHORITY_CARD_COMMENT_ID,
    authorityScope: AUTHORITY_SCOPE,
  };
  for (const [key, value] of Object.entries(expected)) {
    if (authorization?.[key] !== value) fail(`MEDIA_R3_AUTH_${key.toUpperCase()}_MISMATCH`);
  }
  const p = authorization.provenance;
  for (const key of ['sessionId', 'taskId', 'writerId', 'leaseToken']) {
    if (!p || typeof p[key] !== 'string' || p[key].length < 8) fail(`MEDIA_R3_PROVENANCE_${key.toUpperCase()}_INVALID`);
  }
  const bound = { packageId: M.PACKAGE_ID, packageHead: context.exactPackageHead,
    packageTree: context.exactPackageTree, triggeredBy: authorization.triggeredBy,
    pageProfileSha256: profile.profileSha256, ownerDirective: OWNER_DIRECTIVE,
    authorityCardCommentId: AUTHORITY_CARD_COMMENT_ID, authorityScope: AUTHORITY_SCOPE };
  if (typeof authorization.triggeredBy !== 'string' || !authorization.triggeredBy) fail('MEDIA_R3_TRIGGERED_BY_MISSING');
  for (const [key, value] of Object.entries(bound)) if (p[key] !== value) fail(`MEDIA_R3_PROVENANCE_${key.toUpperCase()}_MISMATCH`);
  if (!Number.isFinite(Number(p.leaseExpiresAt))) fail('MEDIA_R3_LEASE_EXPIRY_INVALID');
  return p;
}

function assertActive(context, authorization) {
  const p = authorization.provenance, marker = readActive(context);
  const expected = { schema: ACTIVE_SCHEMA, state: 'ACTIVE', authorized: true, cancelled: false,
    sessionId: p.sessionId, taskId: p.taskId, writerId: p.writerId,
    packageId: M.PACKAGE_ID, packageHead: context.exactPackageHead, packageTree: context.exactPackageTree,
    triggeredBy: authorization.triggeredBy, pageProfileSha256: context.pageProfile.profileSha256,
    ownerDirective: OWNER_DIRECTIVE, authorityCardCommentId: AUTHORITY_CARD_COMMENT_ID,
    authorityScope: AUTHORITY_SCOPE, leaseToken: p.leaseToken, leaseExpiresAt: p.leaseExpiresAt };
  for (const [key, value] of Object.entries(expected)) {
    if (marker?.[key] !== value) fail(`MEDIA_R3_PHYSICAL_ACTIVE_${key.toUpperCase()}_MISMATCH`);
  }
  if (Number(marker.leaseExpiresAt) <= nowMs(context)) fail('MEDIA_R3_PHYSICAL_ACTIVE_LEASE_EXPIRED');
  return marker;
}

async function activatePage(context, authorization = null) {
  const penpot = context.penpot;
  if (!penpot?.currentFile || String(penpot.currentFile.id || '') !== M.FILE_ID) fail('MEDIA_R3_FILE_MISMATCH');
  const pages = findPage(penpot.currentFile);
  if (pages.length !== 1) fail('MEDIA_R3_PAGE_CARDINALITY');
  if (String(penpot.currentPage?.id || '') !== M.PAGE_ID) {
    if (authorization) assertActive(context, authorization);
    if (typeof penpot.openPage !== 'function') fail('MEDIA_R3_OPEN_PAGE_UNAVAILABLE');
    await penpot.openPage(pages[0]);
    if (typeof context.settle === 'function') { if (authorization) assertActive(context, authorization); await context.settle(); }
  }
  if (String(penpot.currentPage?.id || '') !== M.PAGE_ID) fail('MEDIA_R3_CURRENT_PAGE_ACTIVATION_FAILED');
  return pages[0];
}

function imageFromFill(shape) {
  const fills = array(shape?.fills);
  const candidates = fills.map((fill) => fill?.fillImage).filter((image) => image && typeof image === 'object');
  if (candidates.length !== 1) fail('MEDIA_R3_NATIVE_FILL_IMAGE_CARDINALITY');
  return { image: candidates[0], fills };
}

async function imageReadback(image) {
  if (!image || typeof image.data !== 'function') fail('MEDIA_R3_NATIVE_IMAGEDATA_DATA_UNAVAILABLE');
  const raw = await image.data();
  const bytes = raw instanceof Uint8Array ? raw : new Uint8Array(raw);
  return { bytes: bytes.byteLength, sha256: await shaBytes(bytes) };
}

async function sourceBytes(context, asset) {
  const raw = typeof context.sourceAssetBytes === 'function' ? await context.sourceAssetBytes(asset.sha256) :
    context.sourceAssets?.[asset.sha256];
  if (!raw) fail('MEDIA_R3_PACKAGED_SOURCE_BYTES_MISSING');
  const bytes = raw instanceof Uint8Array ? raw : new Uint8Array(raw);
  if (bytes.byteLength !== asset.bytes || await shaBytes(bytes) !== asset.sha256) fail('MEDIA_R3_PACKAGED_SOURCE_BYTES_MISMATCH');
  return bytes;
}

function staticFitFocal(shape, asset) {
  const nativeFit = plugin(shape, 'kenigevents-eventcard-media-fit');
  const nativeFocal = plugin(shape, 'kenigevents-eventcard-media-focal');
  if (nativeFit && nativeFit !== asset.fit) fail('MEDIA_R3_NATIVE_FIT_EVIDENCE_CONFLICT');
  if (nativeFocal && nativeFocal !== asset.acceptedFocal) fail('MEDIA_R3_NATIVE_FOCAL_EVIDENCE_CONFLICT');
  return { fit: nativeFit || asset.fit, focal: nativeFocal || asset.acceptedFocal,
    authority: nativeFit && nativeFocal ? 'native-plugin-evidence' : 'accepted-static-case-binding' };
}

function shapeCore(shape, targetIds) {
  const target = targetIds.has(String(shape?.id || ''));
  return { id: String(shape?.id || ''), parentId: shape?.parent?.id == null ? null : String(shape.parent.id),
    name: shape?.name ?? null, type: shape?.type ?? null, x: shape?.x ?? null, y: shape?.y ?? null,
    width: shape?.width ?? null, height: shape?.height ?? null, rotation: shape?.rotation ?? null,
    flipX: shape?.flipX ?? null, flipY: shape?.flipY ?? null, characters: shape?.characters ?? null,
    fills: target ? undefined : jsonValue(shape?.fills ?? []), strokes: jsonValue(shape?.strokes ?? []),
    children: children(shape).map((item) => String(item.id)) };
}

async function buildNativeAdapter(context, page) {
  const penpot = context.penpot, all = walk(page.root), byId = new Map(all.map((shape) => [String(shape.id), shape]));
  const targetIds = new Set(M.CASES.map((spec) => spec.mediaShapeId));
  const roots = children(page.root).filter((shape) => String(shape.id) === M.COLLECTION_ID);
  const board = roots[0];
  const rows = new Map(), sourceMap = new Map();
  for (const spec of M.CASES) {
    const asset = M.SOURCE_ASSETS[spec.fixtureId], shape = byId.get(spec.mediaShapeId);
    const root = byId.get(spec.rootId), ancestorIds = new Set();
    for (let node = shape?.parent; node; node = node.parent) ancestorIds.add(String(node.id || ''));
    if (!shape || String(shape.parent?.id || '') !== spec.parentGroupId || !root ||
        String(root.parent?.id || '') !== M.COLLECTION_ID || !ancestorIds.has(spec.rootId)) {
      fail('MEDIA_R3_NATIVE_ROOT_MEDIA_PARENT_ID_DRIFT');
    }
    const { image, fills } = imageFromFill(shape), data = await imageReadback(image), semantics = staticFitFocal(shape, asset);
    const semanticSlot = plugin(shape, 'kenigevents-eventcard-media-semantic-slot') || M.SEMANTIC_SLOT;
    rows.set(spec.mediaShapeId, { id: String(shape.id), rootId: spec.rootId, parentId: String(shape.parent.id),
      local: { x: Number(shape.x), y: Number(shape.y) },
      parent: { x: Number(shape.parent.x), y: Number(shape.parent.y) },
      bounds: { x: Number(shape.x), y: Number(shape.y), width: Number(shape.width), height: Number(shape.height) },
      fills: fills.map((fill) => ({ ...jsonValue(fill), fillImage: { id: String(image.id), name: image.name,
        width: image.width, height: image.height, mtype: image.mtype ?? image.mimeType } })),
      imageData: { id: String(image.id), name: String(image.name), width: image.width, height: image.height,
        mtype: image.mtype ?? image.mimeType },
      transform: Object.prototype.hasOwnProperty.call(shape, 'transform') ? jsonValue(shape.transform) : null,
      rotation: Number(shape.rotation ?? 0), flipX: Boolean(shape.flipX), flipY: Boolean(shape.flipY),
      fit: semantics.fit, focal: semantics.focal, fitFocalAuthority: semantics.authority,
      semanticSlot, nativeImageDataReadback: data,
      sourceEvidence: { sha256: plugin(shape, 'kenigevents-eventcard-media-source-sha256'),
        bytes: plugin(shape, 'kenigevents-eventcard-media-source-bytes'),
        path: plugin(shape, 'kenigevents-eventcard-media-source-path'), semanticSlot },
    });
    sourceMap.set(asset.sourceAssetPath, { sha256: asset.sha256, bytes: asset.bytes, mimeType: asset.mimeType });
  }
  const localComponents = array(penpot.library?.local?.components);
  const eventcardComponents = localComponents.filter((component) => /^(event\.|eventcard\.)/.test(String(component?.name || '')));
  const protectedDigest = M.sha256({
    fileId: M.FILE_ID, pageId: M.PAGE_ID,
    shapes: all.map((shape) => shapeCore(shape, targetIds)).sort((a, b) => a.id.localeCompare(b.id)),
    components: localComponents.map((component) => ({ id: String(component.id), name: component.name,
      path: String(component.path ?? ''), mainId: String((typeof component.mainInstance === 'function' ? component.mainInstance() : component.mainInstance)?.id || '')
    })).sort((a, b) => a.id.localeCompare(b.id)),
  });
  const validation = penpot.currentFile.validate?.();
  const normalized = Array.isArray(validation) ? validation : validation == null ? [] : array(validation);
  return {
    identity: () => ({ fileId: String(penpot.currentFile.id), pageId: String(penpot.currentPage.id),
      revision: Number(penpot.currentFile.revn ?? penpot.currentFile.revision) }),
    collection: () => ({ rootId: board ? String(board.id) : '', children: children(board).length,
      components: eventcardComponents.length, validation: normalized, protectedDigest,
      fileLocalComponents: localComponents.length }),
    media: (id) => rows.has(id) ? [structuredClone(rows.get(id))] : [],
    asset: (path) => sourceMap.get(path) || null,
    rows, shapes: byId, protectedDigest,
  };
}

async function projectEventcardMediaPenpotR3(context, authorization = null) {
  const page = await activatePage(context, authorization);
  const adapter = await buildNativeAdapter(context, page);
  const projection = M.projectEventcardMediaSameTupleR3(adapter);
  return { ...projection, currentPageActivated: true, concreteNativeProjection: true,
    fileLocalComponents: adapter.collection().fileLocalComponents };
}

function assertProjectionAuthorization(context, authorization, projection) {
  authorizationEnvelope(context, authorization);
  if (authorization.revision !== projection.revision) fail('MEDIA_R3_AUTH_REVISION_MISMATCH');
  if (authorization.projectionSha256 !== projection.projectionSha256) fail('MEDIA_R3_AUTH_PROJECTIONSHA256_MISMATCH');
}

function immutable(row) {
  return { caseId: row.caseId, rootId: row.rootId, mediaShapeId: row.mediaShapeId,
    parentGroupId: row.parentGroupId, localCoordinates: row.localCoordinates,
    parentCoordinates: row.parentCoordinates, bounds: row.bounds, transform: row.transform,
    rotation: row.rotation, horizontalFlip: row.horizontalFlip, verticalFlip: row.verticalFlip,
    fit: row.fit, focal: row.focal };
}

async function setEvidence(context, authorization, shape, key, value) {
  assertActive(context, authorization);
  const text = M.stringOnly(value);
  if (typeof shape.setSharedPluginData === 'function') return shape.setSharedPluginData(NAMESPACE, key, text);
  if (typeof shape.setPluginData === 'function') return shape.setPluginData(key, text);
  fail('MEDIA_R3_NATIVE_EVIDENCE_API_MISSING');
}

async function distinctUnknown(context, error, calls) {
  const stop = error instanceof M.MediaTupleStop ? error : new M.MediaTupleStop('MEDIA_R3_NATIVE_UNKNOWN_OUTCOME', true);
  stop.unknownOutcome = true; stop.retryAllowed = false;
  stop.requiredNextOperation = 'DISTINCT_READ_ONLY_FOUR_TARGET_PROJECTION'; stop.nativeMutationCallsBeforeStop = calls;
  try { stop.distinctReadback = await projectEventcardMediaPenpotR3(context); }
  catch (readError) { stop.distinctReadbackError = readError.code || String(readError?.message || readError); }
  throw stop;
}

function receiptValue(context) {
  const raw = context.penpot.currentFile.getSharedPluginData?.(NAMESPACE, RECEIPT_KEY) || '';
  if (!raw) return null;
  if (typeof raw !== 'string') fail('MEDIA_R3_DURABLE_RECEIPT_NOT_STRING');
  try {
    const value = JSON.parse(raw);
    if (value.schema !== 'kenigevents.eventcard-media-penpot-execution-receipt.r3' ||
        value.packageId !== M.PACKAGE_ID || value.packageHead !== context.exactPackageHead ||
        value.packageTree !== context.exactPackageTree || value.state !== 'MEDIA_FOUR_OF_FOUR_PENDING_DISTINCT_READBACK') {
      fail('MEDIA_R3_DURABLE_RECEIPT_TUPLE_DRIFT');
    }
    return value;
  } catch (error) {
    if (error instanceof M.MediaTupleStop) throw error;
    fail('MEDIA_R3_DURABLE_RECEIPT_INVALID_JSON');
  }
}

async function executeEventcardMediaPenpotR3(context, authorization) {
  authorizationEnvelope(context, authorization); assertActive(context, authorization);
  // Settlement evidence is part of the executable contract, not an optional
  // afterthought. Prove its native capability before the first upload/write.
  if (typeof context.readNativeCoverage !== 'function') fail('MEDIA_R3_NATIVE_COVERAGE_READBACK_UNAVAILABLE');
  const before = await projectEventcardMediaPenpotR3(context, authorization);
  assertProjectionAuthorization(context, authorization, before); assertActive(context, authorization);
  const already = before.rows.every((row) => {
    const asset = M.SOURCE_ASSETS[row.fixtureId], evidence = row.existingSourceEvidence || {};
    return row.nativeImageDataReadback?.sha256 === asset.sha256 && row.nativeImageDataReadback?.bytes === asset.bytes &&
      evidence.sha256 === asset.sha256 && evidence.bytes === String(asset.bytes) &&
      evidence.path === asset.sourceAssetPath && evidence.semanticSlot === M.SEMANTIC_SLOT;
  });
  if (already) {
    if (!receiptValue(context)) fail('MEDIA_R3_TERMINAL_WITHOUT_DURABLE_RECEIPT');
    return { schema: RUNTIME_SCHEMA, state: 'REPLAY_NOOP', created: 0, mediaMutations: 0, secondRunCreated: 0 };
  }
  const beforeImmutable = before.rows.map(immutable), beforeProtected = before.protectedCollectionDigest;
  let nativeCalls = 0;
  try {
    for (const row of before.rows) {
      const asset = M.SOURCE_ASSETS[row.fixtureId], bytes = await sourceBytes(context, asset);
      const page = context.penpot.currentPage, shape = walk(page.root).find((item) => String(item.id) === row.mediaShapeId);
      assertActive(context, authorization);
      const uploaded = await context.penpot.uploadMediaData(asset.sourceAssetPath.split('/').at(-1), bytes, asset.mimeType);
      nativeCalls += 1;
      assertActive(context, authorization);
      const uploadedReadback = await imageReadback(uploaded);
      if (uploadedReadback.sha256 !== asset.sha256 || uploadedReadback.bytes !== asset.bytes) fail('MEDIA_R3_UPLOADED_IMAGEDATA_BYTES_MISMATCH');
      const current = imageFromFill(shape).fills;
      const nextFills = current.map((fill, index) => index === 0 ? { ...fill, fillImage: uploaded, fillOpacity: 1 } : fill);
      assertActive(context, authorization);
      shape.fills = nextFills;
      nativeCalls += 1;
      for (const [key, value] of [
        ['kenigevents-eventcard-media-source-sha256', asset.sha256],
        ['kenigevents-eventcard-media-source-bytes', String(asset.bytes)],
        ['kenigevents-eventcard-media-source-path', asset.sourceAssetPath],
        ['kenigevents-eventcard-media-semantic-slot', M.SEMANTIC_SLOT],
      ]) { await setEvidence(context, authorization, shape, key, value); nativeCalls += 1; }
    }
    const after = await projectEventcardMediaPenpotR3(context, authorization);
    if (M.canonical(after.rows.map(immutable)) !== M.canonical(beforeImmutable) ||
        after.protectedCollectionDigest !== beforeProtected) fail('MEDIA_R3_NATIVE_NON_FILL_OR_PROTECTED_DRIFT');
    for (const row of after.rows) {
      const asset = M.SOURCE_ASSETS[row.fixtureId], evidence = row.existingSourceEvidence || {};
      if (row.nativeImageDataReadback?.sha256 !== asset.sha256 || row.nativeImageDataReadback?.bytes !== asset.bytes ||
          evidence.sha256 !== asset.sha256 || evidence.bytes !== String(asset.bytes) ||
          evidence.path !== asset.sourceAssetPath || evidence.semanticSlot !== M.SEMANTIC_SLOT) {
        fail('MEDIA_R3_NATIVE_SOURCE_EVIDENCE_READBACK_DRIFT');
      }
    }
    const receipt = { schema: 'kenigevents.eventcard-media-penpot-execution-receipt.r3', packageId: M.PACKAGE_ID,
      packageHead: context.exactPackageHead, packageTree: context.exactPackageTree,
      state: 'MEDIA_FOUR_OF_FOUR_PENDING_DISTINCT_READBACK', revision: authorization.revision,
      authorizedProjectionSha256: authorization.projectionSha256, sourceRegistrySha256: M.sourceRegistrySha256(),
      rootIds: after.rows.map((row) => row.rootId), mediaShapeIds: after.rows.map((row) => row.mediaShapeId),
      parentGroupIds: after.rows.map((row) => row.parentGroupId), nativeMutationCalls: nativeCalls,
      mediaFillMutations: 4, evidenceMutations: 16, textMutations: 0, componentPathMutations: 0,
      geometryMutations: 0, overlayMutations: 0, retryAllowed: false };
    assertActive(context, authorization);
    context.penpot.currentFile.setSharedPluginData(NAMESPACE, RECEIPT_KEY, M.stringOnly(M.canonical(receipt)));
    nativeCalls += 1;
    return receipt;
  } catch (error) {
    if (nativeCalls > 0 || error?.unknownOutcome) return distinctUnknown(context, error, nativeCalls);
    throw error;
  }
}

async function readEventcardMediaPenpotSettlementR3(context, receipt) {
  if (!receipt || receipt.state !== 'MEDIA_FOUR_OF_FOUR_PENDING_DISTINCT_READBACK' || !receiptValue(context)) {
    fail('MEDIA_R3_NATIVE_SETTLEMENT_RECEIPT_REQUIRED');
  }
  const projection = await projectEventcardMediaPenpotR3(context);
  for (const row of projection.rows) {
    const asset = M.SOURCE_ASSETS[row.fixtureId];
    if (row.nativeImageDataReadback?.sha256 !== asset.sha256 || row.nativeImageDataReadback?.bytes !== asset.bytes) {
      fail('MEDIA_R3_SETTLEMENT_IMAGEDATA_BYTES_FAIL');
    }
    if (typeof context.readNativeCoverage !== 'function') fail('MEDIA_R3_NATIVE_COVERAGE_READBACK_UNAVAILABLE');
    const coverage = await context.readNativeCoverage(row.mediaShapeId, row.rootId);
    if (!coverage || coverage.status !== 'KNOWN_PASS' || coverage.uncoveredPixels !== 0 ||
        coverage.opaqueOverlays !== 0 || coverage.sourceSha256 !== asset.sha256) fail('MEDIA_R3_SETTLEMENT_COVERAGE_FAIL');
  }
  return { schema: RUNTIME_SCHEMA, state: 'MEDIA_FOUR_OF_FOUR_READBACK_PASS_PENDING_V0', rows: 4,
    readbackMutations: 0, validation: [], visualPass: false, wholeEventcardPass: false };
}

module.exports = { AUTH_SCHEMA, ACTIVE_SCHEMA, RUNTIME_SCHEMA, OWNER_DIRECTIVE,
  AUTHORITY_CARD_COMMENT_ID, AUTHORITY_SCOPE, NAMESPACE, ACTIVE_KEY, RECEIPT_KEY,
  shaBytes, projectEventcardMediaPenpotR3, executeEventcardMediaPenpotR3,
  readEventcardMediaPenpotSettlementR3, assertActive };

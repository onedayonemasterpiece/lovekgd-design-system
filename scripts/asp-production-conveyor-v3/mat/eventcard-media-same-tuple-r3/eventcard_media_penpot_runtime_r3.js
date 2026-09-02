'use strict';

/* Concrete package-local Penpot runtime. Inert until sole PUBLISH supplies a
 * fresh projection-bound authorization and matching physical ACTIVE lease. */
const M = require('./eventcard_media_same_tuple_r3.js');

const AUTH_SCHEMA = 'kenigevents.eventcard-media-penpot-authorization.r3';
const ACTIVE_SCHEMA = 'kenigevents.asp-run-control.v1';
const RUNTIME_SCHEMA = 'kenigevents.eventcard-media-penpot-runtime.r3';
const OWNER_DIRECTIVE = 'D0_CONTINUOUS_PRODUCTION_SHIFT_V3:EVENTCARD_MEDIA_PHASED_EXACT_AUTHORIZATION';
const AUTHORITY_CARD_COMMENT_ID = 5514360206;
const AUTHORITY_SCOPE = 'D0_CONTINUOUS_SHIFT_ACTIVE:EVENTCARD_MEDIA_PHASED_RECOVERY_ONLY';
const SOLE_WRITER = '/root/publish_r2';
const NAMESPACE = 'kenigevents';
const ACTIVE_KEY = 'asp-active-run-v1';
const RECEIPT_KEY = 'eventcard-media-same-tuple-r3-receipt';
const PROGRESS_KEY = 'eventcard-media-same-tuple-r3-progress';
const HEX40 = /^[0-9a-f]{40}$/;
const HEX64 = /^[0-9a-f]{64}$/;

const array = (value) => Array.from(value || []);
const children = (shape) => array(shape?.children);
const nowMs = () => Date.now();
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

function plainDataClone(value) {
  if (Array.isArray(value)) return value.map(plainDataClone);
  if (value && typeof value === 'object') { const out = {}; for (const key of Object.keys(value)) out[key] = plainDataClone(value[key]); return out; }
  return value;
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
  const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const bitLength=data.length*8,paddedLength=(((data.length+9+63)>>6)<<6),msg=new Uint8Array(paddedLength);
  msg.set(data);msg[data.length]=0x80;const view=new DataView(msg.buffer);view.setUint32(paddedLength-8,Math.floor(bitLength/0x100000000),false);view.setUint32(paddedLength-4,bitLength>>>0,false);
  let h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a,h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19;
  const rotr=(x,n)=>(x>>>n)|(x<<(32-n));
  for(let off=0;off<msg.length;off+=64){const w=new Uint32Array(64);for(let i=0;i<16;i+=1)w[i]=view.getUint32(off+i*4,false);for(let i=16;i<64;i+=1){const a=w[i-15],b=w[i-2];w[i]=(w[i-16]+(rotr(a,7)^rotr(a,18)^(a>>>3))+w[i-7]+(rotr(b,17)^rotr(b,19)^(b>>>10)))>>>0;}let a=h0,b=h1,c=h2,d=h3,e=h4,f=h5,g=h6,h=h7;for(let i=0;i<64;i+=1){const t1=(h+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[i]+w[i])>>>0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b)^(a&c)^(b&c)))>>>0;h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+c)>>>0;h3=(h3+d)>>>0;h4=(h4+e)>>>0;h5=(h5+f)>>>0;h6=(h6+g)>>>0;h7=(h7+h)>>>0;}
  return [h0,h1,h2,h3,h4,h5,h6,h7].map((value)=>value.toString(16).padStart(8,'0')).join('');
}

function findPage(file) {
  return array(file?.pages).filter((page) => String(page?.id || '') === M.PAGE_ID);
}

function readActive(context) {
  const raw = context.penpot.currentFile.getSharedPluginData?.(NAMESPACE, ACTIVE_KEY);
  if (raw && typeof raw === 'object') return raw;
  if (typeof raw !== 'string' || !raw) fail('MEDIA_R3_PHYSICAL_ACTIVE_MISSING');
  try { return JSON.parse(raw); } catch { fail('MEDIA_R3_PHYSICAL_ACTIVE_INVALID_JSON'); }
}

function authorizationEnvelope(context, authorization) {
  if (!HEX40.test(String(context.exactPackageHead || '')) || !HEX40.test(String(context.exactPackageTree || ''))) {
    fail('MEDIA_R3_PROVIDER_IDENTITY_MISSING');
  }
  const expected = {
    schema: AUTH_SCHEMA, packageId: M.PACKAGE_ID, parentPackageId: M.PARENT_PACKAGE_ID,
    packageHead: context.exactPackageHead, packageTree: context.exactPackageTree,
    state: 'ACTIVE', authorized: true, cancelled: false,
    sourceRegistrySha256: M.sourceRegistrySha256(),
    ownerDirective: OWNER_DIRECTIVE, authorityCardCommentId: AUTHORITY_CARD_COMMENT_ID,
    authorityScope: AUTHORITY_SCOPE,
  };
  for (const [key, value] of Object.entries(expected)) {
    if (authorization?.[key] !== value) fail(`MEDIA_R3_AUTH_${key.toUpperCase()}_MISMATCH`);
  }
  const p = authorization.provenance;
  for (const key of ['sessionId', 'taskId', 'writerId', 'operationId', 'cancelToken', 'leaseToken']) {
    if (!p || typeof p[key] !== 'string' || p[key].length < 8) fail(`MEDIA_R3_PROVENANCE_${key.toUpperCase()}_INVALID`);
  }
  const bound = { packageId: M.PACKAGE_ID, packageHead: context.exactPackageHead,
    packageTree: context.exactPackageTree, triggeredBy: authorization.triggeredBy,
    ownerDirective: OWNER_DIRECTIVE,
    authorityCardCommentId: AUTHORITY_CARD_COMMENT_ID, authorityScope: AUTHORITY_SCOPE,
    bundleSha256: context.exactBundleSha256, bundleBytes: context.exactBundleBytes,
    operationId: authorization.operationId,
    revision: authorization.revision, projectionSha256: authorization.projectionSha256,
    previousPhaseReceiptSha256: authorization.previousPhaseReceiptSha256 };
  if (typeof authorization.triggeredBy !== 'string' || !authorization.triggeredBy) fail('MEDIA_R3_TRIGGERED_BY_MISSING');
  for (const key of ['sessionId', 'taskId', 'writerId', 'triggeredBy', 'cancelToken', 'leaseToken',
    'operationId', 'bundleSha256', 'bundleBytes', 'revision', 'projectionSha256',
    'previousPhaseReceiptSha256']) {
    if (authorization[key] !== p[key]) fail(`MEDIA_R3_AUTH_${key.toUpperCase()}_PROVENANCE_PARITY`);
  }
  for (const [key, value] of Object.entries(bound)) if (p[key] !== value) fail(`MEDIA_R3_PROVENANCE_${key.toUpperCase()}_MISMATCH`);
  if (p.writerId !== SOLE_WRITER) fail('MEDIA_R3_PROVENANCE_WRITERID_MISMATCH');
  if (!Number.isFinite(Number(p.leaseExpiresAt))) fail('MEDIA_R3_LEASE_EXPIRY_INVALID');
  if (authorization.previousPhaseReceiptSha256 !== null &&
      !HEX64.test(String(authorization.previousPhaseReceiptSha256 || ''))) {
    fail('MEDIA_R3_PREVIOUS_PHASE_RECEIPT_SHA256_INVALID');
  }
  return p;
}

function assertActive(context, authorization) {
  const p = authorization.provenance, marker = readActive(context);
  const expected = { schema: ACTIVE_SCHEMA, state: 'ACTIVE', authorized: true, cancelled: false,
    sessionId: p.sessionId, taskId: p.taskId, writerId: p.writerId,
    packageId: M.PACKAGE_ID, packageHead: context.exactPackageHead, packageTree: context.exactPackageTree,
    triggeredBy: authorization.triggeredBy,
    ownerDirective: OWNER_DIRECTIVE, authorityCardCommentId: AUTHORITY_CARD_COMMENT_ID,
    authorityScope: AUTHORITY_SCOPE, cancelToken: p.cancelToken, leaseToken: p.leaseToken,
    leaseExpiresAt: p.leaseExpiresAt, bundleSha256: p.bundleSha256, bundleBytes: p.bundleBytes,
    operationId: p.operationId, revision: p.revision, projectionSha256: p.projectionSha256,
    previousPhaseReceiptSha256: p.previousPhaseReceiptSha256 };
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

function intersects(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
    a.y < b.y + b.height && a.y + a.height > b.y;
}

function opaqueImplementation(shape) {
  if (!shape || shape.hidden === true || shape.visible === false || Number(shape.opacity ?? 1) <= 0) return false;
  return array(shape.fills).some((fill) => fill && Number(fill.fillOpacity ?? 1) > 0 &&
    (fill.fillImage || (typeof fill.fillColor === 'string' && fill.fillColor.length > 0)));
}

async function nativeCoverageProof(context, mediaShapeId, rootId) {
  const spec = M.CASES.find((row) => row.mediaShapeId === String(mediaShapeId) && row.rootId === String(rootId));
  if (!spec) fail('MEDIA_R3_NATIVE_COVERAGE_TARGET_UNKNOWN');
  const page = await activatePage(context);
  const all = walk(page.root), shape = all.find((item) => String(item.id) === spec.mediaShapeId);
  const root = all.find((item) => String(item.id) === spec.rootId);
  if (!shape || !root || String(shape.parent?.id || '') !== spec.parentGroupId) {
    fail('MEDIA_R3_NATIVE_COVERAGE_TARGET_RELATIONSHIP_DRIFT');
  }
  const asset = M.SOURCE_ASSETS[spec.fixtureId], fill = imageFromFill(shape);
  const source = await imageReadback(fill.image);
  const width = Number(shape.width), height = Number(shape.height);
  if (!(width > 0 && height > 0 && fill.image.width > 0 && fill.image.height > 0)) {
    fail('MEDIA_R3_NATIVE_COVERAGE_DIMENSIONS_INVALID');
  }
  const semantics = staticFitFocal(shape, asset), shapeAspect = width / height;
  const imageAspect = Number(fill.image.width) / Number(fill.image.height);
  const aspectDelta = Math.abs(shapeAspect - imageAspect);
  // A cover fill necessarily covers the shape. A contain fill does so only
  // when source and shape aspect ratios match (the two 8006 cases do).
  const uncoveredPixels = semantics.fit === 'cover' || aspectDelta <= 0.002 ? 0 :
    Math.max(1, Math.round(width * height * Math.min(1, aspectDelta / Math.max(shapeAspect, imageAspect))));
  const siblings = children(shape.parent), index = siblings.findIndex((item) => String(item.id) === spec.mediaShapeId);
  const bounds = { x: Number(shape.x), y: Number(shape.y), width, height };
  const opaqueOverlays = siblings.slice(index + 1).filter((item) => opaqueImplementation(item) &&
    intersects(bounds, { x: Number(item.x), y: Number(item.y), width: Number(item.width), height: Number(item.height) })).length;
  return { status: uncoveredPixels === 0 && opaqueOverlays === 0 ? 'KNOWN_PASS' : 'KNOWN_FAIL',
    uncoveredPixels, opaqueOverlays, sourceSha256: source.sha256, sourceBytes: source.bytes,
    fit: semantics.fit, focal: semantics.focal, shapeAspect, imageAspect,
    proof: 'NATIVE_FILL_IMAGEDATA_GEOMETRY_AND_Z_ORDER_V1' };
}

async function sourceBytes(context, asset) {
  const raw = context.sourceAssets?.[asset.sha256];
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
    identity: () => {
      const revision = Number(penpot.currentFile.revn);
      if (!Number.isInteger(revision)) fail('MEDIA_R3_CURRENT_REVN_REQUIRED');
      return { fileId: String(penpot.currentFile.id), pageId: String(penpot.currentPage.id), revision };
    },
    collection: () => ({ rootId: board ? String(board.id) : '', children: children(board).length,
      components: eventcardComponents.length, validation: normalized, protectedDigest,
      fileLocalComponents: localComponents.length }),
    media: (id) => rows.has(id) ? [plainDataClone(rows.get(id))] : [],
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

function immutableOperationIdentity(context, authorization) {
  return {
    packageId: M.PACKAGE_ID, packageHead: context.exactPackageHead, packageTree: context.exactPackageTree,
    bundleSha256: context.exactBundleSha256, bundleBytes: context.exactBundleBytes,
    sourceRegistrySha256: M.sourceRegistrySha256(), authorityCardCommentId: AUTHORITY_CARD_COMMENT_ID,
    authorityScope: AUTHORITY_SCOPE, writerId: SOLE_WRITER, operationId: authorization.operationId,
  };
}

function phaseAuthorizationTuple(context, authorization) {
  return { ...immutableOperationIdentity(context, authorization),
    authorizedRevision: authorization.revision,
    authorizedProjectionSha256: authorization.projectionSha256,
    previousPhaseReceiptSha256: authorization.previousPhaseReceiptSha256 };
}

function parseDurable(context, key, schema, label) {
  const raw = context.penpot.currentFile.getSharedPluginData?.(NAMESPACE, key) || '';
  if (!raw) return null;
  if (typeof raw !== 'string') fail(`MEDIA_R3_DURABLE_${label}_NOT_STRING`);
  try {
    const value = JSON.parse(raw);
    if (value.schema !== schema) fail(`MEDIA_R3_DURABLE_${label}_TUPLE_DRIFT`);
    return value;
  } catch (error) {
    if (error instanceof M.MediaTupleStop) throw error;
    fail(`MEDIA_R3_DURABLE_${label}_INVALID_JSON`);
  }
}

function assertTuple(value, expected, label) {
  for (const [key, expectedValue] of Object.entries(expected)) {
    if (value?.[key] !== expectedValue) fail(`MEDIA_R3_${label}_${key.toUpperCase()}_MISMATCH`);
  }
}

function progressValue(context, authorization) {
  const value = parseDurable(context, PROGRESS_KEY, 'kenigevents.eventcard-media-phase-progress.v1', 'PROGRESS');
  if (!value) {
    if (authorization.previousPhaseReceiptSha256 !== null) fail('MEDIA_R3_INITIAL_PREVIOUS_PHASE_RECEIPT_FORBIDDEN');
    return null;
  }
  assertTuple(value, immutableOperationIdentity(context, authorization), 'PROGRESS_OPERATION');
  if (!Number.isInteger(value.cursor) || value.cursor < 0 || value.cursor > M.CASES.length) fail('MEDIA_R3_PROGRESS_CURSOR_INVALID');
  if (!['UNKNOWN_PENDING_DISTINCT_READBACK', 'PARTIAL_CONFIRMED', 'DONE'].includes(value.state)) fail('MEDIA_R3_PROGRESS_STATE_INVALID');
  if (value.state !== 'UNKNOWN_PENDING_DISTINCT_READBACK' &&
      authorization.previousPhaseReceiptSha256 !== M.sha256(value)) {
    fail('MEDIA_R3_PREVIOUS_PHASE_RECEIPT_MISMATCH');
  }
  return value;
}

function receiptValue(context, authorization = null) {
  const value = parseDurable(context, RECEIPT_KEY, 'kenigevents.eventcard-media-penpot-execution-receipt.r3', 'RECEIPT');
  if (!value) return null;
  const expected = {
    packageId: M.PACKAGE_ID, packageHead: context.exactPackageHead, packageTree: context.exactPackageTree,
    bundleSha256: context.exactBundleSha256, bundleBytes: context.exactBundleBytes,
    sourceRegistrySha256: M.sourceRegistrySha256(), authorityCardCommentId: AUTHORITY_CARD_COMMENT_ID,
    authorityScope: AUTHORITY_SCOPE, writerId: SOLE_WRITER,
  };
  if (authorization) expected.operationId = authorization.operationId;
  assertTuple(value, expected, 'RECEIPT');
  if (value.state !== 'MEDIA_FOUR_OF_FOUR_PENDING_DISTINCT_READBACK' || value.cursor !== M.CASES.length) {
    fail('MEDIA_R3_DURABLE_RECEIPT_TUPLE_DRIFT');
  }
  return value;
}

async function executeEventcardMediaPenpotR3(context, authorization) {
  authorizationEnvelope(context, authorization); assertActive(context, authorization);
  const before = await projectEventcardMediaPenpotR3(context, authorization);
  const progress = progressValue(context, authorization);
  assertProjectionAuthorization(context, authorization, before);
  if (progress?.state === 'UNKNOWN_PENDING_DISTINCT_READBACK') {
    fail('MEDIA_R3_UNKNOWN_REQUIRES_EXPLICIT_RECOVERY_DECISION', true);
  }
  const already = before.rows.every((row) => {
    const asset = M.SOURCE_ASSETS[row.fixtureId], evidence = row.existingSourceEvidence || {};
    return row.nativeImageDataReadback?.sha256 === asset.sha256 && row.nativeImageDataReadback?.bytes === asset.bytes &&
      evidence.sha256 === asset.sha256 && evidence.bytes === String(asset.bytes) &&
      evidence.path === asset.sourceAssetPath && evidence.semanticSlot === M.SEMANTIC_SLOT;
  });
  if (already) {
    if (!receiptValue(context, authorization)) fail('MEDIA_R3_TERMINAL_WITHOUT_DURABLE_RECEIPT');
    return { schema: RUNTIME_SCHEMA, state: 'REPLAY_NOOP', terminal: true, created: 0, mediaMutations: 0, secondRunCreated: 0 };
  }
  const cursor = progress?.cursor || 0;
  if (cursor >= before.rows.length) fail('MEDIA_R3_PROGRESS_TERMINAL_WITHOUT_MEDIA');
  const baselineImmutableSha256 = progress?.baselineImmutableSha256 || M.sha256(before.rows.map(immutable));
  const baselineProtectedDigest = progress?.baselineProtectedDigest || before.protectedCollectionDigest;
  if (M.sha256(before.rows.map(immutable)) !== baselineImmutableSha256 || before.protectedCollectionDigest !== baselineProtectedDigest) {
    fail('MEDIA_R3_PHASE_BASELINE_DRIFT');
  }
  const row = before.rows[cursor], asset = M.SOURCE_ASSETS[row.fixtureId];
  const unknown = { schema: 'kenigevents.eventcard-media-phase-progress.v1', ...phaseAuthorizationTuple(context, authorization),
    state: 'UNKNOWN_PENDING_DISTINCT_READBACK', cursor, targetMediaShapeId: row.mediaShapeId,
    baselineImmutableSha256, baselineProtectedDigest, retryAllowed: false };
  assertActive(context, authorization);
  context.penpot.currentFile.setSharedPluginData(NAMESPACE, PROGRESS_KEY, M.stringOnly(M.canonical(unknown)));
  let nativeCalls = 0;
  try {
    const bytes = await sourceBytes(context, asset), shape = walk(context.penpot.currentPage.root).find((item) => String(item.id) === row.mediaShapeId);
    assertActive(context, authorization);
    const uploaded = await context.penpot.uploadMediaData(asset.sourceAssetPath.split('/').at(-1), bytes, asset.mimeType);
    nativeCalls += 1;
    assertActive(context, authorization);
    const uploadedReadback = await imageReadback(uploaded);
    if (uploadedReadback.sha256 !== asset.sha256 || uploadedReadback.bytes !== asset.bytes) fail('MEDIA_R3_UPLOADED_IMAGEDATA_BYTES_MISMATCH');
    const current = imageFromFill(shape).fills;
    shape.fills = current.map((fill, index) => index === 0 ? { ...fill, fillImage: uploaded, fillOpacity: 1 } : fill);
    nativeCalls += 1;
    for (const [key, value] of [
      ['kenigevents-eventcard-media-source-sha256', asset.sha256],
      ['kenigevents-eventcard-media-source-bytes', String(asset.bytes)],
      ['kenigevents-eventcard-media-source-path', asset.sourceAssetPath],
      ['kenigevents-eventcard-media-semantic-slot', M.SEMANTIC_SLOT],
    ]) { await setEvidence(context, authorization, shape, key, value); nativeCalls += 1; }
    const after = await projectEventcardMediaPenpotR3(context, authorization);
    if (M.sha256(after.rows.map(immutable)) !== baselineImmutableSha256 || after.protectedCollectionDigest !== baselineProtectedDigest) {
      fail('MEDIA_R3_NATIVE_NON_FILL_OR_PROTECTED_DRIFT');
    }
    const completed = after.rows.slice(0, cursor + 1);
    for (const done of completed) {
      const source = M.SOURCE_ASSETS[done.fixtureId], evidence = done.existingSourceEvidence || {};
      if (done.nativeImageDataReadback?.sha256 !== source.sha256 || done.nativeImageDataReadback?.bytes !== source.bytes ||
          evidence.sha256 !== source.sha256 || evidence.bytes !== String(source.bytes) ||
          evidence.path !== source.sourceAssetPath || evidence.semanticSlot !== M.SEMANTIC_SLOT) fail('MEDIA_R3_NATIVE_SOURCE_EVIDENCE_READBACK_DRIFT');
    }
    const nextCursor = cursor + 1;
    const phase = { schema: 'kenigevents.eventcard-media-phase-progress.v1', ...phaseAuthorizationTuple(context, authorization),
      state: nextCursor === M.CASES.length ? 'DONE' : 'PARTIAL_CONFIRMED', cursor: nextCursor,
      completedMediaShapeIds: after.rows.slice(0, nextCursor).map((item) => item.mediaShapeId),
      confirmedRevision: after.revision, confirmedProjectionSha256: after.projectionSha256,
      baselineImmutableSha256, baselineProtectedDigest, retryAllowed: false };
    const phaseReceiptSha256 = M.sha256(phase);
    assertActive(context, authorization);
    context.penpot.currentFile.setSharedPluginData(NAMESPACE, PROGRESS_KEY, M.stringOnly(M.canonical(phase)));
    if (nextCursor < M.CASES.length) return { schema: RUNTIME_SCHEMA, state: 'PARTIAL_CONFIRMED', terminal: false,
      phase_after: 'PARTIAL_CONFIRMED', cursor: nextCursor, phaseReceiptSha256,
      confirmedRevision: after.revision, confirmedProjectionSha256: after.projectionSha256,
      created: 1, nativeMutationCalls: nativeCalls };
    const receipt = { schema: 'kenigevents.eventcard-media-penpot-execution-receipt.r3', ...immutableOperationIdentity(context, authorization),
      state: 'MEDIA_FOUR_OF_FOUR_PENDING_DISTINCT_READBACK', cursor: nextCursor,
      phaseReceiptSha256, authorizedRevision: authorization.revision,
      authorizedProjectionSha256: authorization.projectionSha256,
      confirmedRevision: after.revision, confirmedProjectionSha256: after.projectionSha256,
      rootIds: after.rows.map((item) => item.rootId), mediaShapeIds: after.rows.map((item) => item.mediaShapeId),
      parentGroupIds: after.rows.map((item) => item.parentGroupId), nativeMutationCalls: 24,
      mediaFillMutations: 4, evidenceMutations: 16, textMutations: 0, componentPathMutations: 0,
      geometryMutations: 0, overlayMutations: 0, retryAllowed: false, created: 1, terminal: true };
    assertActive(context, authorization);
    context.penpot.currentFile.setSharedPluginData(NAMESPACE, RECEIPT_KEY, M.stringOnly(M.canonical(receipt)));
    return receipt;
  } catch (error) {
    return distinctUnknown(context, error, nativeCalls);
  }
}

async function readEventcardMediaPenpotSettlementR3(context, receipt) {
  const stored = receiptValue(context);
  if (!receipt || receipt.state !== 'MEDIA_FOUR_OF_FOUR_PENDING_DISTINCT_READBACK' || !stored || M.canonical(stored) !== M.canonical(receipt)) {
    fail('MEDIA_R3_NATIVE_SETTLEMENT_RECEIPT_REQUIRED');
  }
  const projection = await projectEventcardMediaPenpotR3(context);
  for (const row of projection.rows) {
    const asset = M.SOURCE_ASSETS[row.fixtureId];
    if (row.nativeImageDataReadback?.sha256 !== asset.sha256 || row.nativeImageDataReadback?.bytes !== asset.bytes) {
      fail('MEDIA_R3_SETTLEMENT_IMAGEDATA_BYTES_FAIL');
    }
    const coverage = await nativeCoverageProof(context, row.mediaShapeId, row.rootId);
    if (!coverage || coverage.status !== 'KNOWN_PASS' || coverage.uncoveredPixels !== 0 ||
        coverage.opaqueOverlays !== 0 || coverage.sourceSha256 !== asset.sha256) fail('MEDIA_R3_SETTLEMENT_COVERAGE_FAIL');
  }
  return { schema: RUNTIME_SCHEMA, state: 'MEDIA_FOUR_OF_FOUR_READBACK_PASS_PENDING_V0', rows: 4,
    readbackMutations: 0, validation: [], visualPass: false, wholeEventcardPass: false };
}

module.exports = { AUTH_SCHEMA, ACTIVE_SCHEMA, RUNTIME_SCHEMA, OWNER_DIRECTIVE,
  AUTHORITY_CARD_COMMENT_ID, AUTHORITY_SCOPE, SOLE_WRITER, NAMESPACE, ACTIVE_KEY, RECEIPT_KEY, PROGRESS_KEY,
  shaBytes, projectEventcardMediaPenpotR3, executeEventcardMediaPenpotR3,
  readEventcardMediaPenpotSettlementR3, nativeCoverageProof, assertActive };

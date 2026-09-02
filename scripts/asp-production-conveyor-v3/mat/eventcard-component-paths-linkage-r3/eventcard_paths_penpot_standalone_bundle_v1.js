/* Generated deterministically by build_eventcard_paths_standalone_bundle_v1.py. Do not hand-edit. */
(function (global) {
'use strict';
function __bundleUtf8Bytes(text) {
  const out = [];
  for (let i = 0; i < text.length; i += 1) {
    let code = text.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
      const low = text.charCodeAt(i + 1);
      if (low >= 0xdc00 && low <= 0xdfff) { code = 0x10000 + ((code - 0xd800) << 10) + (low - 0xdc00); i += 1; }
    }
    if (code < 0x80) out.push(code);
    else if (code < 0x800) out.push(0xc0 | (code >>> 6), 0x80 | (code & 63));
    else if (code < 0x10000) out.push(0xe0 | (code >>> 12), 0x80 | ((code >>> 6) & 63), 0x80 | (code & 63));
    else out.push(0xf0 | (code >>> 18), 0x80 | ((code >>> 12) & 63), 0x80 | ((code >>> 6) & 63), 0x80 | (code & 63));
  }
  return new Uint8Array(out);
}
function __bundleSha256Bytes(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ];
  const bitLength = bytes.length * 8;
  const paddedLength = (((bytes.length + 9 + 63) >> 6) << 6);
  const msg = new Uint8Array(paddedLength); msg.set(bytes); msg[bytes.length] = 0x80;
  const view = new DataView(msg.buffer);
  const hi = Math.floor(bitLength / 0x100000000), lo = bitLength >>> 0;
  view.setUint32(paddedLength - 8, hi, false); view.setUint32(paddedLength - 4, lo, false);
  let h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a,h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19;
  const rotr = (x,n) => (x >>> n) | (x << (32-n));
  for (let off=0; off<msg.length; off+=64) {
    const w = new Uint32Array(64);
    for (let i=0;i<16;i+=1) w[i]=view.getUint32(off+i*4,false);
    for (let i=16;i<64;i+=1) { const a=w[i-15],b=w[i-2]; const s0=rotr(a,7)^rotr(a,18)^(a>>>3),s1=rotr(b,17)^rotr(b,19)^(b>>>10); w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0; }
    let a=h0,b=h1,c=h2,d=h3,e=h4,f=h5,g=h6,h=h7;
    for (let i=0;i<64;i+=1) { const s1=rotr(e,6)^rotr(e,11)^rotr(e,25),ch=(e&f)^(~e&g),t1=(h+s1+ch+K[i]+w[i])>>>0,s0=rotr(a,2)^rotr(a,13)^rotr(a,22),maj=(a&b)^(a&c)^(b&c),t2=(s0+maj)>>>0; h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0; }
    h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+c)>>>0;h3=(h3+d)>>>0;h4=(h4+e)>>>0;h5=(h5+f)>>>0;h6=(h6+g)>>>0;h7=(h7+h)>>>0;
  }
  return [h0,h1,h2,h3,h4,h5,h6,h7].map((v)=>v.toString(16).padStart(8,'0')).join('');
}
function __bundleSha256Text(text) { return __bundleSha256Bytes(__bundleUtf8Bytes(String(text))); }
function __bundleClone(value) {
  if (Array.isArray(value)) return value.map(__bundleClone);
  if (value && typeof value === 'object') { const out={}; for (const key of Object.keys(value)) out[key]=__bundleClone(value[key]); return out; }
  return value;
}
const structuredClone = __bundleClone;
const M = (() => {
const PACKAGE_ID = 'MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-LINKAGE-R3';
const PARENT_PACKAGE_ID = 'MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-PROJECTION-R2';
const FILE_ID = '40e06342-8830-80d6-8008-8fc8a3a4cd4f';
const PAGE_ID = 'c16498cb-b51d-8030-8008-904bd8fc9c53';
const COLLECTION_ID = '313fb1ed-0d5c-8095-8008-9108df52b2ce';
const COLLECTION_NAME = 'KenigEvents · G12 bounded L0-L3';
const LEGACY_PATH = 'KenigEvents / G19 / EventCard 8006 / Accepted';
const LEGACY_MAIN_PREFIX = `${LEGACY_PATH} / `;

const PATHS = Object.freeze({
  desktopLeaves: 'KenigEvents / EventCard / Leaves / Desktop',
  mobileLeaves: 'KenigEvents / EventCard / Leaves / Mobile',
  desktopCases: 'KenigEvents / EventCard / Cases / Desktop',
  mobileCases: 'KenigEvents / EventCard / Cases / Mobile',
});

const SPECS = Object.freeze([
  ['event.media-frame.desktop.8006', 'desktopLeaves'],
  ['event.meta.event-type.desktop.8006', 'desktopLeaves'],
  ['event.meta.admission.desktop.8006', 'desktopLeaves'],
  ['event.action.not-interested.desktop.8006', 'desktopLeaves'],
  ['event.action.calendar.desktop.8006', 'desktopLeaves'],
  ['event.action.share.desktop.8006', 'desktopLeaves'],
  ['event.action.like.desktop.8006', 'desktopLeaves'],
  ['event.media-frame.mobile.8006', 'mobileLeaves'],
  ['event.meta.event-type.mobile.8006', 'mobileLeaves'],
  ['event.meta.admission.mobile.8006', 'mobileLeaves'],
  ['event.action.not-interested.mobile.8006', 'mobileLeaves'],
  ['event.action.calendar.mobile.8006', 'mobileLeaves'],
  ['event.action.share.mobile.8006', 'mobileLeaves'],
  ['event.action.like.mobile.8006', 'mobileLeaves'],
  ['eventcard.desktop-wide-calendar.8006', 'desktopCases',
    '313fb1ed-0d5c-8095-8008-912d51452f89', '313fb1ed-0d5c-8095-8008-912c45090653', 7, false],
  ['eventcard.desktop-packed-calendar-absent.2182', 'desktopCases',
    '313fb1ed-0d5c-8095-8008-916b0b931d1f', '313fb1ed-0d5c-8095-8008-914c76615924', 6, true],
  ['eventcard.mobile-wide-calendar.8006', 'mobileCases',
    '313fb1ed-0d5c-8095-8008-916bb0cb7843', '313fb1ed-0d5c-8095-8008-916b340de148', 7, true],
  ['eventcard.mobile-packed-calendar-absent.2182', 'mobileCases',
    '313fb1ed-0d5c-8095-8008-916be7e9352d', '313fb1ed-0d5c-8095-8008-916bd0ab6c98', 6, true],
].map(([displayName, group, componentId = null, mainId = null, linkedCount = 0, legacyMain = false]) =>
  Object.freeze({ displayName, group, componentId, mainId, linkedCount, legacyMain, kind: linkedCount ? 'case' : 'leaf' })
));

class LinkageStop extends Error {
  constructor(code, unknownOutcome = false) {
    super(code);
    this.name = 'LinkageStop';
    this.code = code;
    this.unknownOutcome = unknownOutcome;
    this.retryAllowed = false;
  }
}
const fail = (code, unknown = false) => { throw new LinkageStop(code, unknown); };

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
const sha256 = (value) => __bundleSha256Text(canonical(value));
const stringOnly = (value) => {
  if (typeof value !== 'string') fail('PATHS_R3_PLUGIN_DATA_NOT_STRING');
  return value;
};

function acceptedMainLayerNames(spec) {
  return spec.legacyMain
    ? new Set([spec.displayName, `${LEGACY_MAIN_PREFIX}${spec.displayName}`])
    : new Set([spec.displayName]);
}

function collection(adapter) {
  const value = adapter.collection(COLLECTION_ID);
  if (!value || value.rootId !== COLLECTION_ID || value.name !== COLLECTION_NAME ||
      value.roots !== 1 || value.children !== 18 || value.components !== 18 ||
      value.detached !== 0 || value.clones !== 0 || value.recreated !== 0 ||
      !Array.isArray(value.validation) || value.validation.length !== 0 ||
      typeof value.protectedDigest !== 'string' || !value.protectedDigest ||
      typeof value.visibleProductLabelsDigest !== 'string' || !value.visibleProductLabelsDigest) {
    fail('PATHS_R3_COLLECTION_DRIFT');
  }
  if (value.fileLocalComponents != null &&
      (value.fileLocalComponents !== 35 || value.protectedOtherComponents !== 17 ||
       typeof value.protectedOtherComponentsDigest !== 'string' || !value.protectedOtherComponentsDigest)) {
    fail('PATHS_R3_FILE_LOCAL_COMPONENT_CENSUS_DRIFT');
  }
  return structuredClone(value);
}

function componentRows(adapter) {
  const inventory = adapter.components();
  if (!Array.isArray(inventory) || inventory.length !== 18) fail('PATHS_R3_COMPONENT_CENSUS');

  const rows = SPECS.map((spec) => {
    // Component display identity is authoritative. Main-layer names are structural
    // and must not participate in component cardinality.
    const matches = inventory.filter((item) => item && item.name === spec.displayName);
    if (matches.length !== 1) fail('PATHS_R3_COMPONENT_DISPLAY_NAME_CARDINALITY');
    const item = matches[0];
    if (!item.id || !item.main || !item.main.id || !item.main.name) fail('PATHS_R3_COMPONENT_OR_MAIN_ID_MISSING');
    if (spec.componentId && item.id !== spec.componentId) fail('PATHS_R3_PINNED_COMPONENT_ID_DRIFT');
    if (spec.mainId && item.main.id !== spec.mainId) fail('PATHS_R3_PINNED_MAIN_ID_DRIFT');
    if (!acceptedMainLayerNames(spec).has(item.main.name)) fail('PATHS_R3_MAIN_LAYER_NAME_OUTSIDE_ACCEPTED_SET');

    const relationship = adapter.componentMainRelationship(item.id, item.main.id);
    if (!relationship || relationship.componentId !== item.id || relationship.mainId !== item.main.id ||
        relationship.native !== true) fail('PATHS_R3_COMPONENT_MAIN_RELATIONSHIP_DRIFT');

    const expectedPath = PATHS[spec.group];
    const currentPath = String(item.path ?? '');
    const pathAllowed = currentPath === '' || currentPath === expectedPath ||
      (spec.legacyMain && currentPath === LEGACY_PATH);
    if (!pathAllowed) fail('PATHS_R3_UNKNOWN_COMPONENT_PATH');

    return {
      semanticName: spec.displayName,
      displayName: item.name,
      currentMainLayerName: item.main.name,
      componentId: String(item.id),
      mainId: String(item.main.id),
      relationship: structuredClone(relationship),
      currentPath,
      expectedCanonicalPath: expectedPath,
      kind: spec.kind,
      linkedCount: spec.linkedCount,
      legacyMainLayerNameAccepted: item.main.name.startsWith(LEGACY_MAIN_PREFIX),
    };
  });

  if (new Set(rows.map((row) => row.componentId)).size !== 18) fail('PATHS_R3_DUPLICATE_COMPONENT_ID');
  if (new Set(rows.map((row) => row.mainId)).size !== 18) fail('PATHS_R3_DUPLICATE_MAIN_ID');
  return rows;
}

function linkedRows(adapter, components) {
  const leafIds = new Set(components.filter((row) => row.kind === 'leaf').map((row) => row.componentId));
  const result = [];
  for (const parent of components.filter((row) => row.kind === 'case')) {
    const links = adapter.links(parent.mainId);
    if (!Array.isArray(links) || links.length !== parent.linkedCount) fail('PATHS_R3_LINKED_COUNT_DRIFT');
    for (const link of links) {
      if (!link || !link.id || !link.componentId || !link.parentMainId || !link.parentCaseComponentId) {
        fail('PATHS_R3_LINKED_ID_MISSING');
      }
      if (link.parentMainId !== parent.mainId || link.parentCaseComponentId !== parent.componentId ||
          !leafIds.has(link.componentId)) fail('PATHS_R3_LINKED_RELATIONSHIP_DRIFT');
      result.push({
        linkedInstanceId: String(link.id),
        linkedComponentId: String(link.componentId),
        parentMainId: String(link.parentMainId),
        parentCaseComponentId: String(link.parentCaseComponentId),
      });
    }
  }
  if (result.length !== 26) fail('PATHS_R3_LINKED_CENSUS');
  if (new Set(result.map((row) => row.linkedInstanceId)).size !== 26) fail('PATHS_R3_DUPLICATE_LINKED_ID');
  return result.sort((a, b) => a.linkedInstanceId.localeCompare(b.linkedInstanceId));
}

function projectState(adapter, expectedState = 'baseline') {
  const identity = adapter.identity();
  if (!identity || identity.fileId !== FILE_ID || identity.pageId !== PAGE_ID ||
      !Number.isInteger(identity.revision)) fail('PATHS_R3_CURRENT_REVISION_MISSING');

  const protectedCollection = collection(adapter);
  const components = componentRows(adapter);
  const linkedInstances = linkedRows(adapter, components);
  const count = {
    exact: components.filter((row) => row.currentPath === row.expectedCanonicalPath).length,
    empty: components.filter((row) => row.currentPath === '').length,
    legacy: components.filter((row) => row.currentPath === LEGACY_PATH).length,
  };
  if (expectedState === 'baseline' && canonical(count) !== canonical({ exact: 0, empty: 15, legacy: 3 })) {
    fail('PATHS_R3_BASELINE_COUNTS_DRIFT');
  }
  if (expectedState === 'terminal' && canonical(count) !== canonical({ exact: 18, empty: 0, legacy: 0 })) {
    fail('PATHS_R3_TERMINAL_COUNTS_DRIFT');
  }

  const payload = {
    schema: 'kenigevents.eventcard-paths-linkage-projection.r3',
    packageId: PACKAGE_ID,
    revision: identity.revision,
    state: expectedState,
    components,
    componentIds: components.map((row) => row.componentId).sort(),
    mainIds: components.map((row) => row.mainId).sort(),
    linkedInstances,
    linkedInstanceIds: linkedInstances.map((row) => row.linkedInstanceId).sort(),
    count,
    protectedCollectionDigest: protectedCollection.protectedDigest,
    visibleProductLabelsDigest: protectedCollection.visibleProductLabelsDigest,
    mutationFree: true,
  };
  if (protectedCollection.fileLocalComponents != null) {
    payload.fileLocalComponents = protectedCollection.fileLocalComponents;
    payload.protectedOtherComponents = protectedCollection.protectedOtherComponents;
    payload.protectedOtherComponentsDigest = protectedCollection.protectedOtherComponentsDigest;
  }
  return { ...payload, projectionSha256: sha256(payload), penpotMutations: 0 };
}

const projectEventcardPathsLinkageR3 = (adapter) => projectState(adapter, 'baseline');

function assertAuthorization(auth, projection) {
  if (!auth || auth.schema !== 'kenigevents.eventcard-paths-linkage-authorization.r3' ||
      auth.packageId !== PACKAGE_ID || auth.parentPackageId !== PARENT_PACKAGE_ID ||
      auth.state !== 'ACTIVE' || auth.authorized !== true || auth.cancelled !== false) {
    fail('PATHS_R3_AUTHORIZATION_MISMATCH');
  }
  if (auth.revision !== projection.revision) fail('PATHS_R3_STALE_REVISION');
  if (auth.projectionSha256 !== projection.projectionSha256) fail('PATHS_R3_STALE_PROJECTION_SHA');
}

function stableIdentity(projection) {
  return {
    components: projection.components.map((row) => [
      row.semanticName, row.displayName, row.currentMainLayerName, row.componentId, row.mainId,
      row.relationship.componentId, row.relationship.mainId,
    ]),
    linkedInstances: projection.linkedInstances,
    visibleProductLabelsDigest: projection.visibleProductLabelsDigest,
    protectedCollectionDigest: projection.protectedCollectionDigest,
  };
}

async function executeEventcardPathsLinkageR3(adapter, authorization) {
  if (adapter.marker(PACKAGE_ID)) fail('PATHS_R3_EXECUTOR_REPLAY_FORBIDDEN');
  const preflight = projectEventcardPathsLinkageR3(adapter);
  assertAuthorization(authorization, preflight);
  const recheck = projectEventcardPathsLinkageR3(adapter);
  if (recheck.revision !== authorization.revision ||
      recheck.projectionSha256 !== authorization.projectionSha256) {
    fail('PATHS_R3_PROJECTION_CHANGED_BEFORE_MUTATION');
  }
  const beforeIdentity = stableIdentity(recheck);

  try {
    await adapter.atomic(async () => {
      for (const row of recheck.components) {
        if (adapter.identity().revision !== authorization.revision) fail('PATHS_R3_STALE_REVISION_DURING_MUTATION');
        adapter.setPath(row.componentId, row.expectedCanonicalPath);
      }
    });
  } catch (error) {
    if (error instanceof LinkageStop) throw error;
    fail('PATHS_R3_TIMEOUT_OR_UNKNOWN_OUTCOME', true);
  }

  const terminal = projectState(adapter, 'terminal');
  if (canonical(stableIdentity(terminal)) !== canonical(beforeIdentity)) {
    fail('PATHS_R3_ID_NAME_LINK_OR_VISIBLE_LABEL_DRIFT', true);
  }
  const receipt = {
    schema: 'kenigevents.eventcard-paths-linkage-execution-receipt.r3',
    packageId: PACKAGE_ID,
    state: 'PATHS_18_OF_18_PENDING_DISTINCT_READBACK',
    revision: authorization.revision,
    authorizedProjectionSha256: authorization.projectionSha256,
    terminalProjectionSha256: terminal.projectionSha256,
    componentIds: terminal.componentIds,
    mainIds: terminal.mainIds,
    linkedInstanceIds: terminal.linkedInstanceIds,
    pathMutations: 18,
    displayNameMutations: 0,
    mainLayerNameMutations: 0,
    visibleProductLabelMutations: 0,
    detach: 0,
    clone: 0,
    recreate: 0,
    retryAllowed: false,
    visualPass: false,
    wholeEventcardPass: false,
  };
  adapter.writeMarker(PACKAGE_ID, stringOnly(canonical(receipt)));
  return receipt;
}

function readEventcardPathsLinkageSettlementR3(adapter, receipt) {
  if (!receipt || receipt.state !== 'PATHS_18_OF_18_PENDING_DISTINCT_READBACK' ||
      !adapter.marker(PACKAGE_ID)) fail('PATHS_R3_SETTLEMENT_RECEIPT_REQUIRED');
  const terminal = projectState(adapter, 'terminal');
  if (canonical(terminal.componentIds) !== canonical(receipt.componentIds) ||
      canonical(terminal.mainIds) !== canonical(receipt.mainIds) ||
      canonical(terminal.linkedInstanceIds) !== canonical(receipt.linkedInstanceIds)) {
    fail('PATHS_R3_SETTLEMENT_ID_DRIFT');
  }
  return {
    state: 'PATHS_18_OF_18_LINKAGE_READBACK_PASS_PENDING_V0',
    exactCanonicalPaths: 18,
    componentIds: 18,
    mainIds: 18,
    linkedInstances: 26,
    readbackMutations: 0,
    displayNameMutations: 0,
    mainLayerNameMutations: 0,
    visibleProductLabelMutations: 0,
    visualPass: false,
    wholeEventcardPass: false,
  };
}

const MAIN_LAYER_NORMALIZATION_DECISION = Object.freeze({
  acceptedByU0AsTechnicalLinkageOnly: true,
  active: false,
  defaultExecutionUsesIt: false,
  exactEligibleMainIds: Object.freeze([
    '313fb1ed-0d5c-8095-8008-914c76615924',
    '313fb1ed-0d5c-8095-8008-916b340de148',
    '313fb1ed-0d5c-8095-8008-916bd0ab6c98',
  ]),
  requiresProviderProofPathAssignmentImpossibleWithoutNormalization: true,
  requiresSeparateDigestBoundAuthorization: true,
  visibleProductLabelsMustRemainUnchanged: true,
  realUserFacingNameChangeRequiresOwnerAction: true,
  thisPackageAuthorizesNormalization: false,
});

return {
  PACKAGE_ID, PARENT_PACKAGE_ID, FILE_ID, PAGE_ID, COLLECTION_ID, COLLECTION_NAME,
  LEGACY_PATH, LEGACY_MAIN_PREFIX, PATHS, SPECS, MAIN_LAYER_NORMALIZATION_DECISION,
  LinkageStop, canonical, sha256, stringOnly,
  projectState, stableIdentity,
  projectEventcardPathsLinkageR3, executeEventcardPathsLinkageR3,
  readEventcardPathsLinkageSettlementR3,
};

})();
/*
 * Concrete, package-local Penpot adapter for the frozen R3 linkage repair.
 * This source is inert: MAT/QA/INTEGRATE may test it, but only D0's sole
 * PUBLISH writer may call executeEventcardPathsPenpotR3 with a fresh native
 * projection and a matching physical ACTIVE lease.
 */
const ACTIVE_NAMESPACE = 'kenigevents';
const ACTIVE_KEY = 'asp-physical-active-marker-v3';
const RECEIPT_KEY = 'eventcard-paths-linkage-r3-receipt';
const AUTH_SCHEMA = 'kenigevents.eventcard-paths-penpot-authorization.r3';
const ACTIVE_SCHEMA = 'kenigevents.asp-physical-active-marker.v3';
const RUNTIME_SCHEMA = 'kenigevents.eventcard-paths-penpot-runtime.r3';
const HEX40 = /^[0-9a-f]{40}$/;
const HEX64 = /^[0-9a-f]{64}$/;
const OWNER_DIRECTIVE = 'MORNING_PRODUCTION_SHIFT:EVENTCARD_PATHS_AFTER_EXACT_AUTHORIZATION';
const AUTHORITY_CARD_COMMENT_ID = 5505976359;
const AUTHORITY_SCOPE = 'EVENTCARD_PATHS_ONLY';

const array = (value) => Array.from(value || []);
const children = (shape) => array(shape?.children);
const mainOf = (component) => typeof component?.mainInstance === 'function'
  ? component.mainInstance() : component?.mainInstance;
const linkedComponent = (shape) => typeof shape?.component === 'function' ? shape.component() : null;
const plugin = (shape, key) => String(shape?.getPluginData?.(key) || '');
const nowMs = (context) => Number(typeof context.now === 'function' ? context.now() : Date.now());
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
    if (typeof context.settle === 'function') {
      if (requireLease) assertPhysicalActive(context, requireLease);
      await context.settle();
    }
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
  const pageRoots = children(page.root);
  const roots = pageRoots.filter((shape) => String(shape?.id || '') === M.COLLECTION_ID);
  const board = roots[0];
  const allShapes = walk(page.root);
  const protectedDigest = M.sha256({
    fileId: M.FILE_ID, pageId: M.PAGE_ID,
    shapes: allShapes.map(shapeProjection).sort((a, b) => a.id.localeCompare(b.id)),
    components: fileLocalComponents.map((component) => {
      const main = mainOf(component);
      // LibraryComponent.path is intentionally excluded: this is the path-only
      // repair's protected geometry/text/media/ID projection.
      const target = targetNames.has(component?.name);
      return { id: String(component?.id || ''), name: component?.name ?? null,
        mainId: String(main?.id || ''), mainName: main?.name ?? null,
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
      const revision = Number(penpot.currentFile.revn ?? penpot.currentFile.revision);
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
  const profile = context.pageProfile;
  if (!profile || profile.profileId !== 'free-collection.owner-review.v1' ||
      profile.state !== 'BLOCKED_OWNER_REJECTED' || profile.allowedToMutatePenpot !== false ||
      !HEX64.test(String(profile.profileSha256 || ''))) {
    fail('PATHS_R3_EXPECTED_OWNER_REJECTED_PROFILE_TUPLE_DRIFT');
  }
  const expected = {
    schema: AUTH_SCHEMA, packageId: M.PACKAGE_ID, parentPackageId: M.PARENT_PACKAGE_ID,
    packageHead: context.exactPackageHead, packageTree: context.exactPackageTree,
    state: 'ACTIVE', authorized: true, cancelled: false,
    pageProfileSha256: profile.profileSha256,
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
  for (const key of ['sessionId', 'taskId', 'writerId', 'leaseToken']) {
    if (!p || typeof p[key] !== 'string' || p[key].length < 8) fail(`PATHS_R3_PROVENANCE_${key.toUpperCase()}_INVALID`);
  }
  for (const [key, value] of Object.entries({
    packageId: M.PACKAGE_ID, packageHead: context.exactPackageHead,
    packageTree: context.exactPackageTree, triggeredBy: authorization.triggeredBy,
    pageProfileSha256: context.pageProfile.profileSha256,
    ownerDirective: OWNER_DIRECTIVE,
    authorityCardCommentId: AUTHORITY_CARD_COMMENT_ID,
    authorityScope: AUTHORITY_SCOPE,
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
  let raw;
  if (typeof context.readActiveMarker === 'function') raw = context.readActiveMarker();
  else raw = context.penpot.currentFile.getSharedPluginData?.(ACTIVE_NAMESPACE, ACTIVE_KEY);
  if (raw && typeof raw === 'object') return raw;
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
    pageProfileSha256: context.pageProfile.profileSha256,
    ownerDirective: OWNER_DIRECTIVE,
    authorityCardCommentId: AUTHORITY_CARD_COMMENT_ID,
    authorityScope: AUTHORITY_SCOPE,
    leaseToken: p.leaseToken, leaseExpiresAt: p.leaseExpiresAt,
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
  if (typeof context.writeReceiptMarker === 'function') return context.writeReceiptMarker(value);
  const setter = context.penpot.currentFile.setSharedPluginData;
  if (typeof setter !== 'function') fail('PATHS_R3_RECEIPT_MARKER_API_MISSING');
  return setter.call(context.penpot.currentFile, ACTIVE_NAMESPACE, RECEIPT_KEY, value);
}

function readReceiptMarker(context) {
  if (typeof context.readReceiptMarker === 'function') return context.readReceiptMarker();
  return context.penpot.currentFile.getSharedPluginData?.(ACTIVE_NAMESPACE, RECEIPT_KEY) || '';
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
  if (terminalAlready) {
    if (!readReceiptMarker(context)) fail('PATHS_R3_TERMINAL_WITHOUT_DURABLE_RECEIPT');
    return { schema: RUNTIME_SCHEMA, state: 'REPLAY_NOOP', created: 0, pathMutations: 0,
      secondRunCreated: 0, retryAllowed: false, terminalProjectionSha256: fresh.projectionSha256 };
  }
  if (M.canonical(fresh.count) !== M.canonical({ exact: 0, empty: 15, legacy: 3 })) {
    fail('PATHS_R3_PARTIAL_STATE_REQUIRES_OWNER_READBACK');
  }

  const beforeIdentity = M.stableIdentity(fresh);
  let writes = 0;
  try {
    for (const row of fresh.components) {
      // This check is deliberately adjacent to each actual native setter. No
      // logical operation is allowed to amortize one lease check over writes.
      assertPhysicalActive(context, authorization);
      const component = adapter.componentObjects.get(row.componentId);
      component.path = row.expectedCanonicalPath;
      writes += 1;
      if (String(component.path ?? '') !== row.expectedCanonicalPath) fail('PATHS_R3_NATIVE_PATH_WRITE_READBACK_MISMATCH');
    }
    const terminalAdapter = nativeAdapter(context, page);
    const terminal = M.projectState(terminalAdapter, 'terminal');
    if (M.canonical(M.stableIdentity(terminal)) !== M.canonical(beforeIdentity)) {
      fail('PATHS_R3_NATIVE_ID_NAME_LINK_OR_PROTECTED_DRIFT');
    }
    const receipt = {
      schema: 'kenigevents.eventcard-paths-penpot-execution-receipt.r3', packageId: M.PACKAGE_ID,
      packageHead: context.exactPackageHead, packageTree: context.exactPackageTree,
      authorizedRevision: authorization.revision,
      authorizedProjectionSha256: authorization.projectionSha256,
      terminalProjectionSha256: terminal.projectionSha256,
      state: 'PATHS_18_OF_18_PENDING_DISTINCT_READBACK', pathMutations: 18,
      componentIds: terminal.componentIds, mainIds: terminal.mainIds,
      linkedInstanceIds: terminal.linkedInstanceIds,
      displayNameMutations: 0, mainLayerNameMutations: 0, textMutations: 0, mediaMutations: 0,
      detach: 0, clone: 0, recreate: 0, created: 0, retryAllowed: false,
    };
    await writeReceiptMarker(context, authorization, receipt);
    return receipt;
  } catch (error) {
    if (writes > 0 || error?.unknownOutcome) return distinctUnknownReadback(context, error, writes);
    throw error;
  }
}

async function readEventcardPathsPenpotSettlementR3(context, receipt) {
  if (!receipt || receipt.state !== 'PATHS_18_OF_18_PENDING_DISTINCT_READBACK' || !readReceiptMarker(context)) {
    fail('PATHS_R3_NATIVE_SETTLEMENT_RECEIPT_REQUIRED');
  }
  const terminal = await projectEventcardPathsPenpotR3(context, 'terminal');
  if (M.canonical(terminal.componentIds) !== M.canonical(receipt.componentIds) ||
      M.canonical(terminal.mainIds) !== M.canonical(receipt.mainIds) ||
      M.canonical(terminal.linkedInstanceIds) !== M.canonical(receipt.linkedInstanceIds)) {
    fail('PATHS_R3_NATIVE_SETTLEMENT_ID_DRIFT');
  }
  return { schema: RUNTIME_SCHEMA, state: 'PATHS_18_OF_18_LINKAGE_READBACK_PASS_PENDING_V0',
    exactCanonicalPaths: 18, componentIds: 18, mainIds: 18, linkedInstances: 26,
    readbackMutations: 0, validation: [], visualPass: false, wholeEventcardPass: false };
}


function __assertBundleAuthorization(host) {
  const auth = host && host.authorization;
  if (!host || typeof host.exactBundleSha256 !== 'string' || !/^[0-9a-f]{64}$/.test(host.exactBundleSha256) ||
      !Number.isInteger(host.exactBundleBytes) || host.exactBundleBytes <= 0 ||
      !auth || auth.bundleSha256 !== host.exactBundleSha256 || auth.bundleBytes !== host.exactBundleBytes ||
      !auth.provenance || auth.provenance.bundleSha256 !== host.exactBundleSha256 ||
      auth.provenance.bundleBytes !== host.exactBundleBytes) {
    const error = new Error('PATHS_R3_BUNDLE_AUTHORIZATION_MISMATCH');
    error.code = 'PATHS_R3_BUNDLE_AUTHORIZATION_MISMATCH'; error.retryAllowed = false; throw error;
  }
}
const __CONFORMANCE_NS = 'd0-eventcard-paths-bundle-v1';
const __CONFORMANCE_KEY = 'stable';
function __conformanceWrite(node, value) { node.setSharedPluginData(__CONFORMANCE_NS, __CONFORMANCE_KEY, value); }
async function __conformanceProjection(host) {
  return { schema:'D0_PLUGIN_BUNDLE_CONFORMANCE_PROJECTION_V1', pages:host.penpot.currentFile.pages.length, created:0 };
}
async function __conformanceExecution(host) {
  const page = host.penpot.currentFile.pages.find((item) => item.name === 'EventCard Paths conformance');
  if (!page) throw new Error('PATHS_BUNDLE_CONFORMANCE_PAGE_MISSING');
  await host.penpot.openPage(page);
  const exists = page.root.children.some((item) => item.getSharedPluginData(__CONFORMANCE_NS,__CONFORMANCE_KEY) === 'paths');
  if (exists) return { state:'DONE', terminal:true, created:0, replay_created:0 };
  const marker = host.penpot.createRectangle(); __conformanceWrite(marker,'paths'); page.root.appendChild(marker);
  return { state:'DONE', terminal:true, created:1 };
}
async function __conformanceSettlement(host) { return { state:'DONE', created:0, validation:host.penpot.currentFile.validate() }; }
const PUBLIC_API = Object.freeze({
  metadata: Object.freeze({
    schema: 'D0_PLUGIN_BUNDLE_V1', package_id: M.PACKAGE_ID, bundle_sha256_binding: 'EXTERNAL_AUTHORIZATION_TUPLE',
    global_name: 'KenigEventsD0EventcardPathsR3StandaloneV2',
    entrypoints: Object.freeze({projection:'projection', execution:'execution', settlement:'settlement'}),
    current_page_activation: true, max_creates_per_phase: 3, replay_created: 0,
    mutation_scope: 'LibraryComponent.path only', unknown_outcome: 'DISTINCT_READ_ONLY_PROJECTION_NO_RETRY'
  }),
  projection: (host) => host && host.__d0BundleConformance === true ? __conformanceProjection(host) : projectEventcardPathsPenpotR3(host, host && host.expectedState || 'any'),
  execution: async (host) => { if (host && host.__d0BundleConformance === true) return __conformanceExecution(host); __assertBundleAuthorization(host); const receipt = await executeEventcardPathsPenpotR3(host, host.authorization); host.receipt = receipt; return receipt; },
  settlement: (host) => host && host.__d0BundleConformance === true ? __conformanceSettlement(host) : readEventcardPathsPenpotSettlementR3(host, host && host.receipt),
  conformance: Object.freeze({
    createHost: async (seed) => { const page=seed.penpot.__seedPage('eventcard-paths-conformance-page');page.name='EventCard Paths conformance';return {penpot:seed.penpot,storage:seed.storage,__d0BundleConformance:true}; },
    prepareReplay: async (host,seed) => ({penpot:seed.penpot,storage:seed.storage,__d0BundleConformance:true}),
    strictStringProbe: async (host) => { const page=host.penpot.__seedPage('eventcard-paths-string-probe'); const values={number:374,object:{x:1},boolean:true,null:null,undefined:void 0},result={string:'FAIL'}; __conformanceWrite(page,'374');result.string='PASS';for(const key of Object.keys(values)){try{__conformanceWrite(page,values[key]);result[key]='ACCEPTED';}catch{result[key]='REJECTED';}}return result; }
  }),
  constants: Object.freeze({ packageId:M.PACKAGE_ID, fileId:M.FILE_ID, pageId:M.PAGE_ID, collectionId:M.COLLECTION_ID }),
  internals: Object.freeze({ logic: M, ACTIVE_NAMESPACE, ACTIVE_KEY, RECEIPT_KEY, AUTH_SCHEMA, ACTIVE_SCHEMA, RUNTIME_SCHEMA,
  OWNER_DIRECTIVE, AUTHORITY_CARD_COMMENT_ID, AUTHORITY_SCOPE,
  projectEventcardPathsPenpotR3, executeEventcardPathsPenpotR3,
  readEventcardPathsPenpotSettlementR3, assertPhysicalActive, })
});
Object.defineProperty(global, 'KenigEventsD0EventcardPathsR3StandaloneV2', {value: PUBLIC_API, enumerable: true, configurable: false, writable: false});
})(globalThis);

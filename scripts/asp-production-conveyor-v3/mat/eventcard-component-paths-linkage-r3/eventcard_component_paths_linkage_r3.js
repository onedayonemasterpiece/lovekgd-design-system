'use strict';

const crypto = require('node:crypto');

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
const sha256 = (value) => crypto.createHash('sha256').update(canonical(value)).digest('hex');
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

module.exports = {
  PACKAGE_ID, PARENT_PACKAGE_ID, FILE_ID, PAGE_ID, COLLECTION_ID, COLLECTION_NAME,
  LEGACY_PATH, LEGACY_MAIN_PREFIX, PATHS, SPECS, MAIN_LAYER_NORMALIZATION_DECISION,
  LinkageStop, canonical, sha256, stringOnly,
  projectState, stableIdentity,
  projectEventcardPathsLinkageR3, executeEventcardPathsLinkageR3,
  readEventcardPathsLinkageSettlementR3,
};

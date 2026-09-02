'use strict';

const crypto = require('node:crypto');

const PACKAGE_ID = 'MAT-EVENTCARD-MEDIA-SAME-TUPLE-EXECUTION-R3';
const PARENT_PACKAGE_ID = 'MAT-EVENTCARD-MEDIA-COVERAGE-PROJECTION-BINDING-R2';
const FILE_ID = '40e06342-8830-80d6-8008-8fc8a3a4cd4f';
const PAGE_ID = 'c16498cb-b51d-8030-8008-904bd8fc9c53';
const COLLECTION_ID = '313fb1ed-0d5c-8095-8008-9108df52b2ce';
const SEMANTIC_SLOT = 'event.media-frame/image-content';

const SOURCE_ASSETS = Object.freeze({
  'event.real.8006': Object.freeze({
    eventId: 8006,
    eventsBotNewSnapshotCommit: '8710e56fa3685f6c30a90cd062d532dce0348cce',
    fixturePayloadPath: 'events/event.real.8006.json',
    sourceAssetPath: '/p/image/v2/dd/dd8834258d4a1ebde029aca1960bdd224bdf636d3fd8aee8fc7824012475de8b.webp',
    sourceAssetUrl: 'https://static.kenigevents.ru/p/image/v2/dd/dd8834258d4a1ebde029aca1960bdd224bdf636d3fd8aee8fc7824012475de8b.webp',
    sha256: 'dd8834258d4a1ebde029aca1960bdd224bdf636d3fd8aee8fc7824012475de8b',
    bytes: 111072, width: 1440, height: 1920, mimeType: 'image/webp',
    fit: 'contain', acceptedFocal: '50% 50%', sourceRecordRecommendedFocal: '75% 45%',
  }),
  'event.real.2182': Object.freeze({
    eventId: 2182,
    eventsBotNewSnapshotCommit: '8710e56fa3685f6c30a90cd062d532dce0348cce',
    fixturePayloadPath: 'events/event.real.2182.json',
    sourceAssetPath: '/p/dh16/12/12880864060507010fe0f8f4938a0bf3789c83cc09b91db03fe8b9d86d30cdb2.webp',
    sourceAssetUrl: 'https://static.kenigevents.ru/p/dh16/12/12880864060507010fe0f8f4938a0bf3789c83cc09b91db03fe8b9d86d30cdb2.webp',
    sha256: '99d4b75ef3291c90e1457b6fdc3fe89e519b327f9d6c8ff56cd95f763e71ab1e',
    bytes: 229072, width: 1280, height: 853, mimeType: 'image/webp',
    fit: 'cover', acceptedFocal: '50% 50%', sourceRecordRecommendedFocal: '50% 50%',
  }),
});

const CASES = Object.freeze([
  Object.freeze({
    caseId: 'eventcard.desktop-wide-calendar.8006',
    rootId: '313fb1ed-0d5c-8095-8008-912c45090653',
    mediaShapeId: '313fb1ed-0d5c-8095-8008-912c496a2bd5',
    parentGroupId: '313fb1ed-0d5c-8095-8008-912c4750bc80',
    fixtureId: 'event.real.8006', width: 531.797, height: 709.063,
  }),
  Object.freeze({
    caseId: 'eventcard.desktop-packed-calendar-absent.2182',
    rootId: '313fb1ed-0d5c-8095-8008-914c76615924',
    mediaShapeId: '313fb1ed-0d5c-8095-8008-914c7951c6db',
    parentGroupId: '313fb1ed-0d5c-8095-8008-914c781ca4e5',
    fixtureId: 'event.real.2182', width: 531.797, height: 425.438,
  }),
  Object.freeze({
    caseId: 'eventcard.mobile-wide-calendar.8006',
    rootId: '313fb1ed-0d5c-8095-8008-916b340de148',
    mediaShapeId: '313fb1ed-0d5c-8095-8008-916b36946441',
    parentGroupId: '313fb1ed-0d5c-8095-8008-916b35bb96c6',
    fixtureId: 'event.real.8006', width: 338, height: 450.656,
  }),
  Object.freeze({
    caseId: 'eventcard.mobile-packed-calendar-absent.2182',
    rootId: '313fb1ed-0d5c-8095-8008-916bd0ab6c98',
    mediaShapeId: '313fb1ed-0d5c-8095-8008-916bd3f8cdb2',
    parentGroupId: '313fb1ed-0d5c-8095-8008-916bd27764ed',
    fixtureId: 'event.real.2182', width: 338, height: 270.391,
  }),
]);

class MediaTupleStop extends Error {
  constructor(code, unknownOutcome = false) {
    super(code);
    this.name = 'MediaTupleStop';
    this.code = code;
    this.unknownOutcome = unknownOutcome;
    this.retryAllowed = false;
  }
}
const fail = (code, unknown = false) => { throw new MediaTupleStop(code, unknown); };

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
const sha256 = (value) => crypto.createHash('sha256').update(canonical(value)).digest('hex');
const stringOnly = (value) => {
  if (typeof value !== 'string') fail('MEDIA_R3_PLUGIN_DATA_NOT_STRING');
  return value;
};
const finitePositive = (value) => typeof value === 'number' && Number.isFinite(value) && value > 0;

function sourceRegistrySha256() {
  return sha256(SOURCE_ASSETS);
}

function collection(adapter) {
  const value = adapter.collection(COLLECTION_ID);
  if (!value || value.rootId !== COLLECTION_ID || value.children !== 18 || value.components !== 18 ||
      !Array.isArray(value.validation) || value.validation.length !== 0 ||
      typeof value.protectedDigest !== 'string' || !value.protectedDigest) {
    fail('MEDIA_R3_COLLECTION_DRIFT');
  }
  return structuredClone(value);
}

function assertAssetBytes(adapter, asset) {
  const actual = adapter.asset(asset.sourceAssetPath);
  if (!actual || actual.sha256 !== asset.sha256 || actual.bytes !== asset.bytes ||
      actual.mimeType !== asset.mimeType) fail('MEDIA_R3_SOURCE_ASSET_BYTES_MISMATCH');
}

function normalizeMediaRow(adapter, spec) {
  const rows = adapter.media(spec.mediaShapeId);
  if (!Array.isArray(rows) || rows.length !== 1) fail('MEDIA_R3_MEDIA_ID_CARDINALITY');
  const row = structuredClone(rows[0]);
  const asset = SOURCE_ASSETS[spec.fixtureId];
  if (!row.id || row.id !== spec.mediaShapeId || row.rootId !== spec.rootId ||
      row.parentId !== spec.parentGroupId) fail('MEDIA_R3_ROOT_MEDIA_PARENT_ID_DRIFT');
  if (!row.imageData || typeof row.imageData.id !== 'string' || !row.imageData.id ||
      typeof row.imageData.name !== 'string' || !row.imageData.name ||
      row.imageData.width !== asset.width || row.imageData.height !== asset.height ||
      row.imageData.mtype !== asset.mimeType) fail('MEDIA_R3_IMAGE_DATA_IDENTITY_MISSING_OR_DRIFT');
  if (!finitePositive(row.bounds?.width) || !finitePositive(row.bounds?.height) ||
      Math.abs(row.bounds.width - spec.width) > 0.001 || Math.abs(row.bounds.height - spec.height) > 0.001 ||
      !Number.isFinite(row.local?.x) || !Number.isFinite(row.local?.y) ||
      !Number.isFinite(row.parent?.x) || !Number.isFinite(row.parent?.y)) {
    fail('MEDIA_R3_GEOMETRY_DRIFT');
  }
  // ShapeBase exposes rotation/flip but no general transform field. A truthful
  // native projection therefore uses null when transform is unavailable.
  if (!Array.isArray(row.fills) || row.fills.length === 0 ||
      (row.transform !== null && typeof row.transform !== 'object') ||
      !Number.isFinite(row.rotation) || typeof row.flipX !== 'boolean' || typeof row.flipY !== 'boolean') {
    fail('MEDIA_R3_FILL_OR_TRANSFORM_MISSING');
  }
  if (row.fit !== asset.fit || row.focal !== asset.acceptedFocal ||
      row.rotation !== 0 || row.flipX !== false || row.flipY !== false) {
    fail('MEDIA_R3_FIT_FOCAL_TRANSFORM_DRIFT');
  }
  // The current Penpot ImageData surface does not expose product semantic slots.
  // The accepted U0 case/root/shape map supplies the exact slot; a conflicting
  // native value, if one is present, is rejected.
  if (row.semanticSlot != null && row.semanticSlot !== SEMANTIC_SLOT) fail('MEDIA_R3_SEMANTIC_SLOT_CONFLICT');
  assertAssetBytes(adapter, asset);
  return {
    caseId: spec.caseId,
    rootId: spec.rootId,
    mediaShapeId: spec.mediaShapeId,
    parentGroupId: spec.parentGroupId,
    fixtureId: spec.fixtureId,
    semanticMediaSlot: SEMANTIC_SLOT,
    localCoordinates: row.local,
    parentCoordinates: row.parent,
    bounds: row.bounds,
    fills: row.fills,
    imageDataIdentity: row.imageData,
    transform: row.transform,
    rotation: row.rotation,
    horizontalFlip: row.flipX,
    verticalFlip: row.flipY,
    fit: row.fit,
    focal: row.focal,
    exactSourceAsset: asset,
    existingSourceEvidence: row.sourceEvidence || null,
    nativeImageDataReadback: row.nativeImageDataReadback || null,
  };
}

function projectEventcardMediaSameTupleR3(adapter) {
  const identity = adapter.identity();
  if (!identity || identity.fileId !== FILE_ID || identity.pageId !== PAGE_ID ||
      !Number.isInteger(identity.revision)) fail('MEDIA_R3_CURRENT_REVISION_MISSING');
  const protectedCollection = collection(adapter);
  const rows = CASES.map((spec) => normalizeMediaRow(adapter, spec));
  if (new Set(rows.map((row) => row.mediaShapeId)).size !== 4) fail('MEDIA_R3_DUPLICATE_MEDIA_ID');
  if (new Set(rows.map((row) => row.parentGroupId)).size !== 4) fail('MEDIA_R3_DUPLICATE_PARENT_ID');

  const payload = {
    schema: 'kenigevents.eventcard-media-same-tuple-projection.r3',
    packageId: PACKAGE_ID,
    revision: identity.revision,
    rows,
    sourceRegistrySha256: sourceRegistrySha256(),
    protectedCollectionDigest: protectedCollection.protectedDigest,
    mutationFree: true,
  };
  return { ...payload, projectionSha256: sha256(payload), penpotMutations: 0 };
}

function assertAuthorization(auth, projection) {
  if (!auth || auth.schema !== 'kenigevents.eventcard-media-same-tuple-authorization.r3' ||
      auth.packageId !== PACKAGE_ID || auth.parentPackageId !== PARENT_PACKAGE_ID ||
      auth.state !== 'ACTIVE' || auth.authorized !== true || auth.cancelled !== false) {
    fail('MEDIA_R3_AUTHORIZATION_MISMATCH');
  }
  if (auth.revision !== projection.revision) fail('MEDIA_R3_STALE_REVISION');
  if (auth.projectionSha256 !== projection.projectionSha256) fail('MEDIA_R3_STALE_PROJECTION_SHA');
  if (auth.sourceRegistrySha256 !== projection.sourceRegistrySha256) fail('MEDIA_R3_STALE_SOURCE_REGISTRY_SHA');
}

function immutableGeometry(row) {
  return {
    rootId: row.rootId, mediaShapeId: row.mediaShapeId, parentGroupId: row.parentGroupId,
    localCoordinates: row.localCoordinates, parentCoordinates: row.parentCoordinates,
    bounds: row.bounds, transform: row.transform, rotation: row.rotation,
    horizontalFlip: row.horizontalFlip, verticalFlip: row.verticalFlip,
    fit: row.fit, focal: row.focal,
  };
}

async function executeEventcardMediaSameTupleR3(adapter, authorization) {
  if (adapter.marker(PACKAGE_ID)) fail('MEDIA_R3_EXECUTOR_REPLAY_FORBIDDEN');
  const preflight = projectEventcardMediaSameTupleR3(adapter);
  assertAuthorization(authorization, preflight);
  const recheck = projectEventcardMediaSameTupleR3(adapter);
  if (recheck.revision !== authorization.revision ||
      recheck.projectionSha256 !== authorization.projectionSha256) {
    fail('MEDIA_R3_PROJECTION_CHANGED_BEFORE_MUTATION');
  }
  const beforeGeometry = recheck.rows.map(immutableGeometry);

  try {
    await adapter.atomic(async (transaction) => {
      for (const row of recheck.rows) {
        if (adapter.identity().revision !== authorization.revision) fail('MEDIA_R3_STALE_REVISION_DURING_MUTATION');
        const asset = SOURCE_ASSETS[row.fixtureId];
        assertAssetBytes(adapter, asset);
        await adapter.applyExactSourceInPlace(transaction, row.mediaShapeId, asset);
        adapter.setEvidence(row.mediaShapeId, 'kenigevents-eventcard-media-source-sha256', stringOnly(asset.sha256));
        adapter.setEvidence(row.mediaShapeId, 'kenigevents-eventcard-media-source-bytes', stringOnly(String(asset.bytes)));
        adapter.setEvidence(row.mediaShapeId, 'kenigevents-eventcard-media-source-path', stringOnly(asset.sourceAssetPath));
        adapter.setEvidence(row.mediaShapeId, 'kenigevents-eventcard-media-semantic-slot', stringOnly(SEMANTIC_SLOT));
      }
    });
  } catch (error) {
    if (error instanceof MediaTupleStop) throw error;
    fail('MEDIA_R3_TIMEOUT_OR_UNKNOWN_OUTCOME', true);
  }

  const after = projectEventcardMediaSameTupleR3(adapter);
  if (canonical(after.rows.map(immutableGeometry)) !== canonical(beforeGeometry) ||
      after.protectedCollectionDigest !== preflight.protectedCollectionDigest) {
    fail('MEDIA_R3_NON_FILL_OR_PROTECTED_DRIFT', true);
  }
  for (const row of after.rows) {
    const asset = SOURCE_ASSETS[row.fixtureId];
    const evidence = adapter.sourceEvidence(row.mediaShapeId);
    if (!evidence || evidence.sha256 !== asset.sha256 || evidence.bytes !== String(asset.bytes) ||
        evidence.path !== asset.sourceAssetPath || evidence.semanticSlot !== SEMANTIC_SLOT) {
      fail('MEDIA_R3_SOURCE_EVIDENCE_READBACK_DRIFT', true);
    }
  }

  const receipt = {
    schema: 'kenigevents.eventcard-media-same-tuple-execution-receipt.r3',
    packageId: PACKAGE_ID,
    state: 'MEDIA_FOUR_OF_FOUR_PENDING_DISTINCT_READBACK',
    revision: authorization.revision,
    authorizedProjectionSha256: authorization.projectionSha256,
    sourceRegistrySha256: authorization.sourceRegistrySha256,
    rootIds: after.rows.map((row) => row.rootId),
    mediaShapeIds: after.rows.map((row) => row.mediaShapeId),
    parentGroupIds: after.rows.map((row) => row.parentGroupId),
    imageDataIdentities: after.rows.map((row) => row.imageDataIdentity),
    mediaMutations: 4,
    textMutations: 0,
    componentPathMutations: 0,
    overlayMutations: 0,
    retryAllowed: false,
    visualPass: false,
    wholeEventcardPass: false,
  };
  adapter.writeMarker(PACKAGE_ID, stringOnly(canonical(receipt)));
  return receipt;
}

function readEventcardMediaSettlementR3(adapter, receipt) {
  if (!receipt || receipt.state !== 'MEDIA_FOUR_OF_FOUR_PENDING_DISTINCT_READBACK' ||
      !adapter.marker(PACKAGE_ID)) fail('MEDIA_R3_SETTLEMENT_RECEIPT_REQUIRED');
  const projection = projectEventcardMediaSameTupleR3(adapter);
  if (canonical(projection.rows.map((row) => row.mediaShapeId)) !== canonical(receipt.mediaShapeIds) ||
      canonical(projection.rows.map((row) => row.parentGroupId)) !== canonical(receipt.parentGroupIds) ||
      projection.sourceRegistrySha256 !== receipt.sourceRegistrySha256) {
    fail('MEDIA_R3_SETTLEMENT_ID_OR_SOURCE_DRIFT');
  }
  for (const row of projection.rows) {
    const asset = SOURCE_ASSETS[row.fixtureId];
    const coverage = adapter.coverage(row.mediaShapeId);
    if (!coverage || coverage.status !== 'KNOWN_PASS' || coverage.uncoveredPixels !== 0 ||
        coverage.opaqueOverlays !== 0 || coverage.sourceSha256 !== asset.sha256) {
      fail('MEDIA_R3_SETTLEMENT_COVERAGE_FAIL');
    }
  }
  return {
    state: 'MEDIA_FOUR_OF_FOUR_READBACK_PASS_PENDING_V0',
    rows: 4,
    readbackMutations: 0,
    visualPass: false,
    wholeEventcardPass: false,
  };
}

module.exports = {
  PACKAGE_ID, PARENT_PACKAGE_ID, FILE_ID, PAGE_ID, COLLECTION_ID, SEMANTIC_SLOT,
  SOURCE_ASSETS, CASES, MediaTupleStop, canonical, sha256, stringOnly, sourceRegistrySha256,
  projectEventcardMediaSameTupleR3, executeEventcardMediaSameTupleR3,
  readEventcardMediaSettlementR3,
};

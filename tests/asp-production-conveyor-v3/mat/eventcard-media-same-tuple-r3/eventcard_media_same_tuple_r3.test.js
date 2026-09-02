'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../../../../scripts/asp-production-conveyor-v3/mat/eventcard-media-same-tuple-r3/eventcard_media_same_tuple_r3.js');

class Adapter {
  constructor() {
    this.revision = 180;
    this.markerValue = '';
    this.protectedDigest = 'protected-stable';
    this.timeout = false;
    this.badAsset = false;
    this.rows = new Map();
    this.evidence = new Map();
    for (const [index, spec] of M.CASES.entries()) {
      const asset = M.SOURCE_ASSETS[spec.fixtureId];
      this.rows.set(spec.mediaShapeId, {
        id: spec.mediaShapeId,
        rootId: spec.rootId,
        parentId: spec.parentGroupId,
        local: { x: index * 10, y: index * 11 },
        parent: { x: 100 + index, y: 200 + index },
        bounds: { x: 100 + index, y: 200 + index, width: spec.width, height: spec.height },
        fills: [{ fillImage: `image-data-${spec.fixtureId}`, fillOpacity: 1 }],
        imageData: {
          id: `native-image-${index}`,
          name: `source-${spec.fixtureId}.webp`,
          width: asset.width,
          height: asset.height,
          mtype: asset.mimeType,
        },
        transform: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
        rotation: 0,
        flipX: false,
        flipY: false,
        fit: asset.fit,
        focal: asset.acceptedFocal,
      });
    }
  }
  identity() { return { fileId: M.FILE_ID, pageId: M.PAGE_ID, revision: this.revision }; }
  collection() {
    return {
      rootId: M.COLLECTION_ID, children: 18, components: 18, validation: [],
      protectedDigest: this.protectedDigest,
    };
  }
  media(id) { const row = this.rows.get(id); return row ? [structuredClone(row)] : []; }
  asset(path) {
    const asset = Object.values(M.SOURCE_ASSETS).find((item) => item.sourceAssetPath === path);
    if (!asset) return null;
    return {
      sha256: this.badAsset ? '0'.repeat(64) : asset.sha256,
      bytes: asset.bytes,
      mimeType: asset.mimeType,
    };
  }
  marker() { return this.markerValue; }
  writeMarker(_, value) { this.markerValue = value; }
  async atomic(operation) {
    if (this.timeout) throw Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' });
    return operation({});
  }
  async applyExactSourceInPlace(_, mediaId, asset) {
    const row = this.rows.get(mediaId);
    row.fills = [{ fillImage: `bound:${asset.sha256}`, fillOpacity: 1 }];
    row.imageData = {
      id: `bound-${asset.sha256.slice(0, 12)}`,
      name: asset.sourceAssetPath.split('/').at(-1),
      width: asset.width,
      height: asset.height,
      mtype: asset.mimeType,
    };
  }
  setEvidence(mediaId, key, value) {
    const row = this.evidence.get(mediaId) || {};
    const map = {
      'kenigevents-eventcard-media-source-sha256': 'sha256',
      'kenigevents-eventcard-media-source-bytes': 'bytes',
      'kenigevents-eventcard-media-source-path': 'path',
      'kenigevents-eventcard-media-semantic-slot': 'semanticSlot',
    };
    row[map[key]] = value;
    this.evidence.set(mediaId, row);
  }
  sourceEvidence(mediaId) { return structuredClone(this.evidence.get(mediaId) || null); }
  coverage(mediaId) {
    const evidence = this.evidence.get(mediaId);
    return evidence ? {
      status: 'KNOWN_PASS',
      uncoveredPixels: 0,
      opaqueOverlays: 0,
      sourceSha256: evidence.sha256,
    } : null;
  }
}

const authorization = (projection) => ({
  schema: 'kenigevents.eventcard-media-same-tuple-authorization.r3',
  packageId: M.PACKAGE_ID,
  parentPackageId: M.PARENT_PACKAGE_ID,
  state: 'ACTIVE',
  authorized: true,
  cancelled: false,
  revision: projection.revision,
  projectionSha256: projection.projectionSha256,
  sourceRegistrySha256: projection.sourceRegistrySha256,
});

test('projection binds exact four shapes, parents, opaque ImageData identities, source assets and semantics', () => {
  const adapter = new Adapter();
  const projection = M.projectEventcardMediaSameTupleR3(adapter);
  assert.equal(projection.rows.length, 4);
  assert.equal(new Set(projection.rows.map((row) => row.mediaShapeId)).size, 4);
  assert.equal(new Set(projection.rows.map((row) => row.parentGroupId)).size, 4);
  assert.equal(projection.rows.every((row) => row.semanticMediaSlot === M.SEMANTIC_SLOT), true);
  assert.equal(projection.rows.every((row) => row.imageDataIdentity.id && row.imageDataIdentity.name), true);
  assert.equal(projection.projectionSha256, M.projectEventcardMediaSameTupleR3(adapter).projectionSha256);
});

test('same-tuple execution binds exact source bytes in place and preserves geometry/fit/focal/transform', async () => {
  const adapter = new Adapter();
  const before = M.projectEventcardMediaSameTupleR3(adapter);
  const geometry = before.rows.map((row) => ({
    id: row.mediaShapeId, parent: row.parentGroupId, bounds: row.bounds,
    fit: row.fit, focal: row.focal, transform: row.transform, rotation: row.rotation,
    flipX: row.horizontalFlip, flipY: row.verticalFlip,
  }));
  const receipt = await M.executeEventcardMediaSameTupleR3(adapter, authorization(before));
  assert.equal(receipt.mediaMutations, 4);
  const after = M.projectEventcardMediaSameTupleR3(adapter);
  assert.deepEqual(after.rows.map((row) => ({
    id: row.mediaShapeId, parent: row.parentGroupId, bounds: row.bounds,
    fit: row.fit, focal: row.focal, transform: row.transform, rotation: row.rotation,
    flipX: row.horizontalFlip, flipY: row.verticalFlip,
  })), geometry);
  assert.equal(M.readEventcardMediaSettlementR3(adapter, receipt).rows, 4);
  await assert.rejects(
    () => M.executeEventcardMediaSameTupleR3(adapter, authorization(before)),
    (error) => error.code === 'MEDIA_R3_EXECUTOR_REPLAY_FORBIDDEN'
  );
});

test('wrong source bytes or semantic/identity/geometry drift fails before mutation', () => {
  let adapter = new Adapter();
  adapter.badAsset = true;
  assert.throws(() => M.projectEventcardMediaSameTupleR3(adapter), (error) => error.code === 'MEDIA_R3_SOURCE_ASSET_BYTES_MISMATCH');
  adapter = new Adapter();
  const first = M.CASES[0];
  adapter.rows.get(first.mediaShapeId).semanticSlot = 'wrong';
  assert.throws(() => M.projectEventcardMediaSameTupleR3(adapter), (error) => error.code === 'MEDIA_R3_SEMANTIC_SLOT_CONFLICT');
  adapter = new Adapter();
  adapter.rows.get(first.mediaShapeId).imageData.id = '';
  assert.throws(() => M.projectEventcardMediaSameTupleR3(adapter), (error) => error.code === 'MEDIA_R3_IMAGE_DATA_IDENTITY_MISSING_OR_DRIFT');
  adapter = new Adapter();
  adapter.rows.get(first.mediaShapeId).bounds.width += 3;
  assert.throws(() => M.projectEventcardMediaSameTupleR3(adapter), (error) => error.code === 'MEDIA_R3_GEOMETRY_DRIFT');
});

test('missing and duplicate media or parent IDs fail closed', () => {
  let adapter = new Adapter();
  adapter.rows.delete(M.CASES[0].mediaShapeId);
  assert.throws(() => M.projectEventcardMediaSameTupleR3(adapter), (error) => error.code === 'MEDIA_R3_MEDIA_ID_CARDINALITY');
  adapter = new Adapter();
  const first = adapter.rows.get(M.CASES[0].mediaShapeId);
  const secondKey = M.CASES[1].mediaShapeId;
  const second = adapter.rows.get(secondKey);
  second.id = first.id;
  assert.throws(() => M.projectEventcardMediaSameTupleR3(adapter), (error) => error.code === 'MEDIA_R3_ROOT_MEDIA_PARENT_ID_DRIFT');
});

test('stale revision, stale projection/source registry and protected drift fail closed', async () => {
  let adapter = new Adapter();
  let projection = M.projectEventcardMediaSameTupleR3(adapter);
  adapter.revision += 1;
  await assert.rejects(
    () => M.executeEventcardMediaSameTupleR3(adapter, authorization(projection)),
    (error) => error.code === 'MEDIA_R3_STALE_REVISION'
  );
  adapter = new Adapter();
  projection = M.projectEventcardMediaSameTupleR3(adapter);
  adapter.protectedDigest = 'changed';
  await assert.rejects(
    () => M.executeEventcardMediaSameTupleR3(adapter, authorization(projection)),
    (error) => error.code === 'MEDIA_R3_STALE_PROJECTION_SHA'
  );
  adapter = new Adapter();
  projection = M.projectEventcardMediaSameTupleR3(adapter);
  const bad = authorization(projection);
  bad.sourceRegistrySha256 = '0'.repeat(64);
  await assert.rejects(
    () => M.executeEventcardMediaSameTupleR3(adapter, bad),
    (error) => error.code === 'MEDIA_R3_STALE_SOURCE_REGISTRY_SHA'
  );
});

test('timeout/unknown outcome forbids blind retry; evidence plugin data is string-only', async () => {
  const adapter = new Adapter();
  const projection = M.projectEventcardMediaSameTupleR3(adapter);
  adapter.timeout = true;
  await assert.rejects(
    () => M.executeEventcardMediaSameTupleR3(adapter, authorization(projection)),
    (error) => error.code === 'MEDIA_R3_TIMEOUT_OR_UNKNOWN_OUTCOME' && error.unknownOutcome && error.retryAllowed === false
  );
  assert.throws(() => M.stringOnly(111072), (error) => error.code === 'MEDIA_R3_PLUGIN_DATA_NOT_STRING');
  assert.equal(M.stringOnly('111072'), '111072');
});

test('source registry records the exact events-bot-new paths, byte counts and SHA-256 identities', () => {
  const a = M.SOURCE_ASSETS['event.real.8006'];
  const b = M.SOURCE_ASSETS['event.real.2182'];
  assert.equal(a.sourceAssetPath, '/p/image/v2/dd/dd8834258d4a1ebde029aca1960bdd224bdf636d3fd8aee8fc7824012475de8b.webp');
  assert.equal(a.bytes, 111072);
  assert.equal(a.sha256, 'dd8834258d4a1ebde029aca1960bdd224bdf636d3fd8aee8fc7824012475de8b');
  assert.equal(b.sourceAssetPath, '/p/dh16/12/12880864060507010fe0f8f4938a0bf3789c83cc09b91db03fe8b9d86d30cdb2.webp');
  assert.equal(b.bytes, 229072);
  assert.equal(b.sha256, '99d4b75ef3291c90e1457b6fdc3fe89e519b327f9d6c8ff56cd95f763e71ab1e');
});

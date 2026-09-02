'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const M = require('../../../../scripts/asp-production-conveyor-v3/mat/eventcard-media-same-tuple-r3/eventcard_media_same_tuple_r3.js');
const R = require('../../../../scripts/asp-production-conveyor-v3/mat/eventcard-media-same-tuple-r3/eventcard_media_penpot_runtime_r3.js');

const HEAD = 'a'.repeat(40), TREE = 'b'.repeat(40);
const ASSET_DIR = path.resolve(__dirname, '../../../../catalog/asp-production-conveyor-v3/mat/eventcard-media-same-tuple-r3/assets');

class FakeImageData {
  constructor(asset, bytes, id) {
    this.id = id; this.name = asset.sourceAssetPath.split('/').at(-1);
    this.width = asset.width; this.height = asset.height; this.mtype = asset.mimeType;
    this.bytes = new Uint8Array(bytes); this.dataReads = 0;
  }
  async data() { this.dataReads += 1; return new Uint8Array(this.bytes); }
}

class Fixture {
  constructor() {
    this.nowValue = 1_000; this.shared = new Map(); this.opened = [];
    this.uploads = []; this.fillWrites = []; this.evidenceWrites = []; this.nativeHook = null;
    this.sourceAssets = {};
    for (const asset of Object.values(M.SOURCE_ASSETS)) {
      this.sourceAssets[asset.sha256] = new Uint8Array(fs.readFileSync(path.join(ASSET_DIR, `${asset.sha256}.webp`)));
    }
    this.board = { id: M.COLLECTION_ID, name: 'KenigEvents · G12 bounded L0-L3', type: 'board', children: [] };
    const root = { id: 'page-root', type: 'root', name: 'Page root', children: [this.board] };
    this.board.parent = root;
    this.mediaShapes = new Map();
    for (const [index, spec] of M.CASES.entries()) {
      const asset = M.SOURCE_ASSETS[spec.fixtureId];
      const caseRoot = { id: spec.rootId, name: spec.caseId, type: 'board', children: [], parent: this.board,
        x: index * 600, y: 20, width: spec.width, height: spec.height };
      const parent = { id: spec.parentGroupId, name: 'event.media-frame', type: 'group', children: [], parent: caseRoot,
        x: 30 + index, y: 40 + index, width: spec.width, height: spec.height };
      const image = new FakeImageData(asset, this.sourceAssets[asset.sha256], `initial-image-${index}`);
      const plugins = new Map();
      const shape = { id: spec.mediaShapeId, name: 'image-content', type: 'rect', children: [], parent,
        x: 10 + index, y: 11 + index, width: spec.width, height: spec.height,
        rotation: 0, flipX: false, flipY: false,
        getSharedPluginData: (namespace, key) => plugins.get(`${namespace}:${key}`) || '',
        setSharedPluginData: (namespace, key, value) => {
          if (typeof value !== 'string') throw new TypeError('plugin data requires string');
          plugins.set(`${namespace}:${key}`, value); this.evidenceWrites.push([shape.id, key, value]);
          this.nativeHook?.('evidence', this.evidenceWrites.length);
        },
      };
      let fills = [{ fillImage: image, fillOpacity: 1, fillImageKeepAspectRatio: asset.fit === 'contain' }];
      Object.defineProperty(shape, 'fills', { enumerable: true, get: () => fills, set: (value) => {
        fills = value; this.fillWrites.push(shape.id); this.nativeHook?.('fill', this.fillWrites.length);
      }});
      parent.children.push(shape); caseRoot.children.push(parent); this.board.children.push(caseRoot);
      this.mediaShapes.set(shape.id, shape);
    }
    while (this.board.children.length < 18) {
      const index = this.board.children.length;
      this.board.children.push({ id: `dummy-main-${index}`, name: `event.leaf.${index}`, type: 'board',
        x: index, y: 0, width: 1, height: 1, children: [], parent: this.board });
    }
    this.targetPage = { id: M.PAGE_ID, name: '00 · Components · Free collection', root };
    this.otherPage = { id: 'other-page', root: { id: 'other-root', children: [] } };
    this.components = Array.from({ length: 35 }, (_, index) => {
      const target = index < 18;
      const name = target ? (index < 14 ? `event.leaf.${index}` : `eventcard.case.${index}`) : `other.component.${index}`;
      const main = { id: `component-main-${index}`, name, children: [] };
      return { id: `component-${index}`, name, path: `Path / ${index}`, mainInstance: () => main };
    });
    this.file = { id: M.FILE_ID, revn: 180, pages: [this.otherPage, this.targetPage], validate: () => [],
      getSharedPluginData: (namespace, key) => this.shared.get(`${namespace}:${key}`) || '',
      setSharedPluginData: (namespace, key, value) => {
        if (typeof value !== 'string') throw new TypeError('plugin data requires string');
        this.shared.set(`${namespace}:${key}`, value); this.nativeHook?.('receipt', 1);
      } };
    this.penpot = { currentFile: this.file, currentPage: this.otherPage,
      library: { local: { components: this.components } },
      openPage: async (page) => { this.penpot.currentPage = page; this.opened.push(page.id); },
      uploadMediaData: async (name, bytes, mimeType) => {
        const asset = Object.values(M.SOURCE_ASSETS).find((value) => value.sha256 === name.replace('.webp', '')) ||
          Object.values(M.SOURCE_ASSETS).find((value) => value.mimeType === mimeType && value.bytes === bytes.byteLength);
        const image = new FakeImageData(asset, bytes, `uploaded-${this.uploads.length}`);
        this.uploads.push(image); this.nativeHook?.('upload', this.uploads.length); return image;
      } };
    this.active = null;
    this.context = { penpot: this.penpot, exactPackageHead: HEAD, exactPackageTree: TREE,
      sourceAssets: this.sourceAssets, pageProfile: { profileId: 'free-collection.owner-review.v1',
        state: 'BLOCKED_OWNER_REJECTED', allowedToMutatePenpot: false, profileSha256: 'e'.repeat(64) },
      readActiveMarker: () => this.active, now: () => this.nowValue,
      readNativeCoverage: async (mediaShapeId) => {
        const spec = M.CASES.find((value) => value.mediaShapeId === mediaShapeId), asset = M.SOURCE_ASSETS[spec.fixtureId];
        return { status: 'KNOWN_PASS', uncoveredPixels: 0, opaqueOverlays: 0, sourceSha256: asset.sha256 };
      } };
  }

  authorize(projection) {
    const provenance = { sessionId: 'session-01a0581e', taskId: 'task-eventcard-media-r3', writerId: '/root/publish',
      packageId: M.PACKAGE_ID, packageHead: HEAD, packageTree: TREE, triggeredBy: 'issue-57-morning-media',
      pageProfileSha256: this.context.pageProfile.profileSha256, ownerDirective: R.OWNER_DIRECTIVE,
      authorityCardCommentId: R.AUTHORITY_CARD_COMMENT_ID, authorityScope: R.AUTHORITY_SCOPE,
      leaseToken: 'lease-eventcard-media', leaseExpiresAt: 5_000 };
    const authorization = { schema: R.AUTH_SCHEMA, packageId: M.PACKAGE_ID, parentPackageId: M.PARENT_PACKAGE_ID,
      packageHead: HEAD, packageTree: TREE, state: 'ACTIVE', authorized: true, cancelled: false,
      revision: projection.revision, projectionSha256: projection.projectionSha256,
      sourceRegistrySha256: M.sourceRegistrySha256(), pageProfileSha256: provenance.pageProfileSha256,
      ownerDirective: R.OWNER_DIRECTIVE, authorityCardCommentId: R.AUTHORITY_CARD_COMMENT_ID,
      authorityScope: R.AUTHORITY_SCOPE, triggeredBy: provenance.triggeredBy, provenance };
    this.active = { schema: R.ACTIVE_SCHEMA, state: 'ACTIVE', authorized: true, cancelled: false,
      sessionId: provenance.sessionId, taskId: provenance.taskId, writerId: provenance.writerId,
      packageId: provenance.packageId, packageHead: provenance.packageHead, packageTree: provenance.packageTree,
      triggeredBy: provenance.triggeredBy, pageProfileSha256: provenance.pageProfileSha256,
      ownerDirective: provenance.ownerDirective, authorityCardCommentId: provenance.authorityCardCommentId,
      authorityScope: provenance.authorityScope, leaseToken: provenance.leaseToken,
      leaseExpiresAt: provenance.leaseExpiresAt };
    return authorization;
  }
}

test('fresh concrete read activates exact page and hashes ImageData.data for all four exact targets', async () => {
  const fixture = new Fixture();
  const projection = await R.projectEventcardMediaPenpotR3(fixture.context);
  assert.deepEqual(fixture.opened, [M.PAGE_ID]);
  assert.equal(projection.rows.length, 4);
  assert.equal(projection.fileLocalComponents, 35);
  assert.equal(projection.rows.every((row) => row.transform === null), true);
  assert.equal(projection.rows.every((row) => row.nativeImageDataReadback.sha256 === M.SOURCE_ASSETS[row.fixtureId].sha256), true);
  assert.equal(projection.rows.every((row) => row.nativeImageDataReadback.bytes === M.SOURCE_ASSETS[row.fixtureId].bytes), true);
});

test('executes four exact in-place fills, verifies pre/post bytes, settles coverage, and replay is zero', async () => {
  const fixture = new Fixture(), before = await R.projectEventcardMediaPenpotR3(fixture.context);
  const geometry = before.rows.map((row) => [row.rootId, row.mediaShapeId, row.parentGroupId, row.bounds,
    row.localCoordinates, row.parentCoordinates, row.transform, row.rotation, row.horizontalFlip, row.verticalFlip, row.fit, row.focal]);
  let checks = 0; fixture.context.readActiveMarker = () => { checks += 1; return fixture.active; };
  const receipt = await R.executeEventcardMediaPenpotR3(fixture.context, fixture.authorize(before));
  assert.equal(receipt.mediaFillMutations, 4); assert.equal(receipt.evidenceMutations, 16);
  assert.equal(receipt.nativeMutationCalls, 24); assert.equal(fixture.uploads.length, 4);
  assert.equal(fixture.fillWrites.length, 4); assert.equal(fixture.evidenceWrites.length, 16);
  assert.ok(checks >= 27);
  const after = await R.projectEventcardMediaPenpotR3(fixture.context);
  assert.deepEqual(after.rows.map((row) => [row.rootId, row.mediaShapeId, row.parentGroupId, row.bounds,
    row.localCoordinates, row.parentCoordinates, row.transform, row.rotation, row.horizontalFlip, row.verticalFlip, row.fit, row.focal]), geometry);
  assert.equal(after.rows.every((row) => row.nativeImageDataReadback.sha256 === M.SOURCE_ASSETS[row.fixtureId].sha256), true);
  const settlement = await R.readEventcardMediaPenpotSettlementR3(fixture.context, receipt);
  assert.equal(settlement.rows, 4); assert.equal(settlement.readbackMutations, 0);
  const replay = await R.executeEventcardMediaPenpotR3(fixture.context, fixture.authorize(after));
  assert.equal(replay.state, 'REPLAY_NOOP'); assert.equal(replay.secondRunCreated, 0);
  assert.equal(fixture.uploads.length, 4);
});

test('package bytes, head/tree, current projection, owner Media scope and physical tuple fail closed', async () => {
  for (const mutate of [
    (fixture, auth) => { auth.packageHead = 'c'.repeat(40); },
    (fixture, auth) => { auth.projectionSha256 = '0'.repeat(64); },
    (fixture, auth) => { auth.authorityScope = 'EVENTCARD_TEXT_ONLY'; },
    (fixture) => { fixture.active.writerId = '/root/other'; },
    (fixture) => { fixture.context.sourceAssets[M.SOURCE_ASSETS['event.real.8006'].sha256] = new Uint8Array(111072); },
  ]) {
    const fixture = new Fixture(), projection = await R.projectEventcardMediaPenpotR3(fixture.context), auth = fixture.authorize(projection);
    mutate(fixture, auth);
    await assert.rejects(() => R.executeEventcardMediaPenpotR3(fixture.context, auth),
      (error) => String(error.code || '').startsWith('MEDIA_R3_'));
    assert.equal(fixture.fillWrites.length, 0);
  }
});

test('cancel after upload blocks the fill setter and returns a distinct no-retry readback', async () => {
  const fixture = new Fixture(), projection = await R.projectEventcardMediaPenpotR3(fixture.context), auth = fixture.authorize(projection);
  fixture.nativeHook = (kind, count) => { if (kind === 'upload' && count === 1) fixture.active.cancelled = true; };
  await assert.rejects(() => R.executeEventcardMediaPenpotR3(fixture.context, auth), (error) => {
    assert.equal(error.unknownOutcome, true); assert.equal(error.retryAllowed, false);
    assert.equal(error.requiredNextOperation, 'DISTINCT_READ_ONLY_FOUR_TARGET_PROJECTION');
    assert.equal(error.nativeMutationCallsBeforeStop, 1); return true;
  });
  assert.equal(fixture.uploads.length, 1); assert.equal(fixture.fillWrites.length, 0);
});

test('lease expiry after first target evidence blocks the next native call without blind retry', async () => {
  const fixture = new Fixture(), projection = await R.projectEventcardMediaPenpotR3(fixture.context), auth = fixture.authorize(projection);
  fixture.nativeHook = (kind, count) => { if (kind === 'evidence' && count === 1) fixture.nowValue = 5_000; };
  await assert.rejects(() => R.executeEventcardMediaPenpotR3(fixture.context, auth),
    (error) => error.unknownOutcome === true && error.nativeMutationCallsBeforeStop === 3);
  assert.equal(fixture.evidenceWrites.length, 1);
});

test('Text authority cannot authorize Media and current-page activation is lease guarded', async () => {
  const fixture = new Fixture(), projection = await R.projectEventcardMediaPenpotR3(fixture.context), auth = fixture.authorize(projection);
  auth.ownerDirective = 'APPROVE_EVENTCARD_TEXT_ONE_BOUNDED_MUTATION';
  await assert.rejects(() => R.executeEventcardMediaPenpotR3(fixture.context, auth),
    (error) => error.code === 'MEDIA_R3_AUTH_OWNERDIRECTIVE_MISMATCH');
  const valid = fixture.authorize(projection); fixture.penpot.currentPage = fixture.otherPage; fixture.opened.length = 0; fixture.active = null;
  await assert.rejects(() => R.executeEventcardMediaPenpotR3(fixture.context, valid),
    (error) => error.code === 'MEDIA_R3_PHYSICAL_ACTIVE_MISSING');
  assert.deepEqual(fixture.opened, []);
});

test('strict shared plugin data accepts only strings and coverage failure blocks settlement', async () => {
  const fixture = new Fixture();
  for (const value of [374, {}, true, null, undefined]) assert.throws(() => fixture.file.setSharedPluginData('x', 'y', value), TypeError);
  const projection = await R.projectEventcardMediaPenpotR3(fixture.context), receipt = await R.executeEventcardMediaPenpotR3(fixture.context, fixture.authorize(projection));
  fixture.context.readNativeCoverage = async () => ({ status: 'KNOWN_FAIL', uncoveredPixels: 1, opaqueOverlays: 0 });
  await assert.rejects(() => R.readEventcardMediaPenpotSettlementR3(fixture.context, receipt),
    (error) => error.code === 'MEDIA_R3_SETTLEMENT_COVERAGE_FAIL');
});

test('missing native coverage reader blocks before every upload, fill, evidence and receipt call', async () => {
  const fixture = new Fixture();
  const projection = await R.projectEventcardMediaPenpotR3(fixture.context), auth = fixture.authorize(projection);
  fixture.context.readNativeCoverage = undefined;
  await assert.rejects(() => R.executeEventcardMediaPenpotR3(fixture.context, auth),
    (error) => error.code === 'MEDIA_R3_NATIVE_COVERAGE_READBACK_UNAVAILABLE');
  assert.equal(fixture.uploads.length, 0); assert.equal(fixture.fillWrites.length, 0);
  assert.equal(fixture.evidenceWrites.length, 0);
  assert.equal(fixture.shared.has(`${R.NAMESPACE}:${R.RECEIPT_KEY}`), false);
});

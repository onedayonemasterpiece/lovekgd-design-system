'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../../../../scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-linkage-r3/eventcard_component_paths_linkage_r3.js');
const R = require('../../../../scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-linkage-r3/eventcard_component_paths_penpot_runtime_r3.js');

const HEAD = 'a'.repeat(40);
const TREE = 'b'.repeat(40);

class Fixture {
  constructor() {
    this.nowValue = 1_000;
    this.pathWrites = [];
    this.shared = new Map();
    this.opened = [];
    this.afterPathWrite = null;
    const board = { id: M.COLLECTION_ID, name: M.COLLECTION_NAME, type: 'board', children: [] };
    const pageRoot = { id: 'page-root', name: 'Page root', type: 'root', children: [board] };
    board.parent = pageRoot;
    this.components = M.SPECS.map((spec, index) => {
      const main = {
        id: spec.mainId || `main-${String(index).padStart(2, '0')}`,
        name: spec.legacyMain ? `${M.LEGACY_MAIN_PREFIX}${spec.displayName}` : spec.displayName,
        type: 'board', children: [], parent: board, x: index * 10, y: 0, width: 100, height: 100,
      };
      const component = { id: spec.componentId || `component-${String(index).padStart(2, '0')}`,
        name: spec.displayName, mainInstance: () => main };
      let path = spec.legacyMain ? M.LEGACY_PATH : '';
      Object.defineProperty(component, 'path', {
        enumerable: true, configurable: false,
        get: () => path,
        set: (value) => {
          path = value;
          this.pathWrites.push({ componentId: component.id, value });
          this.afterPathWrite?.(this.pathWrites.length, component);
        },
      });
      main.component = () => component;
      board.children.push(main);
      return component;
    });
    for (const [caseIndex, spec] of M.SPECS.slice(14).entries()) {
      const caseComponent = this.components[14 + caseIndex];
      const main = caseComponent.mainInstance();
      const pool = caseIndex < 2 ? this.components.slice(0, 7) : this.components.slice(7, 14);
      const selected = spec.linkedCount === 7 ? pool : pool.filter((_, index) => index !== 4).slice(0, 6);
      main.children = selected.map((leaf, index) => {
        const linked = { id: `linked-${caseIndex}-${index}`, name: `linked ${index}`,
          type: 'instance', children: [], parent: main, x: index, y: 1, width: 8, height: 8,
          component: () => leaf };
        return linked;
      });
    }
    this.targetPage = { id: M.PAGE_ID, name: '00 · Components · Free collection', root: pageRoot };
    this.otherPage = { id: 'other-page', name: 'Other', root: { id: 'other-root', children: [] } };
    this.file = {
      id: M.FILE_ID, revn: 180, pages: [this.otherPage, this.targetPage], validate: () => [],
      getSharedPluginData: (namespace, key) => this.shared.get(`${namespace}:${key}`) || '',
      setSharedPluginData: (namespace, key, value) => {
        if (typeof value !== 'string') throw new TypeError('plugin data requires string');
        this.shared.set(`${namespace}:${key}`, value);
      },
    };
    this.penpot = {
      currentFile: this.file, currentPage: this.otherPage,
      library: { local: { components: this.components } },
      openPage: async (page) => { this.opened.push(page.id); this.penpot.currentPage = page; },
    };
    this.active = null;
    this.context = {
      penpot: this.penpot, exactPackageHead: HEAD, exactPackageTree: TREE,
      pageProfile: { profileId: 'free-collection.owner-review.v1', state: 'ACTIVE',
        allowedToMutatePenpot: true, profileSha256: 'e'.repeat(64) },
      now: () => this.nowValue,
      readActiveMarker: () => this.active,
    };
  }

  authorize(projection, overrides = {}) {
    const provenance = {
      sessionId: 'session-01a0581e', taskId: 'task-eventcard-paths-r3', writerId: '/root/publish',
      packageId: M.PACKAGE_ID, packageHead: HEAD, packageTree: TREE,
      triggeredBy: 'issue-57-comment-5506140332', leaseToken: 'lease-paths-r3-001', leaseExpiresAt: 5_000,
      pageProfileSha256: this.context.pageProfile.profileSha256,
      ...(overrides.provenance || {}),
    };
    const authorization = {
      schema: R.AUTH_SCHEMA, packageId: M.PACKAGE_ID, parentPackageId: M.PARENT_PACKAGE_ID,
      packageHead: HEAD, packageTree: TREE, state: 'ACTIVE', authorized: true, cancelled: false,
      revision: projection.revision, projectionSha256: projection.projectionSha256,
      triggeredBy: provenance.triggeredBy, provenance,
      pageProfileSha256: this.context.pageProfile.profileSha256,
      ...overrides,
    };
    authorization.provenance = provenance;
    this.active = {
      schema: R.ACTIVE_SCHEMA, state: 'ACTIVE', authorized: true, cancelled: false,
      sessionId: provenance.sessionId, taskId: provenance.taskId, writerId: provenance.writerId,
      packageId: provenance.packageId, packageHead: provenance.packageHead, packageTree: provenance.packageTree,
      triggeredBy: provenance.triggeredBy, leaseToken: provenance.leaseToken,
      leaseExpiresAt: provenance.leaseExpiresAt,
      pageProfileSha256: this.context.pageProfile.profileSha256,
    };
    return authorization;
  }
}

test('concrete projection activates the exact current page and proves 18/18/26 baseline', async () => {
  const fixture = new Fixture();
  const projection = await R.projectEventcardPathsPenpotR3(fixture.context, 'baseline');
  assert.deepEqual(fixture.opened, [M.PAGE_ID]);
  assert.equal(projection.currentPageActivated, true);
  assert.equal(projection.concreteNativeProjection, true);
  assert.deepEqual(projection.count, { exact: 0, empty: 15, legacy: 3 });
  assert.equal(projection.componentIds.length, 18);
  assert.equal(projection.mainIds.length, 18);
  assert.equal(projection.linkedInstanceIds.length, 26);
  assert.equal(fixture.pathWrites.length, 0);
});

test('executes path-only repair under exact physical tuple and distinct settlement; replay creates zero', async () => {
  const fixture = new Fixture();
  const before = await R.projectEventcardPathsPenpotR3(fixture.context, 'baseline');
  const names = fixture.components.map((component) => [component.id, component.name,
    component.mainInstance().id, component.mainInstance().name]);
  let checks = 0;
  fixture.context.readActiveMarker = () => { checks += 1; return fixture.active; };
  const receipt = await R.executeEventcardPathsPenpotR3(fixture.context, fixture.authorize(before));
  assert.equal(receipt.pathMutations, 18);
  assert.equal(receipt.created, 0);
  assert.equal(fixture.pathWrites.length, 18);
  assert.ok(checks >= 20, 'ACTIVE is checked before all 18 setters and the receipt marker');
  assert.deepEqual(fixture.components.map((component) => [component.id, component.name,
    component.mainInstance().id, component.mainInstance().name]), names);
  assert.equal(typeof fixture.shared.get(`${R.ACTIVE_NAMESPACE}:${R.RECEIPT_KEY}`), 'string');
  const settlement = await R.readEventcardPathsPenpotSettlementR3(fixture.context, receipt);
  assert.equal(settlement.exactCanonicalPaths, 18);
  assert.equal(settlement.readbackMutations, 0);
  const terminal = await R.projectEventcardPathsPenpotR3(fixture.context, 'terminal');
  const replay = await R.executeEventcardPathsPenpotR3(fixture.context, fixture.authorize(terminal));
  assert.equal(replay.state, 'REPLAY_NOOP');
  assert.equal(replay.secondRunCreated, 0);
  assert.equal(replay.pathMutations, 0);
  assert.equal(fixture.pathWrites.length, 18);
});

test('head/tree/trigger/provenance and physical ACTIVE tuple are exact, not arbitrary hex acceptance', async () => {
  for (const mutate of [
    (fixture, auth) => { auth.packageHead = 'c'.repeat(40); },
    (fixture) => { fixture.context.exactPackageTree = 'short'; },
    (fixture, auth) => { auth.triggeredBy = 'another-trigger'; },
    (fixture) => { fixture.active.packageHead = 'd'.repeat(40); },
    (fixture) => { fixture.active.writerId = '/root/another-writer'; },
    (fixture) => { fixture.active.leaseToken = 'different-lease'; },
  ]) {
    const fixture = new Fixture();
    const projection = await R.projectEventcardPathsPenpotR3(fixture.context, 'baseline');
    const auth = fixture.authorize(projection);
    mutate(fixture, auth);
    await assert.rejects(() => R.executeEventcardPathsPenpotR3(fixture.context, auth),
      (error) => String(error.code || '').startsWith('PATHS_R3_'));
    assert.equal(fixture.pathWrites.length, 0);
  }
});

test('current-page activation itself is blocked without the physical ACTIVE lease', async () => {
  const fixture = new Fixture();
  const projection = await R.projectEventcardPathsPenpotR3(fixture.context, 'baseline');
  const auth = fixture.authorize(projection);
  fixture.penpot.currentPage = fixture.otherPage;
  fixture.opened.length = 0;
  fixture.active = null;
  await assert.rejects(() => R.executeEventcardPathsPenpotR3(fixture.context, auth),
    (error) => error.code === 'PATHS_R3_PHYSICAL_ACTIVE_MISSING');
  assert.deepEqual(fixture.opened, []);
  assert.equal(fixture.pathWrites.length, 0);
});

test('current blocked owner-review profile cannot be silently overridden by an execution receipt', async () => {
  const fixture = new Fixture();
  const projection = await R.projectEventcardPathsPenpotR3(fixture.context, 'baseline');
  const auth = fixture.authorize(projection);
  fixture.context.pageProfile.allowedToMutatePenpot = false;
  fixture.context.pageProfile.state = 'BLOCKED_OWNER_REJECTED';
  await assert.rejects(() => R.executeEventcardPathsPenpotR3(fixture.context, auth),
    (error) => error.code === 'PATHS_R3_ACTIVE_PAGE_PROFILE_DOES_NOT_AUTHORIZE_MUTATION');
  assert.equal(fixture.pathWrites.length, 0);
});

test('cancel between adjacent native setters stops before the second setter and requires distinct readback', async () => {
  const fixture = new Fixture();
  const projection = await R.projectEventcardPathsPenpotR3(fixture.context, 'baseline');
  const auth = fixture.authorize(projection);
  fixture.afterPathWrite = (count) => { if (count === 1) fixture.active.cancelled = true; };
  await assert.rejects(() => R.executeEventcardPathsPenpotR3(fixture.context, auth), (error) => {
    assert.equal(error.unknownOutcome, true);
    assert.equal(error.retryAllowed, false);
    assert.equal(error.requiredNextOperation, 'DISTINCT_READ_ONLY_PROJECTION');
    assert.equal(error.nativeWritesBeforeStop, 1);
    assert.equal(error.distinctReadback.count.exact, 1);
    return true;
  });
  assert.equal(fixture.pathWrites.length, 1);
  assert.equal(fixture.shared.has(`${R.ACTIVE_NAMESPACE}:${R.RECEIPT_KEY}`), false);
});

test('lease expiry between adjacent native setters stops before the second setter', async () => {
  const fixture = new Fixture();
  const projection = await R.projectEventcardPathsPenpotR3(fixture.context, 'baseline');
  const auth = fixture.authorize(projection);
  fixture.afterPathWrite = (count) => { if (count === 1) fixture.nowValue = 5_000; };
  await assert.rejects(() => R.executeEventcardPathsPenpotR3(fixture.context, auth),
    (error) => error.unknownOutcome === true && error.nativeWritesBeforeStop === 1);
  assert.equal(fixture.pathWrites.length, 1);
});

test('receipt marker is separately lease-guarded after the eighteenth setter', async () => {
  const fixture = new Fixture();
  const projection = await R.projectEventcardPathsPenpotR3(fixture.context, 'baseline');
  const auth = fixture.authorize(projection);
  fixture.afterPathWrite = (count) => { if (count === 18) fixture.active.cancelled = true; };
  await assert.rejects(() => R.executeEventcardPathsPenpotR3(fixture.context, auth), (error) => {
    assert.equal(error.unknownOutcome, true);
    assert.equal(error.nativeWritesBeforeStop, 18);
    assert.deepEqual(error.distinctReadback.count, { exact: 18, empty: 0, legacy: 0 });
    return true;
  });
  assert.equal(fixture.shared.has(`${R.ACTIVE_NAMESPACE}:${R.RECEIPT_KEY}`), false);
});

test('fresh projection digest binds authorization and protected surfaces stay path-independent', async () => {
  const fixture = new Fixture();
  const projection = await R.projectEventcardPathsPenpotR3(fixture.context, 'baseline');
  const protectedSha = projection.protectedCollectionDigest;
  const auth = fixture.authorize(projection);
  auth.projectionSha256 = '0'.repeat(64);
  await assert.rejects(() => R.executeEventcardPathsPenpotR3(fixture.context, auth),
    (error) => error.code === 'PATHS_R3_AUTH_PROJECTIONSHA256_MISMATCH');
  assert.equal(fixture.pathWrites.length, 0);
  const valid = fixture.authorize(projection);
  await R.executeEventcardPathsPenpotR3(fixture.context, valid);
  const after = await R.projectEventcardPathsPenpotR3(fixture.context, 'terminal');
  assert.equal(after.protectedCollectionDigest, protectedSha);
  assert.equal(after.visibleProductLabelsDigest, projection.visibleProductLabelsDigest);
});

test('shared plugin data rejects every non-string value', () => {
  const fixture = new Fixture();
  for (const value of [374, {}, true, false, null, undefined]) {
    assert.throws(() => fixture.file.setSharedPluginData('x', 'y', value), TypeError);
  }
  fixture.file.setSharedPluginData('x', 'y', '374');
  assert.equal(fixture.file.getSharedPluginData('x', 'y'), '374');
});

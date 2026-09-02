'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../../../../scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-linkage-r3/eventcard_component_paths_linkage_r3.js');
const R = require('../../../../scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-linkage-r3/eventcard_component_paths_penpot_runtime_r3.js');

const HEAD = 'a'.repeat(40);
const TREE = 'b'.repeat(40);
const BUNDLE_SHA = 'c'.repeat(64), BUNDLE_BYTES = 1;

class Fixture {
  constructor() {
    this.activeReads = 0;
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
        name: `${M.PATHS[spec.group]} / ${spec.displayName}`,
        type: 'board', children: [], parent: board, x: index * 10, y: 0, width: 100, height: 100,
      };
      const component = { id: spec.componentId || `component-${String(index).padStart(2, '0')}`,
        name: spec.displayName, mainInstance: () => main };
      let path = M.PATHS[spec.group];
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
    this.otherComponents = Array.from({ length: 17 }, (_, index) => {
      const main = { id: `other-main-${index}`, name: `other.main.${index}`, type: 'board', children: [] };
      const component = { id: `other-component-${index}`, name: `other.component.${index}`,
        path: `Protected / Other / ${index}`, mainInstance: () => main };
      main.component = () => component;
      return component;
    });
    this.targetPage = { id: M.PAGE_ID, name: '00 · Components · Free collection', root: pageRoot };
    this.otherPage = { id: 'other-page', name: 'Other', root: { id: 'other-root', children: [] } };
    this.file = {
      id: M.FILE_ID, revn: 180, pages: [this.otherPage, this.targetPage], validate: () => [],
      getSharedPluginData: (namespace, key) => { if (namespace === R.ACTIVE_NAMESPACE && key === R.ACTIVE_KEY) this.activeReads += 1; return this.shared.get(`${namespace}:${key}`) || ''; },
      setSharedPluginData: (namespace, key, value) => {
        if (typeof value !== 'string') throw new TypeError('plugin data requires string');
        this.shared.set(`${namespace}:${key}`, value);
      },
    };
    this.penpot = {
      currentFile: this.file, currentPage: this.otherPage,
      library: { local: { components: [...this.components, ...this.otherComponents] } },
      openPage: async (page) => { this.opened.push(page.id); this.penpot.currentPage = page; },
    };
    this.active = null;
    this.context = {
      penpot: this.penpot, exactPackageHead: HEAD, exactPackageTree: TREE, exactBundleSha256: BUNDLE_SHA, exactBundleBytes: BUNDLE_BYTES,
    };
  }

  syncActive() { const key=`${R.ACTIVE_NAMESPACE}:${R.ACTIVE_KEY}`; if(this.active)this.shared.set(key,JSON.stringify(this.active));else this.shared.delete(key); }

  authorize(projection, overrides = {}) {
    const provenance = {
      sessionId: 'session-01a0581e', taskId: 'task-eventcard-paths-r3', writerId: '/root/publish_r2',
      packageId: M.PACKAGE_ID, packageHead: HEAD, packageTree: TREE,
      triggeredBy: 'issue-57-comment-5506140332', cancelToken: 'cancel-paths-r3-001', leaseToken: 'lease-paths-r3-001', leaseExpiresAt: Date.now()+60_000,
      bundleSha256:BUNDLE_SHA,bundleBytes:BUNDLE_BYTES,revision:projection.revision,projectionSha256:projection.projectionSha256,
      ownerDirective: R.OWNER_DIRECTIVE, authorityCardCommentId: R.AUTHORITY_CARD_COMMENT_ID,
      authorityScope: R.AUTHORITY_SCOPE,
      ...(overrides.provenance || {}),
    };
    const authorization = {
      schema: R.AUTH_SCHEMA, packageId: M.PACKAGE_ID, parentPackageId: M.PARENT_PACKAGE_ID,
      packageHead: HEAD, packageTree: TREE, state: 'ACTIVE', authorized: true, cancelled: false,
      revision: projection.revision, projectionSha256: projection.projectionSha256,
      triggeredBy: provenance.triggeredBy, sessionId:provenance.sessionId,taskId:provenance.taskId,writerId:provenance.writerId,cancelToken:provenance.cancelToken,leaseToken:provenance.leaseToken,bundleSha256:BUNDLE_SHA,bundleBytes:BUNDLE_BYTES, provenance,
      ownerDirective: R.OWNER_DIRECTIVE, authorityCardCommentId: R.AUTHORITY_CARD_COMMENT_ID,
      authorityScope: R.AUTHORITY_SCOPE,
      ...overrides,
    };
    authorization.provenance = provenance;
    this.active = {
      schema: R.ACTIVE_SCHEMA, state: 'ACTIVE', authorized: true, cancelled: false,
      sessionId: provenance.sessionId, taskId: provenance.taskId, writerId: provenance.writerId,
      packageId: provenance.packageId, packageHead: provenance.packageHead, packageTree: provenance.packageTree,
      triggeredBy: provenance.triggeredBy, cancelToken:provenance.cancelToken, leaseToken: provenance.leaseToken,
      leaseExpiresAt: provenance.leaseExpiresAt,
      ownerDirective: R.OWNER_DIRECTIVE, authorityCardCommentId: R.AUTHORITY_CARD_COMMENT_ID,
      authorityScope: R.AUTHORITY_SCOPE,bundleSha256:BUNDLE_SHA,bundleBytes:BUNDLE_BYTES,revision:projection.revision,projectionSha256:projection.projectionSha256,
    };
    this.syncActive();
    return authorization;
  }
}

test('concrete terminal projection activates exact page and proves 18/18/26', async () => {
  const fixture = new Fixture();
  const projection = await R.projectEventcardPathsPenpotR3(fixture.context, 'terminal');
  assert.deepEqual(fixture.opened, [M.PAGE_ID]);
  assert.deepEqual(projection.count, { exact: 18, empty: 0, legacy: 0 });
  assert.equal(projection.componentIds.length, 18);
  assert.equal(projection.mainIds.length, 18);
  assert.equal(projection.linkedInstanceIds.length, 26);
  assert.equal(fixture.pathWrites.length, 0);
});

test('receipt-only recovery writes exact tuple and distinct settlement is read-only', async () => {
  const fixture = new Fixture();
  const projection = await R.projectEventcardPathsPenpotR3(fixture.context, 'terminal');
  const receipt = await R.executeEventcardPathsPenpotR3(fixture.context, fixture.authorize(projection));
  assert.equal(receipt.path_mutations, 0);
  assert.equal(receipt.native_setters, 0);
  assert.equal(receipt.created, 0);
  assert.equal(receipt.package_head, HEAD);
  assert.equal(receipt.package_tree, TREE);
  assert.equal(receipt.bundle_sha256, BUNDLE_SHA);
  assert.equal(receipt.native_revision, projection.revision);
  assert.equal(receipt.projection_sha256, projection.projectionSha256);
  assert.equal(fixture.pathWrites.length, 0);
  const settlement = await R.readEventcardPathsPenpotSettlementR3(fixture.context, receipt);
  assert.equal(settlement.exactCanonicalPaths, 18);
  assert.equal(settlement.readbackMutations, 0);
});

test('replay exact-compares stored receipt and stale nonempty marker fails closed', async () => {
  const fixture = new Fixture();
  const projection = await R.projectEventcardPathsPenpotR3(fixture.context, 'terminal');
  const auth = fixture.authorize(projection);
  await R.executeEventcardPathsPenpotR3(fixture.context, auth);
  const key = `${R.ACTIVE_NAMESPACE}:${R.RECEIPT_KEY}`;
  const exact = fixture.shared.get(key);
  const replay = await R.executeEventcardPathsPenpotR3(fixture.context, auth);
  assert.equal(replay.replayState, 'REPLAY_NOOP');
  assert.equal(fixture.shared.get(key), exact);
  fixture.shared.set(key, JSON.stringify({state:'stale'}));
  await assert.rejects(() => R.executeEventcardPathsPenpotR3(fixture.context, auth),
    (error) => error.code === 'PATHS_R3_STORED_RECEIPT_TUPLE_MISMATCH');
  assert.equal(fixture.pathWrites.length, 0);
});

test('sole writer ACTIVE tuple mismatches reject before receipt write', async () => {
  for (const mutate of [
    (fixture) => { fixture.active.writerId = '/root/other'; fixture.syncActive(); },
    (fixture) => { fixture.active.leaseToken = 'other-lease'; fixture.syncActive(); },
    (fixture) => { fixture.active.packageHead = 'd'.repeat(40); fixture.syncActive(); },
    (fixture) => { fixture.active.cancelled = true; fixture.syncActive(); },
  ]) {
    const fixture = new Fixture();
    const projection = await R.projectEventcardPathsPenpotR3(fixture.context, 'terminal');
    const auth = fixture.authorize(projection); mutate(fixture, auth);
    await assert.rejects(() => R.executeEventcardPathsPenpotR3(fixture.context, auth));
    assert.equal(fixture.shared.has(`${R.ACTIVE_NAMESPACE}:${R.RECEIPT_KEY}`), false);
    assert.equal(fixture.pathWrites.length, 0);
  }
});

test('revision is authoritative revn-only and absent revn fails closed', async () => {
  const fixture = new Fixture();
  delete fixture.file.revn;
  fixture.file.revision = 180;
  await assert.rejects(() => R.projectEventcardPathsPenpotR3(fixture.context, 'terminal'),
    (error) => error.code === 'PATHS_R3_CURRENT_REVN_REQUIRED');
});

test('nonterminal state is read-only and cannot enter historical setter path', async () => {
  const fixture = new Fixture();
  fixture.components[0].path = '';
  fixture.components[0].mainInstance().name = fixture.components[0].name;
  fixture.pathWrites.length = 0;
  const projection = await R.projectEventcardPathsPenpotR3(fixture.context, 'any');
  const auth = fixture.authorize(projection);
  await assert.rejects(() => R.executeEventcardPathsPenpotR3(fixture.context, auth),
    (error) => error.code === 'PATHS_R3_RECEIPT_RECOVERY_REQUIRES_TERMINAL_18_OF_18');
  assert.equal(fixture.pathWrites.length, 0);
});

test('Text-only profile cannot replace exact Paths authority scope', async () => {
  const fixture = new Fixture();
  fixture.context.pageProfile = {state:'BLOCKED_OWNER_REJECTED',allowedToMutatePenpot:false};
  const projection = await R.projectEventcardPathsPenpotR3(fixture.context, 'terminal');
  const auth = fixture.authorize(projection);
  auth.authorityScope = 'EVENTCARD_TEXT_ONLY';
  await assert.rejects(() => R.executeEventcardPathsPenpotR3(fixture.context, auth),
    (error) => error.code === 'PATHS_R3_AUTH_AUTHORITYSCOPE_MISMATCH');
  assert.equal(fixture.pathWrites.length, 0);
});

test('shared plugin data rejects every non-string value', () => {
  const fixture = new Fixture();
  for (const value of [374, {}, true, false, null, undefined]) {
    assert.throws(() => fixture.file.setSharedPluginData('x', 'y', value), TypeError);
  }
});

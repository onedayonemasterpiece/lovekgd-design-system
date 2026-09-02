'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');

const BUNDLE = path.resolve(__dirname, '../../../../scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-linkage-r3/eventcard_paths_penpot_standalone_bundle_v1.js');
const source = fs.readFileSync(BUNDLE, 'utf8');
const sha = crypto.createHash('sha256').update(source).digest('hex');
const bytes = Buffer.byteLength(source);
const sandbox = { structuredClone: () => { throw new TypeError('Illegal invocation'); }, console };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: BUNDLE });
const API = sandbox.KenigEventsD0EventcardPathsR3StandaloneV5;
const M = API.internals.logic;
const R = API.internals;
const HEAD = 'a'.repeat(40), TREE = 'b'.repeat(40);

class Fixture {
  constructor() {
    this.nowValue = 1000; this.pathWrites = []; this.shared = new Map(); this.opened = [];
    const board = { id: M.COLLECTION_ID, name: M.COLLECTION_NAME, type: 'board', children: [] };
    const pageRoot = { id: 'page-root', name: 'Page root', type: 'root', children: [board] }; board.parent = pageRoot;
    this.components = M.SPECS.map((spec, index) => {
      const main = { id: spec.mainId || `main-${index}`, name: `${M.PATHS[spec.group]} / ${spec.displayName}`,
        type: 'board', children: [], parent: board, x: index * 10, y: 0, width: 100, height: 100 };
      const component = { id: spec.componentId || `component-${index}`, name: spec.displayName, mainInstance: () => main };
      let componentPath = M.PATHS[spec.group];
      Object.defineProperty(component, 'path', { enumerable: true, get: () => componentPath, set: (value) => {
        componentPath = value; main.name = `${value} / ${component.name}`;
        this.pathWrites.push([component.id, value]);
      }});
      main.component = () => component; board.children.push(main); return component;
    });
    for (const [caseIndex, spec] of M.SPECS.slice(14).entries()) {
      const main = this.components[14 + caseIndex].mainInstance();
      const pool = caseIndex < 2 ? this.components.slice(0, 7) : this.components.slice(7, 14);
      const selected = spec.linkedCount === 7 ? pool : pool.filter((_, index) => index !== 4).slice(0, 6);
      main.children = selected.map((leaf, index) => ({ id: `linked-${caseIndex}-${index}`, name: `linked ${index}`,
        type: 'instance', children: [], parent: main, x: index, y: 1, width: 8, height: 8, component: () => leaf }));
    }
    this.otherComponents = Array.from({ length: 17 }, (_, index) => {
      const main = { id: `other-main-${index}`, name: `other.main.${index}`, type: 'board', children: [] };
      const component = { id: `other-component-${index}`, name: `other.component.${index}`,
        path: `Protected / Other / ${index}`, mainInstance: () => main }; main.component = () => component; return component;
    });
    this.targetPage = { id: M.PAGE_ID, name: '00 · Components · Free collection', root: pageRoot };
    this.otherPage = { id: 'other-page', root: { id: 'other-root', children: [] } };
    this.file = { id: M.FILE_ID, revn: 180, pages: [this.otherPage, this.targetPage], validate: () => [],
      getSharedPluginData: (namespace, key) => this.shared.get(`${namespace}:${key}`) || '',
      setSharedPluginData: (namespace, key, value) => { if (typeof value !== 'string') throw new TypeError('string required'); this.shared.set(`${namespace}:${key}`, value); } };
    this.penpot = { currentFile: this.file, currentPage: this.otherPage,
      library: { local: { components: [...this.components, ...this.otherComponents] } },
      openPage: async (page) => { this.penpot.currentPage = page; this.opened.push(page.id); } };
    this.active = null;
    this.host = { penpot: this.penpot, exactPackageHead: HEAD, exactPackageTree: TREE,
      exactBundleSha256: sha, exactBundleBytes: bytes };
  }
  authorize(projection) {
    const provenance = { sessionId:'session-01a0581e',taskId:'task-eventcard-paths-r3',writerId:'/root/publish_r2',
      packageId:M.PACKAGE_ID,packageHead:HEAD,packageTree:TREE,triggeredBy:'issue-57-standalone-bundle',
      cancelToken:'cancel-paths-r3-001',leaseToken:'lease-paths-r3-001',leaseExpiresAt:Date.now()+60000,bundleSha256:sha,bundleBytes:bytes,revision:projection.revision,projectionSha256:projection.projectionSha256,
      ownerDirective:R.OWNER_DIRECTIVE,authorityCardCommentId:R.AUTHORITY_CARD_COMMENT_ID,authorityScope:R.AUTHORITY_SCOPE,
      bundleSha256:sha,bundleBytes:bytes };
    const authorization = { schema:R.AUTH_SCHEMA,packageId:M.PACKAGE_ID,parentPackageId:M.PARENT_PACKAGE_ID,
      packageHead:HEAD,packageTree:TREE,state:'ACTIVE',authorized:true,cancelled:false,revision:projection.revision,
      projectionSha256:projection.projectionSha256,triggeredBy:provenance.triggeredBy,sessionId:provenance.sessionId,taskId:provenance.taskId,writerId:provenance.writerId,cancelToken:provenance.cancelToken,leaseToken:provenance.leaseToken,provenance,
      ownerDirective:R.OWNER_DIRECTIVE,
      authorityCardCommentId:R.AUTHORITY_CARD_COMMENT_ID,authorityScope:R.AUTHORITY_SCOPE,
      bundleSha256:sha,bundleBytes:bytes };
    this.active = { schema:R.ACTIVE_SCHEMA,state:'ACTIVE',authorized:true,cancelled:false,
      sessionId:provenance.sessionId,taskId:provenance.taskId,writerId:provenance.writerId,packageId:M.PACKAGE_ID,
      packageHead:HEAD,packageTree:TREE,triggeredBy:provenance.triggeredBy,cancelToken:provenance.cancelToken,leaseToken:provenance.leaseToken,
      leaseExpiresAt:provenance.leaseExpiresAt,
      ownerDirective:R.OWNER_DIRECTIVE,authorityCardCommentId:R.AUTHORITY_CARD_COMMENT_ID,authorityScope:R.AUTHORITY_SCOPE,bundleSha256:sha,bundleBytes:bytes,revision:projection.revision,projectionSha256:projection.projectionSha256 };
    this.shared.set(`${R.ACTIVE_NAMESPACE}:${R.ACTIVE_KEY}`,JSON.stringify(this.active));
    this.host.authorization = authorization; return authorization;
  }
}

test('single artifact loads in a browser-like VM and exposes exact D0 bundle API', () => {
  assert.equal(API.metadata.schema, 'D0_PLUGIN_BUNDLE_V1');
  assert.deepEqual(Object.keys(API.metadata.entrypoints).sort(), ['execution','projection','settlement']);
  assert.equal(API.metadata.current_page_activation, true); assert.equal(API.metadata.max_creates_per_phase, 3);
  assert.equal(API.metadata.replay_created, 0);
  for (const name of ['projection','execution','settlement']) assert.equal(typeof API[name], 'function');
  for (const pattern of [/\brequire\s*\(/,/\bmodule\b/,/\bexports\b/,/\bprocess\b/,/\bBuffer\b/,/\bimport\s*\(/,/\bimport\s+/]) assert.equal(pattern.test(source), false);
  assert.equal(M.sha256({b:2,a:1}), crypto.createHash('sha256').update(M.canonical({b:2,a:1})).digest('hex'));
});

test('receipt-only bundle has no structural path writer or native create call', () => {
  assert.equal(/\.path\s*=/.test(source), false);
  assert.equal(/\bsetPath\s*\(/.test(source), false);
  assert.equal(/\bcreate(?:Page|Board|Rectangle|Text|Ellipse|Path)\s*\(/.test(source), false);
  assert.equal(source.includes('asp-physical-active-marker-v3'), false);
  assert.equal(source.includes("asp-active-run-v1"), true);
});

test('terminal 18/18/26 projection writes one exact real-tuple recovery receipt', async () => {
  const fixture = new Fixture();
  const projection = await API.projection(fixture.host);
  assert.equal(projection.observedState, 'terminal');
  fixture.authorize(projection);
  const beforeWrites = fixture.pathWrites.length;
  const receipt = await API.execution(fixture.host);
  assert.equal(receipt.path_mutations, 0);
  assert.equal(receipt.native_setters, 0);
  assert.equal(receipt.created, 0);
  assert.equal(receipt.package_head, HEAD);
  assert.equal(receipt.package_tree, TREE);
  assert.equal(receipt.bundle_sha256, sha);
  assert.equal(receipt.native_revision, projection.revision);
  assert.equal(receipt.projection_sha256, projection.projectionSha256);
  assert.equal(receipt.component_ids.length, 18);
  assert.equal(receipt.main_ids.length, 18);
  assert.equal(receipt.linked_instance_ids.length, 26);
  assert.equal(fixture.pathWrites.length, beforeWrites);
  fixture.host.receipt = receipt;
  const settlement = await API.settlement(fixture.host);
  assert.equal(settlement.exactCanonicalPaths, 18);
  assert.equal(settlement.readbackMutations, 0);
});

test('exact stored receipt replays without rewrite; stale nonempty receipt fails closed', async () => {
  const fixture = new Fixture();
  const projection = await API.projection(fixture.host); fixture.authorize(projection);
  const receipt = await API.execution(fixture.host);
  const key = `${R.ACTIVE_NAMESPACE}:${R.RECEIPT_KEY}`;
  const exact = fixture.shared.get(key);
  const writes = fixture.pathWrites.length;
  fixture.host.receipt = null;
  const replay = await API.execution(fixture.host);
  assert.equal(replay.replayState, 'REPLAY_NOOP');
  assert.equal(fixture.shared.get(key), exact);
  assert.equal(fixture.pathWrites.length, writes);
  fixture.shared.set(key, JSON.stringify({ state: 'stale-nonempty' }));
  await assert.rejects(() => API.execution(fixture.host),
    (error) => error.code === 'PATHS_R3_STORED_RECEIPT_TUPLE_MISMATCH');
  assert.equal(fixture.shared.get(key), JSON.stringify({ state: 'stale-nonempty' }));
  assert.equal(fixture.pathWrites.length, writes);
  assert.equal(receipt.terminal, true);
});

test('nonterminal state cannot re-enter historical path mutation', async () => {
  const fixture = new Fixture();
  fixture.components[0].path = '';
  fixture.components[0].mainInstance().name = fixture.components[0].name;
  fixture.pathWrites.length = 0;
  const projection = await API.projection(fixture.host);
  fixture.authorize(projection);
  await assert.rejects(() => API.execution(fixture.host),
    (error) => error.code === 'PATHS_R3_RECEIPT_RECOVERY_REQUIRES_TERMINAL_18_OF_18');
  assert.equal(fixture.pathWrites.length, 0);
});

test('sole ACTIVE key, revn-only and exact writer tuple fail closed before receipt write', async () => {
  for (const mutate of [
    (fixture) => fixture.shared.delete(`${R.ACTIVE_NAMESPACE}:${R.ACTIVE_KEY}`),
    (fixture) => { fixture.active.writerId = '/root/another-writer'; fixture.shared.set(`${R.ACTIVE_NAMESPACE}:${R.ACTIVE_KEY}`, JSON.stringify(fixture.active)); },
    (fixture) => { delete fixture.file.revn; fixture.file.revision = 180; },
  ]) {
    const fixture = new Fixture();
    const projection = await API.projection(fixture.host); fixture.authorize(projection); mutate(fixture);
    await assert.rejects(() => API.execution(fixture.host));
    assert.equal(fixture.shared.has(`${R.ACTIVE_NAMESPACE}:${R.RECEIPT_KEY}`), false);
  }
});

test('Paths authority is independent of the Text-only owner profile', async () => {
  const fixture = new Fixture();
  fixture.host.pageProfile = { profileId: 'free-collection.owner-review.v1', state: 'BLOCKED_OWNER_REJECTED' };
  const projection = await API.projection(fixture.host); const auth = fixture.authorize(projection);
  const receipt = await API.execution(fixture.host);
  assert.equal(receipt.state, 'PATHS_18_OF_18_PENDING_DISTINCT_READBACK');
  const next = new Fixture();
  const nextProjection = await API.projection(next.host); const bad = next.authorize(nextProjection);
  bad.authorityScope = 'EVENTCARD_TEXT_ONLY';
  await assert.rejects(() => API.execution(next.host, bad),
    (error) => error.code === 'PATHS_R3_AUTH_AUTHORITYSCOPE_MISMATCH');
});

test('bundle SHA/bytes must be exact before receipt write', async () => {
  for (const mutate of [
    (host) => { host.authorization.bundleSha256 = '0'.repeat(64); },
    (host) => { host.authorization.provenance.bundleBytes += 1; },
    (host) => { host.exactBundleBytes += 1; },
  ]) {
    const fixture = new Fixture(), projection = await API.projection(fixture.host); fixture.authorize(projection); mutate(fixture.host);
    await assert.rejects(() => API.execution(fixture.host));
    assert.equal(fixture.shared.has(`${R.ACTIVE_NAMESPACE}:${R.RECEIPT_KEY}`), false);
  }
});

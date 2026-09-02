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
const sandbox = { structuredClone, console };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: BUNDLE });
const API = sandbox.KenigEventsD0EventcardPathsR3Bundle;
const M = API.internals.logic;
const R = API.internals;
const HEAD = 'a'.repeat(40), TREE = 'b'.repeat(40);

class Fixture {
  constructor() {
    this.nowValue = 1000; this.pathWrites = []; this.shared = new Map(); this.opened = [];
    const board = { id: M.COLLECTION_ID, name: M.COLLECTION_NAME, type: 'board', children: [] };
    const pageRoot = { id: 'page-root', name: 'Page root', type: 'root', children: [board] }; board.parent = pageRoot;
    this.components = M.SPECS.map((spec, index) => {
      const main = { id: spec.mainId || `main-${index}`, name: spec.legacyMain ? `${M.LEGACY_MAIN_PREFIX}${spec.displayName}` : spec.displayName,
        type: 'board', children: [], parent: board, x: index * 10, y: 0, width: 100, height: 100 };
      const component = { id: spec.componentId || `component-${index}`, name: spec.displayName, mainInstance: () => main };
      let componentPath = spec.legacyMain ? M.LEGACY_PATH : '';
      Object.defineProperty(component, 'path', { enumerable: true, get: () => componentPath, set: (value) => {
        componentPath = value; this.pathWrites.push([component.id, value]);
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
      exactBundleSha256: sha, exactBundleBytes: bytes,
      pageProfile: { profileId: 'free-collection.owner-review.v1', state: 'BLOCKED_OWNER_REJECTED',
        allowedToMutatePenpot: false, profileSha256: 'e'.repeat(64) },
      now: () => this.nowValue, readActiveMarker: () => this.active };
  }
  authorize(projection) {
    const provenance = { sessionId:'session-01a0581e',taskId:'task-eventcard-paths-r3',writerId:'/root/publish_r2',
      packageId:M.PACKAGE_ID,packageHead:HEAD,packageTree:TREE,triggeredBy:'issue-57-standalone-bundle',
      leaseToken:'lease-paths-r3-001',leaseExpiresAt:5000,pageProfileSha256:this.host.pageProfile.profileSha256,
      ownerDirective:R.OWNER_DIRECTIVE,authorityCardCommentId:R.AUTHORITY_CARD_COMMENT_ID,authorityScope:R.AUTHORITY_SCOPE,
      bundleSha256:sha,bundleBytes:bytes };
    const authorization = { schema:R.AUTH_SCHEMA,packageId:M.PACKAGE_ID,parentPackageId:M.PARENT_PACKAGE_ID,
      packageHead:HEAD,packageTree:TREE,state:'ACTIVE',authorized:true,cancelled:false,revision:projection.revision,
      projectionSha256:projection.projectionSha256,triggeredBy:provenance.triggeredBy,provenance,
      pageProfileSha256:this.host.pageProfile.profileSha256,ownerDirective:R.OWNER_DIRECTIVE,
      authorityCardCommentId:R.AUTHORITY_CARD_COMMENT_ID,authorityScope:R.AUTHORITY_SCOPE,
      bundleSha256:sha,bundleBytes:bytes };
    this.active = { schema:R.ACTIVE_SCHEMA,state:'ACTIVE',authorized:true,cancelled:false,
      sessionId:provenance.sessionId,taskId:provenance.taskId,writerId:provenance.writerId,packageId:M.PACKAGE_ID,
      packageHead:HEAD,packageTree:TREE,triggeredBy:provenance.triggeredBy,leaseToken:provenance.leaseToken,
      leaseExpiresAt:provenance.leaseExpiresAt,pageProfileSha256:provenance.pageProfileSha256,
      ownerDirective:R.OWNER_DIRECTIVE,authorityCardCommentId:R.AUTHORITY_CARD_COMMENT_ID,authorityScope:R.AUTHORITY_SCOPE };
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

test('standalone bundle executes 18 path-only writes, settles, and replay creates zero', async () => {
  const fixture = new Fixture();
  const projection = await API.projection(fixture.host); fixture.authorize(projection);
  const ids = fixture.components.map((c) => [c.id,c.name,c.mainInstance().id,c.mainInstance().name]);
  const receipt = await API.execution(fixture.host);
  assert.equal(receipt.pathMutations,18); assert.equal(receipt.created,0); assert.equal(fixture.pathWrites.length,18);
  assert.deepEqual(fixture.components.map((c) => [c.id,c.name,c.mainInstance().id,c.mainInstance().name]),ids);
  const settlement = await API.settlement(fixture.host); assert.equal(settlement.exactCanonicalPaths,18);
  fixture.host.receipt = null; const terminal = await API.projection(fixture.host); fixture.authorize(terminal);
  const replay = await API.execution(fixture.host); assert.equal(replay.state,'REPLAY_NOOP');
  assert.equal(replay.secondRunCreated,0); assert.equal(fixture.pathWrites.length,18);
});

test('bundle SHA/bytes must be exact in authorization and provenance before any write', async () => {
  for (const mutate of [
    (host) => { host.authorization.bundleSha256 = '0'.repeat(64); },
    (host) => { host.authorization.provenance.bundleBytes += 1; },
    (host) => { host.exactBundleBytes += 1; },
  ]) {
    const fixture = new Fixture(), projection = await API.projection(fixture.host); fixture.authorize(projection); mutate(fixture.host);
    await assert.rejects(() => API.execution(fixture.host), (error) => error.code === 'PATHS_R3_BUNDLE_AUTHORIZATION_MISMATCH');
    assert.equal(fixture.pathWrites.length,0);
  }
});

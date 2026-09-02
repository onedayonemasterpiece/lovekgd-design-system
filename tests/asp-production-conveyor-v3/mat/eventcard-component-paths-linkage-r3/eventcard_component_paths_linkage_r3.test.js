'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../../../../scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-linkage-r3/eventcard_component_paths_linkage_r3.js');

class Adapter {
  constructor() {
    this.revision = 180;
    this.markerValue = '';
    this.protectedDigest = 'protected-stable';
    this.visibleLabelsDigest = 'labels-stable';
    this.timeout = false;
    this.rows = M.SPECS.map((spec, index) => ({
      id: spec.componentId || `component-${index}`,
      name: spec.displayName,
      path: spec.legacyMain ? M.LEGACY_PATH : '',
      main: {
        id: spec.mainId || `main-${index}`,
        name: spec.legacyMain ? `${M.LEGACY_MAIN_PREFIX}${spec.displayName}` : spec.displayName,
      },
    }));
    this.linksByMain = new Map();
    for (const [caseIndex, spec] of M.SPECS.slice(14).entries()) {
      const caseRow = this.rows[14 + caseIndex];
      const pool = caseIndex < 2 ? this.rows.slice(0, 7) : this.rows.slice(7, 14);
      const selected = spec.linkedCount === 7 ? pool : pool.filter((_, index) => index !== 4).slice(0, 6);
      this.linksByMain.set(caseRow.main.id, selected.map((leaf, index) => ({
        id: `linked-${caseIndex}-${index}`,
        componentId: leaf.id,
        parentMainId: caseRow.main.id,
        parentCaseComponentId: caseRow.id,
      })));
    }
  }
  identity() { return { fileId: M.FILE_ID, pageId: M.PAGE_ID, revision: this.revision }; }
  collection() {
    return {
      rootId: M.COLLECTION_ID, name: M.COLLECTION_NAME, roots: 1, children: 18, components: 18,
      detached: 0, clones: 0, recreated: 0, validation: [],
      protectedDigest: this.protectedDigest, visibleProductLabelsDigest: this.visibleLabelsDigest,
    };
  }
  components() { return structuredClone(this.rows); }
  componentMainRelationship(componentId, mainId) {
    const row = this.rows.find((item) => item.id === componentId && item.main.id === mainId);
    return row ? { componentId, mainId, native: true } : null;
  }
  links(mainId) { return structuredClone(this.linksByMain.get(mainId) || []); }
  marker() { return this.markerValue; }
  writeMarker(_, value) { this.markerValue = value; }
  async atomic(operation) {
    if (this.timeout) throw Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' });
    return operation();
  }
  setPath(componentId, path) {
    const row = this.rows.find((item) => item.id === componentId);
    if (!row) throw new Error('missing');
    row.path = path;
  }
}

const authorization = (projection) => ({
  schema: 'kenigevents.eventcard-paths-linkage-authorization.r3',
  packageId: M.PACKAGE_ID,
  parentPackageId: M.PARENT_PACKAGE_ID,
  state: 'ACTIVE',
  authorized: true,
  cancelled: false,
  revision: projection.revision,
  projectionSha256: projection.projectionSha256,
});

test('accepts three legacy structural main names without conflating them with display identity', () => {
  const adapter = new Adapter();
  const projection = M.projectEventcardPathsLinkageR3(adapter);
  assert.deepEqual(projection.count, { exact: 0, empty: 15, legacy: 3 });
  assert.equal(projection.components.length, 18);
  assert.equal(projection.linkedInstances.length, 26);
  assert.equal(projection.components.filter((row) => row.legacyMainLayerNameAccepted).length, 3);
  assert.equal(projection.components.every((row) => row.displayName === row.semanticName), true);
  assert.equal(projection.projectionSha256, M.projectEventcardPathsLinkageR3(adapter).projectionSha256);
});

test('writes only canonical paths and preserves component IDs, main IDs, main layer names and visible labels', async () => {
  const adapter = new Adapter();
  const before = M.projectEventcardPathsLinkageR3(adapter);
  const names = before.components.map((row) => [row.componentId, row.mainId, row.displayName, row.currentMainLayerName]);
  const receipt = await M.executeEventcardPathsLinkageR3(adapter, authorization(before));
  assert.equal(receipt.pathMutations, 18);
  const terminal = M.readEventcardPathsLinkageSettlementR3(adapter, receipt);
  assert.equal(terminal.exactCanonicalPaths, 18);
  const afterRows = adapter.rows.map((row) => [row.id, row.main.id, row.name, row.main.name]);
  assert.deepEqual(afterRows, names);
  assert.equal(adapter.visibleLabelsDigest, 'labels-stable');
  await assert.rejects(
    () => M.executeEventcardPathsLinkageR3(adapter, authorization(before)),
    (error) => error.code === 'PATHS_R3_EXECUTOR_REPLAY_FORBIDDEN'
  );
});

test('wrong main relation or unrelated main layer name fails closed before writes', () => {
  let adapter = new Adapter();
  adapter.componentMainRelationship = () => null;
  assert.throws(() => M.projectEventcardPathsLinkageR3(adapter), (error) => error.code === 'PATHS_R3_COMPONENT_MAIN_RELATIONSHIP_DRIFT');
  adapter = new Adapter();
  adapter.rows[15].main.name = 'A user-facing renamed title';
  assert.throws(() => M.projectEventcardPathsLinkageR3(adapter), (error) => error.code === 'PATHS_R3_MAIN_LAYER_NAME_OUTSIDE_ACCEPTED_SET');
});

test('missing and duplicate component/main/linked IDs fail closed', () => {
  let adapter = new Adapter();
  adapter.rows.pop();
  assert.throws(() => M.projectEventcardPathsLinkageR3(adapter), (error) => error.code === 'PATHS_R3_COMPONENT_CENSUS');
  adapter = new Adapter();
  adapter.rows[1].id = adapter.rows[0].id;
  assert.throws(() => M.projectEventcardPathsLinkageR3(adapter), (error) => error.code === 'PATHS_R3_DUPLICATE_COMPONENT_ID');
  adapter = new Adapter();
  const keys = [...adapter.linksByMain.keys()];
  adapter.linksByMain.get(keys[1])[0].id = adapter.linksByMain.get(keys[0])[0].id;
  assert.throws(() => M.projectEventcardPathsLinkageR3(adapter), (error) => error.code === 'PATHS_R3_DUPLICATE_LINKED_ID');
});

test('stale revision, stale projection and changed protected/visible surfaces fail closed', async () => {
  let adapter = new Adapter();
  let projection = M.projectEventcardPathsLinkageR3(adapter);
  adapter.revision += 1;
  await assert.rejects(
    () => M.executeEventcardPathsLinkageR3(adapter, authorization(projection)),
    (error) => error.code === 'PATHS_R3_STALE_REVISION'
  );
  adapter = new Adapter();
  projection = M.projectEventcardPathsLinkageR3(adapter);
  adapter.protectedDigest = 'changed';
  await assert.rejects(
    () => M.executeEventcardPathsLinkageR3(adapter, authorization(projection)),
    (error) => error.code === 'PATHS_R3_STALE_PROJECTION_SHA'
  );
  adapter = new Adapter();
  projection = M.projectEventcardPathsLinkageR3(adapter);
  adapter.visibleLabelsDigest = 'changed';
  await assert.rejects(
    () => M.executeEventcardPathsLinkageR3(adapter, authorization(projection)),
    (error) => error.code === 'PATHS_R3_STALE_PROJECTION_SHA'
  );
});

test('timeout/unknown outcome forbids blind retry; plugin data is string-only', async () => {
  const adapter = new Adapter();
  const projection = M.projectEventcardPathsLinkageR3(adapter);
  adapter.timeout = true;
  await assert.rejects(
    () => M.executeEventcardPathsLinkageR3(adapter, authorization(projection)),
    (error) => error.code === 'PATHS_R3_TIMEOUT_OR_UNKNOWN_OUTCOME' && error.unknownOutcome && error.retryAllowed === false
  );
  assert.throws(() => M.stringOnly({}), (error) => error.code === 'PATHS_R3_PLUGIN_DATA_NOT_STRING');
  assert.equal(M.stringOnly('ok'), 'ok');
});

test('bounded main-layer normalization decision is inactive and limited to the three exact legacy mains', () => {
  const decision = M.MAIN_LAYER_NORMALIZATION_DECISION;
  assert.equal(decision.active, false);
  assert.equal(decision.thisPackageAuthorizesNormalization, false);
  assert.equal(decision.exactEligibleMainIds.length, 3);
  assert.equal(decision.visibleProductLabelsMustRemainUnchanged, true);
  assert.equal(decision.realUserFacingNameChangeRequiresOwnerAction, true);
});

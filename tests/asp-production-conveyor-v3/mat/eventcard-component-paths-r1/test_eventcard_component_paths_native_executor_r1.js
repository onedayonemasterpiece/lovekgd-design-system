const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const E = require('../../../../scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/eventcard_component_paths_native_executor_r1.js');
const C = E.EVENTCARD_PATHS_R1;

const ROOT = path.resolve(__dirname, '../../../..');
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const snapshot = (surface) => JSON.stringify({
  shapes: walk(surface.page.root).map((shape) => ({ id: shape.id, name: shape.name, type: shape.type, characters: shape.characters, fills: shape.fills, strokes: shape.strokes, x: shape.x, y: shape.y, width: shape.width, height: shape.height, hidden: shape.hidden, visible: shape.visible, parent: shape.parent?.id || null, children: shape.children.map((child) => child.id), componentId: shape.component()?.id || null, shared: [...shape.shared] })),
  components: surface.components.map((component) => ({ id: component.id, name: component.name, path: component.path, mainId: component.mainInstance().id })),
});

class Shape {
  constructor(type, id) {
    this.id = id; this.type = type; this.name = ''; this.parent = null; this.children = [];
    this.x = 0; this.y = 0; this.width = 10; this.height = 10; this.hidden = false; this.visible = true;
    this.characters = null; this.fills = []; this.strokes = []; this.shared = new Map(); this._component = null;
  }
  appendChild(child) { child.parent = this; this.children.push(child); }
  getPluginData(key) { return this.shared.get(key) || ''; }
  setPluginData(key, value) { this.shared.set(key, String(value)); }
  component() { return this._component; }
}
const walk = (root) => { const out = [], queue = [root]; while (queue.length) { const item = queue.shift(); out.push(item); queue.push(...item.children); } return out; };

function makeSurface({ distinctProxies = false, saveThrows = false } = {}) {
  const root = new Shape('root', 'page-root');
  const board = new Shape('board', C.target.boardId); board.name = C.target.boardName; root.appendChild(board);
  const components = [], byName = {}, versions = [], shared = new Map();
  let undoBegin = 0, undoFinish = 0, saveCount = 0;
  for (let index = 0; index < C.components.length; index++) {
    const spec = C.components[index];
    const main = new Shape('board', spec.mainId || `durable-leaf-main-${String(index + 1).padStart(2, '0')}`);
    main.name = spec.name; main.width = spec.kind === 'case' ? 340 : 24; main.height = spec.kind === 'case' ? 600 : 24;
    const component = {
      id: spec.componentId || `durable-leaf-component-${String(index + 1).padStart(2, '0')}`,
      name: spec.name,
      path: spec.legacyPath ? C.knownLegacyCasePath : '',
      mainInstance: () => distinctProxies ? new Proxy(main, {}) : main,
    };
    main._component = component;
    main.setPluginData('kenigevents-g19-marker', `kenigevents:g19:p2:${spec.name}:v3`);
    main.setPluginData('kenigevents-payload-sha256', C.source.g19PayloadSha256);
    main.setPluginData('kenigevents-build-state', 'COMPLETE');
    main.setPluginData('kenigevents-component-name', spec.name);
    main.setPluginData('kenigevents-component-id', component.id);
    board.appendChild(main); components.push(component); byName[spec.name] = component;
  }
  for (const spec of C.components.filter((item) => item.kind === 'case')) {
    const main = byName[spec.name].mainInstance(), viewport = spec.eventType;
    const leaves = C.components.filter((item) => item.kind === 'leaf' && item.name.includes(`.${viewport}.8006`) && !(spec.linkedLeaves === 6 && item.name.includes('.calendar.')));
    assert.equal(leaves.length, spec.linkedLeaves);
    leaves.forEach((leaf, index) => {
      const instance = new Shape('board', `linked-${spec.name}-${index}`); instance.name = `slot-${index}`;
      const exact = byName[leaf.name]; instance._component = exact;
      if (distinctProxies) instance.component = () => new Proxy(exact, {});
      main.appendChild(instance);
    });
  }
  const currentFile = {
    id: C.target.fileId, revn: 73,
    getSharedPluginData: (ns, key) => shared.get(`${ns}\0${key}`) || '',
    validate: () => [],
    async findVersions() { return versions.map((version) => ({ ...version })); },
    async saveVersion(label) {
      saveCount++;
      if (saveThrows) throw new Error('simulated transport timeout');
      this.revn++;
      const value = { id: `version-${saveCount}`, label }; versions.push(value); return value;
    },
  };
  const page = { id: C.target.pageId, root };
  const penpot = {
    currentFile, currentPage: page,
    library: { local: { get components() { return distinctProxies ? components.map((component) => new Proxy(component, {})) : components; } } },
    history: { undoBlockBegin() { undoBegin++; return Symbol('undo'); }, undoBlockFinish(block) { assert.equal(typeof block, 'symbol'); undoFinish++; } },
  };
  const authorization = {
    schema: 'kenigevents.asp-path-repair-execution-authorization.v1', package_id: C.packageId, request_id: C.requestId,
    penpot_execution_authorized: true, writer_id: '/root/publish_r2', state: 'ACTIVE', cancelled: false,
    contract_commit: C.source.contractCommit, contract_sha256: C.source.contractSha256,
    paths_input_sha256: C.source.pathsSha256, four_cases_input_sha256: C.source.fourCasesSha256,
    run_id: 'eventcard-paths-r1-run', lease_token: 'eventcard-paths-r1-lease', cancel_token: 'eventcard-paths-r1-cancel', protected_projection_sha256: 'pending-projection',
  };
  shared.set('kenigevents\0asp-active-run-v1', JSON.stringify({
    schema: 'kenigevents.asp-run-control.v1', package_id: C.packageId, run_id: authorization.run_id,
    writer_id: authorization.writer_id, state: 'ACTIVE', cancelled: false, contract_sha256: C.source.contractSha256,
    lease_token: authorization.lease_token, cancel_token: authorization.cancel_token,
  }));
  return { penpot, page, board, components, byName, versions, authorization, counts: () => ({ undoBegin, undoFinish, saveCount }), setSaveThrows: (value) => { saveThrows = value; } };
}

async function authorize(surface) {
  const readback = await E.readEventCardComponentPathsR1({ penpot: surface.penpot });
  surface.authorization.protected_projection_sha256 = readback.protected_projection_sha256;
  return readback;
}

(async () => {
  const packagePath = path.join(ROOT, 'catalog/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-REPAIR-R1.package.v1.json');
  const requestPath = path.join(ROOT, 'catalog/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/ASP_BUILD_REQUEST_V2.eventcard-native-component-paths-r1.json');
  const manifestPath = path.join(ROOT, 'catalog/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/manifest.v1.json');
  const packageV1 = JSON.parse(fs.readFileSync(packagePath)), request = JSON.parse(fs.readFileSync(requestPath)), manifest = JSON.parse(fs.readFileSync(manifestPath));
  assert.equal(packageV1.package_id, C.packageId); assert.equal(packageV1.state, 'MAT_PACKAGE_READY_QA_INTEGRATE_GATED');
  assert.equal(packageV1.penpot_execution_authorized, false); assert.equal(request.marker, 'ASP_BUILD_REQUEST_V2');
  assert.equal(request.penpot_execution_authorized, false); assert.equal(manifest.penpot_execution_authorized, false);
  assert.equal(packageV1.interpretation.path_only_write, true); assert.equal(packageV1.interpretation.component_name_changes, 0); assert.equal(packageV1.interpretation.main_name_changes, 0);
  assert.equal(packageV1.native_executor.sha256, sha256(fs.readFileSync(path.join(ROOT, packageV1.native_executor.path))));
  assert.equal(C.components.length, 18); assert.deepEqual(Object.values(C.paths).map((value) => value.includes('G19')), [false, false, false, false]);
  assert.ok(C.components.every((spec) => !spec.name.includes('/'))); assert.equal(C.components.filter((spec) => spec.eventType === true).length, 2);
  assert.equal(C.components.filter((spec) => spec.componentId).length, 4); assert.equal(new Set(C.components.filter((spec) => spec.componentId).map((spec) => spec.componentId)).size, 4);

  const gated = makeSurface(); await authorize(gated);
  await assert.rejects(E.runEventCardComponentPathsR1({ penpot: gated.penpot, authorization: { ...gated.authorization, penpot_execution_authorized: false } }), /EXECUTION_AUTHORIZATION_MISMATCH/);
  assert.equal(gated.counts().undoBegin, 0);

  const s = makeSurface({ distinctProxies: true });
  const initial = await authorize(s); assert.equal(initial.components.filter((row) => row.native_path === '').length, 15); assert.equal(initial.components.filter((row) => row.native_path === C.knownLegacyCasePath).length, 3);
  const before = snapshot(s), originalComponentIds = initial.components.map((row) => row.component_id), originalMainIds = initial.components.map((row) => row.main_id);
  const originalInstanceIds = walk(s.board).filter((shape) => shape.id.startsWith('linked-')).map((shape) => shape.id);
  let terminal;
  for (let call = 1; call <= 6; call++) {
    const result = await E.runEventCardComponentPathsR1({ penpot: s.penpot, authorization: s.authorization });
    assert.equal(result.mutations, 3); assert.equal(result.exact_paths, call * 3); assert.equal(result.checkpoint_label, `${C.packageId} · PATHS ${call * 3}/18`);
    if (call < 6) assert.equal(result.terminal_state, 'RESUME_REQUIRED_AFTER_FRESH_READBACK'); else terminal = result;
  }
  assert.equal(terminal.terminal_state, 'PATHS_REPAIRED_QA_READBACK_REQUIRED'); assert.equal(terminal.visual_pass, false);
  assert.deepEqual(terminal.component_ids, originalComponentIds); assert.deepEqual(terminal.main_ids, originalMainIds);
  assert.deepEqual(walk(s.board).filter((shape) => shape.id.startsWith('linked-')).map((shape) => shape.id), originalInstanceIds);
  const finalReadback = await E.readEventCardComponentPathsR1({ penpot: s.penpot });
  assert.equal(finalReadback.components.filter((row) => row.native_path === row.expected_path).length, 18);
  assert.ok(finalReadback.event_type_native_paths.every((row) => row.native_path && row.native_path === row.expected_path));
  assert.equal(finalReadback.protected_projection_sha256, initial.protected_projection_sha256);
  const after = JSON.parse(snapshot(s)); const beforeParsed = JSON.parse(before);
  beforeParsed.components.forEach((component, index) => { component.path = after.components[index].path; });
  assert.deepEqual(after, beforeParsed, 'only LibraryComponent.path may differ');
  const versionsBefore = s.versions.length, second = await E.runEventCardComponentPathsR1({ penpot: s.penpot, authorization: s.authorization });
  assert.equal(second.terminal_state, 'PATHS_REPAIRED_QA_READBACK_REQUIRED'); assert.equal(second.mutations, 0); assert.equal(second.second_run_mutations, 0); assert.equal(s.versions.length, versionsBefore);
  assert.deepEqual(s.counts(), { undoBegin: 6, undoFinish: 6, saveCount: 6 });

  const wrongProxy = makeSurface({ distinctProxies: true }); await authorize(wrongProxy);
  const caseMain = wrongProxy.byName['eventcard.desktop-wide-calendar.8006'].mainInstance();
  const eventTypeInstance = caseMain.children.find((shape) => shape.component().id === wrongProxy.byName['event.meta.event-type.desktop.8006'].id);
  eventTypeInstance.component = () => ({ id: 'wrong-native-proxy-id' });
  await assert.rejects(E.runEventCardComponentPathsR1({ penpot: wrongProxy.penpot, authorization: wrongProxy.authorization }), /LINKED_EVENT_TYPE_ID_MISMATCH/);
  assert.equal(wrongProxy.counts().undoBegin, 0);

  const unknownPath = makeSurface(); unknownPath.byName['event.media-frame.desktop.8006'].path = 'Wrong / Nonempty';
  await assert.rejects(authorize(unknownPath), /UNKNOWN_NONBLANK_COMPONENT_PATH/); assert.equal(unknownPath.counts().undoBegin, 0);
  const nameDrift = makeSurface(); nameDrift.byName['event.meta.event-type.mobile.8006'].mainInstance().name += ' / duplicated';
  await assert.rejects(authorize(nameDrift), /COMPONENT_IDENTITY_CARDINALITY/); assert.equal(nameDrift.counts().undoBegin, 0);
  const protectedFree = makeSurface(); protectedFree.page.root.appendChild(new Shape('board', 'second-root'));
  await assert.rejects(authorize(protectedFree), /PROTECTED_FREE_PAGE_ROOT_COUNT/); assert.equal(protectedFree.counts().undoBegin, 0);

  const canceled = makeSurface(); await authorize(canceled);
  const marker = JSON.parse(canceled.penpot.currentFile.getSharedPluginData('kenigevents', 'asp-active-run-v1'));
  canceled.penpot.currentFile.getSharedPluginData = () => JSON.stringify({ ...marker, state: 'CANCEL_REQUESTED' });
  await assert.rejects(E.runEventCardComponentPathsR1({ penpot: canceled.penpot, authorization: canceled.authorization }), /ACTIVE_RUN_OR_CANCEL_BINDING_MISMATCH/);
  assert.equal(canceled.counts().undoBegin, 0);

  const midCancel = makeSurface(); await authorize(midCancel);
  const firstComponent = midCancel.components[0]; let firstPath = firstComponent.path;
  Object.defineProperty(firstComponent, 'path', { configurable: true, get: () => firstPath, set: (value) => {
    firstPath = value;
    const active = JSON.parse(midCancel.penpot.currentFile.getSharedPluginData('kenigevents', 'asp-active-run-v1'));
    midCancel.penpot.currentFile.getSharedPluginData = () => JSON.stringify({ ...active, state: 'CANCEL_REQUESTED' });
  } });
  let midCancelError;
  try { await E.runEventCardComponentPathsR1({ penpot: midCancel.penpot, authorization: midCancel.authorization }); } catch (error) { midCancelError = error; }
  assert.equal(midCancelError.code, 'PATH_WRITE_PARTIAL_STOP_READBACK_REQUIRED'); assert.equal(midCancelError.unknownOutcome, true);
  assert.equal(midCancelError.stopContract.state, 'STOP_UNKNOWN_OUTCOME_READBACK_REQUIRED'); assert.deepEqual(midCancel.counts(), { undoBegin: 1, undoFinish: 1, saveCount: 0 });

  const unknown = makeSurface({ saveThrows: true }); await authorize(unknown);
  let unknownError;
  try { await E.runEventCardComponentPathsR1({ penpot: unknown.penpot, authorization: unknown.authorization }); } catch (error) { unknownError = error; }
  assert.equal(unknownError.code, 'UNKNOWN_OUTCOME_SAVE_VERSION'); assert.equal(unknownError.unknownOutcome, true);
  assert.equal(unknownError.stopContract.state, 'STOP_UNKNOWN_OUTCOME_READBACK_REQUIRED'); assert.equal(unknownError.stopContract.retry_allowed, false);
  const unknownReadback = await E.readEventCardComponentPathsR1({ penpot: unknown.penpot }); assert.equal(unknownReadback.components.filter((row) => row.native_path === row.expected_path).length, 3);
  unknown.setSaveThrows(false);
  const recovery = await E.runEventCardComponentPathsR1({ penpot: unknown.penpot, authorization: unknown.authorization });
  assert.equal(recovery.terminal_state, 'CHECKPOINT_RECOVERED_RESUME_REQUIRED'); assert.equal(recovery.mutations, 0); assert.equal(recovery.exact_paths, 3);

  const source = fs.readFileSync(path.join(ROOT, 'scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/eventcard_component_paths_native_executor_r1.js'), 'utf8');
  for (const forbidden of [/\.detach\s*\(/, /createComponent\s*\(/, /createBoard\s*\(/, /createText\s*\(/, /createShapeFromSvg/, /\.remove\s*\(/, /\.characters\s*=/, /\.fills\s*=/, /(?:component|main|shape|row\.component)\.name\s*=/, /\.resize\s*\(/, /appendChild\s*\(/]) assert.ok(!forbidden.test(source), `forbidden mutation primitive ${forbidden}`);
  assert.match(source, /row\.component\.path = row\.expectedPath/); assert.match(source, /epComponentId\(shape\) === expectedEventTypeId/);
  console.log('MAT_EVENTCARD_COMPONENT_PATHS_R1_NATIVE_HARNESS_PASS');
})().catch((error) => { console.error(error); process.exitCode = 1; });

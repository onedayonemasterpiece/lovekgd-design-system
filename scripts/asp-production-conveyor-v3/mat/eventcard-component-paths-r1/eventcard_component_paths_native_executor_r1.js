/*
 * Native, in-place LibraryComponent.path repair for the persistent EventCard
 * system.  This file is inert unless an external D0/PUBLISH authorization
 * receipt is supplied.  MAT must never invoke it against Penpot.
 */
const EVENTCARD_PATHS_R1 = Object.freeze({
  schema: 'kenigevents.mat-eventcard-native-component-paths-executor.r1',
  packageId: 'MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-REPAIR-R1',
  requestId: 'U0-EVENTCARD-NATIVE-PATHS-20260831-R1',
  penpotExecutionAuthorized: false,
  maxPathWritesPerCall: 3,
  target: Object.freeze({
    fileId: '40e06342-8830-80d6-8008-8fc8a3a4cd4f',
    pageId: 'c16498cb-b51d-8030-8008-904bd8fc9c53',
    boardId: '313fb1ed-0d5c-8095-8008-9108df52b2ce',
    boardName: 'KenigEvents · G12 bounded L0-L3',
    minimumRevision: 73,
    pageDirectRoots: 1,
    boardChildren: 18,
    localComponents: 18,
  }),
  source: Object.freeze({
    pathsHead: '9b63c901f90aacef3d1f555a22a7e2c1d3f01856',
    pathsTree: '2609ef4bd5152a47f47fbd287d74ae575d648326',
    pathsBlob: 'e6aa7adec5b6fb5a191834e6e46f725fa3a9d77e',
    pathsSha256: '15e6919487cd7cf0c9fef96907ea2c8249c54d6a00eab8a235422e0d23583895',
    fourCasesHead: 'c2d6ff107c632311d1c1d0cb1b74d7eb0a465b18',
    fourCasesTree: 'ddff285e2a16f2f0590ac2964b27dedd853d4de8',
    fourCasesBlob: '6496f9fdf2c19cce06c2a07d5b4d48061afe5522',
    fourCasesSha256: 'bf25934808144ba1a34c6676fdb4dd6147916713da783eaf7c7e50a61b196f81',
    contractCommit: '7607143afc240b9f96abd51270ab82735aabf9bc',
    contractSha256: '75c70629f01f8d60fb98290fa2e6e8abc201fc84885339c16010bcd75ddd4289',
    g19PayloadSha256: '9ada6460e93ab362012b5e8164ed340054fd352983d1706873402b4e1e356d33',
  }),
  knownLegacyCasePath: 'KenigEvents / G19 / EventCard 8006 / Accepted',
  paths: Object.freeze({
    desktopLeaves: 'KenigEvents / EventCard / Leaves / Desktop',
    mobileLeaves: 'KenigEvents / EventCard / Leaves / Mobile',
    desktopCases: 'KenigEvents / EventCard / Cases / Desktop',
    mobileCases: 'KenigEvents / EventCard / Cases / Mobile',
  }),
  components: Object.freeze([
    { name: 'event.media-frame.desktop.8006', group: 'desktopLeaves', kind: 'leaf' },
    { name: 'event.meta.event-type.desktop.8006', group: 'desktopLeaves', kind: 'leaf', eventType: true },
    { name: 'event.meta.admission.desktop.8006', group: 'desktopLeaves', kind: 'leaf' },
    { name: 'event.action.not-interested.desktop.8006', group: 'desktopLeaves', kind: 'leaf' },
    { name: 'event.action.calendar.desktop.8006', group: 'desktopLeaves', kind: 'leaf' },
    { name: 'event.action.share.desktop.8006', group: 'desktopLeaves', kind: 'leaf' },
    { name: 'event.action.like.desktop.8006', group: 'desktopLeaves', kind: 'leaf' },
    { name: 'event.media-frame.mobile.8006', group: 'mobileLeaves', kind: 'leaf' },
    { name: 'event.meta.event-type.mobile.8006', group: 'mobileLeaves', kind: 'leaf', eventType: true },
    { name: 'event.meta.admission.mobile.8006', group: 'mobileLeaves', kind: 'leaf' },
    { name: 'event.action.not-interested.mobile.8006', group: 'mobileLeaves', kind: 'leaf' },
    { name: 'event.action.calendar.mobile.8006', group: 'mobileLeaves', kind: 'leaf' },
    { name: 'event.action.share.mobile.8006', group: 'mobileLeaves', kind: 'leaf' },
    { name: 'event.action.like.mobile.8006', group: 'mobileLeaves', kind: 'leaf' },
    { name: 'eventcard.desktop-wide-calendar.8006', group: 'desktopCases', kind: 'case', componentId: '313fb1ed-0d5c-8095-8008-912d51452f89', mainId: '313fb1ed-0d5c-8095-8008-912c45090653', linkedLeaves: 7, eventType: 'desktop' },
    { name: 'eventcard.desktop-packed-calendar-absent.2182', group: 'desktopCases', kind: 'case', componentId: '313fb1ed-0d5c-8095-8008-916b0b931d1f', mainId: '313fb1ed-0d5c-8095-8008-914c76615924', linkedLeaves: 6, eventType: 'desktop', legacyPath: true },
    { name: 'eventcard.mobile-wide-calendar.8006', group: 'mobileCases', kind: 'case', componentId: '313fb1ed-0d5c-8095-8008-916bb0cb7843', mainId: '313fb1ed-0d5c-8095-8008-916b340de148', linkedLeaves: 7, eventType: 'mobile', legacyPath: true },
    { name: 'eventcard.mobile-packed-calendar-absent.2182', group: 'mobileCases', kind: 'case', componentId: '313fb1ed-0d5c-8095-8008-916be7e9352d', mainId: '313fb1ed-0d5c-8095-8008-916bd0ab6c98', linkedLeaves: 6, eventType: 'mobile', legacyPath: true },
  ]),
});

class EventCardPathsStop extends Error {
  constructor(code, detail = {}, unknownOutcome = false) {
    super(`${code}: ${JSON.stringify(detail)}`);
    this.name = 'EventCardPathsStop';
    this.code = code;
    this.detail = detail;
    this.unknownOutcome = unknownOutcome;
    this.stopContract = unknownOutcome ? Object.freeze({
      state: 'STOP_UNKNOWN_OUTCOME_READBACK_REQUIRED',
      retry_allowed: false,
      next_action: 'Run readEventCardComponentPathsR1 read-only; compare exact path map, stable IDs, protected projection digest, validation, and checkpoint version before any retry.',
    }) : null;
  }
}

const epFail = (code, detail = {}, unknown = false) => { throw new EventCardPathsStop(code, detail, unknown); };
const epArray = (value) => Array.from(value || []);
const epChildren = (shape) => epArray(shape?.children);
const epMain = (component) => typeof component?.mainInstance === 'function' ? component.mainInstance() : component?.mainInstance;
const epCanonical = (value) => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(epCanonical).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${epCanonical(value[key])}`).join(',')}}`;
};
const epJsonValue = (value) => {
  if (value == null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.map(epJsonValue);
  if (typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      const item = value[key];
      if (typeof item !== 'function' && typeof item !== 'undefined') out[key] = epJsonValue(item);
    }
    return out;
  }
  return String(value);
};
const epWalk = (root) => {
  const out = [], queue = root ? [root] : [];
  while (queue.length) { const shape = queue.shift(); out.push(shape); queue.push(...epChildren(shape)); }
  return out;
};
const epPlugin = (shape, key) => String(shape?.getPluginData?.(key) || '');
const epComponentId = (shape) => {
  const value = typeof shape?.component === 'function' ? shape.component() : null;
  return value?.id == null ? null : String(value.id);
};

function epShapeProjection(shape) {
  return {
    id: String(shape?.id || ''), parentId: shape?.parent?.id == null ? null : String(shape.parent.id),
    type: shape?.type ?? null, name: shape?.name ?? null,
    x: shape?.x ?? null, y: shape?.y ?? null, parentX: shape?.parentX ?? null, parentY: shape?.parentY ?? null,
    width: shape?.width ?? null, height: shape?.height ?? null, rotation: shape?.rotation ?? null,
    flipX: shape?.flipX ?? null, flipY: shape?.flipY ?? null, hidden: shape?.hidden ?? null, visible: shape?.visible ?? null,
    clipContent: shape?.clipContent ?? null, characters: shape?.characters ?? null, growType: shape?.growType ?? null,
    fontFamily: shape?.fontFamily ?? null, fontSize: shape?.fontSize ?? null, fontWeight: shape?.fontWeight ?? null,
    fontStyle: shape?.fontStyle ?? null, lineHeight: shape?.lineHeight ?? null, letterSpacing: shape?.letterSpacing ?? null,
    fills: epJsonValue(shape?.fills ?? []), strokes: epJsonValue(shape?.strokes ?? []), componentId: epComponentId(shape),
    marker: epPlugin(shape, 'kenigevents-g19-marker'), childMarker: epPlugin(shape, 'kenigevents-g19-child-marker'),
    payload: epPlugin(shape, 'kenigevents-payload-sha256'), buildState: epPlugin(shape, 'kenigevents-build-state'),
    componentName: epPlugin(shape, 'kenigevents-component-name'), componentPluginId: epPlugin(shape, 'kenigevents-component-id'),
    instanceSlot: epPlugin(shape, 'kenigevents-instance-slot'), children: epChildren(shape).map((child) => String(child.id)),
  };
}

function epAuthorization(penpot, authorization) {
  const C = EVENTCARD_PATHS_R1;
  if (C.penpotExecutionAuthorized !== false) epFail('PACKAGED_EXECUTION_GATE_CORRUPT');
  const expected = {
    schema: 'kenigevents.asp-path-repair-execution-authorization.v1', package_id: C.packageId,
    request_id: C.requestId, penpot_execution_authorized: true, writer_id: '/root/publish_r2', state: 'ACTIVE', cancelled: false,
    contract_commit: C.source.contractCommit, contract_sha256: C.source.contractSha256,
    paths_input_sha256: C.source.pathsSha256, four_cases_input_sha256: C.source.fourCasesSha256,
  };
  for (const [key, value] of Object.entries(expected)) if (authorization?.[key] !== value) epFail('EXECUTION_AUTHORIZATION_MISMATCH', { key });
  for (const key of ['run_id', 'lease_token', 'cancel_token', 'protected_projection_sha256']) {
    if (!/^[0-9A-Za-z._:-]{8,}$/.test(String(authorization?.[key] || ''))) epFail('EXECUTION_AUTHORIZATION_FIELD_INVALID', { key });
  }
  let marker;
  try { marker = JSON.parse(penpot.currentFile?.getSharedPluginData?.('kenigevents', 'asp-active-run-v1') || 'null'); }
  catch (error) { epFail('ACTIVE_RUN_INVALID_JSON', { message: String(error?.message || error) }); }
  const exact = marker?.schema === 'kenigevents.asp-run-control.v1' && marker.package_id === C.packageId &&
    marker.run_id === authorization.run_id && marker.writer_id === authorization.writer_id && marker.state === 'ACTIVE' &&
    marker.cancelled === false && marker.contract_sha256 === C.source.contractSha256 &&
    marker.lease_token === authorization.lease_token && marker.cancel_token === authorization.cancel_token;
  if (!exact) epFail('ACTIVE_RUN_OR_CANCEL_BINDING_MISMATCH');
  return marker;
}

function epResolve(penpot) {
  const C = EVENTCARD_PATHS_R1;
  if (penpot.currentFile?.id !== C.target.fileId || penpot.currentPage?.id !== C.target.pageId) epFail('TARGET_FILE_OR_PAGE_MISMATCH');
  const revision = Number(penpot.currentFile?.revn ?? penpot.currentFile?.revision);
  if (!Number.isFinite(revision) || revision < C.target.minimumRevision) epFail('REVISION_BEFORE_DURABLE_TERMINAL', { revision });
  const pageRoots = epChildren(penpot.currentPage?.root);
  if (pageRoots.length !== 1) epFail('PROTECTED_FREE_PAGE_ROOT_COUNT', { actual: pageRoots.length });
  const board = pageRoots[0];
  if (String(board.id) !== C.target.boardId || board.name !== C.target.boardName || board.type !== 'board') epFail('PROTECTED_FREE_COLLECTION_ROOT_MISMATCH');
  if (epChildren(board).length !== C.target.boardChildren) epFail('PROTECTED_FREE_COLLECTION_CHILD_COUNT', { actual: epChildren(board).length });
  const components = epArray(penpot.library?.local?.components);
  if (components.length !== C.target.localComponents) epFail('LOCAL_COMPONENT_COUNT_MISMATCH', { actual: components.length });
  const resolved = [];
  for (const spec of C.components) {
    const matches = components.filter((component) => {
      const main = epMain(component);
      return component?.name === spec.name && main?.name === spec.name &&
        epPlugin(main, 'kenigevents-g19-marker') === `kenigevents:g19:p2:${spec.name}:v3` &&
        epPlugin(main, 'kenigevents-payload-sha256') === C.source.g19PayloadSha256 &&
        epPlugin(main, 'kenigevents-build-state') === 'COMPLETE' &&
        epPlugin(main, 'kenigevents-component-name') === spec.name &&
        epPlugin(main, 'kenigevents-component-id') === String(component.id) &&
        String(main?.parent?.id || '') === C.target.boardId;
    });
    if (matches.length !== 1) epFail('COMPONENT_IDENTITY_CARDINALITY', { name: spec.name, count: matches.length });
    const component = matches[0], main = epMain(component), expectedPath = C.paths[spec.group], currentPath = String(component.path ?? '');
    if (spec.name.includes('/') || main.name.includes('/') || expectedPath.split(' / ').at(-1) === spec.name) epFail('LEAF_PATH_MAIN_SLASH_DUPLICATION', { name: spec.name });
    const allowed = currentPath === '' || currentPath === expectedPath || (spec.legacyPath === true && currentPath === C.knownLegacyCasePath);
    if (!allowed) epFail('UNKNOWN_NONBLANK_COMPONENT_PATH', { name: spec.name, currentPath });
    if (spec.componentId && String(component.id) !== spec.componentId) epFail('DURABLE_COMPONENT_ID_MISMATCH', { name: spec.name });
    if (spec.mainId && String(main.id) !== spec.mainId) epFail('DURABLE_MAIN_ID_MISMATCH', { name: spec.name });
    resolved.push({ spec, component, main, expectedPath, currentPath });
  }
  const componentIds = resolved.map((row) => String(row.component.id)), mainIds = resolved.map((row) => String(row.main.id));
  if (new Set(componentIds).size !== 18 || new Set(mainIds).size !== 18) epFail('STABLE_ID_COLLISION');
  if (new Set(epChildren(board).map((shape) => String(shape.id))).size !== 18 || !mainIds.every((id) => epChildren(board).some((shape) => String(shape.id) === id))) epFail('MAIN_ID_NOT_IN_PROTECTED_COLLECTION');
  const byName = Object.fromEntries(resolved.map((row) => [row.spec.name, row]));
  for (const row of resolved.filter((item) => item.spec.kind === 'case')) {
    const links = epChildren(row.main).filter((shape) => epComponentId(shape));
    if (links.length !== row.spec.linkedLeaves) epFail('LINKED_LEAF_COUNT_MISMATCH', { name: row.spec.name, actual: links.length });
    const eventTypeName = `event.meta.event-type.${row.spec.eventType}.8006`, expectedEventTypeId = String(byName[eventTypeName].component.id);
    const eventTypeLinks = links.filter((shape) => epComponentId(shape) === expectedEventTypeId);
    if (eventTypeLinks.length !== 1) epFail('LINKED_EVENT_TYPE_ID_MISMATCH', { name: row.spec.name, expectedEventTypeId, actual: eventTypeLinks.map((shape) => epComponentId(shape)) });
  }
  const validation = penpot.currentFile?.validate?.();
  const normalizedValidation = Array.isArray(validation) ? validation : validation == null ? [] : validation;
  if (normalizedValidation.length) epFail('PENPOT_VALIDATION_NOT_EMPTY', { validation: normalizedValidation });
  return { revision, board, resolved, componentIds, mainIds, validation: normalizedValidation };
}

function epProtectedProjection(penpot, state) {
  const shapes = epWalk(penpot.currentPage.root).map(epShapeProjection).sort((a, b) => a.id.localeCompare(b.id));
  const components = state.resolved.map((row) => ({ id: String(row.component.id), name: row.component.name, mainId: String(row.main.id), mainName: row.main.name })).sort((a, b) => a.id.localeCompare(b.id));
  return epCanonical({ fileId: String(penpot.currentFile.id), pageId: String(penpot.currentPage.id), boardId: String(state.board.id), shapes, components });
}

async function epSha256(value) {
  const bytes = new TextEncoder().encode(value);
  if (globalThis.crypto?.subtle) return [...new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', bytes))].map((x) => x.toString(16).padStart(2, '0')).join('');
  if (typeof require === 'function') return require('crypto').createHash('sha256').update(bytes).digest('hex');
  epFail('SHA256_UNAVAILABLE');
}

async function readEventCardComponentPathsR1({ penpot }) {
  const state = epResolve(penpot), protectedProjection = epProtectedProjection(penpot, state);
  return {
    schema: 'kenigevents.mat-eventcard-native-component-paths-readback.r1', state: 'READ_ONLY_NO_MUTATIONS',
    file_id: EVENTCARD_PATHS_R1.target.fileId, page_id: EVENTCARD_PATHS_R1.target.pageId, revision: state.revision,
    protected_projection_sha256: await epSha256(protectedProjection), validation: state.validation,
    components: state.resolved.map((row) => ({ name: row.spec.name, component_id: String(row.component.id), main_id: String(row.main.id), component_name: row.component.name, main_name: row.main.name, native_path: row.currentPath, expected_path: row.expectedPath })),
    event_type_native_paths: state.resolved.filter((row) => row.spec.eventType === true).map((row) => ({ name: row.spec.name, native_path: row.currentPath, expected_path: row.expectedPath })),
    penpot_mutations: 0,
  };
}

async function epVersions(penpot) {
  try { return epArray(await penpot.currentFile.findVersions()); }
  catch (error) { epFail('UNKNOWN_OUTCOME_FIND_VERSIONS', { message: String(error?.message || error) }, true); }
}

async function epSaveVersion(penpot, authorization, label) {
  epAuthorization(penpot, authorization);
  try { const value = await penpot.currentFile.saveVersion(label); epAuthorization(penpot, authorization); return value; }
  catch (error) { epFail('UNKNOWN_OUTCOME_SAVE_VERSION', { label, message: String(error?.message || error) }, true); }
}

async function runEventCardComponentPathsR1({ penpot, authorization }) {
  const C = EVENTCARD_PATHS_R1;
  epAuthorization(penpot, authorization);
  let before = epResolve(penpot), protectedBefore = epProtectedProjection(penpot, before), protectedSha256 = await epSha256(protectedBefore);
  epAuthorization(penpot, authorization);
  if (protectedSha256 !== authorization.protected_projection_sha256) epFail('AUTHORIZED_PROTECTED_PROJECTION_MISMATCH');
  const exactBefore = before.resolved.filter((row) => row.currentPath === row.expectedPath).length;
  const checkpointLabel = `${C.packageId} · PATHS ${exactBefore}/18`;
  const versions = await epVersions(penpot); epAuthorization(penpot, authorization);
  if (exactBefore > 0 && !versions.some((version) => (version?.label || version?.name) === checkpointLabel)) {
    await epSaveVersion(penpot, authorization, checkpointLabel);
    return { schema: C.schema, terminal_state: 'CHECKPOINT_RECOVERED_RESUME_REQUIRED', mutations: 0, exact_paths: exactBefore, checkpoint_label: checkpointLabel, retry_allowed_after_fresh_readback: true };
  }
  const pending = before.resolved.filter((row) => row.currentPath !== row.expectedPath);
  if (!pending.length) {
    return { schema: C.schema, terminal_state: 'PATHS_REPAIRED_QA_READBACK_REQUIRED', mutations: 0, second_run_mutations: 0, exact_paths: 18, native_paths_nonempty: 18, component_ids: before.componentIds, main_ids: before.mainIds, validation: before.validation, visual_pass: false };
  }
  const batch = pending.slice(0, C.maxPathWritesPerCall), block = penpot.history?.undoBlockBegin?.();
  if (block == null || typeof penpot.history?.undoBlockFinish !== 'function') epFail('UNDO_BLOCK_API_MISSING');
  let written = 0;
  try {
    for (const row of batch) { epAuthorization(penpot, authorization); row.component.path = row.expectedPath; written++; }
  } catch (error) {
    try { penpot.history.undoBlockFinish(block); } catch {}
    if (!written && error instanceof EventCardPathsStop) throw error;
    epFail('PATH_WRITE_PARTIAL_STOP_READBACK_REQUIRED', { written, cause: error?.code || null, message: String(error?.message || error) }, true);
  }
  try { penpot.history.undoBlockFinish(block); }
  catch (error) { epFail('UNDO_BLOCK_FINISH_UNKNOWN_OUTCOME', { message: String(error?.message || error) }, true); }
  epAuthorization(penpot, authorization);
  const after = epResolve(penpot), protectedAfter = epProtectedProjection(penpot, after);
  if (protectedAfter !== protectedBefore) epFail('PROTECTED_TEXT_MEDIA_GEOMETRY_OR_ID_DRIFT');
  const exactAfter = after.resolved.filter((row) => row.currentPath === row.expectedPath).length;
  if (exactAfter !== exactBefore + batch.length || !batch.every((prior) => after.resolved.find((row) => row.spec.name === prior.spec.name)?.currentPath === prior.expectedPath)) epFail('POST_WRITE_PATH_READBACK_MISMATCH');
  const label = `${C.packageId} · PATHS ${exactAfter}/18`;
  await epSaveVersion(penpot, authorization, label);
  const final = epResolve(penpot), finalProtected = epProtectedProjection(penpot, final);
  if (finalProtected !== protectedBefore || final.componentIds.join('\0') !== before.componentIds.join('\0') || final.mainIds.join('\0') !== before.mainIds.join('\0')) epFail('POST_VERSION_STABLE_ID_OR_PROTECTED_DRIFT');
  return {
    schema: C.schema, terminal_state: exactAfter === 18 ? 'PATHS_REPAIRED_QA_READBACK_REQUIRED' : 'RESUME_REQUIRED_AFTER_FRESH_READBACK',
    mutations: batch.length, exact_paths: exactAfter, native_paths_nonempty: exactAfter, checkpoint_label: label,
    changed_component_ids: batch.map((row) => String(row.component.id)), component_ids: final.componentIds, main_ids: final.mainIds,
    validation: final.validation, protected_projection_sha256: protectedSha256, visual_pass: false,
    stop_contract: { transport_or_tool_timeout: 'STOP_UNKNOWN_OUTCOME_READBACK_REQUIRED', retry_without_readback: false },
  };
}

if (typeof module !== 'undefined' && module.exports) module.exports = {
  EVENTCARD_PATHS_R1, EventCardPathsStop, epCanonical, epResolve, epProtectedProjection, epSha256,
  readEventCardComponentPathsR1, runEventCardComponentPathsR1,
};

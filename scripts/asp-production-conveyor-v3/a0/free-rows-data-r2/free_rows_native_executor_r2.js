'use strict';

/*
 * Concrete current-file native executor for A-FREE-ROWS-DATA-R2.
 * It never discovers fixtures and never creates substitute components.
 * D0/PUBLISH supplies the Atlas READY page and exact dependency components.
 */
const NS = 'kenigevents-a0-free-rows-data-r2';

function fail(code, detail = '') {
  throw new Error(detail ? `${code}:${detail}` : code);
}
function assert(ok, code, detail = '') {
  if (!ok) fail(code, detail);
}
function children(shape) {
  return Array.from(shape?.children || []);
}
function walk(shape) {
  return shape ? [shape, ...children(shape).flatMap(walk)] : [];
}
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
async function sha256Text(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), x => x.toString(16).padStart(2, '0')).join('');
}
async function verifyRecord(pkg) {
  const clone = JSON.parse(JSON.stringify(pkg));
  const expected = clone.record_sha256;
  delete clone.record_sha256;
  assert(expected && await sha256Text(canonical(clone)) === expected, 'PACKAGE_RECORD_MISMATCH');
}
function shared(shape, key) {
  return shape?.getSharedPluginData?.(NS, key) || '';
}
function tag(shape, key, value) {
  shape.setSharedPluginData(NS, key, String(value));
}
function stable(page, id) {
  return walk(page.root).filter(s => shared(s, 'stable-id') === id);
}
function projectionShape(shape) {
  return {
    id: shape.id,
    name: shape.name || '',
    type: shape.type || '',
    width: shape.width || 0,
    height: shape.height || 0,
    children: children(shape).map(projectionShape),
  };
}
async function protectedProjection(page) {
  const unmanaged = children(page.root).filter(s => !shared(s, 'managed'));
  return sha256Text(canonical(unmanaged.map(projectionShape)));
}
function activeRun(pkg, penpot, storage) {
  let marker;
  try {
    marker = JSON.parse(penpot.currentFile.getSharedPluginData('kenigevents', 'asp-active-run-v1') || 'null');
  } catch {
    fail('ACTIVE_RUN_INVALID');
  }
  const r = pkg.run_control;
  assert(
    marker?.schema === r.schema &&
    marker?.package_id === pkg.package_id &&
    marker?.run_id === r.run_id &&
    marker?.writer_id === r.writer_id &&
    marker?.lease_token === r.lease_token &&
    marker?.cancel_token === r.cancel_token &&
    marker?.state === 'ACTIVE' &&
    marker?.cancelled === false,
    'CANCELLED_OR_INACTIVE_LEASE'
  );
  const receipt = storage[pkg.storage.setup_receipt];
  assert(
    receipt?.package_id === pkg.package_id &&
    receipt?.record_sha256 === pkg.record_sha256 &&
    receipt?.executor_sha256 === pkg.artifacts.executor.sha256 &&
    receipt?.state === 'ACTIVE',
    'SETUP_RECEIPT_MISMATCH'
  );
}
function resolveDependency(pkg, dependencies, key) {
  const expected = pkg.dependency_gates[key];
  const actual = dependencies?.[key];
  assert(expected && actual, 'DEPENDENCY_MISSING', key);
  assert(
    actual.package_id === expected.package_id &&
    actual.remote_head === expected.remote_head &&
    actual.git_blob_sha1 === expected.git_blob_sha1 &&
    actual.semantic_id === expected.semantic_id,
    'DEPENDENCY_STALE_OR_WRONG',
    key
  );
  assert(actual.component && typeof actual.component.instance === 'function', 'DEPENDENCY_NOT_NATIVE_COMPONENT', key);
  return actual.component;
}
function assertAtlasTarget(pkg, targetPage) {
  assert(targetPage, 'ATLAS_READY_PAGE_MISSING');
  assert(targetPage.name === pkg.atlas_binding.physical_page_name, 'ATLAS_PAGE_NAME_MISMATCH');
  assert(
    targetPage.getSharedPluginData('kenigevents-atlas-v2', 'source-package-id') === pkg.atlas_binding.source_package_id &&
    targetPage.getSharedPluginData('kenigevents-atlas-v2', 'projection-role') === 'READY',
    'ATLAS_READY_BINDING_MISMATCH'
  );
}
function write(penpot, label, fn) {
  activeRun(write.pkg, penpot, write.storage);
  const block = penpot.history.undoBlockBegin();
  try {
    const result = fn();
    assert(!(result && typeof result.then === 'function'), 'ASYNC_WRITE_FORBIDDEN', label);
    return result;
  } finally {
    penpot.history.undoBlockFinish(block);
  }
}
function append(parent, child) {
  parent.appendChild(child);
}
function createBoard(penpot, parent, name, stableId, width, height) {
  return write(penpot, stableId, () => {
    const board = penpot.createBoard();
    board.name = name;
    board.resize(width, height);
    tag(board, 'stable-id', stableId);
    tag(board, 'managed', 'true');
    tag(board, 'candidate-label', 'CANDIDATE_BUILD_NOT_ACCEPTED');
    append(parent, board);
    return board;
  });
}
function createLinkedInstance(penpot, parent, component, stableId, metadata) {
  return write(penpot, stableId, () => {
    const instance = component.instance();
    assert(instance?.isComponentCopyInstance?.() && instance.component?.(), 'DETACHED_INSTANCE', stableId);
    instance.name = stableId;
    tag(instance, 'stable-id', stableId);
    tag(instance, 'managed', 'true');
    for (const [key, value] of Object.entries(metadata)) tag(instance, key, value);
    append(parent, instance);
    return instance;
  });
}
function makeTasks(pkg, penpot, targetPage, eventCard, medallion) {
  const rootId = pkg.target.root_semantic_id;
  const root = stable(targetPage, rootId)[0] || null;
  const eventsId = pkg.rows[0].semantic_id;
  const exhibitionsId = pkg.rows[1].semantic_id;
  const events = stable(targetPage, eventsId)[0] || null;
  const exhibitions = stable(targetPage, exhibitionsId)[0] || null;
  const tasks = [];
  if (!root) {
    tasks.push(() => createBoard(penpot, targetPage.root, pkg.target.root_name, rootId, 1240, 760));
    return tasks;
  }
  if (!events) tasks.push(() => createBoard(penpot, root, 'Free row · Events · 2', eventsId, 1160, 280));
  if (!exhibitions) tasks.push(() => createBoard(penpot, root, 'Free row · Exhibitions · 3', exhibitionsId, 1160, 360));
  const rowByGroup = { events: events || stable(targetPage, eventsId)[0], exhibitions: exhibitions || stable(targetPage, exhibitionsId)[0] };
  if (!rowByGroup.events || !rowByGroup.exhibitions) return tasks;
  for (const row of pkg.rows) {
    for (const fixtureId of row.fixture_ids) {
      const id = `card/${fixtureId}`;
      if (!stable(targetPage, id).length) {
        tasks.push(() => createLinkedInstance(penpot, rowByGroup[row.group], eventCard, id, {
          'fixture-id': fixtureId,
          'group': row.group,
          'fixture-order': pkg.fixture_order.indexOf(fixtureId),
          'fixture-semantics': 'EXACT_PROJECTION_MEMBERSHIP',
        }));
      }
    }
    const medallionId = `medallion/${row.group}`;
    if (!stable(targetPage, medallionId).length) {
      tasks.push(() => createLinkedInstance(penpot, rowByGroup[row.group], medallion, medallionId, {
        'mapping-id': pkg.dependency_gates.medallion.semantic_id,
        'group': row.group,
      }));
    }
  }
  return tasks;
}
function assertNoDuplicates(pkg, page) {
  const ids = [
    pkg.target.root_semantic_id,
    ...pkg.rows.map(r => r.semantic_id),
    ...pkg.fixture_order.map(x => `card/${x}`),
    ...pkg.rows.map(r => `medallion/${r.group}`),
  ];
  for (const id of ids) assert(stable(page, id).length <= 1, 'DUPLICATE_MANAGED_SEMANTIC_ID', id);
}
async function terminalReadback(pkg, penpot, targetPage, eventCard, medallion, baseline) {
  const root = stable(targetPage, pkg.target.root_semantic_id)[0];
  assert(root, 'ROOT_MISSING');
  const rows = pkg.rows.map(r => stable(targetPage, r.semantic_id)[0]);
  assert(rows.every(Boolean), 'ROW_MISSING');
  const cards = pkg.fixture_order.map(x => stable(targetPage, `card/${x}`)[0]);
  assert(cards.every(Boolean), 'CARD_MISSING');
  assert(cards.every(x => x.isComponentCopyInstance?.() && x.component?.()?.id === eventCard.id), 'DETACHED_INSTANCE');
  const actualOrder = rows.flatMap(row => children(row).filter(x => shared(x, 'fixture-id')).map(x => shared(x, 'fixture-id')));
  assert(canonical(actualOrder) === canonical(pkg.render_order), 'FACTUAL_RENDER_ORDER_DRIFT');
  for (const row of pkg.rows) {
    const actual = children(stable(targetPage, row.semantic_id)[0]).filter(x => shared(x, 'fixture-id')).map(x => shared(x, 'fixture-id'));
    assert(canonical(actual) === canonical(row.fixture_ids), 'ROW_MEMBERSHIP_DRIFT', row.group);
  }
  const medals = pkg.rows.map(r => stable(targetPage, `medallion/${r.group}`)[0]);
  assert(medals.every(x => x?.isComponentCopyInstance?.() && x.component?.()?.id === medallion.id), 'MEDALLION_BINDING_DRIFT');
  const screenshots = walk(root).filter(x => x.type === 'image' || Array.from(x.fills || []).some(f => f.fillImage));
  assert(screenshots.length === 0, 'SCREENSHOT_IMPLEMENTATION');
  const validation = penpot.currentFile.validate() || [];
  assert(validation.length === 0, 'VALIDATION_NOT_EMPTY');
  const after = await protectedProjection(targetPage);
  assert(after === baseline, 'PROTECTED_PROJECTION_DRIFT');
  const exported = await root.export({type: 'png', scale: 1});
  const bytes = exported instanceof Uint8Array ? exported : new Uint8Array(exported);
  assert(bytes.length > 0, 'ROOT_EXPORT_EMPTY');
  return {
    terminal_state: 'MAT_PACKAGE_READY_QA_INTEGRATE_GATED',
    created: 0,
    second_run_created: 0,
    root_id: root.id,
    row_ids: rows.map(x => x.id),
    card_ids: cards.map(x => x.id),
    medallion_ids: medals.map(x => x.id),
    fixture_input_order: pkg.fixture_order,
    rendered_row_order: actualOrder,
    export_bytes: bytes.length,
    validation,
    visual_acceptance: 'PENDING_V0',
    promotion_authorized: false,
  };
}
async function runFreeRowsDataR2(pkg, ctx) {
  const {penpot, storage, targetPage, dependencies} = ctx;
  await verifyRecord(pkg);
  assert(pkg.package_id === 'A-FREE-ROWS-DATA-R2', 'WRONG_PACKAGE');
  assert(pkg.runtime_fixture_discovery === false, 'RUNTIME_FIXTURE_DISCOVERY_FORBIDDEN');
  assert(pkg.fixture_order.length === 5 && pkg.rows[0].fixture_ids.length === 2 && pkg.rows[1].fixture_ids.length === 3, 'FACTUAL_COUNTS_DRIFT');
  assertAtlasTarget(pkg, targetPage);
  activeRun(pkg, penpot, storage);
  write.pkg = pkg;
  write.storage = storage;
  assertNoDuplicates(pkg, targetPage);
  const eventCard = resolveDependency(pkg, dependencies, 'event_card');
  const medallion = resolveDependency(pkg, dependencies, 'medallion');
  const baselineKey = pkg.storage.protected_baseline;
  if (!storage[baselineKey]) {
    storage[baselineKey] = await protectedProjection(targetPage);
    return {terminal_state: 'PROTECTED_BASELINE_BOUND_RERUN_REQUIRED', created: 0};
  }
  const baseline = storage[baselineKey];
  assert(await protectedProjection(targetPage) === baseline, 'PROTECTED_PROJECTION_DRIFT');
  const tasks = makeTasks(pkg, penpot, targetPage, eventCard, medallion);
  let created = 0;
  for (const task of tasks.slice(0, pkg.limits.max_managed_creations_per_invocation)) {
    task();
    created++;
  }
  if (created) {
    assert(await protectedProjection(targetPage) === baseline, 'PROTECTED_PROJECTION_DRIFT');
    return {terminal_state: 'RESUME_REQUIRED', created};
  }
  return terminalReadback(pkg, penpot, targetPage, eventCard, medallion, baseline);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {runFreeRowsDataR2, canonical, sha256Text, protectedProjection};
}

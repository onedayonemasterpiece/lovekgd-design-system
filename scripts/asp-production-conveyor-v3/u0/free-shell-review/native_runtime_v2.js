'use strict';

const crypto = require('node:crypto');

const MANAGED_KEYS = [
  'package-id', 'managed-id', 'node-role', 'component-id', 'specimen-id',
  'state', 'source-bindings', 'source-head', 'source-tree', 'anatomy-role',
  'layout', 'candidate-label', 'detached', 'screenshot', 'atlas-page-order-assigned',
];

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function digest(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' ? value : canonical(value)).digest('hex');
}

function demand(condition, code) {
  if (!condition) {
    const error = new Error(code);
    error.code = code.split(':')[0];
    throw error;
  }
}

function put(node, namespace, key, value) {
  demand(typeof value === 'string', `PLUGIN_DATA_VALUE_NOT_STRING:${key}`);
  demand(node && typeof node.setSharedPluginData === 'function', `PLUGIN_DATA_TARGET_INVALID:${key}`);
  node.setSharedPluginData(namespace, key, value);
}

function get(node, namespace, key) {
  return node && typeof node.getSharedPluginData === 'function'
    ? node.getSharedPluginData(namespace, key) || ''
    : '';
}

function children(node) { return Array.from(node?.children || []); }
function walk(node) { return node ? [node, ...children(node).flatMap(walk)] : []; }

function append(parent, child) {
  demand(parent && typeof parent.appendChild === 'function', 'NATIVE_PARENT_REQUIRED');
  parent.appendChild(child);
}

function resize(node, width, height) {
  demand(Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0, 'INVALID_NATIVE_GEOMETRY');
  demand(typeof node.resize === 'function', 'NATIVE_RESIZE_REQUIRED');
  node.resize(width, height);
}

function position(node, x, y) {
  demand(Number.isFinite(x) && Number.isFinite(y), 'INVALID_NATIVE_POSITION');
  node.x = x;
  node.y = y;
}

function styleSurface(node, spec) {
  node.fills = [{ fillColor: spec.fill, fillOpacity: Number(spec.opacity || 1) }];
  node.strokes = [{ strokeColor: spec.border, strokeWidth: 1, strokeStyle: 'solid' }];
  node.borderRadius = spec.radius;
  node.clipContent = false;
}

function styleText(node, color, size = '15', weight = '500') {
  node.fontSize = size;
  node.fontWeight = weight;
  node.fills = [{ fillColor: color, fillOpacity: 1 }];
  node.growType = 'auto-width';
}

function sourceIndex(pkg) {
  return new Map(pkg.source_authority.files.map((item) => [item.role, item]));
}

function sourceBindings(component, pkg) {
  const index = sourceIndex(pkg);
  return component.source_consumers.map((role) => {
    const item = index.get(role);
    demand(item, `UNRESOLVED_SOURCE_ROLE:${component.component_id}:${role}`);
    demand(/^[0-9a-f]{40}$/.test(item.git_blob_sha1), `INVALID_SOURCE_BLOB:${role}`);
    return { role, path: item.path, git_blob_sha1: item.git_blob_sha1 };
  });
}

function assertActiveLease(lease, boundary) {
  demand(lease && lease.active === true && lease.cancelled !== true, `LEASE_NOT_ACTIVE:${boundary}`);
}

function protectedProjection(penpot, namespace, packageId) {
  const pages = Array.from(penpot.currentFile?.pages || []).filter((page) => get(page, namespace, 'package-id') !== packageId);
  const shape = (node) => ({
    id: node.id, type: node.type || '', name: node.name || '',
    x: node.x || 0, y: node.y || 0, width: node.width || 0, height: node.height || 0,
    children: children(node).map(shape),
  });
  return digest(pages.map((page) => ({ id: page.id, name: page.name, root: shape(page.root) })));
}

async function inUndo(penpot, work) {
  const begin = penpot.history?.undoBlockBegin;
  const finish = penpot.history?.undoBlockFinish;
  if (typeof begin !== 'function' || typeof finish !== 'function') return work();
  const token = begin.call(penpot.history);
  try { return await work(); } finally { finish.call(penpot.history, token); }
}

function managedPages(penpot, pkg, namespace) {
  const exactName = pkg.target.page_name;
  const pages = Array.from(penpot.currentFile.pages || []).filter((page) => (
    get(page, namespace, 'package-id') === pkg.package_id || page.name === exactName
  ));
  demand(pages.length <= 1, 'DUPLICATE_PACKAGE_PAGE');
  if (pages[0]) {
    demand(get(pages[0], namespace, 'package-id') === pkg.package_id, 'FOREIGN_EXACT_NAME_PAGE');
    demand(pages[0].name === exactName, 'PACKAGE_PAGE_NAME_DRIFT');
  }
  return pages;
}

function findManaged(root, namespace, managedId) {
  return walk(root).filter((node) => get(node, namespace, 'managed-id') === managedId);
}

function assertOneOrNone(nodes, code) {
  demand(nodes.length <= 1, code);
  return nodes[0] || null;
}

function applyManagedIdentity(node, pkg, namespace, managedId, role) {
  put(node, namespace, 'package-id', pkg.package_id);
  put(node, namespace, 'managed-id', managedId);
  put(node, namespace, 'node-role', role);
  put(node, namespace, 'candidate-label', 'CANDIDATE_BUILD_NOT_ACCEPTED');
  put(node, namespace, 'source-head', pkg.source_authority.head);
  put(node, namespace, 'source-tree', pkg.source_authority.tree);
  put(node, namespace, 'atlas-page-order-assigned', 'false');
}

function createLabeledVisual(penpot, parent, nodeSpec, namespace, componentId, index, direction, padding, gap, created) {
  const [role, kind, label, width, height, fill] = nodeSpec;
  const surface = penpot.createBoard();
  demand(surface, `NATIVE_ANATOMY_CREATE_FAILED:${componentId}:${role}`);
  surface.name = `${componentId} / ${role}`;
  resize(surface, width, height);
  styleSurface(surface, { fill, border: kind === 'circle' ? '#221A14' : '#D8CFC5', radius: kind === 'circle' ? Math.min(width, height) / 2 : kind === 'pill' ? Math.min(height / 2, 24) : 10, opacity: 1 });
  put(surface, namespace, 'anatomy-role', role);
  put(surface, namespace, 'component-id', componentId);
  put(surface, namespace, 'layout', kind);
  append(parent, surface);
  const text = penpot.createText(label || role);
  demand(text, `NATIVE_TEXT_CREATE_FAILED:${componentId}:${role}`);
  text.name = `${role} / label`;
  styleText(text, fill === '#221A14' || fill === '#6E3D9A' ? '#FFFFFF' : '#221A14', kind === 'text' ? '16' : '13', kind === 'text' ? '700' : '600');
  position(text, 10, Math.max(6, (height - 18) / 2));
  append(surface, text);
  created.count += 2;
  return surface;
}

function layOutAnatomy(items, direction, padding, gap) {
  let cursor = padding;
  for (const item of items) {
    if (direction === 'row') {
      position(item, cursor, padding);
      cursor += item.width + gap;
    } else {
      position(item, padding, cursor);
      cursor += item.height + gap;
    }
  }
}

function componentMain(componentRecord) {
  return typeof componentRecord.mainInstance === 'function' ? componentRecord.mainInstance() : componentRecord.main;
}

function componentRecords(penpot, namespace, componentId) {
  return Array.from(penpot.library?.local?.components || []).filter((record) => {
    const main = componentMain(record);
    return get(main, namespace, 'component-id') === componentId;
  });
}

async function createMaster({ penpot, root, pkg, unit, component, namespace, x, y, created }) {
  return inUndo(penpot, () => {
    const visual = component.native_visual;
    demand(visual && Array.isArray(visual.size) && Array.isArray(visual.nodes), `NATIVE_VISUAL_REQUIRED:${component.component_id}`);
    const master = penpot.createBoard();
    master.name = `U0 / ${component.component_id} / Main`;
    resize(master, visual.size[0], visual.size[1]);
    position(master, x, y);
    styleSurface(master, { fill: visual.fill, border: visual.border, radius: visual.radius, opacity: 1 });
    applyManagedIdentity(master, pkg, namespace, `master/${component.component_id}`, 'component-master');
    put(master, namespace, 'component-id', component.component_id);
    put(master, namespace, 'layout', visual.direction === 'row' ? 'native-row' : 'native-column');
    put(master, namespace, 'source-bindings', canonical(sourceBindings(component, pkg)));
    const items = visual.nodes.map((spec, index) => createLabeledVisual(
      penpot, master, spec, namespace, component.component_id, index,
      visual.direction, visual.padding, visual.gap, created,
    ));
    layOutAnatomy(items, visual.direction, visual.padding, visual.gap);
    append(root, master);
    const record = penpot.library.local.createComponent([master]);
    demand(record && typeof record.instance === 'function', `NATIVE_COMPONENT_CREATE_FAILED:${component.component_id}`);
    record.name = component.component_id;
    record.path = 'U0 / Free Shell';
    created.count += 2;
    return { master, record };
  });
}

function validateMaster(master, component, pkg, namespace) {
  demand(master.name === `U0 / ${component.component_id} / Main`, `MASTER_NAME_DRIFT:${component.component_id}`);
  demand(get(master, namespace, 'node-role') === 'component-master', `MASTER_ROLE_DRIFT:${component.component_id}`);
  demand(get(master, namespace, 'source-bindings') === canonical(sourceBindings(component, pkg)), `MASTER_SOURCE_DRIFT:${component.component_id}`);
  const roles = children(master).map((node) => get(node, namespace, 'anatomy-role')).filter(Boolean);
  demand(canonical(roles) === canonical(component.native_visual.nodes.map((node) => node[0])), `MASTER_ANATOMY_DRIFT:${component.component_id}`);
}

function applyStateStyle(instance, component, state, namespace) {
  const visual = component.native_visual;
  const stateStyle = visual.state_styles[state] || [visual.fill, visual.border, '1'];
  styleSurface(instance, { fill: stateStyle[0], border: stateStyle[1], radius: visual.radius, opacity: Number(stateStyle[2]) });
  put(instance, namespace, 'state', state);
}

async function createSpecimen({ penpot, root, pkg, unit, specimen, components, namespace, x, y, created }) {
  return inUndo(penpot, () => {
    const spec = specimen.native_composition;
    const linked = specimen.component_ids.map((componentId) => {
      const found = components.get(componentId);
      demand(found, `SPECIMEN_COMPONENT_MISSING:${specimen.specimen_id}:${componentId}`);
      return found;
    });
    const naturalHeight = spec.padding * 2 + linked.reduce((sum, item) => sum + item.component.native_visual.size[1], 0) + Math.max(0, linked.length - 1) * spec.gap + 54;
    const height = Math.max(spec.min_height, naturalHeight);
    const board = penpot.createBoard();
    board.name = `Specimen / ${specimen.specimen_id} / ${specimen.state}`;
    resize(board, spec.width, height);
    position(board, x, y);
    styleSurface(board, { fill: spec.fill, border: spec.border, radius: spec.radius, opacity: 1 });
    applyManagedIdentity(board, pkg, namespace, `specimen/${specimen.specimen_id}`, 'visible-specimen');
    put(board, namespace, 'specimen-id', specimen.specimen_id);
    put(board, namespace, 'state', specimen.state);
    put(board, namespace, 'layout', 'native-column');
    const heading = penpot.createText(`${specimen.state} · ${specimen.viewport.width}×${specimen.viewport.height}`);
    heading.name = 'Specimen state and viewport';
    styleText(heading, '#221A14', '18', '700');
    position(heading, spec.padding, spec.padding);
    append(board, heading);
    created.count += 2;
    let cursor = spec.padding + 54;
    for (const item of linked) {
      const instance = item.record.instance();
      demand(instance?.isComponentCopyInstance?.() === true, `DETACHED_INSTANCE_CREATED:${specimen.specimen_id}:${item.component.component_id}`);
      demand(instance.component?.()?.id === item.record.id, `LINKED_COMPONENT_ID_MISMATCH:${specimen.specimen_id}:${item.component.component_id}`);
      instance.name = `Linked / ${item.component.component_id} / ${specimen.state}`;
      applyManagedIdentity(instance, pkg, namespace, `instance/${specimen.specimen_id}/${item.component.component_id}`, 'linked-visible-instance');
      put(instance, namespace, 'component-id', item.component.component_id);
      put(instance, namespace, 'specimen-id', specimen.specimen_id);
      put(instance, namespace, 'detached', 'false');
      put(instance, namespace, 'screenshot', 'false');
      applyStateStyle(instance, item.component, specimen.state, namespace);
      const innerWidth = spec.width - spec.padding * 2;
      if (instance.width > innerWidth) resize(instance, innerWidth, instance.height);
      position(instance, spec.padding, cursor);
      append(board, instance);
      cursor += instance.height + spec.gap;
      created.count += 1;
    }
    append(root, board);
    return { board, height };
  });
}

function validateManagedIntegrity({ penpot, page, pkg, namespace }) {
  const nodes = walk(page.root);
  const managed = nodes.filter((node) => get(node, namespace, 'package-id') === pkg.package_id);
  const ids = managed.map((node) => get(node, namespace, 'managed-id')).filter(Boolean);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  demand(duplicates.length === 0, `DUPLICATE_MANAGED_ID:${[...new Set(duplicates)].join(',')}`);
  const linked = managed.filter((node) => get(node, namespace, 'node-role') === 'linked-visible-instance');
  const detached = linked.filter((node) => node.isComponentCopyInstance?.() !== true || !node.component?.());
  demand(detached.length === 0, `DETACHED_INSTANCE:${detached.map((node) => node.id).join(',')}`);
  const screenshots = managed.filter((node) => node.type === 'image' || get(node, namespace, 'screenshot') === 'true');
  demand(screenshots.length === 0, `SCREENSHOT_NODE:${screenshots.map((node) => node.id).join(',')}`);
  return { managed: managed.length, duplicates: 0, detached: 0, screenshots: 0, linked_instances: linked.length };
}

async function runNativePackage({ penpot, storage, lease, packageDefinition }) {
  demand(penpot?.currentFile && typeof penpot.createPage === 'function', 'PENPOT_NATIVE_RUNTIME_REQUIRED');
  demand(penpot?.library?.local && typeof penpot.library.local.createComponent === 'function', 'PENPOT_NATIVE_LIBRARY_REQUIRED');
  demand(storage && typeof storage.set === 'function', 'STORAGE_SET_REQUIRED');
  assertActiveLease(lease, 'entry');
  demand(packageDefinition.native_successor.execution_mode === 'concrete-native-page-component-master-linked-instance', 'NATIVE_SUCCESSOR_CONTRACT_REQUIRED');
  demand(packageDefinition.native_successor.atlas_page_order_assigned === false, 'ATLAS_PAGE_ORDER_FORBIDDEN');
  const namespace = packageDefinition.native_successor.plugin_data_namespace;
  const beforeProtected = protectedProjection(penpot, namespace, packageDefinition.package_id);
  const created = { count: 0 };

  let page = managedPages(penpot, packageDefinition, namespace)[0];
  if (!page) {
    assertActiveLease(lease, 'before-page');
    page = await inUndo(penpot, () => {
      const value = penpot.createPage();
      value.name = packageDefinition.target.page_name;
      put(value, namespace, 'package-id', packageDefinition.package_id);
      put(value, namespace, 'candidate-label', 'CANDIDATE_BUILD_NOT_ACCEPTED');
      put(value, namespace, 'source-head', packageDefinition.source_authority.head);
      put(value, namespace, 'source-tree', packageDefinition.source_authority.tree);
      put(value, namespace, 'atlas-page-order-assigned', 'false');
      created.count += 1;
      return value;
    });
  }
  if (penpot.currentPage?.id !== page.id && typeof penpot.openPage === 'function') await penpot.openPage(page);
  assertActiveLease(lease, 'after-open-page');

  const unit = packageDefinition.page_units[0];
  let root = assertOneOrNone(findManaged(page.root, namespace, 'root'), 'DUPLICATE_NATIVE_ROOT');
  if (!root) {
    demand(children(page.root).length === 0, 'FOREIGN_ROOT_ON_MANAGED_PAGE');
    root = await inUndo(penpot, () => {
      const value = penpot.createBoard();
      value.name = unit.root_name;
      resize(value, packageDefinition.native_successor.root.width, 1000);
      position(value, 0, 0);
      styleSurface(value, { fill: packageDefinition.native_successor.root.fill, border: '#D8CFC5', radius: 0, opacity: 1 });
      applyManagedIdentity(value, packageDefinition, namespace, 'root', 'native-review-root');
      put(value, namespace, 'layout', 'native-two-column-masters-plus-stacked-compositions');
      append(page.root, value);
      created.count += 1;
      return value;
    });
  }
  demand(root.name === unit.root_name, 'NATIVE_ROOT_NAME_DRIFT');
  demand(root.width === packageDefinition.native_successor.root.width, 'NATIVE_ROOT_WIDTH_DRIFT');

  const titleNodes = findManaged(root, namespace, 'page-title');
  let title = assertOneOrNone(titleNodes, 'DUPLICATE_PAGE_TITLE');
  if (!title) {
    title = penpot.createText('Free collection · shell states · source-bound native successor');
    title.name = 'Candidate page title';
    styleText(title, '#221A14', '28', '700');
    position(title, 64, 64);
    applyManagedIdentity(title, packageDefinition, namespace, 'page-title', 'page-title');
    append(root, title);
    created.count += 1;
  }

  const components = new Map();
  const columnY = [224, 224];
  for (let index = 0; index < unit.components.length; index += 1) {
    const component = unit.components[index];
    const masters = findManaged(root, namespace, `master/${component.component_id}`);
    let master = assertOneOrNone(masters, `DUPLICATE_MASTER:${component.component_id}`);
    const records = componentRecords(penpot, namespace, component.component_id);
    demand(records.length <= 1, `DUPLICATE_NATIVE_COMPONENT:${component.component_id}`);
    let record = records[0] || null;
    const column = index % 2;
    const x = column === 0 ? 64 : 1120;
    const y = columnY[column];
    if (!master) {
      demand(!record, `ORPHAN_NATIVE_COMPONENT:${component.component_id}`);
      const made = await createMaster({ penpot, root, pkg: packageDefinition, unit, component, namespace, x, y, created });
      master = made.master;
      record = made.record;
    } else {
      demand(record, `MASTER_WITHOUT_COMPONENT:${component.component_id}`);
      demand(componentMain(record).id === master.id, `COMPONENT_MAIN_MISMATCH:${component.component_id}`);
      validateMaster(master, component, packageDefinition, namespace);
      demand(master.x === x && master.y === y, `MASTER_POSITION_DRIFT:${component.component_id}`);
    }
    columnY[column] = y + component.native_visual.size[1] + 48;
    components.set(component.component_id, { component, master, record });
  }

  let specimenY = Math.max(...columnY) + 112;
  for (const specimen of unit.specimens) {
    const existing = findManaged(root, namespace, `specimen/${specimen.specimen_id}`);
    const board = assertOneOrNone(existing, `DUPLICATE_SPECIMEN:${specimen.specimen_id}`);
    if (!board) {
      const made = await createSpecimen({ penpot, root, pkg: packageDefinition, unit, specimen, components, namespace, x: 64, y: specimenY, created });
      specimenY += made.height + 48;
    } else {
      demand(get(board, namespace, 'state') === specimen.state, `SPECIMEN_STATE_DRIFT:${specimen.specimen_id}`);
      const linkedIds = walk(board).filter((node) => get(node, namespace, 'node-role') === 'linked-visible-instance').map((node) => get(node, namespace, 'component-id'));
      demand(canonical(linkedIds) === canonical(specimen.component_ids), `SPECIMEN_LINEAGE_DRIFT:${specimen.specimen_id}`);
      specimenY += board.height + 48;
    }
  }

  const expectedHeight = specimenY + 64;
  if (created.count > 0) resize(root, packageDefinition.native_successor.root.width, expectedHeight);
  else demand(root.height === expectedHeight, 'NATIVE_ROOT_HEIGHT_DRIFT');

  const integrity = validateManagedIntegrity({ penpot, page, pkg: packageDefinition, namespace });
  const afterProtected = protectedProjection(penpot, namespace, packageDefinition.package_id);
  demand(afterProtected === beforeProtected, 'PROTECTED_PROJECTION_CHANGED');
  assertActiveLease(lease, 'before-receipt');
  const receipt = {
    schema_version: 'kenigevents.u0-native-executor-receipt.v2',
    package_id: packageDefinition.package_id,
    successor: 'R2',
    created: created.count,
    page_id: page.id,
    root_id: root.id,
    component_masters: unit.components.length,
    visible_specimens: unit.specimens.length,
    linked_instances: integrity.linked_instances,
    duplicates: integrity.duplicates,
    detached: integrity.detached,
    screenshots: integrity.screenshots,
    protected_projection_before: beforeProtected,
    protected_projection_after: afterProtected,
    protected_projections_unchanged: true,
    shared_plugin_data_string_only: true,
    atlas_page_order_assigned: false,
    atlas_extension_status: 'ATLAS_EXTENSION_PENDING',
    penpot_execution_authorized: false,
    validation: [],
  };
  await storage.set(`receipt:${packageDefinition.package_id}:R2`, receipt);
  assertActiveLease(lease, 'after-receipt');
  return receipt;
}

module.exports = {
  MANAGED_KEYS,
  assertActiveLease,
  canonical,
  digest,
  get,
  protectedProjection,
  put,
  runNativePackage,
  sourceBindings,
  validateManagedIntegrity,
  walk,
};

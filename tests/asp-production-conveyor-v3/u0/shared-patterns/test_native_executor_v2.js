'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { run } = require('../../../../scripts/asp-production-conveyor-v3/u0/shared-patterns/native_executor_v2');
const { nativeContract, predecessor, productContract, setupNativeSuccessor, successor } = require('../../../../scripts/asp-production-conveyor-v3/u0/shared-patterns/setup_v2');
const { pluginGet, pluginProjection, protectedProjection, setSharedString, stableStringify, validateSuccessor } = require('../../../../scripts/asp-production-conveyor-v3/u0/shared-patterns/native_runtime_v2');

let sequence = 0;

class PluginDataNode {
  constructor() { this._localPluginData = new Map(); this._sharedPluginData = new Map(); }
  setPluginData(key, value) {
    if (typeof value !== 'string') throw new TypeError(`TEST_DOUBLE_PLUGIN_DATA_STRING_REQUIRED:${key}`);
    this._localPluginData.set(key, value);
  }
  getPluginData(key) { return this._localPluginData.get(key) || ''; }
  getPluginDataKeys() { return [...this._localPluginData.keys()]; }
  setSharedPluginData(namespace, key, value) {
    if (typeof value !== 'string') throw new TypeError(`TEST_DOUBLE_PLUGIN_DATA_STRING_REQUIRED:${key}`);
    this._sharedPluginData.set(`${namespace}\0${key}`, value);
  }
  getSharedPluginData(namespace, key) { return this._sharedPluginData.get(`${namespace}\0${key}`) || ''; }
  getSharedPluginDataNamespaces() { return [...new Set([...this._sharedPluginData.keys()].map((key) => key.split('\0')[0]))]; }
  getSharedPluginDataKeys(namespace) { return [...this._sharedPluginData.keys()].filter((key) => key.startsWith(`${namespace}\0`)).map((key) => key.slice(namespace.length + 1)); }
}

class Shape extends PluginDataNode {
  constructor(type = 'board', id = null) {
    super();
    this.id = id || `shape-${++sequence}`;
    this.type = type;
    this.name = '';
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;
    this.hidden = false;
    this.visible = true;
    this.fills = [];
    this.strokes = [];
    this.borderRadius = 0;
    this.clipContent = false;
    this.children = [];
    this.parent = null;
    this._component = null;
    this._isCopy = false;
    this.flex = null;
    this.grid = null;
  }
  appendChild(child) {
    if (child.parent) child.parent.children = child.parent.children.filter((item) => item !== child);
    child.parent = this;
    this.children.push(child);
  }
  resize(width, height) { this.width = width; this.height = height; }
  addFlexLayout() {
    const owner = this;
    this.grid = null;
    this.flex = { dir: 'row', wrap: 'nowrap', rowGap: 0, columnGap: 0, topPadding: 0, rightPadding: 0, bottomPadding: 0, leftPadding: 0, alignItems: 'start', justifyContent: 'start', horizontalSizing: 'fix', verticalSizing: 'fix', remove() { owner.flex = null; } };
    return this.flex;
  }
  addGridLayout() {
    const owner = this;
    this.flex = null;
    this.grid = { dir: 'row', rowGap: 0, columnGap: 0, topPadding: 0, rightPadding: 0, bottomPadding: 0, leftPadding: 0, alignItems: 'start', justifyItems: 'start', horizontalSizing: 'fix', verticalSizing: 'fix', columns: [], rows: [], addColumn(type, value) { this.columns.push({ type, value }); }, removeColumn(index) { this.columns.splice(index, 1); }, addRow(type, value = null) { this.rows.push({ type, value }); }, removeRow(index) { this.rows.splice(index, 1); }, remove() { owner.grid = null; } };
    return this.grid;
  }
  component() { return this._component; }
  isComponentCopyInstance() { return this._isCopy; }
}

function cloneShape(source) {
  const clone = new Shape(source.type);
  for (const key of ['name', 'x', 'y', 'width', 'height', 'hidden', 'visible', 'borderRadius', 'clipContent', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'growType', 'text', 'characters']) {
    if (Object.hasOwn(source, key)) clone[key] = structuredClone(source[key]);
  }
  clone.fills = structuredClone(source.fills);
  clone.strokes = structuredClone(source.strokes);
  clone._localPluginData = new Map(source._localPluginData);
  clone._sharedPluginData = new Map(source._sharedPluginData);
  if (source.flex) Object.assign(clone.addFlexLayout(), Object.fromEntries(Object.entries(source.flex).filter(([, value]) => typeof value !== 'function')));
  if (source.grid) {
    const grid = clone.addGridLayout();
    for (const [key, value] of Object.entries(source.grid)) if (typeof value !== 'function' && !['columns', 'rows'].includes(key)) grid[key] = structuredClone(value);
    grid.columns = structuredClone(source.grid.columns); grid.rows = structuredClone(source.grid.rows);
  }
  for (const child of source.children) clone.appendChild(cloneShape(child));
  return clone;
}

class LocalComponent extends PluginDataNode {
  constructor(main) {
    super();
    this.id = `component-${++sequence}`;
    this.name = '';
    this.path = '';
    this._main = main;
    main._component = this;
  }
  mainInstance() { return this._main; }
  instance() {
    const instance = cloneShape(this._main);
    instance._component = this;
    instance._isCopy = true;
    return instance;
  }
}

class LocalLibrary {
  constructor() { this.components = []; }
  createComponent(shapes) {
    assert.equal(Array.isArray(shapes), true);
    assert.equal(shapes.length, 1);
    const component = new LocalComponent(shapes[0]);
    this.components.push(component);
    return component;
  }
}

class Page extends PluginDataNode {
  constructor(id = null) {
    super();
    this.id = id || `page-${++sequence}`;
    this.name = '';
    this.root = new Shape('root', `${this.id}-root`);
  }
}

class CurrentFile extends PluginDataNode {
  constructor(id) {
    super();
    this.id = id;
    this.pages = [];
  }
  validate() { return []; }
}

class NativeLikePenpot {
  constructor() {
    this.currentFile = new CurrentFile(successor.target.file_id);
    this.currentPage = null;
    this.library = { local: new LocalLibrary() };
    this.history = {
      undoBlockBegin: () => ({ id: `undo-${++sequence}` }),
      undoBlockFinish: (token) => assert.match(token.id, /^undo-/),
    };
    const protectedPage = new Page('protected-page');
    protectedPage.name = 'Protected owner projection';
    const protectedRoot = new Shape('board', 'protected-root');
    protectedRoot.name = 'Protected exact root';
    protectedRoot.resize(640, 480);
    protectedPage.root.appendChild(protectedRoot);
    this.currentFile.pages.push(protectedPage);
  }
  createPage() {
    const page = new Page();
    this.currentFile.pages.push(page);
    this.currentPage = page;
    return page;
  }
  createBoard() { return new Shape('board'); }
  createRectangle() { return new Shape('rect'); }
  createText(value) {
    assert.equal(typeof value, 'string');
    const text = new Shape('text');
    text.text = value;
    text.characters = value;
    return text;
  }
  async openPage(page) { this.currentPage = page; }
}

class MemoryStorage {
  constructor() { this.values = new Map(); }
  async set(key, value) { this.values.set(key, structuredClone(value)); }
  get(key) { return this.values.get(key); }
}

function environment() {
  sequence = 0;
  return { penpot: new NativeLikePenpot(), storage: new MemoryStorage(), lease: { active: true, cancelled: false, native_like: true, lease_id: 'native-like-run' } };
}

function snapshot(penpot) {
  const layout = (value) => value ? Object.fromEntries(Object.entries(value).filter(([, item]) => typeof item !== 'function')) : null;
  const node = (shape) => ({
    id: shape.id, type: shape.type, name: shape.name, x: shape.x, y: shape.y, width: shape.width, height: shape.height,
    hidden: shape.hidden, visible: shape.visible, fills: shape.fills, strokes: shape.strokes, characters: shape.characters,
    opacity: shape.opacity, borderRadius: shape.borderRadius, clipContent: shape.clipContent,
    flex: layout(shape.flex), grid: layout(shape.grid),
    plugin_data: pluginProjection(shape), component_id: shape.component?.()?.id || null,
    is_copy: shape.isComponentCopyInstance?.() || false, children: shape.children.map(node),
  });
  return stableStringify({
    pages: penpot.currentFile.pages.map((page) => ({ id: page.id, name: page.name, plugin_data: pluginProjection(page), root: node(page.root) })),
    components: penpot.library.local.components.map((component) => ({ id: component.id, name: component.name, path: component.path, main_id: component.mainInstance().id })),
  });
}

function managedRoot(penpot, unitId) {
  const namespace = successor.execution.namespace;
  const page = penpot.currentFile.pages.find((candidate) => pluginGet(candidate, namespace, 'unit-id') === unitId);
  return page.root.children.find((candidate) => pluginGet(candidate, namespace, 'stable-id') === `root/${unitId}`);
}

test('successor freezes six existing units, seven components, exact 21 source-bound specimens, and direct style-owner tuples', () => {
  assert.deepEqual(validateSuccessor(successor, predecessor, productContract, nativeContract), []);
  assert.equal(successor.page_units.length, 6);
  assert.equal(Object.keys(nativeContract.components).length, 7);
  assert.equal(Object.keys(nativeContract.specimens).length, 21);
  assert.equal(nativeContract.authority.style_owner.git_blob_sha1, '4d54d3c59f8f1a4e844953edf8d9c86078ccb8c1');
  const exactOwners = {
    'U-PATTERN-LISTING-DISCOVERY-RAIL': ['ListingDiscoveryRail', 'ListingControls'],
    'U-PATTERN-LISTING-FILTER-BAR': ['ListingDiscoveryRail', 'ListingControls'],
    'U-PATTERN-LISTING-SECTION-HEADER': ['ListingPageHeader'],
    'U-PATTERN-AUTHORIZED-SEARCH-BAR': ['AuthorizedEventSearch', 'EventLayout'],
    'U-PATTERN-CONTENT-SHELF': ['FreeCollectionSurface', 'FestivalTimelinePage'],
    'U-PATTERN-CONTENT-GROUPING': ['FreeCollectionSurface', 'FestivalTimelinePage'],
    'U-PATTERN-ROW-GROUP-COMPOSITION': ['FreeCollectionSurface', 'FestivalTimelinePage'],
  };
  for (const [componentId, component] of Object.entries(nativeContract.components)) {
    assert.deepEqual(successor.component_source_lineage[componentId].map((entry) => entry.role), component.source_consumers);
    assert.deepEqual(component.anatomy_nodes.map((node) => node.key), component.anatomy);
    assert.ok(component.anatomy_nodes.every((node) => node.text !== undefined && node.width > 0 && node.height > 0));
    assert.deepEqual(component.source_style_authority.direct_owner_tuples.map((entry) => entry.role), exactOwners[componentId]);
    assert.ok(component.anatomy_nodes.filter((node) => node.kind !== 'text').every((node) => node.children.length > 0 && node.children.every((child) => ['chip', 'card', 'input', 'action', 'progress-track', 'content-group'].includes(child.role))));
  }
  assert.equal(successor.status, 'ATLAS_EXTENSION_PENDING');
  assert.equal(successor.authorization.penpot_execution_authorized, false);
  assert.equal(successor.authorization.publish_authorized, false);
  assert.equal(successor.authorization.real_penpot_execution_authorized, false);
  assert.equal(successor.execution.real_penpot_gates.o0_atlas_extension_binding.state, 'PENDING');
  assert.equal(successor.execution.real_penpot_gates.action_nav_v0_closure.state, 'PENDING');
  assert.equal(successor.boundaries.atlas_page_order_assigned, false);
});

test('strict shared-plugin-data rejects non-strings in runtime and native-like double without coercion', () => {
  const node = new PluginDataNode();
  assert.throws(() => node.setSharedPluginData('namespace', 'key', { invalid: true }), /TEST_DOUBLE_PLUGIN_DATA_STRING_REQUIRED/);
  assert.throws(() => setSharedString(node, 'namespace', 'key', 42), /PLUGIN_DATA_STRING_REQUIRED/);
  setSharedString(node, 'namespace', 'key', '42');
  assert.equal(node.getSharedPluginData('namespace', 'key'), '42');
  const runtime = fs.readFileSync(path.resolve(__dirname, '../../../../scripts/asp-production-conveyor-v3/u0/shared-patterns/native_runtime_v2.js'), 'utf8');
  assert.equal(runtime.includes('penpot.ensure'), false);
  assert.equal(/\bString\(/.test(runtime), false);
});

test('complete local and shared plugin-data enumeration is mandatory before the first native write', async () => {
  const env = environment();
  env.penpot.currentFile.setPluginData('foreign-local', 'local-value');
  env.penpot.currentFile.setSharedPluginData('foreign-namespace', 'foreign-key', 'shared-value');
  assert.deepEqual(pluginProjection(env.penpot.currentFile), {
    local: [['foreign-local', 'local-value']],
    shared: [['foreign-namespace', 'foreign-key', 'shared-value']],
  });

  const missingLocalEnumeration = environment();
  missingLocalEnumeration.penpot.currentFile.getPluginDataKeys = undefined;
  await assert.rejects(() => run(missingLocalEnumeration), /PLUGIN_DATA_KEY_ENUMERATION_REQUIRED/);
  assert.equal(missingLocalEnumeration.penpot.currentFile.pages.length, 1);
  assert.equal(missingLocalEnumeration.penpot.library.local.components.length, 0);

  const missingSharedEnumeration = environment();
  missingSharedEnumeration.penpot.currentFile.getSharedPluginDataNamespaces = undefined;
  await assert.rejects(() => run(missingSharedEnumeration), /SHARED_PLUGIN_NAMESPACE_ENUMERATION_REQUIRED/);
  assert.equal(missingSharedEnumeration.penpot.currentFile.pages.length, 1);
  assert.equal(missingSharedEnumeration.penpot.library.local.components.length, 0);
});

test('two actual native-like executor runs create concrete masters and linked visible specimens once', async () => {
  const env = environment();
  const protectedBefore = protectedProjection(env.penpot, successor.execution.namespace, successor.package_id);
  const registration = await setupNativeSuccessor(env);
  assert.equal(registration.penpot_execution_authorized, false);
  const first = await run(env);
  const afterFirst = snapshot(env.penpot);
  const second = await run(env);
  const afterSecond = snapshot(env.penpot);

  assert.equal(first.created, 201);
  assert.equal(second.created, 0);
  assert.equal(second.second_run_created, 0);
  assert.equal(afterSecond, afterFirst);
  assert.deepEqual(first.counts, { pages: 6, roots: 6, component_masters: 7, linked_visible_specimens: 21, duplicates: 0, detached: 0, screenshots: 0 });
  assert.deepEqual(second.counts, first.counts);
  assert.deepEqual(second.validation, []);
  assert.deepEqual(first.protected_projection_before, protectedBefore);
  assert.deepEqual(first.protected_projection_after, protectedBefore);
  assert.equal(first.atlas_page_order_assigned, false);
  assert.equal(first.penpot_authorization, false);
  assert.equal(first.publish_authorization, false);

  for (const unit of successor.page_units) {
    const root = managedRoot(env.penpot, unit.unit_id);
    assert.ok(root);
    for (const specimenId of unit.specimen_ids) {
      const wrapper = root.children.find((shape) => pluginGet(shape, successor.execution.namespace, 'stable-id') === `specimen/${specimenId}`);
      assert.ok(wrapper);
      const instance = wrapper.children.find((shape) => pluginGet(shape, successor.execution.namespace, 'stable-id') === `instance/${specimenId}`);
      assert.ok(instance.isComponentCopyInstance());
      assert.ok(instance.component());
      assert.ok(instance.children.some((shape) => shape.visible && !shape.hidden));
      assert.equal(pluginGet(instance, successor.execution.namespace, 'source-lineage'), pluginGet(wrapper, successor.execution.namespace, 'source-lineage'));
      for (const [key, label] of Object.entries(nativeContract.specimens[specimenId].label_overrides)) {
        const anatomy = instance.children.find((shape) => pluginGet(shape, successor.execution.namespace, 'anatomy-key') === key);
        const texts = anatomy.type === 'text' ? [anatomy] : anatomy.children.flatMap((item) => item.children.filter((shape) => shape.type === 'text'));
        const actual = anatomy.type === 'text' ? texts[0].characters : texts.map((text) => text.characters).filter(Boolean).join(' · ');
        const expected = anatomy.type === 'text' ? label : label.replace(/\s{3,}/gu, ' · ');
        assert.equal(actual, expected);
      }
      assert.ok(instance.flex || instance.grid, 'native layout object required');
    }
  }
  const findInstance = (specimenId) => {
    const unit = successor.page_units.find((candidate) => candidate.specimen_ids.includes(specimenId));
    const wrapper = managedRoot(env.penpot, unit.unit_id).children.find((shape) => pluginGet(shape, successor.execution.namespace, 'stable-id') === `specimen/${specimenId}`);
    return wrapper.children.find((shape) => pluginGet(shape, successor.execution.namespace, 'stable-id') === `instance/${specimenId}`);
  };
  const nestedTexts = (shape) => [shape, ...shape.children.flatMap(nestedTexts)].filter((node) => node.type === 'text');
  for (const [specimenId, anatomyKey] of [['u-pattern-search-control-bars-filter-subset', 'city-chips'], ['u-pattern-section-headers-today', 'related-route-navigation']]) {
    const anatomy = findInstance(specimenId).children.find((shape) => pluginGet(shape, successor.execution.namespace, 'anatomy-key') === anatomyKey);
    assert.ok(nestedTexts(anatomy).every((text) => text.fills[0].fillColor === '#FFFFFF'));
  }
  const railRoot = managedRoot(env.penpot, 'U-PATTERN-RAILS');
  const railMaster = railRoot.children.find((shape) => pluginGet(shape, successor.execution.namespace, 'stable-id') === 'master/U-PATTERN-LISTING-DISCOVERY-RAIL');
  const pinnedControls = railMaster.children.find((shape) => pluginGet(shape, successor.execution.namespace, 'anatomy-key') === 'listing-controls');
  assert.equal(pluginGet(railMaster, successor.execution.namespace, 'pinned'), 'true');
  assert.ok(nestedTexts(pinnedControls).every((text) => text.fills[0].fillColor === '#793014'));
});

test('duplicate, detached, screenshot, source-lineage and protected-projection failures fail closed', async () => {
  const duplicate = environment();
  const firstPage = duplicate.penpot.createPage();
  firstPage.name = successor.page_units[0].page_name;
  const secondPage = duplicate.penpot.createPage();
  secondPage.name = successor.page_units[0].page_name;
  await assert.rejects(() => run(duplicate), /DUPLICATE_PAGE/);

  const detached = environment();
  await run(detached);
  const detachedRoot = managedRoot(detached.penpot, successor.page_units[0].unit_id);
  const specimenWrapper = detachedRoot.children.find((shape) => pluginGet(shape, successor.execution.namespace, 'stable-id').startsWith('specimen/'));
  specimenWrapper.children.find((shape) => shape.isComponentCopyInstance())._component = null;
  await assert.rejects(() => run(detached), /DETACHED_INSTANCE/);

  const screenshot = environment();
  await run(screenshot);
  managedRoot(screenshot.penpot, successor.page_units[0].unit_id).appendChild(new Shape('image'));
  await assert.rejects(() => run(screenshot), /SCREENSHOT_IMPLEMENTATION/);

  const lineage = environment();
  await run(lineage);
  const componentId = successor.page_units[0].component_ids[0];
  const master = managedRoot(lineage.penpot, successor.page_units[0].unit_id).children.find((shape) => pluginGet(shape, successor.execution.namespace, 'stable-id') === `master/${componentId}`);
  setSharedString(master, successor.execution.namespace, 'source-lineage', '[]');
  await assert.rejects(() => run(lineage), /MASTER_SOURCE_LINEAGE/);

  class DriftingPenpot extends NativeLikePenpot {
    createPage() {
      const page = super.createPage();
      this.currentFile.pages[0].root.children[0].name = `drift-${this.currentFile.pages.length}`;
      return page;
    }
  }
  const protectedEnv = { penpot: new DriftingPenpot(), storage: new MemoryStorage(), lease: { active: true, cancelled: false, native_like: true } };
  await assert.rejects(() => run(protectedEnv), /PROTECTED_PROJECTION_DRIFT/);
});

test('replay fails closed on old false-PASS anatomy geometry, style, text, plugin, layout, and component-library corruption', async () => {
  async function corrupted(mutator, pattern) {
    const env = environment();
    await run(env);
    const unit = successor.page_units[0];
    const root = managedRoot(env.penpot, unit.unit_id);
    const wrapper = root.children.find((shape) => pluginGet(shape, successor.execution.namespace, 'stable-id').startsWith('specimen/'));
    const instance = wrapper.children.find((shape) => shape.isComponentCopyInstance());
    const anatomy = instance.children.find((shape) => pluginGet(shape, successor.execution.namespace, 'anatomy-key') && shape.visible !== false && shape.hidden !== true);
    const hidden = instance.children.find((shape) => pluginGet(shape, successor.execution.namespace, 'anatomy-key') && (shape.visible === false || shape.hidden === true));
    const hiddenBoard = instance.children.find((shape) => shape.type === 'board' && pluginGet(shape, successor.execution.namespace, 'anatomy-key') && (shape.visible === false || shape.hidden === true));
    mutator({ env, root, wrapper, instance, anatomy, hidden, hiddenBoard });
    await assert.rejects(() => run(env), pattern);
  }
  await corrupted(({ anatomy }) => { anatomy.x += 1; }, /SPECIMEN_ANATOMY_GEOMETRY/);
  await corrupted(({ anatomy }) => { anatomy.opacity = 0.314; }, /SPECIMEN_ANATOMY_OPACITY/);
  await corrupted(({ anatomy }) => { anatomy.fills = [{ fillColor: '#010203', fillOpacity: 1 }]; }, /SPECIMEN_ANATOMY_SURFACE/);
  await corrupted(({ anatomy }) => { const text = anatomy.type === 'text' ? anatomy : anatomy.children[0].children.find((child) => child.type === 'text'); text.characters = 'PLACEHOLDER'; }, /SPECIMEN_ANATOMY_TEXT/);
  await corrupted(({ hidden }) => { hidden.fills = [{ fillColor: '#010203', fillOpacity: 1 }]; }, /SPECIMEN_ANATOMY_(SURFACE|TEXT_COLOR)|MANAGED_PROJECTION_DRIFT/);
  await corrupted(({ hiddenBoard }) => { hiddenBoard.fills = [{ fillColor: '#010203', fillOpacity: 1 }]; }, /SPECIMEN_ANATOMY_SURFACE/);
  await corrupted(({ hidden }) => { const text = hidden.type === 'text' ? hidden : hidden.children[0].children.find((child) => child.type === 'text'); text.characters = 'HIDDEN PLACEHOLDER'; }, /SPECIMEN_ANATOMY_TEXT/);
  await corrupted(({ wrapper }) => { wrapper.fills = [{ fillColor: '#010203', fillOpacity: 1 }]; }, /SPECIMEN_WRAPPER.*SURFACE/);
  await corrupted(({ anatomy }) => { anatomy._sharedPluginData.delete(`${successor.execution.namespace}\0anatomy-key`); }, /SPECIMEN_ANATOMY_CENSUS/);
  await corrupted(({ instance }) => { (instance.flex || instance.grid).dir = 'corrupt'; }, /LAYOUT_DIRECTION/);
  await corrupted(({ anatomy }) => { anatomy.setSharedPluginData(successor.execution.namespace, 'unexpected-extra', 'corrupt'); }, /MANAGED_PROJECTION_DRIFT/);
  await corrupted(({ instance }) => { const nested = new Shape('board'); nested._isCopy = true; nested._component = null; instance.appendChild(nested); }, /DETACHED_NESTED_INSTANCE/);
  await corrupted(({ env }) => { env.penpot.library.local.components[0].path = 'Wrong'; }, /COMPONENT_LIBRARY_IDENTITY/);

  const protectedEnv = environment();
  const foreign = protectedEnv.penpot.library.local.createComponent([protectedEnv.penpot.currentFile.pages[0].root.children[0]]);
  foreign.name = 'Foreign'; foreign.path = 'Protected';
  await run(protectedEnv);
  foreign.path = 'Corrupted';
  await assert.rejects(() => run(protectedEnv), /PROTECTED_PROJECTION_DRIFT/);
});

test('active lease cannot bypass pending O0 extension and ActionNav/V0 gates', async () => {
  const env = environment();
  env.lease.native_like = false;
  const before = snapshot(env.penpot);
  await assert.rejects(() => run(env), /REAL_PENPOT_EXECUTION_GATED/);
  assert.equal(snapshot(env.penpot), before);
});

test('inactive lease fails before any native creation', async () => {
  const env = environment();
  env.lease = { active: false, cancelled: true, lease_id: 'cancelled' };
  const before = snapshot(env.penpot);
  await assert.rejects(() => run(env), /LEASE_NOT_ACTIVE/);
  assert.equal(snapshot(env.penpot), before);
});

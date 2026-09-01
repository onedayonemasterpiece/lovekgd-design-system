'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const { packageDefinition, setupPackage } = require('../../../../scripts/asp-production-conveyor-v3/u0/free-shell-review/setup_v2');
const { canonical, get, put, walk } = require('../../../../scripts/asp-production-conveyor-v3/u0/free-shell-review/native_runtime_v2');
const { run } = require('../../../../scripts/asp-production-conveyor-v3/u0/free-shell-review/native_executor_v2');

let nextId = 0;
class PluginDataNode {
  constructor() { this.pluginData = new Map(); }
  setSharedPluginData(namespace, key, value) {
    if (typeof value !== 'string') throw new TypeError(`PLUGIN_DATA_VALUE_NOT_STRING:${key}`);
    this.pluginData.set(`${namespace}:${key}`, value);
  }
  getSharedPluginData(namespace, key) { return this.pluginData.get(`${namespace}:${key}`) || ''; }
}

class Shape extends PluginDataNode {
  constructor(type = 'board', fixedId = null) {
    super();
    this.id = fixedId || `shape-${++nextId}`;
    this.type = type;
    this.name = '';
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;
    this.children = [];
    this.fills = [];
    this.strokes = [];
    this.borderRadius = 0;
    this.clipContent = false;
    this.parent = null;
    this._component = null;
    this._copy = false;
  }
  appendChild(child) {
    if (child.parent) child.parent.children = child.parent.children.filter((item) => item !== child);
    child.parent = this;
    this.children.push(child);
  }
  resize(width, height) { this.width = width; this.height = height; }
  component() { return this._component; }
  isComponentCopyInstance() { return this._copy; }
}

function cloneShape(source) {
  const clone = new Shape(source.type);
  clone.name = source.name;
  clone.x = source.x;
  clone.y = source.y;
  clone.width = source.width;
  clone.height = source.height;
  clone.fills = structuredClone(source.fills);
  clone.strokes = structuredClone(source.strokes);
  clone.borderRadius = source.borderRadius;
  clone.clipContent = source.clipContent;
  clone.fontSize = source.fontSize;
  clone.fontWeight = source.fontWeight;
  clone.growType = source.growType;
  clone.characters = source.characters;
  clone.pluginData = new Map(source.pluginData);
  for (const child of source.children) clone.appendChild(cloneShape(child));
  return clone;
}

class Component {
  constructor(main) {
    this.id = `component-${++nextId}`;
    this.name = '';
    this.path = '';
    this.main = main;
    main._component = this;
  }
  mainInstance() { return this.main; }
  instance() {
    const copy = cloneShape(this.main);
    copy._component = this;
    copy._copy = true;
    return copy;
  }
}

class Page extends PluginDataNode {
  constructor(fixedId = null) {
    super();
    this.id = fixedId || `page-${++nextId}`;
    this.name = '';
    this.root = new Shape('root', `${this.id}-root`);
  }
}

class File extends PluginDataNode {
  constructor() { super(); this.id = packageDefinition.target.file_id; this.pages = []; }
  validate() { return []; }
}

class StrictNativePenpotDouble {
  constructor() {
    this.currentFile = new File();
    this.currentPage = null;
    this.created = 0;
    this.pageCreates = 0;
    this.boardCreates = 0;
    this.textCreates = 0;
    this.finishedUndoTokens = [];
    this.history = {
      undoBlockBegin: () => Symbol('native-write'),
      undoBlockFinish: (token) => {
        assert.equal(typeof token, 'symbol');
        this.finishedUndoTokens.push(token);
      },
    };
    this.library = { local: { components: [] } };
    this.library.local.createComponent = (mains) => {
      assert.equal(mains.length, 1);
      const component = new Component(mains[0]);
      this.library.local.components.push(component);
      this.created += 1;
      return component;
    };
  }
  createPage() {
    const page = new Page();
    this.currentFile.pages.push(page);
    this.pageCreates += 1;
    this.created += 1;
    return page;
  }
  createBoard() { this.boardCreates += 1; this.created += 1; return new Shape('board'); }
  createText(characters) {
    const textShape = new Shape('text');
    textShape.characters = characters;
    this.textCreates += 1;
    this.created += 1;
    return textShape;
  }
  async openPage(page) { this.currentPage = page; }
}

class MemoryStorage {
  constructor() { this.values = new Map(); }
  async set(key, value) { this.values.set(key, structuredClone(value)); }
  get(key) { return this.values.get(key); }
}

function projection(penpot) {
  const node = (shape) => ({
    id: shape.id, type: shape.type, name: shape.name,
    x: shape.x, y: shape.y, width: shape.width, height: shape.height,
    fills: shape.fills, strokes: shape.strokes, radius: shape.borderRadius,
    data: [...shape.pluginData].sort(), children: shape.children.map(node),
  });
  return canonical({
    pages: penpot.currentFile.pages.map((page) => ({ id: page.id, name: page.name, data: [...page.pluginData].sort(), root: node(page.root) })),
    components: penpot.library.local.components.map((component) => ({ id: component.id, name: component.name, path: component.path, main: component.main.id })),
  });
}

function environment() {
  nextId = 0;
  const penpot = new StrictNativePenpotDouble();
  const protectedPage = new Page('protected-page');
  protectedPage.name = 'Protected / Atlas and existing product projections';
  const sentinel = new Shape('board', 'protected-root');
  sentinel.name = 'DO NOT MUTATE';
  sentinel.resize(777, 333);
  protectedPage.root.appendChild(sentinel);
  penpot.currentFile.pages.push(protectedPage);
  return {
    penpot,
    storage: new MemoryStorage(),
    lease: { active: true, cancelled: false, lease_id: 'native-like-run' },
    protectedPage,
  };
}

function managedPage(env) {
  const ns = packageDefinition.native_successor.plugin_data_namespace;
  return env.penpot.currentFile.pages.find((page) => get(page, ns, 'package-id') === packageDefinition.package_id);
}

function managedRoot(env) {
  const ns = packageDefinition.native_successor.plugin_data_namespace;
  return walk(managedPage(env).root).find((node) => get(node, ns, 'managed-id') === 'root');
}

test('R2 successor freezes corrected dependencies and CollectionCatalog source identity', () => {
  assert.equal(packageDefinition.schema_version, 'kenigevents.u0-review-page-package.v2');
  assert.equal(packageDefinition.dependencies.brandbook.tree, '29ad3ccf0628e448d0881007129981b9f766856f');
  assert.equal(packageDefinition.dependencies.medallions.tree, '95ab14cbd64697910c871ccb1a7ca7428cf618bd');
  const catalog = packageDefinition.source_authority.files.find((item) => item.role === 'CollectionCatalog');
  assert.deepEqual(catalog, {
    role: 'CollectionCatalog',
    path: 'site/src/pages/podborki/index.astro',
    git_blob_sha1: '1a3dc3e2fb6d1df644625d2f2578b3042b3406bb',
  });
  const breadcrumbs = packageDefinition.page_units[0].components.find((item) => item.component_id === 'U-SHELL-BREADCRUMBS');
  assert.ok(breadcrumbs.source_consumers.includes('CollectionCatalog'));
  assert.equal(packageDefinition.native_successor.atlas_page_order_assigned, false);
});

test('plugin-data double and runtime reject every non-string value without coercion', () => {
  const node = new Shape();
  assert.throws(() => node.setSharedPluginData('n', 'number', 7), /PLUGIN_DATA_VALUE_NOT_STRING/);
  assert.throws(() => node.setSharedPluginData('n', 'object', { value: 7 }), /PLUGIN_DATA_VALUE_NOT_STRING/);
  assert.throws(() => put(node, 'n', 'boolean', false), /PLUGIN_DATA_VALUE_NOT_STRING/);
});

test('setup is deterministic and does not authorize Penpot or Atlas ordering', async () => {
  const storage = new MemoryStorage();
  const lease = { active: true, cancelled: false };
  const first = await setupPackage({ storage, lease });
  const second = await setupPackage({ storage, lease });
  assert.deepEqual(first, second);
  assert.equal(first.penpot_execution_authorized, false);
  assert.equal(first.atlas_page_order_assigned, false);
});

test('two actual native-like runs create concrete masters/linked specimens once and replay with created=0', async () => {
  const env = environment();
  const protectedBefore = projection({ ...env.penpot, currentFile: { pages: [env.protectedPage] }, library: { local: { components: [] } } });
  const first = await run(env);
  const firstProjection = projection(env.penpot);
  const second = await run(env);
  const secondProjection = projection(env.penpot);
  const protectedAfter = projection({ ...env.penpot, currentFile: { pages: [env.protectedPage] }, library: { local: { components: [] } } });

  assert.ok(first.created > 0);
  assert.equal(second.created, 0);
  assert.equal(secondProjection, firstProjection);
  assert.equal(protectedAfter, protectedBefore);
  assert.equal(second.duplicates, 0);
  assert.equal(second.detached, 0);
  assert.equal(second.screenshots, 0);
  assert.equal(second.protected_projections_unchanged, true);
  assert.equal(second.atlas_page_order_assigned, false);
  assert.equal(second.atlas_extension_status, 'ATLAS_EXTENSION_PENDING');

  const ns = packageDefinition.native_successor.plugin_data_namespace;
  const root = managedRoot(env);
  assert.equal(root.width, 2176);
  const masters = walk(root).filter((node) => get(node, ns, 'node-role') === 'component-master');
  const specimens = walk(root).filter((node) => get(node, ns, 'node-role') === 'visible-specimen');
  const instances = walk(root).filter((node) => get(node, ns, 'node-role') === 'linked-visible-instance');
  assert.equal(masters.length, 7);
  assert.equal(specimens.length, 6);
  assert.equal(instances.length, packageDefinition.page_units[0].specimens.reduce((sum, specimen) => sum + specimen.component_ids.length, 0));
  assert.ok(masters.every((master) => JSON.parse(get(master, ns, 'source-bindings')).every((binding) => /^[0-9a-f]{40}$/.test(binding.git_blob_sha1))));
  assert.ok(masters.every((master) => master.children.length > 0 && master.children.every((child) => get(child, ns, 'anatomy-role'))));
  assert.ok(instances.every((instance) => instance.isComponentCopyInstance() && instance.component()));
  assert.ok(env.penpot.boardCreates > 0 && env.penpot.textCreates > 0);
});

test('duplicate, detached, and screenshot corruption fail closed on replay', async () => {
  {
    const env = environment();
    await run(env);
    const ns = packageDefinition.native_successor.plugin_data_namespace;
    const duplicate = new Shape('board');
    put(duplicate, ns, 'package-id', packageDefinition.package_id);
    put(duplicate, ns, 'managed-id', 'master/U-SHELL-HEADER-DESKTOP');
    managedRoot(env).appendChild(duplicate);
    const before = env.penpot.created;
    await assert.rejects(() => run(env), /DUPLICATE_MASTER/);
    assert.equal(env.penpot.created, before);
  }
  {
    const env = environment();
    await run(env);
    const ns = packageDefinition.native_successor.plugin_data_namespace;
    const instance = walk(managedRoot(env)).find((node) => get(node, ns, 'node-role') === 'linked-visible-instance');
    instance._copy = false;
    await assert.rejects(() => run(env), /DETACHED_INSTANCE/);
  }
  {
    const env = environment();
    await run(env);
    const ns = packageDefinition.native_successor.plugin_data_namespace;
    const specimen = walk(managedRoot(env)).find((node) => get(node, ns, 'node-role') === 'visible-specimen');
    const image = new Shape('image');
    put(image, ns, 'package-id', packageDefinition.package_id);
    put(image, ns, 'managed-id', 'forbidden/screenshot');
    put(image, ns, 'screenshot', 'true');
    specimen.appendChild(image);
    await assert.rejects(() => run(env), /SCREENSHOT_NODE/);
  }
});

test('foreign exact-name page and cancelled lease fail before native creation', async () => {
  const foreign = environment();
  const page = new Page();
  page.name = packageDefinition.target.page_name;
  foreign.penpot.currentFile.pages.push(page);
  await assert.rejects(() => run(foreign), /FOREIGN_EXACT_NAME_PAGE/);
  assert.equal(foreign.penpot.created, 0);

  const cancelled = environment();
  cancelled.lease = { active: false, cancelled: true };
  await assert.rejects(() => run(cancelled), /LEASE_NOT_ACTIVE/);
  assert.equal(cancelled.penpot.created, 0);
});

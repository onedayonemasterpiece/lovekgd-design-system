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

function commonLayout(owner) {
  return {
    alignItems: 'start', alignContent: 'start', justifyItems: 'start', justifyContent: 'start',
    rowGap: 0, columnGap: 0, topPadding: 0, rightPadding: 0, bottomPadding: 0, leftPadding: 0,
    horizontalSizing: 'fix', verticalSizing: 'fix',
    remove() { if (owner.flex === this) owner.flex = undefined; if (owner.grid === this) owner.grid = undefined; },
  };
}

function addFlexObject(owner) {
  const layout = Object.assign(commonLayout(owner), { dir: 'row', wrap: 'nowrap', appendChild: (child) => owner.appendChild(child) });
  owner.flex = layout;
  return layout;
}

function addGridObject(owner) {
  const layout = Object.assign(commonLayout(owner), {
    dir: 'row', rows: [], columns: [],
    addRow(type, value) { this.rows.push({ type, value: value ?? null }); },
    addColumn(type, value) { this.columns.push({ type, value: value ?? null }); },
    removeRow(index) { this.rows.splice(index, 1); }, removeColumn(index) { this.columns.splice(index, 1); },
    appendChild(child, row, column) { owner.appendChild(child); child.layoutCell = { row, column }; },
  });
  owner.grid = layout;
  return layout;
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
    this.opacity = 1;
    this.hidden = false;
    this.visible = true;
    this.layout = '';
    this.layoutFlexDir = '';
    this.layoutGap = null;
    this.layoutPadding = null;
    this.layoutWrap = null;
    this.layoutGridColumns = '';
    this.layoutGridRows = '';
    this.flex = undefined;
    this.grid = undefined;
    this.shadows = [];
    this.blur = null;
    this.backgroundBlur = null;
    this.blendMode = 'normal';
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
  addFlexLayout() { assert.equal(this.grid, undefined); return this.flex || addFlexObject(this); }
  addGridLayout() { assert.equal(this.flex, undefined); return this.grid || addGridObject(this); }
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
  clone.opacity = source.opacity;
  clone.hidden = source.hidden;
  clone.visible = source.visible;
  clone.layout = source.layout;
  clone.layoutFlexDir = source.layoutFlexDir;
  clone.layoutGap = source.layoutGap;
  clone.layoutPadding = source.layoutPadding;
  clone.layoutWrap = source.layoutWrap;
  clone.layoutGridColumns = source.layoutGridColumns;
  clone.layoutGridRows = source.layoutGridRows;
  clone.shadows = structuredClone(source.shadows);
  clone.blur = structuredClone(source.blur);
  clone.backgroundBlur = structuredClone(source.backgroundBlur);
  clone.blendMode = source.blendMode;
  clone.fontSize = source.fontSize;
  clone.fontWeight = source.fontWeight;
  clone.growType = source.growType;
  clone.characters = source.characters;
  clone.pluginData = new Map(source.pluginData);
  for (const child of source.children) clone.appendChild(cloneShape(child));
  if (source.flex) Object.assign(addFlexObject(clone), structuredClone(Object.fromEntries(Object.entries(source.flex).filter(([, value]) => typeof value !== 'function'))));
  if (source.grid) Object.assign(addGridObject(clone), structuredClone(Object.fromEntries(Object.entries(source.grid).filter(([, value]) => typeof value !== 'function'))));
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
    this.svgCreates = 0;
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
  createShapeFromSvg(svg) {
    assert.equal(typeof svg, 'string');
    assert.match(svg, /^<svg/);
    const shape = new Shape('path');
    shape.svg = svg;
    this.svgCreates += 1;
    this.created += 1;
    return shape;
  }
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
    fills: shape.fills, strokes: shape.strokes, radius: shape.borderRadius, svg: shape.svg || '',
    opacity: shape.opacity, hidden: shape.hidden, visible: shape.visible,
    shadows: shape.shadows, blur: shape.blur, backgroundBlur: shape.backgroundBlur, blendMode: shape.blendMode,
    layout: shape.layout, layoutFlexDir: shape.layoutFlexDir, layoutGap: shape.layoutGap,
    layoutPadding: shape.layoutPadding, layoutWrap: shape.layoutWrap, layoutGridColumns: shape.layoutGridColumns,
    layoutGridRows: shape.layoutGridRows,
    flex: shape.flex ? { dir:shape.flex.dir,wrap:shape.flex.wrap,rowGap:shape.flex.rowGap,columnGap:shape.flex.columnGap,topPadding:shape.flex.topPadding,rightPadding:shape.flex.rightPadding,bottomPadding:shape.flex.bottomPadding,leftPadding:shape.flex.leftPadding,horizontalSizing:shape.flex.horizontalSizing,verticalSizing:shape.flex.verticalSizing } : null,
    grid: shape.grid ? { dir:shape.grid.dir,rows:shape.grid.rows,columns:shape.grid.columns,rowGap:shape.grid.rowGap,columnGap:shape.grid.columnGap,topPadding:shape.grid.topPadding,rightPadding:shape.grid.rightPadding,bottomPadding:shape.grid.bottomPadding,leftPadding:shape.grid.leftPadding,horizontalSizing:shape.grid.horizontalSizing,verticalSizing:shape.grid.verticalSizing } : null,
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
  assert.ok(env.penpot.boardCreates > 0 && env.penpot.textCreates > 0 && env.penpot.svgCreates > 0);
  assert.equal(second.exact_managed_nodes, 40);
  assert.equal(second.unbound_state_fallbacks, 0);
  assert.equal(second.exhaustive_plugin_data_projection, true);
  const footerMaster = masters.find((master) => get(master, ns, 'component-id') === 'U-SHELL-FOOTER');
  const breadcrumbMaster = masters.find((master) => get(master, ns, 'component-id') === 'U-SHELL-BREADCRUMBS');
  assert.ok(footerMaster.grid && !footerMaster.flex);
  assert.deepEqual([footerMaster.grid.columns.length, footerMaster.grid.rows.length], [2, 5]);
  assert.ok(breadcrumbMaster.flex && !breadcrumbMaster.grid);
  assert.equal(breadcrumbMaster.flex.dir, 'row');
  assert.deepEqual(JSON.parse(get(footerMaster, ns, 'native-layout-owner')).direct_source_tuples.map((item) => item.role), ['SiteFooter', 'EventLayout']);
  assert.deepEqual(JSON.parse(get(breadcrumbMaster, ns, 'native-layout-owner')).direct_source_tuples.map((item) => item.role), ['Breadcrumbs', 'FreeCollectionSurface', 'CollectionCatalog']);
  for (const specimen of packageDefinition.page_units[0].specimens) {
    const board = specimens.find((node) => get(node, ns, 'specimen-id') === specimen.specimen_id);
    const linked = walk(board).filter((node) => get(node, ns, 'node-role') === 'linked-visible-instance');
    for (const instance of linked) {
      const componentId = get(instance, ns, 'component-id');
      const component = packageDefinition.page_units[0].components.find((item) => item.component_id === componentId);
      const boundState = specimen.component_state_bindings[componentId];
      assert.ok(component.states.includes(boundState));
      assert.equal(get(instance, ns, 'state'), boundState);
      const exact = component.native_visual.state_styles[boundState];
      assert.equal(instance.fills[0].fillColor, exact[0]);
      assert.equal(instance.strokes[0].strokeColor, exact[1]);
      assert.equal(instance.borderRadius, component.native_visual.radius);
      const baseContract = component.native_visual.state_anatomy[boundState];
      const responsive = baseContract.responsive_overrides.find((entry) => specimen.viewport.width <= entry.max_width);
      const expectedContract = {
        ...baseContract,
        instance_size: responsive?.instance_size || baseContract.instance_size,
        role_overrides: { ...baseContract.role_overrides, ...(responsive?.role_overrides || {}) },
      };
      assert.equal(get(instance, ns, 'state-layout'), canonical(expectedContract.layout));
      assert.equal(get(instance, ns, 'state-flags'), canonical(expectedContract.flags));
      for (const anatomy of instance.children) {
        const role = get(anatomy, ns, 'anatomy-role');
        const visible = expectedContract.visible_roles.includes(role);
        assert.equal(anatomy.hidden, !visible, `${specimen.specimen_id}:${componentId}:${role}:hidden`);
        assert.equal(anatomy.visible, visible, `${specimen.specimen_id}:${componentId}:${role}:visible`);
        assert.equal(get(anatomy, ns, 'state-visibility'), visible ? 'visible' : 'hidden');
      }
    }
  }
  const mobileTop = specimens.find((node) => get(node, ns, 'specimen-id') === 'free-shell-mobile-top');
  const mobileMedallion = walk(mobileTop).find((node) => get(node, ns, 'component-id') === 'U-SHELL-FREE-ADMISSION-MEDALLION-PLACEMENT' && get(node, ns, 'node-role') === 'linked-visible-instance');
  const hero = mobileMedallion.children.find((node) => get(node, ns, 'anatomy-role') === 'hero-medallion-large');
  const compact = mobileMedallion.children.find((node) => get(node, ns, 'anatomy-role') === 'compact-medallion');
  assert.deepEqual([hero.width, hero.height, hero.hidden], [96, 96, false]);
  assert.equal(compact.hidden, true);
  const mobileOpen = specimens.find((node) => get(node, ns, 'specimen-id') === 'free-shell-mobile-full');
  const menu = walk(mobileOpen).find((node) => get(node, ns, 'anatomy-role') === 'fullscreen-menu-panel');
  const close = walk(mobileOpen).find((node) => get(node, ns, 'anatomy-role') === 'menu-close-action');
  assert.deepEqual([menu.hidden, menu.width, menu.height], [false, 390, 416]);
  assert.deepEqual([close.hidden, close.width, close.height], [false, 112, 112]);
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
    // Deliberately untagged: global managed-root scan must still reject it.
    specimen.appendChild(image);
    await assert.rejects(() => run(env), /SCREENSHOT_NODE/);
  }
});

test('unbound component state, untagged detached specimen child, and protected style/text mutation catch old false passes', async () => {
  {
    const env = environment();
    const broken = structuredClone(packageDefinition);
    delete broken.page_units[0].specimens[0].component_state_bindings['U-SHELL-HEADER-DESKTOP'];
    const { runNativePackage } = require('../../../../scripts/asp-production-conveyor-v3/u0/free-shell-review/native_runtime_v2');
    await assert.rejects(() => runNativePackage({ ...env, packageDefinition: broken }), /UNBOUND_SPECIMEN_COMPONENT_STATE/);
  }
  {
    const env = environment();
    await run(env);
    const specimen = walk(managedRoot(env)).find((node) => get(node, packageDefinition.native_successor.plugin_data_namespace, 'node-role') === 'visible-specimen');
    specimen.appendChild(new Shape('board'));
    await assert.rejects(() => run(env), /UNTAGGED_SPECIMEN_CHILD/);
  }
  {
    const env = environment();
    const originalCreateBoard = env.penpot.createBoard.bind(env.penpot);
    let mutated = false;
    env.penpot.createBoard = () => {
      if (!mutated) {
        mutated = true;
        const sentinel = env.protectedPage.root.children[0];
        sentinel.name = 'MUTATED';
        sentinel.fills = [{ fillColor: '#000000', fillOpacity: 1 }];
        sentinel.characters = 'changed';
        sentinel.setSharedPluginData('unknown-protected-namespace', 'secret', '{"state":"MUTATED"}');
      }
      return originalCreateBoard();
    };
    await assert.rejects(() => run(env), /PROTECTED_PROJECTION_CHANGED/);
  }
});

test('opacity, instance position, master anatomy position, and recursive untagged detach mutations fail closed', async () => {
  {
    const env = environment();
    const originalCreateBoard = env.penpot.createBoard.bind(env.penpot);
    let changed = false;
    env.penpot.createBoard = () => {
      if (!changed) {
        changed = true;
        env.protectedPage.root.children[0].opacity = 0.37;
      }
      return originalCreateBoard();
    };
    await assert.rejects(() => run(env), /PROTECTED_PROJECTION_CHANGED/);
  }
  {
    const env = environment();
    await run(env);
    const ns = packageDefinition.native_successor.plugin_data_namespace;
    const instance = walk(managedRoot(env)).find((node) => get(node, ns, 'node-role') === 'linked-visible-instance');
    instance.x += 7;
    await assert.rejects(() => run(env), /INSTANCE_POSITION_DRIFT|MANAGED_REPLAY_PROJECTION_DRIFT/);
  }
  {
    const env = environment();
    await run(env);
    const ns = packageDefinition.native_successor.plugin_data_namespace;
    const master = walk(managedRoot(env)).find((node) => get(node, ns, 'node-role') === 'component-master');
    master.children[0].x += 5;
    await assert.rejects(() => run(env), /MASTER_ANATOMY_POSITION_DRIFT|MANAGED_REPLAY_PROJECTION_DRIFT/);
  }
  {
    const env = environment();
    await run(env);
    const ns = packageDefinition.native_successor.plugin_data_namespace;
    const instance = walk(managedRoot(env)).find((node) => get(node, ns, 'node-role') === 'linked-visible-instance');
    const detached = new Shape('board');
    detached._copy = true;
    detached._component = null;
    instance.children[0].appendChild(detached);
    await assert.rejects(() => run(env), /RECURSIVE_DETACHED_INSTANCE/);
  }
});

test('native layout objects, shadows, fill images, extra plugin data, and exhaustive enumeration fail closed', async () => {
  {
    const env = environment();
    env.penpot.currentFile.pluginData = undefined;
    const before = env.penpot.created;
    await assert.rejects(() => run(env), /PLUGIN_DATA_EXHAUSTIVE_ENUMERATION_REQUIRED/);
    assert.equal(env.penpot.created, before);
  }
  {
    const env = environment();
    const originalCreateBoard = env.penpot.createBoard.bind(env.penpot);
    let changed = false;
    env.penpot.createBoard = () => {
      if (!changed) {
        changed = true;
        env.protectedPage.root.children[0].shadows = [{ style:'drop-shadow', color:'#00000080', offsetX:0, offsetY:8, blur:24, spread:0, hidden:false }];
      }
      return originalCreateBoard();
    };
    await assert.rejects(() => run(env), /PROTECTED_PROJECTION_CHANGED/);
  }
  {
    const env = environment();
    await run(env);
    const ns = packageDefinition.native_successor.plugin_data_namespace;
    const anatomy = walk(managedRoot(env)).find((node) => get(node, ns, 'anatomy-role'));
    anatomy.shadows = [{ style:'drop-shadow', color:'#00000080', offsetX:1, offsetY:2, blur:3, spread:0, hidden:false }];
    await assert.rejects(() => run(env), /MANAGED_REPLAY_PROJECTION_DRIFT/);
  }
  {
    const env = environment();
    await run(env);
    const ns = packageDefinition.native_successor.plugin_data_namespace;
    const instance = walk(managedRoot(env)).find((node) => get(node, ns, 'node-role') === 'linked-visible-instance');
    instance.setSharedPluginData('unexpected-namespace', 'extra-key', 'extra-value');
    await assert.rejects(() => run(env), /MANAGED_REPLAY_PROJECTION_DRIFT/);
  }
  {
    const env = environment();
    await run(env);
    const specimen = walk(managedRoot(env)).find((node) => get(node, packageDefinition.native_successor.plugin_data_namespace, 'node-role') === 'visible-specimen');
    const imageFill = new Shape('board');
    imageFill.fills = [{ fillImage: { id:'forbidden' } }];
    specimen.children[1].children[0].appendChild(imageFill);
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

'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const R = require('../../../../scripts/asp-production-conveyor-v3/u0/recovered-card-families/native_runtime_v2');
const { run } = require('../../../../scripts/asp-production-conveyor-v3/u0/recovered-card-families/native_executor_v2');
const { packageDefinition, setupPackage } = require('../../../../scripts/asp-production-conveyor-v3/u0/recovered-card-families/setup_v2');

class Shape {
  static next = 1;
  constructor(type = 'shape', id = null) {
    this.id = id || `shape-${Shape.next.toString()}`; Shape.next += 1;
    this.type = type; this.name = ''; this.children = []; this.parent = null;
    this.x = 0; this.y = 0; this.width = 0; this.height = 0; this.fills = []; this.strokes = [];
    this.borderRadius = 0; this.opacity = 1; this.visible = true; this.shared = new Map();
    this._component = null; this._copyRoot = false;
  }
  appendChild(child) {
    if (child.parent) child.parent.children = child.parent.children.filter((item) => item !== child);
    child.parent = this; this.children.push(child);
  }
  resize(width, height) { this.width = width; this.height = height; }
  setSharedPluginData(namespace, key, value) {
    assert.equal(typeof value, 'string', `non-string plugin data rejected for ${namespace}/${key}`);
    this.shared.set(`${namespace}\0${key}`, value);
  }
  getSharedPluginData(namespace, key) { return this.shared.get(`${namespace}\0${key}`) || ''; }
  addFlexLayout() {
    this.flex = { dir: 'row', wrap: 'nowrap', alignItems: 'stretch', justifyContent: 'start', rowGap: 0, columnGap: 0, verticalPadding: 0, horizontalPadding: 0 };
    return this.flex;
  }
  component() { return this._component; }
  isComponentCopyInstance() { return this._copyRoot && Boolean(this._component); }
}

class TextShape extends Shape {
  constructor(characters) { super('text'); this.characters = characters; }
}

class Page extends Shape {
  constructor(name, id = null) { super('page', id); this.name = name; this.root = new Shape('root', `${this.id}-root`); }
}

function cloneShape(source, component, root = true) {
  const clone = source.type === 'text' ? new TextShape(source.characters) : new Shape(source.type);
  for (const key of ['name', 'x', 'y', 'width', 'height', 'fills', 'strokes', 'borderRadius', 'opacity', 'visible', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'growType', 'flex']) {
    if (source[key] !== undefined) clone[key] = structuredClone(source[key]);
  }
  clone.shared = new Map(source.shared); clone._component = component; clone._copyRoot = root;
  for (const child of source.children) clone.appendChild(cloneShape(child, component, false));
  return clone;
}

function nativeSurface() {
  Shape.next = 1;
  const foreignPage = new Page('Owner managed page', 'foreign-page');
  const foreignRoot = new Shape('board', 'foreign-root'); foreignRoot.name = 'Protected owner root'; foreignPage.root.appendChild(foreignRoot);
  const components = [];
  const foreignMaster = new Shape('board', 'foreign-master'); foreignMaster.name = 'Protected component master';
  const foreignComponent = { id: 'foreign-component', name: 'Protected component', path: 'Owner', mainInstance: () => foreignMaster, instance: () => cloneShape(foreignMaster, foreignComponent) };
  foreignMaster._component = foreignComponent; components.push(foreignComponent);
  const versions = [];
  let undoBegin = 0; let undoFinish = 0; let openCount = 0;
  const penpot = {
    currentPage: foreignPage,
    currentFile: { id: '40e06342-8830-80d6-8008-8fc8a3a4cd4f', pages: [foreignPage], validate: () => [], revn: 1 },
    history: {
      undoBlockBegin() { undoBegin += 1; return Symbol('undo'); },
      undoBlockFinish(block) { assert.equal(typeof block, 'symbol'); undoFinish += 1; },
    },
    library: { local: { components, createComponent([main]) {
      const ordinal = (components.length + 1).toString();
      const component = { id: `component-${ordinal}`, name: '', path: '', mainInstance: () => main, instance: () => cloneShape(main, component) };
      main._component = component; components.push(component); return component;
    } } },
    createPage() { const page = new Page(''); this.currentFile.pages.push(page); return page; },
    createBoard() { return new Shape('board'); },
    createRectangle() { return new Shape('rectangle'); },
    createEllipse() { return new Shape('ellipse'); },
    createText(value) { assert.equal(typeof value, 'string'); return value.length ? new TextShape(value) : null; },
    async openPage(page) { openCount += 1; this.currentPage = page; if (this.onOpen) this.onOpen(openCount); },
  };
  const storage = { values: new Map(), async set(key, value) { this.values.set(key, structuredClone(value)); } };
  return { penpot, storage, foreignPage, foreignRoot, foreignComponent, components, versions, counts: () => ({ undoBegin, undoFinish, openCount }) };
}

const lease = () => ({ active: true, cancelled: false, lease_id: 'native-like-test' });

test('v2 package freezes all five source-bound families and removes metadata-only execution', () => {
  assert.deepEqual(R.validatePackage(packageDefinition), []);
  assert.equal(packageDefinition.successor_of.head, '5df944f3b72331fdf7a28205c328827a660b726f');
  assert.equal(packageDefinition.source_authority.head, '8f46f068ba41dab4dca538806d11693c8c0d3042');
  assert.equal(packageDefinition.source_authority.tree, 'a1739a4881262c2db9acd679e7b962a969ab5968');
  assert.deepEqual(packageDefinition.families, ['U-CARD-COMPACT', 'U-CARD-FESTIVAL', 'U-CARD-CLUB', 'U-CARD-ARTIFACT', 'U-CARD-COLLECTION']);
  assert.equal(packageDefinition.native_materialization.metadata_only_execution_removed, true);
  assert.equal(packageDefinition.native_materialization.penpot_ensure_used, false);
  assert.equal(packageDefinition.native_materialization.placeholder_geometry, false);
  assert.equal(packageDefinition.native_materialization.shared_plugin_data, 'strict-string-only');
  assert.equal(packageDefinition.native_materialization.page_order_assignment, false);
  assert.equal(packageDefinition.atlas_extension_request_path.endsWith('ASP_ATLAS_EXTENSION_REQUEST_V1.md'), true);
});

test('strict plugin-data runtime and native-like double reject every non-string without coercion', () => {
  const surface = nativeSurface();
  assert.equal(R.sha256('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.throws(() => R.tag(surface.foreignRoot, 'bad', 7), /PLUGIN_DATA_STRING_REQUIRED/);
  assert.throws(() => surface.foreignRoot.setSharedPluginData(R.NAMESPACE, 'bad', false), /non-string plugin data rejected/);
  assert.doesNotThrow(() => R.tag(surface.foreignRoot, 'good', '7'));
  assert.equal(surface.foreignRoot.getSharedPluginData(R.NAMESPACE, 'good'), '7');
});

test('two actual native-like executor runs create real masters and linked visible specimens only once', async () => {
  const surface = nativeSurface();
  const setup = await setupPackage({ storage: surface.storage, lease: lease() });
  assert.equal(setup.penpot_execution_authorized, false);
  const protectedBefore = R.protectedProjection(surface.penpot);
  const first = await run({ penpot: surface.penpot, storage: surface.storage, lease: lease() });
  const firstAudit = R.readback(surface.penpot, packageDefinition);
  const stableIds = {
    pages: firstAudit.pages.map((item) => item.id), roots: firstAudit.roots.map((item) => item.id),
    components: firstAudit.components.map((item) => item.id), wrappers: firstAudit.wrappers.map((item) => item.id),
    instances: firstAudit.instances.map((item) => item.id),
  };
  const second = await run({ penpot: surface.penpot, storage: surface.storage, lease: lease() });
  const secondAudit = R.readback(surface.penpot, packageDefinition);
  assert.equal(first.created, 31);
  assert.equal(second.created, 0);
  assert.deepEqual({
    pages: secondAudit.pages.map((item) => item.id), roots: secondAudit.roots.map((item) => item.id),
    components: secondAudit.components.map((item) => item.id), wrappers: secondAudit.wrappers.map((item) => item.id),
    instances: secondAudit.instances.map((item) => item.id),
  }, stableIds);
  assert.deepEqual({ pages: first.pages, roots: first.roots, components: first.component_masters, specimens: first.linked_visible_specimens }, { pages: 5, roots: 5, components: 5, specimens: 16 });
  assert.deepEqual({ duplicates: second.duplicates, detached: second.detached, screenshots: second.screenshots, lineage: second.source_lineage_errors }, { duplicates: 0, detached: 0, screenshots: 0, lineage: 0 });
  assert.equal(second.protected_projection_changed, false);
  assert.equal(second.protected_projection_before, protectedBefore.sha256);
  assert.equal(second.protected_projection_after, protectedBefore.sha256);
  assert.equal(second.atlas_extension_request_preserved, true);
  assert.equal(second.atlas_page_order_assigned, false);
  assert.equal(second.penpot_execution_authorized, false);
  assert.ok(firstAudit.components.every((component) => component.mainInstance().children.length > 0));
  assert.ok(firstAudit.instances.every((instance) => instance.isComponentCopyInstance() && instance.component()));
  assert.ok(firstAudit.wrappers.every((wrapper) => wrapper.children.some((child) => child.isComponentCopyInstance?.())));
  assert.ok(firstAudit.wrappers.every((wrapper) => wrapper.children.some((child) => child.type === 'text')));
  assert.equal(surface.counts().undoBegin, surface.counts().undoFinish);
});

test('duplicate, detached, screenshot, protected and cancellation gates fail closed', async () => {
  const duplicate = nativeSurface(); await run({ penpot: duplicate.penpot, storage: duplicate.storage, lease: lease() });
  const copiedPage = duplicate.penpot.createPage(); copiedPage.name = 'Duplicate managed page'; R.tag(copiedPage, 'package-id', R.PACKAGE_ID); R.tag(copiedPage, 'unit-id', 'U-CARD-COMPACT');
  await assert.rejects(run({ penpot: duplicate.penpot, storage: duplicate.storage, lease: lease() }), /DUPLICATE_PAGE/);

  const detached = nativeSurface(); await run({ penpot: detached.penpot, storage: detached.storage, lease: lease() });
  R.readback(detached.penpot, packageDefinition).instances[0]._copyRoot = false;
  await assert.rejects(run({ penpot: detached.penpot, storage: detached.storage, lease: lease() }), /NATIVE_CENSUS_MISMATCH|DETACHED_INSTANCES/);

  const screenshot = nativeSurface(); await run({ penpot: screenshot.penpot, storage: screenshot.storage, lease: lease() });
  const shot = screenshot.penpot.createBoard(); shot.name = 'screenshot evidence'; R.readback(screenshot.penpot, packageDefinition).roots[0].appendChild(shot);
  await assert.rejects(run({ penpot: screenshot.penpot, storage: screenshot.storage, lease: lease() }), /SCREENSHOT_SHAPES/);

  const protectedDrift = nativeSurface(); protectedDrift.penpot.onOpen = (count) => { if (count === 1) protectedDrift.foreignRoot.name = 'mutated owner root'; };
  await assert.rejects(run({ penpot: protectedDrift.penpot, storage: protectedDrift.storage, lease: lease() }), /PROTECTED_PROJECTION_CHANGED/);

  const cancelled = nativeSurface();
  await assert.rejects(run({ penpot: cancelled.penpot, storage: cancelled.storage, lease: { active: false, cancelled: true } }), /LEASE_NOT_ACTIVE/);
  assert.equal(cancelled.penpot.currentFile.pages.length, 1);
});

test('visible anatomy and family-specific states follow the frozen product contract', async () => {
  const surface = nativeSurface(); await run({ penpot: surface.penpot, storage: surface.storage, lease: lease() });
  const audit = R.readback(surface.penpot, packageDefinition);
  for (const unit of packageDefinition.page_units) {
    const master = audit.components.find((component) => component.name === unit.unit_id).mainInstance();
    const anatomy = new Set(R.walk(master).map((shape) => shape.getSharedPluginData(R.NAMESPACE, 'anatomy-id')).filter(Boolean));
    for (const required of unit.components[0].anatomy) assert.equal(anatomy.has(required), true, `${unit.unit_id}:${required}`);
    assert.equal(master.getSharedPluginData(R.NAMESPACE, 'source-head'), packageDefinition.source_authority.head);
    assert.equal(master.getSharedPluginData(R.NAMESPACE, 'source-tree'), packageDefinition.source_authority.tree);
    const roles = new Set(unit.components[0].source_consumers);
    const exactLineage = packageDefinition.source_authority.files.filter((item) => roles.has(item.role)).map((item) => ({ role: item.role, path: item.path, git_blob_sha1: item.git_blob_sha1 }));
    assert.equal(master.getSharedPluginData(R.NAMESPACE, 'source-lineage'), JSON.stringify(exactLineage));
    assert.ok(master.width > 0 && master.height > 0 && master.children.length > 0);
  }
  const states = new Set(audit.instances.map((instance) => instance.getSharedPluginData(R.NAMESPACE, 'state-id')));
  for (const specimen of packageDefinition.page_units.flatMap((unit) => unit.specimens)) assert.equal(states.has(specimen.state), true, specimen.state);
});

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const RUN = new URL('../catalog/penpot-executor/g19/run-materialization.js', import.meta.url);
const READBACK = new URL('../catalog/penpot-executor/g19/readback.js', import.meta.url);
const EXPORT = new URL('../catalog/penpot-executor/g19/export-roots.js', import.meta.url);

let nextId = 1;
class Shape {
  constructor(type, text = '') {
    this.id = `shape-${nextId++}`;
    this.type = type;
    this.name = '';
    this.characters = text;
    this.children = [];
    this.parent = null;
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.fills = [];
    this.strokes = [];
    this.pluginData = new Map();
    this.layoutChild = { absolute: false };
    this._component = null;
    this._isCopy = false;
  }
  appendChild(child) {
    if (child.parent) child.parent.children = child.parent.children.filter((candidate) => candidate !== child);
    child.parent = this;
    this.children.push(child);
  }
  resize(width, height) { this.width = Number(width); this.height = Number(height); }
  setPluginData(key, value) { this.pluginData.set(key, String(value)); }
  getPluginData(key) { return this.pluginData.get(key) || ''; }
  isComponentCopyInstance() { return this._isCopy; }
  component() { return this._component; }
  async export({ type }) {
    assert.equal(type, 'png');
    return new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  }
}

function cloneShape(source, component) {
  const copy = new Shape(source.type, source.characters);
  for (const key of ['name', 'width', 'height', 'x', 'y', 'fills', 'strokes', 'clipContent', 'borderRadiusTopLeft', 'borderRadiusTopRight', 'borderRadiusBottomRight', 'borderRadiusBottomLeft', 'fontSize', 'lineHeight', 'letterSpacing']) copy[key] = structuredClone(source[key]);
  copy.pluginData = new Map(source.pluginData);
  copy._isCopy = true;
  copy._component = component;
  for (const child of source.children) copy.appendChild(cloneShape(child, child._component));
  return copy;
}

function fakeSurface({ failMediaOnce = false } = {}) {
  nextId = 1;
  const root = new Shape('root');
  const components = [];
  let validateCalls = 0;
  let saveVersionCalls = 0;
  let undoBeginCalls = 0;
  let undoFinishCalls = 0;
  const versions = [];
  let mediaAttempts = 0;
  const variants = {
    400: { id: 'bc4c12f7-f47c-802d-8006-6df32533516b', fontVariantId: 'bc4c12f7-f47c-802d-8006-6df32533516b', fontWeight: 400, fontFamily: 'DejaVu Sans' },
    700: { id: 'bc4c12f7-f47c-802d-8006-6df347cf14f9', fontVariantId: 'bc4c12f7-f47c-802d-8006-6df347cf14f9', fontWeight: 700, fontFamily: 'DejaVu Sans' },
  };
  const font = {
    id: 'dejavu-sans',
    fontFamily: 'DejaVu Sans',
    variants: [variants[400], variants[700]],
    applyToText(shape, variant) { shape.appliedFontVariantId = variant.fontVariantId; },
  };
  const penpot = {
    currentFile: {
      id: '40e06342-8830-80d6-8008-8fc8a3a4cd4f',
      revn: 40,
      validate() { validateCalls += 1; return []; },
      async findVersions() { return versions; },
      async saveVersion(label) { saveVersionCalls += 1; this.revn += 1; const version = { id: `version-${saveVersionCalls}`, label }; versions.push(version); return version; },
    },
    currentPage: { id: 'c16498cb-b51d-8030-8008-904bd8fc9c53', root },
    createBoard: () => new Shape('board'),
    createRectangle: () => new Shape('rectangle'),
    createText: (text) => new Shape('text', text),
    createShapeFromSvg: () => new Shape('svg'),
    createShapeFromSvgWithImages: async () => { mediaAttempts += 1; if (failMediaOnce && mediaAttempts === 1) throw new Error('synthetic media upload interruption'); return new Shape('svg-image'); },
    fonts: { findByName: () => font, findAllByName: () => [font] },
    library: { local: {
      components,
      createComponent(shapes) {
        assert.equal(shapes.length, 1);
        const main = shapes[0];
        const component = {
          id: `component-${nextId++}`,
          path: '',
          name: '',
          mainInstance: () => main,
          instance() { return cloneShape(main, component); },
        };
        main._component = component;
        components.push(component);
        return component;
      },
    } },
    history: {
      undoBlockBegin() { undoBeginCalls += 1; return Symbol(`undo-${undoBeginCalls}`); },
      undoBlockFinish(blockId) { assert.equal(typeof blockId, 'symbol'); undoFinishCalls += 1; },
    },
  };
  const penpotUtils = { setParentXY(shape, x, y) { shape.x = Number(x); shape.y = Number(y); } };
  return { penpot, penpotUtils, storage: {}, root, components, validateCalls: () => validateCalls, saveVersionCalls: () => saveVersionCalls, undoCalls: () => ({ begin: undoBeginCalls, finish: undoFinishCalls }) };
}

async function execute(source, surface) {
  globalThis.penpot = surface.penpot;
  globalThis.penpotUtils = surface.penpotUtils;
  globalThis.storage = surface.storage;
  try {
    return await new Function(`return (async()=>{${source}\n})()` )();
  } finally {
    delete globalThis.penpot;
    delete globalThis.penpotUtils;
    delete globalThis.storage;
  }
}

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.021, `${actual} != ${expected}`);
const walk = (root) => [root, ...root.children.flatMap(walk)];

test('G19 payload creates exact linked desktop/mobile EventCard components idempotently', async () => {
  const source = await readFile(RUN, 'utf8');
  assert.doesNotMatch(source, /\.remove\s*\(/);
  assert.doesNotMatch(source, /\.detach\s*\(/);
  assert.doesNotMatch(source, /createImageFromData|screenshot-as-design/i);
  assert.doesNotMatch(source, /\b(?:require|import)\s*\(/);

  const surface = fakeSurface();
  const first = await execute(source, surface);
  assert.equal(first.terminalState, 'SUCCEEDED');
  assert.equal(first.mutations, 16);
  assert.equal(first.readback.acceptedCardRootCount, 2);
  assert.equal(first.readback.managedComponentCount, 16);
  assert.equal(first.readback.detachedRootCount, 0);
  assert.equal(first.readback.screenshotRootCount, 0);
  assert.equal(first.readback.routeLocalDuplicateMasterCount, 0);
  assert.deepEqual(first.readback.validation, []);
  assert.equal(first.savedVersion.id, 'version-1');
  assert.equal(first.savedVersion.created, true);
  assert.equal(surface.saveVersionCalls(), 1);
  assert.deepEqual(surface.undoCalls(), { begin: 16, finish: 16 });
  assert.equal(surface.validateCalls(), 3);

  const desktop = surface.components.find((component) => component.name === 'eventcard.desktop-wide-calendar.8006');
  const mobile = surface.components.find((component) => component.name === 'eventcard.mobile-wide-calendar.8006');
  assert.ok(desktop && mobile);
  near(desktop.mainInstance().width, 533.797);
  near(desktop.mainInstance().height, 947.328);
  near(mobile.mainInstance().width, 340);
  near(mobile.mainInstance().height, 701.281);
  assert.equal(desktop.mainInstance().children.filter((shape) => shape.isComponentCopyInstance()).length, 7);
  assert.equal(mobile.mainInstance().children.filter((shape) => shape.isComponentCopyInstance()).length, 7);
  assert.equal(desktop.mainInstance().borderRadiusTopLeft, 24);
  assert.equal(desktop.mainInstance().borderRadiusBottomRight, 24);
  const desktopUtility = desktop.mainInstance().children.find((shape) => shape.name === 'surface.utility-row');
  assert.equal(desktopUtility.clipContent, true);
  assert.equal(desktopUtility.borderRadiusBottomLeft, 24);
  assert.equal(desktopUtility.borderRadiusBottomRight, 24);
  assert.equal(desktopUtility.children.length, 3);

  const desktopSlots = Object.fromEntries(desktop.mainInstance().children.map((shape) => [shape.name, shape]));
  near(desktopSlots.title.x, 14.594); near(desktopSlots.title.y, 723.656); near(desktopSlots.title.width, 504.609); near(desktopSlots.title.height, 46.625);
  near(desktopSlots['action.calendar'].x, 145.125); near(desktopSlots['action.calendar'].y, 842.672); near(desktopSlots['action.calendar'].width, 147.438); near(desktopSlots['action.calendar'].height, 44);
  const mobileSlots = Object.fromEntries(mobile.mainInstance().children.map((shape) => [shape.name, shape]));
  near(mobileSlots.title.x, 14.594); near(mobileSlots.title.y, 465.25); near(mobileSlots.title.width, 310.813); near(mobileSlots.title.height, 35.594);
  near(mobileSlots['action.share'].x, 141.703); near(mobileSlots['action.share'].y, 657.282); near(mobileSlots['action.share'].width, 142.703); near(mobileSlots['action.share'].height, 44);

  const desktopMedia = surface.components.find((component) => component.name === 'event.media-frame.desktop.8006').mainInstance();
  assert.equal(desktopMedia.clipContent, true);
  near(desktopMedia.children[0].x, 1); near(desktopMedia.children[0].y, 1); near(desktopMedia.children[0].width, 531.797); near(desktopMedia.children[0].height, 709.063);
  assert.equal(desktopMedia.children[0].getPluginData('kenigevents-media-fit'), 'contain');
  assert.equal(desktopMedia.children[0].getPluginData('kenigevents-media-position'), '50% 50%');
  const desktopCalendar = surface.components.find((component) => component.name === 'event.action.calendar.desktop.8006').mainInstance();
  const calendarIcon = desktopCalendar.children.find((shape) => shape.name === 'icon');
  near(calendarIcon.x, 11.875); near(calendarIcon.y, 12); near(calendarIcon.width, 20); near(calendarIcon.height, 20);
  const desktopShare = surface.components.find((component) => component.name === 'event.action.share.desktop.8006').mainInstance();
  const shareIcon = desktopShare.children.find((shape) => shape.name === 'icon');
  near(shareIcon.x, 5.469); near(shareIcon.y, 11.766); near(shareIcon.width, 20.469); near(shareIcon.height, 20.469);
  const eventType = surface.components.find((component) => component.name === 'event.meta.event-type.desktop.8006').mainInstance().children[0];
  near(eventType.x, 7.031); near(eventType.y, 1.234); near(eventType.width, 53.328); near(eventType.height, 14);
  const admission = surface.components.find((component) => component.name === 'event.meta.admission.desktop.8006').mainInstance().children[0];
  near(admission.x, 9.797); near(admission.y, 6.094); near(admission.width, 173.156); near(admission.height, 14);

  const textValues = walk(desktop.mainInstance()).filter((shape) => shape.type === 'text').map((shape) => shape.characters);
  for (const value of ['Донорская акция «Стань донором крови»', 'встреча', '2 сентября 09:00', 'Бесплатно · регистрация', 'Гурьевск · Центр культуры и досуга', 'Не интересно', 'В календарь', 'Поделиться', '1', '9']) assert.ok(textValues.includes(value), value);
  const textShapes = surface.root.children.flatMap(walk).filter((shape) => shape.type === 'text');
  assert.ok(textShapes.length > 0);
  assert.ok(textShapes.every((shape) => shape.getPluginData('kenigevents-font-id') === 'bc4c12f7-f47c-802d-8006-6df347cf14f9'));

  const second = await execute(source, surface);
  assert.equal(second.terminalState, 'SUCCEEDED_IDEMPOTENT_REUSE');
  assert.equal(second.mutations, 0);
  assert.equal(second.savedVersion.created, false);
  assert.equal(surface.components.length, 16);
  assert.equal(surface.root.children.length, 16);
  assert.equal(surface.saveVersionCalls(), 1);
  assert.deepEqual(surface.undoCalls(), { begin: 16, finish: 16 });
  assert.equal(surface.validateCalls(), 6);
});

test('readback validates and export returns directly decodable PNG payloads', async () => {
  const [runSource, readbackSource, exportSource] = await Promise.all([readFile(RUN, 'utf8'), readFile(READBACK, 'utf8'), readFile(EXPORT, 'utf8')]);
  const surface = fakeSurface();
  await execute(runSource, surface);
  const readback = await execute(readbackSource, surface);
  assert.equal(readback.fileId, surface.penpot.currentFile.id);
  assert.equal(readback.pageId, surface.penpot.currentPage.id);
  assert.deepEqual(readback.validation, []);
  assert.equal(surface.validateCalls(), 4);
  const exported = await execute(exportSource, surface);
  assert.equal(exported.exports.length, 2);
  for (const item of exported.exports) {
    assert.equal(item.mime_type, 'image/png');
    assert.equal(item.base64, 'iVBORw0KGgo=');
    assert.equal(item.data_url, 'data:image/png;base64,iVBORw0KGgo=');
    assert.equal(item.byte_length, 8);
  }
});

test('preflight rejects wrong target and missing exact native font before writes', async () => {
  const source = await readFile(RUN, 'utf8');
  const wrongTarget = fakeSurface();
  wrongTarget.penpot.currentPage.id = 'wrong';
  await assert.rejects(execute(source, wrongTarget), /PENPOT_TARGET_MISMATCH/);
  assert.equal(wrongTarget.root.children.length, 0);
  const missingFont = fakeSurface();
  missingFont.penpot.fonts.findByName = () => null;
  missingFont.penpot.fonts.findAllByName = () => [];
  await assert.rejects(execute(source, missingFont), /EXACT_NATIVE_FONT_VARIANT_MISSING/);
  assert.equal(missingFont.root.children.length, 0);
  const unreadableRevision = fakeSurface();
  delete unreadableRevision.penpot.currentFile.revn;
  await assert.rejects(execute(source, unreadableRevision), /PENPOT_REVISION_UNREADABLE/);
  assert.equal(unreadableRevision.root.children.length, 0);
});

test('an interrupted async media unit is undo-bounded and resumable without cleanup', async () => {
  const source = await readFile(RUN, 'utf8');
  const surface = fakeSurface({ failMediaOnce: true });
  await assert.rejects(execute(source, surface), /synthetic media upload interruption/);
  assert.equal(surface.root.children.length, 1);
  assert.equal(surface.components.length, 0);
  assert.deepEqual(surface.undoCalls(), { begin: 1, finish: 1 });
  const resumed = await execute(source, surface);
  assert.equal(resumed.terminalState, 'SUCCEEDED');
  assert.equal(resumed.mutations, 16);
  assert.equal(resumed.readback.auditIssues.length, 0);
  assert.equal(surface.root.children.length, 16);
  assert.equal(surface.components.length, 16);
  assert.deepEqual(surface.undoCalls(), { begin: 17, finish: 17 });
});

test('idempotent reuse fails closed on payload-owned content drift', async () => {
  const source = await readFile(RUN, 'utf8');
  const surface = fakeSurface();
  await execute(source, surface);
  const admission = surface.components.find((component) => component.name === 'event.meta.admission.desktop.8006').mainInstance().children[0];
  admission.characters = 'drift';
  const undoBefore = surface.undoCalls();
  await assert.rejects(execute(source, surface), /MANAGED_TEXT_CONTENT_OR_FONT_DRIFT/);
  assert.deepEqual(surface.undoCalls(), undoBefore);
  assert.equal(surface.components.length, 16);
});

test('reuse audits exact surfaces and actual linked component lineage without repairs', async () => {
  const source = await readFile(RUN, 'utf8');
  const missingSurface = fakeSurface();
  await execute(source, missingSurface);
  const card = missingSurface.components.find((component) => component.name === 'eventcard.desktop-wide-calendar.8006').mainInstance();
  const surfaceBody = card.children.find((shape) => shape.name === 'surface.body');
  card.children = card.children.filter((shape) => shape !== surfaceBody);
  const unexpected = new Shape('rectangle'); unexpected.name = 'unexpected'; card.appendChild(unexpected);
  const undoBefore = missingSurface.undoCalls();
  await assert.rejects(execute(source, missingSurface), /MANAGED_RECT_MISSING/);
  assert.deepEqual(missingSurface.undoCalls(), undoBefore);

  const swapped = fakeSurface();
  await execute(source, swapped);
  const swappedCard = swapped.components.find((component) => component.name === 'eventcard.desktop-wide-calendar.8006').mainInstance();
  const linkedLeaf = swappedCard.children.find((shape) => shape.isComponentCopyInstance());
  linkedLeaf._component = { id: 'wrong-component' };
  await assert.rejects(execute(source, swapped), /LINKED_INSTANCE_LINEAGE_DRIFT/);
});

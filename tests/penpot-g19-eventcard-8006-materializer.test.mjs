import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const ROOT = new URL('../', import.meta.url);
const MANIFEST_URL = new URL('catalog/penpot-executor/g19/manifest.json', ROOT);
const BOARD_ID = '313fb1ed-0d5c-8095-8008-9108df52b2ce';
const BOARD_NAME = 'KenigEvents · G12 bounded L0-L3';
const RUNTIME_FONT_ID = 'custom-08d5cf0d-784d-80b0-8008-908353a24ee6';
const LEGACY_V2_PAYLOAD_SHA256 = 'b1e236cf6e1faf59ba7e9de1cd4f6c2571349cae884b3f96f5f9743681a51330';
const EXPECTED_CASES = [
  'eventcard.desktop-wide-calendar.8006',
  'eventcard.desktop-packed-calendar-absent.2182',
  'eventcard.mobile-wide-calendar.8006',
  'eventcard.mobile-packed-calendar-absent.2182',
];

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const readRelative = (path) => readFile(new URL(path, ROOT), 'utf8');
const manifest = JSON.parse(await readFile(MANIFEST_URL, 'utf8'));

let nextId = 1;
class Shape {
  constructor(type, text = '', id = null) {
    this.id = id || `shape-${nextId++}`;
    this.type = type;
    this.name = '';
    this.characters = text;
    this.children = [];
    this.parent = null;
    this.parentX = 0;
    this.parentY = 0;
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
    if (child.parent?.id === this.id && this._isCopy) throw new Error('Cannot change structure of component copy');
    if (child.parent) child.parent.children = child.parent.children.filter((candidate) => candidate !== child);
    child.parent = this;
    this.children.push(child);
    refreshAbsolute(child);
  }
  resize(width, height) { this.width = Number(width); this.height = Number(height); }
  setPluginData(key, value) { this.pluginData.set(key, String(value)); }
  getPluginData(key) { return this.pluginData.get(key) || ''; }
  isComponentCopyInstance() { return this._isCopy && Boolean(this._component); }
  component() { return this._component; }
  async export({ type }) {
    assert.equal(type, 'png');
    return new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  }
}

function refreshAbsolute(shape) {
  shape.x = Number(shape.parent?.x || 0) + Number(shape.parentX || 0);
  shape.y = Number(shape.parent?.y || 0) + Number(shape.parentY || 0);
  for (const child of shape.children) refreshAbsolute(child);
}

function cloneShape(source, component = null) {
  const copy = new Shape(source.type, source.characters);
  for (const key of ['name', 'width', 'height', 'parentX', 'parentY', 'fills', 'strokes', 'clipContent', 'hidden', 'borderRadiusTopLeft', 'borderRadiusTopRight', 'borderRadiusBottomRight', 'borderRadiusBottomLeft', 'fontSize', 'lineHeight', 'letterSpacing']) copy[key] = structuredClone(source[key]);
  copy.pluginData = new Map(source.pluginData);
  copy._isCopy = true;
  copy._component = component;
  for (const child of source.children) copy.appendChild(cloneShape(child));
  refreshAbsolute(copy);
  return copy;
}

function fakeSurface({ revision = 41, boardName = BOARD_NAME, secondPageRoot = false, variants = ['normal-400', 'normal-700'], failCardPathOnce = false } = {}) {
  nextId = 1;
  const pageRoot = new Shape('root', '', 'page-root');
  const board = new Shape('board', '', BOARD_ID);
  board.name = boardName;
  pageRoot.appendChild(board);
  if (secondPageRoot) pageRoot.appendChild(new Shape('board'));
  const components = [];
  const versions = [];
  let validateCalls = 0;
  let saveVersionCalls = 0;
  let undoBeginCalls = 0;
  let undoFinishCalls = 0;
  const sharedPluginData = new Map([['kenigevents\0asp-active-run-v1', JSON.stringify({
    schema: manifest.run_control.schema,
    run_id: manifest.run_control.expected_run_id,
    writer_id: manifest.run_control.expected_writer_id,
    state: manifest.run_control.allowed_state,
    contract_sha256: manifest.run_control.contract_sha256,
    page_profile_sha256: manifest.run_control.page_profile_sha256,
    asset_registry_sha256: manifest.run_control.asset_registry_sha256,
    geometry_proof_sha256: 'a'.repeat(64),
  })]]);
  const fontVariants = variants.map((id) => ({
    id,
    fontVariantId: id,
    fontWeight: Number(id.split('-').at(-1)),
    fontStyle: id.startsWith('normal-') ? 'normal' : 'italic',
    fontFamily: 'DejaVu Sans',
  }));
  const font = {
    id: RUNTIME_FONT_ID,
    fontId: RUNTIME_FONT_ID,
    fontFamily: 'DejaVu Sans',
    variants: fontVariants,
    applyToText(shape, variant) { shape.appliedFontVariantId = variant.fontVariantId; },
  };
  const penpot = {
    currentFile: {
      id: '40e06342-8830-80d6-8008-8fc8a3a4cd4f',
      revn: revision,
      getSharedPluginData(namespace, key) { return sharedPluginData.get(`${namespace}\0${key}`) || ''; },
      setSharedPluginData(namespace, key, value) { sharedPluginData.set(`${namespace}\0${key}`, String(value)); },
      validate() { validateCalls += 1; return []; },
      async findVersions() { return versions; },
      async saveVersion(label) {
        saveVersionCalls += 1;
        this.revn += 1;
        const version = { id: `version-${saveVersionCalls}`, label };
        versions.push(version);
        return version;
      },
    },
    currentPage: { id: 'c16498cb-b51d-8030-8008-904bd8fc9c53', root: pageRoot },
    createBoard: () => new Shape('board'),
    createRectangle: () => new Shape('rectangle'),
    createText: (text) => new Shape('text', text),
    createShapeFromSvg: () => new Shape('svg'),
    createShapeFromSvgWithImages: async () => new Shape('svg-image'),
    fonts: { findByName: (name) => name === 'DejaVu Sans' ? font : null, findAllByName: (name) => name === 'DejaVu Sans' ? [font] : [] },
    library: { local: {
      components,
      createComponent(shapes) {
        assert.equal(shapes.length, 1);
        const main = shapes[0];
        assert.equal(main.parent?.id, BOARD_ID, 'every main must remain under the accepted board');
        let componentPath = '';
        const component = {
          id: `component-${nextId++}`,
          name: '',
          mainInstance: () => main,
          instance() { return cloneShape(main, component); },
        };
        Object.defineProperty(component, 'path', {
          get() { return componentPath; },
          set(value) {
            if (failCardPathOnce && main.getPluginData('kenigevents-role') === 'accepted-card-master') {
              failCardPathOnce = false;
              throw new Error('synthetic card registration interruption');
            }
            componentPath = value;
          },
          enumerable: true,
        });
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
  const penpotUtils = {
    setParentXY(shape, x, y) {
      shape.parentX = Number(x);
      shape.parentY = Number(y);
      refreshAbsolute(shape);
    },
  };
  return {
    penpot,
    penpotUtils,
    storage: {},
    pageRoot,
    board,
    components,
    validateCalls: () => validateCalls,
    saveVersionCalls: () => saveVersionCalls,
    undoCalls: () => ({ begin: undoBeginCalls, finish: undoFinishCalls }),
    sharedPluginData,
  };
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

async function executePath(path, surface) {
  return execute(await readRelative(path), surface);
}

async function installRuntime(surface) {
  let receipt = null;
  for (const path of manifest.execution.setup_order) receipt = await executePath(`catalog/penpot-executor/g19/${path}`, surface);
  return receipt;
}

async function runAllPhases(surface) {
  const receipts = [];
  for (const path of manifest.execution.mutator_order) receipts.push(await executePath(`catalog/penpot-executor/g19/${path}`, surface));
  return receipts;
}

const walk = (shape) => [shape, ...shape.children.flatMap(walk)];

function downgradeCompletedV3ToObservedV2(surface, predicate = () => true) {
  for (const root of surface.board.children.filter(predicate)) {
    const marker = root.getPluginData('kenigevents-g19-marker');
    if (marker.endsWith(':v3')) root.setPluginData('kenigevents-g19-marker', marker.replace(/:v3$/, ':v2'));
    for (const shape of walk(root)) {
      const childMarker = shape.getPluginData('kenigevents-g19-child-marker');
      if (childMarker.includes(':v3:')) shape.setPluginData('kenigevents-g19-child-marker', childMarker.replace(':v3:', ':v2:'));
      if (shape.getPluginData('kenigevents-payload-sha256')) shape.setPluginData('kenigevents-payload-sha256', LEGACY_V2_PAYLOAD_SHA256);
      if (shape.getPluginData('kenigevents-g19-marker').includes('event.media-frame.')) shape.fills = [{ fillColor: '#15110f', fillOpacity: 1 }];
      if (shape.type === 'text') {
        shape.fontSize = Number(shape.fontSize);
        shape.lineHeight = Number(shape.lineHeight);
        shape.letterSpacing = Number(shape.letterSpacing);
      }
    }
  }
}

test('V3 manifest and bounded scripts are hash-locked, filesystem-independent, and runtime-ID agnostic', async () => {
  assert.equal(manifest.readiness_marker, 'ASP_G19_P2_PAYLOAD_READY_V3');
  assert.equal(manifest.target.expected_baseline_revision, 41);
  assert.equal(manifest.target.accepted_board_id, BOARD_ID);
  assert.equal(manifest.target.accepted_board_name, BOARD_NAME);
  assert.equal(manifest.target.expected_initial_board_descendants, 0);
  assert.equal(manifest.expected_success.board_children, 18);
  assert.equal(manifest.expected_success.local_components, 18);
  assert.deepEqual(manifest.expected_card_components, EXPECTED_CASES);
  assert.equal(manifest.expected_leaf_components.length, 14);
  assert.equal(manifest.native_fonts.regular_400_variant, 'normal-400');
  assert.equal(manifest.native_fonts.bold_700_variant, 'normal-700');
  assert.equal(manifest.native_fonts.transient_runtime_ids_pinned, false);
  assert.equal(manifest.execution.mutator_order.length, 13);
  assert.ok(manifest.execution.maximum_generated_script_bytes < 65000);

  let combined = '';
  let executableIdentity = '';
  for (const output of manifest.outputs) {
    const bytes = await readFile(new URL(output.path, ROOT));
    assert.equal(bytes.length, output.bytes, output.path);
    assert.equal(sha256(bytes), output.sha256, output.path);
    combined += bytes.toString('utf8');
    executableIdentity += `${output.path}\0${output.sha256}\n`;
  }
  assert.equal(sha256(Buffer.from(executableIdentity)), manifest.executable_set_sha256);
  assert.doesNotMatch(combined, /bc4c12f7-f47c-802d-8006-6df3/);
  assert.doesNotMatch(combined, /crypto\.subtle/);
  assert.doesNotMatch(combined, /globalThis\.penpot/);
  assert.doesNotMatch(combined, /\.remove\s*\(|\.detach\s*\(|createImageFromData|screenshot-as-design/i);
  assert.doesNotMatch(combined, /\b(?:require|import)\s*\(/);
  assert.match(combined, /normal-\$\{weight\}/);
});

test('read-only setup accepts the exact revision-41 empty scaffold and resolves current native font variants', async () => {
  const surface = fakeSurface();
  const installed = await installRuntime(surface);
  assert.equal(installed.installed, true);
  assert.equal(installed.preflight.mode, 'ACCEPTED_BOARD_EMPTY_REVISION_41');
  assert.equal(installed.preflight.boardId, BOARD_ID);
  assert.equal(installed.preflight.boardChildren, 0);
  assert.equal(installed.preflight.boardDescendants, 0);
  assert.equal(installed.preflight.localComponents, 0);
  assert.deepEqual(installed.preflight.validation, []);
  assert.equal(installed.fontBinding.regular.runtimeFontId, RUNTIME_FONT_ID);
  assert.equal(installed.fontBinding.regular.variantId, 'normal-400');
  assert.equal(installed.fontBinding.bold.runtimeFontId, RUNTIME_FONT_ID);
  assert.equal(installed.fontBinding.bold.variantId, 'normal-700');
  assert.equal(surface.pageRoot.children.length, 1);
  assert.equal(surface.pageRoot.children[0], surface.board);
  assert.equal(surface.board.children.length, 0);
  assert.equal(surface.components.length, 0);
  assert.equal(surface.saveVersionCalls(), 0);
  assert.deepEqual(surface.undoCalls(), { begin: 0, finish: 0 });
});

test('bounded phases build 14 linked leaves and all four exact accepted EventCards under only the existing board', async () => {
  const surface = fakeSurface();
  await installRuntime(surface);
  const receipts = await runAllPhases(surface);
  for (const [index, receipt] of receipts.entries()) {
    assert.deepEqual(receipt.readback.validation, [], manifest.execution.mutator_order[index]);
    assert.equal(receipt.readback.pageDirectRootCount, 1);
    assert.equal(receipt.readback.board.id, BOARD_ID);
    assert.ok(receipt.readback.board.childCount > 0);
    assert.ok(receipt.readback.totalLocalComponentCount > 0);
    assert.equal(receipt.readback.screenshotRootCount, 0);
    assert.equal(receipt.readback.detachedRootCount, 0);
  }

  const final = receipts.at(-1).readback;
  assert.equal(final.board.childCount, 18);
  assert.ok(final.board.descendantCount > final.board.childCount);
  assert.equal(final.managedComponentCount, 18);
  assert.equal(final.totalLocalComponentCount, 18);
  assert.equal(final.acceptedCardRootCount, 4);
  assert.equal(final.inProgressRootCount, 0);
  assert.equal(final.routeLocalDuplicateMasterCount, 0);
  assert.deepEqual(final.validation, []);
  assert.deepEqual(final.cards.map((card) => card.name), EXPECTED_CASES);
  assert.deepEqual(final.cards.map((card) => card.fixtureId), ['event.real.8006', 'event.real.2182', 'event.real.8006', 'event.real.2182']);
  assert.deepEqual(final.cards.map((card) => card.structuralContext), ['desktop-wide-calendar', 'desktop-packed-calendar-absent', 'mobile-wide-calendar', 'mobile-packed-calendar-absent']);
  assert.deepEqual(final.cards.map((card) => card.linkedLeafCount), [7, 6, 7, 6]);
  assert.ok(final.cards.every((card) => card.componentId && card.rootId));
  assert.ok(final.cards.flatMap((card) => card.linkedInstances).every((item) => item.instanceId && item.componentId));
  assert.ok(final.cards.filter((card) => card.name.includes('calendar-absent')).every((card) => !card.linkedInstances.some((item) => item.slot === 'action.calendar')));
  assert.equal(surface.pageRoot.children.length, 1);
  assert.equal(surface.pageRoot.children[0].id, BOARD_ID);
  assert.ok(surface.components.every((component) => component.mainInstance().parent?.id === BOARD_ID));

  const textShapes = surface.board.children.flatMap(walk).filter((shape) => shape.type === 'text' && !shape.hidden);
  assert.ok(textShapes.length > 0);
  assert.ok(textShapes.every((shape) => shape.getPluginData('kenigevents-font-runtime-id') === RUNTIME_FONT_ID));
  assert.ok(textShapes.every((shape) => shape.getPluginData('kenigevents-font-variant-id') === 'normal-700'));
  assert.ok(textShapes.every((shape) => shape.growType === 'fixed'));
  assert.ok(textShapes.every((shape) => ['fontSize', 'lineHeight', 'letterSpacing'].every((key) => typeof shape[key] === 'string')));
  const mediaLeaves = surface.components.filter((component) => component.name.startsWith('event.media-frame.')).map((component) => component.mainInstance());
  assert.equal(mediaLeaves.length, 2);
  assert.ok(mediaLeaves.every((shape) => shape.fills.length === 0));
  for (const card of final.cards) {
    const root = surface.components.find((component) => component.id === card.componentId).mainInstance();
    const mediaInstance = root.children.find((shape) => shape.getPluginData('kenigevents-instance-slot') === 'media-link');
    const poster = root.children.find((shape) => shape.getPluginData('kenigevents-g19-child-marker').endsWith(':content.media-artwork'));
    assert.ok(mediaInstance && poster);
    assert.equal(mediaInstance.fills.length, 0);
    assert.ok(root.children.indexOf(poster) < root.children.indexOf(mediaInstance));
  }

  const exported = await executePath('catalog/penpot-executor/g19/export-roots.js', surface);
  assert.equal(exported.exports.length, 4);
  assert.deepEqual(exported.exports.map((item) => item.name), EXPECTED_CASES);
  assert.ok(exported.exports.every((item) => item.mime_type === 'image/png' && item.base64 === 'iVBORw0KGgo=' && item.data_url === 'data:image/png;base64,iVBORw0KGgo='));

  const identity = final.components.map(({ name, componentId, rootId }) => ({ name, componentId, rootId }));
  const versionsBefore = surface.saveVersionCalls();
  const second = await runAllPhases(surface);
  assert.ok(second.every((receipt) => receipt.terminalState === 'SUCCEEDED_IDEMPOTENT_REUSE' && receipt.mutations === 0));
  assert.equal(surface.saveVersionCalls(), versionsBefore);
  assert.deepEqual(second.at(-1).readback.components.map(({ name, componentId, rootId }) => ({ name, componentId, rootId })), identity);
  assert.equal(surface.board.children.length, 18);
  assert.equal(surface.pageRoot.children.length, 1);
  assert.equal(surface.undoCalls().begin, surface.undoCalls().finish);
});

test('preflight fails closed on revision, scaffold topology, board identity, or exact font-variant drift', async () => {
  const cases = [
    [fakeSurface({ revision: 40 }), /PENPOT_BASELINE_REVISION_MISMATCH/],
    [fakeSurface({ boardName: 'KenigEvents · G12 bounded L0–L3' }), /PENPOT_ACCEPTED_BOARD_MISMATCH/],
    [fakeSurface({ secondPageRoot: true }), /PENPOT_ACCEPTED_BOARD_MISMATCH/],
    [fakeSurface({ variants: ['normal-400'] }), /EXACT_NATIVE_FONT_VARIANT_MISSING/],
    [fakeSurface({ variants: ['legacy-400', 'legacy-700'] }), /EXACT_NATIVE_FONT_VARIANT_MISSING/],
  ];
  for (const [surface, expected] of cases) {
    await assert.rejects(installRuntime(surface), expected);
    assert.equal(surface.board.children.length, 0);
    assert.equal(surface.components.length, 0);
    assert.equal(surface.saveVersionCalls(), 0);
    assert.deepEqual(surface.undoCalls(), { begin: 0, finish: 0 });
  }
});

test('phase reuse audits exact payload-owned content and performs no blind repair', async () => {
  const surface = fakeSurface();
  await installRuntime(surface);
  await executePath('catalog/penpot-executor/g19/phase-p10-desktop-leaves-a.js', surface);
  const admission = surface.components.find((component) => component.name === 'event.meta.admission.desktop.8006').mainInstance();
  admission.children[0].characters = 'drift';
  const undoBefore = surface.undoCalls();
  await assert.rejects(executePath('catalog/penpot-executor/g19/phase-p10-desktop-leaves-a.js', surface), /MANAGED_TEXT_CONTENT_OR_FONT_DRIFT/);
  assert.deepEqual(surface.undoCalls(), undoBefore);
  assert.equal(surface.board.children.length, 4);
  assert.equal(surface.components.length, 4);
});

test('an interrupted card-component registration resumes the exact marked shell without cleanup', async () => {
  const surface = fakeSurface({ failCardPathOnce: true });
  await installRuntime(surface);
  const throughShell = manifest.execution.mutator_order.slice(0, manifest.execution.mutator_order.indexOf('phase-p31-desktop-wide-final.js'));
  for (const path of throughShell) await executePath(`catalog/penpot-executor/g19/${path}`, surface);
  await assert.rejects(executePath('catalog/penpot-executor/g19/phase-p31-desktop-wide-final.js', surface), /synthetic card registration interruption/);
  const partialComponents = surface.components.filter((component) => component.mainInstance().getPluginData('kenigevents-role') === 'accepted-card-master');
  assert.equal(partialComponents.length, 1);
  assert.equal(partialComponents[0].path, '');
  assert.equal(partialComponents[0].mainInstance().getPluginData('kenigevents-build-state'), 'SHELL_COMPLETE');
  const resumed = await executePath('catalog/penpot-executor/g19/phase-p31-desktop-wide-final.js', surface);
  assert.equal(resumed.terminalState, 'SUCCEEDED');
  assert.equal(resumed.created[0].componentId, partialComponents[0].id);
  assert.equal(partialComponents[0].path, 'KenigEvents / G19 / EventCard 8006 / Accepted');
  assert.equal(partialComponents[0].name, 'eventcard.desktop-wide-calendar.8006');
  assert.equal(partialComponents[0].mainInstance().getPluginData('kenigevents-build-state'), 'COMPLETE');
  assert.equal(surface.pageRoot.children.length, 1);
});

test('observed V2 leaves/card and a failed V3 packed shell migrate in place before bounded resume', async () => {
  const surface = fakeSurface();
  await installRuntime(surface);
  const throughDesktopWide = manifest.execution.mutator_order.slice(0, manifest.execution.mutator_order.indexOf('phase-p40-desktop-packed-shell.js'));
  for (const path of throughDesktopWide) await executePath(`catalog/penpot-executor/g19/${path}`, surface);
  assert.equal(surface.components.length, 15);
  downgradeCompletedV3ToObservedV2(surface, (root) => root.getPluginData('kenigevents-role') === 'leaf-master');

  await executePath('catalog/penpot-executor/g19/phase-p40-desktop-packed-shell.js', surface);
  downgradeCompletedV3ToObservedV2(surface, (root) => root.name === 'eventcard.desktop-wide-calendar.8006');
  const interruptedRoot = surface.board.children.find((shape) => shape.name === 'eventcard.desktop-packed-calendar-absent.2182');
  assert.ok(interruptedRoot);
  interruptedRoot.setPluginData('kenigevents-build-state', 'BUILDING');
  assert.equal(surface.board.children.length, 16);
  assert.equal(surface.components.length, 15);
  const preserved = new Map(surface.components.map((component) => [component.name, { componentId: component.id, rootId: component.mainInstance().id }]));

  await installRuntime(surface);
  const receipts = await runAllPhases(surface);
  const final = receipts.at(-1).readback;
  assert.equal(final.board.childCount, 18);
  assert.equal(final.managedComponentCount, 18);
  assert.equal(final.acceptedCardRootCount, 4);
  assert.equal(final.inProgressRootCount, 0);
  assert.equal(final.routeLocalDuplicateMasterCount, 0);
  assert.deepEqual(final.auditIssues, []);
  assert.deepEqual(final.validation, []);
  assert.ok(surface.board.children.every((root) => root.getPluginData('kenigevents-g19-marker').endsWith(':v3')));
  assert.ok(surface.board.children.flatMap(walk).filter((shape) => shape.getPluginData('kenigevents-payload-sha256')).every((shape) => shape.getPluginData('kenigevents-payload-sha256') === manifest.payload_sha256));
  assert.ok(surface.board.children.flatMap(walk).filter((shape) => shape.getPluginData('kenigevents-g19-child-marker')).every((shape) => shape.getPluginData('kenigevents-g19-child-marker').includes(':v3:')));
  for (const [name, ids] of preserved) {
    const component = surface.components.find((candidate) => candidate.name === name);
    assert.deepEqual({ componentId: component.id, rootId: component.mainInstance().id }, ids, name);
  }
  const migratedText = surface.board.children.flatMap(walk).filter((shape) => shape.type === 'text' && !shape.hidden);
  assert.ok(migratedText.every((shape) => shape.growType === 'fixed' && typeof shape.fontSize === 'string' && typeof shape.lineHeight === 'string' && typeof shape.letterSpacing === 'string'));
  assert.ok(surface.components.filter((component) => component.name.startsWith('event.media-frame.')).every((component) => component.mainInstance().fills.length === 0));
});

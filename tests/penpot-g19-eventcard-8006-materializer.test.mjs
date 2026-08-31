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
const LEGACY_LIVE_V3_PAYLOAD_SHA256 = 'c6c35b6f39e3cd5bc68bfe183c1df0652475533d4eecbaea8bd7bca1b4b35219';
const PRESERVED_PARTIAL_ROOT_ID = '313fb1ed-0d5c-8095-8008-914c76615924';
const LEGACY_ICON_SHA256 = { 'not-interested': 'd8d94023de0e563663c71a628657e3e4402ed5cb36fa836f784071e83edc8ae6', calendar: 'f5465db33659eb80685704961006aa1d5f970f337dd6b330d8056c3326360633', share: '99103f01c0cbd48d87ff639dc3e6c6291a7f8c2aa147c854667d1a8f7a677cf9', like: 'e5654867ef9431714cfc53a1890fb14fcaa52c64579388f5364a0fa01ce6ea58' };
const EXPECTED_CASES = [
  'eventcard.desktop-wide-calendar.8006',
  'eventcard.desktop-packed-calendar-absent.2182',
  'eventcard.mobile-wide-calendar.8006',
  'eventcard.mobile-packed-calendar-absent.2182',
];

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const gitBlobSha1 = (bytes) => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
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
  get textBounds() {
    if (this.type !== 'text') return null;
    if (this._textBoundsOverride) return { ...this._textBoundsOverride };
    const fontSize = Number(this.fontSize || 0), lineHeight = Number(this.lineHeight || 1);
    return { x: this.x, y: this.y, width: Math.min(this.width, Math.max(1, this.characters.length * fontSize * 0.55)), height: fontSize * lineHeight };
  }
  remove() {
    if (this.parent) this.parent.children = this.parent.children.filter((candidate) => candidate !== this);
    this.parent = null;
  }
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
  for (const key of ['name', 'width', 'height', 'parentX', 'parentY', 'fills', 'strokes', 'clipContent', 'hidden', 'borderRadiusTopLeft', 'borderRadiusTopRight', 'borderRadiusBottomRight', 'borderRadiusBottomLeft', 'growType', 'fontSize', 'lineHeight', 'letterSpacing']) copy[key] = structuredClone(source[key]);
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
  let cancelDuringNextMediaCreate = false;
  const mediaShapes = [];
  const sharedPluginData = new Map([['kenigevents\0asp-active-run-v1', JSON.stringify({
    schema: manifest.run_control.schema,
    run_id: manifest.run_control.expected_run_id,
    writer_id: manifest.run_control.expected_writer_id,
    state: manifest.run_control.allowed_state,
    contract_sha256: manifest.run_control.contract_sha256,
    page_profile_sha256: manifest.run_control.page_profile_sha256,
    asset_registry_sha256: manifest.run_control.asset_registry_sha256,
    geometry_proof_sha256: manifest.run_control.geometry_proof_sha256,
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
    createShapeFromSvgWithImages: async () => {
      const shape = new Shape('svg-image');
      mediaShapes.push(shape);
      if (cancelDuringNextMediaCreate) {
        cancelDuringNextMediaCreate = false;
        const key = 'kenigevents\0asp-active-run-v1';
        const control = JSON.parse(sharedPluginData.get(key));
        sharedPluginData.set(key, JSON.stringify({ ...control, state: 'CANCEL_REQUESTED' }));
      }
      return shape;
    },
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
    mediaShapes,
    cancelDuringNextMediaCreate: () => { cancelDuringNextMediaCreate = true; },
  };
}

function replaceRunControl(surface, changes) {
  const key = 'kenigevents\0asp-active-run-v1';
  const current = JSON.parse(surface.sharedPluginData.get(key));
  surface.sharedPluginData.set(key, JSON.stringify({ ...current, ...changes }));
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

async function installRuntime(surface, { synthesizeObservedBaseline = false } = {}) {
  let receipt = null;
  for (const path of manifest.execution.setup_order) {
    let source = await readRelative(`catalog/penpot-executor/g19/${path}`);
    if (synthesizeObservedBaseline && path === 'phase-03-install-runtime.js') {
      const replacements = [
        ['const ER=56', 'const ER=41'],
        ['EBC=16', 'EBC=0'],
        ['EBD=137', 'EBD=0'],
        ['ELC=15', 'ELC=0'],
      ];
      for (const [from, to] of replacements) {
        assert.ok(source.includes(from), from);
        source = source.replace(from, to);
      }
    }
    receipt = await execute(source, surface);
  }
  return receipt;
}

async function runAllPhases(surface) {
  const receipts = [];
  for (const path of manifest.execution.mutator_order.filter((path) => !path.startsWith('phase-p9'))) receipts.push(await executePath(`catalog/penpot-executor/g19/${path}`, surface));
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
      const linkedMarker = shape.getPluginData('kenigevents-g19-marker');
      if (shape !== root && linkedMarker.endsWith(':v3')) shape.setPluginData('kenigevents-g19-marker', linkedMarker.replace(/:v3$/, ':v2'));
      if (shape.getPluginData('kenigevents-payload-sha256')) shape.setPluginData('kenigevents-payload-sha256', LEGACY_V2_PAYLOAD_SHA256);
      const rootMarker = root.getPluginData('kenigevents-g19-marker');
      const action = Object.keys(LEGACY_ICON_SHA256).find((name) => rootMarker.includes(`action.${name}`));
      if (action && shape.getPluginData('kenigevents-svg-sha256')) shape.setPluginData('kenigevents-svg-sha256', LEGACY_ICON_SHA256[action]);
      if (shape.getPluginData('kenigevents-g19-marker').includes('event.media-frame.')) shape.fills = [{ fillColor: '#15110f', fillOpacity: 1 }];
      if (shape.type === 'text') {
        shape.fontSize = Number(shape.fontSize);
        shape.lineHeight = Number((Number(shape.fontSize) * Number(shape.lineHeight)).toFixed(6));
        shape.letterSpacing = Number(shape.letterSpacing);
      }
    }
    root.name = `KenigEvents / G19 / Native component main / ${root.name}`;
  }
}

async function observedCurrentSurface() {
  const surface = fakeSurface({ revision: 41 });
  await installRuntime(surface, { synthesizeObservedBaseline: true });
  const throughPackedShell = manifest.execution.mutator_order.slice(0, manifest.execution.mutator_order.indexOf('phase-p40-desktop-packed-shell.js') + 1);
  for (const path of throughPackedShell) await executePath(`catalog/penpot-executor/g19/${path}`, surface);
  const partial = surface.board.children.find((shape) => shape.name === 'eventcard.desktop-packed-calendar-absent.2182');
  assert.ok(partial && partial.getPluginData('kenigevents-build-state') === 'SHELL_COMPLETE');
  downgradeCompletedV3ToObservedV2(surface, (root) => root !== partial);
  partial.id = PRESERVED_PARTIAL_ROOT_ID;
  const cardPrefix = `${partial.getPluginData('kenigevents-g19-marker')}:`;
  partial.setPluginData('kenigevents-payload-sha256', LEGACY_LIVE_V3_PAYLOAD_SHA256);
  partial.setPluginData('kenigevents-build-state', 'BUILDING');
  // The native interrupted P40 checkpoint predates the admission binding.
  const absentAtCheckpoint = partial.children.find((shape) => shape.name === 'admission');
  assert.ok(absentAtCheckpoint);
  absentAtCheckpoint.remove();
  for (const shape of walk(partial).slice(1)) {
    const cardChildMarker = shape.getPluginData('kenigevents-g19-child-marker');
    const leafMarker = shape.getPluginData('kenigevents-g19-marker');
    if (leafMarker.endsWith(':v3')) shape.setPluginData('kenigevents-g19-marker', leafMarker.replace(/:v3$/, ':v2'));
    if (cardChildMarker.startsWith(cardPrefix)) {
      shape.setPluginData('kenigevents-payload-sha256', LEGACY_LIVE_V3_PAYLOAD_SHA256);
    } else if (cardChildMarker.includes(':v3:')) {
      shape.setPluginData('kenigevents-g19-child-marker', cardChildMarker.replace(':v3:', ':v2:'));
      shape.setPluginData('kenigevents-payload-sha256', LEGACY_V2_PAYLOAD_SHA256);
    }
  }
  // Model Penpot's native SVG vector descendants, which the compact fake does not create.
  const nativeVectorHost = surface.board.children
    .find((shape) => shape.getPluginData('kenigevents-g19-marker').includes('event.media-frame.desktop.8006'))
    ?.children[0];
  assert.ok(nativeVectorHost);
  for (let index = 0; index < 40; index += 1) nativeVectorHost.appendChild(new Shape('vector'));
  const partialVectorHost = partial.children.find((shape) => shape.name === 'event.real.2182.poster.cover.50-50');
  for (let index = 0; index < 4; index += 1) partialVectorHost.appendChild(new Shape('vector'));
  surface.penpot.currentFile.revn = 56;
  surface.storage = {};
  assert.equal(surface.board.children.length, 16);
  assert.equal(walk(surface.board).length - 1, 137);
  assert.equal(surface.components.length, 15);
  assert.equal(partial.children.length, 10, partial.children.map((shape) => shape.name).join(','));
  assert.equal(walk(partial).length - 1, 21);
  return surface;
}

test('V3 manifest and bounded scripts are hash-locked, filesystem-independent, and runtime-ID agnostic', async () => {
  assert.equal(manifest.readiness_marker, 'ASP_G19_P2_PAYLOAD_READY_V3');
  assert.equal(manifest.target.expected_baseline_revision, 56);
  assert.equal(manifest.target.accepted_board_id, BOARD_ID);
  assert.equal(manifest.target.accepted_board_name, BOARD_NAME);
  assert.equal(manifest.target.expected_initial_board_children, 16);
  assert.equal(manifest.target.expected_initial_board_descendants, 137);
  assert.equal(manifest.target.expected_initial_local_components, 15);
  assert.equal(manifest.expected_success.board_children, 18);
  assert.equal(manifest.expected_success.local_components, 18);
  assert.deepEqual(manifest.expected_card_components, EXPECTED_CASES);
  assert.equal(manifest.expected_leaf_components.length, 14);
  assert.equal(manifest.native_fonts.regular_400_variant, 'normal-400');
  assert.equal(manifest.native_fonts.bold_700_variant, 'normal-700');
  assert.equal(manifest.native_fonts.transient_runtime_ids_pinned, false);
  assert.equal(manifest.execution.mutator_order.length, 15);
  assert.ok(manifest.execution.maximum_generated_script_bytes < 65000);
  assert.equal(manifest.run_control.expected_writer_id, '/root/publish_r2');
  assert.match(manifest.run_control.geometry_proof_sha256, /^[0-9a-f]{64}$/);
  assert.equal(manifest.provenance_receipt_template.geometry_proof_digest, manifest.run_control.geometry_proof_sha256);
  assert.equal(manifest.provenance_receipt_template.requirements_contract_hash, manifest.run_control.contract_sha256);
  assert.equal(manifest.provenance_receipt_template.page_profile_hash, manifest.run_control.page_profile_sha256);
  assert.equal(manifest.provenance_receipt_template.asset_registry_hash, manifest.run_control.asset_registry_sha256);
  assert.equal(manifest.provenance_receipt_template.actor_id, manifest.run_control.expected_writer_id);
  assert.ok(manifest.execution.setup_order.includes('phase-02-verify-payload.js'));
  assert.ok(manifest.execution.setup_order.includes('phase-03-install-runtime.js'));
  for (const field of ['run_id','actor_type','actor_id','triggered_by','astro_repository','astro_commit','route','scenario','viewport','ui_sot_repository','ui_sot_commit','requirements_contract_hash','page_profile_hash','asset_registry_hash','materializer_name','materializer_version','materializer_commit','started_at','completed_at','final_state','penpot_file_id','penpot_page_id','penpot_frame_ids','mutation_count','mutated_object_ids','asset_binding_digest','geometry_proof_digest','validation_result','owner_review_state']) assert.ok(Object.hasOwn(manifest.provenance_receipt_template, field), field);
  assert.equal(manifest.asset_bindings.registry.sha256, manifest.run_control.asset_registry_sha256);
  assert.equal(manifest.requirements_contract.sha256, manifest.run_control.contract_sha256);
  assert.equal(manifest.page_profile.sha256, manifest.run_control.page_profile_sha256);
  for (const binding of [manifest.requirements_contract, manifest.page_profile, manifest.asset_bindings.registry]) {
    assert.match(binding.commit, /^[0-9a-f]{40}$/);
    assert.match(binding.gitBlobSha1, /^[0-9a-f]{40}$/);
    assert.match(binding.sha256, /^[0-9a-f]{64}$/);
  }
  for (const binding of Object.values(manifest.asset_bindings.actions)) {
    const bytes = await readFile(new URL(binding.path, ROOT));
    assert.equal(bytes.length, binding.bytes, binding.assetId);
    assert.equal(sha256(bytes), binding.sha256, binding.assetId);
    assert.equal(gitBlobSha1(bytes), binding.gitBlobSha1, binding.assetId);
    const input = manifest.inputs.find((row) => row.path === binding.path);
    assert.deepEqual(input && { sha256: input.sha256, bytes: input.bytes }, { sha256: binding.sha256, bytes: binding.bytes }, binding.assetId);
  }
  assert.equal(manifest.geometry_proof.proofPayloadSha256, manifest.run_control.geometry_proof_sha256);
  assert.match(manifest.geometry_proof.rawSha256, /^[0-9a-f]{64}$/);

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
  assert.doesNotMatch(combined, /\.detach\s*\(|createImageFromData|screenshot-as-design/i);
  assert.doesNotMatch(combined, /\b(?:require|import)\s*\(/);
  assert.match(combined, /normal-\$\{weight\}/);
});

test('read-only setup accepts the exact native revision-56 mixed-lineage baseline', async () => {
  const surface = await observedCurrentSurface();
  const installed = await installRuntime(surface);
  assert.equal(installed.installed, true);
  assert.equal(installed.preflight.mode, 'ACCEPTED_NATIVE_REVISION_56_MIXED_LINEAGE');
  assert.equal(installed.preflight.boardId, BOARD_ID);
  assert.equal(installed.preflight.boardChildren, 16);
  assert.equal(installed.preflight.boardDescendants, 137);
  assert.equal(installed.preflight.localComponents, 15);
  assert.deepEqual(installed.preflight.validation, []);
  assert.equal(installed.fontBinding.regular.runtimeFontId, RUNTIME_FONT_ID);
  assert.equal(installed.fontBinding.regular.variantId, 'normal-400');
  assert.equal(installed.fontBinding.bold.runtimeFontId, RUNTIME_FONT_ID);
  assert.equal(installed.fontBinding.bold.variantId, 'normal-700');
  assert.equal(surface.pageRoot.children.length, 1);
  assert.equal(surface.pageRoot.children[0], surface.board);
  assert.equal(surface.board.children.length, 16);
  assert.equal(surface.components.length, 15);
});

test('bounded phases build 14 linked leaves and all four exact accepted EventCards under only the existing board', async () => {
  const surface = await observedCurrentSurface();
  await installRuntime(surface);
  const receipts = [];
  for (const path of manifest.execution.mutator_order.slice(0, 4)) receipts.push(await executePath(`catalog/penpot-executor/g19/${path}`, surface));
  surface.penpot.currentFile.revn = 63;
  const legacyCard = surface.board.children.find((root) => root.getPluginData('kenigevents-g19-marker').startsWith('kenigevents:g19:p2:eventcard.desktop-wide-calendar.8006:v2'));
  const inheritedMedia = legacyCard.children.find((shape) => shape.name === 'media-link');
  const inheritedIcons = [];
  for (const action of legacyCard.children.filter((shape) => shape.name.startsWith('action.'))) {
    const icon = walk(action).find((shape) => shape.getPluginData('kenigevents-g19-child-marker').endsWith(':icon'));
    icon.setPluginData('kenigevents-g19-child-marker', icon.getPluginData('kenigevents-g19-child-marker').replace(':v2:', ':v3:'));
    icon.setPluginData('kenigevents-payload-sha256', manifest.payload_sha256);
    icon.pluginData.delete('kenigevents-instance-case-id');
    inheritedIcons.push(icon);
  }
  inheritedMedia.fills = [{ fillColor: '#ffffff', fillOpacity: 1 }];
  await assert.rejects(executePath('catalog/penpot-executor/g19/phase-p30-desktop-wide-shell.js', surface), (error) => error?.code === 'LINKED_MEDIA_FRAME_FILL_DRIFT');
  inheritedMedia.fills = [];
  inheritedIcons[0].setPluginData('kenigevents-instance-case-id', 'foreign-case');
  await assert.rejects(executePath('catalog/penpot-executor/g19/phase-p30-desktop-wide-shell.js', surface), (error) => error?.code === 'LINKED_ACTION_OVERRIDE_STATE_DRIFT');
  inheritedIcons[0].pluginData.delete('kenigevents-instance-case-id');
  for (const path of manifest.execution.mutator_order.slice(4).filter((path) => !path.startsWith('phase-p9'))) receipts.push(await executePath(`catalog/penpot-executor/g19/${path}`, surface));
  assert.ok(inheritedIcons.every((icon) => icon.getPluginData('kenigevents-instance-case-id') === 'eventcard.desktop-wide-calendar.8006'));
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
  const cases = [];
  const stale = await observedCurrentSurface(); stale.penpot.currentFile.revn = 55; cases.push([stale, /PENPOT_REVISION_BEFORE_ACCEPTED_BASELINE/]);
  const wrongBoard = await observedCurrentSurface(); wrongBoard.board.name = 'KenigEvents · G12 bounded L0–L3'; cases.push([wrongBoard, /PENPOT_ACCEPTED_BOARD_MISMATCH/]);
  const secondRoot = await observedCurrentSurface(); secondRoot.pageRoot.appendChild(new Shape('board')); cases.push([secondRoot, /PENPOT_ACCEPTED_BOARD_MISMATCH/]);
  const missingFont = await observedCurrentSurface(); missingFont.penpot.fonts.findByName = () => null; missingFont.penpot.fonts.findAllByName = () => []; cases.push([missingFont, /EXACT_NATIVE_FONT_VARIANT_MISSING/]);
  cases.push([fakeSurface({ revision: 41 }), /PENPOT_REVISION_BEFORE_ACCEPTED_BASELINE/]);
  for (const [surface, expected] of cases) {
    await assert.rejects(installRuntime(surface), expected);
  }
});

test('run control rejects cancellation, stale identity, and every pinned hash before the first mutation', async () => {
  const firstMutator = `catalog/penpot-executor/g19/${manifest.execution.mutator_order[0]}`;
  const cases = [
    null,
    { state: 'CANCEL_REQUESTED' },
    { run_id: 'stale-run' },
    { writer_id: '/root/not-the-publisher' },
    { contract_sha256: '0'.repeat(64) },
    { page_profile_sha256: '1'.repeat(64) },
    { asset_registry_sha256: '2'.repeat(64) },
    { geometry_proof_sha256: '3'.repeat(64) },
  ];
  for (const changes of cases) {
    const surface = await observedCurrentSurface();
    await installRuntime(surface);
    if (changes) replaceRunControl(surface, changes);
    else surface.sharedPluginData.delete('kenigevents\0asp-active-run-v1');
    await assert.rejects(executePath(firstMutator, surface), (error) => error?.code === 'MATERIALIZATION_RUN_NOT_ACTIVE');
    assert.equal(surface.board.children.length, 16, JSON.stringify(changes));
    assert.equal(surface.components.length, 15, JSON.stringify(changes));
  }
});

test('cancellation while native media creation is awaited blocks every subsequent write', async () => {
  const surface = fakeSurface();
  await installRuntime(surface, { synthesizeObservedBaseline: true });
  for (const path of manifest.execution.mutator_order.slice(0, 4)) await executePath(`catalog/penpot-executor/g19/${path}`, surface);
  surface.cancelDuringNextMediaCreate();
  await assert.rejects(executePath('catalog/penpot-executor/g19/phase-p30-desktop-wide-shell.js', surface), (error) => error?.code === 'MATERIALIZATION_RUN_NOT_ACTIVE');
  assert.equal(surface.mediaShapes.length, 1);
  const inFlightResult = surface.mediaShapes[0];
  assert.equal(inFlightResult.name, '');
  assert.equal(inFlightResult.parent, null);
  assert.equal(inFlightResult.pluginData.size, 0);
  assert.equal(surface.board.children.some((root) => root.children.includes(inFlightResult)), false);
  assert.equal(surface.undoCalls().begin, surface.undoCalls().finish);
});

test('phase reuse audits exact payload-owned content and performs no blind repair', async () => {
  const surface = await observedCurrentSurface();
  await installRuntime(surface);
  await executePath('catalog/penpot-executor/g19/phase-p10-desktop-leaves-a.js', surface);
  const admission = surface.components.find((component) => component.name === 'event.meta.admission.desktop.8006').mainInstance();
  admission.children[0].characters = 'drift';
  const undoBefore = surface.undoCalls();
  await assert.rejects(executePath('catalog/penpot-executor/g19/phase-p10-desktop-leaves-a.js', surface), /MANAGED_TEXT_CONTENT_OR_FONT_DRIFT/);
  assert.deepEqual(surface.undoCalls(), undoBefore);
  assert.equal(surface.board.children.length, 16);
  assert.equal(surface.components.length, 15);
});

test('an interrupted card-component registration resumes the exact marked shell without cleanup', async () => {
  const surface = fakeSurface({ failCardPathOnce: true });
  await installRuntime(surface, { synthesizeObservedBaseline: true });
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
  const surface = await observedCurrentSurface();
  const interruptedRoot = surface.board.children.find((shape) => shape.name === 'eventcard.desktop-packed-calendar-absent.2182');
  assert.equal(interruptedRoot.id, PRESERVED_PARTIAL_ROOT_ID);
  const p92Parent = walk(interruptedRoot).find((shape) => shape.getPluginData('kenigevents-instance-slot') === 'event-type');
  const p92Canary = p92Parent && walk(p92Parent).find((shape) => shape.getPluginData('kenigevents-g19-child-marker').includes('event.meta.event-type.desktop.8006') && shape.characters === 'выставка');
  assert.ok(p92Parent && p92Canary && p92Parent.component());
  const p92Component = p92Parent.component(), p92Main = p92Component.mainInstance();
  const nativeIds = ['313fb1ed-0d5c-8095-8008-914c79b02bd3', '313fb1ed-0d5c-8095-8008-914c79b02bd2', '313fb1ed-0d5c-8095-8008-912ba15885f1', '313fb1ed-0d5c-8095-8008-912ba088700e'];
  assert.ok(nativeIds.every((id) => !walk(surface.pageRoot).some((shape) => shape.id === id)));
  [p92Canary.id, p92Parent.id, p92Component.id, p92Main.id] = nativeIds;
  p92Main.setPluginData('kenigevents-component-id', p92Component.id);
  for (const shape of walk(surface.pageRoot).filter((shape) => shape.component?.()?.id === p92Component.id)) shape.setPluginData('kenigevents-linked-component-id', p92Component.id);
  assert.equal(new Set([...walk(surface.pageRoot).map((shape) => shape.id), ...surface.components.map((component) => component.id)]).size, walk(surface.pageRoot).length + surface.components.length);
  assert.equal(surface.board.children.length, 16);
  assert.equal(surface.components.length, 15);
  const preserved = new Map(surface.components.map((component) => [component.name, { componentId: component.id, rootId: component.mainInstance().id }]));
  assert.ok(surface.board.children.some((root) => root.name.startsWith('KenigEvents / G19 / Native component main /')));

  await installRuntime(surface);
  const firstP10 = await executePath('catalog/penpot-executor/g19/phase-p10-desktop-leaves-a.js', surface);
  assert.equal(firstP10.migration.accepted, true);
  assert.ok(firstP10.migration.legacyRootNames.every((name) => !name.includes('/')));
  const wrongPath = surface.components.find((candidate) => candidate.mainInstance().getPluginData('kenigevents-g19-marker').endsWith(':v3'));
  wrongPath.path = 'Wrong / Nonempty';
  await assert.rejects(executePath('catalog/penpot-executor/g19/phase-p10-desktop-leaves-a.js', surface), (error) => error?.code === 'COMPONENT_REGISTRATION_INCOMPLETE');
  wrongPath.path = '';
  for (const component of surface.components.filter((candidate) => candidate.mainInstance().getPluginData('kenigevents-g19-marker').endsWith(':v3'))) component.path = '';
  const postFailureIds = surface.board.children.map((root) => root.id);
  surface.penpot.currentFile.revn = 58;
  surface.storage = {};
  await installRuntime(surface);
  const receipts = await runAllPhases(surface);
  assert.equal(receipts[0].terminalState, 'SUCCEEDED_IDEMPOTENT_REUSE');
  assert.equal(receipts[0].mutations, 0);
  assert.deepEqual(receipts[0].readback.validation, []);
  const retriedNames = new Set(firstP10.created.map((row) => row.name));
  const retriedRows = receipts[0].readback.components.filter((row) => retriedNames.has(row.name));
  assert.equal(retriedRows.length, 4);
  assert.ok(retriedRows.every((row) => row.nativePath === '' && row.expectedPath === 'KenigEvents / G19 / EventCard 8006 / Leaves'));
  assert.deepEqual(surface.board.children.slice(0, 16).map((root) => root.id), postFailureIds);
  const final = receipts.at(-1).readback;
  assert.equal(final.board.childCount, 18);
  assert.equal(final.managedComponentCount, 18);
  assert.equal(final.acceptedCardRootCount, 4);
  assert.equal(final.inProgressRootCount, 0);
  assert.equal(final.routeLocalDuplicateMasterCount, 0);
  assert.equal(surface.board.children.find((shape) => shape.name === interruptedRoot.name).id, PRESERVED_PARTIAL_ROOT_ID);
  assert.deepEqual(final.auditIssues, []);
  assert.deepEqual(final.validation, []);
  const stableIds = surface.board.children.map((root) => root.id);
  assert.ok(walk(surface.board).length - 1 <= 248);
  while (walk(surface.board).length - 1 < 248) surface.board.children.at(-1).appendChild(new Shape('vector'));
  assert.equal(walk(surface.board).length - 1, 248);
  const managedText = surface.board.children.filter((root) => root.getPluginData('kenigevents-role') === 'accepted-card-master').flatMap(walk).filter((shape) => shape.type === 'text' && shape.characters);
  assert.equal(managedText.length, 38);
  for (const shape of managedText) shape.lineHeight = String(Number((Number(shape.fontSize) * Number(shape.lineHeight)).toFixed(6)));
  assert.ok(managedText.some((shape) => shape.textBounds.height > shape.height + 1));
  const lastRaw = managedText.at(-1).lineHeight;
  managedText.at(-1).lineHeight = String(Number(managedText.at(-1).fontSize) * 1.3);
  const rejectedMetrics = managedText.map((shape) => shape.lineHeight);
  await assert.rejects(executePath('catalog/penpot-executor/g19/phase-p91-text-metrics.js', surface), /P91_TEXT_METRIC_DRIFT/);
  assert.deepEqual(managedText.map((shape) => shape.lineHeight), rejectedMetrics);
  managedText.at(-1).lineHeight = lastRaw;
  const undoBeforeRepair = surface.undoCalls();
  const textRepair = await executePath('catalog/penpot-executor/g19/phase-p91-text-metrics.js', surface);
  assert.equal(textRepair.mutations, managedText.length);
  assert.deepEqual(textRepair.mutatedObjectIds, managedText.map((shape) => shape.id));
  assert.deepEqual(surface.undoCalls(), { begin: undoBeforeRepair.begin + 1, finish: undoBeforeRepair.finish + 1 });
  assert.deepEqual(surface.board.children.map((root) => root.id), stableIds);
  assert.ok(managedText.every((shape) => Number(shape.lineHeight) > 0 && Number(shape.lineHeight) < 3 && shape.textBounds.x >= shape.x - 1 && shape.textBounds.y >= shape.y - 1 && shape.textBounds.x + shape.textBounds.width <= shape.x + shape.width + 1 && shape.textBounds.y + shape.textBounds.height <= shape.y + shape.height + 1));
  const savesAfterRepair = surface.saveVersionCalls();
  const textReuse = await executePath('catalog/penpot-executor/g19/phase-p91-text-metrics.js', surface);
  assert.equal(textReuse.mutations, 0);
  assert.equal(surface.saveVersionCalls(), savesAfterRepair);
  for (const shape of managedText) shape.lineHeight = String(Number((Number(shape.fontSize) * Number(shape.lineHeight)).toFixed(6)));
  const savesBeforeCancelledSettle = surface.saveVersionCalls();
  const undoBeforeCancelledSettle = surface.undoCalls();
  const cancelTimer = setTimeout(() => replaceRunControl(surface, { state: 'CANCEL_REQUESTED' }), 10);
  await assert.rejects(executePath('catalog/penpot-executor/g19/phase-p91-text-metrics.js', surface), /MATERIALIZATION_RUN_NOT_ACTIVE/);
  clearTimeout(cancelTimer);
  assert.equal(surface.saveVersionCalls(), savesBeforeCancelledSettle);
  assert.deepEqual(surface.undoCalls(), { begin: undoBeforeCancelledSettle.begin + 1, finish: undoBeforeCancelledSettle.finish + 1 });
  assert.ok(managedText.every((shape) => Number(shape.lineHeight) < 3));
  replaceRunControl(surface, { state: 'ACTIVE' });
  const postCancelReuse = await executePath('catalog/penpot-executor/g19/phase-p91-text-metrics.js', surface);
  assert.equal(postCancelReuse.mutations, 0);
  assert.equal(surface.saveVersionCalls(), savesBeforeCancelledSettle);
  for (const shape of managedText.slice(0, 24)) {
    const bounds = shape.textBounds;
    shape._textBoundsOverride = { ...bounds, height: shape.height * 2 + 4 };
  }
  Object.assign(p92Canary, { x: 721.6249811202288, y: 566.172, width: 62.78099872350822, height: 14.000000178813934 });
  p92Canary._textBoundsOverride = { x: 721.6849975585938, y: 566.552001953125, width: 54.8800048828125, height: 27.40997314453125 };
  assert.equal(managedText.filter((shape) => shape.textBounds.height <= shape.height + 2).length, 14);
  surface.penpot.currentFile.revn = 74;
  const undoBeforeP92Negatives = surface.undoCalls();
  const correctCanaryId = p92Canary.id;
  p92Canary.id = 'wrong-canary-id';
  await assert.rejects(executePath('catalog/penpot-executor/g19/phase-p92-text-layout-canary.js', surface), /P92_CANARY_TARGET_DRIFT/);
  assert.deepEqual(surface.undoCalls(), undoBeforeP92Negatives);
  p92Canary.id = correctCanaryId;
  p92Canary.setPluginData('kenigevents-payload-sha256', '0'.repeat(64));
  await assert.rejects(executePath('catalog/penpot-executor/g19/phase-p92-text-layout-canary.js', surface), /P92_CANARY_TEXT_IDENTITY_DRIFT/);
  assert.deepEqual(surface.undoCalls(), undoBeforeP92Negatives);
  p92Canary.setPluginData('kenigevents-payload-sha256', manifest.payload_sha256);
  replaceRunControl(surface, { state: 'CANCEL_REQUESTED' });
  await assert.rejects(executePath('catalog/penpot-executor/g19/phase-p92-text-layout-canary.js', surface), /MATERIALIZATION_RUN_NOT_ACTIVE/);
  assert.deepEqual(surface.undoCalls(), undoBeforeP92Negatives);
  replaceRunControl(surface, { state: 'ACTIVE' });
  const p92UndoBefore = surface.undoCalls(), savesBeforeP92 = surface.saveVersionCalls();
  const p92 = await executePath('catalog/penpot-executor/g19/phase-p92-text-layout-canary.js', surface);
  assert.equal(p92.terminalState, 'SUCCEEDED_CANARY_PENDING_READBACK');
  assert.deepEqual(p92.mutatedObjectIds, [p92Canary.id]);
  assert.equal(p92Canary.growType, 'auto-width');
  assert.deepEqual(surface.undoCalls(), { begin: p92UndoBefore.begin + 1, finish: p92UndoBefore.finish + 1 });
  assert.equal(surface.saveVersionCalls(), savesBeforeP92);
  await assert.rejects(executePath('catalog/penpot-executor/g19/readback-p92-text-layout-canary.js', surface), /P92_CANARY_NOT_IMPROVED/);
  delete p92Canary._textBoundsOverride; // model Penpot's documented later-execution layout settle
  const settledP92Readback = await executePath('catalog/penpot-executor/g19/readback-p92-text-layout-canary.js', surface);
  assert.equal(settledP92Readback.improved, true);
  assert.equal(settledP92Readback.withinRoot, true);
  const p92Reuse = await executePath('catalog/penpot-executor/g19/phase-p92-text-layout-canary.js', surface);
  assert.equal(p92Reuse.mutations, 0);
  assert.equal(p92Reuse.terminalState, 'CANARY_ALREADY_APPLIED_PENDING_READBACK');
  assert.equal(surface.storage.g19EventCard8006P92Canary, undefined);
  assert.equal(surface.saveVersionCalls(), savesBeforeP92);
  assert.ok(surface.board.children.every((root) => root.getPluginData('kenigevents-g19-marker').endsWith(':v3')));
  assert.ok(surface.board.children.flatMap(walk).filter((shape) => shape.getPluginData('kenigevents-payload-sha256')).every((shape) => shape.getPluginData('kenigevents-payload-sha256') === manifest.payload_sha256));
  assert.ok(surface.board.children.flatMap(walk).filter((shape) => shape.getPluginData('kenigevents-g19-child-marker')).every((shape) => shape.getPluginData('kenigevents-g19-child-marker').includes(':v3:')));
  for (const [name, ids] of preserved) {
    const component = surface.components.find((candidate) => candidate.name === name);
    assert.deepEqual({ componentId: component.id, rootId: component.mainInstance().id }, ids, name);
  }
  const migratedText = surface.board.children.flatMap(walk).filter((shape) => shape.type === 'text' && !shape.hidden);
  assert.ok(migratedText.every((shape) => (shape.id === p92Canary.id ? shape.growType === 'auto-width' : shape.growType === 'fixed') && typeof shape.fontSize === 'string' && typeof shape.lineHeight === 'string' && typeof shape.letterSpacing === 'string'));
  assert.ok(surface.components.filter((component) => component.name.startsWith('event.media-frame.')).every((component) => component.mainInstance().fills.length === 0));
});

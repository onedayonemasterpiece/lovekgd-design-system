import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildPayload, generate } from '../scripts/round-trip-reconstruction/generate-penpot-visual-executor-g10.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = path.join(ROOT, 'catalog/penpot-executor/g10/capsule/penpot-visual-executor.g10.js');

function control(overrides = {}) {
  return {
    schema: 'KENIGEVENTS_ASP_EXECUTION_CONTROL_V2', generation: 10, state: 'ACTIVE',
    body_sha256: 'dc7d5b190e88d86dc8967d02d9544c6917c5473de519f77621abc58873916d4a',
    branch: 'w2-penpot-visual-executor-g10', run_id: 'test-run-g10',
    lease: { owner: 'W2', scope: 'ordinary-penpot-visual-phase-b-executor-g10', binding_id: 'g10-w2-visual' },
    cancellation: { cancelled: false },
    accepted_bundles: { 'eventcard-free-slice.g4.ready-v1': { authorization: 'ACCEPTED_FOR_PHASE_B_PRODUCTION', source_state: 'READY_FOR_W0_PROMOTION', bundle_sha256: '600362047b24df707712598c6ccf2b79047aad62a143afbfdb41daa103a5351d' } },
    target: { file_id: 'fake-file', page_id: 'fake-page' }, ...overrides,
  };
}

function fakeSurface(options = {}) {
  let id = 0;
  let reads = 0;
  let lastMutationRead = -1;
  const mutationReads = [];
  const all = [];
  const targets = new WeakMap();
  const components = [];
  const values = new Map([['kenigevents.asp.execution-control.g10', JSON.stringify(control())]]);
  const mutation = (kind) => {
    if (reads <= lastMutationRead) throw new Error(`mutation_without_fresh_control:${kind}`);
    lastMutationRead = reads;
    mutationReads.push({ kind, reads });
    if (options.failMutationAt && mutationReads.length === options.failMutationAt) throw new Error('injected_write_failure');
  };
  function shape(type, data = {}) {
    const raw = {
      id: `shape-${++id}`, type, name: '', x: 0, y: 0, width: 0, height: 0, children: [], parent: null,
      plugin: new Map(), characters: data.characters, svg: data.svg,
      resize(w, h) { mutation(`resize:${this.id}`); this.width = w; this.height = h; },
      addFlexLayout() {
        mutation(`addFlexLayout:${this.id}`);
        const flexTarget = {};
        const flex = new Proxy(flexTarget, { set(target, key, value) { mutation(`flex:${raw.id}:${String(key)}`); target[key] = value; return true; } });
        raw.flex = flex;
        return flex;
      },
      appendChild(child) { mutation(`append:${child.id}`); if (child.parent) child.parent.children = child.parent.children.filter((x) => x !== child); child.parent = this; this.children.push(child); },
      setPluginData(key, value) { mutation(`plugin:${this.id}:${key}`); this.plugin.set(key, value); },
      getPluginData(key) { return this.plugin.get(key) || ''; },
      remove() { mutation(`remove:${this.id}`); if (options.incompleteRollback && ['eventcard-master', 'evidence-level'].includes(this.plugin.get('kenigevents-kind'))) throw new Error('injected_remove_failure'); if (this.parent) this.parent.children = this.parent.children.filter((x) => x !== this); },
      isComponentCopyInstance() { return Boolean(this.componentId); },
      component() { return components.find((x) => x.id === this.componentId) || null; },
    };
    const proxy = new Proxy(raw, { set(target, key, value) { if (!['width', 'height', 'parent', 'children', 'componentId', 'sourceSemanticKey'].includes(String(key))) mutation(`set:${target.id}:${String(key)}`); target[key] = value; return true; } });
    targets.set(proxy, raw);
    all.push(proxy);
    return proxy;
  }
  const root = shape('root');
  const page = { id: 'fake-page', name: 'G10', root };
  const penpot = {
    version: 'fake-ordinary-1', currentFile: { id: 'fake-file' }, currentPage: page,
    localStorage: {
      getItem(key) {
        reads += 1;
        if (key === 'kenigevents.asp.execution-control.g10') {
          const parsed = JSON.parse(values.get(key));
          if (options.cancelAtRead && reads >= options.cancelAtRead) parsed.cancellation.cancelled = true;
          if (options.driftAtRead && reads >= options.driftAtRead) parsed.generation = 11;
          return JSON.stringify(parsed);
        }
        return values.get(key) || null;
      },
      setItem(key, value) { values.set(key, value); },
    },
    history: { undoBlockBegin() { return Symbol('block'); }, undoBlockFinish() {} },
    createBoard() { mutation('createBoard'); return shape('board'); },
    createRectangle() { mutation('createRectangle'); return shape('rectangle'); },
    createText(value) { mutation('createText'); return shape('text', { characters: value }); },
    createShapeFromSvg(svg) { mutation('createShapeFromSvg'); return shape('vector', { svg }); },
    async uploadMediaData(name, bytes, mimeType) { mutation('uploadMediaData'); return { id: `image-${name}`, name, width: 1, height: 1, mimeType, bytes, data() { return bytes; } }; },
    async openPage() {},
    library: { local: {
      components,
      createComponent(shapes) {
        mutation('createComponent');
        const main = Array.isArray(shapes) ? shapes[0] : shapes;
        const component = {
          id: `component-${++id}`, name: '', mainInstance() { return main; },
          instance() { mutation(`componentInstance:${this.id}`); const copy = shape('component-copy'); copy.componentId = this.id; copy.sourceSemanticKey = main.getPluginData('kenigevents-semantic-key'); return copy; },
        };
        components.push(component);
        return component;
      },
    } },
  };
  const walk = (node, visit) => { if (visit(node)) return node; for (const child of node.children || []) { const found = walk(child, visit); if (found) return found; } return null; };
  const penpotUtils = {
    findShape(predicate) { return walk(root, predicate); },
    setParentXY(target, x, y) { mutation(`setParentXY:${target.id}`); const raw = targets.get(target); raw.x = x; raw.y = y; },
  };
  return { penpot, penpotUtils, all, components, values, mutationReads, get reads() { return reads; } };
}

async function execute(surface) {
  const source = fs.readFileSync(SCRIPT, 'utf8');
  return Function('penpot', 'penpotUtils', 'atob', source)(surface.penpot, surface.penpotUtils, globalThis.atob);
}

test('generator is byte deterministic and capsule has no forbidden runtime surface', () => {
  const first = generate().manifest;
  const bytes = fs.readFileSync(SCRIPT);
  const second = generate().manifest;
  assert.deepEqual(second, first);
  assert.deepEqual(fs.readFileSync(SCRIPT), bytes);
  const source = bytes.toString('utf8');
  for (const forbidden of first.forbidden_runtime_surface) assert.equal(source.includes(forbidden), false, forbidden);
  assert.match(source, /penpot\.createBoard/);
  assert.match(source, /penpotUtils\.findShape/);
  assert.match(source, /penpotUtils\.setParentXY/);
});

test('ordinary-Penpot capsule builds exact visual hierarchy, assets, cases and groups', async () => {
  generate();
  const payload = buildPayload();
  const surface = fakeSurface();
  const receipt = await execute(surface);
  assert.equal(receipt.terminal_state, 'COMPLETED', JSON.stringify(receipt.failure));
  assert.equal(receipt.case_roots.length, 14);
  assert.deepEqual(receipt.evidence_roots.map((x) => x.level), ['L0_ASSETS', 'L1_LEAVES']);
  assert.deepEqual(receipt.group_roots.map((x) => x.group_id), Object.keys(payload.groups));
  assert.ok(surface.mutationReads.length > 100);
  const byKey = (key) => surface.all.find((x) => x.getPluginData?.('kenigevents-semantic-key') === key);
  for (const spec of payload.direct_cases) {
    const root = byKey(`case.${spec.case_id}`);
    assert.ok(root, spec.case_id);
    assert.equal(root.width, spec.geometry.width);
    assert.equal(root.height, spec.geometry.height);
    assert.equal(root.borderRadius, spec.geometry.radii[0]);
    assert.equal(root.clipContent, spec.geometry.clipping);
    assert.equal(root.flex.dir, 'column');
    assert.equal(root.flex.rowGap, spec.geometry.grid_gap);
    assert.equal(root.flex.columnGap, spec.geometry.grid_gap);
    const title = byKey(`case.${spec.case_id}.title`);
    assert.equal(title.characters, spec.content.title);
    assert.equal(title.fontFamily, spec.typography.family);
    assert.equal(title.fontSize, String(spec.typography.title_size));
    const occurrence = byKey(`case.${spec.case_id}.occurrence`);
    assert.equal(occurrence.characters, spec.content.occurrence);
    assert.equal(occurrence.characters.includes('\n'), spec.content.occurrence.includes('\n'));
    const media = byKey(`case.${spec.case_id}.media`);
    assert.equal(media.fills[0].fillImage.name, spec.media.sha256);
    assert.equal(media.fills[0].fillImageScale, spec.crop.recommended_fit);
    assert.equal(media.fills[0].fillImagePositionX, spec.crop.focal_point.x);
    assert.equal(media.fills[0].fillImagePositionY, spec.crop.focal_point.y);
    for (const action of ['share', 'like', 'not_interested', 'calendar']) {
      assert.equal(Boolean(byKey(`case.${spec.case_id}.action.${action}`)), spec.actions.includes(action));
    }
    const utility = byKey(`case.${spec.case_id}.utility-row`);
    assert.ok(utility);
    assert.equal(utility.parent, root);
    assert.equal(utility.flex.dir, 'row');
    assert.equal(utility.flex.columnGap, spec.geometry.utility_gap);
    assert.ok(spec.actions.every((action) => byKey(`case.${spec.case_id}.action.${action}`).parent === utility));
  }
  for (const [name, asset] of Object.entries(payload.assets)) {
    const action = name.replace('action-', '').replace('-outline', '').replace('-add', '').replace('.svg', '').replace('-', '_');
    if (!['share', 'favorite', 'not_interested', 'calendar'].includes(action)) continue;
    const semanticAction = action === 'favorite' ? 'like' : action;
    const vector = byKey(`component.event.action.${semanticAction}.vector`);
    assert.ok(vector);
    assert.equal(vector.svg, asset.svg);
    assert.equal(vector.getPluginData('asset-sha256'), asset.sha256);
  }
  for (const groupId of Object.keys(payload.groups)) {
    const group = byKey(groupId);
    assert.ok(group);
    assert.equal(group.flex.dir, groupId.includes('.desktop.') ? 'row' : 'column');
    const copies = group.children.filter((x) => x.type === 'component-copy');
    assert.equal(copies.length, payload.groups[groupId].fixture_ids.length);
    assert.ok(copies.every((x) => x.isComponentCopyInstance() && x.component()));
  }
  assert.ok(receipt.component_lineage.every((x) => x.linked));
});

test('second accepted run is idempotent with no duplicate roots/components/instances', async () => {
  generate();
  const surface = fakeSurface();
  const first = await execute(surface);
  assert.equal(first.terminal_state, 'COMPLETED', JSON.stringify(first.failure));
  const rootCount = surface.penpot.currentPage.root.children.length;
  const componentCount = surface.components.length;
  const second = await execute(surface);
  assert.equal(second.terminal_state, 'COMPLETED');
  assert.equal(second.created.length, 0);
  assert.equal(surface.penpot.currentPage.root.children.length, rootCount);
  assert.equal(surface.components.length, componentCount);
});

test('cancel and generation drift are reread between mutations and stop later writes', async () => {
  generate();
  for (const mode of ['cancelAtRead', 'driftAtRead']) {
    const surface = fakeSurface({ [mode]: 35 });
    const receipt = await execute(surface);
    assert.match(receipt.failure.code, mode === 'cancelAtRead' ? /RUN_CANCELLED/ : /CONTROL_NOT_ACTIVE_G10/);
    assert.ok(['FAILED_ROLLED_BACK', 'FAILED_PARTIAL_STATE'].includes(receipt.terminal_state));
    const mutationCount = surface.mutationReads.length;
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(surface.mutationReads.length, mutationCount);
  }
});

test('rollback receipt distinguishes complete rollback from unreverted partial state', async () => {
  generate();
  const rolled = await execute(fakeSurface({ failMutationAt: 45 }));
  assert.equal(rolled.terminal_state, 'FAILED_ROLLED_BACK');
  assert.ok(rolled.rolled_back_mutations.length > 0);
  const partial = await execute(fakeSurface({ failMutationAt: 80, incompleteRollback: true }));
  assert.equal(partial.terminal_state, 'FAILED_PARTIAL_STATE');
  assert.ok(partial.unreverted_mutations.length > 0);
});

test('production path fails closed for incomplete ordinary-Penpot primitives', async () => {
  generate();
  for (const missing of ['createBoard', 'uploadMediaData']) {
    const surface = fakeSurface();
    delete surface.penpot[missing];
    await assert.rejects(() => execute(surface), new RegExp(`PENPOT_PRIMITIVE_MISSING`));
  }
  const surface = fakeSurface();
  delete surface.penpotUtils.findShape;
  await assert.rejects(() => execute(surface), /PENPOT_UTIL_PRIMITIVE_MISSING/);
});

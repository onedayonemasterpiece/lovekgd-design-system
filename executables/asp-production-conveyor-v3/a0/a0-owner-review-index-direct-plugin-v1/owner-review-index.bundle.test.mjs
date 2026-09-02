import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import vm from 'node:vm';

const HERE = dirname(fileURLToPath(import.meta.url));
const BUNDLE_PATH = join(HERE, 'owner-review-index.bundle.js');
const PACKAGE_PATH = join(HERE, 'package.v1.json');
const HARNESS_PATH = join(HERE, 'test-deps/d0_plugin_bundle_conformance_v1.mjs');
const packageRecord = JSON.parse(await readFile(PACKAGE_PATH, 'utf8'));
const bundleBytes = await readFile(BUNDLE_PATH);
const bundleSource = bundleBytes.toString('utf8');
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

function makeNode(id, type = 'shape') {
  const data = new Map();
  return {
    id, type, name: '', x: 0, y: 0, width: 0, height: 0, children: [], parent: null, fills: [],
    appendChild(child) { child.parent = this; this.children.push(child); return child; },
    resize(width, height) { this.width = width; this.height = height; },
    setSharedPluginData(namespace, key, value) {
      if (typeof value !== 'string') throw new Error(`PLUGIN_DATA_NOT_STRING:${typeof value}`);
      data.set(`${namespace}\0${key}`, value);
    },
    getSharedPluginData(namespace, key) { return data.get(`${namespace}\0${key}`) || ''; },
  };
}

function buildPenpot() {
  let sequence = 0;
  const pages = [];
  const audit = { creates: 0 };
  const marker = new Map();
  const currentFile = {
    id: 'd0-conformance-file', revision: 1, pages,
    validate: () => [],
    setSharedPluginData(namespace, key, value) {
      if (typeof value !== 'string') throw new Error('PLUGIN_DATA_NOT_STRING');
      marker.set(`${namespace}\0${key}`, value);
    },
    getSharedPluginData(namespace, key) { return marker.get(`${namespace}\0${key}`) || ''; },
  };
  const penpot = {
    currentFile, currentPage: null, library: { local: { components: [] } },
    async openPage(page) { assert.ok(pages.includes(page)); this.currentPage = page; },
    createPage() { const page = makeNode(`page-${++sequence}`, 'page'); page.root = makeNode(`page-root-${sequence}`, 'root'); pages.push(page); audit.creates += 1; return page; },
    __seedPage(id) { const page = makeNode(id, 'page'); page.root = makeNode(`${id}-root`, 'root'); pages.push(page); return page; },
  };
  const create = (type, text) => {
    assert.ok(penpot.currentPage, `CURRENT_PAGE_REQUIRED:${type}`);
    const node = makeNode(`${type}-${++sequence}`, type);
    if (text !== undefined) node.characters = String(text);
    audit.creates += 1;
    return node;
  };
  penpot.createBoard = () => create('board');
  penpot.createRectangle = () => create('rectangle');
  penpot.createText = (text) => create('text', text);
  return { penpot, audit, nodeFactory: makeNode };
}

function loadBundle() {
  const sandbox = { console, crypto: globalThis.crypto, TextEncoder, TextDecoder, Uint8Array, ArrayBuffer, Blob, URL, setTimeout, clearTimeout };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox, { codeGeneration: { strings: false, wasm: false } });
  new vm.Script(bundleSource, { filename: BUNDLE_PATH }).runInContext(sandbox, { timeout: 3000 });
  return sandbox.D0A0OwnerReviewIndexV1;
}

async function hostFixture() {
  const bundle = loadBundle();
  const { penpot, audit, nodeFactory } = buildPenpot();
  const host = await bundle.conformance.createHost({ penpot, storage: Object.create(null), pluginNode: nodeFactory });
  return { bundle, host, penpot, audit };
}

function activeMarker(host) {
  return JSON.parse(host.penpot.currentFile.getSharedPluginData('kenigevents', 'asp-active-run-v1'));
}
function writeActive(host, value) {
  host.penpot.currentFile.setSharedPluginData('kenigevents', 'asp-active-run-v1', JSON.stringify(value));
}

test('exact source and Atlas R2 binding are preserved', async () => {
  assert.equal(packageRecord.package_id, 'A0-PAGE-AUX-OWNER_REVIEW_INDEX-R1');
  assert.equal(packageRecord.immutable_source.head, '4edc859861fba3f18fab0e65e9d2e8c0a7394bdb');
  assert.equal(packageRecord.immutable_source.tree, '3132550212222ec3dea716710821e732ad0d92bb');
  assert.equal(packageRecord.immutable_source.package_sha256, '2317c3eb024cfc00f0f65f8e274c8f2fbfaf4fa4d0138e35e6f9fcbf703dbdb2');
  assert.equal(packageRecord.immutable_source.index_record_sha256, '6165ee48dab45d4af16e7e7907c5068dd51d2f1ac1468a81f33eb079379d6892');
  assert.equal(packageRecord.immutable_source.review_keys_sha256, '999588112510a5936a3c2a4498bf99e5c9d196eee2ff528c97b88d098a32f442');
  assert.equal(packageRecord.requirements_contract.version, '1.1.0');
  assert.equal(packageRecord.requirements_contract.sha256, '54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72');
  assert.equal(packageRecord.atlas_r2.head, '663be702d481972cb2e8863af500f1c35dda1d8c');
  assert.equal(packageRecord.atlas_r2.tree, 'cf9a1e6a5e0a84aea5636334dbd3be4961039b75');
  assert.equal(packageRecord.atlas_r2.template_id, 'OWNER_INDEX_V2');
  assert.equal(packageRecord.atlas_r2.page_order, '0000');
  assert.equal(packageRecord.atlas_r2.physical_page_name, 'A0 · Owner Review Index · Candidate');
  assert.equal(packageRecord.source_bound_content.rows, 42);
  assert.equal(packageRecord.source_bound_content.row_authority, 'ATLAS_R2_PAGE_UNITS');
  assert.equal(packageRecord.source_bound_content.atlas_page_units_sha256, '8035a658a6293ceb1329abf2e49d6aff7d66778ab7c7e0fd136d94f8db23cbd4');
  assert.equal(packageRecord.source_bound_content.donor_rows_ignored, 45);
  assert.equal(packageRecord.terminal_census.root_height, 2528);
  assert.equal(packageRecord.terminal_census.bottommost_content_y, 2464);
  assert.equal(packageRecord.source_bound_content.placeholders, 0);
  assert.equal(sha256(bundleBytes), packageRecord.bundle.sha256);
});

test('deterministic regeneration and exact shared harness pass', () => {
  const regen = JSON.parse(execFileSync(process.execPath, [join(HERE, 'generate-bundle.mjs'), '--check'], { encoding: 'utf8' }));
  assert.equal(regen.state, 'DETERMINISTIC_REGENERATION_PASS');
  const receipt = JSON.parse(execFileSync(process.execPath, [HARNESS_PATH, '--bundle', BUNDLE_PATH, '--sha256', packageRecord.bundle.sha256, '--global', packageRecord.global], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }));
  assert.equal(receipt.state, 'D0_PLUGIN_BUNDLE_CONFORMANCE_V1_PASS');
  assert.equal(receipt.package_id, packageRecord.package_id);
  assert.equal(receipt.bundle_sha256, packageRecord.bundle.sha256);
  assert.equal(receipt.first_run.created, 349);
  assert.equal(receipt.settlement_receipt.mutation_count, 349);
  assert.equal(receipt.settlement_receipt.mutated_stable_ids.length, 348);
  assert.equal(receipt.settlement_receipt.provenance.requirements_contract_sha256, '54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72');
  assert.equal(receipt.settlement_receipt.rows, 42);
  assert.equal(receipt.settlement_receipt.atlas_page_units, 42);
  assert.equal(receipt.settlement_receipt.atlas_page_units_sha256, '8035a658a6293ceb1329abf2e49d6aff7d66778ab7c7e0fd136d94f8db23cbd4');
  assert.equal(receipt.settlement_receipt.row_authority, 'ATLAS_R2_PAGE_UNITS');
  assert.equal(receipt.settlement_receipt.linked_atlas_headers, 1);
  assert.equal(receipt.settlement_receipt.detached, 0);
  assert.equal(receipt.settlement_receipt.screenshots, 0);
  assert.equal(receipt.settlement_receipt.placeholders, 0);
  assert.equal(receipt.settlement_receipt.overlaps, 0);
  assert.equal(receipt.settlement_receipt.outside_root, 0);
  assert.deepEqual(receipt.settlement_receipt.validation, []);
  assert.equal(receipt.replay.created, 0);
  assert.equal(receipt.current_page.all_non_page_creates_activated, true);
  assert.ok(receipt.plugin_data.rejected_non_string_writes >= 5);
});

test('ACTIVE cancellation, expiry, provenance drift and unknown outcomes fail before native creates', async () => {
  for (const scenario of ['cancel', 'expiry', 'provenance', 'unknown']) {
    const { bundle, host, audit } = await hostFixture();
    const before = audit.creates;
    const marker = activeMarker(host);
    if (scenario === 'cancel') writeActive(host, { ...marker, cancelled: true });
    if (scenario === 'expiry') {
      host.authorization.expires_at = '2000-01-01T00:00:00.000Z';
      writeActive(host, { ...marker, expires_at: host.authorization.expires_at });
    }
    if (scenario === 'provenance') writeActive(host, { ...marker, task_id: 'different-task' });
    if (scenario === 'unknown') host.storage.unknown_outcome = { operation: 'prior-unknown-create' };
    const pattern = scenario === 'cancel' ? /PHYSICAL_ACTIVE_CANCELLED/ : scenario === 'expiry' ? /AUTHORIZATION_EXPIRED/ : scenario === 'provenance' ? /PHYSICAL_ACTIVE_TUPLE_MISMATCH:task_id/ : /DISTINCT_READ_ONLY_SETTLEMENT_REQUIRED/;
    await assert.rejects(() => bundle.execute(host), pattern);
    assert.equal(audit.creates, before, `${scenario} created native nodes`);
  }
});

test('protected projection drift fails closed before native creates', async () => {
  const { bundle, host, audit } = await hostFixture();
  const freePage = host.penpot.currentFile.pages.find((page) => page.id === bundle.source.protected.free.page_id);
  const protectedRoot = freePage.root.children.find((node) => node.id === bundle.source.protected.free.root_ids[0]);
  protectedRoot.name = 'DRIFTED_PROTECTED_FREE_ROOT';
  const before = audit.creates;
  await assert.rejects(() => bundle.execute(host), /PROTECTED_FREE_DRIFT/);
  assert.equal(audit.creates, before);
});

test('Atlas R2 physical page rows stay exact, ordered, pending and non-placeholder', () => {
  const bundle = loadBundle();
  assert.equal(bundle.source.rows.length, 42);
  assert.deepEqual([...bundle.source.rows].map((row) => row.order), Array.from({ length: 42 }, (_, index) => index + 1));
  assert.equal(new Set(bundle.source.rows.map((row) => row.page_order)).size, 42);
  assert.equal(new Set(bundle.source.rows.map((row) => row.atlas_page_id)).size, 42);
  assert.equal(bundle.source.rows.map((row) => row.page_order).join('\n'), [...bundle.source.rows].map((row) => row.page_order).sort().join('\n'));
  assert.ok(bundle.source.rows.every((row) => row.package_id && row.template_id && row.projection_role));
  assert.ok(bundle.source.rows.every((row) => row.v0_status === 'PENDING_V0'));
  assert.equal(bundle.source.atlas.page_units_sha256, '8035a658a6293ceb1329abf2e49d6aff7d66778ab7c7e0fd136d94f8db23cbd4');
  assert.equal(bundle.source.page.height, 2528);
  assert.equal(bundle.source.atlas.bottommost_content_y, 2464);
  assert.ok(!bundleSource.toLowerCase().includes('labels-only'));
  assert.equal(bundle.metadata.atlas_template, 'OWNER_INDEX_V2');
  assert.equal(bundle.metadata.row_authority, 'ATLAS_R2_PAGE_UNITS');
  assert.equal(bundle.metadata.placeholder_nodes, 0);
});

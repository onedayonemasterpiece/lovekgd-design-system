import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import test from 'node:test';
import vm from 'node:vm';

const bundleUrl = new URL('./home.d0.bundle.js', import.meta.url);
const packageUrl = new URL('./package.v2.json', import.meta.url);
const sourceUrl = new URL('./source/home.producer.bundle.js', import.meta.url);
const harnessUrl = new URL('./test-deps/d0_plugin_bundle_conformance_v1.mjs', import.meta.url);
const bytes = readFileSync(bundleUrl);
const manifest = JSON.parse(readFileSync(packageUrl, 'utf8'));
const digest = (value) => createHash('sha256').update(value).digest('hex');

test('immutable producer input and generated identity are exact', () => {
  const producer = readFileSync(sourceUrl);
  assert.equal(producer.length, 143409);
  assert.equal(digest(producer), '592235ea0ea909b887d1bcf8654c9c38c5469ee5753b5bdc5b080954c15a81cf');
  assert.equal(bytes.length, manifest.bundle.bytes);
  assert.equal(digest(bytes), manifest.bundle.sha256);
});

test('Atlas R2 Home binding and source-bound UI are exact', () => {
  assert.deepEqual(
    [manifest.atlas_r2.head, manifest.atlas_r2.tree, manifest.atlas_r2.atlas_page_id,
      manifest.atlas_r2.page_order, manifest.atlas_r2.template_id],
    ['663be702d481972cb2e8863af500f1c35dda1d8c',
      'cf9a1e6a5e0a84aea5636334dbd3be4961039b75',
      'archetype-archetype-home', '0260', 'ARCHETYPE_DESKTOP_MOBILE_V2']
  );
  assert.deepEqual(manifest.atlas_r2.root, {width: 2624, height: 1472});
  assert.deepEqual(manifest.atlas_r2.desktop, {slot_x: 64, actual_x: 144, width: 1280, height: 800});
  assert.deepEqual(manifest.atlas_r2.mobile, {slot_x: 1568, actual_x: 1581, width: 390, height: 844});
  assert.match(bytes.toString(), /Куда пойти — без лишнего шума/);
  assert.match(bytes.toString(), /Предметные страсти\. Натюрморт XX века/);
  assert.equal(manifest.source_bound_ui.authority, 'EXACT_RUNTIME_TEXT_TRANSCRIPTION_NO_SCREENSHOT_IMPLEMENTATION');
  assert.equal(manifest.boundaries.penpot_mutations, 0);
});

test('generation is deterministic', () => {
  const result = spawnSync(process.execPath, ['generate.mjs', '--check'], {
    cwd: new URL('.', import.meta.url), encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /DETERMINISTIC_REGENERATION_PASS/);
});

test('frozen shared harness proves current-page activation, <=3 creates and replay0', () => {
  const result = spawnSync(process.execPath, [harnessUrl.pathname,
    '--bundle', bundleUrl.pathname, '--sha256', manifest.bundle.sha256,
    '--global', manifest.bundle.global], {encoding: 'utf8'});
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const receipt = JSON.parse(result.stdout);
  assert.equal(receipt.state, 'D0_PLUGIN_BUNDLE_CONFORMANCE_V1_PASS');
  assert.equal(receipt.first_run.created, 21);
  assert.equal(receipt.replay.created, 0);
  assert.equal(receipt.current_page.all_non_page_creates_activated, true);
  assert.equal(receipt.plugin_data.rejected_non_string_writes, 5);
  assert.deepEqual(receipt.settlement_receipt.validation, []);
});

test('cancel, expiry and provenance mismatch stop before native execution', async () => {
  const context = {console, TextEncoder, TextDecoder, Uint8Array, Map, Set, Date, JSON, Promise};
  context.globalThis = context;
  vm.runInNewContext(bytes.toString(), context, {filename: bundleUrl.pathname});
  const api = context.D0A0HomeDirectPluginV2;
  const base = {
    schema: 'kenigevents.asp-active-run.v1', package_id: 'A0-DIRECT-PLUGIN-HOME-V1',
    run_id: 'd31a61dc-1808-457d-af3c-abf66b426757', writer_id: '/root/publish_r2',
    lease_token: 'd3c94e67c922aab6422b539e08b152d5998c3784e7300fd7b6cc18ee63ea807d',
    cancel_token: '885b60e47fe02c84fa433008d8bfbac784380e3742ec9099f78c40801b6807ef',
    session_id: 'session', task_id: 'task', bundle_sha256: 'a'.repeat(64),
    expires_at: '2999-01-01T00:00:00.000Z'
  };
  let creates = 0;
  const attempt = async (authorization, marker) => {
    const host = {authorization, penpot: {
      currentFile: {getSharedPluginData: () => JSON.stringify(marker)},
      createPage: () => { creates++; }, createBoard: () => { creates++; },
      createRectangle: () => { creates++; }, createText: () => { creates++; }
    }};
    await api.execute(host);
  };
  await assert.rejects(attempt(base, {...base, state: 'ACTIVE', cancelled: true}), /ACTIVE_CANCELLED/);
  await assert.rejects(attempt({...base, expires_at: '2000-01-01T00:00:00.000Z'},
    {...base, expires_at: '2000-01-01T00:00:00.000Z', state: 'ACTIVE', cancelled: false}), /AUTH_EXPIRED/);
  await assert.rejects(attempt(base, {...base, bundle_sha256: 'b'.repeat(64), state: 'ACTIVE', cancelled: false}),
    /ACTIVE_TUPLE:bundle_sha256/);
  assert.equal(creates, 0);
});

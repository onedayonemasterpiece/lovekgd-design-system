import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import test from 'node:test';
import vm from 'node:vm';

const bundleUrl = new URL('./home.v3.bundle.js', import.meta.url);
const manifestUrl = new URL('./package.v3.json', import.meta.url);
const sourceUrl = new URL('./source/home.producer.bundle.js', import.meta.url);
const harnessUrl = new URL('./test-deps/d0_plugin_bundle_conformance_v1.mjs', import.meta.url);
const bytes = readFileSync(bundleUrl);
const source = readFileSync(sourceUrl);
const manifest = JSON.parse(readFileSync(manifestUrl, 'utf8'));
const digest = (value) => createHash('sha256').update(value).digest('hex');

test('latest immutable producer bytes and generated identity are exact', () => {
  assert.equal(source.length, 143409);
  assert.equal(digest(source), '592235ea0ea909b887d1bcf8654c9c38c5469ee5753b5bdc5b080954c15a81cf');
  assert.equal(manifest.producer_source.head, 'd29fc7dfb983635aba09740a1fd5f8c040334f0d');
  assert.equal(manifest.producer_source.tree, '5f5658034453c70ad8723ae54e60f399700c1ca9');
  assert.equal(bytes.length, manifest.bundle.bytes);
  assert.equal(digest(bytes), manifest.bundle.sha256);
});

test('Atlas R2 physical slots and Home source content are exact', () => {
  const a = manifest.atlas_r2;
  assert.deepEqual([a.head, a.tree, a.atlas_page_id, a.page_order, a.template_id], [
    '663be702d481972cb2e8863af500f1c35dda1d8c',
    'cf9a1e6a5e0a84aea5636334dbd3be4961039b75',
    'archetype-archetype-home', '0260', 'ARCHETYPE_DESKTOP_MOBILE_V2'
  ]);
  assert.deepEqual(a.root, {width: 2624, height: 1164});
  assert.deepEqual(a.header, {x: 64, y: 64, width: 2496, height: 128});
  assert.deepEqual(a.desktop, {slot_x: 64, actual_x: 144, y: 256, width: 1280, height: 800});
  assert.deepEqual(a.mobile, {slot_x: 1568, actual_x: 1581, y: 256, width: 390, height: 844});
  assert.match(bytes.toString(), /Куда пойти — без лишнего шума/);
  assert.match(bytes.toString(), /Предметные страсти\. Натюрморт XX века/);
});

test('native composition consumes real linked dependencies, not summary placeholders', () => {
  assert.equal(manifest.native_composition.labels_only_forbidden, true);
  assert.equal(manifest.native_composition.dependency_substitute, false);
  assert.deepEqual(manifest.native_composition.linked_dependency_keys, [
    'shell.desktop-header', 'shell.footer', 'shell.mobile-header', 'shell.mobile-menu',
    'shell.mobile-bottom-navigation', 'home.hero-talk', 'home.quick-navigation',
    'home.cold-start-feed', 'event.card.large'
  ]);
  assert.match(bytes.toString(), /ATLAS_PAGE_HEADER_V2/);
  assert.doesNotMatch(bytes.toString(), /TextEncoder|crypto\.subtle/);
});

test('deterministic generation', () => {
  const result = spawnSync(process.execPath, ['generate.mjs', '--check'], {
    cwd: new URL('.', import.meta.url), encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /DETERMINISTIC_REGENERATION_PASS/);
});

test('shared harness proves physical census, bounded creates, protected scan and replay0', () => {
  const result = spawnSync(process.execPath, [harnessUrl.pathname, '--bundle', bundleUrl.pathname,
    '--sha256', manifest.bundle.sha256, '--global', manifest.bundle.global], {encoding: 'utf8'});
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const receipt = JSON.parse(result.stdout);
  assert.equal(receipt.state, 'D0_PLUGIN_BUNDLE_CONFORMANCE_V1_PASS');
  assert.deepEqual(receipt.settlement_receipt.validation, []);
  assert.deepEqual(receipt.settlement_receipt.physical_census, {
    candidate_roots: 1, atlas_headers: 1, evidence_slots: 1, component_masters: 2,
    linked_variant_instances: 2, native_dependency_links: 13, managed_outside_root: 0,
    placeholder_nodes: 0, screenshot_shapes: 0
  });
  assert.equal(receipt.first_run.created, 25);
  assert.equal(receipt.replay.created, 0);
  assert.equal(receipt.current_page.all_non_page_creates_activated, true);
  assert.equal(receipt.plugin_data.rejected_non_string_writes, 5);
});

test('full ACTIVE identity, revn and fresh projection parity fail before creates', async () => {
  const context = {console, Uint8Array, Map, Set, Date, JSON, Promise};
  context.globalThis = context;
  vm.runInNewContext(bytes.toString(), context, {filename: bundleUrl.pathname});
  const api = context.D0A0HomeDirectPluginV3;
  const base = {
    schema: 'kenigevents.asp-run-control.v1', package_id: 'A0-DIRECT-PLUGIN-HOME-V3',
    run_id: 'a0-home-v3-external-authorization', writer_id: '/root/publish_r2',
    lease_token: 'd3c94e67c922aab6422b539e08b152d5998c3784e7300fd7b6cc18ee63ea807d',
    cancel_token: '885b60e47fe02c84fa433008d8bfbac784380e3742ec9099f78c40801b6807ef',
    session_id: 'session', task_id: 'task', package_head: '1'.repeat(40), package_tree: '2'.repeat(40),
    bundle_sha256: '3'.repeat(64), projection_sha256: '4'.repeat(64), native_revision: 188,
    expires_at: '2999-01-01T00:00:00.000Z'
  };
  let creates = 0;
  const attempt = async (auth, marker = auth, projection = {file_id: '40e06342-8830-80d6-8008-8fc8a3a4cd4f', revn: 188, sha256: auth.projection_sha256}) => {
    const host = {authorization: auth, penpot: {currentFile: {revn: 188,
      getSharedPluginData: (_ns, key) => JSON.stringify(key === 'asp-active-run-v1' ?
        {...marker, state: marker.state || 'ACTIVE', cancelled: marker.cancelled ?? false} : projection)},
      createPage: () => { creates++; }, createBoard: () => { creates++; },
      createRectangle: () => { creates++; }, createText: () => { creates++; }}};
    await api.execute(host);
  };
  await assert.rejects(attempt({...base, package_id: 'A0-DIRECT-PLUGIN-HOME-V2'}), /AUTH_PACKAGE/);
  await assert.rejects(attempt({...base, native_revision: 187}), /AUTH_NATIVE_REVISION|ACTIVE_TUPLE/);
  await assert.rejects(attempt(base, base, {...base, file_id: '40e06342-8830-80d6-8008-8fc8a3a4cd4f', revn: 188, sha256: '5'.repeat(64)}), /AUTH_PROJECTION_PARITY/);
  await assert.rejects(attempt({...base, expires_at: '2000-01-01T00:00:00.000Z'}), /AUTH_EXPIRED/);
  await assert.rejects(attempt(base, {...base, cancelled: true}), /ACTIVE_CANCELLED/);
  assert.equal(creates, 0);
});

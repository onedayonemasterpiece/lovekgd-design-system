import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { MemoryLeaseStore, buildPlan, executeMaterialization, loadCanonicalInputs, sha256 } = require('../scripts/round-trip-reconstruction/materialization-execution-kernel.js');
const { canonicalJson } = require('../scripts/round-trip-reconstruction/resolved-case-loader.js');
const GENERATION = 3;
const MATERIALIZER_SHA = 'a'.repeat(64);
const ORDER = ['event.real.8006', 'event.real.8200', 'event.real.2182', 'event.real.6711', 'event.real.7609'];
const EVENT_CASES = ['eventcard.desktop-wide-calendar.8006', 'eventcard.desktop-packed-calendar-absent.2182', 'eventcard.mobile-wide-calendar.8006', 'eventcard.mobile-packed-calendar-absent.2182'];
const PAGE_CASES = ['free-collection.desktop.top', 'free-collection.desktop.scrolled', 'free-collection.desktop.full', 'free-collection.mobile.top', 'free-collection.mobile.scrolled', 'free-collection.mobile.full'];

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const bytes = `${JSON.stringify(value, null, 2)}\n`;
  fs.writeFileSync(filePath, bytes);
  return sha256(bytes);
}
function selfHash(value) { return sha256(canonicalJson({ ...value, content_sha256: null })); }
function createFixture(page = false) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'w2-materializer-g3-'));
  const allCases = [...EVENT_CASES, ...PAGE_CASES];
  const bindings = [];
  for (const caseId of allCases) {
    const document = { schema: 'kenigevents.resolved-render-case.v1', case_id: caseId, control_generation: 3, authority: { input_bindings: {}, generator: 'test' }, payload: { case_kind: caseId.startsWith('eventcard') ? 'eventcard' : 'page', scenario: {}, fixture_order: ORDER, groups: { events: ORDER.slice(0, 2), exhibitions: ORDER.slice(2) }, fixtures: [], assets: {}, geometry: {}, crop: {} }, content_sha256: null };
    document.content_sha256 = selfHash(document);
    const relative = `resolved/${caseId}.json`;
    const fileSha = writeJson(path.join(root, relative), document);
    bindings.push({ case_id: caseId, case_path: `cases/${caseId}.json`, resolved_case_path: relative, content_sha256: document.content_sha256, file_sha256: fileSha });
  }
  const index = { schema: 'kenigevents.resolved-render-case-index.v1', control_generation: 3, generator: 'test', input_manifest: 'test', astro_ref: 'f'.repeat(40), geometry_proof: { path: 'geometry.json', content_sha256: '1'.repeat(64), file_sha256: '2'.repeat(64) }, cases: bindings, content_sha256: null };
  index.content_sha256 = selfHash(index);
  const indexSha = writeJson(path.join(root, 'resolved/index.json'), index);
  const contractSha = writeJson(path.join(root, 'canonical/component.json'), { component_id: 'event.card' });
  const requiredCaseIds = page ? PAGE_CASES : EVENT_CASES;
  const scopes = requiredCaseIds.map((caseId) => ({ semantic_id: `${page ? 'page.free-collection' : 'event.card'}/${caseId}`, source_ref: `resolved-case:${caseId}`, target_binding: page ? 'page.free-collection' : 'event.card' }));
  const requiredBinding = page ? 'page.free-collection' : 'event.card';
  const bundle = { schema: 'kenigevents.immutable-materialization-bundle.v1', bundle_kind: page ? 'free-collection-page' : 'eventcard-free-slice', bundle_id: `bundle.g${GENERATION}.${page ? 'page' : 'card'}`, revision: 'r1', control_generation: GENERATION, promotion_state: 'PROMOTABLE', source_bindings: [{ role: 'resolved_case_index', path: 'resolved/index.json', format: 'json', sha256: indexSha }, { role: 'component_contract', path: 'canonical/component.json', format: 'json', sha256: contractSha }], required_case_ids: requiredCaseIds, materialization_scopes: scopes, dependencies: page ? [{ bundle_kind: 'eventcard-free-slice' }] : [], required_target_bindings: [requiredBinding], required_reuse_bindings: [requiredBinding] };
  writeJson(path.join(root, 'bundle.json'), bundle);
  const target = { schema: 'kenigevents.materialization-target.v1', file_scope: { semantic_id: 'kenigevents.ui', locator: 'new-file' }, page_scope: { semantic_id: 'bounded-scope', locator: 'new-page' }, bindings: { [requiredBinding]: 'semantic-owner' }, replacement_scopes: [{ semantic_id: scopes[0].semantic_id, locator: 'failed-root' }], expected_source_hashes: { resolved_case_index: indexSha, component_contract: contractSha } };
  const targetManifestPath = path.join(root, 'target.json');
  const targetHash = writeJson(targetManifestPath, target);
  const control = { schema: 'KENIGEVENTS_ASP_EXECUTION_CONTROL_V2', generation: GENERATION, status: 'ACTIVE', source: { repository: 'onedayonemasterpiece/lovekgd-design-system', ref: 'w2-materializer-execution-2a', sha: 'f'.repeat(40) }, cancellation: { binding_id: 'cancel.test' }, accepted_bundles: { [bundle.bundle_id]: bundle.revision }, target_manifest_sha256: targetHash };
  const controlPath = path.join(root, 'control.json'); writeJson(controlPath, control);
  const reuseMapPath = path.join(root, 'reuse.json'); writeJson(reuseMapPath, { schema: 'ASP_OLD_PENPOT_REUSE_MAP_V1', source_sha256: 'c'.repeat(64), semantic_mappings: { [requiredBinding]: 'semantic-reuse-binding' } });
  return { root, bundlePath: 'bundle.json', targetManifestPath, controlPath, reuseMapPath, target };
}
function options(fixture, overrides = {}) { return { ...fixture, mode: 'production', materializerSha256: MATERIALIZER_SHA, runId: 'run-test', now: () => new Date(0).toISOString(), ...overrides }; }
const acceptingCancellation = { read: async () => ({ generation: GENERATION, cancelled: false }) };
function createAdapter() { const roots = new Map(); const writes = []; return { roots, writes, lookup: async (key) => roots.get(key), write: async (operation) => { writes.push(operation); const value = { output_uuid: `output-${operation.sequence}` }; roots.set(operation.idempotence_key, value); return value; } }; }

test('canonical loading derives exact five-fixture order from one resolved case index', () => { const fixture = createFixture(); const loaded = loadCanonicalInputs(fixture); assert.deepEqual(loaded.order, ORDER); assert.deepEqual(buildPlan(loaded), buildPlan(loadCanonicalInputs(fixture))); assert.equal(loaded.resolvedCases.payloadHash.length, 64); });
test('bad resolved-case binding fails before lease and write', async () => { const fixture = createFixture(); fixture.target.expected_source_hashes.resolved_case_index = '0'.repeat(64); writeJson(fixture.targetManifestPath, fixture.target); let writes = 0; let leases = 0; const receipt = await executeMaterialization(options(fixture, { adapter: { lookup: async () => null, write: async () => { writes += 1; } }, leaseStore: { acquire: async () => { leases += 1; return { acquired: true }; }, release: async () => true }, cancellationProvider: acceptingCancellation })); assert.equal(receipt.terminal_state, 'FAILED_PREFLIGHT'); assert.equal(writes, 0); assert.equal(leases, 0); });
test('target UUID input identity fails closed', async () => { const fixture = createFixture(); fixture.target.file_scope.locator = '11111111-1111-4111-8111-111111111111'; writeJson(fixture.targetManifestPath, fixture.target); const receipt = await executeMaterialization(options(fixture)); assert.equal(receipt.preflight.code, 'TARGET_UUID_FORBIDDEN'); });
test('missing control and reuse inputs fail closed', async () => { for (const key of ['controlPath', 'reuseMapPath']) { const fixture = createFixture(); writeJson(fixture[key], {}); const receipt = await executeMaterialization(options(fixture)); assert.equal(receipt.terminal_state, 'FAILED_PREFLIGHT'); } });
test('one active lease refuses an overlapping run', async () => { const fixture = createFixture(); const leaseStore = new MemoryLeaseStore(); const adapter = createAdapter(); let unblock; let entered; const blocked = new Promise((resolve) => { unblock = resolve; }); const firstWrite = new Promise((resolve) => { entered = resolve; }); const blockingAdapter = { lookup: adapter.lookup, write: async (operation) => { entered(); await blocked; return adapter.write(operation); } }; const first = executeMaterialization(options(fixture, { runId: 'run-one', leaseStore, cancellationProvider: acceptingCancellation, adapter: blockingAdapter })); await firstWrite; const second = await executeMaterialization(options(fixture, { runId: 'run-two', leaseStore, cancellationProvider: acceptingCancellation, adapter })); assert.equal(second.terminal_state, 'SKIPPED_LEASE_HELD'); unblock(); assert.equal((await first).terminal_state, 'SUCCEEDED'); });
test('cancellation is reread immediately before every individual write', async () => { const fixture = createFixture(); const adapter = createAdapter(); let reads = 0; const receipt = await executeMaterialization(options(fixture, { leaseStore: new MemoryLeaseStore(), adapter, cancellationProvider: { read: async () => ({ generation: GENERATION, cancelled: ++reads === 2 }) } })); assert.equal(receipt.terminal_state, 'CANCELLED'); assert.equal(adapter.writes.length, 1); assert.deepEqual(receipt.cancellation_checks.map((check) => check.operation_sequence), [1, 2]); });
test('rerun reuses deterministic roots without duplicates', async () => { const fixture = createFixture(); const adapter = createAdapter(); const leaseStore = new MemoryLeaseStore(); const first = await executeMaterialization(options(fixture, { runId: 'run-first', adapter, leaseStore, cancellationProvider: acceptingCancellation })); const count = adapter.writes.length; const second = await executeMaterialization(options(fixture, { runId: 'run-second', adapter, leaseStore, cancellationProvider: acceptingCancellation })); assert.equal(first.terminal_state, 'SUCCEEDED'); assert.equal(adapter.writes.length, count); assert.equal(second.outputs.reused.length, second.ordered_write_operations.length); });
test('receipt includes resolved-case hash and complete page provenance', async () => { const fixture = createFixture(true); const receipt = await executeMaterialization(options(fixture, { adapter: createAdapter(), leaseStore: new MemoryLeaseStore(), cancellationProvider: acceptingCancellation })); assert.equal(receipt.terminal_state, 'SUCCEEDED'); assert.match(receipt.input_hashes.resolved_case_index, /^[a-f0-9]{64}$/); for (const key of ['control_generation','source','materializer_sha256','source_hashes','input_hashes','bundles','target_manifest_sha256','run','preflight','ordered_write_operations','cancellation_checks','outputs','cleanup_scope','idempotence_keys','execution','timestamps','terminal_state','receipt_sha256']) assert.ok(key in receipt, key); });

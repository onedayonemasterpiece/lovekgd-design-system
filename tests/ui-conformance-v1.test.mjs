import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  applicableException, changedScope, cleanupRuns, compareStructuralFacts,
  createComparisonArtifacts, createRunDirectory, finalStatus, makeRunManifest,
  prepareTelegramPublication, preflightTuple, readJson, sha256File,
  validateCase, validateExceptionRegistry, validateTelegramReadback, writeJson,
} from '../.codex/skills/ui-three-way-conformance/scripts/lib.mjs';

const repo = resolve(import.meta.dirname, '..');
const pilot = join(repo, 'catalog/ui-conformance/pilot-v1');
const buttonCase = readJson(join(pilot, 'core-button-primary-default.case.json'));
const eventCase = readJson(join(pilot, 'event-card-large-desktop.case.json'));
const registry = readJson(join(repo, 'catalog/ui-conformance/exception-registry.candidate.v1.json'));
const clone = (value) => structuredClone(value);
const imageConvert = (arguments_) => {
  const magick = spawnSync('magick', arguments_, { encoding: 'utf8' });
  return magick.error?.code === 'ENOENT' ? spawnSync('convert', arguments_, { encoding: 'utf8' }) : magick;
};
const readyTuple = (row) => ({
  component_id: row.component_id, contract_version: row.contract_version, contract_sha256: row.contract_sha256,
  state_key: row.state_key, fixture_id: row.fixture_id, fixture_sha256: row.fixture_sha256,
  fixture_snapshot_sha256: row.fixture_snapshot_sha256, viewport_id: row.viewport_id,
  viewport_width: row.viewport_width, viewport_height: row.viewport_height,
  container_width: row.container_width, device_scale_factor: row.device_scale_factor,
  font_loaded: true, font_manifest_sha256: row.penpot_binding.font_manifest_sha256,
  penpot_component_id: row.component_id, penpot_state_key: row.state_key,
  penpot_renderable_native_surface: true,
  penpot_fixture_id: row.fixture_id, penpot_fixture_sha256: row.fixture_sha256,
  penpot_fixture_snapshot_sha256: row.fixture_snapshot_sha256,
  penpot_resolved_render_case_sha256: row.fixture_id ? 'a'.repeat(64) : null,
  resolved_render_case_sha256: row.fixture_id ? 'a'.repeat(64) : null,
  expected_asset_manifest_sha256: row.asset_manifest_sha256,
  asset_manifest_sha256: row.asset_manifest_sha256,
  penpot_asset_manifest_sha256: row.asset_manifest_sha256,
  penpot_export_sha256: row.penpot_binding.export_sha256,
});

// Schema/validator positive and negative cases.
assert.deepEqual(validateCase(buttonCase), []);
const invalid = clone(buttonCase); invalid.penpot_binding.page_label = '25A';
assert(validateCase(invalid).some((message) => message.includes('page_label')));
const schemaCheck = spawnSync('python3', ['-c', `import json,jsonschema; jsonschema.validate(json.load(open(${JSON.stringify(join(pilot, 'core-button-primary-default.case.json'))})),json.load(open(${JSON.stringify(join(repo, 'contracts/ui-conformance/ui-conformance-case.v1.schema.json'))})))`], { encoding: 'utf8' });
assert.equal(schemaCheck.status, 0, schemaCheck.stderr);

// Exact tuple blockers.
assert.equal(preflightTuple(buttonCase, readyTuple(buttonCase)).status, 'READY_FOR_VISUAL_COMPARE');
const wrongContract = readyTuple(buttonCase); wrongContract.contract_sha256 = '0'.repeat(64);
assert.equal(preflightTuple(buttonCase, wrongContract).status, 'BLOCKED_IDENTITY_MISMATCH');
const wrongFixture = readyTuple(eventCase); wrongFixture.fixture_sha256 = '0'.repeat(64);
assert.equal(preflightTuple(eventCase, wrongFixture).status, 'BLOCKED_FIXTURE_MISMATCH');
const differentPenpotEvent = readyTuple(eventCase); differentPenpotEvent.penpot_fixture_id = 'event.real.7244';
assert.equal(preflightTuple(eventCase, differentPenpotEvent).status, 'BLOCKED_FIXTURE_MISMATCH');
const differentResolvedFixture = readyTuple(eventCase); differentResolvedFixture.penpot_resolved_render_case_sha256 = 'b'.repeat(64);
assert.equal(preflightTuple(eventCase, differentResolvedFixture).status, 'BLOCKED_FIXTURE_MISMATCH');
const documentationBoard = readyTuple(buttonCase); documentationBoard.penpot_renderable_native_surface = false;
assert.equal(preflightTuple(buttonCase, documentationBoard).status, 'BLOCKED_IDENTITY_MISMATCH');
const missingFont = readyTuple(buttonCase); missingFont.font_loaded = false;
assert.equal(preflightTuple(buttonCase, missingFont).status, 'BLOCKED_FONT_ENV');

// Structural comparison and expected deltas.
const equalFacts = { root: { width: 10, height: 10 }, regions: {}, typography: {}, icon_ids: [], region_order: [], nested_component_ids: [], media_fit: null, media_position: null, crop_window: null, state_markers: {} };
assert.equal(compareStructuralFacts(equalFacts, clone(equalFacts)).status, 'pass');
const drift = clone(equalFacts); drift.root.width = 12;
assert.equal(compareStructuralFacts(equalFacts, drift).status, 'fail');
assert.equal(compareStructuralFacts(equalFacts, drift, [{ region: 'root', property: 'width', expected: 12, reason: 'bounded candidate' }]).status, 'minor');
assert.equal(finalStatus({ preflight: { status: 'READY_FOR_VISUAL_COMPARE' }, structural: { status: 'fail' }, review: { verdict: 'pass' } }).status, 'fail');
assert.equal(finalStatus({ preflight: { status: 'BLOCKED_FONT_ENV' }, structural: { status: 'fail' }, review: { verdict: 'fail' } }).status, 'blocked');

// Exception scope/version rules.
assert.deepEqual(validateExceptionRegistry(registry), []);
const wild = clone(registry); wild.exceptions[0].state_scope = ['*'];
assert(validateExceptionRegistry(wild).length > 0);
const caseWithException = clone(eventCase); caseWithException.exception_ref = registry.exceptions[0].exception_id;
assert.equal(applicableException(caseWithException, registry), null, 'component/version mismatch must invalidate an exception');
const matchingRegistry = clone(registry); matchingRegistry.exceptions[0].component_id = caseWithException.component_id; matchingRegistry.exceptions[0].contract_version = caseWithException.contract_version;
assert(applicableException(caseWithException, matchingRegistry));
matchingRegistry.exceptions[0].contract_version = 'next-version'; assert.equal(applicableException(caseWithException, matchingRegistry), null);

// No-scale image comparison and immutable accepted inputs.
const temp = mkdtempSync(join(tmpdir(), 'ui-conformance-test-')); const imageRun = join(temp, 'images'); mkdirSync(imageRun);
for (const [name, size, color] of [['astro-source.png', '10x20', 'red'], ['penpot-reference.png', '20x10', 'blue']]) {
  const result = imageConvert(['-size', size, `xc:${color}`, join(temp, name)]); assert.equal(result.status, 0, result.stderr);
}
const acceptedBefore = sha256File(join(temp, 'penpot-reference.png'));
const metrics = createComparisonArtifacts({ astroPath: join(temp, 'astro-source.png'), penpotPath: join(temp, 'penpot-reference.png'), runDir: imageRun });
assert.deepEqual(metrics.astro_dimensions, { width: 10, height: 20 }); assert.deepEqual(metrics.penpot_dimensions, { width: 20, height: 10 });
assert.deepEqual(metrics.comparison_canvas, { width: 20, height: 20 }); assert.equal(metrics.no_automatic_scaling, true);
assert.equal(sha256File(join(temp, 'penpot-reference.png')), acceptedBefore, 'Astro actual must not update accepted reference');
const blockedReview = { verdict: 'blocked', findings: [{ region: 'tuple', severity: 'blocking', kind: 'fixture-mismatch', description: 'Comparison was not run.', evidence_files: ['preflight.json'] }], reviewed_files: ['astro.png'], reviewed_at: '2026-08-21T10:00:00Z', reviewer_kind: 'code-agent' };
const blockedReviewSchema = spawnSync('python3', ['-c', `import json,jsonschema; jsonschema.validate(${JSON.stringify(blockedReview)},json.load(open(${JSON.stringify(join(repo, 'contracts/ui-conformance/agent-review.v1.schema.json'))})))`], { encoding: 'utf8' });
assert.equal(blockedReviewSchema.status, 0, blockedReviewSchema.stderr);

// A mismatched fixture must never produce side-by-side, overlay, diff, or pixel comparison artifacts.
const blockedRun = join(temp, 'blocked-fixture-run'); mkdirSync(blockedRun);
const blockedTuple = readyTuple(eventCase); blockedTuple.penpot_fixture_id = 'event.real.7244';
const blockedTuplePath = join(temp, 'blocked-tuple.json'); const factsPath = join(temp, 'facts.json');
writeJson(blockedTuplePath, blockedTuple); writeJson(factsPath, equalFacts);
const blockedCompare = spawnSync('node', [join(repo, '.codex/skills/ui-three-way-conformance/scripts/ui-conformance.mjs'), 'compare',
  '--case', join(pilot, 'event-card-large-desktop.case.json'), '--actual-tuple', blockedTuplePath,
  '--astro', join(temp, 'astro-source.png'), '--astro-facts', factsPath, '--run-dir', blockedRun], { encoding: 'utf8' });
assert.equal(blockedCompare.status, 2, blockedCompare.stderr || blockedCompare.stdout);
assert.equal(readJson(join(blockedRun, 'structural-findings.json')).status, 'blocked');
assert.equal(readJson(join(blockedRun, 'pixel-metrics.json')).difference_ratio, null);
for (const forbidden of ['penpot.png', 'overlay-50.png', 'diff.png']) assert.equal(existsSync(join(blockedRun, forbidden)), false, `${forbidden} must not exist for a mismatched fixture`);

// Cleanup safety, keep/lock/durable, dry-run and disk-cap LRU.
assert.throws(() => cleanupRuns({ root: '/' }), /Unsafe artifact root/);
const cleanupRoot = join(temp, 'safe-artifacts-root'); mkdirSync(cleanupRoot);
const create = (id, createdAt, bytes = 10240) => { const dir = createRunDirectory(cleanupRoot, makeRunManifest({ runId: id, createdAt, retentionClass: 'failed-blocked-72h' })); writeFileSync(join(dir, 'payload.bin'), Buffer.alloc(bytes, 1)); return dir; };
const one = create('run-one', new Date('2026-08-01T00:00:00Z')); const two = create('run-two', new Date('2026-08-02T00:00:00Z')); const three = create('run-three', new Date('2026-08-03T00:00:00Z'));
writeFileSync(join(two, '.lock'), 'active\n'); const m3 = readJson(join(three, 'manifest.json')); m3.keep = true; writeJson(join(three, 'manifest.json'), m3);
const dry = cleanupRuns({ root: cleanupRoot, now: new Date('2026-08-10T00:00:00Z'), dryRun: true, allEphemeral: true }); assert(dry.removed.some((row) => row.name === 'run-one')); assert.equal(readJson(join(one, 'manifest.json')).run_id, 'run-one');
assert(dry.skipped.some((row) => row.name === 'run-two' && row.reason === 'active-lock')); assert(dry.skipped.some((row) => row.name === 'run-three' && row.reason === 'keep'));
const durable = create('run-durable', new Date('2026-08-01T00:00:00Z')); const dm = readJson(join(durable, 'manifest.json')); dm.durable = true; writeJson(join(durable, 'manifest.json'), dm);
assert(cleanupRuns({ root: cleanupRoot, now: new Date('2026-08-10T00:00:00Z'), dryRun: true, allEphemeral: true }).skipped.some((row) => row.name === 'run-durable'));
const lruRoot = join(temp, 'lru-artifacts-root'); mkdirSync(lruRoot);
for (const [id, day] of [['lru-one', 1], ['lru-two', 2], ['lru-three', 3]]) { const dir = createRunDirectory(lruRoot, makeRunManifest({ runId: id, createdAt: new Date(`2026-08-0${day}T00:00:00Z`), retentionClass: 'failed-blocked-72h' })); writeFileSync(join(dir, 'payload.bin'), Buffer.alloc(10240, day)); }
const lru = cleanupRuns({ root: lruRoot, now: new Date('2026-08-03T01:00:00Z'), dryRun: true, diskCapBytes: 15000 }); assert.deepEqual(lru.removed.map((row) => row.name), ['lru-one', 'lru-two']);

// Telegram is opt-in, deduplicated, read back, and fail-closed for untrusted CI.
const telegramRun = join(temp, 'telegram-run'); mkdirSync(telegramRun); writeFileSync(join(telegramRun, 'comparison-board.png'), readFileSync(join(temp, 'astro-source.png')));
const final = { status: 'blocked', reason: 'BLOCKED_FONT_ENV' };
const plan = prepareTelegramPublication({ runDir: telegramRun, caseRow: buttonCase, final, geometryBlockers: 1, pixelRatio: null, runId: 'telegram-run' }); assert.equal(plan.status, 'dry-run');
const untrusted = prepareTelegramPublication({ runDir: telegramRun, caseRow: buttonCase, final, geometryBlockers: 1, pixelRatio: null, runId: 'telegram-run', publish: true, targetVerified: true, trustedCI: false }); assert.equal(untrusted.status, 'blocked-untrusted-ci');
const dedup = prepareTelegramPublication({ runDir: telegramRun, caseRow: buttonCase, final, geometryBlockers: 1, pixelRatio: null, runId: 'telegram-run', publish: true, targetVerified: true, priorReceipts: [{ content_hash: plan.content_hash, read_back_status: 'verified', message_id: 2000 }] }); assert.equal(dedup.status, 'deduplicated');
const supersedes = prepareTelegramPublication({ runDir: telegramRun, caseRow: buttonCase, final, geometryBlockers: 1, pixelRatio: null, runId: 'telegram-run', publish: true, targetVerified: true, priorReceipts: [{ case_id: buttonCase.case_id, content_hash: '0'.repeat(64), read_back_status: 'verified', message_id: 1999 }] }); assert.equal(supersedes.supersedes_message_id, 1999);
const receipt = { schema_version: 'ui_conformance_telegram_readback_receipt_v1', topic_root_message_id: 1030, case_id: plan.case_id, run_id: plan.run_id, local_image_sha256: plan.image_sha256, caption_sha256: plan.caption_sha256, read_back_status: 'verified', message_id: 2001, message_link: 'https://t.me/c/4337049383/2001' };
assert.deepEqual(validateTelegramReadback(receipt, plan), []);

// Changed scope and the pinned real-event identity remain deterministic.
const caseRegistry = readJson(join(pilot, 'registry.v1.json')); assert(changedScope(['site/src/components/EventCard.astro'], caseRegistry).includes('pilot.event-card.large-desktop'));
const resolvedEvent = readJson(join(pilot, 'resolved/event-card-large-desktop.resolved-render-case.json'));
assert.equal(resolvedEvent.event_id, 5336); assert.equal(resolvedEvent.fixture_snapshot_sha256, eventCase.fixture_snapshot_sha256); assert.equal(resolvedEvent.fixture_sha256, eventCase.fixture_sha256);

process.stdout.write('ui-conformance-v1 tests: PASS\n');

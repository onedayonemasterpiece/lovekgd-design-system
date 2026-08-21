import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  cleanupRuns, compareStructuralFacts, createComparisonArtifacts, createRunDirectory,
  finalStatus, makeRunManifest, preflightTuple, prepareTelegramPublication, publicationRetentionClass, readJson,
  sha256File, stableJson, validateCase, validateTelegramReadback, writeJson,
} from '../.codex/skills/ui-three-way-conformance/scripts/lib.mjs';

const repo = resolve(import.meta.dirname, '..');
const corpusRoot = join(repo, 'catalog/fixtures/ui-reference-events/v1');
const casesDir = join(corpusRoot, 'cases');
const casePaths = [
  'event-card-large-landscape-crop-safe-7906-desktop.case.json',
  'event-card-large-portrait-poster-8156-desktop.case.json',
  'event-card-large-ocr-protected-4327-desktop.case.json',
  'event-card-large-multi-image-6628-desktop.case.json',
].map((name) => join(casesDir, name));
const cases = casePaths.map(readJson);
const corpus = readJson(join(corpusRoot, 'corpus.json'));
const assets = readJson(join(corpusRoot, 'assets-manifest.json'));
const surface = readJson(join(corpusRoot, 'surface-expectations.json'));
const sha = (value) => createHash('sha256').update(value).digest('hex');
const clone = structuredClone;
const canonicalSha = (value) => sha(`${stableJson(value)}\n`);
function makePng(path, color = 'red') {
  const result = spawnSync('magick', ['-size', '2x2', `xc:${color}`, path], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

function schemaValidate(instancePath, schemaPath) {
  const result = spawnSync('python3', ['-c', 'import json,jsonschema,sys; jsonschema.validate(json.load(open(sys.argv[1])),json.load(open(sys.argv[2])))', instancePath, schemaPath], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

// Corpus/event/assets/surface/case/component schemas.
schemaValidate(join(corpusRoot, 'corpus.json'), join(repo, 'contracts/ui-conformance/ui-reference-event-corpus.v1.schema.json'));
schemaValidate(join(corpusRoot, 'assets-manifest.json'), join(repo, 'contracts/ui-conformance/ui-reference-assets-manifest.v1.schema.json'));
schemaValidate(join(corpusRoot, 'surface-expectations.json'), join(repo, 'contracts/ui-conformance/ui-surface-expectations.v1.schema.json'));
schemaValidate(join(repo, 'catalog/ui-components/event-card-large/component-contract.v1.json'), join(repo, 'contracts/ui-components/component-contract.v1.schema.json'));
schemaValidate(join(repo, 'catalog/ui-components/event-card-large/penpot-materialization-ir.v1.json'), join(repo, 'contracts/ui-components/penpot-materialization-ir.v1.schema.json'));
for (const path of casePaths) schemaValidate(path, join(repo, 'contracts/ui-conformance/ui-conformance-case.v1.schema.json'));
for (const fixture of corpus.fixtures) schemaValidate(join(corpusRoot, fixture.payload_path), join(repo, 'contracts/ui-conformance/ui-reference-event.v1.schema.json'));

// Immutable corpus identity, frozen clock, deterministic selection and coverage.
assert.equal(corpus.immutable, true);
assert.deepEqual(corpus.reference_clock, { current_date: '2026-08-21', reference_iso: '2026-08-21T09:00:00+02:00', timezone: 'Europe/Kaliningrad' });
assert.deepEqual(corpus.fixtures.map((row) => row.event_id), [8156, 7906, 6399, 4327, 7888, 7807, 3132, 6628]);
const coverage = new Set(corpus.fixtures.flatMap((row) => row.coverage_tags));
for (const tag of ['reference-day','next-day','nearest-weekend','future-45-75d','long-running','landscape-crop-safe','portrait-poster','ocr-protected','multi-image','no-image','long-copy','admission-free','admission-price','admission-unavailable']) assert(coverage.has(tag), `missing coverage ${tag}`);
const corpusHashInput = clone(corpus); delete corpusHashInput.corpus_sha256;
assert.equal(canonicalSha(corpusHashInput), corpus.corpus_sha256);

// Exact event identity and full frozen PreviewEvent hash are joined, never chosen by similarity.
for (const fixture of corpus.fixtures) {
  const wrapper = readJson(join(corpusRoot, fixture.payload_path));
  assert.equal(wrapper.fixture_id, fixture.fixture_id);
  assert.equal(wrapper.preview_event.id, fixture.event_id);
  assert.equal(wrapper.preview_event.source_prod_id, fixture.source_prod_id);
  const py = spawnSync('python3', ['-c', 'import json,hashlib,sys; d=json.load(open(sys.argv[1]))["preview_event"]; print(hashlib.sha256((json.dumps(d,ensure_ascii=False,sort_keys=True,separators=(",",":"))+"\\n").encode()).hexdigest())', join(corpusRoot, fixture.payload_path)], { encoding: 'utf8' });
  assert.equal(py.status, 0, py.stderr);
  assert.equal(py.stdout.trim(), fixture.preview_event_sha256);
}

// Asset manifest integrity: exact bundled bytes, or exact content-addressed CDN key.
const assetsHashInput = clone(assets); delete assetsHashInput.assets_manifest_sha256;
assert.equal(canonicalSha(assetsHashInput), assets.assets_manifest_sha256);
for (const asset of assets.assets) {
  assert.match(asset.sha256, /^[a-f0-9]{64}$/u);
  assert(asset.byte_length > 0 && asset.width > 0 && asset.height > 0);
  if (asset.storage_mode === 'git-content-addressed-bundle') assert.equal(sha256File(join(corpusRoot, asset.bundle_relpath)), asset.sha256);
  else { assert.equal(asset.storage_mode, 'immutable-cdn'); assert.equal(asset.cdn_path_content_key, asset.sha256); }
}

// Surface expectations cover all required classes and never fake non-deterministic placement.
assert.deepEqual(new Set(surface.surface_classes), new Set(['event-detail','date-listing','today','tomorrow','weekend','home','popular','unusual','search','favorites','personal-feed','related']));
assert(surface.scenarios.length >= 24);
for (const row of surface.scenarios) {
  assert(corpus.fixtures.some((fixture) => fixture.fixture_id === row.fixture_id));
  assert(surface.surface_classes.includes(row.surface_id));
  if (['search','personal-feed','related','home','popular','unusual'].includes(row.surface_id) && row.expected_presence === 'not_implemented') assert.match(row.reason, /not|requires|recorded|resolver|fixture/i);
}

// Resolved case hash/state/content is exact and linked to the case and corpus.
for (const caseRow of cases) {
  assert.deepEqual(validateCase(caseRow), []);
  const resolved = readJson(join(corpusRoot, caseRow.resolved_case_path));
  schemaValidate(join(corpusRoot, caseRow.resolved_case_path), join(repo, 'contracts/ui-conformance/resolved-render-case.v1.schema.json'));
  const hashInput = clone(resolved); delete hashInput.resolved_render_case_sha256;
  assert.equal(canonicalSha(hashInput), resolved.resolved_render_case_sha256);
  assert.equal(caseRow.resolved_render_case_sha256, resolved.resolved_render_case_sha256);
  assert.equal(caseRow.fixture_id, resolved.event_fixture_id);
  assert.equal(caseRow.fixture_sha256, resolved.event_payload_sha256);
  assert.equal(caseRow.state_key, resolved.state_key);
  assert.equal(resolved.reference_clock.reference_iso, corpus.reference_clock.reference_iso);
  assert(resolved.resolved_nested_components.some((row) => row.component_id === 'event.media-frame'));
}

// Penpot binding tuple: pending is valid only without an export; bound requires exact board/export.
const pending = clone(cases[0]); assert.deepEqual(validateCase(pending), []);
const bound = clone(pending); Object.assign(bound.penpot_binding, { binding_status:'bound', board_or_component_id:'b0fe69fd-ccaf-8025-8008-844799eb2363', board_label:'Board 40.1aE.1', revision:1240, export_sha256:'a'.repeat(64) });
assert.deepEqual(validateCase(bound), []);
const invalidBound = clone(bound); invalidBound.penpot_binding.export_sha256 = null;
assert(validateCase(invalidBound).some((value) => value.includes('export_sha256')));

const readyTuple = (row) => ({
  component_id:row.component_id, contract_version:row.contract_version, contract_sha256:row.contract_sha256,
  state_key:row.state_key, viewport_id:row.viewport_id, viewport_width:row.viewport_width, viewport_height:row.viewport_height,
  container_width:row.container_width, device_scale_factor:row.device_scale_factor,
  fixture_id:row.fixture_id, fixture_sha256:row.fixture_sha256, fixture_snapshot_sha256:row.fixture_snapshot_sha256,
  penpot_component_id:row.component_id, penpot_state_key:row.state_key, penpot_renderable_native_surface:true,
  penpot_fixture_id:row.fixture_id, penpot_fixture_sha256:row.fixture_sha256, penpot_fixture_snapshot_sha256:row.fixture_snapshot_sha256,
  resolved_render_case_sha256:row.resolved_render_case_sha256, penpot_resolved_render_case_sha256:row.resolved_render_case_sha256,
  font_loaded:true, font_manifest_sha256:row.penpot_binding.font_manifest_sha256,
  expected_asset_manifest_sha256:row.asset_manifest_sha256, asset_manifest_sha256:row.asset_manifest_sha256, penpot_asset_manifest_sha256:row.asset_manifest_sha256,
  verified_assets:[{asset_id:'asset.test',expected_sha256:'b'.repeat(64),actual_sha256:'b'.repeat(64),byte_length:1}],
  penpot_export_sha256:row.penpot_binding.export_sha256,
});
assert.equal(preflightTuple(bound, readyTuple(bound)).status, 'READY_FOR_VISUAL_COMPARE');
const wrongFixture = readyTuple(bound); wrongFixture.penpot_fixture_id = 'event.real.7244'; assert.equal(preflightTuple(bound, wrongFixture).status, 'BLOCKED_FIXTURE_MISMATCH');
const wrongFont = readyTuple(bound); wrongFont.font_loaded = false; assert.equal(preflightTuple(bound, wrongFont).status, 'BLOCKED_FONT_ENV');
const wrongAsset = readyTuple(bound); wrongAsset.verified_assets[0].actual_sha256 = 'c'.repeat(64); assert.equal(preflightTuple(bound, wrongAsset).status, 'BLOCKED_ASSET_MISMATCH');

// Structural mismatch precedes agent/pixel optimism.
const facts = {root:{width:474,height:500},box_model:{},regions:{},typography:{},region_styles:{},icon_ids:[],region_order:[],nested_component_ids:[],media_fit:'cover',media_position:'50% 50%',crop_window:null,state_markers:{}};
const drift = clone(facts); drift.root.height = 644;
const structural = compareStructuralFacts(facts, drift); assert.equal(structural.status, 'fail');
assert.equal(finalStatus({preflight:{status:'READY_FOR_VISUAL_COMPARE'},structural,review:{verdict:'pass'}}).status, 'fail');

// Propagation audit permits findings only on fail/blocked, never on pass.
const passAudit = {schema_version:'propagation-audit.v1',source_resource:'event.card',affected_child_masters:[],affected_parent_masters:['event.card'],affected_instances:['instance'],detached_instances:[],forbidden_overrides:[],broken_variant_connections:[],stale_values:[],representative_exports:[{shape_id:'id',sha256:'a'.repeat(64)}],result:'pass'};
const auditDir = mkdtempSync(join(tmpdir(),'ui-audit-')); writeJson(join(auditDir,'pass.json'),passAudit); schemaValidate(join(auditDir,'pass.json'),join(repo,'contracts/ui-conformance/propagation-audit.v1.schema.json'));
const failAudit = clone(passAudit); failAudit.result='fail'; failAudit.stale_values=['calendar-present-when-absent']; writeJson(join(auditDir,'fail.json'),failAudit); schemaValidate(join(auditDir,'fail.json'),join(repo,'contracts/ui-conformance/propagation-audit.v1.schema.json'));
const invalidPass = clone(passAudit); invalidPass.forbidden_overrides=['padding']; writeJson(join(auditDir,'invalid.json'),invalidPass);
const invalidSchema = spawnSync('python3',['-c','import json,jsonschema,sys; jsonschema.validate(json.load(open(sys.argv[1])),json.load(open(sys.argv[2])))',join(auditDir,'invalid.json'),join(repo,'contracts/ui-conformance/propagation-audit.v1.schema.json')]); assert.notEqual(invalidSchema.status,0);

// Image comparison never scales or mutates the Penpot baseline.
const imageDir = mkdtempSync(join(tmpdir(),'ui-images-')); const sourceA=join(imageDir,'a.png'); const sourceB=join(imageDir,'b.png'); makePng(sourceA); makePng(sourceB);
const before=sha256File(sourceB); const metrics=createComparisonArtifacts({astroPath:sourceA,penpotPath:sourceB,runDir:join(imageDir,'run')}); assert.equal(metrics.no_automatic_scaling,true); assert.equal(sha256File(sourceB),before);

// Telegram dry-run, dedup and strict read-back.
const telegramDir=join(imageDir,'telegram'); mkdirSync(telegramDir); makePng(join(telegramDir,'comparison-board.png'),'blue');
const dry=prepareTelegramPublication({runDir:telegramDir,caseRow:bound,final:{status:'fail'},geometryBlockers:1,pixelRatio:0.5,runId:'test-run',publish:false,targetVerified:false,priorReceipts:[]}); assert.equal(dry.status,'dry-run');
assert(dry.caption.includes(`Event: ${bound.event_title}`));
const prior={case_id:bound.case_id,content_hash:dry.content_hash,read_back_status:'verified',message_id:123};
const dedup=prepareTelegramPublication({runDir:telegramDir,caseRow:bound,final:{status:'fail'},geometryBlockers:1,pixelRatio:0.5,runId:'test-run',publish:true,targetVerified:true,priorReceipts:[prior]}); assert.equal(dedup.status,'deduplicated');
const receipt={schema_version:'ui_conformance_telegram_readback_receipt_v1',chat_id:-1004337049383,topic_root_message_id:1030,message_id:555,message_link:'https://t.me/c/4337049383/555',supersedes_message_id:null,case_id:bound.case_id,run_id:'test-run',local_image_sha256:dedup.image_sha256,caption_sha256:dedup.caption_sha256,content_hash:dedup.content_hash,telegram_media_metadata:{},sent_at:'2026-08-21T10:00:00Z',read_back_at:'2026-08-21T10:01:00Z',read_back_status:'verified'};
assert.deepEqual(validateTelegramReadback(receipt,dedup),[]);
assert.equal(publicationRetentionClass('fail'),'failed-blocked-72h');
assert.equal(publicationRetentionClass('blocked'),'failed-blocked-72h');
assert.equal(publicationRetentionClass('pass'),'published-24h');

// Safe marker-backed cleanup only.
const cleanupRoot=join(mkdtempSync(join(tmpdir(),'ui-clean-')),'artifacts'); mkdirSync(cleanupRoot); const old=makeRunManifest({runId:'old-run',createdAt:new Date('2026-08-01T00:00:00Z')}); createRunDirectory(cleanupRoot,old); mkdirSync(join(cleanupRoot,'keep-me')); const report=cleanupRuns({root:cleanupRoot,now:new Date('2026-08-21T00:00:00Z'),olderThanHours:72,dryRun:false}); assert(report.removed.some((row)=>row.name==='old-run')); assert(existsSync(join(cleanupRoot,'keep-me')));

console.log(`ui-conformance-v1: PASS (${cases.length} exact EventCard cases, ${corpus.fixtures.length} immutable fixtures, ${assets.assets.length} asset rows)`);

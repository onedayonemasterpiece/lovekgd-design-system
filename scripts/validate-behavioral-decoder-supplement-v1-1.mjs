#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const EXPECTED_SCHEMA = 'current_ui_behavioral_decoder_v1_1';
const EXPECTED_REVIEW_SCHEMA = 'current_ui_behavioral_visual_review_v1_1';
const EXPECTED_ARTIFACT_SCHEMA = 'current_ui_behavioral_artifact_provenance_v1_1';
const EXPECTED_SUPPLEMENT_ID = 'behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc';
const EXPECTED_BASE_ID = 'decoder-v1-snapshot-20260808T124842-4786ac53bc';
const EXPECTED_BASE_PATH = '../decoder-v1-snapshot-20260808T124842-4786ac53bc';
const EXPECTED_BASE_MANIFEST_SHA = 'f7740f7f533c3f0cda5d4d0b8ebe98b565d7f521368b96462daecbd26522d5cc';
const EXPECTED_SOURCE_SHA = 'ef7aa62e45c60f7a12da6160f490719c0721ec03';
const EXPECTED_FINAL_STATUS = 'READY_FOR_PROJECT_NORMALIZATION_SYNTHESIS';
const EXPECTED_COUNTS = Object.freeze({
  plans: 50,
  executable: 45,
  explicitBlockers: 5,
  observations: 99,
  rasters: 99,
  reviews: 99,
});
const REQUIRED_FILES = Object.freeze([
  'action-packet-index.jsonl',
  'artifact-index.json',
  'artifact-receipt.json',
  'audit-report.md',
  'behavior-contracts.jsonl',
  'behavior-page-verification.jsonl',
  'behavior-specimen-observations.jsonl',
  'behavior-specimen-plan.jsonl',
  'breakpoint-and-container-matrix.jsonl',
  'dynamic-region-loading-matrix.jsonl',
  'experiment-registry.jsonl',
  'geometry-constraints.jsonl',
  'historical-variant-evidence.jsonl',
  'independent-audit.json',
  'interaction-state-machines.jsonl',
  'loading-recovery-states.jsonl',
  'manifest.json',
  'media-behavior.jsonl',
  'media-policy-matrix.jsonl',
  'overlays-disclosures-selection.jsonl',
  'positioning-sticky-fixed.jsonl',
  'receipt.json',
  'requirements-provenance-ledger.jsonl',
  'shelves-and-rails.jsonl',
  'unresolved.jsonl',
  'visual-review-ledger.jsonl',
]);

const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const readBuffer = (file) => fs.readFileSync(file);
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

function readJsonl(file) {
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      fail(`${path.basename(file)}:${index + 1}: ${error.message}`);
    }
  });
}

function walkFiles(root, current = root) {
  return fs.readdirSync(current, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) return walkFiles(root, absolute);
    return [path.relative(root, absolute).split(path.sep).join('/')];
  });
}

function assertUnique(rows, key, label) {
  const values = rows.map((row) => row[key]);
  assert(values.every((value) => typeof value === 'string' && value.length > 0), `${label}: missing ${key}`);
  assert(new Set(values).size === values.length, `${label}: duplicate ${key}`);
}

function assertBaseSnapshot(value, label) {
  assert(value?.snapshot_id === EXPECTED_BASE_ID, `${label}: immutable v1 id mismatch`);
  assert(value?.manifest_sha256 === EXPECTED_BASE_MANIFEST_SHA, `${label}: immutable v1 manifest mismatch`);
  if ('path' in (value || {})) assert(value.path === EXPECTED_BASE_PATH, `${label}: immutable v1 must be a sibling path`);
}

function assertStopBoundary(row, label) {
  assert(row.decision === 'NOT_MERGED', `${label}: merge decision escaped evidence boundary`);
  if ('normalization_allowed' in row) assert(row.normalization_allowed === false, `${label}: normalization was enabled`);
  if ('production_state_claimed' in row) assert(row.production_state_claimed === false, `${label}: controlled evidence was claimed as production`);
}

function assertArtifactMetadata(metadata, label, { requireAudit = true } = {}) {
  const actions = metadata.actions || {};
  assert(actions.repository === 'onedayonemasterpiece/events-bot-new', `${label}: unexpected Actions repository`);
  assert(typeof actions.workflow === 'string' && actions.workflow.length > 0, `${label}: workflow missing`);
  assert(actions.run_id && actions.run_attempt && actions.artifact_id, `${label}: Actions identity incomplete`);
  assert(/^https:\/\/github\.com\/onedayonemasterpiece\/events-bot-new\/actions\/runs\/[0-9]+$/u.test(actions.run_url || ''), `${label}: invalid Actions run URL`);
  assert(/^(?:https:\/\/github\.com\/onedayonemasterpiece\/events-bot-new\/|https:\/\/api\.github\.com\/repos\/onedayonemasterpiece\/events-bot-new\/actions\/artifacts\/)/u.test(actions.artifact_url || ''), `${label}: invalid Actions artifact URL`);
  assert(/^sha256:[a-f0-9]{64}$/u.test(actions.digest || ''), `${label}: Actions digest missing`);
  assert(Number(actions.bytes) > 0 && actions.created_at && actions.expires_at, `${label}: Actions size/timestamps incomplete`);

  const permanent = metadata.permanent_storage || {};
  assert(permanent.status === 'durable', `${label}: permanent evidence is not durable`);
  assert(permanent.release_tag && permanent.asset_id && permanent.asset_name, `${label}: release asset identity incomplete`);
  assert(/^https:\/\/github\.com\/onedayonemasterpiece\/events-bot-new\/releases\/(?:download|tag)\//u.test(permanent.url || ''), `${label}: permanent evidence is not a GitHub Release asset`);
  assert(/^[a-f0-9]{64}$/u.test(permanent.sha256 || '') && Number(permanent.bytes) > 0, `${label}: permanent evidence digest/size incomplete`);

  if (requireAudit) {
    const audit = metadata.independent_audit || {};
    assert(audit.status === 'PASS' && audit.reviewer && audit.commit, `${label}: independent audit is not PASS`);
    assert(/^[a-f0-9]{64}$/u.test(audit.report_sha256 || ''), `${label}: independent audit report digest missing`);
  }
}

function validateSupplement(root) {
  const manifestPath = path.join(root, 'manifest.json');
  const receiptPath = path.join(root, 'receipt.json');
  assert(fs.existsSync(manifestPath), 'manifest.json is missing');
  assert(fs.existsSync(receiptPath), 'receipt.json is missing');

  const manifest = readJson(manifestPath);
  const receipt = readJson(receiptPath);
  assert(manifest.schema_version === EXPECTED_SCHEMA && receipt.schema_version === EXPECTED_SCHEMA, 'behavioral schema mismatch');
  assert(manifest.supplement_id === EXPECTED_SUPPLEMENT_ID && receipt.supplement_id === EXPECTED_SUPPLEMENT_ID, 'supplement identity mismatch');
  assert(manifest.supplement_version === '1.1', 'supplement version mismatch');
  assert(manifest.source_sha === EXPECTED_SOURCE_SHA, 'exact source SHA mismatch');
  assert(manifest.status === EXPECTED_FINAL_STATUS && receipt.final_status === EXPECTED_FINAL_STATUS, 'normalization-synthesis gate is not ready');
  assert(receipt.status === 'complete' && (receipt.blockers || []).length === 0, 'receipt is incomplete');
  assert((manifest.blockers || []).length === 0, 'manifest still has readiness blockers');
  assert(receipt.manifest_sha256 === sha256(readBuffer(manifestPath)), 'receipt does not bind manifest bytes');
  assert(manifest.immutable_v1_modified === false, 'supplement claims immutable v1 mutation');
  assertBaseSnapshot(manifest.base_snapshot, 'manifest');

  const constraints = manifest.constraints || {};
  assert(constraints.append_only === true, 'supplement is not append-only');
  for (const key of ['component_deletion', 'component_merge', 'component_split', 'experiment_winner_decision', 'normalization', 'penpot', 'production_astro_css_js', 'tokens']) {
    assert(constraints[key] === false, `forbidden operation enabled: ${key}`);
  }

  const outputPaths = Object.keys(manifest.outputs || {}).sort();
  for (const relative of outputPaths) {
    assert(!relative.startsWith('/') && !relative.split('/').includes('..'), `unsafe output path: ${relative}`);
    const absolute = path.resolve(root, relative);
    assert(absolute.startsWith(`${path.resolve(root)}${path.sep}`), `output escaped supplement root: ${relative}`);
    assert(fs.existsSync(absolute) && fs.statSync(absolute).isFile(), `missing output: ${relative}`);
    const bytes = readBuffer(absolute);
    assert(bytes.byteLength === manifest.outputs[relative].bytes, `byte mismatch: ${relative}`);
    assert(sha256(bytes) === manifest.outputs[relative].sha256, `sha256 mismatch: ${relative}`);
    if (relative.endsWith('.jsonl')) {
      const rows = readJsonl(absolute);
      assert(rows.length === manifest.outputs[relative].records, `record count mismatch: ${relative}`);
    } else if (relative.endsWith('.json')) readJson(absolute);
  }
  const files = walkFiles(root).sort();
  assert(JSON.stringify(files) === JSON.stringify([...outputPaths, 'manifest.json', 'receipt.json'].sort()), 'supplement has missing, extra or unindexed compact files');
  for (const required of REQUIRED_FILES) assert(files.includes(required), `required compact evidence is missing: ${required}`);

  const plans = readJsonl(path.join(root, 'behavior-specimen-plan.jsonl'));
  const observations = readJsonl(path.join(root, 'behavior-specimen-observations.jsonl'));
  const pageVerification = readJsonl(path.join(root, 'behavior-page-verification.jsonl'));
  const actionPackets = readJsonl(path.join(root, 'action-packet-index.jsonl'));
  const reviews = readJsonl(path.join(root, 'visual-review-ledger.jsonl'));
  const unresolved = readJsonl(path.join(root, 'unresolved.jsonl'));
  assert(plans.length === EXPECTED_COUNTS.plans, `expected ${EXPECTED_COUNTS.plans} plans, found ${plans.length}`);
  assert(plans.filter((row) => row.capture_status === 'explicit-blocker').length === EXPECTED_COUNTS.explicitBlockers, 'explicit blocker count mismatch');
  assert(plans.filter((row) => row.capture_status === 'captured-and-reviewed').length === EXPECTED_COUNTS.executable, 'executable reviewed packet count mismatch');
  assert(observations.length === EXPECTED_COUNTS.observations, 'observation count mismatch');
  assert(pageVerification.length === EXPECTED_COUNTS.observations, 'page verification count mismatch');
  assert(actionPackets.length === EXPECTED_COUNTS.plans, 'action packet index count mismatch');
  assert(reviews.length === EXPECTED_COUNTS.reviews, 'full-resolution review count mismatch');
  for (const [key, expected] of Object.entries({
    behavior_packet_plans: EXPECTED_COUNTS.plans,
    executable_packets: EXPECTED_COUNTS.executable,
    explicit_blockers: EXPECTED_COUNTS.explicitBlockers,
    observations: EXPECTED_COUNTS.observations,
    page_verification: EXPECTED_COUNTS.observations,
    action_packet_index: EXPECTED_COUNTS.plans,
    visual_reviews: EXPECTED_COUNTS.reviews,
    rasters: EXPECTED_COUNTS.rasters,
  })) assert(manifest.counts?.[key] === expected, `manifest count mismatch: ${key}`);
  for (const [key, expected] of Object.entries({ plans: 50, observations: 99, rasters: 99, reviews: 99, explicit_blockers: 5 })) {
    assert(receipt.counts?.[key] === expected, `receipt count mismatch: ${key}`);
  }

  for (const [rows, label] of [[plans, 'plans'], [observations, 'observations'], [pageVerification, 'page verification'], [actionPackets, 'action packets'], [reviews, 'reviews'], [unresolved, 'unresolved']]) {
    assertUnique(rows, 'id', label);
    for (const row of rows) assertStopBoundary(row, `${label}/${row.id}`);
  }

  const planMap = new Map(plans.map((row) => [row.id, row]));
  const observationMap = new Map(observations.map((row) => [row.id, row]));
  const reviewMap = new Map(reviews.map((row) => [row.observation_id, row]));
  assert(reviewMap.size === reviews.length, 'duplicate observation in review ledger');
  for (const plan of plans) {
    assert(plan.source_sha === EXPECTED_SOURCE_SHA && plan.schema_version === 'current_ui_behavior_action_packet_v1_1', `${plan.id}: packet identity mismatch`);
    if (plan.capture_status === 'explicit-blocker') {
      assert(plan.review_status === 'not-applicable-no-raster' && plan.evidence_status === 'exact-blocker-recorded', `${plan.id}: blocker state mismatch`);
      assert(plan.blocker_id && plan.observation_ids.length === 0, `${plan.id}: blocker evidence mismatch`);
    } else {
      assert(plan.review_status === 'reviewed-full-resolution' && plan.evidence_status === 'captured-and-reviewed', `${plan.id}: packet review incomplete`);
      assert(plan.observation_ids.length === plan.expected_capture_phases.length && plan.observation_ids.length > 0, `${plan.id}: captured phase count mismatch`);
    }
  }
  for (const ratio of ['4:5', '5:4']) assert(plans.some((row) => row.ratios?.includes(ratio) && row.capture_status === 'captured-and-reviewed'), `missing reviewed ${ratio} evidence`);
  for (const id of ['behavior-packet.cta-editorial-stacked', 'behavior-packet.cta-split-inline', 'behavior-packet.media-primary-and-previews']) {
    assert(planMap.get(id)?.capture_status === 'captured-and-reviewed', `required event-detail evidence missing: ${id}`);
  }
  for (const treatment of ['departure-board-v1', 'route-strips-v1', 'next-departure-queue-v1']) {
    assert(plans.filter((row) => row.id.includes(`transport-${treatment}`) && row.capture_status === 'captured-and-reviewed').length === 2, `transport treatment pair missing: ${treatment}`);
  }

  for (const observation of observations) {
    assert(planMap.has(observation.plan_id), `${observation.id}: unknown plan`);
    assert(observation.source_sha === EXPECTED_SOURCE_SHA && observation.capture_status === 'captured', `${observation.id}: capture identity mismatch`);
    assert(observation.review_status === 'reviewed-full-resolution' && observation.evidence_status === 'captured-and-reviewed', `${observation.id}: review state incomplete`);
    assert(observation.screenshot?.perceptually_stable === true, `${observation.id}: raster is not perceptually stable`);
    assert(/^behavior-rasters\/[a-z0-9._-]+\.png$/u.test(observation.screenshot?.path || ''), `${observation.id}: unsafe raster path`);
    assert(/^[a-f0-9]{64}$/u.test(observation.screenshot?.sha256 || '') && Number(observation.screenshot?.bytes) > 0, `${observation.id}: raster identity incomplete`);
    const review = reviewMap.get(observation.id);
    assert(review?.schema_version === EXPECTED_REVIEW_SCHEMA, `${observation.id}: review schema mismatch`);
    assert(review.plan_id === observation.plan_id && review.path === observation.screenshot.path && review.sha256 === observation.screenshot.sha256, `${observation.id}: review/raster mismatch`);
    assert(review.review_status === 'reviewed-full-resolution' && review.full_resolution_opened === true, `${observation.id}: raster was not opened full resolution`);
    assert(review.visual_result !== null && review.visual_result !== undefined && review.visual_result !== '', `${observation.id}: visual result missing`);
    assert(review.reviewer && review.reviewed_at, `${observation.id}: visual reviewer provenance missing`);
  }
  assert(pageVerification.every((row) => observationMap.has(row.observation_id) && row.review_status === 'reviewed-full-resolution' && row.production_observed === false && row.production_equivalence === false), 'page-verification boundary or coverage mismatch');
  assert(actionPackets.every((row) => planMap.has(row.plan_id) && ['reviewed-full-resolution', 'not-applicable-no-raster'].includes(row.review_status)), 'action-packet index review mismatch');
  assert(unresolved.every((row) => row.blocks_ready !== true), 'unresolved readiness blocker remains');

  const humanReview = manifest.human_visual_review || {};
  assert(humanReview.required === true && humanReview.completed === true, 'human visual review is incomplete');
  assert(humanReview.perceptual_hash_is_not_review === true, 'human review/perceptual hash distinction missing');
  assert(humanReview.raster_count === 99 && humanReview.reviewed_raster_count === 99, 'human visual review coverage mismatch');
  assert(/^[a-f0-9]{64}$/u.test(humanReview.ledger_sha256 || ''), 'review ledger digest missing');

  const artifactIndex = readJson(path.join(root, 'artifact-index.json'));
  const artifactReceipt = readJson(path.join(root, 'artifact-receipt.json'));
  const independentAudit = readJson(path.join(root, 'independent-audit.json'));
  assert(artifactIndex.schema_version === EXPECTED_SCHEMA && artifactIndex.supplement_id === EXPECTED_SUPPLEMENT_ID, 'artifact index identity mismatch');
  assert(artifactIndex.status === 'reviewed-durable', 'artifact index is not reviewed/durable');
  assertBaseSnapshot(artifactIndex.base_snapshot, 'artifact index');
  assert(artifactReceipt.schema_version === EXPECTED_ARTIFACT_SCHEMA && artifactReceipt.supplement_id === EXPECTED_SUPPLEMENT_ID, 'artifact receipt identity mismatch');
  assert(artifactReceipt.status === 'complete' && artifactReceipt.secret_scan?.status === 'PASS', 'artifact receipt is incomplete or secret scan failed');
  assertBaseSnapshot(artifactReceipt.base_snapshot, 'artifact receipt');
  assert(artifactReceipt.source_sha === EXPECTED_SOURCE_SHA && artifactReceipt.review_count === 99 && artifactReceipt.raster_count === 99, 'artifact receipt evidence counts mismatch');
  assertArtifactMetadata(manifest.provenance, 'manifest provenance');
  assertArtifactMetadata(artifactIndex, 'artifact index', { requireAudit: false });
  assertArtifactMetadata(artifactReceipt, 'artifact receipt');
  assert(independentAudit.status === 'PASS' && independentAudit.reviewer && independentAudit.commit && /^[a-f0-9]{64}$/u.test(independentAudit.report_sha256 || ''), 'independent-audit.json is incomplete');

  const heavy = artifactIndex.entries?.filter((entry) => entry.storage === 'actions-and-permanent-heavy-artifact') || [];
  const compact = artifactIndex.entries?.filter((entry) => entry.storage === 'compact-supplement') || [];
  assert(heavy.length === 99, 'artifact index does not contain all 99 heavy rasters');
  assertUnique(heavy, 'path', 'heavy raster entries');
  assert(new Set(heavy.map((entry) => entry.observation_id)).size === 99, 'heavy raster observation references are not unique');
  for (const entry of heavy) {
    const observation = observationMap.get(entry.observation_id);
    assert(observation && entry.path === observation.screenshot.path && entry.sha256 === observation.screenshot.sha256 && entry.bytes === observation.screenshot.bytes, `heavy raster mismatch: ${entry.path}`);
    assert(entry.review_status === 'reviewed-full-resolution', `heavy raster review incomplete: ${entry.path}`);
  }
  const expectedCompactPaths = outputPaths.filter((relative) => relative !== 'artifact-index.json').sort();
  assert(JSON.stringify(compact.map((entry) => entry.path).sort()) === JSON.stringify(expectedCompactPaths), 'artifact index compact coverage mismatch');
  for (const entry of compact) {
    const bytes = readBuffer(path.join(root, entry.path));
    assert(entry.bytes === bytes.byteLength && entry.sha256 === sha256(bytes), `artifact index compact identity mismatch: ${entry.path}`);
  }
  assert(JSON.stringify(manifest.provenance.actions) === JSON.stringify(artifactIndex.actions) && JSON.stringify(artifactIndex.actions) === JSON.stringify(artifactReceipt.actions), 'Actions provenance copies diverged');
  assert(JSON.stringify(manifest.provenance.permanent_storage) === JSON.stringify(artifactIndex.permanent_storage) && JSON.stringify(artifactIndex.permanent_storage) === JSON.stringify(artifactReceipt.permanent_storage), 'permanent provenance copies diverged');
  assert(JSON.stringify(manifest.provenance.independent_audit) === JSON.stringify(artifactReceipt.independent_audit) && JSON.stringify(artifactReceipt.independent_audit) === JSON.stringify(independentAudit), 'independent audit copies diverged');

  const text = files.map((file) => readBuffer(path.join(root, file)).toString('utf8')).join('\n');
  assert(!/Authorization\s*:\s*Bearer\s+\S+/iu.test(text), 'authorization bearer leaked');
  assert(!/https?:\/\/[^\s"']+\/_review\/[A-Za-z0-9_-]{12,}/u.test(text), 'secret review URL leaked');
  assert(!/sb_(?:secret|publishable)_[A-Za-z0-9_-]{12,}/u.test(text), 'Supabase key value leaked');
  assert(!/(?:innerHTML|outerHTML)"\s*:\s*"</u.test(text), 'full HTML field leaked');

  return {
    status: 'valid',
    supplement_id: EXPECTED_SUPPLEMENT_ID,
    final_status: EXPECTED_FINAL_STATUS,
    files: files.length,
    outputs: outputPaths.length,
    plans: plans.length,
    executable_packets: EXPECTED_COUNTS.executable,
    explicit_blockers: EXPECTED_COUNTS.explicitBlockers,
    observations: observations.length,
    full_resolution_reviews: reviews.length,
  };
}

const root = path.resolve(process.argv[2] || `catalog/component-decoder/${EXPECTED_SUPPLEMENT_ID}`);
console.log(JSON.stringify(validateSupplement(root), null, 2));

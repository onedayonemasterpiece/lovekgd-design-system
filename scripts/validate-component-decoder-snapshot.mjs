#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const EXPECTED_SCHEMA = 'current_ui_component_decoder_v1';
const EXPECTED_VERDICT = 'GO_FOR_FAMILY_SCOPED_DEFRAGMENTATION';
const EXPECTED_SOURCE_SHA = 'ef7aa62e45c60f7a12da6160f490719c0721ec03';
const EXPECTED_DISPOSITIONS = new Set([
  'composition-layout',
  'dead-unreachable',
  'experiment-only',
  'lab-only',
  'needs-verification',
  'nonvisual',
  'production-ui',
  'support-data',
]);

const fail = (message) => {
  throw new Error(message);
};

const assert = (condition, message) => {
  if (!condition) fail(message);
};

const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const readBuffer = (file) => fs.readFileSync(file);
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

function walkFiles(root, current = root) {
  return fs.readdirSync(current, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) return walkFiles(root, absolute);
    return [path.relative(root, absolute).split(path.sep).join('/')];
  });
}

function readJsonl(file) {
  return fs.readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        fail(`${path.basename(file)}:${index + 1}: ${error.message}`);
      }
    });
}

function assertUnique(rows, key, label) {
  const values = rows.map((row) => row[key]);
  assert(values.every((value) => typeof value === 'string' && value.length > 0), `${label}: missing ${key}`);
  assert(new Set(values).size === values.length, `${label}: duplicate ${key}`);
}

function validateSnapshot(root) {
  const manifestPath = path.join(root, 'manifest.json');
  const receiptPath = path.join(root, 'receipt.json');
  assert(fs.existsSync(manifestPath), 'manifest.json is missing');
  assert(fs.existsSync(receiptPath), 'receipt.json is missing');

  const manifest = readJson(manifestPath);
  const receipt = readJson(receiptPath);
  assert(manifest.schema_version === EXPECTED_SCHEMA, 'unexpected manifest schema');
  assert(receipt.schema_version === EXPECTED_SCHEMA, 'unexpected receipt schema');
  assert(manifest.snapshot_id === receipt.snapshot_id, 'snapshot identity mismatch');
  assert(receipt.status === 'complete', 'snapshot receipt is not complete');
  assert(receipt.evidence_completion === 'complete', 'evidence is not complete');
  assert(receipt.handoff_status === 'GO', 'handoff is not GO');
  assert(receipt.verdict === EXPECTED_VERDICT, 'unexpected receipt verdict');
  assert(manifest.go_no_go?.status === 'GO', 'manifest gate is not GO');
  assert(manifest.go_no_go?.verdict === EXPECTED_VERDICT, 'unexpected manifest verdict');
  assert((manifest.go_no_go?.blockers || []).length === 0, 'manifest still has blockers');
  assert(Object.values(manifest.go_no_go?.gates || {}).every((value) => value === true), 'not all handoff gates passed');
  assert(sha256(readBuffer(manifestPath)) === receipt.manifest_sha256, 'receipt does not bind manifest bytes');

  const constraints = manifest.constraints || {};
  assert(constraints.as_is_only === true, 'AS-IS boundary is not asserted');
  assert(constraints.candidate_contracts_are_not_normative === true, 'candidate authority boundary is missing');
  for (const key of ['astro_css_mutation', 'merge', 'normalization', 'penpot_mutation', 'split', 'tokenization']) {
    assert(constraints[key] === false, `forbidden operation enabled: ${key}`);
  }

  const outputPaths = Object.keys(manifest.outputs || {}).sort();
  assert(outputPaths.length === 201, `unexpected compact output count: ${outputPaths.length}`);
  for (const relative of outputPaths) {
    const absolute = path.join(root, relative);
    assert(absolute.startsWith(`${path.resolve(root)}${path.sep}`), `unsafe output path: ${relative}`);
    assert(fs.existsSync(absolute) && fs.statSync(absolute).isFile(), `missing output: ${relative}`);
    const buffer = readBuffer(absolute);
    const expected = manifest.outputs[relative];
    assert(buffer.byteLength === expected.bytes, `byte mismatch: ${relative}`);
    assert(sha256(buffer) === expected.sha256, `sha256 mismatch: ${relative}`);
    if (relative.endsWith('.jsonl')) readJsonl(absolute);
    if (relative.endsWith('.json')) readJson(absolute);
  }

  const files = walkFiles(root).sort();
  const expectedFiles = [...outputPaths, 'manifest.json', 'receipt.json'].sort();
  assert(JSON.stringify(files) === JSON.stringify(expectedFiles), 'snapshot has missing or unindexed compact files');

  const componentFiles = files.filter((file) => /^components\/component\.[0-9a-f]{16}\.json$/u.test(file));
  const components = componentFiles.map((file) => readJson(path.join(root, file)));
  assert(components.length === 107, `expected 107 logical components, found ${components.length}`);
  assertUnique(components, 'id', 'components');
  assertUnique(components, 'logical_path', 'components');
  assert(components.every((row) => EXPECTED_DISPOSITIONS.has(row.disposition)), 'unknown component disposition');
  assert(components.every((row) => row.decision === 'NOT_MERGED' && row.recommendation === 'unresolved'), 'component merge decision escaped');

  const dispositionCounts = Object.fromEntries([...EXPECTED_DISPOSITIONS].map((value) => [
    value,
    components.filter((row) => row.disposition === value).length,
  ]));
  assert(JSON.stringify(dispositionCounts) === JSON.stringify(manifest.go_no_go.counts.dispositions), 'disposition totals mismatch');
  assert(manifest.go_no_go.counts.total === components.length, 'component total mismatch');

  const contractFiles = files.filter((file) => /^candidate-contracts\/candidate\..+\.contract\.json$/u.test(file));
  const contracts = contractFiles.map((file) => readJson(path.join(root, file)));
  assert(contracts.length === 12, `expected 12 candidate contracts, found ${contracts.length}`);
  assertUnique(contracts, 'candidate_component_id', 'candidate contracts');
  assert(contracts.every((row) => row.normative_status === 'candidate-as-is-not-accepted'), 'accepted/normative contract found');
  assert(contracts.every((row) => row.decision === 'NOT_MERGED' && row.normalization_allowed === false), 'candidate contract permits normalization');

  const capsuleFiles = files.filter((file) => /^conformance-capsules\/[^/]+\/capsule\.json$/u.test(file));
  const capsules = capsuleFiles.map((file) => readJson(path.join(root, file)));
  assert(capsules.length === 6, `expected 6 capsules, found ${capsules.length}`);
  assertUnique(capsules, 'id', 'capsules');
  for (const capsule of capsules) {
    assert(capsule.source_sha === EXPECTED_SOURCE_SHA, `${capsule.id}: source SHA mismatch`);
    assert(capsule.review_status === 'reviewed', `${capsule.id}: human review missing`);
    assert(capsule.evidence_status === 'source-specimen-page-reconciled', `${capsule.id}: evidence chain incomplete`);
    assert(capsule.review?.confidence, `${capsule.id}: review confidence missing`);
    assert(capsule.review?.reviewed_at && capsule.review?.reviewer, `${capsule.id}: reviewer provenance missing`);
    assert((capsule.review?.evidence_ids || []).length > 0, `${capsule.id}: review evidence missing`);
    assert(capsule.decision === 'NOT_MERGED' && capsule.normalization_allowed === false, `${capsule.id}: stop boundary broken`);
  }

  const ledger = readJson(path.join(root, 'review-ledger.json'));
  assert(ledger.schema_version === 'current_ui_decoder_human_review_v1', 'unexpected review ledger schema');
  assert(ledger.snapshot_id === manifest.snapshot_id, 'review ledger snapshot mismatch');
  assert(sha256(readBuffer(path.join(root, 'review-ledger.json'))) === manifest.review.ledger_sha256, 'review ledger digest mismatch');
  assert(ledger.raster_reviews?.length === 155, 'manual raster review is incomplete');
  assert(ledger.observations?.length === 20, 'controlled observation review count mismatch');
  assert(ledger.page_verifications?.length === 89, 'page verification review count mismatch');
  assert(ledger.capsules?.length === 6, 'reviewed capsule count mismatch');
  assert(ledger.reviewer === manifest.review.reviewer && ledger.reviewed_at === manifest.review.reviewed_at, 'reviewer provenance mismatch');

  const artifactIndex = readJson(path.join(root, 'artifact-index.json'));
  assert(artifactIndex.actions?.run_id === 31291052330, 'unexpected Actions run');
  assert(artifactIndex.actions?.artifact_id === 9031552834, 'unexpected Actions artifact');
  assert(/^sha256:[0-9a-f]{64}$/u.test(artifactIndex.actions?.artifact_digest || ''), 'invalid Actions artifact digest');
  assert(artifactIndex.permanent_storage?.backend === 'github-release', 'permanent heavy evidence is missing');
  assert(/^sha256:[0-9a-f]{64}$/u.test(artifactIndex.permanent_storage?.sha256 || ''), 'invalid permanent artifact digest');
  assert(/^https:\/\/github\.com\/onedayonemasterpiece\/events-bot-new\/releases\/download\//u.test(artifactIndex.permanent_storage?.uri || ''), 'heavy evidence URI is not immutable release storage');

  const penpot = readJson(path.join(root, 'penpot-materialization-candidates.json'));
  assert(penpot.status === 'not-materialized' && penpot.candidates?.length === 0, 'Penpot materialization escaped decoder boundary');

  const text = files.map((file) => readBuffer(path.join(root, file)).toString('utf8')).join('\n');
  assert(!/Authorization\s*:\s*Bearer\s+\S+/iu.test(text), 'authorization bearer leaked');
  assert(!/https?:\/\/[^\s"']+\/_review\/[A-Za-z0-9_-]{12,}/u.test(text), 'secret review URL leaked');
  assert(!/sb_(?:secret|publishable)_[A-Za-z0-9_-]{12,}/u.test(text), 'Supabase key value leaked');
  assert(!/(?:innerHTML|outerHTML)"\s*:\s*"</u.test(text), 'full HTML field leaked');

  return {
    status: 'valid',
    snapshot_id: manifest.snapshot_id,
    files: files.length,
    outputs: outputPaths.length,
    components: components.length,
    contracts: contracts.length,
    capsules: capsules.length,
    raster_reviews: ledger.raster_reviews.length,
    verdict: receipt.verdict,
  };
}

const root = path.resolve(process.argv[2] || 'catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc');
console.log(JSON.stringify(validateSnapshot(root), null, 2));

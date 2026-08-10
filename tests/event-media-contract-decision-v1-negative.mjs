#!/usr/bin/env node
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { collectAndValidate, validateOutputPaths } from '../scripts/event-media-contract-decision-v1/lib.mjs';

const sourceRoot = path.resolve(new URL('..', import.meta.url).pathname);
const tempParent = fs.mkdtempSync(path.join(os.tmpdir(), 'event-media-contract-decision-v1-'));
const fixtureRoot = path.join(tempParent, 'fixture');
fs.mkdirSync(fixtureRoot);
for (const directory of ['catalog', 'contracts', 'docs', 'penpot', 'prototypes']) {
  fs.cpSync(path.join(sourceRoot, directory), path.join(fixtureRoot, directory), { recursive: true });
}

const C = 'catalog/normalization/event-media/consumer-requirement-matrix.jsonl';
const S = 'catalog/normalization/event-media/semantic-media-types.jsonl';
const B = 'catalog/normalization/event-media/boundary-model.jsonl';
const K = 'catalog/normalization/event-media/blocker-closure.jsonl';
const A = 'catalog/normalization/event-media/alternatives-and-recommendations.jsonl';
const R = 'catalog/normalization/event-media/readiness.jsonl';
const Q = 'catalog/normalization/event-media/owner-decision-queue.jsonl';
const PRIMARY = 'catalog/normalization/event-media/candidate-contracts/candidate.event-primary-media.json';
const FALLBACK = 'catalog/normalization/event-media/candidate-contracts/candidate.event-fallback-art.json';
const DECODER_MANIFEST = 'catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/manifest.json';
const BEHAVIOR_MANIFEST = 'catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/manifest.json';
const DOSSIER = 'catalog/normalization/families/event-media/dossier.json';

const absolute = (relative) => path.join(fixtureRoot, relative);
const readJsonl = (relative) => fs.readFileSync(absolute(relative), 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const writeJsonl = (relative, rows) => fs.writeFileSync(absolute(relative), `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
const mutateJsonl = (relative, mutate) => { const rows = readJsonl(relative); mutate(rows); writeJsonl(relative, rows); };
const mutateJson = (relative, mutate) => { const value = JSON.parse(fs.readFileSync(absolute(relative), 'utf8')); mutate(value); fs.writeFileSync(absolute(relative), `${JSON.stringify(value, null, 2)}\n`); };
const firstConsumer = (rows) => rows[0];
const findBoundary = (rows, id) => rows.find((row) => row.id === id);
const findBlocker = (rows, status) => rows.find((row) => row.status === status);
const removeRatio = (rows, notation) => {
  for (const row of rows) {
    for (const ratio of row.aspect_ratio_policy.ratios) if (ratio.notation === notation) ratio.notation = '4:3';
  }
};

const cases = [
  { id: 'immutable-decoder-manifest-bytes', code: 'EMV_IMMUTABLE_DECODER_MANIFEST', files: [DECODER_MANIFEST], mutate: () => fs.appendFileSync(absolute(DECODER_MANIFEST), ' ') },
  { id: 'immutable-behavioral-manifest-bytes', code: 'EMV_IMMUTABLE_BEHAVIORAL_MANIFEST', files: [BEHAVIOR_MANIFEST], mutate: () => fs.appendFileSync(absolute(BEHAVIOR_MANIFEST), ' ') },
  { id: 'immutable-event-media-dossier-bytes', code: 'EMV_SOURCE_DOSSIER_DRIFT', files: [DOSSIER], mutate: () => fs.appendFileSync(absolute(DOSSIER), ' ') },
  { id: 'stop-forbidden-production-path', code: 'EMV_FORBIDDEN_PATH_CHANGED', direct: () => validateOutputPaths(['site/src/components/EventHero.astro']) },
  { id: 'stop-raster-evidence-path', code: 'EMV_RASTER_ADDED', direct: () => validateOutputPaths(['docs/normalization/event-media-proof.png']) },

  { id: 'consumer-exact-count', code: 'EMV_COUNT_MISMATCH', files: [C], mutate: () => mutateJsonl(C, (rows) => rows.pop()) },
  { id: 'consumer-stable-id-duplicate', code: 'EMV_STABLE_ID_DUPLICATE', files: [C], mutate: () => mutateJsonl(C, (rows) => { rows[1].id = rows[0].id; }) },
  { id: 'consumer-boundary-not-merged', code: 'EMV_CONSUMER_BOUNDARY', files: [C], mutate: () => mutateJsonl(C, (rows) => { firstConsumer(rows).decision = 'MERGED'; }) },
  { id: 'consumer-mutation-not-authorized', code: 'EMV_CONSUMER_MUTATION_AUTHORIZED', files: [C], mutate: () => mutateJsonl(C, (rows) => { firstConsumer(rows).physical_ui_change_authorized = true; }) },
  { id: 'consumer-product-value-observe-pending', code: 'EMV_PRODUCT_GATE_ESCAPED', files: [C], mutate: () => mutateJsonl(C, (rows) => { firstConsumer(rows).promotion_ready = true; }) },
  { id: 'consumer-source-exact-commit', code: 'EMV_SOURCE_COMPONENT_INVALID', files: [C], mutate: () => mutateJsonl(C, (rows) => { firstConsumer(rows).source_component.commit = '0'.repeat(40); }) },
  { id: 'consumer-route-required', code: 'EMV_CONSUMER_ROUTE_MISSING', files: [C], mutate: () => mutateJsonl(C, (rows) => { firstConsumer(rows).routes = []; }) },
  { id: 'consumer-semantic-join', code: 'EMV_CONSUMER_SEMANTIC_REF', files: [C], mutate: () => mutateJsonl(C, (rows) => { firstConsumer(rows).semantic_axis_assignments.media_type = ['event-media.semantic.missing']; }) },
  { id: 'ratio-global-target-not-selected', code: 'EMV_GLOBAL_RATIO_SELECTED', files: [C], mutate: () => mutateJsonl(C, (rows) => { firstConsumer(rows).aspect_ratio_policy.target_ratio_selected = true; }) },
  { id: 'ratio-consumer-evidence-not-empty', code: 'EMV_RATIO_MISSING', files: [C], mutate: () => mutateJsonl(C, (rows) => { firstConsumer(rows).aspect_ratio_policy.ratios = []; }) },
  { id: 'ratio-global-token-not-selected', code: 'EMV_RATIO_GLOBAL_TOKEN', files: [C], mutate: () => mutateJsonl(C, (rows) => { firstConsumer(rows).aspect_ratio_policy.ratios[0].global_token_selected = true; }) },
  { id: 'consumer-evidence-ref-deduplicated', code: 'EMV_EVIDENCE_REF_DUPLICATE', files: [C], mutate: () => mutateJsonl(C, (rows) => { firstConsumer(rows).evidence_refs.push(firstConsumer(rows).evidence_refs[0]); }) },
  { id: 'consumer-policy-dimension-required', code: 'EMV_CONSUMER_DIMENSION_MISSING', files: [C], mutate: () => mutateJsonl(C, (rows) => { firstConsumer(rows).geometry = {}; }) },
  { id: 'runtime-evidence-not-production-equivalent', code: 'EMV_RUNTIME_OVERCLAIM', files: [C], mutate: () => mutateJsonl(C, (rows) => { firstConsumer(rows).runtime_evidence.production_observed = true; }) },
  { id: 'cell-level-provenance-complete', code: 'EMV_CELL_PROVENANCE_MISSING', files: [C], mutate: () => mutateJsonl(C, (rows) => { delete firstConsumer(rows).cell_level_provenance.tests; }) },
  { id: 'ratio-4-by-5-required', code: 'EMV_RATIO_4_5_MISSING', files: [C], mutate: () => mutateJsonl(C, (rows) => removeRatio(rows, '4:5')) },
  { id: 'ratio-5-by-4-required', code: 'EMV_RATIO_5_4_MISSING', files: [C], mutate: () => mutateJsonl(C, (rows) => removeRatio(rows, '5:4')) },
  { id: 'ratio-3-by-2-required', code: 'EMV_REQUIRED_RATIO_MISSING', files: [C], mutate: () => mutateJsonl(C, (rows) => removeRatio(rows, '3:2')) },
  { id: 'ratio-2-by-3-required', code: 'EMV_REQUIRED_RATIO_MISSING', files: [C], mutate: () => mutateJsonl(C, (rows) => removeRatio(rows, '2:3')) },
  { id: 'ratio-1-by-1-required', code: 'EMV_REQUIRED_RATIO_MISSING', files: [C], mutate: () => mutateJsonl(C, (rows) => removeRatio(rows, '1:1')) },
  { id: 'ratio-intrinsic-source-required', code: 'EMV_REQUIRED_RATIO_MISSING', files: [C], mutate: () => mutateJsonl(C, (rows) => removeRatio(rows, 'intrinsic/source')) },
  { id: 'ratio-discovered-set-exact', code: 'EMV_DISCOVERED_RATIO_DRIFT', files: [C], mutate: () => mutateJsonl(C, (rows) => { const ratio = structuredClone(firstConsumer(rows).aspect_ratio_policy.ratios[0]); ratio.notation = '9:16'; firstConsumer(rows).aspect_ratio_policy.ratios.push(ratio); }) },

  { id: 'required-semantic-record-present', code: 'EMV_REQUIRED_SEMANTIC_TYPE_MISSING', files: [S], mutate: () => mutateJsonl(S, (rows) => { rows.find((row) => row.id === 'event-media.semantic.ocr-document').id = 'event-media.semantic.renamed-ocr'; }) },
  { id: 'semantic-candidate-not-accepted', code: 'EMV_SEMANTIC_ACCEPTED', files: [S], mutate: () => mutateJsonl(S, (rows) => { rows[0].candidate_contract_accepted = true; }) },
  { id: 'semantic-entity-kind-enum', code: 'EMV_ENTITY_KIND_INVALID', files: [S], mutate: () => mutateJsonl(S, (rows) => { rows[0].entity_kind = 'component'; }) },
  { id: 'semantic-boundary-foreign-key', code: 'EMV_SEMANTIC_BOUNDARY_REF', files: [S], mutate: () => mutateJsonl(S, (rows) => { rows[0].boundary_model_ref = 'event-media.boundary.missing'; }) },
  { id: 'semantic-experiment-not-merged', code: 'EMV_EXPERIMENT_WINNER_SELECTED', files: [S], mutate: () => mutateJsonl(S, (rows) => { rows[0].experiments.decision = 'MERGED'; }) },
  { id: 'boundary-stop-flags-false', code: 'EMV_STOP_FLAG_ESCAPED', files: [B], mutate: () => mutateJsonl(B, (rows) => { rows[0].normalization_allowed = true; }) },
  { id: 'boundary-decision-not-merged', code: 'EMV_DECISION_MERGED', files: [B], mutate: () => mutateJsonl(B, (rows) => { rows[0].decision = 'MERGED'; }) },
  { id: 'boundary-entity-kind-reconciled', code: 'EMV_ENTITY_KIND_UNRECONCILED', files: [B], mutate: () => mutateJsonl(B, (rows) => { rows[0].entity_kind_reconciled = false; }) },
  { id: 'composition-cannot-own-candidate-contract', code: 'EMV_COMPOSITION_AS_COMPONENT', files: [B], mutate: () => mutateJsonl(B, (rows) => { findBoundary(rows, 'event-media.boundary.family.event-media').candidate_contract_ref = PRIMARY; }) },
  { id: 'component-candidate-must-own-contract', code: 'EMV_CANDIDATE_CONTRACT_MISSING', files: [B], mutate: () => mutateJsonl(B, (rows) => { rows.find((row) => row.entity_kind === 'component_identity_candidate').candidate_contract_ref = null; }) },
  { id: 'boundary-candidate-identity-join', code: 'EMV_BOUNDARY_CANDIDATE_IDENTITY', files: [B], mutate: () => mutateJsonl(B, (rows) => {
    const primary = findBoundary(rows, 'event-media.boundary.candidate.event-primary-media');
    const viewer = findBoundary(rows, 'event-media.boundary.candidate.event-media-viewer');
    [primary.candidate_contract_ref, viewer.candidate_contract_ref] = [viewer.candidate_contract_ref, primary.candidate_contract_ref];
  }) },
  { id: 'event-media-family-remains-composition', code: 'EMV_FAMILY_COMPOSITION_ESCAPED', files: [B], mutate: () => mutateJsonl(B, (rows) => { findBoundary(rows, 'event-media.boundary.family.event-media').entity_kind = 'implementation_detail'; }) },

  { id: 'blocker-exact-set', code: 'EMV_BLOCKER_SET_MISMATCH', files: [K], mutate: () => mutateJsonl(K, (rows) => { rows[0].blocker_id = 'EM-OTHER-999'; }) },
  { id: 'blocker-source-text-byte-exact', code: 'EMV_BLOCKER_SOURCE_TEXT_DRIFT', files: [K], mutate: () => mutateJsonl(K, (rows) => { rows[0].source_text += ' changed'; }) },
  { id: 'blocker-status-enum', code: 'EMV_BLOCKER_STATUS_INVALID', files: [K], mutate: () => mutateJsonl(K, (rows) => { rows[0].status = 'closed'; }) },
  { id: 'blocker-fail-open-fields', code: 'EMV_BLOCKER_FAIL_OPEN', files: [K], mutate: () => mutateJsonl(K, (rows) => { rows[0].field_presence_closes_blocker = true; }) },
  { id: 'blocker-evidence-finding-limitation', code: 'EMV_BLOCKER_EVIDENCE_MISSING', files: [K], mutate: () => mutateJsonl(K, (rows) => { rows[0].actual_evidence = []; }) },
  { id: 'blocker-evidence-ref-deduplicated', code: 'EMV_EVIDENCE_REF_DUPLICATE', files: [K], mutate: () => mutateJsonl(K, (rows) => { rows[0].actual_evidence.push(structuredClone(rows[0].actual_evidence[0])); }) },
  { id: 'owner-required-blocker-has-queue-id', code: 'EMV_BLOCKER_OWNER_QUEUE_MISSING', files: [K], mutate: () => mutateJsonl(K, (rows) => { findBlocker(rows, 'owner_decision_required').owner_question_id = null; }) },

  { id: 'alternative-boundary-foreign-key', code: 'EMV_ALTERNATIVE_BOUNDARY_REF', files: [A], mutate: () => mutateJsonl(A, (rows) => { rows[0].boundary_ref = 'event-media.boundary.missing'; }) },
  { id: 'alternative-six-option-set', code: 'EMV_ALTERNATIVE_SET_INCOMPLETE', files: [A], mutate: () => mutateJsonl(A, (rows) => { rows[0].compared_options.pop(); }) },
  { id: 'alternative-recommendation-enum', code: 'EMV_RECOMMENDATION_INVALID', files: [A], mutate: () => mutateJsonl(A, (rows) => { rows[0].recommendation = 'invent'; }) },
  { id: 'alternative-rejected-complement', code: 'EMV_REJECTED_ALTERNATIVES_MISMATCH', files: [A], mutate: () => mutateJsonl(A, (rows) => { rows[0].rejected_alternatives.pop(); }) },
  { id: 'alternative-assessment-option-set', code: 'EMV_OPTION_ASSESSMENT_SET', files: [A], mutate: () => mutateJsonl(A, (rows) => { rows[0].option_assessments[0].option = rows[0].option_assessments[1].option; }) },

  { id: 'candidate-remains-unaccepted', code: 'EMV_CANDIDATE_ACCEPTED', files: [PRIMARY], mutate: () => mutateJson(PRIMARY, (row) => { row.canonical = true; }) },
  { id: 'candidate-ocr-default-contain-no-crop', code: 'EMV_OCR_DEFAULT_CROP', files: [PRIMARY], mutate: () => mutateJson(PRIMARY, (row) => { row.crop_contain_policy.find((policy) => policy.semantic_mode === 'ocr_document').fit = 'cover'; }) },
  { id: 'candidate-penpot-remains-unmaterialized', code: 'EMV_PENPOT_FUTURE_INVALID', files: [PRIMARY], mutate: () => mutateJson(PRIMARY, (row) => { row.penpot_future.status = 'materialized'; }) },
  { id: 'owner-decision-remains-pending', code: 'EMV_OWNER_DECISION_ACCEPTED', files: [Q], mutate: () => mutateJsonl(Q, (rows) => { rows[0].status = 'DECIDED'; }) },
  { id: 'readiness-recomputed-from-blocked-checks', code: 'EMV_READINESS_RECOMPUTATION', files: [R], mutate: () => mutateJsonl(R, (rows) => { rows[0].not_ready_reason_codes.pop(); }) },
  { id: 'readiness-cannot-fail-open', code: 'EMV_FALSE_POSITIVE_READINESS', files: [R], mutate: () => mutateJsonl(R, (rows) => { const row = rows[0]; row.checklist.forEach((check) => { if (check.status === 'BLOCKED') check.status = 'PASS'; }); row.not_ready_reason_codes = []; }) },
  { id: 'readiness-owner-blockers-recomputed', code: 'EMV_READINESS_OWNER_BLOCKER_JOIN', files: [R], mutate: () => mutateJsonl(R, (rows) => { rows[0].owner_decision_blocker_refs = []; rows[0].owner_question_refs = []; }) },
  { id: 'readiness-candidate-identity-join', code: 'EMV_READINESS_CANDIDATE_IDENTITY', files: [R], mutate: () => mutateJsonl(R, (rows) => {
    const fallback = JSON.parse(fs.readFileSync(absolute(FALLBACK), 'utf8'));
    rows[0].candidate_contract_ref = FALLBACK;
    rows[0].candidate_contract_sha256 = crypto.createHash('sha256').update(fs.readFileSync(absolute(FALLBACK))).digest('hex');
    rows[0].candidate_contract_version = fallback.contract_version;
  }) },
  { id: 'readiness-boundary-identity-join', code: 'EMV_READINESS_BOUNDARY_IDENTITY', files: [R], mutate: () => mutateJsonl(R, (rows) => { rows[0].boundary_ref = rows[1].boundary_ref; }) },
];

assert.equal(cases.length, 60, 'negative catalog must remain exactly 60 deterministic cases');
const baseline = collectAndValidate({ root: fixtureRoot, fixtureMode: true });
assert.deepEqual(baseline.finalStatuses, ['EVENT_MEDIA_BOUNDARY_MODEL_COMPLETE', 'EVENT_MEDIA_NOT_READY_WITH_EXACT_BLOCKERS']);
const results = [];
try {
  for (const testCase of cases) {
    const originals = Object.fromEntries((testCase.files ?? []).map((relative) => [relative, fs.readFileSync(absolute(relative))]));
    let actual = null;
    try {
      testCase.direct ? testCase.direct() : testCase.mutate();
      if (!testCase.direct) collectAndValidate({ root: fixtureRoot, fixtureMode: true });
    } catch (error) {
      actual = error.code;
    } finally {
      for (const [relative, bytes] of Object.entries(originals)) fs.writeFileSync(absolute(relative), bytes);
    }
    assert.equal(actual, testCase.code, `${testCase.id}: expected ${testCase.code}, got ${actual ?? 'acceptance'}`);
    results.push({ case_id: testCase.id, expected_error_code: testCase.code, actual_error_code: actual, status: 'rejected-as-expected' });
  }
  const restored = collectAndValidate({ root: fixtureRoot, fixtureMode: true });
  assert.deepEqual(restored.finalStatuses, baseline.finalStatuses, 'baseline must be restored after all mutations');
  console.log(JSON.stringify({ status: 'valid', mutation_cases: results.length, aggregate_rejections: results.filter((row) => !row.case_id.startsWith('stop-')).length, stop_rejections: 2, restored_baseline: true, results }, null, 2));
} finally {
  fs.rmSync(tempParent, { recursive: true, force: true });
}

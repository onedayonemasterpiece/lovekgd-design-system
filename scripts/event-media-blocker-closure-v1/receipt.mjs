import fs from 'node:fs';
import path from 'node:path';

import {
  AUDITED_HEAD, BRANCH, CANDIDATES, COMPONENT_DECODER_TREE, EVENTS_SHA, EVENTS_SITE_PUBLIC_TREE, EVENTS_SITE_SRC_TREE, EVENTS_TREE,
  FINAL_STATUS, FROZEN, MERGED_MAIN, MERGE_PARENT_1, MERGE_PARENT_2, PENPOT_TREE, PR_NUMBER, PR_URL,
  RECEIPT_PATH, collectAndValidate, currentOutputPaths, fileEntry, gitCommand, stable,
} from './lib.mjs';
import { demand } from './structured-error.mjs';

const abs = (root, relative) => path.join(root, relative);
const validMetadata = ({ materializationParent, prNumber, prUrl, branch }) => /^[a-f0-9]{40}$/u.test(materializationParent ?? '') && prNumber === PR_NUMBER && prUrl === PR_URL && branch === BRANCH;
const frozenFiles = (root) => {
  const rows = {};
  for (const relative of Object.keys(FROZEN)) rows[relative] = fileEntry(root, relative);
  for (const [relative] of Object.values(CANDIDATES)) rows[relative] = fileEntry(root, relative);
  rows['receipts/normalization/event-media-contract-decision-v1.json'] = fileEntry(root, 'receipts/normalization/event-media-contract-decision-v1.json');
  return Object.fromEntries(Object.entries(rows).sort(([a],[b]) => a.localeCompare(b)));
};

export const buildReceipt = ({ root = '.', eventsRoot = null, materializationParent, prNumber = PR_NUMBER, prUrl = PR_URL, branch = BRANCH, fixtureMode = false }) => {
  const design = path.resolve(root);
  demand(validMetadata({ materializationParent,prNumber,prUrl,branch }), 'EMC_RECEIPT_METADATA', 'receipt', RECEIPT_PATH, '/', 'receipt must bind exact parent, branch and Draft PR #33 metadata');
  try { gitCommand(design, ['merge-base','--is-ancestor',MERGED_MAIN,materializationParent]); } catch { demand(false, 'EMC_RECEIPT_ANCESTRY', 'receipt', RECEIPT_PATH, '/lineage', 'merged PR #32 main is not ancestor of receipt parent'); }
  demand(gitCommand(design, ['rev-parse', `${MERGED_MAIN}^1`]) === MERGE_PARENT_1 && gitCommand(design, ['rev-parse', `${MERGED_MAIN}^2`]) === MERGE_PARENT_2, 'EMC_RECEIPT_MERGE_PARENTS', 'receipt', RECEIPT_PATH, '/lineage', 'receipt merge parents differ');
  const result = collectAndValidate({ root: design, eventsRoot, fixtureMode });
  const paths = currentOutputPaths(design, materializationParent);
  const outputs = Object.fromEntries(paths.map((relative) => [relative,fileEntry(design,relative)]));
  const outputBytes = Object.values(outputs).reduce((sum,row) => sum + row.bytes,0);
  const f = result.facts;
  return {
    schema_version: 'event_media_blocker_closure_receipt_v1',
    closure_id: 'event-media-blocker-closure-v1',
    repository: 'onedayonemasterpiece/lovekgd-design-system',
    branch,
    status: FINAL_STATUS,
    lineage: { merged_main: MERGED_MAIN, audited_pr32_head: AUDITED_HEAD, merge_parent_1: MERGE_PARENT_1, merge_parent_2: MERGE_PARENT_2, materialization_parent_commit: materializationParent },
    frozen_pr32: {
      consumer_applications: 52, semantic_records: 23, boundary_records: 31, source_blockers: 12, owner_required_blockers: 3,
      source_still_open_blockers: 9, candidate_contracts: 3, readiness_rows: 3, readiness_checks_per_candidate: 23,
      files: frozenFiles(design),
    },
    product_evidence: { repository: 'onedayonemasterpiece/events-bot-new', commit: EVENTS_SHA, tree: EVENTS_TREE, site_src_tree: EVENTS_SITE_SRC_TREE, site_public_tree: EVENTS_SITE_PUBLIC_TREE, production_source_mutated: false },
    derived_state: {
      owner_blockers: f.owner_blockers, incomplete_evidence_blockers: f.incomplete_evidence_blockers, resolved_or_invalidated_blockers: 0,
      incomplete_blocker_ids: f.incomplete_blocker_ids, exact_missing_facts: f.incomplete_missing_facts,
      decision_cards: f.decision_cards, options: f.options, fixtures: f.fixtures, vendored_assets: f.vendored_assets,
      behavioral_bindings: f.behavioral_bindings, pngs: f.pngs, full_resolution_reviews: f.full_resolution_reviews,
      readiness_rows: f.readiness_rows, readiness_checks: f.readiness_checks, readiness_pass: f.readiness_pass,
      readiness_blocked: f.readiness_blocked, readiness_not_applicable: f.readiness_not_applicable,
      ready_candidates: f.ready_candidates, not_ready_candidates: f.not_ready_candidates, experiments_not_merged: f.experiments_not_merged,
      product_value: { mode: 'observe', value_evidence_status: 'pending_product_model', promotion_ready: false, authoritative_product_ids: 0 },
    },
    delivery: { pull_request: { number: prNumber, url: prUrl, draft: true, state: 'open', merged: false, merge_requested: false, merge_authorized: false } },
    protected_trees: { penpot_tree: PENPOT_TREE, component_decoder_tree: COMPONENT_DECODER_TREE, authorized_prototype_path: 'prototypes/event-media-decision-pack/**', other_prototype_paths_changed: false, production_site_src_changed: false, production_site_public_changed: false },
    constraints: { candidate_contract_accepted:false, owner_decision_accepted:false, production_ui_changed:false, penpot_changed:false, final_media_tokens_created:false, page_archetypes_created:false, physical_component_operation:false, legacy_deleted:false, migration_started:false, experiment_winner_selected:false, implementation_started:false, normalization_allowed:false, promotion_ready:false, merge_or_deploy_authorized:false },
    verification_contract: {
      workflow_path: '.github/workflows/event-media-blocker-closure-v1.yml', committed_receipt_asserts_ci_pass: false,
      runtime_execution_evidence: 'github-actions-run-and-artifact-only',
      required_commands: [
        'python3 scripts/event-media-blocker-closure-v1/validate-schemas.py --root .',
        'node scripts/validate-event-media-blocker-closure-v1.mjs --root . --events-repo ../events-bot-new',
        'node scripts/build-event-media-blocker-closure-v1-receipt.mjs --root . --events-repo ../events-bot-new',
        'node tests/event-media-blocker-closure-v1-negative.mjs',
        'node tests/event-media-blocker-closure-v1-workflow-path-filters.mjs',
        'python3 prototypes/event-media-decision-pack/scripts/build-index.py --output "$RUNNER_TEMP/index.html"',
        'node prototypes/event-media-decision-pack/scripts/render.mjs --output-dir "$RUNNER_TEMP/render-a"',
        'node prototypes/event-media-decision-pack/scripts/render.mjs --output-dir "$RUNNER_TEMP/render-b"',
        'node scripts/validate-project-normalization-synthesis-v1-1.mjs . --events-repo ../events-bot-new --skip-receipt --semantic-only',
        'git diff --check 3cbe35326ead04ac67070e5b400d30d9edc6eb01...HEAD --',
      ],
    },
    output_count: paths.length,
    output_bytes: outputBytes,
    outputs,
  };
};

export const receiptMetadata = (root, source = RECEIPT_PATH) => {
  const receipt = JSON.parse(fs.readFileSync(abs(root,source),'utf8'));
  return { materializationParent: receipt.lineage?.materialization_parent_commit, prNumber: receipt.delivery?.pull_request?.number, prUrl: receipt.delivery?.pull_request?.url, branch: receipt.branch };
};
export const verifyReceipt = (root, expected, source = RECEIPT_PATH) => {
  demand(fs.existsSync(abs(root,source)), 'EMC_RECEIPT_MISSING', 'receipt', source, '/', 'receipt file is missing');
  demand(fs.readFileSync(abs(root,source)).equals(Buffer.from(stable(expected))), 'EMC_RECEIPT_DRIFT', 'receipt', source, '/', 'receipt bytes differ from deterministic reconstruction');
};

import fs from 'node:fs';
import path from 'node:path';

import {
  BASE_SHA,
  EVENTS_SHA,
  EVENTS_TREE,
  EVENTS_SITE_SRC_TREE,
  EVENTS_SITE_PUBLIC_TREE,
  DECODER_TREE,
  COMPONENT_DECODER_TREE,
  DECODER_MANIFEST_SHA256,
  BEHAVIORAL_MANIFEST_SHA256,
  EVENT_MEDIA_DOSSIER_SHA256,
  EXACT_BLOCKERS_SHA256,
  PENPOT_TREE,
  PROTOTYPES_TREE,
  RECEIPT_PATH,
  allowedOutputPath,
  collectAndValidate,
  gitCommand,
  shaBuffer,
  stable,
} from './lib.mjs';
import { fail, requireValue } from './structured-validation-error.mjs';

const absolute = (root, relative) => path.join(root, relative);
const splitLines = (value) => value.split('\n').filter(Boolean);
const read = (root, relative) => fs.readFileSync(absolute(root, relative));

const inventory = (root) => {
  const tracked = splitLines(gitCommand(root, ['diff', '--name-only', `${BASE_SHA}...HEAD`, '--']));
  const untracked = splitLines(gitCommand(root, ['ls-files', '--others', '--exclude-standard']));
  const outputPaths = [...new Set([...tracked, ...untracked])].sort().filter((relative) => relative !== RECEIPT_PATH);
  requireValue(outputPaths.length > 0, 'EMV_RECEIPT_OUTPUT_EMPTY', 'receipt', RECEIPT_PATH, '/outputs', 'output inventory is empty');
  for (const relative of outputPaths) {
    requireValue(allowedOutputPath(relative), 'EMV_RECEIPT_FORBIDDEN_OUTPUT', 'receipt', relative, '/', 'output is outside the Event Media allowlist');
    requireValue(!/^(penpot|prototypes)\//u.test(relative) && !/(^|\/)site\/(src|public)(\/|$)/u.test(relative), 'EMV_RECEIPT_STOP_OUTPUT', 'receipt', relative, '/', 'receipt contains a protected output');
    requireValue(fs.existsSync(absolute(root, relative)) && fs.statSync(absolute(root, relative)).isFile(), 'EMV_RECEIPT_OUTPUT_MISSING', 'receipt', relative, '/', 'inventoried output is not a file');
  }
  return outputPaths;
};

const outputEntry = (root, relative) => {
  const buffer = read(root, relative);
  return {
    bytes: buffer.byteLength,
    sha256: shaBuffer(buffer),
    records: relative.endsWith('.jsonl') ? buffer.toString('utf8').split('\n').filter(Boolean).length : null,
  };
};

const validDelivery = (number, url) => Number.isInteger(number) && number > 0
  && url === `https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/${number}`;

export const buildReceipt = ({ root = '.', eventsRoot, materializationParent, prNumber, prUrl, branch }) => {
  const absoluteRoot = path.resolve(root);
  requireValue(/^[a-f0-9]{40}$/u.test(materializationParent ?? ''), 'EMV_RECEIPT_PARENT_INVALID', 'receipt', RECEIPT_PATH, '/lineage/materialization_parent_commit', 'materialization parent must be an exact commit');
  requireValue(validDelivery(prNumber, prUrl), 'EMV_DELIVERY_METADATA_INVALID', 'delivery', RECEIPT_PATH, '/delivery/pull_request', 'draft PR number and canonical URL are both required');
  requireValue(typeof branch === 'string' && branch.length > 0, 'EMV_DELIVERY_BRANCH_INVALID', 'delivery', RECEIPT_PATH, '/branch', 'materialization branch is required');
  try { gitCommand(absoluteRoot, ['merge-base', '--is-ancestor', BASE_SHA, materializationParent]); }
  catch { fail('EMV_RECEIPT_ANCESTRY_INVALID', 'receipt', RECEIPT_PATH, '/lineage', 'design base is not an ancestor of materialization parent'); }
  const result = collectAndValidate({ root: absoluteRoot, eventsRoot });
  const outputPaths = inventory(absoluteRoot);
  const outputs = Object.fromEntries(outputPaths.map((relative) => [relative, outputEntry(absoluteRoot, relative)]));
  const facts = result.facts;
  const outputBytes = Object.values(outputs).reduce((total, row) => total + row.bytes, 0);
  return {
    schema_version: 'event_media_contract_decision_receipt_v1',
    decision_id: 'event-media-contract-decision-v1',
    repository: 'onedayonemasterpiece/lovekgd-design-system',
    branch,
    status: 'BOUNDARY_COMPLETE_NOT_READY_WITH_EXACT_BLOCKERS',
    lineage: {
      design_base_commit: BASE_SHA,
      materialization_parent_commit: materializationParent,
      required_ancestry: [BASE_SHA],
    },
    immutable_authority: {
      decoder_tree: DECODER_TREE,
      component_decoder_tree: COMPONENT_DECODER_TREE,
      decoder_manifest_sha256: DECODER_MANIFEST_SHA256,
      behavioral_manifest_sha256: BEHAVIORAL_MANIFEST_SHA256,
      event_media_dossier_sha256: EVENT_MEDIA_DOSSIER_SHA256,
      exact_blockers_sha256: EXACT_BLOCKERS_SHA256,
      penpot_tree: PENPOT_TREE,
      prototypes_tree: PROTOTYPES_TREE,
    },
    product_evidence: {
      repository: 'onedayonemasterpiece/events-bot-new',
      commit: EVENTS_SHA,
      tree: EVENTS_TREE,
      site_src_tree: EVENTS_SITE_SRC_TREE,
      site_public_tree: EVENTS_SITE_PUBLIC_TREE,
      production_source_mutated: false,
    },
    census: {
      consumer_applications: facts.consumers,
      semantic_records: facts.semantic_types,
      boundary_records: facts.boundaries,
      exact_blockers: facts.blockers,
      candidate_contracts: facts.candidates,
      alternative_rows: facts.alternatives,
      readiness_rows: facts.readiness,
      owner_questions: facts.owner_questions,
      readiness_checks_per_candidate: facts.readiness_checks_per_candidate,
      ready_candidates: facts.ready_candidates,
      blocked_candidates: facts.blocked_candidates,
      baseline_analytical_groups: facts.baseline_analytical_groups,
      baseline_component_memberships: facts.baseline_component_memberships,
      baseline_not_ready: facts.baseline_not_ready,
      baseline_scored: facts.baseline_scored,
      baseline_first_wave: facts.baseline_first_wave,
      baseline_applications_pending_product_model: facts.baseline_applications_pending_product_model,
      baseline_experiments_not_merged: facts.baseline_experiments_not_merged,
      observed_ratios: facts.observed_ratios,
      open_blocker_ids: facts.open_blocker_ids,
      blocker_status_counts: facts.blocker_status_counts,
    },
    decision: {
      boundary_status: result.finalStatuses[0],
      readiness_status: result.finalStatuses[1],
      final_statuses: result.finalStatuses,
      candidate_decision_accepted: false,
      normalization_allowed: false,
      physical_operation_authorized: false,
    },
    delivery: {
      pull_request: {
        number: prNumber,
        url: prUrl,
        draft: true,
        status: 'open',
        merge_requested: false,
        merge_authorized: false,
      },
    },
    constraints: {
      penpot_changed: false,
      prototypes_changed: false,
      production_ui_changed: false,
      production_site_src_changed: false,
      production_site_public_changed: false,
      candidate_contract_accepted: false,
      normalization_allowed: false,
      physical_operation_authorized: false,
      migration_started: false,
      experiment_winner_selected: false,
      product_model_created: false,
      promotion_ready: false,
      global_ratio_selected: false,
      global_token_selected: false,
      merge_or_deploy_authorized: false,
    },
    verification_contract: {
      workflow_path: '.github/workflows/event-media-contract-decision-v1.yml',
      committed_receipt_asserts_ci: false,
      runtime_execution_evidence: 'github-actions-run-and-artifact-only',
      required_commands: [
        'python3 scripts/validate-event-media-contract-decision-schemas-v1.py --root .',
        'node scripts/validate-event-media-contract-decision-v1.mjs --root . --events-repo ../events-bot-new',
        'node tests/event-media-contract-decision-v1-negative.mjs',
        'node tests/event-media-contract-decision-v1-workflow-path-filters.mjs',
      ],
    },
    output_count: outputPaths.length,
    output_bytes: outputBytes,
    outputs,
  };
};

export const readReceiptMetadata = (root) => {
  requireValue(fs.existsSync(absolute(root, RECEIPT_PATH)), 'EMV_RECEIPT_MISSING', 'receipt', RECEIPT_PATH, '/', 'receipt is required unless --skip-receipt is explicit');
  const receipt = JSON.parse(read(root, RECEIPT_PATH).toString('utf8'));
  return {
    materializationParent: receipt.lineage?.materialization_parent_commit,
    prNumber: receipt.delivery?.pull_request?.number,
    prUrl: receipt.delivery?.pull_request?.url,
    branch: receipt.branch,
  };
};

export const verifyReceiptBytes = (root, expected) => {
  requireValue(fs.existsSync(absolute(root, RECEIPT_PATH)), 'EMV_RECEIPT_MISSING', 'receipt', RECEIPT_PATH, '/', 'receipt is required unless --skip-receipt is explicit');
  const actual = read(root, RECEIPT_PATH);
  const wanted = Buffer.from(stable(expected));
  requireValue(actual.equals(wanted), 'EMV_RECEIPT_DRIFT', 'receipt', RECEIPT_PATH, '/', 'receipt bytes differ from deterministic reconstruction');
};

#!/usr/bin/env node

import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
};
const root = path.resolve(valueAfter('--root') ?? '.');
const write = args.includes('--write');

const receiptPath = 'receipts/normalization/project-normalization-synthesis-v1-1.json';
const ORIGINAL_BASE = '317938bc72cf7a47ea798b2614d92d3d285dd97a';
const AUDITED_HEAD = 'bcdff9de56663bb77f15f32660ab0156c937e77b';
const MAIN_AT_RECONCILIATION = '1daeb4f3ed2b86319b91e4e5b9d97a8691a72705';
const MERGE_BASE = ORIGINAL_BASE;
const RECONCILIATION_COMMIT = '28a8449396cdfe4531302534d8e82fb9111378cd';
const ALLOWED_COMPLETION_STATUSES = [
  'PROJECT_NORMALIZATION_SYNTHESIS_V1_1_1_PROOF_CLOSURE_COMPLETE',
  'READY_FOR_INDEPENDENT_DELTA_REAUDIT',
];

const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const absolute = (relative) => path.join(root, relative);
const read = (relative) => fs.readFileSync(absolute(relative));
const json = (relative) => JSON.parse(read(relative).toString('utf8'));
const jsonl = (relative) => read(relative).toString('utf8').split('\n').filter(Boolean).map(JSON.parse);
const shaBuffer = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const sha = (relative) => shaBuffer(read(relative));
const git = (commandArgs) => childProcess.execFileSync('git', commandArgs, {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
}).trim();
const sortedUnique = (values) => [...new Set(values)].sort();
const stable = (value) => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.entries(item).sort(([left], [right]) => left.localeCompare(right)))
  : item, 2) + '\n';

const allowed = (relative) => [
  /^\.codex\/integration\/project-normalization-synthesis-v1-1(?:-1)?\//,
  /^\.codex\/lanes\/project-normalization-v1-1(?:-1)?-/,
  /^\.github\/workflows\/project-normalization-synthesis-v1-1\.yml$/,
  /^README\.md$/,
  /^RESULTS\.md$/,
  /^catalog\/normalization\//,
  /^contracts\/normalization\//,
  /^contracts\/(product-value-evidence-binding\.v1\.schema\.json|page-archetype-requirements\.v1\.json|resource-graph-004\.plugin\.json)$/,
  /^docs\/audits\/project-normalization-synthesis-v1/,
  /^docs\/normalization\//,
  /^docs\/(index\.md|component-contract-authority\.md|page-archetype-requirements\.md|penpot-product-design-operating-model\.md|product-atlas-penpot-extension\.md|resource-graph-004\.md)$/,
  /^scripts\/normalization-v1-1\//,
  /^scripts\/(build|validate|test|scan)-(project-normalization|evidence-value|family-lifecycle|resource-graph-004|normalization-v1-1-secrets|normalization-schemas)/,
  /^scripts\/evidence-value-gates-v1-1-lib\.mjs$/,
  /^tests\/(project-normalization|normalization-v1-1|family-lifecycle)/,
].some((pattern) => pattern.test(relative));

for (const commit of [ORIGINAL_BASE, AUDITED_HEAD, MAIN_AT_RECONCILIATION, RECONCILIATION_COMMIT]) {
  git(['cat-file', '-e', `${commit}^{commit}`]);
}
assert(git(['merge-base', AUDITED_HEAD, MAIN_AT_RECONCILIATION]) === MERGE_BASE, 'recorded merge base differs');
git(['merge-base', '--is-ancestor', AUDITED_HEAD, 'HEAD']);
git(['merge-base', '--is-ancestor', MAIN_AT_RECONCILIATION, 'HEAD']);

// Inventory the complete remediation delta against the main commit that was actually
// incorporated. Main-only PR #30 files are authority inputs, not remediation outputs.
const tracked = git(['diff', '--name-only', MAIN_AT_RECONCILIATION, '--']).split('\n').filter(Boolean);
const untracked = git(['ls-files', '--others', '--exclude-standard']).split('\n').filter(Boolean);
for (const relative of tracked) assert(allowed(relative) || relative === receiptPath, `receipt encountered out-of-scope changed path: ${relative}`);
const scopedUntracked = untracked.filter((relative) => !relative.startsWith('_pinned-events-readonly/'));
for (const relative of scopedUntracked) assert(allowed(relative) || relative === receiptPath, `receipt encountered out-of-scope untracked path: ${relative}`);
const outputPaths = sortedUnique([...tracked, ...scopedUntracked]).filter((relative) => relative !== receiptPath);
assert(outputPaths.length > 0, 'receipt output inventory is empty');
for (const relative of outputPaths) {
  assert(fs.existsSync(absolute(relative)) && fs.statSync(absolute(relative)).isFile(), `receipt output missing: ${relative}`);
  assert(!/^(penpot|prototypes)\//.test(relative) && !/(^|\/)site\/(src|public)(\/|$)/.test(relative), `receipt includes forbidden path: ${relative}`);
}
const outputs = Object.fromEntries(outputPaths.map((relative) => {
  const buffer = read(relative);
  return [relative, {
    bytes: buffer.byteLength,
    sha256: shaBuffer(buffer),
    records: relative.endsWith('.jsonl') ? buffer.toString('utf8').split('\n').filter(Boolean).length : null,
  }];
}));

const universe = jsonl('catalog/normalization/authoritative-raw-universe.jsonl');
const aliases = jsonl('catalog/normalization/raw-alias-registry.jsonl');
const partition = jsonl('catalog/normalization/raw-to-canonical-partition.jsonl');
const findings = jsonl('catalog/normalization/findings-disposition.jsonl');
const groups = jsonl('catalog/normalization/analysis-group-registry.jsonl');
const readiness = jsonl('catalog/normalization/semantic-readiness.jsonl');
const wave = json('catalog/normalization/family-wave-plan.json');
const apps = jsonl('catalog/normalization/component-applications.jsonl');
const valueReadiness = jsonl('catalog/normalization/product-value-readiness.jsonl');
const census = jsonl('catalog/normalization/independent-consumer-census.jsonl');
const visual = jsonl('catalog/normalization/visual-review-evidence.jsonl');
const eventMedia = json('catalog/normalization/families/event-media/dossier.json');
const medallions = json('catalog/normalization/families/event-token-medallions/dossier.json');
const lifecycle = json('contracts/normalization/family-lifecycle.v1.json');
const rawUnresolvedIds = new Set(universe.filter((row) => row.raw_kind === 'behavioral_unresolved').map((row) => row.raw_identity_id));
const canonicalUnresolved = findings.filter((row) => row.raw_identity_ids.some((id) => rawUnresolvedIds.has(id)));
const readinessOperationalBlockers = new Set(readiness.flatMap((row) => row.operational_blocker_refs));

const mutationCatalogPath = 'receipts/normalization/project-normalization-v1-1-mutation-catalog.json';
assert(fs.existsSync(absolute(mutationCatalogPath)), 'mandatory mutation definition catalog is missing');
const mutationCatalog = json(mutationCatalogPath);
const mutationCases = mutationCatalog.cases ?? mutationCatalog.mandatory_cases ?? [];
assert(Array.isArray(mutationCases) && mutationCases.length === 14, 'mandatory mutation definition catalog must contain exactly 14 cases');
const mutationDefinitions = mutationCases.map((row) => ({
  case_id: row.id,
  expected_error_code: row.expected_error_code,
  validation_stage: row.error?.stage,
  affected_record: row.error?.record,
  affected_path: row.error?.path,
  mutation_files: row.mutation_files,
}));
assert(mutationDefinitions.every((row) => typeof row.case_id === 'string'
  && typeof row.expected_error_code === 'string'
  && typeof row.validation_stage === 'string'
  && typeof row.affected_record === 'string'
  && typeof row.affected_path === 'string'
  && Array.isArray(row.mutation_files) && row.mutation_files.length > 0), 'mandatory mutation definition is incomplete');
assert(new Set(mutationDefinitions.map((row) => row.case_id)).size === 14, 'mandatory mutation case ID is duplicated');
assert(new Set(mutationDefinitions.map((row) => row.expected_error_code)).size === 14, 'mandatory mutation error code is duplicated');
const binding = (relative) => ({ path: relative, bytes: read(relative).byteLength, sha256: sha(relative) });

let materializationParent = git(['rev-parse', 'HEAD']);
let prNumber = valueAfter('--pr-number') ? Number(valueAfter('--pr-number')) : null;
let prUrl = valueAfter('--pr-url');
if (!write && fs.existsSync(absolute(receiptPath))) {
  const existing = json(receiptPath);
  materializationParent = existing.lineage.materialization_parent_commit;
  if (valueAfter('--pr-number') === null) prNumber = existing.delivery.pull_request.number;
  if (valueAfter('--pr-url') === null) prUrl = existing.delivery.pull_request.url;
}
assert(/^[a-f0-9]{40}$/.test(materializationParent), 'materialization parent commit is invalid');
assert((prNumber === null && prUrl === null) || (Number.isInteger(prNumber) && prNumber > 0
  && /^https:\/\/github\.com\/onedayonemasterpiece\/lovekgd-design-system\/pull\/\d+$/.test(prUrl ?? '')), 'pull request identity must be both absent or valid');

const receipt = {
  schema_version: 'project_normalization_synthesis_receipt_v1_1_1',
  synthesis_id: 'project-normalization-synthesis-v1-1-1-proof-closure',
  status: 'definitions_materialized_execution_attestation_required',
  allowed_completion_statuses: ALLOWED_COMPLETION_STATUSES,
  repository: 'onedayonemasterpiece/lovekgd-design-system',
  branch: 'remediation/project-normalization-synthesis-v1-1',
  lineage: {
    original_synthesis_base: ORIGINAL_BASE,
    audited_head: AUDITED_HEAD,
    main_at_reconciliation: MAIN_AT_RECONCILIATION,
    merge_base: MERGE_BASE,
    reconciliation_commit: RECONCILIATION_COMMIT,
    materialization_parent_commit: materializationParent,
    required_ancestry: [AUDITED_HEAD, MAIN_AT_RECONCILIATION],
  },
  immutable_authority: {
    decoder_tree: 'e77fc2457fadfdffb46ed2d90304ebb91e89a715',
    decoder_manifest_sha256: 'f7740f7f533c3f0cda5d4d0b8ebe98b565d7f521368b96462daecbd26522d5cc',
    behavioral_manifest_sha256: 'c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1',
  },
  audits: {
    original: {
      path: 'docs/audits/project-normalization-synthesis-v1-independent-red-team-audit.md',
      bytes: 8046,
      sha256: 'a466ae5ff4846a1895eb11429c2fe4f175115a119dc9904d5a4a4e50a9507f76',
      disposition_count: 13,
    },
    independent_reaudit: {
      path: 'docs/audits/project-normalization-synthesis-v1-1-independent-red-team-reaudit.md',
      bytes: 61775,
      sha256: '7dfdb90abc7798a0c3c69db8d818f16ef803571bcac4ac32b921fd1514db3b41',
      disposition_path: 'docs/audits/project-normalization-synthesis-v1-1-reaudit-disposition.md',
      accepted_finding_ids: ['REAUDIT-PN-001', 'REAUDIT-PN-002', 'REAUDIT-PN-003', 'REAUDIT-PN-004', 'MERGE-PN-001', 'MERGE-PN-002'],
    },
    independent_delta_reaudit: {
      status: 'pending',
      required_before_merge: true,
      merge_authorized: false,
      report_path: null,
      report_sha256: null,
    },
  },
  mutation_proof_definitions: {
    catalog_path: mutationCatalogPath,
    catalog_sha256: sha(mutationCatalogPath),
    catalog_schema_path: 'contracts/normalization/project-normalization-mutation-catalog.v1.schema.json',
    result_schema_path: 'contracts/normalization/project-normalization-mutation-run.v1.schema.json',
    receipt_validation_enabled_during_mutation: false,
    mandatory_cases: mutationDefinitions,
    actual_results_location: 'actions-attestation-only',
  },
  definition_bindings: {
    structured_error_api: binding('scripts/normalization-v1-1/structured-validation-error.mjs'),
    candidate_validator: binding('scripts/normalization-v1-1/validate-mutation-candidate.mjs'),
    mutation_catalog_schema: binding('contracts/normalization/project-normalization-mutation-catalog.v1.schema.json'),
    mutation_result_schema: binding('contracts/normalization/project-normalization-mutation-run.v1.schema.json'),
    aggregate_validator: binding('scripts/validate-project-normalization-synthesis-v1-1.mjs'),
    receipt_builder: binding('scripts/build-project-normalization-synthesis-v1-1-receipt.mjs'),
    workflow_input_registry: binding('contracts/normalization/project-normalization-v1-1-input-paths.json'),
    workflow_input_schema: binding('contracts/normalization/project-normalization-v1-1-input-paths.schema.json'),
    execution_attestation_schema: binding('contracts/normalization/project-normalization-v1-1-execution-attestation.v1.schema.json'),
  },
  execution_attestation_contract: {
    status: 'required_external',
    committed_receipt_asserts_execution_pass: false,
    exact_head_source: 'GITHUB_SHA',
    workflow_path: '.github/workflows/project-normalization-synthesis-v1-1.yml',
    artifact_name_template: 'project-normalization-v1-1-reproducibility-${GITHUB_RUN_ID}',
    mutation_result_path: 'project-normalization-v1-1-mutation-results.json',
    execution_attestation_path: 'project-normalization-v1-1-execution-attestation.json',
    required_evidence: ['exact_head', 'run_id', 'commands', 'exit_codes', 'versions', 'mutation_catalog_sha256', 'expected_actual_error_codes', 'derived_negative_counts', 'clean_design_checkout', 'clean_events_checkout', 'artifact_sha256s'],
  },
  structured_diff_contract: {
    scope: 'full_committed_range_except_byte_preserved_audits',
    base: ORIGINAL_BASE,
    exact_byte_exceptions: [
      { path: 'docs/audits/project-normalization-synthesis-v1-independent-red-team-audit.md', bytes: 8046, sha256: 'a466ae5ff4846a1895eb11429c2fe4f175115a119dc9904d5a4a4e50a9507f76' },
      { path: 'docs/audits/project-normalization-synthesis-v1-1-independent-red-team-reaudit.md', bytes: 61775, sha256: '7dfdb90abc7798a0c3c69db8d818f16ef803571bcac4ac32b921fd1514db3b41' },
    ],
    other_exceptions_allowed: false,
    execution_result_location: 'actions-attestation-only',
  },
  product_evidence: {
    repository: 'onedayonemasterpiece/events-bot-new',
    closure_commit: '66bc0d43e36299417626f992021cfb7299ddf704',
    closure_tree: '72e24f49ad6642915131438de8c56b804c4826b0',
    closure_site_src_tree: 'd737458f8a87a9b7dad4f4badffd1b3f4ce544dd',
    closure_site_public_tree: 'f42a045ec9ff3b1b2f3396a4df9f54cc6a767934',
    behavioral_source_commit: 'ef7aa62e45c60f7a12da6160f490719c0721ec03',
    behavioral_source_site_src_tree: 'd46996c4444171d7e10ff648aefd35c5620e17bc',
    production_source_mutated: false,
  },
  durable_visual_evidence: {
    prior: { release_tag: 'current-ui-behavioral-decoder-v1-1-run-31318132051', asset_id: 507595606, sha256: 'c677f69572ccdbf5b7f1402037a3cb8c164bd2f503fae35eae9168c46eb8d909', bytes: 44805665, rasters: 124 },
    closure: { release_tag: 'current-ui-behavioral-decoder-v1-1-closure-run-31327863197', asset_id: 507763470, sha256: '8bb8712effaa0ba3b08a672a784d9e1b90d876c6ca6d039a417bfc0617723523', bytes: 3015654, rasters: 10 },
  },
  corpus_facts: {
    raw_identities: universe.length,
    raw_partition_rows: partition.length,
    typed_aliases: aliases.length,
    canonical_findings: findings.length,
    raw_unresolved_records: rawUnresolvedIds.size,
    canonical_unresolved_identities: canonicalUnresolved.length,
    standalone_canonical_unresolved_identities: findings.filter((row) => row.source_kind === 'behavioral_unresolved').length,
    readiness_operational_blockers: readinessOperationalBlockers.size,
    migration_blockers: findings.filter((row) => row.blocking_scope === 'migration').length,
    promotion_blockers: findings.filter((row) => row.blocking_scope === 'promotion').length,
    analytical_groups: groups.length,
    logical_components: groups.flatMap((row) => row.member_component_ids).length,
    semantic_readiness_rows: readiness.length,
    strict_ready_groups: readiness.filter((row) => row.strict_ready).length,
    scored_groups: readiness.filter((row) => row.score !== null).length,
    first_wave: wave.first_wave_family_ids.length,
    applications: apps.length,
    value_readiness_rows: valueReadiness.length,
    independent_census_rows: census.length,
    independent_census_edges: census.filter((row) => row.record_kind === 'consumer-edge').length,
    independent_zero_consumer_components: census.filter((row) => row.record_kind === 'zero-consumer-component').length,
    independent_plane_occurrences: census.reduce((total, row) => total + row.occurrences.length, 0),
    visual_reviews: visual.length,
    event_media_exact_blockers: eventMedia.exact_blockers.length,
    medallion_mapping_rules: medallions.mapping_rules.length,
    lifecycle_states: lifecycle.states.length,
    lifecycle_transitions: lifecycle.transitions.length,
  },
  product_value_gate: {
    mode: 'observe',
    authoritative_registry_status: 'absent-at-pinned-commit',
    authoritative_product_ids: 0,
    pending_applications: apps.filter((row) => row.value_evidence_status === 'pending_product_model').length,
    promotion_ready_applications: apps.filter((row) => row.promotion_ready).length,
    enforce_receipt_created: false,
  },
  lifecycle: {
    current_state: lifecycle.current_repository_state.state,
    authority_changes_only_at: 'FAMILY_AND_ARCHETYPE_PROMOTION',
    penpot_candidate_is_pre_promotion: true,
  },
  dossier_results: {
    event_media: eventMedia.verdict.status,
    event_token_medallions: medallions.verdict,
  },
  checklist_provenance: {
    path: '.codex/integration/project-normalization-synthesis-v1-1/CHECKLIST_REVIEW.md',
    status: 'historical_non_authoritative',
    reviewed_head: 'e005a1c3fa5ffda07a8e76d994aa1d96b53ec45b',
    superseded_by: 'exact-head-actions-execution-attestation',
  },
  delivery: {
    pull_request: {
      status: prNumber === null ? 'pending_identity_binding' : 'open',
      draft: true,
      number: prNumber,
      url: prUrl,
      merge_requested: false,
      merge_authorized: false,
    },
  },
  constraints: {
    production_ui_changed: false,
    production_site_src_changed: false,
    production_site_public_changed: false,
    runtime_components_merged_or_split: false,
    unreachable_component_deleted: false,
    tokens_created_or_selected: false,
    typography_or_media_target_selected: false,
    experiment_winner_selected: false,
    penpot_changed: false,
    penpot_components_materialized: false,
    product_model_created: false,
    product_value_gate_enforced: false,
    family_readiness_promoted: false,
    physical_defragmentation_authorized: false,
    pull_request_merged_or_closed: false,
    next_phase_started: false,
  },
  outputs,
};

for (const audit of Object.values({ original: receipt.audits.original, reaudit: receipt.audits.independent_reaudit })) {
  assert(read(audit.path).byteLength === audit.bytes && sha(audit.path) === audit.sha256, `audit byte identity differs: ${audit.path}`);
}
assert(universe.length === 279 && partition.length === 279 && aliases.length === 57 && findings.length === 222, 'raw/canonical corpus facts differ');
assert(groups.length === 47 && receipt.corpus_facts.logical_components === 107 && readiness.length === 47, 'registry/readiness corpus facts differ');
assert(receipt.corpus_facts.strict_ready_groups === 0 && receipt.corpus_facts.scored_groups === 0 && receipt.corpus_facts.first_wave === 0, 'readiness/wave escaped fail-closed result');
assert(apps.length === 239 && valueReadiness.length === 239 && visual.length === 134, 'application/visual corpus facts differ');
assert(stable(receipt.allowed_completion_statuses) === stable(ALLOWED_COMPLETION_STATUSES), 'allowed completion status contract differs');
assert(!stable(receipt).includes('lane_semantic_mutations') && !stable(receipt).includes('validation_status'), 'receipt contains prohibited literal execution outcome/count fields');

const serialized = stable(receipt);
if (write) {
  fs.mkdirSync(path.dirname(absolute(receiptPath)), { recursive: true });
  fs.writeFileSync(absolute(receiptPath), serialized);
} else {
  assert(fs.existsSync(absolute(receiptPath)), 'v1.1.1 receipt missing; run --write');
  assert(read(receiptPath).equals(Buffer.from(serialized)), 'v1.1.1 receipt deterministic regeneration differs');
}

process.stdout.write(`${JSON.stringify({
  status: write ? 'written' : 'valid',
  schema_version: receipt.schema_version,
  outputs: outputPaths.length,
  corpus_facts: receipt.corpus_facts,
  execution_attestation: receipt.execution_attestation_contract.status,
})}\n`);

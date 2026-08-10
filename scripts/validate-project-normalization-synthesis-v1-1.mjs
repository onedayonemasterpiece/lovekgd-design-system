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
const optionValues = new Set(['--events-repo', '--prior-archive', '--closure-archive']
  .flatMap((flag) => valueAfter(flag) ? [flag, valueAfter(flag)] : [flag]));
const root = path.resolve(args.find((item) => !item.startsWith('--') && !optionValues.has(item)) ?? '.');
const eventsRepo = valueAfter('--events-repo');
const priorArchive = valueAfter('--prior-archive');
const closureArchive = valueAfter('--closure-archive');
const skipReceipt = args.includes('--skip-receipt');
const fixtureMode = args.includes('--fixture-mode');
const semanticOnly = args.includes('--semantic-only');

const BASE = '317938bc72cf7a47ea798b2614d92d3d285dd97a';
const AUDITED_HEAD = 'bcdff9de56663bb77f15f32660ab0156c937e77b';
const MAIN_AT_RECONCILIATION = '1daeb4f3ed2b86319b91e4e5b9d97a8691a72705';
const RECONCILIATION_COMMIT = '28a8449396cdfe4531302534d8e82fb9111378cd';
const AUDIT_SHA = 'a466ae5ff4846a1895eb11429c2fe4f175115a119dc9904d5a4a4e50a9507f76';
const REAUDIT_SHA = '7dfdb90abc7798a0c3c69db8d818f16ef803571bcac4ac32b921fd1514db3b41';
const DECODER_TREE = 'e77fc2457fadfdffb46ed2d90304ebb91e89a715';
const DECODER_MANIFEST_SHA = 'f7740f7f533c3f0cda5d4d0b8ebe98b565d7f521368b96462daecbd26522d5cc';
const BEHAVIOR_MANIFEST_SHA = 'c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1';
const EVENTS_COMMIT = '66bc0d43e36299417626f992021cfb7299ddf704';
const FINAL_STATUSES = ['PROJECT_NORMALIZATION_SYNTHESIS_V1_1_1_PROOF_CLOSURE_COMPLETE', 'READY_FOR_INDEPENDENT_DELTA_REAUDIT'];
const DECODER = 'catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc';
const BEHAVIOR = 'catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc';

const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const absolute = (relative) => path.join(root, relative);
const read = (relative) => fs.readFileSync(absolute(relative));
const shaBuffer = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const sha = (relative) => shaBuffer(read(relative));
const json = (relative) => JSON.parse(read(relative).toString('utf8'));
const jsonl = (relative) => read(relative).toString('utf8').split('\n').filter(Boolean).map((line, index) => {
  try { return JSON.parse(line); }
  catch (error) { fail(`${relative}:${index + 1}: ${error.message}`); }
});
const stable = (value) => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.entries(item).sort(([left], [right]) => left.localeCompare(right)))
  : item);
const unique = (rows, key, label) => assert(new Set(rows.map((row) => row[key])).size === rows.length, `${label}: duplicate ${key}`);
const exec = (command, commandArgs, options = {}) => childProcess.execFileSync(command, commandArgs, {
  cwd: options.cwd ?? root,
  encoding: 'utf8',
  stdio: options.capture ? 'pipe' : 'inherit',
  maxBuffer: 64 * 1024 * 1024,
});
const runNode = (relative, scriptArgs = []) => exec(process.execPath, [absolute(relative), ...scriptArgs]);

const required = [
  'docs/audits/project-normalization-synthesis-v1-independent-red-team-audit.md',
  'docs/audits/project-normalization-synthesis-v1-1-independent-red-team-reaudit.md',
  'docs/audits/project-normalization-synthesis-v1-1-reaudit-disposition.md',
  'docs/audits/project-normalization-synthesis-v1-1-1-proof-closure-report.md',
  'docs/audits/project-normalization-synthesis-v1-audit-disposition.md',
  'docs/audits/project-normalization-synthesis-v1-1-remediation-report.md',
  'docs/normalization/project-normalization-synthesis-v1-1.md',
  'docs/normalization/family-wave-plan-v1-1.md',
  'docs/normalization/design-system-family-lifecycle.md',
  'contracts/normalization/analytical-entity-kinds.v1.schema.json',
  'contracts/normalization/semantic-readiness.v1.schema.json',
  'contracts/normalization/findings-disposition.v1.schema.json',
  'contracts/normalization/family-lifecycle.v1.schema.json',
  'contracts/normalization/family-lifecycle.v1.json',
  'contracts/normalization/project-normalization-mutation-catalog.v1.schema.json',
  'contracts/normalization/project-normalization-mutation-run.v1.schema.json',
  'contracts/normalization/project-normalization-v1-1-input-paths.json',
  'contracts/normalization/project-normalization-v1-1-input-paths.schema.json',
  'contracts/normalization/project-normalization-v1-1-execution-attestation.v1.schema.json',
  'contracts/product-value-evidence-binding.v1.schema.json',
  'catalog/normalization/authoritative-raw-universe.jsonl',
  'catalog/normalization/raw-alias-registry.jsonl',
  'catalog/normalization/raw-to-canonical-partition.jsonl',
  'catalog/normalization/analysis-group-registry.jsonl',
  'catalog/normalization/semantic-readiness.jsonl',
  'catalog/normalization/findings-disposition.jsonl',
  'catalog/normalization/family-wave-plan.json',
  'catalog/normalization/families/event-media/dossier.json',
  'catalog/normalization/families/event-media/dossier.md',
  'catalog/normalization/families/event-token-medallions/dossier.json',
  'catalog/normalization/families/event-token-medallions/dossier.md',
  'catalog/normalization/unreachable-implementation-lifecycle.jsonl',
  'catalog/normalization/mobile-search-navigation-capability.json',
  'catalog/normalization/visual-review-evidence.jsonl',
  'catalog/normalization/behavioral-manifest-counts.json',
  'catalog/normalization/independent-consumer-census.jsonl',
  'catalog/normalization/component-applications.jsonl',
  'catalog/normalization/product-value-readiness.jsonl',
  'scripts/validate-normalization-schemas-v1-1.py',
  'scripts/build-project-normalization-synthesis-v1-1-receipt.mjs',
  'scripts/scan-normalization-v1-1-secrets.py',
  'scripts/normalization-v1-1/validate-workflow-path-filters.mjs',
  'scripts/normalization-v1-1/workflow-command-ledger.mjs',
  'scripts/normalization-v1-1/build-workflow-attestation.mjs',
  'scripts/normalization-v1-1/replay-normalization-workflow.sh',
  'tests/project-normalization-synthesis-v1-1-negative.mjs',
  'tests/project-normalization-v1-1-workflow-path-filters.mjs',
  'receipts/normalization/project-normalization-v1-1-mutation-catalog.json',
  '.github/workflows/project-normalization-synthesis-v1-1.yml',
];
if (!skipReceipt) required.push('receipts/normalization/project-normalization-synthesis-v1-1.json');
for (const relative of required) assert(fs.existsSync(absolute(relative)), `missing v1.1 artifact: ${relative}`);

// Immutable and read-only inputs.
assert(read('docs/audits/project-normalization-synthesis-v1-independent-red-team-audit.md').byteLength === 8046, 'byte-preserved independent audit size changed');
assert(sha('docs/audits/project-normalization-synthesis-v1-independent-red-team-audit.md') === AUDIT_SHA, 'byte-preserved independent audit changed');
assert(read('docs/audits/project-normalization-synthesis-v1-1-independent-red-team-reaudit.md').byteLength === 61775, 'byte-preserved independent re-audit size changed');
assert(sha('docs/audits/project-normalization-synthesis-v1-1-independent-red-team-reaudit.md') === REAUDIT_SHA, 'byte-preserved independent re-audit changed');
assert(sha(`${DECODER}/manifest.json`) === DECODER_MANIFEST_SHA, 'immutable Decoder v1 manifest changed');
assert(sha(`${BEHAVIOR}/manifest.json`) === BEHAVIOR_MANIFEST_SHA, 'Behavioral v1.1 manifest changed');
if (!fixtureMode) {
  const tree = exec('git', ['rev-parse', `HEAD:${DECODER}`], { capture: true }).trim();
  assert(tree === DECODER_TREE, 'immutable Decoder v1 tree changed');
  exec('git', ['cat-file', '-e', `${BASE}^{commit}`], { capture: true });
  assert(exec('git', ['merge-base', AUDITED_HEAD, MAIN_AT_RECONCILIATION], { capture: true }).trim() === BASE, 'recorded reconciliation merge base changed');
  exec('git', ['merge-base', '--is-ancestor', AUDITED_HEAD, 'HEAD'], { capture: true });
  exec('git', ['merge-base', '--is-ancestor', MAIN_AT_RECONCILIATION, 'HEAD'], { capture: true });
  exec('git', ['cat-file', '-e', `${RECONCILIATION_COMMIT}^{commit}`], { capture: true });
  const changed = exec('git', ['diff', '--name-only', `${BASE}...HEAD`], { capture: true }).split('\n').filter(Boolean);
  for (const relative of changed) {
    assert(!/^(penpot|prototypes)\//.test(relative), `forbidden design path changed: ${relative}`);
    assert(!/(^|\/)site\/(src|public)(\/|$)/.test(relative), `forbidden runtime path changed: ${relative}`);
  }
}
if (eventsRepo) {
  const eventRoot = path.resolve(eventsRepo);
  assert(exec('git', ['rev-parse', 'HEAD'], { capture: true, cwd: eventRoot }).trim() === EVENTS_COMMIT, 'events checkout is not exact closure commit');
  assert(exec('git', ['rev-parse', 'HEAD^{tree}'], { capture: true, cwd: eventRoot }).trim() === '72e24f49ad6642915131438de8c56b804c4826b0', 'events closure tree mismatch');
  assert(exec('git', ['rev-parse', 'HEAD:site/src'], { capture: true, cwd: eventRoot }).trim() === 'd737458f8a87a9b7dad4f4badffd1b3f4ce544dd', 'events site/src tree mismatch');
  assert(exec('git', ['rev-parse', 'HEAD:site/public'], { capture: true, cwd: eventRoot }).trim() === 'f42a045ec9ff3b1b2f3396a4df9f54cc6a767934', 'events site/public tree mismatch');
  assert(exec('git', ['status', '--porcelain'], { capture: true, cwd: eventRoot }).trim() === '', 'events evidence checkout was mutated');
}

// Deterministic generators are always replayed; the full lane validators are skipped only by the
// mutation harness after it has first proved a clean full baseline.
runNode('scripts/normalization-v1-1/build-raw-partition.mjs', ['--check']);
runNode('scripts/normalization-v1-1/build-registry-readiness.mjs', ['--check']);
runNode('scripts/normalization-v1-1/validate-event-media-dossier.mjs', ['--root', root]);
if (!semanticOnly) {
  runNode('scripts/normalization-v1-1/validate-workflow-path-filters.mjs', ['--root', root]);
  runNode('scripts/validate-component-decoder-snapshot.mjs', [absolute(DECODER)]);
  runNode('scripts/validate-behavioral-decoder-supplement-v1-1.mjs', [absolute(BEHAVIOR)]);
  runNode('scripts/validate-project-normalization-v1-1-medallions-navigation.mjs', [root]);
  runNode('scripts/validate-family-lifecycle-v1.mjs', ['--root', root]);
  runNode('scripts/validate-resource-graph-004-contracts.mjs');
  const evidenceArgs = [root];
  if (eventsRepo) evidenceArgs.push('--events-repo', path.resolve(eventsRepo));
  if (priorArchive || closureArchive) {
    assert(priorArchive && closureArchive, 'both visual archives are required together');
    evidenceArgs.push('--prior-archive', path.resolve(priorArchive), '--closure-archive', path.resolve(closureArchive));
  }
  runNode('scripts/validate-evidence-value-gates-v1-1.mjs', evidenceArgs);
  exec('python3', [absolute('scripts/validate-normalization-schemas-v1-1.py'), root]);
}

// Cross-lane semantic joins and the strict STOP boundary.
const universe = jsonl('catalog/normalization/authoritative-raw-universe.jsonl');
const partition = jsonl('catalog/normalization/raw-to-canonical-partition.jsonl');
const aliases = jsonl('catalog/normalization/raw-alias-registry.jsonl');
const findings = jsonl('catalog/normalization/findings-disposition.jsonl');
const groups = jsonl('catalog/normalization/analysis-group-registry.jsonl');
const readiness = jsonl('catalog/normalization/semantic-readiness.jsonl');
const wave = json('catalog/normalization/family-wave-plan.json');
const applications = jsonl('catalog/normalization/component-applications.jsonl');
const valueReadiness = jsonl('catalog/normalization/product-value-readiness.jsonl');
const visual = jsonl('catalog/normalization/visual-review-evidence.jsonl');
const census = jsonl('catalog/normalization/independent-consumer-census.jsonl');
const lifecycle = json('contracts/normalization/family-lifecycle.v1.json');
const unreachableLifecycle = jsonl('catalog/normalization/unreachable-implementation-lifecycle.jsonl');
const navigation = json('catalog/normalization/mobile-search-navigation-capability.json');
const eventMedia = json('catalog/normalization/families/event-media/dossier.json');
const medallions = json('catalog/normalization/families/event-token-medallions/dossier.json');
const behaviorCounts = json('catalog/normalization/behavioral-manifest-counts.json');
const experiments = jsonl(`${BEHAVIOR}/experiment-registry.jsonl`);
const rawUnresolvedIds = new Set(universe
  .filter((row) => row.raw_kind === 'behavioral_unresolved')
  .map((row) => row.raw_identity_id));
const canonicalUnresolved = findings.filter((row) => row.raw_identity_ids.some((id) => rawUnresolvedIds.has(id)));
const readinessOperationalBlockers = new Set(readiness.flatMap((row) => row.operational_blocker_refs));

for (const [rows, key, label, count] of [
  [universe, 'raw_identity_id', 'raw universe', 279],
  [partition, 'raw_identity_id', 'raw partition', 279],
  [aliases, 'alias_id', 'typed aliases', 57],
  [findings, 'id', 'canonical findings', 222],
  [groups, 'id', 'analysis groups', 47],
  [readiness, 'id', 'semantic readiness', 47],
  [applications, 'application_id', 'applications', 239],
  [valueReadiness, 'application_id', 'value readiness', 239],
  [visual, 'id', 'visual evidence', 134],
  [census, 'id', 'independent census', 242],
]) { assert(rows.length === count, `${label}: count mismatch`); unique(rows, key, label); }
assert(stable(universe.map((row) => row.raw_identity_id).sort()) === stable(partition.map((row) => row.raw_identity_id).sort()), 'raw partition is not exact set equality');
assert(new Set(partition.map((row) => row.raw_identity_id)).size === 279, 'raw partition multiplicity is not one');
assert(aliases.every((row) => partition.filter((item) => item.alias_id === row.alias_id).length === 2), 'typed alias does not own exactly two partition members');
assert(rawUnresolvedIds.size === 87 && canonicalUnresolved.length === 87, 'raw/canonical unresolved namespaces are not distinguished exactly');
assert(findings.filter((row) => row.source_kind === 'behavioral_unresolved').length === 30, 'standalone canonical unresolved identity count mismatch');
assert(readinessOperationalBlockers.size === 192, 'readiness operational blocker union mismatch');
assert(findings.filter((row) => row.blocking_scope === 'migration').length === 5, 'migration blocker count mismatch');
assert(findings.filter((row) => row.blocking_scope === 'promotion').length === 17, 'promotion blocker count mismatch');

const expectedKinds = new Set(['component_identity_family', 'component_catalog', 'composition_pattern', 'page_surface', 'workflow', 'runtime_enabler', 'foundation', 'evidence_or_lab_group', 'unresolved_boundary']);
assert(groups.every((row) => expectedKinds.has(row.entity_kind)), 'analytical group uses a non-authorized entity kind');
assert(groups.flatMap((row) => row.member_component_ids).length === 107 && new Set(groups.flatMap((row) => row.member_component_ids)).size === 107, '107 component paths are not mapped exactly once');
const groupIds = new Set(groups.map((row) => row.id));
assert(applications.every((row) => groupIds.has(row.family_id)), 'component application has a broken analytical-group foreign key');
assert(readiness.every((row) => row.status === 'NOT_READY' && row.strict_ready === false && row.eligible_for_scoring === false && row.score === null), 'positive readiness gate allowed an unproven group');
assert(wave.algorithm.minimum_family_count === 0 && wave.eligible_family_ids.length === 0 && wave.first_wave_family_ids.length === 0, 'first wave was forced or scored without positive readiness');
assert(wave.counts.strict_ready === 0 && wave.counts.not_ready === 47 && wave.counts.selected_first_wave === 0, 'wave counts mismatch');

const operationEnums = new Set(['preserve', 'investigate', 'reconcile_requirement_runtime', 'fix_implementation', 'split_identity_candidate', 'preserve_as_composition', 'await_product_model', 'await_accessibility_decision', 'await_experiment_decision', 'deprecate_only_after_proof', 'decoder_issue', 'accepted_current_difference']);
assert(findings.every((row) => operationEnums.has(row.operational_disposition) && row.provenance.length > 0 && row.decision === 'NOT_MERGED' && row.candidate_decision_accepted === false), 'canonical finding lacks typed operational provenance/boundary');

assert(eventMedia.verdict?.status === 'NOT_READY_WITH_EXACT_BLOCKERS' && eventMedia.verdict?.ready_for_contract_decision_review === false && eventMedia.promotion_ready === false && eventMedia.normalization_allowed === false && eventMedia.target_ratio_selection === null, 'Event Media escaped exact not-ready status');
assert(medallions.verdict === 'BOUNDARY_AND_TAXONOMY_REVIEW_REQUIRED' && medallions.readiness === 'NOT_READY' && medallions.promotion_ready === false && medallions.decision === 'NOT_MERGED', 'Medallions escaped boundary/taxonomy review');
const lifecycleGateIds = ['full_census', 'migration_closure', 'owner_receipt', 'replacement_coverage', 'requirement_reconciliation', 'rollback_evidence'];
const hasOpenLifecycleGates = (row) => ['deletion_gates', 'deprecation_gates'].every((field) => stable(row[field].map((gate) => gate.gate_id).sort()) === stable(lifecycleGateIds)
  && row[field].every((gate) => gate.status === 'open' && gate.evidence_refs.length === 0));
assert(navigation.implementations.some((row) => row.component_id === 'component.29e9aebbf63be827' && row.reachability_status === 'not_observed_under_pinned_evidence' && row.lifecycle_status === 'preserve_pending_reconciliation' && row.deprecation_allowed === false && row.deletion_allowed === false && row.deprecation_eligible === false && row.deletion_eligible === false && hasOpenLifecycleGates(row)), 'MobileSearchBottomNav fail-closed lifecycle missing');
assert(unreachableLifecycle.length === 3 && unreachableLifecycle.every((row) => row.deletion_allowed === false && row.deprecation_allowed === false && row.deletion_eligible === false && row.deprecation_eligible === false && row.preservation_required === true && hasOpenLifecycleGates(row)), 'unreachable implementation deletion invariant escaped');
assert(behaviorCounts.conflict_count === 0 && behaviorCounts.current_conflicts.length === 0 && behaviorCounts.active_legacy_aliases.length === 0 && behaviorCounts.source_audit.observed_excluded_conflict_count === 5, 'canonical count namespace retained an active conflict or legacy alias');

assert(applications.every((row) => row.value_evidence_status === 'pending_product_model' && row.promotion_ready === false && row.as_is_preservation_allowed === true && row.surface_archetype_id === null), 'Product Value observe gate escaped');
assert(valueReadiness.every((row) => row.value_evidence_status === 'pending_product_model' && row.promotion_ready === false && row.as_is_preservation_allowed === true), 'Product Value readiness escaped');
const productIdFields = ['need_ids', 'job_ids', 'journey_ids', 'capability_ids', 'outcome_ids', 'metric_ids', 'guardrail_ids'];
assert(applications.every((row) => productIdFields.every((field) => Array.isArray(row[field]) && row[field].length === 0) && row.value_claim === null && row.expected_mechanism === null && row.decision_receipt === null), 'invented product ID, claim, mechanism, or receipt');
assert(applications.filter((row) => row.value_evidence_mode === 'experimental').every((row) => row.experimental_evidence_satisfied === false && stable(row.experimental_evidence_gaps) === stable(['hypothesis', 'authoritative_metric', 'decision_receipt'])), 'experimental application lacks fail-closed hypothesis/metric/receipt gaps');
assert(lifecycle.current_repository_state?.state === 'AS_IS_RECONSTRUCTED' && lifecycle.states.length === 11 && lifecycle.transitions.length === 10, 'family lifecycle state machine mismatch');
assert(experiments.every((row) => row.decision === 'NOT_MERGED' && row.winner_decision_receipt === 'absent'), 'experiment winner was selected');

if (!skipReceipt) {
  runNode('scripts/build-project-normalization-synthesis-v1-1-receipt.mjs', ['--root', root]);
  const receipt = json('receipts/normalization/project-normalization-synthesis-v1-1.json');
  assert(receipt.schema_version === 'project_normalization_synthesis_receipt_v1_1_1'
    && receipt.status === 'definitions_materialized_execution_attestation_required', 'v1.1.1 receipt status/schema mismatch');
  assert(stable(receipt.allowed_completion_statuses) === stable(FINAL_STATUSES), 'v1.1.1 allowed completion statuses differ from the only allowed pair');
  assert(receipt.audits?.independent_delta_reaudit?.status === 'pending'
    && receipt.audits?.independent_delta_reaudit?.required_before_merge === true
    && receipt.audits?.independent_delta_reaudit?.merge_authorized === false, 'independent delta re-audit boundary is not pending/fail-closed');
  assert(receipt.lineage.original_synthesis_base === BASE
    && receipt.lineage.audited_head === AUDITED_HEAD
    && receipt.lineage.main_at_reconciliation === MAIN_AT_RECONCILIATION
    && receipt.lineage.merge_base === BASE
    && receipt.lineage.reconciliation_commit === RECONCILIATION_COMMIT, 'receipt reconciliation lineage differs');
  assert(receipt.audits.original.bytes === 8046 && receipt.audits.original.sha256 === AUDIT_SHA
    && receipt.audits.independent_reaudit.bytes === 61775 && receipt.audits.independent_reaudit.sha256 === REAUDIT_SHA, 'receipt audit byte contract differs');
  assert(receipt.corpus_facts.raw_identities === 279 && receipt.corpus_facts.canonical_findings === 222 && receipt.corpus_facts.typed_aliases === 57 && receipt.corpus_facts.analytical_groups === 47 && receipt.corpus_facts.logical_components === 107 && receipt.corpus_facts.applications === 239 && receipt.corpus_facts.visual_reviews === 134 && receipt.corpus_facts.first_wave === 0, 'v1.1.1 receipt corpus facts mismatch');
  assert(receipt.corpus_facts.raw_unresolved_records === 87 && receipt.corpus_facts.canonical_unresolved_identities === 87 && receipt.corpus_facts.standalone_canonical_unresolved_identities === 30 && receipt.corpus_facts.readiness_operational_blockers === 192 && receipt.corpus_facts.migration_blockers === 5 && receipt.corpus_facts.promotion_blockers === 17, 'v1.1.1 receipt blocker namespace facts mismatch');
  assert(receipt.product_value_gate.mode === 'observe' && receipt.product_value_gate.authoritative_product_ids === 0 && receipt.product_value_gate.promotion_ready_applications === 0, 'receipt product gate mismatch');
  assert(receipt.execution_attestation_contract.status === 'required_external'
    && receipt.execution_attestation_contract.committed_receipt_asserts_execution_pass === false, 'committed receipt self-asserts exact-head execution');
  assert(receipt.mutation_proof_definitions.receipt_validation_enabled_during_mutation === false
    && receipt.mutation_proof_definitions.mandatory_cases.length === 14
    && receipt.mutation_proof_definitions.actual_results_location === 'actions-attestation-only', 'mutation definition/result boundary differs');
  assert(receipt.structured_diff_contract.scope === 'full_committed_range_except_byte_preserved_audits'
    && receipt.structured_diff_contract.exact_byte_exceptions.length === 2
    && receipt.structured_diff_contract.other_exceptions_allowed === false, 'structured diff/audit exception contract differs');
  assert(receipt.checklist_provenance.status === 'historical_non_authoritative'
    && receipt.checklist_provenance.reviewed_head === 'e005a1c3fa5ffda07a8e76d994aa1d96b53ec45b', 'historical checklist provenance differs');
  assert(receipt.delivery.pull_request.draft === true && receipt.delivery.pull_request.merge_requested === false && receipt.delivery.pull_request.merge_authorized === false, 'receipt escaped draft/unmerged delivery boundary');
  const receiptText = read('receipts/normalization/project-normalization-synthesis-v1-1.json').toString('utf8');
  for (const prohibited of ['lane_semantic_mutations', 'validation_status', '"validations"', '"git_diff_check"']) {
    assert(!receiptText.includes(prohibited), `committed receipt contains prohibited self-asserted execution field: ${prohibited}`);
  }
  assert(Object.values(receipt.constraints).every((value) => value === false), 'receipt escaped strict STOP boundary');
  for (const [relative, metadata] of Object.entries(receipt.outputs)) {
    assert(fs.existsSync(absolute(relative)), `receipt output missing: ${relative}`);
    assert(read(relative).byteLength === metadata.bytes, `receipt output byte mismatch: ${relative}`);
    assert(sha(relative) === metadata.sha256, `receipt output SHA mismatch: ${relative}`);
    if (relative.endsWith('.jsonl')) assert(jsonl(relative).length === metadata.records, `receipt output record mismatch: ${relative}`);
  }
}

const forbiddenStatuses = ['PROJECT_NORMALIZATION_SYNTHESIS_V1_1_REMEDIATED', 'READY_FOR_INDEPENDENT_REAUDIT', 'INDEPENDENT_REAUDIT_PASS', 'READY_TO_MERGE', 'READY_FOR_FAMILY_DECISION_REVIEW', 'READY_FOR_PHYSICAL_DEFRAGMENTATION', 'NORMALIZATION_APPROVED', 'PRODUCT_VALUE_VALIDATED', 'PENPOT_READY', 'DESIGN_SYSTEM_COMPLETE'];
const claimPaths = [
  'docs/normalization/project-normalization-synthesis-v1-1.md',
  'docs/audits/project-normalization-synthesis-v1-1-remediation-report.md',
  'docs/normalization/family-wave-plan-v1-1.md',
  'catalog/normalization/family-wave-plan.json',
  'docs/audits/project-normalization-synthesis-v1-1-1-proof-closure-report.md',
  ...(skipReceipt ? [] : ['receipts/normalization/project-normalization-synthesis-v1-1.json']),
];
for (const relative of claimPaths) for (const status of forbiddenStatuses) assert(!read(relative).toString('utf8').includes(status), `forbidden completion status in ${relative}: ${status}`);

process.stdout.write(`${JSON.stringify({
  status: 'valid',
  final_statuses: FINAL_STATUSES,
  raw: 279,
  canonical: 222,
  aliases: 57,
  raw_unresolved: 87,
  canonical_unresolved: 87,
  readiness_operational_blockers: 192,
  migration_blockers: 5,
  promotion_blockers: 17,
  groups: 47,
  strict_ready: 0,
  first_wave: 0,
  applications: 239,
  visual_reviews: 134,
  independent_delta_reaudit: skipReceipt ? 'receipt-skipped' : 'pending',
})}\n`);

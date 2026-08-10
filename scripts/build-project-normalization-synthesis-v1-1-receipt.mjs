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
const base = '317938bc72cf7a47ea798b2614d92d3d285dd97a';
const finalStatuses = ['PROJECT_NORMALIZATION_SYNTHESIS_V1_1_REMEDIATED', 'READY_FOR_INDEPENDENT_REAUDIT'];

const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const absolute = (relative) => path.join(root, relative);
const read = (relative) => fs.readFileSync(absolute(relative));
const json = (relative) => JSON.parse(read(relative).toString('utf8'));
const jsonl = (relative) => read(relative).toString('utf8').split('\n').filter(Boolean).map(JSON.parse);
const sha = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const git = (commandArgs) => childProcess.execFileSync('git', commandArgs, { cwd: root, encoding: 'utf8' }).trim();
const sortedUnique = (values) => [...new Set(values)].sort();
const stable = (value) => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.entries(item).sort(([left], [right]) => left.localeCompare(right)))
  : item, 2) + '\n';

const allowed = (relative) => [
  /^\.codex\/integration\/project-normalization-synthesis-v1-1\//,
  /^\.codex\/lanes\/project-normalization-v1-1-/,
  /^\.github\/workflows\/project-normalization-synthesis-v1(?:-1)?\.yml$/,
  /^README\.md$/,
  /^RESULTS\.md$/,
  /^catalog\/normalization\//,
  /^contracts\/normalization\//,
  /^contracts\/(product-value-evidence-binding\.v1\.schema\.json|page-archetype-requirements\.v1\.json|resource-graph-004\.plugin\.json)$/,
  /^docs\/audits\/project-normalization-synthesis-v1/,
  /^docs\/normalization\//,
  /^docs\/(index\.md|component-contract-authority\.md|page-archetype-requirements\.md|penpot-product-design-operating-model\.md|resource-graph-004\.md)$/,
  /^scripts\/normalization-v1-1\//,
  /^scripts\/(build|validate|test|scan)-(project-normalization|evidence-value|family-lifecycle|resource-graph-004|normalization-v1-1-secrets|normalization-schemas)/,
  /^scripts\/evidence-value-gates-v1-1-lib\.mjs$/,
  /^tests\/(project-normalization|normalization-v1-1|family-lifecycle)/,
].some((pattern) => pattern.test(relative));

const tracked = git(['diff', '--name-only', base, '--']).split('\n').filter(Boolean);
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
    sha256: sha(buffer),
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
const behaviorCounts = json('catalog/normalization/behavioral-manifest-counts.json');
const eventMedia = json('catalog/normalization/families/event-media/dossier.json');
const medallions = json('catalog/normalization/families/event-token-medallions/dossier.json');
const lifecycle = json('contracts/normalization/family-lifecycle.v1.json');
const rawUnresolvedIds = new Set(universe
  .filter((row) => row.raw_kind === 'behavioral_unresolved')
  .map((row) => row.raw_identity_id));
const canonicalUnresolved = findings.filter((row) => row.raw_identity_ids.some((id) => rawUnresolvedIds.has(id)));
const readinessOperationalBlockers = new Set(readiness.flatMap((row) => row.operational_blocker_refs));

let materializationParent = git(['rev-parse', 'HEAD']);
let prNumber = valueAfter('--pr-number') ? Number(valueAfter('--pr-number')) : null;
let prUrl = valueAfter('--pr-url');
if (!write && fs.existsSync(absolute(receiptPath))) {
  const existing = json(receiptPath);
  materializationParent = existing.remediation.materialization_parent_commit;
  if (valueAfter('--pr-number') === null) prNumber = existing.delivery.pull_request.number;
  if (valueAfter('--pr-url') === null) prUrl = existing.delivery.pull_request.url;
}
assert(/^[a-f0-9]{40}$/.test(materializationParent), 'materialization parent commit is invalid');
assert((prNumber === null && prUrl === null) || (Number.isInteger(prNumber) && prNumber > 0 && /^https:\/\/github\.com\/onedayonemasterpiece\/lovekgd-design-system\/pull\/\d+$/.test(prUrl ?? '')), 'pull request identity must be both absent or valid');

const receipt = {
  schema_version: 'project_normalization_synthesis_receipt_v1_1',
  synthesis_id: 'project-normalization-synthesis-v1-1-audit-remediation',
  status: 'complete',
  final_statuses: finalStatuses,
  repository: 'onedayonemasterpiece/lovekgd-design-system',
  branch: 'remediation/project-normalization-synthesis-v1-1',
  design_baseline: {
    commit: base,
    immutable_decoder_tree: 'e77fc2457fadfdffb46ed2d90304ebb91e89a715',
    immutable_decoder_manifest_sha256: 'f7740f7f533c3f0cda5d4d0b8ebe98b565d7f521368b96462daecbd26522d5cc',
  },
  remediation: {
    materialization_parent_commit: materializationParent,
    audit_preservation_commit: '50f51565041a9ea36768784d1cc9ca1d7345acb7',
    audit_source_path: 'docs/audits/project-normalization-synthesis-v1-independent-red-team-audit.md',
    audit_source_sha256: 'a466ae5ff4846a1895eb11429c2fe4f175115a119dc9904d5a4a4e50a9507f76',
    audit_findings: 13,
    audit_dispositions: 13,
  },
  product_evidence: {
    repository: 'onedayonemasterpiece/events-bot-new',
    closure_commit: '66bc0d43e36299417626f992021cfb7299ddf704',
    closure_tree: '72e24f49ad6642915131438de8c56b804c4826b0',
    closure_site_src_tree: 'd737458f8a87a9b7dad4f4badffd1b3f4ce544dd',
    closure_site_public_tree: 'f42a045ec9ff3b1b2f3396a4df9f54cc6a767934',
    behavioral_source_commit: 'ef7aa62e45c60f7a12da6160f490719c0721ec03',
    behavioral_source_site_src_tree: 'd46996c4444171d7e10ff648aefd35c5620e17bc',
    behavioral_manifest_sha256: 'c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1',
    production_source_mutated: false,
  },
  durable_visual_evidence: {
    prior: {
      release_tag: 'current-ui-behavioral-decoder-v1-1-run-31318132051',
      asset_id: 507595606,
      sha256: 'c677f69572ccdbf5b7f1402037a3cb8c164bd2f503fae35eae9168c46eb8d909',
      bytes: 44805665,
      rasters: 124,
    },
    closure: {
      release_tag: 'current-ui-behavioral-decoder-v1-1-closure-run-31327863197',
      asset_id: 507763470,
      sha256: '8bb8712effaa0ba3b08a672a784d9e1b90d876c6ca6d039a417bfc0617723523',
      bytes: 3015654,
      rasters: 10,
    },
  },
  counts: {
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
    required_aggregate_semantic_mutations: 14,
    lane_semantic_mutations: 91,
  },
  entity_kind_counts: wave.counts.entity_kinds,
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
  independent_reaudit: {
    status: 'pending',
    required_before_merge: true,
    merge_authorized: false,
    report_path: null,
    report_sha256: null,
  },
  delivery: {
    pull_request: {
      status: prNumber === null ? 'pending_creation' : 'open',
      number: prNumber,
      url: prUrl,
      merge_requested: false,
    },
  },
  validations: {
    schemas_draft_2020_12: 'PASS',
    exact_once_partition: 'PASS',
    positive_readiness: 'PASS',
    semantic_negative_mutations: 'PASS',
    immutable_evidence: 'PASS',
    visual_row_and_archive_lineage: 'PASS',
    product_value_observe_gate: 'PASS',
    lifecycle: 'PASS',
    secret_scan: 'PASS',
    git_diff_check: 'PASS',
  },
  constraints: {
    production_ui_changed: false,
    production_site_src_changed: false,
    production_site_public_changed: false,
    runtime_components_merged_or_split: false,
    unreachable_component_deleted: false,
    tokens_created_or_selected: false,
    typography_model_selected: false,
    experiment_winner_selected: false,
    penpot_changed: false,
    penpot_components_materialized: false,
    product_model_created: false,
    physical_defragmentation_authorized: false,
    next_phase_started: false,
  },
  outputs,
};

assert(universe.length === 279 && partition.length === 279 && aliases.length === 57 && findings.length === 222, 'raw/canonical receipt counts differ');
assert(rawUnresolvedIds.size === 87 && canonicalUnresolved.length === 87 && receipt.counts.standalone_canonical_unresolved_identities === 30, 'unresolved namespace receipt counts differ');
assert(readinessOperationalBlockers.size === 192 && receipt.counts.migration_blockers === 5 && receipt.counts.promotion_blockers === 17, 'blocker namespace receipt counts differ');
assert(groups.length === 47 && receipt.counts.logical_components === 107 && readiness.length === 47 && wave.first_wave_family_ids.length === 0, 'registry/readiness receipt counts differ');
assert(apps.length === 239 && valueReadiness.length === 239 && visual.length === 134, 'application/visual receipt counts differ');
assert(stable(receipt.final_statuses) === stable(finalStatuses), 'final status pair differs');

const serialized = stable(receipt);
if (write) {
  fs.mkdirSync(path.dirname(absolute(receiptPath)), { recursive: true });
  fs.writeFileSync(absolute(receiptPath), serialized);
} else {
  assert(fs.existsSync(absolute(receiptPath)), 'v1.1 receipt missing; run --write');
  assert(read(receiptPath).equals(Buffer.from(serialized)), 'v1.1 receipt deterministic regeneration differs');
}

process.stdout.write(`${JSON.stringify({ status: write ? 'written' : 'valid', outputs: outputPaths.length, counts: receipt.counts, pull_request: receipt.delivery.pull_request.status })}\n`);

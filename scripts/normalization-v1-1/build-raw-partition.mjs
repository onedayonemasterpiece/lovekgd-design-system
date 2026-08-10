#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '../..');
const WRITE = process.argv.includes('--write');
const CHECK = process.argv.includes('--check') || !WRITE;
const SELF_TEST = process.argv.includes('--self-test');

const BASE_COMMIT = '317938bc72cf7a47ea798b2614d92d3d285dd97a';
const DESIGN_REPOSITORY = 'onedayonemasterpiece/lovekgd-design-system';
const EVENTS_REPOSITORY = 'onedayonemasterpiece/events-bot-new';
const AUDIT_SHA256 = 'a466ae5ff4846a1895eb11429c2fe4f175115a119dc9904d5a4a4e50a9507f76';
const DECODER_MANIFEST_SHA256 = 'f7740f7f533c3f0cda5d4d0b8ebe98b565d7f521368b96462daecbd26522d5cc';
const BEHAVIOR_MANIFEST_SHA256 = 'c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1';
const FRAGMENTATION_SHA256 = '967f1b2a5a58fe16d03b03ef47955d1ff61ca044fa9f9a6e1cf6b50ba4021cbb';

const DECODER_ROOT = 'catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc';
const BEHAVIOR_ROOT = 'catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc';
const PATHS = {
  audit: 'docs/audits/project-normalization-synthesis-v1-independent-red-team-audit.md',
  auditDisposition: 'docs/audits/project-normalization-synthesis-v1-audit-disposition.md',
  decoderManifest: `${DECODER_ROOT}/manifest.json`,
  behaviorManifest: `${BEHAVIOR_ROOT}/manifest.json`,
  probes: `${BEHAVIOR_ROOT}/breakpoint-probe-observations.jsonl`,
  unresolved: `${BEHAVIOR_ROOT}/unresolved.jsonl`,
  fragmentation: 'catalog/normalization/evidence/fragmentation-report.jsonl',
  findings: 'catalog/normalization/findings-disposition.jsonl',
  universe: 'catalog/normalization/authoritative-raw-universe.jsonl',
  aliases: 'catalog/normalization/raw-alias-registry.jsonl',
  partition: 'catalog/normalization/raw-to-canonical-partition.jsonl',
  schema: 'contracts/normalization/findings-disposition.v1.schema.json'
};

const fail = (message) => {
  throw new Error(message);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};
const absolute = (relativePath) => path.join(ROOT, relativePath);
const readBuffer = (relativePath) => fs.readFileSync(absolute(relativePath));
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const fileSha256 = (relativePath) => sha256(readBuffer(relativePath));
const readJson = (relativePath) => JSON.parse(readBuffer(relativePath).toString('utf8'));
const readJsonl = (relativePath) => readBuffer(relativePath)
  .toString('utf8')
  .split('\n')
  .map((raw, index) => raw ? {
    row: JSON.parse(raw),
    raw,
    line: index + 1,
    record_sha256: sha256(Buffer.from(raw, 'utf8'))
  } : null)
  .filter(Boolean);

const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, stable(item)]));
  }
  return value;
};
const stableJson = (value) => JSON.stringify(stable(value));
const serializeJsonl = (rows) => rows.map((row) => `${stableJson(row)}\n`).join('');
const unique = (rows, field, label) => {
  const values = rows.map((row) => row[field]);
  assert(values.every((value) => typeof value === 'string' && value.length > 0), `${label}: empty ${field}`);
  assert(new Set(values).size === values.length, `${label}: duplicate ${field}`);
};
const countBy = (values) => Object.fromEntries(values.reduce((counts, value) => {
  counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}, new Map()));
const sorted = (values) => values.slice().sort((left, right) => left.localeCompare(right));
const equalSets = (left, right) => stableJson(sorted([...left])) === stableJson(sorted([...right]));

assert(fileSha256(PATHS.audit) === AUDIT_SHA256, 'independent red-team audit bytes changed');
assert(fileSha256(PATHS.decoderManifest) === DECODER_MANIFEST_SHA256, 'immutable Decoder v1 manifest changed');
assert(fileSha256(PATHS.behaviorManifest) === BEHAVIOR_MANIFEST_SHA256, 'Behavioral v1.1 manifest changed');
assert(fileSha256(PATHS.fragmentation) === FRAGMENTATION_SHA256, 'fragmentation evidence changed');

const decoderManifest = readJson(PATHS.decoderManifest);
const behaviorManifest = readJson(PATHS.behaviorManifest);
const behaviorCommits = [{ role: 'behavioral_source', sha: behaviorManifest.source_sha }];
const decoderCommits = [
  { role: 'decoder_run_head', sha: decoderManifest.decoder.sha },
  { role: 'current_root_prelaunch', sha: decoderManifest.identity_planes.current_root_prelaunch.source_sha },
  { role: 'latest_checked_kaggle_candidate', sha: decoderManifest.identity_planes.latest_checked_kaggle_candidate.source_sha }
];
const allowedConfidence = new Set(['high', 'medium', 'low', 'not_assessed']);
const confidence = (level, basis) => ({
  level: allowedConfidence.has(level) ? level : 'not_assessed',
  basis
});
const runtimeEvidence = (status, refs, reason) => ({ status, refs: sorted([...new Set(refs)]), reason });

const rawRecords = [];
const rawSourceRows = new Map();
const legacyRefToRawId = new Map();
const addRaw = ({ rawKind, source, artifactPath, artifactSha256, locatorKind, sourceStatus,
  selection, evidenceOrigin, runtime, confidenceValue, legacySourceRef }) => {
  const sourceRecordId = source.row.id;
  assert(typeof sourceRecordId === 'string' && sourceRecordId, `${artifactPath}: source record has no id`);
  const rawIdentityId = `raw.${rawKind}.${sourceRecordId}`;
  const artifact = {
    repository: DESIGN_REPOSITORY,
    commit: BASE_COMMIT,
    path: artifactPath,
    file_sha256: artifactSha256,
    locator_kind: locatorKind,
    source_record_id: sourceRecordId,
    record_sha256: source.record_sha256
  };
  if (source.line != null) artifact.line = source.line;
  const emitted = {
    schema_version: 'normalization_raw_identity_v1',
    raw_identity_id: rawIdentityId,
    raw_kind: rawKind,
    source_record_id: sourceRecordId,
    source_status: sourceStatus,
    artifact,
    evidence_origin: evidenceOrigin,
    selection,
    runtime_evidence: runtime,
    confidence: confidenceValue,
    legacy_source_ref: legacySourceRef
  };
  rawRecords.push(emitted);
  rawSourceRows.set(rawIdentityId, source.row);
  assert(!legacyRefToRawId.has(legacySourceRef), `duplicate legacy source ref: ${legacySourceRef}`);
  legacyRefToRawId.set(legacySourceRef, rawIdentityId);
};

const probeFileSha = fileSha256(PATHS.probes);
assert(probeFileSha === behaviorManifest.outputs['breakpoint-probe-observations.jsonl'].sha256,
  'breakpoint probe output hash differs from manifest');
const probes = readJsonl(PATHS.probes);
assert(probes.length === 293, 'expected 293 breakpoint probes');
const terminalProbes = probes.filter(({ row }) => ['MISMATCH', 'UNREACHABLE_WITH_REASON'].includes(row.terminal_status));
assert(terminalProbes.length === 57, 'expected 57 non-PASS terminal probes');
for (const source of terminalProbes) {
  const { row } = source;
  addRaw({
    rawKind: 'behavioral_terminal_probe',
    source,
    artifactPath: PATHS.probes,
    artifactSha256: probeFileSha,
    locatorKind: 'jsonl_id',
    sourceStatus: row.terminal_status,
    selection: { predicate: 'terminal_status_in', allowed_values: ['MISMATCH', 'UNREACHABLE_WITH_REASON'] },
    evidenceOrigin: { repository: EVENTS_REPOSITORY, commits: behaviorCommits },
    runtime: runtimeEvidence(
      row.terminal_status === 'MISMATCH' ? 'runtime_observed' : 'not_observed_under_pinned_evidence',
      [row.id],
      row.terminal_reason
    ),
    confidenceValue: confidence('high', 'terminal browser probe preserved in the pinned Behavioral v1.1 closure'),
    legacySourceRef: `breakpoint-probe-observations.jsonl#${row.id}`
  });
}

const unresolvedFileSha = fileSha256(PATHS.unresolved);
assert(unresolvedFileSha === behaviorManifest.outputs['unresolved.jsonl'].sha256,
  'unresolved output hash differs from manifest');
const unresolved = readJsonl(PATHS.unresolved);
assert(unresolved.length === 87, 'expected 87 unresolved source rows');
for (const source of unresolved) {
  const { row } = source;
  const aliasStatus = row.status === 'MISMATCH'
    ? 'runtime_observed'
    : row.status === 'UNREACHABLE_WITH_REASON'
      ? 'not_observed_under_pinned_evidence'
      : 'not_observed_under_pinned_evidence';
  addRaw({
    rawKind: 'behavioral_unresolved',
    source,
    artifactPath: PATHS.unresolved,
    artifactSha256: unresolvedFileSha,
    locatorKind: 'jsonl_id',
    sourceStatus: row.status ?? row.kind,
    selection: { predicate: 'all_records' },
    evidenceOrigin: { repository: EVENTS_REPOSITORY, commits: behaviorCommits },
    runtime: runtimeEvidence(aliasStatus, [row.probe_id ?? row.id], row.observed_fact ?? row.reason ?? row.kind),
    confidenceValue: confidence('not_assessed', 'the unresolved ledger records a boundary or gap, not a positive semantic conclusion'),
    legacySourceRef: `unresolved.jsonl#${row.id}`
  });
}

const fragmentation = readJsonl(PATHS.fragmentation);
assert(fragmentation.length === 20, 'expected 20 fragmentation rows');
const fragmented = fragmentation.filter(({ row }) => row.status === 'fragmented');
assert(fragmented.length === 16, 'expected 16 fragmented rows');
for (const source of fragmented) {
  const { row } = source;
  addRaw({
    rawKind: 'fragmentation_candidate',
    source,
    artifactPath: PATHS.fragmentation,
    artifactSha256: FRAGMENTATION_SHA256,
    locatorKind: 'jsonl_id',
    sourceStatus: row.status,
    selection: { predicate: 'status_equals', value: 'fragmented' },
    evidenceOrigin: { repository: EVENTS_REPOSITORY, commits: decoderCommits },
    runtime: runtimeEvidence(row.observations?.length ? 'runtime_observed' : 'source_only', [row.id],
      'the fragmentation record retains its detailed source/runtime evidence without asserting equivalence'),
    confidenceValue: confidence(row.confidence, 'copied from the pinned fragmentation record'),
    legacySourceRef: `${PATHS.fragmentation}#${row.id}`
  });
}

const manifestJsonOutputs = (prefix) => Object.entries(decoderManifest.outputs)
  .filter(([outputPath]) => outputPath.startsWith(prefix) && outputPath.endsWith('.json'))
  .sort(([left], [right]) => left.localeCompare(right));
const contractOutputs = manifestJsonOutputs('candidate-contracts/');
const componentOutputs = manifestJsonOutputs('components/');
assert(contractOutputs.length === 12, 'expected 12 manifest-bound candidate contracts');
assert(componentOutputs.length === 107, 'expected 107 manifest-bound logical components');

const addManifestJsonRaw = (outputPath, output, rawKind, selectionPrefix) => {
  const artifactPath = `${DECODER_ROOT}/${outputPath}`;
  const bytes = readBuffer(artifactPath);
  assert(bytes.length === output.bytes, `${outputPath}: byte count differs from Decoder manifest`);
  assert(sha256(bytes) === output.sha256, `${outputPath}: hash differs from Decoder manifest`);
  const row = JSON.parse(bytes.toString('utf8'));
  addRaw({
    rawKind,
    source: { row, record_sha256: output.sha256 },
    artifactPath,
    artifactSha256: output.sha256,
    locatorKind: 'json_document',
    sourceStatus: rawKind === 'logical_component' ? row.disposition : row.normative_status,
    selection: { predicate: 'decoder_manifest_output_prefix', value: selectionPrefix },
    evidenceOrigin: { repository: EVENTS_REPOSITORY, commits: decoderCommits },
    runtime: rawKind === 'logical_component'
      ? runtimeEvidence(
        row.reachability === 'production-observed' ? 'runtime_observed'
          : row.reachability === 'lab-only' ? 'controlled_runtime_observed'
            : ['source-only', 'experiment-off'].includes(row.reachability) ? 'source_only'
              : 'not_observed_under_pinned_evidence',
        Array.isArray(row.runtime_evidence) ? row.runtime_evidence : [],
        `immutable Decoder v1 reachability: ${row.reachability}`
      )
      : runtimeEvidence('source_only', [row.id], 'candidate contract is AS-IS evidence and is not a promoted runtime contract'),
    confidenceValue: confidence(rawKind === 'logical_component' ? 'not_assessed' : row.confidence,
      rawKind === 'logical_component'
        ? 'logical component identity is preserved without promoting a semantic-family conclusion'
        : 'copied from the immutable candidate contract'),
    legacySourceRef: `${outputPath}#${row.id}`
  });
};
for (const [outputPath, output] of contractOutputs) addManifestJsonRaw(outputPath, output, 'candidate_as_is_contract', 'candidate-contracts/');
for (const [outputPath, output] of componentOutputs) addManifestJsonRaw(outputPath, output, 'logical_component', 'components/');

rawRecords.sort((left, right) => left.raw_identity_id.localeCompare(right.raw_identity_id));
unique(rawRecords, 'raw_identity_id', 'authoritative raw universe');
assert(rawRecords.length === 279, 'authoritative raw universe must contain 279 identities');
assert(stableJson(countBy(rawRecords.map((row) => row.raw_kind))) === stableJson({
  behavioral_terminal_probe: 57,
  behavioral_unresolved: 87,
  fragmentation_candidate: 16,
  candidate_as_is_contract: 12,
  logical_component: 107
}), 'authoritative raw kind counts differ');

const rawById = new Map(rawRecords.map((row) => [row.raw_identity_id, row]));
const probeById = new Map(probes.map(({ row }) => [row.id, row]));
const unresolvedAliasRows = unresolved.filter(({ row }) => typeof row.probe_id === 'string');
assert(unresolvedAliasRows.length === 57, 'expected 57 unresolved probe projections');
const aliases = unresolvedAliasRows.map(({ row: unresolvedRow }) => {
  const probe = probeById.get(unresolvedRow.probe_id);
  assert(probe, `${unresolvedRow.id}: missing referenced probe`);
  assert(['MISMATCH', 'UNREACHABLE_WITH_REASON'].includes(probe.terminal_status), `${unresolvedRow.id}: alias points to PASS probe`);
  assert(unresolvedRow.status === probe.terminal_status, `${unresolvedRow.id}: status differs from probe`);
  assert(unresolvedRow.observed_fact === probe.terminal_reason, `${unresolvedRow.id}: observed fact differs from probe`);
  assert(unresolvedRow.decision === probe.decision, `${unresolvedRow.id}: decision differs from probe`);
  assert(unresolvedRow.source_path === probe.source.path, `${unresolvedRow.id}: source path differs from probe`);
  assert(unresolvedRow.id === `unresolved.probe.${probe.id.slice('breakpoint.'.length)}`, `${unresolvedRow.id}: projection id differs from explicit probe link`);
  const suffix = probe.id.slice('breakpoint.'.length);
  return {
    schema_version: 'normalization_raw_alias_v1',
    alias_id: `alias.behavioral_probe_unresolved.${suffix}`,
    alias_type: 'behavioral_probe_unresolved_same_observation',
    primary_raw_identity_id: `raw.behavioral_terminal_probe.${probe.id}`,
    projection_raw_identity_id: `raw.behavioral_unresolved.${unresolvedRow.id}`,
    canonical_finding_id: `finding.behavioral.probe.${suffix}`,
    terminal_status: probe.terminal_status
  };
}).sort((left, right) => left.alias_id.localeCompare(right.alias_id));
unique(aliases, 'alias_id', 'raw alias registry');
assert(aliases.length === 57, 'raw alias registry must contain 57 pairs');
const aliasMemberIds = aliases.flatMap((alias) => [alias.primary_raw_identity_id, alias.projection_raw_identity_id]);
assert(new Set(aliasMemberIds).size === 114, 'a raw identity participates in more than one alias');
assert(aliasMemberIds.every((rawId) => rawById.has(rawId)), 'alias registry contains an unknown raw identity');
const aliasByMember = new Map();
for (const alias of aliases) {
  aliasByMember.set(alias.primary_raw_identity_id, { alias, member_role: 'primary_observation' });
  aliasByMember.set(alias.projection_raw_identity_id, { alias, member_role: 'unresolved_projection' });
}

const existingFindings = readJsonl(PATHS.findings).map(({ row }) => row);
assert(existingFindings.length === 222, 'expected 222 existing canonical findings');
unique(existingFindings, 'id', 'existing findings');
unique(existingFindings, 'canonical_issue_key', 'existing findings');
const rawToFinding = new Map();
for (const finding of existingFindings) {
  assert(Array.isArray(finding.source_record_refs) && finding.source_record_refs.length > 0, `${finding.id}: source_record_refs missing`);
  for (const sourceRef of finding.source_record_refs) {
    const rawId = legacyRefToRawId.get(sourceRef);
    assert(rawId, `${finding.id}: source ref is outside the authoritative universe: ${sourceRef}`);
    assert(!rawToFinding.has(rawId), `${finding.id}: duplicate raw identity mapping: ${rawId}`);
    rawToFinding.set(rawId, finding.id);
  }
}
assert(rawToFinding.size === 279, 'existing finding refs do not cover 279 unique raw identities');
assert(equalSets(rawToFinding.keys(), rawById.keys()), 'existing finding refs differ from the authoritative universe');

const partition = rawRecords.map((raw) => {
  const aliasMember = aliasByMember.get(raw.raw_identity_id);
  const canonicalFindingId = rawToFinding.get(raw.raw_identity_id);
  if (aliasMember) {
    assert(canonicalFindingId === aliasMember.alias.canonical_finding_id,
      `${raw.raw_identity_id}: existing canonical target differs from typed alias`);
    return {
      schema_version: 'normalization_raw_partition_v1',
      raw_identity_id: raw.raw_identity_id,
      canonical_finding_id: canonicalFindingId,
      mapping_kind: 'typed_alias_member',
      alias_id: aliasMember.alias.alias_id,
      member_role: aliasMember.member_role
    };
  }
  return {
    schema_version: 'normalization_raw_partition_v1',
    raw_identity_id: raw.raw_identity_id,
    canonical_finding_id: canonicalFindingId,
    mapping_kind: 'direct',
    alias_id: null,
    member_role: 'independent'
  };
}).sort((left, right) => left.raw_identity_id.localeCompare(right.raw_identity_id));
unique(partition, 'raw_identity_id', 'raw partition');
assert(partition.length === 279, 'raw partition must contain 279 rows');
assert(partition.filter((row) => row.mapping_kind === 'direct').length === 165, 'raw partition must contain 165 direct members');
assert(partition.filter((row) => row.mapping_kind === 'typed_alias_member').length === 114, 'raw partition must contain 114 alias members');
const partitionByFinding = new Map();
for (const row of partition) {
  if (!partitionByFinding.has(row.canonical_finding_id)) partitionByFinding.set(row.canonical_finding_id, []);
  partitionByFinding.get(row.canonical_finding_id).push(row);
}
assert(partitionByFinding.size === 222, 'raw partition must target exactly 222 findings');
for (const [findingId, members] of partitionByFinding) {
  assert(members.length === 1 || members.length === 2, `${findingId}: invalid canonical partition cardinality`);
  if (members.length === 2) {
    assert(members.every((member) => member.mapping_kind === 'typed_alias_member'), `${findingId}: generic two-member canonicalization is forbidden`);
    assert(new Set(members.map((member) => member.alias_id)).size === 1, `${findingId}: alias members disagree on alias id`);
  } else {
    assert(members[0].mapping_kind === 'direct', `${findingId}: single-member alias is forbidden`);
  }
}

const standaloneOperational = new Map([
  ['experiment-winner-receipt', ['await_experiment_decision', 'Experiment treatment remains unaccepted until a decision receipt exists.']],
  ['keyboard-conformance-gap', ['await_accessibility_decision', 'The evidence records an accessibility decision or remediation gap.']],
  ['dynamic-region-disposition', ['fix_implementation', 'The pinned evidence records a concrete dynamic-state implementation gap.']],
  ['dynamic-recovery-gap', ['fix_implementation', 'The pinned evidence records a concrete recovery implementation gap.']],
  ['source-document-conflict', ['reconcile_requirement_runtime', 'Current source/runtime and the requirement document must be reconciled.']],
  ['controlled-runtime-layout-conflict', ['reconcile_requirement_runtime', 'The controlled runtime conflict requires requirement/runtime reconciliation.']],
  ['requirements-source-conflict', ['reconcile_requirement_runtime', 'The requirement and pinned implementation version conflict.']],
  ['media-requirement', ['reconcile_requirement_runtime', 'Observed media evidence is not a universal normative requirement.']],
  ['media-policy-conflict', ['reconcile_requirement_runtime', 'Consumer-local media policies require explicit requirement/runtime reconciliation.']],
  ['exact-behavioral-capture-blocker', ['investigate', 'The missing exact capture is retained as an investigation boundary.']],
  ['cta-provenance', ['investigate', 'Semantic provenance exists but exact runtime capture remains pending.']],
  ['loading-geometry', ['investigate', 'Exact loading geometry has not been established.']],
  ['observed-platform-behavior-enhancement', ['accepted_current_difference', 'The observed platform behavior is evidence-complete and not required by the current contract.']],
  ['dead-unreachable-state', ['preserve', 'Absence of invocation in the pinned evidence does not prove deletion eligibility.']]
]);
const operationalFor = (finding, memberRows) => {
  const sourceRows = memberRows.map((member) => rawSourceRows.get(member.raw_identity_id));
  if (finding.source_kind === 'behavioral_probe') {
    return finding.terminal_status === 'MISMATCH'
      ? ['decoder_issue', 'The terminal mismatch remains a decoder/probe reconciliation issue.']
      : ['investigate', 'Runtime reachability was not established; this is not deletion evidence.'];
  }
  if (finding.source_kind === 'behavioral_unresolved') {
    const kind = sourceRows[0].kind;
    const assignment = standaloneOperational.get(kind);
    assert(assignment, `${finding.id}: no operational assignment for unresolved kind ${kind}`);
    return assignment;
  }
  if (finding.source_kind === 'logical_component') {
    const disposition = sourceRows[0].disposition;
    if (disposition === 'experiment-only') {
      return ['await_experiment_decision', 'The implementation is experiment-only and no winner or decision receipt is accepted.'];
    }
    if (disposition === 'dead-unreachable') {
      return ['preserve', 'The immutable decoder conflates dead and unreachable; preserve until independent reachability and requirement reconciliation.'];
    }
    return ['preserve', 'Preserve the AS-IS logical component while semantic identity and migration decisions remain unaccepted.'];
  }
  if (finding.source_kind === 'fragmentation_candidate') {
    return ['split_identity_candidate', 'Fragmentation evidence identifies an identity-boundary candidate but authorizes no runtime split.'];
  }
  if (finding.source_kind === 'candidate_as_is_contract') {
    return finding.classification === 'unresolved_experiment'
      ? ['await_experiment_decision', 'The candidate depends on an unaccepted experiment decision.']
      : ['investigate', 'The immutable AS-IS candidate remains unresolved and normalization-disallowed.'];
  }
  fail(`${finding.id}: unsupported source_kind ${finding.source_kind}`);
};

const generatedFindings = existingFindings.map((finding) => {
  const members = partitionByFinding.get(finding.id);
  assert(members?.length, `${finding.id}: no raw partition members`);
  const rawIdentityIds = sorted(members.map((member) => member.raw_identity_id));
  const [operationalDisposition, operationalReason] = operationalFor(finding, members);
  const provenance = rawIdentityIds.map((rawId) => {
    const raw = rawById.get(rawId);
    return {
      raw_identity_id: rawId,
      source_repository: raw.evidence_origin.repository,
      source_commits: raw.evidence_origin.commits,
      artifact: {
        repository: raw.artifact.repository,
        commit: raw.artifact.commit,
        path: raw.artifact.path,
        sha256: raw.artifact.file_sha256,
        source_record_id: raw.source_record_id,
        record_sha256: raw.artifact.record_sha256
      },
      source_ids: [raw.source_record_id],
      runtime_evidence: raw.runtime_evidence,
      confidence: raw.confidence
    };
  });
  const clean = { ...finding };
  delete clean.raw_identity_ids;
  delete clean.operational_disposition;
  delete clean.operational_reason;
  delete clean.provenance;
  if (typeof clean.observed_fact !== 'string' || clean.observed_fact.length === 0) {
    const sourceRows = members.map((member) => rawSourceRows.get(member.raw_identity_id));
    clean.observed_fact = sourceRows.map((row) => row.observed_fact ?? row.reason).find((value) => typeof value === 'string' && value.length > 0);
  }
  assert(typeof clean.observed_fact === 'string' && clean.observed_fact.length > 0, `${finding.id}: observed fact is unavailable`);
  return {
    ...clean,
    schema_version: 'normalization_finding_disposition_v1',
    raw_identity_ids: rawIdentityIds,
    operational_disposition: operationalDisposition,
    operational_reason: operationalReason,
    provenance
  };
}).sort((left, right) => left.id.localeCompare(right.id));

const operationalEnum = new Set([
  'preserve', 'investigate', 'reconcile_requirement_runtime', 'fix_implementation',
  'split_identity_candidate', 'preserve_as_composition', 'await_product_model',
  'await_accessibility_decision', 'await_experiment_decision', 'deprecate_only_after_proof',
  'decoder_issue', 'accepted_current_difference'
]);
const findingsById = new Map(generatedFindings.map((finding) => [finding.id, finding]));
assert(findingsById.size === 222, 'generated findings must contain 222 unique IDs');
for (const finding of generatedFindings) {
  assert(operationalEnum.has(finding.operational_disposition), `${finding.id}: invalid operational disposition`);
  assert(finding.decision === 'NOT_MERGED' && finding.candidate_decision_accepted === false,
    `${finding.id}: boundary decision changed`);
  const expectedRawIds = sorted(partitionByFinding.get(finding.id).map((row) => row.raw_identity_id));
  assert(stableJson(finding.raw_identity_ids) === stableJson(expectedRawIds), `${finding.id}: raw reverse join differs`);
  assert(finding.provenance.length === expectedRawIds.length, `${finding.id}: provenance cardinality differs`);
  assert(finding.provenance.every((item, index) => item.raw_identity_id === expectedRawIds[index]),
    `${finding.id}: provenance/raw identity order differs`);
  if (finding.raw_identity_ids.some((rawId) => rawById.get(rawId).runtime_evidence.status === 'source_only')) {
    assert(!finding.provenance.some((item) => item.runtime_evidence.status === 'runtime_observed' && item.runtime_evidence.refs.length === 0),
      `${finding.id}: source-only evidence was relabeled runtime-observed`);
  }
}
const expectedOperationalCounts = {
  preserve: 104,
  investigate: 36,
  decoder_issue: 39,
  split_identity_candidate: 16,
  await_experiment_decision: 14,
  reconcile_requirement_runtime: 6,
  fix_implementation: 4,
  await_accessibility_decision: 2,
  accepted_current_difference: 1
};
assert(stableJson(countBy(generatedFindings.map((finding) => finding.operational_disposition))) === stableJson(expectedOperationalCounts),
  'operational disposition counts differ from the conservative reviewed mapping');

assert(fs.existsSync(absolute(PATHS.schema)), 'findings disposition schema missing');
const findingsSchema = readJson(PATHS.schema);
assert(findingsSchema.$schema === 'https://json-schema.org/draft/2020-12/schema', 'findings schema is not Draft 2020-12');
assert(findingsSchema.additionalProperties === false, 'findings schema must be closed');
const schemaProperties = new Set(Object.keys(findingsSchema.properties));
const schemaRequired = findingsSchema.required;
const schemaOperational = new Set(findingsSchema.properties.operational_disposition.enum);
const schemaBlocking = new Set(findingsSchema.properties.blocking_scope.enum);
const schemaBefore = new Set(findingsSchema.properties.must_resolve_before.enum);
for (const finding of generatedFindings) {
  assert(Object.keys(finding).every((key) => schemaProperties.has(key)), `${finding.id}: property absent from strict schema`);
  assert(schemaRequired.every((key) => key in finding), `${finding.id}: required schema property missing`);
  assert(schemaOperational.has(finding.operational_disposition), `${finding.id}: disposition absent from schema enum`);
  assert(schemaBlocking.has(finding.blocking_scope), `${finding.id}: blocking scope absent from schema enum`);
  assert(schemaBefore.has(finding.must_resolve_before), `${finding.id}: resolution stage absent from schema enum`);
  assert(finding.schema_version === findingsSchema.properties.schema_version.const, `${finding.id}: schema version differs`);
  assert(finding.provenance.length === finding.raw_identity_ids.length, `${finding.id}: schema provenance cardinality differs`);
  for (const provenance of finding.provenance) {
    for (const key of findingsSchema.$defs.provenance.required) {
      assert(key in provenance, `${finding.id}: provenance missing ${key}`);
    }
    assert(findingsSchema.$defs.runtimeEvidence.properties.status.enum.includes(provenance.runtime_evidence.status),
      `${finding.id}: invalid runtime evidence status`);
    assert(findingsSchema.$defs.confidence.properties.level.enum.includes(provenance.confidence.level),
      `${finding.id}: invalid confidence level`);
  }
}

for (const componentId of ['component.02effc1d8ab8434b', 'component.29e9aebbf63be827', 'component.d65fb5ef1db02f46']) {
  const finding = findingsById.get(`finding.decoder.${componentId}`);
  assert(finding, `${componentId}: unreachable component finding missing`);
  assert(finding.operational_disposition === 'preserve', `${componentId}: unreachable implementation is not preserved`);
  assert(finding.blocking_scope === 'migration' && finding.must_resolve_before === 'legacy_removal',
    `${componentId}: legacy-removal gate changed`);
  assert(finding.provenance.every((item) => item.runtime_evidence.status === 'not_observed_under_pinned_evidence'),
    `${componentId}: absence was mislabeled as runtime observation`);
}

const validatePartitionCandidate = (candidate) => {
  assert(candidate.length === rawRecords.length, 'mutation: partition row count differs');
  const ids = candidate.map((row) => row.raw_identity_id);
  assert(new Set(ids).size === ids.length, 'mutation: duplicate raw partition identity');
  assert(equalSets(ids, rawById.keys()), 'mutation: partition raw set differs from universe');
  const groups = new Map();
  for (const row of candidate) {
    assert(findingsById.has(row.canonical_finding_id), 'mutation: partition target is unknown');
    if (!groups.has(row.canonical_finding_id)) groups.set(row.canonical_finding_id, []);
    groups.get(row.canonical_finding_id).push(row);
    const aliasMember = aliasByMember.get(row.raw_identity_id);
    if (aliasMember) {
      assert(row.mapping_kind === 'typed_alias_member', 'mutation: alias member changed to direct mapping');
      assert(row.alias_id === aliasMember.alias.alias_id, 'mutation: alias id differs from registry');
      assert(row.canonical_finding_id === aliasMember.alias.canonical_finding_id, 'mutation: alias canonical target differs');
    } else {
      assert(row.mapping_kind === 'direct' && row.alias_id === null, 'mutation: generic aliasing is forbidden');
    }
  }
  assert(groups.size === generatedFindings.length, 'mutation: canonical target set differs');
  for (const members of groups.values()) {
    assert(members.length === 1 || (members.length === 2 && members.every((row) => row.mapping_kind === 'typed_alias_member')),
      'mutation: invalid canonical group cardinality');
  }
};
const validateAliasCandidate = (candidate) => {
  assert(candidate.length === aliases.length, 'mutation: alias count differs');
  unique(candidate, 'alias_id', 'mutation aliases');
  const members = candidate.flatMap((alias) => [alias.primary_raw_identity_id, alias.projection_raw_identity_id]);
  assert(new Set(members).size === 114, 'mutation: alias member reused');
  for (const alias of candidate) {
    const primary = rawSourceRows.get(alias.primary_raw_identity_id);
    const projection = rawSourceRows.get(alias.projection_raw_identity_id);
    assert(primary && projection, 'mutation: alias source missing');
    assert(projection.probe_id === primary.id, 'mutation: explicit probe link differs');
    assert(projection.status === primary.terminal_status, 'mutation: alias status differs');
    assert(projection.observed_fact === primary.terminal_reason, 'mutation: alias fact differs');
    assert(projection.source_path === primary.source.path, 'mutation: alias source path differs');
    assert(alias.canonical_finding_id === `finding.behavioral.probe.${primary.id.slice('breakpoint.'.length)}`,
      'mutation: alias canonical target differs');
  }
};
const validateFindingCandidate = (candidate) => {
  assert(candidate.length === generatedFindings.length, 'mutation: finding count differs');
  for (const finding of candidate) {
    assert(operationalEnum.has(finding.operational_disposition), 'mutation: finding lacks operational disposition');
    const expected = sorted(partitionByFinding.get(finding.id).map((row) => row.raw_identity_id));
    assert(stableJson(finding.raw_identity_ids) === stableJson(expected), 'mutation: finding raw reverse join differs');
    for (const item of finding.provenance) {
      const raw = rawById.get(item.raw_identity_id);
      assert(raw, 'mutation: finding provenance raw identity is unknown');
      assert(stableJson(item.runtime_evidence) === stableJson(raw.runtime_evidence),
        'mutation: runtime evidence differs from authoritative raw provenance');
      assert(item.artifact.path === raw.artifact.path && item.artifact.record_sha256 === raw.artifact.record_sha256,
        'mutation: artifact provenance differs from authoritative raw provenance');
    }
  }
};
validatePartitionCandidate(partition);
validateAliasCandidate(aliases);
validateFindingCandidate(generatedFindings);

let selfTestCount = 0;
if (SELF_TEST) {
  const expectReject = (label, callback) => {
    let rejected = false;
    try {
      callback();
    } catch {
      rejected = true;
    }
    assert(rejected, `semantic mutation was not rejected: ${label}`);
    selfTestCount += 1;
  };
  expectReject('missing one raw identity and duplicate another while preserving total', () => {
    const mutation = structuredClone(partition);
    mutation[0] = structuredClone(mutation[1]);
    validatePartitionCandidate(mutation);
  });
  expectReject('generic two-member canonicalization without typed alias', () => {
    const mutation = structuredClone(partition);
    const directIndexes = mutation.map((row, index) => row.mapping_kind === 'direct' ? index : -1).filter((index) => index >= 0);
    mutation[directIndexes[0]].canonical_finding_id = mutation[directIndexes[1]].canonical_finding_id;
    validatePartitionCandidate(mutation);
  });
  expectReject('swap an unresolved alias projection', () => {
    const mutation = structuredClone(aliases);
    [mutation[0].projection_raw_identity_id, mutation[1].projection_raw_identity_id] =
      [mutation[1].projection_raw_identity_id, mutation[0].projection_raw_identity_id];
    validateAliasCandidate(mutation);
  });
  expectReject('substitute a PASS probe for a terminal alias member', () => {
    const passProbe = probes.find(({ row }) => row.terminal_status === 'PASS').row;
    const mutation = structuredClone(aliases);
    mutation[0].primary_raw_identity_id = `raw.behavioral_terminal_probe.${passProbe.id}`;
    validateAliasCandidate(mutation);
  });
  expectReject('finding without operational disposition', () => {
    const mutation = structuredClone(generatedFindings);
    delete mutation[0].operational_disposition;
    validateFindingCandidate(mutation);
  });
  expectReject('source-only or not-observed provenance relabeled runtime-observed', () => {
    const mutation = structuredClone(generatedFindings);
    const finding = mutation.find((row) => row.provenance.some((item) => item.runtime_evidence.status === 'source_only'));
    const item = finding.provenance.find((entry) => entry.runtime_evidence.status === 'source_only');
    item.runtime_evidence.status = 'runtime_observed';
    validateFindingCandidate(mutation);
  });
  expectReject('artifact record hash substituted', () => {
    const mutation = structuredClone(generatedFindings);
    mutation[0].provenance[0].artifact.record_sha256 = '0'.repeat(64);
    validateFindingCandidate(mutation);
  });
}

const generated = new Map([
  [PATHS.universe, serializeJsonl(rawRecords)],
  [PATHS.aliases, serializeJsonl(aliases)],
  [PATHS.partition, serializeJsonl(partition)],
  [PATHS.findings, serializeJsonl(generatedFindings)]
]);

if (WRITE) {
  for (const [relativePath, content] of generated) {
    fs.mkdirSync(path.dirname(absolute(relativePath)), { recursive: true });
    fs.writeFileSync(absolute(relativePath), content);
  }
}
if (CHECK) {
  for (const [relativePath, content] of generated) {
    assert(fs.existsSync(absolute(relativePath)), `${relativePath}: generated output missing`);
    assert(readBuffer(relativePath).equals(Buffer.from(content, 'utf8')), `${relativePath}: deterministic regeneration differs`);
  }
}

assert(fs.existsSync(absolute(PATHS.auditDisposition)), 'audit disposition missing');
const auditDisposition = readBuffer(PATHS.auditDisposition).toString('utf8');
for (let number = 1; number <= 13; number += 1) {
  const id = `AUD-PN-${String(number).padStart(3, '0')}`;
  assert(auditDisposition.includes(id), `audit disposition missing ${id}`);
}
assert(auditDisposition.includes(AUDIT_SHA256), 'audit disposition is not bound to the byte-exact audit');
const auditRows = auditDisposition.split('\n').filter((line) => /^\| AUD-PN-\d{3} \|/.test(line));
assert(auditRows.length === 13, 'audit disposition must contain exactly 13 finding rows');
const auditSeverities = countBy(auditRows.map((line) => line.split('|')[2].trim()));
assert(stableJson(auditSeverities) === stableJson({ HIGH: 7, MEDIUM: 5, LOW: 1 }),
  'audit severity allocation differs from the independent report');
const auditDispositionEnums = new Set(['accepted', 'accepted_with_reframing', 'deferred_with_gate', 'rejected_with_evidence']);
for (const line of auditRows) {
  const disposition = line.split('|')[3].trim().replaceAll('`', '');
  assert(auditDispositionEnums.has(disposition), `invalid audit disposition: ${disposition}`);
}

process.stdout.write(`${JSON.stringify({
  status: WRITE ? 'written' : 'valid',
  raw_identities: rawRecords.length,
  aliases: aliases.length,
  partition_rows: partition.length,
  canonical_findings: generatedFindings.length,
  operational_dispositions: expectedOperationalCounts,
  semantic_mutations_rejected: selfTestCount
})}\n`);

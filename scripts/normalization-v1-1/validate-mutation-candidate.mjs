#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  NormalizationValidationError,
  rejectNormalization,
  structuredValidationError,
} from './structured-validation-error.mjs';

const ANALYSIS = 'catalog/normalization/analysis-group-registry.jsonl';
const FAMILIES = 'catalog/normalization/family-registry.jsonl';
const APPLICATIONS = 'catalog/normalization/component-applications.jsonl';
const RAW = 'catalog/normalization/authoritative-raw-universe.jsonl';
const PARTITION = 'catalog/normalization/raw-to-canonical-partition.jsonl';
const ALIASES = 'catalog/normalization/raw-alias-registry.jsonl';
const FINDINGS = 'catalog/normalization/findings-disposition.jsonl';
const READINESS = 'catalog/normalization/semantic-readiness.jsonl';
const WAVE = 'catalog/normalization/family-wave-plan.json';
const EVENT_MEDIA = 'catalog/normalization/families/event-media/dossier.json';
const DECODER_MANIFEST = 'catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/manifest.json';
const DECODER_MANIFEST_SHA256 = 'f7740f7f533c3f0cda5d4d0b8ebe98b565d7f521368b96462daecbd26522d5cc';

export const MANDATORY_VALIDATION_CONTRACTS = Object.freeze([
  { id: 'missing-component-path', code: 'PNV_COMPONENT_PATH_UNRESOLVED', stage: 'analysis-registry' },
  { id: 'duplicate-stable-id', code: 'PNV_STABLE_ID_DUPLICATE', stage: 'analysis-registry' },
  { id: 'broken-foreign-key', code: 'PNV_FOREIGN_KEY_UNRESOLVED', stage: 'application-registry' },
  { id: 'missing-raw-identity', code: 'PNV_RAW_IDENTITY_MISSING', stage: 'raw-universe' },
  { id: 'duplicate-raw-identity', code: 'PNV_RAW_IDENTITY_DUPLICATE', stage: 'raw-universe' },
  { id: 'invalid-typed-alias', code: 'PNV_TYPED_ALIAS_INVALID', stage: 'alias-registry' },
  { id: 'finding-without-operational-disposition', code: 'PNV_OPERATIONAL_DISPOSITION_MISSING', stage: 'findings-disposition' },
  { id: 'invented-product-id', code: 'PNV_PRODUCT_ID_UNAUTHORIZED', stage: 'product-value' },
  { id: 'promotion-ready-while-product-model-pending', code: 'PNV_PROMOTION_PENDING_PRODUCT_MODEL', stage: 'product-value' },
  { id: 'accepted-experiment-without-decision-receipt', code: 'PNV_EXPERIMENT_DECISION_RECEIPT_MISSING', stage: 'product-value' },
  { id: 'source-only-relabeled-runtime-observed', code: 'PNV_RUNTIME_EVIDENCE_PROVENANCE_MISMATCH', stage: 'evidence-lineage' },
  { id: 'immutable-decoder-v1-mutation', code: 'PNV_IMMUTABLE_DECODER_MANIFEST_DRIFT', stage: 'immutable-evidence' },
  { id: 'incomplete-family-dossier-dimensions', code: 'PNV_EVENT_MEDIA_DIMENSION_MISSING', stage: 'event-media-dossier' },
  { id: 'first-wave-without-positive-readiness', code: 'PNV_FIRST_WAVE_READINESS_VIOLATION', stage: 'wave-readiness' },
]);

const absolute = (root, relative) => path.join(root, relative);
const read = (root, relative) => fs.readFileSync(absolute(root, relative));
const json = (root, relative) => JSON.parse(read(root, relative).toString('utf8'));
const jsonl = (root, relative) => read(root, relative).toString('utf8').split('\n').filter(Boolean).map(JSON.parse);
const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const stable = (value) => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.entries(item).sort(([left], [right]) => left.localeCompare(right)))
  : item);
const pointer = (relative, rowIndex, suffix = '') => `${relative}#/${rowIndex}${suffix}`;

const fail = (contract, record, recordPath, diagnostic) => rejectNormalization({
  code: contract.code,
  stage: contract.stage,
  record,
  path: recordPath,
  diagnostic,
});

const validateMissingComponentPath = (root, contract) => {
  const groups = jsonl(root, ANALYSIS);
  const familyRows = jsonl(root, FAMILIES);
  const componentPaths = new Map(familyRows.flatMap((family) => family.implementations
    .map((implementation) => [implementation.component_id, implementation.logical_path])));
  for (const [rowIndex, group] of groups.entries()) {
    for (const [memberIndex, componentId] of group.member_component_ids.entries()) {
      if (!componentPaths.has(componentId) || !componentPaths.get(componentId)) {
        fail(contract, group.id, pointer(ANALYSIS, rowIndex, `/member_component_ids/${memberIndex}`),
          `${group.id}: component ${componentId} has no pinned logical path`);
      }
    }
  }
};

const validateDuplicateStableId = (root, contract) => {
  const groups = jsonl(root, ANALYSIS);
  const firstIndex = new Map();
  for (const [rowIndex, group] of groups.entries()) {
    if (firstIndex.has(group.id)) {
      fail(contract, group.id, pointer(ANALYSIS, rowIndex, '/id'),
        `${group.id}: stable id duplicates row ${firstIndex.get(group.id)}`);
    }
    firstIndex.set(group.id, rowIndex);
  }
};

const validateBrokenForeignKey = (root, contract) => {
  const applications = jsonl(root, APPLICATIONS);
  const familyIds = new Set(jsonl(root, FAMILIES).map((family) => family.id));
  for (const [rowIndex, application] of applications.entries()) {
    if (!familyIds.has(application.family_id)) {
      fail(contract, application.id, pointer(APPLICATIONS, rowIndex, '/family_id'),
        `${application.id}: family_id ${application.family_id} does not resolve`);
    }
  }
};

const validateMissingRawIdentity = (root, contract) => {
  const rawIds = new Set(jsonl(root, RAW).map((row) => row.raw_identity_id));
  const partition = jsonl(root, PARTITION);
  for (const [rowIndex, row] of partition.entries()) {
    if (!rawIds.has(row.raw_identity_id)) {
      fail(contract, row.raw_identity_id, pointer(PARTITION, rowIndex, '/raw_identity_id'),
        `${row.raw_identity_id}: partition identity is absent from the authoritative raw universe`);
    }
  }
};

const validateDuplicateRawIdentity = (root, contract) => {
  const rows = jsonl(root, RAW);
  const firstIndex = new Map();
  for (const [rowIndex, row] of rows.entries()) {
    if (firstIndex.has(row.raw_identity_id)) {
      fail(contract, row.raw_identity_id, pointer(RAW, rowIndex, '/raw_identity_id'),
        `${row.raw_identity_id}: raw identity duplicates row ${firstIndex.get(row.raw_identity_id)}`);
    }
    firstIndex.set(row.raw_identity_id, rowIndex);
  }
};

const validateTypedAlias = (root, contract) => {
  const aliases = jsonl(root, ALIASES);
  const rawIds = new Set(jsonl(root, RAW).map((row) => row.raw_identity_id));
  for (const [rowIndex, alias] of aliases.entries()) {
    const prefix = 'raw.behavioral_terminal_probe.breakpoint.';
    const suffix = alias.primary_raw_identity_id.startsWith(prefix)
      ? alias.primary_raw_identity_id.slice(prefix.length)
      : null;
    const expectedProjection = suffix ? `raw.behavioral_unresolved.unresolved.probe.${suffix}` : null;
    const expectedFinding = suffix ? `finding.behavioral.probe.${suffix}` : null;
    const valid = Boolean(suffix)
      && alias.projection_raw_identity_id === expectedProjection
      && alias.canonical_finding_id === expectedFinding
      && rawIds.has(alias.primary_raw_identity_id)
      && rawIds.has(alias.projection_raw_identity_id);
    if (!valid) {
      fail(contract, alias.alias_id, pointer(ALIASES, rowIndex),
        `${alias.alias_id}: typed alias primary, projection, and canonical suffixes do not bind the same observation`);
    }
  }
};

const validateOperationalDisposition = (root, contract) => {
  const findings = jsonl(root, FINDINGS);
  for (const [rowIndex, finding] of findings.entries()) {
    if (typeof finding.operational_disposition !== 'string' || finding.operational_disposition.length === 0) {
      fail(contract, finding.id, pointer(FINDINGS, rowIndex, '/operational_disposition'),
        `${finding.id}: operational_disposition is required`);
    }
  }
};

const PRODUCT_ID_FIELDS = ['need_ids', 'job_ids', 'journey_ids', 'outcome_ids', 'metric_ids', 'guardrail_ids', 'capability_ids'];
const validateInventedProductId = (root, contract) => {
  const applications = jsonl(root, APPLICATIONS);
  for (const [rowIndex, application] of applications.entries()) {
    if (application.product_authority?.registry_status !== 'absent-at-pinned-commit') continue;
    for (const field of PRODUCT_ID_FIELDS) {
      if (Array.isArray(application[field]) && application[field].length > 0) {
        fail(contract, application.id, pointer(APPLICATIONS, rowIndex, `/${field}/0`),
          `${application.id}: ${field} cannot assert ${application[field][0]} while the product registry is absent`);
      }
    }
  }
};

const validatePendingPromotion = (root, contract) => {
  const applications = jsonl(root, APPLICATIONS);
  for (const [rowIndex, application] of applications.entries()) {
    if (application.value_evidence_status === 'pending_product_model' && application.promotion_ready === true) {
      fail(contract, application.id, pointer(APPLICATIONS, rowIndex, '/promotion_ready'),
        `${application.id}: pending_product_model cannot be promotion_ready`);
    }
  }
};

const validateExperimentalDecisionReceipt = (root, contract) => {
  const applications = jsonl(root, APPLICATIONS);
  for (const [rowIndex, application] of applications.entries()) {
    const claimsAcceptedEvidence = application.value_evidence_mode === 'experimental'
      && (application.experimental_evidence_satisfied === true
        || application.value_evidence_status === 'validated_quantitative');
    if (claimsAcceptedEvidence && !application.decision_receipt) {
      fail(contract, application.id, pointer(APPLICATIONS, rowIndex, '/decision_receipt'),
        `${application.id}: accepted experimental evidence requires a decision receipt`);
    }
  }
};

const validateRuntimeEvidenceLineage = (root, contract) => {
  const findings = jsonl(root, FINDINGS);
  const provenanceByRawId = new Map(findings.flatMap((finding) => finding.provenance
    .map((provenance) => [provenance.raw_identity_id, provenance.runtime_evidence])));
  const rows = jsonl(root, RAW);
  for (const [rowIndex, row] of rows.entries()) {
    const provenance = provenanceByRawId.get(row.raw_identity_id);
    if (provenance && stable(provenance) !== stable(row.runtime_evidence)) {
      fail(contract, row.raw_identity_id, pointer(RAW, rowIndex, '/runtime_evidence'),
        `${row.raw_identity_id}: runtime evidence differs from its canonical provenance join`);
    }
  }
};

const validateImmutableDecoder = (root, contract) => {
  const actual = sha256(read(root, DECODER_MANIFEST));
  if (actual !== DECODER_MANIFEST_SHA256) {
    fail(contract, 'immutable-decoder-v1', DECODER_MANIFEST,
      `immutable decoder manifest sha256 ${actual} differs from ${DECODER_MANIFEST_SHA256}`);
  }
};

const EVENT_MEDIA_DIMENSIONS = [
  'ratios',
  'media_types',
  'fit_crop_and_focus',
  'upscale_tiny_source',
  'fallback_states',
  'loading_and_layout',
  'responsive_art_direction',
  'provenance',
  'runtime_evidence',
  'blocker_refs',
];
const validateEventMediaDimensions = (root, contract) => {
  const dossier = json(root, EVENT_MEDIA);
  for (const [rowIndex, consumer] of dossier.consumer_policy_matrix.entries()) {
    for (const dimension of EVENT_MEDIA_DIMENSIONS) {
      if (!Object.hasOwn(consumer, dimension)) {
        fail(contract, consumer.consumer_id, `${EVENT_MEDIA}#/consumer_policy_matrix/${rowIndex}/${dimension}`,
          `${consumer.consumer_id}: required dossier dimension ${dimension} is missing`);
      }
    }
  }
};

const validateFirstWaveReadiness = (root, contract) => {
  const wave = json(root, WAVE);
  const readinessByFamily = new Map(jsonl(root, READINESS).map((row) => [row.analysis_group_id, row]));
  const waveByFamily = new Map(wave.families.map((row) => [row.family_id, row]));
  for (const [selectionIndex, familyId] of wave.first_wave_family_ids.entries()) {
    const readiness = readinessByFamily.get(familyId);
    const waveRow = waveByFamily.get(familyId);
    const ready = readiness?.strict_ready === true
      && readiness.status === 'READY_FOR_CONTRACT_DECISION'
      && readiness.eligible_for_scoring === true
      && waveRow?.strict_ready === true
      && waveRow.eligible_for_scoring === true
      && waveRow.selected_first_wave === true;
    if (!ready) {
      fail(contract, familyId, `${WAVE}#/first_wave_family_ids/${selectionIndex}`,
        `${familyId}: first-wave selection lacks positive strict readiness`);
    }
  }
};

const validators = new Map([
  ['missing-component-path', validateMissingComponentPath],
  ['duplicate-stable-id', validateDuplicateStableId],
  ['broken-foreign-key', validateBrokenForeignKey],
  ['missing-raw-identity', validateMissingRawIdentity],
  ['duplicate-raw-identity', validateDuplicateRawIdentity],
  ['invalid-typed-alias', validateTypedAlias],
  ['finding-without-operational-disposition', validateOperationalDisposition],
  ['invented-product-id', validateInventedProductId],
  ['promotion-ready-while-product-model-pending', validatePendingPromotion],
  ['accepted-experiment-without-decision-receipt', validateExperimentalDecisionReceipt],
  ['source-only-relabeled-runtime-observed', validateRuntimeEvidenceLineage],
  ['immutable-decoder-v1-mutation', validateImmutableDecoder],
  ['incomplete-family-dossier-dimensions', validateEventMediaDimensions],
  ['first-wave-without-positive-readiness', validateFirstWaveReadiness],
]);

export const validateNamedMutationInvariant = (root, caseId) => {
  const contract = MANDATORY_VALIDATION_CONTRACTS.find((item) => item.id === caseId);
  if (!contract) throw new Error(`unknown mandatory mutation case: ${caseId}`);
  validators.get(caseId)(path.resolve(root), contract);
  return { status: 'PASS', case_id: caseId, code: contract.code, stage: contract.stage };
};

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const valueAfter = (flag) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : null;
  };
  const root = path.resolve(valueAfter('--root') ?? '.');
  const caseId = valueAfter('--case');
  try {
    const result = validateNamedMutationInvariant(root, caseId);
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    if (error instanceof NormalizationValidationError) {
      process.stderr.write(`${JSON.stringify(structuredValidationError(error))}\n`);
      process.exitCode = 1;
    } else {
      throw error;
    }
  }
}

#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const WRITE = process.argv.includes('--write');
const SELF_TEST = process.argv.includes('--self-test');

const PATHS = {
  legacyRegistry: 'catalog/normalization/family-registry.jsonl',
  applications: 'catalog/normalization/component-applications.jsonl',
  findings: 'catalog/normalization/findings-disposition.jsonl',
  decisionQueue: 'catalog/normalization/decision-queue.jsonl',
  behaviorContracts: 'catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/behavior-contracts.jsonl',
  analysisSchema: 'contracts/normalization/analytical-entity-kinds.v1.schema.json',
  readinessSchema: 'contracts/normalization/semantic-readiness.v1.schema.json',
  analysisRegistry: 'catalog/normalization/analysis-group-registry.jsonl',
  readiness: 'catalog/normalization/semantic-readiness.jsonl',
  wave: 'catalog/normalization/family-wave-plan.json'
};

const KIND_MAP = Object.freeze({
  'family.amber-artifacts': 'component_catalog',
  'family.auth-runtime': 'runtime_enabler',
  'family.bottom-navigation': 'unresolved_boundary',
  'family.brand-identity': 'foundation',
  'family.breadcrumb-navigation': 'component_identity_family',
  'family.calendar-action': 'component_identity_family',
  'family.design-system-primitives': 'component_catalog',
  'family.editorial-collections': 'page_surface',
  'family.event-actions': 'component_catalog',
  'family.event-detail-presentation': 'page_surface',
  'family.event-facts-and-participants': 'component_catalog',
  'family.event-grid': 'composition_pattern',
  'family.event-keyboard-navigation': 'runtime_enabler',
  'family.event-media': 'composition_pattern',
  'family.event-occurrence': 'component_catalog',
  'family.event-preview-representations': 'component_catalog',
  'family.event-token-medallions': 'composition_pattern',
  'family.exhibitions-personal': 'page_surface',
  'family.favorites-saved-events': 'page_surface',
  'family.focus-diagnostics': 'evidence_or_lab_group',
  'family.focus-egg-artifacts': 'component_catalog',
  'family.focus-group-workflows': 'workflow',
  'family.home-feed': 'composition_pattern',
  'family.home-hero': 'component_identity_family',
  'family.home-quick-navigation': 'component_identity_family',
  'family.iconography': 'foundation',
  'family.interest-club-catalog': 'component_catalog',
  'family.interest-profile': 'component_identity_family',
  'family.listing-chronology': 'component_catalog',
  'family.listing-controls-and-navigation': 'component_catalog',
  'family.listing-rails': 'composition_pattern',
  'family.listing-surfaces': 'page_surface',
  'family.mobile-menu': 'composition_pattern',
  'family.onboarding-placement': 'runtime_enabler',
  'family.personalization-and-feed': 'workflow',
  'family.popular-listing-layouts': 'composition_pattern',
  'family.prelaunch-surface': 'page_surface',
  'family.pwa-lifecycle': 'runtime_enabler',
  'family.search-results': 'page_surface',
  'family.site-footer': 'component_identity_family',
  'family.social-share': 'component_identity_family',
  'family.toast-region': 'component_identity_family',
  'family.transport-bus-schedule': 'component_identity_family',
  'family.transport-kaup-schedule': 'unresolved_boundary',
  'family.transport-rail-schedule': 'component_identity_family',
  'family.unusual-listing': 'page_surface',
  'family.weather-date-context': 'component_identity_family'
});

const KINDS = Object.freeze([
  'component_identity_family',
  'component_catalog',
  'composition_pattern',
  'page_surface',
  'workflow',
  'runtime_enabler',
  'foundation',
  'evidence_or_lab_group',
  'unresolved_boundary'
]);
const RELATION_BY_KIND = Object.freeze({
  component_catalog: 'catalog_member',
  component_identity_family: 'candidate_implementation_of_identity',
  composition_pattern: 'composition_member',
  evidence_or_lab_group: 'evidence_instrument',
  foundation: 'foundation_resource',
  page_surface: 'surface_member',
  runtime_enabler: 'runtime_enabler',
  unresolved_boundary: 'unresolved_relation',
  workflow: 'workflow_stage'
});

const CHECK_IDS = Object.freeze([
  'entity_kind_component_identity',
  'semantic_role_contract',
  'explicit_non_goals',
  'requirement_provenance_reconciled',
  'identity_boundary',
  'anatomy_contract',
  'content_model_contract',
  'implementation_membership',
  'consumer_application_census',
  'route_surface_context',
  'state_event_contract',
  'responsive_container_contract',
  'accessibility_contract',
  'runtime_visual_reconciliation',
  'operational_finding_closure',
  'unresolved_decision_blockers_absent',
  'candidate_contract_review',
  'migration_and_rollback',
  'evidence_refs_exist',
  'media_consumer_policy',
  'loading_recovery',
  'experiment_decision',
  'product_model_dependency'
]);

const CORE_CHECKS = new Set(CHECK_IDS.slice(0, 19));
const NAMED_KIND_ASSERTIONS = Object.freeze({
  'family.design-system-primitives': 'component_catalog',
  'family.event-detail-presentation': 'page_surface',
  'family.focus-group-workflows': 'workflow',
  'family.listing-controls-and-navigation': 'component_catalog',
  'family.personalization-and-feed': 'workflow',
  'family.brand-identity': 'foundation',
  'family.event-media': 'composition_pattern',
  'family.event-token-medallions': 'composition_pattern',
  'family.bottom-navigation': 'unresolved_boundary'
});

const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const absolute = (relative) => path.join(ROOT, relative);
const readJson = (relative) => JSON.parse(fs.readFileSync(absolute(relative), 'utf8'));
const readJsonl = (relative) => fs.readFileSync(absolute(relative), 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, item]) => [key, stable(item)]));
  return value;
};
const stableJson = (value) => JSON.stringify(stable(value));
const prettyJson = (value) => `${JSON.stringify(stable(value), null, 2)}\n`;
const jsonl = (rows) => rows.map((row) => `${stableJson(row)}\n`).join('');
const sorted = (values) => values.slice().sort((left, right) => left.localeCompare(right));
const countBy = (values) => Object.fromEntries([...values.reduce((map, value) => {
  map.set(value, (map.get(value) ?? 0) + 1);
  return map;
}, new Map())].sort(([left], [right]) => left.localeCompare(right)));
const same = (left, right) => stableJson(left) === stableJson(right);
const unique = (values, label) => assert(new Set(values).size === values.length, `${label}: duplicate value`);

const analysisSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://lovekgd.example/contracts/normalization/analytical-entity-kinds.v1.schema.json',
  title: 'Normalization analytical group and candidate entity-kind record v1.1',
  type: 'object',
  additionalProperties: false,
  required: [
    'schema_version', 'id', 'record_kind', 'entity_kind', 'label', 'member_component_ids',
    'member_relations', 'semantic_identity_claim', 'canonical_component_identity_accepted',
    'classification_evidence_refs', 'operational_findings', 'operational_finding_counts',
    'decision', 'candidate_decision_accepted', 'physical_operation_authorized'
  ],
  properties: {
    schema_version: { const: 'normalization_analysis_group_v1_1' },
    id: { type: 'string', pattern: '^family\\.' },
    record_kind: { const: 'analytical_group' },
    entity_kind: { enum: KINDS },
    label: { type: 'string', minLength: 1 },
    member_component_ids: {
      type: 'array', minItems: 1, uniqueItems: true,
      items: { type: 'string', pattern: '^component\\.' }
    },
    member_relations: {
      type: 'array', minItems: 1,
      items: {
        type: 'object', additionalProperties: false,
        required: ['component_id', 'relation_kind', 'status', 'evidence_refs'],
        properties: {
          component_id: { type: 'string', pattern: '^component\\.' },
          relation_kind: { enum: sorted(Object.values(RELATION_BY_KIND)) },
          status: { const: 'analytical_candidate_not_accepted' },
          evidence_refs: { type: 'array', minItems: 1, uniqueItems: true, items: { type: 'string', minLength: 1 } }
        }
      }
    },
    semantic_identity_claim: { enum: ['candidate_identity_not_accepted', 'not_a_component_identity', 'unresolved'] },
    canonical_component_identity_accepted: { const: false },
    classification_evidence_refs: { type: 'array', minItems: 2, uniqueItems: true, items: { type: 'string', minLength: 1 } },
    operational_findings: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['finding_id', 'classification', 'operational_disposition', 'blocking_scope', 'must_resolve_before'],
        properties: {
          finding_id: { type: 'string', pattern: '^finding\\.' },
          classification: { type: 'string', minLength: 1 },
          operational_disposition: { type: 'string', minLength: 1 },
          blocking_scope: { type: 'string', minLength: 1 },
          must_resolve_before: { type: 'string', minLength: 1 }
        }
      }
    },
    operational_finding_counts: { $ref: '#/$defs/findingCounts' },
    decision: { const: 'NOT_MERGED' },
    candidate_decision_accepted: { const: false },
    physical_operation_authorized: { const: false }
  },
  $defs: {
    stringCounts: { type: 'object', additionalProperties: { type: 'integer', minimum: 1 } },
    findingCounts: {
      type: 'object', additionalProperties: false,
      required: ['total', 'by_classification', 'by_operational_disposition', 'by_blocking_scope'],
      properties: {
        total: { type: 'integer', minimum: 1 },
        by_classification: { $ref: '#/$defs/stringCounts' },
        by_operational_disposition: { $ref: '#/$defs/stringCounts' },
        by_blocking_scope: { $ref: '#/$defs/stringCounts' }
      }
    }
  }
};

const readinessSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://lovekgd.example/contracts/normalization/semantic-readiness.v1.schema.json',
  title: 'Positive semantic readiness record v1.1',
  type: 'object',
  additionalProperties: false,
  required: [
    'schema_version', 'id', 'analysis_group_id', 'entity_kind', 'checklist', 'operational_blocker_refs',
    'not_ready_reason_codes', 'status', 'strict_ready', 'eligible_for_scoring', 'score',
    'selected_first_wave', 'decision', 'promotion_ready'
  ],
  properties: {
    schema_version: { const: 'normalization_semantic_readiness_v1_1' },
    id: { type: 'string', pattern: '^readiness\\.family\\.' },
    analysis_group_id: { type: 'string', pattern: '^family\\.' },
    entity_kind: { enum: KINDS },
    checklist: {
      type: 'array', minItems: CHECK_IDS.length, maxItems: CHECK_IDS.length,
      items: {
        type: 'object', additionalProperties: false,
        required: ['check_id', 'applicability', 'status', 'assertion', 'evidence_refs'],
        properties: {
          check_id: { enum: CHECK_IDS },
          applicability: { enum: ['REQUIRED', 'CONDITIONAL', 'NOT_APPLICABLE'] },
          status: { enum: ['PASS', 'BLOCKED', 'NOT_APPLICABLE_WITH_REASON'] },
          assertion: { type: 'string', minLength: 1 },
          evidence_refs: { type: 'array', minItems: 1, uniqueItems: true, items: { type: 'string', minLength: 1 } }
        },
        allOf: [
          {
            if: { properties: { applicability: { const: 'NOT_APPLICABLE' } }, required: ['applicability'] },
            then: { properties: { status: { const: 'NOT_APPLICABLE_WITH_REASON' } } },
            else: { properties: { status: { enum: ['PASS', 'BLOCKED'] } } }
          }
        ]
      }
    },
    operational_blocker_refs: { type: 'array', uniqueItems: true, items: { type: 'string', pattern: '^finding\\.' } },
    not_ready_reason_codes: { type: 'array', minItems: 1, uniqueItems: true, items: { type: 'string', minLength: 1 } },
    status: { enum: ['NOT_READY', 'READY_FOR_CONTRACT_DECISION'] },
    strict_ready: { type: 'boolean' },
    eligible_for_scoring: { type: 'boolean' },
    score: { type: ['integer', 'null'], minimum: 0 },
    selected_first_wave: { type: 'boolean' },
    decision: { const: 'NOT_MERGED' },
    promotion_ready: { const: false }
  },
  allOf: [
    {
      if: { properties: { strict_ready: { const: false } }, required: ['strict_ready'] },
      then: {
        properties: {
          status: { const: 'NOT_READY' },
          eligible_for_scoring: { const: false },
          score: { type: 'null' },
          selected_first_wave: { const: false }
        }
      }
    },
    {
      if: { properties: { strict_ready: { const: true } }, required: ['strict_ready'] },
      then: {
        properties: {
          entity_kind: { const: 'component_identity_family' },
          status: { const: 'READY_FOR_CONTRACT_DECISION' },
          eligible_for_scoring: { const: true },
          score: { type: 'integer', minimum: 0 }
        }
      }
    }
  ]
};

const legacyFamilies = readJsonl(PATHS.legacyRegistry).sort((left, right) => left.id.localeCompare(right.id));
const applications = readJsonl(PATHS.applications);
const findings = readJsonl(PATHS.findings);
const decisions = readJsonl(PATHS.decisionQueue);
const behaviorContracts = readJsonl(PATHS.behaviorContracts);
const familyById = new Map(legacyFamilies.map((row) => [row.id, row]));
const findingsByFamily = new Map(legacyFamilies.map((row) => [row.id, []]));
for (const finding of findings) for (const familyId of finding.family_ids) {
  assert(findingsByFamily.has(familyId), `${finding.id}: unknown family ${familyId}`);
  findingsByFamily.get(familyId).push(finding);
}
for (const rows of findingsByFamily.values()) rows.sort((left, right) => left.id.localeCompare(right.id));
const applicationsByFamily = new Map(legacyFamilies.map((row) => [row.id, []]));
for (const application of applications) {
  assert(applicationsByFamily.has(application.family_id), `${application.id}: unknown family ${application.family_id}`);
  applicationsByFamily.get(application.family_id).push(application);
}
for (const rows of applicationsByFamily.values()) rows.sort((left, right) => left.id.localeCompare(right.id));
const decisionsByFamily = new Map(legacyFamilies.map((row) => [row.id, []]));
for (const decision of decisions) {
  assert(decisionsByFamily.has(decision.family_id), `${decision.id}: unknown decision family ${decision.family_id}`);
  decisionsByFamily.get(decision.family_id).push(decision);
}
for (const rows of decisionsByFamily.values()) rows.sort((left, right) => left.id.localeCompare(right.id));

const knownComponentIds = new Set(legacyFamilies.flatMap((row) => row.implementations.map((item) => item.component_id)));
const knownFindingIds = new Set(findings.map((row) => row.id));
const knownApplicationIds = new Set(applications.map((row) => row.id));
const knownDecisionIds = new Set(decisions.map((row) => row.id));
const knownBehaviorIds = new Set(behaviorContracts.map((row) => row.id));
const knownAuditIds = new Set(Array.from({ length: 13 }, (_, index) => `AUD-PN-${String(index + 1).padStart(3, '0')}`));
const knownAuthorityRefs = new Set(legacyFamilies.flatMap((row) => [
  ...(row.requirement_provenance ?? []),
  ...(row.readiness_evidence?.hard_gate_inputs?.product_model_dependency_refs ?? [])
]));
const evidenceRefExists = (ref) => {
  if (knownAuditIds.has(ref) || knownComponentIds.has(ref) || knownFindingIds.has(ref)
    || knownApplicationIds.has(ref) || knownDecisionIds.has(ref) || knownBehaviorIds.has(ref)
    || knownAuthorityRefs.has(ref)) return true;
  if (ref.startsWith('family-registry.jsonl#')) return familyById.has(ref.slice('family-registry.jsonl#'.length));
  return false;
};
const assertEvidenceRefsResolve = (refs, label) => {
  assert(Array.isArray(refs) && refs.length > 0, `${label}: evidence is empty`);
  for (const ref of refs) assert(evidenceRefExists(ref), `${label}: unresolved evidence ref ${ref}`);
};

const findingProjection = (finding) => ({
  finding_id: finding.id,
  classification: finding.classification,
  operational_disposition: finding.operational_disposition,
  blocking_scope: finding.blocking_scope,
  must_resolve_before: finding.must_resolve_before
});

const findingCounts = (rows) => ({
  total: rows.length,
  by_classification: countBy(rows.map((row) => row.classification)),
  by_operational_disposition: countBy(rows.map((row) => row.operational_disposition)),
  by_blocking_scope: countBy(rows.map((row) => row.blocking_scope))
});

const semanticClaim = (kind) => kind === 'component_identity_family'
  ? 'candidate_identity_not_accepted'
  : kind === 'unresolved_boundary' ? 'unresolved' : 'not_a_component_identity';

const buildAnalysis = () => legacyFamilies.map((family) => {
  const entityKind = KIND_MAP[family.id];
  assert(entityKind, `${family.id}: missing entity kind`);
  const componentIds = sorted(family.implementations.map((item) => item.component_id));
  const linkedFindings = findingsByFamily.get(family.id);
  return {
    schema_version: 'normalization_analysis_group_v1_1',
    id: family.id,
    record_kind: 'analytical_group',
    entity_kind: entityKind,
    label: family.label,
    member_component_ids: componentIds,
    member_relations: componentIds.map((componentId) => ({
      component_id: componentId,
      relation_kind: RELATION_BY_KIND[entityKind],
      status: 'analytical_candidate_not_accepted',
      evidence_refs: [componentId, `family-registry.jsonl#${family.id}`]
    })),
    semantic_identity_claim: semanticClaim(entityKind),
    canonical_component_identity_accepted: false,
    classification_evidence_refs: sorted([
      'AUD-PN-006',
      `family-registry.jsonl#${family.id}`,
      ...componentIds
    ]),
    operational_findings: linkedFindings.map(findingProjection),
    operational_finding_counts: findingCounts(linkedFindings),
    decision: 'NOT_MERGED',
    candidate_decision_accepted: false,
    physical_operation_authorized: false
  };
});

const check = (checkId, applicability, status, assertionText, evidenceRefs) => ({
  check_id: checkId,
  applicability,
  status,
  assertion: assertionText,
  evidence_refs: sorted([...new Set(evidenceRefs)])
});

const buildChecklist = (family, entityKind, linkedFindings, familyApplications) => {
  const familyRef = `family-registry.jsonl#${family.id}`;
  const componentRefs = sorted(family.implementations.map((item) => item.component_id));
  const findingRefs = linkedFindings.map((item) => item.id);
  const evidence = (...refs) => refs.flat().filter(Boolean);
  const contractFindings = linkedFindings.filter((item) => item.source_kind === 'candidate_as_is_contract');
  const blockingFindings = linkedFindings.filter((item) => item.blocking_scope !== 'none');
  const pendingDecisions = decisionsByFamily.get(family.id).filter((item) => item.status === 'pending');
  const unresolvedDecisionRefs = sorted([...new Set([
    ...blockingFindings.map((item) => item.id),
    ...pendingDecisions.map((item) => item.id)
  ])]);
  const requirementRefs = family.requirement_provenance ?? [];
  const behaviorRefs = family.states_events.behavior_contract_refs ?? [];
  const terminalCounts = family.responsive_container_behavior.terminal_probe_counts ?? {};
  const terminalTotal = Object.values(terminalCounts).reduce((sum, value) => sum + value, 0);
  const terminalClean = terminalTotal > 0 && !terminalCounts.MISMATCH && !terminalCounts.UNREACHABLE_WITH_REASON;
  const observed = family.implementations.some((item) => item.reachability === 'production-observed');
  const applicationEvidence = familyApplications.length
    ? familyApplications.map((item) => item.id)
    : componentRefs;
  const hasMedia = (family.media.source_rules ?? []).length > 0;
  const hasLoading = (family.loading_recovery.dynamic_region_refs ?? []).length > 0;
  const hasExperiment = (family.experiments.refs ?? []).length > 0
    || linkedFindings.some((item) => item.operational_disposition === 'await_experiment_decision');
  const productRefs = family.readiness_evidence.hard_gate_inputs.product_model_dependency_refs ?? [];

  const rows = [];
  rows.push(check('entity_kind_component_identity', 'REQUIRED',
    entityKind === 'component_identity_family' ? 'PASS' : 'BLOCKED',
    entityKind === 'component_identity_family'
      ? 'The analytical classification is a candidate component identity; this does not accept the identity.'
      : `The analytical group is ${entityKind}, so it cannot enter component-family scoring.`,
    evidence('AUD-PN-006', familyRef, componentRefs)));
  rows.push(check('semantic_role_contract', 'REQUIRED', contractFindings.length ? 'PASS' : 'BLOCKED',
    contractFindings.length
      ? 'A candidate AS-IS contract records a semantic role, but its review status is evaluated separately.'
      : 'No candidate AS-IS contract positively closes the semantic role.',
    evidence(contractFindings.map((item) => item.id), familyRef)));
  rows.push(check('explicit_non_goals', 'REQUIRED', 'BLOCKED',
    'No accepted component contract explicitly binds family-specific non-goals.',
    evidence('AUD-PN-003', familyRef, contractFindings.map((item) => item.id))));
  rows.push(check('requirement_provenance_reconciled', 'REQUIRED', 'BLOCKED',
    'Pinned authority labels exist, but no family-specific receipt reconciles requirements with the candidate semantic boundary.',
    evidence('AUD-PN-003', familyRef, requirementRefs)));
  rows.push(check('identity_boundary', 'REQUIRED', 'BLOCKED',
    'No accepted receipt proves identity, variant equivalence, or a closed merge/split boundary.',
    evidence('AUD-PN-006', familyRef, componentRefs)));
  rows.push(check('anatomy_contract', 'REQUIRED', 'BLOCKED',
    `Anatomy remains ${family.anatomy.status}; source extraction is not accepted contract closure.`,
    evidence('AUD-PN-003', familyRef, componentRefs)));
  rows.push(check('content_model_contract', 'REQUIRED', 'BLOCKED',
    'No accepted content model binds props, slots, limits, valid values, invalid combinations and stress fixtures.',
    evidence('AUD-PN-003', familyRef, contractFindings.map((item) => item.id))));
  rows.push(check('implementation_membership', 'REQUIRED', 'PASS',
    'The immutable 107-component census maps every member exactly once to this analytical group.',
    evidence(componentRefs, familyRef)));
  rows.push(check('consumer_application_census', 'REQUIRED', 'PASS',
    familyApplications.length
      ? 'Concrete component/consumer applications reconcile with the legacy analytical group.'
      : 'The no-application state is explicit in the immutable component census and is not deletion evidence.',
    evidence(applicationEvidence, familyRef)));
  rows.push(check('route_surface_context', 'REQUIRED', 'PASS',
    'Consumer and route contexts are explicitly retained as analytical evidence.',
    evidence(familyRef, applicationEvidence)));
  rows.push(check('state_event_contract', 'REQUIRED', behaviorRefs.length ? 'PASS' : 'BLOCKED',
    behaviorRefs.length
      ? 'At least one pinned behavior contract is linked.'
      : 'No positive behavior contract is linked.',
    evidence(behaviorRefs, familyRef)));
  rows.push(check('responsive_container_contract', 'REQUIRED', terminalClean ? 'PASS' : 'BLOCKED',
    terminalClean
      ? 'Pinned terminal coverage contains positive observations and no mismatch or unreachable terminal.'
      : terminalTotal
        ? 'Terminal coverage contains a mismatch or unreachable result and is not positive closure.'
        : 'No positive terminal probe coverage is linked.',
    evidence(findingRefs, familyRef)));
  rows.push(check('accessibility_contract', 'REQUIRED', 'BLOCKED',
    `Accessibility target status remains ${family.accessibility.target_contract_status}.`,
    evidence(findingRefs, familyRef)));
  rows.push(check('runtime_visual_reconciliation', 'REQUIRED', observed && terminalClean ? 'PASS' : 'BLOCKED',
    observed && terminalClean
      ? 'Production observation and clean terminal coverage are both present.'
      : 'Production observation plus clean terminal and visual reconciliation is not positively proven.',
    evidence(findingRefs, componentRefs, familyRef)));
  rows.push(check('operational_finding_closure', 'REQUIRED', blockingFindings.length ? 'BLOCKED' : 'PASS',
    blockingFindings.length
      ? 'Typed operational findings remain blocking beyond observation-only scope.'
      : 'All typed operational findings for the group are non-blocking.',
    evidence(blockingFindings.map((item) => item.id), findingRefs, familyRef)));
  rows.push(check('unresolved_decision_blockers_absent', 'REQUIRED', unresolvedDecisionRefs.length ? 'BLOCKED' : 'PASS',
    unresolvedDecisionRefs.length
      ? 'Typed blocking findings or pending decision-queue records remain unresolved.'
      : 'The typed finding join and decision queue contain no unresolved decision blocker for this group.',
    evidence(unresolvedDecisionRefs, 'AUD-PN-003', familyRef)));
  rows.push(check('candidate_contract_review', 'REQUIRED', 'BLOCKED',
    contractFindings.length
      ? 'Candidate evidence remains unaccepted; no superseding positive review receipt closes all normalization gaps.'
      : 'No reviewed candidate contract and positive decision dossier are bound.',
    evidence(contractFindings.map((item) => item.id), familyRef)));
  rows.push(check('migration_and_rollback', 'REQUIRED', 'BLOCKED',
    'Only analysis-level rollback feasibility is recorded; no accepted reversible migration map and rollback receipt exist.',
    evidence('AUD-PN-009', familyRef, blockingFindings.map((item) => item.id))));
  const precedingEvidenceRefs = rows.flatMap((item) => item.evidence_refs);
  for (const ref of precedingEvidenceRefs) assert(evidenceRefExists(ref), `${family.id}/evidence_refs_exist: unresolved evidence ref ${ref}`);
  rows.push(check('evidence_refs_exist', 'REQUIRED', 'PASS',
    'Every evidence reference in the positive checklist resolves to a pinned catalog identity or declared authority reference.',
    evidence('AUD-PN-003', familyRef)));
  rows.push(check('media_consumer_policy', hasMedia ? 'CONDITIONAL' : 'NOT_APPLICABLE',
    hasMedia ? 'BLOCKED' : 'NOT_APPLICABLE_WITH_REASON',
    hasMedia
      ? 'Media rules exist, but consumer-scoped vocabulary, policy and review closure are not positively complete.'
      : 'No media rule is present in this analytical group; applicability was explicitly evaluated.',
    evidence(findingRefs, familyRef, family.id === 'family.event-media' ? 'AUD-PN-004' : [])));
  rows.push(check('loading_recovery', hasLoading ? 'CONDITIONAL' : 'NOT_APPLICABLE',
    hasLoading ? 'BLOCKED' : 'NOT_APPLICABLE_WITH_REASON',
    hasLoading
      ? 'A dynamic region exists, but loading and recovery review is not positively closed.'
      : 'No dynamic region is linked; applicability was explicitly evaluated.',
    evidence(findingRefs, familyRef)));
  rows.push(check('experiment_decision', hasExperiment ? 'CONDITIONAL' : 'NOT_APPLICABLE',
    hasExperiment ? 'BLOCKED' : 'NOT_APPLICABLE_WITH_REASON',
    hasExperiment
      ? 'The experiment has no accepted winner decision receipt.'
      : 'No experiment decision is required for this group.',
    evidence(findingRefs, familyRef)));
  rows.push(check('product_model_dependency', 'CONDITIONAL', productRefs.length ? 'BLOCKED' : 'PASS',
    productRefs.length
      ? 'Target semantics depend on the absent authoritative product model.'
      : 'No family-specific product-model dependency is asserted; the global observe gate still forbids promotion.',
    evidence(productRefs, familyRef)));
  assert(rows.length === CHECK_IDS.length, `${family.id}: checklist length drift`);
  assert(same(rows.map((row) => row.check_id), CHECK_IDS), `${family.id}: checklist order drift`);
  for (const item of rows) assertEvidenceRefsResolve(item.evidence_refs, `${family.id}/${item.check_id}`);
  return rows;
};

const extraReasons = (familyId) => {
  if (familyId === 'family.brand-identity') return ['foundation-not-component-identity', 'behavior-contract-missing', 'terminal-probe-coverage-missing'];
  if (familyId === 'family.event-media') return [
    'composition-not-component-identity', 'media-vocabulary-incomplete', 'consumer-policy-incomplete',
    'candidate-human-review-pending', 'normalization-disallowed', 'candidate-recommendation-unresolved'
  ];
  if (familyId === 'family.event-token-medallions') return [
    'composition-not-component-identity', 'domain-taxonomy-incomplete', 'semantic-boundary-incomplete',
    'consumer-geometry-decision-pending', 'accessibility-closure-incomplete'
  ];
  return [];
};

const buildReadiness = () => legacyFamilies.map((family) => {
  const entityKind = KIND_MAP[family.id];
  const linkedFindings = findingsByFamily.get(family.id);
  const checklist = buildChecklist(family, entityKind, linkedFindings, applicationsByFamily.get(family.id));
  const blockedChecks = checklist.filter((item) => item.status === 'BLOCKED').map((item) => `check-blocked:${item.check_id}`);
  const operationalBlockers = sorted(linkedFindings.filter((item) => item.blocking_scope !== 'none').map((item) => item.id));
  return {
    schema_version: 'normalization_semantic_readiness_v1_1',
    id: `readiness.${family.id}`,
    analysis_group_id: family.id,
    entity_kind: entityKind,
    checklist,
    operational_blocker_refs: operationalBlockers,
    not_ready_reason_codes: sorted([...new Set([...blockedChecks, ...extraReasons(family.id)])]),
    status: 'NOT_READY',
    strict_ready: false,
    eligible_for_scoring: false,
    score: null,
    selected_first_wave: false,
    decision: 'NOT_MERGED',
    promotion_ready: false
  };
});

const buildWave = (analysis, readiness) => ({
  schema_version: 'project_normalization_family_wave_plan_v1_1',
  decision: 'NOT_MERGED',
  algorithm: {
    gate_order: ['positive_semantic_readiness', 'score_eligible_only', 'sort', 'take_up_to_maximum'],
    positive_ready_rule: 'entity_kind is component_identity_family AND every required/applicable positive checklist item passes AND operational_blocker_refs is empty',
    blocker_absence_is_sufficient: false,
    score_non_ready_families: false,
    minimum_family_count: 0,
    maximum_family_count: 4,
    bucket: '0=>0, 1=>1, 2..3=>2, 4..7=>3, 8..15=>4, >=16=>5',
    score_formula: 'round(sum(factor_0_to_5 * weight) / 5), evaluated only after the positive gate',
    tie_break: ['score_desc', 'evidence_completeness_desc', 'blast_radius_safety_desc', 'family_id_asc'],
    weights: {
      blast_radius_safety: 5,
      consumer_reach: 10,
      dependency_leverage: 15,
      evidence_completeness: 20,
      experiment_readiness: 5,
      finding_urgency: 10,
      product_model_independence: 5,
      product_value_readiness: 5,
      reversibility: 10,
      semantic_clarity: 15
    }
  },
  counts: {
    analytical_groups: analysis.length,
    component_memberships: analysis.reduce((sum, row) => sum + row.member_component_ids.length, 0),
    strict_ready: readiness.filter((row) => row.strict_ready).length,
    eligible_for_scoring: readiness.filter((row) => row.eligible_for_scoring).length,
    selected_first_wave: readiness.filter((row) => row.selected_first_wave).length,
    not_ready: readiness.filter((row) => !row.strict_ready).length,
    entity_kinds: countBy(analysis.map((row) => row.entity_kind))
  },
  families: readiness.map((row) => ({
    id: `wave.${row.analysis_group_id}`,
    family_id: row.analysis_group_id,
    entity_kind: row.entity_kind,
    readiness_id: row.id,
    readiness_status: row.status,
    strict_ready: row.strict_ready,
    eligible_for_scoring: row.eligible_for_scoring,
    score: row.score,
    selected_first_wave: row.selected_first_wave,
    operational_blocker_refs: row.operational_blocker_refs,
    not_ready_reason_codes: row.not_ready_reason_codes,
    decision: 'NOT_MERGED',
    promotion_ready: false
  })),
  eligible_family_ids: [],
  first_wave_family_ids: [],
  promotion_ready_family_ids: [],
  product_value_gate_mode: 'observe'
});

const validate = ({ analysis, readiness, wave }) => {
  assert(legacyFamilies.length === 47, 'legacy family census must contain 47 rows');
  assert(Object.keys(KIND_MAP).length === 47, 'kind map must contain 47 rows');
  assert(same(sorted([...new Set(Object.values(KIND_MAP))]), sorted(KINDS)), 'entity-kind map does not use the exact v1.1 enum');
  assert(same(sorted(Object.keys(KIND_MAP)), legacyFamilies.map((row) => row.id)), 'kind map differs from legacy family census');
  unique(analysis.map((row) => row.id), 'analysis groups');
  assert(analysis.length === 47, 'analysis registry must contain 47 rows');
  assert(same(analysis.map((row) => row.id), legacyFamilies.map((row) => row.id)), 'analysis group IDs/order differ');
  const expectedKindCounts = {
    component_catalog: 10,
    component_identity_family: 11,
    composition_pattern: 7,
    evidence_or_lab_group: 1,
    foundation: 2,
    page_surface: 8,
    runtime_enabler: 4,
    unresolved_boundary: 2,
    workflow: 2
  };
  assert(same(countBy(analysis.map((row) => row.entity_kind)), expectedKindCounts), 'entity-kind counts differ');
  for (const [familyId, kind] of Object.entries(NAMED_KIND_ASSERTIONS)) {
    assert(analysis.find((row) => row.id === familyId)?.entity_kind === kind, `${familyId}: audit-mandated kind differs`);
  }

  const legacyComponentIds = sorted(legacyFamilies.flatMap((family) => family.implementations.map((item) => item.component_id)));
  const analysisComponentIds = sorted(analysis.flatMap((group) => group.member_component_ids));
  assert(legacyComponentIds.length === 107 && new Set(legacyComponentIds).size === 107, 'legacy component census differs from 107 unique IDs');
  assert(analysisComponentIds.length === 107 && new Set(analysisComponentIds).size === 107, 'analysis membership is not exact-once 107');
  assert(same(analysisComponentIds, legacyComponentIds), 'analysis membership set differs from legacy census');

  for (const group of analysis) {
    assert(group.record_kind === 'analytical_group', `${group.id}: record is not analytical`);
    assert(group.canonical_component_identity_accepted === false, `${group.id}: canonical identity accepted`);
    assert(group.decision === 'NOT_MERGED' && group.candidate_decision_accepted === false && group.physical_operation_authorized === false,
      `${group.id}: escaped analytical boundary`);
    assert(group.member_relations.length === group.member_component_ids.length, `${group.id}: relation/member cardinality differs`);
    assert(same(sorted(group.member_relations.map((item) => item.component_id)), group.member_component_ids), `${group.id}: member relation set differs`);
    assert(group.member_relations.every((item) => item.relation_kind === RELATION_BY_KIND[group.entity_kind]), `${group.id}: relation kind differs`);
    assertEvidenceRefsResolve(group.classification_evidence_refs, `${group.id}/classification_evidence_refs`);
    for (const relation of group.member_relations) assertEvidenceRefsResolve(relation.evidence_refs, `${group.id}/${relation.component_id}`);
    const expectedFindings = findingsByFamily.get(group.id).map(findingProjection);
    assert(same(group.operational_findings, expectedFindings), `${group.id}: typed operational finding cross-join differs`);
    assert(same(group.operational_finding_counts, findingCounts(findingsByFamily.get(group.id))), `${group.id}: finding counts differ`);
  }

  unique(readiness.map((row) => row.id), 'readiness rows');
  assert(readiness.length === 47, 'semantic readiness must contain 47 rows');
  assert(same(readiness.map((row) => row.analysis_group_id), analysis.map((row) => row.id)), 'readiness/analysis join differs');
  for (const row of readiness) {
    const group = analysis.find((item) => item.id === row.analysis_group_id);
    assert(group && row.entity_kind === group.entity_kind, `${row.id}: entity kind differs from analysis registry`);
    assert(row.checklist.length === CHECK_IDS.length && same(row.checklist.map((item) => item.check_id), CHECK_IDS), `${row.id}: checklist is incomplete`);
    for (const item of row.checklist) {
      assertEvidenceRefsResolve(item.evidence_refs, `${row.id}/${item.check_id}`);
      assert(item.assertion.length > 0, `${row.id}/${item.check_id}: assertion is empty`);
      if (CORE_CHECKS.has(item.check_id)) assert(item.applicability === 'REQUIRED', `${row.id}/${item.check_id}: core check not required`);
      if (item.applicability === 'NOT_APPLICABLE') assert(item.status === 'NOT_APPLICABLE_WITH_REASON', `${row.id}/${item.check_id}: invalid N/A state`);
      else assert(['PASS', 'BLOCKED'].includes(item.status), `${row.id}/${item.check_id}: applicable check has invalid status`);
    }
    const positiveGate = row.entity_kind === 'component_identity_family'
      && row.checklist.every((item) => item.applicability === 'NOT_APPLICABLE' || item.status === 'PASS')
      && row.operational_blocker_refs.length === 0;
    assert(row.strict_ready === positiveGate, `${row.id}: strict readiness is not recomputed from positive evidence`);
    assert(row.strict_ready === false && row.status === 'NOT_READY', `${row.id}: current audit requires NOT_READY`);
    assert(row.eligible_for_scoring === false && row.score === null && row.selected_first_wave === false, `${row.id}: non-ready row was scored/selected`);
    assert(row.decision === 'NOT_MERGED' && row.promotion_ready === false, `${row.id}: readiness escaped STOP boundary`);
    const expectedBlockers = sorted(findingsByFamily.get(row.analysis_group_id).filter((item) => item.blocking_scope !== 'none').map((item) => item.id));
    assert(same(row.operational_blocker_refs, expectedBlockers), `${row.id}: operational blocker join differs`);
  }

  assert(wave.schema_version === 'project_normalization_family_wave_plan_v1_1', 'wave schema version differs');
  assert(wave.algorithm.minimum_family_count === 0 && wave.algorithm.maximum_family_count === 4, 'wave min/max differs');
  assert(wave.algorithm.blocker_absence_is_sufficient === false && wave.algorithm.score_non_ready_families === false, 'wave is fail-open');
  assert(wave.counts.analytical_groups === 47 && wave.counts.component_memberships === 107, 'wave census differs');
  assert(wave.counts.strict_ready === 0 && wave.counts.eligible_for_scoring === 0 && wave.counts.selected_first_wave === 0 && wave.counts.not_ready === 47,
    'wave readiness counts differ');
  assert(same(wave.counts.entity_kinds, expectedKindCounts), 'wave kind counts differ');
  assert(wave.families.length === 47, 'wave family rows differ');
  assert(wave.families.every((row) => row.score === null && row.strict_ready === false && row.selected_first_wave === false), 'wave contains a scored/selected family');
  assert(wave.eligible_family_ids.length === 0 && wave.first_wave_family_ids.length === 0 && wave.promotion_ready_family_ids.length === 0,
    'wave is not empty');
  assert(wave.product_value_gate_mode === 'observe' && wave.decision === 'NOT_MERGED', 'wave escaped observe/NOT_MERGED boundary');

  const withoutApps = sorted(legacyComponentIds.filter((componentId) => !applications.some((item) => item.component_id === componentId)));
  assert(same(withoutApps, sorted(['component.02effc1d8ab8434b', 'component.29e9aebbf63be827', 'component.d65fb5ef1db02f46'])),
    'no-application component census differs');
};

const analysis = buildAnalysis();
const readiness = buildReadiness();
const wave = buildWave(analysis, readiness);
validate({ analysis, readiness, wave });

const outputs = new Map([
  [PATHS.analysisSchema, prettyJson(analysisSchema)],
  [PATHS.readinessSchema, prettyJson(readinessSchema)],
  [PATHS.analysisRegistry, jsonl(analysis)],
  [PATHS.readiness, jsonl(readiness)],
  [PATHS.wave, prettyJson(wave)]
]);

if (WRITE) {
  for (const [relative, contents] of outputs) {
    fs.mkdirSync(path.dirname(absolute(relative)), { recursive: true });
    fs.writeFileSync(absolute(relative), contents);
  }
} else {
  for (const [relative, expected] of outputs) {
    assert(fs.existsSync(absolute(relative)), `${relative}: generated artifact missing; run --write`);
    assert(fs.readFileSync(absolute(relative), 'utf8') === expected, `${relative}: generated artifact drift; run --write`);
  }
}

let rejected = 0;
if (SELF_TEST) {
  const expectRejected = (label, mutate) => {
    const candidate = JSON.parse(JSON.stringify({ analysis, readiness, wave }));
    mutate(candidate);
    try { validate(candidate); }
    catch { rejected += 1; return; }
    fail(`semantic mutation was accepted: ${label}`);
  };
  expectRejected('missing component membership', (x) => x.analysis[0].member_component_ids.pop());
  expectRejected('duplicate component membership', (x) => x.analysis[0].member_component_ids.push(x.analysis[1].member_component_ids[0]));
  expectRejected('catalog promoted to identity', (x) => { x.analysis.find((row) => row.id === 'family.design-system-primitives').entity_kind = 'component_identity_family'; });
  expectRejected('legacy entity-kind alias', (x) => { x.analysis.find((row) => row.id === 'family.amber-artifacts').entity_kind = 'catalog_family'; });
  expectRejected('typed operational disposition drift', (x) => { x.analysis[0].operational_findings[0].operational_disposition = 'accepted_current_difference'; });
  expectRejected('empty positive evidence', (x) => { x.readiness[0].checklist[0].evidence_refs = []; });
  expectRejected('unresolvable positive evidence', (x) => { x.readiness[0].checklist[0].evidence_refs = ['missing.evidence.ref']; });
  expectRejected('not-applicable without reason status', (x) => {
    const row = x.readiness.find((item) => item.analysis_group_id === 'family.brand-identity');
    row.checklist.find((item) => item.check_id === 'media_consumer_policy').status = 'PASS';
  });
  expectRejected('blocker absence implies ready', (x) => { const row = x.readiness.find((item) => item.analysis_group_id === 'family.brand-identity'); row.operational_blocker_refs = []; row.strict_ready = true; row.status = 'READY_FOR_CONTRACT_DECISION'; row.eligible_for_scoring = true; row.score = 50; });
  expectRejected('non-ready score', (x) => { x.readiness[0].score = 50; });
  expectRejected('forced minimum wave', (x) => { x.wave.first_wave_family_ids = ['family.event-media', 'family.event-token-medallions']; });
  expectRejected('event media selected', (x) => { x.wave.families.find((row) => row.family_id === 'family.event-media').selected_first_wave = true; });
  expectRejected('physical operation authorized', (x) => { x.analysis[0].physical_operation_authorized = true; });
  assert(rejected === 13, 'semantic self-test count differs');
}

process.stdout.write(`${JSON.stringify({
  status: 'valid',
  mode: WRITE ? 'write' : 'check',
  analytical_groups: analysis.length,
  component_memberships: analysis.flatMap((row) => row.member_component_ids).length,
  readiness_rows: readiness.length,
  strict_ready: 0,
  first_wave: 0,
  semantic_mutations_rejected: rejected
})}\n`);

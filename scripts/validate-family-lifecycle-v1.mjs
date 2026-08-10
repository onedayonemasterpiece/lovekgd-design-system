#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const STATE_ORDER = [
  'AS_IS_RECONSTRUCTED',
  'FAMILY_HYPOTHESIS_REVIEWED',
  'CANDIDATE_CONTRACT_ACCEPTED',
  'CANONICAL_CODE_CANDIDATE',
  'PENPOT_COMPONENT_CANDIDATE',
  'COMPONENT_THREE_WAY_CONFORMANCE',
  'PAGE_ARCHETYPE_CANDIDATE',
  'PRODUCT_REPRESENTATIONS',
  'GEMINI_MCP_VISUAL_AUDIT',
  'REVIEWED_CORRECTIONS',
  'FAMILY_AND_ARCHETYPE_PROMOTION',
];

const TRANSITION_IDS = [
  'T01_REVIEW_FAMILY_HYPOTHESIS',
  'T02_ACCEPT_CANDIDATE_CONTRACT',
  'T03_BUILD_CANONICAL_CODE_CANDIDATE',
  'T04_MATERIALIZE_PENPOT_COMPONENT_CANDIDATE',
  'T05_PASS_COMPONENT_THREE_WAY_CONFORMANCE',
  'T06_BUILD_PAGE_ARCHETYPE_CANDIDATE',
  'T07_COMPLETE_PRODUCT_REPRESENTATIONS',
  'T08_COMPLETE_GEMINI_MCP_VISUAL_AUDIT',
  'T09_REVIEW_AND_REPLAY_CORRECTIONS',
  'T10_PROMOTE_FAMILY_AND_ARCHETYPES',
];

const GEMINI_MODELS = ['gemini-3-pro-preview', 'gemini-3.1-pro-preview'];
const THREE_WAY_SURFACES = ['penpot', 'astro_specimen', 'generated_page'];
const THREE_WAY_TUPLE = [
  'component_id',
  'contract_version',
  'contract_sha256',
  'state_key',
  'fixture_id',
  'viewport_id',
  'candidate_package_sha',
];

const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const hasText = (rows, fragment) => rows.some((row) => row.includes(fragment));

export function validateLifecycleSchema(schema) {
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  const exactArray = (node, expected) => (
    node?.items === false
    && node?.minItems === expected.length
    && node?.maxItems === expected.length
    && same(node?.prefixItems?.map((entry) => entry.const), expected)
  );
  check(schema.$schema === 'https://json-schema.org/draft/2020-12/schema', 'schema draft');
  check(schema.$id === 'https://lovekgd.design/contracts/normalization/family-lifecycle.v1.schema.json', 'schema $id');
  check(schema.additionalProperties === false, 'schema is fail closed');
  for (const field of ['state_order', 'states', 'transitions', 'penpot_pre_promotion_semantics', 'three_way_conformance', 'archetype_and_representation_semantics', 'gemini_mcp_visual_audit', 'promotion_invariants']) {
    check(schema.required?.includes(field), `schema required field: ${field}`);
  }
  check(same(schema.$defs?.stateName?.enum, STATE_ORDER), 'schema exact state enum');
  check(same(schema.properties?.state_order?.prefixItems?.map((entry) => entry.const), STATE_ORDER), 'schema exact ordered state prefix');
  check(schema.properties?.state_order?.items === false && schema.properties?.state_order?.minItems === 11 && schema.properties?.state_order?.maxItems === 11, 'schema state order cardinality');
  check(schema.properties?.states?.items === false && schema.properties?.states?.minItems === 11 && schema.properties?.states?.maxItems === 11, 'schema state definition cardinality');
  check(schema.properties?.transitions?.items === false && schema.properties?.transitions?.minItems === 10 && schema.properties?.transitions?.maxItems === 10, 'schema transition cardinality');
  for (const field of [
    'scope', 'current_repository_state', 'penpot_pre_promotion_semantics',
    'three_way_conformance', 'archetype_and_representation_semantics',
    'gemini_mcp_visual_audit',
  ]) check(schema.properties?.[field]?.additionalProperties === false, `schema fail-closed object: ${field}`);
  check(exactArray(schema.properties?.penpot_pre_promotion_semantics?.properties?.required_metadata, [
    'lifecycle_contract_ref', 'lifecycle_state', 'subject_id', 'candidate_contract_id',
    'candidate_contract_version', 'candidate_contract_sha256', 'code_candidate_repo_sha',
    'authority_mode', 'status', 'canonical', 'promotion_receipt_ref',
    'materialization_receipt_ref', 'rollback_ref',
  ]), 'schema exact Penpot candidate metadata');
  check(exactArray(schema.properties?.three_way_conformance?.properties?.surfaces, THREE_WAY_SURFACES), 'schema exact three-way surfaces');
  check(exactArray(schema.properties?.three_way_conformance?.properties?.equality_tuple, THREE_WAY_TUPLE), 'schema exact three-way tuple');
  check(exactArray(schema.properties?.gemini_mcp_visual_audit?.properties?.allowed_model_ids, GEMINI_MODELS), 'schema exact Gemini model allowlist');
  check(schema.properties?.gemini_mcp_visual_audit?.properties?.mcp_mode?.const === 'read-only', 'schema read-only Gemini MCP');
  check(schema.properties?.invalidation_rules?.items === false, 'schema exact invalidation-rule list');
  check(schema.properties?.promotion_invariants?.items === false, 'schema exact promotion-invariant list');
  return failures;
}

export function validateLifecycle(contract, { root = '.', checkRepositoryFacts = true } = {}) {
  const failures = [];
  const check = (condition, message) => {
    if (!condition) failures.push(message);
  };
  const nonEmptyUniqueStrings = (value) =>
    Array.isArray(value)
    && value.length > 0
    && value.every((item) => typeof item === 'string' && item.length > 0)
    && new Set(value).size === value.length;

  check(contract.schema_id === 'lovekgd.family-lifecycle.v1', 'schema id');
  check(contract.schema_version === 'family_lifecycle_v1', 'schema version');
  check(contract.normative_status === 'accepted', 'normative status');
  check(contract.initial_state === STATE_ORDER[0], 'initial state');
  check(contract.terminal_state === STATE_ORDER.at(-1), 'terminal state');
  check(same(contract.state_order, STATE_ORDER), 'exact state order');
  check(new Set(contract.state_order || []).size === STATE_ORDER.length, 'state names unique');
  check(contract.scope?.global_promotion_forbidden === true, 'global promotion forbidden');
  check(contract.scope?.semantic_family_identity_begins_at === STATE_ORDER[1], 'semantic family identity boundary');
  check(contract.current_repository_state?.state === STATE_ORDER[0], 'truthful current lifecycle state');
  check(contract.current_repository_state?.promotion_claim_allowed === false, 'current promotion claim forbidden');

  check(Array.isArray(contract.states) && contract.states.length === 11, 'exactly eleven state definitions');
  for (let index = 0; index < STATE_ORDER.length; index += 1) {
    const state = contract.states?.[index] || {};
    check(state.state === STATE_ORDER[index], `state ${index + 1}: name/order`);
    check(state.ordinal === index + 1, `state ${index + 1}: ordinal`);
    check(typeof state.meaning === 'string' && state.meaning.length > 0, `state ${index + 1}: meaning`);
    check(state.entry_transition_id === (index === 0 ? null : TRANSITION_IDS[index - 1]), `state ${index + 1}: entry transition`);
    check(state.authority_mode === (index === 10 ? 'design-system-led' : 'reconstructed'), `state ${index + 1}: authority mode`);
    check(nonEmptyUniqueStrings(state.allowed_claims), `state ${index + 1}: allowed claims`);
    check(nonEmptyUniqueStrings(state.forbidden_claims), `state ${index + 1}: forbidden claims`);
  }

  check(Array.isArray(contract.transitions) && contract.transitions.length === 10, 'exactly ten transitions');
  const transitionIds = new Set();
  const gateIds = new Set();
  for (let index = 0; index < 10; index += 1) {
    const transition = contract.transitions?.[index] || {};
    check(transition.transition_id === TRANSITION_IDS[index], `transition ${index + 1}: id/order`);
    check(transition.from === STATE_ORDER[index], `transition ${index + 1}: adjacent from`);
    check(transition.to === STATE_ORDER[index + 1], `transition ${index + 1}: adjacent to`);
    check(!transitionIds.has(transition.transition_id), `transition ${index + 1}: duplicate id`);
    transitionIds.add(transition.transition_id);
    const gate = transition.gate || {};
    check(typeof gate.gate_id === 'string' && /^G(?:0[1-9]|10)_/.test(gate.gate_id), `transition ${index + 1}: gate id`);
    check(!gateIds.has(gate.gate_id), `transition ${index + 1}: duplicate gate id`);
    gateIds.add(gate.gate_id);
    check(gate.mode === 'all_of', `transition ${index + 1}: all-of gate`);
    check(nonEmptyUniqueStrings(gate.requirements), `transition ${index + 1}: gate requirements`);
    check(nonEmptyUniqueStrings(gate.blocking_conditions), `transition ${index + 1}: blocking conditions`);
    const authority = transition.authority || {};
    check(authority.before === 'reconstructed', `transition ${index + 1}: before authority`);
    check(authority.after === (index === 9 ? 'design-system-led' : 'reconstructed'), `transition ${index + 1}: after authority`);
    check(authority.authority_change === (index === 9), `transition ${index + 1}: authority changes only at promotion`);
    const evidence = transition.evidence || {};
    check(nonEmptyUniqueStrings(evidence.required_kinds), `transition ${index + 1}: evidence kinds`);
    check(nonEmptyUniqueStrings(evidence.identity_fields), `transition ${index + 1}: evidence identity fields`);
    check(evidence.all_refs_sha256_bound === true, `transition ${index + 1}: hash-bound evidence`);
  }

  const targetGate = contract.transitions?.[1]?.gate || {};
  check(hasText(targetGate.requirements || [], 'owner accepts'), 'candidate contract needs owner acceptance');
  check(hasText(targetGate.requirements || [], 'reversible migration'), 'candidate contract needs reversible migration');
  check(hasText(targetGate.requirements || [], 'rollback'), 'candidate contract needs rollback');
  check(hasText(targetGate.requirements || [], 'promotion checklist'), 'candidate contract needs defined final promotion gate');

  const penpot = contract.penpot_pre_promotion_semantics || {};
  check(penpot.materialization_state === STATE_ORDER[4], 'Penpot materialization state');
  check(same(penpot.requires_states_completed, [STATE_ORDER[2], STATE_ORDER[3]]), 'Penpot prerequisites');
  check(penpot.authority_mode === 'reconstructed', 'Penpot candidate authority');
  check(penpot.status === 'candidate', 'Penpot candidate status');
  check(penpot.canonical === false, 'Penpot candidate is noncanonical');
  check(penpot.promotion_receipt_ref === null, 'Penpot candidate has no promotion receipt');
  check(penpot.promotion_side_effect_forbidden === true, 'Penpot materialization cannot promote');
  for (const field of [
    'lifecycle_contract_ref', 'lifecycle_state', 'subject_id', 'candidate_contract_id',
    'candidate_contract_version', 'candidate_contract_sha256', 'code_candidate_repo_sha',
    'authority_mode', 'status', 'canonical', 'promotion_receipt_ref',
    'materialization_receipt_ref', 'rollback_ref',
  ]) check(penpot.required_metadata?.includes(field), `Penpot candidate metadata: ${field}`);

  const conformance = contract.three_way_conformance || {};
  check(same(conformance.surfaces, THREE_WAY_SURFACES), 'exact three-way surfaces');
  check(same(conformance.equality_tuple, THREE_WAY_TUPLE), 'exact three-way equality tuple');
  check(conformance.all_required_surfaces_must_pass === true, 'all three surfaces pass');
  check(conformance.screenshot_alone_sufficient === false, 'screenshot alone insufficient');
  for (const requiredCheck of ['interaction', 'accessibility', 'local_overrides']) {
    check(conformance.required_checks?.includes(requiredCheck), `three-way required check: ${requiredCheck}`);
  }

  const graph = contract.archetype_and_representation_semantics || {};
  check(graph.source_requirements_overlay_is_archetype === false, 'source overlay is not archetype');
  check(graph.detached_mockup_forbidden === true, 'detached product mockup forbidden');
  check(same(graph.minimum_viewport_classes, ['mobile', 'desktop']), 'minimum representation viewports');
  check(graph.tablet_required_when_responsive_boundary === true, 'tablet boundary evidence');
  for (const field of ['one-archetype-ref', 'exact-instance-graph', 'fixture-id', 'viewport-id', 'screen-state-id', 'ux-flow-ref', 'runtime-evidence-ref']) {
    check(graph.product_representation_requires?.includes(field), `product representation binding: ${field}`);
  }

  const gemini = contract.gemini_mcp_visual_audit || {};
  check(gemini.role === 'advisory-visual-and-semantic-review', 'Gemini advisory role');
  check(same(gemini.allowed_model_ids, GEMINI_MODELS), 'Gemini Pro model allowlist');
  check(gemini.mcp_mode === 'read-only', 'Gemini MCP is read-only');
  check(gemini.mutation_allowed === false, 'Gemini mutation forbidden');
  check(gemini.comment_resolution_allowed === false, 'Gemini comment resolution forbidden');
  check(gemini.authority_change_allowed === false, 'Gemini authority change forbidden');
  check(gemini.supplementary_models_do_not_satisfy_gate === true, 'supplementary models cannot satisfy gate');
  check(gemini.provider_failure_status === 'blocked', 'provider failure blocks audit');
  for (const limitation of ['DOM semantics', 'accessibility tree', 'keyboard behavior', 'three-way conformance', 'owner acceptance', 'production release', 'promotion']) {
    check(gemini.cannot_prove?.includes(limitation), `Gemini limitation: ${limitation}`);
  }
  for (const field of ['model_id', 'provider', 'prompt_sha256', 'input_manifest_sha256', 'tool_log_sha256', 'response_sha256', 'full_resolution_inputs_reviewed', 'limitations']) {
    check(gemini.required_receipt_fields?.includes(field), `Gemini receipt field: ${field}`);
  }

  const promotion = contract.transitions?.[9]?.gate || {};
  check(hasText(promotion.requirements || [], 'promotion ready'), 'promotion requires product-value readiness');
  check(hasText(promotion.blocking_conditions || [], 'observe or pending'), 'observe/pending product gate blocks promotion');
  check(hasText(promotion.requirements || [], 'post-deploy'), 'promotion requires post-deploy conformance');
  check(hasText(promotion.requirements || [], 'rollback'), 'promotion requires rollback receipt');
  check(hasText(promotion.requirements || [], 'atomically'), 'promotion is atomic and bounded');
  check(contract.promotion_invariants?.includes('only T10_PROMOTE_FAMILY_AND_ARCHETYPES changes authority'), 'single authority transition invariant');
  check(contract.promotion_invariants?.includes('no application with pending_product_model or promotion_ready=false may be promoted'), 'pending product promotion prohibition');

  if (checkRepositoryFacts) {
    const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
    const readJsonl = (relative) => fs.readFileSync(path.join(root, relative), 'utf8').split('\n').filter(Boolean).map(JSON.parse);
    const scaffold = readJson('contracts/resource-graph-scaffold.v1.json');
    const archetypes = readJson('contracts/page-archetype-requirements.v1.json');
    const charter = readJson('contracts/project-normalization-charter.v1.json');
    const families = readJsonl('catalog/normalization/family-registry.jsonl');
    const applications = readJsonl('catalog/normalization/component-applications.jsonl');
    check(scaffold.validated_revision === 30 && scaffold.expected_counts?.native_components === 0, 'current Penpot native component count');
    check(scaffold.authority_mode === 'reconstructed' && scaffold.content_status === 'empty', 'current Penpot scaffold status');
    check(archetypes.accepted_visual_archetypes === 0 && archetypes.canonical_design === false, 'current accepted archetype count');
    check(archetypes.lifecycle_semantics?.satisfies_state_evidence_for === STATE_ORDER[0], 'source overlay lifecycle boundary');
    check(families.every((row) => row.promotion_ready === false), 'current family promotion flags');
    check(applications.every((row) => row.promotion_ready === false && row.value_evidence_status === 'pending_product_model'), 'current application promotion flags');
    check(charter.product_value_gate?.mode === 'observe' && charter.product_value_gate?.pending_product_model_allows_promotion_ready === false, 'current Product Value Gate');

    for (const relative of [
      'docs/normalization/design-system-family-lifecycle.md',
      'docs/resource-graph-004.md',
      'docs/component-contract-authority.md',
    ]) {
      const text = fs.readFileSync(path.join(root, relative), 'utf8');
      check(STATE_ORDER.every((state) => text.includes(state)), `${relative}: exact lifecycle sequence`);
    }
  }

  return failures;
}

function main() {
  const argv = process.argv.slice(2);
  const contractIndex = argv.indexOf('--contract');
  const rootIndex = argv.indexOf('--root');
  const root = path.resolve(rootIndex >= 0 ? argv[rootIndex + 1] : '.');
  const contractPath = path.resolve(contractIndex >= 0 ? argv[contractIndex + 1] : path.join(root, 'contracts/normalization/family-lifecycle.v1.json'));
  const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  const schema = JSON.parse(fs.readFileSync(path.join(root, 'contracts/normalization/family-lifecycle.v1.schema.json'), 'utf8'));
  const failures = [
    ...validateLifecycleSchema(schema),
    ...validateLifecycle(contract, { root, checkRepositoryFacts: !argv.includes('--skip-repo-facts') }),
  ];
  if (failures.length) {
    console.error('Family lifecycle v1 validation: FAIL');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log('Family lifecycle v1 validation: PASS');
  console.log(`States: ${contract.states.length}`);
  console.log(`Transitions: ${contract.transitions.length}`);
  console.log(`Current state: ${contract.current_repository_state.state}`);
}

if (import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();

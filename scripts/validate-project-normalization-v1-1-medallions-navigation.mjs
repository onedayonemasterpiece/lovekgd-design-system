#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SNAPSHOT = 'catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc';
const DOSSIER_PATH = 'catalog/normalization/families/event-token-medallions/dossier.json';
const DOSSIER_MD_PATH = 'catalog/normalization/families/event-token-medallions/dossier.md';
const LIFECYCLE_PATH = 'catalog/normalization/unreachable-implementation-lifecycle.jsonl';
const CAPABILITY_PATH = 'catalog/normalization/mobile-search-navigation-capability.json';
const V1_DOSSIER_PATH = 'catalog/normalization/families/family.event-token-medallions/dossier.json';
const V1_DOSSIER_MD_PATH = 'catalog/normalization/families/family.event-token-medallions/dossier.md';

const EXPECTED_LIFECYCLE_IDS = [
  'component.02effc1d8ab8434b',
  'component.29e9aebbf63be827',
  'component.d65fb5ef1db02f46',
];
const EXPECTED_MAPPING_IDS = [
  'mapping.admission-free',
  'mapping.admission-price',
  'mapping.audience-kids-family',
  'mapping.charity',
  'mapping.festival-text-fallback',
  'mapping.identity',
  'mapping.pushkin',
  'mapping.source-meow',
  'mapping.ticket-sold-out',
  'mapping.transport-program',
];
const EXPECTED_OPEN_REFS = [
  'capsule.05-medallions.unresolved.1',
  'capsule.05-medallions.unresolved.2',
  'mismatch.medallions-detail-geometry-doc-vs-consumer-css',
  'mismatch.medallions-lab-catalog-not-component-equivalent',
  'mismatch.medallions-organizer-count-28-vs-stale-27',
  'unresolved.medallions-computed-geometry',
  'unresolved.medallions-controlled-specimens',
  'unresolved.medallions-production-route-binding',
  'unresolved.medallions-resource-equivalence',
];

const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const sorted = (values) => [...values].sort();
const sameSet = (actual, expected) => JSON.stringify(sorted(actual)) === JSON.stringify(sorted(expected));
const unique = (values, label) => assert(new Set(values).size === values.length, `${label}: duplicates`);
const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

function read(root, relativePath) {
  return fs.readFileSync(path.join(root, relativePath));
}

function readJson(root, relativePath) {
  return JSON.parse(read(root, relativePath).toString('utf8'));
}

function readJsonl(root, relativePath) {
  return read(root, relativePath).toString('utf8').split('\n').filter(Boolean).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      fail(`${relativePath}:${index + 1}: ${error.message}`);
    }
  });
}

export function loadModel(root = '.') {
  const absoluteRoot = path.resolve(root);
  return {
    dossier: readJson(absoluteRoot, DOSSIER_PATH),
    lifecycles: readJsonl(absoluteRoot, LIFECYCLE_PATH),
    capability: readJson(absoluteRoot, CAPABILITY_PATH),
  };
}

function validateDossier(dossier) {
  assert(dossier.schema_version === 'project_normalization_family_dossier_v1_1', 'dossier schema');
  assert(dossier.id === 'dossier.event-token-medallions.v1.1', 'dossier id');
  assert(dossier.family_id === 'family.event-token-medallions', 'dossier family');
  assert(dossier.verdict === 'BOUNDARY_AND_TAXONOMY_REVIEW_REQUIRED', 'dossier verdict must remain fail-closed');
  assert(dossier.readiness === 'NOT_READY', 'dossier readiness must remain NOT_READY');
  assert(dossier.decision === 'NOT_MERGED' && dossier.decision_accepted === false, 'dossier merge decision');
  assert(dossier.normalization_allowed === false && dossier.promotion_ready === false, 'dossier must not authorize normalization');
  assert(dossier.runtime_mutation === false, 'dossier must not authorize runtime mutation');
  assert(dossier.product_value_status === 'pending_product_model', 'dossier product-value status');
  assert(dossier.extends_without_mutation === V1_DOSSIER_PATH, 'dossier must preserve v1');
  assert(dossier.source_authority.component_id === 'component.5734f2285cf06960', 'medallion component authority');
  assert(dossier.source_authority.logical_path === 'src/components/EventTokenMedallions.astro', 'medallion source authority');
  assert(dossier.source_authority.content_sha256 === '09456fd7356f91bf7c367fd63ce26bda485f8ac534787d542c78d6d117a51cee', 'medallion content authority');
  assert(sameSet(dossier.source_authority.source_ids, ['source.current_root_prelaunch.5734f2285cf06960', 'source.latest_checked_kaggle_candidate.5734f2285cf06960']), 'medallion source refs');
  assert(sameSet(dossier.source_authority.binding_ids, ['binding.49898aa64a18fa0d', 'binding.f1a2baa8317653de']), 'medallion binding refs');
  assert(sameSet(dossier.source_authority.consumer_set_ids, ['consumer-set.8cf5e3e02cc168af', 'consumer-set.6c65b01e3a406440']), 'medallion consumer-set refs');
  assert(dossier.source_authority.candidate_contract_sha256 === '5fade9fe7d641c8f9ab155b06fcede30db43a7ac03c01f521727960086bc59b7', 'medallion candidate contract authority');

  const taxonomy = dossier.domain_taxonomy;
  assert(taxonomy.axis_separation_invariant.includes('MUST NOT be collapsed'), 'taxonomy separation invariant');
  assert(sameSet(taxonomy.identity_category, ['organizer', 'venue_brand', 'festival_brand', 'festival']), 'identity category taxonomy');
  assert(sameSet(taxonomy.token_kind, ['organizer', 'source', 'program', 'pushkin', 'badge', 'pill']), 'token kind taxonomy');
  assert(sameSet(taxonomy.semantic_facet, ['identity', 'source_provenance', 'transport_program', 'pushkin_payment_eligibility', 'admission', 'ticket_status', 'audience', 'charity', 'festival_text_fallback']), 'semantic facet taxonomy');
  assert(sameSet(taxonomy.visual_form, ['circle', 'pushkin_composite_frame', 'text_pill']), 'visual form taxonomy');
  assert(sameSet(taxonomy.identity_role, ['main', 'secondary', 'not_identity']), 'identity role taxonomy');
  assert(sameSet(taxonomy.layout, ['inline', 'desktop-slots']), 'layout taxonomy');
  assert(sameSet(taxonomy.slot, ['top', 'inline']), 'slot taxonomy');
  assert(sameSet(taxonomy.resolution_state, ['resolved', 'conflicting_source_identity', 'ambiguous_venue_identity']), 'resolution taxonomy');
  assert(taxonomy.ticket_status.includes('sold_out') && !taxonomy.token_kind.includes('status'), 'status must remain semantic, not token kind');
  assert(taxonomy.media_fallback_state.includes('broken_asset_unresolved'), 'broken fallback boundary must remain explicit');
  for (const [name, values] of Object.entries(taxonomy)) if (Array.isArray(values)) unique(values, `taxonomy.${name}`);

  const mappings = dossier.mapping_rules;
  unique(mappings.map((mapping) => mapping.id), 'mapping ids');
  assert(sameSet(mappings.map((mapping) => mapping.id), EXPECTED_MAPPING_IDS), 'mapping census');
  const kindsUsed = new Set();
  const facetsUsed = new Set();
  for (const mapping of mappings) {
    assert(typeof mapping.predicate === 'string' && mapping.predicate.length > 0, `${mapping.id}: predicate`);
    assert(Array.isArray(mapping.source_lines) && mapping.source_lines.length > 0, `${mapping.id}: source lines`);
    assert(taxonomy.token_kind.includes(mapping.token_kind), `${mapping.id}: unknown token kind`);
    assert(taxonomy.semantic_facet.includes(mapping.semantic_facet), `${mapping.id}: unknown semantic facet`);
    assert(taxonomy.visual_form.includes(mapping.visual_form), `${mapping.id}: unknown visual form`);
    assert(mapping.identity_role === 'not_identity' || mapping.identity_role === 'resolver_selected_main_or_secondary', `${mapping.id}: invalid identity role projection`);
    kindsUsed.add(mapping.token_kind);
    facetsUsed.add(mapping.semantic_facet);
  }
  assert(sameSet(kindsUsed, taxonomy.token_kind), 'every token kind must be mapped');
  assert(sameSet(facetsUsed, taxonomy.semantic_facet), 'every semantic facet must be mapped');
  const identity = mappings.find((mapping) => mapping.id === 'mapping.identity');
  assert(identity.token_kind === 'organizer' && identity.semantic_facet === 'identity', 'identity projection changed');
  assert(sameSet(identity.identity_categories, taxonomy.identity_category), 'identity mapping category coverage');
  assert(identity.top_slot_eligible === 'main_only', 'identity top eligibility');
  for (const mapping of mappings.filter((item) => item.id !== 'mapping.identity')) assert(mapping.top_slot_eligible === false, `${mapping.id}: non-identity top eligibility`);

  const boundaries = new Map(dossier.semantic_boundaries.map((boundary) => [boundary.id, boundary]));
  for (const id of [
    'boundary.identity-category-vs-token-kind',
    'boundary.program-vs-pushkin',
    'boundary.source-vs-identity',
    'boundary.admission-vs-ticket-status',
    'boundary.semantic-vs-visual-form',
    'boundary.festival-identity-vs-text-fallback',
    'boundary.event-detail-vs-related-resources',
    'boundary.informational-vs-interactive',
  ]) assert(boundaries.has(id), `missing semantic boundary ${id}`);
  assert(boundaries.get('boundary.event-detail-vs-related-resources').status === 'NOT_MERGED', 'related resources merged without receipt');

  const identityContract = dossier.identity_resolution_contract;
  assert(identityContract.identity_cap === 3, 'identity cap');
  assert(JSON.stringify(identityContract.main_category_priority) === JSON.stringify(['festival_brand', 'festival', 'organizer', 'venue_brand']), 'main priority');
  assert(identityContract.fail_closed_scope === 'identity_only', 'identity fail-closed scope');
  assert(identityContract.conflicting_source_identity.startsWith('suppress_all_resolved_identity_tokens'), 'source conflict behavior');
  assert(identityContract.ambiguous_venue_identity.startsWith('suppress_equally_strong_venue_identities'), 'venue ambiguity behavior');

  assert(JSON.stringify(dossier.admission_and_status_contract.exclusive_precedence) === JSON.stringify(['free_badge', 'price_pill', 'sold_out_pill']), 'admission/status precedence');
  assert(dossier.admission_and_status_contract.standalone_status_kind_exists === false, 'standalone status kind is not observed');

  const slots = dossier.slot_contract;
  assert(Object.keys(slots).includes('inline') && Object.keys(slots).includes('top'), 'slot contract cannot be empty');
  assert(slots.top.maximum === 1 && slots.top.eligible_semantic_facet === 'identity' && slots.top.eligible_role === 'main', 'top slot contract');
  assert(slots.top.requires_allowTopSlot === true, 'top slot opt-in');
  assert(sameSet(slots.inline.desktop_slots_allowed_kinds, ['organizer', 'source', 'program', 'pushkin', 'badge']), 'desktop allowed kinds');
  assert(!slots.inline.desktop_slots_allowed_kinds.includes('pill'), 'desktop slots must exclude pills');
  assert(slots.main_without_top.includes('Main remains'), 'main inline fallback');

  const overflow = dossier.ordering_and_overflow_contract;
  assert(overflow.identity_cap === 3 && overflow.visible_token_cap === 6, 'overflow caps');
  assert(JSON.stringify(overflow.generation_order) === JSON.stringify(['resolved_identities', 'transport_program', 'source', 'pushkin', 'exclusive_admission_or_sold_out', 'kids_family', 'charity', 'festival_text_fallback']), 'token generation order');
  assert(JSON.stringify(overflow.desktop_phase_order) === JSON.stringify(['apply_visible_token_cap', 'filter_out_pill_kind', 'select_main_top_token', 'emit_inline_remainder']), 'desktop cap/filter phase order');
  assert(overflow.free_admission_retention.includes('first five plus free-admission'), 'free admission retention');
  assert(overflow.known_boundary.status === 'open_requires_acceptance_test', 'desktop starvation boundary must stay open');

  const geometry = new Map(dossier.consumer_geometry_contract.map((item) => [item.id, item]));
  assert(geometry.size === 4, 'consumer geometry census');
  assert(geometry.get('geometry.mobile-event-detail-inline').non_pill_size === 'clamp(84px,23vw,92px)', 'mobile geometry');
  assert(geometry.get('geometry.desktop-event-detail-inline').non_pill_size === 'clamp(72px,7vw,94px)', 'desktop inline geometry');
  assert(geometry.get('geometry.desktop-event-detail-top').non_pill_size === 'clamp(88px,7.4vw,108px)', 'desktop top geometry');
  assert(geometry.get('geometry.desktop-compact-height').non_pill_size === '72px', 'compact geometry');
  for (const item of geometry.values()) assert(item.computed_geometry_observed === false, `${item.id}: computed evidence invented`);
  assert(dossier.geometry_conflict.status === 'open' && dossier.geometry_conflict.decision_receipt === null, 'geometry conflict closed without receipt');
  assert(dossier.geometry_conflict.decision_ref === 'decision.event-token-medallions.consumer-geometry', 'geometry decision ref');

  const a11y = dossier.accessibility_contract;
  assert(a11y.current_observed.image_alt === 'empty_because_wrapper_owns_accessible_name', 'image alt ownership');
  assert(a11y.current_observed.interactive_elements === 0, 'interactivity must not be invented');
  assert(a11y.unresolved.length >= 4 && a11y.promotion_rule.includes('no accessibility field'), 'accessibility closure');
  assert(dossier.media_fallback_contract.synthetic_initial_fallback === false, 'synthetic fallback invented');
  assert(dossier.media_fallback_contract.broken_asset_behavior === 'unresolved', 'broken asset behavior invented');

  const evidence = dossier.evidence_contract;
  assert(evidence.planned_fixture_classes === 25 && evidence.planned_route_fixture_classes === 11 && evidence.planned_controlled_fixture_classes === 14, 'planned fixture counts');
  assert(evidence.controlled_observations === 4 && evidence.controlled_production_state_claims === 0, 'controlled observation counts');
  assert(evidence.page_verification_refs === 21 && evidence.page_refs_reviewed === 17 && evidence.page_refs_pending_human_visual_review === 4, 'page review counts');
  assert(evidence.page_refs_production_observed === 0, 'production observation must not be invented');
  assert(evidence.evidence_status === 'incomplete_for_normalization', 'evidence status');
  assert(sameSet(evidence.open_refs, EXPECTED_OPEN_REFS), 'open evidence refs');
  assert(dossier.promotion_blockers.length >= 9, 'promotion blockers under-specified');
  assert(dossier.related_resources.equivalence_status === 'NOT_MERGED', 'related resources equivalence');
}

function validateLifecycles(lifecycles) {
  assert(lifecycles.length === 3, 'lifecycle ledger must contain exactly three records');
  unique(lifecycles.map((record) => record.id), 'lifecycle ids');
  unique(lifecycles.map((record) => record.component_id), 'lifecycle component ids');
  assert(sameSet(lifecycles.map((record) => record.component_id), EXPECTED_LIFECYCLE_IDS), 'lifecycle component census');
  for (const record of lifecycles) {
    assert(record.schema_version === 'unreachable_implementation_lifecycle_v1_1', `${record.id}: schema`);
    assert(record.record_kind === 'implementation_lifecycle', `${record.id}: kind`);
    assert(record.reachability_status === 'not_observed_under_pinned_evidence', `${record.id}: fail-closed reachability`);
    assert(!/dead|unreachable/u.test(record.reachability_status), `${record.id}: reachability/lifecycle conflation`);
    assert(record.reachability_evidence_status === 'bounded_not_exhaustive' && record.reachability_limitations.length >= 3, `${record.id}: reachability limits`);
    assert(record.pinned_evidence.proof_scope === 'source_ast_import_graph_only', `${record.id}: evidence scope`);
    assert(record.pinned_evidence.production_ast_consumer_count_by_plane.current_root_prelaunch === 0, `${record.id}: current plane count`);
    assert(record.pinned_evidence.production_ast_consumer_count_by_plane.latest_checked_kaggle_candidate === 0, `${record.id}: candidate plane count`);
    assert(record.consumer_universe_status !== 'closed', `${record.id}: consumer universe falsely closed`);
    assert(record.preservation_required === true, `${record.id}: preservation`);
    assert(record.deletion_allowed === false && record.deletion_status === 'not_authorized' && record.deletion_receipt === null, `${record.id}: deletion authorization`);
    assert(record.product_value_status === 'pending_product_model', `${record.id}: product value`);
    assert(record.promotion_ready === false && record.decision === 'NOT_MERGED', `${record.id}: decision`);
    assert(record.deletion_gates.length >= 5, `${record.id}: deletion gates`);
  }

  const mobile = lifecycles.find((record) => record.component_id === 'component.29e9aebbf63be827');
  assert(mobile.logical_path === 'src/components/MobileSearchBottomNav.astro', 'mobile path');
  assert(mobile.lifecycle_status === 'preserve_pending_reconciliation', 'mobile lifecycle');
  assert(mobile.lifecycle_label === 'preserve-pending-reconciliation', 'mobile lifecycle label');
  assert(mobile.deprecated === false && mobile.deprecation_allowed === false && mobile.deprecation_authority === null, 'mobile deprecation must be false');
  assert(mobile.deprecation_status === 'not_authorized' && mobile.deprecation_gates.length >= 5, 'mobile deprecation gates');
  assert(mobile.consumer_universe_status === 'open_by_compatibility_contract', 'mobile external scope');
  assert(mobile.nonproduction_reachability.some((ref) => ref.kind === 'required_surface_contract'), 'mobile surface authority');
  assert(mobile.nonproduction_reachability.some((ref) => ref.kind === 'source_contract_test'), 'mobile test authority');
  assert(sameSet(mobile.pinned_evidence.composition_edge_ids, ['edge.c39ae475be6b841f', 'edge.822dba4f6f199cfd']), 'mobile composition edges');

  const popular = lifecycles.find((record) => record.component_id === 'component.02effc1d8ab8434b');
  assert(popular.lifecycle_status === 'deprecated_but_preserved' && popular.deprecated === true, 'popular lifecycle');
  assert(popular.lifecycle_label === 'deprecated-but-preserved' && popular.deprecation_status === 'confirmed_at_pinned_authority', 'popular lifecycle label');
  assert(popular.deprecation_authority.direct_replacement === 'PopularBehaviorRows@1', 'popular direct replacement');
  assert(popular.deprecation_authority.terminal_replacement === 'PopularBehaviorRows@2', 'popular terminal replacement');

  const weekend = lifecycles.find((record) => record.component_id === 'component.d65fb5ef1db02f46');
  assert(weekend.lifecycle_status === 'deprecated_but_preserved' && weekend.deprecated === true, 'weekend lifecycle');
  assert(weekend.lifecycle_label === 'deprecated-but-preserved' && weekend.deprecation_status === 'confirmed_at_pinned_authority', 'weekend lifecycle label');
  assert(weekend.deprecation_authority.direct_replacement === 'WeekendEditorialTimeline@2', 'weekend direct replacement');
  assert(weekend.deprecation_authority.terminal_replacement === 'WeekendEditorialTimeline@5', 'weekend terminal replacement');
  assert(weekend.nonproduction_reachability.some((ref) => ref.kind === 'tooling_file_requirement'), 'weekend tooling reachability');
}

function validateCapability(capability) {
  assert(capability.schema_version === 'mobile_navigation_capability_v1_1', 'capability schema');
  assert(capability.id === 'capability.mobile-search-bottom-navigation', 'capability id');
  assert(capability.family_id === 'family.bottom-navigation', 'capability family');
  assert(capability.capability_status === 'preserved_live_capability', 'capability status');
  assert(capability.product_value_status === 'pending_product_model', 'capability product value');
  assert(capability.decision === 'NOT_MERGED' && capability.normalization_allowed === false && capability.promotion_ready === false, 'capability decision');
  assert(capability.capability_contract.section_key === 'search', 'capability section');
  assert(capability.capability_contract.shared_shell_owner === 'src/layouts/EventLayout.astro', 'capability shell owner');
  assert(capability.capability_contract.route_bindings.length === 2, 'capability route bindings');
  assert(capability.capability_contract.required_surface_refs.length >= 4, 'capability authority refs');
  assert(capability.implementations.length === 2, 'capability implementation census');
  const shared = capability.implementations.find((item) => item.component_id === 'component.47d563556bdf3f18');
  const wrapper = capability.implementations.find((item) => item.component_id === 'component.29e9aebbf63be827');
  assert(shared?.implementation_role === 'shared_current_implementation' && shared.reachability_status === 'production_observed', 'shared nav implementation');
  assert(wrapper?.implementation_role === 'compatibility_wrapper', 'wrapper role');
  assert(wrapper?.reachability_status === 'not_observed_under_pinned_evidence', 'wrapper reachability');
  assert(wrapper?.lifecycle_status === 'preserve_pending_reconciliation', 'wrapper lifecycle');
  assert(wrapper?.deprecation_allowed === false && wrapper?.deletion_allowed === false, 'wrapper disposition');
  assert(capability.separation_invariants.length >= 5, 'capability separation invariants');
}

export function validateModel(model) {
  validateDossier(model.dossier);
  validateLifecycles(model.lifecycles);
  validateCapability(model.capability);
  const mobileLifecycle = model.lifecycles.find((record) => record.component_id === 'component.29e9aebbf63be827');
  const wrapper = model.capability.implementations.find((item) => item.component_id === 'component.29e9aebbf63be827');
  assert(wrapper.reachability_status === mobileLifecycle.reachability_status, 'mobile capability/lifecycle reachability mismatch');
  assert(wrapper.lifecycle_status === mobileLifecycle.lifecycle_status, 'mobile capability/lifecycle status mismatch');
  assert(wrapper.deletion_allowed === mobileLifecycle.deletion_allowed, 'mobile capability/lifecycle deletion mismatch');
  return true;
}

function validatePinnedArtifacts(root, model) {
  assert(sha256(read(root, V1_DOSSIER_PATH)) === '666b668f606dfefc02e062da687b3801f6f159ab867631afa7d3ed21880a962d', 'existing v1 dossier JSON changed');
  assert(sha256(read(root, V1_DOSSIER_MD_PATH)) === 'b56d8448c12a7480cd1cd4f266ed7ee6808cb558ba50f3d06888e449d69261a6', 'existing v1 dossier Markdown changed');
  assert(sha256(read(root, `${SNAPSHOT}/candidate-contracts/candidate.event-token-medallions.contract.json`)) === '5fade9fe7d641c8f9ab155b06fcede30db43a7ac03c01f521727960086bc59b7', 'candidate medallion contract changed');

  const sourceFiles = readJsonl(root, `${SNAPSHOT}/source-files.jsonl`);
  const sourceBindings = readJsonl(root, `${SNAPSHOT}/source-bindings.jsonl`);
  const consumerSets = readJsonl(root, `${SNAPSHOT}/consumers.jsonl`);
  const edges = readJsonl(root, `${SNAPSHOT}/composition-edges.jsonl`);
  const families = readJsonl(root, 'catalog/normalization/family-registry.jsonl');
  const candidate = readJson(root, `${SNAPSHOT}/candidate-contracts/candidate.event-token-medallions.contract.json`);
  const pageRefs = readJsonl(root, `${SNAPSHOT}/conformance-capsules/05-medallions/real-page-verification-refs.jsonl`);
  const specimenRefs = readJsonl(root, `${SNAPSHOT}/conformance-capsules/05-medallions/specimen-observation-refs.jsonl`);
  const unresolvedRefs = readJsonl(root, `${SNAPSHOT}/conformance-capsules/05-medallions/unresolved-refs.jsonl`);
  const mismatchRefs = readJsonl(root, `${SNAPSHOT}/conformance-capsules/05-medallions/mismatch-refs.jsonl`);
  const decisions = readJsonl(root, 'catalog/normalization/decision-queue.jsonl');

  const oldCensus = families.flatMap((family) => family.implementations)
    .filter((implementation) => implementation.reachability === 'dead-or-unreachable')
    .map((implementation) => implementation.component_id);
  assert(sameSet(oldCensus, EXPECTED_LIFECYCLE_IDS), 'immutable zero-consumer implementation census changed');

  for (const lifecycle of model.lifecycles) {
    const component = readJson(root, `${SNAPSHOT}/components/${lifecycle.component_id}.json`);
    assert(component.logical_path === lifecycle.logical_path, `${lifecycle.id}: component path mismatch`);
    assert(component.reachability === 'dead-or-unreachable', `${lifecycle.id}: expected immutable legacy label`);
    const expectedSourceIds = sourceFiles.filter((source) => source.path === lifecycle.logical_path).map((source) => source.id);
    const expectedBindingIds = sourceBindings.filter((binding) => binding.component_id === lifecycle.component_id).map((binding) => binding.id);
    const expectedConsumerSetIds = consumerSets.filter((set) => set.logical_path === lifecycle.logical_path).map((set) => set.id);
    assert(sameSet(lifecycle.pinned_evidence.source_ids, expectedSourceIds), `${lifecycle.id}: source refs`);
    assert(sameSet(lifecycle.pinned_evidence.binding_ids, expectedBindingIds), `${lifecycle.id}: binding refs`);
    assert(sameSet(lifecycle.pinned_evidence.consumer_set_ids, expectedConsumerSetIds), `${lifecycle.id}: consumer-set refs`);
    assert(sourceBindings.filter((binding) => binding.component_id === lifecycle.component_id).every((binding) => binding.consumers.length === 0), `${lifecycle.id}: nonzero immutable AST consumers`);
    assert(sourceFiles.filter((source) => source.path === lifecycle.logical_path).every((source) => source.content_sha256 === lifecycle.pinned_evidence.content_sha256), `${lifecycle.id}: content hash`);
  }

  const mobileEdges = edges.filter((edge) => edge.consumer_source_id.endsWith('.29e9aebbf63be827')).map((edge) => edge.id);
  assert(sameSet(mobileEdges, model.lifecycles.find((record) => record.component_id === 'component.29e9aebbf63be827').pinned_evidence.composition_edge_ids), 'mobile edge refs');

  const medallionSource = sourceFiles.filter((source) => source.path === 'src/components/EventTokenMedallions.astro');
  assert(medallionSource.length === 2 && medallionSource.every((source) => source.content_sha256 === model.dossier.source_authority.content_sha256), 'medallion source hash');
  const medallionBindings = sourceBindings.filter((binding) => binding.component_id === 'component.5734f2285cf06960');
  assert(sameSet(medallionBindings.map((binding) => binding.id), model.dossier.source_authority.binding_ids), 'medallion binding refs');
  assert(sameSet(consumerSets.filter((set) => set.logical_path === 'src/components/EventTokenMedallions.astro').map((set) => set.id), model.dossier.source_authority.consumer_set_ids), 'medallion consumer-set refs');

  const fixtureClasses = candidate.candidate_contract.fixture_classes;
  assert(fixtureClasses.length === model.dossier.evidence_contract.planned_fixture_classes, 'fixture count not derived');
  assert(candidate.production_consumers.length === model.dossier.evidence_contract.planned_route_fixture_classes, 'route fixture count not derived');
  assert(fixtureClasses.filter((id) => id.includes('.medallions-controlled-')).length === model.dossier.evidence_contract.planned_controlled_fixture_classes, 'controlled fixture count not derived');
  assert(specimenRefs.length === model.dossier.evidence_contract.controlled_observations, 'controlled observations not derived');
  assert(specimenRefs.filter((ref) => ref.production_state_claimed).length === model.dossier.evidence_contract.controlled_production_state_claims, 'controlled production claims not derived');
  assert(pageRefs.length === model.dossier.evidence_contract.page_verification_refs, 'page refs not derived');
  assert(pageRefs.filter((ref) => ref.review_status === 'reviewed').length === model.dossier.evidence_contract.page_refs_reviewed, 'reviewed page count not derived');
  assert(pageRefs.filter((ref) => ref.review_status === 'pending-human-visual-review').length === model.dossier.evidence_contract.page_refs_pending_human_visual_review, 'pending page count not derived');
  assert(pageRefs.filter((ref) => ref.production_observed_by_capsule).length === model.dossier.evidence_contract.page_refs_production_observed, 'production page count not derived');
  const capsuleOpenIds = [...unresolvedRefs.map((ref) => ref.id), ...mismatchRefs.map((ref) => ref.id)];
  assert(model.dossier.evidence_contract.open_refs.every((id) => capsuleOpenIds.includes(id)), 'dossier references unknown open evidence');
  assert(decisions.some((decision) => decision.id === 'decision.event-token-medallions.consumer-geometry' && decision.decision === 'NOT_MERGED'), 'geometry decision is not open');

  const bottomFamily = families.find((family) => family.id === 'family.bottom-navigation');
  const shared = bottomFamily.implementations.find((implementation) => implementation.component_id === 'component.47d563556bdf3f18');
  assert(shared.reachability === 'production-observed', 'shared mobile capability implementation status');

  const md = read(root, DOSSIER_MD_PATH).toString('utf8');
  for (const marker of ['BOUNDARY_AND_TAXONOMY_REVIEW_REQUIRED', 'NOT_READY', 'NOT_MERGED', 'venue_brand', 'Pushkin', 'caps before desktop pill filtering']) assert(md.includes(marker), `dossier Markdown missing ${marker}`);
}

export function validate(root = '.') {
  const absoluteRoot = path.resolve(root);
  const model = loadModel(absoluteRoot);
  validateModel(model);
  validatePinnedArtifacts(absoluteRoot, model);
  return {
    status: 'PASS',
    verdict: model.dossier.verdict,
    readiness: model.dossier.readiness,
    decision: model.dossier.decision,
    lifecycle_records: model.lifecycles.length,
    mapping_rules: model.dossier.mapping_rules.length,
  };
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    process.stdout.write(`${JSON.stringify(validate(process.argv[2] || '.'), null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`FAIL: ${error.message}\n`);
    process.exitCode = 1;
  }
}

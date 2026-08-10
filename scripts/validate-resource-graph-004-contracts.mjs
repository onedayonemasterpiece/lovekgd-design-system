#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const plugin = JSON.parse(await readFile(new URL('../contracts/resource-graph-004.plugin.json', import.meta.url), 'utf8'));
const iconography = JSON.parse(await readFile(new URL('../contracts/resource-graph-004.iconography.json', import.meta.url), 'utf8'));
const scaffold = JSON.parse(await readFile(new URL('../contracts/resource-graph-scaffold.v1.json', import.meta.url), 'utf8'));
const lifecycle = JSON.parse(await readFile(new URL('../contracts/normalization/family-lifecycle.v1.json', import.meta.url), 'utf8'));

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

check(plugin.schema_version === 'lovekgd-penpot-resource-graph-plugin-contract-v1', 'plugin schema');
check(plugin.delivery_id === 'resource-graph-004', 'plugin delivery id');
check(plugin.status === 'candidate-transport-contract', 'plugin candidate transport status');
check(plugin.source?.catalog_count_per_update === 1, 'single catalog per update');
check(plugin.source?.authority === 'lifecycle-scoped', 'source authority must be lifecycle scoped');
check(plugin.source?.reconstruction_authority === 'pinned-exact-source-and-evidence', 'reconstruction source authority');
check(plugin.source?.promotion_authority === 'accepted-production-release-inventory', 'promotion source authority');
check(plugin.interaction?.plugin_open_per_update === 1, 'single plugin opening');
check(plugin.interaction?.maximum_user_actions <= 3, 'maximum three user actions');
check(plugin.interaction?.actions?.filter((action) => action.mutates_file).length === 1, 'exactly one mutation action');
check(plugin.interaction?.actions?.some((action) => action.id === 'update-everything' && action.primary), 'primary update-everything action');

const pluginPageNames = (plugin.penpot_pages || []).map((page) => page.name);
const scaffoldPageNames = (scaffold.pages || []).map((page) => page.name);
const pageNames = new Set(pluginPageNames);
check(JSON.stringify(pluginPageNames) === JSON.stringify(scaffoldPageNames), 'plugin page model must exactly equal accepted 23-page scaffold');
check(pageNames.size === (plugin.penpot_pages || []).length, 'duplicate Penpot page names');

check(plugin.lifecycle?.contract_ref === 'contracts/normalization/family-lifecycle.v1.json', 'lifecycle contract ref');
check(plugin.lifecycle?.candidate_materialization_state === 'PENPOT_COMPONENT_CANDIDATE', 'Penpot candidate lifecycle state');
check(JSON.stringify(plugin.lifecycle?.candidate_mutation_states) === JSON.stringify(['PENPOT_COMPONENT_CANDIDATE', 'PAGE_ARCHETYPE_CANDIDATE', 'PRODUCT_REPRESENTATIONS', 'REVIEWED_CORRECTIONS']), 'candidate mutation states must exclude conformance and Gemini audit');
check(JSON.stringify(plugin.lifecycle?.required_completed_states_before_materialization) === JSON.stringify(['CANDIDATE_CONTRACT_ACCEPTED', 'CANONICAL_CODE_CANDIDATE']), 'Penpot lifecycle prerequisites');
check(plugin.lifecycle?.candidate_authority_mode === 'reconstructed', 'candidate authority reconstructed');
check(plugin.lifecycle?.candidate_status === 'candidate', 'candidate status');
check(plugin.lifecycle?.candidate_canonical === false, 'candidate noncanonical');
check(plugin.lifecycle?.candidate_metadata_guard?.current_state_must_be_allowed === true, 'candidate mutation needs an allowed current state');
check(plugin.lifecycle?.candidate_metadata_guard?.state_receipt_must_match_subject_and_candidate_hashes === true, 'candidate mutation receipt must bind subject and hashes');
check(plugin.lifecycle?.candidate_metadata_guard?.missing_stale_or_mismatched_evidence_effect === 'abort-before-mutation', 'invalid candidate evidence aborts before mutation');
check(plugin.lifecycle?.candidate_metadata_guard?.partial_write_effect === 'rollback-to-operation-checkpoint', 'partial candidate writes roll back');
check(plugin.lifecycle?.promotion_side_effect_forbidden === true, 'plugin cannot promote');
check(plugin.lifecycle?.design_system_led_reconciliation_requires_existing_promotion_receipt === true, 'promoted reconciliation needs receipt');
for (const field of lifecycle.penpot_pre_promotion_semantics?.required_metadata || []) {
  check(plugin.lifecycle?.required_candidate_metadata?.includes(field), `plugin missing lifecycle candidate metadata: ${field}`);
}

const phases = new Set(plugin.update_everything_phases || []);
for (const requiredPhase of [
  'reconcile-iconography-inventory',
  'reconcile-icon-component-masters',
  'reconcile-icon-variants-and-specimens',
  'reconcile-icon-consumer-links',
  'reconcile-archetype-instances',
  'reconcile-product-representations',
  'reconcile-product-state-matrices',
  'reconcile-ux-flow-links',
  'validate-lifecycle-authorization',
  'write-lifecycle-candidate-metadata',
  'preserve-native-comments-and-review-snapshots',
  'verify-hashes-counts-links-and-coverage',
]) {
  check(phases.has(requiredPhase), `missing update phase: ${requiredPhase}`);
}

const managedTypes = new Set(plugin.managed_object_types || []);
for (const requiredType of [
  'icon-component-master',
  'icon-variant',
  'icon-specimen',
  'icon-consumer-link',
  'page-archetype',
  'product-screen',
  'product-screen-state',
  'screen-component-instance',
  'screen-transition',
  'ux-flow',
]) {
  check(managedTypes.has(requiredType), `missing managed object type: ${requiredType}`);
}

check(plugin.iconography?.native_vector_required === true, 'native vector icon masters required');
check(plugin.iconography?.forbid_rasterized_icon_masters === true, 'rasterized icon masters forbidden');
check(plugin.iconography?.separate_page === '25 — Iconography', 'iconography page link');
check((plugin.status_dimensions || []).includes('iconography'), 'iconography currentness dimension');
check((plugin.status_dimensions || []).includes('family-lifecycle-state'), 'lifecycle currentness dimension');
check((plugin.status_dimensions || []).includes('last-passed-lifecycle-gate'), 'last lifecycle gate dimension');
check((plugin.status_dimensions || []).includes('post-correction-evidence-currentness'), 'post-correction evidence dimension');
check(plugin.recovery?.preserve_native_comments === true, 'native comments preserved');
check(plugin.recovery?.resume_without_user_page_selection === true, 'resume without page selection');

check(iconography.schema_version === 'lovekgd-penpot-iconography-contract-v1', 'iconography schema');
check(iconography.delivery_id === plugin.delivery_id, 'matching delivery id');
check(iconography.penpot?.page === plugin.iconography?.separate_page, 'matching iconography page');
check(iconography.penpot?.master_format === 'native-vector-component', 'native vector master format');
check(iconography.penpot?.rasterized_master_forbidden === true, 'iconography raster master prohibition');
check(iconography.source_contract?.authority === 'accepted-production-release', 'production-only icon authority');
check(iconography.update_flow?.user_action === 'update-everything', 'one update action for iconography');
check(iconography.update_flow?.manual_per_icon_import_forbidden === true, 'manual per-icon import forbidden');
check(iconography.specimens?.control_target_px === 44, '44px control target');
check(JSON.stringify(iconography.specimens?.sizes_px) === JSON.stringify([16, 20, 24, 32]), 'icon specimen size matrix');
check(iconography.classification?.unclassified_blocks_publication === true, 'unclassified icons block publication');

for (const edge of iconography.consumer_graph?.required_edges || []) {
  check(plugin.iconography?.required_links?.includes(edge), `plugin missing icon edge: ${edge}`);
}
for (const gate of iconography.acceptance || []) {
  check(typeof gate === 'string' && gate.length > 0, 'empty iconography acceptance gate');
}

if (failures.length) {
  console.error('Resource Graph 004 contract validation: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Resource Graph 004 contract validation: PASS');
console.log(`Pages: ${pageNames.size}`);
console.log(`Update phases: ${phases.size}`);
console.log(`Managed object types: ${managedTypes.size}`);
console.log(`Icon resource paths: ${iconography.resource_hierarchy.length}`);

#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const plugin = JSON.parse(await readFile(new URL('../contracts/resource-graph-004.plugin.json', import.meta.url), 'utf8'));
const iconography = JSON.parse(await readFile(new URL('../contracts/resource-graph-004.iconography.json', import.meta.url), 'utf8'));

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

check(plugin.schema_version === 'lovekgd-penpot-resource-graph-plugin-contract-v1', 'plugin schema');
check(plugin.delivery_id === 'resource-graph-004', 'plugin delivery id');
check(plugin.source?.catalog_count_per_update === 1, 'single catalog per update');
check(plugin.interaction?.plugin_open_per_update === 1, 'single plugin opening');
check(plugin.interaction?.maximum_user_actions <= 3, 'maximum three user actions');
check(plugin.interaction?.actions?.filter((action) => action.mutates_file).length === 1, 'exactly one mutation action');
check(plugin.interaction?.actions?.some((action) => action.id === 'update-everything' && action.primary), 'primary update-everything action');

const pageNames = new Set((plugin.penpot_pages || []).map((page) => page.name));
for (const requiredPage of [
  '10 — Brand assets',
  '20 — Foundations',
  '25 — Iconography',
  '30 — Core UI resources',
  '40 — Announcements components',
  '50 — Product patterns',
  '60 — Page archetypes',
  '70 — Coverage and fragmentation',
  '90 — Evidence / desktop',
  '91 — Evidence / tablet',
  '92 — Evidence / mobile',
  '93 — Evidence / interaction and accessibility',
]) {
  check(pageNames.has(requiredPage), `missing Penpot page: ${requiredPage}`);
}
check(pageNames.size === (plugin.penpot_pages || []).length, 'duplicate Penpot page names');

const phases = new Set(plugin.update_everything_phases || []);
for (const requiredPhase of [
  'reconcile-iconography-inventory',
  'reconcile-icon-component-masters',
  'reconcile-icon-variants-and-specimens',
  'reconcile-icon-consumer-links',
  'reconcile-archetype-instances',
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
]) {
  check(managedTypes.has(requiredType), `missing managed object type: ${requiredType}`);
}

check(plugin.iconography?.native_vector_required === true, 'native vector icon masters required');
check(plugin.iconography?.forbid_rasterized_icon_masters === true, 'rasterized icon masters forbidden');
check(plugin.iconography?.separate_page === '25 — Iconography', 'iconography page link');
check((plugin.status_dimensions || []).includes('iconography'), 'iconography currentness dimension');
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

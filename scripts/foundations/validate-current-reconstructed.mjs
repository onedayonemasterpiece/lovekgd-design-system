#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const readJson = (relative, base = root) => JSON.parse(fs.readFileSync(path.join(base, relative), 'utf8'));
const readJsonl = (relative, base = root) => fs.readFileSync(path.join(base, relative), 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const fail = (code, message) => { const error = new Error(message); error.code = code; throw error; };
const need = (condition, code, message) => { if (!condition) fail(code, message); };

export const validateFoundations = (base = root) => {
  const contract = readJson('contracts/foundations/current-reconstructed.v1.json', base);
  const model = readJson('catalog/foundations/current-reconstructed/semantic-model.v1.json', base);
  const graph = readJson('catalog/foundations/current-reconstructed/token-graph.v1.json', base);
  const icons = readJson('catalog/foundations/current-reconstructed/iconography-registry.v2.json', base);
  const brand = readJson('catalog/foundations/current-reconstructed/brand-baseline.v1.json', base);
  const matrix = readJsonl('catalog/foundations/current-reconstructed/consumer-drift-matrix.v1.jsonl', base);
  need(contract.foundation_id === 'kenigevents.current-reconstructed', 'FND_ID', 'foundation id drift');
  need(contract.authority_mode === 'ASTRO_AS_IS_REFERENCE', 'FND_AUTHORITY', 'Astro must remain authority');
  need(contract.visual_delta_allowed === false && contract.global_consumer_migration_allowed === false, 'FND_NO_OP', 'baseline may not permit visual or global migration');
  need(contract.penpot_materialization === 'BLOCKED_SEPARATE_LEASE_AND_OWNER_REVIEW_REQUIRED', 'FND_PENPOT_GATE', 'F1 must not materialize Penpot');
  need(contract.source.repository === 'onedayonemasterpiece/events-bot-new' && /^[a-f0-9]{40}$/u.test(contract.source.commit), 'FND_SOURCE_PIN', 'source pin missing');
  const required = ['communication.content-terminology', 'brand.assets', 'colors-and-modes', 'typography', 'iconography', 'media', 'responsive-breakpoints', 'containers-and-grid', 'spacing-and-sizing', 'density', 'radius-border-opacity-elevation', 'layering-sticky-fixed', 'motion', 'accessibility'];
  need(JSON.stringify([...contract.required_domains].sort()) === JSON.stringify([...required].sort()), 'FND_DOMAIN_SET', 'domain set drift');
  const ids = new Set(contract.identities.map((identity) => identity.canonical_id));
  for (const id of ['foundation.colors-and-modes', 'foundation.typography', 'foundation.spacing-sizing-density', 'foundation.radius-border-opacity-elevation', 'foundation.layout-responsive-layering', 'foundation.motion', 'foundation.iconography', 'foundation.brand-assets-media-terminology', 'foundation.accessibility']) need(ids.has(id), 'FND_IDENTITY_MISSING', `missing ${id}`);
  for (const identity of contract.identities) for (const field of ['current_runtime_values', 'source_paths', 'modes_and_states', 'accessibility_constraints', 'aliases_and_localized_names', 'duplicate_or_conflicting_authorities', 'version_and_lifecycle', 'drift_status', 'proposed_no_op_binding']) need(Object.hasOwn(identity, field), 'FND_IDENTITY_FIELD', `${identity.canonical_id} missing ${field}`);
  need(model.marker === 'ASP_FOUNDATION_SEMANTIC_MODEL_V1' && model.theme.id === 'current-reconstructed', 'FND_MODEL', 'semantic model drift');
  const order = ['primitive', 'semantic_foundation', 'component', 'pattern_or_archetype', 'theme_or_product_alias'];
  need(JSON.stringify(model.layer_order) === JSON.stringify(order), 'FND_LAYER_ORDER', 'semantic layer order drift');
  need(graph.marker === 'ASP_FOUNDATION_TOKEN_GRAPH_V1' && graph.theme_alias === 'current-reconstructed' && graph.edges.length >= 10, 'FND_GRAPH', 'token graph incomplete');
  need(icons.marker === 'ASP_ICONOGRAPHY_REGISTRY_V2' && icons.status === 'CENSUS_COMPLETE_PENPOT_UNMATERIALIZED' && icons.penpot.status === 'FORBIDDEN_IN_F1', 'FND_ICONS', 'iconography cannot imply Penpot write');
  need(brand.marker === 'ASP_BRAND_BASELINE_V1' && brand.status === 'CURRENT_RECONSTRUCTED_NO_OP', 'FND_BRAND', 'brand baseline drift');
  need(matrix.length >= 8 && matrix.some((row) => row.id === 'consumer.collection-free' && row.migration === 'FORBIDDEN_FREE_COLLECTION_TUPLE'), 'FND_SEPARATION', 'free collection separation missing');
  need(matrix.every((row) => row.migration !== 'MIGRATE_NOW'), 'FND_MIGRATION_ESCAPE', 'unapproved migration found');
  return { status: 'PASS', identities: contract.identities.length, consumers: matrix.length, icon_families: icons.families.length, source_commit: contract.source.commit };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(validateFoundations(), null, 2));

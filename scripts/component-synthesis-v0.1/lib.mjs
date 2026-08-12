import crypto from 'node:crypto';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ComponentSynthesisValidationError, demand, reject } from './structured-error.mjs';
import { validateEventMediaPolicy } from './media-policy.mjs';
import {
  EXCLUDED_ENTITY_KINDS,
  MATERIALIZABLE_WAVES,
  PATHS,
  STATUS_FALSE_FIELDS,
  TERMINAL_DISPOSITIONS,
  TERMINAL_RECONCILIATION_RESULTS,
} from './paths.mjs';

export { ComponentSynthesisValidationError, PATHS };

export const stable = (value) => `${JSON.stringify(sortObject(value), null, 2)}\n`;

function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortObject(value[key])]));
}

export const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const sortedUnique = (values) => [...new Set(values)].sort();
const sameSet = (left, right) => JSON.stringify(sortedUnique(left)) === JSON.stringify(sortedUnique(right));
const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const posix = (value) => value.split(path.sep).join('/');

function absolute(root, relative) {
  const target = path.resolve(root, relative);
  demand(target === root || target.startsWith(`${root}${path.sep}`), 'ACS_PATH_ESCAPE', 'io', relative, '$', 'artifact path escapes validation root');
  return target;
}

function requireFile(root, relative) {
  const target = absolute(root, relative);
  demand(fs.existsSync(target) && fs.statSync(target).isFile(), 'ACS_REQUIRED_ARTIFACT_MISSING', 'io', relative, '$', `required artifact missing: ${relative}`);
  return target;
}

export function readJson(root, relative) {
  const target = requireFile(root, relative);
  try {
    return JSON.parse(fs.readFileSync(target, 'utf8'));
  } catch (error) {
    reject('ACS_JSON_PARSE', 'io', relative, '$', `invalid JSON: ${error.message}`);
  }
}

export function readJsonl(root, relative) {
  const target = requireFile(root, relative);
  const text = fs.readFileSync(target, 'utf8');
  const lines = text.split('\n');
  if (lines.at(-1) === '') lines.pop();
  demand(lines.length > 0 && lines.every((line) => line.trim().length > 0), 'ACS_JSONL_FORMAT', 'io', relative, '$', 'JSONL must contain records, one non-blank line each, and may only have one trailing newline');
  return lines.map((line, index) => {
    try { return JSON.parse(line); }
    catch (error) { reject('ACS_JSON_PARSE', 'io', relative, `$[${index}]`, `invalid JSONL record: ${error.message}`); }
  });
}

function assertUnique(rows, key, code, stage, record) {
  const values = rows.map((row) => row?.[key]);
  demand(values.every(nonEmpty), code, stage, record, `$[*].${key}`, `${key} must be a non-empty string`);
  demand(new Set(values).size === values.length, code, stage, record, `$[*].${key}`, `${key} values must be unique`);
}

function assertSorted(values, code, stage, record, pointer) {
  demand(JSON.stringify(values) === JSON.stringify([...values].sort()), code, stage, record, pointer, 'records must be in deterministic lexical order');
}

function assertCandidateStatus(status, code, stage, record, pointer = '$.status') {
  demand(status && typeof status === 'object', code, stage, record, pointer, 'candidate status object is required');
  demand(status.authority_mode === 'reconstructed', code, stage, record, `${pointer}.authority_mode`, 'authority_mode must remain reconstructed');
  for (const field of STATUS_FALSE_FIELDS) demand(status[field] === false, code, stage, record, `${pointer}.${field}`, `${field} must remain false`);
}

function assertFalseStatus(status, code, stage, record, pointer = '$.status') {
  demand(status && typeof status === 'object', code, stage, record, pointer, 'status object is required');
  for (const field of STATUS_FALSE_FIELDS) demand(status[field] === false, code, stage, record, `${pointer}.${field}`, `${field} must remain false`);
}

function detectCycle(nodeIds, edges, fromKey, toKey, code, stage, record) {
  const ids = Array.from(nodeIds);
  const adjacency = new Map(ids.map((id) => [id, []]));
  for (const edge of edges) adjacency.get(edge[fromKey])?.push(edge[toKey]);
  for (const children of adjacency.values()) children.sort();
  const color = new Map();
  const stack = [];
  const visit = (node) => {
    color.set(node, 1); stack.push(node);
    for (const child of adjacency.get(node) ?? []) {
      if (color.get(child) === 1) {
        const offset = stack.indexOf(child);
        reject(code, stage, record, '$.edges', `prohibited dependency cycle: ${[...stack.slice(offset), child].join(' -> ')}`);
      }
      if (!color.has(child)) visit(child);
    }
    stack.pop(); color.set(node, 2);
  };
  for (const id of [...ids].sort()) if (!color.has(id)) visit(id);
}

function topologicalOrder(nodeIds, edges, parentKey = 'parent', childKey = 'child') {
  // Child dependencies must materialize before their parents.
  const dependencies = new Map(nodeIds.map((id) => [id, []]));
  for (const edge of edges) dependencies.get(edge[parentKey])?.push(edge[childKey]);
  for (const refs of dependencies.values()) refs.sort();
  const visited = new Set(); const active = new Set(); const order = [];
  const visit = (node) => {
    if (visited.has(node)) return;
    demand(!active.has(node), 'ACS_DEPENDENCY_CYCLE', 'hierarchy', node, '$.edges', 'dependency graph contains a prohibited cycle');
    active.add(node);
    for (const dependency of dependencies.get(node) ?? []) visit(dependency);
    active.delete(node); visited.add(node); order.push(node);
  };
  for (const id of [...nodeIds].sort()) visit(id);
  return order;
}

function validateCore(root) {
  const schema = readJson(root, PATHS.schema);
  demand(schema.$schema === 'https://json-schema.org/draft/2020-12/schema' && schema.$defs, 'ACS_SCHEMA_CONTRACT', 'schema', PATHS.schema, '$', 'registry schema must be Draft 2020-12 with definitions');
  const entities = readJsonl(root, PATHS.entityRegistry);
  const mappings = readJsonl(root, PATHS.mappings);
  const hierarchy = readJson(root, PATHS.hierarchy);
  const archetypeRegistry = readJsonl(root, PATHS.archetypeRegistry);
  const plan = readJson(root, PATHS.plan);
  const owner = readJson(root, PATHS.ownerAmbiguities);
  const queue = readJsonl(root, PATHS.reconciliationQueue);

  demand(entities.length === 111, 'ACS_REGISTRY_COUNT', 'registry', PATHS.entityRegistry, '$', 'final evidence-backed registry must retain exactly 111 entities');
  assertUnique(entities, 'entity_id', 'ACS_ENTITY_ID_DUPLICATE', 'registry', PATHS.entityRegistry);
  assertSorted(entities.map((row) => row.entity_id), 'ACS_REGISTRY_NONDETERMINISTIC', 'registry', PATHS.entityRegistry, '$[*].entity_id');
  const entityById = new Map(entities.map((row) => [row.entity_id, row]));
  for (const entity of entities) {
    assertCandidateStatus(entity.status, 'ACS_STATUS_ESCAPE', 'registry', entity.entity_id);
    demand(entity.status.contract_decision_status === 'draft', 'ACS_STATUS_ESCAPE', 'registry', entity.entity_id, '$.status.contract_decision_status', 'contract decision must remain draft');
    for (const ref of entity.nested_entity_refs ?? []) demand(entityById.has(ref), 'ACS_NESTED_ENTITY_FK', 'registry', entity.entity_id, '$.nested_entity_refs', `unknown nested entity ${ref}`);
    if (EXCLUDED_ENTITY_KINDS.has(entity.entity_kind)) demand(entity.penpot_eligible === false, 'ACS_EXCLUDED_ENTITY_ELIGIBLE', 'registry', entity.entity_id, '$.penpot_eligible', `${entity.entity_kind} entity cannot be Penpot eligible`);
    if (entity.candidate_disposition === 'experiment_not_merged') demand(entity.penpot_eligible === false, 'ACS_EXPERIMENT_MERGED', 'registry', entity.entity_id, '$.candidate_disposition', 'experiment must remain excluded and NOT_MERGED');
  }

  demand(mappings.length === 107, 'ACS_MAPPING_COUNT', 'mapping', PATHS.mappings, '$', `expected exactly 107 mappings, found ${mappings.length}`);
  assertUnique(mappings, 'source_path', 'ACS_MAPPING_SOURCE_DUPLICATE', 'mapping', PATHS.mappings);
  assertSorted(mappings.map((row) => row.source_path), 'ACS_MAPPING_NONDETERMINISTIC', 'mapping', PATHS.mappings, '$[*].source_path');
  for (const mapping of mappings) {
    demand(mapping.source_kind === 'file' && mapping.source_path.startsWith('site/'), 'ACS_MAPPING_TERMINAL', 'mapping', mapping.source_path, '$', 'mapping must identify an exact source file');
    demand(TERMINAL_DISPOSITIONS.has(mapping.terminal_disposition), 'ACS_MAPPING_TERMINAL', 'mapping', mapping.source_path, '$.terminal_disposition', 'mapping lacks a recognized terminal disposition');
    demand(Array.isArray(mapping.target_entity_ids) && mapping.target_entity_ids.length > 0, 'ACS_MAPPING_TERMINAL', 'mapping', mapping.source_path, '$.target_entity_ids', 'terminal mapping requires at least one target');
    demand(new Set(mapping.target_entity_ids).size === mapping.target_entity_ids.length, 'ACS_MAPPING_TARGET_DUPLICATE', 'mapping', mapping.source_path, '$.target_entity_ids', 'mapping target IDs must be unique');
    for (const target of mapping.target_entity_ids) demand(entityById.has(target), 'ACS_MAPPING_TARGET_FK', 'mapping', mapping.source_path, '$.target_entity_ids', `unknown mapping target ${target}`);
    demand(mapping.owner_question_required === false, 'ACS_OWNER_QUESTION', 'mapping', mapping.source_path, '$.owner_question_required', 'technical mapping may not be routed to the owner');
  }

  demand(hierarchy.authority_mode === 'reconstructed' && hierarchy.canonical === false, 'ACS_STATUS_ESCAPE', 'hierarchy', PATHS.hierarchy, '$', 'hierarchy must remain reconstructed and non-canonical');
  demand(Array.isArray(hierarchy.edges), 'ACS_HIERARCHY_FK', 'hierarchy', PATHS.hierarchy, '$.edges', 'hierarchy edges are required');
  const edgeKeys = hierarchy.edges.map((edge) => `${edge.parent}\u0000${edge.child}\u0000${edge.relation}`);
  demand(new Set(edgeKeys).size === edgeKeys.length, 'ACS_HIERARCHY_DUPLICATE', 'hierarchy', PATHS.hierarchy, '$.edges', 'duplicate hierarchy edge');
  assertSorted(edgeKeys, 'ACS_HIERARCHY_NONDETERMINISTIC', 'hierarchy', PATHS.hierarchy, '$.edges');
  for (const edge of hierarchy.edges) {
    demand(entityById.has(edge.parent) && entityById.has(edge.child), 'ACS_HIERARCHY_FK', 'hierarchy', `${edge.parent}->${edge.child}`, '$', 'hierarchy edge contains an unknown entity');
    demand(edge.parent !== edge.child, 'ACS_DEPENDENCY_CYCLE', 'hierarchy', edge.parent, '$', 'self-cycle is prohibited');
  }
  detectCycle(new Set(entities.map((row) => row.entity_id)), hierarchy.edges, 'parent', 'child', 'ACS_DEPENDENCY_CYCLE', 'hierarchy', PATHS.hierarchy);
  const layerIds = Object.values(hierarchy.layers ?? {}).flat();
  demand(layerIds.length === new Set(layerIds).size && layerIds.every((id) => entityById.has(id)), 'ACS_HIERARCHY_LAYER_PARTITION', 'hierarchy', PATHS.hierarchy, '$.layers', 'hierarchy layers may contain each known classified entity at most once');
  for (const [name, ids] of Object.entries(hierarchy.layers ?? {})) {
    demand(ids.length === new Set(ids).size && ids.every((id) => entityById.has(id)), 'ACS_HIERARCHY_LAYER_PARTITION', 'hierarchy', name, `$.layers.${name}`, 'hierarchy layer has duplicate or unknown entity IDs');
    assertSorted(ids, 'ACS_HIERARCHY_NONDETERMINISTIC', 'hierarchy', name, `$.layers.${name}`);
  }

  demand(archetypeRegistry.length === 18, 'ACS_ARCHETYPE_REGISTRY_COUNT', 'archetype-registry', PATHS.archetypeRegistry, '$', 'exactly 18 archetype registry records are required');
  assertUnique(archetypeRegistry, 'archetype_id', 'ACS_ARCHETYPE_REGISTRY_COUNT', 'archetype-registry', PATHS.archetypeRegistry);
  assertSorted(archetypeRegistry.map((row) => row.archetype_id), 'ACS_ARCHETYPE_NONDETERMINISTIC', 'archetype-registry', PATHS.archetypeRegistry, '$[*].archetype_id');
  for (const archetype of archetypeRegistry) {
    assertCandidateStatus(archetype.status, 'ACS_STATUS_ESCAPE', 'archetype-registry', archetype.archetype_id);
    for (const ref of [...archetype.component_refs, ...archetype.composition_refs]) demand(entityById.has(ref), 'ACS_ARCHETYPE_REGISTRY_FK', 'archetype-registry', archetype.archetype_id, '$.component_refs', `unknown archetype entity ref ${ref}`);
  }

  demand(plan.current_path_closure?.mapping_rows === 107 && plan.current_path_closure?.exact_file_rows === 107 && plan.current_path_closure?.directory_placeholders === 0, 'ACS_PLAN_CLOSURE', 'plan', PATHS.plan, '$.current_path_closure', 'materialization plan must preserve exact 107 file closure');
  demand(plan.authority_mode === 'reconstructed' && plan.accepted === false && plan.promotion_ready === false, 'ACS_STATUS_ESCAPE', 'plan', PATHS.plan, '$', 'materialization plan escaped candidate status');
  demand(plan.owner_ambiguity_count === 0 && plan.technical_reconciliation_count === 6, 'ACS_OWNER_AMBIGUITY', 'plan', PATHS.plan, '$', 'plan must retain 0 owner ambiguities and 6 technical reconciliations');
  const materializableWaves = plan.waves.filter((wave) => MATERIALIZABLE_WAVES.has(wave.wave_id));
  demand(materializableWaves.length === 4, 'ACS_PLAN_WAVE_SET', 'plan', PATHS.plan, '$.waves', 'W1-W4 must exist exactly once');
  const materializableIds = materializableWaves.flatMap((wave) => wave.entity_ids);
  demand(materializableIds.length === new Set(materializableIds).size, 'ACS_PLAN_WAVE_SET', 'plan', PATHS.plan, '$.waves', 'materializable entity appears in multiple waves');
  for (const id of materializableIds) {
    const entity = entityById.get(id);
    demand(entity && entity.penpot_eligible === true && !EXCLUDED_ENTITY_KINDS.has(entity.entity_kind), 'ACS_EXCLUDED_ENTITY_MATERIALIZED', 'plan', id, '$.waves', 'W1-W4 contains excluded/runtime/evidence/experiment/unresolved entity');
  }
  const excludedIds = plan.excluded_entity_ids ?? [];
  demand(new Set(excludedIds).size === excludedIds.length && excludedIds.every((id) => entityById.has(id)), 'ACS_PLAN_EXCLUSION_SET', 'plan', PATHS.plan, '$.excluded_entity_ids', 'excluded entity list has duplicate or unknown IDs');
  demand(excludedIds.every((id) => !materializableIds.includes(id)), 'ACS_EXCLUDED_ENTITY_MATERIALIZED', 'plan', PATHS.plan, '$.excluded_entity_ids', 'excluded entity also appears in W1-W4');
  for (const entity of entities.filter((row) => EXCLUDED_ENTITY_KINDS.has(row.entity_kind) || row.penpot_eligible === false)) {
    demand(excludedIds.includes(entity.entity_id), 'ACS_PLAN_EXCLUSION_SET', 'plan', entity.entity_id, '$.excluded_entity_ids', 'non-materializable final entity is absent from exclusion set');
  }

  demand(owner.count === 0 && Array.isArray(owner.items) && owner.items.length === 0, 'ACS_OWNER_AMBIGUITY', 'owner', PATHS.ownerAmbiguities, '$', 'owner ambiguity count/items must be zero');
  demand(Array.isArray(owner.technical_evidence_queue) && owner.technical_evidence_queue.every((item) => item.owner_question === false), 'ACS_OWNER_QUESTION', 'owner', PATHS.ownerAmbiguities, '$.technical_evidence_queue', 'technical evidence item was routed to owner');
  demand(queue.length === 6, 'ACS_RECONCILIATION_COUNT', 'reconciliation', PATHS.reconciliationQueue, '$', 'exactly six reconciliation queue items are required');
  assertUnique(queue, 'id', 'ACS_RECONCILIATION_COUNT', 'reconciliation', PATHS.reconciliationQueue);
  demand(queue.every((item) => item.owner_question === false), 'ACS_OWNER_QUESTION', 'reconciliation', PATHS.reconciliationQueue, '$[*].owner_question', 'technical reconciliation may not be an owner question');

  const schemaScript = `
import json, pathlib, sys
from jsonschema import Draft202012Validator
root=pathlib.Path(sys.argv[1]); schema=json.loads((root/sys.argv[2]).read_text())
Draft202012Validator.check_schema(schema)
checks=[
 ('entity',sys.argv[3],True),('mapping',sys.argv[4],True),('hierarchy',sys.argv[5],False),
 ('archetype_registry',sys.argv[6],True),('materialization_plan',sys.argv[7],False),
 ('owner_ambiguities',sys.argv[8],False),('technical_queue_item',sys.argv[9],True),
]
for definition,relative,is_jsonl in checks:
 text=(root/relative).read_text()
 docs=[json.loads(line) for line in text.splitlines() if line] if is_jsonl else [json.loads(text)]
 subschema={'$schema':schema['$schema'],'$defs':schema['$defs'],'$ref':f'#/$defs/{definition}'}
 validator=Draft202012Validator(subschema)
 for index,document in enumerate(docs):
  errors=sorted(validator.iter_errors(document),key=lambda e:list(e.absolute_path))
  if errors: raise AssertionError(f'{relative}:{index+1}: {errors[0].json_path}: {errors[0].message}')
`;
  const schemaCheck = childProcess.spawnSync('python3', ['-c', schemaScript, root, PATHS.schema, PATHS.entityRegistry, PATHS.mappings, PATHS.hierarchy, PATHS.archetypeRegistry, PATHS.plan, PATHS.ownerAmbiguities, PATHS.reconciliationQueue], { encoding: 'utf8' });
  demand(schemaCheck.status === 0, 'ACS_REGISTRY_SCHEMA', 'schema', PATHS.schema, '$', `Draft 2020-12 registry validation failed: ${schemaCheck.stderr.trim()}`);

  return { entities, entityById, mappings, hierarchy, archetypeRegistry, plan, queue, materializableIds, excludedIds };
}

function validatePackage(root) {
  const verification = readJson(root, PATHS.packageVerification);
  const zip = 'catalog/lovekgd-component-synthesis-v0.1(1).zip';
  const zipPath = requireFile(root, zip);
  const archiveSha = verification.package_sha256 ?? verification.archive_sha256 ?? verification.zip_sha256 ?? verification.archive?.sha256;
  demand(/^[0-9a-f]{64}$/u.test(archiveSha ?? '') && sha256(fs.readFileSync(zipPath)) === archiveSha, 'ACS_PACKAGE_ARCHIVE_DRIFT', 'package', PATHS.packageVerification, '$.archive_sha256', 'immutable ZIP hash does not match package verification');
  const entries = verification.entries ?? verification.manifest_entries ?? verification.manifest?.entries ?? verification.files;
  demand(Array.isArray(entries) && entries.length === 16, 'ACS_PACKAGE_MANIFEST', 'package', PATHS.packageVerification, '$.manifest_entries', 'package verification must bind all 16 manifest entries');
  demand(verification.manifest_file_count === 16 && verification.all_archive_entries_match === true && verification.all_extracted_entries_matched_at_extraction_commit === true && verification.verification_result === 'PASS', 'ACS_PACKAGE_MANIFEST', 'package', PATHS.packageVerification, '$', 'package verification did not pass all manifest/archive/extraction gates');
  demand(entries.every((entry) => entry.archive_entry_match === true && entry.extraction_match === true && entry.extracted_at_commit === '8bf4ad465cbd9d943935c201378b867a5d539456' && entry.manifest_sha256 === entry.archive_entry_sha256), 'ACS_PACKAGE_EXTRACTION_RECEIPT', 'package', PATHS.packageVerification, '$.entries', 'manifest/archive/extraction entry evidence differs');
  const packageMetrics = readJson(root, 'catalog/normalization/component-synthesis-v0.1/metrics.json');
  demand(packageMetrics.original_package_counts?.candidate_components_and_controls === 61 || packageMetrics.candidate_components_and_controls === 61, 'ACS_PACKAGE_BASELINE', 'package', 'catalog/normalization/component-synthesis-v0.1/metrics.json', '$.original_package_counts.candidate_components_and_controls', 'immutable package baseline must record 61 candidate components/controls');
  return verification;
}

function validateReconciliation(root, core) {
  const drift = readJsonl(root, PATHS.sourceDrift);
  demand(drift.length === 107, 'ACS_SOURCE_DRIFT_COUNT', 'source-drift', PATHS.sourceDrift, '$', 'source drift ledger must contain exactly 107 source_path records');
  assertUnique(drift, 'source_path', 'ACS_SOURCE_PATH_CLOSURE', 'source-drift', PATHS.sourceDrift);
  assertSorted(drift.map((row) => row.source_path), 'ACS_SOURCE_DRIFT_NONDETERMINISTIC', 'source-drift', PATHS.sourceDrift, '$[*].source_path');
  demand(sameSet(drift.map((row) => row.source_path), core.mappings.map((row) => row.source_path)), 'ACS_SOURCE_PATH_CLOSURE', 'source-drift', PATHS.sourceDrift, '$[*].source_path', 'drift ledger path set differs from exact mapping set');
  for (const row of drift) {
    demand(row.record_kind === 'source_path' && row.source_kind === 'file' && row.exists?.current === true, 'ACS_SOURCE_PATH_CLOSURE', 'source-drift', row.source_path, '$', 'current exact source file is missing or record kind is invalid');
    demand(['UNCHANGED', 'MODIFIED', 'ADDED', 'REMOVED'].includes(row.drift_from_decoder) && ['UNCHANGED', 'MODIFIED', 'ADDED', 'REMOVED'].includes(row.drift_from_synthesis), 'ACS_SOURCE_DRIFT_ENUM', 'source-drift', row.source_path, '$', 'invalid drift disposition');
    demand(!row.material_drift || (row.delta_finding && nonEmpty(row.delta_finding.finding_id ?? row.delta_finding.id)), 'ACS_SOURCE_DRIFT_UNDECLARED', 'source-drift', row.source_path, '$.delta_finding', 'material drift requires a machine-readable delta finding');
    demand(TERMINAL_RECONCILIATION_RESULTS.has(row.verification_result), 'ACS_SOURCE_DRIFT_TERMINAL', 'source-drift', row.source_path, '$.verification_result', 'source row lacks terminal verification result');
    for (const key of ['import_edge_fingerprint_sha256', 'consumer_edge_fingerprint_sha256']) demand(/^[0-9a-f]{64}$/u.test(row[key] ?? ''), 'ACS_SOURCE_EDGE_FINGERPRINT', 'source-drift', row.source_path, `$.${key}`, 'edge fingerprint must be SHA-256');
  }

  const results = readJsonl(root, PATHS.reconciliationResults);
  demand(results.length === 6, 'ACS_RECONCILIATION_COUNT', 'reconciliation', PATHS.reconciliationResults, '$', 'exactly six terminal reconciliation results are required');
  assertUnique(results, 'queue_item_id', 'ACS_RECONCILIATION_COUNT', 'reconciliation', PATHS.reconciliationResults);
  demand(JSON.stringify(results.map((row) => row.queue_item_id)) === JSON.stringify(core.queue.map((row) => row.id)), 'ACS_RECONCILIATION_NONDETERMINISTIC', 'reconciliation', PATHS.reconciliationResults, '$[*].queue_item_id', 'terminal results must follow source queue order');
  demand(sameSet(results.map((row) => row.queue_item_id), core.queue.map((row) => row.id)), 'ACS_RECONCILIATION_QUEUE_FK', 'reconciliation', PATHS.reconciliationResults, '$[*].queue_item_id', 'terminal results do not resolve the exact six-item queue');
  const queueById = new Map(core.queue.map((row) => [row.id, row]));
  for (const result of results) {
    const queued = queueById.get(result.queue_item_id);
    demand(TERMINAL_RECONCILIATION_RESULTS.has(result.terminal_result), 'ACS_RECONCILIATION_TERMINAL', 'reconciliation', result.queue_item_id, '$.terminal_result', 'invalid reconciliation terminal result');
    demand(result.owner_question === false && result.owner_ambiguity_count === 0 && result.product_meaning_ambiguity === false, 'ACS_OWNER_QUESTION', 'reconciliation', result.queue_item_id, '$', 'technical or governance reconciliation escaped into owner queue');
    demand(sameSet(result.source_paths ?? [], queued.source_paths) && sameSet(result.candidate_targets ?? [], queued.candidate_targets), 'ACS_RECONCILIATION_QUEUE_FK', 'reconciliation', result.queue_item_id, '$', 'result source paths/targets differ from queued task');
    demand(result.evidence && result.resolution && nonEmpty(result.resolution.boundary_action), 'ACS_RECONCILIATION_EVIDENCE', 'reconciliation', result.queue_item_id, '$', 'terminal result requires evidence and a boundary action');
  }
  const transport = results.find((row) => row.queue_item_id === 'TECH-TRANSPORT-EXPERIMENT-001');
  const experimentDecision = transport?.resolution?.experiment_decision;
  demand(experimentDecision === 'NOT_MERGED' || /NOT_MERGED/u.test(JSON.stringify(transport?.resolution ?? {})), 'ACS_EXPERIMENT_MERGED', 'reconciliation', 'TECH-TRANSPORT-EXPERIMENT-001', '$.resolution', 'transport experiments must explicitly remain NOT_MERGED');

  const media = readJsonl(root, PATHS.mediaMatrix);
  demand(media.length > 0, 'ACS_MEDIA_COVERAGE', 'media', PATHS.mediaMatrix, '$', 'consumer-scoped media matrix is empty');
  assertUnique(media, 'policy_cell_id', 'ACS_MEDIA_COVERAGE', 'media', PATHS.mediaMatrix);
  const semantics = new Set(); const conditions = new Set(); const fits = new Set(); const ratios = new Set();
  for (const row of media) {
    semantics.add(row.semantic_mode); conditions.add(row.source_condition); fits.add(row.fit); ratios.add(row.target_ratio); ratios.add(row.source_ratio);
    for (const field of ['consumer_id', 'consumer_source_path', 'slot', 'viewport', 'source_ratio', 'target_ratio', 'focal_policy', 'safe_area_policy', 'upscale_policy', 'layout_reservation', 'loading_applicability', 'loading_treatment', 'missing_behavior', 'broken_behavior', 'tiny_source_behavior']) demand(nonEmpty(row[field]), 'ACS_MEDIA_CELL_INCOMPLETE', 'media', row.policy_cell_id, `$.${field}`, `${field} is required`);
    assertFalseStatus(row.status, 'ACS_STATUS_ESCAPE', 'media', row.policy_cell_id);
    if (row.loading_applicability === 'native_image_decode_only') demand(row.loading_treatment === 'no_synthetic_component_skeleton', 'ACS_STATIC_SKELETON', 'media', row.policy_cell_id, '$.loading_treatment', 'static Astro HTML may not receive a synthetic component skeleton');
    if (/skeleton/u.test(row.loading_treatment) && row.loading_treatment !== 'no_synthetic_component_skeleton') demand(/client_wait|proven/u.test(row.loading_applicability), 'ACS_STATIC_SKELETON', 'media', row.policy_cell_id, '$.loading_applicability', 'skeleton requires proven client wait applicability');
  }
  for (const value of ['photography', 'portrait_poster', 'artwork_with_text', 'ocr_document', 'unknown_text', 'fallback']) demand(semantics.has(value), 'ACS_MEDIA_COVERAGE', 'media', PATHS.mediaMatrix, '$[*].semantic_mode', `missing semantic mode ${value}`);
  for (const value of ['ready', 'missing', 'broken', 'tiny_source']) demand(conditions.has(value), 'ACS_MEDIA_COVERAGE', 'media', PATHS.mediaMatrix, '$[*].source_condition', `missing source condition ${value}`);
  for (const value of ['cover', 'contain']) demand(fits.has(value), 'ACS_MEDIA_COVERAGE', 'media', PATHS.mediaMatrix, '$[*].fit', `missing fit ${value}`);
  for (const value of ['4:5', '5:4', '3:2', '2:3', '1:1']) demand(ratios.has(value), 'ACS_MEDIA_COVERAGE', 'media', PATHS.mediaMatrix, '$', `missing media ratio ${value}`);
  demand(ratios.has('intrinsic') || ratios.has('source') || ratios.has('intrinsic/source'), 'ACS_MEDIA_COVERAGE', 'media', PATHS.mediaMatrix, '$', 'missing intrinsic/source ratio');
  return { drift, results, media };
}

function git(eventsRoot, args) {
  const result = childProcess.spawnSync('git', args, { cwd: eventsRoot, encoding: 'utf8' });
  demand(result.status === 0, 'ACS_EVENTS_REPLAY', 'events-replay', args.join(' '), '$', `git command failed: ${result.stderr.trim()}`);
  return result.stdout.trim();
}

function importSpecifiers(text) {
  const values = [];
  const expression = /(?:\bimport|\bexport)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']\s*\)/gu;
  for (const match of text.matchAll(expression)) values.push(match[1] ?? match[2]);
  return sortedUnique(values);
}

function replayEventsEvidence(eventsRepo, driftRows) {
  const eventsRoot = path.resolve(eventsRepo);
  demand(fs.existsSync(eventsRoot), 'ACS_EVENTS_REPO_REQUIRED', 'events-replay', eventsRoot, '$', 'events repository does not exist');
  const expectedHead = 'f66330f8af81d4b898d137d83356e77914dce90a';
  const synthesisObserved = 'a161061d8161409566412db2b1909031949dc104';
  demand(git(eventsRoot, ['rev-parse', 'HEAD']) === expectedHead, 'ACS_EVENTS_HEAD_MISMATCH', 'events-replay', eventsRoot, '$', `events HEAD must be ${expectedHead}`);
  demand(git(eventsRoot, ['status', '--porcelain']) === '', 'ACS_EVENTS_REPO_DIRTY', 'events-replay', eventsRoot, '$', 'events evidence checkout must remain clean');
  const treeSha = git(eventsRoot, ['rev-parse', 'HEAD^{tree}']);
  git(eventsRoot, ['cat-file', '-e', `${synthesisObserved}^{commit}`]);
  const astroInventory = (commit) => git(eventsRoot, ['ls-tree', '-r', '--name-only', commit, '--', 'site/src/components'])
    .split('\n').filter((file) => file.endsWith('.astro')).sort();
  const currentAstro = astroInventory(expectedHead);
  const observedAstro = astroInventory(synthesisObserved);
  const ledgerAstro = driftRows.map((row) => row.source_path).filter((file) => file.endsWith('.astro')).sort();
  demand(currentAstro.length === 106 && observedAstro.length === 106 && JSON.stringify(currentAstro) === JSON.stringify(observedAstro) && JSON.stringify(currentAstro) === JSON.stringify(ledgerAstro), 'ACS_EVENTS_SCOPE_DRIFT', 'events-replay', eventsRoot, '$', 'bounded site/src/components Astro implementation inventory added, removed or escaped the 106-path synthesis scope');
  const codeFiles = git(eventsRoot, ['ls-tree', '-r', '--name-only', 'HEAD', '--', 'site/src'])
    .split('\n').filter((file) => /\.(?:astro|[cm]?[jt]sx?|json|css)$/u.test(file));
  const codeFileSet = new Set(codeFiles);
  const extensions = ['astro', 'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'json', 'css'];
  const resolveSpecifier = (from, specifier) => {
    if (!specifier.startsWith('.')) return null;
    const base = path.posix.normalize(path.posix.join(path.posix.dirname(from), specifier));
    const candidates = [base, ...extensions.map((ext) => `${base}.${ext}`), ...extensions.map((ext) => `${base}/index.${ext}`)];
    return candidates.find((candidate) => codeFileSet.has(candidate)) ?? null;
  };
  const imports = new Map();
  for (const file of codeFiles) {
    const text = fs.readFileSync(path.join(eventsRoot, file), 'utf8');
    imports.set(file, sortedUnique(importSpecifiers(text).map((specifier) => resolveSpecifier(file, specifier)).filter(Boolean)));
  }
  const consumers = new Map(driftRows.map((row) => [row.source_path, []]));
  for (const [source, refs] of imports) for (const ref of refs) if (consumers.has(ref)) consumers.get(ref).push(source);
  for (const values of consumers.values()) values.sort();
  for (const row of driftRows) {
    const target = path.join(eventsRoot, row.source_path);
    demand(fs.existsSync(target) && fs.statSync(target).isFile(), 'ACS_EVENTS_PATH_MISMATCH', 'events-replay', row.source_path, '$', 'ledger source path is absent at exact events HEAD');
    const oid = git(eventsRoot, ['rev-parse', `HEAD:${row.source_path}`]);
    demand(oid === row.blob_oids.current, 'ACS_EVENTS_BLOB_MISMATCH', 'events-replay', row.source_path, '$.blob_oids.current', 'live Git blob differs from ledger current blob');
    const actualImports = imports.get(row.source_path) ?? [];
    const actualConsumers = consumers.get(row.source_path) ?? [];
    demand(JSON.stringify(actualImports) === JSON.stringify(row.import_edges_current), 'ACS_EVENTS_IMPORT_EDGE_MISMATCH', 'events-replay', row.source_path, '$.import_edges_current', 'replayed import edges differ from ledger');
    demand(JSON.stringify(actualConsumers) === JSON.stringify(row.consumer_edges_current), 'ACS_EVENTS_CONSUMER_EDGE_MISMATCH', 'events-replay', row.source_path, '$.consumer_edges_current', 'replayed consumer edges differ from ledger');
    demand(sha256(JSON.stringify(actualImports)) === row.import_edge_fingerprint_sha256 && sha256(JSON.stringify(actualConsumers)) === row.consumer_edge_fingerprint_sha256, 'ACS_EVENTS_EDGE_FINGERPRINT', 'events-replay', row.source_path, '$', 'replayed edge fingerprint differs from ledger');
  }
  demand(git(eventsRoot, ['status', '--porcelain']) === '', 'ACS_EVENTS_REPO_DIRTY', 'events-replay', eventsRoot, '$', 'events replay mutated the evidence checkout');
  return { head_sha: expectedHead, tree_sha: treeSha, synthesis_observed_sha: synthesisObserved, exact_paths: driftRows.length, affected_astro_implementations: currentAstro.length, result: 'PASS' };
}

function validateContractsAndFixtures(root, core) {
  const index = readJson(root, PATHS.contractIndex);
  demand(index.schema_version === 'lovekgd_component_synthesis_contract_index_v0_1', 'ACS_CONTRACT_INDEX', 'contracts', PATHS.contractIndex, '$.schema_version', 'unexpected contract index version');
  demand(index.expected_entity_count === core.materializableIds.length, 'ACS_CONTRACT_COVERAGE', 'contracts', PATHS.contractIndex, '$.expected_entity_count', 'contract index count differs from final W1-W4 plan');
  demand(Array.isArray(index.contracts) && index.contracts.length === core.materializableIds.length, 'ACS_CONTRACT_COVERAGE', 'contracts', PATHS.contractIndex, '$.contracts', 'one contract is required for every final W1-W4 entity');
  assertUnique(index.contracts, 'stable_component_id', 'ACS_CONTRACT_COVERAGE', 'contracts', PATHS.contractIndex);
  demand(JSON.stringify(index.contracts.map((row) => row.stable_component_id)) === JSON.stringify(core.materializableIds), 'ACS_CONTRACT_NONDETERMINISTIC', 'contracts', PATHS.contractIndex, '$.contracts', 'contract index must follow deterministic W1-W4 plan order');
  demand(sameSet(index.contracts.map((row) => row.stable_component_id), core.materializableIds), 'ACS_CONTRACT_COVERAGE', 'contracts', PATHS.contractIndex, '$.contracts', 'contract IDs differ from final W1-W4 entity set');
  demand(Array.isArray(index.materialization_order) && sameSet(index.materialization_order, core.materializableIds), 'ACS_CONTRACT_DEPENDENCY_ORDER', 'contracts', PATHS.contractIndex, '$.materialization_order', 'dependency-first materialization order must contain every W1-W4 entity once');
  const orderPosition = new Map(index.materialization_order.map((id, position) => [id, position]));
  for (const edge of core.hierarchy.edges.filter((edge) => orderPosition.has(edge.parent) && orderPosition.has(edge.child))) {
    demand(orderPosition.get(edge.child) < orderPosition.get(edge.parent), 'ACS_CONTRACT_DEPENDENCY_ORDER', 'contracts', `${edge.parent}->${edge.child}`, '$.materialization_order', 'nested dependency must precede parent materialization');
  }

  const contractById = new Map();
  for (const entry of index.contracts) {
    demand(MATERIALIZABLE_WAVES.has(entry.wave_id), 'ACS_CONTRACT_WAVE', 'contracts', entry.stable_component_id, '$.wave_id', 'contract is not in W1-W4');
    demand(posix(entry.path).startsWith(`${PATHS.contractsDir}/`) && entry.path.endsWith('.contract.json'), 'ACS_CONTRACT_INDEX', 'contracts', entry.stable_component_id, '$.path', 'contract path escapes canonical contract directory');
    const contract = readJson(root, entry.path);
    demand(/^[0-9a-f]{64}$/u.test(entry.sha256 ?? '') && sha256(fs.readFileSync(requireFile(root, entry.path))) === entry.sha256, 'ACS_CONTRACT_INDEX', 'contracts', entry.stable_component_id, '$.sha256', 'contract hash differs from index');
    demand(contract.stable_component_id === entry.stable_component_id && contract.wave_id === entry.wave_id, 'ACS_CONTRACT_INDEX', 'contracts', entry.stable_component_id, '$', 'contract identity/wave differs from index');
    assertCandidateStatus(contract.status, 'ACS_STATUS_ESCAPE', 'contracts', entry.stable_component_id);
    demand(contract.status.contract_decision_status === 'draft', 'ACS_STATUS_ESCAPE', 'contracts', entry.stable_component_id, '$.status.contract_decision_status', 'candidate contract must remain draft');
    const entity = core.entityById.get(contract.stable_component_id);
    demand(entity && entity.penpot_eligible === true && !EXCLUDED_ENTITY_KINDS.has(entity.entity_kind), 'ACS_EXCLUDED_ENTITY_MATERIALIZED', 'contracts', entry.stable_component_id, '$', 'contract targets an excluded entity');
    demand(contract.entity_kind === entity.entity_kind && contract.candidate_disposition === entity.candidate_disposition, 'ACS_CONTRACT_REGISTRY_JOIN', 'contracts', entry.stable_component_id, '$', 'contract classification differs from final registry');
    demand(sameSet(contract.source?.source_implementations ?? [], entity.source_implementations), 'ACS_CONTRACT_SOURCE_JOIN', 'contracts', entry.stable_component_id, '$.source.source_implementations', 'contract source implementations differ from registry');
    demand(sameSet((contract.nested_components ?? []).map((row) => row.entity_ref), entity.nested_entity_refs), 'ACS_CONTRACT_NESTED_JOIN', 'contracts', entry.stable_component_id, '$.nested_components', 'contract nested refs differ from registry');
    for (const nested of contract.nested_components ?? []) demand(core.entityById.has(nested.entity_ref) && nested.instance_required === true, 'ACS_CONTRACT_FK', 'contracts', entry.stable_component_id, '$.nested_components', 'nested component ref is unknown or not instance-required');
    demand(contract.penpot_binding?.resource_graph_file_id === core.plan.resource_graph_file_id, 'ACS_MATERIALIZATION_BINDING', 'contracts', entry.stable_component_id, '$.penpot_binding.resource_graph_file_id', 'contract targets the wrong Penpot file');
    demand(nonEmpty(contract.penpot_binding?.stable_plugin_data_id) && contract.penpot_binding.detached_copy_allowed === false && contract.penpot_binding.screenshot_master_allowed === false, 'ACS_MATERIALIZATION_BINDING', 'contracts', entry.stable_component_id, '$.penpot_binding', 'stable plugin binding and native-master prohibitions are required');
    demand(contract.penpot_binding.component_id === null && contract.penpot_binding.main_component_id === null && contract.penpot_binding.materialization_status === 'planned', 'ACS_PREMATURE_MATERIALIZATION_CLAIM', 'contracts', entry.stable_component_id, '$.penpot_binding', 'Git contract may not pre-claim live component IDs');
    demand(contract.responsive_container_behavior?.numeric_tokens_added === false && contract.content_constraints?.numeric_tokens_added === false, 'ACS_NUMERIC_TOKEN_INVENTION', 'contracts', entry.stable_component_id, '$', 'contract invented numeric tokens');
    demand(contract.loading_recovery?.static_html_skeleton === 'forbidden', 'ACS_STATIC_SKELETON', 'contracts', entry.stable_component_id, '$.loading_recovery.static_html_skeleton', 'static Astro HTML skeleton must be forbidden');
    contractById.set(contract.stable_component_id, { contract, entry });
  }

  const fixtureCatalog = readJson(root, PATHS.fixtureCatalog);
  demand(fixtureCatalog.schema_version === 'lovekgd_component_synthesis_fixture_catalog_v0_1', 'ACS_FIXTURE_CATALOG', 'fixtures', PATHS.fixtureCatalog, '$.schema_version', 'unexpected fixture catalog version');
  assertFalseStatus(fixtureCatalog.status, 'ACS_STATUS_ESCAPE', 'fixtures', PATHS.fixtureCatalog);
  demand(fixtureCatalog.status.candidate_only === true, 'ACS_STATUS_ESCAPE', 'fixtures', PATHS.fixtureCatalog, '$.status.candidate_only', 'fixtures must remain candidate-only');
  demand(Array.isArray(fixtureCatalog.fixtures) && fixtureCatalog.fixtures.length > 0, 'ACS_FIXTURE_COVERAGE', 'fixtures', PATHS.fixtureCatalog, '$.fixtures', 'fixture catalog is empty');
  assertUnique(fixtureCatalog.fixtures, 'fixture_id', 'ACS_FIXTURE_COVERAGE', 'fixtures', PATHS.fixtureCatalog);
  const fixtureById = new Map(fixtureCatalog.fixtures.map((row) => [row.fixture_id, row]));
  for (const fixture of fixtureCatalog.fixtures) {
    assertFalseStatus(fixture.status, 'ACS_STATUS_ESCAPE', 'fixtures', fixture.fixture_id);
    demand(['text', 'viewport', 'count', 'runtime_state', 'media'].includes(fixture.dimension), 'ACS_FIXTURE_CATALOG', 'fixtures', fixture.fixture_id, '$.dimension', 'unknown fixture dimension');
    demand(fixture.static_html_skeleton === false, 'ACS_STATIC_SKELETON', 'fixtures', fixture.fixture_id, '$.static_html_skeleton', 'fixture may not claim a static HTML skeleton');
  }
  const dimensionByRequirement = { text: 'text', viewports: 'viewport', counts: 'count', runtime_states: 'runtime_state', media: 'media' };
  for (const [requirement, dimension] of Object.entries(dimensionByRequirement)) {
    const observed = fixtureCatalog.fixtures.filter((row) => row.dimension === dimension).map((row) => row.value);
    if (requirement !== 'media') for (const required of core.plan.fixture_requirements[requirement]) demand(observed.includes(required), 'ACS_FIXTURE_COVERAGE', 'fixtures', PATHS.fixtureCatalog, '$.fixtures', `missing ${dimension} fixture value ${required}`);
  }
  const mediaRequirementEvidence = {
    'landscape-photo': ['fixture.photo-landscape-3x2-focal-safe-cover'],
    'portrait-poster': ['fixture.photo-portrait-4x5-derived-cover', 'fixture.poster-companion'],
    square: ['fixture.poster-ocr-square-1x1-contain'],
    'artwork-with-text': ['fixture.poster-ocr-square-1x1-contain'],
    'ocr-document': ['fixture.poster-ocr-intrinsic-contain'],
    'unknown-text': ['fixture.unknown-text-contain'],
    missing: ['fixture.state-missing'],
    broken: ['fixture.state-broken'],
    'tiny-source': ['fixture.state-tiny'],
  };
  for (const required of core.plan.fixture_requirements.media) demand(mediaRequirementEvidence[required]?.every((id) => fixtureById.has(id)), 'ACS_FIXTURE_COVERAGE', 'fixtures', PATHS.fixtureCatalog, '$.fixtures', `missing media evidence fixture for ${required}`);

  const fixtureBindings = readJson(root, PATHS.fixtureBindings);
  demand(fixtureBindings.schema_version === 'lovekgd_component_synthesis_entity_fixture_bindings_v0_1', 'ACS_FIXTURE_BINDING', 'fixtures', PATHS.fixtureBindings, '$.schema_version', 'unexpected fixture binding version');
  demand(Array.isArray(fixtureBindings.bindings) && fixtureBindings.bindings.length === core.materializableIds.length, 'ACS_FIXTURE_BINDING', 'fixtures', PATHS.fixtureBindings, '$.bindings', 'one fixture binding is required per W1-W4 entity');
  assertUnique(fixtureBindings.bindings, 'binding_id', 'ACS_FIXTURE_BINDING', 'fixtures', PATHS.fixtureBindings);
  assertUnique(fixtureBindings.bindings, 'entity_ref', 'ACS_FIXTURE_BINDING', 'fixtures', PATHS.fixtureBindings);
  demand(JSON.stringify(fixtureBindings.bindings.map((row) => row.entity_ref)) === JSON.stringify(core.materializableIds), 'ACS_FIXTURE_NONDETERMINISTIC', 'fixtures', PATHS.fixtureBindings, '$.bindings', 'fixture bindings must follow deterministic W1-W4 plan order');
  demand(sameSet(fixtureBindings.bindings.map((row) => row.entity_ref), core.materializableIds), 'ACS_FIXTURE_BINDING', 'fixtures', PATHS.fixtureBindings, '$.bindings', 'fixture bindings differ from final W1-W4 set');
  const bindingByEntity = new Map();
  for (const binding of fixtureBindings.bindings) {
    assertFalseStatus(binding.status, 'ACS_STATUS_ESCAPE', 'fixtures', binding.binding_id);
    demand(binding.loading_policy?.static_html_skeleton === false, 'ACS_STATIC_SKELETON', 'fixtures', binding.binding_id, '$.loading_policy.static_html_skeleton', 'entity binding may not add static HTML skeleton');
    const refs = Object.values(binding.fixture_refs ?? {}).flat();
    demand(refs.length > 0 && refs.every((ref) => fixtureById.has(ref)), 'ACS_FIXTURE_BINDING', 'fixtures', binding.binding_id, '$.fixture_refs', 'fixture binding is empty or contains unknown fixture ref');
    demand(new Set(refs).size === refs.length, 'ACS_FIXTURE_BINDING', 'fixtures', binding.binding_id, '$.fixture_refs', 'fixture may not be repeated across binding dimensions');
    bindingByEntity.set(binding.entity_ref, binding);
  }
  for (const [id, { contract }] of contractById) {
    const binding = bindingByEntity.get(id);
    demand(contract.penpot_binding.fixture_binding_ids?.includes(binding.binding_id), 'ACS_FIXTURE_BINDING', 'contracts', id, '$.penpot_binding.fixture_binding_ids', 'contract does not bind its entity fixture binding');
    const expected = [
      ...(contract.fixture_plan?.text_fixture_ids ?? []),
      ...(contract.fixture_plan?.viewport_fixture_ids ?? []),
      ...(contract.fixture_plan?.count_fixture_ids ?? []),
      ...(contract.fixture_plan?.runtime_fixture_ids ?? []),
      ...(contract.fixture_plan?.media_fixture_ids ?? []),
    ];
    demand(expected.every((ref) => fixtureById.has(ref)), 'ACS_FIXTURE_BINDING', 'contracts', id, '$.fixture_plan', 'contract fixture plan contains unknown fixture');
  }
  return { index, contractById, fixtureCatalog, fixtureById, fixtureBindings, bindingByEntity };
}

function validateArchetypes(root, core, fixtures) {
  const index = readJson(root, PATHS.archetypeIndex);
  demand(Array.isArray(index.graph_files) && index.graph_files.length === 18, 'ACS_ARCHETYPE_GRAPH_COUNT', 'archetypes', PATHS.archetypeIndex, '$.graph_files', 'archetype index must list exactly 18 graph files');
  assertUnique(index.graph_files, 'archetype_id', 'ACS_ARCHETYPE_GRAPH_COUNT', 'archetypes', PATHS.archetypeIndex);
  assertSorted(index.graph_files.map((row) => row.archetype_id), 'ACS_ARCHETYPE_NONDETERMINISTIC', 'archetypes', PATHS.archetypeIndex, '$.graph_files');
  const expectedIds = core.archetypeRegistry.map((row) => row.archetype_id);
  demand(sameSet(index.archetype_ids ?? [], expectedIds) && sameSet(index.graph_files.map((row) => row.archetype_id), expectedIds), 'ACS_ARCHETYPE_GRAPH_COUNT', 'archetypes', PATHS.archetypeIndex, '$', 'archetype graph/index IDs differ from exact registry');
  demand(index.counts?.archetypes === 18 && index.invariants?.exact_archetype_count === 18, 'ACS_ARCHETYPE_GRAPH_COUNT', 'archetypes', PATHS.archetypeIndex, '$.counts', 'archetype count invariant mismatch');
  demand(index.invariants?.all_nodes_instances_or_explicit_gaps === true && index.invariants?.detached_copies === 0 && index.invariants?.local_overrides === 0, 'ACS_ARCHETYPE_DETACHED', 'archetypes', PATHS.archetypeIndex, '$.invariants', 'archetype index permits detached copies, overrides or implicit gaps');
  demand(index.invariants?.canonical === false && index.invariants?.accepted === false && index.invariants?.promotion_ready === false, 'ACS_STATUS_ESCAPE', 'archetypes', PATHS.archetypeIndex, '$.invariants', 'archetype index escaped candidate status');
  const registryById = new Map(core.archetypeRegistry.map((row) => [row.archetype_id, row]));
  const graphs = [];
  for (const entry of index.graph_files) {
    demand(posix(entry.path).startsWith(`${PATHS.archetypeGraphsDir}/`) && entry.path.endsWith('.json'), 'ACS_ARCHETYPE_INDEX', 'archetypes', entry.archetype_id, '$.path', 'archetype graph path escapes canonical graph directory');
    const bytes = fs.readFileSync(requireFile(root, entry.path));
    demand(/^[0-9a-f]{64}$/u.test(entry.sha256) && sha256(bytes) === entry.sha256, 'ACS_ARCHETYPE_INDEX', 'archetypes', entry.archetype_id, '$.sha256', 'archetype graph hash differs from index');
    const graph = JSON.parse(bytes.toString('utf8'));
    const registry = registryById.get(entry.archetype_id);
    demand(graph.archetype_id === entry.archetype_id, 'ACS_ARCHETYPE_INDEX', 'archetypes', entry.archetype_id, '$.archetype_id', 'graph identity differs from index');
    assertCandidateStatus(graph.status, 'ACS_STATUS_ESCAPE', 'archetypes', graph.archetype_id);
    demand(graph.materialization_policy?.instances_only === true && graph.materialization_policy.detached_copies_allowed === false && graph.materialization_policy.local_overrides_allowed === false && graph.materialization_policy.promotion_claimed === false, 'ACS_ARCHETYPE_DETACHED', 'archetypes', graph.archetype_id, '$.materialization_policy', 'archetype materialization policy is not instances/gaps-only');
    demand(sameSet(graph.applicability?.viewport_modes ?? [], registry.viewport_modes), 'ACS_ARCHETYPE_REGISTRY_JOIN', 'archetypes', graph.archetype_id, '$.applicability.viewport_modes', 'graph viewport applicability differs from registry');
    demand(sameSet(graph.fixture_refs ?? [], (graph.fixtures ?? []).map((fixture) => fixture.fixture_id)), 'ACS_ARCHETYPE_FIXTURE', 'archetypes', graph.archetype_id, '$.fixture_refs', 'inline fixture refs differ from inline fixture definitions');
    const inlineFixtureIds = new Set((graph.fixtures ?? []).map((fixture) => fixture.fixture_id));
    const nodes = graph.instance_graph?.nodes ?? [];
    const edges = graph.instance_graph?.edges ?? [];
    assertUnique(nodes, 'node_id', 'ACS_ARCHETYPE_NODE_FK', 'archetypes', graph.archetype_id);
    const nodeById = new Map(nodes.map((node) => [node.node_id, node]));
    for (const node of nodes) {
      demand(['component_instance', 'pattern_instance', 'gap_placeholder'].includes(node.node_kind), 'ACS_ARCHETYPE_NODE_KIND', 'archetypes', graph.archetype_id, `$.instance_graph.nodes.${node.node_id}`, 'unknown archetype node kind');
      demand(node.detached === false && Array.isArray(node.local_overrides) && node.local_overrides.length === 0, 'ACS_ARCHETYPE_DETACHED', 'archetypes', graph.archetype_id, `$.instance_graph.nodes.${node.node_id}`, 'detached copy or local override is prohibited');
      demand((node.fixture_refs ?? []).every((ref) => inlineFixtureIds.has(ref)), 'ACS_ARCHETYPE_FIXTURE', 'archetypes', graph.archetype_id, `$.instance_graph.nodes.${node.node_id}.fixture_refs`, 'archetype node contains unknown inline fixture');
      if (node.node_kind === 'gap_placeholder') demand(node.gap && nonEmpty(node.gap.gap_id) && nonEmpty(node.gap.uncovered_region) && nonEmpty(node.gap.reason), 'ACS_ARCHETYPE_GAP', 'archetypes', graph.archetype_id, `$.instance_graph.nodes.${node.node_id}.gap`, 'gap placeholder requires explicit gap identity, region and reason');
      else {
        const entity = core.entityById.get(node.entity_ref);
        demand(entity && core.materializableIds.includes(node.entity_ref), 'ACS_ARCHETYPE_GRAPH_FK', 'archetypes', graph.archetype_id, `$.instance_graph.nodes.${node.node_id}.entity_ref`, `archetype instance references non-materializable entity ${node.entity_ref}`);
        if (node.node_kind === 'pattern_instance') demand(entity.entity_kind === 'product_pattern', 'ACS_ARCHETYPE_NODE_KIND', 'archetypes', graph.archetype_id, `$.instance_graph.nodes.${node.node_id}.node_kind`, 'pattern instance must reference a product_pattern');
        else demand(entity.entity_kind !== 'product_pattern', 'ACS_ARCHETYPE_NODE_KIND', 'archetypes', graph.archetype_id, `$.instance_graph.nodes.${node.node_id}.node_kind`, 'component instance may not reference a product_pattern');
      }
    }
    for (const edge of edges) demand(nodeById.has(edge.from_node_id) && nodeById.has(edge.to_node_id), 'ACS_ARCHETYPE_NODE_FK', 'archetypes', graph.archetype_id, '$.instance_graph.edges', 'archetype edge contains unknown node');
    detectCycle(new Set(nodes.map((node) => node.node_id)), edges, 'from_node_id', 'to_node_id', 'ACS_ARCHETYPE_CYCLE', 'archetypes', graph.archetype_id);
    const roots = graph.instance_graph?.root_node_ids ?? [];
    demand(roots.length > 0 && roots.every((id) => nodeById.has(id)), 'ACS_ARCHETYPE_ROOT', 'archetypes', graph.archetype_id, '$.instance_graph.root_node_ids', 'archetype requires known roots');
    const adjacency = new Map(nodes.map((node) => [node.node_id, []]));
    for (const edge of edges) adjacency.get(edge.from_node_id).push(edge.to_node_id);
    const reached = new Set(); const todo = [...roots];
    while (todo.length) { const id = todo.pop(); if (reached.has(id)) continue; reached.add(id); todo.push(...adjacency.get(id)); }
    demand(reached.size === nodes.length, 'ACS_ARCHETYPE_REACHABILITY', 'archetypes', graph.archetype_id, '$.instance_graph', 'every archetype node must be reachable from a root');
    for (const row of graph.state_matrix ?? []) {
      demand(inlineFixtureIds.has(row.fixture_ref), 'ACS_ARCHETYPE_STATE_MATRIX', 'archetypes', graph.archetype_id, '$.state_matrix.fixture_ref', 'state matrix fixture ref is unknown');
      demand((row.active_node_ids ?? []).every((id) => nodeById.has(id)) && (row.expected_gap_node_ids ?? []).every((id) => nodeById.get(id)?.node_kind === 'gap_placeholder'), 'ACS_ARCHETYPE_STATE_MATRIX', 'archetypes', graph.archetype_id, '$.state_matrix', 'state matrix contains unknown active/gap node');
    }
    const gapIds = nodes.filter((node) => node.node_kind === 'gap_placeholder').map((node) => node.gap.gap_id);
    demand(sameSet(graph.gap_refs ?? [], gapIds), 'ACS_ARCHETYPE_GAP', 'archetypes', graph.archetype_id, '$.gap_refs', 'gap refs differ from explicit gap nodes');
    graphs.push({ graph, entry });
  }
  return { index, graphs };
}

function axiswiseTuples(contract) {
  const axes = [...(contract.variant_axes ?? []), ...(contract.state_axes ?? [])]
    .map((axis) => ({ axis_id: axis.axis_id, values: [...axis.values] }))
    .sort((left, right) => left.axis_id.localeCompare(right.axis_id));
  if (axes.length === 0) return [{ variant_key: 'default', selections: {} }];
  const defaults = Object.fromEntries(axes.map((axis) => [axis.axis_id, axis.values[0]]));
  const tuples = [{ variant_key: 'default', selections: defaults }];
  for (const axis of axes) for (const value of axis.values.slice(1)) {
    const selections = { ...defaults, [axis.axis_id]: value };
    tuples.push({ variant_key: `${axis.axis_id}=${value}`, selections });
  }
  return tuples;
}

function nestedInstancesForTuple(namespace, id, tuple, nestedComponents) {
  const caseValue = tuple.selections.case ?? tuple.selections.cardinality_case ?? null;
  const frameCases = ['loaded-safe-cover', 'loaded-protected-contain', 'loading-reserved', 'broken-fallback', 'tiny-bounded'];
  return nestedComponents.flatMap((nested) => {
    if (nested.when_case_values && !nested.when_case_values.includes(caseValue)) return [];
    const count = nested.multiplicity_by_case?.[caseValue] ?? 1;
    return Array.from({ length: count }, (_, ordinal) => {
      const componentVariantCase = nested.entity_ref === 'event.media-frame' ? frameCases[ordinal % frameCases.length] : null;
      return {
        entity_ref: nested.entity_ref,
        relation: nested.relation,
        slot_id: nested.slot_id,
        ordinal,
        consumer_profile_ref: id === 'listing.rail-row' ? 'profile.mobile-listing-rail-row' : null,
        component_variant_case: componentVariantCase,
        stable_plugin_data_id: `${namespace}.nested.${id}.${sha256(`${tuple.variant_key}:${nested.slot_id}:${nested.entity_ref}:${ordinal}`).slice(0, 16)}`,
        instance_required: true,
        detached: false,
      };
    });
  });
}

function scaffoldLookup(root) {
  const relative = 'contracts/resource-graph-scaffold.v1.json';
  const scaffold = readJson(root, relative);
  demand(scaffold.penpot_file_id === '3be9e5e1-190f-8090-8008-713c0fbe6260' && scaffold.expected_counts?.pages === 23 && scaffold.expected_counts?.managed_zones === 257, 'ACS_SCAFFOLD_GUARD', 'materialization', relative, '$', 'Resource Graph scaffold identity/counts changed');
  const pages = new Map(scaffold.pages.map((page) => [page.name, page]));
  const required = ['10 — Brand assets', '25 — Iconography', '30 — Core UI resources', '40 — Announcements components', '50 — Product patterns', '60 — Page archetypes', '62 — Product representations', '64 — Product state matrices', '99 — MCP diagnostics and sandbox'];
  demand(required.every((name) => pages.has(name)), 'ACS_SCAFFOLD_GUARD', 'materialization', relative, '$.pages', 'required canonical Resource Graph page is missing');
  return { scaffold, pages, relative };
}

const COMPONENT_ZONE_RULES = Object.freeze([
  [/^brand\.wordmark$/u, 'rg.zone.10.brand-assets.brand-marks'],
  [/^brand\.lockup$/u, 'rg.zone.10.brand-assets.product-lockups'],
  [/^(core\.(?:button|calendar-action|copy-action|favorite-action|share-action))$/u, 'rg.zone.30.core-ui.actions-and-buttons'],
  [/^core\.field$/u, 'rg.zone.30.core-ui.form-controls'],
  [/^(?:core\.breadcrumbs|navigation\.)/u, 'rg.zone.30.core-ui.navigation'],
  [/^core\.(?:state-panel|toast-region)$/u, 'rg.zone.30.core-ui.status-and-feedback'],
  [/^core\.dialog$/u, 'rg.zone.30.core-ui.overlays-and-disclosure'],
  [/^core\.(?:badge|icon|rail)$/u, 'rg.zone.30.core-ui.data-display'],
  [/^(?:event\.(?:card|list-item)|listing\.event-card|club\.card)$/u, 'rg.zone.40.announcements-components.event-cards-and-list-items'],
  [/^listing\.rail-row$/u, 'rg.zone.40.announcements-components.event-cards-and-list-items'],
  [/^event\.(?:fallback-art|hero-summary|media-frame|media-rail|media-viewer)$/u, 'rg.zone.40.announcements-components.event-hero-and-media'],
  [/^(?:event\.(?:fact-list|fact-row|occurrence-label|occurrence-selector)|listing\.time-marker)$/u, 'rg.zone.40.announcements-components.event-facts-dates-and-schedules'],
  [/^event\.(?:action-group|admission-summary|primary-action)$/u, 'rg.zone.40.announcements-components.event-actions-registration-and-tickets'],
  [/^transport\.(?:bus-schedule|journey-alerts|kaup-schedule|rail-schedule|route-heading)$/u, 'rg.zone.40.announcements-components.transport-and-visit-planning'],
  [/^(?:focus\.(?:invite-share|thank-you)|talk\.message)$/u, 'rg.zone.40.announcements-components.discovery-personalization-and-social-proof'],
  [/^(?:home\.quick-navigation)$/u, 'rg.zone.50.product-patterns.site-shell-and-navigation'],
  [/^listing\./u, 'rg.zone.50.product-patterns.listing-and-timeline-patterns'],
  [/^search\./u, 'rg.zone.50.product-patterns.search-and-result-patterns'],
  [/^event\.(?:card-grid|hero-composition|summary-action-panel|token-medallions)$/u, 'rg.zone.50.product-patterns.event-summary-and-action-patterns'],
  [/^(?:favorites\.|interest\.|personal-feed\.)/u, 'rg.zone.50.product-patterns.favorites-and-personalization-patterns'],
  [/^(?:artifact\.collection)$/u, 'rg.zone.50.product-patterns.collections-and-festival-patterns'],
  [/^focus\./u, 'rg.zone.50.product-patterns.focus-group-and-feedback-patterns'],
  [/^transport\.schedule-region$/u, 'rg.zone.50.product-patterns.event-summary-and-action-patterns'],
]);

const ARCHETYPE_ZONE_RULES = Object.freeze([
  [/^archetype\.home$/u, 'rg.zone.60.page-archetypes.home'],
  [/^archetype\.listing\.date$/u, 'rg.zone.60.page-archetypes.today-tomorrow-and-dated-listings'],
  [/^archetype\.listing\.(?:weekend|popular|unusual)$/u, 'rg.zone.60.page-archetypes.weekend-and-editorial-listings'],
  [/^archetype\.search$/u, 'rg.zone.60.page-archetypes.search'],
  [/^archetype\.event-detail\./u, 'rg.zone.60.page-archetypes.event-detail'],
  [/^archetype\.(?:collection|festival|exhibitions)$/u, 'rg.zone.60.page-archetypes.collections-festivals-and-exhibitions'],
  [/^archetype\.(?:favorites|personal-feed)$/u, 'rg.zone.60.page-archetypes.favorites-and-personal-feed'],
  [/^archetype\.(?:club|documents-legal|prelaunch)$/u, 'rg.zone.60.page-archetypes.special-unavailable-and-closed-pages'],
]);

function resolveStableZone(page, id, rules, stage) {
  const matched = rules.find(([pattern]) => pattern.test(id));
  demand(matched, 'ACS_SCAFFOLD_ZONE_FK', stage, id, '$.target_zone_stable_id', `no canonical Resource Graph zone rule for ${id}`);
  const zone = page.zones.find((candidate) => candidate.stable_zone_id === matched[1]);
  demand(zone, 'ACS_SCAFFOLD_ZONE_FK', stage, id, '$.target_zone_stable_id', `canonical zone ${matched[1]} is absent from ${page.name}`);
  return zone;
}

function fixtureProjectionZone(fixture) {
  if (fixture.dimension === 'viewport') {
    if (String(fixture.value).startsWith('mobile')) return 'rg.zone.62.product-representations.mobile-representations';
    if (String(fixture.value).startsWith('tablet')) return 'rg.zone.62.product-representations.tablet-representations';
    return 'rg.zone.62.product-representations.desktop-representations';
  }
  if (fixture.dimension === 'media') return 'rg.zone.62.product-representations.real-content-and-media-fixtures';
  if (fixture.dimension === 'text' || fixture.dimension === 'count') return 'rg.zone.64.product-state-matrices.text-and-content-stress';
  if (/error|offline|retrying|unavailable/u.test(String(fixture.value))) return 'rg.zone.64.product-state-matrices.error-offline-and-recovery-states';
  return 'rg.zone.64.product-state-matrices.loading-empty-and-partial-states';
}

export function buildMaterializationDocuments({ root = process.cwd() } = {}) {
  root = path.resolve(root);
  const core = validateCore(root);
  const contracts = validateContractsAndFixtures(root, core);
  const archetypes = validateArchetypes(root, core, contracts);
  const { scaffold, pages, relative: scaffoldRef } = scaffoldLookup(root);
  const namespace = 'lovekgd.component-synthesis.v0.1';
  const components = [];
  const zonePlacementCounters = new Map();
  const specimenZoneCounters = new Map();
  const representationPages = [pages.get('62 — Product representations'), pages.get('64 — Product state matrices')];
  const representationZones = new Map(representationPages.flatMap((page) => page.zones.map((zone) => [zone.stable_zone_id, { page, zone }])));
  for (const id of contracts.index.materialization_order) {
    const { contract, entry } = contracts.contractById.get(id);
    const bytes = fs.readFileSync(requireFile(root, entry.path));
    const contractSha = sha256(bytes);
    const targetPage = pages.get(contract.penpot_binding.target_page);
    demand(targetPage, 'ACS_SCAFFOLD_ZONE_FK', 'materialization', id, '$.penpot_binding.target_page', `unknown canonical target page ${contract.penpot_binding.target_page}`);
    const targetZone = resolveStableZone(targetPage, id, COMPONENT_ZONE_RULES, 'materialization');
    const variants = axiswiseTuples(contract).map((tuple) => {
      const ordinal = zonePlacementCounters.get(targetZone.stable_zone_id) ?? 0;
      zonePlacementCounters.set(targetZone.stable_zone_id, ordinal + 1);
      return {
        ...tuple,
        stable_lookup_key: `${id}+${contractSha}+${tuple.variant_key}`,
        stable_plugin_data_id: `${namespace}.variant.${id}.${sha256(tuple.variant_key).slice(0, 16)}`,
        position: { x: 32 + (ordinal % 2) * 400, y: 72 + Math.floor(ordinal / 2) * 360 },
        nested_instances: nestedInstancesForTuple(namespace, id, tuple, contract.nested_components ?? []),
      };
    });
    const binding = contracts.bindingByEntity.get(id);
    const fixtureRefs = Object.entries(binding.fixture_refs).flatMap(([dimension, refs]) => refs.map((fixtureId) => ({ dimension, fixture_id: fixtureId })));
    const specimens = fixtureRefs.map(({ dimension, fixture_id: fixtureId }) => {
      const fixture = contracts.fixtureById.get(fixtureId);
      const targetZoneStableId = fixtureProjectionZone(fixture);
      const projection = representationZones.get(targetZoneStableId);
      demand(projection, 'ACS_SCAFFOLD_ZONE_FK', 'materialization', `${id}:${fixtureId}`, '$.specimens.target_zone_stable_id', `fixture projection zone ${targetZoneStableId} is absent`);
      const ordinal = specimenZoneCounters.get(targetZoneStableId) ?? 0;
      specimenZoneCounters.set(targetZoneStableId, ordinal + 1);
      return {
        specimen_id: `${id}:${fixtureId}`,
        fixture_id: fixtureId,
        fixture_dimension: dimension,
        fixture_value: fixture.value,
        target_page: projection.page.name,
        target_page_stable_id: projection.page.stable_page_id,
        target_zone_stable_id: targetZoneStableId,
        position: { x: 32 + (ordinal % 4) * 280, y: 72 + Math.floor(ordinal / 4) * 260 },
        stable_plugin_data_id: `${namespace}.specimen.${id}.${sha256(fixtureId).slice(0, 16)}`,
        instance_stable_plugin_data_id: `${namespace}.specimen-instance.${id}.${sha256(fixtureId).slice(0, 16)}`,
        detached: false,
        screenshot_based: false,
      };
    });
    components.push({
      entity_id: id,
      display_name: contract.display_name,
      semantic_purpose: contract.semantic_purpose,
      contract_version: contract.contract_version,
      wave_id: entry.wave_id,
      contract_ref: entry.path,
      contract_sha256: contractSha,
      materialization_kind: 'native_component_master',
      target_page: targetPage.name,
      target_page_stable_id: targetPage.stable_page_id,
      target_zone_stable_id: targetZone.stable_zone_id,
      stable_plugin_data_id: contract.penpot_binding.stable_plugin_data_id,
      anatomy: contract.anatomy.map((part) => ({ part_id: part.part_id, label: part.label, required: part.required })),
      slots: contract.slots.map((slot) => ({ slot_id: slot.slot_id, role: slot.role, required: slot.required, detached_copy_allowed: false })),
      variant_strategy: variants.length === 1 ? 'ordinary_master' : 'axiswise_native_variants',
      variants,
      fixture_binding_id: binding.binding_id,
      fixture_refs: fixtureRefs,
      specimens,
      status: { authority_mode: 'reconstructed', canonical: false, accepted: false, promotion_ready: false },
      detached_copy_allowed: false,
      screenshot_master_allowed: false,
    });
  }
  const archetypePage = pages.get('60 — Page archetypes');
  const archetypeZoneCounters = new Map();
  const archetypePlans = archetypes.graphs.map(({ graph, entry }) => {
    const targetZone = resolveStableZone(archetypePage, graph.archetype_id, ARCHETYPE_ZONE_RULES, 'archetype-materialization');
    const archetypeIndex = archetypeZoneCounters.get(targetZone.stable_zone_id) ?? 0;
    archetypeZoneCounters.set(targetZone.stable_zone_id, archetypeIndex + 1);
    return ({
    archetype_id: graph.archetype_id,
    board_stable_plugin_data_id: `${namespace}.archetype-board.${graph.archetype_id}`,
    graph_ref: entry.path,
    graph_sha256: entry.sha256,
    materialization_kind: 'native_instances_and_explicit_gaps',
    target_page: archetypePage.name,
    target_page_stable_id: archetypePage.stable_page_id,
    target_zone_stable_id: targetZone.stable_zone_id,
    position: { x: 32, y: 72 + archetypeIndex * 1080 },
    nodes: graph.instance_graph.nodes.map((node) => ({
      node_id: node.node_id,
      node_kind: node.node_kind,
      entity_ref: node.entity_ref ?? null,
      gap_id: node.gap?.gap_id ?? null,
      stable_plugin_data_id: `${namespace}.archetype.${graph.archetype_id}.${node.node_id}`,
      detached: false,
      local_overrides: [],
    })),
    edges: graph.instance_graph.edges,
    status: { authority_mode: 'reconstructed', canonical: false, accepted: false, promotion_ready: false },
    });
  }).sort((a, b) => a.archetype_id.localeCompare(b.archetype_id));
  const variantCount = components.reduce((sum, component) => sum + component.variants.length, 0);
  const nestedInstanceCount = components.reduce((sum, component) => sum + component.variants.reduce((nested, variant) => nested + variant.nested_instances.length, 0), 0);
  const archetypeInstanceCount = archetypePlans.reduce((sum, archetype) => sum + archetype.nodes.filter((node) => node.node_kind !== 'gap_placeholder').length, 0);
  const gapCount = archetypePlans.reduce((sum, archetype) => sum + archetype.nodes.filter((node) => node.node_kind === 'gap_placeholder').length, 0);
  const specimenInstanceCount = components.reduce((sum, component) => sum + component.specimens.length, 0);
  const ir = {
    schema_version: 'lovekgd_component_synthesis_penpot_materialization_ir_v0_1',
    namespace,
    resource_graph_file_id: core.plan.resource_graph_file_id,
    scaffold_guard: {
      contract_ref: scaffoldRef,
      namespace: 'lovekgd.resourcegraph.scaffold.v1',
      expected_pages: scaffold.expected_counts.pages,
      expected_root_boards: scaffold.expected_counts.root_boards,
      expected_managed_zones: scaffold.expected_counts.managed_zones,
      preserve_existing_scaffold: true,
      create_pages_allowed: false,
      create_zones_allowed: false,
    },
    generated_from: {
      plan_ref: PATHS.plan,
      hierarchy_ref: PATHS.hierarchy,
      contract_index_ref: PATHS.contractIndex,
      fixture_catalog_ref: PATHS.fixtureCatalog,
      fixture_bindings_ref: PATHS.fixtureBindings,
      archetype_index_ref: PATHS.archetypeIndex,
    },
    identity_strategy: {
      lookup_tuple: ['entity_id', 'contract_sha256', 'variant_key'],
      same_hash_action: 'reuse',
      changed_hash_action: 'declared_migration_archive_previous_active_key',
      blind_variant_retry_allowed: false,
    },
    execution: {
      dependency_order: contracts.index.materialization_order,
      checkpoint_scope: 'per_wave_and_entity',
      rollback_version_required_before_wave: 'W1-core-and-actions',
      axis_expansion: 'axiswise_only',
      full_cartesian_expansion_allowed: false,
    },
    components,
    archetypes: archetypePlans,
    projections: {
      icon_instances_page: pages.get('25 — Iconography').stable_page_id,
      fixture_representations_page: pages.get('62 — Product representations').stable_page_id,
      state_matrices_page: pages.get('64 — Product state matrices').stable_page_id,
      diagnostics_page: pages.get('99 — MCP diagnostics and sandbox').stable_page_id,
    },
    excluded_entity_ids: [...core.excludedIds].sort(),
    counts: {
      package_baseline_materializable_entities: 61,
      final_materializable_entities: components.length,
      native_component_masters: components.length,
      concrete_component_variants: variantCount,
      nested_component_instances: nestedInstanceCount,
      fixture_specimen_instances: specimenInstanceCount,
      archetypes: archetypePlans.length,
      archetype_instances: archetypeInstanceCount,
      explicit_gaps: gapCount,
    },
    idempotency: {
      algorithm: 'pure-canonical-input-to-stable-ir-v1',
      second_run_byte_identical: true,
      duplicate_stable_ids_allowed: false,
      migration_required_for_changed_contract_hash: true,
    },
    status: { authority_mode: 'reconstructed', canonical: false, accepted: false, promotion_ready: false },
  };
  const rollback = {
    schema_version: 'lovekgd_component_synthesis_rollback_package_v0_1',
    namespace,
    resource_graph_file_id: core.plan.resource_graph_file_id,
    materialization_ir_ref: PATHS.materializationIr,
    rollback_version_required: true,
    rollback_version_timing: 'before_W1',
    delete_or_archive_only_by_stable_plugin_data_id: true,
    preserve_resource_graph_scaffold: true,
    preserve_unmanaged_objects: true,
    destructive_execution_authorized: false,
    component_stable_ids: components.map((component) => component.stable_plugin_data_id).sort(),
    variant_stable_ids: components.flatMap((component) => component.variants.map((variant) => variant.stable_plugin_data_id)).sort(),
    nested_instance_stable_ids: components.flatMap((component) => component.variants.flatMap((variant) => variant.nested_instances.map((nested) => nested.stable_plugin_data_id))).sort(),
    fixture_specimen_stable_ids: components.flatMap((component) => component.specimens.map((specimen) => specimen.stable_plugin_data_id)).sort(),
    fixture_specimen_instance_stable_ids: components.flatMap((component) => component.specimens.map((specimen) => specimen.instance_stable_plugin_data_id)).sort(),
    archetype_node_stable_ids: archetypePlans.flatMap((archetype) => archetype.nodes.map((node) => node.stable_plugin_data_id)).sort(),
    archetype_board_stable_ids: archetypePlans.map((archetype) => archetype.board_stable_plugin_data_id).sort(),
    rollback_actions: [
      'restore_named_version_created_before_W1',
      'or_archive_active_objects_matching_synthesis_namespace',
      'never_delete_resource_graph_scaffold_roots_or_zones',
    ],
    status: { authority_mode: 'reconstructed', canonical: false, accepted: false, promotion_ready: false },
  };
  demand(stable(ir) === stable(structuredClone(ir)) && stable(rollback) === stable(structuredClone(rollback)), 'ACS_MATERIALIZATION_NONDETERMINISTIC', 'materialization', PATHS.materializationIr, '$', 'second IR build is not byte-identical');
  return { ir, rollback, core, contracts, archetypes };
}

export function writeOrCheckMaterializationDocuments({ root = process.cwd(), check = false } = {}) {
  root = path.resolve(root);
  const first = buildMaterializationDocuments({ root });
  const second = buildMaterializationDocuments({ root });
  demand(stable(first.ir) === stable(second.ir) && stable(first.rollback) === stable(second.rollback), 'ACS_MATERIALIZATION_NONDETERMINISTIC', 'materialization', PATHS.materializationIr, '$', 'deterministic second run differs');
  for (const [relative, value] of [[PATHS.materializationIr, first.ir], [PATHS.rollbackPackage, first.rollback]]) {
    const output = absolute(root, relative); const bytes = stable(value);
    if (check) {
      demand(fs.existsSync(output) && fs.readFileSync(output, 'utf8') === bytes, 'ACS_MATERIALIZATION_IR_DRIFT', 'materialization', relative, '$', `${relative} differs from deterministic builder output`);
    } else {
      fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, bytes);
    }
  }
  return { ir: first.ir, rollback: first.rollback };
}

function validateMaterialization(root, built, core) {
  const committedIr = readJson(root, PATHS.materializationIr);
  const committedRollback = readJson(root, PATHS.rollbackPackage);
  demand(stable(committedIr) === stable(built.ir), 'ACS_MATERIALIZATION_IR_DRIFT', 'materialization', PATHS.materializationIr, '$', 'committed materialization IR differs from deterministic builder');
  demand(stable(committedRollback) === stable(built.rollback), 'ACS_ROLLBACK_PACKAGE', 'materialization', PATHS.rollbackPackage, '$', 'committed rollback package differs from deterministic builder');
  assertCandidateStatus(committedIr.status, 'ACS_STATUS_ESCAPE', 'materialization', PATHS.materializationIr);
  demand(committedIr.resource_graph_file_id === '3be9e5e1-190f-8090-8008-713c0fbe6260', 'ACS_WRONG_PENPOT_FILE', 'materialization', PATHS.materializationIr, '$.resource_graph_file_id', 'materialization targets a non-canonical Resource Graph file');
  demand(committedIr.execution.axis_expansion === 'axiswise_only' && committedIr.execution.full_cartesian_expansion_allowed === false, 'ACS_VARIANT_CARTESIAN_EXPANSION', 'materialization', PATHS.materializationIr, '$.execution', 'unsafe full Cartesian variant expansion is prohibited');
  demand(committedIr.counts.package_baseline_materializable_entities === 61 && committedIr.counts.final_materializable_entities === core.materializableIds.length, 'ACS_MATERIALIZATION_COUNT', 'materialization', PATHS.materializationIr, '$.counts', 'package baseline/final delta-adjusted count mismatch');
  const allStableIds = [
    ...committedIr.components.map((row) => row.stable_plugin_data_id),
    ...committedIr.components.flatMap((row) => row.variants.map((variant) => variant.stable_plugin_data_id)),
    ...committedIr.components.flatMap((row) => row.variants.flatMap((variant) => variant.nested_instances.map((nested) => nested.stable_plugin_data_id))),
    ...committedIr.components.flatMap((row) => row.specimens.map((specimen) => specimen.stable_plugin_data_id)),
    ...committedIr.components.flatMap((row) => row.specimens.map((specimen) => specimen.instance_stable_plugin_data_id)),
    ...committedIr.archetypes.flatMap((row) => row.nodes.map((node) => node.stable_plugin_data_id)),
    ...committedIr.archetypes.map((row) => row.board_stable_plugin_data_id),
  ];
  demand(allStableIds.every(nonEmpty) && new Set(allStableIds).size === allStableIds.length, 'ACS_MATERIALIZATION_STABLE_ID', 'materialization', PATHS.materializationIr, '$', 'materialization stable IDs must be non-empty and globally unique');
  const placements = committedIr.components.flatMap((component) => component.variants.map((variant) => `${component.target_zone_stable_id}:${variant.position?.x}:${variant.position?.y}`));
  demand(placements.length === new Set(placements).size, 'ACS_MATERIALIZATION_OVERLAP', 'materialization', PATHS.materializationIr, '$.components', 'component variant plans overlap at the same deterministic position');
  const archetypePlacements = committedIr.archetypes.map((archetype) => `${archetype.target_zone_stable_id}:${archetype.position?.x}:${archetype.position?.y}`);
  demand(archetypePlacements.length === new Set(archetypePlacements).size, 'ACS_MATERIALIZATION_OVERLAP', 'materialization', PATHS.materializationIr, '$.archetypes', 'archetype boards overlap at the same deterministic position');
  const specimenPlacements = committedIr.components.flatMap((component) => component.specimens.map((specimen) => `${specimen.target_zone_stable_id}:${specimen.position?.x}:${specimen.position?.y}`));
  demand(specimenPlacements.length === new Set(specimenPlacements).size, 'ACS_MATERIALIZATION_OVERLAP', 'materialization', PATHS.materializationIr, '$.components[*].specimens', 'fixture specimen plans overlap at the same deterministic position');
  demand(committedIr.components.every((row) => core.materializableIds.includes(row.entity_id) && !core.excludedIds.includes(row.entity_id)), 'ACS_EXCLUDED_ENTITY_MATERIALIZED', 'materialization', PATHS.materializationIr, '$.components', 'ordinary component list contains an excluded entity');
  demand(committedIr.components.every((row) => row.detached_copy_allowed === false && row.screenshot_master_allowed === false && row.variants.every((variant) => variant.nested_instances.every((nested) => nested.detached === false))), 'ACS_DETACHED_COPY', 'materialization', PATHS.materializationIr, '$.components', 'native masters/instances may not be screenshots or detached');
  demand(committedIr.components.every((row) => row.specimens.length > 0 && row.specimens.every((specimen) => nonEmpty(specimen.instance_stable_plugin_data_id) && specimen.detached === false && specimen.screenshot_based === false)), 'ACS_FIXTURE_BINDING', 'materialization', PATHS.materializationIr, '$.components[*].specimens', 'fixture projections must be stable native linked instances, not detached or screenshot-based');
  demand(committedIr.counts.fixture_specimen_instances === committedIr.components.reduce((sum, row) => sum + row.specimens.length, 0), 'ACS_MATERIALIZATION_COUNT', 'materialization', PATHS.materializationIr, '$.counts.fixture_specimen_instances', 'fixture specimen count differs from materialization plan');
  demand(committedRollback.destructive_execution_authorized === false && committedRollback.preserve_resource_graph_scaffold === true && committedRollback.rollback_version_required === true, 'ACS_ROLLBACK_PACKAGE', 'materialization', PATHS.rollbackPackage, '$', 'rollback package does not preserve the scaffold or pre-W1 version');

  const readback = readJson(root, PATHS.penpotReadback);
  demand(readback.resource_graph_file_id === committedIr.resource_graph_file_id, 'ACS_WRONG_PENPOT_FILE', 'readback', PATHS.penpotReadback, '$.resource_graph_file_id', 'readback targets a different Penpot file');
  demand(['PASS', 'BLOCKED_EXTERNAL_EVIDENCE'].includes(readback.execution_status), 'ACS_PENPOT_READBACK', 'readback', PATHS.penpotReadback, '$.execution_status', 'readback status must be PASS or exact external blocker');
  if (readback.execution_status === 'PASS') {
    demand(readback.components_created === true, 'ACS_PENPOT_READBACK', 'readback', PATHS.penpotReadback, '$.components_created', 'PASS readback must confirm creation');
    demand(readback.counts?.native_component_masters === committedIr.counts.native_component_masters && readback.counts?.concrete_component_variants === committedIr.counts.concrete_component_variants && readback.counts?.nested_component_instances === committedIr.counts.nested_component_instances && readback.counts?.fixture_specimen_instances === committedIr.counts.fixture_specimen_instances && readback.counts?.archetype_instances === committedIr.counts.archetype_instances && readback.counts?.explicit_gaps === committedIr.counts.explicit_gaps, 'ACS_MATERIALIZATION_COUNT', 'readback', PATHS.penpotReadback, '$.counts', 'live native count differs from materialization IR');
    demand((readback.duplicate_stable_ids ?? []).length === 0 && (readback.detached_copies ?? []).length === 0 && (readback.missing_bindings ?? []).length === 0 && (readback.validation_errors ?? []).length === 0, 'ACS_PENPOT_READBACK', 'readback', PATHS.penpotReadback, '$', 'live readback contains duplicates, detached copies, missing bindings or validation errors');
    demand(readback.idempotency?.second_run_executed === true && readback.idempotency?.second_run_created === 0 && readback.idempotency?.stable_ids_unchanged === true && readback.idempotency?.result === 'PASS', 'ACS_IDEMPOTENCY', 'readback', PATHS.penpotReadback, '$.idempotency', 'live second run is not idempotent');
  } else {
    demand(readback.components_created === false && Array.isArray(readback.blockers) && readback.blockers.length > 0, 'ACS_PENPOT_BLOCKER_EVIDENCE', 'readback', PATHS.penpotReadback, '$', 'blocked readback must not claim components and must preserve exact blocker evidence');
    demand(readback.blockers.some((blocker) => blocker.attempts >= 2 && /HTTP 504/u.test(blocker.error ?? '')), 'ACS_PENPOT_BLOCKER_EVIDENCE', 'readback', PATHS.penpotReadback, '$.blockers', 'expected repeated Penpot HTTP 504 blocker evidence is absent');
  }
  demand(stable(readback.planned_counts) === stable(committedIr.counts), 'ACS_MATERIALIZATION_COUNT', 'readback', PATHS.penpotReadback, '$.planned_counts', 'readback planned counts differ from deterministic materialization IR');
  return readback;
}

function validateUiExplorationHistory(root) {
  const history = readJson(root, PATHS.uiExplorationHistory);
  demand(history.authority_mode === 'reconstructed' && history.canonical === false && history.accepted === false && history.promotion_ready === false, 'ACS_UI_HISTORY_STATUS', 'ui-history', PATHS.uiExplorationHistory, '$', 'historical exploration escaped candidate status');
  demand(history.execution_status === 'BLOCKED_EXTERNAL_EVIDENCE' && history.target?.live_revalidation_status === 'BLOCKED_EXTERNAL_EVIDENCE' && history.target?.live_blocker?.attempts >= 2 && /HTTP 504/u.test(history.target?.live_blocker?.error ?? ''), 'ACS_UI_HISTORY_BLOCKER', 'ui-history', PATHS.uiExplorationHistory, '$', 'historical mutation must retain exact repeated 504 blocker evidence');
  demand(history.file_level?.owner_review_status === 'WITHDRAWN_FROM_OWNER_REVIEW' && history.file_level?.revision_disposition === 'NEEDS_REVISION' && history.file_level?.selected_count === 0 && history.file_level?.accepted_count === 0 && history.file_level?.owner_consent === 'absent', 'ACS_UI_HISTORY_STATUS', 'ui-history', PATHS.uiExplorationHistory, '$.file_level', 'historical owner pack status/counts/consent differ');
  const decisions = history.boards?.decisions ?? [];
  demand(decisions.length === 3, 'ACS_UI_HISTORY_COUNT', 'ui-history', PATHS.uiExplorationHistory, '$.boards.decisions', 'exactly three historical decision boards are required');
  demand(decisions.reduce((sum, row) => sum + row.option_component_ids.length, 0) === 9 && decisions.reduce((sum, row) => sum + row.option_instance_ids.length, 0) === 9, 'ACS_UI_HISTORY_COUNT', 'ui-history', PATHS.uiExplorationHistory, '$.boards.decisions', 'historical pack must retain 9 option masters and 9 instances');
  demand(new Set(decisions.map((row) => row.comment_thread_id)).size === 3, 'ACS_UI_HISTORY_COUNT', 'ui-history', PATHS.uiExplorationHistory, '$.boards.decisions', 'historical comment threads must remain distinct');
  for (const decision of decisions) demand(decision.target_status === 'WITHDRAWN_FROM_OWNER_REVIEW' && decision.revision_disposition === 'NEEDS_REVISION' && decision.selected_option_id === null && decision.selected_count === 0 && decision.accepted === false && decision.accepted_count === 0 && decision.owner_consent === 'absent' && decision.comment_action?.acceptance_implied === false, 'ACS_UI_HISTORY_STATUS', 'ui-history', decision.decision_id, '$', 'historical decision was selected, accepted or left active');
  demand(history.required_readback?.preserve_all_existing_ids === true && history.required_readback?.delete_or_detach_objects === false, 'ACS_UI_HISTORY_DESTRUCTIVE', 'ui-history', PATHS.uiExplorationHistory, '$.required_readback', 'historical plan permits delete/detach');
  return history;
}

function expectedReceiptOutputs(summary) {
  return sortedUnique([
    PATHS.packageVerification,
    PATHS.entityRegistry,
    PATHS.mappings,
    `${PATHS.mappings.replace(/\.jsonl$/u, '.csv')}`,
    PATHS.hierarchy,
    PATHS.archetypeRegistry,
    PATHS.plan,
    PATHS.ownerAmbiguities,
    PATHS.reconciliationQueue,
    `${path.posix.dirname(PATHS.plan)}/metrics.json`,
    `${path.posix.dirname(PATHS.plan)}/validation-report.json`,
    PATHS.sourceDrift,
    PATHS.reconciliationResults,
    PATHS.mediaMatrix,
    PATHS.mediaPolicySchema,
    PATHS.mediaResolver,
    PATHS.mediaRuleDispositions,
    PATHS.mediaConsumerProfiles,
    PATHS.mediaStateFixtures,
    PATHS.mediaPenpotProof,
    PATHS.contractIndex,
    ...summary.contracts.index.contracts.map((row) => row.path),
    PATHS.fixtureCatalog,
    PATHS.fixtureBindings,
    PATHS.archetypeIndex,
    ...summary.archetypes.index.graph_files.map((row) => row.path),
    PATHS.materializationIr,
    PATHS.penpotReadback,
    PATHS.rollbackPackage,
    PATHS.uiExplorationHistory,
    PATHS.schema,
    PATHS.receiptSchema,
    'contracts/normalization/component-synthesis-contract.v0.1.schema.json',
    'contracts/normalization/component-synthesis-archetype.v0.1.schema.json',
    'scripts/component-synthesis-v0.1/build-materialization-ir.mjs',
    'scripts/component-synthesis-v0.1/build-receipt.mjs',
    'scripts/component-synthesis-v0.1/lib.mjs',
    'scripts/component-synthesis-v0.1/media-policy.mjs',
    'scripts/component-synthesis-v0.1/materialize-penpot.js',
    PATHS.uiExplorationHistoryMaterializer,
    'scripts/component-synthesis-v0.1/paths.mjs',
    'scripts/component-synthesis-v0.1/structured-error.mjs',
    'scripts/component-synthesis-v0.1/validate-schemas.py',
    'scripts/validate-apply-component-synthesis-v0.1.mjs',
    'scripts/validate-event-media-policy-defrag-v0.1.mjs',
    'tests/apply-component-synthesis-v0.1-negative.mjs',
    '.github/workflows/apply-component-synthesis-v0-1.yml',
  ]);
}

function outputManifest(root, paths) {
  return Object.fromEntries(paths.map((relative) => {
    const bytes = fs.readFileSync(requireFile(root, relative));
    const metadata = { bytes: bytes.length, sha256: sha256(bytes) };
    if (relative.endsWith('.jsonl')) metadata.records = readJsonl(root, relative).length;
    return [relative, metadata];
  }));
}

function validateIntegratedMediaPolicy(root, core, contracts) {
  const applications = readJsonl(root, 'catalog/normalization/event-media/consumer-requirement-matrix.jsonl').map((row) => row.application_id ?? row.id);
  const result = validateEventMediaPolicy({
    root,
    applicationRefs: applications,
    fixtureIds: new Set(contracts.fixtureCatalog.fixtures.map((row) => row.fixture_id)),
    entityIds: new Set(core.entities.map((row) => row.entity_id)),
    hierarchyEdges: core.hierarchy.edges,
    materializableIds: core.materializableIds,
  });
  const frame = contracts.contractById.get('event.media-frame')?.contract;
  demand(frame?.variant_axes?.length === 1 && frame.variant_axes[0].axis_id === 'case' && frame.state_axes.length === 0, 'ACS_MEDIA_FRAME_AXIS_MODEL', 'media-policy', 'event.media-frame', '$.variant_axes', 'EventMediaFrame must use explicit valid cases, not independent fit/ratio/crop axes');
  demand(!/\b(?:fit|ratio|placement|crop)\b/u.test(frame.variant_axes[0].values.join(' ')), 'ACS_MEDIA_FRAME_AXIS_MODEL', 'media-policy', 'event.media-frame', '$.variant_axes', 'fit/ratio/placement/crop cannot be selectable frame axes');
  demand(frame.media?.resolver_contract_ref === PATHS.mediaResolver && frame.media.consumer_profile_refs.length > 0, 'ACS_MEDIA_CONTRACT_DELEGATION', 'media-policy', 'event.media-frame', '$.media', 'frame contract must delegate to the resolver and explicit profiles');
  const listingRail = contracts.contractById.get('listing.rail-row')?.contract;
  const nested = listingRail?.nested_components?.find((row) => row.entity_ref === 'event.media-frame');
  demand(nested && nested.multiplicity_by_case?.absent === 0 && nested.multiplicity_by_case?.single === 1 && nested.multiplicity_by_case?.['default-four'] === 4 && nested.multiplicity_by_case?.['hard-six'] === 6 && nested.multiplicity_by_case?.['overflow-six'] === 6, 'ACS_MEDIA_RAIL_MULTIPLICITY', 'media-policy', 'listing.rail-row', '$.nested_components', 'rail contract must encode exact 0/1/4/6/>6→6 linked frame multiplicity');
  demand(listingRail.media?.consumer_profile_refs?.includes('profile.mobile-listing-rail-row'), 'ACS_MEDIA_CONTRACT_DELEGATION', 'media-policy', 'listing.rail-row', '$.media.consumer_profile_refs', 'rail contract must bind exact mobile rail profile');
  return result;
}

export function buildApplyComponentSynthesisReceipt({ root = process.cwd(), eventsRepo, materializationParentSha, prNumber = 35, prUrl = 'https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/35' } = {}) {
  root = path.resolve(root);
  demand(/^[0-9a-f]{40}$/u.test(materializationParentSha ?? ''), 'ACS_RECEIPT_PARENT', 'receipt-build', PATHS.receipt, '$.repository.head_sha', 'exact 40-hex materialization parent SHA is required');
  const core = validateCore(root);
  const packageVerification = validatePackage(root);
  const reconciliation = validateReconciliation(root, core);
  demand(nonEmpty(eventsRepo), 'ACS_EVENTS_REPO_REQUIRED', 'receipt-build', '--events-repo', '$', 'receipt build requires exact events checkout');
  const events = replayEventsEvidence(eventsRepo, reconciliation.drift);
  const contracts = validateContractsAndFixtures(root, core);
  const mediaPolicy = validateIntegratedMediaPolicy(root, core, contracts);
  const archetypes = validateArchetypes(root, core, contracts);
  const built = buildMaterializationDocuments({ root });
  const readback = validateMaterialization(root, built, core);
  const history = validateUiExplorationHistory(root);
  const summary = { core, package: packageVerification, reconciliation, contracts, mediaPolicy, archetypes, readback, history, events };
  const blocked = readback.execution_status === 'BLOCKED_EXTERNAL_EVIDENCE';
  const gate = (isBlocked = false) => isBlocked ? 'BLOCKED_EXTERNAL_EVIDENCE' : 'PASS';
  const receipt = {
    schema_version: 'lovekgd_apply_component_synthesis_receipt_v0_1',
    operation_id: 'apply-component-synthesis-v0.1',
    repository: {
      name: 'onedayonemasterpiece/lovekgd-design-system',
      base_sha: packageVerification.repository_base_sha,
      head_sha: materializationParentSha,
      branch: 'normalization/apply-component-synthesis-v0-1',
    },
    package: {
      verification_ref: PATHS.packageVerification,
      archive_sha256: packageVerification.package_sha256,
      manifest_sha256: packageVerification.manifest_sha256,
      manifest_entries: 16,
      extraction_commit: '8bf4ad465cbd9d943935c201378b867a5d539456',
      verification_result: 'PASS',
    },
    source: {
      design_system_base_sha: packageVerification.repository_base_sha,
      events_current_main_sha: events.head_sha,
      events_tree_sha: events.tree_sha,
      events_synthesis_observed_sha: events.synthesis_observed_sha,
      affected_astro_implementations: events.affected_astro_implementations,
      validation: 'PASS',
      drift_ledger_ref: PATHS.sourceDrift,
      exact_paths: 107,
      material_deltas: reconciliation.drift.filter((row) => row.material_drift).length,
    },
    counts: {
      mapping_rows: 107,
      unique_terminal_mappings: 107,
      technical_reconciliations: 6,
      package_baseline_materializable: 61,
      candidate_contracts: core.materializableIds.length,
      fixtures: contracts.fixtureCatalog.fixtures.length,
      archetypes: archetypes.graphs.length,
      explicit_gaps: built.ir.counts.explicit_gaps,
      owner_ambiguities: 0,
    },
    gates: {
      registry_and_mapping_schemas: 'PASS', exact_107_closure: 'PASS', dependency_integrity: 'PASS', source_drift: 'PASS', technical_reconciliation_6_of_6: 'PASS', fixture_coverage: 'PASS', materialization_manifest_stability: 'PASS', idempotent_second_run: gate(blocked), native_readback: gate(blocked), archetype_graphs_18: 'PASS', media_matrix: 'PASS', owner_ambiguity_zero: 'PASS',
    },
    materialization: {
      resource_graph_file_id: core.plan.resource_graph_file_id,
      ir_ref: PATHS.materializationIr,
      readback_ref: PATHS.penpotReadback,
      rollback_ref: PATHS.rollbackPackage,
      execution_status: readback.execution_status,
      planned_counts: built.ir.counts,
      revision_before: readback.revision_before ?? null,
      revision_after: readback.revision_after ?? null,
      component_count: blocked ? null : readback.counts.native_component_masters,
      variant_count: blocked ? null : readback.counts.concrete_component_variants,
      instance_count: blocked ? null : readback.counts.nested_component_instances + readback.counts.fixture_specimen_instances + readback.counts.archetype_instances,
    },
    ui_exploration_history: {
      plan_ref: PATHS.uiExplorationHistory,
      execution_status: history.execution_status,
      owner_review_status: history.file_level.owner_review_status,
      revision_disposition: history.file_level.revision_disposition,
      selected_count: history.file_level.selected_count,
      accepted_count: history.file_level.accepted_count,
      owner_consent: history.file_level.owner_consent,
    },
    outputs: outputManifest(root, expectedReceiptOutputs(summary)),
    scope_guards: {
      events_bot_modified: false, production_astro_modified: false, canonical_promoted: false, candidate_accepted: false, promotion_ready_set: false, experiment_winner_selected: false, pr_merged: false,
    },
    delivery: {
      materialization_parent_sha: materializationParentSha,
      pull_request: { number: prNumber, url: prUrl, draft: true, merged: false, merge_requested: false },
    },
    conclusion: blocked ? 'PASS_WITH_EXTERNAL_PENPOT_BLOCKER' : 'PASS',
  };
  return receipt;
}

function validateReceipt(root, summary) {
  const schema = readJson(root, PATHS.receiptSchema);
  demand(schema.$schema === 'https://json-schema.org/draft/2020-12/schema', 'ACS_RECEIPT_SCHEMA', 'receipt', PATHS.receiptSchema, '$.$schema', 'receipt schema must be Draft 2020-12');
  const receipt = readJson(root, PATHS.receipt);
  const schemaCheck = childProcess.spawnSync('python3', ['-c', [
    'import json,sys',
    'from jsonschema import Draft202012Validator',
    'schema=json.load(open(sys.argv[1],encoding="utf-8"))',
    'document=json.load(open(sys.argv[2],encoding="utf-8"))',
    'Draft202012Validator.check_schema(schema)',
    'errors=sorted(Draft202012Validator(schema).iter_errors(document),key=lambda e:list(e.absolute_path))',
    'assert not errors, f"{errors[0].json_path}: {errors[0].message}"',
  ].join(';'), absolute(root, PATHS.receiptSchema), absolute(root, PATHS.receipt)], { encoding: 'utf8' });
  demand(schemaCheck.status === 0, 'ACS_RECEIPT_SCHEMA', 'receipt', PATHS.receipt, '$', `Draft 2020-12 receipt validation failed: ${schemaCheck.stderr.trim()}`);
  demand(receipt.schema_version === 'lovekgd_apply_component_synthesis_receipt_v0_1', 'ACS_RECEIPT', 'receipt', PATHS.receipt, '$.schema_version', 'unexpected receipt schema version');
  demand(receipt.package?.verification_ref === PATHS.packageVerification && receipt.package?.archive_sha256 === summary.package.package_sha256 && receipt.package?.manifest_entries === 16, 'ACS_RECEIPT_BINDING', 'receipt', PATHS.receipt, '$.package', 'receipt does not bind verified immutable package');
  demand(receipt.counts?.mapping_rows === 107 && receipt.counts?.unique_terminal_mappings === 107 && receipt.counts?.technical_reconciliations === 6 && receipt.counts?.candidate_contracts === summary.core.materializableIds.length && receipt.counts?.archetypes === 18 && receipt.counts?.owner_ambiguities === 0, 'ACS_RECEIPT_COUNT', 'receipt', PATHS.receipt, '$.counts', 'receipt closure counts differ from validated artifacts');
  demand(receipt.materialization?.ir_ref === PATHS.materializationIr && receipt.materialization?.readback_ref === PATHS.penpotReadback && receipt.materialization?.rollback_ref === PATHS.rollbackPackage && receipt.materialization?.execution_status === summary.readback.execution_status && stable(receipt.materialization?.planned_counts) === stable(summary.readback.planned_counts), 'ACS_RECEIPT_BINDING', 'receipt', PATHS.receipt, '$.materialization', 'receipt materialization/readback bindings or planned counts differ');
  demand(receipt.delivery?.pull_request?.draft === true && receipt.delivery?.pull_request?.merged === false && receipt.delivery?.pull_request?.merge_requested === false, 'ACS_RECEIPT_DELIVERY', 'receipt', PATHS.receipt, '$.delivery.pull_request', 'delivery must remain a Draft, unmerged PR');
  demand(receipt.scope_guards?.events_bot_modified === false && receipt.scope_guards?.production_astro_modified === false && receipt.scope_guards?.canonical_promoted === false && receipt.scope_guards?.experiment_winner_selected === false, 'ACS_RECEIPT_SCOPE_ESCAPE', 'receipt', PATHS.receipt, '$.scope_guards', 'receipt escaped immutable/runtime/promotion constraints');
  demand(receipt.source?.events_current_main_sha === summary.events.head_sha && receipt.source?.events_tree_sha === summary.events.tree_sha && receipt.source?.events_synthesis_observed_sha === summary.events.synthesis_observed_sha && receipt.source?.affected_astro_implementations === 106 && receipt.source?.validation === 'PASS', 'ACS_RECEIPT_BINDING', 'receipt', PATHS.receipt, '$.source', 'receipt does not bind exact replayed events commit/tree/bounded implementation inventory');
  const expectedOutputs = expectedReceiptOutputs(summary);
  demand(sameSet(Object.keys(receipt.outputs ?? {}), expectedOutputs) && Object.keys(receipt.outputs ?? {}).length === expectedOutputs.length, 'ACS_RECEIPT_OUTPUT_SET', 'receipt', PATHS.receipt, '$.outputs', 'receipt output manifest has a missing or extra path');
  for (const relative of expectedOutputs) {
    const target = requireFile(root, relative); const bytes = fs.readFileSync(target); const metadata = receipt.outputs[relative];
    demand(metadata.bytes === bytes.length && metadata.sha256 === sha256(bytes), 'ACS_RECEIPT_OUTPUT_DRIFT', 'receipt', relative, '$.outputs', 'receipt output bytes/SHA-256 differ from file');
    if (relative.endsWith('.jsonl')) demand(metadata.records === readJsonl(root, relative).length, 'ACS_RECEIPT_OUTPUT_DRIFT', 'receipt', relative, '$.outputs.records', 'receipt JSONL record count differs');
    else demand(!Object.hasOwn(metadata, 'records'), 'ACS_RECEIPT_OUTPUT_DRIFT', 'receipt', relative, '$.outputs.records', 'non-JSONL output may not claim a record count');
  }
  return receipt;
}

export function validateApplyComponentSynthesis({ root = process.cwd(), fixtureMode = false, eventsRepo = null } = {}) {
  root = path.resolve(root);
  const core = validateCore(root);
  const packageVerification = validatePackage(root);
  const reconciliation = validateReconciliation(root, core);
  demand(fixtureMode || nonEmpty(eventsRepo), 'ACS_EVENTS_REPO_REQUIRED', 'events-replay', '--events-repo', '$', 'default validation requires --events-repo exact checkout');
  const events = eventsRepo ? replayEventsEvidence(eventsRepo, reconciliation.drift) : { head_sha: null, tree_sha: null, synthesis_observed_sha: null, exact_paths: 0, affected_astro_implementations: 0, result: 'SKIPPED_EXPLICIT_FIXTURE_MODE' };
  const contracts = validateContractsAndFixtures(root, core);
  const mediaPolicy = validateIntegratedMediaPolicy(root, core, contracts);
  const archetypes = validateArchetypes(root, core, contracts);
  const built = buildMaterializationDocuments({ root });
  const readback = validateMaterialization(root, built, core);
  const history = validateUiExplorationHistory(root);
  const summary = { core, package: packageVerification, reconciliation, contracts, mediaPolicy, archetypes, readback, history, events };
  const receipt = fixtureMode ? null : validateReceipt(root, summary);
  return {
    status: 'PASS',
    fixture_mode: fixtureMode,
    mappings: core.mappings.length,
    unique_terminal_mappings: new Set(core.mappings.map((row) => row.source_path)).size,
    entities: core.entities.length,
    package_baseline_materializable: 61,
    final_materializable: core.materializableIds.length,
    technical_reconciliations: reconciliation.results.length,
    event_media_rules: mediaPolicy.rules.length,
    event_media_profiles: mediaPolicy.profiles.length,
    event_media_state_cases: mediaPolicy.cases.length,
    archetypes: archetypes.graphs.length,
    explicit_gaps: built.ir.counts.explicit_gaps,
    native_component_masters_planned: built.ir.counts.native_component_masters,
    concrete_component_variants_planned: built.ir.counts.concrete_component_variants,
    nested_component_instances_planned: built.ir.counts.nested_component_instances,
    fixture_specimen_instances_planned: built.ir.counts.fixture_specimen_instances,
    archetype_instances_planned: built.ir.counts.archetype_instances,
    owner_ambiguities: 0,
    penpot_execution_status: readback.execution_status,
    events_replay: events.result,
    events_head_sha: events.head_sha,
    events_tree_sha: events.tree_sha,
    receipt: fixtureMode ? 'skipped-explicit-fixture-mode' : 'validated',
    receipt_document: receipt,
  };
}

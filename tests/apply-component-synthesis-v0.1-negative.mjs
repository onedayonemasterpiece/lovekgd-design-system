#!/usr/bin/env node
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateApplyComponentSynthesis } from '../scripts/component-synthesis-v0.1/lib.mjs';

const root = path.resolve(process.argv[2] ?? '.');
const corpus = 'catalog/normalization/component-synthesis-v0.1';
const required = [
  'manifest.json',
  'catalog/lovekgd-component-synthesis-v0.1(1).zip',
  corpus,
  'catalog/normalization/event-media/consumer-requirement-matrix.jsonl',
  'contracts/resource-graph-scaffold.v1.json',
  'contracts/normalization/component-synthesis-registry.v0.1.schema.json',
  'contracts/normalization/component-synthesis-contract.v0.1.schema.json',
  'contracts/normalization/component-synthesis-archetype.v0.1.schema.json',
  'contracts/normalization/component-synthesis-event-media-policy.v0.1.schema.json',
  'contracts/normalization/apply-component-synthesis-receipt.v0.1.schema.json',
];
const json = (base, relative) => JSON.parse(fs.readFileSync(path.join(base, relative), 'utf8'));
const writeJson = (base, relative, value) => fs.writeFileSync(path.join(base, relative), `${JSON.stringify(value, null, 2)}\n`);
const jsonl = (base, relative) => fs.readFileSync(path.join(base, relative), 'utf8').trimEnd().split('\n').map(JSON.parse);
const writeJsonl = (base, relative, rows) => fs.writeFileSync(path.join(base, relative), `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function fixtureRoot() {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'apply-component-synthesis-v0-1.'));
  for (const relative of required) {
    const source = path.join(root, relative);
    const destination = path.join(target, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.cpSync(source, destination, { recursive: true });
  }
  return target;
}

function updateArchetypeIndexHash(base, archetypeId) {
  const relative = `${corpus}/archetypes/graphs/${archetypeId}.json`;
  const indexPath = `${corpus}/archetypes/index.json`;
  const index = json(base, indexPath);
  index.graph_files.find((row) => row.archetype_id === archetypeId).sha256 = sha256(fs.readFileSync(path.join(base, relative)));
  writeJson(base, indexPath, index);
}

function updateContractIndexHash(base, entityId) {
  const indexPath = `${corpus}/contracts/index.json`;
  const index = json(base, indexPath);
  const entry = index.contracts.find((row) => row.stable_component_id === entityId);
  entry.sha256 = sha256(fs.readFileSync(path.join(base, entry.path)));
  writeJson(base, indexPath, index);
}

const cases = [
  ['duplicate source mapping', 'ACS_MAPPING_SOURCE_DUPLICATE', (base) => {
    const p = `${corpus}/current-to-candidate-mapping.jsonl`; const rows = jsonl(base, p); rows[1].source_path = rows[0].source_path; writeJsonl(base, p, rows);
  }],
  ['unknown mapping target', 'ACS_MAPPING_TARGET_FK', (base) => {
    const p = `${corpus}/current-to-candidate-mapping.jsonl`; const rows = jsonl(base, p); rows[0].target_entity_ids = ['unknown.entity']; writeJsonl(base, p, rows);
  }],
  ['nonterminal mapping', 'ACS_MAPPING_TERMINAL', (base) => {
    const p = `${corpus}/current-to-candidate-mapping.jsonl`; const rows = jsonl(base, p); rows[0].terminal_disposition = 'pending'; writeJsonl(base, p, rows);
  }],
  ['unknown nested entity', 'ACS_NESTED_ENTITY_FK', (base) => {
    const p = `${corpus}/entity-registry.jsonl`; const rows = jsonl(base, p); rows[0].nested_entity_refs = ['unknown.entity']; writeJsonl(base, p, rows);
  }],
  ['canonical status escape', 'ACS_STATUS_ESCAPE', (base) => {
    const p = `${corpus}/entity-registry.jsonl`; const rows = jsonl(base, p); rows[0].status.canonical = true; writeJsonl(base, p, rows);
  }],
  ['hierarchy self-cycle', 'ACS_DEPENDENCY_CYCLE', (base) => {
    const p = `${corpus}/component-hierarchy.json`; const value = json(base, p); value.edges.push({ parent: 'artifact.collection', child: 'artifact.collection', relation: 'contains_instance' }); value.edges = value.edges.map((edge) => [`${edge.parent}\0${edge.child}\0${edge.relation}`, edge]).sort().map(([, edge]) => edge); writeJson(base, p, value);
  }],
  ['owner ambiguity injected', 'ACS_OWNER_AMBIGUITY', (base) => {
    const p = `${corpus}/owner-ambiguities.json`; const value = json(base, p); value.count = 1; value.items = [{ id: 'invented-owner-question' }]; writeJson(base, p, value);
  }],
  ['technical queue incomplete', 'ACS_RECONCILIATION_COUNT', (base) => {
    const p = `${corpus}/technical-reconciliation-queue.jsonl`; const rows = jsonl(base, p); rows.pop(); writeJsonl(base, p, rows);
  }],
  ['invalid reconciliation terminal', 'ACS_RECONCILIATION_TERMINAL', (base) => {
    const p = `${corpus}/technical-reconciliation-results.jsonl`; const rows = jsonl(base, p); rows[0].terminal_result = 'PENDING'; writeJsonl(base, p, rows);
  }],
  ['undeclared material drift', 'ACS_SOURCE_DRIFT_UNDECLARED', (base) => {
    const p = `${corpus}/source-drift-ledger.jsonl`; const rows = jsonl(base, p); rows[0].material_drift = true; rows[0].delta_finding = null; writeJsonl(base, p, rows);
  }],
  ['static skeleton invention', 'ACS_STATIC_SKELETON', (base) => {
    const p = `${corpus}/media-policy-matrix.jsonl`; const rows = jsonl(base, p); const row = rows.find((candidate) => candidate.loading_applicability === 'native_image_decode_only'); row.loading_treatment = 'synthetic_component_skeleton'; writeJsonl(base, p, rows);
  }],
  ['media semantic coverage lost', 'ACS_MEDIA_COVERAGE', (base) => {
    const p = `${corpus}/media-policy-matrix.jsonl`; let rows = jsonl(base, p); rows = rows.filter((row) => row.semantic_mode !== 'unknown_text'); writeJsonl(base, p, rows);
  }],
  ['global media fit invented', 'ACS_MEDIA_POLICY_SCHEMA', (base) => {
    const p = `${corpus}/event-media-resolver-contract.json`; const value = json(base, p); value.global_defaults.fit = 'cover'; writeJson(base, p, value);
  }],
  ['solver veto reclassified as safe', 'ACS_MEDIA_RULE_TRUTH_ESCAPE', (base) => {
    const p = `${corpus}/event-media-rule-dispositions.jsonl`; const rows = jsonl(base, p); rows.find((row) => row.rule_id === 'EMR-RELATED-SOLVER-VETO').disposition = 'KEEP_CORE'; writeJsonl(base, p, rows);
  }],
  ['hero evidence conflict forced resolved', 'ACS_MEDIA_RULE_TRUTH_ESCAPE', (base) => {
    const p = `${corpus}/event-media-rule-dispositions.jsonl`; const rows = jsonl(base, p); rows.find((row) => row.rule_id === 'EMR-HERO-FILL-EXCEPTION').disposition = 'KEEP_CORE'; writeJsonl(base, p, rows);
  }],
  ['application partition lost', 'ACS_MEDIA_APPLICATION_PARTITION', (base) => {
    const p = `${corpus}/event-media-consumer-profiles.jsonl`; const rows = jsonl(base, p); rows.find((row) => row.application_refs.length > 0).application_refs.pop(); writeJsonl(base, p, rows);
  }],
  ['lab media rail promoted', 'ACS_MEDIA_LAB_PROMOTION', (base) => {
    const p = `${corpus}/event-media-consumer-profiles.jsonl`; const rows = jsonl(base, p); const row = rows.find((item) => item.profile_id === 'profile.lab-event-media-rail'); row.lifecycle = 'ACTIVE_PRODUCTION'; writeJsonl(base, p, rows);
  }],
  ['protected fixture changed to cover', 'ACS_MEDIA_PROTECTED_CROP', (base) => {
    const p = `${corpus}/event-media-state-fixture-matrix.jsonl`; const rows = jsonl(base, p); const row = rows.find((item) => item.case_id === 'case.core.protected-union-contain'); row.expected_fit = 'cover'; writeJsonl(base, p, rows);
  }],
  ['frame fit restored as native axis', 'ACS_MEDIA_FRAME_AXIS_MODEL', (base) => {
    const p = `${corpus}/contracts/event.media-frame.contract.json`; const value = json(base, p); value.variant_axes.push({ axis_id: 'fit', values: ['cover', 'contain'], materialization_mode: 'native_variant', evidence_source: 'entity_registry.variant_axes' }); writeJson(base, p, value); updateContractIndexHash(base, 'event.media-frame');
  }],
  ['rail multiplicity collapsed to one', 'ACS_MEDIA_RAIL_MULTIPLICITY', (base) => {
    const p = `${corpus}/contracts/listing.rail-row.contract.json`; const value = json(base, p); value.nested_components[0].multiplicity_by_case['default-four'] = 1; writeJson(base, p, value); updateContractIndexHash(base, 'listing.rail-row');
  }],
  ['Penpot proof detached nested frame', 'ACS_MEDIA_PENPOT_PROOF_SCHEMA', (base) => {
    const p = `${corpus}/event-media-penpot-proof-readback.json`; const value = json(base, p); value.rail_proof.nested_instances[0].detached = true; writeJson(base, p, value);
  }],
  ['Penpot proof variant case lost', 'ACS_MEDIA_PENPOT_PROOF_SCHEMA', (base) => {
    const p = `${corpus}/event-media-penpot-proof-readback.json`; const value = json(base, p); value.variant_cases.pop(); writeJson(base, p, value);
  }],
  ['Penpot crop atlas profile duplicated', 'ACS_MEDIA_PENPOT_ATLAS', (base) => {
    const p = `${corpus}/event-media-penpot-proof-readback.json`; const value = json(base, p); value.crop_atlas.variants[1].profile_ref = value.crop_atlas.variants[0].profile_ref; writeJson(base, p, value);
  }],
  ['contract index coverage lost', 'ACS_CONTRACT_COVERAGE', (base) => {
    const p = `${corpus}/contracts/index.json`; const value = json(base, p); value.contracts.pop(); value.expected_entity_count -= 1; value.materialization_order.pop(); writeJson(base, p, value);
  }],
  ['fixture binding references unknown fixture', 'ACS_FIXTURE_BINDING', (base) => {
    const p = `${corpus}/fixtures/entity-fixture-bindings.json`; const value = json(base, p); value.bindings[0].fixture_refs.text = ['fixture.unknown']; writeJson(base, p, value);
  }],
  ['archetype detached copy', 'ACS_ARCHETYPE_DETACHED', (base) => {
    const id = 'archetype.club'; const p = `${corpus}/archetypes/graphs/${id}.json`; const value = json(base, p); value.instance_graph.nodes[0].detached = true; writeJson(base, p, value); updateArchetypeIndexHash(base, id);
  }],
  ['archetype nonmaterializable identity', 'ACS_ARCHETYPE_GRAPH_FK', (base) => {
    const id = 'archetype.club'; const p = `${corpus}/archetypes/graphs/${id}.json`; const value = json(base, p); const node = value.instance_graph.nodes.find((candidate) => candidate.node_kind !== 'gap_placeholder'); node.entity_ref = 'page.prelaunch'; writeJson(base, p, value); updateArchetypeIndexHash(base, id);
  }],
  ['materialization IR drift', 'ACS_MATERIALIZATION_IR_DRIFT', (base) => {
    const p = `${corpus}/penpot-materialization-ir.json`; const value = json(base, p); value.counts.native_component_masters += 1; writeJson(base, p, value);
  }],
  ['wrong Penpot file', 'ACS_WRONG_PENPOT_FILE', (base) => {
    const p = `${corpus}/penpot-readback.json`; const value = json(base, p); value.resource_graph_file_id = '00000000-0000-0000-0000-000000000000'; writeJson(base, p, value);
  }],
  ['blocker evidence weakened', 'ACS_PENPOT_BLOCKER_EVIDENCE', (base) => {
    const p = `${corpus}/penpot-readback.json`; const value = json(base, p); value.blockers[0].attempts = 1; writeJson(base, p, value);
  }],
  ['UI history selected without owner', 'ACS_UI_HISTORY_STATUS', (base) => {
    const p = `${corpus}/ui-exploration-history-plan.json`; const value = json(base, p); value.file_level.selected_count = 1; writeJson(base, p, value);
  }],
  ['required artifact missing', 'ACS_REQUIRED_ARTIFACT_MISSING', (base) => {
    fs.rmSync(path.join(base, corpus, 'media-policy-matrix.jsonl'));
  }],
];

const baseline = fixtureRoot();
try {
  const result = validateApplyComponentSynthesis({ root: baseline, fixtureMode: true });
  assert.equal(result.status, 'PASS');
} finally { fs.rmSync(baseline, { recursive: true, force: true }); }

let rejected = 0;
for (const [name, expectedCode, mutate] of cases) {
  const base = fixtureRoot();
  try {
    mutate(base);
    assert.throws(
      () => validateApplyComponentSynthesis({ root: base, fixtureMode: true }),
      (error) => {
        assert.equal(error.code, expectedCode, `${name}: expected ${expectedCode}, got ${error.code}`);
        return true;
      },
    );
    rejected += 1;
  } finally { fs.rmSync(base, { recursive: true, force: true }); }
}

const materializer = fs.readFileSync(path.join(root, 'scripts/component-synthesis-v0.1/materialize-penpot.js'), 'utf8');
assert.match(materializer, /await materialize\(\{ \.\.\.options, penpot, ir, mode: 'materialize', _idempotencyPass: true \}\)/u, 'materializer must execute a real second pass');
assert.match(materializer, /second_run_created/u, 'materializer must report second-run creations');
assert.match(materializer, /authorizeDestructiveRollback === true/u, 'rollback must require explicit authorization');
assert.match(materializer, /screenshot_master/u, 'materializer must preserve the no-screenshot master guard');
assert.match(materializer, /buildShapeIndex/u, 'materializer must index the file once instead of rescanning it per object');
assert.match(materializer, /scaffoldNameFromStableId/u, 'materializer must resolve the live scaffold by its exact canonical board name when scaffold plugin metadata is absent');
assert.match(materializer, /operationPhase/u, 'materializer must support active-page-safe staged phases');
assert.match(materializer, /ACS_PENPOT_ACTIVE_PAGE/u, 'materializer must fail closed instead of writing to a non-active page');
assert.doesNotMatch(materializer, /penpot\.currentPage\s*=/u, 'currentPage is a read-only Penpot API property');
assert.match(materializer, /batchReadback/u, 'bounded writes must avoid an expensive whole-file read-back on every batch');
assert.match(materializer, /isInsideComponentCopy/u, 'read-back must ignore stable IDs inherited by descendants of component copies');
assert.match(materializer, /buildComponentShapeIndex/u, 'component phases must use the native-library fast index instead of a full-file shape walk');
assert.match(materializer, /nativeComponentsByMainId\.has\(main\.id\)/u, 'fast indexing must not double-register the group representative variant');
assert.match(materializer, /values\.some\(\(row\) => row\.shape\?\.id === value\.shape\?\.id\)/u, 'fast indexing must de-duplicate shared variant-container bindings');
assert.match(materializer, /requiredEntityIds/u, 'fast indexing must be bounded to the selected component dependency closure');
assert.match(materializer, /const planIr = partial/u, 'bounded runs must plan only the selected component or archetype scope');
assert.match(materializer, /const planIr = partial/u, 'bounded operations must not serialize the complete materialization plan');
assert.match(materializer, /variantComponents\.push\(existing\); continue/u, 'native component reuse must not mutate the preflight count');
assert.match(materializer, /variantStableIds/u, 'variant creation must support gateway-safe resumable subsets');
assert.match(materializer, /specimenStableIds/u, 'fixture projection must support gateway-safe resumable subsets');
assert.match(materializer, /archetypeNodeStableIds/u, 'archetype projection must support gateway-safe resumable subsets');
assert.match(materializer, /buildActivePageShapeIndex/u, 'projection phases must index only the active page instead of the whole Resource Graph');
assert.match(materializer, /layout-repair/u, 'native component geometry must be repairable without recreating stable IDs');
assert.match(materializer, /compactVariantContainer/u, 'variant members must be compacted instead of preserving unbounded source coordinates');
assert.match(materializer, /layoutNativeMasterContents/u, 'native master children must be moved with their post-grouping board geometry');
assert.match(materializer, /variant-containers/u, 'variant-container finalization must be a separately resumable phase');
assert.match(materializer, /componentBindings/u, 'variant-container bindings must be indexed and deduplicated');
assert.match(materializer, /createVariantFromComponents\(variantBoards\)/u, 'Penpot native variant API must receive main-instance boards, not library proxies');
assert.match(materializer, /nativeComponentsByMainId/u, 'variant members must remain reusable after Penpot combines them');
assert.match(materializer, /setVariantProperty/u, 'native variants must retain the declared contract axes and values');
assert.match(materializer, /removeProperty\(properties\.length - 1\)/u, 'native variants must remove Penpot auto-properties that are absent from the contract');
assert.match(materializer, /yieldEvery/u, 'long live writes must yield between bounded operations');
assert.match(materializer, /System \/ Candidate summary/u, 'each native master must retain one visible deterministic contract summary');
assert.match(materializer, /component_state/u, 'candidate governance flags must be stored as one bounded native payload');
assert.match(materializer, /componentEntityIds/u, 'materializer must support bounded component batches');
assert.match(materializer, /PASS_PARTIAL/u, 'bounded batches must report a non-final partial status');
assert.match(materializer, /variantComponentsByEntityCase/u, 'nested instances must resolve exact native case variants');
assert.match(materializer, /component_variant_case/u, 'nested instance contract must carry the exact native case');
assert.match(materializer, /consumer_profile_ref/u, 'nested instance contract must preserve the consumer profile');
const historyMaterializer = fs.readFileSync(path.join(root, 'scripts/component-synthesis-v0.1/materialize-ui-exploration-history.js'), 'utf8');
assert.match(historyMaterializer, /WITHDRAWN_FROM_OWNER_REVIEW/u);
assert.match(historyMaterializer, /NEEDS_REVISION/u);
const workflow = fs.readFileSync(path.join(root, '.github/workflows/apply-component-synthesis-v0-1.yml'), 'utf8');
const eventPaths = (event) => {
  const lines = workflow.split(/\r?\n/u);
  const eventIndex = lines.findIndex((line) => line === `  ${event}:`);
  assert.ok(eventIndex >= 0, `missing ${event} trigger`);
  const pathsIndex = lines.findIndex((line, index) => index > eventIndex && line === '    paths:');
  assert.ok(pathsIndex > eventIndex, `missing ${event}.paths`);
  const result = [];
  for (let index = pathsIndex + 1; index < lines.length && /^ {6}- /u.test(lines[index]); index += 1) result.push(lines[index].replace(/^ {6}- ['"]?|['"]?$/gu, ''));
  return result;
};
assert.deepEqual(eventPaths('push'), eventPaths('pull_request'), 'push and pull_request path filters must be byte-equal');
for (const pin of ['11bd71901bbe5b1630ceea73d27597364c9af683', '49933ea5288caeca8642d1e84afbd3f7d6820020', '8d9ed9ac5c53483de85588cdf95a591a75ab9f55']) assert.match(workflow, new RegExp(pin, 'u'));
assert.match(workflow, /github\.event_name/u);
assert.match(workflow, /persist-credentials: false/u);
assert.doesNotMatch(workflow, /pull_request_target/u);
assert.match(workflow, /permissions:\n  contents: read/u);

process.stdout.write(`${JSON.stringify({ status: 'PASS', positive_baselines: 1, semantic_mutations: cases.length, targeted_rejections: rejected, materializer_contract_checks: 38, workflow_contract_checks: 9 })}\n`);

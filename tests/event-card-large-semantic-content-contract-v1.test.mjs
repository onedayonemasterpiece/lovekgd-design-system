import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const contractPath = join(root, 'catalog/ui-components/event-card-large/semantic-content-contract.v1.json');
const schemaPath = join(root, 'contracts/ui-components/event-card-large-semantic-content-contract.v1.schema.json');
const validator = join(root, 'scripts/validate-event-card-large-semantic-content-contract-v1.mjs');
const defaultCensus = '/home/dev/.codex/worktrees/events-bot-new/event-card-semantic-runtime/artifacts/codex/event-card-semantic-closure/production-census.json';
const censusPath = process.env.EVENT_CARD_PRODUCTION_CENSUS || defaultCensus;

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

function rehash(contract) {
  const payload = structuredClone(contract);
  delete payload.contract_payload_sha256;
  contract.contract_payload_sha256 = createHash('sha256').update(JSON.stringify(canonical(payload))).digest('hex');
}

function runValidator(path, census = null) {
  const args = [validator, '--root', root, '--contract', path];
  if (census) args.push('--census', census);
  return spawnSync('node', args, { encoding: 'utf8' });
}

function schema(path) {
  return spawnSync('python3', [
    '-c',
    'import json,jsonschema,sys; jsonschema.validate(json.load(open(sys.argv[1])),json.load(open(sys.argv[2])))',
    path,
    schemaPath,
  ], { encoding: 'utf8' });
}

const contract = JSON.parse(readFileSync(contractPath, 'utf8'));
let result = runValidator(contractPath, existsSync(censusPath) ? censusPath : null);
assert.equal(result.status, 0, result.stderr || result.stdout);
const receipt = JSON.parse(result.stdout);
assert.equal(receipt.verdict, 'PASS');
assert.equal(receipt.production_event_types, 31);
assert.equal(receipt.projected_events, 703);
assert.equal(receipt.exact_projection_bytes_verified, true);
assert.equal(receipt.broad_census_bytes_verified, existsSync(censusPath));
result = schema(contractPath);
assert.equal(result.status, 0, result.stderr || result.stdout);

assert.equal(contract.event_type.identity_count, 1);
assert.equal(contract.event_type.component_per_literal, false);
assert.equal(contract.event_type.production_observed.rendered_labels.length, 31);
assert.equal(contract.admission.component_per_literal, false);
assert.deepEqual(contract.admission.semantic_states, [
  'ticket', 'free-entry', 'free-registration', 'registration-only',
  'sold-out', 'phone', 'price', 'absent',
]);
assert(!contract.admission.semantic_states.includes('paid'));
assert(!contract.admission.semantic_states.includes('unspecified'));
assert.equal(contract.admission.unknown_policy.visible, false);
assert.deepEqual(contract.admission.forbidden_display_literals, ['Условия уточняются']);
assert.equal(contract.admission.price_content.currency_is_variant_axis, false);
assert.equal(contract.admission.price_content.production_distinct_display_label_count, 61);

for (const [kind, expected] of Object.entries({ like: 557, share: 205 })) {
  const proof = contract.social_proof.components[kind];
  assert.equal(proof.count_owner_component_id, proof.component_id);
  assert.equal(proof.production_counts['count-positive'], expected);
  assert.equal(contract.interactive_actions.wrappers[kind].component_id, `event.action.${kind}`);
  assert.equal(contract.interactive_actions.wrappers[kind].nested_component_ref, proof.component_id);
}

const negativeMutations = [
  (candidate) => { candidate.event_type.component_per_literal = true; },
  (candidate) => {
    candidate.event_type.production_observed.rendered_labels.pop();
    candidate.event_type.production_observed.distinct_rendered_label_count = 30;
  },
  (candidate) => { candidate.admission.semantic_states[7] = 'unspecified'; },
  (candidate) => { candidate.admission.unknown_policy.visible = true; },
  (candidate) => { candidate.admission.price_content.currency_is_variant_axis = true; },
  (candidate) => { candidate.interactive_actions.wrappers.like.component_id = 'event.social-proof.like'; },
  (candidate) => { candidate.social_proof.components.share.count_owner_component_id = 'event.card'; },
  (candidate) => { candidate.social_proof.count_content_contract.required_ancestry = 'loose-card-sibling'; },
  (candidate) => { candidate.admission.forbidden_display_literals = []; },
  (candidate) => { candidate.source_provenance.broad_database_census.artifact_sha256 = '0'.repeat(64); },
];

for (const [index, mutate] of negativeMutations.entries()) {
  const candidate = structuredClone(contract);
  mutate(candidate);
  rehash(candidate);
  const directory = mkdtempSync(join(tmpdir(), `event-card-semantic-negative-${index}-`));
  const path = join(directory, 'contract.json');
  writeFileSync(path, `${JSON.stringify(candidate, null, 2)}\n`);
  result = runValidator(path);
  assert.notEqual(result.status, 0, `negative mutation ${index} passed validator`);
}

console.log('event-card-large-semantic-content-contract-v1: PASS (31 labels; 703 projections; semantic action/proof ownership enforced)');

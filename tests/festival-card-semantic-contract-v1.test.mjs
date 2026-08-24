import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const contractPath = join(root, 'catalog/ui-components/festival-card/semantic-contract.v1.json');
const schemaPath = join(root, 'contracts/ui-components/festival-card-semantic-contract.v1.schema.json');
const validator = join(root, 'scripts/validate-festival-card-semantic-contract-v1.mjs');

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  return value;
}

function rehash(contract) {
  const payload = structuredClone(contract);
  delete payload.contract_payload_sha256;
  contract.contract_payload_sha256 = createHash('sha256').update(JSON.stringify(canonical(payload))).digest('hex');
}

function validate(path) {
  return spawnSync('node', [validator, '--root', root, '--contract', path], { encoding: 'utf8' });
}

const contract = JSON.parse(readFileSync(contractPath, 'utf8'));
let result = validate(contractPath);
assert.equal(result.status, 0, result.stderr || result.stdout);
const receipt = JSON.parse(result.stdout);
assert.equal(receipt.verdict, 'PASS');
assert.equal(receipt.actual_category_count, 16);
assert.equal(receipt.actual_festival_count, 21);

result = spawnSync('python3', ['-c', 'import json,jsonschema,sys;jsonschema.validate(json.load(open(sys.argv[1])),json.load(open(sys.argv[2])))', contractPath, schemaPath], { encoding:'utf8' });
assert.equal(result.status, 0, result.stderr || result.stdout);

assert.equal(contract.status, 'not_ready_penpot_reconciliation_required');
assert.equal(contract.theme.component_id, 'festival.meta.theme');
assert.equal(contract.theme.component_per_literal, false);
assert.deepEqual(contract.theme.icon_slots, ['primary', 'secondary']);
assert.equal(contract.theme.actual_generated_values.length, 16);
assert.equal(contract.like.action_component_id, 'event.action.like');
assert.equal(contract.like.proof_component_id, 'event.social-proof.like');
assert.equal(contract.like.festival_specific_component_allowed, false);
assert.equal(contract.like.exact_joined_counts['more-vnutri'], 84);
assert.equal(contract.production_mutation.allowed, false);

const mutations = [
  (value) => { value.theme.component_per_literal = true; },
  (value) => { value.theme.actual_generated_values.pop(); },
  (value) => { value.theme.actual_generated_values[5].icons = ['star']; },
  (value) => { value.like.action_component_id = 'festival.action.favorite'; },
  (value) => { value.like.proof_component_id = null; },
  (value) => { value.like.exact_joined_counts['more-vnutri'] = 0; },
  (value) => { value.production_mutation.allowed = true; },
];

for (const [index, mutate] of mutations.entries()) {
  const candidate = structuredClone(contract);
  mutate(candidate);
  rehash(candidate);
  const dir = mkdtempSync(join(tmpdir(), `festival-semantic-negative-${index}-`));
  const path = join(dir, 'contract.json');
  writeFileSync(path, `${JSON.stringify(candidate, null, 2)}\n`);
  result = validate(path);
  assert.notEqual(result.status, 0, `negative mutation ${index} passed validator`);
}

console.log('festival-card-semantic-contract-v1: PASS (21 generated cards; 16 theme values; shared Like proof enforced)');

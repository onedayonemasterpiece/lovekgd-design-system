#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function parseArgs(argv) {
  const out = {};
  for (let index = 0; index < argv.length; index += 2) {
    if (!argv[index]?.startsWith('--') || !argv[index + 1]) throw new Error(`Invalid argument near ${argv[index] || '<end>'}`);
    out[argv[index].slice(2)] = argv[index + 1];
  }
  return out;
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  return value;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const expectedCategories = {
  'Авторская песня': ['mic', 'music'],
  'Вино и гастрономия': ['carrot'],
  'Гастрономия': ['carrot', 'users'],
  'Джаз': ['saxophone', 'music'],
  'История и реконструкция': ['history', 'map-pin'],
  'Кино': ['camera', 'ticket'],
  'Классическая музыка': ['music'],
  'Косплей': ['palette', 'star'],
  'Культура народов': ['users', 'palette'],
  'Литература': ['book-open'],
  'Море и техника': ['anchor', 'history'],
  'Музыка': ['music'],
  'Путешествия': ['map-pin', 'history'],
  'Семейный фестиваль': ['star', 'carrot'],
  'Современное искусство': ['palette'],
  'Театр': ['theatre-masks'],
};
const expectedCounts = { grozd:7, 'more-vnutri':84, 'bolshoy-kaup':198, 'territoriya-mira':3 };

export function validateFestivalSemanticContract(contract) {
  const payload = structuredClone(contract);
  const claimedHash = payload.contract_payload_sha256;
  delete payload.contract_payload_sha256;
  const actualHash = createHash('sha256').update(JSON.stringify(canonical(payload))).digest('hex');
  assert(claimedHash === actualHash, `contract_payload_sha256 mismatch: expected ${actualHash}`);
  assert(contract.schema_version === 'festival_card_semantic_contract.v1', 'schema_version mismatch');
  assert(contract.status === 'not_ready_penpot_reconciliation_required', 'FestivalCard must not be reported ready before Penpot reconciliation');
  assert(contract.canonical === false && contract.promotion_status === 'not_promoted', 'candidate must not be promoted');
  assert(contract.authority.festival_count === 21 && contract.authority.category_count === 16, 'actual generated census cardinality mismatch');
  assert(/^[0-9a-f]{40}$/u.test(contract.authority.source_exact_commit), 'source exact commit must be immutable');
  assert(contract.theme.component_id === 'festival.meta.theme', 'theme semantic component mismatch');
  assert(contract.theme.component_per_literal === false && contract.theme.component_variant === 'default', 'theme literals must remain content, not component masters');
  assert(JSON.stringify(contract.theme.icon_slots) === JSON.stringify(['primary', 'secondary']), 'theme must expose primary and optional secondary icon slots');
  assert(contract.theme.actual_generated_values.length === 16, 'all 16 actually generated category labels are required');
  const values = Object.fromEntries(contract.theme.actual_generated_values.map((row) => [row.label, row]));
  assert(Object.keys(values).length === 16, 'theme labels must be unique');
  for (const [label, icons] of Object.entries(expectedCategories)) {
    const row = values[label];
    assert(row, `missing generated theme ${label}`);
    assert(JSON.stringify(row.icons) === JSON.stringify(icons), `wrong icon mapping for ${label}`);
    assert(row.icon_slot_count === icons.length, `wrong icon slot count for ${label}`);
    assert(row.occurrence_count > 0, `observed theme ${label} must have an occurrence`);
  }
  assert(contract.theme.actual_generated_values.reduce((sum, row) => sum + row.occurrence_count, 0) === 21, 'theme occurrences must cover all 21 cards');
  assert(contract.like.action_component_id === 'event.action.like', 'FestivalCard must reuse shared Like action');
  assert(contract.like.proof_component_id === 'event.social-proof.like', 'FestivalCard must reuse shared Like social proof');
  assert(contract.like.count_owner === 'event.social-proof.like', 'Like count must remain inside the proof component');
  assert(contract.like.festival_specific_component_allowed === false, 'private Festival Favorite family is forbidden');
  assert(JSON.stringify(contract.like.exact_joined_counts) === JSON.stringify(expectedCounts), 'exact joined Like counts mismatch');
  assert(contract.production_mutation.allowed === false, 'production mutation is forbidden before owner acceptance');
  return {
    schema_version: 'festival_card_semantic_contract_validation.v1',
    verdict: 'PASS',
    contract_payload_sha256: actualHash,
    actual_festival_count: 21,
    actual_category_count: 16,
    theme_component_count: 1,
    joined_like_count: 4,
    production_mutated: false,
  };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (!args.contract) throw new Error('--contract is required');
    const contract = JSON.parse(readFileSync(resolve(args.contract), 'utf8'));
    process.stdout.write(`${JSON.stringify(validateFestivalSemanticContract(contract), null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}

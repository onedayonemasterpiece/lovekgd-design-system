#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { validateLifecycle, validateLifecycleSchema } from '../scripts/validate-family-lifecycle-v1.mjs';

const root = path.resolve(process.argv[2] || '.');
const source = JSON.parse(fs.readFileSync(path.join(root, 'contracts/normalization/family-lifecycle.v1.json'), 'utf8'));
const sourceSchema = JSON.parse(fs.readFileSync(path.join(root, 'contracts/normalization/family-lifecycle.v1.schema.json'), 'utf8'));
const clone = () => structuredClone(source);

const mutations = [
  ['reordered-state', (doc) => [doc.state_order[2], doc.state_order[3]] = [doc.state_order[3], doc.state_order[2]]],
  ['duplicated-state', (doc) => doc.state_order[4] = doc.state_order[3]],
  ['missing-transition', (doc) => doc.transitions.pop()],
  ['skipped-transition', (doc) => doc.transitions[4].to = 'PAGE_ARCHETYPE_CANDIDATE'],
  ['early-authority-flip', (doc) => { doc.transitions[3].authority.after = 'design-system-led'; doc.transitions[3].authority.authority_change = true; }],
  ['prepromotion-penpot-canonical', (doc) => doc.penpot_pre_promotion_semantics.canonical = true],
  ['missing-three-way-surface', (doc) => doc.three_way_conformance.surfaces.pop()],
  ['mismatched-three-way-tuple', (doc) => doc.three_way_conformance.equality_tuple.pop()],
  ['non-pro-gemini', (doc) => doc.gemini_mcp_visual_audit.allowed_model_ids[1] = 'gemini-3-flash'],
  ['writable-gemini-mcp', (doc) => doc.gemini_mcp_visual_audit.mcp_mode = 'write'],
  ['missing-gemini-limitation', (doc) => doc.gemini_mcp_visual_audit.cannot_prove = doc.gemini_mcp_visual_audit.cannot_prove.filter((value) => value !== 'three-way conformance')],
  ['false-current-promotion', (doc) => doc.current_repository_state.state = 'FAMILY_AND_ARCHETYPE_PROMOTION'],
  ['pending-product-promotion-allowed', (doc) => doc.promotion_invariants = doc.promotion_invariants.filter((value) => !value.includes('pending_product_model'))],
  ['missing-rollback-gate', (doc) => doc.transitions[1].gate.requirements = doc.transitions[1].gate.requirements.filter((value) => !value.includes('rollback'))],
];

const failures = [];
for (const [name, mutate] of mutations) {
  const candidate = clone();
  mutate(candidate);
  const result = validateLifecycle(candidate, { root, checkRepositoryFacts: false });
  if (result.length === 0) failures.push(`${name}: invalid mutation was accepted`);
}

const schemaMutations = [
  ['open-nested-schema', (doc) => { doc.properties.penpot_pre_promotion_semantics.additionalProperties = true; }],
  ['loose-gemini-allowlist-schema', (doc) => { doc.properties.gemini_mcp_visual_audit.properties.allowed_model_ids.prefixItems[1].const = 'gemini-3-flash'; }],
];
for (const [name, mutate] of schemaMutations) {
  const candidate = structuredClone(sourceSchema);
  mutate(candidate);
  const result = validateLifecycleSchema(candidate);
  if (result.length === 0) failures.push(`${name}: invalid schema mutation was accepted`);
}

if (failures.length) {
  console.error('Family lifecycle v1 negative suite: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Family lifecycle v1 negative suite: PASS (${mutations.length + schemaMutations.length} mutations rejected)`);

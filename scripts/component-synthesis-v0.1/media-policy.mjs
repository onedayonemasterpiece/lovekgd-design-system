import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { demand } from './structured-error.mjs';
import { PATHS } from './paths.mjs';

const readJson = (root, relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const readJsonl = (root, relative) => fs.readFileSync(path.join(root, relative), 'utf8').trimEnd().split('\n').map(JSON.parse);
const unique = (values) => new Set(values).size === values.length;
const sameSet = (a, b) => JSON.stringify([...new Set(a)].sort()) === JSON.stringify([...new Set(b)].sort());
const exactSourceSha = 'f66330f8af81d4b898d137d83356e77914dce90a';

function validateSchemas(root) {
  const script = `
import json,pathlib,sys
from jsonschema import Draft202012Validator
root=pathlib.Path(sys.argv[1]); schema=json.loads((root/sys.argv[2]).read_text())
Draft202012Validator.check_schema(schema)
for definition,relative,is_jsonl in [
 ('resolver',sys.argv[3],False),('rule_disposition',sys.argv[4],True),
 ('consumer_profile',sys.argv[5],True),('fixture_case',sys.argv[6],True),
]:
 text=(root/relative).read_text(); docs=[json.loads(x) for x in text.splitlines() if x] if is_jsonl else [json.loads(text)]
 validator=Draft202012Validator({'$schema':schema['$schema'],'$defs':schema['$defs'],'$ref':f'#/$defs/{definition}'})
 for index,document in enumerate(docs):
  errors=sorted(validator.iter_errors(document),key=lambda e:list(e.absolute_path))
  if errors: raise AssertionError(f'{relative}:{index+1}: {errors[0].json_path}: {errors[0].message}')
`;
  const result = childProcess.spawnSync('python3', ['-c', script, root, PATHS.mediaPolicySchema, PATHS.mediaResolver, PATHS.mediaRuleDispositions, PATHS.mediaConsumerProfiles, PATHS.mediaStateFixtures], { encoding: 'utf8' });
  demand(result.status === 0, 'ACS_MEDIA_POLICY_SCHEMA', 'media-policy', PATHS.mediaPolicySchema, '$', `Draft 2020-12 validation failed: ${result.stderr.trim()}`);
}

export function validateEventMediaPolicy({ root, applicationRefs, fixtureIds, entityIds, hierarchyEdges, materializableIds }) {
  validateSchemas(root);
  const resolver = readJson(root, PATHS.mediaResolver);
  const rules = readJsonl(root, PATHS.mediaRuleDispositions);
  const profiles = readJsonl(root, PATHS.mediaConsumerProfiles);
  const cases = readJsonl(root, PATHS.mediaStateFixtures);
  const proof = readJson(root, PATHS.mediaPenpotProof);

  demand(resolver.events_source_sha === exactSourceSha, 'ACS_MEDIA_POLICY_SOURCE_SHA', 'media-policy', PATHS.mediaResolver, '$.events_source_sha', 'resolver is not bound to exact current events main');
  demand(Object.values(resolver.global_defaults).every((value) => value === null), 'ACS_MEDIA_GLOBAL_DEFAULT', 'media-policy', PATHS.mediaResolver, '$.global_defaults', 'global ratio/fit/crop/object-position/upscale defaults are forbidden');
  for (const phrase of ['No global ratio', 'Protected or unknown', 'solver contain result', 'Static resolved Astro HTML']) {
    demand(resolver.core_invariants.some((rule) => rule.includes(phrase)), 'ACS_MEDIA_POLICY_INVARIANT', 'media-policy', PATHS.mediaResolver, '$.core_invariants', `missing fail-closed invariant: ${phrase}`);
  }

  demand(unique(rules.map((row) => row.rule_id)), 'ACS_MEDIA_RULE_DUPLICATE', 'media-policy', PATHS.mediaRuleDispositions, '$[*].rule_id', 'rule IDs must be unique');
  const ruleById = new Map(rules.map((row) => [row.rule_id, row]));
  const exactCritical = {
    'EMR-RELATED-SOLVER-VETO': 'REPLACE',
    'EMR-HERO-FILL-EXCEPTION': 'BLOCKED_EVIDENCE',
    'EMR-HERO-TINY-PREDICATE': 'REPLACE',
    'EMR-LAB-EVENT-MEDIA-RAIL': 'REMOVE_AS_STALE',
    'EMR-EXHIBITIONS-PROTECTED': 'REPLACE',
    'EMR-UNKNOWN-DIMENSION': 'REPLACE',
  };
  for (const [id, disposition] of Object.entries(exactCritical)) demand(ruleById.get(id)?.disposition === disposition, 'ACS_MEDIA_RULE_TRUTH_ESCAPE', 'media-policy', id, '$.disposition', `${id} must remain ${disposition}`);
  demand(rules.every((row) => row.evidence_refs.every((ref) => ref.startsWith(`events@${exactSourceSha}:`))), 'ACS_MEDIA_POLICY_SOURCE_SHA', 'media-policy', PATHS.mediaRuleDispositions, '$[*].evidence_refs', 'rule evidence must pin exact current events main');

  demand(profiles.length === 17 && unique(profiles.map((row) => row.profile_id)), 'ACS_MEDIA_PROFILE_COVERAGE', 'media-policy', PATHS.mediaConsumerProfiles, '$', 'expected exactly 17 unique explicit consumer profiles');
  const profileById = new Map(profiles.map((row) => [row.profile_id, row]));
  for (const profile of profiles) {
    demand(profile.rule_refs.every((id) => ruleById.has(id)), 'ACS_MEDIA_PROFILE_RULE_FK', 'media-policy', profile.profile_id, '$.rule_refs', 'profile contains unknown rule ref');
    demand(entityIds.has(profile.consumer_entity_ref), 'ACS_MEDIA_PROFILE_ENTITY_FK', 'media-policy', profile.profile_id, '$.consumer_entity_ref', 'profile contains unknown consumer entity');
    if (profile.lifecycle === 'EVIDENCE_ONLY') demand(profile.rule_status === 'EVIDENCE_ONLY' && profile.application_refs.every((id) => id.includes('.lab-')), 'ACS_MEDIA_LAB_PROMOTION', 'media-policy', profile.profile_id, '$', 'evidence-only profile escaped into production');
    if (profile.rule_status === 'BLOCKED_EVIDENCE') demand(profile.rule_refs.some((id) => ruleById.get(id)?.disposition === 'BLOCKED_EVIDENCE'), 'ACS_MEDIA_CONFLICT_FAIL_OPEN', 'media-policy', profile.profile_id, '$.rule_refs', 'blocked profile lacks blocked-evidence rule');
  }
  const assignedApplications = profiles.flatMap((row) => row.application_refs);
  demand(assignedApplications.length === 52 && unique(assignedApplications) && sameSet(assignedApplications, applicationRefs), 'ACS_MEDIA_APPLICATION_PARTITION', 'media-policy', PATHS.mediaConsumerProfiles, '$[*].application_refs', 'profiles must partition the exact 52 historical application refs once');
  const rail = profileById.get('profile.mobile-listing-rail-row');
  demand(rail?.consumer_entity_ref === 'listing.rail-row' && /default4 hard6/u.test(rail.runtime_policy) && /140x112/u.test(rail.target_geometry), 'ACS_MEDIA_RAIL_PROFILE', 'media-policy', 'profile.mobile-listing-rail-row', '$', 'production mobile rail profile/cardinality differs from exact source');
  const labRail = profileById.get('profile.lab-event-media-rail');
  demand(labRail?.lifecycle === 'EVIDENCE_ONLY' && labRail.rule_status === 'EVIDENCE_ONLY', 'ACS_MEDIA_LAB_PROMOTION', 'media-policy', 'profile.lab-event-media-rail', '$', 'lab EventMediaRail cannot be production policy');

  demand(unique(cases.map((row) => row.case_id)), 'ACS_MEDIA_CASE_DUPLICATE', 'media-policy', PATHS.mediaStateFixtures, '$[*].case_id', 'fixture case IDs must be unique');
  for (const row of cases) {
    demand(profileById.has(row.profile_ref), 'ACS_MEDIA_CASE_PROFILE_FK', 'media-policy', row.case_id, '$.profile_ref', 'fixture case contains unknown profile');
    demand(fixtureIds.has(row.fixture_ref), 'ACS_MEDIA_CASE_FIXTURE_FK', 'media-policy', row.case_id, '$.fixture_ref', 'fixture case contains unknown fixture');
    if (['contain', 'source-preserving'].includes(row.expected_fit)) demand(row.expected_crop_permission !== 'allowed' && row.expected_crop_window === 'none', 'ACS_MEDIA_PROTECTED_CROP', 'media-policy', row.case_id, '$', 'protected/contained case cannot carry crop permission/window');
    if (/fixture\.(?:poster|unknown-text)/u.test(row.fixture_ref)) demand(row.expected_fit !== 'cover' && row.expected_crop_permission !== 'allowed', 'ACS_MEDIA_PROTECTED_CROP', 'media-policy', row.case_id, '$', 'poster/OCR/unknown fixture cannot be promoted to cover');
    if (row.runtime_state === 'missing') demand(row.expected_crop_permission === 'not_applicable' && row.expected_crop_window === 'none', 'ACS_MEDIA_MISSING_CROP', 'media-policy', row.case_id, '$', 'missing case cannot carry crop/focal decision');
    if (row.rule_status === 'BLOCKED_EVIDENCE') demand(row.expected_fit === 'conflict-open' && row.expected_crop_permission === 'conflict-open', 'ACS_MEDIA_CONFLICT_FAIL_OPEN', 'media-policy', row.case_id, '$', 'blocked case cannot assert a resolved fit/crop decision');
  }
  for (const state of ['loading', 'loaded', 'missing', 'broken', 'tiny']) demand(cases.some((row) => row.runtime_state === state), 'ACS_MEDIA_STATE_COVERAGE', 'media-policy', PATHS.mediaStateFixtures, '$[*].runtime_state', `missing runtime state ${state}`);

  const edgeSet = new Set(hierarchyEdges.map((edge) => `${edge.parent}->${edge.child}`));
  demand(edgeSet.has('listing.rail-row->event.media-frame') && !edgeSet.has('listing.rail-row->event.card'), 'ACS_MEDIA_RAIL_HIERARCHY', 'media-policy', 'listing.rail-row', '$.edges', 'listing rail must contain EventMediaFrame instances, not EventCard');
  demand(!edgeSet.has('event.media-rail->event.media-frame') && !materializableIds.includes('event.media-rail'), 'ACS_MEDIA_LAB_PROMOTION', 'media-policy', 'event.media-rail', '$', 'lab EventMediaRail must not be materialized as production component');
  demand(materializableIds.includes('listing.rail-row'), 'ACS_MEDIA_RAIL_MATERIALIZATION', 'media-policy', 'listing.rail-row', '$', 'current production listing rail row requires a candidate contract/materialization entry');

  const proofSchema = readJson(root, PATHS.mediaPolicySchema);
  const proofScript = `import json,sys; from jsonschema import Draft202012Validator; s=json.load(open(sys.argv[1])); d=json.load(open(sys.argv[2])); v=Draft202012Validator({'$schema':s['$schema'],'$defs':s['$defs'],'$ref':'#/$defs/penpot_proof'}); e=sorted(v.iter_errors(d),key=lambda x:list(x.absolute_path)); assert not e, f'{e[0].json_path}: {e[0].message}'`;
  const proofCheck = childProcess.spawnSync('python3', ['-c', proofScript, path.join(root, PATHS.mediaPolicySchema), path.join(root, PATHS.mediaPenpotProof)], { encoding: 'utf8' });
  demand(proofCheck.status === 0, 'ACS_MEDIA_PENPOT_PROOF_SCHEMA', 'media-policy', PATHS.mediaPenpotProof, '$', `Penpot proof schema failed: ${proofCheck.stderr.trim()}`);
  demand(proof.variant_cases.map((row) => row.case).sort().join('|') === ['broken-fallback', 'loaded-protected-contain', 'loaded-safe-cover', 'loading-reserved', 'tiny-bounded'].join('|'), 'ACS_MEDIA_PENPOT_CASE_SET', 'media-policy', PATHS.mediaPenpotProof, '$.variant_cases', 'Penpot native case set differs from frame contract');
  demand(proof.rail_proof.nested_instances.every((row) => row.linked === true && row.detached === false && row.profile_ref === 'profile.mobile-listing-rail-row'), 'ACS_MEDIA_PENPOT_NESTING', 'media-policy', PATHS.mediaPenpotProof, '$.rail_proof.nested_instances', 'rail proof must contain only linked profile-bound frame instances');

  return { resolver, rules, profiles, cases, proof, counts: { rules: rules.length, profiles: profiles.length, applications: assignedApplications.length, cases: cases.length, penpot_variants: proof.variant_cases.length, penpot_linked_rail_instances: proof.rail_proof.nested_instances.length } };
}

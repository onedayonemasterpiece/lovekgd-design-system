import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '../..');
const artifactPath = path.join(root, 'catalog/corpus-d0/free-collection-eventcard-geometry-proof.v1.json');
const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));
const clone = (value) => structuredClone(value);
const canonical = (value) => JSON.stringify(value, Object.keys(value).sort());
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
};
const sha = (value) => createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');

const geometryFields = [
  'width', 'height', 'four_corner_radii', 'border_width_style',
  'overflow_and_clipping', 'padding', 'gap', 'alignment', 'aspect_ratio',
  'icon_box_and_icon_text_gap', 'resolved_token_name_and_numeric_value',
];
const requiredRegions = [
  'event_card_outer_surface', 'event_card_media_mask', 'admission_pill',
  'calendar_primary_action', 'not_interested_action', 'social_action_row',
  'share_control', 'favorite_control',
];
const requiredCases = [
  'eventcard.desktop-wide-calendar.8006',
  'eventcard.desktop-packed-calendar-absent.2182',
  'eventcard.mobile-wide-calendar.8006',
  'eventcard.mobile-packed-calendar-absent.2182',
];

const schema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  additionalProperties: false,
  required: ['schema_version', 'status', 'proof_payload', 'proposed_exact_page_profile_geometry_proof_update_not_applied', 'integrity'],
  properties: {
    schema_version: { const: 'kenigevents.corpus-d0.free-collection-eventcard-geometry-proof.v1' },
    status: { const: 'PASS_EXACT_SOURCE_GEOMETRY' },
    proof_payload: {
      type: 'object', additionalProperties: false, required: ['authority', 'region_contract', 'cases'],
      properties: {
        authority: { type: 'object' },
        region_contract: { type: 'object' },
        cases: {
          type: 'array', minItems: 4, maxItems: 4,
          items: {
            type: 'object', additionalProperties: false,
            required: ['case_id', 'context', 'capture', 'regions', 'case_sha256'],
            properties: {
              case_id: { type: 'string' },
              case_sha256: { type: 'string', pattern: '^[0-9a-f]{64}$' },
              capture: { type: 'object' },
              context: {
                type: 'object', additionalProperties: false,
                required: ['source_component_path_and_commit', 'selector_or_state_identity', 'scenario_id', 'viewport_and_DPR', 'font_set', 'locale', 'timezone', 'fixture_id', 'reference_clock'],
                properties: {
                  source_component_path_and_commit: { type: 'object' },
                  selector_or_state_identity: { type: 'string' },
                  scenario_id: { type: 'string' }, viewport_and_DPR: { type: 'object' },
                  font_set: { type: 'object' }, locale: { const: 'ru-RU' },
                  timezone: { const: 'Europe/Kaliningrad' }, fixture_id: { type: 'string' },
                  reference_clock: { const: '2026-08-30T12:00:00+02:00' },
                },
              },
              regions: {
                type: 'array', minItems: 8, maxItems: 8,
                items: {
                  type: 'object', required: ['region_id', 'selector', 'presence', 'geometry'],
                  properties: {
                    region_id: { type: 'string' }, selector: { type: 'string' },
                    presence: { enum: ['PRESENT_EXACT', 'ABSENT_EXPECTED_EXACT'] },
                    geometry: {
                      anyOf: [
                        { type: 'null' },
                        { type: 'object', additionalProperties: false, required: ['evidence_status', ...geometryFields],
                          properties: Object.fromEntries(['evidence_status', ...geometryFields].map((key) => [key, key === 'evidence_status' ? { const: 'EXACT_FROZEN_BROWSER_COMPUTED' } : { type: 'object' }])) },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    proposed_exact_page_profile_geometry_proof_update_not_applied: { type: 'object' },
    integrity: { type: 'object' },
  },
};

const schemaValidate = (value) => {
  const code = [
    'import json,jsonschema,sys',
    'value,schema=json.load(sys.stdin)',
    'jsonschema.Draft202012Validator.check_schema(schema)',
    'jsonschema.Draft202012Validator(schema).validate(value)',
  ].join(';');
  return spawnSync('python3', ['-c', code], { input: JSON.stringify([value, schema]), encoding: 'utf8' });
};
const assertSchemaPass = (value) => {
  const result = schemaValidate(value);
  assert.equal(result.status, 0, result.stderr || result.stdout);
};
const assertSchemaFail = (value) => {
  const result = schemaValidate(value);
  assert.notEqual(result.status, 0, 'negative instance unexpectedly passed JSON Schema');
};

test('artifact executes its contract-current JSON Schema', () => {
  assertSchemaPass(artifact);
  const omitted = clone(artifact);
  delete omitted.proof_payload.cases[0].context.font_set;
  assertSchemaFail(omitted);
  const changed = clone(artifact);
  changed.status = 'APPROXIMATE';
  assertSchemaFail(changed);
  const missingMobileValue = clone(artifact);
  delete missingMobileValue.proof_payload.cases[2].regions[0].geometry.width;
  assertSchemaFail(missingMobileValue);
});

test('proof and every case are content-addressed with exact closure', () => {
  assert.equal(sha(artifact.proof_payload), artifact.integrity.proof_payload_sha256);
  assert.equal(sha(artifact.proof_payload.cases), artifact.integrity.cases_sha256);
  assert.equal(sha(artifact.proposed_exact_page_profile_geometry_proof_update_not_applied), artifact.integrity.proposed_update_sha256);
  for (const row of artifact.proof_payload.cases) {
    const copy = clone(row); delete copy.case_sha256;
    assert.equal(sha(copy), row.case_sha256, row.case_id);
  }
});

test('source A is pinned to the corrected R3 harness and exact frozen bytes', () => {
  const authority = artifact.proof_payload.authority;
  assert.equal(authority.source_A.commit, 'c7c3e2367db8fd8865a735c8b9f5df1ef2b6efd1');
  assert.equal(authority.source_A.tree, '3c7b231d10e93866899cede299c3523c8b996711');
  assert.equal(authority.source_A.live_harness_receipt_comment, 5480171331);
  assert.deepEqual(authority.source_A.superseded_invalid_receipts, [5479606255, 5480065758]);
  assert.equal(authority.source_A.live_html_sha256, '955632db8fc9d25507f1d60403711ca555bfc15aa9d266756a3b40c49d7b710f');
  assert.equal(authority.frozen_exact_evidence.regions_sha256, 'ce4bff02b0de75aca895507e17bbee27d44c5728dd800baece3ab4e098a77ecf');
  assert.equal(authority.frozen_exact_evidence.captures_manifest_sha256, '801bb68e519768c00d621203d75c408d0429bbd31878928da56772a19255df59');
  assert.equal(authority.frozen_exact_evidence.runtime_font_manifest_sha256, 'f5d0148efec15bfadb15482a64dfe29e146b8b927a18047f72ac86076de510d3');
});

test('all four cases and eight regions are exact; mobile omissions fail closed', () => {
  const cases = artifact.proof_payload.cases;
  assert.deepEqual(cases.map((row) => row.case_id), requiredCases);
  assert.deepEqual(artifact.proof_payload.region_contract.required_regions, requiredRegions);
  for (const row of cases) {
    assert.deepEqual(row.regions.map((region) => region.region_id), requiredRegions, row.case_id);
    assert.equal(row.context.viewport_and_DPR.dpr, 1);
    const isMobile = row.case_id.includes('.mobile-');
    assert.equal(row.context.viewport_and_DPR.width, isMobile ? 390 : 1280);
    assert.equal(row.context.viewport_and_DPR.height, isMobile ? 844 : 1200);
    for (const region of row.regions) {
      const allowedAbsence = row.context.fixture_id === 'event.real.2182' && region.region_id === 'calendar_primary_action';
      if (allowedAbsence) {
        assert.equal(region.presence, 'ABSENT_EXPECTED_EXACT');
        assert.equal(region.geometry, null);
        assert.equal(region.absence_evidence.matching_descendant_count, 0);
        assert.equal(region.absence_evidence.root_data_calendar_eligible, 'false');
      } else {
        assert.equal(region.presence, 'PRESENT_EXACT');
        assert.ok(region.geometry);
        assert.deepEqual(Object.keys(region.geometry).sort(), ['evidence_status', ...geometryFields].sort());
        assert.ok(Number.isFinite(region.geometry.width.box_px));
        assert.ok(Number.isFinite(region.geometry.height.box_px));
      }
    }
  }
});

test('critical observed bounds stay bound to exact desktop and frozen mobile evidence', () => {
  const byId = new Map(artifact.proof_payload.cases.map((row) => [row.case_id, row]));
  const outer = (id) => byId.get(id).regions.find((region) => region.region_id === 'event_card_outer_surface').geometry;
  assert.deepEqual([outer(requiredCases[0]).width.box_px, outer(requiredCases[0]).height.box_px], [533.797, 947.328]);
  assert.deepEqual([outer(requiredCases[1]).width.box_px, outer(requiredCases[1]).height.box_px], [533.797, 655.984]);
  assert.deepEqual([outer(requiredCases[2]).width.box_px, outer(requiredCases[2]).height.box_px], [340, 701.281]);
  assert.deepEqual([outer(requiredCases[3]).width.box_px, outer(requiredCases[3]).height.box_px], [340, 513.297]);
  assert.equal(byId.get(requiredCases[2]).capture.sha256, 'f66466ebbffc41352995492b82e9cc75371ee3e9bcd0d987baf2782a1d41285e');
  assert.equal(byId.get(requiredCases[3]).capture.sha256, '8b78a5e4395dd5b5eeb495d2c32094c9170adb732cce73c7a33cc07d586f05ec');
});

test('proposal is exact, non-mutating and deliberately not applied to canonical profile', () => {
  const proposal = artifact.proposed_exact_page_profile_geometry_proof_update_not_applied;
  assert.equal(proposal.proof_payload_sha256, artifact.integrity.proof_payload_sha256);
  assert.equal(proposal.approximate_geometry_allowed, false);
  assert.equal(proposal.penpot_mutation_authorized_by_this_update, false);
  const profile = readFileSync(path.join(root, 'contracts/page-profiles/free-collection.owner-review.v1.yaml'), 'utf8');
  assert.match(profile, /geometry_proof:\n  status: BLOCKED_UNRESOLVED_GEOMETRY/u);
});

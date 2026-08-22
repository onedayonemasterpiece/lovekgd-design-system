#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const EXPECTED_CENSUS_SHA = '3578bee41bda0b5e32e950fd1f27a2561b1ca3714ce7ac9bdd8cc4068e36ff08';
const EXPECTED_PROJECTION_SHA = '30c8ac5adfaeff17c463191714f660b3ed5d0a00aa8799e90f2be70cb1ca9993';
const EXPECTED_EVENT_TYPES = [
  'концерт', 'спектакль', 'кинопоказ', 'экскурсия', 'выставка', 'встреча',
  'мастер-класс', 'лекция', 'фестиваль', 'ярмарка', 'спорт', 'соревнования',
  'вечеринка', 'стендап', 'акция', 'дегустация', 'день открытых дверей',
  'игра', 'праздник', 'церемония', 'шоу', 'movie', 'therapy',
  'викторина', 'конференция', 'открытие', 'перформанс', 'представление',
  'презентация', 'соревнование', 'театр',
];
const EXPECTED_EVENT_TYPE_COUNTS = [
  224, 89, 79, 60, 54, 45, 40, 24, 23, 13, 11, 8, 5, 4, 2, 2, 2, 2, 2, 2, 2,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];
const EXPECTED_ADMISSION_STATES = [
  'ticket', 'free-entry', 'free-registration', 'registration-only',
  'sold-out', 'phone', 'price', 'absent',
];

function args(argv) {
  const result = { root: '.', contract: null, census: null, projectionReport: null };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === '--root') result.root = argv[++index];
    else if (key === '--contract') result.contract = argv[++index];
    else if (key === '--census') result.census = argv[++index];
    else if (key === '--projection-report') result.projectionReport = argv[++index];
    else throw new Error(`unknown argument: ${key}`);
  }
  return result;
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

function hashContract(contract) {
  const payload = structuredClone(contract);
  delete payload.contract_payload_sha256;
  return createHash('sha256').update(JSON.stringify(canonical(payload))).digest('hex');
}

function sum(object, keys) {
  return keys.reduce((total, key) => total + object[key], 0);
}

function validate(contract) {
  assert.equal(contract.schema_version, 'event_card_large_semantic_content_contract_v1');
  assert.equal(contract.component_id, 'event.card');
  assert.equal(contract.authority_mode, 'reconstructed');
  assert.equal(contract.canonical, false);
  assert.equal(contract.promotion_status, 'not_promoted');
  assert.equal(hashContract(contract), contract.contract_payload_sha256, 'contract hash mismatch');

  const provenance = contract.source_provenance;
  assert.match(provenance.design_base_sha, /^[a-f0-9]{40}$/u);
  assert.match(provenance.events_base_sha, /^[a-f0-9]{40}$/u);
  assert.equal(provenance.broad_database_census.artifact_sha256, EXPECTED_CENSUS_SHA);
  assert.equal(provenance.broad_database_census.total_database_events, 7861);
  assert.equal(provenance.exact_public_projection_census.artifact_sha256, EXPECTED_PROJECTION_SHA);
  assert.equal(provenance.exact_public_projection_census.projected_event_count, 703);
  assert.equal(provenance.exact_public_projection_census.events_repository_sha, provenance.events_base_sha);

  const eventType = contract.event_type;
  assert.equal(eventType.component_id, 'event.meta.event-type');
  assert.equal(eventType.identity_count, 1);
  assert.equal(eventType.component_per_literal, false);
  assert.equal(eventType.value_model, 'arbitrary-nonempty-text-content-override');
  assert.deepEqual(eventType.presence_states, ['present', 'absent']);
  assert.equal(eventType.production_observed.distinct_rendered_label_count, 31);
  assert.deepEqual(eventType.production_observed.rendered_labels, EXPECTED_EVENT_TYPES);
  assert.equal(new Set(eventType.production_observed.rendered_labels).size, 31);
  assert.deepEqual(eventType.production_observed.rendered_label_counts.map((row) => row.label), EXPECTED_EVENT_TYPES);
  assert.deepEqual(eventType.production_observed.rendered_label_counts.map((row) => row.count), EXPECTED_EVENT_TYPE_COUNTS);
  assert.equal(eventType.production_observed.rendered_label_counts.reduce((total, row) => total + row.count, 0), 703);

  const admission = contract.admission;
  assert.equal(admission.component_id, 'event.meta.admission');
  assert.equal(admission.identity_count, 1);
  assert.equal(admission.component_per_literal, false);
  assert.deepEqual(admission.semantic_states, EXPECTED_ADMISSION_STATES);
  assert.equal(admission.price_content.amount_model, 'positive-decimal-or-range');
  assert.equal(admission.price_content.minimum_exclusive, 0);
  assert.equal(admission.price_content.currency_model, 'arbitrary-nonempty-currency-code-or-symbol');
  assert.equal(admission.price_content.currency_is_variant_axis, false);
  assert.equal(admission.price_content.production_distinct_display_label_count, 61);
  assert.deepEqual(admission.forbidden_semantic_states, ['paid', 'unspecified', 'unknown']);
  assert.deepEqual(admission.forbidden_display_literals, ['Условия уточняются']);
  assert.equal(admission.unknown_policy.semantic_state, 'absent');
  assert.equal(admission.unknown_policy.visible, false);
  assert.equal(admission.unknown_policy.source_gap_count, 96);
  assert.equal(admission.invalid_source_data.zero_price_count, 2);
  assert.equal(admission.invalid_source_data.disposition, 'fail-closed-no-visible-price-chip');
  for (const forbidden of admission.forbidden_semantic_states) {
    assert(!admission.semantic_states.includes(forbidden), `${forbidden} must not be an admission state`);
  }
  const admissionCountKeys = [
    'ticket', 'free-entry', 'obsolete-unknown-source-gap', 'free-registration',
    'registration-only', 'sold-out', 'phone', 'price',
  ];
  assert.equal(sum(admission.production_output_counts, admissionCountKeys), 703);
  assert.equal(admission.production_output_counts.total, 703);

  const wrappers = contract.interactive_actions.wrappers;
  assert.deepEqual(Object.keys(wrappers), ['like', 'share', 'calendar', 'not_interested']);
  assert.equal(wrappers.like.component_id, 'event.action.like');
  assert.equal(wrappers.like.nested_component_ref, 'event.social-proof.like');
  assert.equal(wrappers.share.component_id, 'event.action.share');
  assert.equal(wrappers.share.nested_component_ref, 'event.social-proof.share');
  assert.equal(wrappers.calendar.component_id, 'event.action.calendar');
  assert.equal(wrappers.not_interested.component_id, 'event.action.not-interested');
  for (const wrapper of Object.values(wrappers)) assert.match(wrapper.component_id, /^event\.action\./u);
  assert.equal(sum(wrappers.calendar.production_counts, ['eligible', 'absent']), 703);
  assert.equal(wrappers.calendar.production_counts.total, 703);

  const proofs = contract.social_proof.components;
  for (const kind of ['like', 'share']) {
    const proof = proofs[kind];
    assert.equal(proof.component_id, `event.social-proof.${kind}`);
    assert.equal(proof.count_owner_component_id, proof.component_id, `${kind} must own its count`);
    assert.deepEqual(proof.count_states, ['count-positive', 'count-absent']);
    assert.equal(sum(proof.production_counts, ['count-positive', 'count-absent']), 703);
    assert.equal(proof.production_counts.total, 703);
  }
  const count = contract.social_proof.count_content_contract;
  assert.equal(count.positive_value_is_arbitrary_content, true);
  assert.equal(count.zero_or_missing_resolves_to, 'count-absent');
  assert.equal(count.required_ancestry, 'descendant-of-owning-social-proof-instance');
  assert.equal(count.component_per_numeric_value, false);
  for (const required of [
    'loose-count-sibling-on-card',
    'loose-functional-icon-sibling',
    'count-owned-by-parent-card',
    'count-owned-by-terminal-review-instance',
  ]) assert(contract.social_proof.forbidden.includes(required));

  assert.equal(contract.penpot_reconciliation.penpot_write_performed_by_this_contract, false);
  assert(contract.non_claims.includes('family promotion'));
  assert(contract.non_claims.includes('production UI mutation'));
}

function verifyCensus(path, contract) {
  const bytes = readFileSync(path);
  const digest = createHash('sha256').update(bytes).digest('hex');
  assert.equal(digest, EXPECTED_CENSUS_SHA, 'production census byte hash mismatch');
  const census = JSON.parse(bytes);
  assert.equal(census.quick_check, 'ok');
  assert.equal(census.observed_at_utc, contract.source_provenance.broad_database_census.observed_at);
  assert.equal(census.source.mode, 'read-only schema-first aggregate census');
  assert.equal(census.total_events, contract.source_provenance.broad_database_census.total_database_events);
}

function verifyProjectionReport(path, contract) {
  const bytes = readFileSync(path);
  const digest = createHash('sha256').update(bytes).digest('hex');
  assert.equal(digest, EXPECTED_PROJECTION_SHA, 'exact public projection census byte hash mismatch');
  const report = JSON.parse(bytes);
  assert.equal(report.schema_version, 'event_card_semantic_exact_public_census.v1');
  assert.equal(report.public_projection.eligible_count, 703);
  assert.equal(report.source.repository_head, contract.source_provenance.events_base_sha);
  assert.equal(report.event_type.rendered_label_count, 31);
  for (const row of contract.event_type.production_observed.rendered_label_counts) {
    assert.equal(report.event_type.rendered_labels[row.label], row.count, `projection count mismatch for ${row.label}`);
  }
  const admissionMap = {
    ticket: 'ticketed-generic',
    'free-entry': 'free-entry',
    'obsolete-unknown-source-gap': 'unknown',
    'free-registration': 'free-registration',
    'registration-only': 'registration-only',
    'sold-out': 'sold-out',
    phone: 'phone',
    price: 'priced',
  };
  for (const [contractKey, reportKey] of Object.entries(admissionMap)) {
    assert.equal(report.admission.semantic_state_counts[reportKey], contract.admission.production_output_counts[contractKey]);
  }
  assert.equal(report.admission.rendered_price_label_count, contract.admission.price_content.production_distinct_display_label_count);
  assert.equal(report.admission.rendered_zero_ruble_count, contract.admission.invalid_source_data.zero_price_count);
  assert.equal(report.admission.static_rendered_outputs['Условия уточняются'], contract.admission.unknown_policy.source_gap_count);
  for (const kind of ['likes', 'shares']) {
    const contractKey = kind === 'likes' ? 'like' : 'share';
    assert.equal(report.actions_and_social[kind].states.positive, contract.social_proof.components[contractKey].production_counts['count-positive']);
    assert.equal(report.actions_and_social[kind].states.absent, contract.social_proof.components[contractKey].production_counts['count-absent']);
  }
  assert.equal(report.actions_and_social.calendar.eligible, contract.interactive_actions.wrappers.calendar.production_counts.eligible);
  assert.equal(report.actions_and_social.calendar.absent, contract.interactive_actions.wrappers.calendar.production_counts.absent);
}

try {
  const options = args(process.argv.slice(2));
  const root = resolve(options.root);
  const contractPath = resolve(options.contract ?? `${root}/catalog/ui-components/event-card-large/semantic-content-contract.v1.json`);
  const contract = JSON.parse(readFileSync(contractPath, 'utf8'));
  validate(contract);
  const projectionPath = resolve(options.projectionReport ?? `${root}/${contract.source_provenance.exact_public_projection_census.artifact_ref}`);
  verifyProjectionReport(projectionPath, contract);
  if (options.census) verifyCensus(resolve(options.census), contract);
  process.stdout.write(`${JSON.stringify({
    verdict: 'PASS',
    contract: contractPath,
    contract_sha256: contract.contract_payload_sha256,
    production_event_types: 31,
    projected_events: 703,
    exact_projection_bytes_verified: true,
    broad_census_bytes_verified: Boolean(options.census),
  })}\n`);
} catch (error) {
  process.stderr.write(`event-card semantic contract validation failed: ${error.message}\n`);
  process.exitCode = 1;
}

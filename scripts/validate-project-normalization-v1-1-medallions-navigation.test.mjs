#!/usr/bin/env node
import assert from 'node:assert/strict';
import test from 'node:test';
import { loadModel, validate, validateModel } from './validate-project-normalization-v1-1-medallions-navigation.mjs';

const root = new URL('..', import.meta.url).pathname;
const clone = (value) => structuredClone(value);
const baseline = loadModel(root);
const rejects = (mutate, pattern) => {
  const model = clone(baseline);
  mutate(model);
  assert.throws(() => validateModel(model), pattern);
};

test('complete pinned v1.1 medallion/navigation package validates', () => {
  assert.equal(validate(root).status, 'PASS');
});

test('readiness cannot become ready while evidence and decisions are open', () => {
  rejects((model) => { model.dossier.readiness = 'READY'; }, /readiness must remain NOT_READY/u);
});

test('identity categories cannot collapse into token kinds', () => {
  rejects((model) => { model.dossier.domain_taxonomy.identity_category = ['organizer', 'festival']; }, /identity category taxonomy/u);
});

test('top slot cardinality remains one Main identity', () => {
  rejects((model) => { model.dossier.slot_contract.top.maximum = 2; }, /top slot contract/u);
});

test('desktop cap-before-filter ordering cannot silently change', () => {
  rejects((model) => {
    model.dossier.ordering_and_overflow_contract.desktop_phase_order = ['filter_out_pill_kind', 'apply_visible_token_cap', 'select_main_top_token', 'emit_inline_remainder'];
  }, /desktop cap\/filter phase order/u);
});

test('pending page evidence cannot be declared reviewed', () => {
  rejects((model) => { model.dossier.evidence_contract.page_refs_pending_human_visual_review = 0; }, /page review counts/u);
});

test('MobileSearchBottomNav cannot be labeled dead', () => {
  rejects((model) => {
    model.lifecycles.find((record) => record.component_id === 'component.29e9aebbf63be827').reachability_status = 'dead';
  }, /fail-closed reachability/u);
});

test('MobileSearchBottomNav deletion and deprecation remain unauthorized', () => {
  rejects((model) => {
    const mobile = model.lifecycles.find((record) => record.component_id === 'component.29e9aebbf63be827');
    mobile.deletion_allowed = true;
    mobile.deprecation_allowed = true;
  }, /deletion authorization|mobile deprecation/u);
});

test('all three zero-consumer implementations require lifecycle records', () => {
  rejects((model) => { model.lifecycles.pop(); }, /exactly three records/u);
});

test('capability and compatibility-wrapper reachability remain separate', () => {
  rejects((model) => {
    model.capability.implementations.find((item) => item.component_id === 'component.29e9aebbf63be827').reachability_status = 'production_observed';
  }, /wrapper reachability/u);
});

test('deprecated source records remain preserved until deletion gates close', () => {
  rejects((model) => {
    model.lifecycles.find((record) => record.component_id === 'component.d65fb5ef1db02f46').preservation_required = false;
  }, /preservation/u);
});

test('medallion source binding drift fails closed', () => {
  rejects((model) => { model.dossier.source_authority.binding_ids = ['binding.invalid']; }, /medallion binding refs|mobile capability/u);
});

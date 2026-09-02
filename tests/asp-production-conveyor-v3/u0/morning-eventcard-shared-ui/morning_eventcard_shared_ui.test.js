'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const G = require('../../../../scripts/asp-production-conveyor-v3/u0/morning-eventcard-shared-ui/eventcard_text_profile_guard_r3.js');
const PROFILE = require('../../../../catalog/asp-production-conveyor-v3/u0/morning-eventcard-shared-ui/MAT-EVENTCARD-TEXT-R11C-MINIMAL-PROFILE-PROPOSAL-R3.json');
const ACCEPTANCE = require('../../../../catalog/asp-production-conveyor-v3/u0/morning-eventcard-shared-ui/U0-SHARED-UI-ANATOMY-STATE-ACCEPTANCE.v1.json');
const ATLAS = require('../../../../catalog/asp-production-conveyor-v3/u0/morning-eventcard-shared-ui/ASP_ATLAS_EXTENSION_HANDOFF_V1.json');

const args = () => ({
  authorityKind: 'O0',
  authorityReference: 'issue-57-comment-owner-or-o0-decision',
  issuedAtUtc: '2026-09-02T08:00:00Z',
  writerId: '/root/publish_r2',
  runId: 'run-eventcard-r11c-20260902',
  leaseToken: 'lease-eventcard-r11c',
  cancelToken: 'cancel-eventcard-r11c',
  currentRevision: 180,
  projectionSha256: 'aaf55dc4ee2f21c5ee1fcb7699fd36ef1ea9317368004752e460b14d06d2be82',
  singleUseNonce: 'single-use-r11c-20260902',
});

test('profile proposal is inert, bounded to four targets and sixteen protected offenders', () => {
  assert.equal(PROFILE.status, 'PROPOSAL_INACTIVE');
  assert.equal(PROFILE.applied, false);
  assert.equal(PROFILE.authority.this_proposal_authorizes_penpot_execution, false);
  assert.equal(PROFILE.targets.length, 4);
  assert.equal(PROFILE.protected_offenders.length, 16);
  assert.equal(PROFILE.lifecycle.execution_count, 1);
  assert.equal(PROFILE.lifecycle.next_operation, 'DISTINCT_LATER_READBACK');
});

test('only owner or O0 can create a 15-minute single-use activation receipt', () => {
  const receipt = G.createActivationReceipt(args());
  assert.equal(receipt.authorityKind, 'O0');
  assert.equal(Date.parse(receipt.expiresAtUtc) - Date.parse(receipt.issuedAtUtc), 900000);
  assert.equal(receipt.targetIds.length, 4);
  assert.equal(receipt.protectedIds.length, 16);
  assert.throws(() => G.createActivationReceipt({ ...args(), authorityKind: 'U0' }),
    (error) => error.code === 'TEXT_PROFILE_OWNER_OR_O0_AUTHORITY_REQUIRED');
});

test('profile automatically expires or fails on consumption, cancellation, revision or digest drift', () => {
  const receipt = G.createActivationReceipt(args());
  const state = {
    nowUtc: '2026-09-02T08:05:00Z',
    writerId: receipt.writerId,
    runId: receipt.runId,
    currentRevision: receipt.currentRevision,
    projectionSha256: receipt.projectionSha256,
  };
  assert.equal(G.assertProfileUsable(receipt, state), true);
  assert.throws(() => G.assertProfileUsable(receipt, { ...state, nowUtc: receipt.expiresAtUtc }),
    (error) => error.code === 'TEXT_PROFILE_EXPIRED');
  assert.throws(() => G.assertProfileUsable(receipt, { ...state, consumed: true }),
    (error) => error.code === 'TEXT_PROFILE_ALREADY_CONSUMED');
  assert.throws(() => G.assertProfileUsable(receipt, { ...state, currentRevision: 181 }),
    (error) => error.code === 'TEXT_PROFILE_STALE_REVISION');
  assert.throws(() => G.assertProfileUsable(receipt, { ...state, projectionSha256: '0'.repeat(64) }),
    (error) => error.code === 'TEXT_PROFILE_STALE_PROJECTION_SHA');
  const expired = G.expireAfterUnknownOutcome(receipt, 'timeout');
  assert.equal(expired.retryAllowed, false);
  assert.equal(expired.nextOperation, 'READ_ONLY_FOUR_TARGET_AND_COLLECTION_READBACK');
});

test('Free Shell exact anatomy/state tuple is accepted and Atlas order remains O0-only', () => {
  const value = ACCEPTANCE.free_shell;
  assert.equal(value.head, '60ff5406bd4654d8b1961a6fa9ea3e766cb76dab');
  assert.deepEqual(value.anatomy_state_contract, { pages: 1, component_masters: 7, linked_visible_specimens: 6, second_run_created: 0 });
  assert.equal(value.product_acceptance, 'PASS');
  assert.equal(value.non_regression.detached, 0);
});

test('Recovered Cards exact five-family/23-state tuple is accepted without EventCard clones', () => {
  const value = ACCEPTANCE.recovered_cards;
  assert.equal(value.head, '3f8e54e9d39fb8489877e4df5fc2decfab7c88d6');
  assert.equal(value.anatomy_state_contract.pages, 5);
  assert.equal(value.anatomy_state_contract.component_masters, 5);
  assert.equal(value.anatomy_state_contract.linked_visible_specimens, 23);
  assert.equal(value.non_regression.eventcard_clones, 0);
});

test('Shared Patterns product anatomy from d139 is accepted only with the 6c049 projection repair for execution', () => {
  const value = ACCEPTANCE.shared_patterns;
  assert.equal(value.requested_input_head, 'd139adac27c96041026f70e12daad2fa9728fcc0');
  assert.equal(value.execution_head, '6c0496874764b3019cdaafcac53ed330664f323e');
  assert.equal(value.exact_parent, value.requested_input_head);
  assert.equal(value.anatomy_state_contract.pages, 6);
  assert.equal(value.anatomy_state_contract.component_masters, 7);
  assert.equal(value.anatomy_state_contract.linked_visible_specimens, 21);
  assert.equal(value.non_regression.mock_private_projection, false);
});

test('Atlas handoff contains exactly three accepted packages and assigns no page order', () => {
  assert.equal(ATLAS.to, 'O0_ATLAS_EXTENSION');
  assert.equal(ATLAS.packages.length, 3);
  assert.equal(ATLAS.page_order_assignment, 'O0_ONLY');
  assert.equal(ATLAS.u0_decisions.atlas_page_order, 'NOT_ASSIGNED');
  assert.equal(ATLAS.u0_decisions.penpot_mutations, 0);
});

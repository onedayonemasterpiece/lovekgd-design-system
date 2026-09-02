'use strict';

const crypto = require('node:crypto');
const PROFILE_ID = 'free-collection.eventcard-r11c-four-targets.single-use.v1';
const PACKAGE_ID = 'MAT-EVENTCARD-TEXT-R11C-MINIMAL-PROFILE-PROPOSAL-R3';
const TARGET_IDS = Object.freeze([
  '313fb1ed-0d5c-8095-8008-912c46b9ecba',
  '313fb1ed-0d5c-8095-8008-914c77b9c576',
  '313fb1ed-0d5c-8095-8008-916b3552cb12',
  '313fb1ed-0d5c-8095-8008-916bd1ff0eb3',
]);
const PROTECTED_IDS = Object.freeze([
  '313fb1ed-0d5c-8095-8008-912d41586b13',
  '313fb1ed-0d5c-8095-8008-912d4fa0afe5',
  '313fb1ed-0d5c-8095-8008-912d500a695a',
  '313fb1ed-0d5c-8095-8008-912d506e9dba',
  '313fb1ed-0d5c-8095-8008-914c77dfcf31',
  '313fb1ed-0d5c-8095-8008-916afac06e71',
  '313fb1ed-0d5c-8095-8008-916b0aa7e2a6',
  '313fb1ed-0d5c-8095-8008-916b0af29b13',
  '313fb1ed-0d5c-8095-8008-916b376e6f1c',
  '313fb1ed-0d5c-8095-8008-916baef0312c',
  '313fb1ed-0d5c-8095-8008-916baf75cc83',
  '313fb1ed-0d5c-8095-8008-916bafe5eea9',
  '313fb1ed-0d5c-8095-8008-916bd231c7cd',
  '313fb1ed-0d5c-8095-8008-916bd4d215df',
  '313fb1ed-0d5c-8095-8008-916be6eddba1',
  '313fb1ed-0d5c-8095-8008-916be7436f37',
]);
class ProfileStop extends Error {
  constructor(code) { super(code); this.code = code; this.retryAllowed = false; }
}
const fail = (code) => { throw new ProfileStop(code); };
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
const sha256 = (value) => crypto.createHash('sha256').update(canonical(value)).digest('hex');

function createActivationReceipt({
  authorityKind, authorityReference, issuedAtUtc, writerId, runId, leaseToken, cancelToken,
  currentRevision, projectionSha256, singleUseNonce,
}) {
  if (!['OWNER', 'O0'].includes(authorityKind) || typeof authorityReference !== 'string' || !authorityReference) {
    fail('TEXT_PROFILE_OWNER_OR_O0_AUTHORITY_REQUIRED');
  }
  const issuedMs = Date.parse(issuedAtUtc);
  if (!Number.isFinite(issuedMs)) fail('TEXT_PROFILE_ISSUED_AT_INVALID');
  if (!Number.isInteger(currentRevision) || !/^[0-9a-f]{64}$/.test(projectionSha256 || '')) {
    fail('TEXT_PROFILE_NATIVE_TUPLE_INVALID');
  }
  for (const value of [writerId, runId, leaseToken, cancelToken, singleUseNonce]) {
    if (typeof value !== 'string' || value.length < 8) fail('TEXT_PROFILE_CONTROL_FIELD_INVALID');
  }
  const expiresAtUtc = new Date(issuedMs + 900_000).toISOString();
  const payload = {
    schema: 'kenigevents.eventcard-r11c-profile-activation-receipt.v1',
    profileId: PROFILE_ID,
    packageId: PACKAGE_ID,
    authorityKind,
    authorityReference,
    issuedAtUtc: new Date(issuedMs).toISOString(),
    expiresAtUtc,
    writerId,
    runId,
    leaseToken,
    cancelToken,
    currentRevision,
    projectionSha256,
    targetIds: TARGET_IDS,
    protectedIds: PROTECTED_IDS,
    singleUseNonce,
    status: 'ACTIVE_SINGLE_USE',
    executionCountRemaining: 1,
    nextOperationAfterExecution: 'DISTINCT_LATER_READBACK',
    allowedToMutatePenpot: true,
  };
  return { ...payload, receiptSha256: sha256(payload) };
}

function assertProfileUsable(receipt, {
  nowUtc, writerId, runId, currentRevision, projectionSha256, consumed = false, cancelled = false,
}) {
  if (!receipt || receipt.profileId !== PROFILE_ID || receipt.packageId !== PACKAGE_ID ||
      receipt.status !== 'ACTIVE_SINGLE_USE' || receipt.allowedToMutatePenpot !== true) {
    fail('TEXT_PROFILE_NOT_ACTIVE');
  }
  const now = Date.parse(nowUtc);
  if (!Number.isFinite(now) || now >= Date.parse(receipt.expiresAtUtc)) fail('TEXT_PROFILE_EXPIRED');
  if (consumed) fail('TEXT_PROFILE_ALREADY_CONSUMED');
  if (cancelled) fail('TEXT_PROFILE_CANCELLED');
  if (writerId !== receipt.writerId || runId !== receipt.runId) fail('TEXT_PROFILE_WRITER_OR_RUN_DRIFT');
  if (currentRevision !== receipt.currentRevision) fail('TEXT_PROFILE_STALE_REVISION');
  if (projectionSha256 !== receipt.projectionSha256) fail('TEXT_PROFILE_STALE_PROJECTION_SHA');
  return true;
}

function expireAfterUnknownOutcome(receipt, reason) {
  if (!receipt || typeof reason !== 'string' || !reason) fail('TEXT_PROFILE_UNKNOWN_OUTCOME_REASON_REQUIRED');
  return {
    profileId: PROFILE_ID,
    activationReceiptSha256: receipt.receiptSha256,
    status: 'EXPIRED_UNKNOWN_OUTCOME_READBACK_REQUIRED',
    reason,
    retryAllowed: false,
    nextOperation: 'READ_ONLY_FOUR_TARGET_AND_COLLECTION_READBACK',
  };
}

module.exports = {
  PROFILE_ID, PACKAGE_ID, TARGET_IDS, PROTECTED_IDS, ProfileStop, canonical, sha256,
  createActivationReceipt, assertProfileUsable, expireAfterUnknownOutcome,
};

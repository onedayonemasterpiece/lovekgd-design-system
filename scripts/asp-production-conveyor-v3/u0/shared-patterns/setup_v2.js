'use strict';

const successor = require('../../../../catalog/asp-production-conveyor-v3/u0/shared-patterns/U-SHARED-PATTERNS.native-successor.v2.json');
const predecessor = require('../../../../catalog/asp-production-conveyor-v3/u0/shared-patterns/U-SHARED-PATTERNS.package.v1.json');
const productContract = require('../../../../catalog/asp-production-conveyor-v3/u0/shared-patterns/product-contract.v1.json');
const nativeContract = require('../../../../catalog/asp-production-conveyor-v3/u0/shared-patterns/native-product-contract.v2.json');
const { assertActiveLease, sha256, stableStringify, validateSuccessor } = require('./native_runtime_v2');

async function setupNativeSuccessor({ storage, lease }) {
  if (!storage || typeof storage.set !== 'function') throw new TypeError('STORAGE_SET_REQUIRED');
  assertActiveLease(lease, 'setup-entry');
  const errors = validateSuccessor(successor, predecessor, productContract, nativeContract);
  if (errors.length) throw new Error(`SUCCESSOR_VALIDATION_FAILED:${errors.join('|')}`);
  const registration = {
    schema_version: 'kenigevents.u0-native-successor-registration.v2',
    package_id: successor.package_id,
    successor_id: successor.successor_id,
    successor_sha256: sha256(stableStringify(successor)),
    native_contract_sha256: sha256(stableStringify(nativeContract)),
    atlas_extension_request_blob: successor.atlas_extension_request.git_blob_sha1,
    status: successor.status,
    penpot_execution_authorized: false,
    publish_authorized: false,
  };
  await storage.set(`package:${successor.successor_id}`, registration);
  assertActiveLease(lease, 'setup-exit');
  return registration;
}

module.exports = { nativeContract, predecessor, productContract, setupNativeSuccessor, successor };

'use strict';

const crypto = require('node:crypto');
const packageDefinition = require('../../../../catalog/asp-production-conveyor-v3/u0/free-shell-review/U-FREE-SHELL-REVIEW-PAGE-R1.package.v2.json');
const { canonical } = require('./native_runtime_v2');

async function setupPackage({ storage, lease }) {
  if (!storage || typeof storage.set !== 'function') throw new TypeError('STORAGE_SET_REQUIRED');
  if (!lease || lease.active !== true || lease.cancelled === true) throw new Error('LEASE_NOT_ACTIVE:setup');
  const packageSha256 = crypto.createHash('sha256').update(canonical(packageDefinition)).digest('hex');
  const registration = {
    package_id: packageDefinition.package_id,
    successor: 'R2',
    package_sha256: packageSha256,
    executor: packageDefinition.execution.executor,
    penpot_execution_authorized: false,
    atlas_page_order_assigned: false,
  };
  await storage.set(`package:${packageDefinition.package_id}:R2`, registration);
  if (!lease || lease.active !== true || lease.cancelled === true) throw new Error('LEASE_NOT_ACTIVE:setup-after');
  return registration;
}

module.exports = { packageDefinition, setupPackage };

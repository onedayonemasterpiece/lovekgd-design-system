'use strict';

const crypto = require('node:crypto');
const packageDefinition = require('./../../../../catalog/asp-production-conveyor-v3/u0/recovered-card-families/U-RECOVERED-CARD-FAMILIES.package.v1.json');

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

async function setupPackage({ storage, lease }) {
  if (!storage || typeof storage.set !== 'function') throw new TypeError('STORAGE_SET_REQUIRED');
  if (!lease || lease.active !== true || lease.cancelled === true) throw new Error('LEASE_NOT_ACTIVE:setup');
  const canonical = stableStringify(packageDefinition);
  const digest = crypto.createHash('sha256').update(canonical).digest('hex');
  const registration = {
    package_id: packageDefinition.package_id,
    schema_version: packageDefinition.schema_version,
    package_sha256: digest,
    page_units: packageDefinition.page_units.map((unit) => unit.unit_id),
    penpot_execution_authorized: false,
  };
  await storage.set(`package:${packageDefinition.package_id}`, registration);
  if (!lease || lease.active !== true || lease.cancelled === true) throw new Error('LEASE_NOT_ACTIVE:setup-after');
  return registration;
}

module.exports = { packageDefinition, setupPackage, stableStringify };

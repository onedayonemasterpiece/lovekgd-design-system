'use strict';

const { canonical, sha256 } = require('./native_runtime_v2');
const packageDefinition = require('./../../../../catalog/asp-production-conveyor-v3/u0/recovered-card-families/U-RECOVERED-CARD-FAMILIES.package.v2.json');

async function setupPackage({ storage, lease }) {
  if (!storage || typeof storage.set !== 'function') throw new TypeError('STORAGE_SET_REQUIRED');
  if (!lease || lease.active !== true || lease.cancelled === true) throw new Error('LEASE_NOT_ACTIVE:setup');
  const receipt = {
    schema_version: 'kenigevents.u0-native-setup-receipt.v2',
    package_id: packageDefinition.package_id,
    package_sha256: sha256(canonical(packageDefinition)),
    source_head: packageDefinition.source_authority.head,
    source_tree: packageDefinition.source_authority.tree,
    page_units: packageDefinition.page_units.map((unit) => unit.unit_id),
    penpot_execution_authorized: false,
    atlas_page_order_assigned: false,
  };
  await storage.set(`package:${packageDefinition.package_id}:v2`, receipt);
  if (!lease || lease.active !== true || lease.cancelled === true) throw new Error('LEASE_NOT_ACTIVE:setup-after');
  return receipt;
}

module.exports = { canonical, packageDefinition, setupPackage };

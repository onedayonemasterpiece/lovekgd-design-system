'use strict';

const crypto = require('node:crypto');

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function deterministicId(namespace, key) {
  const digest = crypto.createHash('sha256').update(`${namespace}\0${key}`).digest('hex');
  return `${namespace}-${digest.slice(0, 8)}-${digest.slice(8, 12)}-${digest.slice(12, 16)}-${digest.slice(16, 28)}`;
}

function assertActiveLease(lease, boundary) {
  if (!lease || lease.active !== true || lease.cancelled === true) {
    const error = new Error(`LEASE_NOT_ACTIVE:${boundary}`);
    error.code = 'LEASE_NOT_ACTIVE';
    throw error;
  }
}

async function guardedEnsure({ penpot, lease, record }) {
  assertActiveLease(lease, `before:${record.key}`);
  const result = await penpot.ensure(record);
  assertActiveLease(lease, `after:${record.key}`);
  return result;
}

function validatePackage(pkg) {
  const errors = [];
  if (!pkg || typeof pkg !== 'object') errors.push('PACKAGE_OBJECT_REQUIRED');
  if (pkg?.owner !== 'U0') errors.push('OWNER_MUST_BE_U0');
  if (!Array.isArray(pkg?.page_units) || pkg.page_units.length === 0) errors.push('PAGE_UNITS_REQUIRED');
  for (const unit of pkg?.page_units || []) {
    if (!unit.unit_id || !unit.page_name || !unit.root_name) errors.push(`PAGE_IDENTITY_REQUIRED:${unit.unit_id || 'unknown'}`);
    if (!Array.isArray(unit.components) || unit.components.length === 0) errors.push(`COMPONENTS_REQUIRED:${unit.unit_id}`);
    if (!Array.isArray(unit.specimens) || unit.specimens.length === 0) errors.push(`SPECIMENS_REQUIRED:${unit.unit_id}`);
    const componentIds = new Set(unit.components.map((item) => item.component_id));
    for (const specimen of unit.specimens) {
      for (const componentId of specimen.component_ids || []) {
        if (!componentIds.has(componentId)) errors.push(`UNKNOWN_SPECIMEN_COMPONENT:${unit.unit_id}:${componentId}`);
      }
    }
    const managed = 1 + unit.components.length + unit.specimens.length;
    if (managed > 30) errors.push(`MANAGED_NODE_LIMIT:${unit.unit_id}:${managed}`);
    if (managed !== unit.managed_nodes_expected) errors.push(`MANAGED_NODE_CENSUS_MISMATCH:${unit.unit_id}:${managed}:${unit.managed_nodes_expected}`);
  }
  const serialized = stableStringify(pkg).toLowerCase();
  for (const banned of ['detached-copy', 'screenshot-shape', 'raster-substitute', 'old-penpot-uuid']) {
    if (serialized.includes(banned)) errors.push(`BANNED_IMPLEMENTATION:${banned}`);
  }
  return errors;
}

async function runExecutablePackage({ penpot, storage, lease, packageDefinition }) {
  if (!penpot || typeof penpot.ensure !== 'function') throw new TypeError('PENPOT_ADAPTER_ENSURE_REQUIRED');
  if (!storage || typeof storage.set !== 'function') throw new TypeError('STORAGE_SET_REQUIRED');
  assertActiveLease(lease, 'entry');
  const validation = validatePackage(packageDefinition);
  if (validation.length) {
    const error = new Error(`PACKAGE_VALIDATION_FAILED:${validation.join('|')}`);
    error.code = 'PACKAGE_VALIDATION_FAILED';
    error.validation = validation;
    throw error;
  }

  const createdKeys = [];
  const existingKeys = [];
  const pageCensus = [];
  const namespace = packageDefinition.package_id.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  for (const unit of packageDefinition.page_units) {
    const pageKey = `page:${unit.unit_id}`;
    const pageId = deterministicId(namespace, pageKey);
    const pageResult = await guardedEnsure({
      penpot,
      lease,
      record: {
        id: pageId,
        key: pageKey,
        kind: 'page',
        name: unit.page_name,
        package_id: packageDefinition.package_id,
        unit_id: unit.unit_id,
      },
    });
    (pageResult.created ? createdKeys : existingKeys).push(pageKey);

    const rootKey = `root:${unit.unit_id}`;
    const rootId = deterministicId(namespace, rootKey);
    const rootResult = await guardedEnsure({
      penpot,
      lease,
      record: {
        id: rootId,
        key: rootKey,
        kind: 'root',
        name: unit.root_name,
        page_id: pageId,
        package_id: packageDefinition.package_id,
        unit_id: unit.unit_id,
      },
    });
    (rootResult.created ? createdKeys : existingKeys).push(rootKey);

    const masterIds = new Map();
    for (const component of unit.components) {
      const key = `component:${unit.unit_id}:${component.component_id}`;
      const id = deterministicId(namespace, key);
      const result = await guardedEnsure({
        penpot,
        lease,
        record: {
          id,
          key,
          kind: 'component-master',
          name: component.component_id,
          page_id: pageId,
          root_id: rootId,
          package_id: packageDefinition.package_id,
          unit_id: unit.unit_id,
          anatomy: component.anatomy,
          states: component.states,
          responsive_behavior: component.responsive_behavior,
          dependencies: component.dependencies || [],
          source_consumers: component.source_consumers || [],
        },
      });
      masterIds.set(component.component_id, id);
      (result.created ? createdKeys : existingKeys).push(key);
    }

    for (const specimen of unit.specimens) {
      const key = `specimen:${unit.unit_id}:${specimen.specimen_id}`;
      const id = deterministicId(namespace, key);
      const linkedMasterIds = (specimen.component_ids || []).map((componentId) => masterIds.get(componentId));
      const result = await guardedEnsure({
        penpot,
        lease,
        record: {
          id,
          key,
          kind: 'linked-review-specimen',
          name: specimen.specimen_id,
          page_id: pageId,
          root_id: rootId,
          package_id: packageDefinition.package_id,
          unit_id: unit.unit_id,
          component_ids: specimen.component_ids,
          linked_master_ids: linkedMasterIds,
          state: specimen.state,
          viewport: specimen.viewport,
          acceptance: specimen.acceptance,
          detached: false,
          screenshot: false,
          substitute: false,
        },
      });
      (result.created ? createdKeys : existingKeys).push(key);
    }

    pageCensus.push({
      unit_id: unit.unit_id,
      page_id: pageId,
      root_id: rootId,
      masters: unit.components.length,
      linked_specimens: unit.specimens.length,
      managed_nodes: 1 + unit.components.length + unit.specimens.length,
    });
  }

  assertActiveLease(lease, 'before-receipt');
  const receipt = {
    schema_version: 'kenigevents.u0-native-executor-receipt.v1',
    package_id: packageDefinition.package_id,
    created: createdKeys.length,
    existing: existingKeys.length,
    created_keys: createdKeys,
    existing_keys: existingKeys,
    page_census: pageCensus,
    maximum_managed_nodes: Math.max(...pageCensus.map((item) => item.managed_nodes)),
    detached_instances: 0,
    screenshot_shapes: 0,
    substitutes: 0,
    validation: [],
    penpot_service_invoked: false,
  };
  await storage.set(`receipt:${packageDefinition.package_id}`, receipt);
  assertActiveLease(lease, 'after-receipt');
  return receipt;
}

class MemoryPenpotAdapter {
  constructor(seed) {
    this.records = new Map(seed ? seed.map((record) => [record.key, structuredClone(record)]) : []);
  }

  async ensure(record) {
    const existing = this.records.get(record.key);
    if (!existing) {
      this.records.set(record.key, structuredClone(record));
      return { created: true, id: record.id };
    }
    if (stableStringify(existing) !== stableStringify(record)) {
      const error = new Error(`IDENTITY_CONFLICT:${record.key}`);
      error.code = 'IDENTITY_CONFLICT';
      throw error;
    }
    return { created: false, id: existing.id };
  }

  snapshot() {
    return [...this.records.values()].sort((left, right) => left.key.localeCompare(right.key));
  }
}

class MemoryStorage {
  constructor() { this.values = new Map(); }
  async set(key, value) { this.values.set(key, structuredClone(value)); }
  get(key) { return this.values.get(key); }
}

module.exports = {
  MemoryPenpotAdapter,
  MemoryStorage,
  assertActiveLease,
  deterministicId,
  runExecutablePackage,
  stableStringify,
  validatePackage,
};

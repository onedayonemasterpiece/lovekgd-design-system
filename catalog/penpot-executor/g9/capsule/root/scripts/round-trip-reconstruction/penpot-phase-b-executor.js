'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { executeMaterialization } = require('./materialization-execution-kernel.js');
const { PenpotNativeAdapter } = require('./penpot-native-adapter.js');

const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const BUNDLE_PATH = 'catalog/materialization-bundles/eventcard-free-slice.g4.ready-v1.json';
const TARGET_PATH = 'runtime/runtime-target-capsule.json';
const CONTROL_PATH = 'runtime/accepted-bundle-control.g9.json';
const REUSE_PATH = 'runtime/executor-reuse-bindings.g9.json';

function fail(code) { const error = new Error(code); error.code = code; throw error; }
function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  return value;
}
const canonicalJson = (value) => `${JSON.stringify(canonicalize(value))}\n`;

function verifyCapsule(capsuleDirectory) {
  const manifestPath = path.join(capsuleDirectory, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath));
  if (manifest.schema !== 'kenigevents.penpot-execution-capsule-manifest.v1' || manifest.generation !== 9) fail('CAPSULE_MANIFEST_INVALID');
  const actualContentHash = sha256(canonicalJson({ ...manifest, content_sha256: null }));
  if (manifest.content_sha256 !== actualContentHash) fail('CAPSULE_MANIFEST_HASH_MISMATCH');
  const root = path.join(capsuleDirectory, 'root');
  for (const entry of manifest.entries) {
    const absolute = path.resolve(root, entry.path);
    if (!absolute.startsWith(`${path.resolve(root)}${path.sep}`)) fail('CAPSULE_PATH_ESCAPE');
    const bytes = fs.readFileSync(absolute);
    if (bytes.length !== entry.bytes || sha256(bytes) !== entry.sha256) fail(`CAPSULE_ENTRY_HASH_MISMATCH:${entry.path}`);
  }
  return { manifest, root };
}

class NativeLeaseStore {
  constructor(nativeApi, bindingId) { this.nativeApi = nativeApi; this.bindingId = bindingId; }
  async acquire(key, identity) { return this.nativeApi.acquireRunLease(this.bindingId, key, identity); }
  async validate(key, identity) { return this.nativeApi.validateRunLease(this.bindingId, key, identity); }
  async release(key, identity) { return this.nativeApi.releaseRunLease(this.bindingId, key, identity); }
}
class NativeCancellationProvider {
  constructor(nativeApi) { this.nativeApi = nativeApi; }
  async read(bindingId) { return this.nativeApi.readExecutionControl(bindingId); }
}

async function runPenpotPhaseB({ capsuleDirectory, nativeApi, runId, materializerSha256, now }) {
  if (!nativeApi) fail('NATIVE_API_REQUIRED');
  for (const method of ['acquireRunLease', 'validateRunLease', 'releaseRunLease', 'readExecutionControl']) {
    if (typeof nativeApi[method] !== 'function') fail(`NATIVE_RUNTIME_${method.toUpperCase()}_MISSING`);
  }
  const { manifest, root } = verifyCapsule(capsuleDirectory);
  const control = JSON.parse(fs.readFileSync(path.join(root, CONTROL_PATH)));
  if (control.generation !== 9 || control.status !== 'ACTIVE') fail('CAPSULE_CONTROL_NOT_ACTIVE_G9');
  const adapter = new PenpotNativeAdapter(nativeApi);
  const leaseStore = new NativeLeaseStore(nativeApi, control.lease.binding_id);
  const cancellationProvider = new NativeCancellationProvider(nativeApi);
  return executeMaterialization({
    root,
    bundlePath: BUNDLE_PATH,
    targetManifestPath: path.join(root, TARGET_PATH),
    controlPath: path.join(root, CONTROL_PATH),
    reuseMapPath: path.join(root, REUSE_PATH),
    mode: 'production',
    runId,
    materializerSha256,
    adapter,
    leaseStore,
    cancellationProvider,
    now,
    capsuleManifestSha256: manifest.content_sha256,
  });
}

module.exports = { BUNDLE_PATH, CONTROL_PATH, NativeCancellationProvider, NativeLeaseStore, REUSE_PATH, TARGET_PATH, runPenpotPhaseB, verifyCapsule };

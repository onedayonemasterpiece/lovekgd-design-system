#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import vm from 'node:vm';

const SCHEMA = 'D0_PLUGIN_BUNDLE_V1';
const SHA_RE = /^[0-9a-f]{64}$/u;
const IDENT_RE = /^[A-Za-z_$][\w$]*$/u;
const MAX_DRIVE_PHASES = 2048;

function invariant(value, code) {
  if (!value) throw new Error(code);
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function parseArgs(argv) {
  const args = { selfTest: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--self-test') args.selfTest = true;
    else if (token === '--bundle') args.bundle = argv[++i];
    else if (token === '--sha256') args.expectedSha256 = argv[++i];
    else if (token === '--global') args.globalName = argv[++i];
    else throw new Error(`UNKNOWN_ARGUMENT:${token}`);
  }
  return args;
}

function stripCommentsAndLiterals(source) {
  let output = '';
  let index = 0;
  let state = 'code';
  let quote = '';
  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1] || '';
    if (state === 'code') {
      if (char === '/' && next === '/') {
        output += '  ';
        index += 2;
        state = 'line-comment';
      } else if (char === '/' && next === '*') {
        output += '  ';
        index += 2;
        state = 'block-comment';
      } else if (char === '"' || char === "'" || char === '`') {
        quote = char;
        output += ' ';
        index += 1;
        state = 'literal';
      } else {
        output += char;
        index += 1;
      }
      continue;
    }
    if (state === 'line-comment') {
      output += char === '\n' ? '\n' : ' ';
      index += 1;
      if (char === '\n') state = 'code';
      continue;
    }
    if (state === 'block-comment') {
      if (char === '*' && next === '/') {
        output += '  ';
        index += 2;
        state = 'code';
      } else {
        output += char === '\n' ? '\n' : ' ';
        index += 1;
      }
      continue;
    }
    if (char === '\\') {
      output += '  ';
      index += Math.min(2, source.length - index);
    } else if (char === quote) {
      output += ' ';
      index += 1;
      state = 'code';
    } else {
      output += char === '\n' ? '\n' : ' ';
      index += 1;
    }
  }
  invariant(state !== 'block-comment', 'UNTERMINATED_BLOCK_COMMENT');
  invariant(state !== 'literal', 'UNTERMINATED_LITERAL');
  return output;
}

function staticGate(source, bundlePath) {
  invariant(bundlePath.endsWith('.js'), 'BUNDLE_MUST_BE_SINGLE_DOT_JS_ARTIFACT');
  invariant(source.trim().length > 0, 'BUNDLE_EMPTY');
  invariant(!/^#!.*$/mu.test(source), 'BUNDLE_SHEBANG_FORBIDDEN');
  invariant(!/\/\/[#@]\s*sourceMappingURL\s*=\s*(?!data:)/u.test(source), 'EXTERNAL_SOURCE_MAP_FORBIDDEN');

  const code = stripCommentsAndLiterals(source);
  for (const name of ['require', 'module', 'exports', 'process', 'Buffer']) {
    invariant(!new RegExp(`\\b${name}\\b`, 'u').test(code), `FORBIDDEN_RUNTIME_IDENTIFIER:${name}`);
  }
  invariant(!/\bimport\b/u.test(code), 'FORBIDDEN_RUNTIME_IMPORT');
  invariant(!/\b(?:readFile|readFileSync|writeFile|writeFileSync|readdir|readdirSync|createReadStream|createWriteStream)\b/u.test(code), 'FORBIDDEN_FILESYSTEM_API');
  invariant(!/(?:node:fs|node:crypto|node:path|from\s*["'](?:node:)?fs|import\s*\()/u.test(source), 'FORBIDDEN_RUNTIME_MODULE_OR_FILESYSTEM');
  invariant(!/\b(?:eval|Function)\s*\(/u.test(code), 'DYNAMIC_CODE_FORBIDDEN');
  invariant(!/\breadNativeCoverage\b/u.test(code), 'UNAVAILABLE_CALLER_HELPER:readNativeCoverage');
  invariant(!/\b__d0BundleConformance\b/u.test(code), 'CONFORMANCE_AUTHORIZATION_BYPASS_FORBIDDEN');
  invariant(!/\bstructuredClone\s*\(/u.test(code), 'NATIVE_STRUCTURED_CLONE_FORBIDDEN');
}

function pluginNode(id, type = 'shape') {
  const data = new Map();
  return {
    id,
    type,
    children: [],
    parent: null,
    appendChild(child) {
      child.parent = this;
      this.children.push(child);
      return child;
    },
    setSharedPluginData(namespace, key, value) {
      invariant(typeof namespace === 'string' && namespace.length > 0, 'PLUGIN_NAMESPACE_NOT_STRING');
      invariant(typeof key === 'string' && key.length > 0, 'PLUGIN_KEY_NOT_STRING');
      invariant(typeof value === 'string', `PLUGIN_DATA_NOT_STRING:${typeof value}`);
      data.set(`${namespace}\u0000${key}`, value);
    },
    getSharedPluginData(namespace, key) {
      return data.get(`${namespace}\u0000${key}`) || '';
    },
  };
}

function buildInstrumentedPenpot() {
  const audit = {
    creates: 0,
    createEvents: [],
    openPageCalls: 0,
    pluginStringWrites: 0,
    rejectedPluginWrites: 0,
    currentFilePluginReads: 0,
    currentFilePluginWrites: 0,
    currentFilePluginWriteEvents: [],
    nativeSetterCalls: 0,
    saveVersionOverrideAttempts: 0,
  };
  let sequence = 0;
  const pages = [];
  const currentFilePluginData = new Map();
  const currentFile = {
    id: 'd0-conformance-file',
    revn: 1,
    pages,
    validate: () => [],
    findVersions: async () => [],
  };
  const nativeSetSharedPluginData = (namespace, key, value) => {
    invariant(typeof namespace === 'string' && namespace.length > 0, 'FILE_PLUGIN_NAMESPACE_NOT_STRING');
    invariant(typeof key === 'string' && key.length > 0, 'FILE_PLUGIN_KEY_NOT_STRING');
    invariant(typeof value === 'string', `FILE_PLUGIN_DATA_NOT_STRING:${typeof value}`);
    currentFilePluginData.set(`${namespace}\u0000${key}`, value);
    audit.currentFilePluginWrites += 1;
    audit.currentFilePluginWriteEvents.push({ namespace, key, value, value_sha256: sha256(Buffer.from(value, 'utf8')) });
  };
  const nativeGetSharedPluginData = (namespace, key) => {
    audit.currentFilePluginReads += 1;
    return currentFilePluginData.get(`${namespace}\u0000${key}`) || '';
  };
  const saveVersionTrap = async () => invariant(false, 'ORCHESTRATOR_SAVE_VERSION_CALL_FORBIDDEN');
  for (const [name, nativeMethod] of [
    ['setSharedPluginData', nativeSetSharedPluginData],
    ['getSharedPluginData', nativeGetSharedPluginData],
  ]) {
    Object.defineProperty(currentFile, name, {
      configurable: false,
      enumerable: true,
      get: () => nativeMethod,
      set: () => {},
    });
  }
  Object.defineProperty(currentFile, 'saveVersion', {
    configurable: false,
    enumerable: true,
    get: () => saveVersionTrap,
    set: () => { audit.saveVersionOverrideAttempts += 1; },
  });
  // Penpot's native file API exposes `revn`. A writable `revision` alias made
  // stale test doubles pass while the same bundle failed in the sole writer.
  // Keep the alias deletable for bundles that defensively remove it, but fail
  // closed if a conformance host tries to manufacture it.
  Object.defineProperty(currentFile, 'revision', {
    configurable: true,
    enumerable: false,
    get: () => undefined,
    set: () => invariant(false, 'NATIVE_REVISION_ALIAS_FORBIDDEN'),
  });
  const penpot = {
    currentPage: null,
    currentFile,
    library: { local: { components: [] } },
    selection: [],
    async openPage(page) {
      invariant(page && pages.includes(page), 'OPEN_PAGE_NOT_IN_CURRENT_FILE');
      this.currentPage = page;
      audit.openPageCalls += 1;
    },
    createPage() {
      const page = pluginNode(`page-${++sequence}`, 'page');
      page.name = '';
      page.root = pluginNode(`root-${sequence}`, 'root');
      pages.push(page);
      audit.creates += 1;
      audit.createEvents.push({ kind: 'page', current_page_id: this.currentPage?.id || null });
      return page;
    },
    __seedPage(id = `seed-page-${++sequence}`) {
      const page = pluginNode(id, 'page');
      page.name = id;
      page.root = pluginNode(`${id}-root`, 'root');
      pages.push(page);
      return page;
    },
  };

  const createOnCurrentPage = (kind) => (...args) => {
    invariant(penpot.currentPage && pages.includes(penpot.currentPage), `CREATE_WITHOUT_CURRENT_PAGE:${kind}`);
    const node = pluginNode(`${kind}-${++sequence}`, kind);
    audit.creates += 1;
    audit.createEvents.push({ kind, current_page_id: penpot.currentPage.id });
    if (kind === 'text') node.characters = String(args[0] ?? '');
    return node;
  };
  for (const kind of ['Board', 'Rectangle', 'Ellipse', 'Text', 'ShapeFromSvg']) {
    penpot[`create${kind}`] = createOnCurrentPage(kind.toLowerCase());
  }
  penpot.uploadMediaData = async (...args) => createOnCurrentPage('media')(...args);

  const originalNode = pluginNode;
  const observePluginWrites = (node) => {
    const original = node.setSharedPluginData.bind(node);
    node.setSharedPluginData = (namespace, key, value) => {
      try {
        original(namespace, key, value);
        audit.pluginStringWrites += 1;
      } catch (error) {
        audit.rejectedPluginWrites += 1;
        throw error;
      }
    };
    return node;
  };
  const rawSeed = penpot.__seedPage.bind(penpot);
  penpot.__seedPage = (id) => {
    const page = observePluginWrites(rawSeed(id));
    page.root = observePluginWrites(page.root);
    return page;
  };
  const rawCreatePage = penpot.createPage.bind(penpot);
  penpot.createPage = () => {
    const page = observePluginWrites(rawCreatePage());
    page.root = observePluginWrites(page.root);
    return page;
  };
  for (const name of Object.keys(penpot).filter((key) => /^create(?:Board|Rectangle|Ellipse|Text|ShapeFromSvg)$/u.test(key))) {
    const original = penpot[name].bind(penpot);
    penpot[name] = (...args) => observePluginWrites(original(...args));
  }
  const rawUpload = penpot.uploadMediaData.bind(penpot);
  penpot.uploadMediaData = async (...args) => observePluginWrites(await rawUpload(...args));

  return { penpot, audit, pluginNode: (id, type) => observePluginWrites(originalNode(id, type)) };
}

function assertMetadata(bundle, globalName) {
  invariant(bundle && typeof bundle === 'object', `GLOBAL_OBJECT_MISSING:${globalName}`);
  const metadata = bundle.metadata;
  invariant(metadata && metadata.schema === SCHEMA, 'METADATA_SCHEMA');
  invariant(typeof metadata.package_id === 'string' && metadata.package_id.length > 0, 'METADATA_PACKAGE_ID');
  invariant(metadata.bundle_sha256_binding === 'EXTERNAL_AUTHORIZATION_TUPLE', 'METADATA_SHA_BINDING');
  invariant(metadata.current_page_activation === true, 'METADATA_CURRENT_PAGE_ACTIVATION');
  invariant(metadata.max_creates_per_phase === 3, 'METADATA_MAX_CREATES');
  invariant(metadata.replay_created === 0, 'METADATA_REPLAY_CREATED');
  invariant(metadata.entrypoints && typeof metadata.entrypoints === 'object', 'METADATA_ENTRYPOINTS');
  const methods = {};
  for (const role of ['projection', 'execution', 'settlement']) {
    const name = metadata.entrypoints[role];
    invariant(typeof name === 'string' && IDENT_RE.test(name), `ENTRYPOINT_NAME:${role}`);
    invariant(typeof bundle[name] === 'function', `ENTRYPOINT_NOT_CALLABLE:${role}:${name}`);
    methods[role] = bundle[name].bind(bundle);
  }
  invariant(bundle.conformance && typeof bundle.conformance.createHost === 'function', 'CONFORMANCE_CREATE_HOST');
  invariant(typeof bundle.conformance.prepareReplay === 'function', 'CONFORMANCE_PREPARE_REPLAY');
  invariant(typeof bundle.conformance.strictStringProbe === 'function', 'CONFORMANCE_STRICT_STRING_PROBE');
  let recovery = null;
  if (metadata.receipt_only_recovery === true) {
    recovery = metadata.recovery_contract;
    invariant(recovery && typeof recovery === 'object', 'RECOVERY_CONTRACT_REQUIRED');
    invariant(recovery.expected_native_creates === 0, 'RECOVERY_EXPECTED_CREATES_ZERO');
    invariant(recovery.expected_native_setters === 0, 'RECOVERY_EXPECTED_SETTERS_ZERO');
    invariant(recovery.physical_active_current_file === true, 'RECOVERY_PHYSICAL_ACTIVE_CURRENT_FILE_REQUIRED');
    invariant(recovery.full_authorization_tuple === true, 'RECOVERY_FULL_AUTHORIZATION_TUPLE_REQUIRED');
    invariant(recovery.receipt && typeof recovery.receipt === 'object', 'RECOVERY_RECEIPT_CONTRACT_REQUIRED');
    invariant(typeof recovery.receipt.namespace === 'string' && recovery.receipt.namespace.length > 0, 'RECOVERY_RECEIPT_NAMESPACE');
    invariant(typeof recovery.receipt.key === 'string' && recovery.receipt.key.length > 0, 'RECOVERY_RECEIPT_KEY');
    invariant(SHA_RE.test(recovery.receipt.value_sha256 || ''), 'RECOVERY_RECEIPT_VALUE_SHA256');
  } else {
    invariant(metadata.recovery_contract === undefined, 'RECOVERY_CONTRACT_WITHOUT_DECLARATION');
  }
  return { metadata, methods, recovery };
}

function instrumentNativeRecoverySetters(penpot, audit) {
  const seen = new Set();
  const wrap = (object, key) => {
    if (!object || seen.has(`${object.id || 'anonymous'}\u0000${key}`)) return;
    const descriptor = Object.getOwnPropertyDescriptor(object, key);
    if (descriptor && descriptor.configurable === false) return;
    let value = object[key];
    try {
      Object.defineProperty(object, key, {
        configurable: true,
        enumerable: descriptor?.enumerable ?? true,
        get: () => value,
        set: (next) => { audit.nativeSetterCalls += 1; value = next; },
      });
      seen.add(`${object.id || 'anonymous'}\u0000${key}`);
    } catch {}
  };
  for (const component of penpot.library.local.components) {
    wrap(component, 'name');
    wrap(component, 'path');
    const main = typeof component.mainInstance === 'function' ? component.mainInstance() : null;
    wrap(main, 'name');
  }
}

function terminal(receipt) {
  return receipt?.terminal === true || receipt?.done === true || receipt?.phase_after === 'DONE' || receipt?.state === 'DONE';
}

async function driveExecution(method, host, audit, expectedCreated, label) {
  let total = 0;
  const phases = [];
  for (let index = 0; index < MAX_DRIVE_PHASES; index += 1) {
    const before = audit.creates;
    const receipt = await method(host);
    const created = audit.creates - before;
    invariant(created <= 3, `${label}_CREATE_LIMIT:${created}`);
    if (Number.isInteger(receipt?.created)) invariant(receipt.created === created, `${label}_RECEIPT_CREATED_MISMATCH`);
    phases.push({ index, created, terminal: terminal(receipt) });
    total += created;
    if (terminal(receipt)) {
      invariant(expectedCreated === null || total === expectedCreated, `${label}_TOTAL_CREATED:${total}`);
      return { total, phases, receipt };
    }
  }
  throw new Error(`${label}_DID_NOT_TERMINATE`);
}

async function runConformance({ bundlePath, expectedSha256, globalName }) {
  invariant(typeof bundlePath === 'string' && bundlePath.length > 0, 'BUNDLE_PATH_REQUIRED');
  invariant(SHA_RE.test(expectedSha256 || ''), 'EXPECTED_SHA256_REQUIRED');
  invariant(IDENT_RE.test(globalName || ''), 'GLOBAL_NAME_REQUIRED');
  const absolutePath = resolve(bundlePath);
  const bytes = await readFile(absolutePath);
  const source = bytes.toString('utf8');
  staticGate(source, absolutePath);
  const actualSha256 = sha256(bytes);
  invariant(actualSha256 === expectedSha256, `BUNDLE_SHA256_MISMATCH:${actualSha256}`);

  const instrumented = buildInstrumentedPenpot();
  const sandbox = {
    console: Object.freeze({ log() {}, warn() {}, error() {} }),
    penpot: instrumented.penpot,
    // These browser globals are not part of the native Penpot plugin runtime
    // contract used by the sole writer. Bundles must ship portable primitives
    // or use native Penpot APIs rather than relying on them.
    crypto: Object.freeze({}),
    TextEncoder: undefined,
    TextDecoder: undefined,
    structuredClone: undefined,
    Uint8Array,
    ArrayBuffer,
    Blob,
    URL,
    setTimeout,
    clearTimeout,
    require: undefined,
    module: undefined,
    exports: undefined,
    process: undefined,
    Buffer: undefined,
  };
  sandbox.globalThis = sandbox;
  const context = vm.createContext(sandbox, {
    name: 'D0_PLUGIN_BUNDLE_CONFORMANCE_V1',
    codeGeneration: { strings: false, wasm: false },
  });
  new vm.Script(source, { filename: absolutePath }).runInContext(context, { timeout: 3000 });
  const bundle = sandbox[globalName];
  const { metadata, methods, recovery } = assertMetadata(bundle, globalName);

  const storage = Object.create(null);
  const host = await bundle.conformance.createHost({
    penpot: instrumented.penpot,
    storage,
    pluginNode: instrumented.pluginNode,
  });
  invariant(host && host.penpot === instrumented.penpot, 'CONFORMANCE_HOST_MUST_USE_INSTRUMENTED_PENPOT');
  invariant(host.storage === storage, 'CONFORMANCE_HOST_MUST_USE_PROVIDED_STORAGE');
  invariant(host.dependencies === undefined, 'CONFORMANCE_HOST_INJECTED_DEPENDENCIES');
  invariant(host.localStorage === undefined, 'CONFORMANCE_HOST_INJECTED_LOCAL_STORAGE');
  invariant(host.readActiveMarker === undefined, 'CONFORMANCE_HOST_INJECTED_ACTIVE_READER');
  for (const component of instrumented.penpot.library.local.components) {
    invariant(typeof component?.mainInstance === 'function', 'NATIVE_COMPONENT_MAIN_INSTANCE_METHOD_REQUIRED');
    invariant(!Object.prototype.hasOwnProperty.call(component, 'main'), 'NON_NATIVE_COMPONENT_MAIN_API_FORBIDDEN');
  }
  if (recovery) instrumentNativeRecoverySetters(instrumented.penpot, instrumented.audit);
  invariant(Number.isInteger(instrumented.penpot.currentFile.revn), 'NATIVE_REVN_REQUIRED');
  invariant(instrumented.penpot.currentFile.revision === undefined, 'NATIVE_REVISION_ALIAS_FORBIDDEN');
  invariant(instrumented.audit.creates === 0, 'CONFORMANCE_SETUP_NATIVE_CREATES_FORBIDDEN');

  const strictProbe = await bundle.conformance.strictStringProbe(host);
  invariant(strictProbe && strictProbe.string === 'PASS', 'STRICT_STRING_ACCEPTANCE_MISSING');
  for (const key of ['number', 'object', 'boolean', 'null', 'undefined']) {
    invariant(strictProbe[key] === 'REJECTED', `STRICT_STRING_REJECTION_MISSING:${key}`);
  }
  invariant(instrumented.audit.pluginStringWrites >= 1, 'STRICT_STRING_ACCEPTED_WRITE_NOT_OBSERVED');
  invariant(instrumented.audit.rejectedPluginWrites >= 5, 'STRICT_STRING_REJECTED_WRITES_NOT_OBSERVED');

  const projectionBefore = instrumented.audit.creates;
  const projectionReceipt = await methods.projection(host);
  invariant(instrumented.audit.creates === projectionBefore, 'PROJECTION_MUTATED_NATIVE_STATE');

  const recoveryWritesBefore = instrumented.audit.currentFilePluginWrites;
  const recoverySettersBefore = instrumented.audit.nativeSetterCalls;
  const first = await driveExecution(methods.execution, host, instrumented.audit, recovery ? 0 : null, 'FIRST_RUN');
  if (!recovery) invariant(first.total > 0, 'FIRST_RUN_CREATED_NOT_POSITIVE');
  invariant(instrumented.audit.createEvents.filter((event) => event.kind !== 'page').every((event) => event.current_page_id), 'CURRENT_PAGE_ACTIVATION_NOT_PROVEN');
  if (/\bACTIVE\b/u.test(source) && /\/root\/publish_r2/u.test(source)) {
    invariant(instrumented.audit.currentFilePluginReads > 0, 'PHYSICAL_ACTIVE_CURRENT_FILE_READER_REQUIRED');
  }

  const settlementBefore = instrumented.audit.creates;
  const settlementReceipt = await methods.settlement(host);
  invariant(instrumented.audit.creates === settlementBefore, 'SETTLEMENT_MUTATED_NATIVE_STATE');
  if (recovery) {
    invariant(instrumented.audit.nativeSetterCalls - recoverySettersBefore === 0, 'RECOVERY_NATIVE_SETTER_CALLED');
    const writes = instrumented.audit.currentFilePluginWriteEvents.slice(recoveryWritesBefore);
    invariant(writes.length === 1, `RECOVERY_RECEIPT_WRITE_COUNT:${writes.length}`);
    const [write] = writes;
    invariant(write.namespace === recovery.receipt.namespace, 'RECOVERY_RECEIPT_NAMESPACE_MISMATCH');
    invariant(write.key === recovery.receipt.key, 'RECOVERY_RECEIPT_KEY_MISMATCH');
    invariant(write.value_sha256 === recovery.receipt.value_sha256, 'RECOVERY_RECEIPT_VALUE_SHA256_MISMATCH');
    invariant(instrumented.audit.currentFilePluginReads > 0, 'RECOVERY_PHYSICAL_ACTIVE_NOT_READ');
  }

  const replayStorage = Object.create(null);
  const replayHost = await bundle.conformance.prepareReplay(host, { penpot: instrumented.penpot, storage: replayStorage });
  invariant(replayHost && replayHost.penpot === instrumented.penpot, 'REPLAY_HOST_MUST_PRESERVE_PENPOT_STATE');
  invariant(replayHost.storage === replayStorage, 'REPLAY_HOST_MUST_USE_FRESH_STORAGE');
  const replayWritesBefore = instrumented.audit.currentFilePluginWrites;
  const replaySettersBefore = instrumented.audit.nativeSetterCalls;
  const replay = await driveExecution(methods.execution, replayHost, instrumented.audit, 0, 'REPLAY');
  if (recovery) {
    invariant(instrumented.audit.currentFilePluginWrites === replayWritesBefore, 'RECOVERY_REPLAY_RECEIPT_REWRITE');
    invariant(instrumented.audit.nativeSetterCalls === replaySettersBefore, 'RECOVERY_REPLAY_NATIVE_SETTER_CALLED');
  }

  return {
    state: 'D0_PLUGIN_BUNDLE_CONFORMANCE_V1_PASS',
    package_id: metadata.package_id,
    bundle: absolutePath,
    bundle_bytes: bytes.length,
    bundle_sha256: actualSha256,
    global: globalName,
    entrypoints: metadata.entrypoints,
    projection_receipt: projectionReceipt ?? null,
    first_run: { phases: first.phases.length, created: first.total },
    settlement_receipt: settlementReceipt ?? null,
    replay: { phases: replay.phases.length, created: replay.total },
    plugin_data: {
      accepted_string_writes: instrumented.audit.pluginStringWrites,
      rejected_non_string_writes: instrumented.audit.rejectedPluginWrites,
    },
    current_page: {
      open_page_calls: instrumented.audit.openPageCalls,
      all_non_page_creates_activated: true,
    },
    native_runtime: {
      crypto_subtle_available: false,
      text_encoder_available: false,
      text_encoder_constructible: false,
      current_file_revision_property: 'revn',
      revision_alias_available: false,
      caller_injected_helpers_allowed: false,
    },
  };
}

async function selfTest() {
  const directory = await mkdtemp(join(tmpdir(), 'd0-bundle-conformance-'));
  const path = join(directory, 'fixture.js');
  const source = `(() => {\n  'use strict';\n  const NS='d0-fixture', KEY='stable';\n  const findPage=(p)=>p.currentFile.pages.find((x)=>x.name==='fixture')||null;\n  const write=(node,value)=>node.setSharedPluginData(NS,KEY,value);\n  async function projection(host){return {pages:host.penpot.currentFile.pages.length,created:0};}\n  async function execution(host){\n    let page=findPage(host.penpot);\n    if(!page){page=host.penpot.createPage();page.name='fixture';host.storage.phase='ROOT';return {created:1,terminal:false};}\n    await host.penpot.openPage(page);\n    const exists=page.root.children.some((x)=>x.getSharedPluginData(NS,KEY)==='root');\n    if(!exists){const root=host.penpot.createRectangle();write(root,'root');page.root.appendChild(root);host.storage.phase='DONE';return {created:1,terminal:true};}\n    host.storage.phase='DONE';return {created:0,terminal:true};\n  }\n  async function settlement(host){return {validation:host.penpot.currentFile.validate(),created:0};}\n  globalThis.D0ConformanceFixture={\n    metadata:Object.freeze({schema:'D0_PLUGIN_BUNDLE_V1',package_id:'D0-CONFORMANCE-FIXTURE',bundle_sha256_binding:'EXTERNAL_AUTHORIZATION_TUPLE',entrypoints:{projection:'projection',execution:'execution',settlement:'settlement'},current_page_activation:true,max_creates_per_phase:3,replay_created:0}),\n    projection,execution,settlement,\n    conformance:{\n      async createHost(seed){return {penpot:seed.penpot,storage:seed.storage};},\n      async prepareReplay(host,seed){return {penpot:seed.penpot,storage:seed.storage};},\n      async strictStringProbe(host){\n        const page=host.penpot.__seedPage('probe');\n        const values={number:374,object:{x:1},boolean:true,null:null,undefined:void 0};\n        const result={string:'FAIL'};\n        write(page,'374');result.string='PASS';\n        for(const key of Object.keys(values)){try{write(page,values[key]);result[key]='ACCEPTED';}catch{result[key]='REJECTED';}}\n        return result;\n      }\n    }\n  };\n})();\n`;
  try {
    await writeFile(path, source, 'utf8');
    const expectedSha256 = sha256(Buffer.from(source));
    const pass = await runConformance({ bundlePath: path, expectedSha256, globalName: 'D0ConformanceFixture' });
    assert.equal(pass.replay.created, 0);
    assert.equal(pass.first_run.created, 2);
    assert.deepEqual(pass.native_runtime, {
      crypto_subtle_available: false,
      text_encoder_available: false,
      text_encoder_constructible: false,
      current_file_revision_property: 'revn',
      revision_alias_available: false,
      caller_injected_helpers_allowed: false,
    });

    const recoveryValue = '{"state":"recovered"}';
    const recoveryValueSha256 = sha256(Buffer.from(recoveryValue, 'utf8'));
    const recoveryMetadata = `receipt_only_recovery:true,recovery_contract:Object.freeze({expected_native_creates:0,expected_native_setters:0,physical_active_current_file:true,full_authorization_tuple:true,receipt:Object.freeze({namespace:'d0-recovery',key:'receipt',value_sha256:'${recoveryValueSha256}'})}),`;
    const recoveryExecution = `async function execution(host){
      const file=host.penpot.currentFile;
      if(file.getSharedPluginData('d0-recovery','active')!=='ACTIVE')throw new Error('ACTIVE_REQUIRED');
      if(file.getSharedPluginData('d0-recovery','receipt'))return {created:0,terminal:true};
      file.setSharedPluginData('d0-recovery','receipt','${recoveryValue}');
      return {created:0,terminal:true};
    }
    `;
    const recoverySource = source
      .replace("metadata:Object.freeze({schema:'D0_PLUGIN_BUNDLE_V1',", `metadata:Object.freeze({schema:'D0_PLUGIN_BUNDLE_V1',${recoveryMetadata}`)
      .replace(/async function execution\(host\)\{[\s\S]*?\n  \}\n  async function settlement/u, `${recoveryExecution}  async function settlement`)
      .replace(
        'async createHost(seed){return {penpot:seed.penpot,storage:seed.storage};}',
        "async createHost(seed){seed.penpot.currentFile.setSharedPluginData('d0-recovery','active','ACTIVE');return {penpot:seed.penpot,storage:seed.storage};}",
      );
    const recoveryPath = join(directory, 'recovery.js');
    await writeFile(recoveryPath, recoverySource, 'utf8');
    const recoveryPass = await runConformance({
      bundlePath: recoveryPath,
      expectedSha256: sha256(Buffer.from(recoverySource)),
      globalName: 'D0ConformanceFixture',
    });
    invariant(recoveryPass.first_run.created === 0 && recoveryPass.replay.created === 0, 'SELF_TEST_RECOVERY_ZERO_CREATE');

    const recoveryNegativeCases = [
      ['false-declaration', recoverySource.replace(recoveryMetadata, 'receipt_only_recovery:true,'), /RECOVERY_CONTRACT_REQUIRED/u],
      ['dummy-create', recoverySource.replace('const file=host.penpot.currentFile;', 'host.penpot.createPage();const file=host.penpot.currentFile;'), /FIRST_RUN_RECEIPT_CREATED_MISMATCH|FIRST_RUN_TOTAL_CREATED/u],
      ['missing-receipt', recoverySource.replace(`file.setSharedPluginData('d0-recovery','receipt','${recoveryValue}');`, ''), /RECOVERY_RECEIPT_WRITE_COUNT:0/u],
    ];
    for (const [name, body, error] of recoveryNegativeCases) {
      const badPath = join(directory, `recovery-${name}.js`);
      await writeFile(badPath, body, 'utf8');
      await assert.rejects(
        () => runConformance({ bundlePath: badPath, expectedSha256: sha256(Buffer.from(body)), globalName: 'D0ConformanceFixture' }),
        error,
      );
    }

    const forbidden = [
      ['require', 'globalThis.Bad={}; require("x")'],
      ['module', 'module.exports={}'],
      ['process', 'globalThis.x=process'],
      ['buffer', 'globalThis.x=Buffer'],
      ['import', 'import("./x.js")'],
      ['filesystem', 'globalThis.x=readFile("x")'],
    ];
    for (const [name, body] of forbidden) {
      const badPath = join(directory, `${name}.js`);
      await writeFile(badPath, body, 'utf8');
      await assert.rejects(
        () => runConformance({ bundlePath: badPath, expectedSha256: sha256(Buffer.from(body)), globalName: 'Bad' }),
        /FORBIDDEN_/u,
      );
    }
    await assert.rejects(
      () => runConformance({ bundlePath: path, expectedSha256: '0'.repeat(64), globalName: 'D0ConformanceFixture' }),
      /BUNDLE_SHA256_MISMATCH/u,
    );
    const nativeGlobalCases = [
      ['crypto-subtle', source.replace("  const NS='d0-fixture', KEY='stable';", "  const NS='d0-fixture', KEY='stable'; globalThis.crypto.subtle.digest; "), /digest/u],
      ['text-encoder', source.replace("  const NS='d0-fixture', KEY='stable';", "  const NS='d0-fixture', KEY='stable'; new globalThis.TextEncoder(); "), /TextEncoder|constructor/u],
      ['caller-helper', source.replace("  const NS='d0-fixture', KEY='stable';", "  const NS='d0-fixture', KEY='stable'; globalThis.readNativeCoverage; "), /UNAVAILABLE_CALLER_HELPER:readNativeCoverage/u],
      ['structured-clone', source.replace("  const NS='d0-fixture', KEY='stable';", "  const NS='d0-fixture', KEY='stable'; structuredClone({}); "), /NATIVE_STRUCTURED_CLONE_FORBIDDEN/u],
      ['authorization-bypass', source.replace("  const NS='d0-fixture', KEY='stable';", "  const NS='d0-fixture', KEY='stable', __d0BundleConformance=true; void __d0BundleConformance; "), /CONFORMANCE_AUTHORIZATION_BYPASS_FORBIDDEN/u],
      ['revision-alias', source.replace(
        'async createHost(seed){return {penpot:seed.penpot,storage:seed.storage};}',
        'async createHost(seed){seed.penpot.currentFile.revision=1;return {penpot:seed.penpot,storage:seed.storage};}',
      ), /NATIVE_REVISION_ALIAS_FORBIDDEN/u],
      ['caller-dependencies', source.replace(
        'async createHost(seed){return {penpot:seed.penpot,storage:seed.storage};}',
        'async createHost(seed){return {penpot:seed.penpot,storage:seed.storage,dependencies:{}};}',
      ), /CONFORMANCE_HOST_INJECTED_DEPENDENCIES/u],
      ['caller-active-reader', source.replace(
        'async createHost(seed){return {penpot:seed.penpot,storage:seed.storage};}',
        'async createHost(seed){return {penpot:seed.penpot,storage:seed.storage,readActiveMarker(){return {}}};}',
      ), /CONFORMANCE_HOST_INJECTED_ACTIVE_READER/u],
      ['non-native-component-main', source.replace(
        'async createHost(seed){return {penpot:seed.penpot,storage:seed.storage};}',
        'async createHost(seed){seed.penpot.library.local.components.push({id:"bad",main:{}});return {penpot:seed.penpot,storage:seed.storage};}',
      ), /NATIVE_COMPONENT_MAIN_INSTANCE_METHOD_REQUIRED/u],
      ['storage-only-active', source.replace(
        "  const NS='d0-fixture', KEY='stable';",
        "  const NS='d0-fixture', KEY='stable', ACTIVE='ACTIVE', WRITER='/root/publish_r2'; void ACTIVE; void WRITER;",
      ), /PHYSICAL_ACTIVE_CURRENT_FILE_READER_REQUIRED/u],
      ['save-version', source.replace(
        'async function settlement(host){return {validation:host.penpot.currentFile.validate(),created:0};}',
        'async function settlement(host){await host.penpot.currentFile.saveVersion("forbidden");return {validation:host.penpot.currentFile.validate(),created:0};}',
      ), /ORCHESTRATOR_SAVE_VERSION_CALL_FORBIDDEN/u],
    ];
    for (const [name, body, error] of nativeGlobalCases) {
      const badPath = join(directory, `${name}.js`);
      await writeFile(badPath, body, 'utf8');
      await assert.rejects(
        () => runConformance({ bundlePath: badPath, expectedSha256: sha256(Buffer.from(body)), globalName: 'D0ConformanceFixture' }),
        error,
      );
    }
    return {
      ...pass,
      recovery_receipt_only: { first_created: recoveryPass.first_run.created, replay_created: recoveryPass.replay.created },
      self_test_negative_cases: forbidden.length + 1 + nativeGlobalCases.length + recoveryNegativeCases.length,
    };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

const args = parseArgs(process.argv.slice(2));
const result = args.selfTest
  ? await selfTest()
  : await runConformance({
      bundlePath: args.bundle,
      expectedSha256: args.expectedSha256,
      globalName: args.globalName,
    });
console.log(JSON.stringify(result, null, 2));

'use strict';

const crypto = require('node:crypto');

const ADAPTER_ID = 'kenigevents.penpot.phase-b-native-adapter';
const ADAPTER_VERSION = '1.0.0';
const PLUGIN_NAMESPACE = 'kenigevents.phase-b.executor.v1';
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

function demand(condition, code) {
  if (!condition) {
    const error = new Error(code);
    error.code = code;
    throw error;
  }
}

function semanticKey(operation) {
  return `${PLUGIN_NAMESPACE}/${operation.idempotence_key}`;
}

class PenpotNativeAdapter {
  constructor(nativeApi) {
    demand(nativeApi && typeof nativeApi.findRootByPluginKey === 'function', 'NATIVE_API_LOOKUP_MISSING');
    for (const method of ['createRoot', 'createNode', 'deleteNode', 'snapshotNode', 'restoreSnapshot']) {
      demand(typeof nativeApi[method] === 'function', `NATIVE_API_${method.toUpperCase()}_MISSING`);
    }
    this.nativeApi = nativeApi;
    this.perMutationChecks = true;
    this.identity = { id: ADAPTER_ID, version: ADAPTER_VERSION, plugin_namespace: PLUGIN_NAMESPACE };
  }

  async lookup(idempotenceKey) {
    const found = await this.nativeApi.findRootByPluginKey(`${PLUGIN_NAMESPACE}/${idempotenceKey}`);
    return found ? { output_uuid: found.id, semantic_key: found.plugin_key } : null;
  }

  async write(operation, hooks) {
    demand(hooks?.beforeMutation && hooks?.onMutation, 'NATIVE_MUTATION_HOOKS_MISSING');
    const key = semanticKey(operation);
    if (operation.kind === 'cleanup-replacement-scope') {
      const oldRoot = await this.nativeApi.findRootBySemanticLocator(operation.locator, operation.semantic_id);
      if (!oldRoot) return { output_uuid: null, mutations: [], mutations_reported_live: true };
      const snapshot = await this.nativeApi.snapshotNode(oldRoot.id);
      await hooks.beforeMutation(1);
      await this.nativeApi.deleteNode(oldRoot.id);
      hooks.onMutation({ mutation_id: sha256(`${key}/delete/${oldRoot.id}`), native_id: oldRoot.id, kind: 'delete-node', reversible: Boolean(snapshot), rollback: snapshot ? { kind: 'restore-snapshot', snapshot } : null });
      return { output_uuid: oldRoot.id, mutations_reported_live: true };
    }

    demand(operation.kind === 'upsert-semantic-root', 'NATIVE_OPERATION_UNSUPPORTED');
    demand(operation.resolved_case?.content_sha256, 'RESOLVED_CASE_REQUIRED');
    demand(operation.component_contract?.component_id, 'COMPONENT_CONTRACT_REQUIRED');
    demand(operation.runtime_native_target?.run_specific === true, 'RUN_SPECIFIC_TARGET_REQUIRED');
    const children = operation.component_contract.semantic_children;
    demand(Array.isArray(children) && children.length > 0, 'SEMANTIC_CHILDREN_REQUIRED');

    await hooks.beforeMutation(1);
    const root = await this.nativeApi.createRoot({
      page_id: operation.runtime_native_target.page_id,
      name: operation.semantic_id,
      plugin_key: key,
      plugin_data: {
        namespace: PLUGIN_NAMESPACE,
        semantic_id: operation.semantic_id,
        case_id: operation.case_id,
        resolved_case_sha256: operation.resolved_case.content_sha256,
        component_contract_id: operation.component_contract.component_id,
      },
    });
    hooks.onMutation({ mutation_id: sha256(`${key}/create/${root.id}`), native_id: root.id, kind: 'create-root', reversible: true, rollback: { kind: 'delete-node', native_id: root.id } });

    let mutationIndex = 1;
    for (const child of children) {
      mutationIndex += 1;
      await hooks.beforeMutation(mutationIndex);
      const node = await this.nativeApi.createNode({
        parent_id: root.id,
        name: child.component_id,
        kind: 'semantic-component-instance',
        plugin_data: {
          namespace: PLUGIN_NAMESPACE,
          semantic_id: child.component_id,
          owner_level: child.owner_level,
          required_linkage: child.required_linkage,
          resolved_case_sha256: operation.resolved_case.content_sha256,
        },
      });
      hooks.onMutation({ mutation_id: sha256(`${key}/create/${node.id}`), native_id: node.id, kind: 'create-node', reversible: true, rollback: { kind: 'delete-node', native_id: node.id } });
    }
    return { output_uuid: root.id, mutations_reported_live: true };
  }

  async rollback(mutation, hooks) {
    if (!mutation.rollback) return { rolled_back: false, reason: 'NO_ROLLBACK_TOKEN' };
    await hooks.beforeMutation();
    if (mutation.rollback.kind === 'delete-node') {
      await this.nativeApi.deleteNode(mutation.rollback.native_id);
      return { rolled_back: true, rollback_id: mutation.rollback.native_id };
    }
    if (mutation.rollback.kind === 'restore-snapshot') {
      const restored = await this.nativeApi.restoreSnapshot(mutation.rollback.snapshot);
      return { rolled_back: true, rollback_id: restored?.id || mutation.native_id };
    }
    return { rolled_back: false, reason: 'ROLLBACK_KIND_UNSUPPORTED' };
  }
}

module.exports = { ADAPTER_ID, ADAPTER_VERSION, PLUGIN_NAMESPACE, PenpotNativeAdapter, semanticKey };

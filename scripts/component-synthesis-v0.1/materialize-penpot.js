/* LoveKGD Component Synthesis v0.1 — Penpot execute_code/plugin-context materializer.
 * Input: explicit options.ir or storage.componentSynthesisV01IR.
 * This file intentionally has no module imports so it can be injected verbatim.
 */
(function installLoveKGDComponentSynthesisMaterializer(global) {
  'use strict';
  const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
  const NS = 'lovekgd.component-synthesis.v0.1';
  const SCAFFOLD_NS = 'lovekgd.resourcegraph.scaffold.v1';

  const fail = (code, message, detail) => {
    const error = new Error(message); error.code = code; error.detail = detail; throw error;
  };
  const requireValue = (condition, code, message, detail) => { if (!condition) fail(code, message, detail); };
  const getData = (shape, namespace, key) => {
    try { return shape.getSharedPluginData(namespace, key); } catch (_) { return null; }
  };
  const setData = (shape, key, value) => shape.setSharedPluginData(NS, key, String(value));
  const allPages = (penpot) => Array.from(penpot.currentFile.pages ?? []);
  const allShapes = (penpot) => allPages(penpot).flatMap((page) => Array.from(page.findShapes?.({}) ?? []).map((shape) => ({ page, shape })));
  const findByData = (penpot, namespace, key, value) => allShapes(penpot).filter(({ shape }) => getData(shape, namespace, key) === value);
  const scaffoldShape = (penpot, stableId) => {
    const matches = findByData(penpot, SCAFFOLD_NS, 'stable_id', stableId);
    requireValue(matches.length === 1, 'ACS_PENPOT_SCAFFOLD_LOOKUP', `expected one scaffold object ${stableId}`, { matches: matches.length });
    return matches[0];
  };
  const managed = (penpot, stableId) => findByData(penpot, NS, 'stable_id', stableId);
  const selectPage = (penpot, page) => { if (penpot.currentPage?.id !== page.id) penpot.currentPage = page; };
  const createText = (penpot, content, name, x = 16, y = 16) => {
    const text = penpot.createText(content); requireValue(text, 'ACS_PENPOT_CREATE_TEXT', 'Penpot could not create text');
    text.name = name; text.fontSize = '14'; text.fontWeight = '400'; text.x = x; text.y = y; return text;
  };
  const createAnatomyPart = (penpot, part, index) => {
    const shape = penpot.createRectangle?.() ?? penpot.createBoard();
    requireValue(shape, 'ACS_PENPOT_CREATE_ANATOMY', `could not create anatomy part ${part.part_id}`);
    shape.name = `Anatomy / ${part.part_id}`;
    shape.x = 16; shape.y = 72 + index * 44; shape.resize?.(328, 36);
    shape.fills = [{ fillColor: part.required ? '#e8f1ff' : '#f3f4f6', fillOpacity: 1 }];
    shape.strokes = [{ strokeColor: part.required ? '#2563eb' : '#94a3b8', strokeOpacity: 1, strokeWidth: 1 }];
    setData(shape, 'part_id', part.part_id); setData(shape, 'required', part.required);
    return shape;
  };
  const createNativeMaster = (penpot, componentPlan, variant, dependencyComponents) => {
    const zone = scaffoldShape(penpot, componentPlan.target_zone_stable_id); selectPage(penpot, zone.page);
    const board = penpot.createBoard(); requireValue(board, 'ACS_PENPOT_CREATE_BOARD', 'Penpot could not create native master board');
    board.name = `${componentPlan.entity_id} / ${variant.variant_key}`;
    const anatomyHeight = componentPlan.anatomy.length * 44;
    board.resize?.(360, 152 + anatomyHeight + variant.nested_instances.length * 52);
    board.x = Number(zone.shape.x ?? 0) + variant.position.x;
    board.y = Number(zone.shape.y ?? 0) + variant.position.y;
    board.fills = [{ fillColor: '#ffffff', fillOpacity: 1 }];
    board.strokes = [{ strokeColor: '#b8c2cc', strokeOpacity: 1, strokeWidth: 1 }];
    board.appendChild(createText(penpot, componentPlan.display_name, 'System / Display Name', 16, 14));
    board.appendChild(createText(penpot, componentPlan.entity_id, 'System / Entity ID', 16, 34));
    board.appendChild(createText(penpot, variant.variant_key, 'System / Variant Key', 16, 52));
    componentPlan.anatomy.forEach((part, index) => {
      board.appendChild(createAnatomyPart(penpot, part, index));
      board.appendChild(createText(penpot, `${part.required ? 'Required' : 'Optional'} · ${part.label}`, `Anatomy label / ${part.part_id}`, 28, 82 + index * 44));
    });
    variant.nested_instances.forEach((nested, nestedIndex) => {
      const dependency = dependencyComponents.get(nested.entity_ref);
      requireValue(dependency, 'ACS_PENPOT_DEPENDENCY_ORDER', `nested dependency ${nested.entity_ref} is not materialized`, nested);
      const instance = dependency.instance();
      requireValue(instance, 'ACS_PENPOT_CREATE_INSTANCE', `could not instantiate ${nested.entity_ref}`);
      instance.name = `Instance / ${nested.entity_ref} / ${nested.slot_id}`;
      setData(instance, 'stable_id', nested.stable_plugin_data_id);
      setData(instance, 'object_kind', 'nested_component_instance');
      setData(instance, 'detached', false);
      instance.x = 16; instance.y = 88 + anatomyHeight + nestedIndex * 52;
      board.appendChild(instance);
    });
    setData(board, 'stable_id', variant.stable_plugin_data_id);
    setData(board, 'entity_id', componentPlan.entity_id);
    if (componentPlan.variants.length === 1) setData(board, 'component_stable_id', componentPlan.stable_plugin_data_id);
    setData(board, 'contract_sha256', componentPlan.contract_sha256);
    setData(board, 'variant_key', variant.variant_key);
    setData(board, 'authority_mode', 'reconstructed');
    setData(board, 'canonical', false); setData(board, 'accepted', false); setData(board, 'promotion_ready', false);
    setData(board, 'detached', false); setData(board, 'screenshot_master', false);
    zone.shape.appendChild(board);
    const component = penpot.library.local.createComponent([board]);
    requireValue(component, 'ACS_PENPOT_CREATE_COMPONENT', `could not create native component ${componentPlan.entity_id}`);
    component.name = `${componentPlan.entity_id} / ${variant.variant_key}`;
    return { component, board };
  };
  const createGap = (penpot, node) => {
    const gap = penpot.createBoard(); gap.name = `Explicit Gap / ${node.gap_id}`; gap.resize?.(320, 96);
    gap.fills = []; gap.strokes = [{ strokeColor: '#d97706', strokeOpacity: 1, strokeWidth: 1, strokeStyle: 'dashed' }];
    gap.appendChild(createText(penpot, `GAP · ${node.gap_id}`, 'System / Explicit Gap'));
    setData(gap, 'stable_id', node.stable_plugin_data_id); setData(gap, 'object_kind', 'explicit_gap_placeholder');
    setData(gap, 'detached', false); return gap;
  };
  const planOperations = (ir, penpot) => {
    const operations = [];
    for (const component of ir.components) for (const variant of component.variants) {
      const matches = managed(penpot, variant.stable_plugin_data_id);
      requireValue(matches.length <= 1, 'ACS_PENPOT_DUPLICATE_STABLE_ID', `duplicate active key ${variant.stable_plugin_data_id}`);
      operations.push({ kind: matches.length ? 'reuse_component_variant' : 'create_component_variant', entity_id: component.entity_id, stable_id: variant.stable_plugin_data_id });
    }
    for (const archetype of ir.archetypes) for (const node of archetype.nodes) {
      const matches = managed(penpot, node.stable_plugin_data_id);
      requireValue(matches.length <= 1, 'ACS_PENPOT_DUPLICATE_STABLE_ID', `duplicate active key ${node.stable_plugin_data_id}`);
      operations.push({ kind: matches.length ? 'reuse_archetype_node' : 'create_archetype_node', archetype_id: archetype.archetype_id, stable_id: node.stable_plugin_data_id });
    }
    for (const archetype of ir.archetypes) {
      const matches = managed(penpot, archetype.board_stable_plugin_data_id);
      requireValue(matches.length <= 1, 'ACS_PENPOT_DUPLICATE_STABLE_ID', `duplicate archetype board ${archetype.board_stable_plugin_data_id}`);
      operations.push({ kind: matches.length ? 'reuse_archetype_board' : 'create_archetype_board', archetype_id: archetype.archetype_id, stable_id: archetype.board_stable_plugin_data_id });
    }
    for (const component of ir.components) for (const specimen of component.specimens) {
      const matches = managed(penpot, specimen.stable_plugin_data_id);
      requireValue(matches.length <= 1, 'ACS_PENPOT_DUPLICATE_STABLE_ID', `duplicate fixture specimen ${specimen.stable_plugin_data_id}`);
      operations.push({ kind: matches.length ? 'reuse_fixture_specimen' : 'create_fixture_specimen', entity_id: component.entity_id, fixture_id: specimen.fixture_id, stable_id: specimen.stable_plugin_data_id });
    }
    return operations;
  };
  const readback = (ir, penpot, executionStatus, blockers, revisionBefore = null) => {
    const shapes = allShapes(penpot).filter(({ shape }) => getData(shape, NS, 'stable_id'));
    const ids = shapes.map(({ shape }) => getData(shape, NS, 'stable_id'));
    const componentBindingIds = allShapes(penpot).map(({ shape }) => getData(shape, NS, 'component_stable_id')).filter(Boolean);
    const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))].sort();
    const duplicateComponentBindings = [...new Set(componentBindingIds.filter((id, index) => componentBindingIds.indexOf(id) !== index))].sort();
    const variantIds = ir.components.flatMap((component) => component.variants.map((variant) => variant.stable_plugin_data_id));
    const nestedIds = ir.components.flatMap((component) => component.variants.flatMap((variant) => variant.nested_instances.map((nested) => nested.stable_plugin_data_id)));
    const specimenBoardIds = ir.components.flatMap((component) => component.specimens.map((specimen) => specimen.stable_plugin_data_id));
    const specimenInstanceIds = ir.components.flatMap((component) => component.specimens.map((specimen) => specimen.instance_stable_plugin_data_id));
    const archetypeInstanceIds = ir.archetypes.flatMap((archetype) => archetype.nodes.filter((node) => node.node_kind !== 'gap_placeholder').map((node) => node.stable_plugin_data_id));
    const archetypeGapIds = ir.archetypes.flatMap((archetype) => archetype.nodes.filter((node) => node.node_kind === 'gap_placeholder').map((node) => node.stable_plugin_data_id));
    const archetypeBoardIds = ir.archetypes.map((archetype) => archetype.board_stable_plugin_data_id);
    const expected = [
      ...ir.components.flatMap((component) => component.variants.flatMap((variant) => [variant.stable_plugin_data_id, ...variant.nested_instances.map((nested) => nested.stable_plugin_data_id)])),
      ...ir.archetypes.flatMap((archetype) => archetype.nodes.map((node) => node.stable_plugin_data_id)),
      ...archetypeBoardIds,
      ...specimenBoardIds,
      ...specimenInstanceIds,
    ];
    const present = (expectedIds) => expectedIds.filter((id) => ids.includes(id)).length;
    return {
      schema_version: 'lovekgd_component_synthesis_penpot_readback_v0_1',
      resource_graph_file_id: FILE_ID,
      execution_status: executionStatus,
      components_created: executionStatus === 'PASS',
      planned_counts: { ...ir.counts },
      revision_before: revisionBefore,
      revision_after: penpot.currentFile.revn ?? penpot.currentFile.revision ?? null,
      counts: executionStatus === 'PASS' ? {
        native_component_masters: new Set(componentBindingIds).size,
        concrete_component_variants: present(variantIds),
        nested_component_instances: present(nestedIds),
        fixture_specimen_instances: present(specimenInstanceIds),
        archetype_instances: present(archetypeInstanceIds),
        explicit_gaps: present(archetypeGapIds),
      } : {
        native_component_masters: 0, concrete_component_variants: 0, nested_component_instances: 0, fixture_specimen_instances: 0, archetype_instances: 0, explicit_gaps: 0,
      },
      stable_component_ids: ids.sort(),
      component_binding_ids: componentBindingIds.sort(),
      duplicate_stable_ids: [...new Set([...duplicates, ...duplicateComponentBindings])].sort(),
      detached_copies: shapes.filter(({ shape }) => getData(shape, NS, 'detached') === 'true').map(({ shape }) => shape.id),
      missing_bindings: executionStatus === 'PASS' ? [
        ...expected.filter((id) => !ids.includes(id)),
        ...ir.components.map((component) => component.stable_plugin_data_id).filter((id) => !componentBindingIds.includes(id)),
      ] : [],
      validation_errors: [],
      idempotency: { second_run_executed: false, second_run_created: null, second_run_updated: null, stable_ids_unchanged: null, result: 'NOT_RUN' },
      blockers,
    };
  };
  async function materialize(options) {
    const penpot = options?.penpot ?? global.penpot;
    const storage = options?.storage ?? global.storage ?? {};
    const ir = options?.ir ?? storage.componentSynthesisV01IR;
    const mode = options?.mode ?? 'dry-run';
    const idempotencyPass = options?._idempotencyPass === true;
    requireValue(penpot?.currentFile, 'ACS_PENPOT_CONTEXT', 'Penpot plugin context is required');
    requireValue(penpot.currentFile.id === FILE_ID, 'ACS_WRONG_PENPOT_FILE', `expected Resource Graph ${FILE_ID}, got ${penpot.currentFile.id}`);
    requireValue(ir?.resource_graph_file_id === FILE_ID && ir.namespace === NS, 'ACS_PENPOT_IR', 'missing or wrong Component Synthesis v0.1 IR');
    requireValue(ir.status?.canonical === false && ir.status?.accepted === false && ir.status?.promotion_ready === false, 'ACS_PENPOT_STATUS_ESCAPE', 'IR escaped candidate status');
    const revisionBefore = penpot.currentFile.revn ?? penpot.currentFile.revision ?? null;
    const operations = planOperations(ir, penpot);
    if (mode === 'dry-run') return { status: 'DRY_RUN_ONLY_NOT_READBACK_EVIDENCE', operations, readback: null };
    if (mode === 'rollback-plan') return { status: 'ROLLBACK_PLAN', stable_ids: operations.map((operation) => operation.stable_id), destructive_execution_authorized: false };
    if (mode === 'rollback') {
      requireValue(options?.authorizeDestructiveRollback === true, 'ACS_ROLLBACK_NOT_AUTHORIZED', 'rollback requires explicit authorization');
      const namespaced = allShapes(penpot).filter(({ shape }) => getData(shape, NS, 'stable_id'));
      const namespacedIds = new Set(namespaced.map(({ shape }) => shape.id));
      const roots = namespaced.filter(({ shape }) => {
        let parent = shape.parent;
        while (parent) { if (namespacedIds.has(parent.id)) return false; parent = parent.parent; }
        return true;
      });
      for (const { shape } of roots) shape.remove();
      return { status: 'ROLLED_BACK', removed_namespace: NS, removed_top_level_roots: roots.length, scaffold_preserved: true };
    }
    requireValue(mode === 'materialize', 'ACS_PENPOT_MODE', `unsupported mode ${mode}`);
    const dependencyComponents = new Map();
    let created = 0;
    for (const componentPlan of ir.components) {
      const variantComponents = [];
      let existingVariants = 0;
      let createdVariants = 0;
      for (const variant of componentPlan.variants) {
        const matches = managed(penpot, variant.stable_plugin_data_id);
        if (matches.length === 1) {
          const existing = penpot.library.local.components.find((component) => {
            const main = typeof component.mainInstance === 'function' ? component.mainInstance() : component.mainInstance;
            return main?.id === matches[0].shape.id;
          });
          requireValue(existing, 'ACS_PENPOT_REUSE_COMPONENT', `stable object has no native component ${variant.stable_plugin_data_id}`);
          variantComponents.push(existing); existingVariants += 1; continue;
        }
        const built = createNativeMaster(penpot, componentPlan, variant, dependencyComponents); variantComponents.push(built.component); created += 1; createdVariants += 1;
      }
      requireValue(existingVariants === 0 || createdVariants === 0, 'ACS_PENPOT_PARTIAL_VARIANT_SET', `partial native variant set for ${componentPlan.entity_id} requires declared migration`);
      if (variantComponents.length > 1 && createdVariants > 0) {
        let container;
        if (global.penpotUtils?.createVariantContainer) container = global.penpotUtils.createVariantContainer(variantComponents);
        else if (penpot.createVariantFromComponents) container = penpot.createVariantFromComponents(variantComponents);
        else fail('ACS_PENPOT_VARIANT_API', 'native variant API is unavailable');
        const firstMain = typeof variantComponents[0].mainInstance === 'function' ? variantComponents[0].mainInstance() : variantComponents[0].mainInstance;
        const containerShape = container?.shape ?? container ?? firstMain?.parent;
        requireValue(containerShape?.setSharedPluginData, 'ACS_PENPOT_VARIANT_BINDING', `variant container for ${componentPlan.entity_id} has no bindable shape`);
        setData(containerShape, 'component_stable_id', componentPlan.stable_plugin_data_id);
        setData(containerShape, 'entity_id', componentPlan.entity_id);
        setData(containerShape, 'contract_sha256', componentPlan.contract_sha256);
      }
      dependencyComponents.set(componentPlan.entity_id, variantComponents[0]);
    }
    for (const componentPlan of ir.components) {
      const component = dependencyComponents.get(componentPlan.entity_id);
      requireValue(component, 'ACS_PENPOT_DEPENDENCY_ORDER', `fixture specimens require component ${componentPlan.entity_id}`);
      for (const specimen of componentPlan.specimens) {
        const matches = managed(penpot, specimen.stable_plugin_data_id);
        requireValue(matches.length <= 1, 'ACS_PENPOT_DUPLICATE_STABLE_ID', `duplicate fixture specimen ${specimen.stable_plugin_data_id}`);
        if (matches.length === 1) {
          requireValue(managed(penpot, specimen.instance_stable_plugin_data_id).length === 1, 'ACS_PENPOT_PARTIAL_SPECIMEN', `fixture specimen ${specimen.fixture_id} is missing its exact linked instance`);
          continue;
        }
        const zone = scaffoldShape(penpot, specimen.target_zone_stable_id); selectPage(penpot, zone.page);
        const board = penpot.createBoard(); requireValue(board, 'ACS_PENPOT_CREATE_BOARD', `could not create fixture specimen ${specimen.fixture_id}`);
        board.name = `Specimen / ${componentPlan.entity_id} / ${specimen.fixture_id}`; board.resize?.(240, 220);
        board.x = Number(zone.shape.x ?? 0) + specimen.position.x; board.y = Number(zone.shape.y ?? 0) + specimen.position.y;
        board.fills = [{ fillColor: '#ffffff', fillOpacity: 1 }]; board.strokes = [{ strokeColor: '#64748b', strokeOpacity: 1, strokeWidth: 1 }];
        board.appendChild(createText(penpot, specimen.fixture_id, 'System / Fixture ID', 12, 12));
        const instance = component.instance(); requireValue(instance, 'ACS_PENPOT_CREATE_INSTANCE', `could not instantiate fixture ${componentPlan.entity_id}`);
        instance.name = `Linked instance / ${componentPlan.entity_id}`; instance.x = 12; instance.y = 48;
        setData(instance, 'stable_id', specimen.instance_stable_plugin_data_id); setData(instance, 'object_kind', 'fixture_component_instance'); setData(instance, 'detached', false);
        board.appendChild(instance);
        setData(board, 'stable_id', specimen.stable_plugin_data_id); setData(board, 'object_kind', 'fixture_specimen');
        setData(board, 'entity_id', componentPlan.entity_id); setData(board, 'fixture_id', specimen.fixture_id);
        setData(board, 'canonical', false); setData(board, 'accepted', false); setData(board, 'promotion_ready', false); setData(board, 'detached', false);
        zone.shape.appendChild(board); created += 1;
      }
    }
    for (const archetype of ir.archetypes) {
      const zone = scaffoldShape(penpot, archetype.target_zone_stable_id); selectPage(penpot, zone.page);
      const boardMatches = managed(penpot, archetype.board_stable_plugin_data_id);
      requireValue(boardMatches.length <= 1, 'ACS_PENPOT_DUPLICATE_STABLE_ID', `duplicate archetype board ${archetype.board_stable_plugin_data_id}`);
      let board;
      if (boardMatches.length === 1) board = boardMatches[0].shape;
      else {
        board = penpot.createBoard(); board.name = `Archetype / ${archetype.archetype_id}`; board.resize?.(760, 1000);
        board.x = Number(zone.shape.x ?? 0) + archetype.position.x; board.y = Number(zone.shape.y ?? 0) + archetype.position.y;
        zone.shape.appendChild(board); setData(board, 'stable_id', archetype.board_stable_plugin_data_id); setData(board, 'object_kind', 'archetype_board');
        setData(board, 'canonical', false); setData(board, 'accepted', false); setData(board, 'promotion_ready', false); created += 1;
      }
      for (const [nodeIndex, node] of archetype.nodes.entries()) {
        if (managed(penpot, node.stable_plugin_data_id).length) continue;
        if (node.node_kind === 'gap_placeholder') {
          const gap = createGap(penpot, node); gap.x = 24 + (nodeIndex % 2) * 360; gap.y = 32 + Math.floor(nodeIndex / 2) * 132; board.appendChild(gap); created += 1;
        }
        else {
          const component = dependencyComponents.get(node.entity_ref); requireValue(component, 'ACS_PENPOT_ARCHETYPE_FK', `missing component ${node.entity_ref}`);
          const instance = component.instance(); instance.x = 24 + (nodeIndex % 2) * 360; instance.y = 32 + Math.floor(nodeIndex / 2) * 132;
          setData(instance, 'stable_id', node.stable_plugin_data_id); setData(instance, 'object_kind', node.node_kind); setData(instance, 'detached', false); board.appendChild(instance); created += 1;
        }
      }
    }
    const first = readback(ir, penpot, 'PASS', [], revisionBefore);
    requireValue(first.duplicate_stable_ids.length === 0 && first.detached_copies.length === 0 && first.missing_bindings.length === 0, 'ACS_PENPOT_READBACK', 'materialization read-back contains duplicates, detached copies or missing stable bindings', first);
    if (idempotencyPass) return { status: 'PASS_SECOND_RUN', created, operations, readback: first };
    const second = await materialize({ ...options, penpot, ir, mode: 'materialize', _idempotencyPass: true });
    first.idempotency = { second_run_executed: true, second_run_created: second.created, second_run_updated: 0, stable_ids_unchanged: second.created === 0, result: second.created === 0 ? 'PASS' : 'FAIL' };
    requireValue(second.created === 0, 'ACS_PENPOT_IDEMPOTENCY', 'actual second materialization run created duplicate objects', second.operations);
    return { status: 'PASS', created, operations, readback: first };
  }
  global.LoveKGDComponentSynthesisV01 = { materialize, readback, namespace: NS, resourceGraphFileId: FILE_ID };
})(typeof globalThis === 'undefined' ? this : globalThis);

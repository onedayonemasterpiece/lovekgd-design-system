/* LoveKGD Component Synthesis v0.1 — Penpot execute_code/plugin-context materializer.
 * Input: explicit options.ir or storage.componentSynthesisV01IR.
 * This file intentionally has no module imports so it can be injected verbatim.
 */
(function installLoveKGDComponentSynthesisMaterializer(global) {
  'use strict';
  const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
  const NS = 'lovekgd.component-synthesis.v0.1';
  const SCAFFOLD_NS = 'lovekgd.resourcegraph.scaffold.v1';
  let activeShapeIndex = null;

  const fail = (code, message, detail) => {
    const error = new Error(message); error.code = code; error.detail = detail; throw error;
  };
  const requireValue = (condition, code, message, detail) => { if (!condition) fail(code, message, detail); };
  const getData = (shape, namespace, key) => {
    try { return shape.getSharedPluginData(namespace, key); } catch (_) { return null; }
  };
  const setData = (shape, key, value) => shape.setSharedPluginData(NS, key, String(value));
  const isInsideComponentCopy = (shape) => {
    let parent = shape?.parent;
    while (parent) {
      if (parent.isComponentCopyInstance?.() === true) return true;
      parent = parent.parent;
    }
    return false;
  };
  const allPages = (penpot) => Array.from(penpot.currentFile.pages ?? []);
  const allShapes = (penpot) => allPages(penpot).flatMap((page) => Array.from(page.findShapes?.({}) ?? []).map((shape) => ({ page, shape })));
  const scaffoldNameFromStableId = (stableId) => {
    const match = /^rg\.zone\.(\d{2})\.[^.]+\.(.+)$/u.exec(stableId);
    requireValue(match, 'ACS_PENPOT_SCAFFOLD_ID', `unsupported scaffold zone stable ID ${stableId}`);
    return `RG / Zone / ${match[1]} / ${match[2]}`;
  };
  const buildShapeIndex = (penpot) => {
    const scaffold = new Map(); const names = new Map(); const managed = new Map(); const componentBindings = new Map();
    const items = allShapes(penpot);
    for (const item of items) {
      const scaffoldId = getData(item.shape, SCAFFOLD_NS, 'stable_id');
      // Shared plugin data is inherited by descendants when a component is
      // instantiated. Only the copy root is a materialized binding; inherited
      // descendant IDs must not be indexed as additional live objects.
      const managedId = isInsideComponentCopy(item.shape) ? null : getData(item.shape, NS, 'stable_id');
      const componentBindingId = item.shape.isComponentCopyInstance?.() === true ? null : getData(item.shape, NS, 'component_stable_id');
      if (scaffoldId) scaffold.set(scaffoldId, [...(scaffold.get(scaffoldId) ?? []), item]);
      if (item.shape.name) names.set(item.shape.name, [...(names.get(item.shape.name) ?? []), item]);
      if (managedId) managed.set(managedId, [...(managed.get(managedId) ?? []), item]);
      if (componentBindingId) componentBindings.set(componentBindingId, [...(componentBindings.get(componentBindingId) ?? []), item]);
    }
    const nativeComponentsByMainId = new Map();
    const registerComponent = (component) => {
      const main = typeof component?.mainInstance === 'function' ? component.mainInstance() : component?.mainInstance;
      if (main?.id) nativeComponentsByMainId.set(main.id, component);
    };
    for (const component of Array.from(penpot.library.local.components ?? [])) registerComponent(component);
    for (const { shape } of items) if (shape.isVariantContainer?.() === true && shape.variants) for (const component of shape.variants.variantComponents()) registerComponent(component);
    return { scaffold, names, managed, componentBindings, nativeComponentsByMainId };
  };
  // Fixture and archetype pages can contain hundreds of linked instances. A
  // whole-file scan before every resumable batch makes the browser do work
  // proportional to the entire Resource Graph and can exceed the MCP gateway
  // timeout. Index only the active page and use the native library as the
  // dependency source for these projection-only phases.
  const buildActivePageShapeIndex = (penpot) => {
    const scaffold = new Map(); const names = new Map(); const managed = new Map(); const componentBindings = new Map();
    const nativeComponentsByMainId = new Map(); const representativeComponentsByEntityId = new Map();
    const add = (map, key, value) => {
      if (!key) return;
      const values = map.get(key) ?? [];
      if (!values.some((row) => row.shape?.id === value.shape?.id)) map.set(key, [...values, value]);
    };
    const page = penpot.currentPage;
    requireValue(page, 'ACS_PENPOT_CONTEXT', 'an active Penpot page is required');
    const items = Array.from(page.findShapes?.({}) ?? []).map((shape) => ({ page, shape }));
    for (const item of items) {
      add(scaffold, getData(item.shape, SCAFFOLD_NS, 'stable_id'), item);
      add(names, item.shape.name, item);
      if (!isInsideComponentCopy(item.shape)) add(managed, getData(item.shape, NS, 'stable_id'), item);
      if (item.shape.isComponentCopyInstance?.() !== true) add(componentBindings, getData(item.shape, NS, 'component_stable_id'), item);
    }
    const register = (component) => {
      const main = typeof component?.mainInstance === 'function' ? component.mainInstance() : component?.mainInstance;
      if (!main?.id || nativeComponentsByMainId.has(main.id)) return;
      nativeComponentsByMainId.set(main.id, component);
      const entityId = getData(main, NS, 'entity_id');
      if (entityId && !representativeComponentsByEntityId.has(entityId)) representativeComponentsByEntityId.set(entityId, component);
    };
    for (const component of Array.from(penpot.library.local.components ?? [])) register(component);
    return { scaffold, names, managed, componentBindings, nativeComponentsByMainId, representativeComponentsByEntityId, activePageFast: true };
  };
  const buildComponentShapeIndex = (penpot, ir, selectedComponentIds) => {
    const scaffold = new Map(); const names = new Map(); const managed = new Map(); const componentBindings = new Map();
    const nativeComponentsByMainId = new Map(); const representativeComponentsByEntityId = new Map();
    const requiredEntityIds = new Set(selectedComponentIds ?? []);
    for (let changed = true; changed;) {
      changed = false;
      for (const component of ir.components) if (requiredEntityIds.has(component.entity_id)) for (const nested of component.variants.flatMap((variant) => variant.nested_instances)) {
        if (!requiredEntityIds.has(nested.entity_ref)) { requiredEntityIds.add(nested.entity_ref); changed = true; }
      }
    }
    const add = (map, key, value) => {
      if (!key) return;
      const values = map.get(key) ?? [];
      if (!values.some((row) => row.shape?.id === value.shape?.id)) map.set(key, [...values, value]);
    };
    const registerMain = (component, main) => {
      if (!main?.id) return;
      if (nativeComponentsByMainId.has(main.id)) return;
      const entityId = getData(main, NS, 'entity_id');
      if (!requiredEntityIds.has(entityId)) return;
      nativeComponentsByMainId.set(main.id, component);
      if (!representativeComponentsByEntityId.has(entityId)) representativeComponentsByEntityId.set(entityId, component);
      add(managed, getData(main, NS, 'stable_id'), { page: null, shape: main });
      const directBinding = getData(main, NS, 'component_stable_id');
      if (directBinding) add(componentBindings, directBinding, { page: null, shape: main });
      const parentBinding = getData(main.parent, NS, 'component_stable_id');
      if (parentBinding) add(componentBindings, parentBinding, { page: null, shape: main.parent });
      if (selectedComponentIds?.has(getData(main, NS, 'entity_id'))) {
        for (const descendant of Array.from(main.findShapes?.({}) ?? [])) {
          if (!isInsideComponentCopy(descendant)) add(managed, getData(descendant, NS, 'stable_id'), { page: null, shape: descendant });
        }
      }
    };
    for (const component of Array.from(penpot.library.local.components ?? [])) {
      const main = typeof component?.mainInstance === 'function' ? component.mainInstance() : component?.mainInstance;
      registerMain(component, main);
      if (selectedComponentIds?.has(getData(main, NS, 'entity_id')) && main?.parent?.isVariantContainer?.() === true && main.parent.variants) {
        for (const member of main.parent.variants.variantComponents()) {
          const memberMain = typeof member?.mainInstance === 'function' ? member.mainInstance() : member?.mainInstance;
          registerMain(member, memberMain);
        }
      }
    }
    const selected = ir.components.filter((component) => selectedComponentIds?.has(component.entity_id));
    const seenZones = new Set();
    for (const component of selected) {
      const key = `${component.target_page}\u0000${component.target_zone_stable_id}`;
      if (seenZones.has(key)) continue;
      seenZones.add(key);
      const page = allPages(penpot).find((candidate) => candidate.name === component.target_page);
      requireValue(page, 'ACS_PENPOT_SCAFFOLD_LOOKUP', `missing target page ${component.target_page}`);
      const exactName = scaffoldNameFromStableId(component.target_zone_stable_id);
      const matches = Array.from(page.findShapes({ name: exactName }) ?? []).filter((shape) => shape.type === 'board').map((shape) => ({ page, shape }));
      names.set(exactName, matches);
    }
    return { scaffold, names, managed, componentBindings, nativeComponentsByMainId, representativeComponentsByEntityId, componentFast: true };
  };
  const scaffoldShape = (penpot, stableId) => {
    const metadataMatches = activeShapeIndex?.scaffold.get(stableId) ?? [];
    requireValue(metadataMatches.length <= 1, 'ACS_PENPOT_SCAFFOLD_LOOKUP', `expected at most one metadata-bound scaffold object ${stableId}`, { matches: metadataMatches.length });
    const exactName = scaffoldNameFromStableId(stableId);
    const matches = metadataMatches.length === 1 ? metadataMatches : (activeShapeIndex?.names.get(exactName) ?? []).filter(({ shape }) => shape.type === 'board');
    requireValue(matches.length === 1, 'ACS_PENPOT_SCAFFOLD_LOOKUP', `expected one scaffold object ${stableId}`, { matches: matches.length, resolution: metadataMatches.length === 1 ? 'shared_plugin_data' : 'exact_canonical_board_name', exact_name: exactName });
    return matches[0];
  };
  const managed = (penpot, stableId) => activeShapeIndex?.managed.get(stableId) ?? [];
  const componentBindings = (stableId) => activeShapeIndex?.componentBindings.get(stableId) ?? [];
  const nativeComponentForShape = (shape) => activeShapeIndex?.nativeComponentsByMainId.get(shape?.id) ?? null;
  const requireActivePage = (penpot, expectedPageName, stableId) => requireValue(
    penpot.currentPage?.name === expectedPageName,
    'ACS_PENPOT_ACTIVE_PAGE',
    `activate ${expectedPageName} before materializing ${stableId}; current page is ${penpot.currentPage?.name ?? 'none'}`,
    { expected_page: expectedPageName, current_page: penpot.currentPage?.name ?? null, stable_id: stableId },
  );
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
    const zone = scaffoldShape(penpot, componentPlan.target_zone_stable_id);
    requireActivePage(penpot, componentPlan.target_page, variant.stable_plugin_data_id);
    const board = penpot.createBoard(); requireValue(board, 'ACS_PENPOT_CREATE_BOARD', 'Penpot could not create native master board');
    board.name = `${componentPlan.entity_id} / ${variant.variant_key}`;
    board.resize?.(360, 120 + variant.nested_instances.length * 48);
    board.x = Number(zone.shape.x ?? 0) + variant.position.x;
    board.y = Number(zone.shape.y ?? 0) + variant.position.y;
    board.fills = [{ fillColor: '#ffffff', fillOpacity: 1 }];
    board.strokes = [{ strokeColor: '#b8c2cc', strokeOpacity: 1, strokeWidth: 1 }];
    zone.shape.appendChild(board);
    const summary = createText(penpot, `${componentPlan.display_name}\n${variant.variant_key}\nAnatomy: ${componentPlan.anatomy.map((part) => part.part_id).join(', ') || 'none'}`, 'System / Candidate summary', board.x + 16, board.y + 14);
    summary.fontSize = '12'; summary.growType = 'auto-height'; summary.resize?.(328, 68); board.appendChild(summary);
    variant.nested_instances.forEach((nested, nestedIndex) => {
      const dependency = dependencyComponents.get(nested.entity_ref);
      requireValue(dependency, 'ACS_PENPOT_DEPENDENCY_ORDER', `nested dependency ${nested.entity_ref} is not materialized`, nested);
      const instance = dependency.instance();
      requireValue(instance, 'ACS_PENPOT_CREATE_INSTANCE', `could not instantiate ${nested.entity_ref}`);
      instance.name = `Instance / ${nested.entity_ref} / ${nested.slot_id}`;
      setData(instance, 'stable_id', nested.stable_plugin_data_id);
      setData(instance, 'object_kind', 'nested_component_instance');
      setData(instance, 'detached', false);
      instance.resize?.(328, 40);
      instance.x = board.x + 16; instance.y = board.y + 88 + nestedIndex * 48;
      board.appendChild(instance);
    });
    setData(board, 'stable_id', variant.stable_plugin_data_id);
    setData(board, 'entity_id', componentPlan.entity_id);
    if (componentPlan.variants.length === 1) setData(board, 'component_stable_id', componentPlan.stable_plugin_data_id);
    setData(board, 'contract_sha256', componentPlan.contract_sha256);
    setData(board, 'variant_key', variant.variant_key);
    setData(board, 'component_state', JSON.stringify({
      status: componentPlan.status,
      authority_mode: 'reconstructed', canonical: false, accepted: false, promotion_ready: false,
      detached: false, screenshot_master: false, variant_selections: variant.selections,
    }));
    const component = penpot.library.local.createComponent([board]);
    requireValue(component, 'ACS_PENPOT_CREATE_COMPONENT', `could not create native component ${componentPlan.entity_id}`);
    component.name = `${componentPlan.entity_id} / ${variant.variant_key}`;
    return { component, board };
  };
  const layoutNativeMasterContents = (board) => {
    const children = Array.from(board.children ?? []);
    const summary = children.find((shape) => shape.name === 'System / Candidate summary');
    const nested = children.filter((shape) => shape.isComponentCopyInstance?.() === true);
    board.resize?.(360, 120 + nested.length * 48);
    if (summary) { summary.fontSize = '12'; summary.growType = 'auto-height'; summary.resize?.(328, 68); summary.x = board.x + 16; summary.y = board.y + 14; }
    nested.forEach((instance, index) => {
      instance.resize?.(328, 40);
      instance.x = board.x + 16;
      instance.y = board.y + 88 + index * 48;
    });
  };
  const compactVariantContainer = async (containerShape, componentPlan) => {
    if (componentPlan.variants.length <= 1) {
      layoutNativeMasterContents(containerShape);
      return;
    }
    requireValue(containerShape?.isVariantContainer?.() === true && containerShape.variants, 'ACS_PENPOT_VARIANT_API', `native variant container is unavailable for ${componentPlan.entity_id}`);
    const flex = containerShape.flex ?? containerShape.addFlexLayout();
    flex.dir = 'row'; flex.wrap = 'wrap'; flex.rowGap = 24; flex.columnGap = 24;
    flex.topPadding = 16; flex.rightPadding = 16; flex.bottomPadding = 16; flex.leftPadding = 16;
    flex.alignItems = 'start'; flex.justifyContent = 'start';
    containerShape.resize?.(808, Math.max(160, containerShape.height));
    containerShape.horizontalSizing = 'fix'; containerShape.verticalSizing = 'auto';
    flex.horizontalSizing = 'fix'; flex.verticalSizing = 'auto';
    const members = containerShape.variants.variantComponents().map((component) => typeof component.mainInstance === 'function' ? component.mainInstance() : component.mainInstance);
    members.forEach(layoutNativeMasterContents);
    // Penpot may reflow the members only after all sizes are known. A second
    // geometry pass keeps every child inside its newly compacted native board.
    await new Promise((resolve) => setTimeout(resolve, 50));
    members.forEach(layoutNativeMasterContents);
  };
  const reconcileVariantContract = (containerShape, componentPlan) => {
    if (componentPlan.variants.length <= 1) return;
    requireValue(containerShape?.isVariantContainer?.() === true && containerShape.variants, 'ACS_PENPOT_VARIANT_API', `native variant container is unavailable for ${componentPlan.entity_id}`);
    const axes = Object.keys(componentPlan.variants[0].selections);
    requireValue(axes.length > 0 && componentPlan.variants.every((variant) => JSON.stringify(Object.keys(variant.selections)) === JSON.stringify(axes)), 'ACS_PENPOT_VARIANT_API', `variant axis order drift for ${componentPlan.entity_id}`);
    let properties = [...containerShape.variants.properties];
    while (properties.length > axes.length) { containerShape.variants.removeProperty(properties.length - 1); properties = [...containerShape.variants.properties]; }
    while (properties.length < axes.length) { containerShape.variants.addProperty(); properties = [...containerShape.variants.properties]; }
    for (const [index, axis] of axes.entries()) if (properties[index] !== axis) containerShape.variants.renameProperty(index, axis);
    properties = [...containerShape.variants.properties];
    requireValue(JSON.stringify(properties) === JSON.stringify(axes), 'ACS_PENPOT_VARIANT_API', `native variant property reconciliation failed for ${componentPlan.entity_id}`, { properties, axes });
    const plans = new Map(componentPlan.variants.map((variant) => [variant.stable_plugin_data_id, variant]));
    const members = containerShape.variants.variantComponents();
    requireValue(members.length === componentPlan.variants.length, 'ACS_PENPOT_VARIANT_API', `native variant member count drift for ${componentPlan.entity_id}`);
    for (const member of members) {
      const main = typeof member.mainInstance === 'function' ? member.mainInstance() : member.mainInstance;
      const variant = plans.get(getData(main, NS, 'stable_id'));
      requireValue(variant, 'ACS_PENPOT_VARIANT_API', `native variant member is not bound to the IR for ${componentPlan.entity_id}`);
      for (const [index, axis] of axes.entries()) member.setVariantProperty(index, String(variant.selections[axis]));
    }
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
    for (const component of ir.components) {
      for (const variant of component.variants) {
        const matches = managed(penpot, variant.stable_plugin_data_id);
        requireValue(matches.length <= 1, 'ACS_PENPOT_DUPLICATE_STABLE_ID', `duplicate active key ${variant.stable_plugin_data_id}`);
        operations.push({ kind: matches.length ? 'reuse_component_variant' : 'create_component_variant', entity_id: component.entity_id, stable_id: variant.stable_plugin_data_id });
      }
      const bindings = componentBindings(component.stable_plugin_data_id);
      requireValue(bindings.length <= 1, 'ACS_PENPOT_DUPLICATE_STABLE_ID', `duplicate component binding ${component.stable_plugin_data_id}`);
      operations.push({ kind: bindings.length ? 'reuse_component_binding' : 'create_component_binding', entity_id: component.entity_id, stable_id: component.stable_plugin_data_id });
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
  const batchReadback = (penpot, revisionBefore = null) => {
    const rows = activeShapeIndex?.componentFast
      ? [...activeShapeIndex.managed.values()].flat().map(({ shape }) => shape)
      : Array.from(penpot.currentPage?.findShapes?.({}) ?? []).filter((shape) => !isInsideComponentCopy(shape) && getData(shape, NS, 'stable_id'));
    const ids = rows.map((shape) => getData(shape, NS, 'stable_id')).filter(Boolean);
    return {
      current_page_id: penpot.currentPage?.id ?? null,
      current_page_name: penpot.currentPage?.name ?? null,
      revision_before: revisionBefore,
      revision_after: penpot.currentFile.revn ?? penpot.currentFile.revision ?? null,
      managed_object_count: ids.length,
      duplicate_stable_ids: [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))].sort(),
      detached_copies: rows.filter((shape) => getData(shape, NS, 'detached') === 'true').map((shape) => shape.id),
      local_library_component_count: Array.from(penpot.library.local.components ?? []).length,
    };
  };
  const readback = (ir, penpot, executionStatus, blockers, revisionBefore = null) => {
    const everyShape = allShapes(penpot);
    const shapes = everyShape.filter(({ shape }) => !isInsideComponentCopy(shape) && getData(shape, NS, 'stable_id'));
    const ids = shapes.map(({ shape }) => getData(shape, NS, 'stable_id'));
    const componentBindingIds = everyShape
      .filter(({ shape }) => shape.isComponentCopyInstance?.() !== true)
      .map(({ shape }) => getData(shape, NS, 'component_stable_id'))
      .filter(Boolean);
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
    const partial = options?.partial === true;
    const operationPhase = options?.operationPhase ?? 'all';
    const yieldEvery = Number(options?.yieldEvery ?? 0);
    const yieldMs = Number(options?.yieldMs ?? 0);
    const onProgress = typeof options?.onProgress === 'function' ? options.onProgress : null;
    const selectedComponentIds = options?.componentEntityIds ? new Set(options.componentEntityIds) : null;
    const selectedVariantStableIds = options?.variantStableIds ? new Set(options.variantStableIds) : null;
    const selectedSpecimenStableIds = options?.specimenStableIds ? new Set(options.specimenStableIds) : null;
    const selectedArchetypeIds = options?.archetypeIds ? new Set(options.archetypeIds) : null;
    const selectedArchetypeNodeStableIds = options?.archetypeNodeStableIds ? new Set(options.archetypeNodeStableIds) : null;
    requireValue(penpot?.currentFile, 'ACS_PENPOT_CONTEXT', 'Penpot plugin context is required');
    requireValue(penpot.currentFile.id === FILE_ID, 'ACS_WRONG_PENPOT_FILE', `expected Resource Graph ${FILE_ID}, got ${penpot.currentFile.id}`);
    requireValue(ir?.resource_graph_file_id === FILE_ID && ir.namespace === NS, 'ACS_PENPOT_IR', 'missing or wrong Component Synthesis v0.1 IR');
    requireValue(ir.status?.canonical === false && ir.status?.accepted === false && ir.status?.promotion_ready === false, 'ACS_PENPOT_STATUS_ESCAPE', 'IR escaped candidate status');
    requireValue(['all', 'component-masters', 'component-variants', 'variant-containers', 'layout-repair', 'fixture-specimens', 'archetypes'].includes(operationPhase), 'ACS_PENPOT_PHASE', `unsupported materialization phase ${operationPhase}`);
    if (partial) requireValue(selectedComponentIds || selectedArchetypeIds, 'ACS_PENPOT_PARTIAL_SCOPE', 'partial materialization requires an explicit component or archetype ID set');
    if (['component-masters', 'component-variants', 'variant-containers', 'layout-repair', 'fixture-specimens'].includes(operationPhase)) requireValue(partial && selectedComponentIds, 'ACS_PENPOT_PARTIAL_SCOPE', `${operationPhase} requires explicit componentEntityIds`);
    if (operationPhase === 'component-variants') requireValue(selectedVariantStableIds?.size > 0, 'ACS_PENPOT_PARTIAL_SCOPE', 'component-variants requires explicit variantStableIds');
    if (operationPhase === 'archetypes') requireValue(partial && selectedArchetypeIds, 'ACS_PENPOT_PARTIAL_SCOPE', 'archetypes phase requires explicit archetypeIds');
    if (selectedComponentIds) requireValue([...selectedComponentIds].every((id) => ir.components.some((component) => component.entity_id === id)), 'ACS_PENPOT_PARTIAL_SCOPE', 'partial materialization contains an unknown component ID');
    if (selectedVariantStableIds) requireValue([...selectedVariantStableIds].every((id) => ir.components.some((component) => component.variants.some((variant) => variant.stable_plugin_data_id === id))), 'ACS_PENPOT_PARTIAL_SCOPE', 'partial materialization contains an unknown variant stable ID');
    if (selectedVariantStableIds) requireValue([...selectedVariantStableIds].every((id) => ir.components.some((component) => selectedComponentIds?.has(component.entity_id) && component.variants.some((variant) => variant.stable_plugin_data_id === id))), 'ACS_PENPOT_PARTIAL_SCOPE', 'variantStableIds must belong to the selected componentEntityIds');
    if (selectedSpecimenStableIds) requireValue(operationPhase === 'fixture-specimens' && [...selectedSpecimenStableIds].every((id) => ir.components.some((component) => selectedComponentIds?.has(component.entity_id) && component.specimens.some((specimen) => specimen.stable_plugin_data_id === id))), 'ACS_PENPOT_PARTIAL_SCOPE', 'specimenStableIds must belong to the selected componentEntityIds and fixture-specimens phase');
    if (selectedArchetypeIds) requireValue([...selectedArchetypeIds].every((id) => ir.archetypes.some((archetype) => archetype.archetype_id === id)), 'ACS_PENPOT_PARTIAL_SCOPE', 'partial materialization contains an unknown archetype ID');
    if (selectedArchetypeNodeStableIds) requireValue(operationPhase === 'archetypes' && [...selectedArchetypeNodeStableIds].every((id) => ir.archetypes.some((archetype) => selectedArchetypeIds?.has(archetype.archetype_id) && archetype.nodes.some((node) => node.stable_plugin_data_id === id))), 'ACS_PENPOT_PARTIAL_SCOPE', 'archetypeNodeStableIds must belong to the selected archetypeIds and archetypes phase');
    const componentPhase = ['component-masters', 'component-variants', 'variant-containers', 'layout-repair'].includes(operationPhase);
    const projectionPhase = ['fixture-specimens', 'archetypes'].includes(operationPhase);
    activeShapeIndex = componentPhase ? buildComponentShapeIndex(penpot, ir, selectedComponentIds) : projectionPhase ? buildActivePageShapeIndex(penpot) : buildShapeIndex(penpot);
    const revisionBefore = penpot.currentFile.revn ?? penpot.currentFile.revision ?? null;
    const planIr = partial ? {
      ...ir,
      components: selectedComponentIds ? ir.components.filter((component) => selectedComponentIds.has(component.entity_id)) : [],
      archetypes: selectedArchetypeIds ? ir.archetypes.filter((archetype) => selectedArchetypeIds.has(archetype.archetype_id)) : [],
    } : ir;
    const operations = planOperations(planIr, penpot);
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
    if (!partial && operationPhase === 'all') requireValue(!operations.some((operation) => operation.kind.startsWith('create_')), 'ACS_PENPOT_STAGED_REQUIRED', 'initial writes must use active-page-safe staged materialization');
    const dependencyComponents = new Map();
    let created = 0;
    let mutationsSinceYield = 0;
    const checkpoint = async (detail) => {
      mutationsSinceYield += 1;
      onProgress?.({ created, mutations: mutationsSinceYield, ...detail });
      if (yieldEvery > 0 && mutationsSinceYield % yieldEvery === 0) await new Promise((resolve) => setTimeout(resolve, Math.max(0, yieldMs)));
    };
    for (const componentPlan of ir.components) {
      const componentSelected = !partial || selectedComponentIds?.has(componentPlan.entity_id) === true;
      if (activeShapeIndex.activePageFast) {
        const representative = activeShapeIndex.representativeComponentsByEntityId.get(componentPlan.entity_id);
        if (representative) dependencyComponents.set(componentPlan.entity_id, representative);
        continue;
      }
      if (activeShapeIndex.componentFast && !componentSelected) {
        const representative = activeShapeIndex.representativeComponentsByEntityId.get(componentPlan.entity_id);
        if (representative) dependencyComponents.set(componentPlan.entity_id, representative);
        continue;
      }
      const createVariants = componentSelected && (operationPhase === 'component-masters' || operationPhase === 'component-variants');
      const finalizeContainer = componentSelected && (operationPhase === 'all' || operationPhase === 'component-masters' || operationPhase === 'variant-containers' || operationPhase === 'layout-repair');
      const matchRows = componentPlan.variants.map((variant) => ({ variant, matches: managed(penpot, variant.stable_plugin_data_id) }));
      requireValue(matchRows.every((row) => row.matches.length <= 1), 'ACS_PENPOT_DUPLICATE_STABLE_ID', `duplicate native variant in ${componentPlan.entity_id}`);
      const existingVariants = matchRows.filter((row) => row.matches.length === 1).length;
      if (operationPhase !== 'component-variants') requireValue(existingVariants === 0 || existingVariants === componentPlan.variants.length, 'ACS_PENPOT_PARTIAL_VARIANT_SET', `partial native variant set for ${componentPlan.entity_id} requires the resumable component-variants phase`);
      if (!createVariants && existingVariants === 0) continue;
      const variantComponents = [];
      for (const { variant, matches } of matchRows) {
        if (matches.length === 1) {
          const existing = nativeComponentForShape(matches[0].shape);
          requireValue(existing, 'ACS_PENPOT_REUSE_COMPONENT', `stable object has no native component ${variant.stable_plugin_data_id}`);
          variantComponents.push(existing); continue;
        }
        const selectedVariant = operationPhase === 'component-masters' || selectedVariantStableIds?.has(variant.stable_plugin_data_id) === true;
        if (!createVariants || !selectedVariant) continue;
        const built = createNativeMaster(penpot, componentPlan, variant, dependencyComponents); variantComponents.push(built.component); created += 1;
        activeShapeIndex.nativeComponentsByMainId.set(built.board.id, built.component);
        activeShapeIndex.managed.set(variant.stable_plugin_data_id, [{ page: penpot.currentPage, shape: built.board }]);
        for (const descendant of Array.from(built.board.findShapes?.({}) ?? [])) {
          const descendantStableId = !isInsideComponentCopy(descendant) ? getData(descendant, NS, 'stable_id') : null;
          if (descendantStableId) activeShapeIndex.managed.set(descendantStableId, [...(activeShapeIndex.managed.get(descendantStableId) ?? []), { page: penpot.currentPage, shape: descendant }]);
        }
        await checkpoint({ phase: 'component-variants', entity_id: componentPlan.entity_id, stable_id: variant.stable_plugin_data_id });
      }
      const bindingMatches = componentBindings(componentPlan.stable_plugin_data_id);
      requireValue(bindingMatches.length <= 1, 'ACS_PENPOT_DUPLICATE_STABLE_ID', `duplicate component binding ${componentPlan.stable_plugin_data_id}`);
      if (finalizeContainer && bindingMatches.length === 0) {
        requireValue(variantComponents.length === componentPlan.variants.length, 'ACS_PENPOT_PARTIAL_VARIANT_SET', `cannot finalize incomplete native variant set for ${componentPlan.entity_id}`);
        let containerShape;
        if (variantComponents.length === 1) containerShape = typeof variantComponents[0].mainInstance === 'function' ? variantComponents[0].mainInstance() : variantComponents[0].mainInstance;
        else {
          const variantBoards = variantComponents.map((component) => typeof component.mainInstance === 'function' ? component.mainInstance() : component.mainInstance);
          requireValue(variantBoards.length === variantComponents.length && variantBoards.every((shape) => shape?.type === 'board'), 'ACS_PENPOT_VARIANT_API', `native variant main instances are unavailable for ${componentPlan.entity_id}`);
          requireValue(penpot.createVariantFromComponents, 'ACS_PENPOT_VARIANT_API', 'native variant API is unavailable');
          const container = penpot.createVariantFromComponents(variantBoards);
          const firstMain = typeof variantComponents[0].mainInstance === 'function' ? variantComponents[0].mainInstance() : variantComponents[0].mainInstance;
          containerShape = container?.shape ?? container ?? firstMain?.parent;
        }
        requireValue(containerShape?.setSharedPluginData, 'ACS_PENPOT_VARIANT_BINDING', `variant container for ${componentPlan.entity_id} has no bindable shape`);
        setData(containerShape, 'component_stable_id', componentPlan.stable_plugin_data_id);
        setData(containerShape, 'entity_id', componentPlan.entity_id);
        setData(containerShape, 'contract_sha256', componentPlan.contract_sha256);
        reconcileVariantContract(containerShape, componentPlan);
        await compactVariantContainer(containerShape, componentPlan);
        created += 1;
        await checkpoint({ phase: 'variant-containers', entity_id: componentPlan.entity_id, stable_id: componentPlan.stable_plugin_data_id });
      }
      else if (finalizeContainer) {
        reconcileVariantContract(bindingMatches[0].shape, componentPlan);
        await compactVariantContainer(bindingMatches[0].shape, componentPlan);
      }
      if (operationPhase === 'fixture-specimens' && componentSelected) requireValue(bindingMatches.length === 1, 'ACS_PENPOT_VARIANT_BINDING', `fixture phase requires finalized component binding ${componentPlan.entity_id}`);
      if (variantComponents.length) dependencyComponents.set(componentPlan.entity_id, variantComponents[0]);
    }
    if (operationPhase === 'all' || operationPhase === 'fixture-specimens') for (const componentPlan of ir.components) {
      if (partial && selectedComponentIds?.has(componentPlan.entity_id) !== true) continue;
      const component = dependencyComponents.get(componentPlan.entity_id);
      requireValue(component, 'ACS_PENPOT_DEPENDENCY_ORDER', `fixture specimens require component ${componentPlan.entity_id}`);
      for (const specimen of componentPlan.specimens) {
        if (operationPhase === 'fixture-specimens' && specimen.target_page !== penpot.currentPage?.name) continue;
        if (selectedSpecimenStableIds && !selectedSpecimenStableIds.has(specimen.stable_plugin_data_id)) continue;
        const matches = managed(penpot, specimen.stable_plugin_data_id);
        requireValue(matches.length <= 1, 'ACS_PENPOT_DUPLICATE_STABLE_ID', `duplicate fixture specimen ${specimen.stable_plugin_data_id}`);
        if (matches.length === 1) {
          requireValue(managed(penpot, specimen.instance_stable_plugin_data_id).length === 1, 'ACS_PENPOT_PARTIAL_SPECIMEN', `fixture specimen ${specimen.fixture_id} is missing its exact linked instance`);
          continue;
        }
        const zone = scaffoldShape(penpot, specimen.target_zone_stable_id);
        requireActivePage(penpot, specimen.target_page, specimen.stable_plugin_data_id);
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
        await checkpoint({ phase: 'fixture-specimens', entity_id: componentPlan.entity_id, stable_id: specimen.stable_plugin_data_id });
      }
    }
    if (operationPhase === 'all' || operationPhase === 'archetypes') for (const archetype of ir.archetypes) {
      if (selectedArchetypeIds && !selectedArchetypeIds.has(archetype.archetype_id)) continue;
      if (selectedArchetypeIds === null && partial) continue;
      const boardMatches = managed(penpot, archetype.board_stable_plugin_data_id);
      requireValue(boardMatches.length <= 1, 'ACS_PENPOT_DUPLICATE_STABLE_ID', `duplicate archetype board ${archetype.board_stable_plugin_data_id}`);
      let board;
      if (boardMatches.length === 1) board = boardMatches[0].shape;
      else {
        const zone = scaffoldShape(penpot, archetype.target_zone_stable_id);
        requireActivePage(penpot, archetype.target_page, archetype.board_stable_plugin_data_id);
        board = penpot.createBoard(); board.name = `Archetype / ${archetype.archetype_id}`; board.resize?.(760, 1000);
        board.x = Number(zone.shape.x ?? 0) + archetype.position.x; board.y = Number(zone.shape.y ?? 0) + archetype.position.y;
        zone.shape.appendChild(board); setData(board, 'stable_id', archetype.board_stable_plugin_data_id); setData(board, 'object_kind', 'archetype_board');
        setData(board, 'canonical', false); setData(board, 'accepted', false); setData(board, 'promotion_ready', false); created += 1;
        await checkpoint({ phase: 'archetype-board', archetype_id: archetype.archetype_id, stable_id: archetype.board_stable_plugin_data_id });
      }
      for (const [nodeIndex, node] of archetype.nodes.entries()) {
        if (selectedArchetypeNodeStableIds && !selectedArchetypeNodeStableIds.has(node.stable_plugin_data_id)) continue;
        if (managed(penpot, node.stable_plugin_data_id).length) continue;
        requireActivePage(penpot, archetype.target_page, node.stable_plugin_data_id);
        if (node.node_kind === 'gap_placeholder') {
          const gap = createGap(penpot, node); gap.x = 24 + (nodeIndex % 2) * 360; gap.y = 32 + Math.floor(nodeIndex / 2) * 132; board.appendChild(gap); created += 1;
          await checkpoint({ phase: 'archetype-gap', archetype_id: archetype.archetype_id, stable_id: node.stable_plugin_data_id });
        }
        else {
          const component = dependencyComponents.get(node.entity_ref); requireValue(component, 'ACS_PENPOT_ARCHETYPE_FK', `missing component ${node.entity_ref}`);
          const instance = component.instance(); instance.x = 24 + (nodeIndex % 2) * 360; instance.y = 32 + Math.floor(nodeIndex / 2) * 132;
          setData(instance, 'stable_id', node.stable_plugin_data_id); setData(instance, 'object_kind', node.node_kind); setData(instance, 'detached', false); board.appendChild(instance); created += 1;
          await checkpoint({ phase: 'archetype-instance', archetype_id: archetype.archetype_id, stable_id: node.stable_plugin_data_id });
        }
      }
    }
    if (partial) {
      const batch = batchReadback(penpot, revisionBefore);
      requireValue(batch.duplicate_stable_ids.length === 0 && batch.detached_copies.length === 0, 'ACS_PENPOT_READBACK', 'bounded materialization read-back contains duplicates or detached copies', batch);
      return { status: 'PASS_PARTIAL', created, operations, readback: batch };
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

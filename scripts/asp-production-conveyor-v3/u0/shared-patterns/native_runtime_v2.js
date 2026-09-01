'use strict';

const crypto = require('node:crypto');

const TONES = Object.freeze({
  neutral: '#E1D3C2',
  info: '#1F658D',
  brand: '#A54821',
  warning: '#8A5A08',
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' ? value : stableStringify(value)).digest('hex');
}

function children(shape) {
  return Array.from(shape?.children || []);
}

function walk(shape) {
  return shape ? [shape, ...children(shape).flatMap(walk)] : [];
}

function pluginGet(target, namespace, key) {
  return target?.getSharedPluginData?.(namespace, key) || '';
}

function setSharedString(target, namespace, key, value) {
  if (typeof value !== 'string') throw new TypeError(`PLUGIN_DATA_STRING_REQUIRED:${key}`);
  target.setSharedPluginData(namespace, key, value);
}

function mark(target, namespace, values) {
  for (const [key, value] of Object.entries(values)) setSharedString(target, namespace, key, value);
}

function assertActiveLease(lease, boundary) {
  if (!lease || lease.active !== true || lease.cancelled === true) {
    const error = new Error(`LEASE_NOT_ACTIVE:${boundary}`);
    error.code = 'LEASE_NOT_ACTIVE';
    throw error;
  }
}

function assertExecutionMode(lease, successor) {
  if (lease?.native_like === true && successor.authorization.native_like_test_execution_authorized === true) return;
  const gates = Object.values(successor.execution.real_penpot_gates || {});
  assert(successor.authorization.real_penpot_execution_authorized === true && gates.length > 0 && gates.every((gate) => gate.state === 'PASS'), 'REAL_PENPOT_EXECUTION_GATED');
}

function mutate(penpot, lease, boundary, operation) {
  assertActiveLease(lease, `before:${boundary}`);
  const token = penpot.history.undoBlockBegin();
  try {
    return operation();
  } finally {
    penpot.history.undoBlockFinish(token);
    assertActiveLease(lease, `after:${boundary}`);
  }
}

function shapeProjection(shape) {
  const component = shape?.component?.();
  return {
    id: shape.id,
    type: shape.type,
    name: shape.name,
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height,
    hidden: shape.hidden === true,
    visible: shape.visible !== false,
    component_id: component?.id || null,
    text: shape.characters ?? shape.text ?? null,
    fills: shape.fills || [],
    strokes: shape.strokes || [],
    borderRadius: shape.borderRadius ?? null,
    clipContent: shape.clipContent ?? null,
    opacity: shape.opacity ?? 1,
    layout: {
      mode: shape.layoutMode ?? null, direction: shape.flexDirection ?? null,
      gap: shape.layoutGap ?? null, padding: shape.layoutPadding ?? null,
      align: shape.layoutAlign ?? null, wrap: shape.layoutWrap ?? null,
      gridColumns: shape.gridColumns ?? null,
    },
    plugin_data: shape?._pluginData ? [...shape._pluginData.entries()].sort() : null,
    children: children(shape).map(shapeProjection),
  };
}

function protectedProjection(penpot, namespace, packageId) {
  const pages = Array.from(penpot.currentFile.pages || [])
    .filter((page) => pluginGet(page, namespace, 'package-id') !== packageId)
    .sort((left, right) => left.id.localeCompare(right.id));
  const foreignComponents = Array.from(penpot.library?.local?.components || [])
    .filter((component) => pluginGet(component.mainInstance?.(), namespace, 'package-id') !== packageId)
    .map((component) => ({ id: component.id, name: component.name, path: component.path, main: shapeProjection(component.mainInstance?.()), plugin_data: component?._pluginData ? [...component._pluginData.entries()].sort() : null }))
    .sort((a, b) => a.id.localeCompare(b.id));
  const canonical = stableStringify({ pages: pages.map((page) => ({ id: page.id, name: page.name, plugin_data: page?._pluginData ? [...page._pluginData.entries()].sort() : null, root: shapeProjection(page.root) })), foreignComponents });
  return { chars: canonical.length, bytes: Buffer.byteLength(canonical), sha256: sha256(canonical) };
}

function sourceLineage(successor, componentId) {
  return stableStringify(successor.component_source_lineage[componentId]);
}

function validateSuccessor(successor, predecessor, productContract, nativeContract) {
  const errors = [];
  if (successor?.schema_version !== 'kenigevents.u0-native-page-successor.v2') errors.push('SUCCESSOR_SCHEMA');
  if (successor?.directive_id !== 'RD-U0-U-SHARED-PATTERNS') errors.push('DIRECTIVE_ID');
  if (successor?.package_id !== predecessor?.package_id || successor?.package_id !== nativeContract?.package_id) errors.push('PACKAGE_ID');
  if (nativeContract?.extends !== successor?.predecessor?.product_contract?.path) errors.push('CONTRACT_EXTENSION');
  if (productContract?.contract_id !== successor?.package_id) errors.push('PRODUCT_CONTRACT_ID');
  if (successor?.execution?.metadata_only_ensure_forbidden !== true) errors.push('METADATA_ONLY_NOT_FORBIDDEN');
  if (successor?.execution?.plugin_data_value_type !== 'string-only') errors.push('PLUGIN_DATA_TYPE');
  if (successor?.atlas_extension_request?.git_blob_sha1 !== '4eb5d0b9c87100c9811001bcb776d865efa61f00') errors.push('ATLAS_REQUEST_BLOB');
  if (successor?.boundaries?.atlas_page_order_assigned !== false) errors.push('ATLAS_PAGE_ORDER');
  if (successor?.page_units?.length !== 6) errors.push('PAGE_UNIT_COUNT');
  if (Object.keys(nativeContract?.components || {}).length !== 7) errors.push('COMPONENT_COUNT');
  if (Object.keys(nativeContract?.specimens || {}).length !== 22) errors.push('SPECIMEN_COUNT');
  if (nativeContract?.authority?.style_owner?.git_blob_sha1 !== '4d54d3c59f8f1a4e844953edf8d9c86078ccb8c1') errors.push('STYLE_OWNER_BLOB');

  const predecessorUnits = new Map((predecessor?.page_units || []).map((unit) => [unit.unit_id, unit]));
  const productComponents = new Map((productContract?.patterns || []).flatMap((pattern) => pattern.components).map((component) => [component.component_id, component]));
  for (const unit of successor?.page_units || []) {
    const predecessorUnit = predecessorUnits.get(unit.unit_id);
    if (!predecessorUnit) errors.push(`UNKNOWN_UNIT:${unit.unit_id}`);
    if (unit.page_name !== predecessorUnit?.page_name || unit.root_name !== predecessorUnit?.root_name) errors.push(`PAGE_IDENTITY:${unit.unit_id}`);
    for (const componentId of unit.component_ids || []) {
      const native = nativeContract.components?.[componentId];
      const product = productComponents.get(componentId);
      const lineage = successor.component_source_lineage?.[componentId];
      if (!native || !product) errors.push(`COMPONENT_CONTRACT:${componentId}`);
      if (stableStringify(native?.anatomy) !== stableStringify(product?.anatomy)) errors.push(`ANATOMY_DRIFT:${componentId}`);
      if (stableStringify(native?.states) !== stableStringify(product?.states)) errors.push(`STATE_DRIFT:${componentId}`);
      if (stableStringify(native?.source_consumers) !== stableStringify(product?.source_consumers)) errors.push(`CONSUMER_DRIFT:${componentId}`);
      if (!Array.isArray(lineage) || stableStringify(lineage.map((entry) => entry.role)) !== stableStringify(product?.source_consumers)) errors.push(`SOURCE_LINEAGE:${componentId}`);
      for (const binding of lineage || []) {
        if (!/^site\//.test(binding.path) || !/^[0-9a-f]{40}$/.test(binding.git_blob_sha1)) errors.push(`SOURCE_BINDING:${componentId}:${binding.role}`);
      }
      if (stableStringify((native?.anatomy_nodes || []).map((node) => node.key)) !== stableStringify(product?.anatomy)) errors.push(`VISIBLE_ANATOMY_DRIFT:${componentId}`);
    }
    for (const specimenId of unit.specimen_ids || []) {
      const specimen = nativeContract.specimens?.[specimenId];
      if (!specimen || specimen.unit_id !== unit.unit_id || !unit.component_ids.includes(specimen.component_id)) errors.push(`SPECIMEN_BINDING:${specimenId}`);
      if (!nativeContract.components?.[specimen?.component_id]?.states.includes(specimen?.state)) errors.push(`SPECIMEN_STATE:${specimenId}`);
      if (!Array.isArray(specimen?.visible_anatomy) || specimen.visible_anatomy.length === 0) errors.push(`EMPTY_SPECIMEN:${specimenId}`);
    }
  }
  return errors;
}

function setGeometry(shape, parent, geometry) {
  shape.x = (parent?.x || 0) + geometry.x;
  shape.y = (parent?.y || 0) + geometry.y;
  shape.resize(geometry.width, geometry.height);
}

function setSurface(shape, { fill, stroke, stroke_width: strokeWidth = 0, radius = 0, clip_content: clipContent = false }) {
  shape.fills = fill ? [{ fillColor: fill, fillOpacity: 1 }] : [];
  shape.strokes = stroke ? [{ strokeColor: stroke, strokeOpacity: 1, strokeStyle: 'solid', strokeWidth, strokeAlignment: 'inner' }] : [];
  shape.borderRadius = radius;
  shape.clipContent = clipContent;
}

function setNativeLayout(shape, layout) {
  assert(layout && ['grid', 'flex', 'text'].includes(layout.mode), `NATIVE_LAYOUT_REQUIRED:${shape.name}`);
  shape.layoutMode = layout.mode;
  shape.flexDirection = layout.direction;
  shape.layoutGap = layout.gap;
  shape.layoutPadding = layout.padding;
  shape.layoutAlign = layout.align;
  shape.layoutWrap = layout.wrap;
  shape.gridColumns = layout.grid_columns || null;
}

function createText(penpot, parent, spec) {
  const text = penpot.createText(spec.text);
  assert(text, `TEXT_CREATE_FAILED:${spec.key || spec.text}`);
  text.name = spec.name || `Text · ${spec.key}`;
  setGeometry(text, parent, spec);
  text.fontFamily = spec.font_family || 'Inter';
  text.fontSize = spec.font_size || '13';
  text.fontWeight = spec.font_weight || '500';
  text.lineHeight = spec.line_height || '1.35';
  text.growType = 'fixed';
  text.fills = [{ fillColor: spec.text_color || '#221A14', fillOpacity: 1 }];
  parent.appendChild(text);
  return text;
}

function createAnatomyNode(penpot, lease, parent, namespace, componentId, node, created) {
  return mutate(penpot, lease, `anatomy:${componentId}:${node.key}`, () => {
    let shape;
    if (node.kind === 'text') {
      shape = createText(penpot, parent, { ...node, name: `Anatomy · ${node.key}` });
    } else {
      shape = penpot.createBoard();
      shape.name = `Anatomy · ${node.key}`;
      setGeometry(shape, parent, node);
      setSurface(shape, { fill: node.fill, stroke: '#E1D3C2', stroke_width: 1, radius: node.radius, clip_content: true });
      parent.appendChild(shape);
      createText(penpot, shape, {
        key: `${node.key}-label`, text: node.text, x: 12, y: Math.max(4, Math.floor((node.height - Number(node.font_size)) / 2) - 2),
        width: Math.max(20, node.width - 24), height: Math.max(16, node.height - 8), font_size: node.font_size,
        font_weight: node.font_weight, text_color: node.text_color,
      });
      created.value += 1;
    }
    setNativeLayout(shape, node.native_layout);
    mark(shape, namespace, { 'stable-id': `anatomy/${componentId}/${node.key}`, 'anatomy-key': node.key, 'component-id': componentId, 'native-visible-content': 'true', 'source-css-class': node.source_css_class, 'layout-spec': stableStringify(node.native_layout) });
    created.value += 1;
    return shape;
  });
}

function managedPages(penpot, successor) {
  const namespace = successor.execution.namespace;
  return Array.from(penpot.currentFile.pages || []).filter((page) => pluginGet(page, namespace, 'package-id') === successor.package_id);
}

function findPage(penpot, successor, unit) {
  const namespace = successor.execution.namespace;
  const candidates = Array.from(penpot.currentFile.pages || []).filter((page) =>
    (pluginGet(page, namespace, 'package-id') === successor.package_id && pluginGet(page, namespace, 'unit-id') === unit.unit_id) || page.name === unit.page_name);
  const unique = [...new Map(candidates.map((page) => [page.id, page])).values()];
  assert(unique.length <= 1, `DUPLICATE_PAGE:${unit.unit_id}`);
  if (unique.length) {
    assert(pluginGet(unique[0], namespace, 'package-id') === successor.package_id, `FOREIGN_PAGE:${unit.unit_id}`);
    assert(pluginGet(unique[0], namespace, 'unit-id') === unit.unit_id, `FOREIGN_PAGE_LINEAGE:${unit.unit_id}`);
  }
  return unique[0] || null;
}

function findByStable(root, namespace, stableId, includeCopyDescendants = false) {
  return walk(root).filter((shape) => {
    if (pluginGet(shape, namespace, 'stable-id') !== stableId) return false;
    if (includeCopyDescendants) return true;
    let parent = shape.parent;
    while (parent && parent !== root) {
      if (parent.isComponentCopyInstance?.()) return false;
      parent = parent.parent;
    }
    return true;
  });
}

function localComponents(penpot, namespace, componentId) {
  return Array.from(penpot.library.local.components || []).filter((component) => pluginGet(component.mainInstance?.(), namespace, 'component-id') === componentId);
}

function createPage(penpot, lease, successor, unit, created) {
  return mutate(penpot, lease, `page:${unit.unit_id}`, () => {
    const page = penpot.createPage();
    page.name = unit.page_name;
    mark(page, successor.execution.namespace, {
      'package-id': successor.package_id, 'unit-id': unit.unit_id,
      'source-head': successor.source_authority.head, 'source-tree': successor.source_authority.tree,
      'candidate-label': 'CANDIDATE_BUILD_NOT_ACCEPTED', 'atlas-extension-binding': 'PENDING_O0',
    });
    created.value += 1;
    return page;
  });
}

function rootHeight(unit, nativeContract) {
  const layout = nativeContract.page_layout;
  const rows = Math.ceil(unit.specimen_ids.length / layout.review_columns);
  const reviewHeight = rows * layout.review_cell_height + Math.max(0, rows - 1) * layout.row_gap;
  const masterHeight = unit.component_ids.length * layout.component_master_height + Math.max(0, unit.component_ids.length - 1) * layout.component_master_gap;
  return layout.content_start_y + Math.max(reviewHeight, masterHeight) + layout.bottom_padding;
}

function createRoot(penpot, lease, successor, nativeContract, page, unit, created) {
  return mutate(penpot, lease, `root:${unit.unit_id}`, () => {
    const root = penpot.createBoard();
    root.name = unit.root_name;
    root.x = 0;
    root.y = 0;
    root.resize(nativeContract.page_layout.root_width, rootHeight(unit, nativeContract));
    setSurface(root, { fill: nativeContract.palette.canvas, stroke: nativeContract.palette.line, stroke_width: 1, radius: 0, clip_content: false });
    mark(root, successor.execution.namespace, {
      'stable-id': `root/${unit.unit_id}`, 'package-id': successor.package_id, 'unit-id': unit.unit_id,
      'source-head': successor.source_authority.head, 'source-tree': successor.source_authority.tree,
      'candidate-label': 'CANDIDATE_BUILD_NOT_ACCEPTED', 'atlas-extension-binding': 'PENDING_O0',
    });
    page.root.appendChild(root);
    createText(penpot, root, { key: 'page-title', text: unit.page_name, x: 48, y: 40, width: 1500, height: 38, font_family: 'Inter', font_size: '24', font_weight: '800', line_height: '1.15', text_color: nativeContract.palette.ink });
    created.value += 2;
    return root;
  });
}

function createMaster(penpot, lease, successor, nativeContract, root, unit, componentId, index, created) {
  const namespace = successor.execution.namespace;
  const visual = nativeContract.components[componentId];
  return mutate(penpot, lease, `master:${componentId}`, () => {
    const master = penpot.createBoard();
    master.name = `Shared Pattern / ${componentId}`;
    const layout = nativeContract.page_layout;
    setGeometry(master, root, {
      x: layout.master_column_x,
      y: layout.content_start_y + index * (layout.component_master_height + layout.component_master_gap),
      width: visual.master.width,
      height: visual.master.height,
    });
    setSurface(master, visual.master);
    setNativeLayout(master, visual.native_layout);
    const lineage = sourceLineage(successor, componentId);
    mark(master, namespace, {
      'stable-id': `master/${componentId}`, 'package-id': successor.package_id, 'unit-id': unit.unit_id,
      'component-id': componentId, 'source-lineage': lineage, 'source-consumers': stableStringify(visual.source_consumers),
      anatomy: stableStringify(visual.anatomy), states: stableStringify(visual.states),
      'responsive-behavior': visual.responsive_behavior, dependencies: stableStringify(visual.dependencies),
      'native-master': 'true', 'candidate-label': 'CANDIDATE_BUILD_NOT_ACCEPTED',
    });
    root.appendChild(master);
    created.value += 1;
    return master;
  });
}

function createComponent(penpot, lease, successor, master, componentId, created) {
  return mutate(penpot, lease, `component:${componentId}`, () => {
    const component = penpot.library.local.createComponent([master]);
    component.name = componentId;
    component.path = 'U0 / Shared Patterns / Native R2';
    created.value += 1;
    return component;
  });
}

function applySpecimenState(instance, namespace, componentId, specimen, componentContract) {
  const visible = new Set(specimen.visible_anatomy);
  const anatomy = walk(instance).filter((shape) => pluginGet(shape, namespace, 'component-id') === componentId && pluginGet(shape, namespace, 'anatomy-key'));
  assert(anatomy.length > 0, `VISIBLE_ANATOMY_MISSING:${componentId}`);
  const mobile = specimen.source_viewport.width <= 480;
  let mobileY = 14;
  for (const shape of anatomy) {
    const key = pluginGet(shape, namespace, 'anatomy-key');
    const node = componentContract.anatomy_nodes.find((candidate) => candidate.key === key);
    assert(node, `ANATOMY_CONTRACT_MISSING:${componentId}:${key}`);
    const isVisible = visible.has(key);
    shape.hidden = !isVisible;
    shape.visible = isVisible;
    const nodeStyle = specimen.state_style.node_styles[key] || { opacity: 1, fill: node.fill, stroke: node.kind === 'text' ? null : '#E1D3C2', stroke_width: node.kind === 'text' ? 0 : 1, radius: node.radius };
    if (isVisible) assert(specimen.state_style.node_styles[key], `STATE_STYLE_MISSING:${componentId}:${specimen.state}:${key}`);
    shape.opacity = nodeStyle.opacity;
    if (shape.type === 'text') {
      shape.strokes = nodeStyle.stroke ? [{ strokeColor: nodeStyle.stroke, strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: nodeStyle.stroke_width, strokeAlignment: 'inner' }] : [];
      shape.borderRadius = nodeStyle.radius;
    } else setSurface(shape, { fill: nodeStyle.fill, stroke: nodeStyle.stroke, stroke_width: nodeStyle.stroke_width, radius: nodeStyle.radius, clip_content: shape.clipContent });
    if (isVisible) {
      shape.x = instance.x + (mobile ? 14 : node.x);
      shape.y = instance.y + (mobile ? mobileY : node.y);
      shape.resize(mobile ? Math.min(332, Math.max(80, node.width)) : node.width, node.height);
      if (mobile) mobileY += node.height + 7;
      const nestedText = shape.type === 'text' ? null : children(shape).find((child) => child.type === 'text');
      if (nestedText) {
        nestedText.x = shape.x + 12; nestedText.y = shape.y + Math.max(4, Math.floor((shape.height - Number(node.font_size)) / 2) - 2);
        nestedText.resize(Math.max(20, shape.width - 24), Math.max(16, shape.height - 8));
      }
    }
    if (specimen.label_overrides[key]) {
      const label = specimen.label_overrides[key];
      const text = shape.type === 'text' ? shape : walk(shape).find((child) => child.type === 'text');
      assert(text, `STATE_TEXT_MISSING:${componentId}:${key}`);
      text.characters = label;
      setSharedString(shape, namespace, 'state-label-override', label);
    }
  }
  instance.resize(mobile ? 360 : 520, 200);
  instance.clipContent = true;
  setNativeLayout(instance, specimen.state_style.layout);
  mark(instance, namespace, {
    state: specimen.state, 'source-viewport': stableStringify(specimen.source_viewport),
    'visible-anatomy': stableStringify(specimen.visible_anatomy), 'label-overrides': stableStringify(specimen.label_overrides),
    tone: specimen.tone, 'style-id': specimen.state_style.style_id,
    'source-css-blob': specimen.state_style.source_css_blob,
    selected: stableStringify(specimen.state_style.selected_anatomy),
    current: stableStringify(specimen.state_style.current_anatomy),
    pinned: specimen.state_style.pinned ? 'true' : 'false',
    loading: specimen.state_style.loading ? 'true' : 'false',
    'layout-spec': stableStringify(specimen.state_style.layout),
  });
}

function createSpecimen(penpot, lease, successor, nativeContract, root, unit, specimenId, index, component, created) {
  const namespace = successor.execution.namespace;
  const specimen = nativeContract.specimens[specimenId];
  return mutate(penpot, lease, `specimen:${specimenId}`, () => {
    const layout = nativeContract.page_layout;
    const col = index % layout.review_columns;
    const row = Math.floor(index / layout.review_columns);
    const wrapper = penpot.createBoard();
    wrapper.name = `Linked specimen / ${specimenId}`;
    setGeometry(wrapper, root, {
      x: layout.review_grid_x + col * (layout.review_cell_width + layout.column_gap),
      y: layout.content_start_y + row * (layout.review_cell_height + layout.row_gap),
      width: layout.review_cell_width,
      height: layout.review_cell_height,
    });
    setSurface(wrapper, { fill: nativeContract.palette.surface_strong, stroke: TONES[specimen.tone], stroke_width: 2, radius: 20, clip_content: true });
    mark(wrapper, namespace, { 'stable-id': `specimen/${specimenId}`, 'specimen-id': specimenId, 'package-id': successor.package_id, 'unit-id': unit.unit_id, 'component-id': specimen.component_id, state: specimen.state, 'source-lineage': sourceLineage(successor, specimen.component_id), screenshot: 'false' });
    root.appendChild(wrapper);
    createText(penpot, wrapper, { key: `${specimenId}-state`, text: `${specimen.state} · ${specimen.source_viewport.width}px`, x: 16, y: 10, width: 520, height: 20, font_family: 'Inter', font_size: '12', font_weight: '700', line_height: '1.2', text_color: TONES[specimen.tone] });
    const instance = component.instance();
    assert(instance?.isComponentCopyInstance?.() && instance.component?.()?.id === component.id, `DETACHED_INSTANCE_CREATED:${specimenId}`);
    instance.name = `Linked / ${specimenId}`;
    instance.x = wrapper.x + 16;
    instance.y = wrapper.y + 38;
    mark(instance, namespace, { 'stable-id': `instance/${specimenId}`, 'specimen-id': specimenId, 'package-id': successor.package_id, 'unit-id': unit.unit_id, 'component-id': specimen.component_id, 'source-lineage': sourceLineage(successor, specimen.component_id), detached: 'false', screenshot: 'false' });
    wrapper.appendChild(instance);
    applySpecimenState(instance, namespace, specimen.component_id, specimen, nativeContract.components[specimen.component_id]);
    created.value += 3;
    return wrapper;
  });
}

function assertNoScreenshotImplementation(root) {
  const screenshots = walk(root).filter((shape) => shape.type === 'image' || Array.from(shape.fills || []).some((fill) => fill.fillImage));
  assert(screenshots.length === 0, 'SCREENSHOT_IMPLEMENTATION');
}

function assertSurface(shape, spec, code) {
  const fill = shape.fills?.[0]?.fillColor || null;
  const stroke = shape.strokes?.[0]?.strokeColor || null;
  assert(fill === (spec.fill || null) && stroke === (spec.stroke || null), `${code}:SURFACE`);
  assert((shape.strokes?.[0]?.strokeWidth || 0) === (spec.stroke_width || 0), `${code}:STROKE_WIDTH`);
  assert(shape.borderRadius === (spec.radius || 0), `${code}:RADIUS`);
}

function assertLayout(shape, spec, code) {
  assert(shape.layoutMode === spec.mode && shape.flexDirection === spec.direction, `${code}:LAYOUT_MODE`);
  assert(shape.layoutGap === spec.gap && shape.layoutPadding === spec.padding && shape.layoutAlign === spec.align && shape.layoutWrap === spec.wrap, `${code}:LAYOUT_VALUES`);
  assert((shape.gridColumns || null) === (spec.grid_columns || null), `${code}:GRID_COLUMNS`);
}

function readback(penpot, successor, nativeContract) {
  const namespace = successor.execution.namespace;
  const counts = { pages: 0, roots: 0, component_masters: 0, linked_visible_specimens: 0, duplicates: 0, detached: 0, screenshots: 0 };
  const lineage = {};
  for (const unit of successor.page_units) {
    const page = findPage(penpot, successor, unit);
    assert(page, `PAGE_MISSING:${unit.unit_id}`);
    assert(pluginGet(page, namespace, 'source-head') === successor.source_authority.head && pluginGet(page, namespace, 'source-tree') === successor.source_authority.tree, `PAGE_SOURCE_LINEAGE:${unit.unit_id}`);
    counts.pages += 1;
    const roots = findByStable(page.root, namespace, `root/${unit.unit_id}`);
    assert(roots.length === 1, `ROOT_CENSUS:${unit.unit_id}`);
    const root = roots[0];
    assert(pluginGet(root, namespace, 'source-head') === successor.source_authority.head && pluginGet(root, namespace, 'source-tree') === successor.source_authority.tree, `ROOT_SOURCE_LINEAGE:${unit.unit_id}`);
    counts.roots += 1;
    assert(root.width === nativeContract.page_layout.root_width && root.height === rootHeight(unit, nativeContract), `ROOT_GEOMETRY:${unit.unit_id}`);
    assertSurface(root, { fill: nativeContract.palette.canvas, stroke: nativeContract.palette.line, stroke_width: 1, radius: 0 }, `ROOT:${unit.unit_id}`);
    const pageTitle = children(root).find((shape) => shape.type === 'text' && shape.characters === unit.page_name);
    assert(pageTitle && pageTitle.x === root.x + 48 && pageTitle.y === root.y + 40, `ROOT_TITLE:${unit.unit_id}`);
    assertNoScreenshotImplementation(root);

    const managedStable = walk(root).filter((shape) => pluginGet(shape, namespace, 'stable-id') && !isInsideComponentCopy(shape, root));
    const stableIds = managedStable.map((shape) => pluginGet(shape, namespace, 'stable-id'));
    assert(new Set(stableIds).size === stableIds.length, `DUPLICATE_STABLE_ID:${unit.unit_id}`);

    for (const componentId of unit.component_ids) {
      const masters = findByStable(root, namespace, `master/${componentId}`);
      const components = localComponents(penpot, namespace, componentId);
      assert(masters.length === 1 && components.length === 1 && components[0].mainInstance?.()?.id === masters[0].id, `MASTER_COMPONENT_CENSUS:${componentId}`);
      assert(components[0].name === componentId && components[0].path === 'U0 / Shared Patterns / Native R2', `COMPONENT_LIBRARY_IDENTITY:${componentId}`);
      const expectedLineage = sourceLineage(successor, componentId);
      assert(pluginGet(masters[0], namespace, 'source-lineage') === expectedLineage, `MASTER_SOURCE_LINEAGE:${componentId}`);
      const contract = nativeContract.components[componentId];
      const master = masters[0];
      assert(master.width === contract.master.width && master.height === contract.master.height, `MASTER_GEOMETRY:${componentId}`);
      assertSurface(master, contract.master, `MASTER:${componentId}`);
      assertLayout(master, contract.native_layout, `MASTER:${componentId}`);
      for (const node of contract.anatomy_nodes) {
        const matches = children(master).filter((shape) => pluginGet(shape, namespace, 'anatomy-key') === node.key);
        assert(matches.length === 1, `MASTER_ANATOMY_CENSUS:${componentId}:${node.key}`);
        const shape = matches[0];
        assert(shape.x === master.x + node.x && shape.y === master.y + node.y && shape.width === node.width && shape.height === node.height, `MASTER_ANATOMY_GEOMETRY:${componentId}:${node.key}`);
        const text = shape.type === 'text' ? shape : children(shape).find((child) => child.type === 'text');
        assert(text?.characters === node.text, `MASTER_ANATOMY_TEXT:${componentId}:${node.key}`);
        assert(text.fontSize === node.font_size && text.fontWeight === node.font_weight && text.fills?.[0]?.fillColor === node.text_color, `MASTER_ANATOMY_TYPOGRAPHY:${componentId}:${node.key}`);
        assert(pluginGet(shape, namespace, 'source-css-class') === node.source_css_class, `MASTER_ANATOMY_SOURCE_STYLE:${componentId}:${node.key}`);
        assertLayout(shape, node.native_layout, `MASTER_ANATOMY:${componentId}:${node.key}`);
      }
      lineage[componentId] = sha256(expectedLineage);
      counts.component_masters += 1;
    }
    for (const specimenId of unit.specimen_ids) {
      const wrappers = findByStable(root, namespace, `specimen/${specimenId}`);
      const instances = findByStable(root, namespace, `instance/${specimenId}`, true).filter((shape) => shape.isComponentCopyInstance?.());
      assert(wrappers.length === 1 && instances.length === 1, `SPECIMEN_CENSUS:${specimenId}`);
      const instance = instances[0];
      const specimen = nativeContract.specimens[specimenId];
      assert(instance.component?.() && pluginGet(instance, namespace, 'component-id') === specimen.component_id, `DETACHED_INSTANCE:${specimenId}`);
      assert(pluginGet(instance, namespace, 'source-lineage') === sourceLineage(successor, specimen.component_id), `SPECIMEN_SOURCE_LINEAGE:${specimenId}`);
      assert(instance.visible !== false && children(instance).some((shape) => shape.visible !== false && shape.hidden !== true), `SPECIMEN_NOT_VISIBLE:${specimenId}`);
      assert(pluginGet(instance, namespace, 'style-id') === specimen.state_style.style_id && pluginGet(instance, namespace, 'source-css-blob') === nativeContract.authority.style_owner.git_blob_sha1, `SPECIMEN_STYLE_AUTHORITY:${specimenId}`);
      assert(pluginGet(instance, namespace, 'selected') === stableStringify(specimen.state_style.selected_anatomy), `SPECIMEN_SELECTED_STATE:${specimenId}`);
      assert(pluginGet(instance, namespace, 'current') === stableStringify(specimen.state_style.current_anatomy), `SPECIMEN_CURRENT_STATE:${specimenId}`);
      assert(pluginGet(instance, namespace, 'pinned') === (specimen.state_style.pinned ? 'true' : 'false'), `SPECIMEN_PINNED_STATE:${specimenId}`);
      assert(pluginGet(instance, namespace, 'loading') === (specimen.state_style.loading ? 'true' : 'false'), `SPECIMEN_LOADING_STATE:${specimenId}`);
      assertLayout(instance, specimen.state_style.layout, `SPECIMEN:${specimenId}`);
      const expectedVisible = new Set(specimen.visible_anatomy);
      const anatomy = walk(instance).filter((shape) => pluginGet(shape, namespace, 'anatomy-key'));
      assert(anatomy.length === nativeContract.components[specimen.component_id].anatomy_nodes.length, `SPECIMEN_ANATOMY_CENSUS:${specimenId}`);
      const mobile = specimen.source_viewport.width <= 480;
      let mobileY = 14;
      for (const shape of anatomy) {
        const key = pluginGet(shape, namespace, 'anatomy-key');
        assert((shape.visible !== false && shape.hidden !== true) === expectedVisible.has(key), `SPECIMEN_ANATOMY_VISIBILITY:${specimenId}:${key}`);
        if (expectedVisible.has(key)) {
          const node = nativeContract.components[specimen.component_id].anatomy_nodes.find((candidate) => candidate.key === key);
          const expectedX = instance.x + (mobile ? 14 : node.x);
          const expectedY = instance.y + (mobile ? mobileY : node.y);
          assert(shape.x === expectedX && shape.y === expectedY && shape.width === (mobile ? Math.min(332, Math.max(80, node.width)) : node.width) && shape.height === node.height, `SPECIMEN_ANATOMY_GEOMETRY:${specimenId}:${key}`);
          if (mobile) mobileY += node.height + 7;
          const style = specimen.state_style.node_styles[key];
          if (shape.type !== 'text') assertSurface(shape, style, `SPECIMEN_ANATOMY:${specimenId}:${key}`);
          assert(shape.opacity === style.opacity, `SPECIMEN_ANATOMY_OPACITY:${specimenId}:${key}`);
          const expectedText = specimen.label_overrides[key] || nativeContract.components[specimen.component_id].anatomy_nodes.find((node) => node.key === key).text;
          const text = shape.type === 'text' ? shape : children(shape).find((child) => child.type === 'text');
          assert(text?.characters === expectedText, `SPECIMEN_ANATOMY_TEXT:${specimenId}:${key}`);
        }
      }
      counts.linked_visible_specimens += 1;
    }
  }
  const validation = penpot.currentFile.validate() || [];
  assert(validation.length === 0, 'PENPOT_VALIDATION_DRIFT');
  for (const key of ['pages', 'roots', 'component_masters', 'linked_visible_specimens', 'duplicates', 'detached', 'screenshots']) {
    assert(counts[key] === successor.acceptance[key], `ACCEPTANCE_CENSUS_DRIFT:${key}`);
  }
  return { counts, validation, source_lineage_sha256: lineage };
}

function isInsideComponentCopy(shape, boundary) {
  let parent = shape.parent;
  while (parent && parent !== boundary) {
    if (parent.isComponentCopyInstance?.()) return true;
    parent = parent.parent;
  }
  return false;
}

async function runNativeSuccessor({ penpot, storage, lease, successor, predecessor, productContract, nativeContract }) {
  assert(penpot && typeof penpot.createPage === 'function' && typeof penpot.createBoard === 'function' && typeof penpot.createText === 'function' && typeof penpot.createRectangle === 'function', 'NATIVE_PENPOT_API_REQUIRED');
  assert(penpot.library?.local && typeof penpot.library.local.createComponent === 'function', 'NATIVE_COMPONENT_API_REQUIRED');
  assert(storage && typeof storage.set === 'function', 'STORAGE_SET_REQUIRED');
  assertActiveLease(lease, 'entry');
  assertExecutionMode(lease, successor);
  const validationErrors = validateSuccessor(successor, predecessor, productContract, nativeContract);
  if (validationErrors.length) throw new Error(`SUCCESSOR_VALIDATION_FAILED:${validationErrors.join('|')}`);
  assert(managedPages(penpot, successor).length <= 6, 'MANAGED_PAGE_CENSUS_PRECHECK');
  const beforeProtected = protectedProjection(penpot, successor.execution.namespace, successor.package_id);
  const priorReceipt = typeof storage.get === 'function' ? storage.get(`receipt:${successor.successor_id}`) : null;
  if (priorReceipt?.protected_projection_after) assert(stableStringify(beforeProtected) === stableStringify(priorReceipt.protected_projection_after), 'PROTECTED_PROJECTION_DRIFT');
  const created = { value: 0 };

  for (const unit of successor.page_units) {
    assertActiveLease(lease, `unit:${unit.unit_id}`);
    let page = findPage(penpot, successor, unit);
    if (!page) page = createPage(penpot, lease, successor, unit, created);
    if (penpot.currentPage?.id !== page.id) {
      assertActiveLease(lease, `before:open-page:${unit.unit_id}`);
      await penpot.openPage(page);
      assertActiveLease(lease, `after:open-page:${unit.unit_id}`);
    }
    let roots = findByStable(page.root, successor.execution.namespace, `root/${unit.unit_id}`);
    assert(roots.length <= 1, `DUPLICATE_ROOT:${unit.unit_id}`);
    let root = roots[0];
    if (!root) root = createRoot(penpot, lease, successor, nativeContract, page, unit, created);

    const components = new Map();
    for (const [index, componentId] of unit.component_ids.entries()) {
      const masters = findByStable(root, successor.execution.namespace, `master/${componentId}`);
      assert(masters.length <= 1, `DUPLICATE_MASTER:${componentId}`);
      let master = masters[0];
      if (!master) {
        master = createMaster(penpot, lease, successor, nativeContract, root, unit, componentId, index, created);
        for (const node of nativeContract.components[componentId].anatomy_nodes) createAnatomyNode(penpot, lease, master, successor.execution.namespace, componentId, node, created);
      }
      let local = localComponents(penpot, successor.execution.namespace, componentId);
      assert(local.length <= 1, `DUPLICATE_COMPONENT:${componentId}`);
      if (!local.length) local = [createComponent(penpot, lease, successor, master, componentId, created)];
      components.set(componentId, local[0]);
    }

    for (const [index, specimenId] of unit.specimen_ids.entries()) {
      const wrappers = findByStable(root, successor.execution.namespace, `specimen/${specimenId}`);
      assert(wrappers.length <= 1, `DUPLICATE_SPECIMEN:${specimenId}`);
      if (!wrappers.length) {
        const componentId = nativeContract.specimens[specimenId].component_id;
        createSpecimen(penpot, lease, successor, nativeContract, root, unit, specimenId, index, components.get(componentId), created);
      }
    }
  }

  const readbackResult = readback(penpot, successor, nativeContract);
  const afterProtected = protectedProjection(penpot, successor.execution.namespace, successor.package_id);
  assert(stableStringify(afterProtected) === stableStringify(beforeProtected), 'PROTECTED_PROJECTION_DRIFT');
  const receipt = {
    schema_version: 'kenigevents.u0-native-successor-execution-receipt.v2',
    package_id: successor.package_id,
    successor_id: successor.successor_id,
    status: successor.status,
    created: created.value,
    second_run_created: created.value === 0 ? 0 : null,
    counts: readbackResult.counts,
    validation: readbackResult.validation,
    protected_projection_before: beforeProtected,
    protected_projection_after: afterProtected,
    source_lineage_sha256: readbackResult.source_lineage_sha256,
    atlas_extension_request_blob: successor.atlas_extension_request.git_blob_sha1,
    atlas_page_order_assigned: false,
    penpot_authorization: false,
    publish_authorization: false,
    screenshots: 0,
    detached: 0,
  };
  await storage.set(`receipt:${successor.successor_id}`, receipt);
  assertActiveLease(lease, 'after-receipt');
  return receipt;
}

module.exports = {
  assertActiveLease,
  assertExecutionMode,
  pluginGet,
  protectedProjection,
  readback,
  runNativeSuccessor,
  setSharedString,
  sha256,
  sourceLineage,
  stableStringify,
  validateSuccessor,
};

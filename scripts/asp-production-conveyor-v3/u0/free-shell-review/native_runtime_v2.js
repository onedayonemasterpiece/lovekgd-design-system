'use strict';

const crypto = require('node:crypto');

const MANAGED_KEYS = [
  'package-id', 'managed-id', 'node-role', 'component-id', 'specimen-id',
  'state', 'source-bindings', 'source-head', 'source-tree', 'anatomy-role',
  'layout', 'candidate-label', 'detached', 'screenshot', 'atlas-page-order-assigned',
  'scenario-state', 'source-style-evidence', 'asset-sha256', 'asset-bytes',
  'state-visibility', 'state-flags', 'state-layout',
  'native-layout-owner',
];

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function digest(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' ? value : canonical(value)).digest('hex');
}

function demand(condition, code) {
  if (!condition) {
    const error = new Error(code);
    error.code = code.split(':')[0];
    throw error;
  }
}

function put(node, namespace, key, value) {
  demand(typeof value === 'string', `PLUGIN_DATA_VALUE_NOT_STRING:${key}`);
  demand(node && typeof node.setSharedPluginData === 'function', `PLUGIN_DATA_TARGET_INVALID:${key}`);
  node.setSharedPluginData(namespace, key, value);
}

function get(node, namespace, key) {
  return node && typeof node.getSharedPluginData === 'function'
    ? node.getSharedPluginData(namespace, key) || ''
    : '';
}

function children(node) { return Array.from(node?.children || []); }
function walk(node) { return node ? [node, ...children(node).flatMap(walk)] : []; }

function append(parent, child) {
  demand(parent && typeof parent.appendChild === 'function', 'NATIVE_PARENT_REQUIRED');
  parent.appendChild(child);
}

function resize(node, width, height) {
  demand(Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0, 'INVALID_NATIVE_GEOMETRY');
  demand(typeof node.resize === 'function', 'NATIVE_RESIZE_REQUIRED');
  node.resize(width, height);
}

function position(node, x, y) {
  demand(Number.isFinite(x) && Number.isFinite(y), 'INVALID_NATIVE_POSITION');
  node.x = x;
  node.y = y;
}

function styleSurface(node, spec) {
  const opacity = Number(spec.opacity ?? 1);
  node.fills = [{ fillColor: spec.fill, fillOpacity: opacity }];
  node.strokes = [{ strokeColor: spec.border, strokeWidth: Number(spec.border_width ?? 1), strokeStyle: 'solid' }];
  const radius = spec.radius ?? 0;
  if (radius && typeof radius === 'object') {
    node.borderRadius = 0;
    node.borderRadiusTopLeft = radius.top_left;
    node.borderRadiusTopRight = radius.top_right;
    node.borderRadiusBottomRight = radius.bottom_right;
    node.borderRadiusBottomLeft = radius.bottom_left;
  } else {
    node.borderRadius = radius;
    node.borderRadiusTopLeft = radius;
    node.borderRadiusTopRight = radius;
    node.borderRadiusBottomRight = radius;
    node.borderRadiusBottomLeft = radius;
  }
  node.shadows = structuredClone(spec.shadows || []);
  node.blur = spec.blur ?? null;
  node.backgroundBlur = spec.background_blur ?? null;
  node.clipContent = false;
  node.opacity = opacity;
}

function styleText(node, color, size = '15', weight = '500', lineHeight = 'normal') {
  node.fontSize = size;
  node.fontWeight = weight;
  node.lineHeight = lineHeight;
  node.fills = [{ fillColor: color, fillOpacity: 1 }];
  node.growType = 'auto-width';
}

function sourceIndex(pkg) {
  return new Map(pkg.source_authority.files.map((item) => [item.role, item]));
}

function sourceBindings(component, pkg) {
  const index = sourceIndex(pkg);
  return component.source_consumers.map((role) => {
    const item = index.get(role);
    demand(item, `UNRESOLVED_SOURCE_ROLE:${component.component_id}:${role}`);
    demand(/^[0-9a-f]{40}$/.test(item.git_blob_sha1), `INVALID_SOURCE_BLOB:${role}`);
    return { role, path: item.path, git_blob_sha1: item.git_blob_sha1 };
  });
}

function assertActiveLease(lease, boundary) {
  demand(lease && lease.active === true && lease.cancelled !== true, `LEASE_NOT_ACTIVE:${boundary}`);
}

function projectedPluginData(node, namespace) {
  if (node?.pluginData instanceof Map) return [...node.pluginData.entries()].sort(([left], [right]) => left.localeCompare(right));
  if (typeof node?.enumerateAllPluginData === 'function') {
    const entries = node.enumerateAllPluginData();
    demand(Array.isArray(entries) && entries.every((entry) => Array.isArray(entry) && entry.length === 2 && typeof entry[0] === 'string' && typeof entry[1] === 'string'), 'PLUGIN_DATA_ENUMERATION_INVALID');
    return [...entries].sort(([left], [right]) => left.localeCompare(right));
  }
  demand(false, `PLUGIN_DATA_EXHAUSTIVE_ENUMERATION_REQUIRED:${node?.id || 'unknown'}`);
}

function projectedNativeLayout(node) {
  const common = (layout) => layout ? {
    alignItems: layout.alignItems ?? null, alignContent: layout.alignContent ?? null,
    justifyItems: layout.justifyItems ?? null, justifyContent: layout.justifyContent ?? null,
    rowGap: layout.rowGap, columnGap: layout.columnGap,
    topPadding: layout.topPadding, rightPadding: layout.rightPadding,
    bottomPadding: layout.bottomPadding, leftPadding: layout.leftPadding,
    horizontalSizing: layout.horizontalSizing, verticalSizing: layout.verticalSizing,
  } : null;
  return {
    flex: node.flex ? { ...common(node.flex), dir: node.flex.dir, wrap: node.flex.wrap } : null,
    grid: node.grid ? { ...common(node.grid), dir: node.grid.dir, rows: node.grid.rows || [], columns: node.grid.columns || [] } : null,
  };
}

function projectedShape(node, namespace) {
  const component = node?.component?.();
  return {
    id: node.id, type: node.type || '', name: node.name || '', characters: node.characters || '',
    x: node.x || 0, y: node.y || 0, width: node.width || 0, height: node.height || 0,
    fills: node.fills || [], strokes: node.strokes || [], borderRadius: node.borderRadius || 0,
    borderRadiusTopLeft: node.borderRadiusTopLeft ?? null, borderRadiusTopRight: node.borderRadiusTopRight ?? null,
    borderRadiusBottomRight: node.borderRadiusBottomRight ?? null, borderRadiusBottomLeft: node.borderRadiusBottomLeft ?? null,
    opacity: node.opacity ?? 1, hidden: node.hidden === true, visible: node.visible !== false,
    shadows: node.shadows || [], blur: node.blur ?? null, backgroundBlur: node.backgroundBlur ?? null,
    blendMode: node.blendMode || '', rotation: node.rotation ?? 0, flipX: node.flipX === true, flipY: node.flipY === true,
    blocked: node.blocked === true, proportionLock: node.proportionLock === true, fixedWhenScrolling: node.fixedWhenScrolling === true,
    constraintsHorizontal: node.constraintsHorizontal || '', constraintsVertical: node.constraintsVertical || '',
    horizontalSizing: node.horizontalSizing || '', verticalSizing: node.verticalSizing || '',
    layoutChild: node.layoutChild || null, layoutCell: node.layoutCell || null,
    showInViewMode: node.showInViewMode ?? null, exports: node.exports || [], tokens: node.tokens || {}, interactions: node.interactions || [],
    clipContent: node.clipContent === true, fontSize: node.fontSize || '', fontWeight: node.fontWeight || '', lineHeight: node.lineHeight || '',
    growType: node.growType || '', svg: node.svg || '', componentId: component?.id || null,
    componentCopy: node?.isComponentCopyInstance?.() === true,
    layout: node.layout || '', layoutFlexDir: node.layoutFlexDir || '', layoutGap: node.layoutGap ?? null,
    layoutPadding: node.layoutPadding ?? null, layoutWrap: node.layoutWrap ?? null, layoutGridColumns: node.layoutGridColumns || '',
    layoutGridRows: node.layoutGridRows || '',
    pluginData: projectedPluginData(node, namespace), children: children(node).map((child) => projectedShape(child, namespace)),
    nativeLayout: projectedNativeLayout(node),
  };
}

function protectedProjection(penpot, namespace, packageId) {
  const pages = Array.from(penpot.currentFile?.pages || []).filter((page) => get(page, namespace, 'package-id') !== packageId);
  const components = Array.from(penpot.library?.local?.components || []).filter((component) => {
    const main = componentMain(component);
    return get(main, namespace, 'package-id') !== packageId;
  });
  return digest({
    pages: pages.map((page) => ({
      id: page.id, name: page.name, pluginData: projectedPluginData(page, namespace), root: projectedShape(page.root, namespace),
    })),
    components: components.map((component) => ({
      id: component.id, name: component.name || '', path: component.path || '', main: projectedShape(componentMain(component), namespace),
    })),
  });
}

async function inUndo(penpot, work) {
  const begin = penpot.history?.undoBlockBegin;
  const finish = penpot.history?.undoBlockFinish;
  if (typeof begin !== 'function' || typeof finish !== 'function') return work();
  const token = begin.call(penpot.history);
  try { return await work(); } finally { finish.call(penpot.history, token); }
}

function managedPages(penpot, pkg, namespace) {
  const exactName = pkg.target.page_name;
  const pages = Array.from(penpot.currentFile.pages || []).filter((page) => (
    get(page, namespace, 'package-id') === pkg.package_id || page.name === exactName
  ));
  demand(pages.length <= 1, 'DUPLICATE_PACKAGE_PAGE');
  if (pages[0]) {
    demand(get(pages[0], namespace, 'package-id') === pkg.package_id, 'FOREIGN_EXACT_NAME_PAGE');
    demand(pages[0].name === exactName, 'PACKAGE_PAGE_NAME_DRIFT');
  }
  return pages;
}

function findManaged(root, namespace, managedId) {
  return walk(root).filter((node) => get(node, namespace, 'managed-id') === managedId);
}

function assertOneOrNone(nodes, code) {
  demand(nodes.length <= 1, code);
  return nodes[0] || null;
}

function applyManagedIdentity(node, pkg, namespace, managedId, role) {
  put(node, namespace, 'package-id', pkg.package_id);
  put(node, namespace, 'managed-id', managedId);
  put(node, namespace, 'node-role', role);
  put(node, namespace, 'candidate-label', 'CANDIDATE_BUILD_NOT_ACCEPTED');
  put(node, namespace, 'source-head', pkg.source_authority.head);
  put(node, namespace, 'source-tree', pkg.source_authority.tree);
  put(node, namespace, 'atlas-page-order-assigned', 'false');
}

function createLabeledVisual(penpot, parent, nodeSpec, nodeStyle, pkg, namespace, componentId, created) {
  const [role, kind, label, width, height, fill, inlineSvg] = nodeSpec;
  demand(nodeStyle && nodeStyle.fill === fill, `SOURCE_NODE_STYLE_REQUIRED:${componentId}:${role}`);
  if (kind === 'source-svg') {
    const asset = pkg.asset_bindings?.free_listing_medallion;
    demand(asset && digest(asset.svg) === asset.sha256 && new TextEncoder().encode(asset.svg).length === asset.bytes, 'SOURCE_SVG_BYTES_MISMATCH');
    demand(typeof penpot.createShapeFromSvg === 'function', 'NATIVE_SVG_IMPORT_REQUIRED');
    const shape = penpot.createShapeFromSvg(asset.svg);
    demand(shape, `NATIVE_SOURCE_SVG_CREATE_FAILED:${componentId}:${role}`);
    shape.name = `${componentId} / ${role} / exact-source-svg`;
    resize(shape, width, height);
    put(shape, namespace, 'anatomy-role', role);
    put(shape, namespace, 'component-id', componentId);
    put(shape, namespace, 'layout', kind);
    put(shape, namespace, 'asset-sha256', asset.sha256);
    put(shape, namespace, 'asset-bytes', `${asset.bytes}`);
    append(parent, shape);
    shape.opacity = 1;
    shape.shadows = structuredClone(nodeStyle.shadows || []);
    shape.blur = nodeStyle.blur ?? null;
    shape.backgroundBlur = nodeStyle.background_blur ?? null;
    shape.hidden = false;
    shape.visible = true;
    created.count += 1;
    return shape;
  }
  const surface = penpot.createBoard();
  demand(surface, `NATIVE_ANATOMY_CREATE_FAILED:${componentId}:${role}`);
  surface.name = `${componentId} / ${role}`;
  resize(surface, width, height);
  styleSurface(surface, nodeStyle);
  put(surface, namespace, 'anatomy-role', role);
  put(surface, namespace, 'component-id', componentId);
  put(surface, namespace, 'layout', kind);
  surface.layout = kind === 'text' ? 'flex' : 'flex';
  surface.layoutFlexDir = 'row';
  surface.layoutGap = 0;
  surface.layoutPadding = 0;
  surface.layoutWrap = false;
  surface.opacity = 1;
  surface.hidden = false;
  surface.visible = true;
  append(parent, surface);
  if (kind === 'inline-svg') {
    demand(typeof inlineSvg === 'string' && inlineSvg.startsWith('<svg'), `INLINE_SOURCE_SVG_REQUIRED:${componentId}:${role}`);
    demand(typeof penpot.createShapeFromSvg === 'function', 'NATIVE_SVG_IMPORT_REQUIRED');
    const icon = penpot.createShapeFromSvg(inlineSvg);
    demand(icon, `INLINE_SOURCE_SVG_CREATE_FAILED:${componentId}:${role}`);
    icon.name = `${role} / exact-inline-source-icon`;
    resize(icon, 21, 21);
    position(icon, (width - 21) / 2, 8);
    append(surface, icon);
    created.count += 1;
  }
  const labels = role === 'fullscreen-menu-panel' ? label.split(' · ') : [label || role];
  labels.forEach((characters, index) => {
    const text = penpot.createText(characters);
    demand(text, `NATIVE_TEXT_CREATE_FAILED:${componentId}:${role}:${index}`);
    text.name = labels.length > 1 ? `${role} / source-row-${index + 1}` : `${role} / label`;
    styleText(text, nodeStyle.text_color, nodeStyle.font_size, nodeStyle.font_weight, nodeStyle.line_height);
    position(text, labels.length > 1 ? 22 : 10, labels.length > 1 ? index * 52 + 17 : kind === 'inline-svg' ? 38 : Math.max(6, (height - 18) / 2));
    append(surface, text);
  });
  created.count += 1 + labels.length;
  return surface;
}

function layOutAnatomy(items, direction, padding, gap) {
  let cursor = padding;
  for (const item of items) {
    if (direction === 'row') {
      position(item, cursor, padding);
      cursor += item.width + gap;
    } else {
      position(item, padding, cursor);
      cursor += item.height + gap;
    }
  }
}

function masterLayoutContract(component) {
  if (component.native_visual.master_layout) return component.native_visual.master_layout;
  return { mode: 'flex', direction: component.native_visual.direction, gap: component.native_visual.gap, padding: component.native_visual.padding, wrap: false };
}

function componentMain(componentRecord) {
  return typeof componentRecord.mainInstance === 'function' ? componentRecord.mainInstance() : componentRecord.main;
}

function componentRecords(penpot, namespace, componentId) {
  return Array.from(penpot.library?.local?.components || []).filter((record) => {
    const main = componentMain(record);
    return get(main, namespace, 'component-id') === componentId;
  });
}

async function createMaster({ penpot, root, pkg, unit, component, namespace, x, y, created }) {
  return inUndo(penpot, () => {
    const visual = component.native_visual;
    demand(visual && Array.isArray(visual.size) && Array.isArray(visual.nodes), `NATIVE_VISUAL_REQUIRED:${component.component_id}`);
    const master = penpot.createBoard();
    master.name = `U0 / ${component.component_id} / Main`;
    resize(master, visual.size[0], visual.size[1]);
    position(master, x, y);
    demand(visual.surface_style && visual.surface_style.fill === visual.fill, `SOURCE_SURFACE_STYLE_REQUIRED:${component.component_id}`);
    styleSurface(master, visual.surface_style);
    applyManagedIdentity(master, pkg, namespace, `master/${component.component_id}`, 'component-master');
    put(master, namespace, 'component-id', component.component_id);
    put(master, namespace, 'layout', visual.direction === 'row' ? 'native-row' : 'native-column');
    put(master, namespace, 'source-bindings', canonical(sourceBindings(component, pkg)));
    demand(Array.isArray(visual.source_style_evidence) && visual.source_style_evidence.length > 0, `SOURCE_STYLE_EVIDENCE_REQUIRED:${component.component_id}`);
    put(master, namespace, 'source-style-evidence', canonical(visual.source_style_evidence));
    demand(visual.native_layout_owner?.mode === masterLayoutContract(component).mode, `NATIVE_LAYOUT_OWNER_REQUIRED:${component.component_id}`);
    put(master, namespace, 'native-layout-owner', canonical(visual.native_layout_owner));
    const items = visual.nodes.map((spec) => createLabeledVisual(
      penpot, master, spec, visual.node_styles?.[spec[0]], pkg, namespace, component.component_id, created,
    ));
    layOutAnatomy(items, visual.direction, visual.padding, visual.gap);
    const nativeLayout = masterLayoutContract(component);
    configureNativeLayout(master, nativeLayout);
    put(master, namespace, 'state-layout', canonical(nativeLayout));
    append(root, master);
    const record = penpot.library.local.createComponent([master]);
    demand(record && typeof record.instance === 'function', `NATIVE_COMPONENT_CREATE_FAILED:${component.component_id}`);
    record.name = component.component_id;
    record.path = 'U0 / Free Shell';
    created.count += 2;
    return { master, record };
  });
}

function assertExactSurface(node, fill, border, radius, code) {
  demand(node.fills?.[0]?.fillColor === fill, `${code}:FILL`);
  demand(node.strokes?.[0]?.strokeColor === border, `${code}:BORDER`);
  demand(node.borderRadius === radius, `${code}:RADIUS`);
}

function assertSourceStyle(node, style, code) {
  demand(node.fills?.[0]?.fillColor === style.fill, `${code}:FILL`);
  demand(node.strokes?.[0]?.strokeColor === style.border && node.strokes?.[0]?.strokeWidth === Number(style.border_width), `${code}:STROKE`);
  if (style.radius && typeof style.radius === 'object') {
    demand(node.borderRadiusTopLeft === style.radius.top_left && node.borderRadiusTopRight === style.radius.top_right
      && node.borderRadiusBottomRight === style.radius.bottom_right && node.borderRadiusBottomLeft === style.radius.bottom_left, `${code}:CORNERS`);
  } else demand(node.borderRadius === style.radius, `${code}:RADIUS`);
  demand(canonical(node.shadows || []) === canonical(style.shadows || []), `${code}:SHADOWS`);
  demand((node.blur ?? null) === (style.blur ?? null) && (node.backgroundBlur ?? null) === (style.background_blur ?? null), `${code}:BLUR`);
}

function validateMaster(master, component, pkg, namespace) {
  const visual = component.native_visual;
  demand(master.name === `U0 / ${component.component_id} / Main`, `MASTER_NAME_DRIFT:${component.component_id}`);
  demand(get(master, namespace, 'node-role') === 'component-master', `MASTER_ROLE_DRIFT:${component.component_id}`);
  demand(get(master, namespace, 'source-bindings') === canonical(sourceBindings(component, pkg)), `MASTER_SOURCE_DRIFT:${component.component_id}`);
  demand(get(master, namespace, 'source-style-evidence') === canonical(visual.source_style_evidence), `MASTER_STYLE_EVIDENCE_DRIFT:${component.component_id}`);
  demand(get(master, namespace, 'native-layout-owner') === canonical(visual.native_layout_owner), `MASTER_LAYOUT_OWNER_DRIFT:${component.component_id}`);
  demand(master.width === visual.size[0] && master.height === visual.size[1], `MASTER_GEOMETRY_DRIFT:${component.component_id}`);
  assertSourceStyle(master, visual.surface_style, `MASTER_STYLE_DRIFT:${component.component_id}`);
  const nativeLayout = masterLayoutContract(component);
  demand(get(master, namespace, 'state-layout') === canonical(nativeLayout), `MASTER_LAYOUT_DATA_DRIFT:${component.component_id}`);
  assertNativeLayout(master, nativeLayout, `MASTER_NATIVE_LAYOUT_DRIFT:${component.component_id}`);
  const anatomy = children(master);
  demand(anatomy.length === visual.nodes.length, `MASTER_ANATOMY_COUNT_DRIFT:${component.component_id}`);
  let cursor = visual.padding;
  anatomy.forEach((node, index) => {
    const spec = visual.nodes[index];
    demand(get(node, namespace, 'anatomy-role') === spec[0], `MASTER_ANATOMY_ROLE_DRIFT:${component.component_id}:${spec[0]}`);
    demand(node.width === spec[3] && node.height === spec[4], `MASTER_ANATOMY_GEOMETRY_DRIFT:${component.component_id}:${spec[0]}`);
    const expectedX = visual.direction === 'row' ? cursor : visual.padding;
    const expectedY = visual.direction === 'row' ? visual.padding : cursor;
    demand(node.x === expectedX && node.y === expectedY, `MASTER_ANATOMY_POSITION_DRIFT:${component.component_id}:${spec[0]}`);
    demand(node.opacity === 1 && node.hidden !== true && node.visible !== false, `MASTER_ANATOMY_VISIBILITY_DRIFT:${component.component_id}:${spec[0]}`);
    if (spec[1] === 'source-svg') {
      demand(get(node, namespace, 'asset-sha256') === pkg.asset_bindings.free_listing_medallion.sha256, `MASTER_ASSET_DRIFT:${component.component_id}:${spec[0]}`);
    } else {
      const sourceStyle = visual.node_styles?.[spec[0]];
      assertSourceStyle(node, sourceStyle, `MASTER_ANATOMY_STYLE_DRIFT:${component.component_id}:${spec[0]}`);
      const expectedLabels = spec[0] === 'fullscreen-menu-panel' ? spec[2].split(' · ') : [spec[2] || spec[0]];
      const labels = walk(node).filter((child) => child.type === 'text');
      demand(canonical(labels.map((label) => label.characters)) === canonical(expectedLabels), `MASTER_ANATOMY_TEXT_DRIFT:${component.component_id}:${spec[0]}`);
      labels.forEach((label, labelIndex) => {
        const expectedLabelX = expectedLabels.length > 1 ? 22 : 10;
        const expectedLabelY = expectedLabels.length > 1 ? labelIndex * 52 + 17 : spec[1] === 'inline-svg' ? 38 : Math.max(6, (spec[4] - 18) / 2);
        demand(label.x === expectedLabelX && label.y === expectedLabelY, `MASTER_ANATOMY_LABEL_POSITION_DRIFT:${component.component_id}:${spec[0]}:${labelIndex}`);
        demand(label.fills?.[0]?.fillColor === sourceStyle.text_color && label.fontSize === sourceStyle.font_size
          && label.fontWeight === sourceStyle.font_weight && label.lineHeight === sourceStyle.line_height,
        `MASTER_ANATOMY_TEXT_STYLE_DRIFT:${component.component_id}:${spec[0]}:${labelIndex}`);
      });
      if (spec[1] === 'inline-svg') {
        const icon = children(node).find((child) => child.type === 'path');
        demand(icon && icon.width === 21 && icon.height === 21 && icon.x === (spec[3] - 21) / 2 && icon.y === 8, `MASTER_INLINE_ICON_DRIFT:${component.component_id}:${spec[0]}`);
      }
    }
    cursor += (visual.direction === 'row' ? spec[3] : spec[4]) + visual.gap;
  });
}

function stateStyle(component, state) {
  demand(Object.prototype.hasOwnProperty.call(component.native_visual.state_styles, state), `UNBOUND_COMPONENT_STATE:${component.component_id}:${state}`);
  const value = component.native_visual.state_styles[state];
  demand(Array.isArray(value) && value.length === 3, `INVALID_COMPONENT_STATE_STYLE:${component.component_id}:${state}`);
  return value;
}

function stateAnatomy(component, state, viewport) {
  const contract = component.native_visual.state_anatomy?.[state];
  demand(contract && Array.isArray(contract.visible_roles) && Array.isArray(contract.hidden_roles), `STATE_ANATOMY_REQUIRED:${component.component_id}:${state}`);
  const responsive = (contract.responsive_overrides || []).find((entry) => viewport.width <= entry.max_width);
  return {
    ...contract,
    instance_size: responsive?.instance_size || contract.instance_size,
    role_overrides: { ...(contract.role_overrides || {}), ...(responsive?.role_overrides || {}) },
  };
}

function baseAnatomyGeometry(component) {
  const visual = component.native_visual;
  let cursor = visual.padding;
  return Object.fromEntries(visual.nodes.map((spec) => {
    const geometry = {
      x: visual.direction === 'row' ? cursor : visual.padding,
      y: visual.direction === 'row' ? visual.padding : cursor,
      width: spec[3], height: spec[4], ...visual.node_styles[spec[0]],
    };
    cursor += (visual.direction === 'row' ? spec[3] : spec[4]) + visual.gap;
    return [spec[0], geometry];
  }));
}

function splitTracks(value) {
  const result = [];
  let depth = 0;
  let token = '';
  for (const character of value.trim()) {
    if (character === '(') depth += 1;
    if (character === ')') depth -= 1;
    if (/\s/u.test(character) && depth === 0) {
      if (token) result.push(token);
      token = '';
    } else token += character;
  }
  if (token) result.push(token);
  demand(depth === 0, `GRID_TRACK_SYNTAX_INVALID:${value}`);
  return result;
}

function parseTrack(token) {
  const repeat = /^repeat\((\d+),(.+)\)$/u.exec(token);
  if (repeat) return Array.from({ length: Number(repeat[1]) }, () => parseTrackList(repeat[2])).flat();
  const minmax = /^minmax\(([^,]+),(.+)\)$/u.exec(token);
  if (minmax) {
    const maximum = parseTrack(minmax[2]);
    demand(maximum.length === 1, `GRID_MINMAX_INVALID:${token}`);
    return [{ ...maximum[0], minimum: minmax[1], source: token }];
  }
  if (token === 'auto') return [{ type: 'auto', value: null, source: token }];
  let match = /^(-?(?:\d+\.?\d*|\.\d+))fr$/u.exec(token);
  if (match) return [{ type: 'flex', value: Number(match[1]), source: token }];
  match = /^(-?(?:\d+\.?\d*|\.\d+))px$/u.exec(token);
  if (match) return [{ type: 'fixed', value: Number(match[1]), source: token }];
  match = /^(-?(?:\d+\.?\d*|\.\d+))%$/u.exec(token);
  if (match) return [{ type: 'percent', value: Number(match[1]), source: token }];
  demand(false, `GRID_TRACK_UNSUPPORTED:${token}`);
}

function parseTrackList(value, fallback = '1fr') {
  return splitTracks(value || fallback).flatMap(parseTrack);
}

function materializedTracks(value, fallback) {
  return parseTrackList(value, fallback).map(({ type, value }) => ({ type, value }));
}

function applyGridCells(node, layout) {
  for (const cell of layout.cells || []) {
    const child = children(node)[cell.index];
    demand(child, `GRID_CELL_CHILD_MISSING:${node.id}:${cell.index}`);
    child.layoutCell = {
      row: cell.row, column: cell.column,
      rowSpan: cell.row_span, columnSpan: cell.column_span,
    };
  }
}

function configureNativeLayout(node, layout) {
  demand(layout && ['flex', 'grid', 'none'].includes(layout.mode), `NATIVE_LAYOUT_MODE_INVALID:${node.id}`);
  if (layout.mode === 'none') {
    node.flex?.remove?.();
    node.grid?.remove?.();
  } else if (layout.mode === 'flex') {
    node.grid?.remove?.();
    demand(typeof node.addFlexLayout === 'function', `NATIVE_FLEX_API_REQUIRED:${node.id}`);
    const flex = node.flex || node.addFlexLayout();
    demand(flex && node.flex === flex, `NATIVE_FLEX_OBJECT_REQUIRED:${node.id}`);
    flex.dir = layout.direction;
    flex.wrap = layout.wrap ? 'wrap' : 'nowrap';
    flex.rowGap = layout.direction === 'column' ? layout.gap : 0;
    flex.columnGap = layout.direction === 'row' ? layout.gap : 0;
    flex.topPadding = layout.padding; flex.rightPadding = layout.padding;
    flex.bottomPadding = layout.padding; flex.leftPadding = layout.padding;
    flex.alignItems = layout.alignItems || 'start';
    flex.justifyContent = layout.justifyContent || 'start';
    flex.horizontalSizing = 'fix'; flex.verticalSizing = 'fix';
  } else {
    node.flex?.remove?.();
    demand(typeof node.addGridLayout === 'function', `NATIVE_GRID_API_REQUIRED:${node.id}`);
    const grid = node.grid || node.addGridLayout();
    demand(grid && node.grid === grid && typeof grid.addColumn === 'function' && typeof grid.addRow === 'function', `NATIVE_GRID_OBJECT_REQUIRED:${node.id}`);
    while (grid.columns.length) grid.removeColumn(grid.columns.length - 1);
    while (grid.rows.length) grid.removeRow(grid.rows.length - 1);
    const columns = parseTrackList(layout.columns, '1fr');
    const rows = parseTrackList(layout.rows, 'auto');
    for (const track of columns) {
      if (track.value === null) grid.addColumn(track.type);
      else grid.addColumn(track.type, track.value);
    }
    for (const track of rows) {
      if (track.value === null) grid.addRow(track.type);
      else grid.addRow(track.type, track.value);
    }
    grid.dir = layout.direction === 'column' ? 'column' : 'row';
    grid.rowGap = layout.gap; grid.columnGap = layout.gap;
    grid.topPadding = layout.padding; grid.rightPadding = layout.padding;
    grid.bottomPadding = layout.padding; grid.leftPadding = layout.padding;
    grid.alignItems = layout.alignItems || 'start';
    grid.justifyItems = layout.justifyItems || 'start';
    grid.horizontalSizing = 'fix'; grid.verticalSizing = 'fix';
    applyGridCells(node, layout);
  }
  // Metadata mirrors the native object only for deterministic readback; it is
  // never treated as the layout implementation.
  node.layout = layout.mode;
  node.layoutFlexDir = layout.direction;
  node.layoutGap = layout.gap;
  node.layoutPadding = layout.padding;
  node.layoutWrap = layout.wrap;
  node.layoutGridColumns = layout.columns || '';
  node.layoutGridRows = layout.rows || '';
}

function assertNativeLayout(node, layout, code) {
  if (layout.mode === 'none') {
    demand(!node.flex && !node.grid, code);
    return;
  }
  if (layout.mode === 'flex') {
    demand(node.flex && !node.grid, `${code}:FLEX_OBJECT`);
    demand(node.flex.dir === layout.direction && node.flex.wrap === (layout.wrap ? 'wrap' : 'nowrap'), `${code}:FLEX_DIRECTION`);
    demand(node.flex.rowGap === (layout.direction === 'column' ? layout.gap : 0) && node.flex.columnGap === (layout.direction === 'row' ? layout.gap : 0), `${code}:FLEX_GAP`);
  } else {
    demand(node.grid && !node.flex, `${code}:GRID_OBJECT`);
    demand(canonical(node.grid.columns) === canonical(materializedTracks(layout.columns, '1fr'))
      && canonical(node.grid.rows) === canonical(materializedTracks(layout.rows, 'auto')), `${code}:GRID_TRACKS`);
    demand(node.grid.rowGap === layout.gap && node.grid.columnGap === layout.gap, `${code}:GRID_GAP`);
    for (const cell of layout.cells || []) {
      const child = children(node)[cell.index];
      demand(child && canonical(child.layoutCell) === canonical({ row: cell.row, column: cell.column, rowSpan: cell.row_span, columnSpan: cell.column_span }), `${code}:GRID_CELL:${cell.index}`);
    }
  }
  const native = node.flex || node.grid;
  demand(native.topPadding === layout.padding && native.rightPadding === layout.padding && native.bottomPadding === layout.padding && native.leftPadding === layout.padding, `${code}:PADDING`);
  demand(native.horizontalSizing === 'fix' && native.verticalSizing === 'fix', `${code}:SIZING`);
}

function materializeStateAnatomy(instance, component, state, namespace, viewport) {
  const contract = stateAnatomy(component, state, viewport);
  const base = baseAnatomyGeometry(component);
  const byRole = new Map(children(instance).map((node) => [get(node, namespace, 'anatomy-role'), node]));
  demand(byRole.size === component.native_visual.nodes.length, `INSTANCE_ANATOMY_COUNT_DRIFT:${component.component_id}:${state}`);
  resize(instance, contract.instance_size[0], contract.instance_size[1]);
  configureNativeLayout(instance, contract.layout);
  put(instance, namespace, 'state-layout', canonical(contract.layout));
  put(instance, namespace, 'state-flags', canonical(contract.flags || {}));
  for (const spec of component.native_visual.nodes) {
    const role = spec[0];
    const node = byRole.get(role);
    demand(node, `INSTANCE_ANATOMY_MISSING:${component.component_id}:${state}:${role}`);
    const visible = contract.visible_roles.includes(role);
    demand(visible || contract.hidden_roles.includes(role), `INSTANCE_ANATOMY_STATE_UNBOUND:${component.component_id}:${state}:${role}`);
    const expected = { ...base[role], ...(contract.role_overrides?.[role] || {}) };
    position(node, expected.x, expected.y);
    resize(node, expected.width, expected.height);
    node.opacity = visible ? Number(expected.opacity ?? 1) : 0;
    node.hidden = !visible;
    node.visible = visible;
    put(node, namespace, 'state-visibility', visible ? 'visible' : 'hidden');
    const roleLayout = expected.layout || component.native_visual.role_layouts?.[role] || (role === 'fullscreen-menu-panel'
      ? { mode: 'grid', direction: 'column', gap: 0, padding: 0, wrap: false, columns: 'minmax(0,1fr)', rows: 'repeat(6,52px)' }
      : { mode: spec[1] === 'source-svg' ? 'none' : 'flex', direction: spec[1] === 'inline-svg' ? 'column' : 'row', gap: 0, padding: 0, wrap: false });
    configureNativeLayout(node, roleLayout);
    put(node, namespace, 'state-layout', canonical(roleLayout));
    if (spec[1] !== 'source-svg') {
      styleSurface(node, { ...expected, opacity: visible ? Number(expected.opacity ?? 1) : 0 });
      node.hidden = !visible;
      node.visible = visible;
    }
    const labels = walk(node).filter((child) => child.type === 'text');
    if (labels[0] && typeof expected.text === 'string') labels[0].characters = expected.text;
    labels.forEach((label) => styleText(label, expected.text_color, expected.font_size, expected.font_weight, expected.line_height));
  }
  return contract;
}

function validateStateAnatomy(instance, component, state, namespace, viewport, expectedWidth) {
  const contract = stateAnatomy(component, state, viewport);
  const base = baseAnatomyGeometry(component);
  demand(instance.width === expectedWidth && instance.height === contract.instance_size[1], `INSTANCE_GEOMETRY_DRIFT:${component.component_id}:${state}`);
  demand(instance.layout === contract.layout.mode && instance.layoutFlexDir === contract.layout.direction, `INSTANCE_LAYOUT_DRIFT:${component.component_id}:${state}`);
  demand(instance.layoutGap === contract.layout.gap && instance.layoutPadding === contract.layout.padding && instance.layoutWrap === contract.layout.wrap, `INSTANCE_LAYOUT_METRICS_DRIFT:${component.component_id}:${state}`);
  demand((instance.layoutGridColumns || '') === (contract.layout.columns || ''), `INSTANCE_GRID_DRIFT:${component.component_id}:${state}`);
  demand(get(instance, namespace, 'state-layout') === canonical(contract.layout), `INSTANCE_LAYOUT_DATA_DRIFT:${component.component_id}:${state}`);
  assertNativeLayout(instance, contract.layout, `INSTANCE_NATIVE_LAYOUT_DRIFT:${component.component_id}:${state}`);
  demand(get(instance, namespace, 'state-flags') === canonical(contract.flags || {}), `INSTANCE_STATE_FLAGS_DRIFT:${component.component_id}:${state}`);
  const byRole = new Map(children(instance).map((node) => [get(node, namespace, 'anatomy-role'), node]));
  demand(byRole.size === component.native_visual.nodes.length, `INSTANCE_ANATOMY_COUNT_DRIFT:${component.component_id}:${state}`);
  for (const spec of component.native_visual.nodes) {
    const role = spec[0];
    const node = byRole.get(role);
    const visible = contract.visible_roles.includes(role);
    const expected = { ...base[role], ...(contract.role_overrides?.[role] || {}) };
    demand(node && node.x === expected.x && node.y === expected.y && node.width === expected.width && node.height === expected.height, `INSTANCE_ANATOMY_GEOMETRY_DRIFT:${component.component_id}:${state}:${role}`);
    demand(node.hidden === !visible && node.visible === visible && node.opacity === (visible ? Number(expected.opacity ?? 1) : 0), `INSTANCE_ANATOMY_VISIBILITY_DRIFT:${component.component_id}:${state}:${role}`);
    demand(get(node, namespace, 'state-visibility') === (visible ? 'visible' : 'hidden'), `INSTANCE_ANATOMY_DATA_DRIFT:${component.component_id}:${state}:${role}`);
    const roleLayout = expected.layout || component.native_visual.role_layouts?.[role] || (role === 'fullscreen-menu-panel'
      ? { mode: 'grid', direction: 'column', gap: 0, padding: 0, wrap: false, columns: 'minmax(0,1fr)', rows: 'repeat(6,52px)' }
      : { mode: spec[1] === 'source-svg' ? 'none' : 'flex', direction: spec[1] === 'inline-svg' ? 'column' : 'row', gap: 0, padding: 0, wrap: false });
    demand(get(node, namespace, 'state-layout') === canonical(roleLayout) && node.layout === roleLayout.mode && node.layoutFlexDir === roleLayout.direction, `INSTANCE_ANATOMY_LAYOUT_DRIFT:${component.component_id}:${state}:${role}`);
    assertNativeLayout(node, roleLayout, `INSTANCE_ANATOMY_NATIVE_LAYOUT_DRIFT:${component.component_id}:${state}:${role}`);
    if (spec[1] !== 'source-svg') {
      assertSourceStyle(node, expected, `INSTANCE_ANATOMY_STYLE_DRIFT:${component.component_id}:${state}:${role}`);
    }
    if (spec[1] !== 'source-svg') {
      const expectedLabels = typeof expected.text === 'string'
        ? [expected.text, ...(role === 'fullscreen-menu-panel' ? spec[2].split(' · ').slice(1) : [])]
        : role === 'fullscreen-menu-panel' ? spec[2].split(' · ') : [spec[2] || role];
      const labels = walk(node).filter((child) => child.type === 'text');
      demand(canonical(labels.map((child) => child.characters)) === canonical(expectedLabels), `INSTANCE_ANATOMY_TEXT_DRIFT:${component.component_id}:${state}:${role}`);
      demand(labels.every((label) => label.fills?.[0]?.fillColor === expected.text_color && label.fontSize === expected.font_size
        && label.fontWeight === expected.font_weight && label.lineHeight === expected.line_height), `INSTANCE_ANATOMY_TEXT_STYLE_DRIFT:${component.component_id}:${state}:${role}`);
    }
  }
}

function applyStateStyle(instance, component, state, namespace, viewport) {
  demand(component.states.includes(state), `STATE_NOT_IN_PRODUCT_CONTRACT:${component.component_id}:${state}`);
  const visual = component.native_visual;
  const value = stateStyle(component, state);
  styleSurface(instance, { ...visual.surface_style, fill: value[0], border: value[1], opacity: Number(value[2]) });
  materializeStateAnatomy(instance, component, state, namespace, viewport);
  put(instance, namespace, 'state', state);
}

async function createSpecimen({ penpot, root, pkg, unit, specimen, components, namespace, x, y, created }) {
  return inUndo(penpot, () => {
    const spec = specimen.native_composition;
    const linked = specimen.component_ids.map((componentId) => {
      const found = components.get(componentId);
      demand(found, `SPECIMEN_COMPONENT_MISSING:${specimen.specimen_id}:${componentId}`);
      return found;
    });
    const naturalHeight = spec.padding * 2 + linked.reduce((sum, item) => sum + item.component.native_visual.size[1], 0) + Math.max(0, linked.length - 1) * spec.gap + 54;
    const height = Math.max(spec.min_height, naturalHeight);
    const board = penpot.createBoard();
    board.name = `Specimen / ${specimen.specimen_id} / ${specimen.state}`;
    resize(board, spec.width, height);
    position(board, x, y);
    styleSurface(board, { fill: spec.fill, border: spec.border, radius: spec.radius, opacity: 1 });
    applyManagedIdentity(board, pkg, namespace, `specimen/${specimen.specimen_id}`, 'visible-specimen');
    put(board, namespace, 'specimen-id', specimen.specimen_id);
    put(board, namespace, 'scenario-state', specimen.state);
    put(board, namespace, 'layout', 'native-column');
    const heading = penpot.createText(`${specimen.state} · ${specimen.viewport.width}×${specimen.viewport.height}`);
    heading.name = 'Specimen state and viewport';
    styleText(heading, '#221a14', '18', '700');
    position(heading, spec.padding, spec.padding);
    append(board, heading);
    created.count += 2;
    let cursor = spec.padding + 54;
    for (const item of linked) {
      const instance = item.record.instance();
      demand(instance?.isComponentCopyInstance?.() === true, `DETACHED_INSTANCE_CREATED:${specimen.specimen_id}:${item.component.component_id}`);
      demand(instance.component?.()?.id === item.record.id, `LINKED_COMPONENT_ID_MISMATCH:${specimen.specimen_id}:${item.component.component_id}`);
      instance.name = `Linked / ${item.component.component_id} / ${specimen.state}`;
      applyManagedIdentity(instance, pkg, namespace, `instance/${specimen.specimen_id}/${item.component.component_id}`, 'linked-visible-instance');
      put(instance, namespace, 'component-id', item.component.component_id);
      put(instance, namespace, 'specimen-id', specimen.specimen_id);
      put(instance, namespace, 'detached', 'false');
      put(instance, namespace, 'screenshot', 'false');
      const componentState = specimen.component_state_bindings?.[item.component.component_id];
      demand(typeof componentState === 'string', `UNBOUND_SPECIMEN_COMPONENT_STATE:${specimen.specimen_id}:${item.component.component_id}`);
      applyStateStyle(instance, item.component, componentState, namespace, specimen.viewport);
      const innerWidth = spec.width - spec.padding * 2;
      if (instance.width > innerWidth) resize(instance, innerWidth, instance.height);
      position(instance, spec.padding, cursor);
      append(board, instance);
      cursor += instance.height + spec.gap;
      created.count += 1;
    }
    const compositionLayout = { mode: 'flex', direction: 'column', gap: spec.gap, padding: spec.padding, wrap: false };
    configureNativeLayout(board, compositionLayout);
    put(board, namespace, 'state-layout', canonical(compositionLayout));
    append(root, board);
    return { board, height };
  });
}

function validateManagedIntegrity({ page, root, pkg, namespace }) {
  const nodes = walk(root);
  const ids = nodes.map((node) => get(node, namespace, 'managed-id')).filter(Boolean);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  demand(duplicates.length === 0, `DUPLICATE_MANAGED_ID:${[...new Set(duplicates)].join(',')}`);
  demand(ids.length === pkg.native_successor.managed_nodes_expected, `MANAGED_NODE_COUNT_MISMATCH:${ids.length}:${pkg.native_successor.managed_nodes_expected}`);
  const linked = nodes.filter((node) => get(node, namespace, 'node-role') === 'linked-visible-instance');
  const detached = linked.filter((node) => node.isComponentCopyInstance?.() !== true || !node.component?.());
  demand(detached.length === 0, `DETACHED_INSTANCE:${detached.map((node) => node.id).join(',')}`);
  const recursivelyDetached = nodes.filter((node) => node.isComponentCopyInstance?.() === true && !node.component?.());
  demand(recursivelyDetached.length === 0, `RECURSIVE_DETACHED_INSTANCE:${recursivelyDetached.map((node) => node.id).join(',')}`);
  const screenshots = nodes.filter((node) => node.type === 'image' || Array.from(node.fills || []).some((fill) => fill.fillImage) || get(node, namespace, 'screenshot') === 'true');
  demand(screenshots.length === 0, `SCREENSHOT_NODE:${screenshots.map((node) => node.id).join(',')}`);
  const specimens = nodes.filter((node) => get(node, namespace, 'node-role') === 'visible-specimen');
  for (const specimen of specimens) {
    for (const child of children(specimen)) {
      const role = get(child, namespace, 'node-role');
      const allowedHeading = child.type === 'text' && child.name === 'Specimen state and viewport';
      demand(allowedHeading || role === 'linked-visible-instance', `UNTAGGED_SPECIMEN_CHILD:${specimen.id}:${child.id}`);
    }
  }
  demand(get(page, namespace, 'atlas-page-order-assigned') === 'false', 'ATLAS_PAGE_ORDER_DRIFT');
  return { managed: ids.length, duplicates: 0, detached: 0, screenshots: 0, linked_instances: linked.length };
}

async function runNativePackage({ penpot, storage, lease, packageDefinition }) {
  demand(penpot?.currentFile && typeof penpot.createPage === 'function', 'PENPOT_NATIVE_RUNTIME_REQUIRED');
  demand(penpot?.library?.local && typeof penpot.library.local.createComponent === 'function', 'PENPOT_NATIVE_LIBRARY_REQUIRED');
  demand(storage && typeof storage.set === 'function', 'STORAGE_SET_REQUIRED');
  assertActiveLease(lease, 'entry');
  demand(packageDefinition.native_successor.execution_mode === 'concrete-native-page-component-master-linked-instance', 'NATIVE_SUCCESSOR_CONTRACT_REQUIRED');
  demand(packageDefinition.native_successor.atlas_page_order_assigned === false, 'ATLAS_PAGE_ORDER_FORBIDDEN');
  const namespace = packageDefinition.native_successor.plugin_data_namespace;
  // Exhaustive enumeration must be available before the first mutation. The
  // runtime never silently degrades to a finite list of guessed namespaces or
  // keys.
  projectedPluginData(penpot.currentFile, namespace);
  const receiptKey = `receipt:${packageDefinition.package_id}:R2`;
  const previousReceipt = typeof storage.get === 'function' ? await storage.get(receiptKey) : null;
  const beforeProtected = protectedProjection(penpot, namespace, packageDefinition.package_id);
  const created = { count: 0 };

  let page = managedPages(penpot, packageDefinition, namespace)[0];
  if (!page) {
    assertActiveLease(lease, 'before-page');
    page = await inUndo(penpot, () => {
      const value = penpot.createPage();
      value.name = packageDefinition.target.page_name;
      put(value, namespace, 'package-id', packageDefinition.package_id);
      put(value, namespace, 'candidate-label', 'CANDIDATE_BUILD_NOT_ACCEPTED');
      put(value, namespace, 'source-head', packageDefinition.source_authority.head);
      put(value, namespace, 'source-tree', packageDefinition.source_authority.tree);
      put(value, namespace, 'atlas-page-order-assigned', 'false');
      created.count += 1;
      return value;
    });
  }
  if (penpot.currentPage?.id !== page.id && typeof penpot.openPage === 'function') await penpot.openPage(page);
  assertActiveLease(lease, 'after-open-page');

  const unit = packageDefinition.page_units[0];
  let root = assertOneOrNone(findManaged(page.root, namespace, 'root'), 'DUPLICATE_NATIVE_ROOT');
  if (!root) {
    demand(children(page.root).length === 0, 'FOREIGN_ROOT_ON_MANAGED_PAGE');
    root = await inUndo(penpot, () => {
      const value = penpot.createBoard();
      value.name = unit.root_name;
      resize(value, packageDefinition.native_successor.root.width, 1000);
      position(value, 0, 0);
      styleSurface(value, { fill: packageDefinition.native_successor.root.fill, border: '#e1d3c2', radius: 0, opacity: 1 });
      applyManagedIdentity(value, packageDefinition, namespace, 'root', 'native-review-root');
      put(value, namespace, 'layout', 'native-two-column-masters-plus-stacked-compositions');
      append(page.root, value);
      created.count += 1;
      return value;
    });
  }
  demand(root.name === unit.root_name, 'NATIVE_ROOT_NAME_DRIFT');
  demand(root.width === packageDefinition.native_successor.root.width, 'NATIVE_ROOT_WIDTH_DRIFT');

  const titleNodes = findManaged(root, namespace, 'page-title');
  let title = assertOneOrNone(titleNodes, 'DUPLICATE_PAGE_TITLE');
  if (!title) {
    title = penpot.createText('Free collection · shell states · source-bound native successor');
    title.name = 'Candidate page title';
    styleText(title, '#221a14', '28', '700');
    position(title, 64, 64);
    applyManagedIdentity(title, packageDefinition, namespace, 'page-title', 'page-title');
    append(root, title);
    created.count += 1;
  }

  const components = new Map();
  const columnY = [224, 224];
  for (let index = 0; index < unit.components.length; index += 1) {
    const component = unit.components[index];
    const masters = findManaged(root, namespace, `master/${component.component_id}`);
    let master = assertOneOrNone(masters, `DUPLICATE_MASTER:${component.component_id}`);
    const records = componentRecords(penpot, namespace, component.component_id);
    demand(records.length <= 1, `DUPLICATE_NATIVE_COMPONENT:${component.component_id}`);
    let record = records[0] || null;
    const column = index % 2;
    const x = column === 0 ? 64 : 1120;
    const y = columnY[column];
    if (!master) {
      demand(!record, `ORPHAN_NATIVE_COMPONENT:${component.component_id}`);
      const made = await createMaster({ penpot, root, pkg: packageDefinition, unit, component, namespace, x, y, created });
      master = made.master;
      record = made.record;
    } else {
      demand(record, `MASTER_WITHOUT_COMPONENT:${component.component_id}`);
      demand(componentMain(record).id === master.id, `COMPONENT_MAIN_MISMATCH:${component.component_id}`);
      validateMaster(master, component, packageDefinition, namespace);
      demand(master.x === x && master.y === y, `MASTER_POSITION_DRIFT:${component.component_id}`);
    }
    columnY[column] = y + component.native_visual.size[1] + 48;
    components.set(component.component_id, { component, master, record });
  }

  let specimenY = Math.max(...columnY) + 112;
  for (const specimen of unit.specimens) {
    const existing = findManaged(root, namespace, `specimen/${specimen.specimen_id}`);
    const board = assertOneOrNone(existing, `DUPLICATE_SPECIMEN:${specimen.specimen_id}`);
    if (!board) {
      const made = await createSpecimen({ penpot, root, pkg: packageDefinition, unit, specimen, components, namespace, x: 64, y: specimenY, created });
      specimenY += made.height + 48;
    } else {
      demand(get(board, namespace, 'scenario-state') === specimen.state, `SPECIMEN_STATE_DRIFT:${specimen.specimen_id}`);
      const compositionLayout = { mode: 'flex', direction: 'column', gap: specimen.native_composition.gap, padding: specimen.native_composition.padding, wrap: false };
      demand(get(board, namespace, 'state-layout') === canonical(compositionLayout), `SPECIMEN_LAYOUT_DATA_DRIFT:${specimen.specimen_id}`);
      assertNativeLayout(board, compositionLayout, `SPECIMEN_NATIVE_LAYOUT_DRIFT:${specimen.specimen_id}`);
      const linkedNodes = walk(board).filter((node) => get(node, namespace, 'node-role') === 'linked-visible-instance');
      const linkedIds = linkedNodes.map((node) => get(node, namespace, 'component-id'));
      demand(canonical(linkedIds) === canonical(specimen.component_ids), `SPECIMEN_LINEAGE_DRIFT:${specimen.specimen_id}`);
      let instanceCursor = specimen.native_composition.padding + 54;
      linkedNodes.forEach((node) => {
        const componentId = get(node, namespace, 'component-id');
        const item = components.get(componentId);
        const boundState = specimen.component_state_bindings?.[componentId];
        demand(typeof boundState === 'string', `UNBOUND_SPECIMEN_COMPONENT_STATE:${specimen.specimen_id}:${componentId}`);
        const value = stateStyle(item.component, boundState);
        demand(get(node, namespace, 'state') === boundState, `INSTANCE_STATE_DRIFT:${specimen.specimen_id}:${componentId}`);
        assertExactSurface(node, value[0], value[1], item.component.native_visual.radius, `INSTANCE_STYLE_DRIFT:${specimen.specimen_id}:${componentId}`);
        const expectedWidth = Math.min(stateAnatomy(item.component, boundState, specimen.viewport).instance_size[0], board.width - specimen.native_composition.padding * 2);
        validateStateAnatomy(node, item.component, boundState, namespace, specimen.viewport, expectedWidth);
        demand(node.x === specimen.native_composition.padding && node.y === instanceCursor, `INSTANCE_POSITION_DRIFT:${specimen.specimen_id}:${componentId}`);
        instanceCursor += node.height + specimen.native_composition.gap;
      });
      specimenY += board.height + 48;
    }
  }

  const expectedHeight = specimenY + 64;
  if (created.count > 0) resize(root, packageDefinition.native_successor.root.width, expectedHeight);
  else demand(root.height === expectedHeight, 'NATIVE_ROOT_HEIGHT_DRIFT');

  const integrity = validateManagedIntegrity({ page, root, pkg: packageDefinition, namespace });
  const managedProjection = digest({
    page: { id: page.id, name: page.name, pluginData: projectedPluginData(page, namespace) },
    root: projectedShape(root, namespace),
    components: Array.from(penpot.library?.local?.components || [])
      .filter((component) => get(componentMain(component), namespace, 'package-id') === packageDefinition.package_id)
      .map((component) => ({ id: component.id, name: component.name || '', path: component.path || '', main: projectedShape(componentMain(component), namespace) })),
  });
  if (previousReceipt) {
    demand(created.count === 0, 'MANAGED_REPLAY_RECREATION_FORBIDDEN');
    demand(previousReceipt.managed_projection_sha256 === managedProjection, 'MANAGED_REPLAY_PROJECTION_DRIFT');
  }
  const afterProtected = protectedProjection(penpot, namespace, packageDefinition.package_id);
  demand(afterProtected === beforeProtected, 'PROTECTED_PROJECTION_CHANGED');
  assertActiveLease(lease, 'before-receipt');
  const receipt = {
    schema_version: 'kenigevents.u0-native-executor-receipt.v2',
    package_id: packageDefinition.package_id,
    successor: 'R2',
    created: created.count,
    page_id: page.id,
    root_id: root.id,
    component_masters: unit.components.length,
    visible_specimens: unit.specimens.length,
    linked_instances: integrity.linked_instances,
    duplicates: integrity.duplicates,
    detached: integrity.detached,
    screenshots: integrity.screenshots,
    protected_projection_before: beforeProtected,
    protected_projection_after: afterProtected,
    protected_projections_unchanged: true,
    managed_projection_sha256: managedProjection,
    shared_plugin_data_string_only: true,
    exact_managed_nodes: integrity.managed,
    unbound_state_fallbacks: 0,
    source_style_evidence_complete: true,
    exhaustive_plugin_data_projection: true,
    atlas_page_order_assigned: false,
    atlas_extension_status: 'ATLAS_EXTENSION_PENDING',
    penpot_execution_authorized: false,
    validation: [],
  };
  await storage.set(receiptKey, receipt);
  assertActiveLease(lease, 'after-receipt');
  return receipt;
}

module.exports = {
  MANAGED_KEYS,
  assertActiveLease,
  canonical,
  digest,
  get,
  parseTrackList,
  protectedProjection,
  put,
  runNativePackage,
  sourceBindings,
  validateManagedIntegrity,
  walk,
};

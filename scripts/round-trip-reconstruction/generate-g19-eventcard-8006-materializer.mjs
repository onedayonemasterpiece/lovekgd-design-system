#!/usr/bin/env node
/**
 * Generate the Generation-19 event.real.8006 native Penpot payload.
 *
 * The generator is the lowest owning file. It binds the accepted G12 Current-A
 * expectations, the promoted resolved cases, the accepted G14 native-font
 * binding, the canonical SVGs and the accepted poster bytes into one
 * filesystem-independent Penpot.execute_code function body.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'catalog/penpot-executor/g19');
const EXPECTATIONS = 'catalog/penpot-executor/g12/independent-expectations.json';
const FONT_BINDING = 'catalog/penpot-executor/g14/font-source-binding.json';
const ASTRO_BINDING = 'catalog/penpot-executor/g12/astro-evidence-binding.json';
const DESCENDANTS = 'catalog/penpot-executor/g19/frozen-eventcard-8006-descendants.json';
const REGIONS = 'catalog/penpot-executor/g12/frozen-evidence/regions.json';
const MEDIA = 'catalog/penpot-executor/g10/input-media/dd8834258d4a1ebde029aca1960bdd224bdf636d3fd8aee8fc7824012475de8b.webp';
const INPUTS = [
  EXPECTATIONS,
  FONT_BINDING,
  ASTRO_BINDING,
  DESCENDANTS,
  REGIONS,
  MEDIA,
  'catalog/ui-assets/v1/icons/action-not-interested.svg',
  'catalog/ui-assets/v1/icons/action-calendar-add.svg',
  'catalog/ui-assets/v1/icons/action-share.svg',
  'catalog/ui-assets/v1/icons/action-favorite-outline.svg',
  'catalog/ui-components/event-card-large/component-contract.v2.json',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.desktop-wide-calendar.8006.resolved-render-case.json',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.mobile-wide-calendar.8006.resolved-render-case.json',
  'catalog/fixtures/ui-reference-events/v2/events/event.real.8006.json',
];
const ACCEPTED_HASHES = {
  [EXPECTATIONS]: '0665e55fd069375306cf13a8bbe18ce6bdb80c5303d7ef069fc264671960980d',
  [FONT_BINDING]: '57e84a4c90545817744405cb7c735fe43831348fd568e74f6b36c2d0980ce3d0',
  [ASTRO_BINDING]: '7334a602497f172168a03c4c62b4c6548f7bff0c45b0777c350cc1919ee69645',
  [DESCENDANTS]: '24407e3287eaf689cf8e2e505c690c542133f89e855ee21c61d08bcdeb92a240',
  [REGIONS]: 'ce4bff02b0de75aca895507e17bbee27d44c5728dd800baece3ab4e098a77ecf',
  [MEDIA]: 'dd8834258d4a1ebde029aca1960bdd224bdf636d3fd8aee8fc7824012475de8b',
  'catalog/ui-assets/v1/icons/action-not-interested.svg': 'd8d94023de0e563663c71a628657e3e4402ed5cb36fa836f784071e83edc8ae6',
  'catalog/ui-assets/v1/icons/action-calendar-add.svg': 'f5465db33659eb80685704961006aa1d5f970f337dd6b330d8056c3326360633',
  'catalog/ui-assets/v1/icons/action-share.svg': '99103f01c0cbd48d87ff639dc3e6c6291a7f8c2aa147c854667d1a8f7a677cf9',
  'catalog/ui-assets/v1/icons/action-favorite-outline.svg': 'e5654867ef9431714cfc53a1890fb14fcaa52c64579388f5364a0fa01ce6ea58',
  'catalog/ui-components/event-card-large/component-contract.v2.json': '72385737a289f43090dd8d388497f755141e78f56a14576e4221fb817ab526fb',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.desktop-wide-calendar.8006.resolved-render-case.json': '876abb966fb9ae49f5196f02367e54103bcb3ed1eceb2f9e818f500a5b77d855',
  'catalog/ui-conformance/free-collection/g4/resolved/eventcard.mobile-wide-calendar.8006.resolved-render-case.json': '4a388f64cea110cb9d5a3ac2b3ee6400fa68e7f9d0c33df3c467372a670ece82',
  'catalog/fixtures/ui-reference-events/v2/events/event.real.8006.json': 'be2bf3ddb51c8b09afd80e3039776c03807c5f41fc4d0ad769980c65b51ee57b',
};

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const json = (bytes) => JSON.parse(bytes.toString('utf8'));
const cssNumber = (value) => Number.parseFloat(String(value ?? '0')) || 0;
const rgbToHex = (value) => {
  const match = String(value ?? '').match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return '#000000';
  return `#${match.slice(1, 4).map((part) => Number(part).toString(16).padStart(2, '0')).join('')}`;
};
const opacity = (value) => {
  const match = String(value ?? '').match(/^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/);
  return match ? Number(match[1]) : 1;
};

function compactSlot(slot) {
  return {
    box: slot.box,
    text: slot.text,
    lineFragments: slot.line_fragments || [],
    style: {
      fontSize: cssNumber(slot.style.fontSize),
      lineHeight: cssNumber(slot.style.lineHeight),
      letterSpacing: cssNumber(slot.style.letterSpacing),
      color: rgbToHex(slot.style.color),
      colorOpacity: opacity(slot.style.color),
      backgroundColor: rgbToHex(slot.style.backgroundColor),
      backgroundOpacity: opacity(slot.style.backgroundColor),
      radiusTL: cssNumber(slot.style.borderTopLeftRadius),
      radiusTR: cssNumber(slot.style.borderTopRightRadius),
      radiusBR: cssNumber(slot.style.borderBottomRightRadius),
      radiusBL: cssNumber(slot.style.borderBottomLeftRadius),
      strokeWidth: cssNumber(slot.style.borderTopWidth),
      strokeColor: rgbToHex(slot.style.borderTopColor),
      strokeOpacity: opacity(slot.style.borderTopColor),
    },
    resolvedFont: slot.resolved_font ?? null,
  };
}

function deriveDescendantCases(regions) {
  const selectors = {
    'eventcard.desktop-wide-calendar.8006': { not_interested: { root: 'button[18]', icon: 'svg[19]', label: 'span[23]' }, calendar: { root: 'a[24]', icon: 'svg[25]', label: 'span[29]' }, share: { root: 'button[31]', icon: 'svg[32]', label: 'span[34]', count: 'span[35]' }, like: { root: 'button[36]', icon: 'svg[37]', count: 'span[40]' } },
    'eventcard.mobile-wide-calendar.8006': { not_interested: { root: 'button[18]', icon: 'svg[19]', label: 'span[23]' }, calendar: { root: 'a[24]', icon: 'svg[25]', label: 'span[29]' }, share: { root: 'button[31]', icon: 'svg[32]', label: 'span[34]', count: 'span[35]' }, like: { root: 'button[36]', icon: 'svg[37]', count: 'span[40]' } },
  };
  const result = {};
  for (const [caseId, actions] of Object.entries(selectors)) {
    const region = regions.regions.find((candidate) => candidate.id === caseId);
    if (!region) throw new Error(`frozen region missing ${caseId}`);
    const nodes = Object.fromEntries(region.descendants.map((node) => [node.node_key, node]));
    result[caseId] = {};
    for (const [action, parts] of Object.entries(actions)) {
      const root = nodes[parts.root]?.box;
      if (!root) throw new Error(`frozen action root missing ${caseId}/${action}`);
      const out = {};
      for (const [part, nodeKey] of Object.entries(parts)) {
        if (part === 'root') continue;
        const box = nodes[nodeKey]?.box;
        if (!box) throw new Error(`frozen action descendant missing ${caseId}/${action}/${part}`);
        out[part] = { x: Number((box.x - root.x).toFixed(3)), y: Number((box.y - root.y).toFixed(3)), width: box.width, height: box.height };
      }
      result[caseId][action] = out;
    }
  }
  return result;
}

async function productionPayload(P) {
  const FILE_ID = '40e06342-8830-80d6-8008-8fc8a3a4cd4f';
  const PAGE_ID = 'c16498cb-b51d-8030-8008-904bd8fc9c53';
  const EXPECTED_BASELINE_REVISION = 40;
  const FAMILY = 'DejaVu Sans';
  const FONT_IDS = {
    400: 'bc4c12f7-f47c-802d-8006-6df32533516b',
    700: 'bc4c12f7-f47c-802d-8006-6df347cf14f9',
  };
  const LEAF_PATH = 'KenigEvents / G19 / EventCard 8006 / Leaves';
  const CARD_PATH = 'KenigEvents / G19 / EventCard 8006 / Accepted';
  const GENERATION = 19;
  const FIXTURE = 'event.real.8006';
  const marker = (key) => `kenigevents:g19:${FIXTURE}:${key}:v1`;
  const fail = (code, detail = {}) => {
    const error = new Error(`${code}: ${JSON.stringify(detail)}`);
    error.code = code;
    error.detail = detail;
    throw error;
  };
  const array = (value) => Array.from(value || []);
  const round = (value) => Math.round(Number(value) * 1000) / 1000;
  const eq = (a, b) => Math.abs(Number(a) - Number(b)) <= 0.02;
  const plugin = (shape, key, value) => shape.setPluginData(key, String(value));
  const children = (shape) => array(shape?.children);
  const walk = (root) => {
    const out = [], queue = root ? [root] : [];
    while (queue.length) {
      const shape = queue.shift();
      out.push(shape);
      queue.push(...children(shape));
    }
    return out;
  };
  const place = (shape, parent, box) => {
    if (parent) parent.appendChild(shape);
    if (shape.layoutChild) shape.layoutChild.absolute = true;
    shape.resize(box.width, box.height);
    penpotUtils.setParentXY(shape, box.x || 0, box.y || 0);
    return shape;
  };
  const setRadii = (shape, style = {}) => {
    shape.borderRadiusTopLeft = style.radiusTL || 0;
    shape.borderRadiusTopRight = style.radiusTR || 0;
    shape.borderRadiusBottomRight = style.radiusBR || 0;
    shape.borderRadiusBottomLeft = style.radiusBL || 0;
  };
  const setFill = (shape, color, fillOpacity = 1) => {
    shape.fills = fillOpacity > 0 ? [{ fillColor: color, fillOpacity }] : [];
    shape.strokes = [];
  };
  const setStroke = (shape, style = {}) => {
    shape.strokes = style.strokeWidth > 0 && style.strokeOpacity > 0 ? [{ strokeColor: style.strokeColor, strokeOpacity: style.strokeOpacity, strokeStyle: 'solid', strokeWidth: style.strokeWidth, strokeAlignment: 'inner' }] : [];
  };
  const auditRadii = (shape, style = {}, code = 'RADIUS_DRIFT', detail = {}) => {
    if (!eq(shape.borderRadiusTopLeft || 0, style.radiusTL || 0) || !eq(shape.borderRadiusTopRight || 0, style.radiusTR || 0) || !eq(shape.borderRadiusBottomRight || 0, style.radiusBR || 0) || !eq(shape.borderRadiusBottomLeft || 0, style.radiusBL || 0)) fail(code, detail);
  };
  const allComponents = () => array(penpot.library?.local?.components);
  const componentMain = (component) => typeof component?.mainInstance === 'function' ? component.mainInstance() : component?.mainInstance;
  const componentForMain = (main) => allComponents().find((component) => componentMain(component)?.id === main?.id) || null;
  const findComponent = (pathValue, name) => allComponents().find((component) => component.path === pathValue && component.name === name) || null;
  const managedRoots = () => children(penpot.currentPage?.root).filter((shape) => shape.getPluginData?.('kenigevents-g19-marker'));
  const findManagedRoot = (key) => managedRoots().find((shape) => shape.getPluginData('kenigevents-g19-marker') === marker(key)) || null;

  function assertPrimitives() {
    if (!globalThis.penpot || !globalThis.penpotUtils || !globalThis.storage) fail('PENPOT_GLOBALS_MISSING');
    for (const name of ['createBoard', 'createRectangle', 'createText', 'createShapeFromSvg', 'createShapeFromSvgWithImages']) {
      if (typeof penpot[name] !== 'function') fail('PENPOT_PRIMITIVE_MISSING', { name });
    }
    if (typeof penpotUtils.setParentXY !== 'function') fail('PENPOT_SET_PARENT_XY_MISSING');
    if (typeof penpot.library?.local?.createComponent !== 'function') fail('PENPOT_COMPONENT_API_MISSING');
    if (typeof penpot.currentFile?.validate !== 'function') fail('PENPOT_VALIDATE_API_MISSING');
    if (typeof penpot.currentFile?.saveVersion !== 'function') fail('PENPOT_SAVE_VERSION_API_MISSING');
    if (typeof penpot.currentFile?.findVersions !== 'function') fail('PENPOT_FIND_VERSIONS_API_MISSING');
    if (typeof penpot.history?.undoBlockBegin !== 'function' || typeof penpot.history?.undoBlockFinish !== 'function') fail('PENPOT_UNDO_BLOCK_API_MISSING');
    if (!penpot.fonts || typeof penpot.fonts.findByName !== 'function' || typeof penpot.fonts.findAllByName !== 'function') fail('PENPOT_FONT_API_MISSING');
  }

  function assertContext() {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      fail('PENPOT_TARGET_MISMATCH', { expectedFile: FILE_ID, actualFile: penpot.currentFile?.id, expectedPage: PAGE_ID, actualPage: penpot.currentPage?.id });
    }
    const revision = Number(penpot.currentFile?.revn ?? penpot.currentFile?.revision);
    if (!Number.isFinite(revision)) fail('PENPOT_REVISION_UNREADABLE');
    if (!managedRoots().length && revision !== EXPECTED_BASELINE_REVISION) {
      fail('PENPOT_BASELINE_REVISION_MISMATCH', { expected: EXPECTED_BASELINE_REVISION, actual: revision });
    }
  }

  function assertBaselineCensus() {
    const roots = children(penpot.currentPage?.root), components = allComponents(), validation = validationResult();
    const managed = roots.filter((shape) => shape.getPluginData?.('kenigevents-g19-marker'));
    if (!managed.length) {
      if (roots.length !== 0 || components.length !== 0 || validation.length !== 0) fail('PENPOT_BASELINE_CENSUS_MISMATCH', { directRoots: roots.length, localComponents: components.length, validation });
      return { mode: 'EMPTY_REVISION_40', directRoots: 0, localComponents: 0, validation };
    }
    if (managed.length !== roots.length) fail('UNMANAGED_DIRECT_ROOTS_PRESENT', { directRoots: roots.length, managedRoots: managed.length });
    if (components.some((component) => !componentMain(component)?.getPluginData?.('kenigevents-g19-marker'))) fail('UNMANAGED_LOCAL_COMPONENTS_PRESENT');
    if (validation.length !== 0) fail('PREEXISTING_VALIDATION_FAILURE', { validation });
    return { mode: 'G19_RESUME_OR_REUSE', directRoots: roots.length, localComponents: components.length, validation };
  }

  function resolveFonts() {
    const first = penpot.fonts.findByName(FAMILY);
    const fonts = [...new Set([first, ...array(penpot.fonts.findAllByName(FAMILY))].filter(Boolean))];
    const rows = [];
    for (const font of fonts) {
      if (typeof font.applyToText !== 'function') continue;
      for (const variant of [font, ...array(font.variants)]) {
        rows.push({ font, variant, ids: [variant?.id, variant?.fontId, variant?.fontVariantId, font?.id, font?.fontId, font?.fontVariantId].filter(Boolean).map(String), weight: Number(variant?.fontWeight ?? font?.fontWeight) });
      }
    }
    const resolved = {};
    for (const weight of [400, 700]) {
      const row = rows.find((candidate) => candidate.ids.includes(FONT_IDS[weight]) && (!Number.isFinite(candidate.weight) || candidate.weight === weight));
      if (!row) fail('EXACT_NATIVE_FONT_VARIANT_MISSING', { family: FAMILY, weight, requiredId: FONT_IDS[weight], available: rows.map((candidate) => ({ ids: candidate.ids, weight: candidate.weight })) });
      resolved[weight] = row;
    }
    return resolved;
  }

  function stamp(shape, key, role) {
    shape.name = key;
    plugin(shape, 'kenigevents-g19-marker', marker(key));
    plugin(shape, 'kenigevents-generation', GENERATION);
    plugin(shape, 'kenigevents-fixture-id', FIXTURE);
    plugin(shape, 'kenigevents-role', role);
    plugin(shape, 'kenigevents-payload-sha256', P.payloadSha256);
    plugin(shape, 'kenigevents-accepted-roots-cleanup', 'forbidden');
  }

  function applyText(textShape, style, fontRows) {
    const weight = 700;
    fontRows[weight].font.applyToText(textShape, fontRows[weight].variant);
    textShape.fontSize = style.fontSize;
    textShape.lineHeight = style.lineHeight;
    textShape.letterSpacing = style.letterSpacing || 0;
    textShape.fills = [{ fillColor: style.color, fillOpacity: style.colorOpacity }];
    plugin(textShape, 'kenigevents-font-family', FAMILY);
    plugin(textShape, 'kenigevents-font-weight', weight);
    plugin(textShape, 'kenigevents-font-id', FONT_IDS[weight]);
    plugin(textShape, 'kenigevents-font-variant-id', FONT_IDS[weight]);
  }

  function makeText(parent, name, value, box, style, fontRows) {
    const text = penpot.createText(value);
    text.name = name;
    text.characters = value;
    place(text, parent, box);
    applyText(text, style, fontRows);
    return text;
  }

  function tintedSvg(source, color) {
    return source.replace('<svg ', `<svg fill="${color}" color="${color}" `).replaceAll('currentColor', color);
  }

  function icon(parent, svg, color, x, y, width, height, name) {
    const shape = penpot.createShapeFromSvg(tintedSvg(svg, color));
    shape.name = name;
    place(shape, parent, { x, y, width, height });
    return shape;
  }

  function createLeafRoot(spec) {
    const root = penpot.createBoard();
    stamp(root, spec.key, 'leaf-master');
    root.clipContent = Boolean(spec.clip);
    setFill(root, spec.fill || '#000000', spec.fillOpacity ?? 0);
    setRadii(root, spec.style || {});
    if (spec.kind !== 'media') setStroke(root, spec.style || {});
    place(root, penpot.currentPage.root, { ...spec.box, x: spec.gallery.x, y: spec.gallery.y });
    plugin(root, 'kenigevents-build-state', 'BUILDING');
    return root;
  }

  const childMarker = (rootKey, childKey) => `${marker(rootKey)}:${childKey}`;
  const findChild = (parent, rootKey, childKey) => {
    const matches = children(parent).filter((shape) => shape.getPluginData?.('kenigevents-g19-child-marker') === childMarker(rootKey, childKey));
    if (matches.length > 1) fail('DUPLICATE_MANAGED_CHILD', { rootKey, childKey, ids: matches.map((shape) => shape.id) });
    return matches[0] || null;
  };
  const auditBox = (shape, box, code, detail = {}) => {
    if (!shape || !eq(shape.x, box.x || 0) || !eq(shape.y, box.y || 0) || !eq(shape.width, box.width) || !eq(shape.height, box.height)) fail(code, { ...detail, expected: box, actual: shape && { x: shape.x, y: shape.y, width: shape.width, height: shape.height } });
  };
  function stampChild(shape, rootKey, childKey) {
    plugin(shape, 'kenigevents-g19-child-marker', childMarker(rootKey, childKey));
    plugin(shape, 'kenigevents-payload-sha256', P.payloadSha256);
  }
  function ensureRectChild(parent, rootKey, childKey, box, color, fillOpacity = 1, style = null, createAllowed = true) {
    let shape = findChild(parent, rootKey, childKey);
    if (!shape) {
      if (!createAllowed) fail('MANAGED_RECT_MISSING', { rootKey, childKey });
      shape = penpot.createRectangle();
      if (!shape) fail('CREATE_RECTANGLE_FAILED', { rootKey, childKey });
      shape.name = childKey;
      stampChild(shape, rootKey, childKey);
      setFill(shape, color, fillOpacity);
      if (style) setRadii(shape, style);
      place(shape, parent, box);
    }
    auditBox(shape, box, 'MANAGED_RECT_GEOMETRY_DRIFT', { rootKey, childKey });
    const fill = array(shape.fills)[0];
    if (!fill || fill.fillColor !== color || !eq(fill.fillOpacity, fillOpacity) || array(shape.strokes).length || shape.getPluginData?.('kenigevents-payload-sha256') !== P.payloadSha256) fail('MANAGED_RECT_STYLE_OR_PAYLOAD_DRIFT', { rootKey, childKey });
    if (style) auditRadii(shape, style, 'MANAGED_RECT_RADIUS_DRIFT', { rootKey, childKey });
    return shape;
  }
  function ensureBoardChild(parent, rootKey, childKey, box, color, fillOpacity, style, createAllowed = true) {
    let shape = findChild(parent, rootKey, childKey);
    if (!shape) {
      if (!createAllowed) fail('MANAGED_BOARD_MISSING', { rootKey, childKey });
      shape = penpot.createBoard();
      if (!shape) fail('CREATE_BOARD_FAILED', { rootKey, childKey });
      shape.name = childKey;
      shape.clipContent = true;
      stampChild(shape, rootKey, childKey);
      setFill(shape, color, fillOpacity);
      setRadii(shape, style);
      place(shape, parent, box);
    }
    auditBox(shape, box, 'MANAGED_BOARD_GEOMETRY_DRIFT', { rootKey, childKey });
    const fill = array(shape.fills)[0];
    if (!fill || fill.fillColor !== color || !eq(fill.fillOpacity, fillOpacity) || array(shape.strokes).length || shape.clipContent !== true || shape.getPluginData?.('kenigevents-payload-sha256') !== P.payloadSha256) fail('MANAGED_BOARD_STYLE_OR_PAYLOAD_DRIFT', { rootKey, childKey });
    auditRadii(shape, style, 'MANAGED_BOARD_RADIUS_DRIFT', { rootKey, childKey });
    return shape;
  }
  function ensureTextChild(parent, rootKey, childKey, value, box, style, fontRows, createAllowed = true) {
    let shape = findChild(parent, rootKey, childKey);
    if (!shape) {
      if (!createAllowed) fail('MANAGED_TEXT_MISSING', { rootKey, childKey });
      shape = makeText(parent, childKey, value, box, style, fontRows);
      if (!shape) fail('CREATE_TEXT_FAILED', { rootKey, childKey });
      stampChild(shape, rootKey, childKey);
    }
    auditBox(shape, box, 'MANAGED_TEXT_GEOMETRY_DRIFT', { rootKey, childKey });
    const fill = array(shape.fills)[0];
    if (shape.characters !== value || shape.getPluginData?.('kenigevents-font-id') !== FONT_IDS[700] || shape.getPluginData?.('kenigevents-font-variant-id') !== FONT_IDS[700] || shape.getPluginData?.('kenigevents-font-family') !== FAMILY || shape.getPluginData?.('kenigevents-font-weight') !== '700' || shape.getPluginData?.('kenigevents-payload-sha256') !== P.payloadSha256 || !eq(shape.fontSize, style.fontSize) || !eq(shape.lineHeight, style.lineHeight) || !eq(shape.letterSpacing || 0, style.letterSpacing || 0) || !fill || fill.fillColor !== style.color || !eq(fill.fillOpacity, style.colorOpacity)) fail('MANAGED_TEXT_CONTENT_OR_FONT_DRIFT', { rootKey, childKey, value: shape.characters });
    return shape;
  }
  function ensureIconChild(parent, rootKey, childKey, source, color, box, assetSha256, createAllowed = true) {
    let shape = findChild(parent, rootKey, childKey);
    if (!shape) {
      if (!createAllowed) fail('MANAGED_ICON_MISSING', { rootKey, childKey });
      shape = penpot.createShapeFromSvg(tintedSvg(source, color));
      if (!shape) fail('CREATE_SVG_FAILED', { rootKey, childKey });
      shape.name = childKey;
      stampChild(shape, rootKey, childKey);
      plugin(shape, 'kenigevents-svg-sha256', assetSha256);
      plugin(shape, 'kenigevents-icon-color', color);
      place(shape, parent, box);
    }
    auditBox(shape, box, 'MANAGED_ICON_GEOMETRY_DRIFT', { rootKey, childKey });
    if (shape.getPluginData?.('kenigevents-svg-sha256') !== assetSha256 || shape.getPluginData?.('kenigevents-icon-color') !== color || shape.getPluginData?.('kenigevents-payload-sha256') !== P.payloadSha256) fail('MANAGED_ICON_ASSET_OR_COLOR_DRIFT', { rootKey, childKey });
    return shape;
  }
  async function withUndo(fn) {
    const blockId = penpot.history.undoBlockBegin();
    try { return await fn(); }
    finally { penpot.history.undoBlockFinish(blockId); }
  }

  async function ensureComponent(spec, build) {
    let component = findComponent(spec.path, spec.name) || allComponents().find((candidate) => componentMain(candidate)?.getPluginData?.('kenigevents-g19-marker') === marker(spec.key));
    if (component) {
      const main = componentMain(component);
      if (!main || main.getPluginData?.('kenigevents-g19-marker') !== marker(spec.key)) fail('COMPONENT_IDENTITY_COLLISION', { key: spec.key, name: spec.name });
      if ((component.path !== spec.path || component.name !== spec.name) && main.getPluginData('kenigevents-build-state') === 'READY_FOR_COMPONENT' && !component.path && !component.name) {
        return await withUndo(async () => {
          await build(main, true);
          component.path = spec.path;
          component.name = spec.name;
          plugin(main, 'kenigevents-component-name', spec.name);
          plugin(main, 'kenigevents-component-id', component.id);
          plugin(main, 'kenigevents-build-state', 'COMPLETE');
          return { component, main, created: true, resumedRegistration: true };
        });
      }
      if (component.path !== spec.path || component.name !== spec.name) fail('COMPONENT_REGISTRATION_INCOMPLETE', { key: spec.key, componentId: component.id, path: component.path, name: component.name });
      if (main.getPluginData('kenigevents-build-state') !== 'COMPLETE' || main.getPluginData('kenigevents-payload-sha256') !== P.payloadSha256) fail('COMPONENT_BUILD_STATE_DRIFT', { key: spec.key });
      auditBox(main, { x: main.x, y: main.y, width: spec.box.width, height: spec.box.height }, 'COMPONENT_GEOMETRY_DRIFT', { key: spec.key });
      await build(main, true);
      return { component, main, created: false };
    }
    return await withUndo(async () => {
      let root = findManagedRoot(spec.key);
      if (!root) root = createLeafRoot(spec);
      if (root.getPluginData('kenigevents-payload-sha256') !== P.payloadSha256) fail('MANAGED_ROOT_PAYLOAD_DRIFT', { key: spec.key, rootId: root.id });
      await build(root, false);
      plugin(root, 'kenigevents-build-state', 'READY_FOR_COMPONENT');
      component = penpot.library.local.createComponent([root]);
      if (!component) fail('CREATE_COMPONENT_FAILED', { key: spec.key });
      component.path = spec.path;
      component.name = spec.name;
      plugin(root, 'kenigevents-component-name', spec.name);
      plugin(root, 'kenigevents-component-id', component.id);
      plugin(root, 'kenigevents-build-state', 'COMPLETE');
      return { component, main: componentMain(component) || root, created: true };
    });
  }

  function leafSpecs(caseSpec, index) {
    const slots = caseSpec.slots, viewport = caseSpec.viewport, inner = P.descendants[caseSpec.caseId];
    const baseX = 1240 + index * 570;
    let galleryY = 0;
    const next = (height) => { const y = galleryY; galleryY += height + 24; return { x: baseX, y }; };
    const specs = [];
    const add = (identity, slotName, kind, extra = {}) => {
      const slot = slots[slotName], key = `${identity}.${viewport}.8006`;
      specs.push({ key, name: key, semanticIdentity: identity, path: LEAF_PATH, viewport, slotName, kind, box: { x: 0, y: 0, width: slot.box.width, height: slot.box.height }, gallery: next(slot.box.height), slot, ...extra });
    };
    add('event.media-frame', 'media-link', 'media', { clip: true, fill: '#15110f', fillOpacity: 1, style: slots['media-link'].style, mediaSlot: slots.image });
    add('event.meta.event-type', 'event-type', 'text-pill');
    add('event.meta.admission', 'admission', 'text-pill');
    add('event.action.not-interested', 'action.not_interested', 'action', { action: 'not_interested', inner: inner.not_interested });
    add('event.action.calendar', 'action.calendar', 'action', { action: 'calendar', inner: inner.calendar });
    add('event.action.share', 'action.share', 'action', { action: 'share', inner: inner.share });
    add('event.action.like', 'action.like', 'action', { action: 'like', inner: inner.like });
    return specs;
  }

  async function buildLeaf(spec, root, fontRows, auditOnly) {
    if (auditOnly) {
      if (root.getPluginData('kenigevents-semantic-identity') !== spec.semanticIdentity || root.getPluginData('kenigevents-structural-context') !== spec.viewport) fail('LEAF_SEMANTIC_BINDING_DRIFT', { key: spec.key });
    } else {
      plugin(root, 'kenigevents-semantic-identity', spec.semanticIdentity);
      plugin(root, 'kenigevents-structural-context', spec.viewport);
    }
    const slot = spec.slot;
    const auditLeafRootStyle = () => {
      const fills = array(root.fills), expectedFillOpacity = spec.fillOpacity ?? slot.style.backgroundOpacity ?? 0;
      const expectedFillColor = spec.fill || slot.style.backgroundColor;
      if (expectedFillOpacity > 0 && (!fills[0] || fills[0].fillColor !== expectedFillColor || !eq(fills[0].fillOpacity, expectedFillOpacity))) fail('LEAF_ROOT_FILL_DRIFT', { key: spec.key });
      if (expectedFillOpacity === 0 && fills.length) fail('LEAF_ROOT_FILL_DRIFT', { key: spec.key });
      auditRadii(root, spec.style || slot.style, 'LEAF_ROOT_RADIUS_DRIFT', { key: spec.key });
      const expectedStroke = spec.kind !== 'media' && slot.style.strokeWidth > 0 && slot.style.strokeOpacity > 0;
      const strokes = array(root.strokes);
      if (expectedStroke && (!strokes[0] || strokes[0].strokeColor !== slot.style.strokeColor || !eq(strokes[0].strokeOpacity, slot.style.strokeOpacity) || !eq(strokes[0].strokeWidth, slot.style.strokeWidth))) fail('LEAF_ROOT_STROKE_DRIFT', { key: spec.key });
      if (!expectedStroke && strokes.length) fail('LEAF_ROOT_STROKE_DRIFT', { key: spec.key });
      if (root.getPluginData('kenigevents-payload-sha256') !== P.payloadSha256) fail('LEAF_ROOT_PAYLOAD_DRIFT', { key: spec.key });
    };
    if (spec.kind === 'media') {
      const imageBox = spec.mediaSlot.box;
      const box = { x: imageBox.x - slot.box.x, y: imageBox.y - slot.box.y, width: imageBox.width, height: imageBox.height };
      let media = findChild(root, spec.key, 'poster');
      if (!media) {
        if (auditOnly) fail('MANAGED_MEDIA_MISSING', { key: spec.key });
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${box.width}" height="${box.height}" viewBox="0 0 ${box.width} ${box.height}"><rect width="${box.width}" height="${box.height}" fill="#15110f"/><image x="0" y="0" width="${box.width}" height="${box.height}" preserveAspectRatio="xMidYMid meet" href="data:image/webp;base64,${P.mediaBase64}" xlink:href="data:image/webp;base64,${P.mediaBase64}"/></svg>`;
        media = await penpot.createShapeFromSvgWithImages(svg);
        if (!media) fail('CREATE_MEDIA_SVG_FAILED', { key: spec.key });
        media.name = 'event.real.8006.poster.contain.50-50';
        stampChild(media, spec.key, 'poster');
        place(media, root, box);
        plugin(media, 'kenigevents-media-sha256', P.mediaSha256);
        plugin(media, 'kenigevents-media-fit', 'contain');
        plugin(media, 'kenigevents-media-position', '50% 50%');
      }
      auditBox(media, box, 'MANAGED_MEDIA_GEOMETRY_DRIFT', { key: spec.key });
      if (media.getPluginData('kenigevents-media-sha256') !== P.mediaSha256 || media.getPluginData('kenigevents-media-fit') !== 'contain' || media.getPluginData('kenigevents-media-position') !== '50% 50%') fail('MANAGED_MEDIA_BINDING_DRIFT', { key: spec.key });
      ensureRectChild(root, spec.key, 'border.top', { x: 0, y: 0, width: slot.box.width, height: 1 }, '#793014', 0.13, null, !auditOnly);
      ensureRectChild(root, spec.key, 'border.left', { x: 0, y: 0, width: 1, height: slot.box.height }, '#793014', 0.13, null, !auditOnly);
      ensureRectChild(root, spec.key, 'border.right', { x: slot.box.width - 1, y: 0, width: 1, height: slot.box.height }, '#793014', 0.13, null, !auditOnly);
      auditLeafRootStyle();
      return;
    }
    if (spec.kind === 'text-pill') {
      const fragment = slot.lineFragments[0];
      if (!fragment) fail('FROZEN_LINE_FRAGMENT_MISSING', { key: spec.key });
      const box = { x: fragment.x - slot.box.x, y: fragment.y - slot.box.y, width: fragment.width, height: fragment.height };
      if (!auditOnly) {
        setFill(root, slot.style.backgroundColor, slot.style.backgroundOpacity);
        setRadii(root, slot.style);
        setStroke(root, slot.style);
      }
      ensureTextChild(root, spec.key, 'label', slot.text, box, slot.style, fontRows, !auditOnly);
      auditLeafRootStyle();
      return;
    }
    if (!auditOnly) {
      if (slot.style.backgroundOpacity > 0) setFill(root, slot.style.backgroundColor, slot.style.backgroundOpacity);
      setRadii(root, slot.style);
      setStroke(root, slot.style);
    }
    const colors = slot.style.color, geometry = spec.inner;
    const iconSource = { not_interested: P.icons.notInterested, calendar: P.icons.calendar, share: P.icons.share, like: P.icons.like }[spec.action];
    const iconSha256 = { not_interested: P.iconSha256.notInterested, calendar: P.iconSha256.calendar, share: P.iconSha256.share, like: P.iconSha256.like }[spec.action];
    const labels = { not_interested: 'Не интересно', calendar: 'В календарь', share: 'Поделиться' };
    ensureIconChild(root, spec.key, 'icon', iconSource, colors, geometry.icon, iconSha256, !auditOnly);
    if (geometry.label) ensureTextChild(root, spec.key, 'label', labels[spec.action], geometry.label, slot.style, fontRows, !auditOnly);
    if (geometry.count) ensureTextChild(root, spec.key, 'count', spec.action === 'share' ? '1' : '9', geometry.count, slot.style, fontRows, !auditOnly);
    auditLeafRootStyle();
  }

  function createCardRoot(spec) {
    const root = penpot.createBoard();
    stamp(root, spec.key, 'accepted-card-master');
    root.clipContent = false;
    setFill(root, '#000000', 0);
    setRadii(root, { radiusTL: 24, radiusTR: 24, radiusBR: 24, radiusBL: 24 });
    place(root, penpot.currentPage.root, { ...spec.box, x: spec.position.x, y: spec.position.y });
    plugin(root, 'kenigevents-build-state', 'BUILDING');
    plugin(root, 'kenigevents-semantic-root', spec.semanticRoot);
    plugin(root, 'kenigevents-semantic-identity', 'component.event-card.free-collection');
    plugin(root, 'kenigevents-structural-context', spec.structuralContext);
    plugin(root, 'kenigevents-case-id', spec.caseId);
    return root;
  }

  function ensureLinkedInstance(parent, rootKey, binding, leaf, createAllowed = true) {
    let instance = findChild(parent, rootKey, binding.slotName);
    if (!instance) {
      if (!createAllowed) fail('LINKED_INSTANCE_MISSING', { rootKey, slotName: binding.slotName });
      instance = leaf.component.instance();
      if (!instance) fail('CREATE_COMPONENT_INSTANCE_FAILED', { rootKey, leafKey: binding.leafKey });
      instance.name = binding.slotName;
      stampChild(instance, rootKey, binding.slotName);
      plugin(instance, 'kenigevents-linked-leaf-key', binding.leafKey);
      plugin(instance, 'kenigevents-linked-component-id', leaf.component.id);
      plugin(instance, 'kenigevents-linked', 'true');
      place(instance, parent, binding.box);
    }
    auditBox(instance, binding.box, 'LINKED_INSTANCE_GEOMETRY_DRIFT', { rootKey, slotName: binding.slotName });
    const actualComponent = typeof instance.component === 'function' ? instance.component() : null;
    if (!linked(instance) || actualComponent?.id !== leaf.component.id || instance.getPluginData('kenigevents-linked-component-id') !== leaf.component.id) fail('LINKED_INSTANCE_LINEAGE_DRIFT', { rootKey, slotName: binding.slotName, expectedComponentId: leaf.component.id, actualComponentId: actualComponent?.id || null });
    return instance;
  }

  async function buildCard(spec, root, leaves, fontRows, auditOnly) {
    auditRadii(root, { radiusTL: 24, radiusTR: 24, radiusBR: 24, radiusBL: 24 }, 'CARD_ROOT_RADIUS_DRIFT', { key: spec.key });
    if (array(root.fills).length || array(root.strokes).length || root.clipContent !== false || root.getPluginData('kenigevents-payload-sha256') !== P.payloadSha256) fail('CARD_ROOT_STYLE_OR_PAYLOAD_DRIFT', { key: spec.key });
    ensureRectChild(root, spec.key, 'surface.body', spec.slots.body.box, '#15110f', 1, null, !auditOnly);
    const u = spec.slots['utility-row'].box;
    const utility = ensureBoardChild(root, spec.key, 'surface.utility-row', u, '#15110f', 1, spec.slots['utility-row'].style, !auditOnly);
    ensureRectChild(root, spec.key, 'body.border.left', { x: spec.slots.body.box.x, y: spec.slots.body.box.y, width: 1, height: spec.slots.body.box.height }, '#793014', 0.13, null, !auditOnly);
    ensureRectChild(root, spec.key, 'body.border.right', { x: spec.slots.body.box.width - 1, y: spec.slots.body.box.y, width: 1, height: spec.slots.body.box.height }, '#793014', 0.13, null, !auditOnly);
    ensureRectChild(utility, spec.key, 'utility.border.left', { x: 0, y: 0, width: 1, height: u.height }, '#793014', 0.13, null, !auditOnly);
    ensureRectChild(utility, spec.key, 'utility.border.right', { x: u.width - 1, y: 0, width: 1, height: u.height }, '#793014', 0.13, null, !auditOnly);
    ensureRectChild(utility, spec.key, 'utility.border.bottom', { x: 0, y: u.height - 1, width: u.width, height: 1 }, '#793014', 0.13, null, !auditOnly);
    for (const slotName of ['title', 'occurrence', 'place']) {
      const slot = spec.slots[slotName];
      ensureTextChild(root, spec.key, slotName, slot.text, slot.box, slot.style, fontRows, !auditOnly);
    }
    for (const binding of spec.bindings) {
      const leaf = leaves[binding.leafKey];
      if (!leaf) fail('LEAF_COMPONENT_MISSING', { leafKey: binding.leafKey });
      ensureLinkedInstance(root, spec.key, binding, leaf, !auditOnly);
    }
  }

  async function ensureCard(spec, leaves, fontRows) {
    let component = findComponent(CARD_PATH, spec.name) || allComponents().find((candidate) => componentMain(candidate)?.getPluginData?.('kenigevents-g19-marker') === marker(spec.key));
    if (component) {
      const main = componentMain(component);
      if (main && (component.path !== CARD_PATH || component.name !== spec.name) && main.getPluginData('kenigevents-build-state') === 'READY_FOR_COMPONENT' && !component.path && !component.name) {
        return await withUndo(async () => {
          await buildCard(spec, main, leaves, fontRows, true);
          component.path = CARD_PATH;
          component.name = spec.name;
          plugin(main, 'kenigevents-component-name', spec.name);
          plugin(main, 'kenigevents-component-id', component.id);
          plugin(main, 'kenigevents-build-state', 'COMPLETE');
          return { component, main, created: true, resumedRegistration: true };
        });
      }
      if (!main || component.path !== CARD_PATH || component.name !== spec.name || main.getPluginData('kenigevents-build-state') !== 'COMPLETE') fail('CARD_COMPONENT_IDENTITY_COLLISION', { key: spec.key });
      auditBox(main, { x: main.x, y: main.y, width: spec.box.width, height: spec.box.height }, 'CARD_ROOT_GEOMETRY_DRIFT', { key: spec.key });
      await buildCard(spec, main, leaves, fontRows, true);
      return { component, main, created: false };
    }
    return await withUndo(async () => {
      let root = findManagedRoot(spec.key);
      if (!root) root = createCardRoot(spec);
      await buildCard(spec, root, leaves, fontRows, false);
      plugin(root, 'kenigevents-build-state', 'READY_FOR_COMPONENT');
      component = penpot.library.local.createComponent([root]);
      if (!component) fail('CREATE_CARD_COMPONENT_FAILED', { key: spec.key });
      component.path = CARD_PATH;
      component.name = spec.name;
      plugin(root, 'kenigevents-component-name', spec.name);
      plugin(root, 'kenigevents-component-id', component.id);
      plugin(root, 'kenigevents-build-state', 'COMPLETE');
      return { component, main: componentMain(component) || root, created: true };
    });
  }

  function cardSpecs() {
    return P.cases.map((caseSpec, index) => {
      const viewport = caseSpec.viewport;
      const suffix = `${viewport}.8006`;
      const slotToLeaf = {
        'media-link': `event.media-frame.${suffix}`,
        'event-type': `event.meta.event-type.${suffix}`,
        admission: `event.meta.admission.${suffix}`,
        'action.not_interested': `event.action.not-interested.${suffix}`,
        'action.calendar': `event.action.calendar.${suffix}`,
        'action.share': `event.action.share.${suffix}`,
        'action.like': `event.action.like.${suffix}`,
      };
      return {
        key: caseSpec.caseId,
        name: caseSpec.caseId,
        caseId: caseSpec.caseId,
        semanticRoot: `kenigevents.free-collection.${caseSpec.caseId}`,
        viewport,
        structuralContext: caseSpec.caseId.replace(/^eventcard\./, '').replace(/\.8006$/, ''),
        box: caseSpec.box,
        slots: caseSpec.slots,
        position: index === 0 ? { x: 0, y: 0 } : { x: 620, y: 0 },
        bindings: Object.entries(slotToLeaf).map(([slotName, leafKey]) => ({ slotName, leafKey, box: caseSpec.slots[slotName].box })),
      };
    });
  }

  function linked(instance) {
    if (typeof instance?.isComponentCopyInstance === 'function') return Boolean(instance.isComponentCopyInstance());
    if (typeof instance?.component === 'function') return Boolean(instance.component());
    return Boolean(instance?.componentId || instance?.getPluginData?.('kenigevents-linked') === 'true');
  }

  function validationResult() {
    const result = penpot.currentFile.validate();
    return Array.isArray(result) ? result : result == null ? [] : result;
  }

  function readback() {
    assertContext();
    const leafSpecsAll = P.cases.flatMap((caseSpec, index) => leafSpecs(caseSpec, index));
    const cardSpecsAll = cardSpecs();
    const expectedLeafNames = leafSpecsAll.map((spec) => spec.name), expectedCardNames = cardSpecsAll.map((spec) => spec.name);
    const names = [...expectedLeafNames, ...expectedCardNames], expectedMarkers = new Set([...leafSpecsAll.map((spec) => marker(spec.key)), ...cardSpecsAll.map((spec) => marker(spec.key))]);
    const auditIssues = [];
    const components = names.map((name) => {
      const pathValue = expectedCardNames.includes(name) ? CARD_PATH : LEAF_PATH;
      const matches = allComponents().filter((component) => component.path === pathValue && component.name === name);
      const component = matches[0], main = componentMain(component);
      if (matches.length !== 1) auditIssues.push({ code: 'COMPONENT_CARDINALITY', name, count: matches.length });
      if (!main || main.getPluginData?.('kenigevents-build-state') !== 'COMPLETE' || main.getPluginData?.('kenigevents-payload-sha256') !== P.payloadSha256) auditIssues.push({ code: 'COMPONENT_STATE_OR_PAYLOAD', name });
      return { name, path: pathValue, componentId: component?.id || null, rootId: main?.id || null, marker: main?.getPluginData?.('kenigevents-g19-marker') || null, width: main ? round(main.width) : null, height: main ? round(main.height) : null, directChildCount: main ? children(main).length : null };
    });
    for (const spec of leafSpecsAll) {
      const component = findComponent(LEAF_PATH, spec.name), main = componentMain(component);
      if (!main || !eq(main.width, spec.box.width) || !eq(main.height, spec.box.height)) auditIssues.push({ code: 'LEAF_ROOT_GEOMETRY', name: spec.name });
      const expectedChildren = spec.kind === 'media' ? 4 : spec.kind === 'text-pill' ? 1 : spec.inner.label && spec.inner.count ? 3 : 2;
      if (main && children(main).length !== expectedChildren) auditIssues.push({ code: 'LEAF_CHILD_CARDINALITY', name: spec.name, expected: expectedChildren, actual: children(main).length });
      if (main && walk(main).filter((shape) => shape.type === 'text').some((shape) => shape.getPluginData?.('kenigevents-font-id') !== FONT_IDS[700])) auditIssues.push({ code: 'LEAF_TEXT_FONT', name: spec.name });
      if (spec.kind === 'media' && main) {
        const media = findChild(main, spec.key, 'poster');
        if (!media || media.getPluginData('kenigevents-media-sha256') !== P.mediaSha256 || media.getPluginData('kenigevents-media-fit') !== 'contain' || media.getPluginData('kenigevents-media-position') !== '50% 50%') auditIssues.push({ code: 'MEDIA_BINDING', name: spec.name });
      }
    }
    const requiredText = ['Донорская акция «Стань донором крови»', 'встреча', '2 сентября 09:00', 'Бесплатно · регистрация', 'Гурьевск · Центр культуры и досуга', 'Не интересно', 'В календарь', 'Поделиться', '1', '9'];
    const cards = cardSpecsAll.map((spec) => {
      const component = findComponent(CARD_PATH, spec.name), main = componentMain(component);
      const linkedLeaves = main ? children(main).filter(linked) : [], textShapes = main ? walk(main).filter((shape) => shape.type === 'text') : [], text = textShapes.map((shape) => shape.characters);
      if (!main || !eq(main.width, spec.box.width) || !eq(main.height, spec.box.height)) auditIssues.push({ code: 'CARD_ROOT_GEOMETRY', name: spec.name });
      if (main && children(main).length !== 14) auditIssues.push({ code: 'CARD_CHILD_CARDINALITY', name: spec.name, expected: 14, actual: children(main).length });
      if (linkedLeaves.length !== 7) auditIssues.push({ code: 'CARD_LINKED_LEAF_COUNT', name: spec.name, expected: 7, actual: linkedLeaves.length });
      for (const binding of spec.bindings) {
        const instance = main && findChild(main, spec.key, binding.slotName);
        if (!instance || !eq(instance.x, binding.box.x) || !eq(instance.y, binding.box.y) || !eq(instance.width, binding.box.width) || !eq(instance.height, binding.box.height)) auditIssues.push({ code: 'CARD_SLOT_GEOMETRY', name: spec.name, slot: binding.slotName });
      }
      for (const value of requiredText) if (!text.includes(value)) auditIssues.push({ code: 'CARD_TEXT_MISSING', name: spec.name, value });
      if (textShapes.some((shape) => shape.getPluginData?.('kenigevents-font-id') !== FONT_IDS[700])) auditIssues.push({ code: 'CARD_TEXT_FONT', name: spec.name });
      return { name: spec.name, semanticRoot: main?.getPluginData?.('kenigevents-semantic-root') || null, structuralContext: main?.getPluginData?.('kenigevents-structural-context') || null, componentId: component?.id || null, rootId: main?.id || null, width: main ? round(main.width) : null, height: main ? round(main.height) : null, linkedLeafCount: linkedLeaves.length, text };
    });
    const roots = managedRoots(), rootMarkers = roots.map((root) => root.getPluginData('kenigevents-g19-marker'));
    const semanticTuples = roots.map((root) => `${root.getPluginData('kenigevents-semantic-identity')}|${root.getPluginData('kenigevents-structural-context')}`);
    const componentMainIds = new Set(allComponents().map((component) => componentMain(component)?.id).filter(Boolean));
    const markerDuplicates = rootMarkers.length - new Set(rootMarkers).size;
    const unexpectedMarkers = rootMarkers.filter((value) => !expectedMarkers.has(value));
    const nameDuplicates = names.reduce((count, name) => count + Math.max(0, allComponents().filter((component) => component.name === name && (component.path === CARD_PATH || component.path === LEAF_PATH)).length - 1), 0);
    const semanticDuplicates = semanticTuples.length - new Set(semanticTuples).size;
    const duplicates = markerDuplicates + nameDuplicates + semanticDuplicates + unexpectedMarkers.length;
    if (roots.length !== names.length) auditIssues.push({ code: 'MANAGED_ROOT_COUNT', expected: names.length, actual: roots.length });
    if (allComponents().length !== names.length) auditIssues.push({ code: 'LOCAL_COMPONENT_COUNT', expected: names.length, actual: allComponents().length });
    const validation = validationResult();
    return {
      schema: 'kenigevents.penpot.g19.eventcard-8006.readback.v1',
      fileId: penpot.currentFile.id,
      pageId: penpot.currentPage.id,
      revision: penpot.currentFile.revn ?? penpot.currentFile.revision ?? null,
      fixtureId: FIXTURE,
      payloadSha256: P.payloadSha256,
      expectedBaselineRevision: EXPECTED_BASELINE_REVISION,
      managedDirectRootCount: roots.length,
      expectedManagedDirectRootCount: names.length,
      acceptedCardRootCount: cards.filter((card) => card.rootId).length,
      expectedAcceptedCardRootCount: 2,
      expectedManagedComponentCount: names.length,
      managedComponentCount: components.filter((component) => component.componentId).length,
      totalLocalComponentCount: allComponents().length,
      detachedRootCount: roots.filter((root) => !componentMainIds.has(root.id)).length,
      screenshotRootCount: roots.filter((root) => /screenshot/i.test(root.name) || root.getPluginData?.('kenigevents-role') === 'screenshot').length,
      routeLocalDuplicateMasterCount: duplicates,
      fontBinding: { family: FAMILY, regular400Id: FONT_IDS[400], bold700Id: FONT_IDS[700], sourceBindingSha256: P.fontSourceBindingSha256 },
      components,
      cards,
      auditIssues,
      validation,
    };
  }

  function base64(bytes) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let out = '';
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i], b = i + 1 < bytes.length ? bytes[i + 1] : 0, c = i + 2 < bytes.length ? bytes[i + 2] : 0;
      const n = (a << 16) | (b << 8) | c;
      out += alphabet[(n >>> 18) & 63] + alphabet[(n >>> 12) & 63] + (i + 1 < bytes.length ? alphabet[(n >>> 6) & 63] : '=') + (i + 2 < bytes.length ? alphabet[n & 63] : '=');
    }
    return out;
  }

  async function exportedBytes(value) {
    if (value instanceof Uint8Array) return value;
    if (value instanceof ArrayBuffer) return new Uint8Array(value);
    if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    if (value && typeof value.arrayBuffer === 'function') return new Uint8Array(await value.arrayBuffer());
    if (typeof value === 'string' && value.startsWith('data:')) {
      return { dataUrl: value, base64: value.slice(value.indexOf(',') + 1) };
    }
    fail('UNSUPPORTED_PNG_EXPORT_RESULT', { type: typeof value });
  }

  async function exportRoots() {
    assertContext();
    const exports = [];
    for (const caseSpec of P.cases) {
      const component = findComponent(CARD_PATH, caseSpec.caseId), root = componentMain(component);
      if (!root) fail('ACCEPTED_CARD_ROOT_MISSING', { name: caseSpec.caseId });
      if (typeof root.export !== 'function') fail('PENPOT_EXPORT_API_MISSING', { rootId: root.id });
      const raw = await root.export({ type: 'png' });
      const converted = await exportedBytes(raw);
      const encoded = converted.base64 || base64(converted);
      exports.push({ name: caseSpec.caseId, rootId: root.id, componentId: component.id, mime_type: 'image/png', byte_length: converted.byteLength ?? null, base64: encoded, data_url: converted.dataUrl || `data:image/png;base64,${encoded}` });
    }
    return { schema: 'kenigevents.penpot.g19.eventcard-8006.png-exports.v1', fileId: FILE_ID, pageId: PAGE_ID, exports };
  }

  async function materialize() {
    assertPrimitives();
    assertContext();
    const preflight = assertBaselineCensus();
    const fontRows = resolveFonts(); // Mandatory zero-write preflight; no family fallback.
    const leaves = {};
    const created = [], reused = [];
    for (let index = 0; index < P.cases.length; index += 1) {
      const caseSpec = P.cases[index];
      for (const spec of leafSpecs(caseSpec, index)) {
        const result = await ensureComponent(spec, (root, auditOnly) => buildLeaf(spec, root, fontRows, auditOnly));
        leaves[spec.key] = result;
        (result.created ? created : reused).push({ role: 'leaf', name: spec.name, componentId: result.component.id, rootId: result.main.id });
      }
    }
    for (const spec of cardSpecs()) {
      const result = await ensureCard(spec, leaves, fontRows);
      (result.created ? created : reused).push({ role: 'accepted-card', name: spec.name, componentId: result.component.id, rootId: result.main.id });
    }
    const beforeSave = readback();
    if (beforeSave.detachedRootCount !== 0 || beforeSave.screenshotRootCount !== 0 || beforeSave.routeLocalDuplicateMasterCount !== 0 || beforeSave.validation.length !== 0 || beforeSave.auditIssues.length !== 0) {
      fail('POST_WRITE_ACCEPTANCE_FAILED', beforeSave);
    }
    if (beforeSave.acceptedCardRootCount !== 2 || beforeSave.managedComponentCount !== beforeSave.expectedManagedComponentCount || beforeSave.managedDirectRootCount !== beforeSave.expectedManagedDirectRootCount || beforeSave.totalLocalComponentCount !== beforeSave.expectedManagedComponentCount) fail('POST_WRITE_COUNT_MISMATCH', beforeSave);
    const versionLabel = `G19 EventCard event.real.8006 · ${P.payloadSha256.slice(0, 12)}`;
    const versions = array(await penpot.currentFile.findVersions());
    let version = versions.find((candidate) => (candidate?.label || candidate?.name) === versionLabel) || null;
    const versionCreated = Boolean(created.length || !version);
    if (versionCreated) version = await penpot.currentFile.saveVersion(versionLabel);
    const savedVersion = { id: version?.id || null, label: version?.label || version?.name || versionLabel, created: versionCreated };
    const result = readback(); // Required post-save validate/readback.
    if (result.validation.length || result.auditIssues.length) fail('POST_SAVE_ACCEPTANCE_FAILED', result);
    return { schema: 'kenigevents.penpot.g19.eventcard-8006.materialization-receipt.v1', terminalState: created.length ? 'SUCCEEDED' : 'SUCCEEDED_IDEMPOTENT_REUSE', mutations: created.length, preflight, created, reused, savedVersion, readback: result };
  }

  const api = { materialize, readback, exportRoots, constants: { FILE_ID, PAGE_ID, EXPECTED_BASELINE_REVISION, FAMILY, FONT_IDS, LEAF_PATH, CARD_PATH, FIXTURE } };
  storage.g19EventCard8006 = api;
  return await materialize();
}

async function main() {
  const rows = [];
  const bytesByPath = {};
  for (const relative of INPUTS) {
    const bytes = await readFile(path.join(ROOT, relative));
    const actual = sha256(bytes);
    if (actual !== ACCEPTED_HASHES[relative]) throw new Error(`accepted input hash mismatch for ${relative}: ${actual}`);
    rows.push({ path: relative, sha256: actual, bytes: bytes.length });
    bytesByPath[relative] = bytes;
  }
  const expectations = json(bytesByPath[EXPECTATIONS]);
  const fontBinding = json(bytesByPath[FONT_BINDING]);
  const astroBinding = json(bytesByPath[ASTRO_BINDING]);
  const descendants = json(bytesByPath[DESCENDANTS]);
  const regions = json(bytesByPath[REGIONS]);
  if (fontBinding.content_sha256 !== '7c7200f93156ee60a456f1b666b84d73a45b405ce23198150c89c87d092d1226') throw new Error('font source binding content identity mismatch');
  if (astroBinding.head !== 'c7c3e2367db8fd8865a735c8b9f5df1ef2b6efd1' || descendants.source.head !== astroBinding.head || descendants.source.sha256 !== 'ce4bff02b0de75aca895507e17bbee27d44c5728dd800baece3ab4e098a77ecf') throw new Error('frozen Astro evidence binding mismatch');
  if (JSON.stringify(deriveDescendantCases(regions)) !== JSON.stringify(descendants.cases)) throw new Error('frozen descendant excerpt does not reproduce from bound regions.json');
  const wanted = ['eventcard.desktop-wide-calendar.8006', 'eventcard.mobile-wide-calendar.8006'];
  const cases = wanted.map((caseId) => {
    const source = expectations.cases.find((candidate) => candidate.case_id === caseId);
    if (!source) throw new Error(`missing accepted case ${caseId}`);
    return { caseId, viewport: source.viewport, box: source.box, slots: Object.fromEntries(Object.entries(source.slots).map(([name, slot]) => [name, compactSlot(slot)])) };
  });
  const leafIdentities = ['event.media-frame', 'event.meta.event-type', 'event.meta.admission', 'event.action.not-interested', 'event.action.calendar', 'event.action.share', 'event.action.like'];
  const expectedLeafComponents = ['desktop', 'mobile'].flatMap((viewport) => leafIdentities.map((identity) => `${identity}.${viewport}.8006`));
  const payloadCore = {
    schema: 'kenigevents.penpot.g19.eventcard-8006.payload.v1',
    controlGeneration: 19,
    leaseId: 'G19-P2-P4-ACTUAL-MATERIALIZATION-R1',
    solePenpotWriter: 'E0_CHATGPT_PRO',
    fileId: '40e06342-8830-80d6-8008-8fc8a3a4cd4f',
    pageId: 'c16498cb-b51d-8030-8008-904bd8fc9c53',
    expectedBaselineRevision: 40,
    promotedUiSot: '78a84576740cb650b2efbe2900377f371faf49a1',
    acceptedExecutorFontBinding: '4d352be4f908209091020bf1689792f1aa7e4280',
    frozenAstroEvidence: 'c7c3e2367db8fd8865a735c8b9f5df1ef2b6efd1',
    c2FinalControlReference: 'f280254308a636335de74f8cbdc8df95999a0b90',
    fixtureId: 'event.real.8006',
    fontSourceBindingSha256: fontBinding.content_sha256,
    mediaSha256: ACCEPTED_HASHES[MEDIA],
    mediaBase64: bytesByPath[MEDIA].toString('base64'),
    icons: {
      notInterested: bytesByPath['catalog/ui-assets/v1/icons/action-not-interested.svg'].toString('utf8'),
      calendar: bytesByPath['catalog/ui-assets/v1/icons/action-calendar-add.svg'].toString('utf8'),
      share: bytesByPath['catalog/ui-assets/v1/icons/action-share.svg'].toString('utf8'),
      like: bytesByPath['catalog/ui-assets/v1/icons/action-favorite-outline.svg'].toString('utf8'),
    },
    iconSha256: {
      notInterested: ACCEPTED_HASHES['catalog/ui-assets/v1/icons/action-not-interested.svg'],
      calendar: ACCEPTED_HASHES['catalog/ui-assets/v1/icons/action-calendar-add.svg'],
      share: ACCEPTED_HASHES['catalog/ui-assets/v1/icons/action-share.svg'],
      like: ACCEPTED_HASHES['catalog/ui-assets/v1/icons/action-favorite-outline.svg'],
    },
    descendants: descendants.cases,
    cases,
    inputs: rows,
  };
  const payloadSha256 = sha256(Buffer.from(JSON.stringify(payloadCore)));
  const payload = { ...payloadCore, payloadSha256 };
  const runSource = `/** GENERATED by scripts/round-trip-reconstruction/generate-g19-eventcard-8006-materializer.mjs. DO NOT EDIT. */\nreturn await (${productionPayload.toString()})(${JSON.stringify(payload)});\n`;
  const readbackSource = `/** Run after run-materialization.js in the same Penpot plugin session. */\nif(!storage.g19EventCard8006) throw new Error('G19_EVENTCARD_8006_API_NOT_INSTALLED');\nreturn storage.g19EventCard8006.readback();\n`;
  const exportSource = `/** Export both accepted EventCard roots as directly decodable PNG payloads. */\nif(!storage.g19EventCard8006) throw new Error('G19_EVENTCARD_8006_API_NOT_INSTALLED');\nreturn await storage.g19EventCard8006.exportRoots();\n`;
  const outputs = {
    'run-materialization.js': runSource,
    'readback.js': readbackSource,
    'export-roots.js': exportSource,
  };
  const manifest = {
    schema: 'kenigevents.penpot.g19.eventcard-8006.manifest.v1',
    generation: 19,
    lease_id: payload.leaseId,
    sole_penpot_writer: payload.solePenpotWriter,
    penpot_mutations_by_codex: 0,
    target: { file_id: payload.fileId, page_id: payload.pageId, expected_baseline_revision: 40 },
    accepted_tuple: { promoted_ui_sot: payload.promotedUiSot, accepted_executor_font_binding: payload.acceptedExecutorFontBinding, frozen_astro_evidence: payload.frozenAstroEvidence, c2_final_control_reference: payload.c2FinalControlReference },
    object_provenance: {
      design_system: {
        promoted_ui_sot: { commit: payload.promotedUiSot, tree: 'd1cb94fe462dd2d56698d8528dd382f462725e6d' },
        accepted_executor_font_binding: { commit: payload.acceptedExecutorFontBinding, tree: '435d53f36600953efe093ebcfd88cc79e76615d2' },
        delivery_base: { commit: '7bf067475a1dd03b5208b804ced9dbed277cdf30', tree: '47095a9f2089e3fc8f99752252bbcc367034d84c' },
      },
      events_bot_new: {
        frozen_astro_evidence: { commit: payload.frozenAstroEvidence, tree: '3c7b231d10e93866899cede299c3523c8b996711', binding_path: ASTRO_BINDING, regions_git_blob_sha1: descendants.source.git_blob_sha1, regions_sha256: descendants.source.sha256 },
        c2_final: { commit: payload.c2FinalControlReference, tree: 'ef0dfc93717da62b9e77cf494ca755baa180f145' },
      },
    },
    payload_sha256: payloadSha256,
    expected_card_components: wanted,
    expected_leaf_components: expectedLeafComponents,
    materialization_profile: {
      owner_override: 'G19-P2-P4-ACTUAL-MATERIALIZATION-R1',
      accepted_card_encoding: 'two exact fixture-bound structural-context root components explicitly required by the owner override',
      common_semantic_identity: 'component.event-card.free-collection',
      leaf_encoding: 'seven semantic identities per structural context; duplicate detection key is semantic_identity plus structural_context',
      accepted_g12_one_master_variant_container: 'preserved as upstream model; not rewritten by this bounded first-material payload',
    },
    native_fonts: { family: 'DejaVu Sans', regular_400_id: 'bc4c12f7-f47c-802d-8006-6df32533516b', bold_700_id: 'bc4c12f7-f47c-802d-8006-6df347cf14f9', source_binding_sha256: fontBinding.content_sha256 },
    inputs: rows,
    outputs: Object.entries(outputs).map(([file, source]) => ({ path: `catalog/penpot-executor/g19/${file}`, sha256: sha256(Buffer.from(source)), bytes: Buffer.byteLength(source) })),
    execution: { materialize: 'Pass the exact UTF-8 contents of run-materialization.js to Penpot.execute_code.', readback_validate: 'Pass readback.js after materialization in the same plugin session.', export_png: 'Pass export-roots.js after materialization in the same plugin session.' },
  };
  await mkdir(OUT, { recursive: true });
  for (const [file, source] of Object.entries(outputs)) await writeFile(path.join(OUT, file), source);
  await writeFile(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ payloadSha256, outputs: manifest.outputs }, null, 2)}\n`);
}

await main();

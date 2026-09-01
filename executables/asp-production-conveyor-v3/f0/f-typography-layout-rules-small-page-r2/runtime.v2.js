'use strict';

const ATLAS = Object.freeze({
  branch: 'o0/penpot-atlas-layout-v2-20260901',
  head: '663be702d481972cb2e8863af500f1c35dda1d8c',
  tree: 'cf9a1e6a5e0a84aea5636334dbd3be4961039b75',
  templateId: 'FOUNDATION_ASSET_GRID_WIDE_V2',
  documentationNamespace: 'kenigevents-atlas-documentation-v2',
  documentationComponentId: 'component/ATLAS_PAGE_HEADER_V2',
  documentationInstanceId: 'instance/ATLAS_PAGE_HEADER_V2',
  componentFamilyHardLimits: Object.freeze({
    'F-TYPOGRAPHY-TYPE-SCALE-SMALL-PAGE': 3,
    'F-TYPOGRAPHY-LAYOUT-RULES-SMALL-PAGE': 7,
  }),
});

const FONT = Object.freeze({
  family: 'DejaVu Sans',
  regular: Object.freeze({
    bytes: 759720,
    sha256: 'ae7b7855e115a5966d8b1b3f80f254ccc117ec86f9965e202ee2940453837280',
    weight: '400',
  }),
  bold: Object.freeze({
    bytes: 708920,
    sha256: '5c1247acef7f2b8522a31742c76d6adcb5569bacc0be7ceaa4dc39dd252ce895',
    weight: '700',
  }),
});

const WIDE = Object.freeze({
  outerMargin: 64,
  headerOriginY: 64,
  headerWidth: 2048,
  headerHeight: 128,
  contentStartY: 256,
  bottomPadding: 64,
  rootWidth: 2176,
  contentWidth: 2048,
  masterWidth: 512,
  gridWidth: 1504,
  columns: 2,
  cellWidth: 736,
  specimenHeight: 224,
  labelBlockHeight: 32,
  cellHeight: 320,
  columnGap: 32,
  rowGap: 32,
  sectionGap: 96,
  cellPadding: 24,
});

const SOURCE = Object.freeze({
  head: 'eb388db611fb997283ba63c452b6642ff3508678',
  tree: '95dd6b548d1a5fd071b6fe35d74a893f8db21d7a',
  packagePath: 'catalog/asp-production-conveyor-v3/f0/F-TYPOGRAPHY-LAYOUT.package.v3.json',
  packageBlob: '501c307799bf412bc658dc89a04245f8a5cabc61',
  packageBytes: 21620,
  packageSha256: '193b5b5db1a504883e9718e7029d756b552f29636fdb4d924ad08fe84764017f',
});

function invariant(value, message) {
  if (!value) throw new Error(message);
}

function children(node) {
  return Array.from(node?.children || []);
}

function walk(node) {
  const output = [];
  const visit = (value) => {
    output.push(value);
    for (const child of children(value)) visit(child);
  };
  if (node) visit(node);
  return output;
}

function getData(node, namespace, key) {
  const value = node?.getSharedPluginData?.(namespace, key);
  return typeof value === 'string' ? value : '';
}

function setData(node, namespace, key, value) {
  invariant(typeof value === 'string', `PLUGIN_DATA_STRING_REQUIRED:${namespace}:${key}`);
  node.setSharedPluginData(namespace, key, value);
}

function resize(node, width, height) {
  if (node.width !== width || node.height !== height) node.resize(width, height);
}

function fill(node, color) {
  node.fills = [{ fillColor: color, fillOpacity: 1 }];
}

function stroke(node, color, width = 1) {
  node.strokes = [{ strokeColor: color, strokeWidth: width, strokeStyle: 'solid' }];
}

function addFlex(board, direction, options = {}) {
  const flex = board.flex || board.addFlexLayout();
  flex.dir = direction;
  flex.rowGap = options.rowGap ?? 0;
  flex.columnGap = options.columnGap ?? 0;
  flex.topPadding = options.topPadding ?? 0;
  flex.rightPadding = options.rightPadding ?? 0;
  flex.bottomPadding = options.bottomPadding ?? 0;
  flex.leftPadding = options.leftPadding ?? 0;
  flex.alignItems = options.alignItems || 'start';
  flex.justifyContent = options.justifyContent || 'start';
  flex.horizontalSizing = 'fix';
  flex.verticalSizing = 'fix';
  return flex;
}

function addGrid(board, rows) {
  const created = !board.grid;
  const grid = board.grid || board.addGridLayout();
  grid.dir = 'row';
  if (created) {
    for (let column = 0; column < WIDE.columns; column += 1) {
      grid.addColumn('fixed', WIDE.cellWidth);
    }
    for (let row = 0; row < rows; row += 1) grid.addRow('fixed', WIDE.cellHeight);
  }
  invariant(grid.columns.length === WIDE.columns, 'WIDE_GRID_COLUMN_CENSUS');
  invariant(grid.rows.length === rows, 'WIDE_GRID_ROW_CENSUS');
  invariant(grid.columns.every((track) => track.type === 'fixed' && track.value === WIDE.cellWidth),
    'WIDE_GRID_COLUMN_TRACK_DRIFT');
  invariant(grid.rows.every((track) => track.type === 'fixed' && track.value === WIDE.cellHeight),
    'WIDE_GRID_ROW_TRACK_DRIFT');
  grid.rowGap = WIDE.rowGap;
  grid.columnGap = WIDE.columnGap;
  grid.alignItems = 'start';
  grid.justifyItems = 'start';
  grid.horizontalSizing = 'fix';
  grid.verticalSizing = 'fix';
  return grid;
}

function sha256Portable(bytes) {
  const input = Array.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));
  const constants = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
  ];
  const hash = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const padded = input.slice();
  const bitLow = (input.length << 3) >>> 0;
  const bitHigh = Math.floor(input.length / 0x20000000) >>> 0;
  const rotateRight = (value, count) => (value >>> count) | (value << (32 - count));
  padded.push(0x80);
  while (padded.length % 64 !== 56) padded.push(0);
  for (let index = 3; index >= 0; index -= 1) padded.push((bitHigh >>> (index * 8)) & 255);
  for (let index = 3; index >= 0; index -= 1) padded.push((bitLow >>> (index * 8)) & 255);
  for (let offset = 0; offset < padded.length; offset += 64) {
    const words = new Array(64);
    for (let index = 0; index < 16; index += 1) {
      words[index] = ((padded[offset + index * 4] << 24) | (padded[offset + index * 4 + 1] << 16)
        | (padded[offset + index * 4 + 2] << 8) | padded[offset + index * 4 + 3]) >>> 0;
    }
    for (let index = 16; index < 64; index += 1) {
      const a = words[index - 15];
      const b = words[index - 2];
      const sigma0 = rotateRight(a, 7) ^ rotateRight(a, 18) ^ (a >>> 3);
      const sigma1 = rotateRight(b, 17) ^ rotateRight(b, 19) ^ (b >>> 10);
      words[index] = (words[index - 16] + sigma0 + words[index - 7] + sigma1) >>> 0;
    }
    let [a,b,c,d,e,f,g,h] = hash;
    for (let index = 0; index < 64; index += 1) {
      const sigma1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choice = (e & f) ^ ((~e) & g);
      const first = (h + sigma1 + choice + constants[index] + words[index]) >>> 0;
      const sigma0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const second = (sigma0 + majority) >>> 0;
      h=g; g=f; f=e; e=(d+first)>>>0; d=c; c=b; b=a; a=(first+second)>>>0;
    }
    hash[0]=(hash[0]+a)>>>0; hash[1]=(hash[1]+b)>>>0; hash[2]=(hash[2]+c)>>>0; hash[3]=(hash[3]+d)>>>0;
    hash[4]=(hash[4]+e)>>>0; hash[5]=(hash[5]+f)>>>0; hash[6]=(hash[6]+g)>>>0; hash[7]=(hash[7]+h)>>>0;
  }
  return hash.map((part) => part.toString(16).padStart(8, '0')).join('');
}

async function sha256(bytes) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return sha256Portable(view);
  const digest = new Uint8Array(await subtle.digest('SHA-256', view));
  return Array.from(digest).map((part) => part.toString(16).padStart(2, '0')).join('');
}

async function verifyFonts(fontBytes) {
  invariant(fontBytes && typeof fontBytes === 'object', 'EXACT_FONT_BYTES_REQUIRED');
  const result = {};
  for (const face of ['regular', 'bold']) {
    const bytes = fontBytes[face] instanceof Uint8Array
      ? fontBytes[face]
      : new Uint8Array(fontBytes[face] || []);
    const expected = FONT[face];
    invariant(bytes.byteLength === expected.bytes, `FONT_BYTES_MISMATCH:${face}`);
    const digest = await sha256(bytes);
    invariant(digest === expected.sha256, `FONT_SHA256_MISMATCH:${face}`);
    result[face] = Object.freeze({ bytes: bytes.byteLength, sha256: digest });
  }
  return Object.freeze(result);
}

function stableProjection(node) {
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    width: node.width,
    height: node.height,
    x: node.x,
    y: node.y,
    text: node.type === 'text' ? node.characters : null,
    children: children(node).map(stableProjection),
  };
}

async function protectedProjection(penpot, pageName) {
  const pages = Array.from(penpot.currentFile.pages || [])
    .filter((page) => page.name !== pageName)
    .sort((left, right) => left.id.localeCompare(right.id));
  const raw = JSON.stringify(pages.map((page) => ({
    id: page.id,
    name: page.name,
    root: stableProjection(page.root),
  })));
  return Object.freeze({ chars: raw.length, sha256: await sha256(new TextEncoder().encode(raw)) });
}

function findUnique(values, predicate, message) {
  const matches = values.filter(predicate);
  invariant(matches.length <= 1, message);
  return matches[0] || null;
}

function ensureText(penpot, parent, namespace, stableId, characters, created) {
  let text = findUnique(
    children(parent),
    (node) => node.type === 'text' && getData(node, namespace, 'stable-id') === stableId,
    `DUPLICATE_TEXT:${stableId}`,
  );
  if (!text) {
    text = penpot.createText(characters);
    invariant(text, `TEXT_CREATE_FAILED:${stableId}`);
    text.name = stableId;
    setData(text, namespace, 'stable-id', stableId);
    parent.appendChild(text);
    created.count += 1;
  }
  text.characters = characters;
  text.fontFamily = FONT.family;
  return text;
}

function ensureBoard(penpot, parent, namespace, stableId, created) {
  let board = findUnique(
    children(parent),
    (node) => node.type === 'board' && getData(node, namespace, 'stable-id') === stableId,
    `DUPLICATE_BOARD:${stableId}`,
  );
  if (!board) {
    board = penpot.createBoard();
    board.name = stableId;
    setData(board, namespace, 'stable-id', stableId);
    parent.appendChild(board);
    created.count += 1;
  }
  return board;
}

function ensureRectangle(penpot, parent, namespace, stableId, created) {
  let rectangle = findUnique(
    children(parent),
    (node) => node.type === 'rectangle' && getData(node, namespace, 'stable-id') === stableId,
    `DUPLICATE_RECTANGLE:${stableId}`,
  );
  if (!rectangle) {
    rectangle = penpot.createRectangle();
    rectangle.name = stableId;
    setData(rectangle, namespace, 'stable-id', stableId);
    parent.appendChild(rectangle);
    created.count += 1;
  }
  return rectangle;
}

function headerComponent(penpot) {
  const components = Array.from(penpot.library.local.components || []);
  const component = findUnique(
    components,
    (candidate) => getData(
      candidate.mainInstance?.(),
      ATLAS.documentationNamespace,
      'stable-id',
    ) === ATLAS.documentationComponentId,
    'DUPLICATE_ATLAS_PAGE_HEADER_V2',
  );
  invariant(component, 'ATLAS_PAGE_HEADER_V2_MISSING');
  return component;
}

function bindHeaderFields(instance, spec) {
  const fields = Object.freeze({
    'atlas.header.top.section': 'Foundations / Typography',
    'atlas.header.top.page-title': spec.pageName,
    'atlas.header.top.lifecycle-status': 'CANDIDATE',
    'atlas.header.meta.owner': 'F0',
    'atlas.header.meta.package-id': spec.packageId,
    'atlas.header.meta.source-or-fixture': `${SOURCE.head}:${SOURCE.packagePath}`,
    'atlas.header.meta.viewport-and-state-coverage': `${spec.specimens.length} linked native specimens`,
    'atlas.header.meta.v0-status': 'PENDING_ATLAS_EVIDENCE_GATE',
    'atlas.header.meta.last-reviewed-revision': '—',
  });
  for (const [stableId, value] of Object.entries(fields)) {
    const field = findUnique(
      walk(instance),
      (node) => node.type === 'text'
        && getData(node, ATLAS.documentationNamespace, 'stable-id') === stableId,
      `DUPLICATE_HEADER_FIELD:${stableId}`,
    );
    invariant(field, `ATLAS_HEADER_FIELD_MISSING:${stableId}`);
    field.characters = value;
  }
}

function ensureHeader(penpot, root, spec, created) {
  const component = headerComponent(penpot);
  let instance = findUnique(
    children(root),
    (node) => node.isComponentCopyInstance?.()
      && node.component?.()?.id === component.id
      && getData(node, ATLAS.documentationNamespace, 'stable-id') === ATLAS.documentationInstanceId,
    'DUPLICATE_LINKED_ATLAS_PAGE_HEADER_V2',
  );
  if (!instance) {
    instance = component.instance();
    invariant(instance?.isComponentCopyInstance?.(), 'DETACHED_ATLAS_PAGE_HEADER_V2');
    setData(instance, ATLAS.documentationNamespace, 'stable-id', ATLAS.documentationInstanceId);
    root.appendChild(instance);
    created.count += 1;
  }
  instance.name = `Documentation / ATLAS_PAGE_HEADER_V2 / ${spec.packageId}`;
  resize(instance, WIDE.headerWidth, WIDE.headerHeight);
  bindHeaderFields(instance, spec);
  return instance;
}

function componentFor(penpot, namespace, componentId) {
  return findUnique(
    Array.from(penpot.library.local.components || []),
    (component) => getData(component.mainInstance?.(), namespace, 'component-id') === componentId,
    `DUPLICATE_COMPONENT:${componentId}`,
  );
}

function configureMasterAnatomy(penpot, master, namespace, family, created) {
  resize(master, 464, 184);
  fill(master, '#FFFFFF');
  stroke(master, '#D1D5DB');
  master.borderRadius = 12;
  addFlex(master, 'column', {
    rowGap: 12,
    topPadding: 16,
    rightPadding: 16,
    bottomPadding: 16,
    leftPadding: 16,
  });
  const title = ensureText(penpot, master, namespace, 'role/title', family.label, created);
  title.fontSize = '14';
  title.fontWeight = '700';
  title.lineHeight = '1.2';
  title.fills = [{ fillColor: '#111827', fillOpacity: 1 }];
  const sample = ensureText(
    penpot,
    master,
    namespace,
    'role/sample',
    'Кёнигсберг · Калининград · типографический образец',
    created,
  );
  sample.fontSize = '24';
  sample.fontWeight = '400';
  sample.lineHeight = '1.25';
  sample.fills = [{ fillColor: '#221A14', fillOpacity: 1 }];
  const visual = ensureBoard(penpot, master, namespace, 'role/visual', created);
  resize(visual, 432, 72);
  fill(visual, '#F8FAFC');
  stroke(visual, '#E5E7EB');
  visual.borderRadius = 8;
  const bar = ensureRectangle(penpot, visual, namespace, 'role/bar', created);
  resize(bar, 288, 16);
  fill(bar, '#0F766E');
  bar.borderRadius = 8;
  setData(master, namespace, 'family', family.id);
  setData(master, namespace, 'component-id', family.id);
  setData(master, namespace, 'stable-id', `component/${family.id}`);
  setData(master, namespace, 'source-package-blob', SOURCE.packageBlob);
}

function ensureComponent(penpot, masterColumn, spec, family, created) {
  let component = componentFor(penpot, spec.namespace, family.id);
  if (!component) {
    const master = penpot.createBoard();
    master.name = `Foundation / Typography R2 / ${family.label}`;
    configureMasterAnatomy(penpot, master, spec.namespace, family, created);
    masterColumn.appendChild(master);
    component = penpot.library.local.createComponent([master]);
    component.name = family.label;
    component.path = `Foundations / Typography R2 / ${spec.packageId}`;
    created.count += 2;
  }
  const master = component.mainInstance();
  invariant(master && getData(master, spec.namespace, 'component-id') === family.id,
    `COMPONENT_LINEAGE_INVALID:${family.id}`);
  invariant(spec.allowedSourceComponentIds.includes(family.id), `NEW_COMPONENT_FAMILY_FORBIDDEN:${family.id}`);
  if (master.parent?.id !== masterColumn.id) masterColumn.appendChild(master);
  return component;
}

function descendantByRole(instance, namespace, role) {
  return findUnique(
    walk(instance),
    (node) => getData(node, namespace, 'stable-id') === role,
    `DUPLICATE_ROLE:${role}`,
  );
}

function applySpecimen(instance, specimen, namespace) {
  const sample = descendantByRole(instance, namespace, 'role/sample');
  const visual = descendantByRole(instance, namespace, 'role/visual');
  const bar = descendantByRole(instance, namespace, 'role/bar');
  invariant(sample && visual && bar, `SPECIMEN_ANATOMY_MISSING:${specimen.id}`);
  sample.characters = specimen.text;
  sample.fontFamily = FONT.family;
  sample.fontWeight = specimen.weight;
  sample.fontSize = specimen.fontSize;
  sample.lineHeight = specimen.lineHeight;
  resize(sample, specimen.frameWidth, specimen.textHeight);
  resize(visual, 432, 72);
  resize(bar, specimen.visualWidth, specimen.visualHeight);
  fill(bar, specimen.visualColor);
  bar.borderRadius = specimen.visualRadius;
  bar.opacity = specimen.visualOpacity;
  setData(instance, namespace, 'placement-id', specimen.id);
  setData(instance, namespace, 'component-id', specimen.componentId);
  setData(instance, namespace, 'source-component-id', specimen.sourceComponentId || specimen.componentId);
  setData(instance, namespace, 'state', specimen.state);
  setData(instance, namespace, 'editable-cyrillic', 'true');
  setData(instance, namespace, 'font-family', FONT.family);
  setData(instance, namespace, 'font-regular-bytes', '759720');
  setData(instance, namespace, 'font-bold-bytes', '708920');
}

function ensureCell(penpot, gridBoard, grid, spec, specimen, components, index, created) {
  let cell = findUnique(
    children(gridBoard),
    (node) => getData(node, spec.namespace, 'placement-id') === specimen.id,
    `DUPLICATE_PLACEMENT:${specimen.id}`,
  );
  if (!cell) {
    cell = penpot.createBoard();
    cell.name = `Specimen / ${specimen.id}`;
    setData(cell, spec.namespace, 'placement-id', specimen.id);
    setData(cell, spec.namespace, 'stable-id', `cell/${specimen.id}`);
    const row = Math.floor(index / WIDE.columns) + 1;
    const column = (index % WIDE.columns) + 1;
    grid.appendChild(cell, row, column);
    created.count += 1;
  }
  resize(cell, WIDE.cellWidth, WIDE.cellHeight);
  fill(cell, '#FFFFFF');
  stroke(cell, '#E5E7EB');
  cell.borderRadius = 12;
  addFlex(cell, 'column', {
    rowGap: 16,
    topPadding: WIDE.cellPadding,
    rightPadding: WIDE.cellPadding,
    bottomPadding: WIDE.cellPadding,
    leftPadding: WIDE.cellPadding,
  });
  const label = ensureText(
    penpot,
    cell,
    spec.namespace,
    'role/cell-label',
    `${specimen.id} · ${specimen.state}`,
    created,
  );
  label.fontSize = '14';
  label.fontWeight = '700';
  label.lineHeight = '1.428571';
  label.fills = [{ fillColor: '#111827', fillOpacity: 1 }];
  resize(label, 688, 32);
  let instance = findUnique(
    children(cell),
    (node) => node.isComponentCopyInstance?.()
      && getData(node, spec.namespace, 'placement-id') === specimen.id,
    `DUPLICATE_LINKED_SPECIMEN:${specimen.id}`,
  );
  if (!instance) {
    const component = components[specimen.componentId];
    invariant(component, `COMPONENT_MISSING:${specimen.componentId}`);
    instance = component.instance();
    invariant(instance?.isComponentCopyInstance?.() && instance.component?.()?.id === component.id,
      `DETACHED_CREATED_SPECIMEN:${specimen.id}`);
    applySpecimen(instance, specimen, spec.namespace);
    cell.appendChild(instance);
    created.count += 1;
  } else {
    const component = components[specimen.componentId];
    invariant(component && instance.component?.()?.id === component.id,
      `SPECIMEN_COMPONENT_LINEAGE_DRIFT:${specimen.id}`);
    applySpecimen(instance, specimen, spec.namespace);
  }
  resize(instance, 688, 224);
  return cell;
}

function screenshots(root) {
  return walk(root).filter((node) => node.type === 'image'
    || Array.from(node.fills || []).some((entry) => Boolean(entry.fillImage)));
}

function readback(penpot, page, root, spec, components, content, masterColumn, gridBoard) {
  invariant(children(page.root).length === 1 && children(page.root)[0].id === root.id,
    'CANDIDATE_ROOT_BOUNDARY');
  const headers = children(root).filter((node) => node.isComponentCopyInstance?.()
    && getData(node, ATLAS.documentationNamespace, 'stable-id') === ATLAS.documentationInstanceId);
  invariant(headers.length === 1 && headers[0].component?.()?.id === headerComponent(penpot).id,
    'ATLAS_PAGE_HEADER_V2_NOT_LINKED');
  invariant(root.flex?.dir === 'column' && content.flex?.dir === 'row'
    && masterColumn.flex?.dir === 'column' && Boolean(gridBoard.grid), 'NATIVE_LAYOUT_SHELL_MISSING');
  invariant(root.width === WIDE.rootWidth, 'WIDE_ROOT_WIDTH_DRIFT');
  invariant(headers[0].width === WIDE.headerWidth && headers[0].height === WIDE.headerHeight,
    'WIDE_HEADER_GEOMETRY_DRIFT');
  invariant(masterColumn.width === WIDE.masterWidth && gridBoard.width === WIDE.gridWidth,
    'WIDE_COLUMN_GEOMETRY_DRIFT');
  const rows = Math.ceil(spec.specimens.length / WIDE.columns);
  const contentHeight = rows * WIDE.cellHeight + Math.max(0, rows - 1) * WIDE.rowGap;
  const rootHeight = WIDE.contentStartY + contentHeight + WIDE.bottomPadding;
  invariant(gridBoard.height === contentHeight && content.height === contentHeight
    && root.height === rootHeight, 'WIDE_ROW_OR_ROOT_FORMULA_DRIFT');
  const cells = children(gridBoard).filter((node) => getData(node, spec.namespace, 'placement-id'));
  invariant(cells.length === spec.specimens.length, 'SPECIMEN_CELL_CENSUS');
  invariant(new Set(cells.map((cell) => getData(cell, spec.namespace, 'placement-id'))).size === cells.length,
    'DUPLICATE_SPECIMEN_CELL');
  let detached = 0;
  let emptyWells = 0;
  let editableCyrillic = 0;
  for (const cell of cells) {
    const label = children(cell).find((node) => node.type === 'text'
      && getData(node, spec.namespace, 'stable-id') === 'role/cell-label');
    const instances = children(cell).filter((node) => getData(node, spec.namespace, 'placement-id'));
    if (!label || instances.length !== 1) emptyWells += 1;
    for (const instance of instances) {
      if (!instance.isComponentCopyInstance?.() || !instance.component?.()) detached += 1;
      const sample = descendantByRole(instance, spec.namespace, 'role/sample');
      if (sample?.type === 'text' && /[А-Яа-яЁё]/.test(sample.characters || '')) editableCyrillic += 1;
    }
  }
  invariant(emptyWells === 0, 'EMPTY_WELL');
  invariant(detached === 0, 'DETACHED_SPECIMEN');
  invariant(editableCyrillic === spec.specimens.length, 'EDITABLE_CYRILLIC_CENSUS');
  invariant(screenshots(root).length === 0, 'SCREENSHOT_IMPLEMENTATION');
  const componentValues = Object.values(components);
  invariant(componentValues.length === spec.families.length, 'COMPONENT_CENSUS');
  invariant(componentValues.length <= spec.atlasHardLimitComponentFamilies,
    'ATLAS_COMPONENT_FAMILY_HARD_LIMIT_EXCEEDED');
  invariant(componentValues.every((component) => spec.allowedSourceComponentIds.includes(
    getData(component.mainInstance(), spec.namespace, 'component-id'),
  )), 'NEW_COMPONENT_FAMILY_FORBIDDEN');
  const validation = penpot.currentFile.validate?.() || [];
  invariant(validation.length === 0, 'VALIDATION_DRIFT');
  return Object.freeze({
    roots: 1,
    nativeComponentMasters: componentValues.length,
    linkedSpecimens: cells.length,
    detached,
    screenshots: 0,
    duplicates: 0,
    emptyWells,
    editableCyrillic,
    validation,
    rows,
    contentHeight,
    rootHeight,
  });
}

async function runTypographyAtlasR2Native({ penpot, fontBytes }, spec) {
  invariant(penpot?.currentFile, 'PENPOT_CONTEXT_REQUIRED');
  invariant(spec?.atlasHead === ATLAS.head && spec.atlasTree === ATLAS.tree, 'ATLAS_R2_PIN_DRIFT');
  invariant(spec.templateId === ATLAS.templateId, 'WIDE_TEMPLATE_REQUIRED');
  invariant(spec.sourceHead === SOURCE.head && spec.sourceBlob === SOURCE.packageBlob,
    'SOURCE_TUPLE_DRIFT');
  invariant(spec.doesNotRepairEventcardText === true, 'EVENTCARD_TEXT_BOUNDARY_REQUIRED');
  const hardLimit = spec.atlasHardLimitComponentFamilies;
  invariant(Number.isInteger(hardLimit) && hardLimit > 0, 'ATLAS_COMPONENT_FAMILY_HARD_LIMIT_REQUIRED');
  invariant(hardLimit === ATLAS.componentFamilyHardLimits[spec.packageId],
    'ATLAS_COMPONENT_FAMILY_HARD_LIMIT_PIN_DRIFT');
  invariant(Array.isArray(spec.families) && spec.families.length <= hardLimit,
    'ATLAS_COMPONENT_FAMILY_HARD_LIMIT_EXCEEDED');
  invariant(new Set(spec.families.map((family) => family.id)).size === spec.families.length,
    'DUPLICATE_COMPONENT_FAMILY_SPEC');
  invariant(spec.specimens.every((specimen) => spec.families.some(
    (family) => family.id === specimen.componentId,
  )), 'SPECIMEN_COMPONENT_FAMILY_UNBOUND');
  invariant(spec.specimens.every((specimen) => spec.allowedSourceComponentIds.includes(
    specimen.sourceComponentId || specimen.componentId,
  )), 'SPECIMEN_SOURCE_ROLE_UNBOUND');
  const verifiedFonts = await verifyFonts(fontBytes);
  const before = await protectedProjection(penpot, spec.pageName);
  const created = { count: 0 };
  const namespace = spec.namespace;
  const pages = Array.from(penpot.currentFile.pages || []);
  let page = findUnique(
    pages,
    (candidate) => candidate.name === spec.pageName
      || getData(candidate, namespace, 'package-id') === spec.packageId,
    'DUPLICATE_OR_FOREIGN_TARGET_PAGE',
  );
  if (!page) {
    page = penpot.createPage();
    page.name = spec.pageName;
    setData(page, namespace, 'package-id', spec.packageId);
    setData(page, namespace, 'source-blob', SOURCE.packageBlob);
    setData(page, namespace, 'atlas-head', ATLAS.head);
    created.count += 1;
  }
  invariant(page.name === spec.pageName, 'TARGET_PAGE_NAME_DRIFT');
  let root = findUnique(
    children(page.root),
    (node) => getData(node, namespace, 'stable-id') === 'candidate-root',
    'DUPLICATE_CANDIDATE_ROOT',
  );
  if (!root) {
    root = penpot.createBoard();
    root.name = spec.rootName;
    setData(root, namespace, 'stable-id', 'candidate-root');
    setData(root, namespace, 'package-id', spec.packageId);
    setData(root, namespace, 'atlas-template-id', ATLAS.templateId);
    page.root.appendChild(root);
    created.count += 1;
  }
  invariant(children(page.root).every((node) => node.id === root.id), 'FOREIGN_TARGET_PAGE_TOPOLOGY');
  const rows = Math.ceil(spec.specimens.length / WIDE.columns);
  const contentHeight = rows * WIDE.cellHeight + Math.max(0, rows - 1) * WIDE.rowGap;
  const rootHeight = WIDE.contentStartY + contentHeight + WIDE.bottomPadding;
  root.name = spec.rootName;
  resize(root, WIDE.rootWidth, rootHeight);
  fill(root, '#FFFFFF');
  root.clipContent = false;
  addFlex(root, 'column', {
    rowGap: 64,
    topPadding: WIDE.outerMargin,
    rightPadding: WIDE.outerMargin,
    bottomPadding: WIDE.bottomPadding,
    leftPadding: WIDE.outerMargin,
  });
  ensureHeader(penpot, root, spec, created);
  const content = ensureBoard(penpot, root, namespace, 'slot/content', created);
  resize(content, WIDE.contentWidth, contentHeight);
  content.clipContent = false;
  addFlex(content, 'row', { columnGap: WIDE.columnGap });
  const masterColumn = ensureBoard(penpot, content, namespace, 'slot/master-column', created);
  resize(masterColumn, WIDE.masterWidth, contentHeight);
  fill(masterColumn, '#F8FAFC');
  stroke(masterColumn, '#D1D5DB');
  masterColumn.borderRadius = 12;
  masterColumn.clipContent = false;
  addFlex(masterColumn, 'column', {
    rowGap: 32,
    topPadding: 24,
    rightPadding: 24,
    bottomPadding: 24,
    leftPadding: 24,
  });
  const gridBoard = ensureBoard(penpot, content, namespace, 'slot/review-grid', created);
  resize(gridBoard, WIDE.gridWidth, contentHeight);
  gridBoard.clipContent = false;
  const grid = addGrid(gridBoard, rows);
  const components = {};
  for (const family of spec.families) {
    components[family.id] = ensureComponent(penpot, masterColumn, spec, family, created);
  }
  spec.specimens.forEach((specimen, index) => {
    ensureCell(penpot, gridBoard, grid, spec, specimen, components, index, created);
  });
  const counts = readback(penpot, page, root, spec, components, content, masterColumn, gridBoard);
  const after = await protectedProjection(penpot, spec.pageName);
  invariant(after.sha256 === before.sha256, 'PROTECTED_PROJECTIONS_CHANGED');
  return Object.freeze({
    schema: 'kenigevents.f0-typography-atlas-r2-native-result.v1',
    packageId: spec.packageId,
    status: 'PUBLISHABLE_AFTER_ATLAS_EVIDENCE_GATE',
    created: created.count,
    counts,
    layout: Object.freeze({
      templateId: ATLAS.templateId,
      rootWidth: WIDE.rootWidth,
      rootHeight: counts.rootHeight,
      contentHeight: counts.contentHeight,
      columns: WIDE.columns,
      rows: counts.rows,
      cellHeightFormula: 'clamp(specimen_height + label_block_height + 64, 320, 720)',
      rowCountFormula: 'ceil(instance_count / columns)',
      rootHeightFormula: 'content_start_y + content_height + bottom_padding',
      rootWidthFormula: 'max(header_right, master_right, grid_right) + outer_margin',
      layoutEngines: ['NATIVE_FLEX', 'NATIVE_GRID'],
    }),
    fonts: verifiedFonts,
    protectedProjections: Object.freeze({ before: before.sha256, after: after.sha256, unchanged: true }),
    doesNotRepairEventcardText: true,
    penpotAuthorization: false,
    publishStarted: false,
  });
}

const TYPOGRAPHY_ATLAS_R2_NATIVE_RUNTIME = Object.freeze({
  ATLAS,
  FONT,
  SOURCE,
  WIDE,
  sha256Portable,
  runTypographyAtlasR2Native,
});

globalThis.KenigeventsTypographyAtlasR2NativeRuntime = TYPOGRAPHY_ATLAS_R2_NATIVE_RUNTIME;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TYPOGRAPHY_ATLAS_R2_NATIVE_RUNTIME;
}

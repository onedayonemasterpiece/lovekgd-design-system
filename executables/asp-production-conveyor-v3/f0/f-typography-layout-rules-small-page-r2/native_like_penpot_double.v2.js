'use strict';

let nextId = 1;

function id(prefix) {
  const value = `${prefix}-${nextId}`;
  nextId += 1;
  return value;
}

class NativeNode {
  constructor(type, name = type) {
    this.id = id(type);
    this.type = type;
    this.name = name;
    this.children = [];
    this.parent = null;
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.fills = [];
    this.strokes = [];
    this.opacity = 1;
    this.hidden = false;
    this.visible = true;
    this.pluginData = new Map();
    this.componentRef = null;
  }

  appendChild(child) {
    if (child.parent) child.parent.children = child.parent.children.filter((value) => value.id !== child.id);
    child.parent = this;
    this.children.push(child);
    this.reflow();
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.reflow();
  }

  setSharedPluginData(namespace, key, value) {
    if (typeof value !== 'string') throw new TypeError(`STRICT_STRING_ONLY:${namespace}:${key}`);
    this.pluginData.set(`${namespace}:${key}`, value);
  }

  getSharedPluginData(namespace, key) {
    return this.pluginData.get(`${namespace}:${key}`) || '';
  }

  isComponentCopyInstance() {
    return Boolean(this.componentRef);
  }

  component() {
    return this.componentRef;
  }

  reflow() {
    if (!this.flex) return;
    let cursor = this.flex.dir === 'row' ? this.flex.leftPadding : this.flex.topPadding;
    for (const child of this.children) {
      if (this.flex.dir === 'row') {
        child.x = this.x + cursor;
        child.y = this.y + this.flex.topPadding;
        cursor += child.width + this.flex.columnGap;
      } else {
        child.x = this.x + this.flex.leftPadding;
        child.y = this.y + cursor;
        cursor += child.height + this.flex.rowGap;
      }
      child.reflow();
    }
  }
}

class Board extends NativeNode {
  constructor(name = 'Board') {
    super('board', name);
    this.clipContent = false;
    this.flex = null;
    this.grid = null;
  }

  addFlexLayout() {
    this.flex = {
      dir: 'row',
      rowGap: 0,
      columnGap: 0,
      topPadding: 0,
      rightPadding: 0,
      bottomPadding: 0,
      leftPadding: 0,
      alignItems: 'start',
      justifyContent: 'start',
      horizontalSizing: 'fix',
      verticalSizing: 'fix',
    };
    return this.flex;
  }

  addGridLayout() {
    const board = this;
    this.grid = {
      dir: 'row',
      rows: [],
      columns: [],
      rowGap: 0,
      columnGap: 0,
      alignItems: 'start',
      justifyItems: 'start',
      horizontalSizing: 'fix',
      verticalSizing: 'fix',
      addRow(type, value) {
        this.rows.push({ type, value });
      },
      addColumn(type, value) {
        this.columns.push({ type, value });
      },
      appendChild(child, row, column) {
        board.appendChild(child);
        child.layoutCell = { row, column };
        const columnWidth = board.grid.columns[column - 1]?.value || 0;
        const rowHeight = board.grid.rows[row - 1]?.value || 0;
        child.x = board.x + (column - 1) * (columnWidth + board.grid.columnGap);
        child.y = board.y + (row - 1) * (rowHeight + board.grid.rowGap);
      },
    };
    return this.grid;
  }
}

class Text extends NativeNode {
  constructor(characters) {
    super('text', 'Text');
    this.characters = characters;
    this.fontFamily = 'DejaVu Sans';
    this.fontSize = '16';
    this.fontWeight = '400';
    this.lineHeight = '1.6';
  }
}

class Rectangle extends NativeNode {
  constructor() {
    super('rectangle', 'Rectangle');
    this.borderRadius = 0;
  }
}

function cloneNode(source) {
  let target;
  if (source.type === 'board') target = new Board(source.name);
  else if (source.type === 'text') target = new Text(source.characters);
  else if (source.type === 'rectangle') target = new Rectangle();
  else throw new Error(`UNSUPPORTED_CLONE:${source.type}`);
  target.name = source.name;
  target.width = source.width;
  target.height = source.height;
  target.x = source.x;
  target.y = source.y;
  target.fills = JSON.parse(JSON.stringify(source.fills));
  target.strokes = JSON.parse(JSON.stringify(source.strokes));
  target.opacity = source.opacity;
  target.hidden = source.hidden;
  target.visible = source.visible;
  target.borderRadius = source.borderRadius;
  target.clipContent = source.clipContent;
  target.fontFamily = source.fontFamily;
  target.fontSize = source.fontSize;
  target.fontWeight = source.fontWeight;
  target.lineHeight = source.lineHeight;
  target.pluginData = new Map(source.pluginData);
  if (source.flex) target.flex = { ...source.flex };
  if (source.grid) target.addGridLayout();
  for (const child of source.children) target.appendChild(cloneNode(child));
  return target;
}

class Component {
  constructor(main) {
    this.id = id('component');
    this.name = main.name;
    this.path = '';
    this.main = main;
  }

  mainInstance() {
    return this.main;
  }

  instance() {
    const copy = cloneNode(this.main);
    copy.componentRef = this;
    return copy;
  }
}

class LocalLibrary {
  constructor() {
    this.components = [];
  }

  createComponent(nodes) {
    if (!Array.isArray(nodes) || nodes.length !== 1) throw new Error('ONE_MAIN_REQUIRED');
    const component = new Component(nodes[0]);
    this.components.push(component);
    return component;
  }
}

class Page {
  constructor(name = 'Page') {
    this.id = id('page');
    this.name = name;
    this.root = new Board(`${name} / root`);
    this.pluginData = new Map();
  }

  setSharedPluginData(namespace, key, value) {
    if (typeof value !== 'string') throw new TypeError(`STRICT_STRING_ONLY:${namespace}:${key}`);
    this.pluginData.set(`${namespace}:${key}`, value);
  }

  getSharedPluginData(namespace, key) {
    return this.pluginData.get(`${namespace}:${key}`) || '';
  }
}

class CurrentFile {
  constructor() {
    this.pages = [];
  }

  validate() {
    return [];
  }
}

function seedHeader(penpot) {
  const page = penpot.createPage();
  page.name = 'Atlas R2 · Documentation components';
  const master = penpot.createBoard();
  master.name = 'ATLAS_PAGE_HEADER_V2';
  master.resize(2048, 128);
  master.setSharedPluginData(
    'kenigevents-atlas-documentation-v2',
    'stable-id',
    'component/ATLAS_PAGE_HEADER_V2',
  );
  const fieldIds = [
    'atlas.header.top.section',
    'atlas.header.top.page-title',
    'atlas.header.top.lifecycle-status',
    'atlas.header.meta.owner',
    'atlas.header.meta.package-id',
    'atlas.header.meta.source-or-fixture',
    'atlas.header.meta.viewport-and-state-coverage',
    'atlas.header.meta.v0-status',
    'atlas.header.meta.last-reviewed-revision',
  ];
  for (const stableId of fieldIds) {
    const text = penpot.createText('—');
    text.setSharedPluginData('kenigevents-atlas-documentation-v2', 'stable-id', stableId);
    master.appendChild(text);
  }
  page.root.appendChild(master);
  const component = penpot.library.local.createComponent([master]);
  component.name = 'ATLAS_PAGE_HEADER_V2';
  component.path = 'Atlas R2 / Documentation';
}

function createNativeLikePenpot() {
  nextId = 1;
  const currentFile = new CurrentFile();
  const penpot = {
    currentFile,
    library: { local: new LocalLibrary() },
    createBoard: () => new Board(),
    createText: (characters) => new Text(characters),
    createRectangle: () => new Rectangle(),
    createPage: () => {
      const page = new Page();
      currentFile.pages.push(page);
      return page;
    },
  };
  seedHeader(penpot);
  return penpot;
}

function allNodes(root) {
  const values = [];
  const visit = (node) => {
    values.push(node);
    for (const child of node.children || []) visit(child);
  };
  visit(root);
  return values;
}

module.exports = Object.freeze({ allNodes, createNativeLikePenpot });

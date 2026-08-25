/** Native, bounded Wave 1 Search/navigation candidate for page 64.01. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = '8e7accff-5c78-8007-8008-89bf021cf5fd';
const DESKTOP_HEADER = 'a21f5e36-5d76-8065-8008-86ae4bdf9963';
const MOBILE_BASELINE = 'a21f5e36-5d76-8065-8008-86aec0a54bb5';
const MOBILE_SEARCH_CURRENT = 'e80bde32-fa47-80c8-8008-77a9e1c62267';
const SEARCH_ICON = 'a21f5e36-5d76-8065-8008-86f03a037cf6';
const PATH = 'Unified v1 / Wave 1 / Navigation';

const componentById = (penpot, id) => penpot.library.local.components.find(component => component.id === id);
const componentByIdentity = (penpot, path, name) => penpot.library.local.components.find(component => component.path === path && component.name === name);
function place(penpotUtils, shape, x, y, width, height) {
  if (shape.layoutChild) shape.layoutChild.absolute = true;
  shape.resize(width, height);
  penpotUtils.setParentXY(shape, x, y);
  return shape;
}
function text(penpot, penpotUtils, parent, name, value, x, y, width, height, size, weight, color, align = 'left') {
  const shape = penpot.createText(value);
  shape.name = name;
  shape.fontFamily = 'Inter';
  shape.fontStyle = 'normal';
  shape.fontSize = String(size);
  shape.fontWeight = String(weight);
  shape.lineHeight = '1.2';
  shape.letterSpacing = '0';
  shape.align = align;
  shape.fills = [{ fillColor: color, fillOpacity: 1 }];
  parent.appendChild(shape);
  return place(penpotUtils, shape, x, y, width, height);
}
function board(penpot, penpotUtils, name, x, y, width, height) {
  const shape = penpot.createBoard();
  shape.name = name;
  shape.fills = [{ fillColor: '#fffaf2', fillOpacity: 1 }];
  shape.strokes = [{ strokeColor: '#e5d8c8', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
  shape.clipContent = true;
  return place(penpotUtils, shape, x, y, width, height);
}
function applySearchState(penpotUtils, root) {
  const labels = { 'Афиша': 'afisha', 'Даты': 'dates', 'Поиск': 'search', 'Для меня': 'personal' };
  const stack = [root];
  while (stack.length) {
    const shape = stack.pop();
    if (shape.name.startsWith('Mobile bottom active icon pill / active=')) {
      // The legacy slots are nested under different tab parents, so changing
      // their visibility can place the Search pill outside the 390px root.
      // Keep all source pills hidden in this candidate; the retained current
      // destination is expressed by the linked Search label/icon emphasis.
      shape.hidden = true;
    }
    if (shape.type === 'text' && labels[shape.characters]) {
      const active = labels[shape.characters] === 'search';
      shape.fontWeight = active ? '900' : '700';
      shape.fills = [{ fillColor: active ? '#221a14' : '#766b62', fillOpacity: 1 }];
    }
    if (shape.children) stack.push(...shape.children);
  }
  for (const tab of Array.from(root.children ?? []).filter(shape => shape.type === 'board')) {
    const label = Array.from(tab.children ?? []).find(shape => shape.type === 'text' && labels[shape.characters]);
    if (!label) continue;
    const color = labels[label.characters] === 'search' ? '#261d18' : '#766b62';
    const iconStack = [...tab.children];
    while (iconStack.length) {
      const shape = iconStack.pop();
      if (shape.type === 'path' && shape.fills?.length) shape.fills = shape.fills.map(fill => ({ ...fill, fillColor: color, fillOpacity: fill.fillOpacity ?? 1 }));
      if (shape.children) iconStack.push(...shape.children);
    }
  }
}

function materializeSearchNavigation(penpot, penpotUtils) {
  if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) throw new Error('open settled page 64.01 first');
  const required = [DESKTOP_HEADER, MOBILE_BASELINE, MOBILE_SEARCH_CURRENT, SEARCH_ICON].map(id => componentById(penpot, id));
  if (required.some(item => !item)) throw new Error('missing certified dependency');

  const searchName = 'Desktop search entry · candidate-v1';
  let search = componentByIdentity(penpot, PATH, searchName);
  let searchMain;
  if (!search) {
    searchMain = board(penpot, penpotUtils, `${PATH} / ${searchName}`, 1340, 320, 112, 44);
    searchMain.borderRadius = 22;
    searchMain.strokes = [{ strokeColor: '#d7c7b7', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
    const icon = required[3].instance();
    icon.name = 'linked Icon / UI / search-thin';
    searchMain.appendChild(icon);
    place(penpotUtils, icon, 14, 10, 24, 24);
    text(penpot, penpotUtils, searchMain, 'Search entry / label', 'Поиск', 44, 12, 52, 20, 14, 800, '#221a14');
    search = penpot.library.local.createComponent([searchMain]);
  } else searchMain = search.mainInstance();

  const headerName = 'Desktop header + search entry · candidate-v1';
  let header = componentByIdentity(penpot, PATH, headerName);
  let headerMain;
  if (!header) {
    headerMain = board(penpot, penpotUtils, `${PATH} / ${headerName}`, 0, 160, 1280, 120);
    headerMain.strokes = [];
    const base = required[0].instance();
    base.name = 'linked Shell v1 / Desktop / Desktop header';
    headerMain.appendChild(base);
    place(penpotUtils, base, 0, 31, 1280, 57);
    const entry = search.instance();
    entry.name = 'linked Navigation / Desktop search entry / candidate-v1';
    headerMain.appendChild(entry);
    place(penpotUtils, entry, 296, 37, 112, 44);
    header = penpot.library.local.createComponent([headerMain]);
  } else headerMain = header.mainInstance();

  const mobileName = 'Mobile bottom navigation · current=search · candidate-v1';
  let mobile = componentByIdentity(penpot, PATH, mobileName);
  let mobileMain;
  if (!mobile) {
    mobileMain = board(penpot, penpotUtils, `${PATH} / ${mobileName}`, 1340, 320, 390, 64);
    mobileMain.strokes = [];
    const base = required[1].instance();
    base.name = 'linked Shell v1 / Mobile / Mobile bottom navigation / current=search';
    mobileMain.appendChild(base);
    place(penpotUtils, base, 0, 0, 390, 64);
    applySearchState(penpotUtils, base);
    mobile = penpot.library.local.createComponent([mobileMain]);
  } else {
    mobileMain = mobile.mainInstance();
    const base = Array.from(mobileMain.children ?? []).find(shape => shape.name.includes('Mobile bottom navigation'));
    if (!base) throw new Error('mobile candidate source copy missing');
    applySearchState(penpotUtils, base);
  }

  const ensureCopyBoard = (name, x, y, width, height, component, childName, childX, childY, childWidth, childHeight) => {
    let root = Array.from(penpot.currentPage.root.children).find(shape => shape.name === name);
    if (root) return root;
    root = board(penpot, penpotUtils, name, x, y, width, height);
    root.strokes = [];
    const copy = component.instance();
    copy.name = childName;
    root.appendChild(copy);
    place(penpotUtils, copy, childX, childY, childWidth, childHeight);
    return root;
  };

  const desktopBaseline = ensureCopyBoard('Wave 1 / Search navigation / Desktop / baseline region', 0, 0, 1280, 120, required[0], 'linked baseline Desktop header', 0, 31, 1280, 57);
  const mobileBaseline = ensureCopyBoard('Wave 1 / Search navigation / Mobile / baseline region', 1340, 0, 390, 120, required[1], 'linked baseline Mobile bottom navigation', 0, 28, 390, 64);
  const mobileCandidateName = 'Wave 1 / Search navigation / Mobile / candidate region · keep current Search destination';
  let mobileCandidate = Array.from(penpot.currentPage.root.children).find(shape => shape.name === mobileCandidateName);
  if (!mobileCandidate) mobileCandidate = board(penpot, penpotUtils, mobileCandidateName, 1340, 160, 390, 120);
  mobileCandidate.strokes = [];
  const existingMobile = Array.from(mobileCandidate.children ?? [])[0];
  if (existingMobile?.component?.()?.id !== mobile.id) {
    for (const child of Array.from(mobileCandidate.children ?? [])) child.remove();
    const copy = mobile.instance();
    copy.name = 'linked Navigation / Mobile bottom navigation / current=search · candidate-v1';
    mobileCandidate.appendChild(copy);
    place(penpotUtils, copy, 0, 28, 390, 64);
  } else {
    existingMobile.resetOverrides();
    place(penpotUtils, existingMobile, 0, 28, 390, 64);
  }

  return {
    page_id: PAGE_ID,
    pattern_id: 'pattern.desktop-search-navigation.candidate-v1',
    components: { search_entry: search.id, desktop_candidate: header.id, mobile_candidate: mobile.id, mobile_source_reused: required[1].id },
    boards: { desktop_baseline: desktopBaseline.id, desktop_candidate: headerMain.id, mobile_baseline: mobileBaseline.id, mobile_candidate: mobileCandidate.id },
    linked_dependencies: [DESKTOP_HEADER, MOBILE_BASELINE, MOBILE_SEARCH_CURRENT, SEARCH_ICON],
    validate: penpot.currentFile.validate()
  };
}

if (typeof module !== 'undefined') module.exports = { materializeSearchNavigation };

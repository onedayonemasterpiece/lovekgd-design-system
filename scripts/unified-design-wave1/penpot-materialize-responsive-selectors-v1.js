/** Native, bounded Wave 1 responsive selector candidate for page 64.02. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = '8e7accff-5c78-8007-8008-89bf7fa6b295';
const LISTING_CONTROLS = 'a21f5e36-5d76-8065-8008-86ad4746c01b';
const FILTER_CONTROL = 'a21f5e36-5d76-8065-8008-86ad45c542f0';
const PATH = 'Unified v1 / Wave 1 / Responsive selector';

const componentById = (penpot, id) => penpot.library.local.components.find(component => component.id === id);
const componentByIdentity = (penpot, path, name) => penpot.library.local.components.find(component => component.path === path && component.name === name);
function place(penpotUtils, shape, x, y, width, height) {
  if (shape.layoutChild) shape.layoutChild.absolute = true;
  shape.resize(width, height);
  penpotUtils.setParentXY(shape, x, y);
  return shape;
}
function board(penpot, penpotUtils, name, x, y, width, height, stroke = true) {
  const shape = penpot.createBoard();
  shape.name = name;
  shape.fills = [{ fillColor: '#fffaf2', fillOpacity: 1 }];
  shape.strokes = stroke ? [{ strokeColor: '#e5d8c8', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }] : [];
  shape.clipContent = true;
  return place(penpotUtils, shape, x, y, width, height);
}
function text(penpot, penpotUtils, parent, name, value, x, y, width, height, size, weight, color) {
  const shape = penpot.createText(value);
  shape.name = name;
  shape.fontFamily = 'Inter';
  shape.fontStyle = 'normal';
  shape.fontSize = String(size);
  shape.fontWeight = String(weight);
  shape.lineHeight = '1.2';
  shape.letterSpacing = '0';
  shape.fills = [{ fillColor: color, fillOpacity: 1 }];
  parent.appendChild(shape);
  return place(penpotUtils, shape, x, y, width, height);
}
function overrideFilter(copy, label) {
  const labels = [];
  const stack = [copy];
  while (stack.length) {
    const shape = stack.pop();
    if (shape.type === 'text') labels.push(shape);
    if (shape.children) stack.push(...shape.children);
  }
  labels.sort((a, b) => a.x - b.x);
  if (labels.length < 2) throw new Error('Filter control anatomy drift');
  labels[0].characters = label;
  labels[1].characters = '⌄';
}
function addFilter(penpotUtils, parent, component, label, x, y, width) {
  const copy = component.instance();
  copy.name = `linked Listing / Controls / Filter control / ${label}`;
  parent.appendChild(copy);
  place(penpotUtils, copy, x, y, width, 44);
  overrideFilter(copy, label);
  return copy;
}

function materializeResponsiveSelectors(penpot, penpotUtils) {
  if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) throw new Error('open settled page 64.02 first');
  const baselineComponent = componentById(penpot, LISTING_CONTROLS);
  const filterComponent = componentById(penpot, FILTER_CONTROL);
  if (!baselineComponent || !filterComponent) throw new Error('missing certified Listing controls dependency');

  const desktopName = 'Context selector · viewport=desktop · candidate-v1';
  let desktop = componentByIdentity(penpot, PATH, desktopName);
  let desktopMain;
  if (!desktop) {
    desktopMain = board(penpot, penpotUtils, `${PATH} / ${desktopName}`, 0, 180, 1180, 88, true);
    desktopMain.borderRadius = 22;
    text(penpot, penpotUtils, desktopMain, 'Context selector / eyebrow', 'ПОКАЗЫВАЕМ', 20, 16, 120, 14, 11, 800, '#a6401d');
    addFilter(penpotUtils, desktopMain, filterComponent, 'Завтра', 144, 22, 174);
    addFilter(penpotUtils, desktopMain, filterComponent, 'Вся область', 330, 22, 208);
    addFilter(penpotUtils, desktopMain, filterComponent, 'По времени', 550, 22, 196);
    text(penpot, penpotUtils, desktopMain, 'Context selector / result count', '3 события', 1010, 35, 130, 18, 13, 700, '#766b62');
    desktop = penpot.library.local.createComponent([desktopMain]);
  } else desktopMain = desktop.mainInstance();

  const mobileName = 'Context selector · viewport=mobile · candidate-v1';
  let mobile = componentByIdentity(penpot, PATH, mobileName);
  let mobileMain;
  if (!mobile) {
    mobileMain = board(penpot, penpotUtils, `${PATH} / ${mobileName}`, 1240, 180, 390, 112, true);
    mobileMain.borderRadius = 22;
    text(penpot, penpotUtils, mobileMain, 'Context selector / retained date axis', 'Дата — в ленте ниже', 14, 13, 200, 15, 11, 800, '#a6401d');
    addFilter(penpotUtils, mobileMain, filterComponent, 'Вся область', 14, 44, 176);
    addFilter(penpotUtils, mobileMain, filterComponent, 'По времени', 200, 44, 176);
    mobile = penpot.library.local.createComponent([mobileMain]);
  } else mobileMain = mobile.mainInstance();

  let desktopBaseline = Array.from(penpot.currentPage.root.children).find(shape => shape.name === 'Wave 1 / Responsive selector / Desktop / baseline region');
  if (!desktopBaseline) {
    desktopBaseline = board(penpot, penpotUtils, 'Wave 1 / Responsive selector / Desktop / baseline region', 0, 0, 1180, 120, false);
    const copy = baselineComponent.instance();
    copy.name = 'linked baseline Listing / Controls / Listing controls';
    desktopBaseline.appendChild(copy);
    place(penpotUtils, copy, 0, 24, 1180, 72);
  }

  let mobileBaseline = Array.from(penpot.currentPage.root.children).find(shape => shape.name === 'Wave 1 / Responsive selector / Mobile / baseline region');
  if (!mobileBaseline) {
    mobileBaseline = board(penpot, penpotUtils, 'Wave 1 / Responsive selector / Mobile / baseline region', 1240, 0, 390, 120, false);
    text(penpot, penpotUtils, mobileBaseline, 'Baseline mobile ordering', 'По времени', 14, 48, 110, 20, 14, 800, '#221a14');
    addFilter(penpotUtils, mobileBaseline, filterComponent, 'Вся область', 230, 38, 146);
  }

  return {
    page_id: PAGE_ID,
    pattern_id: 'pattern.responsive-context-selector.candidate-v1',
    components: { desktop_candidate: desktop.id, mobile_candidate: mobile.id },
    boards: { desktop_baseline: desktopBaseline.id, desktop_candidate: desktopMain.id, mobile_baseline: mobileBaseline.id, mobile_candidate: mobileMain.id },
    linked_dependencies: [LISTING_CONTROLS, FILTER_CONTROL],
    validate: penpot.currentFile.validate()
  };
}

if (typeof module !== 'undefined') module.exports = { materializeResponsiveSelectors };

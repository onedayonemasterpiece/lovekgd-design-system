/** Source-proven `/vystavki/` mobile personalization master repair. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880cc5490f78';
const MAIN_ID = 'd87e18f1-dcb4-80a6-8008-88631940af04';
const OWNER_ID = 'd87e18f1-dcb4-80a6-8008-886400b72209';
const IDS = {
  rail: 'd87e18f1-dcb4-80a6-8008-88631955aa2c',
  selected: 'd87e18f1-dcb4-80a6-8008-88631976e292',
  forMe: 'd87e18f1-dcb4-80a6-8008-886319a90b2c',
  all: 'd87e18f1-dcb4-80a6-8008-886319e90742',
  topicRects: [
    'd87e18f1-dcb4-80a6-8008-88631a19f252',
    'd87e18f1-dcb4-80a6-8008-88631a62268d',
    'd87e18f1-dcb4-80a6-8008-88631aa7c27d',
    'd87e18f1-dcb4-80a6-8008-88631aed850b'
  ],
  topicLabels: [
    'd87e18f1-dcb4-80a6-8008-88631a344385',
    'd87e18f1-dcb4-80a6-8008-88631a7f19ba',
    'd87e18f1-dcb4-80a6-8008-88631abcb979',
    'd87e18f1-dcb4-80a6-8008-88631aff67f0'
  ]
};

function assertContext(penpot) {
  if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) throw new Error('open settled 63.10 first');
}
function place(penpotUtils, shape, x, y, w, h) {
  if (shape.layoutChild) shape.layoutChild.absolute = true;
  shape.resize(w, h);
  penpotUtils.setParentXY(shape, x, y);
  return shape;
}
function textStyle(shape, spec, penpotUtils) {
  shape.characters = spec.characters;
  shape.fontFamily = 'Inter';
  shape.fontStyle = 'normal';
  shape.fontSize = String(spec.size);
  shape.fontWeight = String(spec.weight);
  shape.lineHeight = String(spec.lineHeight);
  shape.letterSpacing = '0';
  shape.align = spec.align || 'left';
  shape.fills = [{ fillColor: spec.color, fillOpacity: 1 }];
  place(penpotUtils, shape, spec.x, spec.y, spec.w, spec.h);
  return shape;
}
function ensureText(penpot, penpotUtils, parent, name, spec) {
  let shape = parent.children.find(child => child.name === name);
  if (!shape) {
    shape = penpot.createText(spec.characters);
    shape.name = name;
    parent.appendChild(shape);
  }
  return textStyle(shape, spec, penpotUtils);
}

function applyExhibitionsPersonalizationGeometry(penpot, penpotUtils) {
  assertContext(penpot);
  const main = penpot.currentPage.getShapeById(MAIN_ID);
  const owner = penpot.currentPage.getShapeById(OWNER_ID);
  if (!main?.isComponentMainInstance() || !owner?.isComponentCopyInstance()) throw new Error('personalization master/owner missing');
  main.resize(390, 186.25);
  main.clipContent = true;
  main.fills = [{ fillColor: '#0d0f10', fillOpacity: 0.96 }];
  place(penpotUtils, penpot.currentPage.getShapeById(IDS.rail), 9.59375, 9.59375, 370.8125, 52);
  const rail = penpot.currentPage.getShapeById(IDS.rail);
  rail.fills = [{ fillColor: '#08090a', fillOpacity: 1 }];
  rail.strokes = [{ strokeColor: '#2d3134', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
  rail.borderRadius = 7;
  const selected = place(penpotUtils, penpot.currentPage.getShapeById(IDS.selected), 13.59375, 13.59375, 181.40625, 44);
  selected.fills = [{ fillColor: '#17191c', fillOpacity: 1 }];
  selected.strokes = [{ strokeColor: '#3a3f43', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
  selected.borderRadius = 4;
  const topicGeometry = [
    [9.59375, 131.65625, 96.28125],
    [112.59375, 131.65625, 102.640625],
    [221.953125, 131.65625, 88.34375],
    [317.015625, 131.65625, 120.3125]
  ];
  IDS.topicRects.forEach((id, index) => {
    const shape = place(penpotUtils, penpot.currentPage.getShapeById(id), ...topicGeometry[index], 44);
    shape.borderRadius = 999;
    shape.fills = index === 0 ? [{ fillColor: '#24272a', fillOpacity: 1 }] : [];
    shape.strokes = [{ strokeColor: index === 0 ? '#697078' : '#2d3134', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
  });
  let divider = main.children.find(shape => shape.name === 'Personalization / bottom divider');
  if (!divider) { divider = penpot.createRectangle(); divider.name = 'Personalization / bottom divider'; main.appendChild(divider); }
  divider.fills = [{ fillColor: '#2d3134', fillOpacity: 1 }];
  place(penpotUtils, divider, 0, 185.25, 390, 1);
  // Preserve linked size inheritance; only the owner composition position is
  // assembly-specific and may be set here.
  if (owner.layoutChild) owner.layoutChild.absolute = true;
  penpotUtils.setParentXY(owner, 0, 456.84375);
  return { main: { id: main.id, width: main.width, height: main.height }, owner: { id: owner.id, x: owner.x - owner.parent.x, y: owner.y - owner.parent.y, width: owner.width, height: owner.height } };
}

function applyExhibitionsPersonalizationCopy(penpot, penpotUtils) {
  assertContext(penpot);
  const main = penpot.currentPage.getShapeById(MAIN_ID);
  if (!main?.isComponentMainInstance()) throw new Error('personalization master missing');
  textStyle(penpot.currentPage.getShapeById(IDS.forMe), { characters: 'Для меня', size: 16, weight: 800, lineHeight: 1.45, color: '#f4f4f2', align: 'center', x: 13.59375, y: 24, w: 181.40625, h: 23.2 }, penpotUtils);
  textStyle(penpot.currentPage.getShapeById(IDS.all), { characters: 'Все', size: 16, weight: 800, lineHeight: 1.45, color: '#a8adb2', align: 'center', x: 195, y: 24, w: 181.40625, h: 23.2 }, penpotUtils);
  ensureText(penpot, penpotUtils, main, 'Personal note / emphasis', { characters: 'Начните с 2–3 оценок.', size: 13.12, weight: 800, lineHeight: 1.45, color: '#f4f4f2', x: 12.79375, y: 77.59375, w: 158, h: 19.024 });
  ensureText(penpot, penpotUtils, main, 'Personal note / line 1', { characters: 'Пока профиль пуст, «Для', size: 13.12, weight: 400, lineHeight: 1.45, color: '#a8adb2', x: 174, y: 77.59375, w: 190, h: 19.024 });
  ensureText(penpot, penpotUtils, main, 'Personal note / line 2', { characters: 'меня» показывает новое и общее главное.', size: 13.12, weight: 400, lineHeight: 1.45, color: '#a8adb2', x: 12.79375, y: 96.61775, w: 355, h: 19.024 });
  const labels = ['Все темы', 'Искусство', 'История', 'Фотография'];
  const xs = [9.59375, 112.59375, 221.953125, 317.015625];
  const widths = [96.28125, 102.640625, 88.34375, 120.3125];
  IDS.topicLabels.forEach((id, index) => textStyle(penpot.currentPage.getShapeById(id), { characters: labels[index], size: 13.12, weight: 700, lineHeight: 1.45, color: index === 0 ? '#f4f4f2' : '#a8adb2', align: 'center', x: xs[index], y: 144.144, w: widths[index], h: 19.024 }, penpotUtils));
  return { main: main.id, texts: 9 };
}

if (typeof module !== 'undefined') module.exports = { applyExhibitionsPersonalizationGeometry, applyExhibitionsPersonalizationCopy };

/**
 * Source-locked Popular mobile fixture adapters.
 *
 * The owner archetype on 63.04 previously reused Weekend fixture rows
 * (7906/7807), so it could never reproduce the Astro Popular corpus.  This
 * helper materializes small native fixture components on 40.3a.  Every row
 * reuses the canonical Heart, rail-arrow and source-media components; only
 * fixture copy and source-proven geometry live in the adapter.
 *
 * Crash safety: create one row or group per MCP call, return immediately,
 * wait outside the call and read it back before continuing.  Never retry an
 * unknown write after a 504; first look up the component by exact path/name.
 */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const RESOURCE_PAGE_ID = '8e7accff-5c78-8007-8008-89765b9b2207';
const OWNER_PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880937f54501';
const OWNER_BOARD_ID = 'd87e18f1-dcb4-80a6-8008-8809ea570ea8';
const OWNER_FAST_ID = 'd87e18f1-dcb4-80a6-8008-8857bdd33321';
const OWNER_DISCUSS_ID = 'd87e18f1-dcb4-80a6-8008-8857c1e7bfab';
const OWNER_NAV_ID = 'd87e18f1-dcb4-80a6-8008-8857c4820910';

const HEART_ID = 'eca15719-f452-809c-8008-820ab4eb966a';
const ARROW_ID = 'fd45a474-7b74-809d-8008-8184c2fca99c';
const TREND_ID = 'd87e18f1-dcb4-80a6-8008-87dd7de32fc8';

const ROWS = {
  '5459': { date: '5 июня–30\nавгуста', time: null, title: 'Предметные стра-\nсти. Натюрморт …', place: 'Калининград · Музей И…', count: '164', media: '8e7accff-5c78-8007-8008-89681bfe7729', mediaW: 99, mediaH: 112, contentW: 79.1875, contentH: 112 },
  '6870': { date: '24, 26\nиюл', time: '17:00', title: 'Музыкальный фе-\nстиваль КВН', place: 'Светлогорск · Янтарь х…', count: '109', media: '8e7accff-5c78-8007-8008-89652a132158', mediaW: 112, mediaH: 112, contentW: 112, contentH: 112 },
  '6941': { date: '25 июл', time: '17:00', title: 'Голосящий КиВиН\n2026 и Летний ку…', place: 'Светлогорск · Янтарь х…', count: '106', media: '8e7accff-5c78-8007-8008-89652b706b32', mediaW: 112, mediaH: 112, contentW: 112, contentH: 112 },
  '6986': { date: '23 июл', time: '19:00', title: '«Прусская синь»:\nботанический…', place: 'Калининград · Закхайм…', count: '17', media: '8e7accff-5c78-8007-8008-89657df23f73', mediaW: 184, mediaH: 112, contentW: 183.7949, contentH: 112 },
  '5374': { date: '24 июл', time: '21:00', title: 'Трибьют Linkin\nPark', place: 'пос. Романово · Поселе…', count: '141', media: '8e7accff-5c78-8007-8008-8966065eaa77', mediaW: 140, mediaH: 112, contentW: 140, contentH: 93.5156 },
  '7015': { date: '24 июл', time: '20:00', title: 'Рыцарский Турнир\nАнны Марии', place: 'Гурьевск · Замок Нойха…', count: '48', media: '8e7accff-5c78-8007-8008-8966a7aa753a', mediaW: 90, mediaH: 112, contentW: 89.6875, contentH: 112 },
  '6710': { date: '25 июл', time: '11:00', title: 'Слёт бабок Ёжек', place: 'Романово · Сказочное Х…', count: '52', media: '8e7accff-5c78-8007-8008-8966aad72d90', mediaW: 168, mediaH: 112, contentW: 168, contentH: 111.5625 },
  '6936': { date: '1 авг', time: '20:00', title: 'Концерт Дениса\nБоячука', place: 'Калининград · Бар Басти…', count: '45', media: '8e7accff-5c78-8007-8008-8966acb9fefc', mediaW: 93, mediaH: 112, contentW: 74.5938, contentH: 112 },
  '6652': { date: '2 авг', time: '18:00', title: 'Руслан и Людмила.\nНа стыке времён', place: 'Гвардейск · Замок Тапи…', count: '107', media: '8e7accff-5c78-8007-8008-8966ae997b6e', mediaW: 140, mediaH: 112, contentW: 74.5938, contentH: 112 },
  '4211': { date: '8–9 августа', time: null, title: 'Фестиваль «МОРЕ\nВНУТРИ»', place: 'Светлогорск · Променад', count: '84', media: '8e7accff-5c78-8007-8008-8966b0a2ad79', mediaW: 112, mediaH: 112, contentW: 112, contentH: 112 }
};

const GROUPS = {
  fast_growth: { title: 'Быстро набирают\nпопулярность', subtitle: 'Сильнее всего растут реакции', rows: ['5459', '6870', '6941', '6986', '5374'] },
  discussed: { title: 'Активно обсуждают', subtitle: 'На них активнее реагируют', rows: ['7015', '6710', '6936', '6652', '4211'] }
};

const componentById = (penpot, id) => penpot.library.local.components.find(item => item.id === id);
const componentByIdentity = (penpot, path, name) => penpot.library.local.components.find(item => item.path === path && item.name === name);

function assertContext(penpot, pageId) {
  if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== pageId) {
    throw new Error(`open settled Penpot page ${pageId} before Popular mobile materialization`);
  }
}

function place(penpotUtils, shape, x, y, w, h) {
  if (w != null && h != null) shape.resize(w, h);
  penpotUtils.setParentXY(shape, x, y);
  return shape;
}

function text(penpot, penpotUtils, parent, name, characters, x, y, w, h, size, weight, lineHeight, color, align = 'left') {
  const shape = penpot.createText(characters);
  shape.name = name;
  shape.fontFamily = 'Inter';
  shape.fontStyle = 'normal';
  shape.fontSize = String(size);
  shape.fontWeight = String(weight);
  shape.lineHeight = String(lineHeight);
  shape.letterSpacing = '0';
  shape.align = align;
  shape.fills = [{ fillColor: color, fillOpacity: 1 }];
  parent.appendChild(shape);
  return place(penpotUtils, shape, x, y, w, h);
}

function createInlineProof(penpot, penpotUtils, count, x, y) {
  const path = 'Popular / Mobile row / Social proof / Like / rail-inline';
  const name = `count=${count}`;
  let component = componentByIdentity(penpot, path, name);
  if (component) return component;
  const width = count.length === 3 ? 36.921875 : 29.625;
  const board = penpot.createBoard();
  board.name = `${path} / ${name}`;
  board.fills = [];
  board.clipContent = false;
  place(penpotUtils, board, x, y, width, 12);
  const heart = componentById(penpot, HEART_ID)?.instance();
  if (!heart) throw new Error(`missing Heart component: ${HEART_ID}`);
  heart.name = 'linked Icon / UI / Heart / rail-inline';
  board.appendChild(heart);
  place(penpotUtils, heart, 0, 0, 12, 12);
  text(penpot, penpotUtils, board, 'Content / Count / source-locked', count, 15, 0, width - 15, 12, 10.5, 800, 1.14, '#756b64');
  component = penpot.library.local.createComponent([board]);
  return component;
}

function ensureProofs(penpot, penpotUtils, counts) {
  assertContext(penpot, RESOURCE_PAGE_ID);
  return counts.map((count, index) => {
    const component = createInlineProof(penpot, penpotUtils, String(count), 20 + (index % 5) * 90, 20 + Math.floor(index / 5) * 40);
    return { id: component.id, path: component.path, name: component.name };
  });
}

function createPopularMobileRow(penpot, penpotUtils, eventId, slot = 0) {
  assertContext(penpot, RESOURCE_PAGE_ID);
  const spec = ROWS[eventId];
  if (!spec) throw new Error(`unknown Popular mobile fixture: ${eventId}`);
  const path = 'Popular / Mobile row viewport / Fixture';
  const name = `event.real.${eventId} · 390 · current-v1`;
  const existing = componentByIdentity(penpot, path, name);
  if (existing) return { existing: true, id: existing.id, path, name };

  const row = penpot.createBoard();
  row.name = `${path} / ${name}`;
  row.fills = [];
  row.clipContent = true;
  place(penpotUtils, row, 20 + (slot % 2) * 430, 120 + Math.floor(slot / 2) * 132, 390, 112);

  const summary = penpot.createBoard();
  summary.name = `Event summary / event.real.${eventId} / source exact`;
  summary.fills = [];
  summary.clipContent = true;
  row.appendChild(summary);
  place(penpotUtils, summary, 12, 0, 296, 112);

  const surface = penpot.createRectangle();
  surface.name = 'Surface / event-summary';
  surface.fills = [{ fillColor: '#fffdf8', fillOpacity: 1 }];
  surface.strokes = [{ strokeColor: '#793014', strokeOpacity: 0.13, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
  surface.borderRadiusTopLeft = 14;
  surface.borderRadiusTopRight = 10;
  surface.borderRadiusBottomRight = 10;
  surface.borderRadiusBottomLeft = 14;
  summary.appendChild(surface);
  place(penpotUtils, surface, 0, 0, 296, 112);

  const timeSurface = penpot.createRectangle();
  timeSurface.name = 'Time / surface';
  timeSurface.fills = [{ fillColor: '#efe3d3', fillOpacity: 1 }];
  timeSurface.borderRadius = 8;
  summary.appendChild(timeSurface);
  place(penpotUtils, timeSurface, 13, 15, 96, 82);

  const singleDate = !spec.date.includes('\n');
  const noTime = spec.time == null;
  text(penpot, penpotUtils, summary, 'Time / date value', spec.date, 13, noTime ? 39 : (singleDate ? 41 : 32.5), 96, singleDate ? 17 : 34, 16, 900, 1.0625, '#793014', 'center');
  if (spec.time) text(penpot, penpotUtils, summary, 'Time / time value', spec.time, 13, 69.5, 96, 10, 9.5, 800, 1.05, '#793014', 'center');
  text(penpot, penpotUtils, summary, 'Content / Event title / source-locked', spec.title, 123, 24.5, 162, 34, 15, 900, 1.133, '#221a14');
  text(penpot, penpotUtils, summary, 'Content / Event place / source-locked', spec.place, 123, 60.5, 162, 12, 10.5, 700, 1.14, '#6d6259');

  const proof = componentByIdentity(penpot, 'Popular / Mobile row / Social proof / Like / rail-inline', `count=${spec.count}`)?.instance();
  if (!proof) throw new Error(`missing rail-inline Like proof count=${spec.count}`);
  proof.name = `linked Social proof / Like / rail-inline / count=${spec.count}`;
  summary.appendChild(proof);
  place(penpotUtils, proof, 123, 75, proof.width, proof.height);

  const arrow = componentById(penpot, ARROW_ID)?.instance();
  if (!arrow) throw new Error(`missing rail arrow: ${ARROW_ID}`);
  arrow.name = 'linked Icon / Product / rail-arrow-right';
  summary.appendChild(arrow);
  place(penpotUtils, arrow, 241, 76, 48, 23);

  const media = penpot.createBoard();
  media.name = `Event media / event.real.${eventId} / contain`;
  media.fills = [{ fillColor: '#fffdf8', fillOpacity: 1 }];
  media.borderRadius = 10;
  media.clipContent = true;
  row.appendChild(media);
  place(penpotUtils, media, 315, 0, spec.mediaW, spec.mediaH);
  const source = componentById(penpot, spec.media)?.instance();
  if (!source) throw new Error(`missing source media component: ${spec.media}`);
  source.name = `linked Event media / Popular corpus / event.real.${eventId}`;
  media.appendChild(source);
  place(penpotUtils, source, (spec.mediaW - spec.contentW) / 2, (spec.mediaH - spec.contentH) / 2, spec.contentW, spec.contentH);

  const component = penpot.library.local.createComponent([row]);
  return { existing: false, id: component.id, path: component.path, name: component.name, main: component.mainInstance().id };
}

function createPopularMobileGroup(penpot, penpotUtils, reason, slot = 0) {
  assertContext(penpot, RESOURCE_PAGE_ID);
  const spec = GROUPS[reason];
  if (!spec) throw new Error(`unknown Popular group: ${reason}`);
  const path = 'Popular / Grouping / Fixture';
  const name = `viewport=mobile;reason=${reason};corpus=current-v1`;
  const existing = componentByIdentity(penpot, path, name);
  if (existing) return { existing: true, id: existing.id, path, name };
  const group = penpot.createBoard();
  group.name = `${path} / ${name}`;
  group.fills = [];
  group.clipContent = false;
  place(penpotUtils, group, 900, 120 + slot * 740, 390, 690);

  const header = penpot.createBoard();
  header.name = `Popular trend context / ${reason}`;
  header.fills = [{ fillColor: '#fbf7ef', fillOpacity: 0.984 }];
  group.appendChild(header);
  place(penpotUtils, header, 0, 0, 390, 80);
  const icon = componentById(penpot, TREND_ID)?.instance();
  if (!icon) throw new Error(`missing Popular trend icon: ${TREND_ID}`);
  icon.name = 'linked Icon / Listing / mobile-group-trend-up.18';
  header.appendChild(icon);
  place(penpotUtils, icon, 12, 39.5, 18, 18);
  const twoLines = spec.title.includes('\n');
  text(penpot, penpotUtils, header, 'Content / Group title / source-locked', spec.title, 37, twoLines ? 21 : 31, 303, twoLines ? 40 : 20, 18, 900, 1.111, '#221a14');
  text(penpot, penpotUtils, header, 'Content / Group subtitle / source-locked', spec.subtitle, 37, twoLines ? 64 : 54, 303, 12, 10, 700, 1.2, '#6d6259');
  text(penpot, penpotUtils, header, 'Content / Group count', '5', 350, 42.5, 28, 12, 12, 900, 1, '#a54821', 'right');

  spec.rows.forEach((eventId, index) => {
    const rowComponent = componentByIdentity(penpot, 'Popular / Mobile row viewport / Fixture', `event.real.${eventId} · 390 · current-v1`);
    if (!rowComponent) throw new Error(`missing Popular mobile row component: ${eventId}`);
    const row = rowComponent.instance();
    row.name = `linked Popular / Mobile row viewport / event.real.${eventId}`;
    group.appendChild(row);
    place(penpotUtils, row, 0, 90 + index * 122, 390, 112);
  });
  const component = penpot.library.local.createComponent([group]);
  return { existing: false, id: component.id, path: component.path, name: component.name, main: component.mainInstance().id };
}

function applyPopularMobileOwner(penpot, penpotUtils) {
  assertContext(penpot, OWNER_PAGE_ID);
  const board = penpot.currentPage.getShapeById(OWNER_BOARD_ID);
  if (!board) throw new Error(`missing owner board: ${OWNER_BOARD_ID}`);
  board.borderRadius = 0;
  board.clipContent = true;
  const swaps = [
    [OWNER_FAST_ID, 'fast_growth', 240],
    [OWNER_DISCUSS_ID, 'discussed', 954]
  ];
  const result = [];
  for (const [legacyId, reason, y] of swaps) {
    const legacy = penpot.currentPage.getShapeById(legacyId);
    const component = componentByIdentity(penpot, 'Popular / Grouping / Fixture', `viewport=mobile;reason=${reason};corpus=current-v1`);
    if (!component) throw new Error(`missing mobile group adapter: ${reason}`);
    let instance = board.children.find(shape => shape.component?.()?.id === component.id);
    if (!instance) {
      const index = legacy ? board.children.indexOf(legacy) : board.children.length;
      instance = component.instance();
      instance.name = `linked Popular / Grouping / ${reason}`;
      board.insertChild(Math.max(0, index), instance);
      legacy?.remove();
    }
    place(penpotUtils, instance, 0, y, 390, 690);
    result.push({ reason, id: instance.id, component: component.id, y });
  }

  const nav = penpot.currentPage.getShapeById(OWNER_NAV_ID);
  if (!nav) throw new Error(`missing Popular mobile nav: ${OWNER_NAV_ID}`);
  const states = { 'Афиша': true, 'Даты': false, 'Поиск': false, 'Для меня': false };
  const stack = [nav];
  while (stack.length) {
    const shape = stack.pop();
    if (shape.name.startsWith('Mobile bottom active icon pill / active=')) {
      shape.hidden = shape.name !== 'Mobile bottom active icon pill / active=afisha';
    }
    if (shape.type === 'text' && Object.prototype.hasOwnProperty.call(states, shape.characters)) {
      const active = states[shape.characters];
      shape.fills = [{ fillColor: active ? '#221a14' : '#766b62', fillOpacity: 1 }];
      shape.fontWeight = active ? '900' : '700';
    }
    if (shape.children) stack.push(...shape.children);
  }
  return { board: board.id, borderRadius: board.borderRadius, groups: result, nav: nav.id };
}

if (typeof module !== 'undefined') module.exports = {
  ROWS,
  GROUPS,
  ensureProofs,
  createPopularMobileRow,
  createPopularMobileGroup,
  applyPopularMobileOwner
};

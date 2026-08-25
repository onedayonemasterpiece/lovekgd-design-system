/**
 * Source-proven desktop service footer repair.
 *
 * Astro `/artefakty/` exposes the complete 681.859px footer.  The shared
 * Penpot master was only 428px high and omitted share actions, four navigation
 * links, legal copy, social channels and the operational tail.  This helper
 * repairs the lowest shared masters used by eight desktop archetypes.
 *
 * Run one phase per MCP call on settled page 63.05 and read back before the
 * next phase.  A 504 is an unknown write: inspect exact names before retrying.
 */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const MASTER_PAGE_ID = 'a21f5e36-5d76-8065-8008-86ac7b368ff6';
const VIEWPORT_PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880a6c07b2b2';
const FOOTER_COMPONENT_ID = 'a21f5e36-5d76-8065-8008-86af602ad62a';
const VIEWPORT_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-885914f2be1b';
const ANNOUNCEMENTS_WORDMARK_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-87853121d15c';
const DESKTOP_OWNERS = {
  unusual: ['d87e18f1-dcb4-80a6-8008-880a6c07b2b2', 'd87e18f1-dcb4-80a6-8008-880a6c416ec5', 772.359375],
  search: ['d87e18f1-dcb4-80a6-8008-880ac732b6ae', 'd87e18f1-dcb4-80a6-8008-880ac7b07e0b', 1095.59375],
  // The bounded Event-detail owner intentionally represents only the review
  // composition and keeps its source footer off-canvas; only its viewport
  // surface is corrected here.
  eventDetail: ['d87e18f1-dcb4-80a6-8008-880bfdfbf2ec', 'd87e18f1-dcb4-80a6-8008-880bfe361a1d', null],
  collections: ['d87e18f1-dcb4-80a6-8008-880c4a36d153', 'd87e18f1-dcb4-80a6-8008-880c4a6d708e', 984.109375],
  interestClubs: ['d87e18f1-dcb4-80a6-8008-880cfe1ec779', 'd87e18f1-dcb4-80a6-8008-880cfe39384c', 805.65625],
  favorites: ['d87e18f1-dcb4-80a6-8008-880d209a7fcd', 'd87e18f1-dcb4-80a6-8008-880d20bc67e8', 1075.109375],
  artifacts: ['d87e18f1-dcb4-80a6-8008-880f9a822a76', 'd87e18f1-dcb4-80a6-8008-880f9aaea84e', 354.59375],
  information: ['d87e18f1-dcb4-80a6-8008-880fb747d10c', 'd87e18f1-dcb4-80a6-8008-880fb76dafb9', 736.84375]
};

function assertContext(penpot, pageId, label) {
  if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== pageId) {
    throw new Error(`open settled ${label} before desktop footer repair`);
  }
}

const byId = (penpot, id) => penpot.library.local.components.find(component => component.id === id);
function place(penpotUtils, shape, x, y, w, h) {
  // Every source measurement is an explicit parent-relative coordinate.  The
  // legacy masters use flex layouts, so opt repaired descendants out of flow
  // before setting geometry; otherwise Penpot silently redistributes them.
  if (shape.layoutChild) shape.layoutChild.absolute = true;
  if (w != null && h != null) shape.resize(w, h);
  penpotUtils.setParentXY(shape, x, y);
  return shape;
}

function styleText(shape, { characters, size, weight, lineHeight, letterSpacing = 0, color, width, height, x, y }, penpotUtils) {
  if (characters != null) shape.characters = characters;
  shape.fontFamily = 'Inter';
  shape.fontStyle = 'normal';
  shape.fontSize = String(size);
  shape.fontWeight = String(weight);
  shape.lineHeight = String(lineHeight);
  shape.letterSpacing = String(letterSpacing);
  shape.fills = [{ fillColor: color, fillOpacity: 1 }];
  place(penpotUtils, shape, x, y, width, height);
  return shape;
}

function ensureText(penpot, penpotUtils, parent, name, spec) {
  let shape = parent.children.find(child => child.name === name);
  if (!shape) {
    shape = penpot.createText(spec.characters);
    shape.name = name;
    parent.appendChild(shape);
  }
  return styleText(shape, spec, penpotUtils);
}

function ensureRect(penpot, penpotUtils, parent, name, x, y, w, h, fill, radius = 0, strokes = []) {
  let shape = parent.children.find(child => child.name === name);
  if (!shape) {
    shape = penpot.createRectangle();
    shape.name = name;
    parent.appendChild(shape);
  }
  shape.fills = fill ? [{ fillColor: fill, fillOpacity: 1 }] : [];
  shape.strokes = strokes;
  shape.borderRadius = radius;
  return place(penpotUtils, shape, x, y, w, h);
}

function applyDesktopFooterMasterGeometry(penpot, penpotUtils) {
  assertContext(penpot, MASTER_PAGE_ID, '60.1');
  const footer = byId(penpot, FOOTER_COMPONENT_ID)?.mainInstance();
  if (!footer?.isComponentMainInstance()) throw new Error('desktop footer master missing');
  footer.resize(1180, 481.859375);
  footer.fills = [{ fillColor: '#221a14', fillOpacity: 1 }];
  const columns = footer.children.filter(child => child.type === 'board');
  if (columns.length < 4) throw new Error('desktop footer columns incomplete');
  const positions = [
    [0, 31.34375, 320.4375, 240],
    [393.328125, 31.34375, 236.625, 260],
    [668.34375, 31.34375, 236.625, 220],
    [943.359375, 31.34375, 236.640625, 220]
  ];
  columns.slice(0, 4).forEach((column, index) => place(penpotUtils, column, ...positions[index]));

  return { footer: { id: footer.id, width: footer.width, height: footer.height } };
}

function applyDesktopFooterViewportGeometry(penpot, penpotUtils) {
  assertContext(penpot, VIEWPORT_PAGE_ID, '63.05');
  const viewport = byId(penpot, VIEWPORT_COMPONENT_ID)?.mainInstance();
  if (!viewport?.isComponentMainInstance()) throw new Error('desktop footer viewport master missing');
  viewport.resize(1280, 681.859375);
  viewport.fills = [{ fillColor: '#221a14', fillOpacity: 1 }];
  const share = viewport.children.find(child => child.name === 'Share strip');
  const linked = viewport.children.find(child => child.component?.()?.id === FOOTER_COMPONENT_ID);
  if (!share || !linked) throw new Error('desktop footer viewport anatomy incomplete');
  place(penpotUtils, share, 50, 96, 1180, 84);
  share.borderRadius = 16;
  share.fills = [{ fillColor: '#fffaf3', fillOpacity: 1 }];
  place(penpotUtils, linked, 50, 200, 1180, 481.859375);
  return { viewport: { id: viewport.id, width: viewport.width, height: viewport.height } };
}

function applyDesktopFooterShareActions(penpot, penpotUtils, actionIndex) {
  assertContext(penpot, VIEWPORT_PAGE_ID, '63.05');
  const viewport = byId(penpot, VIEWPORT_COMPONENT_ID)?.mainInstance();
  const share = viewport?.children.find(child => child.name === 'Share strip');
  if (!share) throw new Error('desktop share strip missing');
  const prompt = share.children.find(child => child.type === 'text');
  if (!prompt) throw new Error('desktop share prompt missing');
  styleText(prompt, { characters: 'Понравились Анонсы? Поделитесь', size: 17.28, weight: 700, lineHeight: 1, color: '#552414', x: 28.1875, y: 31.359375, width: 361.328125, height: 21.421875 }, penpotUtils);
  ensureRect(penpot, penpotUtils, share, 'Share strip / accent', 0, 0, 4, 84, '#a54821', 16);

  const actions = [
    { name: 'Action / Copy card', label: 'Скопировать карточку', key: 'P', x: 536.609375, y: 18.078125, h: 48 },
    { name: 'Action / Copy text and link', label: 'Скопировать текст и\nссылку', key: 'S', x: 852.609375, y: 15.390625, h: 53.375 }
  ];
  if (!Number.isInteger(actionIndex) || !actions[actionIndex]) throw new Error('pass one share action index (0..1)');
  for (const action of [actions[actionIndex]]) {
    let board = share.children.find(child => child.name === action.name);
    if (!board) {
      board = penpot.createBoard();
      board.name = action.name;
      share.appendChild(board);
    }
    board.fills = [{ fillColor: '#fffdf8', fillOpacity: 1 }];
    board.strokes = [{ strokeColor: '#793014', strokeOpacity: 0.25, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
    board.borderRadius = 999;
    place(penpotUtils, board, action.x, action.y, 308, action.h);
    ensureText(penpot, penpotUtils, board, `${action.name} / label`, { characters: action.label, size: 14.08, weight: 800, lineHeight: 1.2, color: '#221a14', x: 56, y: action.h === 48 ? 15.5 : 10, width: 220, height: action.h === 48 ? 17 : 34 });
    const keycap = ensureRect(penpot, penpotUtils, board, `${action.name} / keycap`, 280, (action.h - 24) / 2, 20, 24, '#fffaf3', 4, [{ strokeColor: '#a54821', strokeOpacity: 0.45, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }]);
    ensureText(penpot, penpotUtils, board, `${action.name} / key`, { characters: action.key, size: 12, weight: 800, lineHeight: 1, color: '#793014', x: 286, y: (action.h - 12) / 2, width: 8, height: 12 });
  }
  return { share: share.id, action: actions[actionIndex].name };
}

function applyDesktopFooterCoreCopy(penpot, penpotUtils, section) {
  assertContext(penpot, MASTER_PAGE_ID, '60.1');
  const footer = byId(penpot, FOOTER_COMPONENT_ID)?.mainInstance();
  if (!footer) throw new Error('desktop footer master missing');
  const [brand, afisha, project, documents] = footer.children.filter(child => child.type === 'board').slice(0, 4);
  if (section === 'brand') {
    const brandTexts = brand.children.filter(child => child.type === 'text');
    const small = brandTexts.find(shape => /ПОЛЮБИТЬ/i.test(shape.characters));
    const logo = brandTexts.find(shape => shape.characters === 'АНОНСЫ');
    const legacyDescription = brandTexts.find(shape => ![small, logo].includes(shape));
    if (!small || !logo || !legacyDescription) throw new Error('desktop footer brand copy incomplete');
    // Coordinates below are local to the already-positioned brand column.
    styleText(small, { characters: 'ПОЛЮБИТЬ КАЛИНИНГРАД', size: 10.88, weight: 800, lineHeight: 1.2, letterSpacing: 1, color: '#fff7ed', x: 0, y: 0, width: 240, height: 13.0625 }, penpotUtils);
    // Reuse the already-certified native brand wordmark; do not redraw it as
    // visually similar text in this shell context.
    logo.hidden = true;
    let wordmark = brand.children.find(shape => shape.component?.()?.id === ANNOUNCEMENTS_WORDMARK_COMPONENT_ID);
    if (!wordmark) {
      const component = byId(penpot, ANNOUNCEMENTS_WORDMARK_COMPONENT_ID);
      if (!component) throw new Error('Announcements wordmark component missing');
      wordmark = component.instance();
      wordmark.name = 'linked Brand / Announcements / Wordmark / monochrome';
      brand.appendChild(wordmark);
    }
    place(penpotUtils, wordmark, 0, 20, 240, 46.4725);
    styleText(legacyDescription, { characters: 'События Калининграда и области — без\nлишнего шума, с понятным маршрутом к\nследующему впечатлению.', size: 14.4, weight: 400, lineHeight: 1.55, color: '#bfb1a6', x: 0, y: 95.65625, width: 320.4375, height: 67 }, penpotUtils);
    ensureText(penpot, penpotUtils, brand, 'Contact / info@kenigevents.ru', { characters: 'info@kenigevents.ru', size: 16, weight: 800, lineHeight: 1.6, color: '#f5b18f', x: 0, y: 178.640625, width: 186.28125, height: 26 });
    return { footer: footer.id, section };
  }

  function rewriteColumn(column, heading, items, note = null) {
    const existing = column.children.filter(child => child.type === 'text');
    const headingShape = existing.shift() || penpot.createText(heading);
    if (!headingShape.parent) { headingShape.name = 'Column / heading'; column.appendChild(headingShape); }
    styleText(headingShape, { characters: heading, size: 11.52, weight: 900, lineHeight: 1.08, color: '#b9aaa0', x: 0, y: 0, width: 236.625, height: 12.421875 }, penpotUtils);
    items.forEach((characters, index) => {
      let shape = existing[index];
      if (!shape) { shape = penpot.createText(characters); shape.name = `Column / item ${index + 1}`; column.appendChild(shape); }
      styleText(shape, { characters, size: 14.4, weight: 700, lineHeight: 1.35, color: '#fff7ed', x: 0, y: 28.5625 + index * 28.390625, width: 236.625, height: 19.4375 }, penpotUtils);
    });
    existing.slice(items.length).forEach(shape => { shape.hidden = true; });
    if (note) ensureText(penpot, penpotUtils, column, 'Column / legal note', { characters: note, size: 11.52, weight: 400, lineHeight: 1.45, color: '#bfb1a6', x: 0, y: 161.53125, width: 236.640625, height: 50.0625 });
  }
  function rewriteDocuments(column) {
    const existing = column.children.filter(child => child.type === 'text');
    const used = new Set();
    existing.forEach(shape => { shape.hidden = true; });
    const specs = [
      ['Documents / heading', 'ДОКУМЕНТЫ', 11.52, 900, 1.08, '#b9aaa0', 0, 12.421875],
      ['Documents / user agreement', 'Пользовательское\nсоглашение', 14.4, 700, 1.35, '#fff7ed', 28.5625, 38.875],
      ['Documents / user agreement status', 'ГОТОВИТСЯ', 10.88, 800, 1.2, '#be9b88', 69.84375, 13.0625],
      ['Documents / privacy', 'Политика обработки\nперсональных данных', 14.4, 700, 1.35, '#fff7ed', 91.859375, 38.875],
      ['Documents / privacy status', 'ГОТОВИТСЯ', 10.88, 800, 1.2, '#be9b88', 133.140625, 13.0625],
      ['Column / legal note', 'Ссылки закреплены в прототипе;\nтексты будут опубликованы после\nюридической проверки.', 11.52, 400, 1.45, '#bfb1a6', 161.53125, 50.0625]
    ];
    specs.forEach(([name, characters, size, weight, lineHeight, color, y, height], index) => {
      let shape = column.children.find(child => child.name === name);
      if (!shape) shape = existing.find(child => !used.has(child.id)) || penpot.createText(characters);
      used.add(shape.id);
      if (shape.parent?.id !== column.id) column.appendChild(shape);
      shape.name = name;
      shape.hidden = false;
      styleText(shape, { characters, size, weight, lineHeight, color, x: 0, y, width: 236.640625, height }, penpotUtils);
    });
  }
  const columns = {
    afisha: [afisha, 'АФИША', ['Сегодня', 'Завтра', 'Выходные', 'Выставки', 'Популярное', 'Необычное', 'Поиск', 'Все анонсы']],
    project: [project, 'О ПРОЕКТЕ', ['Партнёры', 'Стать партнёром', 'Правообладателям']],
    documents: [documents, 'ДОКУМЕНТЫ', []]
  };
  if (!columns[section]) throw new Error('pass one core section: brand|afisha|project|documents');
  if (section === 'documents') rewriteDocuments(documents);
  else rewriteColumn(...columns[section]);
  return { footer: footer.id, section };
}

function applyDesktopFooterSocialTail(penpot, penpotUtils, part) {
  assertContext(penpot, MASTER_PAGE_ID, '60.1');
  const footer = byId(penpot, FOOTER_COMPONENT_ID)?.mainInstance();
  if (!footer) throw new Error('desktop footer master missing');
  if (part === 'divider') {
    ensureRect(penpot, penpotUtils, footer, 'Footer / social divider', 0, 333.859375, 1180, 1, '#5a5049');
    return { footer: footer.id, part };
  }
  const pills = [
    ['Анонсы', 'Telegram', 0, 165.96875, '#2aabee'],
    ['Афиша', 'Telegram', 174.765625, 164.140625, '#2aabee'],
    ['Анонсы', 'ВК', 347.703125, 131.3125, '#4c75a3'],
    ['Афиша', 'ВК', 487.8125, 129.484375, '#4c75a3'],
    ['канал Афиши', 'VK', 626.09375, 180.28125, '#4c75a3'],
    ['Анонсы', 'Max', 815.171875, 138.609375, '#5f37d1']
  ];
  if (part === 'operational') {
    ensureText(penpot, penpotUtils, footer, 'Footer / operational tail', { characters: 'Сбросить персонализацию  ·  Прототип  ·  noindex  ·  https://kenigevents.ru', size: 13.12, weight: 700, lineHeight: 1.6, color: '#c9b8ad', x: 0, y: 415.859375, width: 760, height: 34 });
    return { footer: footer.id, part };
  }
  const pillIndex = Number(part);
  if (!Number.isInteger(pillIndex) || !pills[pillIndex]) throw new Error('pass divider|operational|one social pill index (0..5)');
  for (const [label, network, x, width, color] of [pills[pillIndex]]) {
    const name = `Social / ${label} / ${network}`;
    let board = footer.children.find(child => child.name === name);
    if (!board) { board = penpot.createBoard(); board.name = name; footer.appendChild(board); }
    board.fills = [{ fillColor: '#ffffff', fillOpacity: 0.043 }];
    board.strokes = [{ strokeColor: '#ffffff', strokeOpacity: 0.13, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
    board.borderRadius = 999;
    place(penpotUtils, board, x, 351.859375, width, 44);
    ensureRect(penpot, penpotUtils, board, `${name} / icon`, 11.5, 11.5, 21, 21, color, 999);
    ensureText(penpot, penpotUtils, board, `${name} / label`, { characters: label, size: 14, weight: 800, lineHeight: 1.2, color: '#fff7ed', x: 39, y: 10, width: Math.max(48, width - 82), height: 17 });
    ensureText(penpot, penpotUtils, board, `${name} / network`, { characters: network, size: 11, weight: 400, lineHeight: 1.2, color: '#bfb1a6', x: width - 51, y: 12, width: 43, height: 14 });
  }
  return { footer: footer.id, social_pill: pillIndex };
}

function applyDesktopFooterOwnerSurface(penpot, penpotUtils, ownerKey) {
  const owner = DESKTOP_OWNERS[ownerKey];
  if (!owner) throw new Error(`unknown desktop owner ${ownerKey}`);
  const [pageId, boardId, footerY] = owner;
  assertContext(penpot, pageId, ownerKey);
  const board = penpot.currentPage.getShapeById(boardId);
  if (!board) throw new Error(`${ownerKey} owner board missing`);
  const footer = board.children.find(shape => shape.component?.()?.id === VIEWPORT_COMPONENT_ID);
  if (!footer?.isComponentCopyInstance()) throw new Error(`${ownerKey} linked footer missing`);
  board.borderRadius = 0;
  if (Number.isFinite(footerY)) penpotUtils.setParentXY(footer, 0, footerY);
  return { ownerKey, board: { id: board.id, radius: board.borderRadius }, footer: { id: footer.id, y: footer.y - board.y, height: footer.height } };
}

if (typeof module !== 'undefined') module.exports = {
  applyDesktopFooterMasterGeometry,
  applyDesktopFooterViewportGeometry,
  applyDesktopFooterShareActions,
  applyDesktopFooterCoreCopy,
  applyDesktopFooterSocialTail,
  applyDesktopFooterOwnerSurface
};

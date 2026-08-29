/**
 * Source-locked `/vystavki/` mobile Event.real.6983 repair.
 *
 * The baseline owner previously linked the right high-level component but its
 * central master still carried fixture=4240 media/count and a desktop deck.
 * This helper keeps the existing card component and owner IDs, introduces only
 * the source-proven mobile deck/action contexts, and then repairs the lowest
 * owning masters.  The deck is a static first-frame representation: carousel
 * behaviour and sub-pixel non-leading crop positions remain Astro-authoritative
 * per the owner-approved exhibition-slider exception.
 *
 * Crash safety: call one exported phase per MCP invocation, wait outside the
 * plugin call, and perform exact-ID read-back before the next phase.  A timeout
 * has unknown outcome and must be read back before retrying.
 */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880cc5490f78';
const OWNER_BOARD_ID = 'd87e18f1-dcb4-80a6-8008-880cc78ce882';
const OWNER_CARD_ID = 'd87e18f1-dcb4-80a6-8008-8864010084ca';
const CARD_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-88631e03b67e';

const LIKE_COMPONENT_ID = 'a6e7f5b4-ff51-80c0-8008-83417ed8b143';
const REASON_COMPONENT_ID = 'a6e7f5b4-ff51-80c0-8008-834181919406';
const TOPIC_COMPONENT_ID = 'a6e7f5b4-ff51-80c0-8008-8341825bef80';
const SHARE_PROOF_COMPONENT_ID = 'a6e7f5b4-ff51-80c0-8008-83417dbca444';
const DISLIKE_ICON_COMPONENT_ID = '195df023-6fe5-80a0-8008-82df4d9f0891';
const COMMENT_ICON_COMPONENT_ID = 'fd45a474-7b74-809d-8008-8184a6796318';

const DECK_PATH = 'Event rows / Exhibition / Deck / Mobile';
const DECK_NAME = 'fixture=6983;state=first;viewport=390';
const COUNT_PATH = 'Event rows / Exhibition / Deck / Remaining count';
const COUNT_NAME = 'viewport=mobile;size=34';
const REJECT_PATH = 'Event rows / Exhibition / Action';
// The same compact on-dark action is used by desktop and mobile rows.  Keep
// viewport out of the semantic identity: viewport is parent layout context,
// not a second visual component.
const REJECT_NAME = 'Reject compact · on-dark';
const LEGACY_REJECT_NAME = 'Reject compact · viewport=mobile';
const DISCUSSED_PATH = 'Event rows / Exhibition / Signal';
const DISCUSSED_NAME = 'Discussed compact · viewport=mobile';

const MEDIA = [
  {
    name: 'event.real.6983 / media=0 / 256',
    url: 'https://static.kenigevents.ru/p/thumb/v1/5f/5ff10aeeea82888e3c1fb799cd6966baa68994529b4384126888172e8fbeaf4e/256.webp',
    frame: [0, 0, 149.59375, 187],
    image: [1, 1, 147.59375, 185],
    objectPosition: '50% 50%'
  },
  {
    name: 'event.real.6983 / media=1 / 256',
    url: 'https://static.kenigevents.ru/p/thumb/v1/74/74c54346fed63a91dd6919d6786495aff6732ce66e0b789039c29b625943d5ad/256.webp',
    frame: [143.59375, 4.4375, 142.46875, 178.09375],
    image: [1, 1, 140.46875, 176.09375],
    objectPosition: '65% 55%'
  },
  {
    name: 'event.real.6983 / media=2 / 256',
    url: 'https://static.kenigevents.ru/p/thumb/v1/60/6068914f9d48d79ba5099fb742b16a4902400496b6673240d61fd6d5b2570046/256.webp',
    frame: [152.59375, 8.5, 136, 170],
    image: [1, 1, 134, 168],
    objectPosition: '40% 50%'
  },
  {
    name: 'event.real.6983 / media=3 / 256',
    url: 'https://static.kenigevents.ru/p/thumb/v1/92/92f413726d927f43532ce3f9bd5d3a29fdd69330117dfe2a0460fa00b66a0863/256.webp',
    frame: [168.640625, 12.1875, 121.953125, 162.59375],
    image: [1, 1, 119.953125, 160.59375],
    objectPosition: '50% 50%'
  }
];

const componentById = (penpot, id) => penpot.library.local.components.find(item => item.id === id);
const componentByIdentity = (penpot, path, name) => penpot.library.local.components.find(item => item.path === path && item.name === name);

function assertContext(penpot) {
  if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
    throw new Error('open settled 63.10 before the Exhibitions mobile-card phase');
  }
}

function place(penpotUtils, shape, x, y, width, height) {
  if (shape.layoutChild) shape.layoutChild.absolute = true;
  shape.resize(width, height);
  penpotUtils.setParentXY(shape, x, y);
  return shape;
}

function text(penpot, penpotUtils, parent, name, characters, x, y, width, height, size, weight, lineHeight, color, align = 'left') {
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
  return place(penpotUtils, shape, x, y, width, height);
}

function linkedComponent(penpot, id, label) {
  const component = componentById(penpot, id);
  if (!component) throw new Error(`missing ${label}: ${id}`);
  return component;
}

function overrideText(root, name, characters) {
  const stack = [root];
  while (stack.length) {
    const shape = stack.pop();
    if (shape.type === 'text' && shape.name === name) {
      shape.characters = characters;
      return shape;
    }
    if (shape.children) stack.push(...shape.children);
  }
  throw new Error(`missing override text: ${name}`);
}

function ensureRemainingCount34(penpot, penpotUtils) {
  assertContext(penpot);
  const existing = componentByIdentity(penpot, COUNT_PATH, COUNT_NAME);
  if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
  const board = penpot.createBoard();
  board.name = `${COUNT_PATH} / ${COUNT_NAME}`;
  board.fills = [{ fillColor: '#07090a', fillOpacity: 0.9 }];
  board.strokes = [{ strokeColor: '#ffffff', strokeOpacity: 0.42, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
  board.borderRadius = 999;
  board.clipContent = true;
  place(penpotUtils, board, 1800, 2070, 34, 34);
  text(penpot, penpotUtils, board, 'Count / computed remaining', '+3', 0, 8.648, 34, 16.704, 11.52, 800, 1.45, '#f4f7f8', 'center');
  const component = penpot.library.local.createComponent([board]);
  return { existing: false, id: component.id, main: component.mainInstance().id };
}

function ensureRejectCompact(penpot, penpotUtils) {
  assertContext(penpot);
  const existing = componentByIdentity(penpot, REJECT_PATH, REJECT_NAME)
    || componentByIdentity(penpot, REJECT_PATH, LEGACY_REJECT_NAME);
  if (existing) {
    const migrated = existing.name !== REJECT_NAME;
    const main = existing.mainInstance();
    if (migrated) main.name = `${REJECT_PATH} / ${REJECT_NAME}`;
    return { existing: true, migrated, id: existing.id, main: main.id };
  }
  const board = penpot.createBoard();
  board.name = `${REJECT_PATH} / ${REJECT_NAME}`;
  board.fills = [{ fillColor: '#121416', fillOpacity: 1 }];
  board.strokes = [{ strokeColor: '#2d3134', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
  board.borderRadius = 5;
  board.clipContent = true;
  place(penpotUtils, board, 1850, 2070, 46, 46);
  const icon = linkedComponent(penpot, DISLIKE_ICON_COMPONENT_ID, 'Dislike icon').instance();
  icon.name = 'linked Icon / UI / Dislike / 18px';
  board.appendChild(icon);
  place(penpotUtils, icon, 14, 14, 18, 18);
  const component = penpot.library.local.createComponent([board]);
  return { existing: false, id: component.id, main: component.mainInstance().id };
}

function repairRejectCompactColor(penpot) {
  assertContext(penpot);
  const component = componentByIdentity(penpot, REJECT_PATH, REJECT_NAME)
    || componentByIdentity(penpot, REJECT_PATH, LEGACY_REJECT_NAME);
  if (!component) throw new Error(`missing ${REJECT_PATH} / ${REJECT_NAME}`);
  const main = component.mainInstance();
  const stack = [...main.children];
  const changed = [];
  while (stack.length) {
    const shape = stack.pop();
    if (Array.isArray(shape.fills) && shape.fills.some(fill => fill.fillColor === '#000000')) {
      shape.fills = shape.fills.map(fill => fill.fillColor === '#000000' ? { ...fill, fillColor: '#a8adb2', fillOpacity: 1 } : fill);
      changed.push(shape.id);
    }
    if (shape.children) stack.push(...shape.children);
  }
  return { component: component.id, main: main.id, changed };
}

function ensureDiscussedCompact(penpot, penpotUtils) {
  assertContext(penpot);
  const existing = componentByIdentity(penpot, DISCUSSED_PATH, DISCUSSED_NAME);
  if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
  const board = penpot.createBoard();
  board.name = `${DISCUSSED_PATH} / ${DISCUSSED_NAME}`;
  board.fills = [];
  board.clipContent = true;
  place(penpotUtils, board, 1910, 2070, 14, 14);
  const icon = linkedComponent(penpot, COMMENT_ICON_COMPONENT_ID, 'Comment icon').instance();
  icon.name = 'linked Icon / UI / Comment / 14px';
  board.appendChild(icon);
  place(penpotUtils, icon, 0, 0, 14, 14);
  const component = penpot.library.local.createComponent([board]);
  return { existing: false, id: component.id, main: component.mainInstance().id };
}

async function ensureMobileDeck6983(penpot, penpotUtils) {
  assertContext(penpot);
  const existing = componentByIdentity(penpot, DECK_PATH, DECK_NAME);
  if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
  const uploaded = [];
  for (const item of MEDIA) uploaded.push(await penpot.uploadMediaUrl(item.name, item.url));
  const deck = penpot.createBoard();
  deck.name = `${DECK_PATH} / ${DECK_NAME}`;
  deck.fills = [];
  deck.clipContent = false;
  place(penpotUtils, deck, 1800, 2130, 331.21875, 187.1875);
  // Back-to-front order keeps the leading frame above the three depth planes.
  for (const index of [3, 2, 1, 0]) {
    const spec = MEDIA[index];
    const frame = penpot.createBoard();
    frame.name = `EventMediaFrame / event.real.6983 / slot=${index} / static-first-state`;
    frame.fills = [{ fillColor: '#0b0d0e', fillOpacity: 1 }];
    frame.strokes = [{ strokeColor: '#dce5ec', strokeOpacity: index === 0 ? 0.62 : 0.61 + (3 - index) * 0.064, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
    frame.borderRadius = 8;
    frame.clipContent = true;
    deck.appendChild(frame);
    place(penpotUtils, frame, ...spec.frame);
    const image = penpot.createRectangle();
    image.name = `media / source-bound / event.real.6983 / slot=${index} / object-position=${spec.objectPosition}`;
    image.fills = [{ fillImage: uploaded[index], fillOpacity: 1 }];
    image.borderRadius = 7;
    frame.appendChild(image);
    place(penpotUtils, image, ...spec.image);
  }
  const countComponent = componentByIdentity(penpot, COUNT_PATH, COUNT_NAME);
  if (!countComponent) throw new Error(`missing ${COUNT_PATH} / ${COUNT_NAME}`);
  const count = countComponent.instance();
  count.name = 'linked Remaining count / computed +3 / mobile34';
  deck.appendChild(count);
  place(penpotUtils, count, 271.59375, 76.59375, 34, 34);
  const component = penpot.library.local.createComponent([deck]);
  return { existing: false, id: component.id, main: component.mainInstance().id, media: uploaded.map(item => item.id) };
}

function configureInstanceText(instance, name, characters) {
  overrideText(instance, name, characters);
  return instance;
}

function applyMobileCard6983(penpot, penpotUtils) {
  assertContext(penpot);
  const cardComponent = linkedComponent(penpot, CARD_COMPONENT_ID, 'existing Exhibitions mobile card');
  const main = cardComponent.mainInstance();
  if (!main?.isComponentMainInstance()) throw new Error('mobile-card main instance missing');
  const deckComponent = componentByIdentity(penpot, DECK_PATH, DECK_NAME);
  const countComponent = componentByIdentity(penpot, COUNT_PATH, COUNT_NAME);
  const rejectComponent = componentByIdentity(penpot, REJECT_PATH, REJECT_NAME)
    || componentByIdentity(penpot, REJECT_PATH, LEGACY_REJECT_NAME);
  const discussedComponent = componentByIdentity(penpot, DISCUSSED_PATH, DISCUSSED_NAME);
  if (!deckComponent || !countComponent || !rejectComponent || !discussedComponent) throw new Error('mobile-card dependencies are incomplete');

  for (const child of [...main.children]) child.remove();
  main.name = 'Exhibitions / Mobile card / state=new;fixture=6983';
  main.fills = [];
  main.strokes = [];
  main.borderRadius = 0;
  main.clipContent = false;
  main.resize(370, 384.6875);

  const edge = penpot.createRectangle();
  edge.name = 'State / Upcoming edge light / source-normal';
  edge.fills = [];
  edge.strokes = [{ strokeColor: '#54acf7', strokeOpacity: 0.36, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
  edge.borderRadius = 8;
  main.appendChild(edge);
  place(penpotUtils, edge, 17, -1, 354, 386.6875);

  const dot = penpot.createEllipse();
  dot.name = 'Lifecycle / upcoming dot';
  dot.fills = [{ fillColor: '#9da2a6', fillOpacity: 1 }];
  dot.strokes = [{ strokeColor: '#0d0f10', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 2, strokeAlignment: 'inner' }];
  main.appendChild(dot);
  place(penpotUtils, dot, 0.5, 12.1875, 14, 14);

  text(penpot, penpotUtils, main, 'Lifecycle / Date / event.real.6983', 'с 8 августа', 28.390625, 10.390625, 80.8125, 16.234375, 12.8, 800, 1.1, '#f4f4f2');
  text(penpot, penpotUtils, main, 'Lifecycle / Status / event.real.6983', 'Откроется через 16 дней', 119.59375, 10.390625, 240.015625, 16.234375, 11.2, 400, 1.45, '#a8adb2', 'right');

  const deck = deckComponent.instance();
  deck.name = 'linked Exhibition media deck / event.real.6983 / static-first-state';
  main.appendChild(deck);
  place(penpotUtils, deck, 28.390625, 37.015625, 331.21875, 187.1875);

  text(penpot, penpotUtils, main, 'Content / Event title / event.real.6983', 'Выставка на\nПроменаде', 28.390625, 237.78125, 222.828125, 36.78125, 16, 800, 1.15, '#f4f4f2');
  text(penpot, penpotUtils, main, 'Content / Venue / event.real.6983', 'Променад', 28.390625, 279.03125, 222.828125, 18.09375, 12.48, 400, 1.45, '#a8adb2');

  const reason = linkedComponent(penpot, REASON_COMPONENT_ID, 'Exhibition reason chip');
  const newChip = configureInstanceText(reason.instance(), 'Label / instance content', 'Новое');
  newChip.name = 'linked Exhibition reason / state=new';
  newChip.fills = [{ fillColor: '#3c1d20', fillOpacity: 1 }];
  newChip.strokes = [];
  newChip.borderRadius = 3;
  main.appendChild(newChip);
  place(penpotUtils, newChip, 28.390625, 301.59375, 49.3125, 19.78125);
  const newLabel = overrideText(newChip, 'Label / instance content', 'Новое');
  place(penpotUtils, newLabel, 4.8, 3.2, 39.7125, 13.38125);
  newLabel.fontSize = '10.88'; newLabel.fontWeight = '800'; newLabel.lineHeight = '1.23'; newLabel.fills = [{ fillColor: '#ff8e98', fillOpacity: 1 }];

  const upcomingChip = configureInstanceText(reason.instance(), 'Label / instance content', 'Скоро откроется');
  upcomingChip.name = 'linked Exhibition reason / state=upcoming';
  upcomingChip.fills = [{ fillColor: '#20262c', fillOpacity: 1 }];
  upcomingChip.strokes = [];
  upcomingChip.borderRadius = 3;
  main.appendChild(upcomingChip);
  place(penpotUtils, upcomingChip, 82.171875, 301.59375, 114.375, 19.78125);
  const upcomingLabel = overrideText(upcomingChip, 'Label / instance content', 'Скоро откроется');
  place(penpotUtils, upcomingLabel, 4.8, 3.2, 104.775, 13.38125);
  upcomingLabel.fontSize = '10.88'; upcomingLabel.fontWeight = '800'; upcomingLabel.lineHeight = '1.23'; upcomingLabel.fills = [{ fillColor: '#54acf7', fillOpacity: 1 }];

  const topic = configureInstanceText(linkedComponent(penpot, TOPIC_COMPONENT_ID, 'Exhibition topic tag').instance(), 'Label / instance content', 'выставка');
  topic.name = 'linked Exhibition topic / выставка';
  topic.fills = [{ fillColor: '#202326', fillOpacity: 1 }];
  topic.strokes = [];
  topic.borderRadius = 3;
  main.appendChild(topic);
  place(penpotUtils, topic, 28.390625, 329.84375, 57, 19.78125);
  const topicLabel = overrideText(topic, 'Label / instance content', 'выставка');
  place(penpotUtils, topicLabel, 4.8, 3.2, 47.4, 13.38125);
  topicLabel.fontSize = '10.88'; topicLabel.fontWeight = '700'; topicLabel.lineHeight = '1.23'; topicLabel.fills = [{ fillColor: '#a8adb2', fillOpacity: 1 }];

  const share = linkedComponent(penpot, SHARE_PROOF_COMPONENT_ID, 'Exhibition share proof').instance();
  share.name = 'linked Social proof / Share / count=3';
  try { overrideText(share, 'Noun / derived by count', 'репоста'); } catch (_) {}
  const shareCount = (() => { const stack=[share]; while(stack.length){const s=stack.pop(); if(s.type==='text' && s.characters==='90') return s; if(s.children) stack.push(...s.children);} return null; })();
  if (shareCount) shareCount.characters = '3';
  main.appendChild(share);
  place(penpotUtils, share, 28.390625, 354.421875, 95, 16.6875);

  const discussed = discussedComponent.instance();
  discussed.name = 'linked Exhibition signal / Discussed / compact';
  main.appendChild(discussed);
  place(penpotUtils, discussed, 345.609375, 234.59375, 14, 14);

  const like = linkedComponent(penpot, LIKE_COMPONENT_ID, 'Exhibition Like with count').instance();
  like.name = 'linked Social proof / Like / count=44';
  configureInstanceText(like, 'Count / aggregate source', '44');
  main.appendChild(like);
  place(penpotUtils, like, 262.015625, 256.59375, 46, 46);

  const reject = rejectComponent.instance();
  reject.name = 'linked Exhibition action / Reject compact';
  main.appendChild(reject);
  place(penpotUtils, reject, 313.609375, 256.59375, 46, 46);

  return {
    component: { id: cardComponent.id, path: cardComponent.path, name: cardComponent.name },
    main: { id: main.id, width: main.width, height: main.height, children: main.children.length },
    dependencies: main.children.filter(shape => shape.isComponentCopyInstance?.()).map(shape => ({ id: shape.id, name: shape.name, component: shape.component()?.id }))
  };
}

function applyOwner6983(penpot, penpotUtils) {
  assertContext(penpot);
  const board = penpot.currentPage.getShapeById(OWNER_BOARD_ID);
  const owner = penpot.currentPage.getShapeById(OWNER_CARD_ID);
  if (!board || !owner?.isComponentCopyInstance() || owner.component()?.id !== CARD_COMPONENT_ID) throw new Error('owner card binding missing');
  owner.resetOverrides();
  owner.name = 'linked Exhibitions / Mobile card / event.real.6983';
  if (owner.layoutChild) owner.layoutChild.absolute = true;
  penpotUtils.setParentXY(owner, 10, 885.578125);
  board.borderRadius = 0;
  board.clipContent = true;
  return {
    board: { id: board.id, width: board.width, height: board.height, radius: board.borderRadius },
    owner: { id: owner.id, name: owner.name, x: owner.x - board.x, y: owner.y - board.y, width: owner.width, height: owner.height, component: owner.component()?.id },
    validate: penpot.currentFile.validate()
  };
}

if (typeof module !== 'undefined') module.exports = {
  ensureRemainingCount34,
  ensureRejectCompact,
  repairRejectCompactColor,
  ensureDiscussedCompact,
  ensureMobileDeck6983,
  applyMobileCard6983,
  applyOwner6983
};

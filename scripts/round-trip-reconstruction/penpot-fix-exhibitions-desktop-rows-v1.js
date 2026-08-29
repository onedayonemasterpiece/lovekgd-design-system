/**
 * Source-locked `/vystavki/` desktop row repair for the first four exact
 * Golden fixtures: 6983, 6871, 6995 and 7036.
 *
 * The product component remains Event rows / Exhibition / ExhibitionRow.
 * Fixture data is applied as normal linked-instance content/state overrides;
 * only the Astro-authoritative static-first slider surfaces are small native
 * fixture adapters.  Images are never flattened screenshots.
 *
 * Crash safety: execute one exported phase per MCP call.  Navigation must be a
 * separate call, followed by local settle.  A 504 has unknown outcome: read
 * back the exact component/owner ID before retrying.
 */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880cc5490f78';
const MASTER_PAGE_ID = '579a886e-56e8-80a3-8008-81882dcbdd84';
const OWNER_BOARD_ID = 'd87e18f1-dcb4-80a6-8008-880cc5676c70';
const ROW_COMPONENT_ID = '45777396-2f2a-80c0-8008-818f9adc878e';
const TOPIC_COMPONENT_ID = 'a6e7f5b4-ff51-80c0-8008-8341825bef80';
const REJECT_COMPONENT_ID = '8e7accff-5c78-8007-8008-899a30f643f5';
const YANTAR_ARTWORK_COMPONENT_ID = '45777396-2f2a-80c0-8008-819173848596';

const DECK_PATH = 'Event rows / Exhibition / Deck / Desktop fixture';
const deckName = eventId => `fixture=${eventId};state=first;viewport=1280`;

const ROWS = {
  '6983': {
    owner: 'd87e18f1-dcb4-80a6-8008-8863fe196a76',
    y: 581.75,
    height: 140.390625,
    date: 'с 8 августа', status: 'Откроется через 16 дней',
    title: 'Выставка на Променаде', venue: 'Променад', long: false,
    topics: ['выставка'], share: ['3', 'репоста'], discussed: true, like: '44',
    mediaHeight: 121.859375,
    frames: [
      [70.84375, 0, 97.59375, 122, 'https://static.kenigevents.ru/p/thumb/v1/5f/5ff10aeeea82888e3c1fb799cd6966baa68994529b4384126888172e8fbeaf4e/256.webp', '50% 50%'],
      [172.4375, 0, 97.59375, 122, 'https://static.kenigevents.ru/p/thumb/v1/74/74c54346fed63a91dd6919d6786495aff6732ce66e0b789039c29b625943d5ad/256.webp', '65% 55%'],
      [274.046875, 0, 97.59375, 122, 'https://static.kenigevents.ru/p/thumb/v1/60/6068914f9d48d79ba5099fb742b16a4902400496b6673240d61fd6d5b2570046/256.webp', '40% 50%'],
      [375.640625, 0, 91.5, 122, 'https://static.kenigevents.ru/p/thumb/v1/92/92f413726d927f43532ce3f9bd5d3a29fdd69330117dfe2a0460fa00b66a0863/256.webp', '50% 50%']
    ]
  },
  '6871': {
    owner: 'd87e18f1-dcb4-80a6-8008-8863feae8507',
    y: 729.140625,
    height: 140.390625,
    date: 'с 8 августа', status: 'Откроется через 16 дней',
    title: 'Выставка «Окна времени»', venue: 'Променад Светлогорска', long: false,
    topics: ['выставка', 'краеведение'], share: ['8', 'репостов'], discussed: true, like: '60',
    mediaHeight: 121.859375,
    frames: [
      [83.921875, 0, 183.0625, 122, 'https://static.kenigevents.ru/p/thumb/v1/07/07a2948636a9f3fee40474d16309e8a00f13bf38c57d5072a124a6e13b31793f/256.webp', '50% 50%'],
      [271, 0, 183.0625, 122, 'https://static.kenigevents.ru/p/thumb/v1/a9/a9f2093ee21839b560885ab4906da51a8cc9c2023c22e260a1a40780cde01adb/256.webp', '50% 50%']
    ]
  },
  '6995': {
    owner: 'd87e18f1-dcb4-80a6-8008-8863ff4898de',
    y: 876.53125,
    height: 139.6875,
    date: 'с 2 августа', status: 'Откроется через 10 дней',
    title: 'Персональная выставка Виктории Трубачёвой «Оставленный багаж»', venue: 'Янтарь холл', long: true,
    topics: ['выставка'], share: null, discussed: false, like: '3',
    mediaHeight: 121.15625,
    medallion: 'yantar-hall',
    frames: [
      [226.3125, 0, 85.359375, 121, 'https://static.kenigevents.ru/p/thumb/v1/ff/ffc155dc083f3e48a1bf0ceb7637b112b535b604fdf5e8c2e8ceecc180fa8940/512.webp', '50% 40%']
    ]
  },
  '7036': {
    owner: 'd87e18f1-dcb4-80a6-8008-8863ffe6002d',
    y: 1023.21875,
    height: 139.6875,
    date: 'с 31 июля', status: 'Откроется через 8 дней',
    title: 'КАЛИНИНГРАД СИТИ ДА БИСТРО ЯНТАРЬ', venue: 'Центральный парк', long: true,
    topics: ['искусство'], share: null, discussed: false, like: '0',
    mediaHeight: 121.15625,
    frames: [
      [161.28125, 0, 215.40625, 121, 'https://static.kenigevents.ru/p/thumb/v1/0d/0d9eb2d73aafa159b15df813a22eedba8217c98daaf7feb580f1b9b9cb302d44/256.webp', '50% 50%']
    ]
  }
};

const componentById = (penpot, id) => penpot.library.local.components.find(component => component.id === id);
const componentByIdentity = (penpot, path, name) => penpot.library.local.components.find(component => component.path === path && component.name === name);

function assertContext(penpot) {
  if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
    throw new Error('open settled 63.10 before the Exhibitions desktop-row phase');
  }
}

function assertMasterContext(penpot) {
  if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== MASTER_PAGE_ID) {
    throw new Error('open settled 40.5 before the ExhibitionRow master phase');
  }
}

function place(penpotUtils, shape, x, y, width, height) {
  if (shape.layoutChild) shape.layoutChild.absolute = true;
  shape.resize(width, height);
  penpotUtils.setParentXY(shape, x, y);
  return shape;
}

function walk(root) {
  const result = [];
  const queue = [root];
  while (queue.length) {
    const shape = queue.shift();
    result.push(shape);
    if (shape.children) queue.push(...shape.children);
  }
  return result;
}

function byName(root, pattern) {
  const shape = walk(root).find(candidate => pattern.test(candidate.name || ''));
  if (!shape) throw new Error(`missing descendant ${pattern}`);
  return shape;
}

function textByName(root, name) {
  const shape = walk(root).find(candidate => candidate.type === 'text' && candidate.name === name);
  if (!shape) throw new Error(`missing text ${name}`);
  return shape;
}

function styleText(shape, characters, size, weight, lineHeight, color) {
  shape.characters = characters;
  shape.fontFamily = 'Inter';
  shape.fontStyle = 'normal';
  shape.fontSize = String(size);
  shape.fontWeight = String(weight);
  shape.lineHeight = String(lineHeight);
  shape.letterSpacing = '0';
  shape.fills = [{ fillColor: color, fillOpacity: 1 }];
  return shape;
}

async function ensureDesktopDeck(penpot, penpotUtils, eventId) {
  assertContext(penpot);
  const spec = ROWS[eventId];
  if (!spec) throw new Error(`unknown fixture ${eventId}`);
  const name = deckName(eventId);
  const existing = componentByIdentity(penpot, DECK_PATH, name);
  if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };

  const media = [];
  for (let index = 0; index < spec.frames.length; index += 1) {
    media.push(await penpot.uploadMediaUrl(`event.real.${eventId} / desktop / slot=${index}`, spec.frames[index][4]));
  }

  const deck = penpot.createBoard();
  deck.name = `${DECK_PATH} / ${name}`;
  deck.fills = [];
  deck.clipContent = true;
  deck.borderRadius = 8;
  const ordinal = Object.keys(ROWS).indexOf(eventId);
  place(penpotUtils, deck, 1800, 2380 + ordinal * 145, 537.59375, spec.mediaHeight);

  for (let index = 0; index < spec.frames.length; index += 1) {
    const [x, y, width, height, , objectPosition] = spec.frames[index];
    const frame = penpot.createBoard();
    frame.name = `EventMediaFrame / event.real.${eventId} / slot=${index} / static-first-state`;
    frame.fills = [{ fillColor: '#0b0d0e', fillOpacity: 1 }];
    frame.strokes = [{ strokeColor: '#dce5ec', strokeOpacity: 0.62, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
    frame.borderRadius = 8;
    frame.clipContent = true;
    deck.appendChild(frame);
    place(penpotUtils, frame, x, y, width, height);

    const image = penpot.createRectangle();
    image.name = `media / source-bound / event.real.${eventId} / slot=${index} / object-position=${objectPosition}`;
    image.fills = [{ fillImage: media[index], fillOpacity: 1 }];
    image.borderRadius = 7;
    frame.appendChild(image);
    place(penpotUtils, image, 1, 1, width - 2, height - 2);
  }

  if (spec.medallion === 'yantar-hall') {
    const artwork = componentById(penpot, YANTAR_ARTWORK_COMPONENT_ID);
    if (!artwork) throw new Error('missing certified yantar-hall medallion artwork');
    const medallion = artwork.instance();
    medallion.name = 'linked Medallion / Artwork / yantar-hall / consumer=exhibition-overlay44';
    deck.appendChild(medallion);
    place(penpotUtils, medallion, 8, 8, 44, 44);
  }

  const component = penpot.library.local.createComponent([deck]);
  return { existing: false, id: component.id, main: component.mainInstance().id, media: media.map(item => item.id) };
}

function applyDesktopMasterGeometry(penpot, penpotUtils) {
  assertMasterContext(penpot);
  const component = componentById(penpot, ROW_COMPONENT_ID);
  const main = component?.mainInstance();
  if (!main?.isComponentMainInstance()) throw new Error('ExhibitionRow main missing');
  main.resize(1194, 140.390625);

  place(penpotUtils, byName(main, /^Surface \/ Exhibition row$/), 120.59375, -1, 1074.40625, 142.390625);
  place(penpotUtils, byName(main, /^linked LifecycleRailStatus/), 0, 9.265625, 112, 121.859375);
  place(penpotUtils, byName(main, /^linked ExhibitionDeck/), 131.1875, 9.265625, 537.59375, 121.859375);
  place(penpotUtils, byName(main, /^Content \/ Event title$/), 687.96875, 12.453125, 377.96875, 39.71875);
  place(penpotUtils, byName(main, /^Content \/ Event venue$/), 687.96875, 56.640625, 377.96875, 18.09375);
  place(penpotUtils, byName(main, /^linked ReasonChip \/ new/), 687.96875, 79.203125, 49.3125, 19.78125);
  place(penpotUtils, byName(main, /^linked ReasonChip \/ opening-soon/), 741.75, 79.203125, 114.375, 19.78125);

  const topicOne = byName(main, /^State slot \/ Topic tag \/|^State slot \/ Topic tag 1/);
  topicOne.name = 'State slot / Topic tag 1 / optional';
  place(penpotUtils, topicOne, 687.96875, 107.453125, 68.8125, 19.78125);
  let topicTwo = [...main.children].find(shape => shape.name === 'State slot / Topic tag 2 / optional');
  if (!topicTwo) {
    const topicComponent = componentById(penpot, TOPIC_COMPONENT_ID);
    if (!topicComponent) throw new Error('Topic tag component missing');
    topicTwo = topicComponent.instance();
    topicTwo.name = 'State slot / Topic tag 2 / optional';
    topicTwo.hidden = true;
    main.appendChild(topicTwo);
  }
  place(penpotUtils, topicTwo, 761.25, 107.453125, 92.46875, 19.78125);

  place(penpotUtils, byName(main, /^State slot \/ Share proof/), 687.96875, 112.171875, 126, 15.765625);
  place(penpotUtils, byName(main, /^State slot \/ Discussed/), 1090.125, 35.3125, 93, 15.765625);
  place(penpotUtils, byName(main, /^linked LikeWithCount/), 1085.53125, 46.84375, 46, 46);

  const reject = byName(main, /^linked RejectAction|^linked Exhibition action \/ Reject compact/);
  const compactReject = componentById(penpot, REJECT_COMPONENT_ID);
  if (!compactReject) throw new Error('context-neutral compact Reject component missing');
  if (reject.component()?.id !== compactReject.id) reject.swapComponent(compactReject);
  reject.name = 'linked Exhibition action / Reject compact / tone=on-dark';
  place(penpotUtils, reject, 1137.125, 46.84375, 46, 46);

  return {
    component: { id: component.id, path: component.path, name: component.name },
    main: { id: main.id, width: main.width, height: main.height, children: main.children.length },
    validate: penpot.currentFile.validate()
  };
}

function configureTopic(penpotUtils, root, value, x, width, visible) {
  root.hidden = !visible;
  if (!visible) return;
  root.name = `linked Exhibition topic / ${value}`;
  root.fills = [{ fillColor: '#211c2b', fillOpacity: 1 }];
  root.strokes = [];
  root.borderRadius = 3;
  place(penpotUtils, root, x, 107.453125, width, 19.78125);
  const label = textByName(root, 'Label / instance content');
  styleText(label, value, 10.56, 700, 1.23, '#c2a6fa');
  place(penpotUtils, label, 0, 3.2, width, 13.38125);
}

function applyDesktopOwner(penpot, penpotUtils, eventId) {
  assertContext(penpot);
  const spec = ROWS[eventId];
  if (!spec) throw new Error(`unknown fixture ${eventId}`);
  const board = penpot.currentPage.getShapeById(OWNER_BOARD_ID);
  const owner = penpot.currentPage.getShapeById(spec.owner);
  const deckComponent = componentByIdentity(penpot, DECK_PATH, deckName(eventId));
  if (!board || !owner?.isComponentCopyInstance() || owner.component()?.id !== ROW_COMPONENT_ID || !deckComponent) {
    throw new Error(`owner/deck binding missing for ${eventId}`);
  }

  owner.resetOverrides();
  owner.name = `linked ExhibitionRow / event.real.${eventId}`;
  place(penpotUtils, owner, 54, spec.y, 1194, 140.390625);

  const rail = byName(owner, /^linked LifecycleRailStatus/);
  place(penpotUtils, rail, 0, 9.265625, 112, spec.mediaHeight);
  const date = textByName(rail, 'Date / instance content');
  // Astro uses variable-font weight 820; Penpot's installed Inter exposes the
  // nearest supported static weight, 800.
  styleText(date, spec.date, 12.8, 800, 1.1, '#f4f4f2');
  place(penpotUtils, date, 12, 12, 100, 14.0625);
  const status = textByName(rail, 'Status / lifecycle derived');
  styleText(status, spec.status, 11.2, 400, 1.45, '#a8adb2');
  place(penpotUtils, status, 12, 29.25, 100, 32.46875);

  const deck = byName(owner, /^linked ExhibitionDeck/);
  if (deck.component()?.id !== deckComponent.id) deck.swapComponent(deckComponent);
  deck.name = `linked Exhibition media deck / event.real.${eventId} / static-first-state`;
  place(penpotUtils, deck, 131.1875, 9.265625, 537.59375, spec.mediaHeight);

  const title = byName(owner, /^Content \/ Event title$/);
  styleText(title, spec.title, 17.28, 800, 1.15, '#f4f4f2');
  place(penpotUtils, title, 687.96875, 12.453125, 377.96875, spec.long ? 39.71875 : 19.859375);
  const venue = byName(owner, /^Content \/ Event venue$/);
  styleText(venue, spec.venue, 12.48, 400, 1.45, '#a8adb2');
  place(penpotUtils, venue, 687.96875, spec.long ? 56.640625 : 36.78125, 377.96875, 18.09375);

  const reasonY = spec.long ? 79.203125 : 59.34375;
  place(penpotUtils, byName(owner, /^linked ReasonChip \/ new/), 687.96875, reasonY, 49.3125, 19.78125);
  place(penpotUtils, byName(owner, /^linked ReasonChip \/ opening-soon/), 741.75, reasonY, 114.375, 19.78125);

  const topicY = spec.long ? 107.453125 : 87.59375;
  const topicOne = byName(owner, /^State slot \/ Topic tag 1/);
  configureTopic(penpotUtils, topicOne, spec.topics[0], 687.96875, spec.topics[0] === 'искусство' ? 72.375 : 68.8125, true);
  penpotUtils.setParentXY(topicOne, 687.96875, topicY);
  const topicTwo = byName(owner, /^State slot \/ Topic tag 2/);
  configureTopic(penpotUtils, topicTwo, spec.topics[1] || '', 761.25, 92.46875, Boolean(spec.topics[1]));
  if (spec.topics[1]) penpotUtils.setParentXY(topicTwo, 761.25, topicY);

  const share = byName(owner, /^State slot \/ Share proof/);
  share.hidden = !spec.share;
  if (spec.share) {
    share.name = `linked Social proof / Share / count=${spec.share[0]}`;
    place(penpotUtils, share, 687.96875, 112.171875, 126, 15.765625);
    styleText(textByName(share, 'Count / instance content'), spec.share[0], 11.2, 700, 1.1, '#a8adb2');
    styleText(textByName(share, 'Noun / derived by count'), spec.share[1], 11.2, 400, 1.25, '#a8adb2');
  }

  const discussed = byName(owner, /^State slot \/ Discussed/);
  discussed.hidden = !spec.discussed;
  if (spec.discussed) {
    discussed.name = 'linked Exhibition signal / Discussed / compact';
    place(penpotUtils, discussed, 1090.125, 35.3125, 93, 15.765625);
  }

  const actionY = spec.discussed ? 59.078125 : 46.84375;
  const like = byName(owner, /^linked LikeWithCount/);
  like.name = `linked Social proof / Like / count=${spec.like}`;
  styleText(textByName(like, 'Count / aggregate source'), spec.like, 10.24, 700, 1.17, '#a8adb2');
  place(penpotUtils, like, 1085.53125, actionY, 46, 46);
  const reject = byName(owner, /^linked Exhibition action \/ Reject compact/);
  place(penpotUtils, reject, 1137.125, actionY, 46, 46);

  return {
    eventId,
    board: { id: board.id, width: board.width, height: board.height },
    owner: { id: owner.id, name: owner.name, x: owner.x - board.x, y: owner.y - board.y, width: owner.width, height: owner.height, component: owner.component()?.id },
    deck: { id: deck.id, component: deck.component()?.id },
    linkedChildren: owner.children.filter(shape => shape.isComponentCopyInstance?.()).length,
    validate: penpot.currentFile.validate()
  };
}

function readBackDesktopOwners(penpot) {
  assertContext(penpot);
  return Object.entries(ROWS).map(([eventId, spec]) => {
    const owner = penpot.currentPage.getShapeById(spec.owner);
    if (!owner) return { eventId, missing: true };
    const names = owner.children.map(shape => shape.name);
    return {
      eventId,
      id: owner.id,
      name: owner.name,
      x: owner.x,
      y: owner.y,
      width: owner.width,
      height: owner.height,
      component: owner.component()?.id,
      deck: owner.children.find(shape => /^linked Exhibition media deck/.test(shape.name || ''))?.component()?.id || null,
      hasTopic2: names.some(name => /^linked Exhibition topic \/ краеведение/.test(name || '')),
      validation: penpot.currentFile.validate()
    };
  });
}

if (typeof module !== 'undefined') module.exports = {
  ensureDesktopDeck,
  applyDesktopMasterGeometry,
  applyDesktopOwner,
  readBackDesktopOwners
};

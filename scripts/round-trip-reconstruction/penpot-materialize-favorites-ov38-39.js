/**
 * OV-38/39 Favorites local-only populated source state.
 *
 * Uses the three current Astro future-event fixtures in their real order:
 * event.real.7030 calendar saved, then event.real.7006 and event.real.6947
 * liked. Cards remain linked through the source-exact EventCard adapters.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880d209a7fcd';
const DESKTOP_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880d2c628515';
const MOBILE_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880d3512f2f7';
const DESKTOP_HEADER_ID = 'a21f5e36-5d76-8065-8008-86ae4bdf9963';
const MOBILE_HEADER_ID = 'a21f5e36-5d76-8065-8008-86aebfc67027';
const MOBILE_NAV_ID = 'a21f5e36-5d76-8065-8008-86aec0a54bb5';
const FOOTER_VIEWPORT_ID = 'd87e18f1-dcb4-80a6-8008-885914f2be1b';
const FAVORITES_DESKTOP_HEADER_ID = 'd87e18f1-dcb4-80a6-8008-8865590f45af';
const FAVORITES_MOBILE_HEADER_ID = 'd87e18f1-dcb4-80a6-8008-88655996bf2a';
const IDENTITY_DESKTOP_ID = 'd87e18f1-dcb4-80a6-8008-88655a5b3783';
const IDENTITY_MOBILE_ID = 'd87e18f1-dcb4-80a6-8008-88655b0c047b';
const CARD_DESKTOP = {
  7030: '8f804431-c282-8075-8008-8dcf952bc4bb',
  7006: '8f804431-c282-8075-8008-8dcfba2a1afb',
  6947: '8f804431-c282-8075-8008-8dcfa2365ea2',
};
const CARD_MOBILE = {
  7030: '8f804431-c282-8075-8008-8dcfd8d7353c',
  7006: '8f804431-c282-8075-8008-8dd1aad61572',
  6947: '8f804431-c282-8075-8008-8dd021bd6414',
};
const DESKTOP_PATH = 'Favorites / Saved events / source exact';
const DESKTOP_NAME = 'viewport=desktop;state=local-only-with-items;fixtures=7030,7006,6947';
const MOBILE_PATH = 'Favorites / Saved events / source exact';
const MOBILE_NAME = 'viewport=mobile;state=local-only-with-items;fixtures=7030,7006,6947';

function installFavoritesOv3839Materializer(penpot, penpotUtils, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Favorites page ${PAGE_ID}`);
    }
  };
  const componentById = (id) => penpot.library.local.components.find((component) => component.id === id);
  const componentByIdentity = (path, name) => penpot.library.local.components.find(
    (component) => component.path === path && component.name === name,
  );
  const place = (shape, x, y, width, height) => {
    if (shape.layoutChild) shape.layoutChild.absolute = true;
    if (width != null && height != null) shape.resize(width, height);
    penpotUtils.setParentXY(shape, x, y);
    return shape;
  };
  const board = (parent, name, x, y, width, height, color = null, radius = 0, clip = false) => {
    const shape = penpot.createBoard();
    shape.name = name;
    shape.fills = color ? [{ fillColor: color, fillOpacity: 1 }] : [];
    shape.strokes = [];
    shape.borderRadius = radius;
    shape.clipContent = clip;
    if (parent) parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const rectangle = (parent, name, x, y, width, height, color, radius = 0) => {
    const shape = penpot.createRectangle();
    shape.name = name;
    shape.fills = [{ fillColor: color, fillOpacity: 1 }];
    shape.strokes = [];
    shape.borderRadius = radius;
    parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const text = (parent, name, characters, x, y, width, height, size, weight, lineHeight, color, align = 'left') => {
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
    return place(shape, x, y, width, height);
  };
  const linked = (id, name) => {
    const component = componentById(id);
    if (!component) throw new Error(`missing linked component ${id}`);
    const instance = component.instance();
    instance.name = name;
    return instance;
  };
  const createComponent = (root) => penpot.library.local.createComponent([root]);
  const calendarOverlay = (parent, x, y, width, active) => {
    const action = board(parent, active ? 'Calendar action / saved' : 'Calendar action / available', x, y, width, 44, active ? '#3b3531' : '#fffaf2', 22);
    action.strokes = [{ strokeColor: active ? '#3b3531' : '#d9c9bc', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
    text(action, 'Calendar icon', '▣', 12, 12, 20, 20, 14, 800, 1, active ? '#fffaf2' : '#3a2a22', 'center');
    text(action, 'Calendar label', active ? 'Добавлено' : 'В календарь', 34, 12, width - 42, 20, 13, 900, 1, active ? '#fffaf2' : '#3a2a22', 'center');
    return action;
  };

  function ensureDesktopState() {
    assertContext();
    const existing = componentByIdentity(DESKTOP_PATH, DESKTOP_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${DESKTOP_PATH} / ${DESKTOP_NAME}`, 1800, 0, 1180, 810, null, 0, false);
      text(root, 'Favorites local status', 'Показаны сохранения и лайки с этого устройства.', 0, 0, 760, 26, 16, 800, 1.2, '#6f625a');
      const specs = [
        ['7030', 0, true, 'calendar'],
        ['7006', 400, false, 'like'],
        ['6947', 800, false, 'like'],
      ];
      specs.forEach(([id, x, active, source]) => {
        const frame = board(root, `Saved event / event.real.${id} / source=${source}`, x, 42, 380, 765.65625, null, 0, true);
        const card = linked(CARD_DESKTOP[id], `linked EventCard / event.real.${id} / favorites / desktop`);
        frame.appendChild(card); place(card, 0, 0, 380, 765.65625);
        calendarOverlay(frame, 224, 640, 144, active);
      });
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, cards: specs.map(([id]) => CARD_DESKTOP[id]) };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensureMobileState() {
    assertContext();
    const existing = componentByIdentity(MOBILE_PATH, MOBILE_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${MOBILE_PATH} / ${MOBILE_NAME}`, 3020, 0, 366, 1914, null, 0, false);
      text(root, 'Favorites local status', 'Показаны сохранения и лайки с этого устройства.', 0, 0, 366, 52, 15, 800, 1.35, '#6f625a');
      const specs = [
        ['7030', 68, 481.515625, true, 'calendar'],
        ['7006', 563, 738.078125, false, 'like'],
        ['6947', 1315, 598.421875, false, 'like'],
      ];
      specs.forEach(([id, y, height, active, source]) => {
        const frame = board(root, `Saved event / event.real.${id} / source=${source}`, 0, y, 366, height, null, 0, true);
        const card = linked(CARD_MOBILE[id], `linked EventCard / event.real.${id} / favorites / mobile`);
        frame.appendChild(card); place(card, 0, 0, 366, height);
        calendarOverlay(frame, 188, height - 62, 166, active);
      });
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, cards: specs.map(([id]) => CARD_MOBILE[id]) };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  const replaceChildren = (root) => [...root.children].forEach((child) => child.remove());

  function repairOwners() {
    assertContext();
    const desktopState = componentByIdentity(DESKTOP_PATH, DESKTOP_NAME);
    const mobileState = componentByIdentity(MOBILE_PATH, MOBILE_NAME);
    if (!desktopState || !mobileState) throw new Error('create both source states first');
    const desktopOwner = componentById(DESKTOP_OWNER_ID);
    const mobileOwner = componentById(MOBILE_OWNER_ID);
    if (!desktopOwner || !mobileOwner) throw new Error('Favorites owner components missing');
    const block = penpot.history.undoBlockBegin();
    try {
      const desktop = desktopOwner.mainInstance();
      replaceChildren(desktop);
      desktopOwner.name = 'viewport=desktop;state=local-only-with-items · Astro source exact';
      desktop.name = 'Archetype / Favorites / viewport=desktop;state=local-only-with-items · Astro source exact';
      desktop.resize(1280, 2288);
      const dh = linked(DESKTOP_HEADER_ID, 'linked Shell / Desktop header'); desktop.appendChild(dh); place(dh, 0, 0, 1280, 57);
      const fh = linked(FAVORITES_DESKTOP_HEADER_ID, 'linked Favorites / Header / desktop'); desktop.appendChild(fh); place(fh, 50, 140, 736, 260);
      const gate = linked(IDENTITY_DESKTOP_ID, 'linked Favorites / Identity gate / desktop anonymous'); desktop.appendChild(gate); place(gate, 50, 390, 736, 264);
      const state = desktopState.instance(); state.name = 'linked Favorites / local-only-with-items / desktop / 7030,7006,6947'; desktop.appendChild(state); place(state, 50, 671, 1180, 810);
      const footer = linked(FOOTER_VIEWPORT_ID, 'linked Shell / Desktop footer viewport'); desktop.appendChild(footer); place(footer, 0, 1606, 1280, 681.859375);

      const mobile = mobileOwner.mainInstance();
      replaceChildren(mobile);
      mobileOwner.name = 'viewport=mobile;state=local-only-with-items · Astro source exact';
      mobile.name = 'Archetype / Favorites / viewport=mobile;state=local-only-with-items · Astro source exact';
      mobile.resize(390, 2742);
      const mh = linked(MOBILE_HEADER_ID, 'linked Shell / Mobile header'); mobile.appendChild(mh); place(mh, 0, 0, 390, 84);
      const mfh = linked(FAVORITES_MOBILE_HEADER_ID, 'linked Favorites / Header / mobile'); mobile.appendChild(mfh); place(mfh, 12, 96, 366, 190);
      const mgate = linked(IDENTITY_MOBILE_ID, 'linked Favorites / Identity gate / mobile anonymous'); mobile.appendChild(mgate); place(mgate, 12, 298, 366, 284);
      const mstate = mobileState.instance(); mstate.name = 'linked Favorites / local-only-with-items / mobile / 7030,7006,6947'; mobile.appendChild(mstate); place(mstate, 12, 598, 366, 1914);
      const nav = linked(MOBILE_NAV_ID, 'linked Shell / Mobile bottom navigation'); mobile.appendChild(nav); place(nav, 0, 2678, 390, 64);
      return { desktop: { id: desktopOwner.id, main: desktop.id, size: [desktop.width, desktop.height] }, mobile: { id: mobileOwner.id, main: mobile.id, size: [mobile.width, mobile.height] } };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function readback() {
    assertContext();
    const ids = [DESKTOP_OWNER_ID, MOBILE_OWNER_ID];
    return {
      owners: ids.map((id) => {
        const component = componentById(id);
        const main = component.mainInstance();
        return { id, name: component.name, main: main.id, width: main.width, height: main.height, direct: [...main.children].map((shape) => ({ name: shape.name, x: shape.x - main.x, y: shape.y - main.y, width: shape.width, height: shape.height, componentId: shape.component?.()?.id || null })) };
      }),
      states: [[DESKTOP_PATH, DESKTOP_NAME], [MOBILE_PATH, MOBILE_NAME]].map(([path, name]) => {
        const component = componentByIdentity(path, name); const main = component?.mainInstance();
        return component ? { id: component.id, main: main.id, width: main.width, height: main.height, linkedCards: [...main.children].filter((shape) => shape.name.startsWith('Saved event /')).flatMap((shape) => [...shape.children].map((child) => child.component?.()?.id).filter(Boolean)) } : { missing: true };
      }),
      validation: await penpot.currentFile.validate(),
    };
  }

  storage.favoritesOv3839 = { ensureDesktopState, ensureMobileState, repairOwners, readback };
  return { installed: true, methods: Object.keys(storage.favoritesOv3839) };
}

if (typeof module !== 'undefined') {
  module.exports = { installFavoritesOv3839Materializer, constants: { FILE_ID, PAGE_ID, DESKTOP_OWNER_ID, MOBILE_OWNER_ID, CARD_DESKTOP, CARD_MOBILE } };
}

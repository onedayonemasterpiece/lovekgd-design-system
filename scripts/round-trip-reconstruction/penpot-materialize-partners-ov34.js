/**
 * OV-34 Partners source-exact reconstruction.
 *
 * Replaces the speculative /partnerstvo/ funnel with the factual current
 * Astro /partners/ route: one heading and six linked partner marks.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880fb747d10c';
const ASTRO_COMMIT = '49c351873d40a2ea55f0a32837c7376e344d9c17';
const DESKTOP_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880fbf1c9f86';
const MOBILE_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880fc166e598';
const DESKTOP_HEADER_ID = 'a21f5e36-5d76-8065-8008-86ae4bdf9963';
const MOBILE_HEADER_ID = 'a21f5e36-5d76-8065-8008-86aebfc67027';
const MOBILE_NAV_ID = 'a21f5e36-5d76-8065-8008-86aec0a54bb5';
const FOOTER_VIEWPORT_ID = 'd87e18f1-dcb4-80a6-8008-885914f2be1b';
const BODY_PATH = 'Information / Partners source exact';
const DESKTOP_BODY_NAME = 'viewport=desktop;route=partners;fixtures=6';
const MOBILE_BODY_NAME = 'viewport=mobile;route=partners;fixtures=6';
const RAW = `https://raw.githubusercontent.com/onedayonemasterpiece/events-bot-new/${ASTRO_COMMIT}/site/public/assets/partners`;
const MEDIA = {
  kppk: `${RAW}/kppk-rzd-red.svg`,
  znanie: `${RAW}/znanie-russia.svg`,
  kgd80: `${RAW}/kgd80.svg`,
  kantata: `${RAW}/kantata-education.png`,
  act: `${RAW}/act-opus.png`,
  icae: `${RAW}/icae-kaliningrad.svg`,
};
const DEPRECATED_IDS = [
  'd87e18f1-dcb4-80a6-8008-886b2e8535b2',
  'd87e18f1-dcb4-80a6-8008-886b2fabdd56',
  'd87e18f1-dcb4-80a6-8008-886b303acd28',
  'd87e18f1-dcb4-80a6-8008-886b30d4e74e',
  'd87e18f1-dcb4-80a6-8008-886b3279f96a',
  'd87e18f1-dcb4-80a6-8008-886b34b35880',
];

function installPartnersOv34Materializer(penpot, penpotUtils, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Information pages ${PAGE_ID}`);
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
  const board = (parent, name, x, y, width, height, color = null) => {
    const shape = penpot.createBoard();
    shape.name = name;
    shape.fills = color ? [{ fillColor: color, fillOpacity: 1 }] : [];
    shape.strokes = [];
    shape.clipContent = false;
    if (parent) parent.appendChild(shape);
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
  const image = (parent, name, media, x, y, width, height) => {
    const shape = penpot.createRectangle();
    shape.name = name;
    shape.fills = [{ fillImage: media, fillOpacity: 1 }];
    shape.strokes = [];
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
  const replaceChildren = (root) => [...root.children].forEach((child) => child.remove());

  async function ensureMedia() {
    assertContext();
    if (storage.partnersOv34Media) return storage.partnersOv34Media;
    const uploaded = {};
    for (const [key, url] of Object.entries(MEDIA)) {
      uploaded[key] = await penpot.uploadMediaUrl(`OV34 partner ${key} · Astro ${ASTRO_COMMIT.slice(0, 8)}`, url);
    }
    storage.partnersOv34Media = uploaded;
    return uploaded;
  }

  function heading(parent, mobile) {
    if (mobile) {
      text(parent, 'Eyebrow / Партнёры', 'ПАРТНЁРЫ', 24.796875, 5.59375, 180, 15, 12, 800, 1.1, '#6d6259');
      text(parent, 'H1 / factual route title', 'Партнёры\nПолюбить\nКалининград\nАнонсы', 24.796875, 28, 340.40625, 120, 32, 900, 0.98, '#221a14');
      text(parent, 'Lead / factual behavior', 'Логотипы ведут на сайты партнёров.', 24.796875, 160, 340.40625, 20, 15, 400, 1.25, '#6d6259');
      return;
    }
    text(parent, 'Eyebrow / Партнёры', 'ПАРТНЁРЫ', 90, 37.59375, 180, 16, 12, 800, 1.1, '#6d6259');
    text(parent, 'H1 / factual route title', 'Партнёры Полюбить Калининград\nАнонсы', 90, 60, 1000, 92, 47, 900, 0.98, '#221a14');
    text(parent, 'Lead / factual behavior', 'Логотипы ведут на сайты партнёров.', 90, 157, 576, 22, 16, 400, 1.25, '#6d6259');
  }

  async function ensureDesktopBody() {
    assertContext();
    const existing = componentByIdentity(BODY_PATH, DESKTOP_BODY_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const media = await ensureMedia();
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${BODY_PATH} / ${DESKTOP_BODY_NAME}`, 1810, 0, 1280, 569, '#fbf7ef');
      heading(root, false);
      image(root, 'Partner / kgd80 / logo', media.kgd80, 153.484375, 219.890625, 129.40625, 112);
      text(root, 'Partner / kgd80 / caption', 'Просветительский фестиваль к 80-\nлетию Калининградской области', 90, 343.375, 256.390625, 26, 12.16, 600, 1.05, '#6d6259', 'center');
      image(root, 'Partner / znanie-russia / logo', media.znanie, 520, 218.421875, 239.96875, 55.890625);
      image(root, 'Partner / kppk-rzd / logo', media.kppk, 1015.796875, 207.25, 92, 50);
      text(root, 'Partner / kppk-rzd / caption', 'АО «КППК»', 1022.65625, 264.109375, 78.265625, 13, 12.16, 600, 1.05, '#6d6259', 'center');
      image(root, 'Partner / kantata / logo', media.kantata, 483.15625, 310.515625, 173.0625, 50);
      text(root, 'Partner / kantata / caption', 'Образовательная программа фестиваля', 430.75, 370.375, 277.875, 13, 12.16, 600, 1.05, '#6d6259', 'center');
      image(root, 'Partner / act-opus / logo', media.act, 881.921875, 323.640625, 219.125, 56);
      image(root, 'Partner / icae-kaliningrad / logo', media.icae, 520.03125, 436.078125, 239.9375, 41.65625);
      const component = penpot.library.local.createComponent([root]);
      component.path = BODY_PATH;
      component.name = DESKTOP_BODY_NAME;
      return { existing: false, id: component.id, main: component.mainInstance().id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function ensureMobileBody() {
    assertContext();
    const existing = componentByIdentity(BODY_PATH, MOBILE_BODY_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const media = await ensureMedia();
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${BODY_PATH} / ${MOBILE_BODY_NAME}`, 3130, 0, 390, 696, '#fbf7ef');
      heading(root, true);
      image(root, 'Partner / kgd80 / logo', media.kgd80, 47.34375, 201.578125, 120.15625, 104);
      text(root, 'Partner / kgd80 / caption', 'Просветительский\nфестиваль к 80-летию\nКалининградской\nобласти', 30.625, 306.96875, 153.59375, 44, 10.4, 600, 1.05, '#6d6259', 'center');
      image(root, 'Partner / znanie-russia / logo', media.znanie, 199.953125, 212.21875, 165.234375, 38.484375);
      image(root, 'Partner / act-opus / logo', media.act, 199.96875, 298.828125, 165.203125, 42.21875);
      image(root, 'Partner / kantata / logo', media.kantata, 31.265625, 370.296875, 152.296875, 44);
      text(root, 'Partner / kantata / caption', 'Образовательная\nпрограмма фестиваля', 24.796875, 420.484375, 165.25, 22, 10.4, 600, 1.05, '#6d6259', 'center');
      image(root, 'Partner / kppk-rzd / logo', media.kppk, 247.578125, 371.890625, 70, 42.765625);
      text(root, 'Partner / kppk-rzd / caption', 'АО «КППК»', 249.125, 426.046875, 66.90625, 11, 10.4, 600, 1.05, '#6d6259', 'center');
      image(root, 'Partner / icae-kaliningrad / logo', media.icae, 75.03125, 476.046875, 239.9375, 41.65625);
      const component = penpot.library.local.createComponent([root]);
      component.path = BODY_PATH;
      component.name = MOBILE_BODY_NAME;
      return { existing: false, id: component.id, main: component.mainInstance().id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function repairOwners() {
    assertContext();
    const desktopBody = componentByIdentity(BODY_PATH, DESKTOP_BODY_NAME);
    const mobileBody = componentByIdentity(BODY_PATH, MOBILE_BODY_NAME);
    const desktopOwner = componentById(DESKTOP_OWNER_ID);
    const mobileOwner = componentById(MOBILE_OWNER_ID);
    if (!desktopBody || !mobileBody || !desktopOwner || !mobileOwner) throw new Error('OV34 bodies or owner components missing');
    const block = penpot.history.undoBlockBegin();
    try {
      const desktop = desktopOwner.mainInstance();
      replaceChildren(desktop);
      desktopOwner.name = 'viewport=desktop;route=partners;fixtures=6 · Astro source exact';
      desktop.name = 'Archetype / Information pages / viewport=desktop;route=partners;fixtures=6 · Astro source exact';
      desktop.fills = [{ fillColor: '#fbf7ef', fillOpacity: 1 }];
      desktop.resize(1280, 1308);
      const dh = linked(DESKTOP_HEADER_ID, 'linked Shell / Desktop header'); desktop.appendChild(dh); place(dh, 0, 0, 1280, 57);
      const db = desktopBody.instance(); db.name = 'linked Information / Partners source exact / desktop / fixtures=6'; desktop.appendChild(db); place(db, 0, 57, 1280, 569);
      const footer = linked(FOOTER_VIEWPORT_ID, 'linked Shell / Desktop footer viewport'); desktop.appendChild(footer); place(footer, 0, 626, 1280, 681.859375);

      const mobile = mobileOwner.mainInstance();
      replaceChildren(mobile);
      mobileOwner.name = 'viewport=mobile;route=partners;fixtures=6 · Astro source exact';
      mobile.name = 'Archetype / Information pages / viewport=mobile;route=partners;fixtures=6 · Astro source exact';
      mobile.fills = [{ fillColor: '#fbf7ef', fillOpacity: 1 }];
      mobile.resize(390, 844);
      const mh = linked(MOBILE_HEADER_ID, 'linked Shell / Mobile header'); mobile.appendChild(mh); place(mh, 0, 0, 390, 84);
      const mb = mobileBody.instance(); mb.name = 'linked Information / Partners source exact / mobile / fixtures=6'; mobile.appendChild(mb); place(mb, 0, 84, 390, 696);
      const nav = linked(MOBILE_NAV_ID, 'linked Shell / Mobile bottom navigation'); mobile.appendChild(nav); place(nav, 0, 780, 390, 64);

      const deprecated = [];
      for (const id of DEPRECATED_IDS) {
        const component = componentById(id);
        if (!component) continue;
        if (!component.name.startsWith('DEPRECATED · OV34')) component.name = `DEPRECATED · OV34 · ${component.name}`;
        const main = component.mainInstance();
        main.hidden = true;
        deprecated.push({ id, main: main.id, name: component.name });
      }
      return { desktop: { id: desktopOwner.id, main: desktop.id }, mobile: { id: mobileOwner.id, main: mobile.id }, deprecated };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function readback() {
    assertContext();
    const owners = [DESKTOP_OWNER_ID, MOBILE_OWNER_ID].map((id) => {
      const component = componentById(id);
      const main = component.mainInstance();
      return {
        id,
        name: component.name,
        main: main.id,
        width: main.width,
        height: main.height,
        direct: [...main.children].map((shape) => ({
          name: shape.name,
          x: shape.x - main.x,
          y: shape.y - main.y,
          width: shape.width,
          height: shape.height,
          componentId: shape.component?.()?.id || null,
        })),
      };
    });
    const bodies = [DESKTOP_BODY_NAME, MOBILE_BODY_NAME].map((name) => {
      const component = componentByIdentity(BODY_PATH, name);
      const main = component?.mainInstance();
      return component ? {
        id: component.id,
        name,
        main: main.id,
        direct: [...main.children].map((shape) => shape.name),
      } : { name, missing: true };
    });
    return { owners, bodies, validation: await penpot.currentFile.validate() };
  }

  storage.partnersOv34 = { ensureMedia, ensureDesktopBody, ensureMobileBody, repairOwners, readback };
  return { installed: true, methods: Object.keys(storage.partnersOv34) };
}

if (typeof module !== 'undefined') {
  module.exports = {
    installPartnersOv34Materializer,
    constants: { FILE_ID, PAGE_ID, ASTRO_COMMIT, DESKTOP_OWNER_ID, MOBILE_OWNER_ID, MEDIA },
  };
}

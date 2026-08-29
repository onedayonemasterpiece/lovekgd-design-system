/**
 * OV-40 Interest clubs source-exact reconciliation.
 *
 * The factual three-card owners were already materialized from Astro. This
 * bounded reconciler removes the stale `state=empty` component identity and
 * reads back the six linked canonical Club card consumers without rebuilding
 * the page.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880cfe1ec779';
const DESKTOP_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880d073401a1';
const MOBILE_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880d0cc8465b';
const CLUB_CARD_ID = 'd87e18f1-dcb4-80a6-8008-88648c204cec';
const DESKTOP_HEADER_ID = 'd87e18f1-dcb4-80a6-8008-8864884b188a';
const MOBILE_HEADER_ID = 'd87e18f1-dcb4-80a6-8008-8864892f5750';
const DESKTOP_HEADER_NAME = 'viewport=desktop;state=ready;catalog=3';
const MOBILE_HEADER_NAME = 'viewport=mobile;state=ready;catalog=3';
const BASE_MOBILE_SHELL_ID = 'a21f5e36-5d76-8065-8008-86aebfc67027';
const BASE_DESKTOP_SHELL_ID = 'a21f5e36-5d76-8065-8008-86ae4bdf9963';
const MOBILE_SHELL_PATH = 'Interest clubs / Mobile shell';
const MOBILE_SHELL_NAME = 'state=ready;catalog=3;shelf=visible';
const DESKTOP_SHELL_PATH = 'Interest clubs / Desktop shell';
const DESKTOP_SHELL_NAME = 'state=ready;active=clubs;catalog=3';
const MOBILE_OWNER_MAIN_ID = 'd87e18f1-dcb4-80a6-8008-880cff1a1193';
const MOBILE_OWNER_SHELL_ID = 'd87e18f1-dcb4-80a6-8008-88648d18681a';
const MOBILE_OWNER_HEADER_ID = 'd87e18f1-dcb4-80a6-8008-88648d2c1b5a';
const MOBILE_OWNER_GRID_ID = 'd87e18f1-dcb4-80a6-8008-88648d4a9273';
const DESKTOP_OWNER_GRID_ID = 'd87e18f1-dcb4-80a6-8008-88648cb927d6';
const DESKTOP_OWNER_SHELL_ID = 'd87e18f1-dcb4-80a6-8008-88648c77d8fe';

const MOBILE_INTRO_TEXT = 'Публичные сообщества Калининградской области, у которых подтверждено несколько встреч в разные даты. Площадка или похожее название сами по себе клубом не считаются.';
const MOBILE_INTRO_LINES = 'Публичные сообщества\nКалининградской области, у которых\nподтверждено несколько встреч в\nразные даты. Площадка или похожее\nназвание сами по себе клубом не\nсчитаются.';

function installInterestClubsOv40Reconciler(penpot, penpotUtils, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Interest clubs page ${PAGE_ID}`);
    }
  };
  const componentById = (id) => penpot.library.local.components.find((component) => component.id === id);
  const componentByIdentity = (path, name) => penpot.library.local.components.find((component) => component.path === path && component.name === name);
  const walk = (shape, result = []) => {
    result.push(shape);
    for (const child of shape.children || []) walk(child, result);
    return result;
  };
  const childByName = (root, name) => (root.children || []).find((shape) => shape.name === name);
  const place = (shape, x, y, width, height) => {
    if (shape.layoutChild) shape.layoutChild.absolute = true;
    shape.resize(width, height);
    penpotUtils.setParentXY(shape, x, y);
    return shape;
  };
  const styleText = (shape, { characters, fontSize, fontWeight, lineHeight, letterSpacing = '0', align = 'left', color }) => {
    shape.characters = characters;
    shape.fontFamily = 'Inter';
    shape.fontStyle = 'normal';
    shape.fontSize = String(fontSize);
    shape.fontWeight = String(fontWeight);
    shape.lineHeight = String(lineHeight);
    shape.letterSpacing = String(letterSpacing);
    shape.align = align;
    shape.fills = [{ fillColor: color, fillOpacity: 1 }];
    return shape;
  };

  function ensureMobileShellReady() {
    assertContext();
    const existing = componentByIdentity(MOBILE_SHELL_PATH, MOBILE_SHELL_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    for (const partial of penpot.currentPage.findShapes({ name: `${MOBILE_SHELL_PATH} / ${MOBILE_SHELL_NAME}` })) {
      if (!partial.isComponentMain && !partial.isComponentCopyInstance?.()) partial.remove();
    }
    const base = componentById(BASE_MOBILE_SHELL_ID);
    if (!base) throw new Error(`missing base mobile shell ${BASE_MOBILE_SHELL_ID}`);
    const block = penpot.history.undoBlockBegin();
    try {
      const root = penpot.createBoard();
      root.name = `${MOBILE_SHELL_PATH} / ${MOBILE_SHELL_NAME}`;
      root.fills = [];
      root.clipContent = false;
      place(root, 1810, 1360, 390, 117);

      const shelf = penpot.createBoard();
      shelf.name = 'Mobile section shelf / source exact';
      shelf.fills = [{ fillColor: '#fffaf2', fillOpacity: 0.97 }];
      shelf.strokes = [{ strokeColor: '#793014', strokeOpacity: 0.14, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      shelf.shadows = [{ color: '#482d19', opacity: 0.07, blur: 16, spread: 0, offsetX: 0, offsetY: 7, style: 'drop-shadow', hidden: false }];
      root.appendChild(shelf);
      place(shelf, 0, 64.8125, 390, 52);

      const title = penpot.createText('Клубы по интересам');
      title.name = 'Shelf title';
      styleText(title, { characters: 'Клубы по интересам', fontSize: 16, fontWeight: 900, lineHeight: 1.1, letterSpacing: '0', color: '#221a14' });
      shelf.appendChild(title);
      place(title, 12, 17.203125, 184.921875, 17.59375);

      const count = penpot.createText('3 в каталоге');
      count.name = 'Shelf count';
      styleText(count, { characters: '3 в каталоге', fontSize: 11.52, fontWeight: 800, lineHeight: 1.6, color: '#793014', align: 'right' });
      shelf.appendChild(count);
      place(count, 294.46875, 16.78125, 83.53125, 18.421875);

      const header = base.instance();
      header.name = 'linked Shell / Mobile header / shelf overlap';
      root.appendChild(header);
      place(header, 0, 0, 390, 84);

      const component = penpot.library.local.createComponent([root]);
      component.path = MOBILE_SHELL_PATH;
      component.name = MOBILE_SHELL_NAME;
      return { existing: false, id: component.id, main: component.mainInstance().id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensureDesktopShellReady() {
    assertContext();
    const existing = componentByIdentity(DESKTOP_SHELL_PATH, DESKTOP_SHELL_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    for (const partial of penpot.currentPage.findShapes({ name: `${DESKTOP_SHELL_PATH} / ${DESKTOP_SHELL_NAME}` })) {
      if (!partial.isComponentMain && !partial.isComponentCopyInstance?.()) partial.remove();
    }
    const base = componentById(BASE_DESKTOP_SHELL_ID);
    if (!base) throw new Error(`missing base desktop shell ${BASE_DESKTOP_SHELL_ID}`);
    const block = penpot.history.undoBlockBegin();
    try {
      const root = penpot.createBoard();
      root.name = `${DESKTOP_SHELL_PATH} / ${DESKTOP_SHELL_NAME}`;
      root.fills = [];
      root.clipContent = false;
      place(root, 1810, 1500, 1280, 57);

      const header = base.instance();
      header.name = 'linked Shell / Desktop header / source brand';
      root.appendChild(header);
      place(header, 0, 0, 1280, 57);

      const navPlane = penpot.createBoard();
      navPlane.name = 'Desktop route navigation / active=clubs';
      navPlane.fills = [{ fillColor: '#fffaf2', fillOpacity: 1 }];
      navPlane.strokes = [{ strokeColor: '#793014', strokeOpacity: 0.12, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      root.appendChild(navPlane);
      place(navPlane, 300, 0, 980, 57);

      const items = [
        ['Сегодня', 31.140625, 99.796875, false],
        ['Завтра', 134.9375, 88.78125, false],
        ['Выходные', 227.71875, 118.546875, false],
        ['Выставки', 350.265625, 110.671875, false],
        ['Фестивали', 464.9375, 121.453125, false],
        ['Популярное', 590.390625, 131.84375, false],
        ['Необычное', 726.234375, 125.203125, false],
        ['Клубы', 855.4375, 86.15625, true],
      ];
      for (const [label, x, width, active] of items) {
        const item = penpot.createBoard();
        item.name = `Route navigation item / ${label}${active ? ' / active' : ''}`;
        item.fills = [];
        navPlane.appendChild(item);
        place(item, x, 6, width, 44);
        const text = penpot.createText(label);
        text.name = 'Label';
        styleText(text, { characters: label, fontSize: 14.24, fontWeight: active ? 800 : 600, lineHeight: 1.1, color: active ? '#98401f' : '#6d6259', align: 'center' });
        item.appendChild(text);
        place(text, 0, 14.168, width, 15.664);
        if (active) {
          const underline = penpot.createRectangle();
          underline.name = 'Active underline';
          underline.fills = [{ fillColor: '#a54821', fillOpacity: 1 }];
          item.appendChild(underline);
          place(underline, 16, 42, width - 32, 2);
        }
      }

      const component = penpot.library.local.createComponent([root]);
      component.path = DESKTOP_SHELL_PATH;
      component.name = DESKTOP_SHELL_NAME;
      return { existing: false, id: component.id, main: component.mainInstance().id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function repairCatalogHeaders() {
    assertContext();
    const block = penpot.history.undoBlockBegin();
    try {
      const desktop = componentById(DESKTOP_HEADER_ID)?.mainInstance();
      const mobile = componentById(MOBILE_HEADER_ID)?.mainInstance();
      if (!desktop || !mobile) throw new Error('Interest clubs catalog header mains are missing');

      place(desktop, desktop.parentX, desktop.parentY, 1180, 402.953125);
      const dEyebrow = childByName(desktop, 'Eyebrow');
      const dTitle = childByName(desktop, 'Title');
      const dDescription = childByName(desktop, 'Description');
      const dChip = childByName(desktop, 'Status chip');
      const dLabel = childByName(desktop, 'Status label');
      if (![dEyebrow, dTitle, dDescription, dChip, dLabel].every(Boolean)) throw new Error('desktop catalog header anatomy is incomplete');
      styleText(dEyebrow, { characters: 'ВСТРЕЧАТЬСЯ ВОКРУГ ОБЩЕГО ДЕЛА', fontSize: 12.48, fontWeight: 800, lineHeight: 1.6, letterSpacing: '1.248', color: '#98401f', align: 'center' });
      place(dEyebrow, 433.953125, 74.59375, 312.09375, 19.96875);
      styleText(dTitle, { characters: 'Клубы по интересам', fontSize: 56.32, fontWeight: 700, lineHeight: 1.05, letterSpacing: '0', color: '#221a14', align: 'center' });
      place(dTitle, 269.671875, 104.15625, 640.65625, 59.125);
      styleText(dDescription, { characters: MOBILE_INTRO_TEXT, fontSize: 18.88, fontWeight: 400, lineHeight: 1.55, color: '#3d3935', align: 'center' });
      place(dDescription, 194.03125, 176.078125, 791.921875, 87.75);
      dChip.fills = [{ fillColor: '#ffffff', fillOpacity: 0.62 }];
      dChip.strokes = [{ strokeColor: '#ffffff', strokeOpacity: 0.88, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      dChip.borderRadius = 999;
      place(dChip, 501.984375, 285.421875, 176.015625, 42.9375);
      styleText(dLabel, { characters: '▥  В каталоге: 3', fontSize: 16, fontWeight: 800, lineHeight: 1.6, color: '#263f43', align: 'center' });
      place(dLabel, 501.984375, 297.421875, 176.015625, 25.6);

      place(mobile, mobile.parentX, mobile.parentY, 366, 372.953125);
      const mEyebrow = childByName(mobile, 'Eyebrow');
      const mTitle = childByName(mobile, 'Title');
      const mDescription = childByName(mobile, 'Description');
      const mChip = childByName(mobile, 'Status chip');
      const mLabel = childByName(mobile, 'Status label');
      if (![mEyebrow, mTitle, mDescription, mChip, mLabel].every(Boolean)) throw new Error('mobile catalog header anatomy is incomplete');
      styleText(mEyebrow, { characters: 'ВСТРЕЧАТЬСЯ ВОКРУГ ОБЩЕГО ДЕЛА', fontSize: 12.48, fontWeight: 800, lineHeight: 1.6, letterSpacing: '1.248', color: '#98401f' });
      place(mEyebrow, 17, 21.796875, 312.09375, 19.96875);
      styleText(mTitle, { characters: 'Клубы по\nинтересам', fontSize: 35.1, fontWeight: 700, lineHeight: 1.05, letterSpacing: '0', color: '#221a14' });
      place(mTitle, 17, 51.359375, 332, 73.6875);
      styleText(mDescription, { characters: MOBILE_INTRO_LINES, fontSize: 16, fontWeight: 400, lineHeight: 1.55, color: '#3d3935' });
      place(mDescription, 17, 137.84375, 332, 148.78125);
      mChip.fills = [{ fillColor: '#ffffff', fillOpacity: 0.62 }];
      mChip.strokes = [{ strokeColor: '#ffffff', strokeOpacity: 0.88, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      mChip.borderRadius = 999;
      place(mChip, 17, 308.21875, 176.015625, 42.9375);
      styleText(mLabel, { characters: '▥  В каталоге: 3', fontSize: 16, fontWeight: 800, lineHeight: 1.6, color: '#263f43', align: 'center' });
      place(mLabel, 17, 320.21875, 176.015625, 25.6);
      return { desktop: desktop.id, mobile: mobile.id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function applyReadyOwners() {
    assertContext();
    const shellComponent = componentByIdentity(MOBILE_SHELL_PATH, MOBILE_SHELL_NAME);
    const desktopShellComponent = componentByIdentity(DESKTOP_SHELL_PATH, DESKTOP_SHELL_NAME);
    const desktopOwner = componentById(DESKTOP_OWNER_ID)?.mainInstance();
    const mobileOwner = componentById(MOBILE_OWNER_ID)?.mainInstance();
    if (!shellComponent || !desktopShellComponent || !desktopOwner || !mobileOwner || mobileOwner.id !== MOBILE_OWNER_MAIN_ID) throw new Error('Interest clubs ready owner inputs are missing');
    const block = penpot.history.undoBlockBegin();
    try {
      const desktopHeader = childByName(desktopOwner, 'linked Interest clubs / Catalog header / desktop ready');
      const desktopShell = penpot.currentPage.getShapeById(DESKTOP_OWNER_SHELL_ID);
      const desktopGrid = penpot.currentPage.getShapeById(DESKTOP_OWNER_GRID_ID);
      const mobileShell = penpot.currentPage.getShapeById(MOBILE_OWNER_SHELL_ID);
      const mobileHeader = penpot.currentPage.getShapeById(MOBILE_OWNER_HEADER_ID);
      const mobileGrid = penpot.currentPage.getShapeById(MOBILE_OWNER_GRID_ID);
      if (!desktopShell || !desktopHeader || !desktopGrid || !mobileShell || !mobileHeader || !mobileGrid) throw new Error('Interest clubs owner children are missing');
      if (desktopShell.component()?.id !== desktopShellComponent.id) desktopShell.swapComponent(desktopShellComponent);
      desktopShell.resetOverrides();
      desktopShell.name = 'linked Interest clubs / Desktop shell / active=clubs;catalog=3';
      place(desktopShell, 0, 0, 1280, 57);
      desktopHeader.resetOverrides();
      desktopHeader.name = 'linked Interest clubs / Catalog header / desktop ready';
      place(desktopHeader, 50, 89, 1180, 402.953125);
      place(desktopGrid, 50, 523.953125, 1180, 544);
      if (mobileShell.component()?.id !== shellComponent.id) mobileShell.swapComponent(shellComponent);
      mobileShell.resetOverrides();
      mobileShell.name = 'linked Interest clubs / Mobile shell / state=ready;catalog=3;shelf=visible';
      place(mobileShell, 0, 0, 390, 117);
      mobileHeader.resetOverrides();
      mobileHeader.name = 'linked Interest clubs / Catalog header / mobile ready';
      place(mobileHeader, 12, 132.8125, 366, 372.953125);
      place(mobileGrid, 12, 521.765625, 366, 1376);
      return { desktop_shell: desktopShell.id, desktop_grid: desktopGrid.id, shell: mobileShell.id, header: mobileHeader.id, grid: mobileGrid.id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function reconcileHeaderNames() {
    assertContext();
    const block = penpot.history.undoBlockBegin();
    try {
      const pairs = [[DESKTOP_HEADER_ID, DESKTOP_HEADER_NAME], [MOBILE_HEADER_ID, MOBILE_HEADER_NAME]];
      return pairs.map(([id, name]) => {
        const component = componentById(id);
        if (!component) throw new Error(`missing Interest clubs header ${id}`);
        component.name = name;
        component.mainInstance().name = `Interest clubs / Header / ${name}`;
        return { id, name: component.name, main: component.mainInstance().id };
      });
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function readback() {
    assertContext();
    const owners = [DESKTOP_OWNER_ID, MOBILE_OWNER_ID].map((id) => {
      const component = componentById(id);
      if (!component) throw new Error(`missing Interest clubs owner ${id}`);
      const main = component.mainInstance();
      const linkedCards = walk(main).filter((shape) =>
        shape.name?.startsWith('linked Interest clubs / Club card /') &&
        shape.component?.()?.id === CLUB_CARD_ID,
      );
      return {
        id,
        name: component.name,
        main: main.id,
        size: [main.width, main.height],
        linked_card_roots: linkedCards.map((shape) => ({ id: shape.id, name: shape.name })),
      };
    });
    return {
      owners,
      headers: [DESKTOP_HEADER_ID, MOBILE_HEADER_ID].map((id) => {
        const component = componentById(id);
        return { id, name: component?.name, main: component?.mainInstance()?.id };
      }),
      validation: await penpot.currentFile.validate(),
    };
  }

  storage.interestClubsOv40 = { reconcileHeaderNames, ensureDesktopShellReady, ensureMobileShellReady, repairCatalogHeaders, applyReadyOwners, readback };
  return { installed: true, methods: Object.keys(storage.interestClubsOv40) };
}

if (typeof module !== 'undefined') {
  module.exports = {
    installInterestClubsOv40Reconciler,
    constants: {
      FILE_ID, PAGE_ID, DESKTOP_OWNER_ID, MOBILE_OWNER_ID, CLUB_CARD_ID,
      DESKTOP_HEADER_ID, MOBILE_HEADER_ID,
    },
  };
}

/** OV-20/21/22: native Floating Action Island correction over Astro 4d660b079. */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = '8e7accff-5c78-8007-8008-89c00a062ffc';
const COMPONENTS = {
  calendarLabel: 'c0d4e5a2-7db6-80c7-8008-81f1911414a5',
  calendarIcon: '8e7accff-5c78-8007-8008-895a527a8faa',
  shareLabel: '8e7accff-5c78-8007-8008-895a8640f57c',
  shareCompact: 'a21f5e36-5d76-8065-8008-870c7b58f649',
  like: '8e7accff-5c78-8007-8008-895a8728e1f4',
};
const SHAPES = {
  likeMain: '8e7accff-5c78-8007-8008-895a86695994',
  desktop: '8e7accff-5c78-8007-8008-89c0907d9643',
  mobile: '8e7accff-5c78-8007-8008-89c09120e978',
  rejected: ['8e7accff-5c78-8007-8008-89c091bcde50', '8e7accff-5c78-8007-8008-89c091fac511'],
};

function installFloatingActionIslandOv2022(penpot, penpotUtils, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) throw new Error(`open settled page ${PAGE_ID}`);
  };
  const component = (id) => penpot.library.local.components.find((item) => item.id === id);
  const place = (shape, x, y, width, height) => {
    if (shape.layoutChild) shape.layoutChild.absolute = true;
    shape.resize(width, height);
    penpotUtils.setParentXY(shape, x, y);
    return shape;
  };
  const text = (parent, name, value, x, y, width, height, size, weight, color) => {
    const shape = penpot.createText(value);
    Object.assign(shape, { name, fontFamily: 'Inter', fontStyle: 'normal', fontSize: String(size), fontWeight: String(weight), lineHeight: '1.2' });
    shape.fills = [{ fillColor: color, fillOpacity: 1 }];
    parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const linked = (id, parent, name, x, y, width, height) => {
    const target = component(id);
    if (!target) throw new Error(`missing linked component ${id}`);
    const shape = target.instance();
    shape.name = name;
    parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const card = (root, x, title, caption) => {
    const board = penpot.createBoard();
    board.name = `State / ${title}`;
    root.appendChild(board);
    place(board, x, 78, 402, 150);
    board.fills = [{ fillColor: '#292521', fillOpacity: 1 }];
    board.strokes = [{ strokeColor: '#ffffff', strokeOpacity: 0.12, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
    board.borderRadius = 18;
    text(board, 'State label', title, 16, 14, 360, 18, 11, 800, '#fffaf2');
    text(board, 'State rule', caption, 16, 34, 360, 30, 11, 500, '#d8cec4');
    return board;
  };
  const repairPage = () => {
    assertContext();
    const block = penpot.history.undoBlockBegin();
    try {
      const desktop = penpot.currentPage.getShapeById(SHAPES.desktop);
      const mobile = penpot.currentPage.getShapeById(SHAPES.mobile);
      desktop.name = 'Unified v1 / Floating action island / viewport=desktop;state=share-label;source=Astro-4d660b079';
      mobile.name = 'Unified v1 / Floating action island / viewport=mobile;state=share-label;source=Astro-4d660b079';
      const actions = [...desktop.children].filter((shape) => /Calendar|Share|Like/u.test(shape.name));
      [actions[0].x, actions[1].x, actions[2].x] = [desktop.x + 22, desktop.x + 82, desktop.x + 289.21875];
      for (const id of SHAPES.rejected) {
        const shape = penpot.currentPage.getShapeById(id);
        shape.hidden = true;
        shape.name = 'DEPRECATED / incorrect Wave 1 baseline / owner-rejected';
      }
      const path = 'Unified v1 / Floating action island';
      const name = 'Responsive action label matrix · source=Astro-4d660b079';
      let matrix = penpot.library.local.components.find((item) => item.path === path && item.name === name);
      let root;
      if (matrix) {
        root = matrix.mainInstance();
        [...root.children].forEach((child) => child.remove());
      } else {
        root = penpot.createBoard();
        root.name = `${path} / ${name}`;
        penpot.currentPage.root.appendChild(root);
        place(root, 0, 600, 1306, 250);
        matrix = penpot.library.local.createComponent([root]);
        matrix.path = path;
        matrix.name = name;
      }
      place(root, 0, 600, 1306, 250);
      root.fills = [{ fillColor: '#f5efe6', fillOpacity: 1 }];
      root.strokes = [];
      root.borderRadius = 22;
      text(root, 'Matrix title', 'RESPONSIVE ACTION LABEL MATRIX · ЯВНЫЕ СОСТОЯНИЯ', 20, 16, 900, 18, 12, 800, '#98401f');
      text(root, 'Matrix note', 'Один канонический набор действий. Подписи переключаются по доступной ширине; likes-control расширяется под счётчик.', 20, 40, 1220, 24, 14, 500, '#3f4948');
      const calendar = card(root, 20, 'calendar-label', 'Широкий контекст: подпись у календаря; share компактный.');
      linked(COMPONENTS.calendarLabel, calendar, 'linked Calendar / labelled', 16, 82, 138, 44);
      linked(COMPONENTS.shareCompact, calendar, 'linked Share / icon+count compact', 166, 92, 36, 24);
      linked(COMPONENTS.like, calendar, 'linked Like / counter-responsive · 164', 214, 78, 77, 52);
      const share = card(root, 452, 'share-label', 'Средний контекст: calendar icon-only; share сохраняет подпись.');
      linked(COMPONENTS.calendarIcon, share, 'linked Calendar / icon-only', 16, 78, 52, 52);
      linked(COMPONENTS.shareLabel, share, 'linked Share / labelled · 13', 76, 78, 199.21875, 52);
      linked(COMPONENTS.like, share, 'linked Like / counter-responsive · 164', 283.21875, 78, 77, 52);
      const compact = card(root, 884, 'icons-only', 'Узкий контекст: оба secondary compact; счётчики не обрезаются.');
      linked(COMPONENTS.calendarIcon, compact, 'linked Calendar / icon-only', 16, 78, 52, 52);
      linked(COMPONENTS.shareCompact, compact, 'linked Share / icon+count compact', 80, 92, 36, 24);
      linked(COMPONENTS.like, compact, 'linked Like / counter-responsive · 164', 128, 78, 77, 52);
      return { matrix: matrix.id, main: root.id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  };
  const readback = () => {
    assertContext();
    const matrix = penpot.library.local.components.find((item) => item.id === '8f804431-c282-8075-8008-8e11e908beab');
    return {
      page: penpot.currentPage.name,
      like: { component: COMPONENTS.like, main: SHAPES.likeMain, size: [component(COMPONENTS.like).mainInstance().width, component(COMPONENTS.like).mainInstance().height] },
      matrix: { component: matrix.id, main: matrix.mainInstance().id, states: [...matrix.mainInstance().children].filter((shape) => /^State/u.test(shape.name)).map((shape) => shape.name) },
      rejectedHidden: SHAPES.rejected.filter((id) => penpot.currentPage.getShapeById(id).hidden).length,
      validation: penpot.currentFile.validate(),
    };
  };
  storage.floatingActionIslandOv2022 = { repairPage, readback };
  return { installed: true, methods: Object.keys(storage.floatingActionIslandOv2022) };
}

installFloatingActionIslandOv2022(penpot, penpotUtils, storage);

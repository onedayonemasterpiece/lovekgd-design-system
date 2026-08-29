/**
 * OV-47 Search desktop loading/results reconstruction from measured Astro DOM.
 *
 * The two full-page owners are native Penpot compositions. Browser captures
 * remain evidence only and are never used as fills. Run one method per MCP
 * call after opening and settling Page 63.06. A 504 is an unknown outcome:
 * read back stable identities before retrying.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880ac732b6ae';
const DESKTOP_HEADER_COMPONENT_ID = 'a21f5e36-5d76-8065-8008-86ae4bdf9963';
const DESKTOP_COLLECTION_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-885bfcec31ea';
const DESKTOP_FOOTER_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-885914f2be1b';
const DESKTOP_EVENT_CARD_COMPONENT_ID = 'cab027cf-d52b-8091-8008-85f7db75ebe3';

const SKELETON_PATH = 'Search / Runtime source';
const SKELETON_NAME = 'full-card-skeleton;viewport=desktop;source=Astro';
const CARD_PATH = 'Fixture adapters / Search result';
const CARD_NAME = 'EventCard large desktop;fixture=event.real.7003;state=fallback';
const QUERY_PATH = 'Search / Runtime query controller';
const QUERY_LOADING_NAME = 'viewport=desktop;state=loading;progress=55;query=послушать хор';
const QUERY_RESULTS_NAME = 'viewport=desktop;state=results;count=1;query=послушать хор';
const OWNER_PATH = 'Archetype / Search';
const OWNER_LOADING_NAME = 'viewport=desktop;state=loading;progress=55 · Astro AS-IS';
const OWNER_RESULTS_NAME = 'viewport=desktop;state=results;fixture=event.real.7003 · Astro AS-IS';

const INNER_X = 22.59375;
const INNER_W = 1134.8125;
const LOADING_QUERY_H = 2685.140625;
const RESULTS_QUERY_H = 2323.265625;

function installOv47SearchDesktopMaterializer(penpot, penpotUtils, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Search page ${PAGE_ID} before OV-47 desktop materialization`);
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
  const rectangle = (parent, name, x, y, width, height, color, radius = 0, opacity = 1) => {
    const shape = penpot.createRectangle();
    shape.name = name;
    shape.fills = [{ fillColor: color, fillOpacity: opacity }];
    shape.strokes = [];
    shape.borderRadius = radius;
    parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const ellipse = (parent, name, x, y, width, height, color) => {
    const shape = penpot.createEllipse();
    shape.name = name;
    shape.fills = [{ fillColor: color, fillOpacity: 1 }];
    shape.strokes = [];
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
  const strokeSurface = (shape) => {
    shape.strokes = [{ strokeColor: '#e1d3c2', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
  };

  function addQueryChrome(root, buttonLabel) {
    text(root, 'Eyebrow / source exact', 'УМНЫЙ ПОИСК', INNER_X, 22.59375, 260, 18, 13, 800, 1.15, '#9a3f20');
    text(root, 'Title / source exact', 'Найти событие', INNER_X, 48, 700, 58, 48, 900, 1.02, '#241913');
    text(root, 'Description / source exact', 'Опишите желание обычной фразой — жанр, настроение, время или с кем хотите пойти.', INNER_X, 109, 850, 24, 14, 500, 1.35, '#766b63');
    const account = board(root, 'Account chip / source exact', 969, 22, 188, 48, '#fffdf8', 24);
    strokeSurface(account);
    ellipse(account, 'Account avatar', 10, 10, 28, 28, '#e9e4da');
    text(account, 'Account initial', 'R', 10, 17, 28, 14, 12, 900, 1, '#a65a38', 'center');
    text(account, 'Account label', 'r9-search@ex…', 46, 15, 128, 18, 12, 800, 1.1, '#9a3f20');
    rectangle(root, 'Head divider / source exact', INNER_X, 145.40625, INNER_W, 1, '#e8d9cb');
    text(root, 'Field label / source exact', 'ЧТО ХОЧЕТСЯ СДЕЛАТЬ?', INNER_X, 163.40625, 340, 18, 12, 800, 1.15, '#b64319');
    text(root, 'Query / source exact', 'послушать хор', INNER_X, 187.046875, INNER_W, 32, 21, 700, 1.25, '#241913');
    rectangle(root, 'Field underline / source exact', INNER_X, 286.1875, INNER_W, 2, '#241913');
    rectangle(root, 'Submit surface / source exact', INNER_X, 294.1875, INNER_W, 50, '#221a14', 8);
    text(root, 'Submit label / source exact', buttonLabel, INNER_X, 310.1875, INNER_W, 18, 13, 800, 1.1, '#fffdf8', 'center');
  }

  function ensureSkeleton() {
    assertContext();
    const existing = componentByIdentity(SKELETON_PATH, SKELETON_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${SKELETON_PATH} / ${SKELETON_NAME}`, 8460, -520, INNER_W, 1033.1875, '#fffaf2', 24, true);
      strokeSurface(root);
      const media = board(root, 'Skeleton media / source exact / desktop', 0, 0, INNER_W, 920, '#17191c', 24, true);
      rectangle(media, 'Skeleton shimmer dark', 300, -60, 320, 1040, '#30343a', 0, 0.56);
      rectangle(media, 'Skeleton shimmer middle', 560, -60, 180, 1040, '#393d42', 0, 0.35);
      rectangle(media, 'Skeleton shimmer light', 710, -60, 90, 1040, '#454a50', 0, 0.22);
      rectangle(root, 'Skeleton title bar', 14.4, 936, INNER_W - 28.8, 11.2, '#eadfd3', 99);
      rectangle(root, 'Skeleton line bar', 14.4, 956, 680, 11.2, '#eadfd3', 99);
      rectangle(root, 'Skeleton action divider', 0, 982, INNER_W, 1, '#eadbd0');
      rectangle(root, 'Skeleton action left', 14.4, 994, 552, 28, '#eee2d6', 99);
      rectangle(root, 'Skeleton action right', 578, 994, 542.4, 28, '#eee2d6', 99);
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensureResultCard() {
    assertContext();
    const existing = componentByIdentity(CARD_PATH, CARD_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${CARD_PATH} / ${CARD_NAME}`, 9640, -520, INNER_W, 1623.25, null, 24, false);
      const ancestor = linked(DESKTOP_EVENT_CARD_COMPONENT_ID, 'linked EventCard / Large / Desktop / structural ancestry');
      ancestor.hidden = true;
      root.appendChild(ancestor);
      place(ancestor, 0, 0, 380, 683.640625);

      const media = board(root, 'Media fallback / source exact / event.real.7003', 0, 0, INNER_W, 1417.015625, '#15110f', 24, true);
      strokeSurface(media);
      rectangle(media, 'Fallback field / warm', 1, 1, 570, 1415.015625, '#a66d58', 0, 0.9);
      rectangle(media, 'Fallback field / middle', 410, 1, 420, 1415.015625, '#8b806f', 0, 0.9);
      rectangle(media, 'Fallback field / green', 760, 1, 373.8125, 1415.015625, '#2c897e', 0, 0.9);
      text(media, 'Fallback date / source exact', '31 ИЮЛЯ', 17, 18, INNER_W - 34, 26, 18, 900, 1.2, '#fffaf2');
      text(media, 'Fallback event type / source exact', 'КОНЦЕРТ', 17, 700, INNER_W - 34, 26, 18, 900, 1.2, '#fffaf2');
      text(media, 'Fallback city / source exact', 'КАЛИНИНГРАД', 17, 1372, INNER_W - 34, 26, 18, 900, 1.2, '#fffaf2');

      const body = board(root, 'EventCard body / source exact', 0, 1417.015625, INNER_W, 109.296875, '#15110f');
      text(body, 'Event title / source exact', 'Хоровое многоголосие', 14.59375, 13.59375, INNER_W - 29.1875, 23.3125, 21.6, 900, 1.08, '#fffaf2');
      rectangle(body, 'Event type chip', 14.59375, 44.90625, 72, 24, '#ffffff', 99, 0.12);
      text(body, 'Event type chip label', 'концерт', 14.59375, 50, 72, 14, 11, 800, 1.1, '#fffaf2', 'center');
      text(body, 'Occurrence / source exact', '31 июля · 19:00', 96, 49, 140, 17, 13, 700, 1.1, '#d8cec7');
      rectangle(body, 'Status chip', 246, 43, 106, 28, '#d7f0ec', 99, 0.16);
      text(body, 'Status / source exact', 'По билетам', 246, 49, 106, 16, 12, 800, 1.1, '#d7f0ec', 'center');
      text(body, 'Venue / source exact', 'Калининград · Филармония', 14.59375, 80.90625, INNER_W - 29.1875, 17.203125, 13.76, 700, 1.25, '#d8cec7');

      const utility = board(root, 'EventCard utility row / source exact', 0, 1526.3125, INNER_W, 47.1875, '#15110f', 24, true);
      text(utility, 'Dislike / source exact', '⚑  Не интересно', 14, 12, 170, 20, 12, 800, 1.1, '#d8cec7');
      const under = board(root, 'EventCard feedback under / source exact', 1.59375, 1579.25, 1131.625, 44, null);
      text(under, 'Share / source exact', '↗  Поделиться', 890, 10, 170, 21, 13, 800, 1.1, '#766b63', 'center');
      text(under, 'Like / source exact', '♡', 1070, 4, 44, 28, 25, 500, 1, '#e23a32', 'center');
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, linkedAncestor: ancestor.component()?.id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensureQueryLoading() {
    assertContext();
    const existing = componentByIdentity(QUERY_PATH, QUERY_LOADING_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const skeleton = componentByIdentity(SKELETON_PATH, SKELETON_NAME);
    if (!skeleton) throw new Error('create desktop source-exact Search skeleton first');
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${QUERY_PATH} / ${QUERY_LOADING_NAME}`, 10820, -520, 1180, LOADING_QUERY_H, '#fffaf2', 28, true);
      strokeSurface(root);
      addQueryChrome(root, 'Ищу…');
      rectangle(root, 'Submit progress / 55 percent / source exact', INNER_X, 294.1875, 624.147, 50, '#98401f', 8);
      text(root, 'Submit label / foreground / source exact', 'Ищу…', INNER_X, 310.1875, INNER_W, 18, 13, 800, 1.1, '#fffdf8', 'center');
      text(root, 'Progress label / source exact', 'Варианты найдены…', INNER_X, 367.90625, INNER_W, 22.015625, 13.76, 800, 1.6, '#9a3f20');
      text(root, 'Status / source exact', 'Нашёл варианты. Проверяю точность…', INNER_X, 401.4375, INNER_W, 23.546875, 14.72, 500, 1.6, '#766b63');
      const first = skeleton.instance(); first.name = 'linked Search skeleton / desktop / 1'; root.appendChild(first); place(first, INNER_X, 440.984375, INNER_W, 1033.1875);
      const second = skeleton.instance(); second.name = 'linked Search skeleton / desktop / 2'; root.appendChild(second); place(second, INNER_X, 1487.765625, INNER_W, 1033.1875);
      const peek = board(root, 'Skeleton peek clip / source exact', INNER_X, 2534.546875, INNER_W, 128, null, 24, true);
      const third = skeleton.instance(); third.name = 'linked Search skeleton / desktop / peek'; peek.appendChild(third); place(third, 0, 0, INNER_W, 1033.1875);
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, linkedSkeleton: skeleton.id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensureQueryResults() {
    assertContext();
    const existing = componentByIdentity(QUERY_PATH, QUERY_RESULTS_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const card = componentByIdentity(CARD_PATH, CARD_NAME);
    if (!card) throw new Error('create desktop source-exact Search result card first');
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${QUERY_PATH} / ${QUERY_RESULTS_NAME}`, 12040, -520, 1180, RESULTS_QUERY_H, '#fffaf2', 28, true);
      strokeSurface(root);
      addQueryChrome(root, 'Готово');
      rectangle(root, 'Submit complete / source exact', INNER_X, 294.1875, INNER_W, 50, '#a54420', 8);
      text(root, 'Submit complete label / source exact', 'Готово', INNER_X, 310.1875, INNER_W, 18, 13, 800, 1.1, '#fffdf8', 'center');
      text(root, 'Progress label / source exact', 'Готово', INNER_X, 367.90625, INNER_W, 22.015625, 13.76, 800, 1.6, '#9a3f20');
      text(root, 'Quota status / source exact', 'Осталось поисков: 7 сегодня.', INNER_X, 401.4375, INNER_W, 23.546875, 14.72, 500, 1.6, '#766b63');
      text(root, 'Results heading / source exact', 'Результаты поиска', INNER_X, 458.578125, INNER_W, 24, 18.88, 900, 1.08, '#9a3f20');
      const cardInstance = card.instance(); cardInstance.name = 'linked EventCard / desktop / event.real.7003 / source exact'; root.appendChild(cardInstance); place(cardInstance, INNER_X, 498.140625, INNER_W, 1623.25);
      const feedback = board(root, 'Search feedback / source exact', INNER_X, 2153.390625, INNER_W, 147.28125, '#fff7ea', 20);
      feedback.strokes = [{ strokeColor: '#793014', strokeOpacity: 0.13, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      text(feedback, 'Feedback question', 'Нашли то, что искали?', 14, 18, 500, 24, 16, 900, 1.15, '#241913');
      const yes = board(feedback, 'Feedback yes', 14, 54, 124, 40, '#fffdf8', 20); strokeSurface(yes);
      text(yes, 'Feedback yes label', 'Да, нашёл', 0, 10, 124, 20, 14, 800, 1.1, '#9a3f20', 'center');
      const no = board(feedback, 'Feedback no', 148, 54, 150, 40, '#fffdf8', 20); strokeSurface(no);
      text(no, 'Feedback no label', 'Нет, не нашёл', 0, 10, 150, 20, 14, 800, 1.1, '#9a3f20', 'center');
      text(feedback, 'Feedback note', 'Ответ поможет улучшить поиск и будущие готовые подборки.', 14, 108, 850, 22, 13, 500, 1.4, '#766b63');
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, linkedCard: card.id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensureLoadingOwner() {
    assertContext();
    const existing = componentByIdentity(OWNER_PATH, OWNER_LOADING_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const query = componentByIdentity(QUERY_PATH, QUERY_LOADING_NAME);
    const collections = componentById(DESKTOP_COLLECTION_COMPONENT_ID);
    if (!query || !collections) throw new Error('create desktop loading query and require desktop collection first');
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${OWNER_PATH} / ${OWNER_LOADING_NAME}`, 13260, -520, 1280, 4044, '#fbf5eb', 0, true);
      const header = linked(DESKTOP_HEADER_COMPONENT_ID, 'linked Shell / Desktop header'); root.appendChild(header); place(header, 0, 0, 1280, 57);
      const controller = query.instance(); controller.name = 'linked Search / Runtime query / desktop loading'; root.appendChild(controller); place(controller, 50, 111.390625, 1180, LOADING_QUERY_H);
      const collection = collections.instance(); collection.name = 'linked Search / Collection links / desktop'; root.appendChild(collection); place(collection, 50, 2814.125, 1180, 499.765625);
      const footer = linked(DESKTOP_FOOTER_COMPONENT_ID, 'linked Shell / Desktop footer viewport'); root.appendChild(footer); place(footer, 0, 3361.890625, 1280, 681.859375);
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, linked: [header.component()?.id, query.id, collections.id, footer.component()?.id] };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensureResultsOwner() {
    assertContext();
    const existing = componentByIdentity(OWNER_PATH, OWNER_RESULTS_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const query = componentByIdentity(QUERY_PATH, QUERY_RESULTS_NAME);
    const collections = componentById(DESKTOP_COLLECTION_COMPONENT_ID);
    if (!query || !collections) throw new Error('create desktop results query and require desktop collection first');
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${OWNER_PATH} / ${OWNER_RESULTS_NAME}`, 14580, -520, 1280, 3682, '#fbf5eb', 0, true);
      const header = linked(DESKTOP_HEADER_COMPONENT_ID, 'linked Shell / Desktop header'); root.appendChild(header); place(header, 0, 0, 1280, 57);
      const controller = query.instance(); controller.name = 'linked Search / Runtime query / desktop results'; root.appendChild(controller); place(controller, 50, 111.390625, 1180, RESULTS_QUERY_H);
      const collection = collections.instance(); collection.name = 'linked Search / Collection links / desktop'; root.appendChild(collection); place(collection, 50, 2452.25, 1180, 499.765625);
      const footer = linked(DESKTOP_FOOTER_COMPONENT_ID, 'linked Shell / Desktop footer viewport'); root.appendChild(footer); place(footer, 0, 3000.015625, 1280, 681.859375);
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, linked: [header.component()?.id, query.id, collections.id, footer.component()?.id] };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function readback() {
    assertContext();
    const identities = [
      [SKELETON_PATH, SKELETON_NAME], [CARD_PATH, CARD_NAME],
      [QUERY_PATH, QUERY_LOADING_NAME], [QUERY_PATH, QUERY_RESULTS_NAME],
      [OWNER_PATH, OWNER_LOADING_NAME], [OWNER_PATH, OWNER_RESULTS_NAME],
    ];
    return {
      fileRevision: penpot.currentFile.revn,
      components: identities.map(([path, name]) => {
        const component = componentByIdentity(path, name);
        if (!component) return { path, name, missing: true };
        const main = component.mainInstance();
        return {
          path, name, id: component.id, main: main.id, width: main.width, height: main.height,
          direct: [...main.children].map((shape) => ({
            id: shape.id, name: shape.name, x: shape.x - main.x, y: shape.y - main.y,
            width: shape.width, height: shape.height, hidden: shape.hidden,
            componentId: shape.component?.()?.id ?? null,
            copy: shape.isComponentCopyInstance?.() ?? false,
          })),
        };
      }),
      validation: penpot.currentFile.validate(),
    };
  }

  storage.ov47SearchDesktop = {
    ensureSkeleton,
    ensureResultCard,
    ensureQueryLoading,
    ensureQueryResults,
    ensureLoadingOwner,
    ensureResultsOwner,
    readback,
  };
  return { installed: true, methods: Object.keys(storage.ov47SearchDesktop) };
}

if (typeof module !== 'undefined') {
  module.exports = {
    installOv47SearchDesktopMaterializer,
    constants: {
      FILE_ID,
      PAGE_ID,
      DESKTOP_HEADER_COMPONENT_ID,
      DESKTOP_COLLECTION_COMPONENT_ID,
      DESKTOP_FOOTER_COMPONENT_ID,
      DESKTOP_EVENT_CARD_COMPONENT_ID,
      LOADING_QUERY_H,
      RESULTS_QUERY_H,
    },
  };
}

/**
 * OV-47/48 Search recovery from the measured production Astro DOM.
 *
 * Screenshots are evidence only. The Penpot result is native/editable and
 * composes linked shell, collection, skeleton and EventCard ancestry.
 * Open Page 63.06, allow text layout to settle, install once, then run one
 * method per MCP call. A 504 is an unknown outcome: read back before retrying.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880ac732b6ae';
const MOBILE_HEADER_COMPONENT_ID = 'a21f5e36-5d76-8065-8008-86aebfc67027';
const MOBILE_BOTTOM_NAV_COMPONENT_ID = 'a21f5e36-5d76-8065-8008-86aec0a54bb5';
const MOBILE_SEARCH_BOTTOM_NAV_COMPONENT_ID = '8e7accff-5c78-8007-8008-89c2fd86089e';
const MOBILE_COLLECTION_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-885c00281bba';
const MOBILE_EVENT_CARD_COMPONENT_ID = '7f078c80-87b8-80f5-8008-85839e8975f6';

const SKELETON_PATH = 'Search / Runtime source';
const SKELETON_NAME = 'full-card-skeleton;viewport=mobile;source=Astro';
const COLLECTION_PATH = 'Search / Collection links';
const COLLECTION_NAME = 'viewport=mobile;source-exact-with-notes';
const CARD_PATH = 'Fixture adapters / Search result';
const CARD_NAME = 'EventCard large mobile;fixture=event.real.7003;state=fallback';
const QUERY_PATH = 'Search / Runtime query controller';
const QUERY_LOADING_NAME = 'viewport=mobile;state=loading;progress=55;query=послушать хор';
const QUERY_RESULTS_NAME = 'viewport=mobile;state=results;count=1;query=послушать хор';
const OWNER_PATH = 'Archetype / Search';
const OWNER_LOADING_NAME = 'viewport=mobile;state=loading;progress=55 · Astro AS-IS';
const OWNER_RESULTS_NAME = 'viewport=mobile;state=results;fixture=event.real.7003 · Astro AS-IS';

function installOv47SearchMobileMaterializer(penpot, penpotUtils, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Search page ${PAGE_ID} before OV-47 materialization`);
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

  function addSharedQueryHead(root) {
    text(root, 'Eyebrow / source exact', 'УМНЫЙ ПОИСК', 0, 0, 250, 18, 13, 800, 1.15, '#9a3f20');
    text(root, 'Title / source exact', 'Найти событие', 0, 28, 366, 52, 40, 900, 1.02, '#241913');
    text(root, 'Description / source exact', 'Опишите желание обычной фразой —\nжанр, настроение, время или с кем\nхотите пойти.', 0, 86, 366, 64, 16, 500, 1.35, '#766b63');
    const account = board(root, 'Account chip / authenticated / source exact', 173, 156.5, 193, 56, '#fffdf8', 28);
    account.strokes = [{ strokeColor: '#e2d3c7', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
    ellipse(account, 'Account avatar surface', 8, 8, 40, 40, '#e7ece8');
    text(account, 'Account avatar initial', 'S', 8, 20, 40, 18, 16, 900, 1, '#a54420', 'center');
    text(account, 'Account label', 'search-evidence@ex…', 56, 18, 125, 20, 14, 800, 1.2, '#a54420');
  }

  function addSharedQueryForm(root, buttonLabel) {
    rectangle(root, 'Form top divider / source exact', 0, 223.71875, 366, 1, '#e8d9cb');
    text(root, 'Field label / source exact', 'ЧТО ХОЧЕТСЯ СДЕЛАТЬ?', 0, 239.71875, 300, 18, 12, 800, 1.15, '#b64319');
    text(root, 'Query / source exact', 'послушать хор', 0, 268.71875, 366, 32, 22, 700, 1.15, '#241913');
    rectangle(root, 'Field underline / source exact', 0, 353.5, 366, 2, '#241913');
    rectangle(root, 'Submit surface / source exact', 0, 366.5, 366, 50, '#221a14', 8);
    text(root, 'Submit label / source exact', buttonLabel, 0, 382.5, 366, 18, 13, 800, 1.1, '#fffdf8', 'center');
    rectangle(root, 'Form bottom divider / source exact', 0, 432.5, 366, 1, '#e8d9cb');
  }

  function ensureSkeleton() {
    assertContext();
    const existing = componentByIdentity(SKELETON_PATH, SKELETON_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${SKELETON_PATH} / ${SKELETON_NAME}`, 5900, -520, 366, 418.125, '#fffaf2', 24, true);
      root.strokes = [{ strokeColor: '#793014', strokeOpacity: 0.12, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      const media = board(root, 'Skeleton media / source exact / 5:4', 0, 0, 366, 292.8, '#17191c', 0, true);
      rectangle(media, 'Skeleton shimmer dark', 158, -30, 86, 360, '#30343a', 0, 0.58);
      rectangle(media, 'Skeleton shimmer light', 230, -30, 34, 360, '#3b4047', 0, 0.32);
      rectangle(root, 'Skeleton title bar', 14.4, 307.2, 337.2, 11.2, '#eadfd3', 99);
      rectangle(root, 'Skeleton line bar', 14.4, 327.2, 209.064, 11.2, '#eadfd3', 99);
      rectangle(root, 'Skeleton action divider', 0, 353.2, 366, 1, '#eadbd0');
      rectangle(root, 'Skeleton action left', 14.4, 365.2, 161.4, 37.6, '#eee2d6', 99);
      rectangle(root, 'Skeleton action right', 187.8, 365.2, 163.8, 37.6, '#eee2d6', 99);
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensureCollectionSourceExact() {
    assertContext();
    const existing = componentByIdentity(COLLECTION_PATH, COLLECTION_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${COLLECTION_PATH} / ${COLLECTION_NAME}`, 5900, -40, 366, 888, null, 0, false);
      const base = linked(MOBILE_COLLECTION_COMPONENT_ID, 'linked Search / Collection links / viewport=mobile');
      root.appendChild(base);
      place(base, 0, 0, 366, 650);
      text(root, 'Collection / арт-вечеринка с музыкой', 'арт-вечеринка с музыкой', 8, 596, 286, 38, 16, 800, 1.15, '#241913');
      text(root, 'Action / пример / art-party', 'пример', 290, 598, 66, 22, 12, 700, 1.15, '#766b63', 'right');
      rectangle(root, 'Row divider / art-party', 8, 636, 348, 1, '#e8d9cb');
      text(root, 'Collection note / examples / source exact', 'Строки с пометкой «пример» только\nподставляют фразу в поиск. Запрос не\nотправится, пока вы сами не нажмёте «Искать».', 8, 650, 350, 74, 13, 500, 1.35, '#766b63');
      text(root, 'Collection note / editorial / source exact', 'Это общие редакционные подборки. Личные\nсохранённые запросы появятся отдельно и\nтолько после входа.', 8, 736, 350, 66, 13, 500, 1.35, '#766b63');
      text(root, 'Collection note / persistence / source exact', 'Оценка выдачи после входа сохраняется в\nSupabase; при сбое сети браузер временно\nдержит её в локальной очереди.', 8, 814, 350, 66, 13, 500, 1.35, '#766b63');
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, linked: base.component()?.id };
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
      const root = board(null, `${CARD_PATH} / ${CARD_NAME}`, 6320, -520, 366, 656.71875, null, 24, false);
      const ancestor = linked(MOBILE_EVENT_CARD_COMPONENT_ID, 'linked EventCard / Large / Mobile flow / structural ancestry');
      ancestor.hidden = true;
      root.appendChild(ancestor);
      place(ancestor, 0, 0, 366, 487.836);

      const media = board(root, 'Media fallback / source exact / event.real.7003', 0, 0, 366, 456, '#15110f', 24, true);
      rectangle(media, 'Fallback field / warm', 1, 1, 180, 455, '#b79b8b', 0, 0.9);
      rectangle(media, 'Fallback field / middle', 145, 1, 130, 455, '#7f8069', 0, 0.92);
      rectangle(media, 'Fallback field / green', 257, 1, 108, 455, '#168676', 0, 0.82);
      text(media, 'Fallback date / source exact', '31 ИЮЛЯ', 17, 17, 332, 25.59375, 18, 900, 1.2, '#fffaf2');
      text(media, 'Fallback event type / source exact', 'КОНЦЕРТ', 17, 218.75, 332, 19.5, 16, 900, 1.1, '#fffaf2');
      text(media, 'Fallback city / source exact', 'КАЛИНИНГРАД', 17, 414.40625, 332, 25.59375, 18, 900, 1.2, '#fffaf2');

      const body = board(root, 'EventCard body / source exact', 0, 456, 366, 103.78125, '#15110f');
      text(body, 'Event title / source exact', 'Хоровое многоголосие', 14.59375, 13.59375, 336.8125, 17.796875, 16, 900, 1.1, '#fffaf2');
      rectangle(body, 'Event type chip', 14.59375, 44.25, 69.828125, 18.28125, '#ffffff', 99, 0.12);
      text(body, 'Event type chip label', 'концерт', 14.59375, 46.25, 69.828125, 14.28125, 11, 800, 1.1, '#fffaf2', 'center');
      text(body, 'Occurrence / source exact', '31 июля · 19:00', 91.140625, 45.1875, 118.59375, 16.40625, 12, 700, 1.1, '#d8cec7');
      rectangle(body, 'Status chip', 216.453125, 39.390625, 100.640625, 28, '#d7f0ec', 99, 0.16);
      text(body, 'Status / source exact', 'По билетам', 216.453125, 46.390625, 100.640625, 16, 12, 800, 1.1, '#d7f0ec', 'center');
      text(body, 'Venue / source exact', 'Калининград · Филармония', 14.59375, 75.390625, 336.8125, 17.203125, 12, 700, 1.1, '#d8cec7');

      const utility = board(root, 'EventCard utility row / source exact', 0, 559.78125, 366, 47.1875, '#15110f', 24, true);
      text(utility, 'Dislike / source exact', '⚑  Не интересно', 11.875, 9, 124.9375, 20, 12, 800, 1.1, '#d8cec7');
      const under = board(root, 'EventCard feedback under / source exact', 1.59375, 612.71875, 362.8125, 44, null);
      text(under, 'Share / source exact', '↗  Поделиться', 186.515625, 10, 126.859375, 21, 13, 800, 1.1, '#766b63', 'center');
      text(under, 'Like / source exact', '♡', 318.8125, 5, 44, 28, 25, 500, 1, '#e23a32', 'center');
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
    const skeletonComponent = componentByIdentity(SKELETON_PATH, SKELETON_NAME);
    if (!skeletonComponent) throw new Error('create source-exact Search skeleton first');
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${QUERY_PATH} / ${QUERY_LOADING_NAME}`, 6740, -520, 366, 1504.734375, null);
      addSharedQueryHead(root);
      addSharedQueryForm(root, 'Ищу…');
      rectangle(root, 'Submit progress / 55 percent / source exact', 0, 366.5, 201.3, 50, '#98401f', 8);
      text(root, 'Submit label / foreground / source exact', 'Ищу…', 0, 382.5, 366, 18, 13, 800, 1.1, '#fffdf8', 'center');
      text(root, 'Progress label / source exact', 'Варианты найдены…', 0, 440.21875, 366, 22.015625, 14, 800, 1.25, '#9a3f20');
      text(root, 'Status / source exact', 'Нашёл варианты. Проверяю точность…', 0, 473.75, 366, 23.546875, 15, 500, 1.3, '#766b63');
      const first = skeletonComponent.instance(); first.name = 'linked Search skeleton / 1'; root.appendChild(first); place(first, 0, 513.296875, 366, 418.125);
      const second = skeletonComponent.instance(); second.name = 'linked Search skeleton / 2'; root.appendChild(second); place(second, 0, 945.015625, 366, 418.125);
      const peek = board(root, 'Skeleton peek clip / source exact', 0, 1376.734375, 366, 128, null, 24, true);
      const third = skeletonComponent.instance(); third.name = 'linked Search skeleton / peek'; peek.appendChild(third); place(third, 0, 0, 366, 418.125);
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, linkedSkeleton: skeletonComponent.id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensureQueryResults() {
    assertContext();
    const existing = componentByIdentity(QUERY_PATH, QUERY_RESULTS_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const cardComponent = componentByIdentity(CARD_PATH, CARD_NAME);
    if (!cardComponent) throw new Error('create source-exact Search result card first');
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${QUERY_PATH} / ${QUERY_RESULTS_NAME}`, 7160, -520, 366, 1400.234375, null);
      addSharedQueryHead(root);
      addSharedQueryForm(root, 'Искать');
      text(root, 'Status / source exact', 'Найдено: 1', 0, 445.015625, 366, 23.546875, 15, 500, 1.3, '#766b63');
      text(root, 'Results heading / source exact', 'Результаты поиска', 0, 504.5625, 366, 28, 21, 800, 1.15, '#9a3f20');
      const card = cardComponent.instance(); card.name = 'linked EventCard / event.real.7003 / source exact'; root.appendChild(card); place(card, 0, 541.71875, 366, 656.71875);
      const feedback = board(root, 'Search feedback / source exact', 0, 1231.5, 366, 172, '#fff7ea', 20);
      feedback.strokes = [{ strokeColor: '#793014', strokeOpacity: 0.13, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      text(feedback, 'Feedback question', 'Нашли то, что искали?', 14, 18, 330, 24, 18, 900, 1.15, '#241913');
      const yes = board(feedback, 'Feedback yes', 14, 54, 122, 42, '#fffdf8', 21);
      yes.strokes = [{ strokeColor: '#793014', strokeOpacity: 0.16, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      text(yes, 'Feedback yes label', 'Да, нашёл', 0, 11, 122, 20, 15, 800, 1.1, '#9a3f20', 'center');
      const no = board(feedback, 'Feedback no', 144, 54, 176, 42, '#fffdf8', 21);
      no.strokes = [{ strokeColor: '#793014', strokeOpacity: 0.16, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      text(no, 'Feedback no label', 'Нет, не нашёл', 0, 11, 176, 20, 15, 800, 1.1, '#9a3f20', 'center');
      text(feedback, 'Feedback note', 'Ответ поможет улучшить поиск и будущие\nготовые подборки.', 14, 116, 330, 44, 15, 500, 1.4, '#766b63');
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, linkedCard: cardComponent.id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensureLoadingOwner() {
    assertContext();
    const existing = componentByIdentity(OWNER_PATH, OWNER_LOADING_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const query = componentByIdentity(QUERY_PATH, QUERY_LOADING_NAME);
    const collections = componentByIdentity(COLLECTION_PATH, COLLECTION_NAME);
    if (!query || !collections) throw new Error('create loading query and source-exact collection first');
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${OWNER_PATH} / ${OWNER_LOADING_NAME}`, 7580, -520, 390, 2626, '#fbf5eb', 20, true);
      root.strokes = [{ strokeColor: '#e1d3c2', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      const header = linked(MOBILE_HEADER_COMPONENT_ID, 'linked Shell / Mobile header'); root.appendChild(header); place(header, 12, 0, 390, 84);
      const controller = query.instance(); controller.name = 'linked Search / Runtime query / loading'; root.appendChild(controller); place(controller, 12, 96, 366, 1504.734375);
      const collection = collections.instance(); collection.name = 'linked Search / Collection links / source exact'; root.appendChild(collection); place(collection, 12, 1616.734375, 366, 888);
      const nav = linked(MOBILE_SEARCH_BOTTOM_NAV_COMPONENT_ID, 'linked Shell / Mobile bottom navigation / current=search / sticky'); root.appendChild(nav); place(nav, 0, 780, 390, 64);
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, linked: [header.component()?.id, query.id, collections.id, nav.component()?.id] };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensureResultsOwner() {
    assertContext();
    const existing = componentByIdentity(OWNER_PATH, OWNER_RESULTS_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const query = componentByIdentity(QUERY_PATH, QUERY_RESULTS_NAME);
    const collections = componentByIdentity(COLLECTION_PATH, COLLECTION_NAME);
    if (!query || !collections) throw new Error('create results query and source-exact collection first');
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${OWNER_PATH} / ${OWNER_RESULTS_NAME}`, 8010, -520, 390, 2521, '#fbf5eb', 20, true);
      root.strokes = [{ strokeColor: '#e1d3c2', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      const header = linked(MOBILE_HEADER_COMPONENT_ID, 'linked Shell / Mobile header'); root.appendChild(header); place(header, 12, 0, 390, 84);
      const controller = query.instance(); controller.name = 'linked Search / Runtime query / results'; root.appendChild(controller); place(controller, 12, 96, 366, 1400.234375);
      const collection = collections.instance(); collection.name = 'linked Search / Collection links / source exact'; root.appendChild(collection); place(collection, 12, 1512.234375, 366, 888);
      const nav = linked(MOBILE_SEARCH_BOTTOM_NAV_COMPONENT_ID, 'linked Shell / Mobile bottom navigation / current=search / sticky'); root.appendChild(nav); place(nav, 0, 780, 390, 64);
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, linked: [header.component()?.id, query.id, collections.id, nav.component()?.id] };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function repairSourceExactOwners() {
    assertContext();
    const collections = componentByIdentity(COLLECTION_PATH, COLLECTION_NAME);
    const loading = componentByIdentity(OWNER_PATH, OWNER_LOADING_NAME);
    const results = componentByIdentity(OWNER_PATH, OWNER_RESULTS_NAME);
    if (!collections || !loading || !results) throw new Error('materialize both OV-47 owners before repair');
    const block = penpot.history.undoBlockBegin();
    try {
      const collectionMain = collections.mainInstance();
      collectionMain.resize(366, 888);
      const direct = (root, name) => [...root.children].find((shape) => shape.name === name);
      if (!direct(collectionMain, 'Collection / арт-вечеринка с музыкой')) {
        text(collectionMain, 'Collection / арт-вечеринка с музыкой', 'арт-вечеринка с музыкой', 8, 596, 286, 38, 16, 800, 1.15, '#241913');
        text(collectionMain, 'Action / пример / art-party', 'пример', 290, 598, 66, 22, 12, 700, 1.15, '#766b63', 'right');
        rectangle(collectionMain, 'Row divider / art-party', 8, 636, 348, 1, '#e8d9cb');
      }
      place(direct(collectionMain, 'Collection note / examples / source exact'), 8, 650, 350, 74);
      place(direct(collectionMain, 'Collection note / editorial / source exact'), 8, 736, 350, 66);
      place(direct(collectionMain, 'Collection note / persistence / source exact'), 8, 814, 350, 66);

      const repairOwner = (component, collectionY) => {
        const root = component.mainInstance();
        const header = [...root.children].find((shape) => shape.component?.()?.id === MOBILE_HEADER_COMPONENT_ID);
        const collection = [...root.children].find((shape) => shape.component?.()?.id === collections.id);
        const oldNav = [...root.children].find((shape) => shape.component?.()?.id === MOBILE_BOTTOM_NAV_COMPONENT_ID);
        const currentNav = [...root.children].find((shape) => shape.component?.()?.id === MOBILE_SEARCH_BOTTOM_NAV_COMPONENT_ID);
        if (!header || !collection) throw new Error(`owner ${component.id} linked anatomy missing`);
        place(header, 12, 0, 390, 84);
        place(collection, 12, collectionY, 366, 888);
        if (oldNav) oldNav.remove();
        let nav = currentNav;
        if (!nav) {
          nav = linked(MOBILE_SEARCH_BOTTOM_NAV_COMPONENT_ID, 'linked Shell / Mobile bottom navigation / current=search / sticky');
          root.appendChild(nav);
        }
        place(nav, 0, 780, 390, 64);
        root.appendChild(nav);
        return { owner: component.id, headerX: header.x - root.x, collectionHeight: collection.height, navComponent: nav.component()?.id };
      };
      return {
        collection: { id: collections.id, width: collectionMain.width, height: collectionMain.height },
        loading: repairOwner(loading, 1616.734375),
        results: repairOwner(results, 1512.234375),
      };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function repairAuthenticatedQueryHeads() {
    assertContext();
    const targets = [QUERY_LOADING_NAME, QUERY_RESULTS_NAME].map((name) => componentByIdentity(QUERY_PATH, name));
    if (targets.some((component) => !component)) throw new Error('materialize both mobile Search query states before auth-head repair');
    const block = penpot.history.undoBlockBegin();
    try {
      return targets.map((component) => {
        const root = component.mainInstance();
        const chip = [...root.children].find((shape) => shape.name === 'Yandex login / source exact' || shape.name === 'Account chip / authenticated / source exact');
        if (!chip) throw new Error(`query ${component.id} auth head missing`);
        chip.name = 'Account chip / authenticated / source exact';
        chip.fills = [{ fillColor: '#fffdf8', fillOpacity: 1 }];
        chip.strokes = [{ strokeColor: '#e2d3c7', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
        chip.borderRadius = 28;
        place(chip, 173, 156.5, 193, 56);
        const parts = [...chip.children];
        const avatar = parts.find((shape) => shape.type === 'ellipse');
        const avatarLabel = parts.find((shape) => shape.type === 'text' && shape.characters === 'Я');
        const accountLabel = parts.find((shape) => shape.type === 'text' && shape !== avatarLabel);
        if (!avatar || !avatarLabel || !accountLabel) throw new Error(`query ${component.id} auth head anatomy missing`);
        avatar.name = 'Account avatar surface';
        avatar.fills = [{ fillColor: '#e7ece8', fillOpacity: 1 }];
        place(avatar, 8, 8, 40, 40);
        avatarLabel.name = 'Account avatar initial';
        avatarLabel.characters = 'S';
        avatarLabel.fills = [{ fillColor: '#a54420', fillOpacity: 1 }];
        place(avatarLabel, 8, 20, 40, 18);
        accountLabel.name = 'Account label';
        accountLabel.characters = 'search-evidence@ex…';
        accountLabel.fills = [{ fillColor: '#a54420', fillOpacity: 1 }];
        place(accountLabel, 56, 18, 125, 20);
        return { component: component.id, main: root.id, chip: chip.id, size: [chip.width, chip.height] };
      });
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function readback() {
    assertContext();
    const identities = [
      [SKELETON_PATH, SKELETON_NAME],
      [COLLECTION_PATH, COLLECTION_NAME],
      [CARD_PATH, CARD_NAME],
      [QUERY_PATH, QUERY_LOADING_NAME],
      [QUERY_PATH, QUERY_RESULTS_NAME],
      [OWNER_PATH, OWNER_LOADING_NAME],
      [OWNER_PATH, OWNER_RESULTS_NAME],
    ];
    return {
      components: identities.map(([path, name]) => {
        const component = componentByIdentity(path, name);
        if (!component) return { path, name, missing: true };
        const main = component.mainInstance();
        return {
          path,
          name,
          id: component.id,
          main: main.id,
          width: main.width,
          height: main.height,
          direct: [...main.children].map((shape) => ({
            id: shape.id,
            name: shape.name,
            x: shape.x - main.x,
            y: shape.y - main.y,
            width: shape.width,
            height: shape.height,
            hidden: shape.hidden,
            componentId: shape.component?.()?.id ?? null,
          })),
        };
      }),
      validation: await penpot.currentFile.validate(),
    };
  }

  storage.ov47SearchMobile = {
    ensureSkeleton,
    ensureCollectionSourceExact,
    ensureResultCard,
    ensureQueryLoading,
    ensureQueryResults,
    ensureLoadingOwner,
    ensureResultsOwner,
    repairSourceExactOwners,
    repairAuthenticatedQueryHeads,
    readback,
  };
  return { installed: true, methods: Object.keys(storage.ov47SearchMobile) };
}

if (typeof module !== 'undefined') {
  module.exports = {
    installOv47SearchMobileMaterializer,
    constants: {
      FILE_ID,
      PAGE_ID,
      MOBILE_HEADER_COMPONENT_ID,
      MOBILE_BOTTOM_NAV_COMPONENT_ID,
      MOBILE_SEARCH_BOTTOM_NAV_COMPONENT_ID,
      MOBILE_COLLECTION_COMPONENT_ID,
      MOBILE_EVENT_CARD_COMPONENT_ID,
    },
  };
}

/**
 * Native Page 63.08 recovery for OV-44.
 *
 * The owner projection is the real `/podborki/besplatnye-sobytiya/` viewport,
 * not the stale `/podborki/` directory. Dense 23 + 14 listing stress remains
 * Astro-owned; Penpot materializes three exact real fixtures in linked
 * EventCard adapters and clips the owner boards to the source review viewport.
 *
 * Install the functions into plugin storage, open Page 63.08 in a separate MCP
 * call, then run exactly one bounded method per call. A 504 is an unknown
 * outcome: read back `componentByIdentity` before resuming.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880c4a36d153';
const DESKTOP_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880c4a6d708e';
const MOBILE_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880c4cb4c4e6';
const DESKTOP_HEADER_ID = 'a21f5e36-5d76-8065-8008-86ae4bdf9963';
const MOBILE_HEADER_ID = 'a21f5e36-5d76-8065-8008-86aebfc67027';
const MOBILE_NAV_ID = 'a21f5e36-5d76-8065-8008-86aec0a54bb5';

const FIXTURE_PATH = 'Collections / Free / EventCard fixture adapter';
const BODY_PATH = 'Collections / Free / Page body';

const EVENTS = {
  7030: {
    title: 'Праздник непослушания',
    type: 'встреча',
    occurrence: '23 июля 12:00',
    price: 'Бесплатно · вход свободный',
    place: 'Калининград · Научная библиотека',
    image: 'https://static.kenigevents.ru/p/image/v2/4c/4c067daf59dcdf244a89768e1d9e88168fd0c727e38732eb707fee4f29000960.webp',
    template: {
      desktop: 'b0fe69fd-ccaf-8025-8008-844b666fe76c',
      mobile: '7f078c80-87b8-80f5-8008-85839e8975f6',
    },
    geometry: {
      desktop: [533.796875, 746.765625],
      mobile: [340, 462.734375],
    },
  },
  6947: {
    title: 'Лекция Жизнь и боль Фриды Кало',
    type: 'лекция',
    occurrence: '23 июля 18:00',
    price: 'Бесплатно · вход свободный',
    place: 'Гусев · кафе «АРТеФАКТ39»',
    image: 'https://static.kenigevents.ru/p/image/v2/78/78a2911e04c3ce4c2d34de8081ebe0c481028b693d450cd10cf5f9ec35201614.webp',
    template: {
      desktop: 'b0fe69fd-ccaf-8025-8008-844b666fe76c',
      mobile: '7f078c80-87b8-80f5-8008-85839e8975f6',
    },
    geometry: {
      desktop: [533.8125, 746.765625],
      mobile: [340, 588.625],
    },
  },
  7006: {
    title: 'Открытая лекция по Трансцендентальной Медитации',
    type: 'лекция',
    occurrence: '23 июля 18:00',
    price: 'Бесплатно · регистрация',
    place: 'Калининград · ТЦ «Панорама»',
    image: 'https://static.kenigevents.ru/p/image/v2/af/af810be081f4302e13a70dedc4ddd988026db5113a569c3352a7eb2eac4da851.webp',
    template: {
      desktop: 'b0fe69fd-ccaf-8025-8008-844b666fe76c',
      mobile: '7f078c80-87b8-80f5-8008-85839e8975f6',
    },
    geometry: {
      desktop: [533.796875, 663.703125],
      mobile: [340, 521.015625],
    },
  },
};

const BODY_NAME = {
  desktop: 'viewport=desktop;collection=free;fixture=2026-07-23',
  mobile: 'viewport=mobile;collection=free;fixture=2026-07-23',
};

function installOv44Materializer(penpot, penpotUtils, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Collections page ${PAGE_ID} before OV-44 materialization`);
    }
  };

  const componentById = (id) => penpot.library.local.components.find((component) => component.id === id);
  const componentByIdentity = (path, name) => penpot.library.local.components.find(
    (component) => component.path === path && component.name === name,
  );
  const walk = (root) => {
    const result = [];
    const queue = root ? [root] : [];
    while (queue.length) {
      const shape = queue.shift();
      result.push(shape);
      if (shape.children) queue.push(...shape.children);
    }
    return result;
  };
  const place = (shape, x, y, width, height) => {
    if (shape.layoutChild) shape.layoutChild.absolute = true;
    if (width != null && height != null) shape.resize(width, height);
    penpotUtils.setParentXY(shape, x, y);
    return shape;
  };
  const makeText = (parent, name, characters, x, y, width, height, size, weight, lineHeight, color, align = 'left') => {
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
  const rectangle = (parent, name, x, y, width, height, color, radius = 0, opacity = 1) => {
    const shape = penpot.createRectangle();
    shape.name = name;
    shape.fills = [{ fillColor: color, fillOpacity: opacity }];
    shape.strokes = [];
    shape.borderRadius = radius;
    parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const board = (parent, name, x, y, width, height, color = null, radius = 0) => {
    const shape = penpot.createBoard();
    shape.name = name;
    shape.fills = color ? [{ fillColor: color, fillOpacity: 1 }] : [];
    shape.strokes = [];
    shape.borderRadius = radius;
    shape.clipContent = true;
    if (parent) parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };

  const overrideExactText = (root, pattern, value) => {
    const target = walk(root).find((shape) => shape.type === 'text' && pattern.test(shape.name));
    if (!target) throw new Error(`missing text override target: ${pattern}`);
    target.characters = value;
    return target.id;
  };

  const fixtureName = (eventId, viewport) => `event.real.${eventId} · ${viewport} · source-exact`;

  async function ensureCardAdapter(eventId, viewport) {
    assertContext();
    const spec = EVENTS[eventId];
    if (!spec || !['desktop', 'mobile'].includes(viewport)) throw new Error(`unknown OV-44 card ${eventId}/${viewport}`);
    const name = fixtureName(eventId, viewport);
    const existing = componentByIdentity(FIXTURE_PATH, name);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id, path: FIXTURE_PATH, name };
    const template = componentById(spec.template[viewport]);
    if (!template) throw new Error(`missing certified EventCard template component ${spec.template[viewport]}`);
    const uploaded = await penpot.uploadMediaUrl(`OV44 event.real.${eventId}`, spec.image);
    const block = penpot.history.undoBlockBegin();
    try {
      const [width, height] = spec.geometry[viewport];
      const wrapper = board(null, `${FIXTURE_PATH} / ${name}`, 4200 + Number(eventId) % 7 * 40, viewport === 'desktop' ? 1500 : 2500, width, height);
      const card = template.instance();
      card.name = `linked EventCard v2 / event.real.${eventId} / collection=free / ${viewport}`;
      wrapper.appendChild(card);
      place(card, 0, 0, width, height);
      overrideExactText(card, /^Content \/ Event title$/, spec.title);
      overrideExactText(card, /^Label \/ instance content$/, spec.type);
      overrideExactText(card, /^Content \/ Event occurrence$/, spec.occurrence);
      overrideExactText(card, /^Value \/ instance content$/, spec.price);
      overrideExactText(card, /^Content \/ Event place$/, spec.place);
      const mediaShapes = walk(card).filter((shape) => Array.isArray(shape.fills)
        && shape.fills.some((fill) => fill.fillImage));
      if (!mediaShapes.length) throw new Error(`no source media fill in EventCard template ${spec.template[viewport]}`);
      for (const shape of mediaShapes) {
        shape.fills = shape.fills.map((fill) => fill.fillImage
          ? { ...fill, fillImage: uploaded, fillOpacity: 1 }
          : fill);
      }
      const component = penpot.library.local.createComponent([wrapper]);
      return {
        existing: false,
        id: component.id,
        main: component.mainInstance().id,
        path: component.path,
        name: component.name,
        sourceTemplate: template.id,
        linkedTemplate: card.component()?.id,
        media: uploaded.id,
        mediaShapeCount: mediaShapes.length,
      };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function makeMedallion(parent, viewport) {
    const size = viewport === 'desktop' ? 294 : 96;
    const x = viewport === 'desktop' ? 830 : 252;
    const y = viewport === 'desktop' ? 102 : 118;
    const root = board(parent, `Free collection medallion / ${viewport}`, x, y, size, size);
    root.clipContent = false;
    const outer = penpot.createEllipse();
    outer.name = 'Medallion / outer';
    outer.fills = [{ fillColor: '#f7f3ec', fillOpacity: 1 }];
    outer.strokes = [{ strokeColor: '#5f5a54', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: viewport === 'desktop' ? 6 : 2, strokeAlignment: 'inner' }];
    root.appendChild(outer);
    place(outer, 0, 0, size, size);
    makeText(root, 'Medallion / star', '★', 0, size * 0.12, size, size * 0.18, size * 0.14, 800, 1, '#5f5a54', 'center');
    makeText(root, 'Medallion / zero price', '0 ₽', 0, size * 0.34, size, size * 0.28, size * 0.27, 850, 0.95, '#302d29', 'center');
    makeText(root, 'Medallion / free label', 'БЕСПЛАТНО', 0, size * 0.67, size, size * 0.12, size * 0.085, 800, 1, '#5f5a54', 'center');
    return root;
  }

  function makeHero(parent, viewport) {
    if (viewport === 'desktop') {
      const hero = board(parent, 'Free collection / Hero / desktop', 0, 84, 1180, 500, '#fffdf8', 32);
      rectangle(hero, 'Hero / green atmosphere', 760, 0, 420, 500, '#eef5e7', 0, 0.88);
      makeText(hero, 'Eyebrow / source exact', 'ГОТОВАЯ ПОДБОРКА', 64, 65, 560, 20, 16, 800, 1.2, '#a43c1b');
      makeText(hero, 'Title / source exact', 'Бесплатные\nсобытия', 64, 92, 670, 170, 72, 900, 0.92, '#221a14');
      makeText(hero, 'Lead / source exact', 'Все актуальные события с подтверждённым бесплатным входом,\nвключая продолжающиеся выставки.', 64, 278, 680, 58, 20, 500, 1.45, '#493d35');
      makeText(hero, 'Criteria / source exact', 'Как собрана: Событие активно, ещё не закончилось, а в выгрузке афиши вход\nподтверждён как бесплатный.', 64, 350, 690, 52, 17, 500, 1.45, '#493d35');
      makeText(hero, 'Updated / source exact', 'Данные афиши обновлены 2026-07-23; подборка рассчитана на 2026-07-23. Это не личный\nсохранённый поиск.', 64, 422, 700, 42, 14, 500, 1.45, '#786c63');
      makeMedallion(hero, viewport);
      return hero;
    }
    const hero = board(parent, 'Free collection / Hero / mobile', 0, 74, 366, 436, '#fffdf8', 24);
    rectangle(hero, 'Hero / green atmosphere', 230, 0, 136, 436, '#eef5e7', 0, 0.88);
    makeText(hero, 'Eyebrow / source exact', 'ГОТОВАЯ ПОДБОРКА', 18, 28, 220, 16, 11, 800, 1.2, '#a43c1b');
    makeText(hero, 'Title / source exact', 'Бесплатные\nсобытия', 18, 51, 236, 92, 38, 900, 0.94, '#221a14');
    makeText(hero, 'Lead / source exact', 'Все актуальные события с подтверждённым бесплатным входом, включая продолжающиеся выставки.', 18, 158, 220, 64, 15, 500, 1.35, '#493d35');
    makeText(hero, 'Criteria / source exact', 'Как собрана: событие активно, ещё не закончилось, а вход подтверждён как бесплатный.', 18, 244, 312, 58, 12, 500, 1.35, '#493d35');
    makeText(hero, 'Updated / source exact', 'Данные афиши обновлены 2026-07-23. Это не личный сохранённый поиск.', 18, 326, 312, 48, 11, 500, 1.35, '#786c63');
    makeMedallion(hero, viewport);
    return hero;
  }

  function ensureBody(viewport) {
    assertContext();
    if (!['desktop', 'mobile'].includes(viewport)) throw new Error(`unknown OV-44 body viewport ${viewport}`);
    const name = BODY_NAME[viewport];
    const existing = componentByIdentity(BODY_PATH, name);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id, path: BODY_PATH, name };
    const adapters = [7030, 6947, 7006].map((eventId) => componentByIdentity(FIXTURE_PATH, fixtureName(eventId, viewport)));
    if (adapters.some((component) => !component)) throw new Error(`create all three ${viewport} fixture adapters before the body`);
    const block = penpot.history.undoBlockBegin();
    try {
      const width = viewport === 'desktop' ? 1180 : 366;
      const height = viewport === 'desktop' ? 2200 : 2260;
      const root = board(null, `${BODY_PATH} / ${name}`, viewport === 'desktop' ? 5200 : 6500, 0, width, height);
      root.fills = [];
      makeText(root, 'Breadcrumb / source exact', 'Афиша  /  Бесплатные события', 0, viewport === 'desktop' ? 24 : 20, width, 24, viewport === 'desktop' ? 14 : 12, 600, 1.3, '#756b64');
      makeHero(root, viewport);
      if (viewport === 'desktop') {
        const results = board(root, 'Free collection / Results / desktop', 0, 617, 1180, 1535, '#fffdf8', 26);
        makeText(results, 'Results heading / source exact', '23 событий', 49, 44, 520, 54, 40, 900, 1.1, '#221a14');
        const positions = [[49, 109], [597.1875, 109], [49, 870]];
        adapters.forEach((component, index) => {
          const card = component.instance();
          card.name = `linked Free collection EventCard / event.real.${[7030, 6947, 7006][index]}`;
          results.appendChild(card);
          const [w, h] = EVENTS[[7030, 6947, 7006][index]].geometry.desktop;
          place(card, positions[index][0], positions[index][1], w, h);
        });
      } else {
        const results = board(root, 'Free collection / Results / mobile', 0, 530, 366, 1715, '#fffdf8', 20);
        makeText(results, 'Results heading / source exact', '23 событий', 13, 28, 320, 42, 30, 900, 1.1, '#221a14');
        const positions = [[13, 79], [13, 556.125], [13, 1159.140625]];
        adapters.forEach((component, index) => {
          const card = component.instance();
          card.name = `linked Free collection EventCard / event.real.${[7030, 6947, 7006][index]}`;
          results.appendChild(card);
          const [w, h] = EVENTS[[7030, 6947, 7006][index]].geometry.mobile;
          place(card, positions[index][0], positions[index][1], w, h);
        });
      }
      const component = penpot.library.local.createComponent([root]);
      return { existing: false, id: component.id, main: component.mainInstance().id, path: component.path, name: component.name };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function applyOwner(viewport) {
    assertContext();
    const owner = penpot.currentPage.getShapeById(viewport === 'desktop' ? DESKTOP_OWNER_ID : MOBILE_OWNER_ID);
    if (!owner?.isComponentMainInstance()) throw new Error(`missing Collections ${viewport} owner main`);
    const bodyComponent = componentByIdentity(BODY_PATH, BODY_NAME[viewport]);
    if (!bodyComponent) throw new Error(`missing Collections Free ${viewport} body`);
    const keepId = viewport === 'desktop' ? DESKTOP_HEADER_ID : MOBILE_HEADER_ID;
    const navId = viewport === 'mobile' ? MOBILE_NAV_ID : null;
    const existingBody = [...owner.children].find((shape) => shape.isComponentCopyInstance?.() && shape.component()?.id === bodyComponent.id);
    const header = [...owner.children].find((shape) => shape.isComponentCopyInstance?.() && shape.component()?.id === keepId);
    const nav = navId ? [...owner.children].find((shape) => shape.isComponentCopyInstance?.() && shape.component()?.id === navId) : null;
    if (!header || (viewport === 'mobile' && !nav)) throw new Error(`Collections ${viewport} shell linkage missing`);
    const block = penpot.history.undoBlockBegin();
    try {
      for (const child of [...owner.children]) {
        if (child.id !== header.id && child.id !== nav?.id && child.id !== existingBody?.id) child.remove();
      }
      owner.resize(viewport === 'desktop' ? 1280 : 390, 1200);
      owner.clipContent = true;
      owner.name = `Archetype / Collections / viewport=${viewport};state=free-collection · Astro AS-IS`;
      place(header, 0, 0, viewport === 'desktop' ? 1280 : 390, viewport === 'desktop' ? 57 : 84);
      const body = existingBody ?? bodyComponent.instance();
      if (!existingBody) owner.appendChild(body);
      body.name = `linked Collections / Free body / ${viewport};fixture=2026-07-23`;
      place(body, viewport === 'desktop' ? 50 : 12, viewport === 'desktop' ? 57 : 84, viewport === 'desktop' ? 1180 : 366, viewport === 'desktop' ? 2200 : 2260);
      if (nav) place(nav, 0, 1136, 390, 64);
      return {
        owner: { id: owner.id, width: owner.width, height: owner.height, name: owner.name },
        header: { id: header.id, componentId: header.component()?.id },
        body: { id: body.id, componentId: body.component()?.id, width: body.width, height: body.height },
        nav: nav ? { id: nav.id, componentId: nav.component()?.id } : null,
        validation: penpot.currentFile.validate(),
      };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function readback() {
    assertContext();
    const summarize = (shape) => ({
      id: shape.id,
      name: shape.name,
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
      isCopy: shape.isComponentCopyInstance?.() ?? false,
      isMain: shape.isComponentMainInstance?.() ?? false,
      componentId: shape.component?.()?.id ?? null,
    });
    const owners = [DESKTOP_OWNER_ID, MOBILE_OWNER_ID].map((id) => penpot.currentPage.getShapeById(id));
    return {
      owners: owners.map((owner) => ({ root: summarize(owner), direct: [...owner.children].map(summarize) })),
      adapters: ['desktop', 'mobile'].flatMap((viewport) => [7030, 6947, 7006].map((eventId) => {
        const component = componentByIdentity(FIXTURE_PATH, fixtureName(eventId, viewport));
        return component ? { viewport, eventId, id: component.id, main: component.mainInstance().id } : { viewport, eventId, missing: true };
      })),
      bodies: ['desktop', 'mobile'].map((viewport) => {
        const component = componentByIdentity(BODY_PATH, BODY_NAME[viewport]);
        return component ? { viewport, id: component.id, main: component.mainInstance().id } : { viewport, missing: true };
      }),
      validation: penpot.currentFile.validate(),
    };
  }

  storage.ov44FreeCollection = {
    ensureCardAdapter,
    ensureBody,
    applyOwner,
    readback,
    constants: { FILE_ID, PAGE_ID, DESKTOP_OWNER_ID, MOBILE_OWNER_ID, EVENTS, FIXTURE_PATH, BODY_PATH, BODY_NAME },
  };
  return { installed: true, methods: Object.keys(storage.ov44FreeCollection), eventIds: Object.keys(EVENTS) };
}

if (typeof module !== 'undefined') module.exports = {
  installOv44Materializer,
  EVENTS,
  constants: {
    FILE_ID,
    PAGE_ID,
    DESKTOP_OWNER_ID,
    MOBILE_OWNER_ID,
    FIXTURE_PATH,
    BODY_PATH,
    BODY_NAME,
  },
};

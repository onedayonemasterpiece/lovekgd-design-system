/**
 * Native Page 63.08 recovery for OV-44.
 *
 * The owner projection is the real `/podborki/besplatnye-sobytiya/` viewport,
 * not the stale `/podborki/` directory. Production 23 + 14 listing stress
 * remains Astro-owned. This proof projects the bounded
 * `free-collection-5-desktop-v1` scenario: five factual source fixtures in the
 * exact Astro packer order, each through one linked canonical EventCard.
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
const STICKY_PATH = 'Collections / Free / Sticky identity';
const SCROLLED_PATH = 'Archetype / Collections / Scrolled state';
const MEDALLION_SOURCE_URL = 'https://raw.githubusercontent.com/onedayonemasterpiece/events-bot-new/49c351873d40a2ea55f0a32837c7376e344d9c17/site/public/assets/badges/free-listing-medallion.svg';

const EVENTS = {
  7030: {
    title: 'Праздник непослушания',
    type: 'встреча',
    occurrence: '23 июля 12:00',
    price: 'Бесплатно · вход свободный',
    place: 'Калининград · Научная библиотека',
    image: 'https://static.kenigevents.ru/p/image/v2/4c/4c067daf59dcdf244a89768e1d9e88168fd0c727e38732eb707fee4f29000960.webp',
    shares: 1,
    likes: 2,
    template: {
      desktop: 'b0fe69fd-ccaf-8025-8008-846f0b7f12cd',
      mobile: '7f078c80-87b8-80f5-8008-85839e8975f6',
    },
    geometry: {
      desktop: [347.328125, 511.640625],
      mobile: [340, 477.828125],
    },
    anatomy: {
      desktop: { media: 235.875, body: 156.015625, utility: 58, feedback: 56 },
      mobile: { media: 230.90625, body: 127.171875, utility: 58, feedback: 56 },
    },
  },
  7006: {
    title: 'Открытая лекция по Трансцендентальной Медитации',
    type: 'лекция',
    occurrence: '23 июля 18:00',
    price: 'Бесплатно · регистрация',
    place: 'Калининград · ТЦ «Панорама»',
    image: 'https://static.kenigevents.ru/p/image/v2/af/af810be081f4302e13a70dedc4ddd988026db5113a569c3352a7eb2eac4da851.webp',
    shares: 0,
    likes: 0,
    template: {
      desktop: 'b0fe69fd-ccaf-8025-8008-846f0b7f12cd',
      mobile: '7f078c80-87b8-80f5-8008-85839e8975f6',
    },
    geometry: {
      desktop: [347.328125, 708.421875],
      mobile: [340, 495.625],
    },
    anatomy: {
      desktop: { media: 432.65625, body: 156.015625, utility: 58, feedback: 56 },
      mobile: { media: 230.90625, body: 144.96875, utility: 58, feedback: 56 },
    },
  },
  6901: {
    title: 'Презентация сборника «Поправка на дрейф»',
    type: 'встреча',
    occurrence: '23 июля 18:30',
    price: 'Бесплатно · вход свободный',
    place: 'Калининград · Научная библиотека',
    image: 'https://static.kenigevents.ru/p/dh16/20/2061604150591030203300308030803345324933103126075a33180358010013.webp',
    shares: 6,
    likes: 53,
    template: {
      desktop: 'b0fe69fd-ccaf-8025-8008-846f0b7f12cd',
      mobile: '7f078c80-87b8-80f5-8008-85839e8975f6',
    },
    geometry: {
      desktop: [347.328125, 511.640625],
      mobile: [340, 495.625],
    },
    anatomy: {
      desktop: { media: 235.875, body: 156.015625, utility: 58, feedback: 56 },
      mobile: { media: 230.90625, body: 144.96875, utility: 58, feedback: 56 },
    },
  },
  6996: {
    title: 'Наука всегда кстати: прогулка с учёным',
    type: 'встреча',
    occurrence: '23 июля 18:30',
    price: 'Бесплатно · регистрация',
    place: 'Калининград · пруд Поплавок',
    image: null,
    shares: 0,
    likes: 0,
    template: {
      desktop: 'b0fe69fd-ccaf-8025-8008-846f0b7f12cd',
      mobile: '7f078c80-87b8-80f5-8008-85839e8975f6',
    },
    geometry: {
      desktop: [347.328125, 708.421875],
      mobile: [340, 495.625],
    },
    anatomy: {
      desktop: { media: 432.65625, body: 156.015625, utility: 58, feedback: 56 },
      mobile: { media: 230.90625, body: 144.96875, utility: 58, feedback: 56 },
    },
  },
  6997: {
    title: 'Под влиянием кроссовок с амортизирующей подошвой',
    type: 'спектакль',
    occurrence: '23 июля 19:00',
    price: 'Бесплатно · вход свободный',
    place: 'Калининград · Культурное место',
    image: 'https://static.kenigevents.ru/p/image/v2/24/24c70b7d589d2383e3d09f81c4bbcae93a99aef8ee733985d1358aadaaa78701.webp',
    shares: 0,
    likes: 0,
    template: {
      desktop: 'b0fe69fd-ccaf-8025-8008-846f0b7f12cd',
      mobile: '7f078c80-87b8-80f5-8008-85839e8975f6',
    },
    geometry: {
      desktop: [347.34375, 708.421875],
      mobile: [340, 495.625],
    },
    anatomy: {
      desktop: { media: 432.671875, body: 156.015625, utility: 58, feedback: 56 },
      mobile: { media: 230.90625, body: 144.96875, utility: 58, feedback: 56 },
    },
  },
};

const SCENARIO_ID = 'free-collection-5-desktop-v1';
const SCENARIO_EVENTS = [7006, 6996, 6997, 7030, 6901];
const REPRESENTATIVE_EVENTS = SCENARIO_EVENTS;

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

  const overrideFeedbackCounts = (root, shares, likes) => {
    const counts = walk(root).filter((shape) => shape.type === 'text' && /^Content \/ Count$/.test(shape.name));
    if (counts.length < 2) throw new Error('certified EventCard feedback count leaves are incomplete');
    counts[0].characters = String(shares);
    counts[1].characters = String(likes);
    return counts.slice(0, 2).map((shape) => shape.id);
  };

  const makeMissingMediaArtwork = (wrapper, width, height) => {
    const fallback = board(wrapper, 'Content / media fallback / event.real.6996', 0, 0, width, height, '#efe1cb');
    fallback.clipContent = true;
    rectangle(fallback, 'Fallback / warm field top', 0, 0, width, height * 0.42, '#d9b88f');
    rectangle(fallback, 'Fallback / warm field bottom', 0, height * 0.42, width, height * 0.58, '#a95a34');
    makeText(fallback, 'Fallback / date', '23 ИЮЛЯ', 24, 28, width - 48, 34, 24, 900, 1, '#fffaf2');
    makeText(fallback, 'Fallback / type', 'ВСТРЕЧА', 24, height * 0.45, width - 48, 36, 28, 900, 1, '#fffaf2');
    makeText(fallback, 'Fallback / city', 'КАЛИНИНГРАД', 24, height - 55, width - 48, 24, 16, 800, 1, '#fffaf2');
    return fallback;
  };

  const fixtureName = (eventId, viewport) => `event.real.${eventId} · ${viewport} · source-exact`;
  const stickyName = (viewport) => `viewport=${viewport};scroll=hero-passed;identity=free`;

  async function sourceMedallionMedia() {
    if (storage.ov44FreeMedallionMedia?.id) return storage.ov44FreeMedallionMedia;
    const media = await penpot.uploadMediaUrl('OV44 free-listing-medallion source SVG', MEDALLION_SOURCE_URL);
    storage.ov44FreeMedallionMedia = media;
    return media;
  }

  async function ensureCardAdapter(eventId, viewport) {
    assertContext();
    const spec = EVENTS[eventId];
    if (!spec || !['desktop', 'mobile'].includes(viewport)) throw new Error(`unknown OV-44 card ${eventId}/${viewport}`);
    const name = fixtureName(eventId, viewport);
    const existing = componentByIdentity(FIXTURE_PATH, name);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id, path: FIXTURE_PATH, name };
    const template = componentById(spec.template[viewport]);
    if (!template) throw new Error(`missing certified EventCard template component ${spec.template[viewport]}`);
    const uploaded = spec.image ? await penpot.uploadMediaUrl(`OV44 event.real.${eventId}`, spec.image) : null;
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
      // The certified desktop Large master still exposes its occurrence text
      // under the historical `schedule` leaf name; the mobile-flow master uses
      // the normalized semantic name. Bind both exact source-backed leaves.
      overrideExactText(card, /^(?:Content \/ Event occurrence|schedule)$/, spec.occurrence);
      overrideExactText(card, /^Value \/ instance content$/, spec.price);
      overrideExactText(card, /^Content \/ Event place$/, spec.place);
      overrideFeedbackCounts(card, spec.shares, spec.likes);
      const mediaShapes = walk(card).filter((shape) => Array.isArray(shape.fills)
        && shape.fills.some((fill) => fill.fillImage));
      if (!mediaShapes.length) throw new Error(`no source media fill in EventCard template ${spec.template[viewport]}`);
      if (uploaded) {
        for (const shape of mediaShapes) {
          shape.fills = shape.fills.map((fill) => fill.fillImage
            ? { ...fill, fillImage: uploaded, fillOpacity: 1 }
            : fill);
        }
      } else {
        makeMissingMediaArtwork(wrapper, width, spec.anatomy[viewport].media);
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
        media: uploaded?.id ?? null,
        mediaShapeCount: mediaShapes.length,
      };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  /**
   * Repairs the OV-44 adapter in place after owner review proved that the old
   * `844b666f` dynamic experiment had body-before-media anatomy. The adapter
   * remains data-only: its one nested card root is a linked instance of the
   * certified media-first EventCard family; only exact content, media and the
   * surface-owned used geometry are overridden.
   */
  async function repairCardAdapter(eventId, viewport) {
    assertContext();
    const spec = EVENTS[eventId];
    if (!spec || !['desktop', 'mobile'].includes(viewport)) throw new Error(`unknown OV-44 card ${eventId}/${viewport}`);
    const adapter = componentByIdentity(FIXTURE_PATH, fixtureName(eventId, viewport));
    const template = componentById(spec.template[viewport]);
    if (!adapter || !template) throw new Error(`missing adapter/template for ${eventId}/${viewport}`);
    const uploaded = spec.image ? await penpot.uploadMediaUrl(`OV44 repaired event.real.${eventId}`, spec.image) : null;
    const wrapper = adapter.mainInstance();
    const [width, height] = spec.geometry[viewport];
    const anatomy = spec.anatomy[viewport];
    const block = penpot.history.undoBlockBegin();
    try {
      for (const child of [...wrapper.children]) child.remove();
      wrapper.resize(width, height);
      wrapper.clipContent = false;
      const card = template.instance();
      card.name = `linked EventCard certified media-first / event.real.${eventId} / collection=free / ${viewport}`;
      wrapper.appendChild(card);
      place(card, 0, 0, width, height);

      const cardShapes = walk(card);
      const byName = (pattern) => cardShapes.find((shape) => pattern.test(shape.name));
      const surface = byName(/^Card surface \/ dark/);
      const media = byName(/^linked Event media frame/);
      const artwork = byName(/^Content \/ media artwork override/);
      const body = byName(/^Content \/ body/);
      const title = byName(/^Content \/ Event title$/);
      const meta = byName(/^Meta \/ wrap row$/);
      const placeClip = byName(/^Content \/ Event place \/ one-line clip$/);
      const placeText = byName(/^Content \/ Event place$/);
      const primary = byName(/^Actions \/ primary row$/);
      const feedback = byName(/^Actions \/ feedback row \/ transparent$/);
      if (![surface, media, artwork, body, title, meta, placeClip, placeText, primary, feedback].every(Boolean)) {
        throw new Error(`certified EventCard anatomy incomplete for ${eventId}/${viewport}`);
      }

      const surfaceHeight = anatomy.media + anatomy.body + anatomy.utility;
      place(surface, 0, 0, width, surfaceHeight);
      place(media, 0, 0, width, anatomy.media);
      place(artwork, 0, 0, width, anatomy.media);
      place(body, 0, anatomy.media, width, anatomy.body);
      const inset = 13.6;
      const titleHeight = eventId === 7030
        ? (viewport === 'desktop' ? 37.484375 : 17.796875)
        : (viewport === 'desktop' ? 46.625 : 35.59375);
      const metaHeight = viewport === 'desktop' ? 28 : 51.390625;
      place(title, inset, inset, width - inset * 2, titleHeight);
      place(meta, inset, inset + titleHeight + 8, width - inset * 2, metaHeight);
      place(placeClip, inset, inset + titleHeight + 8 + metaHeight + 8, width - inset * 2, 17.203125);
      place(placeText, 0, 0, width - inset * 2, 17.203125);
      place(primary, 0, anatomy.media + anatomy.body, width, anatomy.utility);
      place(feedback, 0, height - anatomy.feedback, width, anatomy.feedback);

      overrideExactText(card, /^Content \/ Event title$/, spec.title);
      overrideExactText(card, /^Label \/ instance content$/, spec.type);
      overrideExactText(card, /^(?:Content \/ Event occurrence|schedule)$/, spec.occurrence);
      overrideExactText(card, /^Value \/ instance content$/, spec.price);
      overrideExactText(card, /^Content \/ Event place$/, spec.place);
      overrideFeedbackCounts(card, spec.shares, spec.likes);
      if (uploaded) {
        artwork.fills = artwork.fills.map((fill) => fill.fillImage
          ? { ...fill, fillImage: uploaded, fillOpacity: 1 }
          : fill);
      } else {
        artwork.fills = [{ fillColor: '#efe1cb', fillOpacity: 1 }];
        makeMissingMediaArtwork(wrapper, width, anatomy.media);
      }
      return {
        adapterId: adapter.id,
        adapterMainId: wrapper.id,
        linkedTemplateId: card.component()?.id,
        linkedTemplateName: card.component()?.name,
        mediaFirst: media.y <= body.y,
        media: { width: media.width, height: media.height },
        body: { y: body.y, width: body.width, height: body.height },
        validation: await penpot.currentFile.validate(),
      };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function refreshCardConsumers() {
    assertContext();
    const block = penpot.history.undoBlockBegin();
    try {
      for (const viewport of ['desktop', 'mobile']) {
        const bodyComponent = componentByIdentity(BODY_PATH, BODY_NAME[viewport]);
        if (!bodyComponent) throw new Error(`missing ${viewport} Free body`);
        for (const shape of walk(bodyComponent.mainInstance())) {
          if (shape.isComponentCopyInstance?.() && shape.component?.()?.path === FIXTURE_PATH) shape.resetOverrides();
        }
      }
      for (const ownerId of [DESKTOP_OWNER_ID, MOBILE_OWNER_ID]) {
        const owner = penpot.currentPage.getShapeById(ownerId);
        for (const shape of walk(owner)) {
          if (shape.isComponentCopyInstance?.() && shape.component?.()?.path === BODY_PATH) shape.resetOverrides();
        }
      }
      return { validation: await penpot.currentFile.validate() };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function makeMedallion(parent, viewport, media) {
    const size = viewport === 'desktop' ? 294 : 96;
    const x = viewport === 'desktop' ? 830 : 252;
    const y = viewport === 'desktop' ? 102 : 118;
    const root = board(parent, `Free collection medallion / ${viewport}`, x, y, size, size);
    root.clipContent = false;
    const image = rectangle(root, 'Medallion / exact Astro source SVG', 0, 0, size, size, '#f7f3ec');
    image.fills = [{ fillImage: media, fillOpacity: 1 }];
    return root;
  }

  function makeHero(parent, viewport, media) {
    if (viewport === 'desktop') {
      const hero = board(parent, 'Free collection / Hero / desktop', 0, 84, 1180, 500, '#fffdf8', 32);
      rectangle(hero, 'Hero / green atmosphere', 760, 0, 420, 500, '#eef5e7', 0, 0.88);
      makeText(hero, 'Eyebrow / source exact', 'ГОТОВАЯ ПОДБОРКА', 64, 65, 560, 20, 16, 800, 1.2, '#a43c1b');
      makeText(hero, 'Title / source exact', 'Бесплатные\nсобытия', 64, 92, 670, 170, 72, 900, 0.92, '#221a14');
      makeText(hero, 'Lead / source exact', 'Все актуальные события с подтверждённым бесплатным входом,\nвключая продолжающиеся выставки.', 64, 278, 680, 58, 20, 500, 1.45, '#493d35');
      makeText(hero, 'Criteria / source exact', 'Как собрана: Событие активно, ещё не закончилось, а в выгрузке афиши вход\nподтверждён как бесплатный.', 64, 350, 690, 52, 17, 500, 1.45, '#493d35');
      makeText(hero, 'Updated / source exact', 'Данные афиши обновлены 2026-07-23; подборка рассчитана на 2026-07-23. Это не личный\nсохранённый поиск.', 64, 422, 700, 42, 14, 500, 1.45, '#786c63');
      makeMedallion(hero, viewport, media);
      return hero;
    }
    const hero = board(parent, 'Free collection / Hero / mobile', 0, 74, 366, 436, '#fffdf8', 24);
    rectangle(hero, 'Hero / green atmosphere', 230, 0, 136, 436, '#eef5e7', 0, 0.88);
    makeText(hero, 'Eyebrow / source exact', 'ГОТОВАЯ ПОДБОРКА', 18, 28, 220, 16, 11, 800, 1.2, '#a43c1b');
    makeText(hero, 'Title / source exact', 'Бесплатные\nсобытия', 18, 51, 236, 92, 38, 900, 0.94, '#221a14');
    makeText(hero, 'Lead / source exact', 'Все актуальные события с подтверждённым бесплатным входом, включая продолжающиеся выставки.', 18, 158, 220, 64, 15, 500, 1.35, '#493d35');
    makeText(hero, 'Criteria / source exact', 'Как собрана: событие активно, ещё не закончилось, а вход подтверждён как бесплатный.', 18, 244, 312, 58, 12, 500, 1.35, '#493d35');
    makeText(hero, 'Updated / source exact', 'Данные афиши обновлены 2026-07-23. Это не личный сохранённый поиск.', 18, 326, 312, 48, 11, 500, 1.35, '#786c63');
    makeMedallion(hero, viewport, media);
    return hero;
  }

  async function ensureBody(viewport) {
    assertContext();
    if (!['desktop', 'mobile'].includes(viewport)) throw new Error(`unknown OV-44 body viewport ${viewport}`);
    const name = BODY_NAME[viewport];
    const existing = componentByIdentity(BODY_PATH, name);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id, path: BODY_PATH, name };
    const adapters = REPRESENTATIVE_EVENTS.map((eventId) => componentByIdentity(FIXTURE_PATH, fixtureName(eventId, viewport)));
    if (adapters.some((component) => !component)) throw new Error(`create all three ${viewport} fixture adapters before the body`);
    const medallionMedia = await sourceMedallionMedia();
    const block = penpot.history.undoBlockBegin();
    try {
      const width = viewport === 'desktop' ? 1180 : 366;
      const height = viewport === 'desktop' ? 2200 : 2260;
      const root = board(null, `${BODY_PATH} / ${name}`, viewport === 'desktop' ? 5200 : 6500, 0, width, height);
      root.fills = [];
      makeText(root, 'Breadcrumb / source exact', 'Афиша  /  Бесплатные события', 0, viewport === 'desktop' ? 24 : 20, width, 24, viewport === 'desktop' ? 14 : 12, 600, 1.3, '#756b64');
      makeHero(root, viewport, medallionMedia);
      if (viewport === 'desktop') {
        const results = board(root, 'Free collection / Results / desktop', 0, 617, 1180, 1535, '#fffdf8', 26);
        makeText(results, 'Results heading / scenario exact', '5 событий', 49, 44, 520, 54, 40, 900, 1.1, '#221a14');
        const positions = [[49, 109], [416.328125, 109], [783.65625, 109], [49, 837.421875], [416.328125, 837.421875]];
        adapters.forEach((component, index) => {
          const card = component.instance();
          card.name = `linked Free collection EventCard / event.real.${REPRESENTATIVE_EVENTS[index]}`;
          results.appendChild(card);
          const [w, h] = EVENTS[REPRESENTATIVE_EVENTS[index]].geometry.desktop;
          place(card, positions[index][0], positions[index][1], w, h);
        });
      } else {
        const results = board(root, 'Free collection / Results / mobile', 0, 530, 366, 1715, '#fffdf8', 20);
        makeText(results, 'Results heading / source exact', '23 событий', 13, 28, 320, 42, 30, 900, 1.1, '#221a14');
        const positions = [[13, 79.546875], [13, 570.96875], [13, 1080.1875]];
        adapters.forEach((component, index) => {
          const card = component.instance();
          card.name = `linked Free collection EventCard / event.real.${REPRESENTATIVE_EVENTS[index]}`;
          results.appendChild(card);
          const [w, h] = EVENTS[REPRESENTATIVE_EVENTS[index]].geometry.mobile;
          place(card, positions[index][0], positions[index][1], w, h);
        });
      }
      const component = penpot.library.local.createComponent([root]);
      return { existing: false, id: component.id, main: component.mainInstance().id, path: component.path, name: component.name };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function repairBodyCards(viewport) {
    assertContext();
    if (!['desktop', 'mobile'].includes(viewport)) throw new Error(`unknown OV-44 body viewport ${viewport}`);
    const bodyComponent = componentByIdentity(BODY_PATH, BODY_NAME[viewport]);
    if (!bodyComponent) throw new Error(`missing ${viewport} Free body`);
    const adapters = REPRESENTATIVE_EVENTS.map((eventId) => componentByIdentity(FIXTURE_PATH, fixtureName(eventId, viewport)));
    if (adapters.some((component) => !component)) throw new Error(`missing representative ${viewport} adapters`);
    const root = bodyComponent.mainInstance();
    const results = walk(root).find((shape) => shape.name === `Free collection / Results / ${viewport}`);
    if (!results) throw new Error(`missing ${viewport} results board`);
    const positions = viewport === 'desktop'
      ? [[49, 109], [416.328125, 109], [783.65625, 109]]
      : [[13, 79.546875], [13, 570.96875], [13, 1080.1875]];
    const block = penpot.history.undoBlockBegin();
    try {
      for (const child of [...results.children]) {
        if (child.isComponentCopyInstance?.() && child.component?.()?.path === FIXTURE_PATH) child.remove();
      }
      adapters.forEach((component, index) => {
        const eventId = REPRESENTATIVE_EVENTS[index];
        const card = component.instance();
        card.name = `linked Free collection EventCard / event.real.${eventId}`;
        results.appendChild(card);
        const [width, height] = EVENTS[eventId].geometry[viewport];
        place(card, positions[index][0], positions[index][1], width, height);
      });
      for (const ownerId of [DESKTOP_OWNER_ID, MOBILE_OWNER_ID]) {
        const owner = penpot.currentPage.getShapeById(ownerId);
        for (const shape of walk(owner)) {
          if (shape.isComponentCopyInstance?.() && shape.component?.()?.id === bodyComponent.id) shape.resetOverrides();
        }
      }
      return {
        viewport,
        bodyId: bodyComponent.id,
        eventIds: REPRESENTATIVE_EVENTS,
        cards: [...results.children].filter((shape) => shape.isComponentCopyInstance?.()).map((shape) => ({
          id: shape.id,
          componentId: shape.component?.()?.id,
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
        })),
        validation: await penpot.currentFile.validate(),
      };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  /**
   * Reconciles one desktop scenario slot without rebuilding the collection body.
   * This is intentionally one-event-per-call so every mutation has a bounded,
   * identity-based readback and a 504 can never trigger a blind bulk retry.
   */
  async function reconcileDesktopScenarioSlot(eventId) {
    assertContext();
    if (!SCENARIO_EVENTS.includes(eventId)) throw new Error(`event ${eventId} is outside ${SCENARIO_ID}`);
    const bodyComponent = componentByIdentity(BODY_PATH, BODY_NAME.desktop);
    const adapter = componentByIdentity(FIXTURE_PATH, fixtureName(eventId, 'desktop'));
    if (!bodyComponent || !adapter) throw new Error(`missing desktop body/adapter for ${eventId}`);
    const root = bodyComponent.mainInstance();
    const results = walk(root).find((shape) => shape.name === 'Free collection / Results / desktop');
    if (!results) throw new Error('missing desktop results board');
    const heading = walk(results).find((shape) => shape.type === 'text' && /^Results heading/.test(shape.name));
    if (!heading) throw new Error('missing desktop results heading');
    const positions = {
      7006: [49, 109],
      6996: [416.328125, 109],
      6997: [783.65625, 109],
      7030: [49, 837.421875],
      6901: [416.328125, 837.421875],
    };
    const block = penpot.history.undoBlockBegin();
    try {
      heading.name = 'Results heading / scenario exact';
      heading.characters = '5 событий';
      const matches = [...results.children].filter((shape) => (
        shape.isComponentCopyInstance?.() && shape.component?.()?.id === adapter.id
      ));
      const card = matches[0] ?? adapter.instance();
      if (!matches.length) results.appendChild(card);
      for (const duplicate of matches.slice(1)) duplicate.remove();
      // Existing body copies carried slot-specific width/height overrides from
      // the former three-card row. Clear those before applying this scenario's
      // actual packer slot, otherwise adapter-main geometry does not propagate.
      if (matches.length) card.resetOverrides();
      card.name = `linked Free collection EventCard / event.real.${eventId} / ${SCENARIO_ID}`;
      const [width, height] = EVENTS[eventId].geometry.desktop;
      place(card, positions[eventId][0], positions[eventId][1], width, height);

      const consumerRoots = [
        penpot.currentPage.getShapeById(DESKTOP_OWNER_ID),
        componentByIdentity(SCROLLED_PATH, 'viewport=desktop;state=free-collection;scroll=hero-passed')?.mainInstance(),
      ].filter(Boolean);
      for (const consumerRoot of consumerRoots) {
        for (const shape of walk(consumerRoot)) {
          if (shape.isComponentCopyInstance?.() && shape.component?.()?.id === bodyComponent.id) shape.resetOverrides();
        }
      }

      const cards = [...results.children]
        .filter((shape) => shape.isComponentCopyInstance?.() && shape.component?.()?.path === FIXTURE_PATH)
        .sort((left, right) => left.y - right.y || left.x - right.x)
        .map((shape) => ({
          id: shape.id,
          name: shape.name,
          componentId: shape.component?.()?.id,
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
        }));
      return {
        scenarioId: SCENARIO_ID,
        eventId,
        created: !matches.length,
        heading: heading.characters,
        cards,
        validation: await penpot.currentFile.validate(),
      };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function ensureStickyIdentity(viewport) {
    assertContext();
    if (!['desktop', 'mobile'].includes(viewport)) throw new Error(`unknown OV-44 sticky viewport ${viewport}`);
    const name = stickyName(viewport);
    const existing = componentByIdentity(STICKY_PATH, name);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id, path: STICKY_PATH, name };
    const media = await sourceMedallionMedia();
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${STICKY_PATH} / ${name}`, viewport === 'desktop' ? 7800 : 8100, 0, 240, 96, '#fffdf8', 18);
      root.clipContent = false;
      makeText(root, 'State label / source exact', 'scroll=hero-passed', 16, 15, 136, 18, 11, 700, 1.2, '#756b64');
      makeText(root, 'Identity label / source exact', 'Бесплатные события', 16, 39, 136, 34, 15, 900, 1.15, '#221a14');
      const size = viewport === 'desktop' ? 58 : 50;
      const image = rectangle(root, 'Compact identity / exact Astro source SVG', 240 - size - 16, (96 - size) / 2, size, size, '#f7f3ec');
      image.fills = [{ fillImage: media, fillOpacity: 1 }];
      const component = penpot.library.local.createComponent([root]);
      return { existing: false, id: component.id, main: component.mainInstance().id, path: component.path, name: component.name, media: media.id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function applyOwner(viewport) {
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
    let result;
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
      result = {
        owner: { id: owner.id, width: owner.width, height: owner.height, name: owner.name },
        header: { id: header.id, componentId: header.component()?.id },
        body: { id: body.id, componentId: body.component()?.id, width: body.width, height: body.height },
        nav: nav ? { id: nav.id, componentId: nav.component()?.id } : null,
      };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
    return { ...result, validation: await penpot.currentFile.validate() };
  }

  async function ensureScrolledOwner(viewport) {
    assertContext();
    if (!['desktop', 'mobile'].includes(viewport)) throw new Error(`unknown OV-44 scrolled viewport ${viewport}`);
    const name = `viewport=${viewport};state=free-collection;scroll=hero-passed`;
    const existing = componentByIdentity(SCROLLED_PATH, name);
    if (existing) {
      const root = existing.mainInstance();
      const desktopScrolled = componentByIdentity(SCROLLED_PATH, 'viewport=desktop;state=free-collection;scroll=hero-passed');
      const x = viewport === 'desktop'
        ? DESKTOP_OWNER_ID && penpot.currentPage.getShapeById(DESKTOP_OWNER_ID).x + 1280 + 140
        : (desktopScrolled ? desktopScrolled.mainInstance().x + desktopScrolled.mainInstance().width + 140 : root.x);
      penpotUtils.setParentXY(root, x, root.y);
      return { existing: true, id: existing.id, main: root.id, path: SCROLLED_PATH, name, x: root.x, y: root.y };
    }
    const headerComponent = componentById(viewport === 'desktop' ? DESKTOP_HEADER_ID : MOBILE_HEADER_ID);
    const bodyComponent = componentByIdentity(BODY_PATH, BODY_NAME[viewport]);
    const stickyComponent = componentByIdentity(STICKY_PATH, stickyName(viewport));
    const navComponent = viewport === 'mobile' ? componentById(MOBILE_NAV_ID) : null;
    if (!headerComponent || !bodyComponent || !stickyComponent || (viewport === 'mobile' && !navComponent)) {
      throw new Error(`missing linked prerequisites for ${viewport} scrolled owner`);
    }
    const baseOwner = penpot.currentPage.getShapeById(viewport === 'desktop' ? DESKTOP_OWNER_ID : MOBILE_OWNER_ID);
    const width = viewport === 'desktop' ? 1280 : 390;
    const height = 1200;
    const block = penpot.history.undoBlockBegin();
    try {
      const desktopScrolled = componentByIdentity(SCROLLED_PATH, 'viewport=desktop;state=free-collection;scroll=hero-passed');
      const x = viewport === 'desktop'
        ? baseOwner.x + width + 140
        : (desktopScrolled ? desktopScrolled.mainInstance().x + desktopScrolled.mainInstance().width + 140 : baseOwner.x + width + 140);
      const root = board(null, `${SCROLLED_PATH} / ${name}`, x, baseOwner.y, width, height, '#f8f1e7');
      root.clipContent = true;
      const body = bodyComponent.instance();
      body.name = `linked Collections / Free body / ${viewport};scroll=hero-passed`;
      root.appendChild(body);
      place(body, viewport === 'desktop' ? 50 : 12, viewport === 'desktop' ? -663 : -476, viewport === 'desktop' ? 1180 : 366, viewport === 'desktop' ? 2200 : 2260);
      const header = headerComponent.instance();
      header.name = `linked Shell / Header / ${viewport};scroll=hero-passed`;
      root.appendChild(header);
      place(header, 0, 0, width, viewport === 'desktop' ? 57 : 84);
      const sticky = stickyComponent.instance();
      sticky.name = `linked Free collection / Sticky identity / ${viewport}`;
      root.appendChild(sticky);
      place(sticky, viewport === 'desktop' ? 990 : 138, viewport === 'desktop' ? 57 : 64, 240, 96);
      let nav = null;
      if (navComponent) {
        nav = navComponent.instance();
        nav.name = 'linked Shell / Mobile bottom navigation / scroll=hero-passed';
        root.appendChild(nav);
        place(nav, 0, 1136, 390, 64);
      }
      const component = penpot.library.local.createComponent([root]);
      return {
        existing: false,
        id: component.id,
        main: component.mainInstance().id,
        path: component.path,
        name: component.name,
        linked: {
          header: header.component()?.id,
          body: body.component()?.id,
          sticky: sticky.component()?.id,
          nav: nav?.component?.()?.id ?? null,
        },
        validation: await penpot.currentFile.validate(),
      };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function readback() {
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
      adapters: ['desktop', 'mobile'].flatMap((viewport) => REPRESENTATIVE_EVENTS.map((eventId) => {
        const component = componentByIdentity(FIXTURE_PATH, fixtureName(eventId, viewport));
        return component ? { viewport, eventId, id: component.id, main: component.mainInstance().id } : { viewport, eventId, missing: true };
      })),
      bodies: ['desktop', 'mobile'].map((viewport) => {
        const component = componentByIdentity(BODY_PATH, BODY_NAME[viewport]);
        return component ? { viewport, id: component.id, main: component.mainInstance().id } : { viewport, missing: true };
      }),
      stickyIdentity: ['desktop', 'mobile'].map((viewport) => {
        const component = componentByIdentity(STICKY_PATH, stickyName(viewport));
        return component ? { viewport, id: component.id, main: component.mainInstance().id } : { viewport, missing: true };
      }),
      scrolledOwners: ['desktop', 'mobile'].map((viewport) => {
        const name = `viewport=${viewport};state=free-collection;scroll=hero-passed`;
        const component = componentByIdentity(SCROLLED_PATH, name);
        return component ? { viewport, id: component.id, main: component.mainInstance().id } : { viewport, missing: true };
      }),
      validation: await penpot.currentFile.validate(),
    };
  }

  async function readbackDesktopScenario() {
    assertContext();
    const bodyComponent = componentByIdentity(BODY_PATH, BODY_NAME.desktop);
    if (!bodyComponent) throw new Error('missing desktop Free body');
    const results = walk(bodyComponent.mainInstance()).find((shape) => shape.name === 'Free collection / Results / desktop');
    if (!results) throw new Error('missing desktop results board');
    const heading = walk(results).find((shape) => shape.type === 'text' && /^Results heading/.test(shape.name));
    const cards = [...results.children]
      .filter((shape) => shape.isComponentCopyInstance?.() && shape.component?.()?.path === FIXTURE_PATH)
      .sort((left, right) => left.y - right.y || left.x - right.x)
      .map((shape) => {
        const adapter = shape.component?.();
        const match = shape.name.match(/event\.real\.(\d+)/);
        const eventId = match ? Number(match[1]) : null;
        const linkedRoots = adapter ? [...adapter.mainInstance().children].filter((candidate) => (
          candidate.isComponentCopyInstance?.() && candidate.component?.()?.id === EVENTS[eventId]?.template.desktop
        )) : [];
        return {
          eventId,
          id: shape.id,
          adapterComponentId: adapter?.id ?? null,
          adapterPath: adapter?.path ?? null,
          x: shape.x,
          y: shape.y,
          localX: shape.x - results.x,
          localY: shape.y - results.y,
          width: shape.width,
          height: shape.height,
          linkedCanonicalRoots: linkedRoots.map((candidate) => ({
            id: candidate.id,
            componentId: candidate.component?.()?.id ?? null,
            detached: !(candidate.isComponentCopyInstance?.() ?? false),
          })),
        };
      });
    return {
      scenarioId: SCENARIO_ID,
      bodyComponentId: bodyComponent.id,
      heading: heading?.characters ?? null,
      expectedEventIds: SCENARIO_EVENTS,
      cards,
      linkedCanonicalRootCount: cards.reduce((count, card) => count + card.linkedCanonicalRoots.length, 0),
      detachedCanonicalRootCount: cards.flatMap((card) => card.linkedCanonicalRoots).filter((root) => root.detached).length,
      validation: await penpot.currentFile.validate(),
    };
  }

  storage.ov44FreeCollection = {
    ensureCardAdapter,
    repairCardAdapter,
    refreshCardConsumers,
    ensureBody,
    repairBodyCards,
    reconcileDesktopScenarioSlot,
    ensureStickyIdentity,
    applyOwner,
    ensureScrolledOwner,
    readback,
    readbackDesktopScenario,
    constants: { FILE_ID, PAGE_ID, DESKTOP_OWNER_ID, MOBILE_OWNER_ID, EVENTS, REPRESENTATIVE_EVENTS, SCENARIO_EVENTS, SCENARIO_ID, FIXTURE_PATH, BODY_PATH, STICKY_PATH, SCROLLED_PATH, MEDALLION_SOURCE_URL, BODY_NAME },
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
    STICKY_PATH,
    SCROLLED_PATH,
    MEDALLION_SOURCE_URL,
    BODY_NAME,
    SCENARIO_ID,
    SCENARIO_EVENTS,
  },
};

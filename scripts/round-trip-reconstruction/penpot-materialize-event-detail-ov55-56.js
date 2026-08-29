/**
 * OV-55/56 Event Detail source states.
 *
 * Native Penpot reconstruction of real Astro fixtures:
 * - event.real.4783 portrait-series Hero image and efficient viewer;
 * - event.real.4671 Kaup transport;
 * - transport -> related events -> footer continuation order.
 *
 * The Home-only mosaic system name is intentionally absent: Event Detail owns Hero image.
 * Run one method per Penpot call on settled Page 63.07. Images are original
 * source assets, never screenshots or flattened page proxies.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880bfdfbf2ec';
const DESKTOP_HEADER_COMPONENT_ID = 'a21f5e36-5d76-8065-8008-86ae4bdf9963';
const MUZTEATR_ARTWORK_COMPONENT_ID = '45777396-2f2a-80c0-8008-819182948b91';
const KAUP_ARTWORK_COMPONENT_ID = '45777396-2f2a-80c0-8008-81916e721fe4';
const RELATED_DESKTOP_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-8860d9a764a5';
const FOOTER_VIEWPORT_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-885914f2be1b';

const PORTRAIT_PATH = 'Event detail / Hero image source state';
const PORTRAIT_NAME = 'fixture=event.real.4783;viewport=desktop;media=portrait-series';
const VIEWER_PATH = 'Event detail / Hero image gallery';
const VIEWER_NAME = 'fixture=event.real.4783;state=portrait-viewer;visible=2-of-7';
const TRANSPORT_PATH = 'Event detail / Transport source state';
const TRANSPORT_NAME = 'fixture=event.real.4671;mode=kaup;viewport=desktop';
const CONTINUATION_PATH = 'Event detail / Continuation source state';
const CONTINUATION_NAME = 'fixture=event.real.4671;order=transport-related-footer;viewport=desktop';

const MEDIA = {
  hero: 'https://static.kenigevents.ru/p/dh16/02/02904290029024902510258024603260e6380c1858d8182c0e9414020c000600.webp',
  portrait: 'https://static.kenigevents.ru/p/dh16/e5/e5c0c460c26042706270667020eda2cda64ce4ec44dc64d824b224b804b806b4.webp',
  rail1: 'https://static.kenigevents.ru/p/thumb/v1/e0/e0f115aeeab9825aac7e8d96b3a061f126d44c31728a532c2dbf5837079d1b0b/256.webp',
  rail2: 'https://static.kenigevents.ru/p/thumb/v1/af/af0d7d271a79680a023f3811ed7d8eded2772d270302055c7af10d5361063bab/256.webp',
  rail3: 'https://static.kenigevents.ru/p/thumb/v1/e6/e650f647d0a087e0c7a5543f8458292a03d37acf76db97c7c5f67b160e377a54/256.webp',
  rail4: 'https://static.kenigevents.ru/p/thumb/v1/c7/c782800a602bc4838827ea3a967a00f31f2a8a32b74d26ec20f6145c49f01cfc/256.webp',
};

function installOv55Ov56EventDetailMaterializer(penpot, penpotUtils, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Event detail page ${PAGE_ID}`);
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
  const imageRect = (parent, name, media, x, y, width, height, radius = 0) => {
    const shape = penpot.createRectangle();
    shape.name = name;
    shape.fills = [{ fillImage: media, fillOpacity: 1 }];
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

  async function ensurePortraitHeroImage() {
    assertContext();
    const existing = componentByIdentity(PORTRAIT_PATH, PORTRAIT_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const uploaded = {};
    for (const [key, url] of Object.entries(MEDIA)) uploaded[key] = await penpot.uploadMediaUrl(`event-4783-${key}`, url);
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${PORTRAIT_PATH} / ${PORTRAIT_NAME}`, 6000, 0, 1280, 900, '#fbf5eb', 20, true);
      root.strokes = [{ strokeColor: '#e1d3c2', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      const header = linked(DESKTOP_HEADER_COMPONENT_ID, 'linked Shell / Desktop header');
      root.appendChild(header); place(header, 0, 0, 1280, 57);

      const media = board(root, 'Hero image / portrait-series / event.real.4783', 0, 57, 640, 843, '#111111', 0, true);
      imageRect(media, 'Hero image asset / source index 0 / portrait', uploaded.hero, 0, 0, 640, 704.2);
      const rail = board(media, 'Hero image rail / source exact', 0, 704.2, 640, 138.8, '#221f1c');
      const railSpecs = [
        ['rail1', 48, 12, 86, 114],
        ['rail2', 144, 12, 76, 114],
        ['rail3', 230, 12, 86, 114],
        ['rail4', 326, 12, 164, 114],
      ];
      railSpecs.forEach(([key, x, y, width, height], index) => imageRect(rail, `Hero image thumbnail / ${index + 1}`, uploaded[key], x, y, width, height, 8));
      const more = board(rail, 'Hero image thumbnail / remaining +2', 500, 12, 92, 114, '#fffaf2', 8);
      text(more, 'Remaining count', '+2', 0, 42, 92, 20, 14, 900, 1, '#241913', 'center');
      text(more, 'Remaining label', 'фото', 0, 64, 92, 16, 10, 700, 1, '#766b63', 'center');

      const detail = board(root, 'Event detail decision / portrait-series source exact', 640, 57, 640, 843, '#fbf5eb');
      text(detail, 'Breadcrumb', 'Афиша  ›  Мюзикл «Алые паруса»', 46, 45, 420, 20, 12, 500, 1.2, '#8e7565');
      text(detail, 'Event type', 'СПЕКТАКЛЬ', 46, 80, 140, 20, 13, 900, 1.2, '#9a3f20');
      text(detail, 'Date', '17 июля', 406, 78, 86, 26, 19, 900, 1.2, '#9a3f20');
      text(detail, 'Weekday', 'пятница', 500, 84, 66, 18, 13, 800, 1.2, '#766b63');
      text(detail, 'Time', '19:00', 570, 78, 62, 26, 19, 900, 1.2, '#9a3f20');
      text(detail, 'Event title', 'Мюзикл «Алые\nпаруса»', 46, 112, 530, 92, 42, 900, 0.96, '#241913');
      text(detail, 'Venue', '●  Музыкальный театр', 46, 212, 390, 24, 16, 800, 1.2, '#241913');
      text(detail, 'Address', 'Мира 87', 72, 241, 260, 20, 13, 700, 1.2, '#766b63');
      const medallion = board(detail, 'Medallion / muzteatr39 / linked artwork', 46, 274, 86, 86, '#fffaf2', 43);
      const artwork = linked(MUZTEATR_ARTWORK_COMPONENT_ID, 'linked Medallion / Artwork / muzteatr39');
      medallion.appendChild(artwork); place(artwork, 3, 3, 80, 80);

      const actions = board(detail, 'Action panel / source exact', 38, 390, 564, 102, '#2c2723', 22);
      text(actions, 'Admission label', 'ВХОД', 20, 24, 90, 18, 11, 900, 1.1, '#d6c8bd');
      text(actions, 'Admission', 'Билеты', 20, 43, 100, 26, 20, 900, 1.1, '#fffaf2');
      rectangle(actions, 'Primary action', 150, 21, 124, 60, '#c64f21', 18);
      text(actions, 'Primary action label', '▣  Билеты', 150, 40, 124, 22, 15, 900, 1.1, '#ffffff', 'center');
      rectangle(actions, 'Calendar action', 286, 21, 136, 60, '#3c3733', 18);
      text(actions, 'Calendar action label', '▣ В календарь', 286, 40, 136, 22, 14, 800, 1.1, '#fffaf2', 'center');
      rectangle(actions, 'Share action', 432, 21, 52, 60, '#3c3733', 18);
      text(actions, 'Share action label', '↗', 432, 37, 52, 28, 24, 700, 1, '#fffaf2', 'center');
      rectangle(actions, 'Like action', 494, 21, 52, 60, '#3c3733', 18);
      text(actions, 'Like action label', '♡ 4', 494, 38, 52, 24, 17, 700, 1, '#fffaf2', 'center');

      text(detail, 'About eyebrow', 'О СОБЫТИИ', 38, 555, 160, 20, 13, 900, 1.2, '#9a3f20');
      text(detail, 'About lead', 'Музыкальный спектакль по мотивам\nповести Александра Грина\nрассказывает историю веры в мечту и\nлюбовь Ассоль.', 38, 588, 560, 120, 28, 800, 1.13, '#241913');
      const quote = board(detail, 'Editorial quote', 38, 724, 560, 92, '#fff1df', 14);
      rectangle(quote, 'Editorial quote rule', 0, 0, 4, 92, '#b84820');
      text(quote, 'Editorial quote text', '«Повесть Александра Грина “Алые паруса” —\nистория о девушке Ассоль и капитане Грее»', 20, 19, 520, 54, 16, 500, 1.4, '#3a2b23');
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, media: Object.values(uploaded).map((item) => item.id), linked: [header.component()?.id, artwork.component()?.id] };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function ensurePortraitViewer() {
    assertContext();
    const existing = componentByIdentity(VIEWER_PATH, VIEWER_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const hero = await penpot.uploadMediaUrl('event-4783-viewer-hero', MEDIA.hero);
    const portrait = await penpot.uploadMediaUrl('event-4783-viewer-portrait', MEDIA.portrait);
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${VIEWER_PATH} / ${VIEWER_NAME}`, 6000, 940, 1280, 720, '#11100f', 20, true);
      text(root, 'Viewer title', 'Мюзикл «Алые паруса»', 38, 18, 260, 20, 15, 900, 1.1, '#fffaf2');
      text(root, 'Viewer date', '17 июля · 19:00', 318, 18, 160, 20, 14, 800, 1.1, '#fffaf2');
      text(root, 'Viewer quality note', 'Показаны 7 из 12 изображений в лучшем качестве', 500, 18, 390, 20, 12, 600, 1.1, '#a99b91');
      rectangle(root, 'Viewer close', 1218, 10, 44, 44, '#302d2a', 22);
      text(root, 'Viewer close label', '×', 1218, 18, 44, 28, 24, 600, 1, '#fffaf2', 'center');
      imageRect(root, 'Viewer Hero image / source index 0', hero, 0, 68, 642, 642, 12);
      imageRect(root, 'Viewer Hero image / source index 4 / portrait', portrait, 652, 68, 628, 642, 12);
      rectangle(root, 'Viewer previous', 16, 346, 54, 62, '#211f1d', 18, 0.78);
      text(root, 'Viewer previous label', '‹', 16, 360, 54, 32, 32, 700, 1, '#fffaf2', 'center');
      rectangle(root, 'Viewer next', 1210, 346, 54, 62, '#211f1d', 18, 0.78);
      text(root, 'Viewer next label', '›', 1210, 360, 54, 32, 32, 700, 1, '#fffaf2', 'center');
      text(root, 'Viewer counter', 'Фото 1–2 из 7', 1124, 680, 130, 20, 12, 700, 1.1, '#fffaf2', 'right');
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, media: [hero.id, portrait.id] };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensureTransport() {
    assertContext();
    const existing = componentByIdentity(TRANSPORT_PATH, TRANSPORT_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${TRANSPORT_PATH} / ${TRANSPORT_NAME}`, 7320, 0, 733.625, 625.515625, '#fffdf8', 20, true);
      root.strokes = [{ strokeColor: '#ded5cc', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      text(root, 'Transport eyebrow', 'МАРШРУТ ИЗ КАЛИНИНГРАДА', 18, 18, 360, 18, 12, 900, 1.1, '#d14c3d');
      text(root, 'Transport title', 'Как добраться на Кауп', 18, 39, 560, 36, 28, 900, 1.05, '#1f2424');
      const kaup = linked(KAUP_ARTWORK_COMPONENT_ID, 'linked Medallion / Artwork / kaup');
      root.appendChild(kaup); place(kaup, 664, 17, 48, 48);

      const ticket = board(root, 'Transport ticket strip', 0, 78, 733.625, 98, '#302a25');
      text(ticket, 'Transport offer', 'Официальный трансфер · 600 ₽ туда и обратно', 18, 17, 460, 22, 17, 900, 1.1, '#fffaf2');
      text(ticket, 'Transport conditions', 'Точки посадки и условия ⌄', 18, 56, 270, 20, 13, 800, 1.1, '#ddd1c7');
      rectangle(ticket, 'Transport primary action', 528, 27, 189, 45, '#d55223', 12);
      text(ticket, 'Transport primary label', '▣  Купить трансфер', 528, 40, 189, 20, 14, 900, 1.1, '#ffffff', 'center');

      const schedule = board(root, 'Transport bus schedule', 17, 188, 700, 310, '#f4f1e7', 18);
      rectangle(schedule, 'Bus route chip', 13, 13, 49, 50, '#0e7163', 12);
      text(schedule, 'Bus route chip label', '▣ 119', 13, 29, 49, 18, 14, 900, 1, '#ffffff', 'center');
      text(schedule, 'Bus route title', 'Автобус до Романово', 72, 17, 320, 24, 18, 900, 1.1, '#1f2424');
      text(schedule, 'Bus boarding', 'Посадка: Северный вокзал', 72, 42, 330, 18, 12, 600, 1.1, '#72706b');
      text(schedule, 'Route labels', 'рейс  Северный                         Романово                         КАУП', 16, 81, 650, 18, 11, 800, 1.1, '#72706b');
      rectangle(schedule, 'Route divider 1', 13, 100, 674, 1, '#ddd8cf');
      text(schedule, 'Trip 1', '1      ≈16:45                         ≈17:35                         ≈18:28', 16, 112, 650, 24, 15, 800, 1.1, '#1f2424');
      rectangle(schedule, 'Route divider 2', 13, 141, 674, 1, '#ddd8cf');
      text(schedule, 'Trip 2', '2      ≈18:10                         ≈19:00                         ≈19:53', 16, 153, 650, 24, 15, 800, 1.1, '#1f2424');
      text(schedule, 'Trip 2 status', 'небольшой запас', 476, 177, 170, 18, 11, 800, 1.1, '#9a3f20');
      text(schedule, 'Walk title', '♟  От Романово пешком 4 км', 16, 218, 330, 20, 13, 900, 1.1, '#0e7163');
      text(schedule, 'Walk meta', '≈53 минуты, короткого входа нет', 42, 238, 320, 18, 11, 600, 1.1, '#72706b');
      const warning = board(schedule, 'Return warning', 13, 264, 674, 33, '#fff1ce', 11);
      rectangle(warning, 'Return warning rule', 0, 0, 3, 33, '#e3a31e');
      text(warning, 'Return warning text', 'После события обратного автобуса нет', 14, 8, 560, 18, 13, 900, 1.1, '#3a2b23');

      rectangle(root, 'Car row top divider', 0, 512, 733.625, 1, '#e2d8d0');
      text(root, 'Car row', '▣   На автомобиле   Калининград → Кауп', 18, 536, 520, 20, 14, 800, 1.1, '#1f2424');
      rectangle(root, 'Sources top divider', 0, 581, 733.625, 1, '#e2d8d0');
      text(root, 'Transport sources', 'Источники: официальный сайт Кауп · расписание автобусов (с 2026-07-01).', 18, 597, 680, 18, 11, 600, 1.1, '#72706b');
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, linkedKaup: kaup.component()?.id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensureContinuation() {
    assertContext();
    const existing = componentByIdentity(CONTINUATION_PATH, CONTINUATION_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const transport = componentByIdentity(TRANSPORT_PATH, TRANSPORT_NAME);
    if (!transport) throw new Error('create the source transport component first');
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${CONTINUATION_PATH} / ${CONTINUATION_NAME}`, 7320, 680, 1280, 2002, '#fbf5eb', 20, true);
      text(root, 'Continuation eyebrow', 'EVENT DETAIL · SOURCE ORDER', 50, 24, 520, 18, 12, 900, 1.2, '#9a3f20');
      text(root, 'Continuation title', 'Транспорт → похожие события → подвал', 50, 52, 1020, 42, 30, 900, 1.05, '#241913');
      const transportInstance = transport.instance(); transportInstance.name = 'linked Event detail / Transport / event.real.4671'; root.appendChild(transportInstance); place(transportInstance, 273, 118, 733.625, 625.515625);

      const relatedSurface = board(root, 'Related events surface / source exact', 0, 782, 1280, 540, '#24211f');
      const related = linked(RELATED_DESKTOP_COMPONENT_ID, 'linked Event detail / Related viewport / desktop');
      relatedSurface.appendChild(related); place(related, 50, 20, 1180, 520);

      const footer = linked(FOOTER_VIEWPORT_COMPONENT_ID, 'linked Shell / Desktop footer viewport');
      root.appendChild(footer); place(footer, 0, 1320, 1280, 681.859375);
      const component = createComponent(root);
      return { existing: false, id: component.id, main: component.mainInstance().id, linked: [transport.id, related.component()?.id, footer.component()?.id] };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function readback() {
    assertContext();
    const identities = [
      [PORTRAIT_PATH, PORTRAIT_NAME],
      [VIEWER_PATH, VIEWER_NAME],
      [TRANSPORT_PATH, TRANSPORT_NAME],
      [CONTINUATION_PATH, CONTINUATION_NAME],
    ];
    return {
      components: identities.map(([path, name]) => {
        const component = componentByIdentity(path, name);
        if (!component) return { path, name, missing: true };
        const main = component.mainInstance();
        return { path, name, id: component.id, main: main.id, width: main.width, height: main.height, direct: [...main.children].map((shape) => ({ name: shape.name, x: shape.x - main.x, y: shape.y - main.y, width: shape.width, height: shape.height, componentId: shape.component?.()?.id ?? null })) };
      }),
      validation: await penpot.currentFile.validate(),
    };
  }

  storage.ov55Ov56EventDetail = {
    ensurePortraitHeroImage,
    ensurePortraitViewer,
    ensureTransport,
    ensureContinuation,
    readback,
  };
  return { installed: true, methods: Object.keys(storage.ov55Ov56EventDetail) };
}

if (typeof module !== 'undefined') {
  module.exports = {
    installOv55Ov56EventDetailMaterializer,
    constants: {
      FILE_ID,
      PAGE_ID,
      DESKTOP_HEADER_COMPONENT_ID,
      MUZTEATR_ARTWORK_COMPONENT_ID,
      KAUP_ARTWORK_COMPONENT_ID,
      RELATED_DESKTOP_COMPONENT_ID,
      FOOTER_VIEWPORT_COMPONENT_ID,
    },
  };
}

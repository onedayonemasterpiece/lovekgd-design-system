/** OV-06 exact-seven native artifact collection over the 008839b visual donor. */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880f9a822a76';
const ASTRO_COMMIT = '70d43a87bf7fdfb748ace6218f17befd0613d01a';
const VISUAL_DONOR = '008839b14598105d1fed5b4e386d6d6f29d93d1f';
const DESKTOP_BODY_COMPONENT = 'd87e18f1-dcb4-80a6-8008-886a9e3cb500';
const MOBILE_BODY_COMPONENT = 'd87e18f1-dcb4-80a6-8008-886a9eb225d0';
const DESKTOP_OWNER_MAIN = 'd87e18f1-dcb4-80a6-8008-880f9aaea84e';
const MOBILE_OWNER_MAIN = 'd87e18f1-dcb4-80a6-8008-880f9c4c81c4';
const ARTIFACTS = [
  ['amber_cosmonaut', 'Янтарный космонавт', '8f804431-c282-8075-8008-8db5b8f67f28'],
  ['baltic_light', 'Балтийский маяк', '8f804431-c282-8075-8008-8db5b940e564'],
  ['luise_queen_bridge', 'Мост королевы Луизы', '8f804431-c282-8075-8008-8db5b98fcdc2'],
  ['marzipan_heart', 'Марципановое сердце', '8f804431-c282-8075-8008-8db5b9eb27fe'],
  ['sedov_bell', 'Колокол «Седов»', '8f804431-c282-8075-8008-8db5baabe2fc'],
  ['cosmonaut', 'Космонавт', '8f804431-c282-8075-8008-8db5bb3b14a1'],
  ['old_brick', 'Старый кирпич', '8f804431-c282-8075-8008-8db5bc09c066'],
];

function installArtifactsOv06VisualDonorMaterializer(penpot, penpotUtils, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Artifacts page ${PAGE_ID}`);
    }
  };
  const componentById = (id) => penpot.library.local.components.find((component) => component.id === id);
  const place = (shape, x, y, width, height) => {
    if (shape.layoutChild) shape.layoutChild.absolute = true;
    if (width != null && height != null) shape.resize(width, height);
    penpotUtils.setParentXY(shape, x, y);
    return shape;
  };
  const replaceChildren = (root) => [...root.children].forEach((child) => child.remove());
  const rectangle = (parent, name, x, y, width, height, color, radius = 0, stroke = null, opacity = 1) => {
    const shape = penpot.createRectangle();
    shape.name = name;
    shape.fills = [{ fillColor: color, fillOpacity: opacity }];
    shape.strokes = stroke ? [{ strokeColor: stroke, strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }] : [];
    shape.borderRadius = radius;
    parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const ellipse = (parent, name, x, y, width, height, color, opacity = 1) => {
    const shape = penpot.createEllipse();
    shape.name = name;
    shape.fills = [{ fillColor: color, fillOpacity: opacity }];
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
  const linked = (componentId, name, parent, x, y, width, height) => {
    const component = componentById(componentId);
    if (!component) throw new Error(`missing artifact visual ${componentId}`);
    const instance = component.instance();
    instance.name = name;
    parent.appendChild(instance);
    return place(instance, x, y, width, height);
  };

  function buildHero(root, mobile) {
    const x = mobile ? 0 : 30;
    const y = mobile ? 16 : 54;
    const width = mobile ? 366 : 1120;
    const height = mobile ? 440 : 484;
    rectangle(root, 'Collection hero / donor cream surface', x, y, width, height, '#f8ead3', 26, '#e1cdb4');
    ellipse(root, 'Collection hero / amber light', x + width - (mobile ? 150 : 330), y - 40, mobile ? 190 : 420, mobile ? 190 : 420, '#f3c976', 0.24);
    if (mobile) {
      text(root, 'Hero eyebrow', 'КОЛЛЕКЦИЯ № 1 · ЛОКАЛЬНАЯ\nНАХОДКА', 16, 36, 320, 42, 12, 800, 1.25, '#98401f');
      text(root, 'Hero title', 'Знаки\nЯнтарного\nкрая', 16, 92, 330, 154, 50, 800, 0.86, '#281d17');
      text(root, 'Hero lead', 'Вводная коллекция о разных гранях\nКалининградской области: море,\nприрода, архитектура, вкус и\nкосмическая история.', 16, 258, 330, 108, 16, 500, 1.38, '#281d17');
      text(root, 'Unlock threshold', '5/7', 16, 374, 130, 48, 44, 800, 0.9, '#a3431f');
      text(root, 'Unlock threshold label', 'нужно найти, чтобы\nоткрыть заявку', 16, 420, 150, 38, 11, 500, 1.25, '#76645a');
      return;
    }
    text(root, 'Hero eyebrow', 'КОЛЛЕКЦИЯ № 1 · ЛОКАЛЬНАЯ НАХОДКА', 80, 100, 560, 18, 12, 800, 1.1, '#98401f');
    text(root, 'Hero title', 'Знаки\nЯнтарного\nкрая', 80, 126, 720, 236, 100, 800, 0.86, '#281d17');
    text(root, 'Hero lead', 'Вводная коллекция о разных гранях Калининградской области: море,\nприрода, архитектура, вкус и космическая история.', 80, 382, 760, 60, 20, 500, 1.35, '#281d17');
    text(root, 'Unlock threshold', '5/7', 930, 292, 190, 90, 84, 800, 0.9, '#a3431f', 'right');
    text(root, 'Unlock threshold label', 'нужно найти, чтобы\nоткрыть заявку', 950, 386, 170, 38, 13, 500, 1.25, '#76645a', 'right');
  }

  function buildProgress(root, mobile) {
    if (mobile) {
      rectangle(root, 'Device note / surface', 0, 472, 366, 88, '#eef8f5', 16, '#b7ded8');
      text(root, 'Device note', 'Только на этом устройстве.\nКоллекция хранится в браузере, не\nотправляется на сервер и исчезнет\nпосле очистки данных сайта.', 14, 486, 338, 62, 14, 500, 1.25, '#315d57');
      text(root, 'Progress eyebrow', 'ВАШ ПРОГРЕСС', 0, 600, 180, 16, 11, 800, 1.1, '#76645a');
      text(root, 'Progress title', 'Найдено 7 из 7', 0, 626, 342, 52, 40, 800, 0.95, '#281d17');
      text(root, 'Progress copy', 'Все семь артефактов открыты.\nИсторию каждой находки можно перечитать.', 0, 686, 330, 52, 14, 400, 1.35, '#6f5e54');
      text(root, 'Progress percent', '100%', 0, 744, 110, 34, 30, 800, 1, '#a3431f');
      text(root, 'Progress percent label', 'коллекции', 0, 776, 100, 16, 11, 500, 1, '#76645a');
      rectangle(root, 'Progress track', 0, 806, 366, 8, '#eadfd4', 4);
      rectangle(root, 'Progress fill', 0, 806, 366, 8, '#d88f2f', 4);
      return;
    }
    rectangle(root, 'Device note / surface', 30, 554, 1120, 52, '#eef8f5', 16, '#b7ded8');
    text(root, 'Device note', 'Только на этом устройстве. Коллекция хранится в браузере, не отправляется на сервер и исчезнет после очистки данных сайта.', 48, 570, 1084, 22, 15, 500, 1.3, '#315d57');
    text(root, 'Progress eyebrow', 'ВАШ ПРОГРЕСС', 30, 650, 220, 16, 11, 800, 1.1, '#76645a');
    text(root, 'Progress title', 'Найдено 7 из 7', 30, 676, 720, 66, 60, 800, 0.95, '#281d17');
    text(root, 'Progress copy', 'Все семь артефактов открыты. Историю каждой находки можно перечитать.', 30, 750, 720, 28, 16, 400, 1.35, '#6f5e54');
    text(root, 'Progress percent', '100%', 1010, 710, 140, 38, 34, 800, 1, '#a3431f', 'right');
    text(root, 'Progress percent label', 'коллекции', 1050, 750, 100, 16, 11, 500, 1, '#76645a', 'right');
    rectangle(root, 'Progress track', 30, 794, 1120, 10, '#eadfd4', 5);
    rectangle(root, 'Progress fill', 30, 794, 1120, 10, '#d88f2f', 5);
  }

  function buildCards(root, mobile) {
    const columns = mobile ? 2 : 4;
    const cardWidth = mobile ? 180 : 269;
    const cardHeight = 250;
    const gap = mobile ? 6 : 14;
    const startX = mobile ? 0 : 30;
    const startY = mobile ? 840 : 830;
    ARTIFACTS.forEach(([id, titleValue, componentId], index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = startX + column * (cardWidth + gap);
      const y = startY + row * (cardHeight + gap);
      const card = penpot.createBoard();
      card.name = `Artifact card / found / ${id}`;
      card.fills = [{ fillColor: '#fff8e8', fillOpacity: 1 }];
      card.strokes = [{ strokeColor: '#e2bd84', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      card.borderRadius = mobile ? 16 : 20;
      card.clipContent = true;
      root.appendChild(card);
      place(card, x, y, cardWidth, cardHeight);
      // Preserve the certified 180 × 250 component at its native size. Resizing
      // an instance changes only its frame and clips its children; it does not
      // scale the artifact artwork. The native instance already includes the
      // exact title and found-state label, so no detached duplicate text is
      // needed in the collection card.
      linked(componentId, `linked Artifact visual / ${id}`, card, (cardWidth - 180) / 2, 0, 180, 250);
    });
    const thresholdY = startY + (mobile ? 4 : 2) * (cardHeight + gap) + 4;
    rectangle(root, 'Threshold / surface', startX, thresholdY, mobile ? 366 : 1120, mobile ? 108 : 52, '#fff5dc', 0);
    rectangle(root, 'Threshold / accent', startX, thresholdY, 4, mobile ? 108 : 52, '#cf872e', 0);
    text(root, 'Threshold / copy', 'Порог достигнут. Форма заявки откроется после запуска согласованного розыгрыша.', startX + 16, thresholdY + (mobile ? 14 : 15), mobile ? 334 : 1088, mobile ? 78 : 24, mobile ? 14 : 15, 500, 1.35, '#5f4c40');
    return thresholdY + (mobile ? 126 : 70);
  }

  function buildRules(root, mobile, startY) {
    const x = mobile ? 0 : 30;
    const width = mobile ? 366 : 1120;
    const height = mobile ? 710 : 386;
    rectangle(root, 'Rules / surface', x, startY, width, height, '#fffdf8', 26, '#e6ddd2');
    if (mobile) {
      text(root, 'Rules eyebrow', 'АВТОМАТИЧЕСКИЕ ПРАВИЛА', 18, startY + 22, 300, 16, 11, 800, 1.1, '#98401f');
      text(root, 'Rules title', 'Артефакт\nне убегает', 18, startY + 52, 330, 88, 42, 800, 0.92, '#281d17');
      text(root, 'Rules copy', '•  Закрепление. После назначения артефакт ждёт\n   в том же интерфейсном месте до находки.\n\n•  После находки. Он остаётся с отметкой\n   «Найден»; повторное нажатие открывает историю.\n\n•  После срока. Найденный артефакт остаётся\n   в архиве коллекции.\n\n•  Без лайк-гейта. Лайк, публикация, покупка\n   и темп сбора не влияют на шанс.\n\n•  Порог. 5 находок открывают одну форму заявки.', 18, startY + 164, 330, 500, 14, 500, 1.42, '#281d17');
      return;
    }
    text(root, 'Rules eyebrow', 'АВТОМАТИЧЕСКИЕ ПРАВИЛА', 72, startY + 48, 300, 16, 11, 800, 1.1, '#98401f');
    text(root, 'Rules title', 'Артефакт\nне\nубегает', 72, startY + 76, 350, 222, 58, 800, 0.9, '#281d17');
    text(root, 'Rules copy', '•  Закрепление. После назначения артефакт ждёт в том же интерфейсном\n   месте до находки или конца окна коллекции.\n\n•  После находки. Он остаётся с отметкой «Найден»; повторное нажатие\n   открывает историю.\n\n•  После срока. Найденный артефакт остаётся в архиве коллекции.\n\n•  Без лайк-гейта. Лайк, публикация, покупка и темп сбора не влияют на шанс.\n\n•  Порог. 5 находок открывают одну форму заявки.', 450, startY + 52, 620, 286, 15, 500, 1.35, '#281d17');
  }

  function repairBody(viewport) {
    assertContext();
    const mobile = viewport === 'mobile';
    const component = componentById(mobile ? MOBILE_BODY_COMPONENT : DESKTOP_BODY_COMPONENT);
    if (!component) throw new Error(`missing ${viewport} artifact body component`);
    const root = component.mainInstance();
    const block = penpot.history.undoBlockBegin();
    try {
      replaceChildren(root);
      root.resize(mobile ? 366 : 1180, mobile ? 2700 : 1900);
      root.fills = [{ fillColor: '#fbf7ef', fillOpacity: 1 }];
      root.clipContent = false;
      component.path = 'Artifacts / Collection / exact-seven';
      component.name = `viewport=${viewport};state=all-found-7-of-7;visual-donor=${VISUAL_DONOR.slice(0, 8)}`;
      root.name = `Artifacts / Collection / viewport=${viewport};state=all-found-7-of-7 · native donor reconstruction`;
      buildHero(root, mobile);
      buildProgress(root, mobile);
      const rulesY = buildCards(root, mobile);
      buildRules(root, mobile, rulesY);
      return { viewport, component: component.id, main: root.id, size: [root.width, root.height], linkedArtifacts: ARTIFACTS.length };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function repairOwners() {
    assertContext();
    const page = penpot.currentPage;
    const desktop = page.getShapeById(DESKTOP_OWNER_MAIN);
    const mobile = page.getShapeById(MOBILE_OWNER_MAIN);
    if (!desktop || !mobile) throw new Error('artifact owner roots missing');
    const block = penpot.history.undoBlockBegin();
    try {
      desktop.name = 'Archetype / Artifacts / viewport=desktop;state=all-found-7-of-7 · native donor reconstruction';
      desktop.resize(1280, 2718);
      const desktopBody = [...desktop.children].find((shape) => shape.name.includes('Artifacts / Collection'));
      const footer = [...desktop.children].find((shape) => shape.name.includes('Footer') || shape.name.includes('footer'));
      if (!desktopBody || !footer) throw new Error('desktop body/footer missing');
      desktopBody.name = 'linked Artifacts / Collection / desktop;state=all-found-7-of-7';
      place(desktopBody, 50, 88, 1180, 1900);
      place(footer, 0, 2036.109375, 1280, 681.859375);

      mobile.name = 'Archetype / Artifacts / viewport=mobile;state=all-found-7-of-7 · native donor reconstruction';
      mobile.resize(390, 2951);
      const mobileBody = [...mobile.children].find((shape) => shape.name.includes('Artifacts / Collection'));
      const nav = [...mobile.children].find((shape) => shape.name.includes('bottom navigation'));
      if (!mobileBody || !nav) throw new Error('mobile body/navigation missing');
      mobileBody.name = 'linked Artifacts / Collection / mobile;state=all-found-7-of-7';
      place(mobileBody, 12, 84, 366, 2700);
      place(nav, 0, 2887, 390, 64);
      return { desktop: desktop.id, mobile: mobile.id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function readback() {
    assertContext();
    const bodies = [DESKTOP_BODY_COMPONENT, MOBILE_BODY_COMPONENT].map((id) => {
      const component = componentById(id);
      const main = component.mainInstance();
      const direct = [...main.children];
      return {
        id,
        name: component.name,
        main: main.id,
        size: [main.width, main.height],
        cards: direct.filter((shape) => shape.name.startsWith('Artifact card / found')).length,
        linkedArtifacts: direct.flatMap((shape) => shape.children || []).filter((shape) => shape.name.startsWith('linked Artifact visual /')).map((shape) => shape.component?.()?.id),
        sourceProjectionCount: direct.filter((shape) => /projection|screenshot/i.test(shape.name)).length,
      };
    });
    const owners = [DESKTOP_OWNER_MAIN, MOBILE_OWNER_MAIN].map((id) => {
      const main = penpot.currentPage.getShapeById(id);
      return { id, name: main.name, size: [main.width, main.height], direct: [...main.children].map((shape) => ({ name: shape.name, componentId: shape.component?.()?.id || null, x: shape.x, y: shape.y, width: shape.width, height: shape.height })) };
    });
    return { astroCommit: ASTRO_COMMIT, visualDonor: VISUAL_DONOR, bodies, owners, validation: await penpot.currentFile.validate() };
  }

  storage.artifactsOv06VisualDonor = { repairBody, repairOwners, readback };
  return { installed: true, methods: Object.keys(storage.artifactsOv06VisualDonor) };
}

if (typeof module !== 'undefined') {
  module.exports = { installArtifactsOv06VisualDonorMaterializer, constants: { FILE_ID, PAGE_ID, ASTRO_COMMIT, VISUAL_DONOR, DESKTOP_BODY_COMPONENT, MOBILE_BODY_COMPONENT, DESKTOP_OWNER_MAIN, MOBILE_OWNER_MAIN }, ARTIFACTS };
}

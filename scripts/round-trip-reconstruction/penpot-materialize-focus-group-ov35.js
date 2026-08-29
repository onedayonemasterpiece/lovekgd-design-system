/**
 * OV-35 Focus-group invitation reconstruction.
 *
 * Materializes the factual standalone Astro onboarding route and its tested
 * six-digit email OTP state. The former generic programme boards are not used
 * as source evidence.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880f767c3eb3';
const ASTRO_COMMIT = '49c351873d40a2ea55f0a32837c7376e344d9c17';
const DESKTOP_INSTALL_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880f875c3936';
const MOBILE_INSTALL_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880f89baa11a';
const OWNER_PATH = 'Archetype / Focus group / invitation source exact';
const DESKTOP_OTP_NAME = 'viewport=desktop;route=focus-invitation;stage=email-otp';
const MOBILE_OTP_NAME = 'viewport=mobile;route=focus-invitation;stage=email-otp';
const RAW = `https://raw.githubusercontent.com/onedayonemasterpiece/events-bot-new/${ASTRO_COMMIT}/site/public`;
const MEDIA = {
  brand: `${RAW}/assets/pwa/announcements-brand-v2-192.png`,
  flask: `${RAW}/assets/icons/lab-flask-287837.svg`,
};
const DEPRECATED_IDS = [
  'd87e18f1-dcb4-80a6-8008-886983ff529e',
  'd87e18f1-dcb4-80a6-8008-886984f41f01',
  'd87e18f1-dcb4-80a6-8008-886985bf91a6',
  'd87e18f1-dcb4-80a6-8008-8869866b4ff9',
  'd87e18f1-dcb4-80a6-8008-886989642a9c',
  'd87e18f1-dcb4-80a6-8008-886989cd9ef2',
  'd87e18f1-dcb4-80a6-8008-88698a444289',
  'd87e18f1-dcb4-80a6-8008-88698aca30e3',
  'd87e18f1-dcb4-80a6-8008-88698b52a4ec',
];

function installFocusGroupOv35Materializer(penpot, penpotUtils, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Focus group page ${PAGE_ID}`);
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
  const rectangle = (parent, name, x, y, width, height, color, radius = 0, stroke = null) => {
    const shape = penpot.createRectangle();
    shape.name = name;
    shape.fills = [{ fillColor: color, fillOpacity: 1 }];
    shape.strokes = stroke ? [{ strokeColor: stroke, strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }] : [];
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
  const image = (parent, name, media, x, y, width, height, radius = 0) => {
    const shape = penpot.createRectangle();
    shape.name = name;
    shape.fills = [{ fillImage: media, fillOpacity: 1 }];
    shape.strokes = [];
    shape.borderRadius = radius;
    parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const replaceChildren = (root) => [...root.children].forEach((child) => child.remove());

  async function ensureMedia() {
    assertContext();
    if (storage.focusGroupOv35Media) return storage.focusGroupOv35Media;
    const uploaded = {};
    for (const [key, url] of Object.entries(MEDIA)) uploaded[key] = await penpot.uploadMediaUrl(`OV35 ${key} · Astro ${ASTRO_COMMIT.slice(0, 8)}`, url);
    storage.focusGroupOv35Media = uploaded;
    return uploaded;
  }

  function canvas(parent, width, height) {
    parent.fills = [{ fillColor: '#fbf7ef', fillOpacity: 1 }];
    const glow = penpot.createEllipse();
    glow.name = 'Canvas radial warmth';
    glow.fills = [{ fillColor: '#fff0b8', fillOpacity: 0.34 }];
    glow.strokes = [];
    parent.appendChild(glow);
    place(glow, -160, -150, 620, 620);
    return { width, height };
  }

  function brand(parent, media, width) {
    image(parent, 'Brand / announcements-brand-v2-192', media.brand, (width - 92) / 2, width === 390 ? 15.1875 : 27.1875, 92, 92, 20);
  }

  function badge(parent, media, x, y) {
    rectangle(parent, 'Focus Lab badge / surface', x, y, 146, 48, '#fff8e6', 24, '#e6cba5');
    rectangle(parent, 'Focus Lab badge / icon surface', x + 7, y + 8, 32, 32, '#ffffff', 16);
    image(parent, 'Focus Lab badge / flask', media.flask, x + 11, y + 12, 24, 24);
    text(parent, 'Focus Lab badge / label', 'Lab', x + 48, y + 10, 82, 15, 12, 900, 1, '#221a14');
    text(parent, 'Focus Lab badge / detail', 'Фокус-группа', x + 48, y + 26, 92, 13, 10.7, 700, 1, '#6d6259');
  }

  function cardSurface(parent, x, y, width, height, radius) {
    return rectangle(parent, 'Invitation card / source surface', x, y, width, height, '#fffdf8', radius, '#e1d3c2');
  }

  function installDesktop(root, media) {
    canvas(root, 1280, 1352); brand(root, media, 1280);
    const x = 360; const y = 132; cardSurface(root, x, y, 560, 1172, 24); badge(root, media, x + 32, y + 32);
    text(root, 'Step / install', 'ШАГ 1 ИЗ 3', x + 32, y + 96, 220, 16, 12, 900, 1, '#98401f');
    text(root, 'Title / install', 'Присоединяйтесь к\nфокус-группе', x + 32, y + 130, 496, 92, 43, 900, 1.04, '#221a14');
    text(root, 'Lead / install', 'Пользуйтесь афишей и помогайте нам сделать её\nпонятнее и удобнее.', x + 32, y + 238, 496, 50, 16, 400, 1.5, '#6d6259');
    rectangle(root, 'Prize note / surface', x + 32, y + 300, 496, 118, '#fff4d6', 16, '#ecd29a');
    text(root, 'Prize note / title', 'Можно выиграть два билета в театр', x + 48, y + 316, 464, 22, 16, 900, 1.3, '#221a14');
    text(root, 'Prize note / copy', 'В розыгрыше смогут участвовать те, кто пользуется\nафишей, находит артефакты, сообщает об ошибках,\nоценивает удобство и оставляет честные оценки.', x + 48, y + 346, 464, 64, 14, 400, 1.45, '#5d3c12');
    rectangle(root, 'Next note / surface', x + 32, y + 434, 496, 96, '#f6efe6', 16);
    text(root, 'Next note / title', 'Сначала добавьте «Анонсы» на телефон', x + 48, y + 450, 464, 22, 16, 900, 1.3, '#221a14');
    text(root, 'Next note / copy', 'Так к афише будет удобно возвращаться. Можно\nпродолжить и без установки.', x + 48, y + 480, 464, 42, 14, 400, 1.45, '#44362d');
    rectangle(root, 'PWA install / source surface', x + 32, y + 546, 496, 534, '#ffffff', 22, '#e1d3c2');
    text(root, 'PWA / eyebrow', 'ПРИЛОЖЕНИЕ «АНОНСЫ»', x + 64, y + 578, 360, 15, 11, 900, 1, '#166a64');
    text(root, 'PWA / title', 'Установите\nприложение\n«Анонсы»', x + 64, y + 603, 390, 112, 39, 900, 1, '#221a14');
    text(root, 'PWA / lead', 'Так афиша не потеряется среди вкладок.\nПриложение почти не занимает места: события\nоткрываются с сайта.', x + 64, y + 724, 400, 76, 16, 400, 1.5, '#6d6259');
    text(root, 'PWA / status', 'Если браузер поддерживает установку, используйте\nего меню. Можно продолжить и в обычной вкладке.', x + 64, y + 810, 410, 42, 14, 800, 1.2, '#98401f');
    rectangle(root, 'PWA guidance / surface', x + 64, y + 868, 428, 148, '#e7f2f7', 16);
    text(root, 'PWA guidance / title', 'Если системная кнопка не появилась', x + 80, y + 884, 390, 18, 12, 800, 1.25, '#1f658d');
    text(root, 'PWA guidance / copy', 'Android: откройте страницу в обычном Chrome. Кнопка\n«Установить приложение» появится, когда браузер\nподготовит установку.\n\niPhone/iPad: откройте страницу в Safari, нажмите\n«Поделиться» и выберите «На экран Домой».', x + 80, y + 908, 390, 96, 12, 400, 1.45, '#1f658d');
    text(root, 'PWA / after', 'После установки откройте «Анонсы» с главного экрана и\nпродолжите подключение.', x + 64, y + 1030, 410, 44, 14, 400, 1.45, '#6d6259');
    text(root, 'Action / skip install', 'Продолжить без установки', x + 165, y + 1111, 230, 26, 14, 800, 1.2, '#6d6259', 'center');
  }

  function installMobile(root, media) {
    canvas(root, 390, 1397); brand(root, media, 390);
    const x = 6; const y = 116; cardSurface(root, x, y, 378, 1233, 20); badge(root, media, x + 21, y + 20);
    text(root, 'Step / install', 'ШАГ 1 ИЗ 3', x + 21, y + 82, 190, 16, 12, 900, 1, '#98401f');
    text(root, 'Title / install', 'Присоединяйтесь к\nфокус-группе', x + 21, y + 112, 336, 61, 29, 900, 1.04, '#221a14');
    text(root, 'Lead / install', 'Пользуйтесь афишей и помогайте нам\nсделать её понятнее и удобнее.', x + 21, y + 188, 336, 50, 16, 400, 1.5, '#6d6259');
    rectangle(root, 'Prize note / surface', x + 21, y + 245, 336, 179, '#fff4d6', 16, '#ecd29a');
    text(root, 'Prize note / title', 'Можно выиграть два билета в\nтеатр', x + 37, y + 262, 304, 43, 16, 900, 1.3, '#221a14');
    text(root, 'Prize note / copy', 'В розыгрыше смогут участвовать те,\nкто пользуется афишей, находит\nартефакты, сообщает об ошибках,\nоценивает удобство и оставляет\nчестные оценки.', x + 37, y + 314, 304, 100, 14, 400, 1.45, '#5d3c12');
    rectangle(root, 'Next note / surface', x + 21, y + 438, 336, 137, '#f6efe6', 16);
    text(root, 'Next note / title', 'Сначала добавьте «Анонсы» на\nтелефон', x + 37, y + 455, 304, 43, 16, 900, 1.3, '#221a14');
    text(root, 'Next note / copy', 'Так к афише будет удобно\nвозвращаться. Можно продолжить и без\nустановки.', x + 37, y + 508, 304, 64, 14, 400, 1.45, '#44362d');
    rectangle(root, 'PWA install / source surface', x + 21, y + 590, 336, 564, '#ffffff', 20, '#e1d3c2');
    text(root, 'PWA / eyebrow', 'ПРИЛОЖЕНИЕ «АНОНСЫ»', x + 39, y + 610, 280, 15, 11, 900, 1, '#166a64');
    text(root, 'PWA / title', 'Установите\nприложение «Анонсы»', x + 39, y + 635, 290, 61, 28, 900, 1, '#221a14');
    text(root, 'PWA / lead', 'Так афиша не потеряется среди\nвкладок. Приложение почти не\nзанимает места: события\nоткрываются с сайта.', x + 39, y + 706, 290, 92, 16, 400, 1.5, '#6d6259');
    text(root, 'PWA / status', 'Если браузер поддерживает\nустановку, используйте его меню.\nМожно продолжить и в обычной\nвкладке.', x + 39, y + 808, 290, 70, 14, 800, 1.1, '#98401f');
    rectangle(root, 'PWA guidance / surface', x + 39, y + 892, 300, 204, '#e7f2f7', 16);
    text(root, 'PWA guidance / title', 'Если системная кнопка не\nпоявилась', x + 55, y + 908, 270, 36, 12, 800, 1.35, '#1f658d');
    text(root, 'PWA guidance / copy', 'Android: откройте страницу в обычном\nChrome. Кнопка «Установить\nприложение» появится, когда браузер\nподготовит установку.\n\niPhone/iPad: откройте страницу в\nSafari, нажмите «Поделиться» и\nвыберите «На экран Домой».', x + 55, y + 950, 270, 138, 12, 400, 1.45, '#1f658d');
    text(root, 'PWA / after', 'После установки откройте «Анонсы» с\nглавного экрана и продолжите\nподключение.', x + 39, y + 1110, 290, 62, 14, 400, 1.45, '#6d6259');
    text(root, 'Action / skip install', 'Продолжить без установки', x + 70, y + 1186, 238, 26, 14, 800, 1.2, '#6d6259', 'center');
  }

  function otpState(root, media, mobile) {
    const width = mobile ? 390 : 1280; const height = mobile ? 844 : 900;
    canvas(root, width, height); brand(root, media, width);
    const x = mobile ? 6 : 360; const y = mobile ? 116 : 132; const cardW = mobile ? 378 : 560; const cardH = mobile ? 499 : 516; const pad = mobile ? 21 : 32;
    cardSurface(root, x, y, cardW, cardH, mobile ? 20 : 24); badge(root, media, x + pad, y + (mobile ? 20 : 32));
    text(root, 'Email OTP / eyebrow', 'ПИСЬМО ОТПРАВЛЕНО', x + pad, y + (mobile ? 82 : 96), cardW - pad * 2, 16, 12, 900, 1, '#98401f');
    text(root, 'Email OTP / title', 'Введите код', x + pad, y + (mobile ? 111 : 124), cardW - pad * 2, 40, mobile ? 25 : 32, 900, 1.08, '#221a14');
    text(root, 'Email OTP / destination copy', mobile ? 'Нажмите кнопку в письме или введите\nшесть цифр, отправленных на focus-\nagent-e2e@kenigevents.ru.' : 'Нажмите кнопку в письме или введите шесть цифр,\nотправленных на focus-agent-e2e@kenigevents.ru.', x + pad, y + (mobile ? 151 : 175), cardW - pad * 2, mobile ? 68 : 52, 16, 400, 1.5, '#6d6259');
    text(root, 'Email OTP / label', 'Код из письма', x + pad, y + (mobile ? 231 : 231), 200, 20, 14, 800, 1.2, '#44362d');
    const boxW = mobile ? 46.796875 : 48; const boxH = mobile ? 54.859375 : 56.265625; const gap = mobile ? 6.234375 : 8; const startX = mobile ? 39.015625 : 476; const boxY = mobile ? 372.921875 : 389.109375;
    for (let index = 0; index < 6; index += 1) {
      const box = rectangle(root, `Email OTP / digit ${index + 1}${index === 0 ? ' / active' : ''}`, startX + index * (boxW + gap), boxY, boxW, boxH, '#ffffff', 12, index === 0 ? '#0f766e' : '#cdbfad');
      if (index === 0) box.strokes = [{ strokeColor: '#0f766e', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1.5, strokeAlignment: 'inner' }];
    }
    text(root, 'Email OTP / auto-submit status', 'После шестой цифры продолжим автоматически.', mobile ? 29 : 475, mobile ? 442 : 460, mobile ? 332 : 330, 20, 12, 400, 1.4, '#6d6259', 'center');
    text(root, 'Email OTP / change address', 'Изменить адрес', mobile ? 126 : 572, mobile ? 514 : 529, mobile ? 140 : 136, 24, 14, 800, 1.2, '#98401f', 'center');
    text(root, 'Email OTP / agent test status', mobile ? 'Введите временный код, выданный для\nпроверки. Письмо не требуется.' : 'Введите временный код, выданный для проверки. Письмо не\nтребуется.', x + pad, mobile ? 559 : 579, cardW - pad * 2, 48, 14, 800, 1.35, '#98401f');
  }

  async function repairInstallOwners() {
    assertContext(); const media = await ensureMedia();
    const desktopComponent = componentById(DESKTOP_INSTALL_OWNER_ID); const mobileComponent = componentById(MOBILE_INSTALL_OWNER_ID);
    if (!desktopComponent || !mobileComponent) throw new Error('existing Focus group owners missing');
    const block = penpot.history.undoBlockBegin();
    try {
      const desktop = desktopComponent.mainInstance(); replaceChildren(desktop); desktop.resize(1280, 1352); desktopComponent.name = 'viewport=desktop;route=focus-invitation;stage=install · Astro source exact'; desktop.name = 'Archetype / Focus group / viewport=desktop;route=fokus-gruppa/priglashenie;stage=install · Astro source exact'; installDesktop(desktop, media);
      const mobile = mobileComponent.mainInstance(); replaceChildren(mobile); mobile.resize(390, 1397); mobileComponent.name = 'viewport=mobile;route=focus-invitation;stage=install · Astro source exact'; mobile.name = 'Archetype / Focus group / viewport=mobile;route=fokus-gruppa/priglashenie;stage=install · Astro source exact'; installMobile(mobile, media);
      return { desktop: { id: desktopComponent.id, main: desktop.id, size: [desktop.width, desktop.height] }, mobile: { id: mobileComponent.id, main: mobile.id, size: [mobile.width, mobile.height] } };
    } finally { penpot.history.undoBlockFinish(block); }
  }

  async function ensureOtpOwners() {
    assertContext(); const media = await ensureMedia(); const result = {};
    const specs = [
      ['desktop', DESKTOP_OTP_NAME, 1810, 0, 1280, 900, false],
      ['mobile', MOBILE_OTP_NAME, 3130, 0, 390, 844, true],
    ];
    for (const [key, name, x, y, width, height, mobile] of specs) {
      let component = componentByIdentity(OWNER_PATH, name);
      if (!component) {
        const block = penpot.history.undoBlockBegin();
        try {
          const root = board(null, `${OWNER_PATH} / ${name}`, x, y, width, height, '#fbf7ef', 0, true); otpState(root, media, mobile);
          component = penpot.library.local.createComponent([root]); component.path = OWNER_PATH; component.name = name;
        } finally { penpot.history.undoBlockFinish(block); }
      }
      const main = component.mainInstance(); main.hidden = false; place(main, x, y, width, height);
      result[key] = { id: component.id, main: main.id, size: [main.width, main.height] };
    }
    return result;
  }

  function deprecateOldProgramme() {
    assertContext(); const result = [];
    for (const id of DEPRECATED_IDS) {
      const component = componentById(id); if (!component) continue;
      if (!component.name.startsWith('DEPRECATED · OV35')) component.name = `DEPRECATED · OV35 · ${component.name}`;
      const main = component.mainInstance(); main.hidden = true; result.push({ id, main: main.id, name: component.name });
    }
    return result;
  }

  async function readback() {
    assertContext();
    const components = [componentById(DESKTOP_INSTALL_OWNER_ID), componentById(MOBILE_INSTALL_OWNER_ID), componentByIdentity(OWNER_PATH, DESKTOP_OTP_NAME), componentByIdentity(OWNER_PATH, MOBILE_OTP_NAME)];
    return {
      owners: components.map((component) => { const main = component.mainInstance(); return { id: component.id, name: component.name, main: main.id, width: main.width, height: main.height, hidden: main.hidden, otpDigits: [...main.children].filter((shape) => shape.name.startsWith('Email OTP / digit')).length, direct: [...main.children].map((shape) => shape.name) }; }),
      deprecated: DEPRECATED_IDS.map((id) => { const component = componentById(id); return component ? { id, name: component.name, hidden: component.mainInstance().hidden } : { id, missing: true }; }),
      validation: await penpot.currentFile.validate(),
    };
  }

  storage.focusGroupOv35 = { ensureMedia, repairInstallOwners, ensureOtpOwners, deprecateOldProgramme, readback };
  return { installed: true, methods: Object.keys(storage.focusGroupOv35) };
}

if (typeof module !== 'undefined') {
  module.exports = { installFocusGroupOv35Materializer, constants: { FILE_ID, PAGE_ID, ASTRO_COMMIT, DESKTOP_INSTALL_OWNER_ID, MOBILE_INSTALL_OWNER_ID, MEDIA } };
}

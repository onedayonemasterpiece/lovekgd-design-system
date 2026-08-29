/** OV-36/37 native Personal Feed owner reconstruction over Astro bebb49b3. */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880d8bcc2d0b';
const ASTRO_COMMIT = 'bebb49b3ae5478cbb7d8f7c3ca303bd0c357bbbf';
const DESKTOP_OWNER = 'd87e18f1-dcb4-80a6-8008-880d8c05a466';
const MOBILE_OWNER = 'd87e18f1-dcb4-80a6-8008-880d8db35320';
const SUPPORT = {
  desktopHero: 'd87e18f1-dcb4-80a6-8008-886854f5fea1',
  mobileHero: 'd87e18f1-dcb4-80a6-8008-886856fb5dc0',
  desktopAccount: 'd87e18f1-dcb4-80a6-8008-886858481578',
  mobileAccount: 'd87e18f1-dcb4-80a6-8008-8868599edc72',
  desktopRuntime: 'd87e18f1-dcb4-80a6-8008-88685a2c67c9',
  mobileRuntime: 'd87e18f1-dcb4-80a6-8008-88685aada6ca',
  desktopRecommendations: '8f804431-c282-8075-8008-8dfda1f3c60f',
  mobileRecommendations: '8f804431-c282-8075-8008-8dfdd31db4ad',
  desktopHeader: 'a21f5e36-5d76-8065-8008-86ae4bdf9963',
  mobileHeader: 'a21f5e36-5d76-8065-8008-86aebfc67027',
  desktopFooter: 'd87e18f1-dcb4-80a6-8008-885914f2be1b',
  mobileNav: 'a21f5e36-5d76-8065-8008-86aec0a54bb5',
};
const WORKSPACE = {
  desktop: { path: 'Personal feed / Workspace', name: 'viewport=desktop;state=profile-empty+recommendations-3-of-9', size: [1180, 1620], x: 5200, y: 0 },
  mobile: { path: 'Personal feed / Workspace', name: 'viewport=mobile;state=profile-empty+recommendations-3-of-9', size: [366, 3430], x: 6440, y: 0 },
};

function installPersonalFeedOv3637NativeMaterializer(penpot, penpotUtils, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) throw new Error(`open settled Personal feed page ${PAGE_ID}`);
  };
  const componentById = (id) => penpot.library.local.components.find((component) => component.id === id);
  const componentByKey = ({ path, name }) => penpot.library.local.components.find((component) => component.path === path && component.name === name);
  const place = (shape, x, y, width, height) => {
    if (shape.layoutChild) shape.layoutChild.absolute = true;
    if (width != null && height != null) shape.resize(width, height);
    penpotUtils.setParentXY(shape, x, y);
    return shape;
  };
  const replaceChildren = (root) => [...root.children].forEach((child) => child.remove());
  const rectangle = (parent, name, x, y, width, height, color, radius = 0, stroke = null) => {
    const shape = penpot.createRectangle();
    shape.name = name;
    shape.fills = [{ fillColor: color, fillOpacity: 1 }];
    shape.strokes = stroke ? [{ strokeColor: stroke, strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }] : [];
    shape.borderRadius = radius;
    parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const text = (parent, name, value, x, y, width, height, size, weight, lineHeight, color, align = 'left') => {
    const shape = penpot.createText(value);
    shape.name = name;
    shape.fontFamily = 'Inter';
    shape.fontStyle = 'normal';
    shape.fontSize = String(size);
    shape.fontWeight = String(weight);
    shape.lineHeight = String(lineHeight);
    shape.align = align;
    shape.fills = [{ fillColor: color, fillOpacity: 1 }];
    parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const linked = (componentId, parent, name, x, y, width, height) => {
    const component = componentById(componentId);
    if (!component) throw new Error(`missing component ${componentId}`);
    const instance = component.instance();
    instance.name = name;
    parent.appendChild(instance);
    return place(instance, x, y, width, height);
  };
  const button = (parent, label, x, y, width, active = false) => {
    rectangle(parent, `Choice / ${label} / surface`, x, y, width, 34, active ? '#e6f3ef' : '#fffdf9', 17, active ? '#0f766e' : '#d7cdc2');
    text(parent, `Choice / ${label}`, label, x, y + 9, width, 16, 11, 700, 1, active ? '#0f766e' : '#2a2622', 'center');
  };
  const interestCard = (parent, mobile, x, y, group, titleValue, copy) => {
    const width = mobile ? 324 : 350;
    const height = mobile ? 230 : 230;
    rectangle(parent, `Interest / ${titleValue} / surface`, x, y, width, height, '#ffffff', 18, '#ddd5cc');
    text(parent, `Interest / ${titleValue} / group`, group.toUpperCase(), x + 16, y + 14, width - 32, 14, 10, 800, 1, '#0f766e');
    text(parent, `Interest / ${titleValue} / title`, titleValue, x + 16, y + 36, width - 32, 32, mobile ? 22 : 24, 800, 1, '#172b2b');
    text(parent, `Interest / ${titleValue} / copy`, copy, x + 16, y + 74, width - 32, 44, 13, 400, 1.35, '#596968');
    text(parent, `Interest / ${titleValue} / choice label`, 'ВАШ ВЫБОР', x + 16, y + 128, width - 32, 14, 10, 800, 1, '#596968');
    const gap = 6; const bw = (width - 32 - gap * 2) / 3;
    button(parent, 'Чаще', x + 16, y + 150, bw, false);
    button(parent, 'Без предпочтения', x + 16 + bw + gap, y + 150, bw, true);
    button(parent, 'Реже', x + 16 + (bw + gap) * 2, y + 150, bw, false);
    text(parent, `Interest / ${titleValue} / sufficiency`, 'Индекс интереса: пока недостаточно данных', x + 16, y + 198, width - 32, 18, 11, 600, 1, '#596968');
  };
  const ensureWorkspaceComponent = (viewport) => {
    const spec = WORKSPACE[viewport];
    let component = componentByKey(spec);
    let root;
    if (!component) {
      root = penpot.createBoard();
      root.name = `Personal feed / Workspace / ${spec.name}`;
      penpot.currentPage.root.appendChild(root);
      place(root, spec.x, spec.y, ...spec.size);
      component = penpot.library.local.createComponent([root]);
      component.path = spec.path;
      component.name = spec.name;
    } else root = component.mainInstance();
    return { component, root, spec };
  };
  const buildAccount = (root, mobile) => {
    replaceChildren(root);
    root.resize(mobile ? 366 : 1180, mobile ? 320 : 202);
    root.fills = [{ fillColor: '#fffaf3', fillOpacity: 1 }];
    root.strokes = [{ strokeColor: '#ddd5cc', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
    root.borderRadius = 20;
    text(root, 'Account eyebrow', 'АККАУНТ · ОТДЕЛЬНО ОТ НАСТРОЕК', mobile ? 16 : 24, mobile ? 16 : 20, mobile ? 334 : 560, 14, 10, 800, 1, '#98401f');
    text(root, 'Account title', 'Вход по почте или через Яндекс', mobile ? 16 : 24, mobile ? 40 : 44, mobile ? 334 : 600, mobile ? 56 : 38, mobile ? 24 : 28, 800, 1.05, '#172b2b');
    text(root, 'Account copy', 'Персонализация работает локально без входа и отдельного согласия. Аккаунт нужен только для подтверждённых функций.', mobile ? 16 : 24, mobile ? 104 : 88, mobile ? 334 : 660, mobile ? 86 : 64, mobile ? 13 : 13, 400, 1.4, '#596968');
    text(root, 'Account status', 'Вы не вошли в аккаунт.', mobile ? 16 : 760, mobile ? 204 : 46, mobile ? 334 : 380, 20, 13, 600, 1, '#172b2b');
    const buttonY = mobile ? 238 : 86;
    rectangle(root, 'Auth / email / surface', mobile ? 16 : 760, buttonY, mobile ? 160 : 178, 48, '#98401f', 24);
    text(root, 'Auth / email', 'По электронной почте', mobile ? 16 : 760, buttonY + 16, mobile ? 160 : 178, 16, mobile ? 10 : 11, 800, 1, '#ffffff', 'center');
    rectangle(root, 'Auth / Yandex / surface', mobile ? 184 : 950, buttonY, mobile ? 166 : 178, 48, '#f1e9df', 24, '#d7cdc2');
    text(root, 'Auth / Yandex', 'Через Яндекс', mobile ? 184 : 950, buttonY + 16, mobile ? 166 : 178, 16, 11, 800, 1, '#3a332d', 'center');
    text(root, 'Auth / runtime status', 'Вход временно недоступен.', mobile ? 16 : 760, mobile ? 296 : 148, mobile ? 334 : 368, 18, 11, 500, 1, '#7a6e65');
  };
  const repairSupport = () => {
    const names = [
      [SUPPORT.desktopHero, 'viewport=desktop'], [SUPPORT.mobileHero, 'viewport=mobile'],
      [SUPPORT.desktopAccount, 'viewport=desktop;state=anonymous;auth=email+yandex'], [SUPPORT.mobileAccount, 'viewport=mobile;state=anonymous;auth=email+yandex'],
      [SUPPORT.desktopRuntime, 'viewport=desktop;policy=local-no-extra-consent'], [SUPPORT.mobileRuntime, 'viewport=mobile;policy=local-no-extra-consent'],
    ];
    const block = penpot.history.undoBlockBegin();
    try {
      for (const [id, name] of names) {
        const c = componentById(id); if (!c) throw new Error(`missing support ${id}`);
        c.name = name; c.mainInstance().name = `${c.path} / ${name}`; c.mainInstance().hidden = false;
      }
      buildAccount(componentById(SUPPORT.desktopAccount).mainInstance(), false);
      buildAccount(componentById(SUPPORT.mobileAccount).mainInstance(), true);
      return { repaired: names.length };
    } finally { penpot.history.undoBlockFinish(block); }
  };
  const repairWorkspace = (viewport) => {
    assertContext();
    const mobile = viewport === 'mobile';
    const { component, root, spec } = ensureWorkspaceComponent(viewport);
    const block = penpot.history.undoBlockBegin();
    try {
      replaceChildren(root); root.resize(...spec.size); root.hidden = false;
      root.name = `Personal feed / Workspace / ${spec.name}`;
      root.fills = [{ fillColor: '#fbf7ef', fillOpacity: 1 }]; root.strokes = [];
      rectangle(root, 'Local-only notice / surface', 0, 0, spec.size[0], mobile ? 116 : 72, '#eaf7f4', 16, '#b7ded8');
      text(root, 'Local-only notice', 'РАБОТАЕТ ТОЛЬКО В ЭТОМ БРАУЗЕРЕ', mobile ? 14 : 20, mobile ? 16 : 14, mobile ? 338 : 1100, 16, 10, 800, 1, '#0f766e');
      text(root, 'Local-only notice copy', 'Без аккаунта, сервера и скрытого профилирования. Профиль можно удалить и собрать заново.', mobile ? 14 : 20, mobile ? 42 : 38, mobile ? 338 : 1100, mobile ? 58 : 22, mobile ? 14 : 13, 500, 1.35, '#315d57');
      const headY = mobile ? 140 : 96;
      text(root, 'Workspace kicker', 'ВАШИ НАСТРОЙКИ', mobile ? 0 : 20, headY, mobile ? 250 : 300, 16, 11, 800, 1, '#0f766e');
      text(root, 'Workspace title', 'Что вам действительно\nинтересно?', mobile ? 0 : 20, headY + 28, mobile ? 340 : 720, mobile ? 82 : 58, mobile ? 38 : 46, 800, .95, '#172b2b');
      text(root, 'Workspace lead', 'Явный выбор главнее любых подсказок по реакциям. Для каждой темы: «Чаще», «Без предпочтения» или «Реже».', mobile ? 0 : 20, headY + (mobile ? 120 : 92), mobile ? 350 : 780, mobile ? 78 : 44, mobile ? 15 : 15, 400, 1.4, '#596968');
      rectangle(root, 'Reset profile / surface', mobile ? 0 : 870, headY + (mobile ? 202 : 24), mobile ? 250 : 270, 44, '#fffdf9', 22, '#cdbfad');
      text(root, 'Reset profile', 'Удалить локальный профиль', mobile ? 0 : 870, headY + (mobile ? 216 : 38), mobile ? 250 : 270, 16, 12, 700, 1, '#98401f', 'center');
      const legendY = mobile ? 370 : 205;
      rectangle(root, 'Legend / surface', mobile ? 0 : 20, legendY, mobile ? 366 : 1140, mobile ? 160 : 90, '#fffaf3', 18, '#ddd5cc');
      text(root, 'Legend / choice', 'ВАШ ВЫБОР — только явное решение, без процентов.', mobile ? 16 : 40, legendY + 22, mobile ? 334 : 500, 42, mobile ? 13 : 14, 600, 1.35, '#172b2b');
      text(root, 'Legend / confidence', 'ИНДЕКС ИНТЕРЕСА — отдельная шкала только по реакциям.', mobile ? 16 : 610, legendY + (mobile ? 88 : 22), mobile ? 334 : 500, 42, mobile ? 13 : 14, 600, 1.35, '#172b2b');
      if (mobile) {
        interestCard(root, true, 21, 560, 'Музыка', 'Джаз', 'Клубные сеты, импровизация и джазовые фестивали.');
        interestCard(root, true, 21, 810, 'Культура', 'Выставки и искусство', 'Музеи, галереи, фотография и дизайн.');
        interestCard(root, true, 21, 1060, 'Город и досуг', 'С детьми', 'Семейные события и программы для разных возрастов.');
      } else {
        text(root, 'Interest group label', 'РЕПРЕЗЕНТАТИВНЫЕ ТЕМЫ · 3 ИЗ 16', 20, 320, 600, 16, 11, 800, 1, '#596968');
        interestCard(root, false, 20, 365, 'Музыка', 'Джаз', 'Клубные сеты, импровизация и джазовые фестивали.');
        interestCard(root, false, 415, 365, 'Культура', 'Выставки и искусство', 'Музеи, галереи, фотография и дизайн.');
        interestCard(root, false, 810, 365, 'Город и досуг', 'С детьми', 'Семейные события и программы для разных возрастов.');
      }
      const mapY = mobile ? 1320 : 630;
      rectangle(root, 'Profile signals / surface', 0, mapY, spec.size[0], mobile ? 250 : 190, '#ffffff', 20, '#ddd5cc');
      text(root, 'Profile signals kicker', 'ПОНЯТНАЯ КАРТА, НЕ «ОБЛАКО»', mobile ? 16 : 24, mapY + 22, mobile ? 330 : 500, 16, 10, 800, 1, '#0f766e');
      text(root, 'Profile signals title', 'Сигналы профиля', mobile ? 16 : 24, mapY + 48, mobile ? 330 : 500, 40, mobile ? 30 : 34, 800, 1, '#172b2b');
      text(root, 'Profile signals empty', 'Пока нет выбранных тем или реакций. Выберите тему выше или оцените рекомендацию — здесь появится объяснимая шкала.', mobile ? 16 : 560, mapY + (mobile ? 102 : 48), mobile ? 334 : 570, mobile ? 104 : 78, 14, 500, 1.4, '#596968');
      const digestY = mobile ? 1590 : 850;
      rectangle(root, 'Digest eligibility / surface', 0, digestY, spec.size[0], mobile ? 300 : 220, '#f8ead3', 20, '#e1cdb4');
      text(root, 'Digest kicker', 'ИНТЕРФЕЙС / ELIGIBILITY PROTOTYPE', mobile ? 16 : 24, digestY + 22, mobile ? 330 : 500, 16, 10, 800, 1, '#98401f');
      text(root, 'Digest title', 'Автоматические персональные\nподборки', mobile ? 16 : 24, digestY + 48, mobile ? 334 : 540, mobile ? 76 : 62, mobile ? 28 : 32, 800, 1, '#172b2b');
      text(root, 'Digest state', 'ВЫКЛЮЧЕНО', mobile ? 16 : 660, digestY + (mobile ? 144 : 38), mobile ? 160 : 180, 24, 13, 800, 1, '#98401f');
      text(root, 'Digest requirements', 'Правила сервиса: действуют\nЯвные сигналы: 0 из 3\nРеакции: 0 из 3', mobile ? 16 : 660, digestY + (mobile ? 178 : 78), mobile ? 330 : 430, 82, 14, 500, 1.5, '#4f4841');
      rectangle(root, 'Digest button / disabled', mobile ? 16 : 660, digestY + (mobile ? 250 : 158), mobile ? 334 : 330, 44, '#9fc6c1', 22);
      text(root, 'Digest button', 'Включить интерфейс подборок', mobile ? 16 : 660, digestY + (mobile ? 264 : 172), mobile ? 334 : 330, 16, 12, 800, 1, '#ffffff', 'center');
      const recY = mobile ? 1920 : 1110;
      text(root, 'Recommendations kicker', 'ОБЪЯСНИМЫЙ ПОРЯДОК', mobile ? 0 : 20, recY, mobile ? 300 : 400, 16, 11, 800, 1, '#0f766e');
      text(root, 'Recommendations title', 'Можно попробовать', mobile ? 0 : 20, recY + 28, mobile ? 350 : 700, 50, mobile ? 38 : 46, 800, 1, '#172b2b');
      text(root, 'Recommendations lead', 'Локальная сортировка ограниченного списка. Показаны первые 3 из 9 реальных рекомендаций.', mobile ? 0 : 20, recY + 88, mobile ? 350 : 760, mobile ? 72 : 36, mobile ? 15 : 15, 400, 1.4, '#596968');
      linked(mobile ? SUPPORT.mobileRecommendations : SUPPORT.desktopRecommendations, root, `linked Personal feed / Recommendations / ${viewport} / fixtures=5459,6870,6941`, mobile ? 21 : 49, mobile ? 2110 : 1240, mobile ? 324 : 1082, mobile ? 1292 : 360);
      return { viewport, component: component.id, main: root.id, size: [root.width, root.height], recommendationLayout: mobile ? SUPPORT.mobileRecommendations : SUPPORT.desktopRecommendations };
    } finally { penpot.history.undoBlockFinish(block); }
  };
  const repairOwner = (viewport) => {
    assertContext();
    const mobile = viewport === 'mobile';
    const owner = penpot.currentPage.getShapeById(mobile ? MOBILE_OWNER : DESKTOP_OWNER);
    const workspace = componentByKey(WORKSPACE[viewport]);
    if (!owner || !workspace) throw new Error(`missing ${viewport} owner/workspace`);
    const block = penpot.history.undoBlockBegin();
    try {
      replaceChildren(owner);
      owner.name = `Archetype / Personal feed / viewport=${viewport};state=profile-empty+recommendations-3-of-9;auth=email+yandex · native Astro source exact`;
      owner.fills = [{ fillColor: '#fbf7ef', fillOpacity: 1 }]; owner.clipContent = true;
      if (mobile) {
        owner.resize(390, 4612);
        linked(SUPPORT.mobileHeader, owner, 'linked Shell / Mobile header', 0, 0, 390, 84);
        linked(SUPPORT.mobileHero, owner, 'linked Personal feed / Hero / mobile', 12, 85, 366, 490);
        linked(SUPPORT.mobileAccount, owner, 'linked Personal feed / Account / mobile / auth=email+yandex', 12, 592, 366, 320);
        linked(SUPPORT.mobileRuntime, owner, 'linked Personal feed / Runtime / mobile / no-extra-consent', 12, 928, 366, 138);
        linked(workspace.id, owner, 'linked Personal feed / Workspace / mobile / populated', 12, 1082, 366, 3430);
        linked(SUPPORT.mobileNav, owner, 'linked Shell / Mobile bottom navigation', 0, 4548, 390, 64);
      } else {
        owner.resize(1280, 3315);
        linked(SUPPORT.desktopHeader, owner, 'linked Shell / Desktop header', 0, 0, 1280, 57);
        linked(SUPPORT.desktopHero, owner, 'linked Personal feed / Hero / desktop', 50, 95, 1180, 554);
        linked(SUPPORT.desktopAccount, owner, 'linked Personal feed / Account / desktop / auth=email+yandex', 50, 665, 1180, 202);
        linked(SUPPORT.desktopRuntime, owner, 'linked Personal feed / Runtime / desktop / no-extra-consent', 50, 883, 1180, 58);
        linked(workspace.id, owner, 'linked Personal feed / Workspace / desktop / populated', 50, 965, 1180, 1620);
        linked(SUPPORT.desktopFooter, owner, 'linked Shell / Desktop footer viewport', 0, 2633.140625, 1280, 681.859375);
      }
      const orphan = penpot.currentPage.getShapeById('8f804431-c282-8075-8008-8dfd5e9f10a1');
      if (orphan) orphan.remove();
      return { viewport, owner: owner.id, size: [owner.width, owner.height], directLinkedRegions: [...owner.children].filter((shape) => shape.isComponentCopyInstance?.()).length };
    } finally { penpot.history.undoBlockFinish(block); }
  };
  const readback = async () => {
    assertContext();
    const owners = [DESKTOP_OWNER, MOBILE_OWNER].map((id) => {
      const root = penpot.currentPage.getShapeById(id); const all = [];
      const walk = (shape) => { all.push(shape); if (shape.children) for (const child of shape.children) walk(child); }; walk(root);
      return { id, name: root.name, size: [root.width, root.height], direct: [...root.children].map((shape) => ({ name: shape.name, componentId: shape.component?.()?.id || null })), sourceProjectionCount: all.filter((shape) => /projection|screenshot/i.test(shape.name || '')).length, imageFillCount: all.filter((shape) => (shape.fills || []).some((fill) => fill.fillImage)).length };
    });
    const workspaces = ['desktop', 'mobile'].map((viewport) => { const c = componentByKey(WORKSPACE[viewport]); const m = c.mainInstance(); return { viewport, component: c.id, main: m.id, size: [m.width, m.height], directLinked: [...m.children].filter((shape) => shape.isComponentCopyInstance?.()).map((shape) => shape.component?.()?.id) }; });
    return { astroCommit: ASTRO_COMMIT, owners, workspaces, validation: await penpot.currentFile.validate() };
  };
  storage.personalFeedOv3637Native = { repairSupport, repairWorkspace, repairOwner, readback };
  return { installed: true, methods: Object.keys(storage.personalFeedOv3637Native) };
}

if (typeof module !== 'undefined') module.exports = { installPersonalFeedOv3637NativeMaterializer, constants: { FILE_ID, PAGE_ID, ASTRO_COMMIT, DESKTOP_OWNER, MOBILE_OWNER, SUPPORT, WORKSPACE } };

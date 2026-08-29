/** OV-57: replace the all-21 raster projection with a bounded native 7-festival 1/4/2 fixture composition. */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880c8e21990e';
const TOKEN_SET_ID = 'd87e18f1-dcb4-80a6-8008-876d85fbb5bb';
const DEPRECATED_OWNERS = {
  desktop: 'd87e18f1-dcb4-80a6-8008-880c9f323d8b',
  mobile: 'd87e18f1-dcb4-80a6-8008-880ca6c8b403',
};
const SUPPORT = {
  desktopShellHeader: 'a21f5e36-5d76-8065-8008-86ae4bdf9963',
  mobileShellHeader: 'a21f5e36-5d76-8065-8008-86aebfc67027',
  desktopFooterViewport: 'd87e18f1-dcb4-80a6-8008-885914f2be1b',
  mobileBottomNavigation: 'a21f5e36-5d76-8065-8008-86aec0a54bb5',
  desktopFestivalHeader: 'd87e18f1-dcb4-80a6-8008-882d8a29dad7',
  mobileFestivalHeader: 'd87e18f1-dcb4-80a6-8008-882dc39bfce8',
  cityJazzDesktop: 'd87e18f1-dcb4-80a6-8008-8840098153da',
  cityJazzMobile: 'd87e18f1-dcb4-80a6-8008-8841ea46c2cc',
};
const OWNER = {
  desktop: {
    path: 'Archetype / Festivals',
    name: 'viewport=desktop;state=reference-7;rows=1-4-2 · native Astro fixture profile',
    shapeName: 'Archetype / Festivals / viewport=desktop;state=reference-7;rows=1-4-2 · native Astro fixture profile',
    x: 0,
    y: 0,
    width: 1280,
    height: 2107,
  },
  mobile: {
    path: 'Archetype / Festivals',
    name: 'viewport=mobile;state=reference-7;rows=1-4-2 · native Astro fixture profile',
    shapeName: 'Archetype / Festivals / viewport=mobile;state=reference-7;rows=1-4-2 · native Astro fixture profile',
    x: 1320,
    y: 0,
    width: 390,
    height: 2087,
  },
};
const CARDS = {
  sosedi: { title: 'Соседи', date: '1 авг', place: 'Янтарный', category: 'гастрономия', status: 'официально' },
  grozd: { title: 'Гроздь', date: '1–2 авг', place: 'Светлогорск', category: 'вино и гастрономия', status: 'официально' },
  'more-vnutri': { title: 'Море внутри', date: '8–9 авг', place: 'Светлогорск', category: 'современное искусство', status: 'официально' },
  'bolshoy-kaup': { title: 'Большой Кауп', date: '8–9 авг', place: 'Романово · Кауп', category: 'история и реконструкция', status: 'официально' },
  'v-edinstve': { title: 'В единстве наша сила', date: '4 ноя', place: 'Гурьевск', category: 'культура народов', status: 'прогр. позже', pending: true },
  'jazz-v-filarmonii': { title: 'Джаз в Филармонии', date: '13–18.11', place: 'Областная филармония', category: 'джаз', status: 'прогр. позже', pending: true },
};

function installFestivalsOv57BoundedNativeMaterializer(penpot, penpotUtils, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Festivals page ${PAGE_ID}`);
    }
  };
  const componentById = (id) => penpot.library.local.components.find((component) => component.id === id);
  const componentByIdentity = (path, name) => penpot.library.local.components.find((component) => component.path === path && component.name === name);
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
    (parent || penpot.currentPage.root).appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const rectangle = (parent, name, x, y, width, height, color, radius = 0, opacity = 1, stroke = null) => {
    const shape = penpot.createRectangle();
    shape.name = name;
    shape.fills = [{ fillColor: color, fillOpacity: opacity }];
    shape.strokes = stroke ? [{ strokeColor: stroke, strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }] : [];
    shape.borderRadius = radius;
    parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const image = (parent, name, media, x, y, width, height, radius = 0) => {
    if (!media) throw new Error(`missing uploaded media for ${name}`);
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
  const linked = (componentId, parent, name, x, y, width, height) => {
    const component = componentById(componentId);
    if (!component) throw new Error(`missing linked component ${componentId}`);
    const instance = component.instance();
    instance.name = name;
    parent.appendChild(instance);
    return place(instance, x, y, width, height);
  };
  const walk = (root, output = []) => {
    output.push(root);
    for (const child of root.children || []) walk(child, output);
    return output;
  };
  const overrideText = (root, name, characters) => {
    const shape = walk(root).find((item) => item.type === 'text' && item.name === name);
    if (!shape) throw new Error(`text override target missing: ${name}`);
    shape.characters = characters;
  };
  const replaceChildren = (root) => [...root.children].forEach((child) => child.remove());
  const ensureOwner = (viewport) => {
    const spec = OWNER[viewport];
    let component = componentByIdentity(spec.path, spec.name);
    let root;
    if (component) root = component.mainInstance();
    else {
      root = board(null, spec.shapeName, spec.x, spec.y, spec.width, spec.height, '#fbf5eb', 20, true);
      component = penpot.library.local.createComponent([root]);
      component.path = spec.path;
      component.name = spec.name;
    }
    root.name = spec.shapeName;
    root.hidden = false;
    root.resize(spec.width, spec.height);
    place(root, spec.x, spec.y, spec.width, spec.height);
    root.fills = [{ fillColor: '#fbf5eb', fillOpacity: 1 }];
    root.strokes = [];
    root.borderRadius = 20;
    root.clipContent = true;
    replaceChildren(root);
    return { component, root, spec };
  };
  const pill = (parent, label, x, y, width, active = false) => {
    rectangle(parent, `Month filter / ${label} / surface`, x, y, width, 38, active ? '#ffffff' : '#fffaf3', 19, 1, active ? '#d7c9ba' : null);
    text(parent, `Month filter / ${label}`, label, x, y + 12, width, 14, 12, 800, 1, active ? '#98401f' : '#5f554d', 'center');
  };
  const monthHeading = (parent, mobile, y, titleValue, copy) => {
    const x = mobile ? 8 : 20;
    rectangle(parent, `Month / ${titleValue} / marker`, x, y + 7, 13, 13, '#fffaf3', 7, 1, '#c4522c');
    rectangle(parent, `Month / ${titleValue} / marker dot`, x + 4, y + 11, 5, 5, '#c4522c', 3);
    text(parent, `Month / ${titleValue} / title`, titleValue, x + (mobile ? 24 : 28), y, mobile ? 105 : 115, 34, mobile ? 28 : 26, 800, 1, '#241f1b');
    text(parent, `Month / ${titleValue} / copy`, copy, x + (mobile ? 108 : 28), y + (mobile ? 7 : 38), mobile ? 255 : 112, mobile ? 40 : 66, mobile ? 11 : 12, 500, 1.25, '#7a6e65');
  };
  const guide = (parent, mobile, y) => {
    const x = mobile ? 8 : 20;
    const width = mobile ? 374 : 1240;
    const height = mobile ? 212 : 66;
    rectangle(parent, 'Festival guidance / surface', x, y, width, height, '#fffdf9', 18, 1, '#eadfd4');
    const specs = [
      ['♡', 'Отметьте интересное', 'Нажмите сердце — фестиваль сохранится в этом браузере.'],
      ['↗', 'Проверьте дату и программу', 'Статус показывает, что подтверждено; карточка откроет источник организатора.'],
      ['+', 'Следите за обновлениями', 'Позже отметка станет основой уведомлений; сейчас это локальная закладка.'],
    ];
    specs.forEach(([icon, titleValue, copy], index) => {
      const bx = mobile ? x : x + index * (width / 3);
      const by = mobile ? y + index * 70 : y;
      if (index && !mobile) rectangle(parent, `Festival guidance / divider ${index}`, bx, y, 1, height, '#eadfd4');
      if (index && mobile) rectangle(parent, `Festival guidance / divider ${index}`, x, by, width, 1, '#eadfd4');
      rectangle(parent, `Festival guidance / ${index} / icon surface`, bx + 14, by + 14, 32, 32, index === 0 ? '#faede3' : '#e9f5f1', 16);
      text(parent, `Festival guidance / ${index} / icon`, icon, bx + 14, by + 22, 32, 16, 16, 800, 1, index === 0 ? '#c4522c' : '#0f766e', 'center');
      text(parent, `Festival guidance / ${index} / title`, titleValue, bx + 56, by + 11, mobile ? 292 : 270, 17, mobile ? 12 : 12, 800, 1, '#2f2925');
      text(parent, `Festival guidance / ${index} / copy`, copy, bx + 56, by + 31, mobile ? 292 : 330, 29, mobile ? 10 : 10, 500, 1.2, '#7a6e65');
    });
  };
  const festivalCard = (parent, slug, media, x, y, width, height, mobile) => {
    const spec = CARDS[slug];
    const card = board(parent, `Festival fixture / ${slug} / native`, x, y, width, height, '#2d211a', 12, true);
    card.strokes = [{ strokeColor: '#d8c8bb', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
    image(card, `Festival fixture / ${slug} / media`, media, 0, 0, width, height, 12);
    rectangle(card, `Festival fixture / ${slug} / readability overlay`, 0, height * 0.52, width, height * 0.48, '#140e0b', 0, 0.72);
    const compact = mobile || width < 300;
    const badgeY = 11;
    const dateW = compact ? Math.min(74, width * 0.44) : 104;
    rectangle(card, `Festival fixture / ${slug} / date surface`, 11, badgeY, dateW, 30, '#b54825', 6);
    text(card, `Festival fixture / ${slug} / date`, spec.date, 11, badgeY + 9, dateW, 14, compact ? 10 : 11, 800, 1, '#fff8f1', 'center');
    const statusW = compact ? Math.min(84, width * 0.48) : 108;
    rectangle(card, `Festival fixture / ${slug} / status surface`, width - statusW - 11, badgeY, statusW, 30, spec.pending ? '#fff0b8' : '#e5f6e9', 6);
    text(card, `Festival fixture / ${slug} / status`, spec.status, width - statusW - 11, badgeY + 9, statusW, 14, compact ? 9 : 10, 800, 1, spec.pending ? '#725616' : '#27713a', 'center');
    const titleSize = compact ? (width < 200 ? 17 : 20) : 25;
    const titleHeight = compact ? 44 : 50;
    text(card, `Festival fixture / ${slug} / title`, spec.title, 12, height - (compact ? 72 : 86), width - 50, titleHeight, titleSize, 800, 1.02, '#ffffff');
    text(card, `Festival fixture / ${slug} / place`, spec.place, 12, height - (compact ? 35 : 42), width - 50, 16, compact ? 9 : 11, 500, 1, '#eee4dd');
    text(card, `Festival fixture / ${slug} / category`, `◌  ${spec.category}`, 12, height - 19, width - 52, 13, compact ? 8 : 10, 700, 1, '#fff7ef');
    rectangle(card, `Festival fixture / ${slug} / heart`, width - 36, height - 36, 26, 26, '#17110e', 13, 0.75, '#fff7ef');
    text(card, `Festival fixture / ${slug} / heart glyph`, '♡', width - 36, height - 29, 26, 14, 14, 700, 1, '#fff7ef', 'center');
    return card;
  };
  const fixtureMedia = (key) => {
    const media = storage.ov57FestivalMedia?.[key];
    if (!media) throw new Error(`upload OV-57 media before materialization: ${key}`);
    return media;
  };
  const escapeXml = (value) => String(value).replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;');
  const svgGroup = (parent, name, svg, x, y, width, height) => {
    // SVG import is born inside Penpot's active board; target the intended non-copy support board explicitly.
    penpot.selection = [parent];
    const shape = penpot.createShapeFromSvg(svg);
    if (!shape) throw new Error(`SVG group creation failed: ${name}`);
    shape.name = name;
    if (shape.parent?.id !== parent.id) parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const ensureSvgSupport = (path, name, svg, width, height, x, y) => {
    let component = componentByIdentity(path, name);
    if (component) return component;
    const root = board(null, `${path} / ${name}`, x, y, width, height, null, 0, true);
    svgGroup(root, `${name} / SVG source`, svg, 0, 0, width, height);
    component = penpot.library.local.createComponent([root]);
    component.path = path;
    component.name = name;
    return component;
  };
  const monthHeadingSvg = (parent, mobile, y, titleValue, copy) => {
    const width = mobile ? 374 : 140;
    const height = mobile ? 46 : 104;
    const titleX = mobile ? 24 : 28;
    const copyX = mobile ? 108 : 28;
    const copyY = mobile ? 10 : 54;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><circle cx="7" cy="14" r="6" fill="#fffaf3" stroke="#c4522c"/><circle cx="7" cy="14" r="2.5" fill="#c4522c"/><text x="${titleX}" y="25" font-family="Inter, sans-serif" font-size="${mobile ? 28 : 26}" font-weight="800" fill="#241f1b">${escapeXml(titleValue)}</text><text x="${copyX}" y="${copyY}" font-family="Inter, sans-serif" font-size="${mobile ? 11 : 12}" font-weight="500" fill="#7a6e65"><tspan x="${copyX}" dy="0">${escapeXml(copy)}</tspan></text></svg>`;
    const path = `Festivals / OV57 fixture adapters / ${mobile ? 'mobile' : 'desktop'} / Month heading`;
    const name = `${titleValue} · fixture-profile=design-system-reference-v1`;
    const order = { 'Июль': 0, 'Август': 1, 'Ноябрь': 2 }[titleValue] || 0;
    const component = ensureSvgSupport(path, name, svg, width, height, 4140 + (mobile ? 200 : 0), 1050 + order * 130);
    return linked(component.id, parent, `Month / ${titleValue} / native SVG heading`, mobile ? 8 : 20, y, width, height);
  };
  const fixtureCardSvg = (parent, slug, media, x, y, width, height, mobile) => {
    const spec = CARDS[slug];
    const cardName = `Festival fixture / ${slug} / native`;
    const existing = [...parent.children].find((shape) => shape.name === cardName);
    if (existing) return existing;
    const path = `Festivals / OV57 fixture adapters / ${mobile ? 'mobile' : 'desktop'} / FestivalCard`;
    const name = `${slug} · ${Math.round(width)}x${Math.round(height)} · native`;
    let component = componentByIdentity(path, name);
    const compact = mobile || width < 300;
    const statusW = compact ? Math.min(84, width * 0.48) : 108;
    const dateW = compact ? Math.min(74, width * 0.44) : 104;
    const titleSize = compact ? (width < 200 ? 17 : 20) : 25;
    const titleY = height - (compact ? 64 : 72);
    const words = spec.title.split(' ');
    const longTitle = compact && spec.title.length > 15;
    const splitAt = longTitle ? Math.ceil(words.length / 2) : words.length;
    const line1 = words.slice(0, splitAt).join(' ');
    const line2 = words.slice(splitAt).join(' ');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140e0b" stop-opacity="0"/><stop offset="1" stop-color="#140e0b" stop-opacity=".88"/></linearGradient></defs><rect x="0" y="${height * 0.42}" width="${width}" height="${height * 0.58}" fill="url(#shade)"/><rect x="11" y="11" width="${dateW}" height="30" rx="6" fill="#b54825"/><text x="${11 + dateW / 2}" y="31" text-anchor="middle" font-family="Inter, sans-serif" font-size="${compact ? 10 : 11}" font-weight="800" fill="#fff8f1">${escapeXml(spec.date)}</text><rect x="${width - statusW - 11}" y="11" width="${statusW}" height="30" rx="6" fill="${spec.pending ? '#fff0b8' : '#e5f6e9'}"/><text x="${width - statusW / 2 - 11}" y="31" text-anchor="middle" font-family="Inter, sans-serif" font-size="${compact ? 9 : 10}" font-weight="800" fill="${spec.pending ? '#725616' : '#27713a'}">${escapeXml(spec.status)}</text><text x="12" y="${titleY}" font-family="Inter, sans-serif" font-size="${titleSize}" font-weight="800" fill="#fff"><tspan x="12" dy="0">${escapeXml(line1)}</tspan>${line2 ? `<tspan x="12" dy="${titleSize}">${escapeXml(line2)}</tspan>` : ''}</text><text x="12" y="${height - 30}" font-family="Inter, sans-serif" font-size="${compact ? 9 : 11}" font-weight="500" fill="#eee4dd">${escapeXml(spec.place)}</text><text x="12" y="${height - 12}" font-family="Inter, sans-serif" font-size="${compact ? 8 : 10}" font-weight="700" fill="#fff7ef">◌  ${escapeXml(spec.category)}</text><circle cx="${width - 23}" cy="${height - 23}" r="13" fill="#17110e" fill-opacity=".75" stroke="#fff7ef"/><text x="${width - 23}" y="${height - 18}" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" fill="#fff7ef">♡</text></svg>`;
    if (!component) {
      const order = Object.keys(CARDS).indexOf(slug);
      const support = board(null, `${path} / ${name}`, 4500 + (mobile ? 700 : 0), 1050 + order * 330, width, height, '#2d211a', 12, true);
      support.strokes = [{ strokeColor: '#d8c8bb', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      image(support, `Festival fixture / ${slug} / media`, media, 0, 0, width, height, 12);
      svgGroup(support, `Festival fixture / ${slug} / semantic overlay`, svg, 0, 0, width, height);
      component = penpot.library.local.createComponent([support]);
      component.path = path;
      component.name = name;
    }
    return linked(component.id, parent, cardName, x, y, width, height);
  };
  const buildDesktop = () => {
    const { component, root } = ensureOwner('desktop');
    linked(SUPPORT.desktopShellHeader, root, 'linked Shell / Desktop header / current=festivals', 0, 0, 1280, 57);
    const hero = linked(SUPPORT.desktopFestivalHeader, root, 'linked Festival / Header / viewport=desktop / fixture-count=7', 20, 77, 1240, 221.266);
    overrideText(hero, 'Stat / festivals / value', '7');
    const chips = board(root, 'Festival month filters / fixture profile', 0, 0, 1280, 52, null, 0, false);
    place(chips, 0, 312, 1280, 52);
    pill(chips, 'Июль', 512, 7, 78, true); pill(chips, 'Август', 596, 7, 88); pill(chips, 'Ноябрь', 690, 7, 92);
    guide(root, false, 374);
    monthHeading(root, false, 458, 'Июль', 'Джаз открывает большой фестивальный сезон.');
    linked(SUPPORT.cityJazzDesktop, root, 'linked FestivalCard / city-jazz / desktop-wide', 170, 456, 673.031, 224.344);
    monthHeading(root, false, 706, 'Август', 'Главный месяц: море, кино, музыка и история.');
    const august = ['sosedi', 'grozd', 'more-vnutri', 'bolshoy-kaup'];
    august.forEach((slug, index) => festivalCard(root, slug, fixtureMedia(`${slug}-square`), 170 + index * 267, 706, 250, 270, false));
    monthHeading(root, false, 1003, 'Ноябрь', 'Культурные традиции и осенний джаз.');
    festivalCard(root, 'v-edinstve', fixtureMedia('v-edinstve-wide'), 170, 1003, 520, 296, false);
    festivalCard(root, 'jazz-v-filarmonii', fixtureMedia('jazz-v-filarmonii-wide'), 710, 1003, 520, 296, false);
    linked(SUPPORT.desktopFooterViewport, root, 'linked Shell / Footer viewport / representative', 0, 1425.140625, 1280, 681.859375);
    return component;
  };
  const buildMobile = () => {
    const { component, root } = ensureOwner('mobile');
    linked(SUPPORT.mobileShellHeader, root, 'linked Shell / Mobile header', 0, 0, 390, 84);
    const hero = linked(SUPPORT.mobileFestivalHeader, root, 'linked Festival / Header / viewport=mobile / fixture-count=7', 8, 84, 374, 496.266);
    overrideText(hero, 'Stat / festivals / value', '7');
    const chips = board(root, 'Festival month filters / fixture profile', 0, 0, 390, 56, null, 0, false);
    place(chips, 0, 590, 390, 56);
    pill(chips, 'Июл', 107, 7, 54, true); pill(chips, 'Авг', 167, 7, 54); pill(chips, 'Ноя', 227, 7, 56);
    guide(root, true, 658);
    monthHeading(root, true, 895, 'Июль', 'Джаз открывает большой фестивальный сезон.');
    linked(SUPPORT.cityJazzMobile, root, 'linked FestivalCard / city-jazz / mobile-full', 8, 944, 374, 201.063);
    monthHeading(root, true, 1172, 'Август', 'Главный месяц: море, кино, музыка и история.');
    festivalCard(root, 'sosedi', fixtureMedia('sosedi-square'), 8, 1220, 181, 190, true);
    festivalCard(root, 'grozd', fixtureMedia('grozd-square'), 201, 1220, 181, 190, true);
    festivalCard(root, 'more-vnutri', fixtureMedia('more-vnutri-square'), 8, 1422, 181, 190, true);
    festivalCard(root, 'bolshoy-kaup', fixtureMedia('bolshoy-kaup-square'), 201, 1422, 181, 190, true);
    monthHeading(root, true, 1636, 'Ноябрь', 'Культурные традиции и осенний джаз.');
    festivalCard(root, 'v-edinstve', fixtureMedia('v-edinstve-square'), 8, 1684, 181, 190, true);
    festivalCard(root, 'jazz-v-filarmonii', fixtureMedia('jazz-v-filarmonii-square'), 201, 1684, 181, 190, true);
    linked(SUPPORT.mobileBottomNavigation, root, 'linked Shell / Mobile bottom navigation / current=afisha / sticky', 12, 756, 366, 64);
    return component;
  };
  const appendDesktopRows = (root) => {
    monthHeading(root, false, 706, 'Август', 'Главный месяц: море, кино, музыка и история.');
    const august = ['sosedi', 'grozd', 'more-vnutri', 'bolshoy-kaup'];
    august.forEach((slug, index) => festivalCard(root, slug, fixtureMedia(`${slug}-square`), 170 + index * 267, 706, 250, 270, false));
    monthHeading(root, false, 1003, 'Ноябрь', 'Культурные традиции и осенний джаз.');
    festivalCard(root, 'v-edinstve', fixtureMedia('v-edinstve-wide'), 170, 1003, 520, 296, false);
    festivalCard(root, 'jazz-v-filarmonii', fixtureMedia('jazz-v-filarmonii-wide'), 710, 1003, 520, 296, false);
    linked(SUPPORT.desktopFooterViewport, root, 'linked Shell / Footer viewport / representative', 0, 1425.140625, 1280, 681.859375);
  };
  const appendMobileRows = (root) => {
    monthHeading(root, true, 1172, 'Август', 'Главный месяц: море, кино, музыка и история.');
    festivalCard(root, 'sosedi', fixtureMedia('sosedi-square'), 8, 1220, 181, 190, true);
    festivalCard(root, 'grozd', fixtureMedia('grozd-square'), 201, 1220, 181, 190, true);
    festivalCard(root, 'more-vnutri', fixtureMedia('more-vnutri-square'), 8, 1422, 181, 190, true);
    festivalCard(root, 'bolshoy-kaup', fixtureMedia('bolshoy-kaup-square'), 201, 1422, 181, 190, true);
    monthHeading(root, true, 1636, 'Ноябрь', 'Культурные традиции и осенний джаз.');
    festivalCard(root, 'v-edinstve', fixtureMedia('v-edinstve-square'), 8, 1684, 181, 190, true);
    festivalCard(root, 'jazz-v-filarmonii', fixtureMedia('jazz-v-filarmonii-square'), 201, 1684, 181, 190, true);
    linked(SUPPORT.mobileBottomNavigation, root, 'linked Shell / Mobile bottom navigation / current=afisha / sticky', 12, 756, 366, 64);
  };
  const bindRadiusToken = (shape) => {
    const set = penpot.library.local.tokens.sets.find((candidate) => candidate.id === TOKEN_SET_ID);
    const token = set?.tokens.find((candidate) => candidate.name === 'radius.20');
    if (!token) throw new Error('foundation radius.20 token missing');
    shape.applyToken(token, ['borderRadiusTopLeft', 'borderRadiusTopRight', 'borderRadiusBottomRight', 'borderRadiusBottomLeft']);
  };
  const deprecateOldOwners = () => {
    for (const [viewport, id] of Object.entries(DEPRECATED_OWNERS)) {
      const component = componentById(id);
      if (!component) throw new Error(`legacy ${viewport} Festival owner missing`);
      component.name = `DEPRECATED · full-21 raster projection · ${viewport} · superseded by OV-57`;
      const main = component.mainInstance();
      main.name = `Deprecated / Festivals / full-21 raster projection / ${viewport} / superseded by OV-57`;
      main.hidden = true;
    }
  };
  async function reconcile() {
    assertContext();
    if (!storage.ov57FestivalMedia || Object.keys(storage.ov57FestivalMedia).length !== 8) throw new Error('expected eight prepared OV-57 media crops');
    const block = penpot.history.undoBlockBegin();
    let desktop; let mobile;
    try {
      desktop = buildDesktop();
      mobile = buildMobile();
      bindRadiusToken(desktop.mainInstance());
      bindRadiusToken(mobile.mainInstance());
      deprecateOldOwners();
    } finally {
      penpot.history.undoBlockFinish(block);
    }
    penpot.selection = [desktop.mainInstance()];
    return readback();
  }
  async function reconcileDesktopBase() {
    assertContext();
    const block = penpot.history.undoBlockBegin();
    let component;
    try {
      const { component: owner, root } = ensureOwner('desktop'); component = owner;
      linked(SUPPORT.desktopShellHeader, root, 'linked Shell / Desktop header / current=festivals', 0, 0, 1280, 57);
      const hero = linked(SUPPORT.desktopFestivalHeader, root, 'linked Festival / Header / viewport=desktop / fixture-count=7', 20, 77, 1240, 221.266);
      overrideText(hero, 'Stat / festivals / value', '7');
      const chips = board(root, 'Festival month filters / fixture profile', 0, 0, 1280, 52, null, 0, false);
      place(chips, 0, 312, 1280, 52);
      pill(chips, 'Июль', 512, 7, 78, true); pill(chips, 'Август', 596, 7, 88); pill(chips, 'Ноябрь', 690, 7, 92);
      guide(root, false, 374);
      monthHeading(root, false, 458, 'Июль', 'Джаз открывает большой фестивальный сезон.');
      linked(SUPPORT.cityJazzDesktop, root, 'linked FestivalCard / city-jazz / desktop-wide', 170, 456, 673.031, 224.344);
    } finally { penpot.history.undoBlockFinish(block); }
    penpot.selection = [component.mainInstance()];
    return { phase: 'desktop-base', componentId: component.id, rootId: component.mainInstance().id, revision: penpot.currentFile.revn };
  }
  async function reconcileDesktopRows() {
    assertContext();
    const component = componentByIdentity(OWNER.desktop.path, OWNER.desktop.name); if (!component) throw new Error('desktop owner base missing');
    const root = component.mainInstance();
    const block = penpot.history.undoBlockBegin();
    try { appendDesktopRows(root); bindRadiusToken(root); } finally { penpot.history.undoBlockFinish(block); }
    return { phase: 'desktop-rows', componentId: component.id, rootId: root.id, revision: penpot.currentFile.revn };
  }
  async function reconcileMobileBase() {
    assertContext();
    const block = penpot.history.undoBlockBegin();
    let component;
    try {
      const { component: owner, root } = ensureOwner('mobile'); component = owner;
      linked(SUPPORT.mobileShellHeader, root, 'linked Shell / Mobile header', 0, 0, 390, 84);
      const hero = linked(SUPPORT.mobileFestivalHeader, root, 'linked Festival / Header / viewport=mobile / fixture-count=7', 8, 84, 374, 496.266);
      overrideText(hero, 'Stat / festivals / value', '7');
      const chips = board(root, 'Festival month filters / fixture profile', 0, 0, 390, 56, null, 0, false);
      place(chips, 0, 590, 390, 56);
      pill(chips, 'Июл', 107, 7, 54, true); pill(chips, 'Авг', 167, 7, 54); pill(chips, 'Ноя', 227, 7, 56);
      guide(root, true, 658);
      monthHeading(root, true, 895, 'Июль', 'Джаз открывает большой фестивальный сезон.');
      linked(SUPPORT.cityJazzMobile, root, 'linked FestivalCard / city-jazz / mobile-full', 8, 944, 374, 201.063);
    } finally { penpot.history.undoBlockFinish(block); }
    return { phase: 'mobile-base', componentId: component.id, rootId: component.mainInstance().id, revision: penpot.currentFile.revn };
  }
  async function reconcileMobileRows() {
    assertContext();
    const component = componentByIdentity(OWNER.mobile.path, OWNER.mobile.name); if (!component) throw new Error('mobile owner base missing');
    const root = component.mainInstance();
    const block = penpot.history.undoBlockBegin();
    try { appendMobileRows(root); bindRadiusToken(root); deprecateOldOwners(); } finally { penpot.history.undoBlockFinish(block); }
    return { phase: 'mobile-rows-finalize', componentId: component.id, rootId: root.id, revision: penpot.currentFile.revn };
  }
  async function completeDesktopBase() {
    assertContext();
    const component = componentByIdentity(OWNER.desktop.path, OWNER.desktop.name); if (!component) throw new Error('desktop owner base missing');
    const root = component.mainInstance();
    const block = penpot.history.undoBlockBegin();
    try {
      [...root.children].filter((shape) => /^Month \/ Июль/u.test(shape.name || '')).forEach((shape) => shape.remove());
      monthHeadingSvg(root, false, 458, 'Июль', 'Джаз открывает большой фестивальный сезон.');
      if (![...root.children].some((shape) => /linked FestivalCard \/ city-jazz/u.test(shape.name || ''))) linked(SUPPORT.cityJazzDesktop, root, 'linked FestivalCard / city-jazz / desktop-wide', 170, 456, 673.031, 224.344);
    } finally { penpot.history.undoBlockFinish(block); }
    return { phase: 'desktop-base-complete', componentId: component.id, rootId: root.id, revision: penpot.currentFile.revn };
  }
  async function reconcileDesktopScaffold() {
    assertContext();
    const component = componentByIdentity(OWNER.desktop.path, OWNER.desktop.name); if (!component) throw new Error('desktop owner missing');
    const root = component.mainInstance();
    const block = penpot.history.undoBlockBegin();
    try {
      if (![...root.children].some((shape) => shape.name === 'Month / Август / native SVG heading')) monthHeadingSvg(root, false, 706, 'Август', 'Главный месяц: море, кино, музыка и история.');
      if (![...root.children].some((shape) => shape.name === 'Month / Ноябрь / native SVG heading')) monthHeadingSvg(root, false, 1003, 'Ноябрь', 'Культурные традиции и осенний джаз.');
      if (![...root.children].some((shape) => /linked Shell \/ Footer viewport/u.test(shape.name || ''))) linked(SUPPORT.desktopFooterViewport, root, 'linked Shell / Footer viewport / representative', 0, 1425.140625, 1280, 681.859375);
    } finally { penpot.history.undoBlockFinish(block); }
    return { phase: 'desktop-scaffold', componentId: component.id, rootId: root.id, revision: penpot.currentFile.revn };
  }
  async function reconcileMobileSlimBase() {
    assertContext();
    const block = penpot.history.undoBlockBegin();
    let component;
    try {
      const ensured = ensureOwner('mobile'); component = ensured.component; const root = ensured.root;
      linked(SUPPORT.mobileShellHeader, root, 'linked Shell / Mobile header', 0, 0, 390, 84);
      const hero = linked(SUPPORT.mobileFestivalHeader, root, 'linked Festival / Header / viewport=mobile / fixture-count=7', 8, 84, 374, 496.266);
      overrideText(hero, 'Stat / festivals / value', '7');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="374" height="286" viewBox="0 0 374 286"><rect x="99" y="0" width="176" height="48" rx="24" fill="#fffdf9" stroke="#eadfd4"/><text x="126" y="30" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#98401f">Июл</text><text x="183" y="30" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#5f554d">Авг</text><text x="239" y="30" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#5f554d">Ноя</text><rect x="0" y="68" width="374" height="212" rx="18" fill="#fffdf9" stroke="#eadfd4"/><line x1="0" y1="138" x2="374" y2="138" stroke="#eadfd4"/><line x1="0" y1="208" x2="374" y2="208" stroke="#eadfd4"/><text x="22" y="102" font-family="Inter, sans-serif" font-size="18" fill="#c4522c">♡</text><text x="54" y="91" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#2f2925">Отметьте интересное</text><text x="54" y="108" font-family="Inter, sans-serif" font-size="10" fill="#7a6e65">Сохранится локально в этом браузере.</text><text x="22" y="172" font-family="Inter, sans-serif" font-size="18" fill="#0f766e">↗</text><text x="54" y="161" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#2f2925">Проверьте дату и программу</text><text x="54" y="178" font-family="Inter, sans-serif" font-size="10" fill="#7a6e65">Карточка откроет источник организатора.</text><text x="22" y="242" font-family="Inter, sans-serif" font-size="18" fill="#0f766e">+</text><text x="54" y="231" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#2f2925">Следите за обновлениями</text><text x="54" y="248" font-family="Inter, sans-serif" font-size="10" fill="#7a6e65">Сейчас это локальная закладка.</text></svg>`;
      const guidance = ensureSvgSupport('Festivals / OV57 fixture adapters / mobile', 'filters-and-guidance · native', svg, 374, 286, 4140, 1480);
      linked(guidance.id, root, 'Festival filters and guidance / mobile / native SVG', 8, 590, 374, 286);
      monthHeadingSvg(root, true, 895, 'Июль', 'Джаз открывает большой фестивальный сезон.');
      linked(SUPPORT.cityJazzMobile, root, 'linked FestivalCard / city-jazz / mobile-full', 8, 944, 374, 201.063);
    } finally { penpot.history.undoBlockFinish(block); }
    return { phase: 'mobile-slim-base', componentId: component.id, rootId: component.mainInstance().id, revision: penpot.currentFile.revn };
  }
  async function reconcileMobileScaffold() {
    assertContext();
    const component = componentByIdentity(OWNER.mobile.path, OWNER.mobile.name); if (!component) throw new Error('mobile owner missing');
    const root = component.mainInstance();
    const block = penpot.history.undoBlockBegin();
    try {
      if (![...root.children].some((shape) => shape.name === 'Month / Август / native SVG heading')) monthHeadingSvg(root, true, 1172, 'Август', 'Главный месяц: море, кино, музыка и история.');
      if (![...root.children].some((shape) => shape.name === 'Month / Ноябрь / native SVG heading')) monthHeadingSvg(root, true, 1636, 'Ноябрь', 'Культурные традиции и осенний джаз.');
      if (![...root.children].some((shape) => /linked Shell \/ Mobile bottom navigation/u.test(shape.name || ''))) linked(SUPPORT.mobileBottomNavigation, root, 'linked Shell / Mobile bottom navigation / current=afisha / sticky', 12, 756, 366, 64);
    } finally { penpot.history.undoBlockFinish(block); }
    return { phase: 'mobile-scaffold', componentId: component.id, rootId: root.id, revision: penpot.currentFile.revn };
  }
  async function reconcileFixtureCard(viewport, slug) {
    assertContext();
    const component = componentByIdentity(OWNER[viewport]?.path, OWNER[viewport]?.name); if (!component) throw new Error(`${viewport} owner missing`);
    const root = component.mainInstance();
    const desktop = {
      sosedi: [170, 706, 250, 270, 'sosedi-square'], grozd: [437, 706, 250, 270, 'grozd-square'],
      'more-vnutri': [704, 706, 250, 270, 'more-vnutri-square'], 'bolshoy-kaup': [971, 706, 250, 270, 'bolshoy-kaup-square'],
      'v-edinstve': [170, 1003, 520, 296, 'v-edinstve-wide'], 'jazz-v-filarmonii': [710, 1003, 520, 296, 'jazz-v-filarmonii-wide'],
    };
    const mobile = {
      sosedi: [8, 1220, 181, 190, 'sosedi-square'], grozd: [201, 1220, 181, 190, 'grozd-square'],
      'more-vnutri': [8, 1422, 181, 190, 'more-vnutri-square'], 'bolshoy-kaup': [201, 1422, 181, 190, 'bolshoy-kaup-square'],
      'v-edinstve': [8, 1684, 181, 190, 'v-edinstve-square'], 'jazz-v-filarmonii': [201, 1684, 181, 190, 'jazz-v-filarmonii-square'],
    };
    const spec = (viewport === 'desktop' ? desktop : mobile)[slug]; if (!spec) throw new Error(`unknown ${viewport} fixture ${slug}`);
    const [x, y, width, height, mediaKey] = spec;
    const existing = [...root.children].find((shape) => shape.name === `Festival fixture / ${slug} / native`);
    if (existing && walk(existing).some((shape) => shape.name === `Festival fixture / ${slug} / heart glyph`)) return { phase: 'fixture-card', viewport, slug, cardId: existing.id, existing: true, revision: penpot.currentFile.revn };
    if (existing) existing.remove();
    const block = penpot.history.undoBlockBegin();
    let card;
    try { card = festivalCard(root, slug, fixtureMedia(mediaKey), x, y, width, height, viewport === 'mobile'); } finally { penpot.history.undoBlockFinish(block); }
    return { phase: 'fixture-card', viewport, slug, cardId: card.id, revision: penpot.currentFile.revn };
  }
  async function completeDesktopBaseManual() {
    assertContext();
    const component = componentByIdentity(OWNER.desktop.path, OWNER.desktop.name); if (!component) throw new Error('desktop owner base missing');
    const root = component.mainInstance();
    const block = penpot.history.undoBlockBegin();
    try {
      [...root.children].filter((shape) => /^Month \/ Июль/u.test(shape.name || '')).forEach((shape) => shape.remove());
      monthHeading(root, false, 458, 'Июль', 'Джаз открывает большой фестивальный сезон.');
      if (![...root.children].some((shape) => /linked FestivalCard \/ city-jazz/u.test(shape.name || ''))) linked(SUPPORT.cityJazzDesktop, root, 'linked FestivalCard / city-jazz / desktop-wide', 170, 456, 673.031, 224.344);
    } finally { penpot.history.undoBlockFinish(block); }
    return { phase: 'desktop-base-complete-manual', componentId: component.id, rootId: root.id, revision: penpot.currentFile.revn };
  }
  async function reconcileDesktopScaffoldManual() {
    assertContext();
    const component = componentByIdentity(OWNER.desktop.path, OWNER.desktop.name); if (!component) throw new Error('desktop owner missing');
    const root = component.mainInstance();
    const block = penpot.history.undoBlockBegin();
    try {
      if (![...root.children].some((shape) => /^Month \/ Август/u.test(shape.name || ''))) monthHeading(root, false, 706, 'Август', 'Главный месяц: море, кино, музыка и история.');
      if (![...root.children].some((shape) => /^Month \/ Ноябрь/u.test(shape.name || ''))) monthHeading(root, false, 1003, 'Ноябрь', 'Культурные традиции и осенний джаз.');
      if (![...root.children].some((shape) => /linked Shell \/ Footer viewport/u.test(shape.name || ''))) linked(SUPPORT.desktopFooterViewport, root, 'linked Shell / Footer viewport / representative', 0, 1425.140625, 1280, 681.859375);
    } finally { penpot.history.undoBlockFinish(block); }
    return { phase: 'desktop-scaffold-manual', componentId: component.id, rootId: root.id, revision: penpot.currentFile.revn };
  }
  async function reconcileMobileShellManual() {
    assertContext();
    const block = penpot.history.undoBlockBegin();
    let component;
    try {
      const ensured = ensureOwner('mobile'); component = ensured.component; const root = ensured.root;
      linked(SUPPORT.mobileShellHeader, root, 'linked Shell / Mobile header', 0, 0, 390, 84);
      const hero = linked(SUPPORT.mobileFestivalHeader, root, 'linked Festival / Header / viewport=mobile / fixture-count=7', 8, 84, 374, 496.266);
      overrideText(hero, 'Stat / festivals / value', '7');
      const chips = board(root, 'Festival month filters / fixture profile', 0, 0, 390, 56, null, 0, false);
      place(chips, 0, 590, 390, 56);
      pill(chips, 'Июл', 107, 7, 54, true); pill(chips, 'Авг', 167, 7, 54); pill(chips, 'Ноя', 227, 7, 56);
    } finally { penpot.history.undoBlockFinish(block); }
    return { phase: 'mobile-shell-manual', componentId: component.id, rootId: component.mainInstance().id, revision: penpot.currentFile.revn };
  }
  async function reconcileMobileGuideManual() {
    assertContext();
    const component = componentByIdentity(OWNER.mobile.path, OWNER.mobile.name); if (!component) throw new Error('mobile owner missing');
    const root = component.mainInstance();
    if ([...root.children].some((shape) => shape.name === 'Festival guidance / surface')) return { phase: 'mobile-guide-manual', existing: true, revision: penpot.currentFile.revn };
    const block = penpot.history.undoBlockBegin();
    try { guide(root, true, 658); } finally { penpot.history.undoBlockFinish(block); }
    return { phase: 'mobile-guide-manual', componentId: component.id, rootId: root.id, revision: penpot.currentFile.revn };
  }
  async function completeMobileBaseManual() {
    assertContext();
    const component = componentByIdentity(OWNER.mobile.path, OWNER.mobile.name); if (!component) throw new Error('mobile owner missing');
    const root = component.mainInstance();
    const block = penpot.history.undoBlockBegin();
    try {
      if (![...root.children].some((shape) => /^Month \/ Июль/u.test(shape.name || ''))) monthHeading(root, true, 895, 'Июль', 'Джаз открывает большой фестивальный сезон.');
      if (![...root.children].some((shape) => /linked FestivalCard \/ city-jazz/u.test(shape.name || ''))) linked(SUPPORT.cityJazzMobile, root, 'linked FestivalCard / city-jazz / mobile-full', 8, 944, 374, 201.063);
    } finally { penpot.history.undoBlockFinish(block); }
    return { phase: 'mobile-base-complete-manual', componentId: component.id, rootId: root.id, revision: penpot.currentFile.revn };
  }
  async function reconcileMobileScaffoldManual() {
    assertContext();
    const component = componentByIdentity(OWNER.mobile.path, OWNER.mobile.name); if (!component) throw new Error('mobile owner missing');
    const root = component.mainInstance();
    const block = penpot.history.undoBlockBegin();
    try {
      if (![...root.children].some((shape) => /^Month \/ Август/u.test(shape.name || ''))) monthHeading(root, true, 1172, 'Август', 'Главный месяц: море, кино, музыка и история.');
      if (![...root.children].some((shape) => /^Month \/ Ноябрь/u.test(shape.name || ''))) monthHeading(root, true, 1636, 'Ноябрь', 'Культурные традиции и осенний джаз.');
      if (![...root.children].some((shape) => /linked Shell \/ Mobile bottom navigation/u.test(shape.name || ''))) linked(SUPPORT.mobileBottomNavigation, root, 'linked Shell / Mobile bottom navigation / current=afisha / sticky', 12, 756, 366, 64);
    } finally { penpot.history.undoBlockFinish(block); }
    return { phase: 'mobile-scaffold-manual', componentId: component.id, rootId: root.id, revision: penpot.currentFile.revn };
  }
  async function finalizeBoundedOwners() {
    assertContext();
    const desktop = componentByIdentity(OWNER.desktop.path, OWNER.desktop.name); const mobile = componentByIdentity(OWNER.mobile.path, OWNER.mobile.name);
    if (!desktop || !mobile) throw new Error('bounded Festival owners missing');
    const block = penpot.history.undoBlockBegin();
    try { bindRadiusToken(desktop.mainInstance()); bindRadiusToken(mobile.mainInstance()); deprecateOldOwners(); } finally { penpot.history.undoBlockFinish(block); }
    penpot.selection = [desktop.mainInstance()];
    return { phase: 'finalized', desktop: desktop.id, mobile: mobile.id, revision: penpot.currentFile.revn };
  }
  async function readback() {
    assertContext();
    const owners = Object.entries(OWNER).map(([viewport, spec]) => {
      const component = componentByIdentity(spec.path, spec.name);
      const root = component?.mainInstance();
      const shapes = root ? walk(root) : [];
      return {
        viewport,
        componentId: component?.id || null,
        rootId: root?.id || null,
        name: root?.name || null,
        size: root ? [root.width, root.height] : null,
        hidden: root?.hidden,
        nativeFestivalCards: shapes.filter((shape) => /^Festival fixture \/[^/]+ \/ native$/u.test(shape.name || '')).length,
        linkedCityJazz: shapes.filter((shape) => /linked FestivalCard \/ city-jazz/u.test(shape.name || '')).length,
        imageFills: shapes.filter((shape) => (shape.fills || []).some((fill) => fill.fillImage)).length,
        fixtureCountText: shapes.filter((shape) => shape.type === 'text' && shape.name === 'Stat / festivals / value').map((shape) => shape.characters),
        tokens: root?.tokens,
      };
    });
    return {
      revision: penpot.currentFile.revn,
      page: { id: penpot.currentPage.id, name: penpot.currentPage.name },
      owners,
      legacy: Object.entries(DEPRECATED_OWNERS).map(([viewport, id]) => {
        const component = componentById(id); const root = component?.mainInstance();
        return { viewport, componentId: id, name: component?.name, rootId: root?.id, hidden: root?.hidden };
      }),
      selection: (penpot.selection || []).map((shape) => shape.id),
      validation: await penpot.currentFile.validate(),
    };
  }
  storage.festivalsOv57BoundedNative = { reconcile, reconcileDesktopBase, reconcileDesktopRows, reconcileMobileBase, reconcileMobileRows, completeDesktopBase, reconcileDesktopScaffold, reconcileMobileSlimBase, reconcileMobileScaffold, reconcileFixtureCard, completeDesktopBaseManual, reconcileDesktopScaffoldManual, reconcileMobileShellManual, reconcileMobileGuideManual, completeMobileBaseManual, reconcileMobileScaffoldManual, finalizeBoundedOwners, readback };
  return { installed: true, methods: Object.keys(storage.festivalsOv57BoundedNative) };
}

installFestivalsOv57BoundedNativeMaterializer(penpot, penpotUtils, storage);

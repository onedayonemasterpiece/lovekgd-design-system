'use strict';

const NAMESPACE = 'kenigevents-u0-recovered-cards-r2';
const PACKAGE_ID = 'U-RECOVERED-CARD-FAMILIES';

const FAMILY_VISUALS = Object.freeze({
  'U-CARD-COMPACT': Object.freeze({
    width: 360, height: 430, radius: 20, fill: '#15110f', stroke: '#793014',
    title: 'Камерный вечер у моря', meta: '12 сентября · 19:00', place: 'Светлогорск',
    media: Object.freeze({ width: 360, height: 288, fill: '#8a3f23', label: 'Визуальное медиа · cover 5:4' }),
    contentFill: '#211a16', accent: '#f4a95f', layout: 'compact-related-row',
  }),
  'U-CARD-FESTIVAL': Object.freeze({
    width: 360, height: 400, radius: 11, fill: '#31261f', stroke: '#39271b',
    title: 'Калининград Сити Джаз', meta: '17–19 июля', place: 'Калининград',
    media: Object.freeze({ width: 360, height: 400, fill: '#432c22', label: 'Медиа фестиваля · source semantic class' }),
    contentFill: '#0f0b09', accent: '#a54821', layout: 'festival-timeline-card',
  }),
  'U-CARD-CLUB': Object.freeze({
    width: 560, height: 544, radius: 28, fill: '#17343a', stroke: '#ffffff',
    title: 'Клуб городских исследователей', meta: 'История и прогулки', place: 'Калининград · 24 встречи',
    media: Object.freeze({ width: 560, height: 544, fill: '#17343a', label: 'Обложка клуба · cover/fallback' }),
    contentFill: '#17343a', accent: '#f49a25', layout: 'interest-club-overlay',
  }),
  'U-CARD-ARTIFACT': Object.freeze({
    width: 94, height: 112, radius: 0, fill: '#fffaf2', stroke: '#fffaf2',
    title: 'Янтарный артефакт', meta: 'Локальная коллекция', place: 'Найдено в этом браузе',
    media: Object.freeze({ width: 74, height: 96, fill: '#ffbf35', label: 'Янтарь' }),
    contentFill: '#fffaf2', accent: '#98401f', layout: 'amber-rail-artifact',
  }),
  'U-CARD-COLLECTION': Object.freeze({
    width: 320, height: 190, radius: 16, fill: '#ffffff', stroke: '#dddddd',
    title: 'Выходные с детьми', meta: 'Опубликовано', place: 'Подборка событий для семьи',
    media: null, contentFill: '#ffffff', accent: '#793014', layout: 'collection-catalog-entry',
  }),
});

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  const input = typeof value === 'string' ? value : canonical(value);
  const bytes = [];
  for (const character of input) {
    const point = character.codePointAt(0);
    if (point < 0x80) bytes.push(point);
    else if (point < 0x800) bytes.push(0xc0 | (point >> 6), 0x80 | (point & 63));
    else if (point < 0x10000) bytes.push(0xe0 | (point >> 12), 0x80 | ((point >> 6) & 63), 0x80 | (point & 63));
    else bytes.push(0xf0 | (point >> 18), 0x80 | ((point >> 12) & 63), 0x80 | ((point >> 6) & 63), 0x80 | (point & 63));
  }
  const constants = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  const hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const bitLengthLow = (bytes.length << 3) >>> 0;
  const bitLengthHigh = Math.floor(bytes.length / 0x20000000) >>> 0;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let index = 3; index >= 0; index -= 1) bytes.push((bitLengthHigh >>> (index * 8)) & 255);
  for (let index = 3; index >= 0; index -= 1) bytes.push((bitLengthLow >>> (index * 8)) & 255);
  const rotateRight = (word, bits) => (word >>> bits) | (word << (32 - bits));
  for (let offset = 0; offset < bytes.length; offset += 64) {
    const words = new Array(64);
    for (let index = 0; index < 16; index += 1) words[index] = ((bytes[offset + index * 4] << 24) | (bytes[offset + index * 4 + 1] << 16) | (bytes[offset + index * 4 + 2] << 8) | bytes[offset + index * 4 + 3]) >>> 0;
    for (let index = 16; index < 64; index += 1) {
      const first = words[index - 15]; const second = words[index - 2];
      const sigma0 = rotateRight(first, 7) ^ rotateRight(first, 18) ^ (first >>> 3);
      const sigma1 = rotateRight(second, 17) ^ rotateRight(second, 19) ^ (second >>> 10);
      words[index] = (words[index - 16] + sigma0 + words[index - 7] + sigma1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = hash;
    for (let index = 0; index < 64; index += 1) {
      const sum1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choose = (e & f) ^ ((~e) & g);
      const temporary1 = (h + sum1 + choose + constants[index] + words[index]) >>> 0;
      const sum0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temporary2 = (sum0 + majority) >>> 0;
      h = g; g = f; f = e; e = (d + temporary1) >>> 0; d = c; c = b; b = a; a = (temporary1 + temporary2) >>> 0;
    }
    hash[0] = (hash[0] + a) >>> 0; hash[1] = (hash[1] + b) >>> 0; hash[2] = (hash[2] + c) >>> 0; hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0; hash[5] = (hash[5] + f) >>> 0; hash[6] = (hash[6] + g) >>> 0; hash[7] = (hash[7] + h) >>> 0;
  }
  return hash.map((word) => word.toString(16).padStart(8, '0')).join('');
}

function assertActiveLease(lease, boundary) {
  if (!lease || lease.active !== true || lease.cancelled === true) {
    const error = new Error(`LEASE_NOT_ACTIVE:${boundary}`);
    error.code = 'LEASE_NOT_ACTIVE';
    throw error;
  }
}

function assertString(value, label) {
  if (typeof value !== 'string') throw new TypeError(`PLUGIN_DATA_STRING_REQUIRED:${label}`);
  return value;
}

function shared(shape, key) {
  return shape?.getSharedPluginData?.(NAMESPACE, key) || '';
}

function tag(shape, key, value) {
  shape.setSharedPluginData(NAMESPACE, key, assertString(value, key));
}

function children(shape) { return Array.from(shape?.children || []); }
function walk(shape) { return shape ? [shape, ...children(shape).flatMap(walk)] : []; }

function nativeWrite(penpot, lease, label, operation) {
  assertActiveLease(lease, `before:${label}`);
  const block = penpot.history.undoBlockBegin();
  try {
    const result = operation();
    if (result && typeof result.then === 'function') throw new Error(`ASYNC_WRITE_FORBIDDEN:${label}`);
    assertActiveLease(lease, `after:${label}`);
    return result;
  } finally {
    penpot.history.undoBlockFinish(block);
  }
}

function resize(shape, width, height) {
  shape.resize(width, height);
}

function setSurface(shape, { fill, stroke, radius = 0, opacity = 1 }) {
  shape.fills = [{ fillColor: fill, fillOpacity: opacity }];
  shape.strokes = [{ strokeColor: stroke, strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
  shape.borderRadius = radius;
}

function addFlex(board, { dir = 'column', gap = 0, padding = 0, align = 'stretch', justify = 'start', wrap = 'nowrap' } = {}) {
  const flex = board.addFlexLayout();
  flex.dir = dir;
  flex.wrap = wrap;
  flex.alignItems = align;
  flex.justifyContent = justify;
  flex.rowGap = gap;
  flex.columnGap = gap;
  flex.verticalPadding = padding;
  flex.horizontalPadding = padding;
  return flex;
}

function makeText(penpot, text, style = {}) {
  assertString(text, 'text.characters');
  const node = penpot.createText(text);
  if (!node) throw new Error('TEXT_CREATION_FAILED');
  node.name = style.name || text;
  node.fontFamily = style.fontFamily || 'Inter';
  node.fontSize = style.fontSize || '14';
  node.fontWeight = style.fontWeight || '500';
  node.lineHeight = style.lineHeight || '1.25';
  node.growType = style.growType || 'auto-height';
  node.fills = [{ fillColor: style.color || '#281d17', fillOpacity: 1 }];
  if (style.width && style.height) resize(node, style.width, style.height);
  return node;
}

function appendTagged(parent, child, anatomyId) {
  tag(child, 'anatomy-id', anatomyId);
  parent.appendChild(child);
  return child;
}

function makePanel(penpot, name, width, height, fill, radius = 0) {
  const board = penpot.createBoard();
  board.name = name;
  resize(board, width, height);
  setSurface(board, { fill, stroke: fill, radius });
  return board;
}

function makeCompactMaster(penpot, visual) {
  const master = makePanel(penpot, 'Card / Compact / Master', visual.width, visual.height, visual.fill, visual.radius);
  addFlex(master, { dir: 'column' });
  const media = makePanel(penpot, 'Bounded media shell · 5:4', visual.media.width, visual.media.height, visual.media.fill, 20);
  addFlex(media, { dir: 'column', padding: 18, justify: 'end' });
  media.appendChild(makeText(penpot, visual.media.label, { color: '#fffaf2', fontSize: '12', fontWeight: '760' }));
  appendTagged(master, media, 'bounded-media-shell');
  const body = makePanel(penpot, 'Compact recommendation content', visual.width, visual.height - visual.media.height, visual.contentFill, 0);
  addFlex(body, { dir: 'column', gap: 7, padding: 14 });
  appendTagged(body, makeText(penpot, visual.title, { color: '#ffffff', fontSize: '20', fontWeight: '800' }), 'title');
  appendTagged(body, makeText(penpot, `${visual.meta} · ${visual.place}`, { color: '#f6d7bd', fontSize: '13', fontWeight: '650' }), 'date-and-place-summary');
  appendTagged(body, makeText(penpot, 'Не интересно  ·  Открыть', { color: visual.accent, fontSize: '12', fontWeight: '760' }), 'utility-and-feedback-tail');
  master.appendChild(body);
  return master;
}

function makeFestivalMaster(penpot, visual) {
  const master = makePanel(penpot, 'Card / Festival / Master', visual.width, visual.height, visual.fill, visual.radius);
  const media = makePanel(penpot, 'Festival semantic media', visual.width, visual.height, visual.media.fill, visual.radius);
  addFlex(media, { dir: 'column', padding: 18, justify: 'space-between' });
  appendTagged(media, makeText(penpot, visual.media.label, { color: '#f8e2ce', fontSize: '12', fontWeight: '720' }), 'festival-media');
  const top = makePanel(penpot, 'Date and program status', visual.width - 36, 34, '#432c22', 4);
  addFlex(top, { dir: 'row', gap: 8, align: 'center', justify: 'space-between' });
  appendTagged(top, makeText(penpot, visual.meta, { color: '#ffffff', fontSize: '13', fontWeight: '740' }), 'date-label');
  appendTagged(top, makeText(penpot, 'Объявлено', { color: '#24743b', fontSize: '13', fontWeight: '740' }), 'program-status');
  media.appendChild(top);
  const caption = makePanel(penpot, 'Festival caption and actions', visual.width - 36, 150, visual.contentFill, 8);
  addFlex(caption, { dir: 'column', gap: 7, padding: 12 });
  appendTagged(caption, makeText(penpot, '● ♥ · Музыка', { color: '#f4c7a7', fontSize: '12', fontWeight: '800' }), 'category-icons');
  appendTagged(caption, makeText(penpot, visual.title, { color: '#ffffff', fontSize: '24', fontWeight: '820' }), 'title');
  appendTagged(caption, makeText(penpot, visual.place, { color: '#ead7ca', fontSize: '13', fontWeight: '650' }), 'place');
  appendTagged(caption, makeText(penpot, 'Официальный сайт  ↗', { color: '#ffffff', fontSize: '12', fontWeight: '780' }), 'official-source-cta');
  appendTagged(caption, makeText(penpot, '♡', { color: '#ffffff', fontSize: '22', fontWeight: '700' }), 'local-favorite-state');
  media.appendChild(caption);
  master.appendChild(media);
  return master;
}

function makeClubMaster(penpot, visual) {
  const master = makePanel(penpot, 'Card / Club / Master', visual.width, visual.height, visual.fill, visual.radius);
  const media = makePanel(penpot, 'Club cover and veil', visual.width, visual.height, visual.media.fill, visual.radius);
  addFlex(media, { dir: 'column', padding: 26, justify: 'end' });
  appendTagged(media, makeText(penpot, visual.media.label, { color: '#a9ddff', fontSize: '12', fontWeight: '780' }), 'cover-or-fallback');
  const veil = makePanel(penpot, 'Legibility veil', visual.width - 52, 340, '#17343a', 22);
  addFlex(veil, { dir: 'column', gap: 12, padding: 18, justify: 'end' });
  tag(veil, 'anatomy-id', 'veil');
  appendTagged(veil, makeText(penpot, visual.meta.toUpperCase(), { color: '#e9fffd', fontSize: '13', fontWeight: '850' }), 'topic');
  const futureBadge = appendTagged(veil, makeText(penpot, 'Есть будущие встречи', { color: '#24170c', fontSize: '12', fontWeight: '900' }), 'future-meeting-badge');
  futureBadge.visible = false;
  appendTagged(veil, makeText(penpot, visual.title, { color: '#ffffff', fontSize: '32', fontWeight: '820' }), 'title');
  appendTagged(veil, makeText(penpot, 'Мы исследуем город пешком, собираем истории и делимся маршрутами.', { color: '#e7f2f2', fontSize: '15', fontWeight: '500' }), 'description');
  appendTagged(veil, makeText(penpot, visual.place, { color: '#d7ecec', fontSize: '13', fontWeight: '760' }), 'place-and-activity-facts');
  appendTagged(veil, makeText(penpot, '← ↑ ↓ →  Enter', { color: '#b9dada', fontSize: '11', fontWeight: '800' }), 'keyboard-hint');
  appendTagged(veil, makeText(penpot, 'Подробнее  →', { color: '#a9ddff', fontSize: '14', fontWeight: '900' }), 'detail-action');
  media.appendChild(veil);
  master.appendChild(media);
  return master;
}

function makeArtifactMaster(penpot, visual) {
  const master = makePanel(penpot, 'Card / Artifact / Master', visual.width, visual.height, visual.fill, visual.radius);
  const glow = penpot.createEllipse();
  glow.name = 'Discovery glow'; resize(glow, 78, 68); glow.fills = [{ fillColor: '#ffbe43', fillOpacity: 0.42 }];
  appendTagged(master, glow, 'discovery-glow');
  const artifact = makePanel(penpot, 'Amber object', visual.media.width, visual.media.height, visual.media.fill, 28);
  addFlex(artifact, { dir: 'column', align: 'center', justify: 'center' });
  appendTagged(artifact, makeText(penpot, visual.media.label, { color: '#5c3109', fontSize: '12', fontWeight: '900' }), 'artifact-visual');
  master.appendChild(artifact);
  appendTagged(master, makeText(penpot, 'Нажатие', { color: '#793014', fontSize: '9', fontWeight: '800' }), 'pressed-state');
  const pressed = walk(master).find((shape) => shared(shape, 'anatomy-id') === 'pressed-state');
  pressed.visible = false;
  const found = appendTagged(master, makeText(penpot, '✓ Найдено', { color: '#793014', fontSize: '9', fontWeight: '800' }), 'found-badge');
  found.visible = false;
  const live = appendTagged(master, makeText(penpot, 'Артефакт добавлен в локальную коллекцию', { color: '#281d17', fontSize: '1', fontWeight: '500' }), 'live-region');
  live.visible = false;
  appendTagged(master, makeText(penpot, 'Ячейка 01', { color: '#98401f', fontSize: '9', fontWeight: '800' }), 'collection-slot-relation');
  return master;
}

function makeCollectionMaster(penpot, visual) {
  const master = makePanel(penpot, 'Card / Collection / Master', visual.width, visual.height, visual.fill, visual.radius);
  addFlex(master, { dir: 'column', gap: 10, padding: 18 });
  appendTagged(master, makeText(penpot, visual.meta.toUpperCase(), { color: '#725f50', fontSize: '12', fontWeight: '760' }), 'lifecycle-status');
  appendTagged(master, makeText(penpot, visual.title, { color: '#281d17', fontSize: '24', fontWeight: '820' }), 'title');
  appendTagged(master, makeText(penpot, visual.place, { color: '#5f5148', fontSize: '14', fontWeight: '500' }), 'description');
  appendTagged(master, makeText(penpot, 'Открыть подборку  →', { color: visual.accent, fontSize: '13', fontWeight: '800' }), 'link-or-disabled-container');
  return master;
}

function makeMaster(penpot, unit) {
  const visual = FAMILY_VISUALS[unit.unit_id];
  if (!visual) throw new Error(`FAMILY_VISUAL_MISSING:${unit.unit_id}`);
  if (unit.unit_id === 'U-CARD-COMPACT') return makeCompactMaster(penpot, visual);
  if (unit.unit_id === 'U-CARD-FESTIVAL') return makeFestivalMaster(penpot, visual);
  if (unit.unit_id === 'U-CARD-CLUB') return makeClubMaster(penpot, visual);
  if (unit.unit_id === 'U-CARD-ARTIFACT') return makeArtifactMaster(penpot, visual);
  return makeCollectionMaster(penpot, visual);
}

function applyState(instance, familyId, state) {
  tag(instance, 'state-id', state);
  instance.name = `Linked specimen / ${state}`;
  const byAnatomy = new Map(walk(instance).map((shape) => [shared(shape, 'anatomy-id'), shape]));
  const setText = (id, text) => {
    const node = byAnatomy.get(id);
    if (node && typeof node.characters === 'string') node.characters = text;
  };
  const setFill = (shape, color, opacity = 1) => { if (shape) shape.fills = [{ fillColor: color, fillOpacity: opacity }]; };
  const setStroke = (shape, color, width, opacity = 1) => { if (shape) shape.strokes = [{ strokeColor: color, strokeOpacity: opacity, strokeStyle: 'solid', strokeWidth: width, strokeAlignment: 'outer' }]; };
  const mediaParent = (id) => byAnatomy.get(id)?.parent || null;
  const binding = `${familyId}:${state}`;

  if (binding === 'U-CARD-COMPACT:visual-fixed-5x4') {
    const media = byAnatomy.get('bounded-media-shell'); resize(media, 360, 288); setFill(media, '#8a3f23');
    tag(instance, 'media-fit', 'cover'); tag(instance, 'media-ratio', '5:4');
  } else if (binding === 'U-CARD-COMPACT:document-contain') {
    const media = byAnatomy.get('bounded-media-shell'); resize(media, 360, 450); setFill(media, '#f7efe3'); setStroke(media, '#793014', 1);
    setText('bounded-media-shell', 'Документ · contain · natural aspect'); resize(instance, 360, 592);
    tag(instance, 'media-fit', 'contain'); tag(instance, 'media-ratio', 'natural');
  } else if (binding === 'U-CARD-COMPACT:document-bounded-cover') {
    const media = byAnatomy.get('bounded-media-shell'); resize(media, 360, 400); setFill(media, '#ead7ca'); setStroke(media, '#793014', 2);
    setText('bounded-media-shell', 'Документ · bounded cover · crop ≤ 20%'); resize(instance, 360, 542);
    tag(instance, 'media-fit', 'cover'); tag(instance, 'document-crop-budget', '0.20');
  } else if (binding === 'U-CARD-COMPACT:long-copy') {
    setText('title', 'Длинный заголовок камерного вечера с музыкой и разговорами у моря');
    resize(instance, 360, 472); resize(byAnatomy.get('title'), 332, 72); tag(instance, 'copy-lines', '3');
  } else if (binding === 'U-CARD-FESTIVAL:announced') {
    setText('program-status', 'Объявлено'); setFill(byAnatomy.get('program-status'), '#24743b');
  } else if (binding === 'U-CARD-FESTIVAL:program-pending') {
    setText('program-status', 'Программа скоро'); setFill(byAnatomy.get('program-status'), '#76540a');
    byAnatomy.get('official-source-cta').opacity = 0.72;
  } else if (binding === 'U-CARD-FESTIVAL:date-pending') {
    setText('date-label', 'Даты уточняются'); setText('program-status', 'Следим за анонсом');
    setFill(byAnatomy.get('date-label'), '#ffffff'); setFill(byAnatomy.get('program-status'), '#76540a'); resize(byAnatomy.get('date-label'), 172, 34);
  } else if (binding === 'U-CARD-FESTIVAL:visual-media') {
    const media = mediaParent('festival-media'); setFill(media, '#432c22'); setStroke(media, '#39271b', 1); resize(media, 360, 225); resize(instance, 360, 225); setText('festival-media', 'Визуальное медиа · cover · 16:10');
    tag(instance, 'media-fit', 'cover'); tag(instance, 'media-ratio', '16:10');
  } else if (binding === 'U-CARD-FESTIVAL:document-media') {
    const media = mediaParent('festival-media'); setFill(media, '#432c22'); setStroke(media, '#39271b', 1); resize(media, 360, 450); resize(instance, 360, 450);
    setText('festival-media', 'Документ · protected cover · 4:5'); setFill(byAnatomy.get('festival-media'), '#f8e2ce'); tag(instance, 'media-fit', 'cover'); tag(instance, 'media-ratio', '4:5');
  } else if (binding === 'U-CARD-CLUB:cover-ready') {
    const media = mediaParent('cover-or-fallback'); setFill(media, '#17343a'); setText('cover-or-fallback', 'Обложка клуба · cover · center 48%');
    byAnatomy.get('future-meeting-badge').visible = false; tag(instance, 'cover-state', 'ready'); tag(instance, 'media-fit', 'cover');
  } else if (binding === 'U-CARD-CLUB:cover-fallback') {
    const media = mediaParent('cover-or-fallback'); setFill(media, '#1b263d'); setStroke(media, '#75d3cc', 1, 0.3); setText('cover-or-fallback', 'Нативный геометрический fallback обложки');
    byAnatomy.get('future-meeting-badge').visible = false; tag(instance, 'cover-state', 'fallback');
  } else if (binding === 'U-CARD-CLUB:future-meetings') {
    const badge = byAnatomy.get('future-meeting-badge'); badge.visible = true; setText('future-meeting-badge', 'Ближайших встреч: 3'); setFill(badge, '#f49a25'); setStroke(badge, '#fff4da', 1, 0.78); resize(badge, 176, 34);
  } else if (binding === 'U-CARD-CLUB:focus-visible') {
    setStroke(instance, '#f4b942', 3); const hint = byAnatomy.get('keyboard-hint'); hint.visible = true; hint.opacity = 0.72;
    tag(instance, 'focus-offset', '5');
  } else if (binding === 'U-CARD-CLUB:reduced-motion') {
    const hint = byAnatomy.get('keyboard-hint'); hint.visible = false; instance.x = 0; instance.y = 0; instance.opacity = 1;
    tag(instance, 'motion-profile', 'none'); tag(instance, 'transform-profile', 'none');
  } else if (binding === 'U-CARD-ARTIFACT:default') {
    byAnatomy.get('found-badge').visible = false; byAnatomy.get('pressed-state').visible = false; setFill(byAnatomy.get('discovery-glow'), '#ffbe43', 0.42);
  } else if (binding === 'U-CARD-ARTIFACT:awake') {
    const glow = byAnatomy.get('discovery-glow'); setFill(glow, '#ffd76a', 0.78); const visual = mediaParent('artifact-visual'); visual.y = -1;
    tag(instance, 'motion-profile', 'awake-cycle');
  } else if (binding === 'U-CARD-ARTIFACT:collecting') {
    const pressed = byAnatomy.get('pressed-state'); pressed.visible = true; setFill(pressed, '#fff4bd'); const visual = mediaParent('artifact-visual'); resize(visual, 81, 105);
    tag(instance, 'motion-profile', 'collect-430ms');
  } else if (binding === 'U-CARD-ARTIFACT:collected') {
    const badge = byAnatomy.get('found-badge'); badge.visible = true; const visual = mediaParent('artifact-visual'); resize(visual, 70, 90); visual.opacity = 0.82;
    setFill(byAnatomy.get('discovery-glow'), '#ffbe43', 0.28); tag(instance, 'aria-pressed', 'true');
  } else if (binding === 'U-CARD-ARTIFACT:focus-visible') {
    setStroke(instance, '#0f766e', 3, 0.66); tag(instance, 'focus-offset', '-4');
  } else if (binding === 'U-CARD-ARTIFACT:reduced-motion') {
    const visual = mediaParent('artifact-visual'); visual.y = 0; setFill(byAnatomy.get('discovery-glow'), '#ffec9c', 0.76); byAnatomy.get('found-badge').visible = false;
    tag(instance, 'motion-profile', 'none'); tag(instance, 'transition-profile', 'none');
  } else if (binding === 'U-CARD-COLLECTION:public-link') {
    setText('lifecycle-status', 'ГОТОВО'); setFill(byAnatomy.get('lifecycle-status'), '#24743b'); setStroke(instance, '#dddddd', 1);
  } else if (binding === 'U-CARD-COLLECTION:repair-link') {
    setText('lifecycle-status', 'ОБНОВЛЯЕТСЯ'); setFill(byAnatomy.get('lifecycle-status'), '#a54821'); setStroke(instance, '#d08a31', 2);
  } else if (binding === 'U-CARD-COLLECTION:deferred-disabled') {
    setText('lifecycle-status', 'СКОРО'); setText('link-or-disabled-container', 'Подборка пока недоступна'); instance.opacity = 0.72;
    tag(instance, 'link-enabled', 'false');
  } else {
    throw new Error(`STATE_BINDING_MISSING:${binding}`);
  }
  tag(instance, 'state-binding', binding);
}

function managedComponents(penpot) {
  return Array.from(penpot.library?.local?.components || []).filter((component) => shared(component.mainInstance?.(), 'package-id') === PACKAGE_ID);
}

const PROJECTION_PLUGIN_KEYS = Object.freeze([
  'package-id', 'unit-id', 'family-id', 'stable-id', 'specimen-id', 'state-id', 'state-binding',
  'anatomy-id', 'source-head', 'source-tree', 'source-lineage', 'layout-contract', 'viewport',
  'atlas-extension-state', 'atlas-page-order-assigned', 'media-fit', 'media-ratio',
  'document-crop-budget', 'copy-lines', 'cover-state', 'motion-profile', 'transform-profile',
  'transition-profile', 'focus-offset', 'aria-pressed', 'link-enabled', 'implementation-kind',
  'protected-marker',
]);

function imageProjection(image) {
  if (!image) return null;
  return {
    id: image.id ?? null, name: image.name ?? null, width: image.width ?? null, height: image.height ?? null,
    mimeType: image.mimeType ?? image.mime_type ?? null,
  };
}

function paintProjection(paint) {
  if (!paint || typeof paint !== 'object') return paint ?? null;
  return {
    fillColor: paint.fillColor ?? null, fillOpacity: paint.fillOpacity ?? null,
    strokeColor: paint.strokeColor ?? null, strokeOpacity: paint.strokeOpacity ?? null,
    strokeStyle: paint.strokeStyle ?? null, strokeWidth: paint.strokeWidth ?? null,
    strokeAlignment: paint.strokeAlignment ?? null,
    fillImage: imageProjection(paint.fillImage),
  };
}

function pluginProjection(shape) {
  const values = new Map();
  if (shape?.shared instanceof Map) {
    for (const [key, value] of shape.shared.entries()) values.set(key, value);
  }
  for (const key of PROJECTION_PLUGIN_KEYS) {
    const value = shared(shape, key);
    if (value !== '') values.set(`${NAMESPACE}\0${key}`, value);
  }
  return Array.from(values.entries()).sort(([left], [right]) => left.localeCompare(right));
}

function flexProjection(shape) {
  const flex = shape?.flex;
  if (!flex) return null;
  return {
    dir: flex.dir ?? null, wrap: flex.wrap ?? null, alignItems: flex.alignItems ?? null,
    justifyContent: flex.justifyContent ?? null, rowGap: flex.rowGap ?? null, columnGap: flex.columnGap ?? null,
    verticalPadding: flex.verticalPadding ?? null, horizontalPadding: flex.horizontalPadding ?? null,
  };
}

function shapeProjection(shape) {
  const component = shape.component?.() || null;
  return {
    id: shape.id, name: shape.name || '', type: shape.type || '', x: shape.x, y: shape.y,
    width: shape.width, height: shape.height, visible: shape.visible !== false,
    characters: typeof shape.characters === 'string' ? shape.characters : null,
    fills: Array.from(shape.fills || []).map(paintProjection),
    strokes: Array.from(shape.strokes || []).map(paintProjection),
    fillImage: imageProjection(shape.fillImage),
    borderRadius: shape.borderRadius ?? null,
    borderRadii: [shape.borderRadiusTopLeft ?? null, shape.borderRadiusTopRight ?? null, shape.borderRadiusBottomRight ?? null, shape.borderRadiusBottomLeft ?? null],
    opacity: shape.opacity ?? null,
    pluginData: pluginProjection(shape),
    component: component ? { id: component.id, name: component.name || '', path: component.path || '', copy: Boolean(shape.isComponentCopyInstance?.()) } : null,
    flex: flexProjection(shape),
    children: children(shape).map(shapeProjection),
  };
}

function protectedProjection(penpot) {
  const pages = Array.from(penpot.currentFile?.pages || [])
    .filter((page) => shared(page, 'package-id') !== PACKAGE_ID)
    .map((page) => ({ id: page.id, name: page.name, root: shapeProjection(page.root) }))
    .sort((left, right) => left.id.localeCompare(right.id));
  const components = Array.from(penpot.library?.local?.components || [])
    .filter((component) => shared(component.mainInstance?.(), 'package-id') !== PACKAGE_ID)
    .map((component) => ({ id: component.id, name: component.name, main: component.mainInstance?.() ? shapeProjection(component.mainInstance()) : null }))
    .sort((left, right) => left.id.localeCompare(right.id));
  const projection = { fileId: penpot.currentFile.id, pages, components };
  return { canonical: canonical(projection), sha256: sha256(projection), projection };
}

function managedProjection(penpot) {
  const pages = Array.from(penpot.currentFile?.pages || [])
    .filter((page) => shared(page, 'package-id') === PACKAGE_ID)
    .map((page) => ({ id: page.id, name: page.name, pluginData: pluginProjection(page), root: shapeProjection(page.root) }))
    .sort((left, right) => left.id.localeCompare(right.id));
  const components = managedComponents(penpot)
    .map((component) => ({ id: component.id, name: component.name, path: component.path || '', main: shapeProjection(component.mainInstance()) }))
    .sort((left, right) => left.id.localeCompare(right.id));
  const projection = { fileId: penpot.currentFile.id, pages, components };
  return { canonical: canonical(projection), sha256: sha256(projection), projection };
}

function hasImageFill(shape) {
  if (shape?.fillImage) return true;
  return Array.from(shape?.fills || []).some((paint) => Boolean(paint?.fillImage));
}

function findPages(penpot, unitId) {
  return Array.from(penpot.currentFile?.pages || []).filter((page) => shared(page, 'package-id') === PACKAGE_ID && shared(page, 'unit-id') === unitId);
}

function findRoots(page, unitId) {
  return walk(page.root).filter((shape) => shared(shape, 'stable-id') === `root:${unitId}`);
}

function findFamilyComponents(penpot, unitId) {
  return managedComponents(penpot).filter((component) => shared(component.mainInstance?.(), 'family-id') === unitId);
}

function sourceLineage(sourceAuthority, unit) {
  const roles = new Set(unit.components[0].source_consumers);
  return sourceAuthority.files
    .filter((item) => roles.has(item.role))
    .map((item) => ({ role: item.role, path: item.path, git_blob_sha1: item.git_blob_sha1 }));
}

function createPage(penpot, lease, unit) {
  return nativeWrite(penpot, lease, `page:${unit.unit_id}`, () => {
    const page = penpot.createPage();
    page.name = unit.page_name;
    tag(page, 'package-id', PACKAGE_ID);
    tag(page, 'unit-id', unit.unit_id);
    tag(page, 'atlas-extension-state', 'REQUEST_PRESERVED_O0_BINDING_PENDING');
    tag(page, 'atlas-page-order-assigned', 'false');
    return page;
  });
}

function createRoot(penpot, lease, page, unit, sourceAuthority) {
  return nativeWrite(penpot, lease, `root:${unit.unit_id}`, () => {
    const specimenRows = Math.ceil(unit.specimens.length / 2);
    const specimensHeight = specimenRows * 660 + Math.max(0, specimenRows - 1) * 24;
    const rootHeight = 32 + 128 + 24 + specimensHeight + 32;
    const root = makePanel(penpot, unit.root_name, 1536, rootHeight, '#f7efe3', 28);
    root.x = 0; root.y = 0;
    addFlex(root, { dir: 'column', gap: 24, padding: 32 });
    tag(root, 'package-id', PACKAGE_ID);
    tag(root, 'unit-id', unit.unit_id);
    tag(root, 'stable-id', `root:${unit.unit_id}`);
    tag(root, 'source-head', sourceAuthority.head);
    tag(root, 'source-tree', sourceAuthority.tree);
    tag(root, 'source-lineage', JSON.stringify(sourceLineage(sourceAuthority, unit)));
    const header = makePanel(penpot, 'Source-bound family contract', 1472, 128, '#fffdf8', 16);
    addFlex(header, { dir: 'column', gap: 10, padding: 18 });
    header.appendChild(makeText(penpot, unit.page_name, { color: '#281d17', fontSize: '28', fontWeight: '840' }));
    header.appendChild(makeText(penpot, `${unit.components[0].responsive_behavior} ${unit.components[0].explicit_difference_from_eventcard}`, { color: '#725f50', fontSize: '14', fontWeight: '520' }));
    root.appendChild(header);
    const specimens = makePanel(penpot, 'Linked visible state specimens', 1472, specimensHeight, '#f7efe3', 0);
    addFlex(specimens, { dir: 'row', gap: 24, padding: 0, align: 'start', wrap: 'wrap' });
    tag(specimens, 'stable-id', `specimens-grid:${unit.unit_id}`);
    root.appendChild(specimens);
    page.root.appendChild(root);
    return root;
  });
}

function createComponent(penpot, lease, page, unit, sourceAuthority) {
  return nativeWrite(penpot, lease, `component:${unit.unit_id}`, () => {
    const master = makeMaster(penpot, unit);
    master.x = 1600; master.y = 0;
    tag(master, 'package-id', PACKAGE_ID);
    tag(master, 'family-id', unit.unit_id);
    tag(master, 'stable-id', `component:${unit.unit_id}`);
    tag(master, 'source-head', sourceAuthority.head);
    tag(master, 'source-tree', sourceAuthority.tree);
    tag(master, 'source-lineage', JSON.stringify(sourceLineage(sourceAuthority, unit)));
    tag(master, 'layout-contract', FAMILY_VISUALS[unit.unit_id].layout);
    page.root.appendChild(master);
    const component = penpot.library.local.createComponent([master]);
    if (!component) throw new Error(`COMPONENT_CREATION_FAILED:${unit.unit_id}`);
    component.name = unit.unit_id;
    component.path = 'Components / Recovered card families / Candidate';
    return component;
  });
}

function createSpecimen(penpot, lease, root, unit, specimen, component) {
  return nativeWrite(penpot, lease, `specimen:${specimen.specimen_id}`, () => {
    const wrapper = makePanel(penpot, `State / ${specimen.state}`, 680, 660, '#fffdf8', 18);
    addFlex(wrapper, { dir: 'column', gap: 14, padding: 18 });
    tag(wrapper, 'package-id', PACKAGE_ID);
    tag(wrapper, 'unit-id', unit.unit_id);
    tag(wrapper, 'specimen-id', specimen.specimen_id);
    tag(wrapper, 'stable-id', `specimen:${specimen.specimen_id}`);
    tag(wrapper, 'viewport', JSON.stringify(specimen.viewport));
    wrapper.appendChild(makeText(penpot, specimen.state, { color: '#793014', fontSize: '16', fontWeight: '820' }));
    const instance = component.instance();
    if (!instance) throw new Error(`INSTANCE_CREATION_FAILED:${specimen.specimen_id}`);
    tag(instance, 'package-id', PACKAGE_ID);
    tag(instance, 'family-id', unit.unit_id);
    tag(instance, 'specimen-id', specimen.specimen_id);
    applyState(instance, unit.unit_id, specimen.state);
    wrapper.appendChild(instance);
    const grid = walk(root).find((shape) => shared(shape, 'stable-id') === `specimens-grid:${unit.unit_id}`);
    if (!grid) throw new Error(`SPECIMEN_GRID_MISSING:${unit.unit_id}`);
    grid.appendChild(wrapper);
    return wrapper;
  });
}

function readback(penpot, packageDefinition) {
  const pages = packageDefinition.page_units.flatMap((unit) => findPages(penpot, unit.unit_id));
  const roots = packageDefinition.page_units.flatMap((unit) => pages.filter((page) => shared(page, 'unit-id') === unit.unit_id).flatMap((page) => findRoots(page, unit.unit_id)));
  const components = managedComponents(penpot);
  const wrappers = pages.flatMap((page) => walk(page.root).filter((shape) => shared(shape, 'stable-id').startsWith('specimen:')));
  const instances = pages.flatMap((page) => walk(page.root).filter((shape) => Boolean(shared(shape, 'specimen-id')) && shape.isComponentCopyInstance?.()));
  const duplicateKeys = [];
  const allKeys = [
    ...pages.map((page) => `page:${shared(page, 'unit-id')}`),
    ...roots.map((root) => shared(root, 'stable-id')),
    ...components.map((component) => shared(component.mainInstance?.(), 'stable-id')),
    ...wrappers.map((shape) => shared(shape, 'stable-id')),
  ];
  const seen = new Set();
  for (const key of allKeys) {
    if (seen.has(key)) duplicateKeys.push(key);
    seen.add(key);
  }
  const detached = instances.filter((instance) => !instance.isComponentCopyInstance?.() || !instance.component?.());
  const screenshots = roots.flatMap((root) => walk(root)).filter((shape) => (
    shared(shape, 'implementation-kind') === 'screenshot'
    || /screenshot/i.test(shape.name || '')
    || String(shape.type || '').toLowerCase() === 'image'
    || hasImageFill(shape)
  ));
  const lineageErrors = [];
  for (const unit of packageDefinition.page_units) {
    const expected = JSON.stringify(sourceLineage(packageDefinition.source_authority, unit));
    for (const shape of [...roots.filter((item) => shared(item, 'unit-id') === unit.unit_id), ...components.map((item) => item.mainInstance()).filter((item) => shared(item, 'family-id') === unit.unit_id)]) {
      if (shared(shape, 'source-head') !== packageDefinition.source_authority.head || shared(shape, 'source-tree') !== packageDefinition.source_authority.tree || shared(shape, 'source-lineage') !== expected) lineageErrors.push(unit.unit_id);
    }
  }
  return { pages, roots, components, wrappers, instances, duplicateKeys, detached, screenshots, lineageErrors };
}

function validatePackage(packageDefinition) {
  const errors = [];
  if (packageDefinition.package_id !== PACKAGE_ID) errors.push('PACKAGE_ID_MISMATCH');
  if (packageDefinition.source_authority?.head !== '8f46f068ba41dab4dca538806d11693c8c0d3042') errors.push('SOURCE_HEAD_DRIFT');
  if (packageDefinition.source_authority?.tree !== 'a1739a4881262c2db9acd679e7b962a969ab5968') errors.push('SOURCE_TREE_DRIFT');
  if (!Array.isArray(packageDefinition.page_units) || packageDefinition.page_units.length !== 5) errors.push('FIVE_PAGE_UNITS_REQUIRED');
  for (const unit of packageDefinition.page_units || []) {
    if (!FAMILY_VISUALS[unit.unit_id]) errors.push(`FAMILY_VISUAL_MISSING:${unit.unit_id}`);
    if (unit.components?.length !== 1) errors.push(`ONE_COMPONENT_REQUIRED:${unit.unit_id}`);
    if (!unit.specimens?.length) errors.push(`SPECIMENS_REQUIRED:${unit.unit_id}`);
    if (!unit.components?.[0]?.explicit_difference_from_eventcard) errors.push(`EVENTCARD_DIFFERENCE_REQUIRED:${unit.unit_id}`);
    const declaredStates = unit.components?.[0]?.states || [];
    const specimenStates = (unit.specimens || []).map((specimen) => specimen.state);
    if (new Set(declaredStates).size !== declaredStates.length) errors.push(`DUPLICATE_DECLARED_STATE:${unit.unit_id}`);
    if (new Set(specimenStates).size !== specimenStates.length) errors.push(`DUPLICATE_SPECIMEN_STATE:${unit.unit_id}`);
    if (canonical([...declaredStates].sort()) !== canonical([...specimenStates].sort())) errors.push(`STATE_SPECIMEN_COVERAGE_MISMATCH:${unit.unit_id}`);
    const managedExpected = 1 + (unit.components?.length || 0) + (unit.specimens?.length || 0);
    if (unit.managed_nodes_expected !== managedExpected) errors.push(`MANAGED_NODE_CENSUS_MISMATCH:${unit.unit_id}:${managedExpected}:${unit.managed_nodes_expected}`);
  }
  const specimenCount = (packageDefinition.page_units || []).reduce((count, unit) => count + (unit.specimens?.length || 0), 0);
  const managedCount = (packageDefinition.page_units?.length || 0) + (packageDefinition.page_units || []).reduce((count, unit) => count + unit.managed_nodes_expected, 0);
  if (packageDefinition.acceptance?.linked_visible_specimens !== specimenCount) errors.push(`LINKED_SPECIMEN_CENSUS_MISMATCH:${specimenCount}`);
  if (packageDefinition.acceptance?.maximum_managed_nodes !== managedCount) errors.push(`MAXIMUM_MANAGED_NODE_CENSUS_MISMATCH:${managedCount}`);
  return errors;
}

async function runNativePackage({ penpot, storage, lease, packageDefinition }) {
  if (!penpot?.currentFile || typeof penpot.createPage !== 'function' || typeof penpot.createBoard !== 'function') throw new TypeError('NATIVE_PENPOT_CONTEXT_REQUIRED');
  if (!penpot.library?.local || typeof penpot.library.local.createComponent !== 'function') throw new TypeError('NATIVE_COMPONENT_LIBRARY_REQUIRED');
  if (!storage || typeof storage.set !== 'function' || typeof storage.get !== 'function') throw new TypeError('STORAGE_GET_SET_REQUIRED');
  assertActiveLease(lease, 'entry');
  const errors = validatePackage(packageDefinition);
  if (errors.length) throw new Error(`PACKAGE_VALIDATION_FAILED:${errors.join('|')}`);
  const protectedBefore = protectedProjection(penpot);
  let created = 0;
  for (const unit of packageDefinition.page_units) {
    let pageMatches = findPages(penpot, unit.unit_id);
    if (pageMatches.length > 1) throw new Error(`DUPLICATE_PAGE:${unit.unit_id}`);
    let page = pageMatches[0];
    if (!page) { page = createPage(penpot, lease, unit); created += 1; }
    assertActiveLease(lease, `before-open:${unit.unit_id}`);
    if (penpot.currentPage?.id !== page.id) await penpot.openPage(page);
    assertActiveLease(lease, `after-open:${unit.unit_id}`);
    let rootMatches = findRoots(page, unit.unit_id);
    if (rootMatches.length > 1) throw new Error(`DUPLICATE_ROOT:${unit.unit_id}`);
    let root = rootMatches[0];
    if (!root) { root = createRoot(penpot, lease, page, unit, packageDefinition.source_authority); created += 1; }
    let componentMatches = findFamilyComponents(penpot, unit.unit_id);
    if (componentMatches.length > 1) throw new Error(`DUPLICATE_COMPONENT:${unit.unit_id}`);
    let component = componentMatches[0];
    if (!component) { component = createComponent(penpot, lease, page, unit, packageDefinition.source_authority); created += 1; }
    for (const specimen of unit.specimens) {
      const specimenMatches = walk(root).filter((shape) => shared(shape, 'stable-id') === `specimen:${specimen.specimen_id}`);
      if (specimenMatches.length > 1) throw new Error(`DUPLICATE_SPECIMEN:${specimen.specimen_id}`);
      if (!specimenMatches.length) { createSpecimen(penpot, lease, root, unit, specimen, component); created += 1; }
    }
  }
  const audit = readback(penpot, packageDefinition);
  const expectedSpecimens = packageDefinition.page_units.reduce((count, unit) => count + unit.specimens.length, 0);
  const expectedManaged = packageDefinition.page_units.length + packageDefinition.page_units.reduce((count, unit) => count + unit.managed_nodes_expected, 0);
  if (audit.pages.length !== packageDefinition.page_units.length || audit.roots.length !== packageDefinition.page_units.length || audit.components.length !== packageDefinition.page_units.length || audit.wrappers.length !== expectedSpecimens || audit.instances.length !== expectedSpecimens) throw new Error('NATIVE_CENSUS_MISMATCH');
  const actualManaged = audit.pages.length + audit.roots.length + audit.components.length + audit.wrappers.length;
  if (actualManaged !== expectedManaged || actualManaged !== packageDefinition.acceptance.maximum_managed_nodes) throw new Error(`MANAGED_NODE_CENSUS_MISMATCH:${actualManaged}:${expectedManaged}`);
  if (audit.duplicateKeys.length) throw new Error(`DUPLICATE_MANAGED_IDS:${audit.duplicateKeys.join(',')}`);
  if (audit.detached.length) throw new Error(`DETACHED_INSTANCES:${audit.detached.length}`);
  if (audit.screenshots.length) throw new Error(`SCREENSHOT_SHAPES:${audit.screenshots.length}`);
  if (audit.lineageErrors.length) throw new Error(`SOURCE_LINEAGE_DRIFT:${audit.lineageErrors.join(',')}`);
  const protectedAfter = protectedProjection(penpot);
  if (protectedAfter.canonical !== protectedBefore.canonical) throw new Error('PROTECTED_PROJECTION_CHANGED');
  const managedAfter = managedProjection(penpot);
  const priorManaged = await storage.get(`managed-projection:${PACKAGE_ID}:v2`);
  if (created === 0 && priorManaged && priorManaged.canonical !== managedAfter.canonical) throw new Error('MANAGED_REPLAY_PROJECTION_CHANGED');
  const validation = penpot.currentFile.validate?.() || [];
  if (validation.length) throw new Error(`PENPOT_VALIDATION_FAILED:${canonical(validation)}`);
  const receipt = {
    schema_version: 'kenigevents.u0-native-executor-receipt.v2', package_id: PACKAGE_ID,
    terminal_state: 'NATIVE_EXECUTOR_VERIFIED_ATLAS_EXTENSION_PENDING', created,
    pages: audit.pages.length, roots: audit.roots.length, component_masters: audit.components.length,
    linked_visible_specimens: audit.instances.length, duplicates: 0, detached: 0, screenshots: 0,
    source_lineage_errors: 0, validation, protected_projection_before: protectedBefore.sha256,
    protected_projection_after: protectedAfter.sha256, protected_projection_changed: false,
    managed_nodes: actualManaged, managed_projection_sha256: managedAfter.sha256,
    managed_replay_projection_changed: false,
    atlas_extension_request_preserved: true, atlas_page_order_assigned: false,
    penpot_execution_authorized: false, promotion_authorized: false,
  };
  await storage.set(`managed-projection:${PACKAGE_ID}:v2`, { canonical: managedAfter.canonical, sha256: managedAfter.sha256 });
  await storage.set(`receipt:${PACKAGE_ID}:v2`, receipt);
  assertActiveLease(lease, 'after-receipt');
  return receipt;
}

module.exports = {
  FAMILY_VISUALS, NAMESPACE, PACKAGE_ID, assertActiveLease, assertString, canonical,
  managedProjection, protectedProjection, readback, runNativePackage, sha256, shapeProjection, tag, validatePackage, walk,
};

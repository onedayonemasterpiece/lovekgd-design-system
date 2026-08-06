import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const EVENTS_SHA = 'c6a679dbbb3bbd65eb096becbd5976e7ccd67a26';
const REPOSITORY = 'onedayonemasterpiece/lovekgd-design-system';
const EVENTS_REPOSITORY = 'onedayonemasterpiece/events-bot-new';
const CATALOG_PATH = 'prototypes/penpot-review-plugin-002b/catalog/catalog.json';
const WAVE = (process.env.WAVE || 'A').toUpperCase();
if (!['A', 'B'].includes(WAVE)) throw new Error(`Unsupported WAVE=${WAVE}`);
const outIndex = process.argv.indexOf('--out');
const output = resolve(outIndex >= 0 ? process.argv[outIndex + 1] : CATALOG_PATH);

const sha256 = (value) => createHash('sha256').update(value, 'utf8').digest('hex');
const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const BOARD_W = 360;
const BOARD_H = 240;
const IMAGE_H = 300;
const SECTIONS = [
  ['10-brand', '10 — Brand assets'],
  ['20-icons', '20 — Icons and graphic assets'],
  ['30-components', '30 — Base component states'],
  ['40-announcements', '40 — Announcements patterns'],
  ['50-status', '50 — Status and notification states'],
  ['60-imagery', '60 — Product imagery'],
];

const expectedCounts = WAVE === 'A'
  ? { '10-brand': 3, '20-icons': 8, '30-components': 18, '40-announcements': 6, '50-status': 12, '60-imagery': 10 }
  : { '10-brand': 3, '20-icons': 7, '30-components': 18, '40-announcements': 7, '50-status': 13, '60-imagery': 9 };

const columns = WAVE === 'A' ? 6 : 5;
const gapX = WAVE === 'A' ? 44 : 52;
const gapY = WAVE === 'A' ? 52 : 60;
const sectionGap = WAVE === 'A' ? 150 : 170;

function computeSectionOffsets() {
  const offsets = {};
  let y = 0;
  for (const [section] of SECTIONS) {
    offsets[section] = y;
    const rows = Math.ceil(expectedCounts[section] / columns);
    const h = section === '60-imagery' ? IMAGE_H : BOARD_H;
    y += rows * (h + gapY) + sectionGap;
  }
  return offsets;
}

const sectionOffsets = computeSectionOffsets();
const sectionIndexes = new Map();

function slot(section, width = BOARD_W, height = BOARD_H) {
  const index = sectionIndexes.get(section) || 0;
  sectionIndexes.set(section, index + 1);
  return {
    x: (index % columns) * (width + gapX),
    y: sectionOffsets[section] + Math.floor(index / columns) * (height + gapY),
    width,
    height,
    fill: '#F3EFE6',
  };
}

function fixtureSvg(id, title, family, state, index) {
  const palette = ['#203B57', '#315745', '#8A5A00', '#5B3C87', '#9A2D2D', '#315B7A'];
  const changedIds = new Set([
    'load.fixture.button.default',
    'load.fixture.button.focus',
    'load.fixture.field.error',
    'load.fixture.navigation.mobile',
    'load.fixture.event-card.cancelled',
    'load.fixture.event-card.postponed',
    'load.fixture.notice.warning',
    'load.fixture.notice.critical',
    'load.fixture.status.cancelled',
    'load.fixture.status.moved-online',
  ]);
  const accent = WAVE === 'B' && changedIds.has(id) ? '#8B3030' : palette[index % palette.length];
  const body = [];

  if (family === 'button') {
    const labels = {
      default: 'Показать события', hover: 'Показать события', focus: 'Показать события',
      disabled: 'Недоступно', loading: 'Загрузка…', 'long-label': 'События на ближайшие выходные',
      danger: 'Удалить', ghost: 'Подробнее',
    };
    const width = state === 'long-label' ? 270 : 190;
    const fill = state === 'ghost' ? '#FFFDF8' : accent;
    const textFill = state === 'ghost' ? accent : '#FFFFFF';
    const stroke = state === 'focus' ? '#2E7DFF' : state === 'ghost' ? accent : 'none';
    body.push(`<rect x="55" y="120" width="${width}" height="52" rx="13" fill="${fill}" opacity="${state === 'disabled' ? '.48' : '1'}" stroke="${stroke}" stroke-width="${['focus','ghost'].includes(state) ? 3 : 0}"/>`);
    body.push(`<text x="${55 + width / 2}" y="153" text-anchor="middle" fill="${textFill}" font-family="Arial,sans-serif" font-size="14" font-weight="700">${esc(labels[state] || title)}</text>`);
  } else if (family === 'field') {
    const stroke = state === 'error' ? '#9A2D2D' : state === 'focus' ? '#2E7DFF' : '#CFC8BD';
    body.push('<text x="55" y="116" fill="#6E675F" font-family="Arial,sans-serif" font-size="12">Город</text>');
    body.push(`<rect x="55" y="126" width="250" height="50" rx="10" fill="${state === 'disabled' ? '#ECE8E0' : '#FFFFFF'}" stroke="${stroke}" stroke-width="${['focus','error'].includes(state) ? 3 : 1}"/>`);
    if (state !== 'empty') body.push('<text x="70" y="157" fill="#201D1A" font-family="Arial,sans-serif" font-size="14">Калининград</text>');
    if (state === 'error') body.push('<text x="55" y="195" fill="#9A2D2D" font-family="Arial,sans-serif" font-size="11">Выберите город из списка</text>');
  } else if (family === 'navigation') {
    body.push('<rect x="48" y="116" width="264" height="62" rx="14" fill="#F1ECE3" stroke="#D8D2C8"/>');
    ['Сегодня','Выходные','Подборки'].forEach((label, item) => {
      const active = state === 'current' && item === 1;
      if (active) body.push(`<rect x="${58 + item * 82}" y="126" width="74" height="42" rx="10" fill="${accent}"/>`);
      body.push(`<text x="${95 + item * 82}" y="152" text-anchor="middle" fill="${active ? '#FFFFFF' : '#201D1A'}" font-family="Arial,sans-serif" font-size="11" font-weight="700">${label}</text>`);
    });
    if (state === 'focus') body.push('<rect x="138" y="122" width="82" height="50" rx="12" fill="none" stroke="#2E7DFF" stroke-width="4"/>');
    if (state === 'mobile') body.push(`<rect x="278" y="124" width="22" height="22" rx="5" fill="${accent}"/>`);
  } else if (family === 'event-card') {
    body.push('<rect x="48" y="105" width="104" height="86" rx="12" fill="#D8E3E8"/>');
    body.push(`<text x="170" y="124" fill="${accent}" font-family="Arial,sans-serif" font-size="10" font-weight="700">${state.toUpperCase()}</text>`);
    body.push('<text x="170" y="147" fill="#201D1A" font-family="Arial,sans-serif" font-size="13" font-weight="700">Событие в Калининграде</text>');
    body.push('<text x="170" y="168" fill="#6E675F" font-family="Arial,sans-serif" font-size="10">18:00 · Дом культуры</text>');
  } else if (family === 'notice') {
    body.push(`<rect x="48" y="112" width="264" height="78" rx="12" fill="#F2E7C9" stroke="${accent}"/>`);
    body.push(`<circle cx="72" cy="137" r="10" fill="${accent}"/>`);
    body.push(`<text x="92" y="139" fill="#201D1A" font-family="Arial,sans-serif" font-size="12" font-weight="700">${esc(title)}</text>`);
    body.push('<text x="92" y="160" fill="#6E675F" font-family="Arial,sans-serif" font-size="10">Сообщение состояния для проверки.</text>');
  } else {
    body.push(`<rect x="54" y="122" width="252" height="50" rx="25" fill="${accent}"/>`);
    body.push(`<text x="180" y="153" text-anchor="middle" fill="#FFFFFF" font-family="Arial,sans-serif" font-size="13" font-weight="700">${esc(title)}</text>`);
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${BOARD_W}" height="${BOARD_H}" viewBox="0 0 ${BOARD_W} ${BOARD_H}">`,
    `<rect width="${BOARD_W}" height="${BOARD_H}" rx="22" fill="#F3EFE6"/>`,
    '<rect x="30" y="30" width="300" height="180" rx="16" fill="#FFFDF8" stroke="#D6D0C4"/>',
    `<text x="48" y="62" fill="#5D574F" font-family="Arial,sans-serif" font-size="9" font-weight="700" letter-spacing="1.1">LOAD FIXTURE · ${WAVE === 'B' ? 'WAVE B · ' : ''}NOT APPROVED DESIGN</text>`,
    `<text x="48" y="86" fill="#201D1A" font-family="Arial,sans-serif" font-size="15" font-weight="700">${esc(title)}</text>`,
    '<text x="48" y="102" fill="#6E675F" font-family="Arial,sans-serif" font-size="9">Exact Git transport fixture for load testing.</text>',
    ...body,
    `<text x="48" y="220" fill="#7C756D" font-family="Arial,sans-serif" font-size="8">ID: ${esc(id)}</text>`,
    '</svg>\n',
  ].join('\n');
}

function imageFrameSvg(id, title, width = BOARD_W, height = IMAGE_H) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="${width}" height="${height}" rx="22" fill="#F3EFE6"/>`,
    `<text x="30" y="34" fill="#5D574F" font-family="Arial,sans-serif" font-size="9" font-weight="700" letter-spacing="1.1">REAL PRODUCT ASSET · ${WAVE === 'B' ? 'WAVE B' : 'WAVE A'}</text>`,
    `<text x="30" y="57" fill="#201D1A" font-family="Arial,sans-serif" font-size="14" font-weight="700">${esc(title)}</text>`,
    '<rect x="30" y="76" width="300" height="178" rx="14" fill="none" stroke="#D6D0C4" stroke-width="2"/>',
    `<text x="30" y="278" fill="#7C756D" font-family="Arial,sans-serif" font-size="8">ID: ${esc(id)}</text>`,
    '</svg>\n',
  ].join('\n');
}

const elements = [];
let fixtureIndex = 0;

function addInline(id, title, section, family, state) {
  const svg = fixtureSvg(id, title, family, state, fixtureIndex++);
  const hash = sha256(svg);
  elements.push({
    id, name: title, kind: 'load-fixture', section, status: 'experimental',
    version: WAVE === 'A' ? 'load-a' : 'load-b', state,
    sourcePath: CATALOG_PATH,
    contentHash: `sha256:${hash}`,
    board: slot(section),
    artifact: { type: 'inline-svg', svg, sha256: hash },
  });
}

function addGitSvg(id, title, section, path, gitBlobSha) {
  elements.push({
    id, name: title, kind: 'repository-svg', section, status: 'source-asset',
    version: EVENTS_SHA.slice(0, 12), state: 'source',
    sourceRevision: EVENTS_SHA, sourcePath: path,
    sourceUrl: `https://github.com/${EVENTS_REPOSITORY}/blob/${EVENTS_SHA}/${path}`,
    contentHash: `gitblob:${gitBlobSha}`,
    board: slot(section),
    artifact: {
      type: 'git-svg',
      url: `https://raw.githack.com/${EVENTS_REPOSITORY}/${EVENTS_SHA}/${path}`,
      gitBlobSha,
    },
  });
}

function addGitImage(id, title, section, path, gitBlobSha, mimeType) {
  const frameSvg = imageFrameSvg(id, title);
  const frameSha256 = sha256(frameSvg);
  elements.push({
    id, name: title, kind: 'repository-image', section, status: 'source-asset',
    version: EVENTS_SHA.slice(0, 12), state: 'source',
    sourceRevision: EVENTS_SHA, sourcePath: path,
    sourceUrl: `https://github.com/${EVENTS_REPOSITORY}/blob/${EVENTS_SHA}/${path}`,
    contentHash: `gitblob:${gitBlobSha}:frame:${frameSha256}`,
    board: slot(section, BOARD_W, IMAGE_H),
    artifact: {
      type: 'git-image',
      url: `https://raw.githack.com/${EVENTS_REPOSITORY}/${EVENTS_SHA}/${path}`,
      gitBlobSha,
      mimeType,
      frameSvg,
      frameSha256,
      imageRect: { x: 30, y: 76, width: 300, height: 178 },
    },
  });
}

addGitSvg('brand.mark.primary', 'Brand mark', '10-brand', 'site/public/brand-mark.svg', '5833776a1f94cf7f02e9b95c1b98eb7fc29c4b23');
addGitSvg('brand.wordmark.announcements', 'Announcements wordmark', '10-brand', 'site/public/brand/announcements-wordmark-ui.svg', '7fa5023eefc8514dcf735516633e68eadb532c9b');
addGitSvg('brand.favicon.wide-o', 'Favicon wide O', '10-brand', 'site/public/brand/favicon-tag-wide-o.svg', 'd2b3d15fd027a75839c056fbf387c4bd2ba630f5');

addGitSvg('icon.lab-flask', 'Lab flask icon', '20-icons', 'site/public/assets/icons/lab-flask-287837.svg', 'edfa3ee2270f265499d74e198acd0acd88106703');
addGitSvg('icon.link.minimal', 'Link icon', '20-icons', 'site/public/assets/icons/link-minimalistic-svgrepo.svg', '4f5a7ef4ae1044fc1818d41ef3dcabfb043ff846');
addGitSvg('icon.arrow.long-right', 'Long arrow right', '20-icons', 'site/public/assets/icons/svgrepo-450220-long-arrow-right.svg', 'ab39dd54ea4024f379aec1f87cd1576393b99d60');
if (WAVE === 'A') addGitSvg('icon.transport.train', 'Train front icon', '20-icons', 'site/public/assets/icons/train-front-cc0.svg', '125b94ceaa5b06670b3ed4c9e998f42c43fe2409');
addGitSvg('festival.grozd.vector', 'Grozd festival vector', '20-icons', 'site/public/assets/festivals/grozd-festival.svg', '49190446475d1fc8f20a67a6a8bac72c46e436cb');
addGitSvg('festival.street-food.vector', 'Street food festival vector', '20-icons', 'site/public/assets/festivals/kaliningrad-street-food.svg', 'b3ff51fd9fdf18ec6d7a5bad1b7d4f32f2cfd6fa');
addGitSvg('festival.kaup.vector', 'Kaup festival vector', '20-icons', 'site/public/assets/festivals/kaup.svg', '00b90e91c2d4cb5b37c7a550969f53a722c2c3d9');
addGitSvg('festival.kgd80.vector', 'KGD80 stories vector', '20-icons', 'site/public/assets/festivals/kgd80-80-stories.svg', '0d39a21906b50808012103619dc7ac80b058ff50');

const buttons = WAVE === 'A'
  ? ['default','hover','focus','disabled','loading','long-label','danger']
  : ['default','hover','focus','disabled','ghost','long-label','danger'];
for (const state of buttons) addInline(`load.fixture.button.${state}`, `Button · ${state}`, '30-components', 'button', state);
for (const state of ['empty','filled','focus','error','disabled']) addInline(`load.fixture.field.${state}`, `Field · ${state}`, '30-components', 'field', state);
for (const state of ['default','current','focus','mobile']) addInline(`load.fixture.navigation.${state}`, `Navigation · ${state}`, '30-components', 'navigation', state);
for (const state of ['default','selected']) addInline(`load.fixture.tag.${state}`, `Tag · ${state}`, '30-components', 'tag', state);

for (const state of ['scheduled','cancelled','postponed','sold-out','moved-online','without-image']) {
  addInline(`load.fixture.event-card.${state}`, `Event card · ${state}`, '40-announcements', 'event-card', state);
}
if (WAVE === 'B') addInline('load.fixture.event-card.registration-closed', 'Event card · registration closed', '40-announcements', 'event-card', 'registration-closed');

for (const state of ['info','success','warning','critical','timed','persistent']) {
  addInline(`load.fixture.notice.${state}`, `Notice · ${state}`, '50-status', 'notice', state);
}
for (const state of ['scheduled','cancelled','postponed','sold-out','registration-closed','moved-online']) {
  addInline(`load.fixture.status.${state}`, `Status · ${state}`, '50-status', 'status', state);
}
if (WAVE === 'B') addInline('load.fixture.notice.review-required', 'Notice · review required', '50-status', 'notice', 'review-required');

if (WAVE === 'A') addGitImage('image.festival.bahosluzhenie', 'Festival · Bahosluzhenie', '60-imagery', 'site/public/assets/festivals/bahosluzhenie.png', '491133a79267e33fa24b86c2a773f4f93f18c785', 'image/png');
addGitImage('image.card.goblin-battle', 'Card media · Goblin battle', '60-imagery', 'site/public/assets/card-media/goblin-battle-reviewed-5x4.webp', '4713506d7c42cd349ac04138743fe659a9bdc36e', 'image/webp');
addGitImage('image.fallback.concert', 'Fallback · Symphonic concert', '60-imagery', 'site/public/assets/event-fallbacks/concert-symphonic.webp', 'b66b18cb8e4a9083dcab052e32dd6b24e78d92c7', 'image/webp');
addGitImage('image.fallback.lecture', 'Fallback · Lecture and meeting', '60-imagery', 'site/public/assets/event-fallbacks/lecture-meeting.webp', '050483bb6c94a94651d9c6bfb70a829c6783acb0', 'image/webp');
addGitImage('image.listing.0804', 'Listing media · 0804', '60-imagery', 'site/public/assets/listing-media/0804043002d801c921a5311413089ddc27d0c7988fc30f0344830ea54cb1f4a7-512.webp', '07568b63394c615adecb30f61ae0d98041a284df', 'image/webp');
addGitImage('image.listing.6713', 'Listing media · 6713', '60-imagery', 'site/public/assets/listing-media/67139633d0b0f304736438629a31e307818390f81a5f003c3dec1e7c989e9839-512.webp', '9a5b1713e591ddffeb766d90776414d7d26b90ce', 'image/webp');
addGitImage('image.festival.grozd', 'Festival · Grozd', '60-imagery', 'site/public/assets/festivals/grozd-festival.png', 'ccb8c1234c67cf926af20f4046d331e660e98aa3', 'image/png');
addGitImage('image.festival.city-jazz', 'Festival · City Jazz', '60-imagery', 'site/public/assets/festivals/kaliningrad-city-jazz.png', '771d8ef9d67d8e5ed0b372eb6a348e6ddc908421', 'image/png');
addGitImage('image.festival.street-food', 'Festival · Street Food', '60-imagery', 'site/public/assets/festivals/kaliningrad-street-food.png', 'f049bc647ed2d5b0cd52dc87152b99d3cb32023c', 'image/png');
addGitImage('image.festival.kaup', 'Festival · Kaup', '60-imagery', 'site/public/assets/festivals/kaup.png', 'f5f9e40941b1c8854cdc85c52e323ab2006d8467', 'image/png');

for (const [section, expected] of Object.entries(expectedCounts)) {
  const actual = elements.filter((element) => element.section === section).length;
  if (actual !== expected) throw new Error(`${section}: expected ${expected}, got ${actual}`);
}
if (elements.length !== 57) throw new Error(`Expected 57 elements, got ${elements.length}`);

const catalog = {
  schemaVersion: 3,
  catalogId: 'lovekgd-design-system-current-mirror',
  catalogRevision: WAVE === 'A' ? '002b-load-a' : '002b-load-b',
  generatedAt: WAVE === 'A' ? '2026-08-06T20:30:00Z' : '2026-08-06T21:30:00Z',
  repository: REPOSITORY,
  mirror: {
    namespace: 'lovekgd.mirror.002b',
    origin: { x: 2500, y: 0 },
    reviewOrigin: { x: 7600, y: 0 },
    stagingOrigin: { x: -14000, y: -14000 },
    trashOrigin: { x: -24000, y: -14000 },
    reviewColumns: 3,
    reviewGap: 60,
  },
  sections: SECTIONS.map(([id, title]) => ({ id, title })),
  prompt: {
    noCommentsText: '— незакрытых комментариев к выбранной ревизии пока нет',
    template: '@GitHub {{repository}}\n\nДоработай элемент `{{elementId}}` по незакрытым комментариям Penpot.\n\nИсточник элемента в Git:\n{{sourceUrl}}\n\nРевизия источника: `{{sourceRevision}}`\nВерсия элемента: `{{elementVersion}}`\nСостояние: `{{state}}`\nCatalog SHA: `{{catalogSha}}`\nLane: `{{lane}}`\n\nКомментарии:\n{{comments}}\n\nСначала сверяйся с указанным Git-источником; не восстанавливай элемент по памяти и не придумывай отсутствующие данные. Подготовь изменение в дизайн-системе и новый проверяемый preview. Production не обновляй без sign-off владельца продукта.',
  },
  elements,
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ wave: WAVE, output, elements: elements.length, sections: expectedCounts }, null, 2));

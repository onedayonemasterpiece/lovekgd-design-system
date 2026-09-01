'use strict';

const TYPE_SCALE_RUNTIME = typeof require === 'function'
  ? require('./runtime.v2.js')
  : globalThis.KenigeventsTypographyAtlasR2NativeRuntime;
if (!TYPE_SCALE_RUNTIME) throw new Error('TYPOGRAPHY_ATLAS_R2_NATIVE_RUNTIME_MISSING');

const SOURCE_COMPONENTS = Object.freeze([
  'foundation.typography-scale',
  'foundation.typography-line-height',
  'foundation.typography-font-binding',
  'foundation.typography-cyrillic-wrap',
]);

const FAMILIES = Object.freeze([
  Object.freeze({ id: 'foundation.typography-scale', label: 'Typography scale' }),
  Object.freeze({ id: 'foundation.typography-line-height', label: 'Unitless line-height roles' }),
  Object.freeze({ id: 'foundation.typography-font-binding', label: 'Exact font and Cyrillic binding' }),
]);

const specimen = (id, componentId, state, text, fontSize, weight, lineHeight, frameWidth,
  visualWidth, visualHeight = 16, visualColor = '#0F766E', visualRadius = 8,
  visualOpacity = 1) => Object.freeze({
  id,
  componentId,
  state,
  text,
  fontSize,
  weight,
  lineHeight,
  frameWidth,
  textHeight: 120,
  visualWidth,
  visualHeight,
  visualColor,
  visualRadius,
  visualOpacity,
  sourceComponentId: id.startsWith('wrap/')
    ? 'foundation.typography-cyrillic-wrap'
    : componentId,
});

const SPECIMENS = Object.freeze([
  specimen('type/caption-12', 'foundation.typography-scale', 'caption-12',
    'Подпись · Балтийское море', '12', '400', '1.6', 688, 72),
  specimen('type/body-16', 'foundation.typography-scale', 'body-16',
    'Основной текст · Калининградская область', '16', '400', '1.6', 688, 96),
  specimen('type/meta-17', 'foundation.typography-scale', 'meta-17',
    '31 августа · понедельник · 18:30', '17', '400', '1.25', 688, 112),
  specimen('type/heading-24', 'foundation.typography-scale', 'heading-500-24',
    'Заголовок события в Калининграде', '24', '700', '1.08', 688, 144),
  specimen('type/heading-clamp-28-40', 'foundation.typography-scale', 'heading-600-28-40',
    'Выставка русского авангарда', '40', '700', '1.08', 688, 208),
  specimen('type/display-clamp-35.2-73.6', 'foundation.typography-scale', 'display-700-35.2-73.6',
    'Кёнигсберг', '73.6', '700', '1.08', 688, 320, 20),
  specimen('type/display-clamp-41.6-92.8', 'foundation.typography-scale', 'display-800-41.6-92.8',
    'Калининград', '92.8', '700', '1.08', 688, 400, 24),
  specimen('line-height/title', 'foundation.typography-line-height', 'title-1.08',
    'Кёнигсберг и Калининград\nгород, память и современность', '32', '700', '1.08', 420, 108),
  specimen('line-height/occurrence', 'foundation.typography-line-height', 'occurrence-1.25',
    '31 августа, понедельник\n18:30 · повтор 2 сентября', '17', '400', '1.25', 360, 125),
  specimen('line-height/place', 'foundation.typography-line-height', 'place-1.25',
    'Калининградский музей\nизобразительных искусств', '17', '400', '1.25', 340, 125),
  specimen('line-height/event_type', 'foundation.typography-line-height', 'event_type-1.2',
    'лекция · выставка\nфестиваль', '16', '700', '1.2', 300, 120),
  specimen('line-height/admission', 'foundation.typography-line-height', 'admission-1.15',
    'Бесплатно\nпо предварительной регистрации', '16', '700', '1.15', 340, 115),
  specimen('line-height/not_interested', 'foundation.typography-line-height', 'not_interested-1.6',
    'Не интересно\nСкрыть рекомендацию', '14', '400', '1.6', 320, 160),
  specimen('line-height/calendar_share', 'foundation.typography-line-height', 'calendar_share-1.6',
    'В календарь\nПоделиться', '14', '400', '1.6', 300, 160),
  specimen('line-height/like_count', 'foundation.typography-line-height', 'like_count-1.6',
    'Нравится 128 калининградцам', '14', '400', '1.6', 360, 160),
  specimen('font/semantic-inter-first', 'foundation.typography-font-binding', 'semantic-inter-first',
    'Семантический стек: Inter — первый', '16', '400', '1.6', 688, 188, 16, '#4B5563'),
  specimen('font/frozen-A-dejavu-regular', 'foundation.typography-font-binding', 'frozen-A-dejavu-regular',
    'DejaVu Sans 400 · точные байты · Кириллица', '24', '400', '1.25', 688, 256),
  specimen('font/frozen-A-dejavu-bold', 'foundation.typography-font-binding', 'frozen-A-dejavu-bold',
    'DejaVu Sans 700 · точные байты · Кёнигсберг', '24', '700', '1.25', 688, 300),
  specimen('wrap/title', 'foundation.typography-font-binding', 'title',
    'Кёнигсберг и Калининград: город, память и современность', '24', '700', '1.08', 220, 220),
  specimen('wrap/occurrence', 'foundation.typography-font-binding', 'occurrence',
    '31 августа, понедельник, 18:30 · повтор 2 сентября', '17', '400', '1.25', 190, 190),
  specimen('wrap/place', 'foundation.typography-font-binding', 'place',
    'Калининградский музей изобразительных искусств', '17', '400', '1.25', 175, 175),
  specimen('wrap/event-type', 'foundation.typography-font-binding', 'event_type',
    'лекция · выставка · фестиваль', '16', '700', '1.2', 150, 150),
  specimen('wrap/admission', 'foundation.typography-font-binding', 'admission',
    'Бесплатно · необходима предварительная регистрация', '16', '700', '1.15', 185, 185),
  specimen('wrap/actions', 'foundation.typography-font-binding', 'calendar_share',
    'Не интересно · В календарь · Поделиться', '14', '400', '1.6', 210, 210),
]);

const SPEC = Object.freeze({
  schema: 'kenigevents.f0-typography-type-scale-small-page-atlas-r2-native.v1',
  packageId: 'F-TYPOGRAPHY-TYPE-SCALE-SMALL-PAGE',
  namespace: 'kenigevents-f0-typography-type-scale-r2',
  pageName: '04.1 · Foundations · Typography scale · Candidate',
  rootName: 'CANDIDATE_BUILD_NOT_ACCEPTED · F-TYPOGRAPHY-TYPE-SCALE-SMALL-PAGE · Atlas R2',
  templateId: 'FOUNDATION_ASSET_GRID_WIDE_V2',
  atlasHead: '663be702d481972cb2e8863af500f1c35dda1d8c',
  atlasTree: 'cf9a1e6a5e0a84aea5636334dbd3be4961039b75',
  sourceHead: 'eb388db611fb997283ba63c452b6642ff3508678',
  sourceBlob: '501c307799bf412bc658dc89a04245f8a5cabc61',
  atlasHardLimitComponentFamilies: 3,
  allowedSourceComponentIds: SOURCE_COMPONENTS,
  families: FAMILIES,
  specimens: SPECIMENS,
  doesNotRepairEventcardText: true,
});

async function runTypeScaleSmallPageAtlasR2Native(context) {
  return TYPE_SCALE_RUNTIME.runTypographyAtlasR2Native(context, SPEC);
}

const TYPE_SCALE_EXECUTOR = Object.freeze({ SPEC, runTypeScaleSmallPageAtlasR2Native });
globalThis.KenigeventsTypeScaleSmallPageAtlasR2Native = TYPE_SCALE_EXECUTOR;
if (typeof module !== 'undefined' && module.exports) module.exports = TYPE_SCALE_EXECUTOR;

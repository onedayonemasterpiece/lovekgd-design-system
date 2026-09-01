'use strict';

const LAYOUT_RULES_RUNTIME = typeof require === 'function'
  ? require('./typography_atlas_r2_native_runtime.js')
  : globalThis.KenigeventsTypographyAtlasR2NativeRuntime;
if (!LAYOUT_RULES_RUNTIME) throw new Error('TYPOGRAPHY_ATLAS_R2_NATIVE_RUNTIME_MISSING');

const SOURCE_COMPONENTS = Object.freeze([
  'foundation.layout-containers',
  'foundation.layout-breakpoints',
  'foundation.layout-sticky-stack',
  'foundation.layout-layering',
  'foundation.layout-safe-area',
  'foundation.layout-media-sizing',
]);

const FAMILIES = Object.freeze([
  Object.freeze({ id: 'foundation.layout-containers', label: 'Content containers' }),
  Object.freeze({ id: 'foundation.layout-breakpoints', label: 'Responsive breakpoints' }),
  Object.freeze({ id: 'foundation.layout-sticky-stack', label: 'Sticky stack' }),
  Object.freeze({ id: 'foundation.layout-layering', label: 'Layering bands' }),
  Object.freeze({ id: 'foundation.layout-safe-area', label: 'Safe area' }),
  Object.freeze({ id: 'foundation.layout-media-sizing', label: 'Listing media sizing' }),
]);

const specimen = (id, componentId, state, text, visualWidth, visualHeight = 16,
  visualColor = '#0F766E', visualRadius = 8, visualOpacity = 1) => Object.freeze({
  id,
  componentId,
  state,
  text,
  fontSize: '16',
  weight: '400',
  lineHeight: '1.6',
  frameWidth: 688,
  textHeight: 120,
  visualWidth,
  visualHeight,
  visualColor,
  visualRadius,
  visualOpacity,
});

const SPECIMENS = Object.freeze([
  specimen('container/1180px', 'foundation.layout-containers', '1180px',
    'Контентный контейнер · максимум 1180 px', 341, 32),
  specimen('container/1440px', 'foundation.layout-containers', '1440px',
    'Широкий контейнер · максимум 1440 px', 416, 32),
  specimen('breakpoint/max-479', 'foundation.layout-breakpoints', 'max-479',
    'Мобильный XS · максимум 479 px', 114),
  specimen('breakpoint/max-600', 'foundation.layout-breakpoints', 'max-600',
    'Мобильный SM · максимум 600 px', 143),
  specimen('breakpoint/max-759', 'foundation.layout-breakpoints', 'max-759',
    'Мобильный · максимум 759 px', 181),
  specimen('breakpoint/max-899', 'foundation.layout-breakpoints', 'max-899',
    'Планшет · максимум 899 px', 215),
  specimen('breakpoint/min-760', 'foundation.layout-breakpoints', 'min-760',
    'Десктоп · минимум 760 px', 181, 16, '#2563EB'),
  specimen('breakpoint/min-900', 'foundation.layout-breakpoints', 'min-900',
    'Десктоп MD · минимум 900 px', 215, 16, '#2563EB'),
  specimen('breakpoint/min-1100', 'foundation.layout-breakpoints', 'min-1100',
    'Десктоп LG · минимум 1100 px', 263, 16, '#2563EB'),
  specimen('breakpoint/min-1400', 'foundation.layout-breakpoints', 'min-1400',
    'Десктоп XL · минимум 1400 px', 334, 16, '#2563EB'),
  specimen('sticky/header-57', 'foundation.layout-sticky-stack', 'header-57',
    'Шапка · высота 57 px', 416, 57, '#7C3AED', 4),
  specimen('sticky/header-tag-88', 'foundation.layout-sticky-stack', 'header-tag-88',
    'Шапка с тегом · высота 88 px', 416, 66, '#7C3AED', 4),
  specimen('sticky/time-nav-56', 'foundation.layout-sticky-stack', 'time-nav-56',
    'Навигация по времени · высота 56 px', 416, 56, '#7C3AED', 4),
  specimen('sticky/mobile-bottom-stack', 'foundation.layout-sticky-stack', 'mobile-bottom-stack',
    'Мобильный нижний стек · var(--mobile-bottom-stack-h)', 416, 64, '#7C3AED', 4),
  specimen('layer/base-0', 'foundation.layout-layering', 'base-0',
    'Базовый слой · z-index 0', 104, 20, '#94A3B8', 4, 0.55),
  specimen('layer/content-10', 'foundation.layout-layering', 'content-10',
    'Контент · z-index 10', 136, 24, '#64748B', 4, 0.65),
  specimen('layer/cards-20', 'foundation.layout-layering', 'cards-20',
    'Карточки · z-index 20', 168, 28, '#475569', 4, 0.75),
  specimen('layer/floating-30', 'foundation.layout-layering', 'floating-30',
    'Плавающие элементы · z-index 30', 200, 32, '#334155', 4, 0.82),
  specimen('layer/navigation-40', 'foundation.layout-layering', 'navigation-40',
    'Навигация · z-index 40', 232, 36, '#0F766E', 4, 0.88),
  specimen('layer/overlays-50', 'foundation.layout-layering', 'overlays-50',
    'Оверлеи · z-index 50', 264, 40, '#0D9488', 4, 0.92),
  specimen('layer/header-60', 'foundation.layout-layering', 'header-60',
    'Шапка · z-index 60', 296, 44, '#0891B2', 4, 0.96),
  specimen('layer/modal-focus-80', 'foundation.layout-layering', 'modal-focus-80',
    'Модальный фокус · z-index 80', 352, 52, '#2563EB', 4),
  specimen('safe-area/bottom', 'foundation.layout-safe-area', 'env-safe-area-inset-bottom',
    'Безопасная нижняя зона · env(safe-area-inset-bottom)', 416, 28, '#F59E0B', 0),
  specimen('media/clamp-formula', 'foundation.layout-media-sizing', 'clamp-formula',
    'Медиа списка · clamp(221px, min(13vw, 24svh), 244px)', 416, 60, '#DB2777', 8),
  specimen('media/min-221', 'foundation.layout-media-sizing', 'min-221',
    'Минимальная высота медиа · 221 px', 377, 55, '#DB2777', 8),
  specimen('media/intermediate-13vw-24svh', 'foundation.layout-media-sizing', 'intermediate-13vw-24svh',
    'Промежуточная высота · min(13vw, 24svh)', 397, 61, '#DB2777', 8),
  specimen('media/max-244', 'foundation.layout-media-sizing', 'max-244',
    'Максимальная высота медиа · 244 px', 416, 66, '#DB2777', 8),
]);

const SPEC = Object.freeze({
  schema: 'kenigevents.f0-typography-layout-rules-small-page-atlas-r2-native.v1',
  packageId: 'F-TYPOGRAPHY-LAYOUT-RULES-SMALL-PAGE',
  namespace: 'kenigevents-f0-typography-layout-rules-r2',
  pageName: '04.2 · Foundations · Layout rules · Candidate',
  rootName: 'CANDIDATE_BUILD_NOT_ACCEPTED · F-TYPOGRAPHY-LAYOUT-RULES-SMALL-PAGE · Atlas R2',
  templateId: 'FOUNDATION_ASSET_GRID_WIDE_V2',
  atlasHead: '663be702d481972cb2e8863af500f1c35dda1d8c',
  atlasTree: 'cf9a1e6a5e0a84aea5636334dbd3be4961039b75',
  sourceHead: 'eb388db611fb997283ba63c452b6642ff3508678',
  sourceBlob: '501c307799bf412bc658dc89a04245f8a5cabc61',
  atlasHardLimitComponentFamilies: 7,
  allowedSourceComponentIds: SOURCE_COMPONENTS,
  families: FAMILIES,
  specimens: SPECIMENS,
  doesNotRepairEventcardText: true,
});

async function runLayoutRulesSmallPageAtlasR2Native(context) {
  return LAYOUT_RULES_RUNTIME.runTypographyAtlasR2Native(context, SPEC);
}

const LAYOUT_RULES_EXECUTOR = Object.freeze({ SPEC, runLayoutRulesSmallPageAtlasR2Native });
globalThis.KenigeventsLayoutRulesSmallPageAtlasR2Native = LAYOUT_RULES_EXECUTOR;
if (typeof module !== 'undefined' && module.exports) module.exports = LAYOUT_RULES_EXECUTOR;

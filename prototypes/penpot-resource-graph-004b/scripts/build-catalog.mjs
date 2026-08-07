#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (!value.startsWith('--')) continue;
    result[value.slice(2)] = argv[i + 1];
    i += 1;
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));
const productDir = resolve(args['product-dir'] || '.source/events-bot-new');
const productSha = String(args['product-sha'] || '').trim();
const outPath = resolve(args.out || 'prototypes/penpot-resource-graph-004b/catalog/catalog.json');

if (!/^[0-9a-f]{40}$/u.test(productSha)) {
  throw new Error(`invalid_product_sha:${productSha}`);
}

const contractPath = join(productDir, 'site/src/data/design-system-production-surface-contract.v1.json');
if (!existsSync(contractPath)) throw new Error(`surface_contract_missing:${contractPath}`);
const surfaceContract = JSON.parse(readFileSync(contractPath, 'utf8'));

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', '.git', 'dist', '.astro'].includes(name)) continue;
      walk(full, acc);
    } else {
      acc.push(full);
    }
  }
  return acc;
}

const sourceFiles = walk(join(productDir, 'site/src'))
  .filter((file) => /\.(?:astro|ts|js|mjs|css|json)$/u.test(file));
const sourceText = new Map(
  sourceFiles.map((file) => [
    relative(productDir, file).split(sep).join('/'),
    readFileSync(file, 'utf8'),
  ]),
);

function directConsumers(sourcePath) {
  const base = sourcePath.split('/').pop().replace(/\.(?:astro|ts|js|mjs|css|json)$/u, '');
  const stem = sourcePath.replace(/\.(?:astro|ts|js|mjs|css|json)$/u, '');
  const matches = [];
  for (const [candidate, content] of sourceText.entries()) {
    if (candidate === sourcePath) continue;
    if (
      content.includes(sourcePath)
      || content.includes(stem)
      || new RegExp(`(?:from\\s+|import\\s*\\()[\\s\\S]{0,120}${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'u').test(content)
    ) {
      matches.push(candidate);
    }
  }
  return matches.sort();
}

function existingSources(paths) {
  return paths.map((file) => ({
    file,
    exists: existsSync(join(productDir, file)),
    consumers: existsSync(join(productDir, file)) ? directConsumers(file) : [],
  }));
}

const PAGES = [
  '00 — System map',
  '10 — Brand assets',
  '20 — Foundations',
  '25 — Iconography',
  '30 — Core UI resources',
  '40 — Product component masters',
  '50 — Product patterns',
  '60 — Page archetypes',
  '70 — Coverage and fragmentation',
  '75 — Design gaps',
  '80 — Candidate review',
  '89 — Review archive',
  '90 — Evidence / desktop',
  '91 — Evidence / tablet',
  '92 — Evidence / mobile',
  '93 — Evidence / interaction and accessibility',
  '99 — Technical tests',
];

const components = [
  {
    id: 'shell.header.desktop',
    family: 'Shell',
    name: 'Header · desktop',
    kind: 'header',
    viewport: 'desktop',
    width: 1180,
    height: 104,
    sourceFiles: ['site/src/layouts/EventLayout.astro', 'site/src/components/HomeQuickNav.astro'],
    variants: { viewport: 'desktop' },
  },
  {
    id: 'shell.header.mobile',
    family: 'Shell',
    name: 'Header · mobile',
    kind: 'header',
    viewport: 'mobile',
    width: 390,
    height: 84,
    sourceFiles: ['site/src/layouts/EventLayout.astro', 'site/src/components/Reference4MobileMenu.astro'],
    variants: { viewport: 'mobile' },
  },
  {
    id: 'shell.mobile-menu',
    family: 'Shell',
    name: 'Mobile menu',
    kind: 'mobile-menu',
    viewport: 'mobile',
    width: 390,
    height: 620,
    sourceFiles: ['site/src/components/Reference4MobileMenu.astro'],
    variants: { state: 'open' },
  },
  {
    id: 'shell.mobile-bottom-nav',
    family: 'Shell',
    name: 'Mobile bottom navigation',
    kind: 'bottom-nav',
    viewport: 'mobile',
    width: 390,
    height: 78,
    sourceFiles: ['site/src/components/MobileBottomNav.astro'],
    variants: { active: 'today' },
  },
  {
    id: 'shell.search-bottom-nav',
    family: 'Shell',
    name: 'Mobile search bottom navigation',
    kind: 'bottom-nav-search',
    viewport: 'mobile',
    width: 390,
    height: 78,
    sourceFiles: ['site/src/components/MobileSearchBottomNav.astro'],
    variants: { active: 'search' },
  },
  {
    id: 'shell.footer',
    family: 'Shell',
    name: 'Footer',
    kind: 'footer',
    viewport: 'responsive',
    width: 1180,
    height: 310,
    sourceFiles: ['site/src/components/SiteFooter.astro'],
    variants: { surface: 'inverse' },
  },
  {
    id: 'navigation.keyboard',
    family: 'Navigation',
    name: 'Keyboard navigation',
    kind: 'keyboard-nav',
    viewport: 'desktop',
    width: 880,
    height: 170,
    sourceFiles: ['site/src/components/KeyboardEventNavigation.astro'],
    variants: { state: 'discovery' },
  },
  {
    id: 'listing.page-header.desktop',
    family: 'Listings',
    name: 'Listing page header · desktop',
    kind: 'listing-header',
    viewport: 'desktop',
    width: 960,
    height: 190,
    sourceFiles: ['site/src/components/listings/ListingPageHeader.astro'],
    variants: { viewport: 'desktop' },
  },
  {
    id: 'listing.page-header.mobile',
    family: 'Listings',
    name: 'Listing page header · mobile',
    kind: 'listing-header',
    viewport: 'mobile',
    width: 390,
    height: 180,
    sourceFiles: ['site/src/components/listings/ListingPageHeader.astro'],
    variants: { viewport: 'mobile' },
  },
  {
    id: 'listing.time-nav.desktop',
    family: 'Listings',
    name: 'Listing time navigation · desktop',
    kind: 'time-nav',
    viewport: 'desktop',
    width: 900,
    height: 92,
    sourceFiles: ['site/src/components/listings/ListingTimeNav.astro', 'site/src/components/listings/ListingTimeMarker.astro'],
    variants: { viewport: 'desktop' },
  },
  {
    id: 'listing.time-nav.mobile',
    family: 'Listings',
    name: 'Listing time navigation · mobile',
    kind: 'time-nav',
    viewport: 'mobile',
    width: 390,
    height: 84,
    sourceFiles: ['site/src/components/listings/ListingTimeNav.astro', 'site/src/components/listings/ListingTimeMarker.astro'],
    variants: { viewport: 'mobile' },
  },
  {
    id: 'listing.row.desktop',
    family: 'Listings',
    name: 'Listing row · desktop',
    kind: 'listing-row',
    viewport: 'desktop',
    width: 900,
    height: 180,
    sourceFiles: ['site/src/components/EventListItem.astro', 'site/src/components/listings/ListingEventCard.astro'],
    variants: { viewport: 'desktop', density: 'regular' },
  },
  {
    id: 'listing.row.mobile',
    family: 'Listings',
    name: 'Listing row · mobile',
    kind: 'listing-row',
    viewport: 'mobile',
    width: 390,
    height: 166,
    sourceFiles: ['site/src/components/listings/MobileListingRailRow.astro', 'site/src/components/listings/ListingEventCard.astro'],
    variants: { viewport: 'mobile', density: 'compact' },
  },
  {
    id: 'event.card.small',
    family: 'Event presentation',
    name: 'Event card · small',
    kind: 'event-card',
    viewport: 'responsive',
    width: 250,
    height: 330,
    sourceFiles: ['site/src/components/EventCard.astro'],
    variants: { size: 'small', media: 'portrait' },
  },
  {
    id: 'event.card.large',
    family: 'Event presentation',
    name: 'Event card · large',
    kind: 'event-card',
    viewport: 'responsive',
    width: 390,
    height: 450,
    sourceFiles: ['site/src/components/EventCard.astro'],
    variants: { size: 'large', media: 'landscape' },
  },
  {
    id: 'event.rail.exact-time',
    family: 'Event presentation',
    name: 'Exact-time rail item',
    kind: 'rail-card',
    viewport: 'responsive',
    width: 260,
    height: 250,
    sourceFiles: ['site/src/components/listings/ExactTimeTimeline.astro', 'site/src/components/listings/ListingTimeMarker.astro'],
    variants: { rail: 'exact-time' },
  },
  {
    id: 'event.rail.discovery',
    family: 'Event presentation',
    name: 'Discovery rail card',
    kind: 'rail-card',
    viewport: 'responsive',
    width: 260,
    height: 250,
    sourceFiles: ['site/src/components/listings/ListingDiscoveryRail.astro'],
    variants: { rail: 'discovery' },
  },
  {
    id: 'event.hero.wide',
    family: 'Event detail',
    name: 'Event hero · wide image',
    kind: 'event-hero',
    viewport: 'desktop',
    width: 960,
    height: 620,
    sourceFiles: ['site/src/components/EventHero.astro', 'site/src/components/DesktopEventPage.astro'],
    variants: { media: 'wide', viewport: 'desktop' },
  },
  {
    id: 'event.hero.narrow',
    family: 'Event detail',
    name: 'Event hero · narrow image',
    kind: 'event-hero',
    viewport: 'desktop',
    width: 760,
    height: 700,
    sourceFiles: ['site/src/components/EventHero.astro', 'site/src/components/DesktopEventPage.astro'],
    variants: { media: 'narrow', viewport: 'desktop' },
  },
  {
    id: 'event.hero.no-image',
    family: 'Event detail',
    name: 'Event hero · no image',
    kind: 'event-hero',
    viewport: 'desktop',
    width: 760,
    height: 480,
    sourceFiles: ['site/src/components/EventHero.astro', 'site/src/components/DesktopEventPage.astro'],
    variants: { media: 'none', viewport: 'desktop' },
  },
  {
    id: 'event.hero.mobile',
    family: 'Event detail',
    name: 'Event hero · mobile',
    kind: 'event-hero',
    viewport: 'mobile',
    width: 390,
    height: 620,
    sourceFiles: ['site/src/components/EventHero.astro', 'site/src/components/MobileEventProductionStyles.astro'],
    variants: { media: 'responsive', viewport: 'mobile' },
  },
  {
    id: 'event.facts',
    family: 'Event detail',
    name: 'Event facts',
    kind: 'facts',
    viewport: 'responsive',
    width: 680,
    height: 280,
    sourceFiles: ['site/src/components/EventFacts.astro'],
    variants: { density: 'regular' },
  },
  {
    id: 'event.cta',
    family: 'Event detail',
    name: 'Event CTA panel',
    kind: 'cta',
    viewport: 'responsive',
    width: 520,
    height: 300,
    sourceFiles: ['site/src/components/EventCtaPanel.astro', 'site/src/components/DesktopEventActionPanel.astro'],
    variants: { registration: 'available' },
  },
  {
    id: 'event.media-rail',
    family: 'Event detail',
    name: 'Event media rail',
    kind: 'media-rail',
    viewport: 'responsive',
    width: 880,
    height: 260,
    sourceFiles: ['site/src/components/EventMediaRail.astro'],
    variants: { items: 'mixed' },
  },
  {
    id: 'event.medallions',
    family: 'Event detail',
    name: 'Event medallions',
    kind: 'medallions',
    viewport: 'responsive',
    width: 700,
    height: 220,
    sourceFiles: ['site/src/components/EventTokenMedallions.astro'],
    variants: { collection: 'current' },
  },
  {
    id: 'search.surface',
    family: 'Product surfaces',
    name: 'Search surface',
    kind: 'search',
    viewport: 'responsive',
    width: 760,
    height: 520,
    sourceFiles: ['site/src/components/AuthorizedEventSearch.astro', 'site/src/components/SearchCollectionLinks.astro'],
    variants: { state: 'results' },
  },
  {
    id: 'authorization.surface',
    family: 'Product surfaces',
    name: 'Authorization surface',
    kind: 'auth',
    viewport: 'responsive',
    width: 520,
    height: 430,
    sourceFiles: ['site/src/components/auth/StaticSiteAuthRuntime.astro'],
    variants: { state: 'anonymous' },
  },
  {
    id: 'favorites.surface',
    family: 'Product surfaces',
    name: 'Favorites surface',
    kind: 'favorites',
    viewport: 'responsive',
    width: 760,
    height: 500,
    sourceFiles: ['site/src/components/FavoritesSurface.astro'],
    variants: { state: 'populated' },
  },
  {
    id: 'personal.surface',
    family: 'Product surfaces',
    name: 'For me surface',
    kind: 'personal',
    viewport: 'responsive',
    width: 760,
    height: 560,
    sourceFiles: ['site/src/components/PersonalFeedSlot.astro', 'site/src/components/InterestProfile.astro', 'site/src/components/ListingPersonalFilter.astro'],
    variants: { state: 'personalized' },
  },
  {
    id: 'focus.nps',
    family: 'Focus group',
    name: 'Focus group · NPS',
    kind: 'focus-nps',
    viewport: 'responsive',
    width: 640,
    height: 360,
    sourceFiles: ['site/src/components/FocusGroupFeedback.astro'],
    variants: { step: 'nps' },
  },
  {
    id: 'focus.feedback',
    family: 'Focus group',
    name: 'Focus group · feedback',
    kind: 'focus-feedback',
    viewport: 'responsive',
    width: 640,
    height: 480,
    sourceFiles: ['site/src/components/FocusGroupFeedback.astro', 'site/src/components/FocusConnectivityDiagnostic.astro'],
    variants: { step: 'feedback' },
  },
  {
    id: 'focus.invite',
    family: 'Focus group',
    name: 'Focus group · invite',
    kind: 'focus-invite',
    viewport: 'responsive',
    width: 640,
    height: 400,
    sourceFiles: ['site/src/components/FocusGroupInviteIntake.astro', 'site/src/components/FocusGroupInviteShare.astro'],
    variants: { step: 'invite' },
  },
  {
    id: 'exhibitions.surface',
    family: 'Product surfaces',
    name: 'Exhibitions surface',
    kind: 'exhibitions',
    viewport: 'responsive',
    width: 820,
    height: 560,
    sourceFiles: ['site/src/components/ExhibitionsPersonalSurface.astro', 'site/src/components/ExhibitionPrototypeRow.astro'],
    variants: { state: 'listing' },
  },
  {
    id: 'artifacts.collection',
    family: 'Artifacts',
    name: 'Artifact collection',
    kind: 'artifacts',
    viewport: 'responsive',
    width: 820,
    height: 520,
    sourceFiles: ['site/src/components/FocusEggArtifact.astro', 'site/src/components/FocusEggCollectionCard.astro', 'site/src/components/FocusEggSavedListDemo.astro'],
    variants: { state: 'current-and-reserved' },
  },
  {
    id: 'transport.rail',
    family: 'Transport',
    name: 'Rail schedule',
    kind: 'transport',
    viewport: 'responsive',
    width: 760,
    height: 390,
    sourceFiles: ['site/src/components/EventTransportSchedule.astro', 'site/src/components/KaupTransportSchedule.astro'],
    variants: { mode: 'rail' },
  },
  {
    id: 'transport.bus',
    family: 'Transport',
    name: 'Bus schedule',
    kind: 'transport',
    viewport: 'responsive',
    width: 760,
    height: 390,
    sourceFiles: ['site/src/components/EventBusTransportSchedule.astro'],
    variants: { mode: 'bus' },
  },
  {
    id: 'notice.persistent',
    family: 'Feedback',
    name: 'Persistent notice',
    kind: 'notice',
    viewport: 'responsive',
    width: 660,
    height: 220,
    sourceFiles: ['site/src/components/design-system/StatePanel.astro'],
    variants: { lifecycle: 'persistent' },
  },
  {
    id: 'toast.timed',
    family: 'Feedback',
    name: 'Timed toast',
    kind: 'toast',
    viewport: 'responsive',
    width: 420,
    height: 120,
    sourceFiles: ['site/src/components/MobileToastRegion.astro'],
    variants: { lifecycle: 'timed' },
  },
];

const patterns = [
  {
    id: 'pattern.listing.desktop',
    name: 'Event listing · desktop',
    path: 'Patterns/Listings',
    components: ['shell.header.desktop', 'listing.page-header.desktop', 'listing.time-nav.desktop', 'listing.row.desktop', 'shell.footer'],
  },
  {
    id: 'pattern.listing.mobile',
    name: 'Event listing · mobile',
    path: 'Patterns/Listings',
    components: ['shell.header.mobile', 'listing.page-header.mobile', 'listing.time-nav.mobile', 'listing.row.mobile', 'shell.mobile-bottom-nav'],
  },
  {
    id: 'pattern.event-detail.wide',
    name: 'Event detail · wide image',
    path: 'Patterns/Event detail',
    components: ['shell.header.desktop', 'event.hero.wide', 'event.facts', 'event.cta', 'event.media-rail', 'event.medallions', 'shell.footer'],
  },
  {
    id: 'pattern.event-detail.narrow',
    name: 'Event detail · narrow image',
    path: 'Patterns/Event detail',
    components: ['shell.header.desktop', 'event.hero.narrow', 'event.facts', 'event.cta', 'event.media-rail', 'event.medallions', 'shell.footer'],
  },
  {
    id: 'pattern.event-detail.no-image',
    name: 'Event detail · no image',
    path: 'Patterns/Event detail',
    components: ['shell.header.desktop', 'event.hero.no-image', 'event.facts', 'event.cta', 'event.medallions', 'shell.footer'],
  },
  {
    id: 'pattern.search',
    name: 'Search and results',
    path: 'Patterns/Product surfaces',
    components: ['shell.header.desktop', 'search.surface', 'shell.footer'],
  },
  {
    id: 'pattern.focus-group',
    name: 'Focus-group feedback',
    path: 'Patterns/Product surfaces',
    components: ['focus.invite', 'focus.nps', 'focus.feedback'],
  },
  {
    id: 'pattern.artifacts',
    name: 'Artifact collection',
    path: 'Patterns/Product surfaces',
    components: ['artifacts.collection'],
  },
  {
    id: 'pattern.transport',
    name: 'Transport context',
    path: 'Patterns/Product surfaces',
    components: ['transport.rail', 'transport.bus'],
  },
  {
    id: 'pattern.personal',
    name: 'For me',
    path: 'Patterns/Product surfaces',
    components: ['personal.surface', 'event.card.small'],
  },
  {
    id: 'pattern.favorites',
    name: 'Favorites',
    path: 'Patterns/Product surfaces',
    components: ['favorites.surface', 'event.card.small'],
  },
];

const archetypeBase = surfaceContract.archetypes.map((item) => ({
  id: item.id,
  routes: item.routes,
  required: item.required,
  evidenceViewports: item.evidence_viewports,
  scenarios: item.required_scenarios || [],
}));

const archetypeComponentMap = {
  home: ['shell.header.desktop', 'event.card.large', 'event.rail.discovery', 'artifacts.collection', 'shell.footer'],
  'today-listing': ['pattern.listing.desktop'],
  'tomorrow-listing': ['pattern.listing.desktop'],
  'weekend-listing': ['pattern.listing.desktop'],
  'popular-listing': ['shell.header.desktop', 'listing.page-header.desktop', 'event.card.large', 'event.card.small', 'shell.footer'],
  collections: ['shell.header.desktop', 'event.card.large', 'event.card.small', 'shell.footer'],
  festivals: ['shell.header.desktop', 'listing.page-header.desktop', 'event.card.large', 'event.rail.discovery', 'shell.footer'],
  exhibitions: ['shell.header.desktop', 'exhibitions.surface', 'shell.footer'],
  favorites: ['pattern.favorites'],
  search: ['pattern.search'],
  'for-me': ['pattern.personal'],
  'focus-group': ['pattern.focus-group'],
  artifacts: ['pattern.artifacts'],
  'event-detail': ['pattern.event-detail.wide', 'pattern.event-detail.narrow', 'pattern.event-detail.no-image'],
  'interest-clubs': ['shell.header.desktop', 'listing.page-header.desktop', 'event.card.small', 'shell.footer'],
  'unusual-events': ['shell.header.desktop', 'listing.page-header.desktop', 'event.card.large', 'shell.footer'],
  'information-pages': ['shell.header.desktop', 'notice.persistent', 'shell.footer'],
};

const archetypes = archetypeBase.map((item) => ({
  ...item,
  components: archetypeComponentMap[item.id] || [],
  sourceStatus: item.routes.map((route) => {
    if (route.includes('*')) {
      const dynamic = [...sourceText.keys()].find((path) => path.startsWith('site/src/pages/sobytiya/') && /\[[^\]]+\]\.astro$/u.test(path));
      return { route, source: dynamic || null, exists: Boolean(dynamic) };
    }
    const normalized = route === '/' ? 'site/src/pages/index.astro' : `site/src/pages${route.replace(/\/$/u, '')}/index.astro`;
    return { route, source: normalized, exists: sourceText.has(normalized) };
  }),
}));

const fragmentationClusters = [
  {
    id: 'fragment.cards',
    title: 'Event card, listing row and rail cards',
    members: ['event.card.small', 'event.card.large', 'listing.row.desktop', 'listing.row.mobile', 'event.rail.exact-time', 'event.rail.discovery'],
    decision: 'Shared media, title, metadata and status primitives; keep distinct layout APIs for list, rail and discovery contexts.',
    status: 'needs-owner-review',
  },
  {
    id: 'fragment.mobile-navigation',
    title: 'Mobile bottom navigation, search navigation and mobile menu',
    members: ['shell.mobile-bottom-nav', 'shell.search-bottom-nav', 'shell.mobile-menu'],
    decision: 'Shared navigation item and active-state tokens; keep menu overlay separate from persistent bottom navigation.',
    status: 'candidate-ready',
  },
  {
    id: 'fragment.feedback',
    title: 'Persistent notices and timed toasts',
    members: ['notice.persistent', 'toast.timed'],
    decision: 'Share semantic tones and anatomy; lifecycle, dismissal and announcement semantics remain separate.',
    status: 'candidate-ready',
  },
  {
    id: 'fragment.transport',
    title: 'Rail and bus schedules',
    members: ['transport.rail', 'transport.bus'],
    decision: 'Extract shared schedule row and service state, retain mode-specific route metadata and iconography.',
    status: 'needs-options',
  },
  {
    id: 'fragment.event-hero',
    title: 'Wide, narrow and absent event media',
    members: ['event.hero.wide', 'event.hero.narrow', 'event.hero.no-image', 'event.hero.mobile'],
    decision: 'One EventHero family with explicit media geometry and viewport variants.',
    status: 'candidate-ready',
  },
  {
    id: 'fragment.focus-group',
    title: 'Focus-group invite, NPS and feedback',
    members: ['focus.invite', 'focus.nps', 'focus.feedback'],
    decision: 'One product flow composed of separate steps; do not merge the forms into one generic component.',
    status: 'candidate-ready',
  },
];

const designGaps = [
  {
    id: 'gap.accepted-production-release',
    title: 'Attach accepted production release identity',
    status: 'identified',
    requirement: 'Replace implementation-main source mode with exact static-release-manifest, build ID and snapshot evidence.',
  },
  {
    id: 'gap.actual-baseline-diff',
    title: 'Generate multi-resolution actual / baseline / diff evidence',
    status: 'needs-options',
    requirement: 'Populate pages 90–93 from automated tests at the accepted production SHA.',
  },
  {
    id: 'gap.editorial-contracts',
    title: 'Connect editorial contracts to component APIs',
    status: 'identified',
    requirement: 'Show title-length, date, venue, price, status, alt and credit rules beside the components that consume them.',
  },
  {
    id: 'gap.print-and-channel-extensions',
    title: 'Brand extensions for print, email and social',
    status: 'identified',
    requirement: 'Keep shared foundations while documenting channel-specific templates and constraints.',
  },
];

const enrichedComponents = components.map((component) => {
  const sources = existingSources(component.sourceFiles);
  const consumers = [...new Set(sources.flatMap((source) => source.consumers))].sort();
  return {
    ...component,
    sources,
    consumers,
    status: sources.every((source) => source.exists) ? 'implementation-linked' : 'source-gap',
    hash: createHash('sha256').update(JSON.stringify({
      id: component.id,
      kind: component.kind,
      variants: component.variants,
      sources: sources.map((source) => [source.file, source.exists]),
      consumers,
    })).digest('hex'),
  };
});

const componentIds = new Set(enrichedComponents.map((component) => component.id));
for (const pattern of patterns) {
  for (const id of pattern.components) {
    if (!componentIds.has(id)) throw new Error(`pattern_component_missing:${pattern.id}:${id}`);
  }
}
const patternIds = new Set(patterns.map((pattern) => pattern.id));
for (const archetype of archetypes) {
  for (const id of archetype.components) {
    if (!componentIds.has(id) && !patternIds.has(id)) {
      throw new Error(`archetype_reference_missing:${archetype.id}:${id}`);
    }
  }
}

const catalog = {
  schemaVersion: 1,
  delivery: 'penpot-resource-graph-004b',
  generatedAt: new Date().toISOString(),
  source: {
    repository: 'onedayonemasterpiece/events-bot-new',
    revision: productSha,
    mode: 'implementation-main-product-graph',
    productionFreshnessClaimed: false,
    contract: 'site/src/data/design-system-production-surface-contract.v1.json',
  },
  pages: PAGES,
  fontPolicy: {
    requestedFamily: 'Inter',
    fallbacks: ['Inter', 'Arial', 'Liberation Sans', 'sans-serif'],
    requireExplicitResolution: true,
    forbidSilentSerifFallback: true,
  },
  components: enrichedComponents,
  patterns: patterns.map((pattern) => ({
    ...pattern,
    hash: createHash('sha256').update(JSON.stringify(pattern)).digest('hex'),
  })),
  archetypes: archetypes.map((archetype) => ({
    ...archetype,
    hash: createHash('sha256').update(JSON.stringify(archetype)).digest('hex'),
  })),
  fragmentationClusters,
  designGaps,
  cleanupPolicy: {
    mode: 'automatic-safe-organize',
    legacyNamespace: 'lovekgd.runtime.003',
    moveCommentBoundBoards: true,
    deleteEmptyLegacyPages: true,
    archiveUnboundCommentPages: true,
    preserveCommentRegistryInFile: true,
    externalPersistence: 'not-configured',
  },
  counts: {
    components: enrichedComponents.length,
    sourceLinkedComponents: enrichedComponents.filter((item) => item.status === 'implementation-linked').length,
    patterns: patterns.length,
    archetypes: archetypes.length,
    archetypeBoards: archetypes.reduce((sum, item) => sum + item.evidenceViewports.length + (item.scenarios.length ? item.scenarios.length : 0), 0),
    fragmentationClusters: fragmentationClusters.length,
    designGaps: designGaps.length,
  },
};

const unsigned = JSON.stringify(catalog);
catalog.catalogSha256 = createHash('sha256').update(unsigned).digest('hex');
writeFileSync(outPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  ok: true,
  output: outPath,
  source: productSha,
  counts: catalog.counts,
  missingSources: enrichedComponents.filter((item) => item.status === 'source-gap').map((item) => item.id),
  missingRouteSources: archetypes.flatMap((item) => item.sourceStatus.filter((status) => !status.exists).map((status) => `${item.id}:${status.route}`)),
  catalogSha256: catalog.catalogSha256,
}, null, 2));

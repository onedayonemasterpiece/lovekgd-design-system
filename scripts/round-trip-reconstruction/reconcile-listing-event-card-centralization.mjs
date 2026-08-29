#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';

const BINDINGS = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const DATE_CONTRACT = 'catalog/page-archetypes/date-listing-shell-v1/component-contract.v1.json';
const WEEKEND_CONTRACT = 'catalog/page-archetypes/weekend-listing-v1/component-contract.v1.json';

const PATH = 'Event cards / Compact variants';
const LIBRARY_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const variants = [
  ['d87e18f1-dcb4-80a6-8008-87733a67d4bb', 'ListingEventCard · Compact · event.real.7807 · context=date-typical-desktop'],
  ['d87e18f1-dcb4-80a6-8008-8773575484aa', 'ListingEventCard · Compact · event.real.7906 · context=date-typical-desktop'],
  ['d87e18f1-dcb4-80a6-8008-877370383914', 'ListingEventCard · Compact · event.real.7888 · context=date-typical-desktop'],
  ['d87e18f1-dcb4-80a6-8008-87b75354f2ed', 'ListingEventCard · Compact · event.real.7807 · context=weekend-typical-desktop'],
  ['d87e18f1-dcb4-80a6-8008-87becba472c7', 'ListingEventCard · Compact · event.real.7906 · context=weekend-typical-desktop'],
].map(([id, name]) => ({ id, library_id: LIBRARY_ID, name, path: PATH, score: 4 }));
const ids = new Set(variants.map(({ id }) => id));
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);

const bindings = read(BINDINGS);
for (const archetype of bindings.archetypes) {
  if (!['archetype.listing.date', 'archetype.listing.weekend'].includes(archetype.archetype_id)) continue;
  for (const dependency of archetype.dependencies || []) {
    if (dependency.component_id !== 'listing.event-card.compact') {
      dependency.penpot_candidates = (dependency.penpot_candidates || []).filter((candidate) => !ids.has(candidate.id));
      continue;
    }
    const existing = new Map((dependency.penpot_candidates || []).map((candidate) => [candidate.id, candidate]));
    for (const variant of variants) existing.set(variant.id, variant);
    dependency.penpot_candidates = [...existing.values()];
  }
  archetype.listing_event_card_centralization = {
    status: 'CORRECTION_VERIFIED',
    astro_component: 'site/src/components/listings/ListingEventCard.astro',
    canonical_penpot_path: PATH,
    component_ids: variants.map(({ id }) => id),
    rule: 'Date and Weekend owners consume linked compact-card family variants; owner-local card assembly is forbidden.',
    penpot_revision: 2891,
  };
}
write(BINDINGS, bindings);

const date = read(DATE_CONTRACT);
const dateContext = date.body_components.find((component) => component.id === 'listing.event-card.compact.context.date-typical-desktop');
if (!dateContext) throw new Error('date compact context component missing');
dateContext.classification = 'central compact-card family variants resolved for the exact parent context';
dateContext.resource_path = PATH;
dateContext.parent_adoption_status = 'complete: the desktop flow consumes linked components owned by the centralized Event cards / Compact variants family; no owner-local card build remains';
write(DATE_CONTRACT, date);

const weekend = read(WEEKEND_CONTRACT);
weekend.centralized_compact_variants = {
  resource_path: PATH,
  component_ids: variants.slice(3).map(({ id }) => id),
  fixtures: ['event.real.7807', 'event.real.7906'],
  state: 'past',
  density: 'weekend',
  adoption: 'Weekend timeline and full-shell consumers remain linked to the same component IDs after central ownership correction.',
};
write(WEEKEND_CONTRACT, weekend);


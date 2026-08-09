# family.event-token-medallions — candidate decision dossier

**Status:** `candidate_not_accepted`
**Candidate decision:** `composition`
**Product value:** `pending_product_model`
**Promotion ready:** `false`

## Scope

- `src/components/EventTokenMedallions.astro`
- `src/lib/eventMedallions.ts`

## Recommendation

Preserve EventTokenMedallions as the event-detail identity/admission composition with inline and desktop-slot layouts. Keep listing, mobile-rail, exhibition and lab medallion-like resources separate until their own contracts prove equivalence.

## Contract diff

- Event-detail token composition is not equivalent to listing/exhibition/lab resources despite shared identity data.
- Geometry is consumer-and-slot-scoped, not one global medallion size.
- Resolver caps and filtering are current behavior, not final design tokens.

## Alternatives

- **merge** — `rejected_candidate`: Shared data does not prove shared semantic or visual component identity.
- **variant** — `rejected_candidate_for_cross_consumer_resources`: Would prematurely promote unrelated listing/exhibition/lab renderers as variants.
- **split** — `viable_future`: May later extract token primitives, but current AS-IS evidence supports the event-detail composition first.
- **composition** — `recommended_candidate`: Matches top/inline groups, roles, kinds and resolver behavior.
- **preserve** — `safe_interim`: Keep all related resources separate until accepted evidence exists.

## Intentional deltas

- No delta; preserve current consumer-specific geometry and fail-closed identity handling.

## Dependencies

- `organizerMedallions.json`
- `festivalMedallions.json`
- `eventMedallions.ts`
- `desktop Event Detail slot geometry`
- `Icon`

## Migration and compatibility

- future canonical event-detail medallion composition
- current EventTokenMedallions compatibility API
- related consumer resources explicitly out of migration scope

Compatibility: Preserve event/layout/allowTopSlot props and all resolver ordering/filter invariants.

Rollback: Restore current component import unchanged; no runtime mutation in synthesis.

## Test matrix

- zero/one/many/overflow
- inline main
- desktop top on/off
- secondary-only
- kind matrix and desktop pill filter
- overflow with free-admission retention
- conflicting source and ambiguous venue
- WebP fallback/no-fallback/vector primary
- 1023/1024 widths, 720/721 heights, 1279/1280 and 1439/1440 consumer bands
- accessible group labels, image alt and links

## Removal gate

- accepted family decision receipt
- all event-detail consumers migrated
- related resources either independently contracted or explicitly preserved
- legacy import count zero

## Promotion gate

- product-value binding no longer pending
- consumer geometry decision receipt
- identity conflict and overflow tests passed
- visual/accessibility review passed

## Owner-required decisions

- Which currently different consumer/slot geometries are intentional target values? — Runtime evidence proves the differences but cannot determine desired normalized geometry; external numeric scales were not adopted. (before `target_contract`)

This dossier authorizes no runtime change, merge, split, tokenization, winner selection, legacy removal or Penpot work.

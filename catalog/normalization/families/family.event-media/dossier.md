# family.event-media — candidate decision dossier

**Status:** `candidate_not_accepted`
**Candidate decision:** `composition`
**Product value:** `pending_product_model`
**Promotion ready:** `false`

## Scope

- `src/components/DesktopEventPage.astro`
- `src/components/EventMediaRail.astro`
- `src/components/EventFallbackArt.astro`

## Recommendation

Model Event Detail media as a composition of semantically different resources: primary large photo/fallback, large poster companion, and small remaining-photo previews. Preserve cover/contain/aspect-aware policies by consumer and media type.

## Contract diff

- The poster preview is a large companion resource; remaining photos are small preview resources.
- Media identity and consumer context determine fit and geometry; equal thumbnail treatment is invalid.
- Fallback is a media state, not a new component family.

## Alternatives

- **merge** — `rejected_candidate`: A homogeneous gallery/rail would erase poster-vs-photo semantics and validated scale differences.
- **variant** — `viable_but_not_recommended`: Variant naming alone does not express composition and consumer ownership.
- **split** — `viable_but_not_recommended`: Separate primitives may exist later, but current target should first preserve one media composition contract.
- **composition** — `recommended_candidate`: Directly represents primary, companion poster and small preview roles.
- **preserve** — `safe_interim`: Required until implementation is separately authorized.

## Intentional deltas

- No delta; explicitly preserve the large poster companion and small remaining-photo preview distinction.

## Dependencies

- `family.event-detail-presentation`
- `media policy matrix`
- `EventFallbackArt`

## Migration and compatibility

- future media composition boundary inside DesktopEventPage
- optional future primary/poster/preview subcomponents
- unchanged event-detail consumer API

Compatibility: Retain current image-set and presentation inputs; introduce no global ratio or fit token.

Rollback: Keep media rendering inside DesktopEventPage; analysis creates no runtime delta.

## Test matrix

- landscape primary photo
- portrait/square poster
- editorial large poster companion
- small remaining-photo previews
- split small photo rail
- missing/broken/tiny image fallbacks
- active preview semantics and alt text
- consumer-scoped responsive breakpoints and overflow

## Removal gate

- accepted composition receipt
- all media consumer roles bound
- no equal-size-preview regression
- old internal path consumer count zero

## Promotion gate

- product-value binding no longer pending
- consumer media policy accepted
- responsive selector findings reconciled
- visual/accessibility tests passed

## Owner-required decisions

- None; the candidate recommendation follows deterministic current evidence.

This dossier authorizes no runtime change, merge, split, tokenization, winner selection, legacy removal or Penpot work.

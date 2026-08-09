# family.event-detail-presentation — candidate decision dossier

**Status:** `candidate_not_accepted`
**Candidate decision:** `composition`
**Product value:** `pending_product_model`
**Promotion ready:** `false`

## Scope

- `src/components/DesktopEventPage.astro`
- `src/lib/desktopEventPresentation.ts`
- `src/pages/sobytiya/[slug].astro`

## Recommendation

Preserve one Event Detail presentation family whose resolver selects two structurally distinct compositions: editorial/landscape with stacked CTA placement and split/portrait-or-square-or-fallback with inline CTA placement. Do not flatten them into one visual template.

## Contract diff

- Editorial and split share event meaning but not layout anatomy or CTA placement.
- Landscape-photo, portrait/square poster and no-image fallback are resolver inputs, not cosmetic style variants.
- Consumer-local responsive and medallion geometry remains explicit until a later accepted target contract.

## Alternatives

- **merge** — `rejected_candidate`: Would erase verified media-orientation and CTA-layout contracts.
- **variant** — `viable_but_not_recommended`: A single variant component could conceal two different compositions and over-couple branch-local anatomy.
- **split** — `viable_but_not_recommended`: Independent public components would duplicate shared resolver and event-detail semantics.
- **composition** — `recommended_candidate`: Keeps semantic unity while preserving verified structural differences.
- **preserve** — `safe_interim`: Required until a later accepted decision receipt authorizes implementation.

## Intentional deltas

- No visual or behavioral delta in this synthesis; retain current two templates and CTA placements.

## Dependencies

- `candidate.button-cta-fragmented`
- `candidate.event-media`
- `candidate.event-token-medallions`
- `buildDesktopEventPresentation`

## Migration and compatibility

- future resolver contract
- future editorial composition
- future split composition
- compatibility facade retaining current DesktopEventPage props

Compatibility: Keep DesktopEventPage API and source resolver as a compatibility facade; migrate internals only after receipt.

Rollback: Repoint facade to unchanged AS-IS implementation; analysis creates no runtime delta.

## Test matrix

- editorial landscape + stacked CTA
- split portrait/square + inline CTA
- split low-resolution portrait viewer
- split no-image fallback
- 1023/1024/1025 desktop boundary
- 1199/1200/1201 scoped band
- 1439/1440/1441 wide band
- medallion top/inline contexts
- keyboard and landmark semantics per branch

## Removal gate

- accepted family decision receipt
- all event-detail consumers migrated
- legacy import count zero
- rollback wrapper retained through production verification

## Promotion gate

- 9 DesktopEventPage selector-resolution MISMATCH findings dispositioned and reconciled
- product-value binding no longer pending
- visual/accessibility/behavior matrix passed
- accepted contract receipt

## Owner-required decisions

- None; the candidate recommendation follows deterministic current evidence.

This dossier authorizes no runtime change, merge, split, tokenization, winner selection, legacy removal or Penpot work.

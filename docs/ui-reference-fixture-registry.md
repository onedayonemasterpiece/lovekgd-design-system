# UI reference fixtures and archetype scenarios

Status: `ACTIVE_SOT_AUTHORITY / EVENT_CORPUS_UNIFICATION_OPEN`

## Authority

**SoT UI owns fixture authority.** Penpot and Astro do not own independent
fixture registries.

Target model:

```text
one canonical SoT UI fixture registry
→ typed factual fixture records and payload/media hashes
→ named versioned scenarios/subsets
  ├─→ Astro executable projection
  └─→ Penpot linked-instance projection
```

A single registry authority does not require one undifferentiated list for every
entity type. Events, festivals, clubs and artifacts may use typed pools, and
scenarios may select different subsets. But all event fixtures used for
component, group and archetype parity must be registered under one authority or
carry an explicit supersession/foreign-key relationship to it.

## Current factual gap

The current repository has two event evidence contours:

1. the immutable Golden Event Corpus from component certification — 8 events;
2. `catalog/fixtures/design-system-reference/v1/registry.v1.json` — a later
   archetype selection registry containing 5 different events.

The current 5-event registry explicitly does not replace the immutable 8-event
component corpus. The two sets are disjoint and no source-bound record proves
that they are governed as one canonical event registry.

Therefore:

- exact parity inside either named bounded case may be valid;
- calling the current split a finished single Golden Corpus is invalid;
- cross-level component → group → archetype continuity remains unproven;
- status is `SOT_FIXTURE_AUTHORITY_UNIFICATION_OPEN`.

Required closure is one of:

- register both event sets as canonical records in one SoT registry, preserving
  exact payload/media hashes and provenance; or
- explicitly supersede one contour and migrate every scenario/receipt to the
  surviving authority.

The owner correction and full rationale are recorded in
[`reviews/owner-text-sot-ui-centrality-correction-20260829.md`](reviews/owner-text-sot-ui-centrality-correction-20260829.md).

## Current archetype selection registry

The current archetype selection registry is
[`catalog/fixtures/design-system-reference/v1/registry.v1.json`](../catalog/fixtures/design-system-reference/v1/registry.v1.json).
It names factual entities by stable fixture ID and binds registered events to the
hash of their complete frozen `PreviewEvent` payload and exact media bytes.

Astro owns product-data resolution, not fixture authority. Its
`site/src/data/design-system-reference-fixtures.json` is an executable ID-only
projection that must pin the registry and selected scenario hashes. Penpot owns
no fixture list: it receives linked instances for the exact scenario IDs and
records ancestry/readback in a receipt.

## Mandatory scenario contract

Every component, composed-group or archetype comparison must name a versioned
scenario. A valid scenario pins:

- SoT registry/corpus identity and hash;
- route/archetype and component/container identities;
- state, viewport, DPR, fonts, theme, locale and reference clock;
- ordered fixture identities and complete payload/media hashes;
- expected rendered order after the real Astro layout algorithm;
- exact Astro DOM/screenshot and Penpot linked-instance evidence.

Page-local fixture arrays are forbidden except explicitly labelled legacy
characterization. A scenario cannot make an unregistered fixture authoritative.

## Container taxonomy

`PackedCardRow` is not a universal component name.

| Semantic family | Astro owner | Card family | Purpose |
|---|---|---|---|
| EventCard equal-height grid | `OptimizedEventCardGrid.astro` + `packRelatedCardRows` | `EventCard` large | related, recommendation and collection rows |
| Desktop listing rows | `ExactTimeTimeline`, `PopularBehaviorRows`, `WeekendEditorialTimeline` | `ListingEventCard` | Date, Popular and Weekend desktop listings |
| Festival timeline rows | `packFestivalTimeline` | `FestivalCard` | festival-specific packing and statuses |
| Interest-club grid | current `.club-list` route container | `InterestClubCard` | complete club catalogue; container centralization remains debt |

Cards own content, actions and media semantics. Containers own packing, equal
height, columns, gaps and overflow. A fixture adapter cannot become another card
implementation.

## Current bounded archetype proof

`free-collection-5-desktop-v1` selects events
`7030, 7006, 6901, 6996, 6997`. The actual optimizer renders
`7006, 6996, 6997 / 7030, 6901` as `3 + 2` rows.

Astro, SoT UI and Penpot must agree on that rendered output. The current proof
receipt is
[`evidence/recovery-20260829/free-collection-5-desktop-three-way-proof.v1.json`](../evidence/recovery-20260829/free-collection-5-desktop-three-way-proof.v1.json).
It proves bounded fixture/order/geometry/component ancestry. Penpot export HTTP
504 prevents a visual-acceptance claim.

Review requires three owner projections:

1. `state=top` — actual 1280×1200 viewport;
2. `scroll=hero-passed` — actual scrolled viewport with both card rows;
3. `scroll-content=full` — full-page composition with linked footer.

This bounded proof does not close the 8-event versus 5-event authority gap.

Fixture mode remains local/preview-only. Production and secret-candidate builds
must reject it; production routes remain data-driven.

# UI reference fixtures and archetype scenarios

## Authority

The canonical selection registry is
[`catalog/fixtures/design-system-reference/v1/registry.v1.json`](../catalog/fixtures/design-system-reference/v1/registry.v1.json).
It names factual entities by stable fixture ID and binds each event to the hash
of its complete frozen `PreviewEvent` payload and exact media bytes. It does not
replace the immutable Golden Event Corpus used by component certification.

Astro owns product data resolution. Its
`site/src/data/design-system-reference-fixtures.json` file is an executable
ID-only generated projection of this contract, not a second editable event
database. It must pin the SHA-256 of both this registry and the selected
scenario; an unpinned or stale projection is not admissible evidence. Penpot
owns no fixture registry: it receives linked component instances for the exact
scenario fixture IDs and records their ancestry in a receipt.

## Mandatory route

Every archetype comparison must name one versioned scenario from
`catalog/fixtures/design-system-reference/v1/scenarios/`. A valid scenario pins:

- the locked global route/archetype identity;
- state, viewport, reference clock and ordered fixture identities;
- the expected rendered order after the real Astro layout algorithm;
- component family/representation and a separate container projection;
- exact Astro DOM/screenshot and Penpot linked-instance acceptance gates.

Page-local fixture ID arrays are forbidden. Characterization-only legacy arrays
must be labelled as such and migrated to a named scenario before they can be
used as cross-system evidence.

## Container taxonomy

`PackedCardRow` is not a universal component name. Current families are:

| Semantic family | Astro owner | Card family | Purpose |
|---|---|---|---|
| EventCard equal-height grid | `OptimizedEventCardGrid.astro` + `packRelatedCardRows` | `EventCard` large | similar events, recommendations and collection results |
| Desktop listing rows | `ExactTimeTimeline`, `PopularBehaviorRows`, `WeekendEditorialTimeline` | `ListingEventCard` | Date, Popular and Weekend desktop listings |
| Festival timeline rows | `packFestivalTimeline` | `FestivalCard` | festival-specific 1/4/2 and status-aware packing |
| Interest-club grid | current `.club-list` route container | `InterestClubCard` | complete club catalogue; container centralization remains explicit debt |

Cards own content, actions and media semantics. Containers own packing, equal
height, columns, gaps and overflow. A fixture adapter may bind exact content or
state to a linked card, but it cannot become another card implementation.

## First proof scenario

`free-collection-5-desktop-v1` uses five factual free events:
`7030, 7006, 6901, 6996, 6997`. The Astro input order is source order; the
actual optimizer renders `7006, 6996, 6997 / 7030, 6901` as rows `3 + 2`.
Astro, Git SoT and Penpot must agree on that rendered order rather than hiding
the layout algorithm behind a hand-arranged canvas.

The current bounded proof receipt is
[`evidence/recovery-20260829/free-collection-5-desktop-three-way-proof.v1.json`](../evidence/recovery-20260829/free-collection-5-desktop-three-way-proof.v1.json).
It proves fixture/order/geometry/component-ancestry parity. Penpot PNG/SVG export
currently returns HTTP 504, so the receipt deliberately does **not** claim
Penpot visual acceptance. A structural pass is not allowed to silently become a
visual pass.

Fixture mode is local/preview-only. Production and secret-candidate builds must
reject it. The production route remains data-driven.

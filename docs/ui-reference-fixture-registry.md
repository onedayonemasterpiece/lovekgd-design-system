# UI reference fixtures and archetype scenarios

## Authority

The current canonical selection registry is
[`catalog/fixtures/design-system-reference/v2/registry.v2.json`](../catalog/fixtures/design-system-reference/v2/registry.v2.json).
It names factual entities by stable fixture ID and binds each event to the hash
of its complete frozen `PreviewEvent` payload and exact media bytes. It does not
replace the immutable Golden Event Corpus used by component certification.
The old `design-system-reference/v1` registry and Golden Event Corpus v1 remain
historical byte-locked evidence; current September page work advances to v2
adjacently instead of silently rewriting either v1 source.

Astro owns product data resolution. Its
`site/src/data/design-system-reference-fixtures.json` file is an executable
ID-only generated projection of this contract, not a second editable event
database. It must pin the SHA-256 of both this registry and the selected
scenario; an unpinned or stale projection is not admissible evidence. Penpot
owns no fixture registry: it receives linked component instances for the exact
scenario fixture IDs and records their ancestry in a receipt.

## Mandatory route

Every archetype comparison must name one versioned scenario from
`catalog/fixtures/design-system-reference/v2/scenarios/`. A valid scenario pins:

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

`free-collection-september-desktop-v2` selects five factual-free fixtures from
Golden Event Corpus v2: `2182, 6711, 7609, 8006, 8200`. All five are active in
September 2026 and have exact verified media.

This is a diagnostic selection, not “the first five recent rows”:

- `2182` — crop-safe visual-only 3:2 landscape;
- `6711` — crop-safe visual-only 4:3 gallery;
- `7609` — square OCR poster and multi-image state;
- `8006` — 3:4 portrait OCR poster;
- `8200` — 6:7 programme/document poster.

The set therefore covers landscape, square and portrait ratios; OCR and
non-OCR; safe crop and protected document framing; single and multi-image
cards. The repeated green Chernyakhovsk programme poster is explicitly banned
by the corpus projection because it makes unrelated cards look duplicated and
provides almost no diagnostic value.

The actual Astro page has two semantic groups and that fact must remain visible
in Penpot:

1. timed events: `8006, 8200`, one full-width two-card row with shared 6:7 media
   height;
2. continuing exhibitions: `2182, 6711, 7609`, one full-width three-card row
   with shared 1:1 media height.

`OptimizedEventCardGrid` is cardinality-preserving for collection consumers.
It may split an otherwise unsafe row, but it may not silently drop an event;
each row owns its own dynamic column count and fills the available width.

This scenario is a page-level subset of the immutable Golden Event Corpus v2.
Component anatomy and appearance remain owned by the certified `EventCard ·
Large` family and Penpot optimized-grid component
`b0fe69fd-ccaf-8025-8008-847108143471`. The four Golden v2 structural contexts
are exposed together on Penpot page `40.1b — EventCard · Unified Golden
variants`, under `Event cards / Large / Unified Golden v2`: desktop/mobile ×
wide-with-calendar/packed-without-calendar. Every variant keeps a linked
canonical desktop or mobile `EventCard` base. A collection page must use linked
instances of these central masters; a nearby hand-built card or a page-local
adapter that redraws card anatomy is invalid.

Historical v1 selections (`7030, 7006, 6901, 6996, 6997` and the later
`7016, 6982, 7018, 6996, 5259` attempt) are superseded. They are not admissible
current parity evidence: the former mostly repackaged existing route data, and
the latter remained July/August data rather than the requested current
September diagnostic corpus.

A proof is accepted only after direct Astro and Penpot captures of the same
fixture payloads have been inspected at native scale. Geometry, component
ancestry, hashes and successful structural validation are necessary but cannot
substitute for visual comparison. Export failure is a blocker, not a pass.

The executable central component projection is
[`scripts/round-trip-reconstruction/penpot-materialize-event-card-unified-golden-v2.js`](../scripts/round-trip-reconstruction/penpot-materialize-event-card-unified-golden-v2.js).
The executable Penpot page projection for this scenario is
[`scripts/round-trip-reconstruction/penpot-materialize-free-collection-september-v2.js`](../scripts/round-trip-reconstruction/penpot-materialize-free-collection-september-v2.js).
It is resumable and instantiates the four central masters directly. The page
projection applies only fixture text, media and counters; it owns no EventCard
structure. Its `repairAll` path is intentionally limited to these
`NOT_REVIEWED` September-v2 candidates; it must not mutate an approved owner or
redraw card anatomy locally.

The current conformance receipt is
[`evidence/recovery-20260829/free-collection-september-v2-three-way-proof.v5.json`](../evidence/recovery-20260829/free-collection-september-v2-three-way-proof.v5.json).
It deliberately reduces the active review target to one exact desktop row with
fixtures `2182, 6711, 7609` on Penpot page `63.08b — Free collection · 3-card
bounded review`. The immutable 1082×623 Astro crop is placed on the left and
three linked instances of the central desktop-packed `EventCard` variant are
placed on the right. The live read-back receipt is
[`bounded-three-card-review-readback.v1.json`](../evidence/recovery-20260829/penpot/free-collection-september-v2/bounded-three-card-review-readback.v1.json).
It records linked ancestry through the central Golden v2 variant and canonical
base, native image payloads for every card, empty Penpot validation and the
named saved version.

This smaller target does **not** clear the visual gate. Exporting the 1082×623
three-card board returned HTTP 504, and exporting one isolated 347×622 linked
card on the same minimal page also returned HTTP 504. Therefore v5 records
`visual_conformance=BLOCKED`, `overlay=NOT_RUN` and `pixel_diff=NOT_RUN`; it
must not be cited as an Astro = Penpot visual pass. The single-card retry also
rules out the five-event/full-page size as a sufficient explanation for the
failure.

The preceding full-page drift-closure receipt is
[`evidence/recovery-20260829/free-collection-september-v2-three-way-proof.v4.json`](../evidence/recovery-20260829/free-collection-september-v2-three-way-proof.v4.json).
It records the live central-component ancestry, all ten collection slots, exact
fixture order, Astro inspection evidence, cleanup and the Penpot validation
result. The Astro capture now scrolls through the document, requires all five
lazy card images to have `naturalWidth > 0`, and awaits `decode()` before any
proof screenshot. Page `63.08` starts with exactly two review pairs: desktop
Penpot ↔ Astro, then mobile Penpot ↔ Astro; component masters begin below the
explicit service-zone label at `y=7930`. Product review remains `NOT_REVIEWED`.
Three bounded Penpot export attempts (full board, 340×604 component and raw
image-fill mode) returned HTTP 504, so v4 records the repeated exporter blocker
instead of promoting it to a pixel-diff pass.

Page `63.08 — Atlas · Collections` was then cleaned in place. The cleanup
receipt is
[`page-63.08-cleanup-receipt.v1.json`](../evidence/recovery-20260829/penpot/free-collection-september-v2/page-63.08-cleanup-receipt.v1.json):
26 superseded July/first-five/rejected free-collection roots were removed,
zero obsolete-name matches remain, and current owners, current resource
masters and still-reusable collection-index components are arranged in three
labelled canvas regions. Pre/post named Penpot versions make the destructive
operation reversible.

The collection proof must be reviewed through three explicit owner projections,
not by selecting the clipped Results child inside the 1200px top viewport:

1. `state=top` — real 1280×1200 viewport; later rows are intentionally below
   its clip boundary;
2. `scroll=hero-passed` — real 1280×1200 scrolled viewport with the compact
   58px medallion and both `2 + 3` card rows;
3. `scroll-content=full` — 1280×3338 full-page review composition with all five
   linked cards and the linked desktop footer.

The first receipt version gated only the Page-body component main. That was
insufficient owner evidence and is recorded as a correction in the current
receipt rather than being hidden.

Fixture mode is local/preview-only. Production and secret-candidate builds must
reject it. The production route remains data-driven.

# Event-card taxonomy candidate v1

**Authority:** reconstructed candidate (`canonical=false`, `promotion_status=not_promoted`)
**Contract:** `catalog/normalization/families/event-preview-representations/event-card-taxonomy-candidate-v1.json`
**Bindings:** `catalog/normalization/families/event-preview-representations/screenshot-consumer-bindings-v1.json`
**Framing:** `catalog/normalization/event-media/framing-v2.json`
**Iconography:** `catalog/normalization/iconography/event-card-icon-registry-candidate-v1.json`

> Bounded semantic supersession: `event.card.variant_axes.commercial` remains a
> historical reconstructed taxonomy axis. It is not the target Admission model.
> The owner-corrected content/state boundary is defined by
> [EventCard Large semantic content contract v1](event-card-large-semantic-content-contract-v1.md).

This package translates the exact review build
`production-secret-20260809T192529-2f0fa64e`
and rechecks its unchanged card sources at the current immutable normalization
baseline `events-bot-new@a68c7f23c4e014c6e9f66e95f394656e9cb0f411`.
It does not change Astro and does not claim runtime conformance to the new
candidate state keys.

## Proven boundaries

| Candidate identity | Why it remains distinct | Current owner |
|---|---|---|
| `event.card` | large/general card with split actions, dynamic renderers and hide/undo | `EventCard.astro` |
| `listing.event-card` | compact proof-oriented desktop card; proof counts are not actions | `ListingEventCard.astro` DS v9 |
| `listing.rail-row` | mobile track/swipe/underlay/commit interaction boundary | `MobileListingRailRow.astro` + surface runtime |
| `festival.card` | route-local overlay hierarchy and timeline status model | `pages/festivali/index.astro` |
| `exhibition.row` | deck/gallery/keyboard/lifecycle/hide interaction model | `ExhibitionPrototypeRow.astro` |

`event.list-item` is not materialized: the current evidence keeps it lab-only,
unresolved and Penpot-ineligible. `AmberRailArtifact` remains an optional nested
rail extension. Its current source/runtime states are absent, present/uncollected,
awake, collecting and collected; no expired/unavailable state is invented.

## Screenshot closure

The owner attachments contain eight screenshot assets and 23 distinct items.
The binding manifest records every `S01-I01 … S08-I08` exactly once:

- 4 `mapped-to-current-runtime`;
- 12 `current-runtime-variant`;
- 5 `legacy-but-still-supported`;
- 2 `obsolete` historical page-shell items;
- 0 omitted or unmapped items.

The historical `S08` masthead and fixed date strip are excluded from Page 46.
The mobile rail interaction remains current, but its old visual shell is labelled
legacy. Continuous scroll positions are real design states but have no stable
current DOM panel-index key; the candidate names them explicitly without claiming
that Astro already emits the new key.

## Runtime census

The package covers home, today redirect output, calendar date, tomorrow, weekend,
popular, festivals, exhibitions, search, favorites, personal feed, related cards,
mobile rails/shelves and the optional weekend artifact. Browser evidence used
Chromium at `1440×1200` and `390×844`. Authenticated populated search/favorites/
personal cards were not exercised; their `EventCard` renderer is source-proven
and the limitation remains explicit.

Dynamic full-card skeletons are allowed only for source-proven dynamic consumers
(search and favorites). Static listing cards and mobile rows do not receive an
invented skeleton. Personal feed currently exposes status modes, not a card
skeleton.

## Framing join and known AS-IS defects

All card media is a nested `event.media-frame` and hash-binds framing v2. The
candidate fails closed for unknown geometry, missing safe-crop evidence and
protected regions. It does not inherit runtime `contain` fields or unsafe cover
as a normative rule.

Retained defects/risk evidence includes low-resolution event `S03-I01`, large
festival cover fractions, venue truncation in `S06-I02`, the related-card crop
reason conflicts in `S07-I01`/`S07-I03`, and historical rail title wrapping in
`S08-I04`.

## Iconography join

Controls remain native children of their owning card, exactly as Astro renders
them. Their glyphs do not: every card glyph must be a linked instance of the
source-bound Page 25 icon component recorded by the icon registry. The registry
contains the eight `Icon.astro` glyphs reached by cards/medallion pills, the
exact rail continuation cue, the distinct Amber-found check, and all fourteen
festival-category CC0 assets. Same meaning is not permission to merge distinct
source geometry.

## Validation

```bash
python3 scripts/validate-event-media-framing-v2.py --root .
python3 scripts/validate-event-card-taxonomy-candidate-v1.py --root .
python3 scripts/validate-event-card-icon-registry-candidate-v1.py --root .
node tests/event-card-taxonomy-candidate-v1-negative.mjs
```

After native Penpot materialization and readback, run the taxonomy validator with
`--require-penpot`. Until then, null candidate binding IDs are deliberately
rejected only by that final gate.

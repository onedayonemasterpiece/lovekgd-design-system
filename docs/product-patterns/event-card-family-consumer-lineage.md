# Event-card family: corrective consumer lineage

Status: `PARTIAL_SOT / PENPOT_PAUSED`

`OV-08` and `OV-30` require inheritance, not a set of visually similar local
roots. The later IdeaHub owner audit makes this concrete on Home, Date, Weekend
and Popular pages. This record therefore supersedes the earlier *candidate*
choice to model `event.card`, `listing.event-card` and `listing.rail-row` as
unrelated Penpot component roots.

The correction is deliberately scoped to **Penpot ownership**. Astro may keep
separate implementation adapters because the large card, compact listing card
and swipeable mobile track have materially different runtime anatomy and
interaction. In Penpot they belong to one canonical `event-card-family`; every
representation and consumer must remain navigably linked to that owner.

## Source representations

1. `EventCard.astro` — general large preview, normally `split-actions`;
2. `ListingEventCard.astro@9` — compact desktop listing representation with
   `regular`, `weekend` and `popular` density;
3. `MobileListingRailRow.astro` — intrinsic horizontal track nested by
   `MobileListingRailSurface.astro`, not a clipped screenshot of a large card.

The three share event identity, schedule, place, media-framing, admission and
source-present proof/actions. Event content is an instance override, not a
variant axis. Layout, density, viewport interaction and source-present anatomy
are structural variants.

The exact Astro paths for `63.01` through `63.07` are locked in
[`consumer-lineage.v1.json`](../../catalog/ui-components/event-card-family/consumer-lineage.v1.json).
Search final results use the shared `KenigEventsRenderEventCard` renderer;
provisional vector verification cards are not accepted substitutes for the
final result state.

## Penpot resumption gate

No UUID is guessed while Penpot is closed. On resume, first run a page-scoped
read-only census, then select and record one exact family owner. Home, Date,
Weekend, Popular, Unusual, Search and Event Details must consume linked family
instances. Closure requires zero page-local alternative roots and zero detached
terminal copies in that bounded set, plus validation, readback and focused
exports. Visual similarity or a static screenshot is never lineage evidence.

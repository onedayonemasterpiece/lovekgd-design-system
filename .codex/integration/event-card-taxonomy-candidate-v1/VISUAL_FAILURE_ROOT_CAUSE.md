# Page 46 visual-fidelity failure — root-cause record

Status: **REJECTED / NOT REVIEWABLE**  
Observed: 2026-08-18  
Penpot file: `3be9e5e1-190f-8090-8008-713c0fbe6260`  
Rejected page: `66419e3c-4a3e-80f8-8008-80991f88c656`  
Containment revision: `169`

## Reproduction

Bounded exports of `listing.event-card`, `listing.rail-row`, `festival.card`,
`exhibition.row`, and `event.card` were compared with the owner screenshots
S01–S08. The page is visibly non-conformant: repeated media, serif-looking
typography, generic blocks, missing runtime controls, and incorrect anatomy.
The page name, root name, and visible banner now say `REJECTED · NOT
REVIEWABLE`; it must not be approved or implemented.

## Root cause

The materialization reversed the authority chain. It used the initial taxonomy
as if it were a visual specification and manually approximated the UI in
Penpot. The required chain is instead:

`events-bot-new@d2b7993… Astro/CSS/assets/fixtures` → `Git candidate visual
contract` → `native Penpot masters/instances` → `bounded export gate`, with
screenshots used only as a visual oracle.

Concrete Penpot readback proves the failure mechanism:

1. Every schematic family reused image `event-1587-3`, media id
   `81f57451-85cc-819d-8008-78b36cfe2f97`; `exhibition.row` reused it three
   times. There was no per-specimen asset binding.
2. Shapes were reduced to generic rectangles and text. For example the
   festival specimen contains only a media frame, veil, status text, title,
   and meta text; it omits the exact topline chips, category icon chip, favorite
   control, and source-derived spacing.
3. Text was created as `sourcesanspro`, while the exact source token is
   `--ke-font-sans: Inter, ui-sans-serif, system-ui, ...`. Typography was not
   bound to the exact source token or visually checked after export.
4. Geometry was invented (`360×390` listing, `720×260` rail,
   `300×300` festival, `1100×210` exhibition) rather than captured from the
   exact runtime selectors and CSS rules.
5. The old acceptance step checked only linked-instance/readback counts. It did
   not compare family exports against exact runtime/source-derived reference
   bounds and the S01–S08 oracle.

## Exact source evidence that must precede remediation

- `site/src/styles/design-system.css`: tokens and final `.ke-listing-card*`
  cascade, including media-height, natural/crop sizing, 4 px visual gap,
  60/51 px identity medallions, proof rail, and Inter/system sans.
- `site/src/components/listings/ListingEventCard.astro`: exact DOM, density,
  media selection, medallions, proof placement, title/place hierarchy.
- `site/src/components/listings/MobileListingRailRow.astro`: summary → media
  panels → digest → medallions → like/negative controls track.
- `site/src/components/EventCard.astro`: split-actions anatomy and media
  treatment.
- `site/src/pages/festivali/index.astro` plus `festival-timeline.json` and
  `festivalTimelineMedia`: exact route-local card anatomy and asset binding.
- `site/src/components/exhibitions/ExhibitionPrototypeRow.astro`: exact deck,
  gallery, status, controls, and keyboard states.

All paths are read at immutable source SHA
`d2b7993b41187660efa13d6d9070fda0c0d5a6cd`; `events-bot-new` remains
read-only.

## Failed gate and replacement gate

The prior `visually-inspected-pass` claims are withdrawn. A replacement is not
allowed to pass until each proven family has:

- an exact source/selector/token/fixture/media binding in Git;
- a native Penpot master with linked nested `event.media-frame` instance(s);
- a linked Page 46 specimen instance;
- a bounded PNG export;
- source/runtime reference versus export evidence for geometry, typography,
  media, hierarchy, controls, and state;
- no unexplained mismatch.


## Rematerialization outcome at revision 221

The rejected schematic page was not reused. A new lightweight candidate master
page (`45de0a42-f540-80b3-8008-80aa7bc00fa0`) and new review page
(`45de0a42-f540-80b3-8008-80ad04ad1a0e`) now contain exact-source-bound
masters for the five proven families. The readback found five linked family
instances, seven nested linked `event.media-frame` instances, exact original
media dimensions, and no detached instances or full-card screenshot fills.

`festival.card` passed a bounded reference/export comparison. The Penpot
exporter returned HTTP 504 for bounded PNG and SVG calls on the remaining
families. No artifact is claimed for those calls. Therefore the replacement
page stays explicitly `NOT READY`, even though file validation and stable-ID
idempotency pass. This preserves the gate above instead of reintroducing the
former count-only false positive.

## Final remediation at revision 234

The blocker was fully removed rather than hidden: the 44,290 px legacy Page40
was dependency-audited across 31 other pages and deleted. After deletion,
bounded exporter calls became reliable. Zero-bounds Penpot Text in
`event.card` and `exhibition.row` was replaced with native SVG text carrying
the exact Inter typography and copy; the exhibition gallery order was corrected
to identity → `95` → `a1` → stacked `7c`.

Page46 was rebuilt as five separate vertically stacked family sections. Each
section compares the same source-bound fixture in AS-IS and normalized columns,
with responsive, interaction, media, content, and framing evidence recorded in
that family. No different family is presented as a variant and no unproven
state is fabricated.

All five bounded family exports and the complete `1280×2680` Page46 export were
visually inspected and passed. Final readback: ten linked family instances,
fourteen nested linked media instances, zero detached instances, zero validation
errors, and an actual idempotency rerun with created count zero. Page46 is named
`46 — Event cards · Candidate fidelity v3 · REVIEW READY`.


## Owner-correction closure at revision 247

The revision-234 page was structurally grouped by family but still showed only
AS-IS and normalized linked instances; prose labels were incorrectly standing
in for the remaining proven states. That is now corrected literally: each
family section places every proven state beside the same source-bound fixture
as an actual linked family instance. The final counts are `festival.card` 6,
`listing.event-card` 5, `listing.rail-row` 7, `event.card` 6, and
`exhibition.row` 5 (29 linked family instances total; 39 nested linked
`event.media-frame` instances).

Five bounded family-section PNG exports and the full `1280×6400` page export
were visually inspected. The source-bound media, Inter hierarchy, chips,
actions, responsive relation, loading/error/hidden states, and rail reveal
states remain native Penpot shapes or linked component instances; no full-card
screenshot/raster is used. File validation returned `[]`; detached count,
stable-ID missing/duplicates, and idempotency-created count are all zero.
Page46 is `REVIEW READY · all proven states` at file revision 247.

# Event-card owner re-review 2 — comments 96–125

> Status: reconciled to Penpot rev1087; awaiting owner rereview.
> Authority: explicit owner review interpreted against pinned source; candidate,
> noncanonical and not promoted.
> Source: `events-bot-new@7d4b1d32710f60d65c7eb0dbd084d8cad058b5dc`.
> Machine contract:
> [`event-card-owner-review-2-candidate-v1.json`](../../catalog/normalization/families/event-preview-representations/event-card-owner-review-2-candidate-v1.json).

## Scope and root cause

Thirty unresolved threads, 96–125, were read back from Penpot revision 1037.
They are not thirty unrelated pixel defects. The repeated causes are:

1. consumer-specific action/proof geometry was collapsed into one generic
   Social Proof component;
2. fixed widths and manual positioning replaced source hug-content/flex rules;
3. source-current, contextual and invented states were mixed in one matrix;
4. review matrices repeated one fixture instead of demonstrating their axes;
5. source-skeleton evidence was wrapped as production component anatomy;
6. raw/doubled SVG patches survived beside native semantic components;
7. Medallion artwork was treated as a visual override instead of a structured
   identity binding.

The correction is therefore systemic and SoT-first. No Penpot write is allowed
until this decision is committed.

## EventCard Large

- `Not interested` is mandatory in both source layouts.
- Event type and Admission are conditional nodes. When absent, they reserve no
  empty row or gap; occurrence remains source-required.
- Admission is inline-flex/hug-content with a 28 px minimum height, exact
  padding and a 100% maximum width. Price strings are content overrides.
- Calendar has only `available`, persistent `added`, and eligibility-driven
  `absent` states. The successful label is `Добавлено`. Penpot `error` and
  `Повторить` states are invented and must be removed from the source-current
  set.
- EventCard loading is a media-only full-area shimmer. Text-like skeleton bars
  are not source-faithful. The authorized-search whole-card skeleton is a
  separate component/pattern.
- Default EventCard is dark. The light treatment exists only in the
  `#discovery-feed` context and is not a free CardVariant. Review must show the
  default dark card on a light page separately from the contextual light card.
- Split Share/Like controls have transparent rest surfaces and nested counts
  with no independent fixed-height box.
- The retained not-interested undo plate is a feedback state. Confirmation
  bottom-sheet and undo toast are surface components, not cosmetic card variants.

## Consumer-specific proof and action geometry

Semantic reuse does not require one geometry across every surface. The source
uses different layouts:

- Large Share/Like actions: 44 px minimum target, transparent split row;
- Listing rail proof: 17 px icon, at least 24 px row, muted tone;
- Listing inside proof: translucent light pill, at least 34×32 px;
- mobile rail small proof: its own compact consumer geometry;
- Exhibition ShareProof: read-only icon + count + derived Russian noun;
- Exhibition LikeWithCount: 46 px target, count always present.

Each reusable semantic component owns its icon and count. A consumer must not
insert a mobile proof inside a Large action merely because both contain a heart.

## Listing and mobile rail

Listing identity/proof placement is derived, not decorative:

- overlay requires trusted listing-ready identity plus safe classified visual
  crop;
- protected or unsafe media moves proof/remaining identities to the side rail;
- absent evidence yields no overlay.

The rule and representative `overlay / side / none` specimens must be visible
on Page 40.2.

The rail master remains an intrinsic, unclipped max-content Track. The 390 px
object remains a separate viewport. The review matrix must visibly vary media
count and framing, media lifecycle, identity count, Free, research-only artifact,
Like state and negative gesture state. Hidden/filter/toast behavior belongs to
the surface/controller, not a cosmetic row variant.

## ExhibitionRow

The row is a composite with linked children:

```text
ExhibitionRow
├── ExhibitionDeck
│   ├── MediaFrame[]
│   ├── RemainingCount (+N, computed)
│   └── Medallion
├── LifecycleRailStatus
├── ReasonChip[] / New
├── TopicTag[]
├── ShareProof
├── LikeWithCount
└── RejectAction
```

`RemainingCount` is reusable, but its number, visibility and x-position are
computed from the measured deck. ShareProof is not a Share action and disappears
at zero. Lifecycle status, reason chips and topic tags are three semantic
families, not color variants of one generic chip.

For fixture event 5376 the pinned structured `venue_name` resolves to
`world-ocean-museum` (ММО). It must not be manually swapped to KOИХМ. If the
owner wants KOИХМ, the event fixture/source identity must first change.

The mobile row follows the source responsive grid and initial stacked-deck
behavior; it is not a scaled desktop collage.

## Medallions, Festival and page lifecycle

The public Medallion frame tiers are exactly `compact44`, `standard60` and
`feature88`. Legacy sizes are evidence, not public variants. Every consumer
binds an explicit identity slug to a linked Artwork component.

FestivalCard remains distinct from EventCard Large but must be rebuilt without
the monolithic source skeleton. It nests Festival-local Date, Status, Theme,
Veil and Favorite components plus shared media and content slots. The generic
44 px Like action is not source-faithful for Festival.

Page 40.1b is a stale archive-only duplicate. After redirecting current review
links, excluding it from active bindings and proving zero live component mains,
the page must be deleted. Historical receipts remain immutable. Page 41 is not
the target of thread 124 and is excluded from the next owner review sequence.

## Materialization readback

The bounded correction was materialized in Penpot and saved as
`Owner review 2 · final READY FOR REVIEW rev1087`. The superseding evidence is
[`receipts/penpot/event-card-owner-review-2-remediation-v1.json`](../../receipts/penpot/event-card-owner-review-2-remediation-v1.json).

Readback at file revision 1087 reports:

- `currentFile.validate() == []`;
- zero variant naming errors;
- replies posted to all 30 threads, 96–125, while all threads remain unresolved
  for owner rereview;
- Page 40.1b absent after zero-main-instance and active-reference checks;
- Page 41 retained and omitted from the owner review route;
- active EventCard parent variants reduced to 12 while the former E13–E23
  source-valid states remain preserved as composable-state contracts;
- one active normalized Medallion frame set with tiers 44 / 60 / 88.

Owner review remains open. No Astro reverse integration, browser candidate,
promotion or production mutation is authorized.

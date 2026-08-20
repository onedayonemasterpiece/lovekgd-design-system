# Event-card owner review 3 — corrective contract

Status: **SoT corrected; Penpot remediation in progress**. Canonical promotion,
Astro reverse integration and production mutation remain forbidden.

The third owner review invalidated the previous READY claim. The failures were
systemic: source-current states were replaced with invented visual shortcuts,
shared actions were duplicated instead of represented as consumer variants,
and semantic component mains were left as overlapping staging objects.

## Source-backed decisions

- EventCard Calendar is `icon → label`. EventCard has no icon-only state. The
  icon-only adaptive CalendarLink belongs to another desktop action-panel
  consumer. Added state remains `#302b27` / `#fffaf2`, label `Добавлено`; green
  would be a new product decision, not current Astro.
- A temporarily hidden EventCard keeps the card visible under a 78% dark overlay
  and a centered undo plate. Listing cards and rail rows use surface/controller
  removal instead and must not inherit that visual state.
- EventCard loading is a media-only full-area dynamic shimmer. Text bars are not
  the source skeleton.
- Listing social proof remains passive evidence. Inside proof is translucent;
  side proof has its own quiet 36px layout.
- Active Like-with-count controls form one shared semantic family with
  consumer-specific geometry. Passive Listing proof remains separate because it
  is not an action.
- Mobile rail order is fixed by Astro: Summary → media → digest → medallions →
  Like → hidden negative control → optional research artifact. The artifact is
  last in the pinned implementation despite the tentative review comment.
- ExhibitionRow must be recomposed at the real donor layer positions. Broad
  background patches that merely cover incorrect raw elements are forbidden.
- Medallion tiers are 44/60/88. Pushkin Card is an intentional non-circular
  composite: its wordmark overflows to the right and must remain visible.

## Page organization

Review matrices remain at `x=0`. Native semantic masters move to labeled,
non-overlapping galleries outside the review matrix. A 24px minimum gutter is
required. A root sibling must never visually look nested inside another board
unless it has real ancestry. Cleanup priority is Page40.1a, Page40.5, Page40.2,
then Page30.1.

The full machine-readable contract and exact thread bindings are in
`catalog/normalization/families/event-preview-representations/event-card-owner-review-3-candidate-v1.json`.

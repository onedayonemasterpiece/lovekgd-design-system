# EventCard Large primitives — owner comment contract — 2026-08-20

**Status:** `IN PROGRESS`; owner-authorized Penpot candidate correction;
noncanonical; no Astro backport or production permission.

This record is the Git-SoT-first disposition for the owner review concentrated
on Page `25 — Iconography`, Page `30.1 — EventCard · Large actions · linked
icons`, and Page `40.1a — EventCard · Large · Review 01–12`.

## Authority and source

- UI source implementation: `events-bot-new@7d4b1d32710f60d65c7eb0dbd084d8cad058b5dc`.
- Later consumer documentation commit `bfe372c18` does not change rendered UI.
- Owner comments in scope: `#66–#84`; prior owner-acceptance thread `#64`
  remains open while this correction invalidates the earlier visual handoff.
- This pass completes only `Astro → Git SoT candidate → Penpot`. It does not
  start the reverse Astro integration.

## Accepted bounded corrections

### Native component boundary

`EventCard · Large` is one reusable parent component. The action and meta
primitives below are native reusable components and every card specimen must use
linked instances rather than copied/detached geometry:

- `Event cards / Large / Actions / Share`;
- `Event cards / Large / Actions / Favorite`;
- `Event cards / Large / Actions / Calendar`;
- `Event cards / Large / Actions / Not interested`;
- `Event cards / Large / Meta / Event type`;
- `Event cards / Large / Meta / Admission`.

Variant properties describe bounded presentation/state differences. Event data
such as a concrete event type or numeric count is instance content, not a new
component identity.

### Typography

All EventCard text and action labels inherit the exact runtime family:
`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
sans-serif`. Penpot uses the available `Inter` font asset. `sourcesanspro` and
browser serif fallback are forbidden in these resources.

### Share

- The component background is always transparent.
- Contrast has exactly two tones: `on-dark` uses one light color for both icon
  and label; `on-light` uses one dark color for both icon and label.
- Interaction/status may change label, opacity, or focus/error stroke, but may
  not introduce a filled rounded background.
- Count has two semantic states: `zero` renders no count; `nonzero` renders a
  numeric count in the same tone.
- The current Astro `is-share-prompt` and related filled-background branches are
  recorded as source divergence, not copied into the owner-directed candidate.

### Favorite / like

- Background and ordinary border are transparent.
- `favorite=off` uses the linked outline heart; `favorite=on` uses the linked
  solid heart.
- `count=zero` renders no counter; `count=nonzero` renders the numeric count.
- The Page 30.1 matrix and at least one Page 40.1a linked specimen must visibly
  demonstrate the nonzero counter.

### Calendar and not-interested

- Both use linked Page 25 icon variants at their runtime consumer sizes.
- Calendar keeps the actual pill surface used by Astro; icon and label are
  optically centered in one row.
- Not-interested is transparent in the split-action presentation; icon/label
  spacing is explicit and compact.
- All labels use Inter.

### Icon geometry and Page 25 layout

- A size variant owns an exact `size × size` vector box. No nested source board
  or vector may overflow that box.
- Share, Heart, Calendar, and Dislike must be visually present and optically
  centered at every published size.
- The reusable variant collections must live in a separate unclipped review
  board and must not overlap the earlier source inventory.
- Visual export is mandatory for Page 25 collections and affected Page 30.1 /
  Page 40.1a specimens after structural read-back.

### Event type and admission

- Event type is a reusable label component. The concrete value (`кинопоказ`,
  etc.) is an instance text override.
- Admission is a reusable component with bounded semantic variants:
  `price-range`, `free`, and `unspecified`; the concrete price string is an
  instance text override.
- Page 40.1a must use linked instances of both resources.

## Completion gate

Before returning the pages to owner review:

1. update native masters and every affected linked instance;
2. prove Inter-only text for the bounded scope;
3. prove transparent Share/Favorite surfaces and exact Share tone consistency;
4. prove visible zero/nonzero Share and Favorite count specimens;
5. prove all icon descendants fit their size boxes and no reviewed collection
   is clipped or overlapping;
6. export and visually inspect Page 25, Page 30.1, and an EventCard Large
   specimen/matrix;
7. run `currentFile.validate()`, save a named version, and persist exact IDs,
   revision, counts, and comment dispositions in a Penpot receipt;
8. leave owner visual-acceptance threads open until the owner re-reviews.


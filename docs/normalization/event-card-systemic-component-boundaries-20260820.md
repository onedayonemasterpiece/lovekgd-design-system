# Event-card systemic component boundaries — owner comments 85–95

> Status: Git SoT correction reconciled to native Penpot; ready for bounded owner re-review.
> Authority: reconstructed candidate, noncanonical, not promoted.
> Source fact: `events-bot-new@7d4b1d32710f60d65c7eb0dbd084d8cad058b5dc`.
> Machine contract:
> [`event-card-systemic-boundaries-candidate-v1.json`](../../catalog/normalization/families/event-preview-representations/event-card-systemic-boundaries-candidate-v1.json).

## Why this is systemic

Owner threads 85–95, including 91–95 on Page 40.2, expose one repeated
projection error rather than five isolated visual defects. Several parent card
masters contain a linked graphic primitive plus an unrelated text layer. Astro
renders those nodes as one functional metric or action. The previous candidate
visual spec explicitly permitted that split, so a Penpot-only repair would leave
the durable contract wrong.

This correction applies to EventCard Large, ListingEventCard, the mobile rail,
FestivalCard and ExhibitionRow. EventListItem is included as a negative control:
its source has no social proof and none may be invented.

## Component boundary decision

### Components

The following have reusable anatomy, state or behavior and are native linked
components:

- **Social proof / Share** — linked share icon and count inside one instance;
- **Social proof / Like** — linked heart icon and count inside one instance;
- **Action / Share** — interactive wrapper composed with linked Share proof;
- **Action / Like** — interactive wrapper composed with linked Like proof;
- Calendar, Not interested and Reject actions;
- Event type and Admission capsules;
- media frame/deck;
- Medallion consumer wrapper: linked frame plus linked artwork.

Medallion Artwork uses the **final self-framed runtime asset**: its source background, source ring and identity mark remain one linked native asset. A consumer frame may own only outer slot geometry, clipping, stroke and placement; it must not draw a second inner ring or shrink the final medallion as if it were a raw logo. For the Exhibition overlay the source-derived border-box is `44 px`, with a `1 px` consumer stroke and the linked artwork at `42 px` inset by `1 px`. Identity swaps are reconciled on the consuming master, never on terminal review instances.

The raw `Icon / UI / …` resource remains the nested graphic primitive. A layer
named `nested Icon / UI / heart` is never an adequate consumer-visible name for
a like metric or action. Every functional instance name exposes its role.

`like` is the candidate semantic name because the pinned source uses `data-like`
on affected surfaces. `favorite` remains only a deprecated compatibility alias;
the Festival exception is a local-save Like action without an aggregate count.

### Content slots, not standalone components

Event title and event place are named semantic slots owned by each parent card.
They receive text overrides and exact typography/clamp/overflow rules, but the
pinned source does not give them an independent reusable layout/state boundary.
Creating a library component for every piece of text would obscure the real
composition and create artificial resources.

The required layer names are `Content / Event title` and `Content / Event place`.
Shared Penpot typography styles are linked to those text layers. Actual titles,
cities and venues are content overrides, never variants.

Place projection remains surface-specific:

| Surface | Projection |
|---|---|
| EventCard Large | `city · venue` |
| ListingEventCard | `venue · city` |
| Mobile rail | `city · venue`, fallback `Место уточняется` |
| FestivalCard | authored `place` / `compactPlace` |
| ExhibitionRow | `venue` or `city` fallback |
| EventListItem | `venue · city` |

## Family composition

### ListingEventCard

Both proof placements (`inside`, `rail`) use linked Share/Like proof components.
The numeric count is a text override inside the instance. No raw count sibling
or direct functional icon is allowed. The medallion is a linked consumer wrapper
named, for example:

```text
linked Medallion / world-ocean-museum / tier=standard60 / placement=overlay
```

The image-stretch defect in thread 91 is reconciled from the pinned media mode
and framing profile, not patched by overlaying a second image.

### Mobile rail

The reusable component is the intrinsic, horizontal `MobileListingRailRow ·
Track`. The 390 px object is a separate viewport pattern:

```text
Rail viewport pattern · 390 · clip/scroll owner
└── linked MobileListingRailRow · Track · max-content · nowrap · clip=false
```

Every full-track state on the review page occupies its own vertical row. The
entire width is visible and the outer review board does not clip. Viewport/scroll
specimens remain in a separate section and are not presented as the reusable
track. The track nests Summary, semantic title/place slots, compact Like proof,
media cells, Digest, Medallion wrappers, Like action, negative action and optional
artifact.

### Festival exception

FestivalCard has a local-save Like/Favorite action but no aggregate count in the
pinned source. A count must not be added merely to force cross-family symmetry.

## Variant versus content

Variants describe structural or behavioral differences: presentation, tone,
interaction state, selected state, zero/nonzero visibility behavior, admission
kind, media treatment, medallion tier and viewport gesture state. The exact
numeric count, title, place, price, date/time, event type string, image/artwork
and event ID are instance content overrides.

## Governance and stop line

This record supersedes the old loose icon/count boundary only for this bounded
candidate scope. Historical receipts remain immutable. Penpot must be reconciled
from the machine contract and receive a new superseding receipt with revision,
native IDs, detached-copy count, validation and focused exports.

Native Penpot reconciliation is recorded in
[`event-card-systemic-component-remediation-v1.json`](../../receipts/penpot/event-card-systemic-component-remediation-v1.json). No reverse change to Astro, browser preview, promotion or production is
authorized. The state is **ready for owner Penpot re-review**, not accepted.

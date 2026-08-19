# Event-card owner-oracle remediation — 2026-08-19

**Status:** `NOT READY`; candidate-only; Astro is read-only until explicit owner
approval.  This note is the Git SoT gate for the fresh owner-comment cycle.

## Authority and evidence chain

1. Exact runtime source: `events-bot-new@a68c7f23c4e014c6e9f66e95f394656e9cb0f411`.
2. Git SoT contracts in this repository.
3. Native Penpot components and linked instances.
4. Owner screenshots are adjacent visual oracles only. They must never be used
   as a card fill, detached component, or replacement for source-native anatomy.

The 36 unresolved Penpot threads are `#24–#59`.  Page ownership is:

| Surface | Threads |
|---|---|
| `exhibition.row` | 24–29, 50–53 |
| Page 48 medallions | 30 |
| Page 49 artifacts | 31 |
| `listing.event-card` | 32–33, 46, 48, 49, 54 |
| `event.card` Part A | 34–38, 45, 47 |
| `festival.card` | 39 |
| `listing.rail-row` | 40–43, 55–59 |
| Page 25 iconography | 44 |

There are no fresh comments on `event.card` Part B or Page 46.  That is not
positive acceptance evidence.

## New adjacent screenshot oracles

All 14 are top-level PNG rectangles outside the managed roots.  Programmatic
fill-ID comparison proved that none of their raster IDs is reused by a managed
component.

| Surface | Thread | Shape ID | Bounds |
|---|---:|---|---|
| event A | 45 | `eca15719-f452-809c-8008-81faf89cd37d` | 1536×717 |
| event A | 47 | `eca15719-f452-809c-8008-81fbb04bf82b` | 598×719 |
| listing | 46 | `eca15719-f452-809c-8008-81fb7afe329a` | 504×384 |
| listing | 48 | `eca15719-f452-809c-8008-81fc31ae9a8d` | 750×426 |
| listing | 49 | `eca15719-f452-809c-8008-81fe571c3a34` | 785×395 |
| listing | 54 | `eca15719-f452-809c-8008-81ff8d68b975` | 1252×406 |
| exhibition | 50 | `eca15719-f452-809c-8008-81fea6fb1bd5` | 1504×204 |
| exhibition | 51 | `eca15719-f452-809c-8008-81fec97c5f9c` | 1491×192 |
| exhibition | 52–53 | `eca15719-f452-809c-8008-81fee6d7da83` | 1487×192 |
| rail | 55 | `eca15719-f452-809c-8008-820171eb437f` | 1080×2400 |
| rail | 56 | `eca15719-f452-809c-8008-820164ad24a8` | 1080×2400 |
| rail | 57 | `eca15719-f452-809c-8008-82017c40c2eb` | 1080×2400 |
| rail | 58 | `eca15719-f452-809c-8008-82018843a60f` | 1080×2400 |
| rail | 59 | `eca15719-f452-809c-8008-820193593f7e` | 1080×2400 |

`festival.card` and event Part B have no fresh adjacent screenshot oracle.
Their review must therefore disclose `source-only validation`, not claim full
oracle closure.

## Exact rebuild contracts

### `event.card`

Sources: `EventCard.astro`, `EventLayout.astro`, `DesktopEventPage.astro`.
The base mobile shell is `#15110f`; desktop related/discovery consumers have a
light `#fffaf2` body/utility treatment on a dark section. Radius is 24 px; media
is dynamic ratio or 4/5. The review axes include consumer, viewport,
presentation, layout, interaction, media, content, commercial, favorite,
calendar, share and visibility.

For `split-actions`, utility controls remain inside the shell and share/like are
below it on a transparent extension. `overlay-controls` keeps feedback inside
the shell and has no calendar. Runtime cards never display taxonomy/debug
consumer chips or helper text such as “Действия поверх медиа”. All four action
families must be linked Page 30.1 instances; old loose controls must be removed,
not hidden under additive replacements.

### `listing.event-card`

Sources: `ListingEventCard.astro`, `design-system.css`. Width is intrinsic:
`mediaHeight × imageRatio + tailWidth`; one fixed 420 px skeleton is forbidden.
Required dimensions include regular/weekend/popular and desktop/mobile proof
placement. Tail widths are 0/40/64/96. Social proof is 17 px desktop, 14 px
mobile; proof rail is 36 px desktop, 28 px mobile. Medallion sizes remain exact
AS-IS until approval: overlay 64, weekend 60, popular 56, popular mobile 46;
single side 60, multiple 51, split 48–52, popular-mobile side 40.

#### Source-bound listing fixtures for crop and density review

The owner PNGs remain adjacent oracles only. Native listing specimens use
Astro-rendered event assets from the supplied review routes:

| use | event / route | intrinsic size | sha256 | Astro-rendered asset |
| --- | --- | --- | --- | --- |
| weekend portrait | `7483` · `/vyhodnye/2026-08-22/` | 750×1000 | `509fc6ae16f2dbdad2aa8bc613da51e18563fbc18088257a4c9f17922aee4a9d` | `https://static.kenigevents.ru/p/image/v2/50/509fc6ae16f2dbdad2aa8bc613da51e18563fbc18088257a4c9f17922aee4a9d.webp` |
| vertical crop | `7491` · `/zavtra/` | 906×1280 | `f42be320b9fbe56e68d064b0ec33936e40619365b30ea48f981f161d4b2f2263` | `https://static.kenigevents.ru/p/image/v2/f4/f42be320b9fbe56e68d064b0ec33936e40619365b30ea48f981f161d4b2f2263.webp` |
| popular portrait | `5459` · `/populyarnoe/` | 1280×1810 | `e5491488a57785a4808b7a8c06fe8c4e1c6f9bd7a3d8a777f5b9355835f6d1ec` | `https://static.kenigevents.ru/p/image/v2/e5/e5491488a57785a4808b7a8c06fe8c4e1c6f9bd7a3d8a777f5b9355835f6d1ec.webp` |

Penpot uses those URLs as native source-bound media fills. No oracle image ID
may appear inside the listing family root.

### `listing.rail-row`

Sources: `MobileListingRailRow.astro`, `MobileListingRailSurface.astro`.
The component is a complete 100vw × 112 viewport over a `max-content` track,
not a 390×112 card. Track gap is 7 and right padding 12. Summary is 296×112;
time 96×82; info 162×78; digest 168×112; medallion slot 94×112 with 86 px
art; like tail minimum 58×56; underlay heart 32; signal heart 12; cue exactly
48×23 at right 6/bottom 12. Media is height 112 with width from each asset's
ratio. Loading is skeleton geometry, errors are neutral, and dislike/like are
underlays behind a translated track. Never paint the card red/green or render
debug strings such as `digest`, `boundary`, `загрузка` or `не загрузилось`.
The Amber tail is a linked Page 49 component.

#### Source-bound multi-image rail fixture

The runtime screenshot is an oracle only. Native multi-image rail specimens are
bound to the Astro-rendered `data-mobile-listing-row` for event `7433`
(Розыгрыш «Царь зверей») on `/zavtra/`. `MobileListingRailRow.astro` emits the
following source assets; they are not pixels cropped from an owner screenshot:

| index | intrinsic size | sha256 | Astro-rendered asset |
| --- | --- | --- | --- |
| 0 | 1920×1920 | `d5eb17823cbd5a70155c6049903b6ff70af77d5f878e2b32ca22458b8ea6ae42` | `https://static.kenigevents.ru/p/image/v2/d5/d5eb17823cbd5a70155c6049903b6ff70af77d5f878e2b32ca22458b8ea6ae42.webp` |
| 1 | 1920×1920 | `183781e0f35099d4e9f1ef618b5e32c52135d11784948dbf8b1e659a5e54df29` | `https://static.kenigevents.ru/p/image/v2/18/183781e0f35099d4e9f1ef618b5e32c52135d11784948dbf8b1e659a5e54df29.webp` |
| 2 | 1920×1920 | `7c74bfdf02f740cf4d923528b66c9e4e0fa44f6a45baad27b69a3a2137921c09` | `https://static.kenigevents.ru/p/image/v2/7c/7c74bfdf02f740cf4d923528b66c9e4e0fa44f6a45baad27b69a3a2137921c09.webp` |

Penpot media components use these exact Astro asset URLs as native media fills.
The adjacent owner PNGs stay outside the managed root and are never reused as
component fills.

### `festival.card`

Source: `pages/festivali/index.astro`. Geometry comes from packed-row aspect,
not fixed compact boxes: mobile default .95, mobile full-row 1.86, very-small
16/10. Radius is `clamp(8px,…,11px)`. Media uses one proportional `cover` layer
with the two source gradients. Date/status min-height is 27 px; chip type
12–13.2 px; title 21–25.2 px (row 4: 19.8–22.8); heart ≈17.92 px. A state has
one semantic layer per field. Duplicate base/custom text, duplicate media and
invented `ПРОГРАММА · PDF` are forbidden.

### `exhibition.row`

Sources: `ExhibitionPrototypeRow.astro`, `ExhibitionsPersonalSurface.astro`.
Desktop grid is `112px clamp(420px,42vw,680px) minmax(250px,1fr) auto`, minimum
height 132 and padding .58/.68rem. At ≤1020 the rail is 95 and media 320–410;
at ≤820 areas become rail/deck/body/aside with deck height
`clamp(160px,48vw,228px)`. Deck frames have minimum 114 px and width
`114 × source ratio`. Loading/error frames must not retain loaded images or
literal status text; forward/back is a transform/opacity phase, not a label.
Medallion is exact 44 px at top/left 8. Icons are linked: share/comment 14,
like 19, reject 18. AS-IS keyboard hints are recorded separately; the owner
candidate shows L/X only for hover or keyboard-selected state and requires an
approved later Astro backport. Hidden copy is exactly “Скрыто из «Для меня»” /
“Отменить”.

## Shared resources and normalization policy

Glyph geometry lives on Page 25 and is inserted through linked component
instances. AS-IS consumer sizes are evidence and must not be silently replaced:
generic event 20; event share 20.48 desktop/18.88 mobile; negative 16; listing
17/14; rail heart 12/28/32 plus cue 48×23; festival heart 17.92; exhibition
share/comment 14, like 19 and reject 18. The proposed normalized icon tiers
12/16/20/28/32 (plus special 48×23) remain candidate-only until owner approval.

Likewise medallion AS-IS geometry remains visible and linked from Page 48. The
candidate 44/60/88 tiers are product-design proposals, not an already-promoted
Astro contract.

## Closure gate

For each family: rebuild cleanly; export; read back exact state keys and native
variant counts; prove linked component provenance; prove zero oracle raster
reuse, zero detached copies, zero duplicate semantic layers and zero debug
labels; run the materializer again with zero creations; validate the file; then
resolve only the threads that the evidence closes. Page 46 remains lightweight
and `NOT READY` until an independent reviewer passes the complete cycle.

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
The visually verified card shell is `#15110f` on both desktop and mobile.
`DesktopEventPage.astro` still contains a `#fffaf2` selector override, but that
source-only branch conflicts with the owner screenshot oracles and is therefore
recorded as an implementation divergence, not materialized as an approved visual
variant. Radius is 24 px; media is dynamic ratio or 4/5. The review axes include consumer, viewport,
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

## Native Penpot materialization read-back (2026-08-19)

The comment-remediation pass remains **NOT READY** for owner review until visual
export and independent review are available. Native structure now contains:

- `event.card`: 23 exact Git state keys across Parts A/B, including explicit
  `viewport` and `presentation` axes. Split and overlay composition uses linked
  Page 30.1 action variants, including every selected/added/share/committed state.
- `listing.event-card`: 10 exact keys with variable Astro-derived widths rather
  than a fixed 420 px skeleton. Square, weekend portrait and popular crop media
  are linked source-bound components; the mobile proof heart is the Page 25
  14 px variant.
- `listing.rail-row`: 16 exact 390×112 viewport/track compositions with the
  source multi-image sequence, linked Page 48 medallions and linked Page 49
  artifact.
- `festival.card`: 9 source states with one semantic field/media layer each.
- `exhibition.row`: 7 source states plus two linked candidate specimens. Source
  states preserve AS-IS keyboard hints. Candidate idle masks L/K/X; candidate
  keyboard-selected exposes them. This does not change Astro.

The 14 owner screenshots remain adjacent oracle shapes and their raster fills
are not reused inside managed component roots. Event B and Festival have no
fresh screenshot oracle, so they remain source-only in this cycle.

New bounded PNG and SVG exports currently return HTTP 504 while plugin reads
and `saveVersion` remain responsive. Penpot documents export as a separate
headless-browser service. The receipt records that blocker instead of turning
structural read-back into a false review-ready claim.

### Independent provenance gate

A fresh independent read-only probe reached Penpot file revision 767, but two
bounded page scans then failed with MCP `-32603 Internal error` after about 58
seconds each. The auditor stopped rather than retrying blindly. It confirmed
only the presence of the Page 48 medallion-frame and Page 49 artifact collection
components; presence is not an exact current read-back. Therefore the Page 48
consumer-frame and Page 49 collection-surface SoT statuses remain unpromoted,
all derived hashes remain unchanged, and Page 46 stays `NOT READY`. The required
next action is restoration of bounded Penpot page reads followed by an exact
status/hash/linked-instance audit; only then may the Git contracts and Penpot
hash aliases advance.

### Post-audit native cleanup

The bounded follow-up removed 73 obsolete top-level Event A controls and 70
Event B controls/state overlays rather than hiding them. Event A hover,
focus-visible and pressed specimens now switch all four linked Page 30.1 action
heads to the matching variant. Event B reads back four visible linked actions in
all 11 states, including selected, added, busy/shared/copied/error and committed.
The retired Listing 14 px heart duplicate was physically removed.

Exact bounded Page 48 and Page 49 reads then proved six AS-IS consumer-frame
variants plus three linked 44/60/88 candidate specimens, and five artifact
collection states including the 390×640 mobile dialog. This allowed a Git-first
status/hash advance (`acea17e9` taxonomy, `9a06383c` medallions, `0d22de69`
artifacts), followed by Penpot rebinding. All eight taxonomy roots and both
collection root/container pairs now read back without stale aliases, and file
validation is empty. Page 46 remains `NOT READY` while the independent re-audit
and current visual export gate are outstanding.

### Exact follow-up after the rev777 provenance audit

The independent bounded audit found four final contract mismatches rather than a
new family gap. The Page 48 mobile-rail frame master was transposed: it and all
four Rail consumers now read `94×112`, with the linked 86 px medallion centered
at offset `4×13`. All four Rail consumer frame heads also carry the current
medallion contract hash. All 51 Page 48 `registry-hash` metadata bindings now match the
current `9a06383c…` medallion contract. Page 49's mobile collection member now
uses the exact `state=dialog-open-mobile` key and the root points to the current
linked Amber Rail instance. Exhibition mobile keeps 48 px interactive wrappers
while the linked Page 25 source-vector boxes are the Astro-exact 14 px comment
and 18 px dislike glyphs.

The bounded remediation rerun at Penpot rev784 created zero objects and updated
zero objects; `currentFile.validate()` returned an empty diagnostic list. Page 46
remains explicitly `NOT READY` because the current exporter still returns HTTP
504, 36 owner threads remain open, and Event B/Festival have no owner screenshot
oracles. An independent structural re-audit is running before any review-ready
claim.

### Independent structural pass and current visual gate

The final independent O(1) audit passed at Penpot rev784: all 65 native state
roots, component provenance, interaction variants, hash aliases, frame geometry
and Page 49 state keys are exact, and validation is empty. Page 46 was saved at
rev786 with an explicit structural-PASS/visual-NOT-READY gate. Threads 31, 37
and 44 were replied to and resolved because their mobile artifact, shared action
and source-size icon requirements have exact readback proof. The other 33
threads remain open; screenshot, framing and product-candidate comments were not
closed from structural evidence alone.

The exporter recovered long enough to export the current Page 46 index and full
Event A family successfully. It then failed on both the Event B family root and
a bounded Event B card with consecutive MCP `-32603 Internal error` results. Per
the timeout/reconciliation policy no further export retry was made. Current
visual acceptance therefore remains blocked and this is not an owner-review-ready
claim.

### Bounded current export matrix after service recovery

After page-scoped handoffs, current full-family PNG exports succeeded for Event A,
Festival and Exhibition; the Page 46 index also exported. Festival's nine states
show source-derived cover framing without the former horizontal stretch. The
Exhibition matrix shows variable media counts, skeleton/error geometry and the
separate idle/keyboard-selected product candidate. Event B, Listing and Rail
continued to return MCP `-32603 Internal error` even for bounded single-card
exports, so their current visual proof remains blocked. Penpot documents export
as a separate Puppeteer/headless-browser service, and upstream reports show both
resource and shape-locator timeout forms of this failure.

Only comments with exact structural or current PNG proof were closed: 24, 27,
28, 29, 31, 35, 36, 37, 39, 44 and 53. Twenty-five framing, screenshot, visual
comparison or pending product-normalization threads remain open. Page 46 now
shows this exact matrix and stays `NOT READY`.

### Exhibition corner and action-contrast candidate (Git first)

Owner threads 25/50 now have an explicit noncanonical candidate: deck media
frames use an 8 px radius with child clipping so no square image corner leaks
outside the framing. Thread 26 now has a linked-icon contrast candidate: the
46 px action wrapper is preserved, Page 25 glyphs remain linked at exact 14/19/18
source sizes, and the muted/focus colors are `#a8adb2`/`#f4f4f2`. These are
review candidates only; Astro remains unchanged until owner approval.

### Exhibition candidate materialization and event state-key reconciliation

The Git-first `db3df87a…` contract was rebound to all eight review roots. Both
Exhibition candidate rows now read back three linked media frames each with
8 px radius and child clipping, plus linked Page 25 action glyphs at 14/14/19/18
px with the candidate muted color `#a8adb2`. Their current export remains blocked,
so threads 25/26/50 are replied to but remain open as product decisions.

All 23 Event A/B component heads already had the correct viewport/presentation
variant properties, but their plugin `state-key` and external labels omitted those
axes. The metadata drift is now removed: plugin keys, variant properties and the
E01–E12/B13–B23 labels agree exactly. Thread 38 is closed on this proof. Threads
34/45 are also closed after the current E01 PNG comparison; thread 47 remains open
because the current B23 export is blocked.

### Event runtime dark-shell oracle reconciliation

The current owner screenshots exposed an over-scoped presentation assumption: the
base `EventLayout.astro` split-actions card is dark `#15110f`, while isolated
`DesktopEventPage.astro`/discovery selectors opt into a light body. The light
selector is retained only as a source divergence; all reviewable `event.card`
states use the screenshot- and runtime-verified dark shell. The SoT also adds the
source-proven `calendar=absent` value.

E01 is the 474 px desktop dark-shell specimen for thread 45. Its native anatomy now
follows the Astro DOM order (`title → meta row → place → utility`, with feedback
below the shell), and its current PNG export was checked. B23 is the distinct
thread-47 specimen: 564×665, the exact event 5370 source media asset
`7c2524…c2c0cb`, registration status and no calendar action. Its structure and
source fill read back exactly, but the current B23 PNG remains blocked by the
Penpot exporter; thread 47 therefore remains open. No screenshot image is used as
a component fill and Astro has not been changed.

### Instrumental re-audit after owner threads 60–65 — 2026-08-20

The previous visual sign-off was invalid. It checked a bounded export without
reconciling the exported geometry against the adjacent owner PNGs. The re-audit
found three concrete defects in Page 40.1a:

- E03 used a white `#fffaf2` shell although the adjacent oracle and the live
  `EventLayout.astro` home-grid render use `rgb(21, 17, 15)` (`#15110f`).
- Every Page 40.1a media rectangle was resized directly to its frame. For E03 a
  1920×1080 source became 380×302 with `clipContent=false` and zero corner radii,
  which both distorted the pixels and removed the rounded top corners.
- Split-action feedback began only 8–9 px below the shell. The corrected review
  geometry keeps utility controls inside the shell and reserves 20 px before the
  share/favorite row, with the card bounds expanded so controls cannot collide
  with the following specimen.

The runtime comparison used the generated Astro preview
`preview-20260820t061807-0c2a8bda` at a 1536 px viewport. Playwright computed a
24 px top media-link radius and `rgb(21, 17, 15)` for the first three home-card
bodies. Penpot must therefore preserve source aspect ratio by cropping inside a
clipped rounded media board; it must never resize the image rectangle to a
different aspect ratio.

The on-canvas variant container is not itself an insertable multi-card component:
its children are the reusable variant masters. To remove the misleading review
affordance, the container and members are explicitly named as a variant set and
individual E01–E12 masters rather than presenting the entire matrix as one card.

The corrected native set is
`195df023-6fe5-80a0-8008-82cad7dbc855` at file revision `919`. Read-back proves
12 variants × 12 properties with zero variant errors, 47 linked action instances
with zero detached actions, no duplicated managed state IDs, and an empty Penpot
validation result. E01 and E03 were exported after the repair and visually checked
against the adjacent dark-shell oracles. A second stable-ID pass created zero
objects.

### Listing viewport and proof reconciliation

The owner comment exposed a metadata/readability defect that the earlier structural
count missed: all ten Listing plugin keys omitted `viewport`, and three member
components (S02/S03/S05) had empty native variant values. S01–S10 now match the Git
SoT keys exactly, including the sole mobile Popular specimen, and each compact label
is aligned directly above its own card. Current PNG exports of S01 and focus-visible
S09 also verify the linked 17 px Page 25 heart/proof in the side rail without clipping.
Threads 32 and 33 are closed on that evidence.

Thread 46 also proved that a heart-only specimen was insufficient: Astro supports
share-only, like-only and combined proof rows. S01 now contains a linked Page 25
share glyph at the exact desktop 17 px size with native count text, above the
existing linked 17 px heart row. The post-write export is currently blocked, so
thread 46 remains open rather than being closed from structure alone.

### Listing vertical/Popular and Rail runtime-oracle reconciliation

The current Listing pass replaced the remaining generic S04 media with the linked
`listing.media.7491.vertical` source fixture (`906×1280`) at the intrinsic
`152.8875×216` source-bound width plus the 96 px side tail. S05 keeps the linked
`5459` portrait source at `300×216`; its Popular mobile medallion is the source
46 px overlay at a 7 px right/bottom inset, and its 14 px proof heart remains a
linked Page 25 icon. Current bounded PNG exports pass for S01, S02, S04 and S05.
Thread 46 was replied to and resolved after the S01 linked 17 px share proof
became visible in the export. Thread 49 remains open because the requested
universal vertical-framing change is an explicit future SoT→Astro backport and
Astro is not changed without owner approval.

The Rail pass now binds all 16 roots to the canonical nine-axis state key in
native variant properties and plugin metadata: `viewport`, `scroll-position`,
`occurrence`, `schedule`, `media-count-sequence`, `gesture`, `media-state`,
`temporal`, `artifact`. The three-image scroll fixtures R03/R04 use linked source
media in their variable-width max-content sequence and now continue into the
native 168×112 digest at the source 7 px gap instead of ending in an empty
viewport fragment. R07/R08/R13 use linked Page 48 frames at 94×112 with 86 px
art at offset 4×13; digest→frame→CTA/artifact gaps are exactly 7 px. R13 embeds
the linked Page 49 Amber artifact at 94×112.

Gesture specimens are source composition states rather than green/red card
repaints. R06 uses a full-viewport red dislike underlay, a +48 px translated
track, the source summary tint and no visible unarmed helper label. R07 uses a
full-viewport green like underlay behind the end-position track, linked Page 25
solid heart 32 in the underlay, and a content-width CTA with linked 28 px heart
plus native count; R08 shows the committed linked 28 px solid heart and updated
count. Current bounded PNG exports pass for R01, R03, R04, R06, R07, R08 and
R13 and were compared with owner oracles 55–59. The screenshots remain adjacent
reference/oracle shapes and are not used as component fills.

### Final weekend/Popular reconciliation and owner decision gate

The final Listing pass binds S02 to the owner weekend oracle rather than a generic
regular-density label. Its native state is `density=weekend`; the square source
media and 96 px tail contain two linked Page 48 identity medallions at 51 px plus
a distinct linked 51 px free medallion. The current bounded PNG export passes and
thread 48 is resolved.

S10 now represents the actual desktop Popular landscape case from thread 54. It
uses the exact event 6407 source fixture («Старший сын»), the 800×534 source asset
at the intrinsic `323.5955×216` width/height, and inside proof pills containing
linked Page 25 share/heart glyphs at 17 px with native counts 23/90. The card title
and place are native text; the screenshot remains an adjacent oracle and is never
used as a fill. The current PNG export passes and thread 54 is resolved.

The exporter also recovered for B23. Its current PNG confirms the dark-shell
«Точка и линия» state, exact linked source media, registration meta, no calendar,
and linked Page 30.1 not-interest/share/favorite actions. Thread 47 is resolved.
Independent bounded Rail readback at rev843 confirms 16/16 state keys, linked
Page 25/Page 48/Page 49 provenance, exact max-content gaps and no screenshot fills.
Rail threads 40–43 and 55–59 are resolved.

The final Git candidate hash is `35155621…`; all eight family/index roots carry
all six current hash aliases. There are 65 native states and all remediated states
have bounded current PNG proof. Page 46 remains deliberately `NOT READY` because
five comments are product decisions rather than implementation defects:
25/26/50 (Exhibition corner/icon candidate), 30 (medallion tiers 44/60/88), and
49 (universal vertical-media framing backport). No Astro change or canonical
promotion is claimed before explicit owner approval.

Final independent O(1) readback at rev866 is PASS: `validate=[]`; all eight
contract roots expose the current `35155621…` aliases; S02/S10 state aliases and
native variant properties agree; linked media/icons/medallions are current; and
Page 46 reports the exact five product-decision threads. This is an implementation
and provenance PASS, not owner approval of the five candidate decisions.

## Owner decision readback and reverse-cycle authorization (2026-08-19)

The live unresolved-thread readback preserves the owner's exact intent rather
than treating the previous `PENDING_OWNER_DECISION` labels as authority:

- **#25 / #50 — approved for Astro backport.** Exhibition media frames use an
  8 px radius and clip their children. This removes the visible square corner
  leak while keeping the outer row/deck framing intact.
- **#49 — approved for Astro backport.** Very tall, explicitly classified OCR
  media with known intrinsic dimensions uses the shared bounded-document rule:
  the target width/height ratio is `sourceRatio / (1 - 0.2)`, `cover` may remove
  no more than 20% of the source area, and unknown/error media still fails
  closed to natural `contain`. The exact `7491` oracle therefore changes from
  `906/1280 = 0.7078125` to `0.884765625`; at 216 px height its media width is
  `191.109375` px, vertical retention is `0.8`, and its real proof-only tail is
  40 px (total `231.109375` px). The earlier 96 px rail was a synthetic
  three-identity state and must not be described as exact event `7491` runtime.
- **#26 — source-parity closure, not a new Astro candidate.** Astro already uses
  the shared `Icon` component, 46 px action wrappers, glyph sizes
  14/14/19/18 px, and the source colors `#a8adb2` / `#f4f4f2`. The required work
  is exact Penpot linkage/alignment and verification; no unapproved color change
  is inferred.
- **#30 — remains candidate-only.** The proposed 44/60/88 medallion tiers stay
  noncanonical until the owner explicitly accepts those exact tiers. Existing
  consumer sizes remain source truth.

Authority order for this reverse cycle is therefore: exact owner thread wording
→ this Git SoT decision record → bounded Penpot candidate update → isolated
Astro implementation and browser proof. No change is applied to the dirty
runtime checkout and no production deployment is implied.

## Reverse-cycle implementation (2026-08-20)

Exact live owner wording was reread before implementation. Threads **25**, **49**
and **50** explicitly authorize the exhibition corner and universal bounded-
document backports; thread **26** requires source parity and therefore produces
no invented color/icon change. Thread **30** does not explicitly approve the
proposed 44/60/88 medallion tiers and remains the only open product decision.

The approved changes were implemented in the isolated `events-bot-new`
worktree on branch `feature/event-card-penpot-backport-20260819`, commit
`0c2a8bdaded8654344458c77bbf98efa0d539e59`, PR **#545**:

- listing projection reuses one shared bounded-document resolver, emits fit /
  treatment / crop / reason attributes, and applies source-generic `cover` only
  to proven `document-safe-cover` media;
- the exact 906×1280 oracle resolves to ratio `0.884765625`, crop `0.2`,
  retention `0.8`, media `191.109375×216`, real tail `40`, total width
  `231.109375`; no event id or asset hash is present in runtime selectors;
- exhibition public and lab decks/frames use radius `8px` and clipping;
- shared action icons remain source-exact: share/comment 14, like 19, reject 18
  in 46px wrappers with `#a8adb2` / `#f4f4f2` source colors.

Validation: focused tests 10/10 PASS; Astro build 469 pages PASS; iconography
contract PASS; Playwright `/zavtra/` found 22 bounded-document cards and zero
fit/crop/retention/overflow offenders; `/vystavki/` desktop and 390px geometry
confirmed radius 8, clipping, and exact glyph sizes. Penpot S04 is now the exact
7491 fixture with linked source media, linked Page25 share/heart proof, zero
medallions, native export PASS. Exhibition X01 and X07 exports PASS. Threads
25/26/49/50 were replied to with evidence and resolved; thread 30 remains open.


## Owner authorization to continue decision #30 (2026-08-20)

After the interrupted task context was restored with thread **30** identified as the
sole remaining product decision, the owner instructed: “Раз контекст восстановлен,
то продолжи реализацию, по готовности сообщишь, чтобы я мог начать ревью и на
каких страницах Penpot”. This is recorded as authorization to continue the already
documented **44 / 60 / 88 px** medallion normalization through the remaining
Git SoT → Penpot → Astro reverse cycle.

The approved size contract is intentionally limited to identity medallions:

- **compact — 44 px:** exhibition surfaces and mobile Popular listing overlays /
  side rails;
- **standard — 60 px:** desktop listing overlays and side rails, including multiple
  and split-tail arrangements;
- **feature — 88 px:** event-detail identity medallions and mobile listing-rail art;
  the transparent rail placement slot remains 94×112 px.

Collection-brand artwork outside `event.medallion-frame` is not in this contract.
The pre-normalization 40/46/48–52/51/56/64/72–108 px source geometries remain
labelled AS-IS evidence and must not be presented as the normalized runtime.
Thread 30 may be resolved only after Penpot readback, Astro migration and bounded
visual checks all pass.

## Decision #30 implementation complete and ready for review (2026-08-20)

The authorized reverse cycle is complete without promoting the reconstructed
collection to canonical status. Identity medallions now have exactly three
production sizes: **compact 44 px**, **standard 60 px**, and **feature 88 px**.
Pre-normalization geometries remain visible as labelled AS-IS evidence.

Astro was migrated in `events-bot-new` commit
`7d4b1d32710f60d65c7eb0dbd084d8cad058b5dc` on PR **#545**.
`EventTokenMedallions@2` is the production default; deprecated `@1` exists only
as the side-by-side design-system catalog comparison. Listing, mobile rail,
event detail, and exhibition consumers use shared tokens rather than private
intermediate diameters.

Validation evidence: medallion contract tests 4/4 PASS; the affected static
suite 10/10 PASS; content-media behavior 6/6 PASS; design-system contract PASS;
Astro preview build 446 pages PASS; `check:preview` PASS; desktop and 390 px
Playwright geometry PASS. Penpot Page 48 tier exports show 44/60/88 exactly;
listing, rail, and exhibition consumer readbacks pass with `validate=[]`.

Penpot file revision **908** is ready for owner review. Start at Page 46, then
review Page 48 and the consumer matrices on Pages 40.2, 40.3, and 40.5. Owner
thread 30 contains the implementation receipt and is resolved; Page 46 has no
remaining unresolved comments.

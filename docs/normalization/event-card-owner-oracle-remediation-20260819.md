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
base `EventLayout.astro` split-actions card is dark `#15110f`; only the
`DesktopEventPage.astro`/discovery selectors opt into a light body. The SoT now
keeps both presentations and adds the source-proven `calendar=absent` value.

E01 is the 474 px desktop dark-shell specimen for thread 45. Its native anatomy now
follows the Astro DOM order (`title → meta row → place → utility`, with feedback
below the shell), and its current PNG export was checked. B23 is the distinct
thread-47 specimen: 564×665, the exact event 5370 source media asset
`7c2524…c2c0cb`, registration status and no calendar action. Its structure and
source fill read back exactly, but the current B23 PNG remains blocked by the
Penpot exporter; thread 47 therefore remains open. No screenshot image is used as
a component fill and Astro has not been changed.

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

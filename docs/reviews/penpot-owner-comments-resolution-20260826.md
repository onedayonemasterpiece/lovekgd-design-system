# Penpot owner comments resolution — 2026-08-26

Status: `IN_PROGRESS`

This is the working delivery ledger for the bounded Astro ↔ UI SoT ↔ Penpot fixes. It replaces audit narration with current product state, exact mutation targets and review gates.

## 1. Authority and delivery target

- Repository: `onedayonemasterpiece/lovekgd-design-system`
- Working branch: `fix/penpot-owner-comments-20260826`
- Draft PR: `#53` — `fix(ds): apply Penpot owner comments after independent audit`
- Draft PR base: `audit/independent-as-is-wave1-20260825`
- Independent audit final commit: `65e6208f9dc8fbff9837dacfada0f52ecc49f6cb`
- Audit report: `docs/audits/independent-as-is-baseline-wave1-audit-20260825.md`
- Audited PR: `#52` — immutable in this pass
- Pinned audited head: `b86bab3e91511b3d4bd7d953b22bceb847f02a51`
- Corrected UI SoT base: `9b8043f3bdb86fab4eee00bf94b0f10d4f029c50`
- Astro authority: `onedayonemasterpiece/events-bot-new@7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00`
- Penpot file: `3be9e5e1-190f-8090-8008-713c0fbe6260`
- Audit snapshot: `2479`
- Current readback revision: `2509`
- Current `validate()`: `[]`

Terminal delivery target: `READY_FOR_OWNER_REVIEW`. Production Astro, PR `#52`, its branch and pinned head are not modified.

## 2. Direct-integration checkpoint

| Capability | Result | Current evidence |
|---|---|---|
| GitHub read/write/commit/push | PASS | branch remote HEAD before CP-01: `36b81a717a2bedb3b91ff8c0664aaf39fcaad2d6` |
| GitHub Draft PR create/read | PASS | Draft PR `#53` open against the required base |
| Penpot file read/write/readback | PASS | exact file/page context; bounded shape write/readback and cleanup passed |
| Penpot board export | PASS | direct `shape.export()` returned valid PNG/JPEG bytes |
| Penpot comments list/read/reply/resolve | PASS | temporary thread `#206` passed create/read/reply/resolve/delete |
| Preflight leftovers | PASS | `0` temporary shapes; `0` temporary threads |
| Current threads | INFO | `192` total, `116` open, `76` resolved |
| Penpot validation | PASS | `[]` at revision `2509` |

## 3. Required owner-page materialization rule

The canonical rule is recorded in `docs/page-archetype-requirements.md`:

> Full page boards show complete vertical page content. Desktop/mobile page boards are arranged horizontally. Specimens and diagnostics sit outside the page-board row. Horizontal clipping is valid inside a real viewport for intrinsic rails, but never justifies vertical truncation of a page board.

This is review-evidence placement. It does not widen the mobile viewport, change runtime behavior, promote an archetype or create a component family.

## 4. CP-01 — owner-page and Popular rail checkpoint

### 4.1 All 17 Atlas pages

Fresh Penpot readback at revision `2509`:

- Atlas pages: `17`
- desktop/mobile owner boards: `34`
- linked owner boards: `34 / 34`
- desktop placement: `x=0`, `y=0`
- mobile placement: `x=1320`, `y=0`, real viewport width `390`
- vertical overflow at direct page-section boundary: `0`
- helper/specimen boards below the full-page row: `0`
- affected detached duplicate count: `0`
- `validate()=[]`

| Product surface | Penpot page ID | Desktop board ID | Mobile board ID | Layout gate |
|---|---|---|---|---|
| Home | `d87e18f1-dcb4-80a6-8008-8806c5b98101` | `d87e18f1-dcb4-80a6-8008-8806efd8647f` | `d87e18f1-dcb4-80a6-8008-8806f1f90263` | PASS |
| Date listing | `d87e18f1-dcb4-80a6-8008-8807f67e8a2e` | `d87e18f1-dcb4-80a6-8008-8807f6b14cd1` | `d87e18f1-dcb4-80a6-8008-8807f91d5293` | PASS |
| Weekend listing | `d87e18f1-dcb4-80a6-8008-88089c3e75c9` | `d87e18f1-dcb4-80a6-8008-88089c93d57f` | `d87e18f1-dcb4-80a6-8008-8808db012d23` | PASS |
| Popular listing | `d87e18f1-dcb4-80a6-8008-880937f54501` | `d87e18f1-dcb4-80a6-8008-880938344c39` | `d87e18f1-dcb4-80a6-8008-8809ea570ea8` | PASS |
| Unusual listing | `d87e18f1-dcb4-80a6-8008-880a6c07b2b2` | `d87e18f1-dcb4-80a6-8008-880a6c416ec5` | `d87e18f1-dcb4-80a6-8008-880a6f9d215e` | PASS |
| Search | `d87e18f1-dcb4-80a6-8008-880ac732b6ae` | `d87e18f1-dcb4-80a6-8008-880ac7b07e0b` | `d87e18f1-dcb4-80a6-8008-880acb90d104` | PASS |
| Event detail | `d87e18f1-dcb4-80a6-8008-880bfdfbf2ec` | `d87e18f1-dcb4-80a6-8008-880bfe361a1d` | `d87e18f1-dcb4-80a6-8008-880c01b4fbef` | PASS |
| Collections | `d87e18f1-dcb4-80a6-8008-880c4a36d153` | `d87e18f1-dcb4-80a6-8008-880c4a6d708e` | `d87e18f1-dcb4-80a6-8008-880c4cb4c4e6` | PASS |
| Festivals | `d87e18f1-dcb4-80a6-8008-880c8e21990e` | `d87e18f1-dcb4-80a6-8008-880c8e48d9e8` | `d87e18f1-dcb4-80a6-8008-880c911b8674` | PASS |
| Exhibitions | `d87e18f1-dcb4-80a6-8008-880cc5490f78` | `d87e18f1-dcb4-80a6-8008-880cc5676c70` | `d87e18f1-dcb4-80a6-8008-880cc78ce882` | PASS |
| Interest clubs | `d87e18f1-dcb4-80a6-8008-880cfe1ec779` | `d87e18f1-dcb4-80a6-8008-880cfe39384c` | `d87e18f1-dcb4-80a6-8008-880cff1a1193` | PASS |
| Favorites | `d87e18f1-dcb4-80a6-8008-880d209a7fcd` | `d87e18f1-dcb4-80a6-8008-880d20bc67e8` | `d87e18f1-dcb4-80a6-8008-880d230a2b8b` | PASS |
| Personal feed | `d87e18f1-dcb4-80a6-8008-880d8bcc2d0b` | `d87e18f1-dcb4-80a6-8008-880d8c05a466` | `d87e18f1-dcb4-80a6-8008-880d8db35320` | PASS |
| Focus group | `d87e18f1-dcb4-80a6-8008-880f767c3eb3` | `d87e18f1-dcb4-80a6-8008-880f76b4ddc0` | `d87e18f1-dcb4-80a6-8008-880f7859acee` | PASS |
| Artifacts | `d87e18f1-dcb4-80a6-8008-880f9a822a76` | `d87e18f1-dcb4-80a6-8008-880f9aaea84e` | `d87e18f1-dcb4-80a6-8008-880f9c4c81c4` | PASS |
| Information pages | `d87e18f1-dcb4-80a6-8008-880fb747d10c` | `d87e18f1-dcb4-80a6-8008-880fb76dafb9` | `d87e18f1-dcb4-80a6-8008-880fb8952b02` | PASS |
| Special states | `d87e18f1-dcb4-80a6-8008-880fd2e88456` | `d87e18f1-dcb4-80a6-8008-880fd30f9860` | `d87e18f1-dcb4-80a6-8008-880fd453e907` | PASS |

The layout gate is not the product READY verdict. Pages with missing or wrong populated/key states remain blocked below.

### 4.2 Popular mobile fixtures — threads `#181–#187`

| Thread | Exact UUID | Readback / export proof | Status before comment closure |
|---:|---|---|---|
| 181 | `c269caa0-e456-818c-8008-8a93be4bf647` | first Social proof row remains at `y=20`; second linked row moved to `y=52` | implemented + readback; pending Git SHA/reply/resolve |
| 182 | `c269caa0-e456-818c-8008-8a93d2aad94a` | same two-row linked composition; no overlap | implemented + readback; pending Git SHA/reply/resolve |
| 183 | `502b4555-3f5f-807a-8008-8a93e4ac7cad` | content-driven widths preserved: `29.625` for two digits, `36.921875` for three | implemented + readback; pending Git SHA/reply/resolve |
| 184 | `c269caa0-e456-818c-8008-8a941dda3453` | text is `5 июня–\n30 августа`; number/month use NBSP; `x=45 y=159 w=96 h=34` | implemented + readback; pending Git SHA/reply/resolve |
| 185 | `502b4555-3f5f-807a-8008-8a9446a4ad16` | portrait wrapper `99×112`, clip=true; linked media `99×140.022`, centered cover | implemented + readback/export; pending Git SHA/reply/resolve |
| 186 | `502b4555-3f5f-807a-8008-8a945e1eed31` | landscape wrapper `140×112`, clip=true; linked media `167.673×112`, centered cover | implemented + readback/export; pending Git SHA/reply/resolve |
| 187 | `502b4555-3f5f-807a-8008-8a94ad9384df` | both 390×112 fixtures exported and visually reviewed; same existing family path; no detached/new family; intrinsic rail clips only at viewport edge | visual PASS; pending Git SHA/reply/resolve |

Additional proof:

- `event.real.5459` fixture: `8e7accff-5c78-8007-8008-897accaded5a`
- `event.real.5374` fixture: `8e7accff-5c78-8007-8008-897afa012baf`
- family path: `Popular / Mobile row viewport / Fixture`
- linked media owners: `event.real.5459` and `event.real.5374`
- inspected exports: portrait PNG `30,226` bytes plus half-scale JPEG; landscape half-scale JPEG
- no stretching; no letterboxing; no text/action clipping
- mobile viewport remains `390 px`
- `validate()=[]`

### 4.3 UI SoT disposition for CP-01

The full-height/horizontal row change is Penpot-only because it changes review-board presentation, not product anatomy or runtime behavior.

The Social proof placement, NBSP date wrap and crop wrappers restore existing source-faithful fixture behavior and the standing owner constraints; they do not introduce a new semantic role, component composition, responsive rule or component family. Linked ancestry is preserved. Therefore no UI SoT contract mutation is required for CP-01 beyond recording the owner-page publication rule.

## 5. Current owner-comment worklist

`#200` and `#202` are already answered and resolved. They remain closed: a real mobile viewport stays `390 px`; the full intrinsic rail belongs in a component specimen.

| Batch | Threads | Product surface | Current state |
|---|---|---|---|
| A | `#188`, `#189` | Social proof overflow; desktop media framing | technical blocker |
| B | `#180`, `#198`, related `#190` copy | Search/navigation and key runtime states | technical blocker |
| C | `#191–#195`, `#199` | Artifacts, Focus group, Favorites, Interest clubs, Collections, Unusual | missing/wrong populated page evidence |
| D | `#196–#197` | Event Detail variants | missing/wrong source-faithful composition |
| E | `#201` | Home hero-talk variants | missing page evidence |
| F | `#178–#179` | Floating action island | pending lowest-owner correction |

The remaining historical explicit defects are `#168–#173`, `#175` and `#177`. They are reconciled only where they overlap the current lowest-owner batches. Previously answered historical threads are not blindly reworked or resolved.

## 6. Checkpoint log

| Checkpoint | Git commit | Penpot revision | Result |
|---|---|---:|---|
| Inventory | `c9520346f85fe0262bf228fed1be8f88da485ed9` | 2479 | 118 open threads inventoried |
| Mapping correction | `99e3b175b13a408b91d47a917c5c4e80902c34fb` | 2479 | exact page/target mapping corrected |
| Direct integration preflight | `36b81a717a2bedb3b91ff8c0664aaf39fcaad2d6` | 2509 | GitHub/Penpot read-write-export-comment channels verified; temporary objects removed |
| CP-01 owner pages + Popular rail | `THIS_COMMIT` | 2509 | 17 pages / 34 linked boards PASS; `#181–#187` readback/export PASS; comment closure follows remote SHA verification |

## 7. Rail cleanup continuation checkpoint — 2026-08-27

Status: `PARTIAL_DURABLE_CHECKPOINT / PENPOT_CONNECTION_BLOCKED`

This section supersedes the stale current-state fields above where it records a newer exact readback. It is a durability checkpoint, not Rail completion and not owner-review readiness. `OV-01`, `OV-02`, `OV-08`, `OV-25`, `OV-26` and `OV-27` remain `processed: NO`.

### 7.1 Fresh state before mutation

- Penpot file: `3be9e5e1-190f-8090-8008-713c0fbe6260`.
- Fresh revision: `2553`.
- `63.04 — Atlas · Popular listing`, shape `e57c842a-ea36-803b-8008-8b62bbf9a8a0`, already read back to canonical period component `cd5c3cad-a82a-806e-8008-8c33cdfc0d1c` / main `cd5c3cad-a82a-806e-8008-8c33ca5b2d62`.
- Fresh `validate()` at revision `2553`: `[]`; the handoff mismatch was stale and was not blindly re-mutated.
- Three handoff legacy-main UUIDs were already absent on `40.3a`: `8e7accff-5c78-8007-8008-897b3d41c56a`, `8e7accff-5c78-8007-8008-897b2cdc2521`, `8e7accff-5c78-8007-8008-897add53ed11`.
- Page-scoped inventory found `18` surviving copy heads of former component `8e7accff-5c78-8007-8008-897ace18e994`: nine nested consumers plus nine root fixtures.

### 7.2 Proven canonical replacements

All rows below were created from the canonical exact-date owner `cd5c3cad-a82a-806e-8008-8c351a4f2dcb` / main `cd5c3cad-a82a-806e-8008-8c3515bb5cc6`. Nested media read back to canonical `EventMediaFrame / rail-5x4 / cover`, component `a21f0524-f565-8038-8008-787378260237` / main `a21f0524-f565-8038-8008-787377eb13b2`, with `clipContent=true`.

| Fixture / role | Removed legacy copy | Canonical replacement | Proof |
|---|---|---|---|
| `event.real.6941`, nested consumer | `e57c842a-ea36-803b-8008-8b62ac9c4525` | `dcae186c-d2c9-80c9-8008-8c6922cb6a82` | exact date/time/title/place/count and image ID `502b4555-3f5f-807a-8008-89652b5e532f` preserved; `112×112` cover |
| `event.real.6986`, nested consumer | `e57c842a-ea36-803b-8008-8b62ae6ee725` | `dcae186c-d2c9-80c9-8008-8c692483b44e` | exact content and image ID `502b4555-3f5f-807a-8008-89657e217f66` preserved; wrapper `184×112`, image `184×112.125` |
| `event.real.6870`, root fixture | `e57c842a-ea36-803b-8008-8b623288c784` | `dcae186c-d2c9-80c9-8008-8c69f3c1e225` | multi-date text preserved; date slot restored to `96×34`, `y=32.5`; square cover `112×112` |
| `event.real.6652`, root fixture | `e57c842a-ea36-803b-8008-8b623e9c24e2` | `dcae186c-d2c9-80c9-8008-8c69f6f4cc23` | exact content and image ID `c269caa0-e456-818c-8008-8966ada50b95` preserved; portrait cover wrapper `93×112`, image `93×139.636` |
| `event.real.6870`, nested consumer | `e57c842a-ea36-803b-8008-8b62ab387764` | `dcae186c-d2c9-80c9-8008-8c6a716d4c94` | semantic equality plus exact-date and EventMediaFrame lineage read back |
| `event.real.6652`, nested consumer | `e57c842a-ea36-803b-8008-8b62b6ab6988` | `dcae186c-d2c9-80c9-8008-8c6a72f23072` | semantic equality plus exact-date and EventMediaFrame lineage read back |

- Last proven Penpot revision after the six legacy-copy removals: `2559`.
- Last obtained validation: `validate()=[]` at revision `2557`; a final post-removal validation at revision `2559` was not obtainable after the plugin disconnected.
- The arithmetic remainder is `12` former-component copies, but this is **not** accepted as a fresh census until Penpot reconnects and the page-scoped query is repeated.

### 7.3 Fail-closed interruption

- A bounded attempt to create the canonical `event.real.4211` root returned: `No Penpot instance connected for user token`.
- Mutation execution is therefore `UNKNOWN`; do not retry it until an exact page-scoped postcondition read checks for `linked Event cards / Mobile rail / Schedule=exact-date / event.real.4211`.
- Two subsequent minimal readbacks returned the same connection error. After three consecutive small failures, further Penpot mutations were stopped as required.
- Focused exports, final former-component census and final `validate()=[]` are pending the restored plugin connection.
- Rail cleanup is **not** remotely or technically complete; no item is promoted to `READY_FOR_OWNER_REREVIEW` or `processed: YES` by this checkpoint.

## 8. Supersession checkpoint — revision 2565

Status: `PARTIAL_DURABLE_CHECKPOINT / ACTIVE_CONTINUATION`

This append-only entry supersedes the two incorrect nested-consumer rows in §7.2 and the stale interruption state in §7.3. It does not erase the earlier history and does not mark Rail or any owner item complete.

### 8.1 Corrected nested-consumer identity

The nested consumers for `event.real.6870` and `event.real.6652` were fixed **in place** with `swapComponent`; their original UUIDs remained canonical. The temporary overlapping copies recorded in §7.2 were removed after reload and are not surviving consumers:

- removed temporary copy: `dcae186c-d2c9-80c9-8008-8c6a716d4c94`;
- removed temporary copy: `dcae186c-d2c9-80c9-8008-8c6a72f23072`.

Surviving nested consumers:

| Fixture | Surviving shape | Canonical Rail lineage | Canonical media lineage | Restored parity / export |
|---|---|---|---|---|
| `event.real.6870` | `e57c842a-ea36-803b-8008-8b62ab387764` | exact-date component `cd5c3cad-a82a-806e-8008-8c351a4f2dcb`; main `cd5c3cad-a82a-806e-8008-8c3515bb5cc6` | `EventMediaFrame` component `a21f0524-f565-8038-8008-787378260237`; main `a21f0524-f565-8038-8008-787377eb13b2` | `24, 26\nиюл`, `17:00`, original title/place/count, image `c269caa0-e456-818c-8008-89652a2b1151`, cover `112×112`, `clipContent=true`; focused PNG `26,531` bytes |
| `event.real.6652` | `e57c842a-ea36-803b-8008-8b62b6ab6988` | exact-date component `cd5c3cad-a82a-806e-8008-8c351a4f2dcb`; main `cd5c3cad-a82a-806e-8008-8c3515bb5cc6` | `EventMediaFrame` component `a21f0524-f565-8038-8008-787378260237`; main `a21f0524-f565-8038-8008-787377eb13b2` | `2 авг`, `18:00`, original title/place/count, image `c269caa0-e456-818c-8008-8966ada50b95`, wrapper `93×112`, image `93×139.636…`, `y=-13.818…`, `clipContent=true`; focused PNG `31,602` bytes |

Latest proven Penpot state before this GitHub checkpoint:

- revision `2565`;
- current page `40.3a — Popular mobile fixtures · current-v1`;
- `validate()=[]`;
- the last fresh census still reported `12` former-component copies: `5` nested consumers and `7` root fixtures. This count must be fresh-read before any next mutation.

### 8.2 Crash cause and mandatory guardrail

The prior black screen was caused by an unsafe mutation, not by pre-existing file corruption:

- containers `8e7accff-5c78-8007-8008-897c2ed30706` and `8e7accff-5c78-8007-8008-897c45ac62ac` were main component instances, not ordinary boards;
- full canonical Rail clones were inserted into them beside existing children;
- old and new complete trees overlapped at the same coordinates;
- component propagation plus rendering of the heavy page caused the black screen and plugin disconnection.

After reload the file opened normally and `validate()=[]`.

For every remaining Rail target, the required process is now:

1. resolve the exact page and search only within `page.root`;
2. inspect target parent and component-main/copy status;
3. capture a bounded snapshot of identity, index, geometry, content, image fill and crop;
4. choose period versus exact-date from real schedule semantics and Astro/UI SoT;
5. run `swapComponent` **in place** on the existing target;
6. restore overrides and media geometry;
7. immediately read exact lineage, run `validate()`, and export one focused row.

Forbidden operations include parallel full-tree clones, two overlapping Rail trees, global `findShapeById`, full-page serialization/export, multi-target mutations, and treating `remove()` as successful without an exact postcondition read.

`OV-01`, `OV-02`, `OV-08`, `OV-25`, `OV-26` and `OV-27` remain `processed: NO`. Rail cleanup remains incomplete until the former component count is zero, all consumers inherit canonical Rail and `EventMediaFrame`, focused exports pass, `validate()=[]`, and the result is committed and fresh-read from remote GitHub.

### 8.3 Fresh completion census for Rail ancestry

A current page-scoped read-only census on `40.3a` supersedes the stale
remainder in §§7–8. The former component
`8e7accff-5c78-8007-8008-897ace18e994` now has `0` surviving copies. All `26`
visible Rail roots are linked instances of the single canonical
`MobileListingRailRow · Schedule variants` family: `22` exact-date component
`cd5c3cad-a82a-806e-8008-8c351a4f2dcb` and `4` period component
`cd5c3cad-a82a-806e-8008-8c33cdfc0d1c`. No alternative Mobile Rail root
component and no detached Rail root remain; `currentFile.validate()=[]`.

Both linked `event.real.5459` period specimens preserve the exact text
`5 июня–\n30 августа`, including NBSP and the intended line break. The complete
26-UUID census is in
`evidence/recovery-20260828/penpot/popular-mobile-rail-lineage-census.v1.json`.
This is sufficient structural evidence for `OV-01` to reach
`READY_FOR_OWNER_REREVIEW`; it remains `processed: NO` until owner acceptance.

### 8.4 Media parity correction: blanket cover is not factual Astro

The same source audit found that the prior Penpot-only interpretation of
`EventMediaFrame / rail-5x4 / cover` is not a complete Astro contract. Current
Astro has no `EventMediaFrame` symbol. The real owner is
`MobileListingRailRow.astro` plus `mobileListingRailMedia.mjs`: only positively
classified crop-safe photos use `140×112` cover; OCR, document, contradictory
or crop-unsafe media use a content-sized authored-ratio wrapper with `contain`.
That is how Astro avoids internal fields without blindly cropping protected
content.

Targeted current readback confirms two concrete Penpot mismatches:

- `event.real.6936`: factual Astro `75×112 contain`; Penpot `93×112` wrapper
  with `93×139.636…` cover image;
- `event.real.6652`: factual Astro `75×112 contain`; Penpot has the same wrong
  `93×112` cover treatment.

Six bounded controls (`5374`, `7015`, `6710`, `4211`, `6941`, `6986`) match
their source-sized cover/contain widths. The exact comparison and source gaps
are recorded in
`catalog/reconstruction-atlas/v1/mobile-rail-media-astro-penpot-reconciliation.v1.json`.

`OV-02` is therefore no longer an unspecified evidence gap: it is
`MISMATCH_CONFIRMED / LOWEST_OWNER_DECISION_PENDING`, still `processed: NO`.
The next safe step is a new authored-contain state on the lowest owning design
component and three-way certification before swapping the two affected linked
rows. Page-local resizing or blind cover would repeat the original defect.

## 9. Recovery readback and bounded corrections — 2026-08-28

Status: `PARTIAL_DURABLE_CHECKPOINT / READY_TO_CONTINUE_OWNER_REVIEW`.

This checkpoint supersedes unverified chat claims for revisions `2582–2596`; it does not mark the current backlog complete. Fresh file history contains autosaves `2583`, `2585`, `2590` and `2595`, but acceptance is based only on revision `2604+` structural readback.

### 9.1 Fresh authority and intake

- Astro authority: `events-bot-new@8710e56fa3685f6c30a90cd062d532dce0348cce`.
- IdeaHub intake authority is superseded by the history-wide checkpoint in §11.
- The original forward-only intake found one relevant corrected voice packet. It
  was incomplete because it omitted an earlier audit packet; use §11 counts and
  dispositions instead.
- Penpot preflight: exact file `3be9e5e1-190f-8090-8008-713c0fbe6260`, start revision `2604`, temporary preflight shape removed, `validate()=[]`, focused export passed.

### 9.2 `63.01 — Atlas · Home`

The title remains the current Astro source text, `Куда пойти — без лишнего шума`; it was not replaced with new copy.

The untrusted `HeroTalk / Evidence chain` structures were removed from both native HeroTalk mains rather than retained inside product UI:

- desktop main `d87e18f1-dcb4-80a6-8008-88510b4e2f4e`, component `d87e18f1-dcb4-80a6-8008-885112b50a4a`;
- mobile main `d87e18f1-dcb4-80a6-8008-88510ffeb115`, component `d87e18f1-dcb4-80a6-8008-8851133f333f`;
- desktop consumer `d87e18f1-dcb4-80a6-8008-88532b1475e4` and mobile consumer `d87e18f1-dcb4-80a6-8008-88532cc843be` retained linked ancestry;
- fresh page-scoped readback found `0` remaining `Evidence chain` shapes and `validate()=[]` at revision `2606`;
- focused export: `evidence/recovery-20260828/penpot/home-herotalk-mobile.png`.

`OV-07` remains `processed: NO`, but its separate Git-bound product-pattern
contract now exists in
`catalog/ui-components/hero-talk/accepted-donor-and-chains.v1.json`. It contains
seven canonical chains from research commit `52f3afe73`. Native Penpot page
`40.6` now contains all seven chains with visible arrows, remains separate from
the product main, passed structural readback and `validate()=[]` at revision
`2641`, and has a named version. Focused PNG/SVG export is blocked by repeated
external Penpot exporter HTTP `504`; see
`evidence/recovery-20260828/penpot/hero-talk-chains-structural-receipt.v1.json`.

The history-wide IdeaHub audit also created `OV-50`. The owner later supplied
the accepted live donor preview
`https://kenigevents.ru/preview-20260730-hero-talk-date-donor-r2/`, backed by
Astro commit `0eaf08c6827d5b2cbd4c2603380dd13a36be1ada`. The exact donor was restored
in `events-bot-new#596` commit `4243401a4`; the intervening card-like attempt
`7d026b30d` was reverted. Penpot resumed with read-only reconciliation. At
revision `2639`, accepted desktop/mobile mains and their Home consumers remain
linked, `validate()=[]`, and the named version plus focused exports are recorded
in `evidence/recovery-20260828/penpot/home-herotalk-accepted-receipt.v1.json`.
`OV-50` is ready for owner re-review and remains `processed: NO`.

### 9.2a `10.1 — Announcements Wordmark`

`OV-04` and `OV-05` now have a bounded Git-side source contract:

- `catalog/branding/announcements-v1/contract.v1.json` pins the one live
  `AnnouncementsWordmark` and `AnnouncementsLockup` family;
- `docs/branding/announcements-branding-sot.md` records desktop/mobile tag
  geometry, spacing, usage and the component/static-asset boundary;
- leather remains a decorative raster skin behind live DOM/SVG lettering;
- the favicon and four PWA `any`/`maskable` `192/512` images remain static
  application artwork and carry exact Astro hashes.

This does not close either item. Penpot is paused, so the owner-readable page,
native master ancestry, linked specimens, focused export and readback are still
missing. On resume, begin with read-only exact-ID reconciliation.

### 9.2b Event-card family consumers (`OV-08` / `OV-30`)

The Git-side correction is now explicit in
`catalog/ui-components/event-card-family/consumer-lineage.v1.json`. It maps the
actual Astro paths for Home, Date, Weekend, Popular, Unusual, Search final
results and Event Details related cards. The large card, compact listing card
and mobile rail may remain separate runtime adapters, but they must project to
one navigable Penpot family owner rather than unrelated local roots.

No canonical Penpot UUID is fabricated while the window is closed. The item is
only `PARTIAL_SOT`: the read-only duplicate-root census, exact family UUID,
bounded swaps, detached-copy proof, validation and focused exports remain open.

### 9.3 `63.11 — Atlas · Interest clubs`

The fabricated `Клуб настольных игр`, `6 встреч · Калининград` and single-club counts were removed. The existing lowest owner `Interest clubs / Club card / state=ready` now uses the committed fixtures from `site/src/data/interest-clubs.json`:

- `Game Vibes` — `3 даты в каталоге · 1 встреча впереди`;
- `Клуб исследователей нейронок` — `2 даты в каталоге`;
- `Клуб исследователей технологий` — `3 даты в каталоге`.

Desktop and mobile ready-state lists each contain three linked instances of component `d87e18f1-dcb4-80a6-8008-88648c204cec`; detached copies remain `0`. The page status is `В каталоге: 3`; fabricated-content hits are `0`; `validate()=[]` at revision `2609`.

Focused export from this superseded interpretation was intentionally not retained; accepted exports are recorded in §10.

This does not enable the feature in Astro. Production-default visibility remains controlled by `PUBLIC_INTEREST_CLUBS_ENABLED`; the ready state is a source-backed archetype fixture, not release permission. `OV-40` remains `processed: NO` until full card visual conformance and the rest of its evidence contract pass.

### 9.4 Suspicious-page disposition

- `63.12 — Atlas · Favorites`: fresh readback confirmed desktop/mobile `authenticated-with-items` archetypes plus linked saved-event components using the real `event.real.5459` fixture. No new mutation was applied.
- `63.15 — Atlas · Artifacts`: fresh readback confirmed one real `amber_cosmonaut` artifact and explicit states for all five slots. Slots `02–05` remain reserved because current Astro supplies no canonical artifact payload for them; their content must not be invented.
- `10 — Brand assets`: current page still materializes only runtime wordmark and shell lockup. PWA/campaign/application variants remain outside this checkpoint and are not represented as complete.

Durable receipt: `evidence/recovery-20260828/penpot/recovery-receipt.v1.json`.

### 9.4a `63.15 — Atlas · Artifacts` factual state projection (`OV-06`)

The owner requirement remains authoritative: seven focus-group artifacts must
eventually be shown in none/subset/all-expanded, hover/focus and selected-detail
states. The current source tuple does not yet contain those seven canonical
identities or that interaction model. It contains three distinct inventories
which must not be conflated:

- the Astro Amber collection implements one real `amber_cosmonaut` in five
  slots, with four future slots reserved;
- seven local reference images represent six concepts and are not runtime
  artifacts;
- the separate Focus Lab defines twelve `FG-E01…FG-E12` eggs.

Instead of inventing the missing target, page `63.15` now projects the complete
factual Astro AS-IS behavior through thirteen linked native instances:

- `C01` (`8f804431-c282-8075-8008-8dab3850410e`) — all eight source-defined
  Amber rail presence/lifecycle/motion states, including keyboard focus and
  reduced motion;
- `C02` (`8f804431-c282-8075-8008-8dab9616c32c`) — production unavailable,
  non-production `0 из 5`, and found `1 из 5`;
- `C03` (`8f804431-c282-8075-8008-8dabaafee4c5`) — the actual desktop and
  `390px` mobile selected-detail dialogs for `Янтарный космонавт`.

Fresh readback found `13/13` component-copy instances, `0` detached managed
instances, idempotent reconciliation `created=0`, and
`currentFile.validate()=[]`. Named version:
`Recovery 2026-08-28 · OV-06 factual Astro AS-IS artifact states · 13 linked`.
The bounded `C01` PNG export returned external Penpot HTTP `504` and was not
blindly retried. The plugin API did not expose the post-write file revision, so
the receipt records it as unknown rather than fabricating a number.

Contract:
`catalog/reconstruction-atlas/v1/artifacts-astro-as-is-owner-projection.v1.json`.
Receipt:
`evidence/recovery-20260828/penpot/artifacts-astro-as-is-owner-projection-receipt.v1.json`.

`OV-06` advances from a blank blocker to `PARTIAL_AS_IS_PROJECTION`, but remains
`processed: NO` and not ready for owner rereview. Closure still requires an
authoritative seven-item identity contract plus the owner-required expanded
state model in Astro/UI SoT before a new native component can be certified.

## 10. Owner correction: Interest-club card visual authority — 2026-08-28

Status: `SUPERSEDES §9.3 VISUAL INTERPRETATION / PARTIAL_DURABLE_CHECKPOINT`.

The first revision of §9.3 fixed fixture identity but retained a compressed white five-node card. The owner correctly rejected that result: it did not represent the actual `InterestClubCard.astro` surface. This entry supersedes that visual interpretation while preserving the source-backed three-fixture census.

Fresh Astro browser evidence at `events-bot-new@8710e56fa3685f6c30a90cd062d532dce0348cce` established the actual card contract:

- desktop card: `375.75 × 544`, radius `28`;
- mobile card: `366 × 448`, radius `22`;
- dark cover/fallback surface with media veil;
- `Game Vibes` uses reviewed cover media from `event.real.2897` and the conditional `Ближайших встреч: 1` badge;
- the other two fixtures use the deterministic dark fallback, not invented photos;
- required visible anatomy: topic, title, full description, `Активность`, `Наблюдаем`, and `Подробнее →`.

The lowest native main `d87e18f1-dcb4-80a6-8008-88648ab79ab4` / component `d87e18f1-dcb4-80a6-8008-88648c204cec` was rebuilt to that anatomy. All three desktop and all three mobile consumers remain component-copy instances; each has `18` descendants and an exact Git source binding. Desktop and mobile page compositions were resized to the real card geometry, and the footer/navigation were moved below the complete lists.

Post-reopen readback at Penpot revision `2613` found:

- `3` linked desktop cards and `3` linked mobile cards;
- `0` detached card roots;
- `0` fabricated-text hits;
- exact fixture descriptions and observed ranges for all three clubs;
- hidden future-meeting badge on the two fixtures with `future_meeting_count=0`;
- `currentFile.validate()=[]`.

Evidence:

- Astro computed geometry: `evidence/recovery-20260828/astro/interest-club-card-computed.v1.json`;
- Astro focused card captures: `evidence/recovery-20260828/astro/interest-club-card-game-vibes-desktop.png` and `...-mobile.png`;
- Penpot focused exports: `evidence/recovery-20260828/penpot/interest-clubs-game-vibes-card-v2.png` and `interest-clubs-desktop-list-v2.png`;
- receipt: `evidence/recovery-20260828/penpot/recovery-receipt.v1.json`.

`OV-40` remains `processed: NO` because the broader owner backlog and release gate are still open; this status does not invalidate the corrected card parity proven above.

## 11. History-wide IdeaHub voice correction — 2026-08-28

Status: `INTAKE_CORRECTED / PRODUCT_BACKLOG_OPEN`.

The earlier claim that all relevant IdeaHub voice feedback had been covered was
wrong. A fresh `git fetch --all --prune --tags` followed by a directory-history
walk across every fetched ref found `27` commits touching
`inbox/voice/2026/08` and `23` packet files. Two packets are relevant to this
design-system contour; `21` were read and excluded as tests, accidental audio,
IdeaHub/MCP, lecture, business-diagram or other-project work.

The previously registered packet remains:

- `voice-20260828-114654-2c907d62` — existing `OV-08`, `OV-30`, `OV-33`,
  `OV-42`, `OV-45…OV-49` clarification/supersession evidence.

The omitted earlier packet is:

- `voice-20260828-112125-6de734d5` — Home HeroTalk, Home/Date/Weekend
  event-card lineage, Branding completeness, Weekend time-marker background
  and Weekend Discovery rail Floating Island.

Deduplication retained existing `OV-04`, `OV-05`, `OV-08` and `OV-30`, and
created three genuinely new items:

- `OV-50` — `63.01 Home` must implement the real HeroTalk `Photo Mosaic`
  product mechanism; the current static `HomeHeroTalk.astro` event-feature
  skeleton and current Penpot Astro-AS-IS main do not close it;
- `OV-51` — `61.3 Weekend Time marker` must not have an opaque page-local
  background. Current Astro CSS declares the time rail background transparent.
  At Penpot revision `2614`, the only opaque fill was removed from
  `C01 · Weekend time marker 12:00 · exact review`; reopen readback found zero
  root fills and the exact Astro binding, `validate()=[]`, and focused export
  `evidence/recovery-20260828/penpot/weekend-time-marker-transparent.png`
  (`120×89`, `4,561` bytes, SHA-256
  `7c0f87d4ab546b73d97596565044bb1ff64ccebe6b8c1c483152e29a35288e8b`).
  It is `READY_FOR_OWNER_REREVIEW` but remains `processed: NO`; global ancestry
  is still governed by `OV-08`/`OV-30`;
- `OV-52` — `61.10 Weekend Discovery rail exact` must become a content-sized
  transparent Floating Island. The shared Astro/UI owner is now
  `ListingDiscoveryRail@6` in Draft PR `events-bot-new#596` (commits
  `95db01388`, `59fc98031`): the outer sticky plane remains transparent while
  the inner island is content-sized, and the shared component retains an
  explicit `plane` surface for Date and Popular. Browser readback at
  `/vyhodnye/` (`1440×1000`) measured a transparent `1440×52` outer plane, a
  `1188.734375×52` inner island and `0 px` overlap. Penpot revision `2621`
  contains native v6 component `c0b867fa-32d2-8062-8008-8d679ca1da53`, native
  main `c0b867fa-32d2-8062-8008-8d6799e9e61f` and linked copy
  `c0b867fa-32d2-8062-8008-8d679cafd229`; v5 is retained as deprecated and
  bound to the replacement. Reopen readback found the exact Git contract and
  `validate()=[]`. Focused exports are
  `evidence/recovery-20260828/penpot/weekend-discovery-rail-v6.png` and
  `evidence/recovery-20260828/astro/weekend-discovery-rail-v6.{png,json}`.
  It is `READY_FOR_OWNER_REREVIEW`, still `processed: NO`.

The exact transcript, every-version history, complete exclusion census and new
cursor are recorded in
[`idea-hub-owner-voice-intake-20260828.md`](idea-hub-owner-voice-intake-20260828.md).
None of `OV-50…OV-52` is `processed: YES`, and no previous Home/Weekend evidence
may be used to imply their closure. `OV-51` and `OV-52` have bounded product
evidence and are ready for owner rereview. `OV-50` now also has corrected Astro,
Git SoT and clean linked Penpot materialization/readback evidence. It is ready
for owner rereview and remains open only until that review.


### 9.4b Owner correction — exact seven-artifact Collection 1 (`OV-06`)

Status: `READY_FOR_OWNER_REREVIEW`; `processed: NO`. This section supersedes
§9.4a's stale `1/5` authority conclusion.

The higher-priority owner decision at events-bot-new commit
`f5ea5e497a3c137e350645e0f6c35304853a8908` requires exactly seven prepared
artifacts from `references/artefact-collection-1` and explicitly rejects the
5-slot runtime, 8-item draft and 12 Focus eggs. Astro commit `49c351873d40a2ea55f0a32837c7376e344d9c17` now
contains the exact seven-item registry, all seven source hashes, seven bounded
focus assets and generic local progress/detail behavior. Ordinary production
remains fail-closed. Historical stories are not invented: current copy is
provenance-only pending a separate editorial fact-check.

Page `63.15` now contains seven native component masters and linked boards for
`0/7`, subset `3/7`, all `7/7`, pointer hover, keyboard focus, selected desktop
detail and selected `390px` mobile detail. Each state board has all seven
distinct linked component roots; selected-detail boards add one linked selected
visual. The former `1/5` and Amber-only detail evidence boards remain hidden and
explicitly marked superseded. The existing desktop/mobile collection masters
were corrected in place, so their linked archetype consumers now display all
seven exact reference visuals.

Structural readback and every affected board/page `validate()` returned `[]`.
The corrected desktop archetype export visibly contains seven distinct source
assets. A later focused all-found export returned HTTP 504 only after exact
readback and was not blindly retried. The initially attempted
`penpotUtils.createSavedVersion` utility does not exist; the supported
`currentFile.saveVersion()` method was then used for the overlay-cleanup
checkpoint. No version ID was fabricated.

Owner visual rereview then exposed a second defect: the first correction left
the product archetype as a narrow service rail and an interrupted write left a
blank page-root panel over the real screen. The two page-root orphans were
removed and exact readback proved that no visible orphan remained at `(0,0)`.

The linked desktop collection master was subsequently rebuilt in place from
the actual Astro surface rather than the service rail. A browser-measured
follow-up corrected it to the complete `1180×1174` anatomy: hero eyebrow,
source-sized three-line page title, explanatory lead with a 19px structural
gap, device-local state notice, `Найдено 7 из 7`, and seven found cards in the
source CSS `4 + 3` grid. Every card retains one linked exact artifact visual.
The owner archetype inherited that master at `1280×1988.390625`; its footer
starts at the Astro-measured `y=1306.53125`, after the complete collection
rather than at the former `538px` rail boundary.
Exact readback found seven distinct linked artifact component IDs, zero
detached roots, zero visible page-root orphans and `currentFile.validate()=[]`.

This correction also records the owner's clarified visual precedence:
`events-bot-new@008839b14598105d1fed5b4e386d6d6f29d93d1f` is the primary
pre-presentation visual donor. Later commits may change that base only as
source-proven corrections; the exact-seven owner decision remains such a
correction. The mobile master was expanded into the source single-column flow
using the existing seven linked visuals. After Penpot reconnected, exact
readback proved that the interrupted old-brick write had already completed:
all seven distinct artifact component IDs were present and `detached=0`. The
mobile owner was then expanded from the stale clipped `390×1200` viewport to a
full `390×2008` composition containing the linked `366×1860` body and linked
bottom navigation. A named full desktop/mobile version was saved, and settled
readback again returned `currentFile.validate()=[]`. The subsequent focused
mobile PNG export returned external HTTP 504; it was not retried because the
native structural and owner-visible composition was already durable.

Contract: `catalog/reconstruction-atlas/v1/artifact-collection-1-owner-exact-seven.v1.json`.
Receipt: `evidence/recovery-20260828/penpot/artifact-collection-1-owner-exact-seven-receipt.v1.json`.

### 9.4c Concrete Free collection (`OV-44`)

Status: `STRUCTURAL_CORRECTION_VERIFIED / VISUAL_EXPORT_BLOCKED`;
`processed: NO`.

Page `63.08` no longer uses the `/podborki/` navigation catalog as its product
owner. Desktop and mobile owners now link the exact
`/podborki/besplatnye-sobytiya/` composition: the large source medallion,
source hero copy, `23 событий`, three representative real large EventCards and
the responsive shell. Separate desktop/mobile native states preserve the
compact `scroll=hero-passed` identity instead of showing the large and compact
medallions simultaneously.

The six exact-data adapters bind real fixtures `7030`, `6947` and `7006` to the
certified desktop/mobile EventCard templates. Bounded readback verified every
title, type, occurrence, price and place, native image data capability, six
linked adapter roots, zero detached adapter roots and
`currentFile.validate()=[]`. A second materializer run created zero adapters,
body components or sticky states. The desktop owner rerun returned HTTP 504;
settled exact readback proved the expected two direct linked regions and clean
validation, so no blind retry was performed. The mobile rerun returned cleanly.

Named version `OV44 collections · real Free collection desktop mobile` was
saved at revision `2703`. The subsequent bounded desktop owner PNG export still
returned external HTTP 504. Therefore this checkpoint does **not** claim visual
acceptance or `CORRECTIONS_VERIFIED`; it is awaiting direct owner rereview in
Penpot. Dense `23 + 14` list stress remains generated and tested in Astro rather
than duplicated by hand in Penpot.

Contract: `catalog/reconstruction-atlas/v1/collection-free-ov44-owner-exact.v1.json`.
Receipt: `evidence/recovery-20260828/penpot/collection-free-ov44-owner-exact-receipt.v1.json`.

### 9.4d Event detail source overlap and states (`OV-45`)

Status: `STRUCTURAL_CORRECTION_VERIFIED / VISUAL_EXPORT_BLOCKED`;
`processed: NO`.

The former desktop Event detail owner stacked its title panel after the hero.
That composition did not match Astro and is superseded. Browser evidence from
real fixture `5459` now drives the native owner: its hero is `1280×843` at
`y=57`, while the `783.1875×449.46875` summary begins at `y=660`. The resulting
`240px` overlap exposes the full source headline on the first `1280×900`
viewport. The source action panel, `+3 фото` companion board, description and
practical section were moved to their measured positions without detaching any
of the seven direct linked regions. Exact readback returned
`currentFile.validate()=[]`.

Two further real Astro fixtures close the states omitted by the old board:

- `5757` supplies the centered `94.71875px` top medallion and links the existing
  native `dramteatr39` artwork component;
- `5511` supplies the compact `Другие даты (2) ↓` summary and the three-row
  practical occurrence matrix (`24 июля`, `25 июля`, `27 сентября`).

Those states are native components collected by a fourth native source-state
board with three linked instances. A second materializer pass returned
`existing:true` for all four components and created nothing. Named version
`OV45 event detail · Astro overlap medallion occurrences` was saved at revision
`2715`.

Penpot's current plugin validation rejected Astro's negative `-2.2176px`
headline letter spacing. The materializer therefore keeps the exact measured
headline box and records the source value in the contract, but uses the nearest
accepted native spacing (`0`) instead of aborting the write. The bounded owner
PNG export then returned external HTTP 504. It was not blindly retried, and the
state-board export was not attempted after that exporter failure. Consequently
this checkpoint claims native/readback parity, **not** visual acceptance; direct
owner rereview in Penpot is still required.

Contract: `catalog/reconstruction-atlas/v1/event-detail-ov45-owner-exact.v1.json`.
Receipt: `evidence/recovery-20260828/penpot/event-detail-ov45-owner-exact-receipt.v1.json`.

### 9.4e Event detail mobile production surface (`OV-46`)

Status: `FOCUSED_VISUAL_QA_PASS / OWNER_REREVIEW_REQUIRED`;
`processed: NO`.

The vague mobile defect report is now anchored to the actual production route,
not inferred from the desktop composition. At `390×844`, fixture `5459` uses
the `accepted-v8` mobile surface: a `390×551.484375` authored poster, the
`366×422.59375` decision card overlapping it at `y=529.890625`, the complete
three-row action/meta structure, source medallions, full description, `Коротко`
facts and source gate. The browser document has zero horizontal overflow.

The existing Penpot owner was corrected in place. Its linked hero, summary,
identity/description, transparent header and bottom-navigation ancestry are
preserved. The missing `Коротко` facts and source gate were added as native
editable shapes; the owner now continues through that gate instead of clipping
inside the description. A second facts pass returned `existing:true`, the
second owner pass changed no identities, and `currentFile.validate()=[]`.

Visual QA was not treated as optional. The first full-owner export exposed a
real z-order defect: the dark action surface covered the orange primary CTA.
The CTA and its label were reordered above that surface. The final focused
`366×430` export visibly contains `Купить билет`, calendar, share/`13`,
like/`164`, weekday, date and venue, and passed review against the saved Astro
top capture. Named version `OV46 event detail · mobile source exact final` was
saved at revision `2720`. This is focused visual QA, not owner acceptance; the
item remains `processed: NO` until direct rereview.

Contract: `catalog/reconstruction-atlas/v1/event-detail-ov46-mobile-owner-exact.v1.json`.
Receipt: `evidence/recovery-20260828/penpot/event-detail-ov46-mobile-owner-exact-receipt.v1.json`.

### 9.2b Mobile rail media correction (`OV-02`)

Status: `READY_FOR_OWNER_REREVIEW`; `processed: NO`. This correction supersedes
the earlier assertion that both `6936` and `6652` must be `75×112 contain`.
Real-data Astro fixture/browser readback at `49c351873d40a2ea55f0a32837c7376e344d9c17` proves:

- `5374`: `140×112 cover`, safe visual;
- `6936`: `75×112 contain`, protected authored geometry;
- `6652`: `140×112 cover`, explicit source-reviewed safe override.

Penpot now has the native authored-contain master
`8f804431-c282-8075-8008-8db194fb8344`. Row `6936` links to it at `75×112`;
row `6652` links to canonical cover `a21f0524-f565-8038-8008-787378260237` at
`140×112`. Exact readback and `validate()=[]` pass. Receipt:
`evidence/recovery-20260828/penpot/mobile-rail-media-parity-receipt.v1.json`.

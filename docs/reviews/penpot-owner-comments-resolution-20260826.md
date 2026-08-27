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

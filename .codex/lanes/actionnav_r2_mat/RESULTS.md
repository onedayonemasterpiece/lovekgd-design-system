# Lane actionnav_r2_mat Results

## Status

committed

Terminal recommendation: `MAT_ACTION_NAV_ATLAS_R2_REBIND_READY`

## Requirement IDs

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| R01 | Pin exact Atlas R2 head/tree | Done | Adapter and launcher pin `663be702d481972cb2e8863af500f1c35dda1d8c` / `cf9a1e6a5e0a84aea5636334dbd3be4961039b75`; Python readback verifies the commit tree and four Atlas blobs. |
| R02 | Rebind ActionNav to `FOUNDATION_ASSET_GRID_DENSE_V2` | Done | Adapter, layout contract, payload, and terminal readback use the R2 DENSE template. |
| R03 | Use linked `ATLAS_PAGE_HEADER_V2` | Done | Payload discovers the central Documentation/PageHeader component, replaces only the legacy documentation child, and verifies a linked instance plus all nine stable semantic fields. |
| R04 | Apply exact R2 root/row/grid formulas | Done | `2176×944`; 6 columns; 3 rows; 256 cell width; 192 bounded cell height; 24 column/row gaps; 16 padding; 624 grid height. |
| R05 | Discover partial by package namespace and semantic stable IDs | Done | Page lookup uses `kenigevents-action-nav-r5/package-id`; root lookup uses `stable-id=root`; display name is not a locator. |
| R06 | Preserve page/root/imported SVG IDs and avoid page/root creation for a partial | Done | Native-like R1→R2 test captures and compares identities and asserts `pageCreates=0`, `boardCreates=0`. |
| R07 | Allow documentation relayout but forbid internal SVG geometry changes | Done | Only root/slot/master/specimen placement and linked header documentation change; physical identity/content/size/child geometry read back unchanged. |
| R08 | Protect Free/EventCard and Foundations source/index | Done | Exact prewrite projections remain `0b0010…c042` and `1b119d…da1fa`; byte-for-byte native-like projections are unchanged through migration/replay. |
| R09 | Preserve strict `String(asset-bytes)` contract | Done | Executor writes and validates decimal strings; native-like mock rejects numeric plugin data and reads all nine exact strings. |
| R10 | Terminal 8 components / 18 linked specimens, detached=0, screenshots=0 | Done | Terminal readback and tests assert all censuses and `validation=[]`. |
| R11 | Replay `created=0` and no duplicate page/root | Done | Every native-like terminal run is replayed; duplicate package page/root negative tests fail before create calls. |
| R12 | No Penpot authorization or launch | Done | Git-only lane; adapter state is `...NOT_LAUNCHED`, setup reports zero Penpot mutations and `penpotAuthorization=false`. |
| R13 | Deterministic regeneration/readback | Done | JSON tests regenerate both package-local JSON files byte-identically; terminal replay verifies the same DENSE layout and zero creations. |
| R14 | One-package successor from exact base | Done | Only ActionNav R2 successor executor/launcher, adapter, layout contract, package-local tests, and this receipt are added; R1 and other package files are untouched. |

## Execution mode

Single `worktree_worker` lane. No subagents were used because the parent assigned this lane as the sole writable owner and all changes are tightly coupled through executor hashes and one adapter.

## Branch

`agent/action-nav-atlas-r2-rebind/mat-20260901`

## Worktree

`/home/dev/.codex/worktrees/lovekgd-design-system/action-nav-atlas-r2-rebind`

## Base SHA

`5d44725c33cb3a4c776ef917e6ac7b9f1f36d545`

## Head SHA

`SELF` — the one direct successor commit containing this receipt; resolve with `git rev-parse HEAD` after commit.

## Files changed

- `.codex/lanes/actionnav_r2_mat/RESULTS.md`
- `catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair/F-ACTION-NAV-ICONS.adapter.v2.json`
- `catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair/F-ACTION-NAV-ICONS.layout-contract.v2.json`
- `scripts/asp-production-conveyor-v3/d0/mat/action_nav_atlas_r2_rebind_payload_v2.js`
- `scripts/asp-production-conveyor-v3/d0/mat/action_nav_atlas_r2_rebind_v2.js`
- `tests/asp-production-conveyor-v3/d0/mat/action_nav_atlas_r2_binding_v2_test.py`
- `tests/asp-production-conveyor-v3/d0/mat/action_nav_atlas_r2_rebind_v2.test.js`

## Commands run

- Fresh-read GitHub issue comments `5495279902`, `5495280133`, `5495280392`, `5495280617` with `gh api`.
- Read immutable normative contract from `7607143afc240b9f96abd51270ab82735aabf9bc`.
- Read Atlas R2 files directly from `663be702d481972cb2e8863af500f1c35dda1d8c` and original package bytes from `fecb90c6b1c475687d77b8cce4c905d932a0bf23`.
- `node --check` for both R2 scripts and the R2 native-like test.
- `node --test tests/asp-production-conveyor-v3/d0/mat/*.test.js`.
- `python3 -m unittest discover -s tests/asp-production-conveyor-v3/d0/mat -p '*_test.py'`.
- `python3 tests/asp_production_conveyor_v3_atlas_layout_test.py`.
- `python3 -m json.tool` for both R2 JSON files.
- `git diff --check`.

## Tests / verification

- D0/MAT Node suite: **29/29 PASS** (includes R2 **5/5 PASS** and frozen ActionNav R1 **9/9 PASS**).
- D0/MAT Python suite: **11/11 PASS** (includes R2 binding **5/5 PASS**).
- Frozen Atlas R1 regression: **9/9 PASS**.
- JavaScript syntax: **PASS**.
- JSON parse and byte-deterministic regeneration: **PASS**.
- Git diff check: **PASS**.
- No Penpot reads, writes, launch, polling, producer, PUBLISH, or authorization occurred.

## Risks

- Native Penpot execution and export are intentionally not performed or authorized in this lane. PUBLISH must supply the central linked `ATLAS_PAGE_HEADER_V2` component and perform native readback/export; V0 remains responsible for visual acceptance.
- The successor accepts the prior R1 physical proof ledger only after recomputing every current component proof against it. A partial without either an R1 or R2 physical proof fails closed.

## Merge notes

- This is one fast-forward successor from the exact requested base.
- Do not merge the dirty preserved `d0-atlas-mat` worktree.
- Do not push from this lane; the root integrator owns remote publication.

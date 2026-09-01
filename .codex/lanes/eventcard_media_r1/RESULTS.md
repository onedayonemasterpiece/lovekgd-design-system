# Lane eventcard_media_r1 Results

## Status
committed

## Requirement IDs
- R01 — exact immutable source/receipt/contract verification
- R02 — frozen manifest and deterministic package
- R03 — concrete media-fill-only native repair executor
- R04 — exact A/B/C/D, contain/cover/crop/focal semantics
- R05 — non-occlusion readback plus unknown-outcome fail-closed rollback
- R06 — deterministic, stable-ID, protected Free collection regression tests
- R07 — `ASP_BUILD_REQUEST_V2` artifact and commands
- R08 — `MAT_PACKAGE_READY_QA_INTEGRATE_GATED`; `penpot_execution_authorized=false`
- R09 — one clean Git commit, no Penpot operation and no push

## Branch
`agent/mat-eventcard-media-coverage-repair-r1-20260901`

## Worktree
`/home/dev/.codex/worktrees/lovekgd-design-system/eventcard-media-r1`

## Base SHA
`c25b62aa743341f96472223c09a9dd4d43cadc65`

## Head SHA
The single commit containing this file; resolve with `git rev-parse HEAD` after commit.

## Files changed
- `.codex/lanes/eventcard_media_r1/RESULTS.md`
- `catalog/asp-production-conveyor-v3/mat/eventcard-media-r1/ASP_BUILD_REQUEST_V2.json`
- `catalog/asp-production-conveyor-v3/mat/eventcard-media-r1/MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1.manifest.v1.json`
- `catalog/asp-production-conveyor-v3/mat/eventcard-media-r1/MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1.package.v1.json`
- `scripts/asp-production-conveyor-v3/mat/eventcard-media-r1/compile_eventcard_media_repair.py`
- `scripts/asp-production-conveyor-v3/mat/eventcard-media-r1/eventcard_media_repair_v1.js`
- `tests/asp-production-conveyor-v3/mat/eventcard-media-r1/eventcard_media_repair_v1.test.js`
- `tests/asp-production-conveyor-v3/mat/eventcard-media-r1/test_eventcard_media_package.py`

## Commands run
- `gh api repos/onedayonemasterpiece/lovekgd-design-system/issues/comments/<authoritative-comment-id>` for issue #57 comments `5492836757`, `5492836947`, `5481226456`, `5481227585`, `5481311765`, `5481337267`, `5481357733`, `5481616026`
- exact `git show`, `git rev-parse`, `git cat-file -s`, and SHA-256 checks for both immutable package inputs and conformance commit `7607143...`
- `python3 scripts/asp-production-conveyor-v3/mat/eventcard-media-r1/compile_eventcard_media_repair.py --repo . --check`
- `python3 -m unittest tests/asp-production-conveyor-v3/mat/eventcard-media-r1/test_eventcard_media_package.py`
- `node --test tests/asp-production-conveyor-v3/mat/eventcard-media-r1/eventcard_media_repair_v1.test.js`
- `node --check` for executor and harness
- `python3 -m py_compile` for compiler and Python tests (generated caches removed before commit)
- `git diff --check`

## Tests / verification
- Immutable media input: head `9b63c901...`, tree `2609ef4...`, blob `381a900...`, 6832 bytes, SHA-256 `7b1bb205...`: PASS.
- Immutable four-case input: head `c2d6ff10...`, tree `ddff285e...`, blob `6496f9fd...`, 20051 bytes, SHA-256 `bf259348...`: PASS.
- Immutable conformance bytes at `7607143...`: SHA-256 `75c70629...`: PASS.
- Python package/regeneration suite: **8/8 PASS**.
- Node strict native-like executor suite: **7/7 PASS**.
- A/B/C/D exact operation/order matrix and smallest common passing construction selection: PASS.
- Unknown probe outcome and no-common-construction stop before accepted-root mutation: PASS.
- Opaque overlay post-readback causes atomic rollback: PASS.
- Exact contain and centered horizontal cover crop/focal semantics: PASS.
- Four root IDs and four media shape IDs remain stable; text and `LibraryComponent.path` projections unchanged: PASS.
- Protected Free collection remains one exact root, 18 children, 18 components: PASS.
- Second replay performs zero probes and zero accepted-root mutations: PASS.
- Penpot reads/mutations, D0 polling/goals, PUBLISH calls, producer changes and Atlas changes: **0**.

## Requirement closure
| ID | Status | Evidence |
|---|---|---|
| R01 | Done | Compiler and tests verify exact heads, trees, blobs, byte counts and SHA-256 values. |
| R02 | Done | Frozen manifest plus canonical JSON compiler and byte-identical `--check`. |
| R03 | Done | Injected-native-adapter executor performs isolated proof then in-place fill-only atomic repair. |
| R04 | Done | Exact four variant operations and two factual rasters; contain/cover/crop/focal assertions. |
| R05 | Done | Required known readback fields, zero uncovered pixels/opaque overlays, rollback on any exception. |
| R06 | Done | 15 focused tests cover deterministic regeneration, stable IDs, Free collection and replay. |
| R07 | Done | Non-authorizing `ASP_BUILD_REQUEST_V2.json` freezes QA/INTEGRATE checks. |
| R08 | Done | Manifest, package and request all carry the required gated state and false authorization. |
| R09 | Done | Only lane-owned paths changed; single local commit; no push. |

## Risks
- This Git-only MAT package intentionally contains no live native outcome and makes no visual-PASS claim. A separately authorized `/root/publish_r2` execution must inject the native adapter and exact active run lease after QA and INTEGRATE acceptance.
- `C_direct_native_fill` wins only in the strict harness. Live A/B/C/D outcomes are mandatory and unknown/missing readback stops without accepted-root mutation; the executor never preclaims that C will win natively.
- V0 must still review fresh isolated/full-root exports before any visual acceptance.

## Merge notes
- Cherry-pick the single lane commit only after confirming the package stays `MAT_PACKAGE_READY_QA_INTEGRATE_GATED` and non-authorizing.
- Terminal recommendation: **QA_INTEGRATE_ACCEPT_AND_CHERRY_PICK; DO_NOT_PUBLISH FROM THIS PACKAGE**.

# Lane eventcard_paths_r1 Results

## Status
committed-ready-for-QA/INTEGRATE handoff; final package state `MAT_PACKAGE_READY_QA_INTEGRATE_GATED`

## Requirement IDs
- R01: exact base, branch, isolated worktree, and writable-path boundary
- R02: immutable conformance contract and exact U0 input tuples
- R03: issue-tip and authoritative component-path receipt readback
- R04: concrete native in-place `LibraryComponent.path` executor
- R05: preserve component, main, and linked-instance IDs; no detach/recreate
- R06: exact component leaf/main name guards and canonical non-empty paths
- R07: ID-based proxy comparison, including linked event-type lineage
- R08: fail-closed unknown-outcome stop/readback contract
- R09: protected Free collection and zero text/media/geometry/visibility changes
- R10: frozen manifest/package and `ASP_BUILD_REQUEST_V2` artifact
- R11: deterministic regeneration and strict native-like harness
- R12: `penpot_execution_authorized=false`, no Penpot calls, no publication

## Branch
`agent/mat-eventcard-native-component-paths-repair-r1-20260901`

## Worktree
`/home/dev/.codex/worktrees/lovekgd-design-system/eventcard-component-paths-r1`

## Base SHA
`c25b62aa743341f96472223c09a9dd4d43cadc65`

## Head SHA
The single commit at this branch tip; exact SHA and tree are reported in the terminal handoff because a commit cannot contain its own SHA.

## Execution mode
Serial worker in the already assigned isolated lane. No subagents were used: all requested writes share one tightly coupled package/executor/harness and the parent explicitly assigned sole ownership.

## Interpretation applied
The immutable U0 input and comment `5480764395` authorize only native `LibraryComponent.path` writes. Component leaf names and `main.name` are exact immutable pre/post guards with **zero name changes**. Comment `5483393557` is used only for the stable-ID proxy and slash-duplication safety invariant; no ActionNav package, path, run, or product input is consumed.

## Files changed
- `catalog/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-REPAIR-R1.package.v1.json`
- `catalog/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/ASP_BUILD_REQUEST_V2.eventcard-native-component-paths-r1.json`
- `catalog/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/manifest.v1.json`
- `scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/eventcard_component_paths_native_executor_r1.js`
- `scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/build_eventcard_component_paths_r1.py`
- `tests/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/test_eventcard_component_paths_native_executor_r1.js`
- `tests/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/test_regeneration.py`
- `.codex/lanes/eventcard_paths_r1/RESULTS.md`

## Commands run
- `git show 7607143...:docs/product-governance/astro-sot-penpot-conformance.md` plus exact SHA-256 verification
- `gh api repos/onedayonemasterpiece/lovekgd-design-system/issues/57/comments --paginate` and fresh extraction of comments `5480764395`, `5481226456`, `5481227585`, `5481311765`, `5481337267`, `5481616026`, `5483393557`, `5492836757`, `5492836947`
- exact `git show`, tree/blob/byte/SHA-256 verification of both immutable U0 inputs
- deterministic package regeneration in `--write` and `--check` modes
- JavaScript syntax, focused native-like harness, focused Python regeneration tests, existing coverage/Atlas regression suites, and `git diff --check`

## Tests / verification
- `node --check .../eventcard_component_paths_native_executor_r1.js` — PASS
- `node tests/.../test_eventcard_component_paths_native_executor_r1.js` — `MAT_EVENTCARD_COMPONENT_PATHS_R1_NATIVE_HARNESS_PASS`
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest tests/.../test_regeneration.py` — 2/2 PASS
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest tests/asp_production_conveyor_v3_coverage_matrix_test.py tests/asp_production_conveyor_v3_atlas_layout_test.py` — 20/20 PASS
- deterministic immutable-input re-read and generated-byte check — PASS
- no `__pycache__` or `.pyc` — PASS
- no Penpot reads or mutations; no push — PASS

The strict harness proves: exact 15-empty/3-known-legacy starting state; six bounded 3-path batches; 18/18 canonical non-empty paths; distinct same-ID proxies accepted and wrong-ID event-type proxies rejected; all component/main/26 linked-instance IDs preserved; main/leaf names unchanged; protected Free collection projection unchanged; wrong nonblank paths, name drift, second Free root, cancellation, and missing authorization stop before writes; save timeout and mid-batch cancellation return `STOP_UNKNOWN_OUTCOME_READBACK_REQUIRED`; checkpoint recovery and terminal idempotent replay perform zero additional path writes.

## Risks
- This is an inert Git package, not a live Penpot result. `penpot_execution_authorized=false`; MAT performed zero Penpot calls.
- The fourteen leaf UUIDs are not invented because no authoritative input receipt provides them. The executor resolves them through exact persisted semantic marker/payload/component-plugin IDs, captures their actual component/main IDs, and compares those IDs pre/post. The four durable case component/main UUID pairs are pinned exactly.
- D0/QA and D0/INTEGRATE must review exact bytes. A later sole-writer execution requires a separate exact ACTIVE package/run/lease/cancel authorization and a fresh read-only protected-projection digest.
- A path readback alone is not visual PASS or owner-review acceptance.

## Merge notes
Cherry-pick the single lane commit only. Do not widen it with ActionNav, text, media, Atlas, producer, or publication changes. Terminal recommendation: `QA_AND_INTEGRATE_REVIEW_EXACT_BYTES; THEN D0/PUBLISH MAY ISSUE A SEPARATE AUTHORIZATION AND MUST READ BACK BEFORE EACH RESUME`.

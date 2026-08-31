# Lane f-action-nav-icons-r5 Results

## Status
R5.2 immutable repair package ready for recovered QA and INTEGRATE; Penpot mutations: 0.

## Requirement IDs
- R01 preserve exact R5.1 SVG/component/instance source data
- R02 pin exact rev113 Free and Foundations source/index projections
- R03 use exact current target page and root names
- R04 preserve stable-ID proxy, component naming, run/lease/cancel, max-three, undo/async, export/readback and idempotency gates
- R05 freeze package/setup/executor/test identities and publish remote-verifiable handoff

## Branch
`agent/f-action-nav-icons-r5/mat`

## Base SHA
`645b9716e7b4dc197133b08c601b187e79d32daa`

## Head SHA
Resolved by the immutable R5.2 commit and remote readback; no value is self-asserted here.

## Files changed
- `catalog/asp-production-conveyor-v3/f0/F-ACTION-NAV-ICONS.package.v5.json`
- `scripts/asp-production-conveyor-v3/f0/action_nav_icons_native_executor_v5.js`
- `scripts/asp-production-conveyor-v3/f0/action_nav_icons_setup_v5.js`
- `tests/asp-production-conveyor-v3/f0/test_action_nav_icons_native_executor_v5.js`
- `.codex/lanes/f-action-nav-icons-r5/RESULTS.md`

## Exact R5.2 contract
- Adapter revision: `R5.2`.
- Target page: `01 · Foundations · Action & navigation icons · Candidate`.
- Target root: `CANDIDATE_BUILD_NOT_ACCEPTED · F-ACTION-NAV-ICONS · current-target`.
- Free projection: `84033 chars / 84034 UTF-8 bytes / 0b00102e348367601fe35de30e06dc22b10883577a22917320955058115fc042`.
- Foundations source/index projection: `43736 chars / 43746 UTF-8 bytes / 1b119d154376505b8d28036cbf33e97f9009a007bf0a5a5765de2750644da1fa`.
- Rejected scalar encoding: `43734 / 43744 / 523e43cfe95df7962f8034c4dc2e9f04f02114b15ad488587c707e35b6fed8f1`.
- Foundations source/index remains exactly 37 linked placements and is never mutated.

## Commands run
- `node tests/asp-production-conveyor-v3/f0/test_action_nav_icons_native_executor_v5.js`
- `node --check scripts/asp-production-conveyor-v3/f0/action_nav_icons_native_executor_v5.js`
- `node --check scripts/asp-production-conveyor-v3/f0/action_nav_icons_setup_v5.js`
- `python3 tests/asp-production-conveyor-v3/f0/test_action_nav_icons_candidate_v4.py`
- `python3 scripts/asp-production-conveyor-v3/f0/materialize_action_nav_icons_v4.py plan --candidate-commit 62deac3e1276e5a92b79ab4b6512e4489202719b`
- deterministic Git diff/check and remote Git/GitHub blob readback

## Tests / verification
- R5.2 native safety suite: `F0_ACTION_NAV_NATIVE_EXECUTOR_V5_TEST_PASS`.
- R4 source suite: 5/5 PASS.
- R4 deterministic source regeneration/plan: `F0_ACTION_NAV_V4_PLAN_PASS`.
- Node syntax: PASS for executor and setup.
- Nine exact SVG physical bytes equal embedded bytes, Git blob SHA-1, SHA-256 and byte counts.
- Exact expected terminal census: 1 root, 8 registered native linked components, 18 linked instances, detached 0, screenshots 0, managed nodes 27, validation `[]`, non-empty root export, second-run created 0.
- Stale-but-well-formed package and executor receipt hashes fail before any write.
- Distinct same-ID Penpot proxies pass; wrong persisted component IDs fail.
- Free, Foundations source/index, all non-target pages and non-managed components remain protected.

## Risks / handoff
- MAT did not mutate Penpot and does not authorize publication.
- Recovered QA `/root/qa_r2` must independently remote-read exact bytes and repeat focused gates.
- INTEGRATE must publish PASS before any recovered writer claim or setup/executor invocation.
- A timeout is an unknown outcome; no retry without native readback.

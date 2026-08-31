# Lane f-action-nav-icons-r5 Results

## Status
R5.1 immutable repair ready

## Requirement IDs
- R01 exact source tuple
- R02 concrete current-file native adapter
- R03 exact candidate page/root
- R04 8 components / 18 linked instances
- R05 nine exact SVG byte variants
- R06 preserve every non-target page/component and protected Free/F0 pages
- R07 exact ACTIVE writer/cancel/provenance guards
- R08 max-three resumability, unknown-outcome recovery, readback, export, idempotency
- R09 bounded three-family page-wave contract
- R10 immutable tests and remote delivery

## Branch
`agent/f-action-nav-icons-r5/mat`

## Worktree
`/home/dev/projects/lovekgd-wt-action-nav-icons-r5`

## Base SHA
`62deac3e1276e5a92b79ab4b6512e4489202719b`

## Head SHA
R5.1 implementation commit: `PENDING_THIS_COMMIT`

## Files changed
- `catalog/asp-production-conveyor-v3/f0/F-ACTION-NAV-ICONS.package.v5.json`
- `scripts/asp-production-conveyor-v3/f0/action_nav_icons_native_executor_v5.js`
- `scripts/asp-production-conveyor-v3/f0/action_nav_icons_setup_v5.js`
- `tests/asp-production-conveyor-v3/f0/test_action_nav_icons_native_executor_v5.js`
- `.codex/lanes/f-action-nav-icons-r5/RESULTS.md`

## Commands run
- `gh api repos/onedayonemasterpiece/lovekgd-design-system/issues/comments/{5481898050,5481901898,5482102342}`
- `python3 tests/asp-production-conveyor-v3/f0/test_action_nav_icons_candidate_v4.py`
- `python3 scripts/asp-production-conveyor-v3/f0/materialize_action_nav_icons_v4.py plan --candidate-commit 62deac3e1276e5a92b79ab4b6512e4489202719b`
- `node tests/asp-production-conveyor-v3/f0/test_action_nav_icons_native_executor_v5.js`
- `node --test`
- `node --check scripts/asp-production-conveyor-v3/f0/action_nav_icons_native_executor_v5.js`
- `git diff --check`

## Tests / verification
- R4 source suite: 5/5 PASS.
- R4 frozen plan: `F0_ACTION_NAV_V4_PLAN_PASS`.
- R5 fake-native executor regression: PASS.
- Repository Node suite: 22/22 PASS.
- Syntax and whitespace checks: PASS.
- Exact nine disk SVG byte/SHA-256/Git-blob/length tuples equal embedded executor bytes.
- R5.1 compares persisted Penpot proxies by stable IDs, accepts distinct same-ID proxies, and rejects wrong component IDs.
- Exact ActionNav ACTIVE run/package/writer/lease/cancel tuple and rev113 Free/F0 frozen projections are pinned; setup is read-only and binds final package/executor SHA-256.
- Component library names are leaf-only with one explicit canonical path; main shape names contain the full path exactly once.
- Cancellation blocks before first write; protected drift blocks with zero writes.
- Every mutating receipt creates at most three managed units; exact stable-ID resume reaches 8 components and 18 linked instances.
- Terminal and second-run receipts preserve stable IDs; second run creates zero and adds no version.

## Risks
- Native Penpot execution/export remains intentionally unperformed by MAT. D0/PUBLISH must execute only after immutable QA and INTEGRATE PASS and must treat timeout as unknown outcome requiring readback before resume.
- The first invocation is an explicitly read-only same-ACTIVE-run protected projection bind; the first mutating invocation creates a non-empty bounded candidate page/root/component batch.

## Merge notes
Cherry-pick the lane head. Do not take the stale R4 published runner tuple; R5 embeds a concrete filesystem-independent Penpot executor and pins the actual R4 runner mismatch as source evidence.

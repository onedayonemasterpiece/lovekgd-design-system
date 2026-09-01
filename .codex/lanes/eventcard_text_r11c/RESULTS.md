# Lane eventcard_text_r11c Results

## Status
committed

## Package / state
- Package: `MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR`
- State: `MAT_PACKAGE_READY_QA_INTEGRATE_GATED`
- `penpot_execution_authorized=false`
- Penpot reads/mutations by this lane: `0/0`

## Requirement IDs
- R01 immutable input and receipt verification
- R02 exact compatible-target derivation
- R03 native repair executor
- R04 fail-closed stop/distinct-readback contract
- R05 post-settlement containment and unchanged census/IDs
- R06 frozen package/manifest
- R07 deterministic regeneration
- R08 strict native-like harness and stable-ID/protected-surface tests
- R09 `ASP_BUILD_REQUEST_V2`
- R10 gated package lifecycle state
- R11 one-commit clean lane closure
- R12 exact Git/test handoff

## Branch
`agent/mat-eventcard-text-r11c-compatible-repair-20260901`

## Worktree
`/home/dev/.codex/worktrees/lovekgd-design-system/eventcard-text-r11c`

## Base SHA
`c25b62aa743341f96472223c09a9dd4d43cadc65`

## Head SHA
The single commit containing this receipt (`git rev-parse HEAD`); exact immutable SHA is reported in the terminal handoff because a commit cannot embed its own SHA without changing it.

## Tree SHA
The tree of the single commit containing this receipt (`git rev-parse HEAD^{tree}`); exact immutable SHA is reported in the terminal handoff because this file is part of that tree.

## Files changed
- `.codex/lanes/eventcard_text_r11c/RESULTS.md`
- `catalog/asp-production-conveyor-v3/mat/eventcard-text-r11c/ASP_BUILD_REQUEST_V2.json`
- `catalog/asp-production-conveyor-v3/mat/eventcard-text-r11c/MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR.package.v1.json`
- `catalog/asp-production-conveyor-v3/mat/eventcard-text-r11c/distinct-later-readback.v1.js`
- `catalog/asp-production-conveyor-v3/mat/eventcard-text-r11c/manifest.v1.json`
- `catalog/asp-production-conveyor-v3/mat/eventcard-text-r11c/native-repair-executor.v1.js`
- `scripts/asp-production-conveyor-v3/mat/eventcard-text-r11c/build_eventcard_text_r11c.py`
- `scripts/asp-production-conveyor-v3/mat/eventcard-text-r11c/executor.template.js`
- `scripts/asp-production-conveyor-v3/mat/eventcard-text-r11c/later-readback.template.js`
- `scripts/asp-production-conveyor-v3/mat/eventcard-text-r11c/native_like_harness.mjs`
- `scripts/asp-production-conveyor-v3/mat/eventcard-text-r11c/repair-spec.source.json`
- `tests/asp-production-conveyor-v3/mat/eventcard-text-r11c/test_eventcard_text_r11c_package.py`
- `tests/asp-production-conveyor-v3/mat/eventcard-text-r11c/test_native_like_harness.mjs`

## Commands run
- Fresh-read GitHub issue #57 comments `5492836757`, `5492836947`, `5481039903`, `5481341474`, `5481765684`, `5481868455`, `5481935473`, `5481940684`, `5482038686`, `5482179657`, `5482210060`, `5482306768`, `5482330877` with `gh api`.
- Verified both immutable input commits/trees/blobs/byte counts/SHA-256 values with `git rev-parse`, `git show`, `wc`, and `sha256sum`.
- Verified conformance contract `7607143afc240b9f96abd51270ab82735aabf9bc` blob/bytes/SHA-256.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/asp-production-conveyor-v3/mat/eventcard-text-r11c/build_eventcard_text_r11c.py --repo . --write`
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/asp-production-conveyor-v3/mat/eventcard-text-r11c/build_eventcard_text_r11c.py --repo . --check`
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests/asp-production-conveyor-v3/mat/eventcard-text-r11c -p 'test_*.py'`
- `node --test tests/asp-production-conveyor-v3/mat/eventcard-text-r11c/test_native_like_harness.mjs`
- `node scripts/asp-production-conveyor-v3/mat/eventcard-text-r11c/native_like_harness.mjs --all`
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p '*test.py'`
- `git diff --check`

## Tests / verification
- Focused Python package suite: `10/10 PASS`.
- Strict native-like Node harness: `9/9 PASS`.
- Repository Python suite: `20/20 PASS`.
- Deterministic generator `--check`: `PASS`.
- Native-like terminal sequence: `MUTATED_PENDING_DISTINCT_LATER_READBACK` → `COMPATIBLE_OCCURRENCE_PEERS_MEASUREMENT_PASS`.
- Exact write set: four occurrence target IDs only.
- Protected set: 16 remaining Free collection offenders unchanged.
- Stable-ID/census, unauthorized, unknown-settlement, protected-tamper, text-ID-tamper, component-ID-tamper, and replay-negative gates: `PASS`.
- `git diff --check`: `PASS`.

## Risks
- No live Penpot read or mutation was performed; native Plugin API execution/readback remains QA/INTEGRATE gated.
- Frozen expected revision is `76`, derived only from durable receipts. Any later native revision must fail closed and requires a new exact integration decision, not an edited/retried executor.
- This package repairs only the four occurrence offenders. The 16 protected text offenders, media defect, and component-path defect remain explicitly outside scope; no whole-EventCard visual PASS is claimed.
- The package intentionally carries no PUBLISH authorization; runtime execution requires separate exact QA and INTEGRATE PASS artifacts and a distinct readback authorization.

## Merge notes
Cherry-pick the lane's one commit only. Do not execute Penpot from this package during merge. Validate exact committed hashes, then keep terminal state `MAT_PACKAGE_READY_QA_INTEGRATE_GATED` until independent QA and same-tuple INTEGRATE acceptance.

## Terminal recommendation
`QA_VALIDATE_EXACT_COMMITTED_BYTES_THEN_INTEGRATE_GATE`; no Penpot execution, PUBLISH, D0 polling, Atlas R2 mutation, media change, component-path change, or product redesign is authorized by this lane.

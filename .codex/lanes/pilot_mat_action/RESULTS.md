# pilot_mat_action results

- Status: PASS
- Base SHA: `e9dcae503996e3ee51ee171c9409019a7bb6ed09`
- Implementation head SHA: `e22ca80589719b5f10dbbe327626ec6f858469a5`
- Branch: `agent/d0-atlas-wave/mat`
- Scope: package-local MAT successor for `F-ACTION-NAV-ICONS R5.2`; no Penpot mutation.

## Result

The immutable physical proof now includes each descendant's native Penpot
`content` field in addition to type, geometry, fills, strokes, and child tree.
This covers Path and Boolean vector content while retaining the self-contained
pure-JS canonical hash. A same-geometry, same-tag path redraw regression proves
the replay fails before any create.

The Action adapter pins the successor executor and launcher identities and
declares the native anatomy projection fields. Existing contracts remain
unchanged: nine embedded assets, eight component masters, 18 linked specimens,
Atlas semantic slots, candidate-root-only containment, geometry epsilon,
maximum three creates per invocation, and terminal replay `created=0`.

## Evidence

- Executor: 48,441 bytes; SHA-256
  `da78e8458fc908da873bddd875f7398a8537b6d5bccb8846b1e50cb484676cfa`;
  Git blob `2530ddf065004ada403c13e52af1a8d67dae4e5a`.
- Launcher: 3,586 bytes; SHA-256
  `46cabd26637afcc4aa9c23033912f4997af592b05c96574f4679ce48b82643ba`;
  Git blob `9facfd2af4790e70962586f57818959b9b0958a0`.

## Commands and tests

- `git fetch origin agent/d0-atlas-wave/mat` — remote and local base both
  `e9dcae503996e3ee51ee171c9409019a7bb6ed09`.
- `node --check scripts/asp-production-conveyor-v3/d0/mat/f0_existing_atlas_layout_repair_payload_v1.js` — PASS.
- `node --check scripts/asp-production-conveyor-v3/d0/mat/f0_existing_atlas_layout_repair_v1.js` — PASS.
- `node --test tests/asp-production-conveyor-v3/d0/mat/action_nav_atlas_layout_creator_v1.test.js` — 8/8 PASS.
- `python3 tests/asp-production-conveyor-v3/d0/mat/f0_existing_atlas_layout_binding_v1_test.py` — 4/4 PASS.
- `python3 -m json.tool catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair/F-ACTION-NAV-ICONS.adapter.v1.json` — PASS.
- `git diff --check` — PASS.

## Changed files

- `catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair/F-ACTION-NAV-ICONS.adapter.v1.json`
- `scripts/asp-production-conveyor-v3/d0/mat/f0_existing_atlas_layout_repair_payload_v1.js`
- `scripts/asp-production-conveyor-v3/d0/mat/f0_existing_atlas_layout_repair_v1.js`
- `tests/asp-production-conveyor-v3/d0/mat/action_nav_atlas_layout_creator_v1.test.js`
- `.codex/lanes/pilot_mat_action/RESULTS.md`

## Risks

- Native Penpot execution was intentionally not performed by MAT. The proof
  relies on the documented Path/Boolean `content` string exposed by the Penpot
  Plugin API; PUBLISH retains responsibility for native runtime readback.
- `content` is deprecated upstream in favor of `d`/`commands`, but remains the
  common exact string property on both Path and Boolean in the adopted API.

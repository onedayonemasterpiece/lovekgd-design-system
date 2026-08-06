# Prototype 002B implementation status

## Implemented

- Current-mirror plugin runtime: `dist/plugin-current.js`.
- Manifest points to the current-mirror runtime.
- Immutable compressed Wave A load corpus: 57 boards.
- Prepared chunked Wave B structural update: 57 boards.
- Staging, mirror verification and best-effort rollback.
- Replace/archive/move/remove/noop policies.
- Native Penpot comment preservation on archived review boards.
- Exact Git SVG and raster ingestion.
- Load/inspect/stage/commit metrics and `CURRENT / STALE / SYNC FAILED`.

## Verified outside Penpot

- Wave A: 36 inline SVG + 11 exact Git SVG + 10 exact images = 57.
- Wave B: 38 inline SVG + 10 exact Git SVG + 9 exact images = 57.
- Wave B delta: 3 removed, 3 added, 44 changed, 53 moved.
- Deterministic generator reproduction: PASS.
- Compressed catalog reconstruction: PASS.
- Four Wave B remote part blob SHAs equal the local generated part SHAs.

## Pending live acceptance

- Wave A import and performance/fidelity review in the owner’s Penpot file.
- Second read-only check returning `CURRENT / 57 noop`.
- Wave B publication after Wave A PASS.
- Native commented-board archive check during Wave B.

The plugin does not create or send test applications in `kgd80bot`; it only reads exact Git assets and writes managed boards/comments metadata inside the currently open Penpot file. The visible `Наталья Лен` message is not test evidence for this prototype.

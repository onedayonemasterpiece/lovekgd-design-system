# d0-mat-brand-v5 results

## Scope and outcome

- Lane: `d0-mat-brand-v5`
- Base SHA (immutable v4): `38ceed766a26a2e45b8628de14f932f8e88c6483`
- Implementation head SHA: `88d06ae22bdbcbf46763bd94293e531794ab74a8`
- Implementation tree SHA: `dda87bf6fd9b83366a6419b046e7882f869f713a`
- Branch: `agent/d0-atlas-wave/brand-v5`
- Result: PASS, pending fresh independent INTEGRATE and QA gates
- Penpot mutation by MAT: none

## Runtime defect closed

The first v4 native call at Penpot revision 114 failed before mutation because plugin globals `TextEncoder`, `crypto`, and `crypto.subtle` are unavailable. V5 replaces those calls with the proven self-contained `f0Utf8` and pure-JS `f0Sha256` implementation. The helper handles strings, canonical objects, typed-array views, source-byte preflight, protected projection digests, and native export digests without Web APIs.

## Requirement evidence

- `BRAND-V5-NO-WEBCRYPTO`: payload contains no `TextEncoder`, `crypto.subtle`, or `globalThis.crypto` dependency.
- `BRAND-V5-PURE-JS-SHA256`: Unicode, long Unicode, and typed-array digest vectors match Node SHA-256 exactly.
- `BRAND-V5-SELF-BINDING`: payload SHA/blob, launcher embedded payload SHA/blob, launcher SHA/blob, adapter binding, and runtime claim adapter SHA are synchronized.
- `BRAND-V5-NEGATIVE-TESTS`: the complete materializer reaches terminal readback/export with both `globalThis.TextEncoder` and `globalThis.crypto` explicitly set to `undefined`.
- `BRAND-V5-V4-GATE-PRESERVATION`: all v4 geometry, Source-A surfaces, desktop lockup height, lease/cancellation, setup, foreign-lineage, protected projection, candidate-root, detached/screenshot, validation, export, and idempotency checks remain passing.

## Exact implementation blobs

| File | Git blob SHA-1 | SHA-256 / note |
|---|---|---|
| `catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair/F-BRANDBOOK-BASELINE.adapter.v1.json` | `d3f7972346f3335930d7c23bfcefb58a7b5d9468` | exact v5 binding |
| `scripts/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_payload_v1.js` | `38b8d7af8d823735c86649e24c739f90107ad794` | SHA-256 `8c48624bb4385e005cb3dbde17d34f8e14af0f4500f1be9cae74455fc6fb65d0`, 33094 bytes |
| `scripts/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.js` | `6e66ae15052a89170fffd1d39a341705ea1568fa` | SHA-256 `c3b43908016dc4dcd010868d30bcef5c0a12c6b2ce7ecc216d924ca1d07de594`, 3343 bytes |
| `tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_binding_v1_test.py` | `c02d7d1485b70de032d9a6e9f30d55a420c2ff9b` | binding/runtime compatibility regression |
| `tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.test.js` | `6f296e10ef534ab8b4a6e8f0dfc517d4b180e48c` | absent-global and preserved v4 regressions |

## Commands and tests

- `node --test tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.test.js` — PASS, 7/7.
- `python3 -m unittest tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_binding_v1_test.py` — PASS, 2/2.
- `python3 -m unittest tests/asp_production_conveyor_v3_atlas_layout_test.py` — PASS, 9/9.
- Direct SHA-256 vectors for empty, ASCII, Unicode/emoji, long Unicode, and typed bytes — PASS against `node:crypto`.
- `node --check` for payload, launcher, and JS test — PASS.
- Independent manifest byte/SHA/blob readback and `git diff --check` — PASS.

## Changed files

1. `catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair/F-BRANDBOOK-BASELINE.adapter.v1.json`
2. `scripts/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_payload_v1.js`
3. `scripts/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.js`
4. `tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_binding_v1_test.py`
5. `tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.test.js`
6. `.codex/lanes/d0-mat-brand-v5/RESULTS.md`

## Risks and handoff

- Native plugin execution remains for the sole PUBLISH writer after fresh dual PASS; MAT did not probe or mutate Penpot.
- The old v4 ACTIVE lease binds the superseded payload hash and must not be reused. PUBLISH must explicitly supersede it and install a fresh exact v5 claim/setup binding before any new native run.
- V0 visual acceptance remains required after native readback/export; this technical successor does not imply promotion.

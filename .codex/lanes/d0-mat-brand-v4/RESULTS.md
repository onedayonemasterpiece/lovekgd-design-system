# d0-mat-brand-v4 results

## Scope and outcome

- Lane: `d0-mat-brand-v4`
- Base SHA: `4c7239f21d8c08ccd4b33f42661d9744cac15424`
- Implementation head SHA: `33b5bfdfac5eccd3fba80717b21fa44f38991348`
- Implementation tree SHA: `c97378f9234e124ed58dc913ebc47a2dd19934de`
- Branch: `agent/d0-atlas-wave/brand-v4`
- Result: PASS
- Penpot mutation: none; this lane changed only the package-local adapter, bindings, and regressions.

## Requirement evidence

- `BRAND-V4-OVERFLOW`: the four-row grid now resolves to `4*208 + 3*32 = 928`; review bottom is `1184`, while the candidate root resolves to height `1248` with the required 64px bottom margin.
- `BRAND-V4-SOURCE-A-SURFACES`: review light surface is visibly `#FFFFFF`; the four inverse placements have bounded native background boards filled `#98401F` and remain paired with linked component instances.
- `BRAND-V4-DESKTOP-MINHEIGHT`: all desktop lockup placements read back at exactly 120px height.
- `BRAND-V4-GUARD-PRESERVATION`: publish claim, ACTIVE lease/cancellation, setup binding, source-byte, protected projection, foreign-lineage, candidate-root, screenshot, detached-instance, validation, and idempotency guards remain enforced.
- `BRAND-V4-REGRESSIONS`: focused JS and Python checks cover resolved geometry, visible Source-A fills, desktop lockup height, linked-instance counts, no overlap, idempotency, hashes, and atlas binding.
- `BRAND-V4-BINDING-HASHES`: executor/launcher byte counts, SHA-256 values, Git blobs, and runtime claim adapter SHA are synchronized.

## Exact blobs and hashes

| File | Git blob SHA-1 | SHA-256 / note |
|---|---|---|
| `catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair/F-BRANDBOOK-BASELINE.adapter.v1.json` | `67a0dbe1f6da34405b22a5c7e4f77bc17d2d0818` | binding manifest |
| `scripts/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_payload_v1.js` | `51c23b021b109b84b5b51968d2830c41b6309b77` | `f9da12a9b453c9e6b387606b043b36829d402cde3c594bd2c1ec4c92461d285a` |
| `scripts/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.js` | `249cb8624a1591493072e8e2275d088255fc9a15` | `083bb61bbb7efb550f0d8aa2289050396eb5f9c7e9623224ad7a04e5e1e5367c` |
| `tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_binding_v1_test.py` | `94080360ca6361738e5720e34b298a340ac19065` | binding regressions |
| `tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.test.js` | `cfa9aa89307a32fc40dbe9c2f1addd8a75a02917` | runtime regressions |

## Commands and tests

- `node --test tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.test.js` — PASS, 6/6.
- `python3 -m unittest tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_binding_v1_test.py` — PASS, 2/2.
- `python3 -m unittest tests/asp_production_conveyor_v3_atlas_layout_test.py` — PASS, 9/9.
- `node --check` on payload, launcher, and JS regression — PASS.
- `git diff --check` — PASS.
- Independent hash verification with `sha256sum`, `git hash-object`, and manifest readback — PASS.

## Changed files

1. `catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair/F-BRANDBOOK-BASELINE.adapter.v1.json`
2. `scripts/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_payload_v1.js`
3. `scripts/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.js`
4. `tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_binding_v1_test.py`
5. `tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.test.js`
6. `.codex/lanes/d0-mat-brand-v4/RESULTS.md`

## Risks

- Native Penpot pixel export was intentionally not executed because MAT has no mutation authority. PUBLISH must run the exact bound adapter under a fresh valid claim and perform native readback/export.
- Existing partially persisted candidate geometry is repaired only inside the package-owned candidate root and remains bounded to three mutation units per invocation; foreign lineage still fails closed.

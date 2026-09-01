# d0-mat-brand-v6 results

## Scope and outcome

- Lane: `d0-mat-brand-v6`
- Base SHA (immutable v5): `e389a9ca0ab15f0d89bde4f3cddd9a4064ea3357`
- Implementation head SHA: `348952785fc11019ead03ccff2cdb9fc53f2c27a`
- Implementation tree SHA: `f2439b24ea6486d6e365b3c89406c6aec7641708`
- Branch: `agent/d0-atlas-wave/brand-v6`
- Result: PASS, pending fresh independent INTEGRATE and QA gates
- Penpot mutation by MAT: none

## Runtime risk closed

Live Foundation revision 117 showed nominal Penpot resize readbacks such as `2047.999954`, `448.0000019`, `1376.0000229`, and `127.999997`. Brand v5 used strict native geometry equality and was revoked before execution. V6 defines one conservative `GEOM_EPSILON=0.001`, below the required maximum `0.01`, and applies it only to numeric native geometry.

## Requirement evidence

- `BRAND-V6-GEOMETRY-EPSILON`: bounded near comparisons cover candidate root, all scaffold boards, review geometry/containment, inverse-surface rectangles, specimen cell containment, favicon sizes, desktop lockup height, and pairwise non-overlap.
- `BRAND-V6-FLOAT-TERMINAL`: regression injects observed drift up to `4.6e-5` after a complete run while `TextEncoder` and `crypto` remain unavailable; the next run returns terminal state with `created=0`, unchanged stable native IDs, and no repair write.
- `BRAND-V6-V5-GATE-PRESERVATION`: semantic IDs, package/component/placement census, strings, colors, hashes, claim/setup/lease, source bytes, protected projections, foreign lineage, candidate-root boundary, linked-instance status, screenshots, validation, export, and idempotency remain exact.
- `BRAND-V6-SELF-BINDING`: payload SHA/blob, launcher embedded payload tuple, launcher SHA/blob, adapter binding, and runtime claim adapter SHA are synchronized.

## Exact implementation blobs

| File | Git blob SHA-1 | SHA-256 / note |
|---|---|---|
| `catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair/F-BRANDBOOK-BASELINE.adapter.v1.json` | `a9d3e587b84d8b76b3c535330f7ed06e74a935b2` | exact v6 binding |
| `scripts/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_payload_v1.js` | `8324c4f517c4d8f3413f593edb385cd54d4d0e04` | SHA-256 `dc98e7c74e158febea8eb86fa49840057a4aed29a5278e87d0e1a7866d825635`, 33745 bytes |
| `scripts/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.js` | `888903743bfc89bff2fe64e3e38c26ac58ed0a32` | SHA-256 `e050449fd802db5472f533e91394591eba239ca7c65efc379628855072fea3d3`, 3343 bytes |
| `tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_binding_v1_test.py` | `727d527ef59bc3c7d1ecd9f9a193fc78d8cdb5e3` | binding and epsilon-scope regression |
| `tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.test.js` | `c3ea69e31ddeb1ee3617ac9c90ea70382610c9dc` | absent-global, float-resume, and preserved gate regressions |

## Commands and tests

- `node --test tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.test.js` — PASS, 7/7.
- `python3 -m unittest tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_binding_v1_test.py` — PASS, 2/2.
- `python3 -m unittest tests/asp_production_conveyor_v3_atlas_layout_test.py` — PASS, 9/9.
- Full terminal rerun with observed floats and absent `TextEncoder`/`crypto` — PASS, `created=0`, IDs stable.
- `node --check` on payload, launcher, and JS regression — PASS.
- Independent manifest byte/SHA/blob/epsilon readback and `git diff --check` — PASS.

## Changed files

1. `catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair/F-BRANDBOOK-BASELINE.adapter.v1.json`
2. `scripts/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_payload_v1.js`
3. `scripts/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.js`
4. `tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_binding_v1_test.py`
5. `tests/asp-production-conveyor-v3/d0/mat/brandbook_atlas_layout_repair_v1.test.js`
6. `.codex/lanes/d0-mat-brand-v6/RESULTS.md`

## Risks and handoff

- Native execution/readback/export remains for sole PUBLISH after fresh dual PASS; MAT did not call Penpot.
- Any older Brand claim binds a superseded payload hash and must not be reused. PUBLISH must install a fresh exact v6 claim/setup binding.
- Epsilon applies only to native numeric geometry. All semantic, lineage, census, color, source, protected, hash, and validation checks remain exact.
- V0 visual acceptance remains required after native materialization.

# Lane results — S3-FREE-SHELL

- Lane ID: `S3-FREE-SHELL`
- Requirement: `RD-U0-U-FREE-SHELL-REVIEW-PAGE-R1`
- Base SHA: `e5ded37cd33f94db1033a9300b69fc91c203aa62`
- Audited implementation head SHA: `509458d5daecd989e7848a77e31712adf8989b48`
- Audited implementation tree SHA: `44d059c12c3ebb62d95b25523223e409d889ffc1`
- Branch: `agent/d0-executable-buffer-v2/u0-free-shell-native-r2`
- Status: `ATLAS_EXTENSION_PENDING`

## Evidence

- Concrete native successor uses `createPage`, `createBoard`, `createText`,
  `library.local.createComponent`, and linked `component.instance()` calls; the
  v2 executor/runtime contain no `penpot.ensure` route.
- Seven preserved product masters expose contract anatomy as styled native
  nodes; six scenario boards contain 25 real linked visible instances.
- Every master binds exact source role/path/blob tuples; `CollectionCatalog` is
  pinned to blob `1a3dc3e2fb6d1df644625d2f2578b3042b3406bb`.
- Correct dependency trees: Brandbook
  `29ad3ccf0628e448d0881007129981b9f766856f`; Medallions
  `95ab14cbd64697910c871ccb1a7ca7428cf618bd`.
- Exact Atlas extension request stayed at blob
  `2ad8f60cd717e36df1908c3bc7857ecbaa83d8cf`; no Atlas page order was assigned.
- Two actual native-like executor invocations: first created native objects,
  second `created=0`, with identical whole-file projection.
- Duplicate, detach, screenshot, foreign exact-name page, inactive lease, and
  protected-surface gates fail closed.
- Shared plugin-data double rejects non-strings and does not coerce values.

## Commands and tests

Independent QA on exact head `509458d5…`:

- `node --test tests/asp-production-conveyor-v3/u0/free-shell-review/test_native_executor_v2.js` — `6/6 PASS`
- `python3 -m unittest tests/asp-production-conveyor-v3/u0/free-shell-review/test_repository_invariants_v2.py` — `7/7 PASS`

Independent INTEGRATE on the same exact head:

- `node --check` on runtime/executor/setup — `3/3 PASS`
- Node native executor suite — `6/6 PASS`
- Python repository invariants — `7/7 PASS`
- semantic gate + exact extension blob check — `PASS`

## Changed files at audited implementation head

- `catalog/asp-production-conveyor-v3/u0/free-shell-review/ASP_BUILD_REQUEST_V3.md`
- `catalog/asp-production-conveyor-v3/u0/free-shell-review/RESULTS_R2.md`
- `catalog/asp-production-conveyor-v3/u0/free-shell-review/U-FREE-SHELL-REVIEW-PAGE-R1.package.v2.json`
- `scripts/asp-production-conveyor-v3/u0/free-shell-review/native_executor_v2.js`
- `scripts/asp-production-conveyor-v3/u0/free-shell-review/native_runtime_v2.js`
- `scripts/asp-production-conveyor-v3/u0/free-shell-review/setup_v2.js`
- `tests/asp-production-conveyor-v3/u0/free-shell-review/test_native_executor_v2.js`
- `tests/asp-production-conveyor-v3/u0/free-shell-review/test_repository_invariants_v2.py`

This evidence/receipt follow-up adds only:

- `catalog/asp-production-conveyor-v3/u0/free-shell-review/local-qa-receipt.v2.json`
- `.codex/lanes/s3-free-shell/RESULTS.md`

## Risks / gates

- No Penpot service read or mutation was performed, so there is no Penpot
  authorization or V0 evidence claim.
- The exact O0 Atlas extension binding and dependency/V0 closure remain pending.
- PUBLISH was not run; Atlas R2 was not changed; Kaggle was not used.
- Repository has no root `CHANGELOG.md`; package-local `RESULTS_R2.md`, build
  request, and machine receipt are the applicable canonical change record.

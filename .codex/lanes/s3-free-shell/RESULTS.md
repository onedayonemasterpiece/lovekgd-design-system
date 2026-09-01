# Lane results — S3-FREE-SHELL

- Lane ID: `S3-FREE-SHELL`
- Requirement: `RD-U0-U-FREE-SHELL-REVIEW-PAGE-R1`
- Base SHA: `e5ded37cd33f94db1033a9300b69fc91c203aa62`
- Verified subject head SHA: `83f808e98d3f6ec3c8e44d2398ff86bc97bb4ad0`
- Verified subject tree SHA: `4982404ba9c66f0a4d2c2395df3e016267a204a2`
- Stable subject-manifest SHA-256: `ae805fc5cd3b7558a950d5975a9e88b44d5a0c6d29e2702e51d6377d704abfef`
- Branch: `agent/d0-executable-buffer-v2/u0-free-shell-native-r2`
- Final content-manifest SHA-256: `afd032091c6daabf49cbf2f93861b53749183e3e96561a77e66b6da19cc14432`
- Status: `ATLAS_EXTENSION_PENDING`

The receipt/evidence commit is intentionally outside the verified subject
manifest, avoiding an impossible self-hash. QA and INTEGRATE independently
verify the same exact eight-file subject manifest above. The final branch tip is
re-tested after the receipt commit and provider-read back separately.

## Evidence

- The concrete executor uses native `createPage`, `createBoard`, `createText`,
  `createShapeFromSvg`, `library.local.createComponent`, and linked
  `component.instance()` operations; v2 contains no `penpot.ensure` execution.
- Seven preserved product masters expose exact source-derived anatomy,
  responsive geometry and style literals. Six scenario boards contain 25 real
  linked visible instances and exactly 40 managed nodes.
- Every scenario/component pair binds a real state declared by that family;
  missing/unknown bindings abort and there is no generic state fallback.
- All 24 materialized fill/border literals were found in the exact pinned Astro
  source blobs. Bottom-nav icons use the source inline SVG paths. The medallion
  uses exact blob `3f6f7aadf0dc818112ab310875d8ad270c563b45`, 754 bytes,
  SHA-256 `27cc37743a0212868f28edbf3b1f0b6ad5033241d93154b26501cb7538122b31`.
- `CollectionCatalog` is pinned to blob
  `1a3dc3e2fb6d1df644625d2f2578b3042b3406bb`; corrected dependency trees are
  Brandbook `29ad3ccf0628e448d0881007129981b9f766856f` and Medallions
  `95ab14cbd64697910c871ccb1a7ca7428cf618bd`.
- Two actual native-like executor invocations produce `second_run_created=0`
  and identical complete file projection.
- Complete protected projection covers text, fills, strokes, all plugin-data in
  the strict double, and foreign native component-library entries.
- Duplicate IDs, linked detach, tagged or untagged screenshots, untagged direct
  specimen children, foreign exact-name pages, inactive leases, source drift,
  style/geometry drift and protected mutation fail closed.
- Exact Atlas extension request remains blob
  `2ad8f60cd717e36df1908c3bc7857ecbaa83d8cf`; no Atlas order was assigned.

## Independent checks on the same subject

QA on subject `83f808e…` / manifest `ae805fc5…`:

- v2 Node native suite: `8/8 PASS`
- v2 Python invariants: `10/10 PASS`
- exact pinned-source style literal audit: `24/24 PASS`

INTEGRATE on the same subject/manifest:

- v2 runtime/executor/setup syntax: `3/3 PASS`
- v1 + v2 Node suites: `13/13 PASS`
- v1 + v2 Python suites: `17/17 PASS`
- exact extension blob, semantic gates, clean-tree check: `PASS`

## Changed files

Verified subject files and exact blob/byte/SHA-256 tuples are machine-recorded
in `catalog/asp-production-conveyor-v3/u0/free-shell-review/local-qa-receipt.v2.json`.
The lane changes are package-local under:

- `catalog/asp-production-conveyor-v3/u0/free-shell-review/`
- `scripts/asp-production-conveyor-v3/u0/free-shell-review/`
- `tests/asp-production-conveyor-v3/u0/free-shell-review/`
- `.codex/lanes/s3-free-shell/RESULTS.md`

## Risks / gates

- No Penpot read or mutation occurred, so no Penpot authorization or V0 claim
  exists.
- O0 Atlas extension binding plus dependency/V0 closure remain pending.
- PUBLISH was not run; Atlas R2 was not changed; Kaggle was not used.
- Repository has no root `CHANGELOG.md`; package-local result/build/receipt files
  are the applicable canonical change record.

## Repair-2 closure

- Protected digest now includes opacity, visibility, SVG, native layout and component-copy identity.
- Exact managed replay digest rejects geometry/style/text/plugin/layout/component drift.
- Master child and linked instance positions are checked independently of the digest.
- Recursive detach scanning catches untagged nested component copies.
- Every declared family state has a frozen inner-anatomy contract; mobile menu rows, current bottom-nav item, responsive hero/sticky medallions, breadcrumbs, footer Grid and control Flex states are asserted.
- Subject tests: v2 Node `8/8 PASS`, v2 Python `10/10 PASS`; integrated v1+v2 Node `13/13 PASS`, Python `17/17 PASS`.

## Repair-3 closure (content-manifest bound)

- Real native `addGridLayout()`/`addFlexLayout()` objects replace scalar-only layout evidence.
- Footer Grid and Breadcrumbs Flex carry direct source role/path/blob layout-owner tuples.
- Complete projection includes shadows/blur/backgroundBlur/blend/corners/layout child+cell/native tracks and sizing.
- Exhaustive plugin enumeration is required before mutation; no finite fallback namespaces or keys remain.
- Protected/managed shadow, extra-plugin and fill-image adversarial cases fail closed.
- Final evidence uses the receipt's self-nonreferential content manifest; provider head/tree are read back after the single final commit.

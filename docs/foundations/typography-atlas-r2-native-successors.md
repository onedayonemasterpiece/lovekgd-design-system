# Typography Atlas R2 native successors

## Scope

This is the canonical Git-side execution note for the bounded successors of:

- `F-TYPOGRAPHY-TYPE-SCALE-SMALL-PAGE`;
- `F-TYPOGRAPHY-LAYOUT-RULES-SMALL-PAGE`.

Both successors consume the immutable `F-TYPOGRAPHY-LAYOUT` v3 package at
`eb388db611fb997283ba63c452b6642ff3508678` / blob
`501c307799bf412bc658dc89a04245f8a5cabc61`. They are pinned to Atlas R2
`663be702d481972cb2e8863af500f1c35dda1d8c`; Atlas files are inputs and were
not changed.

This wave did not read or mutate Penpot and did not run PUBLISH. The resulting
status is `PUBLISHABLE_AFTER_ATLAS_EVIDENCE_GATE`, which is an executable Git
state, not Penpot authorization or visual acceptance.

## Frozen jobs

| Package | Target page | Native families | Linked specimens | Rows | Root height |
|---|---|---:|---:|---:|---:|
| `F-TYPOGRAPHY-TYPE-SCALE-SMALL-PAGE` | `04.1 · Foundations · Typography scale · Candidate` | 3 | 24 | 12 | 4512 |
| `F-TYPOGRAPHY-LAYOUT-RULES-SMALL-PAGE` | `04.2 · Foundations · Layout rules · Candidate` | 6 | 27 | 14 | 5216 |

The split retains only component identities already present in the v3 source
package and creates no new component family. Type Scale preserves all four
source roles but groups the six `foundation.typography-cyrillic-wrap`
specimens under the existing `foundation.typography-font-binding` native
master. It therefore materializes exactly three native families, satisfying
the pinned Atlas hard limit of three without losing any of the 24 source-bound
specimens. Layout Rules remains six native families under its limit of seven.

The shared family runtime rejects a missing, invalid, or exceeded Atlas family
limit before it looks up or creates the target page. Package tests include a
four-family negative fixture and prove that it fails with no page mutation.

Each package has its own immutable package JSON, executor entry point, test,
receipt, and PASS/REPAIR boundary. The runtime is shared only inside this
two-page typography family.

## Native projection contract

Both jobs materialize a linked `ATLAS_PAGE_HEADER_V2` and a native documentation
shell:

- root and content row: native Flex;
- review surface: native Grid;
- root width: `2176`;
- header: `[64, 64, 2048, 128]`;
- master column: `x=64`, `width=512`;
- review grid: `x=608`, two `736`-wide columns, `32` column/row gaps;
- cell height:
  `clamp(specimen_height + label_block_height + 64, 320, 720)`;
- row count: `ceil(instance_count / columns)`;
- root height: `content_start_y + content_height + bottom_padding`.

Every review cell contains a label and a real linked component instance. Type
specimens are editable Cyrillic text. Layout specimens use visible source-rule
geometry for containers, breakpoints, sticky stacks, layer bands, safe area,
and listing-media sizing. Screenshot or placeholder wells are not accepted.

## Exact fonts and replay

Mutation entry is fail-closed until the caller provides these actual byte
streams:

| Face | Bytes | SHA-256 |
|---|---:|---|
| DejaVu Sans 400 | 759720 | `ae7b7855e115a5966d8b1b3f80f254ccc117ec86f9965e202ee2940453837280` |
| DejaVu Sans 700 | 708920 | `5c1247acef7f2b8522a31742c76d6adcb5569bacc0be7ceaa4dc39dd252ce895` |

The package tests execute the same native-like document twice. The second run
must report `created=0`; duplicate, detached, screenshot, and empty-well counts
must remain zero; the projection of every non-target page must remain unchanged.
The shared-plugin-data double rejects any value whose JavaScript type is not
`string` and performs no implicit coercion.

The boundary `does_not_repair_eventcard_text=true` is mandatory. These jobs do
not close, invalidate, or visually accept EventCard text layout.

## Paths and verification

- packages: `catalog/asp-production-conveyor-v3/f0/typography-layout-r4/`;
- executors: `scripts/asp-production-conveyor-v3/f0/typography-layout-r4/`;
- native-like tests:
  `tests/asp-production-conveyor-v3/f0/typography-layout-r4/`;
- receipts: `receipts/asp-production-conveyor-v3/f0/typography-layout-r4/`.

Independent package commands:

```bash
node --test tests/asp-production-conveyor-v3/f0/typography-layout-r4/type_scale_small_page_atlas_r2.test.js
node --test tests/asp-production-conveyor-v3/f0/typography-layout-r4/layout_rules_small_page_atlas_r2.test.js
python3 tests/asp-production-conveyor-v3/f0/typography-layout-r4/test_typography_atlas_r2_package_contracts.py
```

The Python command is the independent INTEGRATE gate for exact local Git blobs,
source/Atlas pins, font bytes, receipts, boundaries, and lack of Atlas changes.

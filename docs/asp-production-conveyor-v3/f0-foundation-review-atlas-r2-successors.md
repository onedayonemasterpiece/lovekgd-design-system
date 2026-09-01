# F0 Foundation review — package-local Atlas R2 successors

Status: **Git-only executable candidates; no Penpot authorization**.

This bounded successor family closes the four `D0_EXECUTABLE_BUFFER_V1`
Foundation-review `NATIVE_EXECUTOR_REPAIR` directives without changing Atlas R2,
reading or mutating Penpot, running PUBLISH, or introducing a component family.
The authority remains `kenigevents.asp-conformance`; the executors are only an
input to the later Atlas evidence gate.

## Frozen package units

| Package | Atlas page | Frozen template | Instances | QA | INTEGRATE | Status |
|---|---|---:|---:|---|---|---|
| `F-FOUNDATIONS-REVIEW-COLORS-STATUS` | `foundations-review-colors-status` | `FOUNDATION_ASSET_GRID_STANDARD_V2` | 26 | PASS | PASS | `PUBLISHABLE_AFTER_ATLAS_EVIDENCE_GATE` |
| `F-FOUNDATIONS-REVIEW-SPACING-SIZING` | `foundations-review-spacing-sizing` | `FOUNDATION_ASSET_GRID_STANDARD_V2` | 14 | PASS | PASS | `PUBLISHABLE_AFTER_ATLAS_EVIDENCE_GATE` |
| `F-FOUNDATIONS-REVIEW-SHAPE-ELEVATION` | `foundations-review-shape-elevation` | `FOUNDATION_ASSET_GRID_STANDARD_V2` | 8 | PASS | PASS | `PUBLISHABLE_AFTER_ATLAS_EVIDENCE_GATE` |
| `F-FOUNDATIONS-REVIEW-MOTION-ACCESSIBILITY` | `foundations-review-motion-accessibility` | `FOUNDATION_ASSET_GRID_STANDARD_V2` | 9 | PASS | PASS | `PUBLISHABLE_AFTER_ATLAS_EVIDENCE_GATE` |

Each unit has its own immutable `execution_tuple_id`, adapter ID, Atlas page ID,
page order, source blob, family tuple, and instance census. Only the native
implementation helper and launcher are shared, and they are scoped to these
four units.

## Exact immutable inputs

- R1 source: branch `agent/f0-foundation-page-split-r1`, head
  `45499cc610a1bb5cbf36b8531c65b036d731013f`, tree
  `6ed4fca2d754c3270b066f536bd82a0492c64755`, adapter blob
  `3d81ace5033b4ccde60291340c8019eb8ee3ba49`, 17,146 bytes,
  SHA-256 `68d9d6a7ffd49855b3092af6ebfced0d2e0f55de621ff16358903d326ceebe89`.
- Atlas R2: branch `o0/penpot-atlas-layout-v2-20260901`, head
  `663be702d481972cb2e8863af500f1c35dda1d8c`, tree
  `cf9a1e6a5e0a84aea5636334dbd3be4961039b75`, binding blob
  `23475806beebfbe21bd77759440c169c60627550`.
- Atlas R2 is read from Git only and is not modified by this successor family.

## Native execution contract

The shared family-local payload:

1. binds a complete, fail-closed protected projection before every write,
   including text, fills, strokes, shadows, opacity, every plugin-data namespace
   and key exposed by the runtime, native Grid/Flex layout, layout cells, and
   component lineage; if namespace enumeration is unavailable on any protected
   file/page/shape/component, execution fails closed; the pinned identity
   projection remains independent;
2. preserves the existing page/root and package-owned product-component
   instance IDs while migrating the R1 top-level documentation shell;
3. creates a native Flex root/header/master shell at root width 2176, a real
   native Grid review shell, and one linked `ATLAS_PAGE_HEADER_V2` instance;
4. uses the exact `STANDARD_V2` four-column global instance geometry and frozen
   formulas: `ceil(instance_count / columns)`,
   `content_start_y + content_height + bottom_padding`, and
   `max(header_right, master_right, grid_right) + outer_margin`;
5. requires shared plugin-data values to satisfy `typeof value === "string"`;
6. projects the complete local component-library census, including unattached
   masters and component name/path/state, and recursively requires component
   reference/copy-marker agreement in both directions, then rejects every
   missing or foreign component under the managed root independently of tags;
7. fails on duplicate pages/roots/slots/cells/placements, legacy family groups,
   adversarial protected style/content/layout/plugin-data/library drift,
   detached linked instances, screenshots, validation or projection drift;
8. returns `duplicates=0`, `detached=0`, `screenshots=0`, and
   `secondRunCreated=0` only after an actual second native-like replay.

The package-local adapter and layout-contract JSON files live in
`catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair/`. The executor
and launcher live in `scripts/asp-production-conveyor-v3/d0/mat/`.

The resulting global row/review-height/root-height tuples are respectively
`7/1984/2304`, `4/1120/1440`, `2/544/864`, and `3/832/1152` in the package order
shown above. In particular Shape/Elevation is two rows for eight instances; it
does not sum independently rounded family row counts.

## Verification

Independent QA is the native-like Node runtime suite. Independent INTEGRATE is
the Python exact-binding/bytes/formula suite. Both must pass against the same
committed head. Their PASS does **not** authorize Penpot mutation or PUBLISH;
`penpotAuthorization=false`, `promotion_authorized=false`, and visual acceptance
remains pending the Atlas evidence gate.

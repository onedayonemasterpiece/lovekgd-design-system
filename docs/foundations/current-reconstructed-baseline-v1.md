# Current-reconstructed foundations baseline v1

Markers: `ASP_FOUNDATION_RUNTIME_CENSUS_V1`, `ASP_FOUNDATION_SEMANTIC_MODEL_V1`,
`ASP_FOUNDATION_TOKEN_GRAPH_V1`, `ASP_ICONOGRAPHY_REGISTRY_V2`, and
`ASP_BRAND_BASELINE_V1` are the bounded F1 Git-only baseline.

## Authority and scope

The source of runtime truth is `onedayonemasterpiece/events-bot-new` at
`64f75d10f7aff33fa616cee212878bd9d03673b1`. The baseline describes current
Astro; it neither changes Astro nor treats old Penpot or PR #38 as authority.
It is deliberately `current-reconstructed`, has no visible delta, does not
promote a palette, and makes no consumer migration.

## Runtime census

The machine-readable census in `contracts/foundations/current-reconstructed.v1.json`
pins the source objects and covers all required domains: terminology; brand and
media assets; colors/modes; type; iconography; responsive layout/grid; spacing,
density, shape/elevation; sticky/fixed layers; motion; and accessibility.

`catalog/foundations/current-reconstructed/consumer-drift-matrix.v1.jsonl`
records consumers without asserting that a source-only occurrence is a production
migration target. The free-collection tuple is expressly read-only and separated.

## No-op migration plan

1. Re-run `node scripts/foundations/validate-current-reconstructed.mjs` against
   the same pin; a source SHA or source digest change is drift, not an automatic
   update.
2. For a future consumer, bind an existing semantic identity to its exact
   computed/source value and verify the same responsive state, asset, and
   accessibility behavior. Do not rewrite CSS or normalize component-local
   geometry as part of this step.
3. Capture deterministic before/after Astro evidence for the named route and
   viewport. Any visible delta becomes a separately approved candidate.
4. Only after no-op evidence and owner review may a later branch propose a
   migration; it must remain reversible and must not reuse this branch as a
   promotion claim.

## Later Penpot materialization plan

F1 does **not** access or mutate Penpot. A later lease must be separate, require
free-collection W5 pass where applicable, resolve exact font and asset bindings,
materialize native linked components, validate `[]`, export bounded roots, and
obtain independent owner review. The iconography registry is a census, not a
license to substitute SVGs or create Penpot icons.

## Future theme candidates

A new palette, typography direction, brand treatment, or semantic reinterpretation
is a separate theme candidate. It may not replace `current-reconstructed`
automatically; it requires its own evidence, migration plan, owner approval, and
rollback path.

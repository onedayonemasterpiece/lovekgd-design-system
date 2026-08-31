# F1 results — current-reconstructed foundations baseline

Status: `IMPLEMENTED_PENDING_VALIDATION`.

- Authority: Astro as-is at `64f75d10f7aff33fa616cee212878bd9d03673b1`.
- Scope: F-only contracts/catalog/docs/scripts/tests; no Astro, Penpot, corpus, or
  free-collection tuple mutation.
- Required issue marker: `ASP_FOUNDATION_F1_START_V1`, issue #56 comment 5472226941.
- Required deliverables: runtime census, semantic model, token graph, iconography
  registry v2, brand baseline, consumer/drift matrix, no-op and later-Penpot plan.
- Validation commands: `node scripts/foundations/validate-current-reconstructed.mjs`
  and `node tests/foundations/current-reconstructed-negative.mjs`.

Validation result: `PASS` — 9 foundation identities, 9 consumer rows, 7 icon
families; both no-op visual-delta and Penpot-escape negative cases rejected.

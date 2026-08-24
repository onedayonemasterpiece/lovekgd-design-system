# Complete Reconstruction Atlas v1

Текущая semantic phase построена из Astro head
`7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00` и generated browser output.

## Current phase status

`SEMANTIC_ATLAS_READY_FOR_PENPOT_BATCH`

- 17/17 checklist archetypes;
- 29/29 production Astro page sources mapped;
- 67 browser observations: mobile + desktop for every archetype and tablet for
  all three Event Detail fixtures;
- two expected 404 observations for club detail are bound to
  `GAP-CLUB-DETAIL-RUNTIME` rather than hidden;
- validation: 230 checks, 0 failures.

Semantic contracts, Penpot bindings and evidence are deliberately separate:

- `semantic-atlas.v1.json`, `foundations.v1.json`, `fixtures.v1.json`,
  `reuse-new-map.v1.json` — semantic SoT;
- `penpot/bindings.v1.json` — Penpot-only binding plane;
- `evidence/` — browser and later sampled conformance evidence;
- `gap-ledger.v1.json` — current contradictions and missing source contracts.

Dense/stress lists remain Astro-authoritative; Penpot must use representative
linked instances only.

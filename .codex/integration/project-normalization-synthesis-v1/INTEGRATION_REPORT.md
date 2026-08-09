# Project Normalization Synthesis v1 — Integration Report

## Pinned authority

- Design base: `228126dd78a67a6f335272324dc90c1e680cd8c4`.
- Product/closure repository pin: `66bc0d43e36299417626f992021cfb7299ddf704` (tree `72e24f49ad6642915131438de8c56b804c4826b0`).
- Evidence UI source: `ef7aa62e45c60f7a12da6160f490719c0721ec03`; this is intentionally distinct from the closure repository pin.
- Behavioral closure: run `31327863197`, manifest SHA-256 `c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1`.
- Immutable Decoder v1 tree: `e77fc2457fadfdffb46ed2d90304ebb91e89a715`.

## Integrated scope

- 104 significant R-01…R-07 charter conclusions with closed dispositions.
- 222 canonical findings rows covering 279 exact raw source references: 57 paired probe findings, 30 standalone unresolved findings, 16 fragmentation findings, 12 candidate contracts and 107 logical components.
- 47 semantic families with exactly one primary family for each of 107 logical components. Three source-only/no-consumer component identities remain dispositioned but correctly do not produce application rows.
- 239 component applications and 239 product-value readiness rows. The authoritative product registry is absent at the pinned product commit, so all product foreign-key arrays remain empty and every row is `pending_product_model`, `promotion_ready=false`.
- Reproducible wave model: 3 ready, 9 product-model-dependent, 2 experiment-dependent, 7 implementation-gap-blocked, 26 insufficient-evidence.
- First wave: Event Media and Event Token Medallions. Each recommendation is a non-accepted `composition` candidate and does not authorize implementation. Event Detail remains `insufficient_evidence` because its nine cascade/probe mismatches require reconciliation before a target contract.
- Four compact owner decisions; no deterministic evidence decision is delegated and no experiment winner is selected.
- Exact final Behavioral v1.1 compact package imported byte-for-byte; immutable Decoder v1 unchanged.

## Local validation

- Immutable Decoder v1 validator: PASS (107 components, 12 contracts, 6 capsules, 157 raster reviews).
- Behavioral Decoder v1.1 closure validator: PASS (293 terminal = 236/39/18; 87 unresolved; 134 raster reviews).
- Project Normalization Synthesis validator with audit pending: PASS (107 paths; 47 families; 239 applications; 222 canonical dispositions / 279 raw refs; 2 first-wave dossiers; 4 queue rows).
- Product-value Draft 2020-12 schema: 239/239 application rows valid; all product archetype IDs null and all authoritative product foreign-key arrays empty.
- Node syntax, workflow YAML, JSON/JSONL parse, output hashes/record counts, deterministic category/score replay, corruption rejection, `git diff --check`, forbidden status scan and forbidden path scan: PASS.
- Independent audit: pending on the implementation commit.

## STOP boundary

No production Astro/CSS/JS, `site/src`, `site/public`, Penpot, prototypes, token resources, product entities or runtime components were modified. No physical merge/split, legacy removal, typography selection, experiment selection or next-phase work was performed.

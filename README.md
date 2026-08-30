# LoveKGD Component Synthesis v0.1

Распакованный и evidence-reconciled candidate synthesis для статического
Astro-сайта. Immutable исходный ZIP остаётся provenance-входом; текущим
машиночитаемым source of truth являются diffable records, contracts, fixtures,
archetype graphs и materialization package в репозитории.

## Ключевые количества

- 107 exact current source mappings;
- 111 entities;
- 61 W1–W4 identities в исходном package;
- 65 W1–W4 identities после exact-source reconciliation;
- 15 product patterns;
- 11 current page compositions;
- 18 page-archetype candidates;
- 9 runtime enablers;
- 35 consumer-scoped media-policy cells;
- owner ambiguities: 0;
- technical reconciliation items: 6.

## Основные файлы

- `docs/normalization/full-component-synthesis-v0.1.md` — решения и границы.
- `docs/normalization/component-index-v0.1.md` — полный entity index.
- `docs/normalization/current-to-candidate-mapping-index-v0.1.md` — человекочитаемые 107 mappings.
- `docs/normalization/page-archetype-index-v0.1.md` — 18 archetypes.
- `docs/normalization/apply-component-synthesis-v0.1.md` — bounded execution brief.
- `catalog/normalization/component-synthesis-v0.1/entity-registry.jsonl`.
- `catalog/normalization/component-synthesis-v0.1/current-to-candidate-mapping.jsonl` / `.csv`.
- `catalog/normalization/component-synthesis-v0.1/component-hierarchy.json`.
- `catalog/normalization/component-synthesis-v0.1/page-archetype-registry.jsonl`.
- `catalog/normalization/component-synthesis-v0.1/technical-reconciliation-queue.jsonl`.
- `catalog/normalization/component-synthesis-v0.1/owner-ambiguities.json`.
- `catalog/normalization/component-synthesis-v0.1/penpot-materialization-plan.json`.
- `catalog/normalization/component-synthesis-v0.1/validation-report.json`.
- `catalog/normalization/component-synthesis-v0.1/source-drift-ledger.jsonl`.
- `catalog/normalization/component-synthesis-v0.1/technical-reconciliation-results.jsonl`.
- `catalog/normalization/component-synthesis-v0.1/media-policy-matrix.jsonl`.
- `catalog/normalization/component-synthesis-v0.1/contracts/index.json`.
- `catalog/normalization/component-synthesis-v0.1/fixtures/`.
- `catalog/normalization/component-synthesis-v0.1/archetypes/index.json`.
- `catalog/normalization/component-synthesis-v0.1/penpot-materialization-ir.json`.
- `catalog/normalization/component-synthesis-v0.1/penpot-readback.json`.
- `catalog/normalization/component-synthesis-v0.1/rollback-package.json`.
- `receipts/normalization/apply-component-synthesis-v0.1.json`.
- `manifest.json`.

## Status

`reconstructed`, `candidate`, `canonical=false`, `accepted=false`, `promotion_ready=false`.

Exact 107 path closure and 6/6 technical reconciliation do not imply semantic
acceptance or promotion. GitHub carries the implementation in Draft PR
[#35](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/35);
production `events-bot-new` was read-only. Live Resource Graph materialization
and UI Exploration historical marking remain `BLOCKED_EXTERNAL_EVIDENCE`
because both current Penpot MCP reads returned HTTP 504. The deterministic IR,
materializer input, tests and rollback package remain the deliverable for that
single external blocker.

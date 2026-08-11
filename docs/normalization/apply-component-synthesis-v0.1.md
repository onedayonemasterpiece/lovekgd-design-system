# Apply LoveKGD Component Synthesis v0.1

## Цель

Интегрировать уже сформированную candidate component model в существующую normalization architecture, материализовать native Penpot candidates и собрать page archetypes. Не выполнять повторную component taxonomy.

## Входы

- `entity-registry.jsonl` — 111 entity records;
- `current-to-candidate-mapping.jsonl` / `.csv` — exact 107 current files;
- `component-hierarchy.json` — nesting/composition graph;
- `page-archetype-registry.jsonl` — 18 candidate archetypes;
- `technical-reconciliation-queue.jsonl` — 6 evidence tasks;
- `penpot-materialization-plan.json` — W1–W5;
- existing decoder/behavioral snapshots in `main`.

## Обязательное исполнение

1. На актуальном `events-bot-new` SHA проверить exact equality 107 source paths и consumer/import edges; любое расхождение оформить finding, не переписывать silently.
2. Встроить records в существующие `catalog/normalization`, `contracts/normalization`, validators и receipts; не создавать параллельную architecture.
3. Сохранить high-confidence decompositions и transport split, пока точное source/runtime evidence им не противоречит.
4. Выполнить 6 technical reconciliation items. Они не являются owner questions.
5. Создать W1–W4 native candidate components в Resource Graph; все reconstructed/unaccepted/not promotion-ready.
6. Собрать 18 archetype candidates из component instances; uncovered regions помечать explicit gaps.
7. Старый Event Media owner pack оставить историей: `WITHDRAWN_FROM_OWNER_REVIEW`, `NEEDS_REVISION`, selected=0, accepted=0.
8. Открыть Draft PR. Не менять production `events-bot-new`, не merge PR автоматически.

## Fail-closed acceptance

- 107/107 current paths имеют ровно одну terminal mapping row;
- every mapping target, nested ref, hierarchy edge and archetype ref resolves;
- runtime/evidence/experiment/unresolved entities не становятся Penpot masters;
- every Penpot component имеет stable Git binding;
- every archetype состоит из instances или explicit gap;
- experiments остаются `NOT_MERGED`;
- owner ambiguity queue содержит 0 governance/technical questions;
- production source и public runtime не изменены;
- candidate materialization не означает acceptance/promotion.

## Source reconciliation checkpoint

- design-system origin/main: `c59a3576c7361c1953b31ad9b98ed096640e92c7`; extraction/lane base: `8bf4ad465cbd9d943935c201378b867a5d539456`;
- events origin/main: `96784bd572c03b965f303366c4ff0bb85d1b9a3f`; synthesis-observed: `a161061d8161409566412db2b1909031949dc104`; decoder-pinned: `66bc0d43e36299417626f992021cfb7299ddf704`;
- exact source paths: `107/107`; post-synthesis source/blob drift: `0`; decoder→current bounded nonmaterial instrumentation delta: `1`; import/consumer edge drift: `0`;
- entity count remains `111`: the obsolete unresolved mobile-search wrapper entity was removed while `listing.event-card` was added;
- current candidate components/controls: `63`; product patterns: `15`; evidence/experiment/unresolved: `7`; Penpot-eligible entities: `94`;
- W1–W4 plan: original package `61`, reconciled `65` (`16/14/17/18`); `core.dialog` is in W1, and `core.rail` has an explicit pre-W2 topological subpass before `event.media-rail`;
- mapping remains exact `107/107`; all six technical queue items have terminal results; owner ambiguity remains `0`;
- all records remain `canonical=false`, `accepted=false`, `promotion_ready=false`.

The immutable ZIP/manifest continue to bind the original package. The extracted JSONL/JSON/CSV records and reconciliation ledgers are the integrated, diffable source of truth.

## Implementation result

The candidate package is now executable rather than archive-only:

- immutable input: 51,301 bytes, SHA-256 `cb13d1bb7368eefa7b98763c1b065b27406e6a20b3c9b393935c2dc830aed446`; all 16 manifest entries matched;
- current source replay: 107/107 files and recorded import/consumer fingerprints at events commit `96784bd572c03b965f303366c4ff0bb85d1b9a3f`; 106 bounded Astro implementations, zero post-synthesis blob drift and one declared decoder-to-current non-material instrumentation delta;
- terminal technical reconciliation: 6/6, with `OWNER_AMBIGUITY_COUNT=0`;
- candidate contracts: 65 W1–W4 records and 65 exact fixture bindings over 39 shared fixtures;
- archetypes: 18/18 deterministic instance graphs, 349 materializable component/pattern instance nodes and 12 explicit gaps; detached copies and local overrides remain zero;
- deterministic Resource Graph IR: 65 native masters, 471 axiswise variants, 695 nested instances, 1,138 linked native fixture specimens and 349 archetype instances;
- rollback: exact synthesis-namespace stable-ID inventory, pre-W1 named-version requirement, scaffold preservation and explicit destructive authorization gate;
- validation: Draft 2020-12 registry/contract/archetype/receipt schemas, exact source replay, deterministic IR check and semantic negative mutations.

The IR uses the existing 23-page / 257-zone Resource Graph scaffold. Component masters resolve to canonical stable zones on pages 10/30/40/50; fixture projections use pages 62/64; archetype boards use page 60; no new page, screenshot master or detached copy is permitted.

## Live Penpot boundary

Only live mutation and live read-back are blocked. After the owner reloaded Penpot, a current probe succeeded against the exact Resource Graph at revision 33 with 23 pages and zero local native components. The original full-plan dry-run then exceeded the MCP request window and returned `HTTP 504`; a subsequent minimal probe also returned 504 and the alternate connector returned an internal error. The materializer was corrected to index shapes once and to support bounded component/archetype batches. Official troubleshooting: <https://help.penpot.app/mcp/>. No live write was performed: the failure occurred during read-only dry-run planning. A fresh page reload is required before the corrected bounded batches can execute.

The latest successful read earlier in the same task thread confirmed Resource Graph revision 33, 23 scaffold pages and zero native components at that time. It is retained only as `latest_confirmed_live_read`; it is **not** represented as current state. The current read-back count and revision-after remain null. The committed materializers are ready for a resumed exact-file run and perform a real second pass that must create zero objects.

The historical Event Media UI Exploration plan likewise preserves all existing object/thread IDs while targeting `WITHDRAWN_FROM_OWNER_REVIEW`, `NEEDS_REVISION`, selected=0, accepted=0 and owner consent absent. Its live mutation is covered by the same external blocker and is not falsely claimed complete.

## Reproducible commands

```bash
python3 scripts/component-synthesis-v0.1/validate-schemas.py --root . --require-receipt
node scripts/component-synthesis-v0.1/build-materialization-ir.mjs --root . --check
node scripts/validate-apply-component-synthesis-v0.1.mjs \
  --root . --events-repo /path/to/events-bot-new-at-96784bd
node tests/apply-component-synthesis-v0.1-negative.mjs .
node scripts/component-synthesis-v0.1/build-receipt.mjs \
  --root . --events-repo /path/to/events-bot-new-at-96784bd \
  --materialization-parent <pre-receipt-commit>
```

This application does not set `canonical`, `accepted` or `promotion_ready`, does not select an experiment winner, does not modify production Astro or the events repository, and does not merge the Draft PR.

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

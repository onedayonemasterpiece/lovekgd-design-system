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

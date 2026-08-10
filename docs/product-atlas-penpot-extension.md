# Product Atlas: отдельный Penpot plugin и visual extension

> **Статус:** скорректированная граница реализации.  
> **Дата:** 7 августа 2026 года.  
> **Канонический product contract:** `events-bot-new/docs/product-model/product-atlas-architecture.md`.

## 1. Решение

Product Atlas создаётся:

- в отдельном Penpot-файле;
- отдельным Product Atlas plugin;
- из отдельного `product-atlas` catalog;
- с отдельным managed namespace;
- без импорта Resource Graph дизайн-системы в продуктовую доску.

```text
events-bot-new product model
+ release / acceptance / incident refs
+ reviewed product analysis records
+ LoveKGD visual foundations
→ Product Atlas Penpot projection
```

`common-analytics` не является входом Product Atlas. Статистические данные находятся в проектируемом DB/runtime-контуре `events-bot-new`; на Product Atlas попадают только проверяемые snapshots/findings из конкретных analysis records.

## 2. Почему plugins должны быть отдельными

Resource Graph и Product Atlas различаются по:

- catalog schema;
- managed object types;
- page model;
- частоте обновления;
- comment semantics;
- acceptance и recovery rules.

Один пользовательский plugin с переключателем режима создавал бы риск:

- импортировать component/resource catalog на продуктовую доску;
- создать Jobs и problem bubbles в design-system-файле;
- повредить comments или managed object identity;
- ошибочно считать один файл current по другому catalog.

Поэтому разделяются:

```text
LoveKGD Resource Graph plugin
LoveKGD Product Atlas plugin
```

Допускается общий internal renderer core, но не общий manifest, namespace, catalog kind или mutation command.

## 3. File-kind guard

### Product Atlas plugin

Обязан:

- принимать только `catalog_kind=lovekgd-product-atlas`;
- использовать namespace `lovekgd.productatlas.*`;
- требовать file marker `file_kind=product-atlas`;
- распознавать Resource Graph managed namespace;
- fail closed при design-system marker;
- работать только с allowlisted Product Atlas pages;
- не запрашивать `library:write` на первой версии;
- не создавать native Colors, Typographies, icons или public UI component masters.

### Resource Graph plugin

До совместной эксплуатации обязан получить симметричную проверку:

- fail closed при `file_kind=product-atlas`;
- не переименовывать Product Atlas pages;
- не удалять и не архивировать Product Atlas managed objects.

Host acceptance двух plugins блокируется, пока обе стороны guard не доказаны в одном чистом design-system-файле и одном чистом Product Atlas-файле.

## 4. Разделение Penpot-файлов

### Design-system Resource Graph

Сохраняет свои страницы resources, components, patterns, archetypes, coverage и automated visual evidence.

### Product Atlas

Использует существующую page topology:

```text
00 — Executive / Problem Radar
10 — Stakeholders, Jobs and outcomes
20 — Journeys and capabilities
30 — Delivery, coverage and readiness
40 — Findings, incidents and decisions
50 — UI and design evidence
80 — Candidate decisions
89 — Decision archive
99 — Technical diagnostics
```

Первая action-map версия переиспользует страницы `40` и `50`; новая страница `45 — Product analytics evidence` не создаётся:

```text
50 — UI and design evidence
  reviewed page/component action maps
  scope, denominator, release/model/layout/component versions
  immutable evidence package link

40 — Findings, incidents and decisions
  accepted finding
  competing explanations and limitations
  options, owner decision and follow-up campaign
```

Связь между файлами выполняется stable IDs и deep links:

```text
Product Atlas capability / UI gap
↔ Resource Graph component / pattern / archetype
↔ actual / baseline / diff evidence
```

Product Atlas plugin может создать link/evidence card. Он не копирует всю design-system library и не вызывает её mutation phases. Evidence cards и findings сохраняют stable deep links на Resource Graph page-level maps (`90–92`) и component-local maps (`93`); Resource Graph references, в свою очередь, сохраняют Product Atlas stable IDs. Generic text URL без stable entity/page identity не считается достаточной связью.

## 5. Action-map evidence ingest и review boundary

Единственный action-map input — immutable reviewed `ProductAnalyticsEvidencePackage` из конкретного canonical analysis record в `events-bot-new`. Plugin проверяет schema/hash, evidence ID и зафиксированные scope/release/model/layout/component identities; он не читает raw summaries и не интерпретирует метрики.

Минимальная projection package включает:

```text
evidence_id + measurement_question + decision_use
scope (campaign/date/release/page/layout/component/model/experiment)
quality (eligible/captured views, delivery coverage, unmapped rate, performance parity)
facts + limitations
reviewed finding status: accepted | rejected | insufficient-data
options + owner decision
immutable artifact refs
product_atlas_ids + resource_graph_ids
```

Reviewed package может быть показан на `50`. Только finding со статусом `accepted` может появиться на `40`, создать `ProblemBubble` или стать источником accepted UI gap; hotspot этого не делает. Package и его provenance после ingest не переписываются — новая ревизия публикуется как новая immutable identity.

`common-analytics` остаётся источником общей methodology/schema guidance, но не является runtime input или direct Product Atlas input. Product-specific campaign, analysis, finding, decision и evidence package остаются в `events-bot-new`.

## 6. Visual foundations

Product Atlas наследует семантику LoveKGD:

- semantic color roles;
- Inter typography roles;
- 4px spacing scale;
- radii, borders и elevation;
- focus и keyboard behavior;
- 44px interaction target;
- reduced-motion и high-contrast правила;
- iconography semantics.

Первая версия может использовать проверяемый compact token snapshot с exact design-system revision. Это не делает Product Atlas источником tokens.

## 7. Internal visualization components

Namespace:

```text
Visualization/ProductModel/*
Internal/ProductAtlas/*
```

Минимальный набор:

| Component | Contract |
|---|---|
| `ProductEntityCard` | type, stable ID, title, owner, purpose, relations, facets |
| `StakeholderLane` | user, owner/operator или future partner |
| `JobNode` | Job context, start/terminal summary и outcome links |
| `OutcomeNode` | user/owner/partner outcome, evidence state |
| `CapabilityNode` | capability, journeys, product/UI coverage |
| `StatusFacetStrip` | independent definition/delivery/release/runtime/outcome states |
| `ProblemBubble` | type, S/M/L impact, affected IDs, sources and owner |
| `CoverageCell` | context tuple and implementation/test/release/live vector |
| `AnalysisFindingCard` | analysis record, finding, confidence and limitations |
| `IncidentMarker` | incident, affected context and recovery state |
| `DecisionCallout` | options, owner and decision deadline |
| `EvidenceLink` | immutable source/provenance reference |
| `Legend` | complete semantic status grammar |

Компоненты могут быть неполными в первой версии. Missing/fragmented component coverage отображается как данные Product Atlas, а не скрывается.

## 8. Product Problem Radar

`00 — Executive / Problem Radar` содержит до семи generated problem bubbles.

Источники первой версии:

- release/checklist blockers;
- acceptance gaps;
- incidents;
- requirement conflicts;
- missing component / visual evidence / design drift;
- accepted analysis findings;
- decision-required records.

Raw DB metrics plugin не интерпретирует.

Bubble types:

- product gap;
- coverage gap;
- runtime incident;
- evidence gap;
- decision gap;
- design drift.

Размер только `S/M/L`; continuous opaque score запрещён.

## 9. Product Atlas plugin UX

Пользователь открывает отдельный plugin один раз.

Максимум три действия:

1. `Проверить актуальность` — optional preflight;
2. `Обновить Product Atlas` — единственная mutation-команда;
3. `Собрать системный промпт` — feedback output.

`Обновить Product Atlas` — единственная команда, которая читает выбранный immutable reviewed catalog/package и меняет managed Product Atlas projection. Plugin не имеет live DB connection, не опрашивает production DB/raw analytics и не выполняет background refresh, timer/polling или mutation при открытии файла. `Проверить актуальность` только сравнивает явные snapshot identities и ничего не обновляет; каждая новая ревизия требует отдельной пользовательской команды `Обновить Product Atlas`.

Запрещены действия:

```text
import-design-system
update-resource-graph
update-page-manually
continue-next-batch
copy-all-components
write-to-github
close-comments-automatically
```

## 10. Reuse proven orchestration, not the user-facing plugin

Из Resource Graph 004a.2 переиспользуются внутренние принципы:

- one catalog per update;
- exact catalog/source identity;
- schema/hash validation;
- managed shared plugin data;
- idempotent whole-system reconciliation;
- checkpoints and resume;
- fail-closed update;
- preservation of foreign objects and comments;
- one final report.

Рекомендуется вынести повторяемые pure helpers в internal source module/build step. Две published plugin bundles остаются независимыми.

## 11. Update semantics

### Stable entity identity

Managed element key строится из product entity ID, а не из координат или текста.

### Non-structural update

Изменение status, finding или short value обновляет managed child shapes in place, чтобы сохранить:

- board position;
- spatial memory;
- native comment attachment;
- stable element identity.

### Structural update

Изменение entity type, relation topology или page responsibility создаёт versioned replacement. Комментированное старое состояние переносится в `89 — Decision archive`.

### Snapshot identity

Каждый update фиксирует:

```text
product_model_sha
product_analysis_revision
release/checklist revision
incident revision
design_token_revision
renderer_version
catalog_sha256
```

Generic `CURRENT` запрещён. Актуальность показывается отдельно по model, evidence, incidents, visual resources и review.

## 12. Комплексная обратная связь

Комментарии могут находиться на разных pages и сущностях. Product Atlas plugin собирает один prompt по всем незакрытым комментариям или по явно выбранному scope.

Каждая запись prompt включает:

- Penpot page;
- managed board ID;
- entity type и stable ID;
- stakeholder lane;
- Job / journey / capability / scenario links;
- status facets;
- source/evidence/analysis refs;
- catalog revision;
- Penpot thread number;
- exact comment text.

Prompt начинается с системной задачи:

```text
Рассмотри все комментарии как один связанный продуктовый review.
Не превращай каждый комментарий автоматически в отдельную UI-задачу.
Сначала восстанови затронутые Jobs, outcomes, journeys и capabilities.
Объедини дубли, выяви противоречия и сквозные причины.
```

Затем он требует:

1. problem statements без преждевременного решения;
2. impact по user/owner/future partner outcomes;
3. варианты решения;
4. последствия для UX, UI/design system, implementation, acceptance, statistics и docs;
5. список owner decisions;
6. ссылки на все исходные comments.

Plugin не закрывает comments, не создаёт Issues и не меняет product model. Результат после проверки сохраняется в `events-bot-new` как analysis/decision record.

## 13. Penpot MCP

Penpot MCP остаётся вспомогательным инструментом для read/inspect и candidate prototyping.

Он не используется как canonical sync, потому что Product Atlas plugin обязан обеспечивать:

- wrong-file guard;
- exact catalog identity;
- managed ownership;
- idempotency;
- comment preservation;
- deterministic prompt.

## 14. Pilot acceptance

Первая версия должна доказать в реальном Penpot:

- отдельный manifest и plugin name;
- отказ Product Atlas plugin в design-system-файле;
- отказ Resource Graph plugin в Product Atlas-файле;
- one update action;
- action-map projection только на существующие pages `40`/`50`, без page `45`;
- ingest immutable reviewed evidence package с deep links на Resource Graph `90–93`;
- доказанное отсутствие live DB connection и background refresh;
- один Job, два journeys и 5–8 capabilities;
- problem radar;
- независимые status facets;
- missing component coverage;
- один analysis finding и один incident/gap;
- comments на нескольких pages;
- один системный prompt со всеми comments и provenance;
- повторный preflight с нулём pending managed changes;
- понятный PDF без зависимости только от цвета.

# LoveKGD Design System — Penpot delivery and review layer

Этот репозиторий содержит Penpot-инструменты для бренда «Полюбить Калининград» и продукта «Полюбить Калининград Анонсы».

Канонический UI-код, продуктовая модель и production identity остаются в [`onedayonemasterpiece/events-bot-new`](https://github.com/onedayonemasterpiece/events-bot-new). Penpot не становится вторым источником истины.

## Два отдельных Penpot-контура

### 1. Resource Graph — дизайн-система

Отдельный Penpot-файл и plugin для:

- native Colors и Typographies;
- icon component masters;
- core/product components и variants;
- patterns и page archetypes;
- actual/baseline/diff evidence;
- visual review и comments.

Текущий опубликованный foundation — Resource Graph `004a.2`. Он создаёт native resources одной операцией, но ещё не объявляет полными accepted-production archetypes и multi-resolution evidence.

Moving manifest:

```text
https://cdn.jsdelivr.net/gh/onedayonemasterpiece/lovekgd-design-system@resource-graph-004a-live/prototypes/penpot-resource-graph-004a/dist/manifest.json
```

Кандидат `004a.3` добавляет fail-closed защиту: Resource Graph отказывается работать в Product Atlas-файле.

Документы:

- [Resource Graph 004](docs/resource-graph-004.md);
- [plugin contract](contracts/resource-graph-004.plugin.json);
- [iconography contract](contracts/resource-graph-004.iconography.json);
- [installable 004a delivery](prototypes/penpot-resource-graph-004a/README.md).

### 2. Product Atlas — продуктовая доска

Отдельный Penpot-файл и отдельный plugin для:

- stakeholder lanes;
- Jobs, outcomes, journeys и capabilities;
- stories/enablers и readiness;
- Product Problem Radar;
- coverage gaps, incidents и analysis findings;
- одного системного prompt из комментариев по всей доске.

Product Atlas **не импортирует Resource Graph catalog** и не имеет `library:write`. Он использует отдельные:

```text
manifest
catalog kind
managed namespace
page allowlist
file-kind guard
```

Pilot `001` имеет статус `CODE-READY / HOST-UNVERIFIED`.

Документы и код:

- [Product Atlas Penpot boundary](docs/product-atlas-penpot-extension.md);
- [plugin contract](contracts/product-atlas-001.plugin.json);
- [pilot README](prototypes/penpot-product-atlas-001/README.md);
- [pilot status](prototypes/penpot-product-atlas-001/STATUS.md).

## Почему plugins разделены

Resource Graph и Product Atlas имеют разные catalogs, сущности, update cadence и feedback semantics. Один переключаемый plugin повышал бы риск импортировать дизайн-систему на продуктовую доску или создать продуктовые карточки в design-system-файле.

Совместная приёмка требует симметричной защиты:

```text
Product Atlas plugin + design-system marker
→ fail closed

Resource Graph plugin + Product Atlas marker
→ fail closed
```

Внутренние orchestration helpers могут переиспользоваться, но published manifests, namespaces и mutation commands остаются независимыми.

## Общие доказанные механизмы

Penpot tooling уже использует:

- exact catalog/source identity;
- schema/hash validation;
- managed plugin metadata;
- idempotent whole-system update;
- checkpoint/resume;
- preservation of foreign objects и native comments;
- deterministic comment-to-prompt flow;
- fail-closed semantics.

Product Atlas применяет их к продуктовой модели, но не получает доступ к статистическим БД и не интерпретирует raw metrics. На доску попадают только зафиксированные evidence и reviewed analysis records из `events-bot-new`.

## Product Atlas pages

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

## Feedback loop

На Product Atlas можно оставить комментарии на разных managed cards. Plugin собирает их в один prompt с entity IDs, stakeholder lanes, Job/journey/capability links, status facets, source refs и Penpot thread numbers.

```text
comments across Product Atlas
→ one systemic ChatGPT review
→ reviewed analysis / decision record in events-bot-new
→ candidate product/design/implementation changes
→ acceptance and production evidence
→ next board snapshot
```

Plugin не создаёт GitHub Issues, не закрывает comments и не меняет production автоматически.

## Исторические прототипы

- [Runtime Review 003](prototypes/penpot-as-is-runtime-003/README.md);
- [Runtime Review 003.1](prototypes/penpot-as-is-runtime-0031/README.md);
- [Runtime Review 003.2](prototypes/penpot-as-is-runtime-0032/README.md);
- [Review plugin experiments](prototypes/penpot-review-plugin/README.md).

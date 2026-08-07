# LoveKGD Design System — Penpot delivery and review layer

Этот репозиторий содержит инструментальный контур отображения и согласования дизайн-системы бренда «Полюбить Калининград» и продукта «Полюбить Калининград Анонсы» в Penpot.

Канонический код и production identity остаются в [`onedayonemasterpiece/events-bot-new`](https://github.com/onedayonemasterpiece/events-bot-new). Penpot не становится вторым источником истины.

## Текущее состояние

### Runtime Review 003.2 — проверенный evidence transport

003.2 доказал:

- импорт exact runtime screenshots;
- SHA-256 и source provenance;
- native Penpot comments;
- deterministic comment-to-prompt flow;
- host-safe batching;
- recovery после Penpot React `#185` crash;
- очистку только managed staging без удаления foreign boards и comments.

Проверенная immutable-сборка:

```text
https://cdn.jsdelivr.net/gh/onedayonemasterpiece/lovekgd-design-system@16699ff75f92b3964bda8a935b6be9b000569635/prototypes/penpot-as-is-runtime-0032/dist/manifest.json
```

Она остаётся техническим AS-IS evidence layer. Её зелёный `CURRENT` означает соответствие 46 screenshot-boards старому каталогу `003.2`; это не означает полноту дизайн-системы.

### Resource Graph 004 — целевая поставка

004 превращает evidence layer в связанную дизайн-систему:

```text
accepted production release
→ production-only inventory
→ Penpot Colors and Typographies
→ component masters and variants
→ product patterns
→ archetypes assembled from instances
→ separate automated actual/baseline/diff screenshots
→ comments scoped to resource, component, archetype or evidence
```

Ключевые контракты:

- [Resource Graph 004](docs/resource-graph-004.md);
- [one-update plugin contract](contracts/resource-graph-004.plugin.json).

Продуктовый inventory contract хранится в `events-bot-new`:

- `site/src/data/design-system-production-surface-contract.v1.json`;
- `site/scripts/check-design-system-production-surface-contract.mjs`;
- `docs/features/static-site-pages/design-system/penpot-resource-graph-004.md`.

## Скриншоты и компоненты

Скриншоты не удаляются. Они становятся отдельным видом проверяемого evidence:

```text
90 — Evidence / desktop
91 — Evidence / tablet
92 — Evidence / mobile
93 — Evidence / interaction and accessibility
```

Каждый обязательный архетип связан с:

- `actual` screenshot из автоматического теста;
- `approved-baseline`, если baseline утверждён;
- `diff`, если actual отличается;
- test ID, run ID, exact repo SHA, build ID и data snapshot.

На resource/archetype pages находятся component instances и связи. На evidence pages — то, что фактически отрисовал браузер.

## Источник инвентаризации

004 не использует старый ручной `/lab/design-system/` как источник перечня.

Текущими считаются только:

- HTML routes из одного принятого production artifact;
- page sources, соответствующие этим routes на exact release SHA;
- transitively imported production components;
- brand/PWA assets, вошедшие в тот же release.

`/lab`, preview fixtures, detached prototypes и deprecated zero-consumer implementations не попадают в current library. Они остаются candidate/archive/technical evidence.

## Один запуск на обновление

Пользователь открывает plugin один раз. Максимум три действия:

1. **Проверить актуальность** — optional, preflight также выполняется автоматически.
2. **Обновить дизайн-систему** — единственная mutation-команда.
3. **Собрать промпт по комментариям**.

Нет и не будет ручных действий `обновить страницу`, `импортировать следующий компонент` или `продолжить следующий пакет`.

`Обновить дизайн-систему` самостоятельно выполняет:

```text
catalog verification
→ interrupted-operation recovery
→ colors
→ typographies
→ components
→ variants
→ patterns
→ archetypes
→ evidence pages for all viewports
→ component↔archetype↔evidence links
→ comments/review preservation
→ final verification and one report
```

Внутренние batch/retry/page-switch операции остаются деталями оркестрации и не превращаются в повторяющиеся действия пользователя.

## Структура Resource Graph 004

```text
00 — System map
10 — Brand assets
20 — Foundations
30 — Core UI resources
40 — Announcements components
50 — Product patterns
60 — Page archetypes
70 — Coverage and fragmentation
80 — Candidate review
89 — Review archive
90 — Evidence / desktop
91 — Evidence / tablet
92 — Evidence / mobile
93 — Evidence / interaction and accessibility
99 — Technical tests
```

Подробные исторические контракты:

- [Prototype 003](prototypes/penpot-as-is-runtime-003/README.md);
- [Prototype 003.1](prototypes/penpot-as-is-runtime-0031/README.md);
- [Prototype 003.2](prototypes/penpot-as-is-runtime-0032/README.md).

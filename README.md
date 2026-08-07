# LoveKGD Design System — Penpot delivery and review layer

Этот репозиторий содержит инструментальный контур отображения и согласования дизайн-системы бренда «Полюбить Калининград» и продукта «Полюбить Калининград Анонсы» в Penpot.

Канонический код и production identity остаются в [`onedayonemasterpiece/events-bot-new`](https://github.com/onedayonemasterpiece/events-bot-new). Penpot не становится вторым источником истины.

## Текущее состояние

### Runtime Review 003.2 — опубликованный evidence transport

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

### Resource Graph 004 — целевая поставка, manifest ещё не опубликован

На текущем этапе для 004 приняты и проверяются machine-readable contracts. **Устанавливаемой manifest-ссылки Resource Graph 004 пока нет.** Плагин 003.2 нельзя использовать для создания native Colors, Typographies, icon masters, component masters, variants и archetype instances: его объектная модель ограничена screenshot-boards.

004 должен превратить evidence layer в связанную дизайн-систему:

```text
accepted production release
→ production-only component and iconography inventory
→ Penpot Colors, Typographies and native vector Icon resources
→ component masters and variants
→ product patterns
→ archetypes assembled from instances
→ separate automated actual/baseline/diff screenshots
→ comments scoped to resource, icon, component, archetype or evidence
```

Ключевые контракты:

- [Resource Graph 004](docs/resource-graph-004.md);
- [one-update plugin contract](contracts/resource-graph-004.plugin.json);
- [iconography delivery contract](contracts/resource-graph-004.iconography.json).

Продуктовый inventory contract хранится в `events-bot-new`:

- `site/src/data/design-system-production-surface-contract.v1.json`;
- `site/src/data/design-system-iconography-contract.v1.json`;
- `site/scripts/check-design-system-production-surface-contract.mjs`;
- `site/scripts/check-design-system-iconography-contract.mjs`;
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

## Iconography

Iconography выделяется в отдельную плоскость:

```text
25 — Iconography
```

Она содержит native vector component masters и specimens для:

- system/actions;
- navigation;
- status/feedback;
- social/external services;
- transport;
- festival/editorial categories;
- product-specialized symbols;
- optical alignment, sizes and accessibility;
- duplicates, legacy and unclassified assets.

Current icons определяются только по accepted production release. Иконка, которая просто лежит в Git, остаётся candidate/legacy/unused/unclassified до доказанного consumer. PWA и favicon artwork остаются на `10 — Brand assets`, но получают cross-links.

## Источник инвентаризации

004 не использует старый ручной `/lab/design-system/` как источник перечня.

Текущими считаются только:

- HTML routes из одного принятого production artifact;
- page sources, соответствующие этим routes на exact release SHA;
- transitively imported production components and icons;
- brand/PWA assets, вошедшие в тот же release.

`/lab`, preview fixtures, detached prototypes и deprecated zero-consumer implementations не попадают в current library. Они остаются candidate/archive/technical evidence.

## Один запуск на обновление

Пользователь открывает plugin один раз. Максимум три действия:

1. **Проверить актуальность** — optional, preflight также выполняется автоматически.
2. **Обновить дизайн-систему** — единственная mutation-команда.
3. **Собрать промпт по комментариям**.

Нет и не будет ручных действий `обновить страницу`, `импортировать следующую иконку`, `импортировать следующий компонент` или `продолжить следующий пакет`.

`Обновить дизайн-систему` самостоятельно выполняет:

```text
catalog verification
→ interrupted-operation recovery
→ colors
→ typographies
→ iconography inventory, masters and specimens
→ components
→ variants
→ patterns
→ archetypes and icon-consumer links
→ evidence pages for all viewports
→ resource↔archetype↔evidence links
→ comments/review preservation
→ final verification and one report
```

Внутренние batch/retry/page-switch операции остаются деталями оркестрации и не превращаются в повторяющиеся действия пользователя.

## Структура Resource Graph 004

```text
00 — System map
10 — Brand assets
20 — Foundations
25 — Iconography
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

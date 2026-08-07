# LoveKGD Design System — Penpot review layer

Этот репозиторий содержит инструментальный контур отображения и согласования дизайн-системы бренда «Полюбить Калининград» и продукта «Полюбить Калининград Анонсы» в Penpot.

Канонический код действующей дизайн-системы остаётся рядом с production-потребителем — в [`onedayonemasterpiece/events-bot-new`](https://github.com/onedayonemasterpiece/events-bot-new):

- нормативный контракт: `docs/features/static-site-pages/design-system/README.md`;
- semantic tokens: `site/src/styles/design-system.css`;
- primitive Astro components: `site/src/components/design-system/`;
- product components: `site/src/components/`;
- runtime-каталог: `site/src/pages/lab/design-system/index.astro` → `/lab/design-system/`.

Penpot не является вторым источником истины и не содержит вручную перерисованных «похожих» компонентов. Он получает проверяемое представление точного Astro runtime из Git.

## Текущая поставка

**Penpot Runtime Review 003.2** связывает три контура:

1. foundations, primitive UI, продуктовые компоненты, состояния и реестр версий берутся из реального runtime-кода сайта;
2. плагин создаёт девять именованных Penpot pages и синхронизирует exact desktop/mobile screenshots с Git provenance и SHA-256;
3. native Penpot comments сохраняются при обновлении артефакта и превращаются в детерминированный implementation prompt с exact source SHA, route, viewport и source URL.

Patch `003.2` устраняет реальный host crash Penpot Cloud `2.17.1-RC5` с React error `#185`:

- media загружаются до page/board mutations;
- элементы группируются по целевой странице;
- каждая страница открывается не более одного раза на фазу;
- mutations объединяются в native Penpot undo blocks;
- за один пакет изменяется не более четырёх boards, между пакетами есть settle barrier;
- сохраняется durable checkpoint: phase, page, element, index и sync run ID;
- после аварийного завершения удаляются только managed boards с `lane=staging`;
- foreign boards, technical fixtures и native comments не удаляются;
- retired boards получают `lane=trash` до verification, поэтому не создают duplicate-current state.

Проверенная поставка:

- publication/public-delivery smoke: [`run 31163780657`](https://github.com/onedayonemasterpiece/lovekgd-design-system/actions/runs/31163780657) — `success`;
- immutable plugin commit: [`16699ff75f92b3964bda8a935b6be9b000569635`](https://github.com/onedayonemasterpiece/lovekgd-design-system/commit/16699ff75f92b3964bda8a935b6be9b000569635);
- pinned UI commit: [`8cf3c007c462a20bdc252d5685adf3d4dfe54c23`](https://github.com/onedayonemasterpiece/lovekgd-design-system/commit/8cf3c007c462a20bdc252d5685adf3d4dfe54c23);
- merged implementation: [`8d6c7e090051322d2f7d5c56ebaa916d8184f274`](https://github.com/onedayonemasterpiece/lovekgd-design-system/commit/8d6c7e090051322d2f7d5c56ebaa916d8184f274);
- product runtime source: `events-bot-new@c6a679dbbb3bbd65eb096becbd5976e7ccd67a26`;
- catalog: `9` именованных страниц, `46` exact runtime artifacts, desktop + mobile, `0` capture errors.

## Установка в Penpot

Immutable manifest:

```text
https://cdn.jsdelivr.net/gh/onedayonemasterpiece/lovekgd-design-system@16699ff75f92b3964bda8a935b6be9b000569635/prototypes/penpot-as-is-runtime-0032/dist/manifest.json
```

Обновляемая ссылка текущего patch:

```text
https://cdn.jsdelivr.net/gh/onedayonemasterpiece/lovekgd-design-system@penpot-runtime-0032-live/prototypes/penpot-as-is-runtime-0032/dist/manifest.json
```

Для воспроизводимого review используется immutable URL с commit SHA.

## Структура Penpot-файла

- `00 — System map`;
- `20 — Foundations`;
- `30 — Core UI`;
- `40 — Announcements components`;
- `60 — Page archetypes`;
- `70 — AS-IS registry`;
- `80 — Candidate review`;
- `90 — Review archive`;
- `99 — Technical tests`.

Старый технический прототип переводится в `99 — Technical tests`. Чужие и вручную созданные boards плагин не удаляет.

## Рабочий цикл

```text
Git / Astro runtime
→ Проверить актуальность
→ Безопасно убрать interrupted staging, если он есть
→ Синхронизировать именованные страницы
→ Оставить native Penpot comments
→ Собрать prompt по незакрытым комментариям
→ Сделать candidate preview отдельно от AS-IS
→ Получить sign-off владельца продукта
→ Изменить канонический код в events-bot-new
→ Пересобрать exact runtime mirror
```

Подробные контракты:

- [`Prototype 003 — exact AS-IS runtime`](prototypes/penpot-as-is-runtime-003/README.md);
- [`Prototype 003.1 — diagnostics and transport-safe media`](prototypes/penpot-as-is-runtime-0031/README.md);
- [`Prototype 003.2 — host-safe resumable sync`](prototypes/penpot-as-is-runtime-0032/README.md).

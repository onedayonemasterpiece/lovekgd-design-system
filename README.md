# LoveKGD Design System — Penpot review layer

Этот репозиторий содержит **инструментальный контур отображения и согласования** дизайн-системы бренда «Полюбить Калининград» и продукта «Полюбить Калининград Анонсы» в Penpot.

Канонический код действующей дизайн-системы остаётся рядом с production-потребителем — в [`onedayonemasterpiece/events-bot-new`](https://github.com/onedayonemasterpiece/events-bot-new):

- нормативный контракт: [`docs/features/static-site-pages/design-system/README.md`](https://github.com/onedayonemasterpiece/events-bot-new/blob/main/docs/features/static-site-pages/design-system/README.md);
- semantic tokens: `site/src/styles/design-system.css`;
- primitive Astro components: `site/src/components/design-system/`;
- product components: `site/src/components/`;
- реальный runtime-каталог: `site/src/pages/lab/design-system/index.astro` → `/lab/design-system/`.

Penpot не является вторым источником истины и не содержит вручную перерисованных «похожих» компонентов. Он получает проверяемое представление точного Astro runtime из Git.

## Текущая поставка

**Penpot Runtime Review 003.1** завершает три связанных контура:

1. **Дизайн-система:** foundations, primitive UI, продуктовые компоненты, состояния и реестр версий отображаются из реального runtime-кода сайта.
2. **Отображение в Penpot:** плагин создаёт девять именованных страниц и синхронизирует exact desktop/mobile screenshots с Git provenance и SHA-256.
3. **Обратная связь:** штатные Penpot comments сохраняются при обновлении артефакта; плагин собирает из незакрытых комментариев детерминированный промпт с exact source SHA, route, viewport и ссылкой на исходник.

Patch `003.1` добавляет:

- подробную копируемую диагностику с incident ID, фазой, точным элементом, страницей, индексом, попыткой, source artifact, transport payload, версией Penpot и читаемыми полями исходной ошибки;
- последовательную media-загрузку с ограничением до трёх попыток;
- bounded WebP transport derivative для необычно длинных, крупных или сильно уменьшаемых screenshots;
- раздельные source и transport hashes/dimensions, поэтому transport-оптимизация не подменяет канонический Git-артефакт;
- очистку неуспешного staging при сохранении существующих current и чужих boards.

Проверенная поставка:

- публикация и public-delivery smoke: [`run 31159712780`](https://github.com/onedayonemasterpiece/lovekgd-design-system/actions/runs/31159712780) — `success`;
- immutable plugin commit: [`ef47cd0a9b5b0a96d8bc70ca809596e5613c41f2`](https://github.com/onedayonemasterpiece/lovekgd-design-system/commit/ef47cd0a9b5b0a96d8bc70ca809596e5613c41f2);
- pinned UI commit: [`00e00cac159ca61fdd4de3dea368460386ef723d`](https://github.com/onedayonemasterpiece/lovekgd-design-system/commit/00e00cac159ca61fdd4de3dea368460386ef723d);
- merged implementation: [`66f87536908a40b63de39b6d222757e786fa555a`](https://github.com/onedayonemasterpiece/lovekgd-design-system/commit/66f87536908a40b63de39b6d222757e786fa555a);
- product runtime source: [`events-bot-new@c6a679dbbb3bbd65eb096becbd5976e7ccd67a26`](https://github.com/onedayonemasterpiece/events-bot-new/commit/c6a679dbbb3bbd65eb096becbd5976e7ccd67a26);
- каталог: `9` именованных страниц, `46` exact runtime artifacts, desktop + mobile, `0` capture errors.

## Установка плагина в Penpot

В Penpot откройте **Plugins → Install plugin** и вставьте immutable manifest URL:

```text
https://cdn.jsdelivr.net/gh/onedayonemasterpiece/lovekgd-design-system@ef47cd0a9b5b0a96d8bc70ca809596e5613c41f2/prototypes/penpot-as-is-runtime-0031/dist/manifest.json
```

Обновляемая ссылка для текущего проверенного patch:

```text
https://cdn.jsdelivr.net/gh/onedayonemasterpiece/lovekgd-design-system@penpot-runtime-0031-live/prototypes/penpot-as-is-runtime-0031/dist/manifest.json
```

Для воспроизводимого review предпочтительна immutable-ссылка с commit SHA.

## Структура Penpot-файла

Плагин создаёт и поддерживает страницы:

- `00 — System map`;
- `20 — Foundations`;
- `30 — Core UI`;
- `40 — Announcements components`;
- `60 — Page archetypes`;
- `70 — AS-IS registry`;
- `80 — Candidate review`;
- `90 — Review archive`;
- `99 — Technical tests`.

Старый технический прототип не смешивается с системой: его страница переводится в `99 — Technical tests`. Чужие и вручную созданные boards плагин не удаляет.

## Рабочий цикл

```text
Git / Astro runtime
→ Проверить актуальность
→ Синхронизировать именованные страницы
→ Оставить native Penpot comments на конкретных boards
→ Собрать промпт по незакрытым комментариям
→ Сделать candidate preview отдельно от AS-IS
→ Получить sign-off владельца продукта
→ Изменить канонический код в events-bot-new
→ Пересобрать exact runtime mirror
```

Правила безопасного обновления:

- неизменившийся screenshot → `noop`;
- изменившийся screenshot без комментариев → замена current board;
- изменившийся screenshot с комментариями → старый board сохраняется как review snapshot, новый становится current;
- удалённый artifact с комментариями → сохраняется как review evidence;
- все новые boards сначала проходят staging;
- ошибка hash, download, upload или verification останавливает синхронизацию и выдаёт копируемую element-level диагностику;
- при ошибке staging удаляется, а current mirror не переключается частично.

Подробные контракты:

- [`Prototype 003 — exact AS-IS runtime`](prototypes/penpot-as-is-runtime-003/README.md);
- [`Prototype 003.1 — diagnostics and transport-safe media`](prototypes/penpot-as-is-runtime-0031/README.md).

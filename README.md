# LoveKGD Design System — Penpot review layer

Этот репозиторий содержит **инструментальный контур отображения и согласования** дизайн-системы бренда «Полюбить Калининград» и продукта «Полюбить Калининград Анонсы» в Penpot.

Канонический код действующей дизайн-системы остаётся рядом с единственным production-потребителем — в [`onedayonemasterpiece/events-bot-new`](https://github.com/onedayonemasterpiece/events-bot-new):

- нормативный контракт: [`docs/features/static-site-pages/design-system/README.md`](https://github.com/onedayonemasterpiece/events-bot-new/blob/main/docs/features/static-site-pages/design-system/README.md);
- semantic tokens: `site/src/styles/design-system.css`;
- primitive Astro components: `site/src/components/design-system/`;
- product components: `site/src/components/`;
- реальный runtime-каталог: `site/src/pages/lab/design-system/index.astro` → `/lab/design-system/`.

Penpot не является вторым источником истины и не содержит вручную перерисованных «похожих» компонентов. Он получает проверяемое представление точного Astro runtime из Git.

## Текущая поставка

**Prototype 003** завершает три связанных контура:

1. **Дизайн-система:** foundations, primitive UI, продуктовые компоненты, состояния и реестр версий отображаются из реального runtime-кода сайта.
2. **Отображение в Penpot:** плагин создаёт девять именованных страниц и синхронизирует exact desktop/mobile screenshots с Git provenance и SHA-256.
3. **Обратная связь:** штатные Penpot comments сохраняются при обновлении артефакта; плагин собирает из незакрытых комментариев детерминированный промпт с exact source SHA, route, viewport и ссылкой на исходник.

Проверенная поставка:

- GitHub Actions run: [`31155694854`](https://github.com/onedayonemasterpiece/lovekgd-design-system/actions/runs/31155694854) — `success`;
- опубликованный commit: [`2d917d1e39dbcac5ee9e88bcc6dd9f988e4b688c`](https://github.com/onedayonemasterpiece/lovekgd-design-system/commit/2d917d1e39dbcac5ee9e88bcc6dd9f988e4b688c);
- product runtime source: [`events-bot-new@c6a679dbbb3bbd65eb096becbd5976e7ccd67a26`](https://github.com/onedayonemasterpiece/events-bot-new/commit/c6a679dbbb3bbd65eb096becbd5976e7ccd67a26);
- каталог: `9` именованных страниц, `46` exact runtime artifacts, desktop + mobile, `0` capture errors.

## Установка плагина в Penpot

В Penpot откройте **Plugins → Install plugin** и вставьте immutable manifest URL:

```text
https://cdn.jsdelivr.net/gh/onedayonemasterpiece/lovekgd-design-system@2d917d1e39dbcac5ee9e88bcc6dd9f988e4b688c/prototypes/penpot-as-is-runtime-003/dist/manifest.json
```

Для последующих проверенных выпусков существует обновляемая ссылка на live ref:

```text
https://cdn.jsdelivr.net/gh/onedayonemasterpiece/lovekgd-design-system@penpot-as-is-live/prototypes/penpot-as-is-runtime-003/dist/manifest.json
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

Старый технический прототип на безымянной странице не смешивается с системой: его страница переводится в `99 — Technical tests`. Чужие и вручную созданные boards плагин не удаляет.

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
- ошибка hash, download, upload или verification останавливает синхронизацию и откатывает переключение current mirror.

Подробный контракт Prototype 003: [`prototypes/penpot-as-is-runtime-003/README.md`](prototypes/penpot-as-is-runtime-003/README.md).

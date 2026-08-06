# Penpot review-plugin prototype 001

Цель прототипа — проверить только следующий цикл:

```text
Git specimen + Git metadata + Git prompt template
→ импорт в текущий Penpot-файл
→ обычный комментарий Penpot внутри board
→ чтение незакрытых комментариев Plugin API
→ детерминированный промпт для нового окна ChatGPT
```

Плагин не проектирует компонент, не меняет значения и не обращается к Penpot REST API. Визуальный артефакт, metadata и prompt template находятся в этом репозитории. При повторном импорте существующий board не перезаписывается, чтобы не потерять комментарии.

## Результат ручного smoke — PASS

Дата: 2026-08-06.

Фактически подтверждено в Penpot Cloud:

1. установлен immutable plugin manifest;
2. создан board `Button / Primary / Smoke` из Git-снимка;
3. board получил стабильный ID `core.button.smoke` и source revision;
4. владелец оставил штатный Penpot-comment внутри board;
5. plugin прочитал незакрытый комментарий без повторного выделения board;
6. plugin сформировал и скопировал детерминированный prompt;
7. prompt содержал точный текст комментария: `У кнопки нужно поменять цвет`.

Прототип ничего не отправлял в GitHub или Supabase. Комментарий остался в Penpot; готовый prompt был помещён только в локальный буфер обмена.

## Что не доказано прототипом 001

- обновление уже размещённого board после изменения Git-источника;
- обновление данных без переустановки plugin;
- сохранение истории комментариев между ревизиями элемента;
- работа с десятками и сотнями boards;
- фотографии и другие растровые assets;
- большие наборы SVG и иконок;
- автоматическое создание review bundle.

Эти вопросы переходят в prototype 002A/002B и не должны считаться решёнными результатом prototype 001.

## Источники прототипа

- [`data/review-manifest.json`](data/review-manifest.json) — metadata и prompt template;
- [`data/core.button.smoke.svg`](data/core.button.smoke.svg) — точный импортируемый specimen;
- [`dist/plugin.js`](dist/plugin.js) — узкий мост Git → Penpot comments → prompt;
- [`dist/ui.html`](dist/ui.html) — интерфейс plugin.

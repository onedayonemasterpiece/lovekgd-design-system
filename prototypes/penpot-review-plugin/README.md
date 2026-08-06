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

## Что проверяет smoke

1. Установить плагин по выданному immutable manifest URL.
2. Открыть плагин и нажать **«Импортировать specimen из Git»**.
3. Убедиться, что появился board `Button / Primary / Smoke`.
4. Поставить обычный комментарий Penpot внутри board.
5. Выбрать board и нажать **«Прочитать выбранный board и комментарии»**.
6. Проверить текст и нажать **«Скопировать промпт»**.

PASS означает, что готовый промпт содержит:

- `core.button.smoke`;
- Git source URL;
- source revision и версию элемента;
- точный текст незакрытого комментария Penpot.

## Источники прототипа

- [`data/review-manifest.json`](data/review-manifest.json) — metadata и prompt template;
- [`data/core.button.smoke.svg`](data/core.button.smoke.svg) — точный импортируемый specimen;
- [`dist/plugin.js`](dist/plugin.js) — узкий мост Git → Penpot comments → prompt;
- [`dist/ui.html`](dist/ui.html) — интерфейс плагина.

# Penpot review-plugin prototype 002A

## Цель

Проверить, что один установленный plugin может получать новые Git-ревизии без переустановки и безопасно добавлять их в существующий Penpot-файл:

```text
mutable Git catalog
→ plugin UI загружает catalog и immutable SVG
→ проверяет SHA-256
→ plugin сравнивает contentHash с boards в Penpot
→ создаёт новую revision board рядом
→ старые boards и Penpot-comments сохраняются
```

Plugin не пишет в GitHub или Supabase. Обновление запускается только вручную кнопкой владельца.

## Почему данные загружает UI

Prototype 001 показал, что runtime `fetch()` из основного plugin-контекста нестабилен. В 002A сеть использует обычный HTTPS UI iframe Penpot, а основной plugin получает уже проверенный catalog через штатный `postMessage`.

Источник каталога:

```text
https://raw.githack.com/onedayonemasterpiece/lovekgd-design-system/penpot-catalog-live/prototypes/penpot-review-plugin-002a/catalog/catalog.json
```

Catalog mutable только как указатель на актуальную ревизию. Каждый SVG внутри него ссылается на exact Git commit и сопровождается SHA-256.

## Первый smoke: 0.0.1 → 0.0.2 — PASS

Ручной Penpot Cloud smoke пройден 2026-08-06.

Подтверждено по визуальному evidence владельца:

- рядом с исходным `core.button.smoke` version `0.0.1` создан board `Button / Primary / Smoke · v0.0.2`;
- новый board содержит метку `LIVE CATALOG · R1`;
- старый board не удалён;
- исходный Penpot-comment остался привязан к старому board;
- у новой ревизии корректно показано `Комментарии: 0`;
- повторная проверка вернула `core.button.smoke: 0.0.2 → 0.0.2; noop`;
- кнопка создания новой ревизии стала недоступна, то есть дубликат не создаётся.

Таким образом, доказаны revision-safe создание и идемпотентная повторная проверка для одного SVG-элемента.

## Второй smoke без переустановки: 0.0.2 → 0.0.3

После первого PASS live catalog обновлён до:

```text
catalogRevision: 002a-r2
element version: 0.0.3
source revision: 7557c30154de71e3d520fa6e5c09190b54bf8acd
visual marker: LIVE CATALOG · R2
```

Тот же уже установленный plugin должен:

1. без переустановки выполнить **«Проверить обновления из Git»**;
2. показать `core.button.smoke: 0.0.2 → 0.0.3; create-revision`;
3. создать третий board справа;
4. сохранить boards `0.0.1` и `0.0.2`, а также исходный comment;
5. после повторной проверки вернуть `0.0.3 → 0.0.3; noop`.

Только этот второй smoke доказывает независимое обновление данных без переустановки plugin.

## Политика ревизий prototype 002A

- совпадающий `contentHash` → `noop`;
- новый элемент → новый board;
- изменившийся элемент → новый revision board;
- предыдущие boards не удаляются;
- metadata предыдущих boards получают `revisionStatus: superseded`;
- comments Penpot не переносятся и остаются на той визуальной ревизии, к которой были поставлены;
- удаление элементов из catalog в этом prototype не обрабатывается.

## Не входит в 002A

- массовая нагрузка;
- фотографии и растровые assets;
- пакетный импорт сотен SVG;
- Supabase review lifecycle;
- автоматический фоновой sync;
- обновление production.

Эти вопросы относятся к prototype 002B/003.

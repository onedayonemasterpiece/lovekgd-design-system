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

## Первый smoke: 0.0.1 → 0.0.2

Предусловие: на текущей Penpot page уже существует board prototype 001 с `core.button.smoke`, version `0.0.1` и комментарием.

1. Установить immutable manifest prototype 002A.
2. Нажать **«Проверить обновления из Git»**.
3. Ожидается строка:

```text
core.button.smoke: 0.0.1 → 0.0.2; create-revision; комментариев: 1
```

4. Нажать **«Создать новую ревизию рядом»**.
5. Справа от старого board должен появиться `Button / Primary / Smoke · v0.0.2` с меткой `LIVE CATALOG · R1`.
6. Старый board и его Penpot-comment должны остаться без изменений.
7. Повторное нажатие **«Проверить обновления из Git»** должно вернуть `noop`.

## Второй smoke без переустановки

После PASS первого smoke catalog branch будет обновлён до `0.0.3`. Тот же уже установленный plugin должен увидеть новую ревизию и создать третий board. Только этот второй smoke доказывает обновление данных без переустановки plugin.

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

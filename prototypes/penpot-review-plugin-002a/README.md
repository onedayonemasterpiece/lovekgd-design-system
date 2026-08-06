# Penpot review-plugin prototype 002A

## Цель

Проверить, что один установленный plugin может получать новые Git-ревизии без переустановки и безопасно добавлять их в существующий Penpot-файл:

```text
mutable Git pointer
→ resolve current Git commit
→ fetch immutable catalog and assets
→ compare contentHash with Penpot boards
→ create new revision board рядом
→ preserve old boards and Penpot comments
```

Plugin не пишет в GitHub или Supabase. Обновление запускается только вручную кнопкой владельца.

## Результаты

### Первый цикл: PASS

Подтверждено вручную в Penpot Cloud:

- `core.button.smoke` обновлён с `0.0.1` до отдельного board `0.0.2`;
- исходный board и комментарий сохранены;
- повторная проверка вернула `noop`;
- duplicate board не создан.

### Второй цикл исходной 002A: FAIL

После публикации `0.0.3` установленный plugin продолжал получать `catalogRevision: 002a-r1` и `0.0.2 → 0.0.2; noop` даже после нескольких ручных проверок.

Причина: mutable URL `raw.githack.com/.../penpot-catalog-live/.../catalog.json` обслуживался устаревшим CDN-кэшем. Query-параметр не гарантировал обновление branch content. Поэтому branch URL нельзя использовать как надёжный latest pointer.

### Исправление 002A.1

Новая доставка выполняется в два шага:

1. UI plugin получает актуальный commit SHA ветки `penpot-catalog-live` через GitHub REST API `git/ref/heads/...`;
2. catalog загружается по immutable URL с точным commit SHA;
3. каждый SVG также остаётся pinned to exact commit и проверяется по SHA-256.

Таким образом, mutable только Git ref lookup; все содержательные данные читаются по неизменяемым адресам.

## Повторный smoke 002A.1

Предусловие: на текущей Penpot page уже существуют boards `0.0.1` и `0.0.2`, а исходный комментарий сохранён.

1. Установить immutable manifest `002A.1`.
2. Нажать **«Проверить обновления из Git»**.
3. Ожидается:

```text
Catalog revision: 002a-r2
core.button.smoke: 0.0.2 → 0.0.3; create-revision
```

4. UI должен отдельно показать resolved `Branch SHA` и immutable catalog URL.
5. Нажать **«Создать новую ревизию рядом»**.
6. Должен появиться `Button / Primary / Smoke · v0.0.3` с меткой `LIVE CATALOG · R2`.
7. Старые boards и комментарий должны остаться.
8. Повторная проверка должна вернуть `0.0.3 → 0.0.3; noop`.
9. После PASS будет опубликован ещё один catalog revision; тот же установленный plugin должен увидеть его без переустановки.

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

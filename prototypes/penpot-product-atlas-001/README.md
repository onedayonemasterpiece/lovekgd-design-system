# LoveKGD Product Atlas — pilot 001

Отдельный Penpot plugin для продуктовой доски. Он не является режимом Resource Graph и не импортирует design-system catalog.

## User flow

1. Открыть отдельный чистый Penpot-файл.
2. Установить отдельный Product Atlas manifest.
3. Нажать `Проверить актуальность`.
4. Нажать `Обновить Product Atlas`.
5. Оставить native Penpot comments на разных managed cards.
6. Нажать `Собрать системный промпт` и передать единый prompt в ChatGPT.

## Guards

- catalog kind: `lovekgd-product-atlas`;
- namespace: `lovekgd.productatlas.001`;
- file marker: `product-atlas`;
- Resource Graph / Runtime Review markers cause fail-closed refusal;
- no `library:write` permission;
- only Product Atlas pages are created or changed;
- foreign boards are never deleted.

## Pilot content

- one Job;
- two journeys;
- six capabilities;
- Product Problem Radar;
- coverage matrix with explicit `unknown`;
- analysis-finding placeholder;
- decision workspace;
- design-system evidence links rather than resource import.

## Status boundary

The plugin is syntax/contract validated, but real Penpot host acceptance is still required. The first host test must verify wrong-file refusal, one-update idempotency, comment preservation and systemic prompt construction.


## Immutable delivery chain

The bundle uses a two-stage immutable chain:

```text
installed manifest/plugin commit
→ UI commit 9a4a694bbeae06a79274f6b2391ca1194006e080
→ catalog commit 45f62ce3ea0bd665f972a213c23aef37273f9fb7
```

The UI commit contains the exact catalog URL. The plugin no longer depends on mutable `main`.

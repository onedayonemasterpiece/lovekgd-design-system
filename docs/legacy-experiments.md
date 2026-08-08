# Legacy Penpot experiments 003–005

## Статус

Все перечисленные поколения являются **NONCANONICAL HISTORICAL EVIDENCE**. Они доказали отдельные технические возможности, но не создали принятую компонентную дизайн-систему.

Активный Resource Graph был очищен и пересоздан как пустой TO-BE scaffold. Старые pages, component IDs, variants, screenshots, catalogs и `CURRENT` badges не восстанавливаются и не участвуют в decoder identity.

## Runtime Review 003 / 003.1 / 003.2

Полезные доказанные механизмы:

- import exact runtime screenshots;
- managed metadata;
- comment preservation;
- checkpoint/resume;
- deterministic comment-to-prompt flow;
- basic fail-closed behavior.

Ограничение: managed objects были преимущественно raster evidence boards, а не native component graph.

## Resource Graph 004a / 004b

Полезные эксперименты:

- native colors/typographies/icons;
- creation/reconciliation of Penpot resources;
- component/variant/pattern/archetype concepts;
- preservation/idempotency helpers;
- plugin file-kind boundaries.

Ограничения:

- часть inventories была hard-coded;
- semantic source model не происходила из полного source-first decoder;
- component currentness и production reachability не были доказаны;
- полученные Penpot objects не являются canonical library.

## runtime-derived 005

Намерение: build current site, inspect every generated page, cluster runtime structure/layout and construct a catalog.

Фактический run:

```text
run_id: 31242437901
job_id: 93065530845
source_sha used by run: 260815bf3672261b9e3c03a798f0b77e36d97496
Astro pages built: 469
runtime clusters processed: 390
result: FAIL
error: RangeError: Invalid string length
failure point: JSON.stringify(catalog)
receipt.json: missing
usable artifact: not uploaded
```

Архитектурный вывод:

- нельзя сериализовать весь corpus одним giant JSON;
- route instances не равны component/archetype identities;
- generated pages useful for reachability, fixtures, outliers and evidence;
- source/generator + isolated specimen должны предшествовать page verification;
- outputs должны быть streamed/sharded with partial receipts and `if: always()` artifacts.

## Что разрешено переиспользовать

- runtime capture helpers;
- screenshot and responsive evidence techniques;
- route/outlier diagnostics;
- reconciliation and preservation patterns;
- comment ingestion lessons;
- plugin transport/recovery mechanisms.

## Что запрещено переносить как истину

- старые Penpot component IDs;
- hard-coded component lists;
- DOM-cluster identity;
- screenshots as component masters;
- route-per-archetype model;
- single green `CURRENT` status;
- automatic acceptance of experimental outputs.

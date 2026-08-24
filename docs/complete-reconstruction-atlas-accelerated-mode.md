# Complete Reconstruction Atlas — accelerated reconstruction mode

## Назначение

Режим собирает полный source-conformant атлас текущего сайта без остановки на
owner review каждой волны. Он не выполняет redesign, reverse integration,
promotion, merge или deploy.

## Authority и разделение данных

1. Current Astro source и generated browser output доказывают фактическую
   anatomy, states и responsive branches.
2. Semantic SoT хранится в `catalog/reconstruction-atlas/v1`.
3. Penpot IDs/bindings хранятся только в `penpot/bindings.v1.json`.
4. Browser/Penpot evidence хранится только в `evidence/`.
5. Gap ledger не расширяет taxonomy: отсутствующий route/state остаётся gap,
   а не придуманной реализацией.

## Фазы

### 1. SoT-first, без Penpot

- покрыть 100% archetypes/routes из completion checklist;
- зафиксировать anatomy, states, desktop/mobile/unique branches;
- построить reuse/new map, foundations и stable fixtures;
- полный dense/stress behavior проверять в Astro;
- валидировать source hashes и generated DOM contracts.

### 2. Batch materialization

- masters сразу размещаются на final owner pages;
- archetype proofs используют только linked instances;
- detached copies и unregistered visual overrides запрещены;
- representative instances заменяют длинные production lists;
- один central fix запускает один dependency-closure regression batch;
- уже source-conformant component не пересобирается без owner defect, нового
  structural contract/context или failed regression.

### 3. Единый review handoff

- одна compact review route;
- один gap ledger;
- sampled conformance только для new/changed resources;
- renderer-only deltas non-blocking, если semantics и geometry доказаны;
- никакой пачки per-parent Telegram сообщений.

## Review semantics

| Факт | Статус |
|---|---|
| owner не взаимодействовал с resource | `NOT_REVIEWED` |
| был bounded feedback и correction проверена | `REVIEWED_BY_EXCEPTION` |
| комментарий не записан | `NO_RECORDED_OBJECTION` |
| Astro-conflicting или product change | требуется explicit decision |

`NO_RECORDED_OBJECTION` никогда не означает approval.

## Gates

Перед `RECONSTRUCTION_ATLAS_READY` должны одновременно выполняться:

- archetype coverage `100%`;
- required desktop/mobile/unique states представлены;
- `detached=0`;
- `unregistered overrides=0`;
- Penpot `validate=[]`;
- sampled conformance `PASS` для new/changed resources;
- существует одна review route и актуальный gap ledger;
- production/backport/merge/promotion/deploy не выполнялись.

## Воспроизведение semantic phase

```bash
node scripts/reconstruction-atlas/build-source-atlas.mjs
node scripts/reconstruction-atlas/capture-browser-atlas.mjs
node scripts/reconstruction-atlas/validate-reconstruction-atlas.mjs
node --test tests/reconstruction-atlas-v1.test.mjs
```

Browser capture по умолчанию использует `http://127.0.0.1:4322`; путь к
Astro worktree и origin можно переопределить `EVENTS_BOT_ROOT` и
`ATLAS_ASTRO_ORIGIN`.

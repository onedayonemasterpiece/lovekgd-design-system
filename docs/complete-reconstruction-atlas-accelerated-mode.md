# Complete Reconstruction Atlas — compatibility pointer

The canonical operating contract is now
[`accelerated-reconstruction-mode.md`](accelerated-reconstruction-mode.md),
pinned to the verified green PR #44 handoff. This file remains only so older
links do not break. Its former Penpot review-route and source-state-index rules
are superseded: Penpot now stores native UI only; operational state remains in
Git.

## Назначение

Режим собирает полный source-conformant атлас текущего сайта без остановки на
owner review каждой волны. Он не выполняет redesign, reverse integration,
promotion, merge или deploy.

## Authority и разделение данных

1. Current Astro source и generated browser output доказывают фактическую
   anatomy, states и responsive branches.
2. Approved semantic SoT хранится в `catalog/global-archetype-sot-v1` и в
   hash-bound foundations/fixtures/reuse/gap inputs из
   `catalog/reconstruction-atlas/v1`.
3. Penpot хранит только native UI; IDs/bindings и operational data остаются в
   Git receipts.
4. Browser/Penpot evidence хранится только в Git evidence/receipts и не
   материализуется как Penpot UI.
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
- representative instances заменяют длинные production lists, а полный
  dense/stress/full-list проверяется в generated Astro;
- один central fix запускает один dependency-closure regression batch;
- уже source-conformant component не пересобирается без owner defect, нового
  structural contract/context или failed regression.

### 3. Owner review handoff

- 17 прямых ссылок на реальные UI owner pages `63.01`–`63.17`;
- без `63.00`, dashboard, source-state index или service-only boards;
- desktop/mobile Astro↔Penpot comparison для каждой archetype family;
- renderer-only deltas non-blocking только если они объяснены и semantics и
  geometry доказаны.

Owner review remains explicit. Отсутствие комментария никогда не означает
approval.

## Gates

Перед `RECONSTRUCTION_ATLAS_READY` должны одновременно выполняться:

- archetype coverage `100%`;
- required desktop/mobile UI and visible unique states представлены;
- `detached=0`;
- `unregistered overrides=0`;
- Penpot `validate=[]`;
- conformance `PASS` для каждой archetype family;
- owner получил прямые ссылки на 17 real UI pages;
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

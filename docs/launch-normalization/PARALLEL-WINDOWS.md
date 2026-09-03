# Параллельные окна — автономная работа внутри turn

Статус: `ACTIVE`  
Координация: `onedayonemasterpiece/events-bot-new#621`  
Contract: `launch-normalized-ui.v1.yaml@1.7.0`

## 1. Исполнительная модель

ChatGPT-окно не работает после завершения turn, но это **не** делает его
одноразовым исполнителем одной микрозадачи. Внутри каждого запуска оно обязано
самостоятельно обработать весь доступный role backlog:

```text
получить полный role contour и стартовый backlog
→ выполнить первый item
→ fresh-read issue/refs/source
→ сформировать следующий item
→ выполнить его
→ повторять до реального исчерпания owned scope или platform limit
```

Остановленное окно при наличии ready owned work — простаивающий ресурс. K0 обязан
дать работу каждому доступному окну, а не сводить всю программу к R0.

## 2. Общий продуктовый gate

```text
exact reachable normalized /<buildId>/__preview/
→ V0 DOM/computed-style verdict
→ исправление critical DRIFT
→ ASTRO_NORMALIZATION_PASS
→ thin S / Penpot / release candidate
```

## 3. N0 — acceptance, generation, integration, release

Стартовый backlog текущего turn:

1. Fresh-read current integration и latest F0/M0/A0 refs/results.
2. Лично review branch deltas и определить, что входит в ближайший
   browser-testable candidate, а что остаётся следующим candidate без задержки
   первого preview.
3. Проверить existing export/build/publication path и acceptance criteria.
4. Поддерживать end-to-end conditional authority для R0 без baseline-only stop.
5. После любого R0 checkpoint прочитать output/ancestry/checks и принять либо
   отклонить результат.
6. Довести N0 contour до exact reachable preview, V0 trigger и review verdict.
7. После каждого checkpoint пересчитать следующий N0 backlog: integration,
   generation, publication, rollback, release evidence и V0 drift routing.

N0 не завершает turn на dispatch, policy comment, candidate review или baseline.

## 4. F0 — foundations saturation

Current head:

```text
work/ui-normalization-f0-wave-3-20260903@
bc1f566b6845557983042d8ed27ea94a6f572507
```

Стартовый backlog:

1. Read-only census latest A0 и M0 heads против central foundations.
2. Проверить новые Home/Free/Unusual/Gastronomy/PersonalFeed/focus/service/
   partnership/event-detail/rail consumers на raw colours, same-role duplicates,
   local type/spacing/radius/border/elevation и icon roles вне
   `inline=16`, `control=20`, `action=24`, `feature=32`.
3. Добавить либо объединить необходимые central aliases только в F0 paths.
4. Удалить duplicate F0-owned token/style owners, сохраняя лишь доказанные
   compatibility bridges.
5. Публиковать exact binding table для A0/M0, не ожидая ответа.
6. После каждого commit заново сканировать следующий foundation cluster и
   продолжать до verified zero ready F0 items.

Writable paths:

```text
site/src/styles/design-system.css
site/src/components/design-system/**
site/src/components/Icon.astro
site/src/components/SocialIcon.astro
site/src/components/brand/**
```

## 5. M0 — family, framing, grids and rails saturation

Current head:

```text
work/ui-normalization-m0-continuity-20260903@
00ef7b689cc5d040bd0099962576cadcd88270f7
```

Стартовый backlog:

1. Полный recensus card/media/grid lookalikes после нового A0 head.
2. Проверить и укрепить canonical `EventMediaRail` variants:
   `gallery-thumbnails`, `hero-selector`, `poster-strip`.
3. Довести shared MediaFrame ownership: один protocol/anatomy/CSS owner в M0
   roots; убрать remaining duplicate framing responsibility в M0 paths.
4. Добавить regression coverage для rail variants, grid live-region API,
   ListingEventCard metadata bridge и reserved attributes.
5. Проверить, что AdaptiveEventCardGrid public API покрывает latest A0 consumers;
   при доказанном API gap расширить M0 root.
6. Публиковать exact migration/removal boundary для A0 и продолжать следующий
   M0-owned lookalike.

Writable paths:

```text
site/src/lib/relatedCardLayout.mjs
site/src/components/OptimizedEventCardGrid.astro
site/src/components/AdaptiveEventCardGrid.astro
site/src/components/EventCard.astro
site/src/components/listings/ListingEventCard.astro
site/src/components/EventMediaRail.astro
exact assigned card/media roots
```

## 6. A0 — actual consumer saturation

Current head:

```text
work/ui-normalization-a0-wave-3-20260903@
651f6a8e58bcad06859e42eee87b2b337bd1c536
```

Стартовый backlog:

1. Fresh-read latest F0 `bc1f566...` и M0 `00ef7b6...` APIs.
2. Replace remaining consumer-local grids/wrappers/media owners:
   - `DesktopEventPage.astro` inline rails → EventMediaRail variants;
   - `PersonalFeedSlot.astro` → canonical live-region Adaptive grid host;
   - Popular personalized wrappers → ListingEventCard metadata bridge;
   - `MobileEventReviewPage.astro` plain grid → AdaptiveEventCardGrid;
   - remaining Home/Free/Unusual/Gastronomy/search/collection/focus consumers
     found by current census.
3. Apply latest F0 aliases and exactly-four icon roles.
4. Remove orphan route/layout CSS owners made obsolete by M0/F0 APIs.
5. Run a fresh actual-route/consumer census after every batch and immediately
   take the next A0 item.

A0 never edits M0 canonical roots. DateListingSurface and
WeekendListingSurface remain distinct compositions.

## 7. V0 — available audit work before normalized preview

Current independent work is not limited to waiting for URL.

Стартовый backlog:

1. Fresh-read latest F0/M0/A0 heads; previous harness deltas used older ancestry.
2. Update selectors/signatures/negative probes for new EventMediaRail variants,
   shell/event-detail foundations, latest consumer migrations, icon roles and
   MediaFrame diagnostics.
3. Run source negative probes against current refs for wrappers, local grids,
   duplicated rails, raw visible values and missing family markers.
4. Through my-browser-bridge inspect the currently reachable production product
   as a before-baseline where routes are available; record DOM/computed-style,
   framing and grid measurements for before/after comparison.
5. If a normalized preview appears during the same turn, immediately execute the
   full route/viewport audit without another planning pass.
6. Enter trigger standby only after all source and current-browser work is
   exhausted.

V0 remains read-only and never delegates browser observation.

## 8. R0 — native materialization backlog

R0 concurrently builds/verifies candidates, executes generation/publication,
runs local smoke, integrates ready accepted role outputs and processes ready V0
fixes. R0 does not absorb semantic work that F0/M0/A0 can perform in parallel.

## 9. Exit evidence

No worker may stop merely because its seed list ended. It must derive the next
item from current source, invariants, tests, refs and issue state.

Legitimate exit:

```text
ready_owned_items: 0
remaining_external_trigger: <exact role/result/url>
```

or a genuine product/safety/writer/platform boundary.

`wake → one item → [RESULT] → stop` while source still contains owned work is
`BACKLOG_NOT_FORMING`.

# Параллельные окна — автономная работа внутри turn

Статус: `ACTIVE`  
Координация: `onedayonemasterpiece/events-bot-new#621`  
Contract: `launch-normalized-ui.v1.yaml@1.8.0`

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

## 2. Ресурсная экономика: день и ночь

Codex — дефицитный local-runtime ресурс. ChatGPT role windows — основной ресурс
анализа, решений и direct GitHub implementation.

### DAY_PARALLEL — окна доступны

```text
N0/F0/M0/A0/V0 максимально разгружают R0
R0 тратится только на то, где нужен local runtime, cross-branch materialization
или executable verification
```

Role windows обязаны самостоятельно выполнять:

- repository/source/consumer census;
- semantic, product и architecture decisions;
- крупные coherent direct GitHub batches в своих paths;
- source-negative probes и проектирование regression checks;
- полный diff/readback review;
- подготовку merge-ready branches и точных acceptance/removal boundaries.

R0 в дневном режиме выполняет преимущественно:

- candidate construction и branch integration;
- dependency install, local shell и runtime diagnostics;
- tests/build/checks;
- generation, publication и release mechanics;
- ordinary merge conflict resolution;
- deterministic bulk edit только когда он действительно существенно дешевле,
  чем работа активного specialist window;
- local browser smoke, но не независимый V0 verdict.

R0 не повторяет анализ или реализацию, уже выполняемую активным F0/M0/A0/N0/V0.
Перед изменением role-owned source он проверяет latest role ref/activity и
предпочитает принять, интегрировать и проверить specialist branch.

### NIGHT_AUTONOMOUS — окна не используются

Ночью R0 получает расширенный reversible engineering contour и самостоятельно
ведёт backlog до product gate. Он может выполнять source census, implementation
и migrations, однозначно следующие existing behavior и invariants. Даже ночью
нельзя давать ему задачу «A+B и остановись через полчаса».

## 3. Codex admission gate

Работа допускается в R0, когда истинно хотя бы одно:

- требуется local shell/dependency/runtime environment;
- нужен cross-branch merge или candidate construction;
- нужны executable tests/build/generation;
- требуется artifact/preview publication;
- нужен ordinary merge-conflict repair;
- это большой детерминированный mechanical edit, который объективно дешевле;
- specialist недоступен, а reversible critical-path work иначе остановится.

Работа остаётся в окнах, если это:

- анализ source/consumers;
- semantic token, component identity или route-composition decision;
- обычная direct GitHub правка в scope активного specialist;
- review, который уже принадлежит N0/F0/M0/A0/V0;
- формирование backlog и следующего product slice.

Каждый role result должен быть merge-ready и не заставлять R0 повторно проводить
семантическое исследование.

## 4. Общий продуктовый gate

```text
exact reachable normalized /<buildId>/__preview/
→ V0 DOM/computed-style verdict
→ исправление critical DRIFT
→ ASTRO_NORMALIZATION_PASS
→ thin S / Penpot / release candidate
```

## 5. N0 — acceptance, generation, integration, release

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

N0 не передаёт R0 candidate analysis, ancestry decision или acceptance review.
N0 не завершает turn на dispatch, policy comment, candidate review или baseline.

## 6. F0 — foundations saturation

Current head разрешается заново при fresh-read; стартовый checkpoint:

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

F0 сам выполняет central CSS/TS/Astro edits через GitHub. R0 получает только
локальную проверку и интеграцию готового F0 batch.

## 7. M0 — family, framing, grids and rails saturation

Current head разрешается заново при fresh-read; стартовый checkpoint:

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
4. Добавить regression coverage specification для rail variants, grid
   live-region API, ListingEventCard metadata bridge и reserved attributes.
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

M0 сам проектирует и пишет canonical roots. R0 не должен заново проектировать
MediaFrame, rails или grids при активном M0.

## 8. A0 — actual consumer saturation

Current head разрешается заново при fresh-read; стартовый checkpoint:

```text
work/ui-normalization-a0-wave-3-20260903@
651f6a8e58bcad06859e42eee87b2b337bd1c536
```

Стартовый backlog:

1. Fresh-read latest F0 и M0 APIs.
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
WeekendListingSurface remain distinct compositions. A0 сам делает migration
batches через GitHub; R0 не дублирует их, а интегрирует и запускает runtime tests.

## 9. V0 — available audit work before normalized preview

Стартовый backlog:

1. Fresh-read latest F0/M0/A0 heads.
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

V0 remains read-only and never delegates browser observation. R0 may perform
local smoke only; V0 keeps independent verdict capacity.

## 10. R0 — scarce native materialization lane

R0 concurrently builds/verifies candidates, executes generation/publication,
runs local smoke and integrates ready accepted role outputs.

В DAY_PARALLEL режиме R0 не поглощает specialist backlog. Приоритет:

```text
готовая merge-ready role branch
→ bounded integration-risk review
→ merge/candidate
→ tests/build/generation/publication
→ вернуть только материальный defect owning role
```

В NIGHT_AUTONOMOUS режиме R0 расширяет reversible implementation scope и сам
продолжает продуктовый backlog.

После каждого checkpoint R0 публикует:

```text
local_runtime_work_completed
role_outputs_integrated_or_verified
Codex_only_implementation_and_why
blind_wait_seconds: 0
duplicated_specialist_work: 0
```

## 11. Exit evidence

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

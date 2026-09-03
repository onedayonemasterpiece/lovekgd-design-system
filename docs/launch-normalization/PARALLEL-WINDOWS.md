# Параллельная работа окон — нормализация UI KenigEvents

Статус: `ACTIVE`  
Координация: `onedayonemasterpiece/events-bot-new#621`

Окна являются самостоятельными владельцами полных продуктовых контуров, а не
очередью микрозадач. Wave, commit и `[RESULT]` — checkpoint, но не граница turn.
Владелец не является scheduler, message bus или источником следующей задачи.

## 1. Путь к продукту

```text
N0 ведёт candidate review → baseline → integration → fresh generation → preview
+ F0 непрерывно закрывает foundations/tokens/icons по всему actual-consumer census
+ M0 непрерывно закрывает component roots/framing/adaptive rows/rail families
+ A0 непрерывно мигрирует actual routes, shell и все допустимые consumers
+ V0 готовит и затем выполняет полный browser audit
+ R0 непрерывно выполняет ready safe mechanical backlog
→ exact reachable normalized /<buildId>/__preview/
→ V0 DOM/computed-style PASS или DRIFT
→ owning roles закрывают critical DRIFT
→ owner-facing normalized preview
→ thin S + native Penpot masters/linked instances
→ ASTRO_NORMALIZATION_PASS
→ product UI-gap/change work
```

Technical baseline нужен для before/after, но не является обязательным owner
review. Family не завершена без fresh-real-data build и V0 browser verdict.
`T+0` — clock, не permission gate.

## 2. Execution surfaces

```yaml
K0: ChatGPT + GitHub
N0: ChatGPT + GitHub
F0: ChatGPT + GitHub
M0: ChatGPT + GitHub
A0: ChatGPT + GitHub
V0: ChatGPT + GitHub + my-browser-bridge
R0: native Codex + local shell/git/gh
```

K0/N0/F0/M0/A0 не вызывают и не диспетчеризуют `Codex DevCoveer`.
ChatGPT roles лично читают source/consumers/voice notes, принимают решения,
делают bounded GitHub edits, проверяют R0 output и сами выбирают следующий item.
R0 выполняет только already-decided mechanical work. Browser evidence — V0.

## 3. Continuous owner protocol

```text
fresh-read issue/current refs/source
→ пересчитать unresolved owned backlog
→ выбрать highest-value safe reversible item
→ исследовать и принять решение
→ реализовать и лично проверить
→ при необходимости опубликовать checkpoint
→ fresh-read снова
→ взять следующий item
→ продолжать до фактического convergence frontier
```

`finish with [RESULT]` означает только «не завершай plan-only status». Оно не
означает остановку после результата.

### Приоритет backlog

1. critical build/preview defect в owned scope;
2. незакрытый mandatory normalization invariant;
3. actual consumer, ещё не связанный с canonical family/token/API;
4. duplicate owner/fork/internal override;
5. regression coverage принятого решения;
6. routed V0 DRIFT;
7. следующий product slice из canonical route/family census.

### Допустимое завершение

Turn завершается только при одном из состояний:

```yaml
OWNED_BACKLOG_EXHAUSTED:
  independent_work_remaining: false
  exact_resume_trigger: recorded

HARD_BOUNDARY:
  genuine_product_decision_or_writer_conflict_or_irreversible_risk: true

PLATFORM_LIMIT:
  actual_context_tool_or_runtime_limit: true
```

Нельзя завершаться из-за одного commit, одной Wave, одного `[RESULT]`, dispatch,
worktree, теста, ожидания preview/integration при наличии другой owned работы,
missing field или отсутствующего formal packet.

## 4. Critical path without ping-pong

### N0

N0 владеет единой цепочкой:

```text
candidate acceptance
→ same-data baseline
→ conditional promotion
→ fresh-production generation
→ exact reachable preview
→ V0 trigger
→ V0 verdict review
```

Если acceptance criteria известны, authorization для R0 должна сразу задавать:

```text
IF baseline/build/checks PASS
  THEN promote exact candidate
  AND run fresh generation/publication
  AND return exact reachable preview
ELSE
  no promotion/deploy
  continue safe diagnosis
  publish one factual defect
```

N0 не заканчивает turn на dispatch или baseline-only gate.

### R0

R0 — persistent native session. После результата он fresh-read-ит #621/refs и
берёт следующую ready safe mechanical task. При ожидаемом trigger:

```text
poll issue/current refs every 60–120 seconds for up to 30 minutes
→ execute trigger immediately
```

R0 останавливается лишь при отсутствии ready work после bounded watch либо на
hard safety/semantic boundary.

### V0

После полного harness preparation V0 может ждать физически отсутствующий
preview. Когда URL появился, один run покрывает полный route/viewport matrix,
DRIFT routing и доступную повторную проверку.

## 5. Role ownership and continuous backlog

### N0 — generation, integration, preview, release

N0 owns candidate review, snapshot/generation flow, same-data baseline,
conditional promotion, integration branch, fresh preview publication, V0 trigger,
verdict review, status и release decisions. N0 не читает runtime SQLite;
read-only fallback разрешён только R0 при доказанной необходимости.

### F0 — foundations, colors, typography, spacing, icons

Writable paths:

```text
site/src/styles/design-system.css
site/src/components/design-system/**
site/src/components/Icon.astro
site/src/components/SocialIcon.astro
site/src/components/brand/**
```

Read-only census охватывает весь actual product. F0 продолжает, пока остаются:

- visible raw/same-role duplicate colors без central semantic alias;
- локальные type/spacing/radius/border/elevation/layer values, которым нужен
  общий role;
- icon dimensions/actions вне exactly four roles/canonical SVG;
- legacy style owner, перекрывающий canonical owner;
- новые A0/M0 consumers, которым требуется exact token binding.

F0 пишет central roles только в своих paths и публикует точные binding tables
для consumer owners; он не ждёт preview для source-level token work.

### M0 — component roots, MediaFrame, cards, adaptive rows, media rails

Writable paths:

```text
site/src/lib/relatedCardLayout.mjs
site/src/components/OptimizedEventCardGrid.astro
site/src/components/AdaptiveEventCardGrid.astro
site/src/components/EventCard.astro
site/src/components/listings/ListingEventCard.astro
site/src/components/EventMediaRail.astro
other exact assigned card/media roots
```

Mandatory donors:

```text
docs/features/static-site-pages/image-framing.md
site/src/lib/relatedCardLayout.mjs
site/src/components/OptimizedEventCardGrid.astro
```

M0 продолжает, пока остаются lookalikes или family work, включая:

- named `EventMediaRail` variants для production hero selector и poster strip;
- один доказанный owner MediaFrame protocol/implementation без page-local framing;
- remaining EventCard/ListingEventCard/media consumers с duplicate anatomy/CSS;
- AdaptiveEventCardGrid API/diagnostics для ещё не мигрированных consumers;
- source/build/V0 drift, адресованный M0.

M0 может читать consumer paths, но пишет только canonical roots; A0 выполняет
actual consumer replacement в своих assigned files.

### A0 — shell, routes и actual consumer migration

Base writable paths:

```text
site/src/layouts/**
site/src/components/listings/**
site/src/pages/**
```

`site/src/components/listings/ListingEventCard.astro` остаётся M0-owned.

Для полного consumer convergence A0 дополнительно владеет только следующими
exact consumer paths; canonical M0 roots в них импортируются, но не копируются:

```text
site/src/components/HomeColdStartFeed.astro
site/src/components/FreeCollectionSurface.astro
site/src/components/UnusualListingSurface.astro
site/src/components/GastronomyCollectionSurface.astro
site/src/components/PersonalFeedSlot.astro
site/src/components/MobileEventReviewPage.astro
site/src/components/DesktopEventPage.astro  # только после готового M0 rail API
site/src/components/FocusGroupFeedback.astro
site/src/components/FocusGroupInviteIntake.astro
site/src/components/FocusGroupInviteShare.astro
site/src/components/FocusGroupLabPanel.astro
site/src/components/FocusPwaInstallAction.astro
```

Текущий independent backlog включает:

- `HomeColdStartFeed`: wrapper/local grid → AdaptiveEventCardGrid, rerank metadata
  на direct EventCard roots;
- `FreeCollectionSurface`: два независимых timed/exhibition grids, без смешения;
- `UnusualListingSurface`: wrapper metadata → direct EventCard roots;
- `GastronomyCollectionSurface`: future/recent grids с сохранением группировки;
- `PersonalFeedSlot`: canonical adaptive runtime host и удаление duplicate
  grid/equal-height/media CSS;
- technical review surface и class-only Button consumers → canonical roots;
- `DesktopEventPage` inline rail lookalikes → named EventMediaRail variants после
  публикации M0 API/removal boundary.

A0 не редактирует `EventCard`, `ListingEventCard`, `AdaptiveEventCardGrid` или
`EventMediaRail`; он использует их public APIs. DateListingSurface и
WeekendListingSurface остаются разными compositions.

### V0 — browser/DOM/computed audit

Read-only. Проверяет `/`, date/weekend, free, popular, exhibitions, festivals и
real event detail на desktop wide, desktop compact, mobile 390–430 и required
breakpoint seams. Измеряет DOM anatomy, markers, computed foundations, framing,
row occupancy/equal heights, responsive transitions и overflow.

### K0

K0 исправляет process/canonical drift сам, не создаёт micro-wave scheduling и не
объявляет scope exhausted без actual-consumer census.

### R0

R0 выполняет isolated worktrees, tests/build/merge/promotion и authorized Penpot
mutation. Он восстанавливает выводимые сведения и исправляет recoverable local
tooling defects в authorized scope.

## 6. Anti-idle rule

F0/M0/A0 не могут объявить `OWNED_BACKLOG_EXHAUSTED`, пока current source всё ещё
содержит перечисленные выше actual consumer forks/lookalikes и роль может
безопасно двигать свой непересекающийся контур. Первый preview не блокирует эту
следующую source wave: N0/R0 работают с замороженным candidate, а role branches
продолжаются параллельно для следующего integration checkpoint.

V0 является единственным ожидаемым zero-cost standby до физического preview URL.

## 7. Main UI invariants

- same visual/behaviour component → one Astro family root/variant family;
- one anatomy/CSS owner;
- one canonical SVG per semantic action;
- complete actual-consumer inventory;
- stable family/version/variant/applicable state diagnostics;
- all visible colors tokenized; same-role duplicates merged;
- exactly four central icon-size roles; local dimensions forbidden;
- shared MediaFrame owns ratio/fit/crop/focal/clip/fallback/loading;
- one AdaptiveEventCardGrid family covers applicable multi-card surfaces;
- Penpot uses native master/variant families and linked route instances;
- UI-gap/redesign starts only after `ASTRO_NORMALIZATION_PASS`.

## 8. Communication

Issue #621 is durable state. `[RESULT]` is a checkpoint, not automatic role exit.
Packet, dispatch, worktree, commit without role review, test without output, 404
route and empty Penpot object are not owner-facing product results.

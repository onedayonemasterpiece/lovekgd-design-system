# Параллельная работа окон — нормализация UI KenigEvents

Статус: `ACTIVE`  
Координация: `onedayonemasterpiece/events-bot-new#621`

Окна работают не как очередь микрозадач, а как самостоятельные владельцы
полных продуктовых контуров. Native Codex выполняет mechanical work. Владелец не
является scheduler, message bus или источником следующего шага после каждого
commit.

## 1. Путь к продукту

```text
N0 ведёт candidate review → generation → integration → reachable preview
+ F0 насыщает foundations/tokens/icons во всех owned consumers
+ M0 нормализует component roots/framing/adaptive rows
+ A0 мигрирует actual routes/shell/consumers
+ V0 готовит и затем выполняет browser audit
+ R0 непрерывно выполняет ready safe mechanical work
→ fresh normalized /<buildId>/__preview/
→ V0 DOM/computed-style PASS или DRIFT
→ owning roles закрывают critical DRIFT
→ owner-facing normalized preview
→ thin S + native Penpot masters/linked instances
→ ASTRO_NORMALIZATION_PASS
→ product UI-gap/change work
```

Technical baseline нужен для before/after, но не является обязательным owner
review. Family не считается завершённой без fresh-real-data build и V0 browser
verdict.

`T+0` — clock, а не permission gate.

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

ChatGPT role windows лично:

- читают issue, refs, source, consumers и relevant voice notes;
- принимают semantic/product/architecture decisions;
- делают bounded direct GitHub edits;
- дают native R0 только уже решённую mechanical работу;
- читают и принимают либо отклоняют R0 output;
- после каждого checkpoint пересчитывают свой backlog и продолжают.

V0 лично наблюдает browser. R0 не подменяет browser verdict.

## 3. Continuous owner protocol

### 3.1. Checkpoint не является концом turn

Wave, branch, commit и `[RESULT]` используются как versioned checkpoint. Они не
являются границей работы роли.

```text
fresh-read
→ построить current role backlog
→ выбрать highest-value safe item
→ исследовать и принять решение
→ реализовать/review
→ при необходимости опубликовать checkpoint
→ fresh-read
→ взять следующий item
→ повторять до backlog exhaustion
```

Старые инструкции `finish with [RESULT]` трактуются только как запрет plan-only
status. Они не означают `после результата остановись`.

### 3.2. Приоритет следующей работы

1. critical build/preview defect в owned scope;
2. незакрытый mandatory normalization invariant;
3. actual consumer, ещё не связанный с canonical API/token/family;
4. duplicate owner, fork или internal override;
5. regression coverage для уже принятого решения;
6. новый DRIFT, адресованный роли;
7. следующий product slice из canonical path.

Отдельный owner-authored packet или список следующей Wave не нужен.

### 3.3. Допустимое завершение

Role turn завершается только при одном из состояний:

```yaml
OWNED_BACKLOG_EXHAUSTED:
  independent_work: 0
  remaining_trigger: exact external role/result/url

HARD_BOUNDARY:
  product_decision_or_writer_conflict_or_irreversible_risk: true

PLATFORM_LIMIT:
  actual_context_or_tool_runtime_limit: true
```

Нельзя завершаться на одном commit, dispatch, packet, worktree, тесте,
rehearsal, numbered Wave или ожидании dependent surface при наличии другой
owned работы.

Standby допустим только при `OWNED_BACKLOG_EXHAUSTED`. Он сохраняет exact trigger
и не просит владельца придумать задачу.

### 3.4. Platform wake-up

Завершённый ChatGPT turn не запускается сам. Поэтому процесс обязан редко
создавать turn boundary:

- одна role session берёт несколько backlog items подряд;
- per-Wave resume запрещён;
- K0 объединяет remaining backlog в одно continuous-run correction;
- владелец подключается только при реальном product/safety decision либо после
  внешнего trigger, физически появившегося позже.

## 4. Critical path without ping-pong

### N0

N0 владеет полной цепочкой:

```text
candidate acceptance
→ same-data baseline
→ conditional promotion
→ fresh-production generation
→ exact reachable preview
→ V0 trigger
→ V0 verdict review
```

N0 не дробит эту цепочку на несколько owner wake-ups, если acceptance criteria
можно определить заранее.

Mechanical authorization для R0 должен быть end-to-end conditional:

```text
IF exact baseline/checks PASS
  THEN promote accepted candidate
  AND run fresh generation
  AND publish reachable preview
ELSE
  no promotion/deploy
  continue safe diagnosis
  publish factual defect
```

N0 остаётся владельцем решений; R0 исполняет заранее заданную условную ветку.
`GENERATION_EXECUTION_DECISION` или dispatch без conditional path до preview не
является завершением N0.

### R0

R0 — persistent native execution session.

После bounded result он:

1. fresh-read-ит #621/current refs;
2. берёт следующую unambiguous safe mechanical task;
3. продолжает без owner-authored packet;
4. не завершает сессию только потому, что опубликован один result.

Если expected critical-path trigger вероятно появится скоро, R0 использует
bounded watch:

```text
poll issue/current refs every 60–120 seconds
for up to 30 minutes
→ immediately execute the trigger
```

R0 прекращает работу только при отсутствии ready safe task после bounded watch
либо при hard safety/semantic boundary.

### V0

V0 выполняет полный source/harness backlog одним run. После его исчерпания
standby до reachable preview допустим. Когда URL появился, одно возобновление
должно покрыть полный route/viewport matrix, DRIFT routing и повторную проверку
после исправлений в пределах доступного turn.

## 5. Автономное восстановление

Формальные headings и packet fields — удобство, не gate.

Агент выводит сведения из issue #621, current refs, repository state, role
ownership и prose:

- `owner` эквивалентен `requested_by`;
- `branch@sha` разделяется автоматически;
- writable paths section задаёт scope;
- command/test blocks задают mechanical execution;
- target branch выводится детерминированно, если это безопасно.

```text
обнаружил неполноту
→ вывел недостающее
→ проверил reversible scope
→ выбрал safest assumption
→ продолжил работу
→ записал assumption в evidence
```

`[BLOCKER]` допустим только когда независимая работа исчерпана, fallback проверен
и требуется конкретный product decision, внешний ресурс, writer-conflict
resolution или предотвращение irreversible risk.

Recoverable tooling/ENOSPC/aged fixture/stale checkpoint исправляется в
authorized scope. Исправимый canonical drift исправляется до сообщения
владельцу.

## 6. Role ownership and backlog

### N0 — generation, integration, preview, release

GitHub-only ChatGPT owner. Native local execution выполняет R0.

N0 backlog включает:

- current candidate review;
- authoritative snapshot/generation flow;
- same-data before/after baseline;
- conditional promotion criteria;
- integration branch;
- fresh normalized preview publication;
- V0 trigger и verdict review;
- status/release decisions.

N0 не читает runtime SQLite. Build/export output является preferred source
buildId/URL. SQLite read-only fallback допустим только R0 при доказанной
необходимости.

### F0 — foundations, colors, typography, spacing, icons

Writable paths:

```text
site/src/styles/design-system.css
site/src/components/design-system/**
site/src/components/Icon.astro
site/src/components/SocialIcon.astro
site/src/components/brand/**
```

F0 продолжает до convergence frontier:

- all visible colors/token aliases in owned consumers;
- typography/spacing/geometry ownership;
- exactly four icon roles;
- canonical SVG identity;
- duplicate style-owner closure;
- compatibility boundaries with actual consumer proof.

### M0 — component roots, MediaFrame, cards, adaptive rows

Writable paths:

```text
site/src/lib/relatedCardLayout.mjs
site/src/components/OptimizedEventCardGrid.astro
site/src/components/AdaptiveEventCardGrid.astro
site/src/components/EventCard.astro
site/src/components/listings/ListingEventCard.astro
site/src/components/EventMediaRail.astro
other exact assigned card/media paths
```

Mandatory donors:

```text
docs/features/static-site-pages/image-framing.md
site/src/lib/relatedCardLayout.mjs
site/src/components/OptimizedEventCardGrid.astro
```

M0 backlog: family identity, MediaFrame protocol, Adaptive grid consumer API,
actual lookalike/removal boundaries and response to A0/V0 integration defects.

### A0 — shell, listings, routes, consumer migration

Writable paths:

```text
site/src/layouts/**
site/src/components/listings/**
site/src/pages/**
```

`ListingEventCard.astro` остаётся M0-owned.

A0 backlog: actual route composition identity, token/API binding, removal of
page-local forks/overrides, Adaptive-grid/media migration and shell convergence.
DateListingSurface и WeekendListingSurface остаются разными compositions.

### V0 — browser/DOM/computed audit

Read-only. Routes:

```text
/
/segodnya/
/zavtra/
/date-YYYY-MM-DD/
/vyhodnye/
/podborki/besplatnye-sobytiya/
/populyarnoe/
/vystavki/
/festivali/
/sobytiya/<real-slug>/
```

Viewports: desktop wide, desktop compact, mobile 390–430 и required breakpoint
seams.

V0 измеряет DOM anatomy, family markers, computed type/spacing/colors/radii/
borders/icon sizes, framing, row occupancy/equal heights, responsive transitions
и horizontal overflow.

### K0

K0 чинит процесс и canonical docs самостоятельно, не создаёт микроволны и не
предлагает владельцу resume каждого окна после каждого result.

### R0

R0 uses isolated worktrees, local tests/build/merge and authorized Penpot
mutation. Он восстанавливает выводимые поля, исправляет recoverable tooling
problems и автоматически продолжает ready mechanical backlog.

## 7. Main UI invariants

- same visual/behaviour component → один Astro family root/variant family;
- один anatomy/CSS owner;
- один canonical SVG на semantic action;
- complete actual-consumer inventory;
- stable `data-ds-family`, `data-ds-version`, `data-ds-variant`, applicable
  `data-ds-state`;
- all visible colors tokenized; same-role duplicates merged;
- exactly four central icon-size roles; local dimensions forbidden;
- shared MediaFrame owns ratio/fit/crop/focal/clip/fallback/loading;
- one AdaptiveEventCardGrid family covers applicable multi-card surfaces;
- Penpot uses native master/variant families and linked route instances;
- UI-gap/redesign starts only after `ASTRO_NORMALIZATION_PASS`.

## 8. Communication

Issue #621 is durable state. Meaningful events:

```text
[RESULT]
[OWNER_REVIEW_READY]
[DRIFT]
[BLOCKER]
```

A meaningful checkpoint does not automatically end a role. Task dispatch,
packet, worktree, commit without role review, test without output, 404 route and
empty Penpot object are not product results.

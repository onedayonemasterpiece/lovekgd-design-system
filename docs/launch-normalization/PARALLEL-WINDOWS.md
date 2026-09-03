# Параллельная работа окон — нормализация UI KenigEvents

Статус: `ACTIVE`  
Координация: `onedayonemasterpiece/events-bot-new#621`

Этот документ задаёт продуктовую топологию. ChatGPT-окна самостоятельно
исследуют, принимают решения, делают bounded GitHub-изменения и проверяют
результат. Native Codex выполняет только уже определённую механическую работу.
Владелец не является диспетчером, message bus или поставщиком пропущенных полей.

## 1. Путь к результату

```text
N0 определяет и восстанавливает existing fresh-data generation
+ F0/M0/A0 независимо нормализуют current Astro
+ V0 готовит browser harness и проверяет доступные surfaces
→ native R0 выполняет только необходимые shell/worktree/test/build операции
→ N0 принимает mechanical output и интегрирует первую wave
→ fresh normalized /<buildId>/__preview/
→ V0 лично выполняет DOM/computed-style audit
→ owning role исправляет critical DRIFT
→ owner-facing normalized preview
→ следующие waves
→ thin S + native Penpot masters/linked instances
→ ASTRO_NORMALIZATION_PASS
→ product UI-gap/change work
```

Technical baseline нужен для before/after, но не является обязательным owner
review. Family не считается завершённой без fresh-real-data build и V0 browser
verdict.

`T+0` — часы программы, а не permission gate. Он фиксируется по фактическому
старту первой fresh-data generation command, когда F0/M0/A0/V0 уже запущены.

## 2. Исполнительные поверхности

### ChatGPT + GitHub

`K0`, `N0`, `F0`, `M0`, `A0` работают в ChatGPT с GitHub. Они не вызывают и не
диспетчеризуют `Codex DevCoveer`.

Каждое такое окно лично:

- fresh-read-ит issue #621, current refs, relevant source и voice notes;
- принимает semantic, product и architecture decisions в своём scope;
- делает небольшие coherent edits через GitHub;
- формулирует механическую задачу native R0 только когда нужен local shell,
  worktree, mass edit, test, build, merge или Penpot mutation;
- читает R0 output/diff и принимает либо отклоняет его;
- публикует настоящий product result, а не факт dispatch.

### ChatGPT + GitHub + my-browser-bridge

`V0` лично наблюдает браузер и измеряет DOM/computed styles. Browser evidence,
screenshots и PASS/DRIFT нельзя делегировать R0.

### Native Codex

`R0` — одна сессия в настоящем Codex runtime, а не ChatGPT-окно и не вызов через
DevCoveer connector. R0 использует local shell, git и gh.

R0 выполняет только already-decided mechanical work и не выбирает:

- architecture;
- semantic tokens;
- component identity;
- route composition;
- product scope;
- acceptance verdict.

## 3. Автономное восстановление вместо бюрократической остановки

Формальные headings и packet fields являются удобством, но не gate.

Агент обязан сам восстановить выводимые сведения из issue #621, current refs,
repository state, role ownership и prose. Эквивалентные формы нормализуются:

- `owner: M0` → `requested_by: M0`;
- `base: branch@sha` → branch и SHA;
- `Writable paths` → write scope;
- command block → commands/tests;
- `Prohibition` → forbidden actions.

Отсутствующее безопасное branch name выводится детерминированно. Stale SHA той
же программы требует bounded diff/supersession read, а не terminal stop.

```text
обнаружил неполноту
→ вывел недостающее
→ проверил reversible scope
→ выбрал safest assumption
→ продолжил независимую работу
→ записал assumption в evidence
```

Terminal `[BLOCKER]` допустим только когда одновременно:

1. продуктовый шаг реально невозможен;
2. независимая полезная работа исчерпана;
3. безопасный вывод/fallback уже проверен;
4. требуется конкретное внешнее действие, product decision, разрешение writer
   conflict или предотвращение irreversible risk.

Missing field, отсутствующий handoff, stale checkpoint, recoverable tooling
problem или ещё не готовая зависимая surface не являются terminal blocker.

Если агент обнаружил исправимый drift в writable canonical artifact, он обязан
исправить его в том же turn и сделать remote readback. Сообщить владельцу
«остался исправимый drift» без попытки исправления — process defect.

## 4. Роли и ownership

### N0 — generation, integration, status, preview, release

Инструмент окна: GitHub. Local commands выполняет native R0 по уже принятому N0
решению.

N0 владеет:

- анализом existing export/build/preview/Kaggle paths;
- выбором authoritative fresh production snapshot и generation sequence;
- technical fresh-data baseline;
- integration branch `integration/ui-normalization-launch-20260902`;
- review и объединением F0/M0/A0 waves;
- exact `/<buildId>/__preview/`;
- `STATUS.md`, normalization report и release candidate.

N0 не читает runtime SQLite. Build/export должен вернуть buildId/output URL
самостоятельно. Read-only SQLite fallback допустим только native R0, если N0
доказал его необходимость в конкретной mechanical task.

Первый meaningful result: фактический fresh-data generation verdict, а не
описание task для R0.

### F0 — foundations, colors, typography, spacing, icons

F0 самостоятельно решает typography roles, spacing/sizing, containers,
breakpoints, radii, borders, elevation, layers, semantic colors, duplicate
merges, exactly four icon-size roles и canonical SVG identity.

Writable paths:

```text
site/src/styles/design-system.css
site/src/components/design-system/**
site/src/components/Icon.astro
site/src/components/SocialIcon.astro
site/src/components/brand/**
```

`EventLayout.astro` остаётся integration-sensitive. F0 публикует exact token
binding; A0/N0 применяют consumer migration без скрытого concurrent edit.

### M0 — component roots, MediaFrame, cards, adaptive rows

M0 самостоятельно решает `component / variant / state / composition /
accidental drift`, canonical APIs и family ownership.

Writable paths:

```text
site/src/lib/relatedCardLayout.mjs
site/src/components/OptimizedEventCardGrid.astro
site/src/components/AdaptiveEventCardGrid.astro
site/src/components/EventCard.astro
site/src/components/listings/ListingEventCard.astro
site/src/components/EventMediaRail.astro
другие exact card/media paths после назначения N0
```

Mandatory donors:

```text
docs/features/static-site-pages/image-framing.md
site/src/lib/relatedCardLayout.mjs
site/src/components/OptimizedEventCardGrid.astro
```

Второй framing/row algorithm запрещён без доказанной невозможности расширить
существующий.

### A0 — shell, listings, routes, consumer migration

A0 самостоятельно строит actual-consumer map, сохраняет намеренно разные
compositions и удаляет page-local forks/overrides.

Writable paths:

```text
site/src/layouts/**
site/src/components/listings/**
site/src/pages/**
```

`site/src/components/listings/ListingEventCard.astro` принадлежит M0 и исключён
из A0 write scope.

Date routes используют `DateListingSurface`; weekend routes — отдельный
`WeekendListingSurface`. Новые owner-facing `/lab/launch/*` запрещены.

### V0 — browser/DOM/computed audit

V0 read-only. Минимальная route matrix:

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

Viewport classes: desktop wide, desktop compact, mobile 390–430.

V0 проверяет family markers, DOM anatomy, computed typography/spacing/colors/
radii/borders/icon sizes, framing, row occupancy/equal heights, responsive
transitions и horizontal overflow.

Отсутствующий preview — scoped dependency от N0. V0 продолжает source map,
selector inventory и harness preparation и начинает личный browser audit сразу
после появления exact local или published URL. Повторный terminal blocker из-за
одного отсутствующего preview запрещён.

Вердикты:

```text
PASS
DRIFT        → direct F0/M0/A0
PRODUCT_GAP  → backlog после ASTRO_NORMALIZATION_PASS
BLOCKER      → только по строгому правилу §3
```

### K0 — product-first consultant

K0 диагностирует и чинит процесс, а не перечисляет владельцу исправимые
несоответствия. При write access K0 исправляет canonical documentation drift в
том же turn. Он даёт минимум сообщений существующим окнам и предпочитает
correction вместо restart.

### R0 — native mechanical executor и sole Penpot writer

R0 использует isolated worktrees. Typical lanes:

```text
FOUNDATIONS
MEDIA-CARDS
SHELL-LISTINGS
MERGE-TEST
RELEASE
PENPOT
```

R0 самостоятельно восстанавливает выводимые task details и не останавливается
на formatting omissions. Он исправляет recoverable local test/tooling defects
в authorized scope. Он останавливается только на hard safety/semantic boundary
из §3.

Browser verdict принадлежит V0. Normalization PASS принадлежит owning ChatGPT
roles и N0, а не R0.

## 5. Главные UI invariants

- same visual/behaviour component → один Astro family root/variant family;
- один anatomy/CSS owner;
- один canonical SVG на semantic action;
- complete actual-consumer inventory;
- stable `data-ds-family`, `data-ds-version`, `data-ds-variant`, применимый
  `data-ds-state`;
- все visible colors tokenized; same-role duplicates merged;
- exactly four central icon-size roles; local dimensions forbidden;
- shared MediaFrame owns ratio/fit/crop/focal/clip/fallback/loading;
- одна AdaptiveEventCardGrid family покрывает applicable multi-card surfaces;
- Penpot использует one native master/variant family и linked route instances;
- product UI-gap/redesign запрещены до `ASTRO_NORMALIZATION_PASS`.

## 6. Коммуникация и meaningful result

Issue #621 — durable mailbox. Допустимы:

```text
[RESULT]
[OWNER_REVIEW_READY]
[DRIFT]
[BLOCKER]
```

Task dispatch, packet, task ID, worktree creation, commit без интеграции, test
без output, 404 route или empty Penpot object не являются owner-facing result.
Owning window остаётся ответственным до фактического build/wave/preview/browser
result и собственного readback.

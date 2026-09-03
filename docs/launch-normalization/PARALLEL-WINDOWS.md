# Нормализация UI KenigEvents — реальная исполнительная топология

Статус: `ACTIVE`  
Координация: `onedayonemasterpiece/events-bot-new#621`

## 1. Неподменяемый факт платформы

ChatGPT-окно не является background worker. Оно может выполнить большой пакет
анализа и GitHub-изменений в одном turn, но после завершения ответа само не
просыпается и не продолжает следить за issue.

Поэтому нельзя считать N0/F0/M0/A0/V0 долгоживущими процессами и нельзя строить
план, который требует их ручного пробуждения после каждого commit или Wave.
Prompt не превращает завершённый turn в daemon.

```text
ChatGPT roles = сильные burst-specialists
native R0     = текущий persistent product executor
```

При действующем запрете на новый внешний supervisor реально постоянный worker
сейчас один — native R0. Настоящий параллельный always-on pool потребовал бы
несколько native Codex sessions либо разрешённый supervisor; изображать такой
pool из вкладок ChatGPT запрещено.

## 2. Роли burst-specialists

### N0

В burst-turn принимает release/generation policy, criteria и product decisions,
review-ит материальный результат. Не обязан оставаться открытым между командами.
Фактическую непрерывную цепочку выполняет R0.

### F0

В burst-turn делает глубокий census foundations, принимает semantic decisions и
может выполнить крупный пакет direct GitHub changes. После turn его решения и
branch становятся входом R0. R0 вправе продолжать reversible foundation
implementation, если она однозначно следует existing behaviour и canonical
invariants.

### M0

В burst-turn принимает component/family decisions и выполняет крупный пакет
component changes. R0 продолжает однозначную техническую реализацию и migration,
не ожидая нового M0-turn. Новый product/component intent возвращается M0.

### A0

В burst-turn определяет intentional route compositions и выполняет крупные
consumer migrations. R0 продолжает однозначные migrations по existing public
APIs и invariants.

### V0

Независимый burst-аудитор. Один turn после появления точного preview URL обязан
покрыть полный route/viewport matrix и маршрутизацию DRIFT. Фоновое ожидание URL
от V0 не предполагается. R0 может делать local browser smoke, но не выдаёт V0
PASS.

## 3. R0 — principal continuous executor

R0 — native Codex session с local shell/git/gh. Его задача не «выполнить список
SHA», а довести ближайший product gate.

Текущий gate:

```text
exact reachable normalized /<buildId>/__preview/
с воспроизводимой fresh-production generation и ancestry evidence
```

После каждого checkpoint R0:

```text
fresh-read #621 + refs + worktrees + contract
→ определяет ближайший незакрытый product gate
→ пересобирает ready backlog из source, role branches, tests/builds и V0 findings
→ выбирает highest-value reversible item
→ только затем фиксирует exact SHA как transaction evidence
→ implement / merge / test / build / publish
→ исправляет recoverable tooling/regression defects
→ fresh-read и продолжает
```

R0 может самостоятельно принимать reversible engineering decisions:

- implementation/refactor/API details, однозначно следующие current product;
- canonical migrations, необходимые для уже принятых invariants;
- ordinary merge resolution;
- test/fixture/tooling repair;
- выбор latest accepted refs и worktree sequence;
- local browser smoke и diagnostics.

R0 не принимает:

- новое product behaviour;
- изменение user-facing semantics;
- palette/redesign;
- удаление intentional composition;
- необратимую production/Penpot mutation без gate;
- финальный независимый V0 verdict.

При одной semantic ambiguity R0 маршрутизирует вопрос owning specialist, но не
останавливает остальной независимый backlog.

## 4. Backlog считается работающим только по фактам

Фраза агента «я сформировал backlog» ничего не доказывает.

Работающий loop подтверждается так:

```text
один run
→ несколько разных ready items, если они существовали
→ несколько coherent repository/tool results
→ fresh-read после checkpoint
→ следующий item без owner wake-up
```

`wake → один item → [RESULT] → stop` при наличии другой работы означает
`BACKLOG_NOT_FORMING`.

Для standby нужны только факты:

```text
ready_owned_items: 0
remaining_external_trigger: <exact result/url/decision>
```

## 5. Ожидание без простоя

Для локального child process:

```text
PID + log path
→ foreground/wait PID
→ tail progress
→ немедленная реакция на exit
```

Blind `sleep > 15s` запрещён. При неизбежном polling: `5s → 10s → 15s`.

Remote trigger можно ждать только после исчерпания local backlog: проверки через
10–15 секунд не более двух минут, затем durable exit с exact trigger. Бесконечный
watch и трёхминутные sleeps запрещены.

## 6. Product path

```text
R0 материализует latest safe accepted source
→ reproducible same-data/fresh-data build
→ reachable normalized preview
→ V0 full browser audit
→ R0 интегрирует и проверяет fixes; specialist просыпается только при semantic need
→ повтор до ASTRO_NORMALIZATION_PASS
→ thin S + Penpot
→ checked release candidate
```

## 7. Product invariants

- same visual/behaviour component → one canonical family root;
- one anatomy/CSS owner;
- one canonical SVG per semantic action;
- all visible colours tokenized; same-role duplicates merged;
- exactly four central icon-size roles;
- shared MediaFrame owns framing;
- one AdaptiveEventCardGrid covers applicable multi-card surfaces;
- actual routes use canonical roots while Date/Weekend remain distinct
  compositions;
- UI-gap, palette exploration and redesign start only after
  `ASTRO_NORMALIZATION_PASS`.

## 8. Участие владельца

Владелец не строит backlog и не маршрутизирует SHA/packets.

При текущей топологии неизбежно только:

- один native-R0 start/resume после фактического завершения native session;
- один V0 burst после физического появления preview;
- настоящий product/safety decision.

Нулевая ручная реактивация после полного завершения native session невозможна без
внешнего supervisor; утверждать обратное запрещено.

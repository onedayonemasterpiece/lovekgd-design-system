# Нормализация UI KenigEvents — continuous product-first launch

Статус: `ACTIVE`  
Координация: `onedayonemasterpiece/events-bot-new#621`  
Параллельные роли: [`PARALLEL-WINDOWS.md`](PARALLEL-WINDOWS.md)  
Исполняемый contract: [`launch-normalized-ui.v1.yaml`](../../contracts/launch-normalized-ui.v1.yaml)

Старый ASP conveyor в `lovekgd-design-system#57` используется только как
named donor/history. Текущий процесс оптимизирует путь до работающего продукта,
а не количество tasks, receipts и handoffs.

## 1. Product objective

```text
fresh production events
→ existing Astro generation restored through the shared Kaggle pipeline
→ normalized foundations/components/actual consumers
→ exact reachable normalized /<buildId>/__preview/
→ V0 DOM/computed-style PASS or DRIFT
→ critical DRIFT closure
→ thin S + native Penpot masters/linked instances
→ ASTRO_NORMALIZATION_PASS
→ product UI-gap/change work
→ release candidate through the same Kaggle pipeline
```

Владелец смотрит реальные страницы с реальными событиями. Golden Corpus нужен
для internal deterministic A=S=P, а не как обязательная owner-review surface.

## 2. Build execution contract

Текущий launch использует:

```text
one events-bot-new build implementation
one Kaggle StaticSiteBuilder
one Yandex Object Storage bucket
one allowlisted page-class selector
one my-data-hub MCP control plane
```

Kaggle CPU обязателен для каждого полного либо опубликованного результата:

- real Review Preview;
- Golden Review Preview;
- focused Review Preview с secret URL;
- Release Candidate;
- production-form build.

Эти режимы отличаются только data mode, immutable root `slug/prefix`,
опциональным page-class filter и promotion semantics. Они не являются разными
пайплайнами или bucket architectures.

Без Kaggle разрешена только локальная focused diagnostic одного route/page
class. Она использует те же Astro sources, source SHA, snapshot/corpus и общий
page-class selector, но не публикуется, не обновляет `preview.current`, не
считается owner/V0/A=S=P evidence и не образует второй production path.

`catalog-mode: slice|full` относится к объёму event data и не является
page-class filter.

`my-data-hub` владеет только MCP orchestration:

```text
kenigevents.preview.start
kenigevents.preview.current
operation.get
```

Exporter, selector, builder, Object Storage publisher и retention остаются в
`events-bot-new`. Уже начатая MCP-реализация должна быть продолжена, а не
форкнута. Future/default-off two-root bucket/ALB design находится вне текущего
launch path.

## 3. Continuous role execution

Роль — это полный owned product contour. Wave, branch, commit и `[RESULT]` —
versioned checkpoints, не turn boundaries.

```text
fresh-read current state
→ recompute unresolved role backlog
→ select highest-value safe reversible item
→ analyze/decide/implement/review
→ publish checkpoint when useful
→ fresh-read again
→ continue next item
→ stop only when independent owned backlog is exhausted
```

Per-Wave owner resume является process defect. Старое `finish with [RESULT]`
означает только «не возвращай plan-only status».

Допустимый standby требует exact external trigger. Busywork после исчерпания
scope запрещён.

## 4. Execution surfaces

```yaml
K0: ChatGPT + GitHub
N0: ChatGPT + GitHub
F0: ChatGPT + GitHub
M0: ChatGPT + GitHub
A0: ChatGPT + GitHub
V0: ChatGPT + GitHub + my-browser-bridge
R0: native Codex + local shell/git/gh
published_preview_control: my-data-hub MCP
full_build_executor: Kaggle CPU via events-bot-new
```

K0/N0/F0/M0/A0 не вызывают `Codex DevCoveer`. Они лично читают source,
consumers и voice notes, принимают решения, делают bounded GitHub edits и
проверяют R0 output.

R0 выполняет only already-decided mechanical work: isolated worktrees,
repetitive edits, local focused diagnostics, tests/checks, exact merge/promotion,
invocation/observation of the shared Kaggle pipeline и authorized Penpot
mutation. Browser evidence принадлежит V0.

R0 и `my-data-hub` не создают вторую реализацию exporter/selector/builder или
publisher.

## 5. Critical path without approval ping-pong

N0 владеет полной цепочкой:

```text
candidate acceptance
→ same-data focused diagnostic
→ conditional promotion
→ full Kaggle fresh-production generation
→ reachable preview
→ V0 trigger
→ V0 verdict review
```

Когда acceptance criteria известны заранее, N0 даёт R0 одно conditional
end-to-end authorization:

```text
IF candidate focused diagnostics/tests/baseline PASS
  THEN promote exact candidate
  AND invoke the one shared Kaggle pipeline
  AND publish reachable preview from its checked artifact
ELSE
  no promotion/deploy
  continue safe diagnosis
  publish factual defect
```

R0 — persistent native session. После каждого result он fresh-read-ит #621 и
берёт следующую ready safe mechanical task. При ожидаемом critical trigger он
использует bounded watch 60–120 seconds, maximum 30 minutes, а не немедленный
exit.

## 6. Product architecture and authority

### `events-bot-new`

Executable authority:

- `site/src/styles/design-system.css` and semantic foundation layers;
- `site/src/components/design-system/**`;
- product component families;
- layouts/pages and actual route compositions;
- data export, page-class selection, Kaggle generation, preview publication,
  retention and release checks.

Branch:

```text
integration/ui-normalization-launch-20260902
```

### `lovekgd-design-system`

Thin cross-surface authority:

- stable family/component IDs;
- component/variant/state/composition decisions;
- Astro source and actual consumer bindings;
- visible asset identities;
- Golden fixture/route bindings;
- Penpot masters/route-board placement;
- browser and A=S=P statuses.

Branch:

```text
integration/launch-normalized-sot-penpot-20260902
```

### `my-data-hub`

Sole MCP control plane for published review builds. It resolves a requested
source ref, selects/reuses data, starts the existing `events-bot-new` Kaggle
runner, exposes operation status and returns the last successful URL per data
mode. It must not contain a second static-site build implementation.

### Penpot

`R0.PENPOT` is the sole writer. Penpot follows completed and browser-accepted
Astro families; it does not block Astro normalization.

## 7. Actual routes

```text
/segodnya/                  current build date
/zavtra/                    next date
/date-YYYY-MM-DD/           arbitrary date
/vyhodnye/                  active/nearest weekend
/vyhodnye/YYYY-MM-DD/       selected available weekend range
/podborki/besplatnye-sobytiya/
```

Date routes use `DateListingSurface`; weekend routes use distinct
`WeekendListingSurface`. Intentional compositions remain separate.

Owner entry point:

```text
/<buildId>/__preview/
```

New owner-facing `/lab/launch/*` routes are forbidden.

## 8. Core normalization invariants

### Component identity

Same visual/behaviour entity requires:

- one canonical Astro root or named variant family;
- one anatomy/CSS owner;
- one canonical SVG per semantic action;
- complete actual consumer inventory;
- stable `data-ds-family/version/variant/state` diagnostics;
- one native Penpot master/variant family and linked instances.

Local lookalike markup/style is `DRIFT`, even if pixels currently match.

### Foundations, colors and icons

- canonical typography H1–H4/body/label/metadata;
- spacing/sizing/containers/breakpoints;
- radii/borders/elevation/layering;
- all visible colors via tokens/semantic aliases;
- exact and same-role near-duplicates merged;
- exactly four central icon-size roles;
- no component-local rendered icon dimensions;
- canonical visible SVG/brand/medallion identities;
- one active style owner per canonical component.

Palette redesign starts only after drift closure.

### MediaFrame

One shared protocol owns:

```text
media role
ratio
contain/cover
crop permission
focal/object position
clip/overflow
fallback/loading
responsive resources
```

Mandatory donors:

```text
events-bot-new/docs/features/static-site-pages/image-framing.md
site/src/lib/relatedCardLayout.mjs
site/src/components/OptimizedEventCardGrid.astro
```

### AdaptiveEventCardGrid

One family covers applicable EventCard multi-card consumers:

- available-width ownership;
- named responsive/density strategies;
- no phantom columns;
- named final remainder;
- row width filled minus declared gaps;
- equal media/card heights within row;
- source/focus order preserved;
- no compact/mobile overflow;
- framing remains MediaFrame-owned.

## 9. Parallel roles

- `N0`: candidate review, conditional generation authority, integration,
  preview, status, release;
- `F0`: foundations, colors, typography, spacing, four icon roles, SVG/brand,
  duplicate style-owner closure;
- `M0`: component identity, MediaFrame, EventCard/ListingEventCard,
  AdaptiveEventCardGrid;
- `A0`: shell, listings, actual routes, consumer migration;
- `V0`: browser DOM/computed audit; later Golden Penpot audit;
- `K0`: product/process consultant and direct canonical-doc repair;
- `R0`: persistent native mechanical executor, local focused diagnostic worker,
  Kaggle invocation/observation and sole Penpot writer.

No mandatory `MAT → QA → INTEGRATE → PUBLISH`, new orchestrator or micro-wave
owner scheduler exists.

## 10. Autonomous recovery

Recoverable metadata, combined `branch@sha`, stale same-programme checkpoint,
missing heading/packet, ENOSPC, aged fixture and local tooling defect are not
terminal blockers.

```text
infer from issue/refs/repository/ownership
→ verify reversible authorized scope
→ choose safest deterministic assumption
→ continue work
→ record assumption once
```

`[BLOCKER]` is valid only when independent work is exhausted and a real product,
external, writer-conflict or irreversible-risk action is required.

Correctable canonical drift is repaired before being reported to the owner.

## 11. Browser and Golden

V0 personally checks actual routes on desktop wide, desktop compact, mobile
390–430 and required breakpoint seams.

Checks include family markers, normalized DOM anatomy, computed type/spacing/
colors/radii/borders/icon sizes, framing, adaptive row occupancy/equal heights,
responsive transitions and horizontal overflow.

```text
PASS
DRIFT        → owning F0/M0/A0 immediately
PRODUCT_GAP  → backlog after ASTRO_NORMALIZATION_PASS
BLOCKER      → strict exhausted-work rule only
```

Source declaration or tests without browser evidence do not close drift.

Golden uses a frozen Europe/Kaliningrad Friday clock across Friday/Saturday/
Sunday/weekend/free actual routes. It is internal A=S=P evidence, not owner
review prerequisite. Full Golden Review Preview is generated by the same Kaggle
pipeline under a separate immutable prefix.

## 12. ASTRO_NORMALIZATION_PASS

Gate requires:

- reproducible fresh-data full Kaggle generation;
- tokenized foundations/colors;
- four icon roles across all consumers;
- single roots for same components;
- MediaFrame/framing browser PASS;
- AdaptiveEventCardGrid across applicable consumers;
- actual routes migrated;
- no critical V0 browser DRIFT.

Only after the gate may palette exploration, redesign and product UI-gap work
begin. Release of a changed family also requires thin S and Penpot binding.

## 13. Meaningful checkpoint

Meaningful checkpoint is an actual Kaggle generation verdict, reviewed source
convergence, reachable normalized preview, V0 PASS/DRIFT, native Penpot family or
checked release candidate.

Local focused diagnostic is useful evidence for a defect but never closes a
published preview, owner review, V0, PM0 or A=S=P checkpoint.

Checkpoint publication does not automatically end a role. Packet, dispatch,
worktree, commit without role review, test without output, 404 route and empty
Penpot page are not owner-facing progress.

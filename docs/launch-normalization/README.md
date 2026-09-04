# Нормализация UI KenigEvents — continuous product-first launch

## Действующее решение владельца — 2026-09-04

**БЫЛО → БУДЕТ:** открытая непрерывная нормализация с обязательной полной P,
историческим integration merge target и гипотезой нового component package →
одна нормализованная продуктовая сборка для аудиоревью на существующем Astro trunk.
**ЗАЧЕМ:** конечный продуктовый результат при дефиците времени/Codex.
**ПОСЛЕДСТВИЯ:** служебный visual polish не gate; проверенная структурная SoT-проекция
обязательна, полная запись в Penpot нет; A=S=P без verified P не заявляется.
**ТИП:** owner-approved stage/acceptance correction, не redesign/release.
**СОГЛАСОВАНО:** прямое решение владельца в native Codex, 2026-09-04.

Текущие правила завершения, scope, economics и остановки —
[`review_completion_stage` контракта v1.11.0](../../contracts/launch-normalized-ui.v1.yaml).
Текущие SHA/URL/gaps — только [STATUS](STATUS.md). Сведения и открытые циклы
ниже сохранены как история/другие этапы и не отменяют этот конечный gate.


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

Per-Wave owner resume является process defect. Допустимый standby требует exact
external trigger. Busywork после исчерпания scope запрещён.

## 4. Execution surfaces

```yaml
K0: ChatGPT + GitHub
N0: ChatGPT + GitHub
F0: ChatGPT + GitHub
FR0: ChatGPT + GitHub
M0: ChatGPT + GitHub
A0: ChatGPT + GitHub
V0: ChatGPT + GitHub + my-browser-bridge
R0: native Codex + local shell/git/gh
published_preview_control: my-data-hub MCP
full_build_executor: Kaggle CPU via events-bot-new
```

K0/N0/F0/FR0/M0/A0 не вызывают `Codex DevCoveer`. Они лично читают source,
consumers и voice notes, принимают решения, делают bounded GitHub edits и
проверяют R0 output.

R0 выполняет already-decided mechanical work: isolated worktrees, repetitive
edits, local focused diagnostics, tests/checks, exact merge/promotion,
invocation/observation of the shared Kaggle pipeline и authorized Penpot
mutation. Browser evidence принадлежит V0.

## 5. Critical path and integration cadence

N0 владеет цепочкой:

```text
candidate acceptance
→ same-data focused diagnostic
→ conditional promotion
→ full Kaggle fresh-production generation
→ reachable preview
→ V0 trigger
→ V0 verdict review
```

Parallel source work is useful only when it reaches this chain.

```yaml
candidate_max_lag_minutes_when_merge_ready_output_exists: 30
max_unintegrated_coherent_waves_per_role: 2
full_preview_after_compatible_batches: 2_to_3
full_preview_max_active_minutes_since_previous: 60
```

FR0 does not delay the already-ready successor. A broken batch blocks only
itself; compatible role outputs continue to integration.

## 6. Product architecture and authority

### `events-bot-new`

Executable authority:

- semantic foundations;
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

### `my-data-hub`

Sole MCP control plane for published review builds. It must not contain a second
static-site build implementation.

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

### MediaFrame — FR0 owner

One shared protocol owns:

```text
media role
ratio
contain/cover
crop permission
focal/object position
clip/overflow/radius
fallback/loading
responsive resources
OCR/document/visual-only semantics
```

FR0 also owns EventMediaRail framing variants. It adopts the last useful M0
framing work through an exact cutover; nothing is restarted or discarded.

M0 consumes this API and owns card anatomy, actions, metadata, grids and rows.
A0 migrates actual consumers and may not introduce page-local framing fixes.

Mandatory donors:

```text
events-bot-new/docs/features/static-site-pages/image-framing.md
site/src/components/media-frame.css
site/src/components/EventMediaRail.astro
existing M0 MediaFrame commits and Golden stress cases
```

### AdaptiveEventCardGrid — M0 owner

One family covers applicable EventCard multi-card consumers:

- available-width ownership;
- named responsive/density strategies;
- no phantom columns;
- named final remainder;
- row width filled minus declared gaps;
- equal media/card heights within row;
- source/focus order preserved;
- no compact/mobile overflow;
- framing remains FR0 MediaFrame-owned.

## 9. Parallel roles

- `N0`: candidate review, integration, generation, preview, status, release;
- `F0`: foundations, colors, typography, spacing, icon roles, SVG/brand;
- `FR0`: MediaFrame, EventMediaRail and framing semantics/diagnostics;
- `M0`: component identity, EventCard/ListingEventCard, actions/metadata,
  AdaptiveEventCardGrid and row packing;
- `A0`: shell, listings, actual routes, consumer migration;
- `V0`: browser DOM/computed audit; later Golden Penpot audit;
- `K0`: consultant, exact prompt routing and canonical-doc repair;
- `R0`: persistent native mechanical executor, integration/runtime/Kaggle and
  sole Penpot writer.

No further specialist role is added until two successive
`role result → integration ≤30m → Preview → V0` cycles are proven.

## 10. Autonomous recovery

Recoverable metadata, stale same-programme checkpoint, missing heading/packet,
ENOSPC, aged fixture and local tooling defect are not terminal blockers.

```text
infer from issue/refs/repository/ownership
→ verify reversible authorized scope
→ choose safest deterministic assumption
→ continue work
→ record assumption once
```

`[BLOCKER]` is valid only when independent work is exhausted and a real product,
external, writer-conflict or irreversible-risk action is required.

## 11. Browser and Golden

V0 personally checks actual routes on desktop wide, desktop compact, mobile
390–430 and required breakpoint seams.

Checks include family markers, normalized DOM anatomy, computed type/spacing/
colors/radii/borders/icon sizes, framing, adaptive row occupancy/equal heights,
responsive transitions and horizontal overflow.

```text
PASS
DRIFT        → owning F0/FR0/M0/A0 immediately
PRODUCT_GAP  → backlog after ASTRO_NORMALIZATION_PASS
BLOCKER      → strict exhausted-work rule only
```

Golden uses a frozen Europe/Kaliningrad Friday clock across Friday/Saturday/
Sunday/weekend/free actual routes. It is internal A=S=P evidence, not owner
review prerequisite.

## 12. ASTRO_NORMALIZATION_PASS

Gate requires:

- reproducible fresh-data full Kaggle generation;
- tokenized foundations/colors;
- four icon roles across all consumers;
- single roots for same components;
- FR0 MediaFrame/framing browser PASS;
- M0 AdaptiveEventCardGrid across applicable consumers;
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

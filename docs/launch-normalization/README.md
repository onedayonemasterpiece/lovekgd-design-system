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
→ existing Astro generation restored
→ normalized foundations/components/actual consumers
→ exact reachable normalized /<buildId>/__preview/
→ V0 DOM/computed-style PASS or DRIFT
→ critical DRIFT closure
→ thin S + native Penpot masters/linked instances
→ ASTRO_NORMALIZATION_PASS
→ product UI-gap/change work
→ release candidate
```

Владелец смотрит реальные страницы с реальными событиями. Golden Corpus нужен
для internal deterministic A=S=P, а не как обязательная owner-review surface.

## 2. Continuous role execution

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

## 3. Execution surfaces

```yaml
K0: ChatGPT + GitHub
N0: ChatGPT + GitHub
F0: ChatGPT + GitHub
M0: ChatGPT + GitHub
A0: ChatGPT + GitHub
V0: ChatGPT + GitHub + my-browser-bridge
R0: native Codex + local shell/git/gh
```

K0/N0/F0/M0/A0 не вызывают `Codex DevCoveer`. Они лично читают source,
consumers и voice notes, принимают решения, делают bounded GitHub edits и
проверяют R0 output.

R0 выполняет only already-decided mechanical work: isolated worktrees,
repetitive edits, tests/build, exact merge/promotion under conditional authority
и authorized Penpot mutation. Browser evidence принадлежит V0.

## 4. Critical path without approval ping-pong

N0 владеет полной цепочкой:

```text
candidate acceptance
→ same-data baseline
→ conditional promotion
→ fresh-production generation
→ reachable preview
→ V0 trigger
→ V0 verdict review
```

Когда acceptance criteria известны заранее, N0 даёт R0 одно conditional
end-to-end authorization:

```text
IF candidate build/tests/baseline PASS
  THEN promote exact candidate
  AND run fresh generation
  AND publish reachable preview
ELSE
  no promotion/deploy
  continue safe diagnosis
  publish factual defect
```

R0 — persistent native session. После каждого result он fresh-read-ит #621 и
берёт следующую ready safe mechanical task. При ожидаемом critical trigger он
использует bounded watch 60–120 seconds, maximum 30 minutes, а не немедленный
exit.

## 5. Product architecture and authority

### `events-bot-new`

Executable authority:

- `site/src/styles/design-system.css` and semantic foundation layers;
- `site/src/components/design-system/**`;
- product component families;
- layouts/pages and actual route compositions;
- generation, preview and release checks.

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

### Penpot

`R0.PENPOT` is the sole writer. Penpot follows completed and browser-accepted
Astro families; it does not block Astro normalization.

## 6. Actual routes

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

## 7. Core normalization invariants

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

## 8. Parallel roles

- `N0`: candidate review, conditional generation authority, integration,
  preview, status, release;
- `F0`: foundations, colors, typography, spacing, four icon roles, SVG/brand,
  duplicate style-owner closure;
- `M0`: component identity, MediaFrame, EventCard/ListingEventCard,
  AdaptiveEventCardGrid;
- `A0`: shell, listings, actual routes, consumer migration;
- `V0`: browser DOM/computed audit; later Golden Penpot audit;
- `K0`: product/process consultant and direct canonical-doc repair;
- `R0`: persistent native mechanical executor and sole Penpot writer.

No mandatory `MAT → QA → INTEGRATE → PUBLISH`, new orchestrator or micro-wave
owner scheduler exists.

## 9. Autonomous recovery

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

## 10. Browser and Golden

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
review prerequisite.

## 11. ASTRO_NORMALIZATION_PASS

Gate requires:

- reproducible fresh-data generation;
- tokenized foundations/colors;
- four icon roles across all consumers;
- single roots for same components;
- MediaFrame/framing browser PASS;
- AdaptiveEventCardGrid across applicable consumers;
- actual routes migrated;
- no critical V0 browser DRIFT.

Only after the gate may palette exploration, redesign and product UI-gap work
begin. Release of a changed family also requires thin S and Penpot binding.

## 12. Meaningful checkpoint

Meaningful checkpoint is an actual generation verdict, reviewed source
convergence, reachable normalized preview, V0 PASS/DRIFT, native Penpot family or
checked release candidate.

Checkpoint publication does not automatically end a role. Packet, dispatch,
worktree, commit without role review, test without output, 404 route and empty
Penpot page are not owner-facing progress.

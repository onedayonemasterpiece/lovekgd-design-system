# Параллельные окна — product-first topology

## Текущий этап

[Решение владельца и scope](README.md#действующее-решение-владельца--2026-09-04)
заменяют конфликтующие открытые циклы ниже. Окна получают только полезные
независимые пакеты; после verified audio-review handoff этап заканчивается.
Ниже — историческая topology, не обязательство занять все окна или продолжать polish.


Статус: `ACTIVE`  
Координация: `onedayonemasterpiece/events-bot-new#621`

## 1. Цель параллельности

Параллельность существует только для ускорения пути:

```text
нормализованные source families
→ exact integrated successor
→ full Kaggle Review Preview
→ V0 browser verdict
→ correction
→ thin S / Penpot / A=S=P
```

Большее число веток без своевременной интеграции не является ускорением.

Каждый ChatGPT activation — автономный multi-item run. Окно fresh-read-ит
current state после каждого checkpoint и продолжает следующий owned item, пока
не исчерпан реальный backlog.

## 2. Build boundary

Используется одна реализация:

```text
events-bot-new exporter/page-class/build/publish logic
→ one Kaggle StaticSiteBuilder
→ one current Yandex Object Storage bucket
→ my-data-hub MCP start/current/operation facade
```

Полный либо опубликованный real/golden/focused Preview, RC и production-form
build всегда выполняется через Kaggle.

Без Kaggle разрешена только непубликуемая local focused diagnostic одного
route/page class. Она не обновляет `preview.current`, не является owner/V0/PM0
результатом и не доказывает A=S=P.

## 3. Рабочие роли

### ChatGPT specialists

- `N0` — acceptance, integration, generation, preview, release;
- `F0` — foundations, colors, typography, spacing, icons, SVG, brand;
- `FR0` — canonical MediaFrame/framing and EventMediaRail media composition;
- `M0` — component roots, EventCard/ListingEventCard, actions/metadata,
  AdaptiveEventCardGrid and row packing;
- `A0` — shell, actual routes and consumer migration;
- `V0` — independent browser DOM/computed-style/visual audit;
- `K0` — consultant and prompt router;
- `PM0` — read-only readiness/forecast.

### Native worker

`R0` — direct Codex for cross-branch integration, local runtime/tests, Kaggle
invocation/observation, ordinary merge repair and sole Penpot writes.

Role windows do not delegate their semantic/source analysis to R0. R0 does not
reimplement work owned by a live specialist.

## 4. FR0 cutover

FR0 is the only newly admitted specialist. It exists because framing is a
separate technical root with enough independent backlog.

Before FR0 begins writes:

1. resolve current M0 framing head and integrated descendant;
2. include or transfer all coherent in-flight MediaFrame/EventMediaRail work;
3. record `FR0_CUTOVER_BASE` in issue #621;
4. tell M0 to stop future writes to FR0-owned paths;
5. branch FR0 from the exact cutover/current successor.

No current M0 work is discarded and no two roles write the same canonical root.

### FR0 owns

```text
MediaFrame protocol/anatomy/style owner
media role and semantic classification
ratio/aspect-ratio
contain/cover
crop permission
focal/object-position
clip/overflow/radius
loading/fallback/missing/broken media
OCR/document/visual-only treatment
responsive resources
EventMediaRail media composition and framing variants
framing-specific diagnostics/tests
```

Preferred writable paths after current source census:

```text
site/src/components/media-frame.css
site/src/components/EventMediaRail.astro
exact canonical MediaFrame roots
site/tests/*media-frame*.test.mjs
site/tests/*framing*.test.mjs
site/tests/*media-rail*.test.mjs
```

FR0 may update `docs/features/static-site-pages/image-framing.md` only when
implementation truth changes.

FR0 does not own card text/anatomy/actions, row packing, route shell,
foundations or Penpot writes.

### M0 after cutover owns

```text
one-root component architecture
EventCard / ListingEventCard anatomy and variants
card actions, metadata, admission/event-type composition
AdaptiveEventCardGrid / OptimizedEventCardGrid
row occupancy, named remainder variants and relatedCardLayout
```

Writable paths:

```text
site/src/lib/relatedCardLayout.mjs
site/src/components/OptimizedEventCardGrid.astro
site/src/components/AdaptiveEventCardGrid.astro
site/src/components/EventCard.astro
site/src/components/listings/ListingEventCard.astro
exact assigned card roots
```

M0 consumes FR0 MediaFrame/EventMediaRail API and may change invocation props in
M0-owned card files, but may not recreate framing ownership.

### A0 after cutover

A0 migrates actual consumers to F0/M0/FR0 roots. It may not edit their canonical
internals or fix framing with page-local CSS.

## 5. Integration throughput

K0, N0 and R0 enforce:

```yaml
candidate_max_lag_minutes_when_merge_ready_output_exists: 30
max_unintegrated_coherent_waves_per_role: 2
full_preview_after_compatible_batches: 2_to_3
full_preview_max_active_minutes_since_previous: 60
```

Rules:

1. If a merge-ready result is older than the candidate by more than 30 minutes,
   N0/R0 switch to integration-first work.
2. A role may continue analysis, but may not accumulate a third unintegrated
   implementation wave.
3. One broken batch blocks only that batch; compatible outputs continue.
4. FR0 does not delay the already-ready successor. Its first result joins the
   next suitable candidate.
5. A full Kaggle Preview is run after two or three compatible batches or after
   60 active minutes, whichever happens first.
6. Source work without candidate/Preview conversion is WIP accumulation.

No additional specialist role is admitted until two successive cycles complete
with candidate integration within 30 minutes and a Preview/V0 result. In
particular `SH0`, a separate grid owner and role-per-checklist windows are not
started yet.

## 6. N0 contour

N0:

- fresh-reads latest F0/FR0/M0/A0 refs and current successor;
- reviews deltas and selects compatible candidate content;
- gives R0 one conditional end-to-end authorization;
- accepts/rejects exact source ancestry, tests, Kaggle artifact and URL;
- triggers V0;
- routes material DRIFT to its lowest owner;
- publishes only meaningful `[RESULT]`, `[OWNER_REVIEW_READY]`, `[DRIFT]` or
  factual `[BLOCKER]`.

N0 does not wait for all specialists to finish before publishing a useful
successor.

## 7. F0 contour

F0 owns:

- one font/weight system;
- H1–H4/body/label/metadata roles;
- spacing/sizing/containers/breakpoints;
- semantic colors and duplicate-color closure;
- radii/borders/elevation/layering;
- exactly four icon-size roles;
- canonical SVG/social/brand/medallion identities;
- duplicate foundation/style-owner removal.

F0 does not edit FR0/M0 component anatomy.

## 8. FR0 contour

FR0 starts from the exact cutover baseline and:

1. performs a bounded current-consumer framing census;
2. selects the highest-value remaining central framing defect;
3. edits the canonical root, not page-local consumers;
4. adds negative checks/diagnostic markers;
5. publishes a coherent merge-ready batch within 60–90 minutes;
6. fresh-reads and continues the next framing cluster.

No new framing framework, corpus or global research programme is created.
Existing image-framing donors and Golden stress cases are reused.

## 9. M0 contour

M0:

1. closes one-root EventCard/ListingEventCard architecture;
2. centralizes actions/metadata/admission/event-type composition;
3. completes AdaptiveEventCardGrid API, row occupancy and named remainder
   variants;
4. removes duplicate card/grid owners in M0 paths;
5. publishes exact migration/API boundaries to A0 and FR0;
6. continues the next card/grid cluster after fresh-read.

M0 does not write MediaFrame/EventMediaRail canonical internals after cutover.

## 10. A0 contour

A0:

- migrates route consumers to accepted F0/M0/FR0 APIs;
- removes route-local lookalike card/grid/framing/style owners;
- normalizes shell, navigation, listing surfaces and actual route compositions;
- preserves intentional distinction between DateListingSurface and
  WeekendListingSurface;
- continues actual-consumer census until no ready A0 item remains.

## 11. V0 contour

V0 personally uses my-browser-bridge. It never delegates browser observation.

Before a new Preview it may update selectors and source negative probes. When a
new exact Kaggle Preview appears, it immediately checks:

- family/version/variant/state identity;
- computed typography, spacing, colors, radii, borders and icon sizes;
- MediaFrame fit/crop/focal/fallback/overflow;
- EventCard anatomy/actions;
- row occupancy, equal-height intent, remainder and horizontal overflow;
- shell and responsive transitions.

V0 returns `PASS`, `DRIFT`, `PRODUCT_GAP` or factual exhausted-work `BLOCKER`.
One central defect is routed to F0, FR0, M0 or A0.

## 12. R0 contour

In day mode R0 prioritizes:

```text
latest merge-ready specialist output
→ bounded integration-risk review
→ exact candidate
→ local focused diagnostics/tests
→ one Kaggle build/publish path
→ exact artifact/URL verification
```

R0 may do deterministic bulk migration only when it is clearly mechanical and
not duplicating a live specialist. It does not become a second builder,
framing architect or visual auditor.

## 13. Worker exit

No role stops because a seed list, wave, commit or `[RESULT]` ended.

Legitimate exit:

```text
ready_owned_items: 0
remaining_external_trigger: <exact role/result/url>
```

or genuine product/safety/writer/platform boundary.

Recoverable metadata, stale SHA, missing packet, temporary preview absence and
one failing batch are not terminal blockers while independent work exists.

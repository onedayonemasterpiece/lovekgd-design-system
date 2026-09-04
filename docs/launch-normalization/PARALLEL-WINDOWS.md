# Параллельные окна — product-first topology

## Текущий этап

[Решение владельца и scope](README.md#действующее-решение-владельца--2026-09-04)
заменяют конфликтующие открытые циклы ниже. Окна получают только полезные
независимые пакеты; после verified audio-review handoff этап заканчивается.
Ниже — историческая topology, не обязательство занять все окна или продолжать polish.


Статус: `ACTIVE`  
Координация: `onedayonemasterpiece/events-bot-new#621`

## 0. Trunk-based correction

Эта коррекция меняет только delivery semantics существующей topology. Она не
создаёт новую роль, generation, T0, orchestrator, checklist, packet, builder,
contract family или status system.

```yaml
sole_executable_Astro_trunk:
  repository: onedayonemasterpiece/events-bot-new
  branch: agent/static-site-single-kaggle-contract
  current_head: 3ca6a143e4286c165282c2d8ceef1759a41185b7
current_full_real_preview: https://kenigevents.ru/preview-real-3ca6a143e-normalized-20260903-v1/__preview/
current_manifest: https://kenigevents.ru/preview-real-3ca6a143e-normalized-20260903-v1/preview-build.json
personal_V0_verdict: PENDING
programme_history_anchor:
  branch: integration/ui-normalization-launch-20260902
  merge_target: false
historical_r0_branches:
  classification: evidence_only
  new_product_integration: forbidden
max_merge_ready_batches_outside_trunk_per_role: 1
T0: preserved_unchanged_by_this_correction
```

Role branches — временные specialist staging surfaces. После результата N0/R0
самостоятельно читают current refs и втягивают один совместимый current
merge-ready batch в sole trunk без owner relay. Нельзя накапливать второй
not-yet-integrated merge-ready batch той же роли.

Текущая A0 correction остаётся на единственной ветке
`work/ui-normalization-a0-mobile-listing-rail-resource-state-20260903`.
Head `2dac9d16031d4f1505184fc9678f88c855c3988a` отклонён и не merge-ready;
допустим только superseding head той же ветки после test repairs и bounded
`EventLayout.astro` runtime MediaFrame rebinding.

## 1. Цель параллельности

Параллельность существует только для ускорения пути:

```text
нормализованные source families
→ exact descendant of the sole executable trunk
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

- `N0` — acceptance, sole-trunk integration, generation, preview, release;
- `F0` — foundations, colors, typography, spacing, icons, SVG, brand;
- `FR0` — canonical MediaFrame/framing and EventMediaRail media composition;
- `M0` — component roots, EventCard/ListingEventCard, actions/metadata,
  AdaptiveEventCardGrid and row packing;
- `A0` — shell, actual routes and consumer migration;
- `V0` — independent browser DOM/computed-style/visual audit;
- `K0` — consultant and prompt router;
- `PM0` — read-only readiness/forecast.

### Native worker

`R0` — direct Codex for compatible role-batch integration into the sole trunk,
local runtime/tests, Kaggle invocation/observation, ordinary merge repair and
sole Penpot writes.

Role windows do not delegate their semantic/source analysis to R0. R0 does not
reimplement work owned by a live specialist.

## 4. FR0 cutover

FR0 remains the existing framing specialist. The completed cutover does not
create a second framing topology.

FR0 owns:

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

Preferred writable paths:

```text
site/src/components/media-frame.css
site/src/components/EventMediaRail.astro
exact canonical MediaFrame roots
site/tests/*media-frame*.test.mjs
site/tests/*framing*.test.mjs
site/tests/*media-rail*.test.mjs
```

FR0 may update `docs/features/static-site-pages/image-framing.md` only when
implementation truth changes. FR0 does not own card text/anatomy/actions, row
packing, route shell, foundations or Penpot writes.

### M0 after cutover owns

```text
one-root component architecture
EventCard / ListingEventCard anatomy and variants
card actions, metadata, admission/event-type composition
AdaptiveEventCardGrid / OptimizedEventCardGrid
row occupancy, named remainder variants and relatedCardLayout
```

M0 consumes FR0 MediaFrame/EventMediaRail API and may change invocation props in
M0-owned card files, but may not recreate framing ownership.

### A0 after cutover

A0 migrates actual consumers to F0/M0/FR0 roots. It may not edit their canonical
internals or fix framing with page-local CSS.

## 5. Integration throughput

N0 and R0 enforce:

```yaml
candidate_max_lag_minutes_when_merge_ready_output_exists: 30
max_merge_ready_batches_outside_trunk_per_role: 1
full_preview_after_compatible_batches: 2_to_3
full_preview_max_active_minutes_since_previous: 60
```

Rules:

1. N0/R0 continuously fresh-read `#621`, the sole trunk and current role refs.
2. One current merge-ready batch per role may wait outside trunk; a second is
   forbidden until the first is integrated or rejected.
3. N0 does not wait for all roles. Foundations, MediaFrame, EventCard/Grid and
   Shell/Routes are independently acceptable domains.
4. One broken batch blocks only itself; compatible outputs continue.
5. A full Kaggle Preview is run after two or three compatible batches or after
   60 active minutes, whichever happens first.
6. Every exact Preview gets an owner-independent V0 trigger.
7. One `DRIFT` does not cancel a compatible domain or vertical-slice `PASS`.
8. Source work without trunk/Preview conversion is WIP accumulation.

No additional specialist role is admitted until two successive cycles complete
with trunk integration within 30 minutes and a Preview/V0 result.

## 6. N0 contour

N0:

- fresh-reads latest F0/FR0/M0/A0 refs and the sole executable trunk;
- reviews at most one current merge-ready batch per role;
- accepts compatible domains independently;
- after an A0 superseding result issues R0 acceptance without owner relay;
- accepts/rejects exact source ancestry, tests, Kaggle artifact and URL;
- triggers V0 after every exact Preview;
- routes material DRIFT to its lowest owner;
- publishes only meaningful `[RESULT]`, `[OWNER_REVIEW_READY]`, `[DRIFT]` or
  factual `[BLOCKER]`.

N0 does not wait for all specialists to finish before publishing a useful trunk
descendant.

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

FR0:

1. performs a bounded current-consumer framing census;
2. selects the highest-value remaining central framing defect;
3. edits the canonical root, not page-local consumers;
4. adds negative checks/diagnostic markers;
5. publishes one coherent current merge-ready batch;
6. waits to form a second product batch until the first is integrated or
   rejected.

No new framing framework, corpus or global research programme is created.

## 9. M0 contour

M0:

1. closes one-root EventCard/ListingEventCard architecture;
2. centralizes actions/metadata/admission/event-type composition;
3. completes AdaptiveEventCardGrid API, row occupancy and named remainder
   variants;
4. removes duplicate card/grid owners in M0 paths;
5. publishes exact migration/API boundaries to A0 and FR0;
6. keeps no second merge-ready product batch outside trunk.

M0 does not write MediaFrame/EventMediaRail canonical internals after cutover.

## 10. A0 contour

A0:

- migrates route consumers to accepted F0/M0/FR0 APIs;
- removes route-local lookalike card/grid/framing/style owners;
- normalizes shell, navigation, listing surfaces and actual route compositions;
- preserves intentional distinction between DateListingSurface and
  WeekendListingSurface;
- uses the existing active correction branch until its current rejected head is
  superseded; no second A0 branch or queue is allowed.

## 11. V0 contour

V0 personally uses my-browser-bridge. It never delegates browser observation.

For the exact current Preview it independently reports four sections:

- Foundations;
- MediaFrame;
- EventCard/Grid;
- Shell/Routes.

Checks include family/version/variant/state identity, computed typography,
spacing, colors, radii, borders, icon sizes, MediaFrame fit/crop/focal/fallback,
EventCard anatomy/actions, row occupancy/equal-height/remainder, shell,
responsive transitions and horizontal overflow.

V0 returns `PASS`, `DRIFT`, `PRODUCT_GAP` or factual exhausted-work `BLOCKER`.
A `DRIFT` is scoped to its owning domain and does not erase independent passes.

## 12. R0 contour

R0 prioritizes:

```text
latest one merge-ready specialist batch
→ bounded integration-risk review
→ sole executable trunk
→ exact tested descendant
→ one Kaggle build/publish path
→ exact artifact/URL verification
→ V0 trigger evidence
```

R0 may do deterministic bulk migration only when it is clearly mechanical and
not duplicating a live specialist. It does not become a second builder,
framing architect or visual auditor.

Historical `r0/*` branches are not integration targets. Their commits may be
used only as reviewed evidence/donors and, when still applicable, explicitly
replayed onto the sole trunk.

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

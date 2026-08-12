# LoveKGD Component Synthesis v0.1 — exact source-path cut

**Status:** bounded candidate synthesis; `authority_mode=reconstructed`; `canonical=false`; `accepted=false`; `promotion_ready=false`
**Generated:** 2026-08-10T22:16:08.146068+00:00
**Initial observed product main:** `a161061d8161409566412db2b1909031949dc104`
**Reconciled product main:** `f66330f8af81d4b898d137d83356e77914dce90a`
**Initial observed design-system main:** `509fa1a70dcd6f28f507c85e926252752ac545ee`
**Reconciled design-system main:** `c59a3576c7361c1953b31ad9b98ed096640e92c7`
**Pinned decoder evidence:** `events-bot-new@66bc0d43e36299417626f992021cfb7299ddf704`

## 1. Результат

Это первый полный машинно-читаемый synthesis между текущими Astro implementations и candidate design-system model. Он не повторяет decoder, readiness-аудит или owner-decision pack.

Получено:

- **107/107 exact current source paths** с одной terminal disposition; directory placeholders — **0**;
- **111** candidate/analytical entities;
- **61** candidate primitives, controls, navigation, content and composite components;
- **64** W1–W4 materialization entities after dependency/plan reconciliation;
- **15** product patterns;
- **11** current page compositions;
- **18** page-archetype candidates;
- **9** nonvisual runtime enablers;
- **7** experiments/evidence/unresolved entities;
- **0 owner ambiguities**;
- **6 technical reconciliation items**.

`107/107` означает source-path closure, а не автоматическое принятие всех boundaries. Все target records остаются candidate и reconstructed.

## 2. Основные решения synthesis

### Карточки события

`EventCard.astro` остаётся candidate `event.card`. Exact DOM/a11y/consumer reconciliation показал, что `listings/ListingEventCard.astro` имеет иной action/focus/content contract, поэтому он выделен в `listing.event-card`, а stale axis `event.card[layout=listing]` удалён. `EventListItem.astro` также остаётся отдельным `event.list-item`; это evidence-backed technical delta, не owner question.

### Event Detail

Сохранены четыре самостоятельные композиции:

```text
page.event-detail.editorial
page.event-detail.split
page.event-detail.no-image
page.event-detail.mobile
```

Они собираются из media, summary, facts, actions, transport и continuation components. Весь Event Detail не превращён в god component.

### Event Hero и actions

`EventHero.astro` разделён на media frame/viewer, summary, actions и hero composition. Lab-only `EventMediaRail.astro` не является production rail identity. Текущий mobile listing rail материализуется как `listing.rail-row` и содержит `0..N` linked `event.media-frame` instances. `DesktopEventActionPanel.astro` разделён на admission summary, primary action и shared utilities; layout difference остаётся на уровне composition.

### Transport

Прежняя гипотеза одного `transport.timetable` отменена. Выделены:

```text
transport.rail-schedule
transport.bus-schedule
transport.kaup-schedule
transport.schedule-region   # composition selecting one domain schedule
```

Rail, bus и KAUP имеют разные anatomy/state/responsive contracts. `DepartureBoard`, `RouteStrips`, `NextDepartureQueue` и их host остаются `experiment.transport-timetable`, `NOT_MERGED`, без выбранного winner.

### Brand и runtime directories

Directory placeholders заменены exact files:

```text
brand/AnnouncementsLockup.astro       → brand.lockup
brand/AnnouncementsWordmark.astro     → brand.wordmark
onboarding/StandardOnboardingPlacementContext.astro
                                      → runtime.onboarding-placement-context
personalization/PersonalizationRuntime.astro
                                      → runtime.personalization
```

Последние два — runtime enablers и не становятся Penpot components.

### Event Token Medallions

Exact source taxonomy закрыла technical boundary: `EventTokenMedallions.astro` зарегистрирован как `event.token-medallions` product pattern/composition, а не универсальный medallion component. Его typed items `organizer|source|program|pushkin|badge|pill` сохраняют разные identity-image, badge и status semantics; pattern остаётся reconstructed, `canonical=false`, `accepted=false`, `promotion_ready=false`.

## 3. Media и loading

Media policy остаётся consumer- и content-semantic-specific. Registry допускает `4:5`, `5:4`, `3:2`, `2:3`, `1:1`, intrinsic/source и дополнительные source-proven ratios. Fit/crop/focal/safe-area/upscale/fallback определяются по consumer profile, asset semantics и exact-pixel geometry, а не глобально.

Defragmentation at events source `f66330f8af81d4b898d137d83356e77914dce90a` produced `21` rule dispositions, `17` consumer profiles, an exact partition of `52` historical applications and `18` state fixtures. `event.media-frame` has five resolver-backed native cases rather than independent fit/ratio/crop axes. Solver `contain` cannot be rewritten to `cover`; protected and stale geometry cannot authorize crop. Open evidence conflicts remain explicitly blocked instead of becoming target rules.

Loading применяется по региону:

```text
статический полезный HTML → без initial skeleton
stale/static fallback при refresh/rerank → сохранять контент
реальная client wait + известная geometry → component-matching skeleton
```

## 4. Owner review

```text
OWNER_AMBIGUITY_COUNT: 0
```

Текущие gaps не являются выбором между двумя равно допустимыми продуктовым моделями. Это работа агента: source reconciliation, domain taxonomy, reachability и accessibility evidence.

## 5. Technical reconciliation results

1. `TECH-EVENT-LIST-001` — `RECLASSIFIED_WITH_EVIDENCE`: отдельный `event.list-item`.
2. `TECH-MOBILE-SEARCH-NAV-001` — `RECLASSIFIED_WITH_EVIDENCE`: compatibility wrapper → `navigation.mobile-tab-bar[current=search]`, без отдельного master.
3. `TECH-MEDALLION-001` — `RECLASSIFIED_WITH_EVIDENCE`: typed `event.token-medallions` product pattern.
4. `TECH-EVENT-CARD-001` — `RECLASSIFIED_WITH_EVIDENCE`: `event.card` и `listing.event-card` остаются разными identities.
5. `TECH-EVENT-MEDIA-001` — `PASS_WITH_DECLARED_VARIANT`: 35 consumer/slot-specific media cells, без глобального ratio/fit/upscale token.
6. `TECH-TRANSPORT-EXPERIMENT-001` — `PASS`: baseline остаётся в `transport.kaup-schedule`; host и три treatments сохраняют `NOT_MERGED`, winner не выбран.

`OWNER_AMBIGUITY_COUNT: 0`. Machine evidence: `technical-reconciliation-results.jsonl`, `source-drift-ledger.jsonl`, `media-policy-matrix.jsonl`.

## 6. Penpot materialization

W1–W4 планируют 64 native candidate masters/variants/states после reconciliation (W1=16, W2=13, W3=17, W4=18). W5 собирает archetypes только из instances. Screenshots остаются evidence. Все resources сохраняют:

```text
CANDIDATE
accepted: false
promotion_ready: false
authority_mode: reconstructed
```

## 7. Application state

Bounded implementation completed the repository-side work:

1. exact 107-path/current-edge replay is bound to events `f66330f8af81d4b898d137d83356e77914dce90a`;
2. records are integrated into the existing normalization architecture with strict schemas and validators;
3. all 64 W1–W4 candidates have contracts, fixtures and deterministic native Penpot IR;
4. all 18 archetype candidates are represented by native-instance plans or 12 explicit gaps;
5. technical reconciliation is terminal 6/6 and `OWNER_AMBIGUITY_COUNT` remains 0;
6. rollback/read-back/history plans and a real second-run idempotency gate are committed.

The full 64-entity materialization remains separately bounded, but the Event Media model now has a successful lightweight native proof on page `43 — Media policy · EventMediaFrame`: five native frame cases plus a `listing.rail-row` with four linked non-detached frame instances. Semantic read-back at revision `108` found zero duplicate stable IDs and zero validation errors; the second reconcile created zero objects. Raster export alone is blocked by two exact Penpot exporter HTTP 504 responses and is not claimed complete.

## 8. Ограничение

Repository artifacts, validators and the Draft PR are implemented; production source and live Penpot remain unmodified. Numeric design tokens and final geometry were not invented. The materialization package uses source-evidenced candidate contracts and existing scaffold zones, while unresolved live execution is reported only as the exact external blocker.

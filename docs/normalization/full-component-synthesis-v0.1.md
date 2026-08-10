# LoveKGD Component Synthesis v0.1 — exact source-path cut

**Status:** bounded candidate synthesis; `authority_mode=reconstructed`; `canonical=false`; `accepted=false`; `promotion_ready=false`  
**Generated:** 2026-08-10T22:16:08.146068+00:00  
**Observed product main in this conversation:** `a161061d8161409566412db2b1909031949dc104`  
**Observed design-system main in this conversation:** `509fa1a70dcd6f28f507c85e926252752ac545ee`  
**Pinned decoder evidence:** `events-bot-new@66bc0d43e36299417626f992021cfb7299ddf704`

## 1. Результат

Это первый полный машинно-читаемый synthesis между текущими Astro implementations и candidate design-system model. Он не повторяет decoder, readiness-аудит или owner-decision pack.

Получено:

- **107/107 exact current source paths** с одной terminal disposition; directory placeholders — **0**;
- **111** candidate/analytical entities;
- **61** Penpot-eligible primitives, controls, navigation, content и composite components;
- **14** product patterns;
- **11** current page compositions;
- **18** page-archetype candidates;
- **9** nonvisual runtime enablers;
- **10** experiments/evidence/unresolved entities;
- **0 owner ambiguities**;
- **6 technical reconciliation items**.

`107/107` означает source-path closure, а не автоматическое принятие всех boundaries. Все target records остаются candidate и reconstructed.

## 2. Основные решения synthesis

### Карточки события

`EventCard.astro` и `listings/ListingEventCard.astro` сведены к одному candidate `event.card` с axes layout/media/density/action. Финальный merge implementation блокирует только точная DOM/a11y/consumer-override сверка, а не вопрос владельцу.

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

`EventHero.astro` разделён на media frame/viewer/rail, summary, actions и hero composition. `DesktopEventActionPanel.astro` разделён на admission summary, primary action и shared utilities; layout difference остаётся на уровне composition.

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

`EventTokenMedallions.astro` не сохранён как «универсальный medallion component» и не разрезан на выдуманные identities. Он остаётся technical unresolved boundary до source/domain taxonomy: medallion, badge/pill/status и identity-image должны быть доказаны отдельно.

## 3. Media и loading

Media policy остаётся consumer- и content-semantic-specific. Registry допускает `4:5`, `5:4`, `3:2`, `2:3`, `1:1`, intrinsic/source и дополнительные source-proven ratios. Fit/crop/focal/safe-area/upscale/fallback определяются по consumer slot, а не глобально.

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

## 5. Technical reconciliation queue

1. `EventListItem` против `event.card[layout=listing]`.
2. Reachability/ownership `MobileSearchBottomNav`.
3. Domain split `EventTokenMedallions`.
4. Exact implementation convergence `EventCard` / `ListingEventCard`.
5. Consumer-scoped media matrix.
6. Transport experiment treatments без winner.

## 6. Penpot materialization

W1–W4 создают native candidate masters/variants/states. W5 собирает archetypes только из instances. Screenshots остаются evidence. Все resources сохраняют:

```text
CANDIDATE
accepted: false
promotion_ready: false
authority_mode: reconstructed
```

## 7. Что остаётся кодовому агенту

Кодовому агенту не требуется заново решать, что является компонентом. Его bounded задача:

1. проверить exact path set и импорт/consumer edges на актуальном SHA;
2. положить records в существующую normalization architecture и добавить schemas/validators;
3. создать native Penpot candidates по materialization plan;
4. собрать 18 archetype candidates из instances;
5. сохранить technical queue и `OWNER_AMBIGUITY_COUNT: 0`;
6. не менять production Astro/CSS, не выбирать experiment winner и не выполнять promotion.

## 8. Ограничение

Пакет создан read-only: GitHub, Penpot и production source не изменялись. Числовые design tokens и финальная geometry не выдумывались; где source/computed evidence ещё не извлечено, это отмечено как reconciliation/materialization requirement.

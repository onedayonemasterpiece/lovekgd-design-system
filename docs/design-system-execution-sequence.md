# LoveKGD Design System — практическая очерёдность завершения

> **Статус:** рабочий план выполнения, связанный с [чек-листом завершения](design-system-progress-checklist.md).  
> **Актуальность checkpoint:** 23 августа 2026 года.  
> **Назначение:** определить, что делать после карточек событий, когда нормализовать foundations, shell, полки, модальные окна и архетипы, не выполняя одну и ту же работу дважды.  
> **Принцип:** дизайн-система строится для устранения визуального и технического дрейфа сайта, а не ради полноты каталога.

## 0. Фактический checkpoint

Этот план описывает не старт с нуля, а продолжение уже идущей работы.

На момент актуализации:

- current-v2 EventCard Large имеет active seven-case registry, но остаётся `BLOCKED` до полного evidence/read-back closure и точной mobile export revision;
- PR [#43](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/43) уже содержит bounded `listing-foundations-candidate-v1`, Date Listing и Shell v1 на 7 real-event fixtures и 7 representations; статус — candidate `READY_FOR_OWNER_REVIEW`, не accepted/promoted/deployed;
- Weekend и общий `Listing Page Pattern v1` входят в текущую автономную Goal и не считаются завершёнными до появления exact evidence;
- production Event Detail, Search, Favorites и For Me реально существуют в Astro, но это ещё не нормализованные и не promoted дизайн-системные архетипы;
- Event Detail source уже содержит desktop `editorial`/`split`, mobile composition, transport и question CTA; обязательный case «широкая фотография + отдельно выделенная identity poster сбоку» должен быть явно закреплён в archetype contract, а не оставаться скрытой routing-веткой.

Checkpoint обновляет статус, но не меняет правило завершения: candidate materialization без owner acceptance и consumer migration не получает `[x]`.

## 1. Основное решение

Нельзя выбирать одну из двух крайностей:

```text
сначала полностью нормализовать все foundations и компоненты
→ потом собирать страницы
```

или:

```text
сначала собрать все архетипы как есть
→ потом исправлять шрифты, цвета, отступы и скругления
```

Первая схема создаёт абстрактную работу без реального контекста. Вторая закрепляет локальный дрейф внутри архетипов и заставляет переделывать их позднее.

Рабочая схема — **вертикальные волны с минимальным foundation gate перед каждой волной**:

```text
bounded component/archetype scope
→ проверить нужные foundations
→ зафиксировать недостающие semantic rules в Git SoT
→ собрать native Penpot resources
→ сравнить с Astro на одинаковых fixtures
→ owner review
→ после принятия донести ту же версию до Astro
→ перейти к следующей волне
```

Foundations создаются и стабилизируются по реальным потребителям. При этом новый архетип не имеет права вводить собственную локальную типографику, палитру, spacing scale, radii или grid.

## 2. Два направления одного процесса

До promotion конкретной family действуют два последовательных режима.

### Реконструкция: `astro-reference`

```text
pinned Astro AS-IS
→ Git SoT candidate
→ Penpot native candidate
→ инструментальная сверка
→ owner review
```

Цель — доказать, что Penpot честно воспроизводит фактический компонент и его составные части, кроме явно зарегистрированных candidate-изменений.

### Доработка: `penpot-candidate-reference`

После явного owner acceptance bounded Penpot candidate:

```text
принятые Git SoT + Penpot
→ isolated Astro candidate
→ та же инструментальная сверка
→ browser/device review
→ migration consumers
```

Не нужно сначала реконструировать весь сайт, а потом отдельно унифицировать весь сайт. Каждый ограниченный scope проходит оба направления до перехода к следующему крупному scope.

## 3. Постоянный цикл для каждой волны

Каждая component family, pattern или archetype проходит один и тот же короткий цикл:

1. **Census:** точные Astro consumers, states, responsive branches и локальные overrides.
2. **Foundation delta:** какие шрифты, цвета, spacing, radii, grid, icons, media и accessibility rules нужны этой волне.
3. **SoT contract:** identity, anatomy, states, fixtures, dependencies и разрешённые overrides.
4. **Penpot materialization:** native masters, variants и linked instances без detached copies.
5. **Conformance:** одинаковые fixtures/state/viewport в Astro и Penpot, instrumental comparison и визуальный review.
6. **Owner review:** комментарии относятся к exact resource/version/hash.
7. **Correction:** Git SoT first, затем Penpot reconciliation; после acceptance — Astro candidate.
8. **Migration:** убрать дубли и route-local forks только в затронутом scope.
9. **Checklist update:** evidence, status и следующий конкретный blocker.

Нельзя считать волну закрытой только потому, что появился красивый Penpot board или зелёный pixel diff.

---

# Очерёдность работ

## Волна 0 — закончить текущую работу по карточкам событий

### Scope

- `event.card` / EventCard Large;
- `listing.event-card`;
- `listing.rail-row`;
- card actions и meta components;
- card iconography;
- media framing;
- medallion tiers and bindings;
- Golden Event Corpus и Astro ↔ Penpot conformance.

### Результат

- одна понятная taxonomy карточек;
- native parent/child component graph;
- одинаковые real-event fixtures для Astro и Penpot;
- разрешены только content/state instance overrides;
- системные visual overrides на конечных instances отсутствуют;
- comparison cases воспроизводимы локально и в CI;
- owner может проверять Astro/Penpot comparison в Telegram;
- current-v2 evidence/read-back не содержит неизвестной или подменённой export revision.

Это обязательная зависимость следующих волн. Не требуется одновременно продвигать все пять card families в production, но exact versions, states и remaining candidate deltas должны быть известны.

Актуальный blocker не следует заменять старым текстом PR: current-v2 closure должен честно закрыть evidence packs, contract metadata read-back и mobile export provenance.

---

## Волна 1 — минимальный foundation baseline для листингов

Эту волну нужно выполнить **до первого архетипа**, но не превращать в полную нормализацию всего сайта.

### Зафиксировать только реально потребляемые области

#### Typography

- основной font stack и правила загрузки;
- display/page title;
- section heading;
- card title;
- body/meta/label;
- line-height, weight и mobile/desktop limits;
- long-title и overflow behavior.

#### Color

- canvas/background;
- surface;
- primary text и muted text;
- border/divider;
- brand/action;
- success/warning/error;
- hover/focus/disabled states;
- minimum contrast.

#### Layout

- canonical mobile/desktop breakpoints;
- content containers;
- page outer margins;
- listing grid/flow;
- responsive branches.

#### Spacing

- небольшая semantic scale;
- page, section, group, component и inline roles;
- запрет случайных page-local значений без exception.

#### Radius/elevation

- media;
- card;
- control;
- container/surface;
- overlay;
- shadow/elevation roles.

#### Cross-cutting

- focus visibility;
- minimum target sizes;
- reduced motion;
- base icon sizing;
- уже принятое media framing.

### Важное ограничение

Это `listing-foundations-candidate-v1`, а не обещание, что глобальный брендбук и все значения сайта окончательно завершены. Значения проверяются на первом архетипе и стабилизируются после второго listing archetype.

Текущий candidate в PR #43 является evidence этой волны, но не заменяет owner acceptance.

---

## Волна 2 — первый вертикальный срез: архетип страницы на дату

Первый архетип:

```text
archetype.listing.date
```

Он объединяет:

- сегодня;
- завтра;
- конкретную дату.

Это один archetype с режимами, а не три независимые страницы.

### Сначала собрать body, shell использовать как pinned AS-IS dependency

Архетип владеет:

- page/listing header;
- date and weather context;
- controls and filters;
- time navigation;
- time groups;
- desktop card flow;
- mobile listing rail;
- completed/upcoming/now states;
- empty state;
- optional personal slot.

Общая site header, mobile menu, bottom navigation и footer на первом проходе не копируются внутрь архетипа. Они показываются в full-screen representation как `AS_IS_EXTERNAL` dependencies.

### Нормализовать вместе с архетипом

- `ListingPageHeader`;
- `ListingDiscoveryRail` как control/navigation rail;
- `ListingControls`;
- `ListingTimeNav`;
- `ListingTimeMarker`;
- `ExactTimeTimeline` или доказанный replacement pattern;
- mobile listing parent pattern;
- page-level loading/empty/error states;
- modal/sheet primitives, только если они реально нужны calendar/filter flow.

### Не создавать god component

Технический `DateListingSurface` не обязан становиться одним Penpot master. Каждый блок классифицируется как:

```text
component
product pattern
archetype-owned region
runtime-only behavior
external dependency
```

### Representation set

Минимум:

1. typical desktop;
2. typical mobile;
3. sparse;
4. loading/empty/error matrix;
5. один stress case;
6. full-page desktop shell;
7. full-page mobile shell.

Не требуется статически дублировать в Penpot полный production-листинг из 20–30 карточек.

---

## Волна 3 — нормализация общего shell v1

После появления первого реального archetype body становится понятен контекст shell. До масштабирования на много страниц нормализовать:

1. desktop header;
2. mobile top/header;
3. mobile menu;
4. mobile bottom navigation;
5. shared overlay layer;
6. footer;
7. решение о desktop-аналоге bottom navigation.

### Почему не раньше

Без первого архетипа невозможно надёжно принять container width, sticky offsets, z-index, mobile safe areas и взаимодействие с listing controls.

### Почему не позже

Если собрать много архетипов с разным shell AS-IS, shell drift проникнет во все full-screen representations и потребует массовой переделки.

### Внутренний порядок

Header, mobile menu и bottom navigation важнее footer, потому что влияют на доступную область, sticky behavior и основные пользовательские пути. Footer не блокирует первую body-parity, но должен быть нормализован до promotion первой полной page family.

### Brand delta

В этой волне оформить минимальный brand foundation:

- logo/wordmark use;
- primary brand colors;
- typography role in shell;
- backgrounds;
- allowed/forbidden combinations.

Полный брендбук можно расширить после появления Home и editorial surfaces.

---

## Волна 4 — второй listing archetype: выходные

Собрать `archetype.listing.weekend` reuse-first.

Переиспользовать всё, что семантически совпадает с Date Listing, и реализовать только delta:

- range navigation;
- weekend grouping;
- weekend-specific timeline/rail behavior;
- relevant editorial or artifact slots;
- distinct empty/stress states.

### После двух архетипов

Только теперь извлечь общий `Listing Page Pattern`, потому что появилось два реальных потребителя.

На этом этапе:

- сравнить Date и Weekend;
- отделить общее от route-specific;
- удалить необоснованные local overrides;
- стабилизировать listing typography, spacing, radius и grid как foundation v1;
- не объединять семантически разные блоки только по внешнему сходству.

---

## Волна 5 — Popular и Unusual

Эта волна проверяет, выдерживает ли общий listing pattern:

- другую grouping semantics;
- personalization;
- density variants;
- unread/status behavior;
- иной набор controls;
- dynamic/stale states.

После неё можно завершать migration listing family в Astro и включать fail-closed drift checks для затронутых consumers.

---

## Волна 6 — Event Detail

После стабилизации карточек и listing journey перейти к странице события:

```text
листинг
→ карточка
→ event detail
```

`archetype.event-detail` — один responsive archetype с explicit composition variants, а не один усреднённый экран и не набор несвязанных страниц.

### 6.1. Обязательная desktop composition matrix

#### A. `editorial-wide`

Широкая crop-safe фотография является основным hero. Проверить:

- bounded cover/object-position;
- optional media rail;
- title/summary/content flow;
- actions and sticky/continuous behavior;
- gallery states;
- long copy and related events.

#### B. `split-poster`

Узкая/вертикальная афиша, portrait visual или protected document media показывается в отдельной narrow stage рядом с content flow. Проверить:

- отсутствие растяжения и необоснованных полей;
- bounded poster/document framing;
- portrait viewer and rail;
- long title/content;
- no-image-compatible layout fallback.

#### C. `editorial-with-poster-companion`

Широкая фотография остаётся hero, а отдельно классифицированная `event_identity_poster` показывается выделенным companion-блоком сбоку.

Это обязательный отдельный case:

```text
wide landscape hero
+ classified identity poster
+ side companion/arrival region
```

Нельзя растворять его в общей метке `editorial` или заменять обычной thumbnail rail. В manifest должны быть точные `heroImageIndex`, `ocrCompanionImageIndex`, companion layout/state и shared fixture.

#### D. `no-image`

Typed fallback без выдуманного media. Actions, facts, description, transport, feedback и related content продолжают работать.

### 6.2. Обязательная mobile composition matrix

Mobile имеет отдельные representations, но те же semantic contracts:

1. photo hero/gallery;
2. poster/protected-media hero;
3. no-image fallback;
4. sticky primary action;
5. medallions/participants;
6. description/facts;
7. transport;
8. question/feedback CTA;
9. related events;
10. archived/closed and interaction checkpoints.

### 6.3. Общий scope Event Detail

- hero composition;
- media frame/viewer/gallery;
- summary and occurrence navigation;
- admission/actions;
- facts;
- participants/venue;
- medallions;
- description/long-form content;
- transport;
- question/feedback;
- related events;
- optional personal feed;
- no-image, protected-media, archived/closed and source-update branches.

### 6.4. Transport pattern

Собрать один conditional `event.transport` pattern из реальных consumers:

- rail schedule;
- bus schedule;
- Kaup/special route;
- multiple modes together;
- no transport data;
- unavailable/stale/error/source-update states;
- desktop and mobile density;
- explicit-end/time feasibility behavior.

Transport не должен становиться обязательным пустым блоком каждого события. Archetype объявляет slot и условия появления.

### 6.5. Question, feedback и NPS

Развести три разных Jobs:

1. **Current production question CTA** — «Остались вопросы?» с переходом к источнику/партнёру;
2. **Event/surface feedback** — ошибка в событии, полезность страницы, предложение улучшения;
3. **Overall relationship NPS** — редкий cadence/trigger-based вопрос о продукте в целом.

В Wave 6:

- нормализовать desktop/mobile `EventQuestionCta`;
- добавить optional `event_issue`, `surface_usefulness` и `improvement` slots/states;
- подготовить binding к shared feedback dialog foundation;
- не размещать overall NPS постоянно на каждой event page.

Overall NPS стабилизируется после появления нескольких реальных page-family consumers в Wave 7.

### 6.6. Representation and conformance set

Минимальный acceptance set:

- четыре desktop composition cases;
- три mobile media cases;
- transport present/absent/multi-mode;
- question CTA present/absent;
- feedback dialog checkpoints;
- gallery/viewer open/close, keyboard and swipe checkpoints;
- long copy, long title, no image, protected poster and archived state.

Использовать один manifest и одни real-event fixtures на Astro/Penpot. Penpot показывает устойчивые checkpoints; browser остаётся authority для swipe, drag, scroll physics, keyboard flow и animations.

### Modal/dialog system

Общий overlay foundation уже должен существовать после shell/date waves. Здесь добавить domain-specific gallery/viewer/feedback states без создания второго modal framework.

---

## Волна 7 — Search, Favorites, Personal Feed и shared feedback system

Эти архетипы идут после основной карточной, listing и Event Detail инфраструктуры. Они добавляют прежде всего состояния данных, auth/identity и recovery.

### 7.1. Search

Собрать `archetype.search` из production `/poisk/` и `AuthorizedEventSearch`.

Обязательные states:

- auth checking;
- signed out;
- signed in/account/logout;
- idle input;
- validation;
- loading/progress/skeleton;
- populated results;
- empty;
- pagination/load more;
- slow/timeout/error/retry/fallback;
- query preservation through auth callback;
- mobile bottom-navigation reconciliation.

Search results используют принятую card family. Новый visual card type создаётся только при доказанной anatomy/behavior delta.

### 7.2. Favorites

Собрать `archetype.favorites` из production `/izbrannoe/` и `FavoritesSurface`.

Обязательные states:

- initial loading skeleton;
- signed-out local saves;
- auth-required explanation;
- signed-in local + cloud reconciliation;
- populated future-only deduplicated list;
- empty;
- catalog/renderer/cloud failure без потери local state;
- stale/past cleanup;
- live update after like/calendar action;
- desktop/mobile layout.

Favorites не получает отдельную карточку, если production consumer использует принятую event card с context/state contract.

### 7.3. For Me / Personal Feed

Сначала зафиксировать разницу между текущим noindex prototype `/dlya-menya/` и целевым персональным feed.

Обязательные states:

- consent not granted/granted/revoked;
- empty/populated explicit interest profile;
- computed interest index with insufficient/sufficient data;
- local storage unavailable;
- digest eligibility locked/eligible/enabled;
- recommendations, explanation and reaction states;
- hidden/restored items;
- signed out/signed in boundary;
- no-JavaScript fallback;
- loading/empty/populated/stale/error для target real feed;
- gated focus-participant feedback.

Не объявлять prototype promoted product archetype, пока target data/identity contract не принят.

### 7.4. Shared feedback/NPS stabilization

После Event Detail и как минимум ещё одного page-family consumer извлечь общий pattern:

- `feedback.surface-usefulness`;
- `feedback.improvement`;
- `feedback.event-issue`;
- `feedback.overall-nps`;
- dialog/sheet, confirmation, error and retry states;
- auth/participant gate;
- cadence/trigger and persistence contract;
- privacy/no-PII copy;
- page-family/context binding.

Overall NPS остаётся отдельным relationship signal и не смешивается с полезностью конкретной страницы.

---

## Волна 8 — Home и общие content shelves

Главную не следует делать первой: она соединяет слишком много ещё нестабильных patterns.

К этому моменту должны существовать:

- shell;
- card families;
- listing patterns;
- Event Detail journey;
- state system;
- basic personalization;
- page typography and layout foundations.

### Когда делать полки

Различать:

- control/navigation rail — делается в Date Listing;
- mobile card track — делается с listing cards;
- generic content shelf — делать только после появления минимум двух реальных потребителей, например Home и Related Events/Event Detail.

Не проектировать заранее один «универсальный shelf» без двух подтверждённых anatomy/behavior contracts.

---

## Волна 9 — Collections, Festivals, Exhibitions и Clubs

После базовых listing/shelf patterns можно обоснованно отделить:

- editorial collection;
- festival-specific cards/header/timeline;
- exhibition deck/gallery;
- club catalogue/detail.

Сложные gallery/deck components получают `state-sampled` или `structure-and-behavior`, а не полный visual-test skip.

---

## Волна 10 — information, legal, partner и special-state pages

Завершить:

- documents/legal;
- partners;
- prelaunch;
- closed/unavailable;
- registration only after accepted product capability and source route contract.

Эта волна одновременно проверяет document typography, long-form content и special-state patterns.

---

## Волна 11 — site-wide consolidation и promotion

После прохождения основных page families:

- завершить mini-brandbook/full brand foundation;
- проверить global typography coverage;
- удалить оставшийся spacing/color/radius drift;
- завершить full iconography registry;
- проверить modal/overlay consistency;
- закрыть accessibility and motion coverage;
- мигрировать все production consumers на promoted packages;
- удалить/deprecate старые реализации;
- включить post-deploy conformance;
- связать semantic component/archetype IDs с analytics.

Это финальная консолидация, а не момент, когда впервые начинают исправлять шрифты и отступы.

---

# Когда нормализовать конкретные области

| Область | Первый обязательный момент | Когда стабилизировать |
|---|---|---|
| Font stack | Карточки / до Date Listing | После Date + Weekend |
| Заголовки и type scale | До Date Listing | После Date + Weekend/Popular |
| Semantic colors | До Date Listing | Shell + первые два архетипа |
| Spacing scale | До Date Listing | После двух listing archetypes |
| Radii/elevation | Карточки + до Date Listing | После shell и двух listing archetypes |
| Containers/grid/breakpoints | До Date Listing | После Date + shell + Weekend |
| Brand basics | До/в Shell v1 | Расширить с Home/editorial surfaces |
| Iconography | По card scope сейчас | Global registry в Shell/Core waves |
| Modal/dialog/sheet | При первом calendar/menu/filter flow | Расширить в Event Detail/Search/feedback |
| Loading/empty/error/retry | В каждой component/archetype wave | Никогда не откладывать на финал |
| Focus/keyboard/a11y/motion | С первой component wave | Проверять в каждой последующей wave |
| Control/navigation rails | Date Listing | Проверить Weekend/Popular |
| Generic content shelves | Не делать заранее | После двух реальных shelf consumers |
| Header/mobile navigation | После первого body archetype | До масштабирования на остальные страницы |
| Footer | После top shell | До promotion первой полной page family |
| Event Detail composition matrix | Wave 6 до materialization archetype | После wide + split + wide/companion + mobile fixtures |
| Transport pattern | Wave 6 | После rail/bus/special + absent/stale/error states |
| Event question and event-issue feedback | Wave 6 | После desktop/mobile Event Detail review |
| Overall NPS/usefulness/improvement | Не делать page-local заранее | Wave 7 после минимум двух page-family consumers и trigger contract |
| Search fields/results/account states | Wave 7 Search | После mobile/desktop/auth/recovery acceptance |
| Favorites/local-cloud reconciliation | Wave 7 Favorites | После local/cloud/error/stale coverage |
| Personal profile/feed states | Wave 7 For Me | После prototype/target boundary и real-feed contract |

---

# Данные карточек внутри архетипов

## Один master, много linked instances

Каждая карточка на странице — instance одного принятого component master.

Разрешённые overrides:

- title;
- image;
- date/time;
- place;
- admission;
- counts;
- labels;
- variant/state selection;
- declared slots.

Запрещённые terminal overrides:

- font;
- padding/gap;
- radius;
- color role;
- icon geometry;
- media treatment;
- anatomy и region order.

## Можно ли повторять одинаковые карточки

### Для быстрого smoke

Да. Несколько одинаковых linked instances допустимы для проверки flow, grid, gap, clipping и общей плотности.

### Для owner acceptance архетипа

Недостаточно. Нужен небольшой набор из 5–7 разнообразных real-event fixtures:

- standard photo;
- portrait/OCR;
- no-image;
- long title/place;
- free;
- paid/unspecified;
- untimed/multi-day/completed.

После первых уникальных fixtures дополнительные layout-fill instances могут циклически повторяться и не считаются новым coverage.

## Не рисовать длинную production-страницу вручную

Penpot должен доказывать composition, rhythm, responsive layout и state coverage. Полный список, scrolling, sticky behavior и performance проверяются в Astro/Playwright.

## Один manifest для обеих сторон

```yaml
representation_id: listing.date.typical.desktop
archetype_id: archetype.listing.date
viewport_id: desktop-1728x900
groups:
  - key: "10:00"
    fixture_ids: [event.photo, event.long-title]
  - key: "14:00"
    fixture_ids: [event.poster, event.free]
  - key: untimed
    fixture_ids: [event.no-image]
```

Astro и Penpot получают один и тот же manifest и те же fixture IDs. Ручное отдельное заполнение двух сторон запрещено.

Для Event Detail тот же принцип распространяется на composition metadata:

```yaml
representation_id: event-detail.desktop.editorial-with-poster-companion
archetype_id: archetype.event-detail
viewport_id: desktop-1728x900
fixture_id: event.landscape-plus-identity-poster
composition: editorial
hero_source_index: 1
poster_companion_source_index: 0
poster_companion_layout: arrival
```

---

# Правила эффективности

1. Не ждать готовности всей дизайн-системы до первой promotion.
2. Не нормализовать весь сайт до появления реальных потребителей foundation.
3. Не разрешать архетипам локальные visual foundations.
4. Не создавать universal pattern после одного применения.
5. Новый archetype начинает с reuse-first и delta-only reconstruction.
6. Foundation change перезапускает только dependency closure, а не весь catalog.
7. Local conformance проверяет один component/case; Actions выполняет changed scope и массовые batches.
8. Live Penpot export выполняется при изменении Penpot resource, а не при каждом Astro rerun.
9. Owner review получает representative Telegram boards, а не сотни однотипных PASS-картинок.
10. Checklist обновляется после каждой волны, чтобы исследования и candidates не выглядели как внедрённый результат.
11. Наличие production route подтверждает consumer, но не закрывает DS archetype.
12. Optional product signal не превращается в постоянный блок страницы только потому, что уже существует prototype.

# Что не делать

- не собирать все архетипы до нормализации typography/spacing/grid;
- не пытаться завершить весь brandbook до первого архетипа;
- не копировать header/footer внутрь каждого archetype;
- не принимать archetype только по body screenshot без full-screen shell context;
- не делать Home первым archetype;
- не проектировать generic shelves до двух реальных применений;
- не создавать локальный modal framework для каждой страницы;
- не вставлять карточки как detached copies;
- не требовать уникальные данные для каждой из десятков layout-fill cards;
- не считать повторяющиеся карточки достаточным stress coverage;
- не откладывать loading/error/accessibility на финальную волну;
- не сокращать Event Detail до generic wide/narrow и не терять wide+poster-companion case;
- не считать NPS синонимом полезности страницы или сообщения об ошибке события;
- не переносить noindex For Me prototype в promoted product без target data/identity contract.

# Текущий автономный контур и следующий рубеж

```text
1. Закрыть current-v2 card handoff без потери текущей работы.
2. Зафиксировать listing-foundations-candidate-v1.
3. Довести archetype.listing.date.
4. Довести site-shell-v1.
5. Собрать archetype.listing.weekend reuse-first.
6. После Date + Weekend извлечь Listing Page Pattern v1.
7. Провести один consolidated owner review.
8. Проверить pattern на Popular/Unusual.
9. Собрать Event Detail по полной desktop/mobile composition matrix.
10. Нормализовать Search, Favorites и For Me.
11. Стабилизировать shared feedback/NPS pattern на нескольких consumers.
```

Эта последовательность одновременно уменьшает повторную работу, не позволяет локальному Astro-дрейфу стать новой дизайн-системой и не теряет уже существующие сложные product branches.

# LoveKGD Design System — практическая очерёдность завершения

> **Статус:** рабочий план выполнения, связанный с [чек-листом завершения](design-system-progress-checklist.md).  
> **Назначение:** определить, что делать после карточек событий, когда нормализовать foundations, shell, полки, модальные окна и архетипы, не выполняя одну и ту же работу дважды.  
> **Принцип:** дизайн-система строится для устранения визуального и технического дрейфа сайта, а не ради полноты каталога.

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
- Golden Event Corpus и Astro ↔ Penpot conformance.

### Результат

- одна понятная taxonomy карточек;
- native parent/child component graph;
- одинаковые real-event fixtures для Astro и Penpot;
- разрешены только content/state instance overrides;
- системные visual overrides на конечных instances отсутствуют;
- comparison cases воспроизводимы локально и в CI;
- owner может проверять Astro/Penpot comparison в Telegram.

### Gate закрытия Wave 0: production-derived semantic census

Golden Event Corpus нужен для воспроизводимой Astro ↔ Penpot сверки, но не
является доказательством полноты content states. Перед закрытием Wave 0 нужен
отдельный census актуальной публичной проекции production-данных и фактически
отрендеренных Astro-значений. Он должен доказать как минимум:

- полный набор semantic value/label для типа события без превращения каждого
  встреченного текста в отдельный component variant;
- все admission families и реальные произвольные paid labels, включая суммы,
  диапазоны и валюты;
- fail-closed правила для отсутствующего или некорректного admission;
- CTA actions отдельно от content labels и social proof counts;
- какие значения являются принятыми состояниями SoT, а какие — зафиксированным
  runtime gap текущего Astro.

Текущий census `703` событий публичной проекции обнаружил `31` фактически
отрендеренный label типа события, `61` различный произвольный paid/range label,
а также ticket, free-registration, registration, phone и sold-out families.
Exact public-projection resolver census зафиксирован в
`events-bot-new: tests/fixtures/ui-conformance/event-card-large-production-semantic-census.v1.json`
и связан с исходным machine artifact SHA-256
`30c8ac5adfaeff17c463191714f660b3ed5d0a00aa8799e90f2be70cb1ca9993`.
Более широкий DB aggregate SHA-256
`3578bee41bda0b5e32e950fd1f27a2561b1ca3714ce7ac9bdd8cc4068e36ff08`
остаётся вспомогательным raw-DB evidence и не заменяет exact resolver census.
Эти данные определяют coverage contract; Golden fixtures выбираются из этого
coverage как небольшой долговременный корпус, а не заменяют census.

Это обязательная зависимость следующих волн. Не требуется одновременно продвигать все пять card families в production, но exact versions, states и remaining candidate deltas должны быть известны.

### Текущий bounded handoff по `EventCard · Large`

Semantic overlay `849c3c9035f1…` материализован в native Penpot и проверен на
семи одинаковых real-event fixtures. Durable evidence и verified Telegram
read-back перечислены в
`receipts/penpot/event-card-large-semantic-closure-v1.json`.

Для owner review используются только две компактные страницы: `40.1f`
(desktop, 4 корня) и `40.1g` (mobile 390, 3 корня). Процесс запрещает экспорт
всей страницы: один terminal comparison получает один bounded root export и
сразу публикуется в review-thread. Широкие сравнения размещаются вертикально,
узкие карточки — рядом, чтобы итоговый лист стремился к квадрату.

Это закрывает bounded semantic/materialization gate только для `EventCard ·
Large`. Wave 0 целиком нельзя объявлять завершённой до такой же явной фиксации
оставшихся card families из scope (`listing.event-card`, `listing.rail-row` и
остальные согласованные representations).

### Текущий честный ledger Wave 0 (2026-08-23)

| Scope | Статус | Что доказано | Что ещё не закрыто |
|---|---|---|---|
| `event.card` / EventCard Large | `AWAITING_OWNER_REVIEW` | semantic graph и семь exact same-fixture cases | owner acceptance и reverse integration |
| `listing.event-card` | `PARTIAL` | один exact case и структурный family audit | полный state/visual closure |
| `listing.rail-row` | `PARTIAL` | exact T04 native full track без viewport clipping; exact same-data T10 artifact-tail для event 6851 материализован и опубликован отдельно | оставшиеся состояния и family closure |
| `festival.card` | `AWAITING_OWNER_REVIEW` | 21-row Astro census, 16 фактических theme values, один linked Theme master, private Favorite удалён из всех 9 masters, shared Like+proof count; position-safe CSS veil и bounded crop повторно проверены | owner acceptance и reverse integration |
| `exhibition.row` | `PARTIAL` | bounded E01/medallion correction; slider остаётся зарегистрированным Astro-authoritative exception | остальная family/state closure |
| **Wave 0 целиком** | **`IN_PROGRESS`** | bounded результаты выше | нельзя объявлять завершённой до явного remaining-delta ledger по каждому scope |

Повторная упаковка уже существующего comparison на более компактную Penpot
страницу является `cleanup/revalidation`, а не новым прогрессом component
family. Новый прогресс фиксируется только когда изменился contract, master,
state coverage, exact evidence или terminal status. Последняя системная
коррекция `festival.card` записана в
`receipts/penpot/festival-card-owner-comments-correction-v3.json`; verified
live comparison — Telegram message `1088`. Оно исправляет alpha-compositing
скруглений из `1086`, сохраняет одинаковый radius 11 px и фиксирует 12 px
между Theme и Like; прежние `1085` и `1086` не являются текущей целью review.
Exact artifact-tail rail зафиксирован отдельно в
`receipts/penpot/mobile-listing-rail-artifact-exact-v1.json` и Telegram message
`1087`. До обновления этой таблицы фраза
«карточки событий завершены в целом» запрещена.

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

Для Penpot достаточно:

1. typical desktop;
2. typical mobile;
3. sparse;
4. empty;
5. один stress case.

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

Scope:

- hero composition;
- media frame/viewer/gallery;
- summary;
- admission/actions;
- facts;
- participants/venue;
- medallions;
- transport;
- related events;
- no-image and protected-media branches.

### Modal/dialog system

Общий overlay foundation уже должен существовать после shell/date waves. Здесь добавить domain-specific gallery/dialog states без создания второго modal framework.

Browser remains authority для swipe, drag, scroll physics, keyboard flow и animations. Penpot показывает устойчивые checkpoints.

---

## Волна 7 — Search, Favorites и Personal Feed

Эти архетипы идут после основной карточной и listing инфраструктуры, поскольку добавляют прежде всего состояния данных и identity:

- anonymous/authenticated;
- loading;
- empty;
- populated;
- error;
- retry;
- stale;
- saved/personalized;
- recovery.

Нельзя создавать отдельные визуальные карточки для Search/Favorites, если они используют уже принятую card family. Отличия оформляются state/context contract.

---

## Волна 8 — Home и общие content shelves

Главную не следует делать первой: она соединяет слишком много ещё нестабильных patterns.

К этому моменту должны существовать:

- shell;
- card families;
- listing patterns;
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
| Modal/dialog/sheet | При первом calendar/menu/filter flow | Расширить в Event Detail/Search |
| Loading/empty/error/retry | В каждой component/archetype wave | Никогда не откладывать на финал |
| Focus/keyboard/a11y/motion | С первой component wave | Проверять в каждой последующей wave |
| Control/navigation rails | Date Listing | Проверить Weekend/Popular |
| Generic content shelves | Не делать заранее | После двух реальных shelf consumers |
| Header/mobile navigation | После первого body archetype | До масштабирования на остальные страницы |
| Footer | После top shell | До promotion первой полной page family |

---

# Данные карточек внутри архетипов

## Один master, много linked instances

Каждая карточка на странице — instance одного принятого component master.

Разрешённые overrides:

- title;
- image;
- date/time;
- place;
- semantic event type value и его отображаемый label;
- admission content внутри разрешённой semantic family;
- social proof counts как произвольный owned content;
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

## Semantic content не равно variant taxonomy

Тип события — один semantic component/state с переопределяемыми value и label,
а не короткий закрытый список вроде трёх литералов и не отдельный variant для
каждой из `31` встреченной production-надписи. Census проверяет полноту
допустимых значений; Golden fixtures лишь представляют выбранные классы в
визуальной сверке.

Admission разделяется на semantic families, но его paid content не ограничен
несколькими заранее нарисованными строками: сумма, диапазон и валюта являются
произвольным содержимым, управляемым данными. Кроме paid поддерживаются
доказанные census families: ticket, free-registration, registration, phone и
sold-out. Неизвестное admission по owner decision скрывается fail-closed.
`Условия уточняются` не является разрешённым rendered state: `96` таких выводов
в текущем Astro учитываются как runtime gap. Два обнаруженных некорректных
вывода `0 ₽` также являются ошибками данных/rendering и не расширяют taxonomy.

Calendar, share, like и not-interested — CTA/action components с собственными
state/behavior contracts, а не service labels. Их текст может быть content
override только внутри соответствующего CTA; счётчики like/share остаются
произвольным owned content semantic social-proof component.

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
- paid с произвольной суммой/диапазоном/валютой;
- ticket/free-registration/registration/phone/sold-out;
- admission absent (unknown hidden, fail-closed);
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
- не откладывать loading/error/accessibility на финальную волну.

# Следующий конкретный шаг после карточек

```text
1. Зафиксировать card versions, fixtures и conformance.
2. Создать listing-foundations-candidate-v1.
3. Оформить archetype.listing.date.
4. Собрать typical mobile/desktop + sparse + empty + stress representations.
5. Довести Penpot до Astro parity в astro-reference mode.
6. Провести owner review.
7. Нормализовать shell v1.
8. Перейти к Weekend как reuse-first delta.
9. После двух архетипов выделить общий Listing Page Pattern.
```

Эта последовательность одновременно уменьшает повторную работу и не позволяет локальному Astro-дрейфу стать новой дизайн-системой.

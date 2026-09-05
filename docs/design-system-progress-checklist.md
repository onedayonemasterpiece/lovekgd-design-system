# LoveKGD Design System — чек-лист завершения

> **Актуальность аудита:** 23 августа 2026 года  
> **Источник проверки:** актуальный GitHub `main`, активные candidate-ветки/PR и committed receipts. Penpot напрямую в этом проходе не открывался; его состояние учитывается только по versioned manifests, receipts и PR evidence.  
> **Design System `main`:** `lovekgd-design-system@c6419a62af3d73f53e81d95a518fbe62a4a1c942`  
> **Активный listing candidate:** PR [#43](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/43), `dc2118f2ccb5e8a3b23258fe26d83bab7148331e` на момент аудита  
> **Astro `main`:** `events-bot-new@fc7fa8b0171099867e9ee8275082121b9b5b0c7e`

## Назначение

Этот чек-лист нужен, чтобы закончить сайт на дизайн-системе и убрать визуальный и технический дрейф. Он не является перечнем всех возможных артефактов дизайн-системы.

**Рабочая очерёдность:** [практический план выполнения по волнам](design-system-execution-sequence.md). Чек-лист отвечает на вопрос **что ещё не готово**, а план — **в каком порядке это закрывать, когда стабилизировать foundations, shell, полки, модальные окна и архетипы**.

Целевой контур:

```text
Astro AS-IS
→ Git SoT UI contract/package
→ Penpot review surface
→ комментарии и решения владельца
→ задача агенту
→ обновлённый Git SoT
→ синхронные Penpot и Astro implementations
→ browser/runtime conformance
```

## Когда пункт считается завершённым

Для компонента, паттерна или архетипа `[x]` означает одновременно:

1. решение и версия зафиксированы в Git SoT;
2. визуальная реализация той же версии прошла owner review;
3. Astro использует эту же версию, а не независимо редактируемую копию;
4. проверены нужные mobile/desktop, content, interaction, loading/error и accessibility states;
5. старые дубли и локальные отклонения мигрированы либо явно сохранены как отдельные семантические случаи.

Открытый PR, candidate contract, Penpot-страница, существующий Astro-компонент или один зелёный тест сами по себе не означают `done`. Для отдельно названного **решения** достаточно закрыть само решение; его внедрение и promotion отмечаются соседними пунктами.

Статусы нужно читать раздельно:

- **source exists** — текущая продуктовая реализация реально есть в Astro;
- **candidate ready** — contract/materialization собраны, но ещё не приняты владельцем;
- **accepted/implemented/verified** — принятая версия донесена до потребителей и проверена;
- **promoted** — версия стала канонической и защищена release gates.

## Текущий срез

| Показатель | Фактическое состояние |
|---|---|
| Модель authority и lifecycle | принята на `main` |
| Инвентаризация текущего Astro UI | завершена; 107/107 source paths сопоставлены |
| Promoted component families | **0** |
| Promoted page archetypes | **0** |
| Импорт versioned DS package в `events-bot-new` | не реализован |
| Карточки событий | census/taxonomy и значительная часть reverse-cycle доказаны; актуальный `EventCard Large current-v2` остаётся **BLOCKED** до полного evidence/read-back closure и точной mobile export revision |
| Listing foundations | bounded `listing-foundations-candidate-v1` существует в PR #43; owner acceptance и global stabilization отсутствуют |
| Date Listing + Shell v1 | candidate собран на 7 real-event fixtures и 7 representations, заявлен `READY_FOR_OWNER_REVIEW`; не accepted, не promoted, не deployed |
| Weekend + Listing Page Pattern v1 | входят в текущую автономную Goal; принятого результата в GitHub на момент аудита ещё нет |
| Event Detail | production source существует для desktop и mobile; дизайн-системный архетип с полной composition/state matrix не закрыт |
| Search / Favorites / For Me | production/prototype routes и значительная state logic существуют; нормализованные Penpot archetypes и migration отсутствуют |
| Transport | три production-компонента существуют: rail, bus и Kaup/special route; единый product-pattern contract не принят |
| Feedback / NPS | production `EventQuestionCta` существует; общий `FocusGroupFeedback` с NPS/usefulness/improvement/event-issue существует как gated prototype, но не как promoted cross-page pattern |
| Закрытые отдельные решения | media framing; три размера identity-medallions `44/60/88` как owner-approved decision |

Основные источники:

- [component authority](component-contract-authority.md) и [family lifecycle](normalization/design-system-family-lifecycle.md);
- [AS-IS synthesis](normalization/project-normalization-synthesis-v1-1.md);
- [PR #37 — card candidate](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/37);
- [актуальный current-v2 card closure contour](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/feature/date-listing-shell-v1-20260823/docs/normalization/event-card-large-current-v2-closure.md);
- [PR #43 — Date Listing + Shell v1](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/43);
- [production surface contract](https://github.com/onedayonemasterpiece/events-bot-new/blob/main/site/src/data/design-system-production-surface-contract.v1.json);
- [production Event Detail route](https://github.com/onedayonemasterpiece/events-bot-new/blob/main/site/src/pages/sobytiya/%5Bslug%5D.astro).

---

## 1. SoT и сквозной цикл доставки

| Готово | Работа | Текущее состояние | Что осталось |
|---|---|---|---|
| [x] | Определить authority Git SoT ↔ Penpot ↔ Astro ↔ runtime | Приняты [component authority](component-contract-authority.md) и lifecycle | Поддерживать модель, не создавать независимые копии |
| [x] | Восстановить фактический Astro AS-IS и карту consumers | Decoder/synthesis закрывают 107/107 source paths | Обновлять census при изменении product source |
| [ ] | Закрепить единый round-trip как действующий operational contract на `main` | Цикл практически доказан на card scope и повторён в bounded Date/Shell candidate | Принять компактный общий contract на `main`, без дублирования lifecycle |
| [ ] | Выпускать versioned component package из Git SoT | Есть schemas, contracts, manifests и materialization candidates; promoted package отсутствует | Доказать на первой принятой family |
| [ ] | Генерировать из одной версии code types, fixtures/specimens и Penpot bindings | PR #43 использует один Golden Event Corpus, manifest и receipts для bounded archetype scope | Превратить доказанный candidate flow в production-grade pipeline и read-back |
| [ ] | Обрабатывать review по циклу Penpot comment → Git decision first → Penpot reconcile | Механика многократно применялась на карточках | Сделать воспроизводимым contract для любой family/archetype и закрепить на `main` |
| [ ] | Создавать isolated Astro candidate и three-way conformance | Для cards и Date/Shell есть candidate evidence; promoted tuple пока отсутствует | Одинаковый version/hash в Git, Penpot и browser preview, затем accepted migration |
| [ ] | Перевести `events-bot-new` на pinned DS package | Astro продолжает содержать локальные source implementations | Миграция consumers без route-local forks |
| [ ] | Включить fail-closed drift checks | Есть scoped validators/workflows, но нет общего release gate для promoted resources | Проверять package, Penpot receipt, Astro consumer и runtime evidence |
| [ ] | Вести migration/deprecation ledger | Candidate ledgers и supersession receipts существуют в отдельных scopes | Для каждой promoted family закрывать дубли, overrides и replacement path |

---

## 2. Foundations: визуальная основа без дрейфа

| Готово | Область | Текущее состояние | Что должно быть закрыто |
|---|---|---|---|
| [ ] | Типографика и заголовки | Bounded listing typography candidate уже используется Date/Shell scope | Owner acceptance, semantic type scale, mobile/desktop limits и миграция затронутых Astro consumers |
| [ ] | Цвета и состояния цвета | Bounded semantic color candidate существует для listing/shell | Принять palette roles, убрать необоснованные дубли, проверить contrast и interaction states |
| [ ] | Базовые брендовые стили / mini-brandbook | Wordmark, lockup и assets инвентаризированы; shell candidate использует минимальный brand delta | Правила логотипа, палитры, типографики, изображения/иллюстрации и запрещённые применения |
| [ ] | Breakpoints, containers и grid | Date/Shell candidate материализует bounded desktop/mobile containers и representations | Owner acceptance, проверка Weekend/Popular и migration Astro |
| [ ] | Отступы | `foundation.spacing-layout` и listing spacing candidate существуют | Стабилизировать после Date + Weekend, сопоставить consumers и убрать случайные локальные значения |
| [ ] | Скругления, elevation и shadow | Card/media/exhibition scopes уже содержат нормализованные решения, но site-wide roles не приняты | Принять роли по типу поверхности и мигрировать весь затронутый UI |
| [x] | Решение по framing изображений | Зафиксированы proportional scale, safe crop, отсутствие искажений/полей, protected regions и multi-portrait composition | Поддерживать решение и проверять новые consumers |
| [ ] | Внедрение framing во всех consumers | Есть backports и evidence для части cards/listings/exhibitions; Event Detail использует отдельную production routing logic | Один accepted `event.media-frame` contract, migration hero/gallery/rails/cards и runtime conformance |
| [ ] | Полная базовая иконография | Card scope содержит source-bound icons и фактические size variants | Полный semantic registry сайта, optical rules, states/a11y и Astro bindings |
| [ ] | Interaction, focus, keyboard, motion и accessibility foundations | Отдельные implementations и tests существуют | Общая принятая система focus, target sizes, keyboard order, reduced motion и semantics |

---

## 3. Базовые UI-компоненты и общие состояния

| Готово | Компонентная группа | Текущее состояние | Что осталось |
|---|---|---|---|
| [ ] | Buttons и action controls | Card actions и часть shell/search controls имеют candidate/source implementations | Нормализовать hierarchy, sizes, icon/text, loading, disabled, destructive и responsive behavior |
| [ ] | Fields, filters, switches и selectors | Search, listing controls и interest profile дают реальные consumers | Общие anatomy/states, labels/errors/help, touch/keyboard и consumer migration |
| [ ] | Badges, labels, status panels, alerts и toasts | Candidate inventory и production examples существуют | Семантические роли, приоритет, timed/persistent behavior и accessibility |
| [ ] | Modal/dialog/sheet system | Artifact/gallery/feedback dialogs и mobile sheets существуют раздельно | Один overlay foundation: sizes, mobile behavior, focus trap, close/escape, scroll и nested content |
| [ ] | Loading, skeleton, empty, error, retry, stale и undo states | Search и Favorites уже содержат concrete state implementations; общего vocabulary нет | Зафиксировать ownership и fixtures без навязывания skeleton статическому HTML |
| [ ] | Feedback, usefulness, improvement, event issue и NPS | `EventQuestionCta` работает на Event Detail; `FocusGroupFeedback` реализует four-mode prototype | Развести product semantics/triggers, auth/persistence, dialog states и page-family bindings; overall NPS не должен появляться постоянно на каждой странице |
| [ ] | Breadcrumbs, quick navigation и secondary navigation | Компоненты инвентаризированы и используются Event Detail/листингами | Единые roles, responsive behavior и включение в archetypes |

---

## 4. Продуктовые компоненты, паттерны и shell

| Готово | Область | Текущее состояние | Что осталось |
|---|---|---|---|
| [x] | Census и candidate taxonomy карточек событий | Пять source-proven families и 65 states инвентаризированы | Это завершённый census/candidate этап, не promotion |
| [ ] | Закрыть technical handoff текущего card candidate | Актуальный `EventCard Large current-v2` имеет active seven-case registry, но closure document честно остаётся `BLOCKED` | Завершить evidence packs, current contract metadata read-back и точную mobile export revision; не наследовать старый PR status как актуальный |
| [ ] | Owner acceptance карточек | Текущая работа продолжена после раннего `READY FOR REVIEW`; окончательного acceptance нет | Провести consolidated visual review и зафиксировать exact accepted version/hash |
| [x] | Решение по размерам identity-medallions | Приняты ровно три tiers: compact `44`, standard `60`, feature `88` | Отдельно закрыть promotion/package и все consumer migrations |
| [ ] | Promoted Event Card/medallion package и Astro migration | Есть candidate/backport branches и receipts; canonical promotion отсутствует | Package, browser/device review, consumer migration и post-deploy conformance |
| [ ] | Полки / rails / shelves | `listing.rail-row` и mobile max-content track детально проработаны; generic shelves не доказаны двумя consumers | Нормализовать control rails/card tracks отдельно от content shelves |
| [ ] | Date Listing components/patterns | PR #43 содержит bounded masters, shared fixtures и state representations | Owner review, correction, Weekend reuse test и accepted migration |
| [ ] | Site shell v1 | PR #43 содержит desktop/mobile shell representations | Owner review, sticky/safe-area/overlay validation и reuse на Weekend/Event Detail |
| [ ] | Event Detail media and content pattern | Production source уже маршрутизирует desktop `editorial`/`split`, protected/no-image и mobile composition | Явная DS composition matrix, linked resources, same-fixture conformance и migration |
| [ ] | Event transport pattern | В production есть `EventTransportSchedule`, `EventBusTransportSchedule`, `KaupTransportSchedule` | Единый conditional slot contract, rail/bus/special variants, absent/stale/error/source-update states, desktop/mobile evidence |
| [ ] | Event question and feedback pattern | `EventQuestionCta` имеет desktop/mobile production variants | Нормализовать conditional CTA; связать event-issue/usefulness/improvement slots без смешения с overall NPS |
| [ ] | Header | Production source есть в `EventLayout`; shell v1 candidate собран | Accepted anatomy, desktop/mobile variants, sticky behavior, navigation и Astro binding |
| [ ] | Mobile menu | Production source и shell candidate существуют | States, hierarchy, scrolling, focus/escape, account/auth branches и migration |
| [ ] | Mobile bottom navigation | `MobileBottomNav`/search boundary и shell candidate существуют | Единый contract, active/auth/search states, safe areas, keyboard/a11y и consumer cleanup |
| [ ] | Решение о desktop-аналоге bottom navigation | Принятого решения в Git SoT не найдено | Принять продуктовый выбор для desktop jobs/routes либо явно зафиксировать отсутствие |
| [ ] | Footer | Production source и shell candidate существуют | Content model, responsive layout, legal/service links, states и migration |

---

## 5. Архетипы страниц

Общее условие закрытия каждого архетипа: semantic regions и slots, обязательные/условные блоки, relevant typical/stress/loading/empty/error states, responsive branches, accepted component instances, owner review, isolated Astro preview, migration текущих routes и runtime conformance.

Ни один архетип пока не promoted. Наличие production route фиксируется как evidence, но не заменяет нормализованный archetype contract.

| Готово | Архетип | Фактическое evidence | Основной незакрытый объём |
|---|---|---|---|
| [ ] | Главная | Candidate graph в PR #35 | States персонализации/cold start, responsive composition, review и Astro migration |
| [ ] | Листинг по дате: сегодня / завтра / произвольная дата | PR #43: 7 real-event fixtures, typical desktop/mobile, sparse, state matrix, stress и full-shell representations; `READY_FOR_OWNER_REVIEW` | Owner review/corrections, accepted contract и migration |
| [ ] | Выходные | Source route существует; candidate `listing.weekend` входит в текущую Goal | Reuse-first delta, range grouping, timeline/rails, state coverage и conformance |
| [ ] | Популярное | Production route и candidate inventory существуют | Проверить Listing Page Pattern на grouping/personalization/density/dynamic states |
| [ ] | Необычное | Production route и candidate inventory существуют | Unread/status behavior, responsive composition, stale/dynamic states и migration |
| [ ] | Поиск событий | Production `/poisk/` использует `AuthorizedEventSearch` и `SearchCollectionLinks`; реализованы auth, idle/input, validation, progress/skeleton, results, more, empty/error/recovery branches | Один responsive archetype, Penpot matrix, accepted card ownership, account/mobile-nav reconciliation и migration |
| [ ] | Страница события | Production `/sobytiya/*/` имеет desktop router и отдельную mobile composition; transport/question/related blocks реально подключены | Закрыть обязательную composition matrix ниже, shared feedback slots, linked resources, review и migration |
| [ ] | Подборки: индекс и detail | Candidate `collection`; routes `/podborki/` и `/podborki/{slug}/` | Индекс/detail variants, editorial blocks, gastronomy case и migration |
| [ ] | Фестивали | Candidate graph имеет unresolved source binding | Закрыть current route/template binding, festival header/cards/timeline и states |
| [ ] | Выставки | Production/candidate surfaces и deck states существуют | Gallery/deck, personalization, hide/undo, keyboard и responsive states |
| [ ] | Клубы по интересам: индекс и detail | Candidate `club`; current index/detail routes подтверждены | Развести catalogue/detail composition и закрыть full route coverage |
| [ ] | Избранное | Production `/izbrannoe/` и `FavoritesSurface` реализуют loading skeleton, local/cloud, signed-out/auth, empty, populated и error/reconciliation states | Responsive Penpot archetype, accepted card context, stale/future/dedup rules и migration |
| [ ] | Для меня / personal feed | `/dlya-menya/` существует как noindex prototype с consent, interest profile, recommendation feedback, digest eligibility и gated page feedback | Отделить prototype от target product contract; cold start/profile/filter/rerank/stale/failure/no-JS states, real feed ownership и migration |
| [ ] | Фокус-группа | Production patterns инвентаризированы, отдельного accepted archetype graph нет | Invitation, intake, feedback/NPS, diagnostics, completion branches и responsive contract |
| [ ] | Артефакты / коллекция | Production surface инвентаризирована, отдельного accepted archetype graph нет | Collection, empty/locked/open dialog, progress и responsive contract |
| [ ] | Информационные, партнёрские и legal pages | `documents-legal` имеет unresolved source binding; partner routes подтверждены | Общая document/content typography, navigation, route mapping и variants |
| [ ] | Prelaunch, закрытая афиша и специальные недоступные состояния | `prelaunch` candidate ещё не Penpot-ready; closed-state requirements существуют | Определить общий special-state archetype либо доказать отдельные boundaries |

Отдельный registration route остаётся product/route gap. Его не следует материализовывать как архетип до принятого capability и source contract.

### 5.1. Обязательная composition matrix страницы события

`archetype.event-detail` — **один responsive archetype с вариантами**, а не независимые несвязанные страницы.

#### Desktop

| Case | Обязательное отображение | Текущее source evidence | Что требуется от DS |
|---|---|---|---|
| `event-detail.desktop.editorial-wide` | широкая crop-safe фотография как основной hero | `DesktopEventPage` + `buildDesktopEventPresentation(): candidate=editorial` | Native linked composition, wide-photo fixtures, gallery/rail/actions states |
| `event-detail.desktop.split-poster` | узкая/вертикальная афиша, poster или protected document media рядом с content flow | `candidate=split`, `mediaPolicy=ocr/non-ocr` | Exact narrow geometry, no stretching/letterboxing mistakes, portrait viewer states |
| `event-detail.desktop.editorial-with-poster-companion` | широкая фотография как hero **и отдельно выделенная classified identity poster сбоку** | `ocrCompanionImageIndex`, `ocrCompanionLayout=arrival`, reason `editorial-with-classified-identity-poster` | Сделать case явным в archetype/manifest; сейчас production surface contract перечисляет только wide/narrow/no-image и не фиксирует этот обязательный вариант отдельно |
| `event-detail.desktop.no-image` | typed fallback/no-image state без выдуманного media | `split-no-image-fallback` | Accepted fallback anatomy и related/action behavior |

#### Mobile

Mobile должен иметь отдельные responsive representations, но использовать те же semantic regions и contracts:

- photo hero/gallery;
- poster/protected-media hero без искажения;
- no-image fallback;
- medallions and participants;
- description and facts;
- transport;
- question/feedback CTA;
- related events;
- sticky primary action;
- archived/closed and interaction checkpoints.

#### Обязательные conditional regions

- rail/bus/Kaup transport block и отсутствие транспорта;
- `EventQuestionCta` («Остались вопросы?») desktop/mobile;
- event-issue report, usefulness и improvement feedback как shared optional slots;
- overall NPS только по отдельному trigger/cadence contract, **не постоянный блок каждой event page**;
- related events и optional personal feed slot;
- gallery/viewer open/close/keyboard/swipe checkpoints;
- protected media, no-image, archived/closed and source-update states.

### 5.2. Обязательная state matrix поиска

- auth checking, signed out, signed in and account/logout;
- idle input and validation;
- loading, progress and skeleton;
- populated results with existing accepted card family;
- empty;
- pagination/load more;
- slow/timeout/error/retry/fallback recovery;
- preserved query through auth callback;
- desktop/mobile navigation and accessibility.

### 5.3. Обязательная state matrix избранного

- initial loading skeleton;
- signed-out local saves;
- auth-required explanation;
- signed-in local + cloud reconciliation;
- populated future-only deduplicated list;
- empty;
- catalog/renderer/cloud failure without loss of local saves;
- stale/past removal and live update after like/calendar actions;
- desktop/mobile responsive layout.

### 5.4. Обязательная state matrix «Для меня»

- consent not granted / granted / revoked;
- empty profile and populated explicit interests;
- computed interest index with insufficient/sufficient data;
- local storage unavailable;
- digest eligibility locked/eligible/enabled;
- recommendations, explanation, reaction and restore-hidden states;
- signed out/signed in account boundary;
- no-JavaScript fallback;
- gated focus-group feedback;
- target real-feed loading/empty/populated/stale/error states before promotion.

---

## 6. Финальная миграция сайта и защита от нового дрейфа

| Готово | Работа | Критерий завершения |
|---|---|---|
| [ ] | Мигрировать все production consumers на promoted resources | Нет независимо редактируемых копий и неучтённых route-local overrides |
| [ ] | Удалить или явно deprecated старые реализации | Для каждого дубля есть replacement, compatibility и rollback path |
| [ ] | Проверить mobile/desktop/tablet и контентные stress cases | Визуальные, interaction и accessibility checks проходят на accepted fixtures/routes |
| [ ] | Связать stable component/archetype IDs с product analytics | Runtime использует promoted semantic IDs; аналитика не зависит от CSS/DOM drift |
| [ ] | Выполнить production rollout и post-deploy conformance | Accepted Git/Penpot/browser tuple совпадает с generated production pages |
| [ ] | Поддерживать этот чек-лист после каждого принятого шага | Обновлены дата, evidence link, статус и следующий конкретный blocker |

## Практическая очерёдность

Полный порядок, критерии волн и точные моменты нормализации foundations описаны в [отдельном рабочем плане](design-system-execution-sequence.md).

Кратко:

1. Закрыть current-v2 card technical handoff и consolidated owner review; не выдавать ранний PR status за актуальный closure.
2. Завершить текущую Goal: listing foundations → Date Listing → Shell v1 → Weekend → Listing Page Pattern v1.
3. После consolidated review проверить pattern на Popular/Unusual и закрыть listing migration boundary.
4. Собрать Event Detail по обязательной desktop/mobile composition matrix, включая wide, narrow-poster и wide+side-poster, transport и feedback slots.
5. Затем нормализовать Search, Favorites и For Me на уже принятой card/listing/state infrastructure; на этих consumers стабилизировать shared feedback/NPS pattern.
6. После основной listing/detail/personal infrastructure делать Home и generic content shelves.
7. Collections/Festivals/Exhibitions/Clubs и special pages завершать поверх доказанных foundations/patterns.
8. Мигрировать Astro волнами и включать drift gates на каждом принятом scope, а не ждать завершения всей дизайн-системы.

## Что не требуется для достижения цели

- превращать каждый Astro-файл в Penpot-компонент;
- нормализовать lab/obsolete/experimental surfaces до production families;
- заранее токенизировать каждое числовое значение сайта;
- объединять семантически разные карточки только из-за визуального сходства;
- считать существующий production route уже завершённым DS archetype;
- показывать overall NPS постоянно на каждой странице без cadence/trigger contract;
- завершать все исследования и governance-документы до первой рабочей promotion.

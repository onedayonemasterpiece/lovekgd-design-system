# LoveKGD Design System — чек-лист завершения

> **Актуальность аудита:** 20 августа 2026 года  
> **Источник проверки:** только GitHub; Penpot напрямую не открывался. Состояние Penpot учитывается только по committed receipts и описаниям PR.  
> **Design System baseline:** `lovekgd-design-system@c6419a62af3d73f53e81d95a518fbe62a4a1c942`  
> **Astro baseline:** `events-bot-new@a68c7f23c4e014c6e9f66e95f394656e9cb0f411`

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

Открытый PR, candidate contract, Penpot-страница или один зелёный тест сами по себе не означают `done`. Для отдельно названного **решения** достаточно закрыть само решение; его внедрение отмечается соседним пунктом.

## Текущий срез

| Показатель | Состояние по GitHub |
|---|---|
| Модель authority и lifecycle | принята на `main` |
| Инвентаризация текущего Astro UI | завершена; 107/107 source paths сопоставлены |
| Promoted component families | **0** |
| Promoted page archetypes | **0** |
| Импорт versioned DS package в `events-bot-new` | не реализован |
| Самая зрелая продуктовая группа | карточки событий — candidate, готовится owner review |
| Закрытое дизайн-решение | framing изображений; внедрение в Astro ещё не завершено |
| Текущий точный блокер карточек | CI `ECT_RECEIPT_CONTRACT_JOIN_MISMATCH`: receipt не связан с актуальным taxonomy hash |

Основные источники: [component authority](component-contract-authority.md), [family lifecycle](normalization/design-system-family-lifecycle.md), [AS-IS synthesis](normalization/project-normalization-synthesis-v1-1.md), [PR #35](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/35), [PR #36](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/36), [PR #37](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/37), [последняя failing-проверка карточек](https://github.com/onedayonemasterpiece/lovekgd-design-system/actions/runs/32362510348).

---

## 1. SoT и сквозной цикл доставки

| Готово | Работа | Текущее состояние | Что осталось |
|---|---|---|---|
| [x] | Определить authority Git SoT ↔ Penpot ↔ Astro ↔ runtime | Приняты [component authority](component-contract-authority.md) и lifecycle | Поддерживать модель, не создавать независимые копии |
| [x] | Восстановить фактический Astro AS-IS и карту consumers | Decoder/synthesis закрывают 107/107 source paths | Обновлять census при изменении product source |
| [ ] | Закрепить единый round-trip как действующий operational contract на `main` | Полный цикл описан в PR #37, но документ ещё не на `main` | Принять компактную версию без дублирования lifecycle |
| [ ] | Выпускать versioned component package из Git SoT | Есть schemas, contracts и materialization candidates; promoted package отсутствует | Доказать на первой принятой family |
| [ ] | Генерировать из одной версии code types, fixtures/specimens и Penpot bindings | Частично доказано кандидатами и прототипами | Один воспроизводимый production-grade pipeline и read-back |
| [ ] | Обрабатывать review по циклу Penpot comment → Git decision first → Penpot reconcile | Механика частично доказана на карточках и plugin prototypes | Сделать повторяемым для любой family и архетипа |
| [ ] | Создавать isolated Astro candidate и three-way conformance | Для promoted family ещё не выполнено | Одинаковый tuple/version/hash в Git, Penpot и browser preview |
| [ ] | Перевести `events-bot-new` на pinned DS package | Astro остаётся AS-IS source of fact; package import не найден | Миграция consumers без route-local forks |
| [ ] | Включить fail-closed drift checks | Есть отдельные validators, но нет общего release gate | Проверять contract/package, Penpot receipt, Astro consumer и runtime evidence |
| [ ] | Вести migration/deprecation ledger | Есть candidate receipts и rollback concepts | Для каждой promoted family закрывать дубли, overrides и replacement path |

---

## 2. Foundations: визуальная основа без дрейфа

| Готово | Область | Текущее состояние | Что должно быть закрыто |
|---|---|---|---|
| [ ] | Типографика и заголовки | Есть только reconstructed role inventory | Единая semantic type scale, line-height, weight, text roles и ограничения для mobile/desktop; миграция Astro |
| [ ] | Цвета и состояния цвета | Принятой semantic palette в Git SoT нет | Сохранить ключевые брендовые цвета, убрать дубли, проверить contrast, hover/focus/disabled/error и фоновые сочетания |
| [ ] | Базовые брендовые стили / mini-brandbook | Wordmark, lockup и assets инвентаризированы | Правила логотипа, палитры, типографики, изображения/иллюстрации, tone и недопустимые применения |
| [ ] | Breakpoints, containers и grid | Есть route/viewports evidence, но нет принятого foundation contract | Единые responsive branches, ширины контейнеров, внешние поля и grid для компонентов и архетипов |
| [ ] | Отступы | `foundation.spacing-layout` существует как candidate identity | Небольшая semantic spacing scale, mapping consumers и удаление случайных локальных значений |
| [ ] | Скругления, elevation и shadow | Для media/card есть локальная candidate-гипотеза `16/24/28`; Astro AS-IS дрейфует | Принять роли по типу поверхности и мигрировать весь UI, а не только карточки |
| [x] | Решение по framing изображений | Зафиксированы proportional scale, safe crop, отсутствие полей/искажений, protected regions и multi-portrait composition | Решение считается закрытым; evidence находится в PR #36/#37 |
| [ ] | Внедрение framing во всех consumers | Candidate contract не promoted и не доказан в production Astro | Один `event.media-frame` contract, миграция всех карточек/hero/gallery/rails и runtime conformance |
| [ ] | Полная базовая иконография | В PR #37 есть 24 source-bound icons только для card scope | Полный semantic registry сайта, единые размеры/оптика/states/a11y, native components и Astro bindings |
| [ ] | Interaction, focus, keyboard, motion и accessibility foundations | Evidence и отдельные implementations есть, общей принятой системы нет | Focus visibility, target sizes, keyboard order, reduced motion, semantics и automated checks |

---

## 3. Базовые UI-компоненты и общие состояния

| Готово | Компонентная группа | Текущее состояние | Что осталось |
|---|---|---|---|
| [ ] | Buttons и action controls | Candidate identities существуют | Нормализовать hierarchy, sizes, icon/text, loading, disabled, destructive и responsive behavior |
| [ ] | Fields, filters, switches и selectors | Candidate inventory существует | Общие anatomy/states, labels/errors/help, touch/keyboard и consumer migration |
| [ ] | Badges, labels, status panels, alerts и toasts | Candidate inventory существует | Семантические роли, приоритет, timed/persistent behavior и accessibility |
| [ ] | Modal/dialog system | `core.dialog` пока candidate; один artifact dialog не заменяет систему | Sizes, mobile sheet/dialog behavior, focus trap, close/escape, scroll, destructive confirmation и nested content |
| [ ] | Loading, skeleton, empty, error, retry, stale и undo states | Частично описаны по отдельным surfaces | Общий state vocabulary без навязывания skeleton статическому HTML; component/surface ownership и fixtures |
| [ ] | Breadcrumbs, quick navigation и secondary navigation | Компоненты инвентаризированы | Единые roles, responsive behavior и включение в архетипы |

---

## 4. Продуктовые компоненты, паттерны и shell

| Готово | Область | Текущее состояние | Что осталось |
|---|---|---|---|
| [x] | Census и candidate taxonomy карточек событий | PR #37 покрывает 5 source-proven families и 65 states | Это завершённая инвентаризация/кандидатная модель, не promotion |
| [ ] | Закрыть техническую целостность card candidate | Latest CI падает на taxonomy ↔ receipt hash join | Обновить receipt/hash, получить exact-head green checks |
| [ ] | Owner acceptance карточек | PR #37 заявлен `READY FOR OWNER REVIEW` | Внести комментарии, зафиксировать exact accepted version/hash |
| [ ] | Promoted Event Card package и Astro migration | `canonical=false`, `not_promoted`; `events-bot-new` не менялся | Package, browser/device review, consumer migration и post-deploy conformance |
| [ ] | Полки / rails / shelves | `listing.rail-row` детально проработан; discovery rails и другие shelves лишь инвентаризированы | Один ясный набор rail/shelf patterns, scroll/controls/states/responsive, без route-local drift |
| [ ] | Event detail: hero, media viewer/gallery, facts и actions | Candidate boundaries и 4 compositions существуют | Согласованный responsive pattern, framing join, states, Astro preview и migration |
| [ ] | Header | В production inventory входит через `EventLayout`, отдельная нормализованная family не принята | Anatomy, desktop/mobile variants, sticky behavior, navigation и Astro binding |
| [ ] | Mobile menu | `navigation.mobile-menu` существует как candidate | States, hierarchy, scrolling, focus/escape, account/auth branches и migration |
| [ ] | Mobile bottom navigation | Есть `MobileBottomNav` и compatibility/search boundary; promotion отсутствует | Единый contract, active/auth/search states, safe areas, keyboard/a11y и consumer cleanup |
| [ ] | Решение о desktop-аналоге bottom navigation | Решение в GitHub не найдено | Принять продуктовый выбор: нужен ли persistent desktop navigation pattern и для каких Jobs/routes |
| [ ] | Footer | `site.footer` существует только как reconstructed candidate | Content model, responsive layout, legal/service links, states и migration |

---

## 5. Архетипы страниц

Общее условие закрытия каждого архетипа: semantic regions и slots, обязательные/условные блоки, typical/stress/loading/empty/error states, responsive branches, accepted component instances, owner review, isolated Astro preview, migration текущих routes и runtime conformance.

Ни один архетип пока не promoted. Ниже приведён практический полный набор, полученный объединением текущих route inventory, source requirements и candidate graphs; технически одинаковые route-варианты сгруппированы в один архетип.

| Готово | Архетип | Текущее evidence | Основной незакрытый объём |
|---|---|---|---|
| [ ] | Главная | Candidate graph в PR #35 | States персонализации/cold start, responsive composition, review и Astro migration |
| [ ] | Листинг по дате: сегодня / завтра / произвольная дата | Candidate `listing.date`; текущие routes подтверждены | Один contract с date/time/navigation branches и всеми density/states |
| [ ] | Выходные | Candidate `listing.weekend` | Range navigation, timeline/rails, states и migration |
| [ ] | Популярное | Candidate `listing.popular` | Grouping/personalization/density branches и migration |
| [ ] | Необычное | Candidate `listing.unusual` | Unread/state behavior, responsive composition и migration |
| [ ] | Поиск | Candidate `search`; production route `/poisk/` | Auth/loading/results/empty/error/recovery и mobile bottom-nav reconciliation |
| [ ] | Страница события | Четыре candidate graphs: desktop editorial/split/no-image и mobile | Оформить единый responsive archetype с media branches, related content и all states |
| [ ] | Подборки: индекс и detail | Candidate `collection`; routes `/podborki/` и `/podborki/{slug}/` | Индекс/detail variants, editorial blocks, gastronomy case и migration |
| [ ] | Фестивали | Candidate graph имеет unresolved source binding | Закрыть current route/template binding, festival header/cards/timeline и states |
| [ ] | Выставки | Candidate `exhibitions` | Gallery/deck, personalization, hide/undo, keyboard и responsive states |
| [ ] | Клубы по интересам: индекс и detail | Candidate `club`; current index/detail routes подтверждены | Развести catalogue/detail composition и закрыть full route coverage |
| [ ] | Избранное | Candidate `favorites` | Anonymous/auth, loading/empty/populated/error, card ownership и migration |
| [ ] | Для меня / personal feed | Candidate `personal-feed` | Cold start/profile/filter/rerank/stale/failure states и migration |
| [ ] | Фокус-группа | Production patterns инвентаризированы, отдельного candidate archetype graph нет | Invitation, intake, feedback, diagnostics, completion branches и responsive contract |
| [ ] | Артефакты / коллекция | Production surface инвентаризирована, отдельного candidate archetype graph нет | Collection, empty/locked/open dialog, progress и responsive contract |
| [ ] | Информационные, партнёрские и legal pages | `documents-legal` имеет unresolved source binding; partner routes подтверждены | Общая document/content typography, navigation, route mapping и variants |
| [ ] | Prelaunch, закрытая афиша и специальные недоступные состояния | `prelaunch` candidate ещё не Penpot-ready; closed-state requirements существуют | Определить общий special-state archetype либо доказать отдельные boundaries |

Отдельный registration route остаётся product/route gap. Его не следует материализовывать как архетип до принятого capability и source contract.

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

1. Закончить card families, эталонные события и Astro ↔ Penpot conformance.
2. До первого архетипа создать минимальный listing foundation baseline: typography/headings, semantic colors, spacing, radii, containers/grid и accessibility.
3. Собрать `archetype.listing.date` как первый вертикальный срез, временно используя shell как pinned AS-IS dependency.
4. На реальном первом архетипе нормализовать header, mobile menu, bottom navigation, shared overlays и footer.
5. Сделать Weekend reuse-first; только после двух реальных архетипов выделить общий Listing Page Pattern и стабилизировать listing foundations v1.
6. Проверить pattern на Popular/Unusual, затем перейти к Event Detail.
7. После основной listing/detail инфраструктуры делать Search, Favorites, Personal Feed, Home и generic shelves.
8. Collections/Festivals/Exhibitions/Clubs и special pages завершать поверх уже доказанных foundations/patterns.
9. Мигрировать Astro волнами и включать drift gates на каждом принятом scope, а не ждать завершения всей дизайн-системы.

## Что не требуется для достижения цели

- превращать каждый Astro-файл в Penpot-компонент;
- нормализовать lab/obsolete/experimental surfaces до production families;
- заранее токенизировать каждое числовое значение сайта;
- объединять семантически разные карточки только из-за визуального сходства;
- завершать все исследования и governance-документы до первой рабочей promotion.
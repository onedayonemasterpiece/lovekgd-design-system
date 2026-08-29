# Статический сайт ↔ дизайн-система: текущая власть и фактическое состояние

Status: `CURRENT_OPERATIONAL_ROUTER`

Последняя фактическая сверка: `2026-08-29`.

Latest registered owner review: `REV-IDEAHUB-20260829-14` / `OV-58`.

Этот документ — первая точка входа для задач о статическом сайте KenigEvents,
LoveKGD Design System, Astro ↔ Git UI SoT ↔ Penpot, компонентном наследовании,
Golden/Reference fixtures и визуальном parity. Он отделяет **целевой контракт**
от **уже доказанного текущего состояния**.

## 1. Сначала определить слой власти

Текущее состояние нельзя читать только из `main` одного репозитория.

| Слой | Текущий источник | Что он доказывает | Чего он не доказывает |
|---|---|---|---|
| Опубликованный снимок дизайн-системы | `lovekgd-design-system/main@c6419a62af3d73f53e81d95a518fbe62a4a1c942` | исторический reconstruction baseline на 19 августа | актуальный owner-review delta, текущие Penpot-компоненты, продвижение семей |
| AS-IS baseline | Draft PR `lovekgd-design-system#52@b86bab3e91511b3d4bd7d953b22bceb847f02a51` | 17 архетипов / 34 desktop+mobile cases, точные Astro fixtures, linked Penpot owners, round-trip validation | owner acceptance, merge, promotion, production change |
| Активное исправление по owner review | Draft PR `lovekgd-design-system#53`, branch `fix/penpot-owner-comments-20260826` | текущие Git SoT contracts, Penpot mutations/readbacks, fixture registry, bounded parity evidence и per-item status | общий `READY_FOR_OWNER_REVIEW`, merge, production permission |
| Компонентный Golden Event Corpus pilot | Draft PR `lovekgd-design-system#42@7a26772828a5d74a9683c08e7e6774ff15ac61a5` | 8 точных событий и identity gates для component conformance | визуальный PASS: pilot честно зафиксирован как FAIL; это не универсальный corpus всех сущностей |
| Исполняемый сайт до promotion | `events-bot-new/main@8710e56fa3685f6c30a90cd062d532dce0348cce` | текущий опубликованный AS-IS source/runtime факт | принятый будущий дизайн или актуальный draft candidate |
| Активный Astro/UI candidate | Draft PR `events-bot-new#596`, branch `fix/audio-audit-ui-20260828` | executable fixture bridge, bounded UI corrections и tests на изолированной ветке | merge, deploy, owner acceptance, production promotion |

Перед работой агент обязан fresh-read текущие heads PR `#53` и `#596`. SHA из
handoff или PR body — только исторический checkpoint, если API показывает более
новый head.

## 2. Что является Source of Truth

Долговечный UI SoT — **версионированные Git-контракты, registry, fixtures,
bindings и receipts в `lovekgd-design-system`**.

Роли различаются по фазе:

```text
до promotion:
прикреплённый events-bot-new Astro/runtime
→ факт текущего AS-IS
→ candidate Git UI SoT
→ native Penpot projection
→ owner review

после bounded owner acceptance:
accepted Git UI SoT/package
→ isolated Astro candidate
→ Penpot ↔ Astro ↔ generated route conformance
→ browser/device approval
→ promotion и production migration
```

Следствия:

- Penpot — нативная визуальная реализация и поверхность review, но не
  самостоятельный долговечный источник решений;
- `.astro`-файл или page-local CSS не может стать параллельной нормой после
  promotion;
- изменения не «перетекают» автоматически из Penpot в Astro или обратно;
- корректная синхронизация — это управляемая цепочка contract update →
  materialization/integration → exact readback → tests → focused visual review;
- логический SoT не обязан быть одним монолитным конфигурационным файлом.

Нормативный lifecycle: [`ui-source-of-truth-roundtrip.md`](ui-source-of-truth-roundtrip.md).

## 3. Как правильно понимать последнее owner voice

Source route:
[`reviews/idea-hub-owner-voice-intake-20260829-continuation-14.md`](reviews/idea-hub-owner-voice-intake-20260829-continuation-14.md).

| Тезис | Фактическая интерпретация |
|---|---|
| «Penpot — центральная точка, изменение должно появляться на сайте» | Как пожелание к рабочему процессу — верно. Как описание текущей власти — неверно: центральный долговечный слой находится в Git UI SoT; Penpot инициирует review/решение, но не заменяет contract/receipt. |
| «Один Golden Corpus для Penpot и Astro» | Для каждого сравнения обязателен один и тот же **именованный versioned scenario/pool** и точные fixture IDs. Не существует одного универсального набора только из событий для всех компонентов, фестивалей, клубов и артефактов. |
| «Всё должно совпадать полностью» | Верно для одного bounded route/state/viewport/scenario после фиксации fonts, DPR, clock и runtime state. Допустимые responsive/contextual variants не обязаны быть пиксельно одинаковыми друг с другом; intentional deltas фиксируются. |
| «Компоненты нельзя помещать вместе с архетипами» | Component **masters и каталоги состояний** живут на малых библиотечных страницах. Архетипы обязаны содержать эти компоненты как **linked instances**. Запрещены page-local masters, detached copies и визуальные подмены, а не присутствие экземпляров компонента внутри страницы. |
| «Визуально похожие независимые реализации — генеральная ошибка» | Верно. Lineage доказывается component/main IDs, bindings и census/readback; screenshot или сходство не являются доказательством. |

## 4. Фактическое состояние тезисов из серии голосовых

### Fixed reference data

Требование о малых, ограниченных и общих наборах уже материализовано:

- current registry: `catalog/fixtures/design-system-reference/v1/registry.v1.json`;
- events archetype pool: 5 factual events;
- component-conformance pool: 8 factual events в отдельном Golden Event Corpus;
- festivals reference pool: 7 festivals;
- clubs complete pool: 3 clubs;
- artifacts complete pool: 7 artifacts;
- executable consumer bridge: `events-bot-new#596` →
  `site/src/data/design-system-reference-fixtures.json`.

Проверка считается валидной только при совпадении scenario ID, fixture IDs и
закреплённых hashes. Dense/full production listings остаются Astro stress tests и
не копируются целиком в Penpot без продуктовой необходимости.

### Component lineage

Цель «одно семейство, никаких page-local lookalikes» корректна, но глобальное
закрытие ещё не доказано.

Уже подтверждены bounded corrections:

- Date/Weekend compact ListingEventCard centralization — structural PASS;
- Popular compact cards — structural PASS, visual QA partial;
- Festival cards — централизованы на bounded fixture owners;
- mobile Rail nested former-component copies — сведены к canonical ancestry;
- отдельные Favorites/collections/archetype owners имеют source-bound receipts.

Остаётся неверным утверждать, что вся система уже имеет одну принятую lineage и
нулевое число альтернативных roots во всех контурах. Owner acceptance и
promotion не заявлены. Текущие доказательства находятся в
`catalog/reconstruction-atlas/v1/*centralization*.json`, а старый
`PARTIAL_SOT_PENPOT_PAUSED` документ нельзя читать как актуальный status router.

### Multi-card rows and crop

`docs/product-patterns/event-card-container-packed-rows.md` сейчас имеет статус
`CURRENT_COMPLETE / ASTRO_PROJECTED / PENPOT_MATERIALIZED / VISUAL_QA_PASS /
OWNER_REREVIEW_REQUIRED`. Это не универсальный equal-grid: production packers
сохраняют разные контракты related-event и festival rows, семантические safety
gates и измеряемый crop loss.

### Event Detail

Замечания о portrait Hero image, parallax, keyboard navigation, transport и
порядке `transport → related events → footer` были верны в момент ревью, но уже
не являются текущим отсутствием. Они документированы и материализованы в
`docs/normalization/event-detail-motion-keyboard-source-contract-v1.md` и
соответствующих `OV-45`, `OV-46`, `OV-55`, `OV-56` receipts. Статус —
`OWNER_REREVIEW_REQUIRED`, не owner-accepted.

### Floating Island

`ListingDiscoveryRail@6` и его `plane` / `floating-island` axis уже существуют
как bounded Astro/Penpot candidate. Это не означает, что универсальная Floating
Island navigation принята или внедрена во всех архетипах. Общесистемная
promotion остаётся отдельным будущим решением.

## 5. Маршрут для человека и кодового агента

1. Этот файл — фактическая карта текущих слоёв.
2. [`ui-source-of-truth-roundtrip.md`](ui-source-of-truth-roundtrip.md) —
   нормативный lifecycle и parity gate.
3. [`reviews/index.md`](reviews/index.md) — current review router; latest revision
   `REV-IDEAHUB-20260829-14` / `OV-58`. Detailed ledger through `OV-57` is
   preserved at `reviews/index-through-20260829-13.md`.
4. `catalog/fixtures/design-system-reference/v1/registry.v1.json` и scenario
   files — fixture authority.
5. Затронутый family/archetype contract и самый новый receipt — точное состояние
   конкретного компонента.
6. В `events-bot-new` читать
   `docs/features/static-site-pages/design-system/README.md`, затем executable
   bridge/tests на текущем head PR `#596`.

Если два документа расходятся, приоритет такой:

```text
точное owner decision
→ более новый source-bound contract/receipt на активном head
→ этот current-state router
→ нормативный lifecycle
→ historical snapshot/main README
```

Исторический документ не удаляется, но должен быть явно помечен как
historical/superseded и не использоваться как текущий status source.

## 6. Запреты на утверждения

Пока открыты Draft PR и owner-review gates, нельзя писать:

- «Penpot автоматически синхронизирован с Astro»;
- «дизайн-система полностью принята/промотирована»;
- «все компоненты уже имеют единственного технического предка»;
- «Golden Corpus визуально прошёл весь сайт»;
- «candidate в PR #596 уже находится в production»;
- «структурный PASS равен визуальному PASS или owner acceptance».

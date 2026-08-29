# Статический сайт ↔ дизайн-система: текущая власть и фактическое состояние

Status: `CURRENT_OPERATIONAL_ROUTER`

Последняя фактическая сверка: `2026-08-29`.

Latest registered owner review: `REV-CHAT-20260829-01` / `OV-59`.

Этот документ — первая точка входа для задач о статическом сайте KenigEvents,
LoveKGD Design System, Astro ↔ SoT UI ↔ Penpot, component lineage, reference
fixtures и визуальном parity.

## 1. Неподвижная граница власти

**SoT UI — главная система.**

В текущей реализации его долговечная форма — versioned Git contracts,
component/package identities, tokens, behavior contracts, fixture registry,
bindings и receipts в `lovekgd-design-system`.

```text
owner/product decision
→ SoT UI
  ├─→ native Penpot projection + review
  └─→ Astro executable projection/consumer
→ structural + visual parity evidence
→ owner acceptance
→ promotion and production migration
```

Следствия:

- Penpot не является центральной системой, параллельным SoT или release
  authority;
- Astro не является независимо редактируемым вторым SoT;
- Penpot comments и визуальные правки являются входом review; принятая правка
  сначала фиксируется в SoT UI и только затем повторно материализуется в Penpot
  и интегрируется в Astro из одной версии;
- целевое направление автоматизации — `SoT UI → Penpot` и `SoT UI → Astro`, а
  не прямой `Penpot → Astro` и не двусторонняя конкурирующая власть;
- до promotion pinned Astro/runtime остаётся executable evidence текущего
  AS-IS, но не отменяет центральность SoT UI как целевой системы управления.

Нормативный lifecycle:
[`ui-source-of-truth-roundtrip.md`](ui-source-of-truth-roundtrip.md).

## 2. Исправление чтения последнего голосового

Source packet:
`idea-hub/inbox/voice/2026/08/voice-20260829-201612-4feb9e87.md`.

Owner correction:
[`reviews/owner-text-sot-ui-centrality-correction-20260829.md`](reviews/owner-text-sot-ui-centrality-correction-20260829.md).

Полная расшифровка прямо говорит:

> «Source of Truth — это центр, центральная точка… И Penpot — это инструмент,
> который отображает… состояния… и архетипы страниц».

Поэтому прежняя строка, приписывавшая голосовому тезис «Penpot — центральная
точка», была ложной производной интерпретацией. Ошибка возникла в
model-generated summary и последующем анализе, а не в позиции владельца.

Корректное чтение:

| Тезис | Фактическая интерпретация |
|---|---|
| SoT UI — центр компонентов, иерархии, отношений и отсутствия дублей | Подтверждено дословной расшифровкой и owner clarification. |
| Astro формирует пользовательский сайт | Astro — executable projection/consumer; до promotion также AS-IS evidence. |
| Penpot показывает компоненты, укрупнённые компоненты и архетипы | Penpot — visual projection и review surface, не authority. |
| Изменение должно одинаково проявляться на сайте и в Penpot | Меняется SoT UI один раз; обе проекции обновляются из одной версии и проверяются. |
| Визуально похожие технически разные реализации недопустимы | Lineage доказывается source/version, component/main IDs, bindings и actual-owner census/readback. |
| Component masters должны быть отделены от archetype pages | Masters/state catalogs живут на bounded library pages; archetypes используют linked instances. |

`REV-IDEAHUB-20260829-14` / `OV-58` сохранён как исторический intake, но его
ошибочная центральность Penpot superseded review `REV-CHAT-20260829-01` /
`OV-59`.

## 3. Текущие слои реализации

Текущее состояние нельзя читать только из `main` одного репозитория.

| Слой | Текущий источник | Что доказывает | Чего не доказывает |
|---|---|---|---|
| Опубликованный snapshot DS | `lovekgd-design-system/main@c6419a62af3d73f53e81d95a518fbe62a4a1c942` | historical reconstruction state на 19 августа | текущий owner-review delta, acceptance, promotion |
| Source-proven AS-IS baseline | Draft PR `lovekgd-design-system#52@b86bab3e91511b3d4bd7d953b22bceb847f02a51` | 17 archetypes / 34 desktop+mobile cases и round-trip evidence | owner acceptance, merge, promotion, production change |
| Активный owner-review contour | Draft PR `lovekgd-design-system#53`, branch `fix/penpot-owner-comments-20260826` | current SoT contracts, Penpot readbacks, fixture metadata и per-item status | общий `READY_FOR_OWNER_REVIEW`, production permission |
| Golden Event Corpus pilot | Draft PR `lovekgd-design-system#42@7a26772828a5d74a9683c08e7e6774ff15ac61a5` | 8 exact-event identity gates | visual PASS: pilot зафиксирован как FAIL; единая fixture authority не доказана |
| Опубликованный Astro AS-IS | `events-bot-new/main@8710e56fa3685f6c30a90cd062d532dce0348cce` | executable current fact before promotion | принятый будущий UI |
| Активный Astro/UI candidate | Draft PR `events-bot-new#596`, branch `fix/audio-audit-ui-20260828` | executable bridge, bounded corrections, tests | merge, deploy, owner acceptance |

Перед работой fresh-read фактические heads PR `#53` и `#596`; SHA в документе
является checkpoint.

## 4. Golden Corpus и обнаруженный SoT gap

Целевой контракт после повторного анализа:

- SoT UI владеет **одной канонической fixture authority**;
- внутри неё допустимы typed pools и named scenarios;
- event component, group и archetype checks должны ссылаться на fixture records
  из одной authority и сохранять одни payload/media hashes;
- festivals, clubs и artifacts могут быть отдельными typed pools под той же
  registry authority;
- scenario subsets допустимы; параллельные несвязанные event authorities — нет.

Фактическое текущее состояние:

- immutable component-certification corpus: 8 events —
  `3132, 4327, 6399, 6628, 7807, 7888, 7906, 8156`;
- archetype-core registry: 5 других events —
  `7030, 7006, 6901, 6996, 6997`;
- sets не являются subsets друг друга;
- `docs/ui-reference-fixture-registry.md` прямо говорит, что новый registry не
  заменяет immutable component corpus.

Поэтому прежнее описание этого раздвоения как завершённой целевой архитектуры
снято. Текущий статус:

`SOT_FIXTURE_AUTHORITY_UNIFICATION_OPEN`.

Exact parity внутри одного named scenario остаётся валидным. Но сквозная
непрерывность одного Golden Corpus между component → group → archetype пока не
доказана. Требуется либо включить оба event sets в одну canonical registry с
одними payload hashes, либо явно supersede один из контуров.

Текущие non-event pools:

- festivals: 7 factual slugs;
- clubs: 3 factual slugs;
- Artifact Collection 1: 7 factual artifacts.

## 5. Component lineage: что доказано

Bounded corrections подтверждены для:

- Date/Weekend compact `ListingEventCard` — structural PASS;
- Popular compact cards — structural PASS, visual QA partial;
- Festival cards — bounded owners componentized;
- mobile Rail nested consumers — canonical Rail/media ancestry;
- ряда Favorites, Collections и archetype owners — source-bound receipts.

Это не доказывает один глобально принятый технический root для всей системы.
Открыты full lineage census, owner acceptance и per-family promotion.

Текущая карта:
[`product-patterns/event-card-family-consumer-lineage.md`](product-patterns/event-card-family-consumer-lineage.md).

## 6. Другие тезисы серии голосовых

### Multi-card rows and crop

`product-patterns/event-card-container-packed-rows.md` фиксирует отдельные
production packers, semantic media safety, equal-height rules по container
contract и измеряемый crop loss. Статус: Astro projected, Penpot materialized,
visual QA PASS, owner rereview required.

### Event Detail

Portrait Hero image, parallax, keyboard navigation, transport и порядок
`transport → related events → footer` уже source-bound и materialized в
`normalization/event-detail-motion-keyboard-source-contract-v1.md` и receipts
`OV-45`, `OV-46`, `OV-55`, `OV-56`. Owner acceptance не заявлен.

### Floating Island

`ListingDiscoveryRail@6` существует как bounded candidate. Это не означает
принятую универсальную Floating Island navigation для всех archetypes.

## 7. Маршрут для человека и кодового агента

1. Этот current-state router.
2. [`reviews/index.md`](reviews/index.md) — latest review и per-item routing.
3. [`ui-source-of-truth-roundtrip.md`](ui-source-of-truth-roundtrip.md) —
   lifecycle.
4. [`ui-reference-fixture-registry.md`](ui-reference-fixture-registry.md) —
   fixture authority и текущий unification gap.
5. affected family/archetype contract и newest source-bound receipt.
6. В `events-bot-new#596`:
   `docs/features/static-site-pages/design-system/README.md` и
   `reference-fixture-scenarios.md`.

При конфликте:

```text
exact owner decision
→ current SoT contract/registry/receipt
→ this current-state router
→ normative lifecycle
→ historical snapshots and derived summaries
```

## 8. Запрещённые утверждения

Пока gates открыты, нельзя писать:

- «Penpot — центральная система»;
- «Penpot напрямую управляет Astro»;
- «существует автоматическая bidirectional Penpot ↔ Astro authority»;
- «8-event component corpus и 5-event archetype pool уже образуют единый
  доказанный Golden Corpus»;
- «дизайн-система полностью accepted/promoted»;
- «все компоненты имеют одного доказанного технического предка»;
- «Draft candidate находится в production»;
- «structural PASS, green test или `validate()=[]` равны owner acceptance».

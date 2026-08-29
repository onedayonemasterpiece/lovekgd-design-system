# LoveKGD Design System

Репозиторий хранит архитектуру, контракты, инструменты и воспроизводимые доказательства дизайн-системы бренда «Полюбить Калининград» и продукта «Полюбить Калининград Анонсы».

## Начать отсюда

Для любой задачи о статическом сайте, Astro ↔ Git UI SoT ↔ Penpot, Golden
fixtures, архетипах или component lineage сначала откройте
[`docs/static-site-design-system-current-state.md`](docs/static-site-design-system-current-state.md).

Опубликованный `main@c6419a62af3d73f53e81d95a518fbe62a4a1c942`
— исторический snapshot от 19 августа 2026 года. Текущие evidence и изменения
распределены между Draft PR `#52`, активным owner-review PR `#53` и Astro/UI PR
`events-bot-new#596`. Нельзя выводить текущее состояние только из `main` или из
старого PR body; перед работой нужен fresh-read фактических heads.

Latest registered owner review: `REV-IDEAHUB-20260829-14` / `OV-58` on active
PR `#53`.

## Текущий layered status

```text
published main snapshot: historical reconstruction state
source-proven AS-IS baseline: PR #52 PASS / DRAFT / UNMERGED
active owner-review corrections: PR #53 IN_PROGRESS
Golden Event Corpus pilot: identity PASS / visual FAIL
active Astro/UI candidate: events-bot-new PR #596 DRAFT
per-family global promotion: 0
production migration of draft candidate: NOT AUTHORIZED
```

Это означает одновременно две вещи:

1. старая таблица `native components: 0 / variants: 0 / tokens: 0` больше не
   описывает активный owner-review contour;
2. наличие реальных Penpot components, fixtures и bounded parity receipts не
   означает, что система целиком owner-accepted, promoted или deployed.

Точное текущее состояние и запретные утверждения находятся в current-state
router. Актуальный per-item review status находится в active PR `#53`:
[`docs/reviews/index.md`](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/reviews/index.md).

## Исторический reconstruction snapshot

Следующие числа относятся к исходному опубликованному snapshot, а не к текущему
состоянию активной ветки:

```text
phase: reconstruction
Penpot Resource Graph: TO-BE scaffold created and validated
Penpot file_id: 3be9e5e1-190f-8090-8008-713c0fbe6260
historical Penpot revision: 30
pages: 23
managed zones: 257
historical native components: 0
historical variants: 0
historical tokens/styles: 0
decoder snapshot: reviewed v1 committed
logical current-UI components: 107
candidate AS-IS contracts: 12 (not accepted at that snapshot)
reviewed reconciliation capsules: 6
manually reviewed rasters: 157
promoted resource families: 0
```

Runtime Review 003.*, Resource Graph 004a/004b и runtime-derived 005 были
техническими экспериментами. Их screenshots и object IDs не являются
автоматически действующей нормой. Фактический historical PASS receipt:
[`receipts/penpot/resource-graph-to-be-structure-v1.json`](receipts/penpot/resource-graph-to-be-structure-v1.json).

Машиночитаемый historical scaffold:
[`contracts/resource-graph-scaffold.v1.json`](contracts/resource-graph-scaffold.v1.json).

## Три связанных, но раздельных Penpot-контура

```text
Product Atlas
→ зачем требуется изменение: need, Job, outcome, journey, capability, UI gap

UI Exploration
→ какие решения исследуются: references, candidates, patterns, compositions, shortlist

Resource Graph
→ что созрело системно: resources, components, patterns, archetypes,
  product representations, evidence, promotion and accepted exports
```

Resource Graph не является свободным brainstorm-canvas. Product Atlas и UI
Exploration находятся в отдельных Penpot-файлах и связываются stable IDs и deep
links.

## Два режима авторитетности

### `reconstructed`

До promotion текущий Astro-код/runtime показывает, что фактически существует.
Git UI SoT восстанавливает и нормализует contracts, fixtures и lineage; Penpot
материализует native visual projection для review. Ни Penpot, ни отдельный
`.astro`-файл не получают независимую authority.

### `design-system-led`

Режим включается по отдельному resource family только после promotion gate. Для
принятой версии один Component Contract связывает package/API, native Penpot
component, Astro implementation, fixtures и runtime evidence. Product consumer
использует pinned package version и не хранит тихий визуальный fork.

## Единый центр компонентов

Долговечная единица истины — versioned component package/contract в Git:

```text
Component Contract
+ Astro presentation implementation
+ generated props/state types
+ fixtures and specimens
+ interaction/accessibility/visual tests
+ Penpot binding
+ accepted visual references
+ version, migration and promotion receipts
```

До promotion текущий UI в `events-bot-new` остаётся executable источником факта
о реализации. После promotion семейства `events-bot-new` импортирует
зафиксированную package version.

Подробности:

- [`docs/component-contract-authority.md`](docs/component-contract-authority.md);
- [UI Source of Truth round trip on active PR `#53`](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/ui-source-of-truth-roundtrip.md).

Relative link to `docs/ui-source-of-truth-roundtrip.md` is intentionally not used
here: that file does not exist on this documentation branch and must be read from
fresh active PR `#53`.

## Reference fixtures и parity

Owner requirement «один Golden Corpus» операционно означает один exact named
scenario/pool на bounded comparison, с одинаковыми fixture IDs, hashes, clock,
viewport и state в Astro и Penpot.

Текущие scopes различаются по назначению:

- 8 factual events — component conformance;
- 5 factual events — archetype core;
- 7 festivals;
- 3 clubs;
- 7 artifacts.

Это не один универсальный payload list. Dense/full listings остаются generated
Astro stress tests. Подробный executable bridge находится в
`events-bot-new#596/docs/features/static-site-pages/design-system/reference-fixture-scenarios.md`.

## Source-first decoder

Первый bounded source-first decoder завершён на exact source/runtime evidence:

```text
Astro source and generators
→ controlled generated component specimens
→ verification on real generated pages
→ candidate Component Contracts
→ mismatches and unresolved mappings
→ immutable compact snapshot + permanent heavy evidence
```

Reviewed compact snapshot:
[`catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/`](catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/).

Append-only behavioral evidence v1.1 находится в
`catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/`.
Исторические synthesis/readiness документы сохраняют доказательную историю, но
не перекрывают более новые source-bound contracts/receipts активного PR `#53`.

The normative
[family and archetype lifecycle](docs/normalization/design-system-family-lifecycle.md)
has eleven ordered states. Bounded materialization/readback evidence не
переводит всю систему в `FAMILY_AND_ARCHETYPE_PROMOTION`.

## Канонический маршрут

- [Текущий cross-branch state и routing](docs/static-site-design-system-current-state.md)
- [Карта документации этой ветки](docs/index.md)
- [Detailed current-state router on active PR `#53`](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/static-site-design-system-current-state.md)
- [UI Source of Truth round trip on active PR `#53`](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/ui-source-of-truth-roundtrip.md)
- [Owner-review register on active PR `#53`](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/reviews/index.md)
- [Latest review intake `REV-IDEAHUB-20260829-14`](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/reviews/idea-hub-owner-voice-intake-20260829-continuation-14.md)
- [Resource Graph 004 — operating contract](docs/resource-graph-004.md)
- [Component authority and three-way conformance](docs/component-contract-authority.md)
- [Source-first component decoder](docs/source-first-component-decoder.md)
- [Product-design operating model](docs/penpot-product-design-operating-model.md)
- [Family and archetype lifecycle](docs/normalization/design-system-family-lifecycle.md)
- [История неканонических экспериментов](docs/legacy-experiments.md)

## Инструментальные роли

```text
GitHub Actions
  deterministic extraction, validation, screenshots, diffs and artifacts

Resource Graph plugin
  reproducible materialization of an accepted package/IR

Penpot MCP
  scoped inspection, comments, bounded candidate mutations,
  exact readback, focused export and diagnostics
```

Плагин и MCP не имеют независимых каталогов: оба пути должны потреблять один
contract/IR и одинаковые stable IDs.

## Запреты

Пока owner/release gates открыты, нельзя утверждать:

- что Penpot автоматически синхронизирован с Astro;
- что дизайн-система полностью принята или промотирована;
- что все визуально похожие карточки уже имеют одного технического предка;
- что Golden Corpus визуально прошёл весь сайт;
- что Draft candidate уже находится в production;
- что green test, screenshot или `validate()=[]` равны owner acceptance.

## Репозитории

- Product/runtime source: `onedayonemasterpiece/events-bot-new`
- Design-system contracts and delivery: `onedayonemasterpiece/lovekgd-design-system`

Документация не создаёт GitHub Issues и не запускает implementation автоматически.

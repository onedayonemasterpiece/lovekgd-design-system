# LoveKGD Design System

Репозиторий хранит архитектуру, контракты, инструменты и воспроизводимые доказательства дизайн-системы бренда «Полюбить Калининград» и продукта «Полюбить Калининград Анонсы».

## Текущий статус

```text
phase: reconstruction
Penpot Resource Graph: TO-BE scaffold created and validated
Penpot file_id: 3be9e5e1-190f-8090-8008-713c0fbe6260
Penpot revision: 30
pages: 23
managed zones: 257
native components: 0
variants: 0
tokens/styles: 0
imported assets: 0
decoder snapshot: reviewed v1 committed
logical current-UI components: 107
candidate AS-IS contracts: 12 (not accepted)
reviewed reconciliation capsules: 6
manually reviewed rasters: 157
promoted resource families: 0
```

**Принятой компонентной дизайн-системы пока нет.** Runtime Review 003.*, Resource Graph 004a/004b и runtime-derived 005 были техническими экспериментами. Активный Penpot-файл очищен и заново содержит только утверждённую TO-BE структуру. Старые Penpot-компоненты, screenshots и object IDs не являются источником истины и не участвуют в будущем декодировании.

Фактический PASS receipt: [`receipts/penpot/resource-graph-to-be-structure-v1.json`](receipts/penpot/resource-graph-to-be-structure-v1.json).

Машиночитаемый контракт структуры: [`contracts/resource-graph-scaffold.v1.json`](contracts/resource-graph-scaffold.v1.json).

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

Resource Graph не является свободным brainstorm-canvas. Product Atlas и UI Exploration находятся в отдельных Penpot-файлах и связываются stable IDs и deep links.

## Два режима авторитетности

### `reconstructed`

Текущий Astro-код и runtime показывают, что фактически существует. Декодер восстанавливает component families, состояния и фрагментацию. Penpot нормализует и визуализирует результат, но ещё не является нормативным источником реализации.

### `design-system-led`

Режим включается **по отдельному resource family** только после promotion gate. Для принятой версии один Component Contract связывает native Penpot component, canonical Astro implementation и runtime state evidence. Приложение обязано использовать принятую package-версию.

## Будущий единый центр компонентов

Целевая единица истины — versioned component package в Git:

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

До promotion текущий UI в `events-bot-new` остаётся источником факта о реализации. После promotion семейства `events-bot-new` импортирует зафиксированную версию package и не хранит независимо редактируемую копию компонента.

Подробности: [`docs/component-contract-authority.md`](docs/component-contract-authority.md).

## Завершённый source-first decoder

Первый ограниченный source-first decoder завершён на exact source и runtime evidence:

```text
Astro source and generators
→ controlled generated component specimens
→ verification on real generated pages
→ candidate Component Contracts
→ mismatches and unresolved mappings
→ manual visual review of 157/157 rasters and 135 raster-backed page records
→ immutable compact snapshot + permanent heavy evidence
→ STOP before normalization and Penpot materialization
```

Reviewed compact snapshot: [`catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/`](catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/).

Append-only behavioral evidence v1.1 импортирован в отдельный sibling-каталог
`catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/`.
Он не вложен в immutable v1 и не изменяет его component identities или решения. Отдельный
validator проходит на 293 terminal probes (236 PASS, 39 MISMATCH,
18 UNREACHABLE_WITH_REASON), 87 unresolved findings без readiness blockers и 134/134
вручную просмотренных full-resolution rasters. Closure manifest
`c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1` разрешает только
аналитический project normalization synthesis.

Исторический Project Normalization Synthesis v1 опубликован в
[`docs/normalization/project-normalization-synthesis-v1.md`](docs/normalization/project-normalization-synthesis-v1.md),
но его readiness-доказательство отклонено независимым red-team-аудитом. Текущая
audit-remediation v1.1 и его v1.1.1 proof-closure contract находятся в
[`docs/normalization/project-normalization-synthesis-v1-1.md`](docs/normalization/project-normalization-synthesis-v1-1.md) и
[`docs/audits/project-normalization-synthesis-v1-1-1-proof-closure-report.md`](docs/audits/project-normalization-synthesis-v1-1-1-proof-closure-report.md):
47 аналитических групп, 0 strict-ready identities и пустая first wave.

Это только исправление доказательной модели: exact-head Actions attestation и отдельный independent delta re-audit остаются обязательными; merge не разрешён.
Candidate contracts остаются reconstructed, `NOT_MERGED` и не приняты как
дизайн-система. Decoder не сопоставляет Astro со старыми Penpot-экспериментами и
не мутирует Penpot. Подробности:
[`docs/source-first-component-decoder.md`](docs/source-first-component-decoder.md).

The normative [family and archetype lifecycle](docs/normalization/design-system-family-lifecycle.md) has eleven ordered states. Current truth is `AS_IS_RECONSTRUCTED`; synthesis readiness is not `FAMILY_HYPOTHESIS_REVIEWED`, and authority changes only at `FAMILY_AND_ARCHETYPE_PROMOTION`.

## Канонические документы

- [Карта документации](docs/index.md)
- [Resource Graph 004 — operating contract](docs/resource-graph-004.md)
- [Component authority and three-way conformance](docs/component-contract-authority.md)
- [Source-first component decoder](docs/source-first-component-decoder.md)
- [Product-design operating model](docs/penpot-product-design-operating-model.md)
- [Family and archetype lifecycle](docs/normalization/design-system-family-lifecycle.md)
- [Project Normalization Synthesis v1.1 audit remediation](docs/normalization/project-normalization-synthesis-v1-1.md)
- [Project Normalization Synthesis v1.1.1 proof-closure ledger](docs/audits/project-normalization-synthesis-v1-1-1-proof-closure-report.md)
- [История неканонических экспериментов](docs/legacy-experiments.md)
- [Evidence-based research: UI normalization и component defragmentation](docs/research/ui-normalization-2026-08/README.md)
- [First-party карта действий: исследования сигналов](docs/research/first-party-action-map-2026-08/README.md)

## Инструментальные роли

```text
GitHub Actions
  тяжёлое deterministic extraction, validation, screenshots, diffs and artifacts

Resource Graph plugin
  воспроизводимая массовая материализация принятого package/IR

Penpot MCP
  scoped inspection, comments, bounded candidate mutations,
  patch/reflow/rematerialization, evidence export and diagnostics
```

Плагин и MCP не имеют независимых каталогов: после появления компонентов оба пути должны потреблять один contract/IR и одинаковые stable IDs.

## Репозитории

- Product/runtime source: `onedayonemasterpiece/events-bot-new`
- Design-system contracts and delivery: `onedayonemasterpiece/lovekgd-design-system`

Документация не создаёт GitHub Issues и не запускает implementation автоматически.

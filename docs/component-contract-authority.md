# Component Contract authority and three-way conformance

## Решение

Penpot component и Astro component — не две независимо синхронизируемые сущности. После promotion они являются двумя реализациями одного versioned **Component Contract**.

```text
Canonical component package in Git
│
├── Component Contract
├── Astro presentation implementation
├── fixtures and generated specimens
├── interaction/accessibility/visual tests
├── Penpot binding and accepted visual references
└── version, migration and promotion receipts
        │
        ├── native Penpot implementation
        ├── isolated Astro specimen
        └── real runtime instances
```

## Почему центр не равен только Penpot или только `.astro`

Penpot лучше всего описывает native components, variants, composition, constraints, визуальные specimens, review и acceptance. Но он не доказывает HTML semantics, accessibility tree, browser layout, data logic и отсутствие consumer CSS overrides.

`.astro` исполняет browser implementation, props, slots, composition и state resolution. Но один файл не хранит полный lifecycle: candidate/accepted status, обязательные stress fixtures, Penpot binding, design rationale, migration и owner acceptance.

Поэтому единица истины — пакет, где contract и Astro implementation находятся рядом и выпускаются одной версией.

## Фазовая модель authority

### До promotion семейства

```text
events-bot-new Astro source
= executable source of fact about current implementation

candidate Component Contract
= reviewed reconstruction proposal, not yet canonical

Penpot
= reconstructed/candidate visual model, not normative
```

### После promotion семейства

```text
versioned component package in lovekgd-design-system
= canonical identity, API, variants, states and Astro presentation

events-bot-new
= pinned package consumer + product/domain state resolver

Penpot
= native visual implementation of the same contract version

runtime
= conformance evidence
```

Promotion происходит по resource family. Допустимо, что Button уже `design-system-led`, а EventCard ещё `reconstructed`.

## Минимальный Component Contract

```yaml
component_id: core.button
contract_version: 2.0.0
contract_sha256: ...
authority_mode: reconstructed | design-system-led
status: candidate | accepted | deprecated

anatomy: []
variant_axes: {}
state_axes: {}
valid_combinations: []
invalid_combinations: []
slots: {}
nested_component_refs: []
token_refs: []
responsive_contract: []
content_fixture_classes: []
accessibility_requirements: []

penpot_binding: {}
astro_binding: {}
runtime_binding: {}
promotion_receipt_ref: ...
rollback_ref: ...
```

Contract не дублирует HTML/CSS. Он определяет identity, API, семантические axes и инварианты, из которых генерируются типы, valid state keys, specimen plan и Penpot materialization manifest.

## Structural states и fixtures

```text
structural state
  меняет anatomy, layout, visibility, behavior или semantics

content fixture
  предоставляет конкретные text, image, dates, place and data stress
```

Конкретная картинка — fixture. Но наличие картинки, aspect class, `cover/contain`, crop/focal strategy, poster mode, background continuation и gallery behavior — contract state.

Конкретный заголовок — fixture. Но stress class, max lines, overflow/expansion behavior и accessible name — contract behavior.

## Canonical `state_key`

Каждый runtime instance promoted family обязан объявлять:

```text
component_id
contract_version
contract_sha256
state_key
```

Пример:

```text
appearance=primary;size=medium;state=disabled;width=fill;icon=none
```

Канонический порядок axes и допустимые values происходят из Component Contract.

В instrumented build root element или boundary comments содержат identity metadata. Для multi-root Astro components используются non-layout-affecting boundary comments и DOM Range.

## Three-way Component Conformance Capsule

Для каждой новой/изменённой contract version проверяются три поверхности.

### A. Native Penpot component

- component and variant IDs;
- contract version/hash metadata;
- variant values;
- tokens;
- nested instances;
- constraints;
- exact fixture;
- accepted export.

### B. Isolated Astro specimen

- тот же `state_key`;
- тот же fixture;
- DOM and computed styles;
- bounding boxes;
- accessibility tree;
- screenshot;
- interaction behavior.

### C. Real generated-page instance

- exact package version;
- emitted component/version/state markers;
- route and consumer context;
- absence of unknown state;
- absence of forbidden local override;
- responsive behavior;
- parity with isolated specimen and accepted reference.

Пример результата:

```yaml
component_id: core.button
contract_version: 2.0.0
state_key: appearance=primary;size=medium;state=focus;icon=leading

penpot: pass
astro_specimen: pass
runtime_instance: pass

checks:
  anatomy: pass
  variant_mapping: pass
  nested_components: pass
  token_mapping: pass
  geometry: pass
  media_behavior: not-applicable
  text_behavior: pass
  interaction: pass
  accessibility: pass
  local_overrides: none

conclusion: conformant
```

## CI gates после promotion

Для всех promoted families CI должен проверять:

1. `component_id` существует в contract registry.
2. Penpot и Astro bindings используют тот же ID.
3. `contract_version` и `contract_sha256` совпадают.
4. Astro props/state types генерируются или валидируются contract schema.
5. Runtime не эмитит unknown states.
6. Каждый required state имеет isolated specimen.
7. Каждый production-observed state покрыт accepted/candidate Penpot specimen согласно authority mode.
8. Composite dependency graph совпадает.
9. Consumer CSS не проникает в запрещённые internals.
10. Accepted visual reference не обновляется browser actual автоматически.
11. В accepted archetypes нет detached Penpot copies.
12. Package version pinned and receipted.

## Consumer boundary

Приложение может управлять promoted component только через:

- declared props;
- declared slots;
- container sizing;
- declared context variants;
- explicitly allowed CSS custom properties.

Запрещены внешние overrides внутренних padding, typography, visibility, icon identity, region order и media treatment. Новое поведение оформляется contract variant/state, а не route-local CSS exception.

## Versioning

```text
PATCH
  визуальное/поведенческое исправление без изменения public API/anatomy

MINOR
  новый совместимый variant/state или optional slot

MAJOR
  breaking anatomy/API/required-slot/state removal
```

Candidate version может существовать в UI Exploration, Penpot sandbox и preview specimen routes. Production import разрешён только после acceptance/promotion receipt.

## Promotion gate

Resource family становится `design-system-led`, когда одновременно доказаны:

- stable contract identity and version;
- native Penpot masters/variants;
- canonical Astro presentation implementation;
- generated state/fixture coverage;
- composite instances/dependencies;
- mobile/desktop representations;
- relevant UX-flow branches;
- three-way capsule PASS;
- idempotent materialization;
- comments/gaps reviewed;
- accepted exports and test references;
- rollback receipt;
- explicit owner acceptance.

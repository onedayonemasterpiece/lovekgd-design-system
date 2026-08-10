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

Authority mode is orthogonal to the normative [family and archetype lifecycle](normalization/design-system-family-lifecycle.md). The exact sequence is:

```text
AS_IS_RECONSTRUCTED
→ FAMILY_HYPOTHESIS_REVIEWED
→ CANDIDATE_CONTRACT_ACCEPTED
→ CANONICAL_CODE_CANDIDATE
→ PENPOT_COMPONENT_CANDIDATE
→ COMPONENT_THREE_WAY_CONFORMANCE
→ PAGE_ARCHETYPE_CANDIDATE
→ PRODUCT_REPRESENTATIONS
→ GEMINI_MCP_VISUAL_AUDIT
→ REVIEWED_CORRECTIONS
→ FAMILY_AND_ARCHETYPE_PROMOTION
```

States through `REVIEWED_CORRECTIONS` remain `reconstructed`. `CANDIDATE_CONTRACT_ACCEPTED` accepts a target for reversible candidate implementation; it is not production acceptance. Only `FAMILY_AND_ARCHETYPE_PROMOTION` transfers authority for the bounded family and affected archetypes.

## Минимальный Component Contract

```yaml
component_id: core.button
contract_version: 2.0.0
contract_sha256: ...
authority_mode: reconstructed | design-system-led
lifecycle_state: AS_IS_RECONSTRUCTED | ... | FAMILY_AND_ARCHETYPE_PROMOTION
contract_decision_status: draft | candidate-accepted | promoted | deprecated
canonical: false | true

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
observability: {}
promotion_receipt_ref: ...
rollback_ref: ...
```

`candidate-accepted` means the owner accepted a target contract, migration and rollback plan. Before final promotion it still has `authority_mode: reconstructed`, `canonical: false` and no promotion receipt. `promoted` requires the lifecycle terminal state and is the only status for which `canonical: true` is permitted.

Contract не дублирует HTML/CSS. Он определяет identity, API, семантические axes и инварианты, из которых генерируются типы, valid state keys, specimen plan и Penpot materialization manifest.

## Action-map observability contract

Временная action-map campaign использует семантику уже существующего Component Contract, а не выводит её из CSS class, DOM path, видимого текста, Astro filename или Penpot layer name. Для eligible component contract описывает стабильные зоны и действия вместе с ожидаемым эффектом:

```yaml
component_id: announcements.event-card
contract_version: 5.0.0
state_key: portrait.compact.default
astro_binding:
  source: EventCard.astro
runtime_binding: {}

observability:
  action_map_eligible: true
  owner_boundary: component
  zones:
    media:
      role: content_open_target
      map_eligible: true
      allowed_actions: [open_event]
    body:
      role: content_summary
      map_eligible: true
      allowed_actions: [open_event]
    favorite:
      role: explicit_action
      map_eligible: true
      allowed_actions: [favorite_toggle]
  actions:
    open_event:
      interaction_mode: single_shot
      expected_effect: route_change
    favorite_toggle:
      interaction_mode: toggle
      expected_effect: authoritative_state_ack
```

`zones` задаёт component-local semantic boundaries, их роль, eligibility и allowlist действий. `actions` связывает semantic action с `interaction_mode` и конкретным `expected_effect`; generic DOM-change heuristic не заменяет этот контракт. Повторы интерпретируются с учётом режима (`single_shot`, `toggle`, `repeatable`, `carousel/stepper`, `drag/hold`), поэтому «dead click» или «rage click» могут быть только reviewed finding, но не первичным runtime-фактом.

`astro_binding` хранит identity исходной Astro implementation. Отдельный `runtime_binding` зарезервирован для schema-defined compiled/runtime identity fields и не содержит Astro source path. Эти bindings проходят независимую проверку и не сворачиваются в одно поле.

Identity hierarchy для evidence:

```text
page_archetype_id
→ layout_contract_id
→ component_id + contract_version + state_key
→ component_instance_id
→ semantic_zone_id
→ semantic_action_id
```

### Active-build binding и OFF omission

Observability metadata разрешает binding, но сама по себе не включает capture. Только active build конкретной approved campaign компилирует canonical IDs в короткий словарь и может эмитить compact binding, например:

```text
17 → announcements.event-card@5
2  → media
4  → open_event

<article data-am-c="17" data-am-v="5" data-am-z="2" data-am-i="7">
```

В OFF build action-map collector, его import/chunk/request/listeners и `data-am-*` binding отсутствуют. Отдельный marker может остаться только если он нужен другой принятой функции и имеет собственный контракт; action-map eligibility не является таким основанием.

### Migration из AS-IS identity

Пока family находится в `reconstructed`, evidence может использовать только явно версионированную временную identity:

```yaml
authority_mode: reconstructed
as_is_contract_id: as-is.announcements.event-card.source-a
source_snapshot_sha: ...
observed_state_key: ...
```

Переход к accepted Component Contract выполняется отдельным reviewed mapping receipt, который фиксирует исходные `as_is_contract_id`/`source_snapshot_sha`, целевые `component_id`/`contract_version`/`state_key`, disposition, reviewer/owner acceptance и evidence refs. Визуальное сходство и action-map data не разрешают автоматически объединять AS-IS IDs, принимать contract или продвигать family. Исторические evidence packages навсегда сохраняют исходную identity/version; mapping добавляет трассировку к accepted contract, но не переписывает прошлое и не заменяет обычный promotion gate.

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

Каждый isolated/generated-page conformance instance candidate family и каждый runtime instance promoted family обязан объявлять:

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

Для каждой новой/изменённой contract version `COMPONENT_THREE_WAY_CONFORMANCE` проверяет три candidate surfaces после `CANONICAL_CODE_CANDIDATE` и `PENPOT_COMPONENT_CANDIDATE`.

Every surface binds exactly the same tuple:

```text
component_id
contract_version
contract_sha256
state_key
fixture_id
viewport_id
candidate_package_sha
```

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

- exact candidate package version and SHA;
- emitted component/version/state markers;
- route and consumer context;
- absence of unknown state;
- absence of forbidden local override;
- responsive behavior;
- parity with isolated specimen and accepted reference.

Before promotion this is a real generated preview page using the candidate package, not evidence that production authority has already changed. The final promotion gate requires accepted-release/post-deploy conformance again. A screenshot without identity, DOM, interaction and accessibility evidence cannot satisfy the capsule.

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

## CI gates before and after promotion

At `COMPONENT_THREE_WAY_CONFORMANCE`, CI validates candidate bindings, generated state coverage and the three surfaces without allowing a production import. После promotion те же проверки становятся обязательными для production consumers:

1. `component_id` существует в contract registry.
2. Penpot и Astro bindings используют тот же ID.
3. `contract_version` и `contract_sha256` совпадают.
4. Astro props/state types генерируются или валидируются contract schema.
5. Runtime не эмитит unknown states.
6. Каждый required state имеет isolated specimen.
7. Каждый observed state покрыт candidate Penpot specimen before promotion and accepted specimen after promotion.
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

Candidate version может существовать в UI Exploration, canonical package preview, Penpot candidate zones и preview specimen routes. Production import разрешён только при `FAMILY_AND_ARCHETYPE_PROMOTION` и наличии promotion receipt; `CANDIDATE_CONTRACT_ACCEPTED` недостаточно.

## Promotion gate

Authoritative gate details live in the machine-readable [family lifecycle](../contracts/normalization/family-lifecycle.v1.json), transition `T10_PROMOTE_FAMILY_AND_ARCHETYPES`. Resource family and affected archetypes become `design-system-led` only when simultaneously proven:

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

Native Penpot masters, candidate representations and three-way conformance therefore exist before promotion, but remain noncanonical evidence. Penpot materialization never performs the authority transition itself.

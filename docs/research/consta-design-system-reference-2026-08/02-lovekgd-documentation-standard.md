# 02 — Candidate standard оформления LoveKGD Design System

## Статус предложения

```text
standard_id: lovekgd.component-dossier.v0.1
status: documentation-only-candidate
authority_mode: reconstructed
canonical: false
promotion_effect: none
```

Этот документ предлагает единый способ **представлять** Component Contract. Он не создаёт component identity и не принимает design/code implementation. При конфликте authoritative остаются действующие contracts, lifecycle и receipts.

## 1. Единица документации

Основная единица — **Component Dossier** конкретной contract version.

```text
Component Dossier
├── identity and authority header
├── purpose and selection guidance
├── default specimen and anatomy
├── variants, states and valid combinations
├── behavior, accessibility, responsive and motion
├── themes, tokens and content rules
├── source-proven product fixtures
├── code API, bindings and tests
└── lifecycle, migration, changelog and support
```

Dossier не равен одному Markdown-файлу или одному Penpot board. Это связанный набор representations с общей tuple:

```text
component_id
contract_version
contract_sha256
state_key
fixture_id
viewport_id or container_id
candidate_package_sha
```

## 2. Обязательный identity and authority header

Каждая визуальная и текстовая страница начинается не с красивого default, а с machine-readable identity.

```yaml
component_id: announcements.event-card
family_id: announcements.event-card-family
display_name: Event Card
contract_version: 0.3.0-candidate
contract_sha256: ...

authority_mode: reconstructed
lifecycle_state: CANDIDATE_CONTRACT_ACCEPTED
contract_decision_status: candidate-accepted
canonical: false
display_status: CANDIDATE

owner: ...
review_channel: ...
last_reviewed_at: 2026-08-19

component_contract_ref: ...
astro_binding_ref: ...
penpot_binding_ref: ...
runtime_binding_ref: ...
package_ref: ...
source_snapshot_sha: ...

fixture_registry_ref: ...
evidence_receipts: []
promotion_receipt_ref: null
rollback_ref: ...
replacement_ref: null
```

### Правила header

1. `display_status` только упрощает чтение; underlying lifecycle остаётся видимым.
2. `canonical: true` разрешён только terminal promotion contract.
3. Отсутствующий binding показывается как blocker, а не скрывается.
4. Любой screenshot/export содержит identity/version в metadata или рядом с specimen.
5. Последняя дата review не заменяет exact source/package SHA.

## 3. Reading paths по аудиториям

Consta удачно разделяет обзор, код, дизайн, sandbox и usage. Для LoveKGD предлагаются шесть связанных views:

| View | Главный вопрос |
|---|---|
| **Overview** | Что это, какую задачу решает и когда выбирать? |
| **Design** | Как устроен, какие axes/states/themes и ограничения? |
| **Usage & content** | Как применять в продукте и каким контентом наполнять? |
| **Code & API** | Как импортировать, конфигурировать, расширять и тестировать? |
| **Evidence** | Чем доказаны identity, coverage, conformance и current status? |
| **Migration & support** | Что изменилось, как перейти, кто владелец и где обсуждать? |

Views не дублируют truth. Они рендерят разные срезы одного contract/evidence graph.

## 4. Обязательная структура dossier

### 4.1. Purpose and selection

Секция отвечает на вопросы:

- какую user need / Job / outcome поддерживает resource;
- в каких product capabilities и archetypes применяется;
- когда использовать;
- когда не использовать;
- чем отличается от соседних families;
- какие known gaps остаются.

Не допускается описание вида «карточка с картинкой и текстом» без semantic role и consumer boundary.

### 4.2. Default specimen

Default показывается первым и имеет явный canonical `state_key` для данной contract version.

Обязательно указать:

```text
state_key
fixture_id
viewport/container
content class
interaction mode
expected semantics
```

Default не выбирается по частоте в Figma. Он должен быть contract default или явно маркированным recommended starting state.

### 4.3. Anatomy, slots and dependencies

Визуальная схема перечисляет:

- semantic regions;
- required/optional slots;
- parent-owned and child-owned behavior;
- nested component refs;
- content ownership;
- hit areas and focus boundaries;
- allowed consumer customizations;
- forbidden internal overrides.

Compound component показывает supporting primitives отдельно от итоговой композиции, но не превращает каждую внутреннюю деталь в public API.

### 4.4. Variant axes

Для каждой оси фиксируются:

| Поле | Содержание |
|---|---|
| canonical name | machine name в contract/code/design/tests |
| semantic intent | зачем ось существует |
| values | допустимые значения |
| default | точное default value |
| owner | component, parent composition, consumer context или resolver |
| compatibility | valid/invalid combinations |
| responsive effect | меняется ли при container/viewport |
| versioning | PATCH/MINOR/MAJOR impact при изменении |

### 4.5. State axes

Visual states и domain/runtime states разделяются.

```text
interaction:
  default / hover / focus-visible / pressed / disabled

async:
  idle / loading / success / error

selection:
  unselected / selected / mixed

content/media:
  empty / partial / complete / overflow / unavailable

product-owned:
  authenticated / favorite / sold-out / expired / ...
```

Dossier показывает ownership каждого state. Например, `favorite=true` может принадлежать product resolver, а не быть visual variant самой кнопки.

### 4.6. Valid and invalid combinations

Не создаётся полный Cartesian matrix по умолчанию. Используется такой порядок:

1. перечислить axes;
2. зафиксировать constraints;
3. построить только valid combinations;
4. выделить required coverage classes;
5. показать representative specimens;
6. хранить полный machine registry отдельно;
7. показывать invalid combinations и reason, если риск misuse существенен.

Это предотвращает variant explosion и одновременно не прячет contract complexity.

### 4.7. Themes, modes and tokens

Для каждой supported mode фиксируются:

- semantic token refs;
- contrast and accessibility checks;
- component-specific token exceptions;
- visual snapshots на одинаковых state/fixture tuples;
- fallback behavior;
- unsupported modes.

Authoring правило:

```text
one canonical component structure
+ variables/modes/token references
→ generated comparative documentation snapshots
```

Три независимо редактируемые копии component master для light/display/dark не допускаются.

### 4.8. Behavior, interaction and motion

Секция включает:

- pointer, keyboard and touch interactions;
- focus order and focus restoration;
- action semantics and expected effect;
- loading/disabled concurrency rules;
- dismissal and escape behavior;
- drag/swipe/hold thresholds, если применимо;
- motion purpose, duration/easing token refs;
- reduced-motion alternative;
- error recovery;
- state persistence and reset.

Visual hover specimen без behavior contract считается incomplete.

### 4.9. Accessibility

Минимальный набор:

```text
semantic element/role
accessible name and description
name/role/value changes by state
keyboard map
focus-visible treatment
focus order and trapping/restoration
contrast in all modes/states
minimum target size
screen-reader announcements
error association
motion reduction
zoom/reflow and text resize
RTL/localization impact, if relevant
```

A11y evidence связывается с exact isolated specimen и runtime instance, а не только с checklist declaration.

### 4.10. Responsive and container behavior

Компонент документируется не только на desktop/mobile screenshots. Contract описывает:

- container ranges или breakpoints;
- min/max/intrinsic sizes;
- wrap/truncate/expand rules;
- region reordering;
- visibility changes;
- media ratio/crop behavior;
- touch adaptation;
- parent constraints;
- prohibited squeeze states.

Каждый required responsive class имеет specimen и fixture stress case.

### 4.11. Content and localization

Для каждого content slot фиксируются:

- intent and terminology;
- required/optional/empty behavior;
- min/typical/max stress fixture;
- line count and overflow;
- punctuation/case;
- number/date/time/place formatting;
- localization expansion;
- accessible alternative;
- privacy/safety restrictions, если применимо.

Правила текста должны быть видны product designer и content designer без чтения TypeScript API.

### 4.12. Product fixtures and prohibited usage

После isolated specimens показываются:

1. accepted source-proven product contexts;
2. stress content;
3. responsive contexts;
4. related composition/archetype;
5. prohibited or misleading usage;
6. unresolved gaps.

Каждый example имеет:

```yaml
fixture_id: ...
source_ref: ...
consumer_context: ...
state_key: ...
viewport_id: ...
expected_outcome: ...
evidence_class: reconstructed | candidate | accepted
```

### 4.13. Code, API and sandbox

Инженерный view содержит:

- package and import path;
- supported framework/runtime boundary;
- generated prop/state types;
- defaults;
- slots and events;
- semantic markup contract;
- allowed CSS custom properties;
- forbidden consumer overrides;
- runnable isolated examples;
- error and loading examples;
- SSR/hydration caveats, если применимо;
- package version and candidate SHA.

Sandbox не является отдельной реализацией. Он импортирует exact package/candidate implementation и exact fixture/state identities.

### 4.14. Tests and evidence

Dossier публикует coverage map, а не только зелёный badge:

| Evidence | Минимум |
|---|---|
| structural | anatomy/slots/dependency validation |
| state | required state registry coverage |
| interaction | keyboard/pointer/touch behavior |
| accessibility | semantic tree, focus, announcements, contrast/reflow where applicable |
| responsive | required viewport/container classes |
| visual | accepted/candidate references with identity |
| integration | real consumer contexts and no forbidden overrides |
| conformance | Penpot ↔ isolated Astro ↔ generated-page tuple parity |
| lifecycle | decision, promotion/deprecation and rollback receipts |

### 4.15. Changelog, migration and support

Каждая version содержит:

- change type: added/changed/fixed/deprecated/removed;
- contract and package versions;
- affected axes/states/slots;
- consumer impact;
- migration steps;
- compatibility window;
- replacement identity;
- rollback path;
- owner/reviewer;
- evidence refs.

Deprecated resource остаётся searchable. Его landing section сразу объясняет replacement и migration, а не только показывает красный badge.

## 5. Penpot / Resource Graph visual page

Предлагаемый board template для одного component family:

```text
00  Identity, authority and links
10  Purpose, selection and related resources
20  Default specimen
30  Anatomy, slots and semantic zones
40  Variant axes and valid combinations
50  Interaction, async and product states
60  Themes/modes and token mapping
70  Responsive/container behavior
80  Content/localization guidance
90  Product fixtures and prohibited usage
100 Code/API/test bindings
110 Evidence, lifecycle, migration and support
```

### Layout rules

- root board использует существующий managed spatial contract;
- каждая zone имеет stable ID и owned bounds;
- default и critical states доступны без горизонтального поиска;
- axes располагаются последовательно и не смешиваются с themes;
- mode comparison использует одинаковый specimen tuple;
- supporting components находятся после anatomy, не раньше purpose;
- product examples отделены от conformance specimens;
- banners явно показывают `RECONSTRUCTED`, `CANDIDATE`, `ACCEPTED` или `DEPRECATED`;
- no detached copies в candidate/accepted zones;
- comments и gaps привязаны к stable identity/version.

## 6. Catalog information architecture

Resource Graph уже разделяет:

```text
20 — Foundations
25 — Iconography
30 — Core UI resources
40 — Announcements components
50 — Product patterns
60 — Page archetypes
70 — Coverage and fragmentation
```

Component Dossier Standard не создаёт новый плоский «Components» dump. Dossiers размещаются по family ownership, а единый catalog/index агрегирует metadata.

Карточка каталога показывает:

```text
display name + component_id
short purpose
entity kind
lifecycle/display status
version
owner
supported consumers/archetypes
coverage summary
last reviewed
blocking gaps
links: dossier / Penpot / code / specimen / evidence / migration
```

Search индексирует display name, stable ID, aliases, product terminology, previous names и replacement IDs.

## 7. Naming standard

### Canonical machine names

- English `kebab-case` or repository-approved stable format for IDs;
- axis names and values are singular, correctly spelled and semantically scoped;
- booleans используются только для настоящих independent on/off states;
- `None` не используется как маскировка impossible combination;
- visual labels могут локализоваться, canonical values — нет;
- rename требует alias/migration mapping.

### Required parity check

```text
contract axis/value
== generated state key
== Penpot property/value
== Astro prop/resolver mapping
== test registry key
== dossier anchor/label mapping
```

Display punctuation/casing может отличаться, identity — нет.

## 8. Automation and CI

Candidate validation package должен проверять:

1. required dossier sections;
2. identity/header schema;
3. valid internal links;
4. exact contract/version/hash parity;
5. design/code/runtime binding presence by lifecycle state;
6. canonical naming and spelling dictionary;
7. defaults and valid/invalid combinations;
8. state/specimen/test coverage;
9. fixture provenance;
10. mode/theme parity;
11. accessibility and responsive requirement declarations;
12. deprecation replacement/migration fields;
13. stale review dates as warnings, not authority changes;
14. no `canonical: true` before terminal promotion;
15. no acceptance inferred from screenshot or documentation coverage.

Генерация может создавать catalog cards, props tables, state matrices и deep links. Design rationale, selection guidance и content rules требуют reviewed human authorship.

## 9. Definition of documentation-ready

`documentation-ready` — вспомогательная метка, не lifecycle state. Она означает только:

- header complete;
- purpose/selection reviewed;
- axes/states/defaults documented;
- anatomy and ownership documented;
- required behavior/a11y/responsive/content sections present;
- source-proven fixtures linked;
- code/design/test/evidence bindings shown according to current lifecycle;
- blockers explicit;
- migration/support fields present where applicable.

Она **не означает**:

- contract accepted;
- code canonical;
- Penpot candidate materialized;
- three-way conformance passed;
- product archetype accepted;
- family promoted.

## 10. Acceptance path for this standard

Этот v0.1 следует рассматривать отдельно от component family decisions:

```text
research review
→ documentation-standard decision
→ machine schema/checklist pilot
→ one family-scoped dossier pilot
→ usability review by design/dev/content
→ CI validation pilot
→ standard v1 acceptance or revision
```

Даже принятый documentation standard не меняет authority конкретного component family.

# Product Atlas Penpot extension

> **Статус:** рекомендуемая граница расширения для owner review.  
> **Дата:** 7 августа 2026 года.  
> **Каноническая продуктовая архитектура:** `events-bot-new/docs/product-model/product-atlas-architecture.md`.

## 1. Решение

LoveKGD Design System получает внутреннее расширение для визуализации продуктовой модели, но не становится владельцем Jobs, outcomes, release state или metrics.

```text
events-bot-new product model
+ common-analytics evidence snapshot
+ LoveKGD visualization tokens/components
→ Penpot Product Atlas snapshot
```

Product Atlas размещается в **отдельном Penpot-файле**. Resource Graph дизайн-системы остаётся библиотекой resources, archetypes и visual evidence.

## 2. Почему отдельный Penpot-файл

Product Atlas отличается от design-system resource graph:

- чаще обновляет runtime/evidence values;
- содержит Jobs, stakeholder lanes, metrics и incidents;
- имеет другой review cadence;
- должен сохранять stable product-board geometry;
- не должен загрязнять component library и design-system coverage.

Файлы связываются IDs и deep links:

```text
Product Atlas capability / UI evidence
↔ Resource Graph component / pattern / archetype
↔ actual / baseline / diff screenshot
```

## 3. Переиспользуемый foundation

Product Atlas наследует из LoveKGD:

- semantic colors;
- Inter typography roles;
- 4px spacing scale;
- radii, borders и elevation;
- focus, keyboard и 44px interaction contracts;
- reduced motion и accessible status rules;
- iconography resources.

Внутренняя визуализация не выбирает отдельную палитру и не копирует raw values.

## 4. Новый namespace компонентов

Рекомендуемые paths:

```text
Visualization/ProductModel/*
Internal/ProductAtlas/*
```

Компоненты:

| Component | Contract |
|---|---|
| `ProductEntityCard` | type, ID, title, owner, purpose, relations, evidence facets |
| `StakeholderLane` | user, owner/operator или partner context |
| `JobNode` | Job, context, start/terminal summary |
| `OutcomeNode` | user/owner/partner outcome, metric and confidence |
| `CapabilityNode` | stable capability identity and linked journeys |
| `StatusFacetStrip` | independent definition/delivery/release/runtime/outcome state |
| `ProblemBubble` | problem type, S/M/L impact, context, age, owner and evidence |
| `CoverageCell` | scenario tuple and implemented/tested/released/live/observed vector |
| `MetricEvidenceCard` | value, target, window, sample, freshness and provenance |
| `IncidentMarker` | incident, severity, affected context and recovery state |
| `DecisionCallout` | decision required, options, owner and due date |
| `EvidenceLink` | immutable source reference and environment |
| `FilterContext` | selected Job, release, contexts and time window |

Эти components являются internal visualization primitives и не входят автоматически в public-site runtime library.

## 5. Semantic status grammar

Нельзя заменять многомерное состояние одним badge.

### Delivery

- `planned` — dotted boundary / target plane;
- `implemented` — square marker;
- `verified` — diamond/check marker;
- `released` — release triangle.

### Runtime

- `healthy` — solid circle/check;
- `degraded` — triangle + hatch;
- `broken` — octagon/cross;
- `unknown` — hollow shape/question.

### Evidence and governance

- `insufficient_data` — dotted fill;
- `stale_evidence` — diagonal pattern + timestamp;
- `decision_required` — explicit callout;
- `superseded` — double boundary and replacement link;
- `not_applicable` — explicit dash, never blank.

Color only reinforces meaning. Text, shape, pattern and stable position remain mandatory for grayscale, high contrast, PDF and screen-reader equivalents.

## 6. Product Radar

`00 — Executive / Problem Radar` contains no more than seven generated problem bubbles.

Bubble types:

- product gap;
- coverage gap;
- runtime incident;
- evidence gap;
- decision gap;
- design drift.

Bubble size is discrete `S/M/L`. The renderer must not create continuous pseudo-precision from an opaque score.

Every bubble links to:

```text
Job → context → capability → evidence / incident → decision options
```

## 7. Named pages

```text
00 — Executive / Problem Radar
10 — Stakeholders, Jobs and outcomes
20 — Journeys and capabilities
30 — Delivery, coverage and readiness
40 — Metrics, incidents and decisions
50 — UI and design evidence
80 — Candidate decisions
89 — Decision archive
99 — Technical diagnostics
```

Resource Graph pages remain in the design-system file and are not duplicated.

## 8. Renderer and plugin boundary

Product Atlas should be implemented as a second catalog mode of the current deterministic renderer, not as an unrelated plugin.

### Reuse from Resource Graph 004a.2

- one catalog per update;
- exact source identity and hashes;
- managed shared plugin data;
- idempotent reconciliation;
- checkpoint/resume;
- fail-closed update;
- preservation of foreign objects and native comments;
- deterministic comment-to-prompt flow;
- one whole-system update action.

### Add for Product Atlas

- product-model and evidence schemas;
- stable board-layout rules;
- derived Problem Radar;
- in-place updates of metric/status child shapes;
- cross-links to Product Console and Resource Graph;
- snapshot-level release and evidence identity.

Frequent value updates must not replace an entire entity card. Managed text/status children update in place so spatial position and comment attachment survive.

Structural changes create a new version or archived snapshot when required.

## 9. Snapshot identity

Each Product Atlas update records:

```text
product_model_sha
analytics_snapshot_sha
release_checklist_sha
incident_revision
accepted_release_identity
design_token_version
renderer_version
catalog_sha256
```

A generic `CURRENT` is prohibited. Currentness remains multidimensional:

- product model;
- analytics evidence;
- release state;
- runtime health;
- visual resources;
- review state.

## 10. Comment routing

Comments attach to the selected managed entity:

- Job or outcome comment → product-model decision;
- capability comment → shared capability and linked journeys;
- coverage cell comment → exact context and evidence gap;
- problem bubble comment → affected Job/context/problem record;
- metric card comment → metric definition, data quality or interpretation;
- UI evidence comment → Resource Graph component/archetype/screenshot context.

Generated prompts contain stable entity IDs, context tuple, source SHAs, evidence references and Penpot thread IDs.

A comment never changes Git or production automatically.

## 11. Penpot MCP

Penpot MCP is useful for:

- read/inspect;
- assisted review;
- prototyping a candidate board or component;
- small reversible changes.

It is not the canonical synchronization path. Product Atlas sync remains in the custom plugin because the plugin enforces exact catalog identity, hashes, managed object ownership, idempotency and recovery.

## 12. Pilot acceptance

The pilot is accepted when one real Penpot file proves:

- one plugin opening and one update action;
- one Job, two journeys and 5–8 capabilities;
- independent delivery/runtime/outcome facets;
- four context coverage cells;
- generated Product Radar;
- links to one real incident and UI evidence;
- native comments preserved across one metric refresh;
- deterministic prompt from one problem comment;
- second preflight reports zero pending managed changes;
- static PDF remains understandable without color.

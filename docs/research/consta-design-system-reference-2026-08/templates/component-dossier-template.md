# `<Display name>` — Component Dossier

> Copy this file for a bounded component family/version. Delete instructional comments only after every required field is resolved or explicitly marked as a blocker / not applicable with reason.

## Identity and authority

```yaml
document_kind: component-dossier
dossier_schema_version: lovekgd.component-dossier.v0.1
dossier_status: draft

component_id: <stable component ID>
family_id: <stable family ID>
entity_kind: component
aliases: []
display_name: <human-readable name>
summary: <one-sentence user-centered purpose>

contract_version: <semver or candidate version>
contract_sha256: <hash>
authority_mode: reconstructed
lifecycle_state: <exact lifecycle state>
contract_decision_status: <draft | candidate-accepted | promoted | deprecated>
canonical: false
display_status: <RECONSTRUCTED | CANDIDATE | ACCEPTED | DEPRECATED>

owner: <role/person/team>
reviewers: []
review_channel: <link or stable channel ID>
created_at: <YYYY-MM-DD>
last_reviewed_at: <YYYY-MM-DD>

component_contract_ref: <repo path>
family_registry_ref: <repo path>
astro_binding_ref: <repo path or null with blocker>
penpot_binding_ref: <deep link/receipt or null with blocker>
runtime_binding_ref: <repo path or null with blocker>
package_ref: <package/version/SHA or null>
source_snapshot_sha: <exact source SHA>
fixture_registry_ref: <repo path>
evidence_receipts: []
promotion_receipt_ref: null
rollback_ref: <repo path or null with reason>
replacement_ref: null
```

### Authority statement

Write one explicit paragraph that explains what is authoritative **now**, what remains candidate, and what this dossier does not prove.

## Entry points

| Surface | Exact link/reference | Version/SHA | Status |
|---|---|---|---|
| Component Contract |  |  |  |
| Family registry |  |  |  |
| Penpot component/page |  |  |  |
| Astro implementation |  |  |  |
| Isolated specimen |  |  |  |
| Product consumers |  |  |  |
| Test/evidence package |  |  |  |
| Migration/rollback |  |  |  |
| Support/review |  |  |  |

## 1. Purpose and selection

### User need / Job / outcome

Describe the human or product outcome. Do not define the component only through its appearance.

### Use when

- ...

### Do not use when

- ...

### Related resources

| Resource | Relationship | Selection rule |
|---|---|---|
|  | alternative / nested / parent / replacement |  |

### Product capabilities and archetypes

| Capability/archetype | Role of this component | Evidence/ref |
|---|---|---|
|  |  |  |

### Known gaps

| Gap ID | Description | Impact | Owner | Blocking lifecycle transition |
|---|---|---|---|---|
|  |  |  |  |  |

## 2. Default specimen

```yaml
state_key: <canonical ordered state key>
fixture_id: <exact fixture>
viewport_id: <or container_id>
content_class: <typical/min/max/etc.>
interaction_mode: <single_shot/toggle/etc.>
evidence_class: reconstructed
```

Add the visual specimen/reference and explain why this state is the contract default or recommended starting state.

## 3. Anatomy and ownership

| Region/slot | Stable ID | Required | Semantic role | Content owner | Behavior owner | Nested component | Consumer may change |
|---|---|---:|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

### Allowed consumer control

- declared props;
- declared slots;
- container sizing;
- declared context variants;
- approved CSS custom properties.

### Forbidden overrides

- ...

### Dependency graph

```text
<parent component>
├── <nested component>
└── <nested component>
```

## 4. Variant axes

| Axis | Semantic intent | Values | Default | Owner | Responsive effect | Versioning note |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

### Valid combinations

| Combination/state key | Reason/product use | Required specimen | Required test |
|---|---|---:|---:|
|  |  |  |  |

### Invalid combinations

| Combination | Why invalid | Validation behavior | Migration mapping, if legacy |
|---|---|---|---|
|  |  |  |  |

## 5. State axes

### Interaction states

| State | Trigger | Visual change | Semantic/behavior change | Keyboard/touch | Evidence |
|---|---|---|---|---|---|
| default |  |  |  |  |  |
| hover |  |  |  |  |  |
| focus-visible |  |  |  |  |  |
| pressed |  |  |  |  |  |
| disabled |  |  |  |  |  |

### Async / selection / content / product states

| Axis/state | Owner | Entry condition | Exit condition | Expected effect | Fallback/error behavior |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 6. Themes, modes and tokens

| Mode/context | Supported | Token set/ref | Contrast status | Exceptions | Exact comparison specimen |
|---|---:|---|---|---|---|
|  |  |  |  |  |  |

### Component token mapping

| Semantic role | Token ref | Fallback | Allowed override |
|---|---|---|---|
|  |  |  |  |

State explicitly that comparative theme frames are generated from one component structure, or document the blocker.

## 7. Responsive and container behavior

| Range/container | Layout/anatomy change | Visibility/order change | Text/media behavior | Touch adaptation | Required fixture |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

### Intrinsic sizing

```text
min width:
max width:
min height:
content-driven dimensions:
overflow behavior:
prohibited squeeze state:
```

## 8. Interaction, motion and accessibility

### Interaction contract

| Action ID | Zone | Input | Expected effect | Repetition mode | Disabled/loading rule |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

### Keyboard map

| Key | Context | Result |
|---|---|---|
|  |  |  |

### Focus behavior

Describe focus-visible, order, trapping/restoration and focus after state/route changes.

### Accessibility semantics

```text
root semantic element/role:
accessible name source:
accessible description source:
name/role/value by state:
announcements/live region:
error association:
target size:
zoom/reflow/text resize:
reduced-motion behavior:
RTL/localization impact:
```

### Motion

| Transition | Purpose | Token/duration/easing | Reduced-motion alternative |
|---|---|---|---|
|  |  |  |  |

## 9. Content and localization

| Slot | Intent | Required | Typical fixture | Stress fixture | Lines/overflow | Localization/accessibility rule |
|---|---|---:|---|---|---|---|
|  |  |  |  |  |  |  |

### Writing rules

- ...

### Prohibited content patterns

- ...

## 10. Product fixtures and usage

| Fixture ID | Source ref | Consumer/archetype | State key | Viewport/container | Evidence class | Purpose |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

### Recommended usage

Add source-proven examples and explain the decision, not only the appearance.

### Prohibited or misleading usage

Add examples that prevent common misuse. Do not fabricate a prohibited example without describing the violated contract rule.

## 11. Code and API

### Import

```ts
// exact package/import example
```

### API

| Prop/slot/event | Type/values | Default | Meaning | State/axis mapping | Breaking-change impact |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

### Semantic markup boundary

Describe required elements/roles and polymorphism constraints.

### Consumer boundary

List allowed CSS variables/context hooks and forbidden internal selectors/overrides.

### Runnable specimens

| Specimen ID | State key | Fixture | Purpose | Link |
|---|---|---|---|---|
|  |  |  |  |  |

## 12. Tests and evidence

| Requirement | Required evidence | Current result | Artifact/ref | Blocker/notes |
|---|---|---|---|---|
| anatomy/slots |  |  |  |  |
| variant mapping |  |  |  |  |
| state coverage |  |  |  |  |
| token mapping |  |  |  |  |
| interaction |  |  |  |  |
| accessibility |  |  |  |  |
| responsive |  |  |  |  |
| text/media stress |  |  |  |  |
| local overrides |  |  |  |  |
| Penpot candidate |  |  |  |  |
| isolated Astro specimen |  |  |  |  |
| generated-page instance |  |  |  |  |
| three-way conformance |  |  |  |  |
| rollback |  |  |  |  |

## 13. Lifecycle and decisions

### Current lifecycle state

Explain why the family is in the declared state and what exact evidence supports it.

### Next adjacent transition only

```text
current:
next:
required gate:
blocking evidence:
owner decision:
```

Do not describe a non-adjacent state as the immediate next step.

## 14. Changelog and migration

| Version/date | Added | Changed | Fixed | Deprecated/removed | Consumer impact | Receipt/ref |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

### Migration

```text
from identity/version:
to identity/version:
breaking changes:
steps:
compatibility window:
rollback:
affected consumers:
```

## 15. Support and unresolved review

| Thread/gap | Surface | Owner | Status | Exact version/identity | Resolution ref |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## Documentation readiness result

```yaml
documentation_ready: false
checklist_ref: ./component-page-readiness-checklist.md
open_blockers: []
```

`documentation_ready` does not change lifecycle, authority or `canonical`.

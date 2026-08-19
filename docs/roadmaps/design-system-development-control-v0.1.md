# LoveKGD Design System — development control v0.1

## Document status

```yaml
document_kind: design-system-development-control
version: 0.1.0
status: candidate-for-owner-review
canonical: false
authority_effect: none
lifecycle_effect: none
penpot_mutation_authorized: false
implementation_authorized: false
observed_at: 2026-08-19
```

Этот документ превращает сравнительный benchmark в управляемую программу доработки LoveKGD Design System. Он определяет порядок решений, workstreams, evidence и review gates. Он **не** принимает target architecture автоматически, не меняет действующий 11-state lifecycle и не разрешает массовую materialization.

Research basis:

- [Comparative design-system benchmark](../research/design-system-benchmark-2026-08/README.md);
- [Direct Figma read-back: T2D2 Web and Rosatom](../research/design-system-benchmark-2026-08/07-direct-figma-readback-t2d2-rosatom.md).

## 1. Objective

Сформировать систему, в которой:

1. identity, version, lifecycle и contracts имеют один нормативный центр;
2. Penpot является понятной native visual implementation и owner-review surface;
3. code, Penpot, docs и tests связаны exact IDs/versions/hashes;
4. между компонентами и страницами существует управляемый pattern/block layer;
5. page archetypes являются versioned composition contracts;
6. owner review предшествует corrections и implementation decisions;
7. promotion выполняется bounded per family and affected archetypes;
8. external references имеют видимый availability/evidence state и не подменяют current truth историческими covers;
9. component/package version не кодируется как variant axis;
10. imported token dependencies, canonical axis names и display aliases управляются машинно.

## 2. Non-negotiable invariants

### I-01. Existing authority preserved

До отдельного promotion текущий executable product source остаётся fact source для AS-IS behavior. Candidate contracts описывают target и не переписывают историю.

### I-02. Git contract graph is identity center

Normative identity/lifecycle/version lives in Git contracts/package metadata, not Penpot object IDs, filenames or screenshots.

### I-03. Penpot is not sole SoT

Penpot owns native visual implementation, specimens and comments at exact revision, but does not independently alter contract or lifecycle.

### I-04. Resource kinds are explicit

```text
foundation → primitive → component → pattern → page archetype → product representation
```

No resource kind is inferred from visual size or folder location.

### I-05. Dossier completeness ≠ acceptance

A polished dossier can remain reconstructed/candidate. Display status must derive from lifecycle truth.

### I-06. No detached accepted copies

Accepted/candidate conformance surfaces use bound native instances and exact bindings.

### I-07. Review is tuple-bound

Every review references exact resource/version/hash/state/fixture/viewport.

### I-08. Page archetypes are contracts

No route screenshot or free block list becomes archetype without semantic regions, page states, responsive and accessibility contracts.

### I-09. Changes are bounded and reversible

Every mutation/implementation has scope, source SHA, manifest, read-back and rollback.

### I-10. No global normalization before pilot

First wave is one evidence-ready family, one pattern and one archetype candidate.

### I-11. External reference availability is explicit

Each external design-system source declares one of:

```text
LIVE_CHECKPOINT_READBACK
LIVE_NODE_API_READBACK
LIVE_METADATA_ONLY
HISTORICAL_INDEX_ONLY
UNPUBLISHED_OR_INACCESSIBLE
```

The record also includes observed date, source version where known, current URL status, response/checkpoint hash where available and exact limitations.

A historical screenshot, cover or index cannot establish current component API, token model, code binding or lifecycle.

### I-12. Contract version is not a component variant

`contract_version`, package version and migration status belong to immutable identity/release metadata. They cannot be a public Penpot component property or runtime state axis.

### I-13. Canonical names and display labels are separate

Designer-facing labels may contain localized text or visual markers. Canonical IDs, axes and values must pass spelling, casing, uniqueness and compatibility validation and generate the same state identity in design, code, docs and tests.

### I-14. Token dependencies are a versioned graph

Every local or imported token collection records stable ID, owner, source library/package version, source revision/hash, modes, consumers, compatibility, replacement/supersession and drift status.

## 3. Target operating model

```text
Product Atlas / exact source evidence
→ resource hypothesis
→ contract decision
→ code candidate
→ Penpot native candidate
→ component conformance
→ pattern contract
→ page archetype contract
→ product representations
→ owner review and corrections
→ final conformance
→ family/archetype promotion
```

This sequence is embedded into, not substituted for, the existing normative family lifecycle.

External references feed research/evidence only:

```text
external source
→ availability/read-back record
→ labelled observation or inference
→ bounded candidate decision input
```

They do not enter the authority path directly.

## 4. Workstreams

## W0 — Governance and evidence

### Purpose

Create a reliable decision layer before visual population.

### Deliverables

- source/evidence register;
- external-reference availability ledger;
- resource-kind definitions;
- decision record template;
- owner/reviewer roles;
- review severity and closure protocol;
- compatibility and supersession policy;
- research/reference classification;
- last-successful-read-back and historical-source policy.

### Gate W0

```text
W0-GATE: GOVERNANCE_REVIEWED
```

Pass only if owner explicitly decides Git/Penpot/code/runtime roles, allowed resource kinds, owner/reviewer model, evidence classes, external-reference states and no-authority boundary of research. No component lifecycle transition is included.

---

## W1 — SoT registry and machine schemas

### Purpose

Define stable identities and outputs shared by design/code/docs/tests.

### Deliverables

- component/pattern/archetype metadata schemas;
- stable identity tuples;
- external-reference evidence schema;
- token registry and dependency schema;
- fixture and viewport registries;
- binding registry for Penpot/code/runtime;
- canonical naming/display-alias schema;
- spelling/case/uniqueness validation;
- variant-version prohibition validation;
- valid/invalid-combination validation;
- compatibility and migration fields;
- catalog rendering contract.

### Gate W1

```text
W1-GATE: REGISTRY_SCHEMA_ACCEPTED
```

Pass criteria:

- schemas validate positive/negative fixtures;
- exact lifecycle fields are required;
- `canonical:true` is rejected outside terminal state;
- Penpot IDs cannot replace stable resource IDs;
- all references are version/hash bound;
- version-like fields are rejected from variant/state axes;
- historical/unavailable external sources cannot be marked current;
- canonical axis aliases cannot collide;
- imported token dependencies without owner/version are rejected.

---

## W2 — Foundations and tokens

### Purpose

Build the minimum semantic foundation required by the pilot.

### Target layers

```text
primitive
→ semantic foundation
→ component
→ justified pattern/archetype
→ theme/product aliases
```

### Deliverables

- current-value inventory;
- semantic role proposal;
- consumer mapping;
- mode/theme model;
- responsive token policy;
- hard-value exception policy;
- token Penpot binding manifest;
- code exports and drift checks;
- imported/local collection dependency graph;
- duplicate/superseded collection disposition.

### Gate W2

```text
W2-GATE: PILOT_FOUNDATIONS_READY
```

Only bounded tokens needed by the pilot. No whole-system tokenization. Every consumed collection has exact owner/version/source and no unresolved parallel semantic source.

---

## W3 — Component dossier pilot

### Purpose

Prove one family end to end.

### Pilot selection rule

Choose the family with strongest exact source/evidence/readiness, not the visually simplest component.

### Deliverables

- reviewed family hypothesis;
- candidate Component Contract;
- generated state/fixture plan;
- canonical code candidate;
- native Penpot component candidate;
- dossier board;
- isolated specimens;
- a11y/interaction/visual tests;
- source-proven product representations;
- review packet and rollback;
- normalized canonical axes and display labels;
- explicit version/migration metadata outside variant properties.

### Gate W3

```text
W3-GATE: COMPONENT_OWNER_REVIEW_COMPLETE
```

Owner outcome: accept candidate direction, changes requested, reject or defer with blocker. Even accepted direction remains noncanonical until normative promotion.

---

## W4 — Pattern/block layer

### Purpose

Prevent domain compositions from being hidden in components or duplicated per page.

### Deliverables

- recurring composition census;
- pattern vs component decision;
- pattern contract/schema;
- component dependency graph;
- slots and allowed contexts;
- responsive and state behavior;
- content/a11y rules;
- code/Penpot candidate;
- fixtures and usage representations.

### Gate W4

```text
W4-GATE: PATTERN_BOUNDARY_REVIEWED
```

Must prove recurrence, independent composition responsibility, no component-internal override, no page-level ownership leakage and bounded consumer set.

---

## W5 — Page archetype candidate

### Purpose

Form a versioned page class from accepted candidate resources.

### Deliverables

- route/page census;
- Job/outcome and capability bindings;
- semantic region map;
- composition schema;
- required/optional/conditional slots;
- page state registry;
- responsive branches;
- navigation/accessibility contract;
- content fixture set;
- Penpot candidate;
- generated preview route;
- multiple source-proven representations;
- migration mapping from current routes.

### Gate W5

```text
W5-GATE: ARCHETYPE_OWNER_REVIEW_COMPLETE
```

Page archetype cannot pass from one ideal screen. Required: typical + stress + failure state, mobile/desktop branches where applicable, exact route/source mappings, no detached accepted resources and page-level a11y review.

---

## W6 — Penpot owner-review operations

### Purpose

Make review deterministic and safe.

### Deliverables

- dossier/root board template;
- visible authority strip;
- explicit resource-kind badge;
- review display states;
- comment protocol;
- review packet renderer;
- change batch page;
- read-only-first MCP procedure;
- mutation/read-back/rollback receipts;
- before/after correction lane;
- public review board generated from the same contract/IR as internal materialization;
- historical/external references isolated from candidate resources.

### Gate W6

```text
W6-GATE: REVIEW_WORKFLOW_VALIDATED
```

Pilot owner can identify reviewed tuple, find default/states/responsive/product contexts, distinguish illustrative/evidence/canonical/historical, leave actionable comment and see correction/closure evidence.

---

## W7 — Conformance, release and migration

### Purpose

Connect reviewed design candidate to package and production consumers.

### Deliverables

- three-way component capsule;
- pattern/archetype conformance capsule;
- visual/a11y/interaction/reference checks;
- package version and changelog;
- consumer compatibility matrix;
- migration recipe/codemod where relevant;
- deprecation and replacement metadata;
- post-deploy runtime evidence;
- promotion and rollback receipts.

### Gate W7

```text
W7-GATE: NORMATIVE_PROMOTION_GATE
```

This document does not redefine the gate. It invokes existing terminal `FAMILY_AND_ARCHETYPE_PROMOTION` and its evidence requirements.

## 5. Phased execution

### Phase 0 — Owner decision on operating model

Review this document and benchmark. Required decisions: SoT roles, resource hierarchy, token layers, Penpot review protocol, archetype definition, pilot selection method, external-reference policy and variant-version prohibition.

**Exit:** signed decision record. **Implementation:** forbidden.

### Phase 1 — Machine contracts

Implement W1 schemas and validators.

**Exit:** negative suites and exact registry test. **Penpot:** no component population yet.

### Phase 2 — Bounded foundations

Inventory and propose only pilot-consumed foundations/tokens.

**Exit:** owner-reviewed candidate mappings, dependency graph and generated exports. **Global token normalization:** forbidden.

### Phase 3 — One component dossier

Run existing family lifecycle to native candidate/conformance where evidence permits.

**Exit:** owner review and reviewed corrections, not automatic promotion.

### Phase 4 — One pattern

Choose a real recurring composition involving the pilot family.

**Exit:** boundary and contract reviewed.

### Phase 5 — One page archetype

Choose one page class backed by exact routes and multiple states.

**Exit:** owner-reviewed archetype candidate and product representations.

### Phase 6 — Pilot release/conformance

Run final gates, migration and bounded promotion if all normative evidence passes.

### Phase 7 — Scale wave

Only after pilot retrospective: improve schemas/templates, define next bounded families, publish coverage metrics and keep mixed authority mode per family.

## 6. P0 implementation backlog

| ID | Deliverable | Workstream | Dependency | Acceptance |
|---|---|---|---|---|
| `P0-01` | resource-kind schema | W1 | W0 decision | invalid kind/transition rejected |
| `P0-02` | stable binding tuple schema | W1 | P0-01 | Penpot/code/runtime refs exact |
| `P0-03` | token-layer/consumer/dependency schema | W1/W2 | W0 | raw/semantic/component boundary and imported ownership validated |
| `P0-04` | fixture and viewport registries | W1 | P0-02 | reused by design/code/tests |
| `P0-05` | Penpot managed metadata schema | W1/W6 | P0-02 | root and dossier read-back |
| `P0-06` | review packet/comment schema | W6 | W0 | exact tuple and decision status |
| `P0-07` | dossier renderer/template v0.1 | W3/W6 | P0-01..06 | all mandatory sections present |
| `P0-08` | pilot family selection dossier | W0/W3 | exact evidence | ranked by readiness, not aesthetics |
| `P0-09` | pattern decision template | W4 | P0-01 | component/pattern boundary explicit |
| `P0-10` | archetype contract schema | W5 | P0-01/04 | regions/states/responsive validated |
| `P0-11` | one Penpot read-only review rehearsal | W6 | P0-05..07 | owner can complete review |
| `P0-12` | drift/compatibility dashboard skeleton | W1/W7 | registries | exact missing/mismatch classes |
| `P0-13` | external-reference availability schema | W0/W1 | evidence classes | current/historical/inaccessible states validated |
| `P0-14` | canonical axis and display-alias registry | W1 | P0-01 | spelling/case/alias collisions rejected |
| `P0-15` | contract-version-as-variant negative gate | W1/W3 | P0-02/14 | design/code state models reject version axes |
| `P0-16` | imported token dependency ledger | W1/W2 | P0-03 | owner/version/hash/consumer/supersession complete |

## 7. Pilot selection score

| Dimension | Weight |
|---|---:|
| exact source identity | 15 |
| reviewed runtime states | 15 |
| family-boundary confidence | 15 |
| product value/usage evidence | 10 |
| fixture completeness | 10 |
| interaction/a11y evidence | 10 |
| responsive evidence | 10 |
| migration boundedness | 5 |
| owner availability | 5 |
| representative pattern/archetype value | 5 |

A family with high visual simplicity but weak boundary evidence must not win.

## 8. Owner decision packet

### D-01 — SoT roles

```text
Git contracts/package = normative identity
Penpot = native visual candidate/review
code package = executable implementation
runtime = conformance evidence
docs = rendered graph
external references = labelled research evidence only
```

### D-02 — Resource hierarchy

```text
foundation → primitive → component → pattern → page archetype → representation
```

### D-03 — Penpot review

Proposed dossier/root structure and tuple-bound comments from the benchmark.

### D-04 — Archetype definition

Proposed versioned composition contract, not screenshot/template.

### D-05 — Pilot

Select after scoring current exact evidence.

### D-06 — External references and version axes

Decide whether to accept the following control rules:

```text
external reference availability is explicit and timestamped;
historical/unavailable files cannot represent current truth;
contract/package version is forbidden as component variant;
canonical axis names are separate from display labels;
imported token collections require exact owner/version/consumer graph.
```

Decision record:

```yaml
decision:
owner:
date:
status: accepted | changes-requested | rejected | deferred
rationale:
constraints:
follow_up:
evidence_refs:
```

## 9. STOP conditions

Stop and do not infer a decision when:

- source/contract identity is ambiguous;
- resource kind is disputed;
- code and design versions cannot be bound;
- external-reference availability is unknown;
- historical/inaccessible source is being used as current design truth;
- contract/package version is encoded as a variant/state axis;
- canonical axis names are not normalized or collide;
- imported token dependency has no exact owner/version/source/consumer mapping;
- fixture provenance is missing;
- valid combinations are unknown;
- Penpot materialization cannot be read back;
- comments are unresolved blockers;
- owner review packet is incomplete;
- candidate requires uncontrolled product overrides;
- archetype has only one ideal representation;
- rollback is absent;
- lifecycle gate preconditions are not met.

## 10. Completion criteria

The program is not complete when “all pages look documented.” It is complete for a bounded wave when:

```text
identity is stable
contract is versioned
version is not hidden in a variant axis
canonical names and display aliases are controlled
Penpot/code/runtime bindings are exact
token dependencies are owned and versioned
required states and fixtures are covered
patterns and archetypes have explicit ownership
owner review and corrections are receipted
migration is bounded
conformance passes
promotion is explicit and reversible
consumers use pinned accepted release
```

## 11. Immediate next action after owner review

```text
1. materialize resource-kind, external-reference, naming and binding schemas;
2. materialize token dependency ledger and negative fixtures;
3. select one pilot family by evidence score;
4. create one component dossier candidate without version axes;
5. derive one recurring pattern candidate;
6. compose one page archetype candidate;
7. run Penpot owner review;
8. implement reviewed corrections;
9. run conformance and only then evaluate promotion.
```

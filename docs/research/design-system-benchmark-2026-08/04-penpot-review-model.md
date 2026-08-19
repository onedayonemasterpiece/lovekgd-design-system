# 04 — Penpot Resource Graph and review model

## 1. Purpose

Penpot в LoveKGD должен позволять владельцу:

1. быстро понять, что именно он проверяет;
2. увидеть default, contract axes, states, responsive behavior и product context;
3. оставить комментарий, привязанный к exact resource identity;
4. отличить illustrative example от conformance evidence;
5. проверить исправление и закрыть decision;
6. не перепутать visually complete candidate с accepted/canonical resource.

Penpot не выполняет promotion и не является независимым SoT.

## 2. Mapping на существующий Resource Graph

| Page | Review role |
|---|---|
| `00 — System map` | current authority, lifecycle, release and review map |
| `05 — Recent changes` | review batches, changed resources, migration and supersession |
| `10 — Brand assets` | exact assets, rights, consumers, allowed/prohibited use |
| `15 — Methodology and contracts` | authority model, review protocol, acceptance and rollback |
| `20 — Foundations` | token layers, modes, grids, motion, media and a11y foundations |
| `25 — Iconography` | semantic taxonomy, optical rules, aliases, legacy and provenance |
| `30 — Core UI resources` | component dossiers for generic controls |
| `40 — Announcements components` | domain component dossiers |
| `50 — Product patterns` | repeatable multi-component compositions |
| `60 — Page archetypes` | page composition contracts and candidate representations |
| `70 — Coverage and fragmentation` | missing states, duplicates, unknown bindings and migration status |

New benchmark material does not add parallel Penpot pages. It defines how existing pages should be populated after lifecycle gates permit it.

## 3. Root board contract

Every managed root:

```yaml
object_kind:
stable_id:
resource_id:
resource_kind:
version:
content_hash:
authority_mode:
lifecycle_state:
decision_status:
canonical:
review_display_state:
source_refs:
binding_refs:
evidence_refs:
open_blockers:
managed_by:
schema_version:
sort_key:
layout_slot:
owned_bounds:
minimum_gap:
overflow_policy:
```

Visible header must show at least:

```text
ID · version · lifecycle · canonical · binding status · last reviewed
```

Tool object IDs are not shown as resource IDs.

## 4. Component dossier board

Recommended vertical order:

### Zone A — Authority strip

- component/family ID;
- contract version/hash;
- lifecycle and authority;
- canonical;
- design/code/runtime bindings;
- compatible package/release;
- owner and last review;
- unresolved blockers.

### Zone B — Purpose and selection

- user problem/outcome;
- when to use;
- when not to use;
- neighboring resources;
- relevant capabilities and archetypes.

### Zone C — Default

- one source-proven default;
- exact `state_key`, fixture and viewport;
- no decorative variants before default is understood.

### Zone D — Anatomy and ownership

- named regions;
- slots and nested components;
- interaction/focus boundaries;
- content ownership;
- permitted external controls;
- forbidden local overrides.

### Zone E — Properties and combinations

- one visual axis per contract axis;
- defaults;
- valid combinations;
- invalid/not-applicable combinations;
- conditional visibility;
- public vs internal state distinction.

### Zone F — Interaction/system states

At minimum, if applicable:

```text
rest
hover
pressed
focus-visible
disabled
loading
success
warning
error
empty
offline
permission-denied
unknown-data
```

States are shown only where contract or source evidence supports them.

### Zone G — Modes/themes/platforms

- light/dark/high-contrast;
- density/platform differences;
- generated comparative boards from one master and token modes;
- compatibility and unsupported modes.

### Zone H — Responsive/container behavior

- exact viewport/container IDs;
- min/max constraints;
- wrapping/reflow/order;
- visibility changes;
- pointer/touch differences;
- keyboard order after reflow.

### Zone I — Content and media stress

- short/long/localized labels;
- empty/missing/unknown values;
- dates, prices, places and pluralization;
- real image ratios;
- OCR/media protection;
- accessible name and truncation rules.

### Zone J — Product representations

- source-proven context;
- archetype/route/consumer;
- exact component state and fixture;
- illustrative and evidence specimens clearly separated.

### Zone K — Code and evidence

- props/schema summary;
- isolated specimen;
- test coverage;
- a11y/interaction/visual evidence;
- current blockers and migration.

### Zone L — Review lane

- owner decision questions;
- open comments;
- proposed correction;
- before/after;
- validation result;
- closure receipt link.

## 5. Pattern board

Pattern board adds:

- pattern purpose and boundary;
- component dependency graph;
- slots and sequence;
- repeatability rules;
- allowed contexts;
- content relationships;
- responsive composition;
- cross-component focus and keyboard order;
- analytics/observability boundaries;
- fallback/error/empty behavior;
- examples across consumers;
- reasons not to make it a single component.

## 6. Page archetype board

Root zones:

```text
authority and purpose
semantic region map
composition graph
slot requirements
page states
responsive branches
navigation and interaction
content classes
accessibility sequence
source route evidence
candidate representations
review questions
conformance and migration
```

## 7. Variant rules

A Penpot component set may combine instances only when all remain one identity:

- same purpose;
- same semantic root;
- compatible anatomy;
- same interaction owner;
- values represented by declared contract axes.

Create separate identity when a value changes user outcome, semantic role, required anatomy, interaction model, accessibility contract or independent lifecycle/version.

No axis may be named `type` or `variant` without a domain-specific semantic meaning in the contract.

## 8. Connected layers and overrides

To preserve safe variant switching:

- equivalent layers keep stable names, types and hierarchy;
- slots use explicit stable role names;
- hidden elements are not silently repurposed;
- accepted specimens use instances, not detached copies;
- nested identity is preserved;
- local overrides are allowed only through declared slots/properties;
- raw fill/text overrides are not accepted configuration.

## 9. Review display states

These are workflow display states, not lifecycle states:

```text
DRAFT_MATERIALIZATION
READY_FOR_OWNER_REVIEW
OWNER_REVIEW_IN_PROGRESS
CHANGES_REQUESTED
OWNER_REVIEWED_CANDIDATE
CONFORMANCE_PENDING
PROMOTION_REVIEW
PROMOTED_REFERENCE
SUPERSEDED_REFERENCE
```

`OWNER_REVIEWED_CANDIDATE` does not imply accepted or canonical.

## 10. Penpot comment protocol

Comment title:

```text
[severity][area][state_key][fixture_id][viewport_id]
```

Body:

```text
Problem:
Consequence:
Expected contract/behavior:
Evidence or source:
Suggested resolution:
Decision needed:
```

Severity:

| Level | Meaning |
|---|---|
| `blocker` | identity, lifecycle, semantics, accessibility or conformance invalid |
| `major` | important product/behavior/responsive defect |
| `minor` | bounded visual/content defect without semantic impact |
| `question` | owner decision required; no implicit rejection |
| `note` | traceability/context; no action by itself |

Comments about personal preference without problem/consequence are not acceptance evidence.

## 11. Review packet

A resource becomes `READY_FOR_OWNER_REVIEW` only when packet includes:

```yaml
review_packet_id:
resource_tuple:
scope:
changed_since:
source_refs:
decision_questions:
specimen_manifest:
fixture_manifest:
viewport_manifest:
known_limitations:
automated_checks:
manual_checks:
rollback_ref:
```

Owner review produces one of:

```text
accept candidate direction
request changes
reject candidate direction
defer with explicit blocker
```

It does not produce promotion.

## 12. MCP/plugin operation

### Read-first protocol

```text
inspect exact file/page/revision
→ verify managed zones and identities
→ compute bounded change
→ stage reversible mutation
→ read back counts/metadata
→ export evidence
→ do not alter lifecycle
```

### Forbidden

- whole-file cleanup without exact manifest;
- guessed object IDs;
- mutation from screenshots alone;
- detaching accepted instances;
- resolving owner comments automatically;
- changing `canonical` or lifecycle;
- silently replacing fixtures;
- deleting historical evidence.

## 13. Visual review checklist

For every applicable resource:

- exact identity/version visible;
- default clear;
- light/dark/high-contrast;
- supported viewport/container widths;
- real-like content;
- long/empty/error/loading/unknown cases;
- hover/pressed/focus/touch;
- keyboard/focus order;
- contrast and non-color cues;
- source and code binding;
- screenshot overlay or accepted-reference comparison;
- no detached copies;
- no raw hard values where tokens required;
- all comments linked to reviewed tuple;
- correction revalidated after changes.

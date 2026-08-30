# 05 — Page archetype model

## 1. Definition

A **page archetype** is a versioned composition contract for a recurring product page class.

It is not:

- a screenshot;
- a route copied into Penpot;
- a free-order list of blocks;
- a template containing detached components;
- a visual layout with no product-state model;
- a component with an oversized variant API.

It owns page-level semantics and constraints:

```text
user/job outcome
+ information architecture
+ semantic regions
+ required/optional slots
+ allowed composition graph
+ page states
+ responsive branches
+ navigation and interaction
+ content classes
+ accessibility sequence
+ source-proven representations
```

## 2. Hierarchy

```text
foundation
→ primitive
→ component
→ pattern
→ page archetype
→ product representation
→ runtime route
```

### Component

Owns bounded anatomy and interaction.

### Pattern

Owns reusable multi-component behavior or composition, e.g. filter toolbar, event-list cluster, media viewer, bulk-action panel or empty-state recovery block.

### Page archetype

Owns page-level regions, sequencing and states, e.g. listing/search results, event detail, favorites, personal feed or artifact collection.

### Product representation

Binds an archetype version to exact product context, route, data and release.

## 3. Archetype identity

```yaml
archetype_id:
archetype_version:
archetype_sha256:
authority_mode:
lifecycle_state:
decision_status:
canonical:
purpose:
jobs:
outcomes:
capabilities:
semantic_regions:
composition_rules:
page_state_axes:
responsive_contract:
content_fixture_classes:
accessibility_contract:
navigation_contract:
analytics_contract:
component_dependencies:
pattern_dependencies:
route_bindings:
representation_refs:
evidence_refs:
promotion_receipt_ref:
rollback_ref:
```

## 4. Semantic regions

Each region declares:

```yaml
region_id:
role:
required:
order:
allowed_resource_refs:
repeatability:
content_owner:
interaction_owner:
responsive_behavior:
fallback:
a11y_landmark:
heading_level_rule:
```

Example, candidate only:

```yaml
region_id: results
role: primary_content
required: true
allowed_resource_refs:
  - pattern.announcements.event-list
repeatability: one
fallback: pattern.feedback.empty-search
a11y_landmark: main
```

## 5. Composition rules

Archetype contract must answer:

- which regions are required;
- which are mutually exclusive;
- allowed sequence;
- maximum repetition;
- dependency/conditional rules;
- whether a region may move at breakpoints;
- who owns spacing and container;
- whether a component can be overridden;
- how loading/error/empty replaces or overlays content;
- how global and local navigation coexist.

Machine rules should support:

```text
required
optional
one_of
all_or_none
requires
forbids
before
after
max_items
slot_accepts
responsive_replace
state_replace
```

## 6. Page states

Page states are not all component variants.

Typical axes:

```text
data:
  loading | ready | empty | partial | stale | error

authorization:
  anonymous | authenticated | forbidden

connectivity:
  online | offline | recovering

query:
  pristine | searching | results | no-results | invalid

selection:
  none | single | multiple

pagination:
  initial | more-available | exhausted | loading-more
```

The archetype defines which states are valid and which region/component states they resolve to.

## 7. Responsive contract

A screenshot at mobile and desktop is insufficient. Contract declares:

- viewport/container model;
- breakpoints or continuous rules;
- grid/columns/gutters;
- region reordering;
- collapsed/expanded controls;
- sticky/fixed behavior;
- media ratios;
- navigation transformation;
- keyboard/focus order;
- touch target and pointer behavior;
- content overflow;
- minimum/maximum widths.

Every branch has fixture and expected composition key.

## 8. Content fixtures

Fixture classes must cover product reality:

```text
typical
minimal
maximal
long-localized
missing-optional
unknown-value
mixed-media
portrait/landscape/tall-media
expired/cancelled
restricted
offline/cache
```

Fixture set is versioned and reused across Penpot, isolated preview and runtime tests.

## 9. Accessibility contract

At page level:

- landmark sequence;
- single page title and heading hierarchy;
- skip links;
- focus entry and restoration;
- dynamic update announcement;
- error summary and field linkage;
- keyboard order after responsive reflow;
- non-color state cues;
- screen-reader reading order;
- modal/drawer containment;
- pagination/infinite-load semantics;
- media alternatives.

Component a11y PASS does not imply archetype a11y PASS.

## 10. Candidate LoveKGD archetype hypotheses

These IDs are research hypotheses only. They do not accept identities or lifecycle transitions.

| Candidate ID | Product need | Likely regions |
|---|---|---|
| `archetype.announcements-listing` | browse/filter upcoming events | header, query/filter, result summary, event list/grid, pagination/load-more, feedback |
| `archetype.announcement-detail` | understand one event and act | breadcrumb/back, event hero/media, metadata, body, actions, related events |
| `archetype.announcements-search` | formulate query and evaluate matches | search header, suggestions/history, filters, result state, recovery |
| `archetype.favorites-collection` | revisit saved events | collection header, sort/filter, saved items, sync/empty/auth states |
| `archetype.personal-feed` | receive personalized recommendations | preference context, feed sections, explanation, feedback controls, empty/onboarding |
| `archetype.artifact-collection` | inspect event media/artifacts | collection context, viewer/grid, metadata, navigation, unavailable/restricted states |

Before any ID is adopted, exact source census and family/archetype decision receipt are mandatory.

## 11. Archetype Penpot board

Recommended zones:

1. Authority header — exact ID/version/lifecycle/bindings.
2. Purpose / jobs / outcomes.
3. Region map — semantic, not visual-only.
4. Composition graph — required/optional and dependencies.
5. Default representation.
6. Page state matrix.
7. Responsive branches.
8. Content stress matrix.
9. Navigation and interaction flows.
10. Accessibility sequence.
11. Source route mappings.
12. Product representations.
13. Known gaps and decision questions.
14. Conformance/rollback/migration.

## 12. Archetype lifecycle evidence

At `PAGE_ARCHETYPE_CANDIDATE`, require:

```yaml
accepted_component_contract_refs:
accepted_pattern_candidate_refs:
semantic_region_contract:
composition_schema:
page_state_registry:
responsive_specimens:
fixture_set:
source_route_mapping:
candidate_penpot_binding:
candidate_code_route:
accessibility_plan:
review_packet:
```

At `PRODUCT_REPRESENTATIONS`, require multiple exact contexts where applicable, not one ideal screen.

At visual audit/corrections, compare:

```text
contract
↔ Penpot candidate
↔ generated preview route
↔ source/runtime evidence
```

Promotion remains family-and-archetype bounded.

## 13. Page constructor vs archetype

```text
block schema:
  can this block render?

archetype schema:
  should this resource appear here, in this order/state/context?

product representation:
  does this exact route/data satisfy the archetype?
```

LoveKGD may later materialize archetypes from JSON/IR, but free composition is never the acceptance model.

## 14. Decision: component, pattern or archetype?

### Component when

- bounded semantic control/content unit;
- stable anatomy;
- independently reusable;
- owns one interaction boundary;
- variants preserve identity.

### Pattern when

- repeatable composition of multiple components;
- behavior/spacing/relationships recur;
- meaningful below page level;
- page-independent enough to reuse.

### Archetype when

- owns page-level information architecture;
- coordinates multiple patterns/regions;
- has page states and navigation;
- maps to a route class/job.

### Product representation when

- exact route/context/data;
- may include product-only domain resolution;
- proves use but does not redefine canonical component internals.

## 15. Anti-patterns

- naming archetype by viewport (`Mobile page`);
- one archetype per route without recurrence analysis;
- one universal page with dozens of boolean regions;
- accepting a screenshot as responsive contract;
- using local spacing to patch missing pattern rules;
- detached accepted components;
- page-level state hidden inside child variants;
- product representation promoted as canonical archetype;
- template library without source/version compatibility;
- changing archetype while leaving consumers unversioned.

# Penpot product-design operating model

> **Status:** active operating contract.  
> **Updated:** 2026-08-25.

## Purpose

The product/design loop uses three separate visual contexts and one implementation/runtime loop:

```text
Product Atlas Git SoT
product problem / Job / journey / capability / outcome / UI gap
        ↓ typed foreign keys and exact context
Product Atlas Penpot file
reviewed spatial projection created through scoped MCP operations

UI Exploration
references / candidates / compositions / shortlist
        ↓ selected package
Resource Graph
foundations / components / patterns / archetypes / representations / evidence
        ↓ implementation package
Canonical Astro implementation
        ↓ browser/device tests
Runtime and reviewed product evidence
        ↓ Git finding / decision / readiness update
Product Atlas + Resource Graph projections
```

None of these contexts becomes a second backlog or product source of truth.

## Product Atlas

Canonical product meaning lives in:

```text
onedayonemasterpiece/events-bot-new/docs/product-model/atlas/v1/
```

It owns needs, Jobs, outcomes, journeys, capabilities, stories, operator work, acceptance, measurement questions, findings and decisions.

The design-system repository stores only foreign-key linkage and exact UI context in:

```text
catalog/product-atlas-ui-linkage-v1/
```

Product Atlas uses a separate Penpot file. It is materialized only through an explicit, scoped Penpot MCP task after target verification and ends with an exact read-back receipt in Git.

## UI Exploration

UI Exploration owns unfinished visual search:

- current archetype/runtime context;
- references and extracted claims;
- component/pattern candidates;
- page compositions and whole iterations;
- shortlist, selected, parked and rejected alternatives;
- implementation/runtime closure evidence.

It is not Resource Graph authority. Local/exploration resources remain candidates until the normative family lifecycle accepts them.

The current UI Exploration target remains defined by `contracts/ui-exploration-target.v1.json` and its read-back receipts. A missing project ID remains null rather than an invented value.

## Resource Graph

Resource Graph owns mature system representation:

- foundations and brand resources;
- native components and variants;
- composite patterns;
- page archetypes;
- real product representations;
- state matrices and flow links;
- coverage/fragmentation;
- promotion packages;
- runtime and visual evidence;
- accepted exports and test references.

Resource Graph is not a brainstorm canvas and does not receive product dashboards.

## Composition, archetype and representation

```text
page composition
= one concrete explored assembly

page archetype
= reusable route/page-family semantic contract

product representation
= configured screen state of one archetype using native instances
```

An archetype may have desktop/mobile, anonymous/authorized, loading/error/recovery, media and lifecycle representations. A detached screen or source-requirements overlay is not an accepted archetype.

## Product linkage

Generic component masters do not need one Job. Product meaning may belong to a configured instance, pattern, archetype region or ProductScreenState.

Minimum UI-side record:

```yaml
product_links:
  product_entity_ids: []
  acceptance_scenario_ids: []
  measurement_question_ids: []
  route_or_route_pattern: ...
  archetype_id: ...
  semantic_region_id: ...
  pattern_id: ...
  component_id: ...
  product_screen_state_ids: []
  native_binding: binding_pending
  relation_status: proven | partial | unresolved | not_modeled | not_applicable
```

This repository never copies product definitions or decisions. Until an actual MCP read-back exists, native Product Atlas binding remains `binding_pending`.

## UI-improvement lifecycle

```text
comment or runtime evidence
→ file-level deduplicated review
→ exact resource/screen/flow association
→ reproduced gap
→ understood cause
→ bounded candidates
→ impact report
→ owner acceptance or rejection
→ implementation handoff
→ runtime verification
→ promotion or rollback
→ explicit comment resolution and gap closure
```

A mutation, resolved comment or completed handoff does not by itself advance family authority.

## Comment behavior

Comment ingestion is file-scoped first and resource/page-scoped second. The same thread may appear during page traversal; stable thread ID is the primary dedupe key. Current open page does not replace the origin page, and ambiguous spatial association remains explicit.

Product Atlas comments may propose analysis work, but they do not directly write the product model. The resulting reviewed analysis/finding/decision is committed in `events-bot-new` first.

## MCP operation model

```text
patch
  bounded property/content change inside one verified wrapper

reflow-zone
  deterministic layout of managed siblings in one verified zone

rematerialize-page
  rebuild one page/major section when topology changed

rebuild-file
  exceptional schema migration only
```

Before every MCP write:

1. read exact file/page/revision;
2. verify target kind and source/model locks;
3. build a dry-run and impact scope;
4. create rollback evidence for non-trivial work;
5. preserve comments and foreign objects;
6. limit mutation to the selected zone/page;
7. check overlap, clipping, off-canvas content and minimum gaps;
8. read back changed identities and relations;
9. write a Git receipt;
10. leave result candidate until explicit acceptance.

A workspace link is not proof that MCP switched context. Parallel mutation across different files is forbidden without an explicit verified target for each operation.

## GitHub Actions and MCP

```text
GitHub Actions
  deterministic validation, generated artifacts and drift gates

Penpot MCP
  interactive scoped materialization, inspection, comments and read-back
```

Both use the same Git IDs, source locks and semantic contracts. There is no automatic/background Product Atlas synchronization and no mutation on connection/open.

## Baseline policy

```text
accepted Penpot specimen/export
→ immutable reference identity

Astro/runtime actual
→ screenshot + functional/interaction/accessibility evidence
```

Runtime actual never replaces an accepted baseline automatically. Pixel similarity is supporting evidence, not proof of semantics, accessibility, behavior or outcome.

## Evidence boundary

Product Atlas Penpot receives only reviewed Git entities and immutable reviewed evidence packages. It does not read production DBs or raw analytics.

```text
MeasurementQuestion
→ evidence
→ finding
→ decision
→ follow-up
```

A hotspot, visual overlay or runtime symptom cannot create a finding, UI gap or component promotion automatically.

## Current delivery boundary

The Product Atlas Git SoT and 17-archetype UI projection can be reviewed before Penpot materialization. Penpot work starts only after the exact target and entry gate are verified. This branch performs zero Penpot reads and writes.
# Product Atlas UI linkage v1

> **Status:** thin foreign-key projection candidate.  
> **Base UI SoT:** PR #50 head `9b8043f3bdb86fab4eee00bf94b0f10d4f029c50`.  
> **Product authority:** `onedayonemasterpiece/events-bot-new`.  
> **Penpot mutations:** `0`.

## Purpose

This catalog links the corrected semantic UI SoT to the canonical Product Atlas Git model without creating a second product model in the design-system repository.

```text
product entity foreign key
↔ route/archetype context
↔ semantic region
↔ pattern
↔ configured component instance or runtime boundary
↔ ProductScreenState
↔ acceptance scenario foreign key
↔ measurement question foreign key
```

## Authority boundary

This repository owns only:

- UI foundations;
- components and compositions;
- patterns;
- the 17 corrected archetype contracts;
- ProductScreenStates;
- future Astro/Penpot native bindings;
- visual/runtime conformance evidence.

It does **not** own or duplicate definitions of user needs, Jobs, outcomes, journeys, capabilities, stories, measurement questions, findings or decisions. Those definitions live exclusively in:

```text
onedayonemasterpiece/events-bot-new/docs/product-model/atlas/v1/
```

## Files

| File | Responsibility |
|---|---|
| `source-lock.v1.json` | exact product and corrected UI source revisions |
| `product-links.v1.json` | thin 17-archetype foreign-key projection and exact UI context |
| `binding-placeholders.v1.json` | typed unpublished binding ledger; no assumed UUIDs |
| `../../tests/product-atlas-ui-linkage-v1.test.mjs` | fail-closed projection validation |

## Product definition rule

A record may contain:

- product entity IDs;
- acceptance/measurement IDs;
- exact route/archetype/region/pattern/component/state context;
- relation status;
- source and product-registry references;
- unresolved linkage notes.

It may not copy product titles, definitions, confidence rationales, outcome targets, findings text or decisions from `events-bot-new`.

## Binding rule

Until an explicit Product Atlas Penpot MCP task has completed exact read-back, every native binding is:

```text
binding_pending
```

Invented file/page/board/shape IDs are forbidden. Coordinates, display text, CSS selectors and local unpublished Penpot links are not stable identity.

## Plugin supersession

The Product Atlas plugin, plugin manifest, plugin namespace and prototype are removed from the active tree by this branch. Git history remains the archive of that experiment.

The supported future path is:

```text
reviewed Product Atlas Git SoT
→ explicit scoped Penpot MCP materialization
→ exact MCP read-back
→ versioned Git receipt
```

No Penpot connection or mutation is performed by this catalog.
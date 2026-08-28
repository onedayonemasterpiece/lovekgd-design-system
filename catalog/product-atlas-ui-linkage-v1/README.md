# Product Atlas UI linkage v1

> **Status:** recovered thin foreign-key projection candidate.  
> **Base AS-IS UI handoff:** PR #52 head `b86bab3e91511b3d4bd7d953b22bceb847f02a51`.  
> **Active owner-review delta:** PR #53 head `47d0fef53c33200492d92f6a086d9b8813fe187e`.  
> **Product authority:** `onedayonemasterpiece/events-bot-new` PR #574.  
> **Penpot reads/writes:** `0 / 0`.

## Purpose

This catalog links the stable AS-IS semantic UI handoff and active review layers to the canonical Product Atlas Git model without creating a second product model in the design-system repository.

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

Product visualization may proceed in parallel with unfinished component normalization. The projection keeps authority layers explicit instead of pretending that one UI head proves every state:

```text
accepted product meaning
+ source-proven AS-IS UI baseline
+ active owner-review delta
+ active Astro candidate
+ product hypotheses
+ unresolved evidence/bindings
```

## Authority boundary

This repository owns only:

- UI foundations;
- components and compositions;
- patterns;
- the 17 corrected archetype identities;
- ProductScreenStates;
- source-proven AS-IS UI handoff;
- owner-review and implementation-candidate context;
- future native bindings and visual/runtime conformance evidence.

It does **not** own or duplicate definitions of user needs, Jobs, outcomes, journeys, capabilities, stories, measurement questions, findings or decisions. Those definitions live exclusively in:

```text
onedayonemasterpiece/events-bot-new/docs/product-model/atlas/v1/
```

## Effective UI layers

1. `lovekgd-design-system#50@9b8043f3bdb86fab4eee00bf94b0f10d4f029c50` — corrected semantic origin.
2. `#52@b86bab3e91511b3d4bd7d953b22bceb847f02a51` — source-proven AS-IS round-trip handoff:
   - 17 archetypes;
   - 34 desktop/mobile boards;
   - 97 regions;
   - 97 patterns;
   - 75 component identities;
   - 180 ProductScreenStates;
   - zero orphan design IDs.
3. `#53@47d0fef53c33200492d92f6a086d9b8813fe187e` — active owner-review delta with items that may be `READY_FOR_OWNER_REREVIEW` while still `processed: NO`.
4. `events-bot-new#596@49c351873d40a2ea55f0a32837c7376e344d9c17` — active unmerged Astro/UI candidate.
5. `events-bot-new#587@f78e7c5974b4192bddf9eea901ee6d8b57f51560` — research-only product hypotheses.

AS-IS linkage readiness is not owner acceptance, component promotion, deployment or product outcome evidence.

## Files

| File | Responsibility |
|---|---|
| `source-lock.v1.json` | stable v1 product/corrected-semantic linkage lock |
| `current-source-lock.2026-08-28.v2.json` | current product head, AS-IS handoff, owner-review/Astro deltas and separate-account target boundary |
| `product-links.v1.json` | thin 17-archetype stable foreign-key projection and exact UI context |
| `binding-placeholders.v1.json` | stable archetype binding ledger; no assumed UUIDs |
| `recovery-overlay.2026-08-28.v2.json` | active product problem/UI-gap and authority-layer overlay for all 17 archetypes |
| `visualization-binding-placeholders.2026-08-28.v1.json` | six future Product Atlas view bindings, all null and `binding_pending` |
| `scripts/validate-product-atlas-ui-linkage-v1.mjs` | stable v1 foreign-key validation |
| `scripts/validate-product-atlas-ui-recovery-20260828.mjs` | current cross-repository recovery and separate-account validation |

## Product definition rule

A record may contain:

- product entity IDs;
- acceptance/measurement IDs;
- exact route/archetype/region/pattern/component/state context;
- authority layer and relation status;
- source and product-registry references;
- unresolved linkage notes.

It may not copy product titles, definitions, confidence rationales, outcome targets, findings text or decisions from `events-bot-new`.

## Separate Penpot account/file

The future Product Atlas target is intentionally different from the design-system Penpot account/file.

Until an explicit Product Atlas Penpot MCP task has read the target and completed exact read-back, all target fields remain:

```text
account = null
team_id = null
file_id = null
page/board/object IDs = []
binding_status = binding_pending
```

Existing design-system Penpot IDs are evidence only and are not reusable target bindings. Coordinates, display text, CSS selectors and unpublished links are not stable identity.

## Plugin supersession

The Product Atlas plugin, plugin manifest, plugin namespace and prototype are removed from the active tree by this branch. Git history remains the archive of that experiment.

The supported future path is:

```text
reviewed Product Atlas Git SoT
→ fresh-read a separate Product Atlas target through Penpot MCP
→ bounded materialization of the declared views
→ exact MCP read-back
→ versioned Git receipt
→ owner review
```

No Penpot connection or mutation is performed by this recovery.

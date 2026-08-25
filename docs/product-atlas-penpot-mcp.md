# Product Atlas: Penpot MCP materialization

> **Status:** active delivery contract.  
> **Date:** 2026-08-25.  
> **Product authority:** `onedayonemasterpiece/events-bot-new/docs/product-model/atlas/v1/`.  
> **UI authority:** corrected semantic UI SoT in `catalog/global-archetype-sot-v1/`.

## Decision

Product Atlas is a separate Penpot file projected from the reviewed Product Atlas Git SoT. Materialization and reconciliation use explicit, scoped Penpot MCP operations.

```text
reviewed Product Atlas Git SoT
+ corrected UI foreign-key projection
+ accepted foundation snapshot
→ exact Product Atlas file/page read through MCP
→ bounded dry-run plan
→ scoped mutation
→ read-back
→ Git receipt
→ owner review
```

The Git model remains the source of product truth. Penpot is a reviewed spatial projection, not a second product model.

## Repository boundary

`events-bot-new` owns:

- needs, Jobs, Job Stories and outcomes;
- journeys, capabilities, stories and operator work;
- acceptance and measurement questions;
- findings, decisions and evidence facets.

`lovekgd-design-system` owns:

- foundations, components, patterns and archetypes;
- ProductScreenStates;
- exact route/archetype/region/component context;
- native UI bindings and conformance evidence.

The design-system projection stores only product foreign keys and UI context. It never copies product definitions.

## Separate file boundary

Product Atlas is not placed in Resource Graph or UI Exploration. It uses a separate Penpot file. Before any write, MCP must read and verify the exact target file and page.

A workspace link does not switch or prove MCP context. No operation may assume that the file visible to the human is the current MCP target.

## Entry gate

MCP materialization is allowed only when:

1. the exact Product Atlas Git revision is accepted for the requested scope;
2. product source and corrected UI locks validate;
3. the requested product/UI foreign keys resolve;
4. the target Product Atlas file and page are read through MCP;
5. a bounded dry-run identifies changed and preserved objects;
6. comments and unrelated objects have a preservation rule;
7. rollback and read-back checks are defined;
8. unresolved native bindings remain `binding_pending`.

## Operation modes

```text
create
  materialize entities that have no read-back binding

reconcile
  update an existing managed projection while preserving stable identity

patch
  change bounded properties/content inside one verified wrapper

rematerialize-page
  rebuild one page only when topology changed and patch/reconcile is unsafe
```

A whole-file rebuild is an exceptional schema migration, not a routine update.

## Stable identity

Git identity:

```text
product entity ID
+ product model revision
+ UI linkage ID
+ archetype/region/state context
```

Penpot identity becomes valid only after read-back and a Git receipt. Before that, the only valid value is:

```text
binding_pending
```

Coordinates, visible text, layer names, CSS selectors and assumed UUIDs are not stable identity.

## Write protocol

Every write operation must:

1. read exact file/page/revision;
2. verify Product Atlas file kind or an explicitly accepted empty target;
3. validate source locks and entity foreign keys;
4. produce a dry-run plan and impact scope;
5. create a rollback point for a non-trivial operation;
6. mutate only the verified page/zone;
7. preserve comments and foreign objects;
8. check overlap, clipping, off-canvas content and minimum gaps;
9. read back all changed entities and relations;
10. write a versioned Git receipt;
11. leave the result candidate until owner acceptance.

## Evidence and analytics boundary

MCP reads only the reviewed Git model and reviewed immutable evidence packages. It does not read production databases, raw analytics, raw action-map summaries or private user data.

An action-map hotspot cannot create a Product Atlas finding by itself. The accepted chain remains:

```text
MeasurementQuestion
→ reviewed evidence
→ finding
→ decision
→ follow-up
```

## Required receipt

```yaml
receipt_schema_version: product-atlas-mcp-receipt.v1
product_model_sha: ...
product_source_lock_sha256: ...
ui_sot_sha: ...
ui_manifest_sha256: ...
operation_scope:
  file_id: ...
  page_ids: []
  entity_ids: []
operation:
  mode: create | reconcile | patch | rematerialize-page
  dry_run_hash: ...
read_back:
  completed: true
  object_ids: []
  relation_count: 0
  pending_binding_ids: []
comments:
  preserved: true
  unresolved_thread_ids: []
review:
  status: candidate | accepted | rejected
  reviewer: ...
```

File/page/object IDs are filled only from the actual MCP read-back.

## Prohibited behavior

- automatic/background synchronization;
- write on connection/open;
- wrong-file fallback;
- guessed Penpot IDs;
- raw DB/analytics access;
- cross-file mutation in one unverified operation;
- automatic comment resolution;
- automatic promotion from candidate to accepted;
- declaring completion without read-back.

## Current state

The Git-only Product Atlas v1 and the 17-archetype UI foreign-key projection may be reviewed independently of Penpot. This task performs zero Penpot reads and writes. Native Product Atlas bindings remain `binding_pending` until a later explicit MCP task.
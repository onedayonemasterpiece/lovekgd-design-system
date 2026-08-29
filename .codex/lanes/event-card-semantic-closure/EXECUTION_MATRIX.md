# EventCard semantic closure — execution matrix

## Requirements

| ID | Requirement | Primary lane | Dependencies | Done when |
|---|---|---|---|---|
| R01 | Census all production event type/category values from the real DB and actual Astro resolver | production-census | none | schema-first queries, counts, aliases and renderer paths are recorded |
| R02 | Correct admission/price semantics; arbitrary amount/currency; remove obsolete `Условия уточняются` | events-runtime | R01 | adapters/contracts/tests reject the obsolete display state and do not enumerate literal prices |
| R03 | Model CTA and social-proof as semantic components with owned counts | design-contract | R01 | semantic identities/states/count ownership are explicit and tested |
| R04 | Update the proposed execution-sequence documentation | execution-doc | R01-R03 | owner decisions replace stale derived guidance and validations pass |
| R05 | Reconcile bounded native Penpot masters and linked instances | penpot-materialization | R03-R04 integration | stable-ID read-back, no detached copies, idempotent second run, bounded boards |
| R06 | Re-run same-fixture Astro ↔ Penpot conformance and owner-review evidence | conformance-integrator | R02-R05 | exact tuple passes identity gates and comparison evidence is reviewable |

## Dependency graph

`R01 -> {R02, R03, R04} -> integration -> R05 -> R06 -> closure audit`

## Lane map

```yaml
mode: worktree_worker_then_serial_integrator
repo:
  - onedayonemasterpiece/lovekgd-design-system
  - onedayonemasterpiece/events-bot-new
base_ref:
  design: 7a26772828a5d74a9683c08e7e6774ff15ac61a5
  events: 8ac67d6110870accf2d8b8295e0a9d83ef5ac87e
integration_branch: integration/event-card-semantic-closure-20260822
global_constraints:
  - no production UI mutation, deploy, promotion, or Penpot comment resolution
  - owner decisions outrank derived docs
  - one semantic component must not be multiplied per literal type or price
  - Penpot writes stay bounded and follow stable-ID/idempotency rules
verification_owner: root integrator plus independent audit_reconcile reviewer
stop_conditions:
  - production schema or renderer cannot be verified
  - Penpot disconnects twice or write outcome is unknown after 504
  - exact same-fixture identity tuple cannot be established
lanes:
  - id: production-census
    role: planner
    requirement_ids: [R01]
    target: production Fly DB plus exact Astro resolver
    execution_mode: parallel
    writable_files: []
    expected_output: exact schema-first census and taxonomy input
    verification_scope: inspection_only
    effort: medium
  - id: events-runtime
    role: worker
    requirement_ids: [R02]
    target: events-bot-new
    depends_on: [production-census]
    execution_mode: serial_after_dependency
    branch: agent/event-card-semantic-closure/events-runtime
    worktree: /home/dev/.codex/worktrees/events-bot-new/event-card-semantic-runtime
    writable_files: conformance adapters, fixtures, tests, canonical feature docs, CHANGELOG
    forbidden_files: production UI implementation and deployment config
    verification_scope: full_local
    effort: high
  - id: design-contract
    role: worker
    requirement_ids: [R03]
    target: lovekgd-design-system
    depends_on: [production-census]
    execution_mode: serial_after_dependency
    branch: agent/event-card-semantic-closure/design-contract
    worktree: /home/dev/.codex/worktrees/lovekgd-design-system/event-card-semantic-contract
    writable_files: EventCard/action/meta contracts, schemas, tests, execution docs
    forbidden_files: Penpot runtime state, events-bot-new, promotion ledgers
    verification_scope: full_local
    effort: high
  - id: execution-doc
    role: worker
    requirement_ids: [R04]
    target: lovekgd-design-system documentation branch
    depends_on: [production-census]
    execution_mode: serial_after_dependency
    branch: agent/event-card-semantic-closure/execution-doc
    worktree: /home/dev/.codex/worktrees/lovekgd-design-system/event-card-semantic-execution-doc
    writable_files: docs/design-system-execution-sequence.md and its targeted validation only
    forbidden_files: contracts, Penpot state, events-bot-new, unrelated docs
    verification_scope: targeted
    effort: high
  - id: penpot-materialization
    role: worker
    requirement_ids: [R05]
    target: connected canonical Penpot candidate file
    depends_on: [design-contract]
    execution_mode: serial_after_dependency
    writable_files: bounded native masters and linked specimens only
    forbidden_files: comments, promotion state, unrelated pages, giant review boards
    verification_scope: full_local
    effort: high
  - id: conformance-integrator
    role: merge_reviewer
    requirement_ids: [R06]
    target: both integration worktrees and bounded evidence storage
    depends_on: [events-runtime, design-contract, penpot-materialization]
    execution_mode: serial_after_dependency
    branch: integration/event-card-semantic-closure-20260822
    verification_scope: full_local
    effort: high
```

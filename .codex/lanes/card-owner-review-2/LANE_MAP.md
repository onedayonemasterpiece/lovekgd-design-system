# Card owner re-review 2 lane map — 2026-08-20

```yaml
mode: read_only_parallel_then_serial_integrator
repo: onedayonemasterpiece/lovekgd-design-system
base_ref: b135331c1acaaa58c1eec6fddb5b29ffc63d4fbc
base_branch: integration/card-systemic-audit-20260820
integration_branch: integration/card-owner-review-2-20260820
global_constraints:
  - inspect all owner threads 96-125 before proposing fixes
  - root-cause and Astro evidence before SoT decisions
  - Git SoT decision commit precedes every Penpot write
  - only root writes Penpot; no overlapping plugin mutations
  - candidate/noncanonical state; no reverse Astro or production mutation
  - export and visually inspect representative corrected shapes
verification_owner: root
stop_conditions:
  - two consecutive Penpot disconnects
  - a requested state contradicts pinned Astro and needs an owner product decision
  - target comment cannot be bound to a page/component with evidence
lanes:
  - id: L1-comment-inventory
    role: planner
    requirement_ids: [R096-R125]
    target: exact deduplicated thread text, page/board/shape mapping and thematic clusters
    depends_on: []
    execution_mode: parallel_read_only
    branch: none
    worktree: Penpot file 3be9e5e1-190f-8090-8008-713c0fbe6260
    writable_files: []
    forbidden_files: [all]
    expected_output: exact 30-thread ledger with target confidence
    verification_scope: inspection_only
    effort: high
    status: planned
  - id: L2-large-primitives-audit
    role: planner
    requirement_ids: [R096-R110]
    target: EventCard Large, shared primitives, chips, calendar, skeleton, light/dark visual rules
    depends_on: []
    execution_mode: parallel_read_only
    branch: none
    worktree: /home/dev/projects/events-bot-new
    writable_files: []
    forbidden_files: [all]
    expected_output: pinned Astro evidence and exact corrective contract
    verification_scope: inspection_only
    effort: high
    status: planned
  - id: L3-listing-rail-audit
    role: planner
    requirement_ids: [R111-R123]
    target: ListingEventCard, rail, hide/restore, placement rules, state coverage, medallions and sizing
    depends_on: []
    execution_mode: parallel_read_only
    branch: none
    worktree: /home/dev/projects/events-bot-new
    writable_files: []
    forbidden_files: [all]
    expected_output: source-backed state/composition matrix
    verification_scope: inspection_only
    effort: high
    status: planned
  - id: L4-festival-page-architecture-audit
    role: planner
    requirement_ids: [R124-R125]
    target: Festival page purpose, duplicate-page suspicion, component composition and chip variants
    depends_on: []
    execution_mode: parallel_read_only
    branch: none
    worktree: Git SoT plus pinned Astro
    writable_files: []
    forbidden_files: [all]
    expected_output: page disposition and exact component gaps
    verification_scope: inspection_only
    effort: high
    status: planned
  - id: L5-sot-integration
    role: worker
    requirement_ids: [R096-R125]
    target: superseding owner-review contract, validator and comment ledger
    depends_on: [L1-comment-inventory, L2-large-primitives-audit, L3-listing-rail-audit, L4-festival-page-architecture-audit]
    execution_mode: serial_after_dependency
    branch: integration/card-owner-review-2-20260820
    worktree: /home/dev/.codex/worktrees/lovekgd-design-system/card-systemic-audit-int
    writable_files: [docs/normalization/**, catalog/normalization/**, scripts/**, receipts/penpot/**, .codex/lanes/card-owner-review-2/**, .codex/integration/**]
    forbidden_files: [events-bot-new/**]
    expected_output: committed Git SoT decision before Penpot mutation
    verification_scope: targeted
    effort: extra-high
    status: planned
  - id: L6-penpot-materialization
    role: worker
    requirement_ids: [R096-R125]
    target: bounded native corrections, state matrices, visual exports and replies
    depends_on: [L5-sot-integration]
    execution_mode: serial_after_dependency
    branch: external-state
    worktree: Penpot file 3be9e5e1-190f-8090-8008-713c0fbe6260
    writable_files: []
    forbidden_files: [Astro consumer]
    expected_output: saved versions, exact read-back, exports, idempotency and comment replies
    verification_scope: full_local
    effort: extra-high
    status: planned
  - id: L7-closure-review
    role: merge_reviewer
    requirement_ids: [R096-R125]
    target: final diff, Penpot read-back and review links
    depends_on: [L5-sot-integration, L6-penpot-materialization]
    execution_mode: serial_after_dependency
    branch: integration/card-owner-review-2-20260820
    worktree: /home/dev/.codex/worktrees/lovekgd-design-system/card-systemic-audit-int
    writable_files: []
    forbidden_files: [all]
    expected_output: requirement-by-requirement closure table
    verification_scope: full_local
    effort: high
    status: planned
```

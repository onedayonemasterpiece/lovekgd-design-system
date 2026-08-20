# Card systemic audit lane map — 2026-08-20

```yaml
mode: read_only_parallel_then_serial_integrator
repo: onedayonemasterpiece/lovekgd-design-system
base_ref: 04afe27f208596c33e0b6ce9f78d0561108ff93c
base_branch: design/event-card-taxonomy-candidate-v1-20260818
integration_branch: integration/card-systemic-audit-20260820
global_constraints:
  - Git SoT decisions precede Penpot writes
  - no Astro reverse integration or production mutation
  - Penpot candidate/noncanonical state preserved
  - no detached copies; all reusable resources native and linked
verification_owner: root
stop_conditions:
  - Penpot disconnect twice
  - comment identity or target page cannot be proven
  - owner decision required for a semantic boundary not evidenced by Astro
lanes:
  - id: L1-comments-penpot-inventory
    role: planner
    requirement_ids: [R01, R06, R07, R08]
    target: new comments and current Penpot structures on card pages including 40.2
    depends_on: []
    execution_mode: parallel_read_only
    branch: none
    worktree: shared-read-only
    writable_files: []
    forbidden_files: [all]
    expected_output: deduplicated comments plus exact page/board/component IDs and defects
    verification_scope: inspection_only
    effort: high
    status: committed
  - id: L2-astro-semantic-contracts
    role: planner
    requirement_ids: [R02, R03, R04, R05, R07, R08]
    target: pinned Astro component/content/action/rail contracts
    depends_on: []
    execution_mode: parallel_read_only
    branch: none
    worktree: /home/dev/projects/events-bot-new
    writable_files: []
    forbidden_files: [all]
    expected_output: evidence-backed reusable primitive matrix and runtime axes
    verification_scope: inspection_only
    effort: high
    status: committed
  - id: L3-sot-gap-audit
    role: planner
    requirement_ids: [R02, R03, R04, R05, R06, R08, R09]
    target: current Git SoT contracts, receipts, naming and missing bindings
    depends_on: []
    execution_mode: parallel_read_only
    branch: none
    worktree: /home/dev/.codex/worktrees/lovekgd-design-system/card-systemic-audit-int
    writable_files: []
    forbidden_files: [all]
    expected_output: exact contract gaps and proposed bounded corrective IR
    verification_scope: inspection_only
    effort: high
    status: committed
  - id: L4-sot-integration
    role: worker
    requirement_ids: [R01, R02, R03, R04, R05, R06, R07, R08, R09]
    target: systemic audit contract and Penpot materialization receipt
    depends_on: [L1-comments-penpot-inventory, L2-astro-semantic-contracts, L3-sot-gap-audit]
    execution_mode: serial_after_dependency
    branch: integration/card-systemic-audit-20260820
    worktree: /home/dev/.codex/worktrees/lovekgd-design-system/card-systemic-audit-int
    writable_files: [docs/normalization/**, catalog/normalization/**, receipts/penpot/**, scripts/validate-event-card-systemic-boundaries-v1.py, docs/index.md, .codex/lanes/card-systemic-audit/**, .codex/integration/**]
    forbidden_files: [events-bot-new/**]
    expected_output: committed Git SoT-first correction and receipt
    verification_scope: targeted
    effort: extra-high
    status: committed
  - id: L5-penpot-materialization
    role: worker
    requirement_ids: [R01, R02, R03, R04, R05, R06, R07, R08, R09]
    target: native Penpot components, semantic naming, all card consumers, and 40.2 rail layout
    depends_on: [L4-sot-integration]
    execution_mode: serial_after_dependency
    branch: external-state
    worktree: Penpot file 3be9e5e1-190f-8090-8008-713c0fbe6260
    writable_files: []
    forbidden_files: [Astro consumer]
    expected_output: saved versions, read-back IDs, exports, comment replies
    verification_scope: full_local
    effort: extra-high
    status: committed
  - id: L6-closure-review
    role: merge_reviewer
    requirement_ids: [R01, R02, R03, R04, R05, R06, R07, R08, R09]
    target: final diff, Penpot read-back and ordered review links
    depends_on: [L4-sot-integration, L5-penpot-materialization]
    execution_mode: serial_after_dependency
    branch: integration/card-systemic-audit-20260820
    worktree: /home/dev/.codex/worktrees/lovekgd-design-system/card-systemic-audit-int
    writable_files: []
    forbidden_files: [all]
    expected_output: requirement-by-requirement closure table
    verification_scope: full_local
    effort: high
    status: committed
```

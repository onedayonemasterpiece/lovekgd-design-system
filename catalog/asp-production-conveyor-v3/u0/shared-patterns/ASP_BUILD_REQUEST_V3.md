<!-- ASP_BUILD_REQUEST_V3 -->
## ASP_BUILD_REQUEST_V3 — U-SHARED-PATTERNS native successor

```yaml
schema_version: kenigevents.asp-build-request.v3
request_id: U-SHARED-PATTERNS-NATIVE-R2
directive_id: RD-U0-U-SHARED-PATTERNS
directive_source: issue-57-comment-5499373802
from: U0
to: D0/QA,D0/INTEGRATE
state: NATIVE_SUCCESSOR_READY_QA_INTEGRATE_ATLAS_GATED
exact_base:
  branch: u0/shared-patterns-r1-20260901
  head: 9bde6ed4c3338cd3487f828c2aea27e22e274299
  tree: 02d9d78b44182f3615e2e2e974683d84d8ce57c6
package_id: U-SHARED-PATTERNS
successor_id: U-SHARED-PATTERNS-NATIVE-R2
successor_path: catalog/asp-production-conveyor-v3/u0/shared-patterns/U-SHARED-PATTERNS.native-successor.v2.json
native_contract_path: catalog/asp-production-conveyor-v3/u0/shared-patterns/native-product-contract.v2.json
executor_path: scripts/asp-production-conveyor-v3/u0/shared-patterns/native_executor_v2.js
runtime_path: scripts/asp-production-conveyor-v3/u0/shared-patterns/native_runtime_v2.js
setup_path: scripts/asp-production-conveyor-v3/u0/shared-patterns/setup_v2.js
tests:
  - tests/asp-production-conveyor-v3/u0/shared-patterns/test_native_executor_v2.js
  - tests/asp-production-conveyor-v3/u0/shared-patterns/test_repository_invariants_v2.py
native_units:
  - rails
  - shelves
  - headers
  - search/control-bars
  - content-groupings
  - row/group-composition
native_census:
  pages: 6
  roots: 6
  component_masters: 7
  linked_visible_specimens: 22
replay:
  actual_native_like_runs: 2
  first_run_created: 150
  second_run_created: 0
integrity:
  duplicates: 0
  detached: 0
  screenshots: 0
  protected_projection_changes: 0
  exact_source_consumer_lineage: true
  shared_plugin_data: string-only
atlas_extension_request:
  path: catalog/asp-production-conveyor-v3/u0/shared-patterns/ASP_ATLAS_EXTENSION_REQUEST_V1.md
  git_blob_sha1: 4eb5d0b9c87100c9811001bcb776d865efa61f00
  preserved_unchanged: true
  page_order_assigned_by_u0: false
status: ATLAS_EXTENSION_PENDING
real_penpot_gates:
  o0_atlas_extension_binding: PENDING
  action_nav_v0_closure: PENDING
native_like_test_execution_authorized: true
real_penpot_execution_authorized: false
penpot_execution_authorized: false
publish_authorized: false
penpot_reads: 0
penpot_mutations: 0
atlas_r2_mutations: 0
kaggle_used: false
```

`QA`/`INTEGRATE` validates executable Git bytes only. It does not authorize a
Penpot mutation or PUBLISH. O0 must bind the preserved extension request and
ActionNav must close its V0 evidence gate before any later real execution lease
can be considered.

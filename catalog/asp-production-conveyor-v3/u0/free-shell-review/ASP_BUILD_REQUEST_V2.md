<!-- ASP_BUILD_REQUEST_V2 -->
## ASP_BUILD_REQUEST_V2 — U-FREE-SHELL-REVIEW-PAGE-R1

```yaml
schema_version: kenigevents.asp-build-request.v2
request_id: U-FREE-SHELL-REVIEW-PAGE-R1-MAT-R1
from: U0
to: D0/QA,D0/INTEGRATE
state: MAT_PACKAGE_READY_QA_INTEGRATE_GATED
remote:
  branch: u0/free-shell-review-page-r1-20260901
  head: __REMOTE_HEAD__
  tree: __REMOTE_TREE__
  parent: e3c8d3f8f3a7d45f5c3399be8c63e617c40b8b21
package_id: U-FREE-SHELL-REVIEW-PAGE-R1
package_path: catalog/asp-production-conveyor-v3/u0/free-shell-review/U-FREE-SHELL-REVIEW-PAGE-R1.package.v1.json
executor_path: scripts/asp-production-conveyor-v3/u0/free-shell-review/native_executor_v1.js
setup_path: scripts/asp-production-conveyor-v3/u0/free-shell-review/setup_v1.js
tests:
  - tests/asp-production-conveyor-v3/u0/free-shell-review/test_native_executor_v1.js
  - tests/asp-production-conveyor-v3/u0/free-shell-review/test_repository_invariants_v1.py
target:
  file_id: 40e06342-8830-80d6-8008-8fc8a3a4cd4f
  page_name: 07 · Free collection · Shell states · Candidate
  root_name: CANDIDATE_BUILD_NOT_ACCEPTED · U-FREE-SHELL-REVIEW-PAGE-R1
lease:
  owner: D0/PUBLISH
  state: ACTIVE_REQUIRED_AT_EXECUTION
next_gates: [D0/QA, D0/INTEGRATE]
atlas_extension_request: catalog/asp-production-conveyor-v3/u0/free-shell-review/ASP_ATLAS_EXTENSION_REQUEST_V1.md
penpot_execution_authorized: false
visual_acceptance: PENDING_V0
promotion_authorized: false
U0_penpot_reads: 0
U0_penpot_mutations: 0
```

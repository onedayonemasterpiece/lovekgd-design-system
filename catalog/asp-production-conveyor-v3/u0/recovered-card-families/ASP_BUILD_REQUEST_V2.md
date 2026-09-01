<!-- ASP_BUILD_REQUEST_V2 -->
## ASP_BUILD_REQUEST_V2 — U-RECOVERED-CARD-FAMILIES

```yaml
schema_version: kenigevents.asp-build-request.v2
request_id: U-RECOVERED-CARD-FAMILIES-MAT-R1
from: U0
to: D0/QA,D0/INTEGRATE
state: MAT_PACKAGE_READY_QA_INTEGRATE_GATED
remote:
  branch: u0/recovered-card-families-r1-20260901
  head: __REMOTE_HEAD__
  tree: __REMOTE_TREE__
  parent: e3c8d3f8f3a7d45f5c3399be8c63e617c40b8b21
package_id: U-RECOVERED-CARD-FAMILIES
families: [compact, festival, club, artifact, collection]
package_path: catalog/asp-production-conveyor-v3/u0/recovered-card-families/U-RECOVERED-CARD-FAMILIES.package.v1.json
executor_path: scripts/asp-production-conveyor-v3/u0/recovered-card-families/native_executor_v1.js
setup_path: scripts/asp-production-conveyor-v3/u0/recovered-card-families/setup_v1.js
tests:
  - tests/asp-production-conveyor-v3/u0/recovered-card-families/test_native_executor_v1.js
  - tests/asp-production-conveyor-v3/u0/recovered-card-families/test_repository_invariants_v1.py
target:
  file_id: 40e06342-8830-80d6-8008-8fc8a3a4cd4f
  section: 08 · Components · Recovered card families · Candidate
  page_units: 5
lease:
  owner: D0/PUBLISH
  state: ACTIVE_REQUIRED_AT_EXECUTION
next_gates: [D0/QA, D0/INTEGRATE]
atlas_extension_request: catalog/asp-production-conveyor-v3/u0/recovered-card-families/ASP_ATLAS_EXTENSION_REQUEST_V1.md
penpot_execution_authorized: false
visual_acceptance: PENDING_V0
promotion_authorized: false
U0_penpot_reads: 0
U0_penpot_mutations: 0
```

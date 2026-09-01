<!-- ASP_BUILD_REQUEST_V3 -->
## ASP_BUILD_REQUEST_V3 — U-FREE-SHELL-REVIEW-PAGE-R1 native successor R2

```yaml
schema_version: kenigevents.asp-build-request.v3
request_id: U-FREE-SHELL-REVIEW-PAGE-R1-NATIVE-R2
from: U0
lane: S3-FREE-SHELL
state: NATIVE_SUCCESSOR_READY_QA_INTEGRATE_ATLAS_EXTENSION_GATED
remote:
  branch: agent/d0-executable-buffer-v2/u0-free-shell-native-r2
  exact_base: e5ded37cd33f94db1033a9300b69fc91c203aa62
  head: PROVIDER_READBACK_REQUIRED
  tree: PROVIDER_READBACK_REQUIRED
package_id: U-FREE-SHELL-REVIEW-PAGE-R1
successor_package: catalog/asp-production-conveyor-v3/u0/free-shell-review/U-FREE-SHELL-REVIEW-PAGE-R1.package.v2.json
executor: scripts/asp-production-conveyor-v3/u0/free-shell-review/native_executor_v2.js
runtime: scripts/asp-production-conveyor-v3/u0/free-shell-review/native_runtime_v2.js
setup: scripts/asp-production-conveyor-v3/u0/free-shell-review/setup_v2.js
tests:
  - tests/asp-production-conveyor-v3/u0/free-shell-review/test_native_executor_v2.js
  - tests/asp-production-conveyor-v3/u0/free-shell-review/test_repository_invariants_v2.py
target:
  file_id: 40e06342-8830-80d6-8008-8fc8a3a4cd4f
  page_name: 07 · Free collection · Shell states · Candidate
  root_name: CANDIDATE_BUILD_NOT_ACCEPTED · U-FREE-SHELL-REVIEW-PAGE-R1
native_contract:
  page: concrete_native
  root: concrete_native
  component_masters: 7
  visible_specimens: 6
  linked_instances: 25
  exact_managed_nodes: 40
  source_binding: exact_role_path_git_blob_sha1
  source_style_binding: exact_selector_declarations_and_source_blob
  component_state_bindings: exact_no_fallback
  shared_plugin_data: strict_string_only
  second_run_created: 0
  duplicates: 0
  detached: 0
  screenshots: 0
  protected_projections_unchanged: true
  protected_projection_fields: [text, fills, strokes, plugin_data, component_library]
dependency_corrections:
  brandbook_tree: 29ad3ccf0628e448d0881007129981b9f766856f
  medallions_tree: 95ab14cbd64697910c871ccb1a7ca7428cf618bd
  collection_catalog:
    role: CollectionCatalog
    path: site/src/pages/podborki/index.astro
    git_blob_sha1: 1a3dc3e2fb6d1df644625d2f2578b3042b3406bb
  free_medallion_asset:
    git_blob_sha1: 3f6f7aadf0dc818112ab310875d8ad270c563b45
    bytes: 754
    sha256: 27cc37743a0212868f28edbf3b1f0b6ad5033241d93154b26501cb7538122b31
atlas_extension_request:
  path: catalog/asp-production-conveyor-v3/u0/free-shell-review/ASP_ATLAS_EXTENSION_REQUEST_V1.md
  git_blob_sha1: 2ad8f60cd717e36df1908c3bc7857ecbaa83d8cf
  preserved: true
atlas_page_order_assignment: O0_ONLY
status: ATLAS_EXTENSION_PENDING
penpot_execution_authorized: false
publish_authorized: false
penpot_reads_this_wave: 0
penpot_mutations_this_wave: 0
kaggle_calls: 0
```

`QA/INTEGRATE PASS` for this successor proves executable Git bytes and the
native-like in-memory replay only. It is not Penpot authorization and it does
not satisfy the pending O0 Atlas extension/V0 evidence gate.

### Repair-2 invariant

Execution evidence is invalid unless state-specific inner anatomy is material:
menu open/closed, current route/item, sticky/hidden medallions, responsive
medallion sizes, footer Grid and control Flex layouts must change exact native
children. Replay must compare the complete managed projection and recursively
reject an untagged detached component copy. Protected projection includes
opacity in addition to geometry/text/styles/plugin/component/layout data.

<!-- ASP_CONVEYOR_CHECKPOINT_V3 -->
## ASP_CONVEYOR_CHECKPOINT_V3 — U0 EventCard three repairs product-accepted for QA/INTEGRATE

```yaml
schema_version: kenigevents.asp-conveyor-checkpoint.v3
role: U0
state: U0_EVENTCARD_THREE_REPAIRS_REMOTE_READY
observed_at_utc: '2026-09-01T19:35:42Z'
durable_marker:
  comment_id: 5497775838
  state: THREE_EVENTCARD_REPAIRS_REMOTE_READY
  duplicate_lanes_created: 0
text_repair:
  package_id: MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR
  branch: agent/mat-eventcard-text-r11c-compatible-repair-20260901
  head: d4ef6db8a4e1583308556b384d95f45e61223872
  tree: c2e1b18d170cdccc580262c77fe7524c10f50df9
  acceptance: QA_INTEGRATE_GATED_PASS_WITH_EXECUTION_SEMANTICS_ADDENDUM
  affected_occurrence_ids: 4
  protected_text_offender_ids: 16
  expected_after_readback: 22_of_38_contained
media_repair:
  package_id: MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1
  branch: agent/mat-eventcard-media-coverage-repair-r1-20260901
  head: c0174621635e3c4336f4b88674c3b47fa7d7acb2
  tree: 81d9753b305c5d1dea67c4ca27f1efb99e09ebc5
  acceptance: QA_INTEGRATE_GATED_PASS_AFTER_EXACT_READ_ONLY_TARGET_PROJECTION
component_path_repair:
  package_id: MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-REPAIR-R1
  branch: agent/mat-eventcard-native-component-paths-repair-r1-20260901
  head: 757652ed656f32569d5ade7dd75f5cd58cf9df96
  tree: 2ffd893a8eba54156818b55fa5f63f88afbcc4c0
  acceptance: QA_INTEGRATE_GATED_PASS_AFTER_EXACT_18_COMPONENT_PROJECTION
acceptance_matrix:
  path: catalog/asp-production-conveyor-v3/u0/eventcard-product-acceptance/U0-EVENTCARD-THREE-REPAIRS.acceptance-matrix.v1.json
corrected_build_requests:
  path: catalog/asp-production-conveyor-v3/u0/eventcard-product-acceptance/ASP_BUILD_REQUEST_V2.corrected-addenda.v1.json
whole_eventcard_visual_pass: BLOCKED_BY_16_PROTECTED_TEXT_OFFENDERS_AND_LIVE_V0_EVIDENCE
penpot_reads: 0
penpot_mutations: 0
next_owner: D0_QA_INTEGRATE
```

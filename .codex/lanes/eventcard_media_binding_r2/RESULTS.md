# U0 EventCard media projection binding R2 — RESULTS

- Directive defect: `REPAIR_MEDIA_PROJECTION_AND_AUTHORIZATION_BINDING_MISSING`.
- Exact parent: `agent/mat-eventcard-media-coverage-repair-r1-20260901@c0174621635e3c4336f4b88674c3b47fa7d7acb2`.
- Successor package: `MAT-EVENTCARD-MEDIA-COVERAGE-PROJECTION-BINDING-R2`.
- State: `MAT_PACKAGE_READY_QA_INTEGRATE_GATED`.
- A separate mutation-free projection entrypoint captures four case/root/media/parent identities, semantic slot, local/parent coordinates, bounds, fills, ImageData identity, transform, rotation, flips, fit, focal point, exact source image identity, protected collection digest, current revision, and deterministic SHA-256.
- All four current media shape IDs and parent IDs must be unique.
- Execution is only a digest/revision-bound wrapper around the exact parent executor and rechecks the projection immediately before the parent mutation entrypoint.
- Historical revision-63 IDs are diagnostics only and are not authorization inputs.
- Timeout or unknown outcome requires read-only all-four-target readback; blind retry is forbidden.
- No Penpot authorization, visual PASS, promotion, or whole-EventCard PASS is claimed.
- U0 Penpot reads/mutations: `0/0`; Kaggle: `0`; new EventCard families: `0`.

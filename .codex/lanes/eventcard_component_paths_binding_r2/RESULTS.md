# U0 EventCard component-path projection binding R2 — RESULTS

- Directive defect: `REPAIR_PATHS_26_LINKED_INSTANCE_ID_PROJECTION_MISSING`.
- Exact parent: `agent/mat-eventcard-native-component-paths-repair-r1-20260901@757652ed656f32569d5ade7dd75f5cd58cf9df96`.
- Successor package: `MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-PROJECTION-R2`.
- State: `MAT_PACKAGE_READY_QA_INTEGRATE_GATED`.
- The mutation-free projection enumerates 18 exact components, 18 mains, all 26 linked instances, current and expected paths, component/main relations, linked-instance relations, current revision, protected collection digest, and deterministic projection SHA-256.
- Baseline is exactly `0/18` canonical, `15` empty, `3` legacy non-empty.
- Execution requires the same revision and digest immediately before an atomic path-only write for the exact 18 projected components.
- Terminal readback requires `18/18` non-empty canonical paths while preserving all component, main, and linked-instance IDs and all component/main names.
- Detach, clone, recreate, text/media/geometry mutation, and blind retry after timeout or unknown outcome remain forbidden.
- No Penpot authorization, visual PASS, promotion, or whole-EventCard PASS is claimed.
- U0 Penpot reads/mutations: `0/0`; Kaggle: `0`; new EventCard families: `0`.

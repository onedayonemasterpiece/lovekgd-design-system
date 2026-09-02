# U0 Shared Patterns — Discovery rails Atlas R2.1 pilot

This package-local successor materializes only page `0230.007`, **09.1 · Components · Discovery rails · Candidate**, from the accepted `U-SHARED-PATTERNS` R3 source tuple. It does not generalize across the other five shared-pattern pages.

The standalone browser bundle binds `COMPONENT_STATE_GRID_V2`: a 2176px candidate root, linked `ATLAS_PAGE_HEADER_V2` at `[64,64,2048,128]`, content at y=256, one source-bound discovery-rail master in the Atlas master column, and three linked state specimens in the 3-column grid. The layout adapter preserves the exact source roles, anatomy, labels and state semantics while fitting documentation wrappers to Atlas cells; it introduces no placeholder or screenshot implementation.

Execution is stable-ID resumable. Every call activates the exact page, rechecks the bounded physical ACTIVE lease, performs at most three actual native creates, and verifies a SHA-256 projection of all protected pages and components. Unknown outcomes stop for a distinct read-only projection and prohibit blind retry. A fresh-storage replay creates zero nodes.

Git QA/INTEGRATE does not authorize Penpot mutation. The sole writer still requires a fresh native projection, exact bundle authorization tuple, physical ACTIVE marker, settlement readback, validation `[]`, native exports and a page-scoped V0 trigger.

The V2 authorization envelope additionally binds the exact Atlas page ID and three semantic slots, Atlas head/tree provenance, sole writer `/root/publish_r2`, D0 session/task/trigger identities and cancel-token parity between authorization provenance and the physical ACTIVE marker.

V4 owns its deterministic UTF-8 encoder and SHA-256 implementation. Native projection does not depend on `crypto`, `crypto.subtle`, `TextEncoder`, Node built-ins or repository imports; tests execute with those globals explicitly absent.

V4 additionally requires exact `authorization.leaseToken` parity with provenance and the physical ACTIVE marker; wrong or missing authorization lease tokens fail before every create.

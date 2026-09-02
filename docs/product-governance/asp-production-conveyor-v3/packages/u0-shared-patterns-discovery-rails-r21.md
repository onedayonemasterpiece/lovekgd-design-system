# U0 Shared Patterns — Discovery rails Atlas R2.1 pilot

This package-local successor materializes only page `0230.007`, **09.1 · Components · Discovery rails · Candidate**, from the accepted `U-SHARED-PATTERNS` R3 source tuple. It does not generalize across the other five shared-pattern pages.

The V5 standalone browser bundle binds `COMPONENT_STATE_GRID_V2`: a 2176px candidate root, the exact linked Atlas header at `[64,64,2048,128]`, content at y=256, one source-bound discovery-rail master in the Atlas master column, and three linked state specimens in the 3-column grid. The header contract is native-ID exact: component `250f32b9-f4ec-800e-8008-92c64c51fdc0`, main `250f32b9-f4ec-800e-8008-92c64a6147cc`, name `ATLAS_PAGE_HEADER_V2`, path `Documentation / Atlas V2`. A same-name/path component with either wrong ID is rejected before header creation; linked-instance plugin evidence records all four provenance fields.

Execution is stable-ID resumable. Every call activates the exact page, performs at most three native creates, and verifies a SHA-256 projection of all protected pages and components. Unknown outcomes stop for a distinct read-only projection and prohibit blind retry. A fresh-storage replay creates zero nodes.

V5 reads only `currentFile.revn` and the physical marker `currentFile.getSharedPluginData('kenigevents','asp-active-run-v1')`. The `kenigevents.asp-run-control.v1` marker must match the full authorization/provenance provider head/tree, bundle SHA/bytes, revision/projection, session/task/trigger/cancel/lease tuple, shift marker `5514360206`, Discovery-only scope and sole writer `/root/publish_r2`. No caller active-reader/time helper or conformance authorization bypass is present.

The bundle owns deterministic UTF-8 and SHA-256 and does not depend on `crypto`, `crypto.subtle`, `TextEncoder`, Node built-ins, repository imports or `structuredClone`. The real public projection/execution/settlement entrypoints run under the shared native-like conformance harness.

Git QA/INTEGRATE does not authorize Penpot mutation. U0 performs no Penpot read or mutation; promotion remains gated on independent exact-tuple QA and INTEGRATE.

# ActionNav Atlas R2 documentation-layer repair v1

Package-local repair for `V0-ACTION-NAV-R2-DOC-LAYER-001`. The single bundle is loaded directly in a Penpot browser/plugin VM as `globalThis.D0ActionNavDocumentationLayerV1`; no publisher-side rebundle is permitted.

## Native call sequence

1. Load `executables/asp-production-conveyor-v3/f0/action-nav-doc-layer-v1/action-nav-doc-layer.bundle.js` and verify SHA-256 `518a466edec2539bce05342993e6f27e7b33241b422fe92b5e52fc606a8a03d5`, Git blob `6630fdd155c4fb4309d9a7490672ef477000e120`, bytes `43813`.
2. Put the exact execution authorization and bundle identity into `storage.actionNavDocLayerAuthorization` and `storage.actionNavDocLayerBundleIdentity`.
3. Call `projectActionNavDocLayer({penpot, storage})`; bind its initial projection SHA to the authorization and physical ACTIVE marker.
4. Call `executeActionNavDocLayerPhase({penpot, storage})` sequentially. Each call activates the exact target page, creates at most three nodes, rechecks ACTIVE/cancel/provenance, preserves the 8/8/18/9 native identities and returns an explicit resume/terminal receipt without calling or awaiting `currentFile.saveVersion()`. A timeout has unknown outcome: project again; never blindly retry.
5. Call `readActionNavDocLayerSettlement({penpot, storage})` distinctly. Replay execution must return `created=0`.

The repair adds only eight semantic master labels, eighteen documented specimen cells/captions, explicit focus-visible/current/selected treatments and nine visibly labeled `ATLAS_PAGE_HEADER_V2` fields. It does not recreate the page/root/components/mains/instances/SVGs and does not edit internal icon geometry.

## Gates

`MAT_PACKAGE_READY_QA_INTEGRATE_GATED`. This Git package is **not** Penpot execution authorization. Next: exact provider-backed QA + INTEGRATE on the same bundle tuple, then fresh native projection, sole-writer bounded execution, postflight/export and V0 re-review.

## Rev 181 timeout recovery

V5 removes the blocking per-phase `currentFile.saveVersion()` call. Every invocation starts with a fresh native projection and reconciles the current cursor, so the unknown outcome of the earlier `MASTER_LABELS` HTTP 504 is never guessed or blindly retried. After the prior lease expires, the sole writer must obtain a fresh authorization and projection before continuing.

## Rev 188 one-time V4 authorization migration

V6 may replace the root authorization binding exactly once only when the stored binding is the V4 bundle `cc80c697…`, the authorization tuple contains a SHA-bound stale marker proving `SUSPENDED_REPAIR`, `cancelled=true`, `mutation_in_flight=false`, `writer_released=true`, expired lease, and writer `/root/publish_r2`, and the fresh revision-bound projection is exactly cursor `CELL_DOCUMENTATION` with documentation census `8/0/0`. The new ACTIVE marker must link `authorization_rebind_from_bundle_sha256` to V4. Active/unexpired stale markers, another writer, a projection mismatch, or revision drift fail before creates. The current file revision must equal the string-bound authorized revision and be at least 188.

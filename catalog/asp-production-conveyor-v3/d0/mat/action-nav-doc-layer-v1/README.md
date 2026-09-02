# ActionNav Atlas R2 documentation-layer repair v1

Package-local repair for `V0-ACTION-NAV-R2-DOC-LAYER-001`. The single bundle is loaded directly in a Penpot browser/plugin VM as `globalThis.D0ActionNavDocumentationLayerV1`; no publisher-side rebundle is permitted.

## Native call sequence

1. Load `executables/asp-production-conveyor-v3/f0/action-nav-doc-layer-v1/action-nav-doc-layer.bundle.js` and verify SHA-256 `a08e73ecb3a51f4da09082b823365030273b92c7bbae36098417a16dce6d3739`, Git blob `07123165e2d47b011b4fc7ffc6bf075c8f0bfb58`, bytes `51678`.
2. Put the exact branch/head/tree/blob/bytes/SHA bundle identity, fresh current `revn`/projection/cursor/docs authorization, and the exact previous released-marker continuation into storage. Do **not** write a new physical ACTIVE marker externally.
3. Call `executeActionNavDocLayerPhase({penpot, storage})` once. The bundle validates the released physical marker, atomically mints ACTIVE, creates at most three nodes, binds its after-projection receipt, and releases the marker inside that same native call.
4. For each remaining phase, perform a distinct read-only projection and repeat step 2 with the new authoritative `revn`; skipped/regressed counts and stale revisions fail closed. A timeout has unknown outcome: project again; never blindly retry.
5. After terminal census `8/18/18`, call `readActionNavDocLayerSettlement({penpot, storage})` distinctly. Replay execution must return `created=0`.

The repair adds only eight semantic master labels, eighteen documented specimen cells/captions, explicit focus-visible/current/selected treatments and nine visibly labeled `ATLAS_PAGE_HEADER_V2` fields. It does not recreate the page/root/components/mains/instances/SVGs and does not edit internal icon geometry.

## Gates

`MAT_PACKAGE_READY_QA_INTEGRATE_GATED`. This Git package is **not** Penpot execution authorization. Next: exact provider-backed QA + INTEGRATE on the same bundle tuple, then fresh native projection, sole-writer bounded execution, postflight/export and V0 re-review.

## Rev 181 timeout recovery

V5 removes the blocking per-phase `currentFile.saveVersion()` call. Every invocation starts with a fresh native projection and reconciles the current cursor, so the unknown outcome of the earlier `MASTER_LABELS` HTTP 504 is never guessed or blindly retried. After the prior lease expires, the sole writer must obtain a fresh authorization and projection before continuing.

## Rev 188 one-time V4 authorization migration

V6 may replace the root authorization binding exactly once only when the stored binding is the V4 bundle `cc80c697…`, the authorization tuple contains a SHA-bound stale marker proving `SUSPENDED_REPAIR`, `cancelled=true`, `mutation_in_flight=false`, `writer_released=true`, expired lease, and writer `/root/publish_r2`, and the fresh revision-bound projection is exactly cursor `CELL_DOCUMENTATION` with documentation census `8/0/0`. The new ACTIVE marker must link `authorization_rebind_from_bundle_sha256` to V4. Active/unexpired stale markers, another writer, a projection mismatch, or revision drift fail before creates. The current file revision must equal the string-bound authorized revision and be at least 188.

## Native file revision accessor

V7 uses `file.revn` as the authoritative Penpot Plugin API field and falls back to `file.revision` only for older mocks/runtimes. This follows the upstream Penpot file-format name and the Plugin API correction tracked in `penpot/penpot#10394`. If both properties are present they must be numerically equal; if neither is available, execution fails before creates. The real rev188 preflight exposes `revn=188` and no `revision`.

## Rev 190 V8 per-phase atomic continuation

V8 supersedes the fixed-revision V7 continuation. The first V8 call accepts only the exact
released V7 partial (fresh current `revn>=190`, projection `1b8251c5…`, cursor `CELL_DOCUMENTATION`, docs
`8/1/1`, released-marker SHA-256 `418d736a…`). Every remaining bounded phase starts from a
fresh caller-supplied `revn`/projection/cursor/docs tuple and the exact prior released root
binding. The bundle itself validates that released tuple, mints physical `ACTIVE`, executes one
phase, stores the after-projection receipt, and releases the marker **inside one native call**.
An external marker write before execution is forbidden because it advances Penpot revision and
invalidates the authorization. Active/unreleased markers, another writer, revision/projection
mismatch, skipped or regressed documentation counts, and non-contiguous V8 phase bindings all
fail before product creates.

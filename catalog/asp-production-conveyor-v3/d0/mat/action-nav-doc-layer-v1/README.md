# ActionNav Atlas R2 documentation-layer repair v1

Package-local repair for `V0-ACTION-NAV-R2-DOC-LAYER-001`. The single bundle is loaded directly in a Penpot browser/plugin VM as `globalThis.D0ActionNavDocumentationLayerV1`; no publisher-side rebundle is permitted.

## Native call sequence

1. Load `executables/asp-production-conveyor-v3/f0/action-nav-doc-layer-v1/action-nav-doc-layer.bundle.js` and verify SHA-256 `0c6dc22b8a097a1256cc9d674320b860cbe0e1aedc3d2efd6e4bcfa5befa1da7`, Git blob `2526209ffeaab6b04636a7ff5937ead730e7a50b`, bytes `55703`.
2. Put the exact branch/head/tree/blob/bytes/SHA bundle identity, fresh current `revn`/projection/cursor/docs authorization, and the exact current physical released-marker **raw literal plus SHA-256** into storage. Do **not** write a new physical ACTIVE marker externally.
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

## V9 intervening-writer marker handling

The exact historical ActionNav V7 partial is now proven independently by its root authorization and known released-marker SHA. The current global physical marker may belong to an intervening package (for example released Owner V4 phase 2), but it must be the exact currently stored marker, writer `/root/publish_r2`, non-ACTIVE, cancelled, `mutation_in_flight=false`, and `writer_released=true`. V9 rejects ACTIVE, unreleased, or other-writer markers, then atomically replaces the released marker with the ActionNav phase ACTIVE. Native revision authority is `currentFile.revn` only; the legacy `revision` fallback is no longer accepted.

## V10 package-local released-marker bridge

V10 removes V9's incorrect assumption that every package uses `kenigevents.asp-run-control.v1`. The continuation now binds the byte-exact current `asp-active-run-v1` raw literal and its SHA-256; the execution call rereads that literal and requires exact equality before minting ActionNav `ACTIVE`. The marker schema is opaque/package-local. Its control fields must still prove the sole writer `/root/publish_r2`, non-`ACTIVE` state, cancelled or expired lease, `mutation_in_flight=false`, `writer_released=true`, and a non-future release time. Historical ActionNav V7 identity and docs `8/1/1` remain independently bound by the root authorization, projection and known V7 release hash. Later ActionNav phases additionally bind the released marker to the immediately previous ActionNav root receipt.

## V11 revn-only native-host cleanup

V11 does not read, write, or delete the unsupported `currentFile.revision` alias. Both production and conformance execution read only `currentFile.revn` and fail closed when it is absent. The conformance host also does not assign or override `currentFile.saveVersion`. This preserves the V10 raw released-marker literal/SHA bridge and atomic bounded phase while satisfying the nonconfigurable native-host traps in harness `62f26df36b8199e4b8899b9252f796b1fa5e9d42`.

## V12 native proxy identity and exact V11 recovery

V12 compares a documented instance parent with its container by normalized native IDs (`String(parent.id) === String(container.id)`), never by JavaScript wrapper identity. This matches the real Penpot bridge, where repeated access may return distinct proxy objects for the same native node; an unequal native ID still fails before creates. The regression host covers both the equal-ID alias and unequal-ID rejection.

The one-time recovery path accepts only the exact 517-byte failed-precreate V11 root binding (SHA-256 `4f338b58…`) and exact 1714-byte released `SUSPENDED_ERROR` physical marker (SHA-256 `c75c2ec…`) at native `revn=194`, with unchanged projection `1b8251c5…`, docs `8/1/1`, and `created=0`. Any literal, hash, revision, projection, census, provenance, error, or release-control drift fails closed. After migration, the existing per-phase fresh `revn`, exact root/marker linkage, atomic ACTIVE/phase/release, maximum-three creates, and replay-zero contract remains unchanged.

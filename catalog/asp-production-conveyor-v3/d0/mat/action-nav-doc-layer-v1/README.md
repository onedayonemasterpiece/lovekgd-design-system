# ActionNav Atlas R2 documentation-layer repair v1

Package-local repair for `V0-ACTION-NAV-R2-DOC-LAYER-001`. The single bundle is loaded directly in a Penpot browser/plugin VM as `globalThis.D0ActionNavDocumentationLayerV1`; no publisher-side rebundle is permitted.

## Native call sequence

1. Load `executables/asp-production-conveyor-v3/f0/action-nav-doc-layer-v1/action-nav-doc-layer.bundle.js` and verify SHA-256 `df81f04f9af13f293de42dc5b1fe530999cf742beb544bbc821411af82018e8e`, Git blob `1209a018f14e5a2724aee4f745fbe2689bfa09ac`, bytes `38955`.
2. Put the exact execution authorization and bundle identity into `storage.actionNavDocLayerAuthorization` and `storage.actionNavDocLayerBundleIdentity`.
3. Call `projectActionNavDocLayer({penpot, storage})`; bind its initial projection SHA to the authorization and physical ACTIVE marker.
4. Call `executeActionNavDocLayerPhase({penpot, storage})` sequentially. Each call activates the exact target page, creates at most three nodes, rechecks ACTIVE/cancel/provenance, preserves the 8/8/18/9 native identities and returns an explicit resume/terminal receipt. A timeout has unknown outcome: project again; never blindly retry.
5. Call `readActionNavDocLayerSettlement({penpot, storage})` distinctly. Replay execution must return `created=0`.

The repair adds only eight semantic master labels, eighteen documented specimen cells/captions, explicit focus-visible/current/selected treatments and nine visibly labeled `ATLAS_PAGE_HEADER_V2` fields. It does not recreate the page/root/components/mains/instances/SVGs and does not edit internal icon geometry.

## Gates

`MAT_PACKAGE_READY_QA_INTEGRATE_GATED`. This Git package is **not** Penpot execution authorization. Next: exact provider-backed QA + INTEGRATE on the same bundle tuple, then fresh native projection, sole-writer bounded execution, postflight/export and V0 re-review.

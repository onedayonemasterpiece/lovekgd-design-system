---
name: ui-sot-page-closure
description: Close one explicitly named production UI route to owner-review readiness across the central Git SoT, its normal Astro production chain, and linked native Penpot components. Use only for a bounded page-closure task with exact fixtures and required fresh visual evidence; do not use it to restart discovery or expand into foundations or other pages.
---

# UI SoT page closure

Close exactly the route named by the task. Keep WIP at one and let one serial
integrator own Git SoT, Astro, Penpot, capture, comparison, and verdict.

## Authority and identity gate

1. Read the task, current repository heads, the frozen fixture corpus/projection,
   the current Penpot pages, and the latest proof receipt. Treat old branches,
   proofs, screenshots, and large PRs only as donors.
2. Create clean narrow delivery branches from current `origin/main`. Import only
   the route's SoT, materializer, consumer projection, tests, and fresh evidence.
3. Resolve one exact tuple before comparison: route, scenario, reference ISO
   timestamp, timezone/locale, fixture order and hashes, SoT SHA, Astro SHA,
   Penpot revision and linked IDs. Never silently rewrite an immutable corpus.
4. For every material component, group, and full-route state, follow
   `$ui-three-way-conformance`. A stale or merely similar fixture invalidates the
   case.

## Export preflight

Before a visual Penpot mutation, capture one exact Astro card and one exact
route group, then export the matching linked Penpot card and group. Try
`export_shape` no more than twice. On the first HTTP 504, immediately run
`shape.export({type:'png'})` through
`scripts/round-trip-reconstruction/penpot-bounded-export.js`, retrieve bounded
base64 chunks, decode locally, and verify dimensions, bytes and SHA-256. Build
and inspect a real side-by-side, 50% overlay, and diff. Clipboard export is not
evidence. Do not mutate the page if this automated round trip fails.

## Correction loop

Work one mismatch at a time:

`fresh pair -> visual/diff diagnosis -> lowest central owner -> one fix -> linked propagation -> readback/validate -> fresh pair`

Page containers may own grouping and responsive layout only. Fixture wrappers
are data-only and contain exactly one linked canonical component. Detached
components, page-local visual masters, and screenshot cards are blockers.
After every Penpot mutation, read back lineage, run `validate()`, export the
bounded changed root, and inspect the four visual artifacts before continuing.

## Terminal gate

PASS is allowed only when every task case has fresh Astro/Penpot PNGs,
side-by-side, overlay and diff; exact geometry/computed-style/lineage evidence;
an explicit code-agent visual PASS; targeted tests/build/CI PASS; clean pushed
branches; and a clean ordered Penpot review surface. `MINOR`, `PASS_WITH_*`,
structural-only readiness, stale screenshots, or unexplained raster residuals
are non-PASS.

Validate the final closure manifest:

```bash
node .codex/skills/ui-sot-page-closure/scripts/validate-page-closure.mjs \
  <final-page-closure-manifest.json>
```

Return only the compact terminal handoff required by the task. Do not begin the
next page or any unrelated design-system work.

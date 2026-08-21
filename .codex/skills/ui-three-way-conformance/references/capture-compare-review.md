# Capture, compare, and visual review

## Fixture

Use the existing `events-bot-new/scripts/current_ui_resource_graph/v1/specimens`
registry/materializer/resolver. Freeze a public `PreviewEvent` into one
`resolved-render-case.json`; both sides bind to its SHA. Equality means the
same event ID, snapshot hash, resolved props/text, state, and asset manifest.
Similarity is irrelevant: two different events must never enter raster or
structural comparison. `--fresh-event` is an advisory deterministic canary and
never updates a golden fixture.

## Astro

Use a disposable harness, exact viewport and container, `ru-RU`,
`Europe/Kaliningrad`, DSF 1 unless the case says otherwise, reduced motion,
disabled animations/transitions/caret, `document.fonts.ready`, fixture-backed
network, and an exact visible root. Wait for images or an explicit loading/error
state. Capture the component root only.

## Penpot

Read only. Export the exact bound component/instance/board, not a whole page or
large review matrix. Pin file, Page, Board/component, revision, font declaration,
and SHA. One changed candidate gets one new immutable bounded export; ordinary
reruns use the cached export.

For every real media region, read back the exact asset identity plus aspect
preservation, fit/crop policy, focal position and clipping. A Penpot image that
fills the frame with `keepAspectRatio=null|false` is distorted, not equivalent
to Astro `object-fit: cover`. If a component has transparent regions, export it
through the bounded real parent/archetype surface so the background is part of
the evidence.

For implementation work outside this read-only conformance run, correct the
canonical master or semantic nested master, then let linked specimens inherit.
Do not place replacement shapes over stale content. The export receipt must say
whether the bound object is a renderable native surface and must carry its
component/state/fixture/resolved-case/asset identities.

## Comparison

Check structure before raster metrics: root/semantic-region boxes, padding,
gaps, radii, border/shadow roles, typography and line wrapping, icon identity,
anatomy/order, nested component IDs, media fit/position/crop, state markers,
colors within tolerance, and forbidden consumer overrides. Missing/extra
regions, font fallback, wrong icon/crop/anatomy/state, text-line drift, or large
geometry drift are blocking.

Never resize, crop, or reposition one side to match the other. Build common
canvases with top-left origin and transparent padding, so different dimensions
stay visible.

Only after the tuple gate passes, open all four artifacts and write
`agent-review.json` with `verdict`, bounded findings, `reviewed_files`, timestamp,
and `reviewer_kind=code-agent`. If the gate blocks, inspect only the Astro
diagnostic and tuple receipts; `penpot.png`, overlay, diff, structural parity
findings, and pixel ratio must not exist.

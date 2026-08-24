# Pilot v1 and CI

Pilot cases:

1. `core.button`, `primary/default`, `pixel-strict`, no fixture.
2. `event.card` Large static loaded state, one pinned real PreviewEvent,
   desktop and mobile, `astro-reference` until owner acceptance.

Every ready case needs the exact tuple, immutable bounded Penpot export of that
same resolved fixture, isolated Astro capture, instrumental outputs, code-agent
image review, comparison board, Telegram read-back receipt, and cleanup evidence.
If an exact export or exact fixture binding is not available, return a tuple
blocker; never substitute a random/similar event and never create comparison
artifacts for a blocked tuple.

Local and CI call the same CLI. Select affected cases from changed component,
contract, CSS/foundation dependency, fixture resolver, or binding/export files.
Do not run the full catalog for one button.

Actions publication is off by default; only trusted manual dispatch or a review
label may enable it through a protected environment. Untrusted forks cannot
publish. Use concurrency and content-hash dedup. Live Penpot is never required
for an ordinary CI rerun; use immutable exports.

Minimal local entry points:

```bash
UI_CLI=.codex/skills/ui-component-certification/scripts/ui-conformance.mjs
node "$UI_CLI" validate-case \
  --case catalog/ui-conformance/pilot-v1/event-card-large-desktop.case.json
node "$UI_CLI" changed-scope \
  --registry catalog/ui-conformance/pilot-v1/registry.v1.json \
  --files /tmp/changed-files.txt
node "$UI_CLI" clean --artifacts-root "$PWD/artifacts/ui-conformance" --dry-run
```

The consumer adapter resolves one frozen golden case without changing its
identity:

```bash
node scripts/ui_conformance/resolve-render-case.mjs \
  --case "$DESIGN_REPO/catalog/ui-conformance/pilot-v1/event-card-large-desktop.case.json" \
  --site site \
  --output "$DESIGN_REPO/catalog/ui-conformance/pilot-v1/resolved/event-card-large-desktop.resolved-render-case.json"
```

For an advisory canary, add `--fresh-event --fixture-profile` and always write a
temporary effective case. Supported profiles are `photo-card`, `poster-card`,
`gallery`, and `no-image`:

```bash
node scripts/ui_conformance/resolve-render-case.mjs \
  --case "$DESIGN_REPO/catalog/ui-conformance/pilot-v1/event-card-large-desktop.case.json" \
  --site site --fresh-event --fixture-profile gallery \
  --effective-case-output /tmp/ui-fresh.case.json \
  --output /tmp/ui-fresh.resolved-render-case.json
```

The effective case has `fixture_mode=fresh-advisory`; it cannot update or block
a golden baseline automatically.

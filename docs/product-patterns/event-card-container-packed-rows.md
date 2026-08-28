# Event-card container: packed rows and ecological crop

Status: `CURRENT_COMPLETE / ASTRO_PROJECTED / PENPOT_MATERIALIZED / VISUAL_EXPORT_BLOCKED`

Owner clarification is registered in
[`REV-IDEAHUB-20260828-02`](../reviews/idea-hub-owner-voice-intake-20260828-continuation-02.md).
The machine-readable authority is
[`packed-rows.v1.json`](../../catalog/ui-components/event-card-container/packed-rows.v1.json).

## What the pattern owns

This is a composition pattern above canonical event-card instances. It owns a
row's available width, shared height, column weights, grouping/remainder rules
and crop-loss optimization. It does **not** create another card component root.
Related-event cards and festival cards may keep consumer-specific renderers and
semantics, but Penpot must expose their shared lineage rather than page-local
lookalikes.

## Existing Astro oracles

The requested behavior already has two production source oracles:

- `packRelatedCardRows` in `site/src/lib/relatedCardLayout.mjs` optimizes
  event-detail recommendation rows. It estimates bounded copy chrome, minimizes
  normalized full-card height, keeps classified OCR/document media within an
  explicit `20%` crop cap, and fails unknown/error media closed to `contain`.
- `packFestivalTimeline` in `site/src/lib/festivalTimelineLayout.ts` evaluates
  legal 1–4-card formations. Non-final rows fill the full plane; weights depend
  on source aspect, media semantics, resolution and dense-copy pressure.

The new work does not replace these algorithms with a simplified equal grid.
It binds them into the UI SoT and makes their decisions visible in Astro and
Penpot fixtures.

## Ecological crop

For a source ratio `s` and target ratio `t`, discarded source-area fraction is:

```text
max(0, 1 - min(s / t, t / s))
```

The optimizer minimizes this measurable loss only after semantic safety gates:
unknown/error media cannot claim a numeric crop; protected OCR/document media
cannot be blindly covered; crop must preserve proven protected regions; stretch
is forbidden. A lower crop percentage is not permission to erase text or other
meaningful content.

## Required visual proof

Both projections must show source-bound rows for:

- three related-event cards with one shared row height;
- two festival cards with deterministic unequal weights;
- three festival cards filling the row;
- four festival cards filling the row.

Each row labels source/target ratios, column weights, crop-loss percentages,
row width and the semantic crop disposition. Penpot must use native cards and
linked lineage; Astro must call the production packers rather than reproducing
the math in page-local markup.

## Materialization receipt

Astro commit `c33652ed01f6fb16945af67a53d5e27acece3cef` adds the
source-bound route `/lab/design-system/event-card-container/` and changes the
production festival packer so every two-card row fills `100%`; only a true
singleton may remain compact. The focused build has `470` pages, festival
tests pass `12/12`, fixture tests pass `2/2`, and desktop/mobile exports are in
`evidence/recovery-20260828/astro/`.

Penpot page `40.7 — Event card container · Packed rows` at revision `2643`
contains `12` linked instances and `0` detached copies across the required
3/2/3/4-card rows. Every instance carries its exact UI SoT binding; the named
version is `Recovery 2026-08-28 · OV-42 packed rows · Astro c33652ed0` and
`validate()=[]`.

The external Penpot exporter still returns HTTP `504`, including for the
bounded two-card section. Structural and Astro receipts are:

- [`event-card-container-packed-rows-receipt.v1.json`](../../evidence/recovery-20260828/astro/event-card-container-packed-rows-receipt.v1.json);
- [`event-card-container-packed-rows-structural-receipt.v1.json`](../../evidence/recovery-20260828/penpot/event-card-container-packed-rows-structural-receipt.v1.json).

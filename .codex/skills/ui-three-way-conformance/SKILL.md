---
name: ui-three-way-conformance
description: Verify material UI component, foundation, archetype, or consumer changes against one exact Git SoT, Penpot, and Astro tuple; produce instrumental and code-agent visual evidence, a bounded Telegram review artifact, read-back receipt, and safe cleanup without promoting or changing production UI.
---

# UI three-way conformance

Use this skill after any material visual change to a candidate or promoted UI
component, foundation, archetype, or real consumer. Git SoT owns identity,
version, state, and lifecycle. Penpot and Astro are implementations of the same
bounded contract; neither may silently become a new baseline.

## Start gate

1. Record exact `lovekgd-design-system` and `events-bot-new` SHAs. Stack design
   work on the actual relevant PR head, not stale `main`.
2. Read the affected component/archetype contract, latest Penpot receipt, and
   [`docs/ui-source-of-truth-roundtrip.md`](../../../docs/ui-source-of-truth-roundtrip.md).
3. Select the affected case(s) only. A material change is incomplete without a
   case or an explicit machine-readable `not_applicable` reason.
4. Mutation is allowed only in the explicitly authorized, bounded Penpot
   materialization lane. It must follow the component contract/IR, use native
   linked resources, record stable IDs and read-back receipts, and never resolve
   owner comments or promote a family. Comparison and CI lanes stay read-only.
   Every Penpot undo block must retain the `Symbol` returned by
   `undoBlockBegin()` and pass it to `undoBlockFinish(blockId)` in `finally`;
   a parameterless finish is invalid and can obscure an already-applied write.

## Golden Event Corpus gate

- Read the immutable `catalog/fixtures/ui-reference-events/vN/corpus.json`; do
  not query production on ordinary comparison runs and do not create a second
  independently editable fixture copy in the consumer repository.
- Freeze both build variables, browser time, locale and timezone from the corpus
  `reference_clock`. A date-relative case without that clock is invalid.
- The Astro specimen and Penpot instance must bind the same `fixture_id`, full
  PreviewEvent payload hash, resolved-case hash, asset-manifest hash and exact
  media bytes. “Похожее событие” is never a valid oracle.
- Verify content-addressed assets before every reference render. A byte mismatch
  is `BLOCKED_ASSET_MISMATCH`, not a visual defect and not a reason to fetch a
  replacement silently.
- Corpus versions are append-only. Refresh creates `vN+1`; it never rewrites a
  published event payload or asset manifest in `vN`.

## Exact execution order

1. Resolve one `ui-conformance-case` and one `resolved-render-case.json`.
   Astro and Penpot must render the **same exact fixture**: the same event ID,
   snapshot hash, resolved props/text, assets and state. Never place or compare
   two merely similar events. A different event makes visual comparison invalid.
2. Fail closed on identity, contract, fixture, resolved-case hash, viewport,
   asset, or font mismatch
   **before** pixel comparison. A blocked tuple is not a visual failure.
3. Export one exact bounded Penpot root once, hash it, and reuse the immutable
   export locally/CI until the candidate changes.
4. Render the exact Astro root in a disposable harness using the same resolved
   fixture. Never mutate production source or create a second fixture pipeline.
   If the complete built route is too large or crashes the capture browser,
   derive a minimal single-root harness from that same built artifact: extract
   the exact component markup, emitted stylesheet links, fixture identity and
   viewport rule. Record this derivation in the manifest; never hand-recreate
   the markup or swap in a similar event.
5. Produce geometry, computed-style, structural, and pixel evidence. Never
   autoscale/crop/center images to hide drift.
6. Open `astro.png`, `penpot.png`, `overlay-50.png`, and `diff.png` yourself and
   write `agent-review.json`. A threshold cannot replace visual review.
7. Finalize to `PASS`, `MINOR`, `FAIL`, `EXCEPTION`, or `BLOCKED`; keep owner
   status separate and default it to `AWAITING_REVIEW`.
8. In an owner-authorized interactive review run, publish **each individual
   case immediately when it reaches a terminal agent verdict** (`PASS`,
   `MINOR`, `FAIL`, `EXCEPTION`, or `BLOCKED`). Send one case per transport
   invocation, read the exact message/media back, and persist its receipt
   before starting the next case. Telegram is the owner's live progress ledger:
   never hold ready comparisons for an end-of-run batch. If Penpot export is
   blocked, publish a truthful diagnostic board immediately and supersede it
   later with the real comparison; never substitute structural facts for a
   visual pass. Default local/CI runs never send.
   Compose each comparison toward a square final image: use Astro-left /
   Penpot-right for narrow specimens and Astro-top / Penpot-bottom for wide
   horizontal rows or rails, selecting the orientation whose resulting canvas
   aspect ratio is closest to `1`. Never shrink a wide rail into an unreadable
   side-by-side strip.
9. Run cleanup at start/end. Delete only marker-backed eligible ephemeral runs;
   never delete accepted exports, contracts, exceptions, or final receipts.

## Archetype reconstruction gate

Before assembling page archetypes, capture the exact Astro archetype at one
frozen event/context, place that locked screenshot on a bounded Penpot review
board, and build the same archetype beside it only from linked components using
the same resolved case. Export both at their actual size, then inspect
side-by-side, 50% overlay and diff. If a shared master changes, audit every
linked child/parent/consumer and re-export representative dark/light/count
states; never assume inheritance propagated correctly. Unexplained drift sends
the work back to the owning foundation, child master, parent master or
rematerialization boundary.

Keep review boards small: normally one case per board, no unrelated media
gallery or detached semantic-master pile inside the owner-review board, and no
full-page/giant-board export when a bounded component root is sufficient.
If the linked archetype master itself is the exact bounded review root, export
it directly and crop locally; do not duplicate the whole graph into a second
Penpot review board merely to obtain the same PNG. At final read-back, inspect
top-level page children and remove only verified unlinked orphans with no
component/library/plugin identity. Never treat comments or unfamiliar boards
as cleanup candidates.

A protected runtime region may be blocked or masked only when a versioned
exception names that exact region. The comparison still measures the same-data
outer geometry, content, typography and states around it. Preserve the runtime
implementation as authority for the protected region; do not infer a replacement
from the Penpot approximation or count the masked pixels as a visual pass.

If the exact tuple gate is blocked, do not create/copy `penpot.png`, overlay,
diff, pixel verdict, or cross-renderer structural findings. Publish only a
diagnostic board that says the comparison was not run and lists the blockers.

## Penpot inheritance boundary

Correct systemic drift in the canonical native master or its semantic nested
master. Let linked child instances inherit the fix; do not patch each specimen
or overlay a replacement on top of stale shapes. Review/evidence boards contain
linked instances of those masters plus the immutable Astro screenshot. Before
handoff, remove superseded/debris layers and verify instance provenance. A
consumer-local override is allowed only when the Git contract explicitly owns
that override slot.

Treat image identity and media treatment as separate bindings. An event image
may be an instance content override, but fit, aspect preservation, crop policy,
focal position and clipping remain owned by `event.media-frame` (or by an
explicit rematerialization rule derived from that master). Read these values
back after materialization: `fillImage.keepAspectRatio` being `null` or `false`
is a blocking distortion unless the contract explicitly declares stretch.
Never infer CSS `cover` merely because an image fills the Penpot rectangle.

Transparent nested actions must be exported inside their real parent surface.
Exporting a child by itself against an implicit black/transparent canvas is not
valid evidence for a light consumer. Any master change invalidates the previous
Penpot export; do not publish the stale image as a new Telegram revision.

## Page and board vocabulary

Always distinguish the Penpot page from a board inside it. Say and record, for
example, `Page 25 / Board 25A` or `Page 30.1 / Board 30.1C`. Never call `25A` a
page. Store `page_id` and `board_or_component_id` separately and include both
direct-link labels in review handoffs.

## Required references

- Read [case-and-status-contract.md](references/case-and-status-contract.md)
  when creating or validating cases, profiles, exceptions, or verdicts.
- Read [capture-compare-review.md](references/capture-compare-review.md) when
  capturing Astro/Penpot, comparing, or preparing agent review.
- Read [telegram-and-retention.md](references/telegram-and-retention.md) before
  any Telegram publication or cleanup.
- Read [pilot-and-ci.md](references/pilot-and-ci.md) for pilot cases, affected
  scope, local commands, and CI boundaries.

Canonical CLI:

```bash
node .codex/skills/ui-three-way-conformance/scripts/ui-conformance.mjs help
```

The consumer repository may contain only thin fixture/capture/CI adapters and
routing text. Do not copy this full procedure there.

Related project routes: `static-site-design-system`, `static-site-autotest`, and
`static-listing-visual-lab`. They own runtime/catalog/test specifics; this skill
owns the exact three-way identity, capture, comparison and review lifecycle.

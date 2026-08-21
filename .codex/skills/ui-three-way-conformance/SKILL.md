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
4. Keep Penpot read-only in this workflow. Do not mutate design, resolve
   comments, promote a family, deploy production, or accept a baseline.

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
5. Produce geometry, computed-style, structural, and pixel evidence. Never
   autoscale/crop/center images to hide drift.
6. Open `astro.png`, `penpot.png`, `overlay-50.png`, and `diff.png` yourself and
   write `agent-review.json`. A threshold cannot replace visual review.
7. Finalize to `PASS`, `MINOR`, `FAIL`, `EXCEPTION`, or `BLOCKED`; keep owner
   status separate and default it to `AWAITING_REVIEW`.
8. Before owner review, explicitly publish the comparison board to the verified
   Telegram topic using the existing human-session transport, then read the
   exact message back and persist a receipt. Default local/CI runs never send.
9. Run cleanup at start/end. Delete only marker-backed eligible ephemeral runs;
   never delete accepted exports, contracts, exceptions, or final receipts.

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

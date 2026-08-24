---
name: ui-component-certification
description: Certify a new or materially changed UI component against one exact Git SoT, native Penpot master, and Astro fixture. Invoke only for a new component, semantic contract change, new structural state or size/surface/theme context, failed regression, owner defect, or promotion gate—not for ordinary linked archetype assembly.
---

# UI component certification

This is the bounded three-way certification workflow for an owning component.
It is not an automatic tax on every linked consumer and not a general archetype
assembly workflow.

## Admission

Run only when at least one trigger is recorded:

- new component;
- semantic contract change;
- new structural state;
- new size, surface, or theme context;
- failed regression;
- owner-reported defect;
- promotion gate.

Ordinary insertion of an already certified linked instance remains `ASSEMBLY`.
Use `$penpot-visual-reconstruction` for that work. Fail closed if the trigger or
lowest owning component is ambiguous.

## Exact tuple

1. Pin immutable design-system and Astro SHAs and the exact Penpot
   file/page/component/revision.
2. Bind Astro and Penpot to the same fixture ID, full payload/hash, resolved
   state, asset bytes, viewport, reference time/locale/timezone, and font set.
   Similar events are invalid evidence.
3. Fail identity, fixture, asset, media, font, inheritance, or context mismatch
   before raster comparison.
4. Preserve native component identity, linked ancestry, variant/state axes, and
   supported parent context. Detached visual copies or unregistered terminal
   overrides fail certification.

## Evidence retained from the former workflow

For the owning component and one representative affected-parent batch, retain:

- exact fixture and resolved-case identity;
- geometry and computed-style evidence;
- media fit/crop/focal/asset identity;
- font identity and metrics;
- native inheritance/linked ancestry;
- direct Astro/Penpot images, overlay, diff, structural findings, pixel metrics,
  and an agent visual review.

Use the smallest honest root that still provides the required surface and parent
context. Never scale, crop, or center away a mismatch. Inspect the images; a
threshold is not visual review. Read the focused references only when needed:

- [case and status](references/case-and-status-contract.md);
- [capture and comparison](references/capture-compare-review.md);
- [pilot and CI](references/pilot-and-ci.md);
- [Telegram and retention](references/telegram-and-retention.md).

Canonical compatibility CLI:

```bash
node .codex/skills/ui-component-certification/scripts/ui-conformance.mjs help
```

## Central-fix result

One defect opens the lowest owning SoT/master once. Apply one central fix and
run one dependency-closure regression batch across representative affected
parents. Do not generate separate proof packages or receipts for every parent,
row, card, or page. A known renderer delta is recorded once at its owner and is
not reopened for every consumer unless it changes or masks a new defect.

The result contains:

- one owning-component certification result;
- one dependency-closure result;
- affected-parent observations within that batch;
- no per-parent certification packages unless a parent is itself a distinct
  changed owner.

## Publication and authority

Default local and CI runs publish nothing. Do not send every terminal leaf case
to Telegram. An explicitly owner-authorized review publication may send one
bounded owning-component result plus its dependency-closure summary, with
verified read-back and hash-based deduplication.

A certification PASS does not approve product behavior, promote the family,
backport to Astro, deploy, or resolve Penpot comments. Keep owner status and
technical result separate. Follow
[`docs/ui-source-of-truth-roundtrip.md`](../../../docs/ui-source-of-truth-roundtrip.md)
for those later gates.

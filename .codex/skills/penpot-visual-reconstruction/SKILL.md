---
name: penpot-visual-reconstruction
description: Materialize an approved semantic UI SoT as real native Penpot desktop/mobile compositions. Use for archetype assembly or reconstruction in Penpot; do not use for component certification, service dashboards, evidence-only boards, or production Astro changes.
---

# Penpot visual reconstruction

Materialize the ready semantic SoT into reviewable native Penpot UI. Git owns
contracts and service evidence; Penpot contains product UI only. Preserve exact
Astro AS-IS behavior until an owner-approved change explicitly supersedes it.

## Start gate

1. Pin the current design-system and Astro SHAs and validate the exact semantic
   handoff with `scripts/validate-sot-handoff.mjs`.
2. Inspect the target Penpot file/page read-only, including its revision,
   component ancestry, incomplete prior writes, and `currentFile.validate()`.
3. Validate the bounded materialization plan with
   `scripts/validate-penpot-ui-only.mjs` and
   `scripts/validate-visual-readiness.mjs` before any Penpot mutation.
4. If a previous tool call was interrupted or timed out, read back first. Never
   overlap a retry with an unknown write. Keep writes page-scoped, resumable,
   idempotent, and small enough for Penpot to remain reviewable.

## Penpot UI-only boundary

Penpot may contain only:

- foundations, tokens, and icons;
- reusable UI components and variants;
- product patterns;
- desktop/mobile page compositions;
- real visual states;
- minimal viewport, variant, state, and fixture labels.

Keep route registries, source-state indexes, status dashboards, coverage
matrices, gap ledgers, hashes/SHAs, test reports, receipts, execution logs,
readiness cards, service-only review indexes, and metadata-only archetype boards
in Git. Never put a service resource into the normal Product library.

Screenshots are visual oracles/evidence only. They are never component fills,
full-page proxies, or substitutes for native composition.

## Visual readiness

A desktop/mobile projection is ready only when it contains the real Astro AS-IS
composition for the exact fixture and state:

- material anatomy regions in the source-derived order;
- source-derived layout, sizing, clipping, and responsive context;
- real fixtures and visual states;
- linked reusable component instances with intact ancestry.

A correctly sized blank board, text-only state index, anatomy checklist,
metadata scaffold, screenshot-only master, or component with the right ID but
no UI is not reconstruction. Structural PASS cannot replace a visible result.
Run `validate-visual-readiness` on every owner projection before handoff.

## Assembly boundary

For already certified components, normal archetype assembly checks only:

- exact component identity and linked ancestry;
- correct state/variant and supported size/surface/theme context;
- parent layout and material region placement;
- detached copies = 0;
- terminal visual overrides = 0.

Do not reopen leaf certification during ordinary reuse. Invoke
`$ui-component-certification` only for a new component, semantic contract
change, new structural state, new size/surface/theme context, failed regression,
owner defect, or promotion gate. Validate the routing decision with
`scripts/validate-assembly-certification-boundary.mjs`.

## Central correction and density

Fix one defect in the lowest owning Git SoT/native master, then run one bounded
dependency-closure regression batch. Let linked descendants inherit. Do not
create separate proof packages, receipts, or Telegram messages for every parent
consumer unless a distinct owner changed.

Test dense, stress, and full-list behavior in generated Astro. Penpot uses only
enough representative real fixtures to prove composition and states; never
hand-build long listings with dozens of repeated cards.

## Review status

Use only:

- `NOT_REVIEWED`;
- `REVIEWED_WITH_FINDINGS`;
- `CORRECTIONS_VERIFIED`;
- `REVIEWED_BY_EXCEPTION`;
- `EXPLICIT_DECISION_REQUIRED`;
- `PRODUCT_APPROVED`.

No comment after review means `NO_RECORDED_OBJECTION`, never explicit approval.
Do not resolve comments, promote, backport, deploy, or mutate production without
the corresponding explicit owner gate.

## Handoff

Keep owner pages small, sortable, and explicit. Report direct Penpot page/board
links, exact viewport/state/fixture scope, validation results, linked ancestry,
and open exceptions. Read
[`docs/penpot-product-design-operating-model.md`](../../../docs/penpot-product-design-operating-model.md)
and [`docs/ui-source-of-truth-roundtrip.md`](../../../docs/ui-source-of-truth-roundtrip.md)
for repository authority and roundtrip gates.

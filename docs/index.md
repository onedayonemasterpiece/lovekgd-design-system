# LoveKGD Design System — documentation map

## Current route

1. [`static-site-design-system-current-state.md`](static-site-design-system-current-state.md)
   — cross-branch factual router.
2. Active PR `#53` current-state, review register and exact affected contract.
3. `events-bot-new#596` local Astro bridge and executable fixture scenario.

Latest owner correction: `REV-CHAT-20260829-01` / `OV-59`.

## Authority

**SoT UI is the central system.** Penpot is a native visual projection/review
surface; Astro is the executable projection/consumer. Accepted Penpot feedback
returns to SoT UI before either projection changes.

```text
SoT UI → Penpot
SoT UI → Astro
```

Do not infer `Penpot → Astro` authority.

## Active cross-branch links

- [Detailed current-state router on PR #53](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/static-site-design-system-current-state.md)
- [Owner-review register on PR #53](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/reviews/index.md)
- [Owner correction OV-59](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/reviews/owner-text-sot-ui-centrality-correction-20260829.md)
- [Normative round trip](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/ui-source-of-truth-roundtrip.md)
- [Fixture authority and unification gap](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/ui-reference-fixture-registry.md)

## This branch: operational planning

- [`design-system-progress-checklist.md`](design-system-progress-checklist.md)
  — readiness checklist.
- [`design-system-execution-sequence.md`](design-system-execution-sequence.md)
  — ordered AS-IS reconstruction, acceptance, migration and promotion.
- [`design-system-planned-patterns-checklist.md`](design-system-planned-patterns-checklist.md)
  — future redesign patterns after the AS-IS/parity gate.
- [`design-system-post-baseline-audits-and-product-atlas-checklist.md`](design-system-post-baseline-audits-and-product-atlas-checklist.md)
  — post-baseline audits and Product Atlas linkage.
- [`product-atlas-parallel-recovery-gate-20260828.md`](product-atlas-parallel-recovery-gate-20260828.md)
  — layered product/UI authority for parallel Product Atlas work.

## Normative documents available in this branch

- [`resource-graph-004.md`](resource-graph-004.md)
- [`component-contract-authority.md`](component-contract-authority.md)
- [`source-first-component-decoder.md`](source-first-component-decoder.md)
- [`normalization/design-system-family-lifecycle.md`](normalization/design-system-family-lifecycle.md)
- [`penpot-product-design-operating-model.md`](penpot-product-design-operating-model.md)
- [`legacy-experiments.md`](legacy-experiments.md)

Historical synthesis, audits and decoder snapshots remain evidence for their
exact heads. They do not override newer source-bound contracts and owner
corrections on active PR `#53`.

## Current fixture warning

The 8-event component-certification corpus and disjoint 5-event archetype-core
registry are not yet one proven SoT fixture authority. Exact bounded scenarios
remain useful; cross-level Golden Corpus continuity is open.

Status: `SOT_FIXTURE_AUTHORITY_UNIFICATION_OPEN`.

## Forbidden claims

- Penpot is central or directly controls Astro;
- automatic competing Penpot ↔ Astro authority;
- split event sets already form one proven Golden Corpus;
- full owner acceptance or promotion;
- Draft candidate is production;
- structural PASS equals visual PASS or owner acceptance.

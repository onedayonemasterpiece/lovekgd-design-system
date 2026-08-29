# LoveKGD Design System — карта документации

## Начать отсюда

1. [`static-site-design-system-current-state.md`](static-site-design-system-current-state.md)
   — фактическая текущая власть, implementation layers и open gaps.
2. [`reviews/index.md`](reviews/index.md) — owner-review router. Latest:
   `REV-CHAT-20260829-01` / `OV-59`.
3. [`ui-source-of-truth-roundtrip.md`](ui-source-of-truth-roundtrip.md) —
   нормативный lifecycle.
4. [`ui-reference-fixture-registry.md`](ui-reference-fixture-registry.md) —
   fixture authority и текущий event-corpus unification gap.
5. affected family/archetype contract + newest exact receipt.

## Неподвижная authority

```text
SoT UI — central system
  ├─→ Penpot native visual projection/review
  └─→ Astro executable projection/consumer
```

Current durable SoT UI implementation is versioned Git contract/package data,
tokens, behavior contracts, fixture registry, bindings and receipts in this
repository.

Penpot is not a central system, independent SoT or direct source for Astro.
Accepted review feedback returns to SoT UI before both projections are updated.
The intended direction is `SoT UI → Penpot` and `SoT UI → Astro`.

Owner correction:
[`reviews/owner-text-sot-ui-centrality-correction-20260829.md`](reviews/owner-text-sot-ui-centrality-correction-20260829.md).

## Current cross-branch layers

| Layer | Current source | Meaning |
|---|---|---|
| Historical published snapshot | `main@c6419a62af3d73f53e81d95a518fbe62a4a1c942` | not current owner-review state |
| Source-proven AS-IS baseline | Draft PR `#52@b86bab3e91511b3d4bd7d953b22bceb847f02a51` | 17 archetypes / 34 cases; no acceptance/promotion |
| Active SoT/owner-review contour | Draft PR `#53`, branch `fix/penpot-owner-comments-20260826` | current contracts, Penpot receipts and review routing |
| Component Golden Corpus pilot | Draft PR `#42@7a26772828a5d74a9683c08e7e6774ff15ac61a5` | identity PASS, visual FAIL |
| Published Astro AS-IS | `events-bot-new/main@8710e56fa3685f6c30a90cd062d532dce0348cce` | executable pre-promotion fact |
| Active Astro/UI candidate | `events-bot-new#596`, branch `fix/audio-audit-ui-20260828` | Draft consumer candidate, not production |

Fresh-read current PR heads before every task.

## Current review correction

`REV-IDEAHUB-20260829-14` / `OV-58` originally misattributed a
“Penpot is central” thesis to the owner voice. The full transcript says the
opposite: Source of Truth is the center; Penpot displays states and archetypes.

Current authority is `REV-CHAT-20260829-01` / `OV-59`.

## Fixture routing

Target: one canonical SoT UI fixture authority with typed records and named
scenarios/subsets.

Current gap:

- 8-event immutable component corpus;
- disjoint 5-event archetype registry;
- exact bounded cases exist, but single cross-level Golden Corpus authority is
  not proven.

Status: `SOT_FIXTURE_AUTHORITY_UNIFICATION_OPEN`.

Different entity pools are allowed under one authority:

- events;
- festivals;
- clubs;
- artifacts.

Do not normalize unlinked event registries as a finished architecture.

## Current source-bound contracts and receipts

| Document | Role |
|---|---|
| [`product-patterns/event-card-family-consumer-lineage.md`](product-patterns/event-card-family-consumer-lineage.md) | bounded centralization versus global lineage closure |
| [`product-patterns/event-card-container-packed-rows.md`](product-patterns/event-card-container-packed-rows.md) | multi-card packing and ecological crop |
| [`normalization/event-detail-motion-keyboard-source-contract-v1.md`](normalization/event-detail-motion-keyboard-source-contract-v1.md) | Event Detail Hero image, motion, keyboard and continuation order |
| `catalog/reconstruction-atlas/v1/*centralization*.json` | current bounded card-family structural evidence |
| `catalog/fixtures/design-system-reference/v1/registry.v1.json` | current archetype registry; not yet unified with component corpus |
| [`reviews/index.md`](reviews/index.md) | exact owner-item status and open gates |

A newer exact source-bound contract/receipt supersedes an older status summary
for its bounded scope, but never silently rewrites historical evidence.

## Normative architecture

| Document | Owns |
|---|---|
| [`component-contract-authority.md`](component-contract-authority.md) | component identity/version/API and authority before/after promotion |
| [`normalization/design-system-family-lifecycle.md`](normalization/design-system-family-lifecycle.md) | ordered family/archetype gates |
| [`resource-graph-004.md`](resource-graph-004.md) | Resource Graph role and promotion model |
| [`penpot-product-design-operating-model.md`](penpot-product-design-operating-model.md) | Product Atlas → UI Exploration → Resource Graph relationship |
| [`source-first-component-decoder.md`](source-first-component-decoder.md) | historical AS-IS extraction and evidence |

## Authority routing

```text
Product meaning and UI-gap identity
→ events-bot-new product model + Product Atlas

Current executable AS-IS before promotion
→ pinned events-bot-new Astro/runtime

Central UI authority
→ versioned SoT UI contracts/package/fixture registry in this repository

Visual implementation and review
→ Penpot native masters + linked instances + readback/exports

Browser candidate and production
→ events-bot-new isolated candidate → approval → migration → runtime evidence
```

## Current state summary

```text
historical reconstruction snapshots             PASS / HISTORICAL
source-proven AS-IS baseline #52                PASS / DRAFT
active owner-review corrections #53             IN_PROGRESS
Golden Corpus component pilot #42              IDENTITY PASS / VISUAL FAIL
SoT fixture authority across component/archetype OPEN
bounded lineage corrections                     MIXED PASS / PARTIAL
owner acceptance                                OPEN
per-family promotion                            0 globally promoted
production migration of draft candidate         NOT AUTHORIZED
```

## Forbidden claims

Until the relevant gates close, do not claim:

- Penpot is central or directly controls Astro;
- automatic bidirectional Penpot ↔ Astro authority;
- the split 8-event and 5-event sets are already one proven Golden Corpus;
- complete accepted/promoted design system;
- visual similarity proves lineage;
- structural PASS equals visual PASS or owner acceptance;
- Draft PR `events-bot-new#596` is production.

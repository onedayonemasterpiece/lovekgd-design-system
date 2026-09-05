# Статический сайт ↔ дизайн-система: cross-branch router

Status: `CURRENT_CROSS_BRANCH_ROUTER`

Последняя фактическая сверка: `2026-08-29`.

Latest owner correction: `REV-CHAT-20260829-01` / `OV-59` on active Draft PR
`#53`.

Этот branch хранит execution/checklist documentation, но не текущий полный
owner-review ledger. Для фактического состояния всегда fresh-read active PR
`#53` и Astro candidate PR `events-bot-new#596`.

## Central authority

**SoT UI is the central system.**

```text
SoT UI
  ├─→ Penpot native visual projection/review
  └─→ Astro executable projection/consumer
```

Current durable SoT UI implementation is versioned Git contracts/package data,
tokens, behavior contracts, fixture authority, bindings and receipts in
`lovekgd-design-system`.

Penpot is not central and must not directly control Astro. Accepted feedback
from Penpot returns to SoT UI first. Target propagation is `SoT UI → Penpot`
and `SoT UI → Astro`.

The full IdeaHub transcript already says Source of Truth is the center. A prior
summary/analysis falsely attributed Penpot centrality; current correction is
`OV-59`.

## Current layers

| Layer | Source | Status |
|---|---|---|
| Published snapshot | `main@c6419a62af3d73f53e81d95a518fbe62a4a1c942` | historical |
| Source-proven AS-IS | Draft PR `#52@b86bab3e91511b3d4bd7d953b22bceb847f02a51` | PASS / unmerged / no acceptance |
| Active SoT/owner review | Draft PR `#53`, `fix/penpot-owner-comments-20260826` | current contracts, Penpot receipts and review status |
| Golden Event Corpus pilot | Draft PR `#42@7a26772828a5d74a9683c08e7e6774ff15ac61a5` | identity PASS / visual FAIL |
| Published Astro AS-IS | `events-bot-new/main@8710e56fa3685f6c30a90cd062d532dce0348cce` | executable pre-promotion fact |
| Active Astro/UI candidate | `events-bot-new#596`, `fix/audio-audit-ui-20260828` | Draft / not production |

## Fixture authority gap

Target is one canonical SoT UI fixture authority with typed records and named
scenario subsets.

Current event contours are not yet unified:

- 8-event component-certification corpus;
- disjoint 5-event archetype-core registry.

Exact bounded tests may remain valid, but cross-level component → group →
archetype Golden Corpus continuity is not proven.

Status: `SOT_FIXTURE_AUTHORITY_UNIFICATION_OPEN`.

## Required route

1. [Current detailed router on active PR `#53`](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/static-site-design-system-current-state.md)
2. [Owner-review router on `#53`](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/reviews/index.md)
3. [Owner correction `OV-59`](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/reviews/owner-text-sot-ui-centrality-correction-20260829.md)
4. [Normative round trip](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/ui-source-of-truth-roundtrip.md)
5. [Fixture authority](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/ui-reference-fixture-registry.md)
6. affected contract + newest receipt on `#53`
7. local Astro bridge and fixture scenarios on `events-bot-new#596`

## Forbidden claims

Do not claim:

- Penpot is central or directly controls Astro;
- automatic competing Penpot ↔ Astro authority;
- the current 8-event and 5-event sets are already one proven corpus;
- complete accepted/promoted design system;
- Draft candidate is production;
- green tests or `validate()=[]` equal owner acceptance.

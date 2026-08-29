# LoveKGD Design System

Репозиторий хранит SoT UI contracts, component architecture, Penpot bindings,
Astro conformance evidence и promotion/release records для продукта «Полюбить
Калининград Анонсы».

## Начать отсюда

Для любой задачи о статическом сайте, компонентах, Astro ↔ Penpot parity,
fixtures или archetypes сначала откройте
[`docs/static-site-design-system-current-state.md`](docs/static-site-design-system-current-state.md).

Этот documentation branch не содержит полный текущий owner-review contour.
Фактические текущие contracts и review находятся в Draft PR `#53`; executable
Astro candidate — в `events-bot-new#596`.

Latest owner correction: `REV-CHAT-20260829-01` / `OV-59`.

## Central authority

**SoT UI is the central system.**

```text
owner/product decision
→ SoT UI
  ├─→ Penpot native visual projection/review
  └─→ Astro executable projection/consumer
→ structural + visual parity
→ owner acceptance
→ promotion and production migration
```

Current durable SoT UI implementation is versioned Git contracts/package data,
tokens, behavior contracts, fixture authority, bindings and receipts in this
repository.

Penpot is not the central system and cannot directly govern Astro. A visual
change proposed or reviewed in Penpot must return to SoT UI first; both
projections are then updated from one SoT version.

The full IdeaHub transcript explicitly says Source of Truth is the center and
Penpot is the display/review instrument. A previous model summary and analysis
misattributed Penpot centrality; current correction is routed on active PR `#53`.

## Current layered status

```text
published main snapshot: historical reconstruction state
source-proven AS-IS baseline: PR #52 PASS / DRAFT / UNMERGED
active SoT and owner-review corrections: PR #53 IN_PROGRESS
Golden Event Corpus pilot: identity PASS / visual FAIL
active Astro/UI candidate: events-bot-new PR #596 DRAFT
SoT event-fixture authority unification: OPEN
per-family global promotion: 0
production migration of draft candidate: NOT AUTHORIZED
```

`main@c6419a62af3d73f53e81d95a518fbe62a4a1c942` is a historical snapshot dated
19 August 2026. Do not infer current state only from `main`, this README or an
old PR body; fresh-read current heads.

## Historical reconstruction snapshot

The following numbers describe the original published snapshot, not the active
owner-review branch:

```text
Penpot Resource Graph historical scaffold: PASS
historical Penpot revision: 30
pages: 23
managed zones: 257
historical native components: 0
historical variants: 0
historical tokens/styles: 0
logical current-UI components decoded: 107
candidate AS-IS contracts: 12
reviewed reconciliation capsules: 6
manually reviewed rasters: 157
promoted resource families: 0
```

Historical receipt:
[`receipts/penpot/resource-graph-to-be-structure-v1.json`](receipts/penpot/resource-graph-to-be-structure-v1.json).

Historical scaffold:
[`contracts/resource-graph-scaffold.v1.json`](contracts/resource-graph-scaffold.v1.json).

## Product/design contours

```text
Product Atlas
→ product meaning, Jobs, outcomes, journeys, capabilities and UI gaps

UI Exploration
→ visual candidates, references, compositions and shortlist

Resource Graph / SoT UI delivery
→ components, patterns, archetypes, bindings, evidence and promotion
```

These are separate Penpot/product contours linked by stable IDs. None replaces
the central SoT UI contract/package authority.

## Authority by phase

### Before promotion

Pinned Astro/runtime is executable evidence of current AS-IS behavior.
SoT UI reconstructs and normalizes the candidate contract. Penpot materializes
the native visual projection for review.

### After promotion

A versioned SoT UI package becomes canonical for the promoted family. Astro
consumes a pinned package version; Penpot remains bound to the same contract and
accepted references. No independent visual fork is allowed.

## Fixture authority

Target:

```text
one canonical SoT UI fixture authority
→ typed factual fixture records
→ named scenarios/subsets
→ same IDs and hashes in Astro and Penpot per case
```

Current event evidence is split:

- 8-event component-certification corpus;
- 5-event archetype-core registry with different IDs.

This is not yet a proven unified Golden Corpus. Status:
`SOT_FIXTURE_AUTHORITY_UNIFICATION_OPEN`.

Different typed pools for events, festivals, clubs and artifacts and different
scenario subsets are allowed under one authority. Parallel unlinked event
registries are not a finished target.

## Component lineage

- masters/state catalogs belong on bounded library pages;
- archetypes use linked instances;
- page-local masters, detached copies and screenshots-as-components are
  forbidden;
- visual similarity does not prove technical ancestry;
- lineage requires source/version, component/main IDs, bindings and actual
  owner-instance readback.

Bounded centralization exists for several card and Rail scopes on PR `#53`, but
global lineage closure and owner acceptance remain open.

## Canonical current route

This branch:

- [Cross-branch current-state router](docs/static-site-design-system-current-state.md)
- [Documentation map](docs/index.md)
- [Execution sequence](docs/design-system-execution-sequence.md)
- [Progress checklist](docs/design-system-progress-checklist.md)

Active PR `#53`:

- [Detailed current-state router](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/static-site-design-system-current-state.md)
- [Review register](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/reviews/index.md)
- [Owner correction OV-59](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/reviews/owner-text-sot-ui-centrality-correction-20260829.md)
- [UI Source of Truth round trip](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/ui-source-of-truth-roundtrip.md)
- [Fixture authority](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/ui-reference-fixture-registry.md)

Static-site consumer:

- `events-bot-new#596/docs/features/static-site-pages/design-system/README.md`
- `events-bot-new#596/docs/features/static-site-pages/design-system/reference-fixture-scenarios.md`

## Instrument roles

```text
GitHub / SoT UI
  contracts, identities, fixtures, decisions, validation and receipts

Penpot
  native visual materialization, linked instances, comments and review exports

Astro
  executable consumer, generated pages, browser/device evidence and production
```

## Forbidden claims

Until corresponding gates close, do not claim:

- Penpot is central or directly controls Astro;
- automatic competing Penpot ↔ Astro authority;
- current 8-event and 5-event sets are already one proven Golden Corpus;
- all visual components share a proven accepted technical root;
- the design system is fully accepted/promoted;
- Draft candidate is production;
- green tests, screenshots or `validate()=[]` equal owner acceptance.

## Repositories

- Product/runtime source: `onedayonemasterpiece/events-bot-new`
- SoT UI contracts and delivery: `onedayonemasterpiece/lovekgd-design-system`

# Cross-research synthesis and adoption ledger

**Status:** `ADOPTED_FOR_EVIDENCE_COMPLETION`
**Scope:** synthesis of R-01…R-06 for the pre-defragmentation stage
**Not a status:** approved tokens, approved component merges, completed normalization or permission to delete legacy implementations

## 1. Source corpus

This synthesis does not replace or edit the six primary research reports:

- `01-normalization-charter-product-design-system.md`
- `02-external-best-practices-collection.md`
- `03-ui-component-defragmentation-best-practices.md`
- `04-external-evidence-corpus.md`
- `05-normalization-charter-lovekgd.md`
- `06-deep-ui-component-defragmentation-research.md`

Project evidence remains authoritative for what exists and for previously accepted product requirements. External design systems and articles supply candidate principles, not replacement requirements.

## 2. Correct operating model

The project is not operated as a conventional “small team” process. The relevant model is:

```text
one product authority
+ multiple automated coding/research/visual-review agents
+ GitHub Actions as deterministic evidence executor
+ machine-readable contracts and receipts
+ fail-closed promotion gates
```

Human headcount is therefore not a reason to reduce census, tests, migration tooling, telemetry, provenance or review coverage. Enterprise practices should be retained whenever they can be automated cheaply.

What should still be avoided is organizational ceremony that does not improve evidence: standing committees, waiting periods and manual coordination designed only for large human organizations.

The owner remains the authority for unresolved product semantics, visual direction and experiment decisions. Agents may prepare alternatives and evidence but may not invent those decisions.

## 3. Evidence precedence

For every normalization decision use this order:

1. Accepted product requirement or decision receipt
2. Verified current source/runtime behavior at a pinned commit
3. Normative accessibility/platform requirement
4. Project experiment evidence and metrics
5. External design-system convention or product precedent
6. Research inference

A historical document is not automatically current. Every requirement must be assigned a provenance status:

- `accepted-current`
- `implemented-current`
- `accepted-not-implemented`
- `experiment-unresolved`
- `historical-replaced`
- `proposal-only`
- `conflict`
- `unresolved`

Frequency, visual similarity and file identity are not proof of correctness or equivalence.

## 4. Principles adopted for the next stage

### 4.1 Component convergence

The unit of defragmentation is the user-task and behavior contract, not a screenshot or an Astro file.

A merge is allowed only after reconciliation of:

- semantic purpose;
- anatomy and content model;
- state machine and events;
- accessibility and focus contract;
- responsive/container behavior;
- media behavior;
- consumer responsibilities;
- lifecycle and experiment status.

Valid outcomes are:

- `merge`;
- `preserve_as_variant`;
- `preserve_as_composition`;
- `split`;
- `preserve_product_pattern`;
- `preserve_unresolved`;
- `deprecate`;
- `archive_experiment`;
- `promote_to_design_system`.

The target is not the smallest possible component count. The target is the smallest amount of accidental variation while retaining real product distinctions.

### 4.2 Canonical contract

A candidate canonical component contract must include:

- identity, purpose and explicit non-goals;
- anatomy, slots and subcomponents;
- props, defaults, valid values and invalid combinations;
- states, transitions and events;
- accessibility semantics and focus ownership;
- content limits and stress fixtures;
- responsive/container rules;
- media and loading/recovery behavior;
- supported extension points;
- lifecycle, compatibility and migration rules;
- representative test matrix.

A “winning implementation file” is not itself the contract.

### 4.3 Automated family-by-family migration

The adopted process is automation-first and reversible:

```text
automated census
→ family hypothesis
→ contract diff
→ decision record
→ candidate canonical contract
→ generated specimens and tests
→ compatibility/flag/wrapper where needed
→ automated consumer migration
→ no-new-legacy enforcement
→ production evidence
→ removal only after consumer closure
```

Parallel lanes are permitted, but each file family and artifact has one owner. Cross-lane inputs are immutable receipts, not untracked assumptions.

### 4.4 Typography

Adopt role-based typography and keep document semantics independent from visual roles.

Do not yet adopt:

- a fixed number of heading roles;
- a specific modular scale;
- fixed `clamp()` values;
- a universal 8 px foundation;
- another design system’s numeric type scale.

The next stage must map the complete raw project corpus, including Cyrillic stress fixtures, before target values are selected.

### 4.5 Media

Media policy is consumer- and content-semantic-specific. A global cover or a single global ratio is rejected.

The previously cited 3:2 / 2:3 / 1:1 set is only a partial decoder observation. It is not the complete project vocabulary. Project requirements and implementations already include additional roles such as 5:4 and 4:5, as well as intrinsic/source-ratio document and poster behavior.

Before normalization, build one provenance-aware media matrix covering every observed or required ratio, including at least:

- 5:4;
- 4:5;
- 3:2;
- 2:3;
- 1:1;
- intrinsic/source ratio;
- every other ratio found in source, requirements or history.

For every consumer record:

- surface and user task;
- accepted requirement source;
- current implementation and reachability;
- ratio and orientation;
- cover / contain / source-preserving behavior;
- OCR/document safeguards;
- focal point and safe-area rules;
- face/text crop guards;
- upscaling policy;
- missing/broken/tiny-source fallback;
- responsive art direction;
- current lifecycle status.

A ratio may be canonical for one surface and invalid for another.

### 4.6 Loading, skeleton and dynamic content

Reject the blanket rule “Astro SSG does not need skeletons.”

The correct rule is region-specific:

- A region fully present in initial HTML and not waiting for runtime data has no initial-loading state.
- A region with useful static fallback that is only reranked or refreshed should normally retain that content instead of blanking it with a skeleton.
- A genuinely client-loaded region with predictable final geometry may use a skeleton matching the resolved component.
- Search, personalization, recommendations, favorites and other dynamic regions must be classified by their actual data and hydration contract.

Existing skeleton implementations and accepted skeleton requirements are project evidence and must be decoded, not replaced by a generic external rule.

Required state vocabulary:

- `static_resolved`;
- `initial_loading`;
- `skeleton`;
- `inline_refresh`;
- `stale_refresh`;
- `partial`;
- `empty`;
- `error`;
- `retrying`;
- `offline`;
- `unavailable`;
- `success`.

For every dynamic region record the initial HTML, data source, fetch trigger, usable fallback, expected geometry, current skeleton/spinner, resolved component, recovery states, accessibility announcements and actual runtime evidence.

### 4.7 Rails, sticky/fixed, overlays and selection

Keep separate contracts for:

- user-controlled content rail;
- paged or auto-rotating carousel;
- sticky/fixed surface;
- disclosure/navigation menu;
- action menu;
- popover;
- modal dialog;
- non-modal drawer;
- radio/segmented choice;
- tabs;
- select/listbox/combobox;
- checkbox/switch.

Visual similarity is not sufficient to merge these semantics.

### 4.8 Experiments and historical variants

No treatment becomes canonical without an accepted decision receipt or product evidence.

For unresolved CTA and transport variants:

- preserve each treatment;
- capture it on equal fixtures;
- classify reachability and lifecycle;
- record winner: none until a decision exists;
- do not delete or silently merge it.

### 4.9 Automated governance

Adopt the following machine-enforced mechanisms:

- AST/import and runtime consumer census;
- generated contract/schema validation;
- generated state/specimen matrix;
- visual, interaction, accessibility and responsive checks;
- requirement-to-implementation provenance ledger;
- immutable artifacts with hashes and run IDs;
- lint/no-new-legacy gate only after a replacement exists;
- usage and override reports;
- independent audit lane;
- reversible migration and rollback receipt.

Manual spreadsheets, committees and waiting periods are not required when equivalent controls are automated.

## 5. Claims explicitly not adopted

The following research outputs remain hypotheses or are rejected as project rules until project evidence proves them:

- “the project is a small-team process” as a reason to reduce automation or evidence;
- exactly 3, 4, 6 or 7 typography roles;
- Balanced typography as the selected winner;
- an 8 px spacing scale as already accepted;
- 16:9 as the default Event Hero ratio;
- 3:2 / 2:3 / 1:1 as the complete media vocabulary;
- no skeleton on static pages regardless of dynamic regions;
- automatic merge of mobile and desktop EventCard implementations;
- automatic archive of an experiment merely because no winner receipt was found;
- automatic conversion of every horizontal surface to scroll-snap;
- fixed z-index values copied from external systems;
- headless architecture as a mandatory target for every component.

## 6. Evidence still required before physical defragmentation

- Complete requirement archaeology across product docs, source, history, PRs, labs and receipts.
- Complete media-ratio and crop-policy provenance, including 4:5 and 5:4.
- Complete inventory of dynamic regions and existing skeleton/loading implementations.
- Runtime action packets and raster evidence for loading, menus, overlays, selection, rails and sticky/fixed transitions.
- Equal-fixture evidence for all transport and CTA experiment treatments.
- Full typography/style histogram and semantic mapping.
- Agent visual-review ledger for every new raster.
- Independent final audit with no planned item reported as captured.

## 7. Next gate

The only acceptable completion status of the current evidence stage is:

```text
READY_FOR_PROJECT_NORMALIZATION_SYNTHESIS
```

It does not mean:

```text
READY_FOR_PHYSICAL_DEFRAGMENTATION
NORMALIZATION_APPROVED
TOKENS_ACCEPTED
DESIGN_SYSTEM_COMPLETE
```

After this gate, the next artifact is a project-specific candidate Normalization Charter and family decision dossiers. Physical merges, deletions and token migrations remain separate reversible changes.

## 8. Behavioral supplement v1.1 evidence-adoption receipt

This section is a living, append-only adoption ledger. It does not modify R-01…R-06 and does
not create a new research report. The initial R-07 source was seeded from SHA-256
`bc9ba8960fbab631a1d9c317b9a87a00fef74f38e64761021684f1ccc2832ec1`.

### Pending receipt contract

Status: **PENDING REVIEWED FINAL SUPPLEMENT IMPORT**

The receipt may change to `ADOPTED_AS_PROJECT_EVIDENCE` only when all fields below are filled
from published evidence and the repository validator passes. No run, artifact, asset or audit
identifier is invented at scaffold time.

| Required field | Pending value / acceptance rule |
|---|---|
| sibling compact path | `catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/`; must not be nested in immutable v1 |
| immutable v1 identity | manifest SHA-256 `f7740f7f533c3f0cda5d4d0b8ebe98b565d7f521368b96462daecbd26522d5cc`; Git tree `e77fc2457fadfdffb46ed2d90304ebb91e89a715` |
| exact product source | pending verification against the supplement receipt |
| source/integration commit | pending exact commit and tree |
| GitHub Actions run | pending successful run URL, run ID and attempt |
| Actions artifact | pending artifact ID, URL, digest, byte size, creation and expiry timestamps |
| durable evidence | pending GitHub Release tag/asset URL, asset ID, SHA-256 and byte size |
| capture totals | pending validator-confirmed packet/executable/blocker/observation/raster totals |
| visual review | pending one full-resolution ledger row per raster; hashes/contact sheets are not review substitutes |
| independent audit | pending reviewer, audited commit, report SHA-256 and `PASS` |
| secret scan | pending `PASS` |
| final status | must equal `READY_FOR_PROJECT_NORMALIZATION_SYNTHESIS` |
| repository validation | pending PASS of both v1 and behavioral v1.1 validators plus immutable-tree assertion |

Even after adoption, every component/experiment decision remains `NOT_MERGED`. This receipt
does not authorize component merge/split/delete, typography or color normalization, token
selection, an experiment winner, Penpot mutation or production Astro/CSS/JS changes. Observed
conflicts remain evidence for the later project-specific synthesis rather than silent fixes.

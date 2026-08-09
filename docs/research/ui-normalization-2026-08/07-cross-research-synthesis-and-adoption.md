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

### Adopted evidence receipt

Status: **ADOPTED_AS_PROJECT_EVIDENCE · `EVIDENCE_COLLECTION_INCOMPLETE`**

This append-only receipt is the current evidence-stage status. Section 7 names the desired next
gate; it is not achieved while the two readiness blockers below remain open.

| Receipt field | Verified value |
|---|---|
| sibling compact path | `catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/`; sibling, never nested in immutable v1 |
| compact identity | manifest SHA-256 `c6c62cee8bea4e9440ff85bc75c46bc85cf5abf3e2fdcd4c7357c6ece916436f`; receipt SHA-256 `188e433e1cb5061dd3b2a74bf5f713ed0b59f4cbd24a3e464f7c0f0d26997d31`; supplement tree `b558869473397a51d03e4f87220e6a1889a088ea` |
| immutable v1 identity | manifest SHA-256 `f7740f7f533c3f0cda5d4d0b8ebe98b565d7f521368b96462daecbd26522d5cc`; Git tree `e77fc2457fadfdffb46ed2d90304ebb91e89a715` |
| exact product source | `events-bot-new@ef7aa62e45c60f7a12da6160f490719c0721ec03` |
| decoder/materializer | capture `c9ddf0feafcd80f6fc3aef0f221e8d5e058063ab`; reviewed materializer `ec9ae943675a1098e95515cc8c41f2418c659630` |
| design import | commit `7da6cfb18763e34a81b4890249e490e0945e9a07`; root tree `558c7b82d5da780f936a122bac0f546b5fef40af` |
| GitHub Actions run | [run 31318132051](https://github.com/onedayonemasterpiece/events-bot-new/actions/runs/31318132051), attempt 1, success |
| Actions artifact | ID `9039433060`; `current-ui-behavioral-decoder-v1-1-capture-31318132051`; digest `sha256:c677f69572ccdbf5b7f1402037a3cb8c164bd2f503fae35eae9168c46eb8d909`; 44,805,665 bytes; created `2026-08-09T14:25:40Z`; expires `2026-09-08T14:25:38Z` |
| durable evidence | [GitHub Release](https://github.com/onedayonemasterpiece/events-bot-new/releases/tag/current-ui-behavioral-decoder-v1-1-run-31318132051); asset ID `507595606`; same SHA-256 and 44,805,665 bytes |
| capture totals | 67 packet plans; 57 captured/reviewed; 10 explicit blockers; 124 observations; 124 page-verification rows; 124 raster files |
| visual review | 124/124 individually opened full-resolution; ledger SHA-256 `97c8cbcf2e4bbc34fd7e8c03454f09219bfb723acd4751b89744d6a8eb0f7731`; perceptual/byte stability is not review |
| visual findings | 99 capture-valid rows and 25 explicit conflicts: 19 title overlaps, 2 indistinguishable loading/error, 2 bottom-nav restoration, 1 clipped TimeNav popover, 1 broken-image alt overflow |
| independent audit | `PASS` for truthful incomplete evidence import; reviewer `Archimedes (/root/behavioral_final_audit)`; audit commit `770a9138a63da1dbc2aa5a9b7df7fdacf25e2518`; report SHA-256 `977d62214aa0e7158199b9b4e726fac2b77b92e2a264010e85610a7b4a1475cd` |
| secret/integrity scans | `PASS`; archive `unzip -t` and 179/179 entry byte comparison PASS; zero strict key/JWT/Bearer/query-token findings in 58 non-PNG files |
| final status | `EVIDENCE_COLLECTION_INCOMPLETE` |
| readiness blockers | `unresolved.behavior-blocker.864db42986f38970b1` (rail native `End`/`Home`); `unresolved.behavior-blocker.fdec1149e1f0d6b359` (293-row per-probe runtime coverage) |
| repository validation | immutable v1 validator PASS; behavioral v1.1 validator PASS (`67/57/10/124/124`); immutable v1 tree assertion PASS |

Even after adoption, every component/experiment decision remains `NOT_MERGED`. This receipt
does not authorize component merge/split/delete, typography or color normalization, token
selection, an experiment winner, Penpot mutation or production Astro/CSS/JS changes. Observed
conflicts remain evidence for the later project-specific synthesis rather than silent fixes.
The two readiness blockers prevent `READY_FOR_PROJECT_NORMALIZATION_SYNTHESIS`; the 25 other
visual conflict rows are retained non-readiness evidence, not silently reclassified blockers.

## 9. Behavioral closure supersession receipt

Section 8 preserves the first append-only import receipt. Its two evidence blockers and incomplete
status are superseded by the exact closure at `events-bot-new@66bc0d43e36299417626f992021cfb7299ddf704`:

- Actions run `31327863197`, capture head `14be44b108ab4bd0b20d6dd95a20bcc4250adb95`;
- decoded UI source `ef7aa62e45c60f7a12da6160f490719c0721ec03`;
- final manifest SHA-256 `c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1`;
- 293 terminal probes: 236 PASS, 39 MISMATCH, 18 UNREACHABLE_WITH_REASON;
- 87 unresolved findings, zero readiness blockers;
- 134/134 full-resolution raster reviews;
- final evidence status `READY_FOR_PROJECT_NORMALIZATION_SYNTHESIS`.

The closure authorizes only the project-specific analytical synthesis. It does not change any
candidate contract from `NOT_MERGED`, select an experiment winner, accept foundations, mutate
production UI, remove legacy, or change Penpot.

# L1 source reconciliation results

## Status

`COMMITTED` — source drift, technical reconciliation, media policy, and the authorized minimal integrated taxonomy/plan deltas are complete.

## Lane contract

- Lane ID: `apply-synthesis-source-reconciliation`
- Requirement IDs: `L1-SOURCE-DRIFT-107`, `L1-IMPORT-CONSUMER-EDGES`, `L1-TECHNICAL-QUEUE-6`, `L1-MEDIA-POLICY`, `L1-INTEGRATED-RECLASSIFICATION`
- Base SHA: `8bf4ad465cbd9d943935c201378b867a5d539456`
- Implementation head SHA: `3773f55412a894cf2b22c068698e92c90cf73eec`
- Branch: `agent/apply-component-synthesis-v0-1/source-reconciliation`
- Worktree: `/home/dev/.codex/worktrees/lovekgd-design-system/apply-synthesis-source-reconciliation`

## Source checkpoints

- Design-system current `origin/main`: `c59a3576c7361c1953b31ad9b98ed096640e92c7`
- Events current `origin/main`: `96784bd572c03b965f303366c4ff0bb85d1b9a3f`
- Events synthesis-observed SHA: `a161061d8161409566412db2b1909031949dc104`
- Events decoder-pinned SHA: `66bc0d43e36299417626f992021cfb7299ddf704`
- `events-bot-new` was read only.

## Evidence and counts

- Exact mapped source paths checked: **107/107** exist at decoder, synthesis-observed, and current events main.
- Observed-to-current blob drift: **0**.
- Decoder-to-current blob drift: **1**, bounded nonmaterial instrumentation in `site/src/components/UnusualListingSurface.astro` (`data-unusual-feed` and `data-unusual-event-id` only).
- Import/consumer edge drift: **0** at both comparison boundaries.
- Technical queue: **6/6 terminal** — `PASS=1`, `PASS_WITH_DECLARED_VARIANT=1`, `RECLASSIFIED_WITH_EVIDENCE=4`, `BLOCKED_EXTERNAL_EVIDENCE=0`.
- Owner questions: **0**; owner ambiguity count: **0**.
- Media-policy cells: **35**, covering all required semantics, source conditions, ratios, fit, focal/safe-area, loading/reservation, missing/broken/tiny-source behavior.
- Integrated entities: **111**; exact mappings: **107**; archetypes: **18**.
- Post-reconciliation W1–W4: **65** entities with counts **16/14/17/18**; original package count **61** is retained as provenance.
- Experiment decision: `TECH-TRANSPORT-EXPERIMENT-001.resolution.experiment_decision = NOT_MERGED`; all non-experiment rows are `null`.

## Authorized integrated deltas

- Added separate `listing.event-card`; removed the stale `listing` layout axis from `event.card`.
- Promoted `event.list-item` to a source-proven candidate component.
- Reclassified `event.token-medallions` as a product pattern/composition.
- Folded the unreferenced mobile-search wrapper into `navigation.mobile-tab-bar[current=search]`.
- Retargeted only source-proven listing archetype consumers; generic `event.card` references remain unchanged.
- Added `core.dialog` and page `10 — Brand assets` to W1.
- Preserved `core.rail` in W3 while declaring its deterministic prerequisite subpass before W2 `event.media-rail`.
- Updated derived metrics, validation report, and human synthesis documentation to the reconciled truth.
- Immutable ZIP and original manifest bytes were not changed.

## Changed files

- `catalog/normalization/component-synthesis-v0.1/source-drift-ledger.jsonl`
- `catalog/normalization/component-synthesis-v0.1/technical-reconciliation-results.jsonl`
- `catalog/normalization/component-synthesis-v0.1/media-policy-matrix.jsonl`
- `catalog/normalization/component-synthesis-v0.1/entity-registry.jsonl`
- `catalog/normalization/component-synthesis-v0.1/current-to-candidate-mapping.jsonl`
- `catalog/normalization/component-synthesis-v0.1/current-to-candidate-mapping.csv`
- `catalog/normalization/component-synthesis-v0.1/component-hierarchy.json`
- `catalog/normalization/component-synthesis-v0.1/page-archetype-registry.jsonl`
- `catalog/normalization/component-synthesis-v0.1/penpot-materialization-plan.json`
- `catalog/normalization/component-synthesis-v0.1/metrics.json`
- `catalog/normalization/component-synthesis-v0.1/validation-report.json`
- `docs/normalization/apply-component-synthesis-v0.1.md`
- `docs/normalization/full-component-synthesis-v0.1.md`
- `.codex/lanes/apply-synthesis-source-reconciliation/RESULTS.md`

## Commands and validation

- `git ls-remote origin refs/heads/main`
- `git -C /home/dev/projects/events-bot-new ls-remote origin refs/heads/main`
- exact `git ls-tree` / `git show` blob checks for the 107 mapped paths
- bounded `git archive` snapshots plus static import/consumer-edge extraction
- `python3 /tmp/validate_l1.py` → `PASS`
- JSON/JSONL parse and JSONL↔CSV equivalence checks
- mapping, nested-reference, hierarchy, archetype, cycle, wave-membership, dependency-subpass, result-enum, experiment, media-cell, metrics, and validation-report consistency checks
- `git diff --check` → clean

Validation result:

```text
source_paths 107
decoder_deltas 1
post_synthesis_deltas 0
entities 111
mappings 107
technical 6
media_cells 35
archetypes 18
wave_counts 16/14/17/18
owner_ambiguity_count 0
integrated derived/edge/axis checks PASS
```

## Risks and integration notes

- Current `EventListItem.astro` makes the article focusable while also containing nested anchors; runtime implementation should repair and test that focus topology before promotion.
- The media matrix records a candidate broken-state delta for `EventHero`; it does not claim that behavior is already implemented in runtime.
- The exact events-main SHA is a checkpoint. The integrator must fail closed and rerun the source SHA/drift gate if events `origin/main` changes before PR closure.
- L2 must regenerate contracts/fixtures against the reconciled 65-entity W1–W4 plan.
- No production source, runtime UI, Resource Graph, Penpot file, schema, script, test, receipt, ZIP, or original manifest was modified by this lane.
- Blockers: **none**.

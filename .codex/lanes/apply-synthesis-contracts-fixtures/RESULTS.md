# Lane apply-synthesis-contracts-fixtures Results

## Status

committed

## Requirement IDs

- L2
- W1–W4 candidate component contracts
- W1–W4 fixture coverage and bindings
- Draft 2020-12 schema and exact-set/FK verification

## Branch

`agent/apply-component-synthesis-v0-1/contracts-fixtures`

## Worktree

`/home/dev/.codex/worktrees/lovekgd-design-system/apply-synthesis-contracts-fixtures`

## Effort

High. This lane owns a strict schema and cross-record foreign keys, so it would merit extra-high/max effort in a runner exposing that level.

## Base SHA

`8bf4ad465cbd9d943935c201378b867a5d539456`

## Head SHA

Final implementation checkpoint: `5b8623c64cce0cdbd97f08a6e662aa58b8efd42c` (initial bulk checkpoint `c4d576bf204e7fd332f6d2719587708d64911f31`).

The branch-tip commit after this evidence file is added is reported in the lane handoff; a commit cannot embed its own SHA without changing that SHA.

## Output counts

- W1: 16 candidate contracts.
- W2: 14 candidate contracts.
- W3: 17 candidate contracts.
- W4: 18 candidate contracts.
- Total candidate contracts: 65.
- Exact entity fixture bindings: 65.
- Fixture catalog records: 39.
  - Russian text: 5.
  - Viewports: 5.
  - Counts: 4.
  - Runtime states: 12.
  - Consumer-scoped media: 13.
- Schema files: 1 Draft 2020-12 schema.

The output consumes the stable L1 reconciliation set: `core.dialog`, `event.list-item`, `listing.event-card`, and `event.token-medallions` are materializable; the mobile-search wrapper is not a separate master.

## Files changed

- `contracts/normalization/component-synthesis-contract.v0.1.schema.json`
- `catalog/normalization/component-synthesis-v0.1/contracts/index.json`
- `catalog/normalization/component-synthesis-v0.1/contracts/*.contract.json` — 65 exact W1–W4 files enumerated and hashed by `contracts/index.json`.
- `catalog/normalization/component-synthesis-v0.1/fixtures/fixture-catalog.json`
- `catalog/normalization/component-synthesis-v0.1/fixtures/entity-fixture-bindings.json`
- `.codex/lanes/apply-synthesis-contracts-fixtures/RESULTS.md`

No scripts, tests, receipts, base registry, mappings, hierarchy, archetypes, or production source were edited in this lane.

## Contract coverage

Every contract records:

- stable ID, wave, entity kind, semantic purpose and candidate disposition;
- fail-closed reconstructed status (`canonical=false`, `accepted=false`, `promotion_ready=false`);
- source-backed anatomy, materialization fixture prop, registry axes as props, content/component slots and native nested-instance references;
- native variant/state axes, allowed-combination policy and invalid-combination guards;
- responsive/container behavior without new numeric tokens;
- Russian short/long/multiline/numeric/missing-optional content fixtures and applicable count fixtures;
- accessibility requirements, exact source mappings, entity consumers and archetype consumers;
- fixture plan, consumer-specific media requirements and loading/recovery rules;
- Resource Graph page/stable-plugin binding placeholders with detached copies and screenshot masters forbidden.

The index provides an exact contract set, per-file SHA-256 hashes, and a dependency-first deterministic `materialization_order`. In particular, `core.rail` precedes its W2 consumer `event.media-rail`.

## Fixture and media coverage

- Fixture dimensions exactly match the materialization plan for text, viewport, count and runtime-state sets.
- The 13 existing evidence fixtures cover the required media tags exactly: landscape photo, portrait poster, square, artwork with text, OCR document, unknown text, missing, broken and tiny source.
- Ratio coverage includes `4:5`, `5:4`, `3:2`, `2:3`, `1:1` and `intrinsic/source`; fit coverage includes `cover` and `contain`.
- Focal point, safe area, primary media, poster companion, small previews, missing, broken, tiny-source, loading and layout-reservation evidence remains bound to the existing consumer/fixture corpus.
- No global ratio, fit, focal, safe-area or upscale policy is selected.
- Useful static Astro HTML always has `static_html_skeleton=false` / `static_html_skeleton=forbidden`.
- Skeleton fixtures are bound only to the two registry-proven client-wait regions: `search.event-search` and `personal-feed.slot`.

## Commands run

```text
cat /home/dev/.agents/skills/feature-fanout/SKILL.md
sed -n ... docs/normalization/apply-component-synthesis-v0.1.md
sed -n ... docs/normalization/full-component-synthesis-v0.1.md
python3 /tmp/generate_component_contracts.py
SYNTHESIS_SOURCE_BASE=/home/dev/.codex/worktrees/lovekgd-design-system/apply-synthesis-source-reconciliation/catalog/normalization/component-synthesis-v0.1 python3 /tmp/generate_component_contracts.py
python3 -m json.tool contracts/normalization/component-synthesis-contract.v0.1.schema.json
find catalog/normalization/component-synthesis-v0.1/contracts catalog/normalization/component-synthesis-v0.1/fixtures -type f -name '*.json' -print0 | xargs -0 -n1 python3 -m json.tool
python3 <inline Draft202012Validator plus exact-set/FK/status/coverage/topology checks>
git diff --check
git add -- <owned paths only>
git commit -m "feat(normalization): add synthesis candidate contracts and fixtures"
```

## Tests / verification

Final targeted result before the implementation commit:

```text
PASS contracts=65 bindings=65 fixtures=39 materialization_order=65 schema=draft-2020-12
```

Verified:

- the schema itself is valid Draft 2020-12;
- all 65 contracts validate;
- contract set equals the reconciled W1–W4 plan exactly;
- binding set equals the contract set exactly;
- contract index SHA-256 values match file bytes;
- every nested entity, consumer requirement and fixture reference resolves;
- dependency-first materialization order is acyclic and complete;
- every status guard is false as required;
- materialization fixture requirement sets are exact;
- media ratios/fits/states and requirement tags are covered;
- artificial static-HTML skeletons are absent;
- all JSON parses and `git diff --check` passes.

## Risks

- Contracts were generated against L1's stable 65-entity reconciliation output before that lane's final integration. Integration must apply the L1 registry/reconciliation commit before this lane and rerun the integrated validator; a changed L1 exact set should fail closed rather than be silently accepted.
- Penpot component UUID fields intentionally remain `null` placeholders in this lane. Live mutation/read-back and the binding receipt belong to the Penpot materialization lane.
- Existing Event Media consumer requirements are preserved by reference rather than normalized into a global media rule.
- Viewport dimensions are fixture evidence copied from the supplied plan; they are not promoted as numeric design tokens.

After the first checkpoint, regeneration against L1's latest stable files removed the obsolete `event.card[layout=listing]` value. That final split-identity alignment is commit `5b8623c64cce0cdbd97f08a6e662aa58b8efd42c`; `listing.event-card` is the only listing-card identity contract.

## Merge notes

Cherry-pick the implementation commit and this results-only commit after the L1 source-reconciliation commit. The validator lane should discover `catalog/normalization/component-synthesis-v0.1/contracts/*.contract.json`, exclude `index.json` from per-contract schema validation, verify index hashes/order, and join both fixture documents fail-closed.

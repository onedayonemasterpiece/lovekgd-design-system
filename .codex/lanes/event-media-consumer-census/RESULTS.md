# Lane event-media-consumer-census Results

## Status

Committed on the assigned branch. The authoritative head is the branch tip
containing this receipt; resolve it with:

```bash
git rev-parse agent/event-media-contract-decision-v1/consumer-census
```

## Requirement IDs

- **R01 — Done:** exhaustive Event Media consumer/requirement census.
- **R02 — Done:** semantic media type ledger with orthogonal asset,
  placement, state and output axes.

## Scope

- Branch: `agent/event-media-contract-decision-v1/consumer-census`
- Worktree:
  `/home/dev/.codex/worktrees/lovekgd-design-system/event-media-consumer-census`
- Base: `a85737a33557e13a2263a083abd9a1b1afc83544`
- Read-only project authority:
  `onedayonemasterpiece/events-bot-new@66bc0d43e36299417626f992021cfb7299ddf704`
- Behavioral v1.1 manifest SHA-256:
  `c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1`

Only the three assigned files were changed. No contract, validator, receipt,
immutable snapshot, documentation, Penpot, prototype or production file was
edited.

## Files changed

- `catalog/normalization/event-media/consumer-requirement-matrix.jsonl`
- `catalog/normalization/event-media/semantic-media-types.jsonl`
- `.codex/lanes/event-media-consumer-census/RESULTS.md`

## Census definition and cardinality

An application row is unique by
`(lifecycle cohort, route/surface family, source renderer, composition
placement, responsive branch)`. Route aliases sharing one renderer and policy
are grouped. Missing/broken/loading behavior remains a policy cell unless the
source has a standalone skeleton UI.

- **52 application rows exactly**
  - **37** active production/social source applications;
  - **15** current-source lab, hidden, dormant or deprecated applications.
- Rows are sorted by stable ID and serialize as canonical compact JSONL.
- Every row includes consumer/routes, exact source component and commit,
  semantic axis assignments, composition placement, aspect ratio and
  rendered/intrinsic geometry, cover/contain/source behavior, crop, focal,
  safe area, object position, tiny/upscale, loading/skeleton,
  missing/broken, responsive art direction, accessibility, authority,
  runtime evidence and lifecycle.
- Every policy cell carries evidence references. Each row also has non-empty,
  pinned provenance channels for current source, requirements, tests,
  fixtures, Decoder v1, Behavioral Decoder v1.1, Git history and experiments.
  Provenance reference lists are deterministically de-duplicated while
  preserving first-seen evidence order.

The application ratio vocabulary is exact and intentionally consumer-local:
`4:5`, `5:4`, `3:2`, `2:3`, `1:1`, `intrinsic/source`, `16:10`, `27:20`,
`6:5`, `4:3`, `3:4`, `11:13`, `29:26`, `40:21`, mobile packed-row range
`31:56..199:112`, three intrinsic/clamped or bounded variants, four
non-fixed/source-derived variants, `source-or-generated-4:5`, and
`viewport-cover/unspecified-source`. No target ratio or global ratio token is
selected.

## Semantic ledger and adjacent exclusions

The ledger has **18** in-boundary records:

- 5 asset semantics: visual-only photography, portrait poster, meaningful
  textual artwork, OCR/document and unknown-text mode;
- 8 placement semantics: event hero, EventCard preview, compact
  listing/search media, primary gallery, gallery preview, poster companion,
  gallery recommendation backdrop and exhibition deck media;
- 3 state semantics: no-image fallback, broken-media fallback and loading
  skeleton media frame;
- 2 output semantics: share/social media and current Open Graph source media.

Photography, poster, artwork, OCR/document and unknown-text are not collapsed.
Every ledger record uses an allowed entity-kind candidate, binds its consumer
applications, states explicit non-goals, points at the future boundary model,
and remains `NOT_MERGED`, unaccepted and under Product Value Gate `observe`.

Five adjacent records are explicit boundary exclusions and are **not** part of
the 52 application rows:

1. festival chronology/timeline media;
2. interest-club cover media;
3. amber artifact imagery;
4. Event Token Medallion imagery;
5. transport map/icon media.

Each exclusion has `census_included=false`,
`excluded_from_52_application_count=true`, an unresolved-boundary entity kind,
a boundary-model reference, adjacent family references, pinned source
authority, observed adjacent-only geometry/ratios and a reason for exclusion.

## Deterministic validation

Lane-local check (kept inline because this lane did not own a validator file):

```bash
python3 - <<'PY'
import collections, hashlib, json
from pathlib import Path

matrix_path = Path('catalog/normalization/event-media/consumer-requirement-matrix.jsonl')
semantic_path = Path('catalog/normalization/event-media/semantic-media-types.jsonl')

def load(path):
    lines = path.read_text(encoding='utf-8').splitlines()
    rows = [json.loads(line) for line in lines]
    assert lines == [json.dumps(row, ensure_ascii=False, separators=(',', ':'), sort_keys=True) for row in rows]
    assert [row['id'] for row in rows] == sorted(row['id'] for row in rows)
    assert len({row['id'] for row in rows}) == len(rows)
    return rows

matrix, semantic = load(matrix_path), load(semantic_path)
assert hashlib.sha256(matrix_path.read_bytes()).hexdigest() == 'b3f041ad3e64cce6c4690c84a12515fbdef6f8ce649ab85fecc9d03c3d89c009'
assert hashlib.sha256(semantic_path.read_bytes()).hexdigest() == '8989734d1057fb3785dbd05403d7803c052de804eb798e3faeb21b56208e81ee'
assert len(matrix) == 52
assert collections.Counter(row['census_cohort'] for row in matrix) == {
    'active_production_social': 37,
    'current_source_nonproduction': 15,
}
required_cells = {
    'consumer', 'routes', 'source_component', 'semantic_media_types',
    'semantic_axis_assignments', 'layout_composition_placement',
    'aspect_ratio_policy', 'geometry', 'fit_policy', 'crop_permission',
    'focal_point_policy', 'safe_area_policy', 'object_position_policy',
    'upscale_tiny_source_policy', 'loading_skeleton_policy',
    'missing_broken_fallback_policy', 'responsive_art_direction',
    'accessibility_alt_behavior', 'requirement_authority',
    'runtime_evidence', 'lifecycle_status',
}
policy_cells = required_cells & {
    'geometry', 'fit_policy', 'crop_permission', 'focal_point_policy',
    'safe_area_policy', 'object_position_policy',
    'upscale_tiny_source_policy', 'loading_skeleton_policy',
    'missing_broken_fallback_policy', 'responsive_art_direction',
    'accessibility_alt_behavior',
}
provenance = {
    'current_source', 'requirements', 'tests', 'fixtures', 'decoder_v1',
    'behavioral_decoder_v1_1', 'git_history', 'experiments',
}
semantic_rows = [row for row in semantic if row['record_kind'] == 'semantic_media_type']
exclusions = [row for row in semantic if row['record_kind'] == 'adjacent_boundary_exclusion']
semantic_ids = {row['id'] for row in semantic_rows}
for row in matrix:
    assert required_cells <= row.keys() and row['routes']
    assert row['source_component']['commit'] == '66bc0d43e36299417626f992021cfb7299ddf704'
    assert set(row['cell_level_provenance']) == provenance
    assert all(row['cell_level_provenance'][key]['refs'] for key in provenance)
    assert all(
        len(row['cell_level_provenance'][key]['refs'])
        == len(dict.fromkeys(row['cell_level_provenance'][key]['refs']))
        for key in provenance
    )
    assert all(row[key]['evidence_refs'] for key in policy_cells)
    assert row['aspect_ratio_policy']['target_ratio_selected'] is False
    assert all(ratio['global_token_selected'] is False and ratio['evidence_refs'] for ratio in row['aspect_ratio_policy']['ratios'])
    assigned = {item for values in row['semantic_axis_assignments'].values() for item in values}
    assert assigned <= semantic_ids
    assert row['decision'] == 'NOT_MERGED' and row['normalization_allowed'] is False
    assert row['product_value_gate_mode'] == 'observe' and row['promotion_ready'] is False
ratios = {ratio['notation'] for row in matrix for ratio in row['aspect_ratio_policy']['ratios']}
assert {'4:5', '5:4', '3:2', '2:3', '1:1', 'intrinsic/source'} <= ratios
assert len(ratios) == 24 and len(semantic_rows) == 18 and len(exclusions) == 5
assert all(row['census_included'] is False and row['excluded_from_52_application_count'] is True and row['boundary_model_ref'] for row in exclusions)
print('PASS: matrix=52 active=37 lab_dormant=15 provenance_ref_duplicates=0 semantic=18 adjacent_exclusions=5 ratios=24 canonical_jsonl=yes gates=observe/NOT_MERGED')
PY
```

Result:

```text
PASS: matrix=52 active=37 lab_dormant=15 provenance_ref_duplicates=0 semantic=18 adjacent_exclusions=5 ratios=24 canonical_jsonl=yes gates=observe/NOT_MERGED
```

Additional provenance resolution used inline Python with `git cat-file -e`
and `git show` against the exact project commit, plus local existence checks
for immutable design-snapshot references:

```text
PASS: source_refs=142 history_commits=2 design_snapshot_refs=46 missing=0 out_of_range=0
```

The authored output contains bounded structured records only: no raw HTML,
large source records, fixture bodies, screenshots or raster bytes are copied.

## Commands run

- `python3 /tmp/build_event_media_l1.py` (author-only temporary assembler;
  outside the repository and not part of the deliverable)
- the inline deterministic validator reproduced above
- inline Python provenance resolver using `git cat-file -e` / `git show`
- `sha256sum catalog/normalization/event-media/*.jsonl`
- `git diff --cached --check`

## Risks and honest gaps

- Active-source reachability is not production observation. Every runtime row
  remains `production_equivalent=false` and `production_observed=false`.
- Primary/gallery/listing/companion broken-state convergence, tiny-source
  ceilings, focal/safe-area handling and alternate-source art direction remain
  consumer-specific or unproven where the evidence says so.
- Static versus hydrated EventCard ratios and several lab/dead source branches
  intentionally remain visible instead of being normalized away.
- Meaningful textual artwork has no dedicated pinned source enum and therefore
  fails closed as protected text/document pending owner taxonomy.
- Share canvas is implemented only at 1080x1350; required durable 1200x630 and
  1080x1080 outputs remain gaps. Open Graph still binds source media.
- Boundary-model IDs are forward references for the integration-owned boundary
  lane. They must be reconciled by ID, not converted into accepted identities.

## Merge notes

- Cherry-pick the branch tip; there are no generated scripts or overlapping
  production changes.
- Preserve the exact 52-row definition and keep all five adjacent exclusions
  outside the application count.
- Cross-check all `boundary_model_ref` values after the boundary lane merges.
  Do not interpret reference resolution as owner acceptance.
- Re-run the inline validator after integration. A changed JSONL hash requires
  an intentional census review and this receipt to be updated together.

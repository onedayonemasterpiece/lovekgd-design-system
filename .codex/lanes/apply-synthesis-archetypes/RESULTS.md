# Lane Results — apply-synthesis-archetypes

## Scope

- Lane ID: `apply-synthesis-archetypes` (`L3`)
- Requirements: exact 18 page-archetype candidate graphs; component/pattern instances or explicit gaps only; mobile/desktop applicability; instance graph; state matrix; source consumer links; fixture links; reconstructed/unaccepted/unpromoted status; Draft 2020-12 schema; exact ID, FK, reachability, cycle and graph integrity.
- Writable scope used:
  - `catalog/normalization/component-synthesis-v0.1/archetypes/**`
  - `contracts/normalization/component-synthesis-archetype.v0.1.schema.json`
  - `.codex/lanes/apply-synthesis-archetypes/RESULTS.md`
- Forbidden files changed: none.

## Git evidence

- Base SHA: `8bf4ad465cbd9d943935c201378b867a5d539456`
- Implementation head SHA: `f9923e09344c7d5e6cd3ba5d1e7cddcb139255b4`
- Branch: `agent/apply-component-synthesis-v0-1/archetype-ir`
- Implementation commit: `f9923e09344c7d5e6cd3ba5d1e7cddcb139255b4` (`feat(normalization): add component synthesis archetype IR`)
- This results record is committed separately after the implementation checkpoint; the final lane branch SHA is reported to the integrator after that commit.

## Delivered evidence

- Exactly 18 graph files under `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/`.
- `catalog/normalization/component-synthesis-v0.1/archetypes/index.json` records canonical paths, SHA-256 per graph, exact registry SHA-256 and aggregate counts.
- `contracts/normalization/component-synthesis-archetype.v0.1.schema.json` is a strict JSON Schema Draft 2020-12 contract with `additionalProperties: false` object boundaries.
- Index SHA-256 after W1–W4 closure: `f69121637968fd7b3d759fbd786a090369ce03d9744667dffd12acb53391cd07`.
- Schema SHA-256: `a0ab24bf9e7f6274f5ac9c86bda025681fad321110237ce8806424fa6271aeed`.

### Counts

- Archetypes: `18`
- Fixtures: `75`
- Native component/pattern instance nodes: `349`
- Explicit gap placeholders: `12`
- State-matrix rows (viewport × state): `132`
- Detached copies: `0`
- Local overrides: `0`

### Explicit gaps

Final gap count is `12`:

1. `gap.documents-legal.01` — `site.footer` is outside the final W1–W4 native materialization set.
2. `gap.documents-legal.02` — exact current route/template binding and document typography composition are unresolved.
3. `gap.event-detail.desktop-editorial.01` — `event.participants` is outside W1–W4.
4. `gap.exhibitions.01` — `exhibitions.personal-surface` is outside W1–W4.
5. `gap.festival.01` — `site.footer` is outside W1–W4.
6. `gap.festival.02` — festival-specific header/content regions and exact route/template binding are unresolved.
7. `gap.home.01` — `home.cold-start-feed` is outside W1–W4.
8. `gap.listing.popular.01` — `listing.behavior-row` is outside W1–W4.
9. `gap.listing.popular.02` — `listing.personalized-row` is outside W1–W4.
10. `gap.listing.unusual.01` — `listing.behavior-row` is outside W1–W4.
11. `gap.personal-feed.01` — `personalization.filter` is outside W1–W4.
12. `gap.prelaunch.01` — `page.prelaunch` is explicitly not Penpot-ready.

## Validation

Commands run from the lane worktree:

```bash
python3 -m json.tool contracts/normalization/component-synthesis-archetype.v0.1.schema.json >/dev/null
python3 /tmp/validate_archetypes.py
find catalog/normalization/component-synthesis-v0.1/archetypes \
  contracts/normalization/component-synthesis-archetype.v0.1.schema.json \
  -type f -print0 | sort -z | xargs -0 sha256sum > /tmp/archetypes-before.sha256
python3 /tmp/generate_archetypes.py
find catalog/normalization/component-synthesis-v0.1/archetypes \
  contracts/normalization/component-synthesis-archetype.v0.1.schema.json \
  -type f -print0 | sort -z | xargs -0 sha256sum > /tmp/archetypes-after.sha256
diff -u /tmp/archetypes-before.sha256 /tmp/archetypes-after.sha256
# Repeated after cherry-picking L1, using post-L1 before/after hash ledgers:
diff -u /tmp/archetypes-post-l1-first.sha256 /tmp/archetypes-post-l1-second.sha256
python3 /tmp/validate_archetypes.py
```

Result: `PASS`.

The semantic validation asserted:

- schema itself passes `Draft202012Validator.check_schema`;
- all 18 records pass the Draft 2020-12 schema;
- graph IDs equal the exact authoritative registry ID set;
- registry display name, route, source status, states, viewports and composition refs are preserved;
- every instance FK resolves to an eligible entity of the matching component/pattern kind;
- every graph edge resolves to the authoritative hierarchy relation;
- root/indegree/reachability and acyclic invariants hold;
- fixture, consumer, node, edge, state-matrix and gap FKs close;
- state matrices equal the exact viewport × registry-state Cartesian products;
- every authoritative component ref and each page-composition child is represented;
- all gaps are explicit, all `detached=false`, and every `local_overrides=[]`;
- a second deterministic generation produced byte-identical hashes.

## L1 reconciliation follow-up

- Imported L1 implementation: `3773f55412a894cf2b22c068698e92c90cf73eec` (local cherry-pick `3043847efe98d60f57b68584825918d433fafb3d`).
- Regenerated only graphs whose registry/hierarchy closure changed plus `archetypes/index.json`:
  - `archetype.festival`
  - `archetype.listing.date`
  - `archetype.listing.popular`
  - `archetype.listing.unusual`
  - `archetype.listing.weekend`
- Direct registry retargets are exact: Date and Weekend use `listing.event-card`; Popular preserves both `event.card` and `listing.event-card`.
- Hierarchy-backed propagation is explicit: `listing.timeline`, `listing.personalized-row` and `listing.behavior-row` now instantiate `listing.event-card`, which also changes Festival and Unusual without globally rewriting their separately declared `event.card` refs.

### Before / after

| Measure | Before L1 | After L1 |
|---|---:|---:|
| Archetypes | 18 | 18 |
| Fixtures | 75 | 75 |
| Instance nodes | 383 | 392 |
| Explicit gaps | 3 | 3 |
| State-matrix rows | 132 | 132 |
| `event.card` instance refs | 21 | 18 |
| `listing.event-card` instance refs | 0 | 6 |
| Detached copies | 0 | 0 |
| Local overrides | 0 | 0 |

The previous integration risk is closed: graphs now follow finalized L1 consumer-specific identities, preserve remaining generic `event.card` instances, and introduce no silent global retarget.

## L4 W1–W4 native-instance closure

Strict validation identified nine entity occurrences that were eligible registry entities but absent from the final 65 W1–W4 native materialization contracts. Each entire unavailable instance region is now represented by an evidence-linked `gap_placeholder`; nested descendants are not emitted as detached/local substitutes.

Affected graphs: Documents/legal, desktop editorial Event Detail, Exhibitions, Festival, Home, Popular, Unusual and Personal Feed.

| Measure | Before closure | After closure |
|---|---:|---:|
| Archetypes | 18 | 18 |
| Fixtures | 75 | 75 |
| Instance nodes | 392 | 349 |
| Explicit gaps | 3 | 12 |
| State-matrix rows | 132 | 132 |
| Non-W1–W4 instance refs | 9 | 0 |
| `event.card` instance refs | 18 | 15 |
| `listing.event-card` instance refs | 6 | 4 |
| Detached copies | 0 | 0 |
| Local overrides | 0 | 0 |

The reduced card counts are the deterministic result of replacing unavailable parent patterns with one explicit gap rather than emitting their descendants as detached substitute compositions.

No blocker exists within this lane.

## Changed files

- `catalog/normalization/component-synthesis-v0.1/archetypes/index.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.club.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.collection.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.documents-legal.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.event-detail.desktop-editorial.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.event-detail.desktop-no-image.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.event-detail.desktop-split.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.event-detail.mobile.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.exhibitions.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.favorites.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.festival.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.home.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.listing.date.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.listing.popular.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.listing.unusual.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.listing.weekend.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.personal-feed.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.prelaunch.json`
- `catalog/normalization/component-synthesis-v0.1/archetypes/graphs/archetype.search.json`
- `contracts/normalization/component-synthesis-archetype.v0.1.schema.json`
- `.codex/lanes/apply-synthesis-archetypes/RESULTS.md`

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
- Index SHA-256: `1fd1ac0b20bda012b6ab2f9349456ff7ab86f29759ac5442453a45ff91f27dd2`.
- Schema SHA-256: `a0ab24bf9e7f6274f5ac9c86bda025681fad321110237ce8806424fa6271aeed`.

### Counts

- Archetypes: `18`
- Fixtures: `75`
- Native component/pattern instance nodes: `383`
- Explicit gap placeholders: `3`
- State-matrix rows (viewport × state): `132`
- Detached copies: `0`
- Local overrides: `0`

### Explicit gaps

1. `gap.documents-legal.01` — exact current route/template binding and document typography composition are unresolved in the authoritative registry.
2. `gap.festival.01` — festival-specific header/content regions and exact route/template binding are unresolved in the authoritative registry.
3. `gap.prelaunch.01` — `page.prelaunch` is explicitly not Penpot-ready, so the unresolved page shell/placement remains a gap while resolved controls are instances.

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

## Integration risk / declared follow-up

The lane intentionally follows the exact input `page-archetype-registry.jsonl` and never silently retargets entity identities. That registry currently names `event.card` in 16 of 18 archetypes; hierarchy expansion produces 22 `event.card` instance occurrences. The separate L1 reconciliation reports that EventListItem remains separate and EventCard versus ListingEventCard remains consumer-specific. After integrating L1 registry/hierarchy deltas, the integrator/L4 validator must preserve exact source-registry references or apply an explicit consumer-specific delta; an implicit global rewrite of these 22 references is not safe.

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

# Family wave plan v1.1 — positive semantic readiness

`PROJECT_NORMALIZATION_SYNTHESIS_V1_1_REMEDIATED`

This plan corrects the v1 fail-open readiness calculation. It is analytical
only and authorizes no component merge, split, deletion, implementation,
Penpot materialization or promotion.

## Analytical groups are not component identities

The 47 existing `family.*` IDs remain stable join keys for the immutable
107-component census. Their common historical prefix does not mean that all 47
rows are interchangeable component families.

[`analysis-group-registry.jsonl`](../../catalog/normalization/analysis-group-registry.jsonl)
classifies the rows as:

| Entity kind | Groups |
|---|---:|
| `component_catalog` | 10 |
| `component_identity_family` | 11 |
| `composition_pattern` | 7 |
| `evidence_or_lab_group` | 1 |
| `foundation` | 2 |
| `page_surface` | 8 |
| `runtime_enabler` | 4 |
| `unresolved_boundary` | 2 |
| `workflow` | 2 |
| **Total** | **47** |

Every one of the 107 logical component IDs has exactly one analytical
membership relation. A relation such as `catalog_member`,
`composition_member`, `surface_member`, `workflow_stage` or
`runtime_enabler` is not identity or variant evidence. All relation statuses
remain `analytical_candidate_not_accepted` and every physical-operation flag is
false.

The audit-named boundary corrections are explicit:

- `family.design-system-primitives` is a catalog;
- `family.event-detail-presentation` is a page/surface group;
- `family.focus-group-workflows` is a workflow;
- `family.listing-controls-and-navigation` is a catalog;
- `family.personalization-and-feed` is a workflow;
- `family.brand-identity` is a foundation;
- Event Media and Event Token Medallions are compositions;
- bottom navigation remains unresolved while dead and not-observed evidence is
  reconciled.

## Positive checklist

[`semantic-readiness.jsonl`](../../catalog/normalization/semantic-readiness.jsonl)
contains one full 23-item checklist for every analytical group. It covers:

1. component-identity entity kind;
2. explicit semantic-role contract;
3. explicit non-goals;
4. reconciled requirement provenance;
5. closed identity/variant boundary;
6. anatomy contract;
7. content-model contract;
8. exact implementation membership;
9. consumer/application census;
10. route and surface context;
11. state and event contract;
12. responsive/container contract;
13. accessibility contract;
14. runtime and visual reconciliation;
15. typed operational-finding closure;
16. absence of unresolved decision blockers;
17. candidate-contract review;
18. reversible migration and rollback evidence;
19. existence and resolution of every evidence reference;
20. conditional media policy;
21. conditional loading/recovery behavior;
22. conditional experiment decision;
23. family-specific product-model dependency.

Every checklist status uses the exact vocabulary `PASS`, `BLOCKED` or
`NOT_APPLICABLE_WITH_REASON`. Every assertion has nonempty evidence refs, and
the validator resolves every ref against the pinned family/component/finding/
application/decision/behavior/authority identities. `NOT_APPLICABLE_WITH_REASON`
requires an explicit `NOT_APPLICABLE` applicability classification and a
nonempty reason; it is not an omitted check.

Strict readiness is true only when:

```text
entity_kind == component_identity_family
AND every required or applicable positive check is pass
AND operational_blocker_refs is empty
```

Empty blocker arrays alone never imply readiness. The 222 typed finding rows
are cross-joined into the analytical registry with their classification,
operational disposition, blocking scope and resolution stage; readiness uses
those typed fields rather than the v1 generic blocker arrays.

## Current deterministic result

The current evidence produces:

```text
analytical groups:       47
component memberships: 107
strict ready:             0
eligible for scoring:     0
first wave:               0
not ready:               47
```

All non-ready rows have `score: null`. Scoring runs only after the positive
gate. The selection rule takes up to four eligible rows, with minimum zero.
Therefore an empty wave is a valid and required result.

The audit counterexamples remain fail-closed:

- `family.brand-identity`: foundation, no behavior contract and no terminal
  probe coverage;
- `family.event-media`: composition with incomplete vocabulary and
  consumer-policy review;
- `family.event-token-medallions`: composition with unresolved taxonomy,
  boundaries, geometry decision and accessibility closure.

None is scored or selected. All remain `NOT_MERGED`, unpromoted and
non-authoritative.

## Reproduction

Generate the schemas and catalogs deterministically:

```bash
node scripts/normalization-v1-1/build-registry-readiness.mjs --write --self-test
```

Check committed bytes and run the semantic mutation suite:

```bash
node scripts/normalization-v1-1/build-registry-readiness.mjs --check --self-test
node tests/normalization-v1-1-registry-readiness.mjs
```

The thirteen semantic mutations must reject missing/duplicate component membership,
audit-mandated kind drift, any legacy entity-kind alias, typed-finding drift,
empty or unresolvable positive evidence, invalid applicability/status pairing,
blocker-absence readiness, scoring of a non-ready row, a forced minimum wave,
Event Media selection and physical-operation authorization.

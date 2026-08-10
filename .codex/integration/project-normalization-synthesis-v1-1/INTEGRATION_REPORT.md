# Project Normalization Synthesis v1.1 — integration report

## Boundary

This is an analytical audit remediation over
`onedayonemasterpiece/lovekgd-design-system@317938bc72cf7a47ea798b2614d92d3d285dd97a`.
The product repository is read-only evidence at
`onedayonemasterpiece/events-bot-new@66bc0d43e36299417626f992021cfb7299ddf704`;
the decoded runtime evidence remains pinned to `ef7aa62e45c60f7a12da6160f490719c0721ec03`.

No production Astro/CSS/JS, `site/src`, `site/public`, Penpot resource, prototype,
component implementation, token, typography model, experiment winner or product
entity was changed or selected.

## Lane reconciliation

| Lane | Requirements | Worker commit | Integration commit | Result |
|---|---|---|---|---|
| L1 raw/audit | R01, R02, R06 | `3fdc2ae69660573ffc2c21b8439348fdd951e3d8` | `d4e7224` | 279 universe, 57 aliases, 279 partition, 222 operational findings |
| L2 registry/readiness | R04, R05, R10 | `2cf6d10`, enum correction `6b194170f68debff75d3f4678c5049a96e78b756` | `1ac913c`, `907a1a6` | exact nine entity kinds; 47 `NOT_READY`; first wave empty |
| L3 Event Media | R08 | `6b1940da8edf6587dc72f98c64ef4aeb1e5c5b52` | `a421055` | full consumer matrix; 12 exact blockers; not ready |
| L4 Medallions/navigation | R07, R09 | `0d41f64ce0927ac6f78250c3dd8c917aeb368a75` | `a759b14` | taxonomy/boundary review required; unreachable implementations preserved |
| L5 evidence/value | R11, R12 | `b8cde833fdb3defceb28e0bdb59a392e217019e8`; follow-ups `703176e`, `3904006` | `bc4d01e`, `7c39c4a`, `b90deed` | 134 reviewed visual rows, sole canonical count namespace, independent census, fail-closed observe gate |
| L6 lifecycle | R13 | `9a55efba51db11443e8edf2195b692af9258fb6d` | `56eb425` | exact 11-state/10-transition lifecycle; authority changes only at promotion |
| L7 integration | R03, R14, R15 | integrator-owned | current branch | aggregate validator, 14 mutations, schemas, workflows, receipt and PR delivery |

All worker changes were either integrated as scoped commits or, for a conflicting
root `RESULTS.md`, reduced to the lane-owned report before integration. No lane was
dropped or silently superseded.

## Requirement status

| ID | Status | Closure evidence |
|---|---|---|
| R01 | Done | byte-exact audit SHA `a466ae5f…`; 13-row disposition ledger |
| R02 | Done | 279/279 exact set equality and multiplicity one; 57 typed aliases |
| R03 | Done | 14/14 required aggregate semantic mutations rejected; lane suites remain additive |
| R04 | Done | 47 analytical groups use the exact nine-value entity-kind vocabulary; 107 memberships exact-once |
| R05 | Done | 16 positive checks per group; 47 not ready; no blocker-absence readiness |
| R06 | Done | 222/222 findings have typed operation, provenance, scope and resolution stage |
| R07 | Done | mobile capability, shared implementation and wrapper reachability/lifecycle separated |
| R08 | Done | Event Media dossier has ten consumer/slot rows and exact not-ready blockers |
| R09 | Done | Medallion identity/taxonomy/layout/status boundaries remain explicit and not ready |
| R10 | Done | minimum wave zero; score only eligible identities; current first wave empty |
| R11 | Done | 134/134 raster rows individually validated; prior 124/new 10 durable archive lineage |
| R12 | Done | 239 application/readiness rows bound to an independent 239-edge raw-Git census; observe mode preserved |
| R13 | Done | normative lifecycle reconciled across contract and authority docs |
| R14 | Done | required docs, schemas, catalogs, dossiers, validators and manifest receipt are enumerated |
| R15 | Partial until delivery | local positive/negative/immutable/archive/secret/diff gates pass; open PR and CI are recorded after push |

## Verified counts

```text
raw identities / partition rows     279 / 279
typed paired aliases                 57
canonical findings                  222
raw / canonical unresolved        87 / 87 (30 standalone)
readiness operational blockers      192 unique refs
migration / promotion blockers       5 / 17
analytical groups / components       47 / 107
strict-ready / scored / first wave    0 / 0 / 0
applications / readiness            239 / 239
independent census            239 edges + 3 zero-consumer records
visual reviews                 134 = 124 prior + 10 closure
behavioral probes             293 = 236 PASS + 39 MISMATCH + 18 UNREACHABLE
Event Media exact blockers            12
lifecycle states / transitions        11 / 10
```

## Validation

- Historical v1 validator: PASS at detached `317938bc…`.
- Immutable Decoder v1 validator: PASS; tree `e77fc245…`.
- Behavioral closure validator: PASS; manifest `c676be4f…`.
- Draft 2020-12 schemas: PASS for 222 findings, 47 groups, 47 readiness rows,
  239 applications and the lifecycle contract.
- Exact raw partition/readiness builders: deterministic `--check`; 7 and 11
  built-in semantic mutations rejected.
- Event Media: 8 mutations rejected.
- Medallions/navigation: 12 mutations rejected.
- Evidence/value: 23 mutations rejected and one preservation-positive case.
- Lifecycle: 16 mutations rejected.
- Aggregate required suite: 14/14 mutations rejected.
- Independent Git-object census replay: 239/239 active edges.
- Release ZIP replay: 134/134 entry SHA-256 and bytes verified.
- Forbidden-path and secret scans: PASS.

## Delivery boundary

The PR must remain open and unmerged for a separate independent re-audit. This
integration report is an implementation checklist, not that re-audit and not a
promotion, target-contract or physical-defragmentation decision.

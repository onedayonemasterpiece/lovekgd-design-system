# Event Media Policy Defragmentation v0.1 — Execution Matrix

| ID | Requirement | Area | Dependencies | Conflict risk | Execution | Done when |
|---|---|---|---|---|---|---|
| R01 | Inventory every current crop, fit, ratio, focal, safe-area, source-quality, loading and recovery rule. | events source, requirements, tests, evidence | exact events `f66330f8af81d4b898d137d83356e77914dce90a` | medium | read-only mapping | every active consumer/slot has exact authority refs and no silent omission |
| R02 | Separate reusable truth from consumer profiles, stale branches, contradictions and false rules. | reconciliation ledger | R01 | high | read-only audit, serial disposition | every discovered rule has one terminal disposition and contradiction links |
| R03 | Define one provenance-aware media decision model without a global ratio or global cover rule. | normalization contracts | R01, R02 | high | serial implementation | model recomputes fit/crop/object-position/upscale/recovery from semantic, geometry, consumer and provenance inputs |
| R04 | Build a reusable native `EventMediaFrame` and consumer-profile nested instances. | Component Contract, hierarchy, Penpot IR/live file | R03 | high | serial implementation and bounded Penpot writes | frame owns rendering states; consumers pass decisions; rail uses 0..N linked instances; detached copies=0 |
| R05 | Cover every source-backed state with fixtures and fail-closed validation. | fixtures, schemas, validators, tests, receipt/read-back | R03, R04 | high | serial verification | exact state/profile matrix passes; stale/unsafe mutations reject; Penpot validation/idempotency pass |

## Global constraints

- `events-bot-new` is read-only for this synthesis pass.
- No global ratio token, global cover rule, canonical promotion, owner acceptance, or production claim.
- Existing dirty materializer/test changes in the original Apply Synthesis worktree remain untouched.
- The existing 5:4 Penpot proof is evidence for one mobile-rail profile only, never the base contract.

## Integration result

- R01 — **Done:** current rules inventoried at exact events `f66330f8af81d4b898d137d83356e77914dce90a`.
- R02 — **Done:** 21 rules have terminal truth dispositions; unsafe/stale branches are not promoted.
- R03 — **Done:** one candidate resolver, 17 profiles, exact 52-application partition, no global fit/ratio/crop/upscale default.
- R04 — **Done:** lightweight native Penpot proof has five frame case variants and four linked rail instances, with zero detached copies and idempotent second reconcile.
- R05 — **Partial only for raster export:** 18 state cases, schemas and 31 negative mutations pass. Penpot semantic read-back passes at revision 108; the separate export backend returned HTTP 504 twice, so raster export is not claimed.

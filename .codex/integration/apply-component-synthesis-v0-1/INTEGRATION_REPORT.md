# Apply Component Synthesis v0.1 — Integration Report

## Delivery state

- Repository: `onedayonemasterpiece/lovekgd-design-system`
- Base: `c59a3576c7361c1953b31ad9b98ed096640e92c7`
- Branch: `normalization/apply-component-synthesis-v0-1`
- Draft PR: <https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/35>
- Merge requested: no

## Lane closure

| Lane | Requirements | Worker head | Integrated evidence | Status |
|---|---|---|---|---|
| L0 package/integration/Penpot | R00, R05, R07, R08 | integration branch | immutable package receipt, IR/read-back/rollback/history, PR | Partial: repository delivery complete; live Penpot blocked externally |
| L1 source/reconciliation | R01, R03 | `bc7fa8c0fa549514dff9ac99e0a86752126af4c9` | 107-path drift ledger, 6 terminal results, 35 media cells | Done |
| L2 contracts/fixtures | R04 | `64fdac765ab1ef03b418c3cc96a21eb49d374cb9` | 65 contracts/bindings, 39 fixtures | Done |
| L3 archetypes | R06 | final correction `bd7efa0e5bbe69d423fabad2a9193bfc68f6db27` | 18 graphs, 349 instances, 12 gaps | Done |
| L4 validation/delivery | R02, R08 gates | serial integration head | schemas, semantic validator, materializers, 21 mutations, workflow | Done |
| L5 closure audit | R08 | final branch head | schemas, source replay, receipt replay, negative/diff/scope/secret audit | Done locally; exact-head CI pending push |

No worker change is left unclassified. Earlier lane commits are integrated; final validation was completed serially because shared schemas, generated IR, receipt inventory and workflow are coupled.

## Exact integrated facts

- ZIP: 51,301 bytes; SHA-256 `cb13d1bb7368eefa7b98763c1b065b27406e6a20b3c9b393935c2dc830aed446`; 16/16 manifest entries exact.
- Source: 107/107 exact mappings; 106 affected Astro implementations; no implementation set or post-synthesis blob drift; one declared decoder-to-current nonmaterial instrumentation delta.
- Reconciliation: 6/6 terminal; 4 `RECLASSIFIED_WITH_EVIDENCE`, 1 `PASS_WITH_DECLARED_VARIANT`, 1 `PASS`; owner ambiguity 0.
- Registry: 111 total entities; 63 component/control candidates; 15 product patterns; 65 W1–W4 materializable candidates.
- Materialization IR: 65 native masters, 471 axiswise variants, 695 nested component instances, 1,138 native fixture specimens.
- Archetypes: 18 graphs, 349 instance nodes, 12 explicit gaps, detached copies 0, local overrides 0.
- Product constraints: `canonical=false`, `accepted=false`, `promotion_ready=false`; all experiments remain `NOT_MERGED`; no winner selected.

## External blocker

After the owner reloaded Penpot, a current exact-file probe succeeded at revision 33 with 23 pages and zero local components. The original full-plan read-only dry-run then exceeded the MCP request window and returned HTTP 504; a subsequent minimal probe returned 504 and the alternate connector returned an internal error. No write occurred. The materializer is now shape-indexed and supports bounded component/archetype batches; the exact page must be reloaded once more before those corrected batches run. Therefore:

- actual current Resource Graph component/variant/instance counts: unknown/null;
- revision after: null;
- live second-run result: blocked;
- UI Exploration historical withdrawal mutation: blocked;
- no component creation is claimed.

Latest previously confirmed live context is revision 33, 23 pages and zero native components at that read. It is not a claim about current state.

## Final local acceptance

The receipt binds clean materialization parent `4caae2f006ff7dc3011607e2bfc33983832fcf30` and 120 output artifacts. Default validation with the exact current events checkout, receipt regeneration check, all schemas, deterministic IR, 21 semantic mutations, Resource Graph scaffold validation, current Project Normalization semantic bridge, secret scan and full base-to-head diff check all pass. The final exact-head GitHub Actions result is intentionally external delivery evidence and is checked after push without rewriting this receipt.

## Scope audit

- `events-bot-new`: read-only exact checkout remains clean.
- no `site/src`, `site/public`, existing `penpot/`, production Astro or runtime repository path changed.
- no PR merge, acceptance, promotion or canonicalization is authorized.

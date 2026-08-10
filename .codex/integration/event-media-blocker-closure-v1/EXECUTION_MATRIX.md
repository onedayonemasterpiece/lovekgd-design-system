# Event Media Blocker Closure v1 — Execution Matrix

Base main: `3cbe35326ead04ac67070e5b400d30d9edc6eb01`  
Audited source head: `20eab45534e2c64497e4db661e6a5ca8582229ea`  
Integration branch: `normalization/event-media-blocker-closure-v1`

| ID | Requirement | Area | Likely files | Dependencies | Conflict risk | Primary lane | Parallelizable? | Done when |
|---|---|---|---|---|---|---|---|---|
| R01 | Safely merge verified PR #32 at the exact audited head by ordinary merge commit. | GitHub delivery | PR #32 / `main` | Independent audit PASS and exact-head checks | Critical | root | No | Merge commit parents are the prior main and audited head exactly. |
| R02 | Create `normalization/event-media-blocker-closure-v1` from new main and open a Draft PR. | Git delivery | branch, Draft PR metadata | R01 | High | L0 | Serial | Branch is pushed and Draft PR is open, clean and unmerged. |
| R03 | Consume the exact PR #32 corpus without retrospective mutation. | Provenance | derived provenance bindings and validators | R01 | High | L1 | Yes with L2 | Exact 12/3/9/52/23/31/3 source sets and hashes reconcile to merged main. |
| R04 | Resolve or precisely terminalize all nine evidence blockers using only existing evidence or a narrow targeted specimen. | Evidence closure | `catalog/normalization/event-media/blocker-closure-v1.jsonl` | R03 | Critical | L1 | Yes with L2 | Each of the nine rows has one allowed terminal status, exact refs, consumers, runtime/specimen evidence and residual risk. |
| R05 | Prepare three separate unaccepted owner decision cards with 2–4 real alternatives each. | Product decision prep | `owner-decisions.jsonl`, `decision-fixtures.jsonl`, decision-pack doc seed | R03 | High | L2 | Yes with L1 | Three owner questions retain source wording and expose consequences/recommendation without acceptance. |
| R06 | Build deterministic HTML and Actions PNG boards from shared real fixtures; full-resolution review every PNG. | Visual evidence | `prototypes/event-media-decision-pack/**`, visual ledger | R05 | Critical | L3 | Serial after L2 | Comparable boards exist, CI renders them deterministically, and every PNG has a full-resolution review row. |
| R07 | Recompute all 23 positive readiness dimensions for all three candidate contracts. | Readiness | `catalog/normalization/event-media/readiness-v1.jsonl` | R03–R06 | Critical | L4 | Serial | Exactly 3×23 checks; only allowed final readiness states; no owner choice inferred. |
| R08 | Bind schemas, validators, mutation tests, docs, receipt, Product Value/STOP invariants and CI. | Integration/governance | schemas, scripts, tests, workflows, docs, receipt | R03–R07 | Critical | L5/L0 | Serial | Deterministic validation and negative mutations pass; receipt binds outputs; Product Value remains pending; protected trees unchanged. |

Dependency graph: `R01 → R02 → {R03/R04 || R05} → R06 → R07 → R08 → Draft PR CI → L6 review`.

Stop conditions:

- any PR #32 head/base/parent mismatch;
- any mutation of the merged PR #32 source artifacts;
- any production, `site/src`, `site/public`, Penpot, token, archetype, experiment-winner, migration or physical component change;
- any owner decision represented as accepted;
- any evidence blocker closed by field presence rather than direct evidence.

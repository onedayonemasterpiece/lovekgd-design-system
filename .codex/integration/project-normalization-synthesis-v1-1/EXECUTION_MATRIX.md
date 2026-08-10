# Project Normalization Synthesis v1.1 — Execution Matrix

| ID | Requirement | Area | Dependencies | Conflict risk | Primary lane | Parallelizable | Done when |
|---|---|---|---|---|---|---|---|
| R01 | Preserve red-team audit byte-for-byte and disposition AUD-PN-001…013 | audit governance | missing source report must be located verbatim | high | L1 raw/audit | mapping yes, binding serial | original bytes preserved; 13 dispositions validated |
| R02 | Exact-once 279→222 raw partition with typed 57 aliases | provenance/catalog | v1 corpus | high | L1 raw/audit | yes | set equality and multiplicity=1 |
| R03 | Semantic negative mutation suite | validator/tests | R02,R04-R13 schemas | high | L7 integrator | serial last | every required mutation rejected |
| R04 | Separate analytical groups from semantic families | registry/schema | R02 component census | high | L2 registry/readiness | yes | 47 typed groups; semantic identity modeled separately |
| R05 | Positive evidence readiness checklist | readiness/schema | R04,R06 | high | L2 registry/readiness | yes | no blocker-absence inference; checklist replayed |
| R06 | Typed operational findings dispositions | findings/schema | R02 | high | L1 raw/audit | yes | all canonical findings typed and provenance-bound |
| R07 | Mobile bottom navigation/dead-vs-unreachable protection | lifecycle/catalog | R04,R06 | medium | L4 medallions/navigation | yes | preserve-pending reconciliation invariants |
| R08 | Complete consumer-scoped Event Media dossier | dossier | R05,R06 | medium | L3 event-media | yes | complete matrix or exact not-ready blockers |
| R09 | Medallions taxonomy/boundaries | dossier | R05,R06 | medium | L4 medallions/navigation | yes | taxonomy reviewed; not falsely ready |
| R10 | Recalculate first wave without minimum count | prioritization | R05,R08,R09 | high | L2 registry/readiness | after dossiers | score only after positive gate |
| R11 | Visual review rows and canonical manifest counts | evidence validator | final behavioral package | high | L5 evidence/value | yes | row-level retrieval/review validation; count namespaces consistent |
| R12 | Product Value Gate observe-mode hardening | value schema | source/runtime census | high | L5 evidence/value | yes | no invented IDs; parent/cycle/census gates |
| R13 | Normative code→Penpot→archetype→Gemini→promotion lifecycle | lifecycle/docs/schema | authority docs | high | L6 lifecycle | yes | one machine-readable state machine and reconciled docs |
| R14 | Required artifacts, schemas, catalogs, dossiers, receipt | integration | R01-R13 | high | L7 integrator | serial | manifest enumerates final files |
| R15 | Full validation, receipt, open PR for re-audit | CI/delivery | R01-R14 | high | L7 integrator | serial | all positive/negative gates pass; PR open and unmerged |

## Cross-cutting acceptance gates

- Immutable Decoder v1 and Behavioral Closure hashes remain exact.
- events-bot-new and production site/src/site/public remain read-only.
- No runtime component merge/split/delete, tokens, typography choice, experiment winner, Penpot mutation, product-model invention, or automatic next phase.
- Final allowed statuses only: PROJECT_NORMALIZATION_SYNTHESIS_V1_1_REMEDIATED and READY_FOR_INDEPENDENT_REAUDIT.

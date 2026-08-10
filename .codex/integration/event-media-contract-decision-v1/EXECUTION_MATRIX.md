# Event Media Boundary & Contract Decision v1 — execution matrix

Base: `onedayonemasterpiece/lovekgd-design-system@45288b001d724e0d3603d0c44d392ff370407bd0`

Read-only evidence: `onedayonemasterpiece/events-bot-new@66bc0d43e36299417626f992021cfb7299ddf704`

| ID | Requirement | Area | Likely files | Dependencies | Conflict risk | Lane | Parallelizable? | Done when |
|---|---|---|---|---|---|---|---|---|
| R01 | Full consumer and requirement census | evidence/census | `catalog/normalization/event-media/consumer-requirement-matrix.jsonl` | baseline | medium | L1 | yes after mapping | exact consumer/source/route/ratio/state/provenance set validates |
| R02 | Semantic media types | semantics | `catalog/normalization/event-media/semantic-media-types.jsonl` | R01 | low | L1 | yes with R03 map | every required and discovered mode has authority and boundary |
| R03 | Boundary model and entity kinds | architecture | boundary contract + `boundary-model.jsonl` | R01–R02 | high | L3 | mapping parallel; write after L1 | no composition is mislabeled component identity |
| R04 | Close/reconcile exact 12 blockers | evidence | `blocker-closure.jsonl` | baseline, R01 | medium | L2 | yes | exact dossier IDs/text retained; closure requires evidence |
| R05 | Candidate contracts | contracts | schema + `candidate-contracts/*.json` | R01–R04 | high | L3 | serial after evidence | each proven identity has complete non-accepted contract |
| R06 | Alternatives and recommendation | decision support | `alternatives-and-recommendations.jsonl` | R03–R05 | medium | L3 | serial with R05 | every boundary compares allowed outcomes and owner need |
| R07 | Positive readiness | governance | `readiness.jsonl` | R03–R06 | high | L4 | serial after candidates | applicable dimensions are PASS/N/A/BLOCKED; no fail-open scoring |
| R08 | Product Value observe/pending | product governance | readiness/applications/receipt validation | baseline, R07 | high | L4 | yes mapping; write after candidates | no product IDs; pending/promotion false preserved |
| R09 | Penpot future compatibility without mutation | design governance | candidate contracts/docs | R05 | medium | L4 | yes mapping | stable IDs/state model/override/conformance constraints present; no Penpot change |
| R10 | Artifacts, schemas, validators, negative tests, receipt, Draft PR, STOP | delivery | docs/contracts/scripts/tests/workflow/receipt | R01–R09 | high | L0/L5/L6 | serial integration/review | all outputs hash-bound, immutable inputs unchanged, CI PASS, draft PR open |

## Dependency graph

`baseline → {L1 census, L2 blocker archaeology, L3 boundary mapping, L4 governance mapping} → L3 contracts → L4 readiness → L5 validators/docs → Draft PR metadata → deterministic receipt → exact-head push/PR CI → L6 external independent closure audit`

## Stop conditions

- baseline facts or Behavioral manifest differ;
- evidence checkout is not exact/clean;
- immutable decoder or behavioral supplement changes;
- any proposed work requires production UI, runtime component, Penpot, token, archetype, product entity, experiment-winner, or migration mutation.

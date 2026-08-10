# Project Normalization Synthesis v1.1.1 — execution matrix

| ID | Requirement | Area | Dependencies | Conflict risk | Lane | Done when |
|---|---|---|---|---|---|---|
| R01 | Preserve the 61,775-byte re-audit and disposition six findings | audit/docs | exact hash gate | low | L1 | byte identity and six-row disposition validate |
| R02 | Merge current `main` without rewriting audited history | Git/authority | R00 input gate | high | L0 integrator | audited head remains ancestor; conflicts resolved semantically |
| R03 | Prove all 14 mandatory mutations by stable targeted error codes | validators/tests | reconciled source model | high | L2 | expected=actual code and aggregate rejection for 14/14 |
| R04 | Generate mutation catalog/results and derive all counts | evidence receipts | R03 | high | L2 | machine artifacts exclude positive baselines from negative totals |
| R05 | Remove self-asserted execution PASS/counts from committed receipt | receipt | R03–R04 | high | L0 integrator | receipt binds definitions/hashes and delegates outcomes to attestation |
| R06 | Supersede stale checklist provenance without self-reference | checklist/docs | R04–R05 | medium | L1/L0 | old checklist explicitly historical; exact-head evidence is CI-bound |
| R07 | Capture versions, commands, exit codes and clean secondary replay | CI/reproducibility | R03–R04 | high | L3 | clean exact-SHA replay artifact and both worktrees clean |
| R08 | Split committed-range diff gate from exact audit-byte exceptions | CI/integrity | R01–R02 | medium | L3 | only two named audit files excluded and individually hash/size checked |
| R09 | Cover all authority/contract inputs in workflow filters | CI/triggers | R02 | medium | L3 | registry/filter validation rejects omissions |
| R10 | Fully regenerate and replay the reconciled corpus | integration | R02–R09 | high | L0 integrator | all source counts and fail-closed statuses reproduced honestly |
| R11 | Publish proof-closure report with evidence for six new findings | docs | R01–R10 | medium | L1/L0 | report points to verifiable artifacts and residual limitations |
| R12 | Update draft PR #31, keep it open, and prepare delta re-audit | delivery | R10–R11 | high | L0 + L4 reviewer | exact head, CI runs, artifacts, receipt and mergeability reported |
| STOP | No UI/Penpot/token/component/product/experiment mutation | boundary | all | critical | every lane | forbidden-path and semantic guards remain closed |

## Dependency order

`input hash gate → mapping + worker lanes → main reconciliation → worker integration → receipt/CI materialization → independent checklist → PR delivery`.

No lane may mark the future independent delta re-audit complete.

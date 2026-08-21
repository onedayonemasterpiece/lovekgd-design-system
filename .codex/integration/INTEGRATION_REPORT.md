# Integration report — systemic event-card boundaries — 2026-08-20

## Outcome

Git SoT decision `6908c2911002e99b5523e8d5be524521103731b2` preceded all Penpot writes. The reconciled candidate contract is `1.0.0-candidate.2`, SHA-256 `91a5350b72f3c54cc8a7ecad2a830b876dd9f719c8b029cd1a1fca2a5e8e67d9`. Native Penpot read-back is revision 1034 with `validate=[]`. No Astro reverse integration or production mutation was performed.

## Requirement closure

| ID | Status | Closure |
|---|---|---|
| R01 | Done | Threads 85–95 inventoried, replied, bound to exact boards in the receipt, and intentionally left open for owner acceptance. |
| R02 | Done | All five event-card families audited against pinned Astro `7d4b1d3`; one systemic overlay contract records the corrected boundaries. |
| R03 | Partial (evidence) | Native Social Proof/Like/Reject/Admission/Medallion components and linked consumers exist; Listing has zero loose proof counts. The receipt does not claim a file-global detached-copy census or current per-variant EventCard action census. |
| R04 | Partial (evidence) | Title/place are correctly modeled as parent-owned semantic slots, not artificial library components; Large and Listing read-backs are explicit. The receipt does not record equivalent counts for every rail/Festival/Exhibition title/place layer. |
| R05 | Done | EventCard Large has 12 variants, semantic slots, corrected meta/admission rules, focus radius and a linked light-shell specimen. |
| R06 | Done | ListingEventCard has 13 linked social proofs, zero loose proof counts, semantic medallion names and corrected S05 media framing. |
| R07 | Done structurally | Sixteen full linked tracks are one-per-row, intrinsic 707/909/1350px and unclipped; 390px clipped viewports are separate. 707px visual export passed; 1350px export timed out. |
| R08 | Partial (visual evidence) | Festival and Exhibition consumers were systemically converted to semantic linked actions/proofs; Festival deliberately has no aggregate count. No focused Festival/Exhibition PNG export is recorded. |
| R09 | Done for bounded scope | SoT-first ordering, final receipt validation, idempotency and Penpot validation pass; handoff remains candidate/noncanonical and correctly stops before reverse Astro work. |

## Validation

- `python3 scripts/validate-event-card-systemic-boundaries-v1.py` — PASS, contract + receipt rev1034.
- `python3 scripts/validate-event-card-taxonomy-candidate-v1.py` — PASS; historical candidate still reports visual acceptance not ready.
- `node scripts/validate-event-card-taxonomy-candidate-v1.mjs` — PASS; same historical status.
- `python3 scripts/validate-event-card-icon-registry-candidate-v1.py` — PASS.
- `python3 scripts/validate-event-card-assets-candidate-v1.py` — PASS.
- receipt JSON parse — PASS.
- `git diff --check` — PASS.
- `python3 -m compileall src tests` — tests compile; no `src` directory exists in this repository.
- `pytest -q` — not run: `pytest` is not installed in the current environment.

## Review order

1. 30.1 primitives and Social Proof.
2. 40.1a EventCard Large.
3. 40.2 ListingEventCard.
4. 40.3 Mobile rail full tracks and separate viewports.
5. 40.4 FestivalCard.
6. 40.5 ExhibitionRow.

The exact page/board IDs are recorded in `receipts/penpot/event-card-systemic-component-remediation-v1.json`.

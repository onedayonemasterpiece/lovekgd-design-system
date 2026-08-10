# Project Normalization Synthesis v1 — red-team audit disposition

## Authority and interpretation

The byte-exact independent report is preserved without edits at
[`project-normalization-synthesis-v1-independent-red-team-audit.md`](project-normalization-synthesis-v1-independent-red-team-audit.md),
SHA-256 `a466ae5ff4846a1895eb11429c2fe4f175115a119dc9904d5a4a4e50a9507f76`.

The report contains the original prose and aggregate severity totals, but it does not contain literal
`AUD-PN-*` labels. The stable ID-to-topic mapping below is therefore the mapping specified by the v1.1
remediation brief. It does not rewrite or retrospectively annotate the independent report.

Allowed dispositions are `accepted`, `accepted_with_reframing`, `deferred_with_gate`, and
`rejected_with_evidence`. The severity allocation below reproduces the report's exact aggregate:
**7 HIGH, 5 MEDIUM, 1 LOW**.

## Finding dispositions

| ID | Severity | Disposition | Affected artifacts | Exact correction | Blocking stage | Validation proving closure |
|---|---|---|---|---|---|---|
| AUD-PN-001 | HIGH | `accepted_with_reframing` | authoritative raw universe, alias registry, raw partition, canonical findings, synthesis validator | Preserve the current 279→222 mapping, which a stronger reconstruction found complete, but replace count-only proof with an independently generated 279-row universe, a 57-row typed alias registry and a 279-row exact-once partition. | v1.1 completion and independent re-audit | Reconstruct the source universe from pinned artifacts; require set equality, raw multiplicity one, 165 direct mappings, 57 two-member aliases and 222 canonical targets. |
| AUD-PN-002 | HIGH | `accepted` | synthesis validator and semantic negative mutation suite | Add independent semantic mutations rather than relying on aggregate counts or hash tampering. | v1.1 completion and independent re-audit | Missing/duplicate raw identity, invalid alias, wrong filename/ID, PASS-as-MISMATCH, missing disposition and false runtime-observed mutations must each be rejected. |
| AUD-PN-003 | HIGH | `accepted` | semantic-readiness schema/catalog and wave calculation | Replace “no blockers means ready” with a complete positive checklist. | target contract and first-wave selection | A first-wave row is accepted only when every applicable positive evidence dimension passes and no dimension is blocked. |
| AUD-PN-004 | HIGH | `accepted` | Event Media dossier and readiness record | Add the complete consumer-scoped media/anatomy/state/responsive/loading matrix and blocker-supersession decisions, or retain exact not-ready blockers. | Event Media target contract | Dossier schema and validator reject any missing required consumer/dimension or unresolved predecessor blocker. |
| AUD-PN-005 | HIGH | `accepted` | Event Token Medallions dossier and readiness record | Model organizer, venue, festival, program, source, Pushkin, admission, badge, pill, status, identity-image and fallback boundaries without merging implementations. | Medallions target contract | Positive taxonomy/boundary checklist passes, otherwise status remains `BOUNDARY_AND_TAXONOMY_REVIEW_REQUIRED`. |
| AUD-PN-006 | HIGH | `accepted_with_reframing` | analysis-group registry, semantic-readiness catalog and wave plan | Preserve all 47 stable census records as typed analytical groups; do not claim all are semantic component families. | target contract | Only `component_identity_family` may become ready; catalogs, compositions, surfaces, workflows, runtime enablers, foundations and evidence groups cannot become canonical components. |
| AUD-PN-007 | MEDIUM | `accepted` | visual-review evidence catalog and behavioral manifest binding | Bind each review to raster ID/hash/location/reviewer/time/full-resolution method/conclusion/component-state. | promotion and independent re-audit | Validate every review row and verify durable retrieval/checksum/retention metadata. |
| AUD-PN-008 | LOW | `accepted` | behavioral manifest counts | Establish one canonical snake_case count namespace; legacy camelCase, if retained, must be explicitly deprecated and exactly equal. | v1.1 release receipt | Reject conflicting count namespaces or unequal legacy/canonical values. |
| AUD-PN-009 | HIGH | `accepted` | normative lifecycle contract and authority documentation | Define one code→contract→reversible migration→native Penpot candidate→three-way conformance→archetypes→representations→read-only Gemini audit→reviewed corrections→promotion state machine. | `Penpot_materialization` and family promotion | Machine-readable transitions reject skipped stages and prevent Gemini findings or screenshots from becoming runtime/contract authority automatically. |
| AUD-PN-010 | MEDIUM | `accepted` | findings schema and 222-row findings catalog | Require a typed operational disposition on every canonical finding; retain `NOT_MERGED` only as a boundary decision. | target contract | Strict schema plus source-aware semantic checks reject missing/invalid dispositions and unbound provenance. |
| AUD-PN-011 | MEDIUM | `deferred_with_gate` | Product Value schema, applications and readiness validator | Keep observe mode and empty authoritative product IDs; harden parent/cycle/census and pending-promotion invariants now, but defer real foreign keys and enforce mode until an authoritative product registry exists. | Product Value enforce transition and promotion | Observe mode proves no invented IDs, valid parent/cycle semantics, independent consumer census and `pending_product_model ⇒ promotion_ready=false`; enforce remains gated by a future receipt. |
| AUD-PN-012 | MEDIUM | `accepted_with_reframing` | findings provenance, blocker reports and readiness reports | Distinguish 87 raw unresolved rows, 87 canonical issues containing unresolved evidence, 30 standalone unresolved issues, readiness blockers, migration blockers and promotion blockers. | target contract and reporting | Counts are reconstructed from the raw partition and typed blocker fields, never inferred from one generic unresolved total. |
| AUD-PN-013 | MEDIUM | `accepted_with_reframing` | unreachable implementation lifecycle, canonical findings and Product Value readiness | Treat missing reachability as `not_observed_under_pinned_evidence`, preserve implementations pending reconciliation and prohibit deletion/deprecation inference. | legacy removal | All unreachable implementations require complete static/dynamic/generated census, requirement reconciliation, replacement coverage, migration closure, owner receipt and rollback evidence before removal. |

## Current correction boundary

This disposition authorizes analytical remediation only. It does not authorize production mutation,
component merge/split/delete, Penpot mutation, token or typography selection, an experiment winner,
product-model invention, physical defragmentation, or automatic next-phase work.

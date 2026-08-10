# Project Normalization Synthesis v1.1 — remediation report

## Scope

This report records changes made in response to the byte-preserved independent
red-team audit. The original audit remains unchanged. This report is an
implementation/validation record, not a replacement verdict and not an
independent re-audit.

## Closure ledger

| Finding | Correction | Validation proving closure |
|---|---|---|
| AUD-PN-001 | Authoritative 279-row universe, typed alias registry and exact partition | Set equality, multiplicity one and all 57 two-member semantic aliases replayed |
| AUD-PN-002 | Separate semantic mutation suite | 14/14 required aggregate mutations plus 77 lane mutations rejected |
| AUD-PN-003 | Positive 16-check readiness | 47 assessed, 47 `NOT_READY`, 0 scored, 0 selected |
| AUD-PN-004 | Event Media consumer-policy dossier | 10 consumers/slots, 11 blocker-supersession rows, 12 exact blockers; `NOT_READY_WITH_EXACT_BLOCKERS` |
| AUD-PN-005 | Medallion taxonomy dossier | 10 mappings and explicit boundary/geometry/a11y gaps; `BOUNDARY_AND_TAXONOMY_REVIEW_REQUIRED` |
| AUD-PN-006 | Nine exact analytical entity kinds | 47 stable analytical IDs and 107 exact-once component memberships; no accepted identity |
| AUD-PN-007 | Visual evidence projection | 134 rows individually bind raster SHA/bytes, durable Release entry, review and component state |
| AUD-PN-008 | Canonical count projection | Five conflicts in the immutable source manifest are recorded as excluded audit observations; the current canonical snake_case namespace has zero conflicts and zero active legacy aliases |
| AUD-PN-009 | Family lifecycle | Exact 11 states/10 transitions; Penpot candidate is pre-promotion; authority changes only at state 11 |
| AUD-PN-010 | Operational findings | 222/222 carry typed action, provenance, blocking scope and resolution stage |
| AUD-PN-011 | Product Value Gate | Observe mode, zero IDs, independent 239-edge census, parent/DAG/FK/deletion rules |
| AUD-PN-012 | Namespaced reporting | 87 raw unresolved records, 87 canonical unresolved identities (57 paired plus 30 standalone), 192 unique readiness operational blockers, 5 migration blockers and 17 promotion blockers are reported separately |
| AUD-PN-013 | Reachability/lifecycle separation | Mobile capability separated from wrapper; all three zero-consumer records preserved and non-removable |

## Current analytical outcome

- The raw evidence is preserved; remediation strengthens proof rather than
  claiming newly observed runtime behavior.
- The 47 IDs remain useful analytical groups, but none currently passes the
  strict semantic identity readiness gate.
- Event Media is `NOT_READY_WITH_EXACT_BLOCKERS`.
- Event Token Medallions is
  `BOUNDARY_AND_TAXONOMY_REVIEW_REQUIRED` and not ready.
- First wave is empty; no synthetic minimum is applied.
- Reporting keeps non-disjoint namespaces explicit: 87 raw unresolved records,
  87 canonical unresolved identities, 192 unique readiness operational blocker
  references, 5 migration blockers, and 17 promotion blockers.
- Product Value remains fail-closed observe/pending.
- The family lifecycle remains at `AS_IS_RECONSTRUCTED`.

## Delivery boundary

The remediation branch must remain open after CI for a separate independent
re-audit. A green validator run proves the declared evidence invariants; it does
not grant family decision readiness, physical defragmentation approval, product
value validation, or Penpot readiness.

## Validation inventory

The v1.1 aggregate validator replays the immutable Decoder and Behavioral
Decoder, both deterministic builders, the Event Media and Medallion dossier
validators, the independent evidence/value census, the lifecycle and Resource
Graph validators, and Draft 2020-12 schema validation. The separate aggregate
mutation suite rejects the exact required semantic defects rather than relying
on a generic file-hash tamper.

The historical v1 validator is executed in a detached worktree at
`317938bc72cf7a47ea798b2614d92d3d285dd97a`; it is not incorrectly applied to
the additive v1.1 evidence model. Decoder v1 remains at tree
`e77fc2457fadfdffb46ed2d90304ebb91e89a715`, while `events-bot-new` remains a
read-only checkout at `66bc0d43e36299417626f992021cfb7299ddf704`.

This report records remediation implementation, not the separate independent
re-audit. Merge remains forbidden until that future review is attached to the
open PR.

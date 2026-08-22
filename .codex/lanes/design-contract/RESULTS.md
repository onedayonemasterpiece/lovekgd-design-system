# Lane results — design-contract

- Lane ID: `design-contract`
- Requirements: R01-design-consumer, R02, R03, R04-reusable, R05, R06, R07, R08-design
- Base SHA: `0882917a1328607c498d82e4c2a652bbd3df946d`
- Initial implementation SHA: `d0da4b9823990025745d9aa025b5d1a8f49088e7`
- Corrected implementation head SHA: `c3b9b7ea0d6b916c655a800207d4988cbba1af0a`
- Branch: `integration/event-card-conformance-p0p1-20260822`
- Scope: lovekgd-design-system only

## Result

Implemented an additive current-v2 closure contour for exactly seven EventCard Large cases. The active registry, cases, additive resolved bindings, blocked receipts, Penpot cache tuples and Telegram bindings share contract SHA `dfc49a54ebd9a4d2d9da1f9c24321abf349714c62d3abf1dd00f71c1ce63ae1e` and canonical case IDs. Desktop current cases use 380 px cards/current shapes and exclude the historical 474 px family.

The primary chip inventory is bound to the actual Astro-build report `tests/fixtures/ui-conformance/event-card-large-chip-inventory.v1.json` with SHA-256 `74ec329cba6b1885ba36e56f74a2eb50536243f489da60f3155a112d115b2446`, Astro source `22ebe3c5e92b13684cca32c14357ef7b91834977`, and tooling `713a035a8aaa9ecfdcdd5fbd817fe504160df2f5`. It records 8 exact corpus rows, 3 event types, 7 admission literals, 8 occurrence labels, count/calendar states, and reachable generator branch families. Event type/admission/action masters are distinguished from content overrides; occurrence is honestly marked as a missing semantic target. Missing Penpot corpus specimens are explicit gaps.

Seven structural Penpot read-backs at file revision 1408 are committed with hashes. No Penpot write/comment resolution/promotion occurred. Full raster packs are not fabricated: all seven current final receipts remain `BLOCKED` until the exact 11-file durable packs and current contract metadata/export read-back exist.

## Changed files

- `.github/workflows/ui-three-way-conformance.yml`
- `catalog/ui-components/event-card-large/current-v2/**`
- `contracts/ui-conformance/{event-card-large-current-v2-*,durable-evidence-manifest.v1.schema.json}`
- `scripts/current-v2/{build-current-v2.mjs,current-v2.mjs}`
- `tests/event-card-large-current-v2.test.mjs`
- `tests/ui-archetype-context-v1.test.mjs` (stale immutable-base assertion corrected to the requested exact base)
- `docs/normalization/event-card-large-current-v2-closure.md`
- `evidence/ui-conformance/event-card-large/current-v2/README.md`

## Evidence and commands

- Build: `node scripts/current-v2/build-current-v2.mjs` — 7 cases, 0.08 s, max RSS 57,168 KiB.
- Semantic/provenance validation with three reachable Git repos — PASS, 0.10 s, max RSS 57,972 KiB.
- Batch plan — 7 cases, `BLOCKED_UNTIL_RUNTIME_EVIDENCE`, 0.05 s.
- Cleanup `--dry-run` — PASS; no durable evidence removed, 0.05 s.
- One real local 7906 evidence validation — expected fail-closed exit 2 (`BLOCKED_EVIDENCE_INCOMPLETE`); old aggregate artifacts lack canonical names/identity-bound per-case JSON and are not laundered into current evidence.
- `node tests/event-card-large-current-v2.test.mjs` — PASS (3.91 s).
- `node tests/ui-archetype-context-v1.test.mjs` — PASS (3.88 s).
- `node tests/ui-conformance-v1.test.mjs` — PASS (7.23 s).
- JSON parse: 49 current-v2/schema files — PASS.
- Workflow YAML parse — PASS.
- `git diff --check` — PASS before commit.
- Current-v2 catalog: bounded ~360 KiB; tooling ~33 KiB; durable store currently README-only (~1 KiB).

## Risks / blockers

1. Exact 11-file durable evidence packs are not yet present; current receipts correctly remain BLOCKED.
2. Penpot structural shapes were read at revision 1408, but the new current-v2 contract hash has not received a verified live Penpot metadata/export read-back. Mobile PNG hashes have no proven numeric export revision: `revision=null` and `export_revision_status=unknown_historical_verified_hash` keep them BLOCKED. No materialization label is misrepresented as a revision and no false PASS is recorded.
3. Design PR #40 / events PR #546 external GitHub state still needs to be marked superseded outside this repository; the immutable contour ledger records the required action.
4. The changed-scope/full-batch GitHub Actions run belongs to integration after the design candidate SHA is bound by the follow-up provenance commit.
5. Telegram was not republished. Current bindings require changed image/verdict hashes, a superseding message and verified read-back.

No production UI, deploy, family promotion, Penpot comments, Penpot writes, or Telegram messages were changed.

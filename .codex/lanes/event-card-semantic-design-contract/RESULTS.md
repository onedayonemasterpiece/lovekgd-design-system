# EventCard semantic design-contract lane results

## Lane

- Lane ID: `event-card-semantic-closure/design-contract`
- Requirement IDs: `R03`, bounded `R04` contract/documentation correction
- Base SHA: `7a26772828a5d74a9683c08e7e6774ff15ac61a5`
- Implementation head SHA: `974325c7bf7bf75d645e95ebeee91135baecbda7`
- Branch: `agent/event-card-semantic-closure/design-contract`
- Result: `DONE` for the additive Git SoT contract; Penpot reconciliation remains a declared next gate.

## Delivered

1. Added a hash-scoped, noncanonical EventCard semantic content overlay.
2. Preserved exactly one Event type component with arbitrary non-empty text content and bound all 31 exact resolver-rendered production labels/counts (703 total) as evidence, not variants.
3. Replaced stale `paid|unspecified` Admission semantics with one component and states `ticket`, `free-entry`, `free-registration`, `registration-only`, `sold-out`, `phone`, `price`, `absent`.
4. Made price amount/range and currency/default content; no price/currency-per-variant model. Unknown is absent/hidden; `Условия уточняются` is forbidden; two observed `0 ₽` rows fail closed.
5. Named interactive wrappers `event.action.*`; Like/Share wrap `event.social-proof.*`. Each proof owns its count descendant; loose count/icon siblings and component-per-number are forbidden.
6. Stored the aggregate-only exact public resolver census durably in the catalog and bound SHA-256 `30c8ac5adfaeff17c463191714f660b3ed5d0a00aa8799e90f2be70cb1ca9993`.
7. Kept broad DB census SHA-256 `3578bee41bda0b5e32e950fd1f27a2561b1ca3714ce7ac9bdd8cc4068e36ff08` explicitly supporting-only, not the exact public projection.
8. Added strict JSON Schema, a fail-closed validator, ten rehashed negative mutations, and semantic supersession notices in the historical derived docs. Historical receipts/cases were not rewritten.

Contract payload SHA-256: `849c3c9035f15bd7e22815e99d8187063ae086692d7c51f8bc021134d95d8484`.

## Evidence and commands run

- `sha256sum /tmp/event-card-semantic-exact-public-census.json`
  - observed `30c8ac5adfaeff17c463191714f660b3ed5d0a00aa8799e90f2be70cb1ca9993`
- `node tests/event-card-large-semantic-content-contract-v1.test.mjs`
  - PASS: 31 labels, 703 projections, action/proof ownership and negative mutations
- `node scripts/validate-event-card-large-semantic-content-contract-v1.mjs --root . --census /home/dev/.codex/worktrees/events-bot-new/event-card-semantic-runtime/artifacts/codex/event-card-semantic-closure/production-census.json`
  - PASS: exact projection bytes and supporting broad-census bytes verified
- Python `jsonschema.validate(...)` for the new contract/schema
  - PASS
- `node tests/event-card-large-current-v2.test.mjs`
  - PASS
- `node tests/event-card-taxonomy-candidate-v1-negative.mjs`
  - PASS
- `python3 scripts/validate-event-card-systemic-boundaries-v1.py`
  - PASS
- `python3 scripts/validate-event-card-taxonomy-candidate-v1.py --root .`
  - PASS
- `git diff --check`
  - PASS

## Changed files

- `catalog/ui-components/event-card-large/semantic-content-contract.v1.json`
- `catalog/ui-components/event-card-large/semantic-production-census.v1.json`
- `contracts/ui-components/event-card-large-semantic-content-contract.v1.schema.json`
- `docs/normalization/event-card-large-semantic-content-contract-v1.md`
- `docs/normalization/event-card-large-current-v2-closure.md`
- `docs/normalization/event-card-large-primitives-owner-comments-20260820.md`
- `docs/normalization/event-card-taxonomy-candidate-v1.md`
- `scripts/validate-event-card-large-semantic-content-contract-v1.mjs`
- `tests/event-card-large-semantic-content-contract-v1.test.mjs`
- `.codex/lanes/event-card-semantic-design-contract/RESULTS.md`

## Risks / honest blockers

- Existing Penpot semantic masters have not yet been reconciled to this overlay; no Penpot write was made in this lane.
- The current runtime still emits the obsolete unknown Admission output for 96 projected events and has two invalid `0 ₽` rows. Those are explicit candidate/runtime gaps, not accepted states.
- No owner visual acceptance, reverse Astro integration, family promotion, deployment, Telegram publication, or Penpot comment resolution is claimed.

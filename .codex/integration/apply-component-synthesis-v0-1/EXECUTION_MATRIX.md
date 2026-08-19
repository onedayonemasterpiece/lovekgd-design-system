# Apply Component Synthesis v0.1 — Execution Matrix

| ID | Requirement | Area | Dependencies | Primary lane | Done when |
|---|---|---|---|---|---|
| R00 | Verify ZIP SHA/manifest; unpack immutable package into repository root | provenance | none | L0 integration | 16/16 entries hash/byte exact; unpacked diffable records committed |
| R01 | Verify exact current design/events SHAs, 107 paths, imports/consumers and bounded source drift | source evidence | R00 | L1 source reconciliation | exact path/edge census and delta ledger emitted without production writes |
| R02 | Integrate registry/mappings into existing normalization schemas/validators | registry | R00, R01 | L4 validation/integration | 107 unique terminal mappings and every FK/graph invariant fail closed |
| R03 | Close six technical reconciliation items with terminal evidence | reconciliation | R01 | L1 source reconciliation | 6/6 terminal outcomes; owner ambiguity count remains zero |
| R04 | Enrich W1–W4 candidate contracts and fixture/media coverage | contracts/fixtures | R00, R03 | L2 contracts/fixtures | every materializable entity has sufficient candidate contract and fixture plan |
| R05 | Build deterministic/idempotent Resource Graph materialization; live W1–W4 read-back when available | Penpot | R02–R04 | L0 serial Penpot | native candidates/variants/nested instances, second run no duplicates, read-back receipt |
| R06 | Validate all 18 archetype graphs from instances or explicit gaps | archetypes | R02, R04 | L3 archetype IR | 18/18 graphs valid and explicit gap count sealed |
| R07 | Withdraw old Event Media owner pack without deletion or acceptance | UI Exploration | R03 | L0 serial Penpot | all 3 historical boards tagged withdrawn/needs revision, selected=accepted=0 |
| R08 | Run full tests, create receipts/rollback, push required branch and open Draft PR without merge | delivery | all | L4 + L0 | local/CI gates pass, Draft PR open, PR unmerged |

## Dependency graph

```text
R00 → R01 → R03 → R04 ─┐
R00 → R02 ← R01        ├→ R05 live Penpot → R08
R02 + R04 → R06 ───────┘
R03 → R07 ─────────────┘
```

## Global constraints

- `events-bot-new` is read-only and must remain byte-clean.
- No new decoder, taxonomy redesign, production Astro refactor, token invention, experiment winner, acceptance or promotion.
- Shared final validator/receipt and all live Penpot mutation belong to the serial integrator.
- Worker branches may change only their declared paths and must finish clean with lane RESULTS.

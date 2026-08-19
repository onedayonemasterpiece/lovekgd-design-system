# Event-card completion v2 — execution matrix

Fanout decision: read-only audits ran in parallel; all Git/Penpot writes remain serial in the sole integrator because contracts, component bindings, receipts, and the live Penpot file are shared mutable state.

| ID | Requirement | Dependency | Owner/mode | Done when | Status |
|---|---|---|---|---|---|
| R01 | Exact Astro → Git SoT for every proven card family/state/element | immutable `events-bot-new@a68c7f23…` | integrator / serial | 5 families, exact axes/65 state keys, source selectors and parent-surface ownership validate | Git Done |
| R02 | True native Penpot variants + exact metadata | R01 | integrator / serial Penpot | 5 logical families / 6 bounded error-free VariantContainers, exact axes/65 members, source/hash/state metadata | Done |
| R03 | Source-faithful framing and clean Page40 masters | R01 | integrator / serial Penpot | source geometry, nested media, no overlap/giant projection, bounded pages | Done |
| R04 | Compact Page46 review architecture | R02–R03 | integrator / serial Penpot | lightweight index plus bounded family pages, exact 65-state readback | Done |
| R05 | Complete 42-visual / 43-binding medallion collection | R01 | integrator / serial Penpot | Page48 has 42 linked masters plus 6 native source-geometry frame variants | Done |
| R06 | Complete Amber/Focus/reference artifact collection and nested Amber rail | R01 | integrator / serial Penpot | Page49 has 8 Amber, 4 collection-surface, 12 Focus and 7 reference states; rail uses linked Amber | Done |
| R07 | Exact card icon registry and shared Page25 components | R01 | integrator / serial Git+Penpot | 24 source-bound icons; every visible card glyph linked; zero visible loose card glyphs | Done |
| R08 | Clean Page15/Page45 and all touched page layouts | R01 | integrator / serial Penpot | only compact process/source tables and review-functional objects remain | Done |
| R09 | Receipts, export, validation, idempotency, CI | R02–R08 | integrator / serial | exports/readback pass; validate=0; second run created=0; local workflow green | Done locally / remote CI pending |
| R10 | Independent closure audit before REVIEW READY | R09 | read-only reviewer | every requirement passes; NOT READY removed only after evidence | Pending |

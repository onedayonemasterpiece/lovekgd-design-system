# Event-card taxonomy candidate v1 — execution matrix

| Requirement | Dependency | Owner | Status | Integration gate |
|---|---|---|---|---|
| R1 screenshot census and disposition | supplied screenshots + review routes | screenshot-census explorer (read-only) | done | every `Sxx/Ixx` appears exactly once in binding manifest |
| R2 runtime/DOM/CSS/Astro owner mapping | exact review build + `events-bot-new@d2b7993b…` read-only | runtime-mapping explorer (read-only) | done | bidirectional route/DOM/source bindings recorded |
| R3 Git candidate taxonomy + binding manifest + visual spec + validator | R1, R2, framing v2 | integrator | done | positive + negative validation; exact current fixture/media bindings |
| R4 Git commit/push + linked Draft PR | R3 | integrator | done | branch pushed; PR #37 stacked on #36 |
| R5 Penpot Page40 replacement and new Page46 | Git candidate commit | integrator | done structurally | five source-bound native masters, five linked review instances, seven nested linked media instances; old heavy Page40 dependency-audited and deleted |
| R6 exports, visual QA, idempotency, receipt | R5 | integrator | partial / exporter blocked | festival/listing/rail pass; event text repair outcome unknown after 504 + disconnect; exhibition export pending; validation 0, detached 0, idempotent create 0 |
| R7 Actions | R4, R6 | integrator | checked | candidate workflow green; unrelated/pre-existing synthesis check remains red |

Write ownership was serial: explorers remained read-only; the integrator alone mutated Git and Penpot. `events-bot-new` remained read-only.

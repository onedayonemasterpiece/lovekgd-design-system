# Event-card taxonomy candidate v1 — execution matrix

| Requirement | Dependency | Owner | Status | Integration gate |
|---|---|---|---|---|
| R1 screenshot census and disposition | supplied screenshots + review routes | screenshot-census explorer (read-only) | in progress | every `Sxx/Ixx` appears exactly once in binding manifest |
| R2 runtime/DOM/CSS/Astro owner mapping | live review HTML + `events-bot-new@a68c7f23` read-only | runtime-mapping explorer (read-only) | in progress | bidirectional route/DOM/source bindings recorded |
| R3 Git candidate taxonomy + binding manifest + validator | R1, R2, framing v2 | integrator | in progress | positive + negative validation |
| R4 Git commit/push + linked Draft PR | R3 | integrator | pending | branch pushed; PR linked to #36 |
| R5 Penpot Page 40/45/new 46 materialization | Git candidate commit | integrator | pending | native component/instance readback |
| R6 exports, visual QA, idempotency, receipt | R5 | integrator | pending | exports inspected; second run creates zero |
| R7 Actions | R4 | integrator | pending | workflow status recorded |

Write ownership is serial: explorers are read-only; the integrator alone mutates Git and Penpot. `events-bot-new` remains read-only.

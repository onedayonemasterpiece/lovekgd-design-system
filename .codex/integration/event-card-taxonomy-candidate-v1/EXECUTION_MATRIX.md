# Event-card taxonomy candidate v1 — execution matrix

| Requirement | Dependency | Owner | Status | Integration gate |
|---|---|---|---|---|
| R1 screenshot census and disposition | supplied screenshots + review routes | screenshot-census explorer (read-only) | done | every `Sxx/Ixx` appears exactly once in binding manifest |
| R2 runtime/DOM/CSS/Astro owner mapping | exact review build + `events-bot-new@d2b7993b…` read-only | runtime-mapping explorer (read-only) | done | bidirectional route/DOM/source bindings recorded |
| R3 Git candidate taxonomy + binding manifest + visual spec + validator | R1, R2, framing v2 | integrator | done | positive + negative validation; exact current fixture/media bindings |
| R4 Git commit/push + linked Draft PR | R3 | integrator | done | branch pushed; PR #37 stacked on #36 |
| R5 Penpot Page 40/45/new 46 materialization | Git candidate commit | integrator | rejected; remediation in progress | source-bound native masters with nested media instances and readback |
| R6 exports, visual QA, idempotency, receipt | R5 | integrator | blocked on R5 | one bounded source/reference/export comparison per family; second run creates zero |
| R7 Actions | R4, R6 | integrator | pending | workflow status recorded after final receipt push |

Write ownership is serial: explorers are read-only; the integrator alone mutates Git and Penpot. `events-bot-new` remains read-only.

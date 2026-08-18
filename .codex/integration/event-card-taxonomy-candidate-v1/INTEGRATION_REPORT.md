# Event-card taxonomy candidate v1 — integration report

| Requirement | Result | Evidence |
|---|---|---|
| R1 screenshot census | Done | 8 screenshots, 23 items, exact-once manifest coverage |
| R2 runtime mapping | Done | exact review build `production-secret-20260809T192529-2f0fa64e`, source `d2b7993b...` |
| R3 Git candidate | Done | five evidenced component boundaries, schemas and validator |
| R4 Git/PR | Done | stacked Draft PR #37 linked from #36 |
| R5 Penpot | Rejected; remediation in progress | Page46 `66419e3c-4a3e-80f8-8008-80991f88c656` is explicitly `REJECTED · NOT REVIEWABLE` at containment revision 169. The earlier schematic masters are not implementation evidence. One source-bound `event.media-frame` main now exists for `festival.card`; the card master and review page are not yet accepted. |
| R6 QA/receipt | Failed | The earlier count-only gate produced a false positive. Every former `visually-inspected-pass` is withdrawn. The replacement gate requires source-bound family exports and an explicit mismatch-free comparison; no family has passed it yet. |
| R7 Actions | Pending post-remediation push | Candidate workflow exists; final status must be recorded only after the Penpot receipt reflects the rematerialized review page. |

`events-bot-new` remained read-only. All new material remains candidate / reconstructed / noncanonical / not promoted.

The authoritative failure analysis and replacement visual gate are recorded in
`VISUAL_FAILURE_ROOT_CAUSE.md` and
`receipts/penpot/event-card-visual-acceptance-v1.json`. Historical Page46
counts must not be interpreted as visual acceptance.

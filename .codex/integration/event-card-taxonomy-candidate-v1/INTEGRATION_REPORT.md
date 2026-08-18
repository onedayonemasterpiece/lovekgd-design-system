# Event-card taxonomy candidate v1 — integration report

| Requirement | Result | Evidence |
|---|---|---|
| R1 screenshot census | Done | 8 screenshots, 23 items, exact-once manifest coverage |
| R2 runtime mapping | Done | exact review build `production-secret-20260809T192529-2f0fa64e`, source `d2b7993b…` |
| R3 Git candidate | Done | five evidenced component boundaries, schemas, validator, and exact source-derived visual spec |
| R4 Git/PR | Done | stacked Draft PR #37 linked from #36 |
| R5 Penpot | Done structurally; visual gate still open | Lightweight replacement Page40 `45de0a42-f540-80b3-8008-80aa7bc00fa0`; review Page46 `45de0a42-f540-80b3-8008-80ad04ad1a0e`; five native candidate masters and five linked review instances; seven nested linked `event.media-frame` instances. The unusable 44,290 px legacy Page40 was dependency-audited and deleted at revision 222; the rejected Page46 remains archived. |
| R6 QA/receipt | Partial / exporter blocked | File revision 221 validates with zero errors; actual idempotency rerun created 0, with zero missing/duplicate stable IDs and zero detached instances. `festival.card`, `listing.event-card`, and `listing.rail-row` have bounded export comparison passes. The `event.card` export exposed zero-bounds text; its bounded repair returned HTTP 504 with unknown outcome, followed by MCP disconnection. `exhibition.row` is pending export. Page46 remains visibly `NOT READY`. |
| R7 Actions | Checked | Event-card taxonomy workflow succeeds. Pre-existing Project Normalization Synthesis workflow remains red and is not represented as fixed by this lane. |

`events-bot-new` remained read-only. All new material remains candidate / reconstructed / noncanonical / not promoted.

## Current review surface

- URL: <https://design.penpot.app/#/workspace?team-id=81f57451-85cc-819d-8008-70ebaeab3fd6&file-id=3be9e5e1-190f-8090-8008-713c0fbe6260&page-id=45de0a42-f540-80b3-8008-80ad04ad1a0e&board-id=45de0a42-f540-80b3-8008-80ad15597720>
- Page: `46 — Event cards · Candidate fidelity v3 · NOT READY`
- Root: `45de0a42-f540-80b3-8008-80ad15597720`, `1280×1480`
- Exact source SHA: `d2b7993b41187660efa13d6d9070fda0c0d5a6cd`
- Readback: five family instances, seven nested media instances, exact original media dimensions, Inter text in every master, no full-card screenshots.

The authoritative failure analysis and replacement visual gate are recorded in
`VISUAL_FAILURE_ROOT_CAUSE.md` and
`receipts/penpot/event-card-visual-acceptance-v1.json`. Structural readback is not substituted for the remaining event-card and exhibition visual comparisons.

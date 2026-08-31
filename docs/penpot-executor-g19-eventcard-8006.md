# G19 EventCard four-case native materialization V3

This bounded Git delivery implements owner lease
`G19-P2-P4-ACTUAL-MATERIALIZATION-R1`. Penpot mutations by Codex are `0`;
`E0_CHATGPT_PRO` executes the generated phase scripts.

## Exact first-run target

- file: `40e06342-8830-80d6-8008-8fc8a3a4cd4f`
- page: `c16498cb-b51d-8030-8008-904bd8fc9c53`
- expected revision: `41`
- sole page-level root: existing board
  `313fb1ed-0d5c-8095-8008-9108df52b2ce`,
  `KenigEvents · G12 bounded L0-L3`
- expected board census: zero children/descendants, zero local components,
  validation `[]`

The runtime never creates, deletes, or replaces a page-level root. All leaf
masters, assets, linked instances, and accepted EventCard masters are appended
under that existing board.

## Accepted four-case slice

- `eventcard.desktop-wide-calendar.8006` — `event.real.8006`
- `eventcard.mobile-wide-calendar.8006` — `event.real.8006`
- `eventcard.desktop-packed-calendar-absent.2182` — `event.real.2182`
- `eventcard.mobile-packed-calendar-absent.2182` — `event.real.2182`

The payload also creates fourteen persistent leaf components: seven exact
semantic leaves for each desktop/mobile structural context. Artwork and SVG
icons are embedded from hash-locked accepted inputs; no runtime filesystem,
import, network, or screenshot-as-design dependency exists.

## Generate and verify

```bash
node scripts/round-trip-reconstruction/generate-g19-eventcard-8006-materializer.mjs
node --test tests/penpot-g19-eventcard-8006-materializer.test.mjs
node --test tests/*.test.mjs
```

The authoritative output identities, execution order, input provenance, and
four-case lineage are in
[`manifest.json`](../catalog/penpot-executor/g19/manifest.json), marker
`ASP_G19_P2_PAYLOAD_READY_V3`.

## Bounded execution

In one Penpot plugin session, pass each file in `manifest.execution.setup_order`
to `Penpot.execute_code`. Setup is read-only: it uploads the payload in bounded
chunks, verifies its SHA-256 with a self-contained implementation, resolves the
exact target, and installs `storage.g19EventCard8006`.

Then execute each file in `manifest.execution.mutator_order`. After every
mutator, execute [`readback.js`](../catalog/penpot-executor/g19/readback.js).
Each phase is dependency-ordered and idempotent by exact V3 object marker and
payload hash; partial `BUILDING`, `READY_FOR_COMPONENT`, and `SHELL_COMPLETE`
objects are resumed without blind cleanup.

After `P90_FINALIZE`,
[`export-roots.js`](../catalog/penpot-executor/g19/export-roots.js) exports all
four accepted roots and returns PNG `base64` and `data_url` fields.

## Fail-closed contract

- First setup accepts only revision `41` with the exact empty accepted scaffold.
- Resume accepts only payload-owned board children and component mains under the
  exact board; unmanaged content, marker/hash drift, or validation errors fail.
- DejaVu Sans is resolved natively by family and exact variants `normal-400`
  and `normal-700`. Runtime font IDs are receipt data, never pinned inputs;
  immutable font source hashes remain provenance metadata.
- Component-copy descendants are resized/repositioned without structural
  re-append operations.
- Every write unit uses the exact undo-block token and saves a phase-specific
  named version.
- Final success requires 18 board children, 18 local components, four accepted
  card roots, zero detached/screenshot/duplicate roots, and validation `[]`.

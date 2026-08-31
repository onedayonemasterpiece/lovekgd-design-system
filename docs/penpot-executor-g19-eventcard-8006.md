# G19 EventCard 8006 native materialization

This is the bounded Git delivery for owner lease
`G19-P2-P4-ACTUAL-MATERIALIZATION-R1`. It does not grant Codex authority to
write Penpot: `E0_CHATGPT_PRO` remains the sole Penpot writer.

## Exact execution target

- file: `40e06342-8830-80d6-8008-8fc8a3a4cd4f`
- page: `c16498cb-b51d-8030-8008-904bd8fc9c53`
- expected first-run revision: `40`
- fixture: `event.real.8006`
- accepted card components:
  - `eventcard.desktop-wide-calendar.8006`
  - `eventcard.mobile-wide-calendar.8006`

The payload is generated from hash-locked accepted inputs. The full binding is
recorded in [`../catalog/penpot-executor/g19/manifest.json`](../catalog/penpot-executor/g19/manifest.json).

## Commands

Regenerate and verify the self-contained payload:

```bash
node scripts/round-trip-reconstruction/generate-g19-eventcard-8006-materializer.mjs
node --test tests/penpot-g19-eventcard-8006-materializer.test.mjs
```

E0 passes the exact UTF-8 contents of
[`run-materialization.js`](../catalog/penpot-executor/g19/run-materialization.js)
to `Penpot.execute_code`. It contains the poster bytes and SVG icons; Penpot
does not need filesystem, imports, or network access.

After the mutator returns, E0 runs, in the same plugin session:

1. [`readback.js`](../catalog/penpot-executor/g19/readback.js) — repeats the
   file/page census, returns IDs/names/counts, and invokes
   `penpot.currentFile.validate()`.
2. [`export-roots.js`](../catalog/penpot-executor/g19/export-roots.js) — exports
   both accepted roots as PNG and returns `base64` plus `data_url`.

## Fail-closed and idempotency contract

- Exact DejaVu Sans Regular 400 and Bold 700 IDs are resolved before the first
  write; family fallback is forbidden.
- A target or initial revision mismatch fails before writes.
- Existing matching masters are reused; a same-name component with a different
  G19 marker fails closed.
- Every component is a separate `undoBlockBegin()` / `undoBlockFinish(blockId)`
  recovery unit. An interrupted `BUILDING` root is resumed by its child markers;
  it is never deleted or duplicated.
- The payload never calls remove/detach and never cleans accepted roots.
- Every card child that owns media, content, metadata, or an action is a linked
  local component instance.
- Success requires two accepted roots, 16 managed local components (14
  structural-context leaf masters plus the two accepted card masters), zero
  detached roots, zero screenshot roots, zero route-local duplicate masters,
  and validation `[]`.
- A successful write saves the named version
  `G19 EventCard event.real.8006 · <payload-prefix>`; retries reuse that exact
  version label instead of creating duplicates.

This delivery is not a screenshot-as-design shortcut and does not change the
repository-wide promotion lifecycle.

# Penpot workspace incident — React #185

## Observed

- Timestamp: `2026-08-25T00:26:05+02:00`.
- Penpot: `2.17.2-RC2`.
- File: `3be9e5e1-190f-8090-8008-713c0fbe6260`.
- Owner report SHA-256:
  `1c5939803a307c8ce94b6e6940be985febaf684bc26081d6d211dbd76bafc583`.
- Failure: React production error `#185`.
- Immediately preceding event tail repeatedly cycled through:
  `resize-text` → `clean-text-modifier` → `update-position-data`, followed by
  page finalization/initialization.

React defines #185 as its maximum nested update guard: a component repeatedly
updates state until React stops the loop.  The report therefore describes a
workspace render/update storm, not evidence of corrupt semantic SoT.

## Trigger assessment

The strongest evidence is rapid page transition while the previous text-heavy
page still had queued text layout updates.  The earlier reconstruction helper
opened eleven pages inside one MCP invocation, and the Date helper opened a
component-main page and an owner page in the same invocation.  Even though the
planned mobile repair changes only X coordinates, this traversal pattern can
amplify Penpot's page-initialization text resize work.

The owner-supplied report makes the ordering explicit: the final repeated text
triplet was followed only `213 ms` later by `finalize-page`; the next page was
initialized `538 ms` after that.  React #185 fired after the new page's font,
thumbnail, library, shortcut and comment watchers were installed.  This is the
exact unsafe interleaving guarded against below: do not finalize/navigate while
text measurement events from the previous page are still draining.

This is an evidence-based inference, not a proven minimal reproduction.  It is
consistent with Penpot's own React #185 issue class and its text-resize crash
reports.

## Preventive correction

1. The mobile offset repair is now single-page/single-board per MCP call.
2. Date master repair and owner reset are separate calls.
3. Page navigation is its own MCP call.  A text-heavy page gets at least five
   seconds of local quiescence before the first mutation; a mutation is never
   coupled to the navigation call.
4. The live snapshot no longer calls `mainInstance()` for the entire 624-item
   component library.
5. Read-only inventory does not open pages.
6. Exports remain one bounded board/component per call; no full heavy page.
7. A React #185/text-resize-loop report now forces reload, read-only validation,
   and read-back before any further write.
8. Text-heavy materialization is limited to one semantic record/row per MCP
   call.  A later phase may continue only after exact-ID read-back has proved
   the previous phase terminal.

## Guard verification after reload

The next shared desktop-footer repair exercised the guard rather than merely
documenting it.  The footer and viewport masters live on different pages, so
navigation, master geometry, four core-copy sections, six social records, two
share actions, owner correction and board export were executed as separate
bounded calls with local settle/read-back gates.  The complete change propagated
to eight linked owner copies, `currentFile.validate()` stayed `[]`, and no React
`#185` recurrence occurred.  The bounded 1280×1200 export completed through
`Board.export()` and local chunked transfer.

The standard MCP `export_shape` wrapper also timed out twice on the bounded
Date mobile owner board after the reload.  Per the documented plugin contract,
the reconstruction runner now calls `Board.export({type: "png"})` only on the
already-open owner board, transfers the returned `Uint8Array` in bounded
base64 chunks, and verifies the decoded PNG dimensions and SHA-256 locally.
This avoids navigating or exporting an entire page and keeps export separate
from mutation.  The first corrected Date export completed in 7.3 seconds;
subsequent 390-pixel owner-board exports completed without a workspace crash.

## Component-copy persistence guard

While correcting semantic bottom-navigation states, two component-copy calls
returned MCP internal timeouts even though a later read-back proved that all
requested overrides had persisted.  This matches Penpot's documented plugin
API issue class: component/variant mutations can leave the promise pending and
the plugin session unavailable for additional seconds.  The stable sequence is
therefore:

1. open one owner page in its own call;
2. wait outside the plugin call;
3. submit the bounded override call and return immediately (do not wait for
   layout/persistence inside that call);
4. wait locally, then read the exact shapes back;
5. retry only when read-back proves the write is absent.

Using this sequence, the remaining active-nav owner states returned in about
2.6 seconds per mutation and persisted with `currentFile.validate()=[]`.

The same guard prevented a later false retry during Event detail reconstruction:
a bounded creation of the desktop Practical component returned HTTP `504`, but
the subsequent read-back found the complete native component (15 children),
its library registration, and `validate()=[]`.  The write was therefore treated
as successful and was not replayed.  No React #185 recurrence followed.

The reloaded workspace then completed the source-locked Exhibitions mobile
fixture repair under the same guard.  Creation of the four small dependency
masters was split into separate calls and read back by exact component ID.  The
single-row card-master write returned HTTP `504`; after a 12-second external
settle, read-back proved the existing master had been renamed to fixture `6983`,
contained all 14 expected children, preserved linked Deck/Like/Reject/Signal
dependencies, and still returned `validate()=[]`.  It was not retried.  The
subsequent owner reset, section CTA, badge-header state and bounded 390x1200
export completed without a React #185 recurrence.  This is additional evidence
that the failure mode was unsafe text-layout/navigation interleaving rather
than document corruption or board size alone.

The subsequent desktop Exhibitions correction repeated the same bounded
protocol: four exact-data media-deck adapters were created one at a time; the
`ExhibitionRow` master page and owner page were opened in separate calls with a
ten-second quiescence boundary; four owners were corrected and read back one at
a time; and the 1280×1200 owner board was exported separately through
`Board.export()` and 48 kB base64 chunks.  `currentFile.validate()` settled to
`[]` after the component-swap propagation window, the export decoded to a
600,173-byte PNG with SHA-256
`6fa43cbf4f3f143b6d044b8e4e16691a61d513bc4f86e048106edfae0595ee83`,
and React `#185` did not recur.  This also confirms that the preventive rule is
not simply “make boards smaller”: the decisive controls are single-page
navigation, quiescence, bounded writes, exact read-back, and bounded export.

## References

- React error 185: https://react.dev/errors/185
- Penpot React #185 workspace issue: https://github.com/penpot/penpot/issues/10726
- Penpot text-resize crash issue: https://github.com/penpot/penpot/issues/10168
- Penpot MCP/plugin text sizing guidance:
  https://github.com/penpot/penpot/blob/develop/mcp/packages/server/data/initial_instructions.md
- Penpot component-copy override model:
  https://help.penpot.app/user-guide/design-systems/components/
- Penpot plugin component/variant mutation hang:
  https://github.com/penpot/penpot/issues/10099

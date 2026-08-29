# Archetype-context lane results

## Scope

Implemented R07/R09/R17 as additive, candidate/noncanonical SoT artifacts. No Penpot write, Astro source write, corpus-v1 payload write, or historical receipt mutation was performed.

## Resolved source chain

Pinned Astro runtime authority: `7d4b1d32710f60d65c7eb0dbd084d8cad058b5dc`.

`event-detail-related` resolves through:

1. `DesktopEventPage.astro` consumer -> `OptimizedEventCardGrid` parent archetype.
2. viewport 1280 -> `.page-shell` width `min(1180, V - 32)` = 1180px.
3. grid `repeat(3, minmax(0, 1fr))`, gap `clamp(.85rem, 1.6vw, 1.25rem)` = 20px, `align-items: stretch`.
4. used card width `(1180 - 2 * 20) / 3` = 380px.
5. `packRelatedCardRows` receives `7906, 8156, 4327, 6628`, reorders to `7906, 8156, 6628, 4327`, and emits row/column placement and shared row ratios.
6. cards use `height:100%` and internal `auto/minmax` tracks; the tallest intrinsic sibling determines the row height. Heights and DOMRects remain explicitly pending runtime measurement rather than fabricated.
7. media available box is `380 / rowRatio`: 456px for row 0 at `5/6`, 253.234375px for row 1 at `1280/853`.
8. current Astro framing remains reference authority. Owner-approved Penpot framing is encoded only as an explicit `penpot-candidate-only` delta with no promotion effect before owner browser approval.

The current mobile source discrepancy is recorded, not blended: at `<=560px` the consumer width is `V - 58`, while the EventCard fallback is `4 / 5` and `mobileFlowMedia` resolves `5 / 4` at current call sites.

## Added artifacts

- strict consumer-layout resolution and contract schemas;
- additive EventCard Large component-contract v2 schema/contract;
- additive conformance-case v2 and resolved-render-case v2 schemas;
- consumer layout contract and registry;
- four executable v2 cases plus four resolved render cases for immutable fixtures 7906, 8156, 6628, and 4327;
- semantic validator and positive/negative tests.
- an executable pinned-resolver evidence generator plus executed resolver receipt. The exact input order is `7906, 8156, 4327, 6628`; the resolver output order is `7906, 8156, 6628, 4327`. The canonical resolver output hash is `2b7f1a729d442c4036a605c843cda6446a988814089502587b3be691d51031ab`.
- a gated, unexecuted Penpot materialization IR v2 for an isolated EventCard v2 master, OptimizedEventCardGrid archetype, four linked fixture instances, linked archetype review instance, propagation audit, and non-destructive quarantine reconciliation.

Live Penpot evidence is revision 1256: the current variant container has 13 members, of which 11 are governed and two are explicit anomalies. The contract does not call all 13 active variants. The IR creates no guessed IDs: new resources use stable discovery keys, and every create/reconcile phase halts unless exact live revision/member readback still matches.

The three fixtures whose resolved calendar node is absent retain `calendar: null` and `resolved_visibility.calendar: false`; 7906 retains its eligible Calendar action.

## Comparison disposition

All four v2 cases are `blocked-pending-exact-consumer-capture-and-penpot-materialization`. Existing 474px pilot exports remain historical isolated specimens and are not treated as the real desktop archetype.

## Validation

Passed:

- `node tests/ui-conformance-v1.test.mjs`
- `node scripts/validate-ui-archetype-context-v1.mjs`
- `node tests/ui-archetype-context-v1.test.mjs`
- `node scripts/run-ui-archetype-packer-evidence-v1.mjs <detached 7d4b1d327... checkout>` reproduced byte-identical stdout SHA-256 `3dcf3dc905821942de538e4c365478f3593045ddaa468fd945b988b8085436e3`
- Draft 2020-12 `jsonschema` validation for both contracts, four v2 cases and four v2 resolved cases
- `git diff --check`
- byte-diff guard for `catalog/fixtures/ui-reference-events/v1` and `receipts/ui-conformance/golden-event-corpus-v1-pilot` against base `7f6824e`

Negative coverage rejects isolated 474px width as archetype truth, 16px gap drift, packed-order drift, fabricated pending DOMRects, candidate authority blending, and candidate deltas outside media framing.

# A0 Owner Review Index direct plugin bundle v1

Package-local deterministic standalone bundle for `A0-PAGE-AUX-OWNER_REVIEW_INDEX-R1`.
It preserves the older 45-row A0 donor only as immutable provenance, but uses the
exact 42 Atlas R2 `page_units` as the sole visible row authority. It materializes
each physical page exactly once in `page_order` with `OWNER_INDEX_V2` on order `0000`,
a `2624×2528` root, bottommost content at `2464`, and truthful `PENDING_V0` chips.

## Frozen inputs

- A0 source: `a0/asp-penpot-page-wave-v1-20260901@4edc859861fba3f18fab0e65e9d2e8c0a7394bdb`
- Atlas R2: `o0/penpot-atlas-layout-v2-20260901@663be702d481972cb2e8863af500f1c35dda1d8c`
- Conformance harness: `agent/d0-plugin-bundle-conformance-v1-20260902@9ab3696f1053ba41ecd4ac7bf1f52ef3427d145b`
- Normative contract: `kenigevents.asp-conformance` v1.1.0, SHA-256 `54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72`

The three files under `source-inputs/` are byte-identical mirrors of the source
paths declared in `package.v1.json`; they are generator inputs, not a new
product package.

## Plugin entrypoint

Load `owner-review-index.bundle.js` as one browser/Penpot plugin artifact and
use global `D0A0OwnerReviewIndexV1`:

- `project(host)` — read-only preflight/projection;
- `execute(host)` — resumable mutation, at most three actual native creates per call;
- `settle(host)` — distinct read-only terminal census.

The physical ACTIVE tuple and finite lease must be supplied by the sole writer.
The bundle itself grants no Penpot authorization.

## Verification

```bash
node generate-bundle.mjs --check
node --test owner-review-index.bundle.test.mjs
```

The package test invokes the exact frozen `D0_PLUGIN_BUNDLE_CONFORMANCE_V1`
mirror, then checks cancellation, expiry, provenance, protected projections,
unknown-outcome stop, exact 42-row Atlas order/fields, linked header, and replay creation.
The stale 45-row donor is explicitly ignored as count authority.

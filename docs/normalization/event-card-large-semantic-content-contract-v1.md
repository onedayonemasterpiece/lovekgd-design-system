# EventCard Large semantic content contract v1

Status: **owner-corrected candidate; Penpot reconciliation required; not promoted**.

Machine contract:
[`semantic-content-contract.v1.json`](../../catalog/ui-components/event-card-large/semantic-content-contract.v1.json).

This additive overlay corrects only EventCard semantic content, action identity,
and count ownership. It does not rewrite the seven current-v2 conformance cases,
historical Golden Corpus evidence, or Penpot receipts. It performs no Penpot
write and authorizes no Astro production change.

## Production evidence and authority

The bounded evidence pass first inspected the production database read-only and
schema-first at `2026-08-22T00:00:00Z`. That broad aggregate artifact is bound by SHA-256
`3578bee41bda0b5e32e950fd1f27a2561b1ca3714ce7ac9bdd8cc4068e36ff08`.
It is not itself the EventCard public projection. The separate, aggregate-only
[exact resolver inventory](../../catalog/ui-components/event-card-large/semantic-production-census.v1.json)
applies the public SQL predicate and post-SQL gates, contains 703 rendered
events, and is bound by SHA-256
`30c8ac5adfaeff17c463191714f660b3ed5d0a00aa8799e90f2be70cb1ca9993`.

This evidence changes how earlier derived documents are interpreted:

- Golden Event Corpus v1 remains exact test evidence for its fixtures, but its
  three event-type examples are not the complete production vocabulary;
- `commercial=paid|unspecified` is not the component semantic model;
- `Условия уточняются` is an observed obsolete runtime output, not an accepted
  admission state.

The explicit owner decision outranks the earlier derived taxonomy and execution
guidance.

## Event type: one component, arbitrary content

Production currently renders 31 distinct non-empty labels, including Russian
categories and the source values `movie` and `therapy`. They are
recorded as census evidence in the machine contract.

There is still exactly one semantic component:

```text
event.meta.event-type
```

The label is arbitrary non-empty instance content. A new string never creates a
component, variant, or component family. `present|absent` is the structural
state; `absent` removes the node and its gap.

## Admission: state is not the literal price

The accepted states are:

```text
ticket
free-entry
free-registration
registration-only
sold-out
phone
price
absent
```

There is one `event.meta.admission` master. Exact display text is resolved
content. For `price`, content holds a positive amount or ordered range and an
arbitrary non-empty currency code/symbol. `RUB`/`₽` is the current renderer
default, not a variant axis. The census already contains 61 distinct price
labels/ranges, so a component per amount or currency would be invalid.

The census output counts are 181 ticket, 141 free entry, 20 free registration,
16 registration only, 9 sold out, 7 phone, and 233 price. Another 96 currently
render the obsolete unknown label. The candidate contract resolves unknown or
unspecified admission to `absent` with `visible=false`; it forbids the literal
`Условия уточняются`. Two source rows resolve to invalid zero price and must fail
closed rather than display a `0 ₽` chip.

## Action identity and social-proof ownership

`CTA` is a generic category, not a stable component name. Interactive wrappers
use semantic Action identities:

```text
event.action.like
event.action.share
event.action.calendar
event.action.not-interested
```

Like and Share actions nest, respectively:

```text
event.social-proof.like
event.social-proof.share
```

Each Social Proof component owns its own `Content / Count` descendant. The
number is arbitrary instance content, not a variant or sibling text layer.
Zero/missing resolves to `count-absent`; a positive integer resolves to
`count-positive`. The current projection observes Like positive/absent as
557/146 and Share positive/absent as 205/498. Calendar eligibility is 588/115.

The following structures are forbidden:

- a loose count beside an icon or action on the parent card;
- a raw functional icon named as the consumer role;
- a count owned by the parent card or terminal review instance;
- a Social Proof component used as the interactive wrapper;
- one component per count, event-type label, price, or currency.

## Required next Penpot gate

After this contract is integrated, a bounded Penpot pass must reconcile the
existing semantic masters, not build a large new page. Read-back must prove:

1. one Event type master and one Admission master;
2. allowed admission states only, with unknown represented by honest absence;
3. `event.action.*` wrappers containing linked `event.social-proof.*` instances;
4. count text inside and owned by the corresponding proof component;
5. zero detached copies, loose functional icons, or loose count siblings;
6. idempotent second materialization and focused, same-fixture review evidence.

Until that read-back exists, the status remains **candidate requiring Penpot
reconciliation**, not ready for reverse Astro integration or promotion.

## Validation

```bash
python3 -c 'import json,jsonschema; jsonschema.validate(json.load(open("catalog/ui-components/event-card-large/semantic-content-contract.v1.json")), json.load(open("contracts/ui-components/event-card-large-semantic-content-contract.v1.schema.json")))'
node scripts/validate-event-card-large-semantic-content-contract-v1.mjs --root .
node tests/event-card-large-semantic-content-contract-v1.test.mjs
```

The exact public-projection artifact is always verified from the catalog. When
the supporting broad database census is available locally, add
`--census <path>` to verify its bytes too.

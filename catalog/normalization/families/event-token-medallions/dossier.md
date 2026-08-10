# Event token medallions — normalization dossier v1.1

| Field | Value |
|---|---|
| Family | `family.event-token-medallions` |
| Component | `component.5734f2285cf06960` |
| Verdict | `BOUNDARY_AND_TAXONOMY_REVIEW_REQUIRED` |
| Readiness | `NOT_READY` |
| Decision | `NOT_MERGED` |
| Product value | `pending_product_model` |
| Normalization allowed | `false` |

This is an additive v1.1 dossier. It does not modify or supersede the immutable v1
candidate evidence or `catalog/normalization/families/family.event-token-medallions/`.

## Authority and scope

- Product source: `onedayonemasterpiece/events-bot-new` at behavioral SHA
  `ef7aa62e45c60f7a12da6160f490719c0721ec03` and closure SHA
  `66bc0d43e36299417626f992021cfb7299ddf704`.
- Source: `src/components/EventTokenMedallions.astro`, SHA-256
  `09456fd7356f91bf7c367fd63ce26bda485f8ac534787d542c78d6d117a51cee`.
- Candidate: `candidate.event-token-medallions`; capsule: `capsule.05-medallions`.
- Direct consumers: Desktop Event Detail, mobile Event Detail, mobile review lab and
  design-system lab.
- Listing card, mobile listing rail, exhibition and manual lab medallions remain
  separate resources. Shared identity data does not prove component equivalence.

## Independent taxonomy axes

Identity category is not token kind, and token kind is not visual form:

| Axis | Values |
|---|---|
| Identity category | `organizer`, `venue_brand`, `festival_brand`, `festival` |
| Token kind | `organizer`, `source`, `program`, `pushkin`, `badge`, `pill` |
| Identity role | `main`, `secondary`, `not_identity` |
| Visual form | circle, Pushkin composite frame, text pill |
| Admission | free, priced, unknown |
| Ticket status | sold out or not represented |
| Layout | `inline`, `desktop-slots` |
| Slot | `top`, `inline` |
| Resolution | resolved, conflicting source, ambiguous venue |
| Fallback | vector/raster primary, WebP with PNG, WebP without PNG, broken unresolved |

All four identity categories currently render as token kind `organizer`. This is an
AS-IS naming fact, not permission to erase venue or festival identity semantics.

## Mapping and semantic boundaries

- Resolved organizer, venue and festival identities become circular identity tokens.
- Grounded RZD transport becomes `program`; this is not generic program eligibility.
- The MEOW mark becomes `source` only with a matching Telegram source and a source
  count from one through two.
- Pushkin eligibility remains its own semantic kind and composite frame.
- Admission/status precedence is free badge, then price pill, then sold-out pill.
  Sold-out is ticket status, not admission, despite sharing the pill form.
- Kids/family and charity are component-local inferred pills; their semantic authority
  remains unresolved.
- Festival text fallback is a pill and is distinct from a festival identity.
- Current tokens are informational spans. No link/focus/action contract is accepted.

The complete executable mapping is in `dossier.json`; every mapping binds a predicate,
semantic facet, kind, form, role and top-slot eligibility without collapsing axes.

## Identity fail-closed behavior

- At most three identities are selected.
- Conflicting structured event IDs on one source host suppress all resolved identities.
- Equally strong venue matches suppress venue identities while preserving other
  resolved identities.
- The fail-closed scope is identity only; source, program, Pushkin and admission tokens
  are not automatically suppressed.
- Main priority is `festival_brand`, `festival`, `organizer`, then `venue_brand`, with
  evidence rank and source order used afterward.

## Slots, ordering and overflow

- `inline` can contain all six kinds.
- `desktop-slots` filters out pills.
- `top` contains at most one Main identity, only when `allowTopSlot` is true.
- Desktop consumer policy enables top only for editorial/non-OCR presentation.
- With top disabled, Main remains inline.
- Generation order is identities, transport, source, Pushkin, exclusive
  admission/status, kids/family, charity and festival text fallback.
- Total visible cap is six. If free admission occurs later, retain the first five plus
  free admission.
- The runtime caps before desktop pill filtering. A pill can therefore consume the
  pre-filter window and starve a later desktop-eligible token. This boundary is open
  and must not be silently reordered.

## Consumer-owned geometry

There is no accepted global medallion size:

- mobile inline: `clamp(84px,23vw,92px)`;
- desktop inline: `clamp(72px,7vw,94px)`;
- desktop top: `clamp(88px,7.4vw,108px)`;
- desktop compact height: `72px`.

The documentation value `clamp(88px,23vw,112px)` conflicts with consumer CSS.
`decision.event-token-medallions.consumer-geometry` has no receipt, and none of these
source values is normalized geometry until computed observations and owner review close.

## Accessibility and media

AS-IS output uses labelled `section` groups, `ul role="list"`, `li` tokens, wrapper
`aria-label`s and empty image alt because the wrapper owns the accessible name. Tokens
are not focusable. Promotion requires an accepted decision about whether identity/source
tokens remain informational or become links, plus broken-asset behavior and review of
all taxonomy/overflow specimens.

WebP with PNG uses a WebP `<source>` and PNG `<img>` fallback. WebP without fallback and
non-WebP assets render directly. There is no synthetic-initial fallback.

## Evidence and verdict

The original candidate declares 25 fixture classes: 11 route and 14 controlled.
The capsule binds only four controlled observations, none claiming a production state.
Of 21 page references, 17 are reviewed, four remain pending human visual review, and
all have `production_observed_by_capsule:false`. Computed geometry, controlled specimens,
production binding and cross-resource equivalence remain open.

Therefore the only truthful current verdict is:

```text
BOUNDARY_AND_TAXONOMY_REVIEW_REQUIRED
NOT_READY
NOT_MERGED
```

This dossier authorizes no normalization, promotion, source UI change, removal or Penpot
materialization.

# Event Media — framing contract v2

- **Status:** `candidate`
- **Authority mode:** `reconstructed`
- **Canonical:** `false`
- **Promotion status:** `not_promoted`
- **Observed:** 2026-08-18
- **Implementation/runtime status:** `NOT_IMPLEMENTED_OR_RUNTIME_PROVEN`

This document replaces the v1 framing text in PR #36. The old text described an
earlier Penpot page and pulled the current system into a generic four-profile
geometry model. The actual review surface is now:

- file `3be9e5e1-190f-8090-8008-713c0fbe6260`, current cross-page readback at revision `318`;
- page `a21f0524-f565-8038-8008-789db00ee3ef`;
- page name **45 — Media framing · Candidate policy v2**;
- root board `a21f0524-f565-8038-8008-789db035ea4a`, candidate/noncanonical visual projection;
- root geometry `1480×9300`;
- direct URL: <https://design.penpot.app/#/workspace?team-id=81f57451-85cc-819d-8008-70ebaeab3fd6&file-id=3be9e5e1-190f-8090-8008-713c0fbe6260&page-id=a21f0524-f565-8038-8008-789db00ee3ef&board-id=a21f0524-f565-8038-8008-789db035ea4a>.

`events-bot-new` remains read-only for this work. Neither this Git candidate nor
Page 45 proves that the runtime already conforms.

## Contract boundary

Framing is resolved by the card or surface that owns the media slot. It is not a
single site-wide ratio token and it is not inferred from the source orientation
alone.

```text
current production consumer
× media-slot role
× source geometry
× semantic/protected regions
× safe crop window
→ visible media-frame geometry + proportional image transform
```

The v2 page contains a **Production media slots** section. Its current specimens
must be represented directly rather than rewritten into the v1 `5:4 compact`
default:

| Slot | Penpot specimen | Visible geometry | Ratio |
|---|---|---:|---:|
| `desktop_base` | `7488d568-c486-80e8-8008-7e47e4951252` | `360×270` | `4:3` |
| `mobile_default` | `7488d568-c486-80e8-8008-7e47e5400231` | `360×300` | `6:5` |
| `related_rail` | `7488d568-c486-80e8-8008-7e47e5ee66d4` | `360×288` | `5:4` |
| `large_portrait` | `7488d568-c486-80e8-8008-7e47e678f6e4` | `250×312.5` | `4:5` |
| `site_wide` | `7488d568-c486-80e8-8008-7e47e71a5255` | `360×225` | `16:10` |
| `ocr_bounded` | `7488d568-c486-80e8-8008-7e47e79f471c` | `220×315.2` in the current specimen | computed |

These are candidate slot bindings on Page 45, not proof that every visually
similar card is a current production consumer. Production provenance still has
to be bound to the generated review DOM and the current Kaggle build.

## Rendering invariants

1. Scale is always proportional. Stretching and squashing are forbidden.
2. There are no fields inside media: no letterbox, empty bands, blur backdrop,
   duplicated background, repeated edges, or `contain` inside a fixed ratio frame.
3. Protected/intrinsic media changes the geometry of the visible media frame or
   card. The image is not repaired by placing it inside a larger empty window.
4. `cover` is permitted only for an actually safe crop window. Blind center crop
   is forbidden.
5. Loading, missing and broken states reserve the same resolved media geometry
   as the corresponding ready state.

Radii are consumer-owned source values, not global framing tokens:

- festival card shell/media: `10px`;
- listing event-card media: `14px`;
- mobile rail summary/action: `14px` / `12px`;
- large EventCard shell/top media corners: `24px`;
- exhibition row: desktop `0px`, mobile shell `8px`, undo control `4px`.

Applying the earlier `16/24/28/12` tuple globally is explicitly invalid because
it changes the proven Astro consumer shells.

## Adaptive large-card framing

| Source case | Target frame | Transform |
|---|---|---|
| landscape crop-safe photograph | `5:4` | proportional safe `cover` |
| portrait crop-safe photograph with meaningful vertical identity | `4:5` | proportional safe `cover` |
| very-tall OCR/protected artwork | ratio computed from the real safe crop window | proportional top/bottom crop, no fields |
| protected media without a proven safe crop | source-preserving/intrinsic frame | proportional, no fixed-frame fields |

The important v2 correction is that **very-tall OCR is not forced to `4:5`**.
The top and bottom may be cropped, asymmetrically if necessary, but total source
area loss is at most `20%`. The complete protected text/logo/valuable union must
remain visible. Geometry within the numerical budget is not permission to crop;
the exact source needs positive safe-region evidence.

For the two recorded source cases:

- `906×1280`: a `4:5` window loses approximately `11.5%`, but is allowed only
  when `safe_crop=true` for that exact source;
- `1429×2560`: do not force `4:5`; compute the output ratio from the actual
  top/bottom crop window, capped at `20%` total loss.

If safe crop is not proven, the fallback is the source-preserving/intrinsic
frame. In this contract “intrinsic” means that the **frame follows the visible
image geometry**; it does not mean `contain` with empty fields.

## Composition ownership

- A multi-portrait viewer contains multiple independent child media frames.
- In a two-event composition, the parent layout owns both complete EventCard
  columns, the divider and their widths.
- Event Media owns only the media inside each EventCard. The old v1
  `paired_composite` media-frame mode is therefore superseded.

The v2 Page 45 specimen demonstrates this with two complete card columns and a
`60/40` divider. The exact divider value is a parent-layout example, not a new
global media ratio token.

## What v1 got wrong or left stale

The following v1 statements must not be carried into prompts or implementation
work as if they described the current Page 45:

1. the page name, root height and readback metrics;
2. the four global profiles / three computed modes as the complete framing
   taxonomy;
3. collapsing actual desktop/mobile slot geometry into one universal `5:4`
   compact profile;
4. `protected_intrinsic = contain` inside a fixed frame;
5. paired event visuals as one media-frame composition;
6. forcing very-tall OCR to `4:5`;
7. `home image hero` or generic `feature` as proven current consumers.

Observed ratios may remain in source vocabulary. They become normative only
through an evidenced consumer-slot binding; Page 45 does not authorize a global
ratio normalization by visual similarity.

## Unresolved owner comments are part of the current evidence

Page 45 has three unresolved threads, and this Git sync intentionally does not
mark them resolved:

| Thread | Owner correction | Git effect | Penpot state |
|---:|---|---|---|
| `#11` | Very-tall artwork should use an actual top/bottom crop up to `20%` total area loss; `4:5` was never mandatory. | Bound above as the OCR rule. | Visual specimen still requires correction/re-review. |
| `#12` | The marked image should receive that bounded crop rather than the current treatment. | Recorded as a required visual follow-up, not a completed claim. | Open. |
| `#13` | Invented or old laboratory mobile cards are not current production evidence; only cards generated by the current Kaggle production path count. | Unproven specimens cannot carry production provenance. | Open. |

A thread may close only when the Git contract, Penpot visual decision and
metadata/bindings say the same thing. This change establishes the Git candidate;
it does not claim the remaining Penpot visual correction is complete.

## Acceptance and non-claims

The framing candidate is reviewable when:

- every image is proportional;
- visible media has no internal fields;
- consumer slot geometry is explicit;
- every crop preserves the full protected region;
- the OCR crop budget is calculated from actual source/window geometry;
- parent and child composition ownership is not conflated;
- unproven laboratory specimens do not claim production status.

This PR does **not** claim production implementation, runtime conformance,
component promotion, closure of Penpot comments `#11–#13`, or any mutation of
`events-bot-new`.

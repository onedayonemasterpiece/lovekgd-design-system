# Event Media — canonical geometry and crop policy v1

**Status:** `OWNER_DIRECTED_TARGET_DECISION`

**Decision date:** 2026-08-12  
**Design-system source:** `onedayonemasterpiece/lovekgd-design-system@c59a3576c7361c1953b31ad9b98ed096640e92c7`  
**Implementation evidence source:** `onedayonemasterpiece/events-bot-new@69ec403428e48725ad822b9e322628400f82be91`  
**Implementation/runtime status:** `NOT_IMPLEMENTED_OR_PROVEN_BY_THIS_CHANGE`

Penpot target surface:

- file: `3be9e5e1-190f-8090-8008-713c0fbe6260`;
- page: `45 — Media geometry · Canonical policy v1`;
- page id: `a21f0524-f565-8038-8008-789db00ee3ef`;
- root board id: `a21f0524-f565-8038-8008-789db035ea4a`;
- direct URL: <https://design.penpot.app/#/workspace?team-id=81f57451-85cc-819d-8008-70ebaeab3fd6&file-id=3be9e5e1-190f-8090-8008-713c0fbe6260&page-id=a21f0524-f565-8038-8008-789db00ee3ef&board-id=a21f0524-f565-8038-8008-789db035ea4a>.

This document is the target product/design decision. It does not mutate `events-bot-new`, claim production conformance, close runtime evidence, promote a component candidate or answer the two separate component-identity owner questions in `event-media-owner-decision-queue.md`.

## Why the previous crop atlas was not a decision surface

Page 44 correctly preserved observed consumers, but it mechanically rendered all cases from one `3:2` photograph. That makes the atlas unsuitable for choosing a target policy because:

1. the same consumer can require different geometry for landscape photography, portrait photography, OCR/document media and unknown media;
2. `1.20`, `1.25`, `1.35`, `27:20`, `6:5`, `4:3`, `3:2`, viewport-derived and intrinsic values were mixed as if they were peers;
3. observed implementation ratios were presented as candidate design tokens without a product-value test;
4. `cover`, `contain`, focal point, safe area and crop permission were not resolved as one executable decision;
5. output formats such as share and Open Graph were mixed with on-screen component geometry;
6. a safe-zone overlay was visible, but the target crop was not actually derived from different source geometries or protected regions.

Page 44 remains AS-IS evidence. Page 45 is the normalized target decision.

## Decision summary

The target system contains:

- **4 canonical on-screen geometry profiles**;
- **3 computed geometry modes**;
- **2 output contracts outside the on-screen ratio-token set**.

There is deliberately no single global Event Media ratio. Resolution is consumer-local and deterministic:

```text
semantic media mode
× consumer placement
× source geometry and quality
× protected regions and crop permission
→ profile / computed mode / fit / object-position / fallback
```

The source ratio alone never selects the result. The component name alone never selects the result.

## Resolver order

The canonical resolver applies these gates in order:

1. **Classify semantic mode:** `visual_only`, `poster_artwork`, `ocr_document`, `unknown`.
2. **Bind placement:** `compact`, `large_card`, `stage`, `gallery_preview`, `share`, `paired`.
3. **Read source geometry:** width, height, source ratio, exact media URL/hash and quality metadata.
4. **Read protection metadata:** faces/person boxes, valuable region, OCR/text boxes, focal point, provenance and manual override.
5. **Apply quality gate:** a large stage cannot be forced merely because its ratio is eligible.
6. **Select canonical profile or computed mode.**
7. **Resolve fit and crop window.**
8. **Fail safely:** alternate profile, alternate asset, protected intrinsic, stack or fallback art.
9. Emit a stable reason code and diagnostics.

The same exact input and metadata version must produce the same result.

## Four canonical on-screen profiles

| Profile | Geometry | Applies to | Product rationale | Does not apply to |
|---|---|---|---|---|
| `compact_landscape` | `5:4` | mobile rail, regular/weekend/popular listing, search/feed cards, EventCard flow, related rows | stable dense rhythm; portrait sources remain more legible than in a low panoramic slot; one ratio removes unjustified density drift | protected OCR/document/unknown that cannot satisfy the bounded row contract |
| `portrait` | `4:5` | intentional portrait photo identity in a large one-up/mobile card; portrait artwork only after explicit safe review | preserves vertical identity where the media has enough visual area | compact rail; generic listing density variants |
| `wide_stage` | responsive `16:10` mobile → `16:9` desktop | qualified large `visual_only` hero, gallery or feature media | one responsive stage profile instead of unrelated mobile/desktop tokens | OCR/document/unknown; low-resolution, unsafe portrait or unresolved media |
| `square_exception` | `1:1` | genuine square source, small exhibition/mosaic tile or identity tile with a square product role | square rhythm is meaningful only in a bounded composition | default EventCard, rail, generic event hero |

### Defragmentation consequence

The observed listing ratios `1.20`, `1.25`, `1.35`, `6:5` and `27:20` collapse to `compact_landscape / 5:4`.

Observed `4:3` and `3:2` remain valid **source vocabulary**, but they are not independent on-screen tokens. A landscape source resolves to `5:4`, `wide_stage` or a computed mode according to placement and semantics.

## Three computed modes

### 1. `protected_intrinsic`

Used for OCR/document, unknown, authored poster/artwork without positive crop permission, and any source whose protected union cannot fit the requested canonical window.

- frame follows source ratio within consumer min/max bounds;
- `contain` or an intrinsically sized frame is the default;
- no fake blur, duplicated backdrop, gradients or repeated-edge filling;
- unknown, contradictory or stale classification fails closed;
- a parent layout cannot override this mode with blind `cover`.

### 2. `flexible_stage`

Used when a large surface needs to respond to viewport, text/content geometry or source quality rather than a fixed ratio.

- height is derived from viewport/content bounds and quality gates;
- portrait or low-resolution media may route to split layout, bounded stage or alternate asset;
- `flexible` is a computation mode, not another ratio token.

### 3. `paired_composite`

Used only when two event visuals must occupy one parent frame.

- outer geometry is still canonical: normally `5:4` for compact placement or `wide_stage` for a full-width placement;
- divider is solved in the inclusive range `35%..65%`;
- objective minimizes worst individual crop, then total crop and focal displacement;
- any protected-region violation is an infinite veto;
- OCR/document can veto a side-by-side composition;
- if no feasible split exists, use stack, one-up, alternate asset or protected contain.

A fixed `50/50` divider is not a target rule.

## Semantic fit and crop policy

### `visual_only` photography

- canonical compact and stage frames use `cover`;
- crop permission is still gated by protected regions and current metadata;
- focal point selects among already safe windows; it does not make an unsafe crop safe;
- no face, head or valuable region may be cut;
- absence of a valid window routes to another profile or asset.

### `poster_artwork`

Authored artwork is protected by default even when OCR has not been detected. It may behave like photography only after a positive reviewed `crop_safe_visual` decision bound to the exact source hash.

### `ocr_document`

Default: preserve the full authored image.

A cover crop is allowed only when **all** conditions hold:

1. the source is very tall: `sourceWidth / sourceHeight < 4/5`;
2. crop is top/bottom only;
3. measured source-area loss is `<= 0.20`;
4. `safe_crop=true` is explicit and source-grounded;
5. the complete protected text/logo union remains visible;
6. the resulting object position is deterministic.

The crop fraction is measured from real source and frame geometry:

```text
scale = max(frameWidth / imageWidth, frameHeight / imageHeight)
visibleFraction = frameArea / (sourceArea * scale²)
cropFraction = 1 - visibleFraction
```

The `20%` value is a maximum loss budget, not proof that a crop is safe.

### `unknown`

Unknown, missing, error, contradictory or stale semantics use the OCR/document policy. They do not fail open to photography.

## Large mobile card matrix

The large mobile card is explicitly adaptive:

| Source and semantic mode | Target geometry | Fit |
|---|---|---|
| landscape or square crop-safe photograph | `5:4` | safe `cover` |
| portrait crop-safe photograph with meaningful vertical identity | `4:5` | safe `cover` |
| OCR/document/poster without positive crop permission | source/intrinsic | `contain` or intrinsic frame |
| unknown/conflicting media | source/intrinsic | fail-closed protected mode |

The compact mobile rail is different: every positively proven crop-safe visual photograph uses `5:4` (`140×112` in the current R15 rail contract), regardless of source orientation. A portrait rail variant is forbidden.

## Compact row solver

The current bounded-row concept is retained and normalized:

- default target without a constraining document is `5:4`;
- an ordinary document contributes exactly its natural ratio;
- a very tall document contributes the interval `[naturalRatio, naturalRatio / 0.8]`;
- all cards in a row share one media height and one total card height;
- a non-final row is full; only the final row may be incomplete;
- rows may be reordered to find a feasible OCR-safe grouping;
- a wider computed target is allowed only when it is produced by the solver, not as a new token;
- no document is repaired with crop over budget or decorative bands.

## Smart crop / protected-region solver

Protected union:

```text
faces + person boxes + valuable region + OCR/text boxes + bounded safety margin
```

For a requested target ratio:

1. generate candidate crop windows;
2. discard every window that does not contain the complete protected union;
3. score remaining windows by crop area, focal displacement, headroom/bottom truncation and upscale penalty;
4. choose the minimum;
5. persist exact `object-position`, crop fraction, metadata version and reason code.

When no safe window exists, the fallback order is:

```text
alternate canonical profile
→ alternate source asset
→ protected_intrinsic
→ semantic fallback art
```

Blind center crop is forbidden.

Manual overrides are keyed by exact source URL/hash, not by event id, title or visual similarity. Every consumer of that exact source reuses the reviewed semantics and geometry metadata.

## Output contracts outside UI profiles

### Share output

`1080×1350 / 4:5` remains a justified output canvas, not a generic UI ratio.

- crop-safe visual photography may safe-cover the canvas;
- OCR/poster/unknown is contained inside a branded composition;
- remaining canvas may carry event metadata or brand surface;
- blind center-cover replacement is required.

### Open Graph

Current Open Graph source dimensions remain metadata/source behavior. They do not create another component ratio token. A dedicated generated social derivative, if introduced later, requires a separate output contract.

## AS-IS → target mapping

| Observed rows | Target |
|---|---|
| Mobile rail `5:4`; EventCard flow `5:4`; listing `1.35`, `1.20`, `1.25`; related row `5:4` | `compact_landscape / 5:4`, with related-row solver |
| EventCard `4:5` | adaptive large-card resolver |
| Mobile hero `16:10`; desktop primary/gallery viewport | `wide_stage`, `flexible_stage` or `protected_intrinsic` by semantics and quality |
| Mobile gallery protected; desktop previews protected | `protected_intrinsic` |
| Home hero flexible | `flexible_stage` |
| Share `4:5`; Open Graph source | separate output contracts |
| Exhibition P `4:5`; S `1:1` | `portrait` and `square_exception` |
| Exhibition W `4:3`; L `3:2` | `compact_landscape` or `wide_stage`; `4:3`/`3:2` remain source vocabulary |

## Implementation API shape

A production resolver should expose one shared contract rather than consumer-local CSS guesses:

```ts
type CanonicalProfile =
  | "compact_landscape"
  | "portrait"
  | "wide_stage"
  | "square_exception"
  | "protected_intrinsic"
  | "flexible_stage"
  | "paired_composite";

type MediaMode = "visual_only" | "poster_artwork" | "ocr_document" | "unknown";
type Placement = "compact" | "large_card" | "stage" | "gallery_preview" | "share" | "paired";

interface MediaGeometryInput {
  placement: Placement;
  mediaMode: MediaMode;
  source: {
    width: number;
    height: number;
    exactHash: string;
    quality?: Record<string, number | string | boolean>;
  };
  protection?: {
    faces?: NormalizedBox[];
    people?: NormalizedBox[];
    valuableRegion?: NormalizedBox;
    ocrBoxes?: NormalizedBox[];
    focalPoint?: NormalizedPoint;
    provenanceVersion: string;
  };
  cropPermission: "photo_auto" | "reviewed_safe" | "none";
}

interface MediaGeometryResult {
  profile: CanonicalProfile;
  aspectRatio?: number;
  fit: "cover" | "contain";
  objectPosition: string;
  cropFraction: number;
  dividerFraction?: number;
  fallback?: string;
  reasonCode: string;
}
```

The actual names may be adapted to the existing codebase, but the resolution boundary and emitted evidence must remain equivalent.

## Acceptance matrix

Implementation is accepted only when all of the following are proven against real fixtures and generated pages:

1. exactly four canonical UI profiles and three computed modes are addressable;
2. `1.20`, `1.25`, `1.35`, `27:20`, `6:5`, `4:3` and `3:2` do not survive as independent UI tokens;
3. compact crop-safe photography renders `5:4` with `cover`, no bands and no protected loss;
4. large-card landscape/square photo resolves to `5:4`, portrait photo to `4:5`, OCR/unknown to intrinsic;
5. OCR default is no-crop; cover requires `safe_crop=true` and measured loss `<=20%`;
6. geometry `<=20%` without safe protected-region evidence is rejected;
7. unknown, stale and contradictory metadata fail closed;
8. every accepted cover crop contains the full protected union;
9. the same exact input and metadata version emits byte-stable reason/result data;
10. paired divider remains within `35%..65%` and is deterministic;
11. loading, missing and broken states reserve the resolved geometry and do not cause layout shift;
12. share output uses semantic composition, not universal center-cover;
13. browser/image tests cover landscape photo, portrait photo, square OCR, tall OCR, unknown, tiny source, missing/broken and paired media;
14. mobile and desktop screenshots prove visual rhythm and no clipped protected content.

## Migration sequence

1. Inventory every current media consumer and bind it to placement + semantic mode.
2. Implement the shared resolver and reason-code diagnostics without changing final CSS first.
3. Add golden geometry tests for the fixture matrix.
4. Route compact cards and rails to `compact_landscape`.
5. Route large cards through the adaptive matrix.
6. Route hero/gallery surfaces through `wide_stage`, `flexible_stage` or `protected_intrinsic`.
7. Replace share center-cover with semantic composition.
8. Add paired-composite solver and fallback.
9. Remove obsolete consumer-local ratios only after visual/runtime parity passes.
10. Update native Penpot components and archetypes from the proven resolver outputs.

## Explicit non-claims and remaining work

This decision removes the **target design ambiguity** behind ratio, semantic and crop policy. It does **not** by itself close the historical evidence blockers `EM-RATIO-002`, `EM-SEMANTIC-003` or `EM-CROP-004`, because those blockers require executable consumer enforcement and runtime proof.

Still separate:

- exact upscale ceiling and low-resolution quality foundation (`EM-TINY-005`);
- primary alternate-source art direction and remaining responsive probes (`EM-RESP-008`);
- missing/broken convergence and genuine loading runtime;
- production-equivalent evidence and cell-level provenance;
- component identity and viewer/rail owner decisions.

No production source is changed in this design-system PR.

## Penpot materialization validation

Page 45 was built from multiple source geometries rather than one repeated photograph:

- landscape `3:2` photo;
- portrait `4:5` photo;
- reviewed `5:4` photo;
- tall OCR poster;
- square OCR poster;
- unknown/text-protected `4:3` source;
- fallback and tiny-state fixtures available for implementation tests.

Readback validation at creation time:

- `40` boards;
- `250` text nodes;
- `30` image-bearing shapes;
- `0` text-overflow findings;
- `0` child-outside-parent findings.

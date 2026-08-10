# family.event-media — v1.1 positive-readiness dossier

**Verdict:** `NOT_READY_WITH_EXACT_BLOCKERS`
**Decision:** `NOT_MERGED`
**Accepted decision:** `false`
**Normalization allowed:** `false`
**Promotion ready:** `false`
**Runtime mutation:** `false`

This dossier is a fail-closed evidence map. It does not select a target ratio, create tokens, merge or split implementations, edit UI, accept a contract, or replace immutable Decoder evidence. The historical v1 dossier remains at `catalog/normalization/families/family.event-media/` as input.

## Authority and integrity

- **design_base_sha:** `50f51565041a9ea36768784d1cc9ca1d7345acb7`
- **candidate_contract_ref:** `candidate.event-media`
- **candidate_contract_sha256:** `a48be25686f4f3434d4d06e3fa7cd7fea8333fdc5f0220743a16d7d425d15c04`
- **historical_v1_dossier_path:** `catalog/normalization/families/family.event-media/dossier.json`
- **historical_v1_dossier_sha256:** `72c8ed2ec07835181b1f4e25a13ff54ca50ac7177004ea9a4a3816df1fd7e44d`
- **behavioral_manifest_sha256:** `c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1`
- **events_source_sha:** `ef7aa62e45c60f7a12da6160f490719c0721ec03`
- **events_closure_sha:** `66bc0d43e36299417626f992021cfb7299ddf704`
- **relevant_source_files_byte_identical_at_closure:** `True`
- **independent_audit_sha256:** `a466ae5ff4846a1895eb11429c2fe4f175115a119dc9904d5a4a4e50a9507f76`

The relevant events source files are byte-identical at decoded source `ef7aa62…` and closure `66bc0d43…`; this proves source stability, not semantic readiness.

## Status vocabulary

- `PROVEN_AS_IS_NOT_ACCEPTED` — Positive evidence of current AS-IS behavior only; never an accepted target contract.
- `PARTIAL_EVIDENCE` — Some evidence exists, but required reconciliation or coverage is incomplete.
- `CONFLICT` — Authoritative source, requirement, consumer behavior or runtime evidence conflicts.
- `UNBOUND` — No positive consumer-scoped binding or explicit non-applicability decision.
- `NOT_APPLICABLE_WITH_REASON` — The cell is inapplicable for this semantic slot and carries a positive reason.
- `EVIDENCE_ONLY_OUT_OF_SCOPE` — Adjacent evidence retained for vocabulary/boundary review; not included in family scope.

## Scope and boundary

### In-scope candidate consumers

- `event-detail.desktop.primary-stage`
- `event-detail.desktop.fullscreen-gallery`
- `event-detail.desktop.poster-companion`
- `event-detail.desktop.preview-rails`
- `event-detail.mobile.primary-stage`
- `event-detail.mobile.fullscreen-gallery`
- `event-detail.shared.missing-fallback`

### Evidence-only consumers

- `lab.event-media-rail`

### Boundary-pending adjacent consumers

- `boundary.related-event-card`
- `boundary.mobile-listing-rail`

**Boundary rule:** Boundary evidence never expands family scope without an owner decision receipt; no merge/split is inferred.

## Consumer/slot matrix summary

| Consumer / slot | Scope | Ratios | Media types | Fit/crop/focus | Tiny/upscale | Fallback | Loading/layout | Responsive | Runtime |
|---|---|---|---|---|---|---|---|---|---|
| `event-detail.desktop.primary-stage` / `primary-large-frame` | in_scope_candidate | `UNBOUND`, `PARTIAL_EVIDENCE`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PROVEN_AS_IS_NOT_ACCEPTED`, `PARTIAL_EVIDENCE` | `PROVEN_AS_IS_NOT_ACCEPTED`, `CONFLICT`, `PARTIAL_EVIDENCE` | `PARTIAL_EVIDENCE` | `PARTIAL_EVIDENCE`, `UNBOUND` | `NOT_APPLICABLE_WITH_REASON`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PARTIAL_EVIDENCE`, `UNBOUND`, `CONFLICT` | `PARTIAL_EVIDENCE` |
| `event-detail.desktop.fullscreen-gallery` / `fullscreen-gallery` | in_scope_candidate | `UNBOUND`, `PARTIAL_EVIDENCE`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PROVEN_AS_IS_NOT_ACCEPTED`, `PARTIAL_EVIDENCE` | `PROVEN_AS_IS_NOT_ACCEPTED`, `CONFLICT`, `PARTIAL_EVIDENCE` | `PARTIAL_EVIDENCE` | `NOT_APPLICABLE_WITH_REASON`, `UNBOUND`, `PARTIAL_EVIDENCE` | `UNBOUND`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PARTIAL_EVIDENCE`, `UNBOUND` | `UNBOUND` |
| `event-detail.desktop.poster-companion` / `editorial-large-poster-companion` | in_scope_candidate | `UNBOUND`, `NOT_APPLICABLE_WITH_REASON`, `PARTIAL_EVIDENCE`, `PROVEN_AS_IS_NOT_ACCEPTED` | `NOT_APPLICABLE_WITH_REASON`, `PROVEN_AS_IS_NOT_ACCEPTED` | `NOT_APPLICABLE_WITH_REASON`, `PROVEN_AS_IS_NOT_ACCEPTED` | `UNBOUND` | `PROVEN_AS_IS_NOT_ACCEPTED`, `UNBOUND` | `NOT_APPLICABLE_WITH_REASON`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PARTIAL_EVIDENCE` | `UNBOUND` |
| `event-detail.desktop.preview-rails` / `editorial-and-split-small-previews` | in_scope_candidate | `PARTIAL_EVIDENCE`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PROVEN_AS_IS_NOT_ACCEPTED`, `PARTIAL_EVIDENCE` | `PARTIAL_EVIDENCE`, `UNBOUND`, `CONFLICT` | `PARTIAL_EVIDENCE` | `PARTIAL_EVIDENCE`, `UNBOUND` | `PARTIAL_EVIDENCE`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PROVEN_AS_IS_NOT_ACCEPTED`, `PARTIAL_EVIDENCE`, `CONFLICT` | `PARTIAL_EVIDENCE` |
| `event-detail.mobile.primary-stage` / `mobile-primary-stage` | in_scope_candidate | `UNBOUND`, `PARTIAL_EVIDENCE`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PROVEN_AS_IS_NOT_ACCEPTED`, `PARTIAL_EVIDENCE` | `PROVEN_AS_IS_NOT_ACCEPTED`, `CONFLICT`, `PARTIAL_EVIDENCE` | `CONFLICT` | `PROVEN_AS_IS_NOT_ACCEPTED`, `UNBOUND`, `CONFLICT` | `NOT_APPLICABLE_WITH_REASON`, `PARTIAL_EVIDENCE` | `PARTIAL_EVIDENCE`, `UNBOUND`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PARTIAL_EVIDENCE` |
| `event-detail.mobile.fullscreen-gallery` / `mobile-fullscreen-gallery-and-portrait-viewer` | in_scope_candidate | `UNBOUND`, `PARTIAL_EVIDENCE`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PROVEN_AS_IS_NOT_ACCEPTED`, `PARTIAL_EVIDENCE` | `PROVEN_AS_IS_NOT_ACCEPTED`, `CONFLICT`, `PARTIAL_EVIDENCE` | `CONFLICT` | `NOT_APPLICABLE_WITH_REASON`, `UNBOUND`, `CONFLICT` | `UNBOUND`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PARTIAL_EVIDENCE`, `UNBOUND` | `UNBOUND` |
| `event-detail.shared.missing-fallback` / `missing-media-fallback` | in_scope_candidate | `NOT_APPLICABLE_WITH_REASON`, `PROVEN_AS_IS_NOT_ACCEPTED` | `NOT_APPLICABLE_WITH_REASON` | `NOT_APPLICABLE_WITH_REASON`, `PROVEN_AS_IS_NOT_ACCEPTED` | `UNBOUND` | `PROVEN_AS_IS_NOT_ACCEPTED`, `UNBOUND`, `NOT_APPLICABLE_WITH_REASON` | `NOT_APPLICABLE_WITH_REASON`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PROVEN_AS_IS_NOT_ACCEPTED`, `NOT_APPLICABLE_WITH_REASON` | `PARTIAL_EVIDENCE` |
| `lab.event-media-rail` / `lab-preview-rail` | evidence_only_preserve | `PARTIAL_EVIDENCE`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PROVEN_AS_IS_NOT_ACCEPTED`, `CONFLICT` | `CONFLICT`, `UNBOUND`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PARTIAL_EVIDENCE` | `UNBOUND` | `NOT_APPLICABLE_WITH_REASON`, `PROVEN_AS_IS_NOT_ACCEPTED` | `PROVEN_AS_IS_NOT_ACCEPTED`, `UNBOUND`, `PARTIAL_EVIDENCE` | `PARTIAL_EVIDENCE` |
| `boundary.related-event-card` / `adjacent-related-card-media` | boundary_pending_do_not_merge | `EVIDENCE_ONLY_OUT_OF_SCOPE` | `EVIDENCE_ONLY_OUT_OF_SCOPE` | `EVIDENCE_ONLY_OUT_OF_SCOPE` | `EVIDENCE_ONLY_OUT_OF_SCOPE` | `EVIDENCE_ONLY_OUT_OF_SCOPE` | `EVIDENCE_ONLY_OUT_OF_SCOPE` | `EVIDENCE_ONLY_OUT_OF_SCOPE` | `EVIDENCE_ONLY_OUT_OF_SCOPE` |
| `boundary.mobile-listing-rail` / `adjacent-mobile-listing-media` | boundary_pending_do_not_merge | `EVIDENCE_ONLY_OUT_OF_SCOPE` | `EVIDENCE_ONLY_OUT_OF_SCOPE` | `EVIDENCE_ONLY_OUT_OF_SCOPE` | `EVIDENCE_ONLY_OUT_OF_SCOPE` | `EVIDENCE_ONLY_OUT_OF_SCOPE` | `EVIDENCE_ONLY_OUT_OF_SCOPE` | `EVIDENCE_ONLY_OUT_OF_SCOPE` | `EVIDENCE_ONLY_OUT_OF_SCOPE` |

Every detailed row below binds 4:5, 5:4, 3:2, 2:3, 1:1, intrinsic/source and other observed ratios; photography, poster/artwork, OCR/document and unknown text; cover/contain, crop, focal point, safe area and object-position; upscale/tiny, missing/broken/tiny fallback, skeleton/reservation, responsive resource selection/art direction/breakpoints, provenance and runtime. `target_decision` is `null` in every policy cell.

## Consumer `event-detail.desktop.primary-stage`

- Component: `src/components/DesktopEventPage.astro`
- Slot: `primary-large-frame`
- Scope: `in_scope_candidate`
- Route: `/sobytiya/:slug/`
- Viewport: `desktop >=1024px`

### Ratios

- **4:5 — `UNBOUND`.** No 4:5 consumer-specific frame or explicit non-applicability decision is proven. Evidence: `E-AUDIT-001`, `E-FIND-2X3`
- **5:4 — `UNBOUND`.** No 5:4 consumer-specific frame or explicit non-applicability decision is proven. Evidence: `E-AUDIT-001`, `E-FIND-2X3`
- **3:2 — `PARTIAL_EVIDENCE`.** Observed landscape source orientation and documented event-landscape vocabulary; no target frame selected. Evidence: `E-CHARTER-MEDIA`, `E-REQ-DESKTOP-ROUTING`, `E-FIND-2X3`
- **2:3 — `PARTIAL_EVIDENCE`.** Observed portrait/poster orientation only; no universal frame or token. Evidence: `E-CHARTER-MEDIA`, `E-FIND-2X3`
- **1:1 — `PARTIAL_EVIDENCE`.** Square sources route by current presentation logic; no target frame. Evidence: `E-CHARTER-MEDIA`, `E-REQ-DESKTOP-ROUTING`
- **intrinsic_source — `PROVEN_AS_IS_NOT_ACCEPTED`.** Preferred source width/height drives ratio; absent dimensions fall back to 1600x1000. Evidence: `E-SRC-DESKTOP-CROP`
- **other_observed — `PROVEN_AS_IS_NOT_ACCEPTED`.** Current logic admits arbitrary source ratios and a 1.25 landscape routing threshold. Values: 1600:1000 fallback, 1.25 routing threshold, 1.33 specimen, 1.50 specimen, 2.36 specimen. Evidence: `E-SRC-DESKTOP-CROP`, `E-REQ-DESKTOP-ROUTING`

### Media types

- **photography — `PROVEN_AS_IS_NOT_ACCEPTED`.** visual_only primary fills with cover. Evidence: `E-SRC-DESKTOP-CROP`, `E-REQ-DESKTOP-V12`
- **poster_artwork — `PARTIAL_EVIDENCE`.** Poster identity may be a distinct companion; poster-as-primary behavior depends on routing and semantic reconciliation. Evidence: `E-REQ-DESKTOP-COMPANION`, `E-REQ-DESKTOP-V12`
- **ocr_document — `PROVEN_AS_IS_NOT_ACCEPTED`.** ocr_text and semantic document primary are kept whole with contain. Evidence: `E-SRC-DESKTOP-CROP`, `E-REQ-DESKTOP-CORE`
- **unknown_text — `PROVEN_AS_IS_NOT_ACCEPTED`.** Semantic error/missing classification fails closed to unknown and contain. Evidence: `E-SRC-DESKTOP-CROP`, `E-REQ-DESKTOP-CORE`

### Fit, crop and focus

- **cover — `PROVEN_AS_IS_NOT_ACCEPTED`.** Current visual_only primary uses cover. Evidence: `E-SRC-DESKTOP-CROP`
- **contain — `PROVEN_AS_IS_NOT_ACCEPTED`.** Current non-visual-only primary uses contain and center. Evidence: `E-SRC-DESKTOP-CROP`
- **crop_permission — `CONFLICT`.** Current visual_only cover is not gated by safe_crop; requirement and consumer-local crop findings remain unreconciled. Evidence: `E-SRC-DESKTOP-CROP`, `E-REQ-DESKTOP-CORE`, `E-FIND-CROP`
- **focal_point — `PARTIAL_EVIDENCE`.** Upstream focal metadata exists, but the renderer consumes only a precomputed object-position string. Evidence: `E-SRC-TYPES`, `E-SRC-DESKTOP-CROP`
- **safe_area — `CONFLICT`.** safe_crop and geometry boxes exist but do not gate the current primary fit decision. Evidence: `E-SRC-TYPES`, `E-SRC-DESKTOP-CROP`, `E-REQ-HERO-SAFE`
- **object_position — `PROVEN_AS_IS_NOT_ACCEPTED`.** Explicit hero object-position, then asset recommendation, then 50% 50%; contain is centered. Evidence: `E-SRC-DESKTOP-CROP`

### Upscale and tiny source

- **upscale_tiny_source — `PARTIAL_EVIDENCE`.** Quality admission has 720px long-edge, 450000px area and score 10 gates, but no maximum rendered/source scale or accepted upscale threshold. Evidence: `E-SRC-QUALITY`, `E-REQ-DESKTOP-QUALITY`, `E-RUNTIME-TINY`

### Fallback states

- **missing — `PARTIAL_EVIDENCE`.** Missing URL resolves typed or generic fallback at the parent surface. Evidence: `E-SRC-DESKTOP-CROP`, `E-SRC-FALLBACK`
- **broken — `UNBOUND`.** No primary img error convergence to semantic fallback is proven. Evidence: `E-AUDIT-001`
- **tiny_source — `PARTIAL_EVIDENCE`.** A tiny-source candidate capture exists, but it does not establish an accepted upscale rule. Evidence: `E-RUNTIME-TINY`, `E-SRC-QUALITY`

### Loading and layout

- **skeleton — `NOT_APPLICABLE_WITH_REASON`.** Primary is static SSG content already present in initial HTML; an artificial initial skeleton is forbidden. Reason: No genuine asynchronous data-loading phase. Evidence: `E-CHARTER-MEDIA`
- **layout_reservation — `PROVEN_AS_IS_NOT_ACCEPTED`.** Desktop primary emits source width and height and reserves current geometry. Evidence: `E-SRC-DESKTOP-SLOTS`

### Responsive resource behavior and art direction

- **resource_selection — `PARTIAL_EVIDENCE`.** Primary uses one full source; derivative resource selection is proven only for preview slots. Evidence: `E-SRC-DESKTOP-SLOTS`
- **art_direction — `UNBOUND`.** No <picture>-style primary art-direction contract is proven. Evidence: `E-CHARTER-MEDIA`, `E-AUDIT-001`
- **breakpoints — `CONFLICT`.** Route switch is proven, but nine exact Desktop consumer probes have unreconciled cascade. Evidence: `E-SRC-ROUTE`, `E-RUNTIME-BREAKPOINTS`

### Provenance and runtime

- **source_refs:** `E-SRC-DESKTOP-CROP`, `E-SRC-DESKTOP-SLOTS`, `E-SRC-QUALITY`
- **requirement_refs:** `E-REQ-DESKTOP-CORE`, `E-REQ-DESKTOP-ROUTING`, `E-REQ-DESKTOP-V12`, `E-CHARTER-MEDIA`
- **runtime_refs:** `E-RUNTIME-TINY`, `E-RUNTIME-BREAKPOINTS`
- **Runtime status:** `PARTIAL_EVIDENCE`; packets: `E-RUNTIME-TINY`; `production_state_claimed=false`, `production_equivalence=false`, `production_observed=false`
- **Blockers:** `EM-RATIO-002`, `EM-SEMANTIC-003`, `EM-CROP-004`, `EM-TINY-005`, `EM-FALLBACK-006`, `EM-RESP-008`, `EM-RUNTIME-009`

## Consumer `event-detail.desktop.fullscreen-gallery`

- Component: `src/components/DesktopEventPage.astro`
- Slot: `fullscreen-gallery`
- Scope: `in_scope_candidate`
- Route: `/sobytiya/:slug/`
- Viewport: `desktop >=1024px when opened`

### Ratios

- **4:5 — `UNBOUND`.** No 4:5 consumer-specific frame or explicit non-applicability decision is proven. Evidence: `E-AUDIT-001`, `E-FIND-2X3`
- **5:4 — `UNBOUND`.** No 5:4 consumer-specific frame or explicit non-applicability decision is proven. Evidence: `E-AUDIT-001`, `E-FIND-2X3`
- **3:2 — `PARTIAL_EVIDENCE`.** Can occur as intrinsic gallery source; no frame decision. Evidence: `E-SRC-DESKTOP-CROP`, `E-CHARTER-MEDIA`
- **2:3 — `PARTIAL_EVIDENCE`.** Can occur as intrinsic gallery source; no universal frame decision. Evidence: `E-SRC-DESKTOP-CROP`, `E-FIND-2X3`
- **1:1 — `PARTIAL_EVIDENCE`.** Can occur as intrinsic gallery source; no target. Evidence: `E-SRC-DESKTOP-CROP`, `E-CHARTER-MEDIA`
- **intrinsic_source — `PROVEN_AS_IS_NOT_ACCEPTED`.** Every gallery slide carries intrinsic width and height. Evidence: `E-SRC-DESKTOP-CROP`
- **other_observed — `PROVEN_AS_IS_NOT_ACCEPTED`.** Arbitrary source ratios are admitted; viewer geometry is viewport-bound. Values: arbitrary source ratio, viewport-bounded contain/cover. Evidence: `E-SRC-DESKTOP-CROP`

### Media types

- **photography — `PROVEN_AS_IS_NOT_ACCEPTED`.** visual_only slide covers. Evidence: `E-SRC-DESKTOP-CROP`
- **poster_artwork — `PARTIAL_EVIDENCE`.** Identity poster role is carried, but role-to-fit reconciliation is incomplete. Evidence: `E-SRC-DESKTOP-CROP`, `E-REQ-DESKTOP-V12`
- **ocr_document — `PROVEN_AS_IS_NOT_ACCEPTED`.** OCR/document slide contains. Evidence: `E-SRC-DESKTOP-CROP`
- **unknown_text — `PROVEN_AS_IS_NOT_ACCEPTED`.** Unknown text contains. Evidence: `E-SRC-DESKTOP-CROP`

### Fit, crop and focus

- **cover — `PROVEN_AS_IS_NOT_ACCEPTED`.** Current visual_only gallery fit is cover. Evidence: `E-SRC-DESKTOP-CROP`
- **contain — `PROVEN_AS_IS_NOT_ACCEPTED`.** Current non-visual-only gallery fit is contain. Evidence: `E-SRC-DESKTOP-CROP`
- **crop_permission — `CONFLICT`.** Image-text mode, not safe-area proof, is the active crop gate. Evidence: `E-SRC-DESKTOP-CROP`, `E-FIND-CROP`
- **focal_point — `PARTIAL_EVIDENCE`.** Only recommended object-position is consumed. Evidence: `E-SRC-TYPES`, `E-SRC-DESKTOP-CROP`
- **safe_area — `CONFLICT`.** safe_crop is carried but does not gate fullscreen fit. Evidence: `E-SRC-DESKTOP-CROP`, `E-REQ-HERO-SAFE`
- **object_position — `PROVEN_AS_IS_NOT_ACCEPTED`.** Recommended position or center is applied to cover media. Evidence: `E-SRC-DESKTOP-CROP`

### Upscale and tiny source

- **upscale_tiny_source — `PARTIAL_EVIDENCE`.** Quality selection affects admitted assets; no gallery-specific upscale ceiling. Evidence: `E-SRC-QUALITY`, `E-REQ-DESKTOP-QUALITY`

### Fallback states

- **missing — `NOT_APPLICABLE_WITH_REASON`.** Absent sources are excluded before slide creation. Reason: Missing media does not create a gallery slide. Evidence: `E-SRC-DESKTOP-CROP`
- **broken — `UNBOUND`.** No broken gallery image fallback is positively captured. Evidence: `E-AUDIT-001`
- **tiny_source — `PARTIAL_EVIDENCE`.** Weak assets may be preserved if no strong alternative exists; no render-scale ceiling. Evidence: `E-SRC-QUALITY`

### Loading and layout

- **skeleton — `UNBOUND`.** Gallery sources load lazily after opening, but no accepted visible loading/skeleton contract is bound. Evidence: `E-SRC-DESKTOP-CROP`, `E-AUDIT-001`
- **layout_reservation — `PROVEN_AS_IS_NOT_ACCEPTED`.** Slides carry source width and height. Evidence: `E-SRC-DESKTOP-CROP`

### Responsive resource behavior and art direction

- **resource_selection — `PARTIAL_EVIDENCE`.** Full-size source is retained for the viewer; thumbnails use derivatives elsewhere. Evidence: `E-SRC-DESKTOP-SLOTS`
- **art_direction — `UNBOUND`.** No viewport-specific source art direction is proven. Evidence: `E-CHARTER-MEDIA`
- **breakpoints — `PARTIAL_EVIDENCE`.** Viewer is viewport bounded, but exact production runtime is unobserved. Evidence: `E-SRC-DESKTOP-CROP`, `E-RUNTIME-BREAKPOINTS`

### Provenance and runtime

- **source_refs:** `E-SRC-DESKTOP-CROP`, `E-SRC-QUALITY`
- **requirement_refs:** `E-REQ-DESKTOP-V12`, `E-CHARTER-MEDIA`
- **runtime_refs:** none; absence is explicit in JSON
- **Runtime status:** `UNBOUND`; packets: none; `production_state_claimed=false`, `production_equivalence=false`, `production_observed=false`
- **Runtime reason:** No exact fullscreen Event Detail media packet in the pinned supplement.
- **Blockers:** `EM-RATIO-002`, `EM-SEMANTIC-003`, `EM-CROP-004`, `EM-TINY-005`, `EM-FALLBACK-006`, `EM-LAYOUT-007`, `EM-RESP-008`, `EM-RUNTIME-009`

## Consumer `event-detail.desktop.poster-companion`

- Component: `src/components/DesktopEventPage.astro`
- Slot: `editorial-large-poster-companion`
- Scope: `in_scope_candidate`
- Route: `/sobytiya/:slug/`
- Viewport: `desktop >=1024px editorial companion branches`

### Ratios

- **4:5 — `UNBOUND`.** No explicit 4:5 companion decision. Evidence: `E-AUDIT-001`
- **5:4 — `UNBOUND`.** No explicit 5:4 companion decision. Evidence: `E-AUDIT-001`
- **3:2 — `NOT_APPLICABLE_WITH_REASON`.** This semantic poster slot does not select a landscape frame. Reason: Companion preserves source artwork ratio instead. Evidence: `E-REQ-DESKTOP-COMPANION`
- **2:3 — `PARTIAL_EVIDENCE`.** Portrait poster vocabulary is relevant, but actual companion remains source-ratio exact. Evidence: `E-CHARTER-MEDIA`, `E-FIND-2X3`
- **1:1 — `PARTIAL_EVIDENCE`.** Square identity poster can remain source-ratio exact; no fixed target. Evidence: `E-REQ-DESKTOP-COMPANION`
- **intrinsic_source — `PROVEN_AS_IS_NOT_ACCEPTED`.** Companion uses --ocr-ratio from source width/height; real requirement example is 1179x1523. Evidence: `E-SRC-DESKTOP-SLOTS`, `E-REQ-DESKTOP-COMPANION`
- **other_observed — `PROVEN_AS_IS_NOT_ACCEPTED`.** Any positive source-artwork ratio is supported. Values: 1179:1523 evidence, 800:1200 fallback dimensions. Evidence: `E-SRC-DESKTOP-SLOTS`

### Media types

- **photography — `NOT_APPLICABLE_WITH_REASON`.** Photographs belong to primary/preview slots, not the identity-poster companion. Reason: Semantic slot is explicitly identity poster/document. Evidence: `E-REQ-DESKTOP-COMPANION`
- **poster_artwork — `PROVEN_AS_IS_NOT_ACCEPTED`.** Classified event_identity_poster is the admission role. Evidence: `E-REQ-DESKTOP-COMPANION`, `E-REQ-DESKTOP-V12`
- **ocr_document — `PROVEN_AS_IS_NOT_ACCEPTED`.** Poster is kept whole and fully contained. Evidence: `E-SRC-DESKTOP-SLOTS`, `E-REQ-DESKTOP-COMPANION`
- **unknown_text — `NOT_APPLICABLE_WITH_REASON`.** Unknown documents may not be promoted to identity-poster companion. Reason: Poster identity must be positively classified. Evidence: `E-REQ-DESKTOP-V12`

### Fit, crop and focus

- **cover — `NOT_APPLICABLE_WITH_REASON`.** Cover is forbidden for the contained identity-poster companion. Reason: Artwork integrity and embedded text require the full source. Evidence: `E-REQ-DESKTOP-COMPANION`
- **contain — `PROVEN_AS_IS_NOT_ACCEPTED`.** Companion image uses contain and center. Evidence: `E-SRC-DESKTOP-SLOTS`
- **crop_permission — `NOT_APPLICABLE_WITH_REASON`.** Crop is forbidden. Reason: Source-ratio exact companion. Evidence: `E-REQ-DESKTOP-COMPANION`
- **focal_point — `NOT_APPLICABLE_WITH_REASON`.** Focal crop is irrelevant when no crop is allowed. Reason: Contained full artwork. Evidence: `E-REQ-DESKTOP-COMPANION`
- **safe_area — `NOT_APPLICABLE_WITH_REASON`.** Safe-area crop calculation is irrelevant when no crop is allowed. Reason: Contained full artwork. Evidence: `E-REQ-DESKTOP-COMPANION`
- **object_position — `PROVEN_AS_IS_NOT_ACCEPTED`.** Centered contained object position. Evidence: `E-SRC-DESKTOP-SLOTS`

### Upscale and tiny source

- **upscale_tiny_source — `UNBOUND`.** No companion-specific tiny-source or maximum upscale policy is proven. Evidence: `E-AUDIT-001`, `E-REQ-DESKTOP-QUALITY`

### Fallback states

- **missing — `PROVEN_AS_IS_NOT_ACCEPTED`.** Absent semantic companion omits the slot; it does not invent poster identity. Evidence: `E-REQ-DESKTOP-V12`
- **broken — `UNBOUND`.** Broken companion URL recovery is unproven. Evidence: `E-AUDIT-001`
- **tiny_source — `UNBOUND`.** Tiny identity-poster behavior is unbound. Evidence: `E-AUDIT-001`

### Loading and layout

- **skeleton — `NOT_APPLICABLE_WITH_REASON`.** Companion is static SSG media, not async data. Reason: No genuine initial data-loading state. Evidence: `E-CHARTER-MEDIA`
- **layout_reservation — `PROVEN_AS_IS_NOT_ACCEPTED`.** Width, height and aspect-ratio reserve the companion pane. Evidence: `E-SRC-DESKTOP-SLOTS`

### Responsive resource behavior and art direction

- **resource_selection — `PARTIAL_EVIDENCE`.** Companion uses full source while adjacent previews use derivatives. Evidence: `E-SRC-DESKTOP-SLOTS`
- **art_direction — `PARTIAL_EVIDENCE`.** Pane size follows source ratio, but no alternate crop/source art direction exists. Evidence: `E-SRC-DESKTOP-SLOTS`
- **breakpoints — `PARTIAL_EVIDENCE`.** Responsive source geometry exists; production-equivalent runtime is absent. Evidence: `E-REQ-DESKTOP-COMPANION`, `E-RUNTIME-BREAKPOINTS`

### Provenance and runtime

- **source_refs:** `E-SRC-DESKTOP-SLOTS`
- **requirement_refs:** `E-REQ-DESKTOP-COMPANION`, `E-REQ-DESKTOP-V12`
- **runtime_refs:** none; absence is explicit in JSON
- **Runtime status:** `UNBOUND`; packets: none; `production_state_claimed=false`, `production_equivalence=false`, `production_observed=false`
- **Runtime reason:** No exact companion production-equivalent runtime packet.
- **Blockers:** `EM-RATIO-002`, `EM-TINY-005`, `EM-FALLBACK-006`, `EM-RESP-008`, `EM-RUNTIME-009`

## Consumer `event-detail.desktop.preview-rails`

- Component: `src/components/DesktopEventPage.astro`
- Slot: `editorial-and-split-small-previews`
- Scope: `in_scope_candidate`
- Route: `/sobytiya/:slug/`
- Viewport: `desktop >=1024px`

### Ratios

- **4:5 — `PARTIAL_EVIDENCE`.** A 4:5 source can flow through intrinsic preview geometry; no 4:5-specific slot rule. Evidence: `E-SRC-DESKTOP-SLOTS`, `E-RUNTIME-4X5`
- **5:4 — `PARTIAL_EVIDENCE`.** A 5:4 source can flow through intrinsic preview geometry; no 5:4-specific slot rule. Evidence: `E-SRC-DESKTOP-SLOTS`, `E-RUNTIME-5X4`
- **3:2 — `PARTIAL_EVIDENCE`.** Landscape preview bucket admits this source ratio; no target selected. Evidence: `E-SRC-DESKTOP-SLOTS`, `E-CHARTER-MEDIA`
- **2:3 — `PARTIAL_EVIDENCE`.** Portrait preview evidence exists, but 2:3 is not a universal frame. Evidence: `E-SRC-DESKTOP-SLOTS`, `E-FIND-2X3`
- **1:1 — `PARTIAL_EVIDENCE`.** Square preview bucket admits this source ratio; no target selected. Evidence: `E-SRC-DESKTOP-SLOTS`, `E-CHARTER-MEDIA`
- **intrinsic_source — `PROVEN_AS_IS_NOT_ACCEPTED`.** Preview ratio and dimensions derive from the source/thumbnail derivative. Evidence: `E-SRC-DESKTOP-SLOTS`
- **other_observed — `PROVEN_AS_IS_NOT_ACCEPTED`.** Aspect bucket thresholds and clamped width are current source behavior. Values: portrait <0.9, square 0.9..1.18, landscape >1.18, ratio clamp 0.38..2.2, split width 88..196px. Evidence: `E-SRC-DESKTOP-SLOTS`

### Media types

- **photography — `PROVEN_AS_IS_NOT_ACCEPTED`.** event_photo previews use edge-to-edge cover in role-aware branches. Evidence: `E-SRC-DESKTOP-SLOTS`, `E-REQ-DESKTOP-COMPANION`
- **poster_artwork — `PARTIAL_EVIDENCE`.** Identity posters belong to companion/fullscreen; small preview role requires branch reconciliation. Evidence: `E-SRC-DESKTOP-SLOTS`
- **ocr_document — `PARTIAL_EVIDENCE`.** Semantic documents generally contain, but earlier/general CSS cover rules and viewport-cover overrides conflict. Evidence: `E-SRC-DESKTOP-SLOTS`
- **unknown_text — `PARTIAL_EVIDENCE`.** Unknown documents generally contain in role-aware branches; not all selectors are reconciled. Evidence: `E-SRC-DESKTOP-SLOTS`

### Fit, crop and focus

- **cover — `PARTIAL_EVIDENCE`.** Photo previews cover; some generic preview selectors cover all media. Evidence: `E-SRC-DESKTOP-SLOTS`
- **contain — `PARTIAL_EVIDENCE`.** Non-photo role-aware branches contain. Evidence: `E-SRC-DESKTOP-SLOTS`
- **crop_permission — `PARTIAL_EVIDENCE`.** Preview-only crop is documented, but cannot authorize primary/fullscreen crop. Evidence: `E-REQ-DESKTOP-COMPANION`, `E-FIND-CROP`
- **focal_point — `UNBOUND`.** Preview cover does not consume focal_point. Evidence: `E-SRC-TYPES`, `E-SRC-DESKTOP-SLOTS`
- **safe_area — `CONFLICT`.** Preview crop is not gated by safe-area metadata. Evidence: `E-SRC-TYPES`, `E-SRC-DESKTOP-SLOTS`
- **object_position — `PARTIAL_EVIDENCE`.** Most previews use center; current selected source may carry a position separately. Evidence: `E-SRC-DESKTOP-SLOTS`

### Upscale and tiny source

- **upscale_tiny_source — `PARTIAL_EVIDENCE`.** 256/512 derivatives and visible-subset loading limit bytes, but no tiny thumbnail/upscale ceiling is accepted. Evidence: `E-SRC-DESKTOP-SLOTS`, `E-REQ-DESKTOP-QUALITY`

### Fallback states

- **missing — `PARTIAL_EVIDENCE`.** Empty/duplicate-filtered rails may be omitted. Evidence: `E-SRC-DESKTOP-SLOTS`
- **broken — `UNBOUND`.** No consumer-specific broken thumbnail semantic fallback is positively proven. Evidence: `E-AUDIT-001`
- **tiny_source — `UNBOUND`.** No tiny-source preview fallback threshold. Evidence: `E-AUDIT-001`

### Loading and layout

- **skeleton — `PARTIAL_EVIDENCE`.** Transparent deferred placeholders exist for preview resources, but this is not a reconciled skeleton/error contract. Evidence: `E-SRC-DESKTOP-SLOTS`
- **layout_reservation — `PROVEN_AS_IS_NOT_ACCEPTED`.** Thumbnail width and height reserve each preview cell. Evidence: `E-SRC-DESKTOP-SLOTS`

### Responsive resource behavior and art direction

- **resource_selection — `PROVEN_AS_IS_NOT_ACCEPTED`.** 256/512 WebP srcset, sizes and visible-subset activation are source-proven. Evidence: `E-SRC-DESKTOP-SLOTS`, `E-REQ-DESKTOP-COMPANION`
- **art_direction — `PARTIAL_EVIDENCE`.** Geometry adapts by source ratio and available width; no alternate-source art direction. Evidence: `E-SRC-DESKTOP-SLOTS`
- **breakpoints — `CONFLICT`.** Responsive rail logic exists, but component breakpoint cascade has nine mismatches. Evidence: `E-RUNTIME-BREAKPOINTS`

### Provenance and runtime

- **source_refs:** `E-SRC-DESKTOP-SLOTS`, `E-SRC-TYPES`
- **requirement_refs:** `E-REQ-DESKTOP-COMPANION`, `E-CHARTER-MEDIA`
- **runtime_refs:** `E-RUNTIME-PRIMARY-PREVIEWS`, `E-RUNTIME-BREAKPOINTS`
- **Runtime status:** `PARTIAL_EVIDENCE`; packets: `E-RUNTIME-PRIMARY-PREVIEWS`; `production_state_claimed=false`, `production_equivalence=false`, `production_observed=false`
- **Blockers:** `EM-RATIO-002`, `EM-SEMANTIC-003`, `EM-CROP-004`, `EM-TINY-005`, `EM-FALLBACK-006`, `EM-LAYOUT-007`, `EM-RESP-008`, `EM-RUNTIME-009`

## Consumer `event-detail.mobile.primary-stage`

- Component: `src/components/EventHero.astro`
- Slot: `mobile-primary-stage`
- Scope: `in_scope_candidate`
- Route: `/sobytiya/:slug/`
- Viewport: `mobile <1024px`

### Ratios

- **4:5 — `UNBOUND`.** No 4:5 consumer-specific frame or explicit non-applicability decision is proven. Evidence: `E-AUDIT-001`, `E-FIND-2X3`
- **5:4 — `UNBOUND`.** No 5:4 consumer-specific frame or explicit non-applicability decision is proven. Evidence: `E-AUDIT-001`, `E-FIND-2X3`
- **3:2 — `UNBOUND`.** No mobile primary 3:2 decision is bound. Evidence: `E-AUDIT-001`
- **2:3 — `PARTIAL_EVIDENCE`.** Portrait poster source can render intrinsically; no universal frame. Evidence: `E-REQ-HERO-SAFE`, `E-FIND-2X3`
- **1:1 — `PARTIAL_EVIDENCE`.** Square poster source can render intrinsically; no target frame. Evidence: `E-REQ-HERO-SAFE`
- **intrinsic_source — `PARTIAL_EVIDENCE`.** Poster stage uses intrinsic height, while photo stage uses a container ratio. Evidence: `E-SRC-HERO`, `E-SRC-LAYOUT`
- **other_observed — `PROVEN_AS_IS_NOT_ACCEPTED`.** Photo-cover mobile shell uses 16:10; source portrait/gallery thresholds are separate. Values: 16:10 photo shell, source ratio poster. Evidence: `E-SRC-LAYOUT`

### Media types

- **photography — `PROVEN_AS_IS_NOT_ACCEPTED`.** visual_only selects photo-cover. Evidence: `E-SRC-HERO`
- **poster_artwork — `PARTIAL_EVIDENCE`.** Poster/artwork presentation depends on text mode more than positively reconciled media role. Evidence: `E-SRC-HERO`, `E-REQ-DESKTOP-V12`
- **ocr_document — `PROVEN_AS_IS_NOT_ACCEPTED`.** OCR/error media selects contained poster-stage. Evidence: `E-SRC-HERO`, `E-REQ-HERO-SAFE`
- **unknown_text — `PROVEN_AS_IS_NOT_ACCEPTED`.** Unknown text fails closed to contained poster-stage. Evidence: `E-SRC-HERO`, `E-REQ-HERO-SAFE`

### Fit, crop and focus

- **cover — `PROVEN_AS_IS_NOT_ACCEPTED`.** Current visual_only primary uses cover. Evidence: `E-SRC-HERO`
- **contain — `PROVEN_AS_IS_NOT_ACCEPTED`.** Current OCR/unknown primary uses contain. Evidence: `E-SRC-HERO`
- **crop_permission — `CONFLICT`.** visual_only cover is not gated by safe_crop or positively classified non-photo document role. Evidence: `E-SRC-HERO`, `E-REQ-DESKTOP-V12`, `E-FIND-CROP`
- **focal_point — `PARTIAL_EVIDENCE`.** Only recommended_object_position is consumed, not focal_point directly. Evidence: `E-SRC-TYPES`, `E-SRC-HERO`
- **safe_area — `CONFLICT`.** safe_crop/boxes do not gate primary cover. Evidence: `E-SRC-TYPES`, `E-SRC-HERO`, `E-REQ-HERO-SAFE`
- **object_position — `PROVEN_AS_IS_NOT_ACCEPTED`.** Validated recommended object position or center is used for photo cover; documents center. Evidence: `E-SRC-HERO`

### Upscale and tiny source

- **upscale_tiny_source — `CONFLICT`.** Low-resolution contain branch is unreachable: caller requires non-visual_only while helper accepts only visual_only photo-like assets. Evidence: `E-SRC-HERO`, `E-SRC-QUALITY`, `E-RUNTIME-TINY`

### Fallback states

- **missing — `PROVEN_AS_IS_NOT_ACCEPTED`.** Missing primary URL uses typed fallback art when available, otherwise generic fallback. Evidence: `E-SRC-HERO`, `E-SRC-FALLBACK`, `E-RUNTIME-MISSING`
- **broken — `UNBOUND`.** No broken primary img convergence to fallback is proven. Evidence: `E-AUDIT-001`
- **tiny_source — `CONFLICT`.** Tiny portrait branch is unreachable and has no accepted replacement. Evidence: `E-SRC-HERO`, `E-SRC-QUALITY`

### Loading and layout

- **skeleton — `NOT_APPLICABLE_WITH_REASON`.** Primary is static SSG content, so no artificial data skeleton. Reason: No genuine async data-fetch state. Evidence: `E-CHARTER-MEDIA`
- **layout_reservation — `PARTIAL_EVIDENCE`.** Photo shell reserves 16:10 geometry, but primary poster img does not consistently emit intrinsic width/height attributes. Evidence: `E-SRC-HERO`, `E-SRC-LAYOUT`

### Responsive resource behavior and art direction

- **resource_selection — `PARTIAL_EVIDENCE`.** Primary uses one source; gallery assets are deferred separately. Evidence: `E-SRC-HERO`
- **art_direction — `UNBOUND`.** No <picture>-style primary art direction or focal crop alternative source. Evidence: `E-CHARTER-MEDIA`, `E-REQ-HERO-SAFE`
- **breakpoints — `PROVEN_AS_IS_NOT_ACCEPTED`.** Production route hides this root at >=1024px and uses mobile CSS below it. Evidence: `E-SRC-ROUTE`, `E-SRC-LAYOUT`

### Provenance and runtime

- **source_refs:** `E-SRC-HERO`, `E-SRC-LAYOUT`, `E-SRC-QUALITY`
- **requirement_refs:** `E-REQ-HERO-SAFE`, `E-REQ-DESKTOP-V12`, `E-CHARTER-MEDIA`
- **runtime_refs:** `E-RUNTIME-MISSING`
- **Runtime status:** `PARTIAL_EVIDENCE`; packets: `E-RUNTIME-MISSING`; `production_state_claimed=false`, `production_equivalence=false`, `production_observed=false`
- **Blockers:** `EM-RATIO-002`, `EM-SEMANTIC-003`, `EM-CROP-004`, `EM-TINY-005`, `EM-FALLBACK-006`, `EM-LAYOUT-007`, `EM-RESP-008`, `EM-RUNTIME-009`

## Consumer `event-detail.mobile.fullscreen-gallery`

- Component: `src/components/EventHero.astro`
- Slot: `mobile-fullscreen-gallery-and-portrait-viewer`
- Scope: `in_scope_candidate`
- Route: `/sobytiya/:slug/`
- Viewport: `mobile <1024px when opened`

### Ratios

- **4:5 — `UNBOUND`.** No 4:5 consumer-specific frame or explicit non-applicability decision is proven. Evidence: `E-AUDIT-001`, `E-FIND-2X3`
- **5:4 — `UNBOUND`.** No 5:4 consumer-specific frame or explicit non-applicability decision is proven. Evidence: `E-AUDIT-001`, `E-FIND-2X3`
- **3:2 — `PARTIAL_EVIDENCE`.** Can occur as source photo; no gallery target frame. Evidence: `E-SRC-HERO`
- **2:3 — `PARTIAL_EVIDENCE`.** Portrait source is admitted; no universal 2:3 frame. Evidence: `E-SRC-HERO`, `E-FIND-2X3`
- **1:1 — `PARTIAL_EVIDENCE`.** Square source is admitted; no target frame. Evidence: `E-SRC-HERO`
- **intrinsic_source — `PROVEN_AS_IS_NOT_ACCEPTED`.** Gallery records source width/height and viewer uses source/viewport geometry. Evidence: `E-SRC-HERO`
- **other_observed — `PROVEN_AS_IS_NOT_ACCEPTED`.** Portrait family threshold is ratio <0.9; current media shells remain viewport-defined. Values: portrait <0.9, at least five assets and 60% portrait for multi-viewer. Evidence: `E-SRC-HERO`

### Media types

- **photography — `PROVEN_AS_IS_NOT_ACCEPTED`.** visual_only gallery image covers and may pan. Evidence: `E-SRC-HERO`, `E-REQ-HERO-SAFE`
- **poster_artwork — `PARTIAL_EVIDENCE`.** Poster identity is carried as role but fit is primarily text-mode driven. Evidence: `E-SRC-HERO`, `E-REQ-DESKTOP-V12`
- **ocr_document — `PROVEN_AS_IS_NOT_ACCEPTED`.** OCR/document gallery image contains. Evidence: `E-SRC-HERO`
- **unknown_text — `PROVEN_AS_IS_NOT_ACCEPTED`.** Unknown text contains. Evidence: `E-SRC-HERO`

### Fit, crop and focus

- **cover — `PROVEN_AS_IS_NOT_ACCEPTED`.** visual_only current gallery behavior covers. Evidence: `E-SRC-HERO`
- **contain — `PROVEN_AS_IS_NOT_ACCEPTED`.** OCR/unknown current behavior contains. Evidence: `E-SRC-HERO`
- **crop_permission — `CONFLICT`.** Crop gate does not consume safe_crop/regions. Evidence: `E-SRC-HERO`, `E-FIND-CROP`
- **focal_point — `PARTIAL_EVIDENCE`.** Recommended object-position only. Evidence: `E-SRC-TYPES`, `E-SRC-HERO`
- **safe_area — `CONFLICT`.** Safe-area proof is not enforced for covered gallery media. Evidence: `E-SRC-TYPES`, `E-SRC-HERO`, `E-REQ-HERO-SAFE`
- **object_position — `PROVEN_AS_IS_NOT_ACCEPTED`.** Recommended object-position or center. Evidence: `E-SRC-HERO`

### Upscale and tiny source

- **upscale_tiny_source — `CONFLICT`.** Gallery low-resolution portrait state derives from the same contradictory helper/caller assumptions and has no accepted scale ceiling. Evidence: `E-SRC-HERO`, `E-SRC-QUALITY`

### Fallback states

- **missing — `NOT_APPLICABLE_WITH_REASON`.** Missing assets are excluded from the gallery set. Reason: No missing slide is constructed. Evidence: `E-SRC-HERO`
- **broken — `UNBOUND`.** No broken slide semantic fallback is captured. Evidence: `E-AUDIT-001`
- **tiny_source — `CONFLICT`.** Low-resolution containment is not positively reachable under current predicate. Evidence: `E-SRC-HERO`, `E-SRC-QUALITY`

### Loading and layout

- **skeleton — `UNBOUND`.** Gallery sources are lazy/deferred, but no accepted loading/error skeleton is bound. Evidence: `E-SRC-HERO`, `E-AUDIT-001`
- **layout_reservation — `PROVEN_AS_IS_NOT_ACCEPTED`.** Gallery images carry source width and height. Evidence: `E-SRC-HERO`

### Responsive resource behavior and art direction

- **resource_selection — `PARTIAL_EVIDENCE`.** Deferred gallery source selection exists; no accepted derivative policy for full slides. Evidence: `E-SRC-HERO`
- **art_direction — `UNBOUND`.** No alternate-source art direction; fit changes by semantic mode only. Evidence: `E-CHARTER-MEDIA`
- **breakpoints — `PARTIAL_EVIDENCE`.** Mobile viewer and portrait family source rules exist, but runtime equivalence is unproven. Evidence: `E-SRC-HERO`

### Provenance and runtime

- **source_refs:** `E-SRC-HERO`, `E-SRC-QUALITY`
- **requirement_refs:** `E-REQ-HERO-SAFE`, `E-REQ-DESKTOP-V12`
- **runtime_refs:** none; absence is explicit in JSON
- **Runtime status:** `UNBOUND`; packets: none; `production_state_claimed=false`, `production_equivalence=false`, `production_observed=false`
- **Runtime reason:** No exact mobile fullscreen gallery packet in the pinned supplement.
- **Blockers:** `EM-RATIO-002`, `EM-SEMANTIC-003`, `EM-CROP-004`, `EM-TINY-005`, `EM-FALLBACK-006`, `EM-LAYOUT-007`, `EM-RESP-008`, `EM-RUNTIME-009`

## Consumer `event-detail.shared.missing-fallback`

- Component: `src/components/EventFallbackArt.astro`
- Slot: `missing-media-fallback`
- Scope: `in_scope_candidate`
- Route: `/sobytiya/:slug/`
- Viewport: `mobile and desktop parent surfaces`

### Ratios

- **4:5 — `NOT_APPLICABLE_WITH_REASON`.** Fallback art is fixed 1:1, not a 4:5 content frame. Reason: Dedicated decorative fallback asset. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **5:4 — `NOT_APPLICABLE_WITH_REASON`.** Fallback art is fixed 1:1, not a 5:4 content frame. Reason: Dedicated decorative fallback asset. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **3:2 — `NOT_APPLICABLE_WITH_REASON`.** Fallback art is fixed 1:1. Reason: Dedicated decorative fallback asset. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **2:3 — `NOT_APPLICABLE_WITH_REASON`.** Fallback art is fixed 1:1. Reason: Dedicated decorative fallback asset. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **1:1 — `PROVEN_AS_IS_NOT_ACCEPTED`.** Typed fallback assets are 1280x1280. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **intrinsic_source — `PROVEN_AS_IS_NOT_ACCEPTED`.** Width and height are emitted from fallback asset metadata. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **other_observed — `NOT_APPLICABLE_WITH_REASON`.** No other ratio is used by this fixed fallback. Reason: Single fixed 1:1 asset family. Values: . Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`

### Media types

- **photography — `NOT_APPLICABLE_WITH_REASON`.** Fallback art is not event photography. Reason: Decorative semantic fallback. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **poster_artwork — `NOT_APPLICABLE_WITH_REASON`.** Fallback art is not claimed as event poster identity. Reason: Decorative semantic fallback. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **ocr_document — `NOT_APPLICABLE_WITH_REASON`.** Fallback art contains no event document/OCR claim. Reason: Decorative semantic fallback. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **unknown_text — `NOT_APPLICABLE_WITH_REASON`.** Unknown-text classification is irrelevant. Reason: No source event media exists. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`

### Fit, crop and focus

- **cover — `NOT_APPLICABLE_WITH_REASON`.** Cover is not used. Reason: Full fallback art is contained. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **contain — `PROVEN_AS_IS_NOT_ACCEPTED`.** Fallback art contains and centers. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **crop_permission — `NOT_APPLICABLE_WITH_REASON`.** Crop is forbidden. Reason: Contained decorative artwork. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **focal_point — `NOT_APPLICABLE_WITH_REASON`.** No focal crop. Reason: No crop. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **safe_area — `NOT_APPLICABLE_WITH_REASON`.** No safe-area crop calculation. Reason: No crop. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **object_position — `PROVEN_AS_IS_NOT_ACCEPTED`.** center. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`

### Upscale and tiny source

- **upscale_tiny_source — `UNBOUND`.** The fixed 1280x1280 fallback has no explicit maximum upscale policy. Evidence: `E-AUDIT-001`

### Fallback states

- **missing — `PROVEN_AS_IS_NOT_ACCEPTED`.** This is the current missing-media semantic fallback. Evidence: `E-SRC-FALLBACK`, `E-RUNTIME-MISSING`, `E-SRC-FALLBACK-MAP`
- **broken — `UNBOUND`.** Failure of the fallback asset itself and broken parent media are not reconciled. Evidence: `E-AUDIT-001`
- **tiny_source — `NOT_APPLICABLE_WITH_REASON`.** Tiny source does not select this fallback under current policy. Reason: Selected only by missing URL, not source quality. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`

### Loading and layout

- **skeleton — `NOT_APPLICABLE_WITH_REASON`.** Fallback is emitted in static HTML. Reason: No async data-loading state. Evidence: `E-CHARTER-MEDIA`
- **layout_reservation — `PROVEN_AS_IS_NOT_ACCEPTED`.** 1280x1280 width/height plus mobile min-height/desktop inset reserve geometry. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`

### Responsive resource behavior and art direction

- **resource_selection — `PROVEN_AS_IS_NOT_ACCEPTED`.** One fallback source serves both surfaces. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **art_direction — `NOT_APPLICABLE_WITH_REASON`.** No art-direction variant. Reason: Same contained decorative asset. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **breakpoints — `PROVEN_AS_IS_NOT_ACCEPTED`.** Mobile min-height clamp and desktop absolute fill are source-proven. Evidence: `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`

### Provenance and runtime

- **source_refs:** `E-SRC-FALLBACK`, `E-SRC-FALLBACK-MAP`
- **requirement_refs:** `E-CHARTER-MEDIA`
- **runtime_refs:** `E-RUNTIME-MISSING`
- **Runtime status:** `PARTIAL_EVIDENCE`; packets: `E-RUNTIME-MISSING`; `production_state_claimed=false`, `production_equivalence=false`, `production_observed=false`
- **Blockers:** `EM-TINY-005`, `EM-FALLBACK-006`, `EM-RUNTIME-009`

## Consumer `lab.event-media-rail`

- Component: `src/components/EventMediaRail.astro`
- Slot: `lab-preview-rail`
- Scope: `evidence_only_preserve`
- Route: `/lab/design-system/ and /behavior-specimens/media-rail/`
- Viewport: `lab wrapper 1024x900`

### Ratios

- **4:5 — `PARTIAL_EVIDENCE`.** Intrinsic 4:5 asset can render, but there is no 4:5-specific contract. Evidence: `E-SRC-RAIL`, `E-RUNTIME-4X5`
- **5:4 — `PARTIAL_EVIDENCE`.** Intrinsic 5:4 asset can render, but there is no 5:4-specific contract. Evidence: `E-SRC-RAIL`, `E-RUNTIME-5X4`
- **3:2 — `PARTIAL_EVIDENCE`.** Intrinsic source can render; no target. Evidence: `E-SRC-RAIL`
- **2:3 — `PARTIAL_EVIDENCE`.** Intrinsic source can render; no target/token. Evidence: `E-SRC-RAIL`, `E-FIND-2X3`
- **1:1 — `PARTIAL_EVIDENCE`.** Intrinsic source can render; no target. Evidence: `E-SRC-RAIL`
- **intrinsic_source — `PROVEN_AS_IS_NOT_ACCEPTED`.** Thumbnail derivative/source width and height are emitted. Evidence: `E-SRC-RAIL`
- **other_observed — `PROVEN_AS_IS_NOT_ACCEPTED`.** Any source ratio can enter a uniform lab rail cell. Values: arbitrary source ratio, uniform current rail box. Evidence: `E-SRC-RAIL`

### Media types

- **photography — `PROVEN_AS_IS_NOT_ACCEPTED`.** Photography is admitted. Evidence: `E-SRC-RAIL`
- **poster_artwork — `CONFLICT`.** Poster/artwork is admitted but receives the same cover box and photo-oriented rail labeling. Evidence: `E-SRC-RAIL`, `E-SRC-LAYOUT`
- **ocr_document — `CONFLICT`.** OCR/document is admitted but unconditional CSS cover erases document policy. Evidence: `E-SRC-RAIL`, `E-SRC-LAYOUT`
- **unknown_text — `CONFLICT`.** Unknown text is admitted but unconditional CSS cover erases fail-closed policy. Evidence: `E-SRC-RAIL`, `E-SRC-LAYOUT`

### Fit, crop and focus

- **cover — `CONFLICT`.** EventLayout forces object-fit cover for every rail image. Evidence: `E-SRC-LAYOUT`
- **contain — `UNBOUND`.** No document contain branch in EventMediaRail. Evidence: `E-SRC-RAIL`, `E-SRC-LAYOUT`
- **crop_permission — `CONFLICT`.** Crop permission ignores semantic type and safe metadata. Evidence: `E-SRC-LAYOUT`, `E-FIND-CROP`
- **focal_point — `UNBOUND`.** No focal point consumption. Evidence: `E-SRC-RAIL`
- **safe_area — `CONFLICT`.** No safe-area gate. Evidence: `E-SRC-RAIL`, `E-SRC-LAYOUT`
- **object_position — `PROVEN_AS_IS_NOT_ACCEPTED`.** Current uniform cover defaults to center. Evidence: `E-SRC-LAYOUT`

### Upscale and tiny source

- **upscale_tiny_source — `PARTIAL_EVIDENCE`.** Small derivatives are selected, but no source-quality/upscale policy. Evidence: `E-SRC-RAIL`

### Fallback states

- **missing — `UNBOUND`.** Missing asset handling is not defined. Evidence: `E-SRC-RAIL`
- **broken — `UNBOUND`.** Broken thumbnail handling is not defined. Evidence: `E-SRC-RAIL`, `E-RUNTIME-PRIMARY-PREVIEWS`
- **tiny_source — `UNBOUND`.** Tiny source behavior is not defined. Evidence: `E-SRC-RAIL`

### Loading and layout

- **skeleton — `NOT_APPLICABLE_WITH_REASON`.** Rail is static and eager. Reason: No genuine async data-loading state. Evidence: `E-SRC-RAIL`, `E-CHARTER-MEDIA`
- **layout_reservation — `PROVEN_AS_IS_NOT_ACCEPTED`.** Thumbnail width and height reserve cells. Evidence: `E-SRC-RAIL`

### Responsive resource behavior and art direction

- **resource_selection — `PROVEN_AS_IS_NOT_ACCEPTED`.** srcset and sizes are emitted. Evidence: `E-SRC-RAIL`
- **art_direction — `UNBOUND`.** No art direction by semantic type or viewport. Evidence: `E-SRC-RAIL`
- **breakpoints — `PARTIAL_EVIDENCE`.** sizes includes desktop 92px, but implementation is lab-only and overflow behavior is unresolved. Evidence: `E-SRC-RAIL`

### Provenance and runtime

- **source_refs:** `E-SRC-RAIL`, `E-SRC-LAYOUT`
- **requirement_refs:** `E-CHARTER-MEDIA`
- **runtime_refs:** `E-RUNTIME-PRIMARY-PREVIEWS`
- **Runtime status:** `PARTIAL_EVIDENCE`; packets: `E-RUNTIME-PRIMARY-PREVIEWS`; `production_state_claimed=false`, `production_equivalence=false`, `production_observed=false`
- **Blockers:** `EM-CENSUS-001`, `EM-RATIO-002`, `EM-SEMANTIC-003`, `EM-CROP-004`, `EM-TINY-005`, `EM-FALLBACK-006`, `EM-LABRAIL-011`, `EM-RUNTIME-009`

## Consumer `boundary.related-event-card`

- Component: `src/components/EventCard.astro via event-detail related feed`
- Slot: `adjacent-related-card-media`
- Scope: `boundary_pending_do_not_merge`
- Route: `/sobytiya/:slug/#discovery-feed`
- Viewport: `mobile/desktop related feed`

### Ratios

- **4:5 — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** 4:5 is positively observed for the adjacent EventCard consumer. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-ROUTE`, `E-SRC-LAYOUT`, `E-RUNTIME-4X5`
- **5:4 — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** 5:4 is not an EventCard target decision. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-ROUTE`, `E-CHARTER-MEDIA`
- **3:2 — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** 3:2 exists in earlier EventCard vocabulary but is not reconciled with the current 4:5 surface. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-ROUTE`, `E-CHARTER-MEDIA`
- **2:3 — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** 2:3 remains intrinsic evidence only. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-ROUTE`, `E-CHARTER-MEDIA`
- **1:1 — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** 1:1 is not selected for this consumer. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-ROUTE`, `E-CHARTER-MEDIA`
- **intrinsic_source — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Source ratio is retained as metadata. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-ROUTE`, `E-CHARTER-MEDIA`
- **other_observed — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Desktop continuation rows can use server-selected compatible row ratios. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-ROUTE`, `E-CHARTER-MEDIA`

### Media types

- **photography — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Photo card behavior is adjacent evidence. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-LAYOUT`, `E-REQ-DESKTOP-CORE`
- **poster_artwork — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Poster/artwork card behavior is adjacent evidence. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-LAYOUT`, `E-REQ-DESKTOP-CORE`
- **ocr_document — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** OCR/document row behavior is adjacent evidence. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-LAYOUT`, `E-REQ-DESKTOP-CORE`
- **unknown_text — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Unknown-text row behavior is adjacent evidence. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-LAYOUT`, `E-REQ-DESKTOP-CORE`

### Fit, crop and focus

- **cover — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Photo cover behavior exists. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-LAYOUT`, `E-FIND-CROP`
- **contain — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Document contain/limited-cover behavior exists in requirements. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-LAYOUT`, `E-FIND-CROP`
- **crop_permission — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Crop budget is consumer-local. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-LAYOUT`, `E-FIND-CROP`
- **focal_point — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Reviewed focal region is future/partial. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-LAYOUT`, `E-FIND-CROP`
- **safe_area — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Safe-area contract is consumer-local. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-LAYOUT`, `E-FIND-CROP`
- **object_position — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Current fallback position is centered. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-LAYOUT`, `E-FIND-CROP`

### Upscale and tiny source

- **upscale_tiny_source — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Separate EventCard quality policy; no transfer to Event Detail primary. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-CHARTER-MEDIA`

### Fallback states

- **missing — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Separate card missing fallback. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-CHARTER-MEDIA`
- **broken — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Broken ListingEventCard conflict is captured. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-LISTING-BROKEN`
- **tiny_source — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Separate card tiny-source behavior. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-CHARTER-MEDIA`

### Loading and layout

- **skeleton — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Desktop continuation requirement includes a true per-image load/error skeleton. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-REQ-RELATED-LOADING`
- **layout_reservation — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Skeleton/image/error reserve identical row geometry by requirement. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-REQ-RELATED-LOADING`, `E-CHARTER-MEDIA`

### Responsive resource behavior and art direction

- **resource_selection — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Card resource selection is separate. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-CHARTER-MEDIA`
- **art_direction — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Card art direction is separate. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-CHARTER-MEDIA`
- **breakpoints — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Card breakpoints are separate. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-SRC-LAYOUT`

### Provenance and runtime

- **source_refs:** `E-SRC-ROUTE`, `E-SRC-LAYOUT`
- **requirement_refs:** `E-CHARTER-MEDIA`, `E-REQ-RELATED-LOADING`
- **runtime_refs:** `E-RUNTIME-4X5`, `E-RUNTIME-LISTING-BROKEN`
- **Runtime status:** `EVIDENCE_ONLY_OUT_OF_SCOPE`; packets: `E-RUNTIME-4X5`, `E-RUNTIME-LISTING-BROKEN`; `production_state_claimed=false`, `production_equivalence=false`, `production_observed=false`
- **Blockers:** `EM-CENSUS-001`, `EM-RATIO-002`, `EM-CROP-004`, `EM-FALLBACK-006`, `EM-PROVENANCE-012`

## Consumer `boundary.mobile-listing-rail`

- Component: `src/components/listings/MobileListingRailSurface.astro`
- Slot: `adjacent-mobile-listing-media`
- Scope: `boundary_pending_do_not_merge`
- Route: `/segodnya/`
- Viewport: `mobile 390x844`

### Ratios

- **4:5 — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** 4:5 belongs to a different adjacent card consumer. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-CHARTER-MEDIA`
- **5:4 — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** 5:4 safe-visual landscape is positively observed for this adjacent rail. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`, `E-RUNTIME-BROKEN`
- **3:2 — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** 3:2 is not selected by this runtime record. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-CHARTER-MEDIA`
- **2:3 — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** 2:3 remains intrinsic evidence only. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-CHARTER-MEDIA`
- **1:1 — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** 1:1 is not selected by this runtime record. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-CHARTER-MEDIA`
- **intrinsic_source — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Source dimensions remain adjacent consumer data. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-CHARTER-MEDIA`
- **other_observed — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Horizontal rail geometry is consumer-local. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-CHARTER-MEDIA`

### Media types

- **photography — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Classified visual photo is observed. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`, `E-RUNTIME-BROKEN`
- **poster_artwork — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Poster/artwork policy is outside candidate scope. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`, `E-RUNTIME-BROKEN`
- **ocr_document — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** OCR/document policy is outside candidate scope. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`, `E-RUNTIME-BROKEN`
- **unknown_text — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Unknown-text policy is outside candidate scope. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`, `E-RUNTIME-BROKEN`

### Fit, crop and focus

- **cover — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Safe-visual landscape cover is observed. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`, `E-FIND-CROP`
- **contain — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Contain rules are consumer-local. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`, `E-FIND-CROP`
- **crop_permission — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Crop gate is consumer-local. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`, `E-FIND-CROP`
- **focal_point — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Focal policy is consumer-local. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`, `E-FIND-CROP`
- **safe_area — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Safe-area policy is consumer-local. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`, `E-FIND-CROP`
- **object_position — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Object position is consumer-local. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`, `E-FIND-CROP`

### Upscale and tiny source

- **upscale_tiny_source — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Separate listing-rail upscale/tiny policy. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`

### Fallback states

- **missing — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Separate listing missing fallback. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-BROKEN`
- **broken — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Broken error is visually indistinguishable from loading in reviewed runtime. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-BROKEN`
- **tiny_source — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Separate listing tiny-source state. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`

### Loading and layout

- **skeleton — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** A neutral loading state is runtime-observed. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-BROKEN`
- **layout_reservation — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Loading and error retain geometry but lack semantic distinction. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-BROKEN`

### Responsive resource behavior and art direction

- **resource_selection — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Listing rail resource selection is separate. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`
- **art_direction — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** 5:4 is a consumer-local presentation, not Event Detail art direction. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`
- **breakpoints — `EVIDENCE_ONLY_OUT_OF_SCOPE`.** Observed at 390x844 candidate runtime only. Reason: Adjacent consumer evidence is recorded for vocabulary completeness; inclusion in family.event-media requires an owner boundary decision. Evidence: `E-RUNTIME-5X4`

### Provenance and runtime

- **source_refs:** none; absence is explicit in JSON
- **requirement_refs:** `E-CHARTER-MEDIA`
- **runtime_refs:** `E-RUNTIME-5X4`, `E-RUNTIME-BROKEN`
- **Runtime status:** `EVIDENCE_ONLY_OUT_OF_SCOPE`; packets: `E-RUNTIME-5X4`, `E-RUNTIME-BROKEN`; `production_state_claimed=false`, `production_equivalence=false`, `production_observed=false`
- **Blockers:** `EM-CENSUS-001`, `EM-RATIO-002`, `EM-SEMANTIC-003`, `EM-CROP-004`, `EM-FALLBACK-006`, `EM-PROVENANCE-012`

## Unreconciled responsive probes

All nine records are `MISMATCH` and report that no affected compiled selector resolved inside the exact consumer; the cascade is unreconciled:

- `breakpoint.017c006b1fb4a73e`
- `breakpoint.2b71e3365f6f4029`
- `breakpoint.657255de26bb8525`
- `breakpoint.9007467d208ac7bd`
- `breakpoint.9274460842120519`
- `breakpoint.a2ab8c7ff2962a9a`
- `breakpoint.c86f2675dac5c0dc`
- `breakpoint.e4bb42b01042b720`
- `breakpoint.f573562b45bea1dd`

## Original immutable blocker supersession

| JSON pointer | Original text | Status | Residual blockers | Rationale |
|---|---|---|---|---|
| `/candidate_contract/responsive_contract/0/status` | `source-extraction-required` | `resolved_by_evidence` | `EM-RESP-008` | Extraction exists; semantic/cascade reconciliation does not. |
| `/evidence/0/observation_scope` | `source-only-until-reconciled` | `still_open` | `EM-RUNTIME-009` | All pinned packets explicitly deny production equivalence and observation. |
| `/human_review_status` | `pending` | `still_open` | `EM-GOV-010` | No accepted review receipt. |
| `/normalization_allowed` | `false` | `still_open` | `EM-GOV-010` | Immutable candidate remains normalization-disallowed. |
| `/normalization_gaps/0` | `isolated component boundary and computed geometry pending` | `replaced_by_requirement` | `EM-CENSUS-001`, `EM-RATIO-002`, `EM-LAYOUT-007`, `EM-RESP-008` | The vague gap is replaced by exact v1.1 positive requirements; their blockers remain open. |
| `/promotion_blockers/0` | `visual and real-page reconciliation pending` | `still_open` | `EM-RUNTIME-009` | Controlled visual evidence is partial; real production equivalence remains false. |
| `/recommendation` | `unresolved` | `owner_decision_required` | `EM-GOV-010` | A v1 dossier recommendation is not an accepted owner decision. |
| `/unresolved_alternatives/0` | `internal resources of DesktopEventPage` | `owner_decision_required` | `EM-CENSUS-001`, `EM-GOV-010` | Internal composition boundary is undecided. |
| `/unresolved_alternatives/1` | `separate media candidates` | `owner_decision_required` | `EM-CENSUS-001`, `EM-GOV-010` | No merge/split decision is authorized. |
| `/normative_status` | `candidate-as-is-not-accepted` | `still_open` | `EM-GOV-010` | Current immutable normative status. |
| `/decision` | `NOT_MERGED` | `owner_decision_required` | `EM-GOV-010` | Preserved boundary decision; not an operational disposition or accepted contract. |

`resolved_by_evidence` for source extraction does not mean responsive readiness: extraction exists, but `EM-RESP-008` remains open. `replaced_by_requirement` retires only a vague blocker identity; every exact replacement remains open.

## Exact blockers

### `EM-CENSUS-001` — family_boundary

- Status: `open`
- Blocks before: `target_contract`
- Statement: No accepted family boundary distinguishes Event Detail primary/companion/previews from related EventCard, mobile listing media, and the lab-only rail.
- Evidence: `E-CANDIDATE-001`, `E-SRC-ROUTE`, `E-RUNTIME-4X5`, `E-RUNTIME-5X4`
- Closure condition: Owner receipt classifies every boundary-pending consumer without merge/split inference.

### `EM-RATIO-002` — required_ratio_vocabulary

- Status: `open`
- Blocks before: `target_contract`
- Statement: 4:5, 5:4, 3:2, 2:3, 1:1, intrinsic/source and other observed ratios are not positively bound or explicitly non-applicable for every accepted consumer.
- Evidence: `E-AUDIT-001`, `E-FIND-2X3`, `E-CHARTER-MEDIA`
- Closure condition: Every accepted consumer/slot ratio cell is reconciled without selecting a global target ratio.

### `EM-SEMANTIC-003` — semantic_media_types

- Status: `open`
- Blocks before: `target_contract`
- Statement: Photography, poster/artwork, OCR/document, unknown-text and classified non-photo document behavior is not reconciled across Desktop, EventHero and EventMediaRail.
- Evidence: `E-AUDIT-001`, `E-REQ-DESKTOP-V12`, `E-SRC-HERO`, `E-SRC-RAIL`
- Closure condition: Every accepted consumer binds all media types with no source/requirement conflict.

### `EM-CROP-004` — crop_focal_safe_object

- Status: `open`
- Blocks before: `target_contract`
- Statement: Focal point, safe area, crop permission and object-position are not one proven policy; metadata exists but focal/safe data does not gate current cover.
- Evidence: `E-FIND-CROP`, `E-SRC-TYPES`, `E-SRC-DESKTOP-CROP`, `E-SRC-HERO`
- Closure condition: Covered media has a consumer-specific, positively evidenced crop/safe/focal rule or explicit non-applicability.

### `EM-TINY-005` — upscale_tiny_source

- Status: `open`
- Blocks before: `target_contract`
- Statement: No accepted upscale ceiling exists, and EventHero low-resolution containment is logically unreachable.
- Evidence: `E-SRC-QUALITY`, `E-SRC-HERO`, `E-RUNTIME-TINY`
- Closure condition: A tested consumer-specific tiny/upscale policy replaces the contradictory branch without introducing a ratio token.

### `EM-FALLBACK-006` — missing_broken_tiny_fallback

- Status: `open`
- Blocks before: `target_contract`
- Statement: Missing fallback exists, but broken-image convergence is unproven for Event Detail primary, companion, gallery and previews.
- Evidence: `E-RUNTIME-MISSING`, `E-RUNTIME-BROKEN`, `E-RUNTIME-LISTING-BROKEN`
- Closure condition: Missing and broken states have tested consumer-specific semantic convergence and preserved geometry.

### `EM-LAYOUT-007` — skeleton_layout_reservation

- Status: `open`
- Blocks before: `target_contract`
- Statement: Mobile primary/poster reservation and genuine lazy gallery loading treatment are incomplete; skeleton applicability is not adjudicated for every slot.
- Evidence: `E-CHARTER-MEDIA`, `E-SRC-HERO`, `E-AUDIT-001`
- Closure condition: Every slot proves reservation and either a genuine loading state or a reasoned SSG non-applicability.

### `EM-RESP-008` — responsive_art_direction

- Status: `open`
- Blocks before: `target_contract`
- Statement: No complete responsive art-direction contract exists; primary media lacks alternate-source art direction and nine Desktop cascade probes are unreconciled.
- Evidence: `E-RUNTIME-BREAKPOINTS`, `E-CHARTER-MEDIA`, `E-SRC-ROUTE`
- Closure condition: All required responsive cells are reconciled and all nine probes have terminal positive evidence or exact accepted non-applicability.

### `EM-RUNTIME-009` — runtime_production_equivalence

- Status: `open`
- Blocks before: `target_contract`
- Statement: All relevant supplement captures are candidate or controlled runtime; none is production-equivalent or production-observed.
- Evidence: `E-RUNTIME-MISSING`, `E-RUNTIME-TINY`, `E-RUNTIME-PRIMARY-PREVIEWS`, `E-RUNTIME-4X5`, `E-RUNTIME-5X4`
- Closure condition: Exact production route/consumer runtime evidence is reviewed and positively bound.

### `EM-GOV-010` — immutable_candidate_governance

- Status: `open`
- Blocks before: `target_contract`
- Statement: Human review remains pending, normalization is disallowed, recommendation is unresolved and no owner decision receipt exists.
- Evidence: `E-CANDIDATE-001`
- Closure condition: A separate accepted receipt resolves review, recommendation and normalization permission without mutating immutable evidence.

### `EM-LABRAIL-011` — lab_rail_semantics

- Status: `open`
- Blocks before: `target_contract`
- Statement: Lab-only EventMediaRail covers OCR/documents and lacks broken/missing/tiny plus overflow/keyboard closure.
- Evidence: `E-SRC-RAIL`, `E-SRC-LAYOUT`, `E-RUNTIME-PRIMARY-PREVIEWS`
- Closure condition: Owner excludes it with reason or reconciles semantics and runtime without promoting lab evidence as production.

### `EM-PROVENANCE-012` — cell_level_provenance

- Status: `open`
- Blocks before: `target_contract`
- Statement: Historical dossier has global provenance lists, not reconciled source + requirement + runtime evidence per consumer cell.
- Evidence: `E-V1-DOSSIER-001`, `E-AUDIT-001`
- Closure condition: Every accepted cell has resolvable source and requirement evidence plus runtime evidence or an explicit reasoned absence.

## Positive readiness checklist

| Check | Dimension | Status | Evidence / blockers |
|---|---|---|---|
| `EM-CHECK-001` | authority_and_byte_integrity | `PASS` | `E-CANDIDATE-001`, `E-V1-DOSSIER-001` |
| `EM-CHECK-002` | accepted_consumer_census | `BLOCKED` | `EM-CENSUS-001` |
| `EM-CHECK-003` | required_ratio_vocabulary_per_consumer | `BLOCKED` | `EM-RATIO-002` |
| `EM-CHECK-004` | media_types_per_consumer | `BLOCKED` | `EM-SEMANTIC-003` |
| `EM-CHECK-005` | fit_crop_focal_safe_object | `BLOCKED` | `EM-CROP-004` |
| `EM-CHECK-006` | upscale_tiny_source | `BLOCKED` | `EM-TINY-005` |
| `EM-CHECK-007` | missing_broken_tiny_fallback | `BLOCKED` | `EM-FALLBACK-006` |
| `EM-CHECK-008` | skeleton_and_layout_reservation | `BLOCKED` | `EM-LAYOUT-007` |
| `EM-CHECK-009` | responsive_art_direction | `BLOCKED` | `EM-RESP-008` |
| `EM-CHECK-010` | production_equivalent_runtime | `BLOCKED` | `EM-RUNTIME-009` |
| `EM-CHECK-011` | immutable_candidate_governance | `BLOCKED` | `EM-GOV-010` |
| `EM-CHECK-012` | lab_rail_boundary_and_semantics | `BLOCKED` | `EM-LABRAIL-011` |
| `EM-CHECK-013` | cell_level_provenance | `BLOCKED` | `EM-PROVENANCE-012` |

The single `PASS` proves evidence integrity only. It cannot compensate for any blocked semantic dimension. The validator is positive and fail-closed: readiness requires every checklist row to pass, every accepted in-scope cell to be reconciled or reasoned non-applicable, all original blockers to be terminally superseded, and exact production-equivalent runtime.

## Verdict

```json
{
  "status": "NOT_READY_WITH_EXACT_BLOCKERS",
  "exact_blocker_ids": [
    "EM-CENSUS-001",
    "EM-RATIO-002",
    "EM-SEMANTIC-003",
    "EM-CROP-004",
    "EM-TINY-005",
    "EM-FALLBACK-006",
    "EM-LAYOUT-007",
    "EM-RESP-008",
    "EM-RUNTIME-009",
    "EM-GOV-010",
    "EM-LABRAIL-011",
    "EM-PROVENANCE-012"
  ],
  "ready_for_contract_decision_review": false,
  "reason": "Positive evidence is incomplete and conflicting across required consumer-scoped dimensions; immutable governance and production-equivalent runtime remain open."
}
```

Therefore the only evidence-supported result is **`NOT_READY_WITH_EXACT_BLOCKERS`**. No target ratio, token, merge/split, UI change or accepted contract decision is authorized.

## Evidence catalog

| ID | Kind | Path / locator | Claim |
|---|---|---|---|
| `E-AUDIT-001` | independent_audit | design::docs/audits/project-normalization-synthesis-v1-independent-red-team-audit.md — lines 23-24 | Event Media is explicitly NOT_READY and lacks the required consumer-scoped vocabulary and policies. |
| `E-CANDIDATE-001` | immutable_candidate_contract | design::catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/candidate-contracts/candidate.event-media.contract.json — JSON pointers recorded in blocker_supersession | Immutable Event Media candidate and its unresolved blockers. |
| `E-V1-DOSSIER-001` | historical_input | design::catalog/normalization/families/family.event-media/dossier.json — entire file | Historical v1 dossier; preserved, not superseded in place. |
| `E-FIND-CROP` | finding | design::catalog/normalization/findings-disposition.jsonl — finding.behavioral.unresolved.167491084198e7f5 (line 60) | Consumer-local crop policies are not one proven global crop contract. |
| `E-FIND-2X3` | finding | design::catalog/normalization/findings-disposition.jsonl — finding.behavioral.unresolved.2db15769126cd403 (line 64) | 2:3 is observed intrinsic orientation, not a normative universal frame/token. |
| `E-CHARTER-MEDIA` | requirement | design::docs/research/ui-normalization-2026-08/05-normalization-charter-lovekgd.md — lines 168-205, 374-387, 610-671 | Initial media vocabulary, responsive-resource distinctions, deterministic fallback, layout reservation, and no artificial SSG skeleton. |
| `E-REQ-DESKTOP-CORE` | requirement | events-bot-new::docs/features/static-site-pages/event-desktop-media-families-2026-07-12.md — lines 19-37 | Photo/OCR/unknown fit and crop rules. |
| `E-REQ-DESKTOP-ROUTING` | requirement | events-bot-new::docs/features/static-site-pages/event-desktop-media-families-2026-07-12.md — lines 39-56 | Desktop routing, media geometry and 1024px surface split. |
| `E-REQ-DESKTOP-QUALITY` | requirement | events-bot-new::docs/features/static-site-pages/event-desktop-media-families-2026-07-12.md — lines 181-193 | Resolution-constrained images are not automatically bad; editorial promotion needs more than geometry. |
| `E-REQ-DESKTOP-COMPANION` | requirement | events-bot-new::docs/features/static-site-pages/event-desktop-media-families-2026-07-12.md — lines 461-481, 525-538, 552-570 | Exact-ratio contained companion and role/aspect-aware preview rules. |
| `E-REQ-RELATED-LOADING` | requirement | events-bot-new::docs/features/static-site-pages/event-desktop-media-families-2026-07-12.md — lines 814-850 | Desktop continuation rows bind server-known ratio, identical skeleton/image/error geometry and terminal aria-busy behavior. |
| `E-REQ-DESKTOP-V12` | requirement | events-bot-new::docs/features/static-site-pages/event-desktop-media-families-2026-07-12.md — lines 852-880 | Current hero/gallery media-type matrix and unresolved scenario reconciliation. |
| `E-REQ-HERO-SAFE` | requirement | events-bot-new::docs/features/static-site-pages/event-hero-lab-2026-06-27.md — lines 36, 46, 91, 101-116 | Mobile photo/poster policy and required focal/safe-area enrichment. |
| `E-SRC-TYPES` | source | events-bot-new::site/src/lib/types.ts — lines 3-81 | Media roles, text modes, geometry, focal, safe-crop and intrinsic dimension fields. |
| `E-SRC-QUALITY` | source | events-bot-new::site/src/lib/eventMediaQuality.ts — lines 8-61 | 720 long-edge, 450000 area, quality-score 10 and preserve-weak-when-no-strong policy. |
| `E-SRC-DESKTOP-CROP` | source | events-bot-new::site/src/components/DesktopEventPage.astro — lines 128-168, 194-241, 663-681 | Desktop source ratio, fail-closed text mode, current cover/contain/object-position behavior and fullscreen media. |
| `E-SRC-DESKTOP-SLOTS` | source | events-bot-new::site/src/components/DesktopEventPage.astro — lines 248-288, 339-500, 2197, 2222-2231, 2296-2346, 2430, 2563-2564, 2609-2612 | Primary, companion, preview, rail, source-ratio, derivative and viewer slots. |
| `E-SRC-HERO` | source | events-bot-new::site/src/components/EventHero.astro — lines 50-79, 110-189, 207-222, 284-349 | Mobile primary/gallery selection, fit, object position, fallback and unreachable low-resolution predicate. |
| `E-SRC-LAYOUT` | source | events-bot-new::site/src/layouts/EventLayout.astro — lines 701-730, 1291-1316, 1393-1431, 2079-2240, 2348 | Mobile ratios, shared gallery behavior, lab rail cover, 4:5 EventCard and responsive styles. |
| `E-SRC-ROUTE` | source | events-bot-new::site/src/pages/sobytiya/[slug].astro — lines 94-99, 109-152, 178-192, 209-213 | Production desktop/mobile consumers and related EventCard boundary. |
| `E-SRC-RAIL` | source | events-bot-new::site/src/components/EventMediaRail.astro — lines 12-61 | Lab-only rail intrinsic thumbnails, srcset/sizes and preview actions. |
| `E-SRC-FALLBACK` | source | events-bot-new::site/src/components/EventFallbackArt.astro — lines 14-30 | 1:1 contained decorative missing-media fallback. |
| `E-SRC-FALLBACK-MAP` | source | events-bot-new::site/src/lib/eventFallbackArt.ts — lines 3-45 | Concert/lecture typed fallback map binds 1280x1280, 1:1 and contain. |
| `E-RUNTIME-MISSING` | runtime | design::catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/behavior-specimen-plan.jsonl — behavior-packet.media-missing; behavior-observation.65d2c7d1a47c134ce6 | Reviewed event-detail missing fallback; candidate runtime, not production-equivalent. |
| `E-RUNTIME-TINY` | runtime | design::catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/behavior-specimen-plan.jsonl — behavior-packet.media-tiny; behavior-observation.d5ce4f9d8c4a8bd96d | Reviewed event-detail tiny source; candidate runtime, not production-equivalent. |
| `E-RUNTIME-PRIMARY-PREVIEWS` | runtime | design::catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/behavior-specimen-plan.jsonl — behavior-packet.media-primary-and-previews; behavior-observation.03703bd814dcee496c | Reviewed controlled EventMediaRail primary/previews; not production-equivalent. |
| `E-RUNTIME-4X5` | runtime | design::catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/behavior-specimen-plan.jsonl — behavior-packet.media-real-4x5; behavior-observation.637cdd0643c2d3ec87 | Reviewed 4:5 EventCard consumer; candidate runtime, outside candidate Event Detail boundary. |
| `E-RUNTIME-5X4` | runtime | design::catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/behavior-specimen-plan.jsonl — behavior-packet.media-real-5x4; behavior-observation.e68a7cadc6e9b002c1 | Reviewed 5:4 mobile listing rail; candidate runtime, outside candidate Event Detail boundary. |
| `E-RUNTIME-BROKEN` | runtime | design::catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/manual-visual-review-ledger.jsonl — behavior-packet.media-broken; observations behavior-observation.1a1760cccf604f8abc and .271a0cef68a1acbfad | Loading and error are visually indistinguishable in mobile listing rail. |
| `E-RUNTIME-LISTING-BROKEN` | runtime | design::catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/manual-visual-review-ledger.jsonl — behavior-packet.listing-card-media-loading-error; behavior-observation.d23ba51cf3032cf5c8 | Broken ListingEventCard exposes browser marker and alt overflow. |
| `E-RUNTIME-BREAKPOINTS` | runtime | design::catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/breakpoint-and-container-matrix.jsonl — nine DesktopEventPage MISMATCH IDs listed in responsive_probe_blockers | Exact consumer cascade is unreconciled at 1024/1200/1440 boundaries. |

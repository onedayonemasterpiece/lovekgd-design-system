# Event Media — blocker closure v1

## Terminal result

`EVENT_MEDIA_BLOCKER_CLOSURE_INCOMPLETE`

The exact merged PR #32 corpus was replayed without rewriting its artifacts.
All nine evidence blockers have an allowed terminal disposition, but every one
remains `still_open_with_exact_missing_evidence`. The three governance blockers
remain `owner_decision_required`. No blocker is resolved or invalidated.

This is an evidence result, not an implementation decision. Production UI,
`site/src`, `site/public`, Penpot, final media tokens, page archetypes,
experiments, migrations, legacy identities and candidate-contract acceptance
remain unchanged.

## Frozen authority

- merged main: `3cbe35326ead04ac67070e5b400d30d9edc6eb01`;
- ordinary merge parents: `45288b001d724e0d3603d0c44d392ff370407bd0`
  and audited head `20eab45534e2c64497e4db661e6a5ca8582229ea`;
- events evidence: `66bc0d43e36299417626f992021cfb7299ddf704`;
- 12 source blockers = 3 owner-required + 9 source `still_open`;
- 52 consumer applications, 23 semantic-media records, 31 boundary records;
- three unchanged candidate contracts and three original 23-check readiness
  rows.

The validator recomputes file and row hashes, source text, required evidence,
affected consumer references and candidate readiness projections. A populated
field never closes a blocker by itself.

## Exact incomplete evidence blockers

The canonical wording is in
[`blocker-closure-v1.jsonl`](../../catalog/normalization/event-media/blocker-closure-v1.jsonl).
The remaining facts are:

1. **`EM-RATIO-002`**
   - accepted per-consumer/per-slot applicability for 4:5, 5:4, 3:2, 2:3,
     1:1 and intrinsic/source, including explicit non-applicability;
   - direct proof that each ratio is consumer-local rather than a global Event
     Media token.
2. **`EM-SEMANTIC-003`**
   - executable tested mapping for photography, poster/artwork, OCR/document,
     unknown-text and classified non-photo media across affected renderers;
   - reconciliation of `media_role` with `image_text_mode`.
3. **`EM-CROP-004`**
   - direct consumer enforcement of crop permission, focal point and safe area
     for cover, or accepted consumer-specific non-applicability;
   - executable tests or reviewed exact runtime of that enforcement.
4. **`EM-TINY-005`**
   - tested per-consumer upscale ceilings for primary, companion, preview,
     fullscreen and lab-rail placements;
   - a reachable, executed EventHero low-resolution containment branch.
5. **`EM-FALLBACK-006`**
   - exact load-error tests or runtime for Event Detail primary, poster,
     desktop/mobile fullscreen and preview convergence;
   - proof of reserved geometry and suppression of failed browser-image UI.
6. **`EM-LAYOUT-007`**
   - per-slot reservation/loading applicability or explicit SSG
     non-applicability for desktop/mobile primary, viewer and preview slots;
   - exact lazy-gallery loading/error runtime evidence.
7. **`EM-RESP-008`**
   - PASS or accepted reasoned non-applicability for all nine exact
     DesktopEventPage cascade probes, which currently remain `MISMATCH`;
   - an alternate-source art-direction decision or accepted non-applicability.
8. **`EM-RUNTIME-009`**
   - production-equivalent or production-observed Event Detail desktop/mobile
     primary, companion, preview and fullscreen evidence;
   - exact missing, broken and tiny states, including desktop and mobile
     fullscreen packets.
9. **`EM-PROVENANCE-012`**
   - source, requirement and exact runtime authority—or reasoned runtime
     non-applicability—for every eventually accepted consumer cell;
   - closure of the 52-row pending policy reconciliation and non-production
     runtime cells.

## Owner blockers and decision support

The three still-pending owner cards are documented in the
[owner decision pack](event-media-owner-decision-pack.md). Their presence and
agent recommendations are not acceptance. Each remains unselected and has no
owner receipt.

The standalone visual pack is
[`prototypes/event-media-decision-pack/index.html`](../../prototypes/event-media-decision-pack/index.html).
Its deterministic boards are evidence-only and non-production:

- [`EM-CENSUS-001`](../../prototypes/event-media-decision-pack/screenshots/decision.EM-CENSUS-001.png)
- [`EM-GOV-010`](../../prototypes/event-media-decision-pack/screenshots/decision.EM-GOV-010.png)
- [`EM-LABRAIL-011`](../../prototypes/event-media-decision-pack/screenshots/decision.EM-LABRAIL-011.png)

All nine options reuse the same ordered 13-fixture set and both viewport
contexts. Exactly nine vendored assets and nine immutable Behavioral evidence
bindings support the pack. All four new PNGs—including the one PNG fixture—have
one exact full-resolution review row.

## Positive readiness replay

Exactly 23 positive dimensions were replayed for each unchanged candidate:

| Result | Per candidate | Total |
|---|---:|---:|
| `PASS` | 11 | 33 |
| `BLOCKED` | 11 | 33 |
| `NOT_APPLICABLE_WITH_REASON` | 1 | 3 |

All three candidates are `NOT_READY_WITH_EXACT_BLOCKERS`; zero are ready.
Owner-card presence, reviewed boards, an empty declared array or field
completeness cannot make a candidate ready. No target ratio, component identity,
first wave or candidate contract is selected.

## Product Value and experiments

Product Value remains:

```yaml
mode: observe
value_evidence_status: pending_product_model
promotion_ready: false
```

No need, job, journey, capability, outcome, metric, guardrail, archetype or
product-model ID was created. All six experiments remain `NOT_MERGED` without a
winner receipt.

## Validation and receipt boundary

The new strict Draft 2020-12 schemas use `additionalProperties: false` for
record objects. Semantic validation recomputes immutable hashes and every
material join. The deterministic negative suite covers unsupported closure,
missing facts, card collapse, option selection, fixture substitution, visual
review drift, readiness fail-open, Product Value/STOP escapes, protected paths,
receipt output drift and workflow/runtime drift, restoring the baseline after
each case.

The receipt binds Draft PR #33, the exact merge lineage, frozen PR #32 hashes,
all new output hashes and the exact nine incomplete blocker IDs/facts. It
self-excludes and never asserts that CI passed; Actions run and artifact
metadata are the only execution evidence.

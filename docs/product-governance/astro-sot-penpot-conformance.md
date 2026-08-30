# Kenigevents — Astro ↔ UI SoT ↔ Penpot Conformance Contract

**Contract ID:** `kenigevents.asp-conformance`

**Version:** `1.1.0`

**Status:** `ACTIVE`

**Normative owner:** `onedayonemasterpiece/lovekgd-design-system`

**Canonical path:**
`docs/product-governance/astro-sot-penpot-conformance.md`

## 1. Purpose

This contract is the single normative source for all work that must keep the
Kenigevents production Astro UI, the versioned UI Source of Truth (UI SoT), and
Penpot aligned.

Its product purpose is not formal parity. It is to ensure that the owner can
open a real page in Penpot, compare it with the real product, review the actual
user experience, and return actionable feedback without first decoding
technical implementation details.

The contract prevents requirements from being re-created in prompts,
handoffs, receipts, agent plans, or individual Penpot pages.

## 2. The governing equation

`A = S = P` means:

- **A — Astro:** deterministic rendering of the real product surface;
- **S — UI SoT:** versioned contract describing resolved content, components,
  variants, states, assets, geometry, and interaction semantics;
- **P — Penpot:** native, linked, reusable design-system representation of the
  same resolved case.

The equality is a conformance relation, not an instruction to make unrelated
rendering engines produce byte-identical rasterization.

A case conforms only when all layers below pass.

### 2.1 Factual equality — zero tolerance

Astro, UI SoT, and Penpot MUST use the same:

- fixture IDs and order;
- source content and assets;
- reference clock, timezone, locale, and scenario;
- titles, labels, dates, times, admission, places, counts, and state values;
- crop/focal intent.

Missing, stale, duplicated, substituted, or page-local fixture data is a FAIL.

### 2.2 Semantic equality — zero tolerance

All user-visible controls and states MUST represent the same jobs and
semantics, including navigation, calendar, feedback, sharing, interest, empty
states, loading states, and responsive state transitions.

A visually similar but semantically different control is a FAIL.

### 2.3 Component-lineage equality — zero tolerance

Penpot review surfaces MUST be built from the designated central native linked
components and variants.

The following are prohibited as accepted implementation:

- detached visual roots;
- screenshot-based cards or page regions;
- route-local visual masters that duplicate central components;
- stale nested instances or mutable overrides that carry another fixture,
  scenario, viewport, or component version;
- hidden duplicate visual implementations used to mask the accepted one.

A page MAY contain temporary diagnostics, but they MUST be outside the accepted
review surface and clearly marked as non-accepted evidence.

### 2.4 Visual equality — product-level gate

At native review scale, the owner MUST see the same product experience in
Astro and Penpot:

- composition and hierarchy;
- media frame, crop, and focal result;
- text, line breaks, hierarchy, and legibility;
- spacing, sizing, alignment, radii, borders, and surfaces;
- exact icon language and action geometry;
- social-proof values;
- shell and responsive navigation.

Fresh side-by-side, overlay, diff, and region metrics MUST exist for the
accepted case. Metrics are diagnostic evidence; no single global metric may
replace visual inspection or factual/semantic/component gates.

Renderer antialiasing alone is not a product defect when source content,
line breaks, geometry, crop, and native-scale appearance conform. Conversely,
a low global error score cannot excuse a visible product defect.

### 2.5 Asset identity — fail closed

UI SoT MUST own the immutable identity and exact consumer binding for every
visible icon, logo, illustration, image treatment, and other graphical asset.

Physical bytes MAY live in the normative design-system repository or in a
declared authoritative consumer repository. Co-location is optional;
content-addressed ownership is mandatory.

Every accepted asset binding MUST contain:

- stable `asset_id` and semantic slot;
- authoritative repository and repository-relative path;
- immutable Git commit plus `git_blob_sha1` and/or content `sha256`;
- media type;
- SVG `viewBox` or raster intrinsic dimensions;
- nominal icon box and alignment rules;
- fill/stroke/`currentColor` behaviour;
- permitted states and variants;
- Astro component or selector that consumes it;
- Penpot component/property that consumes the same identity;
- provenance, licence/reuse status, and owner review disposition.

Penpot materialization MUST consume the exact bytes or a deterministic vector
conversion of those exact bytes. It MUST NOT substitute:

- emoji or Unicode glyphs;
- built-in Penpot icons;
- generic icon-library equivalents;
- a manually redrawn “similar” icon;
- placeholder SVG;
- an asset found by semantic search without an approved immutable binding;
- any fallback when a required binding is absent or its hash differs.

A missing, unresolved, stale, or hash-mismatched asset binding MUST abort the
affected materialization before any accepted Penpot frame is mutated. The
required status is `BLOCKED_UNRESOLVED_ASSET_IDENTITY`, never a visual fallback.

### 2.6 Geometry identity — fail closed

UI SoT MUST own exact geometry for each resolved component/state, not only
token names or qualitative descriptions.

For every review-critical region the profile or referenced geometry contract
MUST bind the validated Astro source and record:

- component/source path and immutable commit;
- selector or stable component/state identity;
- viewport, DPR, font set, locale, fixture, and clock;
- computed width and height;
- all four corner radii;
- border width/style, clipping, overflow, and masks;
- padding, gap, alignment, inset, and icon box;
- aspect ratio, crop/focal mode, pill/circle rules, and action-row geometry;
- semantic token name when one exists, plus its resolved numeric value.

Tokens are acceptable only when they deterministically resolve to the measured
value at the pinned source commit. “Looks close”, inherited defaults,
freehand reconstruction, and geometry copied from memory are prohibited.

An unresolved or mismatched critical geometry field MUST block materialization
with `BLOCKED_UNRESOLVED_GEOMETRY`. A frame with generic radii, wrong pill
shapes, wrong clipping, or approximate action geometry is not reviewable.

### 2.7 Materialization provenance and run control — fail closed

Every Penpot mutation run MUST emit a machine-readable receipt containing:

- `run_id`, `actor_type`, `actor_id`, and `triggered_by`;
- Astro repository, commit, route, scenario, viewport, and capture identity;
- UI SoT repository, commit, contract/profile/asset-registry paths and hashes;
- materializer name, version, and commit;
- `started_at`, `completed_at`, and final run state;
- Penpot file/page/frame IDs;
- mutation count and mutated object IDs;
- asset-binding digest and geometry-proof digest;
- validation result, errors, and owner-review state.

Without this receipt the resulting frame is non-accepted evidence.

Run states are `ACTIVE`, `CANCEL_REQUESTED`, `CANCELLED`, `COMPLETED`,
`FAILED`, or `STALE`.

An owner stop/cancel MUST prevent every later mutation from that run. Queued
writes MUST re-check the active `run_id` lease immediately before mutation.
Any mutation after cancellation is invalid, MUST be recorded as an incident,
and MUST NOT be promoted or presented for owner review. Continuing work
requires a new explicit run and a new receipt.

The identity of the executor or agent MUST come from the receipt. Continued
mutation alone is not evidence that a particular agent, Codex task, or user
performed it.

## 3. Authority mode

Every active profile MUST declare one authority mode:

- `ASTRO_AS_IS_REFERENCE` — current production Astro is the visual/factual
  reference while UI SoT and Penpot are reconstructed;
- `UI_SOT_AUTHORITATIVE` — promoted UI SoT controls both Astro and Penpot;
- `EXPLICIT_EXCEPTION` — bounded exception with scope, reason, owner approval,
  and removal condition.

The current reconstruction stage uses `ASTRO_AS_IS_REFERENCE` unless a
versioned change record says otherwise.

Authority mode is normative. An agent plan, receipt, or handoff cannot change
it.

## 4. Product result

A task is complete only when the requested user-facing surface is genuinely
reviewable or shipped, as appropriate.

For owner-review tasks, the terminal status is:

`READY_FOR_OWNER_REVIEW`

This means that the owner can open the named Penpot pages and evaluate the
real user experience without additional technical explanation.

The following are not terminal product results:

- audit completed;
- matrix exhausted;
- structure validated without visual review;
- export attempted;
- tool session unavailable;
- old agent task could not be resumed;
- evidence or receipts created while the page remains unreviewable;
- `PASS_WITH_*` for a known product-visible defect;
- a frame containing unresolved/fallback assets or approximate geometry;
- a frame produced by an unreceipted, cancelled, or stale run.

Tool failures are routing problems. They become product blockers only after
reasonable alternative execution paths have been tested and the remaining
blocker directly prevents a reviewable surface.

## 5. READY_FOR_OWNER_REVIEW gates

All applicable gates MUST pass:

1. Exact resolved fixture/scenario/clock/locale are pinned and read back.
2. Required desktop/mobile states exist on named review pages.
3. Accepted Penpot roots are native and linked.
4. `detached_visual_roots = 0`.
5. `screenshot_visual_roots = 0`.
6. `route_local_visual_masters = 0`.
7. No stale nested fixture/scenario/component lineage exists in accepted roots.
8. Every visible graphical slot resolves to an approved immutable asset binding.
9. Every critical geometry field has pinned Astro computed-style/source proof.
10. No fallback icon, substitute glyph, generic radius, or freehand geometry exists.
11. The mutation run is receipted, current, and not cancelled or stale.
12. `penpot.validate() = []`.
13. Fresh native Penpot export exists.
14. Fresh deterministic Astro capture exists.
15. Side-by-side, overlay, diff, and region inspection are complete.
16. Required tests pass.
17. Changes are committed, pushed, and verified by remote readback.
18. Receipt pins the contract version and SHA used for acceptance.
19. No known product-visible blocker remains.
20. Owner has not rejected the current frame.

## 6. Freedom of implementation

The contract fixes the result and quality gates, not an agent's preferred
implementation.

An executor MAY:

- repair or replace materializers;
- rebuild central components or introduce a versioned architecture;
- clean stale nested lineage;
- change SoT projection;
- use a clean-file or minimal probe;
- change execution window, agent task, sandbox, or tool route;
- fix Astro when a production defect is demonstrated;
- abandon a failed technical hypothesis.

An executor MUST NOT preserve a failed implementation merely because a prior
handoff proposed it.

## 7. Normative hierarchy

From highest to lowest authority:

1. This canonical contract at a pinned version and SHA.
2. A page/profile contract that only specializes variables and required states.
3. An approved requirements change record or bounded exception.
4. Current baseline receipt and evidence describing observed state.
5. Task prompt or handoff containing the requested delta.
6. Agent plan and implementation hypothesis.
7. Logs and diagnostics.

A lower layer cannot silently override a higher layer.

Prompts and handoffs MUST reference this contract; they MUST NOT reproduce or
reinterpret its global rules.

## 8. Requirements change protocol

When a user request materially conflicts with this contract, the executor MUST
not silently comply, silently refuse, or reinterpret the request.

It MUST present one concise change proposal:

```text
CONFLICT: <contract section> ↔ <new request>

БЫЛО:
<current normative rule>

БУДЕТ:
<proposed replacement or bounded exception>

ЗАЧЕМ:
<product reason>

ПОСЛЕДСТВИЯ:
<affected pages, components, evidence, migration and risks>

ТИП:
GLOBAL_AMENDMENT | PAGE_EXCEPTION

СОГЛАСОВАНО:
ожидает решения владельца
```

After explicit owner approval:

1. update the canonical contract or page exception first;
2. increment version;
3. record the change in the contract changelog;
4. update contract locks/pointers;
5. only then implement the changed requirement.

A page exception MUST include scope, reason, owner decision, and a removal or
review condition. It MUST NOT be copied into unrelated page profiles.

Instructions that merely narrow scope, add evidence, or choose an allowed
implementation do not require a contract amendment.

## 9. Routing rule for every agent and every window

Root agent instructions in each participating repository MUST route all
Astro/UI-SoT/Penpot tasks to this contract before work begins.

A new task prompt should contain only:

- product outcome and bounded scope;
- canonical contract path, version, and SHA;
- page profile path, version, and SHA;
- baseline receipt/evidence pointer;
- the requested delta.

The owner MUST NOT be required to copy internal task IDs, WIP mechanics,
materializer hypotheses, or full global acceptance rules between windows.

## 10. Required machine-readable lock

Every participating repository, Penpot file, page profile, and final receipt
SHOULD carry the same lock:

```yaml
requirements_contract:
  id: kenigevents.asp-conformance
  version: 1.1.0
  repository: onedayonemasterpiece/lovekgd-design-system
  path: docs/product-governance/astro-sot-penpot-conformance.md
  commit: required_full_git_commit_sha
  sha256: required_canonical_content_sha256
```

Recommended locations:

- `lovekgd-design-system/contracts/requirements-lock.yaml`;
- `events-bot-new/docs/design-system/requirements-lock.yaml`;
- Penpot shared plugin data under namespace `kenigevents`, key
  `asp-requirements-lock`;
- every page-closure receipt.

These locks are pointers, not duplicated requirements.

## 11. Adoption state

This contract is active as the sole normative owner for Kenigevents
Astro ↔ UI SoT ↔ Penpot conformance requirements.

Its canonical supporting artifacts are:

- `contracts/page-profiles/free-collection.owner-review.v1.yaml` — the first
  bounded page profile;
- `contracts/assets/ui-asset-registry.v1.yaml` — centralized content-addressed
  graphical-asset identities and consumer bindings;
- `docs/product-governance/requirements-drift-retrospective-20260830.md` — the
  decision record and retrospective;
- repository-local routing pointers and immutable locks — references only, not
  copies of this contract.

Historical handoffs, receipts, and evidence remain descriptions of past state.
They are non-normative and do not compete with this contract. Penpot shared
plugin data and future closure receipts MUST pin this active contract before
acceptance of the affected surface.

## 12. Changelog

### 1.1.0 — 2026-08-30

- Owner review exposed generic/substituted icons and geometry drift on the
  mobile free-events frame.
- Makes graphical asset identity content-addressed and fail-closed.
- Makes computed geometry, including all corner radii and icon boxes, an
  explicit fail-closed SoT responsibility.
- Requires materialization provenance receipts and enforceable stop/cancel
  semantics.
- Rejects fallback icons, approximate geometry, and unreceipted or post-cancel
  mutations as owner-review evidence.

### 1.0.0 — 2026-08-30

- Accepted as the sole normative owner for Kenigevents Astro/UI SoT/Penpot and
  owner-review conformance requirements.
- Consolidates previously fragmented rules without making an implementation
  hypothesis, task container, or tool route normative.
- Introduces explicit authority mode, normative hierarchy, machine-readable
  contract locking, and `БЫЛО → БУДЕТ → СОГЛАСОВАНО` change control.

### 1.0.0-proposed — 2026-08-30

- Initial proposal used as the adoption input.

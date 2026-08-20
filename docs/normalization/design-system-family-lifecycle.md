# Design-system family and archetype lifecycle

> Status: normative lifecycle contract.
> Machine contract: [`../../contracts/normalization/family-lifecycle.v1.json`](../../contracts/normalization/family-lifecycle.v1.json).
> Schema: [`../../contracts/normalization/family-lifecycle.v1.schema.json`](../../contracts/normalization/family-lifecycle.v1.schema.json).

## Decision

One bounded candidate family subject and all page archetypes affected by it use one ordered lifecycle:

```text
AS_IS_RECONSTRUCTED
→ FAMILY_HYPOTHESIS_REVIEWED
→ CANDIDATE_CONTRACT_ACCEPTED
→ CANONICAL_CODE_CANDIDATE
→ PENPOT_COMPONENT_CANDIDATE
→ COMPONENT_THREE_WAY_CONFORMANCE
→ PAGE_ARCHETYPE_CANDIDATE
→ PRODUCT_REPRESENTATIONS
→ GEMINI_MCP_VISUAL_AUDIT
→ REVIEWED_CORRECTIONS
→ FAMILY_AND_ARCHETYPE_PROMOTION
```

No state may be skipped. The machine contract owns the exact transition gates, authority changes and required evidence. This document explains their meaning.

The current repository state is `AS_IS_RECONSTRUCTED`: the active Penpot file contains an empty revision-30 scaffold, accepted visual archetypes are zero, all family/application promotion flags are false, and the Product Value Gate is `observe/pending_product_model`.

## Authority is orthogonal to lifecycle

`reconstructed` and `design-system-led` are authority modes, not lifecycle states.

- Through `REVIEWED_CORRECTIONS`, current implementation fact remains in pinned `events-bot-new` source/runtime. Candidate contracts govern candidate construction only.
- `FAMILY_AND_ARCHETYPE_PROMOTION` is the only state that changes authority. One promotion receipt atomically covers one bounded family and its affected archetype set.
- A global design-system switch is forbidden.

An analytical group may be the subject of `AS_IS_RECONSTRUCTED`. It is not a reviewed semantic family until `FAMILY_HYPOTHESIS_REVIEWED` passes a positive evidence checklist. Absence of blockers is not positive readiness.

## Contract acceptance before Penpot

`CANDIDATE_CONTRACT_ACCEPTED` means that an owner has accepted:

- the candidate target contract ID, semantic version and hash;
- the reversible migration and compatibility plan;
- the rollback plan;
- the definition of the final promotion checklist.

It does **not** mean that the family is promoted, the production application may import the package, or Penpot is normative. `CANONICAL_CODE_CANDIDATE` then implements that contract in the canonical future package location for preview/specimen testing without transferring production authority.

This separates two different events that older documents called “acceptance”:

1. acceptance of a candidate target for implementation and evaluation;
2. final family-and-archetype promotion after all evidence gates pass.

## Penpot before promotion

Native Penpot materialization intentionally occurs at `PENPOT_COMPONENT_CANDIDATE`, before final promotion, because it is one of the three conformance surfaces. Every managed candidate must record:

```text
lifecycle_contract_ref
lifecycle_state
subject_id
candidate_contract_id
candidate_contract_version
candidate_contract_sha256
code_candidate_repo_sha
authority_mode = reconstructed
status = candidate
canonical = false
promotion_receipt_ref = null
materialization_receipt_ref
rollback_ref
```

Materialization is permitted only after `CANDIDATE_CONTRACT_ACCEPTED` and `CANONICAL_CODE_CANDIDATE`. Native objects, stable IDs, idempotent reconciliation and a plausible export are evidence; none changes authority. A Resource Graph plugin update is a transport/reconciliation operation and may not promote.

`CANONICAL_CODE_CANDIDATE` here means the versioned design-system package and
isolated specimen harness required to execute the candidate contract. It does
not authorize an early mutation of the `events-bot-new` production consumer.
After native Penpot materialization, owner comments are applied Git-SoT-first and
reconciled back to Penpot. The actual `events-bot-new` candidate integration and
browser preview start only after explicit owner acceptance of the bounded Penpot
candidate, as defined by
[`ui-source-of-truth-roundtrip.md`](../ui-source-of-truth-roundtrip.md).

## Component three-way conformance

`COMPONENT_THREE_WAY_CONFORMANCE` compares exactly:

1. native Penpot candidate;
2. isolated Astro specimen;
3. real generated-page instance using the candidate package.

All three bind the same tuple:

```text
component_id
contract_version
contract_sha256
state_key
fixture_id
viewport_id
candidate_package_sha
```

The isolated Astro and real generated-page surfaces are created in an isolated
candidate integration after the owner Penpot gate. They are reviewed on an
immutable noindex desktop/mobile preview before any production permission.

Required checks include anatomy, variants, nested components, token mapping, geometry, media/text behavior, interaction, accessibility and local overrides. A screenshot alone is insufficient. Candidate generated-page evidence is used before promotion; accepted-release/post-deploy evidence is required again by the final gate.

## Page archetypes and product representations

`PAGE_ARCHETYPE_CANDIDATE` is a reusable page-family contract composed from conformant or already promoted native instances. It binds an exact source-requirements overlay, verified routes, page family, state axes, component-instance graph, gaps and decisions. The overlay itself is not an archetype, and a detached Penpot copy is not an instance graph.

`PRODUCT_REPRESENTATIONS` are real configured `ProductScreen` states, not independent mockups. Each representation binds exactly one archetype, native instance graph, fixture, viewport, screen state, UX-flow step and runtime evidence. Every affected archetype needs mobile and desktop representations; responsive-boundary archetypes also need tablet evidence. Positive, negative, unavailable, authorization, media and stress coverage is explicit rather than inferred from absence.

## Gemini MCP visual audit boundary

`GEMINI_MCP_VISUAL_AUDIT` is an advisory visual and semantic review. Only `gemini-3-pro-preview` or `gemini-3.1-pro-preview` satisfies this gate.

Penpot MCP access is read-only inspection/export. The receipt binds exact model/provider, prompt, full-resolution input manifest, MCP/read log and response hashes. Gemini may assess visible hierarchy, composition, native component reuse, state/viewport coverage, responsive consistency and visible accessibility risks.

Gemini cannot prove:

- DOM semantics or accessibility tree;
- keyboard or runtime behavior;
- reachability, state completeness or contract/hash equality;
- three-way conformance;
- owner acceptance, production release or promotion.

It may not mutate Penpot, resolve comments, accept baselines, change authority or promote. Flash/Lite/Gemma output is supplementary probe material only. Provider/quota/capacity failure is recorded as `blocked` and does not satisfy the transition.

## Corrections and invalidation

At `REVIEWED_CORRECTIONS`, every Gemini finding and related Penpot comment/gap has an owner disposition. Accepted changes are applied through the normal code, plugin or bounded MCP candidate channels. Every gate invalidated by a changed hash is replayed; visual deltas receive a focused Pro-class re-audit.

A change to contract identity, public API, anatomy or state vocabulary restarts at `CANDIDATE_CONTRACT_ACCEPTED`. Code-, Penpot-, archetype- or representation-only changes replay from their earliest affected gate. Stale pre-correction PASS evidence is forbidden.

## Final promotion

`FAMILY_AND_ARCHETYPE_PROMOTION` requires all prior receipts to bind one uninterrupted candidate version and additionally proves:

- every concrete application is product-value promotion ready;
- no `pending_product_model` or observe-only promotion remains;
- accepted production release and pinned package consumer identity;
- owner promotion and accepted-reference receipts;
- post-deploy component, archetype and runtime conformance;
- tested rollback;
- zero unresolved critical gap contradicting the contract.

Only this transition changes the bounded scope to `design-system-led`. Penpot then becomes the accepted native visual implementation of the same contract version; the versioned Git package remains the center of component identity/API/presentation, the application is a pinned consumer, and runtime remains conformance evidence.

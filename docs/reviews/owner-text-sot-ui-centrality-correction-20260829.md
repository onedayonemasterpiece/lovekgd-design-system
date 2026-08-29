# Owner text correction — SoT UI is the central system

Review ID: `REV-CHAT-20260829-01`

Owner item: `OV-59`

Status: `READY_FOR_OWNER_REREVIEW`

Processed: `NO`

## Source boundary

Owner clarification in the active ChatGPT project conversation, immediately
after the handoff for `REV-IDEAHUB-20260829-14` / `OV-58`:

> «Утверждение, что Penpot должен быть центральной системой, ложно; главным
> должен быть SoT UI. Скорее всего, голосовое не очень точно распозналось.
> Поэтому учти это, исправь и проанализируй заново».

This review corrects the derived interpretation of the existing IdeaHub packet
`voice-20260829-201612-4feb9e87`; it does not invent a new product direction.

## Exact transcript readback

The full transcript itself is unambiguous on the authority boundary:

> «Source of Truth — это центр, центральная точка, которая позволяет правильно
> сконфигурировать все компоненты, их иерархию, их отношения, отсутствие
> дублей… И Penpot — это инструмент, который отображает… состояния… и
> архетипы страниц».

Therefore the transcription is sufficiently clear on centrality. The defect was
introduced by the model-generated summary and the later analysis that converted
Penpot's review role into a supposed central-system thesis.

## Correct authority model

```text
owner/product decision
→ SoT UI contract/package/registry
  ├─→ Penpot native visual projection and review surface
  └─→ Astro executable projection/consumer
→ exact structural and visual parity checks
→ owner acceptance
→ promotion and production migration
```

Rules:

1. **SoT UI is the primary system.** In the current implementation its durable
   form is versioned Git contracts, component/package identities, tokens,
   behavior contracts, fixture registry, bindings and receipts in
   `lovekgd-design-system`.
2. Penpot is downstream visual materialization and review. It may collect owner
   comments, but a Penpot-only edit is not authority and must never propagate
   directly to Astro as an independent source.
3. Astro is the executable user-facing consumer/projection. Before promotion,
   pinned Astro/runtime also remains evidence of the current AS-IS behavior.
4. An accepted visual change observed or proposed in Penpot must first be
   encoded in SoT UI, then rematerialized into Penpot and integrated into Astro
   from that same version.
5. The desired automation direction is **SoT UI → both projections**, not
   Penpot ↔ Astro bidirectional authority.

## Fixture reanalysis

The previous interpretation also treated the current `8`-event component corpus
and `5`-event archetype pool as a final deliberate separation. The full voice is
stronger: Golden Corpus prevents substitution while checking components, groups
and complete archetypes.

Correct target:

- one canonical fixture authority in SoT UI;
- typed entity pools and named scenarios may be different;
- every event scenario must reference fixture records from that same canonical
  registry and preserve exact payload/media hashes;
- festivals, clubs and artifacts may have their own typed pools under the same
  registry authority;
- scenario subsets are allowed, parallel unlinked event authorities are not.

Current factual gap:

- the immutable component-certification corpus contains `8` events;
- the later archetype registry contains a disjoint `5`-event pool;
- current documents explicitly state that one does not replace the other;
- no source-bound proof currently shows both event sets governed by one
  canonical fixture registry.

This is now classified as `SOT_FIXTURE_AUTHORITY_UNIFICATION_OPEN`, not as a
finished target architecture. Exact parity inside an individual named scenario
can still pass; cross-level Golden Corpus continuity remains unproven.

## Supersession

This review supersedes only the incorrect interpretation in
`REV-IDEAHUB-20260829-14` / `OV-58` that attributed a “Penpot is the central
point” thesis to the owner voice.

It preserves the valid parts of `OV-58`:

- technical lineage instead of visual lookalikes;
- SoT-governed component hierarchy;
- exact same fixtures inside a bounded comparison;
- component/group/archetype parity;
- separate structural, visual, owner-acceptance, promotion and release gates.

## Materialization scope

Documentation and agent routing must now state, without qualification:

- SoT UI is central;
- Penpot and Astro are governed projections/consumers;
- review feedback from Penpot returns to SoT UI before propagation;
- the split component/archetype event corpora are a current unification gap;
- no Penpot mutation, merge, promotion or deployment is implied by this
  documentation correction.

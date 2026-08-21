# Agent operating contract — LoveKGD Design System

## Start here

For every UI, component, archetype, Penpot, or Astro synchronization task read:

1. `docs/ui-source-of-truth-roundtrip.md` — mandatory cross-repository loop;
2. `docs/component-contract-authority.md` — authority before and after promotion;
3. `docs/normalization/design-system-family-lifecycle.md` — ordered lifecycle gates;
4. the affected family contract, decision ledger, and latest Penpot receipt.

For material UI component, foundation, archetype, or consumer changes, load the
project skill `.codex/skills/ui-three-way-conformance/SKILL.md`. A change is not
complete without an affected exact case or a machine-readable `not_applicable`
reason. Keep the full procedure in that skill; do not duplicate it here.

Exact owner decisions outrank derived documentation. Do not rewrite historical
source evidence to make a later decision look pre-existing.

## UI source-of-truth rules (critical)

- The durable UI SoT is versioned Git contract/package data in this repository,
  not a Penpot canvas and not an independently edited `.astro` copy.
- Before a family is promoted, pinned `events-bot-new` Astro/runtime is still the
  executable source of fact for the current AS-IS implementation. A reconstructed
  contract or Penpot candidate must not be described as already canonical.
- Initial reconstruction follows `pinned Astro/runtime → Git SoT candidate →
  native Penpot candidate → owner review`.
- Penpot feedback follows `comments → deduplicated/bound decision record → Git
  SoT first → Penpot reconciliation from the same contract/IR → focused export →
  owner re-review`. A Penpot-only fix is forbidden.
- Do not backport a reviewed visual change into the `events-bot-new` product
  consumer until the owner explicitly accepts the bounded Penpot candidate.
- After that acceptance, record the accepted version/hash, implement an isolated
  Astro candidate/preview, prove three-way conformance, and provide immutable
  noindex desktop/mobile review evidence. This is not production permission.
- Production promotion/generation requires a second explicit owner approval of
  the browser/device result plus the family/release/migration gates and post-deploy
  verification. Penpot approval alone never authorizes production.
- `CANONICAL_CODE_CANDIDATE` before Penpot refers to the versioned design-system
  package/specimen harness. It does not authorize an early production-consumer
  change in `events-bot-new`.

## Penpot review and evidence

- Ingest comment threads file-scoped first, then bind them to the exact origin
  page/board/resource and deduplicate by thread identity/sequence.
- Comments are problem/decision input, not implementation authority by
  themselves. Record owner disposition in Git before changing the candidate.
- Never resolve a thread merely because a mutation completed. Resolution needs
  a reply with read-back evidence; final visual acceptance remains an owner gate.
- Preserve native components, linked instances, stable IDs, variant axes, exact
  source/contract SHA, rollback data, and materialization receipts.
- A review handoff must include a complete ordered list of direct Penpot links,
  exact review scope, validation/export results, and any deliberately open gates.
- Always distinguish Penpot page and board in names and links: `Page 25 / Board
  25A`, never “page 25A”; persist `page_id` and `board_or_component_id` separately.
- Screenshots are review evidence/oracles, never component fills or substitutes
  for native reusable resources.

## Repository boundary

This repository owns UI contracts, decisions, component identity/version/state,
Penpot bindings, materialization and review receipts, accepted references, and
the promoted package. `events-bot-new` owns product/domain state resolution,
candidate preview integration, release, runtime, and production evidence.
Do not duplicate the full lifecycle contract in the consumer repository; keep a
short fail-closed bridge there that points back here.

## Completion

- Candidate and accepted statuses must be explicit; never use “done” to mean
  owner-accepted, promoted, released, and production-verified at once.
- An instrumental or code-agent conformance PASS never means owner acceptance
  and never advances lifecycle automatically.
- Validate changed contracts/receipts, run `git diff --check`, commit, and push
  durable task changes unless the owner explicitly forbids it.
- Never fabricate IDs, revisions, hashes, links, validation, review, or release
  evidence.

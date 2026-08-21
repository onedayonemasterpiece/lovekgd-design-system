# UI source-of-truth round trip

> Status: accepted operational contract.
> Scope: `lovekgd-design-system` ↔ Resource Graph Penpot ↔
> `events-bot-new` Astro/runtime.

## Decision

The durable center of UI decisions is the versioned Git contract/package in
`lovekgd-design-system`. Penpot is the native visual implementation and review
surface of the same bounded contract. Astro is the executable implementation:
before family promotion it is the source of fact for the current AS-IS UI; after
promotion `events-bot-new` becomes a pinned consumer of the design-system
package.

Therefore neither Penpot nor a route-local Astro copy may be edited as an
independent source of truth.

## The required loop

### 1. Reconstruct the existing system

```text
pinned events-bot-new Astro + generated runtime evidence
→ candidate Git SoT UI contract in lovekgd-design-system
→ native Penpot components/archetypes from that contract/IR
→ instrumental and visual read-back
→ owner Penpot review
```

At this stage:

- Astro/runtime proves what currently exists;
- Git records the reconstructed boundary, anatomy, variants, states, tokens,
  fixtures, bindings, gaps, and exact source SHA;
- Penpot visualizes the candidate as native reusable resources and linked
  instances;
- all candidate objects remain `authority_mode=reconstructed`,
  `canonical=false`.

### 2. Process owner comments

```text
Penpot comments
→ file-scoped ingestion and deduplication
→ exact page/board/resource association
→ owner disposition and decision record in Git
→ Git SoT contract/receipt update first
→ Penpot reconciliation from the same version/hash/IR
→ focused exports + full affected-scope read-back
→ owner Penpot re-review
```

Rules:

- a comment describes a gap or owner decision; it is not permission to invent
  missing implementation details;
- no accepted correction may exist only in Penpot;
- no Git contract change may be claimed materialized without Penpot read-back;
- a mutation does not equal acceptance;
- thread resolution requires an evidence reply, while final visual acceptance
  remains explicit and human;
- every handoff lists every required page as an ordered direct link so Penpot
  page ordering cannot hide review scope.

The loop repeats until the owner explicitly accepts the bounded Penpot candidate.

### 3. Build the browser candidate after Penpot acceptance

```text
owner Penpot acceptance
→ accepted-candidate receipt/version/hash in Git SoT
→ isolated events-bot-new Astro integration
→ design-system catalog specimen + real generated preview instance
→ three-way conformance: Penpot ↔ isolated Astro ↔ generated page
→ immutable noindex preview at an exact Git/package SHA
→ owner phone/desktop review
```

The pre-Penpot lifecycle state `CANONICAL_CODE_CANDIDATE` is the versioned
design-system package/specimen harness needed to make the contract executable.
It is not permission to change the production consumer early. The actual
`events-bot-new` backport/integration starts only after owner acceptance of the
Penpot candidate.

Browser review must cover affected mobile and desktop representations and any
required tablet, interaction, accessibility, negative/error, long-text, and
media states. The evidence tuple is identical on all three surfaces:

```text
component_id
contract_version
contract_sha256
state_key
fixture_id
viewport_id
candidate_package_sha
```

The reproducible visual step is mandatory for each affected component and, later,
each page archetype:

```text
capture the exact current Astro component/archetype at the pinned SHA
→ place that source screenshot on a focused Penpot evidence board
→ compose the same state and the same exact resolved fixture beside it from native linked components
→ export the bounded Astro-reference and Penpot-composition roots
→ run no-scale instrumental comparison
→ open Astro/Penpot/overlay/diff images and review them visually
→ correct the Git SoT first, then regenerate both implementations
```

The screenshot is an oracle/evidence item, never a component fill. Boards should
be small and single-purpose; do not export whole pages or oversized matrices.
Remove superseded visual debris rather than leaving it beneath linked components.
For links and receipts, distinguish `Page 25 / Board 25A` (and, for example,
`Page 30.1 / Board 30.1C`); a board suffix is not a page number.

“The same fixture” means the same event ID, frozen public snapshot, resolved
text/props, image hashes, component state and viewport—not two visually similar
events. If any of those values differs, stop before image comparison and record
the tuple blocker. Never publish two different events side by side as a parity
result.

Systemic corrections are made in the canonical Penpot master or a semantic
nested master. Linked instances must inherit the correction. Do not hide stale
geometry by placing a fixed copy above it, and do not repair every review
specimen independently. After changing a master, read back representative
children, verify their component ancestry, and remove obsolete debris before
exporting a focused review board.

The exact executable procedure, status model, Telegram review/read-back, and
retention safeguards live once in
[`ui-three-way-conformance`](../.codex/skills/ui-three-way-conformance/SKILL.md).
This document owns lifecycle placement and does not duplicate the runner.

### 4. Promote and release only after browser approval

```text
owner browser/device approval
→ final SoT decision + promotion/release/migration receipts
→ complete production-consumer migration
→ merge to the authorized release source
→ production generation/deploy
→ post-deploy runtime conformance
→ close comments/gaps or rollback
```

Penpot acceptance, a green candidate build, a resolved comment, or a preview URL
alone does not authorize production. Production requires the repository release
gates, exact accepted SHA/package version, complete consumer migration (or an
owned time-bounded rollout), and explicit owner approval of the rendered browser
result.

If production differs from the accepted contract/reference, do not update the
baseline from the actual result. Roll back or reopen the loop at the earliest
invalidated gate.

## Authority by phase

| Phase | Current implementation fact | Durable candidate/accepted decision | Visual review surface | Runtime/release authority |
|---|---|---|---|---|
| Reconstruction | pinned `events-bot-new` Astro/runtime | candidate Git contract in this repo | candidate Penpot | none |
| Comment correction | pinned Astro plus exact owner wording | updated Git contract/decision first | reconciled Penpot | none |
| Browser candidate | accepted-candidate Git version/hash | Git package + acceptance receipt | accepted Penpot reference | isolated `events-bot-new` preview only |
| Promoted | versioned package in this repo | promoted Component Contract/package | accepted native Penpot binding | pinned `events-bot-new` consumer |
| Production | promoted package + accepted consumer SHA | promotion/release receipts | immutable accepted reference | deployed runtime + post-deploy evidence |

## Repository responsibilities

### `lovekgd-design-system`

Owns component/archetype identity, contracts, versions/hashes, decision ledgers,
Penpot bindings and materialization receipts, accepted references, migration and
rollback contracts, promotion receipts, and the promoted component package.

### Resource Graph Penpot

Owns native components, variants, constraints, compositions, representations,
review comments, and visual acceptance. It does not own durable textual
decisions, browser semantics, release state, or production truth.

### `events-bot-new`

Owns current AS-IS implementation fact before promotion, product/domain state
resolution, isolated candidate integration, browser/device previews, consumer
migration, release, production generation, and runtime evidence. It may not keep
an independently editable fork of a promoted component.

## Emergency exception

A production incident may require an immediate reversible mitigation before a
Penpot round trip. Such a hotfix is runtime safety work, not an accepted design
decision. It must preserve incident/release governance and create a mandatory
reconciliation item: capture exact runtime evidence, update the Git SoT, reconcile
Penpot, obtain owner disposition, and either promote the correction or roll it
back. The exception must never become a silent new visual baseline.

## Handoff vocabulary

- **ready for Penpot review** — candidate materialized and verified; no owner
  acceptance implied;
- **Penpot accepted / ready for browser candidate** — owner accepted the bounded
  visual candidate and Git recorded the exact version/hash;
- **ready for phone/desktop review** — immutable candidate preview and three-way
  evidence are available; no production permission implied;
- **approved for production** — owner accepted the browser/device result and all
  release/promotion gates pass;
- **production verified** — deployed generated UI matches the accepted contract
  and post-deploy evidence is recorded.

These states must not be collapsed into one generic “done”.

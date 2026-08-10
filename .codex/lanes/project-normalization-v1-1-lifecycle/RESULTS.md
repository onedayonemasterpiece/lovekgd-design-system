# R13 lifecycle lane result

## Status

`DONE` on branch `agent/project-normalization-v1-1/lifecycle`, based on
`50f51565041a9ea36768784d1cc9ca1d7345acb7`.

This lane defines one fail-closed, normative lifecycle for a bounded family subject and its
affected archetype set. The repository truth remains `AS_IS_RECONSTRUCTED`; this result does not
materialize Penpot content, mutate a runtime repository, accept a candidate contract, or promote a
family.

It resolves the independent audit's `future_lifecycle_documentation_gap` before first-family
promotion while leaving the byte-exact audit record unchanged as historical evidence.

## Delivered

- `contracts/normalization/family-lifecycle.v1.json` and its Draft 2020-12 schema define the exact
  11 ordered states, 10 adjacent transitions, all-of gates, authority effect and hash-bound evidence.
- `docs/normalization/design-system-family-lifecycle.md` is the normative human contract.
- Penpot native materialization is explicitly a noncanonical state-5 candidate; only transition
  `T10_PROMOTE_FAMILY_AND_ARCHETYPES` changes authority.
- Component conformance binds native Penpot, an isolated Astro specimen and a generated-page
  instance to one exact seven-field tuple.
- Page archetype candidates and configured product representations have separate required
  identities, state/viewport coverage and evidence.
- Gemini MCP review is read-only and advisory. Only the two allowed Pro preview model IDs can
  satisfy the visual-audit gate; the contract records what the review cannot prove.
- Resource Graph plugin metadata and validation now fail closed on lifecycle authorization and
  candidate identity without changing Penpot files.
- Canonical authority, Resource Graph, page archetype, product operating-model and normalization
  status documentation is reconciled to the same boundary.

## Validation

Passed:

```text
python3 -m json.tool contracts/normalization/family-lifecycle.v1.json
python3 -m json.tool contracts/normalization/family-lifecycle.v1.schema.json
python3 -m json.tool contracts/page-archetype-requirements.v1.json
python3 -m json.tool contracts/resource-graph-004.plugin.json
python3 jsonschema Draft202012Validator.check_schema + validate
node scripts/validate-family-lifecycle-v1.mjs --root .
node tests/family-lifecycle-v1-negative.mjs .
node scripts/validate-resource-graph-004-contracts.mjs
node scripts/validate-component-decoder-snapshot.mjs catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc
node scripts/validate-behavioral-decoder-supplement-v1-1.mjs catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc
git diff --check
```

The negative suite rejects 16 lifecycle/schema contradictions, including state reordering/skipping,
early authority transfer, canonical pre-promotion Penpot, incomplete three-way identity, non-Pro or
writable Gemini review, false current promotion, pending-product promotion and missing rollback.

## Integration note

The immutable v1 synthesis validator is expected to report `receipt bytes mismatch: README.md`
because its historic receipt byte-binds documentation intentionally corrected by this v1.1 lane.
The integration lane must generate/validate the new v1.1 receipt; this lane does not rewrite the
historic v1 receipt.

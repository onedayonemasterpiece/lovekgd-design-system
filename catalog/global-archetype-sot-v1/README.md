# Global Archetype SoT v1

Status: **candidate, reconstructed, non-canonical**
Source: current integrated Astro source locked by `catalog/reconstruction-atlas/v1`
Design-tool mutation: **none**
Merge/deploy authority: **none**

`global-archetype-sot-v1` is the stable semantic projection of the current Astro reconstruction atlas. It does not replace the existing Date or Weekend artifacts and does not embed design-tool identifiers, comparison payloads, screenshots, or renderer differences into semantic contracts.

## Authority and scope

The package is generated from the exact inputs listed in `source-lock.v1.json`:

- the 29/29 production Astro page-source census and route families;
- generated browser routes captured from the built Astro site;
- 67 browser-computed observations across the locked responsive fixtures;
- semantic anatomy, states, reuse/new ownership, foundations, fixtures, and the explicit gap ledger.

Route mapping and runtime validity are separate gates. A generated route with a browser contradiction remains mapped to exactly one archetype, but its disposition becomes `unresolved`; it is never silently removed or reported as a successful runtime contract.

## Outputs

- `route-archetype-registry.v1.json` — production source pages, public route patterns, and concrete generated routes mapped to archetypes;
- `component-composition-graph.v1.json` — archetypes, exact component identities, runtime boundaries, unresolved contracts, and dependency edges;
- `archetype-contracts/*.semantic-contract.v1.json` — anatomy, regions, component dependencies, states, responsive branches, foundations usage, fixture slots, and dispositions;
- `coverage-matrix.v1.json` — mapping coverage and browser-runtime completeness kept as separate metrics;
- `contract-bindings.v1.json` — external source/generated-browser bindings; these do not enter semantic contracts;
- `penpot-materialization-plan.v1.json` — plan-only grouping by final owner pages, without design-tool IDs and without mutations;
- `generation-receipt.v1.json` — deterministic hashes and counts.

## Dispositions

- `reuse_existing` — exact existing semantic identity reused without merging it with visually similar candidates;
- `new_component` — one exact source identity that requires a new stable component boundary;
- `runtime_only` — authorization, controllers, diagnostics, or other runtime behavior represented without pretending it is a static visual component;
- `unresolved` — an explicit route/component contract contradiction or missing accepted contract.

## Fail-closed rules

Validation fails when any of the following occurs:

1. production source-page, public route-pattern, generated-route, or browser-observation mapping is below 100%;
2. a production route maps to more than one archetype;
3. a failed browser observation is not represented as `unresolved`;
4. one graph node contains more than one source semantic identity;
5. a speculative component merge is present;
6. a semantic contract contains design-tool IDs, comparison payloads, renderer deltas, screenshots, pixel metrics, or UUID-like design identifiers;
7. an existing Date or Weekend artifact changes relative to the locked parent commit;
8. a second deterministic build changes any generated output.

## Rebuild and validate

```bash
node scripts/global-archetype-sot-v1/build.mjs
node scripts/global-archetype-sot-v1/validate.mjs
node tests/global-archetype-sot-v1.test.mjs
```

The compatibility entry point `scripts/reconstruction-atlas/build-global-archetype-sot.mjs` delegates to the same durable builder.

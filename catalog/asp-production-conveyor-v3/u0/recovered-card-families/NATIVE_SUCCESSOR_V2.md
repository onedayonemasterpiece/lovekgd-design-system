# U-RECOVERED-CARD-FAMILIES — native successor v2

This package-local successor implements
`RD-U0-U-RECOVERED-CARD-FAMILIES` from issue #57, comment `5499373802`.
It supersedes the v1 `penpot.ensure` metadata harness without changing the five
family identities, their product semantics, or any source pin.

## Executable surface

The v2 executor creates, through native Penpot plugin API calls:

- five package-owned pages, one per existing card family;
- five visible documentation roots with native Flex shells;
- five concrete component masters with family-specific product anatomy;
- twenty-three state wrappers containing real `LibraryComponent.instance()`
  copies;
- visible Russian content, source-derived dimensions, radii, fills, strokes,
  typography hierarchy, and concrete source-bound state layout/style bindings.
  Every declared state is materialized; no relabel-only or invented combined
  state remains.

The component families remain exactly:

1. `U-CARD-COMPACT`;
2. `U-CARD-FESTIVAL`;
3. `U-CARD-CLUB`;
4. `U-CARD-ARTIFACT`;
5. `U-CARD-COLLECTION`.

No EventCard clone, route-local screenshot, detached copy, substitute family,
empty specimen well, or placeholder-only geometry is created. Source lineage is
written to every managed root and master from the unchanged
`events-bot-new@8f46f068ba41dab4dca538806d11693c8c0d3042` tuple.

## Integrity and replay

Shared plugin data is accepted only when `typeof value === "string"`; the
native-like test double rejects other values and performs no coercion. The test
suite runs the same native executor twice on the same surface and requires:

```text
second_run_created=0
duplicates=0
detached=0
screenshots=0
source_lineage_errors=0
protected_projection_changed=false
managed_replay_projection_changed=false
managed_nodes=38
declared_state_specimens=23/23
```

Negative runs independently inject duplicate pages, a detached instance,
screenshot-named geometry, `type=image`, `fillImage`, protected-owner drift,
managed replay drift, and a cancelled lease. Each condition fails closed. Both
protected and managed projections cover text, complete paint/gradient fields,
radii, opacity, blend/blur, shadows, all supported typography properties,
constraints/transforms, layout-child/grid-cell/tokens, component binding, and
all Flex sizing/alignment/padding fields. A shadow-only managed replay
corruption fails closed.

Complete plugin-data projection never uses a fixed key fallback. It enumerates
local keys plus every shared namespace and every key in each namespace. Because
the native PluginData API exposes shared keys only after a namespace is known,
the execution surface requires the adapter capability
`getSharedPluginDataNamespaces()`; if complete namespace enumeration is not
available, the executor fails before the first native write. A foreign-namespace
mutation is an explicit adversarial test.

The detached-copy gate recursively scans every shape under every managed root
and component master, including untagged nested shapes, on the first run and
replay.

## Atlas and authorization boundary

`ASP_ATLAS_EXTENSION_REQUEST_V1.md` remains byte-for-byte unchanged:

```text
git_blob_sha1: 1ecbada6d8159723f2d5618b8f809af1e4ad1653
sha256: b9b7e3264ef59f6fa0fd93b1d1c69666a7212eece763bb02acca990d27c68b55
bytes: 995
```

The executor does not assign Atlas page order. O0 extension binding and the
ActionNav/V0 dependency gate remain open. Therefore the only allowed status is
`ATLAS_EXTENSION_PENDING`; Git QA is not Penpot execution or publication
authorization.

No Penpot read or mutation, PUBLISH run, Atlas mutation, Kaggle call, or
component-family expansion was performed while producing this successor.

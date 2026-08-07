# Penpot Resource Graph 004a

Resource Graph 004a is the first installable native-resource delivery for the LoveKGD design system.

It creates, in one whole-system update:

- native Penpot library Colors;
- native Penpot Typographies;
- native vector icon component masters and specimens;
- native core UI component masters and state families;
- structured documentation pages instead of unrelated boards;
- native Penpot comment-to-prompt review context;
- migration of the old Runtime Review 003.2 raster pages into preserved technical evidence pages.

## Install

Moving live manifest:

```text
https://cdn.jsdelivr.net/gh/onedayonemasterpiece/lovekgd-design-system@resource-graph-004a-live/prototypes/penpot-resource-graph-004a/dist/manifest.json
```

For a sign-off session, use the immutable commit URL reported by the successful publication run.

Plugin name:

```text
LoveKGD Resource Graph — native resources 004a
```

Open the plugin once and press **«Обновить дизайн-систему»**. The optional preflight and comment-prompt operations remain separate; there is no per-page or per-component import workflow.

## Published catalog

The publication workflow builds one Git-backed catalog from the exact `events-bot-new` checkout used by the run. The first validated delivery contains:

- 25 colors;
- 9 typographies;
- 69 vector icons, including 56 currently classified icons;
- 4 native core component families;
- 16 named Penpot pages.

The catalog, plugin, UI and manifest are syntax-checked, contract-checked and fetched again through their public CDN/CORS paths before a release is marked successful.

## Scope boundary

004a is a visible native-resource foundation, not yet the complete accepted-production Resource Graph 004.

It does not yet claim:

- accepted production-release identity rather than the exact current Git checkout;
- complete product-component decomposition;
- page archetypes assembled entirely from product component instances;
- multi-resolution actual/baseline/diff evidence from the accepted production artifact.

Runtime Review 003.2 remains preserved as screenshot evidence and comment history while those production-derived layers are added. The native resources created by 004a are the base that subsequent releases update in place.


## Product Atlas wrong-file guard

Resource Graph and Product Atlas use separate Penpot files, manifests, catalogs and namespaces. Resource Graph 004a.3 checks `lovekgd.productatlas.001` markers before `ensurePages` and fails closed with `wrong_file_kind:product-atlas`; it must not create design-system pages in a Product Atlas file.

# Stable Penpot plugin channel

Canonical installation URL:

```text
https://raw.githubusercontent.com/onedayonemasterpiece/lovekgd-design-system/main/penpot/stable/manifest.json
```

This path is permanent. Compatible verified releases replace the files under `penpot/stable/` without changing the installation URL.

Current promoted implementation: `prototypes/penpot-resource-graph-004a/dist/` from `main`.

Promotion rules:

- manifest, plugin and icon must exist together;
- JavaScript syntax and manifest permissions must pass CI;
- the public raw GitHub and jsDelivr URLs must return the expected files with CORS;
- an unimplemented or placeholder prototype must never be promoted;
- the stable channel must not point to a temporary branch.

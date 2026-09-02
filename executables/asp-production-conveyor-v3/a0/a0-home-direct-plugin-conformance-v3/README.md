# A0 Home direct-plugin conformance V3

Package-local successor for QA repair `5510686308`. The original Home producer
bundle remains byte-identical. V3 adds:

- exact package/physical ACTIVE identity parity, using `currentFile.revn` and a
  fresh projection marker;
- exact Atlas R2 `ARCHETYPE_DESKTOP_MOBILE_V2` root, linked
  `ATLAS_PAGE_HEADER_V2`, desktop, mobile, and evidence slots;
- source-bound linked Home dependency compositions rather than labels-only
  region summaries;
- terminal physical census, protected-surface checks, and replay zero.

```bash
node generate.mjs --check
node --test home.v3.bundle.test.mjs
node test-deps/d0_plugin_bundle_conformance_v1.mjs \
  --bundle home.v3.bundle.js \
  --sha256 "$(sha256sum home.v3.bundle.js | cut -d' ' -f1)" \
  --global D0A0HomeDirectPluginV3
```

State is `MAT_PACKAGE_READY_QA_INTEGRATE_GATED`. No Penpot execution or visual
verdict is authorized by this Git package.

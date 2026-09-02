# A0 Home direct-plugin conformance V2

Package-local successor of the immutable A0 Home producer bundle at
`9a2b2c3661d6ca69246225373242c47955400116`. It adds the direct
`D0_PLUGIN_BUNDLE_V1` contract, exact Atlas R2 Home binding (`0260`,
`ARCHETYPE_DESKTOP_MOBILE_V2`), source-bound desktop/mobile text, bounded
current-page execution, and deterministic replay.

The producer source and shared conformance harness are byte-for-byte frozen in
`source/` and `test-deps/`. `generate.mjs` checks the source identity before it
writes the generated bundle and manifest.

```bash
node generate.mjs --check
node --test home.d0.bundle.test.mjs
node test-deps/d0_plugin_bundle_conformance_v1.mjs \
  --bundle home.d0.bundle.js \
  --sha256 "$(sha256sum home.d0.bundle.js | cut -d' ' -f1)" \
  --global D0A0HomeDirectPluginV2
```

This package is `MAT_PACKAGE_READY_QA_INTEGRATE_GATED`. It does not authorize
Penpot execution and contains no visual verdict.

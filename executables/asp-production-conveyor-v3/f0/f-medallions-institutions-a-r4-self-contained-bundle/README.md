# F-MEDALLIONS-INSTITUTIONS-A R4 standalone Penpot bundle

Package-local successor of producer head `9633b137d895af53580937fc3a2199849295427a`.
It preserves the eight immutable source assets while binding the runtime to Atlas R2 page
`medallions-institutions-a` / `04.1 · Assets · Medallions · Institutions A · Candidate`.

## Browser/Penpot invocation

Evaluate `dist/penpot-plugin.bundle.js` as a classic script (not a module). The frozen global is:

```js
const bundle = globalThis.KenigeventsF0DirectPluginBundle;
await bundle.projection(host);
await bundle.executePhase(host); // repeat one bounded phase until terminal
await bundle.settlement(host);   // read-only terminal settlement
```

The bundle has no runtime `require`, `import`, `module`, `exports`, `process`, `Buffer`, filesystem,
or network dependency. The host authorization tuple must carry the sole writer claim and ACTIVE lease.
Every phase creates at most three native objects and rechecks ACTIVE/cancel/expiry/provenance before
native calls. Unknown outcome requires projection/readback; blind retry is forbidden.

## Frozen conformance gate

```bash
node tests/asp-production-conveyor-v3/d0/d0_plugin_bundle_conformance_v1.mjs \
  --bundle executables/asp-production-conveyor-v3/f0/f-medallions-institutions-a-r4-self-contained-bundle/dist/penpot-plugin.bundle.js \
  --sha256 52b9afaabfc2a3ff4cabc3ca6add2a76ba4481476721c82c69d2ba9c4559a7ca \
  --global KenigeventsF0DirectPluginBundle
```

Frozen harness: `agent/d0-plugin-bundle-conformance-v1-20260902@9ab3696f1053ba41ecd4ac7bf1f52ef3427d145b`,
tree `f0603efe12801a9beb3a156eefd8bff12544246b`.

Terminal census: eight native masters, 24 linked tier specimens, six exact SVGs, two exact WebPs,
two non-empty WebP leaf export proofs, `validation=[]`, detached/screenshot/duplicate counts zero,
and replay-created zero.

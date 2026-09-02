# EventCard Paths standalone bundle v1

Package-local receipt-recovery successor for `MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-LINKAGE-R3`. It exposes `globalThis.KenigEventsD0EventcardPathsR3StandaloneV5` as one browser/Penpot-safe JavaScript artifact with production projection, receipt-only execution, and distinct settlement entrypoints. Penpot execution remains independently QA/INTEGRATE and fresh-projection gated.

## V5 real-native recovery boundary

V5 consumes only the sole physical writer marker `kenigevents/asp-active-run-v1`, requires `currentFile.revn` with no revision alias, and binds the full authorization/provenance/physical tuple to the exact package head/tree, bundle SHA/bytes, native revision, projection SHA, sole writer, lease/cancel tokens, and the Paths-specific active-shift authority marker `5514360206`. It does not consume the independent Text-only blocked profile.

Production execution accepts only the already-durable terminal projection: 18 canonical paths, 18 native main projections, and 26 linked instances. The generated artifact structurally contains zero `LibraryComponent.path` setters and zero native creates. It writes one exact receipt derived from the current native tuple and IDs. Replay parses and exact-compares the stored receipt; a stale non-empty value fails before create, setter, or rewrite. Distinct settlement exact-compares the stored receipt and later 18/18/26 readback.

The shared real-tuple conformance gate is `agent/d0-plugin-bundle-conformance-v1-20260902@62f26df36b8199e4b8899b9252f796b1fa5e9d42` (issue receipt `5511575507`). Its synthetic fixture receipt SHA is `ba0de11bbbe1b95b88de2c0234e53d8b66cc28448dfee2d57972bff19ae36430`; this hash is explicitly fixture-only. Production receipt identity is derived and verified from the actual head/tree/bundle/revn/projection/component/main/linked-ID tuple.

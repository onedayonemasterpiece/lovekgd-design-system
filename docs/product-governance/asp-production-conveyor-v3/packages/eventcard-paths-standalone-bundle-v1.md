# EventCard Paths standalone bundle v1

Package-local successor for `MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-LINKAGE-R3`.
It exposes `globalThis.KenigEventsD0EventcardPathsR3StandaloneV4` as one browser/Penpot-safe JavaScript artifact with production read-only projection, receipt-only recovery execution, and distinct settlement entrypoints. The bundle has no runtime repository loader, Node built-ins, caller-injected helpers, or conformance-only dispatch; its exact bytes and SHA-256 must be repeated in the authorization, provenance, and physical ACTIVE tuples. Penpot execution remains QA/INTEGRATE and fresh-projection gated.

The V4 global uses an owned deterministic plain-data clone for the projection payload and never invokes the Penpot sandbox `structuredClone` host function.

## Penpot-native structural-name recovery

The `LibraryComponent.path` setter in the current Penpot runtime automatically projects the canonical library path into the structural main-layer name. V4 accepts only the exact derived formula `<canonical path> / <unchanged component display name>` when the path is already canonical. It rejects arbitrary main-layer names. For the revision-181 post-write state, production execution performs zero further path setters and zero creates, reads a full-tuple physical ACTIVE marker directly from `currentFile`, persists exactly one recovery receipt, and requires a distinct later settlement readback. Replay performs no receipt rewrite. Component IDs, main IDs, 26 linked-instance IDs, visible labels, text, media and geometry remain protected.

The shared conformance gate at `agent/d0-plugin-bundle-conformance-v1-20260902@bb26c3d966511b590e26c3992da458b68c16fe2a` executes these same production entrypoints under its receipt-only recovery contract. The expected receipt is `kenigevents/eventcard-paths-linkage-r3-receipt` with SHA-256 `76d637b82f34177b151a2511ff455f1b60949a549910e42f48333ffedb26c86d`.

# EventCard Paths standalone bundle v1

Package-local successor for `MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-LINKAGE-R3`.
It exposes `globalThis.KenigEventsD0EventcardPathsR3StandaloneV3` as one browser/Penpot-safe JavaScript artifact with read-only projection, path-only execution and distinct settlement entrypoints. The bundle has no runtime repository loader or Node built-ins; its exact bytes and SHA-256 must be repeated in the authorization and provenance tuple. Penpot execution remains QA/INTEGRATE and fresh-projection gated.

The V2 global uses a deterministic plain-data clone for the projection payload and never invokes the Penpot sandbox `structuredClone` host function.

## Penpot-native structural-name recovery

The `LibraryComponent.path` setter in the current Penpot runtime automatically projects the canonical library path into the structural main-layer name. V3 accepts only the exact derived formula `<canonical path> / <unchanged component display name>` when the path is already canonical. It rejects arbitrary main-layer names. For the revision-181 post-write state, execution performs zero further path setters and zero creates, persists only a recovery receipt under a fresh physical ACTIVE lease, and requires a distinct later settlement readback. Component IDs, main IDs, 26 linked-instance IDs, visible labels, text, media and geometry remain protected.

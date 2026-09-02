# EventCard Paths standalone bundle v1

Package-local successor for `MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-LINKAGE-R3`.
It exposes `globalThis.KenigEventsD0EventcardPathsR3StandaloneV2` as one browser/Penpot-safe JavaScript artifact with read-only projection, path-only execution and distinct settlement entrypoints. The bundle has no runtime repository loader or Node built-ins; its exact bytes and SHA-256 must be repeated in the authorization and provenance tuple. Penpot execution remains QA/INTEGRATE and fresh-projection gated.

The V2 global uses a deterministic plain-data clone for the projection payload and never invokes the Penpot sandbox `structuredClone` host function.

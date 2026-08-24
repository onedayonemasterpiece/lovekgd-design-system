# Global Archetype SoT v1 — validation gate

The package is accepted as a reconstructed candidate only when all of the following remain true:

- production Astro source-page mapping is exactly 100%;
- production route-pattern mapping is exactly 100%;
- concrete generated/browser-observed route mapping is exactly 100%;
- every successful browser observation contains computed output;
- failed browser observations remain explicitly unresolved;
- semantic contracts contain no Penpot IDs, Penpot evidence, screenshots, pixel metrics or renderer deltas;
- speculative component merges are zero;
- existing Date and Weekend artifacts remain unchanged;
- regeneration is byte-for-byte deterministic.

The package is not promoted, canonical or production-authoritative by this gate. Owner review remains required before Penpot materialization.

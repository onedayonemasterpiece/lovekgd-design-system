# LoveKGD Runtime-Derived Design System 005

This delivery derives the Penpot engineering graph from the exact latest built `events-bot-new` runtime rather than from `/lab/design-system` or a manually curated component allowlist.

Pipeline:

1. build the exact current `events-bot-new` checkout;
2. inspect every generated HTML route;
3. cluster structurally equivalent pages into page archetypes;
4. render every structural cluster at mobile, tablet and two desktop viewports;
5. extract visible DOM boundaries, computed CSS, used assets, SVG/iconography and the recursive Astro import closure;
6. deduplicate runtime component signatures and map them back to candidate source files;
7. create native Penpot component masters, linked pattern/archetype instances, foundations and evidence pages;
8. keep accepted-production freshness separate from structural freshness.

The plugin exposes three update modes without per-page repetition:

- changed only;
- selected item plus dependencies;
- full rebuild and cleanup.

The old design-system lab is explicitly prohibited as an inventory source. The catalog records `oldDesignSystemUsedAsSource: false` and `manualComponentAllowlistUsed: false`, and publication fails when either contract changes.

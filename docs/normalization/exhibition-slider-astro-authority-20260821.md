# Exhibition image slider: Astro implementation authority

Date: 2026-08-21  
Decision status: owner approved  
Scope: `exhibition.row` → `media_deck.slider` only

## Decision

The image slider inside an exhibition card remains an Astro-authoritative
implementation. Penpot may document a linked static checkpoint for the deck,
but it is not the source for slider measurement, framing sequence, paging,
loading/error transitions, keyboard/focus behavior, ARIA state, or motion.

The reverse path `Penpot → SoT UI → Astro` must preserve the existing Astro
slider implementation and must not overwrite or simplify it from a static
Penpot representation. A future change to that protected region requires a new
explicit owner decision and passing Astro behavior evidence.

## What remains conformance-blocking

This is not an exception for the whole ExhibitionRow. The following remain
normal Astro ↔ SoT ↔ Penpot review requirements:

- ExhibitionRow outer geometry and responsive placement;
- the outer deck shell and visible static slot geometry;
- linked `event.media-frame` semantics for the visible checkpoint;
- title, location, medallion, social proof and action components;
- all states outside the exact slider exception scope.

Only findings whose exact region, state, component version and conformance
profile match the approved exception may be downgraded to `EXCEPTION`.
Card/body/outer-deck findings remain failures.

## Machine-readable bindings

- exception registry:
  `catalog/ui-conformance/exception-registry.v1.json`;
- component boundary and reverse-generation guard:
  `catalog/normalization/families/event-preview-representations/event-card-systemic-boundaries-candidate-v1.json`;
- protected Astro sources:
  `site/src/components/ExhibitionPrototypeRow.astro` and
  `site/src/components/ExhibitionsPersonalSurface.astro`;
- authority test:
  `events-bot-new/site/tests/exhibitions-deck-astro-authority.test.mjs`.

The fullscreen exhibition gallery is not made Penpot-authoritative by this
decision. It remains part of the Astro behavior that Penpot must not degrade.

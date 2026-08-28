# Hero-talk: accepted Astro donor and phrase-chain SoT

Status: `CURRENT_COMPLETE / PENPOT_PAUSED`

This record corrects the false reconstruction made during `OV-50`. The accepted
visual/runtime reference is the live noindex preview
[`preview-20260730-hero-talk-date-donor-r2`](https://kenigevents.ru/preview-20260730-hero-talk-date-donor-r2/),
backed by Astro commit `0eaf08c6827d5b2cbd4c2603380dd13a36be1ada`.
The source-faithful restoration is commit `4243401a4` in `events-bot-new#596`.

The earlier `7d026b30d` reconstruction is **rejected**. It incorrectly turned
Hero-talk into a rounded two-column event card with details, CTA and manual
previous/next controls. Its Penpot projection must not be retained as a
canonical component.

## Accepted AS-IS anatomy

- full-viewport-width stage, not a card;
- `360px` desktop height and `250px` at `390px` mobile;
- semantic phrase fragments with the linked accent inside the sentence;
- cursor at the actual end of the phrase;
- desktop media occupies `75vw` and is projected from one exact source image;
- default desktop grid is `16 × 5` (`80` visible tiles from `100` prepared);
- column gap is `3px`; row gap is `0`;
- tile opacity is deliberately sparse near the copy and stronger to the right;
- mobile hides the raster mosaic and keeps a useful text-only scene;
- scenes advance automatically every `7200ms`; there are no manual arrow
  controls, details panel or standalone CTA button.

The exact machine-readable geometry and runtime flags are in
[`accepted-donor-and-chains.v1.json`](../../catalog/ui-components/hero-talk/accepted-donor-and-chains.v1.json).

## Phrase-chain authority

The separate chain specimen requested by `OV-07` is not the Home archetype and
must not be embedded above or below the product hero. Its source is the
canonical research document at
`origin/agent/hero-talk-chain-research-20260803`, commit `52f3afe73`, especially
sections 6 and 7.

The Penpot chain page must show native text nodes connected by visible arrows.
Event-dependent images are optional and should be omitted for the first pass.
Required chains are:

1. return delta: greeting → new-event count → strongest changed topic →
   `Для меня`;
2. festival page-end: viewed programme item → remaining programme → programme
   CTA;
3. saved event: saved result → reminder option → notification settings;
4. club event: club identity → next meeting exists → club page;
5. cross-session continuation: previous festival programme → new lecture →
   view new;
6. feature discovery: natural-language child/weekend search;
7. first artifact: artifact exists → Weekend-page hint.

The literal node text is source-locked in the JSON contract. The chain page is
documentation UI only; it does not claim that the future compiler/thread state
is already released in Astro.

## Penpot resumption rule

The owner paused Penpot work and may close the window. On reconnection, the
first action is a read-only exact-ID readback. Do not replay unknown writes.

For the desktop mosaic, the owner explicitly allows one lightweight raster
overlay exception so the page does not become unusably heavy. The phrase and
cursor remain native. Mobile remains native text-only. This exception does not
change Astro: Astro must continue to generate and animate the real tile field.

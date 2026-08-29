# Event Detail Hero image motion and keyboard source contract v1

Status: `AS_IS_SOURCE_EXACT / OWNER_REREVIEW_REQUIRED`

This note records behavior that exists in the current Astro Event Detail. It is
not a visual proposal. The primary historical visual donor remains
`events-bot-new@008839b14598105d1fed5b4e386d6d6f29d93d1f`; the executable
evidence and source references below are from
`events-bot-new@49c351873d40a2ea55f0a32837c7376e344d9c17`.

## Terminology and boundary

- Event Detail owns a **Hero image** (also: main image / Hero picture).
- `HeroTalk` is the separate Home mosaic/text system. It is not an Event Detail
  name and must not be used for these states.
- The static Penpot frames show visual key states. Astro remains authoritative
  for motion, focus, keyboard routing, reduced-motion behavior and responsive
  activation.
- The proposed universal **Floating Island** belongs to a future wave. It is
  explicitly deferred until factual AS-IS recovery has passed owner rereview.

## Portrait-series state

The source fixture is `event.real.4783`, route
`/lab/event-desktop/examples/portrait-carousel-production/`. Browser evidence is
stored in
`evidence/recovery-20260828/astro/ov55-56-event-detail-browser-evidence.v1.json`.

Observed contract:

- desktop family: `split`;
- media policy: `non-ocr` / `visual_only` / `event_photo` / `classified`;
- render fit: `cover`, split fit: `viewport-cover`;
- a visible Hero image rail follows the large image;
- the efficient viewer is enabled and exposes seven selected images out of
  twelve sources; the evidence state shows two images, including a portrait;
- auto-rotation is disabled.

## Parallax contract

### Desktop

Source: `site/src/components/DesktopEventPage.astro`.

- Only media explicitly marked `data-desktop-parallax` participates.
- `prefers-reduced-motion: reduce` forces `--desktop-parallax-y: 0px`, removes
  the container transform and disables the CSS transform.
- For editorial `continuous` motion, travel is bounded by the stage/media
  geometry and equals `min(maxShift, stageTravel * 0.35)`.
- For the pinned path, internal image travel is bounded by available bleed and
  capped at `240px`; progress is clamped to the stage scroll range.
- Motion is scheduled through `requestAnimationFrame`; scroll/resize handlers
  only schedule work.

### Mobile

Source: `site/src/pages/sobytiya/[slug].astro` and
`site/src/layouts/EventLayout.astro`.

- The production Event Detail declares
  `data-mobile-parallax-profile="photo-continuous-crop"`.
- Only the declared photo-cover cinematic/parallax and poster-stage
  billboard/attached visual families participate.
- `prefers-reduced-motion: reduce` disables hydration.
- Photo travel is capped at `64px`; gap-safe poster travel is bounded to
  `36–48px`; continuous poster travel is bounded to `32–44px`.
- The accepted-v8 continuous profile uses the continuous progress calculation
  and writes CSS custom properties rather than changing document order.

## Keyboard contract

Sources:

- `site/src/lib/keyboardEventNavigation.mjs`;
- `site/src/components/KeyboardEventNavigationPrototype.astro`;
- production mount in `site/src/pages/sobytiya/[slug].astro`.

Activation and ownership:

- desktop only: media query `(min-width:1024px)`;
- lazy activation occurs only after an unmodified meaningful key is pressed on
  an owned Event Detail, gallery, related/personal-feed or footer surface;
- meaningful keys are `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`,
  `Enter`, `L`, `K`, `S`, `C`, `P`, `Home`, `End`;
- the rendered card geometry, not DOM order, defines card rows because the
  recommendation grid may visually reposition cards.

Actions:

- one `↓`: normal page scroll; rapid `↓↓`: related events;
- `↑` in the event surface: open gallery; `↓` in gallery: close and return;
- `←` / `→`: gallery images, or previous/next card in a selected visual row;
- row-aware `↑` / `↓`: move across related and personal-feed cards;
- `Enter`: primary action or open the selected card;
- `L`: like; `K`: calendar; `S`: copy title/link; `C`: copy full description;
  `P`: copy the event poster/card;
- `Home` / `End`: owned boundary navigation as implemented by the router.

The production mount uses the reviewed router without displaying the teaching
panel. The teaching copy remains an accessible source description; it is not a
license to add a visible invented panel to Penpot.

## Continuation order and inheritance

For `event.real.4671`, browser evidence proves the order
`transport → related events → footer`. Astro composes transport schedules before
the related section. The shell footer follows the page content.

Penpot must preserve linked ancestry:

- Kaup medallion artwork: `45777396-2f2a-80c0-8008-81916e721fe4`;
- related Event Detail viewport: `d87e18f1-dcb4-80a6-8008-8860d9a764a5`,
  whose nested grid owns linked EventCard instances;
- footer viewport: `d87e18f1-dcb4-80a6-8008-885914f2be1b`.

## Acceptance boundary

This contract and its Penpot materialization do **not** claim owner acceptance.
`processed: NO` remains in force until direct owner rereview.

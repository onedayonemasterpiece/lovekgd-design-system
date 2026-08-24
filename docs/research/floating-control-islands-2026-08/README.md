# Floating control islands / detached chrome

> **Status: `exploration input`.** This pack records source-informed service/control UI patterns from six supplied mobile screenshots. It is **not** an accepted component family, token decision, canonical Penpot component, or authorization to replace the current header or bottom navigation.

This is an anonymized reference pack for mobile application chrome that can detach from viewport edges and form role-owned surfaces: icon islands, context capsules, utility clusters, composers, navigation docks, transient utilities and persistent state docks.

![Source-informed six-screen reference board](assets/reference-board.svg)

![Pattern anatomy and validation gates](assets/anatomy.svg)

## Source and fidelity

| Field | Result |
|---|---|
| Telegram source | `https://t.me/c/4337049383/1162` |
| eventsBot MCP | Message metadata was read; media-byte materialization did not work |
| Actual visual input | 6 images supplied directly by the owner in the current conversation |
| Dimensions | Each direct attachment is `921×2048` |
| Visual review | All 6 direct attachments were visually reviewed |
| Fidelity | `source-informed anonymized skeletons` |
| Raw screenshots in Git | **Not committed** because they contain names, messages, avatars, imagery and third-party branded content |
| Machine-readable analysis | [`screen-observations.json`](screen-observations.json) |
| Provenance | [`source-manifest.json`](source-manifest.json) |

The earlier limitation “source pixels were not obtained” is removed for the design analysis because the six screenshots were supplied directly and reviewed. The MCP media-materialization failure remains a separate infrastructure issue and is not investigated in this pack.

The historical Telegram message metadata reported two media items for that album. That value is not the count of the six direct conversation attachments; the two sources are recorded separately in the manifest.

## Working terminology

There is no single standardized name that covers every observed screen. The working vocabulary is:

- **detached chrome / floating chrome** — application chrome that is visually detached from a viewport edge or content boundary;
- **floating control islands** — a composition in which controls are split into role-owned surfaces rather than one monolithic bar;
- **floating top app bar / clustered top app bar** — leading, center/context and trailing/utility regions arranged as separate or clustered surfaces;
- **context capsule / mode capsule** — a compact center surface for scope, mode or page identity;
- **utility island / utility cluster** — one surface for related service actions;
- **floating composer** — an inset task-input surface raised above the system edge;
- **floating navigation dock** — a detached but semantically unified destination-navigation surface;
- **transient floating utility / FAB** — an independently appearing action such as scroll recovery or creation;
- **persistent mini-player / now-playing dock** — a state-and-action surface that remains available across screens.

`Pill` and `capsule` describe geometry, not component identity. `Chip` is appropriate only for compact filter, select, suggestion or input controls. A whole header, composer or navigation dock should not be called a chip.

## Six reviewed screens

| ID | Screen type | Pattern label | Observed service/control regions |
|---|---|---|---|
| A | Kimi home | `detached_top_islands` | leading menu island; centered mode/context capsule; trailing mute/audio island; quick-action chip row; large inset floating composer |
| B | Kimi reading | `floating_composer_with_transient_scroll_utility` | same detached top composition; trailing utility capsule; content-heavy reading surface; transient scroll-to-bottom utility; floating composer |
| C | Telegram chat list | `monolithic_header_filter_dock_fab_navigation` | relatively monolithic header zone; separate segmented/filter dock; context banner; FAB; floating bottom navigation dock |
| D | Telegram conversation | `clustered_conversation_app_bar` | back island; identity/context capsule; grouped utility capsule; pinned context banner; bottom composer |
| E | media player | `immersive_media_control_islands` | centered title/mode pill; edge utilities; playback control islands; content-first immersive canvas; bottom destinations without a mandatory common substrate |
| F | media library | `persistent_mini_player_navigation_stack` | content-header actions; persistent mini-player/now-playing dock; separate bottom navigation model |

Screen C is an important counterexample: rounded UI does not imply that every service region must be broken into islands. Its header remains comparatively unified while filters, context, FAB and navigation are separate layers.

## Source-informed findings

1. **Leading, center context and trailing utility may have different semantic owners.** Their lifecycle, state and accessibility rules should not be merged merely because the surfaces share a radius.
2. **The content canvas does not have to begin below a full monolithic app bar.** Detached chrome may overlay a content-first canvas.
3. **Related actions stay grouped.** Call + overflow, playback controls or other utility actions should not be split into unrelated pills when they form one semantic cluster.
4. **Composer, navigation dock and mini-player stack are different compositions.** They have different tasks, state models and runtime behavior.
5. **Transient utilities can appear above content flow.** Scroll recovery and FAB controls may show or hide independently of the main layout.
6. **Persistent state can form a separate dock.** A now-playing surface may remain available without becoming part of destination navigation.
7. **Bottom navigation can remain one navigation model without a visible common substrate.** Borderless destinations are still semantically grouped.
8. **A visually identical radius does not prove common component identity.** Shared geometry is weaker evidence than state, semantics, accessibility and runtime behavior.

## LoveKGD implications

| Semantic slot / primitive | Responsibility | Disposition |
|---|---|---|
| `top-leading-context` | back, menu, close or scope entry | `unresolved` |
| `top-center-context` | mode, page identity or scope summary | `unresolved` |
| `top-trailing-utility` | search, share, call, overflow or mute | `unresolved` |
| `context-banner` | pinned or persistent page context | `unresolved` |
| `quick-action-chip-row` | compact suggestions, filters or shortcuts | `unresolved` |
| `floating-composer` | task input plus attachments/voice | `unresolved` |
| `floating-scroll-utility` | transient recovery or navigation action | `unresolved` |
| `bottom-destination-navigation` | core destinations | `unresolved` |
| `persistent-state-dock` | mini-player or other cross-screen state | `unresolved` |
| `control-surface-material` | background, border, elevation, blur and contrast | `unresolved` |
| `floating-chrome-anchor` | safe area, viewport inset, keyboard and scroll anchoring | unconfirmed `runtime_only candidate`; no accepted contract |
| `content-occlusion-compensation` | last-item inset and reachability under floating chrome | unconfirmed `runtime_only candidate`; no accepted contract |

Nothing is marked `reuse_existing` or `new_component`. Production registry and archetype-contract mapping must happen first.

## Do not make one universal pill component

Similar capsule geometry must be separated into four layers:

1. **Surface primitive** — material, radius, border, elevation and contrast.
2. **Composition** — top app bar, composer, navigation dock or mini-player dock.
3. **Control semantics** — icon button, segmented control, chip, text input or destination item.
4. **Runtime/layout behavior** — safe-area anchoring, keyboard avoidance, scroll compaction, occlusion and show/hide rules.

A shared primitive is possible only where material, states, accessibility and underlay requirements match. Composition identity must not be inferred from rounded geometry alone.

## Validation gates before any adoption

The pattern must be tested against:

- plain, photo, poster and saturated underlays;
- expanded, compact and scrolled states;
- keyboard open and closed;
- safe areas and system-navigation insets;
- narrow viewport and landscape;
- content occlusion and last-item reachability;
- reduced motion and high contrast.

## Adoption gate

Until production family mapping and runtime validation are complete, do not:

- transfer skeleton geometry into tokens;
- accept sizes, blur, elevation or spacing from these drawings;
- replace existing header or bottom-navigation artifacts;
- accept new component families from this pack;
- perform speculative merges based on capsule geometry;
- materialize canonical Penpot components.

Permitted use now: owner review, archetype exploration, comparison with current Astro output and preparation of the fixture/state matrix.

## Early exploratory variants

These earlier abstract variants are retained as non-source-faithful exploration only. They are not traces of the six screenshots and are not contracts:

- [Distributed control islands](assets/variant-a-distributed.svg)
- [Split dock + context island](assets/variant-b-split-dock.svg)

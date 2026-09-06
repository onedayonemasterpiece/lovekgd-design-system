# Home — executable owner-review profile

Canonical route specialization: [`home.owner-review.v1`](../../contracts/page-profiles/home.owner-review.v1.json).
Global requirements stay in the active [conformance contract](../product-governance/astro-sot-penpot-conformance.md)
and its repository lock. This document describes the Home-only implementation/export seam,
not another requirements system or a new native materializer.

## Owner correction and boundaries — 2026-09-06

**БЫЛО → БУДЕТ:** inline text/voice capture после Hero и header в потоке → Hero
начинается у верхней границы viewport без header gap; Home не содержит поля ввода.
Порядок контента: **Hero → quick links → feed → PageEnd**. Отдельная плавающая иконка
HomeSearchEntry v2 / `floating-link` ведёт на существующий `/poisk/`; это не блок
контентного порядка. Capture runtime на Home не монтируется.
**ЗАЧЕМ:** сохранить чистую первую сцену и один существующий Search для ввода/ответов.
**ПОСЛЕДСТВИЯ:** `home-navigation-only` сохраняет общую верхнюю desktop-навигацию,
существующее мобильное Reference4 и нижний четырёхпунктовый остров. Header не занимает
место в потоке. `topParticipants:false` относится только к contextual title/city/H2
islands, не к общей навигации. Старый `inline-capture` остаётся compatibility variant,
но не вызывается Home. Nonhome shell, Weekend и shared grid/media/actions/icons неизменны.
PageEnd may be absent only with a recorded suppression reason.
**ТИП:** явное owner override composition/search entry и последующая voice-review
коррекция Hero v3 / animated PageEnd v2, не произвольный новый redesign,
production promotion или native certification.
**СОГЛАСОВАНО:** последнее прямое уточнение владельца в текущей задаче, 2026-09-06;
оно заменяет прежнее требование inline capture и flow header на главной.

## Family migration / Astro registry handoff

| Family | Version | Canonical Astro root |
|---|---:|---|
| EventLayout | 3 | `site/src/layouts/EventLayout.astro` |
| HomePage | 2 | `site/src/pages/index.astro` |
| HomeHeroTalk | 3 | `site/src/components/HomeHeroTalk.astro` |
| HomeSearchEntry | 2 | `site/src/components/HomeSearchEntry.astro` |
| HomeQuickNav | 2 | `site/src/components/HomeQuickNav.astro` |
| HomeColdStartFeed | 2 | `site/src/components/HomeColdStartFeed.astro` |
| HeroTalkPageEnd | 2 | `site/src/components/HeroTalkPageEnd.astro` |

Current voice-review source was read at Astro commit
`05c529046b4284fe8985472e4f49ec8d8d7916bc`, matching the remote Home assembly branch.
This is an inspection checkpoint, not a visual acceptance or frozen future export SHA.

HomeHeroTalk **v3** retains shared editorial/fallback ownership with owner-authorized
190 ms word stepping and enabled mobile media. It is used for both intro and PageEnd;
mobile asset suitability, finite-state motion and reduced-motion behavior still require
real rendered replay, not a source hash or profile field alone.

HomeQuickNav v2 is `rectangular-grid/populated`, reusing shared secondary Buttons.
HeroTalkPageEnd **v2** supports `animated-scenes` with nested shared HomeHeroTalk and
compatibility `compact-service`; Home uses the animated deck, selected separately from
upper Hero events. Its nested Hero must not be counted as a fifth page-content block.
The validator rejects overlap in captured editorial scene IDs; actual event-family
selection/deduplication remains source/fixture/browser evidence, not inferred semantic
identity from an editorial ID. Empty eligible decks can use the existing generic fallback.

All roots, version markers, style owners and source hashes come from the **exact
integrated Astro registry at the captured commit**. Preserve every existing
`penpot_binding`; null/unresolved bindings are not native readiness. Registry/catalog
updates and consumer tests belong to Astro integration. Do not copy card geometry,
MediaFrame crops, icon SVGs or global tokens into this profile.

HomeSearchEntry v2 on Home is an accessible icon link (`floating-link/ready`) with
the shared `mobileDiscoveryHref('/poisk/', {searchBase}, BASE_PATH)` destination resolver.
Its icon is the existing approved ConversationalSearch microphone, not a new drawing.
It has no inline textarea, recording controls or
`data-home-search-entry` mount target. Compatibility capture/store/handoff remains
owned by the existing Search implementation; this profile neither removes it nor
claims live Home capture. PageEnd uses `heroTalkPlacement.ts` and its shared
`homeSearchCapability.ts` gate; those active dependencies, `mobileDiscoveryRoutes.ts`
and the shared `homeHeroTalk.ts` deck builder remain source-bound.

## Structural export API

Canonical validator: [`scripts/validate-home-profile-v1.mjs`](../../scripts/validate-home-profile-v1.mjs).
No dependencies or installation:

```sh
node scripts/validate-home-profile-v1.mjs
node --test tests/home-profile-v1.test.mjs
```

The CLI validates the profile only. Actual capture calls:

```js
import { assertHomeStructuralProjection } from './scripts/validate-home-profile-v1.mjs';
const result = assertHomeStructuralProjection(record, {
  expectedSha: exactIntegratedAstroCommit,
  expectedEventIds: frozenFixtureRenderedEventIds,
  repoRoot: astroGitCheckout,
  expectedSearchBase: approvedBuildSearchBase, // optional; absent = local prefix only
  // profilePath optional; defaults to this DS checkout's canonical profile.
});
```

Schema `current_ui_home_structural_projection_v1` reuses the existing Free structural
capture's measured node, source binding, token and asset representation, **not its
geometry or five-event corpus**. Required Home fields:

```text
schema, route: '/', profile_id: 'home.owner-review.v1', fixture_state
viewport: {width, height, dpr}
provenance: {repo_sha, manifest, manifest_sha256, registry_path, registry_sha256,
             profile_sha256, snapshot:{id,sha256}, reference_clock}
source_bindings: [{id,version,path,sha256,styles:[{path,sha256}],penpot_binding?}]
behavior_bindings: [{path,sha256}]
composition: ['HomeHeroTalk','HomeQuickNav','HomeColdStartFeed','HeroTalkPageEnd']
shell: {policy:'home-navigation-only',top_participant_count:0,global_navigation:true,header_in_flow:false,lower_island_count:1,home_chat_count:0}
page_end: {state:'shown',reason:null} | {state:'suppressed',reason:nonemptyReason}
feed: {budget:30,candidate_pool_count,mode:'general'|'personal'|'empty',stable_visible_prefix:true}
event_ids: all rendered feed IDs in exact order, zero to thirty
assets, tokens, tree
```

- `profile_sha256` hashes raw canonical profile bytes, not reserialized JSON.
- `manifest.repo_sha` must equal the expected exact commit; registry/root/style and
  required behavior hashes are verified against `git show SHA:path`, never HEAD/WIP.
  Capture owns HTTP manifest readback and snapshot/asset provenance; a digest's syntax
  alone cannot establish the truth of the upstream data.
- Bind all seven profile families, including suppressed PageEnd, plus every
  `shared_owners` entry. Behavior hashes cover `route_policy.source`,
  `behavior_sources`. There is no active Home `capture_handoff` contract in profile 2.0.0.
- Root tree is the actual EventLayout body, not only HomePage: bottom navigation and
  forbidden mounted contextual participants must remain observable. The root
  `data-shell-composition` must equal `home-navigation-only`. `identity`,
  `containing_family`, `anatomy_path`, `parent_id`, actual text/SVG/image bytes,
  computed styles and bounds follow the existing capture. Stable IDs use
  `home.` + SHA256(JSON.stringify(anatomy_path)).slice(0,24).
- Global navigation is not a contextual participant. Both existing `.site-nav`
  and `[data-reference4-fullscreen]` roots must remain mounted; desktop (>=760px)
  requires nonzero/displayed `.site-nav`, mobile requires the displayed Reference4
  root. Its exact `Reference4MobileMenu` source binding is mandatory. These structural
  checks do not replace actual keyboard/menu interaction and visual overlap checks.
- Exactly one `[data-home-search-launcher]` is an anchor with HomeSearchEntry v2,
  variant `floating-link`, state `ready`, accessible name, floating positioning and
  a `/poisk/` href using the approved configured search base, otherwise the body's
  `data-site-base-path`. `expectedSearchBase` must come from the trusted build/review
  configuration, never be copied from the link being validated; explicit HTTPS and
  path bases are supported, credentials/query/fragment/protocol-relative bases rejected.
  The recorded destination alone cannot approve a redirect. A source-bound SVG with
  the existing microphone class is required. The launcher is excluded
  from content order; an inline capture mount target/textarea fails validation.
- Return to scrollY=0 after loading media: the Hero's measured top must be within
  one CSS pixel of zero. `.site-header` must be out of flow (absolute/fixed) or
  zero-height. Metadata cannot excuse an actual header gap.
- Bottom nav retains its existing `data-mobile-bottom-nav` marker. No same-version
  binding change is required solely to make an existing source owner visible.
- Loaded card media needs measured natural dimensions and a matching asset hash;
  fallback/broken media needs shared fallback anatomy. Pending lazy images must be
  settled by scrolling/loading the finite feed before capture, not omitted.
- Composition walks stop at a top-level content family. For `animated-scenes`, PageEnd
  must contain exactly one nested shared Hero with non-overlapping editorial IDs;
  `compact-service` must not contain one. Parent links and hashes still include the
  full nested tree, its text/assets/styles, rather than skipping the new placement.
- Suppressed PageEnd is absent from both actual tree and `composition`; its source
  family binding is still required. Absence without a reason is invalid.

## Evidence boundary

A successful profile/synthetic test is **not** a measured export. A successful export
returns `STRUCTURAL_EXPORT_VALIDATED_NOT_PENPOT_ROUND_TRIP`, `visual_acceptance:false`
and `penpot_round_trip:false`; it does not certify semantic facts, native components,
listener disposal, live voice, personalization quality or browser interactions.

Parent integration supplies the exact Astro/DS commit pair, real authorized Home
snapshot/hash/clock, ordered IDs/assets, all required profile viewports and state
coverage, and actual rendered capture. Visual/computed/action and actual Search-link navigation tests remain
necessary. Export inventory without that evidence must not be called structural-ready.
No new Penpot file/mutation/full materialization, paid model probe, build, preview publication
or deployment is authorized by this DS lane.

## Change record

- 2026-09-06: Add Home route profile, exact-source structural validator and adversarial
  tests; specialize launch contract 1.11.0 → 1.12.0 from the assigned DS base. Historical
  preview/native claims and global conformance 1.2.0 remain unchanged.

- 2026-09-06 owner clarification: profile 1.0.0 → 1.1.0 and launch 1.12.0 → 1.12.1;
  preserve shared desktop/Reference4 navigation, reject contextual islands only.
  Earlier `home-lower-only` exports do not satisfy the revised profile hash/policy.

- 2026-09-06 latest owner override: profile 2.0.0, HomeSearchEntry v2 floating-link,
  four-block content order and Hero at viewport top without header flow gap. Launch
  specialization advances to 1.13.0; old inline capture exports are superseded.

- 2026-09-06 voice-review source synchronization: profile 2.1.0 / launch 1.14.0;
  Hero v3 (190 ms words/mobile media), PageEnd v2 animated shared Hero with separate
  deck, rectangular QuickNav and microphone link through explicitly approved Search base.
  Structural/adversarial tests are not motion, mobile visual or production acceptance.

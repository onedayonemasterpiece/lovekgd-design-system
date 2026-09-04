# Owner audio review — 2026-09-05

Status: **REOPENED_AFTER_OWNER_AUDIO_REVIEW**. This is the finite correction of the rejected review candidate, not a new normalization programme. Runtime delivery state belongs to [STATUS.md](STATUS.md); the governing stage is [launch-normalized-ui.v1.yaml](../../contracts/launch-normalized-ui.v1.yaml), under [ASP conformance](../product-governance/astro-sot-penpot-conformance.md).

## Basis and evidence boundary

Reviewed source: `events-bot-new@8b1bb81298bfca2fe2aaa3ceb7e5f654748b301f`.
Owner-reviewed build: `preview-real-8b1bb8129-normalized-20260904-v1`.
Prior completion claim: [issue #621 comment 5546939304](https://github.com/onedayonemasterpiece/events-bot-new/issues/621#issuecomment-5546939304).

All three original transcripts, rather than their generated summaries, were read at `idea-hub@c4a234cbd6031ac03562793e02553f01d0e4330d`:

- V1: [voice-20260905-000922-74b5720b](https://github.com/onedayonemasterpiece/idea-hub/blob/c4a234cbd6031ac03562793e02553f01d0e4330d/inbox/voice/2026/09/voice-20260905-000922-74b5720b.md).
- V2: [voice-20260905-002114-a0677098](https://github.com/onedayonemasterpiece/idea-hub/blob/c4a234cbd6031ac03562793e02553f01d0e4330d/inbox/voice/2026/09/voice-20260905-002114-a0677098.md).
- V3: [voice-20260905-003237-8a342775](https://github.com/onedayonemasterpiece/idea-hub/blob/c4a234cbd6031ac03562793e02553f01d0e4330d/inbox/voice/2026/09/voice-20260905-003237-8a342775.md).

The owner additionally authorizes schematic Floating Island structure/behaviour; its final visual design is deferred for separate generative exploration. The owner is not required to diagnose component boundaries.

This audit personally inspected Git source, existing contracts and the completion evidence description. It also executed isolated Node regressions for the actual packing/media module. **It did not personally reopen the published candidate in a working browser**: the installed browser bridge was not exposed as a callable namespace, and public fetch/container network attempts did not retrieve the preview. The previous reviewer's local screenshots were not retrieved. Source-derived explanations below are not fabricated computed-style observations.

The reported 172 tests, 68 route checks and 18-archetype independent review remain historical evidence of their stated scope. They do not override owner rejection or prove the absence of cross-route role drift, internal scrollers, organic-feed defects or Full-HD problems. Factory injection of event 7920 is not organic personalized-feed coverage. Five free-collection projection specimens are not exhaustive page-state acceptance. Hash-correct SoT can faithfully describe an unnormalized product.

## Approved correction and interpretation boundary

**БЫЛО:** the finite stage was labelled complete; the shared grid explicitly stretched its remainder; an OCR crop-area ceiling could authorize centred cropping without text-location evidence.

**БУДЕТ:** completion is reopened; same-role appearance is checked across product consumers; the normal grid retains regular column width in the incomplete row; layout does not remove admitted events; OCR cropping requires both the existing total 20% ceiling and preservation of important text, otherwise contain. Floating Island is a schematic behavioural implementation in the existing shell.

**ЗАЧЕМ:** remove observed drift and regressions without asking the owner to reverse-engineer components, redesigning the product or losing content to a layout optimizer.

**ПОСЛЕДСТВИЯ:** update affected canonical roots, runtime consumers, existing SoT identities and negative tests together. Current source-bound projection must be regenerated only after the corrected candidate is accepted. Full native Penpot remains deferred; no A=S=P or production release follows automatically.

**ТИП:** bounded owner-review stage amendment. **СОГЛАСОВАНО:** explicit owner voice review and follow-up request on 2026-09-05. Tentative ideas and withdrawn complaints below are not approvals. Typography consistency/restoring accepted Hero Talk are regression closure; changing remainder behaviour and keyboard section traversal are explicit owner deltas, not defects inferred merely from old source.

## Correction register

### AR-01 — Shared heading roles, not per-route token names (V2; mandatory)

**Confirmed source:** `surface-foundations.css` preserves unrelated home/unusual/collection display scales; `route-theme-foundations.css` has a separate festival heading scale. `ExhibitionsPersonalSurface.astro` still owns `.ex-intro h1` with `clamp(3rem,7vw,6.8rem)`, line-height `.83`, tracking `-.07em`. Moving values into route-named tokens did not establish role equality. `ListingPageHeader.astro` is another actual heading consumer.

**Correction:** map comparable section-page headings to one existing semantic typography owner and migrate consumers, removing their competing declarations. Preserve explicitly justified roles such as long event titles and the accepted editorial Hero Talk; do not flatten every h1 indiscriminately or legalize every difference as a named variant. Include label/update metadata and vertical spacing.

**Acceptance:** compare the same role at the same viewport across Today/Tomorrow/Date/Weekend, Exhibitions, Festivals, Popular, Unusual, Collections and Clubs. Record computed family/size/weight/line-height/tracking/margins. Expected relationships must come from the approved role contract, not be learned from the same defective snapshot. Negative control: one consumer reintroducing its private heading size fails.

### AR-02 — Restore the accepted Hero Talk instead of its static namesake (V2; mandatory)

**Confirmed source:** current `HomeHeroTalk.astro` accepts one `event` and renders a static editorial card. The actual donor exists at `events-bot-new@4243401a4`, in `site/src/components/HomeHeroTalk.astro` and `site/src/lib/homeHeroTalk.ts`: scenes, text fragments, photo-mosaic and text-only modes, animation/cursor and event links. Historical owner-selected reference is `https://kenigevents.ru/preview-20260730-hero-talk-date-donor-r2/`. This is not `PrelaunchPage.astro`, which is a separate launch/signup page.

**Critical data constraint:** the donor deck requires current events matching exact editorial event IDs in `homeHeroTalkEditorial.ts`. Blindly copying it onto the September slice can produce no scenes. Recover the actual editorial chains and generation/binding path; do not revive expired events or invent event-specific phrases. Resolve missing current bindings explicitly. Preserve historically accepted mobile text-only behaviour unless a later owner decision changes it.

**Acceptance:** real current scene(s), meaningful fragment links, an observed complete cycle, photo/text variants when eligible, no-JS and reduced-motion fallbacks; no static replacement silently presented as the restored feature.

### AR-03 — Brand navigation must lead to product Home (V2; mandatory)

**Confirmed source:** `siteHomeHref()` in `site/src/lib/events.ts` returns `/__preview/` for preview mode. A link can pass HTTP-200 and same-prefix checks while taking the user to the wrong destination.

**Correction:** separate product-home navigation from review-hub navigation centrally; inspect actual brand, breadcrumbs, mobile navigation and PWA consumers. Preserve the immutable preview prefix and production/secret-candidate semantics. Keep the hub available as a service entry, not the brand's home.

**Acceptance:** activate the brand from multiple product routes and verify product Home and its Hero Talk, not just an existing URL.

### AR-04 — Card count, regular-width remainder and Full-HD density (V1,V3; mandatory)

**Confirmed source:** `AdaptiveEventCardGrid.astro` declares `remainder-policy="stretch"`, `stretch-N-of-M` states in server and runtime paths, and `flex-grow:1`. The singleton taking a whole row follows this policy. `packRelatedCardRows()` can also reduce selected card count when OCR ratios cannot share an intrinsic-ratio partition.

**Personally reproduced:** three eligible synthetic documents with ratios 1,1,1.2 and rowSize=3 become IDs 1,2 on the unchanged module. A mixed four-item case also loses admitted items. This proves a module defect; the precise cause of two cards on the live event 5370 still needs its actual payload/DOM trace.

**Correction:** the caller owns eligibility/limit; layout must retain the admitted set. Use safe contained frames when no full intrinsic partition exists. A partial row retains regular column width, including after hydration/filtering/reaction; update the public remainder vocabulary, registry and CSS/runtime together. Preserve ranking where order matters. Geometry reordering is allowed only in the applicable recommendation composition, never automatically in chronological listings.

**Acceptance:** counts 1,2,3,4,5,7,10 and the owner-reported 24-item free collection; complete rows of three where the desktop composition calls for three; equal media/card tracks per row, no disappearing IDs, no huge singleton, consistent DOM/keyboard order. Check 1920×1080 as well as 1440×900 and mobile. The suggested 10–20% reduction is a density target to test, not permission to apply `transform:scale()` or make text unreadable.

### AR-05 — OCR/media framing and medallions (V1,V2,V3; mandatory safeguards)

**Confirmed source:** `resolveRelatedCardMediaTreatment()` permits centred `cover` on classified OCR media solely from measured aspect ratio and a ≤20% area crop. It does not locate text. The `imageCrop.mjs` protected-photo resolver is not OCR text-region proof.

**Correction:** retain total crop ceiling 20%, not 20% per edge. Preserve main text; a headline near the top cannot be removed by symmetric centring. Without current source-bound text-safe evidence use contain. This conservative fallback is the bounded code candidate, not a claim that text-aware cropping has been implemented. Verify loaded/no-source/broken/unknown states and actual wide/tall assets.

Medallion placement is semantic: preserve the Tretyakov mark's intended edge overlap on event 5370 where supported by the accepted component; do not substitute its asset. Placing marks over poster content is conditional on a proven safe region. The owner's suggestion about unused image space is not blanket permission to cover text.

### AR-06 — One useful visible calendar/share label (V2; mandatory)

**Confirmed source:** `DesktopEventActionPanel.astro` renders share as icon+count; compact calendar rules hide its label. Both controls can therefore become icon-only. aria-label/title does not satisfy the visible-label requirement.

**Correction:** enforce a group-level invariant: calendar OR share retains readable visible text at every supported panel width. Which one is labelled may change; wrap/stack when necessary. Preserve existing hooks and CalendarLink behaviour; do not repeat broad specificity/passthrough regressions.

**Acceptance:** event 5370 plus long titles/admission labels and both primary-action modes; wide/compact panels, resize and keyboard focus, 44px targets, no clipping.

### AR-07 — Stable initial render on Today (V1; mandatory investigation and fix)

The owner observes three loading/rearrangement phases. Their exact cause is not established by source excerpts. Trace initial HTML, font/media readiness, hydration, local consent/profile and actual network updates. Reserve required geometry and avoid redundant rerender/reordering; do not disable personalization or all JavaScript. Capture a short reload sequence/trace and compare cold, warm and existing-local-profile states.

### AR-08 — New-exhibition badge across the shared shell (V2; mandatory)

`pages/vystavki/index.astro` computes an optional header badge and supplies it to `EventLayout`; this establishes route-local input, not a shared global new/seen count. Inspect later runtime updates before attributing every symptom to that alone. Use one authoritative projection and local seen-state meaning across Weekend, Festivals and Exhibitions. Verify transitions between routes and after marking seen; do not copy an arbitrary fixed count.

### AR-09 — Festival period and truthful freshness label (V2; mandatory)

**Confirmed source:** the festival page hardcodes July–December in the eyebrow and facts while month sections derive from actual data. `lastReviewed` is derived from `festivalProjection.generated_at`, then labelled `Проверено`. Build/export time is not independent source verification.

Derive the displayed coverage from the actual dataset/declared programme interval. Use `Обновлено` for generation time, or a genuinely sourced review timestamp for `Проверено`; do not mislabel one as the other. Reconcile the September–December observation against the exact published projection, not an unrelated Git fixture.

### AR-10 — Consistent reactions without fabricated social proof (V2; mandatory)

Festival UI explicitly describes a local bookmark keyed by festival edition; event likes use event identity and counts. Club cards have their own entity semantics. Share the existing reaction/action visual family and state vocabulary through entity adapters, not by routing every heart to event ID APIs. Unknown public count is not zero. Preserve local-only meaning unless actual backend support proves otherwise. Verify visible count/state, toggling and consistent dimensions where the same role applies.

### AR-11 — Vertical keyboard journey (V3; approved behaviour delta)

The production `KeyboardEventNavigation.astro` imports `KeyboardEventNavigationPrototype.astro`; its documented previous rule is native single Down / double Down to cards. The user now wants a coherent sequence through the main event content, practical summary and recommendations, while horizontal navigation already works.

Update the existing router's section/focus traversal deliberately, with context guards. Preserve text inputs, modifier keys, dialog/gallery handling and native scrolling where the router does not own interaction. Do not globally steal ArrowDown. Compare visual, DOM and keyboard order after grid changes. The production-imported Prototype file is not excluded as a laboratory; it also contains global reaction/calendar styles that must be considered in action ownership.

### AR-12 — Schematic Floating Island, existing shell (V2 + current request)

Implement only the accepted structural/interaction purpose: compact persistent navigation/context, current section/date/category as applicable, and accessible entry to necessary controls. Allow event media to reach its intended top composition instead of retaining a large redundant header. Reuse the actual shell/navigation/action owners and state, rather than adding a second independent shell or rebuilding lists on scroll.

The schematic must not overlap required content/CTA, trap focus or introduce internal page scrollers; account for safe-area, mobile bottom navigation, layering and open/closed states. Final shape, palette, effects and generative styling are explicitly deferred. Defer only the skin, not navigation correctness. Do not add drag/resize or other unrequested features.

### AR-13 — Preserve distinct collection/club compositions (V2,V3; mandatory)

Keep editorial/text collections distinct from event-list collections. A real `подборка готовится` state needs a data/publishing explanation, not automatic normalization of an empty placeholder. Club cards can retain their justified composition while headings, update labels and reactions use shared roles. Do not force every collection, exhibition row and club into EventCard merely to simplify a registry.

### AR-14 — Bounded factual/data diagnostics (V1,V2,V3; investigate before deciding)

Trace the exact published snapshot/export inputs for: missing images; the surprising railway-gates expedition item; the 18:00 map-reading item; 19:09 vs 19:00; only two available weekends; Unusual pending state; exhibition `other dates`. Distinguish bad source facts, export/slice coverage, occurrence-family logic, media availability and UI presentation. Slice300 is a hypothesis, not a universal explanation. Do not round times, delete events, change recurrence or activate collections merely to make screenshots attractive. Close each item with the demonstrated cause and safe scoped correction, or an explicit unresolved data requirement. No speculative production DB writes.

### AR-15 — Withdrawn and undecided observations (not implementation tasks)

The owner withdrew the missing-gallery-thumbnails complaint after finding them. Preserve/check the existing gallery, do not build another one. The search suggestion leading to a collection vs prefilling search was an open product question, not a confirmed request to change semantics or trigger search. V1 ends on pressing `неинтересно` without describing its outcome; do not invent a reaction failure. The disabled artifact collection remains governed by its existing flag; no activation is authorized here.

## Why the previous acceptance missed this

1. Route existence and document overflow are not correctness of destinations, nested scroll regions, relative heading roles or multi-phase loading.
2. A source/hash-complete registry is not a proof of single effective CSS ownership. Transitive imported styles and higher-specificity state rules can remain competing owners.
3. A factory probe verifies construction, not real feed population/packing/seen state; page-count coverage does not measure state/interaction coverage.
4. Initial screenshots/contact sheets alone do not cover long scrolling, Full-HD geometry, resize, loading chronology and keyboard journeys. The old report does not establish all these checks; its raw local evidence was not available to this auditor.
5. The criteria must assert independent product relationships, not accept every captured value as its own baseline. Add negative controls that genuinely detect the reported defect before accepting a fix.

## Bounded implementation and acceptance sequence

First correct shared heading roles, grid retention/remainder/density, media safety and action groups. Then integrate shell/navigation/badge/loading corrections and restore the actual Hero Talk dependency closure. Resolve the bounded data questions in parallel without speculative content changes. Implement the Floating Island behaviour schematically and retain distinct archetypes. Do not wait for its final visual design.

Use the existing source registry, generators, checker, browser harness and Kaggle build path. Ordinary code/docs/source review may be done directly in ChatGPT+GitHub. The scarce coding agent handles actual runtime integration, existing suites, full-source graph regeneration and publication. It may issue a self-contained bounded prompt to an external ChatGPT window, with exact refs, non-overlapping writable paths, questions, acceptance and return location in #621; it must not claim that window has started until confirmed or repeat its active work. No new roles/process engine are needed.

Required final evidence: same-snapshot/clock before–after for repaired cases; 1440×900, 1920×1080 and 390×844 plus actual affected seams; internal overflow, heading-role comparisons, real static AND organically hydrated lists, cardinality/partial rows, first-paint sequence, labels, keyboard and navigation checks. Preserve existing safe no-source/broken/empty states. Intercept remote writes where appropriate and label such evidence accurately. Full published successor uses the existing Kaggle review kernel and immutable prefix; source SHA must match manifest. A source-only patch or local diagnostic is not this final result.

Each mandatory AR item needs evidence on the final candidate; investigations need a factual disposition, and only AR-15 / the Floating Island skin are explicitly deferred here. A broad `PASS` cannot coexist with a known unresolved owner-visible normalization defect. Do not declare native Penpot or A=S=P without actually testing them.

## Isolated code experiment — scope, not delivery claim

A correction branch in events-bot-new, `work/owner-audioreview-card-geometry-20260905`, is reserved for the bounded AR-04/AR-05 code candidate. Its current delivered files/checks and remaining integration requirements are recorded in #621/STATUS, not implied by this audit document.

The experiment uses the exact original `relatedCardLayout.mjs` Git blob `1088e47f5e82062b4f7140b60ead6eb1b5ee898f` and `imageCrop.mjs` blob `5f02e51518859e2ea222770462f3c4a669a7f489`. Synthetic geometry is injected through the existing function option; the local imported override catalogue is an empty unused test dependency, not the production catalogue. Seven focused tests give 3 failures/4 passes on the original and 7 passes on the candidate. This does not certify the full repository, CSS layout, original test suite, generated graphs, actual event 5370, browser behaviour or deployment. The candidate contains content-preserving fallback rows and fail-closed unlocated OCR text; it does not implement regular-width CSS, final density or proven top-biased text-safe cropping.

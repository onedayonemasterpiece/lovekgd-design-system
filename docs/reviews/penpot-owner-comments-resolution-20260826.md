# Penpot owner comments resolution — 2026-08-26

Status: `IN_PROGRESS`

## 1. Authority snapshot

- Repository: `onedayonemasterpiece/lovekgd-design-system`
- Working branch: `fix/penpot-owner-comments-20260826`
- Branch base / final independent audit: `65e6208f9dc8fbff9837dacfada0f52ecc49f6cb`
- Audit report: `docs/audits/independent-as-is-baseline-wave1-audit-20260825.md`
- Audited PR: `#52` — immutable for this pass
- Pinned audited head: `b86bab3e91511b3d4bd7d953b22bceb847f02a51`
- Corrected SoT base: `9b8043f3bdb86fab4eee00bf94b0f10d4f029c50`
- Astro authority: `onedayonemasterpiece/events-bot-new@7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00`
- Penpot file: `3be9e5e1-190f-8090-8008-713c0fbe6260`
- Penpot revision at inventory start: `2479`
- Penpot validation at inventory start: `[]`

The terminal audit verdict remains `NEEDS_BOUNDED_FIXES_BEFORE_OWNER_REVIEW` until the bounded comment batches are implemented and read back. The 34-case AS-IS baseline is not being rebuilt.

## 2. Access checkpoint

| Capability | Result | Evidence |
| --- | --- | --- |
| GitHub read | PASS | final audit and SoT files read from the pinned commit |
| GitHub write | PASS | correction branch created from exact audit SHA |
| Penpot file read | PASS | exact file ID, 109 pages, revision 2479 |
| Penpot write | PASS | no-op write/readback on an existing thread; revision unchanged |
| Penpot comments list/read | PASS | 118 open threads, full comment text, dates, UUID and owner available |
| Penpot reply/resolve API | PASS | methods available; no thread resolved before Git checkpoint and visual readback |

## 3. Inventory summary

- Open threads at start: **118**
- New owner threads, 2026-08-26: **25** (`#178–#202`)
- Historical open threads: **93**
- New `DEFECT_REPORT`: **22**
- New delegated/explicit owner decisions: **3** (`#184`, `#200`, `#202`)
- Historical threads with a prior implementation reply and requiring owner verification rather than blind rework: **85**
- Historical threads still carrying an explicit unresolved defect: **8** (`#168–#173`, `#175`, `#177`)

No UI SoT or Penpot shape/component mutation was made before this inventory checkpoint.

## 4. Delegated decision — mobile rail evidence

Decision `D-001` applies to threads `#200` and `#202`.

A real mobile page/viewport board must remain a truthful 390 px viewport and clip the horizontal rail at the right edge. Expanding the page board so that the full intrinsic rail appears outside the viewport would mix two different evidence types and make the AS-IS page comparison less trustworthy. The full max-content rail already belongs on the dedicated component specimen (`Page40.3`); the page-level owner board should show the actual clipped viewport.

Disposition: **do not alter product behavior or the viewport owner board**. Reply with this rationale and resolve only after the exact target page has been identified. A review-only annotation may be added later if discoverability remains a problem; it must not become a product component or SoT behavior.

## 5. New owner comments — detailed inventory

All new threads are authored by `Maxim N`. Times below are UTC on `2026-08-26`.

| # | Exact thread UUID | Time | Page / target | Summary | Classification | Lowest affected owner / impact | Audit relation | Status |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| 178 | `f26ab6a6-5d83-4484-969a-88d1f4f064ad` | 08:41:28 | `64.03 Floating action island`; board `8e7accff-5c78-8007-8008-89c091bcde50` | Baseline region is visually uneven and unlike Astro. | DEFECT_REPORT | review-board composition first; pattern only if readback proves a component defect | BF-07 | pending exact hierarchy/readback |
| 179 | `712305b3-cd26-4a6f-b12e-94fa404bae20` | 08:42:08 | `64.03`; board `8e7accff-5c78-8007-8008-89c0920de41d` | Like action width stretches instead of hugging content. | DEFECT_REPORT | Event detail mobile action / action sizing contract + linked specimen | BF-07 | pending owner trace |
| 180 | `4bf186d3-27af-45c2-a307-75cef70a1e77` | 08:43:47 | `64.01 Search + navigation`; board `8e7accff-5c78-8007-8008-89bf5c941649` | Candidate header loses the Astro leather tag crossing the bottom divider and shows an unexplained block. | DEFECT_REPORT | desktop shell/header composition before search entry | BF-05 | pending owner trace |
| 181 | `d66487e5-9a35-41c6-960e-4a1371b28821` | 08:44:33 | root coordinate `(43.89,25.51)`; exact board mapping pending | Multiple components overlap and diverge from source. | DEFECT_REPORT | likely Wave 1 review-board composition; no component mutation until exact target mapping | BF-05/BF-06 candidate | pending target mapping |
| 182 | `e5e0ecc1-03c8-4a58-8108-fb3e7c453f4f` | 08:44:48 | root coordinate `(222.80,26.01)`; exact board mapping pending | Objects overlap, making review impossible. | DEFECT_REPORT | review-board composition | BF-05/BF-06 candidate | pending target mapping |
| 183 | `a396dcd4-75cf-4051-a732-6392090e6c66` | 08:44:53 | root coordinate `(133.62,25.32)`; exact board mapping pending | Objects overlap, making review impossible. | DEFECT_REPORT | review-board composition | BF-05/BF-06 candidate | pending target mapping |
| 184 | `1dfc5c41-a631-47d4-8751-7d4b096c095b` | 08:45:36 | likely `64.02 Responsive selectors`, coordinate `(101.57,174.91)`; exact board mapping pending | Date must fit naturally on one line or move wholly to line two; date and month use a non-breaking space. | ACTIONABLE_OWNER_DECISION | responsive date selector label/wrapping contract + candidate instance | BF-06 | pending exact target + SoT trace |
| 185 | `e8b5e14d-3a80-4abe-b113-84420660498c` | 08:45:59 | root coordinate `(342.43,155.28)`; exact page/board mapping pending | Severe crop/framing defect. | DEFECT_REPORT | media owner to be identified; no local patch before mapping | new bounded issue | pending target mapping |
| 186 | `426cf94c-954a-4d1a-a896-8cfff4fc2803` | 08:46:39 | root coordinate `(362.33,396.51)`; exact page/board mapping pending | Severe crop/framing defect. | DEFECT_REPORT | media owner to be identified | new bounded issue | pending target mapping |
| 187 | `1ac84ec9-2a85-4e2b-9b11-d648f8e69da0` | 08:48:56 | root coordinate `(-96.73,157.74)`; exact page/board mapping pending | Rail cards appear recreated and incorrectly cropped. | DEFECT_REPORT | existing mobile rail/card owner; speculative new family forbidden | new bounded issue | pending target mapping |
| 188 | `5efdc70f-25fb-48f6-8474-46f8de226dfc` | 08:49:18 | root coordinate `(275.00,63.67)`; exact page/board mapping pending | Text overflows its block; block must adapt to content. | DEFECT_REPORT | exact text/container owner to be identified | new bounded issue | pending target mapping |
| 189 | `9b0d4d15-35cf-48bd-b550-446722a36410` | 08:50:35 | root coordinate `(142.21,1210.32)`; exact page/board mapping pending | Severe crop/framing defect. | DEFECT_REPORT | media owner to be identified | new bounded issue | pending target mapping |
| 190 | `a684729e-669f-4ee1-9d9f-56f70045944f` | 08:53:43 | `63.17 Special states`; board `d87e18f1-dcb4-80a6-8008-880fd30f9860` | User-facing error copy exposes technical terms. | DEFECT_REPORT | special-state recovery copy contract + owner board | new bounded issue | pending SoT/runtime ownership check |
| 191 | `f000c58c-84dc-4c2b-8010-eac857c91ee1` | 08:54:04 | `63.15 Artifacts`; board `d87e18f1-dcb4-80a6-8008-880f9aaea84e` | “Tomorrow” appears active without reason; full seven-artifact page is missing. | DEFECT_REPORT | artifacts page archetype/state coverage | new bounded issue | pending Astro/SoT census |
| 192 | `8ed7b654-9583-4a35-b70d-b524278722b7` | 08:54:45 | `63.14 Focus group`; board `d87e18f1-dcb4-80a6-8008-886984f9f330` | Board does not match the real Astro connection/start page. | DEFECT_REPORT | focus-group page archetype evidence | new bounded issue | pending exact Astro evidence trace |
| 193 | `43b5c57d-25b6-403a-be4c-8cf3f2ae488b` | 08:57:27 | `63.12 Favorites`; board `d87e18f1-dcb4-80a6-8008-880d20bc67e8` | Populated state is missing; unexplained active “Tomorrow”. | DEFECT_REPORT | Favorites populated/action-refresh owners | BF-03 | pending SoT/Penpot state completion |
| 194 | `3408bce5-dbc7-4e7c-807b-1c5eca27bf00` | 08:58:24 | `63.11 Interest clubs`; board `d87e18f1-dcb4-80a6-8008-880cfe39384c` | Only empty state is shown although Astro has populated content. | DEFECT_REPORT | Interest clubs populated page state | new bounded issue | pending Astro/SoT trace |
| 195 | `bc1f1729-968c-457a-bea6-62dbef5794b0` | 08:59:14 | `63.08 Collections`; board `d87e18f1-dcb4-80a6-8008-880c4a6d708e` | Technical directory shown instead of filled “Бесплатные” collection with medallion. | DEFECT_REPORT | Collections populated detail archetype/evidence | new bounded issue | pending Astro/SoT trace |
| 196 | `67999a34-a7eb-4460-b3db-46f830c93e13` | 09:00:06 | root coordinate `(-193.43,647.25)`; likely `63.07 Event detail`, exact target pending | Event-detail variant with central medallion above main information is missing. | DEFECT_REPORT | Event Detail layout/media variant owner | BF-01 | pending exact page/variant mapping |
| 197 | `417696ff-5153-46b0-b28d-3e6251f8e8c5` | 09:00:46 | `63.07 Event detail`; board `d87e18f1-dcb4-80a6-8008-880bfe361a1d` | Direction is correct but board has defects; a better existing Penpot version should be reused. | DEFECT_REPORT | Event Detail fixture/layout owner; reuse before new component | BF-01 | pending comparison to existing owner |
| 198 | `9128289a-a77f-490e-a614-148c2002f5ee` | 09:01:36 | root coordinate `(-530.83,150.21)`; likely `63.06 Search`, exact target pending | Progress, loading skeleton and final result variants are not visible. | DEFECT_REPORT | Search state coverage / owner-review discoverability | new bounded issue; related BF-05 only if navigation context involved | pending mapping; audit had 20/20 state coverage, so do not assume SoT absence |
| 199 | `02ad138e-95d9-4ccd-90f8-88f21058a17f` | 09:01:54 | root coordinate `(-119.16,172.86)`; exact target pending | Page has no event content. | DEFECT_REPORT | populated listing state/archetype to be identified | new bounded issue | pending target mapping |
| 200 | `7ca672bd-0385-42e9-9b34-d7840e61725e` | 09:02:25 | `63.04 Popular`; board `d87e18f1-dcb4-80a6-8008-8809ea570ea8` | Request to show full rails beyond right edge. | ACTIONABLE_OWNER_DECISION with delegated disposition | viewport evidence vs full-track component specimen | none | decision D-001; reply/resolve after readback |
| 201 | `8b349540-44b6-44a9-9ce9-c96ee01356a1` | 09:03:39 | `63.01 Home`; board `d87e18f1-dcb4-80a6-8008-8806efd8647f` | Wrong Home variant; hero-talk and hero-talk-page-end are missing. | DEFECT_REPORT | Home archetype/state coverage | new bounded issue | pending Astro/SoT trace |
| 202 | `9df25b1c-f2d5-44b0-8b92-2493dd8f1b6d` | 09:04:02 | root coordinate `(307.00,343.50)`; exact target pending | Request to always show a full-size rail beyond right edge. | ACTIONABLE_OWNER_DECISION with delegated disposition | viewport evidence vs full-track component specimen | none | decision D-001; target mapping pending |

## 6. Historical open-thread disposition

### 6.1 Explicit unresolved defects

| # | Exact thread UUID | Current classification | Current status |
| ---: | --- | --- | --- |
| 168 | `c269caa0-e456-818c-8008-86e9b35dc970` | DEFECT_REPORT | pending — latest owner reply says it still differs from Astro |
| 169 | `c269caa0-e456-818c-8008-86e9e593b52b` | DEFECT_REPORT | pending — footer projection incomplete |
| 170 | `502b4555-3f5f-807a-8008-86ea106f8f9c` | DEFECT_REPORT | pending — inherited media/fixture binding risk |
| 171 | `c269caa0-e456-818c-8008-86ea24f603fb` | DEFECT_REPORT | pending — mobile date accessory lacks exact same-state proof |
| 172 | `c269caa0-e456-818c-8008-86ea5fe7896b` | DEFECT_REPORT | pending — mobile rail master ownership/page organization defect |
| 173 | `c269caa0-e456-818c-8008-86ea9a720cc0` | DEFECT_REPORT | pending — general conformance gap, explicitly not accepted |
| 175 | `c269caa0-e456-818c-8008-86eb35ae77a4` | DEFECT_REPORT | pending — listing proof/fixture breadth requires verification |
| 177 | `c269caa0-e456-818c-8008-87158ddf3853` | DEFECT_REPORT | pending — visual defects and Astro mismatch |

### 6.2 Previously answered threads

The other 85 historical threads contain prior implementation replies. They are classified `OBSOLETE_ALREADY_FIXED / pending owner verification`, not automatically resolved. This pass will not recreate their fixes unless current readback contradicts the prior reply or a new owner comment reopens the same owner.

Exact thread-ID census:

#27=`5954a801-37cf-8094-8008-81decb6163ab` · #31=`5954a801-37cf-8094-8008-81df7c24735b` · #64=`63bdc57a-636a-81ba-8008-82c23a4d79d2` · #67=`63bdc57a-636a-81ba-8008-82e789b28240`

#68=`63bdc57a-636a-81ba-8008-82e7cc5619df` · #69=`63bdc57a-636a-81ba-8008-82e7f9410ced` · #70=`63bdc57a-636a-81ba-8008-82e82e435553` · #74=`63bdc57a-636a-81ba-8008-82ea3a02119f`

#75=`63bdc57a-636a-81ba-8008-82ea669532e7` · #76=`63bdc57a-636a-81ba-8008-82ea792747b4` · #77=`5954a801-37cf-8094-8008-82ea86522612` · #78=`63bdc57a-636a-81ba-8008-82ea8fa7bc7a`

#79=`5954a801-37cf-8094-8008-82eab37ba503` · #80=`63bdc57a-636a-81ba-8008-82ead5fe5de1` · #81=`5954a801-37cf-8094-8008-82eb2c60c0f7` · #82=`63bdc57a-636a-81ba-8008-82ebd81f34be`

#84=`5954a801-37cf-8094-8008-82ec4af77a0e` · #88=`63bdc57a-636a-81ba-8008-83005612a3de` · #90=`5954a801-37cf-8094-8008-8301526eb86b` · #91=`63bdc57a-636a-81ba-8008-83017c0cad0d`

#92=`5954a801-37cf-8094-8008-8301d69219f4` · #93=`63bdc57a-636a-81ba-8008-8301ec1867cf` · #94=`5954a801-37cf-8094-8008-8302116c2cb6` · #95=`5954a801-37cf-8094-8008-8303d42a702f`

#96=`63bdc57a-636a-81ba-8008-831f63d330c8` · #97=`5954a801-37cf-8094-8008-831fe5c508cc` · #101=`5954a801-37cf-8094-8008-8321041223a4` · #102=`63bdc57a-636a-81ba-8008-83212849c66a`

#103=`63bdc57a-636a-81ba-8008-8321678eff3a` · #104=`63bdc57a-636a-81ba-8008-832288de9dad` · #105=`5954a801-37cf-8094-8008-83230aeef02b` · #106=`63bdc57a-636a-81ba-8008-83230b7d4e96`

#111=`5954a801-37cf-8094-8008-8323c8d69fd9` · #112=`63bdc57a-636a-81ba-8008-8323f89745fa` · #114=`5954a801-37cf-8094-8008-8324db15b0de` · #115=`5954a801-37cf-8094-8008-8324fc616495`

#116=`5954a801-37cf-8094-8008-832565f4dd34` · #117=`5954a801-37cf-8094-8008-8325c0dbcba5` · #118=`63bdc57a-636a-81ba-8008-8326055213db` · #119=`63bdc57a-636a-81ba-8008-83261ea2931d`

#120=`5954a801-37cf-8094-8008-832652269734` · #121=`63bdc57a-636a-81ba-8008-8326ad5c299b` · #122=`63bdc57a-636a-81ba-8008-8326f1c2f61c` · #123=`63bdc57a-636a-81ba-8008-832728eda1b1`

#124=`5954a801-37cf-8094-8008-83278974215f` · #125=`63bdc57a-636a-81ba-8008-832808b85180` · #126=`63bdc57a-636a-81ba-8008-83630fece0f5` · #127=`63bdc57a-636a-81ba-8008-83634ff84ee8`

#128=`5954a801-37cf-8094-8008-83658ee416fd` · #129=`63bdc57a-636a-81ba-8008-83660025f3d2` · #131=`63bdc57a-636a-81ba-8008-83687b12b95d` · #132=`63bdc57a-636a-81ba-8008-8368b8e17c55`

#133=`5954a801-37cf-8094-8008-8368dfd78005` · #137=`5954a801-37cf-8094-8008-8369a28d723f` · #138=`63bdc57a-636a-81ba-8008-8369a350895e` · #140=`5954a801-37cf-8094-8008-836a160dd14d`

#141=`63bdc57a-636a-81ba-8008-836a24003f3e` · #142=`63bdc57a-636a-81ba-8008-836a3912a861` · #143=`63bdc57a-636a-81ba-8008-836a52328028` · #144=`63bdc57a-636a-81ba-8008-836af471fac0`

#145=`5954a801-37cf-8094-8008-836ba91d445f` · #146=`5954a801-37cf-8094-8008-836bfeec153a` · #147=`63bdc57a-636a-81ba-8008-836c069e4366` · #148=`63bdc57a-636a-81ba-8008-836c382cb333`

#149=`5954a801-37cf-8094-8008-838019617d20` · #150=`63bdc57a-636a-81ba-8008-83805416ef70` · #151=`5954a801-37cf-8094-8008-8380ae8c9036` · #152=`63bdc57a-636a-81ba-8008-8381b00e02de`

#153=`5954a801-37cf-8094-8008-8381cbd8bfe8` · #154=`5954a801-37cf-8094-8008-838261561dc0` · #155=`63bdc57a-636a-81ba-8008-838299114fff` · #156=`63bdc57a-636a-81ba-8008-8382b5002424`

#157=`63bdc57a-636a-81ba-8008-83834f077da1` · #158=`5954a801-37cf-8094-8008-838377c0057d` · #159=`5954a801-37cf-8094-8008-83838e4f13a7` · #160=`63bdc57a-636a-81ba-8008-83840a6ac943`

#161=`63bdc57a-636a-81ba-8008-83845a00022c` · #162=`63bdc57a-636a-81ba-8008-83848bb80b22` · #163=`63bdc57a-636a-81ba-8008-841e71ec20a2` · #164=`c269caa0-e456-818c-8008-86e90ca107f8`

#165=`502b4555-3f5f-807a-8008-86e928743c50` · #166=`c269caa0-e456-818c-8008-86e96a82a349` · #167=`c269caa0-e456-818c-8008-86e98ad67a8e` · #168=`c269caa0-e456-818c-8008-86e9b35dc970`

#169=`c269caa0-e456-818c-8008-86e9e593b52b` · #170=`502b4555-3f5f-807a-8008-86ea106f8f9c` · #171=`c269caa0-e456-818c-8008-86ea24f603fb` · #172=`c269caa0-e456-818c-8008-86ea5fe7896b`

#173=`c269caa0-e456-818c-8008-86ea9a720cc0` · #174=`502b4555-3f5f-807a-8008-86eb030d36a8` · #175=`c269caa0-e456-818c-8008-86eb35ae77a4` · #176=`502b4555-3f5f-807a-8008-86eb8694e65f`

#177=`c269caa0-e456-818c-8008-87158ddf3853`

## 7. Planned bounded batches

1. Map root-coordinate comments to exact pages/boards without mutation.
2. Fix Wave 1 review composition and lowest shared owners for `#178–#184`.
3. Resolve delegated rail evidence decision `#200/#202` without changing product behavior.
4. Trace and complete bounded archetype/state gaps `#190–#201` in small page-owned batches.
5. Reconcile the eight explicit historical defects only where they overlap the current owner scope.

Each implementation batch must update this ledger, commit, push, verify remote SHA, then mutate one exact Penpot page and perform readback.

## 8. Checkpoint log

| Checkpoint | Git commit | Penpot revision | Notes |
| --- | --- | ---: | --- |
| Inventory | pending | 2479 | 118 open threads inventoried; no shape/component mutation |

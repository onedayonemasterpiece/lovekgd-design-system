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
| Penpot write | PASS | safe no-op write/readback on an existing thread; revision unchanged |
| Penpot comments list/read | PASS | 118 open threads; full text, dates, owner and exact thread UUID available |
| Penpot reply/resolve API | PASS | methods available; no thread resolved before Git checkpoint and page-target readback |

## 3. Inventory summary

- Open threads at start: **118**
- New owner threads, 2026-08-26: **25** (`#178–#202`)
- Historical open threads: **93**
- New `DEFECT_REPORT`: **22**
- New delegated/explicit owner decisions: **3** (`#184`, `#200`, `#202`)
- Historical threads with a prior implementation reply and requiring owner verification rather than blind rework: **85**
- Historical threads still carrying an explicit unresolved defect: **8** (`#168–#173`, `#175`, `#177`)

No UI SoT or Penpot shape/component mutation was made before the inventory checkpoint.

### Mapping correction

The initial inventory commit used the public `thread.page` wrapper. In a file-wide query this wrapper reflects the currently open page and is not an authoritative origin pointer. This ledger supersedes that mapping. The authoritative mapping below was rebuilt by opening bounded page groups and matching each exact `thread.$id.uuid` against that page's `comment-thread-positions`, including the stored `frame-id`.

## 4. Delegated decision — mobile rail evidence

Decision `D-001` applies to threads `#200` and `#202`.

A real mobile page/viewport board must remain a truthful 390 px viewport and clip the horizontal rail at the right edge. Expanding the page board so that the full intrinsic rail appears outside the viewport would mix page evidence with component anatomy and make the AS-IS comparison less trustworthy. The full max-content rail belongs on the dedicated component specimen `40.3 Rail card — Full max-content track` (`579a886e-56e8-80a3-8008-81882dc703ba`).

Disposition: **do not alter product behavior or widen the mobile owner boards**. Reply with this rationale and resolve the two delegated threads after this Git checkpoint is pushed and each exact page is read back. No UI SoT mutation is needed because the product behavior is unchanged.

## 5. New owner comments — authoritative inventory

All new threads are authored by `Maxim N`. Times are UTC on `2026-08-26`.

| # | Exact thread UUID | Time | Exact page | Exact target | Summary | Classification | Lowest affected owner / impact | Audit relation | Status |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 178 | `502b4555-3f5f-807a-8008-8a92fd57661e` | 08:41:28 | `64.03 Floating action island` `8e7accff-5c78-8007-8008-89c00a062ffc` | `8e7accff-5c78-8007-8008-89c091bcde50` — desktop baseline region | Baseline region is uneven and unlike Astro. | DEFECT_REPORT | review-board composition first; pattern only if component readback proves a shared defect | BF-07 | pending hierarchy/readback |
| 179 | `502b4555-3f5f-807a-8008-8a93222f434b` | 08:42:08 | `64.03 Floating action island` | `8e7accff-5c78-8007-8008-89c0920de41d` — linked mobile action crop | Like action stretches instead of hugging content. | DEFECT_REPORT | Event Detail mobile action sizing contract + linked specimen | BF-07 | pending owner trace |
| 180 | `c269caa0-e456-818c-8008-8a9386fc4d08` | 08:43:47 | `64.01 Search + navigation` `8e7accff-5c78-8007-8008-89bf021cf5fd` | `8e7accff-5c78-8007-8008-89bf5c941649` | Candidate header loses the Astro leather tag crossing the divider and shows an unexplained block. | DEFECT_REPORT | desktop shell/header composition before search entry | BF-05 | pending owner trace |
| 181 | `c269caa0-e456-818c-8008-8a93be4bf647` | 08:44:33 | `40.3a Popular mobile fixtures` `8e7accff-5c78-8007-8008-8964f8dc3b14` | `8e7accff-5c78-8007-8008-897a68c7c95a` — actions disabled | Components overlap and diverge from source. | DEFECT_REPORT | Popular mobile rail fixture; existing shared owners only | new bounded issue | pending hierarchy/readback |
| 182 | `c269caa0-e456-818c-8008-8a93d2aad94a` | 08:44:48 | `40.3a Popular mobile fixtures` | `8e7accff-5c78-8007-8008-897a6b5fd179` — `social.like-stacked` | Objects overlap, making review impossible. | DEFECT_REPORT | mobile rail fixture + SocialProof owner | new bounded issue | pending hierarchy/readback |
| 183 | `502b4555-3f5f-807a-8008-8a93e4ac7cad` | 08:44:53 | `40.3a Popular mobile fixtures` | `8e7accff-5c78-8007-8008-897a69e16a3d` — `social.avatar-group` | Objects overlap, making review impossible. | DEFECT_REPORT | mobile rail fixture + SocialProof owner | new bounded issue | pending hierarchy/readback |
| 184 | `c269caa0-e456-818c-8008-8a941dda3453` | 08:45:36 | `40.3a Popular mobile fixtures` | `8e7accff-5c78-8007-8008-897accaded5a` — selected state | Date must fit naturally on one line or move wholly to line two; date and month use a non-breaking space. | ACTIONABLE_OWNER_DECISION | mobile rail/card date-label wrapping contract + linked specimen | new bounded issue | pending SoT trace |
| 185 | `502b4555-3f5f-807a-8008-8a9446a4ad16` | 08:45:59 | `40.3a Popular mobile fixtures` | `8e7accff-5c78-8007-8008-897accaded5a` — selected state | Severe crop/framing defect. | DEFECT_REPORT | mobile rail/card media owner | new bounded issue | pending owner trace |
| 186 | `502b4555-3f5f-807a-8008-8a945e1eed31` | 08:46:39 | `40.3a Popular mobile fixtures` | `8e7accff-5c78-8007-8008-897afa012baf` — 320 selected | Severe crop/framing defect. | DEFECT_REPORT | mobile rail/card media owner | new bounded issue | pending owner trace |
| 187 | `502b4555-3f5f-807a-8008-8a94ad9384df` | 08:48:56 | `40.3a Popular mobile fixtures` | root target, position `(-96.73,157.74)` | Rail cards look recreated and incorrectly cropped. | DEFECT_REPORT | existing rail/card owner; speculative new family forbidden | new bounded issue | pending owner trace |
| 188 | `502b4555-3f5f-807a-8008-8a94e977b060` | 08:49:18 | `30.1D Rail Card Popular — Component (Social proof modes)` `8e7accff-5c78-8007-8008-8970ea1e3f8d` | `8e7accff-5c78-8007-8008-89717ff043a3` — compact36/like | Text overflows; block must adapt to content. | DEFECT_REPORT | shared SocialProof compact component | new bounded issue | pending owner trace |
| 189 | `c269caa0-e456-818c-8008-8a950d8f89ea` | 08:50:35 | `40.2a Popular row fixtures` `8e7accff-5c78-8007-8008-89765b9b2207` | `8e7accff-5c78-8007-8008-896958dbff00` — grouping user+nobody | Severe crop/framing defect. | DEFECT_REPORT | desktop rail media shared owner | new bounded issue | pending owner trace |
| 190 | `c269caa0-e456-818c-8008-8a953ec18044` | 08:53:43 | `63.17 Special states` `d87e18f1-dcb4-80a6-8008-880fd2e88456` | `d87e18f1-dcb4-80a6-8008-880fd30f9860` | User-facing error copy exposes technical terms. | DEFECT_REPORT | recovery-copy contract + owner board; runtime ownership retained | new bounded issue | pending SoT/runtime check |
| 191 | `502b4555-3f5f-807a-8008-8a958bf8d2eb` | 08:54:04 | `63.15 Artifacts` `d87e18f1-dcb4-80a6-8008-880f9a822a76` | `d87e18f1-dcb4-80a6-8008-880f9aaea84e` | “Tomorrow” appears active without reason; full seven-artifact page is missing. | DEFECT_REPORT | Artifacts page archetype/state coverage | new bounded issue | pending Astro/SoT census |
| 192 | `502b4555-3f5f-807a-8008-8a95c3a810a3` | 08:54:45 | `63.14 Focus group` `d87e18f1-dcb4-80a6-8008-880f767c3eb3` | `d87e18f1-dcb4-80a6-8008-886984f9f330` | Board does not match the real Astro connection/start page. | DEFECT_REPORT | Focus-group page archetype evidence | new bounded issue | pending Astro evidence trace |
| 193 | `502b4555-3f5f-807a-8008-8a9607896d8d` | 08:57:27 | `63.12 Favorites` `d87e18f1-dcb4-80a6-8008-880d209a7fcd` | `d87e18f1-dcb4-80a6-8008-880d20bc67e8` | Populated state is missing; unexplained active “Tomorrow”. | DEFECT_REPORT | Favorites populated/action-refresh owners | BF-03 | pending SoT/Penpot completion |
| 194 | `502b4555-3f5f-807a-8008-8a9619f15b30` | 08:58:24 | `63.11 Interest clubs` `d87e18f1-dcb4-80a6-8008-880cfe1ec779` | `d87e18f1-dcb4-80a6-8008-880cfe39384c` | Only empty state is shown although Astro has populated content. | DEFECT_REPORT | Interest clubs populated page state | new bounded issue | pending Astro/SoT trace |
| 195 | `c269caa0-e456-818c-8008-8a96cfa5b523` | 08:59:14 | `63.08 Collections` `d87e18f1-dcb4-80a6-8008-880c4a36d153` | `d87e18f1-dcb4-80a6-8008-880c4a6d708e` | Technical directory shown instead of filled “Бесплатные” collection with medallion. | DEFECT_REPORT | Collections populated detail archetype/evidence | new bounded issue | pending Astro/SoT trace |
| 196 | `502b4555-3f5f-807a-8008-8a970cb83eb5` | 09:00:06 | `63.07 Event detail` `d87e18f1-dcb4-80a6-8008-880bfdfbf2ec` | root target, position `(-193.43,647.25)` | Event-detail variant with central medallion above main information is missing. | DEFECT_REPORT | Event Detail layout/media variant owner | BF-01 | pending exact variant trace |
| 197 | `502b4555-3f5f-807a-8008-8a972d84b43f` | 09:00:46 | `63.07 Event detail` | `d87e18f1-dcb4-80a6-8008-880bfe361a1d` | Direction is correct but board has defects; reuse a better existing Penpot version. | DEFECT_REPORT | Event Detail fixture/layout owner; reuse before new component | BF-01 | pending owner comparison |
| 198 | `502b4555-3f5f-807a-8008-8a974fef6b47` | 09:01:36 | `63.06 Search` `d87e18f1-dcb4-80a6-8008-880ac732b6ae` | root target, position `(-530.83,150.21)` | Progress, loading skeleton and final result variants are not visible. | DEFECT_REPORT | Search state evidence/discoverability | new bounded issue | audit had 20/20 states; verify before SoT change |
| 199 | `c269caa0-e456-818c-8008-8a97621ce392` | 09:01:54 | `63.05 Unusual` `d87e18f1-dcb4-80a6-8008-880a6c07b2b2` | root target, position `(-119.16,172.86)` | Page has no event content. | DEFECT_REPORT | populated listing state/archetype | new bounded issue | pending Astro/SoT trace |
| 200 | `c269caa0-e456-818c-8008-8a9799775bea` | 09:02:25 | `63.04 Popular` `d87e18f1-dcb4-80a6-8008-880937f54501` | `d87e18f1-dcb4-80a6-8008-8809ea570ea8` | Request to show full rails beyond the right edge. | ACTIONABLE_OWNER_DECISION with delegated disposition | viewport evidence vs full-track specimen | none | D-001; pending reply/resolve |
| 201 | `c269caa0-e456-818c-8008-8a97e3bb042f` | 09:03:39 | `63.01 Home` `d87e18f1-dcb4-80a6-8008-8806c5b98101` | `d87e18f1-dcb4-80a6-8008-8806efd8647f` | Wrong Home variant; hero-talk and hero-talk-page-end are missing. | DEFECT_REPORT | Home archetype/state coverage | new bounded issue | pending Astro/SoT trace |
| 202 | `502b4555-3f5f-807a-8008-8a9811ed4164` | 09:04:02 | `61.12 Weekend / Mobile shell viewport` `d87e18f1-dcb4-80a6-8008-87e2fdb55cc6` | root target, position `(307.00,343.50)` | Request to always show a full-size rail beyond the right edge. | ACTIONABLE_OWNER_DECISION with delegated disposition | viewport evidence vs full-track specimen | none | D-001; pending reply/resolve |

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

The other 85 historical threads contain prior implementation replies. They remain `OBSOLETE_ALREADY_FIXED / pending owner verification`, not automatically resolved. This pass will not recreate those fixes unless current readback contradicts the prior reply or a new owner comment reopens the same owner.

Sequence census: `27, 31, 64, 67–82, 84, 88, 90–97, 101–106, 111, 112, 114–129, 131–133, 137, 138, 140–167, 174, 176`.

The initial inventory commit preserves the full historical thread-ID appendix. Its page mapping for new threads is superseded by section 5 of this corrected ledger; its historical UUID census remains provenance only and is not used as a mutation pointer without page-local readback.

## 7. Planned bounded batches

1. Resolve delegated rail evidence decision `#200/#202` without changing product behavior.
2. Trace and repair shared rail/card owners for `#181–#189`, starting with SoT and component masters rather than per-fixture patches.
3. Fix Wave 1 review composition/shared owners for `#178–#180`.
4. Trace and complete bounded archetype/state gaps `#190–#201` in page-owned batches.
5. Reconcile the eight explicit historical defects only where they overlap the current owner scope.

Each implementation batch must update this ledger, commit, push, verify remote SHA, then mutate one exact Penpot page and perform readback.

## 8. Checkpoint log

| Checkpoint | Git commit | Penpot revision | Notes |
| --- | --- | ---: | --- |
| Inventory | `c9520346f85fe0262bf228fed1be8f88da485ed9` | 2479 | 118 open threads inventoried; no shape/component mutation |
| Mapping correction | pending | 2479 | authoritative page/target mapping rebuilt from page-local comment-thread positions |

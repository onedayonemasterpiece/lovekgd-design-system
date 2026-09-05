# FI-P1 — общая геометрия и одна верхняя строка

Дата: 2026-09-05, уточнение v1.1. Статус: **проект первого runtime implementation-пакета; его browser/native автотесты ещё не реализованы**. Отдельная offline модель top-row имеет 14 проверок на искусственных размерах и не является реализацией сайта.

Обязательно читать вместе: [system-design-v1.md](system-design-v1.md), FI-01–FI-20; [top-row-composition-v1.1.md](top-row-composition-v1.1.md), одна строка/форматы/компактизация; [release-bindings-v1.md](release-bindings-v1.md), RB-01–RB-03. Это один pattern owner. [Матрица](consumer-matrix-v1.md) определяет consumers; [источники](sources-and-decisions-v1.md) и поздние дополнения различают source/public/P и выполненные наблюдения. Этот файл — конкретный scope и приёмка, не новый оркестратор или предложение снова придумать систему.

## 1. Первый видимый результат

На **`/populyarnoe/`** page locator, текущий контекст полки/уместные filter controls и общий menu entry образуют **одну согласованную верхнюю строку**, а не дополнительные sticky этажи. Следующая полка меняет context при scroll вниз, предыдущая возвращается при scroll вверх. Сам H2 остаётся в semantic document flow; locator не является вторым heading. Последнее действие карточки достижимо, focus не прячется за chrome.

Mixed views full/lean/compact выбираются по фактической доступной ширине. Иконки могут исчезать/возвращаться по явной карте конкретного action; заголовок и важные ограничения не заменяются неизвестными glyphs. При нехватке места второстепенная часть возвращается в своё раскрытие/поток, не появляется автоматически второй fixed ряд. Медальон добавляется только при valid page/section binding; Popular не получает фиктивный badge ради четырёх ролей.

В существующем EventLayout один механизм occupied-space учитывает top row, nav, date accessory, event CTA и нижние уведомления. **Принятый skin нижней навигации, четыре destinations и смысл текущего page context сохраняются.** Compact global-menu presentation — versioned view существующего owner по v1.1, не второй menu/controller.

Shared regression: Today, Free, event-detail. Четырёхролевая Search-композиция проверяется в UI fixture с canonical cards; живой ASR/backend и новый публичный voice Search в FI-P1 не входят. Из release bindings в P1 входят **readonly geometry/status/served interfaces и UI fixtures**, не полное внедрение relay/analytics/profile backend.

## 2. Scope, fresh-read и безопасный baseline

**Входит:** adapter над существующим shell; occupied rects/insets; one-row mixed compaction и menu view; защита last CTA/focus; согласование lower-surface offset; C2 на Popular; UI-only C4 specimen; source-bound projection нужных состояний; core/binding/top-row checks; immutable preview через действующий pipeline после реализации.

**Не входит:** production promotion и full-site normalization closure; fonts/palette/shared foundations; новый header skin над hero; массовый singleshelf redesign; data-quality/ranking rewrite; живые provider/микрофонные calls; новый Penpot file, builder, QA platform, outbox, transport или profile service. Reverse analytics/media delivery и downstream readout не объявляются готовыми по UI mocks.

Перед кодом fresh-read executable trunk `events-bot-new:agent/static-site-single-kaggle-contract`, #621 latest comments, DS contract/STATUS и затронутые families. В ходе v1.1 прочитанный STATUS сообщает source/public `2fe28b1f831ac607c0415a8aa6c2beab9eb67fac`, version22; прежний 0b08 остаётся историей. Это receipt сведения, не личный повтор browser проверки. **Не откатывать будущий trunk к этим SHA.** Documentary #587 release extension прочитан на `c048ebe…`, provenance — в release-bindings.

Один coherent batch в существующей CODE/family-owner lane. Не интегрировать новый продукт в историческую R0-ветку. При пересекающейся текущей правке shared EventLayout можно готовить pure policy/fixtures, но не писать второго конкурирующего owner. Незавершённая unrelated page и отсутствие полного P всего сайта не запрещают работу над подготовленным target.

Baseline cases: Popular top и две фактические полки; Today nav+date accessory; Free initial/append/last CTA; event-detail реального donor 5370 либо актуального аналогичного corpus event с gallery/CTA. Сам ID 5370 не заменяет будущие wide/narrow/no-image C5 cases. Сохранить exact source/corpus/clock, route, DOM/component/asset IDs, known deviations и available S/P. Missing native P остаётся pending, не искусственной тройкой A=S=P.

## 3. Source integration — конкретные места и ограничения

| Место | Действие | Сохранить |
|---|---|---|
| `site/src/layouts/EventLayout.astro` | Найти actual owners page context/bottom stack/lower-surface state; добавить совместную top-row composition в этот же measured owner. | Один writer общих CSS vars, один route-mode resolver. |
| `site/src/components/MobileBottomNav.astro` | Зарегистрировать root/controls как primary_navigation. | Четыре ссылки, один aria-current, existing skin и desktop/mobile reuse, никакого hide-on-scroll. |
| `site/src/components/Reference4MobileMenu.astro` | Versioned full/label/glyph trigger и shared panel view; actual bounds/state. | Содержание/identity/Auth/close-focus гарантии; moving-parent donor остаётся baseline немигрированного view, а не запретом compact candidate. Без нового modal/backdrop/body lock. |
| `site/src/components/listings/ListingDiscoveryRail.astro` | Убрать в migrated view предположение `rail.top == header.bottom`; объявить row-compatible controls/summary и один measured owner. | Исходные filter/date semantics; не оставлять старый pinning script и новую top row одновременно. |
| `site/src/components/MobileToastRegion.astro` | Получать общий offset/obscured state через existing lower-surface owner. | Queue/dedupe/generation/pause/persistent errors-actions, один announcement owner, cleanup. |
| Actual date accessory / `EventCtaPanel.astro` / event lower owner | Согласовать их occupied-space dependencies. | Nav XOR CTA, hero/body/terminal boundaries, domain actions; не дублировать accessory сверху автоматически. |
| `PopularListingSurface` и actual heading/section family | Stable section boundaries/IDs + context locator общей строки, explicit short labels и essential scope. | Оригинальные H2/anchors и один экземпляр control; rail/grid/EventCard/data order/cities. |
| `EventTokenMedallions` / existing icon owner | Resolve уместный mark и разрешённые full/compact asset variants; menu glyph из canonical registry. | Identity/provenance/optical readability; нельзя подставить generic icon или Unicode как A=S=P asset. |
| `KeyboardEventNavigation.astro` → `keyboardEventNavigation.mjs` и существующая scroll logic | Подключить common insets/rects к текущему focus/scroll owner. | Один глобальный listener/controller; native field/IME/overlay exemptions. |
| Existing status/list/personalization/analytics adapters | Реализовать typed readonly мост RB-01–03 и fixtures. | Shell не dispatch/retry/store/log raw payload; actual served identity принадлежит renderer, consent/exposure — existing owner. |
| `site/src/design-system/astro-family-registry.v1.json`, existing projections/materializer | Candidate versions/properties/resolved geometry, view IDs/text-icon presence/relocation targets. | Native lineage и exact assets; никаких выдуманных UUID. |
| Existing `/lab/design-system/` catalogue, `site/src/data/design-system-production-surface-contract.v1.json` | Candidate showcase, target consumer mapping и нужные states. | Lab не становится production route; accepted default version не меняется до review. |
| `docs/testing/static-site-autotest-scenarios.v1.yml`, existing browser harness | Добавлять исполняемые cases из §6 и top-row contract, переиспользуя equivalent IDs. | L0/L1/L2 adapters, true auth/side-effect classification; planned не implemented. |
| Feature README, `mobile-shell.md`, `CHANGELOG.md` | Source/variant routing и адресный before→after реализации. | Нет пересказа всех FI/RB правил в новые хронологические документы. |

Если эквивалентных модулей нет, предложенные внутренние места: `site/src/lib/islandLayout.mjs` (pure policy) и `site/src/lib/islandLayoutRuntime.ts` (DOM adapter). Сначала искать actual owner, не создавать дубль ради имён. Никаких network/persistence/business data в этих модулях.

Предложенные тесты: `site/tests/island-layout.test.mjs`, `site/tests/island-layout-lifecycle.test.mjs`; при необходимости `site/e2e/islands/` как feature suite existing runner, не самостоятельная платформа. Script добавляется вместе с реальным entrypoint; lockfile/dependencies не обновляются ради простой геометрии.

### Pure policy contract

Вход: normalized viewport/safe bounds, modes/roles, measured views, scopes, protected controls, interaction lock/current layout. Выход: selected views/placement/mode, occupied union, compatibility insets и lane blocked intervals. Повторный instance ID обновляет участника; cleanup идемпотентен. Unknown role/non-finite/negative geometry не порождают NaN CSS. Dangling callbacks после route change не перемещают focus. Приоритеты — FI-09 и top-row v1.1, не произвольный priority от страницы.

В прочитанном source nav использует `--mobile-nav-h` (базово 64px в EventLayout), width `min(480px, viewport − 2 × --ke-space-3)`, existing radius и equal tracks. Это source values, **не подтверждённые computed values всех viewports**. На target baseline извлечь реальные значения и наследовать их; не создавать новый token set. Synthetic widths offline model не входят в foundations/actual projection. Новые behavioral knobs — readable budget/hysteresis/feature enablement; material changes требуют адресного owner review.

## 4. Этапы и rollback

**P1a — совместимость:** exact affected baseline, pure policy/lifecycle tests, single writer, permitted views/action identity. Feature OFF не меняет existing DOM/data/geometry. RB adapters используют existing owners; не создают новый transport/обязательную telemetry.

**P1b — видимый consumer:** one-row C2 включается на Popular в isolated candidate через existing selection mechanism. Если нужен новый key: proposed `islands.section-context.v1` с top-row revision, default OFF и allowlisted composition, не произвольный query-param для server functions. C4 specimen — mocked_ui, ноль ASR/provider/product-mail side effects. Не допускать второго sticky этажа при номинально включённом single-row.

**P1c — regression/S:** core cases + пять release-binding fixtures + top-row cases по affected risk. Frames получают source-bound projection. Native P материализуется через existing sole writer при фактическом доступе/bindings; missing P не PASS. Отсутствующий menu glyph binding не подменяется похожим: текстовый `Меню` остаётся доступным рабочим вариантом.

**P1d — owner review:** create-only immutable candidate через current Kaggle builder. Popular baseline/candidate, full/lean/compact/pressure, actual fonts/cards и tasks «назови страницу/полку, найди меню, измени фильтр, прокрути обратно». Verdict по конкретным cases, не общий «сайт нормализован».

Rollback: выключить candidate key/откатить coherent batch; accepted shell/nav/CTA работоспособны. Data schema migration отсутствует. Active task не уничтожается при toggle. Production mixed-version rollout **не разрешён здесь**: будущий контракт должен указать owner/scope/removal deadline, иначе новая accepted family мигрирует всех production consumers одной поставкой. Старый код удаляется только по actual zero-consumer evidence.

## 5. Критерий поставки

На одном source/corpus опубликованном candidate подтверждены:

1. Popular: прежние content/order/cards, одна row band для page/section/menu, обратимый section context без H2/control дублей; nav доступна после обычного scroll.
2. Mixed compaction: labels/icons соответствуют view contracts; нет бессмысленного glyph-title/потери scope, мелких targets, мигания на ±1px и нового fixed этажа. Medallion только source-backed и читабелен.
3. Today/Free/event-detail: нет stack collisions/double safe area, last CTA/Tab target видимы; nav XOR CTA сохранён.
4. Search UI specimen: четыре роли, pressure fallback, input DOM/IME/selection/Stop стабильны; никаких backend claims.
5. RB fixtures: receipt states правдивы, actual occlusion/served interface согласован, visible-prefix/hide policy не обходится, optional OFF остаётся OFF.
6. Есть исполняемые tests и exact evidence; для A=S=P — настоящие S и native P по active contract. Missing native/backend/device layers прямо обозначены.

Source readiness, published browser verification, A=S=P и owner visual acceptance — разные свидетельства, не один глобальный DONE. Общий STATUS из documentary lane не изменяется.

## 6. Автотесты

**32 основных сценария ниже + 5 обязательных binding-cases в [release-bindings-v1.md §6](release-bindings-v1.md#6-пять-дополнительных-acceptance-cases--в-том-же-harness). Они ещё не выполнены как новые runtime tests.** Уточнённые 12 top-row acceptance cases — [v1.1 §11](top-row-composition-v1.1.md#11-проверки-и-owner-research); equivalent IDs расширяются, не обязательно создаются ещё 12 workflow. Отдельно 14 выполненных offline model tests не дают browser/native credit.

L0 — pure/contract, L1 — browser, L2 — native emulator/simulator, L3 — physical device. P2+ означает gate соответствующей последующей активации, не лишний backend scope P1.

| ID после `islands.` | Given → When → Then | Уровень / этап |
|---|---|---|
| `registration` | Зарегистрированный root → update/init/unregister → один participant/controller/offset, повторный cleanup безопасен. | L0/L1 P1 |
| `rect_union` | Overlap и разнесённые X rects → расчёт → нет double sum; lane учитывает свои препятствия. | L0 P1 |
| `invalid_geometry` | Unknown/NaN/negative/disconnected → update → safe diagnostic/fallback, не NaN CSS/потеря nav. | L0/L1 P1 |
| `safe_area_once` | Safe bounds + nav/accessory → rotate/resize → safe inset ровно один раз, last-content space соответствует stack. | L0/L1 P1; L2 перед mobile promotion |
| `viewport_coordinates` | VV offsets/scale/DPR → normalize → CSS units едины, screenshot mapping отдельно, scale не удвоен. | L0/L1 P1; L2 zoom/keyboard |
| `budget_degradation` | Long title/short viewport/много ролей → pressure → one-row permitted views, далее compact/focus/flow; не fonts/targets shrink или лишний fixed ряд. | L0/L1 P1 |
| `observer_stability` | Font/wrap/padding/ResizeObserver → update → стабилизация без loop/duplicate listeners. | L1 P1 |
| `pointer_lock` | Held Stop/CTA → status/layout → control не подменён; неизбежная потеря geometry отменяет gesture без чужого action. | L1 P1 mock; L2 P2+ |
| `ime_identity` | Selection/IME → layout transition → тот же input DOM/text, Enter не submit во время composition. | L1 P1; L2 P2+ |
| `nav_contract` | Nav-mode route → top/middle/end → четыре destinations, один current, нет hide-on-scroll/второй primary row. | L1 P1 |
| `date_stack` | Date accessory + notice + nav → resize/date choice → нет overlap, date availability semantics прежние. | L1 P1 |
| `cta_exclusion` | Immersive event → hero/body/terminal → nav XOR CTA и все labels/actions сохранены. | L1 P1 |
| `context_down_up` | Popular две реальные полки → down/up boundary → правильный row locator, настоящие H2 и anchors сохранены без дубля. | L1 P1 |
| `context_scope` | Short/long section и overflow ancestor → scroll → current scope ограничен section/lane; нет лишнего sticky под shared row. | L1 P1; explanation P2+ |
| `last_action` | Append/последняя карточка → scrollIntoView/Tab → весь target+focus outline доступны над stack. | L1 P1 |
| `transparent_gaps` | Разнесённые islands → click/scroll между ними → underlying content доступен, нет invisible click-plane. | L1 P1 |
| `focus_traversal` | Visible controls → Tab/Shift+Tab/jump → логичный order, focus не hidden/inert/occluded. | L1 + manual AT P1 |
| `menu_semantics` | Menu baseline/candidate → close paths и compact views → прежние назначения и safe focus, нет нового body lock/неправильного scope. | L1 P1 |
| `modal_gallery` | Modal/gallery → keys/Tab/close → active owner, нет background shortcuts, focus возвращён живой цели. | L1 P1 |
| `toast_lifecycle` | Passive/error/action+replacement → focus/hold/hidden/time → pause/dedupe/generation, error/action не passive-expire. | L0/L1 P1 |
| `announcement_ownership` | Inline status+toast → update → одно announcement, без focus theft/озвучки каждой geometry. | L1 + AT P1 |
| `four_roles` | Search header/context/composer/nav → resize → coexist при budget, иначе FI-09, не лимит количества islands. | L1 P1 specimen |
| `section_target_independence` | Viewed A/refinement B/pending C → scroll/answer → три состояния независимы. | L0/L1 P2+; adapter fixture P1 |
| `one_shot_reveal` | Submit/reveal → manual history scroll → late answer → anchor остаётся, доступен explicit «Новый ответ», нет второго автоскролла. | L0/L1 P2+; fixture P1 |
| `growth_history` | Expand/late media/append → Back/Forward → прежний entry/anchor, не submit; native/app restoration не оба. | L1 P2+ |
| `capture_overlay` | Active capture → blocking overlay → stop/finish ack либо defer; hidden active mic отсутствует. | L0/L1 mock P2+; L2/L3 отдельно |
| `keyboard_native` | Реальная Android/iOS OSK → focus/dismiss/rotation → поле/Stop/submit/close доступны, nav восстановлена. | L2 перед mobile composer promotion |
| `zoom_reflow` | 200% text/400% browser zoom/narrow/landscape → interaction → функции сохранены, pinning уступает читаемости. | L1 P1; L2 pinch subset |
| `underlay_contrast` | Plain/photo/poster/saturated/graphite → state → readable text/icon/focus; отсутствие blur не ломает contrast. | L1/visual P1; new header P2+ |
| `fallbacks` | No JS/no VV/slow fonts/reduced motion/forced colors → route → usable content/nav/status. | L1 P1 |
| `projection_lineage` | Exact source/corpus/S/P → compare → mismatch FAIL, missing native BLOCKED; screenshot не linked component. | L0/native/visual P1 claims |
| `negative_consumers` | OFF + незатронутые Home/info/Free/cards → comparison → нет font/grid/data/CTA drift или experimental production flag. | L0/L1 P1 |

Binding-cases: `receipt_status`, `exposure_served_bridge`, `profile_freeze`, `global_hide_history`, `optional_off`. Полные Given/When/Then и owner separation — в release-bindings. Top-row модель четырёх ролей иллюстрирует примеры владельца, **не ограничивает** систему четырьмя участниками и не заменяет реальный renderer.

### Размерность проверок

L0 целиком при изменении pure policy. P1 L1: Popular 390×844 и 1280×800; pressure 320×700 и 844×390; Today/Free/event-detail по representative mobile+desktop. Дополнительные 430/768/1728 и актуальные 1440/1920 owner-review widths — при изменении responsive branch, не декартово произведение всех routes/states/browsers. Feature promotion добавляет Chromium/Firefox/WebKit representative transitions по общему strategy; WebKit headless не native Safari. L2 — короткая выборка keyboard/mobile задач, L3 — физический capture/device gap.

## 7. Accessibility

Primary island touch controls: проектная цель hit area ≥44×44 CSS px с accessible name и проверкой соседних targets/focus. Это выбранный продуктовый target, **не утверждение о всеобщем AA требовании 44px**; inline article links не превращаются в большие buttons. Основание: [W3C Target Size Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced).

Настоящие H1/H2/landmarks, buttons/links и current/expanded/pressed states. Нельзя поставить role=button на весь остров с несколькими actions или role=toolbar без его keyboard contract. Compact title сохраняет смысл; mic/stop/close различимы не только цветом. Нет positive tabindex, disable zoom, hidden focused controls или двойных aria-live сообщений. Visible text входит в accessible name по v1.1; touch не полагается только на tooltip.

Контраст проверяется на фактическом underlay по DS requirements; blur сам по себе не evidence. Forced colors/no-backdrop-filter имеют usable fallback. Action/error не теряется по timer. Автоскан не заменяет traversal и короткий manual screen-reader check.

## 8. Реальные команды и evidence

Подтверждённые в прочитанном `site/package.json` команды:

```sh
npm --prefix site run check:astro-family-sot
npm --prefix site run check:design-system-production-surfaces
npm --prefix site run check:design-system-iconography
npm --prefix site run test:browser-release-gate
```

Существуют `local:focused`, `check:keyboard-event-navigation`, `check:desktop-cta-geometry`, `check:browser-release`, `check:listing-desktop-geometry`. Target/config брать из актуального runner и правильного immutable artifact, не случайного dist. Новые unit tests запускаются Node test runner после их создания.

Найденный routing drift: старый DS skill требует `check:design-system`, которого в прочитанном package нет. Не пропускать проверки и не создавать пустой alias ради PASS; использовать реальные family/surface/iconography gates и согласовать адресное исправление ссылки. В документальном окне skill/runtime не менялись.

Per-case evidence: scenario, exact source/pattern/component versions, build/route, corpus+clock, viewport/DPR/scale, auth/activation/consent/projection states где применимы, selected row/view/text-icon state и relocated target, occupied/protected rects, served identity/order, steps/outcome, console errors, screenshots/hash и S/P binding status. Не копировать старые CODE counts или offline-model counts как browser запуск.

A=S=P — одинаковый deterministic корпус и exact identities; current-real preview — актуальное продуктовое review. Один frozen real snapshot может выполнять обе роли, если версии/clock совпадают. Active conformance задаёт допуски; новый удобный threshold не придумывается. Optional analytics OFF и отсутствие private data в fixtures проверяются отдельно.

## 9. После FI-P1

| Пакет | Продукт | Gate |
|---|---|---|
| P2 | Общий top-row C2 у остальных подготовленных consumers и один подходящий C3 singleshelf | Target baselines/owner review P1; не переносить sticky на empty/short/info автоматически. |
| P3 | Настоящий C4 conversation | Current #587 implementation, native keyboard/capture/receipt, FI-16 и RB-01–03; полный Search→hide→обычная подборка→receipt→authorized aggregate integration отдельно. |
| P4 | Новая visual skin partial header/media-from-top C5 | Actual underlays/crop/contrast/P и owner review; structure одной строки уже входит в P1, не откладывается до P4. |
| Promotion | Approved selected variants в production | Existing release authority, migration/rollback и явное разрешение deployment. |

P2/P3 не ждут всей P4 или чужой незавершённой страницы. Design/fixtures могут идти параллельно, shared runtime owner интегрируется последовательно. #47 владеет pattern, #587 — Search/release interfaces, #621 — текущей интеграцией. Новые агенты или управляющие службы не нужны.

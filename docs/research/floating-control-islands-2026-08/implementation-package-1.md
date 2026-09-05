# FI-P1 — shared geometry + реальный контекст полок

Дата: 2026-09-05. Статус: **проект первого implementation-пакета; код и автотесты пакета ещё не реализованы**.

Обязательно читать вместе: [system-design-v1.md](system-design-v1.md), FI-01–FI-20, и [release-bindings-v1.md](release-bindings-v1.md), RB-01–RB-03. Это один pattern owner. [Матрица](consumer-matrix-v1.md) определяет consumers; [источники](sources-and-decisions-v1.md) и позднее release дополнение различают source/public/P и выполненные наблюдения. Этот файл — конкретный исполнимый scope и приёмка, не новый оркестратор или предложение снова придумать систему.

## 1. Первый видимый результат

На **`/populyarnoe/`** текущая содержательная полка получает компактный section-contained заголовок, согласованный с существующим контекстом страницы, городами/фильтрами и нижней навигацией. Следующая полка заменяет его при scroll вниз, предыдущая возвращается при scroll вверх. Последнее действие карточки достижимо, focus не прячется за chrome. Это продуктовый результат, не только установка измерителей.

В существующем EventLayout один совместимый механизм occupied-space учитывает top chrome, nav, date accessory, event CTA и нижние уведомления. **Принятый skin nav, четыре destinations и текущий page context сохраняются.** Не создаются второй toast/controller или копии карточек.

Shared regression: Today, Free, event-detail. Четырёхролевая Search-композиция проверяется в UI fixture с canonical cards; живой ASR/backend и новый публичный voice Search в FI-P1 не входят. Из release bindings в P1 входят **readonly geometry/status/served interfaces и UI fixtures**, не полное внедрение relay/analytics/profile backend.

## 2. Scope, fresh-read и безопасный baseline

**Входит:** adapter над существующим shell; occupied rects/insets; защита last CTA/focus; согласование lower-surface offset; C2 на Popular; UI-only C4 specimen; source-bound projection нужных состояний; 32 core сценария и пять binding-cases; immutable preview через действующий pipeline после реализации.

**Не входит:** production promotion и full-site normalization closure; fonts/palette/shared foundations; новый header skin над hero; массовый singleshelf redesign; data-quality/ranking rewrite; живые provider/микрофонные calls; новый Penpot file, builder, QA platform, outbox, transport или profile service. Reverse analytics/media delivery и downstream readout не объявляются готовыми по UI mocks.

Перед кодом fresh-read executable trunk `events-bot-new:agent/static-site-single-kaggle-contract`, #621 latest comments, DS contract/STATUS и затронутые families. Исходный проверенный source pin `2fe28b1f831ac607c0415a8aa6c2beab9eb67fac`, public `0b08f0a806a9531c8bf253672e1bb5c712764064`; **не откатывать будущий trunk к этим SHA**. Late documentary #587 extension прочитан на `c048ebe…`, его provenance — в release-bindings.

Один coherent batch в существующей CODE/family-owner lane. Не интегрировать новый продукт в историческую R0-ветку. При пересекающейся текущей правке shared EventLayout можно готовить pure policy/fixtures, но не писать второго конкурирующего owner. Незавершённая unrelated page и отсутствие полного P всего сайта не запрещают работу над подготовленным target.

Baseline cases: Popular top и две фактические полки; Today nav+date accessory; Free initial/append/last CTA; event-detail реального donor 5370 либо актуального аналогичного corpus event с gallery/CTA. Сам ID 5370 не заменяет будущие wide/narrow/no-image C5 cases. Сохранить exact source/corpus/clock, route, DOM/component/asset IDs, known deviations и available S/P. Missing native P остаётся pending, не искусственной тройкой A=S=P.

## 3. Source integration — конкретные места и ограничения

| Место | Действие | Сохранить |
|---|---|---|
| `site/src/layouts/EventLayout.astro` | Найти actual owners page context/bottom stack/lower-surface state; расширить их единым measured adapter. | Один writer общих CSS vars, один route-mode resolver. |
| `site/src/components/MobileBottomNav.astro` | Зарегистрировать root/controls как primary_navigation. | Четыре ссылки, один aria-current, existing skin и desktop/mobile reuse, никакого hide-on-scroll. |
| `site/src/components/Reference4MobileMenu.astro` | Отдать actual bounds/state, включая brand-tag overhang. | Moving-parent donor, current close paths; без нового modal/backdrop/body lock. |
| `site/src/components/MobileToastRegion.astro` | Получать общий offset/obscured state через existing lower-surface owner. | Queue/dedupe/generation/pause/persistent errors-actions, один announcement owner, cleanup. |
| Actual date accessory / `EventCtaPanel.astro` / event lower owner | Согласовать их occupied-space dependencies. | Nav XOR CTA, hero/body/terminal boundaries, domain actions. |
| `PopularListingSurface` и actual heading/section family | Stable section boundaries/IDs + compact sticky variant с собственными controls. | Rail/grid/EventCard/data order/cities; не создавать route-local lookalike. |
| `KeyboardEventNavigation.astro` → `keyboardEventNavigation.mjs` и существующая scroll logic | Подключить common insets/rects к текущему focus/scroll owner. | Один глобальный listener/controller; native field/IME/overlay exemptions. |
| Existing status/list/personalization/analytics adapters | Реализовать typed readonly мост RB-01–03 и fixtures. | Shell не dispatch/retry/store/log raw payload; actual served identity принадлежит renderer, consent/exposure — существующему owner. |
| `site/src/design-system/astro-family-registry.v1.json`, existing projections/materializer | Candidate versions/properties/resolved geometry затронутых семей. | Native lineage и exact assets; никаких выдуманных UUID. |
| Existing `/lab/design-system/` catalogue, `site/src/data/design-system-production-surface-contract.v1.json` | Candidate showcase, target consumer mapping и нужные states. | Lab не становится production route; accepted default version не меняется до review. |
| `docs/testing/static-site-autotest-scenarios.v1.yml`, existing browser harness | Добавлять исполняемые cases из §6, переиспользуя equivalent IDs. | L0/L1/L2 adapters, true auth/side-effect classification; planned не implemented. |
| Feature README, `mobile-shell.md`, `CHANGELOG.md` | Source/variant routing и адресный before→after реализации. | Нет пересказа всех FI/RB правил в новые хронологические документы. |

Если эквивалентных модулей нет, предложенные внутренние места: `site/src/lib/islandLayout.mjs` (pure policy) и `site/src/lib/islandLayoutRuntime.ts` (DOM adapter). Сначала искать actual owner, не создавать дубль ради имён. Никаких network/persistence/business data в этих модулях.

Предложенные тесты: `site/tests/island-layout.test.mjs`, `site/tests/island-layout-lifecycle.test.mjs`; при необходимости `site/e2e/islands/` как feature suite существующего runner, не самостоятельная платформа. Script добавляется вместе с реальным entrypoint; lockfile/dependencies не обновляются ради простой геометрии.

### Pure policy contract

Вход: normalized viewport/safe bounds, modes/roles, measured rects, lanes/scopes, protected controls, interaction lock/current layout. Выход: placements/mode, occupied union, conservative compatibility insets и lane blocked intervals. Повторный instance ID обновляет участника; cleanup идемпотентен. Unknown role/non-finite/negative geometry не порождают NaN CSS. Dangling callbacks после route change не перемещают focus. Приоритеты/деградация — FI-09, не произвольный priority от страницы.

В прочитанном source nav использует `--mobile-nav-h` (базово 64px в EventLayout), width `min(480px, viewport − 2 × --ke-space-3)`, existing radius и equal tracks. Это source values, **не подтверждённые computed values всех viewports**. На target baseline извлечь реальные значения и наследовать их; не создавать новый token set. Новые behavioral knobs — readable budget/hysteresis/feature enablement; material changes требуют адресного owner review.

## 4. Этапы и rollback

**P1a — совместимость:** exact affected baseline, pure policy/lifecycle tests, single writer. Feature OFF не меняет существующие DOM/data/geometry. RB adapters используют существующие owners; не создают новый транспорт или обязательную телеметрию.

**P1b — видимый consumer:** C2 включается на Popular только в isolated candidate через existing selection mechanism. Если нужен новый key: proposed `islands.section-context.v1`, default OFF и allowlisted composition, не произвольный query-param для server functions. C4 specimen — mocked_ui, ноль ASR/provider/product-mail side effects.

**P1c — regression/S:** core cases + пять release-binding fixtures. Target frames получают реальную source-bound projection. Native P материализуется через существующего sole writer при фактическом доступе/bindings; missing P не превращается в PASS. Остальные valid результаты сохраняются отдельно.

**P1d — owner review:** опубликованный create-only immutable candidate через текущий Kaggle builder. Владелец получает Popular baseline/candidate и действия «прокрути вниз/вверх, дойди до последней карточки, открой окно». Verdict по конкретным cases, не общий «сайт нормализован».

Rollback: выключить candidate key/откатить coherent batch; accepted shell/nav/CTA работоспособны. Data schema migration отсутствует. Active task не уничтожается при toggle. Production mixed-version rollout **не разрешён здесь**: будущий контракт должен указать owner/scope/removal deadline, иначе новая accepted family мигрирует всех production consumers одной поставкой. Старый код удаляется только по actual zero-consumer evidence.

## 5. Критерий поставки

На одном source/corpus опубликованном candidate подтверждены:

1. Popular: прежний content/order/cards, обратимый section context, существующий page context без дублей; nav доступна после обычного scroll.
2. Today/Free/event-detail: нет stack collisions и double safe area, last CTA/Tab target видимы; nav XOR CTA сохранён.
3. Search UI specimen: четыре роли, pressure fallback, input DOM/IME/selection/Stop стабильны; никаких backend claims.
4. RB fixtures: receipt states правдивы, actual occlusion/served interface согласован, visible-prefix/hide policy не обходится, optional OFF остаётся OFF.
5. Есть исполняемые tests и exact evidence; для A=S=P — настоящие S и native P по active contract. Missing native/backend/device layers прямо обозначены.

Source readiness, published browser verification, A=S=P и owner visual acceptance — разные свидетельства, не один глобальный DONE. Общий STATUS из documentary lane не изменяется.

## 6. Автотесты

**32 основных сценария ниже + 5 обязательных binding-cases в [release-bindings-v1.md §6](release-bindings-v1.md#6-пять-дополнительных-acceptance-cases--в-том-же-harness). Все пока спроектированы, не выполнены.** Proposed `islands.*` IDs в существующий registry попадают вместе с кодом; equivalent existing IDs переиспользуются.

L0 — pure/contract, L1 — browser, L2 — native emulator/simulator, L3 — physical device. P2+ означает gate соответствующей последующей активации, не лишний backend scope P1.

| ID после `islands.` | Given → When → Then | Уровень / этап |
|---|---|---|
| `registration` | Зарегистрированный root → update/init/unregister → один participant/controller/offset, повторный cleanup безопасен. | L0/L1 P1 |
| `rect_union` | Overlap и разнесённые X rects → расчёт → нет double sum; lane учитывает свои препятствия. | L0 P1 |
| `invalid_geometry` | Unknown/NaN/negative/disconnected → update → safe diagnostic/fallback, не NaN CSS/потеря nav. | L0/L1 P1 |
| `safe_area_once` | Safe bounds + nav/accessory → rotate/resize → safe inset ровно один раз, last-content space соответствует stack. | L0/L1 P1; L2 перед mobile promotion |
| `viewport_coordinates` | VV offsets/scale/DPR → normalize → CSS units едины, screenshot mapping отдельно, scale не удвоен. | L0/L1 P1; L2 zoom/keyboard |
| `budget_degradation` | Long title/short viewport/много ролей → pressure → детерминированный compact/focus/flow, не уменьшение fonts/targets. | L0/L1 P1 |
| `observer_stability` | Font/wrap/padding/ResizeObserver → update → стабилизация без loop/duplicate listeners. | L1 P1 |
| `pointer_lock` | Held Stop/CTA → status/layout → control не подменён; неизбежная потеря geometry отменяет gesture без чужого action. | L1 P1 mock; L2 P2+ |
| `ime_identity` | Selection/IME → layout transition → тот же input DOM/text, Enter не submit во время composition. | L1 P1; L2 P2+ |
| `nav_contract` | Nav-mode route → top/middle/end → четыре destinations, один current, нет hide-on-scroll/второй primary row. | L1 P1 |
| `date_stack` | Date accessory + notice + nav → resize/date choice → нет overlap, date availability semantics прежние. | L1 P1 |
| `cta_exclusion` | Immersive event → hero/body/terminal → nav XOR CTA и все labels/actions сохранены. | L1 P1 |
| `context_down_up` | Popular две реальные полки → down/up boundary → правильный следующий/предыдущий H2, без duplicate heading. | L1 P1 |
| `context_scope` | Short/long section и overflow ancestor → scroll → sticky в своём lane/section; short/explanation не перекрывает следующий. | L1 P1; explanation P2+ |
| `last_action` | Append/последняя карточка → scrollIntoView/Tab → весь target+focus outline доступны над stack. | L1 P1 |
| `transparent_gaps` | Разнесённые islands → click/scroll между ними → underlying content доступен, нет invisible click-plane. | L1 P1 |
| `focus_traversal` | Visible controls → Tab/Shift+Tab/jump → логичный order, focus не hidden/inert/occluded. | L1 + manual AT P1 |
| `menu_semantics` | Existing menu → все close paths → donor сохранён, нет нового body lock, Escape не закрывает чужих owners. | L1 P1 |
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

Binding-cases: `receipt_status`, `exposure_served_bridge`, `profile_freeze`, `global_hide_history`, `optional_off`. Их полные Given/When/Then и owner separation — только в release-bindings, не дублируются здесь.

### Размерность проверок

L0 целиком при изменении pure policy. P1 L1: Popular 390×844 и 1280×800; pressure 320×700 и 844×390; Today/Free/event-detail по representative mobile+desktop. Дополнительные 430/768/1728 и актуальные 1440/1920 owner-review widths — при изменении responsive branch, не декартово произведение всех routes/states/browsers. Feature promotion добавляет Chromium/Firefox/WebKit representative transitions по общему strategy; WebKit headless не native Safari. L2 — короткая выборка keyboard/mobile задач, L3 — физический capture/device gap.

## 7. Accessibility

Primary island touch controls: проектная цель hit area ≥44×44 CSS px с accessible name и проверкой соседних targets/focus. Это выбранный продуктовый target, **не утверждение о всеобщем AA требовании 44px**; inline article links не превращаются в большие buttons. Основание: [W3C Target Size Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced).

Настоящие H1/H2/landmarks, buttons/links и current/expanded/pressed states. Нельзя поставить role=button на весь остров с несколькими actions или role=toolbar без его keyboard contract. Compact title сохраняет смысл; mic/stop/close различимы не только цветом. Нет positive tabindex, disable zoom, hidden focused controls или двойных aria-live сообщений.

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

Per-case evidence: scenario, exact source/pattern/component versions, build/route, corpus+clock, viewport/DPR/scale, auth/activation/consent/projection states где применимы, layout/occupied/protected rects, served identity/order, steps/outcome, console errors, screenshots/hash и S/P binding status. Не копировать старые CODE counts как собственный запуск. Geometry oracle не заменяет настоящую device/DB/network проверку.

A=S=P — одинаковый deterministic корпус и exact identities; current-real preview — актуальное продуктовое review. Один frozen real snapshot может выполнять обе роли, если версии/clock совпадают. Активный conformance contract задаёт допуски; новый удобный threshold не придумывается. Optional analytics OFF и отсутствие private data в fixtures проверяются отдельно.

## 9. После FI-P1

| Пакет | Продукт | Gate |
|---|---|---|
| P2 | C2 у остальных подготовленных consumers и один подходящий C3 singleshelf | Target baselines/owner review P1; не переносить sticky на empty/short/info автоматически. |
| P3 | Настоящий C4 conversation | Current #587 implementation, native keyboard/capture/receipt, FI-16 и RB-01–03; полный Search→hide→обычная подборка→receipt→authorized aggregate integration отдельно. |
| P4 | Partial detached header/media-from-top C5 | Actual underlays/crop/contrast/P и owner review, не массовая замена шапки. |
| Promotion | Approved selected variants в production | Existing release authority, migration/rollback и явное разрешение deployment. |

P2/P3 не ждут всей P4 или чужой незавершённой страницы. Design/fixtures могут идти параллельно, shared runtime owner интегрируется последовательно. #47 владеет pattern, #587 — Search/release interfaces, #621 — текущей интеграцией. Новые агенты или управляющие службы не нужны.

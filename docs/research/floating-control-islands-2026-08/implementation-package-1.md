# FI-P1 — shared geometry + реальный контекст полок

Дата: 2026-09-05. Статус: **готовый проект первого implementation-пакета; код и тесты пакета ещё не реализованы**.

Владелец требований — [system-design-v1.md](system-design-v1.md), идентификаторы FI-01–FI-20. [Матрица](consumer-matrix-v1.md) задаёт применимость; [источники](sources-and-decisions-v1.md) различают source/public/P и уже выполненные наблюдения. Этот файл — границы и проверяемая приёмка работы, не второй управляющий контур и не предложение перепроектировать систему с нуля.

## 1. Что пользователь получает в первой поставке

На **`/populyarnoe/`** текущая содержательная полка получает компактный section-contained заголовок, согласованный с уже существующим контекстом страницы, городами/фильтрами и нижней навигацией. При движении вниз заголовок следующей полки заменяет прежний; при движении вверх возвращается предыдущий. Последнее действие карточки не прячется за нижними поверхностями. Это видимая продуктовая цель, не только установка измерителей.

За этим стоит один совместимый механизм занятой области в существующем EventLayout. Он учитывает nav, date accessory, event CTA, нижнее уведомление и верхний chrome. **Не меняется принятый внешний вид nav, не создаётся второй toast/controller, не переделываются карточки.** Текущий компактный page context сохраняется; новый section context его не дублирует.

Зависимости проверяются на Today, Free и event-detail, поэтому пакет не превращается в page-local «исправление Popular». Четырёхролевая Search-композиция проверяется в UI fixture с реальными каноническими карточками; живой голосовой backend и новый публичный Search не входят в FI-P1.

## 2. Точные границы

**Входит:** геометрический adapter над действующим shell; occupied rects/insets; защита last CTA/focus; адаптация существующего lower-surface offset; одно направление разделов C2 на Popular; маленький UI-only integration specimen C4; source-bound SoT projection необходимых состояний; адресные тесты; опубликованный immutable preview через текущий pipeline после реализации.

**Не входит:** production promotion; full-site normalization closure; смена fonts/palette/общих foundations; новый header skin над hero; массовое оформление всех полок отдельными поверхностями; менять data quality/персонализацию; ASR, микрофонные разрешения или provider вызовы; новый Penpot file; новый builder/QA platform/оркестратор; внедрение новых моделей/зависимостей ради измерения rects.

### Первый безопасный baseline

До кода прочитать fresh HEAD executable trunk `events-bot-new:agent/static-site-single-kaggle-contract`, #621 latest comments, DS launch contract/STATUS и текущие изменённые семейства. На момент проектирования source HEAD `2fe28b1f831ac607c0415a8aa6c2beab9eb67fac`, published `0b08f0a806a9531c8bf253672e1bb5c712764064`. Не откатывать будущий trunk к этим SHA.

Пакет реализуется в существующей CODE/family-owner lane, один coherent batch, не в исторической R0-ветке. Пока общий UI family owner занят пересекающимся изменением, можно готовить pure geometry tests/fixtures; нельзя параллельно переписывать EventLayout и потом объявлять конфликт чужой проблемой. Это coordination dependency, не запрет на документальный дизайн.

Базовые cases: Popular top/две фактические полки; Today nav+date accessory; Free initial/append/last CTA; event-detail реального review donor 5370 или актуального сопоставимого corpus event с gallery/CTA. ID 5370 не подменяет обязательные wide/narrow/no-image варианты поздней C5 приёмки. В каждом case сохранить exact source, corpus/clock, routes, actual DOM/component/asset IDs, known deviations и доступную структурную проекцию. Неполный P явно остаётся pending; эта запись не разрешает объявить A=S=P.

## 3. Пакет кода — где и что меняется

| Существующее место | Конкретное действие | Ограничение |
|---|---|---|
| `site/src/layouts/EventLayout.astro` | Найти действующих owners page-context, bottom stack и lower-surface state. Подключить один adapter; публиковать измеренные top/bottom insets и scope-aware rects. | Не оставлять старый и новый writers одних CSS vars активными одновременно. Route-mode resolver остаётся один. |
| `site/src/components/MobileBottomNav.astro` | Зарегистрировать существующий root/controls как primary_navigation; сохранить четыре ссылки, selected semantics и существующий skin. | Не копировать компонент для desktop. Не добавлять hide-on-scroll. |
| `site/src/components/Reference4MobileMenu.astro` | Предоставить actual occupied bounds и interaction state существующего меню, включая brand-tag overhang. | Не менять moving-parent donor, не добавлять неразрешённый modal/backdrop/body lock. |
| `site/src/components/MobileToastRegion.astro` | Подключить общий offset/occlusion state через существующий lower-surface owner; проверить cleanup. | Сохранить queue, dedupe, generation, pause и persistent action/error lifecycle. Не создавать второй aria-live канал. |
| Actual date accessory / `EventCtaPanel.astro` / event-detail lower owner | Обозначить внешние layout dependencies, согласовать измерения вместо локальной суммы высот. | Сохранить nav XOR CTA и текущие CTA boundaries; не менять transactional logic. |
| `PopularListingSurface` и существующая header/section family | Добавить только семантические section boundaries/стабильные IDs и вариант compact sticky context с принадлежащими ему controls. | Не копировать EventCard/rail/grid; city filter остаётся своим owner. Если нынешняя heading family не подходит, один узкий candidate component, не второй shell. |
| `KeyboardEventNavigation.astro` → `keyboardEventNavigation.mjs` и текущая scroll-context logic | Подключить доступные insets/rects к существующему focus/scroll owner; удержать native field/IME exemptions. | Не навешивать второй глобальный keydown/router. |
| `site/src/design-system/astro-family-registry.v1.json`, существующие projections/materializer | Зарегистрировать новые candidate properties/versions и resolved geometry только затронутых семей, экспортировать состояния. | P-binding не заполняется выдуманным UUID или screenshot frame. |
| Existing runtime catalog `/lab/design-system/`, `site/src/data/design-system-production-surface-contract.v1.json` | Добавить candidate showcase нужных states; authoritative consumer map без признания lab production-потребителем. | Default accepted versions не меняются до review/promotion. |
| `docs/testing/static-site-autotest-scenarios.v1.yml`, существующий browser harness | Добавить сценарии из §6 по мере появления исполняемых тестов; не ставить implemented/PASS заранее. | Переиспользовать L0/L1/L2 платформенные adapters; без реального mail/ASR в layout suite. |
| `docs/features/static-site-pages/design-system/README.md`, `mobile-shell.md`, `CHANGELOG.md` | Коротко связать feature/версию с этим pattern и зафиксировать адресные before→after изменения реализации. | Не копировать сюда все правила FI-* и не переписывать исторические July-лаборатории как актуальный контракт. |

Предлагаемое внутреннее выделение, **если эквивалентного модуля нет**: `site/src/lib/islandLayout.mjs` для чистого расчёта и `site/src/lib/islandLayoutRuntime.ts` для DOM adapter. Имена не основание создавать дубль: сначала расширить найденный актуальный owner. Модуль не содержит карточек, бизнес-данных, network calls, persistence или arbitrary event bus.

Proposed tests: `site/tests/island-layout.test.mjs`, `site/tests/island-layout-lifecycle.test.mjs` и suite в существующем browser runner (допустим один `site/e2e/islands/` adapter как feature suite, не самостоятельная тестовая платформа). Существующие package scripts и lockfile сохраняются; новый script объявляется только вместе с реально созданной точкой входа.

### Pure calculation contract

Вход: normalized viewport/safe bounds, роли/режимы, измеренные rects, scope/lane, защищённые controls, interaction lock, текущий layout mode. Выход: placement/mode, occupied union, conservative compatibility insets и per-lane blocked intervals. Регистрация одинакового ID обновляет участника, а не добавляет двойной offset. Unknown role и non-finite/negative geometry отвергаются/диагностируются, не порождают NaN styles. Unregister идемпотентен.

Приоритеты и degradation ladder — FI-09; модуль не принимает произвольный числовой priority от страницы. При interaction lock откладывается несущественная перестановка. Для исчезнувшего protected element используется контролируемый cleanup; dangling callback не перемещает focus на новую route.

### Начальные geometry bindings, а не новые foundations

В прочитанном source nav использует `--mobile-nav-h` (в EventLayout задано 64px), width `min(480px, viewport − 2 × --ke-space-3)`, существующий pill radius, четыре equal tracks. Это **source-наблюдение**, не гарантированные computed values на каждом viewport. FI-P1 извлекает реальные значения для выбранного baseline и наследует их; не заменяет их новым числовым token set.

Новые knobs ограничены behavior: выбранный в FI-09 readable budget, hysteresis переходов, feature enablement. Gap/radius/elevation/typography/icon box берутся из accepted family. Нужда в новом material token выносится адресным proposed diff для общего foundation owner, а не исправляется внутри Popular CSS.

## 4. Порядок реализации и отзыв изменения

**P1a — compatibility first.** Зафиксировать affected baseline; реализовать и проверить чистое вычисление и единую lifecycle registration. На выключенном варианте DOM/содержание/geometry существующих consumers не меняются. Compatibility vars имеют одного writer.

**P1b — один видимый consumer.** Включить C2 на Popular только в изолированном candidate через существующий механизм feature/candidate selection. Новый proposed key при отсутствии подходящего: `islands.section-context.v1`, default off, allowlisted composition, не произвольный query-param, дающий доступ к серверной функции. UI fixture C4 использует mocked_ui и гарантирует 0 ASR/provider/product-mail side effects. Это не новая опубликованная пользовательская voice capability.

**P1c — shared regression и S.** Прогнать матрицу core cases; устранить коллизии на Today/Free/event-detail без изменения их контентного дизайна. Снять exact structural/export evidence и browser behavior. Materialize необходимые native linked frames через существующего sole writer, когда его реальный доступ и bindings готовы. Blocked P не превращает все остальные результаты в выдуманный PASS.

**P1d — owner review, не production.** Через действующий Kaggle builder опубликовать create-only immutable candidate. Дать владельцу Popular baseline/candidate + краткие действия «прокрути вниз/вверх; дойди до последней карточки; открой окно». Зафиксировать verdict по конкретным cases, не общий «сайт нормализован».

Отзыв: выключить candidate key/откатить один coherent batch; accepted nav/CTA/shell остаются рабочими. Schema/data migration отсутствует. Если переключение допускается во время active task, owner сначала переводит её в безопасное состояние, не удаляя draft. Production mixed-version rollout **не разрешён этим документом**. Его будущий контракт должен назвать owner, scope и removal deadline; иначе новая accepted family мигрирует всех своих production consumers одной поставкой. Удалять старую реализацию можно после actual zero-consumer evidence, не после зелёного lab screenshot.

## 5. Проверяемая приёмка FI-P1

FI-P1 считается реализованным, когда на одном source/corpus опубликованном candidate лично подтверждено:

1. Popular: тот же контент/порядок/карточки, working section context down/up и existing page context без дублей; nav доступна после обычного scroll.
2. Общий shell: layout/interaction state не конфликтуют на Today/Free/event-detail; последний CTA и любой достигнутый Tab control видимы; нет двойной safe-area компенсации.
3. Отдельный Search specimen: четыре роли, compact/focus fallback и сохранение input DOM/IME/Stop при смоделированных transitions; никакого заявления о живом ASR.
4. Есть исполняемые тесты и exact evidence; отсутствующие native/P/backend уровни прямо названы. Для заявления A=S=P нужны действительные S и native P по active conformance contract, не лишь export readiness.

`SOURCE_READY`, `PREVIEW_BEHAVIOR_VERIFIED`, `ASP_VERIFIED` и owner visual acceptance — различные факты в отчёте, а не один самодельный глобальный статус. Не менять общий STATUS из отдельного окна без полномочий текущего владельца.

## 6. Автотесты: конкретные сценарии

Ниже **32 спроектированных сценария**. Они не запускались в документальном окне и ещё не добавлены как implemented в общий registry. `islands.*` — предложенные stable IDs. L0 — pure/contract; L1 — browser; L2 — native emulator/simulator; L3 — physical device. В колонке «Этап» P1 означает приёмку первой реализации, P2+ — дальнейшую активацию соответствующего consumer. Системные проверки нельзя заменить mock, даже когда mock полезен отдельно.

| ID после `islands.` | Given → When → Then | Уровень / этап |
|---|---|---|
| `registration` | Root зарегистрирован → update/повторный init/unregister → один participant, один controller, один итоговый offset; повторный cleanup безопасен. | L0/L1, P1 |
| `rect_union` | Два overlap rect и разнесённые по X острова → расчёт → overlap не суммируется дважды; lane учитывает только свои препятствия. | L0, P1 |
| `invalid_geometry` | Unknown role/NaN/negative/disconnected root → update → диагностируемое исключение/безопасный fallback, не NaN CSS и не потеря навигации. | L0/L1, P1 |
| `safe_area_once` | Safe bounds + nav + accessory → rotate/resize → safe inset учтён ровно один раз, reserved last-content space соответствует фактическому stack. | L0/L1; L2 перед mobile promotion |
| `viewport_coordinates` | VV offsets/scale и DPR различаются → нормализация → rects в одних CSS units, screenshot mapping записан отдельно; scale не удвоен. | L0/L1; L2 перед keyboard/zoom promotion |
| `budget_degradation` | Long title/короткий viewport/несколько ролей → budget не проходит → фиксированный compact→focus/flow ladder; размеры шрифта/targets не уменьшены. | L0/L1, P1 |
| `observer_stability` | Font load/wrap/reserved padding → несколько ResizeObserver callbacks → расчёт стабилизируется, нет нескончаемого loop/duplicate listeners. | L1, P1 |
| `pointer_lock` | Pointer удерживает Stop/CTA → layout/status меняется → control не подменён; при неизбежной геометрической потере gesture отменён без чужого действия. | L1, P1 UI mock; L2/P2+ capture |
| `ime_identity` | Input с selection и незавершённой composition → compact/focus transition → тот же DOM/input state; Enter не submit во время IME. | L1, P1; L2/P2+ |
| `nav_contract` | Любой nav-mode route → scroll top/middle/end → четыре прежних destinations, один aria-current, nav не исчезает от scroll, нет дублирующего primary row сверху. | L1, P1 |
| `date_stack` | Today date accessory + notice + nav → изменение размера/active date → нет пересечения, выбор доступной даты не изменён. | L1, P1 |
| `cta_exclusion` | Event immersive → hero/body/terminal transitions → nav XOR CTA по действующему owner; все label/actions сохранены. | L1, P1 |
| `context_down_up` | Popular две реальные полки → пересечь boundary вниз и вверх → следующий/предыдущий compact H2 корректен, без stale duplicate heading. | L1, P1 |
| `context_scope` | Long/short section и unintended overflow ancestor → scroll → sticky ограничен section/reading lane; short/explanation case не перекрывает следующий. | L1, P1; explanation fixture P2+ |
| `last_action` | Free/Popular append, финальная карточка → scrollIntoView/Tab → весь target и focus outline достижимы выше occupied stack. | L1, P1 |
| `transparent_gaps` | Разнесённые острова → click/scroll через свободную область между ними → underlying content получает действие, нет невидимого backdrop. | L1, P1 |
| `focus_traversal` | Все visible controls/keyboard targets → Tab/Shift+Tab/jump → логичный order, focus не hidden/inert/полностью или частично перекрыт. | L1 + manual AT, P1 |
| `menu_semantics` | Existing global menu → open/close/Escape/outside/scroll → donor paths сохранены, нет нового body lock; Escape не закрывает соседние owners. | L1, P1 |
| `modal_gallery` | Открытая gallery/modal → keys/Tab/close → только active owner интерактивен, нет background shortcuts, focus возвращён живой цели. | L1, P1 |
| `toast_lifecycle` | Passive/error/action toast + replacement → focus/hold/hidden/modal/time → pause/dedupe/generation корректны; error/action не исчезают как passive. | L0/L1, P1 |
| `announcement_ownership` | Inline progress/status + toast → semantic update → одно нужное announcement, нет focus theft/повторной озвучки каждой геометрии. | L1 + manual AT, P1 |
| `four_roles` | Search mock header/context/composer/nav → достаточно места → все роли совместимы; при малом месте fallback по budget, не жёсткий лимит числа островов. | L1, P1 specimen |
| `section_target_independence` | Просматривается A, refinement B, pending C → scroll/ответ → три значения не подменяют друг друга. | L0/L1, P2+; adapter fixture P1 |
| `one_shot_reveal` | Submit выделил draft → один reveal → ручной scroll истории → поздний answer → anchor остаётся, доступно «Новый ответ», нет второго автоскролла. | L0/L1, P2+; adapter fixture P1 |
| `growth_history` | Expand/late image/append в старом section → Back/Forward/restore → тот же entry/anchor, не новый submit; native/app restoration не выполняются оба. | L1, P2+ |
| `capture_overlay` | Recording active → request blocking overlay → stop/finish ack либо deferred open; недоступного активного Stop нет. | L0/L1 mock, P2+; L2/L3 реальный capture отдельно |
| `keyboard_native` | Реальная Android/iOS клавиатура, включая dismiss/rotation → focus layout → поле/Stop/submit/close доступны, nav восстанавливается; OSK не подменена resize mock. | L2, перед mobile composer promotion |
| `zoom_reflow` | 200% text / 400% browser zoom, narrow/landscape → чтение/input → нет потери функций/неоправданного horizontal page scroll, pinning уступает читаемости. | L1 + L2 pinch subset, P1 affected chrome |
| `underlay_contrast` | Plain/photo/poster/saturated/graphite underlay → compact/expanded → readable label/icon/focus с теми же asset identities; отсутствие blur не ломает contrast. | L1 + visual, P1 existing; P2+ new header |
| `fallbacks` | No JS/no VV/slow fonts/reduced motion/forced colors → открыть affected route → контент/навигация рабочие, meaningful status не исчезает вместе с animation. | L1, P1 |
| `projection_lineage` | Exact source/corpus/S/P → сверить fields/assets/geometry/variants → mismatched binding FAIL, missing native binding BLOCKED, screenshot не native component. | L0 + native readback + visual, P1 affected claims |
| `negative_consumers` | Feature off и незатронутые Home/info/Free/card consumers → comparison → нет скрытой смены font/grid/data/CTA/навигации, нет утечки experimental flag в production manifest. | L0/L1, P1 |

### Разумная размерность, не матричный взрыв

L0 запускается целиком на каждой правке pure policy. Для P1 L1: Popular в 390×844 и desktop 1280×800; narrow 320×700 и landscape 844×390 для pressure; Today/Free/event-detail — по mobile+desktop representative cases. Дополнительные 430/768/1728 и текущие 1440/1920 owner-review widths используются там, где меняется branch/geometry; не умножать все 32 сценария на все 17 архетипов без нового риска. На feature promotion добавить Chromium/Firefox/WebKit representative transitions согласно общему strategy. Native keyboard — короткая L2 выборка реально затронутых mobile задач, L3 только для непокрытого device/capture риска.

## 7. Accessibility acceptance без уменьшения интерфейса

Primary touch controls island-композиции: целевой hit area не менее 44×44 CSS px, с корректной accessible name; это **выбранный продуктовый target**, а не утверждение, что WCAG AA повсеместно требует именно 44px. Inline text links в обычной статье не превращаются в гигантские кнопки. Проверять соседние hit areas и видимый focus, не только bbox декоративной иконки. Основание различия — W3C [Target Size Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced).

Заголовки, landmarks, buttons/links, expanded/pressed/current states остаются нативно семантичными. Не назначать всему острову role=button, если внутри несколько действий; не добавлять role=toolbar без полного keyboard contract. Compact title имеет полный доступный смысл; icon-only close/mic/stop различимы не только цветом. Навигационные ссылки остаются ссылками, а не JavaScript кнопками перехода.

Контраст текста/controls/focus проверяется на фактическом подслое согласно действующим accessibility требованиям DS; прозрачность/blur не считаются достаточным доказательством. Forced colors и отсутствие backdrop-filter имеют usable fallback. Не выставлять `user-scalable=no` или maximum-scale=1 ради совпадения геометрии. Интерактивное сообщение нельзя сделать недостижимым из-за таймера или aria-hidden оболочки.

Automated accessibility scan полезен, но не заменяет keyboard traversal и короткую проверку screen-reader announcements/heading traversal. Headless WebKit не называется Safari с настоящей клавиатурой.

## 8. Исполнение проверок и доказательства

Проверенные существующие команды на source `2fe28b1…`:

```sh
npm --prefix site run check:astro-family-sot
npm --prefix site run check:design-system-production-surfaces
npm --prefix site run check:design-system-iconography
npm --prefix site run test:browser-release-gate
```

Focused/browser команды (`local:focused`, `check:keyboard-event-navigation`, `check:desktop-cta-geometry`, `check:browser-release`, `check:listing-desktop-geometry`) существуют, но их target/config нужно брать из актуальных runners и immutable artifact, не запускать на случайном старом dist. Новые unit tests запускаются существующим Node test runner после создания файлов. Нельзя написать «32 passed», потому что есть только таблица из §6.

**Найденная routing неточность:** старый `.codex/skills/static-site-design-system/SKILL.md` требует `check:design-system`, однако такого script нет в прочитанном `site/package.json`. Это не основание пропустить проверки или добавить пустой alias. Использовать реальные family/surface/iconography gates и адресно согласовать исправление ссылки с владельцем; в данном docs-only пакете skill/runtime не менялись.

Evidence per case: test ID, exact source/pattern/component version, route/build ID, snapshot/corpus+clock, viewport/DPR/scale, auth mode, layout mode, visible/occupied rects, protected control rects, steps/outcome, console errors, screenshot hashes и S/P binding status. Старые CODE test counts не переносятся в новый отчёт как собственный запуск. Diagnostic overlap metric не заменяет факт доступности control или визуальную проверку.

A=S=P сравнивается на одном deterministic корпусе; current-real preview нужен для актуального пользовательского review. Можно использовать один зафиксированный реальный snapshot в обоих ролях, если identities/clock одинаковы; нельзя смешивать произвольные свежие данные. Общая conformance authority остаётся active `kenigevents.asp-conformance`, не новый числовой diff threshold из FI-P1.

## 9. Что следует после первого пакета

| Пакет | Добавляемая продуктовая часть | Входной gate |
|---|---|---|
| P2 | C2 в остальных подготовленных multi-section consumers, C3 на одной действительно подходящей полке | Реальные target baselines и owner review C2/P1; variant не переносится механически на empty/short/info. |
| P3 | C4 — настоящий conversational composer/answer sections | Совместимая #587 implementation; state/scroll tests, capture/overlay handshake и обязательный native keyboard evidence. |
| P4 | Частичный detached header и media-from-top C5 | Owner review на реальных plain/photo/poster/graphite underlays; точные hero/crop/contrast/P bindings, не общая замена всех headers. |
| Promotion | Выбранные approved variants в production, drift gates и удаление старых callers | Existing release authority, component migration/rollback contract, required conformance и явное разрешение на deployment. |

P2/P3 не обязаны ждать всего P4 или нормализации непричастных страниц. Design/fixtures можно вести параллельно; изменения одного shared runtime owner интегрируются последовательно. #621 остаётся существующей coordination точкой, #47 — владельцем паттерна, #587 — владельцем Search. Новые агенты/службы управления для этого не требуются.

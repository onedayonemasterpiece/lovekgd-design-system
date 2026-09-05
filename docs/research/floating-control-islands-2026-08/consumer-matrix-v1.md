# Floating Islands — потребители и состояния v1

Дата: 2026-09-05. Владелец: [system-design-v1.md](system-design-v1.md), `pattern.detached-chrome-control-islands`. Это **проектная применимость**, не production adoption или A=S=P PASS.

**Уточнение v1.1:** для migrated consumers применяется [единая верхняя строка](top-row-composition-v1.1.md). Page/section/filter/menu выбирают совместимые компактные представления в одном band; настоящие H1/H2 остаются в документе, сверху — locator/disclosure без второго heading/control tree. Старый section-contained sticky допустим только у явно немигрированных consumers, не одновременно вторым этажом. [Release bindings](release-bindings-v1.md) сохраняются. C1–C6 и pattern ID не заменяются новыми идентичностями.

## 1. Полнота и единица учёта

Основание: `site/src/data/design-system-production-surface-contract.v1.json` и `site/src/design-system/astro-family-registry.v1.json` в events-bot-new на срезе `2fe28b1f831ac607c0415a8aa6c2beab9eb67fac` / неизменённых соответствующих файлах его предка `d1cc5c7d3e5756ea3f5cc0f240541d6fc95a52c1`. В них **17 именованных archetype IDs**; каждый ниже присутствует ровно один раз. Route family и число ссылок review-hub — разные единицы: information-pages имеет два маршрута. CODE 18 review links не называются восемнадцатью независимо проверенными canonical IDs.

Generated calendar dates, отдельная материализованная подборка и конкретное событие — потребители своих families. Не создаём новый archetype ID ради строки в таблице. Перед миграцией release route manifest сопоставляется с реестром; непокрытый пользовательский route — конкретный coverage gap, не молчаливое исключение.

Служебные `/lab/`, `/__preview/`, диагностические маршруты и их polish не входят в продуктовую миграцию. Shared component, влияющий на пользовательские страницы, не исключается из зависимостей из-за слова `Prototype`, `Lab` или диагностического marker в имени.

Общие роли C1–C6 описаны в спецификации. «Допустимо» означает обоснованную проектную опцию; «выбрано» — вариант для candidate, ещё не owner-approved skin.

## 2. Матрица всех зарегистрированных архетипов

| Archetype ID / маршруты | Проверенный registry owner | Выбранная композиция / применимость | Контекст и граница островов | Не менять |
|---|---|---|---|---|
| `home` — `/` | `HomePage` | C1; C2 только при содержательных разделах; hero placement требует отдельного baseline | Brand/global, nav и локальные действия сцены. Полки остаются в полотне. Splash — существующее исключение, не скрытый новый shell. | HomeHeroTalk/scene lifecycle, ссылки, no-JS/reduced-motion fallback. |
| `today-listing` — `/segodnya/` | `TodayReviewGuard` | C1 + date accessory; C2 для существующих временных разделов | Дата/город — контекст выборки, не fifth destination. Верхний summary не дублирует нижний accessory без явной миграции. | Availability inventory, disabled dates, время/сортировка, rails/медальоны. |
| `tomorrow-listing` — `/zavtra/` | `DateListingSurface` | C1; C2 при реальных разделах | Общая date/listing semantics, без нового режима только для завтра. | DateListing family, абсолютная дата/timezone. |
| `weekend-listing` — `/vyhodnye/` | `WeekendListingSurface` | C1/C2 | Период и активный раздел в общей row; весь список дат/событий не закрепляется. | Weekend, включая воскресенье; content order. |
| `popular-listing` — `/populyarnoe/` | `PopularListingSurface` | **C2 — первый one-row consumer** | Page locator, context/control полки и global menu в одной полосе; down/up меняет section scope. H2 остаётся в потоке; cities не создают второй sticky этаж. | Источники/ранжирование, карточки/счётчики, underlying rail geometry. Не придумывать medallion без binding. |
| `collections` — `/podborki/` и дочерние, включая `/podborki/besplatnye-sobytiya/` | `CollectionCatalogRouteComposition`; Free — `FreeCollectionSurface.astro` | Каталог C1; Free C1/C2 при содержательных разделах; C3 лишь для одной отдельной полки | H1 — осмысленный заголовок, count — metadata. Одиночная content shelf может быть detached в потоке; вверх только её контекст/controls. | Общая сетка и единый membership pool; без искусственных «бесплатных выставок» отдельным списком. |
| `festivals` — `/festivali/` | `FestivalsTimelineRouteComposition` | C1/C2 | Контекст участка timeline; категории/временная ось остаются контентом. | Timeline/grouping, event/festival semantics. Дочерние routes — по manifest, не угаданным URL. |
| `exhibitions` — `/vystavki/` | `ExhibitionsRouteComposition` | C1; C3 для одной полки/deck; C2 для нескольких | Контекст/controls существующей surface. Compact deck на mobile/media window desktop сохраняют owners. | Graphite/light и accepted media geometry, read/unread/feedback; без exhibition-форка в общих списках. |
| `favorites` — `/izbrannoe/` | `FavoritesRouteComposition` | C1/C2; C6 для подтверждения | Saved context, без нового primary nav для удаления. Empty state не создаёт пустой pinned context. | Saved-state/обратимость; не новый Auth flow. |
| `search` — `/poisk/` | `SearchRouteComposition` | Idle C1; **C4 разговорного режима** | Shared top row показывает прочитанный section, отдельный composer — выбранную базу уточнения; nav отдельный. | Auth, Search, canonical cards. Viewed/refinement/pending различны; backend/API принадлежит #587. |
| `for-me` — `/dlya-menya/` | `ForMeRouteComposition` | C1/C2 | Personal context; skeleton/error/empty — existing owner. | Профиль/consent/data; local layout mock не backend acceptance. |
| `focus-group` — `/fokus-gruppa/` | `FocusGroupProgrammeSurface` | C6 | Программа/формы; нижние confirmations/errors не passive-expire. | OTP/consent/intake/raffle/keyboard; диагностику не превращать в продуктовый showcase. |
| `artifacts` — `/artefakty/` | `ArtifactCollectionRouteComposition` | C1; C3 для одного отдельного блока | Коллекция — content; уведомление — свой lifecycle. | Native identity, earned/locked states и раскрытие; без emoji/похожих SVG. |
| `event-detail` — `/sobytiya/*/` | `EventDetailRouteComposition` | **C5**, CTA вместо nav в immersive режиме | Page/event context + только соответствующий ему medallion; CTA/gallery со своими boundaries. | H1→текст→practical→related; wide/narrow/no-image, CTA/transport/gallery. |
| `interest-clubs` — `/kluby-po-interesam/` | `InterestClubsIndexRouteComposition` | C1/C2 при разрешённой public surface | Контекст каталога/группы; не новый fixed action на каждую карточку. | Publication gate/membership; source presence не public reachability. |
| `unusual-events` — `/neobychnoe/` | `UnusualListingSurface` | C1/C2 при опубликованном контенте | Quality-gated state не маскируется красивой полкой. | `not_approved`/quality gates; без фиктивных событий. |
| `information-pages` — `/partners/`, `/partnerstvo/` | `PartnersRouteComposition`, `PartnershipRouteComposition` | C6 | Минимальная page/global/nav composition; на короткой странице лишний context не нужен. | Links/contacts/forms/типографика/footer, достижимость service/legal. |

Generated `date-*` применяют DateListing/calendar contract после actual ownership mapping. Transport sections и festival detail в release manifest сохраняют соответствующих owners, не переподчиняются новому template этой таблицей.

## 3. Композиции: anatomy, fallback и пользовательская проверка

| ID | Anatomy | Когда дополняется | Fallback | Проверка |
|---|---|---|---|---|
| `C1` / `islands.discovery.v1` | Shared global/page top row, four-destination nav | Existing date/filter accessory | Secondary controls в flow/раскрытие, nav остаётся | Я знаю страницу и могу перейти в основной раздел после scroll. |
| `C2` / `islands.section-context.v1` | C1 + текущий section locator в той же row; H2 в документе | Последовательные полки/ответы | Читаемый context/controls в потоке; не второй fixed band | Следующая полка сменяет контекст, предыдущая возвращается при scroll вверх. |
| `C3` / `islands.single-shelf.v1` | C1 + самостоятельный content block | Полка действительно одна и отделение полезно | Обычная in-flow shelf | Полка воспринимается целым, но cards/CTA/scroll обычные. |
| `C4` / `islands.conversation.v1` | Global+section top row, task composer, nav | Явная задача; optional «Новый ответ» | FI-09 compact→focus→flow, один input DOM | Можно читать прошлое, дополнять и останавливать запись без прыжка. |
| `C5` / `islands.immersive-detail.v1` | Partial global over hero candidate, event context, CTA | Gallery/utilities по действию | Existing standard/monolithic chrome, CTA lifecycle сохранён | Media не испорчены, действия/возврат доступны. |
| `C6` / `islands.transactional-reading.v1` | C1 где nav-mode применим + flow form/text | Lower form/confirmation/error | Обычное чтение, distinct nonmodal/modal semantics | Ввод/ошибка/focus не теряются. |

Это proposed variants внутри одного pattern, не новые production component IDs. v1.1 — revision их компоновки, не шесть копий shell. Материальное изменение family требует новой candidate version и source-bound lineage.

## 4. State-fixture матрица

Имена ниже — сценарные для подготовки, не обещание существующих файлов. Event IDs/assets/order берутся из одного corpus; Task mocks явно `mocked_ui`, не backend evidence. Top-row mixed-view cases расширяют эти fixtures по [v1.1 §11](top-row-composition-v1.1.md#11-проверки-и-owner-research), без новых production сущностей ради таблицы.

| Fixture key | Consumer / данные | Конфликт | Проверка |
|---|---|---|---|
| `discovery.top` | Popular top | Brand/H1/nav и shared row | Title/links читаемы, нет click-plane. |
| `discovery.sections` | Popular, две frozen полки | Page/city/filter/section/menu | Один top band, один active context, H2/actions не дублируются, обратимый down/up. |
| `calendar.accessory` | Today/materialized date | Date rail/nav/notice | Safe area один раз, без двойной date rail и hide-on-scroll. |
| `collection.last-item` | Free, тот же pool/order, append | Нижний stack/last CTA/load more | Финальное действие достижимо, нет data/grid redesign. |
| `single-shelf.empty-or-short` | Existing shelf empty/1/many | Short content vs fixed | In-flow, без пустой pinned полосы. |
| `conversation.idle` | Anonymous/authenticated layout | Idle composer/nav | Auth policy видима, mic/Search не запускаются layout. |
| `conversation.four-roles` | Search, минимум два answer sections | Header/context/composer/nav | Coexist при достаточном rect, не правило одного острова. |
| `conversation.concurrent` | Active capture + previous processing | Stop/input/progress | Stop доступен и стабилен, spinner его не заменяет. |
| `conversation.history` | Viewed old / base other / pending third | Reading≠refinement≠processing | Scroll/late answer не меняет базу и anchor. |
| `conversation.explanation` | Short answer без cards | Section boundary | Нет пустой grid/false zero-results; следующий раздел не перекрыт. |
| `conversation.growth` | Long query/expanded/late media/append | Height/anchor/keyboard | Text/IME/selection сохраняются, explicit reveal отдельно. |
| `detail.lifecycle` | 5370 donor и actual wide/narrow/no-image corpus cases | Hero/body/recommendations/CTA | Existing lifecycle, nav XOR CTA. |
| `detail.gallery` | Same event/gallery | Overlay/shortcuts/lower surface | Нет background input, Escape/focus правильны. |
| `task.blocking-overlay` | Capture mock/app modal | Stop нельзя скрыть | Ack stop/finish либо defer; hidden active mic отсутствует. |
| `lower.notification` | Toast passive/error/action/replacement | Docks/notice | Bottom, dedupe/pause/persist, одно announcement. |
| `form.keyboard` | Existing Focus/Search form | OSK/field/dialog | Input/error/close достижимы; nav/anchor восстановлены. |
| `resilience.layout` | Все affected consumers | No JS/no VV/slow fonts/reduced motion/forced colors | Working fallback, не только красивый screenshot. |

## 5. Размеры и версии данных

Базовые evidence viewports: 390×844, 430×932, 768×1024, 1280×800, 1728×900. Проверочные границы, не новые design breakpoints: 320×700, 844×390, 1440×900/1920×1080 текущего owner-review gate, 200% text и 400% browser zoom/reflow. Не полный Cartesian product: risk-based selection — FI-P1.

Исторический browser evidence предыдущего проектирования — только 1280×720, в sources. **В ходе v1.1 новые browser/Penpot вызовы вернули FORBIDDEN; новых captures/native проверок нет.** 14 offline model tests на synthetic widths не являются реальными layout measurements. Safe-area/OSK — отдельные L2/L3.

Frozen snapshot: `issue621-audioreview-20260904T205339Z`, clock `2026-09-04T22:53:39+02:00`, SHA256 `14950c626a9e1e977e0d734fc4e7ddf93769ea038ddbde2d9db732d402da5049`. Ранее наблюдавшийся public `0b08f0a806a9531c8bf253672e1bb5c712764064` сохраняется как история. В ходе v1.1 STATUS сообщает public/source `2fe28b1f831ac607c0415a8aa6c2beab9eb67fac`, version22; это CODE receipt, не наш повтор. Оба относятся к real/all slice300, не всему production catalog.

Перед candidate выбрать current source и переснять affected baseline на том же snapshot. Не сравнивать новое ранжирование с произвольными старыми Penpot cards. Actual S/P bindings заполняет существующий exporter; proposed v1.1 candidate/P остаются unverified/null до настоящего выполнения.

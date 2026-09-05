# Floating Islands — потребители и состояния v1

Дата: 2026-09-05. Владелец: [system-design-v1.md](system-design-v1.md), `pattern.detached-chrome-control-islands`. Это **проектная применимость**, не отметки production adoption или A=S=P PASS. Контракты геометрии/поведения не дублируются здесь: ссылки FI-* ведут в основную спецификацию.

## 1. Полнота и единица учёта

Основание: прочитанные `site/src/data/design-system-production-surface-contract.v1.json` и `site/src/design-system/astro-family-registry.v1.json` в events-bot-new на source-срезе `2fe28b1f831ac607c0415a8aa6c2beab9eb67fac` / неизменённых соответствующих файлах его предка `d1cc5c7d3e5756ea3f5cc0f240541d6fc95a52c1`. В них **17 именованных archetype IDs**; ниже каждый присутствует ровно один раз. Route family и число ссылок review-hub — разные единицы: например, information-pages имеет два маршрута. Упомянутые CODE 18 review links не называются здесь восемнадцатью independently verified canonical IDs.

Generated calendar dates, отдельная материализованная подборка и конкретное событие — потребители своих families. Не создаём новый archetype ID ради строки в таблице. Перед миграцией release route manifest сопоставляется с этим реестром; непокрытый пользовательский route — конкретный coverage gap, а не молчаливое исключение.

Служебные `/lab/`, `/__preview/`, диагностические маршруты и их визуальный polish не входят в продуктовую миграцию. Но shared component, влияющий на пользовательские страницы, не исключается из зависимостей из-за слова `Prototype`, `Lab` или диагностического marker в имени.

Общие роли C1–C6 описаны в основной спецификации. «Допустимо» означает обоснованную проектную опцию; «выбрано» — вариант для подготовки candidate, ещё не owner-approved skin.

## 2. Матрица всех зарегистрированных архетипов

| Archetype ID / реальные маршруты | Проверенный registry owner | Выбранная композиция / дополнительная применимость | Контекст и граница островов | Не менять в этой работе |
|---|---|---|---|---|
| `home` — `/` | `HomePage` | C1; C2 только при содержательных разделах; C5-like hero placement требует отдельного baseline | Brand/global, nav и локальные действия сцены. Обычные несколько полок остаются в полотне. Splash — явное существующее исключение, не скрытый новый shell. | HomeHeroTalk/scene lifecycle, ссылки, no-JS и reduced-motion fallback; не превращать сцены в carousel другого типа. |
| `today-listing` — `/segodnya/` | `TodayReviewGuard` | C1 + date accessory; C2 для существующих временных разделов | Дата и выбор города — контекст выборки, не fifth navigation destination. Accessory сообщает размер общему нижнему stack. | Availability inventory, disabled dates, время/сортировка, rails и медальоны. |
| `tomorrow-listing` — `/zavtra/` | `DateListingSurface` | C1; C2 если есть реальные разделы | Та же date/listing semantics, без нового режима только для завтра. | Общая DateListing family; фиксация абсолютной даты и timezone. |
| `weekend-listing` — `/vyhodnye/` | `WeekendListingSurface` | C1/C2 | Контекст периода и активного раздела; не закреплять весь список дат/событий. | Границы weekend, в том числе воскресенье; существующий content order. |
| `popular-listing` — `/populyarnoe/` | `PopularListingSurface` | **C2 — первый section-context consumer** | Page context «Популярное» + compact heading текущей содержательной полки. Смена полок down/up в одном reading lane. Города не должны образовать неограниченный третий sticky этаж. | Источники/ранжирование, число карточек/счётчики, existing rail geometry. |
| `collections` — `/podborki/` и материализованные дочерние подборки, в частности `/podborki/besplatnye-sobytiya/` | `CollectionCatalogRouteComposition`; дочерний Free использует существующий `FreeCollectionSurface.astro` | Каталог C1; Free — C1, C2 при содержательных разделах; C3 только для действительно отдельной единственной полки | Заголовок подборки остаётся H1, число результатов — метаданные. Единственная полка может быть detached **в потоке**, не постоянно fixed. | Обычная адаптивная сетка и единый membership pool. Не выделять «бесплатные выставки» в искусственный второй тип страницы. |
| `festivals` — `/festivali/` | `FestivalsTimelineRouteComposition` | C1/C2 | Контекст реального участка timeline; категорийные иконки и временная ось остаются контентными. | Timeline layout, festival grouping, индивидуальные event/festival semantic distinctions. Дочерние routes мигрировать после manifest mapping, не по угаданному URL. |
| `exhibitions` — `/vystavki/` | `ExhibitionsRouteComposition` | C1; C3 для одной фактической полки/deck; C2 при нескольких разделах | Heading/controls собственной exhibition surface. На mobile компактный deck, на desktop media window сохраняют владельцев. | Graphite/light и accepted media geometry, read/unread и feedback; не переносить exhibition-форк в общие списки. |
| `favorites` — `/izbrannoe/` | `FavoritesRouteComposition` | C1/C2; C6 для подтверждения удаления | Сохранённые события и состояние выбора; действие удаления не становится primary nav. Empty state не создаёт пустой sticky context. | Saved-state semantics и обратимость; не навязывать новый Auth flow. |
| `search` — `/poisk/` | `SearchRouteComposition` | Idle обычный C1; **C4 для разговорного режима** | Brand/global, текущий answer heading, отдельный composer и nav. Input/capture/processing не смешиваются с просмотром истории. | Обычный Search, Auth, canonical cards; server/API/лимиты и диалог определяет #587. |
| `for-me` — `/dlya-menya/` | `ForMeRouteComposition` | C1/C2 | Контекст разделов персональной выдачи, skeleton/error/empty принадлежат существующему owner. | Персонализация, профиль, consent и protected data; не считать локальный layout mock backend acceptance. |
| `focus-group` — `/fokus-gruppa/` | `FocusGroupProgrammeSurface` | C6 | Программа и формы; нужные подтверждения/ошибки используют нижний surface owner, не исчезают по passive timer. | OTP, consent, intake/raffle и native keyboard semantics. Диагностику не делать продуктовым showcase ради дизайна. |
| `artifacts` — `/artefakty/` | `ArtifactCollectionRouteComposition` | C1; C3 лишь для одного самостоятельного блока | Коллекция остаётся контентом; уведомление о получении — отдельный transient lifecycle. | Native medallion/artifact identities, earned/locked states, раскрытие информации. Не заменять ассеты emoji/похожими SVG. |
| `event-detail` — `/sobytiya/*/` | `EventDetailRouteComposition` | **C5**, CTA вместо nav в существующем immersive режиме | Brand/context + принадлежащий событию CTA; gallery — самостоятельный overlay. Hero/body/recommendations/terminal boundaries явные. | Семантический порядок H1 → текст → practical → related; wide/narrow/no-image, primary CTA, transport, gallery и полнота действия. |
| `interest-clubs` — `/kluby-po-interesam/` | `InterestClubsIndexRouteComposition` | C1/C2 при реально разрешённой публичной поверхности | Контекст каталога/группы, а не новый fixed action на каждую карточку. | Feature/publication gate, membership semantics. Наличие source не означает публично доступный route. |
| `unusual-events` — `/neobychnoe/` | `UnusualListingSurface` | C1/C2 при опубликованном контенте | Approved-empty/quality-gated state не маскируется красивой полкой. | `not_approved` и data quality gates; нет фиктивных событий для заполнения острова. |
| `information-pages` — `/partners/`, `/partnerstvo/` | `PartnersRouteComposition`, `PartnershipRouteComposition` | C6 | Brand/page context/nav; длинный текст читабелен. На короткой странице дополнительный pinned section context не нужен. | Ссылки и контакты, формы, обычная типографика и footer; не скрывать service/legal destinations ради чистого canvas. |

Generated `date-*` routes применяют контракт `DateListingSurface`/calendar потребителя после проверки actual route ownership. Transport sections и festival detail, если имеются в release manifest, сохраняют владельцев event/timeline; matrix не является разрешением переподчинить их новому шаблону.

## 3. Конкретные композиции: anatomy, fallback, приёмка

| ID | Минимальная anatomy | Когда дополняется | Выбранный fallback | Основная пользовательская проверка |
|---|---|---|---|---|
| `C1` / `islands.discovery.v1` | Existing global/header, page context, four-destination nav | Только существующий date/filter accessory | Secondary controls в flow, nav остаётся | Я знаю текущую страницу и могу перейти в любой основной раздел после scroll. |
| `C2` / `islands.section-context.v1` | C1 + настоящее section heading в пределах section | Последовательные полки/ответы | Short viewport: context unpins, heading остаётся в документе | При чтении длинной полки я знаю её название; следующая заменяет её, предыдущая возвращается при scroll вверх. |
| `C3` / `islands.single-shelf.v1` | C1 + один самостоятельный content block с собственным heading/controls | Только когда эта полка действительно одна и отделение полезно | Обычная in-flow shelf без новой подложки | Полка воспринимается целым, но все карточки/CTA и вертикальная прокрутка остаются обычными. |
| `C4` / `islands.conversation.v1` | Global + section context + task composer + nav | Явно открытая задача; optional utility «Новый ответ» | FI-09: compact → focus → flow, один input DOM | Можно читать прошлый ответ, дополнять текущий запрос и остановить запись без прыжков/перекрытий. |
| `C5` / `islands.immersive-detail.v1` | Partial global over hero candidate, event context, existing CTA | Gallery и event-local utilities только по действию | Существующий monolithic/standard top chrome; CTA lifecycle сохраняется | Афиша/фото не испорчены; действие и обратная навигация доступны; gallery не конкурирует с dock. |
| `C6` / `islands.transactional-reading.v1` | C1 где nav-mode применим + in-flow form/text | App-owned lower form/confirmation/error по действию | Обычное чтение; nonmodal/menu/modal distinctions сохраняются | Ввод и ошибка не теряются при keyboard, focus не оказывается за окном. |

Это proposed variant IDs **внутри существующего pattern**, не новые production component IDs. Изменение графики требует candidate version действующей family либо узкого нового компонента с lineage, а не регистрации шести копий shell.

## 4. Общая state-fixture матрица

Все fixture IDs ниже — **сценарные имена для подготовки**, не утверждение о существующих fixture-файлах. Реальные event IDs, asset hashes и order берутся из одного закреплённого corpus. Структурные mocks Task допустимы для UI и явно отмечаются `mocked_ui`; они не являются voice backend evidence.

| Fixture key | Реальный consumer / данные | Разрешаемый конфликт | Ожидаемая проверка |
|---|---|---|---|
| `discovery.top` | Popular, верх страницы | Brand overhang + H1 + nav | H1 и links читаемы; нет прозрачного click-plane. |
| `discovery.sections` | Popular, две реальные полки из frozen release | Page context + city/filter + смена H2 | Один active section context, обратимый down/up, controls не дублируются. |
| `calendar.accessory` | Today + конкретный materialized date | Date rail + nav + transient notice | Общий измеряемый stack; safe area один раз, nav не скрывается от scroll. |
| `collection.last-item` | Free, тот же pool/порядок при append | Нижние острова + последний CTA/load more | Последнее действие достижимо и после добавления событий. Нет data/grid redesign. |
| `single-shelf.empty-or-short` | Existing shelf consumer, empty/1 item/many | Fixed temptation vs short content | Short/empty surface остаётся in-flow, нет пустой pinned полосы. |
| `conversation.idle` | Search anonymous и authenticated layout | Idle composer + nav | Принятая Auth policy видима; layout не запускает mic/Search. |
| `conversation.four-roles` | Search layout fixture, минимум два answer sections | Header/context/composer/nav | Все четыре роли совместимы при достаточном visible rect; нет правила «один остров». |
| `conversation.concurrent` | Capture active и processing предыдущей реплики | Stop + add input + progress | Stop стабилен и доступен; capture не замаскирован spinner предыдущего запроса. |
| `conversation.history` | Старый section просмотрен, другой выбран базой, третий pending | Reading ≠ refinement ≠ processing | Ни scroll, ни поздний answer не меняют refinement target и место чтения. |
| `conversation.explanation` | Короткий answer без cards | Short section sticky boundary | Нет пустой grid/ложного zero-results; следующий section не перекрыт. |
| `conversation.growth` | Long query, expanded answer, late media, pagination | Высота/anchor/keyboard | Text/IME/selection сохраняются; layout измеряется; explicit reveal отдельно от auto-follow. |
| `detail.lifecycle` | Событие из corpus; 5370 — известный review donor, плюс реальные wide/narrow/no-image cases | Hero/main/recommendations/CTA | Existing CTA появляется/прекращается по owner; nav XOR CTA. |
| `detail.gallery` | То же событие, real gallery | Overlay + global shortcuts + lower surfaces | Нет background input; Escape закрывает верхний owner и восстанавливает focus. |
| `task.blocking-overlay` | Layout capture mock + app modal | Нельзя оставить запись с недоступным Stop | Ack stop/finish либо отложенное открытие; не скрытый активный mic. |
| `lower.notification` | Existing toast, error/action/passive/replacement | Nav/accessory/composer + notice | Bottom placement, dedupe, pause, action/error persist, нет двойного announcement. |
| `form.keyboard` | Existing Focus/Search form | Keyboard + focused field + dialog/buttons | Ввод/ошибка/закрытие видимы; выход из focus возвращает nav и прежний anchor. |
| `resilience.layout` | Каждый затронутый consumer | No JS/slow font/no VV/reduced motion/forced colors | Сохраняется работа; screenshot красоты не подменяет проверку fallback. |

## 5. Размеры и версии данных

Базовая геометрия evidence: уже существующие 390×844, 430×932, 768×1024, 1280×800, 1728×900. Для островов добавляются **проверочные границы**, не новые дизайн-breakpoints: 320×700, 844×390 landscape, desktop 1440×900/1920×1080 по текущему owner-review gate, 200% text zoom и reflow при 400% browser zoom. Не нужно перемножать каждый route, state, browser и viewport: risk-based выбор описан в FI-P1.

В доступном этом окну browser выполнены только desktop 1280×720 наблюдения, перечисленные в sources. Остальные клетки **не запускались**. Физические safe-area/keyboard/OS проверки — отдельные L2/L3, а не desktop screenshot с уменьшенной шириной.

Frozen evidence baseline доступен по #621: snapshot `issue621-audioreview-20260904T205339Z`, clock `2026-09-04T22:53:39+02:00`, SHA256 `14950c626a9e1e977e0d734fc4e7ddf93769ea038ddbde2d9db732d402da5049`; опубликованный successor `0b08f0a806a9531c8bf253672e1bb5c712764064`. Это **real/all slice300**, не весь production catalog. Точные version21 metadata — из CODE receipt, не повторно подтверждённая в этом окне сборка.

Перед candidate выбрать один достижимый current source и переснять его affected baseline на том же snapshot. Нельзя сравнить candidate на свежем ранжировании с историческими Penpot карточками и объяснить разницу islands. Actual SoT/native bindings заполняются из exporter. На момент документа: `candidate_binding=null`, Penpot read заблокирован, native frame/revision **не проверены**.

# Floating Islands v1 — обязательные связи с доставкой действий, статистикой и персонализацией

Дата: 2026-09-05. Дополнение к [системной спецификации](system-design-v1.md), тому же `pattern.detached-chrome-control-islands`. Определяет **интерфейс общего chrome с существующими owners**, не новый transport/analytics/profile сервис. Основные FI-01–FI-20 остаются в основном файле; нормы upstream не копируются сюда как независимые лимиты.

## 1. Почему добавлено до завершения проектирования

При финальном compare обнаружены **семь параллельных documentary commits** в #587 после исходного `62c54ce…`; они уже были в родителе нашего routing commit `b926104f…`. Наш commit добавляет только `design-system/floating-islands.md`, а не приписывает нам изменения release umbrella/voice.

Повторно прочитаны на `c048ebe71ecac2671d102f9c301d0e02e8bc16a5`:

- полностью [release-integration.md](https://github.com/onedayonemasterpiece/events-bot-new/blob/c048ebe71ecac2671d102f9c301d0e02e8bc16a5/docs/features/static-personal-announcements/release-integration.md), включая ownership, маршруты обоих направлений, visibility/served mapping, персонализацию и acceptance;
- [voice-search-solution-v1.md §§7–10](https://github.com/onedayonemasterpiece/events-bot-new/blob/c048ebe71ecac2671d102f9c301d0e02e8bc16a5/docs/features/static-site-pages/smart-vector-search/voice-search-solution-v1.md), особенно актуальный §9 и global hide/visible-prefix правила;
- расширенный [handoff](https://github.com/onedayonemasterpiece/events-bot-new/blob/c048ebe71ecac2671d102f9c301d0e02e8bc16a5/docs/features/static-site-pages/design-system/window-prompts/20260905-floating-islands-system-design.md) в части изменённого контекста.

Это дополнение устраняет обнаруженный gap: core v1 уже описывал layout и Search adapter, но недостаточно явно связывал UI status с durable acknowledgement, occlusion с exposure, а стабильное чтение — с global hide и profile refresh. Старые первичные июльские release/analytics/manual personalization документы **не объявляются заново полностью прочитанными**: текущий integration документ ссылается на них как на владельцев, при реализации они подлежат адресному fresh-read. Исторический GO/NO-GO или новые documentary планы не становятся live acceptance.

## 2. RB-01: состояние действия — от реального domain receipt

Island renderer получает **bounded presentation state** от владельца операции. Он не выполняет запрос, retry, route switching, reconciliation или сохранение product fact самостоятельно. `status_kind` из FI-17 расширяется типизированным domain adapter, а не произвольной строкой от страницы/модели.

| State от владельца | Что можно сообщить пользователю | Доступные действия и запреты |
|---|---|---|
| `working` | «Сохраняем…» / фактическая известная стадия | Cancel только если domain owner реально поддерживает его на этой стадии. Нет fake progress percentage. |
| `queued` | «Действие в очереди. Ещё не синхронизировано» | Не писать «сохранено на сервере». Доступна информация о статусе; повторный POST не создаётся кнопкой shell. |
| `local_only` | «Сохранено на этом устройстве» — только если конкретное действие допускает local state | Локальное отображение не выдаёт себя за durable account state; несинхронизированное не вытесняется без понятного исхода. |
| `committed` | «Сохранено» после валидного primary acknowledgement | Это подтверждение именно основного действия, не доказательство внешней покупки, импорта календаря или attendance. |
| `partially_committed` | Что именно выполнено и что не выполнено | Не отменять подтверждённый primary success. Ошибка **optional analytics** сама по себе не требует тревожить пользователя частичным успехом product action. |
| `unknown` | «Не удалось подтвердить результат» | Предложить проверку/восстановление через owner. Не показывать безусловное «Повторить», если selected-once dispatch мог уже иметь эффект. |
| `failed` | Конкретное неуспешное действие и безопасный следующий шаг | Retry доступен только по policy операции; permission/cooldown не обходятся новым маршрутом. |

Дополнительные поля adapter: стабильный **локальный** operation reference, semantic action ID, presentation state, safe text key, permitted recovery actions, optional target control. Эти данные не создают новый серверный receipt schema или analytics actor. Raw request body/личный profile/transcript не пересылаются в shell registry.

Фокус, Stop и `interaction_locked` из FI-06/10 сохраняются при смене этих состояний. Информирование не заменяет возможность восстановить результат; actionable/unknown/error состояние не пропадает по passive timer. При нескольких операциях сообщение привязано к конкретному действию, а не заменяет всё состояние страницы общим красным/зелёным индикатором.

### Capability health не сводится к «интернет работает»

Текущий release integration различает product direct/relay к одному Supabase, optional analytics direct/reverse bridge к одному YDB ingest, OAuth, media upload и CDN. Shell получает summary **нужной capability**, но не осуществляет проверки маршрутов. Working JSON operation не доказывает relay-capable audio upload. CDN availability hint не равен доступности из браузера пользователя или personal allowance.

Shared upstream outage не исправляется другим proxy. Потерянный ACK не превращается в безопасный unsent. Analytics failure не ухудшает product route health. Никакого always-on ping с каждого острова, нового local outbox или самостоятельных обходов 401/403/409/429. Numeric caps, TTL и budget берутся из текущего OperationCatalog/release integration, не из этого документа.

## 3. RB-02: measured visibility → existing exposure и actual served order

**Договор между owners:** shell публикует только layout snapshot из FI-17; visibility/exposure owner потребляет viewport + occupied rects; list renderer публикует actual presentation identity/order; analytics owner применяет свой consent, thresholds, dedupe и общий delivery budget. Ни один из этих owners не подменяется Floating Island runtime.

Список rects важен буквально: свободная область между разнесёнными островами не считается перекрытой из-за одного большого bbox. При modal/background inert exposure приостанавливается согласно общему visibility contract. Sticky и in-flow формы того же heading не создают новый page view; Back и повторный scroll не изображают новый вход в фичу. Layout measurements, необходимые для интерфейса, не являются разрешением отправлять optional telemetry.

`served_list_id`/opaque presentation receipt — identity **фактически показанного** порядка и versions; он принадлежит list/presentation owner. `section_id` отвечает за раздел и не заменяет served-list identity. Dynamic cards/обычные подборки/старые answer sections используют общие canonical event/action IDs. Если rendering order отличается от receipt, это FAIL согласованности, а не допустимая погрешность аналитики.

После изменения layout/append/rerank renderer сохраняет согласованную presentation revision. Geometry-only compact переход сам по себе не создаёт новую выборку. Для one-shot reveal и explicit jump используются прежние semantic intents, а не synthetic scroll event, засчитанный как user action.

**Не логировать:** текст ввода, raw question/answer/title с личными данными, keystroke sequence, audio/amplitude frames, полный профиль, JWT, precise location. Достаточны существующие bounded semantic dimensions: pattern/variant/version, scope surrogate, layout mode, modality, degradation class и aggregate obstruction/fallback flags — если они разрешены common analytics contract. Не вводить запрос на каждый scroll/observer tick.

Zero-cost OFF относится к optional capture/network/storage: при отсутствии соответствующего consent/campaign flag нет optional recording/outbox/requests. Navigation, primary action, layout safety и уже разрешённая персонализация при этом продолжают работать. Existing operational fault evidence не используется как обход consent или новый устойчивый actor. Action-map/heatmap остаются в собственном default-OFF bounded campaign, не включаются этим pattern.

## 4. RB-03: видимая стабильность, exact hides и персональная проекция

Текущий `profile_projection` и explicit saved/hide/undo overlay принадлежат existing personalization/product owners. Shell не строит taste model, не хранит профиль разговора и не активирует personalization по scroll, открытию composer или voice request. Analytics permission и personalization activation не объединяются в новый checkbox. UI может сказать «учтены интересы» только если конкретный renderer действительно применил допустимую projection.

| Presentation state | Поведение островов и страницы |
|---|---|
| `cold` / `disabled` | Полезный static/contextual порядок и действующие controls; не фальшивые personal explanations. |
| `compatible` | Renderer применяет разрешённую policy внутри своего множества; shell сохраняет геометрию/anchor и отдаёт actual usable region. |
| `stale` / `degraded` | Совместимый last-good либо static fallback; первоначальный render не ждёт network/profile materializer. |
| Strong state pending/undo | Локальное конкретное действие видно с честным sync state; control/anchor не прыгает при обновлении. |
| Exact hide / current fact correction | Применяется ко всем surfaces, в том числе старой voice history; historical receipt не возвращает обычную скрытую карточку. |

Surface policies upstream сохраняются: календарь — хронология; Free/тематика — eligibility прежде мягкого rerank; «Для меня» — более выраженная персонализация; Search — явный запрос и refinement base прежде общих предпочтений; related — контекст события. Общий shell не устанавливает единое правило ранжирования для этих разных задач.

### Frozen prefix — не только мгновенно видимые pixels

Already visible/served reading prefix, focus target, pointer-held target, активная ordinal reference и semantic anchor защищены от фонового rerank. Временно перекрытая нижним dock карточка не становится автоматически безопасной для перестановки; её прежняя видимость/место чтения не забываются. Модель нижней видимости и protect-set остаётся у list/personalization owner; shell поставляет геометрию, а не решение переставить события.

Offscreen rerank разрешён только за защищённой границей и по существующей surface policy. После его применения renderer обновляет actual served identity/order согласованно; anchor не сбрасывается. Exact hide/security/current-invalid action имеют приоритет над сохранением старой интерактивной карточки. В таком случае появляется контролируемое hidden/changed state с явным restore/recovery, focus перемещается безопасно, высота/anchor сохраняются насколько возможно. Это не молчаливое воскрешение события и не invisible focused element.

Committed answer receipt и прошлый текст не переписываются новым профилем без понятного refresh. Current card facts, available CTA и exact hide применяются к отображению отдельно. Total logical matches, rendered, hidden и not-yet-loaded не смешиваются в одном техническом H1.

Materializer/ETag/next_refresh_at, горизонты интересов и identity upgrades остаются upstream. Ни layout resize, ни audio turn, ни optional analytics batch не запускают новый LLM/profile recompute.

## 5. Проверяемая продуктовая ценность без нового dashboard framework

Эти три feature questions связываются с существующим Product Atlas/MeasurementQuestion и analytics definitions при реализации. Новые duplicate metric IDs или online dashboards здесь не созданы. Прямой CTA outcome отличать от session-assisted и causal вывода; отсутствие данных обозначать coverage gap, не нулём.

| Вопрос / решение | Наблюдение и population | Guardrails |
|---|---|---|
| Сохраняет ли C2 контекст и доступ к действию? → изменить pin/compact policy либо оставить ordinary flow | QA target reachability + existing event-value/intent-action outcome на eligible реально exposed C2 surfaces; return/jump utility только как вспомогательный факт | Не считать больше кликов или повторную sticky exposure успехом. Отдельно breakage/abandonment/occlusion. |
| Мешает ли composer читать? → изменить размеры/focus layout, не урезать полезный поиск | Eligible exposed conversational task; existing cards-to-value/intent-action и bounded unwanted-scroll/focus interruption observations | Capacity-denied/degraded exposure учитывается отдельно; сравнение с зарегистрированным контролем, не добровольные Search users против всех. |
| Не теряется ли действие между UI и подтверждением? → исправить конкретный adapter/receipt path | Attempt→primary committed отдельно от committed→optional projection/readout | Proxy 200 не success; duplicate retry не conversion; optional sink outage не product failure. |

Регулярный aggregate/readout принадлежит существующей аналитической поверхности владельца. Ни таблица вопросов, ни SQL template без работающего sink не называются измеренной полезностью. Первое внедрение FI-P1 может доказать usability/geometry и measurement wiring на fixtures; product uplift требует отдельного реального readout, когда feature разрешена и exposed.

## 6. Пять дополнительных acceptance cases — в том же harness

Эти cases дополняют **32 основных** сценария [FI-P1](implementation-package-1.md), не создают второй registry. Existing equivalent scenario ID переиспользуется при реализации; ниже имена proposals. Статус всех — **спроектированы, не выполнены**.

| Proposed ID | Given → When → Then | Где проверяется / граница P1 |
|---|---|---|
| `islands.receipt_status` | Mock owner выдал queued/local_only/unknown/committed+projection_pending → status render/действие → честный текст/доступные recovery, нет самодельного retry и исчезающей ошибки | L0/L1 adapter в P1; настоящее DB/HTTP lost-ACK — existing upstream integration lane, не имитация в UI. |
| `islands.exposure_served_bridge` | Одинаковые event IDs в разных sections, разнесённые occluding rects, sticky/Back → existing exposure summary → правильный usable region, actual served order, dedupe без нового page view | L1 geometry + deterministic aggregate fixture; не claim deployed analytics. |
| `islands.profile_freeze` | Arrival compatible profile при чтении/held control/частичной occlusion → renderer update → защищённый prefix/target/anchor неизменны, offscreen policy и served revision согласованы | L0/L1 P1 adapter fixture; actual scorer/materializer — соответствующий owner. |
| `islands.global_hide_history` | Hide/undo в текущем section → возврат в старую историю/обычную подборку → нет воскресшей обычной карточки, явный recovery, безопасный focus и count | L1 shared card/overlay fixture; downstream durable reconciliation отдельно. |
| `islands.optional_off` | Analytics denied / action-map OFF / sidecar failure → navigation/query/product action/layout → 0 optional captures/writes/requests, primary UI и разрешённые функции рабочие | L1 с проверкой network/storage spies и существующего OFF proof; no raw payloads. |

При P1 требуется совместимый **readonly layout/status/served bridge** и UI/contract fixtures этих стыков, а не полная реализация reverse analytics/media transport внутри shell. Полный вертикальный release journey Search→hide→обычная подборка→receipt→authorized aggregate остаётся согласованной следующей integration-поставкой #587/#621; его нельзя объявить завершённым после одного geometry preview.

## 7. Применимость и дополнительные состояния в общей матрице

Эти правила накладываются на существующие строки [consumer matrix](consumer-matrix-v1.md), не добавляют фиктивный восемнадцатый archetype. Home/listings/Free/ForMe/favorites/Search/related различают activation/projection states; любая product-action surface различает receipt states; hidden recovery — реальный interaction existing owner, не новый fixed dock на каждой странице. Информация про `17` относится к **прочитанному actual source registry**, а не неподтверждённой вечной полноте всех будущих routes. Current route manifest/registry проверяется перед миграцией.

Публичные badges/counters этих состояний не формируют гигантскую всегда видимую диагностическую панель. Контекстное объяснение появляется там, где оно меняет ожидание пользователя; подробности доставки/optional analytics остаются в своём appropriate owner readout. Надёжность должна улучшать пользование сайтом, а не превращать его в служебный мониторинг.

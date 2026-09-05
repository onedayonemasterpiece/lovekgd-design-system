# Floating Islands — сквозная система KenigEvents, v1

Дата: 2026-09-05. Pattern ID: `pattern.detached-chrome-control-islands`.

**Статус: документальное решение для implementation/owner review. Новая система не объявлена реализованной или принятой.** Продолжение PR #47, не новый владелец паттерна. Действующие принятые части оболочки сохраняются. Production, shared foundations, STATUS и canonical Penpot этим пакетом не меняются.

Навигация по пакету: [источники и расхождения](sources-and-decisions-v1.md), [потребители и композиции](consumer-matrix-v1.md), [проверки и первый пакет](implementation-package-1.md). Исторический reference pack и исходные шесть наблюдений остаются в этой же папке. Схемы сторонних приложений — исследовательский материал, не baseline KenigEvents.

## 1. Назначение и граница решения

Остров — самостоятельная визуально отделённая поверхность с определённой работой пользователя и жизненным циклом. `Floating` не обязательно означает `position:fixed`: контентная полка может быть отделена от полотна и оставаться в потоке. Сквозная система отвечает за совместное размещение, контекст, доступность и предсказуемое поведение таких поверхностей, а не превращает каждый элемент сайта в плавающую карточку.

Пользователь должен понимать, где он находится, читать без перекрытия важных действий, продолжать навигацию, вводить запрос и управлять текущей операцией. Число островов определяется задачей и доступной геометрией, а не правилом «один/два/три на страницу».

В решении четыре независимых слоя:

1. **Surface:** существующие материалы, граница, скругление, elevation и контраст. Итоговый skin отдельно проходит owner review; новый glass/font/palette не вводится этим документом.
2. **Composition:** роли, принадлежность странице/разделу, совместимость и размещение.
3. **Control semantics:** существующие navigation, search, calendar, auth, toast, gallery и другие владельцы действий.
4. **Layout behavior:** занятая область, safe area, viewport, состояния компоновки, scroll/focus и взаимодействие слоёв.

Система не владеет EventCard, AdaptiveEventCardGrid, MediaFrame, поисковым ранжированием, ASR, provider availability, лимитами, памятью диалога или пользовательским профилем. Одинаковая подложка не означает общий компонент для несвязанных действий.

### FI-01. Уточнение старого entry gate

**Было:** документальное проектирование и заполнение вариантов блокировались до формирования всех AS-IS архетипов и полной A=S=P parity сайта.

**Стало по постановке владельца 2026-09-05:** сбор концепций, системное проектирование, предложенные варианты и подготовка проверок выполняются сейчас. Для затрагиваемого потребителя перед визуальным изменением требуется честно зафиксированный target baseline: source/контракт/fixtures/известные отклонения/доступные доказательства. Недостающий P явно остаётся недостающим. Это не разрешение канонизировать дефект или назвать непроверенный вариант принятым.

Применение к production и утверждение A=S=P подчиняются действующим `kenigevents.asp-conformance` и launch-normalization contract. Их проверки и текущий exit gate не ослабляются. Изменяется этап допуска **к проектированию**, а не определение соответствия. Работу над одним подготовленным потребителем не блокирует чужая незавершённая страница.

## 2. Что сохраняется из текущего продукта

### FI-02. Совместимость с действующей оболочкой

Точки интеграции: `EventLayout.astro`, `Reference4MobileMenu.astro`, `MobileBottomNav.astro`, `MobileToastRegion.astro`; keyboard owner — `KeyboardEventNavigation.astro` → `KeyboardEventNavigationPrototype.astro` → `keyboardEventNavigation.mjs`. Точные source pins и границы чтения — в sources.

Сохраняются явные `topMode=standard|contextual|immersive`, `section=afisha|dates|search|personal|null`, `bottomMode=nav|cta|none`. Новые роли расширяют этот договор совместимым adapter, а не заменяют его через `body:has()` и route-local догадки.

Нижняя первичная навигация уже принята владельцем для desktop и mobile: **Афиша, Даты, Поиск, Для меня**. Используется существующий route resolver и один `aria-current`; не создаётся отдельная desktop-копия семантики. Верхние ссылки — вторичные, не ещё одна первичная навигация. Nav не исчезает от обычного scroll.

На immersive event-detail действует `nav XOR transactional CTA`. Общая система не добавляет вторую панель поверх CTA. Существующий lifecycle CTA — hero → основной контент → terminal boundary — сохраняется до отдельного согласованного изменения его owner.

Верхнее меню не становится модальным только из-за слова drawer. Текущий moving-parent/brand-tag donor, close paths и отсутствие неразрешённого backdrop/body lock сохраняются. Настоящие модальные окна имеют иной interaction contract.

В текущем candidate уже существует компактная ссылка контекста страницы («Наверх: Популярное»). Система развивает её и разделяет с section context, а не создаёт второй конкурирующий header controller.

### FI-03. Неприкосновенные контентные правила

«Бесплатные события» — обычная фильтрованная выборка. Остров не меняет число колонок, состав/порядок выдачи, admission, пагинацию или логику персонализации. Число результатов — метаданные, не H1. Выставки не выделяются в произвольный отдельный список только потому, что их удобно нарисовать.

Нельзя копировать карточки, иконки, медальоны или crop-логику внутрь island-компонента. Потерянная подпись CTA, неправильная сетка или медиа не считаются особенностью новой композиции.

## 3. Роли, семантика и допустимое объединение

| Роль | Работа пользователя | Владелец содержания | Типичное размещение / lifetime |
|---|---|---|---|
| `brand_global` | Узнать сайт, открыть глобальное меню, перейти домой | Существующий shell/brand/menu | Верхний leading cluster; route lifetime |
| `page_context` | Понять текущую страницу, вернуться к её началу | Route composition + shell | Компактный верхний контекст после выхода H1; route lifetime |
| `section_context` | Понять текущую полку/раздел ответа | Heading существующего section | Sticky в пределах section; только пока section активен |
| `primary_navigation` | Перейти между четырьмя основными разделами | MobileBottomNav + resolver | Нижний dock; nav-mode |
| `task_composer` | Написать/произнести запрос, дополнить, остановить запись | Search owner | Отдельный нижний task dock; task lifetime |
| `transactional_action` | Основное действие текущего события | Event CTA owner | Нижний CTA по существующим границам; вместо nav |
| `persistent_state` | Понять и контролировать продолжающуюся операцию | Владелец операции | Компактный state dock либо часть собственного composer |
| `context_utility` | Фильтр, дата, переход к новому ответу, локальное действие | Соответствующий section/controller | Рядом со своим контекстом; не глобальный FAB по умолчанию |
| `notification` | Получить краткое сообщение | MobileToastRegion / lower-surface lifecycle | Нижняя временная область; не новый nav lifecycle |
| `detached_content` | Прочитать самостоятельную единственную полку | Реальная rail/collection family | В потоке; визуальная, не fixed-изоляция |

`modal`, `gallery` и нативный permission/share UI — не варианты одного острова. Они участвуют в политике взаимодействия и перекрытий, сохраняя собственные semantics и владельцев.

### FI-04. Правила группировки

Объединять можно элементы одной задачи и одного lifecycle: title + count + фильтр этой выборки; поле + submit + mic/stop; четыре primary destinations. Разделять следует глобальную навигацию, пользовательский ввод, временное уведомление и независимое продолжающееся состояние.

Если progress относится к composer, он живёт в composer, а не дублируется отдельным dock и toast. `persistent_state` — роль для реально существующей независимой операции, не поручение разработать плеер или ещё одну фичу по примеру стороннего приложения.

Одновременно активен не более одного **section context на один вертикальный reading lane**. Это правило семантики раздела, не ограничение общего числа островов. В desktop с независимыми колонками контекст привязан к явно объявленному lane, а не к случайному ближайшему заголовку во всём DOM.

## 4. Композиции для сайта

Подробная применимость и исключения — в consumer matrix. Выбранные варианты:

- **C1 Discovery:** brand/global + компактный page context + nav; date/filter accessory только у объявившего его потребителя.
- **C2 Sectioned reading:** C1 + section-contained context. Применимо к полкам и нескольким разделам результатов; вся полка не закрепляется.
- **C3 Single detached shelf:** C1 + одна самостоятельная контентная полка в потоке. Отделяется поверхность целого блока, не создаётся nested card-in-card для каждого события.
- **C4 Conversational task:** brand/global + answer section context + composer + nav при достаточной геометрии. Отдельные lifecycle; возможен временный focus layout при вводе.
- **C5 Immersive detail:** частичный brand/global над media только в проверенном варианте + контекст события + существующий CTA вместо nav. Gallery имеет собственный верхний слой.
- **C6 Transactional/information:** обычное чтение и навигация; формы и подтверждения используют действующий lower-surface owner. Нет искусственной полки или постоянно закреплённого оглавления на короткой странице.

Наличие места не является причиной показывать все роли. На idle Search не нужен отдельный пустой state dock. На information-page не нужен composer, пока пользователь явно не открыл поиск. В Home несколько обычных полок не превращаются в ряд тяжёлых плавающих контейнеров.

### FI-05. Геометрический характер вариантов

Desktop: острова выравниваются относительно существующего content container, оставляя контенту ширину; nav сохраняет компактный нижний центр. Task dock допускает более широкое поле, чем nav, но не накрывает его. На широком экране допускается разнесение task/state и nav по непересекающимся слотам **только по фиксированному правилу варианта**, а не прыжок вслед за курсором.

Mobile: leading brand и utility не отнимают центральную полосу у важного контекста. Нижние блоки образуют измеряемый stack с реальным зазором. Не вводить универсальный full-width slab от края до края вместо принятого inset dock.

Header redesign ограничен chrome: brand/global, page context, utilities. Hero/media сохраняют собственную crop/contrast authority. Размещение media от верхней границы экрана — отдельный C5 candidate, не автоматическое снятие всех top offsets на всех страницах.

## 5. Состояния и переходы

### FI-06. Общая модель

Состояние участника — несколько независимых осей, не одно комбинаторное имя CSS:

- `presence`: absent / mounted / suspended;
- `presentation`: flow / expanded / compact;
- `interaction`: idle / focus-within / pointer-held / obscured;
- `placement`: выбранный слот или flow;
- `lifecycle`: route / section / task / transient;
- task-specific state остаётся у owner (например capture и processing у Search).

`absent` — нет доступной роли в данном режиме; `suspended` — состояние сохранено, поверхность временно не интерактивна и удалена из Tab/AT traversal, а не прозрачный невидимый hit target. Любое скрытие фокусированного control сначала переводит focus в логически доступную цель. Нельзя ставить `aria-hidden` на предка активного focus.

| Событие | Переход оболочки | Чего не происходит |
|---|---|---|
| H1 покинул верхнюю reading boundary | Existing page context compact | Не меняется route/history/refinement base |
| Следующий section пересёк boundary | Предыдущий context уступает следующему | Не закрепляются два section headers друг над другом |
| Scroll назад | Восстанавливается предыдущий section context | Не запрашивается заново его выдача |
| Input focus / уменьшение полезного viewport | Пересчёт expanded → compact/focus/flow по §6 | Не теряется текст, selection, IME или mic stop |
| Открытие non-modal global menu | Сохраняется donor; конфликтующие utility/toast приостановлены | Нет самовольного body lock |
| Открытие modal/gallery | Только владелец активного overlay принимает соответствующий input | Нет click-through и фоновых keyboard shortcuts |
| Закрытие overlay | Возврат focus и сохранённого layout/anchor | Нет автоматического submit или restart recording |
| Backend unavailable | Owner меняет содержимое статуса, shell сохраняет безопасную геометрию | Нет исчезновения активной кнопки под пальцем |
| Route leave / pagehide | Cleanup observers/listeners; owner получает lifecycle | Нет продолжения скрытой записи по решению shell |

Полный reset/delete/logout принадлежит Search/Auth. Shell не может по таймеру стереть вопрос, историю или остановить доменную операцию без согласованного callback.

## 6. Геометрия, занятое место и адаптация

### FI-07. Один layout owner, измерения вместо суммы констант

EventLayout остаётся root owner. Небольшой shared layout adapter координирует существующие контроллеры; это не новый глобальный UI framework, event bus или независимая orchestration platform.

Участник регистрирует стабильные `instance_id`, role, scope, свой DOM root и защищённые controls. Измеряются **фактические** границы после resolved styles/fonts: visual/occlusion rect и interactive rect. Учитываются выступающая бренд-бирка, focus outline, border, дочерние controls, wrap и изменение высоты. Декоративная тень не автоматически превращается в непроходимую область; визуальная читаемость проверяется отдельно от hit testing.

`occupied_rects` — список непересекающихся либо объединяемых геометрических препятствий с owner/role/layer, не число `headerHeight + navHeight`. Для конкретного content lane учитываются только пересекающие его X-диапазон препятствия. Публикуются также консервативные общие top/bottom insets для старых consumers.

Если два препятствия перекрываются, их площадь/высота не складывается дважды. Если между верхними островами свободно, это не делает весь прозрачный прямоугольник header блокирующим клики. Host имеет `pointer-events:none`, реальные активные поверхности — `auto`; никакого прозрачного click-plane поверх страницы.

### FI-08. Координаты и safe area

Внутренний договор использует CSS pixels. Объявляются `layoutViewportRect`, `visualViewportRect`, `scale`, DPR и safe-area insets. Rects из DOM приводятся к одной системе координат перед сравнением. При представлении в visual-viewport coordinates layout-relative rect сдвигается на `visualViewport.offsetLeft/offsetTop`; scale не применяется к CSS-геометрии повторно. Pixel mapping для screenshot проверяется отдельно, с записанными DPR/scale.

Клавиатура и pinch zoom могут менять visible viewport иначе, чем layout viewport. Нельзя считать `window.innerHeight - visualViewport.height` точной высотой клавиатуры или любое уменьшение окна признаком keyboard. Решение о компоновке опирается на доступную область и input focus; browser-specific keyboard сигнал — дополнительный, feature-detected источник.

Safe top/bottom/left/right применяются на уровне viewport boundary **один раз**. Нижний отступ к visible boundary = max(existing edge-gap, соответствующий safe inset), если safe area ещё не включена в доступный rect. Дочерний nav/composer не добавляет её снова. Не складывать одновременно `dvh` shrink, вычисленную keyboard height и safe bottom как три одинаковых препятствия.

Fallback без VisualViewport: CSS-first flow/sticky и обычные resize/focus сигналы; не обещается точная keyboard occlusion. Основные control и возможность закрыть ввод остаются достижимыми. Browser chrome/native permission/share не изображаются собственной UI-подделкой.

### FI-09. Полезное место, а не максимальное количество островов

Для каждого варианта рассчитывается свободный reading rect между занятыми областями. Он должен вмещать минимальную читаемую смысловую единицу и достижимое основное действие. Для проверки предлагается исходный budget:

```text
min_readable_block = max(160 CSS px,
                        3 × resolved body line-height
                        + resolved minimum control height
                        + 2 × existing inter-surface gap)
```

160 — **предлагаемый behavioral default для проверки**, не новый принятый foundation token и не универсальный закон UX. Не уменьшать font/control sizes ради прохождения budget. На overview дополнительно проверяется, что видна осмысленная часть content, а не только chrome. Budget не применяется как требование одновременно показать страницу за полноэкранной gallery/modal.

Порядок деградации детерминирован:

1. Убрать декоративные/повторные подробности, свернуть idle utilities в принадлежащее им раскрытие.
2. Compact page context; объединить его visual cluster с section context без дублирования semantic headings.
3. Перевести необязательные sticky filters/shelf context в flow, сохранив controls и ссылки.
4. При активном вводе сократить composer до поля и обязательных действий, progress оставить в нём; временно приостановить nav только когда совместное размещение действительно не проходит budget. Доступна явная кнопка завершить/свернуть ввод, возвращающая исходный nav. Это focus exception, не hide-on-scroll.
5. Если viewport всё ещё физически мал, использовать flow/focus layout с тем же input DOM: native scroll показывает редактируемую область и stop/submit, остальной документ остаётся прокручиваемым. При выходе focus из task его перекрывающий режим прекращается до показа следующего focus target. Не добавлять ещё один вложенный scroll контейнер для всей страницы.

Ввод/Stop, безопасное закрытие active overlay и видимость текущего focus важнее idle decoration. Обычный короткий landscape без ввода не является основанием скрыть все четыре destinations: в нём первыми unpin secondary contexts. Поведение 4–5 обязательно проверяется на клавиатурах и zoom; не объявляется доказанным расчётом.

### FI-10. Стабильность и производительность

CSS grid/flex/sticky решают обычную геометрию; JS нужен для действительно совместного occupied-space, focus и динамических размеров. ResizeObserver/IntersectionObserver используются адресно, без измерения всего каталога на каждом scroll. Read phase → вычисление → write phase в одном animation frame; одинаковые rects не записываются повторно. Обновления очищаются на unmount/pagehide; повторная инициализация не создаёт второй owner.

Geometry cycle «padding меняет observer → observer меняет padding» разрывается измерением собственных поверхностей независимо от резервируемого main spacer и проверкой изменения результата. Для границ expanded/compact применяется небольшой hysteresis; конкретные thresholds фиксируются из измеренного candidate, а не подгоняются по одному screenshot.

Пока pointer удерживается на control или идёт IME composition, не менять его идентичность, слот, label/action mapping. Обновления очередятся до безопасной границы. При неизбежном resize, нарушающем безопасность hit target, текущий gesture отменяется без исполнения и нужен новый явный input; нельзя исполнить соседнюю кнопку.

Первые размеры SSR резервируются из существующего варианта/токенов, затем уточняются измерениями. No-JS сохраняет usable navigation и контент в потоке. Reduced motion убирает декоративные перемещения, не статусы или доступ к действиям.

## 7. Scroll, заголовки, история и keyboard

### FI-11. Section context

Основной документ имеет настоящий H1. Разделы имеют соответствующие H2/H3. Закрепляется **сам компактный заголовок раздела в его semantic section**, а не клон с ещё одним heading/control tree. Sticky ограничен containing section и верхним inset своего lane. Следующий section вытесняет предыдущий; обратная прокрутка восстанавливает предыдущий естественно. Контейнер с unintended overflow не должен незаметно стать новым scroll ancestor.

Длинный вопрос, полный модельный ответ, весь card rail и раскрытые фильтры не закрепляются. Длинный title компактно переносится (целевой предел две строки); полный смысл доступен при раскрытии/возврате к разделу. Критические ограничения, неопределённость или цена не скрываются исключительно для красоты.

Short/explanation-only разделы участвуют в том же алгоритме; они не получают пустую grid или sticky-header выше собственного контента. На границе разделов важнее непрерывное чтение, чем постоянное присутствие декоративного context pill.

### FI-12. Scroll ownership и восстановление

Существующий keyboard/scroll owner расширяется, новый document-level listener-конкурент не вводится. Обычный scroll не меняет history entry. Anchor хранит route-entry key, section/element identity и relative offset, а не только абсолютный `scrollY`.

Для нового Search submit owner создаёт draft boundary и выдаёт **одно** право reveal его heading. Scroll initiated by submit расходует это право. После ручного wheel/touch/keyboard перехода в историю, выбора другого раздела, Back/Forward или смены route право автоматического следования отменяется. Поздний ответ показывает доступное действие «Новый ответ ↓», а не перехватывает scroll.

Expand answer, late image dimensions и pagination старого раздела сохраняют текущее место. MediaFrame заранее резервирует размеры. При удалении anchor используется ближайший живой semantic sibling/heading, с понятным статусом, не возврат к page top по умолчанию.

Back/Forward восстанавливают прежний route entry, фильтры и место чтения без нового submit. Не конкурировать с native scroll restoration: один controller решает, используется native или app anchor для конкретного entry; не запускать оба последовательно.

### FI-13. Keyboard и focus

Tab/Shift+Tab следуют логическому DOM order. Fixed positioning не оправдывает положительный tabindex или перестановку чтения. Page-level arrows/shortcuts не перехватываются в input, textarea, contenteditable, IME, menu/dialog/gallery и во время native UI. Screen-reader browse navigation не подменяется самодельным reading engine.

Существующий semantic путь event-detail (H1 → paragraphs → practical information → related) сохраняется. Смена sticky title не переносит focus сама. Явный jump может сфокусировать heading с `tabindex=-1`; обычный ответ/scroll этого не делает. Escape обрабатывает только верхний актуальный dismissible owner, не закрывает сразу drawer, gallery и задачу.

Для focus guard проверяется весь control и focus outline на пересечение с активными chrome rects. Предпочтение — полностью видимый control, более строгое, чем минимальное требование WCAG 2.4.11. Нельзя объявлять весь сайт WCAG-conformant по этому одному тесту. После закрытия overlay focus возвращается инициатору, либо ближайшей логичной живой цели, если инициатор удалён.

## 8. Layers, окна и уведомления

### FI-14. Порядок — семантический, не соревнование z-index

От нижнего к верхнему: content → in-flow surface → section sticky → page/global chrome и координированные нижние docks → принадлежащие им non-modal disclosures/notification → modal/gallery. Нативные browser/OS surfaces вне этого CSS ordering. При открытом modal/gallery соответствующий background inert/неинтерактивен; его controls не остаются tabbable за overlay.

Это относительный договор. Новые произвольные `z-index:99999` не разрешены; существующие tiers связываются в одном owner. Новые foundation tokens не вводятся этим пакетом. CSS stacking contexts от transform/filter/contain проверяются; native top layer, если использован, не побеждается очередным z-index.

### FI-15. Lower surfaces не переписываются

Актуальная AR17 direction: app-owned окна и уведомления появляются снизу на desktop и mobile. Историческое July-описание toast под header не применяется к новому candidate. `MobileToastRegion` уже читает lower-surface state и нижний offset; first package должен расширить измерения существующего owner, а не написать второй toast queue.

Сохраняются один видимый toast, dedupe/replacement generation, понятный dismiss, pause при focus/hold/hidden/obscured. Error/action/form/confirmation/pending не исчезают по passive timer. Чисто информационное сообщение, от которого зависит понимание, должно оставаться доступным или иметь управление временем; исчезновение не стирает единственное доказательство результата. Inline Search/auth/progress status не дублируется ещё и toast announcement.

Modal и gallery получают focus внутри, безопасный close и возврат к инициатору. Глобальное меню сохраняет собственную non-modal semantics. Нельзя объявить произвольный overlay modal ради упрощения occlusion-теста.

### FI-16. Active capture и перекрытие

Запись не может продолжаться с недостижимым Stop. Перед открытием app-owned blocking overlay, которое закроет composer, shell вызывает типизированную проверку у Search owner. Выбранное безопасное правило v1: владелец записи явно останавливает/финализирует текущий сегмент и подтверждает это, либо открытие откладывается и пользователю предлагается закончить запись. Shell не делает вид, что запись остановилась, просто спрятав кнопку.

Это отдельное согласование интерфейса с #587 при реализации. Ни consent/auth, ни gallery не могут молча оставить mic под inert background. OS permission prompt управляет браузер; до получения разрешения нет притворного recording state. После внешнего interruptions состояние восстанавливается по реальному capture owner, не по старой анимации.

## 9. Типизированная граница с Search и другими потребителями

### FI-17. Контракт adapter v1

Имена на shell side предлагаемые; они не утверждают наличие готового runtime API. Смысл доменных полей #587 не изменяется.

```ts
// In-process adapter; no network, persistence or arbitrary global event bus.
type ShellRole =
  | 'brand_global' | 'page_context' | 'section_context'
  | 'primary_navigation' | 'task_composer' | 'transactional_action'
  | 'persistent_state' | 'context_utility' | 'notification';

interface IslandRegistration {
  instance_id: string;
  role: ShellRole;
  scope_section_id?: string;
  root: HTMLElement;
  protected_controls: readonly HTMLElement[];
  preferred_placement: 'top' | 'bottom' | 'section' | 'flow';
  expanded: boolean;
  input_focused: boolean;
  interaction_locked: boolean;
  restore_focus_target?: HTMLElement;
}

interface ShellLayoutSnapshot {
  revision: number;
  viewport_rect: Readonly<{x:number; y:number; width:number; height:number}>;
  occupied_rects: readonly Readonly<{
    instance_id:string; role:ShellRole; x:number; y:number;
    width:number; height:number; layer_role:string;
  }>[];
  effective_top_inset: number;
  effective_bottom_inset: number;
  layout_mode: 'expanded' | 'compact' | 'focus' | 'flow';
  permitted_expansion: boolean;
  overlay_interaction_state: 'none' | 'nonmodal_menu' | 'modal' | 'gallery' | 'native_ui';
}
```

Registration возвращает `update`, `unregister` и подписку на layout snapshot. Это один источник размеров; consumer не ведёт второй watcher клавиатуры/нижнего offset. Runtime implementation может использовать существующий API при эквивалентной семантике; rename не причина дублировать owner.

Mapping #587: `voice_composer` → `task_composer`, `answer_context` → `section_context`. Search сообщает `recording`, `stop_action_available`, `status_kind`, `measured_size` и текущие flags; shell использует их только как ограничения компоновки. DOM measurement owner сверяет announced size с фактическим root. `layer_role` возвращается для участника, не выбирается им произвольно.

Semantic calls остаются bounded: `select_refinement_base(section_id)`, `request_reveal_section(section_id, reason=submit|explicit_jump)`, `announce_status(text, category)`, плюс согласованный capture/overlay handshake из FI-16. Shell не генерирует section IDs и не трактует query.

### FI-18. Независимые состояния разговорного поиска

`viewed_section_id` меняется при чтении; `refinement_base_section_id` — по явному выбору пользователя; `pending_draft_id` — по processing lifecycle. Они не подменяют друг друга. Composer показывает, что именно уточняется, особенно если пользователь читает другой раздел.

Capture и processing независимы: можно записывать дополнение, пока предыдущая реплика обрабатывается. При этом Stop относится к текущему capture, cancel/retry — к конкретной операции, reveal — к конкретному section. Один spinning submit не блокирует все эти действия и не изображает ложный процент.

Answer structure: section title → исходный вопрос → краткий/раскрываемый ответ → canonical cards либо explanation-only body. Старые разделы остаются. Provider outage не удаляет активный composer/историю; альтернативу сообщает Search owner согласно реально доступным capability. Гостевой доступ, ASR, privacy, retention, тарифы и динамический admission определяет #587, не эта система.

## 10. A=S=P и native materialization

### FI-19. Один контракт, разные уровни доказательства

Нормативный владелец: `docs/product-governance/astro-sot-penpot-conformance.md`, актуально прочитанная версия 1.2.0. Этот документ её не заменяет.

Для каждой пары baseline/candidate фиксируются source SHA, pattern/variant/component versions, точный corpus/snapshot+clock, route, viewport/DPR/scale, fonts/assets, theme, flags, auth state и scenario. Не смешивать public screenshot 0b08, source 2fe и Penpot прежнего snapshot в одну якобы равную тройку.

S содержит resolved composition: роли/instance IDs, component lineage, content IDs/order, видимые состояния, occupied rects, insets, exact geometry и asset identities. Сохраняются parent/nested bindings канонических карточек и иконок. Поведенческие transitions имеют отдельные сценарии; картинка не доказывает их исполнение.

P — native linked component instances с теми же IDs/versions/assets/content. Снимок страницы, вставленный как картинка, не становится native page. Null/unread Penpot binding означает отсутствие доказательства, не разрешение нарисовать похожую копию.

### FI-20. Материализация без второго конвейера

Используется действующий exporter/materializer и существующий Penpot file, sole-writer/revision control. Добавляются только необходимые роли, properties и resolved state fixtures. Не создаётся новый file, новый production catalog owner или альтернативный builder.

Вход для materializer — расширение текущей source-bound projection, а не ручные координаты из этого документа. До выдачи принятого frame он обязан получить реальные component/asset/geometry bindings. Нерешённые зависимости блокируют затронутый frame. Документальное проектирование остальных вариантов продолжается.

Сравнение: один корпус событий → реальная Astro-страница → resolved SoT → native Penpot той же версии; side-by-side/overlay/diff и региональные метрики. Текст, семантика, lineage и asset identity — без допуска; raster antialiasing не оправдывает разные размеры/строки/иконки. Числовые допуски берутся из active conformance harness, не придумываются ради зелёного результата.

Три отдельных verdict: visual/structural A=S=P; browser behavior; mobile/native behavior. Penpot не доказывает ASR, сеть, keyboard/OS или background lifecycle. В этом окне реальный read Penpot был заблокирован safety check инструмента; никакой P parity не заявлена.

## 11. Внедрение и критерий результата

First package описан отдельно и рассчитан на существующую implementation lane #621, не на нового оркестратора. Он начинает с measurement/coordination действующих нижних поверхностей и защищённого контекста, без redesign карточек/типографики и без голосового backend. После bounded baseline/test evidence — изолированные варианты на конкретных consumers; затем owner review и управляемая миграция.

Материальное изменение компонента получает новую версию и candidate в существующем runtime catalog. Старая версия не объявляется deprecated до согласованного плана перехода; mixed production rollout допускается только по явно указанному owner/границе/сроку удаления флага. Иначе мигрируются все consumers изменённой approved family в одной поставке. Draft docs не являются разрешением тихо изменить geometry той же версии.

Публикуемый preview — только действующий shared Kaggle StaticSiteBuilder → create-only immutable prefix. Локальные focused проверки не заменяют опубликованный owner-review artifact. Production promotion и full-site normalization completion не входят в текущую документальную работу.

**Результат v1:** понятные роли и варианты для всех фактических архетипов, совместимый runtime contract, детерминированные правила конфликтов, зафиксированные открытые визуальные решения, проверяемый первый implementation slice. Не результат: новый набор красивых прямоугольников без владельцев, либо объявленная parity без реального P.

## 12. Внешние технические основания

Проверено 2026-09-05; это платформенные основания, не альтернативная продуктовая authority:

- W3C [Focus Not Obscured Minimum](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum) и [Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced.html): различие минимальной видимости и выбранного более строгого focus guard.
- W3C [Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): focus внутри настоящего modal, возврат при закрытии и inert background. Не основание объявлять modal любое меню.
- MDN [position](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position): sticky зависит от scrolling ancestor/containing block и создаёт stacking context.

Остальные правила геометрии и приоритетов выше — проектные решения KenigEvents, подлежащие указанным browser/device проверкам, а не утверждение об уже проверенной совместимости.

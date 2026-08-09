Внешний доказательный корпус best practices для нормализации UI и компонентной дизайн‑системы
Методология поиска и классификация источников
Исследование проводилось как сравнение внешних прецедентов, а не поиск подтверждения заранее выбранной системы. В корпус вошли официальные design systems, живые продуктовые интерфейсы, accessibility-руководства, независимые UX-исследования, профессиональные публикации и корпоративные ретроспективы. Приоритет отдавался не обзорным главными страницам, а guidance конкретных компонентов, foundations, migration/release documentation и живым сценариям.

Стартовый перечень был проверен целиком. Наиболее содержательные конкретные материалы удалось получить из Material 3, Apple HIG, GOV.UK Design System, USWDS, NHS Design System, BBC GEL, Carbon, Fluent 2, Atlassian Design System, Primer, Polaris, Spectrum, Consta, VKUI и Gravity UI. VKUI прямо позиционирует себя как адаптивную React-библиотеку, способную приспосабливать интерфейс к разным размерам экранов и платформам.

Российские источники имеют техническое ограничение данного сбора: страницы ГосТех по проектированию интерфейсов и методическим рекомендациям во время исследования не отдавались краулеру из-за timeout, а guides.gosuslugi.ru возвращал запрет прямого чтения. Поисковый индекс при этом подтверждает наличие в Гайдах Госуслуг отдельной мобильной дизайн‑системы GosApp UI и правил проектирования приложений. Поэтому ГосТех и Госуслуги не используются ниже как доказательство конкретных размеров или паттернов, которые нельзя было непосредственно проверить; это сознательно оставленный пробел, а не подмена источника пересказом.

Для оценки силы evidence используется следующая шкала:

Маркер	Тип доказательства	Как интерпретировать
S	формальный стандарт / accessibility requirement	сильное ограничение, но применимость может зависеть от юрисдикции и целевого уровня соответствия
O	официальная рекомендация дизайн‑системы	зрелая практика конкретной экосистемы, не универсальный закон
P	живой продукт	доказательство того, что решение реально применяется; само по себе не доказывает его оптимальность
R	независимое UX/accessibility-исследование	сильнее визуального прецедента, особенно если описана методика тестирования
B	бизнес-кейс / корпоративная ретроспектива	полезен для процессов, adoption и миграций, но результаты обычно self-reported
E	мнение специалиста / профессиональная практика	хорошее основание для гипотезы или процесса, но не обязательный стандарт

Особенно важно не смешивать эти классы. Например, BBC GEL Carousel — официальная инженерная рекомендация BBC, а исследование Baymard о том, что 46% проверенных ecommerce-каруселей имели UX-проблемы, — независимое исследовательское evidence. Первое показывает, как BBC считает нужным реализовывать rail, второе — почему сам выбор rail/carousel требует осторожности.

Профессиональные источники использовались прежде всего для методов принятия решений. Brad Frost, Interface Inventory предлагает сначала собрать существующие визуальные паттерны рядом и выявить дублирование; это непосредственно подходит к нормализации уже существующего UI. Nathan Curtis в материалах EightShapes по tokens, component sizing и typography рассматривает шкалы как управляемые наборы решений, которые должны начинаться с реально нужных значений, а sizing — согласовываться между родственными компонентами, а не определяться независимо каждым контролом.

Срез актуальности сделан по состоянию на 9 августа 2026 года. Это существенно для Material 3 Expressive, современной архитектуры Polaris, новой навигации Atlassian и release phases: это развивающиеся системы, поэтому более старые статьи рассматриваются как исторические ретроспективы, а не описание текущего API. Например, Material опубликовал M3 Expressive в 2025 году, а Atlassian в сентябре 2025 года перевёл новую типографику в GA и объявил прежние Modernized/Legacy typography deprecated.

Главный методологический вывод уже на этом уровне: нет одного авторитетного внешнего источника, из которого можно механически вывести правильную типографическую шкалу, размеры карточек или число вариантов. Зрелые системы различаются именно потому, что обслуживают разные задачи: GOV.UK — длинные государственные формы и содержание, Carbon — плотные enterprise-интерфейсы плюс выразительные surfaces, Material — широкую продуктовую экосистему, BBC — editorial/media, Primer — developer tooling, а живые event/transport продукты оптимизируются под discovery или быстрое сравнение. Это различие будет использоваться как evidence, а не сглаживаться.

Атлас конкретных лучших прецедентов по тематическим областям
Типографические роли и шкалы. Один из самых сильных общих паттернов — отделение семантической/визуальной роли текста от произвольного font-size. Material 3 type scale tokens строит типографику вокруг ролей; современный M3 содержит baseline и emphasized варианты ролей, а не предлагает дизайнерам свободно комбинировать размер и weight. Fluent 2 Text также даёт именованные presets от Caption до Body, Subtitle, Title, Large Title и Display. Carbon type sets идёт дальше и сознательно разделяет productive и expressive типографику: productive базируется на более компактном 14 px baseline, expressive — на 16 px и допускает более заметные композиционные роли, включая fluid headings.

Это важное противоядие против модели «единственная математическая шкала для всего продукта»: Carbon официально признаёт, что информационно-плотный интерфейс и маркетинговая/редакционная поверхность могут требовать разных режимов. Material 3 Expressive аналогично расширяет визуальную выразительность, а не просто меняет один глобальный коэффициент шкалы.

USWDS typography и его typesetting tokens демонстрируют другой полезный уровень нормализации: размеры и line-height регуляризованы системными токенами, а метрики разных шрифтов дополнительно нормализуются оптически. USWDS предлагает девять theme font-size tokens, происходящих из более широкой системной шкалы, и шесть нормализованных line-height tokens; при этом для веса система допускает до семи токенов, но прямо отмечает, что большинству проектов достаточно двух–четырёх. Это хороший пример богатой underlying scale при намеренно более узком public API проекта.

GOV.UK type scale показывает более дискретный подход: шкала была переработана и протестирована, размеры различаются на небольших и больших экранах, line-height привязан к регулярному вертикальному ритму; paragraph guidance использует 19 px для стандартного body и рекомендует малый 16 px текст только там, где действительно нужна вторичная роль.

Особенно сильна документация BBC GEL Typography: body scale 15–18 px в зависимости от экрана должен реализовываться относительными единицами; размеры меньше body предлагается применять только для вторичной информации; measure рекомендуется удерживать примерно в 60–70 символах, через max-width в ch, а не фиксированный пиксельный контейнер. GEL также отделяет line-height body от крупных заголовков и прямо предостерегает от текста поверх сложной фотографии.

Здесь наблюдается редкая степень согласия: Primer Typography ограничивает длинные строки примерно 80 символами и разводит HTML heading semantics с визуальными типографическими стилями; USWDS называет диапазон примерно 45–90 символов и около 66 как хороший ориентир для длинного чтения; NHS рекомендует около 70–80 символов. Числа отличаются, но evidence согласуется в главном: measure должен быть контролируемым свойством композиции и не должен автоматически расти вместе с viewport.

Для кириллицы в просмотренном корпусе нет сопоставимого массива независимого evidence, который позволял бы сказать: «возьмите Latin scale и примените без изменений». Это особенно важно для длинных русскоязычных заголовков: внешние системы дают основания нормализовать роли, measure, responsive behavior и правила overflow, но не подтверждают, что их конкретные font metrics оптимальны для кириллицы. Это остаётся локальной проверкой.

Размеры, spacing, density и контейнеры. Carbon Spacing использует ограниченную последовательность, построенную вокруг кратных 2/4/8 значений, и связывает меньшие пространства с более высокой информационной плотностью. USWDS 2 migration также перешёл к нормализованной spacing-системе вокруг 8 px с половинными и малыми исключениями. Evidence здесь не говорит, что именно «8 px магически правильно»; оно говорит, что spacing должен быть конечным, именованным и композиционно согласованным.

Nathan Curtis, Size in Design Systems полезен именно для компонентной нормализации: размер компонента следует трактовать как согласованный пакет высоты, typography, padding и плотности, а не отдельный prop каждого атома. Похожий подход виден у Gravity UI Select: четыре размера S/M/L/XL одновременно меняют высоту, текстовый стиль, padding и radius; M объявлен базовым для большинства форм и фильтров, S — для таблиц и малых карточек, L используется редко, XL — для более коммуникационных/landing contexts. Система отдельно требует сохранять одинаковый размер у соседних контролов одной формы.

Важно, что mature systems не требуют всё делать fluid. GOV.UK Text Input прямо рекомендует известную длину ввода отражать шириной поля — например, для postcode и других данных с предсказуемой длиной. Это сильный прецедент против правила «все поля всегда 100% width».

На уровне layout GOV.UK Layout использует mobile-first композицию, ограниченный max-width около 1020 px и типовые двухколоночные пропорции; NHS Layout обычно начинает с одной колонки на mobile и ограничивает основной контейнер примерно 960 px. Gravity UI Grid and Container явным образом поддерживает Fixed и Fluid container modes вместо выбора одного на всю систему.

Primer Responsive формулирует особенно переносимый принцип: адаптироваться к доступному пространству, а не названиям устройств. Primer ориентируется на работу начиная примерно с 320 px и учитывает сценарии высокого zoom; его layout guide допускает разное число колонок в зависимости от реально доступной ширины.

Карточки и event discovery. У Material Cards есть три визуальных типа — elevated, filled и outlined, но guidance определяет карточку не через decoration, а как контейнер информации и действий об одном предмете. Это хороший пример того, как ограничивать визуальные варианты при сохранении общей anatomy.

BBC GEL Card представляет существенно более строгий функциональный прецедент: headline, content/media, description и toolbar; список карточек семантически остаётся <ul>/<li>; заголовок идёт первым в source order даже когда media визуально поднято выше; minimum card width задан как 266 px; равная высота достигается flex/grid, а toolbar прижимается вниз через flex, а не absolute positioning. Для media GEL использует object-fit: cover как progressive enhancement и сохраняет letterboxed fallback.

Это заслуживает внимания не из-за значения 266 px, которое контекстно, а потому что фиксируется constraint + intrinsic expansion: карточка имеет порог полезной ширины, после которого grid сам определяет число колонок. Переносить число 266 без тестирования не следует.

USWDS Card похожим образом не диктует одну фиксированную карточку: группы интегрируются с responsive grid utilities, карточки могут stretch или align-start, а документация отдельно сохраняет правильный semantic source order media и heading.

Живые продукты показывают, почему одной event card недостаточно. Resident Advisor Los Angeles events использует плотный сканируемый listing, сгруппированный по датам, с фильтрами и статусами вроде postponed; это сценарий сравнения большого количества событий, где крупная editorial card расходовала бы слишком много вертикального пространства.

Southbank Centre What’s On, напротив, соединяет визуальное изображение, категорию, название, дату, venue и ticket state — это discovery-oriented композиция культурной программы. На конкретных event pages Southbank также демонстрирует полезный recovery pattern: sold-out advance allocation может сопровождаться ясным дальнейшим путём получения оставшихся билетов ближе к событию.

Tate — Turner & Constable делает sold out первоклассным состоянием event page, а MoMA exhibition page соединяет время/место/status, основной editorial content и related content/events. Это доказательство того, что event state — не маленький decorative badge, а часть основной информационной архитектуры страницы.

Meetup event guidance дополнительно показывает продуктовую связь между featured photo и разными surfaces: изображение используется и в discovery/search, и на странице события, то есть asset должен выдерживать несколько crops/layout contexts.

Изображения. Среди просмотренных источников нет убедительного evidence для универсального правила «везде cover» или «везде contain». BBC GEL применяет cover к media-card, где допустима обрезка фотографии, но одновременно обеспечивает fallback без искажения. Для информационно значимых изображений GEL требует содержательный alt, а не повтор headline.

Следовательно, наиболее защищаемый внешний принцип — image treatment должен зависеть от семантики изображения. Фотография, служащая атмосферным preview, допускает crop значительно легче, чем афиша с встроенным текстом, схема или информационный poster. Последняя часть — вывод из назначения контента, а не правило найденной дизайн‑системы; внешние примеры пока недостаточны, чтобы зафиксировать для афиш конкретный global ratio или safe area.

Loading, skeleton, error и recovery. Здесь источники достаточно хорошо различают задачи. Carbon Loading Pattern рекомендует skeleton для начальной загрузки page/content structure; Carbon Inline Loading предназначен для короткого процесса внутри локального action, а не полного экрана.

Nielsen Norman Group, Skeleton Screens 101 также определяет skeleton прежде всего как placeholder, который заранее показывает предполагаемую структуру загружаемой страницы и способен уменьшать субъективное ощущение ожидания. Отдельный NN/g guide по progress indicators рекомендует loop/spinner прежде всего для быстрых операций, потому что неопределённая анимация не сообщает оставшееся время.

Material 3 добавляет ещё один контекст: его Loading Indicator ориентирован на сравнительно короткие ожидания, включая сценарии примерно до нескольких секунд, и в Expressive material используется как более характерная форма indeterminate feedback. Это не отменяет skeleton; это другой уровень loading taxonomy.

Особенно ценный живой пример recovery — TfL Northern line timetable: нормальное состояние показывает отдельные departure/arrival rows, а при проблеме с service board продукт способен сообщить, что данные могут быть устаревшими, и предложить reload вместо пустого пространства или бесконечного spinner.

Horizontal rails и carousel. BBC GEL Carousel — один из наиболее полно документированных прецедентов. Это обычный горизонтально scrollable список, который работает без JavaScript; JS добавляет prev/next controls. Автопрокрутки нет, управление остаётся у пользователя. Компонент работает mouse/keyboard/touch, имеет list semantics, disabled boundary controls и reduced-motion behavior; hidden controls появляются только когда JS действительно способен их обслуживать.

BBC отдельно решает проблему hidden-content affordance и focus: частично скрытые элементы визуально отличаются, controls должны объявлять не просто «next», а диапазон, который будет показан, а невидимые элементы исключаются из взаимодействия, чтобы keyboard navigation не возвращала пользователя неожиданно к началу rail. Это хороший пример того, что carousel — это существенно больше, чем overflow-x: auto.

Но независимый evidence требует осторожности. Baymard, Homepage Carousel UX сообщает, что 46% проверенных carousel implementations имели usability issues, и указывает, что более простая статическая композиция в ряде случаев выполняет задачу не хуже. В актуальном navigation guidance Baymard дополнительно не рекомендует autorotation на mobile.

А чрезмерно высокий horizontal rail создаёт отдельную проблему: Baymard наблюдал риск ошибочного tap/scroll interaction, когда такая поверхность занимает больше половины мобильного viewport.

Sticky и fixed surfaces. Vitaly Friedman, Designing Sticky Menus даёт полезное условное, а не догматичное правило: sticky оправдан, когда page job предполагает частое обращение к навигации или ключевым действиям; при преимущественно reading-oriented задаче его полезность снижается. Sticky UI может перекрывать focusable content, ухудшаться при zoom и особенно сильно сокращать рабочую область при открытой мобильной клавиатуре.

Отсюда нельзя получить правило «sticky CTA всегда хорошо» или «sticky CTA всегда плохо». Внешний evidence поддерживает контекстный выбор и проверку occlusion/zoom/keyboard, а не сам факт закрепления.

Mobile navigation, dropdown, popover и selection. BBC GEL Site Menu особенно полезен потому, что его mobile behavior выведен из семантической структуры: меню остаётся nested list внутри <nav>, а на узких viewport скрывается за настоящей button/disclosure с aria-expanded. Submenu также является disclosure, а не маскируется под navigation link; progressive enhancement оставляет navigation доступной даже без JavaScript.

Primer Navigation различает tabs, URL-navigation и segmented controls по поведению, а не визуальной похожести. Primer ActionMenu комбинирует ActionList и overlay и поддерживает command, single-select, multi-select и submenu use cases. Это сильный аргумент не создавать один «универсальный pill control», если похожие формы реализуют принципиально разные semantics.

Carbon Dropdown аналогично разводит dropdown, multiselect и combo box. Gravity UI Radio Group предназначает radio для mutually exclusive choice, но не для переключения разделов страницы; Segmented Radio Group отдельно моделирует одновыборный segmented control.

Gravity UI Popover дополнительно показывает, что даже внутри одной overlay-family нужны условия: delay может снижать accidental hover activation, а interactive content требует времени, чтобы pointer мог переместиться внутрь overlay. WebAIM WCAG checklist напоминает формальное accessibility-ограничение: hover/focus content должен быть dismissible, hoverable и оставаться доступным достаточно долго.

Транспортные расписания. Это область, где плотность оправдана самой задачей. SNCF Connect Paris–Vernon timetable сначала даёт сводку — количество рейсов, среднее/минимальное время, первый и последний departure — затем плотную таблицу departure, arrival, duration, operator/stops/directness. Это сильный пример summary + comparable repeated rows, а не card-first design.

DB Navigator и DB travel information добавляют другую сторону transport state model: real-time departures, альтернативы, missed-connection recovery и предложения альтернативных поездок при disruption. Таким образом, «расписание» — это не только planned times, а система переходов planned → delayed/disrupted → alternative/recovery.

На этом фоне карточки событий и строки транспорта не должны автоматически нормализоваться в один list-item: их information density, comparison task и temporal state model различаются.

Сравнение альтернативных и противоречащих подходов
Дилемма	Подход	Где он убедителен	Где начинает ломаться
Компактная vs выразительная типографика	Carbon разделяет productive 14 px base и expressive 16 px base; M3 Expressive сознательно усиливает display hierarchy.
enterprise/data-heavy UI vs discovery/editorial/brand surfaces	единая expressive шкала может чрезмерно увеличить высоту плотных списков; единая compact — сделать культурный/event discovery визуально плоским
Discrete vs fluid typography	GOV.UK и Primer используют чёткие responsive steps; Carbon поддерживает также fluid expressive headings.
discrete проще контролировать и QA; fluid полезна крупным display roles между широкими viewport	fluid body/control type повышает число промежуточных состояний и усложняет визуальный QA
Одна numeric scale vs role API	Material, Fluent, USWDS и Airbnb дают именованные roles/styles поверх числовых значений.
когда нужны глобальные миграции и смена шрифта	сырая numeric scale просачивается в продукт и создаёт локальные комбинации size/weight/leading
Fixed vs fluid component width	GOV.UK фиксирует ширину known-length inputs; Gravity UI имеет fixed и fluid containers; BBC Card задаёт min-width, но позволяет grid расширять карточку.
fixed — когда формат данных известен; intrinsic/fluid — когда контент непредсказуем	blanket width:100% убирает полезные affordances; blanket fixed width ломает локализацию
Один размер vs density sizes	Gravity UI даёт S/M/L/XL с назначением; Nathan Curtis рекомендует синхронизировать size system между компонентами.
таблицы, forms, landing surfaces действительно имеют разные density needs	каждый произвольный размер становится variant explosion
Skeleton vs spinner/indicator	Carbon и NN/g используют skeleton для page/content structure; inline/spinner — для локальных коротких действий.
skeleton, когда конечный layout достаточно известен; spinner для маленькой неизвестной операции	skeleton, не соответствующий реальному layout, создаёт ложное ожидание и лишнее движение
Rail vs grid/list	BBC показывает accessible user-controlled carousel; Baymard показывает, что статические секции часто не хуже и значительно проще.
secondary discovery, где допустимо сознательно открыть больше объектов свайпом	critical content, сравнение, высокая rail height, плохо видимый horizontal affordance
Cover vs contain	BBC card использует cover для media preview.
фотографии, где допустим композиционный crop	posters, diagrams и изображения со встроенной информацией: внешний корпус не подтверждает, что их безопасно crop
Sticky CTA/nav vs flow CTA	Friedman: sticky может ускорять повторный доступ, но отнимает viewport и создаёт zoom/focus problems.
длинная transactional page, где действие повторяется и часто востребовано	reading page, mobile keyboard, stacked sticky surfaces
Collapsed mobile nav vs exposed navigation	BBC GEL использует disclosure на узком экране; Baymard отмечает потерю category overview, когда всё скрыто за collapsed navigation.
сложная IA с недостатком пространства	landing/discovery surface, где категория сама является важным обзором содержания
Select vs radio vs segmented vs tabs	Gravity, Carbon и Primer разводят компоненты по semantics.
выбор одного значения, переключение view, navigation — разные interaction contracts	визуальное объединение в один универсальный «choice component» скрывает semantics и усложняет a11y
Один универсальный компонент vs specialised family	Primer разрешает product-specific shared components до upstream; Spotify Encore использует foundation + platform/local systems.
когда core anatomy стабильна, а task semantics различаются	чрезмерная специализация превращает систему в набор shadow components; чрезмерная универсальность производит гигантский prop matrix

Главная закономерность — противоречия не являются дефектом research corpus. Они отражают разные задачи.

Например, large expressive type и compact productive type не нужно усреднять до промежуточных 15 px. Carbon буквально оформляет их как две разные типографические среды.

Так же бессмысленно искать среднее между event rail и departure board. Первый помогает обнаруживать неизвестное, второй — сравнивать известные альтернативы по времени. Resident Advisor и SNCF показывают плотные вертикальные representations именно там, где scan/comparison доминируют над визуальным storytelling.

Для carousel внешний корпус также не поддерживает бинарное решение «запретить» или «использовать». BBC показывает, что rail может быть прогрессивно улучшенным, полностью user-controlled и keyboard-accessible; Baymard показывает, что большая доля реальных реализаций всё равно остаётся проблемной. Правильный вопрос поэтому не «carousel good/bad», а есть ли у скрытия части контента достаточная продуктовая ценность, чтобы оплатить стоимость discoverability, accessibility и interaction complexity.

Аналогично skeleton нельзя превращать в обязательный «современный loading state». NN/g и Carbon связывают его с загрузкой структуры страницы; Carbon отдельно имеет inline loading для действия. Это фактически taxonomy по scope операции, а не выбор фирменной анимации.

С selection controls наиболее устойчивое правило — выбирать по semantic job. Radio отвечает «какое одно значение выбрано», tab — «какая панель активна», link/navigation — «куда переходим», action menu — «какую команду выполнить». Визуальная похожесть этих контролов не является достаточным основанием для component merge.

Реальные бизнес-кейсы успехов, ограничений и пересборки систем
Spotify Encore — важнейший контрпример как чрезмерной централизации, так и чрезмерной децентрализации. В Reimagining Design Systems at Spotify Spotify описывает раннюю систему GLUE: централизованная команда выросла более чем до 30 человек, но при высокоавтономной организации стала bottleneck. К 2018 году компания описывала масштаб примерно в 200 дизайнеров, 2 000 инженеров и 45 платформ; grassroots-реакцией стало возникновение 22 отдельных систем. Encore был построен как system-of-systems: общая Foundation задаёт минимальный общий язык, далее существуют Web/Mobile и локальные уровни.

Но это не история «децентрализация решила всё». В ретроспективе Can I Get an Encore? Spotify’s Design System, Three Years On Spotify признаёт, что гибкость и локальные systems начали образовывать своеобразную spider web, отражавшую организационную структуру сильнее, чем дизайн-задачи. Команда пришла к необходимости усиливать стандартизацию и пересматривать первоначальные критерии успеха, которые были слишком похожи на box-ticking adoption metrics.

Переносимый вывод: архитектура дизайн‑системы не должна автоматически копировать org chart. Централизация способна стать bottleneck; неограниченная локальная автономия — породить параллельные системы. Spotify даёт редкое корпоративное evidence обеих ошибок.

Airbnb DLS — сильный пример inventory → roles → массовая migration validation. В Building a Visual Language небольшая cross-functional группа начала с физического аудита существующих экранов: старые и новые flows были распечатаны и разложены рядом, чтобы увидеть расхождения, после чего первоначальный scope DLS намеренно ограничили native iOS/Android. Это очень близко к interface inventory Brad Frost, но показано на реальном продукте.

Более сильный evidence появляется в Working Type. Airbnb управлял typography через семантические styles вроде TextTitle3, поэтому смена definitions могла распространяться через компоненты вместо ручного изменения каждого экрана. При миграции на новый шрифт команда сделала более 11 000 screenshots на четырёх платформах и затем провела business-metric A/B experiment более чем на 2 млн пользователей; по корпоративной публикации существенного негативного эффекта на бизнес-метрики обнаружено не было. Это self-reported результат, но по уровню описанной validation существенно сильнее обычного «мы обновили typography».

Переносимый вывод: semantic typography role даёт не только visual consistency, но и migration leverage. Однако Airbnb не доказывает, что конкретные значения 24/32 или их scale универсальны; доказан процесс централизованной смены и масштабной проверки.

Atlassian — пример отказа от one-size-fits-all и staged rollout. В ретроспективе новой навигации Atlassian прямо описывает предыдущую архитектуру 2018 года как подход, который со временем перестал соответствовать разным продуктам и задачам. Новая navigation строилась на design-system primitives с централизованной библиотекой, включая accessibility и RTL behavior.

Вместо big-bang migration Atlassian сначала провёл internal rollout в середине 2024 года, затем Early Access примерно на 100 customer sites и 30 developer sites. Компания сообщила opt-out около 2,7%; после beta, охватившей более 1 500 sites и около 485 тыс. monthly active users за первые два месяца, opt-out был около 2,6%. General Availability начался поэтапно 17 марта 2025 года. Это корпоративные показатели adoption, а не независимая usability study, но они являются редким опубликованным примером staged validation системного UI-изменения.

Не менее ценно, что Atlassian Release Phases формализует lifecycle: Early Access → Beta → General Availability, а затем отдельные Intent to Deprecate → Deprecated phases. Experimental/Early Access может иметь breaking changes; GA считается стабильным, а удалению GA component должна предшествовать deprecation period и migration guidance.

Primer — один из сильнейших найденных прецедентов для candidate → promotion. Handling new patterns не заставляет каждую новую потребность немедленно становиться core Primer component. Product-specific pattern может оставаться локальным; кандидат на shared/system status появляется, если вероятно применение несколькими продуктами или новый pattern заменяет несколько расходящихся реализаций.

Adding new components описывает путь от custom product component через discoverability, quality, documentation и accessibility к upstream. Мaturity идёт через Alpha → Beta → Stable; Alpha можно применять в production, но consumer должен понимать риск изменений. Primer также поддерживает отдельный слой shared components, которыми владеют feature teams и которые не обязаны становиться core Primer.

Это очень сильный evidence против ложного бинарного выбора «либо component в design system, либо это плохой exception».

Carbon feature flags — контролируемое экспериментирование с будущим breaking behavior. Carbon Feature Flags позволяет opt-in к будущему поведению следующей major version, сохраняя старое поведение по умолчанию ради backwards compatibility. После major transition experiment может стать default. Это хороший технический прецедент для постепенной migration, когда невозможно синхронно обновить все consumers.

GOV.UK — evidence-first contribution вместо предварительного проектирования. Propose a component or pattern начинает contribution с user need, evidence, существующих примеров, screenshots и ссылок; guidance специально советует не тратить слишком много времени на детальную реализацию до того, как подтверждена сама проблема. Upcoming components and patterns делает candidate work видимым сообществу.

Spectrum 2 — lesson о том, что generic guidance недостаточно. Adobe описывает Spectrum как систему для более чем 100 приложений и design-организации в сотни людей. В статье Designing Design Systems: Supporting Implementation and Adoption команда Spectrum рассказывает, что документация первоначально выросла из playbook для internal beta, но абстрактного guidance оказалось недостаточно: продуктовым командам требовались примеры на реальных key screens/workflows. В одном из случаев рекомендацию уменьшить использование dividers команды интерпретировали слишком буквально, и пришлось добавлять конкретные product examples. Adobe также подчёркивает необходимость заранее сообщать deprecations и подробно показывать impact.

Это особенно релевантно будущей системе: документация вида «используйте меньше разделителей» или «делайте карточки компактнее» без scoped examples может увеличивать, а не уменьшать вариативность.

Shopify Polaris — стандартизация тоже может зайти слишком далеко. В ретроспективе дизайнера Shopify Uplifting Shopify Polaris описывается feedback, в котором прежний Shopify Admin воспринимался как dull, bland и слишком стерильно стандартизированный. При редизайне команда пыталась сохранить знакомые behavior/patterns, меняя visual language; крайне яркое направление оказалось слишком busy, крайне минимальное — слишком flat. В финале размеры текста частично уменьшили, поскольку merchants ценили более высокую information density. Это корпоративный practitioner case, а не независимое controlled study, но он хорошо демонстрирует реальный trade-off consistency ↔ density/character.

Текущая архитектура Polaris сделала ещё более серьёзный технический поворот: Polaris unified and for the web переводит систему в Web Components и объединяет framework для Admin, Checkout и Customer Accounts. Переход сначала вышел как release candidate с возможностью сосуществования и opt-in, а не одномоментной заменой. Корпоративный источник объясняет архитектурную мотивацию и migration strategy, но не публикует независимый UX-effect, поэтому его нельзя использовать как доказательство того, что Web Components сами по себе улучшают пользовательский опыт.

Для старого Polaris есть заявленный бывшим руководителем системы показатель роста adoption примерно с 40% до 89%, но он опубликован в персональном portfolio, а не независимом измерении; поэтому это стоит считать self-reported supporting evidence, а не доказанным outcome.

Совокупно бизнес-кейсы дают более устойчивый вывод, чем любой отдельный design-system API: успешные системы развиваются через inventory, ограниченный initial scope, explicit maturity, gradual rollout, observation of local divergence и возможность пересобрать собственную архитектуру. Spotify, Atlassian, Airbnb, Primer, Carbon, GOV.UK и Spectrum пришли к этим механизмам разными путями.

Candidate best practices
Ниже — не готовая дизайн‑система, а кандидатный набор принципов, которые имеют внешнее подтверждение и могут перейти на следующий этап проверки.

Candidate principle	Evidence	Когда применять	Где требуется исключение или локальная проверка
Нормализовать typography через semantic/visual roles, а не разрешённые вручную пары size × weight × line-height.	Material type roles, Fluent Text presets, USWDS tokens и Airbnb semantic styles.
практически любой multi-surface product; особенно ценно для будущих migrations	сами значения ролей должны тестироваться на используемом шрифте и кириллице
Развести heading semantics и visual heading style.	Primer отдельно сохраняет semantic hierarchy и visual typography; BBC также строит card heading hierarchy структурно.
компоненты, которые появляются на разных уровнях page outline	нельзя кодировать <h2> внутрь reusable card только потому, что визуально нужен «размер H2»
Контролировать measure отдельно от viewport.	BBC ~60–70 chars, USWDS 45–90 с ориентиром около 66, NHS 70–80, Primer около 80 max.
long-form text, descriptions, event details, editorial pages	compact data tables/listings являются другой задачей и не обязаны следовать prose measure
Не объявлять единственную density для всех surfaces.	Carbon productive/expressive typography; Gravity UI contextual component sizes; Polaris redesign feedback о density.
если продукт одновременно содержит dense operations и discovery/editorial	density modes не должны превращаться в произвольные размеры каждого компонента
Размер компонента — coordinated contract: height + text + padding + radius/icon, а не случайный prop.	Gravity UI Select и Nathan Curtis sizing practice.
controls, form fields, buttons, compact table UI	специальные touch/landing contexts могут требовать отдельного size role
Использовать intrinsic/fluid sizing там, где контент неизвестен, и content-informed fixed sizing там, где формат известен.	GOV.UK fixed input widths; BBC min-width grid; Gravity fixed/fluid containers.
inputs, cards, layout containers	значения min/max нельзя копировать между продуктами без content testing
Не делать одну “Card” универсальным решением для любого repeated content.	Material single-subject card; BBC functional Card; RA dense events; SNCF timetable rows.
общий card primitive возможен для общей anatomy	event discovery card, compact event row и timetable row могут заслуживать специализированных компонентов
Image policy строить по типу контента, а не по одному global crop rule.	BBC object-fit: cover для photographic card media и meaningful alt requirement; Meetup reuses event images across surfaces.
фото-preview и gallery media	poster/artwork с текстом требует отдельного теста contain, safe area и focal point; внешнего evidence для единого правила недостаточно
Loading states классифицировать по scope и duration.	Carbon skeleton vs inline loading, Material loading indicator, NN/g skeleton/progress research.
initial page/content → skeleton candidate; local action → inline indicator; measurable process → determinate progress candidate	очень быстрый response не должен мигать loading UI только ради системности
Empty/error/unavailable должны описывать состояние данных и следующий recovery action.	TfL сообщает stale/unretrievable state и reload; Southbank sold-out page сообщает альтернативный путь получения билета; DB предлагает альтернативы при disruption.
network failure, sold-out, missed connection, unavailable results	recovery невозможно обещать там, где у продукта реально нет следующего действия
Horizontal rail — progressive enhancement для secondary discovery, а не default repeated-content layout.	BBC accessible no-autoplay carousel; Baymard carousel failure rate и static alternative.
тематически однородная подборка, где скрытые элементы вторичны	critical choices, comparison, tall mobile content лучше сначала проверять как list/grid
Не autorotate mobile carousel.	BBC вообще сохраняет control у пользователя; Baymard актуально рекомендует не autorotate mobile slides.
почти все content rails	возможные исключения требуют серьёзного accessibility/usability evidence
Sticky использовать как функциональный optimization, а не визуальный default.	Smashing/Vitaly Friedman документирует benefits и zoom/focus/keyboard costs.
repeated high-priority navigation/action на длинной transactional surface	reading, forms с virtual keyboard, stacked sticky regions
При нескольких sticky surfaces документировать stacking и occlusion как состояние layout.	Sticky guidance показывает проблемы перекрытия content/focus и chained surfaces.
header + filter bar + mobile bottom action	без zoom/keyboard tests считать конфигурацию безопасной нельзя
Choice components нормализовать по semantics, а не внешней форме.	Primer Navigation, Carbon Dropdown, Gravity Radio/Segmented.
tabs, filters, forms, sort, view switcher	допустима общая styling foundation, но interaction contract должен оставаться отдельным
Hover/focus overlays проектировать так, чтобы в них можно было попасть и из них выйти.	WebAIM WCAG checklist; Gravity Popover.
tooltip/popover с дополнительным content	complex action panel может быть лучше реализован popup/dialog, чем “расширенным tooltip”
Interactive target увеличивать padding, а не только visual glyph.	WebAIM отдельно предупреждает о трудностях малых clickable areas; Primer рекомендует крупные mobile targets.
icon buttons, rail arrows, compact rows	dense desktop UI требует балансировать target size и information density
New component начинать с evidence о повторяющейся проблеме, а не с полировки API.	GOV.UK proposal process; Brad Frost inventory.
любой новый shared candidate	genuine one-off может законно остаться локальным
Разрешить product-specific incubation.	Primer explicit product/shared layers; Spotify local systems.
новая задача с недостаточным evidence для core	локальный component должен быть discoverable, иначе он превращается в shadow system
Promotion в core требовать после доказанного повторного use, а не после первого запроса.	Primer upstream criteria; GOV.UK evidence-first proposals.
component lifecycle	точный порог «2/3/5 команд» внешний корпус не устанавливает
Experimental/breaking behavior выпускать с maturity status или feature flag.	Atlassian release phases; Carbon feature flags.
API/visual changes, которые нельзя безопасно включить всем сразу	простые backwards-compatible fixes не требуют ceremony experiment
Deprecation — отдельный продуктовый этап, а не мгновенное удаление.	Atlassian Intent to Deprecate → Deprecated; Spectrum требует сообщать impact и migration details.
shared components с consumers	legacy component может оставаться дольше, если стоимость migration высока; срок должен быть осознанным
Измерять не только adoption, но и локальные обходы.	Spotify признаёт ограниченность box-ticking success criteria и последующую spider-web проблему.
зрелая система	высокий процент импорта библиотеки сам по себе не доказывает, что система решает продуктовые задачи

Последний принцип особенно важен для будущего решения о числе вариантов. Количество variants само по себе — плохая north-star metric. Можно иметь три официальных варианта и двадцать shadow components, либо десять системных variants, которые полностью покрывают реальные use cases. Primer и Spotify показывают, что важнее происхождение варианта, повторяемость потребности и видимость локальных отклонений.

Антипаттерны и решения, оказавшиеся недостаточно успешными
«Одна центральная система должна обслуживать всех одинаково». Spotify GLUE стал bottleneck в организации с высокой автономией. Это не означает, что централизованный core плох; означает, что core, требующий участия центральной команды в каждом продуктовом изменении, плохо масштабировался именно в Spotify.

Противоположная крайность — структура системы один в один повторяет организацию. После появления множества локальных систем Spotify обнаружил сложную spider-web архитектуру и пришёл к выводу, что system goals должны сильнее определять границы, чем org chart.

One-size-fits-all navigation. Atlassian прямо связывает пересборку глобальной навигации с тем, что прежняя унифицированная модель перестала соответствовать различным product workflows. Их ответом стала не бесконтрольная кастомизация, а новая общая primitive architecture плюс staged customer validation.

Вариант создаётся сразу при первом локальном отклонении. Primer демонстрирует противоположный maturity process: сначала product-specific/shared implementation, затем evidence reuse, quality, documentation и только после этого upstream. Отсутствие такой промежуточной зоны почти неизбежно заставляет либо загрязнять core, либо скрывать реальную работу в неподконтрольных shadow components. Последнее предложение — архитектурный вывод из модели Primer, а не дословное утверждение Primer.

Запрещать любое отклонение от design-system code через overrides. GOV.UK прямо предупреждает, что override внутренних styles системы создаёт риск поломок при обновлении, и рекомендует app-specific namespace/prefix для действительно локального расширения. Это важное различие: extension не равно patching internals.

Документировать только абстрактные правила. Spectrum обнаружил, что высокоуровневое guidance без concrete key-screen examples интерпретируется командами по-разному; совет по dividers пришлось уточнять реальными product examples.

Считать визуальную унификацию самоцелью. История Polaris показывает обратную реакцию: merchants воспринимали прежний Admin как стерильный и недостаточно выразительный, а при redesign одновременно запросили сохранить familiarity и более высокую density. Стандартизация, которая убирает различия между задачами, может стать визуально последовательной, но продуктово слабой. Это корпоративный qualitative case, не универсальная закономерность.

Skeleton everywhere. NN/g определяет skeleton как структурный full-page/loading placeholder; Carbon разделяет skeleton и inline loading. Использование skeleton для любого button action стирает полезное различие между «грузится структура» и «выполняется конкретная команда».

Spinner without recovery. Spinner показывает activity, но не решает failure. TfL полезен именно противоположным состоянием: stale/error превращается в сообщение о достоверности данных плюс reload.

Carousel как способ “впихнуть больше”. Независимое тестирование Baymard показывает частые UX-проблемы carousel; слишком высокий horizontal scroll region дополнительно конфликтует с vertical gesture. BBC показывает, насколько много дополнительной accessibility engineering требуется хорошо реализованному rail.

Autoplay carousel. BBC оставляет перемещение полностью под контролем пользователя; Baymard отдельно не рекомендует autorotation на mobile. Для event shelf, где пользователю нужно прочитать названия, даты и цены, autoplay особенно трудно оправдать внешним evidence.

Скрывать почти всю primary navigation только потому, что экран мобильный. Collapsed menu экономит место, и BBC использует его осмысленно, но Baymard наблюдал, что отсутствие видимого обзора категорий ухудшает initial orientation. Следовательно, fullscreen menu/drawer не должен автоматически означать, что на исходной странице нельзя оставить ключевые top-level destinations или category affordances.

Использовать sticky bars без проверки zoom и focus. Persistent surfaces способны перекрывать focused controls, внутренние anchors и значительную часть mobile viewport; особенно проблемна комбинация sticky UI и virtual keyboard.

Превращать radio, tabs и segmented controls в один visual primitive с одинаковым поведением. Они могут выглядеть сходно, но Primer и Gravity описывают разные jobs. Унификация implementation primitives допустима; унификация semantics — нет.

Делать deprecation silent breaking change. Atlassian выделяет отдельные deprecation phases, а Adobe подчёркивает необходимость показывать impact и migration. Это очень сильное совпадение двух независимых корпоративных систем.

Считать high adoption доказательством хорошей системы. Spotify позднее признал, что первоначальные success measures были слишком близки к checklist adoption. Следовательно, метрики вида «X% экранов используют component library» должны дополняться качеством task fit, количеством overrides, shadow components, accessibility defects и migration burden.

Копировать опубликованный размер как стандарт. BBC card 266px, Gravity Select 24/28/36/44, GOV.UK content width или Carbon 14/16 px bases — все эти числа имеют контекст. Сильное evidence лежит в систематизации и условиях использования, а не в переносе конкретного числа в другой продукт.

Возможные модели нормализации типографики, размеров и вариантов
Ни одна из моделей ниже не выбирается как победитель. Они представляют разные архитектурные гипотезы, реально поддержанные внешними прецедентами.

Модель «дискретные semantic roles». Typography представляет небольшой набор ролей — например body/caption/label/title/display — с несколькими breakpoint-specific значениями. Это ближе к GOV.UK, Fluent и части Material practice. Преимущества: предсказуемый QA, понятный mapping design↔code, ограниченное число конечных состояний. Цена: между breakpoints могут быть заметные jumps, а expressive page может испытывать недостаток градаций.

В этой модели numeric scale остаётся internal foundation, но product API использует только роли. USWDS — хороший precedent: underlying system может быть больше, чем реально включённый theme subset.

Модель «productive + expressive». Вместо единственной шкалы существуют два контролируемых режима: компактный для schedules/forms/tables/admin и expressive для event discovery/editorial/hero surfaces. Carbon является прямым внешним precedent этой архитектуры. Material 3 Expressive показывает сходную потребность отделить более выразительную композицию от обычного utility UI.

Преимущество — нет необходимости выбирать искусственное среднее между departure board и cultural landing. Риск — роли начинают дублироваться (productive-title, expressive-title, и т. п.), если граница двух режимов не определена через page/task context.

Модель «стабильный body + fluid display». Body, labels и controls остаются дискретными ради predictability, тогда как только крупные editorial/display headings становятся fluid в пределах min/max. Carbon поддерживает как fixed, так и fluid expressive heading styles, тогда как Primer/GOV.UK дают контрастный discrete precedent.

Такая модель особенно интересна для длинных event titles на очень разных viewport, но не должна приниматься без проверки кириллицы: fluid interpolation решает изменение размера, но не гарантирует приемлемые переносы слов или высоту hero.

Модель «platform-adaptive semantic typography». Один semantic role сохраняет meaning, но конкретная реализация может соответствовать native/platform typography. Fluent 2, например, сохраняет общую hierarchy, но использует нативные системные fonts на соответствующих платформах; Apple строит интерфейсы вокруг системных text styles и Dynamic Type.

Эта модель подходит, если design system действительно multi-platform. Цена — pixel-identical consistency становится вторичной по сравнению с semantic consistency.

Для component sizing также видны по крайней мере три жизнеспособные архитектуры.

Named density sizes. S/M/L или компактный/default/comfortable одновременно изменяют height, padding, type и icon geometry. Gravity UI — непосредственный пример. Это подходит controls, если реально существуют разные плотностные контексты.

One default + explicit exceptional context. Большинство компонентов имеет один основной размер, а compact или large вводится только после evidence. Это ближе к принципу Nathan Curtis «начать с реально нужного набора и расширять по потребности» и хорошо сочетается с GOV.UK-style constrained components.

Intrinsic sizing with min/max constraints. Вместо множества named widths component получает content-driven width плюс системные minimum/maximum constraints. BBC cards и Gravity containers показывают оба элемента этой модели. Для известного формата отдельные controls могут оставаться content-specific fixed width, как у GOV.UK.

Для component variants внешний evidence поддерживает как минимум три структуры.

Core component + ограниченные official variants. Material Card с elevated/filled/outlined — классический пример. Полезен, когда anatomy и behavior практически одинаковы, а различие в emphasis/surface.

Specialised components поверх shared primitives. Event Card, Event Compact Row, Timetable Row или Media Promo могут использовать общие Typography/Stack/Media/Action primitives, но оставаться отдельными components, если их information contract и states реально различаются. Это ближе к Primer shared/product patterns и к различиям BBC Card/Promo.

Incubation → promotion. Новый variant сначала существует как candidate/product-specific implementation, становится discoverable и измеряется; при повторном use может перейти в shared layer, затем в core. Primer и GOV.UK дают наиболее прямой external precedent, Atlassian — maturity vocabulary, Carbon — механизм opt-in behavior.

Возможная lifecycle vocabulary, не как окончательная спецификация, а как исследовательская модель, выглядит так:

local experiment → candidate → shared/product-specific → system beta → stable → intent-to-deprecate → deprecated → archive

Она синтезирует Primer, GOV.UK и Atlassian, но ни одна из этих систем не требует именно такого единого набора стадий. Поэтому копировать taxonomy буквально не следует.

На практике важнее определить promotion evidence, чем количество стадий. Внешний corpus предлагает следующие виды evidence: повторяемость одного user need в нескольких местах; несколько независимо возникших implementations; отсутствие возможности решить задачу существующим component; accessibility maturity; понятная ownership/maintenance model; подтверждённая migration benefit. Primer особенно явно связывает upstream с multi-team applicability и качеством/поддерживаемостью, а GOV.UK — с user-needs evidence.

Таким образом, внешние примеры не дают оснований объявить: «должно быть ровно N font roles», «ровно три размера control», «ровно две Event Card» или «все variants после третьего usage становятся core». Они дают архитектурные модели, критерии и механизмы проверки.

Вопросы, которые нельзя решить внешними примерами и нужно проверять отдельно
Какая именно типографическая шкала работает с вашим шрифтом и кириллицей. BBC, GOV.UK, Carbon, Material, Fluent и Primer дают сильное evidence по ролям, line-height, measure и responsive logic, но конкретные font metrics отличаются. Airbnb даже при контролируемой замене одного собственного typeface другим провёл более 11 000 screenshot checks и A/B experiment на миллионах пользователей — хороший индикатор того, насколько рискованно считать typography migration чисто token-level изменением.

Необходимо отдельно проверять длинные русские названия событий, многословные venue names, даты, price/status labels, uppercase abbreviations, переносы и сочетания латиницы с кириллицей. Внешний корпус не устанавливает приемлемое максимальное число строк для такого конкретного контента.

Какая density нужна пользователям. Carbon доказывает жизнеспособность productive/expressive split, Gravity — contextual sizes, Polaris — то, что пользователи merchant UI могут ценить более высокую density. Но это не определяет, какая density правильна именно для вашей аудитории.

Особенно нужно измерить различия между browsing events, быстрым просмотром расписания, выбором билета и чтением event detail: внешние продукты показывают, что это разные density classes, но не дают ваших порогов.

Сколько event-card representations действительно необходимо. RA подтверждает ценность compact list, Southbank — image-led discovery, BBC — функциональной card anatomy. Из этого можно доказать наличие разных task patterns, но не конкретное число components вашей системы.

Здесь нужен собственный interface inventory: собрать все существующие event cards/rows рядом, разметить их по user job, информации, interaction и state, и только потом определять merge/split. Именно такой порядок рекомендует Brad Frost; аналогичный audit был началом Airbnb DLS.

Когда афиша должна быть contain, а фотография cover; нужен ли focal point и какие safe areas. BBC даёт хороший photographic-card precedent с cover, но просмотренный корпус не даёт достаточно сильного cross-product evidence для конкретной универсальной poster policy.

Это нужно проверять на реальных assets: вертикальные постеры, горизонтальные фотографии, квадратные иллюстрации, artwork с текстом по краям, изображения без focal metadata, low-resolution originals и missing image. Здесь внешняя практика полезна как набор гипотез, а не готовый token.

Нужен ли sticky event CTA. Профессиональное evidence показывает условия и риски sticky UI, но не доказывает, что фиксированная purchase bar повысит completion именно в рассматриваемом продукте.

Нужно сравнить минимум flow CTA, repeated CTA и sticky/fixed mobile CTA на реальном page length, особенно при 200–400% zoom, screen reader/keyboard interaction и открытой virtual keyboard.

Стоит ли конкретный shelf делать горизонтальным. BBC доказывает, что rail можно реализовать хорошо; Baymard — что carousel часто реализуется плохо и static alternative способен работать не хуже.

Следовательно, решение требует данных о том, замечают ли пользователи continuation cue, сколько элементов они реально открывают, нужна ли им возможность сравнения и насколько rail конфликтует с vertical scrolling на mobile.

Какой loading threshold нужен именно продукту. Material, Carbon и NN/g дают относительную taxonomy, но не заменяют реальные latency distributions вашего backend.

До выбора skeleton/spinner/progress нужно знать p50/p95 loading times, частоту cache/stale content, вероятность partial data, возможность optimistic rendering и способы recovery. Иначе дизайн‑система будет кодировать предположение о производительности вместо реальности.

Какие empty и unavailable states существуют доменно. Для events это могут быть «нет событий по фильтрам», «событие отменено», «продажи ещё не открыты», «sold out», «registration closed», «событие завершено»; для транспорта — «рейсов нет», «последний рейс ушёл», «расписание устарело», «service disrupted», «альтернатива доступна». TfL, Southbank и DB показывают, что эти состояния имеют разные recovery paths, а не должны схлопываться в универсальное EmptyState.

Как должны работать last service и approximate time именно в предметной области. SNCF показывает полезность first/last departure summary; DB — real-time alternatives; TfL — planned departure/arrival и stale-data recovery. Однако формат ≈, uncertainty language, timezone handling и правила overnight service зависят от ваших транспортных данных и должны проверяться с domain experts и пользователями.

Где проходит граница между dropdown, popover, drawer и fullscreen mobile menu. BBC, Primer, Carbon и Gravity хорошо определяют component semantics, но layout transition между desktop и mobile зависит от глубины IA, числа элементов и задач.

Особенно нельзя внешним исследованием определить, при каком именно breakpoint desktop popover должен превращаться в bottom sheet/fullscreen menu: Primer предлагает мыслить доступным пространством, а не конкретным классом устройства.

Сколько вариантов компонента является “слишком много”. Ни Primer, Atlassian, Carbon, GOV.UK, Spotify, Material, ни рассмотренные practitioner sources не дают обоснованного универсального числа. Их evidence указывает на governance criteria вместо numerical cap: recurring need, semantic difference, product breadth, ownership, adoption, migration cost и evidence локальных обходов.

Поэтому потенциальный показатель для следующего этапа — не «вариантов должно быть не больше четырёх», а, например, доля variants с уникальным user job, количество product-local alternatives той же задачи, число overrides и consumers каждого variant. Точный metric set следует определить по собственной кодовой и дизайн-инвентаризации.

Когда merge хуже split. Внешние примеры позволяют сформулировать критерий для теста: если два визуально похожих элемента имеют различную семантику, state machine, responsive transformation или accessibility contract, merge может создать сложный prop matrix. Primer Navigation и Gravity Radio/Segmented наглядно показывают такое семантическое разделение.

Обратная ситуация — несколько компонентов решают один user need и отличаются исторически. Primer прямо рассматривает несколько расходящихся implementations как сигнал к возможному shared candidate.

Какие shadow components уже существуют. Ни один внешний источник этого определить не может. Именно поэтому перед нормализацией нужен собственный interface/code inventory: visual screenshots, Figma components, production DOM/components, CSS overrides и product-specific wrappers следует сопоставить по use case. Методологический precedent дают Frost, Airbnb и Spotify: inventory и обнаружение локального divergence предшествуют устойчивой централизации, а не следуют после неё.

Как измерять успех будущей нормализации. Внешний corpus показывает, чего недостаточно: Spotify предупреждает против box-ticking adoption; Atlassian показывает value staged opt-out/rollout evidence; Airbnb — visual QA плюс controlled business experiment; Spectrum — feedback/support вокруг implementation; Primer — maturity и multi-team reuse.

Следовательно, следующий этап должен отдельно решить, какие сочетания reuse, task success, accessibility defects, overrides, shadow components, migration effort, implementation speed и visual divergence считаются успехом именно в данном продукте. Внешние кейсы дают набор возможных измерений, но не универсальный KPI.

Именно в этих нерешённых вопросах проходит граница внешнего исследования: доказательный корпус достаточно устойчиво поддерживает role-based typography, controlled measure, contextual density, semantic component choice, explicit loading/recovery taxonomy, осторожное использование rails/sticky surfaces и управляемый lifecycle компонентов, но не позволяет честно вывести из внешних примеров конкретную шкалу шрифта, набор spacing tokens, число Card variants, poster ratio или единственную архитектуру дизайн‑системы. Эти решения должны появиться только после сопоставления внешнего evidence с собственным interface inventory, реальным контентом, accessibility testing и продуктовыми сценариями.
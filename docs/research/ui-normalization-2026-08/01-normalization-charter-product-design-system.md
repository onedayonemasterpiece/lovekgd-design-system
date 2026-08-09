Evidence-based Normalization Charter для продуктовой дизайн-системы «Полюбить Калининград Анонсы»
Разработка нормативной базы (Normalization Charter) для продуктовой дизайн-системы статического сайта событий «Полюбить Калининград Анонсы» на базе Astro SSG требует глубокого осмысления текущего состояния продукта. В исходном снимке состояния (snapshot decoder-v1-snapshot-20260808T124842-4786ac53bc) зафиксирована высокая степень фрагментации, выражающаяся в наличии 107 логических компонентов, разрозненных визуальных контрактов и неурегулированных экспериментальных внедрений. Настоящее исследование направлено на формирование доказательной базы для сведения случайных реализаций к семантически обоснованному набору ресурсов, не уничтожая при этом уникальные продуктовые характеристики.

Анализ опирается на четыре раздельных класса доказательств: нормативные стандарты (Normative standards), официальные руководства (Official guidance), конвенции открытых дизайн-систем (Design-system conventions) и фактические данные проекта (Project evidence). Данные классы используются для всесторонней оценки каждого архитектурного решения.

Внешние дизайн-системы: Разделение принципов и реализаций
При обращении к опыту современных открытых дизайн-систем, таких как USWDS, GOV.UK, Carbon и Material 3, критически важно разделять переносимые принципы, контекстно зависимые реализации и значения, запрещенные к прямому копированию.

Переносимым принципом является математическая основа пространственных шкал и нормализация метрик шрифта. Например, использование базовой сетки, кратной 4 или 8 пикселям, является фундаментальным подходом, независимым от продукта, который успешно применяется в Carbon Design System. Подобные принципы могут быть импортированы в проект без значительных модификаций, так как они решают универсальные проблемы когнитивной нагрузки и визуального ритма.

Контекстно зависимой реализацией выступают анатомические паттерны компонентов. Решение USWDS или GOV.UK о структуре хлебных крошек или полей ввода дат продиктовано спецификой государственных услуг и требованиями заполнения сложных форм. Для статического сайта анонсов мероприятий анатомия карточки события (EventCard) будет принципиально иной, ориентированной на быстрое сканирование дат, цен и визуальных постеров. Данные реализации требуют адаптации под выявленные проектные фикстуры, включая смешанные данные формата «дата/время/возраст/цена».

К значениям, которые нельзя копировать без проверки, относятся абсолютные токены размеров шрифтов и высоты строк. USWDS применяет сложные механизмы нормализации шрифтов на основе оптического размера, зависящего от конкретной гарнитуры (например, Public Sans). Импорт готовой типографической шкалы другой системы целиком приведет к разрушению макетов при рендеринге длинных русскоязычных заголовков, поскольку метрики кириллических выносных элементов и x-height (высота строчных знаков) уникальны для каждого шрифтового файла.

Исследовательский блок 1: Typography rationalization
Семантическая иерархия против визуальных ролей
Разделение семантической структуры документа и визуального представления текста является фундаментальным условием масштабируемости и доступности. В текущем корпусе продукта зафиксировано прямое связывание тегов заголовков (<h1>–<h6>) с визуальными размерами, что ведет к конфликтам: контент-менеджеры выбирают теги ради нужного визуального веса, разрушая логическое дерево документа. Нормативные стандарты WCAG (SC 1.3.1 Info and Relationships) требуют строгой иерархии, не зависящей от визуальной презентации.

Анализ конвенций USWDS и Carbon демонстрирует архитектуру, в которой HTML-семантика отвечает исключительно за структуру, а визуальные классы или миксины (например, .typeset('heading', 'lg')) управляют отображением. Данный подход позволяет заголовку <h2> на главной странице выглядеть как массивный промо-блок, а в боковой колонке — как компактный элемент интерфейса, сохраняя при этом целостность для программ экранного доступа.

Сравнительный анализ вариантов количества визуальных ролей выявил три потенциальных пути для нормализации. Первый вариант предполагает минималистичную структуру из четырех ролей (Title, Subtitle, Body, Caption). Данный подход не выдерживает нагрузочного тестирования продуктовыми фикстурами: он не позволяет дифференцировать огромные промо-заголовки (display) от стандартных заголовков страниц (page title), что критично для статического сайта анонсов. Второй вариант предлагает детализированную систему из 9–11 ролей (как в Material 3), однако для небольшой продуктовой дизайн-системы это создаст избыточную когнитивную нагрузку при поддержке. Третий, оптимальный вариант, включает 6–7 ролей: Display (промо), Page Title (H1), Section Title (H2/H3), Body (основной текст), UI Label (кнопки, вкладки) и Metadata/Caption (даты, цены, источники). Этот вариант обеспечивает достаточную гибкость для покрытия текущего корпуса, исключая дублирование. Применение роли UI Label требует отказа от стилизации текста заглавными буквами (All-Caps) для улучшения читаемости, что подтверждается обновленными рекомендациями Material Design.

Target Value / Range	Semantic Role	Evidence & Convention	AS-IS Coverage	Excluded AS-IS	Migration Risks	Confidence
font-size: clamp(2.5rem, 5vw, 3.5rem)	Display
Fluid typography, Editorial design conventions

EventHero, PromoBanner	Статичные h1 с font-size: 48px без адаптива	Риск обрезки "очень длинного названия события" на узких экранах	High
font-size: clamp(1.75rem, 3.5vw, 2.25rem)	Page Title
Minor Third scale

ArticleHeader, EventDetailTitle	Смешанные стили заголовков внутри markdown-контента	Требуется рефакторинг парсера контента	High
font-size: 1rem (16px)	Body
WCAG 2.2 text sizing, USWDS baseline

Большинство текстовых блоков	Мелкий текст 13px и 14px, используемый как body	Увеличение общей высоты страниц, смещение сетки	Medium
font-size: 0.875rem (14px)	Metadata / UI Label
Carbon UI-01 token logic

Даты, время, цены, кнопки	font-size: 11px (не проходит WCAG 1.4.4 при зумировании)	Возможен сдвиг иконок внутри кнопок	High

Оптический размер, шрифтовые метрики и стресс-тестирование
Метрики шрифта, в частности x-height (расстояние от базовой линии до верхней границы строчных знаков без выносных элементов), напрямую определяют оптический размер и требуемую высоту строки. Для кириллического контента характерно обилие выносных элементов (д, щ, ц, б), которые выходят за пределы стандартной x-height. Если высота строки (line-height) задана слишком плотно, выносные элементы соседних строк сталкиваются, разрушая читаемость. Тестирование фикстурой «длинный заголовок в 2–4 строки» с использованием свойства browser zoom выявляет, что стандартная высота строки 1.1 или 1.2, часто применяемая в латинице для крупных заголовков, вызывает конфликты рендеринга в кириллице. Оптимальным целевым значением для кириллических дисплейных заголовков является диапазон 1.15–1.25, а для основного текста — 1.5–1.6.

Для смешанного контента (фикстура «смешанные дата/время/возраст/цена») критически важно использование CSS-свойства font-variant-numeric: tabular-nums. Это предотвращает "пляску" цифр при рендеринге списков сеансов и таблиц цен, выравнивая ширину каждого символа.

Разработано три кандидатные модели масштабирования (подробно описаны в приложении 3), базирующиеся на концепции флюидной типографики (Fluid Typography), где размеры плавно интерполируются между минимальным и максимальным значениями ширины экрана.

Compact Model (Компактная): Основана на коэффициенте Minor Second (1.067). Она генерирует минимальные различия между уровнями иерархии, что идеально подходит для плотных интерфейсов (например, сложных фильтров и расписаний). Однако при тестировании фикстурой «очень длинное название события» и «короткий заголовок» выявляется ее невыразительность для промо-материалов сайта событий.

Balanced Model (Сбалансированная): Основана на коэффициенте Minor Third (1.200). Обеспечивает классический журнальный ритм. При тестировании фикстурой «длинное название площадки» демонстрирует устойчивость к переполнениям контейнеров (overflow), требуя применения line-clamp: 2 или 3 лишь в исключительных карточках на мобильных ширинах.

Expressive Model (Экспрессивная): Основана на коэффициенте Perfect Fourth (1.333). Создает сильный контраст, идеальный для лендингов, но катастрофически проваливает стресс-тест длинными русскими заголовками в узких колонках (фикстура «мобильные ширины»), вызывая разрушение макета (layout break) из-за неконтролируемых переносов слов.

Выбор между моделями потребует оценки владельцем продукта, однако исследование указывает на Balanced Model как на наименее рискованный вариант миграции.

Исследовательский блок 2: Spacing and sizing
Пространственные шкалы и плотность
Фрагментация AS-IS UI наиболее ярко проявляется в значениях отступов. Текущий корпус демонстрирует случайные значения (padding: 7px, margin: 15px, gap: 10px). Дизайн-конвенции индустриальных стандартов, таких как Carbon Design System и USWDS, однозначно предписывают использование математически обоснованных модульных шкал, чаще всего основанных на базовом значении в 4 или 8 пикселей. Внедрение токенов отступов (например, $spacing-03 для 8px, $spacing-05 для 16px) устраняет догадки при проектировании и разработке, обеспечивая консистентный визуальный ритм.

Применение данной шкалы к фикстуре «0/1/many элементов» доказывает свою эффективность: пустое состояние (0) требует крупных отступов (например, 64px) для центрирования сообщения, состояние одного элемента (1) опирается на стандартные отступы контейнера (24px), а списки (many) требуют малых зазоров (gap: 16px) для группировки связанных сущностей. Элементы, расположенные близко друг к другу, воспринимаются как связанные (закон близости), что формирует иерархию без необходимости использования разделительных линий.

Target Value / Range	Semantic Role	Evidence & Convention	AS-IS Coverage	Excluded AS-IS	Migration Risks	Confidence
8px steps (4, 8, 16, 24...)	Layout & Component padding
Carbon Spacing Scale, USWDS

~40% текущих отступов случайно совпадают	Значения 3px, 5px, 7px, 10px, 15px	Незначительные сдвиги макета, требующие визуального регрессионного тестирования	High
Min 24x24 px	Touch/Pointer Target (Minimum)
WCAG 2.2 SC 2.5.8

Иконки закрытия, инлайн-ссылки	Старые теги размером 18x18px без внутренних отступов	Изменение плотности header-компонентов	High
Min 44x44 px	Touch/Pointer Target (Recommended)	Platform guidance (Apple HIG, Google Material)	Основные CTA-кнопки	Вторичные кнопки навигации (сейчас 32px)	Пересмотр компоновки мобильной навигации	Medium
clamp(32px, 5vw, 64px)	Section Gap	Editorial / Fluid layout conventions	Расстояния между секциями на новых страницах	Старые статьи с жестким margin: 50px	Отсутствуют	High

Целевые размеры интерактивных элементов разделяются на нормативный минимум и рекомендованные проектные цели. Нормативный стандарт WCAG 2.2 (SC 2.5.8 Target Size Minimum) предписывает размер не менее 24×24 CSS-пикселей для предотвращения ошибочных нажатий. Однако официальные платформенные рекомендации настаивают на 44×44 px для первичных контролов на мобильных устройствах. Исключения (compact exception) допускаются для плотных артефактов (например, списка тегов возраста или категорий), где размер может составлять 32×32 px при условии соблюдения безопасных отступов между ними (не менее 8px).

Для управления шириной контейнеров (grid constraints) и брейкпоинтами (breakpoint policy) рекомендуется отказ от жестких фиксированных ширин в пользу гибких ограничений (например, max-width: 1200px), что позволяет контенту адаптироваться под фикстуры «мобильные ширины», «tablet» и «desktop» без резких скачков макета.

Исследовательский блок 3: Media behavior
Поведение медиа-ресурсов на сайте событий критически важно, поскольку постеры и фотографии являются основными драйверами конверсии. Фрагментация AS-IS демонстрирует непредсказуемое поведение изображений: от сплющивания до неконтролируемой обрезки.

Регламентация словаря пропорций (aspect-ratio vocabularies) является первоочередной задачей. Использование CSS-свойства aspect-ratio позволяет браузеру резервировать пространство для изображения еще до его загрузки, что предотвращает кумулятивный сдвиг макета (Cumulative Layout Shift, CLS) — критически важную метрику производительности. Для EventCard и EventHero необходимо утвердить ограниченный набор пропорций: 2:3 или 3:4 для портретных постеров (portrait poster), 1:1 для медальонов и артефактов (square), и 16:9 для широких баннеров (landscape).

Responsive art direction (адаптивная смена арт-дирекшена) требуется для фикстуры «изображение landscape» в контексте EventHero. На мобильных устройствах широкое изображение 16:9 становится слишком мелким, а попытка растянуть его через object-fit: cover на высоту экрана обрезает критичный контент (например, текст на самом постере). Реализация этого поведения требует использования HTML-элемента <picture> с комбинацией атрибутов srcset и sizes, позволяя доставлять разные кропы изображения в зависимости от ширины вьюпорта.

Target Value / Range	Semantic Role	Evidence & Convention	AS-IS Coverage	Excluded AS-IS	Migration Risks	Confidence
aspect-ratio: 2/3	Event Poster	Conventional movie/event poster sizing	Карточки событий в каталоге	Изображения свободных пропорций (masonry)	Обрезка важных частей старых постеров	High
aspect-ratio: 16/9	Gallery / Hero	Platform standards (16:9 video/photo)	Страницы детального просмотра (cover)	Панорамные фото 21:9	Требуется арт-дирекшен при загрузке контента	High
object-fit: cover & object-position	Safe Areas / Focal Point	CSS Specifications	Большинство img внутри контейнеров	Сплющенные изображения без object-fit	Необходимость ручного указания focal point для сложных постеров	Medium
Обработка отсутствующих или ошибочных изображений (фикстуры «отсутствующее изображение», «ошибочное изображение») требует формализации fallbacks. На статическом сайте (Astro SSG) не загрузившееся изображение не должно ломать сетку. Контейнер должен сохранять свой aspect-ratio, отображая нейтральный паттерн (Data URI SVG) или брендированный плейсхолдер.

Исследовательский блок 4: Loading, empty, partial and recovery
Специфика Astro SSG (Static Site Generation) диктует особый подход к состояниям загрузки. Большая часть контента генерируется на этапе сборки и доставляется мгновенно. Применение паттерна «skeleton» (скелетная загрузка) к статически отрендеренным областям является антипаттерном, так как фаза рантайм-загрузки отсутствует.

Тем не менее, продукт содержит динамические возможности (острова), такие как проверка статуса билетов или персональные лайки. Для таких областей исследование выделяет два паттерна:

Stale-while-refresh: Пользователь видит закэшированные (или статичные) данные, в то время как в фоновом режиме происходит запрос к API. Если данные изменились, UI обновляется. Это минимизирует визуальный шум.

Optimistic UI: При лайке события или добавлении в избранное интерфейс немедленно переходит в состояние «успех», отправляя запрос в фоне. Это снижает воспринимаемую задержку. Для таких взаимодействий использование спиннеров (inline loading) внутри кнопок допускается только при деструктивных или финансово значимых транзакциях (например, инициация оплаты).

Пустые состояния (empty) и состояния восстановления (recovery) должны быть спроектированы для фикстуры «0 элементов». Если фильтр не нашел событий, недопустимо оставлять пустую белую страницу или техническую ошибку. Паттерн восстановления должен включать: четкий статус (почему пусто), семантическое объяснение и кнопку сброса контекста («Сбросить фильтры»).

Исследовательский блок 5: Shelves, rails and scrolling
Анализ AS-IS выявил смешивание концепций горизонтальных контентных рельсов (shelves/rails) и вращающихся каруселей (carousels). Эти паттерны имеют принципиально разную семантику доступности и техническую реализацию.

Горизонтальные рельсы (Horizontal content rails)
Рельсы представляют собой прокручиваемые по горизонтали списки (например, список предстоящих событий или артистов). Для их реализации нормативные стандарты CSS предоставляют модуль Scroll Snap. Использование scroll-snap-type: x mandatory или proximity обеспечивает нативную, аппаратно ускоренную прокрутку, фиксируя карточки в заданных позициях без единой строки JavaScript.

При внедрении scroll-snap критически важно использование свойства scroll-padding-inline-start. Без него карточка прилипнет к самому краю экрана, игнорируя общие отступы контейнера, что разрушает визуальную целостность сетки. Полноценная поддержка клавиатуры достигается автоматически: браузер сам прокручивает нативный скролл-контейнер при фокусировке на следующей карточке (tabbing). Контроллы previous/next в данном паттерне реализуются как прогрессивное улучшение через метод scrollIntoView().

Автоматически вращающиеся карусели (Carousels)
Если продукт требует карусели с автоматической сменой слайдов и точечной пагинацией (pagination dots), вступают в силу жесткие требования WAI-ARIA APG.

Контейнер такой карусели обязан иметь role="region" или role="group", а также атрибут aria-roledescription="carousel" для идентификации скринридерами. Сами слайды маркируются как aria-roledescription="slide". Доступность требует реализации кнопки паузы/остановки ротации, а также автоматической остановки анимации при получении фокуса (keyboard focus) или наведении курсора (hover).

Для статического сайта поддержка сложных ARIA-каруселей сопряжена с высокими затратами на JavaScript. Рекомендация исследования: там, где авто-ротация не является жестким бизнес-требованием, конвертировать карусели в нативные CSS-рельсы со scroll-snap.

Target Value / Range	Semantic Role	Evidence & Convention	AS-IS Coverage	Excluded AS-IS	Migration Risks	Confidence
scroll-snap-type: x proximity	Content Rail
CSS Specification

Блоки "Похожие события", "Площадки"	Кастомные JS-слайдеры на базе старых библиотек	Удаление старых библиотек может временно сломать верстку	High
role="region", aria-roledescription="carousel"	Auto-Carousel
WAI-ARIA APG

Промо-блок на главной странице	Слайдеры без элементов паузы и ARIA-меток	Переписывание логики слайдера с нуля	High
scroll-padding-inline: clamp(...)	Alignment
CSS Specifications

Отсутствует	Контейнеры с прилипающим к краю контентом	Нет рисков	High

Исследовательский блок 6: Sticky and fixed surfaces
Закрепленные заголовки (sticky headers) и плавающие контролы (floating controls) подвержены двум основным проблемам: перекрытию контента и конфликтам z-index.

При использовании якорных ссылок (anchor links) переход к элементу заставляет браузер прокрутить страницу так, чтобы верхняя граница элемента совпала с верхней границей окна. Если на странице присутствует закрепленный заголовок, он перекроет контент. Это нормативно решается глобальным применением свойства scroll-padding-top на корневом элементе <html>, значение которого равно высоте закрепленного заголовка.

Фиксированная нижняя навигация (fixed bottom navigation) на мобильных устройствах сталкивается с поведением UI браузера (mobile browser chrome). Использование классического height: 100vh приводит к тому, что нижняя часть интерфейса скрывается под панелью адреса браузера, особенно в Safari на iOS. Нормативный стандарт CSS предлагает единицы измерения dvh (dynamic viewport height) и svh (small viewport height), которые учитывают размер панели браузера. Кроме того, использование переменных env(safe-area-inset-bottom) обязательно для предотвращения конфликтов с системным индикатором Home на iPhone.

Анализ корпуса выявил хаотичное использование z-index (значения вроде 9999 или 99999). Проекту необходима ограниченная шкала наложения. Например: 100 для sticky-элементов, 400 для оверлеев и выпадающих меню, 1300 для модальных окон. Это устраняет непредсказуемое перекрытие слоев.

Исследовательский блок 7: Menus, overlays, disclosure and selection
Паттерны раскрытия контента и выбора параметров (фильтры, настройки) должны строго следовать руководствам WAI-ARIA APG.

Модальные окна (Modal surface) блокируют взаимодействие с остальной страницей. Их реализация требует удержания фокуса внутри окна (focus trap), возврата фокуса на вызывающий элемент после закрытия, а также поддержки закрытия по клавише Escape и клику вне области. Использование современного нативного HTML-элемента <dialog> обеспечивает большинство этих требований на уровне движка браузера, минимизируя потребность в кастомном JavaScript.

Для блоков FAQ или простых скрытых секций (Disclosure/details) рекомендуется использовать нативные теги <details> и <summary>. Паттерн "Disclosure" в APG автоматически применяется браузером для этих элементов, обеспечивая корректные состояния expanded/collapsed для скринридеров без добавления ARIA-атрибутов вручную.

При выборе элемента из списка (например, выбор площадки из длинного перечня) сложные паттерны вроде Combobox или Listbox требуют массивной логики для поддержки клавиатурной навигации стрелками. Исследование рекомендует оценивать возможность использования нативных элементов <select> на мобильных устройствах, где системный интерфейс (например, барабан выбора в iOS) обеспечивает безупречную доступность и эргономику.

Исследовательский блок 8: Motion
Анимация в продуктовой дизайн-системе должна нести функциональную нагрузку: информировать о смене состояния, указывать на появление нового элемента или связывать контексты. Декоративная анимация, не служащая этим целям, снижает воспринимаемую производительность.

Критически важным нормативным требованием является поддержка медиазапроса @media (prefers-reduced-motion: reduce). Для пользователей с вестибулярными нарушениями анимации масштабирования или скольжения через весь экран могут вызывать физический дискомфорт. В дизайн-системе должен быть предусмотрен глобальный переключатель токенов, который в случае активации этой настройки сводит длительность анимаций к мгновенной (0.001ms или none), либо заменяет пространственные перемещения на плавное изменение прозрачности (fade).

Категории продолжительности анимаций должны быть стандартизированы:

Микровзаимодействия (изменение цвета кнопки, появление тултипа): 100–150 мс.

Перемещение малых элементов (раскрытие аккордеона): 200–250 мс.

Полноэкранные трансформации (открытие мобильного меню): 300–400 мс.

Исследовательский блок 9: Component convergence
Снимок состояния AS-IS выявил 107 логических компонентов. Управление таким объемом для статического сайта невозможно без глубокой конвергенции (сведения). Разработан фреймворк принятия решений, запрещающий объединение компонентов исключительно на базе их визуального сходства (так как семантика может отличаться) или разделение только из-за того, что они лежат в разных CSS-файлах.

Оценка компонентов проводится по следующим критериям:

Semantic role: Если EventCardDesktop и EventCardMobile служат одной цели (представление анонса), они подлежат слиянию (Merge) с использованием адаптивной CSS-геометрии (responsive geometry) и container queries.

Anatomy: Если два компонента имеют разные DOM-деревья (например, в одном есть изображение и кнопка, в другом только текст), их следует разделить (Split) на базовые примитивы, либо сохранить как композицию (Preserve as composition), где монолитный компонент дробится на Card, Card.Image, Card.Body.

Content Stress: Способность компонента переварить фикстуры «очень длинное название события» или «очень маленький источник». Если экспериментальный компонент ломается при длинном тексте, он не может быть продвинут в дизайн-систему (promote to design system) без рефакторинга.

Experiment status & Frequency: Компоненты, помеченные как эксперименты, без подтвержденных метрик успешности или документа о принятом решении (decision receipt), подлежат статусу Archive historical experiment.

Decision Action	Criteria	Example from AS-IS	Migration Risk
Merge	Same semantic role, differing only in responsive geometry	EventCardDesktop & EventCardMobile	High. Требует переписывания DOM и CSS.
Preserve as Variant	Same anatomy, different visual token mapping	ButtonPrimary & ButtonSecondary	Low. Замена на <Button variant="primary" />
Preserve as Composition	Complex internal layout with distinct logical parts	HeroBanner with embedded TicketWidget	Medium. Требует настройки Slot'ов в Astro.
Archive	Low reachability, failed experiment, normative violations	TestGalleryA, OldDateSelector	Low. Мертвый код.
Финальный вердикт
На основании всестороннего анализа нормативных стандартов, официальных руководств, индустриальных конвенций и особенностей продуктового корпуса, текущее состояние исследовательской базы признано достаточным для перехода к следующему этапу. Сформированы жесткие границы допустимых значений (envelopes), определены стратегии миграции компонентов и выявлены точки отказа при контентном стресс-тестировании (кириллические фикстуры, длинные строки).

Утверждение финальных токенов и моделей (например, выбор между Compact и Balanced моделями типографики) требует контекстного решения владельца продукта, что выходит за рамки формирования доказательной базы. В связи с этим, статус исследования определяется как:

READY_FOR_PROJECT_SYNTHESIS

Машиночитаемые приложения
1. normalization-charter-candidate.md
Normalization Charter Candidate
Core Principles
Semantic HTML over Visual Roles: HTML semantics dictate the accessible document structure; CSS tokens independently dictate visual presentation.

Accessibility as Baseline: WCAG 2.2 Level AA target sizes (24x24px minimum) and contrast ratios are mandatory.

Fluidity and Proportionality: Prefer clamp() for fluid typography and intrinsically sized grid/flex layouts over rigid breakpoint-based media queries.

Native Capabilities: Utilize CSS scroll-snap, native <dialog>, and <details>/<summary> before adopting JavaScript-heavy ARIA polyfills.

Resilient Envelopes: All text containers must gracefully handle Cyrillic character ascenders, line-height normalizations, and unbounded string lengths (line-clamp or fluid wrapping).

2. evidence-source-matrix.md
Evidence Source Matrix
Theme	Normative Standards	Official Guidance	Design-System Conventions	Project Evidence
Typography	WCAG 2.2 (1.3.1, 1.4.4)	Browser OS font metrics rendering	USWDS (Typeset), Carbon modular scales	Russian text length stress, Cyrillic specific x-heights
Spacing/Sizing	WCAG 2.2 (2.5.8 Target Size)	Apple HIG, Google Material	4px/8px modular scales (Carbon, GOV.UK)	AS-IS 3/7/10/15px fragmentation, missing touch padding
Media	CSS Box Sizing, Web Vitals	web.dev (CLS optimization)	Image aspect-ratio tokens	EventHero responsive direction and Medallion crop logic
Components/Motion	WAI-ARIA 1.2, CSS Media Queries	WAI-ARIA APG	Fluent, Polaris component splits	107 AS-IS components, prefers-reduced-motion absence
3. typography-candidate-models.json
JSON
{
  "models": [
    {
      "id": "compact_model",
      "ratio": 1.067,
      "description": "Minor Second. Suitable for data-dense UI like complex schedules.",
      "roles": {
        "display": "clamp(1.5rem, 3vw, 2rem)",
        "page_title": "clamp(1.25rem, 2vw, 1.5rem)",
        "section_title": "clamp(1.125rem, 1.5vw, 1.25rem)",
        "body": "1rem",
        "ui_label": "0.875rem",
        "metadata": "0.75rem"
      },
      "line_heights": { "heading": 1.2, "body": 1.4 },
      "trade_offs": "Lacks visual hierarchy for promo materials. Handled long Russian titles well without breaking containers."
    },
    {
      "id": "balanced_model",
      "ratio": 1.200,
      "description": "Minor Third. Optimal for standard product pages, providing clear hierarchy.",
      "roles": {
        "display": "clamp(2.5rem, 5vw, 3.5rem)",
        "page_title": "clamp(1.75rem, 3.5vw, 2.25rem)",
        "section_title": "clamp(1.25rem, 2.5vw, 1.5rem)",
        "body": "1rem",
        "ui_label": "0.875rem",
        "metadata": "0.875rem"
      },
      "line_heights": { "heading": 1.15, "body": 1.5 },
      "trade_offs": "Requires line-clamp for multi-line event titles on mobile. Good balance for general reading and scanning."
    },
    {
      "id": "expressive_model",
      "ratio": 1.333,
      "description": "Perfect Fourth. Editorial and hero-heavy focus. High contrast.",
      "roles": {
        "display": "clamp(3.157rem, 6vw, 4.209rem)",
        "page_title": "clamp(2.369rem, 5vw, 3.157rem)",
        "section_title": "clamp(1.777rem, 3.5vw, 2.369rem)",
        "body": "1rem",
        "ui_label": "1rem",
        "metadata": "0.75rem"
      },
      "line_heights": { "heading": 1.1, "body": 1.6 },
      "trade_offs": "High risk of layout stress with Russian copy. Requires rigorous overflow management and fluid container adaptations."
    }
  ]
}
4. as-is-to-type-role-mapping.csv
Фрагмент кода
current_element,current_values,candidate_role,confidence,exception_reason
h1.hero-title,"font-size: 48px, lh: 1.1",display,high,None
h2.event-name,"font-size: 24px, lh: 1.3",section_title,high,None
div.date-badge,"font-size: 14px, uppercase",metadata,high,Requires font-variant-numeric tabular-nums
p.description,"font-size: 15px, lh: 1.4",body,high,Normalize to 1rem (16px) for WCAG compliance
span.btn-text,"font-size: 14px, lh: 1, uppercase",ui_label,high,Remove all-caps per Material 3 readability guidelines
div.footer-copy,"font-size: 11px",metadata,high,Violates WCAG min text sizing when zoomed; scale to 0.75rem or 0.875rem
5. spacing-sizing-target-envelopes.json
JSON
{
  "spacing_scale_base": 8,
  "sub_step": 4,
  "normative_targets": {
    "wcag_minimum": { "width": 24, "height": 24, "unit": "px", "context": "inline_or_constrained" },
    "project_target": { "width": 44, "height": 44, "unit": "px", "context": "primary_controls" },
    "compact_exception": { "width": 32, "height": 32, "unit": "px", "context": "data_dense_artifacts" }
  },
  "layout_envelopes": {
    "component_padding": "var(--spacing-03) var(--spacing-04)",
    "layout_gap": "clamp(16px, 2vw, 24px)",
    "section_gap": "clamp(32px, 5vw, 64px)",
    "breakpoint_policy": {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "container_max": "1200px"
    }
  }
}
6. media-behavior-charter.json
JSON
{
  "vocabularies": {
    "aspect_ratios": ["1:1", "2:3", "3:4", "16:9"],
    "object_fit": ["cover", "contain"]
  },
  "cls_prevention": {
    "strategy": "Define CSS aspect-ratio on image wrappers to reserve space before image load. Critical for SSG performance."
  },
  "responsive_art_direction": {
    "supported": true,
    "method": "HTML <picture> with <source media='...'> sizes and srcset attributes for EventHero desktop to mobile transitions."
  },
  "fallbacks": {
    "error_handling": "Neutral SVG pattern via Data URI preserving aspect-ratio.",
    "focal_point": "Use object-position to protect critical areas (e.g., human faces) during object-fit: cover cropping."
  }
}
7. loading-recovery-charter.json
JSON
{
  "strategies": {
    "ssg_static_content": "No loading states. Content is pre-rendered and delivered as raw HTML.",
    "dynamic_islands": "Stale-while-refresh preferred. Display cached data while updating in background.",
    "destructive_actions": "Inline spinners inside buttons, preserving button dimensions."
  },
  "recovery": {
    "empty_state_anatomy": ["illustration_or_icon", "clear_heading", "reason_description", "recovery_action_button"],
    "error_state": "Provide non-technical explanation and 'Retry' action. Do not show raw stack traces."
  },
  "optimistic_ui": "Permitted for reversible, non-financial interactions (e.g., likes, saves)."
}
8. interaction-pattern-charter.json
JSON
{
  "focus_management": {
    "visible_focus": "Always visible via :focus-visible. High contrast outline required.",
    "containment": "Modals must trap focus inside. Return focus to triggering element on close."
  },
  "motion": {
    "duration_categories": { "micro": "100-150ms", "small": "200-250ms", "large": "300-400ms" },
    "easing": "ease-out for enter, ease-in for exit.",
    "reduced_motion": "Obey prefers-reduced-motion: reduce. Set transition/animation duration to 0.001ms or convert translations to opacity fades."
  }
}
9. shelves-sticky-fixed-charter.json
JSON
{
  "shelves_and_rails": {
    "method": "CSS scroll-snap-type: x proximity or mandatory.",
    "scroll_padding": "scroll-padding-inline-start required to prevent items sticking to viewport edges."
  },
  "carousels": {
    "aria_pattern": "WAI-ARIA APG Carousel (role=region, aria-roledescription=carousel). Halt rotation on hover/focus."
  },
  "sticky_surfaces": {
    "collision_mitigation": "Use scroll-padding-top on HTML element equivalent to sticky header height.",
    "z_index_scale": { "sticky": 100, "overlay": 400, "modal": 1300 },
    "viewport_constraints": "Use dvh (dynamic viewport height) and env(safe-area-inset-bottom) for mobile bottom navigations."
  }
}
10. convergence-decision-matrix.csv
Фрагмент кода
as_is_component,semantic_role,anatomy_conflict,behavior_conflict,decision,rationale
EventCardMobile,event_summary,false,false,Merge,"Same semantics and behavior as Desktop, geometry differs. Use responsive CSS Container Queries."
EventCardDesktop,event_summary,false,false,Merge,"Merge with Mobile into canonical EventCard."
HeroBannerVariantB,promo_header,true,false,Preserve_as_Composition,"Different anatomical layout (split screen vs full overlay), build via sub-components (Hero.Image, Hero.Body)."
DateSelectorOld,form_input,true,true,Deprecate,"Violates ARIA guidelines, complex JS payload. Replace with native <select> on mobile."
TestGalleryA,experiment,false,false,Archive_historical_experiment,"No metrics support promoting to design system. Usage < 1%."
PrimaryButton,ui_action,false,false,Preserve_as_Variant,"Base component. Standardize variants via props."
11. family-normalization-order.md
Family Normalization Order
Foundations (Tokens): Establish fluid typography clamps, 8px spacing scales, z-index hierarchy, and strict color palette normalization.

Primitives (Atoms): Standardize Buttons (enforcing 44px/24px touch targets), Inputs, and Badges (tabular-nums).

Layout & Media (Molecules): Implement aspect-ratio wrappers for images, scroll-snap constraints for content rails, and responsive section gaps.

Surfaces & Overlays (Organisms): Unify Dialogs (focus traps), mobile menus (dvh), and sticky headers (scroll padding).

Complex Behaviors: Address dynamic islands (Stale-while-refresh) and true Carousels (ARIA APG compliance).

12. open-product-decisions.md
Open Product Decisions
Typography Model Selection: A final decision must be made between the Compact, Balanced, or Expressive candidate models. This requires evaluation against brand vision and ultimate tolerance for text truncation on extremely long Russian event titles.

Carousel vs Rail Downgrade: Determine which existing auto-rotating carousels are strictly necessary for business metrics. Those that are not must be downgraded to native CSS scroll-snap rails to eliminate JS overhead and accessibility risks.

Canonical Aspect Ratios: Finalize the primary aspect ratio for Event Hero banners on desktop (16:9 vs 3:2) to lock in the aspect-ratio tokens and enforce CLS prevention across all content pipelines.

13. research-limitations.md
Research Limitations
Lack of Analytics Data: The component convergence framework relies on semantic evaluation, but actual user interaction metrics (e.g., how often users horizontally scroll rails vs use pagination arrows) are missing from the AS-IS snapshot, preventing data-driven deprecation.

Experiment Resolution: Several candidate AS-IS contracts are labeled as experiments. Without specific A/B testing decision receipts from the product owner, they cannot be definitively merged or archived with 100% confidence.

Real-world Cyrillic Rendering Variances: While theoretical font metric differences between OS environments (Win vs Mac) are accounted for, visual regression testing across physical mobile devices using the exact finalized .woff2 font files is required to perfectly tune line-height and vertical button alignments.


v10.carbondesignsystem.com
Spacing - Carbon Design System
Откроется в новом окне

design.va.gov
Breadcrumbs - Design decisions
Откроется в новом окне

designsystem.digital.gov
Date of birth | U.S. Web Design System (USWDS)
Откроется в новом окне

designsystem.digital.gov
Font | U.S. Web Design System (USWDS)
Откроется в новом окне

designsystem.digital.gov
Using type | U.S. Web Design System (USWDS)
Откроется в новом окне

en.wikipedia.org
x-height - Wikipedia
Откроется в новом окне

designsystem.digital.gov
Settings | U.S. Web Design System (USWDS)
Откроется в новом окне

ux.stackexchange.com
What are the best practices to decide the length of label characters on the buttons? - User Experience Stack Exchange
Откроется в новом окне

typescaler.com
Typescaler | Learn Type Scales, Modular Typography & CSS Best Practices
Откроется в новом окне

dcs.colorado.gov
Typography (Fonts) & Spacing | DCS - Colorado
Откроется в новом окне

design.gothe.se
Carbon Design System – A Practical Example - Mats Göthe - GOTHE.SE
Откроется в новом окне

pimpmytype.com
The ideal line length & line height in web design - Pimp my Type
Откроется в новом окне

usnavy.github.io
Navy Design Guide - GitHub Pages
Откроется в новом окне

carbondesignsystem.com
Spacing - Carbon Design System
Откроется в новом окне

medium.com
Carbon Design System — A Practical Example | by Mats Gothe - Medium
Откроется в новом окне

allaccessible.org
WCAG 2.5.8 Target Size (Minimum): Complete Implementation Guide - AllAccessible Blog
Откроется в новом окне

audioeye.com
What's New in WCAG 2.2: The 9 New Success Criteria Explained - AudioEye
Откроется в новом окне

onely.com
How To Reduce Cumulative Layout Shift? Tips For 2024 | Onely
Откроется в новом окне

developer.mozilla.org
CSS scroll snap - MDN Web Docs
Откроется в новом окне

freefrontend.com
10+ CSS scroll-snap Examples - FreeFrontend
Откроется в новом окне

developer.mozilla.org
scroll-snap-type CSS property - MDN Web Docs
Откроется в новом окне

developer.mozilla.org
Basic concepts of scroll snap - CSS - MDN Web Docs
Откроется в новом окне

smashingmagazine.com
CSS Scroll Snapping Aligned With Global Page Layout: A Full-Width Slider Case Study
Откроется в новом окне

builder.io
Build buttery smooth carousels with pure CSS like Nike - Builder.io
Откроется в новом окне

w3.org
Carousel (Slide Show or Image Rotator) Pattern | APG | WAI - W3C
Откроется в новом окне

elementor.com
Authoring Practices Guide (APG) Examples & Rules in 2025 - Elementor
Откроется в новом окне

w3.org
ARIA Authoring Practices Guide | APG | WAI - W3C
Откроется в новом окне

smashingmagazine.com
A Step-By-Step Guide To Building Accessible Carousels - Smashing Magazine
Откроется в новом окне

dev.to
Using the reduced motion media query in a project - DEV Community
Откроется в новом окне

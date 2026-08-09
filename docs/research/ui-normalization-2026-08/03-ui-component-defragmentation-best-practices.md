Best practices дефрагментации и унификации UI-компонентов
Профессиональная практика не подтверждает идею, что исторически фрагментированный интерфейс можно надёжно «почистить», просто найдя похожие скриншоты и заменив их одним универсальным компонентом. Наиболее устойчивый подход выглядит иначе: сначала формируется доказательная модель существующего интерфейса, затем — гипотезы о семействах, после этого проверяется семантическая и поведенческая эквивалентность, и только затем выбирается merge / variant / split / composition / preserve / deprecate. Brad Frost даёт исходную технику interface inventory; Nathan Curtis превращает анализ вариаций в структурированный component contract; Spotify, Shopify, Fluent, Atlassian, Primer, Carbon и Spectrum показывают, как этот анализ приходится сочетать с совместимостью, миграцией и governance в реальном коде.

Ключевой вывод исследования: единицей дефрагментации должен быть не внешний вид и не файл компонента, а контракт пользовательской задачи. Два элемента могут выглядеть почти одинаково и при этом требовать разных семантики, accessibility-модели и поведения; наоборот, два визуально различающихся элемента могут оказаться вариантами одной устойчивой абстракции. Adobe Spectrum отдельно показывает проблему смешения семантики button и link, а Shopify описывает случай с похожими графиками, где различия были не только визуальными: реализации отличались в accessibility и возможности печати.

Для небольшой команды наиболее полезна не уменьшенная копия enterprise-governance, а family-by-family strangler process: автоматизированный census → решение по одной семье → явный контракт → stories/tests → совместимая миграция → запрет новых legacy-использований → удаление после доказательства отсутствия consumers. Формальные комитеты, долгие proposal-периоды и сложные организации ownership оправданы лишь тогда, когда масштаб consumers действительно создаёт соответствующий координационный риск. USWDS, например, использует многоступенчатый публичный lifecycle вплоть до минимального 45-дневного периода обсуждения предложения; это разумно для федеральной открытой системы, но само по себе не является необходимым условием качественной дефрагментации внутри команды из нескольких человек.

Карта профессиональных подходов и уровень доказательности
В исследовании полезно разделять источники по их доказательной силе. Team case / retrospective описывает, что команда действительно делала и с какими последствиями столкнулась; official system methodology фиксирует действующие правила системы; expert synthesis формулирует переносимую практику, но не является доказательством результата конкретной миграции; tutorials и community discussions полезны для генерации гипотез, однако слабее как основание для обязательного правила.

Линия практики	Что она даёт для дефрагментации	Сильнейшие evidence
Interface inventory	Найти уникальные UI treatments, вывести их из контекста страниц, увидеть дубли и различия до проектирования target API	Brad Frost прямо определяет inventory как сбор и категоризацию UI-частей и подчёркивает, что фиксировать следует отличающиеся treatments, а не каждый экземпляр.
Modular decomposition	Определить, где проходит граница компонента и как модули соединяются	Alla Kholmatova подчёркивает, что эффективность modular design критически зависит и от разбиения системы на компоненты, и от механизмов их соединения.
Contract/schema analysis	Перейти от «картинки компонента» к anatomy, props, slots, invariants, accessibility и платформенно-независимой модели	Curtis описывает contract как централизованное выражение design intent, пригодное для типизации, проверки и эволюции; Components as Data моделирует anatomy, свойства и slots структурированными данными.
Variant analysis	Обнаруживать структурные изменения между вариантами и недопустимые комбинации вместо ручного визуального сравнения	В Analysis of Variants Curtis показывает детерминированный анализ anatomy, properties, structural/style shifts и invalid variant combinations.
Composition / layered abstraction	Не превращать один родительский компонент в API из десятков флагов	Spotify использует три уровня: config → slots → custom composition; Curtis предлагает переносить layout/visibility/hack props из родителя в composable parts.
System of systems	Сохранить общие foundations, но разрешить осмысленные локальные системы для разных продуктовых областей	Encore был построен не как единый монолит, а как family of systems поверх общего Foundation.
Lifecycle + deprecation	Не смешивать experimental, ready, legacy и obsolete в один статус «компонент существует»	Primer формально различает Experimental, Ready и Deprecated; USWDS ведёт компонент от proposal до stable/deprecated/retired.
Migration tooling	Отделить решение об архитектуре от механического переписывания consumers	Shopify, Atlassian, Carbon и Spectrum публикуют codemods/migrators и при этом сохраняют ручной путь для случаев, которые нельзя безопасно преобразовать синтаксически.
Automated governance	Предотвратить появление нового legacy после создания canonical path	Atlassian сочетает codemods с ESLint-правилами; Salesforce использует linting/migration tooling и рекомендует полагаться на документированные API, а не внутреннюю разметку.
Adoption/usage telemetry	Проверить фактический охват, найти shadow implementations и понять, какие extension points реально используются	Spotify перешёл от ручного tracking к анализу repository usage; его layered API предусматривает анализ наиболее частых slot overrides.
Product-grounded system building	Не создавать компоненты и variants «на всякий случай»	Frost рекомендует помещать в систему уже решённые, проверенные продуктом проблемы; Mall предупреждает о «ghost towns» из заранее построенных, но не используемых компонентов.

Atomic Design при этом не следует понимать как линейный pipeline «сначала atoms, потом molecules». Frost прямо описывает уровни как работающие одновременно: реальные pages выявляют content variations и ограничения, которые возвращаются вниз и меняют компоненты. Для дефрагментации это существенно: foundation, component API и реальное использование должны уточняться итеративно, а не завершаться раз и навсегда последовательно.

Набор принципов, который выдерживает сравнение между источниками:

Рекомендуемый принцип	Supporting evidence	Контекст, исключения и риск	Confidence	Какое решение поддерживает
Сходство изображения — только сигнал для формирования family candidate, а не доказательство merge.	Frost inventory + Open UI anatomy/behavior research + Spectrum button/link case.
Исключение: чисто декоративные primitives. Риск обратного подхода — потеря semantics/a11y.	Высокий	merge / split
Объединять следует семантический контракт, а не исторические реализации.	Curtis contracts; Open UI определяет anatomy, properties, events и semantics.
Для platform-native behavior допускаются разные реализации одного высокого контракта.	Высокий	merge / preserve / layered
Variant оправдан только как ограниченная ось одной идентичности.	Curtis variant analysis выявляет structural shifts и invalid combinations; configuration collapse уменьшает surface API.
Не применять, когда меняются task, event model или accessibility role. Риск — Cartesian explosion.	Высокий	variant / split
Если различие выражается вложенной областью, предпочитать slot/subcomponent композицию новому parent flag.	Spotify layered API; Fluent Drawer/Card; Radix composition.
Для простых атомарных controls composition может быть излишней. Риск — слишком свободные сборки.	Высокий	composition / split
Продуктовые snowflakes и ещё не устоявшиеся эксперименты не обязаны попадать в core.	Frost; Primer Experimental; USWDS Proposal lifecycle.
Локальное решение должно быть видимым и иметь owner, иначе оно превращается в shadow system.	Высокий	preserve / promotion
Deprecation должна предшествовать removal и иметь replacement/migration path.	Primer, Carbon, Spectrum.
Немедленное удаление возможно лишь для доказанно неиспользуемого private code.	Высокий	deprecate
Codemod автоматизирует синтаксически доказуемую часть миграции, но не устанавливает semantic equivalence.	Atlassian и Carbon явно оставляют случаи для manual review.
Риск — скрыто изменить поведение в сложных consumers.	Высокий	migration
Foundations следует нормализовать по семантической роли и изменяемости, а не только по частоте literal value.	Spotify столкнулся с ограниченной полезностью non-semantic tokens; Frost предостерегает от создания гипотетических tokens и от чрезмерных component-specific tokens.
Иногда уникальный token оправдан contract/theme boundary.	Средне-высокий	token / preserve literal
Canonical path должен быть проще локального обхода, иначе governance превратится в борьбу с consumers.	Spotify отмечает trade-off: слишком opaque abstraction заставляет инженеров отказаться от системы; Shopify описывает компоненты layout, которые оказались слишком ограничивающими.
Не означает разрешить arbitrary overrides.	Высокий	API / composition
Adoption нужно измерять со стороны продукта, а не размером библиотеки.	Mall показывает, как adoption percentage можно искусственно улучшить удалением неиспользуемых system components; Spotify отслеживает usage в repositories.
Нужен корректный знаменатель: eligible usages/consumers.	Высокий	governance / prioritization
Design и code representations должны оставаться синхронизированными.	Frost называет расхождение design/code источником системного drift; Curtis предлагает contract/schema как проверяемый промежуточный слой.
Источник истины может быть code или neutral schema; универсального организационного решения нет.	Средне-высокий	contract / governance

Здесь важно различать доказательства: Frost, Curtis, Kholmatova и Mall в основном дают экспертную методологию; Spotify/Shopify engineering posts — реальный опыт команд; Atlassian, Primer, Carbon, Spectrum, USWDS — прежде всего официальные operational policies и migration guides. Into Design Systems и другие профессиональные сообщества полезны как источник новых практик, но выводы этого отчёта опираются главным образом на первичные материалы команд и официальные repositories/docs. Например, недавний материал Into Design Systems о развитии Encore полезен как сигнал направления Spotify, но не используется здесь как единственное основание для обязательной рекомендации.

Инвентаризация, критерии семейства и матрица merge / split / preserve
Правильный interface inventory начинается с Frost-подхода — собрать уникальные treatments, категоризировать их и рассматривать вне контекста отдельных страниц. Но для component rationalization этого недостаточно: screenshot inventory следует расширить до contract inventory. Open UI демонстрирует более строгий исследовательский процесс: сопоставлять реализации разных систем, определять общие concepts, anatomy, behaviors/events, semantics, writing modes и platform/device distinctions.

Практически каждая найденная реализация должна получить запись как минимум по следующим измерениям:

Evidence axis	Что фиксируется	Почему это важно
Semantic purpose	Что пользователь считает этим элементом; какую задачу он решает; HTML/ARIA role	Визуально похожий link и button нельзя считать эквивалентными только из-за styling. Spectrum именно по semantic/accessibility причинам отказался от смешения link behavior внутри Button API.
Anatomy	Root, label, icon/media, controls, supporting text, footer, nested regions	Curtis и Open UI используют anatomy как самостоятельное измерение contract, а не побочный результат JSX.
State machine	default/hover/focus/active/selected/open/loading/error/disabled и переходы	Компоненты с одинаковым static state могут иметь совершенно разные interaction contracts. Open UI специфицирует properties/events отдельно от внешнего вида.
Events / behavior	click, submit, selection, disclosure, keyboard interaction, controlled/uncontrolled behavior	Это главный veto против ошибочного merge.
Accessibility	role, accessible name, keyboard model, focus ownership, announcements, required relationships	Radix, например, документирует accessibility requirements как часть component API; Playwright позволяет отдельно сравнивать accessibility tree.
Content model	Типы контента, optional/required regions, empty, long/localized content	Pages в Atomic Design должны возвращать реальные content variations в компоненты, иначе API строится на «идеальном» контенте.
Responsive/container behavior	breakpoints, reflow, collapse, truncation, orientation, container dependence	Frost разделяет fluid component behavior и layout решения consumer; Storybook предоставляет explicit viewport scenarios.
Media contract	aspect ratio, crop/fit, loading/fallback, optionality	Эти различия часто оказываются структурными, а не просто style props.
Visual foundations	typography roles, color roles, spacing, radius, elevation, motion	Их следует фиксировать отдельно от identity компонента, чтобы accidental styling не определял архитектуру.
Consumers	routes/repos/features, количество и тип usage, wrappers, overrides	Без consumer graph невозможно оценить migration risk. Spotify и Shopify автоматизировали поиск usages в больших repository landscapes.
Lifecycle/evidence	experimental, candidate, stable, product fork, legacy, deprecated, dead candidate	Primer и USWDS показывают, почему readiness нельзя выводить только из существования реализации.
Reachability	imports, dynamic loads, routes, runtime observations	Отсутствие статического import ещё не доказывает dead code; runtime/dynamic use следует проверять отдельно.

Из этого получается более точная классификация исторического UI.

Визуальный дубль — внешний вид почти одинаков, но code lineage может быть разным. Он является лишь candidate для дальнейшего анализа.

Кодовый дубль — две реализации выполняют практически один contract, но код был независимо скопирован или forked. Такой случай значительно сильнее склоняет к merge, однако semantic/a11y check всё равно обязателен.

Один компонент с variants — identity, anatomy и основная state/event model совпадают, а различия образуют небольшое, осмысленное и конечное множество режимов.

Разные компоненты с похожим видом — similarity существует на presentation layer, но различаются задача, semantics, events, accessibility или content model. Spectrum Button/Link — конкретный пример того, почему «визуальная унификация» не должна означать «единый component identity».

Composition/pattern — несколько primitives/subcomponents образуют устойчивую комбинацию, однако вариативность принадлежит структуре композиции, а не props одного god component. Spotify и Fluent используют explicit subcomponents/slots именно для этой границы.

Consumer-specific override — canonical component используется, но consumer меняет styling/behavior. Это одновременно evidence о потенциально недостающем extension point и риск shadow API. Spotify предлагает анализировать частоту slot overrides: часто повторяемый override может стать основанием для нового default или supported configuration.

Experimental implementation — работоспособная реализация, contract которой ещё не должен считаться стабильным. Primer прямо предупреждает, что Experimental — work in progress, тогда как Ready предполагает долгосрочную поддержку и migration path для breaking changes.

Legacy — поддерживаемая ради существующих consumers реализация, для которой уже определён более новый путь. Shopify буквально использовал имена LegacyStack/LegacyCard во время перехода Polaris, а затем миграционное tooling должно было выводить consumers из этих API.

Dead candidate — реализация без известных consumers. Профессионально безопаснее считать её именно candidate for deletion, пока не проверены dynamic routing, runtime usage, tests/examples и downstream packages.

Матрица решений
Решение	Положительные сигналы	Сильные причины не выбирать его	Что необходимо доказать до решения
Merge	Одинаковая пользовательская задача; эквивалентная anatomy; одна event/state/a11y model; различия преимущественно исторические или stylistic	Разные semantics, focus model, events, content ownership; один implementation используется как существенно иной domain concept	Consumer map + contract diff + functional/a11y equivalence + migration feasibility
Variant	Одна identity; bounded и понятная axis; режимы взаимоисключающие или имеют небольшой valid cross-product	Нужны многочисленные boolean flags; часть combinations бессмысленна; variant меняет identity или семантику	Таблица вариантов и valid combinations; structural diff. Curtis специально анализирует invalid combinations.
Split	Различаются semantics, state machine, accessibility, lifecycle или evolution pressure	Различие сводится к presentation либо небольшому bounded mode	Отдельно сформулирован purpose каждого API; отсутствие необходимости координировать их evolution
Composition	Общая anatomy/primitives, но consumers должны заменять/добавлять целые regions; специализированные product flows	Простая atomic control, для которой composition добавит больше сложности, чем свободы	Ясные slots/subcomponents + examples + ограничения composition. Spotify использует config/slot/custom layers.
Preserve	Unresolved experiment; product-specific snowflake; platform distinction; requirement ещё меняется; стоимость миграции выше текущей ценности	Duplicate уже доказан и продолжает создавать drift/maintenance cost	Owner, rationale, scope и condition для пересмотра решения
Deprecate	Есть replacement; consumers известны; migration path существует; API больше не должен появляться в новом коде	Эксперимент ещё не решён; replacement не покрывает значимые consumers	Warning/docs + replacement mapping + consumer plan + removal condition. Primer, Carbon и Spectrum формализуют такой переход.

Есть полезный реальный пример того, что не каждый legacy API обязан отображаться один-к-одному в новую абстракцию. В миграции Primer SelectPanel часть usages переводится в новый stable API, но сценарий panel без input направляется в отдельный SimpleSelect. Это практически идеальный пример решения «не делать новый компонент достаточно универсальным, чтобы насильно вместить все исторические случаи».

God component и prop explosion
Наиболее повторяемый сигнал неверной унификации — parent API начинает описывать всё больше внутренних решений: showX, hideY, compact, horizontal, hasFooter, actionCount, actionVisible, imagePosition, несколько layout props и ещё флаги, разрешающие отдельные исключения. Проблема здесь не только в количестве props, а в том, что API начинает представлять множество недопустимых состояний.

Curtis в Configuration Collapse показывает переход от properties, управляющих layout, visibility и визуальными hacks, к subcomponents/slots; Spotify объясняет тот же эффект практически: slot позволяет consumer обращаться напрямую к API вложенной части вместо накопления параметров в parent component.

Поэтому prop count — полезный warning metric, но не жёсткий лимит. Более сильные признаки необходимости split/composition:

валидность одного prop зависит от трёх-четырёх других;
consumer может выразить состояния, которые дизайн считает невозможными;
большая часть props лишь проксируется одному child;
разные группы consumers постоянно используют непересекающиеся части API;
изменение одного режима требует regression testing практически всех остальных;
«variant» уже меняет semantics или interaction, а не только способ представления.
Fluent convergence epics подтверждают, что mature component work начинается не с объединения имён, а с comparison существующих APIs, Open UI research и отдельной component spec, после чего добавляются conformance/unit/visual/accessibility tests и только затем migration work.

Канонический component contract и нормализация foundations
Canonical component — это не «победивший JSX». Curtis предлагает гораздо более переносимую модель: contract как schema, выражающая design intent независимо от конкретной реализации. Такая схема может задавать hierarchy/anatomy, typed props, enum values, booleans, strings и slots, а затем проверяться разными platform implementations.

Минимальный canonical contract после rationalization должен фиксировать:

Часть контракта	Что должно быть определено
Identity / purpose	Что это за concept и какие задачи он сознательно не решает
Anatomy	Обязательные и optional parts; hierarchy; repeatable regions
Slots / subcomponents	Что consumer может заменять или дополнять и тип допустимого содержимого
Props	Типы, defaults, enum domains, controlled/uncontrolled model
States	Supported visual/functional states и переходы между ними
Invariants	Недопустимые combinations; зависимости между props; required child relationships
Events	Trigger semantics, callbacks, cancellation/default behavior
Accessibility contract	Semantic element/role, naming, keyboard model, focus, announcements, relationships
Content constraints	Empty/long/localized text, line limits, labels, required content
Responsive/container behavior	Что меняет сам компонент, а что обязан решать consumer layout
Media behavior	Aspect/crop/fit/fallback/loading и допустимые media types
Styling/foundations	Какие semantic tokens принадлежат contract, а что внутреннее implementation detail
Extension points	Поддерживаемые customization paths; что считается unsupported override
Lifecycle	experimental/ready/deprecated; owner; compatibility guarantees
Examples/test matrix	Набор representative valid states, на которых контракт проверяется

Open UI подтверждает важность отделения anatomy, properties, events и semantics. Radix показывает реализацию той же идеи в headless/composable форме: например, Dialog разбит на Root, Trigger, Portal, Overlay, Content, Title, Description, Close, при этом accessibility requirements остаются частью primitive contract, а не ответственностью случайного CSS.

Monolith, composition, headless и layered architecture
Архитектура	Когда сильна	Что предотвращает	Основной риск
Монолитный configured component	Очень стабильный common case с небольшим числом осей	Consumer inconsistency; повторение boilerplate	Превращение в god component при расширении scope
Compound/composed component	Структура стабильна, но regions комбинируются по-разному	Parent prop explosion	Consumers могут собирать несовместимые combinations без хороших examples/invariants
Headless primitives	Несколько visual languages при общем behavior/a11y; продукту нужна глубокая composition	Дублирование interaction logic	Слишком большая assembly burden и возможность расхождения визуальной системы
Layered API: config → slots → custom	Большая неоднородная consumer base	Противопоставление «rigid system vs complete escape hatch»	Поддержка нескольких abstraction levels сама увеличивает стоимость API

Spotify прямо описывает layered spectrum: простой consumer передаёт data в configured API; промежуточный заменяет slot; сложный получает базовые pieces и выполняет composition. Команда считает это способом не наращивать parent props для каждого исключения.

Fluent использует близкую архитектуру: Card и Drawer имеют отдельные subcomponents, чтобы composition оставалась явной.

Radix представляет более headless-полюс: primitives дают structure, behavior и accessibility, а asChild позволяет переносить behavior на consumer element при соблюдении требований к forwarding props/ref.

Это не лестница зрелости. Headless не «лучше» монолита: для Button с несколькими стабильными вариантами compound API будет бюрократией; для сложной Card, Toolbar или Dialog монолит с десятками child-specific flags часто оказывается хуже композиции.

Где должна заканчиваться ответственность компонента
Frost отдельно проводит полезную границу: компоненты обычно должны быть fluid/container-aware, но расположение нескольких компонентов на странице может принадлежать layout system либо конкретному product implementation.

Это даёт практический критерий. В component contract разумно включать внутреннюю геометрию, необходимую для сохранения anatomy и interaction. Внешние margins, positioning относительно соседних product blocks, page-specific grid placement и route-level ordering в большинстве случаев принадлежат consumer composition. Перетаскивание этих решений внутрь core-компонента является одним из распространённых источников layout props и product-specific forks.

Foundations: tokens-first или components-first
Evidence не поддерживает универсальное «сначала идеально нормализовать tokens, потом трогать компоненты».

Frost описывает tokens и component libraries как отдельные, но связанные layers; Atomic Design предполагает обратную связь между уровнями, а не линейную сборку.

Spotify даёт особенно полезный counterexample: в развитии Encore команда пришла к выводу, что слишком общие non-semantic tokens обеспечивали ограниченную ценность и усилила semantic token layers.

Поэтому наиболее надёжный порядок — iterative normalization:

Inventory → первая family hypothesis → выявление необходимых foundation roles → минимальная нормализация foundations → canonical component → миграция реальных consumers → новые найденные exceptions → корректировка foundations.

Tokens-first оправдан, если фундаментальная проблема действительно системная — например, один глобальный theme/rebrand/dark-mode transition затрагивает почти все components. Components-first может быть разумнее, если главные расхождения находятся в semantics, interaction и API, а существующие foundations уже достаточно стабильны.

Частота literal value сама по себе не является основанием для token. Frost прямо предостерегает от гипотетических «может понадобиться» tokens и советует сдержанно использовать component-specific tier.

Полезный token test выглядит так:

Значение стоит поднимать в foundation, когда оно выражает устойчивую роль, должно изменяться согласованно в нескольких местах либо представляет theme/platform contract.
Повторяемое число, появившееся несколько раз по случайности, ещё не является design decision.

Это применимо к typography, color, spacing, dimensions, radii, elevation и motion. Media ratio аналогично может быть semantic contract вроде thumbnail, poster, avatar, но несколько одинаковых значений 16:9 в несвязанных features не требуют автоматически глобального token.

Design-to-code drift следует рассматривать как отдельную форму фрагментации. Frost подчёркивает, что design library должна отражать доступную в code реальность, иначе consumers получают две противоречащие системы. Curtis предлагает более нейтральную альтернативу «code вручную синхронизируется с Figma»: contract/schema может стать проверяемым представлением design intent, из которого сравниваются обе стороны.

Что показывают реальные консолидации и миграции
Наиболее полезные кейсы — не те, где система выглядит сегодня аккуратно, а те, где опубликованы предыдущая ошибка, переходное состояние и компромисс.

Кейс	Реальная проблема	Что сделали	Что особенно важно для методологии
Spotify Encore	Несколько поколений систем; к запуску Encore существовало 22 distinct design systems; единый монолит не соответствовал распределённой организации.
Создали family/system-of-systems с Foundation и платформенными/локальными layers.
Consolidation не обязательно означает один package или один уровень abstraction.
Spotify, следующая итерация	Flexibility зашла слишком далеко: продуктовые/local layers вынуждены были собирать слишком много сами.
Добавили reusable mobile layer и layered config/slot/custom APIs.
После унификации систему приходится рекалибровать между autonomy и defaults.
Shopify Polaris Layout	Polaris ограничивал layout; teams создавали custom solutions; старые layout components имели низкое внутреннее использование — документация Polaris v11 приводит около 20%.
Старые Card/Stack стали LegacyCard/LegacyStack, новый API вводился отдельно и поддерживался migration tooling.
Low adoption может означать не недостаток governance, а неправильную abstraction.
Shopify Polaris Viz	Даже внутри общей chart library внешний вид расходился из-за множества style props; более ранние разные chart libraries отличались также accessibility/printing behavior.
Убрали разбросанные visual props и ввели theme contract.
Variant reduction и API normalization могут быть важнее механического удаления компонентов.
Shopify at repository scale	Иллюстрации оказались фрагментированы по более чем 6000 repositories; ручная spreadsheet-инвентаризация давала gaps.
Создали tooling, находящее assets и code references автоматически.
Census должен становиться машинным, когда ручной inventory перестаёт быть полным.
Fluent UI React v9 convergence	Несколько React component libraries должны были сойтись в единое направление.
Для Menu/Card/Switch convergence tickets начинались с comparison существующих систем, Open UI research и component spec, затем шли implementation и conformance/unit/VR/a11y tests, partner validation и migration/codemods.
Один из лучших опубликованных procedural templates именно для component convergence.
Atlassian Design System	Legacy APIs приходится заменять в огромном consumer landscape	Для Button и других компонентов опубликованы replacement APIs, migration guides и codemods; lint rules предотвращают возврат к старому способу.
Migration tooling и enforcement образуют пару: сначала путь выхода, потом запрет нового legacy.
GitHub Primer	Нужно отличать ещё исследуемые API от тех, на которые consumers могут полагаться	Experimental → Ready → Deprecated, причём Ready предполагает controlled breaking changes и migration path, а Deprecated — documented alternative.
Lifecycle status — часть component contract, а не документационная косметика.
IBM Carbon	Major-version migration не может произойти одновременно для всех consumers	Carbon сохранял v10 assets в v11, планируя удаление deprecated вещей позднее; отдельно предоставляет @carbon/upgrade codemods и migration guides.
Compatibility window снижает необходимость big bang.
Adobe Spectrum	Breaking APIs и semantic mistakes требуют предсказуемого выхода	Spectrum Web Components имеет формальную deprecation procedure с предупреждением и migration period; React Spectrum S1→S2 предоставляет codemods.
Deprecation — управляемое состояние, а не комментарий «старое».
USWDS	Public design system должен одновременно показывать maturity и позволять постепенное обновление	Proposal/stable/deprecated lifecycle; USWDS 3 сознательно снижал стоимость перехода, сохраняя существующую markup/style compatibility на стартовом этапе.
Mature governance может оптимизировать не только purity target API, но migration cost.
Salesforce Lightning	Consumers рискуют строить систему поверх внутренних DOM/classes	Salesforce рекомендует documented variants, utilities и styling hooks, composition базовых components и предупреждает против зависимости от внутренних implementation details; migration поддерживается lint tooling.
Extension points должны быть официальными, иначе каждый consumer создаёт неявный shadow contract.

Spotify: главный урок — «единая система» не обязательно монолит
Encore — важный контрпример упрощённой идеи консолидации. Spotify не заменил десятки исторических систем одним гигантским компонентным каталогом: Encore был сформулирован как framework/family of systems, где Foundation наследуется более специализированными системами. Часть существующих инициатив была переиспользована, переименована или из неё были извлечены общие части.

Затем обнаружилась обратная проблема. При росте потребителей свобода local systems стала слишком высокой; Spotify публично описывает движение к большей стандартности и создание дополнительного reusable mobile layer.

Это сильное evidence против двух крайностей:

«всё должно жить в global core» создаёт overly universal abstractions;

«core даёт только primitives, пусть продукт собирает всё сам» может породить повторяющиеся local systems.

Текущий layered pattern Spotify — configuration для common case, slots для controlled extension и composition для сложных случаев — фактически является архитектурным компромиссом между ними.

Отдельный Spotify case с Masthead показывает ещё один вариант: когда два приложения действительно должны иметь одну и ту же интеграцию и UX, команда использовала facade/shared package, чтобы не допустить implementation drift между clients. При этом автор прямо отмечает существование другой похожей shared Masthead initiative и возможность дальнейшего объединения — то есть consolidation рассматривается как эволюционный процесс, а не одномоментная «финальная архитектура».

Shopify: ограничения design system тоже создают shadow components
Polaris v11 особенно полезен тем, что документация признаёт: прежние layout abstractions ограничивали consumers, поэтому команды строили собственные решения. Старые Stack/Card не стали бесконечно расширять новыми флагами; они получили legacy path, а новые APIs развивались отдельно.

Polaris Viz даёт ещё более конкретный пример prop normalization. Множество visual options, передаваемых каждому chart, приводило к inconsistency даже внутри одной библиотеки. Вместо того чтобы документировать «правильные комбинации» ещё подробнее, команда убрала эти style props из component surface и собрала их в theme contract.

В 2026 году Shopify также опубликовал миграцию Checkout Blocks с legacy React components/APIs на Polaris web components. Команда поддерживала отдельный core-next рядом с прежним core, то есть переходное состояние было явным. Для этой конкретной миграции Shopify сообщает сокращение transferred bundle size примерно на 40–85% в зависимости от extension и улучшение Extension Load Time P50/P90 в агрегате; это результаты именно данного технического перехода, а не универсально ожидаемая выгода component consolidation.

Последнее различие важно методологически: нельзя переносить опубликованный performance uplift одной архитектурной миграции в business case другой системы.

Fluent: наиболее явный blueprint component convergence
Microsoft Fluent convergence issues практически повторяют pipeline, который нужен при дефрагментации:

research existing implementations → compare APIs → incorporate Open UI research → define component spec → implement → conformance/unit/visual/a11y verification → validate with product partners → migration guide/codemod → stable ownership.

Особенно важно, что convergence не заставляет все похожие controls становиться одним API. В Fluent отдельные Dropdown, Combobox, Picker и другие родственные concepts могут оставаться отдельными компонентами, когда их interaction semantics требуют самостоятельной модели.

Primer, Carbon и Spectrum: legacy — первое-class состояние
Primer делает lifecycle особенно прозрачным: Experimental API не обещает зрелость; Ready рекомендуется к использованию и получает controlled migration path при breaking change; Deprecated имеет documented replacement и не должен использоваться в новом code.

Carbon использовал overlap поколений: deprecated v10 assets продолжали работать в v11, а удаление было отложено до следующего major cycle; параллельно предоставлялись upgrade tooling и инструкции.

Spectrum Web Components формализует announcement, warning, migration information и eventual removal.

Общий вывод сильнее конкретных сроков: legacy component не должен исчезать в тот момент, когда canonical replacement готов; он исчезает, когда migration contract выполнен.

Material, GOV.UK и государственные системы
Официальные материалы Material подробно поддерживают major-version migration к Material Components/Material 3, но опубликованных данных именно о rationalization исторических компонентных дублей там меньше, чем у Fluent, Spotify или Shopify. Поэтому Material полезен здесь как подтверждение controlled migration, а не как главное evidence для merge/split methodology.

GOV.UK также показывает семантические границы. Back link и Breadcrumbs оба решают navigation-adjacent задачу, однако documentation предписывает разные usage contexts и не рекомендует использовать их совместно; Tag, несмотря на badge-like внешний вид, специально определяется как status, а не interactive control.

Это ещё одно подтверждение: family classification должна начинаться с user/semantic role, а не геометрии.

Безопасная миграция, rollback и доказательство эквивалентности
Почти все зрелые системы предпочитают управляемый transition big-bang rewrite, если количество consumers существенно. Shopify Polaris Migrator, Atlassian codemods, Carbon upgrade tooling, React Spectrum codemods и Primer migration guides существуют именно потому, что наличие нового canonical API ещё не означает возможность одномоментно заменить старый во всех местах.

Сравнение миграционных стратегий
Стратегия	Преимущество	Риск	Rollback	Когда оправдана
Big-bang rewrite	Один переход, отсутствие долгого dual state	Большой blast radius; merge conflicts; сложная атрибуция regressions	Обычно тяжёлый: revert большого change-set	Очень маленькая consumer base либо breaking platform event
Incremental / strangler	Ограничивает blast radius; legacy постепенно вытесняется	Нужно временно поддерживать две реализации	Прост: откат конкретного consumer/family	Наиболее универсальный default
Compatibility wrapper	Старый API продолжает работать поверх нового	Wrapper может законсервировать плохой контракт и скрыть semantic mismatch	Хороший, пока старая implementation доступна	Когда mapping почти полный, но consumers многочисленны
Adapter/facade	Изолирует различия нескольких underlying systems	Может стать постоянным дополнительным abstraction layer	Хороший	Cross-platform/cross-app integration; пример Spotify Masthead.
Alias / legacy export	Очень дешёвая source compatibility	Пользователи могут продолжать импортировать legacy бесконечно	Отличный	Rename/package convergence при одинаковой semantics
Codemod	Быстро меняет повторяемые syntax/API patterns	Не способен автоматически доказать semantic equivalence	Revert commit; inverse transform не следует предполагать	Массовые детерминированные преобразования
Feature flag / dual run	Даёт staged rollout и быстрый runtime rollback	Увеличивает временную сложность и требует cleanup	Лучший runtime rollback	Поведение или UX может измениться; Atlassian использует flag transition для компонентов.
Route-by-route	Можно проверить полноценные product flows	На одной route временно смешиваются поколения	Хороший	Когда UI fortement привязан к surface/flow
Family-by-family	Даёт единый contract для всех consumers одного concept	Cross-family dependencies могут замедлять отдельную семью	Хороший	Особенно подходит для component rationalization
Parallel package/version	Consumer обновляется в собственном темпе	Долгое обслуживание двух generations	Pin/revert версии	Major platform/library migration; Carbon применял overlap поколений.

Compatibility wrapper следует использовать только если он действительно сохраняет contract. Когда старый API допускает семантические режимы, которых больше нет в canonical model, правильнее вывести такие consumers в manual exceptions или другой component, как это делает Primer в SelectPanel migration.

Codemod также не следует рассматривать как proof of correctness. Atlassian и Carbon прямо документируют ситуации, где автоматический transform делает основную часть работы, но отдельные usages требуют manual intervention/review.

Три доказательных варианта процесса
Family-first incremental process наиболее прямо соответствует задаче дефрагментации:

census → family hypothesis → contract diff → merge/split decision → canonical API → compatibility strategy → migrate consumers → block new legacy → delete

Он минимизирует количество одновременно открытых архитектурных решений и хорошо сочетается с Fluent convergence practice.

Surface-first strangler полезнее, если component behavior сильно зависит от product context:

inventory whole surface → introduce canonical components behind flag/adapter → migrate one route/flow → production verification → expand

Его преимущество — проверка не только isolated component, но и интеграционной эквивалентности.

Foundation-led iterative process оправдан при redesign/theme migration:

foundation audit → normalize high-leverage semantic roles → migrate first family → observe exceptions → refine tokens → next family

Он принципиально отличается от «сначала создать идеальный полный token catalogue»: foundations расширяются из подтверждённых product requirements. Это согласуется с Frost и опытом Spotify.

Visual equivalence не равна functional equivalence
Quality gates полезно разделять на несколько независимых классов.

Gate	Что должен ловить	Статус перед удалением legacy
Consumer inventory	Неучтённые imports/wrappers/dynamic usages	Обязательный
Contract/schema diff	Потерянные props/states/slots/events/invariants	Обязательный
Visual regression	Geometry, typography, spacing, color, icons, media differences	Обязательный для UI-sensitive migration
Interaction tests	Click/keyboard/open/select/loading/error transitions	Обязательный для interactive components
Accessibility tests	Role/name/state/focus/keyboard/contrast regressions	Обязательный
Responsive/container matrix	Reflow, overflow, truncation и container-dependent failures	Обязательный для responsive component
Content stress	Empty, very long, localized, malformed/missing media	Высоко рекомендуется
DOM/accessibility-tree comparison	Structural/semantic drift	Полезен, но exact DOM identity не должна быть универсальным acceptance criterion
Computed-style diff	Диагностика трудноуловимых styling changes	Опциональный диагностический инструмент, особенно при pixel-preserving migrations
Production telemetry	Errors, usage, rollout failures, performance/product effects	Обязателен для high-risk/shared component
Product experiment	Поведение пользователей изменилось, даже если технические tests проходят	Требуется, когда migration сознательно меняет UX

Storybook поддерживает reproducible stories и automated interaction, accessibility и visual testing; viewport tooling позволяет фиксировать responsive scenarios.

Playwright поддерживает screenshot baselines и pixel comparison, но сам предупреждает, что rendering зависит от OS/browser/environment, поэтому baseline environment должен быть стабильным.

Для семантики особенно полезно, что Playwright может snapshot-ить accessibility tree — roles, accessible names и ARIA states. Это ближе к functional equivalence, чем сравнение raw DOM.

Exact DOM equality не является хорошим универсальным gate: новый компонент может использовать более правильную markup structure при полностью сохранённом UX. Аналогично exact computed-style equality может противоречить самой цели нормализации foundations. Эти проверки полезнее как targeted diagnostics, а не как окончательное определение эквивалентности.

Для visual regression тоже нужен policy: разница должна быть либо неожиданной regression, либо явно approved intentional delta. Иначе snapshot updates легко превращаются в механизм автоматического подтверждения любого изменения; Playwright отдельно отмечает maintenance и over-reliance risks snapshot testing.

Rollback следует проектировать до начала consumer migration
Для feature-flagged replacement rollback означает переключение на прежнюю implementation; Atlassian показывает такой подход к переходу компонентов.

Для compatibility wrapper достаточно временно вернуть delegation старому implementation.

Для parallel packages/version migration можно pin-нуть предыдущую версию; Carbon's overlap model делает этот вариант естественным.

Для codemod безопаснее иметь изолированные migration commits, а не рассчитывать на наличие perfect inverse codemod.

Для big-bang rollback почти всегда означает большой revert, поэтому эта стратегия хуже всего локализует риск.

Физическое удаление legacy package/component, соответственно, должно быть последним, а не первым шагом cleanup.

Lifecycle, метрики, governance и причины повторной фрагментации
После первого successful merge главная задача меняется: система должна замечать новые обходные реализации раньше, чем они превратятся в следующее историческое поколение.

Candidate, experimental, fork, legacy и deprecation
Практичный lifecycle, синтезирующий Primer, USWDS и Spectrum, выглядит так:

local/candidate → experimental → ready/stable → deprecated → retired/archive

Но переходы не обязаны быть линейными. Candidate может быть rejected, эксперимент может остаться product-local, stable component может быть split на несколько replacements.

Primer даёт сильный precedent для explicit maturity.
 USWDS идёт ещё дальше и сохраняет публичный status даже для proposed components, включая возможность «will not pursue».

Из этого следует важное правило для A/B treatments:

Наличие experiment branch не делает его variant canonical component.

Пока winner не выбран продуктовым решением, обе реализации являются evidence. Если заранее «нормализовать» их в одну систему либо удалить challenger/control, можно потерять возможность корректно завершить эксперимент.

После experiment outcome возможны минимум четыре результата: winner становится canonical variant; winner заменяет прежнюю default; experiment показывает необходимость split; либо treatment отвергается и архивируется. Это уже product decision, а не задача design-system architecture.

Product-specific fork должен иметь хотя бы owner + reason + closest canonical component + intentional deltas + review/rejoin condition. В противном случае невозможно отличить разрешённое исключение от случайного shadow component.

Promotion в core
Нет подтверждённого индустрией универсального порога вроде «компонент используется три раза — значит должен стать системным». Более сильный набор evidence:

реальное использование, а не hypothetical roadmap; стабильная semantic identity; повторяемость проблемы; понятная anatomy/state model; accessibility solution; возможность поддерживать API; known owner; отсутствие открытого эксперимента; и наличие преимуществ общего ownership по сравнению с локальной composition.

Frost формулирует это как идею системы для уже решённых, «boring» problems, а Mall предлагает ещё более жёсткую adoption-oriented heuristic: component не должен появляться в системе полностью до того, как у него вообще появится реальный adopter.

Это экспертные правила, а не математические законы. У accessibility-critical primitive может быть смысл появиться в core до массового reuse, если централизованное решение существенно снижает риск.

Метрики прогресса, которые трудно «обыграть»
Метрика	Что она измеряет	Опасная интерпретация
Eligible consumer coverage	Доля известных usages family, перешедших на canonical path	Лучше простого «сколько components есть в DS»
Remaining legacy consumers	Абсолютное количество/доля старых imports или runtime usages	Ноль не доказывает отсутствие динамических/untracked consumers
Shadow implementation count	Локальные реализации той же ответственности вне canonical API	Нельзя считать любой local component нарушением
Migration throughput	Consumers/families, успешно выведенные из legacy	Скорость без quality gates стимулирует regressions
Manual exception rate	Сколько usages codemod не смог безопасно преобразовать	Высокая доля может означать, что target contract не эквивалентен
Override/slot frequency	Какие parts consumers постоянно заменяют	Spotify предлагает использовать такую аналитику для пересмотра defaults.
Deprecated API introduction rate	Появляются ли новые legacy imports после объявления deprecation	Особенно хорошо сочетается с lint rule
API surface / invalid-combination trend	Растёт ли сложность canonical API при «унификации»	Prop count сам по себе не quality score
Visual/a11y regression rate	Побочные эффекты migration	Следует считать escaped defects, а не только CI failures
Design↔code drift	Насколько design assets соответствуют реально поставляемым APIs/states	Требует определённого source-of-truth process
Product/performance metrics	Bundle, load, conversion, task success и др., когда migration может их затронуть	Нельзя приписывать component consolidation эффект без causal evidence
Time-to-removal после deprecation	Зависает ли legacy навсегда	Слишком агрессивное сокращение создаёт pressure на unsafe migration

Mall демонстрирует важный дефект library-side adoption percentage: если удалить из каталога неиспользуемые компоненты, процент adoption математически вырастет без единого consumer migration. Поэтому лучше измерять долю продуктовых opportunities/usages, покрытых canonical implementation, а не долю system components, которые кто-то когда-то импортировал.

Spotify развил adoption tracking от ручного учёта к repository-level pipelines, анализирующим component/token usage. Для enterprise landscape это сильная практика; для малого продукта аналогом может быть простой AST/import scan в CI, а не собственная аналитическая платформа.

Governance, который действительно предотвращает рецидив
Наиболее воспроизводимая комбинация состоит не из design review board, а из четырёх механизмов:

Discovery. Существующие canonical APIs должны быть легче найти, чем написать новый component.

Supported extension. Slots, subcomponents, utilities или styling hooks позволяют решить legitimate exceptions без обращения к private DOM. Salesforce специально рекомендует public variants/utilities/hooks и предупреждает против зависимости от internal markup/classes.

Machine enforcement. После появления безопасного migration path lint rule запрещает новое использование deprecated API. Atlassian объединяет ESLint plugins, tokens enforcement и codemods именно таким образом.

Lifecycle cleanup. Deprecation должна закончиться removal/archive, иначе система бесконечно содержит все предыдущие поколения. Primer, Carbon, Spectrum и GOV.UK имеют явные removal paths; GOV.UK Frontend v6, например, удалял накопленные deprecated APIs как breaking release.

Термин exception budget встречается в профессиональных разговорах как удобная governance metaphor, но в исследованных первичных системах не обнаруживается столь же стандартизированная формальная практика, как lifecycle, linting или deprecation. Поэтому разумнее считать его локальным управленческим инструментом: например, отслеживать количество active forks/unsupported overrides и требовать owner/reason. Делать из фиксированного «лимита исключений» универсальный industry rule evidence не позволяет.

Типичные антипаттерны и причины неудач
Screenshot deduplication. Объединение по внешнему сходству игнорирует semantics, interaction и accessibility. Spectrum Button/Link и Shopify chart case дают прямые counterexamples.

The universal component. Попытка сохранить все исторические differences как props вместо выбора canonical contract. Результат — invalid combinations и API, который приходится знать лучше самого продукта. Curtis и Spotify предлагают slots/composition как альтернативу.

Configuration at any cost. Чем более opaque abstraction, тем вероятнее, что consumer вообще откажется от неё и создаст local implementation. Spotify прямо описывает этот trade-off.

Primitives-only ideology. Противоположная крайность также создаёт fragmentation: Spotify признаёт, что чрезмерный уклон в flexibility заставлял consumers многократно собирать общие patterns самостоятельно.

Prebuilding hypothetical variants/components. Frost называет это over-design, Mall связывает заранее созданные, но не принятые команды components с design-system ghost towns.

Tokenizing by frequency. Возникает низкоуровневый словарь чисел вместо design semantics; Spotify отдельно корректировал подход от non-semantic к semantic layers.

Migration without consumer inventory. Ручные spreadsheets перестают быть надёжными на большом масштабе; Shopify опубликовал конкретный tooling case после gaps в inventory по тысячам repositories.

Codemod as proof. Transform может успешно скомпилироваться и всё равно поменять semantics. Atlassian/Carbon оставляют ambiguous cases человеку.

Deprecation without enforcement. Если новый code продолжает импортировать legacy, migration имеет движущуюся конечную точку. Lint rule полезен после появления replacement/codemod, а не до него.

Premature experiment cleanup. Candidate/A-B implementation рассматривается как мусор до продуктового решения. Lifecycle models Primer/USWDS показывают более безопасную концепцию: незрелость — состояние, а не основание для немедленного удаления.

Design/code split. Отдельно развивающиеся component libraries в design tool и production code становятся двумя conflicting products. Frost прямо связывает такой drift с организационной проблемой синхронизации.

Governance as bureaucracy. Большое количество обязательных reviews не компенсирует плохой consumer experience. Spotify retrospective подчёркивает необходимость ранней работы с внутренними customers, а не разработки системы в изоляции.

Облегчённый процесс для команды из одного–пяти человек и открытые вопросы
Для небольшой действующей команды большинство enterprise-механизмов стоит сохранять по функции, но не по форме. Не нужен отдельный design-system council, чтобы иметь lifecycle; не нужна data platform, чтобы считать imports; не нужен собственный codemod framework, если мигрируются четыре consumers.

Lean family-by-family process
Шаг	Минимальный артефакт	Gate перехода
Census	Одна таблица/JSON: implementation, screenshot/reference, import path, consumers, status	Известны основные code paths и потенциальные dynamic usages
Family hypothesis	Группа похожих implementations + причина группировки	Есть evidence по semantics/anatomy/behavior, а не только appearance
Contract diff	Короткая матрица anatomy / states / events / a11y / responsive / content / overrides	Все meaningful differences классифицированы как accidental, required или unresolved
Decision	Небольшая ADR: merge / variant / split / composition / preserve / deprecate и почему	Для rejected alternatives записана причина
Canonical contract	Typed API/schema + representative stories	Invalid combinations известны; accessibility и layout boundary определены
Proof	Visual + interaction + a11y + responsive/content cases	Canonical implementation покрывает required legacy behavior либо исключения явно выделены
Migration	Manual changes, wrapper или небольшой codemod; при риске feature flag	Каждый consumer имеет owner/status; возможен rollback
Closure	Lint/no-new-legacy rule → removal после нулевых известных consumers	Legacy больше не создаётся; docs/design representation обновлены

Это сохраняет сущность Frost inventory, Curtis contract analysis, Fluent convergence и Atlassian/Primer migration discipline, но не копирует организационный вес больших систем.

Для малого проекта ручная таблица остаётся адекватной, пока она действительно исчерпывающая. Автоматизацию имеет смысл вводить там, где конкретная ручная операция уже даёт ошибки: import scan вместо ручного consumer list, story test вместо повторяемого visual QA, lint rule вместо напоминаний в review. Shopify's переход от spreadsheet поиска к automated repository tooling показывает, почему автоматизация ценна, но не означает, что малой команде требуется enterprise indexing infrastructure.

Что из enterprise-практик стоит взять практически всегда
Практика	Для 1–5 человек	Почему
Explicit experimental / stable / deprecated	Да	Почти нулевая organizational cost, предотвращает неправильные assumptions
Consumer inventory	Да	Без него невозможно безопасное удаление
ADR для merge/split	Да, но короткий	Главная ценность — сохранить rationale
Component stories/state matrix	Да	Одновременно documentation и regression fixture
Visual/interaction/a11y CI	По criticality	Сильно дешевле regressions в shared components
Codemod	Только при повторяемой миграции	Для нескольких usages manual change проще
Feature flag	Для behavior-risk changes	Даёт дешёвый rollback
Lint rule against deprecated API	Да, после migration path	Не даёт legacy снова расти
Usage telemetry platform	Обычно нет	AST/import search часто покрывает потребность
Multi-stage contribution committee	Нет по умолчанию	Координационный overhead превышает выгоду
45-day proposal period наподобие USWDS	Нет	Это решение для публичной федеральной governance, а не компонентная необходимость.
Separate foundation/component governance boards	Нет	Достаточно одного owner/process, пока scale не требует разделения

Минимальный набор quality gates для небольшой команды
Даже lean process не должен сокращаться до screenshot review. Минимальный качественный набор для shared interactive component:

contract diff + representative visual states + keyboard/interaction path + accessibility check + narrow/wide container + long/empty content + known consumer migration list.

Storybook позволяет одной и той же story matrix служить development fixture и входом для visual, interaction и accessibility tests.

Для simple decorative primitive interaction gate может отсутствовать. Для сложного Dialog/Menu/Combobox, наоборот, keyboard/a11y/state coverage важнее pixel-perfect DOM equivalence.

Вопросы, где профессиональная практика действительно противоречива
Один core или system of systems? Spotify является сильным аргументом за layered/federated architecture в неоднородной организации, но сама эволюция Encore показывает цену чрезмерной локальной свободы. Универсального правильного уровня централизации нет.

Configuration или composition? Configuration делает common case безопаснее и проще; composition снижает prop explosion и позволяет product-specific behavior. Spotify сознательно предоставляет оба уровня, а не выбирает идеологически один.

Headless или branded components? Headless primitives полезны для многобрендового/multiplatform слоя поведения; fully configured branded component лучше стандартизирует обычный продуктовый путь. Radix иллюстрирует первый полюс, Spotify layered API — гибрид.

Tokens-first или components-first? Источники поддерживают iterative loop, но исходная точка зависит от dominating debt. Theme/rebrand может оправдать foundation-first; semantic/API fragmentation — family-first.

Сколько reuse нужно для promotion? Единого числа нет. Frost/Mall склоняются к product-proven components, но accessibility/security/interaction primitives иногда оправдано стандартизировать раньше массового adoption.

Должна ли новая реализация быть визуально идентична legacy? Если задача — чистая техническая замена, visual parity полезна как gate. Если consolidation одновременно исправляет known inconsistency, intentional diff является частью target contract. Автоматический pixel equality не может решить этот продуктовый вопрос.

Нужно ли сохранять старый DOM? Только если DOM/selector structure является documented consumer contract. Salesforce, напротив, предупреждает consumers не зависеть от внутренних classes/markup; это позволяет implementation эволюционировать без ложной совместимости.

Является ли популярный override новым variant? Не автоматически. Spotify предлагает использовать override telemetry как сигнал для исследования default, но популярность не заменяет проверку semantics, accessibility и долгосрочной supportability.

Где должна жить продуктовая композиция? Frost считает system core местом settled/common problems, а product teams — допустимым местом для snowflakes; Spotify показывает промежуточный вариант local systems поверх shared foundation. Граница является архитектурным и организационным решением, а не свойством картинки.

Code или design tool должен быть source of truth? Frost аргументирует, что доступная designers библиотека должна отражать production code; contract-as-data Curtis предлагает более симметричную архитектуру, где проверяемая schema описывает intent, а design/code являются implementations. У индустрии нет единственного организационного ответа, но есть сильный консенсус против независимой эволюции двух представлений.

Итоговый методологический корпус поэтому лучше формулировать не как «сведите похожее к минимальному числу компонентов», а как цепочку доказательств:

найти → классифицировать → сформировать family hypothesis → сравнить contracts → отделить accidental variation от domain variation → выбрать merge/variant/split/composition/preserve → сформулировать canonical contract → доказать visual и functional coverage отдельно → мигрировать обратимо → запретить новый legacy → удалить только после consumer closure → продолжать наблюдать overrides, forks и adoption.

Эта модель согласуется одновременно с interface inventory Frost, modular decomposition Kholmatova, contract/schema thinking Curtis, adoption-oriented критикой Mall и реальными convergence/migration practices Spotify, Shopify, Fluent, Atlassian, Primer, Carbon и Spectrum. Главное, чего evidence не подтверждает, — существование универсального target числа компонентов, универсального reuse threshold, обязательного tokens-first порядка или единственного правильного баланса между configuration и composition. Эти решения остаются зависимыми от semantics продукта, consumer landscape и стоимости совместимости.
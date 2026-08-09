Evidence-based Normalization Charter для «Полюбить Калининград Анонсы»
Корпус, границы исследования и иерархия доказательств
Исследование рассматривает нормализацию как сведение доказанно эквивалентных реализаций к ограниченному набору семантических ролей и контрактов, а не как редизайн и не как автоматическое превращение наиболее частых AS-IS значений в tokens. Текущий canonical corpus привязан к исходному commit ef7aa62e45c60f7a12da6160f490719c0721ec03, capture 2026-08-08T12:47:40Z, pipeline decoder-v1.0. В summary.md зафиксированы 107 logical components, 12 pages with observations, 12 candidate family/format contracts, 107 published families, 21 unresolved records и 3 mismatch records. [P-MANIFEST] [P-SUMMARY]

Ключевые project sources:

ID	Evidence class	Источник	Дата / версия	Что можно считать фактом
P-MANIFEST	Project evidence	catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/manifest.json	decoder-v1.0; capture 2026-08-08	происхождение snapshot, commit, corpus counts
P-SUMMARY	Project evidence	.../summary.md	snapshot 20260808T124842	107 components, 12 contracts, 21 unresolved, рекомендуемый порядок чтения
P-INDEX	Project evidence	.../artifact-index.json	snapshot 20260808T124842	authoritative artifact ordering, raw/heavy-evidence pointers
P-UNRESOLVED	Project evidence	.../unresolved.jsonl	snapshot 20260808T124842	реальные открытые вопросы семантики, provenance и page-vs-family scope
P-EVENTMEDIA	Project evidence	.../candidate-contracts/candidate.event-media.contract.json	candidate family_media@2.0.0-candidate	наблюдаемые 3:2, 2:3, 1:1; cover/contain; fallback/upscale/safe-area concepts
P-README	Project evidence	catalog/component-decoder/README.md	repository snapshot docs	heavy evidence отделён от compact Git snapshot
P-RELEASE	Project evidence	GitHub release current-ui-decoder-v1-snapshot-20260808T124842-4786ac53bc-r2	published 2026-08-08	heavy archive существует; SHA-256 6dd697d15730b98418626ef00eea77277f7f12d766ae02d990332ceb7967f201
P-SOURCE	Project evidence	product commit ef7aa62e…	2026-08-07	источник snapshot; explicit media fallback fixes присутствуют в commit history

Особенно важно, что compact snapshot не является полным raw-style corpus. README.md и artifact-index.json указывают на отдельный heavy archive с source-style-records.jsonl, selector-candidate-records.jsonl, source-computed-heading-records.jsonl и static-shots/. Следовательно, на основании только compact artifacts нельзя честно вычислить полный histogram font-size × line-height × weight × context, точное количество typography exceptions или заполнить строку CSV для каждого DOM/style usage. [P-README] [P-INDEX] [P-RELEASE]

Параллельный Behavioral Decoder & Experiment Archaeology v1.1, который по постановке задачи должен закрыть sizing, loading, interaction, rails, sticky/fixed и experiment evidence, не входит в перечисленный canonical artifact index snapshot. Поэтому эти области ниже получают envelopes и decision contracts, но не окончательные target values. [P-INDEX]

unresolved.jsonl даёт дополнительные основания не делать преждевременное слияние: там явно остаются вопросы semantic meaning icon-only header controls, transport destination taxonomy, distinction между component prop и page-instance override, family-vs-page-root precedence, contextual-navigation media variants, token provenance и различие landing-overlay/detail-page artifact compositions. Это прямое evidence против двух анти-паттернов: «визуально похоже → один компонент» и «разные CSS-файлы → разные компоненты». [P-UNRESOLVED]

Иерархия решения должна быть такой:

Normative requirement → platform/official guidance → project semantics and observed behaviour → cross-system convention → normalization inference.

Проектный corpus определяет, что реально существует, но не может отменять accessibility requirement; design system показывает проверенный способ решения, но его numeric scale не является доказательством пригодности для Калининградского продукта. Частота AS-IS значения является evidence of prevalence, а не evidence of correctness.

Основной нормативный baseline:

ID	Class	Источник	Роль в charter
N-WCAG22	Normative	W3C WCAG 2.2, Recommendation, 2023-10-05	resize, reflow, text spacing, keyboard, focus, target size, status messages
N-ARIA12	Normative	WAI-ARIA 1.2, W3C Recommendation	name/role/state semantics там, где native HTML недостаточен
N-HTML	Normative/platform standard	WHATWG HTML Living Standard	native controls, headings, responsive images, image dimensions/loading
N-CSSTEXT	Normative/specification	CSS Text	wrapping, overflow, hyphenation mechanisms
N-CSSIMG	Normative/specification	CSS Images	object-fit
N-CSSSIZING	Normative/specification	CSS Sizing	aspect-ratio
N-SNAP	Normative/specification	CSS Scroll Snap Level 1	rail snapping mechanism
N-MQ	Normative/specification	Media Queries	prefers-reduced-motion
N-ENV	Normative/specification	CSS Environment Variables	safe-area-inset-*
N-VALUES	Normative/specification	CSS Values & Units	dynamic/small/large viewport units
O-APG	Official guidance	WAI-ARIA Authoring Practices Guide	dialog, disclosure, menu button, listbox, combobox, tabs, carousel patterns

WCAG 2.2 требует, среди прочего, работоспособности при увеличении текста до 200%, reflow без потери информации при эквиваленте 320 CSS px, отсутствия потери контента при user text-spacing overrides, keyboard operability, видимого фокуса, отсутствия полного перекрытия focused element author-created surfaces и минимального pointer target 24×24 CSS px с предусмотренными исключениями. Это normative floor, а не готовая продуктовая размерная шкала. [N-WCAG22]

Нормативные ограничения и переносимые conventions дизайн-систем
Сравнение имеет смысл не как голосование за конкретные 16 / 24 / 32 px, а как проверка повторяющихся архитектурных принципов.

Design system	Evidence class	Переносимый принцип	Контекстно-зависимая реализация	Что нельзя копировать автоматически
USWDS	Design-system convention	semantic typography, constrained spacing units, accessibility-first controls	federal information-service density/content	собственную unit scale и breakpoints
GOV.UK Design System	Design-system convention	небольшой набор typography roles, strong native-HTML bias, predictable spacing	government transactional content	exact font ramp и layout widths
Carbon	Design-system convention	отделение productive от expressive typography/motion; tokenized spacing	enterprise/data-heavy UI	Carbon type scale или density напрямую
Material 3	Design-system convention	semantic type roles, state layers, touch-oriented sizing	Android/cross-platform interaction language	48dp→48px как механическое преобразование
Fluent 2	Design-system convention	semantic typography, explicit interaction states, layered surfaces	Microsoft app ecosystem	Fluent component geometry и elevations
Polaris	Design-system convention	task-oriented semantic components, constrained tokens	merchant/admin workflows	merchant density и component taxonomy
Primer	Design-system convention	compact but systematic scale, primitives/composition separation	developer-centric GitHub UI	GitHub compactness как default editorial density
Spectrum 2	Design-system convention	semantic roles, adaptive components, accessibility states	Adobe creative-app workflows	Adobe control sizing и visual expression

[D-USWDS: official USWDS documentation; mutable web documentation, exact release must be pinned at synthesis.] [D-GOVUK: GOV.UK Design System official documentation.] [D-CARBON: Carbon Design System official documentation.] [D-MATERIAL: Material Design 3 official documentation.] [D-FLUENT: Fluent 2 official documentation.] [D-POLARIS: Shopify Polaris official documentation.] [D-PRIMER: GitHub Primer official documentation.] [D-SPECTRUM: Adobe Spectrum 2 official documentation.]

Из восьми систем переносится не одна numeric scale, а четыре устойчивых принципа: semantic role ≠ raw size, размеры образуют небольшой constrained vocabulary, expressive/editorial contexts могут иметь ограниченные исключения, а interactive geometry должна рассматриваться отдельно от glyph/icon geometry. Это convention-level evidence, не нормативное предписание.

Для Normalization Charter отсюда следует разделить четыре понятия:

Тип ограничения	Пример	Статус
Normative minimum	pointer target ≥24×24 CSS px, если не применяется WCAG exception	обязательная граница [N-WCAG22]
Recommended project target	standalone touch controls в диапазоне 44–48 CSS px	candidate inference, поддержанная platform/DS conventions
Compact exception	визуально 32–40 px при фактическом target ≥24 px и достаточном spacing	допустим только именованным variant
Editorial exception	крупный display, poster/media geometry, нестандартный section rhythm	допустим при semantic/content rationale

Таким образом, 44/48 px нельзя подписывать “WCAG minimum”. WCAG 2.2 AA задаёт 24×24 CSS px с exceptions; более крупный project target — осознанный safety/usability margin. [N-WCAG22]

Для typography аналогично: WCAG не требует font-size:16px и не требует line-height 1.5 как default stylesheet. SC 1.4.12 требует, чтобы пользователь мог применить, в частности, line height 1.5× font size, paragraph spacing 2×, letter spacing 0.12em и word spacing 0.16em без потери content/functionality. Следовательно, эти числа должны быть stress fixture, а не ошибочно названными design tokens. [N-WCAG22]

Typography rationalization: три кандидатные модели
Главное разделение charter:

document semantics определяются HTML outline/content structure; visual role определяется иерархией представления. h2 не обязан всегда выглядеть как один конкретный font-size, а текст, визуально похожий на heading, не следует делать heading без document semantics. [N-HTML] [N-WCAG22]

Для продукта предлагается vocabulary semantic usages:

display, page-title, section-title, subsection-title, body-leading, body, ui-label, metadata, caption.

Это не девять обязательных визуальных размеров: несколько semantic usages могут проецироваться на одну visual role.

Сравнение моделей без объявления winner
Параметр	Compact	Balanced	Expressive
Visual heading roles	3	4	5
Display/hero separation	нет	частично	да
Candidate heading ranges	20–40 px	20–52 px	20–64 px
Mobile pressure	низкое	среднее	высокое
Editorial differentiation	ограниченная	умеренная	высокая
Long Russian title resilience	наиболее высокая	высокая	требует сильнее ограничить верхний scale
Risk of AS-IS exceptions	потенциально высокий	вероятно средний	потенциально низкий
Maintenance cost	низкий	средний	высокий
Exact corpus coverage	не вычислено	не вычислено	не вычислено
Verified exception count	не вычислено	не вычислено	не вычислено

Последние две строки намеренно не заполнены оценочными числами: для этого нужны heavy source-style-records и behavioral supplement. Подставлять invented coverage вроде «92%» было бы ложной точностью. [P-README] [P-INDEX]

Compact сводит display/page-title к одной верхней роли примерно 32–40 px, section-title к 24–30 px, subsection к 20–24 px. Типичное responsive отношение между соседними heading levels получается около 1.20–1.30, но это envelope, не modular-scale mandate.

Balanced отделяет display от page title: 40–52, 32–42, 24–32, 20–24 px. Это создаёт четыре visual heading roles и позволяет hero/event detail отличаться от обычной section hierarchy без отдельного CSS-size на каждый template.

Expressive добавляет hero/display split: ориентировочно 48–64, 40–52, 32–42, 24–30, 20–24 px. Такая модель лучше сохраняет действительно editorial distinctions, но при русских названиях событий повышает вероятность 4–6 строк на узком viewport и крупного above-the-fold displacement.

Ни один из диапазонов выше не является normative. Они — design-system-convention + project-inference candidate envelopes. Их нельзя переводить в tokens до фактического histogram/fixture run.

Для body предлагается проверять 16–18 px как normal reading range и 18–20 px как leading/editorial body. Для ui-label — примерно 14–16 px; для metadata 13–14 px; caption 12–13 px только там, где информация действительно secondary и проходит contrast/readability stress. Здесь confidence medium, поскольку compact snapshot не позволяет сопоставить диапазоны со всеми AS-IS usages.

Line-height полезнее нормализовать по роли, чем одним multiplier:

Role family	Candidate envelope	Почему
display / page title	1.08–1.20	многострочность без чрезмерных vertical gaps
section/subsection	1.15–1.30	balance density/readability
body / leading	1.40–1.60	continuous reading
label/meta	1.25–1.45	compact UI, но без clipping

Это convention/inference; normative requirement — не ломаться, когда пользователь применяет WCAG text-spacing values. [N-WCAG22]

Letter spacing следует считать отдельным role attribute, а не частью size identity. Для основного кириллического текста безопасный candidate default — около 0; отрицательный tracking допустим для крупных display roles только после теста конкретного шрифта. All-caps + positive tracking не следует превращать в универсальный metadata style, поскольку это продуктовый typography choice, а не accessibility rule.

Для русскоязычного corpus критичен content stress. Минимальный набор:

Fixture	Candidate text / case	Charter expectation
short	Органный концерт	все модели без special case
long	Летний вечер в Кафедральном соборе: музыка, свет и история Кёнигсберга	естественные 2–4 строки
very long	Большой семейный фестиваль науки, музыки и уличного театра на Верхнем озере с мастер-классами и вечерним концертом	page title не должен терять content
mixed metadata	9 августа · 18:30 · 12+ · от 500 ₽	цифры/символы не clip; stable baseline
venue	Калининградский областной музей изобразительных искусств, историческое здание Кёнигсбергской биржи	multiline, без forced one-line ellipsis
mixed script	DJ-set / Кёнигсберг / Open Air	fallback fonts не меняют line box катастрофически

lang="ru" должен корректно отражать язык документа/фрагмента; hyphens:auto можно рассматривать только после target-browser testing. word-break:break-all не является подходящим generic fix для длинного русского заголовка. [N-HTML] [N-CSSTEXT]

Line clamp следует ограничить preview contexts. На canonical page title или другой единственной носительнице essential information clamp создаёт content-loss risk. На EventCard ограничение в 2–4 строки может быть legitimate composition rule, если полный title доступен в нормальном navigation path и stress test показывает приемлемое поведение. Это inference с medium confidence, а не WCAG-prescribed line count.

Из фактически доступного project evidence typography известно, что corpus содержит именованные source families вроде t-3xl-bold-15bb54, а Penpot evidence — title-medium/subtitle--43; unresolved.jsonl прямо предупреждает, что Penpot/web selection coverage и naming несовершенны. Поэтому совпадение имени или визуальной величины нельзя считать достаточным для mapping. [P-UNRESOLVED]

Spacing, sizing и media envelopes
Spacing следует нормализовать не как бесконечный ряд допустимых пикселей, а как небольшое количество semantic bands. Candidate:

Semantic band	Envelope	Основные применения	Confidence
micro	2–4 px	icon/text optical correction, tiny internal separation	medium
x-small	4–8 px	tightly related inline/internal items	high
small	8–12 px	compact control/card internals	high
medium	12–16 px	default component padding/gaps	high
large	16–24 px	groups/card padding	high
x-large	24–32 px	component-to-component separation	medium
section	32–64 px	editorial/layout separation	medium

Эти ranges не являются будущими spacing tokens. После raw histogram нужно проверить, какие AS-IS values естественно кластеризуются в каждой полосе; только затем выбирать representative points. Сейчас точный показатель «сколько AS-IS значений не попадёт» отсутствует по той же причине, что и typography counts. [P-README] [P-INDEX]

Sizing:

Context	Normative floor	Candidate project target	Named exception
standalone touch action	WCAG 24×24 CSS px с exceptions	44–48 px hit area	compact 32–40 visual box при ≥24 actual target
primary navigation	WCAG floor	44–56 px row/target	none без evidence
compact inline control	WCAG floor	32–40 px	только там, где density оправдана
icon glyph	normative size отсутствует	примерно 16–24 px glyph внутри larger target	размер glyph ≠ размер target
editorial media	n/a	ratio/container-driven	content-specific

[N-WCAG22]

Breakpoint policy следует выводить из geometry failure points, а не импортировать Material/Bootstrap/USWDS breakpoints. До behavioral sizing corpus разумны только абстрактные bands compact / medium / wide; конкретные границы должны быть найдены по EventCard, EventHero, rails, detail formats и navigation specimens. Confidence high для принципа, low для числовых thresholds.

Exception budget должен быть структурным: на family разрешается не «ещё три произвольных px value», а именованные исключения типа compact-density, editorial-feature, legacy-migration, experiment-frozen. Неименованное новое значение считается fragmentation candidate.

Media — область, где project evidence уже существенно сильнее. Candidate event-media contract документирует:

3:2 для event-card hero, включая наблюдение 300×200;
2:3 для small/poster-oriented thumbnails;
1:1 в square/avatar context;
observed cover и contain;
normalized focal/safe-area percentages;
blocked/soft-limit upscaling policies;
semantic fallback chain;
различие desktop background-layer и mobile flow-image поведения EventCard. [P-EVENTMEDIA]
Поэтому candidate ratio vocabulary должен начинаться не с привнесённого 16:9, а с доказанных 3:2, 2:3, 1:1. 16:9 может быть добавлен только если behavioral/media corpus покажет устойчивый genuine consumer.

Рекомендуемый candidate contract:

Consumer	Ratio	Default fit	Crop policy	Upscale
EventCard	3:2	cover	focal-aware	soft-limit/block
EventHero	container/observed source	cover candidate	focal + safe area mandatory при crop	soft-limit
portrait poster	2:3	contain preferred for artwork integrity	crop только explicit variant	block/soft-limit
small gallery preview	2:3 или source-proven ratio	cover	preview-only crop	soft-limit
medallion/avatar	1:1	cover	focal-aware	conservative
artifact/poster artwork	source/artwork ratio	contain	не обрезать meaningful artwork by default	block
rail card	EventCard family ratio	cover	тот же media contract, не новая ratio family	same as family

contain preferred for artwork integrity — inference, а 2:3/3:2/1:1 — project evidence. [P-EVENTMEDIA]

HTML responsive-image contract должен различать:

srcset/sizes — ресурсная адаптация;
<picture> — art direction;
width/height или заранее известный aspect-ratio — резервирование layout geometry;
object-fit — способ вписывания content в box. [N-HTML] [N-CSSIMG] [N-CSSSIZING]

Отсутствующее и ошибочное изображение — разные runtime causes, но они должны сходиться в один semantic fallback family, если продукт не требует отдельной пользовательской диагностики. Для EventCard это согласуется с уже существующим deterministic fallback ordering в source commit и candidate media contract. [P-SOURCE] [P-EVENTMEDIA]

Для tiny source требуется правило, а не магическое исключение: не растягивать бесконечно; использовать soft-limit или fallback, если requested rendered size значительно превышает source. Точный upscale ratio threshold пока не должен становиться token — current contract подтверждает policy kinds, но не достаточный validated threshold. [P-EVENTMEDIA]

Loading, rails, sticky/fixed, selection и motion
Для Astro SSG принципиально важно отделить rendered static content от client/runtime state. Server-generated область, которая уже присутствует в initial document, не имеет genuine initial-loading state и поэтому не должна получать skeleton только ради визуальной унификации. Skeleton имеет смысл лишь для реально асинхронной области с предсказуемой будущей geometry. Это project inference с high confidence.

Candidate state vocabulary:

State	Когда существует	UI rule	Accessibility
static/resolved	SSG content	сразу content	обычная semantics
initial-loading	runtime fetch ещё не дал usable result	skeleton или compact progress, если justified	announce meaningful state, не каждую skeleton row
inline-refresh	content уже есть	сохранять content; local busy indicator	aria-busy/status where appropriate
stale-refresh	usable stale data есть	не заменять content blank state	announce material update, не visual churn
partial	часть данных доступна	render usable content + scoped fallback	error belongs to affected region
empty	запрос успешен, 0 items	domain-specific empty message	не error
error	операция failed	explanation + recovery action	status/alert according to urgency
offline	сеть недоступна и runtime operation needs it	preserve cached/static content	clear non-destructive message
unavailable	ресурс сознательно недоступен	domain state, not retry loop	explain next action
retrying	user requested retry	preserve geometry where possible	avoid repeated noisy announcements

WCAG требует программно доступных status messages там, где соответствующий status появляется без перемещения фокуса; это не означает, что каждый spinner должен быть role="alert". [N-WCAG22] [N-ARIA12]

Optimistic UI следует разрешать только для обратимых действий с rollback semantics. Для event publication/read-only content он не должен существовать просто потому, что такой pattern популярен.

Content rail и carousel должны быть разными contracts. Горизонтальный EventCard shelf, который пользователь скроллит самостоятельно, — это scrollable list/rail, а не автоматически carousel. Carousel semantics и APG obligations появляются только когда есть carousel-specific presentation/rotation controls. [O-APG]

Для rail candidate:

overflow-x:auto; optional scroll-snap-type предпочтительно с ненасильственным/proximity поведением; visible partial-next-card может быть discovery cue; keyboard user должен достигать child links/buttons без drag gesture; desktop previous/next controls, если они нужны, имеют names, boundary states и не являются единственным способом navigation. [N-SNAP] [N-WCAG22]

Focused card/control должен попадать в видимую область. Drag-only interaction недопустим как единственный mechanism там, где функция может выполняться pointer movement; WCAG 2.2 отдельно регулирует dragging movements. [N-WCAG22]

Для nested controls не следует делать одну огромную invisible card link поверх independently interactive buttons. Card title/link и secondary actions должны сохранять независимую focus/activation semantics.

Sticky/fixed layers следует моделировать по semantic layers, а не сразу назначать z-index:9999:

document < sticky-navigation < popover < modal-backdrop/dialog < urgent transient layer.

Конкретные integers могут быть выбраны только после inventory реальных stacking contexts.

WCAG 2.4.11 означает, что sticky header, stacked rail или fixed bottom navigation не должны полностью скрывать keyboard-focused component из-за author-created content. scroll-padding, scroll-margin и calculated insets — возможные mechanisms, но нормативно требуется результат, не конкретный CSS property. [N-WCAG22]

Fullscreen mobile surface должен учитывать mobile browser chrome и safe areas. Для viewport-filling UI уместно исследовать dynamic viewport units, а для edge-attached fixed controls — env(safe-area-inset-top/bottom/...). [N-VALUES] [N-ENV]

Pattern selection для overlays и choices:

Product intent	Предпочтительный primitive/pattern	Нельзя подменять
показать/скрыть дополнительный контент	native details или disclosure	menu
site navigation popup	disclosure/navigation	ARIA menu без application-menu semantics
набор действий	menu button, если действительно menu semantics	listbox
выбрать одно значение из небольшого видимого набора	native radio group / semantically equivalent segmented choice	tabs
выбрать independent booleans	checkbox	switch без immediate-setting semantics
immediate on/off setting	switch	checkbox только ради внешнего вида
выбрать option из списка	native select; listbox only when required	menu
text input + suggestions/options	combobox	plain menu
switch between content panels	tabs	segmented form choice
blocking fullscreen/dialog workflow	modal dialog	generic div with focus trap
non-blocking drawer/navigation	non-modal surface	modal semantics

[O-APG] [N-ARIA12] [N-HTML]

Modal contract: deliberate focus entry, outside content inert/non-interactive, contained Tab sequence, Escape close unless an exceptional destructive workflow has documented rationale, and focus return to logical trigger/context. Non-modal surface не должна получать focus trap только потому, что visually floats. [O-APG]

Outside-click — convenience behavior, не замена Escape и explicit close control.

Motion предлагается нормализовать не в десятки one-off durations, а в четыре candidate bands:

Category	Candidate envelope	Use
immediate	0–100 ms	near-instant state feedback
fast	100–180 ms	tiny UI transitions
standard	180–300 ms	popover/disclosure/small movement
emphasized	300–450 ms	larger surface entrance when genuinely useful

Эти числа — cross-system convention + inference, не WCAG values и не approved tokens. Exit обычно может быть короче corresponding enter, но отношение следует подтвердить actual specimens.

prefers-reduced-motion contract должен удалять или значительно упрощать non-essential large transforms, parallax, auto movement и shimmer; state change при этом должен оставаться понятным. Сам факт наличия prefers-reduced-motion — platform mechanism; конкретный replacement effect является product decision. [N-MQ] [N-WCAG22]

Animation никогда не должна быть единственным carrier state information. Auto-moving content также попадает под WCAG pause/stop/hide requirements при соответствующих условиях. [N-WCAG22]

Component convergence и порядок нормализации
Вместо similarity score нужен semantic-gated decision framework. Некоторые различия являются blockers независимо от визуального сходства.

Decision	Минимальное основание
merge	одна semantic role + совместимая anatomy + одна state machine + один accessibility contract + различия параметризуются
preserve_as_variant	одна semantic role/behavior, но существует конечное доказанное различие geometry/media/density
preserve_as_composition	различие — в assembly уже существующих primitives, а не в их semantics
split	различаются semantics, interaction/state machine или accessibility obligations
preserve_product_pattern	устойчивый domain-specific contract, который неуместно обобщать
deprecate	consumer superseded/unreachable и migration path доказан
archive_experiment	historical treatment без current winner/decision receipt
promote_to_design_system	contract стабилен, genuinely reused, accessible, responsive/content stress пройден, experiment ambiguity отсутствует

Score можно использовать только после semantic gates:

Dimension	Weight suggestion	Blocking condition
semantic role	20	mismatch → no merge
behaviour/state machine	15	incompatible → no merge
accessibility contract	15	incompatible → no merge
anatomy	10	major mismatch → likely split/composition
responsive geometry	10	finite difference → variant; structural difference → split
media behaviour	10	finite mode → variant; different content semantics → preserve
content stress	5	failure blocks promotion
frequency/reachability	5	informs priority, never correctness
experiment status	5	unresolved treatment blocks normalization
migration/maintenance	5	informs sequence, not semantics

Это framework inference, confidence high, потому что он непосредственно закрывает проблемы, уже присутствующие в unresolved.jsonl: contextual-navigation media может выглядеть одинаково, но иметь разные destinations/features; header icons имеют shared geometry при разных actions; artifacts меняют composition между landing и detail page; page-instance override нельзя автоматически превращать в component variant. [P-UNRESOLVED]

Рекомендуемый порядок project synthesis:

Wave	Families	Почему сейчас / gate
A	evidence plumbing + typography raw histogram	прежде любого token choice; загрузить heavy raw records
B	Event media vocabulary	уже имеется unusually strong candidate contract: 3:2/2:3/1:1, fit, fallback, upscale [P-EVENTMEDIA]
C	Button/basic interactive primitives	semantics сравнительно ограничены; проверить target/focus corpus
D	EventCard + event-detail formats	строить поверх normalized media и type-role mapping
E	shared frame/header/footer	требуется закончить header-icon semantic reconciliation
F	rails, sticky/fixed, loading	ждать Behavioral Decoder evidence
G	menus/overlays/selection	ждать actual interaction traces; выбирать pattern по intent
H	transport / medallions / contextual navigation / artifacts	поздно: project evidence прямо содержит unresolved taxonomy/composition [P-UNRESOLVED]
I	experiments	только после metric/decision receipt; иначе archive/freeze

EventCard/EventDetail не следует заставлять иметь одинаковую media composition: current candidate contract уже фиксирует desktop card background layer, mobile flow item и detail gallery flow item как различные placements одного media vocabulary. Это пример того, как нормализация должна сохранять product distinction на уровне composition, нормализуя underlying media roles. [P-EVENTMEDIA]

Практический promotion rule: component может попасть в design-system layer не потому, что появился дважды в CSS, а когда доказаны semantic contract, anatomy/state boundaries, accessibility behaviour, responsive geometry, content stress и хотя бы один meaningful reuse case за пределами случайного duplication. Exact minimum consumer count должен быть product decision, а не универсальным законом.

Машиночитаемые приложения, ограничения и вердикт
Ниже приложения представлены как содержимое файлов. Там, где compact AS-IS evidence недостаточно для обязательного количественного поля, стоит null, NOT_COMPUTABLE_FROM_COMPACT_SNAPSHOT или explicit blocker вместо выдуманного результата.

normalization-charter-candidate.md

markdown
Копировать
# Normalization Charter Candidate

Status: RESEARCH_CANDIDATE
Source snapshot: decoder-v1-snapshot-20260808T124842-4786ac53bc
Source commit: ef7aa62e45c60f7a12da6160f490719c0721ec03

## Evidence precedence

1. Normative accessibility/platform requirement.
2. Official platform/pattern guidance.
3. Verified project semantics and behaviour.
4. Cross-design-system convention.
5. Research inference.

Frequency is not correctness.
Visual similarity is not semantic equivalence.
Different CSS files do not prove different components.
An experiment treatment is not a target without metrics/decision receipt.

## Typography

Separate document semantics from visual roles.
Compare compact, balanced and expressive candidate models.
Do not select tokens until raw typography histogram and fixture coverage exist.
Page titles must tolerate long Russian content.
Clamping is restricted to preview contexts.
WCAG text-spacing values are stress conditions, not default type tokens.

## Spacing and sizing

Use semantic spacing bands before choosing discrete values:
micro 2–4; xs 4–8; sm 8–12; md 12–16;
lg 16–24; xl 24–32; section 32–64 CSS px.

WCAG 2.2 target-size floor is 24×24 CSS px where applicable.
Project touch target candidate is 44–48 CSS px.
Compact controls require an explicit exception and may not violate the
normative target-size contract.

Breakpoints are content/geometry driven, not copied from another system.

## Media

Initial evidence-backed ratio vocabulary:
3:2 event landscape;
2:3 portrait/poster;
1:1 square.

Do not add 16:9 solely because another design system uses it.
EventCard defaults to cover.
Artwork/poster should test contain as the integrity-preserving default.
Use focal/safe-area data for meaningful crops.
Reserve layout geometry before image load.
Use deterministic semantic fallbacks.
Upscaling must follow blocked/soft-limit policy.

## Runtime states

Do not create loading UI for static SSG content without a runtime loading phase.
Distinguish initial-loading, refreshing, stale, partial, empty,
error, offline, unavailable and retrying.
Preserve usable content during background refresh where possible.
Announcements must communicate meaningful status, not decorative animation.

## Interaction

A content rail is not automatically a carousel.
Drag may not be the only usable rail interaction.
Modal and non-modal surfaces have different focus contracts.
Prefer native HTML controls where they express the intent.
Choose disclosure, menu, listbox, combobox, radio, tabs, switch and
checkbox by semantic purpose, not visual treatment.

## Sticky/fixed

Model semantic stacking layers before numeric z-index tokens.
Account for safe areas and dynamic mobile viewport.
Focused content may not be fully obscured by author-created sticky/fixed UI.

## Motion

Candidate bands:
immediate 0–100 ms;
fast 100–180 ms;
standard 180–300 ms;
emphasized 300–450 ms.

These are envelopes, not accepted tokens.
Reduced-motion removes non-essential spatial/autonomous motion while
preserving understandable state feedback.

## Convergence

Merge only when semantic role, behaviour and accessibility contracts match.
Use variants for finite differences inside one semantic contract.
Use compositions when primitives are shared but assembly differs.
Preserve domain patterns where abstraction would erase real product meaning.
Archive unresolved experiments rather than treating a treatment as winner.
evidence-source-matrix.md

markdown
Копировать
# Evidence Source Matrix

| ID | Class | Source/version/date | Confidence | Application |
|---|---|---|---|---|
| N-WCAG22 | normative | W3C WCAG 2.2, REC 2023-10-05 | high | zoom, reflow, text spacing, focus, keyboard, targets, status |
| N-ARIA12 | normative | WAI-ARIA 1.2, W3C REC | high | accessible roles/states when native HTML is insufficient |
| N-HTML | normative/platform | WHATWG HTML Living Standard | high | native semantics, headings, images |
| N-CSSTEXT | normative/spec | CSS Text | high | wrapping/hyphenation mechanisms |
| N-CSSIMG | normative/spec | CSS Images | high | object-fit |
| N-CSSSIZING | normative/spec | CSS Sizing | high | aspect-ratio |
| N-SNAP | normative/spec | CSS Scroll Snap L1 | high | rail snapping mechanism |
| N-MQ | normative/spec | Media Queries | high | prefers-reduced-motion |
| N-ENV | normative/spec | CSS Environment Variables | high | safe-area insets |
| N-VALUES | normative/spec | CSS Values & Units | high | modern viewport units |
| O-APG | official guidance | WAI-ARIA APG; mutable guidance | high | dialog, disclosure, menu, carousel, selection patterns |
| D-USWDS | DS convention | USWDS official docs; version pin required at synthesis | medium | constrained semantic scales |
| D-GOVUK | DS convention | GOV.UK Design System official docs | medium | restrained type/spacing vocabulary, native-first |
| D-CARBON | DS convention | Carbon official docs | medium | productive vs expressive roles |
| D-MATERIAL | DS convention | Material 3 official docs | medium | semantic roles, touch-oriented sizing |
| D-FLUENT | DS convention | Fluent 2 official docs | medium | semantic states/layers |
| D-POLARIS | DS convention | Polaris official docs | medium | bounded task-oriented components |
| D-PRIMER | DS convention | Primer official docs | medium | primitive/composition separation |
| D-SPECTRUM | DS convention | Spectrum 2 official docs | medium | adaptive semantic components |
| P-MANIFEST | project | snapshot manifest; 2026-08-08 | high | source/corpus provenance |
| P-SUMMARY | project | snapshot summary | high | corpus counts |
| P-INDEX | project | artifact-index.json | high | authority/read order/raw pointers |
| P-UNRESOLVED | project | unresolved.jsonl | high | ambiguity/blockers |
| P-EVENTMEDIA | project | candidate.event-media.contract.json | high for AS-IS observation; medium for target use | event media |
| P-README | project | component-decoder README | high | heavy evidence boundary |
| P-SOURCE | project | ef7aa62e45c60f7a12da6160f490719c0721ec03 | high | source implementation |
typography-candidate-models.json

json
Копировать
{
  "status": "candidate_not_tokens",
  "corpus_coverage_status": "NOT_COMPUTABLE_FROM_COMPACT_SNAPSHOT",
  "models": [
    {
      "id": "compact",
      "visual_heading_role_count": 3,
      "roles": {
        "display_or_page_title": {
          "font_size_px": [32, 40],
          "line_height_ratio": [1.08, 1.2]
        },
        "section_title": {
          "font_size_px": [24, 30],
          "line_height_ratio": [1.15, 1.25]
        },
        "subsection_title": {
          "font_size_px": [20, 24],
          "line_height_ratio": [1.18, 1.3]
        },
        "body_leading": {"font_size_px": [18, 20], "line_height_ratio": [1.4, 1.6]},
        "body": {"font_size_px": [16, 18], "line_height_ratio": [1.4, 1.6]},
        "ui_label": {"font_size_px": [14, 16], "line_height_ratio": [1.25, 1.45]},
        "metadata": {"font_size_px": [13, 14], "line_height_ratio": [1.3, 1.45]},
        "caption": {"font_size_px": [12, 13], "line_height_ratio": [1.3, 1.45]}
      },
      "responsive_strategy": "compress upper roles first; body remains stable",
      "approx_adjacent_heading_ratio": [1.2, 1.3],
      "strengths": ["low complexity", "strong long-title resilience"],
      "risks": ["may erase genuine editorial hierarchy"],
      "verified_current_usage_coverage_percent": null,
      "verified_exception_count": null,
      "confidence": "medium"
    },
    {
      "id": "balanced",
      "visual_heading_role_count": 4,
      "roles": {
        "display": {"font_size_px": [40, 52], "line_height_ratio": [1.08, 1.16]},
        "page_title": {"font_size_px": [32, 42], "line_height_ratio": [1.1, 1.2]},
        "section_title": {"font_size_px": [24, 32], "line_height_ratio": [1.15, 1.25]},
        "subsection_title": {"font_size_px": [20, 24], "line_height_ratio": [1.18, 1.3]},
        "body_leading": {"font_size_px": [18, 20], "line_height_ratio": [1.4, 1.6]},
        "body": {"font_size_px": [16, 18], "line_height_ratio": [1.4, 1.6]},
        "ui_label": {"font_size_px": [14, 16], "line_height_ratio": [1.25, 1.45]},
        "metadata": {"font_size_px": [13, 14], "line_height_ratio": [1.3, 1.45]},
        "caption": {"font_size_px": [12, 13], "line_height_ratio": [1.3, 1.45]}
      },
      "responsive_strategy": "fluid or stepped upper hierarchy; body/meta remain constrained",
      "approx_adjacent_heading_ratio": [1.18, 1.3],
      "strengths": ["separates hero/page/section hierarchy", "moderate complexity"],
      "risks": ["must prove fourth role against corpus"],
      "verified_current_usage_coverage_percent": null,
      "verified_exception_count": null,
      "confidence": "medium"
    },
    {
      "id": "expressive",
      "visual_heading_role_count": 5,
      "roles": {
        "hero": {"font_size_px": [48, 64], "line_height_ratio": [1.05, 1.15]},
        "display": {"font_size_px": [40, 52], "line_height_ratio": [1.08, 1.16]},
        "page_title": {"font_size_px": [32, 42], "line_height_ratio": [1.1, 1.2]},
        "section_title": {"font_size_px": [24, 30], "line_height_ratio": [1.15, 1.25]},
        "subsection_title": {"font_size_px": [20, 24], "line_height_ratio": [1.18, 1.3]},
        "body_leading": {"font_size_px": [18, 20], "line_height_ratio": [1.4, 1.6]},
        "body": {"font_size_px": [16, 18], "line_height_ratio": [1.4, 1.6]},
        "ui_label": {"font_size_px": [14, 16], "line_height_ratio": [1.25, 1.45]},
        "metadata": {"font_size_px": [13, 14], "line_height_ratio": [1.3, 1.45]},
        "caption": {"font_size_px": [12, 13], "line_height_ratio": [1.3, 1.45]}
      },
      "responsive_strategy": "strongest compression on hero/display at compact widths",
      "approx_adjacent_heading_ratio": [1.15, 1.28],
      "strengths": ["maximum editorial differentiation"],
      "risks": ["long Russian titles", "higher exception and maintenance surface"],
      "verified_current_usage_coverage_percent": null,
      "verified_exception_count": null,
      "confidence": "low_to_medium"
    }
  ],
  "mandatory_stress": {
    "widths": ["mobile", "tablet", "desktop"],
    "browser_zoom_percent": [100, 200, 400],
    "wcag_text_spacing_override": true,
    "fixtures": [
      "short_title",
      "long_title_2_4_lines",
      "very_long_event_name",
      "mixed_date_time_age_price",
      "long_venue",
      "mixed_script"
    ]
  }
}
as-is-to-type-role-mapping.csv

csv
Копировать
semantic_role,current_values,candidate_role,confidence,exception_reason,evidence_status
unknown_web_heading,"source family observed: t-3xl-bold-15bb54",UNRESOLVED,low,"semantic consumer-level mapping requires raw source-style records",verified_name_only
unknown_penpot_title,"title-medium",UNRESOLVED,low,"Penpot/web coverage and naming unresolved",project_unresolved
unknown_penpot_subtitle,"subtitle--43",UNRESOLVED,low,"Penpot/web coverage and naming unresolved",project_unresolved
ALL_REMAINING_CURRENT_USAGES,UNEXTRACTED_HEAVY_EVIDENCE,UNMAPPED,none,"source-style-records.jsonl and source-computed-heading-records.jsonl must be enumerated before exhaustive mapping",BLOCKER
Это приложение намеренно не симулирует выполнение требования “для каждого usage”. Полное заполнение возможно только после enumeration heavy evidence. Любая более длинная таблица сейчас была бы invented AS-IS data. [P-README] [P-INDEX]

spacing-sizing-target-envelopes.json

json
Копировать
{
  "status": "candidate_envelopes_not_tokens",
  "spacing_px": {
    "micro": [2, 4],
    "x_small": [4, 8],
    "small": [8, 12],
    "medium": [12, 16],
    "large": [16, 24],
    "x_large": [24, 32],
    "section": [32, 64]
  },
  "targets": {
    "normative_wcag_minimum_css_px": [24, 24],
    "project_standalone_touch_candidate_css_px": [44, 48],
    "compact_visual_control_height_px": [32, 40],
    "default_control_height_px": [40, 48],
    "prominent_control_height_px": [48, 56]
  },
  "rules": {
    "breakpoints": "derive_from_geometry_failures",
    "icon_size_is_not_hit_target_size": true,
    "unnamed_spacing_exception_allowed": false,
    "exact_as_is_values_inside_envelopes": null,
    "exact_as_is_values_outside_envelopes": null,
    "verified_exception_count": null
  },
  "evidence": {
    "24px_target": "WCAG_2_2_SC_2_5_8",
    "44_48_project_target": "design_system_and_platform_convention_plus_inference",
    "spacing_bands": "candidate_inference"
  }
}
media-behavior-charter.json

json
Копировать
{
  "status": "candidate",
  "ratio_vocabulary": [
    {"role": "event_landscape", "ratio": "3/2", "evidence": "project"},
    {"role": "portrait_poster", "ratio": "2/3", "evidence": "project"},
    {"role": "square", "ratio": "1/1", "evidence": "project"}
  ],
  "unproven_ratios": ["16/9"],
  "consumers": {
    "EventCard": {
      "ratio": "3/2",
      "fit": "cover",
      "focal_point": "supported",
      "upscale": ["blocked", "soft-limit"]
    },
    "EventHero": {
      "ratio": "source_or_container_evidence_required",
      "fit": "cover_candidate",
      "safe_area_required_when_cropping": true
    },
    "large_poster": {
      "ratio": "2/3_or_source",
      "fit": "contain_preferred_candidate",
      "crop_requires_explicit_variant": true
    },
    "small_preview": {
      "ratio": "2/3_or_observed",
      "fit": "cover"
    },
    "medallion": {
      "ratio": "1/1",
      "fit": "cover",
      "focal_point": "recommended"
    },
    "artifact": {
      "ratio": "source_artwork",
      "fit": "contain_preferred"
    }
  },
  "responsive_images": {
    "srcset": true,
    "sizes": true,
    "picture_for_art_direction": true,
    "reserve_layout_geometry": true
  },
  "fallback": {
    "semantic_deterministic_chain": true,
    "missing_and_broken_may_share_visual_family": true
  },
  "layout_shift": {
    "known_dimensions_or_aspect_ratio": "required_candidate_contract"
  },
  "needed_project_data": [
    "behavioral media supplement",
    "source intrinsic dimensions distribution",
    "focal point availability",
    "actual render size distribution"
  ]
}
loading-recovery-charter.json

json
Копировать
{
  "status": "candidate",
  "states": [
    "static_resolved",
    "initial_loading",
    "inline_refresh",
    "stale_refresh",
    "partial",
    "empty",
    "error",
    "retrying",
    "offline",
    "unavailable"
  ],
  "rules": {
    "skeleton_for_static_ssg_without_runtime_wait": false,
    "preserve_stale_usable_content_during_refresh": true,
    "optimistic_ui_requires_reversible_action_and_rollback": true,
    "empty_is_not_error": true,
    "partial_error_is_scoped": true,
    "retry_must_be_actionable": true,
    "reduced_motion_disables_shimmer": true,
    "avoid_alert_for_non_urgent_loading": true,
    "announce_meaningful_status_changes": true,
    "preserve_layout_geometry": true
  },
  "exact_latency_thresholds_ms": null,
  "needed_project_data": [
    "runtime fetch inventory",
    "observed latency",
    "offline/cache behavior",
    "current announcement behavior"
  ]
}
interaction-pattern-charter.json

json
Копировать
{
  "status": "candidate",
  "native_html_first": true,
  "patterns": {
    "disclosure": {
      "intent": "show_hide_supplemental_content",
      "focus_trap": false,
      "escape_required": false
    },
    "menu_button": {
      "intent": "set_of_actions",
      "keyboard_model": "APG_menu_when_true_menu_semantics"
    },
    "navigation_popup": {
      "intent": "site_navigation",
      "default_pattern": "navigation_plus_disclosure",
      "aria_menu_by_default": false
    },
    "modal_dialog": {
      "focus_entry": true,
      "focus_containment": true,
      "focus_return": true,
      "escape": true,
      "outside_inert": true
    },
    "non_modal_surface": {
      "focus_trap": false,
      "focus_return_when_triggered": "context_dependent"
    },
    "listbox": {
      "intent": "option_selection_when_native_select_is_insufficient"
    },
    "combobox": {
      "intent": "text_input_plus_popup_options"
    },
    "radio_group": {
      "intent": "single_choice"
    },
    "segmented_control": {
      "intent": "single_choice_or_view_switch",
      "semantics": "must_be_resolved_before_component_choice"
    },
    "tabs": {
      "intent": "switch_associated_content_panels"
    },
    "switch": {
      "intent": "immediate_binary_setting"
    },
    "checkbox": {
      "intent": "independent_boolean_or_multi_select"
    }
  },
  "required_cross_cutting_contracts": [
    "accessible_name",
    "role_state_consistency",
    "keyboard_operation",
    "visible_focus",
    "focus_not_obscured"
  ]
}
shelves-sticky-fixed-charter.json

json
Копировать
{
  "status": "candidate_pending_behavioral_decoder",
  "rail": {
    "type": "user_controlled_content_rail",
    "carousel_semantics_by_default": false,
    "horizontal_overflow": true,
    "scroll_snap": "optional_proximity_candidate",
    "partial_next_card": "optional_discovery_cue",
    "drag_only": false,
    "keyboard_reachability": true,
    "prev_next_controls": "where_discovery_or_desktop_use_requires",
    "nested_interactive_overlay_link": false,
    "scroll_restoration": "needs_project_evidence"
  },
  "sticky_fixed": {
    "semantic_layers": [
      "document",
      "sticky_navigation",
      "popover",
      "modal_backdrop_dialog",
      "urgent_transient"
    ],
    "numeric_z_index_values": null,
    "safe_area_insets": true,
    "dynamic_viewport_units_for_fullscreen_surfaces": "candidate",
    "focus_may_be_fully_obscured": false,
    "scroll_padding_or_margin": "possible_mechanism",
    "collision_matrix_required": true
  },
  "collision_cases_to_test": [
    "sticky_header_plus_stacked_rail",
    "sticky_header_plus_popover",
    "fixed_bottom_nav_plus_focused_control",
    "fullscreen_menu_plus_mobile_browser_chrome",
    "zoom_200_percent",
    "reflow_320_css_px"
  ]
}
convergence-decision-matrix.csv

csv
Копировать
dimension,weight,merge_gate,variant_signal,split_signal,promotion_gate
semantic_role,20,"must_match","same role","different role","resolved"
behavior_state_machine,15,"must_be_compatible","finite state difference","incompatible interaction","documented"
accessibility_contract,15,"must_be_compatible","finite equivalent treatment","different obligations","tested"
anatomy,10,"core anatomy compatible","optional finite region","structural mismatch","documented"
responsive_geometry,10,"same model","finite geometry mode","different composition model","stress tested"
media_behavior,10,"same semantic media role","cover/contain or ratio variant","different content meaning","fallback/crop tested"
content_stress,5,"must_not_fail","minor bounded adjustment","systematic failure","fixtures pass"
frequency_reachability,5,"not a semantic gate","priority evidence","not split evidence","genuine consumers exist"
experiment_status,5,"must_be_resolved","approved finite treatment","unresolved experiment","decision receipt present"
migration_maintenance,5,"acceptable risk","bounded migration","high-risk incompatible contract","migration plan exists"
visual_similarity,0,"never sufficient","not sufficient","not sufficient","not evidence alone"
css_file_identity,0,"irrelevant alone","irrelevant alone","irrelevant alone","not evidence"
family-normalization-order.md

markdown
Копировать
# Family Normalization Order

A. Evidence completion
Load heavy typography/style observations and Behavioral Decoder supplement.
Produce current-value histograms and exact usage mapping.

B. Event media
Start from proven 3:2 / 2:3 / 1:1 vocabulary, fit, fallback,
focal/safe-area and upscale contracts.

C. Basic interactive primitives
Buttons and simple controls after target/focus state verification.

D. Event content family
EventCard and detail formats, reusing media and typography roles
without forcing identical compositions.

E. Shared frame
Header/footer/frame only after header icon semantics and page/family
scope are reconciled.

F. Behavioural families
Rails, sticky/fixed and loading after Behavioral Decoder evidence.

G. Overlay/selection families
Choose dialog/disclosure/menu/listbox/combobox/etc. from actual intent
and interaction traces.

H. Domain-specific families
Transport, medallions, contextual navigation, clubs and artifacts remain
late because current evidence contains unresolved taxonomy/composition.

I. Experiments
Archive historical treatments unless a metric-backed winner and
decision receipt exists.
open-product-decisions.md

markdown
Копировать
# Open Product Decisions

- Which of compact/balanced/expressive typography models minimizes
  exceptions after full raw-corpus mapping?
- Is display genuinely a recurring semantic/editorial role or an isolated
  hero treatment?
- Which large Russian titles may be visually clamped in previews, and where
  must full text always remain visible?
- What is the product target above WCAG's 24 CSS px target-size minimum:
  44 or 48 CSS px, and for which control families?
- Which breakpoints correspond to actual geometry failures?
- Does EventHero have a stable ratio family distinct from EventCard?
- Which artwork/posters prohibit cropping?
- What source-resolution threshold triggers soft-limit vs blocked upscaling?
- Which dynamic Astro islands have genuine initial-loading, refresh, partial,
  offline or optimistic states?
- Which horizontal shelves require explicit previous/next controls and
  restoration of scroll position?
- Which mobile navigation surface is modal versus non-modal?
- What are the real sticky/fixed collisions and stacking contexts?
- Which segmented controls are form choices versus view switches/tabs?
- Which treatments in current code are unresolved experiments?
- What consumer count and reachability threshold is sufficient for promotion
  into the design-system repository?
- Which transport/medallion/artifact distinctions are domain semantics rather
  than implementation fragmentation?
research-limitations.md

markdown
Копировать
# Research Limitations

1. The compact Git snapshot indexes but does not contain the heavy raw style
   records and static shots required for exhaustive typography-value mapping.

2. Therefore exact AS-IS typography coverage, exception counts, spacing
   histograms and migration counts are intentionally not fabricated.

3. Behavioral Decoder & Experiment Archaeology v1.1 evidence is required
   before finalizing loading, interaction, rail, sticky/fixed, sizing and
   experiment contracts.

4. Candidate contracts describe AS-IS evidence; they are not approved target
   contracts.

5. Penpot observations are secondary evidence where snapshot reconciliation
   notes report naming/coverage ambiguity.

6. Current unresolved records include icon semantics, transport taxonomy,
   contextual navigation meaning, page-vs-family precedence, instance
   overrides and artifact composition.

7. Numeric typography, spacing, target-size and motion ranges in this report
   are candidate envelopes. They must not be emitted as final design tokens
   until corpus synthesis.

8. Mutable external design-system documentation must be version-pinned during
   project-specific synthesis before any exact external numeric value is used.

9. The Russian fixture assessment here is a charter-level stress specification,
   not a browser-rendered acceptance run.

10. No experimental treatment is treated as winner without metrics or a
    decision receipt.
Наконец, обязательные fixture dimensions для следующего evidence pass должны образовать не отдельные ad-hoc screenshots, а небольшую cross-product matrix: representative Russian strings × 0/1/many collections × landscape/portrait/square/tiny/missing/broken media × mobile/tablet/desktop × 200% text zoom/reflow/text-spacing conditions. Acceptance следует считать по content loss, overlap, focus visibility, layout instability и semantic breakage, а не по pixel-perfect совпадению со snapshot. [N-WCAG22] [P-INDEX]

Исследование уже даёт достаточно оснований не делать несколько опасных вещей: не импортировать чужую scale, не объявлять 44/48 px «WCAG minimum», не сводить 3:2/2:3/1:1 к одному media ratio, не превращать every shelf в carousel, не ставить skeleton перед статическим SSG content, не смешивать navigation disclosure с ARIA menu, не trap-ить focus в non-modal drawer, не объединять artifact/transport/header families по внешнему сходству и не повышать experiment treatment до design-system variant без decision receipt. [N-WCAG22] [O-APG] [P-EVENTMEDIA] [P-UNRESOLVED]

Но требования исследования включают количественное покрытие AS-IS, число исключений и строку mapping для каждого typography usage. Эти результаты нельзя получить из проанализированного compact corpus без индексированного heavy evidence; кроме того, именно отсутствующий behavioral supplement должен дать факты для нескольких самых behaviour-sensitive разделов charter. [P-README] [P-INDEX]

Финальный вердикт: MORE_AS_IS_EVIDENCE_REQUIRED
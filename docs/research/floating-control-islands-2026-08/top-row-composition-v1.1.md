# Floating Islands v1.1 — одна верхняя строка и осмысленная компактизация

Дата: 2026-09-05. Существующий pattern: `pattern.detached-chrome-control-islands`, PR #47. **Документальное уточнение системы, не внедрённый UI и не принятый visual skin.** Родитель — [system-design-v1.md](system-design-v1.md); обязательные upstream-стыки — [release-bindings-v1.md](release-bindings-v1.md). Здесь один владелец новых правил верхней композиции; C1–C6 и их потребители сохраняются.

## 1. Решение владельца и конкретная поправка к v1

Новая первичная постановка владельца в этом разговоре: верхние острова при наличии места образуют **одну строку**, оставляя свободное пространство между собой и по краям. Допустимы сочетания «Заголовок | Полка | Медальон», «Заголовок | Полка | Общее меню», «Заголовок | Полка | компактное меню с тремя точками | Медальон». Острова имеют разные форматы; при сокращении оформления иконка может исчезнуть, а при следующей степени компактности появиться снова. Цель — чистый контентный интерфейс, а не максимальное количество постоянно показанных controls.

**Было → стало:** v1 согласовывал верхние поверхности, но допускал page context, section heading и filter rail отдельными закреплёнными этажами → v1.1 сначала рассматривает их как участников одной общей строки. Второй закреплённый этаж не создаётся автоматически из-за нехватки ширины. Сначала выбираются пригодные компактные представления, затем второстепенная часть возвращается в поток/своё раскрытие. Читаемость и достижимость важнее соблюдения одной строки любой ценой.

Три адресных уточнения имеют приоритет над прежними формулировками:

- **FI-05/09:** shared top-row packing вместо суммы независимых верхних bands; место снизу, composer и nav по-прежнему учитываются общей системой.
- **FI-11:** section context может проецироваться в общий ряд как locator/disclosure, при сохранении единственного настоящего H2 в документе. Не требуется физически переносить H2 из раздела в header. Нельзя клонировать весь heading/control tree, делать второй semantic heading или оставлять два активных экземпляра одного действия.
- **FI-02:** для нового versioned menu candidate разрешено спроектировать компактный trigger и новую связь trigger/panel. Старый moving-parent brand-tag motion остаётся baseline, а не запретом на запрошенную компактизацию. Меняются представление и нужная геометрия открытия; прежние назначения, Auth, содержимое и гарантии закрытия/возврата focus сохраняются. Это не разрешение менять production или вводить произвольный modal/body lock.

Документальное направление владельца принято; конкретные формы, символы, числовая геометрия и варианты ниже — выбранные предложения для candidate/review. Активные A=S=P/release gates и запрет изменения общих foundations/STATUS не отменены.

## 2. Что показало исследование

Источники прочитаны через web 2026-09-05. Это первичные design-system документы, рекомендации W3C и исследования их авторов. Они задают основания и риски, но **не доказывают полезность нового варианта именно на KenigEvents**.

| Источник | Что действительно поддерживает | Наше решение / ограничение переноса |
|---|---|---|
| [R1 — Microsoft Fluent 2, Toolbar](https://fluent2.microsoft.design/components/web/react/core/toolbar/usage) | Однострочная toolbar, overflow вместо автоматической второй строки; смысловые группы и понятные icon labels. | Берём принцип packing/grouping, но не назначаем всей шапке role=toolbar и не копируем office-плотность. |
| [R2 — Adobe React Spectrum, ActionGroup](https://react-spectrum.adobe.com/v3/ActionGroup.html) | Отдельные политики collapse items, collapse labels; выбранная группа при collapse сохраняет признак selection и summary identity. | Density — договор конкретного острова. Исчезновение текста не должно скрыть выбранный фильтр. Это reference API, не новая React-зависимость Astro. |
| [R3 — Google Material 2, Top app bar](https://m2.material.io/components/app-bars-top/android) | Разделение title/navigation/actions, overflow вторичных действий, отказ от уменьшения шрифта ради одной строки. | Исторический донор принципов, не текущая skin authority. Не наследуем blanket hide-on-scroll. |
| [R4 — NN/g, Hidden navigation study, 2016](https://www.nngroup.com/articles/hamburger-menus/) | Исследование 179 участников на шести сайтах выявило риски скрытой навигации. На mobile сравнивались hidden/combo, а не все три условия. | Сохраняем четыре видимых primary destinations. Не переносим проценты исследования на этот сайт и не запрещаем любое compact secondary menu. |
| [R5 — NN/g, Hamburger recognizability, 2025](https://www.nngroup.com/articles/hamburger-menu-icon-recognizability/) | В более новом исследовании распознавания важны знакомый символ, расположение и label; похожие list/filter icons могут путать. Оно не измеряло task-success/time uplift. | Понятность значка отдельно от удобства нахождения функции. `…` не считаем доказанно лучшим главным меню. |
| [R6 — W3C, Disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) | Обычная навигация сайта не требует сложной ARIA menu/menubar модели. | Сохраняем links, disclosure и Tab; геометрическая строка не становится единым keyboard widget. |
| [R7 — W3C, Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | При увеличении/reflow содержание и функции должны оставаться доступными; sticky content не оправдывает потерю доступа. | Flow fallback допустим и обязателен раньше unreadable fixed row. |
| [R8 — W3C, Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html) | Видимая текстовая подпись должна входить в accessible name. | `Меню`/`Меню сайта` и голосовое управление согласованы при смене формата. |
| [R9 — W3C, Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | AA 2.5.8 описывает 24 CSS px и предусмотренные исключения/spacing. | Наши ≥44×44 для основных island controls — более строгая продуктовая цель, не ложное описание всего WCAG AA. |
| [R10 — MDN, Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) | Компонент может адаптироваться по доступному контейнеру, а не только device width. | CSS-first; фактические sibling widths, focus locks и hysteresis дополняет небольшой existing shell adapter. |

Apple HIG Toolbars также был открыт, но substantive текст не извлечён; он **не используется как доказательство конкретных правил**. Не делалось новых интервью/пользовательского эксперимента. Нет исследования, доказывающего, что любая немонотонная смена иконок полезна: предлагаемое поведение допускается только при сохранении идентичности и ясного смысла.

**Вывод:** чистота — это меньше конкурирующих элементов и меньше усилий для понимания задачи. Пустой интерфейс, в котором приходится искать меню и угадывать символы, не является успехом.

## 3. Anatomy: одна строка, отдельные острова

Предпочтительный логический порядок для русского интерфейса:

```text
свободный край  [страница]  промежуток  [полка / её управление]
                промежуток  [меню сайта]  промежуток  [медальон]  свободный край
```

Это **одна горизонтальная полоса**, перенос в схеме — только для чтения документа. Полоса не имеет обязательной общей заливки, рамки или перехватывающего клики substrate. Острова могут быть capsule, небольшим округлым прямоугольником, текстовым контекстом или кругом, а не одинаковыми pills. Высота полосы равна максимуму фактических высот участников, не их сумме.

Состав задаётся реальным consumer. Не создаём медальон ради заполнения четвёртого слота; не ограничиваем систему четырьмя островами. Дополнительные реальные utilities участвуют в том же packing, родственные действия группируются. Примеры без меню допустимы, только когда существующий menu owner остаётся явно достижимым в данной композиции; это не удаление вторичной навигации.

### Три разных смысла «полки»

1. **Небольшая навигационная/фильтрующая полка:** при достаточной ширине в ряд входят её реальные controls. При сокращении остаётся понятный summary и раскрытие тех же функций.
2. **Контекст текущего раздела:** компактное название полки, при необходимости переход между разделами. Не придумывать кликабельность статичному заголовку без задачи.
3. **Полка с карточками событий:** сами карточки остаются в контенте. Вверх попадают только её контекст/уместные controls. Это не фиксированный carousel поверх страницы.

Таким образом, слово «полка» не сужено до любой одинокой иконки и не означает, что весь event rail надо втиснуть в header.

### Иерархия и пустое место

В reading-состоянии ведущая информация — текущая задача/раздел; page locator и общие utilities тише. Один яркий акцент соответствует active state или важному действию, а не отдельный accent на каждый остров. Brand identity остаётся узнаваемой, но не обязана занимать второй фиксированный этаж. Крупный полноценный H1 остаётся в начале страницы; его компактный locator — другая роль, не уменьшение H1 во всём продукте.

Общая группа ограничивается существующим content container, предпочитает естественную ширину и свободные края. Не растягивать острова `justify-content:space-between` по всему FHD ради заполнения пространства; не разносить родственные controls так далеко, что они перестают восприниматься группой. Зазоры — фиксированные/bounded существующие spacing roles. Свободный ресурс не заставляет добавлять иконки и подписи обратно, когда reading-вариант уже понятен.

## 4. Форматы отдельных островов и иконки

Состояние задаётся не глобальным «всем скрыть labels на 768px», а разрешёнными views конкретного участника:

| Участник | Развёрнутый | Компактный | Экстракомпактный / предел |
|---|---|---|---|
| Page context | Полное название, optional полезный identity mark | Короткое проверенное название без декоративной иконки | Текстовый locator остаётся; неизвестная пиктограмма не заменяет смысл страницы. |
| Фильтрующая полка | Реальные варианты/controls и выбранный scope | Текст выбранного scope + раскрытие остальных | Узкий summary, например `Калининград · 2 фильтра`; active restrictions доступны сразу. Не безымянный funnel без контекста. |
| Section context | Полное название + необязательная вспомогательная иконка | Короткий label с сохранённым смыслом | Текстовый context selector; если он не помещается — flow/раскрытие, а не бессмысленный символ. |
| Общее меню | Значок + `Меню сайта` | `Меню` без значка | Один стабильный glyph, в том числе предложенный круг `…`, с именем `Меню сайта` и полными labels внутри. |
| Medallion | Canonical mark с допустимым пояснением | Только canonical mark пригодного размера | Проверенный compact variant того же identity либо перенос в свой контекст/поток. Не микроскопическая копия и не чужой знак. |
| Важное состояние | Понятный текст + meaningful status | Короткий текст/статус, достаточный для действия | Нельзя убрать единственное предупреждение, Stop, dirty state или отличительный признак выбранного режима. |

### Не монотонность иконок, а устойчивость смысла

Допустимая цепочка для одной и той же функции:

```text
[значок + «Меню сайта»] → [«Меню»] → [значок меню]
 icon + label             label       icon
```

Иконка действительно исчезает и возвращается. Но `semantic_id`, функция, scope, accessible name и panel target не меняются. В последнем формате не выбирается новый символ только потому, что он визуально меньше. `full/compact/glyph` — совместимые views одного action, не разные actions.

Различать **декоративную** иконку, **идентификатор действия**, **признак disclosure/selection/status** и **identity medallion**. Первую можно убрать рано; последнюю нельзя заменить generic star. Caret при раскрытии и выбранный state не обязаны исчезать вместе с декоративным значком. В раскрытом меню текстовые labels возвращаются всегда, даже если trigger — только glyph.

Hover/focus tooltip помогает desktop, но не является единственным объяснением для touch. Icon-only допускается для знакомого action в понятном месте. Неизвестную функцию оставляем текстом, а не рассчитываем на long-press. У visible label и accessible name должна быть согласованная формулировка; внутри SVG `aria-hidden`, когда имя задаёт сам control. Ни один compact variant не получает новый положительный tabindex.

### Три точки или значок меню

Предложение владельца с `…` сохранено как допустимый extra-compact вариант. **В одинаковом hit box `…` и hamburger не экономят разное количество места.** Это выбор смысла и узнаваемости.

Выбранный рабочий путь: label `Меню` пока он помещается; при pressure — один согласованный glyph global menu, `…` включён в пару для owner/usability review. Четыре primary destinations остаются в нижнем nav, поэтому верхнее меню в этом режиме собирает дополнительные разделы и сервисные действия. Внутри оно явно озаглавлено `Меню сайта`, а не `Действия с текущей полкой`. Если верхний trigger окажется единственным входом в primary navigation конкретного consumer, безусловно прятать его за неоднозначными точками нельзя: нужен label либо другой проверенный navigation presentation.

Не рисовать рядом два неразличимых `…`: один для полки и один для сайта. Контекстное раскрытие получает собственный label (`Разделы`, `Фильтры`, выбранный scope), а глобальное сохраняет стабильное место. Не менять hamburger на точки при каждом повороте; выбранный glyph один на согласованный variant.

### Медальон и его принадлежность

Медальон принадлежит странице, текущему section либо конкретному событию — scope задан явно. Он не меняется автоматически на знак случайной карточки под курсором. При scroll разделов разрешён source-backed section medallion; при выборе старой Search базы displayed scope и refinement base по-прежнему различаются.

Верхний медальон сохраняет canonical asset ID/provenance и реальный readable-size variant. Детальный seal не масштабируется бесконечно вниз ради ряда. Неинтерактивный mark не получает fake button semantics; интерактивный сохраняет action и достаточный hit box. Если есть несколько допустимых marks, их порядок/выбор определяет существующий owner, а не layout-алгоритм по привлекательности. Остальные доступны в своём обычном контексте.

## 5. Как выбирается одна строка

### Геометрический договор

Для width `W` доступный бюджет:

```text
L = max(existing edge gap, safe-start)
R = max(existing edge gap, safe-end)
B = min(W − L − R, existing content-container capacity)
fit = Σ фактических ширин выбранных views + Σ межостровных gaps ≤ B
row height = max(фактических высот views)
```

Все размеры — в одной CSS-pixel системе координат FI-08. Safe area применяется один раз. Визуальный glyph может быть меньше hit box; именно controls, читаемый текст, border/focus и выступающие части определяют нужный бюджет. Верхняя полоса не получает высоту по невидимым измерительным nodes.

Пространство снаружи группы делится по существующему выравниванию content container; centered cluster — стартовый review вариант. Стабильный envelope/слоты выбранного row profile сохраняются между обычными section/status updates, чтобы menu не ездило влево-вправо из-за каждого нового заголовка/счётчика. При смене profile ожидаемое перемещение допустимо только на безопасной границе взаимодействия.

Числа **12px края, 8px зазоры, 16px запас для обратного расширения** в offline model ниже — искусственные проверочные inputs, не принятые tokens. Для actual candidate берутся measured existing spacing/target/font bindings. Предлагаемый обычный visual row порядка 48–64 CSS px требует проверки на реальном шрифте, медальоне и large text; это не фиксированная высота, обрезающая содержимое.

### Два независимых измерения

`reading|overview` — режим задачи; `full|lean|compact|flow` — степень доступной геометрии. Desktop не означает full. По умолчанию для чтения предпочитается **lean: понятные текстовые labels без повторных иконок/метаданных**. Развёрнутый вариант нужен, когда реально полезны подробности/выбор, а не потому, что ширина позволяет заполнить экран.

### Детерминированная последовательность

1. Выбрать фактические роли, required scope/state и permitted views. Удалить только несуществующие роли, не пустые placeholders с фиксированной шириной.
2. Сохранить активные input/focus/hold/open-menu locks. В этом состоянии косметическое переупаковывание не запускается.
3. Попробовать подходящий lean/full profile в одной строке. Порядок ролей не меняется по их ширине или личной статистике.
4. Убрать повторные count/декоративные marks, применить explicit short labels; сгруппировать связанные controls. Нельзя обрезать цену/отрицание/дату/город, делающие выборку отличимой.
5. Применить доступные icon/summary views. Compact одного участника не заставляет всех остальных стать glyph-only.
6. Если смыслы не помещаются, вернуть необязательный medallion/secondary control в его собственное раскрытие или поток, затем развернутую полку туда же. В верхнем ряду оставить понятный page/scope locator и global entry.
7. Если и минимальный ряд мешает читаемости при zoom/landscape/keyboard, использовать обычный flow с читаемым reflow. Не добавлять постоянный второй fixed этаж, горизонтально прокручиваемую шапку, tiny controls или clipping.

Ни одна из ступеней не удаляет функцию: в candidate registry хранится, **где она стала доступна**. Safe stop/cancel, несохранённое действие и critical scope нельзя отправить в неочевидное вложенное меню. Допускается дополнительная краткая строка текста внутри одного острова в измеренном row band, но не автоматический wrap нескольких самостоятельных island rows. User-opened panel — временное раскрытие, не второй постоянно закреплённый этаж.

### Стабильность

Уменьшение при реальной нехватке места происходит сразу после безопасного завершения текущего gesture; обратное расширение — с запасом/hysteresis. Колебание ширины на 1px не заставляет значки мигать. Hover показывает tooltip, а не расширяет весь ряд под указателем. Смена scrollbar, font load, badge count и incoming result не превращаются в перестановку всего chrome.

Pointer-held/IME/open disclosure не переносятся между DOM-копиями. Если resize физически делает current gesture target недоступным, interaction отменяется без исполнения чужого action, затем layout пересчитывается. Фокус остаётся на том же живом control либо переносится в его понятный доступный counterpart до скрытия прежнего. Simple model проверяет только решение `cancel-before-relayout`, не доказывает browser dispatch.

## 6. Section context в общей строке: без ловушки DOM

**Выбранный implementation approach:** actual H1/H2 остаются в semantic document flow. Общий row получает `page/section locator` и, где есть задача, единственный `context disclosure`. Locator — не ещё один H2. Если это только визуальное повторение существующего текста, оно исключается из повторной AT-озвучки; если это отдельная кнопка перехода/выбора раздела, она имеет собственное action name, например `Разделы страницы. Сейчас: …`, а не heading role.

Section owner публикует `scope_id`, title/short-title, boundary/sentinel и разрешённые context controls. Один existing scroll owner выбирает active section по reading boundary **под фактической верхней полосой**, с восстановлением вверх. Full query/answer/cards не копируются. Исходные section headings доступны поиску по странице, deep links, screen-reader heading navigation, no-JS и печати.

Для реальной фильтрующей полки controls создаются единственным владельцем и имеют одну активную presentation. Нельзя одновременно оставить кликабельные копии `Все / Калининград / …` в header и под ним, рассинхронизировав selection. При сжатии collapsed panel показывает те же функции с теми же action IDs и текущим scope. Если существующая family не поддерживает такое переключение, это её versioned adapter/task в P1, а не повод собрать второй набор кнопок на странице.

Geometry row ↔ active-section detection не образуют feedback loop: сначала определяется row envelope, затем единый observer boundary; write не вызывает новое расширение из того же scroll tick. Семантический selector не считает overlay scroll новой page section. Original v1 section-contained sticky остаётся допустимым для явно немигрированного consumer, но его нельзя одновременно включать под shared row и получать новый лишний этаж.

## 7. Меню, раскрытия и переходы

Compact trigger всегда открывает **тот же глобальный набор назначения**, не переключается с `Меню сайта` на `Действия полки` в зависимости от свободного места. Backend/Auth/state controller не копируются. Для новой view меняется только presentation, в следующей версии затронутой family.

Рабочий candidate: на desktop non-modal disclosure ограничен effective viewport и привязан к стабильному trigger; на mobile presentation использует существующую нижнюю non-modal surface, сохраняя ясные title/close и reachable content. Это view adapters одного disclosure owner, не два меню. Нативные `details/summary` либо соответствующая existing disclosure implementation сохраняют links/Tab; ARIA `menu` не назначается ради внешнего вида.

Trigger остаётся в своём row slot при открытии: механически заставлять кружок ехать вместе со старой большой brand-plane не требуется. Это явный v1.1 delta к donor motion, не скрытая same-version правка. Закрытие — явный close/trigger, Escape, переход и outside action согласно owner; существующий scroll-close не закрывает длинное меню от его **внутренней** прокрутки. Background page-scroll behavior согласуется отдельно с немодальной семантикой. Другая настоящая modal/gallery по-прежнему имеет собственный focus/interaction приоритет FI-14–16.

Одновременно открытое новое disclosure закрывает прежнее только через его lifecycle, без потери dirty input. При active capture blocking overlay требует capture handshake, а не скрытия Stop. После закрытия фокус возвращается инициатору. Перекрытия, timer pause, unknown receipts и optional analytics OFF остаются по FI/RB; новый верхний ряд не отменяет эти правила.

## 8. Примеры и применимость

Ниже proposals, а не screenshots нового runtime. Медальон добавляется только при действительном page/section binding.

```text
Полный смысл, достаточно места:
[Популярное]  [контекст полки + доступные фильтры]  [Меню сайта]  [mark]

Чистый reading-вариант:
[Популярное]  [Набирают популярность]  [Меню]  [mark]

Компактно, те же действия:
[Популярное]  [текущая полка / фильтры]  […]  [mark]

Узко, mark доступен в контексте, а не уничтожен:
[Популярное]  [текущая полка ▾]  […]
```

`Набирают популярность` — предложенный короткий locator текущей полки, не изменение её ranking definition; перед visual acceptance это поле подтверждается у owner. Короткие labels — явные данные, не LLM-пересказ runtime и не обрезка по `max-length`. Для «Бесплатно с детьми» нельзя оставить только «Бесплатно», а для «не концерты» убрать отрицание.

C1/C2 (Home/listings/Popular/calendar/collection): row по фактическим page context, time/filter rail и section. Calendar сохраняет дату и enabled-days contract. Не дублировать bottom date accessory новой top rail без явной consumer migration. C3 singleshelf: в row её управление/контекст, не все карточки. C4 Search: текущий читаемый section не становится refinement base; composer показывает выбранную базу отдельно, row её не переназначает. C5 event: уместный page/event medallion и title; CTA/nav XOR и hero/crop сохраняются. C6 information/forms: минимум необходимых roles, не искусственная полка. Подробный общий census — [consumer matrix](consumer-matrix-v1.md).

## 9. Actual source, куда интегрировать

Fresh-read: #47 остаётся open draft, исходный HEAD этого уточнения `4af505fea7d2ca4351db9c6d9bb8bd241bdc31c0`. Текущий прочитанный STATUS сообщает executable/public candidate `2fe28b1f831ac607c0415a8aa6c2beab9eb67fac`, version22, а не прежний 0b08. Это receipt сведения, не новая личная browser проверка.

| Проверенный source @2fe28b1… | Что важно для v1.1 |
|---|---|
| `site/src/layouts/EventLayout.astro`, начало файла | Существующие shell imports, explicit modes и route derivation сохраняются; не появляется второй layout owner. |
| `site/src/components/Reference4MobileMenu.astro`, 1–110 | Реальный trigger — `details/summary` brand-tag; contents включают sections, submenu и service actions. Новый glyph не считается уже существующей menu view. |
| `site/src/components/listings/ListingDiscoveryRail.astro`, полностью | DOM marker v5; date-context script сравнивает rail.top с header.bottom и breakpoint 981. Это конкретное предположение «rail ниже header», которое нужно заменить в migrated shared-row варианте, не оставить второго writer. |
| `site/src/components/EventTokenMedallions.astro`, 1–145 | Реальные organizer/source/program/badge identities, evidence, short labels и layout roles. Иконка `info` не является универсальной заменой medallion. |
| `site/src/components/design-system/SemanticIcon.astro`, полностью | Единая four-role icon-size система и `Icon` delegate. В локальном semantic перечне `…` не найден; полный delegate/asset registry здесь не проаудирован, поэтому **не утверждается отсутствие** canonical dots asset во всём проекте. |

Before materialization resolve exact `menu glyph` asset/viewBox/hash у существующего icon owner. Если binding отсутствует, candidate отмечается BLOCKED для этого visual variant; для работы остаётся текстовый `Меню`. Нельзя брать Unicode ellipsis в Penpot вместо canonical icon и объявлять A=S=P. В текстовых схемах документа `…` — notation, не asset.

## 10. Изменение первого пакета реализации

**FI-P1 теперь включает top-row composition, а не добавляет section context ещё одним этажом.** Первый реальный consumer остаётся Popular. В нём проверяются как минимум: page locator + реальные context/filter controls + один global menu trigger; дополнительный medallion только при valid source. Four-role packing проверяется ещё и на подходящем consumer/явно marked layout fixture, без фиктивного Popular medallion.

Работа: existing EventLayout coordination → variant views текущих owners → explicit short labels/essential scope → scoped active section → one-row fit и pressure fallback → shared lower surface/keyboard compatibility → S projection. Изменяется существующая family version/candidate registry; не создаются per-page CSS z-index, второй menu/card builder или новая foundation scale. Общий [FI-P1](implementation-package-1.md) и его FI/RB guards сохраняются.

### A=S=P review input

Для каждого actual fixture exporter должен дать: exact source/corpus/clock, route/C1–C6, profile/view IDs каждого острова, semantic/action/scope IDs, короткий и полный labels, selection/receipt/activation states, canonical asset hashes, text/icon visibility, rects/hit boxes, moved-to-flow target, top-row occupied union, viewport/DPR/scale, component versions и comparison baseline. Новые properties дополняют существующую source-bound projection; очередной независимый materializer не нужен.

Изолированные baseline/candidate pairs: Popular full/lean/compact; реальная длинная date/filter label; подходящий medallion consumer; Search viewed≠refinement; zoom/reflow; open menu/focused filter; фото/плакат underlay только при существующем проверенном C5 fixture. P — native linked variants, не нарисованные похожие кружки. Состояния размеров указываются конкретно, не одна мобильная картинка на все экраны.

## 11. Проверки и owner research

Новые top-row cases расширяют existing FI-P1/RB scenarios, не требуют полного декартова произведения всех архетипов:

| Сценарий | Given → When → Then / владелец |
|---|---|
| Row versus extra tier | Page+section+filters → migrated C2 scroll → одна occupied top band, немигрированный rail не закрепляется вторым этажом. Shell/section, L1. |
| Independent views | Разная ширина участников → resize → каждый выбирает допустимую view, не all-labels-off. Shell/family, L0/L1. |
| Icon→text→icon | Одна menu action → full/lean/glyph → icon visibility меняется, action/target/scope/name неизменны. Menu/icon owner, L0/L1/native projection. |
| Scope preservation | Длинная дата/город/«бесплатно с детьми»/отрицание → compact → ограничения не исчезают; нет glyph-only бессмысленного title. Feature+layout, L1. |
| Menu identity | Global и section disclosure → открыть оба последовательно → явные разные labels/содержимое, нет двух неопределённых `…` и nested overflow ради ширины. L1 + usability. |
| One semantic heading | Active section меняется down/up → row locator → H1/H2 order и deep links сохранены, нет второго heading/action tree. L1 + AT. |
| Stable target | Badge/title update, hover, ±1px, open menu/focus/IME/hold → relayout → нет дрожания/подмены target; forced invalid gesture отменён. L0/L1. |
| Medallion integrity | Exact source mark → compact/flow → тот же identity; читаемость/asset hash, own scope и доступность пояснения сохранены. S/P/visual. |
| Empty space hit testing | Свободный промежуток/край строки → pointer/wheel → underlying content доступен, shadow/host не создают hit plane. L1. |
| Pressure and accessibility | 320, landscape, 200% text/400% zoom/keyboard → fit fails → readable flow, не clipping/tiny targets/лишние sticky rows. L1 + L2 keyboard subset. |
| Source versus defaults | CSS/font/asset revision меняется → exporter → новые реальные widths и geometry, не синтетические размеры модели. L0 + visual. |
| Existing behavior | OFF/unmigrated consumers/nav+CTA/receipt/hides/analytics off → обычные действия → прежние FI/RB гарантии, нет нового backend/telemetry. Existing L1/regressions. |

Короткая qualitative проверка на 5–8 участниках — **предлагаемый этап**, не проведённое исследование или статистически достаточный A/B test. Дать без подсказок задачи: назвать текущую страницу/полку; найти другой раздел сайта; изменить фильтр; понять знак медальона; вернуться к предыдущей полке. Сравнить label `Меню` и compact glyph при одинаковом контенте, чередуя порядок вариантов. Фиксировать first-click errors, успешность/время задач, ошибку scope и субъективную перегруженность. Количество кликов по скрытому меню само по себе не успех. Регресс понимания или потеря действия блокирует выбор, даже если строка стала ниже. Чистоту владелец оценивает на actual paired screenshots, не по synthetic rectangles.

## 12. Реальные проверки этого уточнения и их границы

GitHub read выполнен; primary web research выполнен. **Browser и Penpot actual calls в этом ходе вернули `FORBIDDEN: This conversation does not support developer MCPs`.** Обхода через другой browser/Penpot API не выполнялось. Нет новых screenshots, native file/page/revision, телефонной клавиатуры или A=S=P evidence. Previous-turn captures сохраняют только прежнюю ограниченную ценность и не выдаются за проверку v1.1.

Приложен [top-row-model.py](top-row-model.py): offline reference model с искусственными ширинами. Локально выполнены **14 unit tests**, включая sweep целых ширин 160–1920, one-row fit/зазоры, safe area один раз, height=max, icon→text→icon при сохранённом action, hysteresis, locks/forced-cancel и отрицательные cases. Пример при этих inputs: 390px вмещает четыре роли в compact, 320px переносит medallion в flow, 1920px reading остаётся lean. Это проверка арифметики/решения модели, **не доказательство**, что реальные длинные названия и медальоны сайта влезают при тех же размерах.

Модель не является shipped runtime, browser observer, acceptance-test implementation или финальной типографикой. При реализации реальный harness должен проверить DOM, interaction, доступность и S/P на source-bound fixtures. Production, общие foundations и STATUS в этом уточнении не меняются.

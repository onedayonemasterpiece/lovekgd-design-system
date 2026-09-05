# Floating Islands — композиция, уточнение владельца v1.2

Дата: 2026-09-05. Существующий pattern `pattern.detached-chrome-control-islands`, PR #47. Путь файла сохранён для существующих ссылок; **текущая revision 1.2**, прежняя [v1.1@eb330959](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/eb3309591be368d729ea52c90b6ef99d1acbad6b/docs/research/floating-control-islands-2026-08/top-row-composition-v1.1.md) — история. Общая система: [FI-01–20](system-design-v1.md); продуктовые стыки: [RB-01–03](release-bindings-v1.md). Эта revision адресно меняет composition rules ниже, не отменяет A=S=P/release gates.

## 1. Общее брендовое меню не меняется

**«Полюбить Калининград Анонсы» — неизменяемый внешний участник компоновки. Оно не сжимается, не заменяется кружком с точками, не меняет свой вид/место при scroll, resize, смене раздела или появлении соседнего острова по правилам Floating Islands.** Его существующее собственное открытие/закрытие не отключается.

**Было → стало:** v1.1 разрешал compact/glyph trigger и смену motion глобального branded menu → прямое уточнение владельца исключает это меню из адаптивной системы. Оно сохраняет baseline source/geometry/interaction. Для layout допустимо читать его occupied rect, но нельзя изменять его DOM, styling, state или расположение. Все предложения v1.1 и FI-02 о новой presentation branded global menu отменены в этой части.

Не требуется ещё одно меню вместо него. Контекстные disclosures полки/городов имеют собственный scope и не называются global menu. Четыре primary destinations нижнего dock остаются общей навигационной моделью.

## 2. Общая верхняя композиция

Остальные подходящие острова по возможности образуют **одну строку** вокруг зарезервированного места бренда. Свободные промежутки и края являются частью дизайна; общего непрозрачного прямоугольника вокруг всех участников не требуется. Не растягивать соседние controls на всю ширину экрана только ради заполнения.

```text
[неизменяемый бренд]    [контекст страницы / медальон]    [города / контекст полки]
```

Это схема ролей, не обязательные три элемента на каждой странице. Пустые роли не монтируются. Дополнительные имеющие смысл utilities участвуют в геометрическом договоре. Внутри одной задачи related controls группируются; карточки событий остаются в контенте, не переносятся целой полкой в fixed header.

Бюджет строки учитывает **фактическое** место бренда, safe-area, доступную ширину и hit areas остальных controls. Высота — максимум занятых областей одного ряда, а не сумма независимых sticky этажей. При нехватке места сначала сокращается повторное оформление, затем разрешённые views и secondary controls переходят в своё раскрытие/flow. Бренд не является последней жертвой сжатия. При zoom/малой высоте readable flow лучше tiny controls или обрезки смысла.

Full/lean/compact — независимые views участников, а не глобальное «на mobile скрыть все labels». Для чтения lean с короткими понятными подписями может оставаться базовым и на широком экране. Свободная ширина не требует возвращать всю декорацию.

## 3. Медальон может сам быть островом идентичности

**Допускается semantic replacement, не только уменьшение двух дублирующих элементов.** На точной подборке «Бесплатные события» canonical медальон `0 ₽ / бесплатно` может один представлять page context; отдельный floating title в этом состоянии не нужен.

Условия замены:

- полная эквивалентность смысла, явный route/scope binding и тот же canonical asset;
- отсутствие дополнительного значимого ограничения, которое знак не передаёт;
- сохранение настоящего H1, title документа, доступного имени и navigation/action semantics;
- удаление пустой подложки прежнего острова и второго compact-медальона, а не только скрытие текста;
- весь знак и hit area видимы; область прежнего широкого title не остаётся невидимой преградой.

«Бесплатно с детьми», «Бесплатно на побережье», дата/город/отрицание не эквивалентны одному `0 ₽`. Дополнительный scope остаётся текстом или собственной осмысленной частью контекста. Медальон конкретного организатора не становится автоматически названием любого раздела. При нехватке asset/readable-size binding текстовый вариант остаётся fallback, не generic звезда/Unicode вместо настоящего знака.

Первый code candidate использует только exact Free route без дополнительных query-параметров. Это консервативный предварительный predicate, не долгосрочный запрет tracking params. Его нельзя распространять на дочерние подборки по substring-match.

## 4. Города: из компактного острова в прямоугольный выбор

Компактный trigger показывает текущий смысл: `Все города`, название единственного выбранного города, `Города · N` либо `Города не выбраны`. Название не обрезается до неразличимого остатка. Иконка pin и caret помогают распознать выбор; их размеры принадлежат существующей icon-role системе.

Открытая форма — **прямоугольная карточка выбора**, а не бесконечно вытянутая исходная полоса. Внутри: заголовок «Города», явное закрытие, те же варианты с checkbox state/count и понятная подпись способа применения. До двух колонок на достаточной ширине, одна при очень узком viewport. Большой список может прокручиваться внутри доступной высоты, но controls закрытия и выбранное состояние достижимы.

Первый вариант сохраняет существующее **немедленное** применение. Не добавляется кнопка «Применить» поверх controller, который уже изменил выдачу. Закрытие не сбрасывает selection. Escape/close возвращают focus к trigger; outside dismiss не перехватывает focus открываемой другой поверхности. На слишком малом effective viewport прямоугольник раскрывается в потоке, без обрезки. No-JS показывает исходную полку.

Source implementation **перемещает оригинальный fieldset** внутрь того же controls owner, не клонирует чекбоксы и не создаёт второй фильтр. Сохраняются existing state, storage, counts, hidden/empty rules и labels. Native popover — одна из presentation mechanisms, не новый modal или глобальное меню. Во время открытого выбора/IME/focus cosmetic relayout не подменяет targets.

## 5. Иконки и допустимая компактизация

У подходящего контекстного action допустима цепочка `icon+label → label → icon`, когда action/meaning/scope/name остаются теми же. **Это больше не относится к защищённому брендовому меню.** Различаются decorative icon, action identifier, selection/disclosure/status и identity medallion.

Неизвестный glyph не заменяет смысл title или активного ограничения. Tooltip не единственное объяснение touch-control. В раскрытой поверхности возвращаются понятные подписи. Рядом не появляются два неразличимых `…` с разными scopes. Primary touch targets ориентируются на существующее ≥44×44 product requirement, не на размер рисованной пиктограммы.

H1/H2 остаются в semantic flow. Floating page/section locator либо отдельный context action не является вторым heading и не клонирует все controls раздела. Viewed section, refinement base и pending Search draft остаются независимыми. Exact hides и frozen prefix по RB продолжают действовать при всех views.

## 6. Desktop нижний dock — отдельная presentation

**Одна navigation model не означает одинаковую mobile/desktop геометрию.** Сохраняются destinations/resolver/aria-current, keyboard semantics и правила modal/CTA suppression. Разрешён отдельный desktop-вариант: крупнее icons/labels, иное расположение подписи, подходящая ширина/поля, лучшее отделение от светлого контента/плакатов/тёмных карточек.

Первый проверяемый design choice: opaque existing surface, existing strong border/elevation roles, подпись рядом со значком, canonical `feature=32px`, более широкий округлый прямоугольник. Числа640×80 — **размер полученного draft specimen**, не новое обязательное foundation правило. В исходном comparative specimen dock480×66. На mobile candidate не меняет прежнюю geometry.

Заметность проверяется не только размером: контраст текста/active state, отделение от разных подложек, focus, отсутствие перекрытого last CTA и попадание pointer. Не увеличивать z-index поверх gallery/modal, не делать пульсацию/постоянное движение ради внимания. Более сильная рамка — сравниваемый preliminary skin, не уже принятое владельцем окончательное оформление. Его сомнение о незаметности старого dock не выдано за измеренный повсеместный дефект.

## 7. Стабильность, accessibility и runtime ownership

Сохраняются FI-07–17: один existing layout owner, readonly occupied rects, safe-area один раз, no invisible hit plane, protected pointer/focus/IME, controlled hysteresis, native field input и scope-aware scroll. Новая геометрия нижнего dock требует переизмерения existing lower-stack owner, а не отдельной суммы keyboard height/offset.

Новая page identity не перемещает бренд. Открытие другого modal/gallery приостанавливает конфликтующие controls через их lifecycle, не оставляет скрытый Stop. Нельзя сломать open-close brand menu, называя его «статичным». Нельзя разрешить whole-site hide-on-scroll из-за правила сжатия contextual row.

Visual source bindings включают canonical asset, view/role, full/short/accessible label, semantic equivalence reason, exact geometry и перемещённый original control. Для desktop icons фиксируется effective role, не только mobile default. A=S=P требует реальных resolved S и native linked P; screenshot или новый JSON-marker не закрывает lineage.

## 8. Первый фактический код и проверенные границы

Создан [draft events-bot-new#638](https://github.com/onedayonemasterpiece/events-bot-new/pull/638) в `work/floating-islands-owner-preview-20260905` от9bed6f5c20078f9ec934e817662d9dbbba2bd8eb. Adapter включается только на non-production `preview-islands-*`; `?islands=off` сравнивает исходное представление. Production, брендовые source files, EventLayout, shared foundations и STATUS этим кодом не менялись.

Первый [CI run33964702848](https://github.com/onedayonemasterpiece/events-bot-new/actions/runs/33964702848) реально сгенерировал Popular и Free через **существующий local:focused runner**, отдельно на committed fixture corpus с clock2026-07-23. Оба jobs success. Chromium149.0.7827.55 проверил390×844/1280×800/1920×1080: brand geometry, H1, nav links, city open/select/close/Escape и desktop icons. Это **DIAGNOSTIC_PASS_NOT_ACCEPTANCE**, не свежий production snapshot, не Kaggle owner preview и не native P.

ZIP artifacts лично получены/hash-verified, JSON/скриншоты прочитаны. На первом mobile Free screenshot обнаружена оставшаяся прямоугольная подложка предыдущего title, которую initial tests не ловили; отправлена source correction `ccde8553b1472a04e5e54a98624585c53c9e808c` с новыми assertions прозрачности, ширины/границ medallion и неизменности бренда при scroll. Её terminal evidence берётся из #638, не предполагается по первому run.

15 pure/source Node tests — отдельно от browser cases. До полной интеграции остаются family/impact/scenario регистрации, полный one-row variant, актуальный same-corpus Kaggle preview, native P и visual owner review. Исходные карточки/кроп/full-pool framing в draft не перепроектировались.

Установленные my-data-hub/browser/Penpot не предоставили callable methods в текущем окне. Генерация/скриншоты получены через разрешённый read-only GitHub diagnostic, **не обходом publication authority**. Публичной новой интерактивной ссылки пока нет. Единственный опубликованный путь остаётся Kaggle StaticSiteBuilder; нельзя переименовать локальный dist или диагностический CI в опубликованный owner preview.

## 9. Research и приёмка

Первичное исследование Fluent toolbar, Adobe ActionGroup, Material historical top app bar, NN/g navigation recognition, W3C disclosure/reflow/label-in-name и MDN container queries сохранено в [предыдущем immutable тексте §2](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/eb3309591be368d729ea52c90b6ef99d1acbad6b/docs/research/floating-control-islands-2026-08/top-row-composition-v1.1.md#2-что-показало-исследование). Оно обосновывает принципы, не отменяет новое прямое решение владельца и не доказывает usability здесь.

Дополнение к existing tests: brand DOM+rect/state invariance во всех migrated views; exact Free equivalence и richer-scope negative cases; отсутствие пустой плоскости title; original checkbox identity/selection/persistence; rectangle viewport/focus/close; distinct desktop/mobile dock and last-action reachability; source-bound responsive icon identity; receipt/hide/analytics OFF regression. Не создавать второй QA framework или угадывать PASS по числу таблиц.

Приёмка черновика начинается с **реальных generated-page screenshots и действий на actual candidate**, не с ещё одной коллекции абстрактных прямоугольников. Полный rendered интерактивный preview нужен следующим продуктовым результатом; документы и CI diagnostics его не подменяют.

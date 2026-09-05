# Floating Islands — актуальная композиция v1.3

2026-09-05. Pattern `pattern.detached-chrome-control-islands`, существующий PR #47. Путь сохранён для входящих ссылок; текущая редакция **1.3**. [Core FI-01–20](system-design-v1.md), [release bindings RB-01–03](release-bindings-v1.md), [потребители](consumer-matrix-v1.md) продолжают действовать. Здесь адресные owner amendments, не второй конвейер или критерий A=S=P.

## 1. Нижний остров: последнее решение владельца

**Один цельный нижний floating island, стилистически ближе к macOS. Не отдельные острова-иконки и не ряд самостоятельных плиток.** Предыдущая формулировка исполнителя «отдельные блоки» была ошибочной интерпретацией и отменена уточнением владельца.

Широкий desktop-вариант 640×80 с сильной рамкой, боковыми подписями и feature32 icons **отклонён**, несмотря на технические проверки. Его стили удалены из текущего draft #638; прежний внешний вид нижней навигации восстановлен. Не переносить эту skin в integration по старым PASS-скриншотам.

Направление последующего visual review: одна общая спокойная поверхность; аккуратная глубина, тонкая граница и мягкое отделение от контента, оптически согласованные icons и ненавязчивый active state. При выборе прозрачного материала текст/controls должны оставаться читаемыми на реальных светлых, тёмных и насыщенных подложках; нужен непрозрачный fallback. Это **направление для candidate, не уже принятая графика**. Сейчас новая macOS skin не реализуется вместо остальных недоделок и не добавляет слои или постоянную анимацию.

Primary destinations, resolver и aria-current остаются едиными; desktop может иметь свою геометрию, но это не разрешение вновь создать отклонённую панель. Сохраняются nav XOR CTA и modality/focus/last-action guarantees. Одна поверхность не означает превращение всей nav в одну кнопку. Apple [Dock guide](https://support.apple.com/guide/mac-help/open-apps-from-the-dock-mh35859/mac) — reference общей идеи; никакие системные assets, hover magnification, auto-hide или native-привилегии не переносятся автоматически.

## 2. Брендовое меню не меняется

«Полюбить Калининград Анонсы» сохраняет исходное место, внешний вид, размеры и собственное управление. Оно **не участвует** в сжатии, перестановке или state transitions соседних островов. Собственное намеренное открытие/закрытие сохраняется. Предложения v1.1/FI-02 сделать его glyph-trigger, «Меню» или новый motion отменены.

Для компоновки допустимо прочитать занятый им rect, но нельзя изменять сам бренд ради fit. Контекстный выбор городов или раздела не становится новым global menu. Existing source и screenshots до эксперимента — baseline защиты, не только сравнение двух уже одинаково изменённых страниц.

## 3. Верхняя композиция и смысл полки

Остальные подходящие поверхности по возможности образуют одну строку вокруг бренда с реальными свободными промежутками и краями. Не требуется сплошной substrate или одинаковая форма всех островов. Неприсутствующие роли не занимают фиктивные slots.

Небольшая навигационная полка может показать реальные controls; при сжатии — осмысленный summary/раскрытие. Полка событий оставляет сами карточки в контенте, наверх выходит лишь её контекст/управление. H1/H2 остаются в документе; floating locator не копирует heading/control tree. Viewed Search section, refinement base и pending draft различаются.

Width budget учитывает actual brand/controls/safe-area/hit areas. Высота строки — максимум соответствующих занятых областей, не сумма sticky этажей. Сначала убираются смысловые дубли и декоративные детали, затем выбираются permitted views, затем второстепенные controls возвращаются в раскрытие/flow. Бренд и читаемый смысл не являются последней жертвой сжатия. При zoom/малой высоте readable flow предпочтительнее tiny targets/clipping/ещё одного fixed ряда.

Full/lean/compact независимы для участников. Большой экран не требует вернуть всю декорацию. Icon+label→label→icon допустимо для понятного контекстного action с теми же semantic identity/target/scope/name; не для защищённого бренда. Декоративный знак, action identifier, selection/disclosure indicator и медальон идентичности имеют разные правила. Touch не полагается исключительно на tooltip.

## 4. Медальон вместо повторного floating-названия

На **точной** подборке «Бесплатные события» канонический `0 ₽ / бесплатно` может один представлять floating page identity. Не нужен отдельный title island или пустая прямоугольная подложка. Настоящий H1, title документа, доступное имя, действия/возврат к заголовку сохраняются. Старый второй sticky mark в этой presentation не дублируется.

Замена требует полной эквивалентности смысла и source-bound asset. «Бесплатно с детьми», «на побережье», город, дата или отрицание не теряются за одним знаком. Нельзя заменять canonical mark похожей иконкой. При недоступном изображении **текстовое представление сохраняется/возвращается**; нельзя спрятать название до успешной загрузки знака.

Предварительный runtime проверяет exact route без дополнительных query-параметров. Это консервативный predicate, не продуктовый запрет tracking params навсегда. Richer-scope отрицательные cases обязательны.

## 5. Города: раскрытие и восстановление

Закрытая кнопка показывает `Все города`, единственный город, `Города · N` либо `Города не выбраны`. Открывается readable rectangle с заголовком, явным закрытием, исходными checkbox controls/counts и подписью немедленного применения. На достаточной ширине допустимы две колонки, на узкой — одна. Закрытие не отменяет уже применённый фильтр; лишней кнопки «Применить» нет.

Используется **тот же fieldset и тот же filter/storage owner**, а не копия состояния. Native popover — presentation, не модальное окно/новый global menu. Escape/close возвращают focus, outside/focus exit корректно завершают раскрытие, выбор не сбрасывается. No-JS сохраняет полку.

При недостаточной полезной высоте раскрытие переходит в flow. После возвращения места оно должно восстановить пригодное anchored представление, а не навсегда застрять в fallback. При переходах сохраняются исходные controls, selection и focus; запоздалый native toggle не закрывает уже восстановленное раскрытие. Во время pointer-held/IME косметическое переключение откладывается.

Размеры обновляются по фактическому контейнеру, viewport/scroll, доступной высоте и current shell occupied rects. Нижние препятствия вне горизонтального диапазона прямоугольника **не сокращают его высоту**; пересечения учитываются без двойной суммы. Counts/font load/container resize вызывают bounded remeasurement, а не новый фильтр/профиль/телеметрию.

Уничтожение adapter восстанавливает исходный fieldset, удаляет свои nodes/flags/listeners/observers и не возрождает их на следующем resize. Это часть functional acceptance, не только аккуратность кода.

## 6. Один existing owner и текущая интеграционная граница

EventLayout остаётся shell authority. Сохраняются FI-07–17 и RB: disjoint rects, safe-area один раз, нет прозрачных hit planes, защищённые focus/input/Stop, честные receipt states, actual served identity, exact hides/frozen prefix и optional analytics OFF. Ни отказ от skin, ни новый disclosure не создают transport/profile/window framework.

В текущем draft #638 снят только отклонённый skin и продолжается contextual behavior. Новое нижнее оформление не считается prerequisite завершения городов/медальона/проекций. Карточки и full-pool framing не перепроектируются этой lane.

Прочитан current integration source `46fc5268…`: он уже содержит отдельную реализацию top band и изменённое desktop menu в `Reference4MobileMenu`. Поэтому нельзя просто наложить обе версии или объявить два same-name controller совместимыми. При интеграции нужно сохранить последних owners, убрать отменённую brand presentation, соединить city/section geometry с existing shell и заново получить registry/generated graphs. Это **открытая работа**, не permission на второй контроллер или самовольный overwrite current trunk.

## 7. Код и проверяемые факты

[Draft #638](https://github.com/onedayonemasterpiece/events-bot-new/pull/638), `work/floating-islands-owner-preview-20260905`. Experiment ограничен nonproduction `/preview-islands-*`, baseline `?islands=off`. Правдивый exact tested SHA/run находится в terminal receipt этого PR, а не выводится из текущего HEAD.

Исторические `ccde8553…`/run33964945528: настоящая генерация Astro Popular/Free и диагностические проверки на fixture2026-07-23, **но прежняя desktop skin отклонена**. Технический PASS не отменяет visual rejection. Rollback `be4a15d1…`/run33966294014: снова сгенерированы эти два маршрута; новая проверка сравнивает целиком прежние nav rect/paint/icon sizes и links. Это bounded diagnostic, не полная приёмка.

Следующий source `30a0c977…` добавляет восстановление city-panel, focus/control cleanup, lane-aware obstacle calculation и image-error identity fallback. Его browser результаты принимаются только после соответствующего terminal run и чтения artifacts. Перечень тестов сам по себе не PASS.

Read-only CI использует существующий `local:focused`; один временный exact-source readback нужен для личного анализа пересечения веток и затем удалён из workflow. Он не публикует страницы/шрифты/секреты и не запускает другого агента. my-data-hub/browser/Penpot при tool preflight не предоставили callable methods. Нет новой публичной Kaggle ссылки, native P или A=S=P PASS. Production/root/current/ICS/shared foundations/STATUS не изменялись.

## 8. Приёмка и сохранённое исследование

Сравнивать сохранённый бренд с исходным baseline, а не только с адаптированным OFF; один нижний остров с прежней presentation до отдельного review; desktop/mobile, H1/context/actions, actual fieldset identity, repeated open/close, resize/fallback/recovery, Escape/focus exit, missing asset, no-JS и cleanup. Нативная OS-клавиатура не доказывается desktop resize. Source-bound S/P includes real assets, view/state IDs, actual geometry и lineage; отсутствующие native bindings остаются pending.

[Исследование v1.1](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/eb3309591be368d729ea52c90b6ef99d1acbad6b/docs/research/floating-control-islands-2026-08/top-row-composition-v1.1.md#2-что-показало-исследование) сохранено как основания grouping/compaction/disclosure/reflow, не отменяющие новых owner decisions. [Исходная v1.2](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/74d315dabd7fb35e37b37e82618d0b81b2c50bdb/docs/research/floating-control-islands-2026-08/top-row-composition-v1.1.md) фиксирует историю отклонённой skin; она не активное руководство её внедрять.

Открытый следующий продуктовый результат: согласованный с текущими owners верхний ряд и current-corpus интерактивный Kaggle preview. Документы, private native mock и CI screenshots этот результат не подменяют. Нормализация не объявляется завершённой.

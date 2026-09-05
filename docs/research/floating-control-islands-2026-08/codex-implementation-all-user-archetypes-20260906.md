# Codex: внедрить Floating Islands на всех пользовательских архетипах KenigEvents

Дата: 2026-09-06. Класс задачи: **ручной запуск Codex, реализация и проверка**, не новое исследование и не запуск агентов из ChatGPT. Сохранение этой постановки само по себе ничего не разворачивает.

## 1. Конечный продукт

Доведи существующую систему `pattern.detached-chrome-control-islands` до работающей общей оболочки **всего пользовательского сайта**. Владелец должен открыть один актуальный интерактивный preview и проверить любую пользовательскую страницу до прокрутки, в переходе, после закрепления и при смене контекста. Страницы используют общие компоненты и один механизм компоновки, но сохраняют свои задачи и структуру.

Обязательный результат: сохранённый код + согласованный executable UI SoT + тесты + опубликованный через существующий Kaggle-путь immutable preview на актуальных данных + проверка реального поведения. Native Penpot — через существующий materializer и действующий conformance contract, не картинки вместо компонентов. При недоступном P завершай доступные source/preview работы и называй отсутствие P отдельно; ни A=S=P, ни полный DONE без требуемых доказательств не заявляй.

**Недостаточно:** ещё одной SVG-схемы, счётчика тестов, страницы только «Популярное»/«Бесплатно», skeleton registry, запущенного ноутбука, локальной июльской fixture-сборки или списка советов. Первый законченный пакет — checkpoint, а не повод остановить всю порученную реализацию.

Разрешено: менять необходимые runtime families/adapters, их версии/проекции/тесты/документы, устранять пересечения прежних реализаций, собирать и публиковать изолированные noindex previews. **Не разрешено:** переключать production/root/current/ICS, сливать main ради выполнения задачи, менять общие fonts/palette/foundations или общий STATUS без полномочий текущего владельца. Не менять бизнес-логику событий, Auth, consent, ранжирование, data admission и provider budgets под видом дизайна. Если для нового visual candidate нужен foundation token, подготовь адресное изменение у его owner, не прячь локальный literal в странице.

## 2. Единственный источник требований и fresh-read

Начни с [текущей композиции v1.8](top-row-composition-v1.1.md), включая центрирование городов и особый Weekend. Этот файл — владелец актуальных UI-решений. [Core FI-01–20](system-design-v1.md) и [RB-01–03](release-bindings-v1.md) определяют общие geometry/interaction и продуктовые стыки. Старые фрагменты core/P1/JSON не могут возвращать отменённое изменение бренда, раннюю компактизацию, отдельные mobile острова для двух строк или новое меню другого состава. Адресно исправляй устаревший routing, не создавай ещё одну копию контракта.

Полностью прочитай применимые `AGENTS.md`, `.codex/skills/static-site-design-system/SKILL.md` и инструкции текущего canonical builder; далее только релевантные зависимости. Обязательные источники:

- `events-bot-new#621`: актуальная постановка и последние результаты CODE/V0/параллельных владельцев; реальный HEAD `agent/static-site-single-kaggle-contract`.
- `lovekgd-design-system#47`: ветка `docs/floating-control-islands-reference`, текущие композиция/core/RB/consumer matrix. [FI-P1](implementation-package-1.md) — исторический первый slice, **не ограничение нынешней задачи одной страницей**.
- `events-bot-new#638`: актуальные diff, тесты, комментарии и граница совместимости. Это источник полезных исправлений, не обязательная база для merge.
- В актуальной DS integration-ветке: `docs/product-governance/astro-sot-penpot-conformance.md`, `contracts/launch-normalized-ui.v1.yaml`, README/STATUS нормализации. Conformance не переписывай и не ослабляй.
- В events: `site/src/data/design-system-production-surface-contract.v1.json`, family/token registries и generated consumer/impact graphs; feature README; `docs/operations/static-site-autotest-strategy.md`, `docs/testing/static-site-autotest-scenarios.v1.yml`; текущие `release-integration.md` и voice/Search adapter через RB routing.

### Проверенный срез при подготовке, не вечный latest

| Источник | Фактически прочитано |
|---|---|
| Executable events trunk | `64f63420754eb702e877da281d9affe13dfd28b6` |
| Последний прочитанный CODE receipt | [#621 comment 5553304045](https://github.com/onedayonemasterpiece/events-bot-new/issues/621#issuecomment-5553304045), public `/preview-real-64f634207-normalized-20260905-v1/` |
| DS release/integration receipt | `ff2b70b908469f55e203847148d68ce2a5ccf8c9`, launch contract 1.14.3; conformance 1.2.0 ACTIVE |
| Draft #638 | `ea07efaa58d6eb911cfb6cb62914cd8ae10c2dd6`, отдельная repair-ветка; не включена в trunk |
| Предыдущая UI-спецификация | DS #47 `5058b93b1040eda78cb85e102d369d3e1592f0a0`, v1.7; v1.8 добавлена вместе с этой постановкой |

CODE прямо подтвердил: #638 использует draft-only city controller, отсутствующий в executable trunk; слепой перенос создаст competing placement ownership. **Базируй работу на fresh executable trunk.** Перенеси полезное поведение/регрессии #638 в действующих owners либо явно замени старого owner, но не оставляй оба. При наличии текущей CODE-ветки продолжай её в согласованных границах; при параллельном writer используй одну feature-ветку от свежего trunk и integration PR. Зафиксируй выбор в #621. Не force-push чужую ветку, не откатывай актуальное кадрирование/карточки/радиусы/навигационные исправления к старой базе ради лёгкого merge.

Старая необходимость полной нормализации всего сайта не блокирует уже порученную реализацию этого ограниченного изменения. Сними честный baseline затронутых consumers и их известных отклонений. Это не разрешение канонизировать дефект или объявить незавершённую нормализацию пройденной.

## 3. Полный охват без лишнего chrome

Построй route→archetype→composition→family→scenario mapping из **текущих исходников и release manifest**, обновив существующую матрицу, не новый реестр ради отчёта. На прочитанном срезе 17 IDs; число не является потолком. Обязательны generated dates/weekends, дочерние подборки и другие реальные пользовательские routes, которые список ниже только представляет.

| Archetype / routes | Что внедряется и что сохраняется |
|---|---|
| `home` `/` | Общая оболочка и подходящие controls; существующие сцены/hero/навигация, ранняя видимость контента. Не придумывать полку там, где её нет. |
| `today-listing` `/segodnya/` | Date/city context, реальные enabled даты и anchors, без duplicate date/nav rails. |
| `tomorrow-listing` `/zavtra/` и dated routes | Та же общая family; absolute date/timezone и availability сохраняются. |
| `weekend-listing` `/vyhodnye/` и dated weekends | **Отдельная обязательная нормализация:** две desktop колонки, реальные range/time nav и равноправные day headings. Подробнее v1.8 §5. |
| `popular-listing` `/populyarnoe/` | Desktop shelf-only при видимом selected page в меню; mobile combined page+shelf, смена полок без новых nav полос. |
| `collections` `/podborki/` и дочерние | Каталог и обычные фильтрованные выборки. Exact Free medallion-only; без искусственного блока «Бесплатные выставки». |
| `festivals` `/festivali/` и доступные дочерние | Timeline/grouping и исходная семантика; context только для реального раздела. |
| `exhibitions` `/vystavki/` | Approved deck/window/media states, light/graphite, feedback/unread; без нового card fork. |
| `favorites` `/izbrannoe/` | Saved/empty/hide/undo состояния, безопасные подтверждения. |
| `search` `/poisk/` | Оболочка обычного поиска и адаптер для реально имеющегося composer/answer context. Полный voice backend в scope не входит. |
| `for-me` `/dlya-menya/` | Loading/empty/error/personal projection и стабильный видимый префикс. |
| `focus-group` `/fokus-gruppa/` | Пользовательские формы/ошибки/keyboard/consent; это не служебная страница только из-за наличия формы. |
| `artifacts` `/artefakty/` | Реальные native marks, earned/locked/empty states, отдельный lifecycle уведомления. |
| `event-detail` `/sobytiya/*/` | Wide/narrow/no-image, gallery, practical/related, существующий nav XOR CTA и границы его показа. |
| `interest-clubs` `/kluby-po-interesam/` | Public/feature gates и membership. Не включать скрытую функцию ради красивого отчёта. |
| `unusual-events` `/neobychnoe/` | Quality/publication gate, approved empty; без фиктивных событий. |
| `information-pages` `/partners/`, `/partnerstvo/` и реально существующие пользовательские информационные страницы | Минимальный chrome, читаемый контент и формы; не навязывать города/section context без смысла. |

Исключены административные/технические/diagnostic страницы, `/lab/*`, `/__preview/*`, служебные endpoints и их визуальный polish. Catalog/preview index можно менять только как средства тестирования и review. Пользовательские legal/help/onboarding страницы не исключаются по названию файла. Shared dependency не вычёркивается из работ из-за слова `Prototype` в имени.

У каждой роли в mapping: применима/не применима и причина. `not_applicable` допустимо для города на информационной странице, **не для всей пользовательской страницы вместо её проверки**. Feature-gated route остаётся gated; его family проверяется в предназначенном тестовом контексте, а не тайно публикуется. Число routes, archetypes и test cases в отчёте не смешивай.

## 4. Что нужно реализовать

Подробные UI-правила не изобретай заново: используй v1.8. Обязательный implementation checklist:

1. **Desktop:** правое постоянное меню с реальным visible selected пунктом; слева контекст и центрированная в доступном слоте городская полка. Полное меню/города, пока помещаются сейчас. Никакой anticipatory compaction. H1 уходит с документом, а не превращается в дублирующий остров.
2. **Mobile:** неизменная кожаная бирка, без desktop-полосы разделов. Одна поверхность page+child и соседний city control одинаковой высоты; dots сокращают ширину. Немедленный плавный **диагональный** morph, обратимость, без клона/сначала-вбок. При отсутствии section не оставляй пустую вторую строку ради одинакового шаблона.
3. **Scope lifecycle:** предыдущая полка уходит вверх, следующая приходит снизу в свой слот. Меню/города/страница не меняют смысл. Параллельные Weekend колонки не используют правило единственной выбранной полки.
4. **Города:** реальная компактизация/partial overflow, центрирование текущей видимой группы; direct choices/rectangle disclosure используют один fieldset/owner, selection/фокус/закрытие/Popover fallback и восстановление сохраняются. Не устранять checkbox obstruction через forced click/z-index.
5. **Weekend:** общая строка островов и новая лаконичная версия day headings на реальных двух колонках. Выполни выбранный стартовый вариант v1.8 §5 и покажи before/after; не заменяй Weekend шаблоном DateListing или одной активной субботой.
6. **Большая карточка:** общая short admission presentation `Бесплатно`, а не `Бесплатно · Вход свободный`; SSR и appended DOM одинаковы. Реальные ограничения/регистрация/неизвестность сохраняются. Не менять share/domain/CTA semantics глобальной заменой.
7. **Нижние поверхности:** сохранить один цельный nav/dock, его destinations, видимость/достижимость и nav XOR CTA. Отклонённую тяжёлую desktop skin не переносить. Новый macOS-like skin пока не owner-approved; не блокировать остальные работы его очередным редизайном.
8. **A и S вместе:** versioned reusable components, проекции и actual consumer graph. Не CSS-only визуализация поверх старого несогласованного DOM/SoT и не «документацию синхронизируем потом».

### Точки входа в код

Проверь current equivalents, не создавай модуль только потому, что ниже есть имя:

- `EventLayout.astro`: top-band/page/section context, actual navigation/resolver, runtime-card hydration, occupied-space/scroll owner.
- `Reference4MobileMenu.astro`: сохранить protected brand и его функции; исправить только мешающее выполнение актуального контракта, не переносить старую adaptive brand skin.
- `MobileBottomNav.astro`, `MobileToastRegion.astro`, actual date accessory, `EventCtaPanel.astro`: согласованные нижние occupied regions/overlay/timer/focus.
- `ListingDiscoveryRail.astro`, `ListingControls.astro`, `PopularMobileGroupContext.astro`/current equivalents: устранить двойное pinning и два filter controllers.
- `WeekendListingSurface.astro`, `WeekendEditorialTimeline.astro`, `WeekendRangeNav.astro`, `ListingWeekendTimeNav.astro`, `WeatherDateContext.astro`, mobile listing owner: сохранить существующие функции и их scope.
- `EventCard.astro`, `eventAdmissionLabel`/current formatter и `[data-card-status]` hydration: одна карточная presentation, обе ветви проверены; shared domain facts не потеряны.
- Keyboard/scroll controller, current family/token registries, generated graphs, runtime catalog и materializer — существующие owners.

Не добавляй новый document-wide event bus, window manager, scheduler, local outbox, backend, builder или per-route копии карточек/иконок. Где CSS sticky/grid/flex достаточно — используй их; измерения нужны для shared fit/occlusion и защиты взаимодействия. Никакой генерации изображений для реализации или доказательства; реальные assets либо разрешённые примитивы временного изолированного specimen, не подмена native P.

## 5. Общая система остаётся работоспособным продуктом

Сохрани explicit top/bottom/route modes. Реальный viewport и safe area учитываются один раз; строка не создаёт прозрачный перехватчик кликов между островами. Текст, zoom, IME, pointer-held, открытое раскрытие и focus важнее косметической перестановки. При shortage — читаемый compact/flow, не tiny controls или бесконечные sticky этажи. Reduced motion и no-JS сохраняют функции.

Существующие lower/modal/gallery owners сохраняют focus return, Escape, scroll lock semantics и timer policies. Error/action/unknown receipt не становится исчезающим passive toast. Stop записи не оказывается под недостижимым overlay: используйте согласованный #587 handshake, а не второй capture controller.

RB-01–03 обязательны: truthful queued/local-only/committed/unknown states, существующий shared gateway/operation catalog, occupied-space→exposure и actual served order, protected visible prefix, global hide/undo, допустимая personalization projection. Shell **не** запускает новый профиль, не включает optional analytics и не записывает вопросы/аудио/PII в layout telemetry. Analytics OFF не ломает навигацию/действия. Работа с unavailable backend отображает честное состояние; layout mock не засчитывается как live auth/search/capture/transport проверка.

## 6. Порядок работы — до общего preview, не до первого коммита

**A. Сверка и базовый контур.** Кратко зафиксируй current refs, owners, route coverage и истинные конфликты. Воспроизведи только затрагиваемые исходные cases; не начинай общий аудит заново. Сделай changeset plan из фактических dependencies, затем сразу код.

**B. Общие owners и трудные consumers.** Сначала сцепленный пакет Popular + Weekend + Free + event-detail как stress cases, с кодом/SoT/тестами. Weekend не оставляй «на потом после простых страниц». Получи ранний реальный candidate, исправь видимые промахи, затем продолжай остальной scope без нового разрешения.

**C. Все пользовательские families.** Переведи остальных consumers из mapping. Удали вытесненные controllers/CSS только после проверки отсутствия callers. Сохрани public gates и routing. Одна preview-switch/migration policy, а не разные ручные query-тогглы на 17 страницах. Старый `/preview-islands-*` diagnostic gate не должен стать единственным способом увидеть функцию на итоговом all-archetypes preview.

**D. Полная проверка и публикация.** Выполни тесты, common same-corpus generation, actual browser review, исправь найденное, опубликуй isolated noindex immutable preview через canonical Kaggle. Сверь artifacts/manifest/runtime DOM, затем сформируй owner handoff с готовыми URL всех archetypes и важных states.

**E. Native проекция.** Существующий materializer/sole-writer обновляет затронутые native families/frames по exact S. Получи readback/revision/asset lineage и conformance evidence. Недоступность Penpot не оправдывает остановить B–D; отсутствие P не называй parity. Результат source/preview readiness и P readiness отчитай раздельно, по действующему review-stage contract.

Сохраняй небольшие законченные коммиты. Перед каждой cross-owner интеграцией fresh-read изменившегося HEAD, не повторная полная инвентаризация. Каждый завершённый пакет содержит runtime + соответствующие S/versions/consumers + tests + canonical feature docs + `CHANGELOG.md` `[Unreleased]`. Cross-repo изменения нельзя физически сделать одним Git-коммитом: связывай точные A/S refs в одном проверяемом integration receipt и проверяй их согласованность. Не объявляй A-only пакет закрытым.

## 7. Тесты и доказательства

Расширь existing scenario registry/harness, не создай отдельную QA-платформу. Старые counts из #638 и проверок SVG не засчитываются новой реализации. Используй actual assertions/negative probes, не только source regex.

**Обязательные проверки:**

| Группа | Что должно быть реально доказано |
|---|---|
| Coverage | Каждый разрешённый пользовательский archetype имеет actual mobile+desktop проверку; generated/dated variants и существенные состояния не потеряны. Все разрешённые routes reachable в итоговом manifest. |
| Desktop fit | Полный nav/cities при наличии места, числовая причина сокращения, right anchor; группа городов центрирована в своём свободном slot. Scroll без shortage не скрывает пункты. Current page виден вне overflow. |
| Identity/motion | Desktop H1 уходит в потоке, mobile сразу морфится диагонально. Capture 0/первые pixels/середина/конец/обратный ход, без brand/menu collision, duplicate title и пустого spacer. Это actual scroll, не переключение SVG. |
| Mobile balance | Common height/top/bottom/material пары, 320/390/430, длинные названия/города; нет дополнительной desktop-nav полосы или неизвестного glyph вместо смысла. |
| Weekend | Обе колонки и day/date headings, range nav и time anchors, одна общая time axis где она есть, пустой/короткий день, boundary месяца/года, current Sunday, переход/Back/Forward. Ни fake selected Saturday, ни два независимых vertical scrollports. |
| Cities | Original fieldset, repeated open/close, real click/keyboard/selection, small-height→recovery, no Popover API, outside/Escape/focus return, parent containment, lifecycle cleanup. |
| Cards/data | «Бесплатно» без тавтологии; registration/paid venue/availability preserved; SSR=appended presentation. All event IDs, row membership, permitted order/visible prefix и latest media-framing contract сохранены. |
| Other consumers | Gallery/modal, nav XOR CTA, calendar action, long/short/empty lists, saved/hide/undo, loading/degraded/auth/форма. Feature OFF/nonparticipating consumers не ломаются. |
| Accessibility | Keyboard/Tab/heading navigation, focus unobscured, open controls/IME/held pointer, contrast actual underlay, reduced-motion/no-JS, 200% text/400% reflow. Native keyboard/OS проверки там, где реально затронуты; desktop resize не называй native. |
| Performance | Нет observer loops/listener leaks/layout thrashing/scroll jumps; bounded work и cleanup. Нет новой сетевой активности/optional telemetry в OFF. |
| Projection | Одинаковые source/corpus/clock/labels/assets/variants/geometry в A/S/P для заявленных cases; invalid/missing binding не PASS. |

Сохрани viewports из actual registry. Базовые дополнительные review размеры: mobile 320/390/430, desktop 1280/1440/1920 и tablet там, где реально меняется branch. Не перемножай без риска каждый тест на каждую страницу: общий механизм тестируется глубоко, каждый archetype — представительно, Weekend/Popular/Free/detail — расширенно. Brand/navbar invariants проверяй против **доэкспериментального** source baseline, не только двух одинаково испорченных ON/OFF страниц.

До visual сравнения подготовь согласованный deterministic корпус **для всех затронутых archetypes**, не только Free. Зафиксируй snapshot/hash/clock/timezone, IDs/order, image/resource/auth flags, widths/DPR/fonts/variant versions. Golden и current-real имеют разные цели; каждый A/S/P case внутри себя обязан использовать одинаковый corpus. Если актуальный route пуст, показывай честное empty и отдельно используй определённый тестовый corpus для populated regression, не выдавай фиктивное событие за production.

Известные существовавшие gates: `npm --prefix site run check:astro-family-sot`, `check:design-system-production-surfaces`, `check:design-system-iconography`, `test:browser-release-gate`, и relevant focused shell/card/weekend tests. **Сначала проверь current package scripts и инструкции runners**, выполни обязательные актуальные gates. Старый skill ссылался на отсутствующий `check:design-system`; не создавай пустой alias и не пропускай реальные проверки ради галочки. Числовые visual допуски — из current conformance harness, не придуманные под результат.

Найденная регрессия → root-cause fix у owner → тот же тест снова. Не ослабляй assertions, не используй `force:true`, не скрывай повреждённые controls/events и не называй диагностику ремонтом.

## 8. Публикация, Penpot и реальные ограничения

Единственный опубликованный путь: existing events exporter/page selector/builder → **Kaggle StaticSiteBuilder** → текущий разрешённый Object Storage → новый create-only immutable noindex prefix. Через доступный existing facade (`kenigevents.preview.start/current`, `operation.get`) либо документированный вызов **того же** runner в окружении ручного Codex; никаких вторых publishers/других bucket architectures. Local focused/CI diagnostic не подменяет published owner preview. Никаких self-hosted runners на машине владельца.

Проверь реальные методы/credentials/runner до заявления «недоступно». Статус installed/enabled не доказательство callable tools. Прежний отказ в другом окне не доказательство текущего. Следуй применимой ретроспективе доступа; не меняй permissions, не обходи safety refusals или protected writes. Для live Auth/data/provider случаев используй только разрешённые role-scoped sessions; нельзя заимствовать чужую роль токена.

Для долгой сборки фиксируй operation/kernel ID и прогресс в существующем канале; не запускай дубль пока предыдущая операция неизвестна, не обещай работу после завершения своего хода. Прочитай terminal status, скачай результат, проверь SHA/manifest и reachable URLs, затем открой страницы браузером. «Dispatch успешен» не означает preview готов.

Penpot — существующий файл/каталог/native instances и единственный writer по текущему lifecycle. Не новый файл, не ручной trace карточек, не screenshot background как страница. Актуальные UI-поправки сохраняются в source и SoT; размеры/цвета/иконки для accepted P берутся из resolved Astro и canonical assets. Отсутствие native доступа фиксируется отдельно с конкретным вызовом/ошибкой. Подготовленная проекция без P достаточна только для того этапа review, где это явно разрешено current contract; это никогда не A=S=P.

## 9. Передача результата владельцу

Обнови existing PR/feature docs/consumer mapping и один итоговый комментарий #621. Нужны:

- один рабочий URL обзорной страницы immutable preview и прямые ссылки на все пользовательские archetypes; отдельно Popular, Weekend и Free с готовыми инструкциями действий;
- exact code/SoT refs, build ID, data identity/clock, manifest/artifact hashes, реальные результаты source/browser/native проверок;
- before→mid→pinned→handoff/reverse evidence, Weekend обе колонки и city centering; сохранённый бренд/правое меню/первое событие в начальном viewport;
- что завершено и что остаётся внешним blocker: source integration, published browser review, native P и owner visual acceptance не объединять в одно слово PASS;
- migration/rollback plan и оставшиеся old consumers; никаких скрытых одиночных page forks и «SoT потом».

Локальный all-archetypes code без публикации — не выполненный запрос на видимый продукт. При реальном непреодолимом ограничении сохрани выполненный пакет, точное evidence и минимальное действие для разблокировки, продолжив независимую доступную работу. Не спрашивай, нужно ли продолжать уже порученные следующие архетипы.

Используй минимально достаточные ресурсы. Самостоятельный кодовый исполнитель может вынести ограниченный read-only анализ/ревью во внешнее окно ChatGPT, подготовив короткий вопрос с GitHub-пинами; не делегировать туда записи тех же families и не делать наличие такого окна обязательным условием. Не добавляй orchestrator/W0–W6 процесс, не запускай других агентов по умолчанию. Продуктовые решения уже даны; уточнение требуется только для реального противоречия, влияющего на смысл/полномочия, а не для каждой технической детали.

**Задача завершена не тогда, когда написан общий компонент, а когда все применимые пользовательские consumers действительно используют систему, согласованы с SoT, проверены и доступны владельцу в одном актуальном preview; недоступное native доказательство честно выделено по stage contract.**

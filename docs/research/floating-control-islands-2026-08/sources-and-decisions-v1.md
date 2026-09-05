# Floating Islands — источники, решения и фактические границы проверки

Дата: 2026-09-05. Это evidence appendix к [единой спецификации](system-design-v1.md), не новый STATUS и не независимый conformance contract. Документ подготовлен лично в ChatGPT через GitHub и browser MCP; проектирование агентам не делегировалось.

## 1. Прочитанные authoritative источники

| Источник | Закреплённая точка чтения | Что из него использовано |
|---|---|---|
| [Полная постановка окна](https://github.com/onedayonemasterpiece/events-bot-new/blob/62c54ce42786eecc5b380ea3dba002af78df8fd0/docs/features/static-site-pages/design-system/window-prompts/20260905-floating-islands-system-design.md) | events-bot-new `62c54ce42786eecc5b380ea3dba002af78df8fd0` | Site-wide scope, documentary design сейчас, existing pattern owner, запрет самовольных production/foundations/STATUS изменений. Прочитана полностью частями. |
| [PR #47](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/47), его README, planned dossier/JSON, screen observations | `docs/floating-control-islands-reference`, исходный HEAD `774bcf0659915dffa16431847d408b2a6a6f2302` | Существующий ID и четырёхслойная модель; semantic islands, composer/nav/state различны. PR open draft, на прочитанном срезе comments пусты. Новые документы продолжены в этой же ветке. |
| [PR #39 / planned-pattern checklist](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/6074fcb33ecb6125e97135b6011fc9c16d74df23/docs/design-system-planned-patterns-checklist.md) | `docs/design-system-progress-checklist-20260820`, HEAD `6074fcb33ecb6125e97135b6011fc9c16d74df23` | Обнаружен устаревший STOP до полного AS-IS/P даже для design execution. Требуется адресная routing/gate correction, без объявления незакрытых проверок пройденными. |
| [A=S=P](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/4b8c79ab60425b89075004b201c78cccf7019b31/docs/product-governance/astro-sot-penpot-conformance.md) | Версия **1.2.0**, ACTIVE; branch `integration/launch-normalized-sot-penpot-20260902` HEAD `4b8c79ab60425b89075004b201c78cccf7019b31` | Определение A/S/P, stage distinction, нулевая терпимость к facts/semantics/lineage/asset drift и точные source-bound geometry requirements. Прочитаны первые 180 строк, включая эти разделы; весь governance-файл не объявляется повторно аудированным. |
| [Launch contract](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/4b8c79ab60425b89075004b201c78cccf7019b31/contracts/launch-normalized-ui.v1.yaml), [README](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/4b8c79ab60425b89075004b201c78cccf7019b31/docs/launch-normalization/README.md), [STATUS](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/4b8c79ab60425b89075004b201c78cccf7019b31/docs/launch-normalization/STATUS.md) | Контракт v1.14.0 и доступный STATUS | Finite owner-audio-review stage, actual-user scope, structural S, one executable trunk/Kaggle path, AR17 lower surfaces и AR18 nav. STATUS прочитан, **не изменён**. Исторические SHA в README не подменяют latest #621 receipt. |
| [#621 planning decision](https://github.com/onedayonemasterpiece/events-bot-new/issues/621#issuecomment-5550659316) | 2026-09-05 08:42:33Z | Много ролей/островов; shared layout owner; same-corpus fixtures; work не расширяет normalization exit gate. |
| [#621 опубликованный successor](https://github.com/onedayonemasterpiece/events-bot-new/issues/621#issuecomment-5550744613) | 2026-09-05 09:00:21Z | Public source `0b08f0a806a9531c8bf253672e1bb5c712764064`, source-tested next `2fe28b1…`, остаются независимое review/P/data gaps. Это CODE evidence, не личный повтор тестов. |
| [Search product authority](https://github.com/onedayonemasterpiece/events-bot-new/blob/62c54ce42786eecc5b380ea3dba002af78df8fd0/docs/features/static-site-pages/smart-vector-search/agent-assisted-event-discovery.md) | PR #587, branch `docs/agent-assisted-event-discovery-20260826`, `62c54ce…` | §§0–9: owner corrections, retained answer sections, separate capture/processing/history/refinement, no provider/model-card forks. |
| [Voice technical spec](https://github.com/onedayonemasterpiece/events-bot-new/blob/62c54ce42786eecc5b380ea3dba002af78df8fd0/docs/features/static-site-pages/smart-vector-search/voice-search-solution-v1.md) | Тот же #587 SHA | Выборочно domain/state/source integration и полностью shell adapter §9; numeric/resource/retention defaults не перенесены в shell authority. Это proposal, не работающий backend. |
| [Mobile shell](https://github.com/onedayonemasterpiece/events-bot-new/blob/2fe28b1f831ac607c0415a8aa6c2beab9eb67fac/docs/features/static-site-pages/mobile-shell.md) | Прочитано на предке `d1cc5c7…`, соответствующий документ не менялся в compare до `2fe28b1…` | Explicit modes, nav XOR CTA, current donor semantics, date accessory/history/native-field boundaries. July/lab ограничения не отменяют более поздние owner decisions. |
| [Production surface registry](https://github.com/onedayonemasterpiece/events-bot-new/blob/2fe28b1f831ac607c0415a8aa6c2beab9eb67fac/site/src/data/design-system-production-surface-contract.v1.json) и [family registry](https://github.com/onedayonemasterpiece/events-bot-new/blob/2fe28b1f831ac607c0415a8aa6c2beab9eb67fac/site/src/design-system/astro-family-registry.v1.json) | `2fe28b1…` / неизменённые файлы его предка `d1cc5c7…` | Все 17 archetype IDs, route bindings, ownership, explicit versions; реестр не доказывает live adoption и native materialization. |
| [Autotest strategy](https://github.com/onedayonemasterpiece/events-bot-new/blob/2fe28b1f831ac607c0415a8aa6c2beab9eb67fac/docs/operations/static-site-autotest-strategy.md), [scenario registry](https://github.com/onedayonemasterpiece/events-bot-new/blob/2fe28b1f831ac607c0415a8aa6c2beab9eb67fac/docs/testing/static-site-autotest-scenarios.v1.yml) | `2fe28b1…`, прочитаны governing sections/platforms/auth modes | L0/L1/L2/L3, existing harness, no fake native certification, mocked_ui не backend evidence. |
| [DS skill](https://github.com/onedayonemasterpiece/events-bot-new/blob/2fe28b1f831ac607c0415a8aa6c2beab9eb67fac/.codex/skills/static-site-design-system/SKILL.md), AGENTS и [package.json](https://github.com/onedayonemasterpiece/events-bot-new/blob/2fe28b1f831ac607c0415a8aa6c2beab9eb67fac/site/package.json) | Current source/его предок | Material component versioning, no route-local equivalents, catalogue/consumer migration. Обнаружено отсутствие script `check:design-system`, на который ссылается старый skill; FI-P1 использует реально существующие gates. |

## 2. Ветки: source не равен публикации

Реальными Git ref reads получены:

- `events-bot-new:work/owner-audioreview-card-geometry-20260905` → `d1cc5c7d3e5756ea3f5cc0f240541d6fc95a52c1`;
- `events-bot-new:agent/static-site-single-kaggle-contract` → `2fe28b1f831ac607c0415a8aa6c2beab9eb67fac`;
- `lovekgd-design-system:integration/launch-normalized-sot-penpot-20260902` → `4b8c79ab60425b89075004b201c78cccf7019b31`.

Compare d1→2fe: ahead на четыре commits, behind=0; изменения включают snapshot/builder checks и ограниченные Share/typography repairs. Source layout read с d1 не называется снимком опубликованного 0b08; immutable public captures ниже имеют собственный source.

Latest прочитанный CODE receipt публикует:

```text
public source: 0b08f0a806a9531c8bf253672e1bb5c712764064
prefix: /preview-real-0b08f0a80-normalized-20260905-v1/
manifest SHA256 (reported by CODE):
  9c0880c61428cfc40c83e53ee447c39c6ec5df447bb3c328540995c71697cd0d
snapshot: issue621-audioreview-20260904T205339Z
snapshot SHA256:
  14950c626a9e1e977e0d734fc4e7ddf93769ea038ddbde2d9db732d402da5049
clock: 2026-09-04T22:53:39+02:00
data mode: real / page_classes=all / catalog slice300
```

Это не full catalog и не доказательство всей нормализации. `2fe28b1…` на этом срезе ещё не опубликован; будущий successor требует fresh read. CODE-результаты 241/242 теста и matrix cells цитируются только как внешние receipt сведения; эти тесты в данном окне **не запускались**.

## 3. Реальные компоненты: глубина чтения

Проверены не только концептуальные тексты. Полностью прочитан `MobileBottomNav.astro`: один компонент, четыре destination links через существующий resolver, controlled icon assets, fixed inset geometry и selected state. Полностью прочитан `MobileToastRegion.astro`: нижний `--ke-lower-surface-offset`, queue/dedupe/generation, timer pause, persistent errors/actions, взаимодействие с drawer/modal и pagehide cleanup.

`EventLayout.astro` прочитан в части imports/props/mode derivation/secondary navigation/runtime-card-template и начальной CSS geometry; поздняя большая inline runtime часть не объявляется полностью проаудированной. Поэтому FI-P1 сначала находит **существующие** actual layout functions и расширяет их, не предполагая отсутствия owner по одному имени файла.

`KeyboardEventNavigation.astro` и начальная часть `KeyboardEventNavigationPrototype.astro` подтверждают единый controller import/destroy/init и отключённый teaching panel на production. Полный `keyboardEventNavigation.mjs` в этом окне не тестировался. Это основание переиспользовать owner, а не объявить его все keyboard paths правильными.

Source tree и family registry подтверждают реальные `AdaptiveEventCardGrid`, `EventCard`, `EventCtaPanel`, `FreeCollectionSurface`, `AuthorizedEventSearch`, `ExhibitionsPersonalSurface`, `HomeHeroTalk` и другие consumers. Listing этих файлов **не называется полным аудитом их кода**. Матрица применимости — системное проектирование на основе ownership, а не отчёт об исполнении всех маршрутов.

## 4. Существующие reference concepts: что переносится и что нет

[Screen observations](screen-observations.json) прочитаны как сохранённый источник. Исторический автор visually reviewed шесть исходных изображений; raw media в Git не хранятся. В данном окне перечитаны observations, а не повторно просмотрены те шесть приватных screenshots. Skeleton boards не получают статус pixel-accurate baseline KenigEvents.

| Исторический пример | Полезный переносимый принцип | Применение / ограничение в v1 |
|---|---|---|
| Home с menu/mode/audio/composer | Разные semantic owners могут быть визуально отделены | Brand/context/task roles; не переносим чужую IA, font или состав функций. |
| Reading + transient scroll utility | Действие возврата к результату независимо от чтения | «Новый ответ ↓» появляется без перехвата scroll. |
| Chat list с сравнительно монолитной шапкой | Rounded controls не требуют всё разбивать на острова | Обычный header/flow fallback остаётся допустимым. |
| Conversation с back/identity/utilities/pinned context | Родственные controls группируются, контексты различаются | Page/section/task separation; не копируем чужой чат. |
| Immersive media controls | Media canvas может начинаться от верхнего края | C5 candidate только с crop/contrast/target baseline. |
| Persistent mini-player + nav | Состояние и destinations имеют разные lifecycles | Роль persistent_state предусмотрена, **новый плеер не поручен**. |

Пустые source-era `reuse_existing/new_component` и unresolved material slots в observations сохраняются как история reference research, не текущая implementation команда. Текущие решения находятся в system-design и consumer matrix. Ранее нарисованные `variant-a-distributed`/`variant-b-split-dock` не превращаются задним числом в принятые site-specific C1–C6.

## 5. Голосовые owner notes: решения, а не буквальное копирование каждой гипотезы

Прочитаны расшифровки из idea-hub:

| Документ | Что учитывается |
|---|---|
| [002114](https://github.com/onedayonemasterpiece/idea-hub/blob/main/inbox/voice/2026/09/voice-20260905-002114-a0677098.md) | Потеря контекста/неодинаковые geometry/иконки, future partial header и media-from-top; нельзя утратить CTA label или content semantics ради чистоты. Исходное сомнение о gallery не трактуется как доказательство её отсутствия после уточнения. |
| [003237](https://github.com/onedayonemasterpiece/idea-hub/blob/main/inbox/voice/2026/09/voice-20260905-003237-8a342775.md) | Обычная трёхколоночная desktop выборка, crop и reading order; не канонизировать неверную Free-страницу. |
| [092949](https://github.com/onedayonemasterpiece/idea-hub/blob/main/inbox/voice/2026/09/voice-20260905-092949-7ab7703f.md) | Grounded voice discovery, retained answers и возможность уточнения. «Три бесплатно», возможная оплата/перемещение mic — высказанные гипотезы, не автоматическая отмена последующего auth-only/динамического allowance контракта #587. |
| [094341](https://github.com/onedayonemasterpiece/idea-hub/blob/main/inbox/voice/2026/09/voice-20260905-094341-67f72ad8.md) | Thin Fly / отдельный execution / caching принадлежат Search technical owner, не системному chrome. |
| [094737](https://github.com/onedayonemasterpiece/idea-hub/blob/main/inbox/voice/2026/09/voice-20260905-094737-dfa8cdc1.md) | Честная capability availability, будущие source recommendations. Изменение availability не должно удалять control под пальцем или скрывать active capture. |

Ссылки idea-hub указывают на доступные имена документов; смысл принятого поведения дополнительно закреплён неизменяемым Search SHA `62c54ce…` и постановкой. Сырые аудио/частные screenshots и пользовательские личные данные в этот публичный пакет не копируются.

## 6. Обнаруженные расхождения и выбранное решение

| Было / риск | Решение v1 | Степень полномочий |
|---|---|---|
| PR47/39 блокируют проектирование полным site-wide P | FI-01 разделяет design сейчас, target-baseline adoption позже | Прямое уточнение владельца в постановке; старые тексты адресно переведены на этот routing. |
| «Нельзя четвёртый остров» | Допускается совместная работа header/context/nav/composer | Прямое owner clarification, также #621/#587. |
| Любой rounded блок = новый fixed island | Surface/composition/semantics/layout различаются; single shelf in-flow | Выбранное системное решение, candidate ещё не визуально принят. |
| July mobile-shell toast под header | Текущий AR17 и runtime используют нижние app-owned surfaces | Более поздний contract + фактический MobileToast source; не переизобретаем queue. |
| Nav исключительно mobile / исчезновение на scroll | Четыре принятых destinations на desktop/mobile, nav стабилен | Текущий AR18; keyboard-pressure исключение — proposed узкое правило, не разрешение hide-on-scroll. |
| Multi-island означает навигацию вместе с transactional CTA | Сохраняется existing nav XOR CTA | Текущий explicit shell contract; иное требует отдельного owner amendment. |
| Page context якобы отсутствует везде | На 4ff Popular уже видна «Наверх: Популярное» | Личное browser observation; новый section context развивает существующий page-context owner. |
| «Бесплатно» по-прежнему two-column special page | На 0b08 видно обычные три desktop колонки и единый список; count — metadata | Личное ограниченное наблюдение, не полный data acceptance и не повод снова переделывать Free. |
| Source/preview/P разных дат смешиваются в PASS | Separate immutable baseline tuple и отдельные verdicts | Existing A=S=P authority; эта работа не меняет STATUS. |
| Над модальным окном осталась скрытая запись | FI-16 предлагает stop/finish ack либо deferred open | Новое bounded adapter решение; должно быть согласовано и реализовано вместе с Search owner, не утверждение уже существующего API. |
| Старый skill требует отсутствующий npm script | FI-P1 указывает реальные package scripts и отдельную routing correction | Наблюдение по фактическому package; запрещённые foundations/skill/runtime здесь не менялись. |

## 7. Лично выполненные browser-наблюдения

Временная headless browser session, изображения **1280×720**, anonymous. Были реально выполнены navigate, observe, PageDown и screenshot. Установку и настоящий phone keyboard эта сессия не проверяла.

| Время UTC / страница | Действие / наблюдение | Evidence artifact / SHA256 |
|---|---|---|
| 09:31:16, 4ff Popular | Top screenshot: primary bottom dock из четырёх destinations, full header, H1, cities и полка | `floating-islands-baseline-popular-desktop.png`; `artifact://400d2da0-f2b8-4ef4-b535-00dbcda72f80`; `9e51adcb603a89f371835871767652dd8a183717ab6d61a791dafdc52bebd5b6` |
| 09:31:46, тот же 4ff Popular | Настоящий PageDown: compact «Наверх: Популярное», cities и nav сохранены, ниже другой section | `floating-islands-baseline-popular-scrolled.png`; `artifact://6086ad5d-f57e-4c19-80f0-17d5ee913927`; `a7b574444e3ae35c2c49af4644836efe77325c43dafaefa87f82a5d64d5dbe52` |
| 09:34:52, current published 0b08 Free | HTTP200; H1, единый section, shown12/111, три desktop колонки, bottom nav | `floating-islands-baseline-free-current.png`; `artifact://eec8c061-923b-4ae7-b11b-633559b87b09`; `587b392b9a9cde42949548267093e0884447829849e414c780c892e783bb81d8` |
| 09:35:11, 0b08 Search | HTTP200; anonymous input surface, сообщение о входе через Yandex, nav Search selected. Ничего не отправлено | `floating-islands-baseline-search-anonymous.png`; `artifact://855e1aee-c962-43db-be6e-c44bce7c1160`; `e98803d4e2731b89d9376a376e597409ea72b52b07340cf28a059e6844fac589` |

4ff prefix: `https://kenigevents.ru/preview-real-4ff0aeb9f-normalized-20260905-v1/`; 0b08 prefix: `https://kenigevents.ru/preview-real-0b08f0a80-normalized-20260905-v1/`. Initial 4ff review hub также открыт HTTP200; это не обход всех linked archetypes.

`artifact://` — references browser tool этой сессии; **не публичные GitHub URL и не утверждение, что PNG bytes закоммичены**. Их inline images были показаны в разговоре; здесь сохранены точные provenance/hashes. Для permanent release evidence исполнитель должен записать реальные доступные PNG/DOM outputs в существующее evidence storage с readback, либо переснять pinned URL. Нельзя подставить metadata вместо screenshot bytes и назвать P materialization завершённой.

## 8. Penpot и что не проверено

`Penpot.high_level_overview` вызван и прочитан. Затем реальная попытка `execute_code` для чтения current file/pages/components заблокирована проверкой безопасности инструмента. Это не отсутствие попытки, не доказательство исправности файла и не разрешение обойти блок другим API/connector/browser.

**В этом окне нет verified Penpot file/page/revision/components, нет native writes, нет A=S=P PASS.** Проектирование продолжено документально; future materialization использует существующий exporter, family bindings и sole-writer. Новая картинка-имитация Penpot не создавалась.

Не выполнялись: full site build, npm/unit/browser suites FI-P1, настоящий mobile keyboard/IME/OSK, mic/ASR/provider calls, authenticated Search, production deployment, изменение shared foundations/STATUS. Не все component source bodies и не все product routes personally inspected. Конкретный выполненный объём указан выше; все 32 сценария FI-P1 имеют пока статус **спроектированы**, не выполнены.

## 9. Открытые решения не блокируют остальной дизайн

Материал/blur/border/elevation нового header и singleshelf, точные новый compact title box/spacing и переходы выбираются на actual candidate из existing tokens при owner review. Это сознательно отделено от уже принятой nav, а не предложение «пока ничего не решать». Назначение/состав ролей, выбранные C1–C6, конфликты, fallback ladder, ответственность, сценарии и первый consumer определены.

Для visual acceptance остаются реальные target S/P bindings, baseline/candidate geometry и актуальный owner verdict. Для Search activation — действующие #587 технические release gates и FI-16 handshake. Для каждой material family migration — свой scope и честные проверки. Незавершённая unrelated page не запрещает продолжать готовый bounded пакет.

## 10. Проверенные первичные платформенные основания

Эти ссылки уточняют платформенную семантику; они не меняют authority KenigEvents:

- W3C [Focus Not Obscured Minimum](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum) и [Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced.html): не смешивать минимальную видимость с выбранной полной видимостью focus/control.
- W3C [Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): focus containment/return и non-interactive background относятся к настоящему modal, не любому floating panel.
- W3C [Target Size Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced): 44 CSS px — enhanced target; в FI-P1 это явно принятая проектная цель для primary touch controls, а не неверное описание всех AA exceptions.
- MDN [position](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position): sticky зависит от scrolling ancestor/containing block и создаёт stacking context.
- MDN [VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport): offsetTop/Left, width/height в CSS pixels, отдельный scale; keyboard и pinch могут изменить visual viewport отдельно от layout viewport. Поэтому FI-08 не выводит точную keyboard height из единственной разности окон.

Проверено web-read 2026-09-05. Остальные алгоритмы, budget и rollout выше — проектные решения, чья работоспособность ещё должна быть доказана указанными тестами.

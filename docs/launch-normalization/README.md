# Нормализация UI KenigEvents — 48-часовой запуск

Статус: `ACTIVE`  
Координация: `onedayonemasterpiece/events-bot-new#621`  
Параллельные роли: [`PARALLEL-WINDOWS.md`](PARALLEL-WINDOWS.md)

Это текущий операционный маршрут. Старый ASP conveyor в
`lovekgd-design-system#57` используется только как donor/history: его
многоступенчатая очередь, технические roots и формальные write receipts не
являются текущим процессом. Предыдущий запуск наглядно показал, что регистрация
ролей и materializer phases не гарантируют видимый продуктовый результат.

## 1. Цель

Сначала получить нормализованную, управляемую UI-систему; только после этого
переходить к изменениям интерфейса и закрытию продуктовых UI gaps.

```text
fresh production events
→ восстановленная существующая Astro generation
→ технический fresh-data baseline
→ параллельная нормализация foundations/components/routes
→ my-browser-bridge DOM + computed-style drift loop
→ первый owner-facing уже нормализованный /<buildId>/__preview/
→ thin S + native Penpot masters/linked instances
→ internal Golden A=S=P
→ UI-gap/change work
→ release build на свежих реальных данных
```

Владелец смотрит реальные продуктовые страницы с реальными событиями. Golden
Corpus нужен для детерминированного A=S=P, а не как обязательная поверхность
owner review.

## 2. Фактическая модель продукта

Исполняемый продукт уже существует в `events-bot-new` и существенно
componentized. Задача — не нарисовать новый сайт, а устранить исторический drift.

Фактические date/weekend routes:

```text
/segodnya/                  current build date
/zavtra/                    next date
/date-YYYY-MM-DD/           arbitrary date
/vyhodnye/                  active/nearest Saturday–Sunday range
/vyhodnye/YYYY-MM-DD/       selected available weekend range
```

`/segodnya/`, `/zavtra/` и `/date-YYYY-MM-DD/` используют общий
`DateListingSurface`. Weekend routes используют отдельный общий
`WeekendListingSurface`. Разные композиции сохраняются; одинаковые foundations,
cards, controls, media и icons обязаны иметь общие roots.

Существующая owner entry point:

```text
/<buildId>/__preview/
```

Новые `/lab/launch/*` routes не создаются. `/lab/design-system/` остаётся
внутренним regression harness и не является owner checkpoint.

## 3. Можно ли нормализовать до первой генерации

Да — F0/M0/A0 начинают source-level normalization параллельно с восстановлением
generation. Но N0 обязан сначала получить технический fresh-data baseline,
чтобы отличать дефекты сборки/данных от последствий изменений UI.

Технический baseline не обязательно показывать владельцу. Первый owner-facing
preview должен по возможности появиться уже после первой integrated
normalization wave и V0 browser audit.

Family нельзя назвать завершённой до:

1. сборки на свежих реальных данных;
2. проверки actual consumers;
3. V0 DOM/computed-style verdict;
4. устранения critical `DRIFT`.

## 4. Authority; нового SoT нет

### `events-bot-new`

Владеет executable normalized UI:

- `site/src/styles/design-system.css` — foundations и semantic tokens;
- `site/src/components/design-system/**` — primitives;
- `site/src/components/**` — product component families;
- `site/src/layouts/**`, `site/src/pages/**` — actual route compositions;
- export/preview/production/Kaggle generation;
- browser behaviour и release checks.

Branch:

```text
integration/ui-normalization-launch-20260902
```

### `lovekgd-design-system`

Владеет тонкой cross-surface записью:

- stable family/component IDs;
- component/variant/state/composition decisions;
- exact Astro source и actual consumer bindings;
- exact visible SVG/raster identities;
- Golden fixture/route bindings;
- Penpot master/page placement;
- browser и A=S=P statuses;
- selective donor evidence.

Здесь не создаётся вторая независимо редактируемая Astro-реализация.

Branch:

```text
integration/launch-normalized-sot-penpot-20260902
```

### Penpot

Владеет native tokens/components/variants, linked instances, actual-route review
boards, comments и exports. `R0.PENPOT` — единственный writer. Penpot следует за
завершёнными family waves, но не блокирует Astro normalization.

## 5. Единый component root — основная гарантия отсутствия drift

Визуально и поведенчески одинаковая сущность обязана иметь:

- один canonical Astro component root либо один variant family root;
- одного владельца anatomy и family CSS;
- один canonical SVG на semantic action;
- полный actual consumer inventory;
- один native Penpot master/variant family;
- только linked Penpot instances на route boards.

Различия допустимы как именованный `variant`, `state` или `composition`. Локальная
копия разметки/стилей, которая выглядит как family, но не наследует её root,
является `DRIFT`, даже если визуально сейчас совпадает.

Каждый root отдаёт диагностические поля:

```text
data-ds-family
data-ds-version
data-ds-variant
data-ds-state  # когда применимо
```

Source checks доказывают импорты одного root; V0 через my-browser-bridge
сравнивает нормализованный DOM anatomy и invariant computed-style signature
между actual consumers.

## 6. Foundations и цветовая нормализация

Нормализация включает:

- canonical font families/weights;
- H1/H2/H3/H4, body, label, metadata roles;
- spacing/sizing, containers и breakpoints;
- radii, borders, elevation, layering;
- semantic color tokens;
- ровно четыре semantic icon-size roles;
- canonical visible SVGs, brand и medallions.

Цветовой contract:

- каждый видимый UI-цвет происходит из token/semantic alias;
- raw literals разрешены только в canonical token registry, image data и
  документированном техническом исключении;
- exact duplicate colors объединяются;
- near-duplicates машинно кластеризуются и объединяются при одинаковом semantic
  role;
- сохранённая близкая пара должна иметь различимую semantic/contrast причину;
- новая палитра выбирается после закрытия drift, чтобы изменение нескольких
  central token values меняло весь сайт предсказуемо.

Icon contract:

```text
ровно 4 semantic size roles
→ concrete width/height только в central tokens/utilities
→ consumer выбирает роль
→ local icon dimensions запрещены
→ изменение одного role value обновляет все его consumers
```

## 7. MediaFrame и framing

Framing обязан быть закрыт на shared owner, а не исправляться page-local CSS.
Contract включает:

```text
media role
frame ratio
contain / cover
crop permission
focal/object position
clip and overflow
fallback/loading
responsive resource behaviour
```

Обязательные donors:

```text
events-bot-new/docs/features/static-site-pages/image-framing.md
site/src/lib/relatedCardLayout.mjs
site/src/components/OptimizedEventCardGrid.astro
```

Существующий framing/row optimizer расширяется и нормализуется; параллельный
алгоритм не создаётся без доказанной невозможности reuse. V0 измеряет реальные
bounds, `object-fit`, aspect ratio, overflow и clip в браузере.

## 8. AdaptiveEventCardGrid

Сейчас часть related/discovery rows использует optimizer, а ряд
free/search/unusual/gastronomy/preview surfaces остаётся на простых локальных
`.cards-grid`. Это входит в normalization scope.

Целевой общий family contract:

- row/grid container занимает доступную ширину `100%`;
- column count и card width зависят от available width и density variant;
- cards в строке совместно заполняют ширину без phantom column;
- последняя неполная строка имеет явный one-/two-/three-up variant и тоже
  использует доступную ширину;
- media и total card heights согласованы внутри строки;
- framing policy нельзя переопределять локальным grid CSS;
- mobile/compact desktop transitions не дают overflow;
- browser gate измеряет row occupancy, gaps, bounds, ratios и equal heights.

Все multi-card consumers либо мигрируются на один `AdaptiveEventCardGrid` root,
либо получают документированную композиционную причину оставаться variant той
же family.

## 9. Browser/DOM drift loop

V0 — отдельное read-only ChatGPT window с my-browser-bridge. После каждого
integrated preview оно проверяет actual DOM и computed styles на реальных
routes, включая `/`, date/weekend, free collection, popular, exhibitions,
festivals и event detail.

Минимальные viewport classes: desktop wide, desktop compact, mobile 390–430.

V0 проверяет:

- family/variant/version/state markers;
- одинаковую anatomy одинаковых family variants;
- typography, spacing, colours, radii, borders и icon sizes;
- image framing, bounds, overflow и clip;
- AdaptiveEventCardGrid occupancy/equal heights;
- responsive composition и horizontal overflow;
- page-local computed-style deviations.

Вердикты:

```text
PASS
DRIFT        → сразу F0/M0/A0 на исправление
PRODUCT_GAP  → backlog после normalization gate
BLOCKER
```

Source declaration, тест или commit без фактического browser evidence не
закрывает drift.

## 10. Internal Golden A=S=P

Один frozen `Europe/Kaliningrad` Friday clock использует настоящие routes:

```text
/segodnya/                              Friday
/zavtra/                                Saturday
/date-YYYY-MM-DD/                       Sunday
/vyhodnye/                              те же Saturday + Sunday occurrences
/podborki/besplatnye-sobytiya/          free subset
```

Target density: `5 / 6 / 5`, minimum `4 / 5 / 4`. Нужны разные media, title и
address lengths, exact/absent time, free/paid/sold-out, calendar,
cancelled/rescheduled, continuing exhibition и medallion cases. Synthetic
record разрешён только для отсутствующего stress cell и явно маркируется.

Владелец может посмотреть Golden позже, но не обязан принимать его до
normalization.

## 11. Параллельные роли

- `N0`: generation, technical baseline, integration, status, preview, release;
- `F0`: foundations, typography, spacing, colors, four icon roles, SVG/brand;
- `M0`: component roots, MediaFrame, EventCard/ListingEventCard,
  AdaptiveEventCardGrid;
- `A0`: shell, listings, actual routes, consumer migration;
- `V0`: my-browser-bridge DOM/computed audit; позже Golden Astro↔Penpot;
- `K0`: консультант и prompt author;
- `R0`: bounded Codex worktrees и sole Penpot writer.

Подробные границы и first results: [`PARALLEL-WINDOWS.md`](PARALLEL-WINDOWS.md).
Нет обязательной цепочки `MAT → QA → INTEGRATE → PUBLISH` и нет нового
оркестратора. N0 интегрирует meaningful family waves; V0 проверяет уже
собранный продукт.

## 12. Owner-visible checkpoints

`T+0` — момент, когда N0 начал fresh-data generation и одновременно запущены
минимум F0/M0/A0/V0. Отдельное ожидание формального «accept» от каждого окна не
нужно.

| Latest | Что доступно владельцу |
|---:|---|
| T+1h | technical fresh-data generation verdict; baseline identity сохранена |
| T+3h | compact census: roots, colors, typography, icons, framing, card rows |
| T+6h | первый уже нормализованный real-data `/<buildId>/__preview/` + V0 DOM verdict |
| T+10h | MediaFrame, EventCard roots и AdaptiveEventCardGrid на real data |
| T+14h | free + today/tomorrow/date/weekend actual routes normalized |
| T+18h | Penpot foundations/icons/media/cards/free board + first Golden verdict |
| T+24h | не менее половины launch route families normalized; fresh preview |
| T+32h | `ASTRO_NORMALIZATION_PASS` либо один bounded deviation |
| T+36h | internal Golden coverage launch-critical families |
| T+40h | UI-gap/change work открыто; fresh production-form candidate |
| T+44h | Penpot launch-scope masters и linked representative route boards |
| T+48h | final real-data candidate, normalization report, critical A=S=P |

Checkpoint — это build/report/browser/Penpot/release result, а не commit, test,
empty page или hidden tree.

## 13. Normalization gate перед изменением интерфейса

`ASTRO_NORMALIZATION_PASS` требует:

- fresh-data generation воспроизводится;
- foundations и цвета tokenized;
- four icon roles применены всеми consumers;
- одинаковые компоненты имеют единые roots;
- MediaFrame/framing закрыт;
- AdaptiveEventCardGrid внедрён во все применимые consumers;
- actual routes мигрированы;
- V0 browser audit не содержит critical DRIFT.

После этого можно начинать redesign/palette exploration и product UI gaps.
Изменение затронутой family не готово к release до обновления thin S и Penpot
binding.

## 14. Required normalization report

Итоговый compact report содержит:

- font families/weights и H1–H4/body/label/metadata;
- spacing/sizing/containers/breakpoints;
- semantic colors и merged duplicates;
- radii/borders/elevation/layering;
- four icon roles, values и consumer map;
- canonical SVG identity map;
- MediaFrame contract и repaired framing;
- component roots, variants/states и actual consumers;
- AdaptiveEventCardGrid variants и migrated surfaces;
- removed page-local forks/overrides;
- remaining bounded deviations;
- fresh real-data preview и V0 browser verdict;
- Penpot linked-instance и A=S=P status.

## 15. Не делать

- новый SoT/repository/package до запуска;
- новую owner-facing лабораторию;
- ещё один global decoder/audit вместо bounded census;
- новую lifecycle/governance generation;
- full old-Penpot reconstruction;
- bespoke Penpot runner на каждую family;
- owner-operated message forwarding;
- смешивание `PRODUCT_GAP` с normalization `DRIFT`;
- объявление PASS только по source code или тестам.
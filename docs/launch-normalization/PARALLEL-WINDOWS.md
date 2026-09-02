# Параллельная работа окон — нормализация UI KenigEvents

Статус: `ACTIVE`  
Координация: `onedayonemasterpiece/events-bot-new#621`

Этот документ задаёт простую рабочую топологию. Окна работают параллельно над
одним продуктовым результатом; они не образуют новый оркестратор и не ждут
последовательных handoff-ов друг от друга.

## 1. Порядок результата

```text
N0 восстанавливает экспорт и сборку на свежих production events
+ F0/M0/A0 одновременно начинают нормализацию текущего Astro
→ N0 сохраняет технический fresh-data baseline для сравнения
→ первая волна foundations/components/routes интегрируется
→ V0 проверяет фактический DOM и computed styles через my-browser-bridge
→ исправляются найденные DRIFT
→ владелец получает первый уже нормализованный /<buildId>/__preview/
→ следующие family waves проходят тот же цикл
→ thin S и Penpot догоняют завершённые family waves
→ после ASTRO_NORMALIZATION_PASS открываются продуктовые UI-gap/change работы
```

Первый технический baseline не является обязательным owner review. Он нужен,
чтобы отделить поломку генерации от последствий нормализации. Первый
owner-facing preview должен по возможности уже содержать первую завершённую
волну нормализации.

Нормализацию разрешено начинать до публикации первого preview. Нельзя объявлять
family завершённой, пока она не собрана на свежих реальных данных и не прошла
V0 DOM/computed-style audit.

## 2. Роли окон

### N0 — генерация, интеграция, статус, release

Инструменты: GitHub, Codex/DevCoveer; доступ к фактическому production snapshot
и существующему static-site builder.

Владеет:

- восстановлением существующих export/build/preview/Kaggle путей;
- техническим fresh-data baseline;
- integration branch `integration/ui-normalization-launch-20260902`;
- последовательным объединением готовых волн F0/M0/A0;
- публикацией exact `/<buildId>/__preview/`;
- `STATUS.md`, итоговым normalization report и release candidate.

Не проектирует заново foundations и component families. Не публикует сырую
ненормализованную страницу как обязательный owner checkpoint.

Первый результат: подтверждённый fresh-data build baseline и точная причина,
если существующая генерация не воспроизводится.

### F0 — foundations, цвета, типографика, spacing, icons

Владеет:

- canonical typography roles: H1–H4, body, label, metadata;
- spacing/sizing, containers, radii, borders, elevation, layering;
- полным census фактически используемых UI-цветов и SVG fill/stroke;
- semantic color tokens и сведением одинаковых/почти одинаковых цветов;
- четырьмя semantic icon-size roles;
- canonical SVG identity, brand и medallion primitives.

Основные writable paths:

```text
site/src/styles/design-system.css
site/src/components/design-system/**
site/src/components/Icon.astro
site/src/components/SocialIcon.astro
site/src/components/brand/**
```

`EventLayout.astro` остаётся интеграционно чувствительным: F0 формулирует
необходимые token migrations, а N0/A0 применяют их без параллельного скрытого
редактирования одного файла.

Цветовой gate:

- видимый UI-цвет после нормализации берётся из token/semantic alias;
- raw literals разрешены только в canonical token registry, данных изображений
  и явно документированном техническом исключении;
- exact duplicates объединяются;
- near-duplicates сначала кластеризуются машинно, затем объединяются, если у
  них один semantic role;
- сохранённая близкая пара обязана иметь различимую semantic/contrast причину;
- новая цветовая гамма выбирается только после закрытия drift, чтобы смена
  token values меняла весь сайт предсказуемо.

Первый результат: foundations/color/icon census и первая центральная token wave.

### M0 — component roots, MediaFrame, EventCard и adaptive rows

Владеет:

- решением `component / variant / state / composition / accidental drift`;
- объединением визуально и поведенчески одинаковых компонентов под один root;
- MediaFrame, framing/crop/focal/clip/fallback;
- EventCard и ListingEventCard anatomy/variants;
- общим компонентом адаптивной строки/сетки карточек.

Основные writable paths:

```text
site/src/lib/relatedCardLayout.mjs
site/src/components/OptimizedEventCardGrid.astro
site/src/components/EventCard.astro
site/src/components/listings/ListingEventCard.astro
site/src/components/EventMediaRail.astro
семейные card/media components, явно назначенные N0
```

Существующие `relatedCardLayout.mjs`, `OptimizedEventCardGrid.astro` и
`docs/features/static-site-pages/image-framing.md` — обязательные donors. Новый
параллельный row/framing algorithm запрещён без доказанной невозможности
расширить текущий.

Первый результат: component-root census, MediaFrame repair и canonical
AdaptiveEventCardGrid contract.

### A0 — shell, listings, actual routes и consumer migration

Владеет:

- `EventLayout`, navigation, footer, floating/contextual surfaces;
- DateListingSurface и WeekendListingSurface как разными композициями;
- actual route archetypes;
- миграцией страниц на canonical families;
- удалением page-local forks и внутренних visual overrides.

Основные writable paths:

```text
site/src/layouts/**
site/src/components/listings/**
site/src/pages/**
```

A0 не копирует компонентную разметку в страницы и не создаёт новые
owner-facing `/lab/launch/*` routes. При отсутствии нужного family API он
фиксирует запрос M0/F0, но продолжает независимый consumer census.

Первый результат: полный actual-consumer map и миграция ключевых routes после
первой family wave.

### V0 — независимый browser/DOM audit; позже Penpot A=S=P

Инструменты: my-browser-bridge, GitHub; позднее Penpot read/export.

На этапе Astro-нормализации V0 работает read-only и после каждого integrated
preview проверяет реальный браузерный DOM и computed styles. Он не исправляет
код сам и не принимает source declarations за доказательство.

Минимальная матрица:

```text
/
/segodnya/
/zavtra/
/date-YYYY-MM-DD/
/vyhodnye/
/podborki/besplatnye-sobytiya/
/populyarnoe/
/vystavki/
/festivali/
одна реальная /sobytiya/<slug>/
```

Минимальные viewport classes: desktop wide, desktop compact, mobile 390–430.

V0 проверяет:

- family/variant/version/state markers и нормализованный DOM signature;
- одинаковую anatomy одинаковых family variants на разных routes;
- computed typography, spacing, colors, radii, borders, icon sizes;
- bounds/overflow/clip и фактический image framing;
- row width occupancy, отсутствие phantom columns, equal row heights;
- responsive transitions и отсутствие horizontal overflow;
- page-local computed-style drift.

Вердикты:

```text
PASS          family/route соответствует contract
DRIFT         нарушение нормализации; сразу назначается F0/M0/A0
PRODUCT_GAP   новая продуктовая доработка; записывается, но не смешивается с drift
BLOCKER       сборка/браузер/данные не позволяют получить фактическое доказательство
```

После появления Penpot V0 тем же способом сравнивает Golden Astro и Penpot
exports. Penpot write остаётся только у `R0.PENPOT`.

Первый результат: baseline DOM/computed-style drift report; затем PASS/DRIFT на
первом нормализованном preview.

### K0 — консультант владельца

K0 fresh-read-ит durable state, диагностирует один реальный bottleneck и выдаёт
короткие prompts для N0/F0/M0/A0/V0/R0. K0 не реализует код, не пишет Penpot и
не создаёт новый управляющий контур.

### R0 — direct persistent Codex execution

R0 выполняет bounded code changes в раздельных worktrees и является
единственным Penpot writer. Рабочие lanes:

```text
FOUNDATIONS
MEDIA-CARDS
SHELL-LISTINGS
MERGE-TEST
RELEASE
PENPOT
```

ChatGPT-окна владеют продуктовым решением и проверкой результата; R0 не должен
самостоятельно менять scope или объявлять normalization PASS.

## 3. Гарантия единого component root

Визуально и поведенчески одинаковая сущность считается одной family и обязана
иметь:

1. один canonical Astro component root либо один variant family root;
2. одного владельца anatomy и family CSS;
3. один canonical SVG для каждой semantic action;
4. один consumer inventory всех actual routes;
5. один native Penpot master/variant family;
6. только linked Penpot instances на route boards.

Различия допускаются только как именованный variant, state или composition.
Локальная копия разметки/стилей, которая выглядит как family, но не наследует её
root, является `DRIFT`.

Для браузерной проверки каждый root должен отдавать стабильные diagnostics:

```text
data-ds-family
data-ds-version
data-ds-variant
data-ds-state  # когда state применим
```

V0 нормализует динамический текст/ID и сравнивает DOM anatomy плюс invariant
computed-style signature между consumers. Source census дополнительно должен
доказать, что страницы импортируют family, а не держат скрытую копию.

## 4. AdaptiveEventCardGrid

Все поверхности, где несколько EventCard располагаются в строке, проходят
consumer census. Целевой общий family contract:

- row/grid container занимает доступную ширину `100%`;
- column count и card width зависят от доступной ширины и именованного density
  variant, а не от случайной page-local ширины;
- карточки одной строки совместно заполняют ширину без необъяснимой пустой
  колонки;
- остаточная последняя строка имеет явный `one-up / two-up / three-up / ...`
  layout variant и также использует доступную ширину;
- media/card heights согласованы внутри строки;
- framing policy не меняется локальным grid CSS;
- mobile переходит в утверждённый одно-/двухколоночный variant без overflow;
- browser gate измеряет фактическую занятость строки, gaps, card bounds,
  media ratio и equal-height contract.

Простые `.cards-grid` consumers в free/search/unusual/gastronomy/preview и
специализированные optimized/related grids должны быть либо мигрированы на один
family root, либо иметь документированную композиционную причину оставаться
отдельным variant того же family.

## 5. Normalization gate перед UI-gap work

Новые изменения интерфейса и закрытие продуктовых UI gaps начинаются только
после `ASTRO_NORMALIZATION_PASS`:

- fresh-data generation воспроизводится;
- foundations и цвета tokenized;
- четыре icon-size roles применены всеми consumers;
- одинаковые компоненты имеют единые roots;
- MediaFrame/framing закрыт;
- AdaptiveEventCardGrid внедрён во все применимые consumers;
- actual routes мигрированы;
- V0 browser DOM/computed-style audit не содержит critical DRIFT.

Penpot и internal Golden догоняют family waves параллельно. Любая новая
продуктовая доработка затронутой family не считается готовой к release, пока её
thin S и Penpot binding не обновлены.

## 6. Коммуникация

Единый mailbox: issue #621. Публикуются только:

```text
[RESULT]
[OWNER_REVIEW_READY]
[DRIFT]
[BLOCKER]
```

N0 обновляет `STATUS.md`. Владелец не переносит task IDs, branches или
результаты между окнами.
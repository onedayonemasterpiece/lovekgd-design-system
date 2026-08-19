# 01 — Наблюдаемые паттерны Consta

## Метод

Каждое утверждение ниже помечается как один из трёх типов:

- **Observed** — напрямую видно в Figma metadata или официальном source;
- **Inferred** — правдоподобный вывод из нескольких observed facts, но не заявляется как правило Consta;
- **Recommendation** — проектная адаптация для LoveKGD.

Исследование оценивает не visual style Consta, а способ упаковки, поиска, понимания и сопровождения design-system knowledge.

## 1. Figma: `GallerySlider` как документационная страница

**Observed.** Node `2233:99065` в файле `0Zym9QbjtLvJUFMkpqRBE1` содержит не один component set, а полный documentation canvas.

### 1.1. Три темы представлены параллельно

На canvas находятся три самостоятельных крупных блока:

```text
DefaultTheme
DisplayTheme
DarkTheme
```

Каждый блок повторяет одинаковую структуру и содержит header со ссылкой на Storybook. Это позволяет визуально сравнить theme parity и обнаружить расхождения без переключения mode.

**Сильная сторона:** сравнительный review становится быстрым и очевидным.

**Риск:** если три блока являются независимо редактируемыми masters, изменения могут разойтись. Для LoveKGD параллельные frames допустимы как generated documentation snapshots, но не как три authority sources.

### 1.2. Основной component показан как матрица свойств

В каждой теме `GallerySlider` представлен девятью именованными combinations:

```text
Indicator: On | Off
IndicatorPosition: Bottom | Left | None
Text: On | Off
TextPosition: Outside | Inside | None
```

Комбинации разложены по визуальным осям, а рядом показаны hover specimens. Это лучше случайной галереи: дизайнер видит не только внешний вид, но и модель вариативности.

**Recommendation.** В LoveKGD оси должны поступать из Component Contract и использовать одинаковые canonical names в:

```text
contract variant_axes/state_axes
→ Penpot component properties
→ Astro props/state resolver
→ generated state_key
→ test names
→ documentation headings
```

### 1.3. Compound component декомпозирован

Помимо девяти итоговых `GallerySlider` combinations, для каждой темы показаны supporting component sets:

| Supporting set | Наблюдаемые axes | Число specimens на тему |
|---|---|---:|
| `ImageContainer` | `Slide=1`, `Slide=>1`, `Slide=Loader` | 3 |
| `Indicator` | `Position=Horizontal/Vertical` × `Type=Dots/Number/Icon/Photo` | 8 |
| `GalleryControls` | `Type=Default/Progress/Hover/Pause/Full` | 5 |
| `TextDescription` | `Position=Left/Center/Right` × `Type=title&description/title/description` | 9 |

Вместе с девятью итоговыми variants это 34 named symbol specimens на тему. Такой разбор помогает отделить:

- public variants итогового компонента;
- nested component identities;
- transient interaction states;
- content slots;
- media/loading states.

**Recommendation.** Не превращать все внутренние части в public variants родителя. Dossier должен отдельно показывать anatomy, slots, nested component refs и parent-owned states.

### 1.4. Рядом находятся product examples и правила

Отдельный frame `Примеры использования` содержит:

- cover с GitHub/Figma labels;
- component name и description;
- текстовые разделы;
- browser-like product specimens;
- реальные композиции с surrounding content/skeleton blocks;
- схемы позиционирования;
- несколько сценариев использования.

Это важный переход от «component showroom» к «component in context».

**Recommendation.** У LoveKGD каждый product example должен иметь `fixture_id`, source/context reference, viewport/container identity и expected state. Декоративный mockup не является conformance evidence.

### 1.5. Support встроен в файл

Canvas заканчивается отдельным блоком `Consta Support`. Support не вынесен в неочевидный внешний канал: пользователь видит путь обратной связи рядом с компонентом.

**Recommendation.** В dossier указывать owner, review channel, issue template и last-reviewed date; unresolved product/design comments должны оставаться связанными с exact identity/version.

### 1.6. Naming quality требует автоматической проверки

**Observed.** В metadata встречаются:

- `IndiatorPosition` вместо `IndicatorPosition`;
- `discription` вместо `description`;
- `Indicator` и `Indicators` для близких sections.

Это не обесценивает структуру страницы, но показывает типичную проблему больших UI kits: визуально понятная библиотека может накопить несовместимые machine names.

**Recommendation.** Добавить fail-closed naming validation для property axes, values, component IDs, layer roles и documentation anchors. Исправление display label не должно молча менять canonical state identity.

## 2. Официальный Community UI Kit и documentation stand

### 2.1. Библиотека имеет явный product boundary

**Observed.** Официальный README описывает UI Kit как одну из библиотек Consta: controls, complex blocks, themes и hooks; рядом существуют другие библиотеки, например charts. Для каждой библиотеки даны repository, package, documentation stand и Figma layouts.

**Урок:** design system лучше представлять как карту versioned resource families/libraries, а не как бесконечный плоский список компонентов.

### 2.2. Глобальная IA разделяет типы ресурсов

`src/stand/standConfig.ts` группирует контент как:

```text
Документация
Компоненты
Миксины
HOCs
Hooks
```

Для крупных components используется карточный каталог, для technical helpers — более компактный список. Это показывает, что один визуальный шаблон каталога не обязан применяться ко всем entity kinds.

**Recommendation.** В LoveKGD визуальное представление должно зависеть от analytical entity kind: component family, primitive, pattern, archetype, fixture, contract, evidence и deprecated resource нельзя смешивать в одном типе карточки.

### 2.3. Один component разделён по аудиториям

Stand config задаёт tabs:

```text
Обзор
Код и свойства
Дизайнерам
Песочница
Как использовать
```

На примере `Button` это реализовано отдельными source-файлами:

| Layer | Source | Роль |
|---|---|---|
| краткий обзор | `Button.stand.mdx` | import + user-centered purpose |
| инженерная документация | `Button.dev.stand.mdx` | props, defaults, appearance, behavior, responsive examples и code |
| usage/content guidance | `Button.use.stand.mdx` | правила текста, точность, длина, examples |
| catalog metadata | `Button.stand.tsx` | status, version, aliases, sandbox, Figma deep link и order |
| interactive cases | `examples/`, `Button.variants.tsx` | runnable specimens |
| quality | `__tests__/Button.test.tsx` | behavior and API checks |

Это один из самых переносимых паттернов исследования: одна identity, но разные reading paths.

### 2.4. Обзор начинается с задачи человека

`Button.stand.mdx` объясняет, когда компонент нужен человеку, а не начинается с CSS или полного API. Focus state объясняется через ожидаемое понимание пользователя.

**Recommendation.** Первый абзац dossier отвечает на вопросы:

```text
какую пользовательскую задачу решает компонент;
когда выбрать его;
когда выбрать другой resource;
какой outcome или capability он поддерживает.
```

### 2.5. API документирует defaults и значение axes

`Button.dev.stand.mdx` содержит:

- локальное меню;
- import;
- props table с type/value, default и description;
- sections по content, appearance, size, icons, shape, loading, behavior и responsiveness;
- interactive example рядом с copyable code.

Это формирует полноценную decision surface, а не справочник сигнатуры.

**Recommendation.** Props table LoveKGD должна генерироваться или проверяться по Component Contract. Для каждого axis требуются semantic meaning, default, allowed values, invalid combinations, authority owner и migration behavior.

### 2.6. Content design существует отдельно от API

`Button.use.stand.mdx` задаёт правила формулировки label: действие, точность, краткость, одна строка и работа с overflow. Встроенные examples показывают правильные и проблемные варианты.

**Урок:** content rules — часть поведения компонента. Их нельзя считать необязательным редакционным приложением.

Для LoveKGD сюда должны входить:

- message intent и terminology;
- max/min content classes;
- localization expansion;
- truncation/wrapping;
- accessible name;
- empty/unknown values;
- даты, места, цены и pluralization, если применимо.

### 2.7. Catalog metadata помогает поиску и governance

`Button.stand.tsx` хранит:

```text
title / id / group / description
version: 1.0.0
status: stable
sandbox id
aliases: кнопка, button
exact Figma deep link
order
```

`Table.stand.tsx` показывает тот же metadata shape со `status: deprecated`. В repository также присутствуют `canary` resources. Статус доступен каталогу и не спрятан в release notes.

**Recommendation.** LoveKGD сохраняет более точный lifecycle, но выводит понятный display status:

| Display badge | Допустимая underlying truth |
|---|---|
| `RECONSTRUCTED` | `AS_IS_RECONSTRUCTED` |
| `CANDIDATE` | промежуточные candidate states до promotion |
| `ACCEPTED` | только `FAMILY_AND_ARCHETYPE_PROMOTION`, `canonical: true` |
| `DEPRECATED` | promoted identity с replacement/migration contract или явно закрытая reconstructed identity |

Display badge не должен вычисляться только по имени папки, наличию Figma component или completeness документации.

### 2.8. Код, docs, examples и tests colocated

`src/components/Button/` содержит implementation, CSS, public export, `__stand__` и `__tests__`. Это уменьшает расстояние между изменением API и обновлением документации.

Button tests проходят по arrays допустимых `size`, `view`, `width` и `form`, проверяют polymorphic rendering, disabled/loading interaction, label, icons и click behavior.

**Recommendation.** Для promoted package LoveKGD documentation и test plan должны потреблять один contract-derived state registry. Ручная таблица variants без test/specimen coverage считается incomplete.

## 3. Сквозной паттерн: connected surfaces

Лучший результат Consta появляется при соединении поверхностей:

```text
catalog metadata
→ overview and selection guidance
→ Figma visual model
→ interactive stand and code
→ implementation
→ tests
→ support and lifecycle status
```

Отдельно каждая поверхность может устареть. Связь через exact IDs, versions, deep links и colocated source делает систему полезной.

Для LoveKGD эта связь должна быть строже:

```text
Component Contract tuple
(component_id, contract_version, contract_sha256, state_key, fixture_id)
→ Penpot specimen
→ isolated Astro specimen
→ real product representation
→ evidence receipt
→ dossier rendering
```

## 4. Сигнал возможного design–code drift

**Observed.** `GallerySlider` присутствует в исследованном Figma file, но поиск по официальному `consta-design-system/uikit` repository и организации на 2026-08-19 не нашёл identity `GallerySlider`.

Это **не доказательство**, что компонента нет во всей экосистеме Consta: он может быть candidate, находиться в другой библиотеке, ещё не публиковаться или иметь другое code name. Но отсутствие очевидного binding само по себе является полезным сигналом.

**Recommendation.** Каждый LoveKGD design component показывает один из вариантов:

```text
bound-to-code
candidate-code-binding
intentional-design-only-exploration
historical/deprecated
unresolved-binding-blocker
```

Нельзя позволять пользователю угадывать implementation maturity по качеству Figma canvas.

## 5. Adopt / adapt / avoid

### Adopt

- multi-audience component dossier;
- default-first visual hierarchy;
- named axes and states;
- anatomy and supporting component decomposition;
- user-centered overview;
- separate content guidance;
- interactive examples with code;
- searchable aliases;
- version/status/source/design/sandbox metadata;
- visible deprecation and support;
- colocation of implementation, docs, examples and tests.

### Adapt

- simple maturity status → exact LoveKGD lifecycle;
- Figma deep link → Penpot + code + runtime + receipt bindings;
- theme sheets → generated mode snapshots;
- example mockups → exact source-proven fixtures;
- prop matrix → contract-derived valid/invalid combinations;
- sandbox → isolated specimen plus a11y/interaction evidence;
- product examples → archetype/consumer-bound representations.

### Avoid

- duplicated editable theme masters;
- undocumented conditional combinations;
- property spelling drift;
- Figma-only component identity;
- giant matrices without selection guidance;
- examples without provenance;
- status that is not tied to lifecycle evidence;
- documentation completeness as a substitute for conformance or promotion.

## 6. Source ledger

Observed official Consta files on branch `dev`:

| File | Blob SHA observed 2026-08-19 |
|---|---|
| `README.md` | `41b489e3fe0e73aff08877dc3a785b0c3c4e46ba` |
| `src/stand/standConfig.ts` | `dabf423a6298ce8c232b7c365ae5c3aa620a501c` |
| `src/components/Button/__stand__/Button.stand.mdx` | `88f45c621b2e3feeae36f1c03a1d313121ab272e` |
| `src/components/Button/__stand__/Button.dev.stand.mdx` | `ee95caea1b23346a957b21b9385d48a87318b6cf` |
| `src/components/Button/__stand__/Button.use.stand.mdx` | `1a7c9826ffcb51fa7e8ad4321d17220a4dab4ccc` |
| `src/components/Button/__stand__/Button.stand.tsx` | `54c9aceab0f9d4d5338ea33eb4d66bde8374eef1` |
| `src/components/Button/__tests__/Button.test.tsx` | `1b7e8a3df643ba30c137e9d9adb118e97846422f` |
| `src/components/Table/__stand__/Table.stand.tsx` | `0b612e9136dfdc95605e84c51878afa79589d1de` |

External source revisions can change. This ledger records what informed the study; it does not vendor or freeze Consta implementation.

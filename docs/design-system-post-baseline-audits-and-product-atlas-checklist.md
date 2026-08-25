# LoveKGD Design System — post-baseline audits and Product Atlas checklist

> **Статус:** обязательное приложение к [`design-system-progress-checklist.md`](design-system-progress-checklist.md), [`design-system-execution-sequence.md`](design-system-execution-sequence.md) и [`design-system-planned-patterns-checklist.md`](design-system-planned-patterns-checklist.md).  
> **Назначение:** не пропустить профессиональный независимый аудит foundations, фактические skeleton/loading states и момент запуска Product Atlas после завершения честного AS-IS baseline.  
> **Граница:** этот документ не разрешает автоматический redesign, token merge или promotion по мнению одной модели.

## 1. Место в общей последовательности

```text
production Astro AS-IS
→ stable Git SoT archetypes/components
→ native Penpot AS-IS
→ exact Astro == Git SoT == Penpot baseline
→ audit evidence packs
→ независимые color + typography audits
→ synthesis + owner decisions
→ Unified Design v1 candidates
→ Penpot + isolated Astro implementation
→ browser/device conformance
→ migration and promotion
```

Product Atlas имеет отдельный параллельный контур:

```text
stable route/archetype/component IDs + product model
→ Product Atlas Git SoT linkage
→ Jobs / outcomes / journeys / capabilities / UI gaps
→ после parity gate: отдельная Product Atlas Penpot projection
→ reviewed product evidence and decisions
```

**Product Atlas Git SoT не обязан ждать финальной визуальной унификации.** Его можно начинать, когда существуют стабильные semantic IDs и route → archetype mapping. **Product Atlas Penpot projection ждёт закрытого AS-IS/parity gate**, чтобы ссылки на дизайн-систему не указывали на временные или дублирующиеся ресурсы.

---

## 2. Принцип независимого аудита

Foundation-решение нельзя принимать по одному красивому board или по желанию одной нейросети.

Минимальный protocol для цветов и типографики:

1. один exact evidence pack для всех аудиторов;
2. минимум два независимых прохода, не читающих выводы друг друга;
3. один визуальный аудитор с доступом к Penpot/archetypes;
4. один source/runtime-аудитор с доступом к Astro, computed styles, usage census и SoT;
5. отдельный synthesis, который фиксирует совпадения, расхождения и owner decisions;
6. никакого автоматического принятия по большинству голосов;
7. merge/keep/split/deprecate определяется semantic role, реальными consumers, accessibility и product context, а не только близостью значений.

Рекомендуемый минимальный набор:

- **Gemini visual pass:** прямой read-only просмотр Penpot и representative archetypes;
- **ChatGPT/GPT source pass:** repository + generated HTML + browser-computed values + usage counts;
- **synthesis pass:** сопоставляет оба отчёта и готовит bounded decision package.

Третья или четвёртая модель нужна только при реальном содержательном расхождении, а не ради количества мнений.

---

## 3. Entry gate: baseline готов к foundation-аудиту

- [ ] 100% production routes сопоставлены archetypes.
- [ ] 17/17 archetypes имеют stable semantic contracts.
- [ ] Desktop/mobile boards содержат реальный UI, а не metadata scaffolds.
- [ ] Astro и Penpot используют одинаковые fixtures/state/viewport.
- [ ] Stable component/archetype IDs связаны с Astro implementation и Penpot IDs.
- [ ] Service-only Penpot resources отсутствуют.
- [ ] Detached copies и unregistered terminal overrides отсутствуют.
- [ ] Известные renderer deltas отделены от design decisions.
- [ ] Owner review может выполняться по прямым UI-ссылкам.

До этого gate можно готовить inventory/scripts, но нельзя утверждать, что визуальный drift является именно foundation-проблемой: он может быть следствием неверной composition, detached instance или renderer delta.

---

## 4. Общий Foundation Audit Pack v1

Один versioned pack используется всеми моделями и человеком-дизайнером.

### Обязательное содержимое

- exact design-system, Astro и SoT SHAs;
- exact Penpot file/revision;
- прямые ссылки на 17 archetype pages и 34 desktop/mobile boards;
- route/archetype/component/state/fixture identities;
- generated HTML и browser-computed output;
- Astro source selectors/files;
- Penpot library resources и фактические instance usages;
- usage count и consumer list для каждого значения/role;
- representative current screenshots на desktop/mobile;
- contrast/accessibility results;
- known renderer/API limitations;
- explicit unresolved list;
- machine-readable current → candidate mapping template.

### Запреты

- [ ] не использовать только token declarations без фактических consumers;
- [ ] не использовать только Penpot library без instance census;
- [ ] не принимать screenshot proxy за native component evidence;
- [ ] не смешивать AS-IS observation и candidate recommendation;
- [ ] не скрывать значения, которые встречаются один раз;
- [ ] не объединять цвета/стили только по визуальной близости.

---

# 5. Независимый аудит цвета

## 5.1. Evidence census

- [ ] собрать все фактические colors из Astro source и browser-computed output;
- [ ] собрать SoT color tokens/roles;
- [ ] собрать Penpot library colors/tokens и instance fills/strokes/text colors;
- [ ] посчитать usage frequency и consumer coverage;
- [ ] разделить canvas, surface, text, border, action, brand, status, overlay, media-support и interaction roles;
- [ ] проверить default/hover/focus/active/disabled/error/success/warning;
- [ ] проверить contrast на реальных background combinations;
- [ ] показать usage на representative archetypes, а не только swatches;
- [ ] отдельно отметить intentional editorial/artifact colors и случайный drift.

## 5.2. Professional decision criteria

Для каждого current color/value требуется disposition:

```text
KEEP
MERGE_INTO_ROLE
SPLIT_BY_SEMANTICS
DEPRECATE
EXCEPTION_WITH_OWNER
UNRESOLVED
```

Решение учитывает одновременно:

- semantic job;
- реальных consumers;
- визуальную иерархию;
- brand continuity;
- contrast/accessibility;
- interaction states;
- compatibility cost;
- light/photo/saturated underlays;
- риск сделать интерфейс монотонным или, наоборот, пёстрым.

Perceptual distance (`OKLCH`, Delta E и аналогичные методы) используется как сигнал кластеризации, но **не является доказательством общей semantic identity**.

## 5.3. Результат

- [ ] current palette census;
- [ ] semantic role map;
- [ ] proposed compact palette;
- [ ] current → candidate mapping;
- [ ] kept exceptions с обоснованием;
- [ ] affected components/archetypes;
- [ ] contrast matrix;
- [ ] 3–5 baseline/candidate page examples;
- [ ] migration order и rollback;
- [ ] model disagreements и owner decision list.

Цвета не меняются в production или canonical Penpot до synthesis и owner decision.

---

# 6. Независимый аудит типографики

## 6.1. Evidence census

- [ ] собрать фактические font family, size, weight, line-height, tracking, case и decoration из Astro/browser output;
- [ ] собрать SoT typography roles;
- [ ] собрать Penpot library typographies и фактические text instance values;
- [ ] посчитать usage frequency и consumer coverage;
- [ ] разделить display/page title, section heading, card title, body, meta, label, control, data/time и long-form roles;
- [ ] проверить desktop/mobile responsive branches;
- [ ] проверить Cyrillic, длинные русские заголовки, даты, адреса, цены и служебные подписи;
- [ ] проверить line length, wrapping, truncation, vertical rhythm и content density;
- [ ] отделить renderer/API limitations Penpot от реального design drift;
- [ ] проверить доступные реальные font weights и variable-font behavior.

## 6.2. Professional decision criteria

Для каждого текущего style/value требуется disposition:

```text
KEEP
MAP_TO_SEMANTIC_ROLE
MERGE
SPLIT_BY_CONTENT_JOB
DEPRECATE
EXCEPTION_WITH_OWNER
UNRESOLVED
```

Нельзя сокращать type scale только ради малого числа tokens. Укрупнение допускается, если сохраняются:

- иерархия страницы;
- различимость title/section/card/meta;
- читаемость mobile/desktop;
- длинный контент;
- интерактивные labels;
- Cyrillic rendering;
- accessible zoom/reflow;
- реальные product densities.

## 6.3. Результат

- [ ] current typography census;
- [ ] semantic role map;
- [ ] proposed compact type scale;
- [ ] current → candidate mapping;
- [ ] responsive limits и wrapping rules;
- [ ] kept exceptions;
- [ ] affected components/archetypes;
- [ ] 3–5 baseline/candidate page examples;
- [ ] migration order и rollback;
- [ ] model disagreements и owner decision list.

Типографика не меняется в production или canonical Penpot до synthesis и owner decision.

---

# 7. Фактические skeleton/loading states

Архив с уже снятыми фактическими skeleton screenshots является обязательным AS-IS evidence. Нельзя заново угадывать skeleton geometry по статическим страницам.

## 7.1. Момент загрузки

```text
AS-IS baseline почти закрыт
→ загрузить skeleton archive
→ catalog + hashes + route/component/state mapping
→ loading-state audit
→ только затем unified loading/skeleton design
```

Отсутствие архива не блокирует закрытие общей parity, но **блокирует redesign loading/skeleton states**.

## 7.2. Intake checklist

- [ ] принять один archive без ручного переноса файлов;
- [ ] сохранить SHA-256 и manifest;
- [ ] определить source date, viewport и route/component/state для каждого screenshot;
- [ ] удалить только доказанные дубли и нерелевантные кадры;
- [ ] не использовать пользовательские/секретные данные;
- [ ] связать screenshot с archetype region и owning component/pattern;
- [ ] отметить production, prototype, obsolete и unresolved states;
- [ ] проверить loading→content geometry shift и perceived continuity;
- [ ] отличить skeleton, progress, optimistic state, empty и blocked state.

## 7.3. Результат

- [ ] `skeleton-as-is-manifest`;
- [ ] route/component/state coverage matrix;
- [ ] missing/obsolete/duplicate list;
- [ ] representative Penpot/Astro evidence links;
- [ ] candidate loading-state vocabulary;
- [ ] redesign decision package.

---

# 8. Structured design-system audit вместо «аудита всего»

Комплексный аудит выполняется отдельными bounded passes:

1. **Color** — этот документ, §5.
2. **Typography** — §6.
3. **Spacing / radius / elevation / grid** — фактические values, roles, exceptions и responsive rhythm.
4. **Controls / selectors / menus / overlays** — desktop popover/dropdown ↔ mobile sheet/dialog, keyboard/focus/escape.
5. **Navigation / search / shell** — mobile/desktop jobs, search entry, desktop menu, bottom navigation и floating-islands applicability.
6. **Loading / feedback / status / accessibility** — skeleton archive, empty/error/retry/stale/undo/NPS/issue flows.
7. **Product linkage** — Jobs, journeys, capabilities, outcomes, UI gaps и measurement slots.

Каждый pass использует общие archetypes, но имеет собственный evidence pack, outputs и decision boundary. Один «сделай профессиональный аудит всего» запрещён: он даёт трудно проверяемый отчёт и смешивает наблюдение, вкус и продуктовые решения.

---

# 9. Product Atlas: ранний Git SoT и поздняя Penpot projection

Канонический product meaning остаётся в `events-bot-new`; Product Atlas — отдельный Penpot-файл и отдельный plugin. Design-system Resource Graph не превращается в Product Atlas и не получает product dashboards.

## 9.1. Gate P0 — можно начинать Git-only Product Atlas SoT

- [ ] production route → archetype coverage = 100%;
- [ ] stable archetype IDs существуют;
- [ ] stable component/pattern IDs существуют или gaps помечены;
- [ ] semantic regions и states описаны;
- [ ] product model source определён;
- [ ] Product Atlas IDs не выводятся из координат или display text;
- [ ] отсутствующие Jobs/partner needs остаются `not_modeled`, а не выдумываются.

Этот gate можно закрывать параллельно с финальной Astro↔SoT↔Penpot reconciliation.

## 9.2. Git-only Product Atlas SoT scope

- [ ] user needs;
- [ ] Jobs / Job Stories;
- [ ] user and owner outcomes;
- [ ] journeys and recovery paths;
- [ ] capabilities;
- [ ] operator jobs and technical enablers;
- [ ] acceptance scenarios;
- [ ] product problems and stable UI-gap IDs;
- [ ] route/archetype/region/component links;
- [ ] measurement questions and semantic signal slots;
- [ ] implementation/release/runtime/evidence facets;
- [ ] unresolved and not-modeled ledger.

Generic component master не обязан иметь один Job. Product meaning может принадлежать configured instance, pattern, archetype region или ProductScreenState.

## 9.3. Minimum design-system linkage

```yaml
product_links:
  job_ids: []
  outcome_ids: []
  journey_ids: []
  capability_ids: []
  acceptance_scenario_ids: []
  measurement_question_ids: []
```

Для каждого link сохраняются:

- exact product entity ID;
- exact design-system entity ID;
- context/state/viewport;
- relation type;
- source/evidence ref;
- status: proven | partial | unresolved | not_applicable.

## 9.4. Gate P1 — можно материализовать Product Atlas в отдельном Penpot-файле

- [ ] AS-IS parity baseline закрыт;
- [ ] Resource Graph stable IDs больше не меняются массово;
- [ ] Product Atlas catalog/schema валидны;
- [ ] отдельный file marker и namespace готовы;
- [ ] wrong-file guard доказан с обеих сторон;
- [ ] deep links Product Atlas ↔ Resource Graph детерминированы;
- [ ] Product Atlas использует accepted foundation snapshot, но не становится source of tokens;
- [ ] raw analytics не читаются напрямую;
- [ ] только reviewed evidence package может создавать finding/decision.

Existing architecture:

- [`product-atlas-penpot-extension.md`](product-atlas-penpot-extension.md);
- [`penpot-product-design-operating-model.md`](penpot-product-design-operating-model.md);
- `events-bot-new/docs/product-model/product-atlas-architecture.md`.

---

# 10. Synthesis и переход к Unified Design v1

После двух независимых foundation-аудитов:

- [ ] собрать agreement matrix;
- [ ] отдельно показать disagreements;
- [ ] проверить рекомендации на всех 17 archetypes;
- [ ] проверить влияние на product Jobs и accessibility;
- [ ] выбрать bounded candidate foundations;
- [ ] показать baseline/candidate минимум на Date Listing, Event Detail и Search или лучше обоснованных consumers;
- [ ] получить owner decisions by exception;
- [ ] зафиксировать exact semantic contracts и migration plan;
- [ ] применить одну версию в SoT, Penpot и isolated Astro;
- [ ] выполнить browser/device conformance;
- [ ] мигрировать selected consumers;
- [ ] включить drift gates.

Floating islands, desktop search/menu, selectors и другие pattern changes проектируются поверх этого audit-ready baseline. Они не должны случайно цементировать старую пёструю палитру или старый типографический drift.

---

# 11. Готовые prompts для независимых моделей

## 11.1. Color system audit

```text
Выполни read-only профессиональный аудит цветовой системы LoveKGD.

Входы:
- exact Foundation Audit Pack v1: <PATH/URL + SHA-256>;
- Astro commit: <SHA>;
- design-system/SoT commit: <SHA>;
- Penpot file/revision: <FILE_ID / REV>;
- direct archetype links: <MANIFEST>.

Не изменяй Penpot, Git или Astro. Не читай выводы других моделей.

Используй фактические Astro browser-computed colors, SoT roles, Penpot library
и instance usages, usage counts, contrast results и representative desktop/mobile
archetypes. Не ограничивайся swatches и token declarations.

Для каждого current color/role определи:
KEEP | MERGE_INTO_ROLE | SPLIT_BY_SEMANTICS | DEPRECATE |
EXCEPTION_WITH_OWNER | UNRESOLVED.

Не объединяй значения только по близости HEX/OKLCH/Delta E. Учитывай semantic
job, brand continuity, content hierarchy, interaction states, accessibility,
photo/saturated underlays, affected consumers и migration cost.

Выход:
1. фактический census и проблемные кластеры;
2. compact semantic palette candidate;
3. current → candidate mapping;
4. kept exceptions;
5. contrast/accessibility matrix;
6. affected components/archetypes;
7. 3–5 concrete baseline/candidate examples;
8. риски, неопределённость и owner decisions;
9. ссылки на exact Penpot boards/source evidence для каждого крупного вывода.

Чётко разделяй OBSERVED, INFERRED и RECOMMENDED. Не объявляй candidate accepted.
```

## 11.2. Typography system audit

```text
Выполни read-only профессиональный аудит типографической системы LoveKGD.

Входы:
- exact Foundation Audit Pack v1: <PATH/URL + SHA-256>;
- Astro commit: <SHA>;
- design-system/SoT commit: <SHA>;
- Penpot file/revision: <FILE_ID / REV>;
- direct archetype links: <MANIFEST>.

Не изменяй Penpot, Git или Astro. Не читай выводы других моделей.

Используй фактические Astro browser-computed font family/size/weight/line-height/
tracking/case, SoT roles, Penpot library и instance values, usage counts и
representative desktop/mobile archetypes. Обязательно проверь Cyrillic, длинные
русские заголовки, адреса, даты, цены, controls, long-form content, wrapping,
truncation, line length, density и responsive behavior.

Для каждого current style/role определи:
KEEP | MAP_TO_SEMANTIC_ROLE | MERGE | SPLIT_BY_CONTENT_JOB | DEPRECATE |
EXCEPTION_WITH_OWNER | UNRESOLVED.

Не сокращай scale только ради малого числа tokens. Отделяй Penpot renderer/API
ограничения от реального design drift. Учитывай доступные реальные weights,
variable font behavior, accessibility zoom/reflow и migration cost.

Выход:
1. фактический census и проблемные кластеры;
2. compact semantic type scale candidate;
3. current → candidate mapping;
4. responsive limits/wrapping rules;
5. kept exceptions;
6. affected components/archetypes;
7. 3–5 concrete baseline/candidate examples;
8. риски, неопределённость и owner decisions;
9. ссылки на exact Penpot boards/source evidence для каждого крупного вывода.

Чётко разделяй OBSERVED, INFERRED и RECOMMENDED. Не объявляй candidate accepted.
```

## 11.3. Product Atlas Git-only bootstrap

```text
На отдельной child-ветке от latest accepted product-model/design-system inputs,
без Penpot mutations, собери Product Atlas SoT bootstrap.

Используй существующий events-bot-new product model. Не выдумывай Jobs, partner
needs, outcomes или metrics. Missing information сохраняй как not_modeled или
unresolved.

Свяжи stable product entities с 17 design-system archetypes, semantic regions,
patterns, configured component instances и ProductScreenStates. Для каждой связи
зафиксируй exact IDs, context/state/viewport, relation type, source refs и status.

Выход:
- Jobs/outcomes/journeys/capabilities registry;
- route/archetype/region/component linkage graph;
- UI-gap registry;
- acceptance-scenario bindings;
- measurement-question and semantic-signal slots;
- unresolved/not-modeled ledger;
- Product Atlas Penpot readiness report;
- fail-closed tests против fabricated Jobs и orphan design-system links.

Product Atlas Penpot materialization не выполнять. Draft PR, no merge.
```

---

## 12. Критерий закрытия этого checklist

- [ ] baseline `Astro == Git SoT == Penpot` закрыт;
- [ ] exact color and typography evidence packs опубликованы;
- [ ] два независимых color audits завершены;
- [ ] два независимых typography audits завершены;
- [ ] synthesis и owner decision package готовы;
- [ ] skeleton archive принят и связан с states либо честно отмечен как отсутствующий blocker loading redesign;
- [ ] Product Atlas Git SoT linkage готов;
- [ ] Product Atlas Penpot entry gate определён и проверяем;
- [ ] Unified Design v1 использует versioned accepted decisions, а не вкус одной модели;
- [ ] одинаковые решения реализуются в SoT, Penpot и isolated Astro;
- [ ] browser/device conformance и migration plan готовы.

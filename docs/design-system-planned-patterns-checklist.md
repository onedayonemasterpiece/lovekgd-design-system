# LoveKGD Design System — чек-лист запланированных дизайн-паттернов

> **Статус документа:** обязательное приложение к [`design-system-progress-checklist.md`](design-system-progress-checklist.md) и [`design-system-execution-sequence.md`](design-system-execution-sequence.md).  
> **Назначение:** не потерять принятые направления редизайна, которые нельзя внедрять до завершения честной AS-IS-реконструкции.  
> **Правило:** запись `[x]` в разделе фиксации направления не означает, что pattern спроектирован, принят или внедрён.

## Место в рабочем контуре

Три документа читаются вместе:

1. [`design-system-progress-checklist.md`](design-system-progress-checklist.md) — что фактически готово сейчас;
2. [`design-system-execution-sequence.md`](design-system-execution-sequence.md) — в каком порядке закрывается AS-IS дизайн-система;
3. этот документ — какие **последующие design directions** уже приняты в roadmap и должны быть спроектированы только после требуемого entry gate.

## Общий post-AS-IS gate

Ни один запланированный редизайн-паттерн не начинается только потому, что появился reference board или красивый Penpot concept.

Обязательная последовательность:

```text
production Astro AS-IS
→ 100% route-to-archetype coverage
→ stable Git SoT archetype contracts
→ native Penpot AS-IS representations
→ exact Astro == Git SoT == Penpot baseline
→ custom LoveKGD pattern design
→ owner review and accepted contracts
→ Penpot + isolated Astro candidate
→ browser/device conformance
→ selective migration and drift protection
```

Entry gate считается закрытым только когда:

- [ ] актуальные production routes полностью сопоставлены AS-IS archetypes;
- [ ] у целевых archetypes зафиксированы anatomy, semantic regions, dependencies, states и responsive branches;
- [ ] Astro, Git SoT и Penpot используют одну baseline version и одни fixtures;
- [ ] совпадают component/state identity и semantic ownership, а не только внешний вид;
- [ ] browser evidence покрывает scroll, sticky, safe area, keyboard, overlay и content occlusion;
- [ ] route-local forks выявлены и не маскируются под допустимые design variants;
- [ ] speculative component merges отсутствуют.

---

# Pattern 01 — detached chrome / floating control islands

| Поле | Значение |
|---|---|
| Stable ID | `pattern.detached-chrome-control-islands` |
| Направление | **принято в roadmap** |
| Текущая фаза | `reference_captured` |
| Проектирование | `not_started` |
| Внедрение | `not_started` |
| Entry gate | AS-IS archetypes + exact `Astro == Git SoT == Penpot` |
| Reference pack | [Draft PR #47](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/47) |
| Pattern dossier | [`planned-design-pattern.md`](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/docs/floating-control-islands-reference/docs/research/floating-control-islands-2026-08/planned-design-pattern.md) |

## 0. Фиксация направления

- [x] Сохранён source-informed reference pack по `detached chrome`, `floating chrome` и `floating control islands`.
- [x] Зафиксировано, что направление должно перейти в будущую проектную работу, а не остаться коллекцией референсов.
- [x] Зафиксирован stable pattern ID `pattern.detached-chrome-control-islands`.
- [x] Разведены `pill/capsule` как геометрия, `chip` как compact control и semantic component identity.
- [x] Зафиксировано, что текущие abstract/reference boards **не являются финальным LoveKGD design**.
- [x] Зафиксировано требование создавать кастомные варианты для конкретных страниц и архетипов сайта.
- [x] До entry gate запрещены component/token promotion, canonical Penpot materialization и массовая замена текущего shell.

## 1. Закрыть AS-IS entry gate

- [ ] Завершить production route → AS-IS archetype registry.
- [ ] Закрыть semantic contracts целевых archetypes.
- [ ] Материализовать AS-IS в Penpot без candidate-redesign подмен.
- [ ] Доказать exact baseline `Astro == Git SoT == Penpot` на одинаковых fixtures, states и viewports.
- [ ] Зафиксировать текущих semantic owners для leading, center context, trailing utility и bottom regions.
- [ ] Получить browser evidence для sticky/scroll/keyboard/safe-area/overlay/occlusion behavior.
- [ ] Выявить и классифицировать current monolithic, clustered и detached compositions без преждевременного объединения.

**STOP:** пока этот раздел не закрыт, последующие пункты не переводятся в design execution.

## 2. Выбрать реальные LoveKGD consumers

После parity gate для каждого актуального archetype выполнить evidence-backed mapping:

```text
archetype / route family
→ user job
→ affected semantic regions
→ applicable / not applicable / unresolved
```

- [ ] Проверить применимость pattern к каждому актуальному page archetype.
- [ ] Не считать rounded surface автоматическим основанием для floating-island composition.
- [ ] Сохранить monolithic/ordinary shell там, где он лучше решает задачу.
- [ ] Определить страницы, где detached chrome действительно освобождает content canvas, улучшает reachability или разделяет semantic owners.
- [ ] Зафиксировать migration boundary: какие current regions заменяются, а какие остаются внешними dependencies.

## 3. Создать кастомные варианты для страниц сайта

Каждый вариант создаётся на реальном LoveKGD archetype и реальных fixture IDs, а не на абстрактном телефоне.

- [ ] Создать site-specific variant registry после появления доказанных consumers.
- [ ] Для каждого selected archetype собрать baseline/candidate pair.
- [ ] Использовать реальный контентный ритм страницы: карточки, фильтры, заголовки, даты, поиск, event detail, auth и dynamic states.
- [ ] Спроектировать leading navigation, center context/page identity и trailing utility по реальным Jobs.
- [ ] Спроектировать pinned и transient context surfaces только там, где есть продуктовая необходимость.
- [ ] Выбрать подходящую bottom architecture для каждого consumer.
- [ ] Сделать отдельные mobile, desktop, narrow и landscape branches там, где pattern применим.
- [ ] Проверить expanded/compact/scrolled states.
- [ ] Проверить keyboard open/closed, safe areas и system navigation insets.
- [ ] Проверить content occlusion и last-item reachability.
- [ ] Проверить plain/photo/poster/saturated underlays.
- [ ] Проверить loading/empty/error/overlay interactions.
- [ ] Проверить focus, keyboard, target size, reduced motion и high contrast.

## 4. Не создавать universal pill component

Для каждого custom variant отдельно закрыть четыре уровня:

- [ ] **surface primitive:** material, radius, border, elevation, blur и contrast;
- [ ] **composition:** top app bar, composer, navigation dock, persistent state dock;
- [ ] **control semantics:** icon button, segmented control, chip, input, destination item;
- [ ] **runtime/layout behavior:** anchoring, keyboard avoidance, scroll compaction, show/hide и occlusion.

Отдельные bottom architectures:

- [ ] `floating composer` — task input;
- [ ] `floating navigation dock` — core destinations;
- [ ] `persistent state dock + navigation` — cross-screen state stack;
- [ ] borderless but semantically grouped navigation — только при доказанном consumer contract.

Сходный radius не является доказательством общей component identity.

## 5. Owner review и acceptance

- [ ] Подготовить review boards по конкретным LoveKGD pages, не только abstract anatomy.
- [ ] Показывать current AS-IS рядом с candidate на одинаковых fixtures.
- [ ] Для каждого variant объяснить user job, semantic ownership и ожидаемое улучшение.
- [ ] Показать fallback/monolithic alternative, если applicability неочевидна.
- [ ] Провести owner review desktop/mobile и критических states.
- [ ] Записать owner decisions Git SoT first.
- [ ] Принять exact version/hash каждого выбранного variant.
- [ ] Оставить неподтверждённые варианты `unresolved`, не выбирать их автоматически.

## 6. Implementation и conformance

- [ ] Материализовать принятые variants как native Penpot components/compositions и linked instances.
- [ ] Создать isolated Astro candidates на той же версии и fixtures.
- [ ] Исключить route-local visual forks и terminal instance patching.
- [ ] Выполнить exact three-way conformance для representative states.
- [ ] Выполнить browser/device review scroll, sticky, keyboard, safe-area, overlay и motion behavior.
- [ ] Проверить accessibility semantics, focus order и touch targets.
- [ ] Мигрировать только selected consumers.
- [ ] Зафиксировать replacement/deprecation/rollback для затронутого current chrome.

## 7. Promotion и защита от дрейфа

- [ ] Promoted pattern contract содержит stable pattern/variant IDs.
- [ ] Astro consumers pinned к принятой версии.
- [ ] Penpot receipts/read-back связаны с той же версией.
- [ ] Runtime analytics используют semantic IDs, а не нестабильные CSS/DOM selectors.
- [ ] Fail-closed checks обнаруживают расхождение Git SoT, Penpot, Astro и production browser output.
- [ ] Post-deploy conformance пройден.

---

## Реестр site-specific variants

Реестр намеренно пуст до завершения AS-IS/parity gate. Спекулятивные строки ради заполнения таблицы запрещены.

| Variant ID | Target archetype | User job | Baseline tuple | Candidate tuple | Status | Evidence |
|---|---|---|---|---|---|---|
| — | — | — | — | — | `awaiting_entry_gate` | — |

Для будущей записи обязательны:

- stable `variant_id`;
- exact `target_archetype_id`;
- real route/fixture IDs;
- user job;
- affected semantic regions;
- exact Astro/SoT/Penpot baseline binding;
- exact candidate binding;
- runtime contract;
- lifecycle status;
- owner and conformance evidence.

## Запреты

- не начинать редизайн до AS-IS archetype/parity gate;
- не смешивать candidate design с AS-IS reconstruction;
- не копировать внешний продукт или его экран один в один;
- не считать abstract variants конечным результатом;
- не заменять все headers/bottom navigation автоматически;
- не создавать один universal `pill`/`floating surface` god component;
- не переносить skeleton geometry, blur, spacing или elevation в tokens;
- не объявлять `reuse_existing`/`new_component` без production registry mapping;
- не считать визуально красивую Penpot-доску доказательством runtime behavior;
- не отмечать pattern внедрённым до migration и post-deploy conformance.

## Критерий закрытия всего направления

Направление получает `[x]` только когда существуют принятые кастомные variants для выбранных реальных LoveKGD archetypes, одна версия синхронно реализована в Git SoT, Penpot и Astro, все обязательные responsive/runtime/accessibility checks пройдены, selected production consumers мигрированы, а drift gates защищают результат.

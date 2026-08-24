# Planned design pattern — detached chrome / floating control islands

> **Pattern ID:** `pattern.detached-chrome-control-islands`  
> **Direction status:** `accepted_for_roadmap`  
> **Implementation status:** `not_started`  
> **Current phase:** `reference_captured`  
> **Required entry gate:** AS-IS page archetypes are formed and the current baseline is proven as `Astro == Git SoT == Penpot`.

## Решение

`Detached chrome / floating chrome` и композиционный подход `floating control islands` зафиксированы не как одноразовый визуальный референс, а как **обязательное будущее направление LoveKGD Design System**.

После закрытия AS-IS-реконструкции и трёхстороннего parity gate нужно спроектировать, принять и внедрить собственный LoveKGD-pattern. Текущие шесть обезличенных экранов дают терминологию, композиционные принципы и validation matrix, но **не являются финальным дизайном сайта**.

Будущая работа должна создавать **кастомные варианты для конкретных архетипов и страниц LoveKGD**, с реальным содержимым, реальными задачами пользователя и реальными responsive/runtime constraints. Абстрактные универсальные mockups не закрывают эту работу.

## Почему проектирование отложено

Проектировать новый chrome до фиксации AS-IS опасно: невозможно отделить осознанное изменение от случайного дрейфа, а также проверить, что новая композиция действительно заменяет одну и ту же исходную структуру во всех трёх представлениях.

Поэтому порядок фиксируется жёстко:

```text
production Astro AS-IS
→ route-to-archetype coverage
→ stable Git SoT archetype contracts
→ native Penpot AS-IS representations
→ exact Astro == Git SoT == Penpot baseline
→ LoveKGD-specific detached-chrome design
→ owner review and accepted pattern contract
→ Penpot + isolated Astro implementation
→ browser/device conformance
→ selective consumer migration
```

## Entry gate

Проектирование pattern начинается только когда одновременно выполнено следующее:

- [ ] все актуальные production routes сопоставлены AS-IS archetypes;
- [ ] для целевых archetypes зафиксированы anatomy, regions, dependencies, states и responsive branches;
- [ ] current Astro, Git SoT и Penpot используют одну baseline version, одни fixtures и одинаковые semantic regions;
- [ ] отсутствуют скрытые route-local forks, которые могут быть ошибочно приняты за design variants;
- [ ] ownership current top/bottom chrome и conditional regions установлен;
- [ ] safe areas, keyboard, scroll, sticky, overlay и content-occlusion behavior имеют browser evidence;
- [ ] speculative component merges для затрагиваемых surfaces отсутствуют.

Наличие одного reference board, Penpot-экрана или общего shell candidate этот gate не закрывает.

## Программа проектирования после parity gate

### 1. Выбрать реальные consumers

Для каждого актуального LoveKGD archetype определить, нужен ли ему этот pattern вообще. Rounded surface или capsule geometry сами по себе не являются основанием для внедрения.

Результат — evidence-backed mapping:

```text
archetype / route family
→ user job
→ affected semantic regions
→ applicable / not applicable / unresolved
```

### 2. Создать LoveKGD-specific variants

Для каждого выбранного archetype создаётся собственный variant на реальных page fixtures. Он должен описывать:

- leading navigation owner;
- center context/mode/page identity;
- trailing utility ownership и grouping;
- pinned or transient context surfaces;
- выбранную bottom architecture;
- desktop/mobile/landscape branches;
- expanded/compact/scrolled behavior;
- keyboard open/closed и safe-area behavior;
- content occlusion и last-item reachability;
- loading/error/empty and overlay interactions;
- focus, keyboard, target size, reduced motion и high contrast.

Варианты не должны быть косметическими копиями сторонних приложений. Они проектируются под структуру, контент и задачи LoveKGD.

### 3. Разделить четыре уровня контракта

Нельзя делать один universal pill component. Отдельно проектируются:

1. **surface primitive** — material, radius, border, elevation, blur/contrast;
2. **composition** — top app bar, composer, navigation dock, persistent state dock;
3. **control semantics** — icon button, chip, segmented control, input, destination item;
4. **runtime/layout behavior** — anchoring, keyboard avoidance, scroll compaction, show/hide, occlusion.

`Pill` и `capsule` остаются описанием геометрии. `Chip` применяется только к compact filter/select/suggestion/input controls.

### 4. Сохранить разные bottom architectures

Как минимум отдельно рассматриваются:

- `floating composer` — task input;
- `floating navigation dock` — core destinations;
- `persistent state / mini-player dock + navigation` — cross-screen state stack;
- отсутствие общего substrate у navigation, если это подтверждено semantic model.

Они не объединяются в один компонент только из-за похожего радиуса.

### 5. Провести owner review на конкретных страницах

Review должен показывать не абстрактные телефоны, а representative LoveKGD pages с реальными fixtures и paired baseline/candidate representations. Для каждого variant владелец принимает:

- применимость к archetype;
- composition и semantic ownership;
- visual direction;
- responsive/state behavior;
- fallback/monolithic alternative;
- migration boundary.

## Реестр site-specific variants

Реестр намеренно не заполнен до parity gate. Будущие записи должны иметь следующий contract:

| Поле | Требование |
|---|---|
| `variant_id` | stable semantic ID, не название внешнего приложения |
| `target_archetype_id` | точный LoveKGD archetype |
| `route_fixtures` | реальные route/fixture IDs |
| `user_job` | какую задачу улучшает variant |
| `affected_regions` | top, context, utility, composer, navigation, persistent state |
| `baseline_binding` | exact Astro/SoT/Penpot AS-IS tuple |
| `candidate_binding` | exact Git SoT/Penpot/Astro candidate tuple |
| `runtime_contract` | safe area, keyboard, scroll, overlay, occlusion |
| `status` | proposed / reviewed / accepted / implemented / verified / promoted |
| `evidence` | owner decision, renders, browser/device checks |

До появления доказанных consumers запрещено создавать speculative entries только ради заполнения реестра.

## Критерии завершения pattern

Pattern считается внедрённым только когда:

- [ ] создан набор кастомных variants для выбранных реальных LoveKGD archetypes;
- [ ] каждый variant имеет accepted Git SoT contract и exact baseline/candidate bindings;
- [ ] Penpot использует native components/compositions и linked instances;
- [ ] Astro candidate реализует ту же версию без route-local visual forks;
- [ ] mobile/desktop, scroll, keyboard, safe-area, underlay, occlusion и accessibility cases проверены;
- [ ] owner review закрыт на конкретных страницах;
- [ ] выбранные production consumers мигрированы;
- [ ] drift gates защищают promoted variants.

## Что текущий пакет не разрешает

- внедрять pattern до AS-IS archetype/parity gate;
- механически заменять все шапки и bottom navigation;
- копировать конкретные сторонние экраны;
- принимать текущую skeleton geometry как tokens;
- считать abstract variants финальным LoveKGD design;
- объявлять component identities `reuse_existing` или `new_component` до production registry mapping;
- материализовать canonical Penpot components из одного визуального сходства.

## Связанные материалы

- [Source-informed reference pack](README.md)
- [Six-screen observations](screen-observations.json)
- [Source and privacy manifest](source-manifest.json)
- [Machine-readable planned-pattern record](planned-pattern.json)
- [Design-system planned-pattern checklist](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/docs/design-system-progress-checklist-20260820/docs/design-system-planned-patterns-checklist.md)
- [Draft PR #39 — design-system checklist and execution sequence](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/39)

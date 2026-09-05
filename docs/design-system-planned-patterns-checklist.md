# LoveKGD Design System — чек-лист запланированных дизайн-паттернов

Обязательное приложение к [design-system-progress-checklist.md](design-system-progress-checklist.md) и [design-system-execution-sequence.md](design-system-execution-sequence.md). Этот файл отслеживает направление и этапы; системные требования определены у владельца соответствующего pattern, не пересказываются здесь.

## Адресное уточнение владельца — 2026-09-05

Для **`pattern.detached-chrome-control-islands`** прежний STOP «сначала полная AS-IS/A=S=P всего сайта, только затем documentary design» заменён по [прямой постановке](https://github.com/onedayonemasterpiece/events-bot-new/blob/62c54ce42786eecc5b380ea3dba002af78df8fd0/docs/features/static-site-pages/design-system/window-prompts/20260905-floating-islands-system-design.md).

**Было → стало:** проектирование/предложения variants не начинать до полного baseline → документально проектировать сейчас на основе реальных sources/owners/archetypes; перед визуальным изменением иметь честный baseline затронутого consumer и явно назвать отсутствующее evidence. Незавершённая unrelated нормализация не блокирует проектирование.

**Не изменено:** определение A=S=P; native lineage/asset/geometry требования; owner visual acceptance; запрет канонизации дефектного baseline; existing normalization exit gate и release authority. Без verified P равенство не заявляется. Этот amendment не разрешает production, shared foundation/STATUS mutation или mass header replacement. Подробный текущий договор — [FI-01 в единственной спецификации](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/docs/floating-control-islands-reference/docs/research/floating-control-islands-2026-08/system-design-v1.md).

Уточнение относится к названному pattern. Для иных будущих направлений никакое разрешение или прохождение gates этим документом не выдумывается. [Предыдущая редакция полного tracker](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/6074fcb33ecb6125e97135b6011fc9c16d74df23/docs/design-system-planned-patterns-checklist.md) остаётся в Git history.

## Pattern 01 — detached chrome / floating control islands

| Поле | Значение |
|---|---|
| Stable ID | `pattern.detached-chrome-control-islands` |
| Направление | Принято в roadmap |
| Текущая фаза | `system_design_documented` |
| Новая сквозная реализация | `not_started` |
| Owner | [Существующий PR #47](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/47) |
| Досье и lifecycle | [planned-design-pattern.md](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/docs/floating-control-islands-reference/docs/research/floating-control-islands-2026-08/planned-design-pattern.md) |
| Правила системы | [system-design-v1.md](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/docs/floating-control-islands-reference/docs/research/floating-control-islands-2026-08/system-design-v1.md) |
| Потребители и variants | [consumer-matrix-v1.md](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/docs/floating-control-islands-reference/docs/research/floating-control-islands-2026-08/consumer-matrix-v1.md) |
| Первый implementation slice | [FI-P1](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/docs/floating-control-islands-reference/docs/research/floating-control-islands-2026-08/implementation-package-1.md) |
| Sources / evidence / limitations | [sources-and-decisions-v1.md](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/docs/floating-control-islands-reference/docs/research/floating-control-islands-2026-08/sources-and-decisions-v1.md) |

### Прогресс с раздельными утверждениями

- [x] Сохранены source-informed reference pack, стабильный ID и различение geometry/semantics.
- [x] Подтверждено направление владельцем; несколько role-owned островов допустимы, это не universal pill component.
- [x] Документально спроектированы site-wide roles/compositions/states, measurable layout/scroll/keyboard/layers/accessibility и Search boundary.
- [x] Есть applicability для всех 17 зарегистрированных archetype IDs и proposed C1–C6; не только Free/Search.
- [x] Есть конкретный первый пакет shared geometry + section context Popular, regression boundaries и 32 **спроектированных, не выполненных** сценария.
- [ ] Реализован FI-P1, актуальные target baselines и immutable candidate прошли требуемые browser checks.
- [ ] Сформированы реальные native linked Penpot representations затронутых cases и их A=S=P evidence.
- [ ] Новые выбранные visual variants приняты владельцем на тех же fixtures/states/viewports.
- [ ] Пройдены необходимые native keyboard/device проверки, которые не доказываются статичным Penpot board.
- [ ] Разрешена и выполнена selected production migration; old consumer removal/rollback/drift gates подтверждены.

`[x]` у documentary design не означает закрытие pattern, full-site normalization или принятие каждого visual proposal. Current approved bottom navigation уже существует отдельно от новой версии системы и не откатывается к `not_started` из-за этого tracker.

## Как продолжать

Перед implementation читать FI-P1 и fresh source/#621, не копировать системные правила в новый prompt. Общую A=S=P authority получать из актуального `docs/product-governance/astro-sot-penpot-conformance.md` integration branch, а не из исторического tracker. Pure Search/backend work остаётся в events-bot-new#587. Существующий #621 сохраняет runtime integration ownership и единый Kaggle опубликованный Preview.

Registry proposed variants ведётся **один раз** в `planned-pattern.json` рядом с owning spec. Здесь нет второй таблицы exact geometry, Penpot UUID или отдельных приёмочных thresholds. Нерешённые bindings остаются null/pending, а не заполняются похожими ассетами ради формального завершения.

## Закрытие направления

Весь pattern закрывается только после принятых конкретных variants, согласованной версии Astro/SoT/native Penpot для заявляемых случаев, обязательного browser/device evidence и разрешённой migration/drift protection. Требования active conformance contract имеют приоритет; этот tracker не создаёт альтернативного pass/fail стандарта.

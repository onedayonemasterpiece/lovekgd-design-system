# Planned pattern — detached chrome / floating control islands

| Поле | Текущее значение |
|---|---|
| Stable ID | `pattern.detached-chrome-control-islands` |
| Direction | `accepted_for_roadmap` |
| Current phase | `system_design_documented` |
| Implementation of this system version | `not_started` |
| New visual variants accepted | Нет; C1–C6 — документированные proposals |
| Pattern owner | Существующий lovekgd-design-system PR #47 и эта папка |
| Updated | 2026-09-05 |

**Текущий нормативный текст проектного решения:** [system-design-v1.md](system-design-v1.md). Данный dossier отвечает за routing/lifecycle, не дублирует FI-правила. Machine-readable companion: [planned-pattern.json](planned-pattern.json).

## 1. Owner amendment: было → стало

**Было:** custom design execution и заполнение site-specific variant registry запрещены до полного route/archetype AS-IS и exact Astro=SoT=Penpot всего требуемого корпуса.

**Стало:** по [постановке владельца от 2026-09-05](https://github.com/onedayonemasterpiece/events-bot-new/blob/62c54ce42786eecc5b380ea3dba002af78df8fd0/docs/features/static-site-pages/design-system/window-prompts/20260905-floating-islands-system-design.md) документальное проектирование и подготовка proposed variants выполняются сейчас. Исследуются реальные owners/components/archetypes; перед визуальным изменением фиксируется honest baseline **затронутого потребителя**, его известные gaps и доступные S/P доказательства. Нельзя считать baseline неверную страницу только потому, что её удобно перерисовать.

**Что не изменилось:** без verified native P нет A=S=P; production adoption и visual acceptance требуют действующих conformance/release gates; shared foundations, canonical Penpot и STATUS не меняются этим документальным пакетом. Общий normalization exit gate не ослаблен. Подробная stage boundary — FI-01, active conformance authority остаётся [astro-sot-penpot-conformance.md v1.2.0, проверенная revision](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/4b8c79ab60425b89075004b201c78cccf7019b31/docs/product-governance/astro-sot-penpot-conformance.md). Перед реализацией прочитать его актуальную integration версию, а не старую копию из исторической базы PR #47.

[Прежняя редакция dossier](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/774bcf0659915dffa16431847d408b2a6a6f2302/docs/research/floating-control-islands-2026-08/planned-design-pattern.md) сохранена в Git history. Её STOP и пустой registry больше не являются запретом разрешённой документальной работы.

## 2. Что документально определено

[Спецификация](system-design-v1.md) задаёт four-layer model, semantic roles/lifecycles, compositions C1–C6, safe-area/viewport/occupied-space, flow/sticky/compact/focus transitions, input/scroll/layer ownership, доступность, типизированную границу Search и source-bound native materialization.

[Consumer matrix](consumer-matrix-v1.md) покрывает все 17 actual registry archetypes, включая home, date/listings, обычные подборки, Search, event-detail, personal, artifacts и information/transactional pages. Голос — только один consumer, Free не заменяет весь сайт.

[FI-P1](implementation-package-1.md) выбирает реальный первый slice: shared geometry + section context на Popular, совместимость Today/Free/event-detail и C4 UI fixture. В нём 32 спроектированных тест-сценария, точные source integration boundaries, valid existing gates и порядок внедрения.

[Sources](sources-and-decisions-v1.md) фиксирует реально выполненные GitHub/browser reads и ограничения. Penpot read заблокирован safety check; native equality не заявлена.

## 3. Как понимать версии и authority

C1–C6 / `islands.*.v1` — proposed **composition variants внутри существующего pattern**, не шесть новых accepted component families. Surface skin/geometry наследуются из принятых компонентов и уточняются на actual candidate. Не вводить universal pill god-component, новый window manager или самостоятельный build/QA pipeline.

`implementation_status=not_started` относится к этой сквозной версии, а не означает, что в продукте нет nav/toast/context. Принятый нижний nav уже существует на mobile и desktop и должен сохраняться. Current semantic owners и фактические source locations перечислены в матрице/пакете; старые research `unresolved` slots не отменяют это mapping.

До реализации нельзя принять новые tokens/component versions, materialize canonical P по приблизительным размерам или массово заменить header. Документальный API proposal не утверждает существование runtime API.

## 4. Незакрытые следующие gates

- [x] Сбор существующей reference базы и owner clarifications; различение текущего source/public/evidence.
- [x] Site-wide applicability, roles/compositions/states и documentary runtime boundary.
- [x] Конкретный первый implementation slice и тест-план.
- [ ] Исполняемый FI-P1 и bounded browser acceptance на exact immutable candidate.
- [ ] Native S/P bindings и A=S=P для заявляемых cases; честные отдельные native keyboard/capture проверки.
- [ ] Owner visual acceptance выбранных новых variants и версий.
- [ ] Разрешённая production migration, zero-old-consumer check/rollback и post-deploy drift protection.

Закрытие документального проектирования **не закрывает весь pattern**. Основной definition of conformance читается из active DS contract; этот список не создаёт новый альтернативный критерий равенства.

## 5. Связи без дублирования требований

- [PR #39](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/39): lifecycle tracker направляет сюда.
- [events-bot-new#621](https://github.com/onedayonemasterpiece/events-bot-new/issues/621): действующая integration/normalization lane, не новая orchestration задача.
- [events-bot-new#587](https://github.com/onedayonemasterpiece/events-bot-new/pull/587): Search product/technical owner; ссылка на shared FI-17 adapter, без переноса ASR/ledger/retention в shell.

Будущие prompts указывают на FI-P1 и точную принятую revision этого пакета, а не пересказывают A=S=P/scroll/geometry своими словами.

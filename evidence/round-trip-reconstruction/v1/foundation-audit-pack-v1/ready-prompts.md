# Foundation Audit Pack v1 — independent audit prompts

Exact source: `docs/design-system-post-baseline-audits-and-product-atlas-checklist.md` @ `a2991f8b7cc516d7e80f95057d7b9e21ec81097f`.

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

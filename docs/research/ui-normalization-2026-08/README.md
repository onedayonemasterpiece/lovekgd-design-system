# Evidence-based UI normalization research — August 2026

Этот каталог — единая каноническая публикация переданных исследований о нормализации UI и дефрагментации компонентов для «Полюбить Калининград Анонсы». Полный текст исследований сохранён; для читаемости в Git нормализованы только окончания строк и завершающие пробелы. Ниже добавлены навигация, provenance и границы использования.

## Статус и границы

Исследования дают evidence base для family-scoped анализа, component contracts, migration и governance. Они **не** принимают компоненты, токены или варианты автоматически и не отменяют действующий статус `reconstructed` / `NOT_ACCEPTED` в [source-first decoder](../../source-first-component-decoder.md). Любое решение о merge, variant, split, composition, preserve, deprecate или promotion остаётся отдельным проверяемым шагом по конкретному семейству.

R-01…R-06 — immutable imported source reports: их текст не редактируется при последующем
adoption. R-07 — отдельный living append-only synthesis/adoption ledger, первоначально
seeded переданным source text с SHA-256
`bc9ba8960fbab631a1d9c317b9a87a00fef74f38e64761021684f1ccc2832ec1`.
Новые receipts добавляются в R-07, не переписывая R-01…R-06 и не создавая параллельный R-08.

## Полные тексты

| ID | Исследование | Роль |
|---|---|---|
| R-01 | [Evidence-based Normalization Charter для продуктовой дизайн-системы](01-normalization-charter-product-design-system.md) | исходный charter: typography, spacing, media, runtime states, interaction, motion и convergence |
| R-02 | [Внешний сбор доказательных best practices](02-external-best-practices-collection.md) | сравнительный атлас внешних систем и прикладных UI-паттернов |
| R-03 | [Best practices дефрагментации и унификации UI-компонентов](03-ui-component-defragmentation-best-practices.md) | методика inventory → family decision → contract → compatible migration → deprecation |
| R-04 | [Внешний доказательный корпус best practices](04-external-evidence-corpus.md) | корпус источников, шкала силы evidence и границы доступности источников |
| R-05 | [Evidence-based Normalization Charter для «Полюбить Калининград Анонсы»](05-normalization-charter-lovekgd.md) | charter, привязанный к reviewed decoder snapshot и project evidence |
| R-06 | [Глубокое исследование: Best practices дефрагментации и унификации UI-компонентов](06-deep-ui-component-defragmentation-research.md) | самостоятельный deep-dive: архитектура перехода, lifecycle и безопасная миграция UI-компонентов |
| R-07 | [Cross-research synthesis and adoption ledger](07-cross-research-synthesis-and-adoption.md) | принятые границы и evidence-gate для project-specific normalization synthesis; не утверждает физические слияния или токены |

## Provenance и дедупликация

| Переданный файл | Результат публикации | SHA-256 исходного текста |
|---|---|---|
| `3977fe8f-36c5-44c2-9a86-bf1705259e30/pasted-text.txt` | R-01 | `b851017a6e0dec1771c4f284d88836d06b45bff45cf678f383a30fee825384c6` |
| `864e61de-7453-475a-9730-658909f27de3/pasted-text.txt` | R-02 | `f2988069318e908b9923b01869e26cd6ab3c2fe085e57df29856adfbcf52bb3c` |
| `d35e7576-b293-41eb-bbe2-51d6d02281fe/pasted-text.txt` | duplicate R-02; отдельная копия намеренно не создана | `f2988069318e908b9923b01869e26cd6ab3c2fe085e57df29856adfbcf52bb3c` |
| `5c4de553-8365-4edb-a0c8-fcded1d99488/pasted-text.txt` | R-03 | `6a27613d9bd66c87f16046a91b14a62334251565aeb0c204197d2a95ade60110` |
| `acee2202-c3b5-4bc8-a932-3ef825acb962/pasted-text.txt` | R-04 | `189ed301d03d9acfc93a0effc8abc9e98e240b771d1ab4b43f2bb485cb6382e0` |
| `23c3c597-5c5b-46f2-9e4f-84f262a2cbc2/pasted-text.txt` | R-05 | `afd640e09f38366d0581dc8f3f4dc1f835da0d8af03de847a5b039e5576339ea` |
| `e6dfc5b6-cdd1-435b-a28f-a16e2528728d/pasted-text.txt` | R-06 | `b2f3a119329f165af32858bb724449945cc5cc16d4a8be922537008c58e26fb2` |
| `4a494da4-006b-4057-b824-841ea8f4554d/pasted-text.txt` | R-07 | `bc9ba8960fbab631a1d9c317b9a87a00fef74f38e64761021684f1ccc2832ec1` |

Идентичные SHA-256 R-02 и duplicate подтверждают byte-for-byte дубликат: публикация сохраняет одну полную копию и явную provenance-запись, не раздувая corpus второй одинаковой версией.

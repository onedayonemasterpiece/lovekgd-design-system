# IdeaHub owner voice intake — 2026-08-28

Status: `TRIAGED`

- review ID: `REV-IDEAHUB-20260828-01`
- source repository: `onedayonemasterpiece/idea-hub` (read-only)
- evaluated source HEAD: `5881ec64d0384cfc95ba7eb8cf07f5f15c8d4533`
- source boundary: `voice-20260828-114654-2c907d62.md` through `voice-20260828-125353-9e0a4426.md`, inclusive
- relevant design-system voices: `1`
- excluded cross-project voices: `4`
- new `OV-*` IDs: `0`
- processed: `NO`

This record adds the corrected IdeaHub voice as a source reference and clarification for existing owner items. It does not claim an Astro, UI SoT or Penpot mutation. `OV-09…OV-19` remain cross-contour and outside the Astro ↔ UI SoT ↔ Penpot completion count.

## Relevant voice and dedup disposition

Source file: [`inbox/voice/2026/08/voice-20260828-114654-2c907d62.md`](https://github.com/onedayonemasterpiece/idea-hub/blob/5881ec64d0384cfc95ba7eb8cf07f5f15c8d4533/inbox/voice/2026/08/voice-20260828-114654-2c907d62.md)  
Captured: `2026-08-28 11:46:54–11:54:44 Europe/Kaliningrad`  
Packet: `voice-20260828-114654-2c907d62`  
File content commit on the evaluated HEAD: `3ac4b0daac735025b8b43a0521aba203dcaed340`

| Source observation / target | Existing item(s) | Disposition and supersession |
|---|---|---|
| `25.1`: two icons sit outside the centralized iconography owner | `OV-08`, `OV-30` | Clarifies the global duplicate-root/canonical-lineage gate with a concrete page and count. It supersedes any assumption that visual presence on `25.1` proves correct icon ownership. |
| `63.03 Weekend Listing`: possible duplicate rather than a justified archetype | `OV-08`, `OV-30` | Adds `63.03` to the canonical-root census. Keep or remove it only after Astro/UI authority establishes whether it is a distinct archetype. |
| `63.04 Astro Popular Listing`: static event-card assembly, right-edge clipping and header overlap | `OV-08`, `OV-30`, `OV-33`, `OV-42` | Clarifies existing lineage, shell/header and full-width container requirements. It supersedes any claim that a visually similar raster/static assembly or a clipped row is an implemented listing. |
| `63.05 Atlas Unusual Listing`: collection remains empty | `OV-49` | Direct repeat with stronger current evidence; supersedes any stale claim that the page is populated or ready for review. |
| `63.06 Astro Search`: cards do not show a complete entered-query/results page | `OV-47`, `OV-48` | Clarifies that isolated cards are not the required search result state. Astro remains the AS-IS source; no new requirement. |
| `63.07 Event Details`: first-screen title/overlap and CTA differ from Astro; the CTA is described as invented | `OV-45`, `OV-46` | Adds explicit first-screen and CTA parity evidence. It supersedes any acceptance of the current page-local Event Details/CTA composition; exact mobile defects still require focused visual context. |

No genuinely new requirement remains after this dedup, so numbering stays at `OV-49`. All mapped actionable items remain `processed: NO` until Git SoT disposition, bounded Penpot mutation, structural readback, focused Astro ↔ Penpot evidence and owner re-review exist.

## Exact transcript

### 00:00:00–00:00:24

Листинг `Icon Semantic`. Здесь я вижу на странице `25.1` всего две иконки, хотя у нас есть для иконок централизованная страница в дизайн-системе где-то на ранних цифрах. Да, страница 25 — иконография. Почему они не там — странно.

### 00:00:24–00:00:43

Дальше продолжаю. Я видел много страниц 61 и далее и смотрю `63.03 Weekend Listing`. Это как будто дублирование или это архетип, но немножко странно.

### 00:00:43–00:01:39

Далее я смотрю `63.04 Astro Popular Listing`, и там смотрю события, допустим, «Предметные страсти: натюрморт XX века», музей изобразительных [название распознано не полностью], идёт до 30 августа. Так вот, это вообще не компонент. Оно ни на что не ссылается. Это просто картинка, вставленная здесь. Это неправильный подход к созданию дизайн-системы. Карточки событий все должны ссылаться на единые компоненты. Если эти компоненты имеют разный вид, то есть базовый набор видов карточек, есть его переиспользование и конечное отображение. Не должно быть ситуации, что оно собрано просто визуально похоже.

### 00:01:39–00:02:18

Если смотреть в целом на страницу `63.04`, я вижу, что крайние справа события уходят за правый край, то есть обрезаются. У нас такого в Astro нет: фактически идёт переход на следующую страницу, вроде бы. Здесь есть расхождение с фактической реализацией. И в шапке прямо визуальная ошибка, потому что бирка «Полюбить Калининград Анонсы» частично закрыта следующим блоком.

### 00:02:18–00:02:50

Снова смотрю `63.05 Atlas Unusual Listing`. Несмотря на то, что я уже ранее сообщал, что это страница подборок и на ней должны быть конкретные события, я конкретных событий не вижу. Не может быть ситуации «подборка готовится»: страницы не должны быть пустыми. Они должны быть наполнены. Я уже ранее давал комментарии, как это должно быть. Предыдущие комментарии не обработаны.

### 00:02:50–00:03:37

Я смотрю страницу `63.06 Astro Search`. Я ранее говорил, что страница должна содержать в том числе вид с найденной выборкой, то есть со списком событий, и этого не вижу. На страницу добавлены пара карточек событий, но они не отображены в интерфейсе целиком. Я не вижу, как выглядит страница, если введён поисковый запрос и найденные события отображены внизу.

### 00:03:37–00:04:37

Я смотрю страницу `63.07 Event Details` и по-прежнему не вижу никаких доработок. Предыдущее замечание было в том, что текущее отображение в Penpot не соответствует Astro. На первом экране я должен сразу видеть как минимум название события, и это фактически реализовано в Astro. Подробная карточка здесь опущена слишком низко. Это выглядит как локальная фантазия: не фактическая реализация, а приблизительно похожая сборка. То же самое с CTA-блоком с ценой и остальным. Этот блок выдуман. Я уже оставлял комментарий поверх, но он не обработан.

## Later files classified and excluded

All four later files were read through their full transcripts at the evaluated source HEAD. They are outside the LoveKGD design-system contour and do not create or supersede an `OV-*` item.

| Captured at (`Europe/Kaliningrad`) | Source file | Classification / exclusion reason |
|---|---|---|
| `2026-08-28 12:02:03` | `voice-20260828-120203-210f441f.md` | Intellectual-center architecture and a business diagram for the regional branch of Российское общество «Знание»; IdeaHub/Penpot Business cross-project work. |
| `2026-08-28 12:06:27` | `voice-20260828-120627-2822710b.md` | Business-audience terminology for architecture diagrams (`ChatGPT`, `Claude`, `OpenCode` instead of an abstract MCP client); not Astro/UI/Penpot design-system feedback. |
| `2026-08-28 12:08:23` | `voice-20260828-120823-1d4c2002.md` | Voice-driven lecture/presentation editing through a mobile MCP client; wonderful-lections/intellectual-center product contour. |
| `2026-08-28 12:53:53` | `voice-20260828-125353-9e0a4426.md` | GigaChat API option for the mobile lecture client and architecture schemes; IdeaHub/wonderful-lections contour. |

## Cursor

- source HEAD read: `5881ec64d0384cfc95ba7eb8cf07f5f15c8d4533`
- last file read: `inbox/voice/2026/08/voice-20260828-125353-9e0a4426.md`
- last packet: `voice-20260828-125353-9e0a4426`
- cursor timestamp: `2026-08-28T12:53:53.313466+02:00`
- next intake starts strictly after this file on a fresh IdeaHub HEAD.

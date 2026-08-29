# Telegram owner voice intake — 2026-08-26/27

Status: `CAPTURED_PENDING_PENPOT_VERIFICATION`

This record preserves the fresh owner-review comments that must drive the next bounded Penpot pass. It is an intake and acceptance record, not proof that the visual defects are already fixed.

## 1. Source boundary

- Source chat: `https://t.me/c/4337049383/1030`
- Chat title resolved through eventsBot MCP: `KenigEvents · UI review`
- Timezone used for the review boundary: `Europe/Kaliningrad` (`UTC+02:00`)
- Requested calendar window: `2026-08-26` and `2026-08-27`
- Explicit review marker: `Мои замечания ревью по текущей дизайн системе в Penpot 👇`
- Marker time: `2026-08-26 22:54:08 +02:00`
- Last relevant voice at extraction: `2026-08-27 00:42:23 +02:00`
- Relevant review voices captured: `8`
- Unrelated product, diagrams, channel and automation ideas interleaved in the same chat were excluded from this design-system intake.
- No Penpot mutation was performed while capturing this record.

## 2. Normalized owner requirements

| ID | Local time | Surface | Normalized requirement | Acceptance evidence required in the next Penpot pass |
|---|---|---|---|---|
| `OV-01` | `2026-08-26 22:55:40` | `40.3A · Popular mobile fixtures` | The horizontal `Rail` is one canonical component family. `Mobile row` may only be a named variant/fixture of that family, not an independent page-local root. Date-period content such as `5 июня–30 августа` must be supported deliberately. An artifact may be nested in the same canonical rail composition where the source contract requires it. | Trace every visible row to the canonical Rail owner; list component/root UUIDs; prove no detached or alternative Rail roots; show the period-date variant and its source-faithful wrapping. |
| `OV-02` | `2026-08-26 22:56:07` | `40.3A · Popular mobile fixtures` | Existing media framing rules are violated wherever fields/letterboxing are visible. Images must use cover crop and scaling without stretching, letterboxing or empty fields. | Fresh exports of every affected fixture plus wrapper/media geometry and crop mode. A structural readback without visual exports is insufficient. |
| `OV-03` | `2026-08-26 22:56:18` | Review context | The owner deliberately did not click/select controls while the audit was running. This is context, not a product requirement. | Do not infer missing interaction states from owner actions during this review session. Materialize and verify the states explicitly. |
| `OV-04` | `2026-08-26 23:20:47` | New Branding reference page | The design system needs a dedicated branding page covering the umbrella brand `Полюбить Калининград` and the product brand `Полюбить Калининград Анонсы`, including the distinctive `Анонсы` wordmark/wide `О`, logo/wordmark use, tag treatment, key colors, spacing and current implementation parity. | One owner-readable Branding page with named boards, source references and desktop/mobile examples. Missing brand rules block `READY_FOR_OWNER_REVIEW`. |
| `OV-05` | `2026-08-26 23:21:47` | Branding variants and contracts | Show the leather-backed protruding tag on desktop and mobile; vertical and horizontal brand lockups; clear-space/spacing rules; all principal brand renderings. Formalize reusable items as components. Explicitly distinguish static/raster assets from reusable component contracts. Preserve the currently successful implementation rather than redesigning it speculatively. | Variant matrix, clear-space specimens, component/static-asset classification, ancestry/readback proof and Astro/UI SoT references where they exist. |
| `OV-06` | `2026-08-26 23:44:16` | `63.15 · Artifacts` / Focus group | The page must show the complete set of seven focus-group artifacts and the required interaction/state coverage: none expanded, a subset expanded, all expanded, hover/focus, and one selected artifact with detailed information. | Count `7/7`; named state boards; selected-detail specimen; no state represented only by prose; desktop/mobile coverage where the runtime supports both. |
| `OV-07` | `2026-08-27 00:16:04` | Home HeroTalk | Add a dedicated page/specimen that explains HeroTalk communication chains as `phrase → arrow → phrase → …`. Event-dependent images are not required. Images may be included only when they are stable, standard assets independent of the event payload. | At least one complete source-faithful chain, explicit step/order semantics, stable-image disposition, and mapping to the Home HeroTalk family/variants. |
| `OV-08` | `2026-08-27 00:42:23` | Global structural gate | Visually similar solutions must not hide duplicated component roots. Rail cards/rows and image framing must descend from canonical sources of truth and follow one construction principle across pages. Page-local lookalikes or divergent roots are a release-blocking defect. | Repository/UI SoT/Penpot lineage table; duplicate-root census; canonical family UUIDs; detached-instance count; exceptions must be explicit and justified. Visual similarity alone is not proof. |

## 3. Effect on the current delivery ledger

The existing CP-01 visual/readback result remains useful evidence, but it does **not** close the newer structural requirement in `OV-08`. The following gates are now authoritative:

- `40.3A` remains open until both visual crop proof (`OV-02`) and canonical ancestry proof (`OV-01`, `OV-08`) pass.
- The current Artifacts batch is widened by `OV-06`; merely showing an Artifacts page is insufficient without all seven artifacts and the explicit state matrix.
- The current HeroTalk batch is widened by `OV-07`; a generic Home page or isolated messages are insufficient without a readable communication-chain specimen.
- A new Branding batch is required by `OV-04` and `OV-05`.
- A global release gate is required by `OV-08`: no page may reach `READY_FOR_OWNER_REVIEW` on visual resemblance alone when component lineage is unknown.

Terminal status remains `IN_PROGRESS`. The next step must inspect the actual Penpot file and attach visual plus structural evidence to each actionable requirement.

## 4. Faithful transcript record

### `OV-01` — `40.3A`, canonical Rail and missing period variant

Transcription ref: `atr_yXKR4dGuRWcQvZZB5RgVGpoQM3yCi8RiqCoFvKUwU0g`

> Страница 40.3A. Популярные мобильные фикстуры. Вижу большое количество Rail-компонентов. Они тут почему-то называются по-другому — Mobile row. У нас вроде бы компонент, который горизонтальный, мы его Rail называем, как рельсы. Но ключевое: у меня складывается ощущение, что это не централизованный компонент, который мы отрабатывали. Rail — потому что мы же изначально, до того как начали собирать архетипы страниц, отработали карточки событий, все типы карточек. Это был финал, и из них нужно было собирать. То есть там были готовые компоненты. Возможно, какие-то варианты мы пропустили. Как сейчас я вижу, допустим, где 24, 26 июля; где периоды 5 июня–30 августа — периоды не были отработаны. Но здесь должно быть всё прицеплено на единый компонент Rail. Он одинаковый. В нём может быть и артефакт спрятан.

### `OV-02` — `40.3A`, framing violation

Transcription ref: `atr_XZcrlhggaABw-yKbqUQEYfYGrOj0yCo2REoVEG52jhI`

> Самая главная ключевая ошибка: я вижу, что в изображениях, которые вставлены, нарушен фрейминг, потому что я вижу поля. У нас принято, что нигде поля недопустимы. То есть изображение всегда подвергается кропу и фреймингу. Здесь это нарушено. Напомню, что речь про страницу 40.3A.

### `OV-03` — owner did not interact during the audit

Transcription ref: `atr_6BlNGxKtFqAIpEq07uP2d4WEMJKNHc0q_IA_uVX9j1M`

> Я, чтобы не нарушить, пока идёт работа над аудитом, не нажимаю и не выбираю.

### `OV-04` — dedicated Branding page

Transcription ref: `atr_R_ZiDVQOsc0VbmKwZ9ny7h4YhOBU8aRt_a2p39zUZBM`

> Ещё в дизайн-системе должна быть страница, посвящённая брендингу. У нас сейчас есть основной бренд — вообще бренд «Полюбить Калининград». Конкретно этот сайт — «Полюбить Калининград Анонсы». Логотип, точнее сильное написание, вместо логотипа у нас «Анонсы» с широкой буквы О. Его написание, правила его написания и так далее; особенности, как выглядит бирка, каковы ключевые цвета, какие отступы, как она может работать. У нас есть несколько логотипов, в том числе логотип для PWA.

### `OV-05` — brand variants, spacing and component/static-asset distinction

Transcription ref: `atr_x2DrKto-X4cXeTWKAt_P38aojM4GMIJXo_fetPlbNT4`

> Бирка, элемент, торчащий на кожаной подложке, для десктопа, для мобильного. Непосредственно написание бренда «Полюбить Калининград Анонсы». Вертикальное, горизонтальное. Все основные виды начертаний, связанных с брендингом. Как это работает, каковы должны быть отступы и так далее. То есть, по сути, оно тоже должно быть, наверное, даже оформлено как компоненты. Но по факту мы их не вставляем дальше, потому что часть бирок является просто картинками. Но это не означает, что у брендинга нет правил. Эти правила должны быть формализованы, они должны совпадать с тем, как это фактически сейчас реализовано, потому что реализовано в целом неплохо.

### `OV-06` — complete seven-artifact state matrix

Transcription ref: `atr_jTPhywYz-uqWvkLgra6Bbm2R6RJaMLuGtviDUN4JV40`

> Я смотрю на страницу 63.15 Artifacts и не вижу, чтобы здесь где-либо был полный набор артефактов, которые для фокус-группы — семь штук; чтобы они здесь были отображены все на странице в вариантах: все раскрыты, раскрыта только часть, ни один не раскрыт; ещё также наведён; какой-то из них непосредственно нажат и показана более подробная информация об артефакте.

### `OV-07` — HeroTalk communication-chain page

Transcription ref: `atr_PwJkO1-97ZpMcnvYxqRlCvVyiaqMPK8T7ZjzMNG29cI`

> Также в дизайн-системе нужно разместить страницу, которая будет показывать работу HeroTalk. По сути, будет показывать цепочки HeroTalk-коммуникаций: фраза, стрелка, следующая фраза, стрелка, следующая фраза и так далее. Отображение картинок не обязательно, потому что картинки связаны непосредственно с событием, это в чистом виде переменная история. Возможно, стоит добавить на эту страницу те картинки, которые могут быть стандартные, то есть отображаться всегда вне зависимости от события, если такие вообще есть.

### `OV-08` — no visually hidden component duplication

Transcription ref: `atr_GkEwlq3PsuzCm1D1PWsxeTXNE1pRU_odEN1pkNifZvs`

> Надо проверить самое главное, что за визуально похожими решениями, которые мне на глаз трудно отличить, на самом деле ты не задублировал компоненты. Ну то есть, грубо говоря, есть Rail-карточка, Rail-компонент — он единообразный изначально. Он строится по одним принципам, как и вставленные изображения используют изначально базовый принцип фрейминга. А не так, что у нас таких Rail-карточек много вариантов совершенно разного корня, по-разному сделанных на разных страницах, не сведённых к единому источнику правды. Вот чтобы такого не было. Потому что это тогда серьёзный косяк.

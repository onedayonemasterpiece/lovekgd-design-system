# IdeaHub owner voice intake — 2026-08-28

Status: `HISTORY_AUDITED / TRIAGED`

- review ID: `REV-IDEAHUB-20260828-01`
- source repository: `onedayonemasterpiece/idea-hub` (read-only)
- evaluated source HEAD: `76c337ee1bf5a0d90b93222cf9db662e6d4167e6`
- history boundary: every commit reachable from fetched refs that touches
  `inbox/voice/2026/08` (`27` commits, `23` packet files)
- relevant design-system voices: `2`
- excluded non-design-system voices: `21`
- new `OV-*` IDs: `3` (`OV-50…OV-52`)
- processed: `NO`

The first version of this record only scanned forward from the known `e8813a5`
checkpoint. That boundary was insufficient: an earlier relevant packet,
`voice-20260828-112125-6de734d5`, was omitted. The history audit now covers the
whole directory across all fetched commits, including later normalization edits.
It does not treat packet discovery as an Astro, UI SoT or Penpot fix.
`OV-09…OV-19` remain cross-contour and outside the Astro ↔ UI SoT ↔ Penpot
completion count.

## History-wide census

- first packet commit: `32296697296e1a65734ff5f1300ec24ab817c812`;
- last packet commit: `14a65d75b94aa8ebb7a78e6d01bba60899444226`;
- latest fetched `origin/main`: `76c337ee1bf5a0d90b93222cf9db662e6d4167e6`;
- commits touching the directory: `27`;
- packet files ever added: `23`;
- packet files still present at the evaluated HEAD: `23`;
- deleted/renamed packet files: `0`;
- relevant LoveKGD/KenigEvents design-system audits: `2`;
- excluded test, IdeaHub, lecture, MCP/intellectual-center and other-project packets: `21`.

Both relevant packets were read at every committed version. The edits in
`531ff01` and `3ac4b0d` normalize terminology and repair the synthesis/transcript
presentation; they do not remove a product observation from the original audio.

## Earlier relevant voice omitted by the first cursor

Source file: [`inbox/voice/2026/08/voice-20260828-112125-6de734d5.md`](https://github.com/onedayonemasterpiece/idea-hub/blob/76c337ee1bf5a0d90b93222cf9db662e6d4167e6/inbox/voice/2026/08/voice-20260828-112125-6de734d5.md)
Captured: `2026-08-28 11:21:25–11:27:40 Europe/Kaliningrad`
Packet: `voice-20260828-112125-6de734d5`
History: created by `5deb06583b19cc5eca3c08178b9df02060e57821`, terminology-normalized by `531ff01add115b49824aa0bda96d6978bcf8dbce`.

| Source observation / target | Item(s) | Disposition |
|---|---|---|
| `63.01 Home`: the product hero must use the real HeroTalk `Photo Mosaic` mechanism, not the recurring fabricated legacy hero | `OV-50` | New product-change requirement. It is not the same as `OV-07`, which asks for a separate communication-chain documentation specimen. Astro/UI SoT must be changed before Penpot main parity can be claimed. |
| `63.01 Home`: event cards are page-local lookalikes | `OV-08`, `OV-30` | Concrete Home consumer evidence for the existing canonical-lineage gate. |
| `63.02 Date listing`: visually plausible event cards point to `60.1g`, not the one canonical event-card owner | `OV-08`, `OV-30` | Concrete Date-listing consumer evidence; visual similarity is not closure. |
| `10.1 Announcements Wordmark`: missing spacing/use rules, leather-backed tags and PWA cover | `OV-04`, `OV-05` | Direct clarification of the already-open Branding batch. |
| `61.3 Weekend Time marker`: the marker block should not carry its own opaque background | `OV-51` | New page-specific visual/structural requirement. Verify Astro/UI surface rules before mutation. |
| Weekend consumers: event cards must inherit the one canonical event-card family | `OV-08`, `OV-30` | Broadens the required consumer census to Weekend pages. |
| `61.10 Weekend Discovery rail exact`: turn the full-width installed shelf into a content-sized transparent `Floating Island` | `OV-52` | Implemented as shared `ListingDiscoveryRail@6`, with explicit `plane` / `floating-island` axis. Weekend consumes the Floating Island; Date and Popular consume the same v6 owner on the plane surface. Git-bound Penpot main and linked instance are recorded below. Owner re-review is still required. |

### Exact transcript — earlier relevant voice

#### 00:00:00–00:01:15

Это ревью проекта статический сайт э-э kenigevents.ru и EventsBot дизайн-система. Смотрю его в Penpot. Значит, начинаем с главной. Похоже, ты неправильно понимаешь наименование блока HeroTalk. HeroTalk он у нас реализуется в виде интерактивной системы, которая показывает фразы и показывает картинки в таких кубиках, квадратиках, появляющиеся и исчезающие. Ты же на мою предыдущую доработку о том, что нужно показать э-э все фразы, цепочки фраз взял и какой-то старый нелегитимный блок дополнил сверху еще, э-э ну, просто, записями хочется выбраться, а не листать всю афишу. Один понятный выбор. Я еще раз напомню, каким-то образом когда-то э-э нейросеть сама сделала выдуманную главную страницу, и теперь этот блок постоянно тас

#### 00:01:15–00:02:07

кается из раза в раз. То, что сейчас показано с картинкой предметные страсти натюрморт двадцатого века, где где заголовок куда пойти без лишнего шума, это неправильный блок. Такого э это не не то, что должно быть на главной. На главной блок должен начинаться, да, главный должен начинаться с HeroTalk, там, где квадратиками картинки показываются. Вот сейчас это натюрморт с нос но со страстями. Home HeroTalk, Viewport Desktop Mobile, Mode равно Photo Mosaic. Вот это ближе к правильному.

#### 00:02:07–00:02:52

Продолжаю я смотрю страницу 63.01 Astro Home. Так вот, а блоки, карточки событий здесь, а-а, почему-то созданы локально. Видно, что они неправильные. Я нажал на э-э переход к исходному компоненту, и вижу, что исходный компонент находится на этой же странице, а должен, э, подключать централизованную ну единую большую карточку. А то, что ты собрал здесь, является э визуальной ошибкой, собрано неправильно, не из централизованного компонента.

#### 00:02:52–00:03:03

К странице 63.02 Astro Date Listing как будто бы претензий нету, ну, точнее, непонятно.

#### 00:03:03–00:04:07

А понятно, нет претензий. Есть, потому что оно почему-то ведет на 60.1g, э ну визуально компонент собран верно, но он не относится к исходному компоненту э карточки событий. Это опять э созданная вариация карточки событий где-то на другой странице. Задача была в дизайн-системе единообразно. Вот если есть определенный вид карточки событий, у него только один родительский компонент, один всего на всю дизайн-систему. Дальше он идет наследовании на-на-наследованиями, ну и определенными изменениями. Так мы должны получить были на одной странице все виды э карточек событий, все виды. А так получается, вот ты сделал куча мутирующих, которые визуально похожи, но не централизованы, то есть задача дизайн-системы не э не решается таким образом.

#### 00:04:07–00:04:37

Смотрю страницу 10.1 Announcements Wordmark, и здесь всего один заголовок. Здесь нет правил отступов, правил работы с брендом, нету почему-то вот этих бирок, которые у нас декоративные с кожаной подложкой, нет обложки PWA-приложения. Ну то есть, много чего не доработано.

#### 00:04:37–00:04:57

Смотрю страницу 60. 61.3 Weekend Time Maker. Особых претензий нет, но блок, если у блока фон задан, это немножко странно. То есть по идее такие блоки без своего фона должны быть.

#### 00:04:57–00:05:39

Еще раз напомню, я вот смотрю страницы в Weekend сейчас, несмотря на то, что это Weekend, у неё должна быть должны карточки компоненты карточек исходить из самых родительских, которые единообразные. Вот карточка события на одной странице. То есть ты по сути не довел унификацию унификацию некоторых компонентов. А значит, если мы какие-то компоненты будем менять централизованно, на этих страницах они просто не будут поменены. Это неправильно.

#### 00:05:39–00:06:14

Я смотрю страницу 61.10 Weekend Discovery Rail Exact и здесь я вижу Listing Weekend Discovery Rail Exact Weekend. Но это по сути полка устанавливаемая. Вот эти полки нужно будет перепроектировать уже на Floating Island, плавающий остров, чтобы освободить вот это вот занимаемое пространство и добавить прозрачности. Это уже доработка.

## Relevant voice and dedup disposition

Source file: [`inbox/voice/2026/08/voice-20260828-114654-2c907d62.md`](https://github.com/onedayonemasterpiece/idea-hub/blob/76c337ee1bf5a0d90b93222cf9db662e6d4167e6/inbox/voice/2026/08/voice-20260828-114654-2c907d62.md)
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

The later packet creates no additional ID. The earlier packet creates
`OV-50…OV-52`; all three remain `processed: NO`. `OV-51` and `OV-52` now have
bounded Git/Penpot evidence and are ready for owner re-review. For `OV-50`, the
owner subsequently supplied the accepted live donor preview
`https://kenigevents.ru/preview-20260730-hero-talk-date-donor-r2/`. Its exact
historical source is Astro commit `0eaf08c6827d5b2cbd4c2603380dd13a36be1ada`;
the source-faithful restoration is `events-bot-new#596` commit `4243401a4`.
Penpot projection remains paused/incomplete, so `OV-50` is not ready for
re-review. No item becomes processed until owner re-review.

### OV-50 source correction and Astro receipt

- accepted visual/runtime oracle:
  `https://kenigevents.ru/preview-20260730-hero-talk-date-donor-r2/`;
- exact historical Astro source: `0eaf08c6827d5b2cbd4c2603380dd13a36be1ada`;
- restored Astro/UI SoT: `events-bot-new#596`, commit `4243401a4`;
- rejected and reverted attempt: `7d026b30d` (rounded event-card anatomy,
  details, CTA, manual controls and `5×4` grid were not present in the donor);
- accepted desktop anatomy: full-width `360px` stage, `75vw` media, default
  `16×5` grid, `3px` column gaps and no row gaps;
- accepted mobile anatomy at `390px`: `250px` text-only stage; mosaic media is
  not displayed;
- focused evidence:
  `evidence/recovery-20260828/astro/home-herotalk-{accepted,restored}-{1440,390}.png`
  and `home-herotalk-accepted-restored.v1.json`;
- exact donor plus seven canonical phrase chains:
  `catalog/ui-components/hero-talk/accepted-donor-and-chains.v1.json`;
- owner explicitly allowed a lightweight raster-overlay exception for the
  Penpot desktop mosaic, while Astro must retain real generated/animated tiles;
- owner paused Penpot and may close the window. Resume with read-only exact-ID
  reconciliation; do not replay the interrupted/partial projection.

### OV-04 / OV-05 Git-side branding disposition

The owner-readable Penpot page is still pending, but the required Git input is
now explicit rather than inferred from one heading:

- machine-readable contract:
  `catalog/branding/announcements-v1/contract.v1.json`;
- owner-readable rules:
  `docs/branding/announcements-branding-sot.md`;
- the one live owners are `AnnouncementsWordmark.astro` and
  `AnnouncementsLockup.astro` with `desktop` / `mobile` variants;
- desktop/mobile leather is classified as decorative static skin behind live
  text/SVG, not as an alternate component root;
- actual header dimensions, spacing, fallback colour and asset hashes are
  source-locked;
- the PWA `any` and `maskable` `192/512` launcher pairs are classified as
  static application artwork, with the operator-approved source and `82%`
  maskable safe-area rule retained.

Both items remain `processed: NO`: Penpot is paused, so native page ancestry,
readback, focused export and owner re-review do not yet exist.

### OV-52 implementation receipt

- Astro/UI SoT: `events-bot-new` Draft PR
  [`#596`](https://github.com/onedayonemasterpiece/events-bot-new/pull/596),
  commits `95db01388` and `59fc98031`;
- shared contract: `ListingDiscoveryRail@6`, surfaces `plane` and
  `floating-island`; Weekend explicitly selects `floating-island`;
- browser readback at `/vyhodnye/`, `1440×1000`: transparent `1440×52` outer
  plane, content-sized `1188.734375×52` island, `0 px` city/time overlap;
- Penpot revision `2621`: native component
  `c0b867fa-32d2-8062-8008-8d679ca1da53`, native main
  `c0b867fa-32d2-8062-8008-8d6799e9e61f`, linked copy
  `c0b867fa-32d2-8062-8008-8d679cafd229`; old v5 component is retained as
  deprecated and points to the v6 replacement;
- named Penpot version:
  `Recovery 2026-08-28 · OV-52 Git-bound 59fc98031`;
- Penpot `validate()=[]`;
- focused evidence:
  `evidence/recovery-20260828/penpot/weekend-discovery-rail-v6.png`
  (`1589×524`, `25,776` bytes, SHA-256
  `2276afb40c612be593b3ccaa5d4be3b38bb4952701a8ea38b33f8e4d4f13200b`)
  and `evidence/recovery-20260828/astro/weekend-discovery-rail-v6.{png,json}`.

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

## Complete excluded packet census

Every excluded packet was read through its full transcript at the evaluated
HEAD. Incidental mentions of LoveKGD, Astro, Atlas, Penpot or «Полюбить
Калининград» do not make a packet a design-system audit when its actionable
content belongs to another product contour.

| Packet | Classification / exclusion reason |
|---|---|
| `voice-20260828-065647-08b64f70` | Explicitly excluded synthetic devstand voice-intake smoke test. |
| `voice-20260828-091227-0cfdc48c` | Audio test and ownership statement about IdeaHub; no design-system feedback. |
| `voice-20260828-091731-d34c6629` | IdeaHub mobile recording/keyboard/productivity session. |
| `voice-20260828-094518-2f5696ac` | Accidental, non-substantive recording. |
| `voice-20260828-102528-cf606b7d` | Terminology and GitHub-readback test. |
| `voice-20260828-104415-14bca319` | Voice recording/transcription test. |
| `voice-20260828-104907-784cbf35` | Mobile MCP-capable client for the regional «Знание» contour. |
| `voice-20260828-110522-574b04cd` | «Паровоз в Багратионовск» portfolio/project-map work. |
| `voice-20260828-111218-bbe4e1bc` | Terminology enumeration for IdeaHub/MCP architecture; no page defect. |
| `voice-20260828-112621-0a01265a` | Second terminology enumeration; no actionable design-system review. |
| `voice-20260828-113325-d4048f1e` | Accidental recording. |
| `voice-20260828-120203-210f441f` | «Знание» intellectual-center architecture/business diagram. |
| `voice-20260828-120627-2822710b` | Business-audience wording for architecture diagrams. |
| `voice-20260828-120823-1d4c2002` | Voice-driven lecture/presentation editing. |
| `voice-20260828-125353-9e0a4426` | GigaChat API for the mobile lecture client. |
| `voice-20260828-130901-4d1e4066` | Functions of the «Знание» intellectual center. |
| `voice-20260828-140642-a04d7bea` | Agent-system educational courses. |
| `voice-20260828-141916-08910102` | Architecture-component terminology enumeration. |
| `voice-20260828-142057-92be2926` | Correction of course audience/format. |
| `voice-20260828-142355-c5a8dc75` | `record-idea-hub` lecture/excursion ingestion; its LoveKGD mention concerns content capture, not this UI audit. |
| `voice-20260828-142841-979ee3f3` | Real-time dialogue/fact-checking assistant. |

## Cursor

- source HEAD read: `76c337ee1bf5a0d90b93222cf9db662e6d4167e6`
- history mode: all commits touching `inbox/voice/2026/08` were enumerated;
- last file by capture time read: `inbox/voice/2026/08/voice-20260828-142841-979ee3f3.md`;
- last packet: `voice-20260828-142841-979ee3f3`;
- cursor timestamp: `2026-08-28T14:28:41.658705+02:00`;
- next intake starts after this packet on a fresh IdeaHub HEAD, while a future
  history audit must still detect backfilled files whose capture time predates
  the cursor.

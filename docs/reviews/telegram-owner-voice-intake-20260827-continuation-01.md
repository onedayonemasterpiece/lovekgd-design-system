# Telegram owner review continuation — 2026-08-27

Status: `IN_PROGRESS`

- canonical review: `REV-TG-20260826-01`
- continuation: `REV-TG-20260826-01-CONT-01`
- repository: `onedayonemasterpiece/lovekgd-design-system`
- branch: `fix/penpot-owner-comments-20260826`
- Draft PR: `#53`
- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`
- source boundary: `2026-08-27 08:06:31` — `2026-08-27 09:24:56`, `Europe/Kaliningrad`
- preceding intake: [`telegram-owner-voice-intake-20260826-27.md`](telegram-owner-voice-intake-20260826-27.md), `OV-01…OV-08`
- registered here: `OV-09…OV-49` (`41` comments)
- transcript jobs pending: `0`
- processed: `0`

## 1. Продуктовая цель

Исходный результат review — не накопить ещё один журнал замечаний. Владелец должен получить проверяемую дизайн-систему и связанные Penpot-схемы, в которых:

1. Astro/UI SoT материализован в нативных Penpot-компонентах и страницах без выдуманных заглушек и page-local lookalikes;
2. варианты, состояния, framing и component lineage наследуются от канонических владельцев;
3. бизнес-схемы логично объясняют аудитории, поверхности, потоки, цели и результаты;
4. после bounded mutation выполняются structural readback и визуальная Astro ↔ Penpot проверка;
5. владелец повторно просматривает исправленную страницу и только после этого пункт может стать обработанным.

Этот continuation закрывает конкретный разрыв предыдущего окна: голосовые были обнаружены, значительная часть уже была распознана, но `OV-09…OV-49` ещё не были надёжно записаны и проложены через GitHub review-route. Регистрация сохраняет требования для следующего продуктового прохода, но сама не исправляет Penpot.

В одной Telegram-сессии смешаны два продуктовых контура:

- `OV-09…OV-19` — семантика бизнес-схем `IdeaHub Map` в Penpot Business; они сохраняются под тем же continuation по прямому указанию владельца, но не увеличивают completion count Astro ↔ Penpot design-system parity;
- `OV-20…OV-49` — конкретные defects и missing states страниц `lovekgd-design-system`, которые должны вести к source-faithful Penpot mutation.

## 2. Source boundary, dedup и transcription readback

- Нумерация продолжает `OV-01…OV-08`; перенумерации нет.
- Устойчивый dedup key каждого голоса: пара `item ref + transcription ref`.
- Для `OV-20…OV-39` использованы уже существующие `transcription ref`.
- Повторные transcription jobs не запускались.
- Все `20/20` существующих jobs `OV-20…OV-39` дали `state: complete`.
- Точная ASR-расшифровка сохраняется дословно, включая ошибки распознавания. Спорные слова не превращаются в продуктовый контракт без визуальной/source-проверки.
- Все пункты остаются `processed: NO`: в этом commit нет Git SoT implementation, Penpot mutation, structural readback, visual evidence или owner acceptance.

## 3. Итог continuation

| Range | Product contour | Registered | Transcript ready | Pending transcript | Status summary | Processed |
|---|---|---:|---:|---:|---|---:|
| `OV-09…OV-19` | Penpot Business / IdeaHub semantic diagrams | 11 | 11 | 0 | 11 `TRIAGED` | 0 |
| `OV-20…OV-39` | lovekgd-design-system / Astro ↔ Penpot parity | 20 | 20 | 0 | 20 `TRIAGED` | 0 |
| `OV-40…OV-49` | lovekgd-design-system / Astro ↔ Penpot parity | 10 | 10 | 0 | 8 `TRIAGED`, 1 needs visual context, 1 context-linked | 0 |
| **Total** |  | **41** | **41** | **0** |  | **0** |

## 4. Cross-contour semantic comments — `OV-09…OV-19`

## OV-09 — курсы по агентским системам для студентов

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `Penpot Business / IdeaHub semantic diagrams` (cross-contour capture; not counted as a lovekgd-design-system parity fix)
- local time: `2026-08-27 08:06:31 Europe/Kaliningrad`
- duration: `44s`
- item ref: `itm_QnHXVDHi580U8zPx2YuJFp_CV7ICQpGs`
- transcription ref: `atr_8EcD4Rk0xuQ7_pHkStO46WPDmKdK3K4MXVAclw0ED4A`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Еще раз сделаю фокус на то, что нужно организовать курсы для студентов по созданию агентов, агентских решений, агентских систем. Для того, чтобы взрастить специалистов и, по сути, были ресурсы, то есть исполнители по бизнес-юниту. Ишить бизнес, то есть переводить бизнес на ИИ-рельсы, внедрять ИИ в бизнес. Я забыл, как вам это правильно назвали, надо посмотреть.

**Нормализованное требование**

В экосистемной схеме показать образовательный контур: курсы для студентов по агентам и агентским системам → выращивание исполнителей → кадровый ресурс для направления внедрения ИИ в бизнес.

---

## OV-10 — репутация и разные бренды в блоке «Зачем»

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `Penpot Business / IdeaHub semantic diagrams` (cross-contour capture; not counted as a lovekgd-design-system parity fix)
- local time: `2026-08-27 08:20:25 Europe/Kaliningrad`
- duration: `77s`
- item ref: `itm_dWl1OWBOmLUmVCHQ27KSuMPXq1XY27yB`
- transcription ref: `atr_Z0JdzZcIxAzK3NujBDDp6hYIA6NVNEPV-t4wAmCrhE8`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Я смотрю на страницу 00 идея хабмэп экосистем overview V5 в пинпод бизнес, обратил внимание, что знания и репутация. Ну тут не совсем понятно, что это за объектом тяну, как направление, но знание, наверное, Ну допустим, но репутация У нас должна быть где-то в пунктах. Зачем обязательно? То есть мы что-то делаем для того, чтобы улучшить репутацию или обрести репутацию репутацией бренда еще нужно разделить.
>
> вложение в личный бренд и вложение в, собственно, в бренд «Полюбить Калининград». Хотя это, наверное, может быть не на этом уровне, может я здесь не прав. Ну, короче, репутация должна быть и в «Зачем?» наверное тоже. Ты подумай, не надо бездумно брать и переделывать. Я тебе просто подсказываю.

**Нормализованное требование**

На `00 · IdeaHub Map · Ecosystem overview v5` осмысленно включить репутацию в «Зачем» и проверить необходимость разделения личного бренда и бренда «Полюбить Калининград». Не переносить механически — сначала проверить уровень абстракции.

---

## OV-11 — не смешивать SEO, GEO и медиа

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `Penpot Business / IdeaHub semantic diagrams` (cross-contour capture; not counted as a lovekgd-design-system parity fix)
- local time: `2026-08-27 08:21:10 Europe/Kaliningrad`
- duration: `30s`
- item ref: `itm_VhSLet9m5SdkNAMwxYdqSSFG_GeYOK2H`
- transcription ref: `atr_5ISEmDyOCA9myBFOJpcdvm1ikqy9mJx5snO6R7USl1Q`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> наверное каналы точки входе не стоит смешивать seo и гео то есть поиск и органический в интернете и поиск через нейросети и медиа то есть то что видео и иные поверхности я бы это разносил все-таки как как отдельные, реально отдельные поверхности. Уж слишком они не сходятся друг с другом.

**Нормализованное требование**

Разнести как самостоятельные каналы/поверхности:

1. SEO и органический веб-поиск;
2. GEO / поиск и индексирование через нейросети;
3. медиа — видео и иные медиаповерхности.

---

## OV-12 — связь привлечения гостей с поверхностями

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `Penpot Business / IdeaHub semantic diagrams` (cross-contour capture; not counted as a lovekgd-design-system parity fix)
- local time: `2026-08-27 08:23:55 Europe/Kaliningrad`
- duration: `105s`
- item ref: `itm_Mc7fBJW9g6uwskek7SYudJZhECz-l6ec`
- transcription ref: `atr_DJIaaGzBK_zO0TWnwXn-8X2O52FDq58i0xpyraSWTSw`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> смотрю что есть и сквозь он играл но как минимум но привлечение у тебя никак не влияет на гостей в твоих схеме хотя я подразумеваю что один из курижин искусишь подразумевает именно привлечение потенциальных гостей в социальные каналы и инструменты и сайты ну то есть в поверхности по сути которые приведут их в итоге они возможно ими попользуются они возможно приедут в регион они возможно в
>
> том числе получат сформулируют положительный образ калининградской области у себя частично кстати среди поверхностей нету сайта вообще хотя сайты у нас есть допустим я не рэп планируется и разрабатываются. KoenigEvents.ru он же сайт анонсов. Статический сайт анонсов. Блог-платформа и платформа микроисторий. Это тоже в том числе сайты и уже проникновение дальше в видео и в социальные сети. То есть такого разреза я не вижу. Если ты уж говоришь про каналы, то... Хотя, наверное, сайты у тебя здесь убраны в вебе. Ладно, хорошо, здесь не важно.

**Нормализованное требование**

В схеме явно показать причинную цепочку:

`привлечение потенциальных гостей → социальные каналы / инструменты / сайты → использование поверхностей → возможная поездка → формирование положительного образа региона`.

Проверить наличие и корректное объединение веб-поверхностей: `KoenigEvents.ru`, статический сайт анонсов, блог-платформа, платформа микроисторий; далее — видео и социальные сети.

---

## OV-13 — расширить блок «Зачем»

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `Penpot Business / IdeaHub semantic diagrams` (cross-contour capture; not counted as a lovekgd-design-system parity fix)
- local time: `2026-08-27 08:24:37 Europe/Kaliningrad`
- duration: `12s`
- item ref: `itm_KO8vZ0PK3D1r8s0mYA-B8RuqsZVJ1hsF`
- transcription ref: `atr_5aVP6IEM5nsCtBS7zS4njH1sr9fj6wzrfHLxKDBhCpA`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Но пункт "Зачем" совершенно точно должен быть шире рассмотрен и разные решения к разному приводят. Хотя, может быть, на более точных схемах ты точнее изобразил.

**Нормализованное требование**

Расширить «Зачем» и показать, что разные решения дают разные результаты; проверить, не раскрыто ли это уже на схемах более низкого уровня.

---

## OV-14 — нелогичный поток на Regional value & content loop

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `Penpot Business / IdeaHub semantic diagrams` (cross-contour capture; not counted as a lovekgd-design-system parity fix)
- local time: `2026-08-27 08:27:20 Europe/Kaliningrad`
- duration: `49s`
- item ref: `itm_wM1c2ag-1cK7-m-Rx4tl5IXivU8zbS8u`
- transcription ref: `atr_JTMeTt_iOH3znX-VLqvHUk-wuhWtYVtxcdFIYKlauFM`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> я смотрю на страницу а идея 11 а ехал map риджа новую концепт loop v5 я вижу что аудитории jobs гости и туристы соединены задает потребности переход в канонический поток источники редакционная платформа ты день в истории книга векса плюс партера дэйк я не уверен что речь в данном случае про источники может я не совсем понимаю что это за схема схема ценности но почему это источники почему дальше проверка источники права почему дальше микро истории

**Нормализованное требование**

На `11 · IdeaHub Map · Regional value & content loop v5` перепроверить семантику блоков и стрелок: аудитории/гости/туристы → потребности → канонический поток → «источники» → редакционная платформа/проекты. Сейчас слово «источники» и дальнейшие переходы не объясняют логику схемы.

---

## OV-15 — редакционная платформа и KoenigEvents являются поверхностями

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `Penpot Business / IdeaHub semantic diagrams` (cross-contour capture; not counted as a lovekgd-design-system parity fix)
- local time: `2026-08-27 08:28:10 Europe/Kaliningrad`
- duration: `39s`
- item ref: `itm_aWdBWsSu37HKuLnpi4ddgjeiQZPoyNT5`
- transcription ref: `atr_c8DzCbpi8NvVprPh6OYwVCWTNpUoSuEsay9OxWQiTTs`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Просто редакционная платформа и Кенниг Ивентс это уже поверхности, это уже конкретные сервисы. Вот, это конкретные четкие сервисы, с которыми касается потенциальный турист, гость-турист. То есть он их просматривает и что-то может делать дальше. Может быть стрелка должна не к источнику, то что ты указал, прицепляться, а к этому блоку канонического потока.

**Нормализованное требование**

Классифицировать редакционную платформу и `KoenigEvents` как пользовательские поверхности/сервисы, а не источники. Перепривязать стрелку к каноническому потоку или другому семантически верному узлу.

---

## OV-16 — вероятно неверная привязка стрелки

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `Penpot Business / IdeaHub semantic diagrams` (cross-contour capture; not counted as a lovekgd-design-system parity fix)
- local time: `2026-08-27 08:28:22 Europe/Kaliningrad`
- duration: `8s`
- item ref: `itm_sfkExR8l7JoKohYTqj93-Gv6HAbiv9ho`
- transcription ref: `atr_qQ8_FR0K8NzIi31kYxYfM4YhcDFvHeTPb0vewxoS5Vk`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Наверное, прицеплено просто неверно. То есть речь идет не про конкретный поток, а в целом про вот это укропленное видение. Но я не знаю, не совсем пока понимаю.

**Нормализованное требование**

Проверить, не должна ли связь относиться ко всему верхнеуровневому видению вместо конкретного потока. Не исправлять без проверки смысла соседних элементов.

---

## OV-17 — критерий логичности схемы

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `Penpot Business / IdeaHub semantic diagrams` (cross-contour capture; not counted as a lovekgd-design-system parity fix)
- local time: `2026-08-27 08:29:21 Europe/Kaliningrad`
- duration: `33s`
- item ref: `itm_ZeXGbOLnovovJqSpJegm8INSuyCqviKV`
- transcription ref: `atr_slPiQXPHAAQd8qjl_kF1TzIGsYViRH1gQctglKs9UQE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Я понял. Значит, ключевое, как я проверяю схему. Схема должна быть для меня логичной. То есть, если что-то из одного следует что-то другое, оно должно идеально описываться логикой. Если я говорю про аудиторию гостя, то почему связь с этим этим это логично? Если ответ, что это логично, я не могу найти, то я не могу понять схему.

**Нормализованное требование**

Каждая связь должна иметь короткое логическое объяснение. Если невозможно ответить, почему конкретная аудитория связана с узлом и что из этого следует, связь или уровень абстракции нужно переработать.

---

## OV-18 — цели и результаты должны быть явными

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `Penpot Business / IdeaHub semantic diagrams` (cross-contour capture; not counted as a lovekgd-design-system parity fix)
- local time: `2026-08-27 08:30:17 Europe/Kaliningrad`
- duration: `41s`
- item ref: `itm_yS265UZk_-do2mrJjzUrlUEQy--m8A9a`
- transcription ref: `atr_W_o9zRYXjOSA8SrsxkxhvrAXEfSLzOoNXMZ_IsLvbmk`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Смотрим эту же страницу, цели и результаты. Ну, допустим, ты пишешь о удержании аудитории. Если мы говорим вообще... Ну, допустим, привлечение аудитории, да. А вот зонтичный бренд полюбить Калининград, непонятная формулировка. Если ты пишешь узнаваемость зонтичного бренда, окей. Ну то есть это развитие, узнаваемость или еще что-либо. Ну то есть не бросай просто пункт и все. Потому что непонятно, что имеется в виду. Если цель и результат. Цель и результат должен быть более понятным.

**Нормализованное требование**

В блоках «Цели и результаты» использовать формулировки результата или действия: «привлечение аудитории», «удержание аудитории», «рост узнаваемости зонтичного бренда», «развитие бренда». Не оставлять голые названия сущностей вроде «зонтичный бренд».

---

## OV-19 — корректная роль Region Talk

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `Penpot Business / IdeaHub semantic diagrams` (cross-contour capture; not counted as a lovekgd-design-system parity fix)
- local time: `2026-08-27 08:32:12 Europe/Kaliningrad`
- duration: `85s`
- item ref: `itm_oH6x9HHrDC4akuhf9MkxMQnU0Bi9M28W`
- transcription ref: `atr_V-5e6INmUrNAhpN4YXPaqgRYe38kfBAYTVXTT8EK6JI`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Регион ТОК это вообще немножко отдельная тема, потому что Регион ТОК это конвейер, который находит, что же пишут гости, ну то есть блогеры, микроблогеры, инфлюенсеры, которые приезжают в регион Калининградской области из других регионов России или вообще не из России. То есть совершенно точно доказано, что это не местные источники, не местная платформа для публикации, не местный канал и не местный автор, тот кто написал.
>
> Э-э, поэтому это не может быть форматом обратной связи, хотя нет. Может, конечно же, может, ты здесь прав? Я здесь немножко не прав, конечно, легенд rigin Talk это в том числе формат обратной связи в целом по региону. Но вообще это формат привлечения, в том числе аудитории удержания внимания аудитории, то интересен местным для того, чтобы отвечать на вопросы. А что же думают о регионе? Что же говорят, и в принципе видеть что-то новое о регионе. вот

**Нормализованное требование**

`Region Talk` — конвейер обнаружения мнений внешних гостей, блогеров, микроблогеров и инфлюенсеров. Это не мониторинг местных источников. Показать две функции:

1. внешний сигнал обратной связи о регионе;
2. привлечение и удержание внимания аудитории, включая интерес местных к внешнему взгляду.

## 5. Design-system comments transcribed from existing jobs — `OV-20…OV-39`

## OV-20 — `64.03 · Floating Action Island`: конфликт CTA-вариантов, выравнивание и обрезанный счётчик

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 08:55:35 Europe/Kaliningrad`
- duration: `108s`
- item ref: `itm_rntG3ammumfBUuQxQ8uuuJV9GBLGtUJF`
- transcription ref: `atr_T5mBO4veGHswkrUAACjjsG705p75j1V-X0p_U3_d-lM`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> продолжаю review я смотрю на страницу 64.03 undefined v1 float in action island значит здесь есть необработанные комментарии ну во-первых почему-то два разных вид это cta блоки я их в принципе назвал CTA блоки, блоки целевых действий. Я вижу разные версии, в чем-то начинается Wave 1 и Undefined Wave 1, вот, которая Undefined Wave 1, Floating Action Island, более правильный.
>
> тот, который в Wave 1, Flow 1, Action Island, Desktop, Base, Light, Region неверно выглядит. Там абсолютно неверно выглядит кнопка в календарь и остальное. Скорее всего, от него нужно в принципе отказаться. Визуально более правильно выглядит, который Undefined V1, И то в нем есть, очевидно, какие-то ошибки. Например, ошибка, связанная с выравниванием. Скорее всего, тот, который правее него. Тоже Undefined V1, Wave 1, Floating Action Island, Action Is. Ну, не важно чего. Короче, внизу вторая строчка, где добавить в календарь, поделиться и кнопка с лайками, там должно быть все выравнивание по левому краю. Дальше. Проблема с кнопкой лайков. Здесь количество лайков обрезается, потому что кнопка имеет фиксированную ширину. Так не должно быть.

**Нормализованное требование**

На `64.03` провести source/readback-сверку двух CTA/Floating Action Island вариантов и оставить один канонический контракт. Ошибочный `Wave 1 / Desktop / Base / Light / Region` не считать допустимой альтернативой. Во второй строке выровнять действия по левому краю; likes-control сделать content-responsive, без обрезания счётчика.

---

## OV-21 — кнопка лайков должна вмещать счётчик

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 08:55:48 Europe/Kaliningrad`
- duration: `15s`
- item ref: `itm_3-aHMaMmjpnzaHLOA1aq1cerOIAT-gkl`
- transcription ref: `atr_KE7KmNFsw8nxN69-hKHYb8DBAnmpsPKgKrDIZym2IJk`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Кнопка лайков должна быть шире.

**Нормализованное требование**

Не задавать likes-control фиксированной шириной, которая обрезает число. Кнопка должна расширяться под фактический счётчик в пределах правил компонента.

---

## OV-22 — адаптивные подписи CTA и корректный calendar-control

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 08:56:56 Europe/Kaliningrad`
- duration: `65s`
- item ref: `itm_dhb0nj-8eBtWjZNjrxQlG7zJ0ARudwTL`
- transcription ref: `atr_jhX_bdNGn5gHf7sEQxuBcqwolVK3Lz7avKRwi8bWkS8`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> И вообще в этом блоке заложено динамическое и даже случайное изменение того, что показывается. То есть определяется максимальная ширина блока. Далее определяется, что мы показываем. Потому что надпись может быть и у кнопки с иконкой в календарь, и у поделиться. Она может быть даже случайным образом в каком-то случае показана. Поделиться большая с надписью. В каком-то случае с надписью показана в календарь, а поделиться показана без надписи. Скорее всего, ты, самый левый блок, который я забраковал изначально в Wave 1, сделал...
>
> логически правильно просто у тебя ошибка в том что блок кнопку в календарь в сети и блоки кастомная она должна выглядеть вот такая серенькая и ее нужно проработать

**Нормализованное требование**

Формализовать state/variant matrix Floating Action Island: максимальная ширина блока; варианты, где подпись показана у «В календарь» либо у «Поделиться»; икон-only состояния; корректный серый custom-control календаря. Случайность не должна подменять явные правила вариантов и проверяемый layout.

---

## OV-23 — `64.01 · Search + navigation`: нижняя мобильная навигация как Floating Island

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 08:58:50 Europe/Kaliningrad`
- duration: `66s`
- item ref: `itm_fWq2Fz4-MUfSaT7mzoMrYPmZfnVTSTOD`
- transcription ref: `atr_FZQw05I448jof_Gu9iockz1WFV2ULgDSx-C47BiPtO4`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> я смотрю на страницу 64.01 undefined v1 search + navigation в ней я вижу search navigation то есть я вижу нижний мобильный блок v1 search navigation mobile undefined v1 wave navigation mobile и вот этот вот блок нижний нужно будет переработать в формат floating island но то есть сейчас это приплюснутая к нижней часть блок во всю ширину его нужно будет переработать в формат тоже по
>
> почти что прижатый к нижней части, но уже имеющий отступы. И это как единый блок, но справа слева он уже тоже будет иметь закругление. То есть видно, что это плавающий остров в нижней части экрана. А сайт может внизу обтекать и быть частично виден сбоку, справа слева от него и снизу.

**Нормализованное требование**

На `64.01` переработать нижний мобильный navigation-block в Floating Island: почти у нижней границы, но с отступами; скругление со всех сторон; не на всю ширину; контент страницы должен оставаться видимым справа, слева и ниже острова.

---

## OV-24 — desktop-вариант навигационной Floating Island требует анализа

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 08:59:17 Europe/Kaliningrad`
- duration: `22s`
- item ref: `itm_TQgBxavGHAcElXwz7j7ViZY3Ojq7TJoL`
- transcription ref: `atr_wARRGL0ESxxeFKQwtMZD3hloTuPXMs98eKFn-NMskw8`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Ответа на этот вопрос нет еще, но я предполагаю, что навигационный пункт, который мы как Floating Island собираемся превратить, наверное, нужно поместить и на Desktop. Но это требует небольшого отдельного анализа.

**Нормализованное требование**

До mutation отдельно проверить, нужен ли тот же navigation Floating Island на desktop и как он соотносится с desktop header/navigation. Не переносить мобильный паттерн механически.

---

## OV-25 — `40.3A · Popular mobile fixtures`: перекрывающий серый блок и неканонический Rail

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:00:08 Europe/Kaliningrad`
- duration: `40s`
- item ref: `itm_BJiZK7oTGxuowvPNcM_FZKn8D8Y0HRj-`
- transcription ref: `atr_1irnS80fsbyBVCzNBdzL4-eQ9kkD3gNDG4mH_M7D2y8`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Я смотрю на страницу 40.3a, Populo Mobile Fixtures, Current V1. На ней какой-то серый блок, делящийся на две части, закрывает часть полезной информации. Ну и ключевое, по-моему, я уже по нему говорил, это компонент Rails. он должен был вести на карт, канонично, на исходный компонент. Вот эта карточка событий, горизонтальная, длинная, мобильная. А здесь, скорее всего, нет.

**Нормализованное требование**

На `40.3A` убрать или исправить серый двухчастный блок, перекрывающий полезный контент. Длинная горизонтальная mobile event card должна быть экземпляром канонического Rail, а не локальным lookalike.

---

## OV-26 — `40.3A`: readback ведёт на локальный, а не канонический Rail

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:00:39 Europe/Kaliningrad`
- duration: `17s`
- item ref: `itm_UXQLk8Lll9NBzG0QsWK9UGnqN5QxZS8K`
- transcription ref: `atr_qNrGM2dH4P1fXM1mwWqiD0EUr7fg9g1NNkMTiL5S-yg`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Да, я перепроверил, я нажал на перейти на основной компонент, и он меня просто перевел на первый же компонент на этой же странице. Что неверно, этот компонент должен быть переиспользован из rail компонента, который у нас где-то на ранних страницах был отработан.

**Нормализованное требование**

Исправить component lineage: действие «перейти к основному компоненту» не должно вести на первый локальный компонент той же страницы. Экземпляры `40.3A` должны ссылаться на канонический Rail-owner.

---

## OV-27 — канонический владелец Rail — `40.3 · Mobile Rail / Full Track Rows`

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:01:49 Europe/Kaliningrad`
- duration: `27s`
- item ref: `itm_5U4ayu0J54SMxvUrSlcGvENZajyricDB`
- transcription ref: `atr_VsVLdSfGQoXGCuZ68ZbynI5Xb_Lndve9Ar1MsTpO9qY`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> А, нашел. Он должен был вести в итоге на какой-то из компонентов, оформленных на 40.3, Mobile Rail, Full Track Rows. Ну, только так как в этом компоненте другой вариант отображения времени и дат, то есть он должен был быть тоже добавлен в 40.3 и далее оттуда был уже наследован быть.

**Нормализованное требование**

Канонический источник Rail находится на `40.3 · Mobile Rail / Full Track Rows`. Добавить недостающий вариант времени/периода в этот owning component и только затем наследовать его в `40.3A`.

---

## OV-28 — `30.1d`: сомнительные белые фоны у прозрачных объектов

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:03:07 Europe/Kaliningrad`
- duration: `52s`
- item ref: `itm_cMckJMQIp-OYi-TXtqiijOkQhpqspc7q`
- transcription ref: `atr_52JpPjTODEGFimTcUleMI246DaTDD83cmd8F_3-5SVs`
- transcription state: `COMPLETE`
- transcript quality: `ASR_DEGRADED`; exact text preserved, disputed words require visual context
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> я смотрю на страницу 30.1 д попила сошел про фиксируя скорость вилан в самом замечании нет удивлен что они сделаны на фоне то есть там белый фон квадратный не странно мне кажется фон наверно у какого-то объекта уже сдается то что я еще понимаю объект с фоном где закругление есть на дозе то видимость мы ставить на объект а если без закруглений то скорее всего фона конкретного вряд ли должен быть выставлено на прозрачный значит если ты показываешь прозрачные объекты то ты им должен был общую подложку сделать то есть я подозреваю что здесь ошибка в

**Нормализованное требование**

Проверить `30.1d` визуально и структурно. Для объектов без собственного скруглённого контейнера не навязывать белый квадратный фон; прозрачные assets показывать на общей демонстрационной подложке. Из-за искажённой ASR-расшифровки точный target и исключения подтвердить по page context перед mutation.

---

## OV-29 — `30.1d`: share/like controls не ведут к исходным компонентам

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:03:36 Europe/Kaliningrad`
- duration: `27s`
- item ref: `itm_cd_8HpRKN01zZnlIBcOkuT9FxPXBaZnq`
- transcription ref: `atr_EvNQCpSxeRGH-VRLNeepxFfgT7RZiPjAa5pomLHNZGA`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> А еще я попробовал нажать на этом же, на 30.1d, на любой объект, чтобы перейти к исходному компоненту. И его там не было. То есть я на самый первый нажал, и это же иконка поделиться и счетчик. Он у нас есть, как и лайки со счетчиками. Она должна все выходить к исходным компонентам, а здесь не исходный.

**Нормализованное требование**

На `30.1d` share-icon/counter и like-counter должны быть экземплярами ранее заведённых исходных компонентов и позволять перейти к ним; локальные независимые roots недопустимы.

---

## OV-30 — дублирование вместо наследования компонентов

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:04:11 Europe/Kaliningrad`
- duration: `27s`
- item ref: `itm_Gq0KbzT5jjf0Q0VbOKTu2_5NJecq417c`
- transcription ref: `atr_NbnsTONS9wqujlR00jRkUwpe4INXrz0gmaVHHYVr8Jo`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Ну то есть, по сути, здесь произошло дублирование одинаковых компонентов. А дизайн-система должна быть построена по принципу наследования. Иначе, вот именно от этого мы и должны были избавиться. От множества одинаково сделанных в разных местах, по разному видов инструментов.

**Нормализованное требование**

Устранить дубли одинаковых компонентов. Дизайн-система должна наследовать варианты от одного канонического владельца, а не повторять визуально похожие инструменты с разными корнями на разных страницах.

---

## OV-31 — `40.2A · Populo Corpus Media`: грубое нарушение framing

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:07:00 Europe/Kaliningrad`
- duration: `53s`
- item ref: `itm_j6hl75IeldQT3PCw-gy0fsVA70o9Ir8x`
- transcription ref: `atr_mKuG-YB8VFRrrbyI58Z-cTD0WQL1hJ7m5c0qlpa-RB0`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> я смотрю странице 40.2 а попила корпус медиа карен фриван и как раз здесь закралась та самая ошибка по фреймингу то есть у тебя именно на этой странице появились изображения в блоках с полями поли поля это грубейшие нарушение у нас у нас есть правила фрейминга не общие поэтому тебе нужно здесь это все исправить и наверное все таки должен быть общий абсолютно общий набор изображений вообще на одной странице сведенных на этой на этой странице должен быть перепроверен весь набор фрейминга и далее уже переиспользован конечно же

**Нормализованное требование**

На `40.2A · Populo Corpus Media` устранить поля/letterbox и применить общий framing-contract. Свести полный набор framing-состояний в одном owner-readable canonical specimen и переиспользовать его, а не создавать page-local media variants.

---

## OV-32 — share-компоненты заведены на странице-потребителе вместо канонического владельца

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:07:25 Europe/Kaliningrad`
- duration: `21s`
- item ref: `itm_4NlrblZLYmVZB7FoY3PeSVFJqcNlXoyF`
- transcription ref: `atr_sBlLbNchrTdK5itylxTjK8QwWF74pStU9ocXEFLTOFY`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> А, ну и как раз вижу, что ты здесь вот эти вот иконки поделиться, компоненты ввел нас на 30.1d, хотя должен был ввести на исходный, где он был проработан, на более раннюю страницу. Вот здесь ошибка как раз.

**Нормализованное требование**

Share-controls не должны впервые владеться страницей `30.1d`, если их канонический компонент уже проработан ранее. Перепривязать instances к lowest owning component/page и убрать локальный root.

---

## OV-33 — `40.2A`: header и city shelf как Floating Islands

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:10:29 Europe/Kaliningrad`
- duration: `120s`
- item ref: `itm_TZVeUqNEohJ3_Ds5OSRXz4PMCcAEdR9-`
- transcription ref: `atr_oTeFyKjom9iPpIXQGT09eqhWHoQPVCempvNQUuOLHsw`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Продолжаю смотреть на 40.2a Populo корпус медиа Current V1 и внизу вижу Shell V1, Desktop State, Current Populo и Listing Discovery Rail, State Cities равно Populo Current V1, ну то есть шапку и полку. Значит, наверное, шапку и полки мы будем перерабатывать тоже во Floating Islands. надо подумать как это правильно сделать скорее всего пример как в интерфейсе телеграма ну то есть точно также есть верхний уровень то есть по сути у нас слева у нас
>
> Бирка полюбить, Калининград анонсы с логотипом, потом у нас не заполнено все это Верхнее пространство, но есть верхний флоттинг-айленд, в котором у нас Ключевая навигация идет, Причем он, может быть, даже не общим потенциально может делиться, к примеру, если мы туда будем добавлять поиск поиск, может быть просто отдельным флоте на той же самой строчке. Ну и принцип выделения. Я попозже отдельную картинку приложу, можно пока грубо это начать переделывать. дальше соответственно
>
> Когда у нас идет полка, ну в данном случае полка вот с выбором. Все, Калининград, Светлогорск, Гурьевск, поселок Романово. И Романово почему-то продублировано. Значит, это вот полка, соответственно, тоже новый floating island, который на уровень ниже встает. То есть примерно туда же, где и сейчас, но опять-таки занимает не всю ширину, а только строго тот размер, который он реально занимает. То есть справа и слева у него будет пусто. Естественно, у него будут скругления и так далее.

**Нормализованное требование**

Проверить и материализовать header и city shelf как Floating Islands: слева остаётся brand tag; основная навигация — отдельный content-sized верхний остров; поиск при необходимости — самостоятельный соседний остров. City shelf располагается уровнем ниже, занимает только нужную ширину, имеет внешние отступы и скругления. Удалить дублированный «Романово». Окончательную геометрию подтвердить отдельным визуальным reference/readback.

---

## OV-34 — `63.16 · Partners`: восстановить фактическую Astro-страницу

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:12:23 Europe/Kaliningrad`
- duration: `60s`
- item ref: `itm_dC0PDDle51J6FaOL9ZQ7yqIgRdl_G8sm`
- transcription ref: `atr_Q65nPixyzPOm4F_w_uBrvPQzlHwpYQgoHgOtV4bZDRc`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Я смотрю страницу 63.16, страница партнеров. Значит, функцию или текст про стать партнером мы не пишем. Точнее, вот так, прям целую страницу не оформляем. Но оформляем вот этот блок «Партнеры полюбить Калининград анонсы». Точнее, полюбить калининградцев анонсы является информационным партнером. Вот такая формулировка правильная. Дальше. Фестиваль 80. История о главном. Российское общество знания. Октопус. РЖД. ИЦАЯ. И эта страница в Astra уже проработана. У тебя сейчас неправильно здесь отображено. У тебя здесь ошибки. А вот остальное, типа стать партнером и тому подобное, все это нужно убрать. Про то, как стать партнером, можно просто указать маленькую строчку про email. написать, допустим, на info.sobako-canic-events.ru И все.

**Нормализованное требование**

На `63.16` восстановить фактическую Astro-страницу партнёров. Не проектировать отдельную воронку/страницу «Стать партнёром». Показать корректный информационно-партнёрский блок и точный список из Astro; для контакта достаточно короткой строки с email. ASR-названия и адрес не считать authoritative без сверки с Astro.

---

## OV-35 — `63.14 · Atlas Focus Group`: неверная декодировка, отсутствует OTP

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:13:24 Europe/Kaliningrad`
- duration: `27s`
- item ref: `itm_7rQrizexply2bDJvsNSNKrVyrxQitymS`
- transcription ref: `atr_CqFmsZPI5dpRpkB5E-mXRCEsoqDVYjtMZKIhoa8eses`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Я смотрю страницу 63.14 Atlas Focus Group. Похоже, она некорректно декодирована с Astra. Перепроверь и декодируй корректно. Она у нас есть, она у нас отработана. На той странице есть OTP. И OTP у нас даже уже через автотестирование проверено. Здесь этого ничего нет. Скорее всего ошибка.

**Нормализованное требование**

Заново сверить `63.14 · Atlas Focus Group` с работающим Astro и корректно материализовать страницу, включая OTP-flow/state, уже покрытый автотестами. Не принимать нынешнее пустое/неполное декодирование.

---

## OV-36 — `63.13 · Atlas Personal Feed`: недопустимо пустое представление

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:14:25 Europe/Kaliningrad`
- duration: `53s`
- item ref: `itm_hdSbNdQRYlLmrstbu4liRF_t7dMkLjBL`
- transcription ref: `atr_6cnXl8pKi-IpTVSsbuO0x_hQWgJikCKVEv8W7zg-EsE`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Я смотрю страницу 63.13 Atlas Personal Feed и она вообще ничего не содержит. Это персональная лента. Первое, она не может быть априори пустая. Она всегда лента. Просто она либо уже хорошо настроена, либо еще недонастроена. Вопрос авторизации через Яндекс? Окей, да. Вообще авторизации в более широком смысле слова, потому что у нас авторизация через email и авторизация через Яндекс. Два вида авторизации на выбор. Сама персонализация работает без дополнительного подтверждения. Это заложено в пользовательское соглашение.

**Нормализованное требование**

На `63.13 · Atlas Personal Feed` показать непустую персональную ленту и её реальные состояния: ещё недонастроенная и уже настроенная. Отразить два способа авторизации — email и Yandex; не добавлять отдельное подтверждение персонализации, если runtime/пользовательское соглашение его не требуют.

---

## OV-37 — `63.13 · Atlas Personal Feed`: крупные карточки desktop/mobile

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:14:42 Europe/Kaliningrad`
- duration: `14s`
- item ref: `itm_7KaJ7mbk5Vt24AKgb8YhrHQV9ZjklFnq`
- transcription ref: `atr_Y6T5lT98ze62qPZ9BpFJjkgLSFbVRqGNfvVLrZjvtIY`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Ну то есть страница требует переработки. Очевидно, что здесь ожидались большие карточки событий. На этой десктопе, видимо, по три в ряд в мобильном, собственно, колонке.

**Нормализованное требование**

В связке с `OV-36` материализовать крупные event cards: ориентир — три карточки в ряд на desktop и одна колонка на mobile; точные responsive rules сверить с Astro/UI SoT.

---

## OV-38 — `63.12`: отсутствует заполненное состояние

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:15:03 Europe/Kaliningrad`
- duration: `7s`
- item ref: `itm_t9cqQrrYZQmBQ0vBnERPRfEJI4jR3qnt`
- transcription ref: `atr_YQZUbdMIc_vWvbuG3vdpedpjer6SscaAx3wTvU-lFxA`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Я смотрю страницу 63.12 и на ней отсутствует вариант заполнения.

**Нормализованное требование**

На `63.12` добавить реальное populated-state представление; пустая страница не доказывает контракт поверхности.

---

## OV-39 — `63.12`: состояния избранного, календаря и лайков

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:15:45 Europe/Kaliningrad`
- duration: `36s`
- item ref: `itm_AW7do1bf2sYS08fgPg7Lmfk0iETPONKj`
- transcription ref: `atr_CDpJBkGRMb3pT4d-FuqtoorzOpoeayLGwdCn8Tk5vA0`
- transcription state: `COMPLETE`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> ну то есть я хотел бы увидеть как выглядит эта страница если на ней три и более событий в избранном причем у нас же есть избран есть календарь есть лайки хочу напомнить избранная это первая календарь сначала идет то есть то что мы добавили куда на куда мы там зарегистрировались так далее дайте куда мы в будущем зарегистрируемся тоже а далее идут на то что мы от лайкали но это не точно на проверить через документацию но

**Нормализованное требование**

На `63.12` показать состояние с минимум тремя событиями и различимые представления избранного/календаря/лайков. Семантику и порядок «зарегистрировано / будущие планы / понравилось» сначала сверить с документацией и Astro; неточную формулировку transcript не превращать в новый контракт без проверки.

## 6. Page-specific design-system comments — `OV-40…OV-49`

## OV-40 — `63.11 · Clubs by interest`: отсутствуют реальные клубы

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:16:19 Europe/Kaliningrad`
- duration: `25s`
- item ref: `itm_liUUolEmKagzar5KzEQmjR9u1Om3sdqt`
- transcription ref: `atr_YAtS_sLPAQ1s6Bw_bHAcmg91pJ2JmArgC3SaoaFrpJ4`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Я смотрю на страницу 63.11, клубы по интересам, и на этой странице нет отображенных фактических клубов. То есть это не проработано. Хотя в Astra это было отработано, и там есть три фактические карточки. И состояние каталог готовится быть в принципе не может. А приори там всегда хоть что-то будет.

**Нормализованное требование**

Материализовать реальные карточки клубов из Astro; убрать недопустимое состояние «каталог готовится», поскольку базовый непустой каталог гарантирован.

---

## OV-41 — `63.09 · Atlas Festivals`: отсутствуют варианты раскладки карточек

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:18:01 Europe/Kaliningrad`
- duration: `39s`
- item ref: `itm_kUZECdpB-ie1ocH15Yw5m5c6mt8YG_cX`
- transcription ref: `atr_QZspXk1pR0pMCLwH5wrZZy8-5VsFa7xHXgElnOj6pYY`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Я посмотрел страницу 63.09 Atlas Festivals и вижу, что там только показано одно событие, хотя здесь несколько вариантов отображения карточек. Есть, вот как показано, широкая карточка, есть узкие карточки. И это зависит от того, сколько, в принципе, места есть в ширину и сколько мы планируем, ну, сколько у нас есть событий. Вот здесь важный архитектурный пропуск. Мы не проработали промежуточное состояние. Сейчас расскажу какое.

**Нормализованное требование**

Показать несколько вариантов раскладки фестивальных карточек: широкая, узкие, комбинации по доступной ширине и числу событий; закрыть промежуточное состояние между одной большой и фиксированной сеткой.

---

## OV-42 — универсальный full-width контейнер карточек

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:19:52 Europe/Kaliningrad`
- duration: `106s`
- item ref: `itm_Zlc63dyKD3P7mPaumGr6Ug-sgZvyVdh7`
- transcription ref: `atr_7WNIpoG7LDsMdOZiM1o5naZ9onik4_G3_8blDiqphPk`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Значит, у нас есть относительно отработанное понятие карточки. У нас есть понятие контейнера для карточки, ну то есть строчка, в которой она может существовать. И мы отрабатывали только большие карточки, их размещение три штуки, и у них там было влияние на высоту. Но есть понятие контейнера, который имеет значение ширину, допустим, занимает 100% своей доступной области. И внутри этого контейнера находится несколько событий, и они уже...
>
> Грубо говоря, делят этот контейнер полностью, обеспечивая заполнение по ширине тоже на 100%. Но на основе определенных правил определить, ну, грубо говоря, какой из них больше, какой из них меньше. Или они там равным образом делятся, или неравным на основе исходных изображений. Так вот, тебе нужно отдельно, возможно даже на отдельной странице, отработать варианты размещения карточек событий в контейнерах с учетом полного заполнения. Ну как минимум на 63.09 должна быть отработка вот таких нескольких внутри контейнера.
>
> У нас такой же принцип должен быть на странице выходных. Такой же принцип на странице даты. Так что это универсальный паттерн иметь контейнер, в которого ширина заполнения полная и нужно ее заполнить.

**Нормализованное требование**

Ввести и визуально доказать универсальный паттерн `Event card container`: контейнер занимает 100% доступной ширины; несколько карточек делят его полностью по детерминированным правилам — поровну или неравномерно с учётом исходных изображений. Применить как минимум к `63.09`, странице выходных и странице даты.

---

## OV-43 — потерян акцент на количестве фестивалей и периоде

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:20:23 Europe/Kaliningrad`
- duration: `16s`
- item ref: `itm_U5qvVoPfwbkbXFAlx4qljBB3bBOMt80C`
- transcription ref: `atr_P2g4KICTHussnmhdokcbbP0gqMI-P3ZYi0pkTzYfE4Q`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Также я смотрю на страницы фестивалей Калининградской области и вижу, где количество фестивалей и период. Там не чисто перенесен акцентный момент.

**Нормализованное требование**

Сверить с Astro и восстановить акцентное представление количества фестивалей и временного периода, а не только текстовое наличие этих данных.

---

## OV-44 — `63.08`: должна быть списочная подборка, а не навигационная заглушка

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:22:03 Europe/Kaliningrad`
- duration: `87s`
- item ref: `itm_GUEDtwzpmkQBNDS298PbLAME9NJ0a4EM`
- transcription ref: `atr__ddGLKxWmoDxalf8Xc4ppt-fz2Vp9gJjtizyciHgB-4`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Я смотрю на страницу 63.08 и здесь я уже комментировал, но это странная страница, такого быть не должно. Может быть она чисто техническая, для AI будет, чтобы видеть какие страницы существуют, но обычно будет переход всегда на конкретную страницу подборки. В конкретной странице подборки всегда есть список событий. Это списочная страница. Скорее всего, там в основном большие карточки. И должно быть показано, что это вот оно. И в качестве Floating Island там используются, как минимум, медальоны. Ну, допустим, на...
>
> на странице подборки бесплатных событий Медальон бесплатно на каких-то других подборках, если к примеру будет подборка по конкретной локации, то там Медальон локации, если будет подборка по фестивалю, не знаю, будет ли она такая точка там будет Медальон фестиваля. И так далее. То есть если будет какая-то другая подборка с более сложным наименованием, то формате float Night который нужно будет проработать должен быть показано, что это, чтобы это было видно никуда не уходило. Но это в любом случае, списочная страница, а не страницы с кнопочками навигации, то здесь большая.

**Нормализованное требование**

`63.08` не должна быть пользовательской страницей с набором навигационных кнопок. Каноническая подборка — это список событий, преимущественно с крупными карточками. Floating Island должен постоянно показывать тип подборки: «Бесплатно», локация, фестиваль или более сложная подпись.

---

## OV-45 — `63.07 · Atlas Event Details`: медальон, overlay и multi-date

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:23:11 Europe/Kaliningrad`
- duration: `57s`
- item ref: `itm__YkPXcs3yplVJKrUpeQ89dJMHdJzTJOk`
- transcription ref: `atr_gV7_6X1Qe_67oYDbt7oj6y6fz6yCnxGQq9PxR6BYfE8`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Я смотрю страницу 63.07 Atlas Event Details. И ключевое, что я не вижу варианта, где есть над блоком события посередине медальона. Ключевого медальона. Дальше я вижу здесь ошибка. Да, похоже, что здесь ошибка. И блок с информацией у тебя не наезжает на картинку. Хотя в реальной реализации на Astra он всегда торчит, то есть на первом экране сразу же видно, как минимум весь заголовок сразу же видно, это отработано. Также должно быть отработано варианты мультиэвента, ну мультидата и тому подобного. То есть где-то должен быть показан компомент, как он все это показывает. Сейчас этого нет.

**Нормализованное требование**

Материализовать:

1. центральный ключевой медальон над блоком события;
2. канонический overlap информационного блока на изображение, чтобы заголовок был виден на первом экране;
3. состояния multi-date / multi-event и соответствующий компонент.

---

## OV-46 — мобильный вариант содержит визуальные ошибки

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:23:28 Europe/Kaliningrad`
- duration: `5s`
- item ref: `itm_adnJp3aRAoHkEtkT7N9O830TlKUr6VN7`
- transcription ref: `atr_BBljbiNfWIWL08eV-y2lMLdb3tZDNIsegezrD0HjXGs`
- status: `CAPTURED_NEEDS_VISUAL_CONTEXT`
- processed: `NO`

**Точная расшифровка**

> Я смотрю мобильный вариант и здесь тоже есть визуальные ошибки.

**Нормализованное требование**

Привязать сообщение к соседнему page context и провести визуальный Astro ↔ Penpot diff мобильного варианта. Без изображения/точки комментария нельзя честно закрыть пункт.

---

## OV-47 — `63.06 · Atoll Search`: нет состояний поиска

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:24:32 Europe/Kaliningrad`
- duration: `15s`
- item ref: `itm_xjgAZp15Yszqa6jRuw_9_7WTUkThj6Iu`
- transcription ref: `atr_Zxhng5o-IHlouLAKNoeutCg_XqvbiCTCUHK1sa167q4`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Я смотрю на страницу 63.06, Atoll Search, и не вижу на этой странице ни скелетонов, ни результатов поиска, ни прогресс-бара. Ну, то есть, как поиск идет.

**Нормализованное требование**

Показать полный state matrix поиска: skeleton/loading, прогресс выполнения, результаты и необходимые пустые/ошибочные состояния.

---

## OV-48 — состояния уже реализованы в Astro

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:24:36 Europe/Kaliningrad`
- duration: `2s`
- item ref: `itm_El-JeD57aClxcyAaaQIud45ekZwdThe-`
- transcription ref: `atr_IFCvkkUUaCa8jDTJIceRtVCgcrElZLq2JJBkP1Kts3A`
- status: `CONTEXT_FOR_OV-47`
- processed: `NO`

**Точная расшифровка**

> Хотя это все отработано в Astra.

**Нормализованное требование**

Не проектировать состояния поиска заново; взять Astro как проверяемый исходный материал и перенести в Penpot с parity evidence.

---

## OV-49 — `63.05 · Atlas Unusual Listing`: отсутствует список

- source: Telegram `KenigEvents · UI review`, topic `https://t.me/c/4337049383/1030`, voice message
- product contour: `lovekgd-design-system / Astro ↔ Penpot parity`
- local time: `2026-08-27 09:24:56 Europe/Kaliningrad`
- duration: `12s`
- item ref: `itm_AR0DbZBHdv9xsQiD3ygslZSKhJZ9cdDL`
- transcription ref: `atr_BsYmC-s0TguH3dASdaTMzfIPOsQqRt9kpV1ax2XHoDQ`
- status: `TRIAGED`
- processed: `NO`

**Точная расшифровка**

> Я смотрю страницу 63.05 Atlas Unusual Listing и на ней отсутствует, собственно, отображение списка. Ну, это же подборка.

**Нормализованное требование**

Материализовать фактический список элементов/событий; страница подборки без списка не является завершённым представлением.

## 7. Processing gate

Continuation считается **зарегистрированным**, когда этот файл:

- содержит `OV-09…OV-49` без дублей и перенумерации;
- виден из [`docs/reviews/index.md`](index.md) под `REV-TG-20260826-01`;
- указан в Draft PR `#53`;
- присутствует в remote branch `fix/penpot-owner-comments-20260826`.

Continuation не считается **обработанным**, пока для каждого actionable item нет:

- точного owning component / Git SoT disposition;
- bounded Penpot mutation;
- canonical component lineage и structural readback;
- focused visual Astro ↔ Penpot evidence;
- статуса как минимум `READY_FOR_OWNER_REREVIEW`;
- явного повторного просмотра владельцем.

Честный статус после этой регистрации: `IN_PROGRESS`. `READY_FOR_OWNER_REVIEW` не заявляется.

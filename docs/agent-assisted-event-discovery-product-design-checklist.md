# LoveKGD — чек-лист продуктовой и дизайн-проработки агентского поиска событий

> **Статус направления:** `accepted_for_product_exploration`; продуктовая гипотеза и bounded prototype разрешены, canonical design-system promotion и production implementation не начаты.  
> **Обновлено:** 26 August 2026.  
> **Product/data plan:** [`events-bot-new#587`](https://github.com/onedayonemasterpiece/events-bot-new/pull/587), включая канонический каталог локаций, координаты, map actions и agent-assisted Search.  
> **Boundary:** этот checklist не разрешает Penpot mutation, production Astro changes, новый provider caller, MCP exposure, component promotion или замену обычной ленты чатом.

## 1. Место направления в системе

Агентский интерфейс рассматривается как **гибридный режим обнаружения событий**, а не как отдельный продукт и не как новая независимая поисковая система.

```text
канонический Event/Location corpus
+ существующий Search/retrieval
+ bounded assistant refinement
→ text + event + chip + location blocks
→ те же trusted Event actions
→ всегда доступная обычная выдача
```

Authority:

```text
product meaning, experiment and data contracts
→ events-bot-new

visual exploration and candidate UI composition
→ LoveKGD UI Exploration / this checklist

component/pattern authority after acceptance
→ lovekgd-design-system

runtime, auth, Search, analytics and production evidence
→ events-bot-new
```

Не создавать второй Search auth, transport, quota ledger, Event index, location database или MCP-specific UI truth.

## 2. Два разных entry gate

Продуктовую гипотезу можно исследовать раньше полного закрытия AS-IS дизайн-системы, но только в изолированном prototype/research lane.

### Gate A — product exploration

Для read-only продуктовой проработки и prototype достаточно:

- [ ] зафиксирован product hypothesis и rescue-first эксперимент;
- [ ] используется реальный bounded Event fixture set;
- [ ] существующая лента остаётся control/fallback;
- [ ] никакой prototype не объявляется canonical component/pattern;
- [ ] нет mutation production Astro или canonical Penpot Resource Graph;
- [ ] факты, ссылки и location actions приходят из typed fixtures, а не из LLM imagination.

### Gate B — design-system execution/promotion

Для native Penpot candidates, canonical component decisions и implementation требуется:

- [ ] целевые Search/listing/EventCard archetypes закрыты в AS-IS baseline;
- [ ] Astro == Git UI SoT == Penpot доказано на одинаковых fixtures/states/viewports;
- [ ] existing component/pattern owners известны;
- [ ] route-local forks и terminal patches классифицированы;
- [ ] Product Atlas Jobs/outcomes/measurement links reviewed;
- [ ] agent UI experiment доказал продуктовую ценность либо владелец отдельно разрешил bounded implementation candidate;
- [ ] owner принял точную scope/version boundary.

**STOP:** product exploration не является разрешением перепрыгнуть AS-IS/parity lifecycle.

## 3. Продуктовая гипотеза и эксперимент

- [ ] Сформулировать основной Job: помочь найти подходящее событие при сложном, неясном или меняющемся намерении.
- [ ] Отделить job «быстро просмотреть афишу» от job «помоги выбрать».
- [ ] Зафиксировать, что chat activity не является product outcome.
- [ ] Сделать rescue-first первым тестом: zero result, explicit `missed`, repeated reformulation или явный «Помочь подобрать».
- [ ] Определить control: текущая обычная Search/EventCard выдача.
- [ ] Определить treatment: короткий ответ + 3–5 карточек + refinement chips + classic-list fallback.
- [ ] Не изменять одновременно conversational mode, card redesign, medallions и social proof.
- [ ] Зафиксировать max turns, model calls, latency и quota budget.
- [ ] Определить deterministic experiment assignment и rollback.
- [ ] Зафиксировать kill conditions для factual/navigation/schema errors.

## 4. Journey и точки входа

Проверить как минимум четыре entry модели:

- [ ] rescue после «Нет, не нашёл»;
- [ ] rescue после нулевой exact выдачи;
- [ ] явная secondary action «Помочь подобрать»;
- [ ] opt-in mode switch `Лента | Помочь подобрать` после доказательства rescue value.

Для каждой точки входа:

- [ ] видна связь с текущим запросом;
- [ ] понятно, что помощник ищет в том же каталоге;
- [ ] classic Search доступен одним действием;
- [ ] query/intent не теряется при переключении;
- [ ] пользователь не попадает в обязательную анкету;
- [ ] auth/quota gating не маскируется под «ИИ думает»;
- [ ] cancel/back/reload behavior определён;
- [ ] deep link / browser history semantics определены;
- [ ] mobile bottom navigation и desktop shell не получают второй конкурирующий Search destination без решения.

## 5. Information architecture

Рекомендуемая иерархия одного ответа:

```text
короткое резюме
→ понятые ограничения
→ лучшая группа событий
→ grounded match reasons
→ location/map block при необходимости
→ suggested refinements
→ показать всю выдачу / продолжить обычным поиском
```

- [ ] Ответ модели ограничен несколькими предложениями.
- [ ] События не прячутся в длинном prose transcript.
- [ ] Card hierarchy остаётся главным decision surface.
- [ ] Внутритекстовая ссылка на событие является typed `event_ref`, а не Markdown URL.
- [ ] Group headings различают exact/best, trade-off и discovery/fallback.
- [ ] Не смешивать exact match и «возможно интересно» без заголовка.
- [ ] Conversation history не должна вытеснять текущие результаты с экрана.
- [ ] Определить collapse/summary для предыдущих turns.
- [ ] Определить clear/reset/start-over action.
- [ ] Определить sharing/deep-link behavior: что именно можно безопасно поделиться.

## 6. Полный state map

Обязательные состояния:

- [ ] initial idle;
- [ ] unauthenticated draft;
- [ ] auth required;
- [ ] interpreting intent;
- [ ] searching/retrieving;
- [ ] assistant composing bounded response;
- [ ] success with exact/best matches;
- [ ] success with explicit trade-offs;
- [ ] clarification with immediate candidates;
- [ ] clarification without safe candidates;
- [ ] zero result;
- [ ] classic Search degraded/vector-only fallback;
- [ ] model unavailable/schema rejected;
- [ ] location unavailable/approximate/conflicting;
- [ ] quota/cooldown;
- [ ] timeout/cancelled;
- [ ] stale catalogue/location revision;
- [ ] repeated refinement;
- [ ] switched back to full listing;
- [ ] terminal explicit `matched` / `missed` feedback.

Для каждого state:

- [ ] one semantic owner;
- [ ] visible user action;
- [ ] screen-reader announcement;
- [ ] retry/idempotency semantics;
- [ ] no false progress percentage;
- [ ] no false success;
- [ ] deterministic fallback;
- [ ] analytics event/summary boundary.

## 7. Кандидатные UI resources

Ниже перечислены semantic resources для исследования. Список не утверждает component identity.

### Conversation/layout

- [ ] assistant surface/container;
- [ ] bounded turn group;
- [ ] user intent message;
- [ ] assistant summary/message;
- [ ] previous-turn compact summary;
- [ ] composer/input + submit/cancel;
- [ ] mode switch or classic-list return action.

### Event results

- [ ] typed `event_ref` inside prose;
- [ ] canonical full EventCard reuse candidate;
- [ ] compact agent-result EventCard variant candidate;
- [ ] event group/section;
- [ ] grounded match-reason row;
- [ ] trade-off label;
- [ ] exact/fallback distinction;
- [ ] downstream save/calendar/share/ticket/navigation actions.

### Refinement

- [ ] interpreted-constraint chip;
- [ ] suggested reply/refinement chip;
- [ ] removable/excluded constraint;
- [ ] «показать более необычное» / «только бесплатно» typed patch;
- [ ] free-text refinement;
- [ ] clear one constraint / reset all.

### Location

- [ ] location reference;
- [ ] address block;
- [ ] geo confidence/approximation state;
- [ ] map action group;
- [ ] entrance/meeting-point note;
- [ ] optional map preview candidate;
- [ ] explicit «где это?» follow-up action.

### Trust/status

- [ ] source/freshness indicator only where useful;
- [ ] degraded/fallback explanation;
- [ ] uncertainty warning;
- [ ] quota/auth/error recovery;
- [ ] explicit human-feedback action.

## 8. Reuse и component boundary

Для каждого UI resource:

```text
existing component
| existing variant/state
| configured composition
| new pattern
| new component
| runtime-only behavior
| unresolved
```

- [ ] Сначала сопоставить с существующими Button, Chip, EventCard, Status, Skeleton, Input, Section и Link families.
- [ ] Не создавать universal `AI message/card/chip` namespace только из-за модели.
- [ ] Не копировать EventCard markup в conversation renderer.
- [ ] Compact card создаётся только при доказанной отдельной anatomy/consumer need.
- [ ] Match reason не дублирует event facts/metadata без пользы.
- [ ] Suggested reply и filter chip различаются по action semantics.
- [ ] `event_ref` не притворяется обычной внешней ссылкой.
- [ ] Map action использует trusted navigation action contract.
- [ ] Runtime orchestration не становится component responsibility.
- [ ] Similar visual radius не доказывает общую component identity.
- [ ] Все new candidates получают stable candidate IDs только после dossier review.

## 9. Location, coordinates и map actions

Product/data source: `events-bot-new/docs/features/location-directory/README.md` in Draft PR #587.

- [ ] Location UI использует `location_id`, canonical name и typed address.
- [ ] Coordinates никогда не читаются из prose model output.
- [ ] `verified`, `approximate`, `conflicting`, `needs_review` визуально и текстово различимы.
- [ ] Map links строятся trusted resolver, а не LLM.
- [ ] Provider actions имеют понятные labels (`Открыть в Яндекс Картах`, `Открыть в 2ГИС`).
- [ ] Не показывать пустую/декоративную map preview без продуктовой пользы.
- [ ] Адрес остаётся копируемым и доступным без карты.
- [ ] Entrance/meeting point не смешивается с venue centroid.
- [ ] Внешний переход имеет корректный focus/target/return behavior.
- [ ] Нет утверждения о travel time без approved routing service.
- [ ] Straight-line distance, route distance и travel time различаются.
- [ ] «Рядом со мной» требует explicit permission и работает с named-place fallback.
- [ ] Precise user coordinates не передаются модели, когда достаточно server spatial query.
- [ ] Mobile one-hand reachability для map actions проверена.

## 10. Social proof, editorial proof и медальоны

Эти сигналы тестируются отдельно после conversational-value experiment.

- [ ] Развести `social proof`, `editorial proof`, `identity medallion` и `match reason`.
- [ ] Никакой сигнал не генерируется моделью без typed backend evidence.
- [ ] Generic Search/agent cards не получают medallions автоматически.
- [ ] Compact medallion/card acceptance проводится отдельно на реальных fixtures.
- [ ] Определить max visual signals per compact card.
- [ ] Не ухудшать scanability и title/date/location hierarchy.
- [ ] Проверить long organizer/venue identities.
- [ ] Проверить absence/failure state: no fabricated initials or placeholders.
- [ ] A/B conversational UX не смешивать с visual-proof treatment.

## 11. Content design и доверие

- [ ] Название функции описывает пользу (`Помочь подобрать`), а не технологию.
- [ ] Assistant не обещает «лучшие события» без определённого критерия.
- [ ] Коротко объясняет interpretation и trade-offs.
- [ ] Не выдумывает популярность, цену, доступность, возраст, location или organizer.
- [ ] Не пишет о событии факт, отсутствующий в trusted candidate facts.
- [ ] Ясно сообщает approximate/conflicting location.
- [ ] Не скрывает zero results за общими рекомендациями.
- [ ] Degraded mode объясняется без технического жаргона.
- [ ] Suggested replies являются действиями, а не misleading decoration.
- [ ] Один turn не содержит слишком много choices.
- [ ] Russian wording проверено на естественность и отсутствие repetitive AI tone.
- [ ] Система не отвечает на general-chat темы за границами event discovery.

## 12. Responsive, keyboard и accessibility

- [ ] 320/390px без horizontal overflow.
- [ ] Composer/input font не вызывает mobile zoom.
- [ ] Touch targets не меньше принятого minimum.
- [ ] Event cards и chips имеют логичный reading/focus order.
- [ ] New assistant output объявляется без повторного чтения всей истории.
- [ ] `aria-live` не спамит промежуточными токенами/фрагментами.
- [ ] Loading/progress не симулирует точность.
- [ ] Keyboard submit/newline semantics понятны.
- [ ] Escape/cancel/back behavior определён.
- [ ] Focus возвращается к результату/композеру после actions.
- [ ] Suggested replies доступны без horizontal-only carousel trap.
- [ ] Reduced motion поддержан.
- [ ] High contrast и text scaling проверены.
- [ ] Long Russian titles/addresses/refinement labels проверены.
- [ ] Screen reader различает event link, save, map and refinement actions.
- [ ] Desktop conversation width не создаёт чрезмерную line length.

## 13. Loading, streaming и skeletons

- [ ] Определить нужен ли streaming вообще; не включать ради эффекта.
- [ ] Если response bounded JSON, показывать честный indeterminate state.
- [ ] Если появится streaming capability, semantics доказаны отдельно на supported browsers.
- [ ] Не показывать provisional cards, которые затем хаотично переставляются.
- [ ] Reuse accepted EventCard skeleton geometry where applicable.
- [ ] Conversation skeleton не создаёт вторую loading vocabulary без причины.
- [ ] Slow notice и cancel доступны.
- [ ] Model failure возвращает trusted ordinary Search results.
- [ ] Stale turn/chunk не меняет новый request epoch.
- [ ] Error retry не дублирует cost-bearing request без idempotency proof.

## 14. Prototype boards

Minimum prototype set on the same real fixtures:

- [ ] mobile rescue entry from `missed`;
- [ ] desktop rescue entry;
- [ ] initial treatment response with 3–5 events;
- [ ] refinement by chip;
- [ ] refinement by free text;
- [ ] one necessary clarification;
- [ ] `Где это?` with address and two map actions;
- [ ] approximate/conflicting location;
- [ ] zero result;
- [ ] model/schema fallback to classic Search;
- [ ] auth/quota/timeout;
- [ ] switch to full listing;
- [ ] long transcript compaction or bounded history;
- [ ] screen-reader/focus annotations.

Each board includes:

- [ ] exact route/archetype/state;
- [ ] fixture IDs and catalogue/location revision;
- [ ] baseline control beside candidate;
- [ ] product Job and expected outcome;
- [ ] existing/new resource dispositions;
- [ ] unresolved decisions;
- [ ] no fabricated social/location facts.

## 15. Product evaluation

Primary:

- [ ] `event_value_reached_rate`;
- [ ] `event_intent_action_rate`;
- [ ] cards to first event value;
- [ ] time to first event value;
- [ ] explicit `matched/missed`.

Assistant-specific:

- [ ] rescue success rate;
- [ ] turns to first value;
- [ ] suggested-reply acceptance;
- [ ] clarification without result;
- [ ] assistant→classic switch;
- [ ] card open/save/calendar/share by mode;
- [ ] model calls/tokens per successful discovery;
- [ ] malformed output/fallback;
- [ ] invented Event/location/map action count, target `0`;
- [ ] p50/p95 latency;
- [ ] abandonment.

- [ ] A treatment is not accepted because users typed more messages.
- [ ] Baseline sample size and decision threshold are fixed before readout.
- [ ] Card design and social-proof experiments are separated.
- [ ] Diversity by locality/theme/format is a guardrail.
- [ ] Raw conversation/query text is absent from general analytics.

## 16. Implementation and three-way conformance

Only after Gate B and owner decision:

- [ ] accepted product scope has exact version/hash;
- [ ] component/pattern dossiers approved;
- [ ] native Penpot candidates use verified target context;
- [ ] isolated Astro candidate uses same fixtures and contracts;
- [ ] typed UI schema and renderer have property tests;
- [ ] foreign Event/location/action IDs fail closed;
- [ ] browser tests cover all critical states;
- [ ] exact Astro/Git/Penpot conformance completed;
- [ ] runtime behavior reviewed beyond screenshots;
- [ ] production feature flag and cohort defined;
- [ ] analytics and rollback verified;
- [ ] post-deploy factual/navigation canary exists;
- [ ] no automatic promotion from experiment winner to universal component.

## 17. MCP-specific product/design check

MCP is an external access path over the same domain data, not the visual architecture owner.

- [ ] MCP result has canonical Event/location IDs and revisions.
- [ ] External client can render cards/chips from typed blocks without scraping prose.
- [ ] Tool allowlist is bounded and read-only for discovery.
- [ ] Durable actions remain separate authenticated/idempotent commands.
- [ ] No arbitrary URL/SQL/network tool is exposed.
- [ ] Site remains functional without Remote MCP.
- [ ] Same factual/degraded semantics are preserved across direct API, function calling and MCP.
- [ ] MCP output does not create a competing design-system contract.

## 18. STOP conditions

Stop design/implementation and return to product/data work when:

- location coverage or correctness is insufficient for claimed map/distance behavior;
- model output can introduce foreign Event/location/action IDs;
- classic Search fallback is unavailable;
- conversation mode requires a second Search/index/auth/quota system;
- product experiment cannot isolate conversational value;
- agent cards duplicate canonical EventCard behavior without accepted reason;
- raw transcript/precise location privacy boundary is unresolved;
- provider quota/latency makes the planned cohort uneconomic;
- Penpot/AS-IS target context is not exact;
- visual novelty is being accepted instead of user outcome evidence.

## 19. Closure criterion

The direction may be marked product- and design-ready only when:

- rescue-first value is demonstrated or explicitly accepted for a bounded test;
- all journey and failure states are designed;
- text/event/chip/location/map blocks have typed contracts;
- canonical EventCard/location resources are reused or new boundaries are proven;
- location facts and map actions are server-grounded;
- classic Search remains immediate fallback;
- mobile/desktop/keyboard/accessibility evidence is complete;
- zero invented Event/location/map facts is proven in acceptance;
- exact Product Atlas, Git UI SoT, Penpot and Astro bindings exist for the accepted scope;
- owner decision, rollout and rollback are recorded.

Until then the status remains `accepted_for_product_exploration`, not `designed`, `implemented` or `promoted`.
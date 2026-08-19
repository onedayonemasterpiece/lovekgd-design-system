# Component page readiness checklist

Этот checklist оценивает полноту component dossier и его representations. Он не является promotion gate и не меняет authority.

## Как использовать

Для каждого пункта укажите:

```text
PASS
FAIL — blocker
NOT_APPLICABLE — с reason
NOT_REQUIRED_AT_CURRENT_LIFECYCLE — с exact state/gate
```

Пустое поле не считается `NOT_APPLICABLE`. Evidence link должен указывать на exact identity/version/SHA, где это применимо.

## A. Identity and authority — required

- [ ] `component_id` и `family_id` существуют в authoritative registry или явно помечены как bounded draft identities.
- [ ] `contract_version` и `contract_sha256` указаны.
- [ ] exact `authority_mode` указан.
- [ ] exact `lifecycle_state` указан.
- [ ] `contract_decision_status` согласован с lifecycle.
- [ ] `canonical` согласован с terminal promotion rules.
- [ ] human-readable `display_status` не маскирует underlying lifecycle.
- [ ] owner, reviewers и review channel указаны.
- [ ] source snapshot/package SHA указан.
- [ ] Penpot, Astro и runtime bindings указаны либо отсутствуют с blocker reason.
- [ ] fixture registry и evidence receipts связаны.
- [ ] exact foundation/content/terminology/brand/media/responsive refs указаны либо отсутствуют с blocker/NA reason.
- [ ] promotion/rollback/replacement refs заполнены по текущему status.
- [ ] authority statement явно объясняет, что является source of truth сейчас.

## B. Discoverability and entry points — required

- [ ] display name и краткое user-centered summary есть.
- [ ] aliases включают продуктовую терминологию и previous names.
- [ ] dossier доступен из catalog/documentation map.
- [ ] design, code, specimen, product consumer, evidence и support entry points собраны в одном месте.
- [ ] external links имеют понятный source boundary и availability state.
- [ ] historical/external reference не выдан за current component truth.
- [ ] deprecated resource ведёт к replacement/migration.
- [ ] related resources различаются как alternative, nested, parent, pattern или replacement.

## C. Purpose and selection — required

- [ ] описана user need / Job / outcome.
- [ ] перечислены use-when scenarios.
- [ ] перечислены do-not-use scenarios.
- [ ] объяснено отличие от соседних families/patterns.
- [ ] указаны поддерживаемые capabilities/archetypes.
- [ ] consumer boundary и responsibility компонента понятны.
- [ ] known gaps перечислены с impact, owner и blocking transition.

## D. Default and anatomy — required

- [ ] default specimen показан раньше edge variants.
- [ ] default specimen имеет exact `state_key`, `fixture_id` и viewport/container.
- [ ] объяснено, почему это contract default или recommended start.
- [ ] anatomy regions имеют stable IDs и semantic roles.
- [ ] required/optional slots указаны.
- [ ] content owner и behavior owner указаны для каждой region.
- [ ] nested component refs перечислены.
- [ ] allowed consumer control перечислен.
- [ ] forbidden internal overrides перечислены.
- [ ] hit areas и focus boundaries отражены.

## E. Variants and states — required

- [ ] все public variant axes перечислены.
- [ ] canonical axis/value names совпадают с contract.
- [ ] contract/package version, resource kind and tool/view labels отсутствуют в public variant/state axes.
- [ ] semantic intent каждой оси объяснён.
- [ ] default value каждой оси указан.
- [ ] owner каждой оси указан.
- [ ] valid combinations заданы machine-readable source или exact ref.
- [ ] invalid combinations заданы или обоснованно `NOT_APPLICABLE`.
- [ ] representative visual matrix не выдаётся за полный registry.
- [ ] interaction states покрыты по применимости.
- [ ] async/loading/error states покрыты по применимости.
- [ ] selection states покрыты по применимости.
- [ ] empty/partial/overflow/unavailable content states покрыты.
- [ ] product-owned states отделены от visual variants.
- [ ] state transition entry/exit rules описаны.
- [ ] deprecated/legacy state mappings не переписывают historical identity.

## F. Themes, foundations, tokens and naming — required when applicable

- [ ] supported modes/themes перечислены.
- [ ] unsupported modes указаны явно.
- [ ] exact foundation IDs/versions/hashes и consumers перечислены.
- [ ] semantic token refs показаны.
- [ ] component-specific token exceptions обоснованы.
- [ ] same state/fixture tuple используется для mode comparison.
- [ ] comparative frames генерируются из одного component structure или blocker документирован.
- [ ] contrast проверен во всех required modes/states.
- [ ] Figma/Penpot properties, code props, state keys и test registry используют согласованный naming.
- [ ] spelling/terminology lint проходит.
- [ ] rename имеет alias/migration mapping.
- [ ] imported/local token collections имеют exact owner/version/hash/consumer/supersession records.
- [ ] opaque mnemonic names используются только как display/search aliases, не canonical IDs.
- [ ] external reference values не скопированы без current LoveKGD consumer/accessibility evidence.

## G. Responsive and media behavior — required when applicable

- [ ] viewport/container model указан.
- [ ] responsive foundation ID/version and grid/container/media policy refs exact.
- [ ] min/max/intrinsic sizing описан.
- [ ] wrap/truncate/expand behavior описан.
- [ ] layout/region reordering описан.
- [ ] visibility changes описаны.
- [ ] prohibited squeeze state указан.
- [ ] media ratio/crop/focal/contain behavior описан.
- [ ] poster/fallback/missing/error/provenance behavior описан по применимости.
- [ ] touch adaptation описана.
- [ ] required responsive classes имеют specimens.
- [ ] stress fixtures покрывают реальные content/media extremes.

## H. Interaction and accessibility — required

- [ ] semantic root element/role указан.
- [ ] accessible name/description sources указаны.
- [ ] name/role/value changes by state описаны.
- [ ] keyboard map указан.
- [ ] focus-visible treatment указан.
- [ ] focus order описан.
- [ ] focus trap/restoration описан по применимости.
- [ ] pointer and touch behavior описан.
- [ ] loading/disabled concurrency rules описаны.
- [ ] screen-reader announcements/live regions описаны.
- [ ] error association/recovery описаны.
- [ ] minimum target size проверен.
- [ ] zoom/reflow/text resize behavior проверен.
- [ ] motion purpose и token refs указаны.
- [ ] reduced-motion alternative указан.
- [ ] RTL/localization impact оценён по применимости.
- [ ] accessibility statements связаны с evidence, а не только с declaration.

## I. Content and localization — required when component contains content

- [ ] intent каждого content slot указан.
- [ ] required/optional/empty behavior указан.
- [ ] typical and stress fixtures существуют.
- [ ] max lines/overflow/wrapping указан.
- [ ] case, punctuation and terminology rules указаны.
- [ ] content-standard and terminology-registry versions/owners linked.
- [ ] date/time/number/place/price formatting указано по применимости.
- [ ] localization expansion учтён.
- [ ] accessible alternative/label указан.
- [ ] prohibited or misleading content examples приведены.
- [ ] content guidance доступна без чтения инженерного API.

## J. Product usage and fixtures — required

- [ ] каждый product example имеет `fixture_id`.
- [ ] source/context provenance указана.
- [ ] consumer/archetype указан.
- [ ] exact state key указан.
- [ ] viewport/container указан.
- [ ] evidence class указан.
- [ ] expected outcome или selection decision объяснён.
- [ ] есть representative normal use.
- [ ] есть stress use.
- [ ] есть prohibited/misleading use.
- [ ] decorative mockup не помечен как conformance evidence.
- [ ] product representations не содержат detached accepted component copies.

## K. Code and API — required according to lifecycle

- [ ] package/import path указан либо current lifecycle blocker объяснён.
- [ ] API/props/slots/events согласованы с contract.
- [ ] defaults согласованы с contract.
- [ ] semantic markup boundary описан.
- [ ] allowed CSS custom properties/context hooks перечислены.
- [ ] forbidden consumer overrides перечислены.
- [ ] runnable specimen импортирует exact implementation, а не copy.
- [ ] error/loading/edge examples доступны по применимости.
- [ ] SSR/hydration/runtime caveats указаны по применимости.
- [ ] package version/candidate SHA закреплены.

## L. Tests and evidence — required according to lifecycle

- [ ] anatomy/slots validation присутствует.
- [ ] variant mapping validation присутствует.
- [ ] required state coverage измеряется.
- [ ] fixture coverage измеряется.
- [ ] interaction tests присутствуют.
- [ ] accessibility evidence присутствует.
- [ ] responsive/container evidence присутствует.
- [ ] text/media stress evidence присутствует.
- [ ] foundation compatibility and content/terminology lint evidence присутствует.
- [ ] brand/media provenance and rights checks присутствуют по применимости.
- [ ] local override checks присутствуют.
- [ ] Penpot binding/read-back evidence соответствует current lifecycle.
- [ ] isolated Astro specimen evidence соответствует current lifecycle.
- [ ] generated-page consumer evidence соответствует current lifecycle.
- [ ] three-way conformance result показан только если gate выполнен.
- [ ] screenshots связаны с identity, DOM/a11y/interaction evidence.
- [ ] rollback evidence присутствует к требуемому gate.
- [ ] missing evidence отображается как blocker, а не скрывается.

## M. Lifecycle, changelog and migration — required

- [ ] current lifecycle state объяснён evidence refs.
- [ ] указан только следующий adjacent transition.
- [ ] requirements следующего gate перечислены.
- [ ] blocking evidence/owner decision перечислены.
- [ ] changelog разделяет added/changed/fixed/deprecated/removed.
- [ ] consumer impact указан.
- [ ] breaking changes имеют migration steps.
- [ ] compatibility window указано по применимости.
- [ ] replacement identity указана для deprecation.
- [ ] affected consumers перечислены.
- [ ] rollback path указан.
- [ ] historical versions/evidence не переписаны.

## N. Penpot / Resource Graph page — required only when materialized

- [ ] page/board находится в правильной Resource Graph family zone.
- [ ] root and zones соответствуют managed spatial contract.
- [ ] stable metadata присутствует.
- [ ] authority/status banner присутствует.
- [ ] default и critical states доступны без скрытого horizontal sprawl.
- [ ] axes, states и themes визуально разделены.
- [ ] supporting components следуют после anatomy.
- [ ] product examples отделены от conformance specimens.
- [ ] repeated specimens являются instances/generated outputs.
- [ ] no detached copies.
- [ ] comments/gaps привязаны к exact identity/version.
- [ ] materialization повторяется idempotently.
- [ ] read-back receipt фиксирует revision, IDs, counts и status.
- [ ] Penpot completeness не меняет lifecycle автоматически.

## O. Documentation quality — required

- [ ] локальная навигация/reading paths понятны.
- [ ] headings отражают user decisions, а не только internal file names.
- [ ] examples имеют explanation рядом с visual/code.
- [ ] таблицы не скрывают conditional rules.
- [ ] terminology единообразна.
- [ ] spelling проверен.
- [ ] broken links отсутствуют.
- [ ] last-reviewed date указана.
- [ ] support route видима.
- [ ] unresolved questions видимы.
- [ ] generated and human-authored sections различимы.
- [ ] external-source limitations/provenance/availability указаны.

## Fail-closed blockers

`documentation_ready: false` обязательно, если выполняется хотя бы одно условие:

- identity/version/lifecycle truth не определены;
- `canonical` незаконно расходится с lifecycle;
- design/code binding отсутствует без объяснения;
- default или axes/states не определены;
- required product fixtures не имеют provenance;
- required foundation versions/consumers unresolved;
- content/terminology policy missing for content-bearing UI;
- brand/media provenance missing where assets are used;
- behavior/accessibility для interactive component не описаны;
- component page содержит независимые theme/component copies без binding;
- contract/package version encoded as public variant/state;
- historical/external reference used as current truth;
- accepted/deprecated badge не имеет authoritative decision/migration evidence;
- dossier выдаёт screenshot/documentation completeness за promotion/conformance.

## Result

```yaml
component_id: ...
contract_version: ...
checked_at: ...
reviewers: []

required_pass: 0
required_fail: 0
not_applicable_with_reason: 0
not_required_at_current_lifecycle: 0

open_blockers: []
documentation_ready: false
authority_effect: none
```

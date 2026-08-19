# 02 — Pattern matrix

## 1. Сравнение систем по слоям

Legend: `●` — сильный подтверждённый pattern; `◐` — частично или evidence ограничен; `○` — не обнаружено; `—` — не оценивалось.

| Система | Token layers | Component dossier | Code/design binding | Lifecycle/version | Patterns/blocks | Page/templates | Review/evidence | Главный урок |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| Consta Web | ◐ | ● | ● | ● | ◐ | ◐ | ● | одна identity, несколько reading paths |
| Consta mobile deprecated | — | — | ◐ | ● | — | — | ◐ | old design kit должен иметь replacement status |
| Paradigm/VKUI | ● | ● | ● | ◐ | ◐ | ◐ | ● | cross-platform tokens + formal design review |
| T2D2 | ● | ◐ | ● | ◐ | ● | ● | ◐ | Foundation → component tokens → product styles → blocks |
| ISPsystem | ◐ | ◐ | ◐ | ◐ | ◐ | ◐ | ◐ | rules and logic are separate from component masters |
| Gravity UI | ● | ● | ● | ● | ● | ● | ● | typed/schema-validated blocks and specialized packages |
| HSE | ◐ | ◐ | ◐ | ● | ◐ | ● | ◐ | ecosystem scale requires page-type governance |
| Alfa `arui-feather` | ◐ | ◐ | ◐ | ● | ○ | ○ | ● | deprecation runway + visual regression |
| Госдизайн | ○ | ○ | ○ | ◐ | ○ | ◐ | ● | accessibility as cross-role gate |
| Kontur UI | ● | ● | ● | ● | ● | ● | ● | specialized page-state packages and guides |
| ViennaUI | ● | ◐ | ● | ◐ | ◐ | ◐ | ● | tokens/primitives/themes/UI packages + actionable review |
| Taiga UI | ● | ● | ◐ | ● | ◐ | ● | ● | exact code/Figma version compatibility |
| Yandex UI | ◐ | ◐ | ◐ | ◐ | ◐ | ○ | ◐ | explicit modifier axes require central combination model |
| Elephas | ◐ | ◐ | ● | ● | ◐ | ○ | ◐ | one framework-neutral core with tested adapters |
| Ростелеком | ● | ● | ● | ● | ● | ◐ | ● | engine/themes, generation migration and rich usage rules |
| Росатом | ◐ | ◐ | ◐ | ◐ | ◐ | ◐ | ◐ | multi-surface portal; deeper audit required |
| Penpot platform | ● | — | ◐ | — | — | — | ● | native review surface must remain contract-bound |

## 2. Повторяющиеся сильные patterns

### P-01. Layered token architecture

Подтверждено T2D2, Paradigm, Gravity, ViennaUI, Ростелеком и частично Kontur/Taiga.

```text
primitive values
→ semantic roles
→ component-level decisions
→ product/theme aliases
```

**LoveKGD rule:** component contract не ссылается на raw value, если существует semantic token. Pattern/archetype tokens вводятся только при доказанном повторяющемся composition invariant.

### P-02. Package/resource boundaries

Gravity и Kontur выводят сложные grids, navigation, dates, validation, icons и page-state packages за пределы core. Vienna отделяет tokens/primitives/themes. Elephas отделяет core and layout.

**LoveKGD rule:** entity kind и package boundary определяются responsibility и lifecycle, а не размером визуального объекта.

### P-03. Multi-audience dossier

Consta, Paradigm, Gravity, Ростелеком и Kontur дают разные входы для design, code, usage and support.

**LoveKGD rule:** dossier имеет один canonical record и audience views; нельзя вести независимые design and engineering manuals.

### P-04. Purpose and selection before API

Consta/Ростелеком/Gravity явно говорят `when to use / when not to use`. Paradigm добавляет content and platform rules.

**LoveKGD rule:** resource без purpose/selection guidance не готов к catalog publication.

### P-05. Explicit states, content and examples

Системы показывают variants, sizes, states, usage examples, real-like content and sandbox.

**LoveKGD rule:** examples разделяются на illustrative example, contract fixture, product representation и runtime evidence. UI не смешивает эти evidence classes.

### P-06. Visible lifecycle and compatibility

Consta metadata, Taiga compatibility table, Alfa deprecation, Ростелеком Gen1/Gen2, Kontur supersession.

**LoveKGD rule:** catalog badge всегда derived from exact lifecycle/status.

### P-07. Typed pattern/block schemas

Gravity Page Constructor — strongest example; T2 gives organizational Block library.

**LoveKGD rule:** pattern/block имеет machine schema, component graph, fixture set, allowed contexts and responsive rules.

### P-08. Page/template layer outside component library

T2, Gravity, Taiga, Kontur, HSE and Ростелеком подтверждают separate pages/templates/patterns.

**LoveKGD rule:** page archetypes are versioned contracts and do not live as detached frame collections.

### P-09. Formal review and testing

Paradigm design review, Vienna review format, Alfa visual regression, Gravity/Kontur/Taiga CI.

**LoveKGD rule:** review status cannot be inferred from comments count. It requires exact review packet and closure receipt.

### P-10. Accessibility as systemic evidence

Gravity/Kontur/Paradigm and Госдизайн.

**LoveKGD rule:** a11y checks exist at foundation, component, pattern, archetype, flow and content levels.

## 3. Повторяющиеся failure modes

### F-01. Platform kits diverge

Observed in T2's historical Web/App split; deprecated Consta platform files illustrate lifecycle risk.

**Countermeasure:** one semantic contract, platform adapters and explicit divergences.

### F-02. Design file looks current but is not compatible with code

Taiga openly reports old Figma compatibility; archived/deprecated systems are still discoverable.

**Countermeasure:** exact version/hash compatibility in every design header and library index.

### F-03. Figma/Penpot becomes a parallel SoT

**Countermeasure:** contract-derived materialization, read-back, no detached accepted copies.

### F-04. Theme copies diverge

**Countermeasure:** modes/tokens as authoring source; theme boards generated for comparison.

### F-05. Variant Cartesian explosion

**Countermeasure:** `valid_combinations`, `invalid_combinations`, coverage and product evidence.

### F-06. Components absorb patterns/pages

**Countermeasure:** resource-kind decision and ownership boundary before adding an axis.

### F-07. Free block constructors create incoherent pages

Schema-valid JSON does not ensure product intent.

**Countermeasure:** archetype contracts constrain blocks, order, dependencies and states.

### F-08. Documentation completeness is mistaken for acceptance

**Countermeasure:** dossier completeness and lifecycle readiness are separate statuses.

### F-09. Local libraries become forks

**Countermeasure:** upstream ref, owner, expiration, divergence reason, no-detach and promotion/deletion path.

### F-10. Deprecation is silent

**Countermeasure:** visible banner, replacement, migration fixtures, release runway and consumer census.

## 4. Target pattern stack for LoveKGD

```text
L0  Evidence and product meaning
L1  Raw assets and primitive values
L2  Semantic foundations and tokens
L3  Primitives and component contracts
L4  Native component implementations
L5  Patterns / blocks / compositions
L6  Page archetypes
L7  Product representations and flows
L8  Runtime conformance and releases
```

### Dependency rule

A layer may depend only on itself or lower layers, except explicit evidence links. Circular ownership is forbidden.

### Authority rule

```text
Git contract/package = normative identity and lifecycle
Penpot = native design implementation + review
code package = executable implementation
runtime = product evidence
docs = rendered explanation of the graph
```

### Publication rule

A resource can be documented before promotion, but its status and authority must remain exact and visible.

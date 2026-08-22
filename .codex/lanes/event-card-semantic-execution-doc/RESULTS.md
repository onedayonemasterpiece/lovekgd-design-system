# EventCard semantic execution-sequence documentation

## Scope

Updated only `docs/design-system-execution-sequence.md`. No Penpot, runtime,
production UI, component contract, or unrelated documentation was changed.

## Production evidence used

- Current public-projection census: 703 events.
- Actually rendered event-type labels: 31. They are content values/labels of
  one semantic component, not 31 variants.
- Admission: 61 distinct arbitrary paid/range labels plus ticket,
  free-registration, registration, phone, and sold-out families.
- Existing Astro runtime gaps: 96 obsolete `Условия уточняются` outputs and two
  invalid `0 ₽` outputs. Neither is accepted as a SoT state; unknown admission
  is hidden fail-closed by owner decision.
- Evidence:
  `/home/dev/.codex/worktrees/events-bot-new/event-card-semantic-runtime/artifacts/codex/event-card-semantic-closure/production-census.json`
- Evidence SHA-256:
  `3578bee41bda0b5e32e950fd1f27a2561b1ca3714ce7ac9bdd8cc4068e36ff08`

## Documentation result

- Wave 0 now requires a production-derived semantic census; Golden fixtures
  remain a bounded conformance sample rather than a completeness oracle.
- Event type is documented as semantic value/label content.
- Paid admission permits arbitrary amount/range/currency content inside a
  bounded semantic family.
- Unknown admission is hidden; obsolete/invalid Astro output is recorded as a
  runtime gap, not normalized into the design system.
- Calendar/share/like/not-interested are CTA/action components, not service
  labels; social counters are arbitrary owned content.

No targeted validator for this documentation exists on the branch, so none was
modified or invented. The diff was checked with `git diff --check`.

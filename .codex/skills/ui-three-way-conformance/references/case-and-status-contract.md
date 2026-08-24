# Case, profiles, exceptions, and status

The schema is `contracts/ui-conformance/ui-conformance-case.v1.schema.json`.
The tuple is exact: component, contract version/hash, state, fixture snapshot,
viewport/container/DSF, font manifest, Penpot binding/export, and Astro binding.

Authority modes:

- `astro-reference`: pinned Astro is AS-IS reconstruction authority; Penpot may
  differ only through a registered candidate delta.
- `penpot-candidate-reference`: the owner accepted a bounded Penpot candidate;
  Astro candidate is reconciled to it.
- `promoted-contract-reference`: promoted Git package plus accepted Penpot
  export is normative and unexpected drift blocks release.

Profiles:

- `pixel-strict`: stable static components/states.
- `state-sampled`: stable checkpoints of interactive components.
- `structure-and-behavior`: Penpot anatomy/static checkpoints plus browser
  geometry and behavior authority.
- `nonvisual`: runtime enabler without an independent surface.

Exceptions must be narrow by component, contract version, state, and region or
behavior. They require Penpot checkpoints and browser test references, cannot
wildcard the entire component, expire/invalidate on contract change, and remain
`candidate_exception` until a recorded owner decision.

Status precedence:

1. `BLOCKED_*` identity/environment condition;
2. structural `FAIL`;
3. code-agent visual verdict;
4. pixel metrics as supporting evidence only.

Display statuses: `✅ PASS`, `🟡 MINOR`, `🔴 FAIL`, `⚪ EXCEPTION`, `⛔ BLOCKED`.
Agent PASS never means owner acceptance or lifecycle movement.

Identity blockers: `BLOCKED_IDENTITY_MISMATCH`,
`BLOCKED_FIXTURE_MISMATCH`, `BLOCKED_FONT_ENV`,
`BLOCKED_ASSET_MISMATCH`, and `BLOCKED_PENPOT_EXPORT`.

# Lane L4-sot-integration Results

## Status
committed

## Requirement IDs
- R01
- R02
- R03
- R04
- R05
- R06
- R07
- R08
- R09

## Branch
`integration/card-systemic-audit-20260820`

## Worktree
`/home/dev/.codex/worktrees/lovekgd-design-system/card-systemic-audit-int`

## Base SHA
`04afe27f208596c33e0b6ce9f78d0561108ff93c`

## Head SHA
`49eca1158c0c8066a28fb61967ecdc0a8f93f40d`

## Files changed
- `catalog/normalization/families/event-preview-representations/event-card-systemic-boundaries-candidate-v1.json`
- `docs/normalization/event-card-systemic-component-boundaries-20260820.md`
- `scripts/validate-event-card-systemic-boundaries-v1.py`
- `receipts/penpot/event-card-systemic-component-remediation-v1.json`
- `docs/index.md`

## Commands run
Systemic validator, existing taxonomy Python/Node validators, icon registry validator, JSON parse and `git diff --check`.

## Tests / verification
All targeted validators PASS; contract hash `91a5350b72f3c54cc8a7ecad2a830b876dd9f719c8b029cd1a1fca2a5e8e67d9`.

## Risks
Existing historical validators still report `penpot_required:false`; the superseding receipt carries the live native read-back.

## Merge notes
Git SoT decision commit `6908c29` preceded every Penpot write; receipt commit is `49eca11`.

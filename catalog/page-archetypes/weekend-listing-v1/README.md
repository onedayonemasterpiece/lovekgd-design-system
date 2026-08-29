# Weekend Listing v1 candidate

`archetype.listing.weekend` is the reuse-first second consumer of Listing System v1.
It reuses the Date Listing foundations, shared cards, rails and site shell, while
owning only Weekend-specific range navigation, two-day grouping and timeline
behavior.

The frozen typical case is intentionally asymmetric: `event.real.7807` and
`event.real.7906` both occur on Saturday 22 August 2026; Sunday is honestly
empty. The stress case exercises the six-item range navigation and compact
desktop wrap with the same events. No duplicate or invented event is permitted.

Lifecycle remains candidate. Nothing in this directory promotes a family,
changes production routes, merges branches or deploys.

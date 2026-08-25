# Unified Design v1 — Wave 1 candidate

This is a bounded, review-only candidate on top of the closed AS-IS baseline.
It does not accept or normalize foundations and does not authorize Astro work,
production migration, shell replacement, promotion, or deploy.

## Candidate decisions

1. Add one semantic Search entry to the existing desktop route navigation.
   Mobile keeps the certified Search destination in the bottom navigation.
2. Model date/place/ordering as one responsive selector family. Desktop shows
   explicit controls; mobile preserves the date rail and uses compact triggers
   for place and ordering.
3. Model Event Detail ticket/calendar/share/like as one responsive action
   island. The same pattern is explicitly not applicable to Date Listing and
   Search, preventing “floating islands everywhere”.

All candidates inherit current baseline colors, typography, radius and spacing
as unaccepted values. Foundation Audit Pack v1 and two independent audits remain
the authority for later foundation decisions.

Astro implementation begins only after owner acceptance of the bounded native
Penpot candidates. It will then use an isolated lab/preview branch and the exact
accepted component IDs, states and viewports; production generation remains out
of scope.

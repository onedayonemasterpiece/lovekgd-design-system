# Golden Event Corpus v1 — surface placement report

`surface-expectations.json` records 29 explicit scenarios across all 12 required
surface classes. It does not force a fixture onto a page.

Implemented deterministic L0 scope:

- every exact event-detail route;
- exact date listing inclusion/exclusion;
- frozen today/tomorrow/weekend placement;
- a fixed saved-event Favorites scenario routed through the saved-state join.

Explicit `not_implemented` scenarios:

- Home and Popular need the full frozen catalog and their real selection/order;
- Unusual needs an approved immutable unusual manifest;
- Search needs a fixed query and recorded RPC/NDJSON response;
- Personal Feed needs a fixed compatible persona/context;
- Related needs an anchor-bound immutable related manifest.

These gaps are represented as data, not replaced with manual DOM insertion or a
fake ranking. Their implementation is required before those surfaces can claim
placement PASS. The current pilot remains bounded to EventCard Large rendering.

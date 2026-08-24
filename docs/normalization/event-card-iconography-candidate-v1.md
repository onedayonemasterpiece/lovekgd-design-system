# Event-card iconography — candidate registry v1

Status: **candidate / reconstructed / noncanonical / not promoted**.

The registry at
`catalog/normalization/iconography/event-card-icon-registry-candidate-v1.json`
is the Git SoT bridge between exact Astro geometry and Penpot Page 25. It is
generated from `events-bot-new@a68c7f23c4e014c6e9f66e95f394656e9cb0f411`.

## Current scope

- eight card-reachable glyphs from `Icon.astro`;
- the exact `48×23` mobile rail continuation cue;
- the distinct `20×20` Amber-found check;
- fourteen source festival-category SVG assets with CC0 attribution.

The set contains 24 semantic icons and zero unclassified entries. `heart`
retains its exact outline/solid states. `pin` is not substituted for the
festival map pin, `ticket` is not substituted for the category ticket, and the
Amber check is not substituted with a geometrically different generic check.

## Penpot invariant

Page 25 owns each source-bound native icon master. Every visible icon in an
event-card, medallion frame, or Amber artifact master is a linked component
instance from that collection. Card-local loose vector copies are forbidden.
The enclosing control retains the accessible name; decorative glyph instances
carry the registry semantics and exact runtime display-size evidence.

## Validation

```bash
python3 scripts/generate-event-card-icon-registry-candidate-v1.py --root .
python3 scripts/validate-event-card-icon-registry-candidate-v1.py --root .
```

The final `--require-penpot` gate requires read-back component bindings for all
24 registry entries.

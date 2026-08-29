#!/usr/bin/env python3
"""Derive the design-system fixture registry v2 from Golden Event Corpus v2."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
CORPUS_ROOT = ROOT / "catalog/fixtures/ui-reference-events/v2"
OUTPUT = ROOT / "catalog/fixtures/design-system-reference/v2"
FREE = [2182, 6711, 7609, 8006, 8200]


def write(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    corpus = json.loads((CORPUS_ROOT / "corpus.json").read_text(encoding="utf-8"))
    assets = json.loads((CORPUS_ROOT / "assets-manifest.json").read_text(encoding="utf-8"))
    primary = {row["event_id"]: row for row in assets["assets"] if row["role"] == "primary"}
    fixtures = [
        {
            "fixture_id": row["fixture_id"],
            "entity_type": "event",
            "source_id": row["event_id"],
            "payload_sha256": row["preview_event_sha256"],
            "coverage": row["coverage_tags"],
            "asset": {
                "url": primary[row["event_id"]]["source_url"],
                "sha256": primary[row["event_id"]]["sha256"],
            },
        }
        for row in corpus["fixtures"]
    ]
    registry = {
        "$schema": "../../../../contracts/ui-conformance/design-system-reference-fixture-registry.v2.schema.json",
        "schema_version": "design-system-reference-fixture-registry.v2",
        "registry_id": "design-system-reference-v2",
        "reference_clock": {"date": "2026-08-29", "timezone": "Europe/Kaliningrad", "locale": "ru-RU"},
        "golden_corpus": {
            "corpus_id": corpus["corpus_id"],
            "path": "catalog/fixtures/ui-reference-events/v2/corpus.json",
            "sha256": corpus["corpus_sha256"],
        },
        "entity_sources": {
            "event_payloads": {
                "repository": "onedayonemasterpiece/lovekgd-design-system",
                "path": "catalog/fixtures/ui-reference-events/v2/events",
                "projection": "catalog/fixtures/ui-reference-events/v2/projections/free-collection-september.v1.json",
                "rule": "Full PreviewEvent payloads and media hashes are immutable corpus facts; route scenarios select IDs only.",
            },
            "non_event_fixtures": {
                "rule": "Festival, club and artifact identities remain semantic pools and do not inherit EventCard payloads.",
            },
        },
        "fixtures": fixtures,
        "pools": {
            "events.golden.v2": [row["fixture_id"] for row in corpus["fixtures"]],
            "events.free-collection-september.v1": [f"event.real.{event_id}" for event_id in FREE],
            "festivals.reference.v1": ["festival.city-jazz", "festival.sosedi", "festival.grozd", "festival.more-vnutri", "festival.bolshoy-kaup", "festival.v-edinstve", "festival.jazz-v-filarmonii"],
            "clubs.complete.v1": ["club.game-vibes", "club.neural-researchers", "club.technology-researchers"],
            "artifacts.complete.v1": [f"artifact.amber-{index:02d}" for index in range(1, 8)],
        },
        "projections": {
            "free-collection-september.v1": {
                "source": "catalog/fixtures/ui-reference-events/v2/projections/free-collection-september.v1.json",
                "scenario": "catalog/fixtures/design-system-reference/v2/scenarios/archetype.collections.free.september.desktop-ready.v2.json",
            }
        },
    }
    write(OUTPUT / "registry.v2.json", registry)

    scenario = {
        "$schema": "../../../../../contracts/ui-conformance/design-system-scenario-projection.v1.schema.json",
        "schema_version": "design-system-scenario-projection.v1",
        "scenario_id": "free-collection-september-desktop-v2",
        "registry_ref": "catalog/fixtures/design-system-reference/v2/registry.v2.json#events.free-collection-september.v1",
        "route_ref": {
            "registry": "catalog/global-archetype-sot-v1/route-archetype-registry.v1.json",
            "archetype_id": "archetype.collections",
            "route": "/podborki/besplatnye-sobytiya/",
        },
        "state": "ready",
        "viewport": {"width": 1280, "height": 1200, "dpr": 1},
        "fixture_input_order": [f"event.real.{event_id}" for event_id in FREE],
        "expected_render_order": ["event.real.8006", "event.real.8200", "event.real.2182", "event.real.6711", "event.real.7609"],
        "component_projection": {
            "family": "event-card-family",
            "representation": "large",
            "astro_owner": "site/src/components/EventCard.astro",
            "penpot_archetype_component_id": "b0fe69fd-ccaf-8025-8008-847108143471",
            "detached_instances_allowed": 0,
        },
        "container_projection": {
            "semantic_id": "event-card-equal-height-grid",
            "astro_owner": "site/src/components/OptimizedEventCardGrid.astro",
            "layout_contract": "catalog/ui-components/event-card-container/packed-rows.v1.json",
            "groups": [
                {"id": "events", "fixture_ids": ["event.real.8006", "event.real.8200"], "desktop_columns": 2, "row_card_counts": [2], "row_ratio": "6x7"},
                {"id": "exhibitions", "fixture_ids": ["event.real.2182", "event.real.6711", "event.real.7609"], "desktop_columns": 3, "row_card_counts": [3], "row_ratio": "1x1"},
            ],
            "equal_height_within_each_row": True,
            "preserve_all_source_cards": True,
            "fill_available_width_per_row": True,
        },
        "acceptance": {
            "headings": ["2 событий", "Бесплатные выставки · 3"],
            "exact_fixture_identity_required": True,
            "astro_fixture_marker_required": True,
            "penpot_linked_instances_required": 5,
            "horizontal_overflow": 0,
            "console_errors": 0,
            "production_data_replacement": False,
            "visual_comparison_required": True,
            "structural_readback_cannot_substitute_visual_comparison": True,
            "review_states": ["top", "hero-passed-sticky-medallion", "full-page"],
        },
    }
    write(OUTPUT / "scenarios/archetype.collections.free.september.desktop-ready.v2.json", scenario)


if __name__ == "__main__":
    main()

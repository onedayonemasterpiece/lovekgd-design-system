#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image

EXPECTED_SEMANTIC_IDS = [
    "medallion.identity.world-ocean-museum",
    "medallion.identity.history-art-museum",
    "medallion.identity.kaliningrad-philharmonic",
    "medallion.identity.kant-island",
    "medallion.identity.dom-kitoboya",
    "medallion.identity.tretyakovka-kaliningrad",
    "medallion.identity.konb",
    "medallion.identity.act-opus",
]
EXPECTED_BINDINGS = [
    "organizer:world-ocean-museum",
    "organizer:history-art-museum",
    "organizer:kaliningrad-philharmonic",
    "organizer:kant-island",
    "organizer:dom-kitoboya",
    "organizer:tretyakovka-kaliningrad",
    "organizer:konb",
    "organizer:act-opus",
]
EXPECTED_TIERS = [44, 60, 88]


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", type=Path, required=True)
    args = parser.parse_args()
    root = args.dir.resolve()

    membership = load_json(root / "medallion-membership.v1.json")
    inventory = load_json(root / "source-inventory.v1.json")
    measurements = load_json(root / "measurements.v1.json")
    validation = load_json(root / "validation.v1.json")
    svg_path = root / "r2-medallions-densest.svg"
    png_path = root / "r2-medallions-densest.png"
    svg = svg_path.read_text(encoding="utf-8")

    ET.parse(svg_path)
    with Image.open(png_path) as image:
        assert image.size == (2176, 1160)
        assert image.format == "PNG"

    assert membership["state"] == "IMMUTABLE_EIGHT_VISUAL_MEMBERSHIP"
    assert membership["visual_asset_count"] == 8
    assert membership["tier_order_px"] == EXPECTED_TIERS
    assets = membership["assets"]
    assert [item["semantic_id"] for item in assets] == EXPECTED_SEMANTIC_IDS
    assert [item["binding_id"] for item in assets] == EXPECTED_BINDINGS
    assert [item["membership_index"] for item in assets] == list(range(1, 9))
    assert all(item["consumer_group"] == "institutions-a" for item in assets)
    assert all(item["category"] == "venue_brand" for item in assets)
    assert all(item["listing_status"] == "listing_ready" for item in assets)
    assert all(item["listing_binding"] == "venue" for item in assets)
    assert all(item["tiers_px"] == EXPECTED_TIERS for item in assets)
    assert len({item["source"]["path"] for item in assets}) == 8
    assert len({item["source"]["sha256"] for item in assets}) == 8
    assert all(item["source"]["bytes"] > 0 for item in assets)
    assert all(len(item["source"]["git_blob_sha1"]) == 40 for item in assets)
    assert all(len(item["source"]["sha256"]) == 64 for item in assets)

    expected_order = [
        f"{semantic_id}/tier-{tier}"
        for semantic_id in EXPECTED_SEMANTIC_IDS
        for tier in EXPECTED_TIERS
    ]
    assert membership["exact_linked_instance_order"] == expected_order
    assert len(expected_order) == 24
    assert len(set(expected_order)) == 24

    assert inventory["state"] == "SOURCE_BYTES_VERIFIED"
    assert inventory["asset_hashes_verified"] == {"passed": 8, "total": 8}
    assert inventory["fallback_assets_used"] == 0
    assert inventory["guessed_assets_used"] == 0
    assert inventory["generic_medallions_used"] == 0
    assert [item["semantic_id"] for item in inventory["visual_assets"]] == EXPECTED_SEMANTIC_IDS

    assert measurements["root"]["width"] == 2176
    assert measurements["root"]["height"] == 1160
    assert measurements["template"]["id"] == "FOUNDATION_ASSET_GRID_DENSE_V2"
    assert measurements["template"]["columns"] == 6
    assert measurements["template"]["cells"] == 8
    assert len(measurements["cells"]) == 8
    assert measurements["overlap_pairs"] == []
    assert measurements["content_outside_root"] == []
    assert measurements["clipping_violations"] == []
    linked = [entry for cell in measurements["cells"] for entry in cell["linked_specimens"]]
    assert len(linked) == 24
    assert [entry["order"] for entry in linked] == list(range(1, 25))
    assert [entry["tier"] for entry in linked] == EXPECTED_TIERS * 8

    assert 'width="2176" height="1160"' in svg
    assert 'data-template="FOUNDATION_ASSET_GRID_DENSE_V2"' in svg
    assert svg.count('data-medallion-cell="') == 8
    assert svg.count('data-role="master"') == 8
    assert svg.count('data-linked-instance="true"') == 24
    assert svg.count('href="data:image/') == 32
    assert "placeholder" not in svg.lower()
    assert "generic-medallion" not in svg.lower()
    assert "fallback" not in svg.lower()
    for semantic_id in EXPECTED_SEMANTIC_IDS:
        assert semantic_id in svg

    gates = validation["gates"]
    assert validation["state"] == "F0_ATLAS_R2_MEDALLION_SOURCE_EVIDENCE_READY"
    assert gates["visual_assets"] == {"passed": 8, "result": "PASS", "total": 8}
    assert gates["placeholder_cells"] == {"count": 0, "result": "PASS"}
    assert gates["empty_asset_wells"] == {"count": 0, "result": "PASS"}
    assert gates["asset_hashes_verified"] == {"passed": 8, "result": "PASS", "total": 8}
    assert gates["linked_instances"] == {"count": 24, "result": "PASS"}
    assert gates["overlaps"] == {"count": 0, "result": "PASS"}
    assert gates["clipping"] == {"count": 0, "result": "PASS"}
    assert gates["content_outside_root"] == {"count": 0, "result": "PASS"}
    assert gates["deterministic_regeneration"] == "PASS"
    assert gates["atlas_r2_page_geometry"] == "PASS"
    assert gates["dense_template_preserved"] == "PASS"
    assert gates["fallback_assets"] == {"count": 0, "result": "PASS"}
    assert gates["guessed_assets"] == {"count": 0, "result": "PASS"}
    assert gates["generic_medallions"] == {"count": 0, "result": "PASS"}
    assert validation["render"]["svg"]["width"] == 2176
    assert validation["render"]["svg"]["height"] == 1160
    assert validation["render"]["png"]["width"] == 2176
    assert validation["render"]["png"]["height"] == 1160
    assert validation["penpot_reads"] == 0
    assert validation["penpot_mutations"] == 0
    assert validation["broad_packages_created"] == 0

    print("F0_ATLAS_R2_MEDALLION_SOURCE_EVIDENCE_TEST_PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Freeze the reviewed September 2026 PreviewEvent diagnostic corpus.

The input is the exact JSON emitted by Astro's production preview exporter.
The script deliberately keeps the general EventCard corpus separate from any
route-specific factual projection (for example, the free-events collection).
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import urllib.request
from pathlib import Path
from typing import Any


ORDER = [2182, 6711, 7609, 8006, 8200, 7907, 6942, 7020]
FREE_PROJECTION = [2182, 6711, 7609, 8006, 8200]
COVERAGE = {
    2182: ["active-september", "landscape-crop-safe", "visual-only", "single-image", "admission-free"],
    6711: ["active-september", "four-three-visual", "landscape-crop-safe", "visual-only", "multi-image", "admission-free"],
    7907: ["active-september", "landscape-document", "ocr-protected", "multi-image", "mixed-ocr-visual", "admission-free", "long-title"],
    7609: ["active-september", "square-poster", "ocr-protected", "multi-image", "admission-free"],
    8006: ["early-september", "portrait-poster", "ocr-protected", "single-image", "admission-free"],
    8200: ["early-september", "program-document", "six-seven-poster", "ocr-protected", "single-image", "admission-free"],
    6942: ["mid-september", "four-five-poster", "ocr-protected", "legacy-cdn-bundled", "admission-price"],
    7020: ["late-september", "portrait-poster", "ocr-protected", "multi-image", "mixed-media-gallery", "admission-price"],
}
REPOSITORY_SHA = "8710e56fa3685f6c30a90cd062d532dce0348cce"
BUILD_ID = "golden-event-corpus-v2-20260829"
REFERENCE_CLOCK = {
    "current_date": "2026-08-29",
    "reference_iso": "2026-08-29T14:00:00+02:00",
    "timezone": "Europe/Kaliningrad",
}
SURFACES = [
    "event-detail", "date-listing", "today", "tomorrow", "weekend", "home",
    "popular", "unusual", "search", "favorites", "personal-feed", "related",
]


def canonical_bytes(value: Any) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode()


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def download(url: str) -> tuple[bytes, str | None, str]:
    request = urllib.request.Request(url, headers={"User-Agent": "Lovekgd-Golden-Corpus/2"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read(), response.headers.get("Cache-Control"), response.headers.get_content_type()


def build(source_path: Path, output: Path) -> None:
    raw = source_path.read_bytes()
    source = json.loads(raw)
    events = {int(row["id"]): row for row in source["events"]}
    if set(ORDER) - set(events):
        raise SystemExit(f"source export is missing ids: {sorted(set(ORDER) - set(events))}")
    snapshot_sha = source["build"]["catalog_revision"]
    extracted_at = source["build"]["generated_at"]
    snapshot = {"kind": "preview-export-catalog-revision", "sha256": snapshot_sha}

    fixture_rows = []
    asset_rows = []
    for event_id in ORDER:
        event = events[event_id]
        active_end = event.get("end_date") or event["start_date"]
        if event["start_date"] > "2026-09-30" or active_end < "2026-09-01":
            raise SystemExit(f"event {event_id} is not active in the reviewed September window")
        if not event.get("image_url") or not event.get("image_assets"):
            raise SystemExit(f"event {event_id} has no normalized public image")
        fixture_id = f"event.real.{event_id}"
        payload_path = f"events/{fixture_id}.json"
        preview_sha = sha256_bytes(canonical_bytes(event))
        identity = {
            "schema_version": "ui-reference-event.v2",
            "fixture_id": fixture_id,
            "event_id": event_id,
            "source_prod_id": int(event["source_prod_id"]),
            "slug": event["slug"],
            "source_repository_sha": REPOSITORY_SHA,
            "source_static_build_id": BUILD_ID,
            "source_snapshot": snapshot,
            "extracted_at": extracted_at,
            "preview_event_sha256": preview_sha,
            "payload_path": payload_path,
            "coverage_tags": COVERAGE[event_id],
        }
        write_json(output / payload_path, {**identity, "preview_event": event})
        fixture_rows.append(identity)

        for index, asset in enumerate(event["image_assets"]):
            url = asset["src"]
            body, cache_control, mime_type = download(url)
            byte_sha = sha256_bytes(body)
            content_key_match = re.search(r"/p/image/v2/[a-f0-9]{2}/([a-f0-9]{64})\.webp$", url)
            immutable = bool(content_key_match and content_key_match.group(1) == byte_sha)
            bundle_relpath = None
            if not immutable:
                bundle_relpath = f"assets/{byte_sha}.webp"
                bundle_path = output / bundle_relpath
                bundle_path.parent.mkdir(parents=True, exist_ok=True)
                bundle_path.write_bytes(body)
            asset_rows.append({
                "asset_id": f"asset.sha256.{byte_sha}",
                "bundle_relpath": bundle_relpath,
                "byte_length": len(body),
                "cache_control": cache_control,
                "cdn_path_content_key": content_key_match.group(1) if content_key_match else None,
                "event_id": event_id,
                "fixture_id": fixture_id,
                "height": int(asset["height"]),
                "local_cache_relpath": f"cache/{byte_sha}.webp",
                "mime_type": mime_type,
                "resolved_url": url,
                "role": "primary" if index == 0 else "gallery",
                "sha256": byte_sha,
                "source_url": url,
                "storage_mode": "immutable-cdn" if immutable else "git-content-addressed-bundle",
                "width": int(asset["width"]),
            })

    manifest = {
        "assets": sorted(asset_rows, key=lambda row: (row["event_id"], 0 if row["role"] == "primary" else 1, row["source_url"])),
        "corpus_id": "ui-reference-events.v2",
        "schema_version": "ui-reference-assets-manifest.v1",
        "verification_policy": "download-exact-bytes-and-sha256-before-render",
    }
    manifest["assets_manifest_sha256"] = sha256_bytes(canonical_bytes(manifest))
    write_json(output / "assets-manifest.json", manifest)

    surface = {
        "schema_version": "ui-surface-expectations.v1",
        "corpus_id": "ui-reference-events.v2",
        "reference_clock": REFERENCE_CLOCK,
        "surface_classes": SURFACES,
        "scenarios": [
            {
                "scenario_id": f"v2.e{event_id}.event-detail",
                "fixture_id": f"event.real.{event_id}",
                "surface_id": "event-detail",
                "route": f"/sobytiya/{events[event_id]['slug']}/",
                "context": {"fixture_role": "general-diagnostic-not-route-taxonomy"},
                "expected_presence": "present",
                "expected_component": "event.detail",
                "expected_state_key": None,
                "expected_order_or_group": None,
                "reason": "Every frozen public PreviewEvent has a canonical detail route; route-specific collections require separate factual projections.",
            }
            for event_id in ORDER
        ],
    }
    write_json(output / "surface-expectations.json", surface)

    projection = {
        "schema_version": "ui-reference-event-projection.v1",
        "projection_id": "free-collection-september.v1",
        "corpus_id": "ui-reference-events.v2",
        "route": "/podborki/besplatnye-sobytiya/",
        "reference_window": {
            "active_from": "2026-09-01",
            "active_to": "2026-09-30",
            "timezone": "Europe/Kaliningrad",
        },
        "factual_predicates": [
            "preview_event.ticket.is_free == true",
            "preview_event.lifecycle_status == active",
            "preview_event.image_url is normalized static CDN media",
        ],
        "fixture_input_order": [f"event.real.{event_id}" for event_id in FREE_PROJECTION],
        "expected_groups": {
            "events": ["event.real.8006", "event.real.8200"],
            "exhibitions": ["event.real.2182", "event.real.6711", "event.real.7609"],
        },
        "coverage_requirements": [
            "multiple-landscape-visual-aspect-ratios",
            "square-ocr-poster",
            "portrait-ocr-poster",
            "program-document",
            "single-and-multi-image",
            "visual-only-and-ocr-protected",
        ],
        "explicit_exclusions": [
            {
                "reason": "Do not use the repeated green Chernyakhovsk programme poster: it makes unrelated cards look duplicated and destroys diagnostic diversity.",
                "asset_keys": [
                    "3f02c57279fb894be9b734b9cf3f39de134d64292bf3cac43cc9506243b696f0",
                    "4717a8978f46b70f3c2a6220f83157c9f041375c936ba1e5c2e4863791cd923e",
                    "e76bd4b631c6c03700dcfef1817c65cfe8acc4f3212b74af747dbcd50a3593dd",
                    "41bf6f47f7c5e81fff221a2844d08fe3118e3f0f0c7499f4bf94c31ea96e0db8",
                ],
            }
        ],
        "selection_rule": "Choose the smallest factual-free September-active subset that maximizes EventCard media-state and aspect-ratio coverage; never choose five homogeneous posters merely because they are recent.",
    }
    write_json(output / "projections/free-collection-september.v1.json", projection)

    corpus = {
        "assets_manifest_path": "assets-manifest.json",
        "corpus_id": "ui-reference-events.v2",
        "fixtures": fixture_rows,
        "immutable": True,
        "purpose": "cross-surface-event-card-visual-diagnostics",
        "reference_clock": REFERENCE_CLOCK,
        "projection_paths": ["projections/free-collection-september.v1.json"],
        "schema_version": "ui-reference-event-corpus.v2",
        "source": {
            "repository": "onedayonemasterpiece/events-bot-new",
            "repository_sha": REPOSITORY_SHA,
            "static_build_id": BUILD_ID,
            "snapshot": {**snapshot, "scope": "bounded-production-slice"},
            "preview_export_sha256": sha256_bytes(raw),
            "preview_contract": "PreviewEvent",
        },
        "surface_expectations_path": "surface-expectations.json",
        "version": "v2",
    }
    corpus["corpus_sha256"] = sha256_bytes(canonical_bytes(corpus))
    write_json(output / "corpus.json", corpus)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-export", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    build(args.source_export, args.output)


if __name__ == "__main__":
    main()

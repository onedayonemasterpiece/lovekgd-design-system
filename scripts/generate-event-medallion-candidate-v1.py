#!/usr/bin/env python3
"""Generate the candidate event-medallion inventory from an exact events-bot-new Git tree."""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import pathlib
import re
import subprocess
from typing import Any

SOURCE_COMMIT = "a68c7f23c4e014c6e9f66e95f394656e9cb0f411"
OUTPUT = pathlib.Path("catalog/normalization/families/event-preview-representations/event-medallion-candidate-v1.json")
REGISTRIES = (
    ("organizer", "site/src/data/organizerMedallions.json"),
    ("festival", "site/src/data/festivalMedallions.json"),
)
SPECIALS = (
    {
        "stable_id": "medallion.source.meow-afisha",
        "binding": {"kind": "source", "slug": "meow-afisha"},
        "name": "MEOW AFISHA",
        "category": "special",
        "semantic_facet": "source",
        "avatarUrl": "/assets/sources/meow-afisha.webp",
        "fallbackPngUrl": "/assets/sources/meow-afisha.png",
        "sourcePath": "site/src/assets/sources/meow-afisha.telegram-avatar-20260701.jpg",
        "assetFormat": "webp+png",
    },
    {
        "stable_id": "medallion.program.rzd-lastochka",
        "binding": {"kind": "program", "slug": "rzd-lastochka"},
        "name": "РЖД Ласточка",
        "category": "special",
        "semantic_facet": "transport_program",
        "avatarUrl": "/assets/transport/rzd-lastochka-medallion.webp",
        "fallbackPngUrl": "/assets/transport/rzd-lastochka-medallion.png",
        "sourcePath": "site/src/assets/transport/source/kppk-lastochka.png",
        "assetFormat": "webp+png",
    },
    {
        "stable_id": "medallion.payment.pushkin-card",
        "binding": {"kind": "payment", "slug": "pushkin-card"},
        "name": "Пушкинская карта",
        "category": "special",
        "semantic_facet": "payment",
        "avatarUrl": "/assets/badges/pushkin-card-medallion.webp",
        "fallbackPngUrl": "/assets/badges/pushkin-card-medallion.png",
        "sourcePath": "site/src/assets/badges/source/pushkin-card.item_2637.jpg",
        "assetFormat": "composite-webp+png",
    },
    {
        "stable_id": "medallion.admission.free",
        "binding": {"kind": "admission", "slug": "free"},
        "name": "Бесплатно",
        "category": "special",
        "semantic_facet": "admission",
        "avatarUrl": "/assets/badges/free-listing-medallion.svg",
        "fallbackPngUrl": None,
        "sourcePath": None,
        "assetFormat": "svg",
    },
)


def git_bytes(repo: pathlib.Path, commit: str, path: str) -> bytes:
    return subprocess.check_output(["git", "-C", str(repo), "show", f"{commit}:{path}"])


def public_path(url: str) -> str:
    return "site/public" + url.split("?", 1)[0]


def dimensions(data: bytes, path: str) -> dict[str, Any]:
    if path.endswith(".svg"):
        text = data.decode("utf-8", "replace")[:5000]
        viewbox = re.search(r"viewBox\s*=\s*['\"]([^'\"]+)", text, re.I)
        width = re.search(r"\bwidth\s*=\s*['\"]([0-9.]+)", text, re.I)
        height = re.search(r"\bheight\s*=\s*['\"]([0-9.]+)", text, re.I)
        result: dict[str, Any] = {}
        if viewbox:
            result["view_box"] = viewbox.group(1)
            parts = viewbox.group(1).replace(",", " ").split()
            if len(parts) == 4:
                result.update(width=float(parts[2]), height=float(parts[3]))
        elif width and height:
            result.update(width=float(width.group(1)), height=float(height.group(1)))
        return result
    try:
        from PIL import Image

        with Image.open(io.BytesIO(data)) as image:
            return {"width": image.width, "height": image.height}
    except Exception:
        return {"status": "dimension-unavailable"}


def asset_record(repo: pathlib.Path, commit: str, url: str | None) -> dict[str, Any] | None:
    if not url:
        return None
    path = public_path(url)
    data = git_bytes(repo, commit, path)
    return {
        "url": url,
        "repo_path": path,
        "sha256": hashlib.sha256(data).hexdigest(),
        "byte_length": len(data),
        "dimensions": dimensions(data, path),
        "extension": pathlib.PurePosixPath(path).suffix.lower().lstrip("."),
    }


def stable_hash(document: dict[str, Any]) -> str:
    clone = dict(document)
    clone.pop("contract_payload_sha256", None)
    payload = json.dumps(clone, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    return hashlib.sha256(payload).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--events-repo", default="/home/dev/projects/events-bot-new")
    parser.add_argument("--commit", default=SOURCE_COMMIT)
    parser.add_argument("--root", default=".")
    args = parser.parse_args()
    repo = pathlib.Path(args.events_repo).resolve()
    root = pathlib.Path(args.root).resolve()

    visuals: dict[str, dict[str, Any]] = {}
    bindings: list[dict[str, Any]] = []
    registry_evidence = []
    for kind, path in REGISTRIES:
        raw = git_bytes(repo, args.commit, path)
        registry = json.loads(raw)
        registry_evidence.append({
            "kind": kind,
            "path": path,
            "schema_version": registry["schemaVersion"],
            "sha256": hashlib.sha256(raw).hexdigest(),
            "record_count": len(registry["items"]),
        })
        for item in registry["items"]:
            stable_id = f"medallion.identity.{item['slug']}"
            binding = {
                "binding_id": f"{kind}:{item['slug']}",
                "stable_id": stable_id,
                "registry_kind": kind,
                "registry_path": path,
                "registry_schema_version": registry["schemaVersion"],
                "slug": item["slug"],
                "listing_status": item.get("listingStatus", "unset"),
                "listing_binding": item.get("listingBinding", "unset"),
                "category": item.get("category", "unset"),
            }
            bindings.append(binding)
            source_record = {"registry_kind": kind, "registry_path": path, "item": item}
            if stable_id in visuals:
                visuals[stable_id]["source_records"].append(source_record)
                visuals[stable_id]["binding_ids"].append(binding["binding_id"])
                if item.get("listingStatus") == "listing_ready":
                    visuals[stable_id]["effective_listing_status"] = "listing_ready"
                    visuals[stable_id]["effective_listing_binding"] = item.get("listingBinding", "unset")
                continue
            visuals[stable_id] = {
                "stable_id": stable_id,
                "name": item["name"],
                "short_name": item.get("shortName"),
                "category": item.get("category", "unset"),
                "semantic_facet": item.get("category", "unset"),
                "binding_ids": [binding["binding_id"]],
                "aliases": item.get("aliases", []),
                "aria_label": item.get("ariaLabel", item["name"]),
                "background": item.get("background"),
                "ring": item.get("ring"),
                "fit_box": item.get("fitBox"),
                "logo_crop": item.get("logoCrop"),
                "asset_format_claim": item.get("assetFormat", "manifest-format-absent"),
                "primary_asset": asset_record(repo, args.commit, item["avatarUrl"]),
                "fallback_asset": asset_record(repo, args.commit, item.get("fallbackPngUrl")),
                "source_path": item.get("sourcePath"),
                "source_page": item.get("sourcePage"),
                "source_url": item.get("sourceUrl"),
                "source_file": item.get("sourceFile"),
                "retrieved_at": item.get("retrievedAt"),
                "render_note": item.get("renderNote"),
                "effective_listing_status": item.get("listingStatus", "unset"),
                "effective_listing_binding": item.get("listingBinding", "unset"),
                "source_records": [source_record],
                "penpot_binding": {"status": "not-materialized", "page_id": None, "component_id": None},
            }

    for special in SPECIALS:
        stable_id = special["stable_id"]
        binding_id = f"{special['binding']['kind']}:{special['binding']['slug']}"
        bindings.append({
            "binding_id": binding_id,
            "stable_id": stable_id,
            "registry_kind": "special",
            "registry_path": None,
            "registry_schema_version": None,
            "slug": special["binding"]["slug"],
            "listing_status": "source-proven-special",
            "listing_binding": special["binding"]["kind"],
            "category": "special",
        })
        visuals[stable_id] = {
            "stable_id": stable_id,
            "name": special["name"],
            "short_name": None,
            "category": "special",
            "semantic_facet": special["semantic_facet"],
            "binding_ids": [binding_id],
            "aliases": [],
            "aria_label": special["name"],
            "background": None,
            "ring": None,
            "fit_box": None,
            "logo_crop": None,
            "asset_format_claim": special["assetFormat"],
            "primary_asset": asset_record(repo, args.commit, special["avatarUrl"]),
            "fallback_asset": asset_record(repo, args.commit, special.get("fallbackPngUrl")),
            "source_path": special.get("sourcePath"),
            "source_page": None,
            "source_url": None,
            "source_file": pathlib.PurePosixPath(special["sourcePath"]).name if special.get("sourcePath") else None,
            "retrieved_at": None,
            "render_note": "Source-proven special medallion; not an organizer/festival registry identity.",
            "effective_listing_status": "source-proven-special",
            "effective_listing_binding": special["binding"]["kind"],
            "source_records": [],
            "penpot_binding": {"status": "not-materialized", "page_id": None, "component_id": None},
        }

    document: dict[str, Any] = {
        "$schema": "../../../../contracts/normalization/event-medallion-candidate.v1.schema.json",
        "schema_version": "event-medallion-candidate.v1",
        "package_id": "candidate.event-medallion-collection-v1",
        "contract_version": "1.0.0-candidate.2",
        "contract_payload_sha256": "",
        "hash_scope": "whole-document-except-contract_payload_sha256",
        "lifecycle": "candidate",
        "authority_mode": "reconstructed",
        "canonical": False,
        "promotion_status": "not_promoted",
        "source_baseline": {
            "repository": "onedayonemasterpiece/events-bot-new",
            "exact_commit": args.commit,
            "registries": registry_evidence,
        },
        "counts": {"source_registry_records": 39, "bindings": len(bindings), "unique_visuals": len(visuals), "deduplicated_visuals": 1},
        "deduplication": {"stable_id": "medallion.identity.kaup", "binding_ids": ["organizer:kaup", "festival:kaup"], "policy": "one linked visual component with both exact registry bindings"},
        "consumer_frame_contract": {
            "component_id": "event.medallion-frame",
            "variant_axes": {
                "consumer": ["detail", "listing-card", "mobile-rail", "exhibition", "catalog"],
                "slot": ["inline", "top", "overlay", "side-rail", "rail-segment", "deck-seal"],
                "resolution": ["resolved", "conflicting-source", "ambiguous-venue", "empty"],
                "density": ["single", "multiple"],
                "interaction": ["rest", "hover", "focus"],
            },
            "source_geometries_px": {
                "detail_mobile": "84-92",
                "detail_desktop_inline": "72-94",
                "detail_top": "88-108",
                "listing_overlay_default": 64,
                "listing_overlay_weekend": 60,
                "listing_overlay_popular": 56,
                "listing_overlay_popular_mobile": 46,
                "listing_side_single": 60,
                "listing_side_multiple": 51,
                "listing_side_split": "48-52",
                "listing_side_popular_mobile": 40,
                "mobile_rail_slot": [94, 112],
                "mobile_rail_art": 86,
                "exhibition": 44,
            },
            "presentation_invariants": [
                "medallion artwork is circular and never receives a square white backing",
                "consumer slot/frame surfaces are transparent; only source-proven circular ring and artwork are visible",
                "rectangular dimensions describe a transparent placement slot, not a rounded-card background",
                "catalog empty is an explicitly labelled resolver state, never presented as a real medallion",
            ],
            "penpot_binding": {"status": "not-materialized", "page_id": None, "variant_container_id": None},
        },
        "resolver_contract": {
            "states": ["resolved", "conflicting-source", "ambiguous-venue", "empty"],
            "fallback_order": ["exact festival binding", "exact venue/organizer binding", "declared fallback asset", "empty non-identity state"],
            "forbidden_promotions": ["ordinary icon", "price pill", "sold-out pill", "kids pill", "charity pill", "festival text pill"],
        },
        "bindings": bindings,
        "visuals": list(visuals.values()),
        "penpot_collection": {"page_name": "48 — Event medallions · Candidate collection v1", "page_id": None, "status": "not-materialized"},
    }
    document["contract_payload_sha256"] = stable_hash(document)
    output = root / OUTPUT
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"output": str(output), "bindings": len(bindings), "unique_visuals": len(visuals), "hash": document["contract_payload_sha256"]}, indent=2))


if __name__ == "__main__":
    main()

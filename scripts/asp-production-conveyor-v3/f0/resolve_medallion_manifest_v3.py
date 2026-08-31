#!/usr/bin/env python3
"""Schema-exact resolver for event-medallion-candidate.v1.

The donor manifest already owns the normalized visual records and binding map.
This resolver consumes only `visuals[*].primary_asset` and `bindings[*]`, never
old Penpot UUIDs or fallback raster assets.
"""

from __future__ import annotations

from typing import Any

MEDIA_TYPES = {
    "svg": "image/svg+xml",
    "png": "image/png",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "webp": "image/webp",
    "avif": "image/avif",
}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def resolve_manifest(
    manifest: dict[str, Any], registry: dict[str, Any]
) -> dict[str, Any]:
    require(
        manifest.get("schema_version") == "event-medallion-candidate.v1",
        "wrong donor manifest schema",
    )
    counts = manifest.get("counts", {})
    expected = registry["expected_inventory"]
    require(
        counts.get("source_registry_records") == expected["records"],
        "record count mismatch",
    )
    require(counts.get("bindings") == expected["consumer_bindings"], "binding count mismatch")
    require(counts.get("unique_visuals") == expected["unique_visuals"], "visual count mismatch")

    raw_visuals = manifest.get("visuals")
    raw_bindings = manifest.get("bindings")
    require(isinstance(raw_visuals, list), "visuals must be a list")
    require(isinstance(raw_bindings, list), "bindings must be a list")
    require(len(raw_visuals) == expected["unique_visuals"], "visual list length mismatch")
    require(len(raw_bindings) == expected["consumer_bindings"], "binding list length mismatch")

    visuals: list[dict[str, Any]] = []
    by_asset_id: dict[str, dict[str, Any]] = {}
    binding_owner: dict[str, str] = {}
    for raw in raw_visuals:
        asset_id = raw.get("stable_id")
        primary = raw.get("primary_asset")
        require(isinstance(asset_id, str) and asset_id, "visual missing stable_id")
        require(asset_id not in by_asset_id, f"duplicate visual stable_id: {asset_id}")
        require(isinstance(primary, dict), f"{asset_id}: primary_asset missing")
        source_path = primary.get("repo_path")
        sha256 = primary.get("sha256")
        byte_length = primary.get("byte_length")
        extension = str(primary.get("extension", "")).lower()
        require(isinstance(source_path, str) and source_path, f"{asset_id}: repo_path")
        require(isinstance(sha256, str) and len(sha256) == 64, f"{asset_id}: sha256")
        require(isinstance(byte_length, int) and byte_length > 0, f"{asset_id}: byte_length")
        require(extension in MEDIA_TYPES, f"{asset_id}: extension")
        binding_ids = raw.get("binding_ids")
        require(isinstance(binding_ids, list) and binding_ids, f"{asset_id}: binding_ids")
        require(len(binding_ids) == len(set(binding_ids)), f"{asset_id}: duplicate binding")
        for binding_id in binding_ids:
            require(isinstance(binding_id, str) and binding_id, f"{asset_id}: invalid binding")
            require(binding_id not in binding_owner, f"duplicate binding owner: {binding_id}")
            binding_owner[binding_id] = asset_id

        resolved = {
            "asset_id": asset_id,
            "source_path": source_path,
            "sha256": sha256,
            "git_blob_sha1": None,
            "bytes": byte_length,
            "media_type": MEDIA_TYPES[extension],
            "intrinsic_size": primary.get("dimensions"),
            "consumer_bindings": list(binding_ids),
            "consumer_size_tiers_px": list(expected["consumer_size_tiers_px"]),
            "background": raw.get("background"),
            "ring": raw.get("ring"),
            "fit_box": raw.get("fit_box"),
            "logo_crop": raw.get("logo_crop"),
            "aria_label": raw.get("aria_label"),
            "category": raw.get("category"),
            "provenance": {
                "classification": "REUSE_CANONICAL_DATA",
                "manifest_stable_id": asset_id,
                "manifest_primary_asset_only": True,
                "fallback_asset_used": False,
                "old_penpot_binding_ignored": True,
            },
            "licence_or_reuse_status": {
                "status": "RETAIN_DONOR_RECORD_AND_CURRENT_PROJECT_REUSE_SCOPE",
                "source_page": raw.get("source_page"),
                "source_url": raw.get("source_url"),
                "retrieved_at": raw.get("retrieved_at"),
            },
            "owner_disposition": "APPROVED_CURRENT_ASTRO_AS_IS_REFERENCE_BY_F0_2026-08-31",
        }
        visuals.append(resolved)
        by_asset_id[asset_id] = resolved

    bindings: list[dict[str, Any]] = []
    seen_binding_ids: set[str] = set()
    for raw in raw_bindings:
        binding_id = raw.get("binding_id")
        asset_id = raw.get("stable_id")
        require(isinstance(binding_id, str) and binding_id, "binding missing binding_id")
        require(isinstance(asset_id, str) and asset_id, f"{binding_id}: stable_id")
        require(binding_id not in seen_binding_ids, f"duplicate binding_id: {binding_id}")
        require(asset_id in by_asset_id, f"{binding_id}: unknown visual {asset_id}")
        require(binding_owner.get(binding_id) == asset_id, f"{binding_id}: visual binding mismatch")
        seen_binding_ids.add(binding_id)
        bindings.append(
            {
                "binding_id": binding_id,
                "asset_id": asset_id,
                "asset_sha256": by_asset_id[asset_id]["sha256"],
                "registry_kind": raw.get("registry_kind"),
                "registry_path": raw.get("registry_path"),
                "slug": raw.get("slug"),
                "category": raw.get("category"),
                "listing_status": raw.get("listing_status"),
                "listing_binding": raw.get("listing_binding"),
            }
        )

    require(seen_binding_ids == set(binding_owner), "visual/binding coverage mismatch")
    require(len({item["sha256"] for item in visuals}) == expected["unique_visuals"], "visual hash uniqueness mismatch")
    dedup = manifest.get("deduplication", {})
    require(dedup.get("stable_id") == "medallion.identity.kaup", "Kaup dedup identity drift")
    require(set(dedup.get("binding_ids", [])) == {"organizer:kaup", "festival:kaup"}, "Kaup binding drift")

    return {
        "resolver": "event-medallion-candidate-v1-primary-asset-resolver.v3",
        "records_count": counts["source_registry_records"],
        "consumer_binding_count": len(bindings),
        "unique_visual_count": len(visuals),
        "visuals": sorted(visuals, key=lambda item: item["asset_id"]),
        "bindings": sorted(bindings, key=lambda item: item["binding_id"]),
        "expected": expected,
        "fallback_assets_used": 0,
        "old_penpot_bindings_used": 0,
    }


def build_resolver() -> Any:
    return resolve_manifest

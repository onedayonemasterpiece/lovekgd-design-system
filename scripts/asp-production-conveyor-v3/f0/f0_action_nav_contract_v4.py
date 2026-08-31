#!/usr/bin/env python3
"""Exact-byte current-target helpers for F-ACTION-NAV-ICONS revision 4."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

CURRENT_FILE_ID = "40e06342-8830-80d6-8008-8fc8a3a4cd4f"
EXPECTED_ASSET_VARIANTS = {
    ("icon.action.not_interested", "default"),
    ("icon.action.calendar_add", "default"),
    ("icon.action.share", "default"),
    ("icon.action.favorite", "outline"),
    ("icon.action.favorite", "solid"),
    ("icon.navigation.afisha", "default"),
    ("icon.navigation.dates", "default"),
    ("icon.navigation.search", "default"),
    ("icon.navigation.personal", "default"),
}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def identity(data: bytes) -> dict[str, Any]:
    return {
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "git_blob_sha1": hashlib.sha1(
            f"blob {len(data)}\0".encode("ascii") + data
        ).hexdigest(),
    }


def stable_digest(value: Any) -> str:
    volatile = {
        "revision", "created_at", "updated_at", "timestamp",
        "started_at", "completed_at"
    }

    def clean(item: Any) -> Any:
        if isinstance(item, dict):
            return {
                key: clean(val)
                for key, val in sorted(item.items())
                if key not in volatile
            }
        if isinstance(item, list):
            return [clean(val) for val in item]
        return item

    return hashlib.sha256(
        json.dumps(clean(value), ensure_ascii=False, sort_keys=True).encode("utf-8")
    ).hexdigest()


def verify_file_identity(
    repo: Path, descriptor: dict[str, Any], label: str
) -> dict[str, Any]:
    data = (repo / descriptor["path"]).read_bytes()
    actual = identity(data)
    for field in ("git_blob_sha1", "bytes"):
        require(actual[field] == descriptor[field], f"{label}: {field} mismatch")
    if descriptor.get("sha256"):
        require(actual["sha256"] == descriptor["sha256"], f"{label}: sha256 mismatch")
    return actual


def validate_model(package: dict[str, Any]) -> dict[str, Any]:
    require(package.get("package_id") == "F-ACTION-NAV-ICONS", "wrong package")
    require(package.get("revision") == 4, "wrong revision")
    require(package.get("status") == "READY_FOR_D0_INTEGRATE", "wrong state")
    target = package["target_penpot_page"]
    protected = package["protected_surface"]
    require(target["file_id"] == CURRENT_FILE_ID, "stale Penpot target")
    require(protected["file_id"] == CURRENT_FILE_ID, "protected file mismatch")
    require(target["exact_name"] != protected["page_name"], "candidate page collision")
    require(
        target["candidate_label"] == "CANDIDATE_BUILD_NOT_ACCEPTED",
        "candidate label missing",
    )
    require(target["old_penpot_id_reuse_allowed"] is False, "old UUID allowed")
    require(protected["mutation_allowed"] is False, "protected mutation allowed")

    assets = package["assets_and_hashes"]
    variants = {(item["asset_id"], item["variant"]) for item in assets}
    require(variants == EXPECTED_ASSET_VARIANTS, "asset variant coverage")
    require(len(assets) == 9, "expected nine exact SVG variants")
    for item in assets:
        require(item["reuse"] == "EXACT_V3_BYTES_UNCHANGED", f"{item['asset_id']}: redraw")
        require(len(item["git_blob_sha1"]) == 40, f"{item['asset_id']}: blob")
        require(len(item["sha256"]) == 64, f"{item['asset_id']}: SHA")
        require(item["bytes"] > 0, f"{item['asset_id']}: bytes")
    require(len(package["component_ids"]) == package["expected_components"] == 8, "components")
    states = package["specimen"]["states"]
    require(len(states) == package["expected_instances"] == 18, "instances")
    require(len(set(states)) == 18, "duplicate states")
    require(package["expected_roots"] == 1, "roots")
    require(
        package["adapter_contract"]["method_surface"]
        == [
            "read_document",
            "assert_active_lease",
            "ensure_page",
            "upsert_svg_component",
            "upsert_specimen",
            "validate",
            "export_png",
            "readback",
        ],
        "adapter method surface drift",
    )
    return {
        "asset_variants": 9,
        "components": 8,
        "instances": 18,
        "current_target": CURRENT_FILE_ID,
        "adapter_method_surface_preserved": True,
    }


def verify_repository_inputs(
    repo: Path, package: dict[str, Any]
) -> dict[str, Any]:
    source_v3 = verify_file_identity(repo, package["source_package_v3"], "source v3")
    registry = verify_file_identity(repo, package["asset_registry"], "asset registry")
    helper = verify_file_identity(repo, package["helper"], "helper")
    verified_assets: list[dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()
    for item in package["assets_and_hashes"]:
        key = (item["asset_id"], item["variant"])
        require(key not in seen, f"duplicate asset {key}")
        seen.add(key)
        data = (repo / item["path"]).read_bytes()
        actual = identity(data)
        for field in ("git_blob_sha1", "sha256", "bytes"):
            require(actual[field] == item[field], f"{key}: {field} mismatch")
        require(data.startswith(b"<svg "), f"{key}: not standalone SVG")
        require(data.endswith(b"</svg>\n"), f"{key}: non-LF canonical ending")
        verified_assets.append(
            {
                "asset_id": item["asset_id"],
                "variant": item["variant"],
                "path": item["path"],
                **actual,
            }
        )
    require(seen == EXPECTED_ASSET_VARIANTS, "asset verification coverage")
    return {
        "source_v3": source_v3,
        "asset_registry": registry,
        "helper": helper,
        "assets": verified_assets,
    }

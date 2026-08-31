#!/usr/bin/env python3
"""Exact asset helpers for F-BRANDBOOK-BASELINE revision 3."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import subprocess
from typing import Any

CURRENT_FILE_ID = "40e06342-8830-80d6-8008-8fc8a3a4cd4f"


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


def checkout_head(repo: Path) -> str:
    result = subprocess.run(
        ["git", "-C", str(repo), "rev-parse", "HEAD"],
        check=True,
        text=True,
        capture_output=True,
    )
    return result.stdout.strip()


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
    require(package.get("package_id") == "F-BRANDBOOK-BASELINE", "wrong package")
    require(package.get("revision") == 3, "wrong revision")
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
    require(protected["mutation_allowed"] is False, "protected mutation allowed")
    require(target["old_penpot_id_reuse_allowed"] is False, "old UUID allowed")

    assets = package["assets"]
    require(len(assets) == 3, "expected three exact brand assets")
    expected = {
        "brand.asset.primary-mark",
        "brand.asset.announcements-wordmark",
        "brand.asset.favicon-tag",
    }
    require({item["asset_id"] for item in assets} == expected, "asset coverage")
    for item in assets:
        require(len(item["sha256"]) == 64, f"{item['asset_id']}: SHA")
        require(len(item["git_blob_sha1"]) == 40, f"{item['asset_id']}: blob")
        require(item["bytes"] > 0, f"{item['asset_id']}: bytes")
        require(item["source_path"].startswith("site/"), f"{item['asset_id']}: path")
        require(item["transformation"] == "NONE", f"{item['asset_id']}: transformed")

    components = package["brand_components"]
    require(len(components) == package["expected_components"] == 5, "components")
    lockups = [item for item in components if item["kind"] == "lockup"]
    require(len(lockups) == 2, "desktop/mobile lockups required")
    for lockup in lockups:
        require(lockup["detached_assets"] is False, f"{lockup['id']}: detached")
        require(len(lockup["asset_ids"]) == 2, f"{lockup['id']}: linked assets")
    placements = package["specimen"]["placements"]
    require(len(placements) == package["expected_instances"] == 14, "instances")
    require(len({item["id"] for item in placements}) == 14, "duplicate placement")
    require(package["expected_roots"] == 1, "roots")
    return {
        "assets": 3,
        "components": 5,
        "lockups": 2,
        "instances": 14,
        "linked_asset_instances_required": 4,
        "current_target": CURRENT_FILE_ID,
    }


def verify_asset_checkout(
    asset_repo: Path, package: dict[str, Any]
) -> list[dict[str, Any]]:
    expected_commit = package["source_authority"]["asset_repository"]["commit"]
    actual_head = checkout_head(asset_repo)
    require(actual_head == expected_commit, f"asset checkout {actual_head} != {expected_commit}")
    verified = []
    for item in package["assets"]:
        data = (asset_repo / item["source_path"]).read_bytes()
        actual = identity(data)
        for field in ("git_blob_sha1", "sha256", "bytes"):
            require(
                actual[field] == item[field],
                f"{item['asset_id']}: {field} mismatch",
            )
        verified.append(
            {
                "asset_id": item["asset_id"],
                "source_path": item["source_path"],
                **actual,
            }
        )
    return verified

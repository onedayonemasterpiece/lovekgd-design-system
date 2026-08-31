#!/usr/bin/env python3
"""Exact dependency helpers for F-SHARED-FOUNDATION-BINDINGS revision 5."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import subprocess
from typing import Any

CURRENT_FILE_ID = "40e06342-8830-80d6-8008-8fc8a3a4cd4f"
EXPECTED_PRODUCERS = {
    "F-COPY-CHECK-ASSETS": 1,
    "F-FOUNDATIONS-SPECIMENS": 3,
    "F-MEDALLIONS-BRAND-ASSETS": 3,
    "F-TYPOGRAPHY-LAYOUT": 3,
    "F-BRANDBOOK-BASELINE": 3,
    "F-ACTION-NAV-ICONS": 4,
}
EXPECTED_COMPONENTS = {
    "foundation.binding.color",
    "foundation.binding.typography",
    "foundation.binding.spacing",
    "foundation.binding.radius",
    "foundation.binding.layout",
    "foundation.binding.motion",
    "foundation.binding.action-navigation-assets",
    "foundation.binding.copy-check-assets",
    "foundation.binding.medallion-assets",
    "foundation.binding.brand-assets",
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

    encoded = json.dumps(
        clean(value), ensure_ascii=False, sort_keys=True
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


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


def parse_checkout_specs(values: list[str]) -> dict[str, Path]:
    parsed: dict[str, Path] = {}
    for value in values:
        require("=" in value, f"invalid producer checkout: {value}")
        package_id, raw_path = value.split("=", 1)
        require(package_id in EXPECTED_PRODUCERS, f"unexpected producer {package_id}")
        require(package_id not in parsed, f"duplicate producer checkout {package_id}")
        path = Path(raw_path).resolve()
        require(path.is_dir(), f"producer checkout missing: {path}")
        parsed[package_id] = path
    require(
        set(parsed) == set(EXPECTED_PRODUCERS),
        f"producer checkout coverage: {set(EXPECTED_PRODUCERS)-set(parsed)}",
    )
    return parsed


def validate_model(package: dict[str, Any]) -> dict[str, Any]:
    require(
        package.get("package_id") == "F-SHARED-FOUNDATION-BINDINGS",
        "wrong package",
    )
    require(package.get("revision") == 5, "wrong revision")
    require(package.get("status") == "READY_FOR_D0_INTEGRATE", "wrong state")
    require(package.get("ready_to_publish") is False, "publish readiness leak")
    require(package.get("ready_to_promote") is False, "promotion readiness leak")

    producers = package["producer_packages"]
    actual = {item["package_id"]: item["revision"] for item in producers}
    require(actual == EXPECTED_PRODUCERS, "producer revision set drift")
    require(len(producers) == 6, "producer count")
    for item in producers:
        require(
            item["declared_state_at_freeze"] == "AWAITING_D0_INTEGRATE_PASS",
            f"{item['package_id']}: conditional PASS inherited",
        )
        require(len(item["head"]) == 40, f"{item['package_id']}: head")
        require(len(item["package_git_blob_sha1"]) == 40, f"{item['package_id']}: blob")
        require(item["package_bytes"] > 0, f"{item['package_id']}: bytes")
        require(bool(item["integration_request_id"]), f"{item['package_id']}: request")

    components = package["binding_components"]
    require({item["id"] for item in components} == EXPECTED_COMPONENTS, "component set")
    require(len(components) == package["expected_components"] == 10, "components")
    placements = package["specimen"]["placements"]
    require(len(placements) == package["expected_instances"] == 34, "instances")
    require(len({item["id"] for item in placements}) == 34, "duplicate placement")
    require(package["expected_roots"] == 1, "roots")

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

    require(
        package["adapter_contract"]["method_surface"]
        == [
            "read_document",
            "assert_active_lease",
            "ensure_page",
            "upsert_foundation_binding_component",
            "upsert_binding_specimen",
            "validate",
            "export_png",
            "readback",
        ],
        "adapter surface drift",
    )
    for defect in package["consumer_defect_boundaries"].values():
        require(defect["closed_by_this_package"] is False, "consumer defect closure leak")

    return {
        "producers": 6,
        "components": 10,
        "instances": 34,
        "current_target": CURRENT_FILE_ID,
        "dependency_state": "AWAITING_SIX_D0_INTEGRATE_PASS",
    }


def verify_shared_checkout(
    repo: Path, package: dict[str, Any]
) -> dict[str, Any]:
    return {
        key: verify_file_identity(repo, package[key], key)
        for key in ("source_package_v4", "helper", "runner", "tests")
    }


def verify_producer_checkouts(
    package: dict[str, Any], checkouts: dict[str, Path]
) -> list[dict[str, Any]]:
    verified: list[dict[str, Any]] = []
    by_id = {item["package_id"]: item for item in package["producer_packages"]}
    for package_id in sorted(EXPECTED_PRODUCERS):
        descriptor = by_id[package_id]
        checkout = checkouts[package_id]
        actual_head = checkout_head(checkout)
        require(
            actual_head == descriptor["head"],
            f"{package_id}: head {actual_head} != {descriptor['head']}",
        )
        package_path = checkout / descriptor["package_path"]
        data = package_path.read_bytes()
        actual_identity = identity(data)
        require(
            actual_identity["git_blob_sha1"]
            == descriptor["package_git_blob_sha1"],
            f"{package_id}: package blob mismatch",
        )
        require(
            actual_identity["bytes"] == descriptor["package_bytes"],
            f"{package_id}: package bytes mismatch",
        )
        parsed = json.loads(data)
        require(parsed.get("package_id") == package_id, f"{package_id}: parsed id")
        require(
            parsed.get("revision") == descriptor["revision"],
            f"{package_id}: parsed revision",
        )
        require(
            parsed.get("target_penpot_page", {}).get("file_id") == CURRENT_FILE_ID,
            f"{package_id}: stale producer target",
        )
        verified.append(
            {
                "package_id": package_id,
                "revision": descriptor["revision"],
                "branch": descriptor["branch"],
                "head": actual_head,
                "package_path": descriptor["package_path"],
                **actual_identity,
            }
        )
    return verified


def expected_receipt_tuple(descriptor: dict[str, Any]) -> dict[str, Any]:
    return {
        "branch": descriptor["branch"],
        "head": descriptor["head"],
        "path": descriptor["package_path"],
        "git_blob_sha1": descriptor["package_git_blob_sha1"],
        "bytes": descriptor["package_bytes"],
    }


def load_dependency_receipts(
    directory: Path, package: dict[str, Any]
) -> list[dict[str, Any]]:
    require(directory.is_dir(), f"receipt directory missing: {directory}")
    producers = {item["package_id"]: item for item in package["producer_packages"]}
    found: dict[str, dict[str, Any]] = {}
    for path in sorted(directory.glob("*.json")):
        receipt = json.loads(path.read_text(encoding="utf-8"))
        package_id = receipt.get("package_id")
        if package_id not in producers:
            continue
        descriptor = producers[package_id]
        require(
            receipt.get("marker") == "D0_INTEGRATION_RESULT_V2",
            f"{package_id}: wrong receipt marker",
        )
        require(
            receipt.get("request_id") == descriptor["integration_request_id"],
            f"{package_id}: request id mismatch",
        )
        require(receipt.get("verdict") == "PASS", f"{package_id}: not PASS")
        require(receipt.get("penpot_mutations") == 0, f"{package_id}: mutations")
        require(
            receipt.get("package_revision") == descriptor["revision"],
            f"{package_id}: receipt revision",
        )
        require(
            receipt.get("exact_package_tuple")
            == expected_receipt_tuple(descriptor),
            f"{package_id}: exact package tuple mismatch",
        )
        require(package_id not in found, f"{package_id}: duplicate PASS receipt")
        found[package_id] = {
            "package_id": package_id,
            "request_id": receipt["request_id"],
            "verdict": "PASS",
            "exact_package_tuple": receipt["exact_package_tuple"],
            "receipt_path": str(path),
            "receipt_identity": identity(path.read_bytes()),
        }
    require(
        set(found) == set(producers),
        f"missing D0 PASS receipts: {set(producers)-set(found)}",
    )
    return [found[package_id] for package_id in sorted(found)]

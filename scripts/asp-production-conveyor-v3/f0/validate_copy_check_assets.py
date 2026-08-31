#!/usr/bin/env python3
"""Fail-closed validation for the F0 copy/check asset closure package."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

EXTENSION = Path("contracts/assets/ui-copy-check-asset-registry.extension.v1.json")
ACTIVE_REGISTRY = Path("contracts/assets/ui-asset-registry.v1.yaml")

EXPECTED_BYTES = {
    "icon.action.copy": (
        "catalog/asp-production-conveyor-v3/f0/assets/controls/copy.svg",
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">\n'
        '  <rect x="8.5" y="8.5" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.8" />\n'
        '  <path d="M15.5 8.5V6.3a1.8 1.8 0 0 0-1.8-1.8H6.3a1.8 1.8 0 0 0-1.8 1.8v7.4a1.8 1.8 0 0 0 1.8 1.8h2.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />\n'
        "</svg>\n",
    ),
    "icon.status.check": (
        "catalog/asp-production-conveyor-v3/f0/assets/controls/check.svg",
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">\n'
        '  <path d="m5 12.5 4.25 4.25L19.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />\n'
        "</svg>\n",
    ),
}


def identity(data: bytes) -> dict[str, Any]:
    return {
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "git_blob_sha1": hashlib.sha1(
            f"blob {len(data)}\0".encode("ascii") + data
        ).hexdigest(),
    }


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", default=".")
    parser.add_argument("--emit")
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    extension_path = repo / EXTENSION
    registry_path = repo / ACTIVE_REGISTRY

    extension = json.loads(extension_path.read_text(encoding="utf-8"))
    require(
        extension["schema_version"]
        == "kenigevents.ui-copy-check-asset-registry-extension.v1",
        "wrong extension schema",
    )
    require(
        extension["status"] == "READY_FOR_D0_INTEGRATE",
        "extension is not ready for D0 integration",
    )
    require(
        extension["conversion_contract"]["fallback"] == "FORBIDDEN",
        "fallback must remain forbidden",
    )

    target = extension["central_registry_target"]
    actual_registry = identity(registry_path.read_bytes())
    for field in ("git_blob_sha1", "sha256"):
        require(
            actual_registry[field] == target[field],
            f"active registry drift: {field}",
        )

    assets = {item["asset_id"]: item for item in extension["assets"]}
    require(set(assets) == set(EXPECTED_BYTES), "asset coverage mismatch")

    checked: list[dict[str, Any]] = []
    for asset_id, (expected_path, expected_text) in EXPECTED_BYTES.items():
        item = assets[asset_id]
        require(item["materialization"]["path"] == expected_path, f"{asset_id}: path")
        require(item["source_git_blob_sha1"] == "68252498848a5fbc93dab20b5797504aeb6eb487", f"{asset_id}: source blob")
        require(item["astro_consumer"]["git_blob_sha1"] == "7f01708518e034c86ceb576f1dfdee849ea787be", f"{asset_id}: consumer blob")
        require(item["view_box_or_intrinsic_size"]["viewBox"] == "0 0 24 24", f"{asset_id}: viewBox")

        path = repo / expected_path
        data = path.read_bytes()
        require(data == expected_text.encode("utf-8"), f"{asset_id}: non-deterministic SVG bytes")
        actual = identity(data)
        declared = item["materialization"]
        for field in ("bytes", "sha256", "git_blob_sha1"):
            require(actual[field] == declared[field], f"{asset_id}: {field}")
        checked.append({"asset_id": asset_id, "path": expected_path, **actual})

    result = {
        "schema_version": "kenigevents.f0-copy-check-validation.v1",
        "marker": "F0_COPY_CHECK_ASSET_VALIDATION_PASS",
        "status": "PASS",
        "penpot_mutations": 0,
        "source_authority": extension["authority"],
        "active_registry": {**target, "actual_identity": actual_registry},
        "assets": checked,
        "next_gate": "D0_INTEGRATE_THEN_READY_TO_MATERIALIZE_CANDIDATE",
    }

    encoded = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.emit:
        Path(args.emit).write_text(encoded, encoding="utf-8")
    print(encoded, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

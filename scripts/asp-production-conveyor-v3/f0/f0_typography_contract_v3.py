#!/usr/bin/env python3
"""Exact contract helpers for F-TYPOGRAPHY-LAYOUT revision 3."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

CURRENT_FILE_ID = "40e06342-8830-80d6-8008-8fc8a3a4cd4f"

EXPECTED_LINE_HEIGHT_RATIOS = {
    "title": 1.08,
    "occurrence": 1.25,
    "place": 1.25,
    "event_type": 1.2,
    "admission": 1.15,
    "not_interested": 1.6,
    "calendar_share": 1.6,
    "like_count": 1.6,
}

EXPECTED_FONT_FACES = {
    "regular": {
        "family": "DejaVu Sans",
        "weight": 400,
        "bytes": 759720,
        "sha256": "ae7b7855e115a5966d8b1b3f80f254ccc117ec86f9965e202ee2940453837280",
    },
    "bold": {
        "family": "DejaVu Sans",
        "weight": 700,
        "bytes": 708920,
        "sha256": "5c1247acef7f2b8522a31742c76d6adcb5569bacc0be7ceaa4dc39dd252ce895",
    },
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
        "revision",
        "created_at",
        "updated_at",
        "timestamp",
        "started_at",
        "completed_at",
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


def validate_model(package: dict[str, Any]) -> dict[str, Any]:
    require(package.get("package_id") == "F-TYPOGRAPHY-LAYOUT", "wrong package")
    require(package.get("revision") == 3, "wrong revision")
    require(
        package.get("status") == "READY_FOR_D0_INTEGRATE",
        "package must remain integration-gated",
    )
    target = package["target_penpot_page"]
    protected = package["protected_surface"]
    require(target["file_id"] == CURRENT_FILE_ID, "stale Penpot target")
    require(protected["file_id"] == CURRENT_FILE_ID, "protected file mismatch")
    require(
        target["exact_name"] != protected["page_name"],
        "candidate page must be separate",
    )
    require(
        target["candidate_label"] == "CANDIDATE_BUILD_NOT_ACCEPTED",
        "candidate label missing",
    )
    require(protected["mutation_allowed"] is False, "protected mutation allowed")
    require(bool(protected["root_ids"]), "protected root IDs missing")

    typography = package["typography"]
    require(
        typography["semantic_css_family"].startswith("Inter,"),
        "semantic Inter-first stack lost",
    )
    require(
        typography["frozen_A_resolved_family"] == "DejaVu Sans",
        "frozen-A family drift",
    )
    require(
        typography["semantic_css_family"]
        != typography["frozen_A_resolved_family"],
        "semantic and resolved families must remain separate facts",
    )
    actual_ratios = {
        key: float(value)
        for key, value in typography["line_height_roles"].items()
    }
    require(actual_ratios == EXPECTED_LINE_HEIGHT_RATIOS, "line-height role drift")
    for role, ratio in actual_ratios.items():
        require(0.5 <= ratio <= 2.5, f"{role}: pixel-like lineHeight")
        require(
            str(typography["line_height_roles"][role]) not in {
                "23.328", "16.4", "17.2", "13.824", "13.8",
                "18.944", "20.992", "25.088"
            },
            f"{role}: raw pixel-like lineHeight retained",
        )

    for face, expected in EXPECTED_FONT_FACES.items():
        declared = package["font_binding"][face]
        for field in ("family", "weight", "bytes", "sha256"):
            require(
                declared[field] == expected[field],
                f"{face}: {field} drift",
            )
    require(
        package["font_binding"]["binaries_committed"] is False,
        "font binaries must not be committed",
    )
    wraps = typography["editable_cyrillic_wrap_specimens"]
    require(len(wraps) >= 6, "insufficient Cyrillic wrap specimens")
    for item in wraps:
        text = item["text"]
        require(item["editable"] is True, f"{item['id']}: not editable")
        require(any("А" <= ch <= "я" or ch in "Ёё" for ch in text), f"{item['id']}: no Cyrillic")
        require(int(item["frame_width_px"]) > 0, f"{item['id']}: invalid width")
        require(item["line_height_role"] in actual_ratios, f"{item['id']}: unknown role")

    components = package["specimen_components"]
    placements = package["specimen"]["placements"]
    require(len(components) == package["expected_components"] == 10, "component count")
    require(len(placements) == package["expected_instances"] == 51, "instance count")
    require(len({item["id"] for item in placements}) == 51, "duplicate placement")
    require(package["expected_roots"] == 1, "root count")
    boundary = package["eventcard_consumer_boundary"]
    require(boundary["owner"] == ["D0/MAT", "U0"], "R10 owner drift")
    require(boundary["closed_by_this_package"] is False, "consumer repair leak")
    require(boundary["active_tip_comment"] == 5481593090, "stale R10 boundary")

    return {
        "components": 10,
        "instances": 51,
        "line_height_roles": actual_ratios,
        "editable_cyrillic_wrap_specimens": len(wraps),
        "current_target": CURRENT_FILE_ID,
    }


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


def preflight_fonts(
    regular_path: Path, bold_path: Path, package: dict[str, Any]
) -> dict[str, Any]:
    results: dict[str, Any] = {}
    for face, path in (("regular", regular_path), ("bold", bold_path)):
        data = path.read_bytes()
        actual = identity(data)
        declared = package["font_binding"][face]
        require(actual["bytes"] == declared["bytes"], f"{face}: byte count mismatch")
        require(actual["sha256"] == declared["sha256"], f"{face}: SHA-256 mismatch")
        results[face] = {
            "path": str(path),
            "family": declared["family"],
            "weight": declared["weight"],
            **actual,
        }
    return {
        "verified": True,
        "before_any_text_mutation": True,
        "faces": results,
    }

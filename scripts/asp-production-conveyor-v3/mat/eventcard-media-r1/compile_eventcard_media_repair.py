#!/usr/bin/env python3
"""Compile the frozen EventCard media-only repair package.

The compiler reads both immutable inputs from their exact Git objects.  It
never reads or writes Penpot and never substitutes worktree-local input bytes.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve()
DEFAULT_REPO = HERE.parents[4]
REL = Path("catalog/asp-production-conveyor-v3/mat/eventcard-media-r1")
MANIFEST = REL / "MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1.manifest.v1.json"
PACKAGE = REL / "MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1.package.v1.json"
BUILD_REQUEST = REL / "ASP_BUILD_REQUEST_V2.json"


def canonical_bytes(value: Any) -> bytes:
    return (json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode()


def git(repo: Path, *args: str, binary: bool = False) -> bytes | str:
    data = subprocess.check_output(["git", *args], cwd=repo)
    return data if binary else data.decode().strip()


def load_git_input(repo: Path, spec: dict[str, Any]) -> dict[str, Any]:
    obj = f"{spec['head']}:{spec['path']}"
    raw = git(repo, "show", obj, binary=True)
    actual = {
        "bytes": len(raw),
        "git_blob_sha1": git(repo, "rev-parse", obj),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "tree": git(repo, "rev-parse", f"{spec['head']}^{{tree}}"),
    }
    for key, value in actual.items():
        if value != spec[key]:
            raise ValueError(f"IMMUTABLE_INPUT_{key.upper()}_MISMATCH:{spec['path']}:{value}")
    return json.loads(raw)


def compile_package(repo: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    manifest = json.loads((repo / MANIFEST).read_text())
    media = load_git_input(repo, manifest["immutable_inputs"][0])
    cases = load_git_input(repo, manifest["immutable_inputs"][1])

    case_by_fixture = {row["fixture_id"]: row for row in cases["variant_matrix"]}
    root_ids = media["terminal_identity"]["full_root_ids"]
    ordered_case_ids = [
        "eventcard.desktop-wide-calendar.8006",
        "eventcard.desktop-packed-calendar-absent.2182",
        "eventcard.mobile-wide-calendar.8006",
        "eventcard.mobile-packed-calendar-absent.2182",
    ]
    # Root order is frozen by terminal receipt 5481226456, while variant_matrix
    # order is source-owned and different.  Never infer this join by position.
    case_fixture = {
        ordered_case_ids[0]: "event.real.8006",
        ordered_case_ids[1]: "event.real.2182",
        ordered_case_ids[2]: "event.real.8006",
        ordered_case_ids[3]: "event.real.2182",
    }
    roots = []
    for root_id, case_id in zip(root_ids, ordered_case_ids, strict=True):
        fixture_id = case_fixture[case_id]
        source_case = next(row for row in cases["variant_matrix"] if row["case_id"] == case_id)
        if source_case is not case_by_fixture.get(fixture_id) and source_case["fixture_id"] != fixture_id:
            raise ValueError(f"CASE_FIXTURE_MISMATCH:{case_id}")
        roots.append({
            "case_id": case_id,
            "fixture_id": fixture_id,
            "root_id": root_id,
            "semantic_media_slot": "event.media-frame/image-content",
        })

    factual = {}
    for fixture_id, row in media["factual_media"].items():
        factual[fixture_id] = {
            "acceptance": row["acceptance"],
            "asset_path": row["asset_path"],
            "bytes": row["bytes"],
            "desktop_box": row["desktop_box"],
            "fit": row["fit"],
            "focal_position": row["focal_position"],
            "intrinsic_height": row["intrinsic_height"],
            "intrinsic_width": row["intrinsic_width"],
            "sha256": row["sha256"],
        }

    source_variants = media["required_native_probe"]["variants"]
    variants = [
        {"id": "A_current", "operation": "createShapeFromSvgWithImages_then_resize_place", "rank": 4, "source_input": source_variants["A_current"]},
        {"id": "B_no_post_import_resize", "operation": "createShapeFromSvgWithImages_at_final_dimensions_no_resize", "rank": 2, "source_input": source_variants["B_no_post_import_resize"]},
        {"id": "C_direct_native_fill", "operation": "uploadMediaData_then_createRectangle_fillImage", "rank": 1, "source_input": source_variants["C_direct_native_fill"]},
        {"id": "D_optional_minimal_import", "operation": "single_href_svg_at_final_dimensions_no_resize", "rank": 3, "source_input": source_variants["D_optional_minimal_import"]},
    ]
    if list(media["required_native_probe"]["variants"]) != [v["id"] for v in variants]:
        raise ValueError("ABCD_VARIANT_ORDER_OR_ID_MISMATCH")

    package = {
        "schema_version": "kenigevents.asp-mat-eventcard-media-coverage-repair.v1",
        "package_id": manifest["package_id"],
        "state": manifest["state"],
        "penpot_execution_authorized": False,
        "authority": {
            "contract": manifest["contract"],
            "authority_mode": media["source_a"]["authority_mode"],
            "source_a": media["source_a"],
        },
        "immutable_inputs": manifest["immutable_inputs"],
        "terminal_identity": {
            "file_id": cases["target_and_resume_contract"]["file_id"],
            "page_id": cases["target_and_resume_contract"]["page_id"],
            "collection_root_id": media["terminal_identity"]["collection_root_id"],
            "collection_children": 18,
            "local_components": 18,
            "validation": [],
            "roots": roots,
        },
        "factual_media": factual,
        "probe": {
            "accepted_root_mutation_before_pass": "FORBIDDEN",
            "all_outcomes_must_be_known": True,
            "disposable_outside_collection": True,
            "selection": "lowest rank variant passing both factual cases",
            "variants": variants,
        },
        "repair": {
            "apply_in_place_to_existing_media_shape_id": True,
            "allowed_changed_fields": ["fills", "plugin_data.media-construction-variant"],
            "atomic_rollback_on_any_failure": True,
            "idempotent_replay_mutations": 0,
            "preserve": [
                "all root, component, instance, text and media shape IDs",
                "all text fields and geometry",
                "all LibraryComponent.path values",
                "collection root, child order and 18/18 component census",
                "media box, parent coordinates, transform, rotation and flip",
                "source fit and focal semantics",
            ],
            "forbidden": manifest["scope"]["forbidden"],
        },
        "readback_contract": {
            "coverage_status": "KNOWN_PASS",
            "raw_fill_and_shape_same_complete_raster": True,
            "destination_coverage": "FULL_EXACT_MEDIA_BOX",
            "uncovered_pixel_count": 0,
            "opaque_non_source_overlay_count": 0,
            "event.real.8006": {"source_crop_normalized": ["0", "0", "1", "1"], "letterbox_pixels": 0},
            "event.real.2182": {
                "crop_axis": "horizontal",
                "focal": ["0.5", "0.5"],
                "source_crop_formula": "w=(box_width/box_height)/(intrinsic_width/intrinsic_height); x=(1-w)/2",
            },
            "unknown_or_missing_field": "STOP_ROLLBACK_NO_RETRY_NO_CONCEALMENT",
        },
        "executor": {
            "path": "scripts/asp-production-conveyor-v3/mat/eventcard-media-r1/eventcard_media_repair_v1.js",
            "entrypoint": "runEventcardMediaRepairV1",
            "runtime_authorization_required": True,
            "logical_writer": "/root/publish_r2",
        },
        "tests": {
            "native_like_harness": "tests/asp-production-conveyor-v3/mat/eventcard-media-r1/eventcard_media_repair_v1.test.js",
            "package": "tests/asp-production-conveyor-v3/mat/eventcard-media-r1/test_eventcard_media_package.py",
        },
    }
    build_request = {
        "schema_version": "ASP_BUILD_REQUEST_V2",
        "request_id": "MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1-QA-INTEGRATE",
        "package_id": manifest["package_id"],
        "from": "D0/MAT",
        "to": ["D0/QA", "D0/INTEGRATE"],
        "state": "MAT_PACKAGE_READY_QA_INTEGRATE_GATED",
        "operation": "VERIFY_EVENTCARD_MEDIA_ONLY_NATIVE_REPAIR",
        "penpot_execution_authorized": False,
        "immutable_inputs": manifest["immutable_inputs"],
        "required_checks": [
            "verify exact immutable Git bytes and deterministic package regeneration",
            "run strict native-like A/B/C/D harness including unknown-outcome rollback",
            "verify exact four existing roots and stable media/root/component/text IDs",
            "verify contain/cover/focal/crop and complete non-occluded destination coverage",
            "verify protected Free collection remains one root, 18 children and 18 components",
            "verify text and native component paths are byte-for-byte unchanged",
            "verify second replay reports zero mutations",
        ],
        "required_commands": [
            "python3 scripts/asp-production-conveyor-v3/mat/eventcard-media-r1/compile_eventcard_media_repair.py --repo . --check",
            "python3 -m unittest tests/asp-production-conveyor-v3/mat/eventcard-media-r1/test_eventcard_media_package.py",
            "node --test tests/asp-production-conveyor-v3/mat/eventcard-media-r1/eventcard_media_repair_v1.test.js",
        ],
        "success_transition": "QA_AND_INTEGRATE_MAY_REQUEST_SEPARATE_PUBLISH_AUTHORIZATION",
        "failure_policy": "STOP; accepted roots unchanged or atomically rolled back; publish counterexample readback; no retry, concealment, text or path mutation",
    }
    return package, build_request


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", type=Path, default=DEFAULT_REPO)
    ap.add_argument("--emit", type=Path)
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()
    repo = args.repo.resolve()
    package, build_request = compile_package(repo)
    package_bytes = canonical_bytes(package)
    request_bytes = canonical_bytes(build_request)
    if args.write:
        (repo / PACKAGE).write_bytes(package_bytes)
        (repo / BUILD_REQUEST).write_bytes(request_bytes)
    if args.check:
        for path, expected in ((PACKAGE, package_bytes), (BUILD_REQUEST, request_bytes)):
            actual = (repo / path).read_bytes()
            if actual != expected:
                print(f"DETERMINISTIC_REGEN_MISMATCH:{path}", file=sys.stderr)
                return 1
    if args.emit:
        args.emit.write_bytes(package_bytes)
    elif not args.write and not args.check:
        sys.stdout.buffer.write(package_bytes)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

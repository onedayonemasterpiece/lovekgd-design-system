#!/usr/bin/env python3
"""Deterministically regenerate the bounded EventCard component-path package."""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[4]
CATALOG = ROOT / "catalog/asp-production-conveyor-v3/mat/eventcard-component-paths-r1"
SCRIPT = ROOT / "scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/eventcard_component_paths_native_executor_r1.js"
PACKAGE_PATH = CATALOG / "MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-REPAIR-R1.package.v1.json"
REQUEST_PATH = CATALOG / "ASP_BUILD_REQUEST_V2.eventcard-native-component-paths-r1.json"
MANIFEST_PATH = CATALOG / "manifest.v1.json"

PACKAGE_ID = "MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-REPAIR-R1"
REQUEST_ID = "U0-EVENTCARD-NATIVE-PATHS-20260831-R1"
PATHS_INPUT = {
    "repository": "onedayonemasterpiece/lovekgd-design-system",
    "head": "9b63c901f90aacef3d1f555a22a7e2c1d3f01856",
    "tree": "2609ef4bd5152a47f47fbd287d74ae575d648326",
    "path": "catalog/asp-production-conveyor-v3/u0/U-EVENTCARD-NATIVE-COMPONENT-PATHS.package.v1.json",
    "git_blob_sha1": "e6aa7adec5b6fb5a191834e6e46f725fa3a9d77e",
    "bytes": 6384,
    "sha256": "15e6919487cd7cf0c9fef96907ea2c8249c54d6a00eab8a235422e0d23583895",
}
FOUR_CASES_INPUT = {
    "repository": "onedayonemasterpiece/lovekgd-design-system",
    "head": "c2d6ff107c632311d1c1d0cb1b74d7eb0a465b18",
    "tree": "ddff285e2a16f2f0590ac2964b27dedd853d4de8",
    "path": "catalog/asp-production-conveyor-v3/u0/U-EVENTCARD-FOUR-CASES.package.v1.json",
    "git_blob_sha1": "6496f9fdf2c19cce06c2a07d5b4d48061afe5522",
    "bytes": 20051,
    "sha256": "bf25934808144ba1a34c6676fdb4dd6147916713da783eaf7c7e50a61b196f81",
}
CONTRACT = {
    "id": "kenigevents.asp-conformance",
    "version": "1.0.0",
    "commit": "7607143afc240b9f96abd51270ab82735aabf9bc",
    "path": "docs/product-governance/astro-sot-penpot-conformance.md",
    "sha256": "75c70629f01f8d60fb98290fa2e6e8abc201fc84885339c16010bcd75ddd4289",
}

PATHS = {
    "desktop_leaves": "KenigEvents / EventCard / Leaves / Desktop",
    "mobile_leaves": "KenigEvents / EventCard / Leaves / Mobile",
    "desktop_cases": "KenigEvents / EventCard / Cases / Desktop",
    "mobile_cases": "KenigEvents / EventCard / Cases / Mobile",
}
COMPONENTS = [
    ("event.media-frame.desktop.8006", "desktop_leaves", "leaf", None, None),
    ("event.meta.event-type.desktop.8006", "desktop_leaves", "leaf", None, None),
    ("event.meta.admission.desktop.8006", "desktop_leaves", "leaf", None, None),
    ("event.action.not-interested.desktop.8006", "desktop_leaves", "leaf", None, None),
    ("event.action.calendar.desktop.8006", "desktop_leaves", "leaf", None, None),
    ("event.action.share.desktop.8006", "desktop_leaves", "leaf", None, None),
    ("event.action.like.desktop.8006", "desktop_leaves", "leaf", None, None),
    ("event.media-frame.mobile.8006", "mobile_leaves", "leaf", None, None),
    ("event.meta.event-type.mobile.8006", "mobile_leaves", "leaf", None, None),
    ("event.meta.admission.mobile.8006", "mobile_leaves", "leaf", None, None),
    ("event.action.not-interested.mobile.8006", "mobile_leaves", "leaf", None, None),
    ("event.action.calendar.mobile.8006", "mobile_leaves", "leaf", None, None),
    ("event.action.share.mobile.8006", "mobile_leaves", "leaf", None, None),
    ("event.action.like.mobile.8006", "mobile_leaves", "leaf", None, None),
    ("eventcard.desktop-wide-calendar.8006", "desktop_cases", "case", "313fb1ed-0d5c-8095-8008-912d51452f89", "313fb1ed-0d5c-8095-8008-912c45090653"),
    ("eventcard.desktop-packed-calendar-absent.2182", "desktop_cases", "case", "313fb1ed-0d5c-8095-8008-916b0b931d1f", "313fb1ed-0d5c-8095-8008-914c76615924"),
    ("eventcard.mobile-wide-calendar.8006", "mobile_cases", "case", "313fb1ed-0d5c-8095-8008-916bb0cb7843", "313fb1ed-0d5c-8095-8008-916b340de148"),
    ("eventcard.mobile-packed-calendar-absent.2182", "mobile_cases", "case", "313fb1ed-0d5c-8095-8008-916be7e9352d", "313fb1ed-0d5c-8095-8008-916bd0ab6c98"),
]


def canonical(value: object) -> bytes:
    return (json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode()


def digest(data: bytes) -> dict[str, object]:
    return {
        "bytes": len(data),
        "git_blob_sha1": hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest(),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


def git_bytes(source: dict[str, object]) -> bytes:
    result = subprocess.run(
        ["git", "show", f"{source['head']}:{source['path']}"], cwd=ROOT,
        check=True, stdout=subprocess.PIPE,
    ).stdout
    actual = digest(result)
    for key in ("bytes", "git_blob_sha1", "sha256"):
        if actual[key] != source[key]:
            raise SystemExit(f"immutable input mismatch {source['path']} {key}: {actual[key]} != {source[key]}")
    tree = subprocess.run(["git", "rev-parse", f"{source['head']}^{{tree}}"], cwd=ROOT, check=True, text=True, stdout=subprocess.PIPE).stdout.strip()
    if tree != source["tree"]:
        raise SystemExit(f"immutable tree mismatch {source['path']}: {tree}")
    return result


def build() -> dict[Path, bytes]:
    path_source = json.loads(git_bytes(PATHS_INPUT))
    four_source = json.loads(git_bytes(FOUR_CASES_INPUT))
    if path_source["expected_paths"] != {name: PATHS[group] for name, group, *_ in COMPONENTS}:
        raise SystemExit("frozen expected path map differs from U0 source")
    if len(four_source["variant_matrix"]) != 4:
        raise SystemExit("frozen four-case matrix cardinality differs")
    executor_data = SCRIPT.read_bytes()
    executor_tuple = {
        "path": SCRIPT.relative_to(ROOT).as_posix(),
        **digest(executor_data),
        "kind": "self-contained-native-penpot-executor",
        "entry_calls": ["readEventCardComponentPathsR1({penpot})", "runEventCardComponentPathsR1({penpot, authorization})"],
    }
    frozen_components = []
    for name, group, kind, component_id, main_id in COMPONENTS:
        row: dict[str, object] = {
            "semantic_identity": name,
            "component_leaf_name": name,
            "main_name_guard": name,
            "canonical_native_path": PATHS[group],
            "kind": kind,
            "component_name_mutation": False,
            "main_name_mutation": False,
        }
        if component_id:
            row.update({"durable_component_id": component_id, "durable_main_id": main_id})
        else:
            row["id_resolution"] = "exact semantic marker + payload + component/main plugin IDs; capture and compare persisted IDs pre/post"
        frozen_components.append(row)
    build_request = {
        "schema_version": "kenigevents.asp-build-request.v2",
        "marker": "ASP_BUILD_REQUEST_V2",
        "request_id": REQUEST_ID,
        "package_id": PACKAGE_ID,
        "from": "U0",
        "to": ["D0/MAT", "D0/QA", "D0/INTEGRATE"],
        "operation": "SET_EXACT_NATIVE_COMPONENT_PATHS_IN_PLACE",
        "state": "MAT_PACKAGE_READY_QA_INTEGRATE_GATED",
        "penpot_execution_authorized": False,
        "immutable_inputs": [PATHS_INPUT, FOUR_CASES_INPUT],
        "serialization": "AFTER_EVENTCARD_TEXT_READBACK_AND_BEFORE_FREE_FULL_PAGE_COMPOSITION",
        "required_result": [
            "resolve the exact existing eighteen components without recreation",
            "set only native LibraryComponent.path to the four generation-neutral groups",
            "read back 18/18 exact non-empty paths, including both linked event-type components",
            "preserve all component, main and linked-instance IDs",
            "preserve component leaf name and main.name exactly with zero name writes",
            "preserve the one Free collection root, eighteen children/components, all text/media/geometry/visibility, and validation=[]",
            "prove idempotent replay with zero path mutations",
        ],
        "authorization_contract": {
            "required_before_any_penpot_write": True,
            "external_receipt_schema": "kenigevents.asp-path-repair-execution-authorization.v1",
            "sole_writer": "/root/publish_r2",
            "exact_active_run_package_lease_cancel_binding": True,
            "exact_read_only_protected_projection_sha256": True,
            "packaged_authorization": False,
        },
        "failure_policy": {
            "unknown_or_timeout": "STOP_UNKNOWN_OUTCOME_READBACK_REQUIRED",
            "retry_without_exact_readback": False,
            "unknown_nonblank_path": "FAIL_CLOSED_ZERO_WRITES",
            "identity_or_protected_surface_drift": "FAIL_CLOSED_ZERO_WRITES",
            "no_replacement_components_or_detach": True,
            "no_text_media_geometry_visibility_or_name_mutation": True,
        },
        "terminal_recommendation": "QA_AND_INTEGRATE_REVIEW_EXACT_BYTES; THEN D0/PUBLISH MAY ISSUE A SEPARATE AUTHORIZATION AND MUST READ BACK BEFORE EACH RESUME",
    }
    request_data = canonical(build_request)
    package = {
        "schema_version": "kenigevents.asp-package-integration-candidate.v3",
        "marker": "ASP_PACKAGE_INTEGRATION_CANDIDATE_V3",
        "package_id": PACKAGE_ID,
        "revision": 1,
        "owner": "D0/MAT",
        "state": "MAT_PACKAGE_READY_QA_INTEGRATE_GATED",
        "status": "READY_FOR_D0_QA_AND_INTEGRATE_EXACT_BYTE_REVIEW",
        "penpot_execution_authorized": False,
        "penpot_mutations_by_mat": 0,
        "visual_pass": False,
        "scope": {
            "included": ["native LibraryComponent.path repair", "component leaf/main immutable guards", "stable-ID and linked event-type readback"],
            "excluded": ["Penpot reads or writes by MAT", "component/main name changes", "text", "media", "geometry", "visibility", "detach/recreate", "Free page composition", "product redesign"],
        },
        "immutable_inputs": [PATHS_INPUT, FOUR_CASES_INPUT],
        "conformance_contract": CONTRACT,
        "authoritative_receipts": [
            {"comment_id": 5480764395, "role": "blank-path native counterexample and path-only fail-closed gate"},
            {"comment_id": 5481226456, "role": "four persistent component/root IDs and structural terminal census"},
            {"comment_id": 5481227585, "role": "retain in-place native system; no replacement root"},
            {"comment_id": 5481311765, "role": "four exact root/component IDs and path defect"},
            {"comment_id": 5481337267, "role": "terminal 15-empty/3-legacy census and exact defect acceptance"},
            {"comment_id": 5481616026, "role": "authoritative generation-neutral component-path input and build request"},
            {"comment_id": 5483393557, "role": "safety invariant only: ID comparison and leaf/path/main slash-duplication prevention; not an ActionNav input"},
            {"comment_id": 5492836757, "role": "issue-tip component-path OPEN coverage state"},
            {"comment_id": 5492836947, "role": "exact producer queue request and writable-path lane"},
        ],
        "interpretation": {
            "path_only_write": True,
            "component_leaf_and_main_name": "exact immutable pre/post guards",
            "component_name_changes": 0,
            "main_name_changes": 0,
            "reason": "The immutable U0 input and receipt 5480764395 authorize only LibraryComponent.path reconciliation; the naming safety receipt is applied without widening mutation scope.",
        },
        "target": {
            "file_id": "40e06342-8830-80d6-8008-8fc8a3a4cd4f",
            "page_id": "c16498cb-b51d-8030-8008-904bd8fc9c53",
            "collection_root_id": "313fb1ed-0d5c-8095-8008-9108df52b2ce",
            "minimum_revision": 73,
            "page_direct_roots": 1,
            "collection_children": 18,
            "local_components": 18,
            "validation": [],
        },
        "native_executor": executor_tuple,
        "build_request": {"path": REQUEST_PATH.relative_to(ROOT).as_posix(), **digest(request_data)},
        "generation": {"encoding": "UTF-8", "indent": 2, "sort_keys": True, "terminal_newline": True, "command": "python3 scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/build_eventcard_component_paths_r1.py --check"},
        "path_policy": {
            "expected_groups": {key: {"path": value, "count": 7 if "leaves" in key else 2} for key, value in PATHS.items()},
            "known_initial_paths": {"empty": 15, "legacy_nonempty": 3, "legacy_path": "KenigEvents / G19 / EventCard 8006 / Accepted"},
            "unknown_nonblank_path": "FAIL_CLOSED",
            "maximum_path_writes_per_call": 3,
            "checkpoint_after_mutating_batch": True,
        },
        "components": frozen_components,
        "stable_lineage_acceptance": {
            "component_ids_preserved": "18/18",
            "main_ids_preserved": "18/18",
            "linked_instance_ids_preserved": "all 26 existing links (7+6+7+6)",
            "durable_case_component_and_main_ids_exact": "4/4",
            "distinct_same_id_proxy_objects_accepted": True,
            "wrong_id_proxy_objects_rejected": True,
            "detach_or_recreate": False,
            "event_type_native_paths": "2/2 exact canonical non-empty and each linked by ID from both viewport cases",
        },
        "protected_free_collection": {
            "pre_and_post_projection_equal": True,
            "projection_includes": ["shape IDs and hierarchy", "names", "text and typography", "fills/strokes/media metadata", "geometry/visibility", "component link IDs", "managed plugin metadata"],
            "only_excluded_target_field": "LibraryComponent.path",
            "text_media_geometry_visibility_mutations": 0,
        },
        "resumability": {
            "bounded_path_writes_per_call": 3,
            "named_version_per_progress_count": True,
            "timeout_is_unknown_outcome": True,
            "explicit_stop_state": "STOP_UNKNOWN_OUTCOME_READBACK_REQUIRED",
            "retry_without_readback": False,
            "terminal_second_run_mutations": 0,
        },
        "promotion": {
            "current_gate": "QA_AND_INTEGRATE_EXACT_BYTE_REVIEW",
            "requires_separate_publish_authorization": True,
            "requires_fresh_read_only_projection_receipt": True,
            "owner_review_or_visual_pass_claim": False,
        },
        "terminal_recommendation": build_request["terminal_recommendation"],
    }
    package_data = canonical(package)
    manifest = {
        "schema_version": "kenigevents.mat-eventcard-native-component-paths-manifest.v1",
        "package_id": PACKAGE_ID,
        "state": "MAT_PACKAGE_READY_QA_INTEGRATE_GATED",
        "penpot_execution_authorized": False,
        "immutable_inputs": [PATHS_INPUT, FOUR_CASES_INPUT],
        "generated_files": [
            {"path": PACKAGE_PATH.relative_to(ROOT).as_posix(), **digest(package_data)},
            {"path": REQUEST_PATH.relative_to(ROOT).as_posix(), **digest(request_data)},
            executor_tuple,
        ],
        "regeneration": {"deterministic": True, "command": "python3 scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/build_eventcard_component_paths_r1.py --check"},
        "tests": ["node tests/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/test_eventcard_component_paths_native_executor_r1.js", "python3 -m unittest tests/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/test_regeneration.py"],
        "terminal_recommendation": build_request["terminal_recommendation"],
    }
    return {PACKAGE_PATH: package_data, REQUEST_PATH: request_data, MANIFEST_PATH: canonical(manifest)}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.write == args.check:
        parser.error("choose exactly one of --write or --check")
    outputs = build()
    mismatches = []
    for path, data in outputs.items():
        if args.write:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
        elif not path.exists() or path.read_bytes() != data:
            mismatches.append(path.relative_to(ROOT).as_posix())
    if mismatches:
        raise SystemExit("deterministic regeneration mismatch: " + ", ".join(mismatches))
    print("MAT_EVENTCARD_COMPONENT_PATHS_R1_REGEN_PASS")


if __name__ == "__main__":
    main()

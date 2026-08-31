#!/usr/bin/env python3
"""Validate and compile the U0 EventCard text-only R9 input.

This compiler is intentionally Penpot-free. It verifies the immutable U0
component-owner contract and emits the exact semantic input that D0/MAT must
consume. Native mutation, layout settlement, export and visual acceptance stay
outside U0 ownership.
"""

from __future__ import annotations

import argparse
from decimal import Decimal, InvalidOperation
import hashlib
import json
from pathlib import Path
import sys
from typing import Any


DEFAULT_MANIFEST = (
    "catalog/asp-production-conveyor-v3/u0/"
    "U-EVENTCARD-TEXT-R9-LOWEST-OWNER-INPUT.package.v1.json"
)
SOURCE_PACKAGE_PATH = (
    "catalog/asp-production-conveyor-v3/u0/"
    "U-EVENTCARD-FOUR-CASES.package.v1.json"
)
SOURCE_PACKAGE_BLOB = "6496f9fdf2c19cce06c2a07d5b4d48061afe5522"
SOURCE_PACKAGE_BYTES = 20051
REQUIREMENTS_SHA = "54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72"
SOURCE_A_COMMIT = "c7c3e2367db8fd8865a735c8b9f5df1ef2b6efd1"
MAT_COMMIT = "d5abff951bdf5532744ff32960f805c17edd4969"
COLLECTION_ROOT_ID = "313fb1ed-0d5c-8095-8008-9108df52b2ce"

EXPECTED_ROLES: dict[str, tuple[str, str, str]] = {
    "title": ("23.328", "21.6", "1.08"),
    "occurrence": ("16.4", "13.12", "1.25"),
    "place": ("17.2", "13.76", "1.25"),
    "event_type": ("13.824", "11.52", "1.2"),
    "admission": ("13.8", "12", "1.15"),
    "not_interested": ("18.944", "11.84", "1.6"),
    "calendar_share": ("20.992", "13.12", "1.6"),
    "like_count": ("25.088", "15.68", "1.6"),
}
EXPECTED_ROOTS: dict[str, tuple[str, str, int]] = {
    "eventcard.desktop-wide-calendar.8006": (
        "313fb1ed-0d5c-8095-8008-912c45090653",
        "313fb1ed-0d5c-8095-8008-912d51452f89",
        10,
    ),
    "eventcard.desktop-packed-calendar-absent.2182": (
        "313fb1ed-0d5c-8095-8008-914c76615924",
        "313fb1ed-0d5c-8095-8008-916b0b931d1f",
        9,
    ),
    "eventcard.mobile-wide-calendar.8006": (
        "313fb1ed-0d5c-8095-8008-916b340de148",
        "313fb1ed-0d5c-8095-8008-916bb0cb7843",
        10,
    ),
    "eventcard.mobile-packed-calendar-absent.2182": (
        "313fb1ed-0d5c-8095-8008-916bd0ab6c98",
        "313fb1ed-0d5c-8095-8008-916be7e9352d",
        9,
    ),
}
EXPECTED_DEFECT_IDS = {
    "V0-1-G19-TEXT-BOUNDS-DISJOINT-016",
    "V0-1-G19-LEAF-TEXT-MATRIX-013",
}
EXPECTED_SEPARATE_LANES = {
    "media",
    "native_component_paths",
    "p90_visual_gate",
}
EXPECTED_PRESERVATIONS = {
    "collection_root_id",
    "all_four_full_root_ids",
    "all_eighteen_component_ids",
    "one_page_direct_root",
    "collection_children_18",
    "local_components_18",
    "factual_strings",
    "event_2182_calendar_absence",
    "event_2182_hidden_zero_counts",
    "root_geometry",
    "action_geometry",
    "raster_shapes_and_fills",
    "current_media_construction",
    "native_component_paths",
    "validation_empty",
}


class ContractError(AssertionError):
    """Raised when the producer input is stale, broadened or unsafe."""


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ContractError(message)


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(
        value,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")


def sha256(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def git_blob_sha1(value: bytes) -> str:
    prefix = f"blob {len(value)}\0".encode("utf-8")
    return hashlib.sha1(prefix + value).hexdigest()


def decimal(value: str, label: str) -> Decimal:
    try:
        parsed = Decimal(value)
    except (InvalidOperation, ValueError) as exc:
        raise ContractError(f"{label}: invalid decimal") from exc
    require(parsed.is_finite(), f"{label}: non-finite decimal")
    return parsed


def load(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ContractError(f"cannot load {path}: {exc}") from exc
    require(isinstance(value, dict), f"{path}: root must be an object")
    return value


def validate_manifest(manifest: dict[str, Any]) -> None:
    require(
        manifest.get("schema_version")
        == "kenigevents.asp-u0-eventcard-text-r9-input.v1",
        "schema mismatch",
    )
    require(
        manifest.get("package_id") == "U-EVENTCARD-TEXT-R9-LOWEST-OWNER-INPUT",
        "package ID mismatch",
    )
    require(manifest.get("owner") == "U0", "owner mismatch")
    require(manifest.get("priority") == "P0", "priority mismatch")
    require(
        manifest.get("status") == "READY_FOR_D0_MAT_AND_INTEGRATE",
        "unsafe lifecycle status",
    )

    lifecycle = manifest["lifecycle"]
    require(lifecycle.get("ready_for_d0_mat") is True, "MAT readiness missing")
    require(
        lifecycle.get("ready_for_d0_integrate") is True,
        "INTEGRATE readiness missing",
    )
    require(
        lifecycle.get("ready_to_publish") is False,
        "U0 may not self-authorize publication",
    )
    require(lifecycle.get("visual_pass") is False, "U0 may not grant visual PASS")
    require(
        lifecycle.get("penpot_mutations_by_u0") == 0,
        "U0 Penpot mutation is forbidden",
    )
    require(
        lifecycle.get("astro_mutations_by_u0") == 0,
        "R9 may not mutate Astro",
    )
    require(
        lifecycle.get("sole_penpot_writer") == "/root/publish_r2",
        "sole writer mismatch",
    )

    source_package = manifest["source_package"]
    require(source_package.get("commit") == "101e5a0b76084da0811be244fe0e7281910c1452", "source package commit")
    require(source_package.get("path") == SOURCE_PACKAGE_PATH, "source package path")
    require(source_package.get("git_blob_sha1") == SOURCE_PACKAGE_BLOB, "source package blob")
    require(source_package.get("bytes") == SOURCE_PACKAGE_BYTES, "source package bytes")
    require(
        source_package.get("semantic_identity") == "component.event-card.free-collection",
        "semantic identity mismatch",
    )

    requirements = manifest["requirements_contract"]
    require(requirements.get("sha256") == REQUIREMENTS_SHA, "requirements tuple")
    source_a = manifest["source_a"]
    require(source_a.get("commit") == SOURCE_A_COMMIT, "Source A commit")
    require(source_a.get("authority_mode") == "ASTRO_AS_IS_REFERENCE", "authority mode")
    require(source_a.get("tuple_changed") is False, "unexpected Source A recapture")

    terminal = manifest["terminal_structural_input"]
    require(terminal.get("mat_commit") == MAT_COMMIT, "terminal MAT commit")
    require(terminal.get("penpot_revision") == 73, "terminal revision")
    require(terminal.get("structural_status") == "COMPLETE", "structural status")
    require(terminal.get("visual_status") == "REPAIR", "visual status")
    require(terminal.get("integration_pass_comment") == 5481124677, "integration receipt")
    require(terminal.get("qa_pass_comment") == 5481126447, "QA receipt")
    require(terminal.get("visual_delta_comment") == 5481226456, "visual delta")

    identity = manifest["persistent_identity"]
    require(identity.get("collection_root_id") == COLLECTION_ROOT_ID, "collection root drift")
    require(identity.get("collection_children") == 18, "collection child census")
    require(identity.get("collection_descendants") == 248, "descendant census")
    require(identity.get("local_components") == 18, "component census")
    require(identity.get("page_direct_roots") == 1, "page root census")
    require(identity.get("validation") == [], "terminal validation not empty")
    roots = identity.get("full_roots", [])
    require(len(roots) == 4, "four full roots required")
    by_case = {item.get("case_id"): item for item in roots}
    require(set(by_case) == set(EXPECTED_ROOTS), "root case set mismatch")
    require(len(by_case) == len(roots), "duplicate case root")
    for case_id, (root_id, component_id, text_shapes) in EXPECTED_ROOTS.items():
        item = by_case[case_id]
        require(item.get("root_id") == root_id, f"{case_id}: root ID drift")
        require(item.get("component_id") == component_id, f"{case_id}: component ID drift")
        require(item.get("text_shapes") == text_shapes, f"{case_id}: text census drift")

    evidence = manifest["defect_evidence"]
    require(
        evidence.get("bounded_v0_directive_comment") == 5481341474,
        "bounded V0 directive mismatch",
    )
    require(
        evidence.get("authoritative_terminal_visual_review_comment") == 5481337267,
        "terminal visual review mismatch",
    )
    require(set(evidence.get("defect_ids", [])) == EXPECTED_DEFECT_IDS, "text defect set")
    require(evidence.get("text_shapes_total") == 52, "total text census")
    require(evidence.get("visible_nonempty") == 48, "visible text census")
    require(evidence.get("intentionally_hidden_zero_counts") == 4, "hidden count census")
    require(evidence.get("bounds_text_bounds_vertically_disjoint") == 52, "baseline disjoint census")
    require(evidence.get("positive_vertical_intersection") == 0, "baseline intersection census")
    require(
        evidence.get("root_cause")
        == "PIXEL_LIKE_LINE_HEIGHT_WRITTEN_AS_UNITLESS_MULTIPLIER",
        "text root cause",
    )

    contract = manifest["text_role_contract"]
    require(
        contract.get("line_height_api_unit") == "UNITLESS_FONT_SIZE_MULTIPLIER",
        "line-height unit contract",
    )
    require(
        contract.get("normalization_formula") == "String(line_height_px / font_size_px)",
        "normalization formula",
    )
    roles = contract.get("roles", {})
    require(set(roles) == set(EXPECTED_ROLES), "text role set mismatch")
    for role, expected in EXPECTED_ROLES.items():
        observed, font_size, target = expected
        item = roles[role]
        require(item.get("observed_invalid_line_height") == observed, f"{role}: observed value")
        require(item.get("font_size") == font_size, f"{role}: font size")
        require(item.get("target_multiplier") == target, f"{role}: target multiplier")
        observed_decimal = decimal(observed, f"{role}.observed")
        font_decimal = decimal(font_size, f"{role}.font_size")
        target_decimal = decimal(target, f"{role}.target")
        require(observed_decimal > Decimal("2"), f"{role}: observed value is not pixel-like")
        require(Decimal("0.5") <= target_decimal <= Decimal("2"), f"{role}: unsafe target multiplier")
        require(observed_decimal / font_decimal == target_decimal, f"{role}: ratio mismatch")
    require(
        set(contract.get("raw_pixel_like_values_forbidden", []))
        == {item[0] for item in EXPECTED_ROLES.values()},
        "forbidden raw-value set",
    )
    require(contract.get("managed_text_only") is True, "R9 scope broadened")
    require(contract.get("factual_strings_mutable") is False, "factual text mutation allowed")
    require(contract.get("font_binding_mutable") is False, "font binding mutation allowed")
    require(contract.get("text_frame_geometry_mutable") is False, "text frame mutation allowed")

    behavior = manifest["required_mat_r9_behavior"]
    require(behavior.get("scope") == "TEXT_LINE_HEIGHT_ONLY", "R9 behavior scope")
    require(behavior["settlement"].get("await_native_text_layout") is True, "layout settlement")
    require(behavior["settlement"].get("readback_property") == "Text.textBounds", "textBounds gate")
    require(
        behavior["settlement"].get("ordinary_shape_bounds_as_substitute") is False,
        "ordinary bounds substitution allowed",
    )
    bounds_gate = behavior["text_bounds_gate"]
    require(bounds_gate.get("visible_nonempty_required_count") == 48, "post-repair visible census")
    require(bounds_gate.get("post_repair_disjoint_count") == 0, "post-repair disjoint count")
    require(bounds_gate.get("contained_in_semantic_slot") is True, "semantic containment")
    require(bounds_gate.get("contained_in_full_card_root") is True, "card containment")
    require(
        behavior["native_exports"].get("all_four_full_roots") is True,
        "four-root export gate",
    )
    require(
        set(behavior["native_exports"].get("individual_text_shapes", []))
        == set(EXPECTED_ROLES),
        "individual text export set",
    )

    preserve = manifest["must_preserve"]
    require(set(preserve) == EXPECTED_PRESERVATIONS, "preservation field set")
    require(all(value is True for value in preserve.values()), "preservation invariant disabled")

    forbidden = set(manifest.get("forbidden_in_r9", []))
    required_forbidden_fragments = {
        "create a second root",
        "outline or rasterize text",
        "change media transforms, raster shapes or image fills",
        "repair native component paths in the text-only mutation",
    }
    require(required_forbidden_fragments.issubset(forbidden), "R9 forbidden scope incomplete")

    separate = manifest["separate_open_lanes"]
    require(set(separate) == EXPECTED_SEPARATE_LANES, "separate lane set")
    require(
        separate["media"].get("defect_id") == "V0-1-G19-MEDIA-IMAGE-FILL-017",
        "media defect identity",
    )
    require(separate["media"].get("must_not_be_bundled_into_r9") is True, "media bundled into R9")
    require(
        separate["native_component_paths"].get("must_not_be_bundled_into_r9") is True,
        "path repair bundled into R9",
    )
    require(
        separate["native_component_paths"].get("expected_nonempty_paths") == 18
        and separate["native_component_paths"].get("observed_nonempty_paths") == 3,
        "native path census",
    )
    require(
        separate["p90_visual_gate"].get("u0_input")
        == "structural COMPLETE and visual PASS are separate fields",
        "P90 status separation",
    )

    acceptance = manifest["acceptance_before_publish"]
    required_true = {
        "immutable_mat_r9_head",
        "remote_exact_head",
        "committed_byte_qa_pass",
        "d0_integrate_same_tuple_pass",
        "new_active_run_marker_for_existing_writer",
        "one_bounded_native_mutation",
        "immediate_native_readback",
        "v0_independent_review",
    }
    require(all(acceptance.get(key) is True for key in required_true), "publication gate disabled")
    require(acceptance.get("expected_revision") == 73, "expected revision drift")

    materialization = manifest["materialization_entry_point"]
    require(materialization.get("consumer") == "D0/MAT", "consumer mismatch")
    require(materialization.get("penpot_adapter_included") is False, "U0 Penpot adapter forbidden")


def verify_repository_inputs(repo: Path, manifest: dict[str, Any]) -> None:
    validate_manifest(manifest)
    source_path = repo / SOURCE_PACKAGE_PATH
    require(source_path.is_file(), "source EventCard package missing")
    source_bytes = source_path.read_bytes()
    require(len(source_bytes) == SOURCE_PACKAGE_BYTES, "source EventCard package byte drift")
    require(git_blob_sha1(source_bytes) == SOURCE_PACKAGE_BLOB, "source EventCard package blob drift")


def compile_materializer_input(manifest: dict[str, Any]) -> dict[str, Any]:
    validate_manifest(manifest)
    payload = {
        "schema_version": "kenigevents.u0-eventcard-text-r9-mat-input.v1",
        "package_id": manifest["package_id"],
        "owner": "U0",
        "consumer": "D0/MAT",
        "requirements_contract": manifest["requirements_contract"],
        "source_a": manifest["source_a"],
        "terminal_structural_input": manifest["terminal_structural_input"],
        "persistent_identity": manifest["persistent_identity"],
        "text_role_contract": manifest["text_role_contract"],
        "required_mat_r9_behavior": manifest["required_mat_r9_behavior"],
        "must_preserve": manifest["must_preserve"],
        "forbidden_in_r9": manifest["forbidden_in_r9"],
        "separate_open_lanes": manifest["separate_open_lanes"],
        "acceptance_before_publish": manifest["acceptance_before_publish"],
        "negative_regressions_required": manifest["negative_regressions_required"],
        "run_control": {
            "sole_writer": "/root/publish_r2",
            "expected_revision": 73,
            "existing_collection_root": COLLECTION_ROOT_ID,
            "new_root_allowed": False,
            "recheck_active_lease_before_every_write": True,
            "visual_pass_owner": "V0",
        },
    }
    return {
        "integrity": {
            "canonicalization": "UTF-8 sorted compact JSON",
            "payload_sha256": sha256(canonical_bytes(payload)),
        },
        **payload,
    }


def render_output(value: dict[str, Any]) -> bytes:
    return (
        json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n"
    ).encode("utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", default=None)
    parser.add_argument("--manifest", default=DEFAULT_MANIFEST)
    parser.add_argument("--check-repository-inputs", action="store_true")
    parser.add_argument("--emit", default="-")
    parser.add_argument("--check-output", default=None)
    args = parser.parse_args()

    repo = Path(args.repo).resolve() if args.repo else Path(__file__).resolve().parents[3]
    manifest = load(repo / args.manifest)
    validate_manifest(manifest)
    if args.check_repository_inputs:
        verify_repository_inputs(repo, manifest)
    output = render_output(compile_materializer_input(manifest))

    if args.check_output:
        expected = repo / args.check_output
        require(expected.is_file(), f"compiled output missing: {args.check_output}")
        require(expected.read_bytes() == output, f"compiled output stale: {args.check_output}")

    if args.emit == "-":
        sys.stdout.buffer.write(output)
    else:
        target = repo / args.emit
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(output)

    print("U0_EVENTCARD_TEXT_R9_INPUT_PASS", file=sys.stderr)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ContractError as exc:
        print(f"U0_EVENTCARD_TEXT_R9_INPUT_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)

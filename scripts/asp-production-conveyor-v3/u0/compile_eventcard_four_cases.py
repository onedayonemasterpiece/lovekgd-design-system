#!/usr/bin/env python3
"""Validate and compile the U0 four-case EventCard contract for D0/MAT.

This tool is deliberately Penpot-free. It converts an immutable, source-owned
component contract into a deterministic materializer input and fails closed on
any stale profile, geometry, action-asset, case-matrix, media-stack or resume
contract.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import sys
from typing import Any


DEFAULT_MANIFEST = (
    "catalog/asp-production-conveyor-v3/u0/"
    "U-EVENTCARD-FOUR-CASES.package.v1.json"
)

EXPECTED_CASES: dict[str, dict[str, str]] = {
    "eventcard.desktop-wide-calendar.8006": {
        "fixture_id": "event.real.8006",
        "viewport": "desktop",
        "composition": "wide",
        "calendar": "present",
        "resolved_sha256": "876abb966fb9ae49f5196f02367e54103bcb3ed1eceb2f9e818f500a5b77d855",
    },
    "eventcard.mobile-wide-calendar.8006": {
        "fixture_id": "event.real.8006",
        "viewport": "mobile",
        "composition": "wide",
        "calendar": "present",
        "resolved_sha256": "4a388f64cea110cb9d5a3ac2b3ee6400fa68e7f9d0c33df3c467372a670ece82",
    },
    "eventcard.desktop-packed-calendar-absent.2182": {
        "fixture_id": "event.real.2182",
        "viewport": "desktop",
        "composition": "packed",
        "calendar": "absent",
        "resolved_sha256": "1627bf9234042f70af04c8be4a027899434487c6080872c5e646b885c720254d",
    },
    "eventcard.mobile-packed-calendar-absent.2182": {
        "fixture_id": "event.real.2182",
        "viewport": "mobile",
        "composition": "packed",
        "calendar": "absent",
        "resolved_sha256": "339b8e84b62668c3e61edd1916de3c55d1c71a3c4664a521d53b62255ddad7cc",
    },
}

EXPECTED_LINKED_LEAVES = {
    "event.media-frame",
    "event.meta.event-type",
    "event.meta.admission",
    "event.action.not-interested",
    "event.action.calendar",
    "event.action.share",
    "event.action.like",
}

EXPECTED_CONTENT_SLOTS = {
    "title",
    "occurrence",
    "resolved-place",
    "event-type-label",
    "admission-label",
    "share-count",
    "like-count",
    "calendar-label",
    "media-asset",
    "media-focal-point",
}

EXPECTED_CORE_SEMANTICS = {
    "card.utility.not_interested",
    "card.social.share",
    "card.social.favorite",
}

EXPECTED_CALENDAR_CASES = {
    "eventcard.desktop-wide-calendar.8006",
    "eventcard.mobile-wide-calendar.8006",
}

EXPECTED_NO_CALENDAR_CASES = {
    "eventcard.desktop-packed-calendar-absent.2182",
    "eventcard.mobile-packed-calendar-absent.2182",
}

EXPECTED_ASSETS: dict[str, dict[str, Any]] = {
    "icon.action.not_interested": {
        "path": "catalog/asp-production-conveyor-v3/f0/assets/free-collection/not-interested.svg",
        "git_blob_sha1": "2cd0ebf989d63176a8e5f240c681316fab2e0670",
        "sha256": "2716788d41848f0332bf0cd7f4f16c2b9f58b2dd73a05345eae7ae788d2ade98",
        "bytes": 912,
        "viewBox": "0 0 512 512",
    },
    "icon.action.calendar_add": {
        "path": "catalog/asp-production-conveyor-v3/f0/assets/free-collection/calendar-add.svg",
        "git_blob_sha1": "539baa5a7ab4f8794c2af3dae63a732cb00d1408",
        "sha256": "0089a7c95e9366540feca517c143b6f70b994d2077272f6a064e40c7d5131ae7",
        "bytes": 374,
        "viewBox": "0 0 32 32",
    },
    "icon.action.share": {
        "path": "catalog/asp-production-conveyor-v3/f0/assets/free-collection/share.svg",
        "git_blob_sha1": "3b6a82536becf79040c1201b327c93123080b557",
        "sha256": "c8fe389bb046818566e92900418ca74cb986369e9539c3a561878250fde819cb",
        "bytes": 719,
        "viewBox": "0 0 24 24",
    },
    "icon.action.favorite.outline": {
        "path": "catalog/asp-production-conveyor-v3/f0/assets/free-collection/favorite-outline.svg",
        "git_blob_sha1": "e7b836f1f102ab787364077f1cc84fb2863b87ca",
        "sha256": "8f94e7f1e1e8abdf27cb207b300699ef1dff5090c34fafd7331326ae11214df7",
        "bytes": 459,
        "viewBox": "0 0 24 24",
    },
    "icon.action.favorite.solid": {
        "path": "catalog/asp-production-conveyor-v3/f0/assets/free-collection/favorite-solid.svg",
        "git_blob_sha1": "bcf4370e13e32ef35f7b43b1964bc06a2ae86dd3",
        "sha256": "ede237bb37e7aed328f663364b6c2b0952f1483e19e764994e86cf18de211517",
        "bytes": 275,
        "viewBox": "0 0 24 24",
    },
}

EXPECTED_LOCAL_INPUTS = {
    "contracts/page-profiles/free-collection.owner-review.v1.yaml": {
        "sha256": "a2fbdba547f8829308f88231f96fce0cc54c441f741e99a7a846dcf0333ea461",
        "git_blob_sha1": "8049669639d6229f61eab1533127f81a218fc61d",
    },
    "contracts/assets/ui-asset-registry.v1.yaml": {
        "sha256": "bbb07cc7d218d4ff69cc21ee002652b21c9e6c4efdbf65a23b9805f97eb7efb4",
        "git_blob_sha1": "271a622633f399bb52cfe322c259a8dc4162bf7e",
    },
    "catalog/materialization-bundles/d0-contract-current/eventcard-r1/inputs/free-collection-eventcard-geometry-proof.v1.json": {
        "sha256": "f176e96786b7f0e56cd292e122fb3ce006c2983d3c6fac8686fcf36d9862442b",
        "git_blob_sha1": "fe09d326ee1068f4880b6135594b17cff6fa5b54",
    },
}


class ContractError(AssertionError):
    """Raised when the package is not safe to hand to D0/MAT."""


def fail(message: str) -> None:
    raise ContractError(message)


def require(condition: bool, message: str) -> None:
    if not condition:
        fail(message)


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(
        value,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def git_blob_sha1(data: bytes) -> str:
    header = f"blob {len(data)}\0".encode("ascii")
    return hashlib.sha1(header + data).hexdigest()


def load_manifest(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"cannot load manifest {path}: {exc}")
    require(isinstance(value, dict), "manifest root must be an object")
    return value


def validate_manifest(manifest: dict[str, Any]) -> None:
    require(
        manifest.get("schema_version")
        == "kenigevents.asp-u0-eventcard-four-cases-package.v1",
        "wrong schema_version",
    )
    require(manifest.get("package_id") == "U-EVENTCARD-FOUR-CASES", "wrong package_id")
    require(manifest.get("owner") == "U0", "wrong owner")
    require(manifest.get("priority") == "P0", "wrong priority")
    require(manifest.get("status") == "READY_FOR_D0_INTEGRATE", "unsafe lifecycle status")

    truth = manifest["lifecycle_truth"]
    require(truth.get("ready_for_d0_integrate") is True, "integration readiness missing")
    require(truth.get("ready_to_publish") is False, "U0 may not self-approve publication")
    require(truth.get("penpot_mutations_by_u0") == 0, "U0 Penpot mutation is forbidden")
    require(truth.get("sole_penpot_writer") == "/root/publish_r2", "wrong sole writer")

    authority = manifest["source_authority"]
    require(authority.get("mode") == "ASTRO_AS_IS_REFERENCE", "wrong authority mode")
    require(
        authority["astro"].get("commit")
        == "c7c3e2367db8fd8865a735c8b9f5df1ef2b6efd1",
        "wrong Source-A commit",
    )
    require(
        authority["requirements_contract"].get("sha256")
        == "54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72",
        "wrong requirements contract hash",
    )

    current = manifest["current_contract"]
    require(
        current["integration_authorization"].get("commit")
        == "8b2e8f603c60d58bebc43c6f66f21f55094bd779",
        "wrong integration authorization",
    )
    require(
        current["page_profile"].get("sha256")
        == "a2fbdba547f8829308f88231f96fce0cc54c441f741e99a7a846dcf0333ea461",
        "stale page-profile hash",
    )
    require(
        current["page_profile"].get("status") == "ACTIVE_BOUNDED_EVENTCARD_REPAIR",
        "page profile is not active for bounded EventCard repair",
    )
    require(
        current["asset_registry"].get("sha256")
        == "bbb07cc7d218d4ff69cc21ee002652b21c9e6c4efdbf65a23b9805f97eb7efb4",
        "wrong active asset-registry hash",
    )
    require(current["asset_registry"].get("resolved_slots") == 4, "asset registry incomplete")
    geometry = current["geometry_proof"]
    require(
        geometry.get("raw_sha256")
        == "f176e96786b7f0e56cd292e122fb3ce006c2983d3c6fac8686fcf36d9862442b",
        "wrong geometry-proof raw hash",
    )
    require(
        geometry.get("proof_payload_sha256")
        == "5395c56376847d36a6ebc8e5d4988a2b06c4cac9acd27426dd73276620031307",
        "wrong geometry-proof payload hash",
    )
    require(geometry.get("coverage") == {"cases": 4, "required_regions_per_case": 8}, "geometry coverage changed")

    component = manifest["component_contract"]
    require(component.get("component_id") == "event.card", "wrong component identity")
    require(
        set(component.get("content_slots", [])) == EXPECTED_CONTENT_SLOTS,
        "content slot coverage mismatch",
    )
    require(
        set(component.get("required_linked_leaf_semantic_ids", []))
        == EXPECTED_LINKED_LEAVES,
        "linked leaf coverage mismatch",
    )
    require(
        "event-type-label" in component.get("required_override_targets_before_mutation", []),
        "event-type override target missing",
    )
    require(
        "all four structural contexts" in component.get("event_type_override_target_policy", ""),
        "event-type target is not required for every case",
    )

    cases = manifest["variant_matrix"]
    require(len(cases) == 4, "variant matrix must contain exactly four cases")
    by_id = {case.get("case_id"): case for case in cases}
    require(set(by_id) == set(EXPECTED_CASES), "wrong four-case matrix")
    require(len(by_id) == len(cases), "duplicate case_id")
    for case_id, expected in EXPECTED_CASES.items():
        case = by_id[case_id]
        require(case.get("component_id") == case_id, f"{case_id}: component_id mismatch")
        for field in ("fixture_id", "viewport", "composition", "calendar"):
            require(case.get(field) == expected[field], f"{case_id}: {field} mismatch")
        require(
            case.get("geometry_proof_case_id") == case_id,
            f"{case_id}: geometry case mismatch",
        )
        require(
            case["resolved_case"].get("commit")
            == "78a84576740cb650b2efbe2900377f371faf49a1",
            f"{case_id}: wrong resolved-case commit",
        )
        require(
            case["resolved_case"].get("sha256") == expected["resolved_sha256"],
            f"{case_id}: wrong resolved-case hash",
        )

    assets = manifest["asset_binding_contract"]
    require(
        assets["registry"].get("sha256")
        == current["asset_registry"].get("sha256"),
        "component package and current contract use different registries",
    )
    require(assets.get("physical_assets") == EXPECTED_ASSETS, "physical action assets changed")
    require(
        set(assets.get("required_core_binding_semantics_per_case", []))
        == EXPECTED_CORE_SEMANTICS,
        "core action semantics changed",
    )
    require(assets.get("required_core_binding_count") == 12, "core binding count must be 12")
    require(
        set(assets.get("conditional_calendar_cases", [])) == EXPECTED_CALENDAR_CASES,
        "calendar-present matrix changed",
    )
    require(assets.get("conditional_calendar_binding_count") == 2, "calendar binding count must be 2")
    require(
        set(assets.get("calendar_forbidden_in_cases", [])) == EXPECTED_NO_CALENDAR_CASES,
        "calendar-absent matrix changed",
    )
    require(assets.get("fallback_asset_policy") == "forbidden", "asset fallback must be forbidden")

    media = manifest["media_stack_contract"]
    for field in ("linked_media_wrapper_fill", "content_wrapper_fill", "action_wrapper_fill"):
        require(media.get(field) == "transparent", f"{field} must be transparent")
    require(media.get("opaque_non_source_overlay_above_media") is False, "opaque media overlay allowed")
    require(media.get("poster_pixel_visibility_required") is True, "poster visibility not required")
    require(media.get("object_fit") == "EXACT_PER_CASE_FROM_GEOMETRY_PROOF", "object-fit was guessed")
    require(media.get("object_position") == "EXACT_PER_CASE_FROM_GEOMETRY_PROOF", "object-position was guessed")

    text = manifest["text_metrics_contract"]
    require(text.get("affected_text_shape_count_from_v0_defect") == 28, "text defect coverage changed")
    require(text.get("clip_policy") == "forbidden", "text clipping allowed")
    require(text.get("event_type_target_required_in_all_cases") is True, "event-type target not universal")
    require(text.get("verify_zero_clipped_text_shapes") is True, "zero-clipping verification missing")
    require("no fixed compensating Y offset" in text.get("frame_sizing", ""), "magic text offset permitted")

    target = manifest["target_and_resume_contract"]
    require(target.get("file_id") == "40e06342-8830-80d6-8008-8fc8a3a4cd4f", "wrong Penpot file")
    require(target.get("page_id") == "c16498cb-b51d-8030-8008-904bd8fc9c53", "wrong Penpot page")
    require(target.get("accepted_root_id") == "313fb1ed-0d5c-8095-8008-9108df52b2ce", "wrong accepted root")
    require(target.get("expected_native_revision") == 56, "stale native revision")
    require(
        target.get("baseline")
        == {
            "page_direct_roots": 1,
            "accepted_root_direct_children": 16,
            "accepted_root_descendants": 137,
            "local_components": 15,
            "validation": [],
        },
        "revision-56 baseline census mismatch",
    )
    require(
        target.get("partial_root")
        == {
            "id": "313fb1ed-0d5c-8095-8008-914c76615924",
            "state": "BUILDING",
            "payload_sha256": "c6c35b6f39e3cd5bc68bfe183c1df0652475533d4eecbaea8bd7bca1b4b35219",
            "direct_children": 10,
            "descendants": 21,
            "preserve": True,
            "resume_in_place": True,
        },
        "partial-root resume tuple mismatch",
    )
    require(target.get("second_top_level_root_allowed") is False, "second root allowed")
    require(target.get("blind_retry_allowed") is False, "blind retry allowed")
    require(target.get("sole_writer") == "/root/publish_r2", "wrong target writer")

    terminal = manifest["expected_terminal"]
    require(terminal.get("page_direct_roots") == 1, "terminal top-level root count changed")
    require(terminal.get("accepted_root_direct_children") == 18, "terminal child count changed")
    require(terminal.get("local_components") == 18, "terminal component count changed")
    require(terminal.get("accepted_card_components") == 4, "terminal card count changed")
    require(terminal.get("review_case_instances") == 4, "terminal review-case count changed")
    require(terminal.get("detached_roots") == 0, "detached roots allowed")
    require(terminal.get("screenshot_roots") == 0, "screenshot implementation allowed")
    require(terminal.get("validation") == [], "terminal validation must be empty")

    entry = manifest["materialization_entry_point"]
    require(entry.get("consumer") == "D0/MAT R4", "wrong materializer consumer")
    require(entry.get("penpot_adapter_included") is False, "U0 must not carry a Penpot adapter")


def verify_repository_inputs(repo: Path) -> None:
    for relative, expected in EXPECTED_LOCAL_INPUTS.items():
        path = repo / relative
        require(path.is_file(), f"missing repository input: {relative}")
        data = path.read_bytes()
        require(sha256_bytes(data) == expected["sha256"], f"SHA-256 mismatch: {relative}")
        require(git_blob_sha1(data) == expected["git_blob_sha1"], f"Git blob mismatch: {relative}")


def compile_materializer_input(manifest: dict[str, Any]) -> dict[str, Any]:
    validate_manifest(manifest)
    assets = manifest["asset_binding_contract"]
    cases = []
    for case in manifest["variant_matrix"]:
        core = [
            {
                "semantic_slot": "card.utility.not_interested",
                "asset_id": "icon.action.not_interested",
                "asset_sha256": EXPECTED_ASSETS["icon.action.not_interested"]["sha256"],
            },
            {
                "semantic_slot": "card.social.share",
                "asset_id": "icon.action.share",
                "asset_sha256": EXPECTED_ASSETS["icon.action.share"]["sha256"],
            },
            {
                "semantic_slot": "card.social.favorite",
                "asset_id": "icon.action.favorite.outline",
                "selected_asset_id": "icon.action.favorite.solid",
                "asset_sha256": EXPECTED_ASSETS["icon.action.favorite.outline"]["sha256"],
                "selected_asset_sha256": EXPECTED_ASSETS["icon.action.favorite.solid"]["sha256"],
            },
        ]
        calendar = None
        if case["case_id"] in EXPECTED_CALENDAR_CASES:
            calendar = {
                "semantic_slot": "card.primary_action.calendar_add",
                "asset_id": "icon.action.calendar_add",
                "asset_sha256": EXPECTED_ASSETS["icon.action.calendar_add"]["sha256"],
            }
        cases.append(
            {
                "case_id": case["case_id"],
                "component_id": case["component_id"],
                "fixture_id": case["fixture_id"],
                "viewport": case["viewport"],
                "composition": case["composition"],
                "calendar": case["calendar"],
                "resolved_case": case["resolved_case"],
                "geometry_proof_case_id": case["geometry_proof_case_id"],
                "core_action_bindings": core,
                "calendar_binding": calendar,
            }
        )

    payload: dict[str, Any] = {
        "schema_version": "kenigevents.u0-eventcard-mat-input.v1",
        "package_id": manifest["package_id"],
        "owner": "U0",
        "consumer": "D0/MAT R4",
        "source_authority": manifest["source_authority"],
        "current_contract": manifest["current_contract"],
        "component_contract": manifest["component_contract"],
        "cases": cases,
        "physical_assets": assets["physical_assets"],
        "media_stack_contract": manifest["media_stack_contract"],
        "text_metrics_contract": manifest["text_metrics_contract"],
        "target_and_resume_contract": manifest["target_and_resume_contract"],
        "expected_terminal": manifest["expected_terminal"],
        "run_control_requirement": {
            "writer": "/root/publish_r2",
            "state_before_every_mutation": "ACTIVE",
            "recheck_after_every_await": True,
            "post_cancel_product_writes": 0,
            "undo_cleanup_exception": "minimum transaction-close operation only",
        },
        "publication_gate": manifest["validation"]["d0_acceptance_before_penpot"],
    }
    payload_sha = sha256_bytes(canonical_bytes(payload))
    return {
        "integrity": {
            "canonicalization": "UTF-8 JSON; sorted keys; comma/colon separators; no trailing LF",
            "payload_sha256": payload_sha,
        },
        **payload,
    }


def render_output(value: dict[str, Any]) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n").encode("utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", default=None, help="repository root")
    parser.add_argument("--manifest", default=DEFAULT_MANIFEST)
    parser.add_argument("--check-repository-inputs", action="store_true")
    parser.add_argument("--emit", default="-", help="output file or '-' for stdout")
    parser.add_argument("--check-output", default=None, help="compare generated bytes with this file")
    args = parser.parse_args()

    repo = Path(args.repo).resolve() if args.repo else Path(__file__).resolve().parents[3]
    manifest_path = repo / args.manifest
    manifest = load_manifest(manifest_path)
    validate_manifest(manifest)
    if args.check_repository_inputs:
        verify_repository_inputs(repo)

    output = render_output(compile_materializer_input(manifest))
    if args.check_output:
        expected_path = repo / args.check_output
        require(expected_path.is_file(), f"compiled output missing: {args.check_output}")
        require(expected_path.read_bytes() == output, f"compiled output stale: {args.check_output}")

    if args.emit == "-":
        sys.stdout.buffer.write(output)
    else:
        path = repo / args.emit
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(output)

    print("U0_EVENTCARD_FOUR_CASES_CONTRACT_PASS", file=sys.stderr)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ContractError as exc:
        print(f"U0_EVENTCARD_FOUR_CASES_CONTRACT_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)

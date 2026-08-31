#!/usr/bin/env python3
"""Current-target candidate runner for F-TYPOGRAPHY-LAYOUT revision 3."""

from __future__ import annotations

import argparse
import hashlib
import importlib
import importlib.util
import json
from pathlib import Path
import sys
from typing import Any

DEFAULT_PACKAGE = (
    "catalog/asp-production-conveyor-v3/f0/"
    "F-TYPOGRAPHY-LAYOUT.package.v3.json"
)
HELPER_NAME = "f0_typography_contract_v3.py"


def load_helper() -> Any:
    path = Path(__file__).with_name(HELPER_NAME)
    spec = importlib.util.spec_from_file_location("f0_typography_contract_v3", path)
    if spec is None or spec.loader is None:
        raise AssertionError(f"cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


H = load_helper()


def load_package(
    repo: Path, relative_path: str
) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
    data = (repo / relative_path).read_bytes()
    package = json.loads(data)
    package_identity = H.identity(data)
    validated = H.validate_model(package)
    H.verify_file_identity(repo, package["source_package_v2"], "source v2")
    H.verify_file_identity(repo, package["source_package_v1"], "source v1")
    H.verify_file_identity(repo, package["helper"], "helper")
    return package, package_identity, validated


def load_adapter(spec: str) -> Any:
    H.require(":" in spec, "--adapter must be module:factory")
    module_name, factory_name = spec.split(":", 1)
    adapter = getattr(importlib.import_module(module_name), factory_name)()
    required = (
        "read_document",
        "assert_active_lease",
        "verify_font_source",
        "ensure_page",
        "upsert_typography_layout_component",
        "upsert_typography_layout_specimen",
        "validate",
        "export_png",
        "readback",
    )
    missing = [
        name for name in required if not callable(getattr(adapter, name, None))
    ]
    H.require(not missing, f"native adapter missing methods: {missing}")
    return adapter


def guard(adapter: Any, args: argparse.Namespace, label: str) -> None:
    state = adapter.assert_active_lease(
        run_id=args.run_id,
        lease_token=args.lease_token,
        cancel_token=args.cancel_token,
    )
    H.require(state.get("active") is True, f"inactive before {label}: {state}")
    H.require(state.get("cancelled") is not True, f"cancelled before {label}: {state}")


def immutable_inputs(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        "candidate_branch": package["branch"],
        "candidate_commit": candidate_commit,
        "package_path": package["immutable_identity"]["package_path"],
        "package_identity": package_identity,
        "source_package_v2": package["source_package_v2"],
        "source_package_v1": package["source_package_v1"],
        "helper": package["helper"],
        "runner": package["runner"],
        "tests": package["tests"],
    }


def build_plan(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    validated: dict[str, Any],
    candidate_commit: str,
    font_preflight: dict[str, Any],
) -> dict[str, Any]:
    H.require(font_preflight.get("verified") is True, "font preflight not verified")
    return {
        "schema_version": "kenigevents.f0-typography-layout-plan.v3",
        "marker": "F0_TYPOGRAPHY_LAYOUT_V3_PLAN_PASS",
        "status": package["status"],
        "candidate_materialization_state": package["candidate_materialization_state"],
        "promotion_state": package["promotion_state"],
        "immutable_inputs": immutable_inputs(
            package, package_identity, candidate_commit
        ),
        "target": package["target_penpot_page"],
        "protected_surface": package["protected_surface"],
        "font_preflight": font_preflight,
        "typography": package["typography"],
        "components": package["specimen_components"],
        "specimen": package["specimen"],
        "validated": validated,
        "expected": {
            "roots": package["expected_roots"],
            "components": package["expected_components"],
            "instances": package["expected_instances"],
            "detached_instances": 0,
            "screenshot_shapes": 0,
            "validation_errors": [],
        },
        "write_contract": {
            "writer": "D0/PUBLISH_ONLY",
            "candidate_build_not_accepted": True,
            "font_preflight_before_any_text_mutation": True,
            "unitless_line_height_only": True,
            "editable_cyrillic_text": True,
            "protected_surface_mutation_allowed": False,
            "eventcard_r10_closed": False,
            "visual_acceptance_claimed": False,
        },
    }


def execute(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    validated: dict[str, Any],
    args: argparse.Namespace,
) -> dict[str, Any]:
    H.require(
        all(
            (
                args.adapter,
                args.run_id,
                args.lease_token,
                args.cancel_token,
                args.candidate_commit,
                args.regular_font_file,
                args.bold_font_file,
            )
        ),
        "execute requires adapter/run/lease/cancel/commit/two font files",
    )
    font_preflight = H.preflight_fonts(
        Path(args.regular_font_file), Path(args.bold_font_file), package
    )
    adapter = load_adapter(args.adapter)
    verified_by_adapter = []
    for face, path in (
        ("regular", args.regular_font_file),
        ("bold", args.bold_font_file),
    ):
        declared = package["font_binding"][face]
        result = adapter.verify_font_source(
            path=path,
            expected_bytes=declared["bytes"],
            expected_sha256=declared["sha256"],
            family=declared["family"],
            weight=declared["weight"],
        )
        H.require(result.get("verified") is True, f"{face}: adapter preflight")
        H.require(result.get("sha256") == declared["sha256"], f"{face}: adapter SHA")
        verified_by_adapter.append(result)

    target = package["target_penpot_page"]
    protected = package["protected_surface"]
    before_document = adapter.read_document(file_id=target["file_id"])
    protected_before = adapter.readback(
        file_id=protected["file_id"],
        page_id=protected["page_id"],
        shape_ids=protected["root_ids"],
    )
    before_digest = H.stable_digest(protected_before)

    guard(adapter, args, "ensure-candidate-page")
    page = adapter.ensure_page(
        file_id=target["file_id"],
        exact_name=target["exact_name"],
        metadata={
            "package_id": package["package_id"],
            "package_revision": package["revision"],
            "candidate_commit": args.candidate_commit,
            "package_blob_sha1": package_identity["git_blob_sha1"],
            "candidate_label": target["candidate_label"],
            "owner_review_state": "NOT_ACCEPTED",
            "semantic_css_family": package["typography"]["semantic_css_family"],
            "frozen_A_resolved_family": package["typography"][
                "frozen_A_resolved_family"
            ],
        },
    )
    page_id = page.get("page_id")
    H.require(bool(page_id), "ensure_page returned no page_id")
    H.require(page_id != protected["page_id"], "candidate page is protected page")

    component_ids: list[str] = []
    for component in package["specimen_components"]:
        guard(adapter, args, f"component:{component['id']}")
        result = adapter.upsert_typography_layout_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=component["penpot_name"],
            component_spec=component,
            typography=package["typography"],
            layout=package["layout"],
            font_binding=package["font_binding"],
            metadata={
                "package_id": package["package_id"],
                "stable_id": component["id"],
                "candidate_label": target["candidate_label"],
                "line_height_unit": "unitless-ratio",
                "eventcard_r10_closed": False,
            },
        )
        component_id = result.get("component_id")
        H.require(bool(component_id), f"{component['id']}: no component_id")
        component_ids.append(component_id)

    guard(adapter, args, "candidate-specimen-root")
    root = adapter.upsert_typography_layout_specimen(
        file_id=target["file_id"],
        page_id=page_id,
        exact_name=package["candidate_root"]["exact_name"],
        component_ids=component_ids,
        placements=package["specimen"]["placements"],
        metadata={
            "package_id": package["package_id"],
            "candidate_label": target["candidate_label"],
            "owner_review_state": "NOT_ACCEPTED",
            "promotion_allowed": False,
            "editable_cyrillic_wrap_specimens": package["typography"][
                "editable_cyrillic_wrap_specimens"
            ],
            "consumer_repair_boundary": package["eventcard_consumer_boundary"],
        },
    )
    root_id = root.get("shape_id")
    H.require(bool(root_id), "candidate root returned no shape_id")

    validation = adapter.validate(file_id=target["file_id"], page_id=page_id)
    H.require(validation.get("errors") in (None, []), f"validation: {validation}")
    export = adapter.export_png(
        file_id=target["file_id"], shape_id=root_id, scale=1.0
    )
    H.require(export.get("nonempty") is True, f"empty export: {export}")
    readback = adapter.readback(
        file_id=target["file_id"],
        page_id=page_id,
        shape_ids=component_ids + [root_id],
    )
    H.require(
        readback.get("instance_count") == package["expected_instances"],
        "instance count mismatch",
    )
    H.require(readback.get("detached_instance_count") == 0, "detached instances")
    H.require(readback.get("screenshot_shape_count") == 0, "screenshot shapes")
    H.require(
        readback.get("outlined_text_count", 0) == 0,
        "outlined text is forbidden",
    )
    H.require(
        readback.get(
            "editable_cyrillic_specimen_count",
            len(package["typography"]["editable_cyrillic_wrap_specimens"]),
        )
        >= len(package["typography"]["editable_cyrillic_wrap_specimens"]),
        "editable Cyrillic wrap specimen coverage",
    )

    protected_after = adapter.readback(
        file_id=protected["file_id"],
        page_id=protected["page_id"],
        shape_ids=protected["root_ids"],
    )
    after_digest = H.stable_digest(protected_after)
    H.require(before_digest == after_digest, "protected surface changed")
    after_document = adapter.read_document(file_id=target["file_id"])

    return {
        "schema_version": "kenigevents.asp-build-result-v3",
        "marker": "ASP_BUILD_RESULT_V3",
        "package_id": package["package_id"],
        "package_revision": package["revision"],
        "status": "CANDIDATE_MATERIALIZED_PENDING_V0",
        "materialization_state": "VISIBLE_CANDIDATE",
        "promotion_state": "BLOCKED_UNTIL_V0_REVIEW",
        "owner_review_state": "NOT_ACCEPTED",
        "writer": "D0/PUBLISH",
        "immutable_inputs": immutable_inputs(
            package, package_identity, args.candidate_commit
        ),
        "run_control": {
            "run_id": args.run_id,
            "lease_token_sha256": hashlib.sha256(
                args.lease_token.encode()
            ).hexdigest(),
            "cancel_token_sha256": hashlib.sha256(
                args.cancel_token.encode()
            ).hexdigest(),
            "guard_before_every_mutation": True,
        },
        "font_preflight": font_preflight,
        "adapter_font_preflight": verified_by_adapter,
        "target": {
            **target,
            "page_id": page_id,
            "root_id": root_id,
        },
        "protected_surface": {
            **protected,
            "before_digest": before_digest,
            "after_digest": after_digest,
            "mutated": False,
        },
        "revision": {
            "before": before_document.get("revision"),
            "after": after_document.get("revision"),
        },
        "counts": {
            "roots": 1,
            "components": len(component_ids),
            "instances": readback.get("instance_count"),
            "detached_instances": readback.get("detached_instance_count"),
            "screenshot_shapes": readback.get("screenshot_shape_count"),
        },
        "created_or_reused": {
            "component_ids": component_ids,
            "root_id": root_id,
        },
        "validation": validation,
        "export": export,
        "eventcard_consumer_boundary": package["eventcard_consumer_boundary"],
        "provenance_receipt": {
            "package_git_blob_sha1": package_identity["git_blob_sha1"],
            "semantic_css_family": package["typography"]["semantic_css_family"],
            "frozen_A_resolved_family": package["typography"][
                "frozen_A_resolved_family"
            ],
            "line_height_roles": package["typography"]["line_height_roles"],
            "font_sha256": {
                face: package["font_binding"][face]["sha256"]
                for face in ("regular", "bold")
            },
            "consumer_eventcard_r10_closed": False,
            "visual_acceptance_claimed": False,
        },
    }


def verify(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    candidate_commit: str,
    receipt: dict[str, Any],
) -> None:
    H.require(receipt.get("marker") == "ASP_BUILD_RESULT_V3", "wrong marker")
    H.require(receipt.get("package_id") == package["package_id"], "wrong package")
    H.require(receipt.get("package_revision") == 3, "wrong revision")
    H.require(receipt.get("writer") == "D0/PUBLISH", "wrong writer")
    H.require(
        receipt.get("immutable_inputs")
        == immutable_inputs(package, package_identity, candidate_commit),
        "immutable input mismatch",
    )
    H.require(receipt.get("owner_review_state") == "NOT_ACCEPTED", "acceptance leak")
    H.require(receipt["target"]["file_id"] == H.CURRENT_FILE_ID, "stale target")
    H.require(receipt["protected_surface"]["mutated"] is False, "protected mutation")
    H.require(
        receipt["protected_surface"]["before_digest"]
        == receipt["protected_surface"]["after_digest"],
        "protected digest drift",
    )
    counts = receipt["counts"]
    H.require(counts["roots"] == 1, "root count")
    H.require(counts["components"] == package["expected_components"], "components")
    H.require(counts["instances"] == package["expected_instances"], "instances")
    H.require(counts["detached_instances"] == 0, "detached")
    H.require(counts["screenshot_shapes"] == 0, "screenshots")
    H.require(receipt["validation"].get("errors") in (None, []), "validation")
    H.require(receipt["export"].get("nonempty") is True, "empty export")
    H.require(
        receipt["eventcard_consumer_boundary"]["closed_by_this_package"] is False,
        "R10 closure leak",
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("plan", "execute", "verify"))
    parser.add_argument("--repo")
    parser.add_argument("--package", default=DEFAULT_PACKAGE)
    parser.add_argument("--candidate-commit", required=True)
    parser.add_argument("--regular-font-file")
    parser.add_argument("--bold-font-file")
    parser.add_argument("--adapter")
    parser.add_argument("--run-id")
    parser.add_argument("--lease-token")
    parser.add_argument("--cancel-token")
    parser.add_argument("--receipt")
    parser.add_argument("--output")
    args = parser.parse_args()

    repo = (
        Path(args.repo).resolve()
        if args.repo
        else Path(__file__).resolve().parents[3]
    )
    package, package_identity, validated = load_package(repo, args.package)

    if args.mode == "plan":
        H.require(
            args.regular_font_file and args.bold_font_file,
            "plan requires exact regular and bold font files",
        )
        font_preflight = H.preflight_fonts(
            Path(args.regular_font_file), Path(args.bold_font_file), package
        )
        result = build_plan(
            package,
            package_identity,
            validated,
            args.candidate_commit,
            font_preflight,
        )
        marker = "F0_TYPOGRAPHY_LAYOUT_V3_PLAN_PASS"
    elif args.mode == "execute":
        result = execute(package, package_identity, validated, args)
        marker = "F0_TYPOGRAPHY_LAYOUT_V3_EXECUTE_PASS"
    else:
        H.require(bool(args.receipt), "verify requires --receipt")
        receipt = json.loads(Path(args.receipt).read_text(encoding="utf-8"))
        verify(package, package_identity, args.candidate_commit, receipt)
        result = {
            "status": "CANDIDATE_READBACK_VERIFIED",
            "owner_review_state": "NOT_ACCEPTED",
            "immutable_inputs": immutable_inputs(
                package, package_identity, args.candidate_commit
            ),
        }
        marker = "F0_TYPOGRAPHY_LAYOUT_V3_READBACK_PASS"

    rendered = json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True)
    if args.output:
        Path(args.output).write_text(rendered + "\n", encoding="utf-8")
    print(marker, rendered)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (
        AssertionError,
        ImportError,
        KeyError,
        OSError,
        TypeError,
        json.JSONDecodeError,
    ) as exc:
        print(f"F0_TYPOGRAPHY_LAYOUT_V3_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)

#!/usr/bin/env python3
"""Current-target exact-byte candidate runner for action/navigation revision 4."""

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
    "F-ACTION-NAV-ICONS.package.v4.json"
)


def load_helper() -> Any:
    path = Path(__file__).with_name("f0_action_nav_contract_v4.py")
    spec = importlib.util.spec_from_file_location("f0_action_nav_contract_v4", path)
    if spec is None or spec.loader is None:
        raise AssertionError(f"cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


H = load_helper()


def load_package(
    repo: Path, relative_path: str
) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any], dict[str, Any]]:
    data = (repo / relative_path).read_bytes()
    package = json.loads(data)
    package_identity = H.identity(data)
    validated = H.validate_model(package)
    repository_inputs = H.verify_repository_inputs(repo, package)
    return package, package_identity, validated, repository_inputs


def load_adapter(spec: str, package: dict[str, Any]) -> Any:
    H.require(":" in spec, "--adapter must be module:factory")
    module_name, factory_name = spec.split(":", 1)
    adapter = getattr(importlib.import_module(module_name), factory_name)()
    required = package["adapter_contract"]["method_surface"]
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
    repository_inputs: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        "candidate_branch": package["branch"],
        "candidate_commit": candidate_commit,
        "package_path": package["immutable_identity"]["package_path"],
        "package_identity": package_identity,
        "source_package_v3": package["source_package_v3"],
        "asset_registry": {
            **package["asset_registry"],
            "actual_identity": repository_inputs["asset_registry"],
        },
        "helper": package["helper"],
        "runner": package["runner"],
        "tests": package["tests"],
        "verified_asset_variants": repository_inputs["assets"],
    }


def build_plan(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    validated: dict[str, Any],
    repository_inputs: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        "schema_version": "kenigevents.f0-action-nav-plan.v4",
        "marker": "F0_ACTION_NAV_V4_PLAN_PASS",
        "status": package["status"],
        "candidate_materialization_state": package["candidate_materialization_state"],
        "promotion_state": package["promotion_state"],
        "immutable_inputs": immutable_inputs(
            package, package_identity, repository_inputs, candidate_commit
        ),
        "target": package["target_penpot_page"],
        "protected_surface": package["protected_surface"],
        "validated": validated,
        "validated_assets": repository_inputs["assets"],
        "specimen": package["specimen"],
        "expected": {
            "roots": 1,
            "components": 8,
            "instances": 18,
            "detached_instances": 0,
            "screenshot_shapes": 0,
            "validation_errors": [],
        },
        "write_contract": {
            "writer": "D0/PUBLISH_ONLY",
            "candidate_build_not_accepted": True,
            "same_exact_svg_bytes_as_v3": True,
            "redraw_or_substitution": False,
            "adapter_method_surface_preserved": True,
            "protected_surface_mutation_allowed": False,
            "visual_acceptance_claimed": False,
        },
    }


def execute(
    repo: Path,
    package: dict[str, Any],
    package_identity: dict[str, Any],
    validated: dict[str, Any],
    repository_inputs: dict[str, Any],
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
            )
        ),
        "execute requires adapter/run/lease/cancel/commit",
    )
    adapter = load_adapter(args.adapter, package)
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
            "package_revision": 4,
            "candidate_commit": args.candidate_commit,
            "package_blob_sha1": package_identity["git_blob_sha1"],
            "registry_identity": repository_inputs["asset_registry"],
            "candidate_label": target["candidate_label"],
            "owner_review_state": "NOT_ACCEPTED",
            "same_exact_svg_bytes_as_v3": True,
        },
    )
    page_id = page.get("page_id")
    H.require(bool(page_id), "no candidate page id")
    H.require(page_id != protected["page_id"], "candidate page collision")

    grouped: dict[str, list[dict[str, Any]]] = {}
    for item in package["assets_and_hashes"]:
        grouped.setdefault(item["component_name"], []).append(item)

    component_ids: list[str] = []
    for component_name, variants in sorted(grouped.items()):
        guard(adapter, args, f"component:{component_name}")
        variants = sorted(variants, key=lambda item: item["variant"])
        result = adapter.upsert_svg_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=component_name,
            svg_bytes=(repo / variants[0]["path"]).read_bytes(),
            variants=[
                {
                    "name": item["variant"],
                    "svg_bytes": (repo / item["path"]).read_bytes(),
                    "sha256": item["sha256"],
                    "git_blob_sha1": item["git_blob_sha1"],
                }
                for item in variants
            ],
            metadata={
                "package_id": package["package_id"],
                "canonical_id": variants[0]["asset_id"],
                "semantic_slot": variants[0]["semantic_slot"],
                "source_commit": variants[0]["source_commit"],
                "source_path": variants[0]["source_path"],
                "viewBox": variants[0]["viewBox"],
                "nominal_box": variants[0]["nominal_box"],
                "fill_stroke_contract": variants[0]["fill_stroke_contract"],
                "candidate_label": target["candidate_label"],
                "reuse": "EXACT_V3_BYTES_UNCHANGED",
                "old_penpot_uuid_lineage": False,
            },
        )
        component_id = result.get("component_id")
        H.require(bool(component_id), f"{component_name}: no component id")
        component_ids.append(component_id)

    H.require(len(component_ids) == 8, "component count before specimen")
    guard(adapter, args, "candidate-specimen-root")
    root = adapter.upsert_specimen(
        file_id=target["file_id"],
        page_id=page_id,
        exact_name=package["candidate_root"]["exact_name"],
        component_ids=component_ids,
        metadata={
            "package_id": package["package_id"],
            "candidate_label": target["candidate_label"],
            "owner_review_state": "NOT_ACCEPTED",
            "promotion_allowed": False,
            "consumer": package["specimen"]["consumer"],
            "states": package["specimen"]["states"],
            "same_exact_svg_bytes_as_v3": True,
        },
    )
    root_id = root.get("shape_id")
    H.require(bool(root_id), "no root id")

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
    H.require(readback.get("instance_count") == 18, "instance count")
    H.require(readback.get("detached_instance_count") == 0, "detached instances")
    H.require(readback.get("screenshot_shape_count") == 0, "screenshot shapes")

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
        "package_revision": 4,
        "status": "CANDIDATE_MATERIALIZED_PENDING_V0",
        "materialization_state": "VISIBLE_CANDIDATE",
        "promotion_state": "BLOCKED_UNTIL_V0_REVIEW",
        "owner_review_state": "NOT_ACCEPTED",
        "writer": "D0/PUBLISH",
        "immutable_inputs": immutable_inputs(
            package, package_identity, repository_inputs, args.candidate_commit
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
        "target": {**target, "page_id": page_id, "root_id": root_id},
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
        "provenance_receipt": {
            "package_git_blob_sha1": package_identity["git_blob_sha1"],
            "source_package_v3": repository_inputs["source_v3"],
            "registry_identity": repository_inputs["asset_registry"],
            "verified_asset_variants": repository_inputs["assets"],
            "same_exact_svg_bytes_as_v3": True,
            "redraw_or_substitution": False,
            "old_penpot_uuid_lineage": False,
            "visual_acceptance_claimed": False,
        },
    }


def verify(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    repository_inputs: dict[str, Any],
    candidate_commit: str,
    receipt: dict[str, Any],
) -> None:
    H.require(receipt.get("marker") == "ASP_BUILD_RESULT_V3", "wrong marker")
    H.require(receipt.get("package_id") == package["package_id"], "wrong package")
    H.require(receipt.get("package_revision") == 4, "wrong revision")
    H.require(receipt.get("writer") == "D0/PUBLISH", "wrong writer")
    H.require(
        receipt.get("immutable_inputs")
        == immutable_inputs(
            package, package_identity, repository_inputs, candidate_commit
        ),
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
    H.require(counts == {
        "roots": 1,
        "components": 8,
        "instances": 18,
        "detached_instances": 0,
        "screenshot_shapes": 0,
    }, "count contract")
    H.require(receipt["validation"].get("errors") in (None, []), "validation")
    H.require(receipt["export"].get("nonempty") is True, "empty export")
    H.require(
        receipt["provenance_receipt"]["same_exact_svg_bytes_as_v3"] is True,
        "byte reuse claim missing",
    )
    H.require(
        receipt["provenance_receipt"]["redraw_or_substitution"] is False,
        "redraw/substitution leak",
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("plan", "execute", "verify"))
    parser.add_argument("--repo")
    parser.add_argument("--package", default=DEFAULT_PACKAGE)
    parser.add_argument("--candidate-commit", required=True)
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
    package, package_identity, validated, repository_inputs = load_package(
        repo, args.package
    )
    if args.mode == "plan":
        result = build_plan(
            package,
            package_identity,
            validated,
            repository_inputs,
            args.candidate_commit,
        )
        marker = "F0_ACTION_NAV_V4_PLAN_PASS"
    elif args.mode == "execute":
        result = execute(
            repo,
            package,
            package_identity,
            validated,
            repository_inputs,
            args,
        )
        marker = "F0_ACTION_NAV_V4_EXECUTE_PASS"
    else:
        H.require(bool(args.receipt), "verify requires --receipt")
        receipt = json.loads(Path(args.receipt).read_text(encoding="utf-8"))
        verify(
            package,
            package_identity,
            repository_inputs,
            args.candidate_commit,
            receipt,
        )
        result = {
            "status": "CANDIDATE_READBACK_VERIFIED",
            "owner_review_state": "NOT_ACCEPTED",
            "immutable_inputs": immutable_inputs(
                package, package_identity, repository_inputs, args.candidate_commit
            ),
        }
        marker = "F0_ACTION_NAV_V4_READBACK_PASS"

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
        print(f"F0_ACTION_NAV_V4_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)

#!/usr/bin/env python3
"""Current-target deterministic candidate runner for Brandbook revision 3."""

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
    "F-BRANDBOOK-BASELINE.package.v3.json"
)


def load_helper() -> Any:
    path = Path(__file__).with_name("f0_brandbook_contract_v3.py")
    spec = importlib.util.spec_from_file_location("f0_brandbook_contract_v3", path)
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
    H.verify_file_identity(repo, package["asset_registry"], "brand registry")
    H.verify_file_identity(repo, package["helper"], "helper")
    return package, package_identity, validated


def load_adapter(spec: str) -> Any:
    H.require(":" in spec, "--adapter must be module:factory")
    module_name, factory_name = spec.split(":", 1)
    adapter = getattr(importlib.import_module(module_name), factory_name)()
    required = (
        "read_document",
        "assert_active_lease",
        "ensure_page",
        "upsert_svg_asset_component",
        "upsert_brand_lockup_component",
        "upsert_brandbook_specimen",
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
        "asset_registry": package["asset_registry"],
        "helper": package["helper"],
        "runner": package["runner"],
        "tests": package["tests"],
        "assets": [
            {
                "asset_id": item["asset_id"],
                "source_path": item["source_path"],
                "git_blob_sha1": item["git_blob_sha1"],
                "sha256": item["sha256"],
                "bytes": item["bytes"],
            }
            for item in package["assets"]
        ],
    }


def build_plan(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    candidate_commit: str,
    validated: dict[str, Any],
    verified_assets: list[dict[str, Any]],
) -> dict[str, Any]:
    return {
        "schema_version": "kenigevents.f0-brandbook-plan.v3",
        "marker": "F0_BRANDBOOK_V3_PLAN_PASS",
        "status": package["status"],
        "candidate_materialization_state": package["candidate_materialization_state"],
        "promotion_state": package["promotion_state"],
        "immutable_inputs": immutable_inputs(
            package, package_identity, candidate_commit
        ),
        "target": package["target_penpot_page"],
        "protected_surface": package["protected_surface"],
        "verified_assets": verified_assets,
        "components": package["brand_components"],
        "specimen": package["specimen"],
        "validated": validated,
        "expected": {
            "roots": 1,
            "components": 5,
            "instances": 14,
            "linked_asset_instances": 4,
            "detached_instances": 0,
            "screenshot_shapes": 0,
            "validation_errors": [],
        },
        "write_contract": {
            "writer": "D0/PUBLISH_ONLY",
            "candidate_build_not_accepted": True,
            "exact_asset_bytes_before_any_mutation": True,
            "linked_lockups": True,
            "protected_surface_mutation_allowed": False,
            "old_penpot_uuid_lineage": False,
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
                args.asset_repo,
                args.adapter,
                args.run_id,
                args.lease_token,
                args.cancel_token,
                args.candidate_commit,
            )
        ),
        "execute requires asset-repo/adapter/run/lease/cancel/commit",
    )
    verified_assets = H.verify_asset_checkout(
        Path(args.asset_repo).resolve(), package
    )
    adapter = load_adapter(args.adapter)
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
            "exact_asset_bytes": verified_assets,
        },
    )
    page_id = page.get("page_id")
    H.require(bool(page_id), "no candidate page id")
    H.require(page_id != protected["page_id"], "candidate page collision")

    asset_component_ids: dict[str, str] = {}
    asset_repo = Path(args.asset_repo).resolve()
    for item in package["assets"]:
        guard(adapter, args, f"asset:{item['asset_id']}")
        result = adapter.upsert_svg_asset_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=item["component_name"],
            svg_bytes=(asset_repo / item["source_path"]).read_bytes(),
            metadata={
                **item,
                "package_id": package["package_id"],
                "candidate_label": target["candidate_label"],
                "transformation": "NONE",
                "old_penpot_uuid_lineage": False,
            },
        )
        component_id = result.get("component_id")
        H.require(bool(component_id), f"{item['asset_id']}: no component id")
        asset_component_ids[item["asset_id"]] = component_id

    lockup_component_ids: dict[str, str] = {}
    for component in package["brand_components"]:
        if component["kind"] != "lockup":
            continue
        guard(adapter, args, f"lockup:{component['id']}")
        result = adapter.upsert_brand_lockup_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=component["penpot_name"],
            linked_asset_component_ids={
                asset_id: asset_component_ids[asset_id]
                for asset_id in component["asset_ids"]
            },
            component_spec=component,
            metadata={
                "package_id": package["package_id"],
                "source_component": package["source_components"][
                    "announcements_lockup"
                ],
                "detached_assets": False,
                "candidate_label": target["candidate_label"],
            },
        )
        component_id = result.get("component_id")
        H.require(bool(component_id), f"{component['id']}: no component id")
        lockup_component_ids[component["id"]] = component_id

    all_component_ids = list(asset_component_ids.values()) + list(
        lockup_component_ids.values()
    )
    H.require(len(all_component_ids) == 5, "component count before root")
    guard(adapter, args, "candidate-brandbook-root")
    root = adapter.upsert_brandbook_specimen(
        file_id=target["file_id"],
        page_id=page_id,
        exact_name=package["candidate_root"]["exact_name"],
        component_ids=all_component_ids,
        placements=package["specimen"]["placements"],
        misuse_rules=package["misuse_rules"],
        metadata={
            "package_id": package["package_id"],
            "candidate_label": target["candidate_label"],
            "owner_review_state": "NOT_ACCEPTED",
            "promotion_allowed": False,
            "linked_lockups": True,
            "resolved_assets": verified_assets,
        },
    )
    root_id = root.get("shape_id")
    H.require(bool(root_id), "no candidate root id")

    validation = adapter.validate(file_id=target["file_id"], page_id=page_id)
    H.require(validation.get("errors") in (None, []), f"validation: {validation}")
    export = adapter.export_png(
        file_id=target["file_id"], shape_id=root_id, scale=1.0
    )
    H.require(export.get("nonempty") is True, f"empty export: {export}")
    readback = adapter.readback(
        file_id=target["file_id"],
        page_id=page_id,
        shape_ids=all_component_ids + [root_id],
    )
    H.require(readback.get("instance_count") == 14, "instance count")
    H.require(readback.get("detached_instance_count") == 0, "detached instances")
    H.require(readback.get("screenshot_shape_count") == 0, "screenshot shapes")
    H.require(
        readback.get("linked_asset_instance_count") == 4,
        "linked lockup asset readback",
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
        "package_revision": 3,
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
        "asset_verification": {
            "before_any_asset_mutation": True,
            "assets": verified_assets,
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
            "components": len(all_component_ids),
            "instances": readback.get("instance_count"),
            "linked_asset_instances": readback.get("linked_asset_instance_count"),
            "detached_instances": readback.get("detached_instance_count"),
            "screenshot_shapes": readback.get("screenshot_shape_count"),
        },
        "created_or_reused": {
            "asset_component_ids": asset_component_ids,
            "lockup_component_ids": lockup_component_ids,
            "root_id": root_id,
        },
        "validation": validation,
        "export": export,
        "provenance_receipt": {
            "package_git_blob_sha1": package_identity["git_blob_sha1"],
            "asset_repository_commit": package["source_authority"][
                "asset_repository"
            ]["commit"],
            "asset_identities": verified_assets,
            "linked_lockups": True,
            "old_penpot_uuid_lineage": False,
            "accepted_consumer_geometry_claimed": False,
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
    H.require(counts == {
        "roots": 1,
        "components": 5,
        "instances": 14,
        "linked_asset_instances": 4,
        "detached_instances": 0,
        "screenshot_shapes": 0,
    }, "count contract")
    H.require(receipt["validation"].get("errors") in (None, []), "validation")
    H.require(receipt["export"].get("nonempty") is True, "empty export")
    H.require(receipt["provenance_receipt"]["linked_lockups"] is True, "unlinked")
    H.require(
        receipt["provenance_receipt"]["old_penpot_uuid_lineage"] is False,
        "old UUID lineage",
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("plan", "execute", "verify"))
    parser.add_argument("--repo")
    parser.add_argument("--package", default=DEFAULT_PACKAGE)
    parser.add_argument("--candidate-commit", required=True)
    parser.add_argument("--asset-repo")
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
        H.require(bool(args.asset_repo), "plan requires exact asset checkout")
        verified_assets = H.verify_asset_checkout(
            Path(args.asset_repo).resolve(), package
        )
        result = build_plan(
            package,
            package_identity,
            args.candidate_commit,
            validated,
            verified_assets,
        )
        marker = "F0_BRANDBOOK_V3_PLAN_PASS"
    elif args.mode == "execute":
        result = execute(package, package_identity, validated, args)
        marker = "F0_BRANDBOOK_V3_EXECUTE_PASS"
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
        marker = "F0_BRANDBOOK_V3_READBACK_PASS"

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
        print(f"F0_BRANDBOOK_V3_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)

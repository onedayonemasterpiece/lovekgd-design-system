#!/usr/bin/env python3
"""Dependency-gated current-target runner for Shared Foundation Bindings v5."""

from __future__ import annotations

import argparse
import hashlib
import importlib
import importlib.util
import json
import subprocess
from pathlib import Path
import sys
from typing import Any

DEFAULT_PACKAGE = (
    "catalog/asp-production-conveyor-v3/f0/"
    "F-SHARED-FOUNDATION-BINDINGS.package.v5.json"
)


def load_helper() -> Any:
    path = Path(__file__).with_name("f0_shared_bindings_contract_v5.py")
    spec = importlib.util.spec_from_file_location(
        "f0_shared_bindings_contract_v5", path
    )
    if spec is None or spec.loader is None:
        raise AssertionError(f"cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


H = load_helper()


def load_package(
    repo: Path, relative_path: str, checkout_specs: list[str]
) -> tuple[
    dict[str, Any],
    dict[str, Any],
    dict[str, Any],
    dict[str, Any],
    list[dict[str, Any]],
]:
    data = (repo / relative_path).read_bytes()
    package = json.loads(data)
    package_identity = H.identity(data)
    validated = H.validate_model(package)
    shared_inputs = H.verify_shared_checkout(repo, package)
    checkouts = H.parse_checkout_specs(checkout_specs)
    producer_inputs = H.verify_producer_checkouts(package, checkouts)
    return package, package_identity, validated, shared_inputs, producer_inputs


def load_adapter(spec: str, package: dict[str, Any]) -> Any:
    H.require(":" in spec, "--adapter must be module:factory")
    module_name, factory_name = spec.split(":", 1)
    adapter = getattr(importlib.import_module(module_name), factory_name)()
    missing = [
        name
        for name in package["adapter_contract"]["method_surface"]
        if not callable(getattr(adapter, name, None))
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
    shared_inputs: dict[str, Any],
    producer_inputs: list[dict[str, Any]],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        "candidate_branch": package["branch"],
        "candidate_commit": candidate_commit,
        "package_path": package["immutable_identity"]["package_path"],
        "package_identity": package_identity,
        "shared_checkout_inputs": shared_inputs,
        "producer_inputs": producer_inputs,
    }


def build_plan(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    validated: dict[str, Any],
    shared_inputs: dict[str, Any],
    producer_inputs: list[dict[str, Any]],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        "schema_version": "kenigevents.f0-shared-bindings-plan.v5",
        "marker": "F0_SHARED_BINDINGS_V5_PLAN_PASS",
        "status": "READY_FOR_D0_INTEGRATE",
        "dependency_state": "AWAITING_SIX_D0_INTEGRATE_PASS",
        "ready_to_publish": False,
        "ready_to_promote": False,
        "immutable_inputs": immutable_inputs(
            package,
            package_identity,
            shared_inputs,
            producer_inputs,
            candidate_commit,
        ),
        "target": package["target_penpot_page"],
        "protected_surface": package["protected_surface"],
        "producer_dependencies": producer_inputs,
        "binding_components": package["binding_components"],
        "specimen": package["specimen"],
        "validated": validated,
        "expected": {
            "roots": 1,
            "components": 10,
            "instances": 34,
            "detached_instances": 0,
            "screenshot_shapes": 0,
            "validation_errors": [],
        },
        "write_contract": {
            "writer": "D0/PUBLISH_ONLY",
            "six_dependency_pass_receipts_before_adapter_load": True,
            "candidate_build_not_accepted": True,
            "protected_surface_mutation_allowed": False,
            "consumer_defects_closed": False,
            "visual_acceptance_claimed": False,
        },
    }


def execute(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    validated: dict[str, Any],
    shared_inputs: dict[str, Any],
    producer_inputs: list[dict[str, Any]],
    args: argparse.Namespace,
) -> dict[str, Any]:
    H.require(
        all(
            (
                args.dependency_receipts_dir,
                args.adapter,
                args.run_id,
                args.lease_token,
                args.cancel_token,
                args.candidate_commit,
            )
        ),
        "execute requires receipts/adapter/run/lease/cancel/commit",
    )
    # Critical: all six exact PASS receipts are validated before adapter import/load.
    dependency_receipts = H.load_dependency_receipts(
        Path(args.dependency_receipts_dir).resolve(), package
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
            "package_revision": 5,
            "candidate_commit": args.candidate_commit,
            "package_blob_sha1": package_identity["git_blob_sha1"],
            "candidate_label": target["candidate_label"],
            "owner_review_state": "NOT_ACCEPTED",
            "dependency_receipts": dependency_receipts,
            "producer_inputs": producer_inputs,
        },
    )
    page_id = page.get("page_id")
    H.require(bool(page_id), "no candidate page id")
    H.require(page_id != protected["page_id"], "candidate page collision")

    component_ids: list[str] = []
    for component in package["binding_components"]:
        guard(adapter, args, f"component:{component['id']}")
        result = adapter.upsert_foundation_binding_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=component["penpot_name"],
            binding=component,
            metadata={
                "package_id": package["package_id"],
                "stable_id": component["id"],
                "source_package": component["source_package"],
                "dependency_receipts": dependency_receipts,
                "candidate_label": target["candidate_label"],
                "consumer_defects_closed": False,
            },
        )
        component_id = result.get("component_id")
        H.require(bool(component_id), f"{component['id']}: no component id")
        component_ids.append(component_id)

    H.require(len(component_ids) == 10, "component count before root")
    guard(adapter, args, "candidate-binding-root")
    root = adapter.upsert_binding_specimen(
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
            "dependency_receipts": dependency_receipts,
            "consumer_defect_boundaries": package["consumer_defect_boundaries"],
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
        shape_ids=component_ids + [root_id],
    )
    H.require(readback.get("instance_count") == 34, "instance count")
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
        "package_revision": 5,
        "status": "CANDIDATE_MATERIALIZED_PENDING_V0",
        "materialization_state": "VISIBLE_CANDIDATE",
        "promotion_state": "BLOCKED_UNTIL_V0_REVIEW",
        "owner_review_state": "NOT_ACCEPTED",
        "writer": "D0/PUBLISH",
        "immutable_inputs": immutable_inputs(
            package,
            package_identity,
            shared_inputs,
            producer_inputs,
            args.candidate_commit,
        ),
        "dependency_integration_receipts": dependency_receipts,
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
            "producer_inputs": producer_inputs,
            "dependency_receipts": dependency_receipts,
            "conditional_old_passes_inherited": False,
            "consumer_defects_closed": False,
            "old_penpot_uuid_lineage": False,
            "visual_acceptance_claimed": False,
        },
    }


def verify(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    shared_inputs: dict[str, Any],
    producer_inputs: list[dict[str, Any]],
    candidate_commit: str,
    receipt: dict[str, Any],
) -> None:
    H.require(receipt.get("marker") == "ASP_BUILD_RESULT_V3", "wrong marker")
    H.require(receipt.get("package_id") == package["package_id"], "wrong package")
    H.require(receipt.get("package_revision") == 5, "wrong revision")
    H.require(receipt.get("writer") == "D0/PUBLISH", "wrong writer")
    H.require(
        receipt.get("immutable_inputs")
        == immutable_inputs(
            package,
            package_identity,
            shared_inputs,
            producer_inputs,
            candidate_commit,
        ),
        "immutable input mismatch",
    )
    H.require(len(receipt["dependency_integration_receipts"]) == 6, "receipt count")
    H.require(receipt.get("owner_review_state") == "NOT_ACCEPTED", "acceptance leak")
    H.require(receipt["target"]["file_id"] == H.CURRENT_FILE_ID, "stale target")
    H.require(receipt["protected_surface"]["mutated"] is False, "protected mutation")
    H.require(
        receipt["protected_surface"]["before_digest"]
        == receipt["protected_surface"]["after_digest"],
        "protected digest drift",
    )
    H.require(
        receipt["counts"]
        == {
            "roots": 1,
            "components": 10,
            "instances": 34,
            "detached_instances": 0,
            "screenshot_shapes": 0,
        },
        "count contract",
    )
    H.require(receipt["validation"].get("errors") in (None, []), "validation")
    H.require(receipt["export"].get("nonempty") is True, "empty export")
    H.require(
        receipt["provenance_receipt"]["conditional_old_passes_inherited"] is False,
        "old PASS inheritance",
    )
    H.require(
        receipt["provenance_receipt"]["consumer_defects_closed"] is False,
        "consumer defect closure leak",
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("plan", "execute", "verify"))
    parser.add_argument("--repo")
    parser.add_argument("--package", default=DEFAULT_PACKAGE)
    parser.add_argument("--candidate-commit", required=True)
    parser.add_argument("--producer-checkout", action="append", default=[])
    parser.add_argument("--dependency-receipts-dir")
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
    (
        package,
        package_identity,
        validated,
        shared_inputs,
        producer_inputs,
    ) = load_package(repo, args.package, args.producer_checkout)

    if args.mode == "plan":
        result = build_plan(
            package,
            package_identity,
            validated,
            shared_inputs,
            producer_inputs,
            args.candidate_commit,
        )
        marker = "F0_SHARED_BINDINGS_V5_PLAN_PASS"
    elif args.mode == "execute":
        result = execute(
            package,
            package_identity,
            validated,
            shared_inputs,
            producer_inputs,
            args,
        )
        marker = "F0_SHARED_BINDINGS_V5_EXECUTE_PASS"
    else:
        H.require(bool(args.receipt), "verify requires --receipt")
        receipt = json.loads(Path(args.receipt).read_text(encoding="utf-8"))
        verify(
            package,
            package_identity,
            shared_inputs,
            producer_inputs,
            args.candidate_commit,
            receipt,
        )
        result = {
            "status": "CANDIDATE_READBACK_VERIFIED",
            "owner_review_state": "NOT_ACCEPTED",
            "immutable_inputs": immutable_inputs(
                package,
                package_identity,
                shared_inputs,
                producer_inputs,
                args.candidate_commit,
            ),
        }
        marker = "F0_SHARED_BINDINGS_V5_READBACK_PASS"

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
        subprocess.CalledProcessError,
        TypeError,
        json.JSONDecodeError,
    ) as exc:
        print(f"F0_SHARED_BINDINGS_V5_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)

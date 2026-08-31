#!/usr/bin/env python3
"""Bounded candidate materializer for F-FOUNDATIONS-SPECIMENS v3.

The v3 package intentionally separates candidate materialization from promotion.
Only D0/PUBLISH may mutate Penpot. Every mutation is preceded by an ACTIVE
lease/cancel check, and the current free-collection surface is read back before
and after the candidate batch to prove that it was not changed.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib
import json
from pathlib import Path
import sys
from typing import Any

DEFAULT_PACKAGE = (
    "catalog/asp-production-conveyor-v3/f0/"
    "F-FOUNDATIONS-SPECIMENS.package.v3.json"
)
CURRENT_FILE_ID = "40e06342-8830-80d6-8008-8fc8a3a4cd4f"


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


def load_json_with_identity(
    repo: Path, relative_path: str
) -> tuple[dict[str, Any], dict[str, Any]]:
    data = (repo / relative_path).read_bytes()
    return json.loads(data), identity(data)


def load_package(
    repo: Path, relative_path: str
) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any], dict[str, Any]]:
    package, package_identity = load_json_with_identity(repo, relative_path)
    require(package.get("package_id") == "F-FOUNDATIONS-SPECIMENS", "wrong package_id")
    require(package.get("revision") == 3, "wrong package revision")
    require(
        package.get("status") == "READY_TO_MATERIALIZE_CANDIDATE",
        "package is not a candidate-materialization input",
    )

    source_ref = package["source_package_v2"]
    source, source_identity = load_json_with_identity(repo, source_ref["path"])
    require(source.get("package_id") == package["package_id"], "wrong source package_id")
    require(source.get("revision") == 2, "wrong source package revision")
    for field in ("git_blob_sha1", "bytes"):
        require(
            source_identity[field] == source_ref[field],
            f"source package {field} mismatch",
        )
    return package, package_identity, source, source_identity


def validate_model(
    package: dict[str, Any], source: dict[str, Any]
) -> dict[str, Any]:
    values = source["specimens"]
    components = source["specimen_components"]
    specimen = source["materialization_entry_point"]["specimen"]
    placements = specimen["placements"]

    require(len(values["colors"]) == 18, "expected 18 colors")
    require(len(values["status_pairs"]) == 4, "expected four status pairs")
    # v2 incorrectly indexed spacing['scale']; spacing is the direct 10-entry map.
    require(len(values["spacing"]) == 10, "expected ten direct spacing values")
    require(len(values["sizing"]) == 4, "expected four sizing values")
    require(len(values["radii"]) == 5, "expected five radii")
    require(len(values["shadows"]) == 3, "expected three shadows")
    require(len(values["motion"]) == 4, "expected four motion facts")
    require(len(values["accessibility"]) == 5, "expected five accessibility facts")
    require(values["sizing"]["control_min"] == "44px", "control_min drift")
    require(values["sizing"]["content_max"] == "1180px", "content_max drift")
    require(
        values["sizing"]["content_wide_max"] == "1440px",
        "content_wide_max drift",
    )
    require(values["motion"]["duration_fast"] == "160ms", "fast duration drift")
    require(values["motion"]["duration_base"] == "220ms", "base duration drift")
    require(
        values["motion"]["ease_standard"]
        == "cubic-bezier(0.2, 0.8, 0.2, 1)",
        "easing drift",
    )
    require(
        values["motion"]["reduced_motion"] == "mandatory-no-op",
        "reduced-motion drift",
    )

    require(len(components) == package["expected_components"] == 8, "component count")
    require(len(placements) == package["expected_instances"] == 57, "placement count")
    require(
        len({item["id"] for item in placements}) == len(placements),
        "duplicate placement ID",
    )
    require(package["expected_roots"] == 1, "root count")
    require(
        source["asset_registry_applicability"]["external_asset_slots"] == 0,
        "unexpected external asset slot",
    )

    target = package["target_penpot_page"]
    protected = package["protected_surface"]
    require(target["file_id"] == CURRENT_FILE_ID, "stale Penpot file target")
    require(protected["file_id"] == CURRENT_FILE_ID, "protected file mismatch")
    require(
        target["exact_name"] != protected["page_name"],
        "candidate page must be separate from protected free page",
    )
    require(target["candidate_label"] == "CANDIDATE_BUILD_NOT_ACCEPTED", "candidate label")
    require(protected["mutation_allowed"] is False, "protected mutation must be false")
    require(bool(protected["root_ids"]), "protected root IDs required")

    return {
        "colors": 18,
        "status_pairs": 4,
        "spacing_values": 10,
        "sizing_values": 4,
        "radii": 5,
        "shadows": 3,
        "motion_facts": 4,
        "accessibility_facts": 5,
        "components": 8,
        "placements": 57,
    }


def immutable_inputs(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    source_identity: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        "candidate_branch": package["branch"],
        "candidate_commit": candidate_commit,
        "package_path": package["immutable_identity"]["package_path"],
        "package_identity": package_identity,
        "source_package_v2": {
            **package["source_package_v2"],
            "actual_identity": source_identity,
        },
    }


def stable_readback_digest(value: Any) -> str:
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

    encoded = json.dumps(clean(value), ensure_ascii=False, sort_keys=True).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def load_adapter(spec: str) -> Any:
    require(":" in spec, "--adapter must be module:factory")
    module_name, factory_name = spec.split(":", 1)
    adapter = getattr(importlib.import_module(module_name), factory_name)()
    required = (
        "read_document",
        "assert_active_lease",
        "ensure_page",
        "upsert_foundation_specimen_component",
        "upsert_foundation_specimen_root",
        "validate",
        "export_png",
        "readback",
    )
    missing = [
        name for name in required if not callable(getattr(adapter, name, None))
    ]
    require(not missing, f"native adapter missing methods: {missing}")
    return adapter


def guard(adapter: Any, args: argparse.Namespace, operation: str) -> None:
    state = adapter.assert_active_lease(
        run_id=args.run_id,
        lease_token=args.lease_token,
        cancel_token=args.cancel_token,
    )
    require(state.get("active") is True, f"inactive before {operation}: {state}")
    require(state.get("cancelled") is not True, f"cancelled before {operation}: {state}")


def build_plan(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    source: dict[str, Any],
    source_identity: dict[str, Any],
    candidate_commit: str,
    validated: dict[str, Any],
) -> dict[str, Any]:
    return {
        "schema_version": "kenigevents.f0-foundation-specimens-candidate-plan.v3",
        "marker": "F0_FOUNDATION_SPECIMENS_CANDIDATE_PLAN_PASS",
        "package_id": package["package_id"],
        "materialization_state": package["status"],
        "promotion_state": package["promotion_state"],
        "immutable_inputs": immutable_inputs(
            package, package_identity, source_identity, candidate_commit
        ),
        "target": package["target_penpot_page"],
        "protected_surface": package["protected_surface"],
        "components": source["specimen_components"],
        "specimen": {
            **source["materialization_entry_point"]["specimen"],
            "name": package["candidate_root"]["exact_name"],
            "candidate_label": package["target_penpot_page"]["candidate_label"],
        },
        "validated": validated,
        "expected": {
            "roots": package["expected_roots"],
            "components": package["expected_components"],
            "instances": package["expected_instances"],
        },
        "write_contract": {
            "writer": "D0/PUBLISH_ONLY",
            "guard_before_every_mutation": True,
            "candidate_build_not_accepted": True,
            "protected_surface_mutation_allowed": False,
            "external_asset_slots": 0,
            "consumer_geometry_claimed": False,
            "visual_acceptance_claimed": False,
        },
    }


def execute(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    source: dict[str, Any],
    source_identity: dict[str, Any],
    args: argparse.Namespace,
) -> dict[str, Any]:
    require(
        all(
            (
                args.adapter,
                args.run_id,
                args.lease_token,
                args.cancel_token,
                args.candidate_commit,
            )
        ),
        "execute requires adapter/run/lease/cancel/candidate-commit",
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
    protected_before_digest = stable_readback_digest(protected_before)

    guard(adapter, args, "ensure-candidate-page")
    page = adapter.ensure_page(
        file_id=target["file_id"],
        exact_name=target["exact_name"],
        metadata={
            "package_id": package["package_id"],
            "package_revision": package["revision"],
            "candidate_commit": args.candidate_commit,
            "package_blob_sha1": package_identity["git_blob_sha1"],
            "source_package_blob_sha1": source_identity["git_blob_sha1"],
            "candidate_label": target["candidate_label"],
            "owner_review_state": "NOT_ACCEPTED",
        },
    )
    page_id = page.get("page_id")
    require(bool(page_id), "ensure_page returned no page_id")
    require(page_id != protected["page_id"], "candidate page resolved to protected page")

    component_ids: list[str] = []
    for component in source["specimen_components"]:
        guard(adapter, args, f"component:{component['id']}")
        result = adapter.upsert_foundation_specimen_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=component["penpot_name"],
            component_spec=component,
            values=source["specimens"][component["value_domain"]],
            metadata={
                "package_id": package["package_id"],
                "stable_id": component["id"],
                "source_commit": source["source_authority"]["astro"]["commit"],
                "source_hashes": source["source_authority"]["runtime_files"],
                "candidate_label": target["candidate_label"],
                "owner_review_state": "NOT_ACCEPTED",
            },
        )
        component_id = result.get("component_id")
        require(bool(component_id), f"{component['id']}: no component_id")
        component_ids.append(component_id)

    source_specimen = source["materialization_entry_point"]["specimen"]
    guard(adapter, args, "candidate-specimen-root")
    root = adapter.upsert_foundation_specimen_root(
        file_id=target["file_id"],
        page_id=page_id,
        exact_name=package["candidate_root"]["exact_name"],
        component_ids=component_ids,
        placements=source_specimen["placements"],
        metadata={
            "package_id": package["package_id"],
            "package_revision": package["revision"],
            "candidate_label": target["candidate_label"],
            "owner_review_state": "NOT_ACCEPTED",
            "promotion_allowed": False,
            "external_asset_slots": 0,
            "accepted_consumer_geometry_claimed": False,
        },
    )
    root_id = root.get("shape_id")
    require(bool(root_id), "candidate root returned no shape_id")

    validation = adapter.validate(file_id=target["file_id"], page_id=page_id)
    require(validation.get("errors") in (None, []), f"validation failed: {validation}")

    export = adapter.export_png(
        file_id=target["file_id"], shape_id=root_id, scale=1.0
    )
    require(export.get("nonempty") is True, f"empty candidate export: {export}")

    candidate_readback = adapter.readback(
        file_id=target["file_id"],
        page_id=page_id,
        shape_ids=component_ids + [root_id],
    )
    protected_after = adapter.readback(
        file_id=protected["file_id"],
        page_id=protected["page_id"],
        shape_ids=protected["root_ids"],
    )
    protected_after_digest = stable_readback_digest(protected_after)
    require(
        protected_after_digest == protected_before_digest,
        "protected free-collection surface changed",
    )
    after_document = adapter.read_document(file_id=target["file_id"])

    return {
        "schema_version": "kenigevents.asp-build-result-v2",
        "marker": "ASP_BUILD_RESULT_V2",
        "package_id": package["package_id"],
        "package_revision": package["revision"],
        "status": "CANDIDATE_MATERIALIZED_PENDING_V0",
        "materialization_state": "VISIBLE_CANDIDATE",
        "promotion_state": "BLOCKED_UNTIL_V0_REVIEW",
        "owner_review_state": "NOT_ACCEPTED",
        "writer": "D0/PUBLISH",
        "immutable_inputs": immutable_inputs(
            package, package_identity, source_identity, args.candidate_commit
        ),
        "run_control": {
            "run_id": args.run_id,
            "actor_type": "D0_CHILD",
            "actor_id": "D0/PUBLISH",
            "triggered_by": package["package_id"],
            "lease_token_sha256": hashlib.sha256(
                args.lease_token.encode("utf-8")
            ).hexdigest(),
            "cancel_token_sha256": hashlib.sha256(
                args.cancel_token.encode("utf-8")
            ).hexdigest(),
            "guard_before_every_mutation": True,
        },
        "target": {
            "file_id": target["file_id"],
            "page_id": page_id,
            "page_name": target["exact_name"],
            "candidate_label": target["candidate_label"],
            "root_id": root_id,
            "root_name": package["candidate_root"]["exact_name"],
        },
        "protected_surface": {
            **protected,
            "before_digest": protected_before_digest,
            "after_digest": protected_after_digest,
            "mutated": False,
        },
        "revision": {
            "before": before_document.get("revision"),
            "after": after_document.get("revision"),
        },
        "counts": {
            "roots": 1,
            "components": len(component_ids),
            "instances": candidate_readback.get("instance_count"),
            "detached_instances": candidate_readback.get(
                "detached_instance_count"
            ),
            "screenshot_shapes": candidate_readback.get(
                "screenshot_shape_count"
            ),
        },
        "mutated_object_ids": component_ids + [root_id],
        "created_or_reused": {
            "component_ids": component_ids,
            "root_id": root_id,
        },
        "validation": validation,
        "export": export,
        "provenance_receipt": {
            "contract_sha256": source["source_authority"][
                "requirements_contract"
            ]["sha256"],
            "package_git_blob_sha1": package_identity["git_blob_sha1"],
            "source_package_git_blob_sha1": source_identity["git_blob_sha1"],
            "runtime_source_hashes": source["source_authority"]["runtime_files"],
            "asset_binding_digest": "NO_EXTERNAL_GRAPHICAL_ASSET_SLOTS",
            "geometry_proof_digest": hashlib.sha256(
                json.dumps(
                    {
                        "components": source["specimen_components"],
                        "placements": source_specimen["placements"],
                        "values": source["specimens"],
                    },
                    sort_keys=True,
                    ensure_ascii=False,
                ).encode("utf-8")
            ).hexdigest(),
            "accepted_consumer_root_geometry_claimed": False,
            "candidate_build_not_accepted": True,
        },
    }


def verify(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    source_identity: dict[str, Any],
    candidate_commit: str,
    receipt: dict[str, Any],
) -> None:
    require(receipt.get("marker") == "ASP_BUILD_RESULT_V2", "wrong receipt marker")
    require(receipt.get("package_id") == package["package_id"], "wrong package")
    require(receipt.get("package_revision") == package["revision"], "wrong revision")
    require(receipt.get("writer") == "D0/PUBLISH", "wrong writer")
    require(
        receipt.get("immutable_inputs")
        == immutable_inputs(
            package, package_identity, source_identity, candidate_commit
        ),
        "immutable input mismatch",
    )
    require(
        receipt.get("status") == "CANDIDATE_MATERIALIZED_PENDING_V0",
        "wrong candidate status",
    )
    require(receipt.get("owner_review_state") == "NOT_ACCEPTED", "acceptance leak")
    target = receipt["target"]
    require(target["file_id"] == CURRENT_FILE_ID, "wrong Penpot file")
    require(
        target["candidate_label"] == "CANDIDATE_BUILD_NOT_ACCEPTED",
        "missing candidate label",
    )
    require(
        target["page_id"] != package["protected_surface"]["page_id"],
        "candidate page is protected page",
    )
    protected = receipt["protected_surface"]
    require(protected["mutation_allowed"] is False, "protected mutation allowed")
    require(protected["mutated"] is False, "protected surface mutated")
    require(
        protected["before_digest"] == protected["after_digest"],
        "protected digest changed",
    )
    require(
        receipt["run_control"]["guard_before_every_mutation"] is True,
        "missing per-write guard",
    )
    counts = receipt["counts"]
    require(counts["roots"] == package["expected_roots"], "root count mismatch")
    require(
        counts["components"] == package["expected_components"],
        "component count mismatch",
    )
    require(
        counts["instances"] == package["expected_instances"],
        "instance count mismatch",
    )
    require(counts["detached_instances"] == 0, "detached instance found")
    require(counts["screenshot_shapes"] == 0, "screenshot shape found")
    require(receipt["validation"].get("errors") in (None, []), "validation errors")
    require(receipt["export"].get("nonempty") is True, "empty export")
    provenance = receipt["provenance_receipt"]
    require(
        provenance["asset_binding_digest"]
        == "NO_EXTERNAL_GRAPHICAL_ASSET_SLOTS",
        "unexpected asset binding",
    )
    require(
        provenance["accepted_consumer_root_geometry_claimed"] is False,
        "consumer geometry claim",
    )
    require(provenance["candidate_build_not_accepted"] is True, "promotion leak")


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

    repo = Path(args.repo).resolve() if args.repo else Path(__file__).resolve().parents[3]
    package, package_identity, source, source_identity = load_package(
        repo, args.package
    )
    validated = validate_model(package, source)

    if args.mode == "plan":
        result = build_plan(
            package,
            package_identity,
            source,
            source_identity,
            args.candidate_commit,
            validated,
        )
        marker = "F0_FOUNDATION_SPECIMENS_CANDIDATE_PLAN_PASS"
    elif args.mode == "execute":
        result = execute(
            package,
            package_identity,
            source,
            source_identity,
            args,
        )
        marker = "F0_FOUNDATION_SPECIMENS_CANDIDATE_EXECUTE_PASS"
    else:
        require(bool(args.receipt), "verify requires --receipt")
        receipt = json.loads(Path(args.receipt).read_text(encoding="utf-8"))
        verify(
            package,
            package_identity,
            source_identity,
            args.candidate_commit,
            receipt,
        )
        result = {
            "status": "CANDIDATE_READBACK_VERIFIED",
            "owner_review_state": "NOT_ACCEPTED",
            "immutable_inputs": immutable_inputs(
                package, package_identity, source_identity, args.candidate_commit
            ),
        }
        marker = "F0_FOUNDATION_SPECIMENS_CANDIDATE_READBACK_PASS"

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
        print(f"F0_FOUNDATION_SPECIMENS_CANDIDATE_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)

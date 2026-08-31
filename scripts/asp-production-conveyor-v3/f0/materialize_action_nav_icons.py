#!/usr/bin/env python3
"""Bounded F0 action/navigation Penpot runner and §2.7 readback verifier.

F0 owns package decisions but never owns a Penpot lease.  `plan` is Git-only.
`execute` requires an explicit D0/PUBLISH adapter and calls its lease/cancel
guard before every mutating operation.  `verify` validates the resulting
receipt without contacting Penpot.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib
import json
from pathlib import Path
import sys
from typing import Any, Protocol

PACKAGE_PATH = (
    "catalog/asp-production-conveyor-v3/f0/"
    "F-ACTION-NAV-ICONS.package.v2.json"
)
SUCCESS_PLAN = "F0_ACTION_NAV_PLAN_PASS"
SUCCESS_EXECUTE = "F0_ACTION_NAV_EXECUTE_PASS"
SUCCESS_VERIFY = "F0_ACTION_NAV_READBACK_PASS"
FAIL = "F0_ACTION_NAV_FAIL"


class Adapter(Protocol):
    """D0/PUBLISH-supplied native Penpot adapter."""

    def read_document(self, *, file_id: str) -> dict[str, Any]: ...

    def assert_active_lease(
        self, *, run_id: str, lease_token: str, cancel_token: str
    ) -> dict[str, Any]: ...

    def ensure_page(
        self,
        *,
        file_id: str,
        exact_name: str,
        metadata: dict[str, Any],
    ) -> dict[str, Any]: ...

    def upsert_svg_component(
        self,
        *,
        file_id: str,
        page_id: str,
        exact_name: str,
        svg_bytes: bytes,
        metadata: dict[str, Any],
        variants: list[dict[str, Any]],
    ) -> dict[str, Any]: ...

    def upsert_specimen(
        self,
        *,
        file_id: str,
        page_id: str,
        exact_name: str,
        component_ids: list[str],
        metadata: dict[str, Any],
    ) -> dict[str, Any]: ...

    def validate(self, *, file_id: str, page_id: str) -> dict[str, Any]: ...

    def export_png(
        self, *, file_id: str, shape_id: str, scale: float
    ) -> dict[str, Any]: ...

    def readback(
        self, *, file_id: str, page_id: str, shape_ids: list[str]
    ) -> dict[str, Any]: ...


def identity(data: bytes) -> dict[str, Any]:
    return {
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "git_blob_sha1": hashlib.sha1(
            f"blob {len(data)}\0".encode("ascii") + data
        ).hexdigest(),
    }


def load_package(repo: Path, package_path: str) -> tuple[Path, dict[str, Any]]:
    path = (repo / package_path).resolve()
    if not path.is_file():
        raise AssertionError(f"missing package: {path}")
    package = json.loads(path.read_text(encoding="utf-8"))
    if package.get("package_id") != "F-ACTION-NAV-ICONS":
        raise AssertionError("wrong package_id")
    if package.get("status") not in {
        "READY_FOR_D0_INTEGRATE",
        "READY_TO_PUBLISH",
    }:
        raise AssertionError("package lifecycle state is not consumable")
    return path, package


def validate_inputs(repo: Path, package: dict[str, Any]) -> list[dict[str, Any]]:
    seen: set[tuple[str, str]] = set()
    validated: list[dict[str, Any]] = []
    for asset in package["assets_and_hashes"]:
        key = (asset["asset_id"], asset["variant"])
        if key in seen:
            raise AssertionError(f"duplicate asset variant: {key}")
        seen.add(key)
        path = repo / asset["path"]
        if not path.is_file():
            raise AssertionError(f"missing asset: {asset['path']}")
        data = path.read_bytes()
        actual = identity(data)
        for field in ("bytes", "sha256", "git_blob_sha1"):
            if actual[field] != asset[field]:
                raise AssertionError(
                    f"{asset['asset_id']}:{asset['variant']} {field}: "
                    f"expected {asset[field]}, got {actual[field]}"
                )
        if b"<svg" not in data or b"</svg>" not in data:
            raise AssertionError(f"not standalone SVG: {asset['path']}")
        validated.append(
            {
                "asset_id": asset["asset_id"],
                "variant": asset["variant"],
                "path": asset["path"],
                **actual,
            }
        )

    expected = {
        ("icon.action.not_interested", "default"),
        ("icon.action.calendar_add", "default"),
        ("icon.action.share", "default"),
        ("icon.action.favorite", "outline"),
        ("icon.action.favorite", "solid"),
        ("icon.navigation.afisha", "default"),
        ("icon.navigation.dates", "default"),
        ("icon.navigation.search", "default"),
        ("icon.navigation.personal", "default"),
    }
    if seen != expected:
        raise AssertionError(
            f"asset coverage mismatch: missing={sorted(expected-seen)}, "
            f"extra={sorted(seen-expected)}"
        )
    return validated


def build_plan(package_path: Path, package: dict[str, Any]) -> dict[str, Any]:
    target = package["target_penpot_page"]
    components: dict[str, list[dict[str, Any]]] = {}
    for asset in package["assets_and_hashes"]:
        components.setdefault(asset["component_name"], []).append(
            {
                "asset_id": asset["asset_id"],
                "variant": asset["variant"],
                "path": asset["path"],
                "sha256": asset["sha256"],
                "git_blob_sha1": asset["git_blob_sha1"],
            }
        )
    return {
        "schema_version": "kenigevents.f0-action-nav-materialization-plan.v2",
        "package_id": package["package_id"],
        "package_path": str(package_path),
        "package_blob_sha1": package["immutable_identity"]["package_blob_sha1"],
        "candidate_commit": package["immutable_identity"]["candidate_commit"],
        "file_id": target["file_id"],
        "library_page": {
            "exact_name": target["exact_name"],
            "create_if_missing": target["create_if_missing"],
        },
        "consumer_evidence": {
            "page_id": target["consumer_evidence_page_id"],
            "rejected_root_id": target["consumer_evidence_rejected_root_id"],
            "mutation_allowed": False,
        },
        "components": [
            {"component_name": name, "variants": variants}
            for name, variants in sorted(components.items())
        ],
        "specimens": package["materialization_entry_point"]["specimens"],
        "expected": {
            "roots": package["expected_roots"],
            "components": package["expected_components"],
            "instances": package["expected_instances"],
        },
        "guard": {
            "before_every_mutation": "adapter.assert_active_lease",
            "required": True,
            "writer": "D0/PUBLISH_ONLY",
        },
    }


def load_adapter(spec: str) -> Adapter:
    if ":" not in spec:
        raise AssertionError("--adapter must be module:factory")
    module_name, factory_name = spec.split(":", 1)
    module = importlib.import_module(module_name)
    factory = getattr(module, factory_name)
    adapter = factory()
    required = (
        "read_document",
        "assert_active_lease",
        "ensure_page",
        "upsert_svg_component",
        "upsert_specimen",
        "validate",
        "export_png",
        "readback",
    )
    missing = [name for name in required if not callable(getattr(adapter, name, None))]
    if missing:
        raise AssertionError(f"adapter missing methods: {missing}")
    return adapter


def guarded(
    adapter: Adapter,
    *,
    run_id: str,
    lease_token: str,
    cancel_token: str,
    operation: str,
    call: Any,
) -> dict[str, Any]:
    guard = adapter.assert_active_lease(
        run_id=run_id, lease_token=lease_token, cancel_token=cancel_token
    )
    if guard.get("active") is not True or guard.get("cancelled") is True:
        raise AssertionError(f"guard rejected before {operation}: {guard}")
    result = call()
    if not isinstance(result, dict):
        raise AssertionError(f"{operation} returned non-object")
    return result


def execute(
    repo: Path,
    package_path: Path,
    package: dict[str, Any],
    args: argparse.Namespace,
) -> dict[str, Any]:
    if not args.adapter or not args.run_id or not args.lease_token or not args.cancel_token:
        raise AssertionError(
            "execute requires --adapter, --run-id, --lease-token and --cancel-token"
        )
    adapter = load_adapter(args.adapter)
    target = package["target_penpot_page"]
    file_id = target["file_id"]
    before = adapter.read_document(file_id=file_id)
    page = guarded(
        adapter,
        run_id=args.run_id,
        lease_token=args.lease_token,
        cancel_token=args.cancel_token,
        operation="ensure_page",
        call=lambda: adapter.ensure_page(
            file_id=file_id,
            exact_name=target["exact_name"],
            metadata={
                "package_id": package["package_id"],
                "candidate_commit": package["immutable_identity"]["candidate_commit"],
                "package_blob_sha1": package["immutable_identity"]["package_blob_sha1"],
            },
        ),
    )
    page_id = page.get("page_id")
    if not page_id:
        raise AssertionError("ensure_page returned no page_id")

    variants_by_component: dict[str, list[dict[str, Any]]] = {}
    for asset in package["assets_and_hashes"]:
        variants_by_component.setdefault(asset["component_name"], []).append(asset)

    component_results: list[dict[str, Any]] = []
    for component_name, variants in sorted(variants_by_component.items()):
        primary = sorted(variants, key=lambda item: item["variant"])[0]
        svg_bytes = (repo / primary["path"]).read_bytes()
        component = guarded(
            adapter,
            run_id=args.run_id,
            lease_token=args.lease_token,
            cancel_token=args.cancel_token,
            operation=f"upsert_svg_component:{component_name}",
            call=lambda component_name=component_name, variants=variants,
            svg_bytes=svg_bytes: adapter.upsert_svg_component(
                file_id=file_id,
                page_id=page_id,
                exact_name=component_name,
                svg_bytes=svg_bytes,
                metadata={
                    "package_id": package["package_id"],
                    "canonical_id": variants[0]["asset_id"],
                    "source_commit": variants[0]["source_commit"],
                    "variant_hashes": {
                        item["variant"]: item["sha256"] for item in variants
                    },
                    "viewBox": variants[0]["viewBox"],
                    "fill_stroke_contract": variants[0][
                        "fill_stroke_contract"
                    ],
                },
                variants=[
                    {
                        "name": item["variant"],
                        "svg_bytes": (repo / item["path"]).read_bytes(),
                        "sha256": item["sha256"],
                    }
                    for item in variants
                ],
            ),
        )
        if not component.get("component_id"):
            raise AssertionError(f"{component_name}: no component_id")
        component_results.append(component)

    component_ids = [item["component_id"] for item in component_results]
    specimen_results: list[dict[str, Any]] = []
    for specimen in package["materialization_entry_point"]["specimens"]:
        result = guarded(
            adapter,
            run_id=args.run_id,
            lease_token=args.lease_token,
            cancel_token=args.cancel_token,
            operation=f"upsert_specimen:{specimen['name']}",
            call=lambda specimen=specimen: adapter.upsert_specimen(
                file_id=file_id,
                page_id=page_id,
                exact_name=specimen["name"],
                component_ids=component_ids,
                metadata={
                    "package_id": package["package_id"],
                    "states": specimen["states"],
                    "consumer": specimen["consumer"],
                },
            ),
        )
        if not result.get("shape_id"):
            raise AssertionError(f"{specimen['name']}: no shape_id")
        specimen_results.append(result)

    validation = adapter.validate(file_id=file_id, page_id=page_id)
    if validation.get("errors") not in ([], None):
        raise AssertionError(f"Penpot validation failed: {validation}")

    export_results: list[dict[str, Any]] = []
    for specimen in specimen_results:
        export = adapter.export_png(
            file_id=file_id, shape_id=specimen["shape_id"], scale=1.0
        )
        if not export.get("nonempty", False):
            raise AssertionError(f"empty export for {specimen['shape_id']}")
        export_results.append(export)

    readback = adapter.readback(
        file_id=file_id,
        page_id=page_id,
        shape_ids=component_ids
        + [item["shape_id"] for item in specimen_results],
    )
    after = adapter.read_document(file_id=file_id)

    return {
        "schema_version": "kenigevents.asp-build-result-v2",
        "marker": "ASP_BUILD_RESULT_V2",
        "package_id": package["package_id"],
        "status": "IMPLEMENTED_PENDING_D0_INTEGRATE_AND_V0",
        "writer": "D0/PUBLISH",
        "run_control": {
            "run_id": args.run_id,
            "lease_token_sha256": hashlib.sha256(
                args.lease_token.encode("utf-8")
            ).hexdigest(),
            "cancel_token_sha256": hashlib.sha256(
                args.cancel_token.encode("utf-8")
            ).hexdigest(),
            "guard_before_every_mutation": True,
        },
        "immutable_inputs": package["immutable_identity"],
        "target": {
            "file_id": file_id,
            "page_id": page_id,
            "page_name": target["exact_name"],
            "consumer_evidence_page_id": target["consumer_evidence_page_id"],
            "consumer_evidence_rejected_root_id": target[
                "consumer_evidence_rejected_root_id"
            ],
            "rejected_root_mutated": False,
        },
        "revision": {
            "before": before.get("revision"),
            "after": after.get("revision"),
        },
        "created_or_reused": {
            "component_ids": component_ids,
            "specimen_shape_ids": [
                item["shape_id"] for item in specimen_results
            ],
        },
        "counts": {
            "roots": len(specimen_results),
            "components": len(component_ids),
            "instances": readback.get("instance_count"),
            "detached_instances": readback.get("detached_instance_count"),
            "screenshot_shapes": readback.get("screenshot_shape_count"),
        },
        "asset_readback": readback.get("asset_metadata"),
        "validation": validation,
        "exports": export_results,
        "provenance_receipt": {
            "contract_sha256": package["source_authority"][
                "requirements_contract"
            ]["sha256"],
            "registry_sha256": package["source_authority"]["asset_registry"][
                "sha256"
            ],
            "package_blob_sha1": package["immutable_identity"][
                "package_blob_sha1"
            ],
            "geometry_scope": "standalone library only",
            "accepted_consumer_root_geometry_claimed": False,
        },
    }


def verify_receipt(package: dict[str, Any], receipt: dict[str, Any]) -> None:
    if receipt.get("marker") != "ASP_BUILD_RESULT_V2":
        raise AssertionError("receipt marker mismatch")
    if receipt.get("package_id") != package["package_id"]:
        raise AssertionError("receipt package mismatch")
    if receipt.get("writer") != "D0/PUBLISH":
        raise AssertionError("unauthorized writer")
    if receipt.get("immutable_inputs") != package["immutable_identity"]:
        raise AssertionError("immutable input tuple mismatch")
    target = receipt["target"]
    expected_target = package["target_penpot_page"]
    if target.get("file_id") != expected_target["file_id"]:
        raise AssertionError("target file mismatch")
    if target.get("consumer_evidence_page_id") != expected_target[
        "consumer_evidence_page_id"
    ]:
        raise AssertionError("consumer page mismatch")
    if target.get("consumer_evidence_rejected_root_id") != expected_target[
        "consumer_evidence_rejected_root_id"
    ]:
        raise AssertionError("rejected root mismatch")
    if target.get("rejected_root_mutated") is not False:
        raise AssertionError("owner-rejected root was mutated")
    if receipt["run_control"].get("guard_before_every_mutation") is not True:
        raise AssertionError("per-write guard proof missing")
    counts = receipt["counts"]
    if counts.get("components") != package["expected_components"]:
        raise AssertionError("component count mismatch")
    if counts.get("instances") != package["expected_instances"]:
        raise AssertionError("instance count mismatch")
    if counts.get("detached_instances") != 0:
        raise AssertionError("detached instances present")
    if counts.get("screenshot_shapes") != 0:
        raise AssertionError("screenshot implementation present")
    errors = receipt.get("validation", {}).get("errors")
    if errors not in ([], None):
        raise AssertionError(f"validation errors: {errors}")
    exports = receipt.get("exports", [])
    if len(exports) != package["expected_roots"]:
        raise AssertionError("export/root count mismatch")
    if not all(item.get("nonempty") is True for item in exports):
        raise AssertionError("empty export")
    provenance = receipt.get("provenance_receipt", {})
    if provenance.get("contract_sha256") != package["source_authority"][
        "requirements_contract"
    ]["sha256"]:
        raise AssertionError("contract hash mismatch")
    if provenance.get("registry_sha256") != package["source_authority"][
        "asset_registry"
    ]["sha256"]:
        raise AssertionError("registry hash mismatch")
    if provenance.get("accepted_consumer_root_geometry_claimed") is not False:
        raise AssertionError("standalone package overclaims consumer geometry")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("plan", "execute", "verify"))
    parser.add_argument("--repo", default=None)
    parser.add_argument("--package", default=PACKAGE_PATH)
    parser.add_argument("--adapter")
    parser.add_argument("--run-id")
    parser.add_argument("--lease-token")
    parser.add_argument("--cancel-token")
    parser.add_argument("--receipt")
    parser.add_argument("--output")
    args = parser.parse_args()

    repo = Path(args.repo).resolve() if args.repo else Path(__file__).resolve().parents[3]
    package_path, package = load_package(repo, args.package)
    validated_assets = validate_inputs(repo, package)

    if args.mode == "plan":
        result = build_plan(package_path, package)
        result["validated_assets"] = validated_assets
        marker = SUCCESS_PLAN
    elif args.mode == "execute":
        result = execute(repo, package_path, package, args)
        marker = SUCCESS_EXECUTE
    else:
        if not args.receipt:
            raise AssertionError("verify requires --receipt")
        receipt = json.loads(Path(args.receipt).read_text(encoding="utf-8"))
        verify_receipt(package, receipt)
        result = {
            "package_id": package["package_id"],
            "receipt": str(Path(args.receipt).resolve()),
            "immutable_inputs": package["immutable_identity"],
            "status": "READBACK_VERIFIED",
        }
        marker = SUCCESS_VERIFY

    rendered = json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True)
    if args.output:
        Path(args.output).write_text(rendered + "\n", encoding="utf-8")
    print(f"{marker} {rendered}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (
        AssertionError,
        AttributeError,
        ImportError,
        KeyError,
        json.JSONDecodeError,
        OSError,
        TypeError,
    ) as exc:
        print(f"{FAIL}: {exc}", file=sys.stderr)
        raise SystemExit(1)

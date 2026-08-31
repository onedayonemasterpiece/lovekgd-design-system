#!/usr/bin/env python3
"""Contract-current action/navigation materializer for F0 package v3.

The runner validates the central registry and all exact SVG bytes locally.
`plan` is read-only. `execute` is allowed only through a D0/PUBLISH native
adapter and checks ACTIVE lease/cancel state before every mutation. `verify`
validates the resulting ASP_BUILD_RESULT_V2 receipt without contacting Penpot.
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
    "F-ACTION-NAV-ICONS.package.v3.json"
)


def identity(data: bytes) -> dict[str, Any]:
    return {
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "git_blob_sha1": hashlib.sha1(
            f"blob {len(data)}\0".encode("ascii") + data
        ).hexdigest(),
    }


def load_json(repo: Path, rel: str) -> tuple[dict[str, Any], dict[str, Any]]:
    data = (repo / rel).read_bytes()
    return json.loads(data), identity(data)


def load_package(repo: Path, rel: str) -> tuple[dict[str, Any], dict[str, Any]]:
    package, package_identity = load_json(repo, rel)
    assert package["package_id"] == "F-ACTION-NAV-ICONS"
    assert package["revision"] == 3
    assert package["status"] in {"READY_FOR_D0_INTEGRATE", "READY_TO_PUBLISH"}
    return package, package_identity


def validate_registry(repo: Path, package: dict[str, Any]) -> dict[str, Any]:
    expected = package["source_authority"]["asset_registry"]
    data = (repo / expected["path"]).read_bytes()
    actual = identity(data)
    assert actual["git_blob_sha1"] == expected["git_blob_sha1"], (
        f"registry Git blob mismatch: {actual['git_blob_sha1']}"
    )
    assert actual["bytes"] == expected["bytes"], (
        f"registry byte mismatch: {actual['bytes']}"
    )
    text = data.decode("utf-8")
    assert "registry_version: 1.2.0-candidate.1" in text
    assert "required_slots_total: 8" in text
    assert "resolved_candidate_slots: 8" in text
    assert "unresolved_candidate_slots: 0" in text
    for asset_id in package["foundation_or_component_ids"]:
        assert f"  {asset_id}:\n" in text, f"registry missing {asset_id}"
        assert f"    asset_id: {asset_id}\n" in text
    assert "fallback_policy: forbidden" in text
    return actual


def validate_assets(repo: Path, package: dict[str, Any]) -> list[dict[str, Any]]:
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
    seen: set[tuple[str, str]] = set()
    results: list[dict[str, Any]] = []
    for asset in package["assets_and_hashes"]:
        key = (asset["asset_id"], asset["variant"])
        assert key not in seen, f"duplicate asset variant {key}"
        seen.add(key)
        data = (repo / asset["path"]).read_bytes()
        actual = identity(data)
        for field in ("bytes", "sha256", "git_blob_sha1"):
            assert actual[field] == asset[field], (
                f"{key} {field}: expected {asset[field]}, got {actual[field]}"
            )
        assert data.startswith(b"<svg ") and data.endswith(b"</svg>\n"), (
            f"{key} is not canonical standalone LF SVG"
        )
        results.append(
            {"asset_id": key[0], "variant": key[1], "path": asset["path"], **actual}
        )
    assert seen == expected, f"asset coverage mismatch: missing={expected-seen}, extra={seen-expected}"
    return results


def immutable(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    registry_identity: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        **package["immutable_identity"],
        "candidate_commit": candidate_commit,
        "package_identity": package_identity,
        "registry_identity": registry_identity,
    }


def load_adapter(spec: str) -> Any:
    assert ":" in spec, "--adapter must be module:factory"
    module_name, factory_name = spec.split(":", 1)
    api = getattr(importlib.import_module(module_name), factory_name)()
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
    missing = [name for name in required if not callable(getattr(api, name, None))]
    assert not missing, f"native adapter missing methods: {missing}"
    return api


def guard(api: Any, args: argparse.Namespace, label: str) -> None:
    state = api.assert_active_lease(
        run_id=args.run_id,
        lease_token=args.lease_token,
        cancel_token=args.cancel_token,
    )
    assert state.get("active") is True, f"inactive before {label}: {state}"
    assert state.get("cancelled") is not True, f"cancelled before {label}: {state}"


def plan(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    registry_identity: dict[str, Any],
    candidate_commit: str,
    validated_assets: list[dict[str, Any]],
) -> dict[str, Any]:
    components: dict[str, list[dict[str, Any]]] = {}
    for asset in package["assets_and_hashes"]:
        components.setdefault(asset["component_name"], []).append(
            {
                "asset_id": asset["asset_id"],
                "variant": asset["variant"],
                "path": asset["path"],
                "sha256": asset["sha256"],
            }
        )
    return {
        "marker": "F0_ACTION_NAV_PLAN_PASS",
        "immutable_inputs": immutable(
            package, package_identity, registry_identity, candidate_commit
        ),
        "target": package["target_penpot_page"],
        "components": [
            {"name": name, "variants": sorted(items, key=lambda item: item["variant"])}
            for name, items in sorted(components.items())
        ],
        "specimen": package["materialization_entry_point"]["specimen"],
        "validated_assets": validated_assets,
        "expected": {
            "roots": package["expected_roots"],
            "components": package["expected_components"],
            "instances": package["expected_instances"],
        },
        "write_contract": {
            "writer": "D0/PUBLISH_ONLY",
            "guard_before_every_mutation": True,
            "consumer_rejected_root_mutation": False,
        },
    }


def execute(
    repo: Path,
    package: dict[str, Any],
    package_identity: dict[str, Any],
    registry_identity: dict[str, Any],
    args: argparse.Namespace,
) -> dict[str, Any]:
    assert all(
        (
            args.adapter,
            args.run_id,
            args.lease_token,
            args.cancel_token,
            args.candidate_commit,
        )
    ), "execute requires adapter/run/lease/cancel/candidate-commit"
    api = load_adapter(args.adapter)
    target = package["target_penpot_page"]
    before = api.read_document(file_id=target["file_id"])

    guard(api, args, "ensure-page")
    page = api.ensure_page(
        file_id=target["file_id"],
        exact_name=target["exact_name"],
        metadata={
            "package_id": package["package_id"],
            "package_revision": package["revision"],
            "candidate_commit": args.candidate_commit,
            "package_blob_sha1": package_identity["git_blob_sha1"],
            "registry_blob_sha1": registry_identity["git_blob_sha1"],
            "registry_sha256": registry_identity["sha256"],
        },
    )
    page_id = page["page_id"]

    grouped: dict[str, list[dict[str, Any]]] = {}
    for asset in package["assets_and_hashes"]:
        grouped.setdefault(asset["component_name"], []).append(asset)

    component_ids: list[str] = []
    for component_name, variants in sorted(grouped.items()):
        guard(api, args, f"component:{component_name}")
        variants = sorted(variants, key=lambda item: item["variant"])
        result = api.upsert_svg_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=component_name,
            svg_bytes=(repo / variants[0]["path"]).read_bytes(),
            variants=[
                {
                    "name": item["variant"],
                    "svg_bytes": (repo / item["path"]).read_bytes(),
                    "sha256": item["sha256"],
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
                "variant_hashes": {
                    item["variant"]: item["sha256"] for item in variants
                },
                "registry_blob_sha1": registry_identity["git_blob_sha1"],
            },
        )
        component_ids.append(result["component_id"])

    specimen = package["materialization_entry_point"]["specimen"]
    guard(api, args, "specimen")
    specimen_result = api.upsert_specimen(
        file_id=target["file_id"],
        page_id=page_id,
        exact_name=specimen["name"],
        component_ids=component_ids,
        metadata={
            "package_id": package["package_id"],
            "states": specimen["states"],
            "consumer": specimen["consumer"],
        },
    )
    root_id = specimen_result["shape_id"]

    validation = api.validate(file_id=target["file_id"], page_id=page_id)
    assert validation.get("errors") in (None, []), validation
    export = api.export_png(file_id=target["file_id"], shape_id=root_id, scale=1.0)
    assert export.get("nonempty") is True, export
    readback = api.readback(
        file_id=target["file_id"],
        page_id=page_id,
        shape_ids=component_ids + [root_id],
    )
    after = api.read_document(file_id=target["file_id"])

    return {
        "schema_version": "kenigevents.asp-build-result-v2",
        "marker": "ASP_BUILD_RESULT_V2",
        "package_id": package["package_id"],
        "package_revision": package["revision"],
        "status": "IMPLEMENTED_PENDING_D0_INTEGRATE_AND_V0",
        "writer": "D0/PUBLISH",
        "immutable_inputs": immutable(
            package, package_identity, registry_identity, args.candidate_commit
        ),
        "run_control": {
            "run_id": args.run_id,
            "lease_token_sha256": hashlib.sha256(args.lease_token.encode()).hexdigest(),
            "cancel_token_sha256": hashlib.sha256(args.cancel_token.encode()).hexdigest(),
            "guard_before_every_mutation": True,
        },
        "target": {
            "file_id": target["file_id"],
            "page_id": page_id,
            "page_name": target["exact_name"],
            "consumer_evidence_page_id": target["consumer_evidence_page_id"],
            "consumer_evidence_rejected_root_id": target[
                "consumer_evidence_rejected_root_id"
            ],
            "rejected_root_mutated": False,
        },
        "revision": {"before": before.get("revision"), "after": after.get("revision")},
        "counts": {
            "roots": 1,
            "components": len(component_ids),
            "instances": readback.get("instance_count"),
            "detached_instances": readback.get("detached_instance_count"),
            "screenshot_shapes": readback.get("screenshot_shape_count"),
        },
        "created_or_reused": {"component_ids": component_ids, "root_id": root_id},
        "asset_readback": readback.get("asset_metadata"),
        "validation": validation,
        "export": export,
        "provenance_receipt": {
            "contract_sha256": package["source_authority"]["requirements_contract"][
                "sha256"
            ],
            "registry_git_blob_sha1": registry_identity["git_blob_sha1"],
            "registry_sha256": registry_identity["sha256"],
            "package_git_blob_sha1": package_identity["git_blob_sha1"],
            "geometry_scope": "standalone action/navigation library board",
            "accepted_consumer_root_geometry_claimed": False,
        },
    }


def verify(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    registry_identity: dict[str, Any],
    candidate_commit: str,
    receipt: dict[str, Any],
) -> None:
    assert receipt["marker"] == "ASP_BUILD_RESULT_V2"
    assert receipt["package_id"] == package["package_id"]
    assert receipt["package_revision"] == package["revision"]
    assert receipt["writer"] == "D0/PUBLISH"
    assert receipt["immutable_inputs"] == immutable(
        package, package_identity, registry_identity, candidate_commit
    )
    target = package["target_penpot_page"]
    actual = receipt["target"]
    assert actual["file_id"] == target["file_id"]
    assert actual["consumer_evidence_page_id"] == target[
        "consumer_evidence_page_id"
    ]
    assert actual["consumer_evidence_rejected_root_id"] == target[
        "consumer_evidence_rejected_root_id"
    ]
    assert actual["rejected_root_mutated"] is False
    assert receipt["run_control"]["guard_before_every_mutation"] is True
    counts = receipt["counts"]
    assert counts["roots"] == package["expected_roots"]
    assert counts["components"] == package["expected_components"]
    assert counts["instances"] == package["expected_instances"]
    assert counts["detached_instances"] == 0
    assert counts["screenshot_shapes"] == 0
    assert receipt["validation"].get("errors") in (None, [])
    assert receipt["export"].get("nonempty") is True
    provenance = receipt["provenance_receipt"]
    assert provenance["registry_git_blob_sha1"] == registry_identity["git_blob_sha1"]
    assert provenance["registry_sha256"] == registry_identity["sha256"]
    assert provenance["accepted_consumer_root_geometry_claimed"] is False


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
    package, package_identity = load_package(repo, args.package)
    registry_identity = validate_registry(repo, package)
    validated_assets = validate_assets(repo, package)

    if args.mode == "plan":
        result = plan(
            package,
            package_identity,
            registry_identity,
            args.candidate_commit,
            validated_assets,
        )
        marker = "F0_ACTION_NAV_PLAN_PASS"
    elif args.mode == "execute":
        result = execute(repo, package, package_identity, registry_identity, args)
        marker = "F0_ACTION_NAV_EXECUTE_PASS"
    else:
        assert args.receipt, "verify requires --receipt"
        receipt = json.loads(Path(args.receipt).read_text(encoding="utf-8"))
        verify(
            package,
            package_identity,
            registry_identity,
            args.candidate_commit,
            receipt,
        )
        result = {
            "status": "READBACK_VERIFIED",
            "immutable_inputs": immutable(
                package,
                package_identity,
                registry_identity,
                args.candidate_commit,
            ),
        }
        marker = "F0_ACTION_NAV_READBACK_PASS"

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
        print(f"F0_ACTION_NAV_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)

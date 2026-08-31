#!/usr/bin/env python3
"""Executable runner for F-MEDALLIONS-BRAND-ASSETS v2.

The medallion inventory is resolved from the immutable donor manifest and the
brand assets from the immutable v1 inventory. All external bytes are verified
against an exact events-bot-new checkout before any Penpot write. `plan` is
read-only; `execute` is D0/PUBLISH-only with ACTIVE lease/cancel checks before
every mutation; `verify` validates the ASP_BUILD_RESULT_V2 receipt.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
from typing import Any, Iterator

DEFAULT_PACKAGE = (
    "catalog/asp-production-conveyor-v3/f0/"
    "F-MEDALLIONS-BRAND-ASSETS.package.v2.json"
)
IMAGE_EXTENSIONS = {".svg", ".png", ".jpg", ".jpeg", ".webp", ".avif"}


def identity(data: bytes) -> dict[str, Any]:
    return {
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "git_blob_sha1": hashlib.sha1(
            f"blob {len(data)}\0".encode("ascii") + data
        ).hexdigest(),
    }


def load_json(root: Path, rel: str) -> tuple[dict[str, Any], dict[str, Any]]:
    data = (root / rel).read_bytes()
    return json.loads(data), identity(data)


def load_package(repo: Path, rel: str) -> tuple[dict[str, Any], dict[str, Any]]:
    package, package_identity = load_json(repo, rel)
    assert package["package_id"] == "F-MEDALLIONS-BRAND-ASSETS"
    assert package["revision"] == 2
    assert package["status"] in {"READY_FOR_D0_INTEGRATE", "READY_TO_PUBLISH"}
    return package, package_identity


def walk(value: Any, path: tuple[str, ...] = ()) -> Iterator[tuple[tuple[str, ...], Any]]:
    yield path, value
    if isinstance(value, dict):
        for key, child in value.items():
            yield from walk(child, path + (str(key),))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, path + (str(index),))


def first(record: dict[str, Any], names: list[str]) -> Any:
    for name in names:
        if record.get(name) is not None:
            return record[name]
    return None


def flatten_scalars(value: Any) -> list[str]:
    out: list[str] = []
    if isinstance(value, (str, int)):
        out.append(str(value))
    elif isinstance(value, list):
        for item in value:
            out.extend(flatten_scalars(item))
    elif isinstance(value, dict):
        for item in value.values():
            out.extend(flatten_scalars(item))
    return out


def generic_resolve_manifest(
    manifest: dict[str, Any], registry: dict[str, Any]
) -> dict[str, Any]:
    contract = registry["resolution_contract"]
    visuals: dict[str, dict[str, Any]] = {}
    bindings: dict[str, dict[str, Any]] = {}
    record_candidates: set[str] = set()

    for path, value in walk(manifest):
        if not isinstance(value, dict):
            continue
        source_path = first(value, contract["asset_path_fields"])
        sha256 = first(value, contract["sha256_fields"])
        if isinstance(source_path, str) and isinstance(sha256, str):
            suffix = Path(source_path.split("?", 1)[0]).suffix.lower()
            if suffix in IMAGE_EXTENSIONS and len(sha256) == 64:
                record_candidates.add(".".join(path[:2]))
                visual = visuals.setdefault(
                    sha256,
                    {
                        "asset_id": value.get("asset_id")
                        or value.get("stable_asset_id")
                        or f"medallion.asset.{sha256[:16]}",
                        "source_path": source_path,
                        "sha256": sha256,
                        "git_blob_sha1": first(value, contract["git_blob_fields"]),
                        "bytes": first(value, ["bytes", "size", "byte_count"]),
                        "media_type": value.get("media_type")
                        or {
                            ".svg": "image/svg+xml",
                            ".png": "image/png",
                            ".jpg": "image/jpeg",
                            ".jpeg": "image/jpeg",
                            ".webp": "image/webp",
                            ".avif": "image/avif",
                        }[suffix],
                        "intrinsic_size": value.get("intrinsic_size")
                        or {
                            "width": value.get("width"),
                            "height": value.get("height"),
                        },
                        "consumer_bindings": [],
                    },
                )
                binding_values: list[str] = []
                for key, child in value.items():
                    lowered = key.lower()
                    if "binding" in lowered or lowered in {
                        "consumer_id",
                        "organizer_id",
                        "festival_id",
                        "organizer_slug",
                        "festival_slug",
                        "slug",
                    }:
                        binding_values.extend(flatten_scalars(child))
                for binding_value in binding_values:
                    binding_id = f"{sha256}:{binding_value}"
                    bindings.setdefault(
                        binding_id,
                        {
                            "binding_id": binding_value,
                            "asset_sha256": sha256,
                            "asset_id": visual["asset_id"],
                        },
                    )
                    if binding_value not in visual["consumer_bindings"]:
                        visual["consumer_bindings"].append(binding_value)

    explicit_counts: dict[str, int] = {}
    for path, value in walk(manifest):
        if not isinstance(value, int):
            continue
        key = path[-1].lower() if path else ""
        if key in {"record_count", "records_count", "records"}:
            explicit_counts.setdefault("records", value)
        elif key in {
            "binding_count",
            "bindings_count",
            "consumer_binding_count",
            "consumer_bindings_count",
        }:
            explicit_counts.setdefault("consumer_bindings", value)
        elif key in {
            "unique_visual_count",
            "unique_visuals_count",
            "unique_visuals",
        }:
            explicit_counts.setdefault("unique_visuals", value)

    expected = registry["expected_inventory"]
    records_count = explicit_counts.get("records", len(record_candidates))
    binding_count = explicit_counts.get("consumer_bindings", len(bindings))
    unique_visual_count = explicit_counts.get("unique_visuals", len(visuals))
    return {
        "resolver": "generic-content-addressed-manifest-v1",
        "records_count": records_count,
        "consumer_binding_count": binding_count,
        "unique_visual_count": unique_visual_count,
        "visuals": sorted(visuals.values(), key=lambda item: item["asset_id"]),
        "bindings": sorted(bindings.values(), key=lambda item: item["binding_id"]),
        "expected": expected,
    }


def load_resolver(spec: str | None) -> Any:
    if not spec:
        return generic_resolve_manifest
    assert ":" in spec, "--resolver must be module:factory"
    module_name, factory_name = spec.split(":", 1)
    resolver = getattr(importlib.import_module(module_name), factory_name)()
    assert callable(resolver), "resolver factory must return a callable"
    return resolver


def load_brand_helpers() -> Any:
    path = Path(__file__).with_name("materialize_brandbook_baseline_v2.py")
    spec = importlib.util.spec_from_file_location("f0_brandbook_helpers_v2", path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def validate_resolved_inventory(
    resolved: dict[str, Any], registry: dict[str, Any]
) -> None:
    expected = registry["expected_inventory"]
    assert resolved["records_count"] == expected["records"], resolved
    assert resolved["consumer_binding_count"] == expected["consumer_bindings"], resolved
    assert resolved["unique_visual_count"] == expected["unique_visuals"], resolved
    assert len(resolved["visuals"]) == expected["unique_visuals"], resolved
    assert len({item["sha256"] for item in resolved["visuals"]}) == expected[
        "unique_visuals"
    ]
    assert all(len(item["sha256"]) == 64 for item in resolved["visuals"])
    assert all(item["source_path"] for item in resolved["visuals"])


def validate_inputs(
    repo: Path,
    donor_repo: Path,
    package: dict[str, Any],
    resolver_spec: str | None,
) -> dict[str, Any]:
    source, source_identity = load_json(repo, package["source_package"]["path"])
    assert source_identity["git_blob_sha1"] == package["source_package"]["git_blob_sha1"]
    assert source_identity["bytes"] == package["source_package"]["bytes"]
    assert source["package_id"] == package["package_id"]

    medallion_registry, medallion_registry_identity = load_json(
        repo, package["source_authority"]["medallion_registry"]["path"]
    )
    assert medallion_registry["registry_id"] == "kenigevents.ui-assets.medallions.v1"
    brand_registry, brand_registry_identity = load_json(
        repo, package["source_authority"]["brand_registry"]["path"]
    )
    assert brand_registry["registry_id"] == "kenigevents.ui-assets.brand.v1"

    manifest_path = medallion_registry["authority"]["manifest_path"]
    manifest, manifest_identity = load_json(donor_repo, manifest_path)
    assert manifest_identity["sha256"] == medallion_registry["authority"][
        "manifest_sha256"
    ]
    resolver = load_resolver(resolver_spec)
    resolved_medallions = resolver(manifest, medallion_registry)
    validate_resolved_inventory(resolved_medallions, medallion_registry)

    brand_helpers = load_brand_helpers()
    resolved_brand = brand_helpers.resolve_assets(source, brand_registry)
    assert len(resolved_brand) == 3

    placements = package["materialization_entry_point"]["specimen"]["brand_placements"]
    assert len(placements) == 6
    assert package["expected_roots"] == 1
    assert package["expected_components"] == 45
    assert package["expected_instances"] == 135
    return {
        "source_identity": source_identity,
        "medallion_registry_identity": medallion_registry_identity,
        "brand_registry_identity": brand_registry_identity,
        "manifest_identity": manifest_identity,
        "resolved_medallions": resolved_medallions,
        "resolved_brand": resolved_brand,
    }


def checkout_head(repo: Path) -> str:
    result = subprocess.run(
        ["git", "-C", str(repo), "rev-parse", "HEAD"],
        check=True,
        text=True,
        capture_output=True,
    )
    return result.stdout.strip()


def verify_asset_bytes(
    asset_repo: Path,
    expected_commit: str,
    medallions: list[dict[str, Any]],
    brand: list[dict[str, Any]],
) -> dict[str, Any]:
    assert checkout_head(asset_repo) == expected_commit
    verified_medallions: list[dict[str, Any]] = []
    for item in medallions:
        data = (asset_repo / item["source_path"]).read_bytes()
        actual = identity(data)
        assert actual["sha256"] == item["sha256"], item["asset_id"]
        if item.get("git_blob_sha1"):
            assert actual["git_blob_sha1"] == item["git_blob_sha1"], item["asset_id"]
        if item.get("bytes") is not None:
            assert actual["bytes"] == item["bytes"], item["asset_id"]
        verified_medallions.append({"asset_id": item["asset_id"], "source_path": item["source_path"], **actual})

    verified_brand: list[dict[str, Any]] = []
    for item in brand:
        data = (asset_repo / item["source_path"]).read_bytes()
        actual = identity(data)
        assert actual["sha256"] == item["sha256"], item["asset_id"]
        assert actual["git_blob_sha1"] == item["git_blob_sha1"], item["asset_id"]
        if item.get("bytes") is not None:
            assert actual["bytes"] == item["bytes"], item["asset_id"]
        verified_brand.append({"asset_id": item["asset_id"], "source_path": item["source_path"], **actual})
    return {"medallions": verified_medallions, "brand": verified_brand}


def immutable(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    evidence: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        **package["immutable_identity"],
        "candidate_commit": candidate_commit,
        "package_identity": package_identity,
        "source_package_identity": evidence["source_identity"],
        "medallion_registry_identity": evidence["medallion_registry_identity"],
        "brand_registry_identity": evidence["brand_registry_identity"],
        "manifest_identity": evidence["manifest_identity"],
        "resolved_counts": {
            "records": evidence["resolved_medallions"]["records_count"],
            "consumer_bindings": evidence["resolved_medallions"][
                "consumer_binding_count"
            ],
            "unique_visuals": evidence["resolved_medallions"][
                "unique_visual_count"
            ],
            "brand_assets": len(evidence["resolved_brand"]),
        },
    }


def load_adapter(spec: str) -> Any:
    assert ":" in spec, "--adapter must be module:factory"
    module_name, factory_name = spec.split(":", 1)
    api = getattr(importlib.import_module(module_name), factory_name)()
    required = (
        "read_document",
        "assert_active_lease",
        "ensure_page",
        "upsert_medallion_asset_component",
        "upsert_svg_asset_component",
        "upsert_asset_library_specimen",
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


def build_plan(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    evidence: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        "marker": "F0_MEDALLIONS_BRAND_ASSETS_PLAN_PASS",
        "immutable_inputs": immutable(
            package, package_identity, evidence, candidate_commit
        ),
        "target": package["target_penpot_page"],
        "resolver": evidence["resolved_medallions"]["resolver"],
        "resolved_counts": immutable(
            package, package_identity, evidence, candidate_commit
        )["resolved_counts"],
        "medallion_visuals": evidence["resolved_medallions"]["visuals"],
        "consumer_bindings": evidence["resolved_medallions"]["bindings"],
        "brand_assets": evidence["resolved_brand"],
        "expected": {
            "roots": package["expected_roots"],
            "components": package["expected_components"],
            "instances": package["expected_instances"],
        },
        "write_contract": {
            "writer": "D0/PUBLISH_ONLY",
            "exact_asset_checkout_required": True,
            "transparent_medallion_surface": True,
            "square_backing": False,
            "guard_before_every_mutation": True,
            "consumer_geometry_claimed": False,
        },
    }


def execute(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    evidence: dict[str, Any],
    args: argparse.Namespace,
) -> dict[str, Any]:
    assert all(
        (
            args.adapter,
            args.asset_repo,
            args.run_id,
            args.lease_token,
            args.cancel_token,
            args.candidate_commit,
        )
    ), "execute requires adapter/asset-repo/run/lease/cancel/candidate-commit"
    asset_repo = Path(args.asset_repo).resolve()
    verified_assets = verify_asset_bytes(
        asset_repo,
        package["source_authority"]["asset_repository"]["commit"],
        evidence["resolved_medallions"]["visuals"],
        evidence["resolved_brand"],
    )
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
            "manifest_sha256": evidence["manifest_identity"]["sha256"],
        },
    )
    page_id = page["page_id"]

    medallion_component_ids: dict[str, str] = {}
    family = package["source_authority"]["medallion_registry_family"]
    for item in evidence["resolved_medallions"]["visuals"]:
        guard(api, args, f"medallion:{item['asset_id']}")
        result = api.upsert_medallion_asset_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=f"Medallion/Asset/{item['asset_id']}",
            asset_bytes=(asset_repo / item["source_path"]).read_bytes(),
            media_type=item["media_type"],
            metadata={
                **family,
                **item,
                "package_id": package["package_id"],
                "transparent_surface": True,
                "square_backing": False,
            },
        )
        medallion_component_ids[item["asset_id"]] = result["component_id"]

    brand_component_ids: dict[str, str] = {}
    for item in evidence["resolved_brand"]:
        guard(api, args, f"brand:{item['asset_id']}")
        result = api.upsert_svg_asset_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=item["penpot_consumer"]["asset_component_name"],
            svg_bytes=(asset_repo / item["source_path"]).read_bytes(),
            metadata={**item, "package_id": package["package_id"]},
        )
        brand_component_ids[item["asset_id"]] = result["component_id"]

    specimen = package["materialization_entry_point"]["specimen"]
    guard(api, args, "specimen-root")
    root = api.upsert_asset_library_specimen(
        file_id=target["file_id"],
        page_id=page_id,
        exact_name=specimen["name"],
        medallion_component_ids=medallion_component_ids,
        medallion_bindings=evidence["resolved_medallions"]["bindings"],
        medallion_size_tiers=package["consumer_size_tiers_px"],
        brand_component_ids=brand_component_ids,
        brand_placements=specimen["brand_placements"],
        metadata={
            "package_id": package["package_id"],
            "manifest_sha256": evidence["manifest_identity"]["sha256"],
            "consumer_geometry_claimed": False,
            "poster_occlusion_defect_closed": False,
        },
    )
    root_id = root["shape_id"]
    all_component_ids = list(medallion_component_ids.values()) + list(
        brand_component_ids.values()
    )

    validation = api.validate(file_id=target["file_id"], page_id=page_id)
    assert validation.get("errors") in (None, []), validation
    export = api.export_png(file_id=target["file_id"], shape_id=root_id, scale=1.0)
    assert export.get("nonempty") is True, export
    readback = api.readback(
        file_id=target["file_id"],
        page_id=page_id,
        shape_ids=all_component_ids + [root_id],
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
            package, package_identity, evidence, args.candidate_commit
        ),
        "run_control": {
            "run_id": args.run_id,
            "lease_token_sha256": hashlib.sha256(args.lease_token.encode()).hexdigest(),
            "cancel_token_sha256": hashlib.sha256(args.cancel_token.encode()).hexdigest(),
            "guard_before_every_mutation": True,
        },
        "asset_verification": {
            "checkout_commit": checkout_head(asset_repo),
            "before_any_asset_mutation": True,
            **verified_assets,
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
            "components": len(all_component_ids),
            "instances": readback.get("instance_count"),
            "detached_instances": readback.get("detached_instance_count"),
            "screenshot_shapes": readback.get("screenshot_shape_count"),
        },
        "created_or_reused": {
            "medallion_component_ids": medallion_component_ids,
            "brand_component_ids": brand_component_ids,
            "root_id": root_id,
        },
        "validation": validation,
        "export": export,
        "provenance_receipt": {
            "contract_sha256": package["source_authority"]["requirements_contract"][
                "sha256"
            ],
            "package_git_blob_sha1": package_identity["git_blob_sha1"],
            "source_package_git_blob_sha1": evidence["source_identity"][
                "git_blob_sha1"
            ],
            "medallion_registry_git_blob_sha1": evidence[
                "medallion_registry_identity"
            ]["git_blob_sha1"],
            "brand_registry_git_blob_sha1": evidence["brand_registry_identity"][
                "git_blob_sha1"
            ],
            "manifest_sha256": evidence["manifest_identity"]["sha256"],
            "resolved_counts": immutable(
                package, package_identity, evidence, args.candidate_commit
            )["resolved_counts"],
            "geometry_scope": "standalone medallion and brand asset library board",
            "accepted_consumer_root_geometry_claimed": False,
            "consumer_poster_occlusion_defect_closed": False,
        },
    }


def verify(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    evidence: dict[str, Any],
    candidate_commit: str,
    receipt: dict[str, Any],
) -> None:
    assert receipt["marker"] == "ASP_BUILD_RESULT_V2"
    assert receipt["package_id"] == package["package_id"]
    assert receipt["package_revision"] == package["revision"]
    assert receipt["writer"] == "D0/PUBLISH"
    assert receipt["immutable_inputs"] == immutable(
        package, package_identity, evidence, candidate_commit
    )
    assert receipt["asset_verification"]["before_any_asset_mutation"] is True
    assert len(receipt["asset_verification"]["medallions"]) == 42
    assert len(receipt["asset_verification"]["brand"]) == 3
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
    assert provenance["accepted_consumer_root_geometry_claimed"] is False
    assert provenance["consumer_poster_occlusion_defect_closed"] is False


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("plan", "execute", "verify"))
    parser.add_argument("--repo")
    parser.add_argument("--donor-repo")
    parser.add_argument("--asset-repo")
    parser.add_argument("--resolver")
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
    donor_repo = Path(args.donor_repo).resolve() if args.donor_repo else repo
    package, package_identity = load_package(repo, args.package)
    evidence = validate_inputs(repo, donor_repo, package, args.resolver)

    if args.mode == "plan":
        result = build_plan(
            package, package_identity, evidence, args.candidate_commit
        )
        marker = "F0_MEDALLIONS_BRAND_ASSETS_PLAN_PASS"
    elif args.mode == "execute":
        result = execute(package, package_identity, evidence, args)
        marker = "F0_MEDALLIONS_BRAND_ASSETS_EXECUTE_PASS"
    else:
        assert args.receipt, "verify requires --receipt"
        receipt = json.loads(Path(args.receipt).read_text(encoding="utf-8"))
        verify(
            package,
            package_identity,
            evidence,
            args.candidate_commit,
            receipt,
        )
        result = {
            "status": "READBACK_VERIFIED",
            "immutable_inputs": immutable(
                package, package_identity, evidence, args.candidate_commit
            ),
        }
        marker = "F0_MEDALLIONS_BRAND_ASSETS_READBACK_PASS"

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
        print(f"F0_MEDALLIONS_BRAND_ASSETS_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)

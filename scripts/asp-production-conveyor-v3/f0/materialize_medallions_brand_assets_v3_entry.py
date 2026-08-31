#!/usr/bin/env python3
"""Canonical entry point for F-MEDALLIONS-BRAND-ASSETS v3.

The implementation module deliberately reuses the bounded v2 mutation logic.
This entry replaces only its context loader so every helper is content-addressed,
optional SHA-256 declarations are handled correctly, and Git-only integration
state remains consumable before O0 releases the Penpot publish hold.
"""

from __future__ import annotations

import importlib.util
from pathlib import Path
import sys
from typing import Any

HERE = Path(__file__).resolve().parent
IMPLEMENTATION = HERE / "materialize_medallions_brand_assets_v3.py"
BRAND_HELPER = HERE / "materialize_brandbook_baseline_v2.py"


def load_module(path: Path, name: str) -> Any:
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise AssertionError(f"cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


impl = load_module(IMPLEMENTATION, "f0_medallions_brand_candidate_v3_impl")


def verify_descriptor(
    actual: dict[str, Any], descriptor: dict[str, Any], label: str
) -> None:
    for field in ("git_blob_sha1", "bytes"):
        impl.require(
            actual[field] == descriptor[field],
            f"{label}: {field} mismatch",
        )
    declared_sha256 = descriptor.get("sha256")
    if declared_sha256:
        impl.require(
            actual["sha256"] == declared_sha256,
            f"{label}: sha256 mismatch",
        )


def patched_load_context(
    repo: Path, package_path: str
) -> tuple[Any, Any, dict[str, Any], dict[str, Any], dict[str, Any], dict[str, Any]]:
    package, package_identity = impl.load_json(repo, package_path)
    impl.require(
        package.get("package_id") == "F-MEDALLIONS-BRAND-ASSETS",
        "wrong package",
    )
    impl.require(package.get("revision") == 3, "wrong revision")
    impl.require(
        package.get("status")
        in {"READY_FOR_D0_INTEGRATE", "READY_TO_MATERIALIZE_CANDIDATE"},
        "package is not consumable by D0 integration",
    )

    base_path = HERE / impl.BASE_RUNNER
    resolver_path = HERE / impl.RESOLVER
    brand_helper_path = BRAND_HELPER
    base = impl.load_module(base_path, "f0_medallions_brand_v2")
    resolver_module = impl.load_module(
        resolver_path, "f0_medallion_manifest_resolver_v3"
    )
    resolver = resolver_module.build_resolver()
    impl.require(callable(resolver), "resolver factory returned non-callable")

    base_identity = impl.identity(base_path.read_bytes())
    resolver_identity = impl.identity(resolver_path.read_bytes())
    brand_helper_identity = impl.identity(brand_helper_path.read_bytes())
    verify_descriptor(base_identity, package["base_runner"], "base runner")
    verify_descriptor(resolver_identity, package["resolver"], "resolver")
    verify_descriptor(
        brand_helper_identity, package["brand_helper"], "brand helper"
    )

    source, source_identity = impl.load_json(
        repo, package["source_package_v2"]["path"]
    )
    impl.require(
        source.get("package_id") == package["package_id"],
        "source package mismatch",
    )
    impl.require(source.get("revision") == 2, "source revision mismatch")
    verify_descriptor(
        source_identity, package["source_package_v2"], "source package"
    )

    registry_actual = {
        "medallion": impl.verify_identity(
            repo, package["registries"]["medallion"], "medallion registry"
        ),
        "brand": impl.verify_identity(
            repo, package["registries"]["brand"], "brand registry"
        ),
    }
    return base, resolver, package, package_identity, source, {
        "source_identity": source_identity,
        "base_runner_identity": base_identity,
        "resolver_identity": resolver_identity,
        "brand_helper_identity": brand_helper_identity,
        "registry_actual": registry_actual,
    }


original_immutable_inputs = impl.immutable_inputs


def patched_immutable_inputs(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    context_identity: dict[str, Any],
    evidence: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    result = original_immutable_inputs(
        package,
        package_identity,
        context_identity,
        evidence,
        candidate_commit,
    )
    result["brand_helper_identity"] = context_identity["brand_helper_identity"]
    return result


impl.load_context = patched_load_context
impl.immutable_inputs = patched_immutable_inputs


if __name__ == "__main__":
    try:
        raise SystemExit(impl.main())
    except (
        AssertionError,
        ImportError,
        KeyError,
        OSError,
        TypeError,
    ) as exc:
        print(f"F0_MEDALLIONS_BRAND_CANDIDATE_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)

#!/usr/bin/env python3
"""Current-file candidate wrapper for F-MEDALLIONS-BRAND-ASSETS v3.

This wrapper repairs three v2 publication defects without changing the asset
inventory: it binds the exact schema-aware donor resolver, targets the current
LoveKGD Penpot file, and separates candidate materialization from promotion.
Only D0/PUBLISH may mutate Penpot.
"""

from __future__ import annotations

import argparse
from copy import deepcopy
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
from typing import Any

DEFAULT_PACKAGE = (
    "catalog/asp-production-conveyor-v3/f0/"
    "F-MEDALLIONS-BRAND-ASSETS.package.v3.json"
)
CURRENT_FILE_ID = "40e06342-8830-80d6-8008-8fc8a3a4cd4f"
BASE_RUNNER = "materialize_medallions_brand_assets_v2.py"
RESOLVER = "resolve_medallion_manifest_v3.py"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def identity(data: bytes) -> dict[str, Any]:
    return {
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "git_blob_sha1": hashlib.sha1(
            f"blob {len(data)}\0".encode("ascii") + data
        ).hexdigest(),
    }


def load_module(path: Path, name: str) -> Any:
    spec = importlib.util.spec_from_file_location(name, path)
    require(spec is not None and spec.loader is not None, f"cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def load_json(repo: Path, path: str) -> tuple[dict[str, Any], dict[str, Any]]:
    data = (repo / path).read_bytes()
    return json.loads(data), identity(data)


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

    return hashlib.sha256(
        json.dumps(clean(value), ensure_ascii=False, sort_keys=True).encode("utf-8")
    ).hexdigest()


def verify_identity(
    repo: Path, descriptor: dict[str, Any], label: str
) -> dict[str, Any]:
    actual = identity((repo / descriptor["path"]).read_bytes())
    for field in ("git_blob_sha1", "bytes"):
        require(actual[field] == descriptor[field], f"{label}: {field} mismatch")
    if descriptor.get("sha256"):
        require(actual["sha256"] == descriptor["sha256"], f"{label}: sha256 mismatch")
    return actual


def load_context(
    repo: Path, package_path: str
) -> tuple[Any, Any, dict[str, Any], dict[str, Any], dict[str, Any], dict[str, Any]]:
    package, package_identity = load_json(repo, package_path)
    require(package.get("package_id") == "F-MEDALLIONS-BRAND-ASSETS", "wrong package")
    require(package.get("revision") == 3, "wrong revision")
    require(
        package.get("status") == "READY_TO_MATERIALIZE_CANDIDATE",
        "package is not candidate-ready",
    )

    base_path = Path(__file__).with_name(BASE_RUNNER)
    resolver_path = Path(__file__).with_name(RESOLVER)
    base = load_module(base_path, "f0_medallions_brand_v2")
    resolver_module = load_module(resolver_path, "f0_medallion_manifest_resolver_v3")
    resolver = resolver_module.build_resolver()
    require(callable(resolver), "resolver factory returned non-callable")

    base_identity = identity(base_path.read_bytes())
    resolver_identity = identity(resolver_path.read_bytes())
    for actual, declared, label in (
        (base_identity, package["base_runner"], "base runner"),
        (resolver_identity, package["resolver"], "resolver"),
    ):
        for field in ("git_blob_sha1", "sha256", "bytes"):
            require(actual[field] == declared[field], f"{label}: {field} mismatch")

    source, source_identity = load_json(repo, package["source_package_v2"]["path"])
    require(source.get("package_id") == package["package_id"], "source package mismatch")
    require(source.get("revision") == 2, "source revision mismatch")
    for field in ("git_blob_sha1", "bytes"):
        require(
            source_identity[field] == package["source_package_v2"][field],
            f"source package {field} mismatch",
        )

    registry_actual = {
        "medallion": verify_identity(
            repo, package["registries"]["medallion"], "medallion registry"
        ),
        "brand": verify_identity(repo, package["registries"]["brand"], "brand registry"),
    }
    return base, resolver, package, package_identity, source, {
        "source_identity": source_identity,
        "base_runner_identity": base_identity,
        "resolver_identity": resolver_identity,
        "registry_actual": registry_actual,
    }


def effective_package(package: dict[str, Any], source: dict[str, Any]) -> dict[str, Any]:
    effective = deepcopy(source)
    effective["revision"] = 3
    effective["status"] = "READY_TO_MATERIALIZE_CANDIDATE"
    effective["branch"] = package["branch"]
    effective["sha"] = package["sha"]
    effective["immutable_identity"] = package["immutable_identity"]
    effective["target_penpot_page"] = {
        **package["target_penpot_page"],
        "consumer_evidence_page_id": package["protected_surface"]["page_id"],
        "consumer_evidence_rejected_root_id": package["protected_surface"][
            "rejected_root_id"
        ],
        "rejected_root_mutation_allowed": False,
        "old_penpot_id_reuse_allowed": False,
    }
    effective["materialization_entry_point"] = deepcopy(
        source["materialization_entry_point"]
    )
    effective["materialization_entry_point"]["specimen"]["name"] = package[
        "candidate_root"
    ]["exact_name"]
    effective["expected_roots"] = package["expected_roots"]
    effective["expected_components"] = package["expected_components"]
    effective["expected_instances"] = package["expected_instances"]
    return effective


def resolve_evidence(
    base: Any,
    resolver: Any,
    repo: Path,
    donor_repo: Path,
    effective: dict[str, Any],
) -> dict[str, Any]:
    original = base.load_resolver
    base.load_resolver = lambda _: resolver
    try:
        evidence = base.validate_inputs(repo, donor_repo, effective, None)
    finally:
        base.load_resolver = original
    resolved = evidence["resolved_medallions"]
    require(
        resolved.get("resolver")
        == "event-medallion-candidate-v1-primary-asset-resolver.v3",
        "wrong resolver executed",
    )
    require(resolved.get("fallback_assets_used") == 0, "fallback asset used")
    require(resolved.get("old_penpot_bindings_used") == 0, "old Penpot binding used")
    return evidence


def immutable_inputs(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    context_identity: dict[str, Any],
    evidence: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        "candidate_branch": package["branch"],
        "candidate_commit": candidate_commit,
        "package_path": package["immutable_identity"]["package_path"],
        "package_identity": package_identity,
        "source_package_v2": {
            **package["source_package_v2"],
            "actual_identity": context_identity["source_identity"],
        },
        "base_runner_identity": context_identity["base_runner_identity"],
        "resolver_identity": context_identity["resolver_identity"],
        "registry_identities": context_identity["registry_actual"],
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


def build_plan(
    base: Any,
    package: dict[str, Any],
    package_identity: dict[str, Any],
    context_identity: dict[str, Any],
    effective: dict[str, Any],
    evidence: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    plan = base.build_plan(effective, package_identity, evidence, candidate_commit)
    plan.update(
        {
            "marker": "F0_MEDALLIONS_BRAND_CANDIDATE_PLAN_PASS",
            "schema_version": "kenigevents.f0-medallions-brand-candidate-plan.v3",
            "status": package["status"],
            "promotion_state": package["promotion_state"],
            "immutable_inputs_v3": immutable_inputs(
                package,
                package_identity,
                context_identity,
                evidence,
                candidate_commit,
            ),
            "target": package["target_penpot_page"],
            "protected_surface": package["protected_surface"],
            "candidate_root": package["candidate_root"],
        }
    )
    plan["write_contract"].update(
        {
            "candidate_build_not_accepted": True,
            "protected_surface_mutation_allowed": False,
            "fallback_assets_used": 0,
            "old_penpot_bindings_used": 0,
            "visual_acceptance_claimed": False,
        }
    )
    return plan


def execute(
    base: Any,
    package: dict[str, Any],
    package_identity: dict[str, Any],
    context_identity: dict[str, Any],
    effective: dict[str, Any],
    evidence: dict[str, Any],
    args: argparse.Namespace,
) -> dict[str, Any]:
    require(
        all(
            (
                args.adapter,
                args.asset_repo,
                args.run_id,
                args.lease_token,
                args.cancel_token,
                args.candidate_commit,
            )
        ),
        "execute requires adapter/asset-repo/run/lease/cancel/candidate-commit",
    )
    adapter = base.load_adapter(args.adapter)
    protected = package["protected_surface"]
    protected_before = adapter.readback(
        file_id=protected["file_id"],
        page_id=protected["page_id"],
        shape_ids=protected["root_ids"],
    )
    before_digest = stable_readback_digest(protected_before)

    original = base.load_adapter
    base.load_adapter = lambda _: adapter
    try:
        receipt = base.execute(effective, package_identity, evidence, args)
    finally:
        base.load_adapter = original

    protected_after = adapter.readback(
        file_id=protected["file_id"],
        page_id=protected["page_id"],
        shape_ids=protected["root_ids"],
    )
    after_digest = stable_readback_digest(protected_after)
    require(before_digest == after_digest, "protected free-page surface changed")
    require(
        receipt["target"]["page_id"] != protected["page_id"],
        "candidate page resolved to protected page",
    )

    receipt.update(
        {
            "schema_version": "kenigevents.asp-build-result-v3",
            "package_revision": 3,
            "status": "CANDIDATE_MATERIALIZED_PENDING_V0",
            "materialization_state": "VISIBLE_CANDIDATE",
            "promotion_state": "BLOCKED_UNTIL_V0_REVIEW",
            "owner_review_state": "NOT_ACCEPTED",
            "immutable_inputs_v3": immutable_inputs(
                package,
                package_identity,
                context_identity,
                evidence,
                args.candidate_commit,
            ),
            "protected_surface": {
                **protected,
                "before_digest": before_digest,
                "after_digest": after_digest,
                "mutated": False,
            },
        }
    )
    receipt["target"].update(
        {
            "candidate_label": package["target_penpot_page"]["candidate_label"],
            "root_name": package["candidate_root"]["exact_name"],
        }
    )
    receipt["provenance_receipt"].update(
        {
            "resolver_git_blob_sha1": context_identity["resolver_identity"][
                "git_blob_sha1"
            ],
            "candidate_build_not_accepted": True,
            "owner_review_state": "NOT_ACCEPTED",
            "fallback_assets_used": 0,
            "old_penpot_bindings_used": 0,
        }
    )
    return receipt


def verify(
    base: Any,
    package: dict[str, Any],
    package_identity: dict[str, Any],
    context_identity: dict[str, Any],
    effective: dict[str, Any],
    evidence: dict[str, Any],
    candidate_commit: str,
    receipt: dict[str, Any],
) -> None:
    base.verify(effective, package_identity, evidence, candidate_commit, receipt)
    require(receipt.get("package_revision") == 3, "wrong receipt revision")
    require(
        receipt.get("status") == "CANDIDATE_MATERIALIZED_PENDING_V0",
        "wrong candidate status",
    )
    require(receipt.get("owner_review_state") == "NOT_ACCEPTED", "acceptance leak")
    require(
        receipt.get("immutable_inputs_v3")
        == immutable_inputs(
            package,
            package_identity,
            context_identity,
            evidence,
            candidate_commit,
        ),
        "v3 immutable inputs mismatch",
    )
    target = receipt["target"]
    require(target["file_id"] == CURRENT_FILE_ID, "wrong Penpot file")
    require(
        target["candidate_label"] == "CANDIDATE_BUILD_NOT_ACCEPTED",
        "candidate label missing",
    )
    protected = receipt["protected_surface"]
    require(protected["mutation_allowed"] is False, "protected mutation allowed")
    require(protected["mutated"] is False, "protected surface mutated")
    require(protected["before_digest"] == protected["after_digest"], "protected digest drift")
    provenance = receipt["provenance_receipt"]
    require(provenance["fallback_assets_used"] == 0, "fallback asset receipt")
    require(provenance["old_penpot_bindings_used"] == 0, "old Penpot binding receipt")
    require(provenance["candidate_build_not_accepted"] is True, "promotion leak")


def checkout_head(path: Path) -> str:
    result = subprocess.run(
        ["git", "-C", str(path), "rev-parse", "HEAD"],
        check=True,
        text=True,
        capture_output=True,
    )
    return result.stdout.strip()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("plan", "execute", "verify"))
    parser.add_argument("--repo")
    parser.add_argument("--donor-repo")
    parser.add_argument("--asset-repo")
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
    base, resolver, package, package_identity, source, context_identity = load_context(
        repo, args.package
    )
    effective = effective_package(package, source)
    require(effective["target_penpot_page"]["file_id"] == CURRENT_FILE_ID, "stale target")
    evidence = resolve_evidence(base, resolver, repo, donor_repo, effective)

    if args.mode == "plan":
        result = build_plan(
            base,
            package,
            package_identity,
            context_identity,
            effective,
            evidence,
            args.candidate_commit,
        )
        marker = "F0_MEDALLIONS_BRAND_CANDIDATE_PLAN_PASS"
    elif args.mode == "execute":
        result = execute(
            base,
            package,
            package_identity,
            context_identity,
            effective,
            evidence,
            args,
        )
        marker = "F0_MEDALLIONS_BRAND_CANDIDATE_EXECUTE_PASS"
    else:
        require(bool(args.receipt), "verify requires --receipt")
        receipt = json.loads(Path(args.receipt).read_text(encoding="utf-8"))
        verify(
            base,
            package,
            package_identity,
            context_identity,
            effective,
            evidence,
            args.candidate_commit,
            receipt,
        )
        result = {
            "status": "CANDIDATE_READBACK_VERIFIED",
            "owner_review_state": "NOT_ACCEPTED",
            "immutable_inputs_v3": immutable_inputs(
                package,
                package_identity,
                context_identity,
                evidence,
                args.candidate_commit,
            ),
        }
        marker = "F0_MEDALLIONS_BRAND_CANDIDATE_READBACK_PASS"

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
        print(f"F0_MEDALLIONS_BRAND_CANDIDATE_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)

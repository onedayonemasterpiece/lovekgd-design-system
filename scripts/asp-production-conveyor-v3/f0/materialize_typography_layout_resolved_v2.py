#!/usr/bin/env python3
"""Resolve the font-manifest hash from the immutable v1 source package.

This wrapper keeps F-TYPOGRAPHY-LAYOUT v2 free of hand-copied provenance. It
loads the guarded base runner, extracts the accepted manifest hash from the
content-addressed v1 package, binds it in memory, and then runs plan/execute/
verify exactly as the base runner specifies.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path
import sys
from typing import Any

BASE_NAME = "materialize_typography_layout_v2.py"
DEFAULT_PACKAGE = (
    "catalog/asp-production-conveyor-v3/f0/"
    "F-TYPOGRAPHY-LAYOUT.package.v2.json"
)


def load_base() -> Any:
    path = Path(__file__).with_name(BASE_NAME)
    spec = importlib.util.spec_from_file_location("f0_typography_layout_base_v2", path)
    assert spec and spec.loader, f"cannot load base runner: {path}"
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def resolve_manifest_sha256(repo: Path, package: dict[str, Any]) -> str:
    source_path = repo / package["source_package"]["path"]
    source = json.loads(source_path.read_text(encoding="utf-8"))
    authority = source.get("source_authority", {})
    candidates = [
        authority.get("generation_19_font_binding", {}).get(
            "manifest_content_sha256"
        ),
        authority.get("generation_19_font_binding", {}).get("manifest_sha256"),
        source.get("font_binding", {}).get("manifest_content_sha256"),
        source.get("font_binding", {}).get("manifest_sha256"),
    ]
    value = next((item for item in candidates if item), None)
    assert isinstance(value, str) and len(value) == 64, (
        "immutable v1 source package has no full SHA-256 font manifest identity"
    )
    return value


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

    base = load_base()
    repo = Path(args.repo).resolve() if args.repo else Path(__file__).resolve().parents[3]
    package, package_identity = base.load_package(repo, args.package)
    assert package["font_binding"]["manifest_sha256"] == (
        "RESOLVE_FROM_IMMUTABLE_SOURCE_PACKAGE"
    )
    package["font_binding"]["manifest_sha256"] = resolve_manifest_sha256(
        repo, package
    )
    source_identity = base.validate_source(repo, package)
    validated = base.validate_values(package)

    if args.mode == "plan":
        result = base.build_plan(
            package,
            package_identity,
            source_identity,
            args.candidate_commit,
            validated,
        )
        result["resolved_font_manifest_sha256"] = package["font_binding"][
            "manifest_sha256"
        ]
        marker = "F0_TYPOGRAPHY_LAYOUT_PLAN_PASS"
    elif args.mode == "execute":
        result = base.execute(package, package_identity, source_identity, args)
        marker = "F0_TYPOGRAPHY_LAYOUT_EXECUTE_PASS"
    else:
        assert args.receipt, "verify requires --receipt"
        receipt = json.loads(Path(args.receipt).read_text(encoding="utf-8"))
        base.verify(
            package,
            package_identity,
            source_identity,
            args.candidate_commit,
            receipt,
        )
        result = {
            "status": "READBACK_VERIFIED",
            "resolved_font_manifest_sha256": package["font_binding"][
                "manifest_sha256"
            ],
            "immutable_inputs": base.immutable(
                package,
                package_identity,
                source_identity,
                args.candidate_commit,
            ),
        }
        marker = "F0_TYPOGRAPHY_LAYOUT_READBACK_PASS"

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
        print(f"F0_TYPOGRAPHY_LAYOUT_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)

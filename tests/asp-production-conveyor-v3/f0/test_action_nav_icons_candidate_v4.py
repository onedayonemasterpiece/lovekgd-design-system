#!/usr/bin/env python3
"""Regression tests for current-target F-ACTION-NAV-ICONS revision 4."""

from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[3]
RUNNER_PATH = (
    REPO
    / "scripts/asp-production-conveyor-v3/f0/"
    / "materialize_action_nav_icons_v4.py"
)
spec = importlib.util.spec_from_file_location("action_nav_v4", RUNNER_PATH)
assert spec and spec.loader
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
H = runner.H


def fixture_repo() -> tuple[tempfile.TemporaryDirectory, Path, dict]:
    temp = tempfile.TemporaryDirectory()
    repo = Path(temp.name)
    variants = sorted(H.EXPECTED_ASSET_VARIANTS)
    assets = []
    for index, (asset_id, variant) in enumerate(variants):
        path = f"assets/{index}.svg"
        data = f'<svg xmlns="http://www.w3.org/2000/svg"><path d="M{index} 0"/></svg>\n'.encode()
        target = repo / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        assets.append(
            {
                "asset_id": asset_id,
                "variant": variant,
                "component_name": asset_id.replace(".", "/"),
                "semantic_slot": asset_id,
                "source_commit": "a" * 40,
                "source_path": "source.astro",
                "path": path,
                "viewBox": "0 0 24 24",
                "nominal_box": {"width_px": 24, "height_px": 24},
                "fill_stroke_contract": {"fill": "currentColor"},
                "reuse": "EXACT_V3_BYTES_UNCHANGED",
                **H.identity(data),
            }
        )
    for path, data in (
        ("source-v3.json", b"source-v3\n"),
        ("registry.yaml", b"registry\n"),
        ("helper.py", b"helper\n"),
    ):
        (repo / path).write_bytes(data)
    descriptors = {
        path: {"path": path, **H.identity((repo / path).read_bytes())}
        for path in ("source-v3.json", "registry.yaml", "helper.py")
    }
    package = {
        "package_id": "F-ACTION-NAV-ICONS",
        "revision": 4,
        "status": "READY_FOR_D0_INTEGRATE",
        "candidate_materialization_state": "READY_AFTER_D0_PASS",
        "promotion_state": "BLOCKED_UNTIL_V0_REVIEW",
        "branch": "fixture/action-v4",
        "immutable_identity": {"package_path": "fixture/package.json"},
        "source_package_v3": descriptors["source-v3.json"],
        "asset_registry": descriptors["registry.yaml"],
        "helper": descriptors["helper.py"],
        "runner": {},
        "tests": {},
        "assets_and_hashes": assets,
        "component_ids": sorted({item["asset_id"] for item in assets}),
        "adapter_contract": {
            "method_surface": [
                "read_document",
                "assert_active_lease",
                "ensure_page",
                "upsert_svg_component",
                "upsert_specimen",
                "validate",
                "export_png",
                "readback",
            ]
        },
        "specimen": {
            "consumer": "fixture",
            "states": [f"state-{index}" for index in range(18)],
        },
        "target_penpot_page": {
            "file_id": H.CURRENT_FILE_ID,
            "exact_name": "01 · Foundations · Icons and actions · Candidate",
            "candidate_label": "CANDIDATE_BUILD_NOT_ACCEPTED",
            "old_penpot_id_reuse_allowed": False,
        },
        "candidate_root": {"exact_name": "CANDIDATE_BUILD_NOT_ACCEPTED · Icons"},
        "protected_surface": {
            "file_id": H.CURRENT_FILE_ID,
            "page_id": "protected-page",
            "page_name": "00 · Components · Free collection",
            "root_ids": ["accepted", "rejected"],
            "mutation_allowed": False,
        },
        "expected_roots": 1,
        "expected_components": 8,
        "expected_instances": 18,
    }
    return temp, repo, package


class FakeAdapter:
    def __init__(self, mutate_protected: bool = False) -> None:
        self.revision = 73
        self.protected_reads = 0
        self.mutate_protected = mutate_protected
        self.components: list[str] = []

    def read_document(self, **_: object) -> dict:
        return {"revision": self.revision}

    def assert_active_lease(self, **_: object) -> dict:
        return {"active": True, "cancelled": False}

    def ensure_page(self, **_: object) -> dict:
        self.revision += 1
        return {"page_id": "candidate-page"}

    def upsert_svg_component(self, **_: object) -> dict:
        value = f"component-{len(self.components)}"
        self.components.append(value)
        self.revision += 1
        return {"component_id": value}

    def upsert_specimen(self, **_: object) -> dict:
        self.revision += 1
        return {"shape_id": "root"}

    def validate(self, **_: object) -> dict:
        return {"errors": []}

    def export_png(self, **_: object) -> dict:
        return {"nonempty": True}

    def readback(self, *, page_id: str, shape_ids: list[str], **_: object) -> dict:
        if page_id == "protected-page":
            self.protected_reads += 1
            value = "changed" if self.mutate_protected and self.protected_reads > 1 else "stable"
            return {"shapes": [{"id": item, "name": value} for item in shape_ids]}
        return {
            "instance_count": 18,
            "detached_instance_count": 0,
            "screenshot_shape_count": 0,
        }


class ActionNavV4Tests(unittest.TestCase):
    def setUp(self) -> None:
        temp, repo, package = fixture_repo()
        self.addCleanup(temp.cleanup)
        self.repo = repo
        self.package = package

    def test_current_target_and_adapter_surface(self) -> None:
        result = H.validate_model(self.package)
        self.assertTrue(result["adapter_method_surface_preserved"])
        self.assertEqual(result["current_target"], H.CURRENT_FILE_ID)

    def test_repository_inputs_are_exact(self) -> None:
        evidence = H.verify_repository_inputs(self.repo, self.package)
        self.assertEqual(len(evidence["assets"]), 9)

    def test_svg_drift_fails_closed(self) -> None:
        path = self.repo / self.package["assets_and_hashes"][0]["path"]
        path.write_text("<svg>drift</svg>\n")
        with self.assertRaisesRegex(AssertionError, "git_blob_sha1 mismatch"):
            H.verify_repository_inputs(self.repo, self.package)

    def test_execute_and_verify_preserve_exact_bytes_and_surface(self) -> None:
        evidence = H.verify_repository_inputs(self.repo, self.package)
        package_identity = H.identity(
            (json.dumps(self.package, ensure_ascii=False) + "\n").encode()
        )
        adapter = FakeAdapter()
        original = runner.load_adapter
        runner.load_adapter = lambda _spec, _package: adapter
        self.addCleanup(setattr, runner, "load_adapter", original)
        args = argparse.Namespace(
            adapter="fixture:factory",
            run_id="run",
            lease_token="lease",
            cancel_token="cancel",
            candidate_commit="a" * 40,
        )
        receipt = runner.execute(
            self.repo,
            self.package,
            package_identity,
            {},
            evidence,
            args,
        )
        runner.verify(
            self.package,
            package_identity,
            evidence,
            args.candidate_commit,
            receipt,
        )
        self.assertTrue(
            receipt["provenance_receipt"]["same_exact_svg_bytes_as_v3"]
        )

    def test_protected_surface_drift_fails_closed(self) -> None:
        evidence = H.verify_repository_inputs(self.repo, self.package)
        adapter = FakeAdapter(mutate_protected=True)
        original = runner.load_adapter
        runner.load_adapter = lambda _spec, _package: adapter
        self.addCleanup(setattr, runner, "load_adapter", original)
        args = argparse.Namespace(
            adapter="fixture:factory",
            run_id="run",
            lease_token="lease",
            cancel_token="cancel",
            candidate_commit="b" * 40,
        )
        with self.assertRaisesRegex(AssertionError, "protected surface changed"):
            runner.execute(
                self.repo,
                self.package,
                H.identity(b"fixture"),
                {},
                evidence,
                args,
            )


if __name__ == "__main__":
    unittest.main()

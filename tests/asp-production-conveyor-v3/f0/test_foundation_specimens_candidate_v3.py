#!/usr/bin/env python3
"""Regression tests for the F0 foundation candidate runner v3."""

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
    / "materialize_foundation_specimens_v3.py"
)

spec = importlib.util.spec_from_file_location("foundation_candidate_v3", RUNNER_PATH)
assert spec and spec.loader
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)


def source_package() -> dict:
    component_specs = [
        ("foundation.colors-and-modes", "ColorsAndModes", "colors"),
        ("foundation.status", "StatusPairs", "status_pairs"),
        ("foundation.spacing", "SpacingScale", "spacing"),
        ("foundation.sizing-density", "SizingDensity", "sizing"),
        ("foundation.radius-border", "Radii", "radii"),
        ("foundation.elevation", "Elevation", "shadows"),
        ("foundation.motion", "Motion", "motion"),
        ("foundation.accessibility", "Accessibility", "accessibility"),
    ]
    components = [
        {
            "id": component_id,
            "penpot_name": f"Foundation/Specimen/{name}",
            "value_domain": domain,
            "render_contract": "fixture",
        }
        for component_id, name, domain in component_specs
    ]
    placements = [
        {
            "id": f"placement/{index}",
            "component_id": components[index % len(components)]["id"],
            "value": "fixture",
        }
        for index in range(57)
    ]
    return {
        "package_id": "F-FOUNDATIONS-SPECIMENS",
        "revision": 2,
        "specimens": {
            "colors": {f"color-{index}": "#000000" for index in range(18)},
            "status_pairs": {
                f"status-{index}": {"surface": "#ffffff", "content": "#000000"}
                for index in range(4)
            },
            "spacing": {str(index): f"{index}px" for index in range(10)},
            "sizing": {
                "control_min": "44px",
                "content_max": "1180px",
                "content_wide_max": "1440px",
                "listing_media_height": "fixture",
            },
            "radii": {str(index): f"{index}px" for index in range(5)},
            "shadows": {str(index): f"{index}px" for index in range(3)},
            "motion": {
                "duration_fast": "160ms",
                "duration_base": "220ms",
                "ease_standard": "cubic-bezier(0.2, 0.8, 0.2, 1)",
                "reduced_motion": "mandatory-no-op",
            },
            "accessibility": {
                f"a11y-{index}": "fixture" for index in range(5)
            },
        },
        "specimen_components": components,
        "materialization_entry_point": {
            "specimen": {"name": "source-v2", "placements": placements}
        },
        "asset_registry_applicability": {"external_asset_slots": 0},
        "source_authority": {
            "astro": {"commit": "f2d658e8be057f3b75431f6b77e4887af4536028"},
            "runtime_files": [{"path": "fixture", "sha256": "fixture"}],
            "requirements_contract": {
                "sha256": "54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72"
            },
        },
    }


def overlay_package(source_identity: dict) -> dict:
    return {
        "package_id": "F-FOUNDATIONS-SPECIMENS",
        "revision": 3,
        "status": "READY_TO_MATERIALIZE_CANDIDATE",
        "promotion_state": "BLOCKED_UNTIL_NATIVE_READBACK_AND_V0_REVIEW",
        "branch": "test/foundation-candidate",
        "immutable_identity": {
            "package_path": (
                "catalog/asp-production-conveyor-v3/f0/"
                "F-FOUNDATIONS-SPECIMENS.package.v3.json"
            )
        },
        "source_package_v2": {
            "path": (
                "catalog/asp-production-conveyor-v3/f0/"
                "F-FOUNDATIONS-SPECIMENS.package.v2.json"
            ),
            "git_blob_sha1": source_identity["git_blob_sha1"],
            "bytes": source_identity["bytes"],
        },
        "target_penpot_page": {
            "file_id": runner.CURRENT_FILE_ID,
            "exact_name": "03 · Foundations · Candidate",
            "candidate_label": "CANDIDATE_BUILD_NOT_ACCEPTED",
        },
        "candidate_root": {
            "exact_name": "CANDIDATE_BUILD_NOT_ACCEPTED · Foundations"
        },
        "protected_surface": {
            "file_id": runner.CURRENT_FILE_ID,
            "page_id": "protected-page",
            "page_name": "00 · Components · Free collection",
            "root_ids": ["protected-root"],
            "mutation_allowed": False,
        },
        "expected_roots": 1,
        "expected_components": 8,
        "expected_instances": 57,
    }


class FakeAdapter:
    def __init__(self, active: bool = True) -> None:
        self.active = active
        self.revision = 58
        self.mutations = 0
        self.component_ids: list[str] = []

    def read_document(self, *, file_id: str) -> dict:
        return {"file_id": file_id, "revision": self.revision}

    def assert_active_lease(self, **_: str) -> dict:
        return {"active": self.active, "cancelled": not self.active}

    def ensure_page(self, **_: object) -> dict:
        self.mutations += 1
        self.revision += 1
        return {"page_id": "candidate-page"}

    def upsert_foundation_specimen_component(self, **_: object) -> dict:
        self.mutations += 1
        self.revision += 1
        component_id = f"component-{len(self.component_ids)}"
        self.component_ids.append(component_id)
        return {"component_id": component_id}

    def upsert_foundation_specimen_root(self, **_: object) -> dict:
        self.mutations += 1
        self.revision += 1
        return {"shape_id": "candidate-root"}

    def validate(self, **_: object) -> dict:
        return {"errors": []}

    def export_png(self, **_: object) -> dict:
        return {"nonempty": True}

    def readback(self, *, page_id: str, shape_ids: list[str], **_: object) -> dict:
        if page_id == "protected-page":
            return {
                "shapes": [
                    {"id": shape_id, "name": "unchanged"} for shape_id in shape_ids
                ]
            }
        return {
            "shape_ids": shape_ids,
            "instance_count": 57,
            "detached_instance_count": 0,
            "screenshot_shape_count": 0,
        }


class FoundationCandidateV3Tests(unittest.TestCase):
    def make_repo(self) -> tuple[Path, dict, dict, tempfile.TemporaryDirectory]:
        temp = tempfile.TemporaryDirectory()
        repo = Path(temp.name)
        package_dir = repo / "catalog/asp-production-conveyor-v3/f0"
        package_dir.mkdir(parents=True)

        source = source_package()
        source_bytes = (
            json.dumps(source, ensure_ascii=False, indent=2) + "\n"
        ).encode("utf-8")
        source_identity = runner.identity(source_bytes)
        (package_dir / "F-FOUNDATIONS-SPECIMENS.package.v2.json").write_bytes(
            source_bytes
        )

        package = overlay_package(source_identity)
        (package_dir / "F-FOUNDATIONS-SPECIMENS.package.v3.json").write_text(
            json.dumps(package, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        return repo, package, source, temp

    def test_plan_accepts_direct_spacing_map_and_current_target(self) -> None:
        repo, _, _, temp = self.make_repo()
        self.addCleanup(temp.cleanup)
        package, package_identity, source, source_identity = runner.load_package(
            repo, runner.DEFAULT_PACKAGE
        )
        validated = runner.validate_model(package, source)
        plan = runner.build_plan(
            package,
            package_identity,
            source,
            source_identity,
            "a" * 40,
            validated,
        )
        self.assertEqual(validated["spacing_values"], 10)
        self.assertEqual(
            plan["marker"], "F0_FOUNDATION_SPECIMENS_CANDIDATE_PLAN_PASS"
        )
        self.assertEqual(plan["target"]["file_id"], runner.CURRENT_FILE_ID)

    def test_stale_penpot_file_is_rejected(self) -> None:
        _, package, source, temp = self.make_repo()
        self.addCleanup(temp.cleanup)
        package["target_penpot_page"]["file_id"] = (
            "40e06342-0493-81e4-8007-37c4238ecc5f"
        )
        with self.assertRaisesRegex(AssertionError, "stale Penpot file target"):
            runner.validate_model(package, source)

    def test_execute_and_verify_preserve_protected_surface(self) -> None:
        repo, _, _, temp = self.make_repo()
        self.addCleanup(temp.cleanup)
        package, package_identity, source, source_identity = runner.load_package(
            repo, runner.DEFAULT_PACKAGE
        )
        runner.validate_model(package, source)
        adapter = FakeAdapter()
        original_loader = runner.load_adapter
        runner.load_adapter = lambda _: adapter
        self.addCleanup(setattr, runner, "load_adapter", original_loader)
        args = argparse.Namespace(
            adapter="fixture:factory",
            run_id="run",
            lease_token="lease",
            cancel_token="cancel",
            candidate_commit="b" * 40,
        )
        receipt = runner.execute(
            package, package_identity, source, source_identity, args
        )
        runner.verify(
            package,
            package_identity,
            source_identity,
            args.candidate_commit,
            receipt,
        )
        self.assertEqual(adapter.mutations, 10)
        self.assertFalse(receipt["protected_surface"]["mutated"])
        self.assertEqual(
            receipt["protected_surface"]["before_digest"],
            receipt["protected_surface"]["after_digest"],
        )
        self.assertEqual(receipt["counts"]["instances"], 57)

    def test_cancelled_lease_blocks_first_mutation(self) -> None:
        repo, _, _, temp = self.make_repo()
        self.addCleanup(temp.cleanup)
        package, package_identity, source, source_identity = runner.load_package(
            repo, runner.DEFAULT_PACKAGE
        )
        adapter = FakeAdapter(active=False)
        original_loader = runner.load_adapter
        runner.load_adapter = lambda _: adapter
        self.addCleanup(setattr, runner, "load_adapter", original_loader)
        args = argparse.Namespace(
            adapter="fixture:factory",
            run_id="run",
            lease_token="lease",
            cancel_token="cancel",
            candidate_commit="c" * 40,
        )
        with self.assertRaisesRegex(AssertionError, "inactive before"):
            runner.execute(
                package, package_identity, source, source_identity, args
            )
        self.assertEqual(adapter.mutations, 0)


if __name__ == "__main__":
    unittest.main()

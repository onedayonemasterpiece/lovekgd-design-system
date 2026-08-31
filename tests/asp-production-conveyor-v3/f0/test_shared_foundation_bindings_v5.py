#!/usr/bin/env python3
"""Regression tests for F-SHARED-FOUNDATION-BINDINGS revision 5."""

from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[3]
RUNNER_PATH = (
    REPO
    / "scripts/asp-production-conveyor-v3/f0/"
    / "materialize_shared_foundation_bindings_v5.py"
)
spec = importlib.util.spec_from_file_location("shared_bindings_v5", RUNNER_PATH)
assert spec and spec.loader
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
H = runner.H


def init_git_repo(package_id: str, revision: int) -> tuple[tempfile.TemporaryDirectory, Path, dict]:
    temp = tempfile.TemporaryDirectory()
    repo = Path(temp.name)
    package_path = Path("catalog") / f"{package_id}.json"
    target = repo / package_path
    target.parent.mkdir(parents=True, exist_ok=True)
    package = {
        "package_id": package_id,
        "revision": revision,
        "target_penpot_page": {"file_id": H.CURRENT_FILE_ID},
    }
    data = (json.dumps(package, ensure_ascii=False, indent=2) + "\n").encode()
    target.write_bytes(data)
    subprocess.run(["git", "init", "-q"], cwd=repo, check=True)
    subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=repo, check=True)
    subprocess.run(["git", "config", "user.name", "Test"], cwd=repo, check=True)
    subprocess.run(["git", "add", "."], cwd=repo, check=True)
    subprocess.run(["git", "commit", "-qm", "producer"], cwd=repo, check=True)
    head = H.checkout_head(repo)
    descriptor = {
        "package_id": package_id,
        "revision": revision,
        "branch": f"fixture/{package_id.lower()}",
        "head": head,
        "package_path": str(package_path),
        "package_git_blob_sha1": H.identity(data)["git_blob_sha1"],
        "package_bytes": len(data),
        "integration_request_id": f"REQUEST-{package_id}",
        "declared_state_at_freeze": "AWAITING_D0_INTEGRATE_PASS",
    }
    return temp, repo, descriptor


def binding_components() -> list[dict]:
    mapping = [
        ("foundation.binding.color", "Foundation/Binding/Color", "F-FOUNDATIONS-SPECIMENS"),
        ("foundation.binding.typography", "Foundation/Binding/Typography", "F-TYPOGRAPHY-LAYOUT"),
        ("foundation.binding.spacing", "Foundation/Binding/Spacing", "F-FOUNDATIONS-SPECIMENS"),
        ("foundation.binding.radius", "Foundation/Binding/Radius", "F-FOUNDATIONS-SPECIMENS"),
        ("foundation.binding.layout", "Foundation/Binding/Layout", "F-TYPOGRAPHY-LAYOUT"),
        ("foundation.binding.motion", "Foundation/Binding/Motion", "F-FOUNDATIONS-SPECIMENS"),
        ("foundation.binding.action-navigation-assets", "Foundation/Binding/ActionNavigationAssets", "F-ACTION-NAV-ICONS"),
        ("foundation.binding.copy-check-assets", "Foundation/Binding/CopyCheckAssets", "F-COPY-CHECK-ASSETS"),
        ("foundation.binding.medallion-assets", "Foundation/Binding/MedallionAssets", "F-MEDALLIONS-BRAND-ASSETS"),
        ("foundation.binding.brand-assets", "Foundation/Binding/BrandAssets", "F-BRANDBOOK-BASELINE"),
    ]
    return [
        {
            "id": component_id,
            "penpot_name": penpot_name,
            "source_package": source_package,
            "binding_contract": "fixture",
        }
        for component_id, penpot_name, source_package in mapping
    ]


def fixture_package(producers: list[dict]) -> dict:
    components = binding_components()
    placements = [
        {
            "id": f"placement-{index}",
            "component_id": components[index % len(components)]["id"],
            "state": str(index),
        }
        for index in range(34)
    ]
    return {
        "package_id": "F-SHARED-FOUNDATION-BINDINGS",
        "revision": 5,
        "status": "READY_FOR_D0_INTEGRATE",
        "ready_to_publish": False,
        "ready_to_promote": False,
        "branch": "fixture/shared-v5",
        "immutable_identity": {"package_path": "fixture/package.json"},
        "source_package_v4": {},
        "helper": {},
        "runner": {},
        "tests": {},
        "producer_packages": producers,
        "binding_components": components,
        "specimen": {"placements": placements},
        "adapter_contract": {
            "method_surface": [
                "read_document",
                "assert_active_lease",
                "ensure_page",
                "upsert_foundation_binding_component",
                "upsert_binding_specimen",
                "validate",
                "export_png",
                "readback",
            ]
        },
        "target_penpot_page": {
            "file_id": H.CURRENT_FILE_ID,
            "exact_name": "06 · Foundations · Shared bindings · Candidate",
            "candidate_label": "CANDIDATE_BUILD_NOT_ACCEPTED",
            "old_penpot_id_reuse_allowed": False,
        },
        "candidate_root": {
            "exact_name": "CANDIDATE_BUILD_NOT_ACCEPTED · Shared bindings"
        },
        "protected_surface": {
            "file_id": H.CURRENT_FILE_ID,
            "page_id": "protected-page",
            "page_name": "00 · Components · Free collection",
            "root_ids": ["accepted", "rejected"],
            "mutation_allowed": False,
        },
        "consumer_defect_boundaries": {
            "eventcard_text": {"closed_by_this_package": False},
            "eventcard_poster": {"closed_by_this_package": False},
        },
        "expected_roots": 1,
        "expected_components": 10,
        "expected_instances": 34,
    }


def create_receipts(directory: Path, package: dict) -> None:
    for descriptor in package["producer_packages"]:
        receipt = {
            "marker": "D0_INTEGRATION_RESULT_V2",
            "request_id": descriptor["integration_request_id"],
            "verdict": "PASS",
            "package_id": descriptor["package_id"],
            "package_revision": descriptor["revision"],
            "penpot_mutations": 0,
            "exact_package_tuple": H.expected_receipt_tuple(descriptor),
        }
        (directory / f"{descriptor['package_id']}.json").write_text(
            json.dumps(receipt, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )


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

    def upsert_foundation_binding_component(self, **_: object) -> dict:
        value = f"component-{len(self.components)}"
        self.components.append(value)
        self.revision += 1
        return {"component_id": value}

    def upsert_binding_specimen(self, **_: object) -> dict:
        self.revision += 1
        return {"shape_id": "root"}

    def validate(self, **_: object) -> dict:
        return {"errors": []}

    def export_png(self, **_: object) -> dict:
        return {"nonempty": True}

    def readback(self, *, page_id: str, shape_ids: list[str], **_: object) -> dict:
        if page_id == "protected-page":
            self.protected_reads += 1
            value = (
                "changed"
                if self.mutate_protected and self.protected_reads > 1
                else "stable"
            )
            return {"shapes": [{"id": item, "name": value} for item in shape_ids]}
        return {
            "instance_count": 34,
            "detached_instance_count": 0,
            "screenshot_shape_count": 0,
        }


class SharedBindingsV5Tests(unittest.TestCase):
    def setUp(self) -> None:
        self.temps = []
        self.checkouts = {}
        self.descriptors = []
        for package_id, revision in sorted(H.EXPECTED_PRODUCERS.items()):
            temp, repo, descriptor = init_git_repo(package_id, revision)
            self.temps.append(temp)
            self.checkouts[package_id] = repo
            self.descriptors.append(descriptor)
        for temp in self.temps:
            self.addCleanup(temp.cleanup)
        self.package = fixture_package(self.descriptors)
        self.producer_inputs = H.verify_producer_checkouts(
            self.package, self.checkouts
        )

    def test_model_is_honestly_integration_gated(self) -> None:
        result = H.validate_model(self.package)
        self.assertEqual(
            result["dependency_state"],
            "AWAITING_SIX_D0_INTEGRATE_PASS",
        )
        self.assertFalse(self.package["ready_to_publish"])
        self.assertFalse(self.package["ready_to_promote"])

    def test_exact_producer_checkouts_pass(self) -> None:
        self.assertEqual(len(self.producer_inputs), 6)

    def test_producer_head_drift_fails_closed(self) -> None:
        package_id = sorted(self.checkouts)[0]
        repo = self.checkouts[package_id]
        (repo / "drift.txt").write_text("drift\n")
        subprocess.run(["git", "add", "."], cwd=repo, check=True)
        subprocess.run(["git", "commit", "-qm", "drift"], cwd=repo, check=True)
        with self.assertRaisesRegex(AssertionError, "head"):
            H.verify_producer_checkouts(self.package, self.checkouts)

    def test_missing_receipts_block_before_adapter_load(self) -> None:
        package_identity = H.identity(b"fixture")
        with tempfile.TemporaryDirectory() as tmp:
            loaded = {"value": False}
            original = runner.load_adapter
            runner.load_adapter = lambda *_: loaded.__setitem__("value", True)
            self.addCleanup(setattr, runner, "load_adapter", original)
            args = argparse.Namespace(
                dependency_receipts_dir=tmp,
                adapter="fixture:factory",
                run_id="run",
                lease_token="lease",
                cancel_token="cancel",
                candidate_commit="a" * 40,
            )
            with self.assertRaisesRegex(AssertionError, "missing D0 PASS receipts"):
                runner.execute(
                    self.package,
                    package_identity,
                    {},
                    {},
                    self.producer_inputs,
                    args,
                )
            self.assertFalse(loaded["value"])

    def test_execute_and_verify_require_six_exact_passes(self) -> None:
        package_identity = H.identity(
            (json.dumps(self.package, ensure_ascii=False) + "\n").encode()
        )
        with tempfile.TemporaryDirectory() as tmp:
            receipts = Path(tmp)
            create_receipts(receipts, self.package)
            adapter = FakeAdapter()
            original = runner.load_adapter
            runner.load_adapter = lambda *_: adapter
            self.addCleanup(setattr, runner, "load_adapter", original)
            args = argparse.Namespace(
                dependency_receipts_dir=tmp,
                adapter="fixture:factory",
                run_id="run",
                lease_token="lease",
                cancel_token="cancel",
                candidate_commit="b" * 40,
            )
            receipt = runner.execute(
                self.package,
                package_identity,
                {},
                {},
                self.producer_inputs,
                args,
            )
            runner.verify(
                self.package,
                package_identity,
                {},
                self.producer_inputs,
                args.candidate_commit,
                receipt,
            )
            self.assertEqual(len(receipt["dependency_integration_receipts"]), 6)
            self.assertEqual(receipt["counts"]["instances"], 34)

    def test_protected_surface_drift_fails_closed(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            receipts = Path(tmp)
            create_receipts(receipts, self.package)
            adapter = FakeAdapter(mutate_protected=True)
            original = runner.load_adapter
            runner.load_adapter = lambda *_: adapter
            self.addCleanup(setattr, runner, "load_adapter", original)
            args = argparse.Namespace(
                dependency_receipts_dir=tmp,
                adapter="fixture:factory",
                run_id="run",
                lease_token="lease",
                cancel_token="cancel",
                candidate_commit="c" * 40,
            )
            with self.assertRaisesRegex(AssertionError, "protected surface changed"):
                runner.execute(
                    self.package,
                    H.identity(b"fixture"),
                    {},
                    {},
                    self.producer_inputs,
                    args,
                )


if __name__ == "__main__":
    unittest.main()

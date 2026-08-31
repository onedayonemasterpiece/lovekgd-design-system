#!/usr/bin/env python3
"""Regression tests for current-target F-BRANDBOOK-BASELINE revision 3."""

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
    / "materialize_brandbook_baseline_v3.py"
)
spec = importlib.util.spec_from_file_location("brandbook_v3", RUNNER_PATH)
assert spec and spec.loader
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
H = runner.H


def init_asset_repo() -> tuple[tempfile.TemporaryDirectory, Path, str, list[dict]]:
    temp = tempfile.TemporaryDirectory()
    repo = Path(temp.name)
    files = {
        "site/public/brand-mark.svg": b"<svg>mark</svg>\n",
        "site/public/brand/announcements-wordmark-ui.svg": b"<svg>wordmark</svg>\n",
        "site/public/favicon.svg": b"<svg>favicon</svg>\n",
    }
    assets = []
    ids = [
        ("brand.asset.primary-mark", "Brand/Asset/PrimaryMark"),
        ("brand.asset.announcements-wordmark", "Brand/Asset/AnnouncementsWordmark"),
        ("brand.asset.favicon-tag", "Brand/Asset/FaviconTag"),
    ]
    for (path, data), (asset_id, component_name) in zip(files.items(), ids):
        target = repo / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        assets.append(
            {
                "asset_id": asset_id,
                "component_name": component_name,
                "source_path": path,
                "transformation": "NONE",
                **H.identity(data),
            }
        )
    subprocess.run(["git", "init", "-q"], cwd=repo, check=True)
    subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=repo, check=True)
    subprocess.run(["git", "config", "user.name", "Test"], cwd=repo, check=True)
    subprocess.run(["git", "add", "."], cwd=repo, check=True)
    subprocess.run(["git", "commit", "-qm", "fixture"], cwd=repo, check=True)
    head = H.checkout_head(repo)
    return temp, repo, head, assets


def fixture_package(head: str, assets: list[dict]) -> dict:
    components = [
        {"id": item["asset_id"], "kind": "asset", "penpot_name": item["component_name"]}
        for item in assets
    ] + [
        {
            "id": "brand.lockup.desktop",
            "kind": "lockup",
            "penpot_name": "Brand/Lockup/Desktop",
            "asset_ids": [
                "brand.asset.primary-mark",
                "brand.asset.announcements-wordmark",
            ],
            "detached_assets": False,
        },
        {
            "id": "brand.lockup.mobile",
            "kind": "lockup",
            "penpot_name": "Brand/Lockup/Mobile",
            "asset_ids": [
                "brand.asset.primary-mark",
                "brand.asset.announcements-wordmark",
            ],
            "detached_assets": False,
        },
    ]
    placements = [
        {
            "id": f"placement-{index}",
            "component_id": components[index % 5]["id"],
            "state": str(index),
        }
        for index in range(14)
    ]
    return {
        "package_id": "F-BRANDBOOK-BASELINE",
        "revision": 3,
        "status": "READY_FOR_D0_INTEGRATE",
        "candidate_materialization_state": "READY_AFTER_D0_PASS",
        "promotion_state": "BLOCKED_UNTIL_V0_REVIEW",
        "branch": "fixture/brandbook-v3",
        "immutable_identity": {"package_path": "fixture/package.json"},
        "source_package_v2": {},
        "source_package_v1": {},
        "asset_registry": {},
        "helper": {},
        "runner": {},
        "tests": {},
        "source_authority": {"asset_repository": {"commit": head}},
        "assets": assets,
        "brand_components": components,
        "source_components": {"announcements_lockup": {"path": "fixture"}},
        "misuse_rules": ["no redraw"],
        "specimen": {"placements": placements},
        "target_penpot_page": {
            "file_id": H.CURRENT_FILE_ID,
            "exact_name": "05 · Brandbook · Current baseline · Candidate",
            "candidate_label": "CANDIDATE_BUILD_NOT_ACCEPTED",
            "old_penpot_id_reuse_allowed": False,
        },
        "candidate_root": {"exact_name": "CANDIDATE_BUILD_NOT_ACCEPTED · Brandbook"},
        "protected_surface": {
            "file_id": H.CURRENT_FILE_ID,
            "page_id": "protected-page",
            "page_name": "00 · Components · Free collection",
            "root_ids": ["accepted", "rejected"],
            "mutation_allowed": False,
        },
        "expected_roots": 1,
        "expected_components": 5,
        "expected_instances": 14,
    }


class FakeAdapter:
    def __init__(self, mutate_protected: bool = False) -> None:
        self.revision = 73
        self.protected_reads = 0
        self.mutate_protected = mutate_protected
        self.asset_ids: list[str] = []
        self.lockup_ids: list[str] = []

    def read_document(self, **_: object) -> dict:
        return {"revision": self.revision}

    def assert_active_lease(self, **_: object) -> dict:
        return {"active": True, "cancelled": False}

    def ensure_page(self, **_: object) -> dict:
        self.revision += 1
        return {"page_id": "candidate-page"}

    def upsert_svg_asset_component(self, **_: object) -> dict:
        value = f"asset-{len(self.asset_ids)}"
        self.asset_ids.append(value)
        self.revision += 1
        return {"component_id": value}

    def upsert_brand_lockup_component(self, **_: object) -> dict:
        value = f"lockup-{len(self.lockup_ids)}"
        self.lockup_ids.append(value)
        self.revision += 1
        return {"component_id": value}

    def upsert_brandbook_specimen(self, **_: object) -> dict:
        self.revision += 1
        return {"shape_id": "brandbook-root"}

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
            "instance_count": 14,
            "linked_asset_instance_count": 4,
            "detached_instance_count": 0,
            "screenshot_shape_count": 0,
        }


class BrandbookV3Tests(unittest.TestCase):
    def setUp(self) -> None:
        temp, repo, head, assets = init_asset_repo()
        self.addCleanup(temp.cleanup)
        self.asset_repo = repo
        self.package = fixture_package(head, assets)

    def test_exact_asset_checkout_passes(self) -> None:
        verified = H.verify_asset_checkout(self.asset_repo, self.package)
        self.assertEqual(len(verified), 3)

    def test_asset_byte_drift_fails_closed(self) -> None:
        path = self.asset_repo / self.package["assets"][0]["source_path"]
        path.write_bytes(b"drift")
        with self.assertRaisesRegex(AssertionError, "git_blob_sha1 mismatch"):
            H.verify_asset_checkout(self.asset_repo, self.package)

    def test_current_target_and_linked_lockup_model(self) -> None:
        result = H.validate_model(self.package)
        self.assertEqual(result["current_target"], H.CURRENT_FILE_ID)
        self.assertEqual(result["linked_asset_instances_required"], 4)

    def test_execute_and_verify_preserve_protected_surface(self) -> None:
        package_identity = H.identity(
            (json.dumps(self.package, ensure_ascii=False) + "\n").encode("utf-8")
        )
        adapter = FakeAdapter()
        original = runner.load_adapter
        runner.load_adapter = lambda _: adapter
        self.addCleanup(setattr, runner, "load_adapter", original)
        args = argparse.Namespace(
            asset_repo=str(self.asset_repo),
            adapter="fixture:factory",
            run_id="run",
            lease_token="lease",
            cancel_token="cancel",
            candidate_commit="a" * 40,
        )
        receipt = runner.execute(self.package, package_identity, {}, args)
        runner.verify(
            self.package, package_identity, args.candidate_commit, receipt
        )
        self.assertEqual(receipt["counts"]["linked_asset_instances"], 4)

    def test_protected_surface_drift_fails_closed(self) -> None:
        package_identity = H.identity(b"fixture")
        adapter = FakeAdapter(mutate_protected=True)
        original = runner.load_adapter
        runner.load_adapter = lambda _: adapter
        self.addCleanup(setattr, runner, "load_adapter", original)
        args = argparse.Namespace(
            asset_repo=str(self.asset_repo),
            adapter="fixture:factory",
            run_id="run",
            lease_token="lease",
            cancel_token="cancel",
            candidate_commit="b" * 40,
        )
        with self.assertRaisesRegex(AssertionError, "protected surface changed"):
            runner.execute(self.package, package_identity, {}, args)


if __name__ == "__main__":
    unittest.main()

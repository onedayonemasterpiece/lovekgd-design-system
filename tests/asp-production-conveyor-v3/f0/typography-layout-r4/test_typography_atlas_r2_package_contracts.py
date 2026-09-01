#!/usr/bin/env python3
"""Independent INTEGRATE checks for the two typography Atlas-R2 successors."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import subprocess
import unittest


REPO = Path(__file__).resolve().parents[4]
CATALOG = REPO / "catalog/asp-production-conveyor-v3/f0/typography-layout-r4"
RECEIPTS = REPO / "receipts/asp-production-conveyor-v3/f0/typography-layout-r4"
BASE = "eb388db611fb997283ba63c452b6642ff3508678"
ATLAS = "663be702d481972cb2e8863af500f1c35dda1d8c"
PACKAGE_IDS = (
    "F-TYPOGRAPHY-TYPE-SCALE-SMALL-PAGE",
    "F-TYPOGRAPHY-LAYOUT-RULES-SMALL-PAGE",
)


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def identity(path: Path) -> dict:
    data = path.read_bytes()
    return {
        "path": str(path.relative_to(REPO)),
        "git_blob_sha1": subprocess.check_output(
            ["git", "hash-object", str(path)], cwd=REPO, text=True
        ).strip(),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


class TypographyAtlasR2PackageContracts(unittest.TestCase):
    def setUp(self) -> None:
        self.packages = {
            package_id: load(CATALOG / f"{package_id}.package.r2.json")
            for package_id in PACKAGE_IDS
        }
        self.receipts = {
            package_id: load(RECEIPTS / f"{package_id}.receipt.r2.json")
            for package_id in PACKAGE_IDS
        }

    def test_01_source_and_atlas_git_tuples_are_exact(self) -> None:
        self.assertEqual(
            subprocess.check_output(["git", "rev-parse", f"{BASE}^{{tree}}"], cwd=REPO, text=True).strip(),
            "95dd6b548d1a5fd071b6fe35d74a893f8db21d7a",
        )
        self.assertEqual(
            subprocess.check_output(["git", "rev-parse", f"{ATLAS}^{{tree}}"], cwd=REPO, text=True).strip(),
            "cf9a1e6a5e0a84aea5636334dbd3be4961039b75",
        )
        self.assertEqual(
            subprocess.check_output(
                ["git", "rev-parse", f"{BASE}:catalog/asp-production-conveyor-v3/f0/F-TYPOGRAPHY-LAYOUT.package.v3.json"],
                cwd=REPO,
                text=True,
            ).strip(),
            "501c307799bf412bc658dc89a04245f8a5cabc61",
        )
        atlas_paths = {
            "page_unit_bindings_blob": "catalog/asp-production-conveyor-v3/atlas-v2/page-unit-bindings.v2.json",
            "documentation_shell_blob": "catalog/asp-production-conveyor-v3/atlas-v2/documentation-shell-contract.v2.json",
            "template_registry_blob": "catalog/asp-production-conveyor-v3/atlas-v2/page-template-registry.v2.json",
            "page_map_blob": "catalog/asp-production-conveyor-v3/atlas-v2/penpot-page-map.v2.json",
        }
        for package in self.packages.values():
            for key, path in atlas_paths.items():
                actual = subprocess.check_output(
                    ["git", "rev-parse", f"{ATLAS}:{path}"], cwd=REPO, text=True
                ).strip()
                self.assertEqual(actual, package["atlas_r2"][key])

    def test_02_each_frozen_execution_tuple_reproduces(self) -> None:
        for package in self.packages.values():
            execution = package["frozen_execution_tuple"]
            for key in ("runtime", "executor", "strict_native_like_double", "package_test"):
                expected = execution[key]
                self.assertEqual(identity(REPO / expected["path"]), expected)

    def test_03_receipts_bind_exact_packages_and_independent_verdicts(self) -> None:
        for package_id in PACKAGE_IDS:
            package_path = CATALOG / f"{package_id}.package.r2.json"
            receipt = self.receipts[package_id]
            self.assertEqual(receipt["package"], identity(package_path))
            self.assertEqual(receipt["qa"], "PASS")
            self.assertEqual(receipt["integrate"], "PASS")
            self.assertEqual(receipt["terminal_status"], "PUBLISHABLE_AFTER_ATLAS_EVIDENCE_GATE")
            self.assertEqual(receipt["second_run_created"], 0)
            self.assertFalse(receipt["penpot_authorization"])

    def test_04_exact_font_files_match_both_packages(self) -> None:
        faces = {
            "regular": Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
            "bold": Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
        }
        for package in self.packages.values():
            for face, path in faces.items():
                data = path.read_bytes()
                expected = package["font_binding"][face]
                self.assertEqual(len(data), expected["bytes"])
                self.assertEqual(hashlib.sha256(data).hexdigest(), expected["sha256"])

    def test_05_split_counts_layout_formulas_and_boundaries_are_exact(self) -> None:
        type_scale = self.packages[PACKAGE_IDS[0]]
        layout = self.packages[PACKAGE_IDS[1]]
        self.assertEqual(
            [type_scale["projection"]["linked_visible_specimens"], layout["projection"]["linked_visible_specimens"]],
            [24, 27],
        )
        self.assertEqual(
            [type_scale["projection"]["root_height"], layout["projection"]["root_height"]],
            [4512, 5216],
        )
        for package in self.packages.values():
            self.assertEqual(package["wide_layout"]["root_width"], 2176)
            self.assertEqual(package["wide_layout"]["review_grid"]["columns"], 2)
            self.assertTrue(package["documentation_header"]["linked_instance_required"])
            self.assertEqual(package["projection"]["new_component_families"], 0)
            self.assertEqual(package["projection"]["empty_wells"], 0)
            self.assertTrue(package["safety"]["does_not_repair_eventcard_text"])
            self.assertEqual(package["safety"]["penpot_reads_in_conversion_wave"], 0)
            self.assertEqual(package["safety"]["penpot_mutations_in_conversion_wave"], 0)

    def test_06_strict_double_has_no_coercion_and_atlas_paths_are_unchanged(self) -> None:
        double_path = REPO / (
            "tests/asp-production-conveyor-v3/f0/typography-layout-r4/"
            "native_like_penpot_double.js"
        )
        source = double_path.read_text(encoding="utf-8")
        self.assertIn("typeof value !== 'string'", source)
        self.assertNotIn("String(value)", source)
        changed = subprocess.check_output(
            ["git", "diff", "--name-only", BASE, "--"], cwd=REPO, text=True
        ).splitlines()
        self.assertFalse(any("/atlas-v2/" in path for path in changed))


if __name__ == "__main__":
    unittest.main()

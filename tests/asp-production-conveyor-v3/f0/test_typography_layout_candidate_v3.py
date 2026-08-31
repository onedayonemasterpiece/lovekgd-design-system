#!/usr/bin/env python3
"""Regression tests for current-target F-TYPOGRAPHY-LAYOUT revision 3."""

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
    / "materialize_typography_layout_v3.py"
)
spec = importlib.util.spec_from_file_location("typography_v3", RUNNER_PATH)
assert spec and spec.loader
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
H = runner.H


def fixture_package() -> dict:
    roles = dict(H.EXPECTED_LINE_HEIGHT_RATIOS)
    wraps = [
        {
            "id": f"wrap-{index}",
            "text": text,
            "frame_width_px": width,
            "line_height_role": role,
            "editable": True,
        }
        for index, (text, width, role) in enumerate(
            [
                ("Кёнигсберг и Калининград", 180, "title"),
                ("31 августа, понедельник, 18:30", 170, "occurrence"),
                ("Музей изобразительных искусств", 160, "place"),
                ("выставка", 100, "event_type"),
                ("Бесплатно · вход свободный", 150, "admission"),
                ("Не интересно · В календарь · Поделиться", 190, "calendar_share"),
            ]
        )
    ]
    components = [
        {
            "id": f"component-{index}",
            "penpot_name": f"Foundation/TypographyLayout/{index}",
        }
        for index in range(10)
    ]
    placements = [
        {
            "id": f"placement-{index}",
            "component_id": components[index % 10]["id"],
            "state": str(index),
        }
        for index in range(51)
    ]
    return {
        "package_id": "F-TYPOGRAPHY-LAYOUT",
        "revision": 3,
        "status": "READY_FOR_D0_INTEGRATE",
        "candidate_materialization_state": "READY_AFTER_D0_PASS",
        "promotion_state": "BLOCKED_UNTIL_V0_REVIEW",
        "branch": "fixture/typography-v3",
        "immutable_identity": {"package_path": "fixture/package.json"},
        "source_package_v2": {"path": "source-v2.json", "git_blob_sha1": "", "bytes": 0},
        "source_package_v1": {"path": "source-v1.json", "git_blob_sha1": "", "bytes": 0},
        "helper": {"path": "helper.py", "git_blob_sha1": "", "bytes": 0},
        "runner": {"path": "runner.py", "git_blob_sha1": "", "bytes": 0},
        "tests": {"path": "tests.py", "git_blob_sha1": "", "bytes": 0},
        "font_binding": {
            **H.EXPECTED_FONT_FACES,
            "binaries_committed": False,
        },
        "typography": {
            "semantic_css_family": (
                "Inter, ui-sans-serif, system-ui, -apple-system, "
                "BlinkMacSystemFont, Segoe UI, sans-serif"
            ),
            "frozen_A_resolved_family": "DejaVu Sans",
            "line_height_roles": roles,
            "editable_cyrillic_wrap_specimens": wraps,
        },
        "layout": {},
        "specimen_components": components,
        "specimen": {"placements": placements},
        "target_penpot_page": {
            "file_id": H.CURRENT_FILE_ID,
            "exact_name": "04 · Foundations · Typography and layout · Candidate",
            "candidate_label": "CANDIDATE_BUILD_NOT_ACCEPTED",
        },
        "candidate_root": {"exact_name": "CANDIDATE_BUILD_NOT_ACCEPTED · Typography"},
        "protected_surface": {
            "file_id": H.CURRENT_FILE_ID,
            "page_id": "protected-page",
            "page_name": "00 · Components · Free collection",
            "root_ids": ["accepted", "rejected"],
            "mutation_allowed": False,
        },
        "expected_roots": 1,
        "expected_components": 10,
        "expected_instances": 51,
        "eventcard_consumer_boundary": {
            "owner": ["D0/MAT", "U0"],
            "closed_by_this_package": False,
            "active_tip_comment": 5481593090,
        },
    }


class FakeAdapter:
    def __init__(self, mutate_protected: bool = False) -> None:
        self.revision = 73
        self.components: list[str] = []
        self.mutate_protected = mutate_protected
        self.protected_reads = 0

    def read_document(self, **_: object) -> dict:
        return {"revision": self.revision}

    def assert_active_lease(self, **_: object) -> dict:
        return {"active": True, "cancelled": False}

    def verify_font_source(self, **kwargs: object) -> dict:
        return {"verified": True, "sha256": kwargs["expected_sha256"]}

    def ensure_page(self, **_: object) -> dict:
        self.revision += 1
        return {"page_id": "candidate-page"}

    def upsert_typography_layout_component(self, **_: object) -> dict:
        self.revision += 1
        value = f"component-{len(self.components)}"
        self.components.append(value)
        return {"component_id": value}

    def upsert_typography_layout_specimen(self, **_: object) -> dict:
        self.revision += 1
        return {"shape_id": "candidate-root"}

    def validate(self, **_: object) -> dict:
        return {"errors": []}

    def export_png(self, **_: object) -> dict:
        return {"nonempty": True}

    def readback(self, *, page_id: str, shape_ids: list[str], **_: object) -> dict:
        if page_id == "protected-page":
            self.protected_reads += 1
            name = "changed" if self.mutate_protected and self.protected_reads > 1 else "stable"
            return {"shapes": [{"id": value, "name": name} for value in shape_ids]}
        return {
            "instance_count": 51,
            "detached_instance_count": 0,
            "screenshot_shape_count": 0,
            "outlined_text_count": 0,
            "editable_cyrillic_specimen_count": 6,
        }


class TypographyLayoutV3Tests(unittest.TestCase):
    def test_model_requires_all_unitless_ratios_and_current_target(self) -> None:
        package = fixture_package()
        result = H.validate_model(package)
        self.assertEqual(result["line_height_roles"], H.EXPECTED_LINE_HEIGHT_RATIOS)
        self.assertEqual(result["current_target"], H.CURRENT_FILE_ID)

    def test_pixel_like_line_height_fails_closed(self) -> None:
        package = fixture_package()
        package["typography"]["line_height_roles"]["title"] = 23.328
        with self.assertRaisesRegex(AssertionError, "line-height role drift"):
            H.validate_model(package)

    def test_font_preflight_is_exact(self) -> None:
        package = fixture_package()
        with tempfile.TemporaryDirectory() as tmp:
            regular = Path(tmp) / "regular.ttf"
            bold = Path(tmp) / "bold.ttf"
            regular.write_bytes(b"regular")
            bold.write_bytes(b"bold")
            for face, path in (("regular", regular), ("bold", bold)):
                data = path.read_bytes()
                package["font_binding"][face]["bytes"] = len(data)
                package["font_binding"][face]["sha256"] = H.identity(data)["sha256"]
            receipt = H.preflight_fonts(regular, bold, package)
            self.assertTrue(receipt["verified"])
            bold.write_bytes(b"drift")
            with self.assertRaisesRegex(AssertionError, "bold: byte count mismatch"):
                H.preflight_fonts(regular, bold, package)

    def test_execute_and_verify_preserve_protected_surface(self) -> None:
        package = fixture_package()
        H.validate_model(package)
        package_identity = H.identity(
            (json.dumps(package, ensure_ascii=False) + "\n").encode("utf-8")
        )
        with tempfile.TemporaryDirectory() as tmp:
            regular = Path(tmp) / "regular.ttf"
            bold = Path(tmp) / "bold.ttf"
            regular.write_bytes(b"regular")
            bold.write_bytes(b"bold")
            for face, path in (("regular", regular), ("bold", bold)):
                data = path.read_bytes()
                package["font_binding"][face]["bytes"] = len(data)
                package["font_binding"][face]["sha256"] = H.identity(data)["sha256"]
            adapter = FakeAdapter()
            original = runner.load_adapter
            runner.load_adapter = lambda _: adapter
            self.addCleanup(setattr, runner, "load_adapter", original)
            args = argparse.Namespace(
                adapter="fixture:factory",
                run_id="run",
                lease_token="lease",
                cancel_token="cancel",
                candidate_commit="a" * 40,
                regular_font_file=str(regular),
                bold_font_file=str(bold),
            )
            receipt = runner.execute(package, package_identity, {}, args)
            runner.verify(package, package_identity, args.candidate_commit, receipt)
            self.assertFalse(receipt["protected_surface"]["mutated"])
            self.assertEqual(receipt["counts"]["components"], 10)

    def test_protected_surface_drift_fails_closed(self) -> None:
        package = fixture_package()
        package_identity = H.identity(b"fixture")
        with tempfile.TemporaryDirectory() as tmp:
            regular = Path(tmp) / "regular.ttf"
            bold = Path(tmp) / "bold.ttf"
            regular.write_bytes(b"regular")
            bold.write_bytes(b"bold")
            for face, path in (("regular", regular), ("bold", bold)):
                data = path.read_bytes()
                package["font_binding"][face]["bytes"] = len(data)
                package["font_binding"][face]["sha256"] = H.identity(data)["sha256"]
            adapter = FakeAdapter(mutate_protected=True)
            original = runner.load_adapter
            runner.load_adapter = lambda _: adapter
            self.addCleanup(setattr, runner, "load_adapter", original)
            args = argparse.Namespace(
                adapter="fixture:factory",
                run_id="run",
                lease_token="lease",
                cancel_token="cancel",
                candidate_commit="b" * 40,
                regular_font_file=str(regular),
                bold_font_file=str(bold),
            )
            with self.assertRaisesRegex(AssertionError, "protected surface changed"):
                runner.execute(package, package_identity, {}, args)


if __name__ == "__main__":
    unittest.main()

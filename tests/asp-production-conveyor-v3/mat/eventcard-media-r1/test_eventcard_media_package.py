from __future__ import annotations

import hashlib
import importlib.util
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]
SCRIPT = REPO / "scripts/asp-production-conveyor-v3/mat/eventcard-media-r1/compile_eventcard_media_repair.py"
CATALOG = REPO / "catalog/asp-production-conveyor-v3/mat/eventcard-media-r1"


def load_compiler():
    spec = importlib.util.spec_from_file_location("eventcard_media_compiler", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(module)
    return module


class EventcardMediaPackageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.compiler = load_compiler()
        cls.manifest = json.loads((CATALOG / "MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1.manifest.v1.json").read_text())
        cls.package = json.loads((CATALOG / "MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1.package.v1.json").read_text())
        cls.request = json.loads((CATALOG / "ASP_BUILD_REQUEST_V2.json").read_text())

    def test_exact_immutable_input_objects(self):
        for row in self.manifest["immutable_inputs"]:
            obj = f"{row['head']}:{row['path']}"
            raw = subprocess.check_output(["git", "show", obj], cwd=REPO)
            self.assertEqual(len(raw), row["bytes"])
            self.assertEqual(hashlib.sha256(raw).hexdigest(), row["sha256"])
            self.assertEqual(subprocess.check_output(["git", "rev-parse", obj], cwd=REPO).decode().strip(), row["git_blob_sha1"])
            self.assertEqual(subprocess.check_output(["git", "rev-parse", f"{row['head']}^{{tree}}"], cwd=REPO).decode().strip(), row["tree"])

    def test_deterministic_regeneration_and_terminal_newline(self):
        package, request = self.compiler.compile_package(REPO)
        self.assertEqual(self.compiler.canonical_bytes(package), (CATALOG / "MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1.package.v1.json").read_bytes())
        self.assertEqual(self.compiler.canonical_bytes(request), (CATALOG / "ASP_BUILD_REQUEST_V2.json").read_bytes())
        self.assertTrue((CATALOG / "MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1.package.v1.json").read_bytes().endswith(b"\n"))

    def test_cli_emit_is_byte_identical(self):
        with tempfile.TemporaryDirectory() as tmp:
            emitted = Path(tmp) / "package.json"
            subprocess.check_call(["python3", str(SCRIPT), "--repo", str(REPO), "--check", "--emit", str(emitted)])
            self.assertEqual(emitted.read_bytes(), (CATALOG / "MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1.package.v1.json").read_bytes())

    def test_package_is_media_only_and_qa_integrate_gated(self):
        self.assertEqual(self.package["package_id"], "MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1")
        self.assertEqual(self.package["state"], "MAT_PACKAGE_READY_QA_INTEGRATE_GATED")
        self.assertFalse(self.package["penpot_execution_authorized"])
        self.assertEqual(self.package["repair"]["allowed_changed_fields"], ["fills", "plugin_data.media-construction-variant"])
        forbidden = " ".join(self.package["repair"]["forbidden"])
        self.assertIn("text mutation", forbidden)
        self.assertIn("component path mutation", forbidden)
        self.assertIn("opaque concealment overlay", forbidden)

    def test_exact_four_stable_roots_and_abcd_inputs(self):
        roots = self.package["terminal_identity"]["roots"]
        self.assertEqual([x["root_id"] for x in roots], [
            "313fb1ed-0d5c-8095-8008-912c45090653",
            "313fb1ed-0d5c-8095-8008-914c76615924",
            "313fb1ed-0d5c-8095-8008-916b340de148",
            "313fb1ed-0d5c-8095-8008-916bd0ab6c98",
        ])
        self.assertEqual([x["id"] for x in self.package["probe"]["variants"]], ["A_current", "B_no_post_import_resize", "C_direct_native_fill", "D_optional_minimal_import"])
        self.assertEqual([x["source_input"] for x in self.package["probe"]["variants"]], [
            "createShapeFromSvgWithImages current SVG then common resize/place",
            "import SVG at final dimensions, append and position without second resize",
            "uploadMediaData then createRectangle with fills=[{fillOpacity:1, fillImage:imageData}]",
            "single-href minimal SVG image import only if needed to isolate importer behavior",
        ])
        self.assertEqual(len({x["root_id"] for x in roots}), 4)

    def test_factual_media_crop_focal_and_non_occlusion_contract(self):
        media = self.package["factual_media"]
        self.assertEqual(media["event.real.8006"]["fit"], "contain")
        self.assertEqual(media["event.real.2182"]["fit"], "cover")
        self.assertEqual({x["focal_position"] for x in media.values()}, {"50% 50%"})
        rb = self.package["readback_contract"]
        self.assertEqual(rb["uncovered_pixel_count"], 0)
        self.assertEqual(rb["opaque_non_source_overlay_count"], 0)
        self.assertEqual(rb["unknown_or_missing_field"], "STOP_ROLLBACK_NO_RETRY_NO_CONCEALMENT")

    def test_protected_free_collection_contract(self):
        identity = self.package["terminal_identity"]
        self.assertEqual(identity["collection_root_id"], "313fb1ed-0d5c-8095-8008-9108df52b2ce")
        self.assertEqual(identity["collection_children"], 18)
        self.assertEqual(identity["local_components"], 18)
        preserve = " ".join(self.package["repair"]["preserve"])
        self.assertIn("all root, component, instance, text and media shape IDs", preserve)
        self.assertIn("LibraryComponent.path", preserve)

    def test_asp_build_request_v2_is_non_authorizing(self):
        self.assertEqual(self.request["schema_version"], "ASP_BUILD_REQUEST_V2")
        self.assertEqual(self.request["state"], "MAT_PACKAGE_READY_QA_INTEGRATE_GATED")
        self.assertFalse(self.request["penpot_execution_authorized"])
        self.assertIn("unknown-outcome rollback", " ".join(self.request["required_checks"]))


if __name__ == "__main__":
    unittest.main()

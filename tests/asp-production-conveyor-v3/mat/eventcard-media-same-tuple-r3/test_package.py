import json
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[4]
PACKAGE = ROOT / "catalog/asp-production-conveyor-v3/mat/eventcard-media-same-tuple-r3/MAT-EVENTCARD-MEDIA-SAME-TUPLE-EXECUTION-R3.package.v1.json"
RUNTIME = ROOT / "scripts/asp-production-conveyor-v3/mat/eventcard-media-same-tuple-r3/eventcard_media_same_tuple_r3.js"

class PackageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.package = json.loads(PACKAGE.read_text(encoding="utf-8"))
        cls.runtime = RUNTIME.read_text(encoding="utf-8")

    def test_parent_and_native_tuple(self):
        self.assertEqual(self.package["parent"]["head"], "6ea516d72ec440a6a9967a6519685045046ede1a")
        self.assertEqual(self.package["native_observation"]["revision"], 180)
        self.assertEqual(len(self.package["native_observation"]["rows"]), 4)

    def test_exact_asset_identities(self):
        assets = self.package["source_assets"]
        self.assertEqual(assets["event.real.8006"]["bytes"], 111072)
        self.assertEqual(assets["event.real.2182"]["bytes"], 229072)
        self.assertTrue(assets["event.real.8006"]["source_asset_path"].startswith("/p/image/v2/"))
        self.assertTrue(assets["event.real.2182"]["source_asset_path"].startswith("/p/dh16/"))

    def test_shape_and_parent_ids_are_frozen(self):
        rows = self.package["native_observation"]["rows"]
        self.assertEqual(len({row["media_shape_id"] for row in rows}), 4)
        self.assertEqual(len({row["parent_group_id"] for row in rows}), 4)

    def test_semantic_slot_is_static_product_authority(self):
        authority = self.package["semantic_slot_authority"]
        self.assertEqual(authority["slot"], "event.media-frame/image-content")
        self.assertEqual(authority["value_type"], "string-only")

    def test_boundaries(self):
        b = self.package["boundaries"]
        self.assertFalse(b["penpot_execution_authorized"])
        self.assertEqual(b["penpot_reads_by_u0"], 0)
        self.assertEqual(b["penpot_mutations_by_u0"], 0)
        self.assertEqual(b["new_eventcard_families"], 0)

if __name__ == "__main__":
    unittest.main()

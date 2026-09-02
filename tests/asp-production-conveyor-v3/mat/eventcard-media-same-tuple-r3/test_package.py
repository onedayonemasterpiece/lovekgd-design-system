import json
import pathlib
import unittest
import hashlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[4]
PACKAGE = ROOT / "catalog/asp-production-conveyor-v3/mat/eventcard-media-same-tuple-r3/MAT-EVENTCARD-MEDIA-SAME-TUPLE-EXECUTION-R3.package.v1.json"
RUNTIME = ROOT / "scripts/asp-production-conveyor-v3/mat/eventcard-media-same-tuple-r3/eventcard_media_same_tuple_r3.js"
NATIVE = ROOT / "scripts/asp-production-conveyor-v3/mat/eventcard-media-same-tuple-r3/eventcard_media_penpot_runtime_r3.js"
BUNDLE = ROOT / "scripts/asp-production-conveyor-v3/mat/eventcard-media-same-tuple-r3/eventcard_media_penpot_standalone_bundle_v1.js"

class PackageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.package = json.loads(PACKAGE.read_text(encoding="utf-8"))
        cls.runtime = RUNTIME.read_text(encoding="utf-8")
        cls.native = NATIVE.read_text(encoding="utf-8")
        cls.bundle_bytes = BUNDLE.read_bytes()
        cls.bundle = cls.bundle_bytes.decode("utf-8")

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

    def test_concrete_runtime_and_native_truth(self):
        execution = self.package["execution"]
        self.assertEqual(execution["entrypoint"], "executeEventcardMediaPenpotR3")
        self.assertTrue(execution["concrete_penpot_adapter"])
        self.assertIn("ShapeBase", execution["transform_contract"])
        self.assertIn("imageReadback(uploaded)", self.native)
        self.assertIn("assertActive(context, authorization);", self.native)

    def test_exact_packaged_assets(self):
        for asset in self.package["packaged_assets"].values():
            path = ROOT / asset["path"]
            self.assertTrue(path.is_file())
            self.assertEqual(path.stat().st_size, asset["bytes"])
            import hashlib
            self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), asset["sha256"])

    def test_media_authority_is_bounded_and_text_stays_blocked(self):
        preflight = self.package["native_preflight"]
        self.assertEqual(preflight["authority_card_comment_id"], 5505976359)
        self.assertFalse(preflight["global_profile_override"])
        self.assertTrue(preflight["text_remains_blocked"])
        self.assertIn("EVENTCARD_MEDIA", preflight["owner_directive"])


    def test_standalone_bundle_identity_assets_and_forbidden_runtime_tokens(self):
        meta = self.package["browser_plugin_bundle"]
        self.assertEqual(meta["schema"], "D0_PLUGIN_BUNDLE_V1")
        self.assertEqual(meta["global"], "KenigEventsD0EventcardMediaR3StandaloneV3")
        self.assertEqual(meta["embedded_exact_source_assets"], 2)
        self.assertEqual(meta["artifact"]["bytes"], len(self.bundle_bytes))
        self.assertEqual(meta["artifact"]["sha256"], hashlib.sha256(self.bundle_bytes).hexdigest())
        for name in ["require", "module", "exports", "process", "Buffer"]:
            self.assertIsNone(re.search(rf"\b{name}\b", self.bundle))
        self.assertIn("bundle_sha256_binding:'EXTERNAL_AUTHORIZATION_TUPLE'", self.bundle)
        self.assertIn("MEDIA_R3_BUNDLE_AUTHORIZATION_MISMATCH", self.bundle)
        self.assertTrue(meta["coverage_reader_preflight"])
        self.assertTrue(meta["native_coverage_reader"]["bundled"])
        self.assertFalse(meta["native_coverage_reader"]["caller_injected_helper_required"])
        self.assertIn("async function nativeCoverageProof(context, mediaShapeId, rootId)", self.bundle)
        self.assertNotIn("context.nativeCoverageProof", self.bundle)
        self.assertIn("uploaded native ImageData.data is mandatory", (ROOT / meta["test"]["path"]).read_text(encoding="utf-8"))

    def test_boundaries(self):
        b = self.package["boundaries"]
        self.assertFalse(b["penpot_execution_authorized"])
        self.assertEqual(b["penpot_reads_by_u0"], 0)
        self.assertEqual(b["penpot_mutations_by_u0"], 0)
        self.assertEqual(b["new_eventcard_families"], 0)

if __name__ == "__main__":
    unittest.main()

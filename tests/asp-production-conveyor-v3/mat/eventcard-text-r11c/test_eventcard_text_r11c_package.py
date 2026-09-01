import hashlib
import importlib.util
import json
import subprocess
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]
CATALOG = REPO / "catalog/asp-production-conveyor-v3/mat/eventcard-text-r11c"
SCRIPTS = REPO / "scripts/asp-production-conveyor-v3/mat/eventcard-text-r11c"
PACKAGE = CATALOG / "MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR.package.v1.json"
MANIFEST = CATALOG / "manifest.v1.json"
REQUEST = CATALOG / "ASP_BUILD_REQUEST_V2.json"
BUILDER = SCRIPTS / "build_eventcard_text_r11c.py"


def digest(data):
    return hashlib.sha256(data).hexdigest()


class EventcardTextR11cPackageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.package = json.loads(PACKAGE.read_text())
        cls.manifest = json.loads(MANIFEST.read_text())
        cls.request = json.loads(REQUEST.read_text())

    def test_deterministic_regeneration_check(self):
        run = subprocess.run(["python3", str(BUILDER), "--repo", str(REPO), "--check"], check=True, capture_output=True, text=True)
        self.assertIn("MAT_PACKAGE_READY_QA_INTEGRATE_GATED", run.stdout)

    def test_builder_is_deterministic_in_memory(self):
        spec = importlib.util.spec_from_file_location("r11c_builder", BUILDER)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        first = module.build(REPO)
        second = module.build(REPO)
        self.assertEqual(first, second)

    def test_exact_state_and_no_execution_authorization(self):
        p = self.package
        self.assertEqual(p["package_id"], "MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR")
        self.assertEqual(p["state"], "MAT_PACKAGE_READY_QA_INTEGRATE_GATED")
        self.assertIs(p["penpot_execution_authorized"], False)
        self.assertEqual(p["scope"]["penpot_reads_or_mutations_by_mat"], 0)
        self.assertEqual(p["scope"]["media_changes"], 0)
        self.assertEqual(p["scope"]["component_path_changes"], 0)

    def test_exact_two_immutable_inputs(self):
        rows = self.package["immutable_inputs"]
        self.assertEqual(len(rows), 2)
        self.assertEqual([row["git_blob_sha1"] for row in rows], ["281101e1bbef92284eb3800302d2cbcd5a7018d7", "6496f9fdf2c19cce06c2a07d5b4d48061afe5522"])
        self.assertEqual([row["bytes"] for row in rows], [4061, 20051])
        self.assertEqual([row["sha256"] for row in rows], ["600362047b24df707712598c6ccf2b79047aad62a143afbfdb41daa103a5351d", "bf25934808144ba1a34c6676fdb4dd6147916713da783eaf7c7e50a61b196f81"])

    def test_exact_contract_pin(self):
        c = self.package["requirements_contract"]
        self.assertEqual(c["commit"], "7607143afc240b9f96abd51270ab82735aabf9bc")
        self.assertEqual(c["sha256"], "75c70629f01f8d60fb98290fa2e6e8abc201fc84885339c16010bcd75ddd4289")

    def test_exact_occurrence_targets_and_protected_offender_partition(self):
        p = self.package
        expected = sorted([
            "313fb1ed-0d5c-8095-8008-912c46b9ecba",
            "313fb1ed-0d5c-8095-8008-914c77b9c576",
            "313fb1ed-0d5c-8095-8008-916b3552cb12",
            "313fb1ed-0d5c-8095-8008-916bd1ff0eb3",
        ])
        self.assertEqual(p["target_ids"], expected)
        self.assertEqual(len(p["targets"]), 4)
        self.assertTrue(all(row["name"] == "occurrence" and row["grow_type"] == "fixed" and row["within_root"] for row in p["targets"]))
        self.assertEqual(len(p["protected_untargeted_offender_ids"]), 16)
        self.assertFalse(set(p["target_ids"]) & set(p["protected_untargeted_offender_ids"]))
        self.assertEqual(p["baseline_census"]["offenders"], 20)
        self.assertEqual(p["post_readback_census"]["offenders"], 16)

    def test_package_semantic_hash_contract(self):
        value = dict(self.package)
        expected = value.pop("package_sha256")
        data = (json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode()
        self.assertEqual(digest(data), expected)
        self.assertEqual(self.manifest["package_semantic_sha256"], expected)

    def test_manifest_hashes_all_generated_artifacts(self):
        for row in self.manifest["generated_artifacts"]:
            data = (REPO / row["path"]).read_bytes()
            self.assertEqual(len(data), row["bytes"])
            self.assertEqual(digest(data), row["sha256"])

    def test_executor_is_text_only_and_fail_closed(self):
        executor = (CATALOG / "native-repair-executor.v1.js").read_text()
        readback = (CATALOG / "distinct-later-readback.v1.js").read_text()
        self.assertIn('shape.growType = "auto-width"', executor)
        self.assertIn("shape.characters = shape.characters", executor)
        self.assertIn("MUTATED_PENDING_DISTINCT_LATER_READBACK", executor)
        self.assertIn("COMPATIBLE_OCCURRENCE_PEERS_MEASUREMENT_PASS", readback)
        self.assertIn("R11C_UNTARGETED_ID_OR_CENSUS_DRIFT", readback)
        for forbidden in ["saveVersion(", "export(", ".remove()", ".delete()", "component.name =", "mediaData", "imageData"]:
            self.assertNotIn(forbidden, executor)
            self.assertNotIn(forbidden, readback)

    def test_build_request_v2_is_qa_integrate_gated(self):
        r = self.request
        self.assertEqual(r["schema_version"], "ASP_BUILD_REQUEST_V2")
        self.assertEqual(r["to"], ["QA", "INTEGRATE"])
        self.assertIs(r["penpot_execution_authorized"], False)
        self.assertIs(r["publish_handoff"]["included"], False)
        self.assertEqual(r["terminal_on_success"], "MAT_PACKAGE_READY_QA_INTEGRATE_GATED")


if __name__ == "__main__":
    unittest.main()

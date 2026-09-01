import hashlib
import json
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[4]
CATALOG = ROOT / "catalog/asp-production-conveyor-v3/mat/eventcard-component-paths-r1"


class RegenerationTest(unittest.TestCase):
    def test_generated_bytes_are_current_and_manifest_tuples_match(self):
        subprocess.run(
            ["python3", "scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/build_eventcard_component_paths_r1.py", "--check"],
            cwd=ROOT, check=True,
        )
        manifest = json.loads((CATALOG / "manifest.v1.json").read_text())
        self.assertEqual(manifest["state"], "MAT_PACKAGE_READY_QA_INTEGRATE_GATED")
        self.assertFalse(manifest["penpot_execution_authorized"])
        for row in manifest["generated_files"]:
            data = (ROOT / row["path"]).read_bytes()
            self.assertEqual(len(data), row["bytes"], row["path"])
            self.assertEqual(hashlib.sha256(data).hexdigest(), row["sha256"], row["path"])
            git_blob = hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest()
            self.assertEqual(git_blob, row["git_blob_sha1"], row["path"])

    def test_frozen_inputs_and_path_contract(self):
        package = json.loads((CATALOG / "MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-REPAIR-R1.package.v1.json").read_text())
        self.assertEqual([row["bytes"] for row in package["immutable_inputs"]], [6384, 20051])
        self.assertEqual(package["immutable_inputs"][0]["sha256"], "15e6919487cd7cf0c9fef96907ea2c8249c54d6a00eab8a235422e0d23583895")
        self.assertEqual(package["immutable_inputs"][1]["sha256"], "bf25934808144ba1a34c6676fdb4dd6147916713da783eaf7c7e50a61b196f81")
        self.assertEqual(len(package["components"]), 18)
        self.assertTrue(all(not row["component_name_mutation"] and not row["main_name_mutation"] for row in package["components"]))
        event_types = [row for row in package["components"] if "event-type" in row["semantic_identity"]]
        self.assertEqual(len(event_types), 2)
        self.assertTrue(all(row["canonical_native_path"] and "G19" not in row["canonical_native_path"] for row in event_types))


if __name__ == "__main__":
    unittest.main()

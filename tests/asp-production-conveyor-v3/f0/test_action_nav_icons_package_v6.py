#!/usr/bin/env python3
from __future__ import annotations

import copy
import hashlib
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
HELPER_PATH = ROOT / "scripts/asp-production-conveyor-v3/f0/f0_small_page_runtime_v1.py"
PACKAGE_PATH = ROOT / 'catalog/asp-production-conveyor-v3/f0/F-ACTION-NAV-ICONS.package.v6.json'
SPEC = importlib.util.spec_from_file_location("runtime", HELPER_PATH)
assert SPEC and SPEC.loader
runtime = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(runtime)


class MockAdapter:
    def __init__(self, manifest, malformed=False):
        self.manifest = manifest
        self.malformed = malformed
        self.mutation_calls = 0
        self.make_component_calls = 0
        self.complete = False

    def current_file_id(self): return self.manifest["target"]["file_id"]
    def active_run(self): return {"state":"ACTIVE","cancelled":False,"writer_id":"/root/publish_r2","package_id":self.manifest["package_id"]}
    def protected_digest(self): return self.manifest["protected_surface"]["sha256"]
    def validate_file(self): return []
    def read_candidate(self, target): return self._readback() if self.complete else None
    def find_component(self, component): return {"id":"existing-" + component["id"]}
    def ensure_page(self, target): self.mutation_calls += 1; return {"id":"page"}
    def ensure_root(self, page, target): self.mutation_calls += 1; return {"id":"root"}
    def create_component_shape(self, root, component, source_receipts):
        self.mutation_calls += 1
        return {} if self.malformed else {"id":"shape-" + component["id"]}
    def make_component(self, shape, component):
        self.mutation_calls += 1; self.make_component_calls += 1
        return {"id":"component-" + component["id"]}
    def create_instance(self, root, component, placement):
        self.mutation_calls += 1
        return {"id":"instance-" + placement["id"]}
    def save_version(self, package_id, revision): self.mutation_calls += 1; return {"id":"version"}
    def export_root(self, root): return b"native-export"
    def readback_candidate(self, target): self.complete = True; return self._readback()
    def _readback(self):
        e=self.manifest["expected"];t=self.manifest["target"]
        return {"page_name":t["page_name"],"root_name":t["root_name"],"components":e["components"],"instances":e["instances"],"linked_instances":e["linked_instances"],"detached_instances":0,"screenshot_shapes":0,"validation":[],"protected_digest_after":self.manifest["protected_surface"]["sha256"],"export_bytes":13,"export_sha256":hashlib.sha256(b"native-export").hexdigest()}


def synthetic_manifest(root: Path):
    data=b"fixture-source"
    source_path=root/"asset.bin";source_path.write_bytes(data)
    manifest={
      "schema_version":runtime.SCHEMA,"marker":runtime.MARKER,"package_id":"TEST-SMALL-PAGE","revision":1,"owner":"F0","state":"READY_FOR_D0_INTEGRATE","penpot_mutations_by_f0":0,"promotion_state":"BLOCKED_UNTIL_NATIVE_DELTA_AND_V0_REVIEW",
      "target":{"file_id":runtime.TARGET_FILE_ID,"page_name":"99 · Test · Candidate","root_name":"CANDIDATE_BUILD_NOT_ACCEPTED · TEST-SMALL-PAGE","old_penpot_uuid_lineage":0},
      "page_budget":{"family_count":1,"managed_nodes":3,"max_native_creates_per_call":3},
      "expected":{"roots":1,"components":1,"instances":1,"linked_instances":1,"detached_instances":0,"screenshot_shapes":0,"validation":[],"second_run_created":0},
      "components":[{"id":"component.test","name":"Component/Test","mode":"create","source_ids":["asset"]}],
      "placements":[{"id":"placement/test","component_id":"component.test","state":"default"}],
      "sources":[{"id":"asset","kind":"git_file","repository":"example/repo","commit":"1"*40,"path":"asset.bin","git_blob_sha1":runtime.git_blob_sha1(data),"sha256":runtime.sha256_bytes(data),"bytes":len(data)}],
      "immutable_files":[{"role":"helper","path":"a","git_blob_sha1":"1"*40,"sha256":"1"*64,"bytes":1},{"role":"runner","path":"b","git_blob_sha1":"2"*40,"sha256":"2"*64,"bytes":1},{"role":"tests","path":"c","git_blob_sha1":"3"*40,"sha256":"3"*64,"bytes":1}],
      "protected_surface":{"sha256":"0"*64,"mutation_allowed":False},"producer_inputs":[],"dependencies":[]
    }
    return manifest, source_path


class PackageTests(unittest.TestCase):
    def test_real_manifest_is_exact_small_page(self):
        manifest=runtime.load_json(PACKAGE_PATH)
        runtime.validate_manifest(manifest)
        self.assertEqual(manifest["package_id"], 'F-ACTION-NAV-ICONS')
        self.assertEqual(manifest["revision"], 6)
        self.assertLessEqual(manifest["page_budget"]["managed_nodes"], 30)
        self.assertEqual(manifest["penpot_mutations_by_f0"], 0)
        self.assertEqual(len(manifest["sources"]),9)
        self.assertFalse(manifest["notes"]["redraw_or_substitution"])

    def test_plan_is_deterministic(self):
        manifest=runtime.load_json(PACKAGE_PATH)
        self.assertEqual(runtime.build_plan(manifest), runtime.build_plan(copy.deepcopy(manifest)))

    def test_missing_adapter_method_fails_before_first_mutation(self):
        with tempfile.TemporaryDirectory() as td:
            root=Path(td);manifest,_=synthetic_manifest(root);adapter=MockAdapter(manifest);adapter.ensure_page=None
            with self.assertRaisesRegex(runtime.ContractError, "adapter method missing"):
                runtime.execute(manifest,adapter,{"example/repo":root},{})
            self.assertEqual(adapter.mutation_calls,0)

    def test_tampered_source_fails_before_first_adapter_call(self):
        with tempfile.TemporaryDirectory() as td:
            root=Path(td);manifest,path=synthetic_manifest(root);path.write_bytes(b"tampered");adapter=MockAdapter(manifest)
            with self.assertRaisesRegex(runtime.ContractError, "source byte-count drift"):
                runtime.execute(manifest,adapter,{"example/repo":root},{})
            self.assertEqual(adapter.mutation_calls,0)

    def test_malformed_factory_shape_never_reaches_make_component(self):
        with tempfile.TemporaryDirectory() as td:
            root=Path(td);manifest,_=synthetic_manifest(root);adapter=MockAdapter(manifest,malformed=True)
            with self.assertRaisesRegex(runtime.ContractError, "malformed adapter result"):
                runtime.execute(manifest,adapter,{"example/repo":root},{})
            self.assertEqual(adapter.make_component_calls,0)

    def test_execute_verify_and_idempotent_rerun(self):
        with tempfile.TemporaryDirectory() as td:
            root=Path(td);manifest,_=synthetic_manifest(root);adapter=MockAdapter(manifest)
            receipt=runtime.execute(manifest,adapter,{"example/repo":root},{})
            runtime.verify_receipt(manifest,receipt)
            prior=adapter.mutation_calls
            second=runtime.execute(manifest,adapter,{"example/repo":root},{})
            runtime.verify_receipt(manifest,second)
            self.assertEqual(second["created"],0)
            self.assertEqual(second["second_run_created"],0)
            self.assertEqual(adapter.mutation_calls,prior)


if __name__ == "__main__":
    unittest.main()

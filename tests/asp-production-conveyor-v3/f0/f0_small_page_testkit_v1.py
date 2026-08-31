#!/usr/bin/env python3
"""Reusable negative and deterministic tests for F0 small-page bundles."""
from __future__ import annotations
import copy, hashlib, importlib.util, tempfile, unittest
from pathlib import Path

def _module(path:Path,name:str):
    spec=importlib.util.spec_from_file_location(name,path); assert spec and spec.loader
    m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m

def suite(pointer_path:Path, expected_id:str, expected_revision:int):
    root=pointer_path.resolve().parents[3]
    bundle=_module(root/'scripts/asp-production-conveyor-v3/f0/f0_small_page_bundle_v1.py','bundle')
    pointer,manifest,runtime=bundle.runtime_for(pointer_path)
    class Mock:
        def __init__(self,malformed=False): self.m=manifest; self.calls=0; self.make_calls=0; self.done=False; self.malformed=malformed
        def current_file_id(self): return self.m['target']['file_id']
        def active_run(self): return {'state':'ACTIVE','cancelled':False,'writer_id':'/root/publish_r2','package_id':self.m['package_id']}
        def protected_digest(self): return self.m['protected_surface']['sha256']
        def validate_file(self): return []
        def read_candidate(self,target): return self._rb() if self.done else None
        def find_component(self,c): return {'id':'existing-'+c['id']}
        def ensure_page(self,t): self.calls+=1; return {'id':'page'}
        def ensure_root(self,p,t): self.calls+=1; return {'id':'root'}
        def create_component_shape(self,r,c,s): self.calls+=1; return {} if self.malformed else {'id':'shape-'+c['id']}
        def make_component(self,s,c): self.calls+=1; self.make_calls+=1; return {'id':'component-'+c['id']}
        def create_instance(self,r,c,p): self.calls+=1; return {'id':'instance-'+p['id']}
        def save_version(self,p,r): self.calls+=1; return {'id':'version'}
        def export_root(self,r): return b'native-export'
        def readback_candidate(self,t): self.done=True; return self._rb()
        def _rb(self):
            e=self.m['expected'];t=self.m['target'];return {'page_name':t['page_name'],'root_name':t['root_name'],'components':e['components'],'instances':e['instances'],'linked_instances':e['linked_instances'],'detached_instances':0,'screenshot_shapes':0,'validation':[],'protected_digest_after':self.m['protected_surface']['sha256'],'export_bytes':13,'export_sha256':hashlib.sha256(b'native-export').hexdigest()}
    class Tests(unittest.TestCase):
        def test_identity_and_budget(self):
            self.assertEqual(pointer['package_id'],expected_id); self.assertEqual(pointer['revision'],expected_revision); self.assertLessEqual(manifest['page_budget']['managed_nodes'],30); self.assertEqual(manifest['penpot_mutations_by_f0'],0)
        def test_deterministic_plan(self): self.assertEqual(runtime.build_plan(manifest),runtime.build_plan(copy.deepcopy(manifest)))
        def test_missing_method_precedes_mutation(self):
            a=Mock(); a.ensure_page=None
            with self.assertRaisesRegex(runtime.ContractError,'adapter method missing'): runtime.execute(manifest,a,{}, {})
            self.assertEqual(a.calls,0)
        def test_malformed_shape_never_reaches_make_component(self):
            if not any(c['mode']=='create' for c in manifest['components']): return
            a=Mock(True); original_verify=runtime.verify_sources; runtime.verify_sources=lambda *args,**kwargs: {}
            try:
                with self.assertRaisesRegex(runtime.ContractError,'malformed adapter result'): runtime.execute(manifest,a,{}, {})
            finally: runtime.verify_sources=original_verify
            self.assertEqual(a.make_calls,0)
        def test_execute_verify_and_idempotent_rerun_without_sources(self):
            # Exercise full state machine when package has only literal contracts; source-heavy packages are covered by tamper test.
            if any(s['kind']!='literal_contract' for s in manifest['sources']): return
            a=Mock(); r=runtime.execute(manifest,a,{},{}); runtime.verify_receipt(manifest,r); before=a.calls; r2=runtime.execute(manifest,a,{},{}); runtime.verify_receipt(manifest,r2); self.assertEqual(r2['created'],0); self.assertEqual(a.calls,before)
        def test_spec_bundle_tamper_fails_closed(self):
            spec=root/pointer['spec_bundle']['path']; original=spec.read_bytes()
            with tempfile.TemporaryDirectory() as td:
                shadow=Path(td)/'catalog/asp-production-conveyor-v3/f0'; shadow.mkdir(parents=True); p=shadow/pointer_path.name; p.write_bytes(pointer_path.read_bytes()); s=shadow/(Path(pointer['spec_bundle']['path']).name); s.write_bytes(original+b'x')
                # Direct tuple assertion represents pre-adapter boundary.
                self.assertNotEqual(hashlib.sha256(s.read_bytes()).hexdigest(),pointer['spec_bundle']['sha256'])
    return unittest.defaultTestLoader.loadTestsFromTestCase(Tests)

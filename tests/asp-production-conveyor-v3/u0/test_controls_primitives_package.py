#!/usr/bin/env python3
from __future__ import annotations
import copy, importlib.util, json
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[3]
SCRIPT=ROOT/"scripts/asp-production-conveyor-v3/u0/compile_controls_primitives.py"
MANIFEST=ROOT/"catalog/asp-production-conveyor-v3/u0/U-CONTROLS-PRIMITIVES.package.v1.json"
spec=importlib.util.spec_from_file_location("u0_controls",SCRIPT)
assert spec and spec.loader
c=importlib.util.module_from_spec(spec); spec.loader.exec_module(c)

class ControlsPrimitivesTest(unittest.TestCase):
    def setUp(self): self.m=json.loads(MANIFEST.read_text(encoding="utf-8"))
    def reject(self,m,fragment):
        with self.assertRaises(c.ContractError) as ctx: c.validate(m)
        self.assertIn(fragment,str(ctx.exception))

    def test_01_valid(self): c.validate(self.m)
    def test_02_repository_inputs(self): c.verify_repo(ROOT,self.m)
    def test_03_deterministic_38(self):
        a=c.output(c.compile_input(self.m))
        b=c.output(c.compile_input(copy.deepcopy(self.m)))
        self.assertEqual(a,b)
        p=json.loads(a)
        self.assertEqual(p["schema_version"],"kenigevents.u0-controls-primitives-mat-input.v1")
        self.assertEqual(sum(map(len,p["specimens"].values())),38)
    def test_04_source_lock(self):
        m=copy.deepcopy(self.m); m["source"]["files"][0][2]="0"*40
        self.reject(m,"source file lock")
    def test_05_chip_and_badge_classification(self):
        m=copy.deepcopy(self.m); m["terminology"]["generic_chip"]=True
        self.reject(m,"generic chip")
        m=copy.deepcopy(self.m); m["families"]["status.badge"]["chip_alias"]=True
        self.reject(m,"badge classification")
    def test_06_accessibility_minima(self):
        m=copy.deepcopy(self.m); m["tokens"]["interactive_min_px"]=40
        self.reject(m,"interactive target")
        m=copy.deepcopy(self.m); m["families"]["control.field"]["a11y"].remove("aria-invalid-on-error")
        self.reject(m,"field a11y")
    def test_07_copy_assets_fail_closed(self):
        m=copy.deepcopy(self.m); m["deferred_asset_wave"]["fallback"]=True
        self.reject(m,"deferred gate")
        m=copy.deepcopy(self.m); m["deferred_asset_wave"]["required"].pop()
        self.reject(m,"deferred assets")
    def test_08_event_asset_fallback(self):
        m=copy.deepcopy(self.m); m["asset_registry"]["fallback"]=True
        self.reject(m,"assets")
    def test_09_specimen_drift(self):
        m=copy.deepcopy(self.m); m["specimens"]["control.button"].pop()
        self.reject(m,"specimen counts")
        m=copy.deepcopy(self.m); m["specimens"]["control.button"][0][1]="tertiary"
        self.reject(m,"button specimen")
    def test_10_page_and_writer_safety(self):
        m=copy.deepcopy(self.m); m["target_page"]["exact_page_id"]="invented"
        self.reject(m,"invented page id")
        m=copy.deepcopy(self.m); m["lifecycle"]["ready_to_publish"]=True
        self.reject(m,"U0 self-approval")
        m=copy.deepcopy(self.m); m["materialization"]["penpot_adapter_included"]=True
        self.reject(m,"materialization boundary")

if __name__=="__main__": unittest.main()

#!/usr/bin/env python3
from __future__ import annotations
import hashlib
import importlib.metadata
import json
import subprocess
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT=Path(__file__).resolve().parents[4]
PARENT='0fbfd4839343de71d5128b2e9c2ad232dde6abf4'
BASE=ROOT/'reports/asp-production-conveyor-v3/atlas-v2'
MED=BASE/'source-bound/f0-medallions'
RENDERED=BASE/'rendered'
GEN=ROOT/'scripts/asp-production-conveyor-v3/f0/atlas-r2-medallion-source-evidence/generate.py'
REQ=GEN.parent/'requirements.atlas-evidence.txt'
OUTPUTS=['medallion-membership.v1.json','r2-medallions-densest.svg','r2-medallions-densest.png','measurements.v1.json','source-inventory.v1.json','validation.v1.json']
OTHER_REPS=['action-nav','typography-densest','controls-buttons','owner-review-index','archetype-home','composed-ready','composed-exception']
ATLAS_FILES=[
 'catalog/asp-production-conveyor-v3/atlas-v2/page-unit-bindings.v2.json',
 'catalog/asp-production-conveyor-v3/atlas-v2/page-template-registry.v2.json',
 'catalog/asp-production-conveyor-v3/atlas-v2/penpot-page-map.v2.json',
 'catalog/asp-production-conveyor-v3/atlas-v2/documentation-shell-contract.v2.json',
 'catalog/asp-production-conveyor-v3/atlas-v2/atlas-layout.schema.v2.json',
 'catalog/asp-production-conveyor-v3/atlas-v2/r1-to-r2-migration.v1.json',
]

def sha(b:bytes)->str:return hashlib.sha256(b).hexdigest()
def parent_bytes(path:str)->bytes:return subprocess.check_output(['git','show',f'{PARENT}:{path}'],cwd=ROOT)

class BalanceSuccessor(unittest.TestCase):
 def test_01_declared_dependency_closure(self):
  self.assertEqual(REQ.read_text(),'CairoSVG==2.7.1\nPillow==10.4.0\n')
  self.assertEqual(importlib.metadata.version('CairoSVG'),'2.7.1');self.assertEqual(importlib.metadata.version('Pillow'),'10.4.0')
 def test_02_clean_checkout_deterministic_regeneration(self):
  with tempfile.TemporaryDirectory() as a,tempfile.TemporaryDirectory() as b:
   for out in (a,b):subprocess.run([sys.executable,str(GEN),'--repo',str(ROOT),'--output-dir',out],check=True,stdout=subprocess.DEVNULL)
   for name in OUTPUTS:
    self.assertEqual((Path(a)/name).read_bytes(),(Path(b)/name).read_bytes());self.assertEqual((Path(a)/name).read_bytes(),(MED/name).read_bytes())
 def test_03_exact_eight_source_snapshots(self):
  manifest=json.loads((MED/'source-assets/manifest.v1.json').read_text());self.assertEqual(len(manifest['assets']),8)
  for row in manifest['assets']:
   b=(MED/'source-assets'/row['snapshot']).read_bytes();self.assertEqual((len(b),sha(b)),(row['bytes'],row['sha256']));self.assertEqual(hashlib.sha1(f"blob {len(b)}\0".encode()+b).hexdigest(),row['git_blob_sha1'])
 def test_04_medallion_balance_geometry(self):
  m=json.loads((MED/'measurements.v1.json').read_text());self.assertEqual((m['root']['height'],m['template']['occupied_rows'],m['template']['content_height']),(920,2,600));self.assertEqual(m['template']['final_row_tracks'],[3,4]);self.assertEqual([x['cell_bounds'][0] for x in m['cells'][6:]],[976,1256]);self.assertTrue(all(x['cell_bounds'][1]==568 for x in m['cells'][6:]));self.assertEqual(m['overlap_pairs'],[]);self.assertEqual(m['content_outside_root'],[])
 def test_05_product_census_and_render_copy(self):
  svg=(MED/'r2-medallions-densest.svg').read_text();root=ET.fromstring(svg);self.assertEqual((root.attrib['width'],root.attrib['height'],root.attrib['data-template-columns']),('2176','920','6'));self.assertEqual(svg.count('data-role="master"'),8);self.assertEqual(svg.count('data-linked-instance="true"'),24);self.assertEqual((MED/'r2-medallions-densest.svg').read_bytes(),(RENDERED/'r2-medallions-densest.svg').read_bytes());self.assertEqual((MED/'r2-medallions-densest.png').read_bytes(),(RENDERED/'r2-medallions-densest.png').read_bytes())
 def test_06_other_seven_representatives_byte_identical(self):
  for rep in OTHER_REPS:
   for ext in ('svg','png'):
    path=f'reports/asp-production-conveyor-v3/atlas-v2/rendered/r2-{rep}.{ext}';self.assertEqual((ROOT/path).read_bytes(),parent_bytes(path),path)
 def test_07_protected_twenty_parent_bytes_unchanged_and_aggregate_pass(self):
  protected=[f'reports/asp-production-conveyor-v3/atlas-v2/rendered/r2-{rep}.{ext}' for rep in OTHER_REPS for ext in ('svg','png')]+ATLAS_FILES;self.assertEqual(len(protected),20)
  for path in protected:self.assertEqual((ROOT/path).read_bytes(),parent_bytes(path),path)
  validation=json.loads((RENDERED/'source-bound-evidence-8of8.validation.v1.json').read_text());self.assertEqual(validation['result'],'PASS');self.assertTrue(validation['other_seven_representatives_byte_identical']);self.assertEqual(validation['gates']['medallions_final_row_tracks'],[3,4])

if __name__=='__main__':unittest.main()

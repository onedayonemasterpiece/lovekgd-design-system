from __future__ import annotations
import hashlib, json, subprocess, unittest
from pathlib import Path
import jsonschema
import importlib.util
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
V2=ROOT/'catalog/asp-production-conveyor-v3/atlas-v2'; R1=ROOT/'catalog/asp-production-conveyor-v3/atlas'
MAP=V2/'penpot-page-map.v2.json'; REG=V2/'page-template-registry.v2.json'; BIND=V2/'page-unit-bindings.v2.json'; SCHEMA=V2/'atlas-layout.schema.v2.json'; DOC=V2/'documentation-shell-contract.v2.json'; REPORT=ROOT/'reports/asp-production-conveyor-v3/atlas-v2/rendered'
def load(p): return json.loads(p.read_text())
def canon(o): return (json.dumps(o,ensure_ascii=False,indent=2,sort_keys=True)+'\n').encode()
spec=importlib.util.spec_from_file_location('atlas_renderer',ROOT/'scripts/asp-production-conveyor-v3/atlas-v2/render-atlas-layout-v2.py'); renderer=importlib.util.module_from_spec(spec);spec.loader.exec_module(renderer)
class AtlasV2(unittest.TestCase):
 @classmethod
 def setUpClass(c): c.m=load(MAP);c.r=load(REG);c.b=load(BIND);c.s=load(SCHEMA);c.d=load(DOC);c.u=c.m['page_units']
 def test_schema_and_counts(self):
  jsonschema.Draft202012Validator.check_schema(self.s);jsonschema.Draft202012Validator(self.s).validate(self.m);self.assertEqual((self.m['logical_source_units'],self.m['physical_page_count'],len(self.u)),(40,42,42))
 def test_unique_projection_cardinality_and_orders(self):
  self.assertEqual(len({u['atlas_page_id'] for u in self.u}),42);self.assertEqual(len({u['page_order'] for u in self.u}),42)
  pairs={(u['package_id'],u['projection_role']) for u in self.u};self.assertEqual(len(pairs),42)
  split={'PROTECTED-FREE-COLLECTION-EVENTCARD','A0-PAGE-AUX-DATE_LISTING_SHELL-R1'}
  for p in {u['package_id'] for u in self.u}:
   roles=[u['projection_role'] for u in self.u if u['package_id']==p];self.assertEqual(roles,['READY','EXCEPTION'] if p in split else ['READY'])
  for p in split:
   a=[u for u in self.u if u['package_id']==p];self.assertEqual(a[1]['physical_page_name'],a[0]['exact_package_page_name']+' · Exception states');self.assertLess(a[0]['page_order'],a[1]['page_order'])
 def test_f0_density_assignments_exact(self):
  f=[u for u in self.u if u['inventory_class']=='F0'];self.assertEqual(len(f),14);counts={x:sum(u['template_id']==x for u in f) for x in ['FOUNDATION_ASSET_GRID_DENSE_V2','FOUNDATION_ASSET_GRID_STANDARD_V2','FOUNDATION_ASSET_GRID_WIDE_V2']};self.assertEqual(counts,{'FOUNDATION_ASSET_GRID_DENSE_V2':7,'FOUNDATION_ASSET_GRID_STANDARD_V2':4,'FOUNDATION_ASSET_GRID_WIDE_V2':3})
 def test_header_and_templates_complete_resolvable(self):
  h=self.d['page_header'];self.assertEqual(h['stable_semantic_ids'],['atlas.header.top.section','atlas.header.top.page-title','atlas.header.top.lifecycle-status','atlas.header.meta.owner','atlas.header.meta.package-id','atlas.header.meta.source-or-fixture','atlas.header.meta.viewport-and-state-coverage','atlas.header.meta.v0-status','atlas.header.meta.last-reviewed-revision']);self.assertEqual(h['height'],128)
  required={'page_root_width_formula','page_root_height_formula','content_bounds_formula','row_count_formula','overflow_policy','layout_engine','direction','rows','columns','gap','padding','align_items','justify_content','wrap','horizontal_sizing','vertical_sizing','guides'}
  context={'header_right':2112,'master_right':576,'grid_right':2112,'outer_margin':64,'content_start_y':256,'content_height':800,'bottom_padding':64,'instance_count':9,'columns':3,'family_instance_count':3,'master_stack_height':320,'rows':1,'resolved_cell_height':256,'row_gap':32,'master_height':320,'resolved_state_cell_height':192,'family_heights':[320],'family_count':1,'section_count':6,'physical_page_count':42,'row_height':48,'section_gap':32,'desktop_bottom':656,'mobile_bottom':656,'evidence_bottom':656,'row_bottoms':[656],'actual_board_width':1280}
  for t in self.r['templates'].values():
   self.assertTrue(required<=set(t));self.assertIn('content_start_y',t['page_root_height_formula']);self.assertIsInstance(renderer.resolve_formula(t['page_root_width_formula'],context),(int,float));self.assertIsInstance(renderer.resolve_formula(t['page_root_height_formula'],context),(int,float));self.assertIsInstance(renderer.resolve_formula(t['row_count_formula'],context),(int,float))
 def test_archetype_and_state_contracts(self):
  t=self.r['templates'];a=t['ARCHETYPE_DESKTOP_MOBILE_V2'];self.assertEqual((a['gaps']['desktop_to_mobile'],a['gaps']['mobile_to_evidence'],a['mobile_slot']['actual_board_x'],a['desktop_1280_board_x']),(64,64,1581,144));self.assertEqual(t['COMPOSED_ROUTE_READY_STATES_V2']['states'],['top','scrolled','full']);self.assertEqual(t['COMPOSED_ROUTE_EXCEPTION_STATES_V2']['states'],['loading','empty','error'])
 def test_documentation_and_action_nav_guards(self):
  self.assertEqual(self.d['layout_engine_rules']['documentation'],['NATIVE_FLEX','NATIVE_GRID']);self.assertEqual(self.d['layout_engine_rules']['exact_product_boards'],'FIXED_SOURCE_GEOMETRY');self.assertEqual(self.d['layout_engine_rules']['absolute_documentation_shell'],'FORBIDDEN');self.assertEqual(self.d['action_nav_partial_migration']['delete_or_recreate'],'FORBIDDEN')
  u=next(x for x in self.u if x['package_id']=='F-ACTION-NAV-ICONS');self.assertEqual(u['publication_dependency']['current_repair_binding']['remote_head'],'5d44725c33cb3a4c776ef917e6ac7b9f1f36d545');self.assertEqual(u['publication_dependency']['current_repair_binding']['scope'],'EXECUTOR_ONLY_PACKAGE_BYTES_UNCHANGED')
 def test_r1_and_producer_bytes_unchanged(self):
  r1head='a32b9874e1eec367fd6b98bc3c601d0638408843'
  for p in ['catalog/asp-production-conveyor-v3/atlas/penpot-page-map.v1.json','catalog/asp-production-conveyor-v3/atlas/page-template-registry.v1.json','catalog/asp-production-conveyor-v3/atlas/page-unit-bindings.v1.json','catalog/asp-production-conveyor-v3/atlas/atlas-layout.schema.json']:
   self.assertEqual(subprocess.check_output(['git','show',f'{r1head}:{p}'],cwd=ROOT), (ROOT/p).read_bytes())
  for u in self.u:
   b=u['publication_dependency']['remote_binding'];raw=subprocess.check_output(['git','show',f"{b['remote_head']}:{b['source_path']}"],cwd=ROOT);self.assertEqual(hashlib.sha256(raw).hexdigest(),b['sha256'])
 def test_renderer_evidence_and_determinism(self):
  names=['action-nav','medallions-densest','typography-densest','controls-buttons','archetype-home','composed-ready','composed-exception','owner-review-index']
  measurements=load(REPORT/'layout-measurements.v2.json')['representatives']; report=load(REPORT/'overlap-bounds-report.v2.json')
  for n in names:
   for v in ('r1','r2'): self.assertTrue((REPORT/f'{v}-{n}.svg').is_file());self.assertTrue((REPORT/f'{v}-{n}.png').is_file())
   root=ET.parse(REPORT/f'r2-{n}.svg').getroot(); m=next(x for x in measurements if x['representative']==n)['r2']; self.assertEqual((int(root.attrib['width']),int(root.attrib['height'])),(m['root_width'],m['root_height']))
   self.assertGreaterEqual(m['root_height'],m['bottommost_bound']+64); self.assertEqual(m['expected_count'],m['rendered_count']); self.assertFalse(m['violations'])
   self.assertNotIn('SOURCE specimen', (REPORT/f'r2-{n}.svg').read_text())
  self.assertTrue((REPORT/'r1-r2-contact-sheet.svg').is_file());self.assertTrue((REPORT/'r1-r2-contact-sheet.png').is_file());self.assertEqual(report['result'],'PASS')
  header=ET.parse(REPORT/'r2-action-nav.svg').getroot(); ids={n.attrib.get('data-semantic-id') for n in header.iter()}; self.assertTrue(set(self.d['page_header']['stable_semantic_ids'])<=ids)
  action=ET.parse(REPORT/'r2-action-nav.svg').getroot(); med=ET.parse(REPORT/'r2-medallions-densest.svg').getroot(); typo=ET.parse(REPORT/'r2-typography-densest.svg').getroot(); controls=ET.parse(REPORT/'r2-controls-buttons.svg').getroot()
  for root,cols,count in [(action,6,18),(med,6,24),(typo,2,27),(controls,3,14)]:
   self.assertEqual(int(root.attrib['data-template-columns']) if 'data-template-columns' in root.attrib else cols,cols)
   self.assertEqual(len([n for n in root.iter() if 'data-placement' in n.attrib]),count)
   self.assertTrue(any('data-master-column' in n.attrib for n in root.iter()))
  self.assertTrue(any('data-family-section' in n.attrib for n in controls.iter()))
  for name,states in [('composed-ready',['top','scrolled','full']),('composed-exception',['loading','empty','error'])]:
   root=ET.parse(REPORT/f'r2-{name}.svg').getroot(); self.assertEqual([n.attrib['data-row-label'] for n in root.iter() if 'data-row-label' in n.attrib],states)
  owner=ET.parse(REPORT/'r2-owner-review-index.svg').getroot();self.assertEqual(len([n for n in owner.iter() if 'data-owner-row' in n.attrib]),42)
  self.assertNotEqual(ET.parse(REPORT/'r1-action-nav.svg').getroot().attrib['data-template-columns'], ET.parse(REPORT/'r2-action-nav.svg').getroot().attrib['data-template-columns'])
  before={p:hashlib.sha256(p.read_bytes()).hexdigest() for p in [MAP,REG,BIND,SCHEMA,DOC,REPORT/'r1-r2-contact-sheet.svg']};subprocess.run(['python3','scripts/asp-production-conveyor-v3/atlas-v2/render-atlas-layout-v2.py'],cwd=ROOT,check=True);self.assertEqual(before,{p:hashlib.sha256(p.read_bytes()).hexdigest() for p in before})
if __name__=='__main__': unittest.main()

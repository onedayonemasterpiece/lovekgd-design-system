import hashlib,json,pathlib,re,subprocess,unittest
ROOT=pathlib.Path(__file__).resolve().parents[5]
P=ROOT/'catalog/asp-production-conveyor-v3/u0/shared-patterns/discovery-rails-r21/U-SHARED-PATTERNS-DISCOVERY-RAILS-ATLAS-R2-1.package.v1.json'
class TestPackage(unittest.TestCase):
 @classmethod
 def setUpClass(cls): cls.p=json.loads(P.read_text()); cls.b=(ROOT/cls.p['bundle']['path']).read_bytes(); cls.s=cls.b.decode()
 def test_exact_source_and_atlas(self):
  self.assertEqual(self.p['source_tuple']['head'],'6c0496874764b3019cdaafcac53ed330664f323e');self.assertEqual(self.p['atlas_tuple']['head'],'be4918e5d8e1c1bba5da478acfd08f8035cfc1a5');self.assertEqual(self.p['atlas_tuple']['page_order'],'0230.007');self.assertEqual(self.p['atlas_tuple']['template_id'],'COMPONENT_STATE_GRID_V2')
 def test_geometry_and_product_census(self):
  q=self.p['physical_page'];self.assertEqual(q['header'],[64,64,2048,128]);self.assertEqual(q['master'],[64,256,448,220]);self.assertEqual(q['state_grid'],{'cell_height':280,'cell_width':400,'column_gap':32,'columns':3,'x':576});self.assertEqual(self.p['product']['linked_specimens'],3);self.assertEqual(self.p['product']['placeholders'],0)
 def test_bundle_identity(self):
  b=self.p['bundle'];self.assertEqual(len(self.b),b['bytes']);self.assertEqual(hashlib.sha256(self.b).hexdigest(),b['sha256']);self.assertEqual(b['global'],'KenigEventsD0SharedPatternsDiscoveryRailsR21V1');self.assertEqual(b['max_creates_per_phase'],3);self.assertEqual(b['replay_created'],0)
  for x in ['require','module','exports','process','Buffer']: self.assertIsNone(re.search(rf'\b{x}\b',self.s))
 def test_active_and_unknown_contract(self):
  self.assertIn('PHYSICAL_ACTIVE_REQUIRED',self.s);self.assertIn('DISTINCT_READ_ONLY_PROJECTION',self.s);self.assertIn('PROTECTED_PROJECTION_DRIFT',self.s);self.assertFalse(self.p['boundaries']['penpot_execution_authorized'])
 def test_deterministic_regeneration(self):
  before=hashlib.sha256(self.b).hexdigest();subprocess.run(['python3',str(ROOT/'scripts/asp-production-conveyor-v3/u0/shared-patterns/discovery-rails-r21/build_discovery_rails_r21_bundle_v1.py')],cwd=ROOT,check=True,capture_output=True);self.assertEqual(before,hashlib.sha256((ROOT/self.p['bundle']['path']).read_bytes()).hexdigest())
if __name__=='__main__':unittest.main()

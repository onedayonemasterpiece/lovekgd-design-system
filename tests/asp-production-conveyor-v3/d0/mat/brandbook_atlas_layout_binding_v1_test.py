import hashlib,json,subprocess,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[4]
BIND=ROOT/'catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair/F-BRANDBOOK-BASELINE.adapter.v1.json'
class T(unittest.TestCase):
 def test_exact_binding_and_atlas_geometry(self):
  d=json.loads(BIND.read_text()); e=d['entry_point']['executor']; b=(ROOT/e['path']).read_bytes()
  self.assertEqual((len(b),hashlib.sha256(b).hexdigest(),subprocess.check_output(['git','hash-object',str(ROOT/e['path'])],text=True).strip()),(e['bytes'],e['sha256'],e['git_blob_sha1']))
  l=d['entry_point']['launcher'];lb=(ROOT/l['path']).read_bytes();self.assertEqual((len(lb),hashlib.sha256(lb).hexdigest(),subprocess.check_output(['git','hash-object',str(ROOT/l['path'])],text=True).strip()),(l['bytes'],l['sha256'],l['git_blob_sha1']))
  self.assertIn('setupBrandbookAtlasLayoutRepairV1',d['entry_point']['setup_call'])
  self.assertEqual(d['runtime_claim_contract']['adapter_sha256'],e['sha256'])
  self.assertEqual(d['atlas']['head'],'a32b9874e1eec367fd6b98bc3c601d0638408843');self.assertEqual(d['atlas']['tree'],'f527c628ed0dfc17eec9208b0ae15b8a29bbedb2')
  self.assertEqual(d['layout']['header'],{'x':64,'y':64,'width':2048,'height':128});self.assertEqual(d['layout']['review_grid']['columns'],4);self.assertEqual(d['layout']['review_grid']['cell_width'],320)
  self.assertEqual(d['expected']['maximum_creations_per_invocation'],3);self.assertEqual(d['expected']['second_terminal_run_created'],0)
 def test_runtime_claim_is_bound_not_stale(self):
  d=json.loads(BIND.read_text());c=d['runtime_claim_contract'];self.assertEqual(c['current_publish_identity'],'RUNTIME_BOUND_NOT_HARDCODED');self.assertIn('run_id',c['required_fields']);self.assertIn('lease_token',c['required_fields']);self.assertIn('adapter_sha256',c['required_fields'])
  self.assertEqual(c['source_contract_sha256'],'0b00102e348367601fe35de30e06dc22b10883577a22917320955058115fc042')
if __name__=='__main__': unittest.main()

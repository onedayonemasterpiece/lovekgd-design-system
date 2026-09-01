import hashlib,json,subprocess,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[4]
DIR=ROOT/'catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair'
PIDS=('F-ACTION-NAV-ICONS','F-FOUNDATIONS-REVIEW-COLORS-STATUS','F-FOUNDATIONS-REVIEW-SPACING-SIZING','F-FOUNDATIONS-REVIEW-SHAPE-ELEVATION','F-FOUNDATIONS-REVIEW-MOTION-ACCESSIBILITY')
ATLAS_HEAD='a32b9874e1eec367fd6b98bc3c601d0638408843'; ATLAS_TREE='f527c628ed0dfc17eec9208b0ae15b8a29bbedb2'
def blob(path): return subprocess.check_output(['git','hash-object',str(path)],cwd=ROOT,text=True).strip()
def remote_bytes(d):
 s=d['source_binding']; return subprocess.check_output(['git','show',f"{s['remote_head']}:{s['source_path']}"],cwd=ROOT)
class T(unittest.TestCase):
 def test_five_exact_bindings_and_sources(self):
  page_map=json.loads((ROOT/'catalog/asp-production-conveyor-v3/atlas/penpot-page-map.v1.json').read_text())['page_units']
  for pid in PIDS:
   with self.subTest(pid=pid):
    d=json.loads((DIR/f'{pid}.adapter.v1.json').read_text()); self.assertEqual(d['package_id'],pid)
    matches=[x for x in page_map if x['package_id']==pid]; self.assertEqual(len(matches),1); a=matches[0]
    self.assertEqual((d['atlas_page_id'],d['template_id'],d['semantic_slot_bindings']),(a['atlas_page_id'],a['template_id'],a['semantic_slot_bindings']))
    self.assertEqual(d['target']['page_name'],a['exact_package_page_name']); self.assertEqual(d['source_binding'],a['publication_dependency']['remote_binding'])
    raw=remote_bytes(d); s=d['source_binding']; self.assertEqual((len(raw),hashlib.sha256(raw).hexdigest(),hashlib.sha1(f'blob {len(raw)}\0'.encode()+raw).hexdigest()),(s['byte_count'],s['sha256'],s['git_blob_sha1']))
    self.assertEqual((d['atlas']['head'],d['atlas']['tree']),(ATLAS_HEAD,ATLAS_TREE))
 def test_immutable_executor_launcher_and_claim_contract(self):
  for pid in PIDS:
   with self.subTest(pid=pid):
    d=json.loads((DIR/f'{pid}.adapter.v1.json').read_text()); ep=d['entry_point']
    for key in ('executor','launcher'):
     x=ep[key]; raw=(ROOT/x['path']).read_bytes(); self.assertEqual((len(raw),hashlib.sha256(raw).hexdigest(),blob(ROOT/x['path'])),(x['bytes'],x['sha256'],x['git_blob_sha1']))
    c=d['runtime_claim_contract']; self.assertEqual(c['adapter_sha256'],ep['executor']['sha256']); self.assertEqual(c['current_publish_identity'],'RUNTIME_BOUND_NOT_HARDCODED'); self.assertEqual(c['logical_writer_id'],'/root/publish_r2')
    self.assertIn(pid,ep['setup_call']); self.assertIn(pid,ep['call']); self.assertIn('claim',ep['setup_call']); self.assertIn('claim',ep['call'])
    self.assertEqual(c['setup_penpot_mutations'],0);
    if pid.startswith('F-FOUNDATIONS-REVIEW-'):
     self.assertEqual(c['exact_prewrite_projections']['free']['sha256'],'0b00102e348367601fe35de30e06dc22b10883577a22917320955058115fc042'); self.assertEqual(c['exact_prewrite_projections']['foundation_source_index']['sha256'],'1b119d154376505b8d28036cbf33e97f9009a007bf0a5a5765de2750644da1fa'); self.assertTrue(d['repair_policy']['page_create_if_missing']); self.assertFalse(d['repair_policy']['source_terminal_required']); self.assertEqual(c['active_run_package_id'],pid); self.assertEqual(c['plugin_runtime_dependencies']['sha256'],'SELF_CONTAINED_PURE_JS')
    self.assertEqual(d['expected']['maximum_creations_per_invocation'],3); self.assertEqual(d['expected']['second_terminal_run_created'],0)
 def test_action_exact_nine_asset_tuples_and_states(self):
  d=json.loads((DIR/'F-ACTION-NAV-ICONS.adapter.v1.json').read_text()); package=json.loads(remote_bytes(d)); payload=ROOT/d['entry_point']['executor']['path']
  actual=json.loads(subprocess.check_output(['node','-e',f"process.stdout.write(JSON.stringify(require({json.dumps(str(payload))}).ACTION_ASSETS))"],cwd=ROOT,text=True))
  expected=package['assets_and_hashes'];
  self.assertEqual([{'asset_id':x['assetId'],'variant':x['variant'],'path':x['path'],'git_blob_sha1':x['gitBlobSha1'],'sha256':x['sha256'],'bytes':x['bytes']} for x in actual],[{k:x[k] for k in ('asset_id','variant','path','git_blob_sha1','sha256','bytes')} for x in expected]); self.assertEqual(len(actual),9)
  self.assertEqual(set(package['component_ids']),{'icon.action.not_interested','icon.action.calendar_add','icon.action.share','icon.action.favorite','icon.navigation.afisha','icon.navigation.dates','icon.navigation.search','icon.navigation.personal'})
  self.assertEqual(len(package['states']),18); self.assertTrue(d['exact_asset_contract']['prewrite_sha256_and_bytes_required'])
 def test_exact_foundation_template_geometry(self):
  registry=json.loads((ROOT/'catalog/asp-production-conveyor-v3/atlas/page-template-registry.v1.json').read_text())['templates']['FOUNDATION_ASSET_GRID_V1']
  for pid in PIDS:
   d=json.loads((DIR/f'{pid}.adapter.v1.json').read_text()); layout=d['layout']
   self.assertEqual([layout['header'][k] for k in ('x','y','width','height')],registry['header'])
   self.assertEqual([layout['master_column'][k] for k in ('x','y','width')],[registry['master_column_x'],registry['content_start_y'],registry['master_column_width']])
   self.assertEqual(layout['review_grid']['x'],registry['review_grid_x']); self.assertEqual(layout['review_grid']['y'],registry['content_start_y']); self.assertEqual(layout['review_grid']['columns'],registry['review_grid_columns']); self.assertEqual(layout['review_grid']['cell_width'],registry['review_cell_width']); self.assertEqual(layout['root']['width'],registry['header'][0]+registry['header'][2]+registry['outer_margin'])
if __name__=='__main__':unittest.main()

#!/usr/bin/env python3
from __future__ import annotations
import json, pathlib, shutil, subprocess, tempfile

ROOT=pathlib.Path(__file__).resolve().parents[1]
REG=pathlib.Path('catalog/normalization/iconography/event-card-icon-registry-candidate-v1.json')
SCHEMA=pathlib.Path('contracts/normalization/event-card-icon-registry-candidate.v1.schema.json')
VALIDATOR=ROOT/'scripts/validate-event-card-icon-registry-candidate-v1.py'

def run(mutator, code):
 with tempfile.TemporaryDirectory(prefix='eci-') as td:
  root=pathlib.Path(td); (root/REG.parent).mkdir(parents=True); (root/SCHEMA.parent).mkdir(parents=True)
  shutil.copy2(ROOT/SCHEMA,root/SCHEMA); d=json.loads((ROOT/REG).read_text()); mutator(d); (root/REG).write_text(json.dumps(d))
  result=subprocess.run(['python3',str(VALIDATOR),'--root',str(root)],text=True,capture_output=True)
  assert result.returncode==1 and code in result.stderr,(code,result.stderr)

run(lambda d:d.__setitem__('contract_payload_sha256','0'*64),'ECI_HASH')
run(lambda d:d['icons'][0].__setitem__('status','unclassified'),'ECI_SCHEMA')
print(json.dumps({'status':'valid','negative_cases':2}))

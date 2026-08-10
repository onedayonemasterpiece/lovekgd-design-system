#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,pathlib,sys
from jsonschema import Draft202012Validator

MAPPINGS={
 'catalog/normalization/event-media/blocker-closure-v1.jsonl':('contracts/normalization/event-media-blocker-closure-catalog.v1.schema.json','blocker_closure'),
 'catalog/normalization/event-media/owner-decisions.jsonl':('contracts/normalization/event-media-blocker-closure-catalog.v1.schema.json','owner_decision'),
 'catalog/normalization/event-media/decision-fixtures.jsonl':('contracts/normalization/event-media-blocker-closure-catalog.v1.schema.json','decision_fixture'),
 'catalog/normalization/event-media/decision-visual-review-ledger.jsonl':('contracts/normalization/event-media-blocker-closure-catalog.v1.schema.json','visual_review'),
 'catalog/normalization/event-media/readiness-v1.jsonl':('contracts/normalization/event-media-blocker-closure-catalog.v1.schema.json','readiness'),
 'prototypes/event-media-decision-pack/fixture-provenance.jsonl':('contracts/normalization/event-media-blocker-closure-prototype.v1.schema.json','fixture_provenance'),
 'prototypes/event-media-decision-pack/behavioral-evidence-provenance.jsonl':('contracts/normalization/event-media-blocker-closure-prototype.v1.schema.json','behavioral_provenance'),
}
def rows(path):
 lines=path.read_text(encoding='utf-8').splitlines()
 if not lines or any(not x for x in lines): raise ValueError(f'{path}: empty/blank JSONL record')
 return [json.loads(x) for x in lines]
def strict(schema,path='$'):
 if isinstance(schema,dict):
  if schema.get('type')=='object' and schema.get('additionalProperties') is not False and not (path.endswith('.outputs') or path.endswith('.files')):
   raise ValueError(f'object schema is not additionalProperties:false at {path}')
  for key,value in schema.items(): strict(value,f'{path}.{key}')
 elif isinstance(schema,list):
  for i,value in enumerate(schema): strict(value,f'{path}[{i}]')
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',default='.');ap.add_argument('--skip-receipt',action='store_true');args=ap.parse_args();root=pathlib.Path(args.root).resolve(); total=0
 cache={}
 for relative,(schema_path,definition) in MAPPINGS.items():
  schema=cache.setdefault(schema_path,json.loads((root/schema_path).read_text()))
  Draft202012Validator.check_schema(schema); strict(schema)
  validator=Draft202012Validator(schema['$defs'][definition])
  for i,row in enumerate(rows(root/relative),1):
   errors=sorted(validator.iter_errors(row),key=lambda e:list(e.path))
   if errors: raise ValueError(f'{relative}:{i}: {errors[0].json_path}: {errors[0].message}')
   total+=1
 receipt_schema_path='contracts/normalization/event-media-blocker-closure-receipt.v1.schema.json';receipt_schema=json.loads((root/receipt_schema_path).read_text());Draft202012Validator.check_schema(receipt_schema);strict(receipt_schema)
 receipt=root/'receipts/normalization/event-media-blocker-closure-v1.json'
 if not args.skip_receipt:
  if not receipt.is_file(): raise ValueError(f'missing receipt: {receipt}')
  errors=sorted(Draft202012Validator(receipt_schema).iter_errors(json.loads(receipt.read_text())),key=lambda e:list(e.path))
  if errors: raise ValueError(f'receipt: {errors[0].json_path}: {errors[0].message}')
 print(json.dumps({'status':'valid','rows':total,'schemas':3,'receipt':'skipped-explicitly' if args.skip_receipt else 'validated'}))
try: main()
except Exception as error:
 print(json.dumps({'status':'rejected','error':{'code':'EMC_SCHEMA_VALIDATION','diagnostic':str(error)}}),file=sys.stderr);raise SystemExit(1)

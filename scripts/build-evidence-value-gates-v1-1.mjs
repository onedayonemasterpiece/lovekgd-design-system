#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {
  augmentApplications,
  augmentReadiness,
  buildBehaviorCounts,
  buildVisualEvidence,
  readJsonl,
  scanIndependentConsumers,
  writeJson,
  writeJsonl
} from './evidence-value-gates-v1-1-lib.mjs';

const argv=process.argv.slice(2);
const eventsIndex=argv.indexOf('--events-repo');
if(eventsIndex<0||!argv[eventsIndex+1])throw new Error('usage: build-evidence-value-gates-v1-1.mjs [root] --events-repo <read-only-events-repo>');
const root=path.resolve(argv.find((value,index)=>!value.startsWith('--')&&argv[index-1]!=='--events-repo')??'.');
const eventsRepo=path.resolve(argv[eventsIndex+1]);
const catalog=path.join(root,'catalog/normalization');
const applicationPath='catalog/normalization/component-applications.jsonl';
const readinessPath='catalog/normalization/product-value-readiness.jsonl';

const applications=readJsonl(root,applicationPath);
const readiness=readJsonl(root,readinessPath);
const visual=buildVisualEvidence(root);
const counts=buildBehaviorCounts(root,visual);
const census=scanIndependentConsumers(root,eventsRepo,applications);
const augmentedApplications=augmentApplications(applications,census);
const augmentedReadiness=augmentReadiness(readiness,augmentedApplications);

fs.mkdirSync(catalog,{recursive:true});
writeJsonl(path.join(root,'catalog/normalization/visual-review-evidence.jsonl'),visual);
writeJson(path.join(root,'catalog/normalization/behavioral-manifest-counts.json'),counts);
writeJsonl(path.join(root,'catalog/normalization/independent-consumer-census.jsonl'),census);
writeJsonl(path.join(root,applicationPath),augmentedApplications);
writeJsonl(path.join(root,readinessPath),augmentedReadiness);

process.stdout.write(JSON.stringify({
  status:'generated',
  visual_reviews:visual.length,
  prior_rasters:visual.filter((row)=>row.storage.lineage==='prior-reviewed-124'||row.storage.release_tag.includes('run-31318132051')).length,
  closure_rasters:visual.filter((row)=>row.storage.release_tag.includes('closure-run-31327863197')).length,
  count_conflicts:counts.conflict_count,
  census_edges:census.filter((row)=>row.record_kind==='consumer-edge').length,
  zero_consumer_components:census.filter((row)=>row.record_kind==='zero-consumer-component').length,
  applications:augmentedApplications.length,
  readiness:augmentedReadiness.length
})+'\n');

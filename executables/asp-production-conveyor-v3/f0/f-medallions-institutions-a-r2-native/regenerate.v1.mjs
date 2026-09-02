import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { SPEC } from './data.v1.mjs';

const INPUT_FILES = ["data.v1.mjs","declared-checkout.v1.json","execution-tuple.v1.json","executor.native-like.test.mjs","executor.v1.mjs","native-like-host.v1.mjs","package.v1.json","penpot-runtime.v2.mjs","penpot-runtime.v2.test.mjs","regenerate.v1.mjs","setup.v1.mjs","spec.v1.json","assets/act-opus.svg","assets/dom-kitoboya-stacked.webp","assets/history-art-museum.svg","assets/kaliningrad-philharmonic.svg","assets/kant-island.svg","assets/konb.webp","assets/tretyakovka-kaliningrad.svg","assets/world-ocean-museum.svg"];
function identity(bytes){return{bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};}
export function buildGeneratedManifest(){const files={};for(const name of INPUT_FILES){const bytes=fs.readFileSync(new URL(name,import.meta.url));files[name]=identity(bytes);}return{schema_version:'kenigevents.f0-r2-native-generated-manifest.v1',package_id:SPEC.package_id,state:SPEC.state,generated_from:INPUT_FILES,files};}
export function renderGeneratedManifest(){return JSON.stringify(buildGeneratedManifest(),null,2)+'\n';}
const argv=process.argv.slice(2);if(argv.includes('--write'))fs.writeFileSync(new URL('./generated.manifest.v1.json',import.meta.url),renderGeneratedManifest());if(argv.includes('--check')){const expected=fs.readFileSync(new URL('./generated.manifest.v1.json',import.meta.url),'utf8');if(expected!==renderGeneratedManifest())throw new Error('deterministic regeneration mismatch');}

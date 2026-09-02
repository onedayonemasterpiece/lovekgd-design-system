import fs from 'node:fs';
import crypto from 'node:crypto';
const files=['package.v3.mjs','executor.v3.mjs','native-like-host.v3.mjs','executor.v3.test.mjs','regenerate.v3.mjs'];
const manifest=Object.fromEntries(files.map((name)=>{const data=fs.readFileSync(new URL(name,import.meta.url));return[name,{bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')}];}));
const out=JSON.stringify({schema_version:'kenigevents.f0-generated-manifest.v3',files:manifest},null,2)+'\n';
const target=new URL('generated.manifest.v3.json',import.meta.url);
if(process.argv.includes('--check')){const actual=fs.readFileSync(target,'utf8');if(actual!==out){console.error('MANIFEST_DRIFT');process.exit(1);}console.log('DETERMINISTIC_REGENERATION_PASS');}else fs.writeFileSync(target,out);

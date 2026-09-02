import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
const here=dirname(fileURLToPath(import.meta.url));
const source=await readFile(join(here,'action-nav-doc-layer.source.js'));
const target=join(here,'action-nav-doc-layer.bundle.js');
if(process.argv.includes('--check')){const current=await readFile(target);if(!source.equals(current))throw new Error('ACTION_NAV_DOC_LAYER_BUNDLE_REGEN_DRIFT')}else await writeFile(target,source);

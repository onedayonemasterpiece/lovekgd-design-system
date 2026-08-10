#!/usr/bin/env node
import childProcess from 'node:child_process';
import path from 'node:path';
import { collectAndValidate, RECEIPT_PATH } from './event-media-blocker-closure-v1/lib.mjs';
import { buildReceipt, receiptMetadata, verifyReceipt } from './event-media-blocker-closure-v1/receipt.mjs';
const args=process.argv.slice(2);const value=(flag)=>{const i=args.indexOf(flag);if(i<0)return null;if(!args[i+1]||args[i+1].startsWith('--'))throw new Error(`${flag} requires a value`);return args[i+1]};
try {
 const known=new Set(['--root','--events-repo','--skip-receipt','--fixture-mode']);for(let i=0;i<args.length;i++){if(!known.has(args[i]))throw new Error(`unknown argument: ${args[i]}`);if(['--root','--events-repo'].includes(args[i]))i++;}
 const root=path.resolve(value('--root')??'.');const eventsRoot=value('--events-repo');const fixtureMode=args.includes('--fixture-mode');const skipReceipt=args.includes('--skip-receipt');if(!fixtureMode&&!eventsRoot)throw new Error('--events-repo is required outside --fixture-mode');
 const pyArgs=[path.join(root,'scripts/event-media-blocker-closure-v1/validate-schemas.py'),'--root',root];if(skipReceipt)pyArgs.push('--skip-receipt');const schema=childProcess.spawnSync('python3',pyArgs,{cwd:root,encoding:'utf8'});if(schema.status!==0)throw new Error(schema.stderr.trim().split('\n').at(-1)||`schema validation failed: ${schema.status}`);
 const result=collectAndValidate({root,eventsRoot,fixtureMode});
 if(!skipReceipt){const metadata=receiptMetadata(root);const expected=buildReceipt({root,eventsRoot,fixtureMode,...metadata});verifyReceipt(root,expected);}
 console.log(JSON.stringify({status:'valid',receipt:skipReceipt?'skipped-explicitly':RECEIPT_PATH,final_status:result.final_status,facts:result.facts},null,2));
} catch(error){console.error(JSON.stringify({status:'rejected',error:error?.toJSON?.()??{name:error.name??'Error',code:error.code??'EMC_VALIDATION_FAILED',stage:error.stage??'validator',record:error.record??'event-media-blocker-closure-v1',path:error.pointer??'/',diagnostic:error.message}}));process.exit(1);}

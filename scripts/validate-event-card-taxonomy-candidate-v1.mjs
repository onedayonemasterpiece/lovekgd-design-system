#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
const args=process.argv.slice(2); const run=spawnSync('python3',['scripts/validate-event-card-taxonomy-candidate-v1.py',...args],{encoding:'utf8'}); process.stdout.write(run.stdout); process.stderr.write(run.stderr); process.exit(run.status ?? 1);

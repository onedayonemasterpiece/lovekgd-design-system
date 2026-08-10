#!/usr/bin/env node

import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const separator = args.indexOf('--');
const fail = (message) => { throw new Error(message); };
if (separator < 0 || separator === args.length - 1) fail('usage: workflow-command-ledger.mjs [options] -- command [args...]');

const options = args.slice(0, separator);
const command = args[separator + 1];
const commandArgs = args.slice(separator + 2);
const valueAfter = (flag) => {
  const index = options.indexOf(flag);
  if (index < 0 || index === options.length - 1) fail(`missing required option: ${flag}`);
  return options[index + 1];
};

const ledgerPath = path.resolve(valueAfter('--ledger'));
const logsDir = path.resolve(valueAfter('--logs-dir'));
const label = valueAfter('--label');
const cwd = path.resolve(valueAfter('--cwd'));
const cwdLabel = valueAfter('--cwd-label');
const stdoutFileValue = options.includes('--stdout-file') ? valueAfter('--stdout-file') : null;
const stdoutFile = stdoutFileValue ? path.resolve(stdoutFileValue) : null;

if (!/^[a-z0-9][a-z0-9-]*$/.test(label)) fail(`invalid command label: ${label}`);
if (!/^[a-z0-9][a-z0-9-]*$/.test(cwdLabel)) fail(`invalid cwd label: ${cwdLabel}`);
if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) fail(`command cwd does not exist: ${cwd}`);

fs.mkdirSync(path.dirname(ledgerPath), { recursive: true });
fs.mkdirSync(logsDir, { recursive: true });
if (stdoutFile) fs.mkdirSync(path.dirname(stdoutFile), { recursive: true });

const previous = fs.existsSync(ledgerPath)
  ? fs.readFileSync(ledgerPath, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line))
  : [];
if (previous.some((entry) => entry.label === label)) fail(`duplicate command label: ${label}`);
const sequence = previous.length + 1;
const prefix = `${String(sequence).padStart(3, '0')}-${label}`;
const stdoutPath = path.join(logsDir, `${prefix}.stdout.log`);
const stderrPath = path.join(logsDir, `${prefix}.stderr.log`);
const startedAt = new Date();
const startedNs = process.hrtime.bigint();
const execution = childProcess.spawnSync(command, commandArgs, {
  cwd,
  encoding: null,
  env: process.env,
  maxBuffer: 512 * 1024 * 1024,
});
const finishedNs = process.hrtime.bigint();
const finishedAt = new Date();
const stdout = execution.stdout ?? Buffer.alloc(0);
const stderr = execution.stderr ?? Buffer.alloc(0);
fs.writeFileSync(stdoutPath, stdout);
fs.writeFileSync(stderrPath, stderr);
if (stdoutFile) fs.writeFileSync(stdoutFile, stdout);

const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const relativeToLedger = (absolute) => path.relative(path.dirname(ledgerPath), absolute).split(path.sep).join('/');
const exitCode = execution.status ?? (execution.error ? 127 : 128);
const record = {
  schema_version: 'project_normalization_command_ledger_entry_v1',
  sequence,
  label,
  cwd: cwdLabel,
  argv: [command, ...commandArgs],
  started_at: startedAt.toISOString(),
  finished_at: finishedAt.toISOString(),
  duration_ms: Number((finishedNs - startedNs) / 1_000_000n),
  exit_code: exitCode,
  signal: execution.signal ?? null,
  stdout: {
    path: relativeToLedger(stdoutPath),
    bytes: stdout.byteLength,
    sha256: sha256(stdout),
  },
  stderr: {
    path: relativeToLedger(stderrPath),
    bytes: stderr.byteLength,
    sha256: sha256(stderr),
  },
};
fs.appendFileSync(ledgerPath, `${JSON.stringify(record)}\n`);

if (stdout.byteLength > 0) process.stdout.write(stdout);
if (stderr.byteLength > 0) process.stderr.write(stderr);
if (execution.error) process.stderr.write(`${execution.error.stack ?? execution.error.message}\n`);
process.exitCode = exitCode;

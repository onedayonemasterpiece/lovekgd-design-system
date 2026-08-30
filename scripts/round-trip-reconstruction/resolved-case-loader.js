'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const CASE_SCHEMA = 'kenigevents.resolved-render-case.v1';
const INDEX_SCHEMA = 'kenigevents.resolved-render-case-index.v1';
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  return value;
}
const canonicalJson = (value) => `${JSON.stringify(canonicalize(value))}\n`;
function fail(code, detail) {
  const error = new Error(`${code}:${detail}`);
  error.code = code;
  throw error;
}
function readJson(filePath, label) {
  let bytes;
  try { bytes = fs.readFileSync(filePath); } catch (error) { fail('MISSING_RESOLVED_CASE', `${label}:${error.code}`); }
  try { return { bytes, value: JSON.parse(bytes) }; } catch { fail('INVALID_RESOLVED_CASE_JSON', label); }
}
function validateContentHash(document, label) {
  const expected = sha256(canonicalJson({ ...document, content_sha256: null }));
  if (document.content_sha256 !== expected) fail('RESOLVED_CASE_HASH_MISMATCH', label);
}
function loadResolvedCaseIndex(root, indexPath, expectedFileSha256, requiredCaseIds = []) {
  const absoluteRoot = path.resolve(root);
  const absoluteIndex = path.resolve(absoluteRoot, indexPath);
  if (!absoluteIndex.startsWith(`${absoluteRoot}${path.sep}`)) fail('RESOLVED_CASE_PATH_ESCAPE', indexPath);
  const indexFile = readJson(absoluteIndex, indexPath);
  if (sha256(indexFile.bytes) !== expectedFileSha256) fail('RESOLVED_INDEX_FILE_HASH_MISMATCH', indexPath);
  const index = indexFile.value;
  if (index.schema !== INDEX_SCHEMA || index.control_generation !== 3) fail('RESOLVED_INDEX_SCHEMA_MISMATCH', indexPath);
  validateContentHash(index, indexPath);
  const ids = index.cases.map((item) => item.case_id);
  if (new Set(ids).size !== ids.length) fail('DUPLICATE_RESOLVED_CASE', indexPath);
  const selected = {};
  for (const caseId of requiredCaseIds) {
    const binding = index.cases.find((item) => item.case_id === caseId);
    if (!binding) fail('REQUIRED_RESOLVED_CASE_MISSING', caseId);
    const absoluteCase = path.resolve(absoluteRoot, binding.resolved_case_path);
    if (!absoluteCase.startsWith(`${absoluteRoot}${path.sep}`)) fail('RESOLVED_CASE_PATH_ESCAPE', binding.resolved_case_path);
    const caseFile = readJson(absoluteCase, binding.resolved_case_path);
    if (sha256(caseFile.bytes) !== binding.file_sha256) fail('RESOLVED_CASE_FILE_HASH_MISMATCH', caseId);
    const document = caseFile.value;
    if (document.schema !== CASE_SCHEMA || document.case_id !== caseId || document.control_generation !== 3) fail('RESOLVED_CASE_SCHEMA_MISMATCH', caseId);
    validateContentHash(document, caseId);
    if (document.content_sha256 !== binding.content_sha256) fail('RESOLVED_CASE_BINDING_MISMATCH', caseId);
    selected[caseId] = document;
  }
  return { index, cases: selected, payloadHash: index.content_sha256 };
}

module.exports = { CASE_SCHEMA, INDEX_SCHEMA, canonicalJson, loadResolvedCaseIndex, sha256 };

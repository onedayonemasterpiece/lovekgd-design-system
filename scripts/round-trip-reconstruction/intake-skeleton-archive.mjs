#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { tmpdir } from 'node:os';

const archive = process.argv[2];
if (!archive || !existsSync(archive)) {
  console.error('usage: node scripts/round-trip-reconstruction/intake-skeleton-archive.mjs <single.zip>');
  process.exit(2);
}
if (!/\.zip$/i.test(archive)) throw new Error('SKELETON_ARCHIVE_MUST_BE_SINGLE_ZIP');
const bytes = readFileSync(archive);
const archiveSha = createHash('sha256').update(bytes).digest('hex');
const size = statSync(archive).size;
if (size > 2_000_000_000) throw new Error('SKELETON_ARCHIVE_TOO_LARGE');
const entries = execFileSync('unzip', ['-Z1', archive], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).split('\n').filter(Boolean);
if (!entries.length) throw new Error('SKELETON_ARCHIVE_EMPTY');
if (entries.length > 5000) throw new Error('SKELETON_ARCHIVE_TOO_MANY_ENTRIES');
const unsafe = entries.filter(name => name.startsWith('/') || name.split('/').includes('..') || name.includes('\\'));
if (unsafe.length) throw new Error(`SKELETON_ARCHIVE_UNSAFE_PATHS:${unsafe.join(',')}`);

const temp = mkdtempSync(join(tmpdir(), 'skeleton-intake-'));
const outputDir = 'evidence/round-trip-reconstruction/v1/skeleton-intake';
mkdirSync(outputDir, { recursive: true });
try {
  execFileSync('unzip', ['-qq', archive, '-d', temp]);
  const images = entries.filter(name => /\.(?:png|jpe?g|webp)$/i.test(name)).map(name => {
    const path = join(temp, name);
    const dimensions = execFileSync('magick', ['identify', '-format', '%w %h %m', path], { encoding: 'utf8' }).trim().split(' ');
    const imageBytes = readFileSync(path);
    return {
      archive_path: name,
      sha256: createHash('sha256').update(imageBytes).digest('hex'),
      bytes: imageBytes.length,
      width: Number(dimensions[0]),
      height: Number(dimensions[1]),
      format: dimensions[2],
      source_date: null,
      viewport: null,
      route_id: null,
      archetype_id: null,
      region_id: null,
      component_id: null,
      state_id: null,
      disposition: 'unresolved_mapping'
    };
  });
  if (!images.length) throw new Error('SKELETON_ARCHIVE_HAS_NO_IMAGES');
  const retained = join(outputDir, `${archiveSha}.zip`);
  copyFileSync(archive, retained);
  const manifest = {
    schema_version: 'skeleton-as-is-manifest.v1',
    status: 'INTAKE_COMPLETE_MAPPING_REQUIRED',
    captured_at: new Date().toISOString(),
    archive: { original_name: basename(archive), retained_path: retained, sha256: archiveSha, bytes: size, entry_count: entries.length },
    images,
    coverage: { mapped: 0, unresolved: images.length },
    boundaries: { single_zip: true, manual_file_transfer: false, loading_redesign_allowed: false, baseline_blocked: false },
    next_gate: 'Map source date + viewport + route/archetype/region/component/state without guessing; classify production/prototype/obsolete/duplicate.'
  };
  const manifestPath = join(outputDir, 'skeleton-as-is-manifest.v1.json');
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`${manifestPath}: ${createHash('sha256').update(readFileSync(manifestPath)).digest('hex')} (${images.length} images)`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}

#!/usr/bin/env node
// Batch-compress every JPG/PNG in /public/ in place.
// JPG → MozJPEG q=85 progressive. PNG → sharp compressionLevel 9 (lossless).
// Revert: `git checkout public/` — everything is tracked.

import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync, readdirSync, unlinkSync, existsSync } from 'fs';
import { resolve, extname, join } from 'path';

const ROOT = '/tmp/claude-501/lp-healthy-living/public';
const SKIP_NAMES = new Set(['hero-bg.optimized.jpg']); // test file cleanup

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

// Clean up the test file first
const testFile = resolve(ROOT, 'hero-bg.optimized.jpg');
if (existsSync(testFile)) {
  unlinkSync(testFile);
  console.log(`Removed test file: hero-bg.optimized.jpg\n`);
}

const all = walk(ROOT);
const targets = all.filter(f => {
  const ext = extname(f).toLowerCase();
  const name = f.split('/').pop();
  if (SKIP_NAMES.has(name)) return false;
  return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
});

console.log(`Found ${targets.length} images to process\n`);

let totalBefore = 0;
let totalAfter = 0;
const results = [];

for (const f of targets) {
  try {
    const before = statSync(f).size;
    totalBefore += before;
    const ext = extname(f).toLowerCase();
    const buf = readFileSync(f);

    let optimized;
    if (ext === '.jpg' || ext === '.jpeg') {
      optimized = await sharp(buf)
        .jpeg({ quality: 85, mozjpeg: true, progressive: true })
        .toBuffer();
    } else {
      // PNG — lossless, max compression, strip metadata
      optimized = await sharp(buf)
        .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
        .toBuffer();
    }

    // Only overwrite if smaller
    if (optimized.length < before) {
      writeFileSync(f, optimized);
      totalAfter += optimized.length;
      results.push({ file: f, before, after: optimized.length, changed: true });
    } else {
      totalAfter += before;
      results.push({ file: f, before, after: before, changed: false });
    }
  } catch (e) {
    console.error(`FAILED: ${f}\n  ${e.message}`);
    totalAfter += statSync(f).size;
  }
}

// Sort by savings
results.sort((a, b) => (b.before - b.after) - (a.before - a.after));

console.log(`${'File'.padEnd(60)} ${'Before'.padStart(9)} → ${'After'.padStart(9)}  ${'Saved'.padStart(7)}`);
console.log('─'.repeat(100));
for (const r of results) {
  const short = r.file.replace(ROOT, '');
  const saved = r.changed ? `${(((r.before - r.after) / r.before) * 100).toFixed(0)}%` : 'skip';
  console.log(
    `${short.slice(0, 60).padEnd(60)} ${(r.before / 1024).toFixed(0).padStart(7)}KB → ${(r.after / 1024).toFixed(0).padStart(7)}KB  ${saved.padStart(7)}`
  );
}

const totalSaved = totalBefore - totalAfter;
console.log('─'.repeat(100));
console.log(`\nTOTAL: ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);
console.log(`SAVED: ${(totalSaved / 1024 / 1024).toFixed(1)} MB  (${((totalSaved / totalBefore) * 100).toFixed(1)}%)`);
console.log(`\nRevert with: cd /tmp/claude-501/lp-healthy-living && git checkout public/`);

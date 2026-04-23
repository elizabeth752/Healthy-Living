#!/usr/bin/env node
// Generate .webp alongside every .jpg in /public/ at quality 80.
import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync, readdirSync, existsSync } from 'fs';
import { extname, join } from 'path';

const ROOT = '/tmp/claude-501/lp-healthy-living/public';

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

const jpgs = walk(ROOT).filter(f => /\.jpe?g$/i.test(f));
console.log(`Found ${jpgs.length} JPGs\n`);

let totalJpg = 0;
let totalWebp = 0;

for (const jpg of jpgs) {
  const webp = jpg.replace(/\.jpe?g$/i, '.webp');
  try {
    const buf = readFileSync(jpg);
    const result = await sharp(buf).webp({ quality: 80, effort: 5 }).toBuffer();
    writeFileSync(webp, result);
    const j = statSync(jpg).size;
    const w = statSync(webp).size;
    totalJpg += j;
    totalWebp += w;
    const short = jpg.replace(ROOT, '');
    const saved = (((j - w) / j) * 100).toFixed(0);
    console.log(`${short.slice(0, 56).padEnd(56)} ${(j / 1024).toFixed(0).padStart(6)}KB → ${(w / 1024).toFixed(0).padStart(6)}KB  -${saved}%`);
  } catch (e) {
    console.error(`FAIL ${jpg}: ${e.message}`);
  }
}

console.log(`\nTOTAL: ${(totalJpg / 1024 / 1024).toFixed(2)} MB → ${(totalWebp / 1024 / 1024).toFixed(2)} MB`);
console.log(`SAVED: ${((totalJpg - totalWebp) / 1024 / 1024).toFixed(2)} MB (${(((totalJpg - totalWebp) / totalJpg) * 100).toFixed(0)}%)`);

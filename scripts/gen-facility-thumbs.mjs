#!/usr/bin/env node
// Generate small thumbnail versions of facility carousel images at 336x160
// (2x the 168x80 display size for retina). Saves as -thumb.webp.
// Also ensures main-carousel .webp exists for motion.img direct loading.
import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync, existsSync } from 'fs';

const ROOT = '/tmp/claude-501/lp-healthy-living/public';

// Read FACILITY array from page.tsx programmatically
const pageSrc = readFileSync('/tmp/claude-501/lp-healthy-living/app/page.tsx', 'utf8');
const facilityMatch = pageSrc.match(/const FACILITY = \[([\s\S]*?)\];/);
if (!facilityMatch) { console.error('Could not find FACILITY array'); process.exit(1); }
const paths = facilityMatch[1].match(/'([^']+)'/g)?.map(s => s.slice(1, -1)) || [];

console.log(`Found ${paths.length} facility images\n`);

let totalSaved = 0;
for (const p of paths) {
  const jpg = ROOT + p;
  if (!existsSync(jpg)) { console.warn(`Skip missing: ${p}`); continue; }

  const thumbPath = jpg.replace(/\.jpe?g$/i, '-thumb.webp');

  const buf = readFileSync(jpg);
  // 336x160 = 2x of 168x80 display size, covers retina displays
  const thumb = await sharp(buf)
    .resize(336, 160, { fit: 'cover', position: 'center' })
    .webp({ quality: 75, effort: 5 })
    .toBuffer();
  writeFileSync(thumbPath, thumb);

  const jpgSize = statSync(jpg).size;
  const thumbSize = statSync(thumbPath).size;
  totalSaved += jpgSize - thumbSize;
  console.log(`${p.padEnd(52)} ${(jpgSize / 1024).toFixed(0).padStart(5)}KB → ${(thumbSize / 1024).toFixed(0).padStart(4)}KB`);
}

console.log(`\nTotal if all thumbs load: ${(totalSaved / 1024 / 1024).toFixed(2)} MB saved vs full-res`);

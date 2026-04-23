#!/usr/bin/env node
// Test compression on ONE image (hero-bg.jpg). Writes optimized copy
// alongside the original so you can visually diff before we batch.

import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync } from 'fs';
import { resolve } from 'path';

const src = resolve('/tmp/claude-501/lp-healthy-living/public/hero-bg.jpg');
const out = resolve('/tmp/claude-501/lp-healthy-living/public/hero-bg.optimized.jpg');

const srcSize = statSync(src).size;
const buf = readFileSync(src);

const meta = await sharp(buf).metadata();
console.log(`Source: ${src}`);
console.log(`  ${meta.width} × ${meta.height}  |  ${(srcSize / 1024).toFixed(0)} KB`);

const optimized = await sharp(buf)
  .jpeg({ quality: 85, mozjpeg: true, progressive: true })
  .toBuffer();

writeFileSync(out, optimized);
const outSize = statSync(out).size;

console.log(`\nOptimized: ${out}`);
console.log(`  ${meta.width} × ${meta.height}  |  ${(outSize / 1024).toFixed(0)} KB`);
console.log(`\nSavings: ${(((srcSize - outSize) / srcSize) * 100).toFixed(1)}% smaller`);
console.log(`         ${((srcSize - outSize) / 1024).toFixed(0)} KB saved`);
console.log(`\nCompare visually:`);
console.log(`  original:  ${src}`);
console.log(`  optimized: ${out}`);

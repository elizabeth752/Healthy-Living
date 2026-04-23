#!/usr/bin/env node
// Test aggressive PNG quantization on cutout with alpha preserved.
import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync } from 'fs';

const src = '/tmp/claude-501/lp-healthy-living/public/assets/802d3aa1-7759-49f9-9b36-c9287b6f81fb-cutout.png';
const out = '/tmp/claude-501/lp-healthy-living/public/assets/cutout-test.png';

const buf = readFileSync(src);
const result = await sharp(buf)
  .png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 })
  .toBuffer();

writeFileSync(out, result);

const srcSize = statSync(src).size;
const outSize = statSync(out).size;

console.log(`Original: ${(srcSize / 1024).toFixed(0)} KB`);
console.log(`Quantized: ${(outSize / 1024).toFixed(0)} KB`);
console.log(`Savings: ${(((srcSize - outSize) / srcSize) * 100).toFixed(0)}%`);

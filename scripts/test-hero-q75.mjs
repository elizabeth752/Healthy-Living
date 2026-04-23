import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync } from 'fs';

const src = '/tmp/claude-501/lp-healthy-living/public/assets/b98d49b5-9f35-465b-88d4-d034211e775a.jpg';
const out = '/tmp/claude-501/lp-healthy-living/public/assets/hero-q75-test.jpg';

const buf = readFileSync(src);
const result = await sharp(buf).jpeg({ quality: 75, mozjpeg: true, progressive: true }).toBuffer();
writeFileSync(out, result);

const srcSize = statSync(src).size;
const outSize = statSync(out).size;
console.log(`Current (q85): ${(srcSize / 1024).toFixed(0)} KB`);
console.log(`Test (q75): ${(outSize / 1024).toFixed(0)} KB`);
console.log(`Additional savings: ${(((srcSize - outSize) / srcSize) * 100).toFixed(0)}% (${((srcSize - outSize) / 1024).toFixed(0)} KB)`);

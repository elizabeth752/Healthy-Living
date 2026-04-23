#!/usr/bin/env node
// Replace <img with <OptImg throughout page.tsx. Does NOT touch <motion.img>,
// comments, or any other token containing "img". Only matches the exact
// start-of-tag "<img " or "<img\n" or "<img\t".

import { readFileSync, writeFileSync } from 'fs';

const PATH = '/tmp/claude-501/lp-healthy-living/app/page.tsx';
const src = readFileSync(PATH, 'utf8');

// Skip if file already has OptImg tags (idempotent).
const before = (src.match(/<img[\s\n\t]/g) || []).length;
// Skip lines that are inside the OptImg component definition itself — it
// contains a literal <img> tag we do NOT want to recursively replace.
// Strategy: split on the component definition, process only the body below it.
const MARKER = 'return <img src={src} {...rest} />;\n}';
const parts = src.split(MARKER);
if (parts.length !== 2) {
  console.error(`Could not find OptImg marker — aborting. Check component definition.`);
  process.exit(1);
}
const [head, body] = parts;
const transformedBody = body.replace(/<img([\s\n\t])/g, '<OptImg$1');
const out = head + MARKER + transformedBody;

writeFileSync(PATH, out);
const after = (transformedBody.match(/<OptImg[\s\n\t]/g) || []).length;
console.log(`Replaced ${after} <img> tags with <OptImg>. (${before - 1} existed before, -1 for the one inside OptImg itself)`);

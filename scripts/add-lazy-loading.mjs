#!/usr/bin/env node
// Adds loading="lazy" to below-fold <img> tags in page.tsx.
// Preserves above-fold imgs (header, hero): LOGO, HERO_BG (has fetchPriority),
// CHECK_IC (hero bullets), BADGE_G/B, DHCS, PSYCH, SAMHSA, FORM_IC (line 757),
// and the in-hero PHONE_IC (lines 604, 738).

import { readFileSync, writeFileSync } from 'fs';

const PATH = '/tmp/claude-501/lp-healthy-living/app/page.tsx';
const src = readFileSync(PATH, 'utf8');
const lines = src.split('\n');

// Lines that are ABOVE the fold — NEVER add lazy here (1-indexed)
const ABOVE_FOLD_LINES = new Set([
  600, // LOGO header
  604, // PHONE_IC header
  691, // HERO_BG (has fetchPriority)
  719, // CHECK_IC hero bullet
  727, // CHECK_IC hero bullet
  738, // PHONE_IC hero CTA
  742, // BADGE_G
  743, // BADGE_B
  744, // DHCS
  745, // PSYCH
  746, // SAMHSA
  757, // FORM_IC hero form
]);

let changed = 0;
let skipped = 0;
const newLines = lines.map((line, i) => {
  const lineNum = i + 1;
  // Match <img or <motion.img (with or without leading whitespace)
  if (!/<(img|motion\.img)\s/.test(line)) return line;
  // Skip if already has loading= attribute
  if (/loading=/.test(line)) { skipped++; return line; }
  // Skip above-fold lines
  if (ABOVE_FOLD_LINES.has(lineNum)) { skipped++; return line; }
  // Skip if has fetchPriority (defensive)
  if (/fetchPriority/.test(line)) { skipped++; return line; }

  // Inject loading="lazy" right after <img or <motion.img
  const updated = line.replace(
    /<(img|motion\.img)(\s)/,
    (_m, tag, ws) => `<${tag} loading="lazy"${ws}`
  );
  if (updated !== line) { changed++; return updated; }
  return line;
});

writeFileSync(PATH, newLines.join('\n'));
console.log(`Added loading="lazy" to ${changed} <img> tags. Skipped ${skipped}.`);

#!/usr/bin/env node
// One-shot script: re-sync the Healthy Living facility gallery from Figma.
// Pulls the 20 image nodes from Frame 1255 (facility carousel), downloads
// them as JPGs, converts to WebP + thumbnail variants, writes to the LP repo.

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync } from 'fs';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });
config({ path: resolve(__dirname, '..', '.env') });

import { exportFigmaImages } from '../lib/figma-import';

const FILE_KEY = '61zcrh5xowwO3K3DFGgQy7';
const LP_ASSETS_DIR = '/tmp/claude-501/lp-healthy-living/public/assets';

// 20 image node IDs from Frame 1255 (facility carousel), via figma-manifest extraction
const IMAGE_NODES = [
  '6140:442', '6140:443', '6140:444', '6140:445', '6140:446',
  '6140:447', '6140:448', '6140:449', '6140:450', '6140:451',
  '6140:452', '6140:453', '6140:454', '6140:455', '6140:456',
  '6140:457', '6140:458', '6140:459', '6140:460', '6140:461',
];

// Map image refs to short, stable filenames
const REF_TO_NAME: Record<string, string> = {
  'a241e2564d201565cf91a2095b16d61cdbcfede8': 'facility-01',
  'ab830f1e08033042f6d63ce9b7571c4bb630d941': 'facility-02',
  'd1c58e8d32cf51a3b77d5111cad4897ec42751bd': 'facility-03',
  'd00dfd3d0cfa61b2df6dc21304db9c8e94c98ed2': 'facility-04',
  '45ffb699db17b3d32c8a9d0baca36e0524dbcb83': 'facility-05',
  'bf6926bf763e0e1e55a3f3b9baf3b17545ec2dfd': 'facility-06',
  'b2b905d75ef1560765787156e7c9ab81e0ab5015': 'facility-07',
  '78baae6c7ad12c992f66b1b02efaf0079c91eaf3': 'facility-08',
  '324c252a98f078ec7ac8665da82c7e046a1b415e': 'facility-09',
  'cb99cbe58a5e23157640c7b33748174c3abc3c94': 'facility-10',
  'fd24877baa7ce25b69c743892a6a0a35febd86da': 'facility-11',
  '0f9b9fdaa1b678a991c596f079a204a27295e050': 'facility-12',
  'edc413547df5d7d97cb067b5370de5f39deaf673': 'facility-13',
  'cf97d41d797eb00ebf939e3ce07b8199fcbbda22': 'facility-14',
  '1a8e2b3ff07950a44382d229fb351b9abbec5275': 'facility-15',
  '6b49e37361a15abb44dde7792aa98c4c3d5e328e': 'facility-16',
  '5d004bf7ed86f526657300f2b391ae99d46c20b2': 'facility-17',
  '9926e0a8bc22bd134c190cc4e89ffc81d4ca70fc': 'facility-18',
  '62b98c9902b91cb6e04f9ea22c7bcacca6b26321': 'facility-19',
};

// Position-ordered list (matches Figma top-to-bottom; one duplicate dropped)
const ORDERED_REFS = [
  'a241e2564d201565cf91a2095b16d61cdbcfede8',
  'ab830f1e08033042f6d63ce9b7571c4bb630d941',
  'd1c58e8d32cf51a3b77d5111cad4897ec42751bd',
  'd00dfd3d0cfa61b2df6dc21304db9c8e94c98ed2',
  '45ffb699db17b3d32c8a9d0baca36e0524dbcb83',
  'bf6926bf763e0e1e55a3f3b9baf3b17545ec2dfd',
  'b2b905d75ef1560765787156e7c9ab81e0ab5015',
  '78baae6c7ad12c992f66b1b02efaf0079c91eaf3',
  '324c252a98f078ec7ac8665da82c7e046a1b415e',
  'cb99cbe58a5e23157640c7b33748174c3abc3c94',
  'fd24877baa7ce25b69c743892a6a0a35febd86da',
  '0f9b9fdaa1b678a991c596f079a204a27295e050',
  'edc413547df5d7d97cb067b5370de5f39deaf673',
  'cf97d41d797eb00ebf939e3ce07b8199fcbbda22',
  '1a8e2b3ff07950a44382d229fb351b9abbec5275',
  '6b49e37361a15abb44dde7792aa98c4c3d5e328e',
  '5d004bf7ed86f526657300f2b391ae99d46c20b2',
  '9926e0a8bc22bd134c190cc4e89ffc81d4ca70fc',
  '62b98c9902b91cb6e04f9ea22c7bcacca6b26321',
];

async function main() {
  console.log(`Exporting ${IMAGE_NODES.length} image nodes from Figma...`);
  const urls = await exportFigmaImages(FILE_KEY, IMAGE_NODES, 'jpg', 2);
  const successCount = Object.values(urls).filter(Boolean).length;
  console.log(`✓ Got ${successCount} URLs from Figma\n`);

  // Map nodeId → ref (we know the order from IMAGE_NODES, refs from ORDERED_REFS+duplicate)
  // Actually simpler: re-fetch the specs and map nodeId → ref
  // For this script, easier: download each URL and save by ref name
  // Need to walk URLs in same order as IMAGE_NODES, get the ref from the manifest
  const manifest = JSON.parse(require('fs').readFileSync('/tmp/hl-manifest.json', 'utf8'));
  const carousel = manifest.sections.find((s: any) => s.id === '6140:441');
  const nodeToRef: Record<string, string> = {};
  function walk(n: any) {
    if (n.imageRef) nodeToRef[n.id] = n.imageRef.imageRef;
    if (n.children) for (const c of n.children) walk(c);
  }
  walk(carousel.root);

  const downloaded: { ref: string; name: string; webpPath: string; thumbPath: string }[] = [];

  for (const nodeId of IMAGE_NODES) {
    const url = urls[nodeId];
    if (!url) {
      console.log(`  SKIP ${nodeId} — no URL returned`);
      continue;
    }
    const ref = nodeToRef[nodeId];
    if (!ref) {
      console.log(`  SKIP ${nodeId} — no ref mapping`);
      continue;
    }
    const name = REF_TO_NAME[ref];
    if (!name) {
      console.log(`  SKIP ${nodeId} — no name mapping for ref ${ref.slice(0, 8)}`);
      continue;
    }

    // Skip if already downloaded under this name
    if (downloaded.some(d => d.name === name)) {
      console.log(`  DUP  ${name} — already downloaded`);
      continue;
    }

    process.stdout.write(`  ${name} ... `);
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`FAIL (${res.status})`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());

    // Full-size WebP (for main carousel)
    const webpPath = `${LP_ASSETS_DIR}/${name}.webp`;
    const webpBuf = await sharp(buf).webp({ quality: 80 }).toBuffer();
    writeFileSync(webpPath, webpBuf);

    // Thumbnail WebP at 336x160 (for thumb strip — 2x of 168x80 display)
    const thumbPath = `${LP_ASSETS_DIR}/${name}-thumb.webp`;
    const thumbBuf = await sharp(buf)
      .resize(336, 160, { fit: 'cover', position: 'center' })
      .webp({ quality: 75 })
      .toBuffer();
    writeFileSync(thumbPath, thumbBuf);

    console.log(`✓ ${(webpBuf.length / 1024).toFixed(0)}KB + thumb ${(thumbBuf.length / 1024).toFixed(0)}KB`);
    downloaded.push({ ref, name, webpPath, thumbPath });
  }

  console.log(`\n✓ Downloaded ${downloaded.length} unique images\n`);

  // Print the new FACILITY array (in Figma order, deduped)
  console.log('---');
  console.log('Updated FACILITY array (paste into page.tsx):\n');
  console.log('const FACILITY = [');
  const seen = new Set();
  for (const ref of ORDERED_REFS) {
    if (seen.has(ref)) continue;
    seen.add(ref);
    const name = REF_TO_NAME[ref];
    if (downloaded.some(d => d.name === name)) {
      console.log(`  '/assets/${name}.webp',`);
    }
  }
  console.log('];');
}

main().catch(err => {
  console.error('ERROR:', err.message);
  console.error(err.stack);
  process.exit(1);
});

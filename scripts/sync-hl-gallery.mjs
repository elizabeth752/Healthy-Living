#!/usr/bin/env node
// Standalone — re-sync the Healthy Living facility gallery from Figma.
// Pulls the 20 image nodes from Frame 1255, downloads, converts to WebP + thumbs.

import { writeFileSync, readFileSync, existsSync } from 'fs';
import sharp from 'sharp';

// Manually parse FIGMA_ACCESS_TOKEN from e8/site .env files
function loadEnv(path) {
  if (!existsSync(path)) return;
  const content = readFileSync(path, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) {
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[m[1]] = val;
    }
  }
}
loadEnv('/Users/kross/summon/site/.env.local');
loadEnv('/Users/kross/summon/site/.env');

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
if (!FIGMA_TOKEN) {
  console.error('FIGMA_ACCESS_TOKEN not set');
  process.exit(1);
}

const FILE_KEY = '61zcrh5xowwO3K3DFGgQy7';
const LP_ASSETS_DIR = '/tmp/claude-501/lp-healthy-living/public/assets';

const IMAGE_NODES = [
  '6140:442', '6140:443', '6140:444', '6140:445', '6140:446',
  '6140:447', '6140:448', '6140:449', '6140:450', '6140:451',
  '6140:452', '6140:453', '6140:454', '6140:455', '6140:456',
  '6140:457', '6140:458', '6140:459', '6140:460', '6140:461',
];

const REF_TO_NAME = {
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

async function exportImages() {
  const url = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${IMAGE_NODES.join(',')}&format=jpg&scale=2`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });
  if (!res.ok) {
    throw new Error(`Figma API: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.images;
}

async function main() {
  console.log(`Exporting ${IMAGE_NODES.length} image nodes from Figma...`);
  const urls = await exportImages();
  const successCount = Object.values(urls).filter(Boolean).length;
  console.log(`✓ Got ${successCount} URLs from Figma\n`);

  // Map nodeId → ref using manifest
  const manifest = JSON.parse(readFileSync('/tmp/hl-manifest.json', 'utf8'));
  const carousel = manifest.sections.find(s => s.id === '6140:441');
  const nodeToRef = {};
  function walk(n) {
    if (n.imageRef) nodeToRef[n.id] = n.imageRef.imageRef;
    if (n.children) for (const c of n.children) walk(c);
  }
  walk(carousel.root);

  const downloaded = [];

  for (const nodeId of IMAGE_NODES) {
    const url = urls[nodeId];
    if (!url) {
      console.log(`  SKIP ${nodeId} — no URL`);
      continue;
    }
    const ref = nodeToRef[nodeId];
    const name = REF_TO_NAME[ref];
    if (!name) {
      console.log(`  SKIP ${nodeId} — no name for ref ${ref?.slice(0, 8)}`);
      continue;
    }
    if (downloaded.some(d => d.name === name)) {
      console.log(`  DUP  ${name}`);
      continue;
    }

    process.stdout.write(`  ${name} ... `);
    const imgRes = await fetch(url);
    if (!imgRes.ok) {
      console.log(`FAIL ${imgRes.status}`);
      continue;
    }
    const buf = Buffer.from(await imgRes.arrayBuffer());

    // Full-size WebP
    const webpPath = `${LP_ASSETS_DIR}/${name}.webp`;
    const webpBuf = await sharp(buf).webp({ quality: 80 }).toBuffer();
    writeFileSync(webpPath, webpBuf);

    // Thumbnail
    const thumbPath = `${LP_ASSETS_DIR}/${name}-thumb.webp`;
    const thumbBuf = await sharp(buf)
      .resize(336, 160, { fit: 'cover', position: 'center' })
      .webp({ quality: 75 })
      .toBuffer();
    writeFileSync(thumbPath, thumbBuf);

    console.log(`✓ ${(webpBuf.length / 1024).toFixed(0)}KB + thumb ${(thumbBuf.length / 1024).toFixed(0)}KB`);
    downloaded.push({ ref, name });
  }

  console.log(`\n✓ Downloaded ${downloaded.length} unique images\n`);

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
  process.exit(1);
});

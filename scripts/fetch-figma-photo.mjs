/**
 * fetch-figma-photo.mjs
 *
 * One-shot script to download the updated middle photo from the Figma file
 * for the "Your Recovery Path to Healthy Living" section (Row 2 — residential).
 *
 * Usage:
 *   FIGMA_PAT=figd_... node scripts/fetch-figma-photo.mjs
 *
 * What it does:
 *   1. Reads nodes from the "Seccion 3" section of the desktop frame
 *   2. Finds the middle photo image node (Row 2)
 *   3. Exports it as a high-res JPG
 *   4. Downloads to public/assets/ with a UUID-based filename
 *   5. Prints the new filename so you can update SEC3_RESID in page.tsx
 *
 * After running:
 *   Update the SEC3_RESID constant in app/page.tsx with the printed filename.
 *   Also run `node scripts/compress-one.mjs public/assets/<new-file>.jpg` to
 *   generate the .webp variant.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PAT = process.env.FIGMA_PAT;
if (!PAT) {
  console.error('Error: FIGMA_PAT env var required');
  console.error('Usage: FIGMA_PAT=figd_... node scripts/fetch-figma-photo.mjs');
  process.exit(1);
}

const FILE_KEY = '61zcrh5xowwO3K3DFGgQy7';
// Desktop frame → Seccion 3 treatment path → Row 2 photo node
// The node ID for the residential treatment photo in the Figma file.
// Run without SPECIFIC_NODE to auto-discover, or set this to skip discovery.
const SPECIFIC_NODE = process.env.FIGMA_NODE_ID || null;

async function figmaGet(path) {
  return new Promise((resolve, reject) => {
    let data = '';
    https.get({
      hostname: 'api.figma.com',
      path,
      headers: { 'X-Figma-Token': PAT }
    }, res => {
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON parse error: ' + data.substring(0, 200))); }
      });
    }).on('error', reject);
  });
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        https.get(res.headers.location, res2 => {
          res2.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function main() {
  let nodeId = SPECIFIC_NODE;

  if (!nodeId) {
    console.log('Discovering treatment path section nodes...');
    // Desktop frame node 3574:2752 — get children to find Seccion 3
    const nodesData = await figmaGet(`/v1/files/${FILE_KEY}/nodes?ids=3574:2752&depth=3`);
    const root = nodesData.nodes?.['3574:2752']?.document;
    if (!root) {
      console.error('Could not find desktop frame. Check file key / node ID.');
      process.exit(1);
    }

    // Find the treatment path section (contains "Seccion 3" or "treatment" in name)
    function findNode(node, matcher, depth = 0) {
      if (matcher(node)) return node;
      if (depth > 5) return null;
      for (const child of node.children || []) {
        const found = findNode(child, matcher, depth + 1);
        if (found) return found;
      }
      return null;
    }

    const sec3 = findNode(root, n => /seccion.?3|treatment.path/i.test(n.name || ''));
    if (sec3) {
      console.log('Found section:', sec3.name, 'id:', sec3.id);
      console.log('Children:');
      (sec3.children || []).forEach(c => console.log(' ', c.name, c.type, c.id));
    } else {
      console.log('Could not auto-find Seccion 3. Available top-level sections:');
      (root.children || []).forEach(c => console.log(' ', c.name, c.type, c.id));
      console.log('\nTo specify a node directly: FIGMA_NODE_ID=XXXX:YYYY node scripts/fetch-figma-photo.mjs');
      process.exit(1);
    }
  } else {
    console.log('Using specified node:', nodeId);
  }

  if (!nodeId) {
    console.log('\nRe-run with FIGMA_NODE_ID=<the-image-node-id> to export the photo.');
    return;
  }

  // Export the node as a 2x JPG
  console.log(`\nExporting node ${nodeId} as JPG...`);
  const exportData = await figmaGet(`/v1/images/${FILE_KEY}?ids=${encodeURIComponent(nodeId)}&format=jpg&scale=2`);
  const imageUrl = exportData.images?.[nodeId.replace(':', '-')] || exportData.images?.[nodeId];

  if (!imageUrl) {
    console.error('No image URL returned. Export data:', JSON.stringify(exportData, null, 2));
    process.exit(1);
  }

  // Generate UUID-style filename
  const uuid = nodeId.replace(':', '-').replace(/[^a-z0-9-]/gi, '') + '-' + Date.now();
  const destJpg = path.join(ROOT, 'public', 'assets', `${uuid}.jpg`);

  console.log('Downloading to:', destJpg);
  await downloadFile(imageUrl, destJpg);

  console.log('\n✓ Downloaded:', path.basename(destJpg));
  console.log('\nNext steps:');
  console.log(`1. Update SEC3_RESID in app/page.tsx to: '/assets/${path.basename(destJpg)}'`);
  console.log(`2. Generate WebP: node scripts/compress-one.mjs public/assets/${path.basename(destJpg)}`);
  console.log('3. Verify visually: npm run dev (port 3333)');
}

main().catch(e => { console.error(e); process.exit(1); });

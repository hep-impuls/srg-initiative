/**
 * Focus Manifest Generator
 *
 * Parses React TSX files and extracts FocusRegion declarations.
 * Output is used by AI to understand available focus targets.
 *
 * Usage: npx ts-node scripts/generate-focus-manifest.ts src/pages/AgoraPage.tsx
 */

import * as fs from 'fs';
import * as path from 'path';

interface FocusRegionEntry {
  id: string;
  label: string;
  depth: number;
}

function extractFocusRegions(filePath: string): FocusRegionEntry[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const regions: FocusRegionEntry[] = [];

  // Regex to match FocusRegion components with id and label props
  // Handles both single-line and multi-line declarations
  const regex = /<FocusRegion[^>]*\sid=["']([^"']+)["'][^>]*\slabel=["']([^"']+)["'][^>]*>/g;
  const regexAlt = /<FocusRegion[^>]*\slabel=["']([^"']+)["'][^>]*\sid=["']([^"']+)["'][^>]*>/g;

  let match;

  // Match id before label
  while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    const label = match[2];
    const depth = (id.match(/__/g) || []).length;
    regions.push({ id, label, depth });
  }

  // Match label before id
  while ((match = regexAlt.exec(content)) !== null) {
    const label = match[1];
    const id = match[2];
    const depth = (id.match(/__/g) || []).length;
    // Avoid duplicates
    if (!regions.find(r => r.id === id)) {
      regions.push({ id, label, depth });
    }
  }

  // Sort by depth, then alphabetically
  regions.sort((a, b) => {
    if (a.depth !== b.depth) return a.depth - b.depth;
    return a.id.localeCompare(b.id);
  });

  return regions;
}

function generateManifest(inputPath: string): void {
  const absolutePath = path.resolve(inputPath);
  const regions = extractFocusRegions(absolutePath);

  // Derive output path: AgoraPage.tsx -> AgoraPage.focus-manifest.json
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const outputDir = path.join(path.dirname(absolutePath), '..', 'data');
  const outputPath = path.join(outputDir, `${baseName}.focus-manifest.json`);

  const manifest = {
    source: path.basename(inputPath),
    generated: new Date().toISOString(),
    totalRegions: regions.length,
    depthBreakdown: {
      depth0: regions.filter(r => r.depth === 0).length,
      depth1: regions.filter(r => r.depth === 1).length,
      depth2: regions.filter(r => r.depth === 2).length,
      depth3: regions.filter(r => r.depth === 3).length,
    },
    regions,
  };

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  console.log(`✓ Generated manifest: ${outputPath}`);
  console.log(`  Total regions: ${regions.length}`);
  console.log(`  Depth 0 (sections): ${manifest.depthBreakdown.depth0}`);
  console.log(`  Depth 1 (blocks): ${manifest.depthBreakdown.depth1}`);
  console.log(`  Depth 2 (elements): ${manifest.depthBreakdown.depth2}`);
  console.log(`  Depth 3 (details): ${manifest.depthBreakdown.depth3}`);
}

// CLI execution
const inputFile = process.argv[2];
if (!inputFile) {
  console.error('Usage: npx ts-node scripts/generate-focus-manifest.ts <path-to-page.tsx>');
  process.exit(1);
}

generateManifest(inputFile);

# FocusRegion System Migration Guide

## Project: SRG Audio-Guided Reports
## Document Version: 1.0
## Date: February 2026

---

## Executive Summary

This document outlines the migration of our audio-guided reports system to a new **FocusRegion architecture**. The goal is to reduce post-production friction when syncing audio narration with page content, making it easier for AI to generate accurate timeline configurations.

**Attachments:**
1. `FocusRegion-System-Plan.md` — The architectural design document
2. `focus-region-showcase.html` — Interactive visual demonstration

**Time Estimate:** 2-3 days for core implementation + 1 day for AgoraPage migration

---

## Problem Statement

### Current Pain Points

1. **Inconsistent ID naming**: IDs like `comparison-section`, `stat-deprivierte`, and `gatekeeper-infobox` follow no pattern. AI must guess what exists.

2. **No documentation of focusable regions**: When AI receives a transcript and page, it has no structured way to know what can be focused.

3. **Granularity ambiguity**: No clear way to distinguish between focusing on a whole section vs. a specific element within it.

4. **Manual timeline creation**: Each new unit requires extensive post-production to correct focus targets.

### Desired Outcome

- AI receives a **manifest of all focusable regions** with semantic labels
- IDs follow a **predictable hierarchical pattern**
- Focus can target **any granularity** (section → block → element → word)
- Timeline generation becomes **largely automated**

---

## Solution Overview

### The FocusRegion Component

A lightweight React wrapper that:
- Registers focusable regions with consistent IDs
- Provides depth metadata (0 = section, 1 = block, 2 = element, 3 = detail)
- Self-documents via `data-focus-label` attributes
- Enables auto-generation of focus manifests

### Visual Reference

Open `focus-region-showcase.html` in a browser to see:
- 7 layout patterns demonstrating different focus scenarios
- Color-coded depth levels (blue/purple/pink/orange)
- Interactive demo tour simulating the audio director
- Hover states showing focus labels

---

## Implementation Tasks

### Task 1: Create FocusRegion Component

**File:** `src/components/FocusRegion.tsx`

```tsx
import { ReactNode } from 'react';

interface FocusRegionProps {
  /** 
   * Unique identifier following the pattern:
   * - Depth 0: "section-name"
   * - Depth 1: "section__block"
   * - Depth 2: "section__block__element"
   * - Depth 3: "section__block__element__detail"
   */
  id: string;
  
  /**
   * Human-readable label describing what this region contains.
   * This appears in the focus manifest and helps AI understand context.
   * Should be in German for Swiss content.
   */
  label: string;
  
  /**
   * The content to wrap.
   */
  children: ReactNode;
  
  /**
   * Additional CSS classes. The component automatically adds `scroll-mt-24`.
   */
  className?: string;
  
  /**
   * Semantic HTML element to render. Defaults to 'div'.
   * Use 'section' for depth-0 regions, 'article' for standalone content, etc.
   */
  as?: keyof JSX.IntrinsicElements;
}

export function FocusRegion({ 
  id, 
  label, 
  children, 
  className = '',
  as: Component = 'div'
}: FocusRegionProps) {
  // Infer depth from ID pattern (count of "__" separators)
  const depth = (id.match(/__/g) || []).length;
  
  return (
    <Component
      id={id}
      data-focus-label={label}
      data-focus-depth={depth}
      className={`scroll-mt-24 ${className}`}
    >
      {children}
    </Component>
  );
}
```

**Key Implementation Notes:**

1. **Depth is inferred from ID**: No need to pass depth explicitly. The pattern `section__block__element` automatically yields depth 2.

2. **`scroll-mt-24` is mandatory**: This ensures focused elements aren't hidden behind the header when scrolled into view.

3. **`data-focus-label`**: This attribute is used by the manifest generator AND can be read at runtime for debugging.

4. **`data-focus-depth`**: Useful for styling and debugging. The HTML showcase uses this for color-coding.

---

### Task 2: Create Focus Manifest Generator Script

**File:** `scripts/generate-focus-manifest.ts`

This script parses a page's TSX file and extracts all FocusRegion declarations into a JSON manifest.

```typescript
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
```

**Add to `package.json`:**

```json
{
  "scripts": {
    "manifest": "ts-node scripts/generate-focus-manifest.ts",
    "manifest:agora": "ts-node scripts/generate-focus-manifest.ts src/pages/AgoraPage.tsx"
  }
}
```

---

### Task 3: Update useAudioDirector Hook

**File:** `src/hooks/useAudioDirector.ts`

No major changes required. The hook already supports:
- `focusId` (single target)
- `focusIds` (multiple targets)

**Minor enhancement:** Add debug logging for development:

```typescript
// Inside findCurrentCue or the timeupdate handler:
if (process.env.NODE_ENV === 'development') {
  console.log(`[AudioDirector] Cue: ${cue.label} → Focus: ${cue.focusIds?.join(', ') || cue.focusId}`);
}
```

---

### Task 4: Migrate AgoraPage.tsx

This is the largest task. Every focusable element needs to be wrapped in `FocusRegion`.

#### Migration Strategy

1. **Work section by section**: Start with the Theory tab, then Data, then Consequences.

2. **Follow the ID pattern strictly**:
   ```
   theory                          // Depth 0: The entire Theory tab
   theory__intro                   // Depth 1: Introduction section
   theory__intro__headline         // Depth 2: The headline
   theory__intro__text             // Depth 2: The intro paragraph
   theory__intro__image            // Depth 2: The hero image
   theory__comparison              // Depth 1: Comparison section
   theory__comparison__left        // Depth 2: Left card (Früher)
   theory__comparison__left__title // Depth 3: Card title
   theory__comparison__left__points// Depth 3: Bullet points
   theory__comparison__right       // Depth 2: Right card (Heute)
   ```

3. **Label in German**: Labels should match what the audio narrator would say.

#### Example Migration

**Before:**
```tsx
<div id="comparison-section" className="scroll-mt-24 py-6 border-b border-slate-50">
  <h3 className="text-lg font-bold mb-4 text-center text-slate-700">
    Der Wandel: Ein Vergleich
  </h3>
  <div className="grid md:grid-cols-2 gap-4 relative">
    <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
      <h4 className="text-center font-bold text-slate-700 mb-1">Das "Lagerfeuer"</h4>
      <ul className="space-y-3 text-sm text-slate-600">
        <li>Alle sehen das Gleiche</li>
        <li>Journalisten filtern Fakten</li>
      </ul>
    </div>
    <div className="bg-blue-50/50 p-4 rounded-2xl border-2 border-blue-100">
      <h4 className="text-center font-bold text-blue-900 mb-1">Der "Eigene Tunnel"</h4>
      <ul className="space-y-3 text-sm text-slate-700">
        <li>Jeder sieht etwas anderes</li>
        <li>Algorithmen entscheiden</li>
      </ul>
    </div>
  </div>
</div>
```

**After:**
```tsx
<FocusRegion 
  id="theory__comparison" 
  label="Der Wandel: Ein Vergleich" 
  className="py-6 border-b border-slate-50"
>
  <h3 className="text-lg font-bold mb-4 text-center text-slate-700">
    Der Wandel: Ein Vergleich
  </h3>
  <div className="grid md:grid-cols-2 gap-4 relative">
    <FocusRegion 
      id="theory__comparison__left" 
      label="Das Lagerfeuer (Früher)" 
      className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100"
    >
      <FocusRegion 
        id="theory__comparison__left__title" 
        label="Lagerfeuer Titel"
        as="h4"
        className="text-center font-bold text-slate-700 mb-1"
      >
        Das "Lagerfeuer"
      </FocusRegion>
      <FocusRegion 
        id="theory__comparison__left__points" 
        label="Lagerfeuer Punkte"
        as="ul"
        className="space-y-3 text-sm text-slate-600"
      >
        <li>Alle sehen das Gleiche</li>
        <li>Journalisten filtern Fakten</li>
      </FocusRegion>
    </FocusRegion>
    
    <FocusRegion 
      id="theory__comparison__right" 
      label="Der eigene Tunnel (Heute)" 
      className="bg-blue-50/50 p-4 rounded-2xl border-2 border-blue-100"
    >
      <FocusRegion 
        id="theory__comparison__right__title" 
        label="Tunnel Titel"
        as="h4"
        className="text-center font-bold text-blue-900 mb-1"
      >
        Der "Eigene Tunnel"
      </FocusRegion>
      <FocusRegion 
        id="theory__comparison__right__points" 
        label="Tunnel Punkte"
        as="ul"
        className="space-y-3 text-sm text-slate-700"
      >
        <li>Jeder sieht etwas anderes</li>
        <li>Algorithmen entscheiden</li>
      </FocusRegion>
    </FocusRegion>
  </div>
</FocusRegion>
```

#### Decision Guide: When to Create a FocusRegion

| Scenario | Create FocusRegion? | Depth |
|----------|---------------------|-------|
| Tab content container | Yes | 0 |
| Major visual section | Yes | 0 |
| Card or info box | Yes | 1 |
| Image with caption | Yes | 1 |
| Headline within section | Maybe (if narrator references it) | 2 |
| Paragraph of text | Maybe (if narrator explains it specifically) | 2 |
| Single stat value | Yes (stat cards are often focused individually) | 1-2 |
| Bullet point list | Yes (often explained point by point) | 2 |
| Individual keyword | Rarely (only if narrator emphasizes it) | 3 |
| Decorative elements | No | — |
| Navigation/UI chrome | No | — |

---

### Task 5: Update AgoraPage.json Timeline

After migrating the TSX, update the timeline JSON to use new IDs:

**Before:**
```json
{
  "seconds": 16,
  "tab": "theory",
  "focusId": "comparison-section",
  "label": "Lagerfeuer vs. Tunnel",
  "isChapter": true
}
```

**After:**
```json
{
  "seconds": 16,
  "tab": "theory",
  "focusId": "theory__comparison",
  "label": "Lagerfeuer vs. Tunnel",
  "isChapter": true
},
{
  "seconds": 22,
  "tab": "theory",
  "focusId": "theory__comparison__left",
  "label": "Das Lagerfeuer"
},
{
  "seconds": 28,
  "tab": "theory",
  "focusIds": ["theory__comparison__left__points"],
  "label": "Alle sehen das Gleiche"
}
```

---

### Task 6: Add Dev Tools (Optional but Recommended)

#### Focus Region Debugger

Add a development overlay that shows all focusable regions:

**File:** `src/components/FocusDebugger.tsx`

```tsx
import { useState, useEffect } from 'react';

export function FocusDebugger() {
  const [regions, setRegions] = useState<HTMLElement[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      const elements = document.querySelectorAll('[data-focus-label]');
      setRegions(Array.from(elements) as HTMLElement[]);
    }
  }, [visible]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      <button
        onClick={() => setVisible(!visible)}
        style={{
          position: 'fixed',
          bottom: '6rem',
          right: '1rem',
          zIndex: 9999,
          padding: '0.5rem 1rem',
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.75rem',
        }}
      >
        {visible ? 'Hide' : 'Show'} Focus Regions
      </button>
      
      {visible && regions.map((el) => {
        const rect = el.getBoundingClientRect();
        const depth = el.dataset.focusDepth || '0';
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];
        
        return (
          <div
            key={el.id}
            style={{
              position: 'fixed',
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              border: `2px solid ${colors[parseInt(depth)]}`,
              pointerEvents: 'none',
              zIndex: 9998,
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '-1.5rem',
                left: '0.5rem',
                background: colors[parseInt(depth)],
                color: 'white',
                padding: '0.125rem 0.5rem',
                fontSize: '0.625rem',
                fontFamily: 'monospace',
                borderRadius: '0.25rem',
                whiteSpace: 'nowrap',
              }}
            >
              {el.id}
            </span>
          </div>
        );
      })}
    </>
  );
}
```

---

## File Structure After Migration

```
src/
├── components/
│   ├── FocusRegion.tsx          ← NEW
│   ├── FocusDebugger.tsx        ← NEW (optional)
│   ├── AudioPlayer.tsx
│   ├── AudioControls.tsx
│   └── ...
├── data/
│   ├── AgoraPage.json           ← UPDATED (new IDs)
│   └── AgoraPage.focus-manifest.json  ← NEW (auto-generated)
├── pages/
│   └── AgoraPage.tsx            ← MIGRATED
├── hooks/
│   └── useAudioDirector.ts      ← MINOR UPDATES
└── ...

scripts/
└── generate-focus-manifest.ts   ← NEW
```

---

## Testing Checklist

### Unit Tests

- [ ] FocusRegion renders correct HTML attributes
- [ ] Depth is correctly inferred from ID pattern
- [ ] Manifest generator extracts all regions from sample file

### Integration Tests

- [ ] Audio director finds elements by new IDs
- [ ] Spotlight effect works with FocusRegion elements
- [ ] Multi-focus (`focusIds`) highlights multiple FocusRegions

### Manual Testing

- [ ] Run `npm run manifest:agora` and verify output
- [ ] Play through entire audio with new timeline
- [ ] Verify each focus target is correctly highlighted
- [ ] Test on tablet viewport (secondary priority)
- [ ] Confirm no visual regressions

---

## Migration Sequence

1. **Day 1 Morning:** Implement `FocusRegion` component + manifest generator
2. **Day 1 Afternoon:** Migrate Theory tab of AgoraPage
3. **Day 2 Morning:** Migrate Data tab + Consequences tab
4. **Day 2 Afternoon:** Update `AgoraPage.json` timeline with new IDs
5. **Day 3:** Testing, bug fixes, documentation updates

---

## Future Considerations

### For New Pages

Once this system is in place, creating new pages follows this workflow:

1. AI generates page draft with FocusRegions
2. Editorial review and adjustments
3. Run `npm run manifest` to generate focus manifest
4. Generate audio with NotebookLM
5. AI receives manifest + transcript → generates timeline JSON
6. Final review and publish

### Potential Enhancements

- **Visual manifest editor**: Web UI to view/edit focus regions
- **Timeline validator**: Script to verify all timeline IDs exist in manifest
- **Auto-depth styling**: CSS that color-codes regions by depth in dev mode

---

## Questions?

Contact Pietro or refer to:
- `focus-region-showcase.html` for visual examples
- `FocusRegion-System-Plan.md` for architectural decisions
- `.claude/architecture.md` for existing system documentation

---

*Document prepared for SWE team handoff — February 2026*

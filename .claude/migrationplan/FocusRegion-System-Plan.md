# FocusRegion System — Architectural Plan

## Project: SRG Audio-Guided Reports
## Author: Pietro / Claude
## Date: February 2026

---

## 1. Problem Analysis

### Current Workflow

1. **Deep search with AI** (10min) — Generate raw content
2. **Generate React first draft** (10min) — Create page structure
3. **Generate audio guides** (10min) — NotebookLM creates narration + images
4. **Sync transcript with page** — AI maps audio timestamps to page elements

### Pain Point

Step 4 requires extensive post-production because:
- Page IDs are inconsistent and undocumented
- AI must guess which elements can be focused
- No clear granularity system (section vs. element vs. word)
- Each new unit requires manual ID hunting

### Goal

Reduce post-production friction by making focusable regions **self-documenting** and **predictable**.

---

## 2. Solution: FocusRegion Architecture

### Core Concept

Wrap focusable page content in a `<FocusRegion>` component that:
- Uses a **hierarchical ID pattern** (`section__block__element`)
- Includes a **human-readable label** for AI context
- **Auto-infers depth** from the ID structure
- Enables **manifest generation** for AI consumption

### The ID Pattern

```
{section}__{block}__{element}__{detail}
   ↓         ↓         ↓          ↓
Depth 0   Depth 1   Depth 2    Depth 3
```

**Examples:**
| ID | Depth | What it focuses |
|----|-------|-----------------|
| `theory` | 0 | Entire Theory tab |
| `theory__comparison` | 1 | The comparison section |
| `theory__comparison__left` | 2 | Left card only |
| `theory__comparison__left__title` | 3 | Just the card title |

### Focus Granularity

The system supports focusing at any level:

```
┌─────────────────────────────────────────────────────┐
│ theory (Depth 0)                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ theory__comparison (Depth 1)                     │ │
│ │ ┌─────────────────┐ ┌─────────────────────────┐ │ │
│ │ │ theory__        │ │ theory__                │ │ │
│ │ │ comparison__    │ │ comparison__right       │ │ │
│ │ │ left (Depth 2)  │ │ (Depth 2)               │ │ │
│ │ │ ┌─────────────┐ │ │                         │ │ │
│ │ │ │ __left__    │ │ │                         │ │ │
│ │ │ │ title (D3)  │ │ │                         │ │ │
│ │ │ └─────────────┘ │ │                         │ │ │
│ │ └─────────────────┘ └─────────────────────────┘ │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 3. Component Design

### FocusRegion Props

```typescript
interface FocusRegionProps {
  id: string;        // Hierarchical ID (e.g., "theory__comparison__left")
  label: string;     // Human-readable label in German
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;  // 'div' | 'section' | 'article' | etc.
}
```

### Rendered Output

```tsx
<FocusRegion id="theory__comparison" label="Der Wandel: Ein Vergleich">
  ...
</FocusRegion>

// Renders:
<div 
  id="theory__comparison"
  data-focus-label="Der Wandel: Ein Vergleich"
  data-focus-depth="1"
  class="scroll-mt-24"
>
  ...
</div>
```

### Nesting Behavior

FocusRegions can nest to any depth:

```tsx
<FocusRegion id="stats" label="Statistiken">           {/* Depth 0 */}
  <FocusRegion id="stats__card1" label="46% Card">     {/* Depth 1 */}
    <FocusRegion id="stats__card1__value" label="Zahl"> {/* Depth 2 */}
      46%
    </FocusRegion>
  </FocusRegion>
</FocusRegion>
```

---

## 4. Focus Manifest

### Purpose

A JSON file listing all focusable regions in a page. AI uses this to:
1. Know what can be focused
2. Understand the label/description of each region
3. Choose appropriate granularity based on transcript

### Generation

Run a script that parses the TSX file:

```bash
npm run manifest:agora
# Output: src/data/AgoraPage.focus-manifest.json
```

### Schema

```json
{
  "source": "AgoraPage.tsx",
  "generated": "2026-02-03T10:00:00Z",
  "totalRegions": 47,
  "depthBreakdown": {
    "depth0": 5,
    "depth1": 18,
    "depth2": 20,
    "depth3": 4
  },
  "regions": [
    { "id": "theory", "label": "Theorie Tab", "depth": 0 },
    { "id": "theory__intro", "label": "Einleitung", "depth": 1 },
    { "id": "theory__intro__headline", "label": "Headline", "depth": 2 },
    { "id": "theory__intro__text", "label": "Intro Text", "depth": 2 },
    { "id": "theory__comparison", "label": "Lagerfeuer vs. Tunnel", "depth": 1 },
    { "id": "theory__comparison__left", "label": "Das Lagerfeuer", "depth": 2 },
    { "id": "theory__comparison__right", "label": "Der eigene Tunnel", "depth": 2 },
    ...
  ]
}
```

---

## 5. Timeline Generation

### AI Prompt Template

When syncing audio to page, AI receives:

1. **The focus manifest** (all available targets)
2. **The transcript with timestamps**
3. **Rules for granularity selection**

### Granularity Rules

| Speaker Action | Focus Depth |
|----------------|-------------|
| "Schauen wir uns den Vergleich an" | Depth 1 (whole section) |
| "Auf der linken Seite..." | Depth 2 (left card) |
| "Der Begriff Lagerfeuer bedeutet..." | Depth 2-3 (specific element) |
| "Wut und Freude binden dich..." | Depth 3 (keywords) |
| Comparing two things | Multi-focus: both elements |

### Output Example

```json
{
  "timeline": [
    {
      "seconds": 16,
      "tab": "theory",
      "focusId": "theory__comparison",
      "label": "Der Wandel: Ein Vergleich",
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
      "focusIds": ["theory__comparison__left", "theory__comparison__right"],
      "label": "Früher vs. Heute"
    }
  ]
}
```

---

## 6. Visual Design

### Depth Color Coding (Development Mode)

| Depth | Color | Use Case |
|-------|-------|----------|
| 0 | Blue (#3b82f6) | Sections, tabs |
| 1 | Purple (#8b5cf6) | Cards, info boxes |
| 2 | Pink (#ec4899) | Specific elements |
| 3 | Orange (#f97316) | Keywords, details |

### Focus Effect

When a region is focused:
1. SVG overlay dims the page (50% black)
2. "Hole" is cut around the focused element(s)
3. Focused element gets a subtle glow
4. Page smoothly scrolls to center the element

---

## 7. Layout Patterns

The system supports any layout. Common patterns:

### Pattern 1: Hero + Text
```
┌─────────────────────────────────────┐
│ section (Depth 0)                   │
│ ┌───────────┐ ┌───────────────────┐ │
│ │ image     │ │ text              │ │
│ │ (Depth 1) │ │ (Depth 1)         │ │
│ │           │ │ ┌───────────────┐ │ │
│ │           │ │ │ headline (D2) │ │ │
│ │           │ │ └───────────────┘ │ │
│ └───────────┘ └───────────────────┘ │
└─────────────────────────────────────┘
```

### Pattern 2: Comparison Split
```
┌─────────────────────────────────────┐
│ comparison (Depth 0)                │
│ ┌───────────────┐ ┌───────────────┐ │
│ │ left (D1)     │ │ right (D1)    │ │
│ │ ┌───────────┐ │ │ ┌───────────┐ │ │
│ │ │ title (D2)│ │ │ │ title (D2)│ │ │
│ │ └───────────┘ │ │ └───────────┘ │ │
│ │ ┌───────────┐ │ │ ┌───────────┐ │ │
│ │ │ points(D2)│ │ │ │ points(D2)│ │ │
│ │ └───────────┘ │ │ └───────────┘ │ │
│ └───────────────┘ └───────────────┘ │
└─────────────────────────────────────┘
```

### Pattern 3: Stats Grid
```
┌─────────────────────────────────────┐
│ stats (Depth 0)                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ card1   │ │ card2   │ │ card3   │ │
│ │ (D1)    │ │ (D1)    │ │ (D1)    │ │
│ └─────────┘ └─────────┘ └─────────┘ │
└─────────────────────────────────────┘
```

### Pattern 4: Inline Text Focus
```
┌─────────────────────────────────────┐
│ paragraph (Depth 1)                 │
│                                     │
│ "Der Algorithmus will dich nicht    │
│ informieren, sondern ┌───────────┐  │
│                      │ bestätigen│  │
│                      │ (Depth 2) │  │
│                      └───────────┘  │
│ Wut und Freude binden dich..."      │
└─────────────────────────────────────┘
```

---

## 8. Workflow Integration

### New Page Creation Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 1. Research │───▶│ 2. Draft    │───▶│ 3. Editorial│
│    (AI)     │    │    (AI)     │    │    Review   │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                             │
                   ┌─────────────────────────┘
                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 4. Generate │───▶│ 5. Generate │───▶│ 6. AI Sync  │
│    Manifest │    │    Audio    │    │   Timeline  │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                             │
                   ┌─────────────────────────┘
                   ▼
              ┌─────────────┐
              │ 7. Publish  │
              └─────────────┘
```

### Step Details

| Step | Actor | Input | Output |
|------|-------|-------|--------|
| 1 | AI | Topic | Raw content |
| 2 | AI | Content + FocusRegion guidelines | Page.tsx draft |
| 3 | Human | Draft | Reviewed Page.tsx |
| 4 | Script | Page.tsx | focus-manifest.json |
| 5 | NotebookLM | Content | Audio + Transcript |
| 6 | AI | Manifest + Transcript | Page.json timeline |
| 7 | Human | All files | Published unit |

---

## 9. Benefits Summary

| Before | After |
|--------|-------|
| AI guesses which IDs exist | AI has complete manifest |
| Inconsistent ID patterns | Predictable hierarchy |
| No label documentation | Every region has a label |
| Post-production: hunt for IDs | Post-production: pick from list |
| Focus only on containers | Focus on any element including text |
| Hard to explain to AI | Clear rules for granularity |

---

## 10. Visual Showcase

See `focus-region-showcase.html` for an interactive demonstration of:

- All layout patterns
- Depth-based color coding
- Hover labels
- Simulated audio tour
- Multi-focus capability
- Generated manifest preview

---

## 11. Open Questions

1. **Should depth be explicit or inferred?**
   - Current design: Inferred from ID pattern
   - Alternative: Explicit `depth` prop

2. **Maximum nesting depth?**
   - Current design: 4 levels (0-3)
   - Could be unlimited, but UI gets complex

3. **Should regions be required to nest?**
   - Current: Optional (sibling regions allowed)
   - Alternative: Strict parent-child enforcement

4. **Dev tools scope?**
   - Minimal: Just the manifest generator
   - Expanded: Visual debugger, timeline validator, etc.

---

*Plan prepared for SWE team implementation — February 2026*

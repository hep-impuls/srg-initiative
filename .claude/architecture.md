# System Architecture

## High-Level Pattern
The application uses a **Director/Actor** pattern. 
- **The Director:** `useAudioDirector` hook. It owns the time and the intent.
- **The Actor:** The UI (Page Components) and **Interaction Engine** (Firebase-powered).
- **The Script:** `*.json` configuration files in `src/data/`.

## Data Flow
1. **Route:** User visits `/#/report/solar`.
2. **Shell:** `ReportShell.tsx` detects slug `solar`.
3. **Registry:** Shell looks up `solar` in `PAGE_REGISTRY` to find the correct React Component (e.g., `SolarPage.tsx`).
4. **Config:** Shell dynamically imports `@/data/SolarPage.json`.
5. **Normalization:** Data is passed through `swissifyData` to enforce `ss` over `ß`.
6. **Initialization:** The Page Component initializes `useAudioDirector` with the timeline from the JSON.
7. **Loop:** Audio `timeupdate` event -> `findCurrentCue` -> `activeElementIds` -> DOM manipulation.

## Core Components

### 1. `ReportShell.tsx` (The Factory)
Acts as the dynamic loader. It handles 404s, loading states, and passes the configuration `PageConfig` down to the specific report component.

### 2. `useAudioDirector.ts` (The Engine)
Manages the synchronization loop.
- **SVG Overlay:** Uses a full-screen SVG with `fill-rule="evenodd"` to draw a "hole" around `activeElementIds`. This bypasses CSS `z-index` stacking context wars.
- **Scroll Lock:** Integrates with `useScrollLock` to yield control when the user touches the screen.

### 3. `FocusRegion.tsx` (The Wrapper Component)
A lightweight React component that wraps focusable page elements.

**Purpose:**
- Provides consistent hierarchical IDs (`section__block__element`)
- Self-documents with German labels via `data-focus-label`
- Auto-calculates depth from ID pattern
- Enables manifest generation for AI timeline creation

**Props:**
```typescript
interface FocusRegionProps {
  id: string;        // e.g., "theory__intro__text"
  label: string;     // e.g., "Intro Text"
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;  // default: 'div'
}
```

**Depth Inference:**
- `theory` → depth 0 (section)
- `theory__intro` → depth 1 (block)
- `theory__intro__text` → depth 2 (element)
- `theory__intro__text__highlight` → depth 3 (detail)

### 4. Interaction Engine (`src/components/interactions/`)
Ein hybrides System für Engagement.
- **Static Config**: Fragen und Optionen in `src/data/interactions/*.json`.
- **Dynamic State**: Echtzeit-Ergebnisse via Firebase Firestore.
- **Sync**: Nutzt `useInteractionDirector` um Abstimmungs-Phasen mit der Audio-Zeit zu koppeln.

### 5. Page Components (e.g., `AgoraPage.tsx`)
These are purely presentational. They must:
- Accept `PageConfig` props.
- Wrap focusable content with **FocusRegion components** using hierarchical IDs.
- Pass the `directorState` to the `AudioPlayer`.

**Example:**
```tsx
<FocusRegion id="theory__intro" label="Einleitung">
  <h2>Wie wir miteinander reden</h2>
  <p>Früher bestimmten Zeitungsredaktionen...</p>
</FocusRegion>
```

## Focus Manifest System

### Generation
Run the manifest generator to extract all FocusRegions:
```bash
npm run manifest:agora
# Outputs: src/data/AgoraPage.focus-manifest.json
```

### Manifest Schema
```json
{
  "source": "AgoraPage.tsx",
  "generated": "2026-02-03T10:00:00Z",
  "totalRegions": 19,
  "depthBreakdown": {
    "depth0": 1,
    "depth1": 12,
    "depth2": 6,
    "depth3": 0
  },
  "regions": [
    { "id": "theory__intro", "label": "Einleitung", "depth": 1 },
    { "id": "theory__comparison__left", "label": "Das Lagerfeuer", "depth": 2 }
  ]
}
```

**Benefits:**
- AI can see all available focus targets
- Predictable ID patterns reduce post-production time
- Self-documenting labels provide context for timeline generation

## Registry Pattern (Adding Pages)
To add a new page, one must:
1. Create `src/data/NewPage.json`.
2. Create `src/pages/NewPage.tsx` with FocusRegion components.
3. Generate manifest: `npm run manifest:newpage`.
4. Register the mapping in `ReportShell.tsx`: `const PAGE_REGISTRY = { 'new-topic': NewPage }`.
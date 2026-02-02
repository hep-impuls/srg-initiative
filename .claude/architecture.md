# System Architecture

## High-Level Pattern
The application uses a **Director/Actor** pattern. 
- **The Director:** `useAudioDirector` hook. It owns the time and the intent.
- **The Actor:** The UI (Page Components). It reacts to the Director's state (scrolling, highlighting).
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

### 3. Page Components (e.g., `AgoraPage.tsx`)
These are purely presentational. They must:
- Accept `PageConfig` props.
- Render DOM elements with **IDs matching the JSON timeline**.
- Pass the `directorState` to the `AudioPlayer`.

## Registry Pattern (Adding Pages)
To add a new page, one must:
1. Create `src/data/NewPage.json`.
2. Create `src/pages/NewPage.tsx`.
3. Register the mapping in `ReportShell.tsx`: `const PAGE_REGISTRY = { 'new-topic': NewPage }`.
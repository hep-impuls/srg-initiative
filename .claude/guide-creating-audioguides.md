# Audioguide Creation Guide

This guide explains how to create an interactive audio guide page using the **FocusRegion System**, based on the implementation in `AgoraPage.tsx`.

## 1. System Overview

The audioguide system synchronizes an audio track with visual elements on the page. As the audio plays, specific parts of the page ("Focus Regions") are highlighted and scrolled into view.

**Key Components:**
1.  **React Component (`SrcPage.tsx`)**: Defines the visual structure and marks focusable areas.
2.  **Manifest (`*.focus-manifest.json`)**: Auto-generated list of all focusable IDs.
3.  **Timeline Configuration (`*.json`)**: Maps audio timestamps to these IDs.
4.  **Audio File (`*.mp3`)**: The actual narration.

---

## 2. Step-by-Step Workflow

### Step 1: Structure Your Page (React)

When building your page (e.g., `AgoraPage.tsx`), you wrap every element that should be focusable in a `<FocusRegion>` component.

**Key Requirement:** Use a **hierarchical ID naming convention** (`section__block__element`) to define the structure.

*   `depth_1` (e.g., `theory__intro`): Major sections.
*   `depth_2` (e.g., `theory__intro__text`): Specific content blocks within a section.

**Example:**
```tsx
import { FocusRegion } from '@/components/FocusRegion';

// ... inside your component
<FocusRegion id="theory__intro" label="Einleitung">
  {/* Depth 2: Text Block */}
  <FocusRegion id="theory__intro__text" label="Intro Text">
    <h2>Headline</h2>
    <p>Content...</p>
  </FocusRegion>
  
  {/* Depth 2: Image Block */}
  <FocusRegion id="theory__intro__image" label="Intro Image">
    <img src="..." />
  </FocusRegion>
</FocusRegion>
```

**Tabs Handling:**
If your page has tabs (like `AgoraPage`), you need to handle tab switching manually in the timeline (see Step 3), but the structure remains the same. The `AgoraPage` uses `activeTab` state to conditionally render content.

### Step 2: Generate the Manifest

Once your React code is ready, run the script to generate a manifest. this scans your file and lists all available IDs.

```bash
npm run manifest:agora  # (Or the generic command if configured)
```

**Output:** `src/data/AgoraPage.focus-manifest.json`
This file is for your reference (and for AI tools). It confirms which IDs are available for the timeline.

### Step 3: Create the Tour Timeline (JSON)

Create or edit the configuration file (e.g., `src/data/AgoraPage.json`). This connects your audio to the UI.

**Structure:**
*   `seconds`: When this event happens (in seconds).
*   `focusId`: The ID of the `FocusRegion` to highlight.
*   `label`: Display text for the current chapter/step.
*   `tab`: (Optional) Forces the UI to switch to a specific tab (e.g., "theory", "data") to ensure the element is visible.
*   `isChapter`: (Optional) Marks this point as a navigable chapter in the player.

**Example (`AgoraPage.json`):**
```json
{
  "timeline": [
    {
      "seconds": 11,
      "tab": "theory",          // Ensure we are on the 'Theory' tab
      "focusId": "theory__intro", // Highlight the whole intro section
      "label": "Einleitung"
    },
    {
      "seconds": 33,
      "tab": "theory",
      "focusId": "theory__agora",
      "label": "Was bedeutet Agora?",
      "isChapter": true         // Show a tick mark on the player
    }
  ]
}
```

### Step 4: Record & Link Audio

1.  Record your audio script.
2.  Save the file (typically in `public/audio/`).
3.  Ensure your Page Config points to this audio file (usually handled in the main configuration or passed as a prop).

---

## 3. How to Know "Where Focuses Are Set"?

If you are tasked with understanding an existing tour:

1.  **Check `AgoraPage.json`**: This is the "script". It tells you exactly *what* gets highlighted and *when*.
    *   Look at `tab`: Tells you which high-level view is active.
    *   Look at `focusId`: Tells you which specific element is targeted.
2.  **Check `AgoraPage.tsx`**: Search for the `id="..."` matching the `focusId` to see the actual visual content.
3.  **Check the Manifest**: `src/data/AgoraPage.focus-manifest.json` gives you a flat list of all *possible* focus points, organized by depth.

## 4. Best Practices

*   **Granularity**: Use nested regions (`depth_2`) for specific details (like a specific chart bar or a definition), but default to the parent section (`depth_1`) for general talking points.
*   **Labels**: Give your `FocusRegion`s clear, German `label` props. These show up in debug tools and help AI helpers understand the context.
*   **Tabs**: If you switch tabs in the JSON, make sure the React component logic actually renders that tab's content!.

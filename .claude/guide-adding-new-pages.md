# Adding New Report Pages

This guide outlines the strict technical workflow for adding a new audio-guided report page to the project.

## Architecture Overview

The system uses a dynamic loader (`ReportShell`) that routes URLs to specific page components and configurations.

**Flow:** URL (`/report/slug`) -> `ReportShell` -> Registry Lookup -> `SlugPage.tsx` + `SlugPage.json`

---

## Step 1: Configuration (JSON)

Create a configuration file in `src/data/`.

**Naming Convention:** `<CamelCaseName>.json` (e.g., `PublicMediaPage.json`)

```json
{
  "title": "Report Title",
  "audioSrc": "audio/your-audio-file.mp3",
  "timeline": []
}
```

*   `audioSrc`: Relative path from `public/`.
*   `timeline`: Array of cues (see `guide-creating-audioguides.md` for details).

---

## Step 2: Page Component (React)

Create your component in `src/pages/`.

**Requirements:**
1.  Export a named component.
2.  Accept `config: PageConfig` as a prop.
3.  Initialize `useAudioDirector`.
4.  Render `FocusRegion` components for all interactive elements.

**Template:**

```tsx
import React from 'react';
import { PageConfig } from '@/types';
import { useAudioDirector } from '@/hooks/useAudioDirector';
import { AudioPlayer } from '@/components/AudioPlayer';
import { FocusRegion } from '@/components/FocusRegion';

interface MyPageProps {
    config: PageConfig;
}

export function MyPage({ config }: MyPageProps) {
    // 1. Initialize Audio Director
    const directorState = useAudioDirector(config.timeline);
    
    // 2. Derive active tab/state (Automatic vs Manual)
    const activeTab = directorState.currentTab || 'defaultTab';

    return (
        <div className="pb-24"> {/* Padding for Audio Player */}
            
            {/* 3. Wrap content in FocusRegions */}
            <FocusRegion id="my_section" label="My Section">
                <h1>Title</h1>
            </FocusRegion>

            {/* 4. Audio Player (Must be present) */}
            <AudioPlayer 
                audioSrc={config.audioSrc || ''} 
                directorState={directorState} 
            />
        </div>
    );
}
```

---

## Step 3: Registration (Router)

You must register your new page in the `ReportShell`.

**File:** `src/components/ReportShell.tsx`

1.  **Import** your component:
    ```typescript
    import { MyPage } from '@/pages/MyPage';
    ```

2.  **Add to Registry**:
    The key **MUST** match the URL slug provided in the JSON filename or intended route.
    
    ```typescript
    const PAGE_REGISTRY: Record<string, React.ComponentType<{ config: PageConfig }>> = {
        'agora': AgoraPage,
        'publicMedia': PublicMediaPage,
        'my-new-slug': MyPage, //  <-- Add this
    };
    ```

---

## Step 4: Verification

1.  Navigate to `http://localhost:5173/#/report/my-new-slug`.
2.  **Success:** Page loads, Audio Player appears at bottom.
3.  **Failure (Flashing Red):** Check console. Usually means `config` prop is undefined because the JSON file wasn't loaded or the keys don't match.

---

## Troubleshooting

### "Flashing Red" / TypeScript Errors
*   **Cause:** The component is trying to access `config.timeline` but `config` is undefined.
*   **Fix:** Ensure your component handles the loading state or that `ReportShell` is correctly passing the config. `ReportShell` handles the loading state (renders "Loading..."), so if you see this, it often means the *Slug*->*JSON* mapping failed.

### 404 Not Found
*   **Cause:** The URL slug does not match any key in `PAGE_REGISTRY`.
*   **Fix:** Check `ReportShell.tsx` registry keys.

### Audio Player Empty
*   **Cause:** `audioSrc` in JSON is missing or incorrect.
*   **Fix:** Check `public/audio/` folder and JSON config.

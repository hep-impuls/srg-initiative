# Audio-Guided Reports (SRG Initiative)

An interactive storytelling engine that synchronizes audio narration with on-screen scrolling and highlighting. Built for Swiss Public Media.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm

### Installation
```bash
git clone <repo-url>
npm install
```

### Development
```bash
npm run dev
# Opens http://localhost:3000/#/report/agora
```

## 📖 How to Add a New Report

The system is designed to host multiple independent reports accessible via `/#/report/:slug`.

### Step 1: The Content (JSON)
Create a new config file in `src/data/MyTopicPage.json`.

```json
{
  "title": "My Topic Title",
  "timeline": [
    {
      "seconds": 0,
      "tab": "intro",
      "focusId": "intro__headline",
      "label": "Start"
    }
  ]
}
```

### Step 2: The Audio
Place your MP3 file in `public/audio/MyTopicPage.mp3`. Note: The filename usually matches the JSON key by convention, but can be overridden in the config.

### Step 3: The Component with FocusRegions
Create `src/pages/MyTopicPage.tsx`. Use the **FocusRegion** component to wrap focusable elements with hierarchical IDs.

```typescript
import { FocusRegion } from '@/components/FocusRegion';

export function MyTopicPage({ config }: { config: PageConfig }) {
  const directorState = useAudioDirector(config.timeline);
  return (
    <div>
      <FocusRegion id="intro__headline" label="Einleitung">
        <h1>{config.title}</h1>
      </FocusRegion>
      <AudioPlayer directorState={directorState} audioSrc={config.audioSrc} />
    </div>
  );
}
```

**FocusRegion Pattern:**
- Use hierarchical IDs: `section__block__element`
- Depth is inferred from `__` separators (e.g., `theory__intro__text` = depth 2)
- Add German labels for AI context
- Generate manifest: `npm run manifest:mytopic`

### Step 4: The Registry
Open `src/components/ReportShell.tsx` and register your new page:

```typescript
import { MyTopicPage } from '@/pages/MyTopicPage';

const PAGE_REGISTRY = {
    'agora': AgoraPage,
    'my-topic': MyTopicPage, // <-- Add this line
};
```

Now accessible at: `http://localhost:3000/#/report/my-topic`

## 🏗 Architecture & Rules

For AI Agents and Developers, please read the `.claude/` folder before making structural changes.

- `.claude/rules.md`: Project constitution and Swiss content rules
- `.claude/architecture.md`: Explanation of the Audio Director loop and FocusRegion system
- `.claude/design-system.md`: Z-index strategies and visual guidelines
- `.claude/migrationplan/`: FocusRegion migration guide and system plan

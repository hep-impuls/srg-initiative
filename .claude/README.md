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
Development
Bash
npm run dev
# Opens http://localhost:3000/#/report/agora
📖 How to Add a New Report
The system is designed to host multiple independent reports accessible via /#/report/:slug.

Step 1: The Content (JSON)
Create a new config file in src/data/MyTopicPage.json.

JSON
{
  "title": "My Topic Title",
  "timeline": [
    {
      "seconds": 0,
      "tab": "intro",
      "focusId": "headline",
      "label": "Start"
    }
  ]
}
Step 2: The Audio
Place your MP3 file in public/audio/MyTopicPage.mp3. Note: The filename usually matches the JSON key by convention, but can be overridden in the config.

Step 3: The Component
Create src/pages/MyTopicPage.tsx. This component must render the HTML elements with IDs that match your JSON focusId fields.

TypeScript
export function MyTopicPage({ config }: { config: PageConfig }) {
  const directorState = useAudioDirector(config.timeline);
  return (
    <div>
      <h1 id="headline">{config.title}</h1>
      <AudioPlayer directorState={directorState} audioSrc={config.audioSrc} />
    </div>
  );
}
Step 4: The Registry
Open src/components/ReportShell.tsx and register your new page:

TypeScript
import { MyTopicPage } from '@/pages/MyTopicPage';

const PAGE_REGISTRY = {
    'agora': AgoraPage,
    'my-topic': MyTopicPage, //  <-- Add this line
};
Now accessible at: http://localhost:3000/#/report/my-topic

🏗 Architecture & Rules
For AI Agents and Developers, please read the .context/ folder before making structural changes.

.antigravity/rules.md: Project constitution and Swiss content rules.

.context/architecture.md: Explanation of the Audio Director loop and SVG Overlay.

.context/design-system.md: Z-index strategies and visual guidelines.
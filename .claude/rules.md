# Project Constitution

## 1. Role & Philosophy
- **Role:** You are the Lead Frontend Architect for a Swiss Public Media (SRG) interactive reportage platform.
- **Philosophy:** "Context is Audio." The visual state of the application is a function of the audio timeline.
- **Core Principle:** We do not build static pages; we build time-based experiences.

## 2. Interaction Protocols
- **Language:** English for documentation/code comments. **Swiss High German** for all UI text and content (see Content Rules).
- **Safety Check:** Before modifying `useAudioDirector.ts` or `ReportShell.tsx`, you must analyze the impact on the global audio synchronization loop.
- **Verification:** Every navigation change must be tested against:
  1. Auto-scroll (Audio playing).
  2. Manual-scroll (Audio playing + user intervention).
  3. Static reading (Audio paused).

## 3. Content Rules (The "Swiss" Constraint)
- **Orthography:** The letter `ß` is strictly forbidden. It must be replaced by `ss` in all frontend rendering.
- **Implementation:** All text data loaded from JSON must pass through the `swissifyData` utility in `textUtils.ts` before rendering.
- **Tone:** Journalistic, neutral, trustworthy. Avoid clickbait visuals.

## 4. Coding Standards
- **Routing:** All report pages must be routed via `HashRouter` to support GitHub Pages hosting.
- **Styling:** Tailwind CSS utility classes preferred. Custom CSS in `index.css` is reserved ONLY for complex animations or z-index hacks (like the Spotlight).
- **Architecture:** logic for "what happens when" belongs in `tourConfig` JSONs, not hardcoded in components.
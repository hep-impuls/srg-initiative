# Technology Stack & Constraints

## Core Frameworks
- **Runtime:** Node.js 20+
- **Build Tool:** Vite 5.x
- **Frontend Library:** React 18.3+
- **Language:** TypeScript 5.4+ (Strict Mode)
- **Styling:** Tailwind CSS 3.4+
- **Routing:** React Router DOM 6.22+ (`HashRouter` strategy required)

## Critical Libraries
- **Icons:** `lucide-react` (Do not introduce FontAwesome).
- **Deployment:** `gh-pages` (Static hosting).
- **Audio:** Native HTML5 `<audio>` element controlled via Refs (No external audio libraries like Howler.js unless performance degrades).

## Infrastructure Constraints
- **Client-Side Only:** The app must run entirely in the browser. No server-side runtime (Next.js/SSR is currently out of scope).
- **Asset Hosting:** Audio files (`.mp3`) live in `public/audio/`. They are referenced relative to the base URL.
- **Git Friendly:** Content is stored in Git (Markdown/JSON), not a headless CMS (currently).

## Browser Compatibility
- Must support Safari (iOS) and Chrome (Android) background audio behavior.
- Layout must handle dynamic address bars on mobile (use `dvh` or standard viewports carefully).
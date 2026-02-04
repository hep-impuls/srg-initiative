Here is the comprehensive architecture documentation for "Antigravity." You can pass this entire block to the next development environment/agent to ensure they build exactly what we designed.

---

# 🚀 Architecture Brief: SRG Interaction Engine (Firebase)

**Status:** Draft | **Target:** Antigravity Repo | **Stack:** React + Firebase + Audio Director

## 1. Executive Summary

We are pivoting from iframe-based embeddings (Mentimeter/Lumi) to a **native, owned interaction engine**. This system will allow us to embed live polls, quizzes, and sliders directly into our audio-guided reports.

The goal is to create a "Hybrid State" architecture:

* **Static Content (Git):** Question text, labels, and design configuration live in local JSON files.
* **Dynamic Data (Firebase):** Vote counts and participation status live in the cloud.

This ensures total design control, Swiss orthography compliance, and the ability to embed these interactions as standalone widgets in other SRG properties.

---

## 2. Infrastructure Setup

### Firebase Configuration

The project has been initialized. Create a new utility file (e.g., `src/lib/firebase.ts`) to initialize the app and export the `db` (Firestore) instance.

**Environment details:**

* **Project ID:** `interactive-media-2a1fc`
* **Region:** Europe-West (configured in console)
* **Auth:** Anonymous Auth (optional, for rate limiting) or simple fingerprinting.

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDezsjWtq8p2TTQRG1YdZPegUcfSZNBwGI",
  authDomain: "interactive-media-2a1fc.firebaseapp.com",
  projectId: "interactive-media-2a1fc",
  storageBucket: "interactive-media-2a1fc.firebasestorage.app",
  messagingSenderId: "1094245132504",
  appId: "1:1094245132504:web:a47a79a7ec62d4c6e70fad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

### Data Model (Firestore Schema)

We require a lightweight NoSQL schema to store aggregated results.

**Collection:** `interactions`

* **Doc ID:** `[interaction_id]` (matches the ID in the local JSON config)
* **Fields:**
* `type` (string): "poll", "slider", "quiz"
* `total_votes` (number): Atomic counter
* `options` (map): Key-value pairs of option IDs and vote counts.
* *Example:* `{ "yes": 42, "no": 12 }`





**Collection:** `user_votes` (Prevention)

* **Doc ID:** `[user_hash]_[interaction_id]`
* **Fields:**
* `timestamp`: Server timestamp
* `value`: The option selected



---

## 3. Core Features & Components

### A. The "Director" Integration (`useInteractionDirector`)

We need a custom hook that syncs the interaction state with the audio playback time, not just user input.

* **Phase 1: Input Mode (0s - 30s):** User can vote.
* **Phase 2: Locked Mode (30s+):** Inputs are disabled.
* **Phase 3: Reveal Mode (35s+):** The hook switches the view to "Results," triggering the real-time Firestore listener to animate the bars/graphs.

### B. The `InteractionShell` Component

A generic wrapper component that loads the correct specific interaction based on the `type` prop.

* **Props:** `config` (loaded from JSON), `directorState` (optional).
* **Sub-components:**
* `<PollBar />`: Animated bar charts.
* `<PollSlider />`: Distribution curve + user position.
* `<QuizOption />`: Selectable cards with "Correct/Wrong" states.



### C. The "Embed" Route (Micro-Frontend)

To allow these polls to be used in other repos via `<iframe>`, we need a specialized route that renders **only** the interaction, stripping away the header, footer, and audio player.

* **Route:** `/#/embed/:interactionId`
* **Layout:** Transparent background, full-width/height container.
* **Message Passing:** Optional `window.postMessage` support to notify parent iframes of height changes (for auto-resizing).

---

## 4. Workflow for New Content

**Developer Workflow:**

1. Create `src/data/interactions/my_poll.json`.
2. Define `id`, `question`, and `options` locally.
3. Embed in the report: `<InteractionShell config={import(...)} />`.

**Runtime Logic:**

1. Frontend checks Firestore for `interactions/[id]`.
2. If missing, it treats votes as starting from 0 (lazy initialization).
3. If user votes, use `FieldValue.increment(1)` to ensure atomic updates.

---

## 5. Strict Constraints

1. **Swiss Orthography:** All text rendered (even from dynamic sources) must pass through the `swissifyData` utility to replace `ß` with `ss`.
2. **No Admin Panel:** We do not build an admin interface. Content creation happens via Code/JSON.
3. **Performance:** Loading the interaction must not block the main thread or the audio player. Firestore subscriptions must unsubscribe on unmount.
4. **Privacy:** No PII (Personally Identifiable Information) is to be stored. Use anonymous IDs for vote limiting.
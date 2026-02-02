# Product Goals

## Primary Objective
To build a scalable "Audio-Guided Reportage" engine that allows SRG journalists to publish multi-page interactive stories where an audio track orchestrates the user's visual journey.

## Core User Stories
1. **The Listener:** "I want to press play and have the article scroll itself, showing me exactly what the speaker is talking about, without me touching the screen."
2. **The Skeptic:** "I want to be able to pause the audio, click on a source badge `[1]`, and verify the data myself without losing my place."
3. **The Editor:** "I want to add a new report (e.g., 'Climate Change') by simply adding a text config and an MP3 file, without rewriting the audio engine."

## Scope & Boundaries
- **In Scope:** - Dynamic Routing (`/report/:slug`).
  - JSON-based timeline configuration.
  - Multi-element highlighting (focusing on an array of DOM IDs).
  - Swiss orthography enforcement.
- **Out of Scope:** - User accounts / Login.
  - Real-time comments.
  - Server-side audio generation (TTS is done offline).

## Success Metrics
- **Sync Accuracy:** The scroll position must align with the audio cue within <500ms.
- **Interruption Handling:** The system must detect user scrolling instantly and pause the "Director" to prevent fighting the user.
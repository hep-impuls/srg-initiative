---
name: audio-guided-sync
description: "Synchronize timestamped audio transcripts with React pages to create audio-guided interactive experiences. Use when you need to: (1) Take a React page draft and timestamped transcript and generate synchronized timeline JSON, (2) Enhance React components with proper IDs and structure for audio-guided navigation, (3) Create chapter markers and focus points that match audio narration, (4) Optimize layouts for 15 inch screen consumption with semantic content matching, (5) Auto-detect tab structures or work with single-page layouts. Generates both modified React components and complete timeline JSON configs following the SRG audio-guided reports pattern."
---

# Audio-Guided Sync

Transform React page drafts and timestamped transcripts into fully synchronized audio-guided interactive experiences.

## Overview

This skill takes two inputs:
1. **React Component Draft** - A partially structured React page with content
2. **Timestamped Transcript** - Audio narration with `[HH:MM:SS.mmm] -> Text` format

And produces two outputs:
1. **Enhanced React Component** - With proper IDs, structure, and 15" screen optimization
2. **Timeline JSON** - Complete synchronization config with chapters and focus points

## Workflow

### Step 1: Analyze Inputs

**Read the transcript:**
```bash
view /path/to/transcript.md
```

**Read the React component:**
```bash
view /path/to/PageComponent.tsx
```

**Parse transcript format:**
- Extract all timestamps and corresponding text segments
- Identify natural chapter boundaries (significant pauses >20s, topic shifts, or heading-level content)
- Build temporal map of content flow

**Analyze React structure:**
- Identify existing sections, headings, and content blocks
- Detect tab components (if present) or confirm single-page layout
- Note which elements already have IDs

### Step 2: Semantic Content Matching

Match transcript segments to JSX elements using semantic analysis:

**Strategy:**
1. **Extract key phrases** from transcript segments (nouns, specific topics, statistics)
2. **Search JSX content** for matching text or concepts
3. **Map timestamps** to corresponding DOM elements
4. **Handle multi-element highlights** when a single transcript segment references multiple visual elements

**Example:**
```
Transcript: "[00:01:30.000] -> Die Statistiken zeigen 46 Prozent der Schweizer..."
→ Maps to: <StatCard> with "46%" value and "Schweizer" in label
```

**Viewport optimization for 15" screens:**
- Group elements that should be visible together
- Avoid focusing on elements taller than ~800px (create sub-sections instead)
- Ensure focused elements have meaningful scroll positions

### Step 3: Enhance React Component

**Add missing IDs:**
- Use descriptive, kebab-case IDs: `data-overview-section`, `theory-intro`, `consequences-final-question`
- Add `id` attributes to all elements referenced in timeline
- Add `scroll-mt-24` class to elements for proper scroll offset (accounts for fixed header)

**Add container grouping when needed:**
- If transcript segment references multiple related elements, wrap them in a container div
- Example: Wrapping title + image + stat cards in `<div id="data-overview-container">`

**Optimize for 15" screens:**
- Ensure sections are appropriately sized (not too tall/short)
- Add responsive breakpoints if needed
- Use `className="scroll-mt-24"` for proper scroll positioning

**Tab detection:**
- If component uses tab structure (`<Tabs>`, `activeTab` state), note tab names
- Map timeline entries to appropriate tabs
- If no tabs exist, all entries use a default tab value (e.g., `"main"`)

### Step 4: Generate Timeline JSON

**Build timeline array:**

For each transcript segment:
1. Convert timestamp to seconds (decimal)
2. Determine target tab (if multi-tab layout)
3. Identify focusId(s) - single ID or array for multi-element
4. Create descriptive label from transcript text
5. Mark as chapter if appropriate

**Chapter detection heuristics:**
- Time gaps >20 seconds between segments
- Explicit chapter language in transcript ("Let's start with...", "Now let's look at...")
- Major topic transitions
- First entry of each tab
- Strategic narrative milestones

**JSON structure:**
```json
{
  "title": "Page Title from React Component",
  "timeline": [
    {
      "seconds": 0,
      "tab": "theory",
      "focusId": "intro-section",
      "label": "Einleitung & Überblick",
      "isChapter": true
    },
    {
      "seconds": 15.5,
      "tab": "theory",
      "focusIds": ["main-tabs", "theory-content"],
      "focusId": "theory-content",
      "label": "Hauptthema"
    }
  ]
}
```

**Key rules:**
- Always include both `focusId` (primary) and `focusIds` (array) when multiple elements
- Use `focusId` for backward compatibility (first element of `focusIds`)
- Chapters should be spaced 30-60 seconds apart (not every entry)
- Labels should be concise but descriptive (3-6 words)

### Step 5: Output Files

**Save enhanced React component:**
```typescript
create_file /path/to/EnhancedPage.tsx
```

**Save timeline JSON:**
```typescript
create_file /path/to/data/PageName.json
```

**File naming convention:**
- React: `{TopicName}Page.tsx` (e.g., `AgoraPage.tsx`, `ClimateChangePage.tsx`)
- JSON: `{TopicName}Page.json` (matches React file name)

## Examples

### Example 1: Simple Single-Section Focus

**Transcript:**
```
[00:00:15.000] -> Willkommen zur Einführung. Heute besprechen wir die Grundlagen.
```

**Timeline Entry:**
```json
{
  "seconds": 15.0,
  "tab": "intro",
  "focusId": "welcome-section",
  "label": "Willkommen & Grundlagen"
}
```

### Example 2: Multi-Element Highlight

**Transcript:**
```
[00:01:30.000] -> Schauen Sie sich die Tabs und die Datenübersicht an.
```

**Timeline Entry:**
```json
{
  "seconds": 90.0,
  "tab": "data",
  "focusIds": ["main-tabs", "data-overview-container"],
  "focusId": "data-overview-container",
  "label": "Datenübersicht"
}
```

### Example 3: Chapter Marker

**Transcript:**
```
[00:02:15.000] -> Jetzt wechseln wir zu den Konsequenzen für die Demokratie.
```

**Timeline Entry:**
```json
{
  "seconds": 135.0,
  "tab": "consequences",
  "focusIds": ["tab-btn-consequences", "consequences-intro"],
  "focusId": "consequences-intro",
  "label": "Folgen für Demokratie",
  "isChapter": true
}
```

## Quality Checklist

Before outputting, verify:

- [ ] All timestamp seconds are accurate (converted from HH:MM:SS.mmm)
- [ ] Every `focusId` matches an actual ID in the React component
- [ ] Elements have `scroll-mt-24` class for proper positioning
- [ ] Chapters are spaced logically (30-60s apart)
- [ ] Multi-element highlights use both `focusId` and `focusIds`
- [ ] Labels are concise and descriptive
- [ ] Tab names match component structure
- [ ] Container grouping is used appropriately for related content
- [ ] File naming follows convention (PascalCase + Page suffix)

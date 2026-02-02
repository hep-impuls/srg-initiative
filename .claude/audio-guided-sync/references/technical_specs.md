# Technical Reference

## Timestamp Parsing

### Format Specification
Transcripts follow this format:
```
[HH:MM:SS.mmm] -> Text content here
```

### Conversion Algorithm
```python
def parse_timestamp(timestamp_str):
    """Convert [HH:MM:SS.mmm] to seconds (float)"""
    # Remove brackets and split
    time_part = timestamp_str.strip('[]').split(' ->')[0]
    
    # Parse components
    h, m, s = time_part.split(':')
    seconds = int(h) * 3600 + int(m) * 60 + float(s)
    
    return seconds

# Example:
# "[00:02:15.450]" → 135.45 seconds
```

## Semantic Matching Strategy

### Priority Matching Order

1. **Exact text match** (highest priority)
   - Search JSX for exact phrases from transcript
   - Match statistics, percentages, specific terms

2. **Keyword extraction**
   - Extract nouns, proper nouns, numbers
   - Match against element content, IDs, classNames

3. **Structural signals**
   - Headings (h1-h6) indicate major sections
   - Tab buttons indicate navigation points
   - Cards/sections indicate data displays

4. **Temporal proximity**
   - Elements should be logically ordered
   - Later timestamps map to elements further down the page

### Content Analysis Patterns

**Statistics/Numbers:**
```
Transcript: "46 Prozent der Schweizer..."
→ Look for: <StatCard value="46%" /> or text containing "46"
```

**Section References:**
```
Transcript: "Schauen wir uns die Theorie an..."
→ Look for: id="theory-section" or tab="theory"
```

**Visual Elements:**
```
Transcript: "Die Grafik zeigt..."
→ Look for: <Chart>, <img>, or elements with "chart"/"graph" in ID
```

## ID Naming Conventions

### Good IDs (Descriptive & Semantic)
- `intro-section`
- `data-overview-container`
- `theory-comparison-chart`
- `consequences-final-question`
- `stat-card-swiss-population`

### Bad IDs (Avoid)
- `section1` (not descriptive)
- `div-wrapper` (too generic)
- `content` (ambiguous)
- `mainContent` (use kebab-case, not camelCase)

## Tab Structure Detection

### React Tab Patterns

**Pattern 1: State-based tabs**
```tsx
const [activeTab, setActiveTab] = useState<'theory' | 'data' | 'consequences'>('theory');
```
→ Tab names: `theory`, `data`, `consequences`

**Pattern 2: Conditional rendering**
```tsx
{currentView === 'intro' && <IntroContent />}
{currentView === 'main' && <MainContent />}
```
→ Tab names: `intro`, `main`

**Pattern 3: Single page (no tabs)**
```tsx
<div className="page-content">
  {/* All content in one scroll */}
</div>
```
→ Use single tab name: `"main"` for all timeline entries

## Chapter Detection Algorithm

### Automatic Chapter Markers

Mark as chapter (`isChapter: true`) when:

1. **Time gap > 20 seconds** between transcript entries
2. **Explicit transition language:**
   - "Lass uns...", "Jetzt...", "Schauen wir..."
   - "Beginnen wir mit...", "Kommen wir zu..."
3. **Tab transitions** (first entry in a new tab)
4. **Major structural shifts** (h2 headings in content)
5. **Strategic spacing** (ensure 3-5 chapters per 3-5 minute audio)

### Chapter Label Formatting

- Keep concise: 3-6 words
- Use present tense: "Einleitung" not "Eingeführt"
- Descriptive but not verbose: "Die Daten" not "Datenanalyse und statistische Übersicht"

## Multi-Element Highlighting

### When to Use `focusIds` Array

Use when transcript references multiple distinct elements:

**Example 1: Tab + Content**
```
Transcript: "Wechseln Sie zum Daten-Tab und schauen Sie die Übersicht an"
```
→ Highlight both the tab button AND the content section
```json
{
  "focusIds": ["tab-btn-data", "data-overview-section"],
  "focusId": "data-overview-section"
}
```

**Example 2: Title + Chart + Cards**
```
Transcript: "Die Statistiken zeigen mehrere interessante Punkte"
```
→ Group related visual elements
```json
{
  "focusIds": ["stats-title", "stats-chart", "stat-cards-container"],
  "focusId": "stat-cards-container"
}
```

### Container Wrapping Strategy

If elements aren't already grouped in JSX:

**Before:**
```tsx
<h2>Statistiken</h2>
<Chart data={chartData} />
<div className="grid">
  <StatCard />
  <StatCard />
</div>
```

**After:**
```tsx
<div id="stats-section" className="scroll-mt-24">
  <h2>Statistiken</h2>
  <Chart data={chartData} />
  <div className="grid">
    <StatCard />
    <StatCard />
  </div>
</div>
```

→ Use single `focusId: "stats-section"`

## 15" Screen Optimization

### Viewport Considerations

**Typical 15" laptop:** ~1366x768 to 1920x1080 resolution

**Safe content heights:**
- Small section: 200-400px
- Medium section: 400-600px
- Large section: 600-800px
- **Avoid:** Sections > 900px (requires excessive scrolling)

### Grouping Strategy

**Good grouping** (fits viewport):
```tsx
<div id="data-overview" className="scroll-mt-24">
  <h2>Datenübersicht</h2> {/* ~60px */}
  <p>Einleitung...</p> {/* ~80px */}
  <div className="grid grid-cols-3 gap-4"> {/* ~300px */}
    <StatCard /> <StatCard /> <StatCard />
  </div>
</div>
```
Total: ~440px → Comfortable viewport

**Bad grouping** (too tall):
```tsx
<div id="everything">
  {/* 2000px of content */}
</div>
```
→ Split into multiple focus points

## JSON Output Format

### Complete Schema

```typescript
interface TimelineConfig {
  title: string;
  timeline: TimelineEntry[];
}

interface TimelineEntry {
  seconds: number;           // Converted from timestamp
  tab: string;               // Tab name or "main"
  focusId: string;           // Primary element ID (backward compat)
  focusIds?: string[];       // Optional: Array for multi-element
  label: string;             // Chapter/segment description
  isChapter?: boolean;       // Optional: Chapter marker
}
```

### Validation Rules

Before outputting JSON:
1. All `seconds` are in ascending order
2. All `focusId` values exist in React component
3. All `focusIds` arrays contain valid IDs
4. Labels are 3-6 words
5. Chapters appear every 30-60 seconds
6. First entry has `seconds: 0`

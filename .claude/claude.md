# Audio-Guided Reports - Dokumentation

## Projektübersicht

Ein interaktives Reportage-System, bei dem Audio-Narration automatisch durch den Content führt. Die App synchronisiert Audio-Playback mit Tab-Wechseln, Scroll-Verhalten und visuellen Highlights.

**Status:** ✅ Vollständig implementiert und funktionsfähig

---

## Architektur

### Technologie-Stack
- **Vite** - Build Tool
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **React Router DOM v6** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Kern-Komponenten

#### 1. Audio Director Hook (`src/hooks/useAudioDirector.ts`)
Das Herzstück der App. Koordiniert Audio mit UI-Änderungen.

**Funktionen:**
- Überwacht `audio.currentTime` und vergleicht mit Timeline
- Wechselt Tabs automatisch basierend auf Audio-Position
- Scrollt zu Elementen und hebt sie mit Spotlight-Effekt hervor
- Verwaltet Dimming-Overlay (50% schwarzer Overlay)
- Pausiert Auto-Navigation bei manueller User-Interaktion
- Extrahiert Chapter-Marker aus der Timeline

**Spotlight-Effekt:**
- Erstellt dynamisches Overlay (`z-index: 40`)
- Erhöht z-index aller positionierten Eltern-Container auf `z-45`
- Fokussiertes Element erhält `z-50` mit blauem Glow
- Dimmt die gesamte Seite außer dem Fokus-Element

#### 2. Scroll Lock Hook (`src/hooks/useScrollLock.ts`)
Erkennt manuelles Scrollen und pausiert Auto-Navigation.

**Verhalten:**
- Erkennt Scroll-Events > 50px Bewegung
- Setzt `isUserScrolling` Flag
- Auto-Reset nach 3 Sekunden Inaktivität
- Zeigt Amber-Warning-Banner mit "Resume" Button

#### 3. Audio Player (`src/components/AudioPlayer.tsx` + `AudioControls.tsx`)
Fixed bottom bar mit vollständiger Playback-Kontrolle.

**Features:**
- Play/Pause Button (groß, blau, rund)
- Klickbare Progress Bar für Seeking
- Zeit-Anzeige (MM:SS format)
- Restart Button
- User Interaction Warning Banner (amber)

#### 4. Chapter Navigation (`src/components/ChapterList.tsx`)
Visuelles Chapter-Menu über den Audio Controls.

**Features:**
- Zeigt alle Timeline-Entries mit `isChapter: true`
- Farbcodierung: Aktiv (blau), Vergangen (grau), Zukünftig (weiß)
- Click-to-Jump zu jedem Chapter
- Zeit-Display für jeden Marker

---

## Datenstruktur

### tourConfig.json Schema

```json
{
  "pages": {
    "page-slug": {
      "title": "Seiten-Titel",
      "audioSrc": "/audio/dateiname.mp3",
      "timeline": [
        {
          "seconds": 0,
          "tab": "theory",
          "focusId": "element-id",
          "label": "Chapter Name",
          "isChapter": true
        }
      ]
    }
  }
}
```

**Felder:**
- `seconds` - Zeitpunkt in Sekunden
- `tab` - Ziel-Tab: `"theory" | "data" | "consequences"`
- `focusId` - ID des DOM-Elements zum Highlighten
- `label` - Beschreibung für Timeline/Chapters
- `isChapter` (optional) - Markiert Entry als Chapter-Marker

---

## Wichtige Features

### 1. Smart Tab Navigation
**Audio läuft:** Tabs werden automatisch durch Audio Director gesteuert
**Audio pausiert:** Tabs sind manuell klickbar
**Synchronisierung:** Beim Abspielen übernimmt Audio Director die Kontrolle

**Implementierung in AgoraPage:**
```typescript
const [manualTab, setManualTab] = useState('theory');
const activeTab = audioState.isPlaying ? currentTab : manualTab;
```

### 2. Spotlight-Effekt mit Dimming
- Overlay dimmt gesamte Seite (50% schwarz, z-index: 40)
- Fokussiertes Element wird erhöht (z-index: 50)
- Alle positionierten Parent-Container werden ebenfalls erhöht (z-index: 45)
- Blaue Glow-Shadow um fokussiertes Element
- Temporärer blauer Ring-Effekt (2 Sekunden)

### 3. User Interaction Detection
- Erkennt manuelles Scrollen
- Pausiert Auto-Scroll automatisch
- Zeigt Warning: "Auto-Navigation pausiert"
- Resume-Button zum Fortsetzen
- Auto-Resume nach 3 Sekunden oder bei neuem Cue

### 4. Chapter Navigation
- Extrahiert automatisch Chapters aus Timeline
- Visuelles Menu über Audio Controls
- Click-to-Jump zu jedem Chapter
- Progress-Indikation (welches Chapter ist aktiv)

---

## Ordnerstruktur

```
srg-initiative/
├── public/
│   └── audio/
│       └── mobilität.mp3          # Audio-Dateien
│
├── src/
│   ├── components/
│   │   ├── AudioPlayer.tsx        # Player Container
│   │   ├── AudioControls.tsx     # Play/Pause/Seek Controls
│   │   ├── ChapterList.tsx        # Chapter Navigation
│   │   ├── StatCard.tsx           # Statistik Cards
│   │   ├── InfoBox.tsx            # Info Boxen
│   │   └── SourceBadge.tsx        # Quellen-Badges
│   │
│   ├── pages/
│   │   └── AgoraPage.tsx          # Beispiel-Report mit IDs
│   │
│   ├── hooks/
│   │   ├── useAudioDirector.ts   # ⭐ Kern-Logik
│   │   └── useScrollLock.ts       # Scroll Detection
│   │
│   ├── data/
│   │   └── tourConfig.json        # Timeline Konfiguration
│   │
│   ├── types/
│   │   └── index.ts               # TypeScript Definitions
│   │
│   ├── App.tsx                     # Router Setup
│   ├── main.tsx                    # Entry Point
│   └── index.css                   # Tailwind + Custom CSS
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## Workflow: Neue Seite hinzufügen

### Schritt 1: React Component erstellen

**Template:** Kopiere `src/pages/AgoraPage.tsx`

**Wichtig: IDs hinzufügen!**
```tsx
<div id="unique-section-id" className="scroll-mt-24">
  {/* Content */}
</div>
```

**Klasse `scroll-mt-24`:** Sorgt für Scroll-Offset (Header-Höhe)

### Schritt 2: Audio erstellen

**Optionen:**
1. **AI TTS:** ElevenLabs oder OpenAI TTS
2. **Manuelle Aufnahme:** Authentischer "Indie-Vibe"

**Datei ablegen:** `public/audio/meine-seite.mp3`

### Schritt 3: Timeline in tourConfig.json

```json
{
  "pages": {
    "meine-neue-seite": {
      "title": "Mein neuer Report",
      "audioSrc": "/audio/meine-seite.mp3",
      "timeline": [
        {
          "seconds": 0,
          "tab": "theory",
          "focusId": "intro-section",
          "label": "Einleitung",
          "isChapter": true
        },
        {
          "seconds": 30,
          "tab": "theory",
          "focusId": "hauptthema",
          "label": "Hauptthema"
        },
        {
          "seconds": 120,
          "tab": "data",
          "focusId": "statistiken",
          "label": "Die Daten",
          "isChapter": true
        }
      ]
    }
  }
}
```

**Timing finden:**
1. Audio abspielen und Notizen machen wann was passieren soll
2. Zeitpunkte in `seconds` eintragen
3. Mit `isChapter: true` wichtige Abschnitte markieren

### Schritt 4: Route hinzufügen

**In `src/App.tsx`:**
```tsx
<Route
  path="/report/meine-neue-seite"
  element={<MeineNeueSeitePage config={config.pages['meine-neue-seite']} />}
/>
```

**Fertig!** Keine Code-Änderungen an Hooks oder Core-Logik nötig.

---

## CSS-Klassen für Spotlight-Effekt

### `.audio-director-focused` (index.css)
```css
.audio-director-focused {
  position: relative;
  z-index: 50 !important;
  background-color: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 10px 40px rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}
```

Diese Klasse wird dynamisch zum fokussierten Element hinzugefügt.

---

## Z-Index Hierarchie

**Wichtig für Spotlight-Effekt:**

```
z-50: Audio Player (Fixed Bottom)
z-50: Fokussiertes Element (.audio-director-focused)
z-45: Erhöhte Parent-Container ([data-elevated="true"])
z-40: Dimming Overlay (#audio-director-overlay)
z-20: Main Content Container (Standard)
z-10: Diverse UI-Elemente
```

**Warum das wichtig ist:**
- Main Container hat `z-20` und erstellt Stacking Context
- Fokussiertes Element muss über Overlay (`z-40`) sein
- Daher müssen Parent-Container temporär erhöht werden (`z-45`)

---

## Type Definitions

### Wichtigste Interfaces

```typescript
// Timeline Entry
interface TimelineEntry {
  seconds: number;
  tab: 'theory' | 'data' | 'consequences';
  focusId: string;
  label: string;
  isChapter?: boolean;
}

// Audio Director Return
interface AudioDirectorState {
  currentTab: 'theory' | 'data' | 'consequences';
  activeElementId: string | null;
  isUserInteracting: boolean;
  resumeAutoScroll: () => void;
  audioState: AudioPlayerState;
  audioRef: RefObject<HTMLAudioElement>;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  chapters: TimelineEntry[];
}
```

---

## Testing Checklist

### Funktions-Tests

- [ ] **Audio Playback:** Play/Pause funktioniert
- [ ] **Tab Switching:** Tabs wechseln bei richtigen Zeitpunkten
- [ ] **Auto-Scroll:** Scrollt zu fokussierten Elementen
- [ ] **Spotlight:** Dimming Overlay + Element Highlight funktioniert
- [ ] **Manual Tabs:** Bei Pause sind Tabs klickbar
- [ ] **User Scroll:** Warning erscheint bei manuellem Scroll
- [ ] **Resume:** "Navigation fortsetzen" Button funktioniert
- [ ] **Chapters:** Chapter Pills sind klickbar und springen zu richtiger Zeit
- [ ] **Seeking:** Progress Bar Click springt zu richtiger Position
- [ ] **Restart:** Restart Button setzt Audio auf 0 zurück

### Edge Cases

- [ ] Refresh während Playback → Startet von vorne
- [ ] Seek zu Mitte → Tab und Focus aktualisiert
- [ ] Audio endet → Player zeigt 100%
- [ ] Schnelles Tab-Klicken bei Pause → Funktioniert smooth

---

## Performance-Überlegungen

### Optimierungen implementiert:

1. **useCallback für Event Handlers:** Vermeidet Re-Renders
2. **Ref für Overlay:** Erstellt Overlay nur einmal
3. **Computed Styles für Z-Index:** Korrekte Erkennung positionierter Elemente
4. **Debounced Scroll Detection:** 3 Sekunden Timeout
5. **CSS Transitions statt JS Animation:** Hardware-beschleunigt

### Bekannte Limitationen:

- Smooth scrolling kann bei sehr langen Seiten ruckeln
- Overlay wird bei jedem Cue neu gezeigt (kleine Animation)
- Parent-Elevation geht bis zum Body (könnte bei vielen Containern slow sein)

---

## Deployment

### Vorbereitung

```bash
npm run build
```

### Hosting (Empfohlen: Vercel)

1. GitHub Repository erstellen
2. Code pushen
3. Mit Vercel verknüpfen
4. Automatisches Deployment bei jedem Push

**Audio-Dateien:**
- Müssen in `public/audio/` liegen
- Werden automatisch mit deployed
- Pfad im JSON: `/audio/dateiname.mp3`

---

## Troubleshooting

### Problem: Spotlight funktioniert nicht

**Symptome:** Nur blauer Border, kein Dimming

**Lösung:**
- Prüfe ob Main Container `relative` positioning hat
- Prüfe z-index des Main Containers (sollte < 40 sein)
- Öffne DevTools → Elements → Suche `#audio-director-overlay`
- Sollte `opacity: 1` haben bei Focus

### Problem: Tabs nicht klickbar

**Symptome:** Tabs reagieren nicht bei Pause

**Lösung:**
- Prüfe ob `audioState.isPlaying` korrekt ist
- Prüfe ob `manualTab` State existiert
- Prüfe ob Buttons `onClick` Handler haben

### Problem: Scroll springt nicht zu Element

**Symptome:** Focus funktioniert, aber kein Scroll

**Lösung:**
- Prüfe ob Element-ID in Timeline mit DOM übereinstimmt
- Prüfe ob `scroll-mt-24` Klasse gesetzt ist
- Prüfe Console für Fehler

### Problem: Audio spielt nicht

**Symptome:** Play Button reagiert nicht

**Lösung:**
- Prüfe Browser Autoplay Policy
- Prüfe ob Audio-Datei existiert (`public/audio/...`)
- Öffne Network Tab → Prüfe ob Audio geladen wird
- Prüfe ob `audioSrc` Pfad in JSON korrekt ist

### Problem: Manuelle Klicks (z.B. Quellen) springen zurück

**Symptome:** Klick auf Anker-Link funktioniert kurz, dann scrollt Audio Director zurück.

**Lösung:**
- Der Audio Director erzwingt Fokus solange `isUserScrolling` false ist.
- **Fix:** Im `onClick` Handler muss ein User-Event simuliert werden:
```typescript
window.dispatchEvent(new Event('wheel')); // Signale "User interagiert"
target.scrollIntoView(); // Manuell scrollen
e.preventDefault(); // Standard-Anker verhindern
```
- Siehe Implementierung in `SourceBadge.tsx`.

---

## Best Practices

### Highlighting Strategies

#### 1. Container Grouping (Empfohlen für zusammenhängende Bereiche)
Wenn mehrere Elemente (z.B. Titel + Bild + Cards) als *eine* Einheit hervorgehoben werden sollen:
- Umschließe sie im JSX mit einem `div`.
- Gib dem Container eine ID (z.B. `id="data-overview-container"`).
- Nutze diese Single-ID in der `tourConfig.json`.
- **Vorteil:** Ein ruhiger, großer Highlight-Rahmen statt vieler kleiner.

#### 2. Multi-Element Highlighting (Array)
Wenn Elemente optisch oder im DOM getrennt sind (z.B. Tab-Button oben + Content unten):
- Nutze `focusIds: ["tab-btn-data", "data-content"]` in der Config.
- **Vorteil:** Verbindet visuell getrennte Bereiche.

### IDs vergeben

✅ **Gut:**
```tsx
<section id="hauptthema" className="scroll-mt-24">
```

❌ **Schlecht:**
```tsx
<section id="section1">  // Nicht beschreibend
<section className="scroll-mt-24">  // Keine ID
```

### Timeline erstellen

✅ **Gut:**
- Logische Sprünge alle 15-30 Sekunden
- Chapter-Marker bei wichtigen Abschnitten setzen
- Beschreibende Labels verwenden

❌ **Schlecht:**
- Zu viele Cues (< 5 Sekunden Abstand)
- Keine Chapter-Marker
- Generic Labels wie "Part 1", "Part 2"

### Audio aufnehmen

✅ **Gut:**
- Ruhige Umgebung
- Klare Aussprache
- "Wie Sie jetzt sehen" statt nur Text vorlesen
- Pausen für Scroll-Zeit einplanen

❌ **Schlecht:**
- Monotone Vorlesung
- Zu schnelles Tempo
- Keine Übergänge zwischen Sections

---

## Erweiterungsmöglichkeiten

### Ideen für Features:

1. **Playback Speed:** 0.5x, 1x, 1.5x, 2x Controls
2. **Transcript:** Automatisch generierter Text-Version
3. **Bookmarks:** User kann eigene Marker setzen
4. **Progress Persistence:** Position speichern in LocalStorage
5. **Mobile Gestures:** Swipe für Tab-Wechsel
6. **Audio Waveform:** Visuelle Darstellung der Audio-Datei
7. **Multiple Languages:** i18n Support für verschiedene Sprachen
8. **Keyboard Shortcuts:** Space = Play/Pause, Arrow Keys = Seek

---

## Lizenz & Credits

**Entwickelt mit:**
- Claude Code (Anthropic)
- React + TypeScript
- Tailwind CSS

**Co-Authored-By:** Claude Sonnet 4.5

---

**Version:** 1.0.0
**Letztes Update:** Februar 2026
**Status:** Production Ready ✅

---

## Changelog v1.1.0 (Februar 2026)

### Neue Features

#### 1. Playback Speed Control
Es wurde eine Steuerung für die Wiedergabeschwindigkeit hinzugefügt.
- **Cycle:** 0.8x -> 1.0x -> 1.2x -> 1.5x -> 2.0x
- **Implementierung:**
    - `AudioControls.tsx`: Button neben Progress Bar
    - `useAudioDirector.ts`: State management für `playbackRate`

#### 2. Verbesserter Dimming-Effekt (SVG Hole-Punch)
Der ursprüngliche Z-Index-basierte Dimming-Effekt hatte Probleme mit komplexen Layouts (Stacking Contexts).
- **Lösung:** Ein SVG-basiertes Overlay, das über **alles** gelegt wird.
- **Technik:** Ein SVG Pfad mit `fill-rule="evenodd"` erstellt ein transparentes "Loch" um das fokussierte Element.
- **Vorteil:** Funktioniert unabhängig von Z-Index Hierarchien der Eltern-Elemente.
- **Performance:** Nutzt `requestAnimationFrame` für flüssige Updates bei Scroll/Resize.

#### 3. Multi-Element Highlighting
Unterstützung für das gleichzeitige Hervorheben mehrerer Elemente.
- **Problem:** Manche logischen Einheiten (z.B. "Tabs" + "Intro Content") sind im DOM nicht gruppiert.
- **Lösung:** `useAudioDirector` akzeptiert nun ein Array von IDs (`focusIds`).
- **Implementierung:** Der SVG Mask Generator iteriert über alle aktiven IDs und schneidet entsprechende Löcher in das Overlay.

#### 4. Scroll-Optimierung
Bugfix für das initiale Scroll-Verhalten.
- `beginning-highlight` wurde auf den Header verschoben, um das Scrollen zur Mitte einer zu großen Sektion zu verhindern.
- Einführung granularerer Schritte im Intro (10s Marke) für besseren Flow.

### Deployment Updates (GitHub Pages)

Das Projekt wurde für das Hosting auf GitHub Pages konfiguriert.

#### 1. Routing Strategy
- Umstellung von `BrowserRouter` auf `HashRouter`
- **Grund:** GitHub Pages unterstützt kein history-API Fallback (SPA routing). `HashRouter` (`/#/route`) funktioniert ohne Server-Konfiguration.
- **URL:** `https://hep-impuls.github.io/srg-initiative/#/report/agora`

#### 2. Build Configuration
- `vite.config.ts`: `base` path auf Repo-Namen gesetzt (`/srg-initiative/` ist jetzt via Auto-Detection in GitHub Actions gelöst, aber HashRouter macht es robust).
- `.gitignore`: Optimiert für Vite/React.
- `vite-env.d.ts`: Hinzugefügt für TypeScript Support von `import.meta.env`.

#### 3. Automation (GitHub Actions)
- Workflow Datei: `.github/workflows/deploy.yml`
- Baut und deployed das Projekt automatisch bei jedem Push auf `main`.
- Umgeht Pathfinder-Probleme von Windows (`ENAMETOOLONG`) bei lokalem Deployment.

#### 4. Asset Handling
- Audio-Datei umbenannt: `mobilität.mp3` -> `mobilitaet.mp3` (Vermeidung von Encoding-Fehlern auf Linux-Build-Servern).
- Pfad in `tourConfig.json` auf relativen Pfad angepasst (`audio/mobilitaet.mp3`).

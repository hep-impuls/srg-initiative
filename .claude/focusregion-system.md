# FocusRegion System — Dokumentation

## Übersicht

Das **FocusRegion System** ist eine Architektur zur Strukturierung von fokussierbaren Elementen in Audio-geführten Reports. Es reduziert Post-Production-Aufwand durch selbstdokumentierende, hierarchische IDs und AI-freundliche Manifeste.

---

## Problem Statement

**Vorher:**
- IDs waren inkonsistent (`theory-intro`, `agora-explanation`, `data-overview-container`)
- Keine klare Hierarchie oder Namenskonvention
- AI musste raten, welche Elemente fokussierbar sind
- Timeline-Erstellung war manuell und fehleranfällig

**Nachher:**
- Hierarchische IDs folgen dem Pattern `section__block__element`
- Automatisch generierte Manifeste zeigen alle verfügbaren Fokus-Targets
- Deutsche Labels für AI-Kontext
- Depth wird automatisch aus ID-Struktur berechnet

---

## FocusRegion Component

### Verwendung

```tsx
import { FocusRegion } from '@/components/FocusRegion';

<FocusRegion
  id="theory__intro__text"
  label="Intro Text"
  className="py-4"
  as="section"
>
  <h2>Wie wir miteinander reden</h2>
  <p>Früher bestimmten Zeitungsredaktionen...</p>
</FocusRegion>
```

### Props

| Prop | Typ | Beschreibung |
|------|-----|--------------|
| `id` | `string` | Hierarchische ID (z.B. `theory__intro__text`) |
| `label` | `string` | Deutsche Beschreibung für AI (z.B. "Intro Text") |
| `children` | `ReactNode` | Inhalt des FocusRegion |
| `className` | `string?` | Zusätzliche CSS-Klassen |
| `as` | `keyof JSX.IntrinsicElements?` | HTML-Element (default: `'div'`) |

### ID-Pattern

**Format:** `section__block__element__detail`

**Beispiele:**
- `theory` → Depth 0 (Hauptsektion)
- `theory__intro` → Depth 1 (Block)
- `theory__intro__text` → Depth 2 (Element)
- `theory__intro__text__highlight` → Depth 3 (Detail)

**Depth-Berechnung:**
```typescript
const depth = (id.match(/__/g) || []).length;
```

### Automatische Features

1. **Scroll-Offset:** Fügt automatisch `scroll-mt-24` hinzu
2. **Data-Attribute:**
   - `data-focus-label`: Deutsche Beschreibung
   - `data-focus-depth`: Berechnete Tiefe
3. **Semantisches HTML:** Nutzt `as` Prop für korrektes Element

---

## Manifest Generation

### Script ausführen

```bash
# Alle Seiten
npm run manifest

# Spezifische Seite
npm run manifest:agora
```

### Output

**Datei:** `src/data/AgoraPage.focus-manifest.json`

```json
{
  "source": "AgoraPage.tsx",
  "generated": "2026-02-03T06:15:29.365Z",
  "totalRegions": 19,
  "depthBreakdown": {
    "depth0": 1,
    "depth1": 12,
    "depth2": 6,
    "depth3": 0
  },
  "regions": [
    {
      "id": "theory__intro",
      "label": "Einleitung: Wie wir miteinander reden",
      "depth": 1
    },
    {
      "id": "theory__intro__text",
      "label": "Intro Text",
      "depth": 2
    }
  ]
}
```

### Verwendung des Manifests

**Für AI Timeline-Erstellung:**
1. AI liest Manifest und sieht alle verfügbaren Fokus-Targets
2. AI kann hierarchische Struktur verstehen (Depth 1 = Hauptabschnitte)
3. Deutsche Labels geben Kontext für Timeline-Beschreibungen
4. Reduziert Rätselraten und Post-Production-Korrekturen

---

## Migration Guide

### Schritt 1: Bestehende IDs identifizieren

Suche nach allen Elementen mit `id` Attributen:
```bash
grep -r 'id="' src/pages/AgoraPage.tsx
```

### Schritt 2: Hierarchie planen

Gruppiere IDs nach Tabs und Sektionen:
```
Theory Tab:
  - theory__intro (Einleitung)
    - theory__intro__text
    - theory__intro__image
  - theory__comparison (Vergleich)
    - theory__comparison__left
    - theory__comparison__right
```

### Schritt 3: FocusRegion wrappen

**Vorher:**
```tsx
<div id="theory-intro" className="scroll-mt-24">
  <h2>Einleitung</h2>
</div>
```

**Nachher:**
```tsx
<FocusRegion id="theory__intro" label="Einleitung">
  <h2>Einleitung</h2>
</FocusRegion>
```

### Schritt 4: Timeline aktualisieren

**Vorher (`AgoraPage.json`):**
```json
{
  "seconds": 11,
  "tab": "theory",
  "focusId": "theory-intro",
  "label": "Einleitung"
}
```

**Nachher:**
```json
{
  "seconds": 11,
  "tab": "theory",
  "focusId": "theory__intro",
  "label": "Einleitung"
}
```

### Schritt 5: Manifest generieren

```bash
npm run manifest:agora
```

### Schritt 6: Testen

1. Dev-Server starten: `npm run dev`
2. Audio-Tour abspielen
3. Spotlight-Highlighting prüfen
4. Alle Timeline-Cues durchgehen

---

## Best Practices

### ✅ Gute ID-Namen

```tsx
<FocusRegion id="theory__comparison__left" label="Das Lagerfeuer (Früher)">
```

- Beschreibend
- Hierarchisch strukturiert
- Konsistent mit anderen IDs

### ❌ Schlechte ID-Namen

```tsx
<FocusRegion id="section1" label="Section">
```

- Nicht beschreibend
- Keine Hierarchie
- Generisch

### Labels schreiben

**Gut:**
- "Einleitung: Wie wir miteinander reden"
- "Das Lagerfeuer (Früher)"
- "Daten Intro Text"

**Schlecht:**
- "Section 1"
- "Text"
- "Div"

### Nesting-Strategie

**Regel:** Nutze Depth 2 nur für visuell getrennte Elemente innerhalb eines Blocks.

**Beispiel:**
```tsx
<FocusRegion id="theory__intro" label="Einleitung">
  <div className="flex gap-6">
    <FocusRegion id="theory__intro__text" label="Intro Text">
      <p>Text...</p>
    </FocusRegion>
    <FocusRegion id="theory__intro__image" label="Intro Bild">
      <img src="..." />
    </FocusRegion>
  </div>
</FocusRegion>
```

---

## Workflow Integration

### Für Content-Ersteller

1. **Audio aufnehmen** mit klaren Abschnittswechseln
2. **Manifest ansehen** um verfügbare Fokus-Targets zu sehen
3. **Timeline erstellen** mit IDs aus dem Manifest
4. **Testen** und bei Bedarf anpassen

### Für Entwickler

1. **FocusRegion wrappen** beim Erstellen neuer Seiten
2. **Manifest generieren** nach jeder Änderung
3. **Commit** Manifest mit Code-Änderungen
4. **Review** Manifest in Pull Requests

---

## Technische Details

### Component Implementation

```typescript
export function FocusRegion({
  id,
  label,
  children,
  className = '',
  as: Component = 'div'
}: FocusRegionProps) {
  const depth = (id.match(/__/g) || []).length;

  return (
    <Component
      id={id}
      data-focus-label={label}
      data-focus-depth={depth}
      className={`scroll-mt-24 ${className}`}
    >
      {children}
    </Component>
  );
}
```

### Manifest Generator

**Datei:** `scripts/generate-focus-manifest.ts`

**Funktionsweise:**
1. Liest TSX-Datei als String
2. Regex-Matching für `<FocusRegion>` Tags
3. Extrahiert `id` und `label` Props
4. Berechnet Depth aus ID-Pattern
5. Sortiert nach Depth, dann alphabetisch
6. Schreibt JSON-Manifest

**Regex Pattern:**
```typescript
const regex = /<FocusRegion[^>]*\sid=["']([^"']+)["'][^>]*\slabel=["']([^"']+)["'][^>]*>/g;
```

---

## Troubleshooting

### Problem: Manifest enthält keine Regions

**Ursache:** Regex findet keine FocusRegion-Tags

**Lösung:**
- Prüfe ob `id` und `label` Props gesetzt sind
- Prüfe ob FocusRegion korrekt importiert ist
- Prüfe ob TSX-Datei korrekt formatiert ist

### Problem: Depth ist falsch

**Ursache:** ID folgt nicht dem `__` Pattern

**Lösung:**
- Nutze doppelte Underscores: `theory__intro` nicht `theory_intro`
- Prüfe ID-Konsistenz im gesamten File

### Problem: Timeline funktioniert nicht mit neuen IDs

**Ursache:** JSON nicht aktualisiert

**Lösung:**
1. Öffne `src/data/AgoraPage.json`
2. Ersetze alte IDs mit neuen hierarchischen IDs
3. Teste Audio-Tour

---

## Beispiel: AgoraPage Migration

### Vorher

```tsx
<div id="theory-intro" className="scroll-mt-24">
  <h2>Einleitung</h2>
  <p>Text...</p>
</div>
```

### Nachher

```tsx
<FocusRegion id="theory__intro" label="Einleitung: Wie wir miteinander reden">
  <div className="flex gap-6">
    <FocusRegion id="theory__intro__text" label="Intro Text" className="flex-1">
      <h2>Einleitung</h2>
      <p>Text...</p>
    </FocusRegion>
    <FocusRegion id="theory__intro__image" label="Intro Bild" className="w-2/5">
      <img src="..." />
    </FocusRegion>
  </div>
</FocusRegion>
```

### Resultat

**Manifest:**
- `theory__intro` (depth 1)
- `theory__intro__text` (depth 2)
- `theory__intro__image` (depth 2)

**Timeline:**
```json
{
  "seconds": 11,
  "tab": "theory",
  "focusId": "theory__intro",
  "label": "Einleitung"
}
```

---

## Zusammenfassung

**Vorteile:**
- ✅ Konsistente ID-Struktur
- ✅ Selbstdokumentierend
- ✅ AI-freundlich
- ✅ Reduziert Post-Production-Zeit
- ✅ Einfache Manifest-Generierung

**Workflow:**
1. FocusRegion wrappen
2. Manifest generieren
3. Timeline erstellen
4. Testen

**Nächste Schritte:**
- Weitere Seiten migrieren
- FocusDebugger Component erstellen (optional)
- Timeline-Validator Script entwickeln

---

*Dokumentiert: Februar 2026*

# Interaction Engine Guide

Das **Interaction Engine System** ermöglicht es, native, Firebase-basierte interaktive Elemente (Umfragen, Quizzes, Schätzungen) direkt in Audio-geführte Reports einzubetten. Es ersetzt externe Lösungen wie Mentimeter oder Lumi durch eine vollständig kontrollierte, datengeschützte Architektur.

---

## 🚀 Schnellstart: Eine neue Interaktion erstellen

### 1. Konfiguration (JSON)
Erstellen Sie eine JSON-Datei in `src/data/interactions/[id].json`.

**Beispiel (`my-poll.json`):**
```json
{
  "id": "my-poll",
  "type": "poll",
  "question": "Was denken Sie?",
  "options": [
    { "id": "yes", "label": "Ja, absolut" },
    { "id": "no", "label": "Nein, eher nicht" }
  ]
}
```

### 2. In eine Seite einbetten
Nutzen Sie die `InteractionShell` Komponente in Ihrem Report.

```tsx
import { InteractionShell } from '@/components/interactions/InteractionShell';
import myPoll from '@/data/interactions/my-poll.json';

// In der Page-Komponente
<InteractionShell 
  config={myPoll as any} 
  startTime={45} // Startzeitpunkt im Audio (Sekunden)
/>
```

### 3. Fragebögen & Sequenzen (Multi-Slide)
Um mehrere Fragen nacheinander anzuzeigen, nutzen Sie `InteractionSequence`.

```tsx
import { InteractionSequence } from '@/components/interactions/InteractionSequence';

// Liste von IDs (müssen als JSON existieren)
const questions = ['q1', 'q2', 'q3'];

// Modus "list": Alle untereinander (ideal für Audio-Guided chunks)
<InteractionSequence interactionIds={questions} mode="list" />

// Modus "stepped": Eine nach der anderen (One-Take Questionnaire)
<InteractionSequence interactionIds={questions} mode="stepped" />
```

---

## 🛠️ Unterstützte Interaktions-Typen

| Typ | Beschreibung | Besondere Felder |
|-----|--------------|-----------------|
| `poll` | Klassische Umfrage mit Balken. | `options` |
| `quiz` | Wissenstest mit Richtig/Falsch Feedback. | `options` mit `isCorrect: true` |
| `slider` | Skala von 0 bis 100 mit Durchschnittsanzeige. | `minLabel`, `maxLabel` |
| `ranking` | Items in eine Reihenfolge bringen. | `options` |
| `points` | 100 Punkte auf verschiedene Items verteilen. | `options` |
| `guess` | Eine Zahl schätzen mit Auflösung. | `correctValue`, `unit` |

---

## ⏱️ Der Interaction Director Lifecycle

Die `InteractionShell` synchronisiert sich automatisch mit der Audio-Wiedergabe:

1.  **Input Phase (0s - 30s nach Start):** Nutzer kann abstimmen.
2.  **Locked Phase (30s - 35s):** Eingabe gesperrt, "Warten auf Ergebnisse" Anzeige.
3.  **Reveal Phase (> 35s):** Ergebnisse/Auflösung werden animiert eingeblendet.

> [!TIP]
> Die Phasen können über die Props der `InteractionShell` gesteuert werden, falls keine Audio-Anbindung gewünscht ist (z.B. Standalone).

---

## 🔗 Embedding (Micro-Frontend)

Jede Interaktion ist automatisch als Standalone-Widget unter folgendem Pfad verfügbar:
`/#/embed/[interaction-id]`

**Beispiel:** `https://.../#/embed/demo-quiz`

---

## 🔒 Architektur & Datenschutz

- **Firebase Firestore**: Speichert aggregierte Ergebnisse (atomare Inkremente).
- **Anonymität**: Keine Speicherung von PII (Personally Identifiable Information). IP-Limitierung erfolgt via Firestore Rules (geplant) oder einfaches LocalStorage-Fingerprinting (aktiv).
- **Swiss Orthography**: Alle Texte werden automatisch durch `swissifyData` verarbeitet (`ß` -> `ss`).

---

## 📈 Daten-Modell (Firestore)

**Collection:** `interactions`
**Document ID:** `[interaction-id]`

```json
{
  "total_votes": 42,
  "options": {
    "opt1": 12,
    "opt2": 30
  }
}
```

---

## � Nutzer-Fortschritt & Zusammenfassungen

Um die Privatsphäre zu wahren und gleichzeitig ein Lernerlebnis zu bieten, nutzt das System einen hybriden Ansatz:

1.  **Aggregierte Daten (Firebase)**: Alle Stimmen werden anonym in Firebase hochgezählt. Niemand kann sehen, wer was gewählt hat.
2.  **Persönliche Daten (LocalStorage)**: Die individuellen Antworten des Schülers werden ausschließlich in seinem Browser gespeichert (`localStorage.getItem('vote_[id]')`).

### Einen "Ergebnis-Report" erstellen
Sie können eine Zusammenfassung aller Antworten anzeigen, indem Sie über alle Interaktions-IDs iterieren und den LocalStorage abfragen. Dies ermöglicht:
- Eine "Meine Antworten" Seite.
- Einen Vergleich zwischen eigener Schätzung und dem Community-Durchschnitt am Ende einer Lektion.

### Persistenz
Da `localStorage` verwendet wird, bleiben Antworten erhalten, solange der Browser-Cache nicht gelöscht wird. Ein Wechsel des Endgeräts (z.B. Handy zu IPad) synchronisiert die Daten aktuell nicht (da kein Login-System existiert).

---

## �🛠️ Fehlerbehebung

### Ergebnisse zeigen immer 0%
- Prüfen Sie, ob Firebase korrekt initialisiert ist.
- Stellen Sie sicher, dass die Dokument-ID in Firestore mit der `id` im JSON übereinstimmt.
- Prüfen Sie die Browser-Konsole auf Permission-Errors.

### JSON wird nicht geladen (Embed)
- Der `EmbedPage` nutzt `import.meta.glob`. Neue JSON-Dateien im `src/data/interactions/` Ordner werden automatisch beim Build erkannt.

---

*Stand: Februar 2026*

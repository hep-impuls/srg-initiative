# Pedagogical Interaction Guide

## Die Lern-Philosophie: Audio-Geführter Dialog

Das Ziel der Applikation ist nicht blosse Informationsvermittlung (Push), sondern ein **simulierter Dialog**. Der Nutzer soll nicht nur *zuhören*, sondern *mitdenken* und *entscheiden*.

---

## 1. Das Dialogische Modell

Wir simulieren ein Gespräch zwischen dem Experten (Audio) und dem Teilnehmer (UI).

### Das Pattern: "Trigger -> Reflektieren -> Auflösen"

Jede Interaktion folgt einem psychologischen Dreischritt:

1.  **Trigger (Audio):** Der Sprecher stellt eine provozierende Frage oder These in den Raum. *("Denkst du, SRG-Gebühren sind fair?")*
2.  **Reflektion (Interaktion):** Das Audio stoppt. Der Nutzer ist gezwungen, Stellung zu beziehen. Er investiert "Mental Effort".
3.  **Auflösung (Weiterführung):** Das Audio fährt fort und nimmt idealerweise Bezug auf die mögliche Antwort. *("Viele sehen das kritisch, aber schau mal hier...")*

---

## 2. Interaction Taxonomy (Wann nutze ich was?)

Nutzen Sie den richtigen Interaktionstyp für das richtige Lernziel.

### A. Aktivierung (The Opener)
*Ziel: Vorwissen aktivieren, Interesse wecken, "Skin in the game".*
*   **Typ:** `Wordcloud`, `Ranking`, `Poll` (Meinung)
*   **Wann:** Ganz am Anfang (Minute 0-2).
*   **Beispiel:** "Welche Social Media Apps nutzt du am meisten?"

### B. Formative Check (The Anchor)
*Ziel: Sicherstellen, dass ein komplexes Konzept verstanden wurde, bevor es weitergeht.*
*   **Typ:** `Quiz` (Richtig/Falsch)
*   **Wann:** Nach einem dichten Theorie-Block.
*   **Beispiel:** "Was bedeutet der Begriff 'Gatekeeper'?"

### C. Social Comparison (The Mirror)
*Ziel: Die eigene Wahrnehmung mit der Realität (Daten) oder der Gruppe abgleichen.*
*   **Typ:** `Guess` (Schätzen), `Slider`, `Poll` (Vergleich)
*   **Wann:** Im Datenteil.
*   **Beispiel:** "Schätze, wie viel Werbegeld ins Ausland abfliesst." -> *Auflösung zeigt die echte Zahl.*

### D. Transfer (The Action)
*Ziel: Das Gelernte auf eine neue Situation anwenden oder eine Entscheidung treffen.*
*   **Typ:** `Points` (Budget verteilen), `Ranking` (Priorisieren).
*   **Wann:** Am Ende, als Fazit.
*   **Beispiel:** "Du bist Medienminister. Verteile das Budget neu."

---

## 3. Das "Pre/Post" Pattern (Messung von Veränderung)

Eine besonders mächtige didaktische Methode, die im **Agora-Report** verwendet wird.

### Konzept
Wir stellen dieselbe (oder eine sehr ähnliche) Frage zweimal:
1.  **Pre-Unit:** Ganz am Anfang, basierend auf Bauchgefühl.
2.  **Post-Unit:** Ganz am Ende, basierend auf dem neuen Wissen.

### Ziel
Wir wollen dem Nutzer seinen eigenen Lernfortschritt oder Meinungswechsel sichtbar machen ("Reflected Growth").

### Umsetzung
*   **Start:** `agora-intro-money` (Frage: "Sind 335 CHF zu viel?")
*   **Ende:** `agora-outro-money-check` (Frage: "Würdest du jetzt anders entscheiden?")
*   **Report:** Die Ergebnisseite (`ResultsPage`) stellt diese beiden Datenpunkte gegenüber.

---

## 4. Best Practices für Autoren

*   **Keine "Beschäftigungstherapie":** Jede Interaktion muss einen Zweck haben. Wenn das Audio auch ohne die Interaktion funktioniert, ist die Interaktion überflüssig.
*   **Kurz halten:** Niemand will während eines Podcasts 5 Minuten lesen. Fragen müssen "snackable" sein.
*   **Feedback ist King:** Eine falsche Antwort im Quiz ist ein "Teachable Moment". Nutzen Sie die Auflösung, um zu erklären *warum* es falsch war, nicht nur rot zu markieren.
*   **Schweizer Kontext:** Nutzen Sie `swissifyData`, um sicherzustellen, dass Inhalte lokalisiert wirken (z.B. "ss" statt "ß").

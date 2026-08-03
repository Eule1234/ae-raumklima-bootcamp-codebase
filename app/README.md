# Lernenden-App

In diesem Ordner entwickeln die Lernenden ihre **Raumklima-Monitor-Webapp**.

## Ablage

- `index.html` – Grundgerüst der Seite
- `style.css` – Styling (Layout, Farben, Statusklassen `.gut`, `.kritisch`, `.schlecht`)
- `script.js` – Logik (Daten laden, Status berechnen, Verlauf rendern)
- `data.json` *(ab Tag 2)* – Initial-Seed im Push-Bundle-Format (Snapshot-Fallback Stufe 3)
- `snapshot-strategie.md` – Kurzfassung der dreistufigen Fallback-Logik

## Setup

1. Diesen Ordner in VS Code öffnen
2. **Live Server** Extension installieren (falls noch nicht vorhanden)
3. Rechtsklick auf `index.html` → "Open with Live Server"
4. Browser öffnet sich automatisch

## Datenquelle

Die App lädt ihre Daten vom **SuvaSense-Backend**, das vom Trainerteam
zentral bereitgestellt wird.

Aktuelle `API_BASE` und Demo-Seriennummer einsetzen in `script.js`:

```js
const API_BASE = 'http://<vom-trainer-bekanntgegeben>:8080/api/v1';
let currentSerial = 'SN12345';   // Demo-Seriennummer vom Trainer
```

Die Snapshot-Strategie (API → localStorage → Seed) ist in
`snapshot-strategie.md` ausführlich beschrieben.

## Wichtig

- **Es gibt kein lokales Backend in diesem Repo.** Deine App spricht
  direkt mit dem SuvaSense-Backend im Schwester-Repo. URL und
  Seriennummer kommen vom Trainer.
- Eigener Code gehört ausschliesslich in diesen `app/`-Ordner.
- Eigene Commits auf eigene Feature-Branches (siehe `CODE_OF_CONDUCT.md`).
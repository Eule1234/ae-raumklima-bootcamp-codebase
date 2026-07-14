# Lernenden-App

In diesem Ordner entwickeln die Lernenden ihre **Raumklima-Monitor-Webapp**.

## Ablage

- `index.html` – Grundgerüst der Seite
- `style.css` – Styling (Layout, Farben, Statusklassen `.gut`, `.kritisch`, `.schlecht`)
- `script.js` – Logik (Daten laden, Status berechnen, Verlauf rendern)
- `data.json` *(ab Tag 2)* – Lokale Fallback-Daten, falls die API nicht erreichbar ist

## Setup

1. Diesen Ordner in VS Code öffnen
2. **Live Server** Extension installieren (falls noch nicht vorhanden)
3. Rechtsklick auf `index.html` → "Open with Live Server"
4. Browser öffnet sich automatisch

## API-Anbindung (ab Tag 3)

Die App lädt ihre Daten aus der Mock-API unter `../mock-api/` (oder einer deployten URL – siehe Tag-3-Leitfaden).

Aktuelle `API_BASE` einsetzen in `script.js`:

```js
const API_BASE = 'http://localhost:3000/api/v1'; // während Entwicklung
// const API_BASE = 'https://mock.raumklima-bootcamp.dev/api/v1'; // deployed
const USE_API = true;
```

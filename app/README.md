# app/ – deine App

!!! danger "KI ist verboten"
    Während des Bootcamps darfst du **keine KI-Tools** verwenden – nicht für Fragen, nicht für Code, nicht für Erklärungen.

    **Deine Quellen:** [QUELLEN.md](QUELLEN.md) (W3Schools, MDN) und dein Trainer (1:1).

!!! info "Wichtigste Regel"
    Du arbeitest **alleine** in deinem eigenen Fork. Es gibt keine
    Teams, keine Pair-Programming-Sessions. Du baust **deine** App,
    nicht eine gemeinsame.

## Was gehört in `app/`?

| Datei | Wofür | Wann |
|---|---|---|
| `index.html` | Struktur und Inhalt | Tag 1 anlegen |
| `style.css` | Aussehen und Layout | Tag 1 erweitern |
| `script.js` | Logik und Daten laden | Ab Tag 2 |
| `data.json` | Initial-Seed (Fallback Stufe 3) | Tag 2 anlegen |
| `QUELLEN.md` | W3Schools-Links + KI-Verbot | Tag 1 lesen |
| `snapshot-strategie.md` | Wie dein Code mit dem Backend funktioniert | Ab Tag 3 lesen |

**Du berührst KEINE anderen Dateien in diesem Repo.** Nur `app/`
ist dein Workspace.

## Setup (einmalig)

Falls noch nicht gemacht:

1. **VS Code öffnen** in diesem `app/`-Ordner:
   ```bash
   code app/
   ```
2. **Live Server Extension** installieren (in VS Code)
3. **Rechtsklick auf `index.html`** → **Open with Live Server**
4. Der Browser öffnet sich automatisch

## Datenquelle

Deine App lädt ihre Daten vom **SuvaSense-Backend**, das vom
Trainerteam zentral bereitgestellt wird. Die URL bekommst du am
Tag 3 vom Trainer.

```javascript
// In script.js, ganz oben:
const API_BASE = 'http://<vom-trainer-bekanntgegeben>:8080/api/v1';
let currentSerial = 'SN12345';   // Demo-Seriennummer
```

### Drei-Stufen-Fallback (ab Tag 3)

1. **API** (SuvaSense-Backend, wenn verfügbar)
2. **LocalStorage** (Snapshot vom letzten API-Call)
3. **`data.json`** (Initial-Seed, falls weder API noch Snapshot)

Details: [snapshot-strategie.md](snapshot-strategie.md)

## Workflow (alle 5 Tage)

1. **Theorie lesen** im [Lernleitfaden](https://heiligerg.github.io/ae-raumklima-bootcamp/)
2. **Übung durcharbeiten** (Schritt für Schritt, Beispiel-Code abtippen)
3. **Projekt weiterbauen** in `app/` (alleine, mit DevTools)
4. **Commit + Push** auf deinen Fork:
   ```bash
   git add .
   git commit -m "Tag X: Was ich gebaut habe"
   git push
   ```
5. **Im Lernleitfaden Self-Check** machen am Tagesende

## Was du NICHT tust

- ❌ **Andere Repos klonen** – du brauchst nur diesen Fork
- ❌ **Andere Ordner berühren** – nur `app/`
- ❌ **KI-Tools verwenden** – siehe [QUELLEN.md](QUELLEN.md)
- ❌ **Branch-Workflow** – du arbeitest direkt auf `main`
- ❌ **Pull Requests** – du brauchst keinen Reviewer
- ❌ **Code von Mitlernenden kopieren** – Einzelarbeit!

## Hilfe

In dieser Reihenfolge:

1. **W3Schools** – [QUELLEN.md](QUELLEN.md) hat die Links
2. **MDN** – für Details
3. **DevTools (F12)** – Konsole zeigt oft die Antwort
4. **Trainer fragen** – 1:1, kurze präzise Frage

## Wichtige Links

- [QUELLEN.md](QUELLEN.md) – W3Schools + KI-Verbot
- [snapshot-strategie.md](snapshot-strategie.md) – Wie dein Code mit dem Backend funktioniert
- [Lernleitfaden online](https://heiligerg.github.io/ae-raumklima-bootcamp/) – Theorie, Übungen, Projekte

!!! tip "Tag 1: Klein anfangen"
    Deine erste Datei braucht nur 5 Zeilen. Nicht überfordern.
    **Lies das Theorie-Modul zuerst**, dann die Übung, dann das Projekt.
    Das Projekt wächst über 4 Tage – nicht alles auf einmal.
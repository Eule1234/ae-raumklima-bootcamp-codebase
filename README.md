# AE Raumklima Bootcamp – Codebase

In diesem Repository arbeiten die Lernenden während des fünftägigen Bootcamps an ihrer Web-App. Begleitend liegt die **Mock-API** im Unterordner `mock-api/`, damit ohne Sensor-Hardware entwickelt und getestet werden kann.

## Inhalt

| Pfad        | Zweck                                                                 |
|-------------|-----------------------------------------------------------------------|
| `app/`      | **Hier arbeiten die Lernenden.** Enthält ihre `index.html`, `style.css`, `script.js` und (ab Tag 2) `data.json`. |
| `mock-api/` | Node/Express-Backend mit deterministischen Sensordaten für 3 Räume.   |
| `CODE_OF_CONDUCT.md` | Verhaltens- und Git-Workflow-Regeln für alle Mitwirkenden.    |

## Schnellstart für Lernende (Tag 1)

```bash
# 1. App-Ordner im Editor öffnen
code app/

# 2. Drei Dateien anlegen: index.html, style.css, script.js
#    (gemäss Anleitung im Lernleitfaden, Tag 1)

# 3. Live Server in VS Code starten (Rechtsklick auf index.html)
```

## Schnellstart für die Mock-API

```bash
cd mock-api
npm install
npm start
# → läuft auf http://localhost:3000
```

Details siehe [`mock-api/README.md`](mock-api/README.md).

## Wichtig für Lernende

- **Berührt die Mock-API nicht.** Sie ist vorkonfiguriert und wird vom Trainerteam gepflegt.
- Wenn eure App Daten aus der API lädt, fragt beim Trainer nach der aktuellen `API_BASE` (siehe Tag-3-Leitfaden).
- Eigener Code gehört in `app/`, eigene Commits auf eigene Feature-Branches (siehe `CODE_OF_CONDUCT.md` § 2).

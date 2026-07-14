# AE Raumklima Bootcamp – Codebase

In diesem Repository arbeiten die Lernenden während des fünftägigen Bootcamps an ihrer Web-App. Begleitend liegt die **Mock-API** im Unterordner `mock-api/`, die lokal auf dem Laptop gestartet wird – so können alle ohne Sensor-Hardware und ohne externe Abhängigkeiten entwickeln und testen.

## Inhalt

| Pfad        | Zweck                                                                 |
|-------------|-----------------------------------------------------------------------|
| `app/`      | **Hier arbeiten die Lernenden.** Enthält ihre `index.html`, `style.css`, `script.js` und (ab Tag 2) `data.json`. |
| `mock-api/` | Node/Express-Backend mit deterministischen Sensordaten für 3 Räume. Wird lokal gestartet. |
| `CODE_OF_CONDUCT.md` | Verhaltens- und Git-Workflow-Regeln für alle Mitwirkenden.    |

## Schnellstart für Lernende (Tag 1)

```bash
# 1. Codebase im Editor öffnen
code app/

# 2. index.html, style.css, script.js anlegen
#    (gemäss Anleitung im Lernleitfaden, Tag 1)

# 3. Live Server in VS Code starten (Rechtsklick auf index.html)
```

## Schnellstart für die Mock-API (ab Tag 3)

In einem **zweiten Terminal**:

```bash
cd mock-api
npm install   # nur beim ersten Mal
npm start
# → läuft auf http://localhost:3000
```

Details siehe [`mock-api/README.md`](mock-api/README.md).

## Zwei Terminals, ein Projekt

Während des Bootcamps laufen zwei Prozesse parallel:

| Prozess        | Wo                                         | URL                        |
|----------------|--------------------------------------------|----------------------------|
| Mock-API       | Terminal 2 (`mock-api/`)                   | `http://localhost:3000`    |
| App + Live Server | VS Code Live Server auf `app/index.html` | `http://127.0.0.1:5500`    |

Die App im Browser ruft die API über `fetch()` auf – genau so, wie eine echte Web-App ein echtes Backend ansprechen würde.

## Wichtig für Lernende

- **Berührt die Mock-API nicht.** Sie ist vorkonfiguriert und wird vom Trainerteam gepflegt.
- Wenn eure App Daten aus der API lädt, nutzt sie `http://localhost:3000/api/v1` als `API_BASE` (siehe Tag-3-Leitfaden).
- Eigener Code gehört in `app/`, eigene Commits auf eigene Feature-Branches (siehe `CODE_OF_CONDUCT.md` § 2).

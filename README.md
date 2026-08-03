# AE Raumklima Bootcamp – Codebase

In diesem Repository arbeiten die Lernenden während des fünftägigen Bootcamps an ihrer Web-App. Die App spricht direkt mit dem **SuvaSense-Backend** im Schwester-Repo `SuvaSense` – ihr braucht **kein lokales Backend** zu starten.

## Inhalt

| Pfad        | Zweck                                                                 |
|-------------|-----------------------------------------------------------------------|
| `app/`      | **Hier arbeiten die Lernenden.** Enthält ihre `index.html`, `style.css`, `script.js`, `data.json` (ab Tag 2) und `snapshot-strategie.md` (Notiz für Tag 3). |
| `CODE_OF_CONDUCT.md` | Verhaltens- und Git-Workflow-Regeln für alle Mitwirkenden.    |

## Schnellstart für Lernende (Tag 1)

```bash
# 1. Codebase im Editor öffnen
code app/

# 2. index.html, style.css, script.js anlegen
#    (gemäss Anleitung im Lernleitfaden, Tag 1)

# 3. Live Server in VS Code starten (Rechtsklick auf index.html)
```

## Datenquelle ab Tag 3

Die App lädt ihre Daten vom **SuvaSense-Backend** (Go + Postgres + Mosquitto),
das vom Trainerteam zentral bereitgestellt wird. Die konkrete URL und die
Demo-Seriennummer werden am Tag 3 vom Trainer bekanntgegeben.

Wenn ihr offline testen wollt, nutzt den mitgelieferten `data.json`-Seed
(siehe `app/snapshot-strategie.md`) oder den Test-Server aus dem
Schwester-Ordner `../Test-Frontend/test-server.py`.

## Ein Prozess, ein Projekt

Im Bootcamp läuft nur **ein** Prozess auf eurem Laptop: der Live Server für die App.

| Prozess        | Wo                                         | URL                        |
|----------------|--------------------------------------------|----------------------------|
| App + Live Server | VS Code Live Server auf `app/index.html` | `http://127.0.0.1:5500`    |
| SuvaSense-Backend | Trainer-Laptop oder Schulungs-Server    | `http://<vom-trainer>:8080` |

Die App im Browser ruft die API über `fetch()` auf – genau so, wie eine echte Web-App ein echtes Backend ansprechen würde.

## Wichtig für Lernende

- **Eigener Code gehört ausschliesslich in `app/`** – nirgendwo sonst in diesem Repo.
- Eigene Commits auf eigene Feature-Branches (siehe `CODE_OF_CONDUCT.md` § 2).
- Das SuvaSense-Backend wird vom Trainerteam verwaltet – **nicht verändern**.
# Raumklima-Backend (Node + Express) – ⚠️ DEPRECATED

!!! warning "Nicht mehr Bootcamp-Wahrheit"
    Diese Mock-API ist **nicht mehr** die offizielle Datenquelle für
    das Bootcamp. Das aktuelle Backend ist das **SuvaSense-Backend**
    im Schwester-Repo `SuvaSense` (siehe [Architektur-Doku](https://ae-raumklima-bootcamp.readthedocs.io/)).

    Der Ordner bleibt im Repo als **pädagogisches Beispiel** für eine
    Node/Express-API mit MySQL-Anbindung. Lernende dürfen ihn gerne
    lesen, **aber nicht produktiv im Bootcamp nutzen**.

!!! danger "Für Lernende: nicht verwenden!"
    Deine App im `app/`-Ordner spricht **direkt** mit dem
    SuvaSense-Backend. Du brauchst diese Mock-API nicht zu starten
    und auch keine Daten hier reinzuschicken.

## Was bleibt

Der Ordner demonstriert:

- Eine einfache Node/Express-REST-API mit zwei Betriebsmodi (RAM/MySQL)
- Eingabevalidierung mit `X-API-Key`-Auth-Header
- CORS-Handling
- Docker-Compose-Setup mit MySQL + PHPMyAdmin

Wer selbst eine Express-API lernen will, kann den Code gerne als
Vorlage verwenden.

## Migration auf SuvaSense

| Aspekt | Diese Mock-API | SuvaSense |
|---|---|---|
| Endpoints | `/api/v1/rooms/...` | `/api/v1/sensors/...` |
| Identität | Raum-ID (`B101`) | Seriennummer (`SN12345`) |
| Ingest | HTTP POST, X-API-Key | MQTT, anonym |
| Datenmodell | flach (`temperature`/`humidity`) | Push-Bundle pro MQTT-Message |
| Persistenz | MySQL oder RAM | Postgres |
| Stack | Node + Express | Go + Postgres + Mosquitto |

Ausführliche Migration im Schwester-Repo `ae-raumklima-bootcamp`:
- [API-Vertrag](https://ae-raumklima-bootcamp.readthedocs.io/projekt/api-vertrag/)
- [Architektur](https://ae-raumklima-bootcamp.readthedocs.io/projekt/architektur/)

---

Der nachfolgende Original-Inhalt bleibt für Nachschlagezwecke erhalten.
```

## Architektur (historisch)

```
┌────────────────────┐    POST /api/v1/ingest    ┌────────────────────┐
│ ESP32 + DHT22      │ ─────────────────────────▶│  Node/Express      │
│ (Plattform-Team)   │   X-API-Key Header        │  Backend           │
│ Arduino IDE        │                           │  ┌──────────────┐  │
└────────────────────┘                           │  │   MySQL 8    │  │
                                                 │  └──────────────┘  │
                                                 └──────────┬─────────┘
                                                            │ GET
                                                            ▼
                                                 ┌────────────────────┐
                                                 │  Lernenden-App     │
                                                 │  (HTML/CSS/JS)     │
                                                 └────────────────────┘
```

## Endpunkte

| Methode | Pfad                                          | Auth         | Zweck                          |
|---------|-----------------------------------------------|--------------|--------------------------------|
| GET     | `/api/v1/rooms`                               | –            | Liste der Räume                |
| GET     | `/api/v1/rooms/:roomId/measurements/latest`   | –            | Aktuellster Messwert           |
| GET     | `/api/v1/rooms/:roomId/measurements?limit=N`   | –            | Verlauf (neueste zuerst)       |
| POST    | `/api/v1/ingest`                              | `X-API-Key`  | Sensordaten vom ESP empfangen  |

## Datenmodell

```jsonc
// Room
{ "id": "B101", "name": "Schulungsraum 101", "floor": 1 }

// Measurement (GET-Antwort und POST-Body sind identisch)
{ "room": "B101", "temperature": 22.5, "humidity": 52, "timestamp": "2026-07-14T12:00:00.000Z" }
```

## Zwei Betriebsmodi

Das Backend läuft wahlweise **mit oder ohne MySQL**. Der Modus wird über die env-Variable `USE_DB` gesteuert.

### Modus 1: In-Memory (Standard für Lernende)

Keine Datenbank nötig. Ideal für die Lernenden-Webapp – einfach starten, Daten sind da.

```bash
cd mock-api
npm install
npm start
```

→ läuft auf <http://localhost:3000>, Daten leben nur im RAM, deterministische Mock-Werte.

### Modus 2: Mit MySQL (für Plattform-Team / Demo)

Persistente Speicherung, PHPMyAdmin zur Inspektion. Ideal, wenn echte ESP-Daten reinlaufen oder die Daten einen Neustart überleben sollen.

```bash
cd mock-api
docker compose up -d
```

Startet:
- API auf <http://localhost:3000>
- PHPMyAdmin auf <http://localhost:8080> (Login: `raumklima` / `raumklima`)
- MySQL auf `localhost:3306` (intern via Container-Service `mysql`)

Beim ersten Start wird das Schema automatisch angelegt und mit 3 Räumen + 50 historischen Messwerten pro Raum (deterministisch) gefüllt.

**Daten an die API schicken (Plattform-Team / ESP):**

```bash
curl -X POST http://localhost:3000/api/v1/ingest \
  -H "Content-Type: application/json" \
  -H "X-API-Key: change-me-please" \
  -d '{"room":"B101","temperature":22.5,"humidity":52,"timestamp":"2026-07-14T12:00:00Z"}'
```

Der API-Key steht in `.env` (`INGEST_API_KEY`). Im Produktivbetrieb durch einen sicheren Wert ersetzen.

**Daten in PHPMyAdmin ansehen:**
1. <http://localhost:8080> öffnen
2. Login `raumklima` / `raumklima`
3. Datenbank `raumklima` → Tabelle `measurements`

### Stoppen

```bash
# Modus 1: Ctrl+C im Terminal
# Modus 2:
docker compose down          # Container stoppen
docker compose down -v       # zusätzlich MySQL-Volume löschen (alle Messwerte weg)
```

## Konfiguration (`.env`)

Kopiere `.env.example` zu `.env` und passe an:

| Variable           | Default                         | Bedeutung                                                |
|--------------------|---------------------------------|----------------------------------------------------------|
| `PORT`             | `3000`                          | HTTP-Port                                                |
| `ALLOWED_ORIGINS`  | `*`                             | CORS-Whitelist (Komma-getrennt)                          |
| `USE_DB`           | `false`                         | `true` = MySQL-Modus, `false` = In-Memory                |
| `MYSQL_HOST`       | `localhost`                     | MySQL-Host (in Docker: `mysql`)                          |
| `MYSQL_PORT`       | `3306`                          | MySQL-Port                                               |
| `MYSQL_USER`       | `raumklima`                     | MySQL-User                                               |
| `MYSQL_PASSWORD`   | `raumklima`                     | MySQL-Passwort                                           |
| `MYSQL_DATABASE`   | `raumklima`                     | Datenbankname                                            |
| `INGEST_API_KEY`   | `change-me-please`              | API-Key für `POST /api/v1/ingest` (Header `X-API-Key`)   |
| `NPM_REGISTRY`     | `https://registry.npmjs.org/    | npm-Registry (für Docker-Build bei Firmen-Proxy)         |
| `CA_CERT_PATH`     | (leer)                          | Pfad zum CA-Zert (für Firmen-Proxy)                      |

## Firmen-Proxy (Nexus, Artifactory, …) im Docker-Build

Wenn dein Rechner hinter einem Firmen-Proxy sitzt und der Build-Container keinen direkten Internet-Zugriff hat, passiert das `npm install` auf deinem **Host** (mit deiner normalen npm-Config, inkl. Nexus/Cert). Das fertige `node_modules` wird dann ins Image kopiert. Dafür ist kein zusätzliches Setup nötig – `docker compose up` funktioniert direkt.

Falls du den API-Container selbst noch nachinstallieren lassen willst (z. B. für `npm install` im Debug-Modus):

1. CA-Zert unter `certs/corp-root.cer` ablegen (wird nicht committet)
2. In `.env` setzen:
   ```
   NPM_REGISTRY=https://nexus.example.com/repository/npm-all/
   CA_CERT_PATH=./certs/corp-root.cer
   ```
3. `docker compose build`

## Test-Beispiele

```bash
# Räume abfragen
curl http://localhost:3000/api/v1/rooms

# Letzte Messung B101
curl http://localhost:3000/api/v1/rooms/B101/measurements/latest

# Verlauf B102 (10 Werte)
curl "http://localhost:3000/api/v1/rooms/B102/measurements?limit=10"

# Messung senden (Plattform-Team / ESP)
curl -X POST http://localhost:3000/api/v1/ingest \
  -H "Content-Type: application/json" \
  -H "X-API-Key: change-me-please" \
  -d '{"room":"B101","temperature":22.5,"humidity":52,"timestamp":"2026-07-14T12:00:00Z"}'
```

## Daten-Charakter

Pro Raum sind die Basistemperaturen und -feuchtigkeiten so gewählt, dass alle drei Statuswerte (gut / kritisch / schlecht) realistisch vorkommen:

| Raum | Basis-Temp | Basis-Feuchte | Beobachtbarer Status     |
|------|------------|---------------|--------------------------|
| B101 | 22.0 °C    | 50 %          | meist `gut`              |
| B102 | 25.0 °C    | 45 %          | oft `kritisch`           |
| B103 | 17.5 °C    | 72 %          | oft `kritisch`/`schlecht`|

Die 50 initialen Messwerte pro Raum werden im 15-Minuten-Abstand generiert, ausgehend von der aktuellen Zeit.

# Mock-API für das AE Raumklima Bootcamp

Dieses Verzeichnis enthält das **Mock-Backend** für die Lernenden-Webapp.
Es liefert deterministische Sensordaten für die drei Schulungsräume **B101**, **B102** und **B103** und implementiert exakt den [API-Vertrag](../../ae-raumklima-bootcamp/docs/projekt/api-vertrag.md) aus dem Lernleitfaden.

Die Mock-API ist so gebaut, dass sie nahtlos durch die spätere echte Sensor-API der Plattformentwickler ersetzt werden kann – die Lernenden müssen am Frontend nichts anpassen, sobald die echte API unter derselben URL und mit demselben Schema antwortet.

## Endpunkte

| Methode | Pfad                                            | Beschreibung                       |
|---------|-------------------------------------------------|------------------------------------|
| GET     | `/api/v1/rooms`                                 | Liste aller Räume                  |
| GET     | `/api/v1/rooms/:roomId/measurements/latest`     | Aktuellster Messwert eines Raums   |
| GET     | `/api/v1/rooms/:roomId/measurements?limit=10`   | Verlauf der letzten N Messwerte    |

## Datenmodell

```jsonc
// Room
{ "id": "B101", "name": "Schulungsraum 101", "floor": 1 }

// Measurement
{ "room": "B101", "temperature": 23.4, "humidity": 51, "timestamp": "2026-07-14T10:30:00.000Z" }
```

## Lokal starten

```bash
cd mock-api
npm install
npm start
```

Danach ist die API erreichbar unter <http://localhost:3000> (Browser zeigt Übersicht) und <http://localhost:3000/api/v1> (API-Basis).

Für Auto-Reload während der Entwicklung:

```bash
npm run dev
```

## Konfiguration

Kopiere `.env.example` zu `.env` und passe die Werte an:

| Variable           | Default | Bedeutung                                  |
|--------------------|---------|--------------------------------------------|
| `PORT`             | `3000`  | HTTP-Port                                  |
| `ALLOWED_ORIGINS`  | `*`     | Kommagetrennte CORS-Whitelist (`*` = alle) |

Für lokales Entwickeln reicht `*`. Sobald die API öffentlich deployt wird, sollte man die Origins einschränken (z. B. `https://username.github.io`).

## Daten-Charakter

Die Daten sind **deterministisch** (kein random Seed-Reset nötig) und enthalten pro Raum leicht unterschiedliche Basistemperaturen und -feuchtigkeiten, damit die Lernenden alle drei Statuswerte (gut, kritisch, schlecht) antreffen können:

| Raum | Basis-Temp | Basis-Feuchte | Beobachtbarer Status   |
|------|------------|---------------|------------------------|
| B101 | 22.0 °C    | 50 %          | meist `gut`            |
| B102 | 25.0 °C    | 45 %          | oft `kritisch`         |
| B103 | 19.0 °C    | 65 %          | oft `kritisch`/`schlecht` |

Die 50 letzten Messwerte pro Raum werden im 15-Minuten-Abstand generiert.

## Deployment

Wird in einem späteren Schritt festgelegt. Mögliche Ziele: Render, Railway, Fly.io (alle mit Gratis-Tier für solche Demos).

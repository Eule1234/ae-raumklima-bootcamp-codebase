# Snapshot-Strategie (Notiz für Lernende)

Diese Notiz fasst die Snapshot-Strategie aus
[Tag 3: Integration](https://ae-raumklima-bootcamp.readthedocs.io/tag-3/integration/)
nochmals in Kurzform zusammen – direkt im App-Workspace, damit du sie
beim Coden griffbereit hast.

## Dreistufige Fallback-Reihenfolge

Deine App versucht, Daten zu holen, in dieser Reihenfolge:

1. **Live-API:** `GET http://<vom-trainer>:8080/api/v1/sensors/<serial>/readings`
2. **Snapshot:** `localStorage.getItem('snapshot:<serial>')`
3. **Initial-Seed:** `fetch('data.json')` (im selben `app/`-Ordner)

Bei Erfolg schreibt die App die Live-Daten automatisch zurück in den
Snapshot – so bleibt der Fallback immer frisch.

## Konfiguration

Zuoberst in `script.js`:

```javascript
const API_BASE = 'http://<vom-trainer-bekanntgegeben>:8080/api/v1';
let currentSerial = 'SN12345';          // Demo-Seriennummer vom Trainer
```

Die exakten Werte bekommst du am Tag 3 vom Trainer.

## Warum das wichtig ist

- **WLAN fällt aus:** App bleibt funktional mit Snapshot
- **Backend ist kurz down:** App zeigt letzte gesehene Werte
- **Erste Anmeldung ohne API:** Initial-Seed fängt dich auf

Der Snapshot wird **pro Sensor separat** gehalten (`snapshot:SN12345`,
`snapshot:SN67890`, …). So bleiben mehrere Sensoren unabhängig.

## Manueller Reset

Falls der Snapshot alte/falsche Werte zeigt, in der DevTools-Konsole:

```javascript
localStorage.removeItem('snapshot:SN12345');
location.reload();
```

## Bezug zur API

Vollständiger Datenvertrag im Schwester-Repo:
- [API-Vertrag](https://ae-raumklima-bootcamp.readthedocs.io/projekt/api-vertrag/)
- [Ingest-Vertrag (MQTT)](https://ae-raumklima-bootcamp.readthedocs.io/projekt/ingest-vertrag/)
- [Architektur](https://ae-raumklima-bootcamp.readthedocs.io/projekt/architektur/)
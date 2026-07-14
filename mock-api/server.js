import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getRooms } from './src/data.js';
import apiRouter from './src/routes.js';

const app = express();
const port = Number.parseInt(process.env.PORT, 10) || 3000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.includes('*') ? true : allowedOrigins,
  }),
);

app.get('/', (_req, res) => {
  const rooms = getRooms();
  res.type('html').send(`<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>AE Raumklima Mock-API</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; color: #1f2933; }
    h1 { color: #00695c; }
    code { background: #f0f4f4; padding: 2px 6px; border-radius: 4px; }
    .room { border-left: 4px solid #00695c; padding: 8px 12px; margin: 8px 0; background: #f8fafa; }
  </style>
</head>
<body>
  <h1>AE Raumklima Mock-API</h1>
  <p>Diese API liefert deterministische Sensordaten für das Bootcamp.</p>
  <h2>Verfügbare Räume</h2>
  ${rooms
    .map(
      (r) => `<div class="room"><strong>${r.id}</strong> – ${r.name} (OG ${r.floor})<br>
        <a href="/api/v1/rooms/${r.id}/measurements/latest">latest</a> ·
        <a href="/api/v1/rooms/${r.id}/measurements?limit=5">history</a>
      </div>`,
    )
    .join('')}
  <h2>Endpunkte</h2>
  <ul>
    <li><code>GET /api/v1/rooms</code></li>
    <li><code>GET /api/v1/rooms/:roomId/measurements/latest</code></li>
    <li><code>GET /api/v1/rooms/:roomId/measurements?limit=10</code></li>
  </ul>
</body>
</html>`);
});

app.use('/api/v1', apiRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found', code: 404, path: req.path });
});

app.listen(port, () => {
  console.log(`Mock-API läuft auf http://localhost:${port}`);
  console.log(`API-Basis: http://localhost:${port}/api/v1`);
});

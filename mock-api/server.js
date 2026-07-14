import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getRooms } from './src/data.js';
import apiRouter from './src/routes.js';
import { initDb, closeDb } from './src/db.js';
import { seed } from './src/seed.js';

const app = express();
app.use(express.json({ limit: '32kb' }));

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
  const mode = process.env.USE_DB === 'true' ? 'mysql' : 'memory';
  res.type('html').send(`<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>AE Raumklima Backend</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; color: #1f2933; }
    h1 { color: #00695c; }
    code { background: #f0f4f4; padding: 2px 6px; border-radius: 4px; }
    .room { border-left: 4px solid #00695c; padding: 8px 12px; margin: 8px 0; background: #f8fafa; }
    .badge { display: inline-block; background: #00695c; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>AE Raumklima Backend</h1>
  <p>Datenmodus: <span class="badge">${mode}</span></p>
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
    <li><code>GET  /api/v1/rooms</code></li>
    <li><code>GET  /api/v1/rooms/:roomId/measurements/latest</code></li>
    <li><code>GET  /api/v1/rooms/:roomId/measurements?limit=N</code></li>
    <li><code>POST /api/v1/ingest</code> (Header <code>X-API-Key</code>)</li>
  </ul>
</body>
</html>`);
});

app.use('/api/v1', apiRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found', code: 404, path: req.path });
});

async function startup() {
  if (process.env.USE_DB === 'true') {
    try {
      console.log('[startup] USE_DB=true – verbinde zu MySQL …');
      await initDb();
      const result = await seed();
      console.log('[startup] DB bereit. Seed-Resultat:', result);
    } catch (err) {
      console.error('[startup] DB-Init fehlgeschlagen, fallback auf In-Memory:', err.message);
      process.env.USE_DB = 'false';
    }
  } else {
    console.log('[startup] USE_DB=false – laufe mit In-Memory-Daten (kein MySQL nötig)');
  }

  const server = app.listen(port, () => {
    console.log(`Backend läuft auf http://localhost:${port}`);
    console.log(`API-Basis: http://localhost:${port}/api/v1`);
  });

  const shutdown = async () => {
    server.close();
    await closeDb().catch(() => {});
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startup();

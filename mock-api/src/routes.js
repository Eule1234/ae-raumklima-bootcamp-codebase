import { Router } from 'express';
import {
  getRooms,
  getLatestMeasurement,
  getHistory,
  addMeasurement,
  roomExistsAsync,
} from './data.js';
import { requireApiKey } from './middleware/auth.js';

const router = Router();

router.get('/rooms', (_req, res) => {
  res.json(getRooms());
});

router.get('/rooms/:roomId/measurements/latest', async (req, res) => {
  const { roomId } = req.params;
  if (!(await roomExistsAsync(roomId))) {
    return res.status(404).json({ error: 'Room not found', code: 404 });
  }
  const latest = await getLatestMeasurement(roomId);
  if (!latest) {
    return res.status(404).json({ error: 'No measurements for this room yet', code: 404 });
  }
  res.json(latest);
});

router.get('/rooms/:roomId/measurements', async (req, res) => {
  const { roomId } = req.params;
  if (!(await roomExistsAsync(roomId))) {
    return res.status(404).json({ error: 'Room not found', code: 404 });
  }
  const limit = Number.parseInt(req.query.limit, 10);
  const history = await getHistory(roomId, Number.isFinite(limit) ? limit : 10);
  res.json(history);
});

// POST: Sensordaten entgegennehmen.
// Auth: X-API-Key Header (siehe middleware/auth.js)
router.post('/ingest', requireApiKey, async (req, res) => {
  const { room, temperature, humidity, timestamp, extras } = req.body ?? {};

  if (typeof room !== 'string' || room.length === 0) {
    return res.status(400).json({ error: 'Feld "room" fehlt oder ist leer', code: 400 });
  }
  if (typeof temperature !== 'number' || !Number.isFinite(temperature)) {
    return res.status(400).json({ error: 'Feld "temperature" muss eine Zahl sein', code: 400 });
  }
  if (typeof humidity !== 'number' || !Number.isFinite(humidity) || humidity < 0 || humidity > 100) {
    return res.status(400).json({ error: 'Feld "humidity" muss eine Zahl 0–100 sein', code: 400 });
  }
  if (timestamp !== undefined) {
    const d = new Date(timestamp);
    if (Number.isNaN(d.getTime())) {
      return res.status(400).json({ error: 'Feld "timestamp" ist kein gültiges ISO-Datum', code: 400 });
    }
  }
  if (extras !== undefined && (extras === null || typeof extras !== 'object' || Array.isArray(extras))) {
    return res.status(400).json({
      error: 'Feld "extras" muss ein Objekt sein (z. B. {"co2": 450, "light": 300})',
      code: 400,
    });
  }

  if (!(await roomExistsAsync(room))) {
    return res.status(404).json({ error: `Unbekannter Raum: ${room}`, code: 404 });
  }

  await addMeasurement({ room, temperature, humidity, timestamp, extras });
  res.status(201).json({ status: 'accepted', room, timestamp: timestamp || new Date().toISOString() });
});

export default router;

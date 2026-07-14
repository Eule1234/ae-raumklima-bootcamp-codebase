import { Router } from 'express';
import {
  getRooms,
  getLatestMeasurement,
  getHistory,
  roomExists,
} from './data.js';

const router = Router();

router.get('/rooms', (_req, res) => {
  res.json(getRooms());
});

router.get('/rooms/:roomId/measurements/latest', (req, res) => {
  const { roomId } = req.params;
  if (!roomExists(roomId)) {
    return res.status(404).json({ error: 'Room not found', code: 404 });
  }
  const latest = getLatestMeasurement(roomId);
  res.json(latest);
});

router.get('/rooms/:roomId/measurements', (req, res) => {
  const { roomId } = req.params;
  if (!roomExists(roomId)) {
    return res.status(404).json({ error: 'Room not found', code: 404 });
  }
  const limit = Number.parseInt(req.query.limit, 10);
  const history = getHistory(roomId, Number.isFinite(limit) ? limit : 10);
  res.json(history);
});

export default router;

// Datenquelle für das Raumklima-Backend.
// Modus wird per USE_DB env var gewählt:
//   false (default) – in-memory, deterministisch, perfekt für lokale Entwicklung
//   true            – MySQL, für reale Sensordaten via POST /api/v1/ingest

import { getPool } from './db.js';

// ---------- In-Memory Daten ----------

const ROOMS = [
  // Variiert so, dass alle drei Statuswerte (gut / kritisch / schlecht)
  // realistisch in der App sichtbar werden.
  { id: 'B101', name: 'Schulungsraum 101', floor: 1, baseTemp: 22.0, baseHumidity: 50, tempJitter: 1.6, humJitter: 6 },
  { id: 'B102', name: 'Schulungsraum 102', floor: 1, baseTemp: 25.0, baseHumidity: 45, tempJitter: 2.0, humJitter: 8 },
  { id: 'B103', name: 'Schulungsraum 103', floor: 1, baseTemp: 17.5, baseHumidity: 72, tempJitter: 2.4, humJitter: 8 },
];

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stringHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildSeedMeasurements(room, count, intervalMinutes) {
  const rand = mulberry32(stringHash(room.id));
  const now = new Date();
  now.setSeconds(0, 0);
  const remainder = now.getMinutes() % intervalMinutes;
  now.setMinutes(now.getMinutes() + (intervalMinutes - remainder));

  const out = [];
  for (let i = 0; i < count; i++) {
    const ts = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
    const tempJitter = (rand() - 0.5) * 2 * room.tempJitter;
    const humJitter = (rand() - 0.5) * 2 * room.humJitter;
    out.push({
      room: room.id,
      temperature: Math.round((room.baseTemp + tempJitter) * 10) / 10,
      humidity: Math.round(room.baseHumidity + humJitter),
      timestamp: ts.toISOString(),
    });
  }
  return out;
}

const HISTORY_COUNT = 50;
const INTERVAL_MIN = 15;
const HISTORY_MAX = 200; // pro Raum im RAM behalten

const memoryStore = new Map(); // roomId -> measurements[] (neueste zuerst)
for (const room of ROOMS) {
  memoryStore.set(room.id, buildSeedMeasurements(room, HISTORY_COUNT, INTERVAL_MIN));
}

function memAdd(roomId, measurement) {
  if (!memoryStore.has(roomId)) return false;
  const list = memoryStore.get(roomId);
  list.unshift(measurement);
  if (list.length > HISTORY_MAX) list.length = HISTORY_MAX;
  return true;
}

// ---------- Public API ----------

export function getRooms() {
  return ROOMS.map(({ id, name, floor }) => ({ id, name, floor }));
}

export function roomExists(roomId) {
  if (isDb()) {
    // synchron reicht hier nicht – daher über asyncExists. Wird vom Aufrufer async genutzt.
    // Für die sync-Variante im In-Memory-Fall reicht Set-Lookup.
    return memoryStore.has(roomId) || ROOMS.some((r) => r.id === roomId);
  }
  return memoryStore.has(roomId);
}

export async function roomExistsAsync(roomId) {
  if (isDb()) {
    const [rows] = await getPool().query('SELECT 1 FROM rooms WHERE id = ? LIMIT 1', [roomId]);
    return rows.length > 0;
  }
  return roomExists(roomId);
}

export async function getLatestMeasurement(roomId) {
  if (isDb()) {
    const [rows] = await getPool().query(
      'SELECT room_id AS room, temperature, humidity, measured_at AS timestamp ' +
        'FROM measurements WHERE room_id = ? ORDER BY measured_at DESC LIMIT 1',
      [roomId],
    );
    if (rows.length === 0) return null;
    return mapMeasurementRow(rows[0]);
  }
  return memoryStore.get(roomId)?.[0] ?? null;
}

export async function getHistory(roomId, limit) {
  const n = Math.max(1, Math.min(limit ?? 10, 500));
  if (isDb()) {
    const [rows] = await getPool().query(
      'SELECT room_id AS room, temperature, humidity, measured_at AS timestamp ' +
        'FROM measurements WHERE room_id = ? ORDER BY measured_at DESC LIMIT ?',
      [roomId, n],
    );
    return rows.map(mapMeasurementRow);
  }
  const data = memoryStore.get(roomId);
  if (!data) return null;
  return data.slice(0, n);
}

export async function addMeasurement({ room, temperature, humidity, timestamp }) {
  if (isDb()) {
    const ts = parseTimestamp(timestamp);
    await getPool().query(
      'INSERT INTO measurements (room_id, temperature, humidity, measured_at) VALUES (?, ?, ?, ?)',
      [room, temperature, humidity, ts],
    );
    return true;
  }
  return memAdd(room, {
    room,
    temperature,
    humidity,
    timestamp: (timestamp || new Date().toISOString()),
  });
}

function mapMeasurementRow(row) {
  return {
    room: row.room,
    temperature: Number(row.temperature),
    humidity: Number(row.humidity),
    timestamp: row.timestamp instanceof Date ? row.timestamp.toISOString() : row.timestamp,
  };
}

function parseTimestamp(value) {
  if (!value) return new Date();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function isDb() {
  return process.env.USE_DB === 'true';
}

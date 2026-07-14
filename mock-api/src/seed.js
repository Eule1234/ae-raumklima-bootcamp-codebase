// Befüllt die MySQL-DB mit den Standardräumen und ein paar historischen
// Messwerten, falls noch keine Daten vorhanden sind. Idempotent.

import { getPool } from './db.js';

const ROOMS = [
  { id: 'B101', name: 'Schulungsraum 101', floor: 1, baseTemp: 22.0, baseHumidity: 50, tempJitter: 1.6, humJitter: 6 },
  { id: 'B102', name: 'Schulungsraum 102', floor: 1, baseTemp: 25.0, baseHumidity: 45, tempJitter: 2.0, humJitter: 8 },
  { id: 'B103', name: 'Schulungsraum 103', floor: 1, baseTemp: 17.5, baseHumidity: 72, tempJitter: 2.4, humJitter: 8 },
];

const HISTORY_COUNT = 50;
const INTERVAL_MIN = 15;

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

function generateRows() {
  const now = new Date();
  now.setSeconds(0, 0);
  const remainder = now.getMinutes() % INTERVAL_MIN;
  now.setMinutes(now.getMinutes() + (INTERVAL_MIN - remainder));

  const rows = [];
  for (const room of ROOMS) {
    const rand = mulberry32(stringHash(room.id));
    for (let i = 0; i < HISTORY_COUNT; i++) {
      const ts = new Date(now.getTime() - i * INTERVAL_MIN * 60 * 1000);
      const temp = Math.round((room.baseTemp + (rand() - 0.5) * 2 * room.tempJitter) * 10) / 10;
      const hum = Math.round(room.baseHumidity + (rand() - 0.5) * 2 * room.humJitter);
      rows.push([room.id, temp, hum, ts]);
    }
  }
  return rows;
}

export async function seed() {
  const pool = getPool();

  for (const r of ROOMS) {
    await pool.query(
      'INSERT IGNORE INTO rooms (id, name, floor) VALUES (?, ?, ?)',
      [r.id, r.name, r.floor],
    );
  }

  const [rows] = await pool.query('SELECT COUNT(*) AS n FROM measurements');
  if (rows[0].n > 0) {
    return { seededRooms: 0, seededMeasurements: 0, skipped: true };
  }

  const rowsToInsert = generateRows();
  await pool.query(
    'INSERT INTO measurements (room_id, temperature, humidity, measured_at) VALUES ?',
    [rowsToInsert],
  );

  return {
    seededRooms: ROOMS.length,
    seededMeasurements: rowsToInsert.length,
    skipped: false,
  };
}

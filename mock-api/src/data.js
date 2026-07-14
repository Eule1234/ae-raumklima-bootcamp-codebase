// Deterministic mock data for the Raumklima-Monitor.
// Same responses on every restart, so tests stay reproducible.

const ROOMS = [
  // Variiert so, dass alle drei Statuswerte (gut / kritisch / schlecht)
  // realistisch in der App sichtbar werden.
  { id: 'B101', name: 'Schulungsraum 101', floor: 1, baseTemp: 22.0, baseHumidity: 50, tempJitter: 1.6, humJitter: 6 },
  { id: 'B102', name: 'Schulungsraum 102', floor: 1, baseTemp: 25.0, baseHumidity: 45, tempJitter: 2.0, humJitter: 8 },
  { id: 'B103', name: 'Schulungsraum 103', floor: 1, baseTemp: 17.5, baseHumidity: 72, tempJitter: 2.4, humJitter: 8 },
];

// Seeded PRNG (mulberry32) for deterministic noise.
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

function buildMeasurements(room, count, intervalMinutes) {
  const rand = mulberry32(stringHash(room.id));
  const now = new Date();
  // Snap to the next 15-minute boundary so multiple rooms share a timeline.
  now.setSeconds(0, 0);
  const remainder = now.getMinutes() % intervalMinutes;
  now.setMinutes(now.getMinutes() + (intervalMinutes - remainder));

  const measurements = [];
  for (let i = 0; i < count; i++) {
    const ts = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
    const tempJitter = (rand() - 0.5) * 2 * room.tempJitter;
    const humJitter = (rand() - 0.5) * 2 * room.humJitter;
    measurements.push({
      room: room.id,
      temperature: Math.round((room.baseTemp + tempJitter) * 10) / 10,
      humidity: Math.round(room.baseHumidity + humJitter),
      timestamp: ts.toISOString(),
    });
  }
  return measurements;
}

const HISTORY_COUNT = 50;
const INTERVAL_MIN = 15;

const datasets = new Map();
for (const room of ROOMS) {
  datasets.set(room.id, buildMeasurements(room, HISTORY_COUNT, INTERVAL_MIN));
}

export function getRooms() {
  return ROOMS.map(({ id, name, floor }) => ({ id, name, floor }));
}

export function getLatestMeasurement(roomId) {
  return datasets.get(roomId)?.[0] ?? null;
}

export function getHistory(roomId, limit) {
  const data = datasets.get(roomId);
  if (!data) return null;
  const n = Math.max(1, Math.min(limit ?? 10, data.length));
  return data.slice(0, n);
}

export function roomExists(roomId) {
  return datasets.has(roomId);
}

import mysql from 'mysql2/promise';

let pool = null;

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS rooms (
  id VARCHAR(16) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  floor INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS measurements (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  room_id VARCHAR(16) NOT NULL,
  temperature DECIMAL(4,1) NOT NULL,
  humidity TINYINT UNSIGNED NOT NULL,
  measured_at DATETIME NOT NULL,
  INDEX idx_room_time (room_id, measured_at DESC),
  CONSTRAINT fk_measurements_room FOREIGN KEY (room_id) REFERENCES rooms(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

export async function initDb() {
  if (pool) return pool;
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number.parseInt(process.env.MYSQL_PORT, 10) || 3306,
    user: process.env.MYSQL_USER || 'raumklima',
    password: process.env.MYSQL_PASSWORD || 'raumklima',
    database: process.env.MYSQL_DATABASE || 'raumklima',
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
  });

  const conn = await pool.getConnection();
  try {
    // Multi-statement: splitten, weil mysql2 Treiber das per default nicht zulässt.
    for (const stmt of SCHEMA_SQL.split(';').map((s) => s.trim()).filter(Boolean)) {
      await conn.query(stmt);
    }
  } finally {
    conn.release();
  }
  return pool;
}

export function getPool() {
  if (!pool) throw new Error('DB nicht initialisiert – initDb() zuerst aufrufen');
  return pool;
}

export async function closeDb() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

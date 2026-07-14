// Authentifiziert den Ingest-Endpoint per API-Key.
// Verwendet wird der Header: X-API-Key: <key>
//
// Der erwartete Key kommt aus der env INGEST_API_KEY.

export function requireApiKey(req, res, next) {
  const expected = process.env.INGEST_API_KEY;
  if (!expected) {
    return res.status(500).json({
      error: 'INGEST_API_KEY nicht gesetzt – Ingest-Endpoint ist deaktiviert',
      code: 500,
    });
  }
  const provided = req.header('X-API-Key');
  if (!provided || provided !== expected) {
    return res.status(401).json({ error: 'Ungültiger oder fehlender API-Key', code: 401 });
  }
  next();
}

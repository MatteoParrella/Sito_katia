// GET /api/admin/bookings?lesson_id=XXX&lesson_date=YYYY-MM-DD — bookings for lesson+date
// POST /api/admin/bookings { booking_id } — cancel a booking

const { Client } = require('pg');
const { checkAuth, unauthorized } = require('../_auth');
const { applyCors } = require('../_http');

module.exports = async (req, res) => {
  applyCors(req, res, { methods: 'GET, POST, OPTIONS', headers: 'Content-Type, Authorization' });

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!checkAuth(req))          return unauthorized(res);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
  });

  // ── GET: list bookings ───────────────────────────────────────
  if (req.method === 'GET') {
    const { lesson_id, lesson_date } = req.query || {};
    if (!lesson_id) return res.status(400).json({ error: 'lesson_id mancante' });

    try {
      await client.connect();

      // If lesson_date provided, filter by it; otherwise show next 4 weeks
      let query, params;
      if (lesson_date) {
        query  = `SELECT id, first_name, last_name, email, phone, status,
                         lesson_date::text, created_at, cancelled_at
                  FROM bookings WHERE lesson_id = $1 AND lesson_date = $2
                  ORDER BY created_at ASC`;
        params = [lesson_id, lesson_date];
      } else {
        query  = `SELECT id, first_name, last_name, email, phone, status,
                         lesson_date::text, created_at, cancelled_at
                  FROM bookings WHERE lesson_id = $1
                  AND lesson_date >= CURRENT_DATE
                  ORDER BY lesson_date ASC, created_at ASC`;
        params = [lesson_id];
      }

      const { rows } = await client.query(query, params);
      return res.status(200).json({ bookings: rows });

    } catch (err) {
      console.error('GET /api/admin/bookings error:', err.message);
      return res.status(500).json({ error: 'Errore del server' });
    } finally {
      await client.end().catch(() => {});
    }
  }

  // ── POST: cancel booking ─────────────────────────────────────
  if (req.method === 'POST') {
    const { booking_id } = req.body || {};
    if (!booking_id) return res.status(400).json({ error: 'booking_id mancante' });

    try {
      await client.connect();
      await client.query('BEGIN');

      const { rows } = await client.query(
        `SELECT id, status FROM bookings WHERE id = $1 FOR UPDATE`, [booking_id]
      );

      if (rows.length === 0) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Prenotazione non trovata' }); }
      if (rows[0].status === 'cancelled') { await client.query('ROLLBACK'); return res.status(200).json({ status: 'already_cancelled' }); }

      await client.query(
        `UPDATE bookings SET status='cancelled', cancelled_at=now(), cancellation_source='admin' WHERE id=$1`,
        [booking_id]
      );
      await client.query('COMMIT');
      return res.status(200).json({ status: 'cancelled' });

    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      console.error('POST /api/admin/bookings error:', err.message);
      return res.status(500).json({ error: 'Errore del server' });
    } finally {
      await client.end().catch(() => {});
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

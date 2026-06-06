// GET /api/admin/bookings?lesson_id=XXX — all bookings for a lesson
// POST /api/admin/bookings/cancel { booking_id } — cancel a booking

const { Client } = require('pg');
const { checkAuth, unauthorized } = require('../_auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!checkAuth(req))          return unauthorized(res);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  // ── GET: list bookings for a lesson ─────────────────────
  if (req.method === 'GET') {
    const lesson_id = req.query?.lesson_id;
    if (!lesson_id) {
      return res.status(400).json({ error: 'lesson_id mancante' });
    }

    try {
      await client.connect();

      const { rows } = await client.query(`
        SELECT id, first_name, last_name, email, phone, status, created_at, cancelled_at
        FROM bookings
        WHERE lesson_id = $1
        ORDER BY created_at ASC
      `, [lesson_id]);

      return res.status(200).json({ bookings: rows });

    } catch (err) {
      console.error('GET /api/admin/bookings error:', err.message);
      return res.status(500).json({ error: 'Errore del server' });
    } finally {
      await client.end().catch(() => {});
    }
  }

  // ── POST: cancel a booking ───────────────────────────────
  if (req.method === 'POST') {
    const { booking_id } = req.body || {};
    if (!booking_id) {
      return res.status(400).json({ error: 'booking_id mancante' });
    }

    try {
      await client.connect();
      await client.query('BEGIN');

      const { rows } = await client.query(
        `SELECT id, status FROM bookings WHERE id = $1 FOR UPDATE`,
        [booking_id]
      );

      if (rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Prenotazione non trovata' });
      }

      if (rows[0].status === 'cancelled') {
        await client.query('ROLLBACK');
        return res.status(200).json({ status: 'already_cancelled' });
      }

      await client.query(
        `UPDATE bookings
         SET status = 'cancelled', cancelled_at = now(), cancellation_source = 'admin'
         WHERE id = $1`,
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

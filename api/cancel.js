// /api/cancel
// GET  ?token=XXX  — fetch booking info by cancel token
// POST { token }   — cancel the booking

const { Client } = require('pg');
const { sendAdminCancellation } = require('./_email');

async function createClient() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  return client;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET: fetch booking info ──────────────────────────────
  if (req.method === 'GET') {
    const token = req.query?.token || '';

    if (!token || token.length < 10) {
      return res.status(400).json({ error: 'token_missing' });
    }

    const client = await createClient();
    try {
      const { rows } = await client.query(
        `SELECT b.id, b.first_name, b.last_name, b.status,
                l.day_of_week, l.time, l.course_name
         FROM bookings b
         JOIN lessons l ON l.id = b.lesson_id
         WHERE b.cancel_token = $1`,
        [token]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'not_found' });
      }

      const b = rows[0];
      return res.status(200).json({
        status:  b.status,
        booking: {
          first_name:  b.first_name,
          last_name:   b.last_name,
          lesson:      `${b.day_of_week} ${b.time} — ${b.course_name}`,
        },
      });

    } catch (err) {
      console.error('GET /api/cancel error:', err.message);
      return res.status(500).json({ error: 'server_error' });
    } finally {
      await client.end().catch(() => {});
    }
  }

  // ── POST: cancel booking ─────────────────────────────────
  if (req.method === 'POST') {
    const { token } = req.body || {};

    if (!token || token.length < 10) {
      return res.status(400).json({ error: 'token_missing' });
    }

    const client = await createClient();
    try {
      await client.query('BEGIN');

      const { rows } = await client.query(
        `SELECT id, status FROM bookings WHERE cancel_token = $1 FOR UPDATE`,
        [token]
      );

      if (rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'not_found' });
      }

      if (rows[0].status === 'cancelled') {
        await client.query('ROLLBACK');
        return res.status(200).json({ status: 'already_cancelled' });
      }

      await client.query(
        `UPDATE bookings
         SET status = 'cancelled', cancelled_at = now(), cancellation_source = 'user'
         WHERE id = $1`,
        [rows[0].id]
      );

      await client.query('COMMIT');

      // ── Send admin notification (awaited) ────────────────
      try {
        const notifRes = await client.query(
          `SELECT b.first_name, b.last_name, b.email,
                  l.day_of_week, l.time, l.course_name
           FROM bookings b JOIN lessons l ON l.id = b.lesson_id
           WHERE b.id = $1`,
          [rows[0].id]
        );
        if (notifRes.rows.length > 0) {
          const b = notifRes.rows[0];
          await sendAdminCancellation({
            first_name: b.first_name,
            last_name:  b.last_name,
            email:      b.email,
            lesson:     `${b.day_of_week} ${b.time} — ${b.course_name}`,
            source:     'user',
          });
        }
      } catch (emailErr) {
        console.error('Email cancel error:', emailErr.message);
      }

      return res.status(200).json({ status: 'cancelled' });

    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      console.error('POST /api/cancel error:', err.message);
      return res.status(500).json({ error: 'server_error' });
    } finally {
      await client.end().catch(() => {});
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

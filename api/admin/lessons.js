// GET /api/admin/lessons — all lessons with confirmed booking count

const { Client } = require('pg');
const { checkAuth, unauthorized } = require('../_auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!checkAuth(req))          return unauthorized(res);
  if (req.method !== 'GET')     return res.status(405).json({ error: 'Method not allowed' });

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const { rows } = await client.query(`
      SELECT
        l.id,
        l.day_of_week,
        l.time,
        l.course_name,
        l.max_seats,
        l.is_active,
        l.notes,
        COUNT(b.id) FILTER (WHERE b.status = 'confirmed') AS confirmed_count
      FROM lessons l
      LEFT JOIN bookings b ON b.lesson_id = l.id
      GROUP BY l.id
      ORDER BY
        CASE l.day_of_week
          WHEN 'Lunedì'    THEN 1
          WHEN 'Martedì'   THEN 2
          WHEN 'Mercoledì' THEN 3
          WHEN 'Giovedì'   THEN 4
          ELSE 5
        END, l.time
    `);

    return res.status(200).json({ lessons: rows });

  } catch (err) {
    console.error('GET /api/admin/lessons error:', err.message);
    return res.status(500).json({ error: 'Errore del server' });
  } finally {
    await client.end().catch(() => {});
  }
};

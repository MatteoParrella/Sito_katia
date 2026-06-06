// GET /api/lessons — returns active lessons ordered by day/time

const { Client } = require('pg');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const { rows } = await client.query(`
      SELECT id, day_of_week, time, course_name, max_seats, notes
      FROM lessons
      WHERE is_active = true
      ORDER BY
        CASE day_of_week
          WHEN 'Lunedì'    THEN 1
          WHEN 'Martedì'   THEN 2
          WHEN 'Mercoledì' THEN 3
          WHEN 'Giovedì'   THEN 4
          ELSE 5
        END,
        time
    `);

    return res.status(200).json({ lessons: rows });

  } catch (err) {
    console.error('GET /api/lessons error:', err.message);
    return res.status(500).json({ error: 'Errore del server' });
  } finally {
    await client.end().catch(() => {});
  }
};

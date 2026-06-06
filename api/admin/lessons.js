// GET /api/admin/lessons — lessons with next occurrence date + confirmed count

const { Client } = require('pg');
const { checkAuth, unauthorized } = require('../_auth');

const IT_MONTHS = ['gennaio','febbraio','marzo','aprile','maggio','giugno',
                   'luglio','agosto','settembre','ottobre','novembre','dicembre'];

function getNextDate(dayOfWeekIT) {
  const map = { 'Lunedì':1,'Martedì':2,'Mercoledì':3,'Giovedì':4,'Venerdì':5,'Sabato':6,'Domenica':0 };
  const target = map[dayOfWeekIT];
  const cur = new Date(); cur.setUTCHours(0,0,0,0);
  while (cur.getUTCDay() !== target) cur.setUTCDate(cur.getUTCDate() + 1);
  return cur.toISOString().slice(0,10);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  const days = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];
  return `${days[d.getUTCDay()]} ${d.getUTCDate()} ${IT_MONTHS[d.getUTCMonth()]}`;
}

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

    const { rows: lessons } = await client.query(`
      SELECT id, day_of_week, time, course_name, max_seats, is_active, notes
      FROM lessons
      ORDER BY
        CASE day_of_week
          WHEN 'Lunedì' THEN 1 WHEN 'Martedì' THEN 2
          WHEN 'Mercoledì' THEN 3 WHEN 'Giovedì' THEN 4 ELSE 5
        END, time
    `);

    // Get next date and count for each lesson
    const result = await Promise.all(lessons.map(async (l) => {
      const next_date = getNextDate(l.day_of_week);
      const { rows } = await client.query(
        `SELECT COUNT(*)::int AS count FROM bookings
         WHERE lesson_id = $1 AND lesson_date = $2 AND status = 'confirmed'`,
        [l.id, next_date]
      );
      return {
        ...l,
        confirmed_count: rows[0].count,
        next_date,
        next_date_label: formatDate(next_date),
      };
    }));

    return res.status(200).json({ lessons: result });

  } catch (err) {
    console.error('GET /api/admin/lessons error:', err.message);
    return res.status(500).json({ error: 'Errore del server' });
  } finally {
    await client.end().catch(() => {});
  }
};

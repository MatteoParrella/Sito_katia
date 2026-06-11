// GET /api/admin/lessons?monday=YYYY-MM-DD — lessons with count for a specific week

const { Client } = require('pg');
const { checkAuth, unauthorized } = require('../_auth');
const { applyCors } = require('../_http');

const IT_MONTHS = ['gennaio','febbraio','marzo','aprile','maggio','giugno',
                   'luglio','agosto','settembre','ottobre','novembre','dicembre'];
const IT_DAYS   = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];

function getCurrentMonday() {
  const d = new Date(); d.setUTCHours(0,0,0,0);
  const day = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - (day === 0 ? 6 : day - 1));
  return d.toISOString().slice(0, 10);
}

// Given Monday of a week, compute the date of each day by dayOfWeekIT
function getLessonDateInWeek(dayOfWeekIT, mondayStr) {
  const offsets = { 'Lunedì':0,'Martedì':1,'Mercoledì':2,'Giovedì':3,'Venerdì':4,'Sabato':5,'Domenica':6 };
  const offset  = offsets[dayOfWeekIT] ?? 0;
  const d = new Date(mondayStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  return `${IT_DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${IT_MONTHS[d.getUTCMonth()]}`;
}

function formatWeekLabel(mondayStr) {
  const m = new Date(mondayStr + 'T00:00:00Z');
  const s = new Date(m); s.setUTCDate(m.getUTCDate() + 6);
  const ms = IT_MONTHS, md = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
  return `${m.getUTCDate()} ${md[m.getUTCMonth()]} — ${s.getUTCDate()} ${md[s.getUTCMonth()]} ${s.getUTCFullYear()}`;
}

module.exports = async (req, res) => {
  applyCors(req, res, { methods: 'GET, OPTIONS', headers: 'Content-Type, Authorization' });

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!checkAuth(req))          return unauthorized(res);
  if (req.method !== 'GET')     return res.status(405).json({ error: 'Method not allowed' });

  const monday      = req.query?.monday || getCurrentMonday();
  const weekLabel   = formatWeekLabel(monday);

  // Compute prev/next mondays
  const prevDate = new Date(monday + 'T00:00:00Z'); prevDate.setUTCDate(prevDate.getUTCDate() - 7);
  const nextDate = new Date(monday + 'T00:00:00Z'); nextDate.setUTCDate(nextDate.getUTCDate() + 7);
  const prevMonday = prevDate.toISOString().slice(0, 10);
  const nextMonday = nextDate.toISOString().slice(0, 10);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
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

    const result = await Promise.all(lessons.map(async (l) => {
      const target_date = getLessonDateInWeek(l.day_of_week, monday);
      const { rows } = await client.query(
        `SELECT COUNT(*)::int AS count FROM bookings
         WHERE lesson_id = $1 AND lesson_date = $2 AND status = 'confirmed'`,
        [l.id, target_date]
      );
      return {
        ...l,
        confirmed_count: rows[0].count,
        target_date,
        target_date_label: formatDate(target_date),
      };
    }));

    return res.status(200).json({
      lessons: result,
      week: { monday, label: weekLabel, prevMonday, nextMonday },
    });

  } catch (err) {
    console.error('GET /api/admin/lessons error:', err.message);
    return res.status(500).json({ error: 'Errore del server' });
  } finally {
    await client.end().catch(() => {});
  }
};

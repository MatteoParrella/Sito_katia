// GET /api/lessons — returns upcoming lesson instances (next 4 weeks) with seat counts

const { Client } = require('pg');

const IT_MONTHS = ['gennaio','febbraio','marzo','aprile','maggio','giugno',
                   'luglio','agosto','settembre','ottobre','novembre','dicembre'];

function getUpcomingDates(dayOfWeekIT, weeksAhead = 4) {
  const map = { 'Lunedì':1,'Martedì':2,'Mercoledì':3,'Giovedì':4,'Venerdì':5,'Sabato':6,'Domenica':0 };
  const target = map[dayOfWeekIT];
  const dates  = [];
  const cur    = new Date();
  cur.setUTCHours(0, 0, 0, 0);
  // advance to next occurrence (including today)
  while (cur.getUTCDay() !== target) cur.setUTCDate(cur.getUTCDate() + 1);
  for (let i = 0; i < weeksAhead; i++) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 7);
  }
  return dates;
}

function formatLabel(day, dateStr, time, course) {
  const d = new Date(dateStr + 'T00:00:00Z');
  return `${day} ${d.getUTCDate()} ${IT_MONTHS[d.getUTCMonth()]} · ${time} — ${course}`;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Get active lessons
    const { rows: lessons } = await client.query(`
      SELECT id, day_of_week, time, course_name, max_seats
      FROM lessons WHERE is_active = true
      ORDER BY
        CASE day_of_week
          WHEN 'Lunedì'    THEN 1 WHEN 'Martedì'   THEN 2
          WHEN 'Mercoledì' THEN 3 WHEN 'Giovedì'   THEN 4 ELSE 5
        END, time
    `);

    // Build all upcoming instances
    const instances = [];
    for (const l of lessons) {
      const dates = getUpcomingDates(l.day_of_week, 4);
      for (const d of dates) {
        instances.push({ lesson_id: l.id, lesson_date: d, lesson: l });
      }
    }

    if (instances.length === 0) return res.status(200).json({ upcoming: [] });

    // Fetch confirmed counts for next 28 days in one query (avoids array param issues)
    const { rows: counts } = await client.query(`
      SELECT lesson_id::text, lesson_date::text, COUNT(*)::int AS confirmed_count
      FROM bookings
      WHERE status = 'confirmed'
        AND lesson_date >= CURRENT_DATE
        AND lesson_date <= CURRENT_DATE + INTERVAL '28 days'
      GROUP BY lesson_id, lesson_date
    `);

    const countMap = {};
    for (const c of counts) {
      countMap[`${c.lesson_id}|${c.lesson_date}`] = c.confirmed_count;
    }

    // Build response
    const upcoming = instances.map(i => {
      const count      = countMap[`${i.lesson_id}|${i.lesson_date}`] || 0;
      const slots_left = i.lesson.max_seats - count;
      return {
        lesson_id:       i.lesson_id,
        lesson_date:     i.lesson_date,
        day_of_week:     i.lesson.day_of_week,
        time:            i.lesson.time,
        course_name:     i.lesson.course_name,
        max_seats:       i.lesson.max_seats,
        confirmed_count: count,
        slots_left,
        is_full:         slots_left <= 0,
        label:           formatLabel(i.lesson.day_of_week, i.lesson_date, i.lesson.time, i.lesson.course_name),
      };
    }).filter(i => i.slots_left > 0); // only show available instances

    return res.status(200).json({ upcoming });

  } catch (err) {
    console.error('GET /api/lessons error:', err.message);
    return res.status(500).json({ error: 'Errore del server' });
  } finally {
    await client.end().catch(() => {});
  }
};

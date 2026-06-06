// POST /api/bookings — create booking with seat check per lesson+date (overbooking-safe)

const { Client } = require('pg');
const { sendBookingConfirmation, sendAdminNewBooking } = require('./_email');

const IT_MONTHS = ['gennaio','febbraio','marzo','aprile','maggio','giugno',
                   'luglio','agosto','settembre','ottobre','novembre','dicembre'];

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  return `${d.getUTCDate()} ${IT_MONTHS[d.getUTCMonth()]}`;
}

function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email)); }
function validatePhone(phone)  { return /^[\+\d\s\-\(\)]{6,20}$/.test(String(phone).trim()); }
function validateDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr + 'T00:00:00Z');
  const today = new Date(); today.setUTCHours(0,0,0,0);
  return d >= today; // not in the past
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const { lesson_id, lesson_date, first_name, last_name, email, phone } = req.body || {};

  // ── Validation ──────────────────────────────────────────────────
  const errors = {};
  if (!lesson_id)                   errors.lesson_id   = 'Seleziona una lezione';
  if (!lesson_date)                 errors.lesson_date = 'Data mancante';
  else if (!validateDate(lesson_date)) errors.lesson_date = 'Data non valida o passata';
  if (!first_name?.trim())          errors.first_name  = 'Nome obbligatorio';
  if (!last_name?.trim())           errors.last_name   = 'Cognome obbligatorio';
  if (!email?.trim())               errors.email       = 'Email obbligatoria';
  else if (!validateEmail(email))   errors.email       = 'Formato email non valido';
  if (!phone?.trim())               errors.phone       = 'Telefono obbligatorio';
  else if (!validatePhone(phone))   errors.phone       = 'Formato telefono non valido';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Dati non validi', fields: errors });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    await client.query('BEGIN');

    // ── Lock lesson row ──────────────────────────────────────────
    const lessonRes = await client.query(
      `SELECT id, max_seats FROM lessons WHERE id = $1 AND is_active = true FOR UPDATE`,
      [lesson_id]
    );

    if (lessonRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Lezione non trovata o non attiva' });
    }

    const { max_seats } = lessonRes.rows[0];

    // ── Count confirmed for THIS lesson + THIS date ─────────────
    const countRes = await client.query(
      `SELECT COUNT(*)::int AS count FROM bookings
       WHERE lesson_id = $1 AND lesson_date = $2 AND status = 'confirmed'`,
      [lesson_id, lesson_date]
    );

    if (countRes.rows[0].count >= max_seats) {
      await client.query('ROLLBACK');
      return res.status(200).json({ status: 'full' });
    }

    // ── Insert booking ────────────────────────────────────────────
    const bookingRes = await client.query(
      `INSERT INTO bookings (lesson_id, lesson_date, first_name, last_name, email, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, cancel_token`,
      [lesson_id, lesson_date, first_name.trim(), last_name.trim(),
       email.trim().toLowerCase(), phone.trim()]
    );

    await client.query('COMMIT');

    const { id, cancel_token } = bookingRes.rows[0];

    // ── Send emails ───────────────────────────────────────────────
    const lessonRes2 = await client.query(
      `SELECT day_of_week, time, course_name FROM lessons WHERE id = $1`, [lesson_id]
    );
    if (lessonRes2.rows.length > 0) {
      const l = lessonRes2.rows[0];
      const lessonLabel = `${l.day_of_week} ${formatDate(lesson_date)} · ${l.time} — ${l.course_name}`;
      try {
        await Promise.all([
          sendBookingConfirmation({ first_name: first_name.trim(), last_name: last_name.trim(),
            email: email.trim().toLowerCase(), lesson: lessonLabel, cancel_token }),
          sendAdminNewBooking({ first_name: first_name.trim(), last_name: last_name.trim(),
            email: email.trim().toLowerCase(), phone: phone.trim(), lesson: lessonLabel }),
        ]);
        console.log('Emails sent for booking', id);
      } catch (emailErr) {
        console.error('Email send error:', emailErr.message);
      }
    }

    return res.status(201).json({ status: 'confirmed', booking_id: id, cancel_token });

  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('POST /api/bookings error:', err.message);
    return res.status(500).json({ error: 'Errore del server. Riprova tra qualche minuto.' });
  } finally {
    await client.end().catch(() => {});
  }
};

/**
 * setup-db.js — applica le migration al database Neon
 * Uso: DATABASE_URL="postgresql://..." node scripts/setup-db.js
 */

const { Client } = require('pg');

const SQL = `
-- ── EXTENSIONS ───────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── LESSONS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week text        NOT NULL,
  time        text        NOT NULL,
  course_name text        NOT NULL,
  max_seats   integer     NOT NULL DEFAULT 12,
  is_active   boolean     NOT NULL DEFAULT true,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── BOOKINGS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id           uuid        NOT NULL REFERENCES lessons(id) ON DELETE RESTRICT,
  first_name          text        NOT NULL,
  last_name           text        NOT NULL,
  email               text        NOT NULL,
  phone               text        NOT NULL,
  status              text        NOT NULL DEFAULT 'confirmed'
                                  CHECK (status IN ('confirmed', 'cancelled')),
  cancel_token        text        NOT NULL UNIQUE
                                  DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at          timestamptz NOT NULL DEFAULT now(),
  cancelled_at        timestamptz,
  cancellation_source text        CHECK (cancellation_source IN ('user', 'admin'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_lesson_status ON bookings (lesson_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_cancel_token  ON bookings (cancel_token);
CREATE INDEX IF NOT EXISTS idx_bookings_email         ON bookings (email);

-- ── LESSON SLOTS (8 settimanali) ─────────────────────────
INSERT INTO lessons (day_of_week, time, course_name, max_seats, is_active, notes) VALUES
  ('Lunedì',    '18:00', 'Mix',     12, true,  NULL),
  ('Lunedì',    '19:00', 'Pilates', 12, true,  NULL),
  ('Martedì',   '10:00', 'Pilates', 12, true,  NULL),
  ('Mercoledì', '18:00', 'Pilates', 12, true,  NULL),
  ('Mercoledì', '19:00', 'Mix',     12, true,  NULL),
  ('Giovedì',   '10:00', 'Pilates', 12, true,  NULL),
  ('Giovedì',   '18:00', 'Mix',     12, false, 'da concordare'),
  ('Giovedì',   '19:00', 'Pilates', 12, true,  NULL)
ON CONFLICT DO NOTHING;
`;

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL non impostato');
    console.error('   Uso: DATABASE_URL="postgresql://..." node scripts/setup-db.js');
    process.exit(1);
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true } });

  try {
    console.log('🔗 Connessione al database...');
    await client.connect();

    console.log('📦 Applicazione migration...');
    await client.query(SQL);

    const { rows } = await client.query('SELECT id, day_of_week, time, course_name, max_seats, is_active, notes FROM lessons ORDER BY id');
    console.log(`\n✅ Lezioni inserite (${rows.length}):\n`);
    rows.forEach(r => {
      const stato = r.is_active ? '✓' : '⚠ da concordare';
      console.log(`   ${r.day_of_week} ${r.time} — ${r.course_name} (max ${r.max_seats}) ${r.notes ? stato : ''}`);
    });

    console.log('\n✅ Database pronto.\n');
  } catch (err) {
    console.error('❌ Errore:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();

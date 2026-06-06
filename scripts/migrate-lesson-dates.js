/**
 * migrate-lesson-dates.js — aggiunge lesson_date alle prenotazioni
 * Uso: DATABASE_URL="..." node scripts/migrate-lesson-dates.js
 */

const { Client } = require('pg');

async function main() {
  if (!process.env.DATABASE_URL) { console.error('❌ DATABASE_URL mancante'); process.exit(1); }

  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    console.log('📦 Migrazione lesson_date...');

    await client.query(`
      -- Aggiungi colonna (nullable per gestire righe esistenti)
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS lesson_date DATE;

      -- Aggiorna righe esistenti con data odierna (sono dati di test)
      UPDATE bookings SET lesson_date = CURRENT_DATE WHERE lesson_date IS NULL;

      -- Rendi NOT NULL
      ALTER TABLE bookings ALTER COLUMN lesson_date SET NOT NULL;

      -- Rimuovi vecchio indice, crea nuovo con lesson_date
      DROP INDEX IF EXISTS idx_bookings_lesson_status;
      CREATE INDEX IF NOT EXISTS idx_bookings_lesson_date_status
        ON bookings (lesson_id, lesson_date, status);
    `);

    console.log('✅ Migrazione completata.');

    const { rows } = await client.query('SELECT COUNT(*) FROM bookings');
    console.log(`   Prenotazioni esistenti aggiornate: ${rows[0].count}`);

  } catch (err) {
    console.error('❌ Errore:', err.message);
  } finally {
    await client.end();
  }
}

main();

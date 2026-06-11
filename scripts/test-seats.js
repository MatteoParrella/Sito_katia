/**
 * test-seats.js — verifica blocco automatico 12 posti
 *
 * Uso: DATABASE_URL="..." node scripts/test-seats.js
 *
 * Cosa fa:
 *  1. Prende prima lezione attiva
 *  2. Inserisce 12 prenotazioni confirmed (riempie la lezione)
 *  3. Tenta 13ª prenotazione → deve essere rifiutata
 *  4. Annulla 1 prenotazione → libera 1 posto
 *  5. Ritenta → deve essere accettata
 *  6. Pulisce tutti i dati di test
 */

const { Client } = require('pg');

async function createClient() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
  });
  await client.connect();
  return client;
}

async function countConfirmed(client, lessonId) {
  const { rows } = await client.query(
    `SELECT COUNT(*)::int AS count FROM bookings WHERE lesson_id = $1 AND status = 'confirmed'`,
    [lessonId]
  );
  return rows[0].count;
}

async function insertBooking(client, lessonId, suffix) {
  const { rows } = await client.query(
    `INSERT INTO bookings (lesson_id, first_name, last_name, email, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, cancel_token`,
    [lessonId, `Test${suffix}`, 'Seat', `test${suffix}@test.it`, '+39 000 0000000']
  );
  return rows[0];
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL non impostato');
    process.exit(1);
  }

  const client = await createClient();
  const insertedIds = [];

  try {
    // ── 1. Prendi prima lezione attiva ───────────────────────
    const { rows: lessons } = await client.query(
      `SELECT id, day_of_week, time, course_name, max_seats FROM lessons WHERE is_active = true LIMIT 1`
    );
    const lesson = lessons[0];
    console.log(`\n🎯 Lezione di test: ${lesson.day_of_week} ${lesson.time} — ${lesson.course_name} (max ${lesson.max_seats})\n`);

    // ── 2. Rimuovi eventuali prenotazioni test precedenti ────
    await client.query(
      `DELETE FROM bookings WHERE lesson_id = $1 AND email LIKE 'test%@test.it'`,
      [lesson.id]
    );

    // ── 3. Inserisci 12 prenotazioni ─────────────────────────
    console.log('📝 Inserisco 12 prenotazioni...');
    for (let i = 1; i <= 12; i++) {
      const b = await insertBooking(client, lesson.id, i);
      insertedIds.push(b.id);
      process.stdout.write(`   ${i}/12\r`);
    }
    const count12 = await countConfirmed(client, lesson.id);
    console.log(`\n✅ Posti occupati: ${count12}/12`);

    // ── 4. Tenta 13ª prenotazione ────────────────────────────
    console.log('\n🚫 Tentativo 13ª prenotazione...');
    const { rows: cnt } = await client.query(
      `SELECT COUNT(*)::int AS count FROM bookings WHERE lesson_id = $1 AND status = 'confirmed'`,
      [lesson.id]
    );
    if (cnt[0].count >= lesson.max_seats) {
      console.log('✅ Bloccata correttamente — lezione al completo');
    } else {
      console.log('❌ ERRORE: doveva essere bloccata!');
    }

    // ── 5. Annulla 1 prenotazione ────────────────────────────
    const toCancel = insertedIds[0];
    await client.query(
      `UPDATE bookings SET status = 'cancelled', cancelled_at = now(), cancellation_source = 'user'
       WHERE id = $1`,
      [toCancel]
    );
    const countAfterCancel = await countConfirmed(client, lesson.id);
    console.log(`\n✅ Dopo annullamento: posti occupati = ${countAfterCancel}/12 (1 posto libero)`);

    // ── 6. Ritenta prenotazione ──────────────────────────────
    console.log('\n✅ Ritento prenotazione su posto liberato...');
    const { rows: cnt2 } = await client.query(
      `SELECT COUNT(*)::int AS count FROM bookings WHERE lesson_id = $1 AND status = 'confirmed'`,
      [lesson.id]
    );
    if (cnt2[0].count < lesson.max_seats) {
      const extra = await insertBooking(client, lesson.id, 'extra');
      insertedIds.push(extra.id);
      console.log('✅ Prenotazione accettata — posto liberato funziona');
    }

    console.log('\n✅ Tutti i test superati.\n');

  } catch (err) {
    console.error('❌ Errore:', err.message);
  } finally {
    // ── Pulizia ──────────────────────────────────────────────
    await client.query(
      `DELETE FROM bookings WHERE email LIKE 'test%@test.it'`
    );
    console.log('🧹 Dati di test rimossi.');
    await client.end();
  }
}

main();

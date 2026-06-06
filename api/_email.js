// Shared email helper — sends via Gmail SMTP (nodemailer)
// File starts with _ so Vercel doesn't expose it as a route

const nodemailer = require('nodemailer');

const SITE         = process.env.SITE_URL          || 'https://sito-katia.vercel.app';
const GMAIL_USER   = process.env.GMAIL_USER        || 'parrellamatteo24@gmail.com';
const GMAIL_PASS   = process.env.GMAIL_APP_PASSWORD || '';
// Testing: notifications → developer. Production: change to katiaterruzzi@gmail.com
const ADMIN_NOTIFY = process.env.ADMIN_NOTIFY_EMAIL || 'parrellamatteo24@gmail.com';

function createTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
  });
}

// ── 1. Conferma prenotazione → utente ────────────────────────
async function sendBookingConfirmation({ first_name, last_name, email, lesson, cancel_token }) {
  const cancelUrl   = `${SITE}/annulla?token=${cancel_token}`;
  const transporter = createTransport();

  await transporter.sendMail({
    from:    `"Katia Terruzzi Pilates" <${GMAIL_USER}>`,
    to:      email,
    subject: `Prenotazione confermata — ${lesson}`,
    html: `
<!DOCTYPE html>
<html lang="it">
<body style="margin:0;padding:0;background:#f4efe8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06);">
        <tr><td style="background:#4a7d7a;padding:32px 40px;text-align:center;">
          <p style="margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.7)">Katia Terruzzi</p>
          <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-style:italic;font-weight:400;font-size:26px;color:#fff">Prenotazione confermata!</h1>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 20px;font-size:15px;color:#3a3632">Ciao <strong>${first_name}</strong>,</p>
          <p style="margin:0 0 28px;font-size:14px;color:#5a5750;line-height:1.7">Il tuo posto è riservato. Ti aspettiamo!</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7f6;border-radius:10px;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 6px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#7a9e9c">Lezione prenotata</p>
              <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:22px;color:#2e5c5a;line-height:1.3">${lesson}</p>
            </td></tr>
          </table>
          <p style="margin:0 0 12px;font-size:14px;color:#5a5750;line-height:1.7">Se non puoi partecipare, annulla la prenotazione con un ragionevole anticipo:</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:8px 0;">
              <a href="${cancelUrl}" style="display:inline-block;background:#f4efe8;border:1px solid #c8d8d6;border-radius:999px;padding:11px 28px;font-size:13px;font-weight:500;color:#4a7d7a;text-decoration:none">Annulla prenotazione</a>
            </td></tr>
          </table>
          <p style="margin:20px 0 0;font-size:11px;color:#9a9590;text-align:center;word-break:break-all">Oppure apri: ${cancelUrl}</p>
        </td></tr>
        <tr><td style="background:#f4efe8;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9a9590">© 2025 Katia Terruzzi · Arcore, Monza e Brianza</p>
          <p style="margin:4px 0 0;font-size:11px;color:#9a9590">
            <a href="https://wa.me/393485525084" style="color:#4a7d7a;text-decoration:none">WhatsApp</a> &nbsp;·&nbsp;
            <a href="mailto:katiaterruzzi@gmail.com" style="color:#4a7d7a;text-decoration:none">katiaterruzzi@gmail.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

// ── 2. Nuova prenotazione → admin ────────────────────────────
async function sendAdminNewBooking({ first_name, last_name, email, phone, lesson }) {
  const transporter = createTransport();

  await transporter.sendMail({
    from:    `"Katia Terruzzi Pilates" <${GMAIL_USER}>`,
    to:      ADMIN_NOTIFY,
    subject: `📅 Nuova prenotazione — ${first_name} ${last_name} · ${lesson}`,
    html: `
<body style="font-family:Arial,sans-serif;background:#f4efe8;padding:32px 16px;">
  <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;padding:28px 32px;margin:0 auto;">
    <tr><td>
      <h2 style="margin:0 0 20px;font-family:Georgia,serif;font-style:italic;font-weight:400;font-size:22px;color:#2e5c5a">Nuova prenotazione ricevuta</h2>
      <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
        <tr style="border-bottom:1px solid #e8e2d8"><td style="color:#9a9590;width:110px">Nome</td><td style="color:#2c2a26"><strong>${first_name} ${last_name}</strong></td></tr>
        <tr style="border-bottom:1px solid #e8e2d8"><td style="color:#9a9590">Email</td><td><a href="mailto:${email}" style="color:#4a7d7a">${email}</a></td></tr>
        <tr style="border-bottom:1px solid #e8e2d8"><td style="color:#9a9590">Telefono</td><td style="color:#2c2a26">${phone}</td></tr>
        <tr><td style="color:#9a9590">Lezione</td><td style="color:#2c2a26"><strong>${lesson}</strong></td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:12px;color:#9a9590">Vai all'<a href="${SITE}/admin" style="color:#4a7d7a">area gestione</a> per vedere tutti i partecipanti.</p>
    </td></tr>
  </table>
</body>`,
  });
}

// ── 3. Prenotazione annullata → admin ────────────────────────
async function sendAdminCancellation({ first_name, last_name, email, lesson, source }) {
  const transporter = createTransport();
  const byWhom      = source === 'admin' ? 'da te (admin)' : "dall'utente";

  await transporter.sendMail({
    from:    `"Katia Terruzzi Pilates" <${GMAIL_USER}>`,
    to:      ADMIN_NOTIFY,
    subject: `❌ Prenotazione annullata — ${first_name} ${last_name} · ${lesson}`,
    html: `
<body style="font-family:Arial,sans-serif;background:#f4efe8;padding:32px 16px;">
  <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;padding:28px 32px;margin:0 auto;">
    <tr><td>
      <h2 style="margin:0 0 20px;font-family:Georgia,serif;font-style:italic;font-weight:400;font-size:22px;color:#5a3a2a">Prenotazione annullata</h2>
      <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
        <tr style="border-bottom:1px solid #e8e2d8"><td style="color:#9a9590;width:110px">Nome</td><td style="color:#2c2a26"><strong>${first_name} ${last_name}</strong></td></tr>
        <tr style="border-bottom:1px solid #e8e2d8"><td style="color:#9a9590">Email</td><td><a href="mailto:${email}" style="color:#4a7d7a">${email}</a></td></tr>
        <tr style="border-bottom:1px solid #e8e2d8"><td style="color:#9a9590">Lezione</td><td style="color:#2c2a26"><strong>${lesson}</strong></td></tr>
        <tr><td style="color:#9a9590">Annullata</td><td style="color:#2c2a26">${byWhom}</td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:12px;color:#9a9590">Il posto è ora disponibile per altri utenti.</p>
    </td></tr>
  </table>
</body>`,
  });
}

module.exports = {
  sendBookingConfirmation,
  sendAdminNewBooking,
  sendAdminCancellation,
};

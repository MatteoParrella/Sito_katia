// Shared auth helper — file starts with _ so Vercel doesn't expose it as a route
// ADMIN_PASSWORD and ADMIN_SECRET must be set as environment variables on Vercel:
// no defaults are provided, auth fails closed if they are missing.

const crypto = require('crypto');

function getExpectedToken() {
  const password = process.env.ADMIN_PASSWORD;
  const secret   = process.env.ADMIN_SECRET;
  if (!password || !secret) return null;
  return crypto
    .createHmac('sha256', secret)
    .update(password)
    .digest('hex');
}

function checkAuth(req) {
  const expected = getExpectedToken();
  if (!expected) return false;
  const auth  = (req.headers.authorization || '').trim();
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

function unauthorized(res) {
  res.status(401).json({ error: 'Non autorizzato' });
}

module.exports = { checkAuth, getExpectedToken, unauthorized };

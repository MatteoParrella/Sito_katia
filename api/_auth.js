// Shared auth helper — file starts with _ so Vercel doesn't expose it as a route

const crypto = require('crypto');

function getExpectedToken() {
  const password = process.env.ADMIN_PASSWORD || 'katia2025';
  const secret   = process.env.ADMIN_SECRET   || 'katia-admin-secret';
  return crypto
    .createHmac('sha256', secret)
    .update(password)
    .digest('hex');
}

function checkAuth(req) {
  const auth  = (req.headers.authorization || '').trim();
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  return token.length > 0 && token === getExpectedToken();
}

function unauthorized(res) {
  res.status(401).json({ error: 'Non autorizzato' });
}

module.exports = { checkAuth, getExpectedToken, unauthorized };

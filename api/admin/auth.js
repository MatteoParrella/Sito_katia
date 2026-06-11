// POST /api/admin/auth — login with password, get token

const { getExpectedToken } = require('../_auth');
const { applyCors, rateLimit } = require('../_http');

module.exports = async (req, res) => {
  applyCors(req, res, { methods: 'POST, OPTIONS' });

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  // Max 5 login attempts per IP per 15 minutes
  if (!rateLimit(req, res, { key: 'admin-auth', max: 5, windowMs: 15 * 60 * 1000 })) return;

  const { password } = req.body || {};

  if (!password) {
    return res.status(400).json({ error: 'Password mancante' });
  }

  const expected = process.env.ADMIN_PASSWORD;
  const token    = getExpectedToken();

  if (!expected || !token) {
    console.error('ADMIN_PASSWORD / ADMIN_SECRET not configured');
    return res.status(500).json({ error: 'Configurazione mancante' });
  }

  if (password !== expected) {
    return res.status(401).json({ error: 'Password errata' });
  }

  return res.status(200).json({ token });
};

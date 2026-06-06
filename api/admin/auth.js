// POST /api/admin/auth — login with password, get token

const { getExpectedToken } = require('../_auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const { password } = req.body || {};

  if (!password) {
    return res.status(400).json({ error: 'Password mancante' });
  }

  const expected = process.env.ADMIN_PASSWORD || 'katia2025';

  if (password !== expected) {
    return res.status(401).json({ error: 'Password errata' });
  }

  return res.status(200).json({ token: getExpectedToken() });
};

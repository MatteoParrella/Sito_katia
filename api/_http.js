// Shared HTTP helpers: restricted CORS + in-memory rate limiting
// File starts with _ so Vercel doesn't expose it as a route

const SITE_ORIGIN = (process.env.SITE_URL || 'https://sito-katia.vercel.app').replace(/\/$/, '');

function applyCors(req, res, { methods, headers = 'Content-Type' }) {
  res.setHeader('Access-Control-Allow-Origin', SITE_ORIGIN);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', headers);
}

// In-memory sliding window per serverless instance. Not a distributed limiter,
// but enough to stop naive brute force and form spam at this traffic level.
const buckets = new Map();

function rateLimit(req, res, { key, max, windowMs }) {
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
          || req.socket?.remoteAddress || 'unknown';
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();
  const hits = (buckets.get(bucketKey) || []).filter(t => now - t < windowMs);

  if (hits.length >= max) {
    res.status(429).json({ error: 'Troppe richieste. Riprova tra qualche minuto.' });
    return false;
  }

  hits.push(now);
  buckets.set(bucketKey, hits);

  // Opportunistic cleanup so the map doesn't grow unbounded
  if (buckets.size > 1000) {
    for (const [k, v] of buckets) {
      if (v.every(t => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return true;
}

// Escape user-provided strings before interpolating into email HTML
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = { applyCors, rateLimit, escapeHtml };
